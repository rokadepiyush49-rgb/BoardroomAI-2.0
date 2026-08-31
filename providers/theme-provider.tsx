"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/**
 * Thin wrapper around next-themes so the rest of the app imports from
 * `@/providers` rather than reaching into a third-party package directly.
 * Light is the product's default and showcase surface — the design
 * language is a near-white canvas with ink type. Dark is a derived,
 * opt-in variant that keeps the same near-monochrome logic with the
 * polarity flipped.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
