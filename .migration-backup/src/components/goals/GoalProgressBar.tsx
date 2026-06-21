import { cn } from "@/lib/utils/cn";

interface GoalProgressBarProps {
  progress: number;
  color?: string;
  size?: "sm" | "md" | "lg";
}

export function GoalProgressBar({
  progress,
  color,
  size = "md",
}: GoalProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  let fillColor = color;
  if (!fillColor) {
    if (clampedProgress <= 30) {
      fillColor = "bg-destructive";
    } else if (clampedProgress <= 60) {
      fillColor = "bg-amber-500";
    } else if (clampedProgress <= 89) {
      fillColor = "bg-blue-500";
    } else {
      fillColor = "bg-emerald-500";
    }
  }

  const heightClass = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }[size];

  return (
    <div className="flex w-full items-center gap-3">
      <div
        className={cn("relative w-full overflow-hidden rounded-full bg-muted", heightClass)}
        role="progressbar"
        aria-valuenow={Math.round(clampedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
            fillColor,
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      <span className="shrink-0 text-xs font-medium text-muted-foreground">
        {Math.round(clampedProgress)}%
      </span>
    </div>
  );
}