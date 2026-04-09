import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIslandStore } from './island'

describe('island store', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    useIslandStore.getState().initialize()
  })

  afterEach(() => {
    useIslandStore.getState().dispose()
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('starts in the locked state after initialization', () => {
    const state = useIslandStore.getState()

    expect(state.liveActivityType).toBe('isLocked')
    expect(state.isPlaying).toBe(false)
    expect(state.notificationType).toBeNull()
    expect(state.getTrack()?.name).toBeTruthy()
  })

  it('opens quick peek temporarily and clears it after the duration', () => {
    useIslandStore.getState().toggleQuickPeek(true, 2000)
    expect(useIslandStore.getState().hasQuickPeek).toBe(true)

    vi.advanceTimersByTime(2000)

    expect(useIslandStore.getState().hasQuickPeek).toBe(false)
  })

  it('plays and advances to the next track on the auto timer', () => {
    useIslandStore.getState().play()
    expect(useIslandStore.getState().isPlaying).toBe(true)
    expect(useIslandStore.getState().liveActivityType).toBe('isPlaying')

    const initialIndex = useIslandStore.getState().index
    vi.advanceTimersByTime(20000)

    expect(useIslandStore.getState().index).not.toBe(initialIndex)
    expect(useIslandStore.getState().isFlipped).toBe(true)
    expect(useIslandStore.getState().isPlaying).toBe(true)
  })
})
