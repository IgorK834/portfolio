// Converts the approved design files (design/source/*.dc.html, produced by Claude Design)
// into plain static HTML in design/reference/, so they can be screenshotted by Playwright
// and compared with the real site. The design runtime is not needed: the design is plain
// HTML/CSS plus a few template holes, which are resolved to their default state here.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const BOARDS = {
  'Main': 'home-desktop',
  'Home-Mobile': 'home-mobile',
  'Case-Study': 'case-desktop',
  'Case-Study-Mobile': 'case-mobile',
};

mkdirSync('design/reference', { recursive: true });

for (const [source, target] of Object.entries(BOARDS)) {
  let html = readFileSync(`design/source/${source}.dc.html`, 'utf8');

  // <helmet> holds the page <style>/<link>: move it into <head>.
  const helmet = html.match(/<helmet>([\s\S]*?)<\/helmet>/)?.[1] ?? '';
  html = html.replace(/<helmet>[\s\S]*?<\/helmet>/, '');
  html = html.replace('</head>', `${helmet}</head>`);

  html = html.replace('<script src="./support.js"></script>', '');
  html = html.replace(/<\/?x-dc>/g, '');
  html = html.replace(/<script type="text\/x-dc"[\s\S]*?<\/script>/, '');

  // Template holes: default state (accent = blue, mobile menu closed).
  html = html
    .replaceAll('{{ acc }}', '#2369F5')
    .replaceAll('{{ on }}', '#FFFFFF')
    .replaceAll('{{ soft }}', '#E7EEFE')
    .replaceAll('aria-expanded="{{ open }}"', 'aria-expanded="false"')
    .replaceAll('{{ menuLabel }}', 'Menu')
    .replace(/<sc-if value="\{\{ open \}\}"[^>]*>[\s\S]*?<\/sc-if>/g, '')
    .replace(/<sc-if value="\{\{ closed \}\}"[^>]*>([\s\S]*?)<\/sc-if>/g, '$1')
    .replace(/ onClick="\{\{ \w+ \}\}"/g, '');

  // The site is now full-bleed (no grey frame, no outer padding, no shadow). Remove the frame from the
  // reference as well, so the design's 1360px site area can be compared with the site at a 1360px viewport.
  html = html.replace(
    '</head>',
    '<style>body{background:#fff!important}#top{padding:0!important}.site{box-shadow:none!important;max-width:none!important}</style></head>',
  );

  writeFileSync(`design/reference/${target}.html`, html);
  console.log(`design/reference/${target}.html`);
}
