import type { APIRoute } from 'astro';
import { projects } from '../data/projects';
import { SITE } from '../utils/seo';

// Every public page, derived from the project list. No lastmod: it would have to be invented.
export const GET: APIRoute = () => {
  const paths = ['/', ...projects.map((project) => `/projects/${project.slug}`), '/resume'];
  const urls = paths.map((path) => `  <url><loc>${new URL(path, SITE).href}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
