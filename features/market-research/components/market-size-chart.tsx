"use client";

import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import { ChartWrapper } from "@/components/shared/chart-wrapper";
import { chartSeriesOrder } from "@/constants/design-tokens";
import type { MarketSizeSlice } from "@/features/market-research/types";

export function MarketSizeChart({ data }: { data: MarketSizeSlice[] }) {
  return (
    <ChartWrapper title="Market sizing" description="TAM / SAM / SOM, in $M" height={300}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={2}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={chartSeriesOrder[index % chartSeriesOrder.length]} />
          ))}
        </Pie>
        <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--surface-overlay))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 }}
          formatter={(value) => [`$${Number(value ?? 0)}M`, ""]}
        />
      </PieChart>
    </ChartWrapper>
  );
}
