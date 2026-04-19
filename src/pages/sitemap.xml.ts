import type { APIRoute } from 'astro'
import { siteConfig } from '../config/site'

const routes = [
  { path: '/', lastmod: '2026-04-19' },
  { path: '/download', lastmod: '2026-04-19' },
  { path: '/faqs', lastmod: '2026-04-19' },
  { path: '/privacy', lastmod: '2026-04-19' },
  { path: '/recover', lastmod: '2026-04-19' },
] as const

export const GET: APIRoute = () => {
  const urls = routes
    .map(({ path, lastmod }) => {
      const href = new URL(path, siteConfig.siteUrl).toString()
      return `<url><loc>${href}</loc><lastmod>${lastmod}</lastmod></url>`
    })
    .join('')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
