"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { ChartWrapper } from "@/components/shared/chart-wrapper";
import type { TrendPoint } from "@/features/market-research/types";

export function MarketTrendChart({ data }: { data: TrendPoint[] }) {
  const span = data.length ? `, ${data[0]!.year}–${data[data.length - 1]!.year}` : "";
  return (
    <ChartWrapper title="Market growth" description={`Total addressable market, $M${span}`} height={300}>
      <LineChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="year" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--surface-overlay))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 }}
        />
        <Line type="monotone" dataKey="marketSize" stroke="hsl(var(--signal))" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ChartWrapper>
  );
}
