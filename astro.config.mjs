// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://chips.dev',
  trailingSlash: 'never',
  integrations: [sitemap()],
  build: { format: 'directory' },
  vite: {
    css: { devSourcemap: true },
  },
});
