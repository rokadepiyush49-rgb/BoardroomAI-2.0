"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const options = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
] as const;

/**
 * Theme selector. Light is the product's default and showcase surface; dark
 * is the derived variant with the polarity flipped. The control is a
 * segmented row rather than a single toggle so the current choice is always
 * legible, not inferred from an icon.
 *
 * Renders a placeholder until mounted — `useTheme` has no value on the
 * server, and reading it during hydration flags the wrong option as active.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className={cn("inline-flex gap-1 rounded-md bg-muted p-1", className)} role="group" aria-label="Theme">
      {options.map(({ value, label, icon: Icon }) => {
        const active = mounted && theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={active}
            className={cn(
              "inline-flex items-center gap-2 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
              active ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
