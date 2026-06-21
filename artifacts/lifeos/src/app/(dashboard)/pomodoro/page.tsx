
import { useEffect, useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useTasks } from "@/lib/hooks/useTasks";
import { usePomodoro } from "@/lib/hooks/usePomodoro";
import { PageHeader } from "@/components/shared/PageHeader";
import { PomodoroTimer } from "@/components/pomodoro/PomodoroTimer";
import { SessionHistory } from "@/components/pomodoro/SessionHistory";
import { WeeklyFocusCard } from "@/components/pomodoro/WeeklyFocusCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import type { PomodoroSession } from "@/types";
import { format, subDays, startOfDay } from "date-fns";

export default function PomodoroPage() {
  const { user } = useUser();
  const { tasks, loading: tl } = useTasks(user?.id);
  const { todaySessions, loading: pl, logSession, fetchToday, fetchRange } = usePomodoro(user?.id);
  const [weekSessions, setWeekSessions] = useState<PomodoroSession[]>([]);
  const [weekLoading, setWeekLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    const start = format(subDays(startOfDay(new Date()), 6), "yyyy-MM-dd");
    const end = format(startOfDay(new Date()), "yyyy-MM-dd");
    setWeekLoading(true);
    fetchRange(start, end).then((data) => {
      setWeekSessions(data);
      setWeekLoading(false);
    });
  }, [user, todaySessions, fetchRange]);

  const onWorkComplete = async (payload: { taskId: string | null; durationMinutes: number }) => {
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
  };

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
      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <PomodoroTimer tasks={tasks} onWorkComplete={onWorkComplete} />
        <div>
          {weekLoading ? (
            <div className="h-48 animate-pulse rounded-xl border border-border/60 bg-card/50" />
          ) : (
            <WeeklyFocusCard sessions={weekSessions} />
          )}
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-semibold">Today</h2>
        <SessionHistory sessions={todaySessions} tasks={tasks} />
      </div>
    </div>
  );
}
