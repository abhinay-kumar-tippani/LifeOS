import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { motion } from "motion/react";

type TimerMode = "focus" | "break";

export function PomodoroWidget() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalTime = mode === "focus" ? 25 * 60 : 5 * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? 25 * 60 : 5 * 60);
  };

  const toggleMode = () => {
    const newMode = mode === "focus" ? "break" : "focus";
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === "focus" ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const circumference = 2 * Math.PI * 36; // radius = 36
  const strokeColor = mode === "focus" ? "#171717" : "#525252"; // dark neutral or medium neutral
  const strokeColorDark = mode === "focus" ? "#ffffff" : "#a3a3a3";

  return (
    <div className="flex items-center gap-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2 bg-neutral-100 dark:bg-white/5 rounded-lg p-1 backdrop-blur-sm border border-neutral-200 dark:border-white/10 transition-colors">
        <button
          onClick={toggleMode}
          className={`
            px-3 py-1.5 rounded text-sm transition-all duration-200
            ${mode === "focus" 
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm" 
              : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            }
          `}
        >
          Deep Work
        </button>
        <button
          onClick={toggleMode}
          className={`
            px-3 py-1.5 rounded text-sm transition-all duration-200
            ${mode === "break" 
              ? "bg-neutral-500 text-white dark:bg-neutral-500 shadow-sm" 
              : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            }
          `}
        >
          Break
        </button>
      </div>

      {/* Timer Display */}
      <div className="relative">
        <svg className="w-24 h-24 transform -rotate-90">
          {/* Background Circle */}
          <circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            className="text-neutral-200 dark:text-neutral-800"
            strokeWidth="4"
            fill="none"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="48"
            cy="48"
            r="36"
            stroke="currentColor"
            className={mode === "focus" ? "text-neutral-900 dark:text-white" : "text-neutral-500 dark:text-neutral-400"}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            initial={false}
            animate={{ strokeDashoffset: circumference - (progress / 100) * circumference }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>

        {/* Time Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-mono tabular-nums text-neutral-900 dark:text-white">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTimer}
          className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          {isRunning ? (
            <Pause className="w-4 h-4 text-neutral-900 dark:text-white" />
          ) : (
            <Play className="w-4 h-4 text-neutral-900 dark:text-white ml-0.5" />
          )}
        </button>
        <button
          onClick={resetTimer}
          className="w-10 h-10 rounded-lg bg-white dark:bg-transparent hover:bg-neutral-50 dark:hover:bg-white/5 border border-neutral-200 dark:border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
        >
          <RotateCcw className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </button>
      </div>
    </div>
  );
}
