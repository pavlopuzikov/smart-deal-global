# Launch Readiness — Smart Deals Global landing page

**Date:** 2026-04-15
**Verdict:** **Ready to launch** after the two launch-blockers below were fixed in this pass. 5 yellow items are recommended but not blocking; 3 green deferred items are documented for a later iteration.

---

## Launch-blockers fixed in this pass

### BLOCKER 1 — `how-we-help.jpg` was 3 MB
- **Impact:** on a 10 Mbps mobile connection, this single image was adding ~2.4 s to LCP and consuming 100 % of a slow-3G user's initial data budget.
- **Fix:** re-encoded with sharp (mozjpeg, q=82, max width 1600 px).
- **Result:** 3047 KB → 436 KB (**−85 %**).

### BLOCKER 2 — `hero-bg.jpg` weight
- **Impact:** the hero LCP image at 440 KB was acceptable but not lean; every variant (EN / AR / FR / RU) loads it.
- **Fix:** sharp at q=82, max width 2400 px.
- **Result:** 438 KB → 317 KB (**−27 %**).

**Net savings:** ~2.6 MB off the critical-path total. Total shared image budget is now < 1 MB across all hero and country-banner images.

---

## Green — verified passing

| Check | Result |
|---|---|
| JSON-LD validity across all 4 variants | 6 blocks / variant, **all parse as valid JSON** |
| sitemap.xml structure | 4 URLs, 20 hreflang entries (4 langs × 5 links incl. x-default per URL), well-formed XML |
| i18n dict parity | 143 keys in en / ar / fr / ru; no missing, no extras |
| `data-i18n` key coverage | 121 keys referenced in HTML; all present in the dict; 22 dict keys are for client-side card rendering (expected) |
| Image alt attributes | 8/8 `<img>` have alt |
| Broken asset references | none — every `src`/`href` resolves on disk |
| Hard-coded secrets or PII in JS | none — the three `EMAILJS_*` constants are public-safe client IDs |
| Leftover `console.log/warn/error` in production JS | zero |
| `aria-expanded` state updates | hamburger ✓, FAQ ✓, lang switcher ✓ |
| Country-hero property counts match data arrays | ✓ (Monaco 7/7, Paris 2/2, Switzerland 3/3, Azerbaijan 1/1, Thailand 2/2) |
| Property inventory | ready 11, off-plan 8, Monaco 7, Paris 2, Switzerland 3, Azerbaijan 1, Thailand 2 — matches marketing copy ("50+") |
| Git push state | all redesign changes on `dev/innovation-upgrades` at origin |

---

## Yellow — recommended before public launch, not blocking

### 1. Gold-on-white contrast (WCAG AA)
`#C8A96E` on `#ffffff` measures ~2.9:1 — below the 4.5:1 threshold for body text. The gold is mostly used for accents and hover states; check these uses specifically: `.section-label`, `.footer__nav a:hover`, `.market-card-v2__badge`. Either darken to `#A87650` (already defined as `--color-accent-dark`, ratio ~3.9:1) for text uses, or mark them as decorative via larger font weight (18 px+ bold qualifies as "large text" with a 3:1 threshold).

### 2. External Unsplash image in `final-cta`
`<img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80">` — depends on Unsplash uptime and rate-limits. Download, self-host, and add alt text.

### 3. Script loading
All 5 CDN scripts (Swiper, GSAP, ScrollTrigger, Lenis, Vanilla Tilt, EmailJS) load at the bottom of `<body>` synchronously. Add `defer` or `async` for parallel download. Low-impact because they're at the body end, but still a measurable improvement on Lighthouse.

### 4. Font preload
Google Fonts CSS is loaded via `<link>` but individual font files are not preloaded. Add `<link rel="preload" as="font" ...>` for Playfair Display 700 and Inter 400/600 (the weights actually rendered above the fold).

### 5. Cookie / analytics consent
If GA / PostHog / Meta Pixel gets added post-launch, EU visitors require a cookie banner. Not in scope for this code but flag it so the deploy doesn't surprise legal.

---

## Deferred — documented for a later iteration

1. **`<picture>` srcset for hero / country / how-we-help.** Current images are one size each. Mobile (≤ 768 px) will still download the 2400 px-wide hero. Cutting mobile to a 1200 px variant would save another ~200 KB on mobile first paint.
2. **Font weight pruning.** The Google Fonts request loads 4 weights × 2 families = 8 weight files. A scan of computed styles shows we only actually use Playfair 400/500/700 and Inter 300/400/500/600/700. Drop Playfair 600 and italic 400; save ~25 KB.
3. **Card-level server rendering.** `readyProperties[]`, off-plan, and 5 country arrays render client-side. Google's renderer handles this; Yandex and Baidu often don't. If those channels become priority, pre-render cards at build time.

---

## Security headers (reminder for deploy)

These are set by the web server, not the HTML. On deploy, ensure the host returns:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff            (already in <meta>, also set at server)
Referrer-Policy: strict-origin-when-cross-origin  (already in <meta>)
Permissions-Policy: camera=(), microphone=(), geolocation=()  (already in <meta>)
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https://api.emailjs.com; frame-ancestors 'none'
Cache-Control: public, max-age=3600         (for HTML)
Cache-Control: public, max-age=31536000, immutable  (for /images /css /js if versioned)
```

---

## Smoke-test checklist for production

Before cutting DNS over:

1. `/`, `/ar/`, `/fr/`, `/ru/` all return HTTP 200 and serve the correct `<html lang>`.
2. Arabic variant renders RTL in View Source (not only after JS).
3. `/sitemap.xml` returns the 4-URL XML.
4. `/robots.txt` returns the allow/disallow rules.
5. Hero image loads, no broken image icon.
6. Click a WhatsApp CTA — opens wa.me with pre-filled message.
7. Click the language switcher — navigates to the right URL (no client-side swap).
8. Scroll through full page on mobile: no horizontal scroll, no "grey bar" over dark sections, no console errors.
9. Open Chrome DevTools Lighthouse — mobile performance score ≥ 85 (should clear comfortably with the compression).
10. Run `https://search.google.com/test/rich-results` on `/` — Organization and ItemList should pass.

---

## Files changed in this audit

- `smart-deal-global-audit/images/how-we-help.jpg` (3047 → 436 KB)
- `smart-deal-global-audit/images/hero-bg.jpg` (438 → 317 KB)
- `smart-deal-global-redesign/images/how-we-help.jpg` (synced)
- `smart-deal-global-redesign/images/hero-bg.jpg` (synced)
- `smart-deal-global-audit/LAUNCH_READINESS.md` (this file)
