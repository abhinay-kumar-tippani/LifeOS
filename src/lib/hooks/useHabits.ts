"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Habit, HabitCompletion } from "@/types";

export function useHabits(userId: string | undefined) {
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();

  const { data: habits = [], isLoading: loadingHabits, error: habitsErr, refetch: fetchHabits } = useQuery({
    queryKey: ["habits", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", userId)
        .eq("is_archived", false)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Habit[];
    },
    enabled: !!userId,
  });

  const { data: completions = [], isLoading: loadingComps, error: compsErr, refetch: refetchComps } = useQuery({
    queryKey: ["completions", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", userId);
      if (error) throw error;
      return (data ?? []) as HabitCompletion[];
    },
    enabled: !!userId,
  });

  const fetchCompletions = useCallback(async () => {
    await refetchComps();
  }, [refetchComps]);

  const toggleMutation = useMutation({
    mutationFn: async ({ habitId, dateISO, currentlyCompleted }: { habitId: string, dateISO: string, currentlyCompleted: boolean }) => {
      if (!userId) throw new Error("No user");
      if (currentlyCompleted) {
        const { error } = await supabase
          .from("habit_completions")
          .delete()
          .eq("habit_id", habitId)
          .eq("user_id", userId)
          .eq("completed_date", dateISO);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("habit_completions").insert({
          habit_id: habitId,
          user_id: userId,
          completed_date: dateISO,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["completions", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { name: string; description?: string; color: string; icon: string; frequency: string; target_days?: number; }) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("habits").insert({
        user_id: userId,
        name: payload.name,
        description: payload.description ?? null,
        color: payload.color,
        icon: payload.icon,
        frequency: payload.frequency,
        target_days: payload.target_days ?? 7,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string, payload: any }) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("habits").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("habits").update({ is_archived: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const toggleCompletion = useCallback(async (habitId: string, dateISO: string, currentlyCompleted: boolean) => {
    try {
      await toggleMutation.mutateAsync({ habitId, dateISO, currentlyCompleted });
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [toggleMutation]);

  const createHabit = useCallback(async (payload: any) => {
    try {
      await createMutation.mutateAsync(payload);
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [createMutation]);

  const updateHabit = useCallback(async (id: string, payload: any) => {
    try {
      await updateMutation.mutateAsync({ id, payload });
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [updateMutation]);

  const archiveHabit = useCallback(async (id: string) => {
    try {
      await archiveMutation.mutateAsync(id);
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [archiveMutation]);

  return {
    habits,
    completions,
    loading: loadingHabits || loadingComps,
    error: (habitsErr || compsErr)?.message ?? null,
    fetchHabits: async () => { await fetchHabits(); },
    fetchCompletions,
    toggleCompletion,
    createHabit,
    updateHabit,
    archiveHabit,
  };
}
