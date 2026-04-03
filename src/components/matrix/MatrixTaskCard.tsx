"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

export function MatrixTaskCard({
  task,
  onComplete,
}: {
  task: Task;
  onComplete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab border-border/60 bg-card/90 active:cursor-grabbing",
        isDragging && "opacity-80 ring-2 ring-primary/30",
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {task.priority}
        </Badge>
      </CardHeader>
      <CardContent className="flex justify-end pb-3 pt-0">
        {task.status !== "done" ? (
          <Button size="sm" variant="secondary" onClick={() => onComplete(task.id)} aria-label={`Mark ${task.title} done`}>
            Done
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
