
import type { Habit, HabitCompletion } from "@/types";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { parseISO, subDays } from "date-fns";

type StreakEntry = { habitId: string; name: string; streak: number; bestStreak: number; color: string };

function computeTrend(
  habitId: string,
  completions: HabitCompletion[],
): "up" | "down" | "flat" {
  const today = new Date();
  const mid = subDays(today, 15);
  let recent = 0;
  let prior = 0;

  for (const c of completions) {
    if (c.habit_id !== habitId) continue;
    const d = parseISO(c.completed_date.slice(0, 10) + "T12:00:00");
    if (d >= mid) recent++;
    else prior++;
  }

  if (recent > prior) return "up";
  if (recent < prior) return "down";
  return "flat";
}

export function InsightsTable({
  habits,
  completions,
  streaks,
  windowDays,
}: {
  habits: Habit[];
  completions: HabitCompletion[];
  streaks: StreakEntry[];
  windowDays: number;
}) {
  const data = habits
    .map((h) => {
      const count = completions.filter((c) => c.habit_id === h.id).length;
      const rate = Math.round((count / windowDays) * 100);
      const streakEntry = streaks.find((s) => s.habitId === h.id);
      const bestStreak = streakEntry?.bestStreak ?? 0;
      const trend = computeTrend(h.id, completions);

      return {
        id: h.id,
        name: h.name,
        color: h.color,
        count,
        rate,
        bestStreak,
        trend,
      };
    })
    .sort((a, b) => b.rate - a.rate);

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border/60 bg-card/40">
      <div className="border-b border-border/40 p-5">
        <h3 className="text-sm font-semibold text-foreground">Habit summary</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Last {windowDays} days · trend compares recent 15d vs prior 15d</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="border-b border-border/40 bg-muted/30 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 font-medium">Habit</th>
              <th className="px-5 py-3 font-medium">Completions</th>
              <th className="px-5 py-3 font-medium">Rate</th>
              <th className="px-5 py-3 font-medium">Best streak</th>
              <th className="px-5 py-3 font-medium">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {data.map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? "bg-card/20" : "bg-muted/10"}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: row.color }} />
                    <span className="font-medium text-foreground">{row.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3">{row.count}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 text-xs">{row.rate}%</span>
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${row.rate}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">{row.bestStreak} days</td>
                <td className="px-5 py-3">
                  {row.trend === "up" && <ArrowUp className="h-4 w-4 text-emerald-400" aria-label="Trending up" />}
                  {row.trend === "down" && <ArrowDown className="h-4 w-4 text-red-400" aria-label="Trending down" />}
                  {row.trend === "flat" && <Minus className="h-4 w-4 text-muted-foreground" aria-label="Flat trend" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
