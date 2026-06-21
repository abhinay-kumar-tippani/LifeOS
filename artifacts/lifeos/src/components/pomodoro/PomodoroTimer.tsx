
import { useEffect, useMemo, useRef, useState } from "react";
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
    if (sessionCount > prevSessionCount.current) {
      if (sessionType !== "work") {
        onWorkComplete({ taskId, durationMinutes: totalSeconds / 60 }).catch(() => {});
      }
      prevSessionCount.current = sessionCount;
    }
  }, [sessionCount, sessionType, onWorkComplete, taskId, totalSeconds]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;
      if (e.code === "Space") {
        e.preventDefault();
        setIsRunning(!isRunning);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isRunning, setIsRunning]);

  const mm = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const ss = (timeLeft % 60).toString().padStart(2, "0");
  const progress = totalSeconds > 0 ? 1 - timeLeft / totalSeconds : 0;

  const sessionLabel =
    sessionType === "work" ? "Focus" : sessionType === "break" ? "Short break" : "Long break";
  const isBreak = sessionType !== "work";

  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    const verb = isRunning ? "started" : "paused";
    if (timeLeft === totalSeconds) {
      setAnnouncement(`${sessionLabel} session ${verb}. ${mm} minutes remaining.`);
    } else if (timeLeft === 0) {
      setAnnouncement(`${sessionLabel} session completed.`);
    } else if (timeLeft % 60 === 0) {
      setAnnouncement(`${mm} minutes remaining of ${sessionLabel} session.`);
    }
  }, [isRunning, sessionType, timeLeft, mm, totalSeconds, sessionLabel]);

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

      <p
        className={cn(
          "text-sm font-medium uppercase tracking-wider",
          isBreak ? "text-emerald-500" : "text-muted-foreground",
        )}
      >
        {sessionLabel} · Session {(sessionCount % 4) + 1} of 4
      </p>

      <div
        className={cn(
          "relative mx-auto h-56 w-56 rounded-full transition-colors",
          isBreak && "bg-emerald-500/10 ring-1 ring-emerald-500/30",
        )}
      >
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
          <circle className="text-muted/30" strokeWidth="6" stroke="currentColor" fill="none" r="42" cx="50" cy="50" />
          <circle
            className={cn(isBreak ? "text-emerald-500" : "text-primary", "transition-all")}
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
          <span
            className="font-mono text-4xl font-bold tabular-nums"
            role="timer"
          >
            {mm}:{ss}
          </span>
        </div>
      </div>

      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>

      <TimerControls
        running={isRunning}
        onStart={() => setIsRunning(true)}
        onPause={() => setIsRunning(false)}
        onReset={reset}
        onSkip={reset}
      />

      <p className="text-xs text-muted-foreground">
        Tip: press <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">Space</kbd> to start or pause
      </p>
    </div>
  );
}
