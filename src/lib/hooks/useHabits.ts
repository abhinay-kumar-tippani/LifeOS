"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Habit, HabitCompletion } from "@/types";

export function useHabits(userId: string | undefined) {
  const supabase = useMemo(() => createClient(), []);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    if (!userId) return;
    const { data, error: e } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .eq("is_archived", false)
      .order("created_at", { ascending: true });
    if (e) setError(e.message);
    else {
      setError(null);
      setHabits((data ?? []) as Habit[]);
    }
  }, [supabase, userId]);

  const fetchCompletions = useCallback(
    async (startDate: string, endDate: string) => {
      if (!userId) return;
      const { data, error: e } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", userId)
        .gte("completed_date", startDate)
        .lte("completed_date", endDate);
      if (e) setError(e.message);
      else {
        setError(null);
        setCompletions((data ?? []) as HabitCompletion[]);
      }
    },
    [supabase, userId],
  );

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      await fetchHabits();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, fetchHabits]);

  const toggleCompletion = useCallback(
    async (habitId: string, dateISO: string, currentlyCompleted: boolean) => {
      if (!userId) return { error: "No user" as const };
      if (currentlyCompleted) {
        const { error: e } = await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("user_id", userId)
          .eq("completed_date", dateISO);
        if (e) return { error: e.message };
      } else {
        const { error: e } = await supabase.from("habit_completions").insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: dateISO,
        });
        if (e) return { error: e.message };
      }
      return { error: null as string | null };
    },
    [supabase, userId],
  );

  const createHabit = useCallback(
    async (payload: {
      name: string;
      description?: string;
      color: string;
      icon: string;
      frequency: string;
      target_days?: number;
    }) => {
      if (!userId) return { error: "No user" as const };
      const { error: e } = await supabase.from("habits").insert({
        user_id: userId,
        name: payload.name,
        description: payload.description ?? null,
        color: payload.color,
        icon: payload.icon,
        frequency: payload.frequency,
        target_days: payload.target_days ?? 7,
      });
      if (e) return { error: e.message };
      await fetchHabits();
      return { error: null as string | null };
    },
    [supabase, userId, fetchHabits],
  );

  const updateHabit = useCallback(
    async (
      id: string,
      payload: Partial<{
        name: string;
        description: string | null;
        color: string;
        icon: string;
        frequency: string;
        target_days: number;
      }>,
    ) => {
      if (!userId) return { error: "No user" as const };
      const { error: e } = await supabase.from("habits").update(payload).eq("id", id);
      if (e) return { error: e.message };
      await fetchHabits();
      return { error: null as string | null };
    },
    [supabase, userId, fetchHabits],
  );

  const archiveHabit = useCallback(
    async (id: string) => {
      if (!userId) return { error: "No user" as const };
      const { error: e } = await supabase
        .from("habits")
        .update({ is_archived: true })
        .eq("id", id);
      if (e) return { error: e.message };
      await fetchHabits();
      return { error: null as string | null };
    },
    [supabase, userId, fetchHabits],
  );

  return {
    habits,
    completions,
    loading,
    error,
    fetchHabits,
    fetchCompletions,
    toggleCompletion,
    createHabit,
    updateHabit,
    archiveHabit,
  };
}
