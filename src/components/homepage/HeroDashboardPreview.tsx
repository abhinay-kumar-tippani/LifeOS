"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Flame,
  LayoutGrid,
  Timer,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const previewTasks = [
  { title: "Review weekly goals", done: true },
  { title: "Deep work: LifeOS roadmap", done: false },
  { title: "Evening journal entry", done: false },
];

const weekDays = ["M", "T", "W", "T", "F", "S", "S"];
const weekDone = [true, true, true, false, false, false, false];

export function HeroDashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.12 }}
      className="mx-auto mt-14 max-w-5xl"
    >
      <p className="mb-4 text-center text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        Inside your workspace
      </p>
      <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-1 shadow-2xl shadow-black/40">
        <div className="rounded-xl border border-white/5 bg-[#08080c]/95 p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Today’s tasks */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Today&apos;s tasks
                </span>
                <LayoutGrid className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
              <ul className="space-y-2.5">
                {previewTasks.map((t) => (
                  <li key={t.title} className="flex items-start gap-2.5 text-sm">
                    {t.done ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    ) : (
                      <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    )}
                    <span
                      className={cn(
                        "leading-snug",
                        t.done ? "text-muted-foreground line-through" : "text-foreground",
                      )}
                    >
                      {t.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Habit streak */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Habit streaks
                </span>
                <Flame className="h-4 w-4 text-orange-400" aria-hidden />
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="text-2xl font-bold tabular-nums text-foreground">12</p>
                  <p className="text-xs text-muted-foreground">day streak · example</p>
                </div>
                <div className="flex gap-1">
                  {weekDays.map((d, i) => (
                    <div key={`${d}-${i}`} className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-md border text-[10px] font-medium leading-6",
                          weekDone[i]
                            ? "border-primary/50 bg-primary/25 text-primary"
                            : "border-white/10 bg-white/[0.02] text-muted-foreground",
                        )}
                      >
                        {d}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Focus session */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Focus session
                </span>
                <Timer className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
              <div className="flex items-center gap-4">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-primary/40 bg-primary/10">
                  <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
                    25:00
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">Pomodoro timer</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Link a task, log completed sessions, and see today&apos;s focus at a glance.
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly progress */}
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Weekly snapshot
                </span>
                <TrendingUp className="h-4 w-4 text-muted-foreground" aria-hidden />
              </div>
              <div className="flex h-16 items-end justify-between gap-1.5">
                {[40, 65, 45, 80, 55, 70, 50].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/50 to-primary/20"
                    style={{ height: `${h}%` }}
                    title={`Day ${i + 1}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Habits completed · last 7 days (illustrative)
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-white/15 bg-white/[0.02] px-3 py-2 text-center text-[11px] text-muted-foreground">
            Preview only — your real stats appear after you sign in.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
