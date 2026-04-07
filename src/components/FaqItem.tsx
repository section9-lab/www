import { type ReactNode } from 'react'

interface FaqItemProps {
  title: string
  active: boolean
  onToggle: () => void
  children: ReactNode
  symbol?: ReactNode
}

export default function FaqItem({ title, active, onToggle, children, symbol }: FaqItemProps) {
  return (
    <div
      className="flex cursor-pointer select-none items-start justify-between space-x-4 border-b-2 border-stone-800/5 pb-7 pt-6 last:border-none dark:border-orange-50/10"
      onClick={onToggle}
    >
      <div className="mt-[5px] text-stone-500 dark:text-[#8d8881]">
        <svg className="size-[22px] fill-transparent stroke-current stroke-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
          <path
            className={`origin-center transition duration-300 ${active ? 'rotate-180' : ''}`}
            d="M19.5 12H4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            className={`origin-center transition duration-300 ${active ? 'rotate-90 scale-0' : ''}`}
            d="M12 4.5V19.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="grow pr-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div
          className={`grid cursor-auto transition-all duration-300 ${active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`row-[1/span_2] overflow-hidden text-xl transition duration-300 ${active ? 'delay-150' : 'opacity-0'}`}>
            <div className="mt-3 select-text space-y-3">
              {children}
            </div>
          </div>
        </div>
      </div>
      {symbol && (
        <div className="flex pr-1.5 text-orange-500 dark:text-orange-75/50">
          {symbol}
        </div>
      )}
    </div>
  )
}
