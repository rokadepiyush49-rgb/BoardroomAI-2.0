"use client";

import Link from "next/link";
import { Gavel, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const marketingLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "The board", href: "#executives" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/**
 * Top nav for unauthenticated marketing pages: logo left, link row centre,
 * CTA cluster right. 64px tall, canvas-soft ground, hairline bottom edge.
 *
 * The nav-scale buttons are 28px and square-cornered (6px) — the pill
 * geometry belongs to marketing CTAs only, so it never appears up here.
 * On mobile the row collapses to logo + hamburger and the CTAs inflate to
 * full-height touch targets in the sheet.
 */
export function MarketingNavbar({ className }: { className?: string }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={cn("glass sticky top-0 z-40 border-b", className)}>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Gavel className="size-3.5" />
          </span>
          <span className="text-base font-semibold tracking-tight">BoardroomAI</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {marketingLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-elevated hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="secondary" size="xs" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="xs" asChild>
            <Link href="/login?next=/meeting/new">Sign up</Link>
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-11 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <nav className="border-t bg-background px-4 py-3 md:hidden">
          <div className="flex flex-col gap-0.5">
            {marketingLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center rounded-md px-3 text-sm text-muted-foreground hover:bg-surface-elevated hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t pt-3">
              <Button variant="secondary" size="lg" className="h-11" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button size="lg" className="h-11" asChild>
                <Link href="/login?next=/meeting/new">Sign up</Link>
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
