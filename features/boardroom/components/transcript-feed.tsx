"use client";

import { useEffect, useRef, useState } from "react";
import { Send, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getInitials, cn } from "@/lib/utils";
import type { TranscriptMessage } from "@/features/boardroom/types";

interface TranscriptFeedProps {
  messages: TranscriptMessage[];
  /** Name of the executive currently composing a reply, if any. */
  typingAs: string | null;
  /** Name of the executive being read aloud, if any. */
  speakingAs: string | null;
  /** Live badge state — false once the session has been finalized. */
  isLive: boolean;
  /** Founder replies are only possible while the board still has turns left. */
  canReply: boolean;
  onSend: (message: string) => void;
  /** Set when the board is holding for an answer from the founder. */
  pendingQuestion?: string | null;
  /** Lets the founder decline and hand the floor back to the board. */
  onSkipQuestion?: () => void;
}

export function TranscriptFeed({
  messages,
  typingAs,
  speakingAs,
  isLive,
  canReply,
  onSend,
  pendingQuestion,
  onSkipQuestion,
}: TranscriptFeedProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingAs]);

  function handleSend(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed || !canReply) return;
    setDraft("");
    onSend(trimmed);
  }

  return (
    /*
      The transcript is what this screen is for, so it gets the viewport
      rather than a fixed 440px box that ended shorter than the panel beside
      it and left the columns visibly mismatched. The subtraction covers the
      navbar and the pinned stage above; `min-h` keeps it usable on a laptop
      in a short window.
    */
    <Card className="flex h-[calc(100vh-19rem)] min-h-[360px] flex-col p-0">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-base">Live transcript</CardTitle>
        {speakingAs ? (
          <Badge tone="signal" pulse>
            {speakingAs} is speaking
          </Badge>
        ) : (
          <Badge tone={isLive ? "signal" : "muted"} pulse={isLive}>
            {isLive ? "Recording" : "Session closed"}
          </Badge>
        )}
      </CardHeader>

      {/* `min-h-0` lets this shrink inside the flex column — without it the
          content sets the floor and the card grows past the card's own
          height instead of scrolling. */}
      <CardContent ref={scrollRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto pt-0">
        {messages.length === 0 && !typingAs && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            The board is reading your pitch. The first executive will speak in a moment.
          </p>
        )}

        {messages.map((entry, index) => {
          // Only the newest message can be the one being read aloud — an
          // earlier turn from the same speaker must not light up too.
          const isBeingSpoken = speakingAs !== null && index === messages.length - 1 && entry.speaker === speakingAs;
          return (
          <div key={entry.id} className={cn("flex gap-3", entry.isFounder && "flex-row-reverse text-right")}>
            <Avatar size="sm" className="shrink-0">
              <AvatarFallback className={entry.isFounder ? "bg-primary text-primary-foreground" : undefined}>
                {getInitials(entry.speaker)}
              </AvatarFallback>
            </Avatar>
            {/*
              `items-end` only means something on a flex container — on the
              block element this used to be it was inert, and the founder's
              bubble was right-aligned only by inherited `text-align`.
            */}
            <div
              className={cn(
                "flex min-w-0 max-w-[85%] flex-col gap-1",
                entry.isFounder ? "items-end" : "items-start",
              )}
            >
              <div className={cn("flex items-baseline gap-2", entry.isFounder && "flex-row-reverse")}>
                <span className="text-sm font-medium text-foreground">{entry.speaker}</span>
                <span className="text-xs text-muted-foreground">{entry.role}</span>
              </div>
              <p
                className={cn(
                  // `break-words` keeps a long URL or id inside the bubble.
                  // Without it the message sets a min-content width nothing
                  // upstream can shrink, and the layout blows out sideways.
                  "min-w-0 whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm leading-relaxed",
                  "transition-shadow duration-300",
                  entry.isFounder ? "border border-foreground/15 bg-surface text-foreground" : "bg-surface-elevated text-foreground",
                  isBeingSpoken && "ring-1 ring-signal/40",
                )}
              >
                {entry.message}
              </p>
              {/* Fact-check outcome. Only rendered where evidence existed to
                  check against, so its absence never implies a clean bill. */}
              {entry.verification?.checked && (
                <p
                  className={cn(
                    "flex items-center gap-1 text-[0.7rem]",
                    entry.verification.unsupported.length > 0 ? "text-warning" : "text-success",
                  )}
                  title={
                    entry.verification.unsupported.length > 0
                      ? `Not found in any retrieved source: ${entry.verification.unsupported.join(", ")}`
                      : `Matched a retrieved source: ${entry.verification.supported.join(", ")}`
                  }
                >
                  {entry.verification.unsupported.length > 0 ? (
                    <>
                      <ShieldAlert className="size-3" />
                      {entry.verification.unsupported.length} unverified figure
                      {entry.verification.unsupported.length === 1 ? "" : "s"}
                    </>
                  ) : (
                    entry.verification.supported.length > 0 && (
                      <>
                        <ShieldCheck className="size-3" />
                        Figures matched a source
                      </>
                    )
                  )}
                </p>
              )}
              <p className="text-[0.7rem] text-muted-foreground">{entry.timestamp}</p>
            </div>
          </div>
          );
        })}

        {typingAs && (
          <div className="flex items-center gap-2 pl-11 text-xs text-muted-foreground">
            <span className="flex gap-0.5">
              <span className="size-1.5 animate-pulse rounded-full bg-signal [animation-delay:-0.3s]" />
              <span className="size-1.5 animate-pulse rounded-full bg-signal [animation-delay:-0.15s]" />
              <span className="size-1.5 animate-pulse rounded-full bg-signal" />
            </span>
            {typingAs} is thinking…
          </div>
        )}
      </CardContent>

      {/* The board is holding for an answer. Making the wait explicit is what
          turns an interjection box into a conversation — the founder can see
          they are being asked something, not just permitted to interrupt. */}
      {pendingQuestion && canReply && (
        <div className="border-t border-signal/30 bg-signal/5 px-4 py-3">
          <p className="text-xs font-medium text-signal">
            The board is waiting on you
          </p>
          <p className="mt-1 text-sm text-foreground/90">{pendingQuestion}</p>
          {onSkipQuestion && (
            <button
              type="button"
              onClick={onSkipQuestion}
              className="mt-2 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Skip — let the board continue
            </button>
          )}
        </div>
      )}

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-border p-4">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            !canReply
              ? "The board has finished this session."
              : pendingQuestion
                ? "Answer the board…"
                : "Reply to the board…"
          }
          aria-label="Message the board"
          disabled={!canReply}
          className="flex-1"
          autoFocus={Boolean(pendingQuestion)}
        />
        <Button type="submit" size="icon" aria-label="Send message" disabled={!canReply || !draft.trim()}>
          <Send className="size-4" />
        </Button>
      </form>
    </Card>
  );
}
