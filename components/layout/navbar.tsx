"use client";

import type { ReactNode } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar";
import { getInitials, cn } from "@/lib/utils";

export interface NavbarProps {
  /** Current page/section title — supplied by the layout that mounts this, never hardcoded here. */
  title?: string;
  user?: { name: string; avatarUrl?: string };
  notificationCount?: number;
  /** Extra actions rendered before the user menu (e.g. an "Invite" button, a stage toggle). */
  actions?: ReactNode;
  /** Opens the off-canvas sidebar. Only rendered below `lg`, where the sidebar isn't a permanent column. */
  onOpenNav?: () => void;
  className?: string;
}

/**
 * Top app bar for the authenticated shell. Sits above `Sidebar`'s content
 * area on a blurred canvas ground, so long dashboard pages scroll under it
 * without the chrome going fully opaque.
 *
 * Below `lg` the sidebar isn't a permanent column, so the bar grows a
 * hamburger that hands control back to whoever mounts it (`onOpenNav`).
 */
export function Navbar({ title, user, notificationCount = 0, actions, onOpenNav, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "glass sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 sm:px-6",
        className,
      )}
    >
      {onOpenNav && (
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Open navigation"
          className="-ml-2 flex size-11 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-surface-elevated lg:hidden"
        >
          <Menu className="size-5" />
        </button>
      )}

      {title && <h1 className="truncate text-base font-semibold tracking-tight">{title}</h1>}

      <div className="ml-auto hidden w-full max-w-sm items-center gap-3 md:flex lg:ml-0">
        <Input
          type="search"
          placeholder="Search startups, reports, executives…"
          startAdornment={<Search />}
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {actions}

        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="size-4" />
          {notificationCount > 0 && (
            <span className="absolute right-2 top-2 flex size-1.5 rounded-full bg-signal ring-2 ring-background" aria-hidden />
          )}
        </Button>

        {user && (
          <Avatar size="sm">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </header>
  );
}
