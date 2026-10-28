import { useEffect, useId, useRef } from 'react'
import { ArrowUp, Check, ChevronDown, Circle, FileText, Folder, Home, LoaderCircle, MoreHorizontal, PanelLeft, Plus, Search, SquarePen, Terminal } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { DemoSession } from '../../types/demo'
import { useIslandStore } from '../../stores/island'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

const schema = z.object({ message: z.string().trim().min(1, 'Enter a message.').max(500, 'Keep your message within 500 characters.') })
type MessageForm = z.infer<typeof schema>

export default function CodexWindow({ session }: { session?: DemoSession }) {
  const reply = useIslandStore((state) => state.reply)
  const pendingReplyId = useIslandStore((state) => state.pendingReplyId)
  const approve = useIslandStore((state) => state.approve)
  const deny = useIslandStore((state) => state.deny)
  const logRef = useRef<HTMLDivElement>(null)
  const fieldId = useId()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<MessageForm>({ resolver: zodResolver(schema), defaultValues: { message: '' } })
  const value = watch('message')
  const awaitingApproval = session?.phase === 'waitingForApproval'
  const busy = pendingReplyId !== null
  const submit = handleSubmit(({ message }) => {
    if (!session || busy || awaitingApproval) return
    reply(session.id, message)
    reset()
  })
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [session?.messages.length])

  return (
    <div className="demo-codex flex min-h-0 flex-1 bg-white text-zinc-800">
      <aside className="demo-codex-rail shrink-0 border-r border-zinc-200 bg-zinc-100" aria-hidden="true">
        <span className="rounded-lg bg-zinc-200 p-2 text-zinc-800"><Home /></span>
        <span className="p-2 text-zinc-400"><SquarePen /></span>
        <span className="p-2 text-zinc-400"><Folder /></span>
        <span className="mt-auto p-2 text-zinc-400"><MoreHorizontal /></span>
      </aside>
      <aside className="demo-codex-sidebar shrink-0 border-r border-zinc-200 bg-zinc-50" aria-label="Sample Codex sidebar">
        <div className="flex items-center justify-between font-semibold"><span className="flex items-center gap-1">Codex <ChevronDown className="size-3.5 text-zinc-400" aria-hidden="true" /></span><Search className="size-4 text-zinc-400" aria-hidden="true" /></div>
        <p className="mt-7 flex items-center gap-3"><SquarePen className="size-4" aria-hidden="true" />New chat</p>
        <p className="mt-4 flex items-center gap-3"><Circle className="size-4 text-zinc-400" aria-hidden="true" />Your dot</p>
        <p className="mt-7 text-zinc-400">Projects</p>
        <p className="mt-4 flex items-center gap-3"><Folder className="size-4" aria-hidden="true" />website</p>
        <p className="mt-2 truncate rounded-lg bg-zinc-200/80 px-3 py-2">{session?.title ?? 'Sample task'}</p>
        <p className="mt-auto text-zinc-400">Local workspace</p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="demo-codex-heading flex shrink-0 items-center gap-3 border-b border-zinc-200 text-zinc-500">
          <PanelLeft className="size-4 shrink-0" aria-hidden="true" /><Folder className="size-4 shrink-0" aria-hidden="true" /><span className="min-w-0 flex-1 truncate font-medium text-zinc-700">{session?.title ?? 'New task'}</span><MoreHorizontal className="size-4 shrink-0" aria-hidden="true" />
        </div>
        <div className="demo-codex-main flex min-h-0 flex-1 flex-col">
          <div ref={logRef} className="demo-codex-transcript min-h-0 flex-1 overflow-y-auto leading-relaxed" role="log" aria-label="Sample Codex conversation" aria-live="polite">
            {session?.messages.length ? session.messages.map((message) => message.role === 'user' ? (
              <p key={message.id} className="demo-codex-user ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl bg-zinc-900 text-white">{message.content}</p>
            ) : message.role === 'tool' ? (
              <div key={message.id} className="demo-codex-activity flex items-start gap-2 text-zinc-500"><Terminal className="size-4 shrink-0" aria-hidden="true" /><span className="break-words">{message.content}</span></div>
            ) : (
              <p key={message.id} className="whitespace-pre-wrap break-words text-zinc-700">{message.content}</p>
            )) : <p className="text-zinc-400">Start a sample Codex session from the Dock.</p>}
            {session?.phase === 'processing' && <p className="demo-codex-activity flex items-center gap-2 text-zinc-500"><LoaderCircle className="size-4" aria-hidden="true" />Working on your task…</p>}
            {awaitingApproval && session && <div className="demo-codex-approval rounded-xl border border-zinc-200 bg-zinc-50"><p className="flex items-center gap-2 font-medium"><Terminal className="size-4" aria-hidden="true" />Run command</p><p className="mt-1 font-mono text-zinc-500">{session.tool?.input}</p><div className="mt-2 flex gap-2"><Button size="custom" variant="plain" className="rounded-md border border-zinc-300 px-2 py-1 text-xs" onClick={() => deny(session.id)}>Deny</Button><Button size="custom" variant="plain" className="rounded-md bg-zinc-900 px-2 py-1 text-xs text-white" onClick={() => approve(session.id)}>Allow</Button></div></div>}
            {session?.phase === 'waitingForInput' && <p className="demo-codex-activity flex items-center gap-2 text-zinc-500"><Check className="size-4" aria-hidden="true" />Ready for your next instruction</p>}
          </div>
          <form className="demo-codex-composer shrink-0 rounded-2xl border border-zinc-200 bg-white shadow-sm focus-within:border-zinc-400" onSubmit={submit} aria-label="Send a message to the sample Codex session">
            <label htmlFor={fieldId} className="sr-only">Message Codex</label>
            <textarea {...register('message')} id={fieldId} rows={1} maxLength={500} placeholder={awaitingApproval ? 'Approve the command to continue' : 'Ask a follow-up…'} disabled={!session || busy || awaitingApproval} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? `${fieldId}-error` : undefined} className="demo-codex-input w-full resize-none bg-transparent text-zinc-800 outline-none placeholder:text-zinc-400 disabled:opacity-60" onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void submit() } }} />
            <div className="demo-codex-meta flex items-center gap-2 text-zinc-500"><Plus className="size-4" aria-hidden="true" /><span className="ml-auto">Codex</span><ChevronDown className="size-3" aria-hidden="true" /><span>Local</span><Button size="custom" variant="plain" type="submit" className={cn('demo-codex-send rounded-full bg-zinc-900 text-white', (!value?.trim() || busy || awaitingApproval) && 'opacity-40')} disabled={!session || !value?.trim() || busy || awaitingApproval} aria-label="Send message"><ArrowUp className="size-full" aria-hidden="true" /></Button></div>
            {errors.message && <p id={`${fieldId}-error`} role="alert" className="text-hud-red">{errors.message.message}</p>}
          </form>
          <div className="demo-codex-footer items-center justify-center gap-1 text-zinc-400"><FileText className="size-3" aria-hidden="true" /> Sample workspace · No files on your computer are changed</div>
        </div>
      </div>
    </div>
  )
}
