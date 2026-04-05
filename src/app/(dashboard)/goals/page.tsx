"use client";

import { useState } from "react";
import { Calendar, Zap } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser";
import { useGoals } from "@/lib/hooks/useGoals";
import type { Goal } from "@/types";

import { MainGoalCard } from "@/components/goals/MainGoalCard";
import { MonthlyGoalCard } from "@/components/goals/MonthlyGoalCard";
import { WeeklyGoalItem } from "@/components/goals/WeeklyGoalItem";
import { GoalForm } from "@/components/goals/GoalForm";

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
      await updateGoal(editingGoal.id, data);
    } else {
      await createGoal({ ...data, type: formType });
    }
    setFormOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Goals</h1>
        <p className="text-gray-400 text-sm mt-1">
          Track your main goal, monthly targets, and weekly focus.
        </p>
      </div>

      <div className="flex flex-col gap-8 pb-20">
        {/* SECTION 1: MAIN GOAL */}
        <section>
          <MainGoalCard
            goal={mainGoal}
            onAdd={() => openForm("main")}
            onEdit={(goal) => openEditForm(goal)}
            onDelete={(id) => deleteGoal(id)}
          />
        </section>

        {/* SECTION 2: MONTHLY GOALS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-[18px] h-[18px] text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Monthly Goals</h2>
            </div>
            <button
              onClick={() => openForm("monthly")}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition-colors"
            >
              + Add
            </button>
          </div>

          {monthlyGoals.length === 0 ? (
            <div className="border border-dashed border-white/10 rounded-xl py-8 px-4 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-sm text-center">No monthly goals yet</p>
              <p className="text-gray-700 text-xs text-center mt-1">Break your main goal into monthly milestones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* SECTION 3: WEEKLY GOALS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-[18px] h-[18px] text-amber-400" />
              <h2 className="text-lg font-semibold text-white">This Week</h2>
            </div>
            <button
              onClick={() => openForm("weekly")}
              className="text-sm text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer transition-colors"
            >
              + Add
            </button>
          </div>

          {weeklyGoals.length === 0 ? (
            <div className="py-6 text-center">
              <p className="text-gray-600 text-sm">No weekly goals — what's your focus this week?</p>
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
      </div>

      {/* FORM MODAL */}
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
