"use client";

import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { Skeleton } from "@/components/ui/skeleton";

export function WeeklyHeatmap({
  cells,
  loading,
}: {
  cells: { date: string; ratio: number }[];
  loading: boolean;
}) {
  if (loading) {
    return <Skeleton className="h-32 w-full rounded-xl" />;
  }

  if (cells.length === 0) return null;

  const weeks: { date: string; ratio: number }[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <h3 className="mb-3 text-sm font-semibold">12-week contribution</h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((w, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {w.map((c) => (
              <div
                key={c.date}
                title={`${c.date}: ${Math.round(c.ratio * 100)}%`}
                className={cn(
                  "h-3 w-3 rounded-sm",
                  c.ratio === 0 && "bg-muted/40",
                  c.ratio > 0 && c.ratio < 0.25 && "bg-primary/30",
                  c.ratio >= 0.25 && c.ratio < 0.5 && "bg-primary/50",
                  c.ratio >= 0.5 && c.ratio < 0.75 && "bg-primary/70",
                  c.ratio >= 0.75 && "bg-primary",
                )}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Intensity = % of active habits completed · {format(parseISO(cells[cells.length - 1]!.date + "T12:00:00"), "MMM d")}{" "}
        → {format(parseISO(cells[0]!.date + "T12:00:00"), "MMM d")}
      </p>
    </div>
  );
}
