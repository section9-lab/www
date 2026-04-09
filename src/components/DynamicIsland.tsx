import { useEffect, useMemo, useRef, useState } from 'react'
import {
  IslandLockIcon,
  MusicNoteIcon,
  PauseIcon,
  PlayIcon,
  StatusRingIcon,
} from './icons/react'
import { useIslandStore } from '../stores/island'

interface DynamicIslandProps {
  notchWidth?: number
  notchHeight?: number
}

interface MarqueeTrackInfoProps {
  name?: string
  artist?: string
}

function MarqueeTrackInfo({ name, artist }: MarqueeTrackInfoProps) {
  return (
    <>
      <MusicNoteIcon className="mr-0.5 size-[15px] fill-current text-stone-600" />
      <span>{name}</span>
      <span className="mx-0.5 text-stone-600">&middot;</span>
      <span>{artist}</span>
    </>
  )
}

export default function DynamicIsland({
  notchWidth = 136,
  notchHeight = 40,
}: DynamicIslandProps) {
  const track = useIslandStore((state) => state.getTrack())
  const tracks = useIslandStore((state) => state.tracks)
  const isFlipped = useIslandStore((state) => state.isFlipped)
  const isPlaying = useIslandStore((state) => state.isPlaying)
  const hasQuickPeek = useIslandStore((state) => state.hasQuickPeek)
  const isUnlocked = useIslandStore((state) => state.isUnlocked)
  const liveActivityType = useIslandStore((state) => state.liveActivityType)
  const notificationType = useIslandStore((state) => state.notificationType)
  const toggle = useIslandStore((state) => state.toggle)
  const toggleQuickPeek = useIslandStore((state) => state.toggleQuickPeek)

  const [isElevated, setIsElevated] = useState(false)
  const marqueeRef = useRef<HTMLDivElement>(null)
  const [marqueeDuration, setMarqueeDuration] = useState('8s')

  useEffect(() => {
    if (!hasQuickPeek || !marqueeRef.current) return
    const frame = requestAnimationFrame(() => {
      const firstChild = marqueeRef.current?.children[0] as HTMLElement | undefined
      if (!firstChild) return
      setMarqueeDuration(`${firstChild.scrollWidth / 30}s`)
    })
    return () => cancelAnimationFrame(frame)
  }, [hasQuickPeek, track?.name, track?.artist])

  const barStyle = useMemo(() => {
    if (!track) return {}
    return {
      backgroundImage: `linear-gradient(to bottom, ${track.colors[0]}, ${track.colors[1]})`,
    }
  }, [track])

  const notchStyle = {
    width: notificationType || liveActivityType ? notchWidth + 74 : notchWidth,
    height: hasQuickPeek ? notchHeight + 32 : notchHeight,
    borderRadius: hasQuickPeek ? '13px 13px 19px 19px' : '12px',
    transition:
      'width 0.35s cubic-bezier(0.34,1.2,0.64,1), height 0.35s cubic-bezier(0.34,1.2,0.64,1), border-radius 0.25s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    transform: isElevated && !hasQuickPeek ? 'scale(1.075)' : 'scale(1)',
  } as const

  const innerStyle = {
    borderRadius: isElevated && !hasQuickPeek ? '13px' : '12px',
    transition: 'border-radius 0.25s ease',
  } as const

  const peekStyle = {
    opacity: hasQuickPeek ? 1 : 0,
    filter: hasQuickPeek ? 'blur(0)' : 'blur(10px)',
    transform: hasQuickPeek ? 'scaleX(1)' : 'scaleX(0.75)',
    transition: 'opacity 0.25s ease, filter 0.25s ease, transform 0.25s ease',
    maskImage:
      'linear-gradient(to left, rgba(0,0,0,0) 7%, rgba(0,0,0,1) 11%, rgba(0,0,0,1) 89%, rgba(0,0,0,0) 93%)',
    WebkitMaskImage:
      'linear-gradient(to left, rgba(0,0,0,0) 7%, rgba(0,0,0,1) 11%, rgba(0,0,0,1) 89%, rgba(0,0,0,0) 93%)',
  } as const

  return (
    <div
      className="select-none"
      style={{ transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}
      onMouseEnter={() => {
        if (!hasQuickPeek) setIsElevated(true)
      }}
      onMouseLeave={() => {
        if (!hasQuickPeek) setIsElevated(false)
      }}
      onMouseDown={(event) => {
        const target = event.currentTarget
        target.style.transform = 'scale(0.94)'
      }}
      onMouseUp={(event) => {
        const target = event.currentTarget
        target.style.transform = 'scale(1)'
      }}
    >
      <div
        className={`relative flex origin-top overflow-hidden rounded-xl text-orange-25 ${
          isElevated && !hasQuickPeek ? 'shadow-[0_2px_16px_0_rgba(12,10,9,0.25)]' : ''
        }`}
        style={notchStyle}
      >
        <div className="h-full w-full rounded-xl bg-stone-950" style={innerStyle}>
          <div className="absolute left-0 top-0 flex h-10 items-center">
            {notificationType === 'didConnectAirPods' ? (
              <div className="flex h-full items-center pb-0.5 pl-1.5 transition-all duration-300">
                <video className="size-8" autoPlay loop muted playsInline>
                  <source src="/videos/airpods-pro.mp4" type="video/mp4" />
                </video>
              </div>
            ) : null}

            {liveActivityType === 'isLocked' ? (
              <div className="pl-2.5 transition-all duration-300">
                <IslandLockIcon className="size-[18px] fill-current" unlocked={isUnlocked} />
              </div>
            ) : null}

            {liveActivityType === 'isPlaying' ? (
              <div className={`origin-[20%_0%] pl-[9px] transition duration-300 ${hasQuickPeek ? 'scale-[1.20]' : ''}`}>
                <div className={`ease transition duration-500 ${isFlipped ? '-scale-x-100' : ''}`}>
                  <div className={`ease transition duration-500 ${isFlipped ? '-scale-x-100' : ''}`}>
                    <button
                      type="button"
                      className={`ease size-[22px] cursor-pointer rounded-md bg-cover transition-all duration-150 ${!isPlaying ? 'scale-[0.85] opacity-60' : ''}`}
                      style={track ? { backgroundImage: `url(${track.album_art})` } : { backgroundColor: '#333' }}
                      onMouseEnter={() => toggleQuickPeek(true)}
                      onMouseLeave={() => toggleQuickPeek(false)}
                      onMouseUp={() => {
                        if (track?.url && track.url !== '#') window.open(track.url, '_blank', 'noopener,noreferrer')
                      }}
                      aria-label={track ? `Open ${track.name}` : 'Open track'}
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="absolute right-0 top-0 flex h-10 items-center">
            {notificationType === 'didConnectAirPods' ? (
              <div className="pr-2.5 transition-all duration-300">
                <StatusRingIcon className="size-5 -rotate-90" />
              </div>
            ) : null}

            {liveActivityType === 'isPlaying' ? (
              <div className="group relative pr-[9px] transition-all duration-300">
                <button
                  type="button"
                  className="absolute inset-0 z-10 cursor-pointer opacity-0 group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation()
                    toggle()
                  }}
                  aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                >
                  <div className={`absolute inset-0 flex items-center justify-center pr-[9px] transition duration-400 ${!isPlaying ? 'scale-0 opacity-0 blur-sm' : ''}`}>
                    <PauseIcon className="size-4 fill-current text-orange-25/85" />
                  </div>
                  <div className={`absolute inset-0 flex items-center justify-center pr-[9px] transition duration-400 ${isPlaying ? 'scale-0 opacity-0 blur-sm' : ''}`}>
                    <PlayIcon className="size-4 fill-current text-orange-25/85" />
                  </div>
                </button>

                <div className="flex w-5 items-center justify-center space-x-[1.5px] brightness-110 group-hover:scale-125 group-hover:blur-[3.5px] group-hover:brightness-125 group-hover:saturate-150">
                  {['0.95s', '1.46s', '0.82s', '1.24s'].map((duration) => (
                    <div
                      key={duration}
                      className={`ease size-0.5 rounded-[1px] transition-all duration-500 ${isPlaying ? '' : '!max-h-[2px]'}`}
                      style={{
                        ...barStyle,
                        maxHeight: '20px',
                        animation: isPlaying ? `playing ${duration} ease infinite` : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div
            className="pointer-events-none absolute bottom-0 left-0 right-0 flex origin-top justify-center pb-[11px] text-xs font-semibold text-stone-300/85"
            style={peekStyle}
          >
            {tracks.length > 0 ? (
              <div ref={marqueeRef} className="relative flex overflow-hidden" style={{ ['--marquee-duration' as string]: marqueeDuration }}>
                <div className="inline-flex shrink-0 items-center whitespace-nowrap px-1.5" style={{ animation: 'marquee-first var(--marquee-duration, 8s) linear infinite' }}>
                  <MarqueeTrackInfo name={track?.name} artist={track?.artist} />
                </div>
                <div className="absolute top-0 inline-flex shrink-0 items-center whitespace-nowrap px-1.5" style={{ animation: 'marquee-second var(--marquee-duration, 8s) linear infinite' }}>
                  <MarqueeTrackInfo name={track?.name} artist={track?.artist} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
