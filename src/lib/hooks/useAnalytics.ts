"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, subDays, parseISO } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import { computeProductivityScore } from "@/lib/utils/productivity";
import { calculateStreak, datesSetFromCompletions } from "@/lib/utils/streaks";
import type { Habit, HabitCompletion, PomodoroSession } from "@/types";

export type AnalyticsData = {
  completionsLast30: HabitCompletion[];
  habits: Habit[];
  pomodoro14: PomodoroSession[];
  journalWeekCount: number;
  tasksDoneToday: number;
  habitsTotal: number;
  habitsCompletedToday: number;
  productivity: ReturnType<typeof computeProductivityScore>;
  streaksByHabit: { habitId: string; name: string; streak: number; color: string }[];
  heatmap12w: { date: string; ratio: number }[];
  pomodoroTodayCount: number;
};

export function useAnalytics(userId: string | undefined) {
  const supabase = useMemo(() => createClient(), []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);

  const refresh = useCallback(async () => {
    if (!userId) return;
    const today = format(new Date(), "yyyy-MM-dd");
    const d30 = format(subDays(new Date(), 29), "yyyy-MM-dd");
    const d14 = format(subDays(new Date(), 13), "yyyy-MM-dd");
    const weekStart = format(subDays(new Date(), 6), "yyyy-MM-dd");
    const heatStart = format(subDays(new Date(), 7 * 12 - 1), "yyyy-MM-dd");
    const [
      habitsRes,
      completionsRes,
      pomRes,
      journalRes,
      completionsHeatRes,
      tasksDoneRes,
    ] = await Promise.all([
      supabase.from("habits").select("*").eq("user_id", userId).eq("is_archived", false),
      supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", userId)
        .gte("completed_date", d30)
        .lte("completed_date", today),
      supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("session_date", d14)
        .lte("session_date", today),
      supabase
        .from("journal_entries")
        .select("id")
        .eq("user_id", userId)
        .gte("entry_date", weekStart)
        .lte("entry_date", today),
      supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", userId)
        .gte("completed_date", heatStart)
        .lte("completed_date", today),
      supabase
        .from("tasks")
        .select("id,updated_at")
        .eq("user_id", userId)
        .eq("status", "done")
        .gte("updated_at", `${heatStart}T00:00:00Z`),
    ]);

    const e =
      habitsRes.error ||
      completionsRes.error ||
      pomRes.error ||
      journalRes.error ||
      completionsHeatRes.error ||
      tasksDoneRes.error;
    if (e) {
      setError(e.message);
      setLoading(false);
      return;
    }

    const habits = (habitsRes.data ?? []) as Habit[];
    const completionsLast30 = (completionsRes.data ?? []) as HabitCompletion[];
    const pomodoro14 = (pomRes.data ?? []) as PomodoroSession[];
    const journalWeekCount = journalRes.data?.length ?? 0;
    const heatCompletions = (completionsHeatRes.data ?? []) as HabitCompletion[];
    const tasksDoneToday =
      tasksDoneRes.data?.filter((t) => {
        if (!t.updated_at) return false;
        return format(parseISO(t.updated_at as string), "yyyy-MM-dd") === today;
      }).length ?? 0;

    const completionsTodayIds = new Set(
      completionsLast30.filter((c) => c.completed_date === today).map((c) => c.habit_id),
    );
    const habitsTotal = habits.length;
    const habitsCompletedToday = completionsTodayIds.size;

    const pomodoroTodayCount = pomodoro14.filter((p) => p.session_date === today).length;

    const productivity = computeProductivityScore({
      habitsCompleted: habitsCompletedToday,
      habitsTotal: Math.max(habitsTotal, 1),
      pomodoroSessions: pomodoroTodayCount,
      journalEntriesThisWeek: journalWeekCount,
      tasksDoneToday,
    });

    const streaksByHabit = habits.map((h) => {
      const dates = datesSetFromCompletions(heatCompletions, h.id);
      return {
        habitId: h.id,
        name: h.name,
        color: h.color,
        streak: calculateStreak(dates, h.id, new Date()),
      };
    });
    streaksByHabit.sort((a, b) => b.streak - a.streak);

    const habitIds = new Set(habits.map((h) => h.id));
    const byDate: Record<string, Set<string>> = {};
    for (const c of heatCompletions) {
      if (!habitIds.has(c.habit_id)) continue;
      const d = c.completed_date.slice(0, 10);
      if (!byDate[d]) byDate[d] = new Set();
      byDate[d].add(c.habit_id);
    }

    const heatmap12w: { date: string; ratio: number }[] = [];
    for (let i = 7 * 12 - 1; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "yyyy-MM-dd");
      const done = byDate[d]?.size ?? 0;
      const ratio = habitsTotal > 0 ? done / habitsTotal : 0;
      heatmap12w.push({ date: d, ratio });
    }

    setData({
      completionsLast30,
      habits,
      pomodoro14,
      journalWeekCount,
      tasksDoneToday,
      habitsTotal,
      habitsCompletedToday,
      productivity,
      streaksByHabit,
      heatmap12w,
      pomodoroTodayCount,
    });
    setError(null);
    setLoading(false);
  }, [supabase, userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void refresh();
  }, [userId, refresh]);

  return { loading, error, data, refresh };
}
