import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RiskRow } from "@/features/reports/types";

const levelTone = { Low: "success", Medium: "warning", High: "destructive" } as const;

export function RiskMatrix({ risks }: { risks: RiskRow[] }) {
  return (
    <Card className="p-0">
      <CardHeader>
        <CardTitle className="text-base">Risk matrix</CardTitle>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-y bg-background text-xs font-medium text-muted-soft">
              <th className="px-5 py-2 font-medium">Risk</th>
              <th className="px-5 py-2 font-medium">Likelihood</th>
              <th className="px-5 py-2 font-medium">Impact</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((row) => (
              <tr key={row.risk} className="border-b border-border last:border-0">
                <td className="px-5 py-3 text-foreground">{row.risk}</td>
                <td className="px-5 py-3">
                  <Badge tone={levelTone[row.likelihood]}>{row.likelihood}</Badge>
                </td>
                <td className="px-5 py-3">
                  <Badge tone={levelTone[row.impact]}>{row.impact}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
