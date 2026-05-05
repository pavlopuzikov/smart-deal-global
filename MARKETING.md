# Smart Deals Global — Marketing Resources

## UTM Campaign Links

Ready-to-use links for ad campaigns. The site automatically tracks UTM parameters and ad click IDs via PostHog.

> **Language-aware routing rule (added 2026-05-05):** Send the audience directly
> to their language variant. Russian-targeted ads → `/ru/?...`. French-targeted
> ads → `/fr/?...`. Arabic-targeted ads → `/ar/?...`. Dubai-resident /
> international English ads → `/?...`. Reason: PostHog showed 36% of all button
> clicks on the site were on the language switcher — meaning a third of paid
> visitors were landing on the wrong language and bouncing or switching.

### Instagram Campaigns
```
https://smartdeals.global/?utm_source=instagram&utm_medium=social&utm_campaign=dubai-distress
https://smartdeals.global/?utm_source=instagram&utm_medium=cpc&utm_campaign=dubai-offplan
https://smartdeals.global/?utm_source=instagram&utm_medium=cpc&utm_campaign=monaco-luxury
https://smartdeals.global/?utm_source=instagram&utm_medium=social&utm_campaign=brand-awareness
https://smartdeals.global/ar/?utm_source=instagram&utm_medium=cpc&utm_campaign=dubai-arabic
https://smartdeals.global/ru/?utm_source=instagram&utm_medium=cpc&utm_campaign=russia-instagram
https://smartdeals.global/fr/?utm_source=instagram&utm_medium=cpc&utm_campaign=france-instagram
```

### Facebook Campaigns
```
# English (UAE / international)
https://smartdeals.global/?utm_source=facebook&utm_medium=cpc&utm_campaign=dubai-distress
https://smartdeals.global/?utm_source=facebook&utm_medium=cpc&utm_campaign=golden-visa
https://smartdeals.global/?utm_source=facebook&utm_medium=cpc&utm_campaign=off-plan-deals
# Localized — point ad set to native-language audience and land on the matching variant
https://smartdeals.global/ru/?utm_source=facebook&utm_medium=cpc&utm_campaign=russia-buyers
https://smartdeals.global/fr/?utm_source=facebook&utm_medium=cpc&utm_campaign=france-buyers
https://smartdeals.global/ar/?utm_source=facebook&utm_medium=cpc&utm_campaign=arabic-buyers
```

### Google Ads
```
# English
https://smartdeals.global/?utm_source=google&utm_medium=cpc&utm_campaign=dubai-distress-deals
https://smartdeals.global/?utm_source=google&utm_medium=cpc&utm_campaign=dubai-property-investment
https://smartdeals.global/?utm_source=google&utm_medium=cpc&utm_campaign=monaco-real-estate
https://smartdeals.global/?utm_source=google&utm_medium=cpc&utm_campaign=buy-property-dubai
# Localized — set ad-group target language to Russian/French/Arabic and land on the matching variant
https://smartdeals.global/ru/?utm_source=google&utm_medium=cpc&utm_campaign=ru-property-dubai
https://smartdeals.global/fr/?utm_source=google&utm_medium=cpc&utm_campaign=fr-immobilier-dubai
https://smartdeals.global/ar/?utm_source=google&utm_medium=cpc&utm_campaign=ar-aqarat-dubai
```

### LinkedIn
```
https://smartdeals.global/?utm_source=linkedin&utm_medium=social&utm_campaign=investor-outreach
https://smartdeals.global/?utm_source=linkedin&utm_medium=cpc&utm_campaign=hnwi-targeting
https://smartdeals.global/ru/?utm_source=linkedin&utm_medium=cpc&utm_campaign=ru-hnwi
https://smartdeals.global/fr/?utm_source=linkedin&utm_medium=cpc&utm_campaign=fr-hnwi
```

### Direct WhatsApp (Click-to-Chat)
```
https://wa.me/971559579113?text=Hi%2C%20I%20found%20you%20on%20Instagram.%20I%27m%20interested%20in%20Dubai%20property%20deals.
https://wa.me/971559579113?text=Hi%2C%20I%27m%20looking%20for%20distress%20deals%20in%20Dubai.%20Can%20you%20help%3F
https://wa.me/971559579113?text=Hi%2C%20I%27m%20interested%20in%20Monaco%20property.%20What%20do%20you%20have%20available%3F
```

## Social Media Accounts

| Platform | Handle | URL |
|----------|--------|-----|
| Instagram | @dubai.brief | https://www.instagram.com/dubai.brief/ |
| LinkedIn | Smart Deals Global | https://www.linkedin.com/company/smart-deals-global/ |

## PostHog Analytics

- Dashboard: https://us.posthog.com
- Project key: `phc_AE4VjSAXksSQ2eyywkyBi446LeKsAEowi5aaUpgqf26p`
- UTM parameters automatically tracked on every page visit
- Ad click IDs tracked: gclid (Google), fbclid (Facebook), msclkid (Bing), ttclid (TikTok), li_fat_id (LinkedIn)

## A/B Test (Concluded 2026-05-05)

Hero headline test — variant-b PROMOTED to default.
- **Result:** variant-b ~5x combined CTA + WhatsApp engagement vs control on PostHog data (10 → 5 vs 23 → 1).
- **Winning copy:** title "Your Next Investment, Curated Worldwide", CTA "View Top Deals", eyebrow "10 Markets. 50+ Selected Opportunities."
- **Now baked into:** `js/main.js` I18N_DICT for all 4 languages (was English-only via JS DOM-replace, which incorrectly rendered English on AR/FR/RU pages — fixed at promote-time).
- **Next test slot:** open. The 5-axis matrix test (`ab_midcta_copy`, `ab_card_cta`, `ab_proof_position`, `ab_wa_prefill`, `ab_engage_timing`) was paused 2026-05-01 and remains paused. When ≥1500 sessions/arm of traffic accrue, relaunch ONE axis at a time.

## SEO Keywords (in meta layer, not visible on site)

- distress deals, below-market opportunities, motivated seller
- curated property deals, Dubai property investment
- Golden Visa real estate, off-plan payment plans
- Monaco luxury apartments, Paris investment property
