"use client";

import { useMemo, useEffect, useRef } from "react";
import type { Task } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimerControls } from "./TimerControls";
import { cn } from "@/lib/utils/cn";
import { usePomodoroStore } from "@/lib/stores/pomodoroStore";

const WORK_OPTIONS = [15, 25, 50] as const;

export function PomodoroTimer({
  tasks,
  onWorkComplete,
}: {
  tasks: Task[];
  onWorkComplete: (payload: { taskId: string | null; durationMinutes: number }) => Promise<void>;
}) {
  const {
    timeLeft,
    isRunning,
    setIsRunning,
    sessionType,
    sessionCount,
    reset,
    totalSeconds,
    taskId,
    setTaskId,
    setTimeLeft,
    setTotalSeconds
  } = usePomodoroStore();

  const prevSessionCount = useRef(sessionCount);

  useEffect(() => {
    // If the session count increased, it means a session just finished!
    // We log it here if they happen to be on the page.
    if (sessionCount > prevSessionCount.current) {
      if (sessionType !== "work") {
        // The one that just finished WAS work, since it switched TO break
        // Actually, wait, sessionCount increments on work completion.
        onWorkComplete({ taskId, durationMinutes: totalSeconds / 60 }).catch(() => {});
      }
      prevSessionCount.current = sessionCount;
    }
  }, [sessionCount, sessionType, onWorkComplete, taskId, totalSeconds]);

  const mm = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");
  const progress = totalSeconds > 0 ? 1 - timeLeft / totalSeconds : 0;

  return (
    <div className="mx-auto max-w-md space-y-8 text-center">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Select
          value={String(totalSeconds / 60)}
          onValueChange={(v) => {
            const n = Number(v) as 15 | 25 | 50;
            if (sessionType === 'work') {
              setTimeLeft(n * 60);
              setTotalSeconds(n * 60);
            }
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px] cursor-pointer" aria-label="Work duration">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            {WORK_OPTIONS.map((m) => (
              <SelectItem key={m} value={String(m)} className="cursor-pointer">
                {m} min focus
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={taskId ?? "none"} onValueChange={(v) => setTaskId(v === "none" ? null : v)}>
          <SelectTrigger className="w-full sm:w-[220px] cursor-pointer" aria-label="Linked task">
            <SelectValue placeholder="Task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className="cursor-pointer">No task</SelectItem>
            {tasks
              .filter((t) => t.status !== "done")
              .map((t) => (
                <SelectItem key={t.id} value={t.id} className="cursor-pointer">
                  {t.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {sessionType === "work" ? "Focus" : sessionType === "break" ? "Short break" : "Long break"} · Session{" "}
        {(sessionCount % 4) + 1} of 4
      </p>

      <div className="relative mx-auto h-56 w-56">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle className="text-muted/30" strokeWidth="6" stroke="currentColor" fill="none" r="42" cx="50" cy="50" />
          <circle
            className={cn("text-primary transition-all")}
            strokeWidth="6"
            strokeDasharray={2 * Math.PI * 42}
            strokeDashoffset={2 * Math.PI * 42 * (1 - progress)}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            r="42"
            cx="50"
            cy="50"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-bold tabular-nums">
            {mm}:{ss}
          </span>
        </div>
      </div>

      <TimerControls
        running={isRunning}
        onStart={() => setIsRunning(true)}
        onPause={() => setIsRunning(false)}
        onReset={reset}
        onSkip={reset}
      />
    </div>
  );
}
