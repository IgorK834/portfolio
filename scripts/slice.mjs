// Crop a band out of a tall screenshot so it can be inspected: node scripts/slice.mjs in.png y height out.png [x width]
import { readFileSync, writeFileSync } from 'node:fs';
import { PNG } from 'pngjs';

const [input, y, height, output, x = '0', width] = process.argv.slice(2);
const src = PNG.sync.read(readFileSync(input));
const w = Number(width ?? src.width - Number(x));
const h = Math.min(Number(height), src.height - Number(y));
const out = new PNG({ width: w, height: h });
PNG.bitblt(src, out, Number(x), Number(y), w, h, 0, 0);
writeFileSync(output, PNG.sync.write(out));
console.log(`${output} ${w}x${h} (source ${src.width}x${src.height})`);
