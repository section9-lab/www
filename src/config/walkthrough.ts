import { createDemoSessions } from './demo'
import type { DemoSession, DemoView } from '../types/demo'

export type DemoAgent = 'claude' | 'codex'
export const walkthroughSteps = [
  { id: 'desktop', title: 'Your workflow starts here.', description: 'Scroll down to launch Claude and Codex from the Dock.', agent: null },
  { id: 'claude', title: 'Launch Claude. Get to work.', description: 'A new Claude Code session appears in your Mac’s notch.', agent: 'claude' },
  { id: 'codex', title: 'Bring Codex into the flow.', description: 'Run a second task. Keep both agents in view.', agent: 'codex' },
  { id: 'sessions', title: 'Every session, one glance.', description: 'Open the notch to follow both agents without switching windows.', agent: 'codex' },
  { id: 'approval', title: 'An approval, right on time.', description: 'Review the tool request and allow or deny it from the notch.', agent: 'codex' },
  { id: 'reply', title: 'Reply without losing your place.', description: 'Read the conversation and send your next instruction from the HUD.', agent: 'claude' },
  { id: 'complete', title: 'Work finished. Stay in the flow.', description: 'Ready indicators tell you when your agents need you next.', agent: 'claude' },
] as const satisfies ReadonlyArray<{ id: string; title: string; description: string; agent: DemoAgent | null }>

export function walkthroughIndex(progress: number) {
  if (progress <= 0) return 0
  return Math.min(walkthroughSteps.length - 1, Math.floor(progress * (walkthroughSteps.length - 1)) + 1)
}

export function createWalkthroughSnapshot(index: number): {
  sessions: DemoSession[]; isOpen: boolean; view: DemoView; selectedSessionId: string | null; announcement: string
} {
  const step = Math.min(walkthroughSteps.length - 1, Math.max(0, index))
  const sessions = createDemoSessions().filter((session) =>
    (session.source === 'claude' && step >= 1) || (session.source === 'codex' && step >= 2),
  ).map((session): DemoSession => {
    if (session.source === 'codex' && step < 4) return {
      ...session, phase: 'processing', tool: undefined, summary: 'Writing integration tests…',
      messages: [session.messages[0], { id: 'codex-working', role: 'assistant', content: 'I’m adding integration coverage for the settings flow.' }, { id: 'codex-read', role: 'tool', content: 'Read tests/settings.test.ts' }],
    }
    if (step >= 5) return {
      ...session, phase: 'waitingForInput', tool: undefined,
      summary: session.source === 'codex' ? 'Checks passed. Ready for review.' : 'Ready for your next instruction',
      messages: session.source === 'codex'
        ? [...session.messages.slice(0, 2), { id: 'codex-finished', role: 'tool', content: 'Bash · pnpm test · All checks passed.' }]
        : [...session.messages, { id: 'claude-followup', role: 'user', content: 'Review the empty states next.' }, { id: 'claude-answer', role: 'assistant', content: 'The empty states are reviewed. The session history changes are ready for your review.' }],
    }
    return session
  })
  return {
    sessions, isOpen: step >= 3, view: step === 5 ? 'chat' : 'sessions',
    selectedSessionId: step === 5 ? 'claude-session' : null,
    announcement: walkthroughSteps[step].title,
  }
}
