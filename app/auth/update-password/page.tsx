"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Gavel, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

const MIN_PASSWORD_LENGTH = 8;

function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    createClient().auth.getSession().then(({ data: { session } }) => {
      setReady(Boolean(session));
    });
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(`Use at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!isSupabaseConfigured()) {
      setError("Supabase has not been configured yet.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }
    router.replace("/dashboard");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-4">
        <section className="surface-card w-full max-w-md rounded-md p-6 text-center">
          <p className="text-sm text-muted-foreground">Open the reset link from your email to set a new password.</p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/auth/forgot-password">Request a new link</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4">
      <section className="surface-card w-full max-w-md rounded-md p-6">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Gavel className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold">Choose a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">You&apos;ll be signed in once your password is updated.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="password">New password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm password</Label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat your password"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" isLoading={loading}>
            <Lock />
            Update password
          </Button>
          {error && (
            <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </p>
          )}
        </form>
      </section>
    </main>
  );
}

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
