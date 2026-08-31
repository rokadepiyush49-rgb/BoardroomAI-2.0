"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Github, Chrome, Gavel, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ensureProfile } from "@/lib/supabase/profile";

type AuthMode = "sign-in" | "sign-up";
type OAuthProvider = "google" | "github";

const MIN_PASSWORD_LENGTH = 8;

function mapAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) return "Email or password is incorrect.";
  if (lower.includes("user already registered")) return "An account with this email already exists. Sign in instead.";
  if (lower.includes("password")) return "Use at least 8 characters with letters and numbers.";
  if (lower.includes("email not confirmed")) return "Confirm your email before signing in.";
  return message;
}

function LoginForm() {
  const params = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(
    params.get("error") ? "We could not complete sign-in. Please try again." : null,
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<OAuthProvider | "email" | null>(null);
  const next = params.get("next")?.startsWith("/") ? params.get("next")! : "/dashboard";

  async function signInWithOAuth(provider: OAuthProvider) {
    if (!isSupabaseConfigured()) {
      setMessage("Supabase has not been configured yet. Add the project URL and anon key to .env.local.");
      return;
    }
    setLoading(provider);
    setMessage(null);
    setSuccess(null);
    const { error: signInError } = await createClient().auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (signInError) {
      setMessage(signInError.message);
      setLoading(null);
    }
  }

  function validateEmailPassword() {
    const errors: Record<string, string> = {};
    if (!email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Password is required.";
    else if (password.length < MIN_PASSWORD_LENGTH) errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
    if (mode === "sign-up" && password !== confirmPassword) errors.confirmPassword = "Passwords do not match.";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleEmailAuth(event: React.FormEvent) {
    event.preventDefault();
    if (!isSupabaseConfigured()) {
      setMessage("Supabase has not been configured yet. Add the project URL and anon key to .env.local.");
      return;
    }
    if (!validateEmailPassword()) return;

    setLoading("email");
    setMessage(null);
    setSuccess(null);
    const supabase = createClient();

    if (mode === "sign-up") {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
      });
      setLoading(null);
      if (error) {
        setMessage(mapAuthError(error.message));
        return;
      }
      if (data.session) {
        await ensureProfile(data.user!);
        return;
      }
      setSuccess("Check your email to confirm your account, then sign in.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(null);
    if (error) {
      setMessage(mapAuthError(error.message));
      return;
    }
    if (data.user) await ensureProfile(data.user);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <section className="surface-card w-full max-w-md rounded-md p-6">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Gavel className="size-5" />
          </span>
          <h1 className="text-2xl font-semibold">Welcome to BoardroomAI</h1>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to convene your AI board.</p>
        </div>

        <div className="mb-6 flex rounded-md bg-muted p-1">
          {(["sign-in", "sign-up"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setMode(value);
                setMessage(null);
                setSuccess(null);
                setFieldErrors({});
              }}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                mode === value ? "bg-surface text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {value === "sign-in" ? "Sign in" : "Create account"}
            </button>
          ))}
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              invalid={Boolean(fieldErrors.email)}
              placeholder="you@company.com"
            />
            {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "sign-in" && (
                <Link href="/auth/forgot-password" className="text-xs text-signal hover:underline">
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              invalid={Boolean(fieldErrors.password)}
              placeholder={mode === "sign-up" ? "At least 8 characters" : "Your password"}
            />
            {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
          </div>

          {mode === "sign-up" && (
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                invalid={Boolean(fieldErrors.confirmPassword)}
                placeholder="Repeat your password"
              />
              {fieldErrors.confirmPassword && <p className="text-xs text-destructive">{fieldErrors.confirmPassword}</p>}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full" isLoading={loading === "email"}>
            <Mail />
            {mode === "sign-in" ? "Sign in with email" : "Create account"}
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or continue with</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <div className="space-y-3">
          <Button size="lg" variant="outline" className="w-full" onClick={() => signInWithOAuth("google")} isLoading={loading === "google"}>
            <Chrome /> Continue with Google
          </Button>
          <Button size="lg" variant="outline" className="w-full" onClick={() => signInWithOAuth("github")} isLoading={loading === "github"}>
            <Github /> Continue with GitHub
          </Button>
        </div>

        {success && (
          <p role="status" className="mt-5 rounded-md border border-signal/25 bg-signal/5 p-3 text-sm text-foreground">
            {success}
          </p>
        )}
        {message && (
          <p role="alert" className="mt-5 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">By continuing, you agree to use this workspace responsibly.</p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  );
}
