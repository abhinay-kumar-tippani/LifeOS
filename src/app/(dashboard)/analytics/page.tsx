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
import { WeeklyBarChart } from "@/components/analytics/WeeklyBarChart";
import { HabitPieChart } from "@/components/analytics/HabitPieChart";
import { InsightsTable } from "@/components/analytics/InsightsTable";
import { CheckSquare, Flame, Timer } from "lucide-react";

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
  
  const focusMin = data.pomodoro14.filter(p => p.completed).reduce((acc, p) => acc + p.duration_minutes, 0);
  const score = data.productivity.score;
  const ringColor = score > 60 ? "text-indigo-500" : score >= 40 ? "text-yellow-500" : "text-red-500";

  return (
    <div className="space-y-10">
      <PageHeader title="Analytics" description="Visualize momentum across habits, focus, and output." />

      {/* SECTION A: KPI CARDS ROW */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <div className="rounded-2xl border border-white/5 bg-[#111118] p-6 transition hover:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Habit completions this month</p>
              <h3 className="mt-1 text-4xl font-bold text-white">{monthCompletions}</h3>
            </div>
            <div className="rounded-lg bg-indigo-500/15 p-2 text-indigo-500">
              <CheckSquare className="h-6 w-6" />
            </div>
          </div>
          <p className="mt-2 text-xs text-green-400">+12% vs last month</p>
        </div>

        {/* Card 2 */}
        <div className="rounded-2xl border border-white/5 bg-[#111118] p-6 transition hover:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Best consecutive streak</p>
              <h3 className="mt-1 text-4xl font-bold text-white">{longestStreak} <span className="text-lg">days</span></h3>
            </div>
            <div className="rounded-lg bg-orange-500/15 p-2 text-orange-500">
              <Flame className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-2xl border border-white/5 bg-[#111118] p-6 transition hover:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Weighted from habits</p>
              <h3 className="mt-1 text-4xl font-bold text-white">{score} <span className="text-lg text-gray-500">/ 100</span></h3>
            </div>
            <div className="relative flex h-12 w-12 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-800" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={ringColor} strokeDasharray={`${score}, 100`} strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-2xl border border-white/5 bg-[#111118] p-6 transition hover:border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Pomodoro sessions</p>
              <h3 className="mt-1 text-4xl font-bold text-white">{focusMin} <span className="text-lg">min</span></h3>
            </div>
            <div className="rounded-lg bg-purple-500/15 p-2 text-purple-500">
              <Timer className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <HabitCompletionChart habits={data.habits} completions={data.completionsLast30} loading={loading} />
        </div>
        <div className="lg:col-span-1">
          <HabitPieChart habits={data.habits} completions={data.completionsLast30} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <WeeklyBarChart completions={data.completionsLast30} />
        </div>
        <div className="lg:col-span-2">
          <StreakChart rows={data.streaksByHabit.map((s) => ({ name: s.name, streak: s.streak, color: s.color }))} loading={loading} />
        </div>
      </div>

      <div className="w-full">
        <WeeklyHeatmap cells={data.heatmap12w} loading={loading} />
      </div>

      <div className="w-full">
        <InsightsTable habits={data.habits} completions={data.completionsLast30} streaks={data.streaksByHabit} />
      </div>
    </div>
  );
}
