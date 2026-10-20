// Device / resolution audit. Loads every route at many viewports and reports well-known layout problems:
// horizontal overflow, overlapping text, clipped text, tiny tap targets, distorted images, console errors.
//   node scripts/audit.mjs [baseUrl] [engine: chromium|webkit|firefox]
import { chromium, webkit, firefox } from '@playwright/test';

const BASE = process.argv[2] ?? 'http://127.0.0.1:4324';
const ENGINE = { chromium, webkit, firefox }[process.argv[3] ?? 'chromium'];
const ROUTES = process.env.AUDIT_ROUTES ? process.env.AUDIT_ROUTES.split(',') : ['/', '/projects/researchhub', '/projects/parcel-analysis', '/projects/obiekt-io', '/resume', '/cv', '/404'];

// [name, width, height, deviceScaleFactor, touch]
const DEVICES = [
  ['Galaxy Fold (folded)', 280, 653, 3, true], ['iPhone SE 1', 320, 568, 2, true], ['Android small', 360, 640, 3, true],
  ['iPhone 12/13/14', 390, 844, 3, true], ['Pixel 7', 412, 915, 2.6, true], ['iPhone Pro Max', 430, 932, 3, true],
  ['Phone landscape SE', 568, 320, 2, true], ['Phone landscape', 667, 375, 2, true], ['Phone landscape L', 844, 390, 3, true], ['Phone landscape XL', 932, 430, 3, true],
  ['Foldable unfolded', 717, 512, 2.6, true], ['Small tablet', 600, 960, 2, true], ['iPad mini', 744, 1133, 2, true], ['iPad', 768, 1024, 2, true],
  ['iPad 10th', 820, 1180, 2, true], ['iPad Pro 11', 834, 1194, 2, true], ['iPad Pro 12.9', 1024, 1366, 2, true],
  ['Tablet landscape', 1024, 768, 2, true], ['iPad Pro landscape', 1194, 834, 2, true], ['iPad Pro 12.9 landscape', 1366, 1024, 2, true],
  ['Breakpoint-1', 767, 900, 1, false], ['Breakpoint+1', 768, 900, 1, false], ['Below desktop', 1199, 800, 1, false], ['Desktop min', 1200, 800, 1, false],
  ['Laptop 1280x720', 1280, 720, 1, false], ['Laptop 1366x768', 1366, 768, 1, false], ['MacBook 13', 1440, 900, 2, false], ['Laptop 1536x864', 1536, 864, 1.25, false],
  ['Desktop 1680', 1680, 1050, 1, false], ['Full HD', 1920, 1080, 1, false], ['QHD', 2560, 1440, 1, false], ['Ultrawide', 3440, 1440, 1, false], ['4K', 3840, 2160, 1, false],
  ['Browser zoom 200% on FHD', 960, 540, 2, false], ['Browser zoom 300% on FHD', 640, 360, 3, false],
];

