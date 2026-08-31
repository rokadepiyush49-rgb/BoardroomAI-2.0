import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Base card surface. Elevation comes from the system's stacked compound
 * shadow (`.surface-card`) — a hairline 8% ring plus a 4% 2px drop, with an
 * inner canvas-coloured ring that lets the page background bleed to the card
 * edge. Cards sit *on* the page; they never levitate on a heavy drop-shadow.
 *
 * `interactive` deepens that same stack on hover rather than switching to a
 * different elevation language; leave it off for static containers so the
 * whole dashboard doesn't feel clickable.
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
>(({ className, interactive, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "surface-card rounded-md",
      interactive && "surface-card-hover cursor-pointer",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * Card interiors run at 16px padding with a tight 12px stack — the system is
 * deliberately information-forward inside a card, then breathes at the
 * section level.
 */
const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-base font-semibold leading-6 tracking-tight", className)} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-4 pt-0", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
