// One-off: regenerate public/og-default.png from the brand palette.
// Run with: pnpm tsx scripts/generate-og.ts
//
// Only needs to be re-run if the palette or copy changes.
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const W = 1200;
const H = 630;

const BG = '#F6F1E4';
const INK = '#14352A';
const ACCENT = '#8A4A0E';
const LINE = '#D2C7A8';

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${BG}"/>
  <rect x="0" y="0" width="${W}" height="14" fill="${ACCENT}"/>
  <rect x="0" y="${H - 14}" width="${W}" height="14" fill="${ACCENT}"/>
  <g font-family="Verdana, Geneva, sans-serif" text-anchor="middle">
    <text x="${W / 2}" y="${H / 2 - 30}" font-size="110" font-weight="700" fill="${INK}">
      Cat Dad Games
    </text>
    <text x="${W / 2}" y="${H / 2 + 60}" font-size="38" font-weight="400" fill="${INK}" opacity="0.85">
      A curated, ad-free home for browser games anyone can play.
    </text>
    <text x="${W / 2}" y="${H - 70}" font-size="26" font-weight="600" fill="${ACCENT}">
      No ads · No trackers · No accounts
    </text>
  </g>
</svg>`;

const buffer = await sharp(Buffer.from(svg)).png({ quality: 90 }).toBuffer();
const outPath = resolve(process.cwd(), 'public', 'og-default.png');
writeFileSync(outPath, buffer);
console.log(`Wrote ${outPath} (${buffer.length} bytes, ${W}x${H})`);
