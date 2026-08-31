import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** Tighter padding for use inside a chart or card slot rather than a full page. */
  compact?: boolean;
  className?: string;
}

/**
 * An empty screen is an invitation to act, not an apology. Always pair a
 * concrete next step (via `action`) where one exists — a bare "no data"
 * message is a last resort, not the default.
 */
export function EmptyState({ icon: Icon, title, description, action, compact, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border text-center",
        compact ? "p-6" : "p-12",
        className,
      )}
    >
      {Icon && (
        <span className="flex size-11 items-center justify-center rounded-full border bg-surface text-muted-foreground">
          <Icon className="size-5" />
        </span>
      )}
      <div className="space-y-1">
        <p className="font-medium text-foreground">{title}</p>
        {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
