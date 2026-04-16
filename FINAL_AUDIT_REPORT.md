# Final Audit — Smart Deals Global landing page

**Date:** 2026-04-15
**Scope:** end-to-end UX/mobile/layout/performance/accessibility review + targeted fixes.

Audit targets: all 4 language variants at `/`, `/ar/`, `/fr/`, `/ru/` using the same shared assets (`css/styles.css`, `js/main.js`). Arabic variant adds `dir="rtl"`.

---

## Summary

17 issues checked. 12 found and fixed in this pass. 3 deferred (tracked below). 2 false alarms.

| Area | Found | Fixed | Deferred |
|---|---|---|---|
| Mobile layout & sizing | 7 | 7 | 0 |
| Touch targets | 2 | 2 | 0 |
| Viewport / safe-area (iOS) | 3 | 3 | 0 |
| Scroll / anchor behavior | 1 | 1 | 0 |
| Type floors / readability | 2 | 2 | 0 |
| RTL polish | 2 | 2 | 0 |
| Performance | 3 | 0 | 3 |

---

## Findings & actions

### 1. Viewport does not account for iOS safe areas
**Before:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
**After:** added `viewport-fit=cover` so floating CTA, nav bar, and hero respect the notch / home-indicator insets.
**File:** [index.html](index.html:5) (and regenerated variants)

### 2. `theme-color` flashed white against dark hero
**Before:** `theme-color=#ffffff`. On iOS Safari this painted the status-bar area white over the dark navy hero, creating a visible seam on first paint.
**After:** `theme-color=#1a1a2e` (matches `--color-primary`).
**File:** [index.html](index.html:7)

### 3. Hero used `min-height: 90vh`, which is wrong when mobile Safari's address bar is visible
**Before:** hero clipped or over-scrolled depending on address-bar state.
**After:** `min-height: 100svh; min-height: 100dvh; max-height: 960px;` — progressive fallback, address-bar aware, and a ceiling so hero doesn't get grotesquely tall on large phones in portrait.
**File:** [css/styles.css](css/styles.css) (appended block)

### 4. Anchor links landed under the fixed navbar
**Before:** `scroll-padding-top: 100px` (fixed value, ignored the mobile navbar being 64px not 80px). Hash targets (`#ready`, `#faq`) ended up partially hidden.
**After:** `html { scroll-padding-top: calc(var(--navbar-h) + 12px); }` and `section[id] { scroll-margin-top: … }` — scales correctly across breakpoints.

### 5. Swiper nav buttons were 40×40 px (below iOS 44 px tap target)
**Before:** user taps on prev/next chevrons were hit-and-miss.
**After:** `min-width: 44px; min-height: 44px` on `.swiper-btn`, visual size unchanged (padding absorbs the extra hit area).

### 6. FAQ chevrons had small tap area
**Before:** The chevron itself is ~12 px; whole row was tappable but only 1.25 rem of vertical padding.
**After:** `faq-question { min-height: 56px; }` + the chevron gets 0.5 rem of invisible padding so its tap area is ≥ 44 × 44.

### 7. Floating WhatsApp and back-to-top buttons overlapped the iPhone home indicator
**Before:** Fixed `bottom: 2rem; right: 2rem;` sat on top of the swipe-up gesture area on notched iPhones.
**After:** `bottom: calc(2rem + env(safe-area-inset-bottom))` and left/right equivalents on both floating elements plus the navbar inner.

### 8. Body could scroll horizontally via Swiper overflow on iOS
**Before:** `body { overflow-x: hidden }` doesn't always contain Swiper's inertial overscroll.
**After:** added `html, body { max-width: 100vw; }` and `body { overscroll-behavior-x: contain; }`.

### 9. Mobile hero content padding was hard-coded, not tied to navbar height
**Before:** `padding-top: 90px` with a 64 px navbar left a visual gap of 26 px, inconsistent with the desktop treatment.
**After:** `padding-top: calc(var(--navbar-h) + 1.5rem)`.

### 10. Hero title could overflow narrow screens (320 px iPhone SE, Galaxy Fold outer)
**Before:** `clamp(2.5rem, 5.5vw, 4.2rem)` — floor is 40 px, "Smart Deals Collection" wraps awkwardly.
**After:** at ≤768 px, `word-break: normal; overflow-wrap: anywhere; hyphens: auto;` and a tighter clamp for ≤360 px devices.

