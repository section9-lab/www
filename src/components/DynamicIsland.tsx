import { useEffect, useMemo, useRef, useState } from 'react'
import { useIslandStore } from '../stores/island'

interface DynamicIslandProps {
  notchWidth?: number
  notchHeight?: number
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
                <svg className="size-[18px] fill-current" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path
                    className={`origin-[56%_50%] transition duration-300 ${isUnlocked ? '-scale-x-100' : ''}`}
                    d="M4.21913,6.85699 L5.46719,6.85699 L5.46719,4.60904 C5.46719,3.04945 6.46827,2.19354 7.66062,2.19354 C8.85055,2.19354 9.86619,3.04945 9.86619,4.60904 L9.86619,6.85699 L11.10875,6.85699 L11.10875,4.73287 C11.10875,2.27366 9.48122,1 7.66062,1 C5.8455,1 4.21913,2.27366 4.21913,4.73287 L4.21913,6.85699 Z"
                  />
                  <path
                    className={`origin-center transition duration-300 ${isUnlocked ? '-translate-x-px' : ''}`}
                    d="M4.54279,14.2793 L10.78394,14.2793 C11.79607,14.2793 12.3267,13.7365 12.3267,12.6438 L12.3267,7.92337 C12.3267,6.83432 11.79607,6.29701 10.78394,6.29701 L4.54279,6.29701 C3.529458,6.29701 3,6.83432 3,7.92337 L3,12.6438 C3,13.7365 3.529458,14.2793 4.54279,14.2793 Z"
                  />
                </svg>
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
                <svg className="size-5 -rotate-90" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle className="fill-transparent stroke-current stroke-2 text-green-300/30" r="6" cx="8" cy="8" strokeDasharray="38px" strokeDashoffset="0" />
                  <circle className="fill-transparent stroke-current stroke-2 text-green-300" r="6" cx="8" cy="8" strokeDasharray="38px" strokeDashoffset="14px" strokeLinecap="round" />
                </svg>
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
                    <svg className="size-4 fill-current text-orange-25/85" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
                      <path d="M8.55859 23.0898H11.2305C12.25 23.0898 12.7891 22.5508 12.7891 21.5195V5.55859C12.7891 4.49219 12.25 4 11.2305 4H8.55859C7.53906 4 7 4.53906 7 5.55859V21.5195C7 22.5508 7.53906 23.0898 8.55859 23.0898ZM17.0781 23.0898H19.7383C20.7695 23.0898 21.2969 22.5508 21.2969 21.5195V5.55859C21.2969 4.49219 20.7695 4 19.7383 4H17.0781C16.0469 4 15.5078 4.53906 15.5078 5.55859V21.5195C15.5078 22.5508 16.0469 23.0898 17.0781 23.0898Z" />
                    </svg>
                  </div>
                  <div className={`absolute inset-0 flex items-center justify-center pr-[9px] transition duration-400 ${isPlaying ? 'scale-0 opacity-0 blur-sm' : ''}`}>
                    <svg className="size-4 fill-current text-orange-25/85" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
                      <path d="M6.40625 23.8633C6.875 23.8633 7.27344 23.6758 7.74219 23.4062L21.4062 15.5078C22.3789 14.9336 22.7188 14.5586 22.7188 13.9375C22.7188 13.3164 22.3789 12.9414 21.4062 12.3789L7.74219 4.46875C7.27344 4.19922 6.875 4.02344 6.40625 4.02344C5.53906 4.02344 5 4.67969 5 5.69922V22.1758C5 23.1953 5.53906 23.8633 6.40625 23.8633Z" />
                    </svg>
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
                  <svg className="mr-0.5 size-[15px] fill-current text-stone-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
                    <path d="M20.797 7.166V2.914c0-.6-.486-.984-1.063-.871L13.92 3.309c-.724.159-1.12.555-1.12 1.188l.023 12.576c.057.554-.203.915-.701 1.017l-1.798.373C8.063 18.939 7 20.093 7 21.8c0 1.73 1.334 2.94 3.212 2.94 1.662 0 4.15-1.221 4.15-4.512V9.88c0-.6.113-.724.645-.837l5.168-1.13c.384-.08.622-.374.622-.747Z" />
                  </svg>
                  <span>{track?.name}</span>
                  <span className="mx-0.5 text-stone-600">&middot;</span>
                  <span>{track?.artist}</span>
                </div>
                <div className="absolute top-0 inline-flex shrink-0 items-center whitespace-nowrap px-1.5" style={{ animation: 'marquee-second var(--marquee-duration, 8s) linear infinite' }}>
                  <svg className="mr-0.5 size-[15px] fill-current text-stone-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
                    <path d="M20.797 7.166V2.914c0-.6-.486-.984-1.063-.871L13.92 3.309c-.724.159-1.12.555-1.12 1.188l.023 12.576c.057.554-.203.915-.701 1.017l-1.798.373C8.063 18.939 7 20.093 7 21.8c0 1.73 1.334 2.94 3.212 2.94 1.662 0 4.15-1.221 4.15-4.512V9.88c0-.6.113-.724.645-.837l5.168-1.13c.384-.08.622-.374.622-.747Z" />
                  </svg>
                  <span>{track?.name}</span>
                  <span className="mx-0.5 text-stone-600">&middot;</span>
                  <span>{track?.artist}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
