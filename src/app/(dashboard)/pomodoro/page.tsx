"use client";

import { useCallback } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useTasks } from "@/lib/hooks/useTasks";
import { usePomodoro } from "@/lib/hooks/usePomodoro";
import { PageHeader } from "@/components/shared/PageHeader";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { SessionHistory } from "@/components/pomodoro/SessionHistory";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

export default function PomodoroPage() {
  const { user } = useUser();
  const { tasks, loading: tl } = useTasks(user?.id);
  const { todaySessions, loading: pl, logSession, fetchToday } = usePomodoro(user?.id);

  const onWorkComplete = useCallback(
    async (payload: { taskId: string | null; durationMinutes: number }) => {
      const { error } = await logSession({
        task_id: payload.taskId,
        duration_minutes: payload.durationMinutes,
        break_minutes: 5,
        completed: true,
      });
      if (error) toast.error(error);
      else {
        toast.success("Session logged");
        await fetchToday();
      }
    },
    [logSession, fetchToday],
  );

  if (!user || tl || pl) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <PageHeader title="Pomodoro" description="Deep work, gentle breaks, automatic history." />
      <PomodoroTimer tasks={tasks} onWorkComplete={onWorkComplete} />
      <div>
        <h2 className="mb-4 text-lg font-semibold">Today</h2>
        <SessionHistory sessions={todaySessions} tasks={tasks} />
      </div>
    </div>
  );
}
