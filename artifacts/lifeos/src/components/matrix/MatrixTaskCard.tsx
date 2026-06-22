"use client";


import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { Check, MoreVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";

export function MatrixTaskCard({
  task,
  onComplete,
  onDelete,
}: {
  task: Task;
  onComplete: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
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
          "cursor-grab border-border/60 bg-card/90 active:cursor-grabbing relative",
          isDragging && "opacity-80 ring-2 ring-primary/30",
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
              {task.status !== "done" ? (
                <DropdownMenuItem
                  onClick={async () => {
                    await onComplete(task.id);
                    toast.success("Marked done");
                  }}
                >
                  <Check className="h-4 w-4" aria-hidden />
                  Mark done
                </DropdownMenuItem>
              ) : null}
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

        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2 pr-12">
          <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {task.priority}
          </Badge>
        </CardHeader>
        {task.description ? (
          <CardContent className="pb-3 pt-0 pr-12">
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
          await onDelete(task.id);
          toast.success("Task deleted");
        }}
      />
    </>
  );
}