"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ArrowRight, Check, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { AvatarFallback, Avatar } from "@/components/ui/avatar";
import { fetchExecutives } from "@/features/executives/service";
import type { ExecutiveProfile } from "@/features/executives/types";
import { industryOptions, stageOptions, type PitchFormValues } from "@/features/meeting-new/types";

export function PitchForm() {
  const router = useRouter();
  const [executiveRoster, setExecutiveRoster] = useState<ExecutiveProfile[]>([]);
  const [selectedExecs, setSelectedExecs] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Everyone is seated by default; the founder deselects who they don't want.
  useEffect(() => {
    fetchExecutives()
      .then((roster) => {
        setExecutiveRoster(roster);
        setSelectedExecs(roster.map((exec) => exec.id));
      })
      .catch(() => setSubmitError("Could not load the executive roster. Reload to try again."));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PitchFormValues>({
    defaultValues: { startupName: "", oneLiner: "", industry: "", stage: "", pitch: "" },
  });

  function toggleExec(id: string) {
    setSelectedExecs((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  }

  async function onSubmit(values: PitchFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const response = await fetch("/api/pitches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, executiveIds: selectedExecs }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Could not convene the board.");
      }
      const { meetingId } = (await response.json()) as { meetingId: string };
      // Stay in the loading state through navigation — the debate starts
      // as soon as the boardroom mounts.
      router.push(`/boardroom?meeting=${encodeURIComponent(meetingId)}`);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not convene the board.");
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <Card className="space-y-5 p-6">
        <div className="space-y-1.5">
          <Label htmlFor="startupName">Startup name</Label>
          <Input id="startupName" placeholder="Loadbay" invalid={Boolean(errors.startupName)} {...register("startupName", { required: true })} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="oneLiner">One-liner</Label>
          <Input
            id="oneLiner"
            placeholder="Freight-matching marketplace for regional carriers"
            invalid={Boolean(errors.oneLiner)}
            {...register("oneLiner", { required: true })}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="industry">Industry</Label>
            <Select id="industry" options={industryOptions} placeholder="Select an industry" {...register("industry", { required: true })} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="stage">Stage</Label>
            <Select id="stage" options={stageOptions} placeholder="Select a stage" {...register("stage", { required: true })} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="pitch">The pitch</Label>
          <Textarea
            id="pitch"
            rows={7}
            placeholder="Describe the problem, who has it, and how you solve it differently. Paste your one-pager if you have one."
            invalid={Boolean(errors.pitch)}
            {...register("pitch", { required: true })}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-dashed border-border p-4">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-surface-elevated text-muted-foreground">
              <Upload className="size-4" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Attach a deck (optional)</p>
              <p className="text-xs text-muted-foreground">PDF or PPTX, up to 20MB</p>
            </div>
          </div>
          <Button type="button" variant="outline" size="sm">
            Browse
          </Button>
        </div>
      </Card>

      <div className="space-y-6">
        <Card className="p-6">
          <CardHeader className="p-0">
            <CardTitle className="text-base">Who's seated</CardTitle>
            <CardDescription>{selectedExecs.length} of {executiveRoster.length} executives will evaluate this pitch.</CardDescription>
          </CardHeader>
          <CardContent className="mt-4 space-y-2 p-0">
            {executiveRoster.map((exec) => {
              const isSelected = selectedExecs.includes(exec.id);
              return (
                <button
                  key={exec.id}
                  type="button"
                  onClick={() => toggleExec(exec.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                    isSelected ? "border-foreground bg-surface-elevated" : "border-border hover:bg-surface-elevated",
                  )}
                >
                  <Avatar size="sm">
                    <AvatarFallback>{getInitials(exec.name)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{exec.name}</p>
                    <p className="text-xs text-muted-foreground">{exec.role}</p>
                  </div>
                  {isSelected && (
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>

        {submitError && (
          <p role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {submitError}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting} disabled={selectedExecs.length === 0}>
          {!isSubmitting && (
            <>
              Convene the board
              <ArrowRight />
            </>
          )}
          {isSubmitting && "Convening the board…"}
        </Button>
      </div>
    </form>
  );
}
