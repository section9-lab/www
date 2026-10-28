import { createDemoWorkspace, workspaceRoot } from '../config/terminal'
import type { DemoToolCall, DemoToolResult, DemoWorkspace } from '../types/terminal'

interface Token { value: string; operator: boolean }
const operators = new Set(['&&', '||', ';', '|', '>', '>>'])
const maxFileSize = 16_384

export function shellTokens(input: string): Token[] {
  const tokens: Token[] = []
  let value = ''
  let quote = ''
  let started = false
  const flush = () => { if (started) tokens.push({ value, operator: false }); value = ''; started = false }
  for (let index = 0; index < input.length; index++) {
    const char = input[index]
    if (quote) {
      if (char === quote) quote = ''
      else if (char === '\\' && quote === '"' && ['"', '\\'].includes(input[index + 1])) value += input[++index]
      else value += char
      continue
    }
    if (char === '"' || char === "'") { quote = char; started = true; continue }
    if (char === '\\' && index + 1 < input.length) { value += input[++index]; started = true; continue }
    if (/\s/.test(char)) { flush(); continue }
    const pair = input.slice(index, index + 2)
    if (operators.has(pair)) { flush(); tokens.push({ value: pair, operator: true }); index++; continue }
    if (operators.has(char)) { flush(); tokens.push({ value: char, operator: true }); continue }
    value += char; started = true
  }
  if (quote) throw new Error('Unclosed quote. Close the quote and try again.')
  flush()
  return tokens
}

export function resolveDemoPath(workspace: DemoWorkspace, input: string): string {
  const path = input.startsWith('~/') ? `/Users/demo/${input.slice(2)}` : input.startsWith('/') ? input : `${workspace.cwd}/${input}`
  const parts: string[] = []
  for (const part of path.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') parts.pop()
    else parts.push(part)
  }
  const normalized = '/' + parts.join('/')
  if (normalized !== workspaceRoot && !normalized.startsWith(workspaceRoot + '/')) throw new Error('That path is outside the preview workspace.')
  return normalized
}

function read(workspace: DemoWorkspace, input: string): string {
  const path = resolveDemoPath(workspace, input)
  if (!(path in workspace.files)) throw new Error(`${input}: No such file`)
  return workspace.files[path]
}

function write(workspace: DemoWorkspace, input: string, content: string) {
  const path = resolveDemoPath(workspace, input)
  const parent = path.slice(0, path.lastIndexOf('/'))
  if (workspace.directories.includes(path)) throw new Error(`${input}: Is a directory`)
  if (!workspace.directories.includes(parent)) throw new Error(`${parent}: No such directory. Use mkdir -p first.`)
  if (content.length > maxFileSize) throw new Error('Preview files are limited to 16 KB.')
  if (!(path in workspace.files) && Object.keys(workspace.files).length >= 100) throw new Error('The preview workspace is limited to 100 files.')
  workspace.files[path] = content
}

const readOnlyCommands = new Set(['pwd', 'ls', 'cat', 'head', 'tail', 'wc', 'find', 'grep', 'rg', 'echo', 'printf', 'help', 'whoami', 'date', 'true', 'false'])
export function toolNeedsApproval(action: DemoToolCall): boolean {
  if (action.kind === 'read') return false
  if (action.kind !== 'bash') return true
  try {
    const tokens = shellTokens(action.command)
    if (tokens.some((token) => token.operator && ['>', '>>'].includes(token.value))) return true
    let commandStart = true
    for (const token of tokens) {
      if (token.operator) { commandStart = true; continue }
      if (commandStart) {
        if (!readOnlyCommands.has(token.value)) return true
        commandStart = false
      }
    }
    return false
  } catch { return true }
}

function relative(path: string, cwd = workspaceRoot) { return path === cwd ? '.' : path.startsWith(cwd + '/') ? path.slice(cwd.length + 1) : path }
function lineCount(value: string) { return value ? value.replace(/\n$/, '').split('\n').length : 0 }
function globMatch(value: string, pattern: string) {
  let textIndex = 0
  let patternIndex = 0
  let star = -1
  let retry = 0
  while (textIndex < value.length) {
    if (pattern[patternIndex] === '?' || pattern[patternIndex] === value[textIndex]) { patternIndex++; textIndex++ }
    else if (pattern[patternIndex] === '*') { star = patternIndex++; retry = textIndex }
    else if (star >= 0) { patternIndex = star + 1; textIndex = ++retry }
    else return false
  }
  while (pattern[patternIndex] === '*') patternIndex++
  return patternIndex === pattern.length
}

