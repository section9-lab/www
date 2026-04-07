import { create } from 'zustand'

interface TimeState {
  now: Date
  start: () => void
  stop: () => void
}

let interval: ReturnType<typeof setInterval> | null = null

export const useTimeStore = create<TimeState>((set) => ({
  now: new Date(),
  start: () => {
    if (interval) return
    interval = setInterval(() => set({ now: new Date() }), 1000)
  },
  stop: () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  },
}))

export function getHours(now: Date) {
  return now.getHours() % 12 || 12
}

export function getMinutes(now: Date) {
  return String(now.getMinutes()).padStart(2, '0')
}

export function getAmpm(now: Date) {
  return now.getHours() >= 12 ? 'pm' : 'am'
}

export function getDateString(now: Date) {
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function getIsNight(now: Date) {
  const h = now.getHours()
  return h >= 19 || h < 6
}
