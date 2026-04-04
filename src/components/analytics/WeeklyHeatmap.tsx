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

  // Week labels for alternate rows (Mon, Wed, Fri => indices 1, 3, 5 assuming start is Sunday=0)
  // Actually, cells ordering might be arbitrary, so we just label them manually on the side.
  const weekLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <div className="rounded-xl border border-white/5 bg-[#111118] p-5">
      <h3 className="mb-4 text-sm font-semibold text-white">12-week contribution</h3>
      
      <div className="flex">
        {/* Left labels */}
        <div className="flex flex-col gap-[3px] pr-2 pt-[14px]">
          {weekLabels.map((lbl, i) => (
            <div key={i} className="h-[14px] text-[10px] leading-[14px] text-gray-500 w-6">
              {lbl}
            </div>
          ))}
        </div>

        {/* Heatmap Grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-4">
          {weeks.map((w, wi) => {
            // Very hacky month label check - only show month if it's the first week of the month
            const isFirstWeekOfMonth = w[0] && parseISO(w[0].date).getDate() <= 7;
            const monthLabel = isFirstWeekOfMonth ? format(parseISO(w[0]!.date), "MMM") : "";
            
            return (
              <div key={wi} className="flex flex-col gap-[3px]">
                <div className="h-[14px] text-[10px] text-gray-500 mb-1">{monthLabel}</div>
                {w.map((c) => (
                  <div
                    key={c.date}
                    title={`${c.date} — ${Math.round(c.ratio * 100)}% habits completed`}
                    className={cn(
                      "h-[14px] w-[14px] rounded-sm transition-colors hover:ring-1 hover:ring-white/50",
                      c.ratio === 0 && "bg-gray-800",
                      c.ratio > 0 && c.ratio < 0.25 && "bg-indigo-900",
                      c.ratio >= 0.25 && c.ratio < 0.5 && "bg-indigo-600",
                      c.ratio >= 0.5 && c.ratio < 0.75 && "bg-indigo-400",
                      c.ratio >= 0.75 && "bg-indigo-300",
                    )}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">
        <span>Less</span>
        <div className="flex gap-[3px]">
          <div className="h-[14px] w-[14px] rounded-sm bg-gray-800" />
          <div className="h-[14px] w-[14px] rounded-sm bg-indigo-900" />
          <div className="h-[14px] w-[14px] rounded-sm bg-indigo-600" />
          <div className="h-[14px] w-[14px] rounded-sm bg-indigo-400" />
          <div className="h-[14px] w-[14px] rounded-sm bg-indigo-300" />
        </div>
        <span>More</span>
      </div>
    </div>
  );
}
