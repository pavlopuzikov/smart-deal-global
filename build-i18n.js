#!/usr/bin/env node
// build-i18n.js — Generate pre-rendered per-language HTML variants from index.html + i18n dict.
// Output: ./index.html (en, regenerated), ./ar/index.html, ./fr/index.html, ./ru/index.html, ./sitemap.xml

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const TEMPLATE_PATH = path.join(ROOT, 'index.html');
const JS_PATH = path.join(ROOT, 'js', 'main.js');

const TEMPLATE_RAW = fs.readFileSync(TEMPLATE_PATH, 'utf8');
const JS_SRC = fs.readFileSync(JS_PATH, 'utf8');

// Extract I18N_DICT literal from main.js by locating declaration and balanced braces.
function extractDict(src) {
    const marker = 'const I18N_DICT = ';
    const start = src.indexOf(marker);
    if (start === -1) throw new Error('I18N_DICT not found in main.js');
    let i = src.indexOf('{', start);
    let depth = 0;
    for (; i < src.length; i++) {
        const c = src[i];
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) { i++; break; } }
    }
    const literal = src.slice(start + marker.length, i);
    return new Function(`return ${literal};`)();
}

const I18N_DICT = extractDict(JS_SRC);

const SEO_META = {
    en: {
        title: 'Smart Deals Global · Curated Real Estate in Dubai, Monaco & Paris',
        description: '50+ curated property deals across 10 global markets · Dubai, Monaco, Paris & more. Discounts up to 23%, flexible payment plans, expert advisory.',
        ogLocale: 'en_US',
        ogTitle: 'Smart Deals Global · Curated Real Estate, Worldwide',
        ogDescription: '50+ curated property deals in 10 global markets. Discounts up to 23%, flexible plans, expert advisory.',
        jsonldDescription: 'Curated smart real estate deals across 10 global markets including Dubai, Monaco, France, Switzerland, and Thailand.',
        itemListDescription: '50+ curated real estate deals across 10 global markets',
        orgDescription: 'Curated real-estate advisory surfacing 50+ smart property deals across Dubai, Monaco, Paris, Switzerland, Thailand and Azerbaijan.'
    },
    ar: {
        title: 'سمارت ديلز جلوبال · عقارات مختارة في دبي، موناكو وباريس',
        description: 'أكثر من 50 صفقة عقارية مختارة في 10 أسواق · دبي، موناكو، باريس والمزيد. خصومات حتى 23٪، خطط دفع مرنة، استشارات خبراء.',
        ogLocale: 'ar_AE',
        ogTitle: 'سمارت ديلز جلوبال · عقارات مختارة حول العالم',
        ogDescription: 'أكثر من 50 صفقة عقارية مختارة في 10 أسواق عالمية. خصومات حتى 23٪، خطط مرنة، استشارات خبراء.',
        jsonldDescription: 'صفقات عقارية ذكية مختارة في 10 أسواق عالمية بما في ذلك دبي وموناكو وفرنسا وسويسرا وتايلاند.',
        itemListDescription: 'أكثر من 50 صفقة عقارية مختارة في 10 أسواق عالمية',
        orgDescription: 'استشارات عقارية مختارة تقدم أكثر من 50 صفقة ذكية في دبي وموناكو وباريس وسويسرا وتايلاند وأذربيجان.'
    },
    fr: {
        title: 'Smart Deals Global · Biens sélectionnés à Dubaï, Monaco & Paris',
        description: "50+ offres immobilières sélectionnées dans 10 marchés · Dubaï, Monaco, Paris & plus. Remises jusqu'à 23%, paiements flexibles, conseils d'experts.",
        ogLocale: 'fr_FR',
        ogTitle: 'Smart Deals Global · Immobilier sélectionné, dans le monde entier',
        ogDescription: "50+ offres immobilières sélectionnées dans 10 marchés. Remises jusqu'à 23%, plans flexibles, conseils d'experts.",
        jsonldDescription: 'Offres immobilières intelligentes sélectionnées dans 10 marchés mondiaux incluant Dubaï, Monaco, la France, la Suisse et la Thaïlande.',
        itemListDescription: '50+ offres immobilières sélectionnées dans 10 marchés mondiaux',
        orgDescription: 'Conseil immobilier sélectionné qui surface 50+ offres intelligentes à Dubaï, Monaco, Paris, Suisse, Thaïlande et Azerbaïdjan.'
    },
    ru: {
        title: 'Smart Deals Global · Кураторская недвижимость в Дубае, Монако и Париже',
        description: 'Более 50 кураторских сделок на 10 мировых рынках · Дубай, Монако, Париж и далее. Скидки до 23%, гибкие планы, экспертные консультации.',
        ogLocale: 'ru_RU',
        ogTitle: 'Smart Deals Global · Кураторская недвижимость по всему миру',
        ogDescription: 'Более 50 кураторских сделок на 10 мировых рынках. Скидки до 23%, гибкие планы, экспертные консультации.',
        jsonldDescription: 'Кураторские умные сделки с недвижимостью на 10 мировых рынках, включая Дубай, Монако, Францию, Швейцарию и Таиланд.',
        itemListDescription: 'Более 50 кураторских сделок с недвижимостью на 10 мировых рынках',
        orgDescription: 'Кураторский консалтинг по недвижимости, предлагающий более 50 умных сделок в Дубае, Монако, Париже, Швейцарии, Таиланде и Азербайджане.'
    }
};

