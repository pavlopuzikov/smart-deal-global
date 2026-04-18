#!/usr/bin/env node
// generate-og-image.js — Create a branded 1200x630 Open Graph share image
// Uses the hero background with a dark overlay and SVG text

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ROOT = __dirname;
const OUTPUT = path.join(ROOT, 'images', 'og-share.jpg');
const HERO = path.join(ROOT, 'images', 'hero-bg.jpg');

async function main() {
    // SVG overlay with branding text
    const svgOverlay = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
        <!-- Dark overlay -->
        <rect width="1200" height="630" fill="rgba(26,26,46,0.75)"/>

        <!-- Gold accent line -->
        <rect x="80" y="200" width="80" height="3" rx="1.5" fill="#c8a96e"/>

        <!-- Eyebrow -->
        <text x="80" y="240" font-family="system-ui, -apple-system, sans-serif" font-size="16"
              fill="#c8a96e" letter-spacing="4" font-weight="600">CURATED REAL ESTATE, WORLDWIDE</text>

        <!-- Main title -->
        <text x="80" y="310" font-family="Georgia, 'Times New Roman', serif" font-size="56"
              fill="#ffffff" font-weight="700">Smart Deals</text>
        <text x="80" y="380" font-family="Georgia, 'Times New Roman', serif" font-size="56"
              fill="#c8a96e" font-style="italic" font-weight="400">Collection</text>

        <!-- Subtitle -->
        <text x="80" y="430" font-family="system-ui, -apple-system, sans-serif" font-size="18"
              fill="rgba(255,255,255,0.7)" font-weight="400">50+ curated deals across 10 global markets</text>

        <!-- Stats bar -->
        <rect x="80" y="480" width="1040" height="1" fill="rgba(255,255,255,0.1)"/>

        <text x="80" y="520" font-family="system-ui, sans-serif" font-size="32" fill="#ffffff" font-weight="700">10</text>
        <text x="120" y="520" font-family="system-ui, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)" font-weight="400">Markets</text>

        <text x="280" y="520" font-family="system-ui, sans-serif" font-size="32" fill="#ffffff" font-weight="700">50+</text>
        <text x="340" y="520" font-family="system-ui, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)" font-weight="400">Listings</text>

        <text x="500" y="520" font-family="system-ui, sans-serif" font-size="32" fill="#ffffff" font-weight="700">23%</text>
        <text x="575" y="520" font-family="system-ui, sans-serif" font-size="14" fill="rgba(255,255,255,0.5)" font-weight="400">Max Discount</text>

        <!-- Domain -->
        <text x="80" y="580" font-family="system-ui, sans-serif" font-size="14"
              fill="rgba(255,255,255,0.35)" letter-spacing="2" font-weight="500">SMARTDEALS.GLOBAL</text>
    </svg>`;

    // Resize hero to 1200x630 and composite the SVG overlay
    await sharp(HERO)
        .resize(1200, 630, { fit: 'cover', position: 'center' })
        .composite([{
            input: Buffer.from(svgOverlay),
            top: 0,
            left: 0
        }])
        .jpeg({ quality: 85, mozjpeg: true })
        .toFile(OUTPUT);

    const stat = fs.statSync(OUTPUT);
    console.log(`OG image created: ${OUTPUT} (${(stat.size / 1024).toFixed(0)}KB)`);
}

main().catch(console.error);
