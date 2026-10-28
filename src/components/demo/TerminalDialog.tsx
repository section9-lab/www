import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { DemoSession } from '../../types/demo'
import ClaudeCodeTerminal from './ClaudeCodeTerminal'
import { Button } from '../ui/button'

export default function TerminalDialog({ session, onClose, initialInput, onDraftChange }: { session?: DemoSession; onClose: () => void; initialInput: string; onDraftChange: (text: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const previous = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.current?.showModal()
    dialog.current?.querySelector('textarea')?.focus()
    return () => { dialog.current?.close(); document.body.style.overflow = previousOverflow; if (previous instanceof HTMLElement) previous.focus({ preventScroll: true }) }
  }, [])
  if (typeof document === 'undefined') return null
  return createPortal(
    <dialog ref={dialog} aria-label="Expanded interactive Terminal" onClose={onClose} className="demo-terminal-dialog fixed inset-0 m-auto h-[min(88svh,48rem)] w-[calc(100%_-_1rem)] max-w-5xl overflow-hidden rounded-xl border border-zinc-600 bg-terminal-surface p-0 text-white shadow-xl backdrop:bg-black/60 sm:w-[calc(100%_-_3rem)]">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2"><p className="text-sm text-zinc-400">Terminal — Claude Code preview</p><Button variant="plain" size="icon" onClick={onClose} className="size-10 text-zinc-400 hover:text-white" aria-label="Close expanded Terminal"><X className="size-4" aria-hidden="true" /></Button></div>
        <ClaudeCodeTerminal session={session} initialInput={initialInput} onDraftChange={onDraftChange} />
      </div>
    </dialog>, document.body,
  )
}
