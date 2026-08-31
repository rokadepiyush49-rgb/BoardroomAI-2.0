"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { pricingTiers } from "@/features/landing/mock";

export function Pricing() {
  return (
    <section id="pricing" className="container py-24">
      <SectionHeader
        eyebrow="Pricing"
        title="Bring an idea for free. Bring a fundraise for real."
        description="No seat minimums to start. Upgrade when the board becomes part of how you build."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer(0.08)}
        className="mt-12 grid gap-4 lg:grid-cols-3"
      >
        {pricingTiers.map((tier) => (
          <motion.div key={tier.name} variants={fadeUp}>
            {/*
              The featured tier is a polarity flip to the ink primary rather
              than a coloured border or a glow — switching a surface from
              canvas to ink is this system's chief emphasis cue.
            */}
            <Card
              className={cn(
                "flex h-full flex-col gap-6 p-6",
                tier.highlighted && "bg-primary text-primary-foreground",
              )}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-xl font-semibold">{tier.name}</h3>
                  {tier.highlighted && (
                    <span className="rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-medium">
                      Most founders pick this
                    </span>
                  )}
                </div>
                <p className={cn("text-sm", tier.highlighted ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {tier.description}
                </p>
              </div>

              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tabular-nums">{tier.price}</span>
                <span className={cn("text-sm", tier.highlighted ? "text-primary-foreground/70" : "text-muted-foreground")}>
                  {tier.cadence}
                </span>
              </div>

              <ul className="flex-1 space-y-2.5">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        tier.highlighted ? "text-primary-foreground/70" : "text-muted-soft",
                      )}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.highlighted ? "secondary" : "primary"}
                className={cn(tier.highlighted && "border-transparent hover:bg-primary-foreground/90")}
                asChild
              >
                <Link href="/meeting/new">{tier.ctaLabel}</Link>
              </Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
