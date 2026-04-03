"use client";

import type { PomodoroSession, Task } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format, parseISO } from "date-fns";
import { EmptyState } from "@/components/shared/EmptyState";

export function SessionHistory({
  sessions,
  tasks,
}: {
  sessions: PomodoroSession[];
  tasks: Task[];
}) {
  const taskMap = new Map(tasks.map((t) => [t.id, t]));

  if (sessions.length === 0) {
    return <EmptyState title="No sessions today" description="Complete a Pomodoro to see it here." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Task</TableHead>
            <TableHead>Done</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="text-muted-foreground">
                {s.created_at
                  ? format(parseISO(s.created_at), "HH:mm")
                  : "—"}
              </TableCell>
              <TableCell>{s.duration_minutes} min</TableCell>
              <TableCell>
                {s.task_id ? taskMap.get(s.task_id)?.title ?? "—" : "—"}
              </TableCell>
              <TableCell>{s.completed ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
