"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Gavel, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    if (!isSupabaseConfigured()) {
      setError("Supabase has not been configured yet.");
      return;
    }

    setLoading(true);
    const { error: resetError } = await createClient().auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });
    setLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }
    setSuccess(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="surface-card w-full max-w-md rounded-md p-6">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Gavel className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold">Reset your password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We&apos;ll email you a link to choose a new password.</p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <p className="rounded-md border border-signal/25 bg-signal/5 p-4 text-sm text-foreground">
              Check your inbox for a reset link. It may take a minute to arrive.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/login">
                <ArrowLeft />
                Back to sign in
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" isLoading={loading}>
              <Mail />
              Send reset link
            </Button>
            {error && (
              <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">
                <ArrowLeft />
                Back to sign in
              </Link>
            </Button>
          </form>
        )}
      </section>
    </main>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <ForgotPasswordForm />
    </Suspense>
  );
}
