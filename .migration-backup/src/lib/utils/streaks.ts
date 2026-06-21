import { differenceInCalendarDays, format, parseISO, subDays } from "date-fns";

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

/** Longest consecutive calendar-day run in completion history. */
export function calculateBestStreak(completedDates: string[]): number {
  const unique = [...new Set(completedDates)].sort();
  if (unique.length === 0) return 0;
  if (unique.length === 1) return 1;

  let best = 1;
  let current = 1;
  for (let i = 1; i < unique.length; i++) {
    const prev = parseISO(`${unique[i - 1]}T12:00:00`);
    const curr = parseISO(`${unique[i]}T12:00:00`);
    if (differenceInCalendarDays(curr, prev) === 1) {
      current++;
      best = Math.max(best, current);
    } else {
      current = 1;
    }
  }
  return best;
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
