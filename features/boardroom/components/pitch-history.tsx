import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { PastSession } from "@/features/boardroom/types";

const statusTone = { completed: "success", "in-progress": "signal", scheduled: "muted" } as const;
const statusLabel = { completed: "Completed", "in-progress": "In session", scheduled: "Scheduled" } as const;

interface PitchHistoryProps {
  sessions: PastSession[];
  loading?: boolean;
  /** Highlighted so the founder can tell which row is the session on screen. */
  currentMeetingId?: string;
}

export function PitchHistory({ sessions, loading, currentMeetingId }: PitchHistoryProps) {
  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle className="text-base">Pitch history</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 pt-0">
        {loading && <Skeleton className="h-24 w-full" />}

        {!loading && sessions.length === 0 && (
          <p className="px-2 py-4 text-sm text-muted-foreground">
            No previous sessions yet. This is your first.
          </p>
        )}

        {!loading &&
          sessions.map((session) => (
            <Link
              key={session.id}
              href={session.reportId ? `/reports/${session.reportId}` : `/boardroom?meeting=${session.id}`}
              className={
                session.id === currentMeetingId
                  ? "flex items-center justify-between gap-3 rounded-lg bg-surface-elevated px-2 py-2.5"
                  : "flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-surface-elevated"
              }
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{session.startupName}</p>
                <p className="truncate text-xs text-muted-foreground">{session.oneLiner}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                {session.investmentScore !== undefined && (
                  <span className="font-mono text-sm font-medium text-foreground">{session.investmentScore}</span>
                )}
                <Badge tone={statusTone[session.status]}>{statusLabel[session.status]}</Badge>
              </div>
            </Link>
          ))}

        <p className="px-2 pt-1 text-xs text-muted-foreground">
          Full archive in <Link href="/reports" className="text-signal hover:underline">Reports</Link>.
        </p>
      </CardContent>
    </Card>
  );
}