const SITE = 'https://smartdealsglobal.com';
const LANGS = ['en', 'ar', 'fr', 'ru'];
const URL_FOR = { en: `${SITE}/`, ar: `${SITE}/ar/`, fr: `${SITE}/fr/`, ru: `${SITE}/ru/` };

// Per-market GeoCoordinates for LocalBusiness / Place schema
const MARKETS = [
    { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
    { name: 'Abu Dhabi', country: 'UAE', lat: 24.4539, lng: 54.3773 },
    { name: 'Monte Carlo', country: 'Monaco', lat: 43.7384, lng: 7.4246 },
    { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
    { name: 'Montreux', country: 'Switzerland', lat: 46.4312, lng: 6.9107 },
    { name: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923 },
    { name: 'Baku', country: 'Azerbaijan', lat: 40.4093, lng: 49.8671 }
];

function buildPlacesJsonLd() {
    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Smart Deals Global · Operating Markets',
        'itemListElement': MARKETS.map((m, i) => ({
            '@type': 'Place',
            'position': i + 1,
            'name': `${m.name}, ${m.country}`,
            'geo': { '@type': 'GeoCoordinates', 'latitude': m.lat, 'longitude': m.lng },
            'containedInPlace': { '@type': 'Country', 'name': m.country }
        }))
    }, null, 2);
}

