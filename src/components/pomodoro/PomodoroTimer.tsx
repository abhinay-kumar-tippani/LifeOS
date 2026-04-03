"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Task } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimerControls, beep } from "./TimerControls";
import { cn } from "@/lib/utils/cn";

type Phase = "work" | "short" | "long";

const WORK_OPTIONS = [15, 25, 50] as const;

export function PomodoroTimer({
  tasks,
  onWorkComplete,
}: {
  tasks: Task[];
  onWorkComplete: (payload: { taskId: string | null; durationMinutes: number }) => Promise<void>;
}) {
  const [workMin, setWorkMin] = useState<15 | 25 | 50>(25);
  const [phase, setPhase] = useState<Phase>("work");
  const [cycleIndex, setCycleIndex] = useState(0);
  const [leftSec, setLeftSec] = useState(workMin * 60);
  const [running, setRunning] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef(phase);
  const workMinRef = useRef(workMin);
  const taskIdRef = useRef(taskId);
  const cycleRef = useRef(cycleIndex);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    workMinRef.current = workMin;
  }, [workMin]);
  useEffect(() => {
    taskIdRef.current = taskId;
  }, [taskId]);
  useEffect(() => {
    cycleRef.current = cycleIndex;
  }, [cycleIndex]);

  const segmentLen = useMemo(() => {
    if (phase === "work") return workMin * 60;
    if (phase === "short") return 5 * 60;
    return 15 * 60;
  }, [phase, workMin]);

  useEffect(() => {
    if (!running) return;
    tickRef.current = setInterval(() => {
      setLeftSec((s) => {
        if (s <= 1) {
          beep();
          const ph = phaseRef.current;
          const wm = workMinRef.current;
          const tid = taskIdRef.current;
          const cyc = cycleRef.current;
          queueMicrotask(async () => {
            setRunning(false);
            if (ph === "work") {
              await onWorkComplete({ taskId: tid, durationMinutes: wm });
              const nextCycle = cyc + 1;
              setCycleIndex(nextCycle);
              if (nextCycle % 4 === 0) {
                if (typeof window !== "undefined" && window.confirm("Start long break (15m)?")) {
                  setPhase("long");
                } else {
                  setPhase("work");
                }
              } else if (typeof window !== "undefined" && window.confirm("Start short break (5m)?")) {
                setPhase("short");
              } else {
                setPhase("work");
              }
            } else {
              if (typeof window !== "undefined" && window.confirm("Start next focus session?")) {
                setPhase("work");
              }
            }
          });
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
    };
  }, [running, onWorkComplete]);

  useEffect(() => {
    setLeftSec(segmentLen);
  }, [phase, segmentLen]);

  const mm = Math.floor(leftSec / 60)
    .toString()
    .padStart(2, "0");
  const ss = (leftSec % 60).toString().padStart(2, "0");
  const progress = segmentLen > 0 ? 1 - leftSec / segmentLen : 0;

  const reset = useCallback(() => {
    setRunning(false);
    setLeftSec(segmentLen);
  }, [segmentLen]);

  return (
    <div className="mx-auto max-w-md space-y-8 text-center">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
        <Select
          value={String(workMin)}
          onValueChange={(v) => {
            const n = Number(v) as 15 | 25 | 50;
            setWorkMin(n);
            if (phase === "work") setLeftSec(n * 60);
          }}
        >
          <SelectTrigger className="w-full sm:w-[180px]" aria-label="Work duration">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            {WORK_OPTIONS.map((m) => (
              <SelectItem key={m} value={String(m)}>
                {m} min focus
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={taskId ?? "none"} onValueChange={(v) => setTaskId(v === "none" ? null : v)}>
          <SelectTrigger className="w-full sm:w-[220px]" aria-label="Linked task">
            <SelectValue placeholder="Task" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No task</SelectItem>
            {tasks
              .filter((t) => t.status !== "done")
              .map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.title}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
        {phase === "work" ? "Focus" : phase === "short" ? "Short break" : "Long break"} · Session{" "}
        {(cycleIndex % 4) + 1} of 4
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
        running={running}
        onStart={() => setRunning(true)}
        onPause={() => setRunning(false)}
        onReset={reset}
        onSkip={reset}
      />
    </div>
  );
}
