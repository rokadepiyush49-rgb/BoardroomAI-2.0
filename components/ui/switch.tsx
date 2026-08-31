"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  "aria-label"?: string;
}

/**
 * A minimal, dependency-free toggle switch. Built by hand rather than
 * pulling in @radix-ui/react-switch since this is the only place the app
 * needs one so far — revisit if a second consumer needs richer states.
 */
const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, onCheckedChange, disabled, id, ...props }, ref) => (
    <button
      ref={ref}
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-muted",
      )}
      {...props}
    >
      <span
        className={cn(
          "inline-block size-[18px] transform rounded-full bg-surface shadow-sm transition-transform duration-200",
          checked ? "translate-x-[22px]" : "translate-x-1",
        )}
      />
    </button>
  ),
);
Switch.displayName = "Switch";

export { Switch };
