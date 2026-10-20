import { expect, test, type Page } from '@playwright/test';

const ROUTES = [
  { path: '/', h1: /Igor Kadziela/ },
  { path: '/projects/researchhub', h1: /ResearchHub/ },
  { path: '/projects/parcel-analysis', h1: /System Analizy Uwarunkowań Działki/ },
  { path: '/projects/obiekt-io', h1: /obiekt\.io/ },
  { path: '/resume', h1: /Igor Kadziela/ },
];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'phone', width: 390, height: 844 },
];

/** Collect console errors and uncaught exceptions while a page is used. */
function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

for (const route of ROUTES) {
  test.describe(route.path, () => {
    test('loads with one H1, a title, a canonical URL and no console errors', async ({ page }) => {
      const errors = trackErrors(page);
      const response = await page.goto(route.path);
      expect(response?.ok()).toBe(true);
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toContainText(route.h1);
      await expect(page).toHaveTitle(/Igor Kadziela/);
      const canonical = await page.locator('link[rel=canonical]').getAttribute('href');
      expect(canonical).toBe(`https://igorkadziela.dev${route.path}`);
      expect(await page.locator('meta[name=description]').getAttribute('content')).toBeTruthy();
      expect(errors).toEqual([]);
    });

    for (const viewport of VIEWPORTS) {
      test(`has no horizontal overflow on ${viewport.name} (${viewport.width}px)`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.goto(route.path);
        const { scrollWidth, clientWidth } = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
      });
    }

    test('has landmarks, alt text and structured data that parses', async ({ page }) => {
      await page.goto(route.path);
      // one banner, one main, one contentinfo (headers inside articles are not page banners)
      await expect(page.getByRole('banner')).toHaveCount(1);
      await expect(page.getByRole('main')).toHaveCount(1);
      await expect(page.getByRole('contentinfo')).toHaveCount(1);
      await expect(page.locator('nav[aria-label]')).not.toHaveCount(0);
      // every <img> has an alt attribute; decorative SVG is hidden from assistive technology
      expect(await page.locator('img:not([alt])').count()).toBe(0);
      expect(await page.locator('svg:not([aria-hidden=true])').count()).toBe(0);
      const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
      expect(scripts.length).toBeGreaterThan(0);
      for (const text of scripts) expect(() => JSON.parse(text)).not.toThrow();
    });

    test('has no broken internal links', async ({ page, request }) => {
      await page.goto(route.path);
      const hrefs = await page.$$eval('a[href]', (links) => links.map((a) => a.getAttribute('href') ?? ''));
      const internal = [...new Set(hrefs.filter((h) => h.startsWith('/')).map((h) => h.split('#')[0] || '/'))];
      for (const href of internal) {
        const response = await request.get(href);
        expect(response.status(), `${href} should resolve`).toBeLessThan(400);
      }
      // in-page anchors point at elements that exist
      const anchors = [...new Set(hrefs.filter((h) => h.startsWith('#') && h.length > 1))];
      for (const anchor of anchors) await expect(page.locator(anchor)).toHaveCount(1);
    });
  });
}

test.describe('homepage content', () => {
  test('shows the three projects, in order, as real text (also without JavaScript)', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');
    const titles = await page.locator('article h2').allTextContents();
    expect(titles).toEqual(['ResearchHub', 'System Analizy Uwarunkowań Działki', 'obiekt.io']);
    await expect(page.getByText('Source-grounded collaborative AI workspace for students and researchers.').first()).toBeVisible();
    await expect(page.getByText('Spatial / Investment Parcel Analysis Platform').first()).toBeVisible();
    // navigation is still usable without JavaScript
    await expect(page.getByRole('link', { name: 'Projects', exact: true }).first()).toBeVisible();
    await context.close();
  });

  test('shows screenshots and source instead of live demos, and marks the third project as in development', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /demo/i })).toHaveCount(0);
    const repositories: Record<string, string> = {
      '#project-01': 'https://github.com/IgorK834/researchhub',
      '#project-02': 'https://github.com/IgorK834/system_analizy_uwarunkowan_dzialki',
    };
    for (const [id, url] of Object.entries(repositories)) {
      await expect(page.locator(`${id} a[href="${url}"]`).first()).toBeAttached();
    }
    // the in-development project has a private repository: stated plainly, with no link to it
    const inDevelopment = page.locator('#project-03');
    await expect(inDevelopment.getByText('In development').first()).toBeVisible();
    await expect(inDevelopment.getByText('Private repository')).toBeVisible();
    await expect(inDevelopment.locator('a[href*="github.com"]')).toHaveCount(0);
    await expect(page.locator('#project-02').getByText('Experimental R&D')).toBeVisible();
  });

  test('project links open the case studies', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'View ResearchHub case study' }).first().click();
    await expect(page).toHaveURL(/\/projects\/researchhub$/);
    await expect(page.locator('h1')).toContainText('ResearchHub');
    await page.getByRole('link', { name: /Next project/ }).click();
    await expect(page).toHaveURL(/\/projects\/parcel-analysis$/);
  });

  test('desktop navigation scrolls to sections', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.locator('header').getByRole('link', { name: 'Stack' }).click();
    await expect(page).toHaveURL(/#stack$/);
    await expect(page.locator('#stack')).toBeInViewport();
  });

  test('exposes the key sections with headings', async ({ page }) => {
    await page.goto('/');
    for (const heading of ['Selected work', 'Engineering stack', 'About', 'Resume', 'Contact']) {
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeAttached();
    }
  });
});

