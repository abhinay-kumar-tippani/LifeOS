"use client";

import { Calendar, Pencil, Trash2 } from "lucide-react";
import type { Goal } from "@/types";
import { GoalProgressBar } from "./GoalProgressBar";

interface MonthlyGoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

export function MonthlyGoalCard({ goal, onEdit, onDelete }: MonthlyGoalCardProps) {
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  return (
    <div className="group bg-[#111118] border border-white/6 rounded-xl p-5 hover:border-white/12 transition-all duration-200">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
          <h4 className="font-semibold text-white text-base truncate">
            {goal.title}
          </h4>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(goal)}
            className="text-gray-500 hover:text-white p-1.5 rounded-md hover:bg-white/5 transition-colors cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to delete this goal?")) {
                onDelete(goal.id);
              }
            }}
            className="text-gray-600 hover:text-red-400 p-1.5 rounded-md hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <GoalProgressBar progress={goal.progress} size="md" />
      </div>

      <div className="flex items-center justify-between mt-4">
        <span className="text-xs text-gray-500">
          {Math.round(goal.progress)}% complete
        </span>
        {goal.target_date && (
          <span className="text-xs text-gray-600">
            {formatDate(goal.target_date)}
          </span>
        )}
      </div>
    </div>
  );
}
