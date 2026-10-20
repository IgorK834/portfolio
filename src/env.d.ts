/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  /** Set to "true" to render the design's "[TO BE FILLED]" placeholders (used for visual regression). */
  readonly PUBLIC_SHOW_PLACEHOLDERS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