test.describe('contact details', () => {
  test('show the e-mail, GitHub and what I am open to; LinkedIn says it is coming', async ({ page }) => {
    await page.goto('/');
    const contact = page.locator('#contact');
    await expect(contact.getByRole('link', { name: /i\.kadziela03@gmail\.com/i })).toHaveAttribute('href', 'mailto:i.kadziela03@gmail.com');
    await expect(contact.getByRole('link', { name: /github\.com\/IgorK834/i })).toHaveAttribute('href', 'https://github.com/IgorK834');
    await expect(contact.getByText('Coming soon')).toBeVisible();
    await expect(contact.getByText(/Internship or Junior Full-Stack Engineer/)).toBeVisible();
    await expect(contact.getByText(/open to relocating/)).toBeVisible();
    await expect(page.locator('body')).not.toContainText('TO BE FILLED');
  });

  test('llms.txt and the resume repeat them', async ({ page, request }) => {
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms).toContain('Email: i.kadziela03@gmail.com');
    expect(llms).toContain('GitHub: https://github.com/IgorK834');
    expect(llms).toContain('Work mode:');
    await page.goto('/resume');
    await expect(page.getByText('Remote, hybrid or on-site').first()).toBeVisible();
  });
});

test.describe('printable CV', () => {
  test('is a bare, unindexed page with the experience, studies and a print button', async ({ page }) => {
    await page.goto('/cv');
    await expect(page.locator('h1')).toHaveText('Igor Kadziela');
    expect(await page.locator('meta[name=robots]').getAttribute('content')).toBe('noindex');
    await expect(page.getByRole('banner')).toHaveCount(0); // no site chrome
    await expect(page.getByRole('button', { name: /Print/ })).toBeVisible();
    for (const text of ['Iturri Poland', 'Kaks s.c. and MKA Sp. z o.o.', '11.2025 – 06.2026', 'University of Bielsko-Biała', 'kaksbb.pl', 'mkabb.pl']) {
      await expect(page.getByText(text).first()).toBeAttached();
    }
  });

  test('hides the toolbar on paper', async ({ page }) => {
    await page.emulateMedia({ media: 'print' });
    await page.goto('/cv');
    await expect(page.locator('[data-toolbar]')).toBeHidden();
  });

  test('tailors to a job advertisement: highlights keywords, moves skills first, replaces the headline', async ({ page }) => {
    await page.goto('/cv/fullstack?hl=Docker,FastAPI&title=Junior%20Frontend%20Developer');
    await expect(page.locator('[data-headline]')).toHaveText('Junior Frontend Developer');
    await expect(page.locator('mark.kw').first()).toBeVisible();
    const engineering = page.locator('.skill-group', { hasText: 'Engineering' }).locator('li').first();
    await expect(engineering).toHaveText('Docker');
    // typing in the box re-highlights and keeps the address shareable
    await page.locator('[data-hl-input]').fill('React');
    await expect(page).toHaveURL(/hl=React/);
    await expect(page.locator('mark.kw').first()).toHaveText('React');
    // variants carry the tailoring along
    await expect(page.getByRole('link', { name: 'IoT and kiosk systems' })).toHaveAttribute('href', /\/cv\/iot\?.*hl=React/);
  });

  test('every variant loads and is linked from the resume page', async ({ page }) => {
    for (const path of ['/cv/fullstack', '/cv/iot']) {
      const response = await page.goto(path);
      expect(response?.ok()).toBe(true);
    }
    await page.goto('/resume');
    await expect(page.getByRole('link', { name: 'Print-ready CV' })).toHaveAttribute('href', '/cv');
  });
});

