"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gavel, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { primaryNav, secondaryNav } from "@/constants/nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export interface SidebarProps {
  /** Live counts keyed by NavItem.badgeKey — supplied by the caller, never fetched here. */
  badgeCounts?: Partial<Record<"activeMeetings" | "pendingReports", number>>;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  className?: string;
}

/**
 * Primary app-shell navigation. Pure presentation: route structure comes
 * from `constants/nav.ts`, active state comes from `usePathname`, and
 * live badge counts are passed in by whichever layout mounts this — the
 * component itself never fetches data.
 */
export function Sidebar({ badgeCounts, collapsed = false, onToggleCollapsed, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r bg-surface transition-[width] duration-200 ease-standard",
        collapsed ? "w-[68px]" : "w-64",
        className,
      )}
    >
      <div className={cn("flex h-16 items-center gap-2 px-4", collapsed && "justify-center px-0")}>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Gavel className="size-3.5" />
        </span>
        {!collapsed && <span className="text-base font-semibold tracking-tight">BoardroomAI</span>}
      </div>

      <Separator />

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {primaryNav.map((section) => (
          <div key={section.label} className="space-y-1">
            {!collapsed && (
              <p className="px-2.5 pb-1 text-xs font-medium text-muted-soft">{section.label}</p>
            )}
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              const badgeCount = item.badgeKey ? badgeCounts?.[item.badgeKey] : undefined;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    // Active state is a left-edge indicator bar in the ink
                    // primary — the system doesn't tint whole rows.
                    isActive
                      ? "bg-surface-elevated text-foreground before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-primary"
                      : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                  {!collapsed && Boolean(badgeCount) && (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[0.65rem] font-medium tabular-nums text-muted-foreground">
                      {badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <Separator />

      <div className="space-y-1 px-3 py-3">
        {secondaryNav.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-3 rounded-sm px-2.5 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-surface-elevated text-foreground before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-primary"
                  : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}

        {onToggleCollapsed && (
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "sm"}
            className="w-full justify-center text-muted-foreground"
            onClick={onToggleCollapsed}
          >
            {collapsed ? <PanelLeftOpen className="size-4" /> : <PanelLeftClose className="size-4" />}
            {!collapsed && <span>Collapse</span>}
          </Button>
        )}
      </div>
    </aside>
  );
}
