import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  eachDayOfInterval,
  parseISO,
  isSameDay,
  startOfWeek,
  endOfWeek,
} from "date-fns";

export function formatDisplayDate(d: Date) {
  return format(d, "EEEE, MMMM d, yyyy");
}

export function todayISODate() {
  return format(new Date(), "yyyy-MM-dd");
}

export function lastNDaysISO(n: number): string[] {
  const end = startOfDay(new Date());
  const start = subDays(end, n - 1);
  return eachDayOfInterval({ start, end }).map((d) => format(d, "yyyy-MM-dd"));
}

export function parseDateOnly(s: string) {
  return parseISO(s);
}

export function sameDay(a: Date, b: Date) {
  return isSameDay(a, b);
}

export function weekRangeContaining(date: Date) {
  return {
    start: startOfWeek(date, { weekStartsOn: 0 }),
    end: endOfWeek(date, { weekStartsOn: 0 }),
  };
}

export { startOfDay, endOfDay, subDays, eachDayOfInterval };
