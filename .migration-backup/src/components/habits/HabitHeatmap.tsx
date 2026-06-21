"use client";

import { format, subDays } from "date-fns";
import { cn } from "@/lib/utils/cn";

export function HabitHeatmap({
  completedSet,
  days = 14,
  color,
}: {
  completedSet: Set<string>;
  days?: number;
  color: string;
}) {
  const cells: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    cells.push(format(subDays(new Date(), i), "yyyy-MM-dd"));
  }
  return (
    <div className="flex gap-0.5" aria-label="Recent completion heatmap">
      {cells.map((d) => {
        const on = completedSet.has(d);
        return (
          <div
            key={d}
            title={d}
            className={cn("h-3 w-3 rounded-sm", on ? "opacity-100" : "opacity-20")}
            style={{ backgroundColor: on ? color : "currentColor" }}
          />
        );
      })}
    </div>
  );
}
