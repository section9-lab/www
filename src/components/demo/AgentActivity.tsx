import { Bot, Circle, LoaderCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'
import { agents, phaseLabels } from '../../config/demo'
import { cn } from '../../lib/utils'
import { isActivePhase, type AgentSource, type DemoSession } from '../../types/demo'

export function AgentIcon({ source }: { source: AgentSource }) {
  const [hasError, setHasError] = useState(false)
  const agent = agents[source]
  return agent.icon && !hasError
    ? <img className="size-3 shrink-0 object-contain" src={agent.icon} alt={agent.name} onError={() => setHasError(true)} />
    : <Bot className={cn('size-3 shrink-0', agent.tint)} aria-label={agent.name} />
}

export function SessionStatus({ session }: { session: DemoSession }) {
  const reduceMotion = useReducedMotion()
  const active = isActivePhase(session.phase) || session.phase === 'waitingForApproval'
  return (
    <span role="img" aria-label={phaseLabels[session.phase]} className="flex size-4 items-center justify-center">
      {active ? (
        <motion.span
          animate={{ rotate: reduceMotion ? 0 : 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className={cn('inline-flex', session.phase === 'waitingForApproval' ? 'text-hud-amber' : agents[session.source].tint)}
        >
          <LoaderCircle className="size-3.5" aria-hidden="true" />
        </motion.span>
      ) : (
        <Circle className={cn('size-1.5 fill-current', session.phase === 'waitingForInput' ? 'text-hud-green' : session.phase === 'failed' ? 'text-hud-red' : 'text-white/25')} aria-hidden="true" />
      )}
    </span>
  )
}

export function AgentActivity({ sessions }: { sessions: DemoSession[] }) {
  const reduceMotion = useReducedMotion()
  const sources = Object.keys(agents) as AgentSource[]
  const running = sessions.filter((session) => isActivePhase(session.phase))
  const lastActivity = (source: AgentSource) => {
    const sourceSessions = sessions.filter((session) => session.source === source)
    const active = sourceSessions.filter((session) => isActivePhase(session.phase))
    return Math.max(...(active.length ? active : sourceSessions).map((session) => session.lastActivity))
  }
  const rings = sources.filter((source) => sessions.some((session) => session.source === source))
    .sort((a, b) => Number(running.some((session) => session.source === b)) - Number(running.some((session) => session.source === a)) || lastActivity(b) - lastActivity(a))
    .slice(0, 3).sort((a, b) => sources.indexOf(a) - sources.indexOf(b))

  return (
    <span className="relative inline-flex size-7 shrink-0 items-center justify-center" role="img" aria-label={`Agent activity: ${running.length} running sessions`}>
      {[0, 1, 2].map((index) => {
        const source = rings[index]
        const active = source && running.some((session) => session.source === source)
        return (
          <motion.span
            key={source ?? index}
            className={cn('absolute rounded-full border-[1.5px] border-current', source ? agents[source].tint : 'text-white/20', active && 'agent-ring-active')}
            style={{ width: `${100 - index * 21}%`, height: `${100 - index * 21}%` }}
            animate={{ rotate: active && !reduceMotion ? [index * 68, index * 68 + 360] : index * 68 }}
            transition={{ duration: 2.6 - index * 0.45, repeat: active && !reduceMotion ? Infinity : 0, ease: 'linear' }}
            aria-hidden="true"
          />
        )
      })}
      <span className="font-numeric text-[9px] leading-none font-bold tabular-nums text-white">{running.length}</span>
    </span>
  )
}
