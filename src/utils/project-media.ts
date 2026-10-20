import type { ImageRef } from '../data/types';
import { getImage } from './images';

/**
 * Each project keeps its pinned screenshots next to a manifest: src/assets/projects/<slug>/screenshots.json.
 * The project's own agent writes both (see docs/agent-prompts/), so adding or replacing a screenshot never
 * touches this site's code:
 *
 *   {
 *     "cover":       { "file": "cover.png", "alt": "...", "caption": "...", "fit": "cover | contain (optional)" },
 *     "screenshots": [{ "file": "01-workspace.png", "alt": "...", "caption": "..." }]
 *   }
 *
 * Entries whose file is missing, or that have no alt text, are skipped.
 */
interface ManifestEntry {
  file?: string;
  alt?: string;
  caption?: string;
  fit?: 'cover' | 'contain';
}
interface Manifest {
  cover?: ManifestEntry;
  screenshots?: ManifestEntry[];
}

const manifests = import.meta.glob<Manifest>('/src/assets/projects/*/screenshots.json', {
  eager: true,
  import: 'default',
});

function toRef(slug: string, entry?: ManifestEntry): ImageRef | undefined {
  if (!entry?.file || !entry.alt) return undefined;
  const src = `projects/${slug}/${entry.file}`;
  if (!getImage(src)) return undefined;
  return { src, alt: entry.alt, ...(entry.caption && { caption: entry.caption }), ...(entry.fit && { fit: entry.fit }) };
}

/** The cover (falls back to the first screenshot) and the screenshots of one project, in manifest order. */
export function projectMedia(slug: string): { cover?: ImageRef; screenshots: ImageRef[] } {
  const manifest = manifests[`/src/assets/projects/${slug}/screenshots.json`];
  const screenshots = (manifest?.screenshots ?? []).map((entry) => toRef(slug, entry)).filter((ref): ref is ImageRef => Boolean(ref));
  return { cover: toRef(slug, manifest?.cover) ?? screenshots[0], screenshots };
}
