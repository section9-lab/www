import { useState } from 'react'
import { ArrowLeft, ChevronDown, Monitor, Power, Volume2 } from 'lucide-react'
import { Button } from '../ui/button'
import { AgentIcon } from './AgentActivity'
import { agents } from '../../config/demo'
import { useIslandStore } from '../../stores/island'
import type { AgentSource } from '../../types/demo'
import { cn } from '../../lib/utils'

function SettingToggle({ label, initial = true }: { label: string; initial?: boolean }) {
  const [enabled, setEnabled] = useState(initial)
  return <Button variant="ghost" role="switch" aria-checked={enabled} aria-label={label} className="h-auto w-full justify-between gap-3 px-3 py-2 text-xs font-normal" onClick={() => setEnabled(!enabled)}>
    <span>{label}</span>
    <span className={cn('flex h-4 w-7 shrink-0 items-center rounded-full px-0.5', enabled ? 'bg-hud-green' : 'bg-white/20')} aria-hidden="true"><span className={cn('size-3 rounded-full bg-white', enabled && 'ml-auto')} /></span>
  </Button>
}

export default function DemoSettings() {
  const showSessions = useIslandStore((state) => state.showSessions)
  const [hooksExpanded, setHooksExpanded] = useState(false)
  const selectClass = 'min-w-0 max-w-28 rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-xs text-white/70 outline-none focus-visible:ring-2 focus-visible:ring-rose-300'
  return (
    <div className="space-y-1 p-2 text-xs">
      <Button variant="ghost" className="w-full justify-start text-xs" onClick={showSessions}><ArrowLeft className="size-3.5" aria-hidden="true" />Back</Button>
      <div className="my-2 border-t border-white/10" />
      <label className="flex items-center justify-between gap-2 px-3 py-2"><span className="flex items-center gap-2"><Monitor className="size-3.5 text-white/40" aria-hidden="true" />Display</span><select className={selectClass} defaultValue="built-in" aria-label="Preferred display"><option value="built-in">Built-in display</option><option value="external">External display</option></select></label>
      <label className="flex items-center justify-between gap-2 px-3 py-2"><span className="flex items-center gap-2"><Volume2 className="size-3.5 text-white/40" aria-hidden="true" />Sound</span><select className={selectClass} defaultValue="none" aria-label="Notification sound"><option value="none">None</option><option value="glass">Glass</option><option value="ping">Ping</option></select></label>
      <div className="my-2 border-t border-white/10" />
      <div className="flex items-center pl-3"><Power className="size-3.5 shrink-0 text-white/40" aria-hidden="true" /><SettingToggle label="Launch at Login" initial={false} /></div>
      <Button variant="ghost" className="w-full justify-between px-3 text-xs font-normal" onClick={() => setHooksExpanded(!hooksExpanded)} aria-expanded={hooksExpanded} aria-controls="demo-agent-hooks">Agent Hooks<ChevronDown className={cn('size-3.5', hooksExpanded && 'rotate-180')} aria-hidden="true" /></Button>
      <div id="demo-agent-hooks" className="pl-3" hidden={!hooksExpanded}>{(Object.keys(agents) as AgentSource[]).map((source) => <div key={source} className="flex items-center pl-3"><AgentIcon source={source} /><SettingToggle label={agents[source].name} /></div>)}</div>
    </div>
  )
}
