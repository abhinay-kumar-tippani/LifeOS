"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils/cn";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";

const priorityColor: Record<Task["priority"], string> = {
  high: "border-red-500/50 bg-red-500/10 text-red-400",
  medium: "border-yellow-500/50 bg-yellow-500/10 text-yellow-400",
  low: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
};

export function KanbanCard({ task }: { task: Task }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const { user } = useUser();
  const queryClient = useQueryClient();
  const supabase = getSupabaseClient();

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    await supabase.from("tasks").delete().eq("id", task.id).eq("user_id", user.id);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  };

  return (
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
        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-card/80 rounded"
        onPointerDown={(e) => {
          // Prevent drag from starting on the delete button
          e.stopPropagation();
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {confirmingDelete ? (
          <div className="flex items-center gap-2 text-sm p-1">
            <span className="text-gray-400">Delete?</span>
            <button
              onClick={handleDelete}
              className="text-red-400 hover:text-red-300 font-medium cursor-pointer"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmingDelete(false)}
              className="text-gray-500 hover:text-gray-300 cursor-pointer"
            >
              No
            </button>
          </div>
        ) : (
          <button
            className="text-gray-600 hover:text-red-400 cursor-pointer p-1"
            onClick={(e) => {
              e.stopPropagation();
              setConfirmingDelete(true);
            }}
            aria-label="Delete task"
          >
            <Trash2 size={14} />
          </button>
        )}
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
  );
}
