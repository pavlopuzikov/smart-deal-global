/* ============================================
   POSTHOG ANALYTICS — Smart Deals Global
   Custom event tracking, scroll depth, A/B test
   ============================================ */

(function () {
    'use strict';

    // ── Configuration ─────────────────────────────────────────────
    // Replace with your real PostHog project API key before deploying.
    var POSTHOG_API_KEY = 'phc_AE4VjSAXksSQ2eyywkyBi446LeKsAEowi5aaUpgqf26p';
    var POSTHOG_HOST = 'https://us.i.posthog.com';

    // Bail out if PostHog failed to load or key is placeholder
    function ph() { return window.posthog; }
    function ready() { return ph() && POSTHOG_API_KEY.indexOf('YOUR_PROJECT') === -1; }

    // ── 1. BUTTON CLICK TRACKING ──────────────────────────────────
    // Captures all <button> and <a class="btn"> clicks with descriptive names.
    function initButtonTracking() {
        document.addEventListener('click', function (e) {
            if (!ready()) return;
            var el = e.target.closest('button, a.btn, a.btn--primary, a.btn--card, .contact-option, .whatsapp-float, .navbar__cta-link');
            if (!el) return;

            var text = (el.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 80);
            var href = el.getAttribute('href') || '';
            var section = closestSection(el);

            ph().capture('button_clicked', {
                button_text: text,
                button_href: href,
                button_classes: el.className,
                page_section: section,
                page_language: document.documentElement.lang || 'en'
            });
        }, true);
    }

    // ── 2. SCROLL DEPTH TRACKING ──────────────────────────────────
    // Fires once per threshold per page load: 25%, 50%, 75%, 100%.
    function initScrollDepthTracking() {
        var thresholds = [25, 50, 75, 100];
        var fired = {};

        function getScrollPercent() {
            var docHeight = Math.max(
                document.body.scrollHeight,
                document.documentElement.scrollHeight
            );
            var winHeight = window.innerHeight;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (docHeight <= winHeight) return 100;
            return Math.round((scrollTop / (docHeight - winHeight)) * 100);
        }

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ready() || ticking) return;
            ticking = true;
            requestAnimationFrame(function () {
                var pct = getScrollPercent();
                for (var i = 0; i < thresholds.length; i++) {
                    var t = thresholds[i];
                    if (pct >= t && !fired[t]) {
                        fired[t] = true;
                        ph().capture('scroll_depth_reached', {
                            depth_percent: t,
                            page_language: document.documentElement.lang || 'en'
                        });
                    }
                }
                ticking = false;
            });
        }, { passive: true });
    }

    // ── 3. OUTBOUND LINK TRACKING ─────────────────────────────────
    // Tracks clicks on links that leave the site (WhatsApp, phone, email, external).
    function initOutboundLinkTracking() {
        document.addEventListener('click', function (e) {
            if (!ready()) return;
            var link = e.target.closest('a[href]');
            if (!link) return;

            var href = link.getAttribute('href') || '';
            var type = null;

            if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) {
                type = 'whatsapp';
            } else if (href.indexOf('tel:') === 0) {
                type = 'phone_call';
            } else if (href.indexOf('mailto:') === 0) {
                type = 'email';
            } else if (href.indexOf('http') === 0 && href.indexOf(window.location.hostname) === -1) {
                type = 'external';
            }

            if (!type) return;

            var section = closestSection(link);
            ph().capture('outbound_link_clicked', {
                link_type: type,
                link_url: href,
                link_text: (link.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 80),
                page_section: section,
                page_language: document.documentElement.lang || 'en'
            });
        }, true);
    }

    // ── 3b. UNIFIED WHATSAPP CLICK TRACKING ───────────────────────
    // Single source of truth for the conversion goal. Fires `whatsapp_click`
    // on every click of any link to wa.me, with structured attribution so
    // we can compare CTA performance side by side.
    //
    // Attribution priority for cta_id:
    //   1. data-cta-id on the <a> (set in markup or render functions)
    //   2. fallback: page_section + button_text slug
    //
    // The `source` query param on the wa.me URL is parsed back out so the
    // broker on WhatsApp and PostHog see the same value.
    function initWhatsAppTracking() {
        document.addEventListener('click', function (e) {
            if (!ready()) return;
            var link = e.target.closest('a[href*="wa.me"]');
            if (!link) return;

            var href = link.getAttribute('href') || '';
            var section = closestSection(link);
            var ctaId = link.getAttribute('data-cta-id') || '';
            var dealName = link.getAttribute('data-property') || link.getAttribute('data-deal-name') || '';
            var dealLocation = link.getAttribute('data-location') || '';
            var dealSection = link.getAttribute('data-section') || '';
            var btnText = (link.textContent || '').replace(/\s+/g, ' ').trim().substring(0, 80);

            var source = '';
            try {
                var qIdx = href.indexOf('?');
                if (qIdx !== -1) {
                    var params = new URLSearchParams(href.slice(qIdx + 1));
                    source = params.get('source') || '';
                }
            } catch (_) { /* ignore malformed URLs */ }

            if (!ctaId) {
                var slug = btnText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 40);
                ctaId = section + (slug ? ':' + slug : '');
            }

            ph().capture('whatsapp_click', {
                cta_id: ctaId,
                source: source || ctaId,
                page_section: section,
                deal_name: dealName,
                deal_location: dealLocation,
                deal_section: dealSection,
                button_text: btnText,
                link_url: href,
                page_language: document.documentElement.lang || 'en'
            });
        }, true);
    }

    // ── 4. FORM SUBMISSION TRACKING ───────────────────────────────
    // Tracks the qualify form submission with field summary.
    function initFormTracking() {
        var form = document.getElementById('qualify-form');
        if (!form) return;

        form.addEventListener('submit', function () {
            if (!ready()) return;
            var data = new FormData(form);
            ph().capture('form_submitted', {
                form_id: 'qualify-form',
                form_market: data.get('city') || '',
                form_property_type: data.get('property_type') || '',
                form_budget: data.get('budget') || '',
                form_goal: data.get('goal') || '',
                page_language: document.documentElement.lang || 'en'
            });
        });
    }

    // ── 5. PROPERTY ENQUIRY TRACKING ──────────────────────────────
    // Tracks property card "Enquire" button clicks.
    // Also identifies the user (once per session) and sets person properties.
    function initEnquiryTracking() {
        document.addEventListener('click', function (e) {
            if (!ready()) return;
            var btn = e.target.closest('.btn--card[data-property]');
            if (!btn) return;

            var propertyName = btn.dataset.property || '';
            var propertySection = btn.dataset.section || '';

            // ── User identification (once per session) ──
            if (!sessionStorage.getItem('sdg_identified')) {
                var existingId = sessionStorage.getItem('sdg_session_id');
                if (!existingId) {
                    var hex = '';
                    for (var i = 0; i < 8; i++) {
                        hex += Math.floor(Math.random() * 16).toString(16);
                    }
                    existingId = 'sdg_' + hex;
                    sessionStorage.setItem('sdg_session_id', existingId);
                }
                ph().identify(existingId);
                sessionStorage.setItem('sdg_identified', '1');
            }

            // ── Person properties on every enquiry ──
            var enquiryCount = parseInt(sessionStorage.getItem('sdg_enquiries') || '0', 10) + 1;
            sessionStorage.setItem('sdg_enquiries', String(enquiryCount));
            ph().setPersonProperties({
                preferred_language: document.documentElement.lang || 'en',
                last_property_viewed: propertyName,
                last_market_viewed: propertySection,
                enquiry_count: enquiryCount
            });

            ph().capture('property_enquiry_clicked', {
                property_name: propertyName,
                property_location: btn.dataset.location || '',
                property_section: propertySection,
                page_language: document.documentElement.lang || 'en'
            });
        }, true);
    }

    // ── 6. HERO CTA — variant-b PROMOTED TO DEFAULT (2026-05-05) ──
    // The hero-headline-test is concluded. variant-b ("Your Next Investment,
    // Curated Worldwide" / "View Top Deals") was the winning copy at ~5x
    // engagement vs control on PostHog data. Copy is now baked into the i18n
    // dict (main.js) and rendered server-side per-language by build-i18n.js
    // so AR/FR/RU pages get the winning copy in their own language too —
    // fixing a pre-existing bug where variant-b only rendered English.
    //
    // The DOM-replacement that previously rewrote the hero in English-only
    // has been removed. We keep the click tracker and a "variant: locked-b"
    // marker on every event so post-promote performance can be compared
    // against the historical A/B window.
    function initHeroABTest() {
        if (!ready()) return;

        var variant = 'locked-b';
        ph().register({ ab_hero_variant: variant });
        ph().setPersonProperties({ ab_hero_variant: variant });

        var heroCta = document.querySelector('.hero__cta');
        if (heroCta) {
            heroCta.addEventListener('click', function () {
                ph().capture('hero_cta_clicked', {
                    variant: variant,
                    button_text: (heroCta.textContent || '').replace(/\s+/g, ' ').trim(),
                    page_language: document.documentElement.lang || 'en'
                });
            });
        }

        ph().capture('ab_test_variant_shown', {
            test_name: 'hero-headline-test',
            variant: variant,
            page_language: document.documentElement.lang || 'en'
        });
    }

    // ── UTILITIES ─────────────────────────────────────────────────
    function closestSection(el) {
        var section = el.closest('section[id], .hero, .final-cta, .mid-cta, footer');
        if (!section) return 'unknown';
        return section.id || section.className.split(' ')[0] || 'unknown';
    }

    // ── 7. UTM / AD CAMPAIGN TRACKING ─────────────────────────────
    // Captures UTM parameters and ad platform click IDs from the URL
    // so every subsequent event carries the campaign attribution.
    function initCampaignTracking() {
        if (!ready()) return;

        var params = new URLSearchParams(window.location.search);
        var utm = {};
        var utmKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        var adClickKeys = ['gclid', 'fbclid', 'msclkid', 'ttclid', 'li_fat_id'];

        for (var i = 0; i < utmKeys.length; i++) {
            var val = params.get(utmKeys[i]);
            if (val) utm[utmKeys[i]] = val;
        }

        // Detect ad platform click IDs
        var adPlatform = null;
        for (var j = 0; j < adClickKeys.length; j++) {
            var clickId = params.get(adClickKeys[j]);
            if (clickId) {
                utm['ad_click_id'] = adClickKeys[j];
                utm['ad_click_value'] = clickId;
                if (adClickKeys[j] === 'gclid') adPlatform = 'google_ads';
                else if (adClickKeys[j] === 'fbclid') adPlatform = 'facebook_ads';
                else if (adClickKeys[j] === 'msclkid') adPlatform = 'microsoft_ads';
                else if (adClickKeys[j] === 'ttclid') adPlatform = 'tiktok_ads';
                else if (adClickKeys[j] === 'li_fat_id') adPlatform = 'linkedin_ads';
            }
        }
        if (adPlatform) utm['ad_platform'] = adPlatform;

        // Detect referrer-based attribution
        var ref = document.referrer;
        if (ref && !utm['utm_source']) {
            if (ref.indexOf('google.') !== -1) utm['referrer_source'] = 'google_organic';
            else if (ref.indexOf('facebook.com') !== -1 || ref.indexOf('fb.com') !== -1) utm['referrer_source'] = 'facebook';
            else if (ref.indexOf('instagram.com') !== -1) utm['referrer_source'] = 'instagram';
            else if (ref.indexOf('linkedin.com') !== -1) utm['referrer_source'] = 'linkedin';
            else if (ref.indexOf('twitter.com') !== -1 || ref.indexOf('x.com') !== -1) utm['referrer_source'] = 'twitter';
            else if (ref.indexOf('youtube.com') !== -1) utm['referrer_source'] = 'youtube';
            else if (ref.indexOf('tiktok.com') !== -1) utm['referrer_source'] = 'tiktok';
            else utm['referrer_source'] = new URL(ref).hostname;
        }

        if (Object.keys(utm).length > 0) {
            // Register as super properties — attached to ALL future events this session
            ph().register_for_session(utm);

            // Fire a dedicated campaign attribution event
            ph().capture('campaign_attribution', utm);
        }
    }

    // ── 8. MARKET GROUP ANALYTICS ──────────────────────────────────
    // Detects which market section the user scrolls into first and
    // registers them into a PostHog group for that market.
    function initMarketGroupTracking() {
        if (!ready()) return;
        if (sessionStorage.getItem('sdg_market_grouped')) return;

        // Map section IDs to market metadata
        var marketMap = {
            'ready':        { name: 'Dubai Ready',       country: 'UAE' },
            'offplan':      { name: 'Dubai Off-Plan',    country: 'UAE' },
            'monaco':       { name: 'Monaco',            country: 'Monaco' },
            'france':       { name: 'France',            country: 'France' },
            'switzerland':  { name: 'Switzerland',       country: 'Switzerland' },
            'azerbaijan':   { name: 'Azerbaijan',        country: 'Azerbaijan' },
            'thailand':     { name: 'Thailand',          country: 'Thailand' }
        };

        var sectionIds = Object.keys(marketMap);
        var targets = [];
        for (var i = 0; i < sectionIds.length; i++) {
            var el = document.getElementById(sectionIds[i]);
            if (el) targets.push(el);
        }

        if (targets.length === 0) return;

        var observer = new IntersectionObserver(function (entries) {
            for (var j = 0; j < entries.length; j++) {
                if (!entries[j].isIntersecting) continue;

                var sectionId = entries[j].target.id;
                var info = marketMap[sectionId];
                if (!info) continue;

                // Fire once per session then disconnect
                ph().group('market', info.name, {
                    country: info.country,
                    section_id: sectionId
                });
                sessionStorage.setItem('sdg_market_grouped', '1');
                observer.disconnect();
                return;
            }
        }, { threshold: 0.3 });

        for (var k = 0; k < targets.length; k++) {
            observer.observe(targets[k]);
        }
    }

    // ── 9. SESSION CONTEXT ENRICHMENT ────────────────────────────────
    // Registers session-level super properties so every event in this
    // session carries viewport, device, language, and referrer info.
    function initSessionContext() {
        if (!ready()) return;

        var referrerDomain = 'direct';
        if (document.referrer) {
            try {
                referrerDomain = new URL(document.referrer).hostname;
            } catch (_) {
                referrerDomain = 'unknown';
            }
        }

        var vw = window.innerWidth;
        var deviceType = vw < 768 ? 'mobile' : vw < 1024 ? 'tablet' : 'desktop';

        ph().register_for_session({
            viewport_width: vw,
            viewport_height: window.innerHeight,
            device_type: deviceType,
            page_language: document.documentElement.lang || 'en',
            referrer_domain: referrerDomain,
            entry_time: new Date().toISOString()
        });
    }

    // ── 10. MULTI-VARIANT A/B TESTS ─────────────────────────────
    // PAUSED 2026-05-01: with ~30 sessions/14d, no cell can reach significance,
    // and the matrix super-properties were polluting every event. We freeze every
    // user to "control" until the hero-headline-test concludes and traffic supports
    // sequential single-axis tests (≥1500 sessions per arm). __SDG_AB stays exposed
    // because main.js reads `ab_engage_timing` for the engagement-prompt threshold.
    function initABTestMatrix() {
        if (!ready()) return;

        // Freeze every dimension to control / control-equivalent
        window.__SDG_AB = {
            ab_midcta_copy: 'control',
            ab_card_cta: 'control',
            ab_proof_position: 'control',
            ab_wa_prefill: 'control',
            ab_engage_timing: 'control-60'
        };
        return;

        // Legacy matrix (kept for reference; re-enable one test at a time when relaunching)
        // eslint-disable-next-line no-unreachable
        var tests = [
            // Mid-page CTA copy
            {
                name: 'midcta_copy',
                key: 'sdg_ab_midcta',
                variants: ['control', 'urgency', 'social'],
                apply: function (v) {
                    var title = document.querySelector('.mid-cta__title');
                    var sub = document.querySelector('.mid-cta__subtitle');
                    if (!title || !sub) return;
                    if (v === 'urgency') {
                        title.textContent = 'These deals won\u2019t last.';
                        sub.textContent = 'Properties in this collection sell within 14 days on average.';
                    } else if (v === 'social') {
                        title.textContent = '47 enquiries this week.';
                        sub.textContent = 'Join buyers already exploring our curated collection.';
                    }
                }
            },
            // Card CTA button copy
            {
                name: 'card_cta',
                key: 'sdg_ab_cardcta',
                variants: ['control', 'view-deal', 'get-price'],
                apply: function (v) {
                    if (v === 'control') return;
                    var label = v === 'view-deal' ? 'View This Deal' : 'Get Best Price';
                    document.querySelectorAll('.btn--card').forEach(function (btn) {
                        var icon = btn.querySelector('i');
                        btn.textContent = '';
                        btn.appendChild(document.createTextNode(label + ' '));
                        if (icon) btn.appendChild(icon);
                    });
                }
            },
            // Social proof position: before vs after properties
            {
                name: 'proof_position',
                key: 'sdg_ab_proof',
                variants: ['control', 'above-properties'],
                apply: function (v) {
                    if (v !== 'above-properties') return;
                    var proof = document.querySelector('.social-proof');
                    var featured = document.querySelector('.featured-deal');
                    if (proof && featured && featured.parentNode) {
                        featured.parentNode.insertBefore(proof, featured);
                    }
                }
            },
            // WhatsApp pre-fill message style
            {
                name: 'wa_prefill',
                key: 'sdg_ab_waprefill',
                variants: ['control', 'specific', 'casual'],
                apply: function (v) {
                    if (v === 'control') return;
                    var msgs = {
                        specific: 'Hi, I saw your property collection online. I\'m looking for a {budget} investment in Dubai. Can you send me your top 3 picks?',
                        casual: 'Hey! Just browsing your deals. What\'s the best opportunity right now?'
                    };
                    var msg = msgs[v];
                    if (!msg) return;
                    // Update the hero WhatsApp CTA pre-fill
                    var heroCta = document.querySelector('.hero__cta-secondary');
                    if (heroCta) {
                        heroCta.href = 'https://wa.me/971559579113?text=' + encodeURIComponent(msg.replace('{budget}', 'AED 1-3M'));
                    }
                }
            },
            // Engagement prompt timing: 60% vs 40% scroll
            {
                name: 'engage_timing',
                key: 'sdg_ab_engage',
                variants: ['control-60', 'early-40'],
                apply: function () {
                    // Timing is applied by reading this variant in main.js
                    // This entry just registers the variant for tracking
                }
            }
        ];

        var matrix = {};
        for (var i = 0; i < tests.length; i++) {
            var test = tests[i];
            var stored = localStorage.getItem(test.key);
            if (!stored || test.variants.indexOf(stored) === -1) {
                stored = test.variants[Math.floor(Math.random() * test.variants.length)];
                localStorage.setItem(test.key, stored);
            }
            matrix['ab_' + test.name] = stored;
            test.apply(stored);
        }

        // Register entire test matrix as super properties
        ph().register(matrix);
        ph().setPersonProperties(matrix);

        // Fire test matrix event once per session
        if (!sessionStorage.getItem('sdg_ab_matrix_fired')) {
            sessionStorage.setItem('sdg_ab_matrix_fired', '1');
            ph().capture('ab_test_matrix_assigned', matrix);
        }

        // Expose matrix globally so main.js can read variant values
        window.__SDG_AB = matrix;
    }

    // ── INIT ──────────────────────────────────────────────────────
    function initAllTracking() {
        if (!ready()) {
            // PostHog not loaded or placeholder key — skip silently
            return;
        }
        initSessionContext();
        initCampaignTracking();
        initButtonTracking();
        initScrollDepthTracking();
        initOutboundLinkTracking();
        initWhatsAppTracking();
        initFormTracking();
        initEnquiryTracking();
        initHeroABTest();
        initMarketGroupTracking();
        initABTestMatrix();
    }

    // PostHog loads async — wait for it, but don't block the page
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            // Give PostHog snippet ~200ms to initialize
            setTimeout(initAllTracking, 300);
        });
    } else {
        setTimeout(initAllTracking, 300);
    }
})();
