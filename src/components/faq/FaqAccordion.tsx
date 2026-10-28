import * as Accordion from '@radix-ui/react-accordion'
import ReactMarkdown from 'react-markdown'
import { Plus, Shield, ShieldCheck, TriangleAlert } from 'lucide-react'

type Badge = 'privacy' | 'refund' | 'warning'

interface FaqItem {
  id: string
  title: string
  badge?: Badge
  notes?: string[]
  body: string
}

interface Props {
  items: FaqItem[]
}

const LINK_CLASS =
  "relative font-medium whitespace-nowrap outline-hidden transition duration-200 after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:rounded-xs after:bg-teal-400 after:transition after:duration-200 after:content-[''] hover:text-teal-400 hover:after:translate-y-px"

const badgeIcons = { privacy: Shield, refund: ShieldCheck, warning: TriangleAlert }

function isExternalLink(href?: string) {
  return href?.startsWith('http') || href?.startsWith('mailto:')
}

export default function FaqAccordion({ items }: Props) {
  return (
    <Accordion.Root className="mt-12" type="single" collapsible>
      {items.map((item) => {
        const BadgeIcon = item.badge ? badgeIcons[item.badge] : null
        return (
        <Accordion.Item
          key={item.id}
          className="border-b-2 border-stone-800/5 last:border-none dark:border-orange-50/10"
          value={item.id}
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start justify-between space-x-4 rounded-lg py-6 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-rose-300">
              <div className="mt-[5px] text-stone-500 dark:text-[#8d8881]">
                <Plus className="size-5 group-data-[state=open]:rotate-45" aria-hidden="true" />
              </div>
              <div className="grow pr-6">
                <h2 className="text-2xl font-bold">{item.title}</h2>
              </div>
              {BadgeIcon ? (
                <div className="flex pr-1.5 text-orange-500 dark:text-orange-75/50">
                  <BadgeIcon className="size-6" aria-hidden="true" />
                </div>
              ) : null}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden">
            <div className="pb-7 pl-[38px] pr-6">
              <div className="space-y-3 text-xl">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p>{children}</p>,
                    a: ({ href, children }) => (
                      <a
                        className={LINK_CLASS}
                        href={href}
                        target={isExternalLink(href) ? '_blank' : undefined}
                        rel={isExternalLink(href) ? 'noopener noreferrer' : undefined}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {item.body}
                </ReactMarkdown>
                {item.notes?.map((note) => (
                  <p key={note} className="text-stone-500 dark:text-orange-75/50">
                    {note}
                  </p>
                ))}
              </div>
            </div>
          </Accordion.Content>
        </Accordion.Item>
      )})}
    </Accordion.Root>
  )
}
