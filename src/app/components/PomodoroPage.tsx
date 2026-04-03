import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Play, Pause, RotateCcw, Timer, Coffee, Brain } from "lucide-react";

type TimerMode = "focus" | "break";

interface PomodoroSession {
  id: string;
  type: TimerMode;
  duration: number;
  completedAt: Date;
}

export function PomodoroPage() {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [sessions, setSessions] = useState<PomodoroSession[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const focusDuration = 25 * 60;
  const breakDuration = 5 * 60;
  const totalTime = mode === "focus" ? focusDuration : breakDuration;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            completeSession();
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

  const completeSession = () => {
    const session: PomodoroSession = {
      id: Date.now().toString(),
      type: mode,
      duration: totalTime,
      completedAt: new Date(),
    };
    setSessions((prev) => [session, ...prev]);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === "focus" ? focusDuration : breakDuration);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === "focus" ? focusDuration : breakDuration);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const todaySessions = sessions.filter((s) => {
    const today = new Date();
    return (
      s.completedAt.getDate() === today.getDate() &&
      s.completedAt.getMonth() === today.getMonth()
    );
  });

  const focusSessionsToday = todaySessions.filter((s) => s.type === "focus").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/50 flex items-center justify-center">
            <Timer className="w-7 h-7 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl">Pomodoro Timer</h1>
            <p className="text-sm text-gray-400 mt-1">Focus deeply, rest mindfully</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 p-12"
          >
            {/* Mode Selector */}
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2 bg-white/5 rounded-xl p-1.5 backdrop-blur-sm border border-white/10">
                <button
                  onClick={() => switchMode("focus")}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200
                    ${mode === "focus"
                      ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/50"
                      : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                >
                  <Brain className="w-4 h-4" />
                  Deep Work
                </button>
                <button
                  onClick={() => switchMode("break")}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg transition-all duration-200
                    ${mode === "break"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                      : "text-gray-400 hover:text-gray-200"
                    }
                  `}
                >
                  <Coffee className="w-4 h-4" />
                  Short Break
                </button>
              </div>
            </div>

            {/* Timer Display */}
            <div className="flex flex-col items-center">
              <div className="relative mb-12">
                <svg className="w-80 h-80 transform -rotate-90">
                  {/* Background Circle */}
                  <circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke="rgba(255, 255, 255, 0.05)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress Circle */}
                  <motion.circle
                    cx="160"
                    cy="160"
                    r="140"
                    stroke={mode === "focus" ? "#6366f1" : "#a855f7"}
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 140}
                    strokeDashoffset={2 * Math.PI * 140 - (progress / 100) * 2 * Math.PI * 140}
                    style={{
                      filter: `drop-shadow(0 0 16px ${mode === "focus" ? "#6366f1" : "#a855f7"})`,
                    }}
                    initial={false}
                    animate={{
                      strokeDashoffset: 2 * Math.PI * 140 - (progress / 100) * 2 * Math.PI * 140,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  />
                </svg>

                {/* Time Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-7xl font-mono tabular-nums font-light">
                    {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-gray-400 mt-2">
                    {mode === "focus" ? "Focus Time" : "Break Time"}
                  </span>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleTimer}
                  className="w-16 h-16 rounded-2xl bg-indigo-500 hover:bg-indigo-600 flex items-center justify-center transition-all duration-200 hover:scale-105 shadow-lg shadow-indigo-500/50"
                >
                  {isRunning ? (
                    <Pause className="w-7 h-7 text-white" />
                  ) : (
                    <Play className="w-7 h-7 text-white ml-1" />
                  )}
                </button>
                <button
                  onClick={resetTimer}
                  className="w-16 h-16 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105"
                >
                  <RotateCcw className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
          >
            <h3 className="text-lg mb-4">Timer Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Focus Duration</label>
                <div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  25 minutes
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Break Duration</label>
                <div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  5 minutes
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          {/* Today's Stats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 p-6"
          >
            <h3 className="text-lg mb-4">Today's Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Focus Sessions</span>
                  <span className="text-2xl font-semibold">{focusSessionsToday}</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(focusSessionsToday / 8) * 100}%` }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">Goal: 8 sessions</div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Total Focus Time</span>
                  <span className="text-lg font-semibold">
                    {focusSessionsToday * 25} min
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Sessions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6"
          >
            <h3 className="text-lg mb-4">Recent Sessions</h3>
            <div className="space-y-3">
              {sessions.slice(0, 5).map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      session.type === "focus" ? "bg-indigo-500" : "bg-purple-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div className="text-sm">
                      {session.type === "focus" ? "Focus" : "Break"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {session.completedAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    {session.duration / 60}m
                  </div>
                </div>
              ))}

              {sessions.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No sessions yet today
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
