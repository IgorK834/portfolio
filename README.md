# igorkadziela.dev

Personal engineering portfolio of Igor Kadziela. A fast, static, accessible and machine-readable site that
reproduces an approved Bauhaus / International-Style design (Claude Design output, kept in `design/`).

**Stack:** Astro 7 · TypeScript · plain CSS (scoped per component) · self-hosted fonts (Fontsource via Astro's Fonts API) ·
Cloudflare Pages · Playwright. No UI framework; the only client-side script is the mobile menu.

## Local development

```bash
npm install
npm run dev            # http://localhost:4321   (or: npx astro dev --background)
npm run build          # production build into dist/
npm run preview        # serve dist/
npm run check          # astro check: types for .astro and .ts files
npm test               # Playwright suite against the production build
```

`astro dev --background` / `astro dev stop` / `astro dev logs` manage a background dev server (see `AGENTS.md`).

## Where things live

| What | Where |
| --- | --- |
| Personal details, hero text, skills, about text, section intros | `src/data/profile.ts` |
| Projects and their case studies | `src/data/projects.ts` (types in `src/data/types.ts`) |
| Design tokens (palette, greys) | `src/styles/tokens.css` |
| Global styles | `src/styles/global.css` |
| Page shell, SEO head, structured data | `src/layouts/`, `src/utils/seo.ts` |
| Components | `src/components/{layout,hero,projects,case-study,about,resume,contact,ui}` |
| Pages | `src/pages/` (`index`, `resume`, `cv`, `cv/[variant]`, `projects/[slug]`, `404`, `llms.txt`, `robots.txt`, `sitemap.xml`) |
| Images (portrait, project screenshots) | `src/assets/` (project shots: `src/assets/projects/<slug>/` + `screenshots.json`) |
| Prompts for each project's own agent (screenshots, README) | `docs/agent-prompts/` |
| CV PDF | `public/resume/igor-kadziela-cv.pdf` (generated: `npm run cv:pdf`); printable CV at `/cv`, variants in `src/data/cv.ts` |

### Filling in personal details

Every optional field in `profile.ts` (`location`, `availability`, `email`, `github`, `linkedin`, `education`,
`currentStatus`, `targetRole`, `languages`, `portrait`) starts as `undefined` and is **hidden** on the site until it has a
value. Nothing is invented and no "TODO" text reaches production, with one exception: the **Contact** section always shows its
rows (Open to, Email, LinkedIn, GitHub) and displays the design's placeholder text until you set those fields. Search the data files for `TODO` to see what is open.

- **Portrait:** put the photo in `src/assets/` (e.g. `portrait.jpg`) and set `portrait: { src: 'portrait.jpg', alt: '...' }`.
  It is shown in monochrome (`grayscale(100%) contrast(115%)`), cropped to the design's box, and loaded eagerly as the LCP image.
- **CV:** `npm run cv:pdf` writes `public/resume/igor-kadziela-cv.pdf` from the printable CV (`/cv`); the "Download CV" buttons appear automatically once the file exists.
- **Contact links:** set `email`, `github`, `linkedin`; the hero, contact section, resume page, JSON-LD and `llms.txt` pick them up.

### Projects: screenshots and source, no deployments

Nothing is deployed. Each project is presented through **pinned screenshots** and a **link to its GitHub repository**; a
project that is still being built is marked `inDevelopment` and shows no demo. There is no `demoUrl` anywhere.

1. Append an entry to `projects` in `src/data/projects.ts`. The homepage index, project section, case-study page,
   next-project navigation, resume, sitemap, `llms.txt` and structured data all derive from that list. Set
   `repository: { visibility: 'public', url }`; a private repository is shown as such, with no link.
2. Screenshots are **not** listed in the data file. Put the images and a manifest in `src/assets/projects/<slug>/`:

   ```json
   {
     "cover": { "file": "cover.png", "alt": "...", "caption": "..." },
     "screenshots": [{ "file": "01-workspace.png", "alt": "...", "caption": "..." }]
   }
   ```

   `src/utils/project-media.ts` reads it. The cover (or the first screenshot) replaces the design's wireframe stand-in, the
   case study gets a "Screenshots" section with captions, and the homepage gets a "Screenshots" link. Entries with a missing
   file or no `alt` are skipped. Screenshots are grayscale at rest and reveal their colour on hover. `docs/agent-prompts/`
   holds one ready-to-paste prompt per project for the agent that works in that project's repository: it captures the
   screenshots, writes the manifest and adjusts that repository's README.
3. Optionally add `caseStudy` content (problem, product, contribution, architecture, challenges, decisions, quality,
   lessons). Sections without content are not rendered, and numbering stays consecutive.

The three desktop compositions (accent field right / left / vertical band) cycle by project index; the accent colour
(`blue`, `red`, `yellow`) comes from the data.

## Printable CV and tailoring it to a job advertisement

`/cv` is a bare, unindexed A4 page (black on white, selectable text, one page) built from `src/data/profile.ts`
(experience, studies, skills, contact) and `src/data/projects.ts`. A toolbar on screen (not in the printout) has a
**Print / Save as PDF** button; in the print dialog turn off "Headers and footers".

Three ways to tailor it for one application, from quickest to most permanent:

1. **In the browser:** type keywords from the advertisement into the box. They are bolded, and matching skills move to
   the top of their group. The headline field replaces the line under the name. "Edit text" makes the summary, bullets and
   headline editable for a one-off copy. The address updates, so `/cv?hl=React,Docker&title=Junior%20Frontend%20Developer`
   can be shared or exported. Edits are not saved.
2. **A saved version:** `src/data/cv.ts` holds the variants (`/cv`, `/cv/fullstack`, `/cv/iot`). Copy one, change the
   headline and summary, list the skills the advertisement wants in `skillsFirst`, reorder `projects`, add `emphasize`
   words. It appears at `/cv/<slug>` and in the switcher after the next build.
3. **A PDF file:**

   ```bash
   npm run cv:pdf                                   # general CV -> public/resume/igor-kadziela-cv.pdf, the site's "Download CV"
   npm run cv:pdf -- iot                            # a variant -> cv-exports/iot.pdf (git-ignored)
   npm run cv:pdf -- default --hl "React,Docker" --title "Junior Frontend Developer" --out cv-exports/acme.pdf
   ```

   The script prints the page count and warns above two pages. After refreshing the site's own PDF, run `npm run build`
   again so it is included.

Facts (employers, dates, studies) live only in `profile.ts`; variants never invent any.

## Design fidelity and visual regression

`design/source/*.dc.html` are the approved design files. The implementation reproduces them as one semantic DOM that
recomposes by CSS. The page is full-bleed (white, no outer frame). From 1200px the desktop architectural grid is drawn at the
design's 1360px and scaled proportionally to the window width with CSS `zoom` (type, spacing, borders and all), so a 2000px
screen shows the same composition larger. Below 1200px the rail-based mobile composition is used (scaled up for tablets).

```bash
PUBLIC_SHOW_PLACEHOLDERS=true npm run dev      # renders the design's "[TO BE FILLED]" placeholders
npm run visual                                 # screenshots design vs site at 1360px / 390px (1 design px = 1 CSS px), writes visual-report/
npm run visual -- home-mobile                  # one pair: home-desktop, home-mobile, case-desktop, case-mobile
node scripts/responsive-check.mjs              # overflow sweep: 6 routes × 14 widths (320 to 1920px)
npm run build && npx astro preview --port 4324 &   # then, in another terminal:
node scripts/audit.mjs http://127.0.0.1:4324 [chromium|webkit|firefox]   # 35 devices × 6 routes: overflow, overlapping/clipped text, tap targets, images, console errors
```

`PUBLIC_SHOW_PLACEHOLDERS=true` exists only for this comparison: it makes the site render the same placeholders the design
shows, so layouts can be compared like for like. Never set it in production. Other helpers: `scripts/probe.mjs` (print element
boxes), `scripts/slice.mjs` (crop a tall screenshot), `scripts/extract-wireframes.mjs` (regenerates
`src/components/projects/wireframes.ts` from the design), `scripts/generate-brand-assets.mjs` (`og.png`, `favicon.ico`).

## Deployment (Cloudflare Pages)

The site is fully static, so Cloudflare Pages serves the `dist/` folder as it is. No adapter, Worker script or
`wrangler.jsonc` is needed; `dist/404.html` answers unknown URLs. If on-demand rendering is ever needed, run `npx astro add cloudflare`.

**Git-connected deployment (recommended):**

1. Push the repository to GitHub (`main` is the production branch).
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**, select the repo.
3. Build command: `npm run build`. Build output directory: `dist`. Root directory: `/`. Use Node 22 (`.nvmrc`).
   The build downloads the open-source fonts once (Fontsource), so it needs network access, which Pages builds have.
4. Save and deploy. No environment variables or secrets are required.
5. Custom domain: the Pages project → **Custom domains → Set up a custom domain** → `igorkadziela.dev`
   (the domain's DNS must be on Cloudflare).

**Manual deployment:** `npm run deploy` builds, then runs `wrangler pages deploy dist --project-name=portfolio --branch=main`
(log in once with `npx wrangler login`). The project name must match the Pages project. Preview the built site with the
Pages runtime: `npx wrangler pages dev dist`.

Canonical URLs have no trailing slash (`/projects/researchhub`); Cloudflare redirects `/projects/researchhub/` to the canonical form.

## SEO and machine readability

- Semantic landmarks, one `h1` per page, real text for all project facts and technology names (no logo-only content).
- Per-page title, description, canonical URL, Open Graph and Twitter tags; `public/og.png` is the social preview.
- JSON-LD: `Person`, `WebSite`, `ItemList` on the home page; `SoftwareApplication` + `BreadcrumbList` on project pages
  (`creator` / `author` only where a project states a role; no `installUrl`, since nothing is deployed); `ProfilePage` on `/resume`. Only facts present in `src/data/` are emitted.
- `/sitemap.xml`, `/robots.txt` and `/llms.txt` are generated from the same data, so they cannot drift from the site.
