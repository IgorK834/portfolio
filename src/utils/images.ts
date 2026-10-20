import type { ImageMetadata } from 'astro';

// Every image under src/assets/ is picked up here, so adding a screenshot or the portrait
// only means dropping the file in place and referencing its path in src/data/.
const images = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
});

/** Resolve a path relative to src/assets/ (e.g. "projects/researchhub/cover.png"). Undefined if the file does not exist. */
export function getImage(path?: string): ImageMetadata | undefined {
  return path ? images[`/src/assets/${path}`]?.default : undefined;
}
