"use client";

import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  Tooltip,
} from "recharts";
import { ChartWrapper } from "@/components/shared/chart-wrapper";
import { chartSeriesOrder } from "@/constants/design-tokens";

export interface RadarSeriesDatum {
  /** The evaluated dimension, e.g. "Market size", "Team", "Moat", "Timing". */
  dimension: string;
  [seriesKey: string]: string | number;
}

export interface RadarSeriesConfig {
  key: string;
  label: string;
}

export interface BoardroomRadarChartProps {
  title?: string;
  description?: string;
  data: RadarSeriesDatum[];
  series: RadarSeriesConfig[];
  height?: number;
  isLoading?: boolean;
  className?: string;
}

/**
 * Used everywhere the board evaluates a startup across several weighted
 * dimensions at once (SWOT strength scoring, executive consensus per
 * criterion, competitor comparison). One series per executive/competitor,
 * plotted on a shared 0–100 scale.
 */
export function BoardroomRadarChart({
  title = "Evaluation by dimension",
  description,
  data,
  series,
  height = 320,
  isLoading,
  className,
}: BoardroomRadarChartProps) {
  return (
    <ChartWrapper
      title={title}
      description={description}
      height={height}
      isLoading={isLoading}
      isEmpty={data.length === 0}
      className={className}
    >
      <RechartsRadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="dimension" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
        <PolarRadiusAxis
          angle={90}
          domain={[0, 100]}
          tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
          axisLine={false}
        />
        {series.map((s, index) => {
          const color = chartSeriesOrder[index % chartSeriesOrder.length] as string;
          return (
            <Radar
              key={s.key}
              name={s.label}
              dataKey={s.key}
              stroke={color}
              fill={color}
              fillOpacity={0.18}
              strokeWidth={2}
            />
          );
        })}
        <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
        <Tooltip
          contentStyle={{
            background: "hsl(var(--surface-overlay))",
            border: "1px solid hsl(var(--border))",
            borderRadius: 6,
            fontSize: 12,
          }}
          labelStyle={{ color: "hsl(var(--foreground))" }}
        />
      </RechartsRadarChart>
    </ChartWrapper>
  );
}
