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

// Extract a top-level const array literal from main.js (same balanced-bracket approach as extractDict).
function extractArray(src, varName) {
    const marker = `const ${varName} = `;
    const start = src.indexOf(marker);
    if (start === -1) throw new Error(`${varName} not found in main.js`);
    let i = src.indexOf('[', start);
    let depth = 0;
    for (; i < src.length; i++) {
        const c = src[i];
        if (c === '[') depth++;
        else if (c === ']') { depth--; if (depth === 0) { i++; break; } }
    }
    const literal = src.slice(start + marker.length, i);
    return new Function(`return ${literal};`)();
}

// Property arrays with their associated section hash and country for schema.org
const PROPERTY_GROUPS = [
    { key: 'readyProperties',       hash: '#ready',       country: 'AE', city: null },
    { key: 'offplanProperties',     hash: '#offplan',     country: 'AE', city: null },
    { key: 'monacoProperties',      hash: '#monaco',      country: 'MC', city: 'Monaco' },
    { key: 'parisProperties',       hash: '#france',      country: 'FR', city: 'Paris' },
    { key: 'switzerlandProperties', hash: '#switzerland', country: 'CH', city: null },
    { key: 'azerbaijanProperties',  hash: '#azerbaijan',  country: 'AZ', city: 'Baku' },
    { key: 'thailandProperties',    hash: '#thailand',    country: 'TH', city: null }
];

// Extract all property arrays from main.js
const ALL_PROPERTIES = [];
for (const group of PROPERTY_GROUPS) {
    const props = extractArray(JS_SRC, group.key);
    for (const p of props) {
        ALL_PROPERTIES.push({ ...p, _hash: group.hash, _country: group.country, _defaultCity: group.city });
    }
}

// Normalise price: readyProperties use smartPrice, offplanProperties use startingPrice, others use price
function getPrice(p) {
    return p.smartPrice || p.startingPrice || p.price || 0;
}

// Extract city from location string (first segment before comma, or the whole string)
function getCity(p) {
    if (p._defaultCity) return p._defaultCity;
    const parts = p.location.split(',').map(s => s.trim());
    // For Dubai properties, city is typically the last part
    return parts[parts.length - 1] || parts[0];
}

// Parse numeric sqft from size string like "1,356 sqft" or "724+ sqft"
function parseSqft(sizeStr) {
    const cleaned = sizeStr.replace(/[,+]/g, '').replace(/\s*sqft\s*/i, '').trim();
    return cleaned;
}

// Build the hidden SEO property listing HTML
function buildSeoPropertiesHtml() {
    const items = ALL_PROPERTIES.map(p => {
        const price = getPrice(p);
        const formatted = `${p.currency} ${price.toLocaleString('en-US')}`;
        return `    <li>${esc(p.name)} &mdash; ${esc(p.location)} &mdash; ${esc(p.size)} &mdash; ${formatted}</li>`;
    });
    return [
        '<!-- SEO: Pre-rendered property data for search engine crawlers -->',
        '<div class="seo-properties" aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)">',
        '  <h2>Properties Available — Smart Deals &amp; Distress Deals</h2>',
        '  <p>Curated property deals, distress deals, below-market opportunities, and motivated seller listings across Dubai, Abu Dhabi, Monaco, Paris, Switzerland, Thailand, and Azerbaijan. Off-plan payment plans, ready-to-move properties, high rental yield investments, and Golden Visa eligible real estate.</p>',
        '  <ul>',
        ...items,
        '  </ul>',
        '  <p>Smart Deals Global is a Dubai-based real estate advisory offering curated property deals and distress deals across 10 global markets including Dubai, Abu Dhabi, Monaco, Paris, Switzerland, Thailand, and Azerbaijan. Our April 2026 Dubai secondary market collection averages 12-15% below DLD comparable transaction values. Off-plan payment plans include 70/30, 60/40, and 20/50/30 structures with up to 5-year post-handover options. Advisory is free for buyers &mdash; we are compensated by the developer or seller side. Contact via WhatsApp: +971 55 957 9113.</p>',
        '  <h3>Dubai Property Market Comparison 2026</h3>',
        '  <p>Dubai rental yields average 6-8% gross in 2026, outperforming London (3-4%), New York (4-5%), and Singapore (3-4%). Dubai has zero income tax on rental income, zero capital gains tax, and offers Golden Visa residency for property investments above AED 2 million. Off-plan properties in Dubai typically require 10-20% down payment with developer payment plans spanning 3-7 years. Secondary market (ready) properties offer immediate rental income with average 7-9% yields in areas like Dubai Marina, JVC, and Business Bay. Monaco prices average $89,240 per square meter, the highest globally. Smart Deals Global sources opportunities with 10-23% discounts across all markets.</p>',
        '  <h3>Why Choose Smart Deals Global</h3>',
        '  <p>Unlike traditional real estate agencies that charge buyer fees, Smart Deals Global provides free advisory for buyers across 10 international markets. Our team speaks English, Arabic, French, and Russian. We handle the full acquisition process including property selection, negotiation, legal coordination, and post-purchase setup. Our collection includes secondary market properties with verified price advantages, off-plan developments with negotiated payment plans, and exclusive off-market opportunities not publicly listed. All properties are individually evaluated for pricing advantage, rental yield potential, capital appreciation, and payment plan flexibility.</p>',
        '</div>'
    ].join('\n    ');
}

