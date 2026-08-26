/**
 * Grounding for the evidence-facing seats.
 *
 * The Research and VC agents are told in their personas to check claims
 * against outside sources. Before this file existed they had none, so they
 * invented market sizes with total confidence — the single most dishonest
 * thing the product did.
 *
 * ## Why this is a pre-fetch rather than model-driven tool calling
 *
 * The obvious design is to expose a `search` tool and let the model decide
 * when to call it. It is also the wrong one here. Debate turns run on a small
 * model (`GROQ_DEBATE_MODEL`), chosen because turns are the bulk of the traffic;
 * small models emit malformed or unnecessary tool calls often enough that
 * every turn would need a repair path, and a failed tool call mid-debate is a
 * dead turn the founder watches happen.
 *
 * Instead the *orchestrator* decides, deterministically: this seat, on this
 * topic, gets evidence. Same outcome, no parsing risk, and the decision is
 * inspectable in code rather than buried in a model's whim. That is a
 * deliberate trade of flexibility for reliability, and worth defending as
 * such.
 *
 * Server-only.
 */

import { getSearchProvider } from "@/lib/research/provider";
import type { DebateTopic } from "@/lib/ai/topics";

export interface ResearchFinding {
  /** The retrieved statement, trimmed to something quotable in a meeting. */
  claim: string;
  /** Hostname, which is what an executive would actually say out loud. */
  source: string;
  url: string;
}

export interface ResearchBrief {
  findings: ResearchFinding[];
  /** Queries actually issued — surfaced in the report's source list. */
  queries: string[];
  /** False when no provider is configured, so prompts can say so honestly. */
  configured: boolean;
}

/**
 * Seats that are supposed to bring outside evidence.
 *
 * Kept narrow on purpose. Every additional seat is another search per turn
 * against a 1,000/month free tier, and a CTO citing a market-size report adds
 * nothing a CTO should be saying.
 */
const EVIDENCE_SEATS = new Set(["research", "vc"]);

/** Topics where an outside number exists to be checked at all. */
const EVIDENCE_TOPICS = new Set<DebateTopic>(["market", "financial"]);

/** Hits below this provider score are noise and cost prompt budget. */
const MIN_SCORE = 0.4;

const MAX_FINDINGS = 3;

/**
 * Per-request memo, not a session cache.
 *
 * This used to be a module-level `Map` that also fed the report's citation
 * list, which broke on serverless: the finalize call runs in a different
 * instance from the debate turns, so it read an empty map and the Sources
 * section silently disappeared in production. Durable storage now lives in
 * `lib/server/research-store.ts`; this only avoids re-issuing an identical
 * query inside a single request.
 */
const memo = new Map<string, ResearchFinding[]>();

export interface ResearchRequest {
  executiveId: string;
  topic: DebateTopic;
  startupName: string;
  industry?: string;
  oneLiner?: string;
  /** Findings already stored for this meeting, so a repeat query costs nothing. */
  known?: ResearchFinding[];
}

function buildQuery(request: ResearchRequest): string {
  const sector = request.industry?.trim() || request.oneLiner?.trim() || request.startupName;
  return request.topic === "financial"
    ? `${sector} startup funding rounds valuation benchmarks 2026`
    : `${sector} market size competitors 2026`;
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source";
  }
}

/**
 * Returns evidence for this turn, or null when this seat/topic combination
 * should not trigger a lookup at all.
 *
 * A non-null brief with zero findings is meaningful and different from null:
 * it tells the prompt builder to explicitly instruct the executive to label
 * their numbers as estimates. Null means the question never arose.
 */
export async function researchBriefFor(request: ResearchRequest): Promise<ResearchBrief | null> {
  if (!EVIDENCE_SEATS.has(request.executiveId)) return null;
  if (!EVIDENCE_TOPICS.has(request.topic)) return null;

  const provider = getSearchProvider();
  const query = buildQuery(request);

  if (!provider) {
    return { findings: [], queries: [query], configured: false };
  }

  // Already retrieved earlier in this meeting — persisted, so this survives
  // a cold start that the in-process memo would not.
  if (request.known?.length) {
    return { findings: request.known.slice(0, MAX_FINDINGS), queries: [query], configured: true };
  }

  const memoised = memo.get(query);
  if (memoised) return { findings: memoised, queries: [query], configured: true };

  const results = await provider.search(query, { maxResults: 5 });
  const findings = results
    .filter((result) => result.score >= MIN_SCORE)
    .slice(0, MAX_FINDINGS)
    .map<ResearchFinding>((result) => ({
      claim: result.snippet,
      source: hostOf(result.url),
      url: result.url,
    }));

  memo.set(query, findings);
  return { findings, queries: [query], configured: true };
}

/** Clears the per-request memo. Exposed for tests. */
export function __clearResearchCache() {
  memo.clear();
}
