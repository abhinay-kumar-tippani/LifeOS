
import type { Habit, HabitCompletion } from "@/types";
import { Button } from "@/components/ui/button";
import { calculateStreak, datesSetFromCompletions } from "@/lib/utils/streaks";
import { getDaysInMonth, getDate, format, subDays } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { Flame } from "lucide-react";

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
  const color = habit.color || "#6366f1";

  const now = new Date();
  const monthDays = getDaysInMonth(now);
  const daysElapsed = getDate(now);

  const monthPrefix = format(now, "yyyy-MM");
  const monthCompletions = dates.filter((d) => d.startsWith(monthPrefix)).length;
  const rate = Math.round((monthCompletions / daysElapsed) * 100) || 0;

  const last7 = Array.from({ length: 7 }).map((_, i) => {
    return set.has(format(subDays(now, 6 - i), "yyyy-MM-dd"));
  });

  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-border/60 bg-card/40 p-5 transition-all hover:border-primary/30">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-semibold text-foreground">{habit.name}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {habit.frequency} · {rate}% this month
          </div>
        </div>
        <div
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ backgroundColor: `${color}20`, color }}
        >
          <Flame className="h-3 w-3" aria-hidden />
          {streak} {streak === 1 ? "day" : "days"}
        </div>
      </div>

      <div className="space-y-1">
        <div className="mb-1 flex items-center justify-end text-xs text-muted-foreground">
          <span>
            {monthCompletions}/{monthDays} days
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((monthCompletions / monthDays) * 100, 100)}%`,
              backgroundColor: color,
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-2 text-xs text-muted-foreground">Last 7 days:</span>
        {last7.map((done, i) => (
          <div
            key={i}
            className={cn("h-5 w-5 rounded-md", !done && "bg-muted")}
            style={done ? { backgroundColor: color } : undefined}
          />
        ))}
      </div>

      <div className="flex gap-2 border-t border-border/40 pt-3">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={onArchive}>
          Archive
        </Button>
      </div>
    </div>
  );
}
