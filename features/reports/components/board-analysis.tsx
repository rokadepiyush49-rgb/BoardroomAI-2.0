import { ExternalLink, Quote, TriangleAlert } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReportDetail } from "@/features/reports/types";

/**
 * The analytical appendix: where the board agreed, where it split, and what
 * it is actually confident about.
 *
 * Every section renders only when its data is present. Reports generated
 * before these fields existed — and reports whose second generation call
 * failed — still render the rest of the page rather than crashing it, which
 * is the whole reason the fields are optional on `ReportDetail`.
 */

const priorityTone = {
  Immediate: "destructive",
  "Near-term": "warning",
  Later: "muted",
} as const;

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-mono text-xs font-medium text-foreground">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-elevated">
        <div
          className={cn(
            "h-full rounded-full",
            // Confidence is about certainty, not quality — low confidence is a
            // warning to the reader, not a bad score for the company.
            value >= 70 ? "bg-success" : value >= 45 ? "bg-warning" : "bg-destructive",
          )}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

export function BoardAnalysis({ report }: { report: ReportDetail }) {
  const {
    confidence,
    investmentReadiness,
    consensus,
    disagreements,
    mostConvincingArgument,
    weakestFounderAnswer,
    riskTimeline,
    nextSteps,
    roadmap,
    sources,
  } = report;

  const hasAnything =
    confidence ||
    investmentReadiness !== undefined ||
    consensus?.length ||
    disagreements?.length ||
    mostConvincingArgument ||
    weakestFounderAnswer ||
    riskTimeline?.length ||
    nextSteps?.length ||
    roadmap?.length ||
    sources?.length;

  if (!hasAnything) return null;

  return (
    <div className="space-y-6">
      {(confidence || investmentReadiness !== undefined) && (
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {investmentReadiness !== undefined && (
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Investment readiness</CardTitle>
              </CardHeader>
              <p className="mt-3 font-mono text-4xl font-semibold text-foreground">
                {investmentReadiness}
                <span className="ml-1 text-base font-normal text-muted-foreground">/ 100</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                How ready this company is to take money right now — separate from how good the
                board thinks it is. A strong company with no data room still scores low here.
              </p>
            </Card>
          )}

          {confidence && (
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Board confidence</CardTitle>
              </CardHeader>
              <p className="mt-1 text-xs text-muted-foreground">
                How certain the board is in its own judgement, by area.
              </p>
              <CardContent className="mt-4 grid gap-3 p-0 sm:grid-cols-2">
                <ConfidenceBar label="Overall" value={confidence.overall} />
                <ConfidenceBar label="Market" value={confidence.market} />
                <ConfidenceBar label="Technology" value={confidence.technology} />
                <ConfidenceBar label="Financial" value={confidence.financial} />
                <ConfidenceBar label="Founder" value={confidence.founder} />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {(consensus?.length || disagreements?.length) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {consensus?.length ? (
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Where the board agreed</CardTitle>
              </CardHeader>
              <ul className="mt-4 space-y-3">
                {consensus.map((point) => (
                  <li key={point.point}>
                    <p className="text-sm text-foreground/90">{point.point}</p>
                    {point.executives.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">{point.executives.join(", ")}</p>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}

          {disagreements?.length ? (
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Where the board split</CardTitle>
              </CardHeader>
              <p className="mt-1 text-xs text-muted-foreground">
                Unresolved disagreement is signal, not noise — these are the questions the board
                could not settle.
              </p>
              <ul className="mt-4 space-y-4">
                {disagreements.map((item) => (
                  <li key={item.topic}>
                    <p className="text-sm font-medium text-foreground">{item.topic}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {[item.positionA, item.positionB].map((side, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-border/60 bg-surface-elevated/40 p-3"
                        >
                          <p className="text-xs leading-relaxed text-foreground/85">{side.summary}</p>
                          {side.executives.length > 0 && (
                            <p className="mt-1.5 text-[0.7rem] text-muted-foreground">
                              {side.executives.join(", ")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      )}

      {(mostConvincingArgument || weakestFounderAnswer) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {mostConvincingArgument && (
            <Card className="p-6">
              <CardHeader className="flex-row items-center gap-2 p-0">
                <Quote className="size-4 text-signal" />
                <CardTitle className="text-base">Most convincing argument</CardTitle>
              </CardHeader>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                {mostConvincingArgument.argument}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                — {mostConvincingArgument.executive}
              </p>
            </Card>
          )}

          {weakestFounderAnswer && (
            <Card className="p-6">
              <CardHeader className="flex-row items-center gap-2 p-0">
                <TriangleAlert className="size-4 text-warning" />
                <CardTitle className="text-base">Weakest founder answer</CardTitle>
              </CardHeader>
              <p className="mt-3 text-sm font-medium text-foreground/90">
                {weakestFounderAnswer.question}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {weakestFounderAnswer.whyWeak}
              </p>
            </Card>
          )}
        </div>
      )}

      {riskTimeline?.length ? (
        <Card className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-base">Risk timeline</CardTitle>
          </CardHeader>
          <p className="mt-1 text-xs text-muted-foreground">
            When each risk becomes dangerous, not just whether it exists.
          </p>
          <ol className="mt-4 space-y-0">
            {riskTimeline.map((entry, index) => (
              <li key={`${entry.horizon}-${entry.risk}`} className="flex gap-4">
                {/* Rail + node, so the horizons read as a sequence rather than
                    a list that happens to be sorted. */}
                <div className="flex flex-col items-center">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-signal" />
                  {index < riskTimeline.length - 1 && <span className="w-px flex-1 bg-border" />}
                </div>
                <div className="pb-5">
                  <p className="text-xs font-medium text-signal">
                    {entry.horizon}
                  </p>
                  <p className="mt-0.5 text-sm text-foreground/90">{entry.risk}</p>
                </div>
              </li>
            ))}
          </ol>
        </Card>
      ) : null}

      {(nextSteps?.length || roadmap?.length) && (
        <div className="grid gap-6 lg:grid-cols-2">
          {nextSteps?.length ? (
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Recommended next steps</CardTitle>
              </CardHeader>
              <ol className="mt-4 space-y-2.5">
                {nextSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm text-foreground/90">
                    <span className="font-mono text-xs text-muted-foreground">{index + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </Card>
          ) : null}

          {roadmap?.length ? (
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-base">Improvement roadmap</CardTitle>
              </CardHeader>
              <p className="mt-1 text-xs text-muted-foreground">
                What would actually move the board&apos;s verdict.
              </p>
              <ul className="mt-4 space-y-3">
                {roadmap.map((step) => (
                  <li key={step.title}>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{step.title}</p>
                      <Badge tone={priorityTone[step.priority]}>{step.priority}</Badge>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.detail}</p>
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </div>
      )}

      {sources?.length ? (
        <Card className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-base">Sources</CardTitle>
          </CardHeader>
          <p className="mt-1 text-xs text-muted-foreground">
            Retrieved by the board during the session. These are real lookups — the model is never
            asked to produce a URL, so nothing here can be fabricated.
          </p>
          <ul className="mt-4 space-y-2">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-signal hover:underline"
                >
                  {source.title}
                  <ExternalLink className="size-3" />
                </a>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
    </div>
  );
}
