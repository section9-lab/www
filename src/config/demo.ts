import type { AgentSource, DemoSession, SessionPhase } from '../types/demo'

export const agents: Record<AgentSource, { name: string; icon?: string; tint: string }> = {
  claude: { name: 'Claude', icon: '/images/agents/claude.svg', tint: 'text-agent-claude' },
  codex: { name: 'Codex', icon: '/images/agents/codex.svg', tint: 'text-white' },
  cursor: { name: 'Cursor', icon: '/images/agents/cursor.svg', tint: 'text-agent-gray' },
  copilot: { name: 'GitHub Copilot', icon: '/images/agents/copilot.svg', tint: 'text-white' },
  pi: { name: 'Pi', icon: '/images/agents/pi.svg', tint: 'text-agent-gray' },
  opencode: { name: 'OpenCode', icon: '/images/agents/opencode.svg', tint: 'text-agent-gray' },
  workbuddy: { name: 'WorkBuddy', tint: 'text-agent-workbuddy' },
  qwenWork: { name: '千问办公', icon: '/images/agents/qwen.svg', tint: 'text-agent-workbuddy' },
}

export const phaseLabels: Record<SessionPhase, string> = {
  idle: 'Idle', processing: 'Processing', waitingForInput: 'Ready',
  waitingForApproval: 'Waiting for approval', compacting: 'Compacting', failed: 'Failed', ended: 'Ended',
}

// Sample data follows the native SessionState model; no real conversations are copied.
export function createDemoSessions(): DemoSession[] {
  return [
    {
      id: 'claude-session', source: 'claude', title: 'Improve session history', cwd: '~/Projects/vibe-hud',
      phase: 'processing', summary: 'Read ConversationParser.swift', tokens: '12.4k', lastUserAt: 4, lastActivity: 4,
      messages: [
        { id: 'claude-1', role: 'user', content: 'Improve the session history preview.' },
        { id: 'claude-2', role: 'assistant', content: 'I’ll review the conversation parser and make sure the preview includes the latest tool results.' },
        { id: 'claude-3', role: 'tool', content: 'Read VibeHUD/Services/Session/ConversationParser.swift' },
      ],
    },
    {
      id: 'codex-session', source: 'codex', title: 'Add integration tests', cwd: '~/Projects/website',
      phase: 'waitingForApproval', summary: 'Waiting for approval', tokens: '8.2k', lastUserAt: 3, lastActivity: 3,
      tool: { name: 'Bash', input: 'pnpm test' },
      messages: [
        { id: 'codex-1', role: 'user', content: 'Add integration tests for the new settings flow.' },
        { id: 'codex-2', role: 'assistant', content: 'The test cases are ready. I need your approval to run the suite.' },
        { id: 'codex-3', role: 'tool', content: 'Bash · pnpm test' },
      ],
    },
    {
      id: 'opencode-session', source: 'opencode', title: 'Review API responses', cwd: '~/Projects/api',
      phase: 'compacting', summary: 'Compacting conversation context…', tokens: '24.1k', lastUserAt: 2, lastActivity: 2,
      messages: [
        { id: 'opencode-1', role: 'user', content: 'Review error handling in the API responses.' },
        { id: 'opencode-2', role: 'assistant', content: 'I’ve checked the response handlers. I’m compacting the context before continuing the review.' },
      ],
    },
    {
      id: 'cursor-session', source: 'cursor', title: 'Refine the settings panel', cwd: '~/Projects/desktop',
      phase: 'waitingForInput', summary: 'Ready for your next instruction', tokens: '6.8k', lastUserAt: 1, lastActivity: 1,
      messages: [
        { id: 'cursor-1', role: 'user', content: 'Refine the settings panel and check keyboard navigation.' },
        { id: 'cursor-2', role: 'assistant', content: 'The settings panel is updated and keyboard navigation is checked. Would you like me to review the empty states next?' },
      ],
    },
  ]
}
