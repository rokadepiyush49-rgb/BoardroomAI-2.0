import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, invalid, rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        aria-invalid={invalid}
        className={cn(
          "flex w-full resize-y rounded-md border border-input bg-surface px-3 py-2 text-sm text-foreground",
          "placeholder:text-muted-soft transition-colors duration-150 leading-relaxed",
          "focus-visible:border-foreground disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
          "aria-[invalid=true]:border-destructive aria-[invalid=true]:focus-visible:ring-destructive",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
