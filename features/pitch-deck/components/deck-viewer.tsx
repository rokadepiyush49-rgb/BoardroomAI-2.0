"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeIn } from "@/lib/motion";
import { EmptyState } from "@/components/shared/empty-state";
import type { DeckSlide } from "@/features/pitch-deck/types";

export function DeckViewer({ deckSlides }: { deckSlides: DeckSlide[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = deckSlides.find((s) => s.id === activeId) ?? deckSlides[0];

  if (!active) {
    return (
      <EmptyState
        title="No deck yet"
        description="Run a board session and the board will restructure your deck around what it actually asked."
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="flex gap-3 overflow-x-auto lg:flex-col lg:overflow-visible">
        {deckSlides.map((slide) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => setActiveId(slide.id)}
            className={cn(
              "flex w-40 shrink-0 flex-col gap-1 rounded-lg border p-3 text-left transition-colors lg:w-full",
              slide.id === active.id ? "border-foreground bg-surface-elevated" : "border-border bg-surface hover:bg-surface-elevated",
            )}
          >
            <span className="text-[0.65rem] font-mono text-muted-foreground">{String(slide.index).padStart(2, "0")}</span>
            <span className="truncate text-xs font-medium text-foreground">{slide.title}</span>
          </button>
        ))}
      </div>

      <Card className="relative flex aspect-video flex-col justify-center overflow-hidden p-10 sm:p-14">
        <div className="absolute right-4 top-4 flex gap-2">
          <Button variant="ghost" size="icon" aria-label="Share deck">
            <Share2 className="size-4" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Export deck">
            <Download className="size-4" />
          </Button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active.id} initial="hidden" animate="visible" exit="hidden" variants={fadeIn} className="space-y-5">
            <p className="text-xs font-medium text-muted-soft">
              Slide {String(active.index).padStart(2, "0")} / {deckSlides.length}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{active.title}</h2>
            <ul className="space-y-2.5">
              {active.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2.5 text-base text-foreground/90">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                  {bullet}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </Card>
    </div>
  );
}
