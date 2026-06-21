import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-10">
      {/* PageHeader Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-[180px]" />
        <Skeleton className="h-5 w-[320px]" />
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>

      {/* Big Charts Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-4">
        <Skeleton className="h-[350px] lg:col-span-3 rounded-xl" />
        <Skeleton className="h-[350px] lg:col-span-1 rounded-xl" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-[300px] w-full rounded-xl" />
        <Skeleton className="h-[300px] w-full rounded-xl" />
      </div>

      {/* Focus and Heatmap Skeletons */}
      <Skeleton className="h-[300px] w-full rounded-xl" />
      <Skeleton className="h-[200px] w-full rounded-xl" />
    </div>
  );
}
