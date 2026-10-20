// Export a version of the printable CV to PDF with the same print layout the browser uses.
//
//   npm run cv:pdf                                   # general CV -> public/resume/igor-kadziela-cv.pdf (the site's "Download CV")
//   npm run cv:pdf -- fullstack                      # a variant from src/data/cv.ts -> cv-exports/fullstack.pdf
//   npm run cv:pdf -- default --hl "React,Docker" --title "Junior Frontend Developer" --out cv-exports/acme.pdf
//
// Needs a production build (it builds one if dist/ is missing). After refreshing the site's own PDF, run
// `npm run build` again so the new file is included in dist/.
import { spawn } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const variant = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--'))) ?? 'default';
const hl = flag('hl');
const title = flag('title');
const tailored = Boolean(hl || title);

const isSiteCopy = variant === 'default' && !tailored && !flag('out');
const out = resolve(root, flag('out') ?? (isSiteCopy ? 'public/resume/igor-kadziela-cv.pdf' : `cv-exports/${variant}.pdf`));

const run = (command, commandArgs) =>
  new Promise((done, fail) => {
    const child = spawn(command, commandArgs, { cwd: root, stdio: 'inherit' });
    child.on('exit', (code) => (code === 0 ? done() : fail(new Error(`${command} exited with ${code}`))));
  });

if (!existsSync(join(root, 'dist'))) await run('npm', ['run', 'build']);

const port = 4331;
const server = spawn('npx', ['astro', 'preview', '--port', String(port), '--host', '127.0.0.1', '--ignore-lock'], { cwd: root, stdio: 'ignore' });
const base = `http://127.0.0.1:${port}`;

try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(base)).ok) break;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
    if (i === 59) throw new Error('The preview server did not start.');
  }

  const query = new URLSearchParams();
  if (hl) query.set('hl', hl);
  if (title) query.set('title', title);
  const path = variant === 'default' ? '/cv' : `/cv/${variant}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  const response = await page.goto(`${base}${path}${query.size ? `?${query}` : ''}`, { waitUntil: 'networkidle' });
  if (!response?.ok()) throw new Error(`${path} returned ${response?.status()}. Is "${variant}" a variant in src/data/cv.ts?`);
  await page.evaluate(() => document.fonts.ready);
  mkdirSync(dirname(out), { recursive: true });
  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();

  // count pages, so a CV that spilled onto a third page is noticed
  const pages = (readFileSync(out).toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  console.log(`${out.replace(`${root}/`, '')}  ${Math.round(statSync(out).size / 1024)} KB, ${pages} page${pages === 1 ? '' : 's'}`);
  if (pages > 2) console.warn('The CV is longer than two pages: shorten the summary or drop a project in src/data/cv.ts.');

  const dist = join(root, 'dist/resume/igor-kadziela-cv.pdf');
  if (isSiteCopy && existsSync(join(root, 'dist'))) {
    mkdirSync(dirname(dist), { recursive: true });
    copyFileSync(out, dist);
  }
} finally {
  server.kill();
}
