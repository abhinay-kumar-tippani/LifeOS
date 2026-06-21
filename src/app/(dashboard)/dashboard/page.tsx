"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";
import { useTasks } from "@/lib/hooks/useTasks";
import { useJournal } from "@/lib/hooks/useJournal";
import { usePomodoro } from "@/lib/hooks/usePomodoro";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { useGoals } from "@/lib/hooks/useGoals";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Flame, Timer, ListChecks, BookOpen, Plus, Target, Sparkles, Info } from "lucide-react";
import { toast } from "sonner";
import { todayISODate } from "@/lib/utils/dates";
import { fireCompletionConfetti } from "@/lib/utils/confetti";

const QUOTES = [
  "Small steps, consistently taken, beat perfect plans never started.",
  "Focus is your superpower—protect it.",
  "Progress loves a quiet routine.",
  "Ship the next right thing, then iterate.",
];

function ProductivityScoreTooltip() {
  return (
    <span className="group relative inline-flex">
      <Info className="h-3.5 w-3.5 cursor-help text-muted-foreground" aria-hidden />
      <span
        role="tooltip"
        className="pointer-events-none absolute right-0 top-full z-10 mt-2 hidden w-60 rounded-md border border-border/60 bg-popover p-3 text-xs text-popover-foreground shadow-md group-hover:block group-focus-within:block"
      >
        Weighted score: habits 40%, pomodoro 30%, journal 20%, tasks 10%. Calculated daily.
      </span>
    </span>
  );
}

