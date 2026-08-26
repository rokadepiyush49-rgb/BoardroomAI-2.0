/**
 * Server-only env access. Import `serverEnv` instead of reading
 * `process.env` directly in route handlers or server-side lib code, so a
 * missing variable fails immediately with a clear message instead of
 * surfacing as a confusing downstream error (e.g. a 401 from the AI
 * provider three files away from where the key was actually missing).
 *
 * This file must never be imported from a Client Component — it will
 * throw at import time if required variables are absent, which is the
 * point, but that means it belongs in route handlers / `lib/server`
 * only.
 */

/**
 * A declared-but-blank variable (`GROQ_MODEL=` in a copied `.env.example`)
 * is the same as an absent one. Returning `""` here instead of `undefined`
 * defeats every `??` fallback downstream, which is how a blank model name
 * once produced a 404 against a provider's model path.
 */
function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value ? value : undefined;
}

function requireEnv(name: string): string {
  const value = readEnv(name);
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env.local and fill it in.`,
    );
  }
  return value;
}

function optionalEnv(name: string): string | undefined {
  return readEnv(name);
}

/**
 * Default model for every executive persona and every generated deliverable.
 * Chosen for breadth of availability across Groq accounts rather than raw
 * capability — override with `GROQ_MODEL` to pin something else.
 *
 * Groq retires models, and a retired one comes back as a 404 ("does not
 * exist or you do not have access to it") on every call, not as a warning.
 * `llama-3.3-70b-versatile` lived here until it was decommissioned. Check
 * the id against `GET https://api.groq.com/openai/v1/models` before pinning
 * a replacement — that list is per-account and authoritative.
 */
const DEFAULT_GROQ_MODEL = "openai/gpt-oss-120b";

/**
 * Debate turns are the bulk of a session's traffic — one call per executive
 * per round, versus two calls total for the write-up. They are also the
 * easiest work in the app: a three-sentence in-character reaction. Running
 * them on a small model cuts the dominant cost and, because Groq meters
 * rate limits per model, moves that traffic off the same TPM bucket the
 * verdict and deliverables depend on.
 */
const DEFAULT_GROQ_DEBATE_MODEL = "openai/gpt-oss-20b";

export const serverEnv = {
  /** Groq API key powering every AI executive persona. Get one at https://console.groq.com/keys */
  get groqApiKey() {
    return requireEnv("GROQ_API_KEY");
  },
  /** Override to pin a different Groq model without touching code. */
  get groqModel() {
    return optionalEnv("GROQ_MODEL") ?? DEFAULT_GROQ_MODEL;
  },
  /**
   * Model for spoken debate turns. Falls back to `GROQ_MODEL` when set, so
   * pinning a single model still works the way it always did.
   */
  get groqDebateModel() {
    return optionalEnv("GROQ_DEBATE_MODEL") ?? optionalEnv("GROQ_MODEL") ?? DEFAULT_GROQ_DEBATE_MODEL;
  },
  /**
   * Optional web-search key for the evidence-facing seats. Absent, the board
   * still runs — the Research and VC agents are told to label every figure as
   * their own estimate instead of citing a source they do not have.
   * Free tier: 1,000 searches a month at https://tavily.com
   */
  get tavilyApiKey() {
    return optionalEnv("TAVILY_API_KEY");
  },
  /** Optional: only needed if you add file/deck uploads via an object store. */
  get blobReadWriteToken() {
    return optionalEnv("BLOB_READ_WRITE_TOKEN");
  },
} as const;

/** True when the board can retrieve real external data rather than estimate. */
export function isResearchConfigured() {
  return Boolean(readEnv("TAVILY_API_KEY"));
}

/**
 * Cheap, non-throwing check for callers that must degrade gracefully
 * rather than fail — `/api/health`, or a debate turn that should return a
 * clear "AI not configured" error instead of a 500.
 */
export function isAiConfigured() {
  return Boolean(readEnv("GROQ_API_KEY"));
}
