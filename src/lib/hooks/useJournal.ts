"use client";

import { useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { JournalEntry } from "@/types";

export function useJournal(userId: string | undefined) {
  const supabase = getSupabaseClient();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading: loading, error: queryErr, refetch: fetchEntries } = useQuery({
    queryKey: ["journal_entries", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", userId)
        .order("entry_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as JournalEntry[];
    },
    enabled: !!userId,
  });

  const getEntry = useCallback(
    async (id: string) => {
      const { data, error: e } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("id", id)
        .single();
      if (e) return { data: null as JournalEntry | null, error: e.message };
      return { data: data as JournalEntry, error: null as string | null };
    },
    [supabase],
  );

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      if (!userId) throw new Error("No user");
      if (payload.id) {
        const { data, error } = await supabase
          .from("journal_entries")
          .update({
            title: payload.title ?? null,
            content: payload.content,
            mood: payload.mood ?? null,
            tags: payload.tags,
            image_url: payload.image_url ?? null,
            entry_date: payload.entry_date,
          })
          .eq("id", payload.id)
          .eq("user_id", userId)
          .select()
          .single();
        if (error) throw error;
        return data as JournalEntry;
      }
      const { data, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: userId,
          title: payload.title ?? null,
          content: payload.content,
          mood: payload.mood ?? null,
          tags: payload.tags,
          image_url: payload.image_url ?? null,
          entry_date: payload.entry_date ?? new Date().toISOString().slice(0, 10),
        })
        .select()
        .single();
      if (error) throw error;
      return data as JournalEntry;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_entries", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!userId) throw new Error("No user");
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journal_entries", userId] });
      queryClient.invalidateQueries({ queryKey: ["analytics", userId] });
    }
  });

  const saveEntry = useCallback(async (payload: any) => {
    try {
      const data = await saveMutation.mutateAsync(payload);
      return { data, error: null };
    } catch (e: any) { return { data: null, error: e.message }; }
  }, [saveMutation]);

  const removeEntry = useCallback(async (id: string) => {
    try {
      await removeMutation.mutateAsync(id);
      return { error: null };
    } catch (e: any) { return { error: e.message }; }
  }, [removeMutation]);

  return {
    entries,
    loading,
    error: queryErr?.message ?? null,
    fetchEntries: async () => { await fetchEntries(); },
    getEntry,
    saveEntry,
    removeEntry,
  };
}
