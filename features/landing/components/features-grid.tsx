"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/ui/card";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { deliverables } from "@/features/landing/mock";

export function FeaturesGrid() {
  return (
    <section className="container py-24">
      <SectionHeader
        eyebrow="What you get"
        title="One session, eight deliverables"
        description="Everything a founder brings into a real fundraising conversation, generated from the same debate."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer(0.06)}
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {deliverables.map((item) => (
          <motion.div key={item.title} variants={fadeUp}>
            <Card interactive className="h-full p-4">
              <span className="flex size-9 items-center justify-center rounded-md border text-foreground">
                <item.icon className="size-4" />
              </span>
              <h3 className="mt-4 font-medium text-foreground">{item.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{item.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
