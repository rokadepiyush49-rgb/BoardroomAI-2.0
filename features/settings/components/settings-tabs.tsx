"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { cn } from "@/lib/utils";
import { useWorkspace } from "@/hooks/use-workspace";
import { updateWorkspaceSettings } from "@/features/workspace/service";
import { notificationOptions } from "@/features/settings/types";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const tabs = ["Profile", "Workspace", "Appearance", "Notifications", "Billing"] as const;
type Tab = (typeof tabs)[number];

export function SettingsTabs() {
  const { data, error, loading, reload } = useWorkspace();
  const [tab, setTab] = useState<Tab>("Profile");

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [prefs, setPrefs] = useState<Record<string, boolean>>({});

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Seed the form once the workspace arrives, and re-seed after a reload.
  useEffect(() => {
    if (!data) return;
    setDisplayName(data.profile.displayName ?? "");
    setEmail(data.profile.email ?? "");
    setTitle(data.profile.title ?? "");
    setWorkspaceName(data.profile.workspaceName ?? "");
    setPrefs(data.workspace.notificationPrefs ?? {});
  }, [data]);

  async function save(payload: Parameters<typeof updateWorkspaceSettings>[0]) {
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      await updateWorkspaceSettings(payload);
      setSaved(true);
      reload();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save your settings.");
    } finally {
      setSaving(false);
    }
  }

  function saveProfile() {
    void save({ profile: { displayName, email, title, workspaceName } });
  }

  function togglePref(id: string, checked: boolean) {
    const next = { ...prefs, [id]: checked };
    setPrefs(next);
    // Switches save on change — there is no Save button on this tab.
    void save({ notificationPrefs: next });
  }

  if (loading) return <Skeleton className="h-80 w-full" />;
  if (error) return <ErrorState description={error} onRetry={reload} />;

  const plan = data?.workspace.plan;

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setTab(t);
              setSaved(false);
              setSaveError(null);
            }}
            className={cn(
              "shrink-0 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors lg:w-full",
              tab === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </nav>

      <div className="space-y-3">
        {saveError && <ErrorState description={saveError} />}

        {tab === "Profile" && (
          <Card className="p-0">
            <CardHeader>
              <CardTitle className="text-base">Profile</CardTitle>
              <CardDescription>How your name appears across board sessions and reports.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input id="fullName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Founder" />
              </div>
            </CardContent>
            <CardFooter className="items-center gap-3">
              <Button size="sm" onClick={saveProfile} isLoading={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              {saved && <span className="text-xs text-success">Saved.</span>}
            </CardFooter>
          </Card>
        )}

        {tab === "Workspace" && (
          <Card className="p-0">
            <CardHeader>
              <CardTitle className="text-base">Workspace</CardTitle>
              <CardDescription>Settings shared by everyone on your team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="workspaceName">Workspace name</Label>
                <Input
                  id="workspaceName"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  placeholder="Your company"
                />
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Default board composition</p>
                  <p className="text-xs text-muted-foreground">All 8 executives are seated by default for new sessions.</p>
                </div>
                <Badge tone="brass">8 of 8 active</Badge>
              </div>
            </CardContent>
            <CardFooter className="items-center gap-3">
              <Button size="sm" onClick={saveProfile} isLoading={saving}>
                {saving ? "Saving…" : "Save changes"}
              </Button>
              {saved && <span className="text-xs text-success">Saved.</span>}
            </CardFooter>
          </Card>
        )}

        {tab === "Appearance" && (
          <Card className="p-0">
            <CardHeader>
              <CardTitle className="text-base">Appearance</CardTitle>
              <CardDescription>
                Light is the default surface. Dark keeps the same near-monochrome system with the polarity flipped.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeToggle />
            </CardContent>
          </Card>
        )}

        {tab === "Notifications" && (
          <Card className="p-0">
            <CardHeader>
              <CardTitle className="text-base">Notifications</CardTitle>
              <CardDescription>Choose what the board should interrupt you for.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-1">
              {notificationOptions.map((pref, index) => (
                <div key={pref.id}>
                  <div className="flex items-center justify-between gap-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.description}</p>
                    </div>
                    <Switch
                      checked={prefs[pref.id] ?? false}
                      onCheckedChange={(checked) => togglePref(pref.id, checked)}
                      aria-label={pref.label}
                    />
                  </div>
                  {index < notificationOptions.length - 1 && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {tab === "Billing" && (
          <Card className="p-0">
            <CardHeader>
              <CardTitle className="text-base">Billing</CardTitle>
              <CardDescription>Manage your plan and seats.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between rounded-md border bg-background p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{plan?.name ?? "Founder"} plan</p>
                  <p className="text-xs text-muted-foreground">
                    {plan?.seatsUsed ?? 1} of {plan?.seatsTotal ?? 1} seats used
                  </p>
                </div>
                <p className="font-mono text-lg font-semibold text-foreground">{plan?.price ?? "—"}</p>
              </div>
            </CardContent>
            <CardFooter className="gap-2">
              <Button variant="outline" size="sm" disabled>
                Change plan
              </Button>
              <Button variant="ghost" size="sm" disabled>
                Cancel subscription
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
