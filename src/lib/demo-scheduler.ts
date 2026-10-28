type Scope = 'sessions' | 'terminal'
const timers = new Map<ReturnType<typeof setTimeout>, Scope>()

export function schedule(callback: () => void, delay: number, scope: Scope = 'sessions') {
  const timer = setTimeout(() => { timers.delete(timer); callback() }, delay)
  timers.set(timer, scope)
}

export function clearTimers(scope?: Scope) {
  for (const [timer, timerScope] of timers) {
    if (scope && scope !== timerScope) continue
    clearTimeout(timer)
    timers.delete(timer)
  }
}