function WeeklySparkline({ completions }: { completions: { completed_date: string }[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const iso = d.toISOString().slice(0, 10);
    const count = completions.filter((c) => c.completed_date.slice(0, 10) === iso).length;
    return { label: d.toLocaleDateString(undefined, { weekday: "narrow" }), count };
  });
  const max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div className="flex h-16 items-end gap-1.5" aria-label="Last 7 days habit completions">
      {days.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div
            className="w-full rounded-sm bg-primary/70 transition-all"
            style={{ height: `${(d.count / max) * 100}%`, minHeight: 4 }}
            aria-label={`${d.label}: ${d.count} completions`}
          />
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { profile, user } = useUser();
  const today = todayISODate();
  const uid = user?.id;
  const { habits, completions, fetchCompletions, toggleCompletion, loading: hl, error: habitsErr } = useHabits(uid);
  const { tasks, loading: tl, createTask } = useTasks(uid);
  const { entries, loading: jl } = useJournal(uid);
  const { todaySessions, loading: pl } = usePomodoro(uid);
  const { data: analytics, loading: al } = useAnalytics(uid);
  const { mainGoal, weeklyGoals, isLoading: gl } = useGoals(uid);

  const [quickTask, setQuickTask] = useState("");

  useEffect(() => {
    if (!uid) return;
    void fetchCompletions();
  }, [uid, fetchCompletions]);

  const quote = useMemo(() => QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length], []);

  const doneToday = useMemo(() => {
    const set = new Set(
      completions.filter((c) => c.completed_date.slice(0, 10) === today).map((c) => c.habit_id),
    );
    return set;
  }, [completions, today]);

  const habitTotal = habits.length;
  const habitDone = habits.filter((h) => doneToday.has(h.id)).length;
  const pct = habitTotal ? Math.round((habitDone / habitTotal) * 100) : 0;

  const topTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "done")
      .filter((t) => t.priority === "high" || t.priority === "medium")
      .slice(0, 3);
  }, [tasks]);

  const recentJournal = entries[0];
  const focusMin = todaySessions.filter((s) => s.completed).reduce((a, s) => a + s.duration_minutes, 0);
  const maxStreak = analytics
    ? Math.max(0, ...analytics.streaksByHabit.map((s) => s.streak))
    : 0;

  const greeting =
    new Date().getHours() < 12
      ? "Good morning"
      : new Date().getHours() < 17
        ? "Good afternoon"
        : "Good evening";

  async function handleQuickAddTask(e: React.FormEvent) {
    e.preventDefault();
    const title = quickTask.trim();
    if (!title || !uid) return;
    const { error } = await createTask({
      title,
      status: "todo",
      priority: "medium",
    });
    if (error) {
      toast.error("Couldn't add task");
    } else {
      toast.success("Task added");
      setQuickTask("");
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, {profile?.full_name?.split(" ")[0] ?? "friend"} <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{quote}</p>
      </div>

      {/* KPI cards — skeleton while loading */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {hl ? (
          <Skeleton className="h-28 w-full rounded-xl" />
        ) : (
          <StatCard
            label="Habits today"
            value={`${habitDone}/${habitTotal || "—"}`}
            hint={`${pct}% complete`}
            icon={<Flame className="h-4 w-4" />}
          />
        )}
        {hl || al ? (
          <Skeleton className="h-28 w-full rounded-xl" />
        ) : (
          <StatCard
            label="Longest habit streak"
            value={maxStreak ? `${maxStreak} days` : "—"}
            hint="Across active habits"
            icon={<Flame className="h-4 w-4" />}
          />
        )}
        {pl ? (
          <Skeleton className="h-28 w-full rounded-xl" />
        ) : (
          <StatCard
            label="Pomodoros today"
            value={todaySessions.length}
            hint="Sessions logged"
            icon={<Timer className="h-4 w-4" />}
          />
        )}
        {al ? (
          <Skeleton className="h-28 w-full rounded-xl" />
        ) : (
          <StatCard
            label="Productivity score"
            value={analytics?.productivity.score ?? 0}
            hint="Weighted daily"
            icon={<ListChecks className="h-4 w-4" />}
            action={<ProductivityScoreTooltip />}
          />
        )}
      </div>

      {/* Quick add task bar */}
      <form
        onSubmit={handleQuickAddTask}
        className="flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-3 py-2"
      >
        <Plus className="h-4 w-4 text-muted-foreground" aria-hidden />
        <Input
          value={quickTask}
          onChange={(e) => setQuickTask(e.target.value)}
          placeholder="Add a task…"
          aria-label="Quick add a task"
          className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="sm" disabled={!quickTask.trim()}>
          Add
        </Button>
      </form>

      {/* Goals snippet + Weekly sparkline */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-4 w-4" />
              This week&apos;s focus
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/goals">All goals</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {gl ? (
              <Skeleton className="h-16 w-full" />
            ) : mainGoal || weeklyGoals.length > 0 ? (
              <div className="space-y-3">
                {mainGoal ? (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Main goal</p>
                    <p className="mt-1 text-sm font-medium">{mainGoal.title}</p>
                  </div>
                ) : null}
                {weeklyGoals.length > 0 ? (
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Weekly focus</p>
                    <ul className="mt-1 space-y-1 text-sm">
                      {weeklyGoals.slice(0, 3).map((g) => (
                        <li key={g.id} className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                          <span className="line-clamp-1">{g.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <EmptyState
                title="No goals yet"
                description="Set a main goal and weekly focus to stay aligned."
                action={{ label: "Set a goal", href: "/goals" }}
                className="border-0 bg-transparent py-6"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4" />
              Last 7 days
            </CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/analytics">Analytics</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {hl ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <WeeklySparkline completions={completions} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Habits today + Top tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Habits today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {habitsErr ? (
              <ErrorState message="Couldn't load habits." onRetry={() => window.location.reload()} />
            ) : habits.length === 0 ? (
              <EmptyState
                title="No habits yet"
                description="Add habits to track them from your dashboard."
                action={{ label: "Go to Habits", href: "/habits" }}
                className="border-0 bg-transparent py-8"
              />
            ) : (
              habits.map((h) => {
                const checked = doneToday.has(h.id);
                return (
                  <label
                    key={h.id}
                    className="flex cursor-pointer items-center gap-3 rounded-lg border border-border/40 px-3 py-2"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={async () => {
                        const { error } = await toggleCompletion(h.id, today, checked);
                        if (error) toast.error(error);
                        else {
                          if (!checked) fireCompletionConfetti();
                          await fetchCompletions();
                        }
                      }}
                      aria-label={`Complete ${h.name}`}
                    />
                    <span className="flex items-center gap-2 text-sm font-medium">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: h.color }} />
                      {h.name}
                    </span>
                  </label>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Top tasks</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/tasks">Board</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {tl ? (
              <Skeleton className="h-20 w-full" />
            ) : topTasks.length === 0 ? (
              <EmptyState
                title="No priority tasks"
                description="Add high or medium priority tasks to see them here."
                action={{ label: "Open Tasks", href: "/tasks" }}
                className="border-0 bg-transparent py-6"
              />
            ) : (
              topTasks.map((t) => (
                <div key={t.id} className="rounded-lg border border-border/40 px-3 py-2 text-sm">
                  <span className="font-medium">{t.title}</span>
                  <span className="ml-2 text-xs text-muted-foreground">{t.priority}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent journal + Focus */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent journal</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/journal">Open</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {jl ? (
              <Skeleton className="h-20 w-full" />
            ) : recentJournal ? (
              <div>
                <p className="text-xs text-muted-foreground">
                  {recentJournal.entry_date} · {recentJournal.title || "Untitled"}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{recentJournal.content}</p>
              </div>
            ) : (
              <EmptyState
                title="No journal entries"
                description="Capture thoughts, moods, and reflections."
                action={{ label: "Write an entry", href: "/journal/new" }}
                className="border-0 bg-transparent py-6"
              />
            )}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-4 w-4" />
              Focus today
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pl ? (
              <Skeleton className="h-20 w-full" />
            ) : (
              <>
                <p className="text-2xl font-bold">{todaySessions.length} sessions</p>
                <p className="text-sm text-muted-foreground">{focusMin} minutes tracked</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href="/pomodoro">Start Pomodoro</Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}