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
      fillColor = "bg-red-500";
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
    <div className="flex items-center gap-3 w-full">
      <div className={cn("relative w-full bg-gray-700 rounded-full overflow-hidden", heightClass)}>
        <div
          className={cn(
            "absolute top-0 left-0 h-full rounded-full transition-all duration-500",
            fillColor
          )}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      <span className="text-xs text-gray-400 font-medium shrink-0">
        {Math.round(clampedProgress)}%
      </span>
    </div>
  );
}
