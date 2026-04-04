"use client";

import type { Habit, HabitCompletion } from "@/types";
import { Button } from "@/components/ui/button";
import { calculateStreak, datesSetFromCompletions } from "@/lib/utils/streaks";
import { getDaysInMonth, getDate, format, subDays } from "date-fns";
import { getHabitColor } from "@/lib/utils/habitColors";
import { cn } from "@/lib/utils/cn";

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
  
  const now = new Date();
  const monthDays = getDaysInMonth(now);
  const daysElapsed = getDate(now);
  
  const monthPrefix = format(now, "yyyy-MM");
  const monthCompletions = dates.filter((d) => d.startsWith(monthPrefix)).length;
  const rate = Math.round((monthCompletions / daysElapsed) * 100) || 0;
  
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    return set.has(format(subDays(now, 6 - i), "yyyy-MM-dd"));
  });

  const hColor = getHabitColor(habit.name);

  return (
    <div 
      className="group flex flex-col gap-4 rounded-xl border border-white/5 bg-[#111118] p-5 transition-all duration-200"
      style={{ '--hover-border-color': `${hColor.hex}30` } as any}
    >
      <style jsx>{`
        .group:hover {
          border-color: var(--hover-border-color);
        }
      `}</style>
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className={cn("h-3 w-3 rounded-full", hColor.bg)} />
            <span className="font-semibold text-white">{habit.name}</span>
          </div>
          <div className="text-sm text-gray-400">
            {habit.frequency} · {rate}% this month
          </div>
        </div>
        <div className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium", hColor.text)} style={{ backgroundColor: `${hColor.hex}20` }}>
          🔥 {streak} {streak === 1 ? "day" : "days"}
        </div>
      </div>

      <div className="space-y-1">
        <div className="mb-1 flex items-center justify-end text-xs text-gray-500">
          <span>{monthCompletions}/{monthDays} days</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", hColor.bg)} 
            style={{ width: `${Math.min((monthCompletions / monthDays) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-2 text-xs text-gray-500">Last 7 days:</span>
        {last7.map((done, i) => (
          <div 
            key={i} 
            className={cn("h-[28px] w-[28px] rounded-md", done ? hColor.bg : "bg-gray-700")}
          />
        ))}
      </div>

      <div className="flex gap-2 border-t border-gray-700/50 pt-3">
        <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300" onClick={onArchive}>
          Archive
        </Button>
      </div>
    </div>
  );
}
