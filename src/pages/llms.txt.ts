import type { APIRoute } from 'astro';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { SITE } from '../utils/seo';
import { hasResumePdf } from '../utils/resume';

// /llms.txt: a concise, factual summary for AI agents. Generated from src/data/, so it never drifts
// from the site. Only facts that exist in the data are included.
export const GET: APIRoute = () => {
  const lines: string[] = [
    `# ${profile.name}`,
    '',
    `> ${profile.title}. ${profile.shortBio}`,
    '',
    `Core technologies: ${profile.coreStack.join(', ')}.`,
  ];
  if (profile.location) lines.push(`Location: ${profile.location}.`);
  if (profile.availability) lines.push(`Open to: ${profile.availability}.`);
  if (profile.workMode) lines.push(`Work mode: ${profile.workMode}.`);
  if (profile.email) lines.push(`Email: ${profile.email}`);
  if (profile.github) lines.push(`GitHub: ${profile.github}`);
  if (profile.linkedin) lines.push(`LinkedIn: ${profile.linkedin}`);

  if (profile.education) lines.push(`Education: ${profile.education}.`);
  if (profile.experience?.length) {
    lines.push('', '## Experience', '');
    for (const job of profile.experience) {
      lines.push(`- ${job.role}, ${job.company} (${job.period}): ${job.bullets.join(' ')}`);
    }
  }

  lines.push('', '## Projects', '');
  for (const project of projects) {
    const facts = [
      project.status,
      project.repository.visibility === 'private' ? 'Private repository' : `Public repository: ${project.repository.url}`,
      project.inDevelopment ? undefined : 'Not deployed: shown through screenshots and source',
    ].filter(Boolean);
    const tech = project.stack.flatMap((group) => group.items).join(', ');
    const subtitle = project.subtitle.replace(/\.?$/, '.');
    lines.push(`- [${project.title}](${SITE}/projects/${project.slug}): ${subtitle} ${facts.join('. ')}. Technologies: ${tech}.`);
    if (project.role) lines.push(`  Role: ${project.role}`);
    if (project.slug === 'parcel-analysis') {
      lines.push('  LLM-assisted MPZP document extraction is an experimental research track, not a finished feature.');
    }
  }

  lines.push('', '## Resume', '', `- [Resume (HTML)](${SITE}/resume)`);
  if (hasResumePdf) lines.push(`- [CV (PDF)](${SITE}${profile.resumeUrl})`);

  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
