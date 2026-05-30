# chips-site

Marketing site for [Chips](https://chips.dev) — invisible commerce infrastructure for the agentic web. A2A-native enterprise agents, a consent-mediated cross-enterprise context bridge, and privacy-preserving network learning.

Built with Astro 6 + pure CSS. Deploys statically to Cloudflare Pages.

## Stack

- **Astro 6** — static site generator, zero JS by default
- **Pure CSS** — sage-cream + forest + emerald-mint editorial palette, no Tailwind
- **EB Garamond** (Plantin surrogate) + **JetBrains Mono** (Berkeley Mono surrogate), self-hosted via `@fontsource-variable`
- **MDX** for `/docs/*`
- **Sharp** for generating brand assets (favicon, OG image)

## Develop

```bash
bun install
bun run dev          # → http://localhost:4321
bun run build        # → dist/
bun run preview      # serve dist/
bun run gen:assets   # regenerate favicon.svg, og-default.png, apple-touch-icon.png
```

## Layout

```
src/
├── pages/             # routed pages
│   ├── index.astro
│   ├── how-it-works.astro
│   ├── network-learning.astro
│   ├── for-enterprises.astro
│   ├── for-platforms.astro
│   ├── pricing.astro
│   ├── manifesto.astro
│   └── docs/
│       ├── index.astro
│       └── [...slug].astro
├── layouts/           # Base + Doc
├── components/        # BrandWordmark, MonoLabel, StatusPill, KPICard,
│                      # PillarCard, Hero, FeatureRow, PricingTable,
│                      # LogoStrip, Callout, Button, Nav, Footer
├── content/
│   ├── docs/          # MDX content collection
│   └── ...
└── styles/
    ├── tokens.css     # CSS variables (colors, type, scale)
    ├── fonts.css      # fontsource imports
    └── base.css       # reset + element defaults + utilities
```

## Deploy

Connected to Cloudflare Pages. Every push to `main` triggers a deploy.

- Build command: `bun run build`
- Output: `dist/`
- Custom domain: `chips.dev` (apex)

## Positioning source

All copy and structure trace to `prompts/06.1-chips-as-invisible-commerce-infrastructure.md` in the main Chips product repo. Three pillars: **hosted A2A runtime**, **cross-enterprise context bridge**, **network learning with Level B priors**.

> The bridge is the moat people see. Network learning is the moat that compounds.
