"use client";

import { useUser } from "@/lib/hooks/useUser";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { PageHeader } from "@/components/shared/PageHeader";
import { HabitCompletionChart } from "@/components/analytics/HabitCompletionChart";
import { WeeklyHeatmap } from "@/components/analytics/WeeklyHeatmap";
import { ProductivityScoreCard } from "@/components/analytics/ProductivityScoreCard";
import { StreakChart } from "@/components/analytics/StreakChart";
import { FocusTimeChart } from "@/components/analytics/FocusTimeChart";
import { StatCard } from "@/components/shared/StatCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AnalyticsPage() {
  const { user } = useUser();
  const { loading, error, data, refresh } = useAnalytics(user?.id);

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

  return (
    <div className="space-y-10">
      <PageHeader title="Analytics" description="Visualize momentum across habits, focus, and output." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Completions (30d)" value={monthCompletions} />
        <StatCard label="Longest streak" value={`${longestStreak} d`} />
        <StatCard label="Pomodoros (14d)" value={data.pomodoro14.filter((p) => p.completed).length} />
        <ProductivityScoreCard score={data.productivity.score} loading={false} trendUp={null} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HabitCompletionChart
          habits={data.habits}
          completions={data.completionsLast30}
          loading={loading}
        />
        <FocusTimeChart sessions={data.pomodoro14} loading={loading} />
      </div>

      <WeeklyHeatmap cells={data.heatmap12w} loading={loading} />

      <StreakChart
        rows={data.streaksByHabit.map((s) => ({ name: s.name, streak: s.streak, color: s.color }))}
        loading={loading}
      />
    </div>
  );
}
