import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Two radius scales coexist deliberately in this system and must never be
 * conflated:
 *
 * - `shape="default"` → 6px. Every nav button and in-page action button.
 * - `shape="pill"`    → 9999px. Reserved for marketing-scale CTAs (the hero
 *   pair, the closing banner) and badge pills.
 *
 * Applying pill geometry to an in-app action button, or 6px to a marketing
 * CTA, breaks the system's internal logic — so the choice is an explicit
 * prop rather than something a caller patches in via `className`.
 */
const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium",
    "transition-all duration-150 ease-standard disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  ].join(" "),
  {
    variants: {
      variant: {
        // Ink is the conversion target — the primary button is black, not
        // a colour, in every context.
        primary:
          "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary",
        // The one chromatic accent, reserved for AI-originated actions.
        signal: "bg-signal text-signal-foreground hover:bg-signal/90 active:bg-signal",
        secondary:
          "bg-surface text-foreground border border-border hover:border-border-strong hover:bg-surface-elevated",
        outline:
          "border border-border bg-transparent text-foreground hover:border-border-strong hover:bg-surface-elevated",
        ghost: "bg-transparent text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        link: "bg-transparent underline-offset-4 hover:underline text-signal p-0 h-auto",
      },
      size: {
        // 28px is the nav/announcement scale; 40px the default in-page
        // control; 48px the marketing CTA. Touch targets on small screens
        // are handled by the marketing CTA's own height.
        xs: "h-7 px-2.5 text-sm",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-3.5 text-sm",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10 shrink-0 p-0",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
    },
    compoundVariants: [
      // A pill CTA needs more horizontal room than a square-cornered one of
      // the same height, or the label crowds the curve.
      { shape: "pill", size: "lg", class: "px-6" },
      { shape: "pill", size: "md", class: "px-5" },
      // `link` opts out of all box geometry.
      { variant: "link", class: "h-auto px-0 rounded-none" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shape, asChild = false, isLoading = false, disabled, children, ...props }, ref) => {
    if (asChild) {
      // Slot requires exactly one React element child — no conditional
      // siblings (like the loading spinner below), and no button-only
      // props like `disabled`/`aria-busy` forwarded onto whatever element
      // the caller passed in (often a Next.js <Link>).
      return (
        <Slot className={cn(buttonVariants({ variant, size, shape, className }))} ref={ref} {...props}>
          {children}
        </Slot>
      );
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, shape, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading || undefined}
        {...props}
      >
        {isLoading && <Loader2 className="animate-spin" aria-hidden />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
