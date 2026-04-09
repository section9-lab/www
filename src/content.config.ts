import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'

const faqs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faqs' }),
  schema: z.object({
    order: z.number().int().positive(),
    title: z.string(),
    badge: z.enum(['privacy', 'refund', 'warning']).optional(),
    notes: z.array(z.string()).default([]),
  }),
})

export const collections = {
  faqs,
}
