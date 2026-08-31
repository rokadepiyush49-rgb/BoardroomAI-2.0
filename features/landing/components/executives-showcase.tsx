"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { ExecutiveCard } from "@/components/shared/executive-card";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { boardExecutives } from "@/features/landing/mock";

export function ExecutivesShowcase() {
  return (
    <section id="executives" className="border-y bg-surface py-24">
      <div className="container">
        <SectionHeader
          eyebrow="The board"
          title="Eight points of view, none of them polite"
          description="Every executive argues from a fixed seat — growth, risk, product, legal — so the board disagrees the way a real one does."
          action={
            <Button variant="outline" asChild>
              <Link href="/executives">
                Meet the full board
                <ArrowRight />
              </Link>
            </Button>
          }
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer(0.08)}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {boardExecutives.map((exec) => (
            <motion.div key={exec.name} variants={fadeUp}>
              <ExecutiveCard
                name={exec.name}
                role={exec.role}
                trait={exec.trait}
                quote={exec.quote}
                presence="idle"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
