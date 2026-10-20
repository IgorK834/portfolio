/**
 * The approved design shows "[TO BE FILLED]" boxes for personal facts that were not supplied.
 * On the real site those elements are hidden until the data exists. Setting
 * PUBLIC_SHOW_PLACEHOLDERS=true renders the design's placeholders instead; the visual
 * regression workflow uses this so the site can be compared with the design like for like.
 */
export const SHOW_PLACEHOLDERS = import.meta.env.PUBLIC_SHOW_PLACEHOLDERS === 'true';

/** True when a field should be rendered: it has a value, or placeholders are being shown. */
export const visible = (value: unknown): boolean =>
  SHOW_PLACEHOLDERS || (Array.isArray(value) ? value.length > 0 : Boolean(value));
