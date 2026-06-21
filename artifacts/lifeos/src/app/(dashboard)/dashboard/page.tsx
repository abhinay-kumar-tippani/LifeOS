
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
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
import { Flame, Timer, ListChecks, BookOpen, Plus, Target, Sparkles, Info, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { todayISODate } from "@/lib/utils/dates";
import { fireCompletionConfetti } from "@/lib/utils/confetti";
import { cn } from "@/lib/utils/cn";

const QUOTES = [
  "Small steps, consistently taken, beat perfect plans never started.",
  "Focus is your superpower—protect it.",
  "Progress loves a quiet routine.",
  "Ship the next right thing, then iterate.",
];

const PRIORITY_STYLES: Record<string, string> = {
  high:   "priority-high",
  medium: "priority-medium",
  low:    "priority-low",
};

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
    <div className="flex h-20 items-end gap-1.5" aria-label="Last 7 days habit completions">
      {days.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
          <div
            className="w-full rounded-sm bg-gradient-to-t from-primary to-violet-400 transition-all duration-500"
            style={{ height: `${Math.max(8, (d.count / max) * 100)}%` }}
            aria-label={`${d.label}: ${d.count} completions`}
          />
          <span className="text-[10px] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function formatFocusTime(minutes: number) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
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
      .slice(0, 4);
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
    const { error } = await createTask({ title, status: "todo", priority: "medium" });
    if (error) {
      toast.error("Couldn't add task");
    } else {
      toast.success("Task added");
      setQuickTask("");
    }
  }

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting},{" "}
          <span className="gradient-text">{profile?.full_name?.split(" ")[0] ?? "friend"}</span>{" "}
          <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1.5 text-sm italic text-muted-foreground">&ldquo;{quote}&rdquo;</p>
      </div>

      {/* KPI cards */}
      <div className="animate-fade-up-1 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {hl ? (
          <>
            <Skeleton className="h-28 w-full rounded-xl skeleton-shimmer" />
            <Skeleton className="h-28 w-full rounded-xl skeleton-shimmer" />
          </>
        ) : (
          <>
            <StatCard
              label="Habits today"
              value={`${habitDone}/${habitTotal || "—"}`}
              hint={`${pct}% complete`}
              icon={<Flame className="h-4 w-4" />}
              progress={pct}
            />
            <StatCard
              label="Longest streak"
              value={maxStreak ? `${maxStreak} days` : "—"}
              hint="Across active habits"
              icon={<Flame className="h-4 w-4" />}
            />
          </>
        )}
        {pl ? (
          <Skeleton className="h-28 w-full rounded-xl skeleton-shimmer" />
        ) : (
          <StatCard
            label="Pomodoros today"
            value={todaySessions.length}
            hint={focusMin > 0 ? `${formatFocusTime(focusMin)} tracked` : "No sessions yet"}
            icon={<Timer className="h-4 w-4" />}
          />
        )}
        {al ? (
          <Skeleton className="h-28 w-full rounded-xl skeleton-shimmer" />
        ) : (
          <StatCard
            label="Productivity score"
            value={analytics?.productivity.score ?? 0}
            hint="Weighted daily"
            icon={<ListChecks className="h-4 w-4" />}
            action={<ProductivityScoreTooltip />}
            progress={typeof analytics?.productivity.score === "number" ? analytics.productivity.score : undefined}
          />
        )}
      </div>

      {/* Quick add task */}
      <form
        onSubmit={handleQuickAddTask}
        className="animate-fade-up-2 flex items-center gap-2 rounded-xl border border-border/60 bg-card/40 px-4 py-2.5 transition-colors focus-within:border-primary/40 focus-within:bg-card/60"
      >
        <Plus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
        <Input
          value={quickTask}
          onChange={(e) => setQuickTask(e.target.value)}
          placeholder="Quick add a task…"
          aria-label="Quick add a task"
          className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <Button type="submit" size="sm" disabled={!quickTask.trim()} className="shrink-0 shadow-sm shadow-primary/20">
          Add
        </Button>
      </form>

      {/* Goals + Sparkline */}
      <div className="animate-fade-up-3 grid gap-6 lg:grid-cols-2">
        <Card className="card-hover border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-pink-400" />
              This week&apos;s focus
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" asChild>
              <Link href="/goals">All goals <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {gl ? (
              <Skeleton className="h-16 w-full skeleton-shimmer" />
            ) : mainGoal || weeklyGoals.length > 0 ? (
              <div className="space-y-3">
                {mainGoal ? (
                  <div className="rounded-lg border border-border/40 bg-primary/5 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Main goal</p>
                    <p className="mt-0.5 text-sm font-medium">{mainGoal.title}</p>
                  </div>
                ) : null}
                {weeklyGoals.length > 0 ? (
                  <div>
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Weekly focus</p>
                    <ul className="space-y-1">
                      {weeklyGoals.slice(0, 3).map((g) => (
                        <li key={g.id} className="flex items-center gap-2 text-sm">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
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

        <Card className="card-hover border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4 text-violet-400" />
              Last 7 days
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" asChild>
              <Link href="/analytics">Analytics <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {hl ? (
              <Skeleton className="h-20 w-full skeleton-shimmer" />
            ) : (
              <WeeklySparkline completions={completions} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Habits + Top tasks */}
      <div className="animate-fade-up-4 grid gap-6 lg:grid-cols-2">
        <Card className="card-hover border-border/60 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Flame className="h-4 w-4 text-orange-400" />
              Habits today
              {habitTotal > 0 ? (
                <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
                  {habitDone}/{habitTotal}
                </span>
              ) : null}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {habitsErr ? (
              <ErrorState message="Couldn't load habits." onRetry={() => window.location.reload()} />
            ) : habits.length === 0 ? (
              <EmptyState
                title="No habits yet"
                description="Add habits to track them right here."
                action={{ label: "Add a habit", href: "/habits" }}
                className="border-0 bg-transparent py-8"
              />
            ) : (
              habits.map((h) => {
                const checked = doneToday.has(h.id);
                return (
                  <label
                    key={h.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-colors",
                      checked
                        ? "border-primary/20 bg-primary/5"
                        : "border-border/40 hover:border-border/60 hover:bg-accent/30",
                    )}
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
                    <span className="flex flex-1 items-center gap-2 text-sm">
                      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: h.color }} />
                      <span className={cn("font-medium", checked && "line-through text-muted-foreground")}>
                        {h.name}
                      </span>
                    </span>
                    {checked && (
                      <span className="text-[10px] font-medium text-primary">Done</span>
                    )}
                  </label>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <ListChecks className="h-4 w-4 text-blue-400" />
              Top tasks
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" asChild>
              <Link href="/tasks">Board <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {tl ? (
              <Skeleton className="h-20 w-full skeleton-shimmer" />
            ) : topTasks.length === 0 ? (
              <EmptyState
                title="No priority tasks"
                description="Add high or medium priority tasks to see them here."
                action={{ label: "Open Tasks", href: "/tasks" }}
                className="border-0 bg-transparent py-6"
              />
            ) : (
              topTasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/40 px-3 py-2.5 transition-colors hover:border-border/60 hover:bg-accent/20"
                >
                  <span className="truncate text-sm font-medium">{t.title}</span>
                  {t.priority ? (
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                        PRIORITY_STYLES[t.priority] ?? "bg-muted text-muted-foreground",
                      )}
                    >
                      {t.priority}
                    </span>
                  ) : null}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Journal + Focus */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-hover border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <BookOpen className="h-4 w-4 text-amber-400" />
              Recent journal
            </CardTitle>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs text-muted-foreground" asChild>
              <Link href="/journal">Open <ArrowRight className="h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            {jl ? (
              <Skeleton className="h-20 w-full skeleton-shimmer" />
            ) : recentJournal ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-400">
                    {recentJournal.entry_date}
                  </span>
                  {recentJournal.title ? (
                    <span className="truncate text-xs font-medium text-muted-foreground">{recentJournal.title}</span>
                  ) : null}
                </div>
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {recentJournal.content}
                </p>
              </div>
            ) : (
              <EmptyState
                title="No entries yet"
                description="Capture thoughts, moods, and reflections."
                action={{ label: "Write an entry", href: "/journal/new" }}
                className="border-0 bg-transparent py-6"
              />
            )}
          </CardContent>
        </Card>

        <Card className="card-hover border-border/60 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Timer className="h-4 w-4 text-emerald-400" />
              Focus today
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pl ? (
              <Skeleton className="h-20 w-full skeleton-shimmer" />
            ) : (
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-3xl font-bold tabular-nums tracking-tight">
                    {todaySessions.length}
                    <span className="ml-1 text-base font-normal text-muted-foreground">sessions</span>
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {focusMin > 0 ? `${formatFocusTime(focusMin)} of deep work` : "No sessions logged yet"}
                  </p>
                </div>
                {todaySessions.length > 0 && (
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-emerald-500/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                      style={{ width: `${Math.min(100, (todaySessions.length / 8) * 100)}%` }}
                    />
                  </div>
                )}
                <Button variant="outline" size="sm" className="w-fit gap-1.5 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300" asChild>
                  <Link href="/pomodoro">
                    <Timer className="h-3.5 w-3.5" />
                    Start Pomodoro
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
