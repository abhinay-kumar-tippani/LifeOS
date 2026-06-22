"use client";


import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "@/types";
import { KanbanCard } from "./KanbanCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function KanbanColumn({
  id,
  title,
  tasks,
  onAdd,
  onEditTask,
  onDeleteTask,
  onMarkDone,
}: {
  id: Task["status"];
  title: string;
  tasks: Task[];
  onAdd: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => Promise<void>;
  onMarkDone?: (task: Task) => Promise<void>;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div className="flex min-h-[420px] min-w-[260px] flex-1 flex-col rounded-xl border border-border/60 bg-muted/20">
      <div className="flex items-center justify-between border-b border-border/40 px-3 py-3">
        <h2 className="text-sm font-semibold">{title}</h2>
        <Button size="sm" variant="ghost" onClick={onAdd} aria-label={`Add task to ${title}`}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-3 p-3 transition-colors",
          isOver && "bg-primary/5",
        )}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <KanbanCard
              key={t.id}
              task={t}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onMarkDone={onMarkDone}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/60 px-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">No tasks here yet</p>
            <Button variant="link" size="sm" className="mt-1" onClick={onAdd}>
              Add a task
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}