function runCommand(workspace: DemoWorkspace, args: string[], stdin: string): string {
  const [command, ...rest] = args
  const operands = rest.filter((arg) => !arg.startsWith('-'))
  if (!command) return ''
  switch (command) {
    case 'true': return ''
    case 'false': throw new Error('Command exited with status 1.')
    case 'pwd': return workspace.cwd + '\n'
    case 'whoami': return 'demo\n'
    case 'date': return new Date().toLocaleString() + '\n'
    case 'help': return 'Preview shell: pwd, ls, cd, cat, head, tail, wc, find, grep, rg, echo, printf, mkdir, touch, cp, mv, rm, tee, sed, git status/diff, npm test, npm run build. Supports quotes, >, >>, pipes, &&, || and ;.\nType claude to launch Claude Code.\n'
    case 'cd': {
      const target = resolveDemoPath(workspace, rest[0] ?? workspaceRoot)
      if (!workspace.directories.includes(target)) throw new Error(`${rest[0]}: No such directory`)
      workspace.cwd = target
      return ''
    }
    case 'ls': {
      const target = resolveDemoPath(workspace, operands[0] ?? '.')
      if (target in workspace.files) return relative(target, workspace.cwd) + '\n'
      if (!workspace.directories.includes(target)) throw new Error(`${operands[0]}: No such directory`)
      const names = new Set<string>()
      for (const path of [...workspace.directories, ...Object.keys(workspace.files)]) {
        if (!path.startsWith(target + '/')) continue
        const name = path.slice(target.length + 1).split('/')[0]
        if (name.startsWith('.') && !rest.some((arg) => arg.includes('a'))) continue
        names.add(name + (workspace.directories.includes(`${target}/${name}`) ? '/' : ''))
      }
      return [...names].sort().join(rest.some((arg) => arg.includes('l')) ? '\n' : '  ') + '\n'
    }
    case 'cat': return operands.length ? operands.map((path) => read(workspace, path)).join('') : stdin
    case 'head': case 'tail': {
      const countIndex = rest.indexOf('-n')
      const count = Math.min(200, Math.max(0, Number(countIndex >= 0 ? rest[countIndex + 1] : 10)))
      if (!Number.isFinite(count)) throw new Error(`${command}: invalid line count`)
      if (!count) return ''
      const path = rest.filter((arg, index) => !arg.startsWith('-') && !(countIndex >= 0 && index === countIndex + 1)).at(-1)
      const value = path ? read(workspace, path) : stdin
      const lines = value.replace(/\n$/, '').split('\n')
      return (command === 'head' || count === 0 ? lines.slice(0, count) : lines.slice(-count)).join('\n') + '\n'
    }
    case 'wc': {
      const text = operands.length ? operands.map((path) => read(workspace, path)).join('') : stdin
      return `${rest.includes('-l') ? lineCount(text) : `${lineCount(text)} ${text.trim().split(/\s+/).filter(Boolean).length} ${text.length}`}${operands.length ? ' ' + operands.join(' ') : ''}\n`
    }
    case 'find': {
      const target = resolveDemoPath(workspace, rest[0]?.startsWith('-') ? '.' : rest[0] ?? '.')
      if (!workspace.directories.includes(target) && !(target in workspace.files)) throw new Error(`${target}: No such file or directory`)
      const patternIndex = rest.indexOf('-name')
      const pattern = patternIndex >= 0 ? rest[patternIndex + 1] : '*'
      const typeIndex = rest.indexOf('-type')
      const paths = typeIndex >= 0 ? rest[typeIndex + 1] === 'f' ? Object.keys(workspace.files) : workspace.directories : [...workspace.directories, ...Object.keys(workspace.files)]
      return paths.filter((path) => (path === target || path.startsWith(target + '/')) && globMatch(path.split('/').at(-1) ?? '', pattern)).map((path) => relative(path, workspace.cwd)).join('\n') + '\n'
    }
    case 'grep': case 'rg': {
      const pattern = operands[0]
      if (!pattern) throw new Error(`${command}: provide a search string`)
      const targets = operands.slice(1)
      const paths = targets.length ? targets.flatMap((target) => {
        const resolved = resolveDemoPath(workspace, target)
        return workspace.directories.includes(resolved) ? Object.keys(workspace.files).filter((path) => path.startsWith(resolved + '/')) : [resolved]
      }) : command === 'rg' ? Object.keys(workspace.files) : []
      const caseInsensitive = rest.some((arg) => /^-.*i/.test(arg))
      const needle = caseInsensitive ? pattern.toLowerCase() : pattern
      const match = (line: string) => (caseInsensitive ? line.toLowerCase() : line).includes(needle)
      const matches = !paths.length ? stdin.split('\n').filter(match) : paths.flatMap((path) => read(workspace, path).split('\n').flatMap((line, index) => match(line) ? [`${paths.length > 1 || command === 'rg' ? relative(path, workspace.cwd) + ':' : ''}${rest.some((arg) => /^-.*n/.test(arg)) ? index + 1 + ':' : ''}${line}`] : []))
      if (!matches.length) throw new Error('No matches found (exit code 1).')
      return matches.join('\n') + '\n'
    }
    case 'echo': return rest.filter((arg) => arg !== '-n').join(' ') + (rest[0] === '-n' ? '' : '\n')
    case 'printf': {
      let index = 1
      return (rest[0] ?? '').replace(/%[sd]/g, () => rest[index++] ?? '').replaceAll('\\n', '\n').replaceAll('\\t', '\t')
    }
    case 'mkdir': {
      for (const operand of operands) {
        const path = resolveDemoPath(workspace, operand)
        if (path in workspace.files) throw new Error(`${operand}: File exists`)
        const parts = path.split('/')
        const additions: string[] = []
        while (parts.join('/').startsWith(workspaceRoot)) { additions.unshift(parts.join('/')); parts.pop() }
        if (!rest.includes('-p') && !workspace.directories.includes(path.slice(0, path.lastIndexOf('/')))) throw new Error(`${operand}: Parent directory does not exist`)
        workspace.directories = [...new Set([...workspace.directories, ...additions])]
      }
      return ''
    }
    case 'touch': for (const path of operands) write(workspace, path, workspace.files[resolveDemoPath(workspace, path)] ?? ''); return ''
    case 'cp': case 'mv': {
      if (operands.length !== 2) throw new Error(`${command}: provide source and destination`)
      const source = resolveDemoPath(workspace, operands[0])
      const destination = resolveDemoPath(workspace, operands[1])
      const finalPath = workspace.directories.includes(destination) ? destination + '/' + source.split('/').at(-1) : destination
      write(workspace, finalPath, read(workspace, source))
      if (command === 'mv' && source !== finalPath) delete workspace.files[source]
      return ''
    }
    case 'rm': {
      for (const input of operands) {
        const path = resolveDemoPath(workspace, input)
        if (path === workspaceRoot) throw new Error('The preview workspace root cannot be removed.')
        if (workspace.directories.includes(path)) {
          if (!rest.some((arg) => /^-.*r/.test(arg))) throw new Error(`${input}: Is a directory; use -r`)
          workspace.directories = workspace.directories.filter((dir) => dir !== path && !dir.startsWith(path + '/'))
          for (const file of Object.keys(workspace.files)) if (file.startsWith(path + '/')) delete workspace.files[file]
        } else if (path in workspace.files) delete workspace.files[path]
        else if (!rest.some((arg) => /^-.*f/.test(arg))) throw new Error(`${input}: No such file`)
      }
      return ''
    }
    case 'tee': for (const path of operands) write(workspace, path, (rest.includes('-a') ? workspace.files[resolveDemoPath(workspace, path)] ?? '' : '') + stdin); return stdin
    case 'sed': {
      const expression = rest.find((arg) => arg.startsWith('s/'))
      const file = rest.at(-1)
      if (!expression || !file) throw new Error('Preview sed supports: sed [-i] "s/old/new/g" file')
      const [, before, after, flags] = expression.split('/')
      const content = read(workspace, file)
      const updated = flags?.includes('g') ? content.split(before).join(after) : content.replace(before, after)
      if (rest.some((arg) => arg.startsWith('-i'))) { write(workspace, file, updated); return '' }
      return updated
    }
    case 'git': {
      const initial = createDemoWorkspace().files
      const changed = [...new Set([...Object.keys(initial), ...Object.keys(workspace.files)])].filter((path) => initial[path] !== workspace.files[path])
      if (rest[0] === 'status') return changed.length ? changed.map((path) => `${path in initial ? path in workspace.files ? ' M' : ' D' : '??'} ${relative(path)}`).join('\n') + '\n' : 'On branch main\nnothing to commit, working tree clean\n'
      if (rest[0] === 'diff') return changed.length ? changed.map((path) => `diff --git a/${relative(path)} b/${relative(path)}\n--- a/${relative(path)}\n+++ b/${relative(path)}\n${(initial[path] ?? '').trimEnd().split('\n').map((line) => '-' + line).join('\n')}\n${(workspace.files[path] ?? '').trimEnd().split('\n').map((line) => '+' + line).join('\n')}`).join('\n') + '\n' : ''
      throw new Error('Preview git supports status and diff.')
    }
    case 'npm': case 'pnpm': case 'bun': {
      if (rest[0] === 'test' || rest.join(' ') === 'run test') {
        const source = read(workspace, workspaceRoot + '/src/greeting.ts')
        const tests = read(workspace, workspaceRoot + '/tests/greeting.test.ts')
        if (!source.includes('export function greet') || (tests.includes('Hello,') && !source.includes('Hello,'))) throw new Error('FAIL tests/greeting.test.ts\nExpected greeting: Hello, world!\nThe virtual source no longer matches the demo test.\nTests: 1 failed, 1 passed (2)')
        return 'RUN  preview test suite\n\n ✓ tests/greeting.test.ts (2 tests)\n\n Test Files  1 passed (1)\n      Tests  2 passed (2)\n'
      }
      if (rest.join(' ') === 'run build') {
        read(workspace, workspaceRoot + '/package.json'); read(workspace, workspaceRoot + '/src/greeting.ts')
        return '> vibe-hud-demo build\n> tsc\n\nPreview build completed successfully.\n'
      }
      throw new Error('Preview package scripts: npm test and npm run build.')
    }
    default: throw new Error(`${command}: command not found in the preview shell. Type help for available commands.`)
  }
}

