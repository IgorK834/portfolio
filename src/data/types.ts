export type Accent = 'blue' | 'red' | 'yellow';

/** A titled statement: an engineering highlight or a challenge. */
export interface Statement {
  title: string;
  text: string;
  /** Small square label next to the title, e.g. "Experimental R&D". */
  tag?: string;
}

export interface TechGroup {
  label: string;
  items: string[];
}

/** An image living in src/assets/ (path relative to that folder). Missing files fall back to the design's wireframe. */
export interface ImageRef {
  src: string;
  alt: string;
  /** Short caption shown under a screenshot in the case study. */
  caption?: string;
  /** "contain" shows the whole image (logos, banners) instead of cropping it to the frame. Default: cover. */
  fit?: 'cover' | 'contain';
}

export interface CaseStudy {
  problem?: string;
  /** "Product and users". */
  product?: { audience: string; lead: string; capabilities: string[] };
  /** "My contribution". Hidden until at least one area has text. */
  contribution?: { summary?: string; areas: { label: string; text?: string }[] };
  architecture?: {
    summary: string;
    nodes: ArchitectureNode[];
    edges: ArchitectureEdge[];
    /** Caption under the diagram: full text, and a shorter one for narrow screens. */
    legend: { full: string; short: string };
    /** Exact split of responsibilities between the services. Hidden until written. */
    responsibilities?: string;
    /** Reminder for the author; only rendered while placeholders are shown. */
    todo?: string;
  };
  /** "Key engineering challenges". When absent, the project's engineering highlights are shown instead. */
  challenges?: Statement[];
  /** "Technical decisions and trade-offs". `tradeoff` stays undefined until it is written. */
  decisions?: { decision: string; why: string; tradeoff?: string }[];
  quality?: { summary: string; facts: { label: string; value?: string; todo?: string }[] };
  /** "What is coming": for projects in development, what is done and what is next. */
  roadmap?: { summary?: string; phases: { label: string; state: 'done' | 'next' | 'later'; text: string }[] };
  /** "What I learned". */
  learned?: string[];
}

/** Nodes are placed on a two-column grid: column 0 or 1, row 0..n. */
export interface ArchitectureNode {
  id: string;
  column: 0 | 1;
  row: number;
  title: string;
  /** Shorter title for narrow screens, when the full one does not fit. */
  shortTitle?: string;
  /** Detail lines for desktop. */
  lines: string[];
  /** Shorter detail lines for narrow screens. */
  shortLines: string[];
}

export interface ArchitectureEdge {
  from: string;
  to: string;
  /** Dashed = relationship not yet confirmed against the architecture docs. */
  dashed?: boolean;
  /** Arrow in both directions (two arrows). */
  both?: boolean;
  /** Small caption on the arrow. */
  label?: string;
}

export interface Project {
  slug: string;
  /** "01", "02", ... Shown as the large structural number. */
  number: string;
  title: string;
  /** Used in lists, markers and screen-reader text. */
  shortTitle: string;
  subtitle: string;
  /** English descriptor, for projects whose title is not English. */
  englishTitle?: string;
  /** One-line summary used in the selected-work index. */
  summary: string;
  accent: Accent;
  status?: string;
  /** Short category shown next to the number ("Spatial / GIS"). */
  category?: string;
  /** Personal role. Hidden until written. */
  role?: string;
  /** Projects are not deployed: they are shown through screenshots and a link to the source repository. */
  repository: { visibility: 'public' | 'private'; url?: string };
  /** Still being built: no case-study content beyond what the repository states, no screenshots required. */
  inDevelopment?: boolean;

  overview: {
    lead: string;
    /** Rail label on mobile and prefix of the tag on desktop, e.g. "The product". Defaults to "Overview". */
    label?: string;
    /** Square tag above the lead, e.g. "team work". */
    tag?: string;
    extra?: { heading: string; text?: string; list?: string[] };
  };
  /** Leading rows of the fact list next to the overview. "My role" and "Source" rows are added automatically. */
  facts: { label: string; value: string; /** Left out on phones, where the same fact is already visible elsewhere. */ desktopOnly?: boolean }[];
  highlights: Statement[];
  stack: TechGroup[];

  /** Vertical label printed on the accent field. */
  visualLabel?: string;
  /** Which wireframe to show until a real screenshot exists. */
  wireframe: 'workspace' | 'map' | 'builder';
  /** Both come from src/assets/projects/<slug>/screenshots.json (see utils/project-media.ts). */
  cover?: ImageRef;
  screenshots?: ImageRef[];

  seo: { title: string; description: string };
  caseStudy?: CaseStudy;
}

export interface Skill {
  name: string;
  /** Slugs of the projects that use it. */
  projects?: string[];
}

export interface SkillGroup {
  label: string;
  skills: Skill[];
  /** Minimum row height on phones, where the group label is printed vertically (default 150). */
  phoneMinHeight?: number;
}

/** One job or internship, newest first in the data. */
export interface Experience {
  company: string;
  role: string;
  /** Free text, e.g. "11.2025 – 06.2026" or "Current". */
  period: string;
  current?: boolean;
  /** One line on the company or the context, shown under the role. */
  context?: string;
  bullets: string[];
  links?: { label: string; url: string }[];
}

export interface Studies {
  school: string;
  field: string;
  /** e.g. "10.2023 – present". */
  period: string;
  /** e.g. "Final semester". */
  status?: string;
}

export interface Profile {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  /** The two visual lines of the title in the hero. */
  titleLines: [string, string];
  shortBio: string;
  coreStack: string[];
  about: { lead: string; interests: { title: string; text: string }[] };
  skills: SkillGroup[];
  /** Short intro texts of homepage sections. */
  copy: { projectsIntro: string; stackIntro: string; resumeIntro: string };
  portrait?: ImageRef;
  // Personal details: leave undefined until known. Empty fields are hidden on the site.
  location?: string;
  availability?: string;
  email?: string;
  phone?: string;
  github?: string;
  linkedin?: string;
  education?: string;
  studies?: Studies;
  /** Newest first. Shown in About, on /resume and on the printable CV. */
  experience?: Experience[];
  currentStatus?: string;
  targetRole?: string;
  languages?: string;
  /** Where and how I can work, e.g. "Remote, hybrid or on-site". */
  workMode?: string;
  /** Public path of the CV PDF. The download button only appears once the file exists in public/. */
  resumeUrl: string;
}
