// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO(domain): replace with real domain once purchased.
// This is the single source of truth for the canonical site URL —
// metadata, sitemap, and OG tags all derive from it.
const SITE_URL = 'https://catdadgames.example';

export default defineConfig({
  site: SITE_URL,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
