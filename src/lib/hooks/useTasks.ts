"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Task } from "@/types";

export function useTasks(userId: string | undefined) {
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading: loading, error: queryErr, refetch: fetchTasks } = useQuery({
    queryKey: ["tasks", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("kanban_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Task[];
    },
    enabled: !!userId,
  });

  const createMutation = useMutation({
    mutationFn: async (payload: { title: string; description?: string | null; status: Task["status"]; priority: Task["priority"]; due_date?: string | null; quadrant?: Task["quadrant"] | null; }) => {
      if (!userId) throw new Error("No user");
      const maxOrder =
        tasks.filter((t) => t.status === payload.status).length > 0
          ? Math.max(...tasks.filter((t) => t.status === payload.status).map((t) => t.kanban_order ?? 0)) + 1
          : 0;
      const { error } = await supabase.from("tasks").insert({
        user_id: userId,
        title: payload.title,
        description: payload.description ?? null,
        status: payload.status,
        priority: payload.priority,
        due_date: payload.due_date ?? null,
        quadrant: payload.quadrant ?? null,
        kanban_order: maxOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, patch }: { id: string, patch: Partial<Task> }) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase.from("tasks").update(patch).eq("id", id).eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const reorderMutation = useMutation({
    mutationFn: async (ordered: { id: string; status: Task["status"]; kanban_order: number }[]) => {
      if (!userId) throw new Error("No user");
      for (const row of ordered) {
        const { error } = await supabase
          .from("tasks")
          .update({ status: row.status, kanban_order: row.kanban_order })
          .eq("id", row.id)
          .eq("user_id", userId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", userId] });
    }
  });

  const createTask = useCallback(async (payload: any) => {
    try {
      await createMutation.mutateAsync(payload);
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [createMutation]);

  const updateTask = useCallback(async (id: string, patch: any) => {
    try {
      await updateMutation.mutateAsync({ id, patch });
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [updateMutation]);

  const reorderKanban = useCallback(async (ordered: any) => {
    try {
      await reorderMutation.mutateAsync(ordered);
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [reorderMutation]);

  return {
    tasks,
    loading,
    error: queryErr?.message ?? null,
    fetchTasks: async () => { await fetchTasks(); },
    createTask,
    updateTask,
    reorderKanban,
  };
}
