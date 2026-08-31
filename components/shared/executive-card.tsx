import { MessageSquareQuote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AvatarFallback, AvatarImage, AvatarPresenceRing, type AvatarPresence } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, getInitials } from "@/lib/utils";

export type ExecutiveRole =
  | "CEO Agent"
  | "CTO Agent"
  | "CFO Agent"
  | "CMO Agent"
  | "VC Agent"
  | "Legal Agent"
  | "Research Agent"
  | "Growth Agent";

export interface ExecutiveCardProps {
  name: string;
  role: ExecutiveRole;
  avatarUrl?: string;
  /** One-line personality trait shown as a badge, e.g. "Risk-averse", "Growth-obsessed". */
  trait?: string;
  /** Short in-voice quote representative of how this executive argues. */
  quote?: string;
  presence?: AvatarPresence;
  onClick?: () => void;
  className?: string;
}

const presenceLabel: Record<AvatarPresence, string> = {
  active: "In session",
  speaking: "Speaking",
  idle: "Idle",
  offline: "Offline",
};

/**
 * Every AI board member — CEO/CTO/CFO/CMO/VC/Legal/Research/Growth — renders
 * through this one component across the Executives directory, the
 * Boardroom seating chart, and report bylines, so a person learns to
 * recognize an agent's "face" once and reads it everywhere.
 */
export function ExecutiveCard({
  name,
  role,
  avatarUrl,
  trait,
  quote,
  presence = "idle",
  onClick,
  className,
}: ExecutiveCardProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <AvatarPresenceRing presence={presence} size="lg">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </AvatarPresenceRing>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold leading-6 tracking-tight text-foreground">{name}</p>
          <p className="text-sm text-muted-soft">{role}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={presence === "speaking" ? "signal" : "muted"} pulse={presence === "speaking"}>
          {presenceLabel[presence]}
        </Badge>
        {trait && <Badge tone="brass">{trait}</Badge>}
      </div>

      {quote && (
        <p className="flex gap-2 text-sm italic leading-relaxed text-muted-foreground">
          <MessageSquareQuote className="mt-0.5 size-4 shrink-0 text-muted-soft" aria-hidden />
          <span>&ldquo;{quote}&rdquo;</span>
        </p>
      )}
    </>
  );

  return (
    <Card
      interactive={Boolean(onClick)}
      className={cn("relative overflow-hidden p-0 text-left", onClick && "w-full", className)}
    >
      {onClick ? (
        <button type="button" onClick={onClick} className="flex w-full flex-col gap-3 p-4 text-left">
          {content}
        </button>
      ) : (
        <div className="flex w-full flex-col gap-3 p-4 text-left">{content}</div>
      )}
    </Card>
  );
}
