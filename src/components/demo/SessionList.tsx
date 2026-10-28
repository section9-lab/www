import { Archive, MessageSquare } from 'lucide-react'
import { Button } from '../ui/button'
import { AgentIcon, SessionStatus } from './AgentActivity'
import { useIslandStore } from '../../stores/island'
import { canArchive, sortSessions } from '../../types/demo'

export function ApprovalActions({ id, title }: { id: string; title: string }) {
  const approve = useIslandStore((state) => state.approve)
  const deny = useIslandStore((state) => state.deny)
  return (
    <>
      <Button variant="ghost" className="h-7 bg-white/10 px-2 text-xs text-white/70" onClick={() => deny(id)} aria-label={`Deny ${title}`}>Deny</Button>
      <Button variant="ghost" className="h-7 bg-white/10 px-2 text-xs text-white/90" onClick={() => approve(id)} aria-label={`Allow ${title}`}>Allow</Button>
    </>
  )
}

export default function SessionList() {
  const sessions = useIslandStore((state) => state.sessions)
  const showChat = useIslandStore((state) => state.showChat)
  const archive = useIslandStore((state) => state.archive)

  if (!sessions.length) return (
    <div className="px-4 py-8 text-center">
      <p className="text-sm font-medium text-white/50">No sessions</p>
      <p className="mt-2 text-xs text-white/40">Run claude, codex, or opencode in Terminal.</p>
    </div>
  )

  return (
    <ul className="space-y-0.5 p-1" aria-label="Agent sessions">
      {sortSessions(sessions).map((session) => (
        <li key={session.id} className="grid grid-cols-[1rem_minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 rounded-xl px-2 py-2.5 hover:bg-white/5" onDoubleClick={() => showChat(session.id)}>
          <SessionStatus session={session} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <AgentIcon source={session.source} />
              <span className="truncate text-[13px] font-medium" title={session.title}>{session.title}</span>
              <span className="hidden shrink-0 font-mono text-[10px] text-white/35 sm:inline">{session.tokens}</span>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-white/50" title={session.tool?.input ?? session.summary}>
              {session.tool ? <><span className="font-mono text-hud-amber">{session.tool.name}</span> {session.tool.input}</> : session.summary}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7 text-white/50 hover:text-white" onClick={() => showChat(session.id)} aria-label={`Open chat: ${session.title}`} title="Open chat">
              <MessageSquare className="size-3.5" aria-hidden="true" />
            </Button>
            {canArchive(session.phase) && (
              <Button variant="ghost" size="icon" className="size-7 text-white/50 hover:text-white" onClick={() => archive(session.id)} aria-label={`Archive ${session.title}`} title="Archive session">
                <Archive className="size-3.5" aria-hidden="true" />
              </Button>
            )}
          </div>
          {session.phase === 'waitingForApproval' && (
            <div className="col-start-2 col-end-4 flex justify-end gap-1">
              <ApprovalActions id={session.id} title={session.title} />
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}
