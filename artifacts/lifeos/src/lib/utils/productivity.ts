import type { ProductivityScore } from "@/types";

export function computeProductivityScore(input: {
  habitsCompleted: number;
  habitsTotal: number;
  pomodoroSessions: number;
  journalEntriesThisWeek: number;
  tasksDoneToday: number;
}): ProductivityScore {
  const habitsPart =
    input.habitsTotal > 0
      ? (input.habitsCompleted / input.habitsTotal) * 40
      : 0;
  const pomodoroPart = Math.min(input.pomodoroSessions * 5, 30);
  const journalPart = Math.min(input.journalEntriesThisWeek * 5, 20);
  const tasksPart = Math.min(input.tasksDoneToday * 5, 10);

  const score = Math.round(
    Math.min(100, habitsPart + pomodoroPart + journalPart + tasksPart),
  );

  return {
    score,
    habits: Math.round(habitsPart),
    pomodoros: Math.round(pomodoroPart),
    journal: Math.round(journalPart),
    tasks: Math.round(tasksPart),
  };
}
