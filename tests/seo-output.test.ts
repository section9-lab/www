import { describe, expect, it } from 'vitest'
import { siteConfig } from '../src/config/site'
import { purchasePolicy } from '../src/config/purchase'

// Run after `pnpm build`: inspect emitted HTML, not component implementation.
const files = import.meta.glob<string>('/dist/**/*.{html,xml,txt}', { query: '?raw', import: 'default', eager: true })
const imageFiles = import.meta.glob('/dist/images/guides/*.webp', { query: '?url', import: 'default', eager: true })
const outputFile = (pathname: string) => `/dist${pathname}index.html`
const xml = new DOMParser().parseFromString(files['/dist/sitemap.xml'] ?? '', 'application/xml')
const urls = [...xml.querySelectorAll('loc')].map((node) => new URL(node.textContent ?? ''))
const pages = urls.map((url) => {
  const html = files[outputFile(url.pathname)] ?? ''
  return { url, html, document: new DOMParser().parseFromString(html, 'text/html') }
})

describe('production SEO output', () => {
  it('publishes each sitemap page with one canonical, H1, and unique metadata', () => {
    expect(pages.length).toBeGreaterThanOrEqual(11)
    const titles = new Set<string>()
    const descriptions = new Set<string>()
    for (const page of pages) {
      expect(page.url.origin).toBe(siteConfig.siteUrl)
      expect(page.url.pathname.endsWith('/')).toBe(true)
      expect(page.document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
      expect(page.document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(page.url.href)
      expect(page.document.querySelector('meta[property="og:url"]')?.getAttribute('content')).toBe(page.url.href)
      expect(page.document.querySelectorAll('main h1')).toHaveLength(1)
      const title = page.document.title
      const description = page.document.querySelector('meta[name="description"]')?.getAttribute('content') ?? ''
      expect(title.length).toBeGreaterThan(10)
      expect(description.length).toBeGreaterThan(40)
      expect(titles.has(title)).toBe(false)
      expect(descriptions.has(description)).toBe(false)
      titles.add(title)
      descriptions.add(description)
      expect(page.html).not.toContain('section9lab.cn')
      expect(page.document.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('index, follow')
    }
  })

  it('renders English page content across all published pages', () => {
    for (const page of pages) {
      const body = page.document.body.cloneNode(true) as HTMLElement
      body.querySelectorAll('script, style').forEach((node) => node.remove())
      expect(body.textContent, page.url.pathname).not.toMatch(/[\u3400-\u9fff]/)
      for (const element of body.querySelectorAll('[aria-label], img[alt]')) {
        expect(element.getAttribute('aria-label') ?? element.getAttribute('alt') ?? '', page.url.pathname).not.toMatch(/[\u3400-\u9fff]/)
      }
    }
  })

  it('helps readers find agent guides and identifies illustrative images', () => {
    const home = pages.find((page) => page.url.pathname === '/')
    expect(home?.document.title).toContain('Claude Code & Codex')
    expect(home?.document.querySelector('main')?.textContent).toContain('Claude Code, Codex')
    for (const slug of ['claude-code', 'codex']) {
      const guide = pages.find((page) => page.url.pathname === `/docs/${slug}/`)
      expect(guide?.document.querySelector('main')?.textContent).toContain('sample sessions')
      const figures = guide?.document.querySelectorAll('main figure') ?? []
      expect(figures.length).toBeGreaterThanOrEqual(2)
      for (const figure of figures) {
        const image = figure.querySelector('img')
        const src = image?.getAttribute('src') ?? ''
        expect(src.startsWith('/images/guides/')).toBe(true)
        expect(imageFiles[`/dist${src}`], src).toBeDefined()
        expect(image?.getAttribute('alt')?.length).toBeGreaterThan(20)
        expect(figure.querySelector('figcaption')?.textContent).toMatch(/simulated|sample sessions/i)
      }
    }
  })

  it('labels distinct download and checkout clicks without treating them as purchases', () => {
    const home = pages.find((page) => page.url.pathname === '/')
    const download = pages.find((page) => page.url.pathname === '/download/')
    const pricing = pages.find((page) => page.url.pathname === '/pricing/')
    const privacy = pages.find((page) => page.url.pathname === '/privacy/')
    expect(home?.document.querySelector('a[data-analytics-event="download_page_click"]')?.getAttribute('href')).toBe('/download/')
    expect(download?.document.querySelector('a[data-analytics-event="download_release_click"]')?.getAttribute('href')).toBe(siteConfig.releaseUrl)
    for (const page of [home, pricing]) expect(page?.document.querySelector('a[data-analytics-event="purchase_link_click"]')?.getAttribute('href')).toBe(siteConfig.purchaseUrl)
    expect(privacy?.document.querySelector('main')?.textContent).toContain('clicks on download and purchase links')
  })

  it('emits parseable JSON-LD in real script elements on every page', () => {
    for (const page of pages) {
      const scripts = [...page.document.querySelectorAll('script[type="application/ld+json"]')]
      expect(scripts.length).toBeGreaterThanOrEqual(2)
      for (const script of scripts) {
        const schema: unknown = JSON.parse(script.textContent ?? '')
        expect(schema).toHaveProperty('@context', 'https://schema.org')
        expect(schema).toHaveProperty('@type')
      }
    }
  })

  it('keeps internal links and fragment destinations valid', () => {
    for (const page of pages) {
      for (const link of page.document.querySelectorAll('a[href]')) {
        const url = new URL(link.getAttribute('href') ?? '', page.url)
        if (url.origin !== siteConfig.siteUrl) continue
        expect(files[outputFile(url.pathname)], `${page.url.pathname} links to ${url.pathname}`).toBeDefined()
        if (!url.hash) continue
        const destination = pages.find((entry) => entry.url.pathname === url.pathname)
        expect(destination?.document.getElementById(decodeURIComponent(url.hash.slice(1))), url.href).toBeTruthy()
      }
    }
  })

  it('includes FAQ answers and anchors in HTML before hydration', () => {
    const faq = pages.find((page) => page.url.pathname === '/faqs/')
    expect(faq).toBeDefined()
    const answers = faq?.document.querySelectorAll('.faq-answer')
    expect(answers?.length).toBeGreaterThan(5)
    expect(faq?.document.getElementById('agents')).toBeTruthy()
    expect(faq?.document.getElementById('installation')).toBeTruthy()
    for (const answer of answers ?? []) expect(answer.textContent?.trim().length).toBeGreaterThan(30)
    expect(faq?.document.body.textContent).toContain('Agent Hooks')
    expect(faq?.document.querySelector('h2 h3, h3 h2')).toBeNull()
  })

  it('exposes guides, support, and pricing through crawlable footer navigation', () => {
    const required = ['/docs/', '/docs/claude-code/', '/docs/codex/', '/docs/compatibility/', '/pricing/', '/faqs/', '/privacy/', '/recover/', '/terms/']
    for (const page of pages) {
      const links = [...page.document.querySelectorAll('footer nav a')].map((link) => link.getAttribute('href'))
      for (const href of required) expect(links).toContain(href)
    }
    const pricing = pages.find((page) => page.url.pathname === '/pricing/')
    expect(pricing?.document.querySelector('main')?.textContent).toContain(siteConfig.priceLabel)
    expect(pricing?.document.querySelector('main')?.textContent).toContain('one-time purchase')
    expect(pricing?.document.querySelector('main')?.textContent).toContain('not a recurring')
  })

  it('connects purchase promises to a complete policy and private order contact', () => {
    const terms = pages.find((page) => page.url.pathname === '/terms/')
    const pricing = pages.find((page) => page.url.pathname === '/pricing/')
    const faq = pages.find((page) => page.url.pathname === '/faqs/')
    expect(terms).toBeDefined()
    expect(terms?.document.getElementById('refunds')?.textContent).toContain(`${purchasePolicy.refundDays} calendar days`)
    expect(terms?.document.getElementById('devices')?.textContent).toContain(purchasePolicy.deviceSummary)
    expect(terms?.document.getElementById('updates')?.textContent).toContain(purchasePolicy.updateSummary)
    expect(terms?.document.getElementById('refunds')?.querySelector('a')?.getAttribute('href')).toBe(siteConfig.billingSupportUrl)
    expect(pricing?.document.querySelector('main')?.textContent).toContain(`${purchasePolicy.refundDays} calendar days`)
    expect(pricing?.document.querySelector(`a[href="${siteConfig.billingSupportUrl}"]`)?.textContent).toBe(siteConfig.billingSupportEmail)
    expect(faq?.document.getElementById('refunds')?.textContent).toContain(`${purchasePolicy.refundDays} calendar days`)
    expect(faq?.document.querySelector('#refunds a')?.getAttribute('href')).toBe('/terms/#refunds')
    expect(terms?.document.getElementById('preview')?.textContent).toContain('no time-limited native app trial')
  })

  it('points crawler discovery at the same canonical sitemap', () => {
    const robots = files['/dist/robots.txt'] ?? ''
    expect(robots).toContain(`Sitemap: ${siteConfig.siteUrl}/sitemap.xml`)
    expect(robots).not.toContain('Disallow: /')
    expect(xml.querySelector('parsererror')).toBeNull()
    expect(new Set(urls.map((url) => url.href)).size).toBe(urls.length)
  })
})
