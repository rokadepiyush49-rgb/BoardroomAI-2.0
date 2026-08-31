import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials, cn } from "@/lib/utils";
import type { ExecutiveVoteDetail } from "@/features/reports/types";

/**
 * How each executive voted, and what it would take to change their mind.
 *
 * This is the section that makes the report look like a board's output
 * rather than a summariser's. The aggregate score above it says *what* the
 * board concluded; this says *who* concluded it, how sure they were, and the
 * specific condition each of them attached — which is the part a founder can
 * actually act on.
 *
 * Renders nothing when there are no votes, which is the case for reports
 * generated before the richer vote columns existed.
 */

const voteTone = { yes: "success", no: "destructive", conditional: "warning" } as const;
const voteLabel = { yes: "Yes", no: "No", conditional: "Conditional" } as const;

/** Confidence colour tracks certainty, not approval — a confident "no" is green here. */
function confidenceColor(value: number) {
  if (value >= 70) return "bg-success";
  if (value >= 45) return "bg-warning";
  return "bg-destructive";
}

function Field({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="min-w-0">
      <p className="text-xs text-muted-soft">{label}</p>
      <p className="mt-0.5 break-words text-sm text-foreground/90">{value}</p>
    </div>
  );
}

export function BoardVotes({ votes }: { votes?: ExecutiveVoteDetail[] }) {
  if (!votes?.length) return null;

  const cast = votes.length;
  const yes = votes.filter((vote) => vote.vote === "yes").length;
  const conditional = votes.filter((vote) => vote.vote === "conditional").length;
  const no = votes.filter((vote) => vote.vote === "no").length;
  const averageConfidence = Math.round(
    votes.reduce((sum, vote) => sum + vote.confidence, 0) / Math.max(1, cast),
  );

  // A split board that is individually confident means something very
  // different from a split board that is collectively unsure, and the
  // headline score cannot distinguish them. This line can.
  const spread = yes > 0 && no > 0;

  return (
    <Card className="p-6">
      <CardHeader className="p-0">
        <CardTitle className="text-base">How the board voted</CardTitle>
      </CardHeader>
      <p className="mt-1 text-sm text-muted-foreground">
        {yes} yes · {conditional} conditional · {no} no — average confidence {averageConfidence}
        {spread
          ? ". The board did not reach agreement, which is itself a finding."
          : "."}
      </p>

      <ul className="mt-5 space-y-3">
        {votes.map((vote) => (
          <li
            key={vote.executiveId}
            className="rounded-xl border border-border/70 bg-surface-elevated/30 p-4"
          >
            <div className="flex flex-wrap items-center gap-3">
              <Avatar size="sm" className="shrink-0">
                <AvatarFallback className="text-xs">{getInitials(vote.executiveName)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{vote.executiveName}</p>
                <p className="truncate text-xs text-muted-foreground">{vote.role}</p>
              </div>
              <Badge tone={voteTone[vote.vote]}>{voteLabel[vote.vote]}</Badge>
            </div>

            {vote.rationale && (
              <p className="mt-3 text-sm leading-relaxed text-foreground/85">{vote.rationale}</p>
            )}

            <div className="mt-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs text-muted-soft">
                  Confidence
                </span>
                <span className="font-mono text-xs font-medium text-foreground">
                  {vote.confidence}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface">
                <div
                  className={cn("h-full rounded-full", confidenceColor(vote.confidence))}
                  style={{ width: `${Math.min(100, Math.max(0, vote.confidence))}%` }}
                />
              </div>
            </div>

            {/* Two columns at width, stacked on mobile — these are short
                labelled values, not prose, so a grid reads faster than a list. */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Biggest risk" value={vote.biggestRisk} />
              <Field label="Biggest strength" value={vote.biggestStrength} />
              <Field label="Required milestone" value={vote.requiredMilestone} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Cheque" value={vote.chequeSize} />
                <Field label="Horizon" value={vote.returnHorizon} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
