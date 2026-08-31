"use client";

import { SectionHeader } from "@/components/shared/section-header";
import { ScoreCard } from "@/components/shared/score-card";
import { BoardroomRadarChart } from "@/components/shared/radar-chart";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { HealthFlags } from "@/features/startup-health/components/health-flags";
import { useWorkspace } from "@/hooks/use-workspace";
import type { HealthDimension, HealthFlag } from "@/features/startup-health/types";

type StartupHealthData = {
  healthScore?: number;
  healthDimensions?: HealthDimension[];
  healthFlags?: HealthFlag[];
};

function verdictFor(score: number, flags: HealthFlag[]) {
  const critical = flags.filter((flag) => flag.severity === "critical").length;
  if (critical) return `${critical} critical flag${critical > 1 ? "s" : ""} to resolve`;
  const warnings = flags.filter((flag) => flag.severity === "warning").length;
  if (warnings) return `Stable, ${warnings} watch-item${warnings > 1 ? "s" : ""}`;
  return score >= 70 ? "Healthy across every dimension" : "No flags raised";
}

export function StartupHealthContent() {
  const { data, error, loading } = useWorkspace();
  const health = (data?.workspace.startupHealth ?? {}) as StartupHealthData;

  if (loading) return <Skeleton className="h-96 w-full" />;
  if (error) return <ErrorState description={error} onRetry={() => window.location.reload()} />;

  const score = health.healthScore ?? 0;
  const dimensions = health.healthDimensions ?? [];
  const flags = health.healthFlags ?? [];

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Intelligence"
        title="Startup health"
        description="A rolling snapshot the board updates after every session."
      />

      <div className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <Card className="flex flex-col items-center justify-center gap-3 p-6">
          <ScoreCard label="Overall health" score={score} verdict={verdictFor(score, flags)} size="lg" tone="signal" />
        </Card>
        <BoardroomRadarChart
          title="Health by dimension"
          data={dimensions}
          series={[{ key: "score", label: "Current" }]}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Flags</h3>
        <HealthFlags flags={flags} />
      </div>
    </div>
  );
}