// Map ISO 3166-1 alpha-2 to country name for schema.org
const COUNTRY_NAMES = {
    AE: 'United Arab Emirates', MC: 'Monaco', FR: 'France',
    CH: 'Switzerland', AZ: 'Azerbaijan', TH: 'Thailand'
};

// Build JSON-LD ItemList of RealEstateListing
function buildPropertyJsonLd() {
    const items = ALL_PROPERTIES.map((p, idx) => {
        const price = getPrice(p);
        const city = getCity(p);
        const country = COUNTRY_NAMES[p._country] || p._country;
        const sqft = parseSqft(p.size);
        const listing = {
            '@type': 'RealEstateListing',
            'name': p.name,
            'url': `${SITE}/${p._hash}`,
            'description': p.smartReason || `${p.name} in ${p.location}`,
            'offers': {
                '@type': 'Offer',
                'price': price,
                'priceCurrency': p.currency
            },
            'address': {
                '@type': 'PostalAddress',
                'addressLocality': city,
                'addressCountry': country
            },
            'floorSize': {
                '@type': 'QuantitativeValue',
                'value': sqft,
                'unitCode': 'FTK'
            },
            'numberOfBedrooms': p.bedrooms,
            'numberOfBathroomsTotal': p.bathrooms != null ? p.bathrooms : 0,
            'image': `${SITE}/${p.image}`
        };
        return {
            '@type': 'ListItem',
            'position': idx + 1,
            'item': listing
        };
    });

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Smart Deals Global Property Collection',
        'numberOfItems': ALL_PROPERTIES.length,
        'itemListElement': items
    }, null, 2);
}

