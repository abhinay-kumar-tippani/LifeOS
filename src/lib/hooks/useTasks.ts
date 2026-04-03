"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Task } from "@/types";

export function useTasks(userId: string | undefined) {
  const supabase = useMemo(() => createClient(), []);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!userId) return;
    const { data, error: e } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("kanban_order", { ascending: true });
    if (e) setError(e.message);
    else {
      setError(null);
      setTasks((data ?? []) as Task[]);
    }
  }, [supabase, userId]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      await fetchTasks();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, fetchTasks]);

  const createTask = useCallback(
    async (payload: {
      title: string;
      description?: string | null;
      status: Task["status"];
      priority: Task["priority"];
      due_date?: string | null;
      quadrant?: Task["quadrant"] | null;
    }) => {
      if (!userId) return { error: "No user" as const };
      const maxOrder =
        tasks.filter((t) => t.status === payload.status).length > 0
          ? Math.max(
              ...tasks.filter((t) => t.status === payload.status).map((t) => t.kanban_order ?? 0),
            ) + 1
          : 0;
      const { error: e } = await supabase.from("tasks").insert({
        user_id: userId,
        title: payload.title,
        description: payload.description ?? null,
        status: payload.status,
        priority: payload.priority,
        due_date: payload.due_date ?? null,
        quadrant: payload.quadrant ?? null,
        kanban_order: maxOrder,
      });
      if (e) return { error: e.message };
      await fetchTasks();
      return { error: null as string | null };
    },
    [supabase, userId, fetchTasks, tasks],
  );

  const updateTask = useCallback(
    async (id: string, patch: Partial<Task>) => {
      if (!userId) return { error: "No user" as const };
      const { error: e } = await supabase
        .from("tasks")
        .update(patch)
        .eq("id", id)
        .eq("user_id", userId);
      if (e) return { error: e.message };
      await fetchTasks();
      return { error: null as string | null };
    },
    [supabase, userId, fetchTasks],
  );

  const reorderKanban = useCallback(
    async (ordered: { id: string; status: Task["status"]; kanban_order: number }[]) => {
      if (!userId) return { error: "No user" as const };
      for (const row of ordered) {
        const { error: e } = await supabase
          .from("tasks")
          .update({ status: row.status, kanban_order: row.kanban_order })
          .eq("id", row.id)
          .eq("user_id", userId);
        if (e) return { error: e.message };
      }
      await fetchTasks();
      return { error: null as string | null };
    },
    [supabase, userId, fetchTasks],
  );

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    reorderKanban,
  };
}
