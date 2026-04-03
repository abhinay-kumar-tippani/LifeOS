"use client";

import Link from "next/link";
import type { JournalEntry } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

const moodEmoji: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  stressed: "😤",
  energized: "⚡",
};

export function JournalCard({ entry }: { entry: JournalEntry }) {
  const dateStr = format(parseISO(entry.entry_date.slice(0, 10) + "T12:00:00"), "MMM d, yyyy");
  return (
    <Link href={`/journal/${entry.id}`} className="block">
      <Card className="h-full border-border/60 bg-card/50 transition hover:border-primary/40">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{dateStr}</span>
            <span aria-hidden>{entry.mood ? moodEmoji[entry.mood] ?? "📝" : "📝"}</span>
          </div>
          <h3 className="line-clamp-1 font-semibold">{entry.title || "Untitled"}</h3>
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
