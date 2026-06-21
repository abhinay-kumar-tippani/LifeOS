
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "@/types";
import { MatrixTaskCard } from "./MatrixTaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { Plus } from "lucide-react";

export function MatrixQuadrant({
  id,
  label,
  description,
  hint,
  accent,
  tasks,
  onAdd,
  onComplete,
  onDelete,
}: {
  id: NonNullable<Task["quadrant"]>;
  label: string;
  description: string;
  hint?: string;
  accent: string;
  tasks: Task[];
  onAdd: () => void;
  onComplete: (id: string) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
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
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{label}</h3>
            <span className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">
              {tasks.length}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground">{description}</p>
          {hint ? (
            <p className="mt-1 text-[10px] italic text-muted-foreground/80">{hint}</p>
          ) : null}
        </div>
        <Button size="sm" variant="ghost" onClick={onAdd} aria-label={`Add task to ${label}`}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <MatrixTaskCard
              key={t.id}
              task={t}
              onComplete={onComplete}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-border/40 px-3 py-6 text-center">
            <p className="text-xs text-muted-foreground">Drop tasks here or add one</p>
            <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-xs" onClick={onAdd}>
              + Add task
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}