"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Habit, HabitCompletion } from "@/types";
import { getHabitColor } from "@/lib/utils/habitColors";

export function HabitPieChart({ habits, completions }: { habits: Habit[]; completions: HabitCompletion[] }) {
  const data = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of completions) {
      counts[c.habit_id] = (counts[c.habit_id] || 0) + 1;
    }
    return habits
      .map((h) => ({
        name: h.name,
        value: counts[h.id] || 0,
        color: getHabitColor(h.name).hex,
      }))
      .filter((d) => d.value > 0);
  }, [habits, completions]);

  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  if (data.length === 0) return null;

  return (
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-white/5 bg-[#111118] p-5">
      <h3 className="mb-2 text-sm font-semibold text-white">Completion by habit (30d)</h3>
      <div className="relative h-full w-full pt-4">
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px" }}
              formatter={(value: number) => [`${value} completions`, "Total"]}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#9ca3af' }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-8">
          <span className="text-2xl font-bold text-white">{total}</span>
          <span className="text-xs text-gray-500">Total</span>
        </div>
      </div>
    </div>
  );
}
