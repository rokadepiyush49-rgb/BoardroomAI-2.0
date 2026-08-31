import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Competitor } from "@/features/market-research/types";

const strengthTone = { Low: "success", Medium: "warning", High: "destructive" } as const;

export function CompetitorMatrix({ competitors }: { competitors: Competitor[] }) {
  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle className="text-base">Competitor matrix</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y bg-background text-xs font-medium text-muted-soft">
              <th className="px-5 py-2 font-medium">Competitor</th>
              <th className="px-5 py-2 font-medium">Segment</th>
              <th className="px-5 py-2 font-medium">Funding</th>
              <th className="px-5 py-2 font-medium">Competitive strength</th>
            </tr>
          </thead>
          <tbody>
            {competitors.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-sm text-muted-foreground">
                  No competitors mapped yet — run a board session to generate this.
                </td>
              </tr>
            )}
            {competitors.map((c) => (
              <tr key={c.name} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{c.name}</td>
                <td className="px-5 py-3 text-muted-foreground">{c.segment}</td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{c.funding}</td>
                <td className="px-5 py-3">
                  <Badge tone={strengthTone[c.strength]}>{c.strength}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