function esc(s) { return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
function jsonEsc(s) { return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }

function build(lang) {
    let html = TEMPLATE_RAW;
    const meta = SEO_META[lang];
    const dict = I18N_DICT[lang];
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    // 1. <html lang dir>
    html = html.replace(/<html lang="[^"]*"[^>]*>/, `<html lang="${lang}" dir="${dir}">`);

    // 2. <title>
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(meta.title)}</title>`);

    // 3. description
    html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(meta.description)}">`);

    // 4. remove keywords tag (deprecated / spam signal)
    html = html.replace(/\n?\s*<meta name="keywords" content="[^"]*">/, '');

    // 5. OG title/description
    html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(meta.ogTitle)}">`);
    html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(meta.ogDescription)}">`);

    // 6. Twitter
    html = html.replace(/<meta name="twitter:title" content="[^"]*">/, `<meta name="twitter:title" content="${esc(meta.ogTitle)}">`);
    html = html.replace(/<meta name="twitter:description" content="[^"]*">/, `<meta name="twitter:description" content="${esc(meta.ogDescription)}">`);

    // 7. canonical → self
    html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${URL_FOR[lang]}">`);

    // 8. Inject hreflang + og:locale after canonical. Idempotent: strip any existing
    //    hreflang alternates, og:locale[:alternate], and Content-Language tags first
    //    so repeat runs on the same file don't stack them.
    html = html.replace(/\n?\s*<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '');
    html = html.replace(/\n?\s*<meta property="og:locale(?::alternate)?" content="[^"]*">/g, '');
    html = html.replace(/\n?\s*<meta http-equiv="Content-Language" content="[^"]*">/g, '');
    const alternates = LANGS.map(l => `    <link rel="alternate" hreflang="${l}" href="${URL_FOR[l]}">`).join('\n');
    const xDefault = `    <link rel="alternate" hreflang="x-default" href="${URL_FOR.en}">`;
    const ogLocale = `    <meta property="og:locale" content="${meta.ogLocale}">`;
    const ogLocaleAlt = LANGS.filter(l => l !== lang).map(l => `    <meta property="og:locale:alternate" content="${SEO_META[l].ogLocale}">`).join('\n');
    const contentLang = `    <meta http-equiv="Content-Language" content="${lang}">`;
    const block = `\n${alternates}\n${xDefault}\n${ogLocale}\n${ogLocaleAlt}\n${contentLang}`;
    html = html.replace(
        `<link rel="canonical" href="${URL_FOR[lang]}">`,
        `<link rel="canonical" href="${URL_FOR[lang]}">` + block
    );

    // 9. Translate JSON-LD description fields (Organization + ItemList)
    html = html.replace(
        /"description": "Curated smart real estate deals across 10 global markets[^"]*"/,
        `"description": "${jsonEsc(meta.jsonldDescription)}"`
    );
    html = html.replace(
        /"description": "50\+ curated real estate deals across 10 global markets"/,
        `"description": "${jsonEsc(meta.itemListDescription)}"`
    );
    // Session A's Organization block description — swap per variant
    html = html.replace(
        /"description": "Curated real-estate advisory surfacing 50\+ smart property deals[^"]*"/,
        `"description": "${jsonEsc(meta.orgDescription)}"`
    );

    // 10. Translate FAQ JSON-LD questions (answers stay as-is — Google still ranks the block)
    for (let i = 1; i <= 5; i++) {
        const q = I18N_DICT.en[`faq.q${i}.q`];
        const newQ = dict[`faq.q${i}.q`];
        if (q && newQ) {
            html = html.split(`"name": "${q}"`).join(`"name": "${jsonEsc(newQ)}"`);
        }
    }

    // 11. Append Places ItemList JSON-LD (geo coordinates for each market).
    // Idempotent: strip any JSON-LD <script> block that matches the Places marker
    // before re-inserting the fresh one. (The EN template is the same file we
    // write to, so naive appends would stack on every rebuild.)
    html = html.replace(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/g,
        (whole, body) => /Smart Deals Global [—·] Operating Markets/.test(body) ? '' : whole
    );
    const placesBlock = `\n    <script type="application/ld+json">\n${buildPlacesJsonLd()}\n    </script>\n`;
    html = html.replace('</body>', placesBlock + '</body>');

    // 12. Pre-render data-i18n (single-line text) and data-i18n-html (may contain inline tags)
    html = html.replace(
        /<([a-zA-Z0-9]+)([^>]*?)\sdata-i18n="([^"]+)"([^>]*)>([\s\S]*?)<\/\1>/g,
        (m, tag, pre, key, post, body) => {
            const val = dict[key];
            if (val === undefined) return m;
            // If body contains child tags, skip (data-i18n is text-only; use data-i18n-html for markup)
            if (/<[a-zA-Z]/.test(body)) return m;
            return `<${tag}${pre} data-i18n="${key}"${post}>${val}</${tag}>`;
        }
    );
    html = html.replace(
        /<([a-zA-Z0-9]+)([^>]*?)\sdata-i18n-html="([^"]+)"([^>]*)>[\s\S]*?<\/\1>/g,
        (m, tag, pre, key, post) => {
            const val = dict[key];
            if (val === undefined) return m;
            return `<${tag}${pre} data-i18n-html="${key}"${post}>${val}</${tag}>`;
        }
    );

    // 13. Mark active lang in switcher + update current label
    html = html.replace(
        /<button role="option" data-lang="([a-z]+)"[^>]*>/g,
        (m, l) => `<button role="option" data-lang="${l}"${l === lang ? ' class="is-active"' : ''}>`
    );
    html = html.replace(
        /<span class="lang-switcher__current">[A-Z]{2}<\/span>/,
        `<span class="lang-switcher__current">${lang.toUpperCase()}</span>`
    );

    // 14. Fix asset paths for subdirectory variants (but leave anchor #hashes alone)
    if (lang !== 'en') {
        html = html.replace(/(src|href)="(images|css|js|properties)\//g, '$1="../$2/');
    }

    return html;
}

// Write variants
for (const lang of LANGS) {
    const out = build(lang);
    const dir = lang === 'en' ? ROOT : path.join(ROOT, lang);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), out, 'utf8');
    console.log(`  ${lang.toUpperCase()} -> ${path.relative(ROOT, path.join(dir, 'index.html'))}`);
}

// Rewrite sitemap.xml with hreflang alternates
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${LANGS.map(lang => `  <url>
    <loc>${URL_FOR[lang]}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${lang === 'en' ? '1.0' : '0.9'}</priority>
${LANGS.map(l => `    <xhtml:link rel="alternate" hreflang="${l}" href="${URL_FOR[l]}"/>`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${URL_FOR.en}"/>
  </url>`).join('\n')}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap, 'utf8');
console.log('  sitemap.xml (4 URLs x hreflang alternates)');

console.log('\nDone.');
