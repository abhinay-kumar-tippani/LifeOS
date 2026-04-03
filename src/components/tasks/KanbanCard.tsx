"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils/cn";

const priorityColor: Record<Task["priority"], string> = {
  high: "border-red-500/50 bg-red-500/10 text-red-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  low: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
};

export function KanbanCard({ task }: { task: Task }) {
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
        "cursor-grab border-border/60 bg-card/80 active:cursor-grabbing",
        isDragging && "z-10 opacity-90 ring-2 ring-primary/40",
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="space-y-2 pb-2">
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
        <CardContent className="pt-0">
          <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>
        </CardContent>
      ) : null}
    </Card>
  );
}
