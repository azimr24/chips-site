#!/usr/bin/env bun
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';
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

  <!-- top hairline + kicker -->
  <line x1="80" y1="84" x2="1120" y2="84" stroke="${HAIR}" stroke-width="1"/>
  <text x="80" y="68"
        font-family="'JetBrains Mono', 'Berkeley Mono', monospace"
        font-size="14" letter-spacing="3" fill="${SLATE}">
    CHIPS · V0 · 2026 · INVISIBLE COMMERCE INFRASTRUCTURE
  </text>

  <!-- live-network pill -->
  <g transform="translate(932,52)">
    <rect width="188" height="32" rx="3" fill="#dce9df" stroke="${EMERALD}" stroke-width="1"/>
    <circle cx="14" cy="16" r="3.5" fill="${EMERALD}"/>
    <text x="26" y="21"
          font-family="'JetBrains Mono', monospace"
          font-size="11" letter-spacing="1.5" fill="${EMERALD}">
      NETWORK · LIVE
    </text>
  </g>

  <!-- big serif headline -->
  <text x="80" y="240"
        font-family="'EB Garamond', 'Plantin MT Pro', Georgia, serif"
        font-style="italic" font-weight="500" font-size="92"
        fill="${EMERALD}" letter-spacing="-2">
    Invisible
  </text>
  <text x="80" y="240"
        font-family="'EB Garamond', Georgia, serif"
        font-weight="400" font-size="92" fill="${INK}" letter-spacing="-2">
    <tspan dx="380">commerce</tspan>
  </text>
  <text x="80" y="335"
        font-family="'EB Garamond', Georgia, serif"
        font-weight="400" font-size="92" fill="${INK}" letter-spacing="-2">
    infrastructure for the
  </text>
  <text x="80" y="430"
        font-family="'EB Garamond', Georgia, serif"
        font-style="italic" font-weight="500" font-size="92"
        fill="${EMERALD}" letter-spacing="-2">
    agentic web<tspan fill="${EMERALD}" font-style="normal">.</tspan>
  </text>

  <!-- bottom hairline + wordmark + tag -->
  <line x1="80" y1="510" x2="1120" y2="510" stroke="${HAIR}" stroke-width="1"/>

  <text x="80" y="572"
        font-family="'EB Garamond', Georgia, serif"
        font-style="italic" font-weight="500" font-size="44" fill="${INK}"
        letter-spacing="-0.5">
    Chips<tspan fill="${EMERALD}" font-style="normal">.</tspan>
  </text>

  <text x="1120" y="558"
        font-family="'JetBrains Mono', monospace"
        font-size="13" letter-spacing="2.5" fill="${SLATE}"
        text-anchor="end">
    A2A-NATIVE · LINUX FOUNDATION WG
  </text>
  <text x="1120" y="582"
        font-family="'JetBrains Mono', monospace"
        font-size="13" letter-spacing="2.5" fill="${EMERALD}"
        text-anchor="end">
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
