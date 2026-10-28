import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { DemoAgent } from '../../config/walkthrough'
import type { DemoSession } from '../../types/demo'
import ClaudeCodeTerminal from './ClaudeCodeTerminal'
import CodexWindow from './CodexWindow'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'

interface AgentWindowsProps {
  openAgents: ReadonlySet<DemoAgent>
  activeAgent: DemoAgent | null
  sessions: DemoSession[]
  onActivate: (agent: DemoAgent) => void
  codexExpanded: boolean
  onExpandCodex: () => void
  terminalExpanded: boolean
  onExpandTerminal: () => void
  onClose: (agent: DemoAgent) => void
  terminalDraft: string
  onDraftChange: (text: string) => void
}

export default function AgentWindows({ openAgents, activeAgent, sessions, onActivate, terminalExpanded, onExpandTerminal, codexExpanded, onExpandCodex, onClose, terminalDraft, onDraftChange }: AgentWindowsProps) {
  const reduceMotion = useReducedMotion()
  return (
    <AnimatePresence initial={false}>
      {(['claude', 'codex'] as const).filter((agent) => openAgents.has(agent)).map((agent) => (
        <motion.div key={agent} role="group" aria-label={agent === 'claude' ? 'Terminal window' : 'Codex window'}
          data-agent={agent} data-front={activeAgent === agent} onPointerDown={() => onActivate(agent)}
          className={cn('demo-agent-window absolute flex flex-col overflow-hidden rounded-xl border shadow-xl', agent === 'claude' ? 'border-black/30 bg-terminal-surface text-white' : 'border-black/15 bg-white text-zinc-800')}
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 36, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
          <div className={cn('demo-window-titlebar flex shrink-0 items-center gap-1.5 px-3', agent === 'claude' ? 'bg-white/5 text-white/50' : 'border-b border-zinc-200 bg-zinc-100 text-zinc-500')}>
            <Button variant="plain" size="custom" className="demo-window-control rounded-full bg-hud-red hover:brightness-110" onClick={() => onClose(agent)} aria-label={agent === 'claude' ? 'Close Terminal window' : 'Close Codex window'} />
            <span className="demo-window-control rounded-full bg-hud-amber" aria-hidden="true" />
            {agent === 'claude' ? <Button variant="plain" size="custom" className="demo-window-control rounded-full bg-hud-green hover:brightness-110" onClick={onExpandTerminal} aria-label="Expand Terminal" title="Expand Terminal" /> : <Button variant="plain" size="custom" className="demo-window-control rounded-full bg-hud-green hover:brightness-110" onClick={onExpandCodex} aria-label="Expand Codex" title="Expand Codex" />}
            <span className="flex-1 truncate text-center">{agent === 'claude' ? 'vibe-hud — Terminal' : 'Codex — website'}</span>
          </div>
          {agent === 'claude' ? terminalExpanded ? <p className="p-4 text-sm text-zinc-400">Terminal is open in the expanded view.</p> : <ClaudeCodeTerminal session={sessions.find((item) => item.source === agent)} initialInput={terminalDraft} onDraftChange={onDraftChange} /> : codexExpanded ? <p className="p-4 text-sm text-zinc-400">Codex is open in the expanded view.</p> : <CodexWindow session={sessions.find((item) => item.source === agent)} />}
        </motion.div>
      ))}
    </AnimatePresence>
  )
}
