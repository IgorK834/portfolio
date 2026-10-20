import type { Profile } from './types';

/**
 * Single source of truth for personal details.
 * Leave a field undefined until it is known: empty fields are hidden on the site.
 */
export const profile: Profile = {
  name: 'Igor Kadziela',
  firstName: 'Igor',
  lastName: 'Kadziela',
  title: 'Software Engineer / Full-Stack Engineer',
  titleLines: ['Software Engineer /', 'Full-Stack Engineer'],
  shortBio:
    'I build end-to-end software systems that combine robust backend architecture, modern web interfaces, data processing and AI.',
  coreStack: [
    'Java / Spring Boot',
    'TypeScript / React / Next.js',
    'Python / FastAPI',
    'PostgreSQL / PostGIS',
    'AI / RAG',
  ],

  // --- TODO: fill in. Each of these is hidden on the site while undefined. ---
  location: undefined, // e.g. 'City, Country'
  availability: 'Internship or Junior Full-Stack Engineer · full-time', // shown as "Open to"
  workMode: 'Remote, hybrid or on-site · open to relocating abroad',
  email: 'i.kadziela03@gmail.com',
  github: 'https://github.com/IgorK834',
  linkedin: undefined, // TODO: full profile URL once the LinkedIn profile is ready; the Contact row says "Coming soon".
  studies: {
    school: 'University of Bielsko-Biała',
    field: 'Computer Science',
    period: '10.2023 – present',
    status: 'Final semester',
  },
  education: 'Computer Science, University of Bielsko-Biała · since 10.2023, final semester',
  currentStatus: 'IT intern at Iturri Poland · final-semester Computer Science student',
  experience: [
    {
      company: 'Iturri Poland',
      role: 'IT Intern, IT department',
      period: 'Current',
      current: true,
      bullets: [
        'Optimise, fix and ship new features for a kiosk IoT device.',
        'Review and plan the architecture of the company’s IoT systems.',
        'Maintain the Raspberry Pi device that powers the kiosk.',
      ],
    },
    {
      company: 'Kaks s.c. and MKA Sp. z o.o.',
      role: 'Frontend Developer',
      period: '11.2025 – 06.2026',
      context: 'Two companies with the same owner; one website for each.',
      bullets: [
        'Built and deployed kaksbb.pl for Kaks s.c.',
        'Built and deployed mkabb.pl for MKA Sp. z o.o.',
      ],
      links: [
        { label: 'kaksbb.pl', url: 'https://kaksbb.pl' },
        { label: 'mkabb.pl', url: 'https://mkabb.pl' },
      ],
    },
  ],
  targetRole: 'Junior Full-Stack Engineer, or an internship',
  languages: undefined,
  // Portrait: put the photo in src/assets/ and set { src: 'portrait.jpg', alt: '...' }.
  portrait: undefined,

  // The "Download CV" button appears once this file exists in public/.
  resumeUrl: '/resume/igor-kadziela-cv.pdf',

  about: {
    lead: 'My work sits where backend architecture, data and the interface have to agree. ResearchHub ties AI answers to the sources they came from. The parcel-analysis platform separates missing data from a confirmed absence of a restriction. obiekt.io, still in its foundation stage, is a tool for building managers.',
    interests: [
      { title: 'Full-stack systems', text: 'From database schema to interface, inside one product.' },
      { title: 'Backend architecture', text: 'Clear boundaries between services, workers and domains.' },
      { title: 'Data-heavy applications', text: 'PostgreSQL, PostGIS and spatial processing.' },
      { title: 'AI grounded in real data', text: 'RAG with citations back to source chunks.' },
      { title: 'Reproducibility and provenance', text: 'Immutable snapshots, hashed audit exports.' },
      { title: 'Databases', text: 'PostgreSQL, pgvector, PostGIS, SQLAlchemy.' },
      { title: 'Developer quality practices', text: 'Automated tests, coverage gates, architecture documentation.' },
    ],
  },

  copy: {
    projectsIntro:
      'Two full projects and one in development: an AI research workspace, a spatial parcel-analysis platform and a tool for building managers. Nothing is hosted: each case study pins screenshots and links to the source on GitHub.',
    stackIntro: 'Technologies grouped by their role in a system. Squares mark which of the three projects use each one.',
    resumeIntro: 'The same facts as this site, as a downloadable PDF and as a plain HTML page for quick reading and parsing.',
  },

  // Skills grouped by role. `projects` lists the project slugs that use the technology;
  // only list a project where the technology is actually used.
  skills: [
    {
      label: 'Backend',
      skills: [
        { name: 'Java', projects: ['researchhub'] },
        { name: 'Spring Boot', projects: ['researchhub', 'obiekt-io'] },
        { name: 'Python', projects: ['researchhub', 'parcel-analysis', 'obiekt-io'] },
        { name: 'FastAPI', projects: ['researchhub', 'parcel-analysis', 'obiekt-io'] },
        { name: 'REST APIs' },
      ],
    },
    {
      label: 'Frontend',
      skills: [
        { name: 'TypeScript', projects: ['researchhub', 'parcel-analysis'] },
        { name: 'React', projects: ['researchhub', 'parcel-analysis'] },
        { name: 'Next.js', projects: ['parcel-analysis', 'obiekt-io'] },
      ],
    },
    {
      label: 'Data',
      skills: [
        { name: 'PostgreSQL', projects: ['researchhub', 'parcel-analysis'] },
        { name: 'PostGIS', projects: ['parcel-analysis'] },
        { name: 'pgvector', projects: ['researchhub'] },
        { name: 'SQLAlchemy', projects: ['parcel-analysis'] },
      ],
    },
    {
      label: 'AI / data systems',
      phoneMinHeight: 230,
      skills: [
        { name: 'RAG', projects: ['researchhub'] },
        { name: 'Embeddings', projects: ['researchhub'] },
        { name: 'Provenance', projects: ['researchhub', 'parcel-analysis'] },
        { name: 'Source-grounded generation', projects: ['researchhub'] },
        { name: 'Structured AI workflows', projects: ['researchhub'] },
      ],
    },
    {
      label: 'IoT',
      skills: [
        { name: 'Raspberry Pi' },
        { name: 'IoT system architecture' },
        { name: 'Kiosk devices' },
      ],
    },
    {
      label: 'Engineering',
      phoneMinHeight: 190,
      skills: [
        { name: 'Docker', projects: ['researchhub', 'parcel-analysis'] },
        { name: 'Git / GitHub' },
        { name: 'CI' },
        { name: 'Testing', projects: ['researchhub', 'parcel-analysis'] },
        { name: 'Architecture documentation' },
      ],
    },
  ],
};
