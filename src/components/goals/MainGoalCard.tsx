"use client";

import { Target, Star, Pencil, Trash2, Calendar, AlertTriangle } from "lucide-react";
import type { Goal } from "@/types";
import { GoalProgressBar } from "./GoalProgressBar";
import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

interface MainGoalCardProps {
  goal: Goal | undefined;
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export function MainGoalCard({ goal, onEdit, onDelete, onAdd }: MainGoalCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!goal) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-card/30 p-8">
        <Target className="mb-3 h-12 w-12 text-primary" aria-hidden />
        <h3 className="mt-3 text-xl font-semibold">Set your main goal</h3>
        <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
          Your main goal is your north star — the one big thing you&apos;re working toward.
        </p>
        <Button onClick={onAdd} className="mt-6" aria-label="Set main goal">
          + Set Main Goal
        </Button>
      </div>
    );
  }

  const isPastDue = goal.target_date && new Date(goal.target_date) < new Date() && goal.status !== "completed";

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr));
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 shadow-lg">
      {/* TOP ROW */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 fill-primary text-primary" aria-hidden />
          <span className="text-xs font-bold uppercase tracking-widest text-primary">
            Main Goal
          </span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            aria-label="Goal options"
          >
            <MoreVertical className="h-4 w-4" aria-hidden />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(goal)}>
              <Pencil className="h-4 w-4" aria-hidden />
              Edit / update progress
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
      </div>

      {/* TITLE & DESC */}
      <h2 className="mt-4 line-clamp-2 text-3xl font-bold">{goal.title}</h2>
      {goal.description ? (
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {goal.description}
        </p>
      ) : null}

      {/* PROGRESS */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Progress</span>
          <span className="text-sm font-semibold">{goal.progress}%</span>
        </div>
        <GoalProgressBar progress={goal.progress} size="lg" />
      </div>

      {/* FOOTER: DATE & UPDATE BUTTON */}
      <div className="mt-8 flex items-center justify-between">
        <div className="flex items-center">
          {goal.target_date ? (
            <div className={cn("flex items-center gap-2 text-sm", isPastDue ? "text-destructive" : "text-muted-foreground")}>
              {isPastDue ? <AlertTriangle className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
              <span>Target: {formatDate(goal.target_date)}</span>
            </div>
          ) : null}
        </div>
        <Button variant="secondary" onClick={() => onEdit(goal)} aria-label="Update progress">
          Update Progress
        </Button>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete main goal?"
        description="Your main goal will be removed. You can set a new one anytime."
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