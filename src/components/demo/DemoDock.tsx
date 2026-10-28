import { useEffect } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { useTimeStore } from '../../stores/time'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

export const dockApps = [
  { id: 'finder', label: 'Finder', src: '/images/dock/native/finder.webp' },
  { id: 'terminal', label: 'Terminal', src: '/images/dock/native/terminal.webp' },
  { id: 'codex', label: 'Codex', src: '/images/dock/native/codex.webp' },
  { id: 'vibehud', label: 'vibe hud', src: '/images/dock/vibehud.webp' },
  { id: 'settings', label: 'Settings', src: '/images/dock/native/settings.webp' },
] as const
export type DockAppId = (typeof dockApps)[number]['id']

const systemApps = [
  ['apps', 'Launchpad'], ['safari', 'Safari'], ['messages', 'Messages'], ['mail', 'Mail'],
  ['maps', 'Maps'], ['photos', 'Photos'], ['facetime', 'FaceTime'], ['phone', 'Phone'],
  ['calendar', 'Calendar'], ['contacts', 'Contacts'], ['reminders', 'Reminders'], ['notes', 'Notes'],
  ['music', 'Music'], ['keynote', 'Keynote'], ['numbers', 'Numbers'], ['pages', 'Pages'],
  ['appstore', 'App Store'], ['iphone', 'iPhone Mirroring'],
] as const
const recentApps = [['github', 'GitHub Desktop']] as const

interface DemoDockProps {
  isReady: boolean
  activeApp: DockAppId
  openApps: ReadonlySet<DockAppId>
  launch: { app: DockAppId; sequence: number } | null
  onOpen: (id: DockAppId) => void
}

function DockCalendarDate() {
  const day = useTimeStore((state) => state.now.getDate())
  const weekday = useTimeStore((state) => new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(state.now).toUpperCase())
  return <><span className="demo-dock-calendar-month absolute inset-x-0 top-0 text-center text-white" suppressHydrationWarning>{weekday}</span><span className="demo-dock-calendar absolute inset-x-0 bottom-1 flex items-center justify-center bg-white text-zinc-800" suppressHydrationWarning>{day}</span></>
}

function SystemDockItem({ id, label }: { id: string; label: string }) {
  return (
    <span className="demo-dock-system demo-dock-item group/dock relative shrink-0 items-start justify-center border border-transparent" aria-hidden="true">
      <span className="demo-dock-tooltip pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/30 bg-zinc-800/90 text-white opacity-0 group-hover/dock:opacity-100">{label}</span>
      <span className="demo-dock-icon relative flex items-center justify-center"><img className="size-full object-contain" src={`/images/dock/native/${id}.webp`} alt="" draggable={false} />{id === 'calendar' && <DockCalendarDate />}</span>
    </span>
  )
}

function DockItem({ app, isReady, active, running, launchSequence, onOpen }: {
  app: (typeof dockApps)[number]
  isReady: boolean; active: boolean; running: boolean; launchSequence: number
  onOpen: DemoDockProps['onOpen']
}) {
  const controls = useAnimationControls()
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    controls.set({ y: 0 })
    if (launchSequence && !reduceMotion) void controls.start({ y: [0, -16, 0, -7, 0], transition: { duration: 0.6 } })
    return () => controls.stop()
  }, [controls, launchSequence, reduceMotion])

  return (
    <Button variant="ghost" size="custom"
      className="demo-dock-item group/dock relative flex cursor-pointer items-start rounded-xl hover:bg-transparent aria-pressed:bg-transparent"
      onClick={() => onOpen(app.id)} disabled={!isReady} aria-label={`Open ${app.label}`} aria-pressed={active}>
      <span className="demo-dock-tooltip pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 rounded-md border border-white/30 bg-zinc-800/90 text-white opacity-0 group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100" aria-hidden="true">{app.label}</span>
      <motion.span initial={false} animate={controls} className="demo-dock-icon flex shrink-0 items-center justify-center overflow-hidden">
        <img className="size-full object-contain" src={app.src} alt="" draggable={false} />
      </motion.span>
      <span className={cn('demo-dock-dot pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-stone-900', !running && 'invisible')} aria-hidden="true" />
    </Button>
  )
}

export default function DemoDock({ isReady, activeApp, openApps, launch, onOpen }: DemoDockProps) {
  const launcher = (id: DockAppId) => {
    const app = dockApps.find((item) => item.id === id)
    return app ? <DockItem key={app.id} app={app} isReady={isReady} active={activeApp === app.id} running={openApps.has(app.id)} launchSequence={launch?.app === app.id ? launch.sequence : 0} onOpen={onOpen} /> : null
  }
  return (
    <div className="demo-dock-position absolute inset-x-0 z-10 flex justify-center">
      <div role="group" aria-label="Demo Dock" aria-busy={!isReady} className="demo-dock flex items-center border border-white/30 bg-white/15 backdrop-blur-xl">
        {launcher('finder')}
        {systemApps.map(([id, label]) => <SystemDockItem key={id} id={id} label={label} />)}
        {launcher('settings')}
        {launcher('codex')}
        {launcher('terminal')}
        {recentApps.map(([id, label]) => <SystemDockItem key={id} id={id} label={label} />)}
        {launcher('vibehud')}
        <span className="demo-dock-separator" aria-hidden="true" />
        <SystemDockItem id="folder" label="Downloads" />
        <SystemDockItem id="trash" label="Trash" />
      </div>
    </div>
  )
}