export function runDemoShell(workspace: DemoWorkspace, command: string): DemoToolResult {
  const next: DemoWorkspace = { cwd: workspace.cwd, files: { ...workspace.files }, directories: [...workspace.directories] }
  let output = ''
  let exitCode = 0
  try {
    if (/\$\(|`|\$\{/.test(command)) throw new Error('Command substitution is not available in this preview.')
    const tokens = shellTokens(command)
    let group: Token[] = []
    let connector = ';'
    const run = () => {
      if (!group.length) return
      if ((connector === '&&' && exitCode !== 0) || (connector === '||' && exitCode === 0)) { group = []; return }
      let stdin = ''
      let segment: Token[] = []
      const execute = () => {
        if (!segment.length) throw new Error('Expected a command after the pipe.')
        const redirectIndex = segment.findIndex((token) => token.operator && ['>', '>>'].includes(token.value))
        const words = (redirectIndex < 0 ? segment : segment.slice(0, redirectIndex)).map((token) => token.value === '$PWD' ? next.cwd : token.value)
        stdin = runCommand(next, words, stdin)
        if (redirectIndex >= 0) {
          const target = segment[redirectIndex + 1]
          if (!target || target.operator || segment.length !== redirectIndex + 2) throw new Error('Provide one file path after the redirection.')
          const path = resolveDemoPath(next, target.value)
          write(next, path, (segment[redirectIndex].value === '>>' ? next.files[path] ?? '' : '') + stdin)
          stdin = ''
        }
        segment = []
      }
      try {
        for (const token of group) { if (token.operator && token.value === '|') execute(); else segment.push(token) }
        execute(); output += stdin; exitCode = 0
      } catch (error) { output += (error instanceof Error ? error.message : 'Command failed') + '\n'; exitCode = 1 }
      group = []
    }
    for (const token of tokens) {
      if (token.operator && ['&&', '||', ';'].includes(token.value)) { run(); connector = token.value }
      else group.push(token)
    }
    run()
  } catch (error) { output += (error instanceof Error ? error.message : 'Command failed') + '\n'; exitCode = 1 }
  return { workspace: next, output: output.slice(0, 6000), exitCode }
}

export function toolDescription(action: DemoToolCall): { name: string; input: string; details?: string } {
  if (action.kind === 'bash') return { name: 'Bash', input: action.command }
  if (action.kind === 'write') return { name: 'Write', input: action.path, details: action.content }
  if (action.kind === 'edit') return { name: 'Edit', input: action.path, details: `- ${action.before}\n+ ${action.after}` }
  return { name: 'Read', input: action.path }
}

export function executeDemoTool(workspace: DemoWorkspace, action: DemoToolCall): DemoToolResult {
  if (action.kind === 'bash') return runDemoShell(workspace, action.command)
  const next = { cwd: workspace.cwd, files: { ...workspace.files }, directories: [...workspace.directories] }
  try {
    if (action.kind === 'read') return { workspace: next, output: read(next, action.path), exitCode: 0 }
    if (action.kind === 'write') {
      write(next, action.path, action.content)
      return { workspace: next, output: `Wrote ${lineCount(action.content)} lines to ${action.path}\n${action.content}`, exitCode: 0 }
    }
    const source = read(next, action.path)
    if (!action.before || !source.includes(action.before)) throw new Error(`The text "${action.before}" was not found in ${action.path}.`)
    write(next, action.path, source.replace(action.before, action.after))
    return { workspace: next, output: `Updated ${action.path}\n- ${action.before}\n+ ${action.after}`, exitCode: 0 }
  } catch (error) { return { workspace: next, output: error instanceof Error ? error.message : 'Tool failed', exitCode: 1 } }
}
