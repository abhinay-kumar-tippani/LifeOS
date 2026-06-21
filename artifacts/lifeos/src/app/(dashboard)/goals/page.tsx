
import { useState } from "react";
import { Calendar, Zap } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useGoals } from "@/lib/hooks/useGoals";
import type { Goal } from "@/types";
import { PageHeader } from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { MainGoalCard } from "@/components/goals/MainGoalCard";
import { MonthlyGoalCard } from "@/components/goals/MonthlyGoalCard";
import { WeeklyGoalItem } from "@/components/goals/WeeklyGoalItem";
import { GoalForm } from "@/components/goals/GoalForm";
import { fireGoalCompleteConfetti } from "@/lib/utils/confetti";
import { toast } from "sonner";

export default function GoalsPage() {
  const { user } = useUser();
  const { mainGoal, monthlyGoals, weeklyGoals, createGoal, updateGoal, deleteGoal } = useGoals(user?.id);

  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<"main" | "monthly" | "weekly">("main");
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const openForm = (type: "main" | "monthly" | "weekly") => {
    setFormType(type);
    setEditingGoal(null);
    setFormOpen(true);
  };

  const openEditForm = (goal: Goal) => {
    setFormType(goal.type);
    setEditingGoal(goal);
    setFormOpen(true);
  };

  const handleSave = async (data: Partial<Goal>) => {
    if (editingGoal) {
      const wasComplete = (editingGoal.progress ?? 0) >= 100;
      const willBeComplete = (data.progress ?? 0) >= 100;
      const { error } = await updateGoal(editingGoal.id, data);
      if (error) toast.error(error.message);
      else {
        toast.success("Updated");
        if (!wasComplete && willBeComplete) {
          fireGoalCompleteConfetti();
          toast.success("Goal reached 100%! 🎉");
        }
      }
    } else {
      const { error } = await createGoal({ ...data, type: formType });
      if (error) toast.error(error.message);
      else toast.success("Goal added");
    }
    setFormOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <PageHeader
        title="Goals"
        description="Track your main goal, monthly targets, and weekly focus."
      />

      <section>
        <MainGoalCard
          goal={mainGoal}
          onAdd={() => openForm("main")}
          onEdit={(goal) => openEditForm(goal)}
          onDelete={(id) => deleteGoal(id)}
        />
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-[18px] w-[18px] text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Monthly Goals</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => openForm("monthly")}>
            + Add
          </Button>
        </div>

        {monthlyGoals.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 px-4 py-8">
            <p className="text-center text-sm text-muted-foreground">No monthly goals yet</p>
            <p className="mt-1 text-center text-xs text-muted-foreground">
              Break your main goal into monthly milestones
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {monthlyGoals.map((goal) => (
              <MonthlyGoalCard
                key={goal.id}
                goal={goal}
                onEdit={() => openEditForm(goal)}
                onDelete={(id) => deleteGoal(id)}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-[18px] w-[18px] text-amber-400" />
            <h2 className="text-lg font-semibold text-foreground">This Week</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={() => openForm("weekly")}>
            + Add
          </Button>
        </div>

        {weeklyGoals.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 py-6 text-center">
            <p className="text-sm text-muted-foreground">No weekly goals — what&apos;s your focus this week?</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {weeklyGoals.map((goal) => (
              <WeeklyGoalItem
                key={goal.id}
                goal={goal}
                onEdit={() => openEditForm(goal)}
                onDelete={(id) => deleteGoal(id)}
              />
            ))}
          </div>
        )}
      </section>

      {formOpen && (
        <GoalForm
          type={formType}
          goal={editingGoal ?? undefined}
          onClose={() => setFormOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
