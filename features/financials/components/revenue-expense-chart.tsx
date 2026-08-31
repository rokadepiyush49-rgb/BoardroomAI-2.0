"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartWrapper } from "@/components/shared/chart-wrapper";

type RevenueExpensePoint = { month: string; revenue: number; expense: number };

export function RevenueExpenseChart({ data }: { data: RevenueExpensePoint[] }) {
  return (
    <ChartWrapper title="Revenue vs. expense" description="Monthly, in $K" height={300}>
      <AreaChart data={data} margin={{ left: -16, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.35} />
            <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity={0.25} />
            <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "hsl(var(--surface-overlay))", border: "1px solid hsl(var(--border))", borderRadius: 6, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
        <Area type="monotone" name="Revenue" dataKey="revenue" stroke="hsl(var(--success))" strokeWidth={2} fill="url(#revFill)" />
        <Area type="monotone" name="Expense" dataKey="expense" stroke="hsl(var(--destructive))" strokeWidth={2} fill="url(#expFill)" />
      </AreaChart>
    </ChartWrapper>
  );
}
