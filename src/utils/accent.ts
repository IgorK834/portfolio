import type { Accent, Project } from '../data/types';

/** Accent colour, the colour that stays readable on top of it, and the soft tint used on hover. */
const ACCENTS: Record<Accent, { color: string; on: string; soft: string }> = {
  blue: { color: 'var(--color-blue)', on: '#fff', soft: '#e7eefe' }, // white on blue: 4.76:1
  red: { color: 'var(--color-red)', on: 'var(--color-ink)', soft: '#ffe9e8' }, // ink on red: 4.98:1
  yellow: { color: 'var(--color-yellow)', on: 'var(--color-ink)', soft: '#fff3da' }, // ink on yellow: 9.9:1
};

/** Inline custom properties for a project's accent: --acc, --on, --soft. */
export const accentStyle = (accent: Accent) => {
  const a = ACCENTS[accent];
  return `--acc:${a.color};--on:${a.on};--soft:${a.soft}`;
};

export const accentOf = (accent: Accent) => ACCENTS[accent];

/** The short descriptor shown next to a project number: its status or category. */
export const projectKicker = (p: Project): string | undefined => p.status ?? p.category;
