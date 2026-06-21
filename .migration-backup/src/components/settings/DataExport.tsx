"use client";

import { useState } from "react";
import { getSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const TABLES = [
  "habits",
  "habit_completions",
  "tasks",
  "journal_entries",
  "goals",
  "pomodoro_sessions",
] as const;

export function DataExport() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const supabase = getSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Not signed in");
        return;
      }
      const payload: Record<string, unknown> = {
        exported_at: new Date().toISOString(),
        user_id: user.id,
        email: user.email,
      };
      for (const table of TABLES) {
        try {
          const { data, error } = await supabase.from(table).select("*").eq("user_id", user.id);
          if (error) {
            payload[table] = { error: error.message };
          } else {
            payload[table] = data ?? [];
          }
        } catch (e) {
          payload[table] = { error: e instanceof Error ? e.message : "Unknown error" };
        }
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lifeos-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Export downloaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button onClick={handleExport} disabled={exporting} aria-label="Download my data">
      {exporting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Preparing…
        </>
      ) : (
        <>
          <Download className="h-4 w-4" aria-hidden />
          Download my data
        </>
      )}
    </Button>
  );
}