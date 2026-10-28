export type AgentSource = 'claude' | 'codex' | 'cursor' | 'copilot' | 'pi' | 'opencode' | 'workbuddy' | 'qwenWork'
export type SessionPhase = 'idle' | 'processing' | 'waitingForInput' | 'waitingForApproval' | 'compacting' | 'failed' | 'ended'
export type DemoView = 'sessions' | 'chat' | 'settings'

export interface DemoMessage {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
}

export interface DemoSession {
  id: string
  source: AgentSource
  title: string
  cwd: string
  phase: SessionPhase
  summary: string
  tokens: string
  lastUserAt: number
  lastActivity: number
  tool?: { name: string; input: string; details?: string }
  messages: DemoMessage[]
}

export function isActivePhase(phase: SessionPhase) {
  return phase === 'processing' || phase === 'compacting'
}

export function canArchive(phase: SessionPhase) {
  return phase === 'idle' || phase === 'waitingForInput'
}

export function sortSessions(sessions: DemoSession[]) {
  const priority = (phase: SessionPhase) => isActivePhase(phase) || phase === 'waitingForApproval' || phase === 'failed' ? 0 : phase === 'waitingForInput' ? 1 : 2
  return [...sessions].sort((a, b) => priority(a.phase) - priority(b.phase) || b.lastUserAt - a.lastUserAt)
}
