"use client";

import confetti from "canvas-confetti";

export function fireCompletionConfetti() {
  if (typeof window === "undefined") return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;

  const defaults = {
    spread: 60,
    startVelocity: 35,
    ticks: 60,
    zIndex: 9999,
    disableForReducedMotion: true,
  };

  confetti({
    ...defaults,
    particleCount: 50,
    origin: { x: 0.5, y: 0.6 },
    colors: ["#6366f1", "#8b5cf6", "#ec4899", "#10b981"],
  });
}

export function fireGoalCompleteConfetti() {
  if (typeof window === "undefined") return;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return;
  const duration = 1200;
  const end = Date.now() + duration;
  const colors = ["#6366f1", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors,
      zIndex: 9999,
      disableForReducedMotion: true,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors,
      zIndex: 9999,
      disableForReducedMotion: true,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}