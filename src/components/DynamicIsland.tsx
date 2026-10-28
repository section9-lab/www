import { useEffect, useId, useRef } from 'react'
import { CircleHelp, Menu, X } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { Button } from './ui/button'
import { AgentActivity } from './demo/AgentActivity'
import SessionList from './demo/SessionList'
import SessionChat from './demo/SessionChat'
import DemoSettings from './demo/DemoSettings'
import { useIslandStore } from '../stores/island'

export default function DynamicIsland({ isReady }: { isReady: boolean }) {
  const sessions = useIslandStore((state) => state.sessions)
  const isOpen = useIslandStore((state) => state.isOpen)
  const view = useIslandStore((state) => state.view)
  const selectedSessionId = useIslandStore((state) => state.selectedSessionId)
  const announcement = useIslandStore((state) => state.announcement)
  const open = useIslandStore((state) => state.open)
  const close = useIslandStore((state) => state.close)
  const showSessions = useIslandStore((state) => state.showSessions)
  const showSettings = useIslandStore((state) => state.showSettings)
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const contentId = useId()
  const selected = sessions.find((session) => session.id === selectedSessionId)
  const hasPendingApproval = sessions.some((session) => session.phase === 'waitingForApproval')

  useEffect(() => {
    const clickOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) close()
    }
    document.addEventListener('pointerdown', clickOutside)
    return () => { document.removeEventListener('pointerdown', clickOutside); if (hoverTimer.current) clearTimeout(hoverTimer.current) }
  }, [close])

  return (
    <>
      <div className="mac-hardware-notch pointer-events-none absolute top-0 left-1/2 z-30 -translate-x-1/2" aria-hidden="true">
        <span className="absolute top-3 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-slate-950 ring-2 ring-inset ring-slate-800" />
      </div>
      <motion.div
        ref={rootRef}
        className="mac-notch relative origin-top bg-black text-white"
        data-state={isOpen ? 'open' : 'closed'}
        initial={false}
        animate={{ width: isOpen ? view === 'chat' ? 'var(--hud-chat-width)' : 'var(--hud-open-width)' : hasPendingApproval ? 'calc(var(--hud-closed-width) + 1.125rem)' : 'var(--hud-closed-width)', x: isOpen ? 0 : hasPendingApproval ? -29 : -20 }}
        transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 34 }}
        onPointerEnter={(event) => {
          if (event.pointerType === 'mouse' && !isOpen && isReady) hoverTimer.current = setTimeout(open, 300)
        }}
        onPointerLeave={() => { if (hoverTimer.current) clearTimeout(hoverTimer.current) }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') { event.preventDefault(); close(); toggleRef.current?.focus() }
        }}
        role="group"
        aria-label="VibeHUD session controls"
      >
        <div className="overflow-hidden rounded-b-[inherit]">
          <div className="mac-notch-controls relative flex items-center justify-between px-1">
            <Button
              ref={toggleRef}
              variant="plain"
              className="h-8 min-w-0 flex-1 justify-start rounded-md px-1 focus-visible:ring-inset"
              onClick={() => isOpen ? close() : open()}
              disabled={!isReady}
              aria-label={isOpen ? 'Collapse session HUD' : 'Open session HUD'}
              aria-expanded={isOpen}
              aria-controls={contentId}
            >
              <AgentActivity sessions={sessions} />
              {hasPendingApproval && <CircleHelp className="size-3.5 text-agent-claude" aria-label="Tool approval needed" />}
            </Button>
            {isOpen && <Button variant="plain" size="icon" className="size-8 text-white/50 focus-visible:ring-inset" onClick={() => view === 'settings' ? showSessions() : showSettings()} aria-label={view === 'settings' ? 'Close settings' : 'Open HUD settings'}>{view === 'settings' ? <X className="size-3.5" aria-hidden="true" /> : <Menu className="size-3.5" aria-hidden="true" />}</Button>}
          </div>
          <motion.div id={contentId} initial={false} animate={{ opacity: isOpen ? 1 : 0, height: isOpen ? 'auto' : 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }} className="overflow-hidden" inert={!isOpen} aria-hidden={!isOpen}>
              <div className="hud-panel-content overflow-y-auto px-1 pb-2" data-view={view}>
                {view === 'sessions' && <SessionList />}
                {view === 'chat' && selected && <SessionChat key={selected.id} session={selected} />}
                <div hidden={view !== 'settings'}><DemoSettings /></div>
              </div>
          </motion.div>
        </div>
        <span className="sr-only" role="status">{announcement}</span>
      </motion.div>
    </>
  )
}
