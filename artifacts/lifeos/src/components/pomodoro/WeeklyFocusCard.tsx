"use client";


import { useMemo } from "react";
import { format, subDays, startOfDay, parseISO } from "date-fns";
import { Clock, TrendingUp } from "lucide-react";
import type { PomodoroSession } from "@/types";

export function WeeklyFocusCard({ sessions }: { sessions: PomodoroSession[] }) {
  const { totalMinutes, byDay, bestDay } = useMemo(() => {
    const days: { label: string; date: string; minutes: number; isToday: boolean }[] = [];
    const today = startOfDay(new Date());
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const key = format(d, "yyyy-MM-dd");
      const minutes = sessions
        .filter((s) => s.session_date === key && s.completed)
        .reduce((sum, s) => sum + s.duration_minutes, 0);
      days.push({
        label: format(d, "EEE"),
        date: key,
        minutes,
        isToday: i === 0,
      });
    }
    const totalMinutes = days.reduce((s, d) => s + d.minutes, 0);
    const max = Math.max(...days.map((d) => d.minutes), 1);
    const best = days.reduce((a, b) => (b.minutes > a.minutes ? b : a), days[0]);
    return { totalMinutes, byDay: days.map((d) => ({ ...d, pct: (d.minutes / max) * 100 })), bestDay: best };
  }, [sessions]);

  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const totalLabel = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">This week</p>
          <p className="mt-1 text-2xl font-semibold">{totalLabel}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Clock className="h-5 w-5" />
        </div>
      </div>

      {totalMinutes > 0 ? (
        <>
          <div className="mt-5 flex h-20 items-end gap-1.5">
            {byDay.map((d) => (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                <div className="relative flex h-full w-full items-end">
                  <div
                    className={
                      d.isToday
                        ? "w-full rounded-t bg-primary"
                        : d.minutes > 0
                          ? "w-full rounded-t bg-primary/60"
                          : "w-full rounded-t bg-muted"
                    }
                    style={{ height: `${Math.max(d.pct, 4)}%` }}
                    title={`${d.label}: ${d.minutes} min`}
                  />
                </div>
                <span
                  className={
                    d.isToday
                      ? "text-[10px] font-semibold text-foreground"
                      : "text-[10px] text-muted-foreground"
                  }
                >
                  {d.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            Best day: {bestDay.label} ({bestDay.minutes} min)
          </p>
        </>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">
          Complete a focus session to start tracking your weekly momentum.
        </p>
      )}
    </div>
  );
}
