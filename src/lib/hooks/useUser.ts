"use client";

import { useEffect, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { getSupabaseClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  const supabase = getSupabaseClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!cancelled) {
        setUser(u);
        setAuthLoading(false);
      }
    }
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const {
    data: profile = null,
    isLoading: isProfileLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error: e } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      if (e) throw e;
      return data as Profile;
    },
    enabled: !!user,
  });

  const loading = authLoading || isProfileLoading;
  const refreshProfile = () => { void refetch(); };

  return { user, profile, loading, error: error?.message ?? null, refreshProfile };
}
