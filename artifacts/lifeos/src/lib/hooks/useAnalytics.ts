"use client";

import { useCallback } from "react";
import { format, subDays, parseISO, differenceInDays, startOfDay } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { computeProductivityScore } from "@/lib/utils/productivity";
import { calculateStreak, calculateBestStreak, datesSetFromCompletions } from "@/lib/utils/streaks";
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
  streaksByHabit: { habitId: string; name: string; streak: number; bestStreak: number; color: string }[];
  heatmap12w: { date: string; ratio: number }[];
  pomodoroTodayCount: number;
  /** Completions in the 30 days before the current chart window */
  completionsPrevious30: number;
  /** Chart window length in calendar days */
  windowDays: number;
  /** ISO date string — the effective start of chart data (max of 30daysAgo vs accountCreatedAt) */
  chartStartDate: string;
  /** How many calendar days the account has existed (0 = created today) */
  accountAgeDays: number;
};

export function useAnalytics(userId: string | undefined, rangeDays: number = 30) {
  const supabase = getSupabaseClient();

  const { data, isLoading: loading, error: queryErr, refetch } = useQuery({
    queryKey: ["analytics", userId, rangeDays],
    queryFn: async () => {
      if (!userId) throw new Error("No user");
      const today = format(new Date(), "yyyy-MM-dd");
      const heatStart = format(subDays(new Date(), 7 * 12 - 1), "yyyy-MM-dd");
      const weekStart = format(subDays(new Date(), 6), "yyyy-MM-dd");

      // -- Fetch account creation date first --
      const { data: profileData } = await supabase
        .from("profiles")
        .select("created_at")
        .eq("id", userId)
        .single();

      const accountCreatedAt = profileData?.created_at
        ? startOfDay(new Date(profileData.created_at))
        : subDays(startOfDay(new Date()), rangeDays - 1);

      const periodStartAgo = subDays(startOfDay(new Date()), rangeDays - 1);
      // chartStartDate = the later of (periodStartAgo) and (accountCreatedAt)
      const chartStartDateObj = accountCreatedAt > periodStartAgo ? accountCreatedAt : periodStartAgo;
      const chartStartDate = format(chartStartDateObj, "yyyy-MM-dd");
      const accountAgeDays = differenceInDays(startOfDay(new Date()), accountCreatedAt);

      const d14 = format(subDays(new Date(), 13), "yyyy-MM-dd");
      const previousPeriodStartObj = subDays(chartStartDateObj, rangeDays);
      const previousPeriodStart = format(previousPeriodStartObj, "yyyy-MM-dd");
      const streakStart = format(
        subDays(startOfDay(new Date()), Math.max(accountAgeDays, 364)),
        "yyyy-MM-dd",
      );

      const showArchived =
        typeof window !== "undefined" && localStorage.getItem("lifeos-archived") === "1";

      const habitsQuery = supabase.from("habits").select("*").eq("user_id", userId);

      const [
        habitsRes,
        completionsRes,
        completionsPrevRes,
        completionsStreakRes,
        pomRes,
        journalRes,
        completionsHeatRes,
        tasksDoneRes,
      ] = await Promise.all([
        habitsQuery,
        supabase
          .from("habit_completions")
          .select("*")
          .eq("user_id", userId)
          .gte("completed_date", chartStartDate)
          .lte("completed_date", today),
        supabase
          .from("habit_completions")
          .select("*")
          .eq("user_id", userId)
          .gte("completed_date", previousPeriodStart)
          .lt("completed_date", chartStartDate),
        supabase
          .from("habit_completions")
          .select("*")
          .eq("user_id", userId)
          .gte("completed_date", streakStart)
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
        completionsPrevRes.error ||
        completionsStreakRes.error ||
        pomRes.error ||
        journalRes.error ||
        completionsHeatRes.error ||
        tasksDoneRes.error;
      if (e) {
        throw new Error(e.message);
      }

      const habits = ((habitsRes.data ?? []) as Habit[]).filter(
        (h) => showArchived || !h.is_archived,
      );
      const completionsLast30 = (completionsRes.data ?? []) as HabitCompletion[];
      const completionsPrevious30 = (completionsPrevRes.data ?? []).length;
      const completionsForStreaks = (completionsStreakRes.data ?? []) as HabitCompletion[];
      const windowDays = Math.max(1, differenceInDays(startOfDay(new Date()), chartStartDateObj) + 1);
      const pomodoro14 = (pomRes.data ?? []) as PomodoroSession[];
      const journalWeekCount = journalRes.data?.length ?? 0;
      const heatCompletions = (completionsHeatRes.data ?? []) as HabitCompletion[];
      const tasksDoneToday =
        tasksDoneRes.data?.filter((t: { id: string; updated_at: string | null }) => {
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
        const dates = datesSetFromCompletions(completionsForStreaks, h.id);
        return {
          habitId: h.id,
          name: h.name,
          color: h.color,
          streak: calculateStreak(dates, h.id, new Date()),
          bestStreak: calculateBestStreak(dates),
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

      const result: AnalyticsData = {
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
        chartStartDate,
        accountAgeDays,
        completionsPrevious30,
        windowDays,
      };
      
      return result;
    },
    enabled: !!userId,
  });

  return { loading, error: queryErr?.message ?? null, data: data ?? null, refresh: async () => { await refetch(); } };
}
