// Quick re-run of the content + sitemap sections after fixing brotli decompression.
import https from 'node:https';
import zlib from 'node:zlib';

const ORIGIN = 'https://smartdeals.global';

function probe(p) {
    return new Promise((resolve) => {
        const url = new URL(p, ORIGIN);
        https.get({
            hostname: url.hostname, path: url.pathname,
            headers: { 'Accept-Encoding': 'gzip, br', 'User-Agent': 'sdg-content-recheck/1.0' }
        }, (res) => {
            const chunks = [];
            res.on('data', (c) => chunks.push(c));
            res.on('end', () => {
                const enc = (res.headers['content-encoding'] || '').toLowerCase();
                const raw = Buffer.concat(chunks);
                let body;
                try {
                    if (enc === 'br') body = zlib.brotliDecompressSync(raw).toString('utf8');
                    else if (enc === 'gzip') body = zlib.gunzipSync(raw).toString('utf8');
                    else body = raw.toString('utf8');
                } catch (_) { body = raw.toString('utf8'); }
                resolve({ status: res.statusCode, body });
            });
        }).on('error', (e) => resolve({ error: e.message }));
    });
}

const tests = [
    ['hreflang en', /hreflang="en"/],
    ['hreflang ar', /hreflang="ar"/],
    ['hreflang fr', /hreflang="fr"/],
    ['hreflang ru', /hreflang="ru"/],
    ['canonical', /<link\s+rel="canonical"/],
    ['og:title', /property="og:title"/],
    ['og:image', /property="og:image"/],
    ['JSON-LD', /application\/ld\+json/],
    ['hero <picture>', /<picture>[\s\S]*?hero-bg/],
    ['data-cta-id (NEW)', /data-cta-id=/],
    ['quick-trust strip (NEW)', /class="quick-trust"/],
    ['final-cta lang row (NEW)', /final-cta__lang-row/],
    ['preload AVIF (NEW)', /rel="preload"[^>]*type="image\/avif"/],
    ['old engagement-prompt 60% trigger (drops after deploy)', /scrollPct\s*>=\s*engageThreshold/],
    ['old A/B matrix register (drops after deploy)', /ab_test_matrix_assigned/],
    ['CSP meta', /<meta[^>]*http-equiv="Content-Security-Policy"/i],
    ['robots noindex', /<meta[^>]*name="robots"[^>]*noindex/i]
];

async function inspect(label, path) {
    const r = await probe(path);
    if (!r.body) { console.log(`${label}: ERROR ${r.error || r.status}`); return; }
    console.log(`\n=== ${label} (${r.body.length.toLocaleString()} chars) ===`);
    for (const [name, re] of tests) {
        const found = re.test(r.body);
        console.log(`  [${found ? 'YES' : 'NO '}] ${name}`);
    }
    const waLinks = (r.body.match(/href="https:\/\/wa\.me\/[^"]+"/g) || []).length;
    const waSourced = (r.body.match(/href="https:\/\/wa\.me\/[^"]*[?&]source=/g) || []).length;
    console.log(`  wa.me <a href>s: ${waLinks}, with &source=: ${waSourced}`);
    const heroImg = r.body.match(/class="hero__bg-img"[^>]*src="([^"]+)"/)?.[1] || '(no hero img)';
    console.log(`  hero img src: ${heroImg}`);
    const lang = r.body.match(/<html[^>]*lang="([^"]+)"/)?.[1] || '-';
    const dir = r.body.match(/<html[^>]*dir="([^"]+)"/)?.[1] || '-';
    console.log(`  <html lang="${lang}" dir="${dir}">`);
}

async function sitemap() {
    const r = await probe('/sitemap.xml');
    const urls = (r.body || '').match(/<loc>([^<]+)<\/loc>/g) || [];
    console.log(`\n=== sitemap.xml ===\n  ${urls.length} URLs`);
    for (const u of urls.slice(0, 12)) console.log('   ', u.replace(/<\/?loc>/g, ''));
}

await inspect('EN /', '/');
await inspect('AR /ar/', '/ar/');
await inspect('FR /fr/', '/fr/');
await inspect('RU /ru/', '/ru/');
await sitemap();
