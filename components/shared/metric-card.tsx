import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TrendValue } from "@/types/common";

export interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: TrendValue;
  icon?: LucideIcon;
  /** Small sparkline or chart element rendered under the value — composed in by the caller. */
  footer?: React.ReactNode;
  className?: string;
}

const trendStyles: Record<TrendValue["direction"], { icon: LucideIcon; className: string }> = {
  up: { icon: ArrowUpRight, className: "text-success bg-success/10" },
  down: { icon: ArrowDownRight, className: "text-destructive bg-destructive/10" },
  flat: { icon: Minus, className: "text-muted-foreground bg-muted" },
};

/**
 * The single most-reused component in the dashboard: a KPI figure, its
 * trend vs. a comparison period, and an optional icon/footer slot for a
 * sparkline. Figures render in the mono face so they read unambiguously as
 * data, not editorial copy.
 */
export function MetricCard({ label, value, trend, icon: Icon, footer, className }: MetricCardProps) {
  const trendConfig = trend ? trendStyles[trend.direction] : null;
  const TrendIcon = trendConfig?.icon;

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground">{label}</p>
        {Icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-md border text-muted-foreground">
            <Icon className="size-4" />
          </span>
        )}
      </div>

      <p className="mt-2.5 text-3xl font-semibold tabular-nums text-foreground">{value}</p>

      {trend && trendConfig && TrendIcon && (
        <div className="mt-2 flex items-center gap-1.5">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium",
              trendConfig.className,
            )}
          >
            <TrendIcon className="size-3" />
            {Math.abs(trend.value)}%
          </span>
          {trend.label && <span className="text-xs text-muted-soft">{trend.label}</span>}
        </div>
      )}

      {footer && <div className="mt-4">{footer}</div>}
    </Card>
  );
}
