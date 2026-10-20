import { profile } from './profile';

/**
 * Tailored versions of the printable CV (/cv and /cv/<slug>).
 *
 * To answer a job advertisement: copy a variant below, change the headline and summary, list the skills the
 * advertisement asks for in `skillsFirst`, and put the most relevant projects first. Nothing here is invented:
 * the experience, studies and project facts come from profile.ts and projects.ts, a variant only chooses what
 * to show first and how to word the summary.
 *
 * Quick tailoring without editing code: open /cv?hl=React,Spring%20Boot&title=Junior%20Frontend%20Developer.
 * `hl` highlights those words (and moves matching skills first), `title` replaces the headline. The page also
 * has an "Edit text" switch for one-off changes; edits are not saved, print or save as PDF afterwards.
 */
export interface CvVariant {
  /** URL segment: /cv/<slug>. The default variant lives at /cv. */
  slug: string;
  /** Name in the variant switcher. */
  label: string;
  /** Line under the name. */
  headline: string;
  summary: string;
  /** Skills listed first inside their group, in this order. */
  skillsFirst?: string[];
  /** Order of skill groups by label; groups not listed follow in their usual order. */
  groupOrder?: string[];
  /** Project slugs, in the order they appear. */
  projects: string[];
  /** Words printed in bold wherever they occur. */
  emphasize?: string[];
}

export const cvVariants: CvVariant[] = [
  {
    slug: 'default',
    label: 'General',
    headline: profile.title,
    summary:
      'Final-semester Computer Science student and IT intern. I build end-to-end software: Java / Spring Boot and Python / FastAPI backends, TypeScript / React / Next.js interfaces, PostgreSQL data and AI that stays tied to its sources. I have shipped company websites as a frontend developer and now work on a production IoT kiosk built on a Raspberry Pi.',
    projects: ['researchhub', 'parcel-analysis', 'obiekt-io'],
  },
  {
    slug: 'fullstack',
    label: 'Junior full-stack',
    headline: 'Junior Full-Stack Engineer',
    summary:
      'Final-semester Computer Science student looking for a junior full-stack role. Two public projects show the whole stack: ResearchHub (Spring Boot, React, a Python worker, PostgreSQL) and a parcel-analysis platform (FastAPI, Next.js, PostGIS). Before that I built and deployed two company websites as a frontend developer, and I currently work as an IT intern.',
    skillsFirst: ['Java', 'Spring Boot', 'TypeScript', 'React', 'Next.js', 'Python', 'FastAPI', 'PostgreSQL'],
    groupOrder: ['Backend', 'Frontend', 'Data'],
    projects: ['researchhub', 'parcel-analysis', 'obiekt-io'],
    emphasize: ['Spring Boot', 'React', 'Next.js', 'FastAPI', 'PostgreSQL'],
  },
  {
    slug: 'iot',
    label: 'IoT and kiosk systems',
    headline: 'IT Intern · Software and IoT Engineer',
    summary:
      'IT intern at Iturri Poland working on a kiosk IoT device: I optimise it, fix it, ship new features, plan the architecture of the IoT systems around it and maintain the Raspberry Pi that powers it. Final-semester Computer Science student with full-stack experience in Java, Python and TypeScript.',
    skillsFirst: ['Raspberry Pi', 'IoT system architecture', 'Kiosk devices', 'Docker', 'Python', 'Java'],
    groupOrder: ['IoT', 'Backend', 'Engineering'],
    projects: ['parcel-analysis', 'researchhub', 'obiekt-io'],
    emphasize: ['Raspberry Pi', 'IoT', 'kiosk'],
  },
];

export const defaultCvVariant = cvVariants[0];
export const getCvVariant = (slug: string) => cvVariants.find((v) => v.slug === slug);
