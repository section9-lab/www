import { useEffect } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'motion/react'
import { agents } from '../../config/demo'
import { useTimeStore } from '../../stores/time'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

export const dockApps = [
  { id: 'finder', label: 'Finder', src: '/images/dock/native/finder.webp' },
  { id: 'claude', label: 'Claude', src: agents.claude.icon },
  { id: 'codex', label: 'Codex', src: '/images/dock/native/codex.webp' },
  { id: 'vibehud', label: 'vibe hud', src: '/images/dock/vibehud.webp' },
  { id: 'settings', label: 'Settings', src: '/images/dock/native/settings.webp' },
] as const
export type DockAppId = (typeof dockApps)[number]['id']

const systemApps = [
  ['apps', '应用程序'], ['safari', 'Safari'], ['messages', '信息'], ['mail', '邮件'],
  ['maps', '地图'], ['photos', '照片'], ['facetime', 'FaceTime'], ['phone', '电话'],
  ['calendar', '日历'], ['contacts', '通讯录'], ['reminders', '提醒事项'], ['notes', '备忘录'],
  ['music', '音乐'], ['keynote', 'Keynote'], ['numbers', 'Numbers'], ['pages', 'Pages'],
  ['appstore', 'App Store'], ['iphone', 'iPhone 镜像'],
] as const
const recentApps = [['terminal', '终端'], ['github', 'GitHub Desktop'], ['wechat', '微信']] as const

interface DemoDockProps {
  isReady: boolean
  activeApp: DockAppId
  openApps: ReadonlySet<DockAppId>
  launch: { app: DockAppId; sequence: number } | null
  onOpen: (id: DockAppId) => void
}

function DockCalendarDate() {
  const day = useTimeStore((state) => state.now.getDate())
  const month = useTimeStore((state) => state.now.getMonth() + 1)
  return <><span className="demo-dock-calendar-month absolute inset-x-0 top-0 text-center text-white" suppressHydrationWarning>{month}月</span><span className="demo-dock-calendar absolute inset-x-0 bottom-1 flex items-center justify-center bg-white text-zinc-800" suppressHydrationWarning>{day}</span></>
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
      <motion.span initial={false} animate={controls} className={cn('demo-dock-icon flex shrink-0 items-center justify-center overflow-hidden', app.id === 'claude' && 'bg-orange-100')}>
        <img className={cn('size-full object-contain', app.id === 'claude' && 'size-3/5')} src={app.src} alt="" draggable={false} />
      </motion.span>
      <span className={cn('demo-dock-dot pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full bg-stone-900', !running && 'invisible')} aria-hidden="true" />
    </Button>
  )
}

export default function DemoDock({ isReady, activeApp, openApps, launch, onOpen }: DemoDockProps) {
  const launcher = (app: (typeof dockApps)[number]) => <DockItem key={app.id} app={app} isReady={isReady} active={activeApp === app.id} running={openApps.has(app.id)} launchSequence={launch?.app === app.id ? launch.sequence : 0} onOpen={onOpen} />
  return (
    <div className="demo-dock-position absolute inset-x-0 z-10 flex justify-center">
      <div role="group" aria-label="Demo Dock" aria-busy={!isReady} className="demo-dock flex items-center border border-white/30 bg-white/15 backdrop-blur-xl">
        {launcher(dockApps[0])}
        {systemApps.map(([id, label]) => <SystemDockItem key={id} id={id} label={label} />)}
        {launcher(dockApps[4])}
        {launcher(dockApps[2])}
        {recentApps.map(([id, label]) => <SystemDockItem key={id} id={id} label={label} />)}
        {launcher(dockApps[1])}
        {launcher(dockApps[3])}
        <span className="demo-dock-separator" aria-hidden="true" />
        <SystemDockItem id="folder" label="下载" />
        <SystemDockItem id="trash" label="废纸篓" />
      </div>
    </div>
  )
}
