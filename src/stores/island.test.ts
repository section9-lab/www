import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIslandStore } from './island'
import { isActivePhase } from '../types/demo'

describe('native session demo', () => {
  beforeEach(() => { vi.useFakeTimers(); useIslandStore.getState().initialize() })
  afterEach(() => { useIslandStore.getState().dispose(); vi.useRealTimers() })

  it('starts with an open HUD and counts processing and compacting, excluding pending approval', () => {
    const state = useIslandStore.getState()
    expect(state.isOpen).toBe(true)
    expect(state.sessions.filter((session) => isActivePhase(session.phase))).toHaveLength(2)
  })

  it('requires approval before running a tool and then becomes ready', () => {
    useIslandStore.getState().approve('codex-session')
    expect(useIslandStore.getState().sessions.find((session) => session.id === 'codex-session')?.phase).toBe('processing')
    vi.advanceTimersByTime(2500)
    expect(useIslandStore.getState().sessions.find((session) => session.id === 'codex-session')?.phase).toBe('waitingForInput')
  })

  it('denies a tool without running it', () => {
    useIslandStore.getState().deny('codex-session')
    vi.runAllTimers()
    const session = useIslandStore.getState().sessions.find((item) => item.id === 'codex-session')
    expect(session?.phase).toBe('waitingForInput')
    expect(session?.messages.at(-1)?.content).toContain('denied')
    expect(session?.tool).toBeUndefined()
  })

  it('preserves chat through closing and reopening the notch', () => {
    useIslandStore.getState().showChat('cursor-session')
    useIslandStore.getState().close()
    useIslandStore.getState().open()
    expect(useIslandStore.getState().view).toBe('chat')
    expect(useIslandStore.getState().selectedSessionId).toBe('cursor-session')
  })

  it('ignores empty replies and duplicate submissions, and appends the sample response', () => {
    useIslandStore.getState().reply('cursor-session', ' ')
    expect(useIslandStore.getState().pendingReplyId).toBeNull()
    useIslandStore.getState().reply('cursor-session', 'Review the empty states.')
    useIslandStore.getState().reply('cursor-session', 'Duplicate')
    vi.advanceTimersByTime(1200)
    const messages = useIslandStore.getState().sessions.find((session) => session.id === 'cursor-session')?.messages
    expect(messages?.filter((message) => message.role === 'user')).toHaveLength(2)
    expect(messages?.at(-1)?.role).toBe('assistant')
    expect(useIslandStore.getState().pendingReplyId).toBeNull()
  })

  it('keeps active sessions and archives a completed session', () => {
    useIslandStore.getState().archive('claude-session')
    expect(useIslandStore.getState().sessions).toHaveLength(4)
    useIslandStore.getState().archive('cursor-session')
    expect(useIslandStore.getState().sessions).toHaveLength(3)
  })

  it('reset cancels pending work and restores the original sessions', () => {
    useIslandStore.getState().approve('codex-session')
    useIslandStore.getState().initialize()
    vi.runAllTimers()
    expect(useIslandStore.getState().sessions.find((session) => session.id === 'codex-session')?.phase).toBe('waitingForApproval')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('launches Claude and Codex once each from an empty desktop', () => {
    useIslandStore.getState().presentStep(0)
    useIslandStore.getState().launchAgent('claude')
    useIslandStore.getState().launchAgent('codex')
    useIslandStore.getState().launchAgent('claude')
    expect(useIslandStore.getState().sessions.map((session) => session.source)).toEqual(['claude', 'codex'])
    expect(useIslandStore.getState().sessions.every((session) => session.phase === 'processing')).toBe(true)
  })

  it('moves the scroll story from running agents through approval, reply, and completion', () => {
    useIslandStore.getState().presentStep(2)
    expect(useIslandStore.getState().sessions.filter((session) => isActivePhase(session.phase))).toHaveLength(2)
    useIslandStore.getState().presentStep(4)
    expect(useIslandStore.getState().sessions.find((session) => session.source === 'codex')?.phase).toBe('waitingForApproval')
    useIslandStore.getState().presentStep(5)
    expect(useIslandStore.getState().view).toBe('chat')
    expect(useIslandStore.getState().selectedSessionId).toBe('claude-session')
    useIslandStore.getState().presentStep(6)
    expect(useIslandStore.getState().view).toBe('sessions')
    expect(useIslandStore.getState().sessions.every((session) => session.phase === 'waitingForInput')).toBe(true)
  })

  it('cancels pending interaction timers when scrubbing back to an earlier scene', () => {
    useIslandStore.getState().presentStep(5)
    useIslandStore.getState().reply('claude-session', 'Continue the review.')
    expect(useIslandStore.getState().pendingReplyId).toBe('claude-session')
    useIslandStore.getState().presentStep(0)
    vi.runAllTimers()
    expect(useIslandStore.getState().sessions).toEqual([])
    expect(useIslandStore.getState().pendingReplyId).toBeNull()
    expect(useIslandStore.getState().isOpen).toBe(false)
  })
})
