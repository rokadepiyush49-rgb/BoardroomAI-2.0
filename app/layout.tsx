import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { AppProviders } from "@/providers/app-providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BoardroomAI",
    template: "%s · BoardroomAI",
  },
  description: "Pitch your startup to a virtual board of AI executives.",
};

/**
 * Root layout. Intentionally minimal: fonts + providers only. No shell
 * chrome (Sidebar/Navbar) lives here yet, since that composition depends on
 * which route group a page belongs to (marketing vs. app) — that decision
 * is made when pages are built, not here.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
