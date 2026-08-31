"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartWrapper } from "@/components/shared/chart-wrapper";
import type { ScoreTrendPoint } from "@/features/dashboard/types";

export function ScoreTrendChart({ data }: { data: ScoreTrendPoint[] }) {
  return (
    <ChartWrapper title="Average investment score" description="Across all completed board sessions" height={260}>
      <AreaChart data={data.length ? data : [{ month: "—", score: 0 }]} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--brass))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--brass))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--surface-overlay))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 6,
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
        <Area type="monotone" dataKey="score" stroke="hsl(var(--brass))" strokeWidth={2} fill="url(#scoreFill)" />
      </AreaChart>
    </ChartWrapper>
  );
}
