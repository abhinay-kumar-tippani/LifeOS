export function getDefaultWorkMinutes(): 15 | 25 | 50 {
  if (typeof window === "undefined") return 25;
  const stored = localStorage.getItem("lifeos-pomo");
  const mins = stored ? parseInt(stored, 10) : 25;
  if (mins === 15 || mins === 25 || mins === 50) return mins;
  return 25;
}

export function getDefaultWorkSeconds(): number {
  return getDefaultWorkMinutes() * 60;
}
