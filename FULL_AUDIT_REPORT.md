# Full Audit — smartdeals.global (production)

**Date:** 2026-05-05
**Production state:** master branch on `pavlopuzikov/smart-deal-global` at commit `193b4830` (overlap fix on top of `a361a3a` Phase A bundle).
**Method:** read-only HTTP probes + Playwright cross-browser harness + axe-core 4.10 (CDN-injected) + JSON-LD parse validation. No source-code changes were made for this audit.

## Executive summary

**Overall grade: A− (88 / 100).** Production is in solid shape. The earlier two deploys this session (variant-b copy lock + UTM hardening + 11 contrast fixes + AR/FR/RU srcset rewrite + engagement-prompt overlap) have left the site with **0 a11y violations across all 4 languages, 0 real console errors, 0 broken assets, valid JSON-LD, full LLM-crawler allowlist, AA-grade security headers**.

The audit surfaces **17 distinct findings** across 18 dimensions. Most are `cosmetic` or `minor`. The 5 most-actionable items are listed below; the rest are documented per-dimension.

| # | Severity | Finding | Where | Effort |
|---|---|---|---|---|
| 1 | serious | Twitter Card meta tags still in production HTML × 4 per page | `index.html` and 3 lang variants | bundled into Track 3 of this session |
| 2 | moderate | FR title 86c, RU title 87c — over the 60-char SERP ideal, will truncate in Google | `js/main.js` `SEO_META.fr.title` and `.ru.title` (via `build-i18n.js`) | 10 min — shorten + rebuild |
| 3 | moderate | EN title 69c, AR title 68c — also over 60c | same | bundled with #2 |
| 4 | minor | CSP missing `frame-ancestors 'self'` directive (defense-in-depth; X-Frame-Options covers) | `netlify.toml` headers | 5 min |
| 5 | minor | AR meta description 130c — slightly under 140-160 ideal | i18n meta description for AR | 5 min |

Everything else is at `cosmetic` severity or working correctly. Pass-list at the bottom records what's in good shape and shouldn't regress.

---

## Per-dimension scorecard

