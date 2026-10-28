import { ArrowUp, Check, ChevronDown, Folder, MessageSquare, Plus, Settings2, Terminal } from 'lucide-react'
import type { DemoSession } from '../../types/demo'
import { cn } from '../../lib/utils'

export default function CodexWindow({ session }: { session?: DemoSession }) {
  const ready = session?.phase === 'waitingForInput'
  const awaitingApproval = session?.phase === 'waitingForApproval'
  return (
    <div className="demo-codex flex min-h-0 flex-1 bg-white text-zinc-800">
      <aside className="demo-codex-sidebar shrink-0 border-r border-zinc-200 bg-zinc-50" aria-label="Sample Codex sidebar">
        <p className="flex items-center justify-between font-semibold"><span>Codex</span><ChevronDown className="size-3.5" aria-hidden="true" /></p>
        <p className="mt-6 flex items-center gap-2"><Plus className="size-3.5" aria-hidden="true" />新聊天</p>
        <p className="mt-7 text-zinc-400">项目</p>
        <p className="mt-3 flex items-center gap-2"><Folder className="size-3.5" aria-hidden="true" />website</p>
        <p className="mt-2 rounded-lg bg-zinc-200/70 px-3 py-2 text-xs">Add integration tests</p>
        <p className="mt-auto flex items-center gap-2 text-zinc-500"><Settings2 className="size-3.5" aria-hidden="true" />设置</p>
      </aside>
      <div className="demo-codex-main flex min-w-0 flex-1 flex-col">
        <div className="flex items-center justify-between demo-codex-heading border-b border-zinc-100 text-zinc-500"><span>Add integration tests</span><span className="demo-codex-small">website</span></div>
        <div className="demo-codex-transcript min-h-0 flex-1 overflow-hidden leading-relaxed">
          <p className="demo-codex-user ml-auto flex max-w-[85%] items-start gap-2 rounded-2xl bg-zinc-100"><MessageSquare className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />Add integration tests for the settings flow.</p>
          <p className="demo-codex-explanation">I’ll check the settings flow and add coverage for the core interactions.</p>
          <p className="demo-codex-read demo-codex-small flex items-center gap-2 text-zinc-500"><Check className="size-3.5" aria-hidden="true" />Read tests/settings.test.ts</p>
          <div className={cn('demo-codex-tool demo-codex-small rounded-lg border', awaitingApproval ? 'border-amber-200 bg-amber-50 text-amber-900' : ready ? 'border-green-200 bg-green-50 text-green-800' : 'border-zinc-200 text-zinc-600')}>
            <p className="flex items-center gap-2 font-mono">{ready ? <Check className="size-3.5" aria-hidden="true" /> : <Terminal className="size-3.5" aria-hidden="true" />}pnpm test</p>
            <p className="mt-1">{awaitingApproval ? 'Waiting for your approval in the notch.' : session?.summary ?? 'Writing integration tests…'}</p>
          </div>
          {ready && <p className="demo-codex-explanation">The integration tests are ready for your review. All checks passed.</p>}
        </div>
        <div className="demo-codex-composer flex items-end justify-between rounded-2xl border border-zinc-200 text-zinc-400"><div><p>Ask a follow-up…</p><p className="demo-codex-meta">Codex <span className="ml-2">本地</span></p></div><ArrowUp className="demo-codex-send shrink-0 rounded-full bg-zinc-800 text-white" aria-hidden="true" /></div>
      </div>
    </div>
  )
}
