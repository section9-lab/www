import { describe, expect, it } from 'vitest'
import { createDemoWorkspace, workspaceRoot } from '../config/terminal'
import { executeDemoTool, runDemoShell, toolNeedsApproval } from './demo-shell'
import { planDemoTask } from './demo-agent'

const file = (path: string) => `${workspaceRoot}/${path}`

describe('preview shell and virtual files', () => {
  it('keeps quoted operators literal and supports filenames with spaces', () => {
    const initial = createDemoWorkspace()
    const result = runDemoShell(initial, `echo 'alpha > beta' > "notes one.txt" && cat "notes one.txt"`)
    expect(result.exitCode).toBe(0)
    expect(result.output).toBe('alpha > beta\n')
    expect(result.workspace.files[file('notes one.txt')]).toBe('alpha > beta\n')
    expect(initial.files[file('notes one.txt')]).toBeUndefined()
  })

  it('creates directories, appends, and pipes actual file contents', () => {
    const result = runDemoShell(createDemoWorkspace(), `mkdir -p docs/demo && printf 'one\\ntwo\\n' > docs/demo/notes.txt && echo three >> docs/demo/notes.txt && cat docs/demo/notes.txt | grep two | wc -l`)
    expect(result.exitCode).toBe(0)
    expect(result.output).toBe('1\n')
    expect(result.workspace.files[file('docs/demo/notes.txt')]).toBe('one\ntwo\nthree\n')
  })

  it('preserves the working directory and resolves relative parent paths', () => {
    const result = runDemoShell(createDemoWorkspace(), 'cd src && pwd && head -n 1 greeting.ts && cat ../package.json')
    expect(result.exitCode).toBe(0)
    expect(result.workspace.cwd).toBe(file('src'))
    expect(result.output).toContain('export function greet')
    expect(result.output).toContain('vibe-hud-demo')
    expect(runDemoShell(createDemoWorkspace(), 'head README.md').output).toContain('# vibe hud')
  })

  it('short-circuits failed command chains and can recover with ||', () => {
    const failed = runDemoShell(createDemoWorkspace(), 'cat missing.txt && echo unexpected > should-not-exist.txt')
    expect(failed.exitCode).toBe(1)
    expect(failed.workspace.files[file('should-not-exist.txt')]).toBeUndefined()
    const recovered = runDemoShell(failed.workspace, 'cat missing.txt || echo recovered')
    expect(recovered.exitCode).toBe(0)
    expect(recovered.output).toContain('recovered')
    const noMatch = runDemoShell(createDemoWorkspace(), 'grep impossible-string README.md && echo unexpected > should-not-exist.txt')
    expect(noMatch.exitCode).toBe(1)
    expect(noMatch.workspace.files[file('should-not-exist.txt')]).toBeUndefined()
  })

  it('copies, moves and removes files while keeping same-path moves intact', () => {
    const result = runDemoShell(createDemoWorkspace(), 'echo hello > a.txt && cp a.txt b.txt && mv b.txt . && mv b.txt c.txt && rm a.txt && cat c.txt')
    expect(result.exitCode).toBe(0)
    expect(result.output).toBe('hello\n')
    expect(result.workspace.files[file('a.txt')]).toBeUndefined()
    expect(result.workspace.files[file('b.txt')]).toBeUndefined()
    expect(result.workspace.files[file('c.txt')]).toBe('hello\n')
  })

  it('searches files and displays diffs from actual edits', () => {
    const result = runDemoShell(createDemoWorkspace(), `sed -i '' 's/Hello/Hi/g' src/greeting.ts && rg -n Hi src && git diff`)
    expect(result.exitCode).toBe(0)
    expect(result.output).toContain('src/greeting.ts:2:')
    expect(result.output).toContain('+  return `Hi, ${name}!`')
    expect(runDemoShell(result.workspace, 'find . -type f -name "*.ts"').output).not.toContain('src\n')
  })

  it('makes test results depend on the virtual source instead of always passing', () => {
    const initial = createDemoWorkspace()
    expect(runDemoShell(initial, 'npm test').exitCode).toBe(0)
    const edited = executeDemoTool(initial, { kind: 'edit', path: 'src/greeting.ts', before: 'Hello,', after: 'Hi,' })
    const result = runDemoShell(edited.workspace, 'npm test')
    expect(result.exitCode).toBe(1)
    expect(result.output).toContain('FAIL tests/greeting.test.ts')
  })

  it('reports unsupported commands, malformed quotes, missing files and path escapes', () => {
    for (const command of ['curl https://example.com', "echo 'unclosed", 'cat missing.txt', 'echo nope > ../../outside.txt', 'echo $(whoami)']) {
      expect(runDemoShell(createDemoWorkspace(), command).exitCode, command).toBe(1)
    }
    expect(executeDemoTool(createDemoWorkspace(), { kind: 'write', path: 'large.txt', content: 'x'.repeat(17_000) }).exitCode).toBe(1)
    expect(runDemoShell(createDemoWorkspace(), `find . -name '${'*'.repeat(100)}missing'`).output).toBe('\n')
  })

  it('asks before mutations and scripts while allowing read-only tools', () => {
    expect(toolNeedsApproval({ kind: 'read', path: 'README.md' })).toBe(false)
    expect(toolNeedsApproval({ kind: 'bash', command: `echo '>' && ls | head -n 1` })).toBe(false)
    expect(toolNeedsApproval({ kind: 'bash', command: 'echo hi > notes.txt' })).toBe(true)
    expect(toolNeedsApproval({ kind: 'bash', command: 'npm test' })).toBe(true)
    expect(toolNeedsApproval({ kind: 'write', path: 'notes.txt', content: 'hello' })).toBe(true)
  })
})

describe('preview task planning', () => {
  it('understands English and Chinese file writes and verifies the written file', () => {
    for (const prompt of ['Write notes.txt: Hello', '创建 notes.txt 内容为 Hello', 'Create a file notes.txt with content Hello', '请帮我创建一个 notes.txt，内容为 Hello']) {
      const plan = planDemoTask(prompt, createDemoWorkspace())
      expect(plan.actions).toEqual([{ kind: 'write', path: 'notes.txt', content: 'Hello\n' }, { kind: 'read', path: 'notes.txt' }])
    }
    expect(planDemoTask('创建 notes.txt 内容为 你好。', createDemoWorkspace()).actions[0]).toEqual({ kind: 'write', path: 'notes.txt', content: '你好。\n' })
  })

  it('supports explicit reads, edits and shell mode', () => {
    expect(planDemoTask('Read README.md', createDemoWorkspace()).actions).toEqual([{ kind: 'read', path: 'README.md' }])
    expect(planDemoTask('请读取 README.md 的内容', createDemoWorkspace()).actions).toEqual([{ kind: 'read', path: 'README.md' }])
    expect(planDemoTask('Read the file README.md', createDemoWorkspace()).actions).toEqual([{ kind: 'read', path: 'README.md' }])
    expect(planDemoTask('Edit notes.txt replace "Hello" with "Hi"', createDemoWorkspace()).actions).toEqual([{ kind: 'edit', path: 'notes.txt', before: 'Hello', after: 'Hi' }])
    expect(planDemoTask('!cat README.md', createDemoWorkspace()).actions).toEqual([{ kind: 'bash', command: 'cat README.md' }])
  })

  it('does not pretend to run an unsupported natural-language request', () => {
    expect(planDemoTask('Book a flight to London', createDemoWorkspace()).actions).toEqual([])
  })
})
