import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const docs = defineCollection({
  loader: glob({ base: './src/content/docs', pattern: '**/*.mdx' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().default('DOCS'),
    order: z.number().default(99),
  }),
});

export const collections = { docs };
