import { Geist, Geist_Mono } from "next/font/google";

/**
 * Type system — one face, three weights.
 *
 * Geist carries display headlines, body copy, nav, buttons and labels
 * alike, at 400 (body), 500 (buttons, strong labels) and 600 (display).
 * There is no serif companion and the weight ceiling is 600 — the restraint
 * is the point, not an omission, so there is no separate display face to
 * load either.
 *
 * Geist Mono is kept for figures that must read as *data* in the
 * authenticated app (financial tables, timestamps, IDs). It belongs to the
 * same family, so the single-face rule holds; marketing surfaces use
 * `tabular-nums` on the sans rather than switching face.
 */

export const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const fontVariables = `${fontSans.variable} ${fontMono.variable}`;
