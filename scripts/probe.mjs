// Print bounding boxes of elements: node scripts/probe.mjs <url-or-reference-name> <width> <selector> [selector...]
import { chromium } from '@playwright/test';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const [target, width, ...selectors] = process.argv.slice(2);
const url = target.startsWith('http') ? target : pathToFileURL(resolve(`design/reference/${target}.html`)).href;
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: Number(width), height: 900 } })).newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
for (const sel of selectors) {
  const rows = await page.$$eval(sel, (els) => els.slice(0, 12).map((e) => {
    const r = e.getBoundingClientRect();
    return `${Math.round(r.left)},${Math.round(r.top + scrollY)}  ${Math.round(r.width)}x${Math.round(r.height)}  ${(e.textContent || '').trim().slice(0, 28).replace(/\s+/g, ' ')}`;
  }));
  console.log(sel); rows.forEach((r) => console.log('   ' + r));
}
await browser.close();
