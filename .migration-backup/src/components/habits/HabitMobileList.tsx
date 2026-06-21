"use client";

import { useState } from "react";
import { format } from "date-fns";
import type { Habit, HabitCompletion } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { MoreVertical, Pencil, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { fireCompletionConfetti } from "@/lib/utils/confetti";
import { cn } from "@/lib/utils/cn";

export function HabitMobileList({
  habits,
  completions,
  onToggle,
  onEdit,
  onArchive,
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  onToggle: (habitId: string, date: string) => void;
  onEdit: (habit: Habit) => void;
  onArchive: (habit: Habit) => void;
}) {
  const today = format(new Date(), "yyyy-MM-dd");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <ul className="flex flex-col gap-2 md:hidden">
      {habits.map((h) => {
        const isDone = completions.some(
          (c) => c.habit_id === h.id && c.completed_date.slice(0, 10) === today,
        );
        return (
          <li
            key={h.id}
            className={cn(
              "flex items-center gap-3 rounded-lg border border-border/60 bg-card/40 px-3 py-3",
              isDone && "bg-primary/5",
            )}
          >
            <Checkbox
              checked={isDone}
              onCheckedChange={() => {
                if (!isDone) fireCompletionConfetti();
                onToggle(h.id, today);
              }}
              aria-label={`Mark ${h.name} ${isDone ? "incomplete" : "complete"} today`}
            />
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: h.color }} />
              <span className="truncate text-sm font-medium">{h.name}</span>
            </div>
            <DropdownMenu open={openMenu === h.id} onOpenChange={(o) => setOpenMenu(o ? h.id : null)}>
              <DropdownMenuTrigger
                className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                aria-label={`Options for ${h.name}`}
              >
                <MoreVertical className="h-4 w-4" aria-hidden />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(h)}>
                  <Pencil className="h-4 w-4" aria-hidden />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onArchive(h)}
                >
                  <Archive className="h-4 w-4" aria-hidden />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        );
      })}
    </ul>
  );
}