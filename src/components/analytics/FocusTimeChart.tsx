"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { format, parseISO } from "date-fns";
import type { PomodoroSession } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function FocusTimeChart({
  sessions,
  loading,
}: {
  sessions: PomodoroSession[];
  loading: boolean;
}) {
  const data = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of sessions) {
      const d = s.session_date.slice(0, 10);
      if (!s.completed) continue;
      map[d] = (map[d] ?? 0) + (s.duration_minutes ?? 0);
    }
    const keys = Object.keys(map).sort();
    return keys.map((k) => ({
      day: format(parseISO(k + "T12:00:00"), "MMM d"),
      minutes: map[k],
    }));
  }, [sessions]);

  if (loading) {
    return <Skeleton className="h-[280px] w-full rounded-xl" />;
  }

  if (data.length === 0) return null;

  return (
    <div className="h-[300px] rounded-xl border border-border/60 bg-card/40 p-4">
      <h3 className="mb-2 text-sm font-semibold">Focus minutes (14 days)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fillFocus" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border/40" />
          <XAxis dataKey="day" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
          <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} />
          <Tooltip
            contentStyle={{ background: "#18181b", borderColor: "#27272a" }}
            labelStyle={{ color: "#e4e4e7" }}
          />
          <Area type="monotone" dataKey="minutes" stroke="#6366f1" fill="url(#fillFocus)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
