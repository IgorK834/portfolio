// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// Fully static site, served by Cloudflare Workers static assets (see wrangler.jsonc).
// No adapter is needed: add `@astrojs/cloudflare` only if on-demand rendering is ever required.
export default defineConfig({
  site: 'https://igorkadziela.dev',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  // `file` output: /projects/pzpp -> projects/pzpp.html, matching the canonical URLs (no trailing slash).
  build: { format: 'file' },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'League Spartan',
      cssVariable: '--font-display',
      weights: [800, 900],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['Futura', 'Century Gothic', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Instrument Sans',
      cssVariable: '--font-body',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['ui-monospace', 'Menlo', 'monospace'],
    },
  ],
});
