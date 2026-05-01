#!/usr/bin/env node
// Baseline audit + stress test for smartdeals.global
// One-shot script: HTTPS probes + concurrency burst + content checks.
// Run: node apps/smart-deal-global/local-seo/sdg-audit.mjs
//
// Outputs to stdout. No external deps.

import https from 'node:https';
import zlib from 'node:zlib';
import { performance } from 'node:perf_hooks';

const HOST = 'smartdeals.global';
const ORIGIN = `https://${HOST}`;
const UA = 'sdg-audit/1.0 (+https://smartdeals.global) curl-equivalent';

function probe(urlPath, opts = {}) {
    const url = new URL(urlPath, ORIGIN);
    return new Promise((resolve) => {
        const t0 = performance.now();
        const req = https.request({
            method: opts.method || 'GET',
            hostname: url.hostname,
            path: url.pathname + url.search,
            headers: {
                'User-Agent': opts.ua || UA,
                'Accept-Encoding': opts.acceptEncoding || 'gzip, br',
                'Accept': opts.accept || '*/*',
                'Accept-Language': opts.acceptLanguage || 'en-US,en;q=0.9',
                ...(opts.headers || {})
            },
            timeout: opts.timeout || 15000
        }, (res) => {
            let firstByte = null;
            let bytes = 0;
            res.on('data', (chunk) => {
                if (firstByte === null) firstByte = performance.now() - t0;
                bytes += chunk.length;
                if (opts.dropBody) return;
            });
            const chunks = [];
            if (!opts.dropBody) res.on('data', (c) => chunks.push(c));
            res.on('end', () => {
                let body = null;
                if (!opts.dropBody) {
                    const raw = Buffer.concat(chunks);
                    const enc = (res.headers['content-encoding'] || '').toLowerCase();
                    try {
                        if (enc === 'br') body = zlib.brotliDecompressSync(raw).toString('utf8');
                        else if (enc === 'gzip') body = zlib.gunzipSync(raw).toString('utf8');
                        else if (enc === 'deflate') body = zlib.inflateSync(raw).toString('utf8');
                        else body = raw.toString('utf8');
                    } catch (_) { body = raw.toString('utf8'); }
                }
                resolve({
                    url: url.href,
                    status: res.statusCode,
                    headers: res.headers,
                    ttfb_ms: firstByte ?? (performance.now() - t0),
                    total_ms: performance.now() - t0,
                    bytes,
                    body
                });
            });
        });
        req.on('error', (err) => resolve({ url: url.href, error: err.message }));
        req.on('timeout', () => { req.destroy(); resolve({ url: url.href, error: 'timeout' }); });
        req.end();
    });
}

function pct(arr, p) {
    if (!arr.length) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
    return sorted[idx];
}

function fmtMs(n) { return n == null ? '—' : `${n.toFixed(0)}ms`; }
function fmtKB(n) { return n == null ? '—' : `${(n / 1024).toFixed(1)}KB`; }

async function auditEntryPoints() {
    console.log('\n=== ENTRY POINTS ===');
    const paths = ['/', '/ar/', '/fr/', '/ru/', '/sitemap.xml', '/robots.txt', '/llms.txt', '/favicon.svg'];
    for (const p of paths) {
        const r = await probe(p);
        const enc = r.headers?.['content-encoding'] || '-';
        const ct = (r.headers?.['content-type'] || '-').split(';')[0];
        console.log(`${String(r.status || 'ERR').padEnd(4)} ${fmtMs(r.ttfb_ms).padStart(7)} ttfb  ${fmtKB(r.bytes).padStart(8)}  enc=${enc.padEnd(6)} ct=${ct.padEnd(28)} ${p}`);
    }
}

async function auditAssets() {
    console.log('\n=== ASSETS (current deploy) ===');
    const paths = [
        '/css/styles.css',
        '/js/main.js',
        '/js/posthog-tracking.js',
        '/images/hero-bg.jpg',
        '/images/final-cta-bg.jpg',
        '/images/how-we-help.jpg'
    ];
    for (const p of paths) {
        const r = await probe(p, { dropBody: true });
        const enc = r.headers?.['content-encoding'] || '-';
        const cache = r.headers?.['cache-control'] || '-';
        console.log(`${String(r.status || 'ERR').padEnd(4)} ${fmtMs(r.ttfb_ms).padStart(7)}  ${fmtKB(r.bytes).padStart(8)}  enc=${enc.padEnd(6)} cache="${cache}"  ${p}`);
    }
}

