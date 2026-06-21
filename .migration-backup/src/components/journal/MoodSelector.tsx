"use client";

import { cn } from "@/lib/utils/cn";

const moods = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "neutral", emoji: "😐", label: "Neutral" },
  { id: "sad", emoji: "😔", label: "Sad" },
  { id: "stressed", emoji: "😤", label: "Stressed" },
  { id: "energized", emoji: "⚡", label: "Energized" },
];

export function MoodSelector({
  value,
  onChange,
}: {
  value?: string | null;
  onChange: (m: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Mood">
      {moods.map((m) => (
        <button
          key={m.id}
          type="button"
          aria-label={m.label}
          aria-pressed={value === m.id}
          onClick={() => onChange(m.id)}
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition",
            value === m.id
              ? "border-primary bg-primary/20 shadow-inner"
              : "border-border/60 bg-card/40 hover:border-primary/50",
          )}
        >
          {m.emoji}
        </button>
      ))}
    </div>
  );
}
