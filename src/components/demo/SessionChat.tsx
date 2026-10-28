import { useEffect, useId, useRef } from 'react'
import { ArrowLeft, ArrowUp, LoaderCircle, Terminal } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../ui/button'
import { ApprovalActions } from './SessionList'
import { AgentIcon, SessionStatus } from './AgentActivity'
import { useIslandStore } from '../../stores/island'
import type { DemoSession } from '../../types/demo'
import { cn } from '../../lib/utils'

const replySchema = z.object({ message: z.string().trim().min(1, 'Enter a reply.').max(500, 'Keep your reply within 500 characters.') })
type ReplyForm = z.infer<typeof replySchema>

export default function SessionChat({ session }: { session: DemoSession }) {
  const showSessions = useIslandStore((state) => state.showSessions)
  const reply = useIslandStore((state) => state.reply)
  const pendingReplyId = useIslandStore((state) => state.pendingReplyId)
  const scrollRef = useRef<HTMLDivElement>(null)
  const fieldId = useId()
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ReplyForm>({ resolver: zodResolver(replySchema), defaultValues: { message: '' } })
  const value = watch('message')
  const waitingForApproval = session.phase === 'waitingForApproval'
  const isBusy = pendingReplyId !== null

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [session.messages.length])

  const submit = handleSubmit(({ message }) => {
    if (isBusy || waitingForApproval) return
    reply(session.id, message)
    reset()
  })

  return (
    <div className="hud-chat flex min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-white/10 px-2 pb-2">
        <Button variant="ghost" size="icon" className="size-7 text-white/60" onClick={showSessions} aria-label="Back to sessions"><ArrowLeft className="size-3.5" aria-hidden="true" /></Button>
        <AgentIcon source={session.source} />
        <h3 className="min-w-0 flex-1 truncate text-xs font-medium">{session.title}</h3>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3 text-xs leading-relaxed" aria-label="Conversation history" role="log" aria-live="polite" aria-relevant="additions">
        {session.messages.length ? session.messages.map((message) => (
          <div key={message.id} className={cn('flex items-start gap-2', message.role === 'user' ? 'text-agent-claude' : 'text-white/80')}>
            {message.role === 'tool' ? <Terminal className="mt-0.5 size-3 shrink-0 text-white/40" aria-hidden="true" /> : <span className="mt-1 size-1 shrink-0 rounded-full bg-current" aria-hidden="true" />}
            <p className={cn('min-w-0 break-words whitespace-pre-wrap', message.role === 'tool' && 'font-mono text-[11px] text-white/50')}><span className="sr-only">{message.role}: </span>{message.content}</p>
          </div>
        )) : <p className="py-6 text-center text-white/40">No messages yet</p>}
        {session.phase === 'processing' && <div className="flex items-center gap-2 text-agent-claude"><SessionStatus session={session} /><span>Processing…</span></div>}
        {session.phase === 'failed' && <p role="alert" className="text-hud-red">{session.summary}</p>}
      </div>
      {waitingForApproval ? (
        <div className="shrink-0 space-y-2 border-t border-white/10 px-3 py-3">
          <p className="break-words font-mono text-[11px] text-hud-amber">{session.tool?.name} · {session.tool?.input}</p>
          <div className="flex items-center justify-between gap-2"><span className="text-[11px] text-white/50">Waiting for approval</span><div className="flex gap-1"><ApprovalActions id={session.id} title={session.title} /></div></div>
        </div>
      ) : (
        <form onSubmit={submit} className="shrink-0 border-t border-white/10 p-2" aria-label="Reply to session">
          <label htmlFor={fieldId} className="sr-only">Reply to {session.title}</label>
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-white/5 p-2 focus-within:border-white/35">
            <textarea
              {...register('message')}
              id={fieldId}
              rows={1}
              className="min-h-7 min-w-0 flex-1 resize-none bg-transparent py-1 text-xs text-white outline-none placeholder:text-white/35 disabled:opacity-50"
              placeholder="Reply to this session…"
              disabled={isBusy}
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? `${fieldId}-error` : undefined}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); void submit() }
              }}
            />
            <Button size="icon" variant="ghost" className="size-7 rounded-full bg-white/15 text-white" type="submit" disabled={isBusy || !value?.trim()} aria-label={isBusy ? 'Sending reply' : 'Send reply'}>
              {isBusy ? <LoaderCircle className="size-3.5" aria-hidden="true" /> : <ArrowUp className="size-3.5" aria-hidden="true" />}
            </Button>
          </div>
          {errors.message && <p id={`${fieldId}-error`} role="alert" className="mt-1 px-1 text-[11px] text-hud-red">{errors.message.message}</p>}
        </form>
      )}
    </div>
  )
}
