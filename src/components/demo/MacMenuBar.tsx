import { Wifi } from 'lucide-react'
import { getMinutes, useTimeStore } from '../../stores/time'

interface MacMenuBarProps { appName: string; isReady: boolean }

export default function MacMenuBar({ appName, isReady }: MacMenuBarProps) {
  const now = useTimeStore((state) => state.now)
  const date = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(now)
  const time = `${String(now.getHours()).padStart(2, '0')}:${getMinutes(now)}`
  const app = appName === 'Claude' ? 'Terminal' : appName === 'Settings' ? 'System Settings' : appName

  return (
    <div className="mac-menu-bar flex items-center justify-between font-medium text-white" aria-label="macOS menu bar">
      <div className="mac-menu-side mac-menu-left flex min-w-0 items-center">
        <img src="/images/apple-menu.svg" className="mac-menu-apple shrink-0" alt="Apple" draggable={false} />
        <span className="truncate font-semibold">{app}</span>
        <span className="mac-menu-items text-white/95" aria-hidden="true"><span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span></span>
      </div>
      <div className="mac-menu-side mac-menu-status flex shrink-0 items-center">
        <Wifi className="mac-menu-symbol" aria-label="Wi-Fi connected" />
        <img className="mac-menu-battery shrink-0 object-contain" src="/images/system/battery-full.webp" alt="Battery full" draggable={false} />
        <img className="mac-menu-control-center shrink-0 object-contain" src="/images/system/control-center.webp" alt="Control Center" draggable={false} />
        <span className="mac-menu-date whitespace-nowrap" suppressHydrationWarning>{isReady ? date : 'Oct 28'}</span>
        <span className="tabular-nums" suppressHydrationWarning>{isReady ? time : '13:26'}</span>
      </div>
    </div>
  )
}
