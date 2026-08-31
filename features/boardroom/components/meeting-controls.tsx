"use client";

import type { ReactNode } from "react";
import { Pause, Play, Square, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PHASE_LABEL, type DebatePhase } from "@/lib/ai/debate-policy";
import type { SessionPhase } from "@/features/boardroom/types";

interface MeetingControlsProps {
  startupName: string;
  oneLiner: string;
  stage: string;
  industry: string;
  phase: SessionPhase;
  /** Turns taken out of turns planned, shown as session progress. */
  progress: { spoken: number; total: number };
  onTogglePause: () => void;
  /** Ends the debate early and jumps straight to the vote and report. */
  onEndSession: () => void;
  /** False when the browser has no speech synthesis — hides the audio toggle. */
  speechSupported: boolean;
  muted: boolean;
  onToggleMuted: () => void;
  /** Name of whoever is audibly talking, shown beside the audio toggle. */
  nowSpeaking: string | null;
  /** Which movement of the meeting is running — null once the debate ends. */
  debatePhase: DebatePhase | null;
  /** What the board is currently arguing about, when confidently detected. */
  topicLabel: string | null;
  /** The seating strip, rendered inside the same pinned stage. */
  children?: ReactNode;
}

const phaseBadge: Record<SessionPhase, { label: string; tone: "signal" | "muted" | "success" }> = {
  idle: { label: "Ready", tone: "muted" },
  debating: { label: "Live", tone: "signal" },
  paused: { label: "Paused", tone: "muted" },
  finalizing: { label: "Voting", tone: "signal" },
  complete: { label: "Completed", tone: "success" },
};

export function MeetingControls({
  startupName,
  oneLiner,
  stage,
  industry,
  phase,
  progress,
  onTogglePause,
  onEndSession,
  speechSupported,
  muted,
  onToggleMuted,
  nowSpeaking,
  debatePhase,
  topicLabel,
  children,
}: MeetingControlsProps) {
  const badge = phaseBadge[phase];
  const isRunning = phase === "debating";
  const isOver = phase === "complete" || phase === "finalizing";

  return (
    /*
      `top-0`, not `top-16`. The scroll container is `<main>` in the app shell,
      which already begins below the fixed navbar — so `top-16` pinned this bar
      64px *down* from the top of the scrolling area and left a band above it
      where the seats scrolled past behind translucent glass. That band was the
      "something is off": avatars visibly sliding through the header.

      `-mt-8 pt-8` swallows the container's own top padding into the pinned
      element, and the opaque `bg-background` stops anything showing through
      where the glass panel's rounded corners don't cover.
    */
    <div className="sticky top-0 z-20 -mt-8 bg-background pb-4 pt-8">
      <div className="glass rounded-md border">
        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start sm:justify-between">
          {/* `min-w-0` so a long one-liner wraps instead of shoving the
              controls out of the header. */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold">{startupName}</h2>
              {stage && <Badge tone="muted">{stage}</Badge>}
              <Badge tone={badge.tone} pulse={isRunning || phase === "finalizing"}>
                {badge.label}
              </Badge>
            </div>
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {oneLiner}
              {industry ? ` · ${industry}` : ""} · {progress.spoken} of {progress.total} turns
            </p>
            {/* The phase and the live topic are the two things that explain
                why a particular executive currently has the floor. Showing
                them turns the seating strip from decoration into a readout
                of what the orchestrator just decided. */}
            {(debatePhase || topicLabel) && (
              <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                {debatePhase && (
                  <span className="font-medium text-signal">{PHASE_LABEL[debatePhase]}</span>
                )}
                {debatePhase && topicLabel && <span aria-hidden className="text-border-strong">·</span>}
                {topicLabel && (
                  <span className="text-muted-foreground">
                    on <span className="text-foreground/80">{topicLabel}</span>
                  </span>
                )}
              </div>
            )}
          </div>

          {/*
            One bordered cluster rather than two competing calls to action.
            Ending a session is destructive but not the primary path, so it is
            tinted rather than filled — a solid red block outweighed Pause
            beside it and, at reduced opacity once the session was over, still
            looked clickable.
          */}
          <div className="flex shrink-0 items-center gap-1 self-start rounded-lg border border-border/60 bg-surface-elevated/40 p-1">
            {speechSupported && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={onToggleMuted}
                  aria-pressed={!muted}
                  aria-label={muted ? "Turn board audio on" : "Turn board audio off"}
                  title={muted ? "Turn board audio on" : "Turn board audio off"}
                >
                  {muted ? <VolumeX className="text-muted-foreground" /> : <Volume2 className="text-signal" />}
                </Button>
                <div aria-hidden className="h-4 w-px shrink-0 bg-border/60" />
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="min-w-[5.5rem] disabled:opacity-40"
              onClick={onTogglePause}
              disabled={isOver}
              aria-label={isRunning ? "Pause the session" : "Resume the session"}
            >
              {isRunning ? <Pause /> : <Play />}
              {/* Fixed width above: "Pause" and "Resume" differ in length, and
                  without it the button — and the cluster around it — jumps
                  sideways on every toggle. */}
              {isRunning ? "Pause" : "Resume"}
            </Button>
            <div aria-hidden className="h-4 w-px shrink-0 bg-border/60" />
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive disabled:opacity-40"
              onClick={onEndSession}
              disabled={isOver}
            >
              <Square />
              End session
            </Button>
          </div>
        </div>

        {children && (
          <div className="border-t border-border/60 px-3 py-3">
            {children}
            {/* `aria-live` so a screen reader hears the handover; the seats
                themselves convey it only as a color ring. */}
            <p aria-live="polite" className="sr-only">
              {nowSpeaking ? `${nowSpeaking} is speaking` : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
