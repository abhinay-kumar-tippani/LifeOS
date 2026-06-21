
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Habit, HabitCompletion } from "@/types";

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
        color: h.color,
      }))
      .filter((d) => d.value > 0);
  }, [habits, completions]);

  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  if (data.length === 0) {
    return (
      <div className="flex h-[320px] min-h-[280px] items-center justify-center rounded-xl border border-border/60 bg-card/40 p-5">
        <p className="text-sm text-muted-foreground">No completions in this period yet.</p>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-border/60 bg-card/40 p-5">
      <h3 className="mb-2 text-sm font-semibold text-foreground">Completion by habit</h3>
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
          <span className="text-2xl font-bold text-foreground">{total}</span>
          <span className="text-xs text-muted-foreground">Total</span>
        </div>
      </div>
    </div>
  );
}
