"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/shared/empty-state";
import type { PrdSection } from "@/features/prd-generator/types";

interface PrdViewerProps {
  sections: PrdSection[];
  /** Shown in the eyebrow — the workspace or product this spec is for. */
  subject?: string;
}

export function PrdViewer({ sections, subject }: PrdViewerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = sections.find((section) => section.id === activeId) ?? sections[0];

  if (!active) {
    return (
      <EmptyState
        title="No spec yet"
        description="Run a board session and the board will spec the highest-leverage fix it identified."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {sections.map((section) => (
          <button
            key={section.id}
            type="button"
            onClick={() => setActiveId(section.id)}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full",
              section.id === active.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
            )}
          >
            {section.title}
          </button>
        ))}
      </nav>

      <Card className="p-6">
        <article className="space-y-3">
          <p className="text-sm font-medium text-muted-soft">
            PRD{subject ? ` · ${subject}` : " · Board-recommended fix"}
          </p>
          <h2 className="text-2xl font-semibold">{active.title}</h2>
          <p className="whitespace-pre-wrap text-base leading-7 text-muted-foreground">{active.content}</p>
        </article>
      </Card>
    </div>
  );
}
