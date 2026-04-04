"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { getSupabaseClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/hooks/useUser";

export function MatrixTaskCard({
  task,
  onComplete,
}: {
  task: Task;
  onComplete: (id: string) => void;
}) {
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
        "cursor-grab border-border/60 bg-card/90 active:cursor-grabbing group relative",
        isDragging && "opacity-80 ring-2 ring-primary/30",
      )}
      {...attributes}
      {...listeners}
    >
      <div 
        className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-card/90 rounded"
        onPointerDown={(e) => {
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

      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2 pr-12">
        <h4 className="text-sm font-medium leading-snug">{task.title}</h4>
        <Badge variant="outline" className="shrink-0 text-[10px]">
          {task.priority}
        </Badge>
      </CardHeader>
      <CardContent className="flex justify-end pb-3 pt-0">
        {task.status !== "done" ? (
          <Button size="sm" variant="secondary" onClick={(e) => {
            e.stopPropagation();
            onComplete(task.id);
          }} className="cursor-pointer" aria-label={`Mark ${task.title} done`}>
            Done
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
