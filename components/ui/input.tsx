import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Icon rendered inside the field's leading edge (search, currency, etc). */
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  invalid?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", startAdornment, endAdornment, invalid, ...props }, ref) => {
    if (startAdornment || endAdornment) {
      return (
        <div className="relative flex items-center">
          {startAdornment && (
            <span className="pointer-events-none absolute left-3 flex items-center text-muted-soft [&_svg]:size-4">
              {startAdornment}
            </span>
          )}
          <input
            type={type}
            ref={ref}
            aria-invalid={invalid}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-surface px-3 text-sm text-foreground",
              "placeholder:text-muted-soft transition-colors duration-150",
              "focus-visible:border-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
              "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
              startAdornment && "pl-9",
              endAdornment && "pr-9",
              className,
            )}
            {...props}
          />
          {endAdornment && (
            <span className="absolute right-3 flex items-center text-muted-soft [&_svg]:size-4">
              {endAdornment}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        ref={ref}
        aria-invalid={invalid}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-surface px-3 text-sm text-foreground",
          "placeholder:text-muted-soft transition-colors duration-150",
          "focus-visible:border-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
