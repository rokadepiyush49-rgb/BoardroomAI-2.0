import { cn, clamp } from "@/lib/utils";
import type { Tone } from "@/types/common";

export interface ScoreCardProps {
  label: string;
  /** 0–100. Values outside this range are clamped. */
  score: number;
  /** Short qualitative read-out shown under the score, e.g. "Strong buy signal". */
  verdict?: string;
  tone?: Tone;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const toneStrokeClass: Record<Tone, string> = {
  brass: "stroke-primary",
  signal: "stroke-signal",
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  muted: "stroke-muted-foreground",
};

const sizeConfig = {
  sm: { box: 88, stroke: 6, text: "text-xl" },
  md: { box: 128, stroke: 8, text: "text-3xl" },
  lg: { box: 172, stroke: 10, text: "text-4xl" },
} as const;

/**
 * The "Roundtable Ring" — this project's signature visual element. Every
 * verdict a board of executives produces (investment score, confidence,
 * health) resolves to a number out of 100 read as a ring, echoing the
 * shape of the boardroom table itself. Reused (at smaller sizes) inside
 * ExecutiveCard's confidence indicator so the motif recurs, not repeats.
 */
export function ScoreCard({ label, score, verdict, tone = "brass", size = "md", className }: ScoreCardProps) {
  const clamped = clamp(score, 0, 100);
  const { box, stroke, text } = sizeConfig[size];
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - clamped / 100);

  return (
    <div className={cn("flex flex-col items-center gap-3 text-center", className)}>
      <div className="relative" style={{ width: box, height: box }}>
        <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} className="-rotate-90">
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            strokeWidth={stroke}
            className="fill-none stroke-border"
          />
          <circle
            cx={box / 2}
            cy={box / 2}
            r={radius}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            className={cn("fill-none transition-[stroke-dashoffset] duration-700 ease-emphasized", toneStrokeClass[tone])}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("font-semibold tabular-nums tracking-tight text-foreground", text)}>{clamped}</span>
          <span className="text-xs text-muted-soft">out of 100</span>
        </div>
      </div>
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {verdict && <p className="text-xs text-muted-soft">{verdict}</p>}
      </div>
    </div>
  );
}
