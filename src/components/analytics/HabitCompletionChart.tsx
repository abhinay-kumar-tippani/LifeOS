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
import { format, parseISO } from "date-fns";
import type { Habit, HabitCompletion } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function HabitCompletionChart({
  habits,
  completions,
  loading,
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  loading: boolean;
}) {
  const data = useMemo(() => {
    const byDate: Record<string, Record<string, number>> = {};
    for (const c of completions) {
      const d = c.completed_date.slice(0, 10);
      if (!byDate[d]) byDate[d] = {};
      byDate[d][c.habit_id] = 1;
    }
    const dates = Object.keys(byDate).sort();
    return dates.map((d) => {
      const row: Record<string, string | number> = {
        date: format(parseISO(d + "T12:00:00"), "MMM d"),
      };
      for (const h of habits) {
        row[h.name] = byDate[d]?.[h.id] ? 1 : 0;
      }
      return row;
    });
  }, [habits, completions]);

  if (loading) {
    return <Skeleton className="h-[300px] w-full rounded-xl" />;
  }

  if (habits.length === 0 || data.length === 0) {
    return null;
  }

  return (
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-border/60 bg-card/40 p-4">
      <h3 className="mb-2 text-sm font-semibold">Habit completions (30 days)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <YAxis allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }} />
          <Legend />
          {habits.slice(0, 5).map((h) => (
            <Line
              key={h.id}
              type="monotone"
              dataKey={h.name}
              stroke={h.color}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
