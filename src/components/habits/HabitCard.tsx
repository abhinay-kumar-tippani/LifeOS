"use client";

import type { Habit, HabitCompletion } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HabitStreakBadge } from "./HabitStreakBadge";
import { HabitHeatmap } from "./HabitHeatmap";
import { calculateStreak, datesSetFromCompletions } from "@/lib/utils/streaks";

export function HabitCard({
  habit,
  completions,
  onEdit,
  onArchive,
}: {
  habit: Habit;
  completions: HabitCompletion[];
  onEdit: () => void;
  onArchive: () => void;
}) {
  const dates = datesSetFromCompletions(completions, habit.id);
  const streak = calculateStreak(dates, habit.id, new Date());
  const set = new Set(dates);
  const total = dates.length;
  const rate = total > 0 ? Math.min(100, Math.round((total / 30) * 100)) : 0;

  return (
    <Card className="border-border/60 bg-card/50">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: habit.color }}
              aria-hidden
            />
            <h3 className="truncate font-semibold">{habit.name}</h3>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{habit.frequency} · {rate}% (30d)</p>
        </div>
        <HabitStreakBadge streak={streak} />
      </CardHeader>
      <CardContent className="space-y-3">
        <HabitHeatmap completedSet={set} color={habit.color} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onEdit} aria-label={`Edit ${habit.name}`}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onArchive} aria-label={`Archive ${habit.name}`}>
            Archive
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
