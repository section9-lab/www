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

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().positive(),
    updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  }),
})

export const collections = { faqs, docs }
