import type { StateCreator } from 'zustand'
import { createDemoSessions } from '../config/demo'
import { createTerminalState, terminalExamples } from '../config/terminal'
import { executeDemoTool, runDemoShell, toolDescription, toolNeedsApproval } from '../lib/demo-shell'
import { planDemoTask } from '../lib/demo-agent'
import { clearTimers, schedule } from '../lib/demo-scheduler'
import type { DemoSession } from '../types/demo'
import type { DemoTerminalState, TerminalEntry, TerminalEntryKind } from '../types/terminal'
import type { IslandState } from './island'

export interface TerminalSlice {
  terminal: DemoTerminalState
  submitTerminalInput: (text: string) => void
  submitClaudeTask: (text: string) => void
  advanceTerminal: (approved?: boolean) => void
  resolveTerminalApproval: (allowed: boolean, remember?: boolean) => void
  interruptTerminal: () => void
  closeTerminal: () => void
}

function append(entries: TerminalEntry[], kind: TerminalEntryKind, content: string, detail?: string): TerminalEntry[] {
  return [...entries.slice(-99), { id: (entries.at(-1)?.id ?? 0) + 1, kind, content, detail }]
}
function addMessage(session: DemoSession, role: 'user' | 'tool' | 'assistant', content: string) {
  return [...session.messages.slice(-79), { id: `terminal-${session.messages.length}-${session.lastActivity}`, role, content }]
}
function readySession(): DemoSession {
  return { ...createDemoSessions()[0], title: 'Claude Code', phase: 'waitingForInput', summary: 'Ready for your next instruction', tokens: '0', messages: [], tool: undefined }
}

export function terminalForSession(session?: DemoSession): DemoTerminalState {
  const terminal = createTerminalState()
  if (!session) return terminal
  terminal.mode = 'claude'
  terminal.entries = [{ id: 1, kind: 'shell', content: 'claude', detail: '~/Projects/vibe-hud' }, { id: 2, kind: 'launch', content: '~/Projects/vibe-hud' }]
  for (const message of session.messages) terminal.entries = append(terminal.entries, message.role === 'tool' ? 'tool' : message.role, message.content)
  return terminal
}

