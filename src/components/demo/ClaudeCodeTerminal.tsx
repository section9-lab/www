import { Check, LoaderCircle } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { agents } from '../../config/demo'
import type { DemoSession } from '../../types/demo'

export default function ClaudeCodeTerminal({ session }: { session?: DemoSession }) {
  const reduceMotion = useReducedMotion()
  const ready = session?.phase === 'waitingForInput'
  const prompt = session?.messages.filter((message) => message.role === 'user').at(-1)?.content ?? 'Improve the session history preview.'
  const answer = session?.messages.filter((message) => message.role === 'assistant').at(-1)?.content

  return (
    <div className="demo-terminal flex min-h-0 flex-1 flex-col bg-terminal-surface font-mono leading-relaxed text-zinc-200" aria-label="Sample Claude Code terminal output">
      <div className="demo-terminal-welcome flex shrink-0 items-center">
        <img src={agents.claude.icon} className="demo-terminal-logo shrink-0" alt="" />
        <div className="min-w-0 space-y-0.5">
          <p className="font-semibold text-white">Claude Code</p>
          <p className="text-zinc-400">Opus · Claude Max</p>
          <p className="truncate text-zinc-500">{session?.cwd ?? '~/Projects/vibe-hud'}</p>
        </div>
      </div>

      <div className="demo-terminal-transcript min-h-0 flex-1 overflow-hidden pr-1">
        <p className="flex gap-2"><span className="shrink-0 text-white">❯</span><span>{prompt}</span></p>
        <div className="space-y-1">
          <p className="flex gap-2"><span className="shrink-0 text-zinc-300">●</span><span className="min-w-0 break-all"><span className="font-semibold text-white">Read</span><span className="text-zinc-400">(VibeHUD/Services/Session/ConversationParser.swift)</span></span></p>
          <p className="pl-4 text-zinc-500">└ Read 248 lines</p>
        </div>
        <p className="demo-terminal-answer pl-4 text-zinc-300">{answer ?? 'I’ll review the conversation parser and update the session preview.'}</p>
        <div className="demo-terminal-detail space-y-1 pl-4">
          <p className="text-zinc-500">{ready ? 'Session history preview updated.' : 'Updating session history preview…'}</p>
          <p className="text-hud-green">+ Include the latest tool results in each preview</p>
          <p className="text-hud-green">+ Keep session ordering consistent</p>
        </div>
      </div>

      <div className="demo-terminal-footer shrink-0">
        <p className="demo-terminal-status flex items-center gap-2 text-agent-claude">
          {ready ? <Check className="demo-terminal-status-icon text-hud-green" aria-hidden="true" /> : <motion.span animate={reduceMotion ? undefined : { rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}><LoaderCircle className="demo-terminal-status-icon" aria-hidden="true" /></motion.span>}
          <span className={ready ? 'text-hud-green' : undefined}>{ready ? 'Ready for your next instruction' : 'Working…'}</span>
          <span className="demo-terminal-tokens ml-2 text-zinc-500">{session?.tokens ?? '12.4k'} tokens</span>
        </p>
        <div className="demo-terminal-input flex items-center gap-2 border-y border-white/25 text-white" aria-hidden="true"><span>❯</span><span className="demo-terminal-cursor bg-zinc-300" /></div>
        <div className="demo-terminal-hints mt-1 flex justify-between gap-2 text-zinc-500"><span>{ready ? '? for shortcuts' : 'esc to interrupt'}</span><span className="demo-terminal-shortcut">ctrl+t to expand</span></div>
      </div>
    </div>
  )
}
