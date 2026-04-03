"use client";

import { useMemo } from "react";
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
import { KanbanColumn } from "./KanbanColumn";

const COLS: { id: Task["status"]; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

function sortedByOrder(list: Task[]) {
  return [...list].sort((a, b) => (a.kanban_order ?? 0) - (b.kanban_order ?? 0));
}

export function KanbanBoard({
  tasks,
  onReorder,
  onAddToColumn,
}: {
  tasks: Task[];
  onReorder: (rows: { id: string; status: Task["status"]; kanban_order: number }[]) => Promise<void>;
  onAddToColumn: (status: Task["status"]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const grouped = useMemo(() => {
    const g: Record<Task["status"], Task[]> = { todo: [], in_progress: [], done: [] };
    for (const t of tasks) {
      g[t.status].push(t);
    }
    (Object.keys(g) as Task["status"][]).forEach((k) => {
      g[k] = sortedByOrder(g[k]);
    });
    return g;
  }, [tasks]);

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTask = tasks.find((t) => t.id === active.id);
    if (!activeTask) return;

    const overId = over.id as string;
    const overColumn = COLS.find((c) => c.id === overId)?.id;
    const overTask = tasks.find((t) => t.id === overId);

    const targetColumn: Task["status"] = overColumn ?? overTask?.status ?? activeTask.status;

    const cloneCol = (s: Task["status"]) => sortedByOrder(grouped[s]).map((t) => ({ ...t }));

    let todo = cloneCol("todo");
    let prog = cloneCol("in_progress");
    let done = cloneCol("done");

    const get = (s: Task["status"]) => (s === "todo" ? todo : s === "in_progress" ? prog : done);
    const set = (s: Task["status"], list: Task[]) => {
      if (s === "todo") todo = list;
      else if (s === "in_progress") prog = list;
      else done = list;
    };

    if (activeTask.status === targetColumn && overTask && overTask.status === targetColumn) {
      const list = get(targetColumn);
      const oldIdx = list.findIndex((t) => t.id === active.id);
      const newIdx = list.findIndex((t) => t.id === over.id);
      if (oldIdx < 0 || newIdx < 0 || oldIdx === newIdx) return;
      set(targetColumn, arrayMove(list, oldIdx, newIdx));
    } else {
      const fromList = get(activeTask.status);
      const fromIdx = fromList.findIndex((t) => t.id === active.id);
      if (fromIdx < 0) return;
      const [item] = fromList.splice(fromIdx, 1);
      set(activeTask.status, fromList);

      const toList = get(targetColumn);
      let insertIdx = toList.length;
      if (overTask && overTask.status === targetColumn) {
        insertIdx = toList.findIndex((t) => t.id === overId);
        if (insertIdx < 0) insertIdx = toList.length;
      }
      toList.splice(insertIdx, 0, { ...item, status: targetColumn });
      set(targetColumn, toList);
    }

    const updates: { id: string; status: Task["status"]; kanban_order: number }[] = [];
    for (const c of COLS) {
      get(c.id).forEach((t, i) => {
        updates.push({ id: t.id, status: c.id, kanban_order: i });
      });
    }

    await onReorder(updates);
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        {COLS.map((c) => (
          <KanbanColumn
            key={c.id}
            id={c.id}
            title={c.title}
            tasks={grouped[c.id]}
            onAdd={() => onAddToColumn(c.id)}
          />
        ))}
      </div>
    </DndContext>
  );
}
