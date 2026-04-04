"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList
} from "recharts";
import { format, subDays, parseISO, startOfWeek } from "date-fns";
import type { HabitCompletion } from "@/types";

export function WeeklyBarChart({ completions }: { completions: HabitCompletion[] }) {
  const data = useMemo(() => {
    // Group completions into the last 8 weeks
    const weeks: Record<string, number> = {};
    const now = new Date();
    
    // Initialize 8 weeks
    for (let i = 7; i >= 0; i--) {
      const d = startOfWeek(subDays(now, i * 7), { weekStartsOn: 1 });
      const weekLabel = format(d, "'W'I");
      weeks[weekLabel] = 0;
    }
    
    for (const c of completions) {
      const d = startOfWeek(parseISO(c.completed_date), { weekStartsOn: 1 });
      const weekLabel = format(d, "'W'I");
      if (weeks[weekLabel] !== undefined) {
        weeks[weekLabel]++;
      }
    }
    
    return Object.entries(weeks).map(([name, total]) => ({
      name,
      total,
      // Rough percentage (placeholder assumption of 10 habits max per week for UI sake)
      // Ideally we want exact rate, passing total habits to the component
      percent: Math.min(100, Math.round((total / 35) * 100))
    }));
  }, [completions]);

  if (data.length === 0) return null;

  return (
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-white/5 bg-[#111118] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">Weekly completion rate</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} allowDecimals={false} tickCount={5} />
          <Tooltip 
            cursor={{ fill: '#1f2937', opacity: 0.4 }}
            contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px" }} 
            formatter={(value: number) => [`${value}%`, "Rate"]} 
          />
          <Bar dataKey="percent" fill="#6366f1" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="percent" position="top" fill="#9ca3af" fontSize={10} formatter={(v: number) => `${v}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
