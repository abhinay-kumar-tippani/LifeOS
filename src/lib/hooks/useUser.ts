"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";

export function useUser() {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(
    async (uid: string) => {
      const { data, error: e } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", uid)
        .single();
      if (e) {
        setError(e.message);
        setProfile(null);
        return;
      }
      setError(null);
      setProfile(data as Profile);
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      if (cancelled) return;
      setUser(u);
      if (u) await loadProfile(u.id);
      else setProfile(null);
      setLoading(false);
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) void loadProfile(u.id);
      else {
        setProfile(null);
        setError(null);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, loadProfile]);

  const refreshProfile = useCallback(() => {
    if (user) void loadProfile(user.id);
  }, [user, loadProfile]);

  return { user, profile, loading, error, refreshProfile };
}
