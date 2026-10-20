// Generates public/og.png (1200x630 social preview) and public/favicon.ico from the design's palette.
// One-off asset generation; the results are committed. Needs network for the Google Fonts stylesheet.
//   node scripts/generate-brand-assets.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from '@playwright/test';

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@500;700&family=League+Spartan:wght@900&display=swap" rel="stylesheet">
<style>
  *{box-sizing:border-box;margin:0}
  body{width:1200px;height:630px;background:#fff;font-family:'Instrument Sans',sans-serif;color:#17191D;overflow:hidden}
  .card{position:absolute;inset:0;background:#fff}
  .v{position:absolute;top:0;bottom:0;width:2px;background:#D7DEE7}
  .h{position:absolute;left:0;right:0;height:2px;background:#D7DEE7}
  .blue{position:absolute;right:0;top:170px;width:520px;height:330px;background:#2369F5}
  .red{position:absolute;left:0;top:330px;width:283px;height:170px;background:#FE3D3C}
  .yellow{position:absolute;left:283px;bottom:0;width:138px;height:80px;background:#FFB523}
  .mark{position:absolute;left:44px;top:40px;width:56px;height:56px;background:#17191D;color:#fff;font:900 26px 'League Spartan';display:flex;align-items:center;justify-content:center}
  .role{position:absolute;left:44px;top:125px;font:900 30px/1.08 'League Spartan';text-transform:uppercase}
  .name{position:absolute;left:44px;bottom:70px;font:900 122px/0.9 'League Spartan';text-transform:uppercase;letter-spacing:.005em;white-space:nowrap}
  .url{position:absolute;left:44px;top:250px;font:700 15px 'Instrument Sans';letter-spacing:.16em;text-transform:uppercase}
</style></head><body>
<div class="card">
  <div class="v" style="left:283px"></div><div class="v" style="left:421px"></div><div class="v" style="left:1065px"></div>
  <div class="h" style="top:170px"></div><div class="h" style="top:500px"></div>
  <div class="blue"></div><div class="red"></div><div class="yellow"></div>
  <div class="mark">IK</div>
  <div class="role">Software Engineer /<br>Full-Stack Engineer</div>
  <div class="url">igorkadziela.dev</div>
  <div class="name">Igor Kadziela</div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'public/og.png' });

// favicon: 32x32 PNG wrapped in an ICO container
const svg = readFileSync('public/favicon.svg', 'utf8');
const icon = await browser.newPage({ viewport: { width: 32, height: 32 } });
await icon.setContent(`<body style="margin:0">${svg.replace('<svg ', '<svg width="32" height="32" ')}</body>`);
const png = await icon.screenshot({ clip: { x: 0, y: 0, width: 32, height: 32 } });
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(1, 4); // ICONDIR: 1 image
header[6] = 32; header[7] = 32; header.writeUInt16LE(1, 10); header.writeUInt16LE(32, 12); // entry: 32x32, 32-bit
header.writeUInt32LE(png.length, 14); header.writeUInt32LE(22, 18);
writeFileSync('public/favicon.ico', Buffer.concat([header, png]));
await browser.close();
console.log('public/og.png, public/favicon.ico');
