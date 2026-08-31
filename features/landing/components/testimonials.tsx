"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getInitials } from "@/lib/utils";
import { testimonials } from "@/features/landing/mock";

export function Testimonials() {
  return (
    <section className="border-y bg-surface py-24">
      <div className="container">
        <SectionHeader eyebrow="Founders on the record" title="What the board catches before a real one does" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer(0.08)}
          className="mt-12 grid gap-4 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={fadeUp}>
              <Card className="flex h-full flex-col gap-3 p-4">
                <Quote className="size-5 text-muted-soft" aria-hidden />
                <p className="flex-1 text-base leading-6 text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
                <div className="flex items-center gap-3 border-t pt-3">
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
                    <p className="text-xs text-muted-soft">{testimonial.title}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
