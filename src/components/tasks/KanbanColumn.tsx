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
}: {
  id: Task["status"];
  title: string;
  tasks: Task[];
  onAdd: () => void;
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
            <KanbanCard key={t.id} task={t} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
