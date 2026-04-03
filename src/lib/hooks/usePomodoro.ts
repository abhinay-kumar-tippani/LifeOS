"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { createClient } from "@/lib/supabase/client";
import type { PomodoroSession } from "@/types";

export function usePomodoro(userId: string | undefined) {
  const supabase = useMemo(() => createClient(), []);
  const [todaySessions, setTodaySessions] = useState<PomodoroSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = format(new Date(), "yyyy-MM-dd");

  const fetchToday = useCallback(async () => {
    if (!userId) return;
    const { data, error: e } = await supabase
      .from("pomodoro_sessions")
      .select("*")
      .eq("user_id", userId)
      .eq("session_date", today)
      .order("created_at", { ascending: false });
    if (e) setError(e.message);
    else {
      setError(null);
      setTodaySessions((data ?? []) as PomodoroSession[]);
    }
  }, [supabase, userId, today]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      await fetchToday();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, fetchToday]);

  const logSession = useCallback(
    async (payload: {
      task_id?: string | null;
      duration_minutes: number;
      break_minutes?: number;
      completed?: boolean;
    }) => {
      if (!userId) return { error: "No user" as const };
      const { error: e } = await supabase.from("pomodoro_sessions").insert({
        user_id: userId,
        task_id: payload.task_id ?? null,
        duration_minutes: payload.duration_minutes,
        break_minutes: payload.break_minutes ?? 5,
        completed: payload.completed ?? true,
        session_date: today,
      });
      if (e) return { error: e.message };
      await fetchToday();
      return { error: null as string | null };
    },
    [supabase, userId, today, fetchToday],
  );

  const fetchRange = useCallback(
    async (start: string, end: string) => {
      if (!userId) return [] as PomodoroSession[];
      const { data, error: e } = await supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("session_date", start)
        .lte("session_date", end)
        .order("session_date", { ascending: true });
      if (e) {
        setError(e.message);
        return [];
      }
      return (data ?? []) as PomodoroSession[];
    },
    [supabase, userId],
  );

  return {
    todaySessions,
    loading,
    error,
    fetchToday,
    logSession,
    fetchRange,
  };
}
