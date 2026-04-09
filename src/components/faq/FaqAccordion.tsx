import * as Accordion from '@radix-ui/react-accordion'
import ReactMarkdown from 'react-markdown'
import { FaqBadgeIcon, PlusToggleIcon } from '../icons/react'

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

const SHIELD =
  'M13.586 25.66c.187 0 .48-.07.773-.223 6.668-3.492 8.813-5.238 8.813-9.445V7.156c0-1.207-.516-1.593-1.5-2.004-1.371-.562-5.754-2.156-7.113-2.625a3.081 3.081 0 0 0-.973-.164c-.328 0-.656.07-.961.164-1.371.446-5.754 2.075-7.125 2.625-.973.399-1.5.797-1.5 2.004v8.836c0 4.207 2.262 5.754 8.813 9.445.304.165.585.223.773.223Z'

const BADGE_PATHS: Record<Badge, string> = {
  refund:
    `${SHIELD}m-4.36-7.3v-4.805c0-.856.352-1.278 1.055-1.325v-1.418c0-2.226 1.336-3.726 3.305-3.726s3.305 1.5 3.305 3.726v1.418c.703.047 1.054.47 1.054 1.325v4.804c0 .903-.398 1.325-1.23 1.325h-6.258c-.832 0-1.23-.422-1.23-1.325Zm2.32-6.141h4.079v-1.547c0-1.418-.82-2.356-2.04-2.356-1.218 0-2.038.938-2.038 2.356v1.547Z`,
  warning:
    `${SHIELD}Zm0-9.902c-.61 0-.938-.34-.95-.961l-.163-6.387c-.012-.62.445-1.066 1.101-1.066.645 0 1.125.457 1.114 1.078l-.165 6.375c-.011.633-.351.96-.937.96Zm0 3.926c-.703 0-1.313-.563-1.313-1.254 0-.692.598-1.266 1.313-1.266s1.312.563 1.312 1.266c0 .703-.609 1.254-1.312 1.254Z`,
  privacy:
    `${SHIELD}Zm-4.36-7.3v-4.805c0-.856.352-1.278 1.055-1.325v-1.418c0-2.226 1.336-3.726 3.305-3.726s3.305 1.5 3.305 3.726v1.418c.703.047 1.054.47 1.054 1.325v4.804c0 .903-.398 1.325-1.23 1.325h-6.258c-.832 0-1.23-.422-1.23-1.325Zm2.32-6.141h4.079v-1.547c0-1.418-.82-2.356-2.04-2.356-1.218 0-2.038.938-2.038 2.356v1.547Z`,
}

function isExternalLink(href?: string) {
  return href?.startsWith('http') || href?.startsWith('mailto:')
}

export default function FaqAccordion({ items }: Props) {
  return (
    <Accordion.Root className="mt-12" type="single" collapsible>
      {items.map((item) => (
        <Accordion.Item
          key={item.id}
          className="border-b-2 border-stone-800/5 last:border-none dark:border-orange-50/10"
          value={item.id}
        >
          <Accordion.Header>
            <Accordion.Trigger className="group flex w-full items-start justify-between space-x-4 py-6 text-left outline-hidden">
              <div className="mt-[5px] text-stone-500 dark:text-[#8d8881]">
                <PlusToggleIcon className="size-[22px] fill-transparent stroke-current stroke-2" />
              </div>
              <div className="grow pr-6">
                <h2 className="text-2xl font-bold">{item.title}</h2>
              </div>
              {item.badge ? (
                <div className="flex pr-1.5 text-orange-500 dark:text-orange-75/50">
                  <FaqBadgeIcon className="size-[30px] fill-current" path={BADGE_PATHS[item.badge]} />
                </div>
              ) : null}
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
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
      ))}
    </Accordion.Root>
  )
}