test.describe('case studies', () => {
  test('link to the source repository, say the project is not deployed, and never offer a demo', async ({ page }) => {
    await page.goto('/projects/researchhub');
    const source = page.getByRole('link', { name: 'View ResearchHub source code on GitHub' });
    await expect(source).toHaveAttribute('href', 'https://github.com/IgorK834/researchhub');
    await expect(page.getByText('Not deployed').first()).toBeVisible();
    await expect(page.getByRole('link', { name: /live demo|demo/i })).toHaveCount(0);

    await page.goto('/projects/obiekt-io');
    await expect(page.getByText('In development').first()).toBeVisible();
    await expect(page.locator('a[href*="github.com"]')).toHaveCount(0);
  });
});

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('opens, navigates, closes on selection and on Escape', async ({ page }) => {
    await page.goto('/');
    const toggle = page.locator('[data-nav-toggle]'); // its label switches between "Menu" and "Close"
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).toBeHidden();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toBeVisible();
    await nav.getByRole('link', { name: /Projects/ }).click();
    await expect(page).toHaveURL(/#projects$/);
    await expect(nav).toBeHidden();

    await toggle.click();
    await expect(nav).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(nav).toBeHidden();
    await expect(toggle).toBeFocused();
  });
});

test.describe('accessibility basics', () => {
  test('skip link is the first focusable element and becomes visible', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: 'Skip to content' });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
  });

  test('focus is visible on links', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const outline = await page.evaluate(() => getComputedStyle(document.activeElement as Element).outlineStyle);
    expect(outline).not.toBe('none');
  });

  test('prefers-reduced-motion removes transitions', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto('/');
    const durations = await page.evaluate(() =>
      [...document.querySelectorAll('header a, .go, article a')].map((el) => getComputedStyle(el).transitionDuration),
    );
    expect(durations.length).toBeGreaterThan(0);
    for (const duration of durations) expect(duration).toMatch(/^0s(, 0s)*$/);
    await context.close();
  });
});

test.describe('machine-readable files', () => {
  test('sitemap, robots and llms.txt are consistent', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text();
    for (const path of ['/', '/projects/researchhub', '/projects/parcel-analysis', '/projects/obiekt-io', '/resume']) {
      expect(sitemap).toContain(`<loc>https://igorkadziela.dev${path}</loc>`);
    }
    expect(sitemap).not.toContain('/cv'); // tailored CVs are for sending, not for search
    const robots = await (await request.get('/robots.txt')).text();
    expect(robots).toContain('Sitemap: https://igorkadziela.dev/sitemap.xml');
    const llms = await (await request.get('/llms.txt')).text();
    expect(llms).toContain('# Igor Kadziela');
    for (const slug of ['researchhub', 'parcel-analysis', 'obiekt-io']) expect(llms).toContain(`https://igorkadziela.dev/projects/${slug}`);
    expect(llms).toContain('https://github.com/IgorK834/researchhub');
    expect(llms).toContain('In development');
    expect(llms).not.toMatch(/demo url|live demo/i);
  });

  test('structured data describes the person, the site and the projects without invented facts', async ({ page }) => {
    await page.goto('/');
    const home = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent() ?? '{}');
    const types = home['@graph'].map((node: { '@type': string }) => node['@type']);
    expect(types).toEqual(['Person', 'WebSite', 'ItemList']);
    const person = home['@graph'][0];
    expect(person.name).toBe('Igor Kadziela');
    expect(person.worksFor.name).toBe('Iturri Poland');
    expect(person).not.toHaveProperty('alumniOf');

    await page.goto('/projects/obiekt-io');
    const nodes = await page.locator('script[type="application/ld+json"]').allTextContents();
    const app = nodes.map((n) => JSON.parse(n)).find((n) => n['@type'] === 'SoftwareApplication');
    expect(app.name).toBe('obiekt.io');
    // projects are not deployed, and a private repository has no code link
    expect(app).not.toHaveProperty('installUrl');
    expect(nodes.map((n) => JSON.parse(n)).some((n) => n['@type'] === 'SoftwareSourceCode')).toBe(false);

    await page.goto('/projects/researchhub');
    const hub = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((n) => JSON.parse(n));
    expect(hub.find((n) => n['@type'] === 'SoftwareSourceCode').codeRepository).toBe('https://github.com/IgorK834/researchhub');
  });

  test('the resume page offers the CV PDF and lists the experience', async ({ page, request }) => {
    await page.goto('/resume');
    const download = page.getByRole('link', { name: /Download CV/ });
    await expect(download).toHaveAttribute('href', '/resume/igor-kadziela-cv.pdf');
    const pdf = await request.get('/resume/igor-kadziela-cv.pdf');
    expect(pdf.ok()).toBe(true);
    expect(pdf.headers()['content-type']).toContain('pdf');
    await expect(page.getByRole('heading', { level: 2, name: 'Experience' })).toBeVisible();
    await expect(page.getByText('IT Intern, IT department · Iturri Poland')).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Projects' })).toBeVisible();
    await expect(page.getByText('In development').first()).toBeVisible();
  });
});
