import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function GlobeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
    </svg>
  )
}

export function BatteryAlertIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4zM13 18h-2v-2h2v2zm0-4h-2V9h2v5z" />
    </svg>
  )
}

export function ContactCardIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <path d="M19.222 1C21.74 1 23 2.285 23 4.808v18.396C23 25.74 21.74 27 19.222 27H7.79C5.26 27 4 25.739 4 23.204V4.808C4 2.285 5.26 1 7.79 1zm-5.71 17.972c-4.254 0-6.247 3.42-6.247 4.717 0 .45.22.764.709.764h11.065c.501 0 .72-.315.72-.764 0-1.297-1.992-4.717-6.246-4.717m0-7.652c-1.723 0-3.106 1.492-3.106 3.287 0 1.928 1.383 3.37 3.107 3.382 1.723.012 3.105-1.455 3.105-3.383 0-1.794-1.382-3.285-3.105-3.286M10.37 3.571a.826.826 0 0 0-.83.813c0 .448.378.812.83.812h6.26c.464 0 .83-.364.83-.812a.82.82 0 0 0-.83-.813z" />
    </svg>
  )
}

export function WeatherSunIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <path d="M13.668 19.691c3.258 0 5.965-2.707 5.965-5.976 0-3.281-2.707-5.988-5.965-5.988s-5.965 2.707-5.965 5.988c0 3.27 2.707 5.976 5.965 5.976M13.68 5.56c.55 0 1.008-.457 1.008-1.02V2.02C14.688 1.458 14.23 1 13.68 1a1.02 1.02 0 0 0-1.02 1.02v2.52c0 .562.457 1.019 1.02 1.019m5.742 2.402a1.03 1.03 0 0 0 1.441 0l1.793-1.793a1.04 1.04 0 0 0 0-1.441 1.026 1.026 0 0 0-1.43 0L19.423 6.53a1.026 1.026 0 0 0 0 1.43m2.379 5.754c0 .55.469 1.008 1.02 1.008h2.519c.55 0 1.008-.457 1.008-1.008s-.457-1.02-1.008-1.02h-2.52c-.55 0-1.02.47-1.02 1.02m-2.38 5.754a1.026 1.026 0 0 0 0 1.43l1.806 1.816a1.05 1.05 0 0 0 1.43-.012 1.026 1.026 0 0 0 0-1.43l-1.805-1.804a1.05 1.05 0 0 0-1.43 0M13.68 21.87c-.563 0-1.02.457-1.02 1.008v2.531c0 .55.457 1.008 1.02 1.008.55 0 1.008-.457 1.008-1.008V22.88c0-.55-.458-1.008-1.008-1.008M7.926 19.47c-.399-.375-1.055-.375-1.442 0l-1.793 1.793a1.037 1.037 0 0 0-.011 1.43 1.064 1.064 0 0 0 1.441.011l1.793-1.805a1.037 1.037 0 0 0 .012-1.43m-2.38-5.754c0-.55-.468-1.02-1.019-1.02h-2.52c-.55 0-1.007.47-1.007 1.02s.457 1.008 1.008 1.008h2.52c.55 0 1.019-.457 1.019-1.008M7.915 7.96c.387-.375.387-1.043.012-1.43L6.133 4.727c-.387-.375-1.043-.387-1.43 0-.387.398-.387 1.054-.012 1.43L6.484 7.96a1.026 1.026 0 0 0 1.43 0" />
    </svg>
  )
}

export function CursorHintIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <path d="M5.06 3.024C4.804 1.238 6.858.052 8.276 1.168l17.117 13.466c1.47 1.159.688 3.522-1.182 3.574l-7.03.19a1.998 1.998 0 0 0-1.65.953l-3.68 5.993c-.98 1.594-3.418 1.089-3.685-.764L5.06 3.024Z" />
    </svg>
  )
}

