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
import { getHabitColor } from "@/lib/utils/habitColors";

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
    <div className="h-[320px] w-full min-h-[280px] rounded-xl border border-white/5 bg-[#111118] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">Current streaks by habit</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 30 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1f2937" />
          <XAxis type="number" allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 'auto']} tickCount={5} />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{ fill: "#6b7280", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#1f2937', opacity: 0.4 }}
            contentStyle={{ background: "#1f2937", border: "1px solid #374151", color: "white", borderRadius: "8px" }}
            formatter={(v: number) => [`${v} days`, "Streak"]}
          />
          <Bar dataKey="streak" radius={[0, 4, 4, 0]} barSize={24}>
            {rows.map((e) => (
              <Cell key={e.name} fill={getHabitColor(e.name).hex} />
            ))}
            <LabelList dataKey="streak" position="right" fill="#9ca3af" fontSize={11} formatter={(v: number) => `${v} d`} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
