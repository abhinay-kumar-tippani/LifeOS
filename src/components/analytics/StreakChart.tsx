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
  LabelList
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

  if (rows.length === 0) {
    return (
      <div className="flex h-[320px] min-h-[280px] items-center justify-center rounded-xl border border-border/60 bg-card/40 p-5">
        <p className="text-sm text-muted-foreground">Add habits to track streaks.</p>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-border/60 bg-card/40 p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">Current streaks by habit</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-border/40" />
          <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, "auto"]} tickCount={5} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: "8px" }}
            formatter={(v: number) => [`${v} days`, "Streak"]}
          />
          <Bar dataKey="streak" radius={[0, 4, 4, 0]} barSize={24}>
            {rows.map((e) => (
              <Cell key={e.name} fill={e.color} />
            ))}
            <LabelList dataKey="streak" position="right" fill="var(--muted-foreground)" fontSize={11} formatter={(v: number) => `${v} d`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
