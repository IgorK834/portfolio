// Overflow sweep: every route at the required viewports plus intermediate widths.
//   node scripts/responsive-check.mjs [baseUrl]
// Also writes full-page screenshots to visual-report/responsive/<route>-<width>.png when SHOTS=1.
import { mkdirSync } from 'node:fs';
import { chromium } from '@playwright/test';

const BASE = process.argv[2] ?? 'http://localhost:4321';
const ROUTES = ['/', '/projects/researchhub', '/projects/parcel-analysis', '/projects/obiekt-io', '/resume', '/cv', '/404'];
const WIDTHS = [1920, 1440, 1280, 1199, 1100, 1024, 900, 768, 767, 600, 430, 390, 360, 320];

const browser = await chromium.launch();
let problems = 0;
if (process.env.SHOTS) mkdirSync('visual-report/responsive', { recursive: true });
for (const route of ROUTES) {
  for (const width of WIDTHS) {
    const page = await (await browser.newContext({ viewport: { width, height: 900 } })).newPage();
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const info = await page.evaluate(() => {
      const root = document.documentElement;
      const offenders = [];
      for (const el of document.querySelectorAll('body *')) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.right > root.clientWidth + 1 && getComputedStyle(el).position !== 'fixed') {
          // ignore descendants of intentionally clipped boxes
          let clipped = false;
          for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
            const o = getComputedStyle(p).overflowX;
            if (o === 'hidden' || o === 'clip' || o === 'auto' || o === 'scroll') { clipped = true; break; }
          }
          if (!clipped) offenders.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} right=${Math.round(r.right)}`);
        }
      }
      return { scrollW: root.scrollWidth, clientW: root.clientWidth, offenders: offenders.slice(0, 4) };
    });
    const bad = info.scrollW > info.clientW || info.offenders.length > 0;
    if (bad) {
      problems++;
      console.log(`✗ ${route} @${width}: scrollWidth ${info.scrollW} > ${info.clientW}  ${info.offenders.join(' | ')}`);
    }
    if (process.env.SHOTS) await page.screenshot({ path: `visual-report/responsive/${route.replace(/\W+/g, '_')}-${width}.png`, fullPage: true });
    await page.context().close();
  }
}
await browser.close();
console.log(problems === 0 ? `✓ no horizontal overflow (${ROUTES.length} routes × ${WIDTHS.length} widths)` : `${problems} problem(s)`);
