# Smart Deals Global — Landing Page

Public-facing marketing landing page for **Smart Deals Global** — a curated real-estate brokerage that sources, negotiates, and closes property deals across 10 international markets (Dubai, Abu Dhabi, Monaco, Paris, Switzerland, Thailand, Azerbaijan, and others).

**Production domain:** https://smartdealsglobal.com

---

## What this page is

A single-scroll marketing site that:

1. Presents ~50 curated property listings grouped by market (ready / off-plan / country collections).
2. Surfaces the value proposition of each listing ("Smart Deal" rationale: best price, high appreciation, high yield, ready value, early access, off-market).
3. Drives every CTA toward WhatsApp (primary) / phone / email for direct sales conversations.
4. Serves SEO-indexable content in **4 languages** (English, Arabic, French, Russian) via pre-rendered URL variants at `/`, `/ar/`, `/fr/`, `/ru/`.

It is **not** a transactional site. There is no checkout, no user accounts, no property-specific detail pages at the routing level — the landing page's job is lead capture and market education, then hand-off to a sales advisor via WhatsApp with pre-filled context (property name, location, section).

---

## Who it is for

- **Primary audience:** high-net-worth international real-estate buyers researching multi-market portfolios.
- **Primary traffic sources:** Google (EN), Google (AR/FR/RU in-region), social-share link previews (WhatsApp, LinkedIn, Telegram), paid ads.
- **Primary conversion:** WhatsApp message initiated from a property card or contact section.

---

## Directory structure

```
smart-deal-global-audit/
├── index.html                 Pre-rendered English variant (canonical)
├── ar/index.html              Pre-rendered Arabic variant (dir=rtl)
├── fr/index.html              Pre-rendered French variant
├── ru/index.html              Pre-rendered Russian variant
├── css/styles.css             Theme, layout, component styles
├── js/main.js                 Property data, render functions, i18n dict (143 keys × 4 langs), interactions
├── images/                    Hero and per-market imagery
├── properties/                Per-market property imagery (azerbaijan/, monaco/, offplan/, paris/, ready/, switzerland/, thailand/)
├── sitemap.xml                4-URL sitemap with hreflang alternates
├── robots.txt
├── build-i18n.js              Generator for all 4 language variants (Node, zero deps)
├── SEO_CHANGES_REPORT.md      Record of SEO/GEO remediation applied to this page
└── README.md                  This file
```

---

## Tech choices

- **Static HTML + vanilla JS + CSS.** No framework, no bundler, no runtime. Deploys as plain files to any static host or CDN (nginx, S3+CloudFront, Vercel static, etc.).
- **CDN libraries** loaded from jsDelivr / cdnjs: Swiper (carousels), GSAP + ScrollTrigger (animations), Lenis (smooth scroll), Vanilla Tilt (card tilt), Font Awesome, Google Fonts (Playfair Display + Inter), EmailJS (lead-notification email relay).
- **No backend.** Lead capture is handled client-side via EmailJS (transactional email) and WhatsApp deep links; no server code runs here.
- **i18n via generator.** Translations live in a single dict (`I18N_DICT` in `js/main.js`, 143 keys × 4 languages). The build script bakes the right language into each variant's `<head>` and visible body text, so crawlers, social-card bots, and JS-disabled clients all see localized content.

---

## Regenerating the language variants

After editing the translation dict in `js/main.js` or the SEO metadata in `build-i18n.js`:

```bash
cd smart-deal-global-audit
node build-i18n.js
```

This overwrites `index.html`, `ar/index.html`, `fr/index.html`, `ru/index.html`, and `sitemap.xml` with fresh output. Run it any time copy changes. The script is deterministic and has no external dependencies.

---

## Local preview

Any static server works. Two quick options:

```bash
# Python 3
cd smart-deal-global-audit && python -m http.server 8080

# Node (no deps needed if you have npx)
cd smart-deal-global-audit && npx serve -p 8080
```

Then open http://localhost:8080/ for English, `/ar/`, `/fr/`, `/ru/` for the other variants.

---

## Deployment notes

- **URL structure assumption:** the web server must serve `/ar/` → `/ar/index.html` (directory-index fallback). All default static hosts do this; nginx needs `index index.html;` in the location block.
- **Relative asset paths** in subdirectory variants point to `../images/`, `../css/`, `../js/`, `../properties/` so the four variants share a single asset bundle.
- **Canonicals** are self-referential per variant. Do not add server-side canonical rewrites — they'd override the hreflang signal.
- **robots.txt** allows everything except `/properties/README.md`; sitemap is linked from it.

---

## SEO / GEO

See [SEO_CHANGES_REPORT.md](SEO_CHANGES_REPORT.md) for the full list of SEO signals applied (hreflang, per-variant `<title>` / OG / Twitter, Places JSON-LD with real geo coordinates for 7 markets, translated FAQ JSON-LD questions, etc.).

**Quick facts:**
- 4 indexed URLs, one per language, each with reciprocal hreflang alternates + `x-default`.
- Per-variant `og:locale` for correct social-card rendering.
- Places ItemList JSON-LD covers Dubai, Abu Dhabi, Monte Carlo, Paris, Montreux, Phuket, Baku — unlocks local-relevance beyond the single Dubai geo tag.

---

## Known limitations

- Property cards (50+ listings) are rendered client-side from in-file JS arrays. Googlebot handles this; Yandex and Baidu may not. If RU/CN SEO become priorities, pre-render cards server-side.
- FAQ JSON-LD **questions** are translated; **answers** remain English in the structured data. Low-risk cosmetic gap for non-English rich-result snippets.
- Property listings are hard-coded in `js/main.js`. When the inventory changes, this file is the single source of truth — no CMS integration yet.