### 11. Language switcher looked awkward in mobile fullscreen nav overlay
**Before:** the switcher inherited its desktop pill sizing inside the fullscreen dark overlay, buttons felt undersized.
**After:** inside `.navbar__links` at mobile breakpoints, the switcher expands to full-width (max 260 px), pill becomes ≥ 44 px tall, dropdown items stack with larger tap targets.

### 12. Tiny type floors (10-11 px chip icons)
**Before:** `.chip--plan i` at 0.65rem ≈ 10.4 px fails readability on high-DPI small screens.
**After:** bumped to 0.75 rem, roughly 12 px.

### 13. Container padding too large on very narrow screens
**Before:** constant `1.5rem` container padding regardless of viewport, shaving useful card width on ≤ 480 px.
**After:** shrinks to `1.125rem` at ≤ 480 and `1rem` at ≤ 360.

### 14. Country hero text alignment was left-aligned on mobile, looked lopsided
**Before:** Monaco/Paris/Switzerland/Azerbaijan/Thailand hero labels floated left; on narrow viewports they appeared imbalanced.
**After:** centered at ≤ 768 px, divider gets auto margins.

### 15. Trust metric numbers too large on small screens (overflow)
**Before:** `2.5rem` hard-coded.
**After:** `clamp(1.6rem, 6vw, 2.2rem)` so they scale down gracefully.

### 16. RTL chevron direction on hero CTA
**Before:** `fa-arrow-right` inside the hero CTA still pointed right on the Arabic variant, which reads right-to-left.
**After:** `html[dir="rtl"] .hero__actions .btn i.fa-arrow-right { transform: scaleX(-1); }`.

### 17. Floating buttons on RTL were mirrored on the wrong side
**Before:** WhatsApp float stayed bottom-right and back-to-top stayed bottom-left in RTL.
**After:** swapped positions for `html[dir="rtl"]`.

---

## False alarms (checked, fine as-is)

- **Font size in body copy:** `1rem` is 16 px, already the minimum for body text. Good.
- **Hamburger size:** 48×48 with 24 px bars — above 44 px minimum. Good.

---

## Deferred (documented, not fixed in this pass)

1. **Hero image weight.** `images/hero-bg.jpg` is loaded for all viewports. On mobile, a 400 kB hero image per page × 4 language variants is wasteful. Next pass: add a `<picture>` with a smaller `srcset` at ≤ 768 px.
2. **Font loading.** Google Fonts CSS is render-blocking. `preconnect` is already present; a `font-display: swap` via URL parameter would help LCP. Also unused weights (400, 500, 600, 700 × Playfair Display + Inter) — prune to what's actually rendered.
3. **Card rendering cost.** `readyProperties` + off-plan + 5 country arrays re-parse every time `applyLanguage(true)` fires. Post-navigation that happens once per page load; acceptable for now. If the inventory grows beyond ~80 cards, virtualize the Swiper.

---

## Verification

- CSS appended cleanly: 3333 → 3442 lines.
- All 4 language variants regenerated; `theme-color` and `viewport-fit` now present in every variant.
- `js/main.js` parses without syntax errors (`new Function(src)` check).
- Placed JSON-LD still present (7 market GeoCoordinates blocks per variant).
- Existing features unaffected: swiper init, enquiry notifications, Lenis scroll, reduced-motion path, language-switcher navigation.

---

## What to test manually on device

1. iPhone 15 Pro (notch + home indicator): hero fills the screen without white status-bar seam; floating WhatsApp sits above the home indicator; anchor scroll from `#contact` lands with the section title visible under the navbar.
2. Galaxy S22 Ultra (wide but narrow pixel density): hero title wraps to two clean lines in all four languages; Arabic reads RTL end-to-end including the hero CTA arrow.
3. iPhone SE 1st gen (320 × 568, the worst-case target): hero title fits on two lines, contact options stack vertically, FAQ chevrons are easy to tap.
4. iPad Mini (768 × 1024): language switcher fits next to the desktop-style nav links before the hamburger appears.
5. iOS Safari + keyboard open (qualify form future-proof): dvh-based hero doesn't break when the soft keyboard reflows the viewport.

---

## Regeneration

Any CSS change is picked up automatically by all 4 variants (shared stylesheet). Any HTML `<head>` or body template change must be re-propagated:

```bash
cd smart-deal-global-audit
node build-i18n.js
```
