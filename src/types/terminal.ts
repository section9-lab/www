export interface DemoWorkspace {
  cwd: string
  files: Record<string, string>
  directories: string[]
}

export type TerminalEntryKind = 'shell' | 'launch' | 'user' | 'assistant' | 'tool' | 'output' | 'error' | 'system'
export interface TerminalEntry {
  id: number
  kind: TerminalEntryKind
  content: string
  detail?: string
}

export type DemoToolCall =
  | { kind: 'read'; path: string }
  | { kind: 'write'; path: string; content: string }
  | { kind: 'edit'; path: string; before: string; after: string }
  | { kind: 'bash'; command: string }

export interface DemoPlan {
  introduction: string
  actions: DemoToolCall[]
  answer: string
}

export interface TerminalJob {
  actions: DemoToolCall[]
  index: number
  answer: string
  awaitingApproval: boolean
}

export interface DemoTerminalState {
  interactive: boolean
  mode: 'shell' | 'claude'
  entries: TerminalEntry[]
  workspace: DemoWorkspace
  job: TerminalJob | null
  history: string[]
  allowSessionEdits: boolean
}

export interface DemoToolResult {
  workspace: DemoWorkspace
  output: string
  exitCode: number
}
