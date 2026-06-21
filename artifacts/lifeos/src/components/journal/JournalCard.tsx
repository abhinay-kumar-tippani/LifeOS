
import { useState } from "react";
import { Link } from "wouter";
import type { JournalEntry } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format, parseISO, isToday, isYesterday, differenceInCalendarDays } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";

const moodEmoji: Record<string, string> = {
  happy: "😊",
  neutral: "😐",
  sad: "😔",
  stressed: "😤",
  energized: "⚡",
};

function relativeDate(iso: string): string {
  const d = parseISO(iso.slice(0, 10) + "T12:00:00");
  if (isToday(d)) return "Today";
  if (isYesterday(d)) return "Yesterday";
  const days = differenceInCalendarDays(new Date(), d);
  if (days < 7) return `${days} days ago`;
  return format(d, "MMM d, yyyy");
}

export function JournalCard({
  entry,
  onDelete,
}: {
  entry: JournalEntry;
  onDelete: (id: string) => Promise<void>;
}) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const dateStr = relativeDate(entry.entry_date);
  const fullDate = format(parseISO(entry.entry_date.slice(0, 10) + "T12:00:00"), "MMMM d, yyyy");

  return (
    <div className="group relative">
      <Link href={`/journal/${entry.id}`} className="block">
        <Card className="h-full border-border/60 bg-card/50 transition hover:border-primary/40">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <time dateTime={entry.entry_date} title={fullDate}>
                  {dateStr}
                </time>
                {entry.mood ? (
                  <span aria-label={`Mood: ${entry.mood}`}>{moodEmoji[entry.mood] ?? "📝"}</span>
                ) : (
                  <span aria-hidden>📝</span>
                )}
              </div>
              <div
                className="relative"
                onClick={(e) => e.preventDefault()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    aria-label={`Entry options: ${entry.title || "Untitled"}`}
                  >
                    <MoreVertical className="h-4 w-4" aria-hidden />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        setConfirmingDelete(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <h3 className="line-clamp-1 font-semibold">{entry.title || "Untitled"}</h3>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 text-sm text-muted-foreground">{entry.content}</p>
            {entry.tags && entry.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1">
                {entry.tags.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      </Link>

      <ConfirmDialog
        open={confirmingDelete}
        onOpenChange={setConfirmingDelete}
        title="Delete this entry?"
        description="This journal entry will be permanently removed."
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          setConfirmingDelete(false);
          await onDelete(entry.id);
          toast.success("Entry deleted");
        }}
      />
    </div>
  );
}