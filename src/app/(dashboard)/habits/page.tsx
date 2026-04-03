"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, subDays } from "date-fns";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { HabitGrid } from "@/components/habits/HabitGrid";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitForm } from "@/components/habits/HabitForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import type { Habit } from "@/types";
import { toast } from "sonner";

export default function HabitsPage() {
  const { user } = useUser();
  const uid = user?.id;
  const {
    habits,
    completions,
    loading,
    error,
    fetchCompletions,
    toggleCompletion,
    createHabit,
    updateHabit,
    archiveHabit,
  } = useHabits(uid);

  const days = useMemo(() => {
    const end = new Date();
    const start = subDays(end, 29);
    const out: string[] = [];
    for (let i = 0; i < 30; i++) {
      out.push(format(subDays(end, 29 - i), "yyyy-MM-dd"));
    }
    return out;
  }, []);

  const startDate = days[0]!;
  const endDate = days[days.length - 1]!;

  useEffect(() => {
    if (!uid) return;
    void fetchCompletions(startDate, endDate);
  }, [uid, startDate, endDate, fetchCompletions]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);

  const onToggle = useCallback(
    async (habitId: string, date: string) => {
      const isDone = completions.some(
        (c) => c.habit_id === habitId && c.completed_date.slice(0, 10) === date,
      );
      const { error: e } = await toggleCompletion(habitId, date, isDone);
      if (e) toast.error(e);
      else await fetchCompletions(startDate, endDate);
    },
    [completions, toggleCompletion, fetchCompletions, startDate, endDate],
  );

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div>
      <PageHeader
        title="My Habits"
        description="30-day grid — tap cells to mark progress."
        action={
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            aria-label="Add habit"
          >
            Add Habit
          </Button>
        }
      />

      {habits.length === 0 && !loading ? (
        <EmptyState
          title="No habits yet"
          description="Create your first habit to start tracking streaks and completions."
          action={{
            label: "Add habit",
            onClick: () => {
              setEditing(null);
              setFormOpen(true);
            },
          }}
        />
      ) : (
        <HabitGrid habits={habits} days={days} completions={completions} onToggle={onToggle} loading={loading} />
      )}

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {habits.map((h) => (
          <HabitCard
            key={h.id}
            habit={h}
            completions={completions}
            onEdit={() => {
              setEditing(h);
              setFormOpen(true);
            }}
            onArchive={async () => {
              const { error: e } = await archiveHabit(h.id);
              if (e) toast.error(e);
              else toast.success("Archived");
            }}
          />
        ))}
      </div>

      <HabitForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editing}
        onSave={async (values) => {
          if (editing) {
            const { error: e } = await updateHabit(editing.id, {
              name: values.name,
              description: values.description ?? null,
              color: values.color,
              icon: values.icon,
              frequency: values.frequency,
              target_days: values.target_days,
            });
            if (e) toast.error(e);
            else toast.success("Updated");
            return { error: e };
          }
          const { error: e } = await createHabit({
            name: values.name,
            description: values.description,
            color: values.color,
            icon: values.icon,
            frequency: values.frequency,
            target_days: values.target_days,
          });
          if (e) toast.error(e);
          else toast.success("Created");
          return { error: e };
        }}
      />
    </div>
  );
}
