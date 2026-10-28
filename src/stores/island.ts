import { create } from 'zustand'
import { createDemoSessions } from '../config/demo'
import { createWalkthroughSnapshot, type DemoAgent } from '../config/walkthrough'
import { canArchive, type DemoSession, type DemoView } from '../types/demo'
import { createTerminalState } from '../config/terminal'
import { clearTimers, schedule } from '../lib/demo-scheduler'
import { createTerminalSlice, terminalForSession, type TerminalSlice } from './terminal'

export interface IslandState extends TerminalSlice {
  sessions: DemoSession[]
  isOpen: boolean
  view: DemoView
  selectedSessionId: string | null
  pendingReplyId: string | null
  announcement: string
  initialize: () => void
  presentStep: (index: number) => void
  launchAgent: (agent: DemoAgent) => void
  open: () => void
  close: () => void
  showSessions: () => void
  showSettings: () => void
  showChat: (id: string) => void
  approve: (id: string) => void
  deny: (id: string) => void
  archive: (id: string) => void
  reply: (id: string, text: string) => void
  dispose: () => void
}

function nextActivity(sessions: DemoSession[]) {
  return Math.max(0, ...sessions.map((session) => session.lastActivity)) + 1
}

export const useIslandStore = create<IslandState>((set, get, api) => ({
  ...createTerminalSlice(set, get, api),
  sessions: createDemoSessions(), isOpen: true, view: 'sessions',
  selectedSessionId: null, pendingReplyId: null, announcement: '',

  initialize: () => {
    clearTimers()
    set({ sessions: createDemoSessions(), terminal: createTerminalState(), isOpen: true, view: 'sessions', selectedSessionId: null, pendingReplyId: null, announcement: 'Sample sessions loaded.' })
  },
  presentStep: (index) => {
    clearTimers()
    const snapshot = createWalkthroughSnapshot(index)
    const terminal = terminalForSession(snapshot.sessions.find((session) => session.source === 'claude'))
    set({ ...snapshot, terminal: index === 1 ? { ...terminal, mode: 'shell', entries: terminal.entries.slice(0, 1) } : terminal, pendingReplyId: null })
    if (index === 1) schedule(() => {
      if (!get().terminal.interactive) set({ terminal })
    }, 450, 'terminal')
  },
  launchAgent: (agent) => {
    if (get().sessions.some((session) => session.source === agent)) return
    const session = createWalkthroughSnapshot(2).sessions.find((item) => item.source === agent)
    if (session) set((state) => ({ sessions: [...state.sessions, session], announcement: `${agent === 'claude' ? 'Claude Code' : 'Codex'} session started.` }))
  },
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  showSessions: () => set({ isOpen: true, view: 'sessions', selectedSessionId: null }),
  showSettings: () => set({ isOpen: true, view: 'settings' }),
  showChat: (id) => {
    if (get().sessions.some((session) => session.id === id)) set({ isOpen: true, view: 'chat', selectedSessionId: id })
  },
  approve: (id) => {
    if (id === 'claude-session' && get().terminal.job?.awaitingApproval) { get().resolveTerminalApproval(true); return }
    const session = get().sessions.find((item) => item.id === id)
    if (session?.phase !== 'waitingForApproval') return
    set((state) => ({
      announcement: `${session.title}: tool request allowed.`,
      sessions: state.sessions.map((item) => item.id === id ? {
        ...item, phase: 'processing', summary: 'Running pnpm test…', tool: undefined, lastActivity: nextActivity(state.sessions),
        messages: [...item.messages, { id: `${id}-allowed`, role: 'tool', content: 'Allowed · pnpm test is running.' }],
      } : item),
    }))
    schedule(() => set((state) => ({
      announcement: `${session.title}: ready for review.`,
      sessions: state.sessions.map((item) => item.id === id && item.phase === 'processing' ? {
        ...item, phase: 'waitingForInput', summary: 'Checks passed. Ready for review.', lastActivity: nextActivity(state.sessions),
        messages: [...item.messages, { id: `${id}-complete`, role: 'assistant', content: 'All checks passed. The integration tests are ready for your review.' }],
      } : item),
    })), 2500)
  },
  deny: (id) => {
    if (id === 'claude-session' && get().terminal.job?.awaitingApproval) { get().resolveTerminalApproval(false); return }
    const session = get().sessions.find((item) => item.id === id)
    if (session?.phase !== 'waitingForApproval') return
    set((state) => ({
      announcement: `${session.title}: tool request denied.`,
      sessions: state.sessions.map((item) => item.id === id ? {
        ...item, phase: 'waitingForInput', summary: 'Tool request denied. Waiting for your reply.', tool: undefined, lastActivity: nextActivity(state.sessions),
        messages: [...item.messages, { id: `${id}-denied`, role: 'assistant', content: 'The command was denied. I’ll wait for your next instruction.' }],
      } : item),
    }))
  },
  archive: (id) => {
    const session = get().sessions.find((item) => item.id === id)
    if (!session || !canArchive(session.phase)) return
    set((state) => ({
      sessions: state.sessions.filter((item) => item.id !== id),
      ...(state.selectedSessionId === id ? { view: 'sessions' as const, selectedSessionId: null } : {}),
      announcement: `${session.title} archived.`,
    }))
  },
  reply: (id, text) => {
    const content = text.trim()
    const session = get().sessions.find((item) => item.id === id)
    if (!session || get().pendingReplyId || session.phase === 'waitingForApproval' || !content || content.length > 500) return
    if (session.source === 'claude' && get().terminal.mode === 'claude') { get().submitClaudeTask(content); return }
    set((state) => ({
      pendingReplyId: id, announcement: 'Reply sent in the preview.',
      sessions: state.sessions.map((item) => item.id === id ? {
        ...item, phase: 'processing', summary: content, lastActivity: nextActivity(state.sessions), lastUserAt: nextActivity(state.sessions),
        messages: [...item.messages, { id: `${id}-reply-${item.messages.length}`, role: 'user', content }],
      } : item),
    }))
    schedule(() => set((state) => ({
      pendingReplyId: null, announcement: 'The sample agent has replied.',
      sessions: state.sessions.map((item) => item.id === id ? {
        ...item, phase: 'waitingForInput', summary: 'Ready for your next instruction', lastActivity: nextActivity(state.sessions),
        messages: [...item.messages, { id: `${id}-answer-${item.messages.length}`, role: 'assistant', content: 'I’ll follow that direction. The updated session is ready for your review.' }],
      } : item),
    })), 1200)
  },
  dispose: () => { clearTimers(); set((state) => ({ pendingReplyId: null, terminal: { ...state.terminal, job: null } })) },
}))
