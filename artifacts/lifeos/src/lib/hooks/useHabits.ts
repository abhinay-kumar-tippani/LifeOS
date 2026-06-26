"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Habit, HabitCompletion } from "@/types";

// localStorage helpers scoped to habits/completions only.
// Other queries (journal, pomodoro, etc.) are deliberately excluded.
const CACHE_KEYS = {
  habits: (uid: string) => `lifeos:habits:${uid}`,
  completions: (uid: string) => `lifeos:completions:${uid}`,
} as const;

function readCache<T>(key: string): T | undefined {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return undefined;
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function writeCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — not critical, app works fine without cache
  }
}

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
      const result = (data ?? []) as Habit[];
      // Persist to localStorage so next app open renders instantly
      writeCache(CACHE_KEYS.habits(userId), result);
      return result;
    },
    enabled: !!userId,
    // Seed from localStorage — user sees their last-known habit list immediately
    // while the server fetch runs in the background
    initialData: userId ? readCache<Habit[]>(CACHE_KEYS.habits(userId)) : undefined,
    // If initialData came from cache, mark it as potentially stale so React Query
    // still fires the queryFn to get fresh data
    initialDataUpdatedAt: 0,
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
      const result = (data ?? []) as HabitCompletion[];
      writeCache(CACHE_KEYS.completions(userId), result);
      return result;
    },
    enabled: !!userId,
    initialData: userId ? readCache<HabitCompletion[]>(CACHE_KEYS.completions(userId)) : undefined,
    initialDataUpdatedAt: 0,
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
    // Write to the local cache the instant the user taps, before the network call.
    // If the server call fails, onError rolls back to the snapshot we saved here.
    onMutate: async ({ habitId, dateISO, currentlyCompleted }) => {
      // Cancel any in-flight refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["completions", userId] });

      const previousCompletions = queryClient.getQueryData<HabitCompletion[]>(["completions", userId]);

      queryClient.setQueryData<HabitCompletion[]>(["completions", userId], (old = []) => {
        if (currentlyCompleted) {
          // Unchecking: remove the matching completion
          return old.filter(
            (c) => !(c.habit_id === habitId && c.completed_date.slice(0, 10) === dateISO)
          );
        } else {
          // Checking: add a synthetic completion entry.
          // The id is a placeholder — the real one comes back when onSettled revalidates.
          return [
            ...old,
            {
              id: `optimistic-${habitId}-${dateISO}`,
              habit_id: habitId,
              user_id: userId!,
              completed_date: dateISO,
            },
          ];
        }
      });

      return { previousCompletions };
    },
    onError: (_err, _vars, context) => {
      // Roll back to the snapshot saved in onMutate
      if (context?.previousCompletions) {
        queryClient.setQueryData(["completions", userId], context.previousCompletions);
      }
    },
    onSettled: () => {
      // Always revalidate from the server after the mutation settles (success or failure)
      // so we end up with the real data and real IDs.
      queryClient.invalidateQueries({ queryKey: ["completions", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    },
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
