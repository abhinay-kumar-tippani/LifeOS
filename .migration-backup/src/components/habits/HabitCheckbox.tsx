"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils/cn";

export function HabitCheckbox({
  checked,
  onToggle,
  accentColor,
  disabled,
  ariaLabel,
}: {
  checked: boolean;
  onToggle: () => void;
  accentColor?: string;
  disabled?: boolean;
  ariaLabel: string;
}) {
  return (
    <div className="flex justify-center p-1">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={() => onToggle()}
        aria-label={ariaLabel}
        className={cn("border-2 data-[state=checked]:border-transparent data-[state=checked]:bg-primary")}
        style={
          checked && accentColor
            ? { backgroundColor: accentColor, borderColor: accentColor }
            : accentColor
              ? { borderColor: `${accentColor}88` }
              : undefined
        }
      />
    </div>
  );
}
