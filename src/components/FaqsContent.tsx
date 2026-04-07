import { useState } from 'react'
import FaqItem from './FaqItem'

const LINK_CLASS = "relative font-medium whitespace-nowrap outline-hidden transition duration-200 after:pointer-events-none after:absolute after:right-0 after:bottom-0 after:left-0 after:h-0.5 after:rounded-xs after:bg-teal-400 after:transition after:duration-200 after:content-[''] hover:text-teal-400 hover:after:translate-y-px"

const SHIELD = 'M13.586 25.66c.187 0 .48-.07.773-.223 6.668-3.492 8.813-5.238 8.813-9.445V7.156c0-1.207-.516-1.593-1.5-2.004-1.371-.562-5.754-2.156-7.113-2.625a3.081 3.081 0 0 0-.973-.164c-.328 0-.656.07-.961.164-1.371.446-5.754 2.075-7.125 2.625-.973.399-1.5.797-1.5 2.004v8.836c0 4.207 2.262 5.754 8.813 9.445.304.165.585.223.773.223Z'

interface FaqEntry {
  name: string
  title: string
  content: React.ReactNode
  symbol?: string
}

const faqs: FaqEntry[] = [
  {
    name: 'bugs',
    title: 'What should I do if I encounter a bug?',
     content: <p>You may report any issue you encounter with Dyno by simply creating a <a className={LINK_CLASS} href="https://github.com/henrikruscon/dyno-releases/issues/new?assignees=&labels=bug&projects=&template=bug_report.yml" rel="noopener noreferrer" target="_blank" aria-label="Bug report">bug report</a> or by contacting us.</p>,
  },
  {
    name: 'like',
    title: 'Why is the like button disabled?',
     content: <><p>Unfortunately, Spotify has disabled the ability to like songs. It's unclear if or when this feature will be restored. If restored, Dyno should support it without any updates or changes.</p><p className="dark:text-orange-75/50 text-stone-500">Please don't purchase Dyno solely for this feature.</p></>,
  },
  {
    name: 'waveform',
    title: 'Why is the waveform simulated?',
    content: <><p>Unfortunately, real-time waveforms are too demanding to render efficiently.</p><p className="dark:text-orange-75/50 text-stone-500">Apple also uses simulated waveforms in macOS.</p></>,
  },
  {
    name: 'icon',
    title: 'How do I hide the menu bar icon?',
    content: <p>Since macOS Tahoe, you may hide it natively under Menu Bar options in System Settings.</p>,
  },
  {
    name: 'devices',
    title: 'How many devices per license?',
    content: <p>You may use your license on up to 3 devices simultaneously. You may also deactivate a specific device at any time through the settings.</p>,
  },
  {
    name: 'remove',
    title: 'How can I remove a device?',
    content: <><p>You may remove any unwanted device through the license tab in settings.</p><p className="dark:text-orange-75/50 text-stone-500">Please reach out if you want to fully reset your license.</p></>,
  },
  {
    name: 'recover',
    title: 'How can I recover my license?',
    content: <p>You may recover your license by visiting the <a className={LINK_CLASS} href="/recover" aria-label="Recover your license">recovery</a> page.</p>,
  },
  {
    name: 'purchase',
    title: 'Are future updates included?',
    content: <><p>Yes, Dyno is a one-time purchase, and all future updates are included.</p><p className="dark:text-orange-75/50 text-stone-500">You only pay once.</p></>,
  },
  {
    name: 'trial',
    title: 'Can I try Dyno before I buy it?',
    content: <><p>Yes, there's a limited 72h trial available for Dyno. Visit the <a className={LINK_CLASS} href="/download" aria-label="Download for Mac">download</a> page to get started with your trial.</p><p className="dark:text-orange-75/50 text-stone-500">You may request a reset of your trial at any time.</p></>,
  },
  {
    name: 'discount',
    title: 'Can I get a discount?',
    content: <><p>Unfortunately, there are no available discounts for Dyno.</p><p className="dark:text-orange-75/50 text-stone-500">Dyno is focused on long-term value and continuous updates.</p></>,
  },
  {
    name: 'refund',
    title: 'May I request a refund?',
    symbol: `${SHIELD}m-4.36-7.3v-4.805c0-.856.352-1.278 1.055-1.325v-1.418c0-2.226 1.336-3.726 3.305-3.726s3.305 1.5 3.305 3.726v1.418c.703.047 1.054.47 1.054 1.325v4.804c0 .903-.398 1.325-1.23 1.325h-6.258c-.832 0-1.23-.422-1.23-1.325Zm2.32-6.141h4.079v-1.547c0-1.418-.82-2.356-2.04-2.356-1.218 0-2.038.938-2.038 2.356v1.547Z`,
    content: <><p>Yes, you may request a full refund within 14 days of your original purchase.</p><p className="dark:text-orange-75/50 text-stone-500">No reason required.</p></>,
  },
  {
    name: 'indefinitely',
    title: 'Will Dyno work indefinitely?',
    symbol: `${SHIELD}Zm0-9.902c-.61 0-.938-.34-.95-.961l-.163-6.387c-.012-.62.445-1.066 1.101-1.066.645 0 1.125.457 1.114 1.078l-.165 6.375c-.011.633-.351.96-.937.96Zm0 3.926c-.703 0-1.313-.563-1.313-1.254 0-.692.598-1.266 1.313-1.266s1.312.563 1.312 1.266c0 .703-.609 1.254-1.312 1.254Z`,
    content: <><p>Dyno relies on private APIs that have remained functional for years. However, Apple could choose to modify or remove them without providing an alternative. As a result, Dyno is sold "as is", with no guarantee that its functionality will remain available indefinitely.</p><p className="dark:text-orange-75/50 text-stone-500">Dyno reserves the right to adapt or change in response to Apple.</p></>,
  },
  {
    name: 'privacy',
    title: 'Does Dyno collect any data?',
    symbol: `${SHIELD}Zm-4.36-7.3v-4.805c0-.856.352-1.278 1.055-1.325v-1.418c0-2.226 1.336-3.726 3.305-3.726s3.305 1.5 3.305 3.726v1.418c.703.047 1.054.47 1.054 1.325v4.804c0 .903-.398 1.325-1.23 1.325h-6.258c-.832 0-1.23-.422-1.23-1.325Zm2.32-6.141h4.079v-1.547c0-1.418-.82-2.356-2.04-2.356-1.218 0-2.038.938-2.038 2.356v1.547Z`,
    content: <p>No data or personal information is collected by Dyno. This is corroborated in the <a className={LINK_CLASS} href="/privacy" aria-label="Privacy policy">privacy policy</a>.</p>,
  },
]

