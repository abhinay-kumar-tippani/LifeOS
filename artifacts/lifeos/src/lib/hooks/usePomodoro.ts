"use client";

import { useCallback } from "react";
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { PomodoroSession } from "@/types";

export function usePomodoro(userId: string | undefined) {
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");

  const { data: todaySessions = [], isLoading: loading, error: queryErr, refetch: fetchToday } = useQuery({
    queryKey: ["pomodoro", userId, today],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", userId)
        .eq("session_date", today)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as PomodoroSession[];
    },
    enabled: !!userId,
  });

  const logMutation = useMutation({
    mutationFn: async (payload: { task_id?: string | null; duration_minutes: number; break_minutes?: number; completed?: boolean; }) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("pomodoro_sessions").insert({
        user_id: userId,
        task_id: payload.task_id ?? null,
        duration_minutes: payload.duration_minutes,
        break_minutes: payload.break_minutes ?? 5,
        completed: payload.completed ?? true,
        session_date: today,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pomodoro", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const logSession = useCallback(async (payload: any) => {
    try {
      await logMutation.mutateAsync(payload);
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [logMutation]);

  const fetchRange = useCallback(async (start: string, end: string) => {
    if (!userId) return [];
    try {
      const { data, error } = await supabase
        .from("pomodoro_sessions")
        .select("*")
        .eq("user_id", userId)
        .gte("session_date", start)
        .lte("session_date", end)
        .order("session_date", { ascending: true });
      if (error) throw error;
      return (data ?? []) as PomodoroSession[];
    } catch (e) { return []; }
  }, [supabase, userId]);

  return {
    todaySessions,
    loading,
    error: queryErr?.message ?? null,
    fetchToday: async () => { await fetchToday(); },
    logSession,
    fetchRange,
  };
}
