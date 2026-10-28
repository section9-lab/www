import { useEffect, useId, useRef } from 'react'
import { ArrowUp, Check, LoaderCircle, Square } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useIslandStore } from '../../stores/island'
import { terminalExamples } from '../../config/terminal'
import { cn } from '../../lib/utils'
import type { DemoSession } from '../../types/demo'
import type { TerminalEntry } from '../../types/terminal'
import { Button } from '../ui/button'

const inputSchema = z.object({ input: z.string().trim().min(1, 'Enter a command or task.').max(2000, 'Keep the input within 2,000 characters.') })
type TerminalForm = z.infer<typeof inputSchema>

function TranscriptEntry({ entry }: { entry: TerminalEntry }) {
  if (entry.kind === 'shell') return <p className="break-words whitespace-pre-wrap"><span className="text-hud-green">demo@MacBook-Pro</span><span className="text-zinc-400"> {entry.detail?.split('/').at(-1) ?? 'vibe-hud'} % </span>{entry.content}</p>
  if (entry.kind === 'user') return <p className="flex gap-2 bg-white/5 px-1 py-0.5"><span aria-hidden="true">❯</span><span className="min-w-0 break-words whitespace-pre-wrap">{entry.content}</span></p>
  if (entry.kind === 'tool') return <p className="flex gap-2"><span className="shrink-0 text-zinc-300" aria-hidden="true">●</span><span className="min-w-0 break-words"><strong className="font-semibold text-white">{entry.content}</strong>{entry.detail && <span className="text-zinc-400">({entry.detail})</span>}</span></p>
  return <pre className={cn('min-w-0 break-words whitespace-pre-wrap font-[inherit]', entry.kind === 'error' ? 'text-hud-red' : entry.kind === 'output' ? 'border-l border-white/10 pl-3 text-zinc-400' : entry.kind === 'system' ? 'text-zinc-500' : 'text-zinc-200')}>{entry.content}</pre>
}

function ClaudeWelcome({ cwd }: { cwd: string }) {
  return (
          <div className="demo-terminal-welcome relative grid shrink-0 grid-cols-[1fr_auto] rounded-md border border-agent-claude/60">
            <span className="absolute -top-3 left-3 bg-terminal-surface px-1 text-agent-claude">Claude Code</span>
            <div className="min-w-0 space-y-1 text-center">
              <p className="font-semibold text-agent-claude">Welcome back!</p>
              <pre className="demo-terminal-mascot font-[inherit] leading-tight text-agent-claude" aria-hidden="true">{' ▐▛███▜▌\n▝▜█████▛▘\n  ▘▘ ▝▝'}</pre>
              <p className="text-zinc-300">Interactive preview</p>
              <p className="break-all text-zinc-500">{cwd}</p>
            </div>
            <div className="demo-terminal-tips min-w-0 border-l border-agent-claude/30 pl-4 text-zinc-400">
              <p className="font-semibold text-agent-claude">Tips for getting started</p>
              <p className="mt-1">Read files, edit code, or run a command.</p>
              <p className="mt-3 border-t border-agent-claude/30 pt-3 font-semibold text-agent-claude">Try a task</p>
              <p className="mt-1">Read README.md</p>
              <p>Write notes.txt: Hello</p>
            </div>
          </div>
  )
}

