"use client";

import { useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useTasks } from "@/lib/hooks/useTasks";
import { PageHeader } from "@/components/shared/PageHeader";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Task } from "@/types";
import { toast } from "sonner";

export default function TasksPage() {
  const { user } = useUser();
  const { tasks, loading, error, createTask, reorderKanban } = useTasks(user?.id);
  const [open, setOpen] = useState(false);
  const [column, setColumn] = useState<Task["status"]>("todo");

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!user || loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Kanban" description="Drag tasks between columns. Priority is color-coded." />
      <KanbanBoard
        tasks={tasks}
        onReorder={async (rows) => {
          const { error: e } = await reorderKanban(rows);
          if (e) toast.error(e);
        }}
        onAddToColumn={(s) => {
          setColumn(s);
          setOpen(true);
        }}
      />
      <TaskForm
        open={open}
        onOpenChange={setOpen}
        initialStatus={column}
        onCreate={async (v) => {
          const { error: e } = await createTask({
            title: v.title,
            description: v.description ?? null,
            status: v.status,
            priority: v.priority,
            due_date: v.due_date || null,
          });
          if (e) toast.error(e);
          else toast.success("Task created");
          return { error: e };
        }}
      />
    </div>
  );
}
