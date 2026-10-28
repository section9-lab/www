import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import type { DemoSession } from '../../types/demo'
import CodexWindow from './CodexWindow'
import { Button } from '../ui/button'

export default function CodexDialog({ session, onClose }: { session?: DemoSession; onClose: () => void }) {
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
    <dialog ref={dialog} aria-label="Expanded interactive Codex" onClose={onClose} className="demo-codex-dialog fixed inset-0 m-auto h-[min(88svh,48rem)] w-[calc(100%_-_1rem)] max-w-5xl overflow-hidden rounded-xl border border-zinc-300 bg-white p-0 shadow-xl backdrop:bg-black/60 sm:w-[calc(100%_-_3rem)]">
      <div className="flex h-full min-h-0 flex-col">
        <div className="flex shrink-0 items-center justify-between border-b border-zinc-200 bg-zinc-50 px-4 py-2"><p className="text-sm text-zinc-500">Codex preview</p><Button variant="plain" size="icon" onClick={onClose} className="size-10 text-zinc-500 hover:text-zinc-900" aria-label="Close expanded Codex"><X className="size-4" aria-hidden="true" /></Button></div>
        <CodexWindow session={session} />
      </div>
    </dialog>, document.body,
  )
}
