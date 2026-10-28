import { AudioLines, BatteryCharging, MessagesSquare, Paperclip, SlidersHorizontal, Wifi } from 'lucide-react'
import { agents } from '../../config/demo'
import { getMinutes, useTimeStore } from '../../stores/time'

interface MacMenuBarProps { appName: string; isReady: boolean }

export default function MacMenuBar({ appName, isReady }: MacMenuBarProps) {
  const now = useTimeStore((state) => state.now)
  const date = `${now.getMonth() + 1}月${now.getDate()}日`
  const time = `${String(now.getHours()).padStart(2, '0')}:${getMinutes(now)}`
  const app = appName === 'Finder' ? '访达' : appName === 'Claude' ? '终端' : appName === 'Settings' ? '系统设置' : appName

  return (
    <div className="mac-menu-bar flex items-center justify-between font-medium text-white" aria-label="macOS menu bar">
      <div className="mac-menu-side mac-menu-left flex min-w-0 items-center">
        <img src="/images/apple-menu.svg" className="mac-menu-apple shrink-0" alt="Apple" draggable={false} />
        <span className="truncate font-semibold">{app}</span>
        <span className="mac-menu-items text-white/95" aria-hidden="true"><span>文件</span><span>编辑</span><span>视图</span><span>窗口</span><span>帮助</span></span>
      </div>
      <div className="mac-menu-side mac-menu-status flex shrink-0 items-center">
        <span className="mac-menu-extras items-center" aria-hidden="true"><Paperclip /><MessagesSquare /><img src={agents.codex.icon} alt="" /><AudioLines /></span>
        <Wifi className="mac-menu-symbol" aria-label="Wi-Fi connected" />
        <BatteryCharging className="mac-menu-battery text-yellow-100" aria-label="Battery charging" />
        <SlidersHorizontal className="mac-menu-symbol" aria-label="Control Center" />
        <span className="mac-menu-date whitespace-nowrap" suppressHydrationWarning>{isReady ? date : '10月28日'}</span>
        <span className="tabular-nums" suppressHydrationWarning>{isReady ? time : '13:26'}</span>
      </div>
    </div>
  )
}
