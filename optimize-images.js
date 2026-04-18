#!/usr/bin/env node
// optimize-images.js — Compress all JPG/PNG images for web delivery
// Uses sharp for fast, high-quality compression
// Run: node optimize-images.js

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const QUALITY_JPG = 80;  // 80 is good balance for luxury photos
const QUALITY_WEBP = 78;
const MAX_WIDTH = 1600;  // No image needs to be wider than this for cards
const HERO_MAX_WIDTH = 1920;  // Hero/country hero images can be wider

const HERO_PATTERNS = ['hero', 'final-cta', 'how-we-help'];

async function optimizeImage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) return;

    const stat = fs.statSync(filePath);
    const originalSize = stat.size;
    const relPath = path.relative(ROOT, filePath);

    // Determine max width based on image role
    const isHero = HERO_PATTERNS.some(p => filePath.includes(p));
    const maxWidth = isHero ? HERO_MAX_WIDTH : MAX_WIDTH;

    try {
        const image = sharp(filePath);
        const meta = await image.metadata();

        let pipeline = image;

        // Resize if wider than max
        if (meta.width > maxWidth) {
            pipeline = pipeline.resize(maxWidth, null, {
                withoutEnlargement: true,
                fit: 'inside'
            });
        }

        // Compress based on format
        if (ext === '.png') {
            pipeline = pipeline.png({ quality: QUALITY_JPG, compressionLevel: 9 });
        } else if (ext === '.webp') {
            pipeline = pipeline.webp({ quality: QUALITY_WEBP });
        } else {
            pipeline = pipeline.jpeg({ quality: QUALITY_JPG, mozjpeg: true });
        }

        const buffer = await pipeline.toBuffer();

        // Only write if we actually saved space
        if (buffer.length < originalSize) {
            fs.writeFileSync(filePath, buffer);
            const saved = ((originalSize - buffer.length) / originalSize * 100).toFixed(1);
            const sizeMB = (originalSize / 1024 / 1024).toFixed(1);
            const newMB = (buffer.length / 1024 / 1024).toFixed(1);
            console.log(`  ${relPath}: ${sizeMB}MB -> ${newMB}MB (-${saved}%)`);
            return originalSize - buffer.length;
        } else {
            console.log(`  ${relPath}: already optimal (${(originalSize / 1024).toFixed(0)}KB)`);
            return 0;
        }
    } catch (err) {
        console.error(`  ERROR ${relPath}: ${err.message}`);
        return 0;
    }
}

function findImages(dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...findImages(full));
        } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
            results.push(full);
        }
    }
    return results;
}

async function main() {
    console.log('Smart Deals Global — Image Optimization\n');

    const dirs = [
        path.join(ROOT, 'images'),
        path.join(ROOT, 'properties')
    ].filter(d => fs.existsSync(d));

    const images = dirs.flatMap(d => findImages(d));
    console.log(`Found ${images.length} images\n`);

    let totalSaved = 0;
    for (const img of images) {
        totalSaved += await optimizeImage(img);
    }

    console.log(`\nTotal saved: ${(totalSaved / 1024 / 1024).toFixed(1)}MB`);
}

main().catch(console.error);
