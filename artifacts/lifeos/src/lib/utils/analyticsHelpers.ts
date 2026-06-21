/** Format month-over-month change for KPI hint text. Returns null when not enough data. */
export function formatMonthOverMonth(
  current: number,
  previous: number,
  accountAgeDays: number,
): string | null {
  if (accountAgeDays < 30) return null;
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return "New activity vs prior 30d";
  const pct = Math.round(((current - previous) / previous) * 100);
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}% vs prior 30d`;
}

/** Format range-over-range trend for KPI hint text. Returns null when not enough data. */
export function formatRangeTrend(
  current: number,
  previous: number,
  accountAgeDays: number,
  rangeDays: number,
): string | null {
  if (accountAgeDays < rangeDays) return null;
  if (previous === 0 && current === 0) return null;
  if (previous === 0) return `New activity vs prior ${rangeDays}d`;
  const pct = Math.round(((current - previous) / previous) * 100);
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct}% vs prior ${rangeDays}d`;
}

export function monthOverMonthHintClass(pct: number | null): string {
  if (pct === null) return "text-muted-foreground";
  if (pct > 0) return "text-emerald-400";
  if (pct < 0) return "text-red-400";
  return "text-muted-foreground";
}