const SEO_META = {
    en: {
        title: 'Smart Deals Global · Curated Real Estate in Dubai, Monaco & Paris',
        description: '50+ curated property deals & distress deals across 10 global markets · Dubai, Monaco, Paris & more. Discounts up to 23%, flexible payment plans, expert advisory.',
        ogLocale: 'en_US',
        ogTitle: 'Smart Deals Global · Curated Real Estate, Worldwide',
        ogDescription: '50+ curated property & distress deals in 10 global markets. Discounts up to 23%, flexible plans, expert advisory.',
        jsonldDescription: 'Curated smart real estate deals and distress deals across 10 global markets including Dubai, Monaco, France, Switzerland, and Thailand.',
        itemListDescription: '50+ curated real estate and distress deals across 10 global markets',
        orgDescription: 'Curated real-estate advisory surfacing 50+ smart property deals and distress deals across Dubai, Monaco, Paris, Switzerland, Thailand and Azerbaijan.'
    },
    ar: {
        title: 'سمارت ديلز جلوبال · عقارات مختارة وصفقات عاجلة في دبي، موناكو وباريس',
        description: 'أكثر من 50 صفقة عقارية مختارة وصفقات عاجلة في 10 أسواق · دبي، موناكو، باريس والمزيد. خصومات حتى 23٪، خطط دفع مرنة، استشارات خبراء.',
        ogLocale: 'ar_AE',
        ogTitle: 'سمارت ديلز جلوبال · عقارات مختارة وصفقات عاجلة حول العالم',
        ogDescription: 'أكثر من 50 صفقة عقارية مختارة وصفقات عاجلة في 10 أسواق عالمية. خصومات حتى 23٪، خطط مرنة، استشارات خبراء.',
        jsonldDescription: 'صفقات عقارية ذكية مختارة وصفقات عاجلة في 10 أسواق عالمية بما في ذلك دبي وموناكو وفرنسا وسويسرا وتايلاند.',
        itemListDescription: 'أكثر من 50 صفقة عقارية مختارة وصفقات عاجلة في 10 أسواق عالمية',
        orgDescription: 'استشارات عقارية مختارة تقدم أكثر من 50 صفقة ذكية وصفقات عاجلة في دبي وموناكو وباريس وسويسرا وتايلاند وأذربيجان.'
    },
    fr: {
        title: 'Smart Deals Global · Biens sélectionnés et ventes urgentes à Dubaï, Monaco & Paris',
        description: "50+ offres immobilières sélectionnées et ventes urgentes dans 10 marchés · Dubaï, Monaco, Paris & plus. Remises jusqu'à 23%, paiements flexibles, conseils d'experts.",
        ogLocale: 'fr_FR',
        ogTitle: 'Smart Deals Global · Immobilier sélectionné et ventes urgentes, dans le monde entier',
        ogDescription: "50+ offres immobilières sélectionnées et ventes urgentes dans 10 marchés. Remises jusqu'à 23%, plans flexibles, conseils d'experts.",
        jsonldDescription: 'Offres immobilières intelligentes sélectionnées et ventes urgentes dans 10 marchés mondiaux incluant Dubaï, Monaco, la France, la Suisse et la Thaïlande.',
        itemListDescription: '50+ offres immobilières sélectionnées et ventes urgentes dans 10 marchés mondiaux',
        orgDescription: 'Conseil immobilier sélectionné qui surface 50+ offres intelligentes et ventes urgentes à Dubaï, Monaco, Paris, Suisse, Thaïlande et Azerbaïdjan.'
    },
    ru: {
        title: 'Smart Deals Global · Кураторская недвижимость и срочные сделки в Дубае, Монако и Париже',
        description: 'Более 50 кураторских и срочных сделок на 10 мировых рынках · Дубай, Монако, Париж и далее. Скидки до 23%, гибкие планы, экспертные консультации.',
        ogLocale: 'ru_RU',
        ogTitle: 'Smart Deals Global · Кураторская недвижимость и срочные сделки по всему миру',
        ogDescription: 'Более 50 кураторских и срочных сделок на 10 мировых рынках. Скидки до 23%, гибкие планы, экспертные консультации.',
        jsonldDescription: 'Кураторские умные сделки и срочные сделки с недвижимостью на 10 мировых рынках, включая Дубай, Монако, Францию, Швейцарию и Таиланд.',
        itemListDescription: 'Более 50 кураторских и срочных сделок с недвижимостью на 10 мировых рынках',
        orgDescription: 'Кураторский консалтинг по недвижимости, предлагающий более 50 умных и срочных сделок в Дубае, Монако, Париже, Швейцарии, Таиланде и Азербайджане.'
    }
};

const SITE = 'https://smartdeals.global';

// Pre-built SEO blocks (computed once, shared across all language variants)
const SEO_PROPERTIES_HTML = buildSeoPropertiesHtml();
const PROPERTY_JSONLD = buildPropertyJsonLd();

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

// Map market cities to their relevant section hashes and ISO country codes
const MARKET_DETAILS = {
    'Dubai':       { hash: '#ready',       countryCode: 'AE' },
    'Abu Dhabi':   { hash: '#ready',       countryCode: 'AE' },
    'Monte Carlo': { hash: '#monaco',      countryCode: 'MC' },
    'Paris':       { hash: '#france',      countryCode: 'FR' },
    'Montreux':    { hash: '#switzerland', countryCode: 'CH' },
    'Phuket':      { hash: '#thailand',    countryCode: 'TH' },
    'Baku':        { hash: '#azerbaijan',  countryCode: 'AZ' }
};

// Build LocalBusiness (RealEstateAgent) JSON-LD for each market
function buildLocalBusinessJsonLd() {
    const items = MARKETS.map((m, i) => {
        const detail = MARKET_DETAILS[m.name] || { hash: '', countryCode: '' };
        return {
            '@type': 'ListItem',
            'position': i + 1,
            'item': {
                '@type': 'RealEstateAgent',
                'name': `Smart Deals Global \u2014 ${m.name}`,
                'address': {
                    '@type': 'PostalAddress',
                    'addressLocality': m.name,
                    'addressCountry': detail.countryCode
                },
                'geo': {
                    '@type': 'GeoCoordinates',
                    'latitude': m.lat,
                    'longitude': m.lng
                },
                'url': `${SITE}/${detail.hash}`,
                'telephone': '+971559579113',
                'knowsLanguage': ['en', 'ar', 'fr', 'ru']
            }
        };
    });

    return JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        'name': 'Smart Deals Global Market Offices',
        'itemListElement': items
    }, null, 2);
}

