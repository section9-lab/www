import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIslandStore } from './island'
import { workspaceRoot } from '../config/terminal'

const state = () => useIslandStore.getState()
const file = `${workspaceRoot}/notes.txt`
const boot = () => state().submitTerminalInput('claude')
const requestWrite = () => { state().submitTerminalInput('Write notes.txt: Hello'); vi.advanceTimersByTime(350) }

describe('Terminal, Claude Code and notch integration', () => {
  beforeEach(() => { vi.useFakeTimers(); state().initialize(); state().presentStep(0) })
  afterEach(() => { state().dispose(); vi.useRealTimers() })

  it('opens a shell with no agent and starts Claude only after the claude command', () => {
    expect(state().terminal.mode).toBe('shell')
    expect(state().sessions).toEqual([])
    state().submitTerminalInput('echo before > notes.txt')
    expect(state().terminal.workspace.files[file]).toBe('before\n')
    expect(state().sessions).toEqual([])
    boot()
    expect(state().terminal.mode).toBe('claude')
    expect(state().sessions.map((session) => session.source)).toEqual(['claude'])
    expect(state().terminal.entries.some((entry) => entry.kind === 'shell' && entry.content === 'claude')).toBe(true)
  })

  it('shows the shell command before Claude starts in the automatic walkthrough', () => {
    state().presentStep(1)
    expect(state().terminal.mode).toBe('shell')
    expect(state().terminal.entries).toHaveLength(1)
    expect(state().terminal.entries[0].content).toBe('claude')
    vi.advanceTimersByTime(450)
    expect(state().terminal.mode).toBe('claude')
    expect(state().terminal.entries.some((entry) => entry.kind === 'launch')).toBe(true)
  })

  it('requires approval before a write and synchronizes file contents with terminal and HUD history', () => {
    boot(); requestWrite()
    expect(state().terminal.job?.awaitingApproval).toBe(true)
    expect(state().terminal.workspace.files[file]).toBeUndefined()
    expect(state().sessions[0].phase).toBe('waitingForApproval')
    expect(state().sessions[0].tool).toEqual({ name: 'Write', input: 'notes.txt', details: 'Hello\n' })
    state().approve('claude-session'); vi.runAllTimers()
    expect(state().terminal.workspace.files[file]).toBe('Hello\n')
    expect(state().sessions[0].phase).toBe('waitingForInput')
    expect(state().sessions[0].messages.some((message) => message.role === 'tool' && message.content.includes('Hello'))).toBe(true)
    expect(state().terminal.entries.some((entry) => entry.kind === 'output' && entry.content.includes('Hello'))).toBe(true)
  })

  it('denies a tool from the HUD without applying a pending change', () => {
    boot(); requestWrite(); state().deny('claude-session'); vi.runAllTimers()
    expect(state().terminal.workspace.files[file]).toBeUndefined()
    expect(state().terminal.job).toBeNull()
    expect(state().pendingReplyId).toBeNull()
    expect(state().sessions[0].summary).toContain('denied')
  })

  it('can allow changes for the session from Terminal and reuse that permission', () => {
    boot(); requestWrite(); state().resolveTerminalApproval(true, true); vi.runAllTimers()
    state().submitTerminalInput('Write notes.txt: Updated'); vi.runAllTimers()
    expect(state().terminal.job).toBeNull()
    expect(state().terminal.workspace.files[file]).toBe('Updated\n')
    expect(state().terminal.allowSessionEdits).toBe(true)
  })

  it('interrupts work before it applies and rejects duplicate submissions', () => {
    boot(); state().submitTerminalInput('Write notes.txt: Hello'); state().submitTerminalInput('Write other.txt: Duplicate')
    state().interruptTerminal(); vi.runAllTimers()
    expect(state().terminal.workspace.files[file]).toBeUndefined()
    expect(Object.keys(state().terminal.workspace.files).some((path) => path.endsWith('other.txt'))).toBe(false)
    expect(state().sessions[0].messages.filter((message) => message.role === 'user')).toHaveLength(1)
  })

  it('routes a notch reply through the same workspace and handles tool errors honestly', () => {
    boot(); state().reply('claude-session', 'Read missing.txt'); vi.runAllTimers()
    expect(state().sessions[0].phase).toBe('failed')
    expect(state().terminal.entries.at(-1)?.content).toContain('No such file')
    state().reply('claude-session', 'Read README.md'); vi.runAllTimers()
    expect(state().sessions[0].phase).toBe('waitingForInput')
    expect(state().terminal.entries.some((entry) => entry.kind === 'output' && entry.content.includes('# vibe hud'))).toBe(true)
  })

  it('clears or exits Claude without deleting workspace files', () => {
    boot(); requestWrite(); state().resolveTerminalApproval(true); vi.runAllTimers()
    state().submitTerminalInput('/clear')
    expect(state().terminal.workspace.files[file]).toBe('Hello\n')
    expect(state().sessions[0].messages).toEqual([])
    state().submitTerminalInput('/exit')
    expect(state().terminal.mode).toBe('shell')
    expect(state().sessions).toEqual([])
    state().submitTerminalInput('cat notes.txt')
    expect(state().terminal.entries.at(-1)?.content).toBe('Hello\n')
  })

  it('closing Terminal preserves virtual files and cancels pending jobs', () => {
    state().submitTerminalInput('echo hello > notes.txt'); boot(); requestWrite()
    state().closeTerminal(); vi.runAllTimers()
    expect(state().terminal.mode).toBe('shell')
    expect(state().terminal.workspace.files[file]).toBe('hello\n')
    expect(state().terminal.interactive).toBe(true)
    expect(state().sessions).toEqual([])
    expect(vi.getTimerCount()).toBe(0)
  })

  it('scrubbing to another scene cancels pending writes and restores the walkthrough snapshot', () => {
    boot(); requestWrite(); state().resolveTerminalApproval(true)
    state().presentStep(0); vi.runAllTimers()
    expect(state().terminal.workspace.files[file]).toBeUndefined()
    expect(state().sessions).toEqual([])
    expect(state().terminal.mode).toBe('shell')
  })
})
