# Post-Deploy Stress Test Report — Smart Deals Global LIVE (smartdeals.global)

**Deploy 1:** commit `a361a3ac` — variant-b copy promoted to default, UTM hardening, language-aware ad routing, srcset 404 fix, 11 contrast violations resolved.

**Deploy 2 (in flight):** commit `d02b39af` — engagement-prompt overlap fix (raised from `bottom: 5rem` to `bottom: 7rem` so it clears the floating WhatsApp button on desktop, plus mobile equivalent at `5.5rem` for the 48px mobile WA float).

## Deploy 1 — production stress findings

Stress test ran against `https://smartdeals.global/` after the first push landed. 36 cells: 3 browsers × 3 viewports × 4 languages.

| Check | Result |
|---|---|
| Real console errors (excluding PostHog/CSP/Firefox cookie warnings) | **0** |
| Failed network requests | **0** |
| A11y violations (axe-core, WCAG 2.0 A+AA) | **0 across all 4 languages** |
| FCP (chromium EN) | 852 ms |
| Load event | 1634 ms |
| Transfer size (gzipped) | 19 KB |
| No-JS smoke — H1 server-rendered | "Your Next Investment, Curated Worldwide" ✓ |
| No-JS smoke — title | ✓ |
| PostHog blocked → page still renders | 0 errors ✓ |

### Benign console messages observed (not action items)

- **CSP `font-src data:` block** on Font Awesome's inline base64-WOFF fallback. Pre-existing CSP rule; affects only Firefox's secondary font-loading path. Real fonts (woff2 from cdnjs) load fine. Could be addressed by adding `data:` to `font-src` in `netlify.toml`.
- **`dmn_chk_*` cookie domain rejections** in Firefox. PostHog session-replay cookie debugger output. Cosmetic.

These are unchanged from before the deploy and are not blockers.

## Deploy 2 — engagement-prompt overlap fix

User reported a screenshot showing the engagement prompt's bottom-right corner overlapping the floating WhatsApp button. Diagnosed:

- `.whatsapp-float` desktop footprint = `bottom: 2rem` + `60×60px` = covers 32–92px from the bottom.
- `.engagement-prompt` was at `bottom: 5rem` (80px), so the prompt's lower edge sat **inside** the WhatsApp float's footprint.

Fix:

- Desktop: `bottom: 5rem` → `bottom: 7rem` (112px, ~20px clearance above the 92px float top).
- Mobile (≤768px): `bottom: calc(4.5rem + env(safe-area-inset-bottom))` → `calc(5.5rem + env(safe-area-inset-bottom))` (~88px, clears the 48px mobile WA float).

Same fix mirrored to `apps/smart-deal-global-proposed/`.

**Status: deploy 2 verified live.** Production CSS now serves `.engagement-prompt { bottom: 7rem; }`. Re-run stress test (`production-v2`) results:

| Check | Result |
|---|---|
| Real console errors | **0** |
| Benign/pre-existing console errors (CSP `font-src data:`, Firefox PH cookie) | 60 (unchanged) |
| A11y violations across EN/AR/FR/RU | **0** |
| FCP / Load / Transfer | 780ms / 1673ms / 19 KB |
| No-JS H1 server-rendered | "Your Next Investment, Curated Worldwide" ✓ |
| PostHog blocked | 0 errors |

Visual confirmation (cropped bottom-right of `https://smartdeals.global/` after forcing the prompt + float visible): the prompt now sits clearly above the WhatsApp button with ~20px clearance — see `overlap_fixed.png` in the stress-test artifact directory.

## Deploy 2 timeline

| Time (UTC) | Event |
|---|---|
| 12:30 | User reported overlap; commit `d02b39af` (mirrored to remote as `193b483`) |
| 12:31 | Subtree push #2 launched |
| 12:43 | Master sync confirmed at `193b483`; build hook fired |
| 12:44 | Production CSS serves `bottom: 7rem` |
| 12:45 | Production-v2 stress test: 0 real errors, 0 a11y violations |

## Production deploy log (this session)

| Time (UTC) | Event |
|---|---|
| 12:09 | Pre-deploy stress test caught 1 srcset 404 + 11 contrast violations |
| 12:14 | All 12 issues fixed in `apps/smart-deal-global/` |
| 12:21 | Re-run: 0 errors, 0 a11y violations across 4 langs locally |
| 12:24 | Commit `ec32f385` (Phase A bundle) → subtree push to `pavlopuzikov/smart-deal-global` |
| 12:25 | Master sync push → Netlify auto-build triggered |
| 12:26 | Build hook fired explicitly as backup |
| 12:27 | Production smartdeals.global serves variant-b copy server-side |
| 12:28 | Production cross-browser stress test → 0 a11y violations across 4 langs |
| 12:29 | User reported engagement-prompt × WA-float overlap (screenshot) |
| 12:30 | Overlap diagnosed + fixed in CSS, commit `d02b39af` |
| 12:31 | Subtree push #2 in flight |
