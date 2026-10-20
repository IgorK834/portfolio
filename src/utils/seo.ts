import { profile } from '../data/profile';
import { projects } from '../data/projects';
import type { Project } from '../data/types';

export const SITE = 'https://igorkadziela.dev';
const PERSON_ID = `${SITE}/#person`;
const abs = (path: string) => new URL(path, SITE).href;

/** Profile links that exist (GitHub, LinkedIn). */
const sameAs = () => [profile.github, profile.linkedin].filter((url): url is string => Boolean(url));

const person = () => ({
  '@type': 'Person',
  '@id': PERSON_ID,
  name: profile.name,
  jobTitle: profile.title,
  url: `${SITE}/`,
  knowsAbout: profile.skills.flatMap((group) => group.skills.map((s) => s.name)),
  ...(profile.experience?.find((job) => job.current) && {
    worksFor: { '@type': 'Organization', name: profile.experience.find((job) => job.current)!.company },
  }),
  ...(profile.email && { email: profile.email }),
  ...(sameAs().length > 0 && { sameAs: sameAs() }),
  ...(profile.location && { address: { '@type': 'PostalAddress', addressLocality: profile.location } }),
});

/** Person + WebSite + the list of selected projects. Only facts present in src/data/ are emitted. */
export function homeJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@graph': [
        person(),
        {
          '@type': 'WebSite',
          '@id': `${SITE}/#website`,
          url: `${SITE}/`,
          name: profile.name,
          inLanguage: 'en',
          publisher: { '@id': PERSON_ID },
        },
        {
          '@type': 'ItemList',
          name: 'Selected work',
          itemListElement: projects.map((project, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: project.title,
            url: abs(`/projects/${project.slug}`),
          })),
        },
      ],
    },
  ];
}

/** SoftwareApplication for a project page, plus its breadcrumb. Projects are not deployed, so there is no installUrl. */
export function projectJsonLd(project: Project) {
  const url = abs(`/projects/${project.slug}`);
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: project.title,
      ...(project.englishTitle && { alternateName: project.englishTitle }),
      description: `${project.subtitle}${project.status ? ` ${project.status}.` : ''}`,
      applicationCategory: 'WebApplication',
      url,
      // only when a role is stated in src/data/projects.ts
      ...(project.role && { creator: { '@id': PERSON_ID } }),
    },
    ...(project.repository.url
      ? [
          {
            '@context': 'https://schema.org',
            '@type': 'SoftwareSourceCode',
            name: `${project.title} source code`,
            codeRepository: project.repository.url,
            ...(project.role && { author: { '@id': PERSON_ID } }),
          },
        ]
      : []),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: `${SITE}/#projects` },
        { '@type': 'ListItem', position: 3, name: project.title, item: url },
      ],
    },
  ];
}

/** The /resume page describes the same person. */
export function resumeJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      url: abs('/resume'),
      name: `${profile.name} — Resume`,
      mainEntity: person(),
    },
  ];
}
