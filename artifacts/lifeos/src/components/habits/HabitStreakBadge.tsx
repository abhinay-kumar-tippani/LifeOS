import { Flame } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function HabitStreakBadge({
  streak,
  className,
}: {
  streak: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-orange-500/15 px-2 py-0.5 text-xs font-medium text-orange-400",
        className,
      )}
    >
      <Flame className="h-3.5 w-3.5" aria-hidden />
      {streak}
    </span>
  );
}