export default function ClaudeCodeTerminal({ session, initialInput = '', onDraftChange }: { session?: DemoSession; initialInput?: string; onDraftChange?: (text: string) => void }) {
  const terminal = useIslandStore((state) => state.terminal)
  const pendingReplyId = useIslandStore((state) => state.pendingReplyId)
  const submitInput = useIslandStore((state) => state.submitTerminalInput)
  const interrupt = useIslandStore((state) => state.interruptTerminal)
  const resolveApproval = useIslandStore((state) => state.resolveTerminalApproval)
  const reduceMotion = useReducedMotion()
  const fieldId = useId()
  const transcript = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement | null>(null)
  const historyIndex = useRef<number | null>(null)
  const draft = useRef('')
  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<TerminalForm>({ resolver: zodResolver(inputSchema), defaultValues: { input: initialInput } })
  const registration = register('input')
  const value = watch('input')
  const isClaude = terminal.mode === 'claude'
  const awaitingApproval = Boolean(terminal.job?.awaitingApproval)
  const busy = Boolean(terminal.job || pendingReplyId)
  const working = (busy || session?.phase === 'processing') && !awaitingApproval
  const cwd = terminal.workspace.cwd.replace('/Users/demo', '~')
  const pendingAction = terminal.job?.actions[terminal.job.index]

  useEffect(() => {
    if (transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight
  }, [terminal.entries.length, terminal.job?.index, awaitingApproval])
  useEffect(() => { onDraftChange?.(value ?? '') }, [value, onDraftChange])

  const submit = handleSubmit(({ input }) => {
    if (busy) return
    submitInput(input)
    historyIndex.current = null
    draft.current = ''
    reset()
  })

  const complete = () => {
    const text = value ?? ''
    const last = text.split(/\s/).at(-1) ?? ''
    const paths = [...Object.keys(terminal.workspace.files), ...terminal.workspace.directories].map((path) => path === terminal.workspace.cwd ? '.' : path.startsWith(terminal.workspace.cwd + '/') ? path.slice(terminal.workspace.cwd.length + 1) : path)
    const choices = !text.includes(' ') ? [...(isClaude ? ['/help', '/files', '/status', '/clear', '/exit', '!ls', '!cat'] : ['claude', 'ls', 'cat', 'pwd', 'mkdir', 'echo', 'help']), ...paths] : paths
    const candidate = choices.find((choice) => choice.startsWith(last) && choice !== last)
    if (candidate && last) setValue('input', text.slice(0, text.length - last.length) + candidate, { shouldValidate: true })
  }

  return (
    <div className="demo-terminal relative flex min-h-0 flex-1 select-text flex-col bg-terminal-surface font-mono text-zinc-200" aria-label="Interactive Terminal" onKeyDown={(event) => {
      if (awaitingApproval && !event.nativeEvent.isComposing && event.target instanceof HTMLTextAreaElement) {
        if (['1', '2', '3', 'Enter', 'Escape'].includes(event.key)) {
          event.preventDefault()
          resolveApproval(event.key !== '3' && event.key !== 'Escape', event.key === '2')
        }
      }
    }}>
      <div ref={transcript} className="demo-terminal-transcript min-h-0 flex-1 overflow-y-auto overscroll-contain rounded-sm pr-1 outline-none focus-visible:ring-1 focus-visible:ring-agent-claude" role="log" aria-label="Terminal transcript" aria-live="polite" aria-relevant="additions" tabIndex={0}>
        {!isClaude && !terminal.entries.length && (
          <div className="space-y-2 text-zinc-400"><p>Last login: Wed Oct 28 on ttys001</p><p>Type <span className="text-white">claude</span> to start Claude Code.</p><p className="text-zinc-500">Preview workspace · files stay in this page.</p></div>
        )}
        {terminal.entries.map((entry) => entry.kind === 'launch' ? <ClaudeWelcome key={entry.id} cwd={entry.content} /> : <TranscriptEntry key={entry.id} entry={entry} />)}
      </div>

      {awaitingApproval && session?.tool && (
        <div className="demo-terminal-approval my-2 max-h-[48%] shrink-0 space-y-2 overflow-y-auto overscroll-contain rounded border border-hud-amber/70 p-3 text-zinc-200" role="group" aria-label="Terminal tool approval">
          <p className="font-semibold text-hud-amber">{session.tool.name === 'Bash' ? 'Bash command' : `${session.tool.name} file`}</p>
          <pre className="break-words whitespace-pre-wrap font-[inherit]">{session.tool.input}</pre>
          {pendingAction?.kind === 'write' && <pre className="max-h-20 overflow-y-auto break-words whitespace-pre-wrap font-[inherit] text-hud-green">{pendingAction.content}</pre>}
          {pendingAction?.kind === 'edit' && <pre className="max-h-20 overflow-y-auto break-words whitespace-pre-wrap font-[inherit] text-hud-green">{`- ${pendingAction.before}\n+ ${pendingAction.after}`}</pre>}
          <p>Do you want to proceed?</p>
          <div className="flex flex-col items-start gap-1">
            <Button variant="plain" size="custom" className="demo-terminal-option justify-start rounded-sm px-1 font-mono text-[inherit] text-agent-claude hover:bg-white/5" onClick={() => resolveApproval(true)} aria-label="Allow terminal tool once">1. Yes</Button>
            <Button variant="plain" size="custom" className="demo-terminal-option justify-start rounded-sm px-1 font-mono text-[inherit] text-zinc-400 hover:bg-white/5" onClick={() => resolveApproval(true, true)} aria-label="Allow terminal changes for this session">2. Yes, allow changes for this session</Button>
            <Button variant="plain" size="custom" className="demo-terminal-option justify-start rounded-sm px-1 font-mono text-[inherit] text-zinc-400 hover:bg-white/5" onClick={() => resolveApproval(false)} aria-label="Deny terminal tool">3. No</Button>
          </div>
          <p className="text-zinc-500">You can also approve or deny in the notch.</p>
        </div>
      )}

      <div className="demo-terminal-footer shrink-0">
        {isClaude && <p className="demo-terminal-status flex items-center gap-2 text-agent-claude" role="status">
          {working ? <motion.span animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}><LoaderCircle className="demo-terminal-status-icon" aria-hidden="true" /></motion.span> : awaitingApproval ? <Square className="demo-terminal-status-icon text-hud-amber" aria-hidden="true" /> : <Check className="demo-terminal-status-icon text-hud-green" aria-hidden="true" />}
          <span className={awaitingApproval ? 'text-hud-amber' : !working ? 'text-hud-green' : undefined}>{awaitingApproval ? 'Waiting for approval' : working ? 'Working…' : 'Ready for your next instruction'}</span>
          <span className="demo-terminal-tokens ml-auto text-zinc-500">{Object.keys(terminal.workspace.files).length} files</span>
        </p>}
        <form onSubmit={submit} aria-label="Terminal input" className="demo-terminal-composer flex items-start gap-2 border-y border-white/25 py-1.5 focus-within:border-agent-claude">
          <label htmlFor={fieldId} className="shrink-0 py-0.5 text-zinc-400"><span aria-hidden="true">{isClaude ? '❯' : '%'}</span><span className="sr-only">{isClaude ? 'Claude Code prompt' : 'Terminal command'}</span></label>
          <textarea {...registration} ref={(element) => { registration.ref(element); inputRef.current = element }} id={fieldId} rows={Math.min(3, (value ?? '').split('\n').length)} spellCheck={false} autoComplete="off" autoCapitalize="off" enterKeyHint="send"
            className="demo-terminal-field min-h-0 min-w-0 flex-1 resize-none bg-transparent py-0.5 text-[inherit] leading-[inherit] text-white caret-white outline-none placeholder:text-zinc-500 disabled:opacity-50"
            placeholder={awaitingApproval ? 'Choose 1, 2, or 3' : isClaude ? 'Ask Claude Code…' : 'claude'} aria-invalid={Boolean(errors.input)} aria-describedby={`${fieldId}-hint${errors.input ? ` ${fieldId}-error` : ''}`}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return
              if (awaitingApproval && ['1', '2', '3', 'Enter', 'Escape'].includes(event.key)) return
              if ((event.ctrlKey && event.key.toLowerCase() === 'c') || event.key === 'Escape') {
                if (working || value?.trim() || event.ctrlKey) { event.preventDefault(); if (working) interrupt(); else reset() }; return
              }
              if (event.ctrlKey && event.key.toLowerCase() === 'l') { event.preventDefault(); if (!busy) { submitInput(isClaude ? '/clear' : 'clear'); reset() }; return }
              if (event.ctrlKey && event.key.toLowerCase() === 'd' && !value?.trim()) { event.preventDefault(); if (isClaude && !busy) submitInput('/exit'); return }
              if (event.key === 'Tab') { if (value?.trim() && !event.shiftKey) { event.preventDefault(); complete() }; return }
              if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && !(value ?? '').includes('\n')) {
                const history = terminal.history
                if (!history.length) return
                event.preventDefault()
                if (historyIndex.current === null) { draft.current = value ?? ''; historyIndex.current = history.length }
                historyIndex.current = Math.max(0, Math.min(history.length, historyIndex.current + (event.key === 'ArrowUp' ? -1 : 1)))
                setValue('input', historyIndex.current === history.length ? draft.current : history[historyIndex.current])
                return
              }
              if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); void submit() }
            }} />
          {working ? <Button variant="plain" size="custom" className="demo-terminal-submit text-zinc-400 hover:text-white" onClick={interrupt} aria-label="Interrupt terminal task"><Square className="size-full" aria-hidden="true" /></Button> : <Button type="submit" variant="plain" size="custom" className="demo-terminal-submit text-zinc-400 hover:text-white" disabled={!value?.trim() || busy} aria-label="Run terminal input"><ArrowUp className="size-full" aria-hidden="true" /></Button>}
        </form>
        {errors.input && <p id={`${fieldId}-error`} role="alert" className="mt-1 text-hud-red">{errors.input.message}</p>}
        <div id={`${fieldId}-hint`} className="demo-terminal-hints mt-1 flex justify-between gap-2 text-zinc-500"><span>{working ? 'esc to interrupt' : isClaude ? '/help for examples' : 'claude to start'}</span><span className="demo-terminal-shortcut">{isClaude ? 'Preview workspace' : cwd.split('/').at(-1)}</span></div>
        {isClaude && !busy && !terminal.entries.some((entry) => entry.kind === 'user') && <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-zinc-500">{terminalExamples.slice(0, 2).map((example) => <Button key={example} variant="plain" size="custom" className="font-mono text-[inherit] hover:text-zinc-300" onClick={() => { setValue('input', example); inputRef.current?.focus() }}>{example}</Button>)}</div>}
      </div>
    </div>
  )
}
