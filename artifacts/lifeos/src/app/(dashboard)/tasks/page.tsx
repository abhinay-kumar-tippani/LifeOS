"use client";


import { useState } from "react";
import { useUser } from "@/lib/hooks/useUser";
import { useTasks } from "@/lib/hooks/useTasks";
import { PageHeader } from "@/components/shared/PageHeader";
import { KanbanBoard } from "@/components/tasks/KanbanBoard";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskEditSheet } from "@/components/tasks/TaskEditSheet";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Task } from "@/types";
import { toast } from "sonner";

export default function TasksPage() {
  const { user } = useUser();
  const { tasks, loading, error, createTask, updateTask, deleteTask, reorderKanban } = useTasks(user?.id);
  const [open, setOpen] = useState(false);
  const [column, setColumn] = useState<Task["status"]>("todo");
  const [editing, setEditing] = useState<Task | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (error) return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  if (!user || loading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  async function handleDelete(task: Task) {
    const { error: e } = await deleteTask(task.id);
    if (e) {
      toast.error(e);
    } else {
      toast.success("Task deleted");
    }
  }

  return (
    <div>
      <PageHeader title="Tasks" description="Drag tasks between columns. Click any card to edit." />
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
        onEditTask={(t) => {
          setEditing(t);
          setSheetOpen(true);
        }}
        onDeleteTask={handleDelete}
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
      <TaskEditSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        task={editing}
        onUpdate={async (id, patch) => {
          const { error: e } = await updateTask(id, patch);
          if (e) {
            toast.error(e);
            return { error: e };
          }
          toast.success("Task updated");
          return { error: null };
        }}
      />
    </div>
  );
}