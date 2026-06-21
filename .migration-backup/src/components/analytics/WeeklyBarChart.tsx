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
  LabelList,
} from "recharts";
import { format, subDays, parseISO, startOfWeek, endOfWeek, min, max } from "date-fns";
import type { HabitCompletion } from "@/types";

export function WeeklyBarChart({
  completions,
  habitsCount,
}: {
  completions: HabitCompletion[];
  habitsCount: number;
}) {
  const data = useMemo(() => {
    const weeks: Record<string, { total: number; weekStart: Date; weekEnd: Date }> = {};
    const now = new Date();

    for (let i = 7; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(now, i * 7), { weekStartsOn: 1 });
      const weekLabel = format(weekStart, "'W'I");
      weeks[weekLabel] = {
        total: 0,
        weekStart,
        weekEnd: endOfWeek(weekStart, { weekStartsOn: 1 }),
      };
    }

    for (const c of completions) {
      const d = parseISO(c.completed_date.slice(0, 10) + "T12:00:00");
      const weekStart = startOfWeek(d, { weekStartsOn: 1 });
      const weekLabel = format(weekStart, "'W'I");
      if (weeks[weekLabel]) {
        weeks[weekLabel].total++;
      }
    }

    return Object.entries(weeks).map(([name, { total, weekStart, weekEnd }]) => {
      const effectiveStart = max([weekStart, subDays(now, 59)]);
      const effectiveEnd = min([weekEnd, now]);
      const daysInWeek = Math.max(1, Math.ceil((effectiveEnd.getTime() - effectiveStart.getTime()) / 86400000) + 1);
      const possible = Math.max(1, habitsCount * daysInWeek);
      const percent = habitsCount > 0 ? Math.min(100, Math.round((total / possible) * 100)) : 0;
      return { name, total, percent };
    });
  }, [completions, habitsCount]);

  if (data.length === 0 || habitsCount === 0) {
    return (
      <div className="flex h-[320px] min-h-[280px] items-center justify-center rounded-xl border border-border/60 bg-card/40 p-5">
        <p className="text-sm text-muted-foreground">Complete habits to see weekly rates.</p>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-border/60 bg-card/40 p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Weekly completion rate</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-border/40" />
          <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} allowDecimals={false} tickCount={5} />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px" }}
            formatter={(value: number, _name, item) => [
              `${value}% (${(item.payload as { total: number }).total} completions)`,
              "Rate",
            ]}
          />
          <Bar dataKey="percent" fill="#6366f1" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="percent" position="top" fill="var(--muted-foreground)" fontSize={10} formatter={(v: number) => `${v}%`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