export function IslandLockIcon(props: IconProps & { unlocked?: boolean }) {
  const { unlocked = false, ...rest } = props
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...rest}>
      <path
        className={`origin-[56%_50%] transition duration-300 ${unlocked ? '-scale-x-100' : ''}`}
        d="M4.21913,6.85699 L5.46719,6.85699 L5.46719,4.60904 C5.46719,3.04945 6.46827,2.19354 7.66062,2.19354 C8.85055,2.19354 9.86619,3.04945 9.86619,4.60904 L9.86619,6.85699 L11.10875,6.85699 L11.10875,4.73287 C11.10875,2.27366 9.48122,1 7.66062,1 C5.8455,1 4.21913,2.27366 4.21913,4.73287 L4.21913,6.85699 Z"
      />
      <path
        className={`origin-center transition duration-300 ${unlocked ? '-translate-x-px' : ''}`}
        d="M4.54279,14.2793 L10.78394,14.2793 C11.79607,14.2793 12.3267,13.7365 12.3267,12.6438 L12.3267,7.92337 C12.3267,6.83432 11.79607,6.29701 10.78394,6.29701 L4.54279,6.29701 C3.529458,6.29701 3,6.83432 3,7.92337 L3,12.6438 C3,13.7365 3.529458,14.2793 4.54279,14.2793 Z"
      />
    </svg>
  )
}

export function StatusRingIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" {...props}>
      <circle className="fill-transparent stroke-current stroke-2 text-green-300/30" r="6" cx="8" cy="8" strokeDasharray="38px" strokeDashoffset="0" />
      <circle className="fill-transparent stroke-current stroke-2 text-green-300" r="6" cx="8" cy="8" strokeDasharray="38px" strokeDashoffset="14px" strokeLinecap="round" />
    </svg>
  )
}

export function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <path d="M8.55859 23.0898H11.2305C12.25 23.0898 12.7891 22.5508 12.7891 21.5195V5.55859C12.7891 4.49219 12.25 4 11.2305 4H8.55859C7.53906 4 7 4.53906 7 5.55859V21.5195C7 22.5508 7.53906 23.0898 8.55859 23.0898ZM17.0781 23.0898H19.7383C20.7695 23.0898 21.2969 22.5508 21.2969 21.5195V5.55859C21.2969 4.49219 20.7695 4 19.7383 4H17.0781C16.0469 4 15.5078 4.53906 15.5078 5.55859V21.5195C15.5078 22.5508 16.0469 23.0898 17.0781 23.0898Z" />
    </svg>
  )
}

export function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <path d="M6.40625 23.8633C6.875 23.8633 7.27344 23.6758 7.74219 23.4062L21.4062 15.5078C22.3789 14.9336 22.7188 14.5586 22.7188 13.9375C22.7188 13.3164 22.3789 12.9414 21.4062 12.3789L7.74219 4.46875C7.27344 4.19922 6.875 4.02344 6.40625 4.02344C5.53906 4.02344 5 4.67969 5 5.69922V22.1758C5 23.1953 5.53906 23.8633 6.40625 23.8633Z" />
    </svg>
  )
}

export function MusicNoteIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...props}>
      <path d="M20.797 7.166V2.914c0-.6-.486-.984-1.063-.871L13.92 3.309c-.724.159-1.12.555-1.12 1.188l.023 12.576c.057.554-.203.915-.701 1.017l-1.798.373C8.063 18.939 7 20.093 7 21.8c0 1.73 1.334 2.94 3.212 2.94 1.662 0 4.15-1.221 4.15-4.512V9.88c0-.6.113-.724.645-.837l5.168-1.13c.384-.08.622-.374.622-.747Z" />
    </svg>
  )
}

export function PlusToggleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        className="origin-center transition duration-300 group-data-[state=open]:rotate-180"
        d="M19.5 12H4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="origin-center transition duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:scale-0"
        d="M12 4.5V19.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function FaqBadgeIcon(props: IconProps & { path: string }) {
  const { path, ...rest } = props
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" {...rest}>
      <path d={path} />
    </svg>
  )
}
