"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { primaryNav, secondaryNav } from "@/constants/nav";

const allNavItems = [...primaryNav.flatMap((s) => s.items), ...secondaryNav];

function titleForPath(pathname: string) {
  const match = allNavItems.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  return match?.label ?? "BoardroomAI";
}

/**
 * The authenticated app shell: Sidebar + top Navbar wrapping every page
 * under the `(app)` route group.
 *
 * The sidebar is a permanent column from `lg` up, where there's room for it
 * alongside content, and an off-canvas drawer below that — a 256px fixed
 * column on a 375px screen leaves nothing for the page itself. The drawer
 * closes on navigation, on backdrop click, and on Escape; the desktop
 * collapse toggle is independent of it.
 */
export function AppShell({ children, user }: { children: ReactNode; user: { name: string; avatarUrl?: string } }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed((v) => !v)}
        badgeCounts={{ activeMeetings: 2, pendingReports: 5 }}
        className="hidden lg:flex"
      />

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          {/*
            Any click that lands on a nav row is a navigation, so closing on
            the capture here is enough — no pathname effect needed, and the
            drawer never survives into the page it just opened.
          */}
          <div onClick={() => setMobileOpen(false)} className="contents">
            <Sidebar
              badgeCounts={{ activeMeetings: 2, pendingReports: 5 }}
              className="fixed inset-y-0 left-0 z-50 shadow-xl lg:hidden"
            />
          </div>
        </>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          title={titleForPath(pathname ?? "")}
          user={user}
          notificationCount={3}
          onOpenNav={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="container max-w-none py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
