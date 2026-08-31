import { ChevronDown } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { faqItems } from "@/features/landing/mock";

export function Faq() {
  return (
    <section id="faq" className="border-y bg-surface py-24">
      <div className="container max-w-3xl">
        <SectionHeader eyebrow="Questions" title="Before you bring it to the board" />

        <div className="surface-card mt-10 divide-y divide-border overflow-hidden rounded-md">
          {faqItems.map((item) => (
            <details key={item.question} className="group p-4 open:bg-surface-elevated">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-foreground marker:content-none">
                {item.question}
                <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
