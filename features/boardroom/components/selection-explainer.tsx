"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOPIC_LABEL } from "@/lib/ai/topics";
import { SPEAKER_WEIGHTS } from "@/lib/ai/debate-policy";
import type { SpeakerSelectionInfo } from "@/types/api";

/**
 * Why this executive is speaking.
 *
 * The single most important thing this screen can show. Without it the board
 * looks like a rota with better prose — the scoring that picked this speaker
 * out of eight candidates happens server-side and is otherwise invisible.
 * The ranking already arrives with every turn; this just stops throwing it
 * away.
 *
 * Collapsed by default: during a live session the founder is reading the
 * argument, not auditing the scheduler. It expands for anyone who asks how
 * the turn was decided — which, at a demo, is everyone.
 */

interface SelectionExplainerProps {
  selection: SpeakerSelectionInfo | null;
  /** Display names by executive id, so the ranking reads as people. */
  identities: Record<string, { name: string; role: string }>;
}

/** Which component contributed most to this executive's score. */
function dominantReason(entry: SpeakerSelectionInfo["ranking"][number]): string {
  const contributions: Array<[label: string, value: number]> = [
    ["topic relevance", SPEAKER_WEIGHTS.relevance * entry.relevance],
    ["turn balance", SPEAKER_WEIGHTS.fairness * entry.fairness],
    ["named by you", SPEAKER_WEIGHTS.founderMention * entry.founderMention],
    ["answering a challenge", SPEAKER_WEIGHTS.disagreement * entry.disagreement],
  ];
  return contributions.sort((a, b) => b[1] - a[1])[0]![0];
}

export function SelectionExplainer({ selection, identities }: SelectionExplainerProps) {
  const [open, setOpen] = useState(false);

  if (!selection?.ranking.length) return null;

  const [winner, ...rest] = selection.ranking;
  const winnerName = identities[winner!.executiveId]?.name ?? winner!.executiveId;

  // Bars are relative to the leader so the gap between first and second is
  // legible — absolute scores cluster too tightly to compare by eye.
  const scale = Math.max(0.01, ...selection.ranking.map((e) => e.score));
  const topicLabel =
    selection.topic !== "general"
      ? (TOPIC_LABEL[selection.topic as keyof typeof TOPIC_LABEL] ?? null)
      : null;

  return (
    <div className="rounded-lg border border-border/60 bg-surface-elevated/30">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-3 py-2 text-left"
      >
        <span className="min-w-0 flex-1 text-xs text-muted-foreground">
          <span className="text-foreground/80">{winnerName}</span> has the floor —{" "}
          {dominantReason(winner!)}
          {topicLabel ? ` on ${topicLabel}` : ""}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="border-t border-border/60 px-3 py-3">
          <p className="text-xs text-muted-soft">
            Speaker scoring · this turn
          </p>

          <ul className="mt-2 space-y-1.5">
            {[winner!, ...rest].map((entry, index) => {
              const name = identities[entry.executiveId]?.name ?? entry.executiveId;
              return (
                <li key={entry.executiveId} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "w-4 shrink-0 font-mono",
                      index === 0 ? "text-signal" : "text-muted-foreground",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={cn(
                      "w-28 shrink-0 truncate",
                      index === 0 ? "font-medium text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {name}
                  </span>
                  {/* Bar is relative to the winner, so the gap between first
                      and second is legible at a glance — absolute scores
                      cluster too tightly to compare by eye. */}
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
                    <span
                      className={cn(
                        "block h-full rounded-full",
                        index === 0 ? "bg-signal" : "bg-border-strong",
                      )}
                      style={{
                        // Clamped: a heavy recency penalty can push a score
                        // negative, which would otherwise render inverted.
                        width: `${Math.min(100, Math.max(2, Math.round((entry.score / scale) * 100)))}%`,
                      }}
                    />
                  </span>
                  <span className="w-9 shrink-0 text-right font-mono text-muted-foreground">
                    {entry.score.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[0.7rem] text-muted-foreground sm:grid-cols-4">
            <span>relevance {winner!.relevance.toFixed(2)}</span>
            <span>fairness {winner!.fairness.toFixed(2)}</span>
            <span>mention {winner!.founderMention.toFixed(2)}</span>
            <span>challenge {winner!.disagreement.toFixed(2)}</span>
          </div>

          <p className="mt-3 text-[0.7rem] leading-relaxed text-muted-foreground">
            Deterministic scoring, not the model&apos;s choice — {SPEAKER_WEIGHTS.relevance} relevance
            + {SPEAKER_WEIGHTS.fairness} fairness + {SPEAKER_WEIGHTS.founderMention} direct mention
            + {SPEAKER_WEIGHTS.disagreement} unanswered challenge + {SPEAKER_WEIGHTS.priority} seat
            priority. The same code runs in this browser and on the server.
          </p>
        </div>
      )}
    </div>
  );
}
