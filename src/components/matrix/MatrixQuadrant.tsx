"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "@/types";
import { MatrixTaskCard } from "./MatrixTaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function MatrixQuadrant({
  id,
  label,
  description,
  accent,
  tasks,
  onAdd,
  onComplete,
}: {
  id: NonNullable<Task["quadrant"]>;
  label: string;
  description: string;
  accent: string;
  tasks: Task[];
  onAdd: () => void;
  onComplete: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: id! });

  return (
    <div
      className={cn(
        "flex min-h-[220px] flex-col rounded-xl border bg-card/40 p-3",
        accent,
        isOver && "ring-2 ring-primary/40",
      )}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold">{label}</h3>
          <p className="text-[11px] text-muted-foreground">{description}</p>
        </div>
        <Button size="sm" variant="ghost" onClick={onAdd} aria-label={`Add task to ${label}`}>
          +
        </Button>
      </div>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <MatrixTaskCard key={t.id} task={t} onComplete={onComplete} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
