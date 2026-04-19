import type { APIRoute } from 'astro'
import { siteConfig } from '../config/site'

const crawlerRules = [
  ['User-agent: *', 'Allow: /'],
  ['User-agent: Googlebot', 'Allow: /'],
  ['User-agent: Bingbot', 'Allow: /'],
  ['User-agent: PerplexityBot', 'Allow: /'],
  ['User-agent: ChatGPT-User', 'Allow: /'],
  ['User-agent: GPTBot', 'Allow: /'],
  ['User-agent: ClaudeBot', 'Allow: /'],
  ['User-agent: anthropic-ai', 'Allow: /'],
]

export const GET: APIRoute = () => {
  const body = [...crawlerRules.map((rule) => rule.join('\n')), `Sitemap: ${siteConfig.siteUrl}/sitemap.xml`].join('\n\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
