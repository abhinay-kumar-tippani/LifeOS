"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task } from "@/types";
import { MatrixQuadrant } from "./MatrixQuadrant";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTasks } from "@/lib/hooks/useTasks";

const Q = [
  {
    id: "q1" as const,
    label: "Do First",
    description: "Urgent + Important",
    accent: "border-red-500/40 bg-red-500/5",
  },
  {
    id: "q2" as const,
    label: "Schedule",
    description: "Not Urgent + Important",
    accent: "border-blue-500/40 bg-blue-500/5",
  },
  {
    id: "q3" as const,
    label: "Delegate",
    description: "Urgent + Not Important",
    accent: "border-yellow-500/40 bg-yellow-500/5",
  },
  {
    id: "q4" as const,
    label: "Eliminate",
    description: "Not Urgent + Not Important",
    accent: "border-zinc-500/40 bg-zinc-500/5",
  },
];

export function EisenhowerGrid({ userId }: { userId: string }) {
  const { tasks, fetchTasks, createTask, updateTask } = useTasks(userId);
  const [dialogQ, setDialogQ] = useState<Task["quadrant"] | null>(null);
  const [title, setTitle] = useState("");

  const byQ = useMemo(() => {
    const m: Record<string, Task[]> = { q1: [], q2: [], q3: [], q4: [] };
    for (const t of tasks) {
      if (t.quadrant && m[t.quadrant]) m[t.quadrant].push(t);
    }
    (Object.keys(m) as (keyof typeof m)[]).forEach((k) => {
      m[k].sort((a, b) => (a.kanban_order ?? 0) - (b.kanban_order ?? 0));
    });
    return m;
  }, [tasks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  async function persistOrders(next: Record<string, Task[]>) {
    const updates: { id: string; quadrant: Task["quadrant"]; kanban_order: number }[] = [];
    for (const q of Q) {
      next[q.id].forEach((t, i) => {
        updates.push({ id: t.id, quadrant: q.id, kanban_order: i });
      });
    }
    for (const u of updates) {
      await updateTask(u.id, { quadrant: u.quadrant, kanban_order: u.kanban_order });
    }
    await fetchTasks();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask || !activeTask.quadrant) return;

    const overId = over.id as string;
    const overQuad = Q.find((q) => q.id === overId)?.id;
    const overTask = tasks.find((t) => t.id === overId);

    const targetQ = overQuad ?? overTask?.quadrant ?? activeTask.quadrant;
    if (!targetQ) return;

    const next: Record<string, Task[]> = {
      q1: [...byQ.q1],
      q2: [...byQ.q2],
      q3: [...byQ.q3],
      q4: [...byQ.q4],
    };

    const removeFromAll = (id: string) => {
      for (const k of Object.keys(next)) {
        next[k] = next[k].filter((t) => t.id !== id);
      }
    };

    if (activeTask.quadrant === targetQ && overTask && overTask.quadrant === targetQ) {
      const list = [...next[targetQ]];
      const oldIdx = list.findIndex((t) => t.id === active.id);
      const newIdx = list.findIndex((t) => t.id === over.id);
      if (oldIdx >= 0 && newIdx >= 0 && oldIdx !== newIdx) {
        next[targetQ] = arrayMove(list, oldIdx, newIdx);
      }
    } else {
      removeFromAll(activeTask.id);
      const list = [...next[targetQ]];
      let insertIdx = list.length;
      if (overTask && overTask.quadrant === targetQ) {
        insertIdx = list.findIndex((t) => t.id === overId);
        if (insertIdx < 0) insertIdx = list.length;
      }
      list.splice(insertIdx, 0, { ...activeTask, quadrant: targetQ });
      next[targetQ] = list;
    }

    await persistOrders(next);
  }

  async function addTask() {
    if (!dialogQ || !title.trim()) return;
    await createTask({
      title: title.trim(),
      description: null,
      status: "todo",
      priority: "medium",
      due_date: null,
      quadrant: dialogQ,
    });
    setTitle("");
    setDialogQ(null);
    await fetchTasks();
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-2">
          {Q.map((q) => (
            <MatrixQuadrant
              key={q.id}
              id={q.id}
              label={q.label}
              description={q.description}
              accent={q.accent}
              tasks={byQ[q.id]}
              onAdd={() => setDialogQ(q.id)}
              onComplete={async (id) => {
                await updateTask(id, { status: "done" });
                await fetchTasks();
              }}
            />
          ))}
        </div>
      </DndContext>

      <Dialog open={!!dialogQ} onOpenChange={(o) => !o && setDialogQ(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New matrix task</DialogTitle>
          </DialogHeader>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" aria-label="Task title" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogQ(null)}>
              Cancel
            </Button>
            <Button onClick={addTask} aria-label="Create matrix task">
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
