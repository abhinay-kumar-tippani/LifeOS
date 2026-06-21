
import { useUser } from "@/lib/hooks/useUser";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { PageHeader } from "@/components/shared/PageHeader";
import { WeeklyHeatmap } from "@/components/analytics/WeeklyHeatmap";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { InsightsTable } from "@/components/analytics/InsightsTable";
import { formatRangeTrend, monthOverMonthHintClass } from "@/lib/utils/analyticsHelpers";
import { CheckSquare, Flame, Timer, ListChecks, Download } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { format, subDays } from "date-fns";
import { toast } from "sonner";

import { HabitCompletionChart } from "@/components/analytics/HabitCompletionChart";
import { HabitPieChart } from "@/components/analytics/HabitPieChart";
import { WeeklyBarChart } from "@/components/analytics/WeeklyBarChart";
import { StreakChart } from "@/components/analytics/StreakChart";
import { FocusTimeChart } from "@/components/analytics/FocusTimeChart";

export default function AnalyticsPage() {
  const { user } = useUser();
  const [pathname, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);

  const range = searchParams.get("range") || "30";
  const rangeDays = range === "7" ? 7 : range === "90" ? 90 : 30;

  const { loading, error, data, refresh } = useAnalytics(user?.id, rangeDays);

  if (error) return <ErrorState message={error} onRetry={refresh} />;
  if (!user || (loading && !data)) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }

  if (!data) {
    return <EmptyState title="No analytics yet" description="Complete habits and sessions to see trends." />;
  }

  const monthCompletions = data.completionsLast30.length;
  const longestStreak = Math.max(0, ...data.streaksByHabit.map((s) => s.streak));
  const { chartStartDate, accountAgeDays, windowDays } = data;
  const completionsLabel = accountAgeDays < rangeDays ? "Completions (since joined)" : `Completions (${rangeDays}d)`;

  const focusMin = data.pomodoro14.filter((p) => p.completed).reduce((acc, p) => acc + p.duration_minutes, 0);
  const focusSessions = data.pomodoro14.filter((p) => p.completed).length;
  const score = data.productivity.score;

  const momHint = formatRangeTrend(monthCompletions, data.completionsPrevious30, accountAgeDays, rangeDays);
  const momPct =
    accountAgeDays >= rangeDays && data.completionsPrevious30 > 0
      ? Math.round(((monthCompletions - data.completionsPrevious30) / data.completionsPrevious30) * 100)
      : null;

  const upOrDown = momPct !== null ? (momPct >= 0 ? "up" : "down") : "";
  const pctLabel = momPct !== null ? `${Math.abs(momPct)}%` : "";
  const periodLabel = rangeDays === 7 ? "week" : rangeDays === 90 ? "90 days" : "month";
  const prevPeriodLabel = rangeDays === 7 ? "last week" : rangeDays === 90 ? "the previous 90-day period" : "last month";

  const insightSentence = momPct !== null
    ? `You completed ${monthCompletions} habits this ${periodLabel}, ${upOrDown} ${pctLabel} from ${prevPeriodLabel}.`
    : `You completed ${monthCompletions} habits this ${periodLabel}. Trend calculations will display once your account has enough history.`;

  function handleCSVExport() {
    if (!data) return;
    const csvRows = [
      ["Date", "Habit Completions", "Focus Minutes"],
    ];
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = subDays(new Date(), i);
      const iso = format(d, "yyyy-MM-dd");
      const comps = data.completionsLast30.filter((c) => c.completed_date.slice(0, 10) === iso).length;
      const focus = data.pomodoro14.filter((p) => p.session_date === iso && p.completed).reduce((sum, p) => sum + p.duration_minutes, 0);
      csvRows.push([iso, String(comps), String(focus)]);
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `lifeos-analytics-${rangeDays}d-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export downloaded");
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Analytics"
        description="Visualize momentum across habits, focus, and output."
        action={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border/60 bg-muted/30 p-1">
              {[
                { label: "7d", value: "7" },
                { label: "30d", value: "30" },
                { label: "90d", value: "90" },
              ].map((opt) => (
                <Button
                  key={opt.value}
                  variant={range === opt.value ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString());
                    params.set("range", opt.value);
                    navigate(`${pathname}?${params.toString()}`);
                  }}
                  className="h-8 px-3 text-xs"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCSVExport}
              className="h-9 gap-1.5"
              aria-label="Export analytics to CSV"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export CSV</span>
            </Button>
          </div>
        }
      />

      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary flex items-center gap-2">
        <Flame className="h-4 w-4 shrink-0" aria-hidden />
        <span className="font-medium">{insightSentence}</span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={completionsLabel}
          value={monthCompletions}
          hint={momHint ?? undefined}
          hintClassName={momHint ? monthOverMonthHintClass(momPct) : undefined}
          icon={<CheckSquare className="h-4 w-4" />}
        />
        <StatCard
          label="Best consecutive streak"
          value={longestStreak ? `${longestStreak} days` : "—"}
          hint="Current streak across habits"
          icon={<Flame className="h-4 w-4" />}
        />
        <StatCard
          label="Productivity score"
          value={score}
          hint="Habits, focus, journal & tasks (today)"
          icon={<ListChecks className="h-4 w-4" />}
        />
        <StatCard
          label="Focus time (14d)"
          value={`${focusMin} min`}
          hint={`${focusSessions} session${focusSessions === 1 ? "" : "s"} completed`}
          icon={<Timer className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <HabitCompletionChart
            habits={data.habits}
            completions={data.completionsLast30}
            loading={loading}
            chartStartDate={chartStartDate}
          />
        </div>
        <div className="lg:col-span-1">
          <HabitPieChart habits={data.habits} completions={data.completionsLast30} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <WeeklyBarChart completions={data.completionsLast30} habitsCount={data.habits.length} />
        </div>
        <div className="lg:col-span-2">
          <StreakChart
            rows={data.streaksByHabit.map((s) => ({ name: s.name, streak: s.streak, color: s.color }))}
            loading={loading}
          />
        </div>
      </div>

      <FocusTimeChart sessions={data.pomodoro14} loading={loading} />

      <WeeklyHeatmap cells={data.heatmap12w} loading={loading} />

      <InsightsTable
        habits={data.habits}
        completions={data.completionsLast30}
        streaks={data.streaksByHabit}
        windowDays={windowDays}
      />
    </div>
  );
}
