"use client";

import { Target, Star, Pencil, Trash2, Calendar, AlertTriangle } from "lucide-react";
import type { Goal } from "@/types";
import { GoalProgressBar } from "./GoalProgressBar";
import { cn } from "@/lib/utils/cn";

interface MainGoalCardProps {
  goal: Goal | undefined;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function MainGoalCard({ goal, onEdit, onDelete, onAdd }: MainGoalCardProps) {
  if (!goal) {
    return (
      <div className="border-2 border-dashed border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center p-8 min-h-[280px]">
        <Target className="w-12 h-12 text-indigo-400 mb-3" />
        <h3 className="text-xl font-semibold text-white mt-3">Set your main goal</h3>
        <p className="text-gray-500 text-sm max-w-xs text-center mt-1">
          Your main goal is your north star — the one big thing you're working toward.
        </p>
        <button
          onClick={onAdd}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium mt-6 cursor-pointer transition-colors"
        >
          + Set Main Goal
        </button>
      </div>
    );
  }

  const isPastDue = goal.target_date && new Date(goal.target_date) < new Date() && goal.status !== "completed";

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(new Date(dateStr));
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-950/80 via-[#111118] to-violet-950/40 border border-indigo-500/20 rounded-2xl p-8 overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.08)]">
      {/* TOP ROW */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-indigo-400 fill-indigo-400" />
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            Main Goal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="text-gray-500 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete your main goal?")) {
                onDelete(goal.id);
              }
            }}
            className="text-gray-600 hover:text-red-400 p-2 rounded-lg hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TITLE & DESC */}
      <h2 className="text-3xl font-bold text-white mt-4 line-clamp-2">
        {goal.title}
      </h2>
      {goal.description && (
        <p className="text-gray-400 text-base mt-3 leading-relaxed max-w-2xl">
          {goal.description}
        </p>
      )}

      {/* PROGRESS */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-400 font-medium">Progress</span>
          <span className="text-sm text-white font-semibold">{goal.progress}%</span>
        </div>
        <GoalProgressBar progress={goal.progress} size="lg" />
      </div>

      {/* FOOTER: DATE & UPDATE BUTTON */}
      <div className="flex items-center justify-between mt-8">
        <div className="flex items-center">
          {goal.target_date ? (
            <div className={cn("flex items-center gap-2 text-sm", isPastDue ? "text-red-400" : "text-gray-500")}>
              {isPastDue ? <AlertTriangle className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              <span>Target: {formatDate(goal.target_date)}</span>
            </div>
          ) : (
            <div />
          )}
        </div>
        <button
          onClick={() => onEdit(goal)}
          className="text-sm font-medium text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors cursor-pointer"
        >
          Update Progress
        </button>
      </div>
    </div>
  );
}
