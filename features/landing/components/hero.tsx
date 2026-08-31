"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/shared/score-card";
import { Badge } from "@/components/ui/badge";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { heroStats } from "@/features/landing/mock";

/**
 * The hero is the only place in the product where the mesh gradient and the
 * column guide appear. The gradient is a single object — a coral → amber →
 * teal bloom erupting from the lower half of the band and dissolving into
 * the page — and it is never miniaturised into a button fill or a section
 * stripe elsewhere. The hairline column guide behind it telegraphs the
 * layout grid as a structural landmark; it drops out below 600px, where the
 * columns stop meaning anything.
 *
 * Layout is a single centred column: headline, lead, CTA pair, then the live
 * consensus panel sitting in front of the bloom. No split hero.
 */
export function Hero() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="column-guide" aria-hidden />
      <div className="mesh-gradient" aria-hidden />

      <div className="container relative z-10 flex flex-col items-center py-16 text-center lg:py-24 lg:pb-32">
        <motion.div
          initial={reducedMotion ? undefined : "hidden"}
          animate="visible"
          variants={staggerContainer(0.08)}
          className="flex max-w-3xl flex-col items-center gap-6"
        >
          <motion.div variants={fadeUp}>
            <Badge tone="brass" className="gap-2 py-1.5 pl-1.5 pr-3.5">
              <span className="rounded-full bg-signal px-2 py-0.5 text-xs font-medium text-signal-foreground">
                Live
              </span>
              <span className="text-muted-foreground">A board session is running right now</span>
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-balance text-4xl font-semibold sm:text-5xl lg:text-6xl"
          >
            Pitch to a board that never adjourns.
          </motion.h1>

          <motion.p variants={fadeUp} className="max-w-2xl text-balance text-lg text-muted-foreground">
            Eight AI executives — CEO, CFO, CTO, VC, and more — debate your startup live, then hand you the
            investment decision, financials, and roadmap a real board takes weeks to produce.
          </motion.p>

          {/* Marketing-scale CTAs: the one context where pill geometry is correct. */}
          <motion.div
            variants={fadeUp}
            className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center"
          >
            <Button size="lg" shape="pill" asChild>
              <Link href="/meeting/new">
                Start your pitch
                <ArrowRight />
              </Link>
            </Button>
            <Button size="lg" shape="pill" variant="secondary" asChild>
              <Link href="/reports">
                <PlayCircle />
                See a sample report
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="surface-card mt-14 flex w-full max-w-sm flex-col items-center gap-5 rounded-md p-6"
        >
          <p className="text-xs font-medium text-muted-soft">Board consensus — live</p>
          <ScoreCard label="Investment score" score={87} verdict="Strong buy signal, 6–2 in favour" size="lg" />
          <div className="grid w-full grid-cols-2 gap-3 text-center">
            <div className="rounded-md border p-3">
              <p className="text-lg font-semibold tabular-nums">6</p>
              <p className="text-xs text-muted-soft">Voted yes</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-lg font-semibold tabular-nums">2</p>
              <p className="text-xs text-muted-soft">Voted no</p>
            </div>
          </div>
        </motion.div>

        <motion.dl
          initial={reducedMotion ? undefined : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-14 grid w-full max-w-2xl grid-cols-1 gap-8 border-t pt-8 sm:grid-cols-3"
        >
          {heroStats.map((stat) => (
            <div key={stat.label}>
              <dd className="text-2xl font-semibold tabular-nums tracking-tight">{stat.value}</dd>
              <dt className="mt-1 text-sm text-muted-soft">{stat.label}</dt>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
