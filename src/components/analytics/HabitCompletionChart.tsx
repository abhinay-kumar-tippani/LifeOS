"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, eachDayOfInterval, differenceInDays } from "date-fns";
import type { Habit, HabitCompletion } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { getHabitColor } from "@/lib/utils/habitColors";
import { BarChart2 } from "lucide-react";

export function HabitCompletionChart({
  habits,
  completions,
  loading,
  chartStartDate,
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  loading: boolean;
  /** ISO date string for the start of the chart window */
  chartStartDate?: string;
}) {
  const data = useMemo(() => {
    const now = new Date();
    const start = chartStartDate ? new Date(chartStartDate) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    const interval = eachDayOfInterval({ start, end: now });
    
    const countsByDate: Record<string, number> = {};
    for (const c of completions) {
      const d = c.completed_date.slice(0, 10);
      countsByDate[d] = (countsByDate[d] || 0) + 1;
    }

    return interval.map((date) => {
      const d = format(date, "yyyy-MM-dd");
      return {
        date: format(date, "MMM d"),
        total: countsByDate[d] || 0
      };
    });
  }, [completions, chartStartDate]);

  const dayCount = data.length;

  if (loading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  // New account with only 1 day of data — show encouraging empty state
  if (dayCount <= 1) {
    return (
      <div className="flex h-[320px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-[#111118] p-5">
        <BarChart2 className="h-8 w-8 text-gray-600" />
        <p className="max-w-xs text-center text-sm text-gray-500">
          Your analytics will appear here as you build your streak. Start checking off habits today!
        </p>
      </div>
    );
  }

  if (habits.length === 0 || data.length === 0) {
    return null;
  }

  return (
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-white/5 bg-[#111118] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">
        Habit completions ({dayCount < 30 ? "since joined" : "30 days"})
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
          <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 'auto']} tickCount={5} />
          <Tooltip contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Habits completed"
            stroke="#6366f1"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
