export const HABIT_COLORS = [
  { bg: 'bg-indigo-500',  border: 'border-indigo-500',  text: 'text-indigo-400',  hex: '#6366f1' },
  { bg: 'bg-violet-500',  border: 'border-violet-500',  text: 'text-violet-400',  hex: '#8b5cf6' },
  { bg: 'bg-pink-500',    border: 'border-pink-500',    text: 'text-pink-400',    hex: '#ec4899' },
  { bg: 'bg-rose-500',    border: 'border-rose-500',    text: 'text-rose-400',    hex: '#f43f5e' },
  { bg: 'bg-orange-500',  border: 'border-orange-500',  text: 'text-orange-400',  hex: '#f97316' },
  { bg: 'bg-amber-500',   border: 'border-amber-500',   text: 'text-amber-400',   hex: '#f59e0b' },
  { bg: 'bg-emerald-500', border: 'border-emerald-500', text: 'text-emerald-400', hex: '#10b981' },
  { bg: 'bg-teal-500',    border: 'border-teal-500',    text: 'text-teal-400',    hex: '#14b8a6' },
  { bg: 'bg-cyan-500',    border: 'border-cyan-500',    text: 'text-cyan-400',    hex: '#06b6d4' },
  { bg: 'bg-sky-500',     border: 'border-sky-500',     text: 'text-sky-400',     hex: '#0ea5e9' },
];

export function getHabitColor(indexOrId: number | string) {
  if (typeof indexOrId === 'number') {
    return HABIT_COLORS[indexOrId % HABIT_COLORS.length];
  }
  let hash = 0;
  for (let i = 0; i < indexOrId.length; i++) {
    hash = indexOrId.charCodeAt(i) + ((hash << 5) - hash);
  }
  return HABIT_COLORS[Math.abs(hash) % HABIT_COLORS.length];
}
