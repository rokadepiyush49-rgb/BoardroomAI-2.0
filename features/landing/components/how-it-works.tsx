"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { processSteps } from "@/features/landing/mock";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="container py-24">
      <SectionHeader
        eyebrow="How it works"
        title="Three steps between an idea and a verdict"
        description="No scheduling, no board deck to prepare. The board convenes the moment you submit."
      />

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer(0.12)}
        className="mt-14 grid gap-8 md:grid-cols-3"
      >
        {processSteps.map((step, index) => (
          <motion.li key={step.step} variants={fadeUp} className="relative">
            <span className="text-5xl font-semibold tabular-nums text-foreground/20">{step.step}</span>
            <h3 className="mt-3 text-xl font-semibold text-foreground">{step.title}</h3>
            <p className="mt-2 text-base text-muted-foreground">{step.description}</p>
            {index < processSteps.length - 1 && (
              <span className="absolute -right-4 top-7 hidden h-px w-8 bg-border md:block" aria-hidden />
            )}
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
