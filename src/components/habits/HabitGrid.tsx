"use client";

import { format, parseISO } from "date-fns";
import type { Habit, HabitCompletion } from "@/types";
import { cn } from "@/lib/utils/cn";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { getHabitColor } from "@/lib/utils/habitColors";
import { Checkbox } from "@/components/ui/checkbox";

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

  const weeks: string[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-max min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30">
            <th 
              rowSpan={3}
              className="sticky left-0 z-20 min-w-[160px] bg-background px-3 py-2 text-left font-medium border-r border-border/40"
            >
              Habit
            </th>
            {weeks.map((week, i) => (
              <th 
                key={i} 
                colSpan={week.length} 
                className="border-r border-gray-600 text-center text-xs font-bold text-gray-300 uppercase py-2"
              >
                WEEK {i + 1}
              </th>
            ))}
          </tr>
          <tr className="bg-muted/20">
            {weeks.flatMap((week, wi) => week.map((d, di) => {
               const wd = format(parseISO(d), "EEE");
               const isLastInWeek = di === week.length - 1;
               return (
                 <th 
                   key={`wd-${d}`} 
                   className={`px-2 py-1 text-center text-xs text-gray-400 font-medium min-w-[36px] ${isLastInWeek ? 'border-r border-gray-700/50' : ''}`}
                 >
                   {wd}
                 </th>
               );
            }))}
          </tr>
          <tr className="border-b border-border/60 bg-muted/20">
            {weeks.flatMap((week, wi) => week.map((d, di) => {
               const isToday = d === format(new Date(), "yyyy-MM-dd");
               const dateNum = format(parseISO(d), "d");
               const isLastInWeek = di === week.length - 1;
               return (
                 <th 
                   key={`dn-${d}`} 
                   className={`px-2 py-1 text-center font-normal min-w-[36px] ${isLastInWeek ? 'border-r border-gray-700/50' : ''}`}
                 >
                   <div className="flex flex-col items-center gap-0.5">
                     <span className={cn("text-xs leading-none", isToday ? "text-indigo-400 font-bold" : "text-gray-500")}>
                       {dateNum}
                     </span>
                     {isToday && <div className="h-1 w-1 rounded-full bg-indigo-400" />}
                   </div>
                 </th>
               );
            }))}
          </tr>
        </thead>
        <tbody>
          {habits.map((h) => {
            const hColor = getHabitColor(h.name);
            return (
            <tr key={h.id} className="border-b border-border/40">
              <td className="sticky left-0 z-10 bg-background px-3 py-2 font-medium border-r border-border/40">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", hColor.bg)} />
                  <span className="truncate">{h.name}</span>
                </div>
              </td>
              {weeks.flatMap((week, wi) => week.map((d, di) => {
                const isDone = done.has(completionKey(h.id, d));
                const isToday = d === format(new Date(), "yyyy-MM-dd");
                const isLastInWeek = di === week.length - 1;
                return (
                  <td 
                    key={`${h.id}-${d}`} 
                    className={cn(
                      "text-center align-middle p-1", 
                      isToday && "bg-indigo-500/10",
                      isLastInWeek && "border-r border-gray-700/50"
                    )}
                  >
                    <div className="flex justify-center flex-col items-center gap-1">
                      <Checkbox
                        checked={isDone}
                        onCheckedChange={() => onToggle(h.id, d)}
                        aria-label={`Toggle ${h.name} on ${d}`}
                        className={cn(
                          "h-[28px] w-[28px] rounded-md border flex items-center justify-center transition-colors",
                          isDone ? `border-transparent text-white ${hColor.bg}` : "bg-transparent"
                        )}
                        style={isDone ? {} : { borderColor: `${hColor.hex}40` }}
                      />
                    </div>
                  </td>
                );
              }))}
            </tr>
          )})}
        </tbody>
      </table>
    </div>
  );
}