export default function FaqsContent() {
  const [activeItem, setActiveItem] = useState<string | null>(null)

  const toggleItem = (name: string) => {
    setActiveItem((prev) => (prev === name ? null : name))
  }

  return (
    <div className="mb-0 w-full max-w-screen-md sm:mb-6">
      <h1 className="mb-3 text-6xl font-bold sm:text-8xl">FAQs</h1>

      <div>
        <p className="group dark:text-orange-75/50 flex items-center text-xl text-stone-500">
          <svg className="mr-2 size-[22px] fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
            <path d="M7.63281 26.125H20.0781C22.5039 26.125 23.7109 24.8945 23.7109 22.457V11.8164H15.2266C13.7266 11.8164 13.0117 11.1016 13.0117 9.60156V1H7.63281C5.21875 1 4 2.24219 4 4.67969V22.457C4 24.9062 5.20703 26.125 7.63281 26.125ZM15.2617 10.2109H23.5703C23.5 9.73047 23.1602 9.26172 22.5977 8.6875L16.1406 2.11328C15.5898 1.55078 15.1094 1.21094 14.6172 1.12891V9.57812C14.6172 10 14.8281 10.2109 15.2617 10.2109Z" />
            <path className="text-orange-75 stroke-current group-hover:-translate-y-[4.45px] group-hover:opacity-0 group-hover:transition group-hover:duration-300 dark:text-stone-900" d="M9.25 16.15H18.5" strokeWidth="2" strokeLinecap="round" />
            <path className="text-orange-75 stroke-current group-hover:-translate-y-[4.45px] group-hover:transition group-hover:duration-300 dark:text-stone-900" d="M9.25 20.6H18.5" strokeWidth="2" strokeLinecap="round" />
            <path className="text-orange-75 stroke-current opacity-0 group-hover:opacity-100 group-hover:transition-all group-hover:delay-75 group-hover:duration-500 group-hover:[stroke-dashoffset:0] dark:text-stone-900" d="M9.25 20.6H18.5" strokeWidth="2" strokeLinecap="round" strokeDasharray="10" strokeDashoffset="10" />
          </svg>
          <span>Updated March 2026</span>
        </p>
      </div>

      <div className="mt-12">
        {faqs.map((item) => (
          <FaqItem
            key={item.name}
            title={item.title}
            active={activeItem === item.name}
            onToggle={() => toggleItem(item.name)}
            symbol={item.symbol ? (
              <svg className="size-[30px] fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 28" aria-hidden="true">
                <path d={item.symbol} />
              </svg>
            ) : undefined}
          >
            {item.content}
          </FaqItem>
        ))}

        <div className="mt-12 pt-6">
          <h3 className="mb-3 text-2xl font-bold">Have more questions?</h3>
          <p className="text-xl">
            If you have any additional questions, do not hesitate to{' '}
            <a className={LINK_CLASS} href="mailto:hello@bud.dyno.app" aria-label="Contact us">contact us</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
