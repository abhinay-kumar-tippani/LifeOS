'use client'
import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/lib/stores/pomodoroStore'

export function PomodoroEngine() {
  const isRunning = usePomodoroStore(s => s.isRunning)
  
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        usePomodoroStore.setState(state => {
          if (state.timeLeft <= 1) {
            // Session complete — auto switch
            if (intervalRef.current) clearInterval(intervalRef.current)
            const newCount = state.sessionType === 'work'
              ? state.sessionCount + 1
              : state.sessionCount
            const nextType = state.sessionType === 'work'
              ? (newCount % 4 === 0 ? 'longBreak' : 'break')
              : 'work'
            const nextDuration = nextType === 'work'
              ? 25 * 60
              : nextType === 'break'
              ? 5 * 60
              : 15 * 60
            // Play notification sound
            try {
              const ctx = new window.AudioContext()
              const osc = ctx.createOscillator()
              osc.connect(ctx.destination)
              osc.frequency.value = 880
              osc.start()
              osc.stop(ctx.currentTime + 0.3)
            } catch {}
            return {
              timeLeft: nextDuration,
              totalSeconds: nextDuration,
              isRunning: false,
              sessionType: nextType,
              sessionCount: newCount,
            }
          }
          return { timeLeft: state.timeLeft - 1 }
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  return null
}
