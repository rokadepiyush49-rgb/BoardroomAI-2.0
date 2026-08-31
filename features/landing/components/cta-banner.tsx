import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * The closing band is the system's one polarity flip: canvas-soft gives way
 * to the ink primary. That contrast is the whole depth cue — no gradient, no
 * glow, no border. The CTAs stay pill-shaped because this is still a
 * marketing-scale conversion moment.
 */
export function CtaBanner() {
  return (
    <section className="bg-primary py-24 text-primary-foreground">
      <div className="container text-center">
        <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold sm:text-4xl">
          Your board is already assembled.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/70">
          No scheduling. No prep deck. Submit your pitch and the debate starts in seconds.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            shape="pill"
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 sm:w-auto"
            asChild
          >
            <Link href="/meeting/new">
              Start your pitch
              <ArrowRight />
            </Link>
          </Button>
          <Button
            size="lg"
            shape="pill"
            variant="outline"
            className="w-full border-primary-foreground/25 text-primary-foreground hover:border-primary-foreground/50 hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            asChild
          >
            <Link href="/pricing">See pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