| # | Dimension | Score | Notes |
|---|---|---|---|
| 1 | Performance — Web Vitals + waterfall | 9 | FCP 780ms, Load 1673ms, 19KB gzip transfer, all assets `Cache-Control immutable` for 1y, JS/CSS reasonable sizes. |
| 2 | SEO — every signal, per language | 8 | Hreflang complete, sitemap valid, robots.txt with LLM allowlist, canonical correct. Title length over ideal in all 4 langs (see #2-3). |
| 3 | AEO — answer-engine optimization | 9 | llms.txt present + 4370c, FAQPage schema valid, all AI crawlers allowed, RealEstateAgent + Organization + Place coverage. Could add `Speakable` for voice. |
| 4 | Accessibility — WCAG 2.1 AA | 10 | **0 violations** across EN/AR/FR/RU on axe-core. Color contrast fully passing after the deploy 1 fixes. AAA targeted check pending dedicated tooling pass. |
| 5 | Cross-browser + cross-viewport | 9 | Chromium, Firefox, WebKit all render cleanly at 375/768/1440. Mobile-CTA overlap with WhatsApp float — already fixed in deploy 2. |
| 6 | Security — headers + CSP + integrity | 9 | HSTS preload-eligible, X-Frame-Options + X-Content-Type-Options + Referrer-Policy + Permissions-Policy all set correctly. CSP fully scoped except `frame-ancestors` (see #4). No SRI on CDN scripts (recommended). |
| 7 | Privacy / compliance | 7 | PostHog session-replay active without GDPR cookie banner. EU/UK traffic risk if scaled. `maskInputOptions: { password: true }` confirmed. Privacy policy + terms link in footer not verified. |
| 8 | Analytics integrity | 9 | All 8 documented events fire; UTM register_once now hardened post-deploy 1; locked-b super-property ships on every event. Proper PostHog Experiments still TODO (Track 2). |
| 9 | Internationalization | 9 | All 4 langs render at correct URLs, switcher works, hero copy fully localized (incl. AR RTL). First-visit auto-route present. Date/number format per locale not deeply audited. |
| 10 | Mobile-specific | 9 | viewport meta + safe-area-insets + WhatsApp float bottom positioning all correct. Engagement prompt no longer overlaps the float. |
| 11 | Network resilience | 9 | PostHog blocked → 0 errors. Font Awesome blocked → CSP-blocked but page renders. GSAP/Lenis blocked → site still readable. Property cards still gated on Swiper (known limit). |
| 12 | Resource integrity | 10 | All 4 sitemap URLs + all 22 spot-checked assets return 200. All 12 internal page anchors resolve to existing IDs. |
| 13 | JSON-LD schema validation | 10 | 8 blocks per page × 4 languages = **32 / 32 valid JSON**. Types include RealEstateAgent, FAQPage, Organization, BreadcrumbList, ItemList × 4 (markets, ready, off-plan, country collections). |
| 14 | Social-card preview | 7 | OG tags complete + per-language `og:locale`. `og:image` reachable + immutable-cached. **Twitter tags still present and need removal (Track 3).** WhatsApp/LinkedIn previews use OG and look correct. |
| 15 | Conversion-flow completeness | 9 | All 8 CTA paths route to WhatsApp with prefilled context. Mobile sticky CTA bar + floating WA + per-card CTA all present and tracked. `data-cta-id` attribution clean. |
| 16 | Content quality | 9 | Brand-rule audit clean (zero "price drop / panic / % off" matches across all 4 langs). Variant-b copy server-rendered correctly per language. FAQ count + answers complete. |
| 17 | Runtime quality (production JS) | 8 | No uncaught exceptions across 36 cells of stress test. Memory-leak / observer-cleanup audit not run; recommend a dedicated long-session test before high-traffic launch. |
| 18 | Brand & UX consistency | 9 | Gold accent (#c8956c brand, #a87650 darker, #8e5f3c text-on-light) used consistently. Typography Playfair Display + Inter. Spacing rhythm consistent. Button states defined. |

**Composite weighted average: 88 / 100 (A−).**

---

## Detailed findings (severity + recommendation per item)

### 🟠 Serious

**S-1 — Twitter Card meta tags still present.** 4 `twitter:*` `<meta>` tags ship on every page (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`), 16 total across 4 langs.
- *Severity:* serious — user has decided not to invest in Twitter / X presence.
- *Fix:* remove all `twitter:*` meta tags from `apps/smart-deal-global/index.html`, remove the per-language Twitter rewrites from `build-i18n.js` SEO_META, regenerate, redeploy. Also strip Twitter from `Organization.sameAs` in JSON-LD if present, and from `MARKETING.md`.
- *Status:* **bundled into Track 3 of this session**, shipping in the next commit.

### 🟡 Moderate

**M-1 — Title-tag length over SERP truncation threshold.**
| Lang | Length | Ideal | Status |
|---|---|---|---|
| EN | 69 c | ≤ 60 c | over by 9 |
| AR | 68 c | ≤ 60 c | over by 8 |
| FR | 86 c | ≤ 60 c | over by 26 — significant truncation |
| RU | 87 c | ≤ 60 c | over by 27 — significant truncation |

- *Severity:* moderate — Google truncates at ~60c on desktop, ~50c on mobile. FR/RU users see "Smart Deals Global · Biens sélection..." instead of full brand+keyword.
- *Fix:* edit `apps/smart-deal-global/build-i18n.js` SEO_META block. Suggested replacements:
  - EN: `Smart Deals · Curated Real Estate in 10 Markets` (47 c)
  - AR: `سمارت ديلز · عقارات مختارة في 10 أسواق عالمية` (~50 c)
  - FR: `Smart Deals · Immobilier sélectionné, 10 marchés` (50 c)
  - RU: `Smart Deals · Курируемая недвижимость, 10 рынков` (~52 c)
- *Effort:* 10 min.

**M-2 — AR meta description 130 chars (slightly under 140-160 ideal).**
- *Severity:* moderate — under-utilizing the SERP description block in Arabic SERPs.
- *Fix:* extend by 30-40 chars to add a CTA or nuance. e.g., append "للمشترين الدوليين" or similar.
- *Effort:* 5 min.

### 🔵 Minor

**MN-1 — CSP missing `frame-ancestors 'self'`.**
- Modern CSP3 prefers `frame-ancestors` over the legacy `X-Frame-Options` header. Today the site has `X-Frame-Options: SAMEORIGIN` (which works). Adding `frame-ancestors 'self'` to CSP is defense-in-depth.
- *Fix:* in `apps/smart-deal-global/netlify.toml` add `frame-ancestors 'self'` to the existing CSP string.
- *Effort:* 5 min.

**MN-2 — Subresource Integrity (SRI) not set on CDN scripts.**
- Swiper, GSAP, Lenis, FontAwesome, EmailJS load from `cdn.jsdelivr.net` and `cdnjs.cloudflare.com` without `integrity="sha384-..."` attributes.
- *Severity:* minor — CDN compromise is unlikely but SRI is the recommended belt for static-site safety.
- *Fix:* generate SHA-384 hashes for each pinned CDN URL and add to the `<script integrity="sha384-...">` attributes. Pin the version (already done).
- *Effort:* 30 min for all 5 CDN scripts.

**MN-3 — No GDPR cookie consent banner.**
- PostHog session-replay + UTM cookies are active for all visitors, including EU/UK. Today's traffic is small (24 unique users in 30 days), but if Google Ads / Meta Ads scale, consent becomes legally required for EU/UK personally-identifiable processing.
- *Severity:* minor today, escalates to serious at scale.
- *Fix:* add a cookie-consent component, gate PostHog `init` on consent for `eu-geoip-detected` users.
- *Effort:* 1 day.

**MN-4 — No `Speakable` JSON-LD for voice assistants.**
- Site has FAQPage but no `Speakable` schema. Voice-assistant answer extraction (Alexa, Google Assistant) prefers explicit `Speakable.cssSelector`.
- *Fix:* add `Speakable` block targeting FAQ answers and the lede paragraph.
- *Effort:* 30 min.

**MN-5 — Privacy policy + terms-of-service links not verified in audit.**
- Footer not fully audited for these links. Required to support privacy-policy claims + GDPR posture.
- *Severity:* minor → check, fill in if missing.
- *Effort:* 15 min audit + write content.

### ⚪ Cosmetic

**C-1 — `Article` / `HowTo` schema not used.** Methodology-style content (the "How We Help You Invest" section) is a HowTo opportunity. Adding the schema unlocks rich-result snippets. Effort: 30 min.

**C-2 — No 404 page** (or it wasn't probed). Recommend a branded 404 with "Browse our collection" CTA. Effort: 1 hour.

**C-3 — Date/currency formatting per locale not deeply audited.** AR pages use Western digits (10 markets) instead of Arabic-Indic (١٠ أسواق). User-research dependent — Arabic speakers in Dubai/UAE often prefer Western digits anyway.

**C-4 — Memory-leak / runtime quality** wasn't measured (would need a dedicated long-session test with `performance.memory` snapshots). Recommend a 30-min idle-tab test before high-traffic launch.

**C-5 — Per-property `RealEstateListing` schema** with concrete `Offer.price` and `availability` only emitted for top-listed items in `ItemList`. Adding individual `<script type="application/ld+json">` per property would unlock per-listing rich results. Effort: 1 day (also requires per-property URLs which the site doesn't have today — bigger architectural change).

**C-6 — Lenis smooth-scroll on mobile.** Not deeply tested for jank on lower-end Android. Most luxury sites disable Lenis on mobile by default; verify CPU usage.

**C-7 — `font-display: swap` on Google Fonts.** Verified set on Playfair Display + Inter. Ideal.

---

## Pass-list — what's working correctly (do NOT regress)

- 0 axe-core violations on EN/AR/FR/RU at WCAG 2.1 AA.
- All 4 sitemap URLs return 200.
- 22 / 22 spot-checked assets return 200 (CSS, JS, llms.txt, robots, security.txt, OG image, hero AVIF/WebP/JPG, favicon, one image per market).
- 32 / 32 JSON-LD blocks across 4 langs parse as valid JSON.
- Brand-rule clean: zero "price drop / panic / % off / was → now / cut" anywhere user-facing.
- Hero copy server-rendered correctly per language (variant-b lock survived deploy).
- HSTS preload-eligible (`max-age=31536000; includeSubDomains; preload`).
- Permissions-Policy disables camera / mic / geolocation / payment / usb.
- robots.txt full LLM crawler allowlist (GPTBot, Google-Extended, ChatGPT-User, anthropic-ai, CCBot, PerplexityBot) + sitemap directive.
- All 12 internal page anchors resolve to existing IDs (no dead `#hash` links).
- No-JS H1 + title server-rendered correctly (SEO crawlers see real content).
- PostHog blocked → 0 errors (graceful degradation).
- Cache-Control: 1-year `immutable` on all images/CSS/JS bundles, `must-revalidate` on HTML.
- Brotli compression active.
- HTTP/2 negotiated.
- Engagement prompt no longer overlaps WhatsApp float (deploy 2 fix verified).
- Variant-b hero copy localized in all 4 languages (deploy 1 fix verified).
- AR/FR/RU srcset paths now correct (`../images/...`) — deploy 1 fix verified.

---

## Roadmap items (not for this session)

The audit surfaced two architectural opportunities worth queuing for later:

1. **Per-property URLs** (`/properties/{slug}/`). Today property cards are JS-rendered — Yandex/Baidu may not crawl. Per-property URLs unlock individual rich results, deeper SEO, and reuse for the proposed-variant's `dealThesis` system. Estimated effort: 4 days.
2. **Schema graph consolidation.** 8 separate `<script type="application/ld+json">` blocks could be unified into a single `@graph` for cleaner crawl. Effort: 2 hours.

These are referenced by the proposed-variant audit (`apps/smart-deal-global-proposed/AEO_SEO_AUDIT.md`) and shouldn't be done independently — they pair with the variant promotion.

---

## Verification of this audit

Reproduce by running:
```bash
python C:/Users/Pavlo/AppData/Local/Temp/sdg-audit/audit.py
```

That script captures: sitemap URL reachability, all critical assets, per-language meta probe, JSON-LD validity, CSP audit, llms.txt quality, HTTP/2 + Brotli + HTTP/3 negotiation, brand-rule audit. Results JSON at `C:/Users/Pavlo/AppData/Local/Temp/sdg-audit/audit_results.json`.

Cross-browser axe results from earlier in this session: `C:/Users/Pavlo/AppData/Local/Temp/sdg-stress/production-v2/report.json` (36 cells, 0 a11y violations).

---

## PostHog Utilization & A/B Roadmap (Track 2 — to be appended after deploy)

This section will be filled after the Track 2 deploy lands (3 PostHog Experiments + 4 cohorts + funnel dashboard + JS flag wiring). For now, see the plan file at `C:\Users\Pavlo\.claude\plans\reserach-the-following-site-sprightly-seahorse.md` for the locked execution sequence.
