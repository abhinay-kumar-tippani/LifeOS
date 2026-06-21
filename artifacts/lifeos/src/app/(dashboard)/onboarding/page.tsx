
import { useState } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import { ArrowRight, Check, Sparkles, Target, Timer, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";
import { useGoals } from "@/lib/hooks/useGoals";
import { toast } from "sonner";
import { HABIT_COLORS } from "@/lib/utils/habitColors";

const STARTER_HABITS = [
  { name: "Wake early", description: "Rise before 7am", color: HABIT_COLORS[0].hex, icon: "sun" },
  { name: "Exercise", description: "Move your body for 20+ minutes", color: HABIT_COLORS[6].hex, icon: "dumbbell" },
  { name: "Read", description: "Read for 20 minutes", color: HABIT_COLORS[2].hex, icon: "book" },
  { name: "Deep focus", description: "60+ minutes of focused work", color: HABIT_COLORS[3].hex, icon: "brain" },
  { name: "Meditate", description: "10 minutes of stillness", color: HABIT_COLORS[7].hex, icon: "wind" },
  { name: "Drink water", description: "2L of water through the day", color: HABIT_COLORS[8].hex, icon: "droplet" },
];

const TOUR_STEPS = [
  { icon: ListChecks, title: "Dashboard", description: "Your daily overview — habits, tasks, focus, and goals at a glance." },
  { icon: Sparkles, title: "Habits grid", description: "Track daily habits across weeks. Only today is editable." },
  { icon: Timer, title: "Pomodoro", description: "Start a focus session to log deep work time." },
  { icon: Target, title: "Tasks & Matrix", description: "Drag tasks across the Eisenhower matrix to prioritize." },
];

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const { user, profile, refreshProfile } = useUser();
  const { createHabit } = useHabits(user?.id);
  const { createGoal } = useGoals(user?.id);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [mainGoal, setMainGoal] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function togglePick(name: string) {
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  async function finish() {
    setSubmitting(true);
    try {
      const chosen = STARTER_HABITS.filter((h) => picked.has(h.name));
      for (const h of chosen) {
        const { error } = await createHabit({
          name: h.name,
          description: h.description,
          color: h.color,
          icon: h.icon,
          frequency: "daily",
          target_days: 7,
        });
        if (error) toast.error(`Couldn't add ${h.name}`);
      }
      const trimmedGoal = mainGoal.trim();
      if (trimmedGoal) {
        const { error } = await createGoal({
          title: trimmedGoal,
          type: "main",
          status: "active",
          progress: 0,
        });
        if (error) toast.error("Couldn't save main goal");
      }
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("lifeos-onboarding-complete", "1");
        }
      } catch { /* ignore */ }
      toast.success("You're all set!");
      navigate("/dashboard");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-2xl flex-col justify-center px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Step {step + 1} of 4
        </p>
        <Button variant="ghost" size="sm" onClick={finish} disabled={submitting} aria-label="Skip onboarding">
          Skip
        </Button>
      </div>

      <div className="mb-2 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${((step + 1) / 4) * 100}%` }}
          aria-hidden
        />
      </div>

      {step === 0 ? (
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome to LifeOS{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="mt-3 text-base text-muted-foreground">
              Let&apos;s set up your productivity OS in under a minute. We&apos;ll start with a few starter habits you can edit any time.
            </p>
          </div>
          <Button size="lg" onClick={() => setStep(1)} aria-label="Get started">
            Get started
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Pick a few starter habits</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Choose up to 6 — you can edit, archive, or add more anytime from the Habits page.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {STARTER_HABITS.map((h) => {
              const isPicked = picked.has(h.name);
              return (
                <button
                  key={h.name}
                  onClick={() => togglePick(h.name)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border p-4 text-left transition",
                    isPicked
                      ? "border-primary bg-primary/5"
                      : "border-border/60 bg-card/40 hover:border-border",
                  )}
                  aria-pressed={isPicked}
                >
                  <span
                    className="h-3 w-3 rounded-full ring-2 ring-background"
                    style={{ backgroundColor: h.color }}
                    aria-hidden
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.description}</p>
                  </div>
                  {isPicked ? (
                    <Check className="h-4 w-4 text-primary" aria-hidden />
                  ) : null}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
            <Button onClick={() => setStep(2)} disabled={picked.size === 0}>
              Continue ({picked.size})
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Set a main goal (optional)</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              One big thing you&apos;re working toward this quarter. Keep it short and specific.
            </p>
          </div>
          <input
            type="text"
            value={mainGoal}
            onChange={(e) => setMainGoal(e.target.value)}
            placeholder="e.g. Launch v1 of my SaaS product"
            className="w-full rounded-md border border-input bg-input-background px-3 py-2 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Main goal"
          />
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>
              {mainGoal.trim() ? "Continue" : "Skip for now"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Quick tour</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Here&apos;s where to find the core flows. Press{" "}
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">⌘K</kbd>{" "}
              anytime to open the command palette.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {TOUR_STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.title} className="border-border/60 bg-card/40">
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div>
                      <p className="font-medium">{s.title}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={finish} disabled={submitting} aria-label="Open dashboard">
              {submitting ? "Setting up…" : "Open dashboard"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}