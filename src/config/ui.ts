export const uiClasses = {
  focusRing: 'outline-hidden transition duration-300 focus:ring-2 focus:ring-rose-300/90',
  softSurface: 'bg-orange-950/5 dark:bg-orange-75/5',
  primarySurface:
    "text-orange-75 bg-stone-800 shadow-xl shadow-orange-950/20 after:absolute after:inset-0 after:hidden after:rounded-2xl after:shadow-2xl after:shadow-orange-950/25 after:content-[''] sm:shadow-orange-950/25 sm:after:block",
  glowHover: 'shadow-brand-glow hover:shadow-brand-glow-strong',
  glowHoverStrong: 'hover:shadow-brand-glow-strong',
  socialButton:
    'group inline-flex size-10 items-center justify-center rounded-xl p-2 text-orange-950/50 hover:bg-orange-950/5 hover:text-orange-950/75 dark:text-orange-75 dark:hover:text-orange-75',
  contactLink:
    "relative font-medium whitespace-nowrap outline-hidden transition duration-200 after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:rounded-xs after:bg-teal-400 after:transition after:duration-200 after:content-[''] hover:text-teal-400 hover:after:translate-y-px",
} as const
