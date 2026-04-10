import type { APIRoute } from 'astro'
import { siteConfig } from '../config/site'

const routes = ['/', '/download', '/faqs', '/privacy', '/recover']

export const GET: APIRoute = () => {
  const urls = routes
    .map((route) => {
      const href = new URL(route, siteConfig.siteUrl).toString()
      return `<url><loc>${href}</loc></url>`
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
