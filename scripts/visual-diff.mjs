// Visual regression against the approved design.
//
//   npm run visual                 # all pairs
//   npm run visual -- home-mobile  # one pair
//
// Needs a running site (npm run dev, or npm run preview) built/started with
// PUBLIC_SHOW_PLACEHOLDERS=true so the design's "[TO BE FILLED]" placeholders are rendered
// exactly like the design. Writes side-by-side images to visual-report/.
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';

const BASE = process.env.SITE_URL ?? 'http://localhost:4321';

// reference file -> route on the real site, viewport the design was drawn for.
// The site is full-bleed and scales with the window: at 1360px (desktop) and 390px (mobile) one design pixel is one CSS pixel.
const PAIRS = {
  'home-desktop': { route: '/', width: 1360, height: 900 },
  'home-mobile': { route: '/', width: 390, height: 844 },
  'case-desktop': { route: '/projects/researchhub', width: 1360, height: 900 },
  'case-mobile': { route: '/projects/researchhub', width: 390, height: 844 },
};

const only = process.argv[2];
const names = only ? [only] : Object.keys(PAIRS);
mkdirSync('visual-report', { recursive: true });

async function shoot(browser, url, { width, height }) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({ content: '*{transition:none!important;animation:none!important;caret-color:transparent!important}html{scroll-behavior:auto!important}' });
  const buffer = await page.screenshot({ fullPage: true });
  await context.close();
  return PNG.sync.read(buffer);
}

function crop(png, w, h) {
  const out = new PNG({ width: w, height: h });
  PNG.bitblt(png, out, 0, 0, Math.min(w, png.width), Math.min(h, png.height), 0, 0);
  return out;
}

const browser = await chromium.launch();
for (const name of names) {
  const pair = PAIRS[name];
  if (!pair) throw new Error(`Unknown pair "${name}". Known: ${Object.keys(PAIRS).join(', ')}`);

  const ref = await shoot(browser, pathToFileURL(resolve(`design/reference/${name}.html`)).href, pair);
  const impl = await shoot(browser, BASE + pair.route, pair);

  const w = Math.max(ref.width, impl.width);
  const h = Math.min(ref.height, impl.height);
  const a = crop(ref, w, h);
  const b = crop(impl, w, h);
  const diff = new PNG({ width: w, height: h });
  const mismatched = pixelmatch(a.data, b.data, diff.data, w, h, { threshold: 0.1, includeAA: false });

  // Per-band report: where do the differences cluster?
  const BAND = 300;
  const bands = [];
  for (let y = 0; y < h; y += BAND) {
    let count = 0;
    const end = Math.min(h, y + BAND);
    for (let row = y; row < end; row++) {
      for (let x = 0; x < w; x++) {
        const i = (row * w + x) * 4;
        if (diff.data[i] === 255 && diff.data[i + 1] === 0 && diff.data[i + 2] === 0) count++;
      }
    }
    bands.push(`${y}-${end}: ${((count / (w * (end - y))) * 100).toFixed(1)}%`);
  }

  // side-by-side: reference | implementation | diff
  const sheet = new PNG({ width: w * 3 + 40, height: h, fill: true });
  PNG.bitblt(a, sheet, 0, 0, w, h, 0, 0);
  PNG.bitblt(b, sheet, 0, 0, w, h, w + 20, 0);
  PNG.bitblt(diff, sheet, 0, 0, w, h, w * 2 + 40, 0);
  writeFileSync(`visual-report/${name}.png`, PNG.sync.write(sheet));

  console.log(`\n${name}  (${pair.width}px)`);
  console.log(`  height  reference ${ref.height}px   site ${impl.height}px   delta ${impl.height - ref.height}px`);
  console.log(`  pixels  ${mismatched} different of ${w * h}  (${((mismatched / (w * h)) * 100).toFixed(2)}%)`);
  console.log(`  bands   ${bands.join('   ')}`);
}
await browser.close();
