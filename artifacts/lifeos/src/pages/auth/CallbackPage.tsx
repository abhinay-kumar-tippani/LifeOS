import { useEffect } from "react";
import { useLocation } from "wouter";
import { getSupabaseClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function CallbackPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const next = params.get("next") ?? "/dashboard";

      if (code) {
        const supabase = getSupabaseClient();
        await supabase.auth.exchangeCodeForSession(code);
      }

      navigate(next, { replace: true });
    };
    run();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <LoadingSpinner />
    </div>
  );
}
