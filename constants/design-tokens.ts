/**
 * JS-side mirror of the CSS custom properties in `app/globals.css`.
 * Tailwind classes should always be preferred in components — this file
 * exists only for contexts that need a raw color string, e.g. Recharts
 * `stroke`/`fill` props, canvas drawing, or SVG gradients built in JS.
 *
 * Values are `var()` references rather than literal hex/HSL, so a chart
 * follows the active theme instead of freezing one palette into the JS
 * bundle. SVG presentation attributes resolve custom properties against the
 * element's own computed style, so this works wherever the element is in the
 * document — which a hardcoded literal does not.
 */

export const chartColors = {
  /** Ink — the first series, and the one the eye reads as "primary". */
  ink: "hsl(var(--chart-1))",
  /** The one chromatic accent in the system. */
  signal: "hsl(var(--chart-2))",
  /** Neutral mid-grey for supporting series. */
  neutral: "hsl(var(--chart-3))",
  warning: "hsl(var(--chart-4))",
  destructive: "hsl(var(--chart-5))",
} as const;

/**
 * Ordered so adjacent series stay distinguishable at a glance. The palette is
 * intentionally near-monochromatic: ink first, then the brand blue, then
 * neutrals and the two semantic tones. No colour appears here that the
 * system's palette doesn't already contain.
 */
export const chartSeriesOrder = [
  chartColors.ink,
  chartColors.signal,
  chartColors.neutral,
  chartColors.warning,
  chartColors.destructive,
] as const;

export const toneColors = {
  brass: { fg: "hsl(var(--brass))", bg: "hsl(var(--brass) / 0.1)" },
  signal: { fg: "hsl(var(--signal))", bg: "hsl(var(--signal) / 0.1)" },
  success: { fg: "hsl(var(--success))", bg: "hsl(var(--success) / 0.1)" },
  warning: { fg: "hsl(var(--warning))", bg: "hsl(var(--warning) / 0.12)" },
  destructive: { fg: "hsl(var(--destructive))", bg: "hsl(var(--destructive) / 0.1)" },
  muted: { fg: "hsl(var(--muted-foreground))", bg: "hsl(var(--muted))" },
} as const;

/** Numeric radii for JS contexts (Recharts tooltips, canvas), in px. */
export const radii = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
} as const;
