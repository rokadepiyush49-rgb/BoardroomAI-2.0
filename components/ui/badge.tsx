import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Badges are pills — one of only two places the 9999px radius is allowed
 * (the other being marketing-scale CTAs). Set in caption type, 12px/400.
 *
 * The tone ladder is deliberately near-monochromatic: `brass` is the
 * default neutral chip (canvas fill, hairline ring, ink label), `signal`
 * is the one solid-colour chip, and the semantic tones stay tinted rather
 * than filled so a dashboard full of badges never turns into confetti.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-4 [&_svg]:size-3",
  {
    variants: {
      tone: {
        brass: "border-border bg-surface text-foreground",
        // The solid brand-blue chip — category labels, "live" markers, and
        // anything AI-originated.
        signal: "border-transparent bg-signal text-signal-foreground",
        success: "border-success/25 bg-success/10 text-success",
        warning: "border-warning/30 bg-warning/15 text-[hsl(38_91%_38%)] dark:text-warning",
        destructive: "border-destructive/25 bg-destructive/10 text-destructive",
        muted: "border-transparent bg-muted text-muted-foreground",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      tone: "muted",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Renders a small pulsing dot before the label — for "live" states. */
  pulse?: boolean;
}

function Badge({ className, tone, pulse, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, className }))} {...props}>
      {pulse && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-current" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