const analyse = () => {
  const out = { overflow: null, beyond: [], overlaps: [], clipped: [], tiny: [], images: [], tap: [] };
  const root = document.documentElement;
  if (root.scrollWidth > root.clientWidth) out.overflow = `${root.scrollWidth} > ${root.clientWidth}`;
  const vw = root.clientWidth;
  const visible = (el) => { const s = getComputedStyle(el); return s.visibility !== 'hidden' && s.display !== 'none' && s.opacity !== '0'; };
  const isSr = (el) => { const r = el.getBoundingClientRect(); return r.width <= 1 && r.height <= 1; };
  const clippedBy = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { if (p.classList.contains('site')) return null; const s = getComputedStyle(p); if (/(hidden|clip|auto|scroll)/.test(s.overflowX)) return p; } return null; };
  const label = (el) => `${el.tagName.toLowerCase()}${el.className && typeof el.className === 'string' ? '.' + el.className.split(' ')[0] : ''} "${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 28)}"`;

  // text rectangles (one per text node line box), with their owner element
  const rects = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n; (n = walker.nextNode()); ) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement;
    if (!el || !visible(el) || isSr(el) || el.closest('script,style,noscript,[aria-hidden="true"] svg') ) continue;
    if (el.closest('.sr') || el.closest('[hidden]')) continue;
    const th = el.closest('thead'); if (th && th.getBoundingClientRect().width <= 2) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width < 2 || r.height < 2) continue;
      rects.push({ el, x: r.left + scrollX, y: r.top + scrollY, r: r.right + scrollX, b: r.bottom + scrollY, w: r.width, h: r.height });
    }
  }
  // text beyond the viewport on the right (and not clipped by an overflow ancestor)
  for (const t of rects) {
    if (t.r > vw + 1 && !clippedBy(t.el)) out.beyond.push(label(t.el) + ` right=${Math.round(t.r)}`);
    if (t.x < -1) out.beyond.push(label(t.el) + ` left=${Math.round(t.x)}`);
  }
  // overlapping text: different elements, neither contains the other, rects intersect noticeably
  rects.sort((a, b) => a.y - b.y);
  for (let i = 0; i < rects.length; i++) {
    const a = rects[i];
    for (let j = i + 1; j < rects.length && rects[j].y < a.b; j++) {
      const b = rects[j];
      if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ox = Math.min(a.r, b.r) - Math.max(a.x, b.x), oy = Math.min(a.b, b.b) - Math.max(a.y, b.y);
      // ignore glyph-box slop: require a real intersection relative to the smaller box
      if (ox > 3 && oy > Math.min(a.h, b.h) * 0.35) out.overlaps.push(`${label(a.el)}  ×  ${label(b.el)}  (${Math.round(ox)}×${Math.round(oy)}px at y=${Math.round(a.y)})`);
    }
  }
  // clipped text: overflow-hidden boxes whose content is wider/taller than the box
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el) || isSr(el) || el.clientWidth <= 1 || el.closest('.sr, .top-label')) continue;
    const s = getComputedStyle(el);
    if (/(hidden|clip)/.test(s.overflowX) && el.scrollWidth > el.clientWidth + 2 && (el.textContent || '').trim() && !el.closest('.site') === false) {
      const hasText = [...el.querySelectorAll('*')].some((c) => c.children.length === 0 && c.textContent.trim()) || el.children.length === 0;
      if (hasText && !el.matches('.site, .go, .nx, .nav-link, .lk, .ix, .shot')) out.clipped.push(label(el) + ` scrollW=${el.scrollWidth} clientW=${el.clientWidth}`);
    }
    if (s.textOverflow === 'ellipsis' && el.scrollWidth > el.clientWidth) out.clipped.push('ellipsis ' + label(el));
  }
  // images distorted
  for (const img of document.querySelectorAll('img')) {
    const r = img.getBoundingClientRect(); const fit = getComputedStyle(img).objectFit;
    if (img.naturalWidth && fit === 'fill' && Math.abs(r.width / r.height - img.naturalWidth / img.naturalHeight) > 0.03) out.images.push(label(img));
    if (!img.complete || img.naturalWidth === 0) out.images.push('broken ' + label(img));
  }
  return out;
};

const tapScan = () => {
  const bad = [];
  for (const el of document.querySelectorAll('a[href], button, summary, [role=button]')) {
    const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect(); if (r.width < 1) continue;
    // inline text links inside paragraphs are exempt (WCAG 2.5.8)
    if (s.display === 'inline' && el.closest('p, li, dd')) continue;
    if (r.height < 24 || r.width < 24) bad.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}" ${Math.round(r.width)}×${Math.round(r.height)}`);
  }
  return bad;
};

const browser = await ENGINE.launch();
let total = 0;
const summary = [];
for (const [name, width, height, dpr, touch] of DEVICES) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: dpr, hasTouch: touch, isMobile: touch && ENGINE !== firefox });
  for (const route of ROUTES) {
    const page = await context.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(BASE + route, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // lazy screenshots below the fold have not loaded yet: load them all, so "broken" means broken
    await page.evaluate(async () => {
      const imgs = [...document.querySelectorAll('img')];
      imgs.forEach((img) => (img.loading = 'eager'));
      await Promise.all(imgs.map((img) => (img.complete ? null : new Promise((done) => ((img.onload = done), (img.onerror = done))))));
    });
    const res = await page.evaluate(analyse);
    if (touch) res.tap = await page.evaluate(tapScan);
    const issues = [];
    if (res.overflow) issues.push('H-OVERFLOW ' + res.overflow);
    for (const x of new Set(res.beyond)) issues.push('OFF-SCREEN TEXT ' + x);
    for (const x of new Set(res.overlaps)) issues.push('TEXT OVERLAP ' + x);
    for (const x of new Set(res.clipped)) issues.push('CLIPPED ' + x);
    for (const x of new Set(res.images)) issues.push('IMAGE ' + x);
    for (const x of new Set(res.tap)) issues.push('SMALL TAP TARGET ' + x);
    for (const e of errors) issues.push('CONSOLE ' + e);
    if (issues.length) { total += issues.length; console.log(`\n✗ ${name} ${width}×${height}  ${route}`); issues.slice(0, 12).forEach((i) => console.log('    ' + i)); if (issues.length > 12) console.log(`    … +${issues.length - 12} more`); }
    await page.close();
  }
  await context.close();
  summary.push(name);
}
await browser.close();
console.log(total === 0 ? `\n✓ ${ENGINE.name()}: ${DEVICES.length} devices × ${ROUTES.length} routes, no issues` : `\n${total} issue(s) found (${ENGINE.name()})`);
