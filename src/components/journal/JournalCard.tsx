"use client";

import { useState } from "react";
import Link from "next/link";
import type { JournalEntry } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";

const moodEmoji: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  stressed: "😤",
  energized: "⚡",
};

export function JournalCard({ entry }: { entry: JournalEntry }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const supabase = getSupabaseClient();

  const dateStr = format(parseISO(entry.entry_date.slice(0, 10) + "T12:00:00"), "MMM d, yyyy");

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    await supabase.from("journal_entries").delete().eq("id", entry.id).eq("user_id", user.id);
    queryClient.invalidateQueries({ queryKey: ["journal"] });
  };

  return (
    <Link href={`/journal/${entry.id}`} className="block relative group cursor-pointer">
      <Card className="h-full border-border/60 bg-card/50 transition hover:border-primary/40">
        
        {/* Delete Area */}
        <div 
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-card/80 p-1 rounded-md shadow-sm"
          onClick={(e) => e.preventDefault()}
        >
          {confirmingDelete ? (
            <div className="flex items-center gap-2 text-sm px-1">
              <span className="text-gray-400">Delete?</span>
              <button
                onClick={handleDelete}
                className="text-red-400 hover:text-red-300 font-medium cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setConfirmingDelete(false);
                }}
                className="text-gray-500 hover:text-gray-300 cursor-pointer"
              >
                No
              </button>
            </div>
          ) : (
            <button
              className="text-gray-500 hover:text-red-400 cursor-pointer p-1"
              onClick={(e) => {
                e.preventDefault();
                setConfirmingDelete(true);
              }}
              aria-label="Delete entry"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mr-16">
            <span>{dateStr}</span>
            <span aria-hidden>{entry.mood ? moodEmoji[entry.mood] ?? "📝" : "📝"}</span>
          </div>
          <h3 className="line-clamp-1 font-semibold pr-16">{entry.title || "Untitled"}</h3>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-2 text-sm text-muted-foreground">{entry.content}</p>
          {entry.tags && entry.tags.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {entry.tags.slice(0, 4).map((t) => (
                <span key={t} className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
