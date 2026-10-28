import { useEffect, useState } from 'react'
import * as Accordion from '@radix-ui/react-accordion'
import ReactMarkdown from 'react-markdown'
import { Plus, Shield, ShieldCheck, TriangleAlert } from 'lucide-react'
import { uiClasses } from '../../config/ui'

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
  questionLevel: 2 | 3
}

const badgeIcons = { privacy: Shield, refund: ShieldCheck, warning: TriangleAlert }

function isExternalLink(href?: string) {
  return href?.startsWith('http') || href?.startsWith('mailto:')
}

export default function FaqAccordion({ items, questionLevel }: Props) {
  const [expanded, setExpanded] = useState('')
  const Heading = questionLevel === 2 ? 'h2' : 'h3'
  useEffect(() => {
    const openAnchor = () => {
      const id = window.location.hash.slice(1)
      if (items.some((item) => item.id === id)) setExpanded(id)
    }
    openAnchor()
    window.addEventListener('hashchange', openAnchor)
    return () => window.removeEventListener('hashchange', openAnchor)
  }, [items])

  return (
    <Accordion.Root className="mt-12" type="single" collapsible value={expanded} onValueChange={setExpanded}>
      {items.map((item) => {
        const BadgeIcon = item.badge ? badgeIcons[item.badge] : null
        return (
        <Accordion.Item
          key={item.id}
          id={item.id}
          className="scroll-mt-40 border-b-2 border-stone-800/5 last:border-none dark:border-orange-50/10"
          value={item.id}
        >
          <Accordion.Header asChild>
            <Heading>
            <Accordion.Trigger className="group flex w-full items-start justify-between space-x-4 rounded-lg py-6 text-left outline-hidden focus-visible:ring-2 focus-visible:ring-rose-300">
              <span className="mt-1 shrink-0 text-stone-500 dark:text-[#8d8881]">
                <Plus className="size-5 group-data-[state=open]:rotate-45" aria-hidden="true" />
              </span>
              <span className="grow pr-6">
                <span className="text-2xl font-bold">{item.title}</span>
              </span>
              {BadgeIcon ? (
                <span className="flex pr-1.5 text-orange-500 dark:text-orange-75/50">
                  <BadgeIcon className="size-6" aria-hidden="true" />
                </span>
              ) : null}
            </Accordion.Trigger>
            </Heading>
          </Accordion.Header>
          <Accordion.Content forceMount className="faq-answer overflow-hidden data-[state=closed]:hidden">
            <div className="pb-7 pl-[38px] pr-6">
              <div className="space-y-3 text-xl">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p>{children}</p>,
                    a: ({ href, children }) => (
                      <a
                        className={uiClasses.contactLink}
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
