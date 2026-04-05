"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Goal } from "@/types";
import { cn } from "@/lib/utils/cn";

interface WeeklyGoalItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string, currentStatus: string) => void;
}

export function WeeklyGoalItem({ goal, onEdit, onDelete, onToggleComplete }: WeeklyGoalItemProps) {
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  const clampedProgress = Math.max(0, Math.min(100, goal.progress));
  
  let strokeColor = "text-emerald-500";
  if (clampedProgress <= 30) {
    strokeColor = "text-red-500";
  } else if (clampedProgress <= 60) {
    strokeColor = "text-amber-500";
  } else if (clampedProgress <= 89) {
    strokeColor = "text-blue-500";
  }

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="group bg-[#0d0d14] border border-white/5 rounded-lg px-4 py-3 hover:bg-[#111118] transition-colors duration-150 flex items-center gap-3">
      {/* LEFT: Circular progress indicator */}
      <div 
        className={cn("relative flex items-center justify-center shrink-0 cursor-pointer", goal.progress === 100 && "opacity-70")}
        onClick={() => onToggleComplete?.(goal.id, goal.status)}
      >
        <svg className="w-8 h-8 -rotate-90 transform" viewBox="0 0 32 32">
          {/* Background circle */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="transparent"
            strokeWidth="3"
            className="stroke-gray-700"
          />
          {/* Progress arc */}
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="transparent"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn("transition-all duration-500 will-change-[stroke-dashoffset]", strokeColor)}
            stroke="currentColor"
          />
        </svg>
        <span className="absolute text-[8px] text-gray-300 font-medium">
          {Math.round(clampedProgress)}%
        </span>
      </div>

      {/* MIDDLE: Goal info */}
      <div className="flex-1 min-w-0">
        <h4 className={cn("text-sm font-medium text-white truncate", goal.status === 'completed' && "line-through text-gray-500")}>
          {goal.title}
        </h4>
        {goal.target_date && (
          <span className="text-xs text-gray-600 block truncate mt-0.5">
            {formatDate(goal.target_date)}
          </span>
        )}
      </div>

      {/* RIGHT: Action buttons */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <button
          onClick={() => onEdit(goal)}
          className="text-gray-600 hover:text-gray-300 p-1 cursor-pointer transition-colors"
        >
          <Pencil className="w-[14px] h-[14px]" />
        </button>
        <button
          onClick={() => {
            if (window.confirm("Are you sure you want to delete this weekly goal?")) {
              onDelete(goal.id);
            }
          }}
          className="text-gray-600 hover:text-red-400 p-1 cursor-pointer transition-colors"
        >
          <Trash2 className="w-[14px] h-[14px]" />
        </button>
      </div>
    </div>
  );
}
