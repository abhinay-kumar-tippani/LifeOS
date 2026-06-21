import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { TrendingUp, TrendingDown } from "lucide-react";

export function StatCard({
  label,
  value,
  hint,
  hintClassName,
  icon,
  action,
  trend,
  progress,
  className,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  hintClassName?: string;
  icon?: ReactNode;
  action?: ReactNode;
  trend?: number;
  progress?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "card-hover group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-5 backdrop-blur-sm",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:radial-gradient(320px_circle_at_top_left,rgba(99,102,241,0.08),transparent)]" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          {icon ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary ring-1 ring-primary/20">
              {icon}
            </div>
          ) : null}
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">{value}</span>
          {trend !== undefined ? (
            <span
              className={cn(
                "mb-0.5 flex items-center gap-0.5 text-xs font-medium",
                trend >= 0 ? "text-emerald-400" : "text-red-400",
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="h-3 w-3" aria-hidden />
              ) : (
                <TrendingDown className="h-3 w-3" aria-hidden />
              )}
              {Math.abs(trend)}%
            </span>
          ) : null}
        </div>

        {(hint || action) ? (
          <div className="mt-1.5 flex items-center gap-1.5">
            {hint ? (
              <p className={cn("text-xs text-muted-foreground", hintClassName)}>{hint}</p>
            ) : null}
            {action}
          </div>
        ) : null}

        {progress !== undefined ? (
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-primary/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-violet-400 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              aria-valuenow={progress}
              role="progressbar"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
