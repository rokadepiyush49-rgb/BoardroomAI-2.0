"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "size-8 text-xs",
      md: "size-10 text-sm",
      lg: "size-14 text-base",
      xl: "size-20 text-xl",
    },
  },
  defaultVariants: { size: "md" },
});

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>
>(({ className, size, ...props }, ref) => (
  <AvatarPrimitive.Root ref={ref} className={cn(avatarVariants({ size }), className)} {...props} />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image ref={ref} className={cn("aspect-square h-full w-full object-cover", className)} {...props} />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center bg-surface-elevated font-medium text-foreground",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/**
 * Presence ring for AI agents / executives — mirrors the "roundtable ring"
 * signature motif used in ScoreCard. `presence` maps to a semantic ring
 * colour, not to literal presence-messaging copy, since this is a primitive.
 */
export type AvatarPresence = "active" | "speaking" | "idle" | "offline";

const presenceRingClasses: Record<AvatarPresence, string> = {
  active: "ring-2 ring-success ring-offset-2 ring-offset-background",
  speaking: "ring-2 ring-signal ring-offset-2 ring-offset-background",
  idle: "ring-2 ring-border-strong ring-offset-2 ring-offset-background",
  offline: "ring-1 ring-border ring-offset-2 ring-offset-background opacity-60",
};

function AvatarPresenceRing({
  presence,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof Avatar> & { presence: AvatarPresence }) {
  return (
    <span className="relative inline-flex shrink-0">
      {/*
        The "speaking" pulse rides on a sibling ring rather than on the
        avatar itself — animating the avatar scales and fades the portrait
        to nothing, which is what used to make a speaking executive vanish.
      */}
      {presence === "speaking" && (
        <span
          className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-full ring-2 ring-signal"
          aria-hidden
        />
      )}
      <Avatar className={cn("rounded-full", presenceRingClasses[presence], className)} {...props} />
    </span>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarPresenceRing };
