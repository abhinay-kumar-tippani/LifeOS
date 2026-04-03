import { format, subDays, parseISO } from "date-fns";

/**
 * Consecutive calendar days completed for a habit, counting backward from `fromDate`.
 */
export function calculateStreak(
  completedDates: string[],
  _habitId: string,
  fromDate: Date = new Date(),
): number {
  const set = new Set(completedDates);
  let streak = 0;
  let cursor = fromDate;
  for (let i = 0; i < 365; i++) {
    const key = format(cursor, "yyyy-MM-dd");
    if (set.has(key)) {
      streak++;
      cursor = subDays(cursor, 1);
    } else {
      break;
    }
  }
  return streak;
}

export function datesSetFromCompletions(
  completions: { habit_id: string; completed_date: string }[],
  habitId: string,
) {
  return completions
    .filter((c) => c.habit_id === habitId)
    .map((c) =>
      typeof c.completed_date === "string"
        ? c.completed_date.slice(0, 10)
        : format(parseISO(String(c.completed_date)), "yyyy-MM-dd"),
    );
}
