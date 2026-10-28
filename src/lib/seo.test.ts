// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { serializeJsonLd } from './seo'

describe('JSON-LD script output', () => {
  it('remains valid JSON in the HTML raw-text parsing context', () => {
    const schema = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'vibe hud', description: 'Approvals & replies "in your notch"' }
    document.body.innerHTML = `<script type="application/ld+json">${serializeJsonLd(schema)}</script>`
    expect(JSON.parse(document.querySelector('script')?.textContent ?? '')).toEqual(schema)
  })

  it('keeps a script-closing string as data without creating executable markup', () => {
    const schema = { description: '</script><script>alert("injected")</script>\u2028\u2029' }
    document.body.innerHTML = `<script type="application/ld+json">${serializeJsonLd(schema)}</script>`
    expect(document.querySelectorAll('script')).toHaveLength(1)
    expect(JSON.parse(document.querySelector('script')?.textContent ?? '')).toEqual(schema)
  })
})
