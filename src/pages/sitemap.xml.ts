import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { siteConfig } from '../config/site'

const routes = ['/', '/download/', '/faqs/', '/privacy/', '/recover/', '/docs/', '/pricing/', '/terms/'] as const
const siteUpdated = '2026-10-28'

export const GET: APIRoute = async () => {
  const guides = await getCollection('docs')
  const entries = [
    ...routes.map((path) => ({ path, lastmod: siteUpdated })),
    ...guides.map((guide) => ({ path: `/docs/${guide.id}/`, lastmod: guide.data.updated })),
  ]
  const urls = entries.map(({ path, lastmod }) => `<url><loc>${new URL(path, siteConfig.siteUrl).toString()}</loc><lastmod>${lastmod}</lastmod></url>`).join('')
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
