"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { JournalEntry } from "@/types";

export function useJournal(userId: string | undefined) {
  const supabase = useMemo(() => createClient(), []);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    if (!userId) return;
    const { data, error: e } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", userId)
      .order("entry_date", { ascending: false });
    if (e) setError(e.message);
    else {
      setError(null);
      setEntries((data ?? []) as JournalEntry[]);
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
      await fetchEntries();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, fetchEntries]);

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

  const saveEntry = useCallback(
    async (payload: {
      id?: string;
                     title?: string | null;
                     content: string;
                     mood?: string | null;
                     tags: string[];
                     image_url?: string | null;
                     entry_date?: string;
    }) => {
      if (!userId) return { data: null as JournalEntry | null, error: "No user" };
      if (payload.id) {
        const { data, error: e } = await supabase
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
        if (e) return { data: null, error: e.message };
        await fetchEntries();
        return { data: data as JournalEntry, error: null };
      }
      const { data, error: e } = await supabase
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
      if (e) return { data: null, error: e.message };
      await fetchEntries();
      return { data: data as JournalEntry, error: null };
    },
    [supabase, userId, fetchEntries],
  );

  const removeEntry = useCallback(
    async (id: string) => {
      if (!userId) return { error: "No user" as const };
      const { error: e } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id)
        .eq("user_id", userId);
      if (e) return { error: e.message };
      await fetchEntries();
      return { error: null as string | null };
    },
    [supabase, userId, fetchEntries],
  );

  return {
    entries,
    loading,
    error,
    fetchEntries,
    getEntry,
    saveEntry,
    removeEntry,
  };
}
