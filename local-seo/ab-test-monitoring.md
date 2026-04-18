# A/B Test Monitoring Guide

## Active Tests (started 2026-04-18)

All tests use PostHog super properties. Every event from a user carries their test assignments.

### Test Matrix

| Test Name | Property Key | Variants | Conversion Goal |
|-----------|-------------|----------|-----------------|
| Hero Headline | `ab_hero_variant` | control, variant-b | `hero_cta_clicked` |
| Featured Deal | `featured_deal_shown` | Rotates daily (top 3 by discount) | `property_enquiry_clicked` where property matches |
| Mid-CTA Copy | `ab_midcta_copy` | control, urgency, social | `button_clicked` in mid-cta section |
| Card CTA Label | `ab_card_cta` | control, view-deal, get-price | `property_enquiry_clicked` |
| Social Proof Position | `ab_proof_position` | control, above-properties | `scroll_depth_reached` 50%+ AND any enquiry |
| WhatsApp Pre-fill | `ab_wa_prefill` | control, specific, casual | `outbound_link_clicked` where type=whatsapp |
| Engagement Timing | `ab_engage_timing` | control-60, early-40 | `engagement_prompt_shown` -> `outbound_link_clicked` |

### How to Check Results in PostHog

1. Go to PostHog > Insights > New Insight
2. Choose "Trends"
3. Event: `property_enquiry_clicked`
4. Breakdown by: `ab_card_cta` (or any test property)
5. Compare conversion rates across variants
6. Need ~100 events per variant for directional signal, ~500 for statistical significance

### When to Call a Winner

- Wait minimum 2 weeks (14 days)
- Need at least 200 total events across all variants per test
- Winner should show 10%+ lift with consistent trend
- Lock winner by removing the A/B code and hardcoding the winning variant

### PostHog Queries

**Overall conversion by test:**
```
Event: property_enquiry_clicked
Breakdown: ab_card_cta
Date range: Last 14 days
```

**Engagement prompt effectiveness:**
```
Funnel:
Step 1: engagement_prompt_shown
Step 2: outbound_link_clicked (type=whatsapp)
Breakdown: ab_engage_timing
```

**Hero test conversion:**
```
Funnel:
Step 1: ab_test_variant_shown (test_name=hero-headline-test)
Step 2: hero_cta_clicked
Breakdown: ab_hero_variant
```
