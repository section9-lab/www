import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import DynamicIsland from './DynamicIsland'
import AgentWindows from './demo/AgentWindows'
import DemoDock, { dockApps, type DockAppId } from './demo/DemoDock'
import MacMenuBar from './demo/MacMenuBar'
import TerminalDialog from './demo/TerminalDialog'
import CodexDialog from './demo/CodexDialog'
import { walkthroughSteps, type DemoAgent } from '../config/walkthrough'
import { useDemoWalkthrough } from '../hooks/useDemoWalkthrough'
import { useIslandStore } from '../stores/island'
import { useTimeStore } from '../stores/time'

function MacBookFrame({ children }: { children: ReactNode }) {
  const screenRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const screen = screenRef.current
    if (!screen) return
    const update = () => screen.style.setProperty('--desktop-scale', String(screen.clientWidth / 1710))
    const observer = new ResizeObserver(update)
    observer.observe(screen)
    update()
    return () => observer.disconnect()
  }, [])
  return (
    <div className="macbook-frame w-full border border-zinc-600 bg-zinc-800 p-1 shadow-mac-frame">
      <div className="macbook-bezel bg-black p-2 pb-3 sm:p-3 sm:pb-4">
        <div ref={screenRef} className="macbook-screen relative isolate aspect-[4/3] overflow-hidden bg-stone-900 sm:aspect-[1710/1112]">
          <img className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" src="/background.svg" alt="" draggable={false} />
          <div className="mac-desktop absolute inset-0">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function MacSimulator() {
  const startTime = useTimeStore((state) => state.start)
  const stopTime = useTimeStore((state) => state.stop)
  const initialize = useIslandStore((state) => state.initialize)
  const presentStep = useIslandStore((state) => state.presentStep)
  const launchAgent = useIslandStore((state) => state.launchAgent)
  const sessions = useIslandStore((state) => state.sessions)
  const showSessions = useIslandStore((state) => state.showSessions)
  const showSettings = useIslandStore((state) => state.showSettings)
  const disposeIsland = useIslandStore((state) => state.dispose)
  const closeTerminal = useIslandStore((state) => state.closeTerminal)
  const terminalBusy = useIslandStore((state) => state.terminal.job !== null)
  const terminalInteractive = useIslandStore((state) => state.terminal.interactive)
  const [terminalExpanded, setTerminalExpanded] = useState(false)
  const [codexExpanded, setCodexExpanded] = useState(false)
  const [terminalFocused, setTerminalFocused] = useState(false)
  const [terminalDraft, setTerminalDraft] = useState('')
  const { sceneRef, step, isExploring, explore } = useDemoWalkthrough(terminalInteractive || terminalExpanded || codexExpanded || terminalFocused || terminalBusy)
  const [isReady, setIsReady] = useState(false)
  const [activeApp, setActiveApp] = useState<DockAppId>('finder')
  const [launch, setLaunch] = useState<{ app: DockAppId; sequence: number } | null>(null)
  const [openApps, setOpenApps] = useState<ReadonlySet<DockAppId>>(() => new Set(['finder', 'vibehud']))
  const currentStep = walkthroughSteps[step]
  const openAgents = new Set<DemoAgent>(
    (['claude', 'codex'] as const).filter((agent) => openApps.has(agent === 'claude' ? 'terminal' : agent)),
  )

  useEffect(() => {
    initialize()
    presentStep(0)
    startTime()
    setIsReady(true)
    return () => { stopTime(); disposeIsland() }
  }, [disposeIsland, initialize, presentStep, startTime, stopTime])

  useEffect(() => {
    if (!isReady || isExploring) return
    setTerminalDraft('')
    presentStep(step)
    const running = new Set<DockAppId>(['finder', 'vibehud'])
    if (step >= 1) running.add('terminal')
    if (step >= 2) running.add('codex')
    setOpenApps(running)
    const agent = walkthroughSteps[step].agent
    setActiveApp(agent === 'claude' ? 'terminal' : agent ?? 'finder')
    if (step === 1 || step === 2) {
      const app = step === 1 ? 'terminal' : 'codex'
      setLaunch((current) => ({ app, sequence: (current?.sequence ?? 0) + 1 }))
    }
  }, [step, isReady, isExploring, presentStep])

  const handleDockAppClick = (appId: DockAppId) => {
    explore()
    setActiveApp(appId)
    setOpenApps((current) => new Set([...current, appId]))
    if (appId === 'terminal' || appId === 'codex') {
      if (appId === 'codex') {
        launchAgent('codex')
        if (window.matchMedia('(max-width: 639px)').matches) setCodexExpanded(true)
      }
      setLaunch((current) => ({ app: appId, sequence: (current?.sequence ?? 0) + 1 }))
      if (appId === 'terminal') {
        if (window.matchMedia('(max-width: 639px)').matches) setTerminalExpanded(true)
        else requestAnimationFrame(() => sceneRef.current?.querySelector<HTMLTextAreaElement>('.demo-terminal-field')?.focus({ preventScroll: true }))
      }
    }
    if (appId === 'vibehud') showSessions()
    if (appId === 'settings') showSettings()
  }

  return (
    <>
    <section
      aria-label="Interactive MacBook preview"
      className="relative isolate mb-8 w-full select-none sm:mb-10 lg:px-8"
      data-step={currentStep.id}
      data-mode={isExploring ? 'explore' : 'scroll'}
    >
      <div ref={sceneRef} className="demo-scroll-scene relative w-full" style={{ '--demo-stage-count': walkthroughSteps.length } as CSSProperties}>
        <div className="demo-pin sticky flex w-full flex-col items-center">
          <div
            className="demo-display"
            onPointerDownCapture={explore}
            onFocusCapture={(event) => { if (event.target instanceof HTMLTextAreaElement) setTerminalFocused(true) }}
            onBlurCapture={(event) => { if (!(event.relatedTarget instanceof HTMLTextAreaElement)) setTerminalFocused(false) }}
            onKeyDownCapture={(event) => {
              if (event.key !== 'Tab' && !['Shift', 'Control', 'Alt', 'Meta'].includes(event.key)) explore()
            }}
          >
            <MacBookFrame>
              <MacMenuBar appName={dockApps.find((app) => app.id === activeApp)?.label ?? 'Finder'} isReady={isReady} />

              <AgentWindows openAgents={openAgents} activeAgent={activeApp === 'terminal' ? 'claude' : activeApp === 'codex' ? 'codex' : null} sessions={sessions}
                terminalExpanded={terminalExpanded} onExpandTerminal={() => setTerminalExpanded(true)} codexExpanded={codexExpanded} onExpandCodex={() => setCodexExpanded(true)} terminalDraft={terminalDraft} onDraftChange={setTerminalDraft}
                onClose={(agent) => {
                  const app = agent === 'claude' ? 'terminal' : 'codex'
                  setOpenApps((current) => new Set([...current].filter((item) => item !== app)))
                  setActiveApp('finder')
                  if (agent === 'claude') { closeTerminal(); setTerminalDraft('') }
                }}
                onActivate={(agent) => setActiveApp(agent === 'claude' ? 'terminal' : agent)} />

              <div className="absolute inset-x-0 top-0 z-20 flex justify-center"><DynamicIsland isReady={isReady} /></div>

              <DemoDock isReady={isReady} activeApp={activeApp} openApps={openApps} launch={launch} onOpen={handleDockAppClick} />
              <p className="sr-only" role="status">{isReady ? `${dockApps.find((app) => app.id === activeApp)?.label} is active in the preview.` : 'Loading interactive preview.'}</p>
            </MacBookFrame>
          </div>
        </div>
      </div>
    </section>
    {codexExpanded && <CodexDialog session={sessions.find((session) => session.source === 'codex')} onClose={() => setCodexExpanded(false)} />}
    {terminalExpanded && <TerminalDialog session={sessions.find((session) => session.source === 'claude')} initialInput={terminalDraft} onDraftChange={setTerminalDraft} onClose={() => setTerminalExpanded(false)} />}
    </>
  )
}