export const createTerminalSlice: StateCreator<IslandState, [], [], TerminalSlice> = (set, get) => ({
  terminal: createTerminalState(),
  submitTerminalInput: (text) => {
    const input = text.trim()
    if (!input || input.length > 2000 || get().terminal.job || get().pendingReplyId) return
    set((state) => ({ terminal: { ...state.terminal, interactive: true, history: [...state.terminal.history.slice(-39), input] } }))
    if (get().terminal.mode === 'claude') { get().submitClaudeTask(input); return }
    if (input === 'clear') { set((state) => ({ terminal: { ...state.terminal, entries: [] } })); return }
    const entries = append(get().terminal.entries, 'shell', input, get().terminal.workspace.cwd.replace('/Users/demo', '~'))
    if (input === 'claude') {
      const session = readySession()
      set((state) => ({
        terminal: { ...state.terminal, mode: 'claude', entries: append(entries, 'launch', state.terminal.workspace.cwd.replace('/Users/demo', '~')), allowSessionEdits: false },
        sessions: [...state.sessions.filter((item) => item.source !== 'claude'), session],
        announcement: 'Claude Code started from Terminal.',
      }))
      return
    }
    if (input === 'claude --help') {
      set((state) => ({ terminal: { ...state.terminal, entries: append(entries, 'output', 'claude    Start the interactive Claude Code preview\nUse /help inside Claude Code for file and command examples.') } }))
      return
    }
    const result = runDemoShell(get().terminal.workspace, input)
    set((state) => ({ terminal: { ...state.terminal, workspace: result.workspace, entries: result.output ? append(entries, result.exitCode ? 'error' : 'output', result.output) : entries } }))
  },
  submitClaudeTask: (text) => {
    const input = text.trim()
    if (!input || input.length > 2000 || get().terminal.job || get().pendingReplyId) return
    set((state) => ({ terminal: { ...state.terminal, interactive: true } }))
    if (['/exit', '/quit', 'exit'].includes(input)) {
      set((state) => ({ terminal: { ...state.terminal, mode: 'shell', allowSessionEdits: false, entries: append(state.terminal.entries, 'system', 'Claude Code session ended.') }, sessions: state.sessions.filter((item) => item.source !== 'claude'), ...(state.selectedSessionId === 'claude-session' ? { view: 'sessions' as const, selectedSessionId: null } : {}), pendingReplyId: null, announcement: 'Claude Code exited. Terminal is ready.' }))
      return
    }
    if (input === '/clear') {
      set((state) => ({ terminal: { ...state.terminal, entries: [{ id: 1, kind: 'launch', content: state.terminal.workspace.cwd.replace('/Users/demo', '~') }], allowSessionEdits: false }, sessions: [...state.sessions.filter((item) => item.source !== 'claude'), readySession()] }))
      return
    }
    if (['/help', '?', '/status', '/files'].includes(input)) {
      const message = input === '/status' ? `Claude Code · interactive preview\nDirectory: ${get().terminal.workspace.cwd}\nFiles: ${Object.keys(get().terminal.workspace.files).length}\nPermissions: ${get().terminal.allowSessionEdits ? 'edits allowed for this session' : 'ask before changes'}\nWorkspace changes stay in this page.` : input === '/files' ? runDemoShell(get().terminal.workspace, 'find . -type f').output : `Enter a task, or use ! to run a shell command.\n\n${terminalExamples.join('\n')}\nEdit notes.txt replace "Hello" with "Hi"\n\n/help     Show examples\n/files    List workspace files\n/status   Session information\n/clear    Clear conversation\n/exit     Return to the shell\n\nEnter: send · Shift+Enter: new line\n↑ / ↓: input history · Esc / Ctrl+C: interrupt`
      set((state) => ({ terminal: { ...state.terminal, entries: append(state.terminal.entries, 'system', message) } }))
      return
    }
    if (input.startsWith('/')) {
      set((state) => ({ terminal: { ...state.terminal, entries: append(state.terminal.entries, 'error', `Unknown preview command: ${input}. Type /help for available commands.`) } }))
      return
    }
    clearTimers('terminal')
    const plan = planDemoTask(input, get().terminal.workspace)
    set((state) => {
      const session = state.sessions.find((item) => item.source === 'claude') ?? readySession()
      let entries = append(state.terminal.entries, 'user', input)
      if (plan.introduction) entries = append(entries, 'assistant', plan.introduction)
      const activity = Math.max(0, ...state.sessions.map((item) => item.lastActivity)) + 1
      return {
        terminal: { ...state.terminal, mode: 'claude', entries, job: { actions: plan.actions, index: 0, answer: plan.answer, awaitingApproval: false } },
        pendingReplyId: session.id,
        sessions: [...state.sessions.filter((item) => item.source !== 'claude'), { ...session, title: input.length > 42 ? input.slice(0, 42) + '…' : input, phase: 'processing' as const, summary: plan.introduction || 'Thinking…', tool: undefined, lastUserAt: activity, lastActivity: activity, messages: addMessage(session, 'user', input) }],
        announcement: 'Claude Code is working in the preview workspace.',
      }
    })
    schedule(() => get().advanceTerminal(), 350, 'terminal')
  },
  advanceTerminal: (approved = false) => {
    const { terminal } = get()
    const job = terminal.job
    if (!job || (job.awaitingApproval && !approved)) return
    const action = job.actions[job.index]
    if (!action) {
      set((state) => ({
        terminal: { ...state.terminal, job: null, entries: append(state.terminal.entries, 'assistant', job.answer) },
        pendingReplyId: null, announcement: 'Claude Code is ready for your next instruction.',
        sessions: state.sessions.map((session) => session.source === 'claude' ? { ...session, phase: 'waitingForInput', summary: 'Ready for your next instruction', tool: undefined, messages: addMessage(session, 'assistant', job.answer), lastActivity: session.lastActivity + 1 } : session),
      }))
      return
    }
    const tool = toolDescription(action)
    if (toolNeedsApproval(action) && !approved && !terminal.allowSessionEdits) {
      set((state) => ({
        terminal: { ...state.terminal, job: { ...job, awaitingApproval: true }, entries: append(state.terminal.entries, 'tool', tool.name, tool.input) },
        isOpen: true, view: 'sessions', selectedSessionId: null,
        announcement: `${tool.name} needs approval in Terminal or the notch.`,
        sessions: state.sessions.map((session) => session.source === 'claude' ? { ...session, phase: 'waitingForApproval', summary: 'Waiting for approval', tool } : session),
      }))
      return
    }
    set((state) => ({
      terminal: { ...state.terminal, job: { ...job, awaitingApproval: false }, entries: approved ? state.terminal.entries : append(state.terminal.entries, 'tool', tool.name, tool.input) },
      sessions: state.sessions.map((session) => session.source === 'claude' ? { ...session, phase: 'processing', summary: `${tool.name} ${tool.input}`, tool: undefined } : session),
    }))
    schedule(() => {
      if (!get().terminal.job) return
      const result = executeDemoTool(get().terminal.workspace, action)
      set((state) => ({
        terminal: { ...state.terminal, workspace: result.workspace, job: result.exitCode ? null : { ...job, index: job.index + 1, awaitingApproval: false }, entries: append(state.terminal.entries, result.exitCode ? 'error' : 'output', result.output || '(No output)') },
        ...(result.exitCode ? { pendingReplyId: null, announcement: 'The preview tool reported an error.' } : {}),
        sessions: state.sessions.map((session) => session.source === 'claude' ? { ...session, ...(result.exitCode ? { phase: 'failed' as const, summary: result.output.slice(0, 120), tool: undefined } : {}), cwd: result.workspace.cwd.replace('/Users/demo', '~'), messages: addMessage(session, 'tool', `${tool.name} · ${tool.input}\n${result.output || '(No output)'}`), lastActivity: session.lastActivity + 1 } : session),
      }))
      if (!result.exitCode) schedule(() => get().advanceTerminal(), 180, 'terminal')
    }, 450, 'terminal')
  },
  resolveTerminalApproval: (allowed, remember = false) => {
    if (!get().terminal.job?.awaitingApproval) return
    if (!allowed) { get().interruptTerminal(); return }
    if (remember) set((state) => ({ terminal: { ...state.terminal, allowSessionEdits: true } }))
    get().advanceTerminal(true)
  },
  interruptTerminal: () => {
    const pending = get().terminal.job
    if (!pending && !get().sessions.some((session) => session.source === 'claude' && session.phase === 'processing')) return
    clearTimers('terminal')
    const message = pending?.awaitingApproval ? 'Tool request denied. No pending changes were applied.' : 'Interrupted. Waiting for your next instruction.'
    set((state) => ({
      terminal: { ...state.terminal, job: null, entries: append(state.terminal.entries, 'system', message) },
      pendingReplyId: null, announcement: message,
      sessions: state.sessions.map((session) => session.source === 'claude' ? { ...session, phase: 'waitingForInput', summary: message, tool: undefined, messages: addMessage(session, 'assistant', message) } : session),
    }))
  },
  closeTerminal: () => {
    clearTimers('terminal')
    set((state) => ({ terminal: { ...createTerminalState(), interactive: state.terminal.interactive, workspace: state.terminal.workspace }, pendingReplyId: state.pendingReplyId === 'claude-session' ? null : state.pendingReplyId, sessions: state.sessions.filter((session) => session.source !== 'claude'), ...(state.selectedSessionId === 'claude-session' ? { view: 'sessions' as const, selectedSessionId: null } : {}), announcement: 'Terminal closed.' }))
  },
})
