"use client";

import { Pencil, Trash2, MoreVertical } from "lucide-react";
import type { Goal } from "@/types";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { useState } from "react";

interface WeeklyGoalItemProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onToggleComplete?: (id: string, currentStatus: string) => void;
}

export function WeeklyGoalItem({ goal, onEdit, onDelete, onToggleComplete }: WeeklyGoalItemProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(new Date(dateStr));
  };

  const clampedProgress = Math.max(0, Math.min(100, goal.progress));

  let strokeColor = "text-emerald-500";
  if (clampedProgress <= 30) {
    strokeColor = "text-destructive";
  } else if (clampedProgress <= 60) {
    strokeColor = "text-amber-500";
  } else if (clampedProgress <= 89) {
    strokeColor = "text-blue-500";
  }

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

  return (
    <div className="group flex items-center gap-3 rounded-lg border border-border/40 bg-card/40 px-4 py-3 transition-colors hover:bg-card/60">
      {/* LEFT: Circular progress indicator */}
      <button
        className={cn(
          "relative flex shrink-0 cursor-pointer items-center justify-center rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
          goal.progress === 100 && "opacity-70",
        )}
        onClick={() => onToggleComplete?.(goal.id, goal.status)}
        aria-label={`Toggle completion for ${goal.title}, currently ${goal.progress}%`}
      >
        <svg className="h-8 w-8 -rotate-90 transform" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r={radius} fill="transparent" strokeWidth="3" className="stroke-muted" />
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
        <span className="absolute text-[8px] font-medium text-foreground">
          {Math.round(clampedProgress)}%
        </span>
      </button>

      {/* MIDDLE: Goal info */}
      <div className="min-w-0 flex-1">
        <h4
          className={cn(
            "truncate text-sm font-medium",
            goal.status === "completed" && "text-muted-foreground line-through",
          )}
        >
          {goal.title}
        </h4>
        {goal.target_date ? (
          <span className="mt-0.5 block truncate text-xs text-muted-foreground">
            {formatDate(goal.target_date)}
          </span>
        ) : null}
      </div>

      {/* RIGHT: Action button */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          aria-label="Weekly goal options"
        >
          <MoreVertical className="h-4 w-4" aria-hidden />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(goal)}>
            <Pencil className="h-4 w-4" aria-hidden />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              setConfirmDelete(true);
            }}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete weekly goal?"
        description={`"${goal.title}" will be removed permanently.`}
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete(goal.id);
        }}
      />
    </div>
  );
}