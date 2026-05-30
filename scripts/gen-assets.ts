#!/usr/bin/env bun
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');

const BG = '#e8f0e8';
const INK = '#0f1f17';
const EMERALD = '#3e8e5e';
const SLATE = '#5a6760';
const HAIR = '#d1dcd3';

/* ─────────── Favicon · 64×64 SVG ─────────── */
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="${BG}" rx="6"/>
  <text x="32" y="48"
        font-family="'EB Garamond', 'Plantin MT Pro', Georgia, serif"
        font-style="italic" font-weight="500" font-size="52"
        text-anchor="middle" fill="${INK}"
        letter-spacing="-1">C</text>
  <circle cx="49" cy="46" r="3.4" fill="${EMERALD}"/>
</svg>`;
writeFileSync(resolve(PUBLIC, 'favicon.svg'), faviconSvg);
console.log('✓ favicon.svg');

/* ─────────── OG image · 1200×630 ─────────── */
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${BG}"/>

  <!-- decorative dot grid (very subtle) -->
  <defs>
    <pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="0" cy="0" r="0.8" fill="${HAIR}" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#g)" opacity="0.65" />

  <!-- top strip -->
  <line x1="80" y1="92" x2="1120" y2="92" stroke="${HAIR}" stroke-width="1"/>

  <line x1="80" y1="66" x2="118" y2="66" stroke="${EMERALD}" stroke-width="1.5"/>
  <text x="128" y="71"
        font-family="'JetBrains Mono', 'Berkeley Mono', monospace"
        font-size="13" letter-spacing="3" fill="${SLATE}" font-weight="500">
    INVISIBLE COMMERCE INFRASTRUCTURE · A2A · 2026
  </text>

  <g transform="translate(984,52)">
    <rect width="136" height="28" rx="3" fill="#dce9df" stroke="${EMERALD}" stroke-width="1"/>
    <circle cx="14" cy="14" r="3.5" fill="${EMERALD}"/>
    <text x="26" y="19"
          font-family="'JetBrains Mono', monospace"
          font-size="11" letter-spacing="2" fill="${EMERALD}" font-weight="500">
      NETWORK · LIVE
    </text>
  </g>

  <!-- big serif headline · three lines · paradox at the heart of 06.1 -->
  <text x="80" y="248"
        font-family="'EB Garamond', 'Plantin MT Pro', Georgia, serif"
        font-weight="400" font-size="118" fill="${INK}" letter-spacing="-3">
    A protocol
  </text>
  <text x="80" y="358"
        font-family="'EB Garamond', Georgia, serif"
        font-weight="400" font-size="118" fill="${INK}" letter-spacing="-3">
    the consumer
  </text>
  <text x="80" y="468"
        font-family="'EB Garamond', Georgia, serif"
        font-weight="400" font-size="118" fill="${INK}" letter-spacing="-3">
    <tspan font-style="italic" fill="${EMERALD}">never</tspan> sees<tspan fill="${EMERALD}" font-style="normal">.</tspan>
  </text>

  <!-- bottom strip -->
  <line x1="80" y1="540" x2="1120" y2="540" stroke="${HAIR}" stroke-width="1"/>

  <text x="80" y="588"
        font-family="'EB Garamond', Georgia, serif"
        font-style="italic" font-weight="500" font-size="38" fill="${INK}"
        letter-spacing="-0.5">
    Chips<tspan fill="${EMERALD}" font-style="normal">.</tspan>
  </text>

  <text x="1120" y="576"
        font-family="'JetBrains Mono', monospace"
        font-size="12" letter-spacing="2.5" fill="${SLATE}"
        text-anchor="end">
    SCHEDULE A CALL · CAL.COM/EUGENE-YE
  </text>
  <text x="1120" y="598"
        font-family="'JetBrains Mono', monospace"
        font-size="12" letter-spacing="2.5" fill="${EMERALD}"
        text-anchor="end" font-weight="500">
    CHIPS.DEV
  </text>
</svg>`;

await sharp(Buffer.from(ogSvg))
  .resize(1200, 630)
  .png({ quality: 95, compressionLevel: 9 })
  .toFile(resolve(PUBLIC, 'og-default.png'));
console.log('✓ og-default.png');

/* ─────────── Apple touch icon · 180×180 ─────────── */
const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${BG}"/>
  <text x="90" y="135"
        font-family="'EB Garamond', Georgia, serif"
        font-style="italic" font-weight="500" font-size="148"
        text-anchor="middle" fill="${INK}" letter-spacing="-3">C</text>
  <circle cx="138" cy="128" r="9.5" fill="${EMERALD}"/>
</svg>`;

await sharp(Buffer.from(appleTouchSvg))
  .resize(180, 180)
  .png({ quality: 95 })
  .toFile(resolve(PUBLIC, 'apple-touch-icon.png'));
console.log('✓ apple-touch-icon.png');

/* ─────────── robots.txt ─────────── */
const robots = `User-agent: *
Allow: /

Sitemap: https://chips.dev/sitemap-index.xml
`;
writeFileSync(resolve(PUBLIC, 'robots.txt'), robots);
console.log('✓ robots.txt');

console.log('\nAll assets generated.');
