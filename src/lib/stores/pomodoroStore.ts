import { create } from 'zustand'

export interface PomodoroStore {
  timeLeft: number         // seconds remaining
  isRunning: boolean
  sessionType: 'work' | 'break' | 'longBreak'
  sessionCount: number     // completed sessions
  totalSeconds: number     // total duration in seconds
  taskId: string | null
  
  setTimeLeft: (t: number) => void
  setIsRunning: (v: boolean) => void
  setSessionType: (t: 'work' | 'break' | 'longBreak') => void
  setSessionCount: (n: number) => void
  setTotalSeconds: (n: number) => void
  setTaskId: (id: string | null) => void
  reset: () => void
}

const DEFAULT_WORK = 25 * 60  // 25 minutes in seconds

export const usePomodoroStore = create<PomodoroStore>((set) => ({
  timeLeft: DEFAULT_WORK,
  isRunning: false,
  sessionType: 'work',
  sessionCount: 0,
  totalSeconds: DEFAULT_WORK,
  taskId: null,

  setTimeLeft: (t) => set({ timeLeft: t }),
  setIsRunning: (v) => set({ isRunning: v }),
  setSessionType: (t) => set({ sessionType: t }),
  setSessionCount: (n) => set({ sessionCount: n }),
  setTotalSeconds: (n) => set({ totalSeconds: n }),
  setTaskId: (id) => set({ taskId: id }),
  reset: () => set({
    timeLeft: DEFAULT_WORK,
    isRunning: false,
    sessionType: 'work',
    sessionCount: 0,
    totalSeconds: DEFAULT_WORK,
  }),
}))
