"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductivityScoreCard({
  score,
  loading,
  trendUp,
}: {
  score: number;
  loading: boolean;
  trendUp: boolean | null;
}) {
  if (loading) {
    return <Skeleton className="h-40 rounded-xl" />;
  }

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/15 to-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Productivity score</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-bold tabular-nums text-foreground">{score}</span>
          <span className="pb-2 text-sm text-muted-foreground">/ 100</span>
          {trendUp === true ? (
            <TrendingUp className="mb-2 h-5 w-5 text-emerald-400" aria-label="Up vs last week" />
          ) : trendUp === false ? (
            <TrendingDown className="mb-2 h-5 w-5 text-rose-400" aria-label="Down vs last week" />
          ) : null}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Weighted from habits, focus sessions, journal entries, and completed tasks.
        </p>
      </CardContent>
    </Card>
  );
}