const LOCAL_BUSINESS_JSONLD = buildLocalBusinessJsonLd();

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

    // 11b. Inject pre-rendered property data (hidden div) for search engine crawlers.
    //      Idempotent: strip any existing seo-properties block before re-inserting.
    html = html.replace(/\n?\s*<!-- SEO: Pre-rendered property data[\s\S]*?<\/div>\s*/g, '');
    const seoPropsBlock = `\n    ${SEO_PROPERTIES_HTML}\n`;
    html = html.replace('</body>', seoPropsBlock + '</body>');

    // 11b½. Update article:modified_time to build date
    html = html.replace(
        /<meta property="article:modified_time" content="[^"]*">/,
        `<meta property="article:modified_time" content="${new Date().toISOString()}">`
    );

    // 11c. Inject RealEstateListing JSON-LD ItemList.
    //      Idempotent: strip any existing Property Collection JSON-LD block first.
    html = html.replace(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/g,
        (whole, body) => /Smart Deals Global Property Collection/.test(body) ? '' : whole
    );
    const propertyJsonLdBlock = `\n    <script type="application/ld+json">\n${PROPERTY_JSONLD}\n    </script>\n`;
    html = html.replace('</body>', propertyJsonLdBlock + '</body>');

    // 11d. Inject LocalBusiness (RealEstateAgent) JSON-LD for each market.
    //      Idempotent: strip any existing Market Offices JSON-LD block first.
    html = html.replace(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>\s*/g,
        (whole, body) => /Smart Deals Global Market Offices/.test(body) ? '' : whole
    );
    const localBusinessBlock = `\n    <script type="application/ld+json">\n${LOCAL_BUSINESS_JSONLD}\n    </script>\n`;
    html = html.replace('</body>', localBusinessBlock + '</body>');

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

    // 14. Translate WhatsApp pre-filled text in wa.me URLs
    const waMap = {
        "Hi%2C%20I%27m%20interested%20in%20your%20curated%20property%20deals.%20Can%20we%20chat%3F": dict['wa.hero'],
        "Hi%2C%20I%27d%20like%20to%20schedule%20a%20consultation%20about%20property%20investment.": dict['wa.consultation'],
        "Hi%2C%20I%27m%20ready%20to%20explore%20property%20opportunities.%20Can%20we%20chat%3F": dict['wa.finalcta'],
        "Hi%2C%20I%27m%20browsing%20your%20property%20collection.%20Can%20we%20chat%3F": dict['wa.mobilecta'],
        "Hi%2C%20I%27d%20like%20to%20discuss%20a%20tailored%20property%20search.": dict['wa.engage']
    };
    for (const [encoded, translated] of Object.entries(waMap)) {
        if (translated) {
            html = html.split(`text=${encoded}`).join(`text=${encodeURIComponent(translated)}`);
        }
    }

    // 15. Translate image alt attributes
    const altMap = {
        'Dubai skyline': dict['alt.hero'],
        'Monaco harbor aerial view': dict['alt.monaco'],
        'Paris cityscape with Eiffel Tower': dict['alt.paris'],
        'Lake Geneva and Swiss Alps': dict['alt.switzerland'],
        'Baku skyline': dict['alt.azerbaijan'],
        'Phuket coastline': dict['alt.thailand'],
        'Burj Al Arab aerial view, Dubai': dict['alt.howWeHelp'],
        'Modern skyscraper exterior': dict['alt.finalCta']
    };
    for (const [en, translated] of Object.entries(altMap)) {
        if (translated) {
            html = html.split(`alt="${en}"`).join(`alt="${esc(translated)}"`);
        }
    }

    // 16. Translate ARIA labels
    const ariaMap = {
        'Change language': dict['aria.changeLang'],
        'Toggle menu': dict['aria.toggleMenu'],
        'Chat on WhatsApp': dict['aria.chatWhatsApp'],
        'Back to top': dict['aria.backToTop'],
        'Close': dict['aria.close']
    };
    for (const [en, translated] of Object.entries(ariaMap)) {
        if (translated) {
            html = html.split(`aria-label="${en}"`).join(`aria-label="${esc(translated)}"`);
        }
    }
    // Previous/Next appear multiple times — replace all
    if (dict['aria.previous']) html = html.split('aria-label="Previous"').join(`aria-label="${esc(dict['aria.previous'])}"`);
    if (dict['aria.next']) html = html.split('aria-label="Next"').join(`aria-label="${esc(dict['aria.next'])}"`);

    // 17. Fix og:url to point to the correct language variant (not always root)
    html = html.replace(
        /<meta property="og:url" content="[^"]*">/,
        `<meta property="og:url" content="${URL_FOR[lang]}">`
    );

    // 18. Fix asset paths for subdirectory variants (but leave anchor #hashes alone)
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
