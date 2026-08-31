import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreCard } from "@/components/shared/score-card";
import type { ReportSummary } from "@/features/reports/types";

const verdictTone = { "Strong buy": "success", Conditional: "warning", Pass: "destructive" } as const;

export function ReportCard({ report }: { report: ReportSummary }) {
  return (
    <Link href={`/reports/${report.id}`}>
      <Card interactive className="flex h-full flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6">
        <ScoreCard label="Score" score={report.investmentScore} size="sm" tone="brass" className="shrink-0" />
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground">{report.startupName}</h3>
            <Badge tone={verdictTone[report.verdict]}>{report.verdict}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{report.oneLiner}</p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-muted-foreground">
            <span>{report.industry}</span>
            <span aria-hidden>·</span>
            <span>{report.generatedAt}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