async function auditExpectedNewAssets() {
    console.log('\n=== EXPECTED-AFTER-DEPLOY ASSETS (should all be 404 right now) ===');
    const paths = [
        '/images/hero-bg-768.avif', '/images/hero-bg-1200.avif', '/images/hero-bg-1600.avif',
        '/images/hero-bg-768.webp', '/images/hero-bg-1200.webp', '/images/hero-bg-1600.webp',
        '/images/final-cta-bg-1600.avif'
    ];
    for (const p of paths) {
        const r = await probe(p, { method: 'HEAD' });
        console.log(`${String(r.status || 'ERR').padEnd(4)} ${p}`);
    }
}

async function auditHeaders() {
    console.log('\n=== SECURITY / CACHING HEADERS (root) ===');
    const r = await probe('/', { dropBody: true });
    const checks = [
        'strict-transport-security',
        'content-security-policy',
        'x-frame-options',
        'x-content-type-options',
        'referrer-policy',
        'permissions-policy',
        'cache-control',
        'content-encoding',
        'server'
    ];
    for (const k of checks) {
        const v = r.headers?.[k];
        const status = v ? 'OK' : 'MISSING';
        console.log(`  [${status.padEnd(8)}] ${k}: ${v || '(not set)'}`);
    }
}

async function auditContent(html, label) {
    console.log(`\n=== CONTENT INSPECTION: ${label} ===`);
    const tests = [
        ['hreflang en', /hreflang="en"/],
        ['hreflang ar', /hreflang="ar"/],
        ['hreflang fr', /hreflang="fr"/],
        ['hreflang ru', /hreflang="ru"/],
        ['canonical', /<link rel="canonical"/],
        ['og:title', /property="og:title"/],
        ['og:image', /property="og:image"/],
        ['JSON-LD', /application\/ld\+json/],
        ['hero <picture>', /<picture>[\s\S]*?hero-bg/],
        ['data-cta-id (new)', /data-cta-id=/],
        ['quick-trust strip (new)', /class="quick-trust"/],
        ['final-cta lang row (new)', /final-cta__lang-row/],
        ['whatsapp_click handler (new)', /whatsapp_click/],
        ['matrix freeze comment (new)', /PAUSED 2026-05-01/],
        ['preload AVIF (new)', /rel="preload"[^>]*type="image\/avif"/],
        ['old engagement-prompt 60% trigger (should disappear after deploy)', /scrollPct >= engageThreshold/],
        ['old A/B matrix register (should disappear after deploy)', /ab_test_matrix_assigned/]
    ];
    for (const [name, re] of tests) {
        const found = re.test(html);
        console.log(`  [${found ? 'YES' : 'NO '}] ${name}`);
    }
    const waLinks = (html.match(/href="https:\/\/wa\.me\/[^"]+"/g) || []).length;
    const sourceTagged = (html.match(/href="https:\/\/wa\.me\/[^"]*[?&]source=/g) || []).length;
    console.log(`  wa.me links found: ${waLinks}, with &source=: ${sourceTagged}`);
}

async function auditSitemap() {
    console.log('\n=== SITEMAP VALIDATION ===');
    const r = await probe('/sitemap.xml');
    if (r.status !== 200) {
        console.log(`  FAIL: sitemap returned ${r.status}`);
        return;
    }
    const urls = (r.body.match(/<loc>([^<]+)<\/loc>/g) || []).map((m) => m.replace(/<\/?loc>/g, ''));
    console.log(`  ${urls.length} URLs in sitemap`);
    let ok = 0, bad = 0;
    for (const u of urls.slice(0, 8)) {
        const probeRes = await probe(u.replace(ORIGIN, ''), { method: 'HEAD' });
        if (probeRes.status === 200) ok++; else bad++;
        console.log(`    ${probeRes.status}  ${u}`);
    }
    console.log(`  ${ok} ok / ${bad} non-200 (first 8 sampled)`);
}

