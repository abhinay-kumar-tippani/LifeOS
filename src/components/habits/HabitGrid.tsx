"use client";

import { format, parseISO } from "date-fns";
import type { Habit, HabitCompletion } from "@/types";
import { HabitCheckbox } from "./HabitCheckbox";
import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export function HabitGrid({
  habits,
  days,
  completions,
  onToggle,
  loading,
}: {
  habits: Habit[];
  days: string[];
  completions: HabitCompletion[];
  onToggle: (habitId: string, date: string) => void;
  loading?: boolean;
}) {
  const completionKey = (habitId: string, d: string) => `${habitId}:${d}`;
  const done = new Set(completions.map((c) => completionKey(c.habit_id, c.completed_date.slice(0, 10))));

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (habits.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-max min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            <th
              className={cn(
                "sticky left-0 z-20 min-w-[140px] bg-muted/95 px-3 py-2 text-left font-medium backdrop-blur-sm",
              )}
            >
              Habit
            </th>
            {days.map((d) => (
              <th
                key={d}
                className="min-w-[36px] px-0.5 py-2 text-center text-[10px] font-normal text-muted-foreground"
              >
                {format(parseISO(d), "d")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => (
            <tr key={h.id} className="border-b border-border/40">
              <td
                className={cn(
                  "sticky left-0 z-10 bg-card/95 px-3 py-2 font-medium backdrop-blur-sm",
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: h.color }} />
                  <span className="truncate">{h.name}</span>
                </div>
              </td>
              {days.map((d) => {
                const isDone = done.has(completionKey(h.id, d));
                return (
                  <td key={d} className="bg-background/30">
                    <HabitCheckbox
                      checked={isDone}
                      accentColor={h.color}
                      ariaLabel={`Toggle ${h.name} on ${d}`}
                      onToggle={() => onToggle(h.id, d)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
