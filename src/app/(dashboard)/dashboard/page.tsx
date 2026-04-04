"use client";

import { useEffect, useMemo } from "react";
import { format } from "date-fns";
import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";
import { useTasks } from "@/lib/hooks/useTasks";
import { useJournal } from "@/lib/hooks/useJournal";
import { usePomodoro } from "@/lib/hooks/usePomodoro";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { StatCard } from "@/components/shared/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Flame, Timer, ListChecks, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { todayISODate } from "@/lib/utils/dates";

const QUOTES = [
  "Small steps, consistently taken, beat perfect plans never started.",
  "Focus is your superpower—protect it.",
  "Progress loves a quiet routine.",
  "Ship the next right thing, then iterate.",
];

export default function DashboardPage() {
  const { profile, user } = useUser();
  const today = todayISODate();
  const uid = user?.id;
  const { habits, completions, fetchCompletions, toggleCompletion, loading: hl } = useHabits(uid);
  const { tasks, loading: tl } = useTasks(uid);
  const { entries, loading: jl } = useJournal(uid);
  const { todaySessions, loading: pl } = usePomodoro(uid);
  const { data: analytics, loading: al } = useAnalytics(uid);

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

  if (!user || hl || tl || jl || pl || al) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {greeting}, {profile?.full_name?.split(" ")[0] ?? "friend"} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {format(new Date(), "EEEE, MMMM d, yyyy")} · {quote}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Habits today"
          value={`${habitDone}/${habitTotal || "—"}`}
          hint={`${pct}% complete`}
          icon={<Flame className="h-4 w-4" />}
        />
        <StatCard
          label="Longest habit streak"
          value={maxStreak ? `${maxStreak} days` : "—"}
          hint="Across active habits"
          icon={<Flame className="h-4 w-4" />}
        />
        <StatCard
          label="Pomodoros today"
          value={todaySessions.length}
          hint="Sessions logged"
          icon={<Timer className="h-4 w-4" />}
        />
        <StatCard
          label="Productivity score"
          value={analytics?.productivity.score ?? 0}
          hint="Weighted daily"
          icon={<ListChecks className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle className="text-base">Habits today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {habits.length === 0 ? (
              <p className="text-sm text-muted-foreground">Add habits to see them here.</p>
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
                        else await fetchCompletions();
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
            {topTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No open priority tasks.</p>
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/60 bg-card/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent journal</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/journal">Open</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentJournal ? (
              <div>
                <p className="text-xs text-muted-foreground">
                  {recentJournal.entry_date} · {recentJournal.title || "Untitled"}
                </p>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{recentJournal.content}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No entries yet.</p>
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
            <p className="text-2xl font-bold">{todaySessions.length} sessions</p>
            <p className="text-sm text-muted-foreground">{focusMin} minutes tracked</p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/pomodoro">Start Pomodoro</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