async function stressTest(path, concurrency, durationMs) {
    console.log(`\n=== STRESS: ${concurrency} parallel, ${durationMs / 1000}s, path=${path} ===`);
    const deadline = Date.now() + durationMs;
    const ttfbs = [];
    const totals = [];
    const statuses = {};
    let errors = 0;
    let inflight = 0;
    let completed = 0;

    async function worker() {
        while (Date.now() < deadline) {
            inflight++;
            const r = await probe(path, { dropBody: true });
            inflight--;
            completed++;
            if (r.error) { errors++; continue; }
            statuses[r.status] = (statuses[r.status] || 0) + 1;
            if (r.ttfb_ms) ttfbs.push(r.ttfb_ms);
            if (r.total_ms) totals.push(r.total_ms);
        }
    }

    const workers = [];
    for (let i = 0; i < concurrency; i++) workers.push(worker());
    const t0 = Date.now();
    await Promise.all(workers);
    const elapsed = (Date.now() - t0) / 1000;

    const rps = (completed / elapsed).toFixed(1);
    console.log(`  Requests: ${completed}  Errors: ${errors}  RPS: ${rps}  Elapsed: ${elapsed.toFixed(1)}s`);
    console.log(`  Statuses: ${JSON.stringify(statuses)}`);
    console.log(`  TTFB:  p50 ${fmtMs(pct(ttfbs, 50))}  p75 ${fmtMs(pct(ttfbs, 75))}  p95 ${fmtMs(pct(ttfbs, 95))}  p99 ${fmtMs(pct(ttfbs, 99))}  max ${fmtMs(pct(ttfbs, 100))}`);
    console.log(`  Total: p50 ${fmtMs(pct(totals, 50))}  p75 ${fmtMs(pct(totals, 75))}  p95 ${fmtMs(pct(totals, 95))}  p99 ${fmtMs(pct(totals, 99))}  max ${fmtMs(pct(totals, 100))}`);
}

async function deviceVariants() {
    console.log('\n=== USER-AGENT VARIANTS (cold root request) ===');
    const uas = [
        ['Desktop Chrome', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'],
        ['iPhone Safari',  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'],
        ['Android Chrome', 'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'],
        ['Googlebot',      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)']
    ];
    for (const [name, ua] of uas) {
        const r = await probe('/', { ua, dropBody: true });
        console.log(`  ${name.padEnd(18)} ${r.status}  ttfb ${fmtMs(r.ttfb_ms)}  ${fmtKB(r.bytes)}`);
    }
}

async function compressionCheck() {
    console.log('\n=== COMPRESSION ===');
    for (const enc of ['identity', 'gzip', 'br', 'gzip, br, zstd']) {
        const r = await probe('/', { acceptEncoding: enc, dropBody: true });
        console.log(`  Accept-Encoding="${enc.padEnd(16)}"  ${r.status}  ${fmtKB(r.bytes).padStart(8)}  enc=${r.headers?.['content-encoding'] || '-'}`);
    }
}

async function langAcceptCheck() {
    console.log('\n=== ACCEPT-LANGUAGE BEHAVIOUR (root) ===');
    // Today the server returns the same EN HTML regardless. Auto-route is client-side
    // (added in main.js but not yet deployed). This test confirms whether the server
    // itself does any content-negotiation — it should NOT, so client-side route can
    // run uninterfered after deploy.
    for (const al of ['en-US', 'ar-AE', 'fr-FR', 'ru-RU']) {
        const r = await probe('/', { acceptLanguage: al });
        const lang = r.body?.match(/<html[^>]*lang="([^"]+)"/)?.[1] || '-';
        const isAR = /<html[^>]*dir="rtl"/.test(r.body || '');
        console.log(`  Accept-Language=${al.padEnd(8)}  ${r.status}  html lang="${lang}"  rtl=${isAR}`);
    }
}

async function main() {
    console.log(`Smart Deals Global — baseline audit + stress\nTarget: ${ORIGIN}\nStarted: ${new Date().toISOString()}`);

    await auditEntryPoints();
    await auditAssets();
    await auditExpectedNewAssets();
    await auditHeaders();
    await compressionCheck();
    await langAcceptCheck();
    await deviceVariants();
    await auditSitemap();

    // Pull EN root once for content checks
    const root = await probe('/');
    if (root.body) await auditContent(root.body, 'EN /');
    const ar = await probe('/ar/');
    if (ar.body) await auditContent(ar.body, 'AR /ar/');

    // Concurrency stress — gentle, this is a customer-facing site on Netlify free tier.
    // 25 parallel x 30s ≈ 750–1500 reqs which is well within edge cache capacity but
    // enough to surface tail latency and any rate limits.
    await stressTest('/', 25, 30000);
    await stressTest('/ar/', 10, 15000);
    await stressTest('/css/styles.css', 25, 15000);
    await stressTest('/images/hero-bg.jpg', 15, 15000);

    console.log(`\nFinished: ${new Date().toISOString()}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
