"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, SkipForward } from "lucide-react";

export function TimerControls({
  running,
  onStart,
  onPause,
  onReset,
  onSkip,
}: {
  running: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {running ? (
        <Button type="button" size="lg" variant="secondary" onClick={onPause} aria-label="Pause timer">
          <Pause className="h-5 w-5" />
          Pause
        </Button>
      ) : (
        <Button type="button" size="lg" onClick={onStart} aria-label="Start timer">
          <Play className="h-5 w-5" />
          Start
        </Button>
      )}
      <Button type="button" variant="outline" onClick={onReset} aria-label="Reset timer">
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      <Button type="button" variant="ghost" onClick={onSkip} aria-label="Skip segment">
        <SkipForward className="h-4 w-4" />
        Skip
      </Button>
    </div>
  );
}

function beep() {
  try {
    const ctx = new AudioContext();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.08, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    o.start(ctx.currentTime);
    o.stop(ctx.currentTime + 0.3);
  } catch {
    /* ignore */
  }
}

export { beep };
