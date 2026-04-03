"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export function StreakChart({
  rows,
  loading,
}: {
  rows: { name: string; streak: number; color: string }[];
  loading: boolean;
}) {
  if (loading) {
    return <Skeleton className="h-[280px] w-full rounded-xl" />;
  }

  if (rows.length === 0) return null;

  return (
    <div className="h-[300px] rounded-xl border border-border/60 bg-card/40 p-4">
      <h3 className="mb-2 text-sm font-semibold">Habit streaks</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis type="number" allowDecimals={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
            formatter={(v: number) => [`${v} days`, "Streak"]}
          />
          <Bar dataKey="streak" radius={[0, 4, 4, 0]}>
            {rows.map((e) => (
              <Cell key={e.name} fill={e.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
