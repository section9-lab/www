import type { DemoTerminalState, DemoWorkspace } from '../types/terminal'

export const workspaceRoot = '/Users/demo/Projects/vibe-hud'
export const terminalExamples = [
  'Read README.md',
  'Write notes.txt: Hello from Claude Code',
  '!cat notes.txt',
  'Run npm test',
] as const

export const workspaceFiles: Record<string, string> = {
  'README.md': '# vibe hud\n\nA native macOS notch HUD for AI coding sessions.\n\nThis is an interactive preview workspace.\nTry reading files, writing notes.txt, or running npm test.\n',
  'package.json': JSON.stringify({ name: 'vibe-hud-demo', version: '1.0.0', scripts: { test: 'vitest run', build: 'tsc' } }, null, 2) + '\n',
  'src/greeting.ts': 'export function greet(name: string) {\n  return `Hello, ${name}!`\n}\n',
  'tests/greeting.test.ts': "import { greet } from '../src/greeting'\n\nexpect(greet('world')).toBe('Hello, world!')\nexpect(greet('Claude')).toBe('Hello, Claude!')\n",
  'VibeHUD/Services/Session/ConversationParser.swift': 'import Foundation\n\nstruct ConversationParser {\n    func preview(_ messages: [String]) -> String {\n        messages.last ?? "No messages yet"\n    }\n}\n',
}

export function createDemoWorkspace(): DemoWorkspace {
  const files = Object.fromEntries(Object.entries(workspaceFiles).map(([path, content]) => [`${workspaceRoot}/${path}`, content]))
  const directories = new Set([workspaceRoot])
  for (const path of Object.keys(files)) {
    const parts = path.split('/')
    parts.pop()
    while (parts.join('/').startsWith(workspaceRoot)) { directories.add(parts.join('/')); parts.pop() }
  }
  return { cwd: workspaceRoot, files, directories: [...directories] }
}

export function createTerminalState(): DemoTerminalState {
  return { interactive: false, mode: 'shell', entries: [], workspace: createDemoWorkspace(), job: null, history: [], allowSessionEdits: false }
}
