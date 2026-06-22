"use client";


import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { Check, MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";

const priorityColor: Record<Task["priority"], string> = {
  high: "border-red-500/50 bg-red-500/10 text-red-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  low: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
};

export function KanbanCard({
  task,
  onEdit,
  onDelete,
  onMarkDone,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => Promise<void>;
  onMarkDone?: (task: Task) => Promise<void>;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          "cursor-grab border-border/60 bg-card/80 active:cursor-grabbing group relative",
          isDragging && "z-10 opacity-90 ring-2 ring-primary/40",
        )}
        {...attributes}
        {...listeners}
      >
        <div
          className="absolute top-2 right-2 z-20"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              aria-label={`Task options: ${task.title}`}
            >
              <MoreVertical className="h-4 w-4" aria-hidden />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4" aria-hidden />
                Edit
              </DropdownMenuItem>
              {onMarkDone && task.status !== "done" ? (
                <DropdownMenuItem
                  onClick={async () => {
                    await onMarkDone(task);
                    toast.success("Marked done");
                  }}
                >
                  <Check className="h-4 w-4" aria-hidden />
                  Mark done
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
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

        <CardHeader className="space-y-2 pb-2 pr-12">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium leading-snug">{task.title}</h3>
            <Badge variant="outline" className={cn("shrink-0 text-[10px]", priorityColor[task.priority])}>
              {task.priority}
            </Badge>
          </div>
          {task.due_date ? (
            <p className="text-xs text-muted-foreground">
              Due {format(parseISO(task.due_date + "T12:00:00"), "MMM d")}
            </p>
          ) : null}
        </CardHeader>
        {task.description ? (
          <CardContent className="pt-0 pr-12">
            <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
          </CardContent>
        ) : null}
      </Card>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this task?"
        description={`"${task.title}" will be removed permanently. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          setConfirmDelete(false);
          await onDelete(task);
          toast.success("Task deleted");
        }}
      />
    </>
  );
}