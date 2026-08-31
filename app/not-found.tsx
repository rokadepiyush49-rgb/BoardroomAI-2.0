import Link from "next/link";
import { Gavel, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-xl border bg-surface text-foreground">
        <Gavel className="size-6" />
      </span>
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-soft">404</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">The board didn't find this page</h1>
        <p className="max-w-md text-base text-muted-foreground">
          It may have moved, or the session it belonged to has ended.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </Button>
    </div>
  );
}
