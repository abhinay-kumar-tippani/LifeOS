"use client";

import type { Habit, HabitCompletion } from "@/types";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { getHabitColor } from "@/lib/utils/habitColors";

type StreakEntry = { habitId: string; name: string; streak: number; color: string };

export function InsightsTable({
  habits,
  completions,
  streaks
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  streaks: StreakEntry[];
}) {
  const data = habits.map(h => {
    // 30 day completions vs previous 30 days
    // For simplicity of this UI simulation, we compute "rate" as completions / 30
    const count = completions.filter(c => c.habit_id === h.id).length;
    const rate = Math.round((count / 30) * 100);
    const bestStreak = streaks.find(s => s.habitId === h.id)?.streak || 0;
    
    // Simulate trend based on rate
    const trend = rate > 50 ? "up" : rate < 30 ? "down" : "flat";

    return { id: h.id, name: h.name, color: getHabitColor(h.name).hex, count, rate, bestStreak, trend };
  }).sort((a, b) => b.rate - a.rate);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-white/5 bg-[#111118]">
      <div className="p-5 border-b border-white/5">
        <h3 className="text-sm font-semibold text-white">30-day habit summary</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800/50 text-xs uppercase text-gray-400 border-b border-white/5">
            <tr>
              <th className="px-5 py-3 font-medium">Habit</th>
              <th className="px-5 py-3 font-medium">Completions</th>
              <th className="px-5 py-3 font-medium">Rate</th>
              <th className="px-5 py-3 font-medium">Best Streak</th>
              <th className="px-5 py-3 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? "bg-[#111118]" : "bg-white/[0.02]"}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="font-medium text-white">{row.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-400">{row.count}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-xs text-gray-500">{row.rate}%</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-700">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${row.rate}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-400">{row.bestStreak} days</td>
                <td className="px-5 py-3">
                  {row.trend === "up" && <ArrowUp className="h-4 w-4 text-green-400" />}
                  {row.trend === "down" && <ArrowDown className="h-4 w-4 text-red-400" />}
                  {row.trend === "flat" && <Minus className="h-4 w-4 text-gray-500" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
