
import { useCallback, useEffect, useMemo, useState } from "react";
import { startOfMonth, endOfMonth, eachDayOfInterval, subMonths, addMonths, format } from "date-fns";
import { useUser } from "@/lib/hooks/useUser";
import { useHabits } from "@/lib/hooks/useHabits";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { HabitGrid } from "@/components/habits/HabitGrid";
import { HabitCard } from "@/components/habits/HabitCard";
import { HabitMobileList } from "@/components/habits/HabitMobileList";
import { HabitForm } from "@/components/habits/HabitForm";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
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

  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()));

  const days = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
  }, [currentMonth]);

  const startDate = days[0]!;
  const endDate = days[days.length - 1]!;

  useEffect(() => {
    if (!uid) return;
    void fetchCompletions();
  }, [uid, fetchCompletions]);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Habit | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<Habit | null>(null);

  const onToggle = useCallback(
    async (habitId: string, date: string) => {
      const todayStr = format(new Date(), "yyyy-MM-dd");
      if (date !== todayStr) {
        toast.error("Only today's habit can be marked from the grid. Past days are locked.");
        return;
      }

      const isDone = completions.some(
        (c) => c.habit_id === habitId && c.completed_date.slice(0, 10) === date,
      );
      const { error: e } = await toggleCompletion(habitId, date, isDone);
      if (e) toast.error(e);
      else await fetchCompletions();
    },
    [completions, toggleCompletion, fetchCompletions],
  );

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div>
      <PageHeader
        title="My Habits"
        description="Monthly calendar — check off today from the grid."
        action={
          <div className="flex items-center gap-3">
            <Button
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
              aria-label="Add habit"
            >
              Add Habit
            </Button>
          </div>
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
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                &lt; Prev
              </Button>
              <Button variant="outline" size="sm" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                Next &gt;
              </Button>
            </div>
          </div>

          {/* Mobile: simple today-only checklist */}
          <HabitMobileList
            habits={habits}
            completions={completions}
            onToggle={onToggle}
            onEdit={(h) => {
              setEditing(h);
              setFormOpen(true);
            }}
            onArchive={(h) => setArchiveTarget(h)}
          />

          {/* md+: full month grid */}
          <div className="hidden md:block">
            <HabitGrid habits={habits} days={days} completions={completions} onToggle={onToggle} loading={loading} />
          </div>

          {/* Persistent info banner */}
          <div className="rounded-lg border border-border/40 bg-card/30 px-3 py-2 text-xs text-muted-foreground">
            <strong className="text-foreground">Heads up:</strong> only today is editable. Past days are your history and can&apos;t be changed.
          </div>
        </div>
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
            onArchive={() => setArchiveTarget(h)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(open) => !open && setArchiveTarget(null)}
        title="Archive habit?"
        description={`"${archiveTarget?.name}" will be hidden from your active list. You can show archived habits in analytics from Settings.`}
        confirmLabel="Archive"
        destructive
        onConfirm={async () => {
          if (!archiveTarget) return;
          const { error: e } = await archiveHabit(archiveTarget.id);
          if (e) toast.error(e);
          else toast.success("Archived");
          setArchiveTarget(null);
        }}
      />

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
