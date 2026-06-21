"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Goal } from "@/types";
import { useCallback } from "react";

export function useGoals(userId: string | undefined) {
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading, error } = useQuery({
    queryKey: ["goals", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("goals")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return (data ?? []) as Goal[];
    },
    enabled: !!userId,
  });

  const mainGoal = goals.find((g) => g.type === "main");
  const monthlyGoals = goals.filter((g) => g.type === "monthly");
  const weeklyGoals = goals.filter((g) => g.type === "weekly");

  const createMutation = useMutation({
    mutationFn: async (payload: Partial<Goal>) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("goals").insert({
        ...payload,
        user_id: userId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Goal> }) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("goals").update(payload).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals", userId] });
    },
  });

  const createGoal = useCallback(
    async (data: Partial<Goal>) => {
      try {
        await createMutation.mutateAsync(data);
        return { error: null };
      } catch (e: any) {
        return { error: e.message };
      }
    },
    [createMutation]
  );

  const updateGoal = useCallback(
    async (id: string, data: Partial<Goal>) => {
      try {
        await updateMutation.mutateAsync({ id, payload: data });
        return { error: null };
      } catch (e: any) {
        return { error: e.message };
      }
    },
    [updateMutation]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      try {
        await deleteMutation.mutateAsync(id);
        return { error: null };
      } catch (e: any) {
        return { error: e.message };
      }
    },
    [deleteMutation]
  );

  const updateProgress = useCallback(
    async (id: string, progress: number) => {
      try {
        await updateMutation.mutateAsync({ id, payload: { progress } });
        return { error: null };
      } catch (e: any) {
        return { error: e.message };
      }
    },
    [updateMutation]
  );

  return {
    goals,
    mainGoal,
    monthlyGoals,
    weeklyGoals,
    isLoading,
    error: error?.message ?? null,
    createGoal,
    updateGoal,
    deleteGoal,
    updateProgress,
  };
}
