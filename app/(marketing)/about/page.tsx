import type { Metadata } from "next";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/ui/card";
import { ExecutiveCard } from "@/components/shared/executive-card";
import { boardExecutives } from "@/features/landing/mock";

export const metadata: Metadata = { title: "About" };

const values = [
  { title: "Disagreement is signal", description: "A board that always agrees isn't pressure-testing anything. Ours keeps its splits on the record." },
  { title: "Speed doesn't excuse shallowness", description: "Six minutes is only useful if the reasoning underneath would survive a real diligence call." },
  { title: "Founders own the outcome", description: "The board argues. It doesn't decide for you — every report ends with your call to make." },
];

export default function AboutPage() {
  return (
    <div className="container space-y-20 py-20">
      <SectionHeader
        eyebrow="About"
        title="A board built to disagree with you, on purpose"
        description="BoardroomAI exists because most founders don't get real pushback until it's expensive — a rejected term sheet, a missed number in front of a real board. We moved that pushback earlier."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title} className="p-6">
            <h3 className="text-lg font-semibold">{value.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <SectionHeader eyebrow="The board" title="Who you'll pitch to" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {boardExecutives.map((exec) => (
            <ExecutiveCard key={exec.name} name={exec.name} role={exec.role} trait={exec.trait} quote={exec.quote} />
          ))}
        </div>
      </div>
    </div>
  );
}
