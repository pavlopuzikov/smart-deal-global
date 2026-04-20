/* ============================================
   SMART DEAL GLOBAL — Main JavaScript
   Bright Premium Edition
   ============================================ */

// ============================================
// 1. CONFIGURATION
// ============================================
const WHATSAPP_NUMBER = "971559579113";

// EmailJS — fill in your credentials from emailjs.com
const EMAILJS_SERVICE_ID = 'service_6xe1v1h';
const EMAILJS_TEMPLATE_ID = 'template_bbadfca';
const EMAILJS_PUBLIC_KEY = '7OEBtmnCkX6-PC0TH';

if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

function notifyEnquiry(propertyName, location, section) {
    if (typeof emailjs === 'undefined') return;
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        title: propertyName,
        name: propertyName,
        message: `Property: ${propertyName}\nLocation: ${location}\nSection: ${section}`,
        time: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai' })
    }).catch(() => { });
}
const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

// ============================================
// 2. PROPERTY DATA
// ============================================
const readyProperties = [
    {
        name: "Hyatt Regency Creek Heights",
        location: "Dubai Healthcare City, Dubai",
        image: "properties/ready/ready-1.jpg",
        size: "615 sqft",
        bedrooms: 0,
        bathrooms: 1,
        originalPrice: 1500000,
        smartPrice: 1150000,
        discount: 23,
        currency: "AED",
        whySmart: ["best-price", "high-rental"],
        smartReason: "High ROI: rental income AED 90-100K/yr. 5-star hotel services & amenities. 23% below original asking."
    },
    {
        name: "La Cote Tower 2",
        location: "Port de La Mer, Dubai",
        image: "properties/ready/ready-2.jpg",
        size: "1,356 sqft",
        bedrooms: 2,
        bathrooms: 2,
        originalPrice: 3300000,
        smartPrice: 3000000,
        discount: 9,
        currency: "AED",
        listing_ref: "BARNES-13484",
        whySmart: ["best-price"],
        smartReason: "Lowest in the market for this layout. Private terrace, coastal living."
    },
    {
        name: "The Edge",
        location: "Business Bay, Dubai",
        image: "properties/ready/ready-3.jpg",
        size: "842 sqft",
        bedrooms: 2,
        bathrooms: 2,
        originalPrice: 2200000,
        smartPrice: 2000000,
        discount: 9,
        currency: "AED",
        whySmart: ["high-appreciation"],
        smartReason: "Burj Khalifa view. High floor. Brand-new condition. 9% below original asking."
    },
    {
        name: "Damac Lagoons, Nice",
        location: "Damac Lagoons, Dubai",
        image: "properties/ready/ready-4.jpg",
        size: "1,550 sqft",
        bedrooms: 4,
        bathrooms: 4,
        originalPrice: 3000000,
        smartPrice: 2850000,
        discount: 5,
        currency: "AED",
        whySmart: ["best-price"],
        smartReason: "Lagoon-front townhouse. Double-glazed windows throughout. 5% below comparable sales."
    },
    {
        name: "Residence 5704",
        location: "Address Beach Resort, JBR, Dubai",
        image: "properties/ready/ready-5.jpg",
        size: "2,555 sqft",
        bedrooms: 3,
        bathrooms: 2,
        smartPrice: 19950000,
        currency: "AED",
        whySmart: ["off-market"],
        smartReason: "Only apartment in the building with 180° unobstructed views: Palm Jumeirah, Bluewaters, Marina skyline. 57th floor, fully reimagined."
    },
    {
        name: "Véla Penthouse",
        location: "Palace Beach Residence, Emaar Beachfront, Dubai",
        image: "properties/ready/ready-6.jpg",
        size: "3,933 sqft",
        bedrooms: 4,
        bathrooms: 4,
        smartPrice: 23450000,
        currency: "AED",
        whySmart: ["off-market"],
        smartReason: "Half-floor penthouse, 42nd floor. Panoramic Palm Jumeirah, sea & Marina views. Premium marbles, handcrafted details."
    },
    {
        name: "The Grand",
        location: "Dubai Creek Harbour, Dubai",
        image: "properties/ready/ready-7.jpg",
        size: "2,630 sqft",
        bedrooms: 3,
        bathrooms: 3,
        smartPrice: 9000000,
        currency: "AED",
        whySmart: ["ready-value"],
        smartReason: "Full sea & Burj Khalifa view. Fully upgraded + furnished. Huge terrace & 2 balconies. Total area: 3,422 sqft."
    },
    {
        name: "Bvlgari Resort Residences",
        location: "Jumeirah Bay Island, Dubai",
        image: "properties/ready/ready-8.jpg",
        size: "2,611 sqft",
        bedrooms: 3,
        bathrooms: 4,
        smartPrice: 40000000,
        currency: "AED",
        whySmart: ["off-market"],
        smartReason: "The Private Collection. Original Bvlgari finishes. High floor, full marina & Downtown views. 3BR + maids."
    },
    {
        name: "The Residences Creek Harbour",
        location: "Dubai Creek Harbour, Dubai",
        image: "properties/ready/creek-harbour.jpg",
        size: "2,659 sqft",
        bedrooms: 3,
        bathrooms: 4,
        smartPrice: 8500000,
        currency: "AED",
        whySmart: ["ready-value", "high-appreciation"],
        smartReason: "Townhouse with sea & Burj Khalifa view. Fully upgraded + furnished. Vacant. Total area: 3,346 sqft."
    },
    {
        name: "Damac Bays Edge",
        location: "Business Bay, Dubai",
        image: "properties/ready/damac-bays-edge.jpg",
        size: "1,385 sqft",
        bedrooms: 2,
        bathrooms: 3,
        originalPrice: 3100000,
        smartPrice: 2900000,
        discount: 6,
        currency: "AED",
        whySmart: ["best-price"],
        smartReason: "Below last transaction (AED 3.1M vs 2.9M). Designed by French interior designer. High floor canal view."
    },
    {
        name: "Bluewater Bay Tower 1",
        location: "Bluewaters Island, Dubai",
        image: "properties/offplan/bluewater-bay.jpg",
        size: "786 sqft",
        bedrooms: 1,
        bathrooms: 1,
        originalPrice: 3011000,
        smartPrice: 2860450,
        discount: 5,
        currency: "AED",
        whySmart: ["best-price"],
        smartReason: "5% below original price. Average 1BR on Bluewaters is AED 4.4M. Full JBR & sea view."
    }
];

const offplanProperties = [
    {
        name: "The Meriva Collection",
        location: "Palm Jumeirah, Dubai",
        image: "properties/offplan/offplan-1.jpg",
        size: "724+ sqft",
        bedrooms: 1,
        bathrooms: 1,
        startingPrice: 2906828,
        currency: "AED",
        paymentPlan: "70/30",
        completion: "Q2 2030",
        whySmart: ["early-access"],
        smartReason: "Private beach exclusively for residents. Only 3 plots with beach access. Branded by international hotel operator with 5-star services."
    },
    {
        name: "Eltiera Views",
        location: "Ras Al Khor, Dubai",
        image: "properties/offplan/offplan-2.jpg",
        size: "713+ sqft",
        bedrooms: 1,
        bathrooms: 1,
        startingPrice: 2069828,
        currency: "AED",
        paymentPlan: "70/30",
        completion: "Q4 2029",
        whySmart: ["best-price", "early-access"],
        smartReason: "Early-access pricing from Ellington. 70/30 payment plan. Premium quality finishes."
    },
    {
        name: "The Symphony",
        location: "JVC, Dubai",
        image: "properties/offplan/offplan-3.jpg",
        size: "641+ sqft",
        bedrooms: 1,
        bathrooms: 1,
        startingPrice: 1812158,
        currency: "AED",
        paymentPlan: "TBA",
        completion: "June 2029",
        whySmart: ["best-price", "early-access"],
        smartReason: "Competitive entry price for 1BR. Early-phase launch pricing."
    },
    {
        name: "Sobha Central",
        location: "Sheikh Zayed Road, Dubai",
        image: "properties/offplan/offplan-4.webp",
        size: "568+ sqft",
        bedrooms: 1,
        bathrooms: 1,
        startingPrice: 1520000,
        currency: "AED",
        paymentPlan: "60/40",
        completion: "Dec 2029",
        whySmart: ["best-price"],
        smartReason: "Affordable for families. Discounts up to 5%. Near metro. Direct access to SZR, close to Palm Jebel Ali beaches."
    },
    {
        name: "Binghatti Twilight",
        location: "Al Jaddaf Waterfront, Dubai",
        image: "properties/offplan/offplan-5.jpg",
        size: "892+ sqft",
        bedrooms: 2,
        bathrooms: 2,
        startingPrice: 1899999,
        currency: "AED",
        paymentPlan: "20/50/30",
        completion: "Q1 2026",
        whySmart: ["best-price", "early-access"],
        smartReason: "Near completion. Waterfront location at Al Jaddaf. Flexible 20/50/30 payment plan."
    },
    {
        name: "Mas Barsha Residency",
        location: "Al Barsha 1, Dubai",
        image: "properties/offplan/offplan-6.jpg",
        size: "944 sqft",
        bedrooms: 1,
        bathrooms: 1,
        startingPrice: 2314000,
        currency: "AED",
        paymentPlan: "60/40",
        completion: "Q4 2026",
        whySmart: ["best-price"],
        smartReason: "Freehold in Al Barsha. Discounts 5-10% available."
    },
    {
        name: "Knightsbridge",
        location: "Meydan South, Dubai",
        image: "properties/offplan/offplan-7.webp",
        size: "6,004+ sqft",
        bedrooms: 4,
        bathrooms: 5,
        originalPrice: 13811185,
        startingPrice: 11048948,
        currency: "AED",
        paymentPlan: "60/40",
        discount: 20,
        completion: "Q2 2027",
        whySmart: ["best-price"],
        smartReason: "10-20% discount. High level of privacy. Climate-adaptive wellness community. Designed for families."
    },
    {
        name: "Cullinan by Binghatti",
        location: "Al Jaddaf, Dubai",
        image: "properties/offplan/cullinan.jpg",
        size: "380+ sqft",
        bedrooms: 0,
        bathrooms: 1,
        startingPrice: 773619,
        currency: "AED",
        paymentPlan: "70/30",
        completion: "Q4 2027",
        whySmart: ["best-price", "high-rental"],
        smartReason: "Discounts up to 10%. Near Al Jaddaf Metro. Highly liquid on secondary market, high demand among tenants."
    }
];

const markets = [
    // — Active listings first (sorted by property count descending) —
    { country: "UAE", cities: ["Dubai", "Abu Dhabi", "Ras Al-Khaimah"], image: "images/markets/dubai.jpg", propertyCount: 19, sectionId: "#ready", coords: [25.2, 55.3] },
    { country: "Monaco", cities: ["Monte Carlo", "La Rousse", "Moneghetti"], image: "images/monaco-hero.jpg", propertyCount: 7, sectionId: "#monaco", coords: [43.7, 7.4] },
    { country: "Switzerland", cities: ["Montreux", "Veytaux"], image: "images/switzerland-hero.jpg", propertyCount: 3, sectionId: "#switzerland", coords: [46.4, 6.9] },
    { country: "France", cities: ["Paris"], image: "images/paris-hero.jpg", propertyCount: 2, sectionId: "#france", coords: [48.9, 2.3] },
    { country: "Thailand", cities: ["Bangkok", "Phuket"], image: "images/thailand-hero.jpg", propertyCount: 2, sectionId: "#thailand", coords: [13.7, 100.5] },
    { country: "Azerbaijan", cities: ["Baku"], image: "images/azerbaijan-hero.jpg", propertyCount: 1, sectionId: "#azerbaijan", coords: [40.4, 49.9] },
    // — Coming soon —
    { country: "KSA", cities: ["Jeddah", "Riyadh"], image: "images/markets/jeddah.jpg", propertyCount: 0, sectionId: null, coords: [21.5, 39.2] },
    { country: "Indonesia", cities: ["Bali"], image: "images/markets/bali.jpg", propertyCount: 0, sectionId: null, coords: [-8.4, 115.2] },
    { country: "Oman", cities: ["Muscat"], image: "images/markets/muscat.jpg", propertyCount: 0, sectionId: null, coords: [23.6, 58.5] },
    { country: "Georgia", cities: ["Batumi"], image: "images/markets/batumi.jpg", propertyCount: 0, sectionId: null, coords: [41.7, 41.7] }
];

// Monaco Properties
const monacoProperties = [
    {
        name: "La Rousse – Château Perigord II",
        location: "La Rousse, Monaco",
        image: "properties/monaco/chateau-perigord-ii.jpg",
        size: "269 sqft",
        bedrooms: 0,
        bathrooms: null,
        price: 4042630,
        currency: "AED",
        whySmart: ["high-appreciation", "best-price"]
    },
    {
        name: "Moneghetti – Les Oliviers",
        location: "Moneghetti, Monaco",
        image: "properties/monaco/les-oliviers.jpg",
        size: "646 sqft",
        bedrooms: 1,
        bathrooms: null,
        price: 10425730,
        currency: "AED",
        whySmart: ["high-appreciation", "high-rental", "ready-value"]
    },
    {
        name: "La Rousse – Parc Saint Roman",
        location: "La Rousse, Monaco",
        image: "properties/monaco/parc-saint-roman.jpg",
        size: "894 sqft",
        bedrooms: 1,
        bathrooms: null,
        price: 16979046,
        currency: "AED",
        whySmart: ["high-appreciation", "ready-value"]
    },
    {
        name: "Monte Carlo – Shakespeare",
        location: "Monte Carlo, Monaco",
        image: "properties/monaco/shakespeare.jpg",
        size: "861 sqft",
        bedrooms: 2,
        bathrooms: null,
        price: 21064230,
        currency: "AED",
        whySmart: ["high-appreciation", "high-rental", "ready-value"]
    },
    {
        name: "Monaco Port – Panorama",
        location: "Monaco Port, Monaco",
        image: "properties/monaco/panorama.jpg",
        size: "2002 sqft",
        bedrooms: 3,
        bathrooms: null,
        price: 42128460,
        currency: "AED",
        whySmart: ["high-appreciation", "high-rental"]
    },
    {
        name: "La Rousse – Château Perigord I",
        location: "La Rousse, Monaco",
        image: "properties/monaco/chateau-perigord-i.jpg",
        size: "1905 sqft",
        bedrooms: 3,
        bathrooms: null,
        price: 49787580,
        currency: "AED",
        whySmart: ["high-appreciation", "high-rental", "ready-value"]
    },
    {
        name: "Carré d'Or – Monte Carlo Star",
        location: "Monte Carlo, Monaco",
        image: "properties/monaco/monte-carlo-star.jpg",
        size: "1938 sqft",
        bedrooms: 2,
        bathrooms: null,
        price: 71916460,
        currency: "AED",
        whySmart: ["high-appreciation", "high-rental", "ready-value"]
    }
];

// Paris Properties
const parisProperties = [
    {
        name: "Paris 16th Muette – Passy Village",
        location: "16th Arrondissement, Paris",
        image: "properties/paris/passy-village.jpg",
        size: "969 sqft",
        bedrooms: 3,
        bathrooms: 2,
        price: 6808640,
        currency: "AED",
        whySmart: ["ready-value"]
    },
    {
        name: "Paris 16th Muette – Trocadéro",
        location: "16th Arrondissement, Paris",
        image: "properties/paris/trocadero.jpg",
        size: "969 sqft",
        bedrooms: 2,
        bathrooms: 1,
        price: 5744790,
        currency: "AED",
        whySmart: ["ready-value"]
    }
];

// Switzerland Properties
const switzerlandProperties = [
    {
        name: "Penthouse – Panoramic Lake & Alps",
        location: "Veytaux, Vaud",
        image: "properties/switzerland/veytaux-penthouse.jpg",
        size: "1,098 sqft",
        bedrooms: 2,
        bathrooms: 2,
        price: 4817500,
        currency: "AED",
        whySmart: ["best-price", "ready-value"]
    },
    {
        name: "Rooftop Penthouse – Lake Geneva Views",
        location: "Montreux, Vaud",
        image: "properties/switzerland/montreux-rooftop.jpg",
        size: "1,572 sqft",
        bedrooms: 2,
        bathrooms: 2,
        price: 8179500,
        currency: "AED",
        whySmart: ["ready-value", "high-appreciation"]
    },
    {
        name: "Duplex Penthouse – Lake Geneva Panorama",
        location: "Montreux, Vaud",
        image: "properties/switzerland/montreux-duplex.jpg",
        size: "2,583 sqft",
        bedrooms: 4,
        bathrooms: 3,
        price: 16195000,
        currency: "AED",
        whySmart: ["high-appreciation", "ready-value"]
    }
];

// Azerbaijan Properties
const azerbaijanProperties = [
    {
        name: "YES Sea Breeze",
        location: "Caspian Sea Coast, Baku",
        image: "properties/azerbaijan/yes-sea-breeze.jpg",
        size: "337+ sqft",
        bedrooms: 0,
        bathrooms: 1,
        price: 390760,
        currency: "AED",
        whySmart: ["high-rental", "early-access"],
        smartReason: "Guaranteed returns up to 15% per year for 3 years. Monthly income. Managed by international hotel operator YES."
    }
];

// Thailand Properties
const thailandProperties = [
    {
        name: "Canvas Cherngtalay",
        location: "Cherngtalay, Phuket",
        image: "properties/thailand/canvas-cherngtalay.jpg",
        size: "422+ sqft",
        bedrooms: 1,
        bathrooms: 1,
        price: 918000,
        currency: "AED",
        whySmart: ["ready-value", "high-rental"],
        smartReason: "Handed over (ready). Estimated rental yield 8-12%. Discount up to 3%. Near Bang Tao Beach."
    },
    {
        name: "Skypark Elara",
        location: "Laguna Lakelands, Phuket",
        image: "properties/thailand/skypark-elara.jpg",
        size: "581+ sqft",
        bedrooms: 1,
        bathrooms: 1,
        originalPrice: 1103775,
        price: 1064835,
        currency: "AED",
        whySmart: ["best-price", "ready-value"],
        smartReason: "Fully furnished. Freehold ownership available. Deferred payment up to 5 years. Free CAM fee for 12 months. Free property management for 12 months."
    }
];


// ============================================
// 3. ACCESSIBILITY HELPERS
// ============================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ============================================
// 4. UTILITIES
// ============================================
function formatPrice(amount, currency) {
    return `${currency} ${amount.toLocaleString('en-US')}`;
}

function getWhatsAppLink(propertyName, location, price, currency) {
    const lang = document.documentElement.lang || 'en';
    const langLabel = lang === 'ar' ? 'أتحدث العربية' : lang === 'fr' ? 'Je parle français' : lang === 'ru' ? 'Я говорю по-русски' : 'I speak English';
    const priceStr = price && currency ? ` at ${currency} ${Number(price).toLocaleString('en-US')}` : '';
    const msg = `Hi, I'm interested in: ${propertyName} (${location})${priceStr}. ${langLabel}. Could you share more details?`;
    return `${WHATSAPP_BASE}?text=${encodeURIComponent(msg)}`;
}


// ============================================
// 5. RENDER FUNCTIONS
// ============================================
function renderFeaturedDeal() {
    const wrapper = document.getElementById('featured-deal-card');
    if (!wrapper) return;
    // Build pool of deals with discounts, sorted best-first
    const enriched = readyProperties.map(p => {
        const disc = p.discount || (p.originalPrice && p.smartPrice ? Math.round((p.originalPrice - p.smartPrice) / p.originalPrice * 100) : null);
        return { ...p, discount: disc };
    }).filter(p => p.discount);
    if (enriched.length === 0) return;
    enriched.sort((a, b) => (b.discount || 0) - (a.discount || 0));

    // A/B rotation: cycle through top 3 deals daily
    const pool = enriched.slice(0, 3);
    const dayIndex = Math.floor(Date.now() / 86400000) % pool.length;
    const p = pool[dayIndex];

    // Track which featured deal was shown
    if (window.posthog) {
        window.posthog.capture('featured_deal_shown', {
            deal_name: p.name,
            deal_discount: p.discount,
            rotation_index: dayIndex,
            pool_size: pool.length
        });
    }
    wrapper.innerHTML = `
        <div class="featured-deal__image">
            ${p.image ? `<img src="${asset(p.image)}" alt="${p.name}" loading="lazy">` : ''}
            ${p.discount ? `<span class="featured-deal__badge">-${p.discount}% Smart Deal</span>` : ''}
        </div>
        <div class="featured-deal__body">
            <span class="featured-deal__eyebrow">${t('featured.eyebrow')}</span>
            <h3 class="featured-deal__name">${p.name}</h3>
            <p class="featured-deal__location"><i class="fa-solid fa-location-dot"></i> ${p.location}</p>
            <div class="featured-deal__details">
                <span><i class="fa-solid fa-ruler-combined"></i> ${p.size}</span>
                ${p.bedrooms != null ? `<span><i class="fa-solid fa-bed"></i> ${p.bedrooms === 0 ? t('card.studio') : p.bedrooms + ' ' + t('card.bed')}</span>` : ''}
                ${p.bathrooms != null ? `<span><i class="fa-solid fa-bath"></i> ${p.bathrooms} ${t('card.bath')}</span>` : ''}
            </div>
            ${p.smartReason ? `<p class="featured-deal__reason">${p.smartReason}</p>` : ''}
            <div class="featured-deal__pricing">
                ${p.originalPrice ? `<span class="featured-deal__original">${formatPrice(p.originalPrice, p.currency)}</span>` : ''}
                <span class="featured-deal__price">${formatPrice(p.smartPrice, p.currency)}</span>
            </div>
            <a href="${getWhatsAppLink(p.name, p.location)}" class="btn btn--primary featured-deal__cta" target="_blank" rel="noopener noreferrer">
                ${t('featured.viewDeal')} <i class="fa-brands fa-whatsapp"></i>
            </a>
        </div>
    `;
}

function renderReadyCards() {
    const wrapper = document.getElementById('ready-cards');
    if (!wrapper) return;
    // Auto-compute discount from prices when not explicitly set
    const enriched = readyProperties.map(p => {
        const disc = p.discount || (p.originalPrice && p.smartPrice ? Math.round((p.originalPrice - p.smartPrice) / p.originalPrice * 100) : null);
        return { ...p, discount: disc };
    });
    // Sort by discount descending — best offers first
    enriched.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    wrapper.innerHTML = enriched.map(p => {
        const savings = p.originalPrice && p.smartPrice ? p.originalPrice - p.smartPrice : 0;
        const urgencyTag = p.whySmart && p.whySmart.includes('off-market') ? t('urgency.exclusive')
            : savings >= 200000 ? `${t('urgency.save')} ${formatPrice(savings, p.currency)}`
            : '';
        return `
        <div class="swiper-slide">
            <div class="property-card property-card--ready">
                <div class="property-card__image">
                    ${p.image ? `<img src="${asset(p.image)}" alt="${p.name}" loading="lazy">` : `<div class="property-card__placeholder"><span>${t('card.noImage')}</span></div>`}
                    ${urgencyTag ? `<span class="property-card__urgency">${urgencyTag}</span>` : ''}
                    ${p.discount ? `<span class="property-card__badge property-card__badge--discount">-${p.discount}%</span>` : ''}
                </div>
                ${p.whySmart ? renderWhySmartBadges(p.whySmart) : ''}
                <div class="property-card__body">
                    <h3 class="property-card__name">${p.name}</h3>
                    <p class="property-card__location">
                        <i class="fa-solid fa-location-dot"></i> ${p.location}
                    </p>
                    <div class="property-card__details">
                        <span><i class="fa-solid fa-ruler-combined"></i> ${p.size}</span>
                        ${p.bedrooms != null ? `<span><i class="fa-solid fa-bed"></i> ${p.bedrooms === 0 ? t('card.studio') : p.bedrooms + ' ' + t('card.bed')}</span>` : ''}
                        <span><i class="fa-solid fa-bath"></i> ${p.bathrooms} ${t('card.bath')}</span>
                    </div>
                    <div class="property-card__pricing">
                        ${p.originalPrice ? `<span class="property-card__price-label">${t('card.originalPrice')}</span>
                        <span class="property-card__original-price">${formatPrice(p.originalPrice, p.currency)}</span>` : ''}
                        <span class="property-card__price-label property-card__price-label--smart">${t('card.smartPrice')}</span>
                        <span class="property-card__smart-price">${formatPrice(p.smartPrice, p.currency)}</span>
                    </div>
                    <a href="${getWhatsAppLink(p.name, p.location)}"
                       class="btn btn--card" target="_blank" rel="noopener noreferrer"
                       data-property="${p.name.replace(/"/g, '&quot;')}" data-location="${p.location.replace(/"/g, '&quot;')}" data-section="Ready">
                        ${t('card.enquire')} <i class="fa-brands fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
    `}).join('');
}

function renderOffplanCards() {
    const wrapper = document.getElementById('offplan-cards');
    if (!wrapper) return;
    wrapper.innerHTML = offplanProperties.slice().sort((a, b) => a.startingPrice - b.startingPrice).map(p => `
        <div class="swiper-slide">
            <div class="property-card property-card--offplan">
                <div class="property-card__image">
                    ${p.image ? `<img src="${asset(p.image)}" alt="${p.name}" loading="lazy">` : `<div class="property-card__placeholder"><span>${t('card.noImage')}</span></div>`}
                    <span class="property-card__badge property-card__badge--plan">${p.paymentPlan}</span>
                    ${p.paymentPlan !== 'TBA' && p.paymentPlan !== 'N/A' ? `<span class="property-card__badge property-card__badge--flexible">${t('card.flexible')}</span>` : ''}
                    ${p.discount ? `<span class="property-card__badge property-card__badge--discount">-${p.discount}%</span>` : ''}
                </div>
                ${p.whySmart ? renderWhySmartBadges(p.whySmart) : ''}
                <div class="property-card__body">
                    <h3 class="property-card__name">${p.name}</h3>
                    <p class="property-card__location">
                        <i class="fa-solid fa-location-dot"></i> ${p.location}
                    </p>
                    <div class="property-card__details">
                        <span><i class="fa-solid fa-ruler-combined"></i> ${t('card.from')} ${p.size}</span>
                        ${p.bedrooms != null ? `<span><i class="fa-solid fa-bed"></i> ${p.bedrooms === 0 ? t('card.studio') : p.bedrooms + ' ' + t('card.bed')}</span>` : ''}
                        <span><i class="fa-solid fa-bath"></i> ${p.bathrooms} ${t('card.bath')}</span>
                    </div>
                    <div class="property-card__pricing">
                        ${p.originalPrice ? `<span class="property-card__price-label">${t('card.originalPrice')}</span>
                        <span class="property-card__original-price">${formatPrice(p.originalPrice, p.currency)}</span>` : ''}
                        <span class="property-card__price-label${p.originalPrice ? ' property-card__price-label--smart' : ''}">${t('card.startingFrom')}</span>
                        <span class="property-card__starting">${formatPrice(p.startingPrice, p.currency)}</span>
                    </div>
                    <div class="property-card__chips">
                        <span class="chip chip--plan"><i class="fa-regular fa-calendar"></i> ${p.completion}</span>
                        <span class="chip chip--plan"><i class="fa-solid fa-money-bill-wave"></i> ${p.paymentPlan}</span>
                    </div>
                    <a href="${getWhatsAppLink(p.name, p.location)}"
                       class="btn btn--card" target="_blank" rel="noopener noreferrer"
                       data-property="${p.name.replace(/"/g, '&quot;')}" data-location="${p.location.replace(/"/g, '&quot;')}" data-section="Off-Plan">
                        ${t('card.enquire')} <i class="fa-brands fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        </div>
    `).join('');
}


// Why Smart badge labels
const whySmartLabels = {
    'best-price': { labelKey: 'tag.bestPrice', icon: 'fa-solid fa-tag' },
    'high-appreciation': { labelKey: 'tag.highAppreciation', icon: 'fa-solid fa-chart-line' },
    'high-rental': { labelKey: 'tag.highYield', icon: 'fa-solid fa-coins' },
    'ready-value': { labelKey: 'tag.readyValue', icon: 'fa-solid fa-key' },
    'early-access': { labelKey: 'tag.earlyAccess', icon: 'fa-solid fa-rocket' },
    'off-market': { labelKey: 'tag.offMarket', icon: 'fa-solid fa-lock' }
};

function renderWhySmartBadges(tags) {
    if (!tags || !tags.length) return '';
    return `<div class="property-card__badges">${tags.map(tag => {
        const info = whySmartLabels[tag];
        if (!info) return '';
        return `<span class="why-smart-badge why-smart-badge--${tag}"><i class="${info.icon}"></i> ${t(info.labelKey)}</span>`;
    }).join('')}</div>`;
}

function renderCountryCards(properties, containerId, sectionName) {
    const wrapper = document.getElementById(containerId);
    if (!wrapper) return;
    const isSwiper = wrapper.classList.contains('swiper-wrapper');
    const sorted = properties.slice().sort((a, b) => a.price - b.price);

    wrapper.innerHTML = sorted.map(p => `
        ${isSwiper ? '<div class="swiper-slide">' : ''}
            <div class="property-card property-card--country">
                <div class="property-card__image">
                    ${p.image
                        ? `<img src="${asset(p.image)}" alt="${p.name}" loading="lazy">`
                        : `<div class="property-card__placeholder"><span>${t('card.noImage')}</span></div>`
                    }
                </div>
                ${renderWhySmartBadges(p.whySmart)}
                <div class="property-card__body">
                    <h3 class="property-card__name">${p.name}</h3>
                    <p class="property-card__location">
                        <i class="fa-solid fa-location-dot"></i> ${p.location}
                    </p>
                    <div class="property-card__details">
                        <span><i class="fa-solid fa-ruler-combined"></i> ${p.size}</span>
                        ${p.bedrooms != null ? `<span><i class="fa-solid fa-bed"></i> ${p.bedrooms === 0 ? t('card.studio') : p.bedrooms + ' ' + t('card.bed')}</span>` : ''}
                        ${p.bathrooms != null ? `<span><i class="fa-solid fa-bath"></i> ${p.bathrooms} ${t('card.bath')}</span>` : ''}
                    </div>
                    <div class="property-card__pricing">
                        ${p.originalPrice ? `<span class="property-card__price-label">${t('card.originalPrice')}</span>
                        <span class="property-card__original-price">${formatPrice(p.originalPrice, p.currency)}</span>` : ''}
                        <span class="property-card__price-label property-card__price-label--smart">${p.originalPrice ? t('card.smartPrice') : t('card.price')}</span>
                        <span class="property-card__smart-price">${formatPrice(p.price, p.currency)}</span>
                    </div>
                    <a href="${getWhatsAppLink(p.name, p.location)}"
                       class="btn btn--card" target="_blank" rel="noopener noreferrer"
                       data-property="${p.name.replace(/"/g, '&quot;')}" data-location="${p.location.replace(/"/g, '&quot;')}" data-section="${sectionName}">
                        ${t('card.enquire')} <i class="fa-brands fa-whatsapp"></i>
                    </a>
                </div>
            </div>
        ${isSwiper ? '</div>' : ''}
    `).join('');
}


// ============================================
// 4b. INTERACTIVE MARKETS (V2)
// ============================================
function renderMarketsGridV2() {
    const grid = document.getElementById('markets-grid-v2');
    if (!grid) return;
    // All data comes from the trusted markets array defined above — no user input
    grid.innerHTML = markets.map(m => `
        <div class="market-card-v2${m.sectionId ? ' market-card-v2--has-section' : ''}"
             ${m.sectionId ? `data-scroll-to="${m.sectionId}"` : ''}
             role="button" tabindex="0">
            <div class="market-card-v2__img-wrap">
                <img src="${asset(m.image)}" alt="${m.country}" class="market-card-v2__img" loading="lazy">
                <div class="market-card-v2__overlay"></div>
            </div>
            <div class="market-card-v2__content">
                <h3 class="market-card-v2__country">${m.country}</h3>
                <p class="market-card-v2__cities">${m.cities.join(' · ')}</p>
            </div>
            <div class="market-card-v2__reveal">
                ${m.propertyCount > 0
                    ? `<span class="market-card-v2__badge">${m.propertyCount} ${t('market.propertiesOnline')}</span>`
                    : `<span class="market-card-v2__badge market-card-v2__badge--soon">${t('market.comingSoon')}</span>`
                }
                <span class="market-card-v2__cta">
                    ${m.sectionId ? t('market.viewCollection') + ' <i class="fa-solid fa-arrow-right"></i>' : t('card.enquire') + ' <i class="fa-brands fa-whatsapp"></i>'}
                </span>
            </div>
        </div>
    `).join('');

    // Click handlers
    grid.querySelectorAll('.market-card-v2').forEach(card => {
        const handler = () => {
            const scrollTo = card.dataset.scrollTo;
            if (scrollTo) {
                // Country sections have a visual banner (.country-hero) as their first
                // child. Scrolling to the section container leaves whitespace above the
                // banner; target the banner directly so the viewport lands on the
                // visible content immediately. smoothScrollTo routes through Lenis
                // when it's active so the scroll doesn't fight the smooth-scroll loop.
                const section = document.querySelector(scrollTo);
                if (!section) return;
                const banner = section.querySelector('.country-hero');
                smoothScrollTo(banner || section);
            } else {
                window.open(`${WHATSAPP_BASE}?text=${encodeURIComponent("Hi, I'd like to learn more about Smart Deals Global.")}`, '_blank');
            }
        };
        card.addEventListener('click', handler);
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') handler(); });
    });
}




// ============================================
// 5. SWIPER
// ============================================
function initSwipers() {
    if (typeof Swiper === 'undefined') return;
    const opts = {
        spaceBetween: 24,
        grabCursor: true,
        loop: true,
        watchOverflow: true,
        breakpoints: {
            0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
            480: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 16 },
            768: { slidesPerView: 2, slidesPerGroup: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 24 },
            1400: { slidesPerView: 3, slidesPerGroup: 3, spaceBetween: 28 },
        }
    };

    new Swiper('.ready-swiper', {
        ...opts,
        pagination: { el: '.ready-pagination', clickable: true },
        navigation: { nextEl: '.ready-next', prevEl: '.ready-prev' }
    });

    new Swiper('.offplan-swiper', {
        ...opts,
        pagination: { el: '.offplan-pagination', clickable: true },
        navigation: { nextEl: '.offplan-next', prevEl: '.offplan-prev' }
    });

    new Swiper('.monaco-swiper', {
        ...opts,
        pagination: { el: '.monaco-pagination', clickable: true },
        navigation: { nextEl: '.monaco-next', prevEl: '.monaco-prev' }
    });


    // Hide arrows/pagination for sections with ≤3 slides (all fit on desktop)
    document.querySelectorAll('.swiper').forEach(el => {
        const slideCount = el.querySelectorAll('.swiper-slide').length;
        if (slideCount <= 3) {
            const controls = el.nextElementSibling;
            if (controls && controls.classList.contains('swiper-controls')) {
                controls.style.display = 'none';
            }
            el.querySelector('.swiper-wrapper').style.justifyContent = 'center';
        }
    });
}


// ============================================
// 6. NAVBAR
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.navbar__hamburger');
    const navLinks = document.querySelector('.navbar__links');
    if (!navbar || !hamburger || !navLinks) return;

    const scrollProgress = document.getElementById('scroll-progress');

    // Sections where the navbar's light frosted glass would render as a washed-out grey stripe.
    // When the navbar overlaps one of these, we revert to the transparent / white-text look.
    const darkSections = Array.from(document.querySelectorAll(
        '.hero, .markets-v2, .trust-section, .final-cta, .country-hero'
    ));
    function navbarHeight() {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--navbar-h');
        const n = parseFloat(raw);
        return Number.isFinite(n) ? n : 80;
    }
    function updateNavbarDark() {
        const probe = navbarHeight() / 2;
        let onDark = false;
        for (const section of darkSections) {
            const r = section.getBoundingClientRect();
            if (r.top <= probe && r.bottom >= probe) { onDark = true; break; }
        }
        navbar.classList.toggle('navbar--on-dark', onDark);
    }
    updateNavbarDark();

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 60);
        updateNavbarDark();
        if (scrollProgress) {
            const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight) * 100;
            scrollProgress.style.width = pct + '%';
        }
    }, { passive: true });
    window.addEventListener('resize', updateNavbarDark, { passive: true });

    function openMenu() {
        hamburger.classList.add('is-active');
        navLinks.classList.add('is-open');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        const firstLink = navLinks.querySelector('a');
        if (firstLink) firstLink.focus();
    }

    function closeMenu() {
        hamburger.classList.remove('is-active');
        navLinks.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        hamburger.focus();
    }

    hamburger.addEventListener('click', () => {
        navLinks.classList.contains('is-open') ? closeMenu() : openMenu();
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Focus trap for mobile menu
    navLinks.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !navLinks.classList.contains('is-open')) return;
        const focusable = navLinks.querySelectorAll('a');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) closeMenu();
    });
}


// ============================================
// 7. LENIS SMOOTH SCROLL
// ============================================
// Shared ref so other handlers (market cards, back-to-markets, back-to-top)
// can use Lenis's scrollTo instead of native scrollIntoView. Native scroll
// fights Lenis's animation loop and the viewport ends up at the wrong place.
let __lenis = null;

function initLenis() {
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReducedMotion) return;

    __lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
    });

    __lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => __lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#' || href.length < 2) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) smoothScrollTo(target);
        });
    });
}

/**
 * Scroll a target element to just below the fixed navbar. Prefers Lenis's
 * scrollTo (works with the active smooth-scroll loop); falls back to
 * native scrollIntoView when Lenis is absent (reduced-motion, lib missing).
 */
function smoothScrollTo(target, extraOffset = 0) {
    if (!target) return;
    const navH = (function () {
        const raw = getComputedStyle(document.documentElement).getPropertyValue('--navbar-h');
        const n = parseFloat(raw);
        return Number.isFinite(n) ? n : 80;
    })();
    const offset = -(navH + 4 + extraOffset);
    if (__lenis && typeof __lenis.scrollTo === 'function') {
        __lenis.scrollTo(target, { offset });
    } else {
        // Native fallback: scroll-margin-top on the target handles the navbar offset.
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


// ============================================
// 8. GSAP ANIMATIONS
// ============================================
function initAnimations() {
    // Always show counter values if GSAP unavailable
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        document.querySelectorAll('.hero__stat-number[data-count]').forEach(el => {
            el.textContent = el.dataset.count;
        });
        return;
    }
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance
    gsap.set(['.hero__eyebrow', '.hero__title', '.hero__subtitle', '.hero__actions', '.hero__stats-row'], {
        opacity: 0, y: 30
    });

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl
        .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.8, delay: 0.3 })
        .to('.hero__title', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
        .to('.hero__subtitle', { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
        .to('.hero__actions', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
        .to('.hero__stats-row', { opacity: 1, y: 0, duration: 0.8 }, '-=0.5');

    // Hero counter animation
    document.querySelectorAll('.hero__stat-number[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count);
        el.textContent = '0';
        gsap.to(el, {
            textContent: target,
            duration: 2,
            delay: 1.2,
            ease: 'power2.out',
            snap: { textContent: 1 },
            onUpdate: function () {
                el.textContent = Math.round(parseFloat(el.textContent));
            }
        });
    });

    // Scroll reveals
    const reveals = [
        '.featured-deal__card',
        '.properties__header', '.properties__highlight',
        '.mid-cta__inner',
        '.markets-v2__header',
        '.country-section .country-hero',
        '.why-smart .section-label', '.why-smart .section-title', '.why-smart .section-subtitle',
        '.how-we-help__inner',
        '.trust-section__metrics',
        '.final-cta__inner'
    ];

    reveals.forEach(sel => {
        gsap.from(sel, {
            scrollTrigger: { trigger: sel, start: 'top 85%', toggleActions: 'play none none none' },
            opacity: 0, y: 40, duration: 0.9, ease: 'power3.out'
        });
    });

    // Market cards stagger
    ScrollTrigger.batch('.market-card', {
        start: 'top 85%',
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' })
    });

    // Benefit cards — simple CSS transition, no GSAP (avoids mobile visibility bugs)

    // Markets V2 grid stagger
    gsap.set('.market-card-v2', { opacity: 0, y: 30 });
    ScrollTrigger.batch('.market-card-v2', {
        start: 'top 90%',
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power3.out' })
    });

    // Property card images: zoom-settle on scroll
    document.querySelectorAll('.property-card__image img').forEach(img => {
        gsap.set(img, { scale: 1.08 });
        gsap.to(img, {
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: { trigger: img, start: 'top 90%', toggleActions: 'play none none none' }
        });
    });

    // Carousel reveal
    ['.ready-swiper', '.offplan-swiper'].forEach(sel => {
        gsap.from(sel, {
            scrollTrigger: { trigger: sel, start: 'top 85%' },
            opacity: 0, y: 40, duration: 0.9, ease: 'power3.out'
        });
    });

    // Hero parallax
    gsap.to('.hero__bg-img', {
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
        y: '20%', scale: 1.1, ease: 'none'
    });
}


// ============================================
// 9. VANILLA TILT
// ============================================
function initTilt() {
    if (typeof VanillaTilt === 'undefined' || window.innerWidth <= 768 || prefersReducedMotion) return;
    document.querySelectorAll('.property-card').forEach(card => {
        VanillaTilt.init(card, { max: 4, speed: 400, glare: true, 'max-glare': 0.06, scale: 1.01 });
    });
}


// ============================================
// 10. WHATSAPP LINKS
// ============================================
function updateWhatsAppLinks() {
    const mainBtn = document.getElementById('main-whatsapp-btn');
    if (mainBtn) {
        mainBtn.href = `${WHATSAPP_BASE}?text=${encodeURIComponent("Hi, I'd like to learn more about Smart Deals Global.")}`;
    }
    const floatBtn = document.getElementById('whatsapp-float');
    if (floatBtn) {
        floatBtn.href = `${WHATSAPP_BASE}?text=${encodeURIComponent("Hi, I'd like to know more about your smart deals.")}`;
        floatBtn.addEventListener('click', () => notifyEnquiry('General Enquiry', '-', 'Floating Button'));
    }
    if (mainBtn) {
        mainBtn.addEventListener('click', () => notifyEnquiry('General Enquiry', '-', 'Final CTA'));
    }
}


// ============================================
// 11. QUALIFY FORM
// ============================================
function initQualifyForm() {
    const form = document.getElementById('qualify-form');
    const success = document.getElementById('qualify-success');
    if (!form || !success) return;

    // Clear error on text input change
    ['q-name', 'q-phone'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', () => {
            const field = el.closest('.qualify-field');
            if (field && el.value.trim()) {
                field.classList.remove('qualify-field--error');
                el.setAttribute('aria-invalid', 'false');
            }
        });
    });

    // Clear error on radio selection
    ['q-city', 'q-type', 'q-budget', 'q-goal'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('change', () => el.classList.remove('qualify-question--error'));
    });

    function validateForm(data) {
        let valid = true;

        // Text fields
        [['q-name', 'field-name', data.get('name')], ['q-phone', 'field-phone', data.get('phone')]].forEach(([inputId, fieldId, val]) => {
            const field = document.getElementById(fieldId);
            const input = document.getElementById(inputId);
            if (!field) return;
            if (!val || !val.trim()) {
                field.classList.add('qualify-field--error');
                if (input) input.setAttribute('aria-invalid', 'true');
                valid = false;
            } else {
                field.classList.remove('qualify-field--error');
                if (input) input.setAttribute('aria-invalid', 'false');
            }
        });

        // Required radio groups
        [['q-city', data.get('city')], ['q-type', data.get('property_type')], ['q-budget', data.get('budget')], ['q-goal', data.get('goal')]].forEach(([id, val]) => {
            const el = document.getElementById(id);
            if (!el) return;
            if (!val) {
                el.classList.add('qualify-question--error');
                valid = false;
            } else {
                el.classList.remove('qualify-question--error');
            }
        });

        return valid;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);

        if (!validateForm(data)) {
            // Scroll to first error
            const firstError = form.querySelector('.qualify-field--error, .qualify-question--error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        const name = data.get('name') || '';
        const phone = data.get('phone') || '';
        const city = data.get('city') || '';
        const property_type = data.get('property_type') || '';
        const budget = data.get('budget') || '';
        const goal = data.get('goal') || '';
        const support = data.getAll('support').join(', ') || '';

        const message = [
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Market: ${city}`,
            `Property Type: ${property_type}`,
            `Budget: ${budget}`,
            `Goal: ${goal}`,
            `Support Needed: ${support || 'None'}`
        ].join('\n');

        const btn = form.querySelector('.qualify-submit');
        if (btn) {
            btn.disabled = true;
            btn.textContent = 'Sending...';
        }

        // Open WhatsApp before async call to avoid popup blocker
        const waText = encodeURIComponent(
            `Hi, I'd like to learn more about Smart Deals Global.\n\nName: ${name}\nPhone: ${phone}\nMarket: ${city}\nProperty Type: ${property_type}\nBudget: ${budget}\nGoal: ${goal}\nSupport Needed: ${support || 'None'}`
        );
        window.open(`${WHATSAPP_BASE}?text=${waText}`, '_blank');

        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                    title: 'New Lead — Smart Deals Global',
                    name,
                    message,
                    time: new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai' })
                });
            }
        } catch (_) { /* fail silently */ }

        form.style.display = 'none';
        success.classList.add('is-visible');
    });
}

// ============================================
// 12. INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add tooltip labels to map markers + tap support
    document.querySelectorAll('.map-marker[data-label]').forEach(marker => {
        const tooltip = document.createElement('span');
        tooltip.className = 'map-tooltip';
        tooltip.textContent = marker.dataset.label;
        marker.appendChild(tooltip);
        marker.addEventListener('click', () => {
            document.querySelectorAll('.map-marker.is-active').forEach(m => m.classList.remove('is-active'));
            marker.classList.toggle('is-active');
        });
    });

    renderFeaturedDeal();
    renderMarketsGridV2();
    renderReadyCards();
    renderOffplanCards();
    renderCountryCards(monacoProperties, 'monaco-cards', 'Monaco');
    renderCountryCards(parisProperties, 'paris-cards', 'France');
    renderCountryCards(switzerlandProperties, 'switzerland-cards', 'Switzerland');
    renderCountryCards(azerbaijanProperties, 'azerbaijan-cards', 'Azerbaijan');
    renderCountryCards(thailandProperties, 'thailand-cards', 'Thailand');

    // Bind enquiry notifications via data attributes (no inline onclick)
    document.querySelectorAll('.btn--card[data-property]').forEach(btn => {
        btn.addEventListener('click', () => {
            notifyEnquiry(btn.dataset.property, btn.dataset.location, btn.dataset.section);
        });
    });

    initSwipers();
    initNavbar();
    initLenis();
    initAnimations();
    updateWhatsAppLinks();
    initQualifyForm();
    initLanguageSwitcher();
    initBackToMarkets();
    setTimeout(initTilt, 500);

    // WhatsApp float — show only after scrolling past hero
    const heroSection = document.getElementById('hero');
    const waFloat = document.getElementById('whatsapp-float');
    if (heroSection && waFloat) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                waFloat.classList.toggle('whatsapp-float--visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        heroObserver.observe(heroSection);
    }

    // ---- STICKY MOBILE CTA BAR ----
    const mobileCta = document.getElementById('mobile-cta-bar');
    if (mobileCta && heroSection) {
        const mobileCtaObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                mobileCta.classList.toggle('mobile-cta-bar--visible', !entry.isIntersecting);
            });
        }, { threshold: 0.1 });
        mobileCtaObserver.observe(heroSection);
    }

    // ---- ENGAGEMENT PROMPT (editorial, once per session at 60% scroll) ----
    const engagePrompt = document.getElementById('engagement-prompt');
    if (engagePrompt && !sessionStorage.getItem('sdg_engage_shown')) {
        let engageFired = false;
        const engageClose = engagePrompt.querySelector('.engagement-prompt__close');
        if (engageClose) {
            engageClose.addEventListener('click', () => {
                engagePrompt.classList.remove('engagement-prompt--visible');
                engagePrompt.setAttribute('aria-hidden', 'true');
                sessionStorage.setItem('sdg_engage_dismissed', '1');
                if (window.posthog) window.posthog.capture('engagement_prompt_dismissed');
            });
        }
        window.addEventListener('scroll', function checkEngage() {
            if (engageFired) return;
            const docH = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
            const scrollPct = (window.pageYOffset / (docH - window.innerHeight)) * 100;
            // Respect A/B test variant for engagement timing
            const engageThreshold = (window.__SDG_AB && window.__SDG_AB.ab_engage_timing === 'early-40') ? 40 : 60;
            if (scrollPct >= engageThreshold) {
                engageFired = true;
                sessionStorage.setItem('sdg_engage_shown', '1');
                engagePrompt.classList.add('engagement-prompt--visible');
                engagePrompt.setAttribute('aria-hidden', 'false');
                if (window.posthog) window.posthog.capture('engagement_prompt_shown', { scroll_depth: Math.round(scrollPct) });
                // Auto-dismiss after 12s if not interacted
                setTimeout(() => {
                    if (engagePrompt.classList.contains('engagement-prompt--visible') && !sessionStorage.getItem('sdg_engage_dismissed')) {
                        engagePrompt.classList.remove('engagement-prompt--visible');
                        engagePrompt.setAttribute('aria-hidden', 'true');
                    }
                }, 12000);
            }
        }, { passive: true });
    }

    // Fallback: if counters still show 0 after 3s (GSAP slow/failed), set final values
    setTimeout(() => {
        document.querySelectorAll('.hero__stat-number[data-count]').forEach(el => {
            if (el.textContent === '0') el.textContent = el.dataset.count;
        });
    }, 3000);

    // ---- PROPERTY DETAIL MODAL ----
    const modal = document.getElementById('property-modal');
    const modalInner = document.getElementById('property-modal-inner');
    const modalClose = modal ? modal.querySelector('.property-modal__close') : null;
    const modalBackdrop = modal ? modal.querySelector('.property-modal__backdrop') : null;

    // Collect all property data for modal lookup
    const allProperties = [
        ...readyProperties.map(p => {
            const disc = p.discount || (p.originalPrice && p.smartPrice ? Math.round((p.originalPrice - p.smartPrice) / p.originalPrice * 100) : null);
            return { ...p, discount: disc, _type: 'ready' };
        }),
        ...offplanProperties.map(p => ({ ...p, _type: 'offplan' })),
        ...monacoProperties.map(p => ({ ...p, _type: 'country' })),
        ...parisProperties.map(p => ({ ...p, _type: 'country' })),
        ...switzerlandProperties.map(p => ({ ...p, _type: 'country' })),
        ...azerbaijanProperties.map(p => ({ ...p, _type: 'country' })),
        ...thailandProperties.map(p => ({ ...p, _type: 'country' }))
    ];

    function openPropertyModal(propertyName) {
        const p = allProperties.find(x => x.name === propertyName);
        if (!p || !modal || !modalInner) return;
        const price = p.smartPrice || p.startingPrice || p.price;
        const origPrice = p.originalPrice;
        modalInner.innerHTML = `
            <div class="property-modal__image">
                ${p.image ? `<img src="${asset(p.image)}" alt="${p.name}">` : ''}
                ${p.discount ? `<span class="property-modal__badge">-${p.discount}%</span>` : ''}
            </div>
            <div class="property-modal__body">
                <h3 class="property-modal__name">${p.name}</h3>
                <p class="property-modal__location"><i class="fa-solid fa-location-dot"></i> ${p.location}</p>
                <div class="property-modal__details">
                    <span><i class="fa-solid fa-ruler-combined"></i> ${p.size}</span>
                    ${p.bedrooms != null ? `<span><i class="fa-solid fa-bed"></i> ${p.bedrooms === 0 ? t('card.studio') : p.bedrooms + ' ' + t('card.bed')}</span>` : ''}
                    ${p.bathrooms != null ? `<span><i class="fa-solid fa-bath"></i> ${p.bathrooms} ${t('card.bath')}</span>` : ''}
                </div>
                ${p.smartReason ? `<p class="property-modal__reason">${p.smartReason}</p>` : ''}
                <div class="property-modal__pricing">
                    ${origPrice ? `<span class="property-modal__original">${formatPrice(origPrice, p.currency)}</span>` : ''}
                    <span class="property-modal__price">${formatPrice(price, p.currency)}</span>
                </div>
                ${p.paymentPlan ? `<p style="font-size:0.85rem;color:var(--color-text-light);margin-bottom:1rem"><i class="fa-solid fa-money-bill-wave" style="color:var(--color-accent);margin-right:0.3rem"></i> ${t('modal.paymentPlan')}: ${p.paymentPlan}</p>` : ''}
                ${p.completion ? `<p style="font-size:0.85rem;color:var(--color-text-light);margin-bottom:1.5rem"><i class="fa-regular fa-calendar" style="color:var(--color-accent);margin-right:0.3rem"></i> ${t('modal.completion')}: ${p.completion}</p>` : ''}
                <a href="${getWhatsAppLink(p.name, p.location)}" class="btn btn--primary property-modal__cta" target="_blank" rel="noopener noreferrer">
                    ${t('modal.enquire')} <i class="fa-brands fa-whatsapp"></i>
                </a>
            </div>
        `;
        modal.classList.add('property-modal--open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePropertyModal() {
        if (!modal) return;
        modal.classList.remove('property-modal--open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closePropertyModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closePropertyModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePropertyModal(); });

    // Make property cards clickable (open modal on card click, not on CTA button)
    document.querySelectorAll('.property-card').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn--card')) return; // let CTA button work normally
            const nameEl = card.querySelector('.property-card__name');
            if (nameEl) openPropertyModal(nameEl.textContent.trim());
        });
    });

    // ---- FAQ ACCORDION ----
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('faq-item--open');
            // Close all
            document.querySelectorAll('.faq-item--open').forEach(i => i.classList.remove('faq-item--open'));
            // Toggle current
            if (!isOpen) item.classList.add('faq-item--open');
            btn.setAttribute('aria-expanded', !isOpen);
        });
    });

    // ---- BACK TO TOP ----
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('back-to-top--visible', window.scrollY > 600);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            if (__lenis && typeof __lenis.scrollTo === 'function') __lenis.scrollTo(0);
            else window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- COUNTRY HERO PARALLAX ----
    // Image is 130% tall with top:-15% (see .country-hero__img). The parallax
    // shift must stay within that 30% buffer so the banner never exposes the
    // container edge. 8% yPercent of a 130%-tall image = 10.4% of the parent,
    // well inside the buffer.
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
        document.querySelectorAll('.country-hero__img').forEach(img => {
            gsap.fromTo(img, { yPercent: -4 }, {
                yPercent: 4,
                ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.country-hero'),
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }
});

// ============================================
// LANGUAGE SWITCHER / I18N
// ============================================
const I18N_STORAGE_KEY = 'sdg_lang';
const I18N_DEFAULT = 'en';
let CURRENT_LANG = I18N_DEFAULT;

const I18N_DICT = {
    "en": {
        "nav.properties": "Properties",
        "nav.markets": "Markets",
        "nav.why": "Why Us",
        "nav.process": "Process",
        "nav.faq": "FAQ",
        "nav.contact": "Contact Us",
        "hero.eyebrow": "Curated Real Estate, Worldwide",
        "hero.title": "Discover the<br><em>Smart Deals</em> Collection",
        "hero.subtitle": "A curated collection of ready and off-plan opportunities across 10 global markets - selected for strong value, flexible terms, and attractive entry points.",
        "hero.cta": "Explore the Collection",
        "hero.stat.markets": "Global Markets",
        "hero.stat.deals": "Curated Listings",
        "hero.stat.discount": "% Avg. Discount",
        "featured.label": "Deal of the Collection",
        "featured.eyebrow": "Best Value This Month",
        "featured.viewDeal": "View This Deal",
        "ready.label": "Resale Market",
        "ready.title": "Secondary Properties",
        "ready.subtitle": "Move-in ready opportunities with visible value advantage and immediate entry.",
        "ready.chip1": "Selected ready-to-move",
        "ready.chip2": "Clear pricing edge",
        "ready.chip3": "Immediate entry",
        "ready.sort": "Sorted by best discount",
        "offplan.label": "New Developments",
        "offplan.title": "Off-Plan Opportunities",
        "offplan.subtitle": "Early-stage pricing with flexible payment plans and capital appreciation potential.",
        "offplan.chip1": "2-10% discount negotiable",
        "offplan.chip2": "Flexible payment plans",
        "offplan.chip3": "Growth potential",
        "midcta.title": "Interested in any of these opportunities?",
        "midcta.subtitle": "Our team can provide detailed brochures, pricing, and arrange private viewings.",
        "midcta.btn": "Get in Touch",
        "markets.label": "Global Presence",
        "markets.title": "10 Markets. One Mission.",
        "markets.subtitle": "We source smart deals across established and emerging real estate destinations worldwide.",
        "market.propertiesOnline": "properties online",
        "market.comingSoon": "Coming Soon",
        "market.viewCollection": "View Collection",
        "monaco.label": "Exclusive Collection",
        "monaco.title": "Monaco",
        "monaco.tagline": "From Carré d'Or to La Rousse - handpicked residences combining prestige, rental potential, and long-term value appreciation.",
        "monaco.count": "7 properties online",
        "france.label": "Parisian Collection",
        "france.title": "France",
        "france.tagline": "Architect-renovated apartments in Paris's most sought-after 16th arrondissement - Passy, Muette, and Trocadéro.",
        "france.count": "2 properties online",
        "switzerland.label": "Swiss Riviera",
        "switzerland.title": "Switzerland",
        "switzerland.tagline": "Exclusive penthouses with panoramic views of Lake Geneva and the Alps - open to international buyers.",
        "switzerland.count": "3 properties online",
        "azerbaijan.label": "Caspian Coast",
        "azerbaijan.title": "Azerbaijan",
        "azerbaijan.tagline": "Branded serviced apartments on the Caspian Sea coast - guaranteed returns up to 15% per year.",
        "azerbaijan.count": "1 property online",
        "thailand.label": "Southeast Asia",
        "thailand.title": "Thailand",
        "thailand.tagline": "Resort-style living in Phuket - from ready units with 8-12% yields to furnished tropical residences.",
        "thailand.count": "2 properties online",
        "why.label": "Our Edge",
        "why.title": "Why These Are Smart Deals",
        "why.subtitle": "Each listing passes at least one of six criteria before entering the collection.",
        "benefit.price.title": "Best Price",
        "benefit.price.text": "Pricing advantage vs recent comparables - among the best-priced units in each segment with clear negotiation leverage.",
        "benefit.growth.metric": "Growth",
        "benefit.growth.title": "High Capital Appreciation",
        "benefit.growth.text": "Projects in areas with identified growth catalysts, early-phase entry below future pricing, and proven transaction momentum.",
        "benefit.rental.title": "High Rental Returns",
        "benefit.rental.text": "Gross rental yields in high-demand zones with consistent occupancy and proven rental track records.",
        "benefit.ready.metric": "Ready",
        "benefit.ready.title": "Ready-to-Move-In Value",
        "benefit.ready.text": "Completed homes with no construction risk, clear value gap vs similar ready units, in established areas with proven demand.",
        "benefit.early.metric": "Priority",
        "benefit.early.title": "Early Access to Launches",
        "benefit.early.text": "Access to pre-launch inventory at below public launch pricing - secure preferred units before the general market.",
        "benefit.offmarket.metric": "Private",
        "benefit.offmarket.title": "Exclusive Off-Market",
        "benefit.offmarket.text": "Discreet opportunities not publicly listed - access driven by relationships, with pricing or terms unavailable on the open market.",
        "how.label": "Our Process",
        "how.title": "How We Help You Invest",
        "how.intro": "Smart Deals Global is a full-service real estate brokerage that works across multiple global markets, helping you find, negotiate, and secure the best property deals with confidence.",
        "how.step1.title": "Consultation",
        "how.step1.text": "Book a no-obligation call. We understand your budget, goals, and risk profile.",
        "how.step2.title": "Curated Shortlist",
        "how.step2.text": "Receive 3-5 handpicked properties matched to your criteria.",
        "how.step3.title": "Seamless Acquisition",
        "how.step3.text": "We handle negotiations, legal coordination, and post-purchase setup.",
        "trust.portfolio": "AED Portfolio Value",
        "trust.experience": "Years Experience",
        "trust.markets": "Global Markets",
        "trust.deals": "Active Deals",
        "faq.label": "Common Questions",
        "faq.title": "Frequently Asked Questions",
        "faq.q1.q": "What is a Smart Deal?",
        "faq.q1.a": "A Smart Deal is a property that has been evaluated and selected for offering genuine value advantage - whether through pricing below market comparables, flexible payment terms, high rental yield potential, or early access to pre-launch inventory. Every listing in our collection meets at least one of our six value criteria.",
        "faq.q2.q": "Can foreigners buy property in Dubai?",
        "faq.q2.a": "Yes. Foreign nationals can purchase freehold property in designated areas across Dubai, Abu Dhabi, and other emirates. There are no restrictions on nationality, and ownership grants a renewable residency visa for properties above AED 750,000.",
        "faq.q3.q": "How do payment plans work for off-plan properties?",
        "faq.q3.a": "Off-Plan payment plans vary by developer. Common structures include 70/30 (70% during construction, 30% on handover), 60/40, and 20/50/30. Some developers offer extended post-handover plans of up to 5 years. We negotiate the best available terms on your behalf.",
        "faq.q4.q": "What fees should I expect when purchasing?",
        "faq.q4.a": "In Dubai, the primary cost is the 4% DLD (Dubai Land Department) registration fee. Additional costs include approximately 2% for agency commission, AED 4,000-5,000 for admin/trustee fees, and mortgage registration if applicable. Total transaction costs are typically 6-7% of the property value.",
        "faq.q5.q": "Do you charge any fees for your service?",
        "faq.q5.a": "Our advisory service for buyers is complimentary. We are compensated by the developer or seller side of the transaction. This means you receive professional guidance, market analysis, and negotiation support at no additional cost.",
        "faq.q6.q": "What is the best area to buy property in Dubai?",
        "faq.q6.a": "The best area depends on your goals. For rental yields, Dubai Marina, JVC, and Business Bay consistently deliver 7-9% gross. For capital appreciation, Dubai Hills, Creek Harbour, and Palm Jumeirah lead the market. For family living, Arabian Ranches and Emirates Hills offer villa communities with schools and parks. We help match your priorities to the right area.",
        "faq.q7.q": "Is Dubai real estate a good investment in 2026?",
        "faq.q7.a": "Dubai real estate continues to perform strongly in 2026, with Q1 transactions up 31% year-over-year. Key drivers include zero income tax, Golden Visa eligibility for property above AED 2M, growing population, and limited prime land supply. Average rental yields of 6-8% outperform most global cities. Off-plan payment plans offer low entry barriers with 10-20% down payments.",
        "faq.q8.q": "What is the Golden Visa for property owners in the UAE?",
        "faq.q8.a": "The UAE Golden Visa grants 10-year renewable residency to property owners who invest AED 2 million or more in real estate. It covers the investor, spouse, and children. The property can be mortgaged (up to 50%), and there is no minimum stay requirement. Multiple properties can be combined to meet the threshold. This makes UAE property uniquely attractive for international investors seeking residency.",
        "faq.q9.q": "Can I get a mortgage as a foreigner in Dubai?",
        "faq.q9.a": "Yes. Non-residents can obtain mortgages from UAE banks for up to 50% of the property value (75% for residents). Interest rates range from 4-6% depending on the bank and your profile. Required documents typically include passport, proof of income, bank statements, and a credit report. We can connect you with mortgage advisors who specialize in non-resident applications.",
        "faq.q10.q": "What are the best off-plan projects in Dubai in 2026?",
        "faq.q10.a": "Top off-plan projects in 2026 include developments by Emaar, DAMAC, Sobha, and Binghatti in areas like Dubai Creek Harbour, Business Bay, and Dubai Hills. Key selection criteria are developer track record, location fundamentals, payment plan flexibility, and projected handover timeline. Our collection features pre-vetted off-plan opportunities with negotiated pricing advantages.",
        "finalcta.title": "Ready to Make a Smart Move?",
        "finalcta.subtitle": "Choose how you'd like to connect with our team.",
        "finalcta.whatsapp": "Instant response",
        "finalcta.call": "Call Us",
        "finalcta.email": "Email",
        "finalcta.note": "We typically respond within 2 hours during business hours (GST).",
        "footer.tagline": "Selected real estate opportunities across 10 global markets.",
        "footer.quickLinks": "Quick Links",
        "footer.markets": "Markets",
        "footer.contact": "Contact",
        "footer.link.secondary": "Secondary Market",
        "footer.link.offplan": "Off-Plan",
        "footer.link.monaco": "Monaco",
        "footer.link.france": "France",
        "footer.link.how": "How We Help",
        "footer.link.uae": "UAE",
        "footer.link.monaco2": "Monaco",
        "footer.link.france2": "France",
        "footer.link.switzerland": "Switzerland",
        "footer.link.thailand": "Thailand",
        "footer.link.whatsapp": "WhatsApp",
        "footer.link.emailus": "Email Us",
        "footer.copy": "© 2026 Smart Deals Global. All rights reserved.",
        "footer.signature": "Curated Real Estate, Worldwide.",
        "card.enquire": "Enquire",
        "card.studio": "Studio",
        "card.bed": "bed",
        "card.bath": "bath",
        "card.from": "From",
        "card.flexible": "Flexible",
        "card.noImage": "Image Coming Soon",
        "card.originalPrice": "Original Price",
        "card.smartPrice": "Smart Price",
        "card.price": "Price",
        "card.startingFrom": "Starting From",
        "tag.bestPrice": "Best Price",
        "tag.highAppreciation": "High Appreciation",
        "tag.highYield": "High Yield",
        "tag.readyValue": "Ready Value",
        "tag.earlyAccess": "Early Access",
        "tag.offMarket": "Off-Market",
        "backToMarkets": "Back to markets",
        "hero.whatsapp": "Chat on WhatsApp",
        "how.cta": "Start with Step 1",
        "proof.label": "Client Results",
        "proof.q1": "\"Secured a Dubai Marina apartment 18% below the comparable DLD transaction value. The team handled everything from viewing to transfer.\"",
        "proof.c1": "Investor, Dubai Marina",
        "proof.q2": "\"Found an off-plan unit with a 60/40 payment plan that no other agent offered. Saved over AED 200,000 on a 2-bedroom in Creek Harbour.\"",
        "proof.c2": "First-time buyer, Dubai",
        "proof.q3": "\"Bought a Monaco studio through Smart Deals that was 12% below asking. Multilingual support made the cross-border process seamless.\"",
        "proof.c3": "International investor, Monaco",
        "finalcta.subtitle2": "Start your property search in under 2 minutes.",
        "finalcta.mainBtn": "Chat with Our Team",
        "finalcta.trust1": "No buyer fees",
        "finalcta.trust2": "Multilingual team",
        "finalcta.trust3": "Same-day response",
        "modal.paymentPlan": "Payment Plan",
        "modal.completion": "Completion",
        "modal.enquire": "Enquire About This Property",
        "urgency.exclusive": "Exclusive",
        "urgency.save": "Save",
        "mobileCta.text": "Chat with an Advisor",
        "mobileCta.hint": "Same-day response",
        "engage.text": "Not finding the right fit? Our advisors can source off-market opportunities tailored to your criteria.",
        "engage.btn": "Request a Curated Shortlist",
        "wa.hero": "Hi, I'm interested in your curated property deals. Can we chat?",
        "wa.consultation": "Hi, I'd like to schedule a consultation about property investment.",
        "wa.finalcta": "Hi, I'm ready to explore property opportunities. Can we chat?",
        "wa.mobilecta": "Hi, I'm browsing your property collection. Can we chat?",
        "wa.engage": "Hi, I'd like to discuss a tailored property search.",
        "alt.hero": "Dubai skyline",
        "alt.monaco": "Monaco harbor aerial view",
        "alt.paris": "Paris cityscape with Eiffel Tower",
        "alt.switzerland": "Lake Geneva and Swiss Alps",
        "alt.azerbaijan": "Baku skyline",
        "alt.thailand": "Phuket coastline",
        "alt.howWeHelp": "Burj Al Arab aerial view, Dubai",
        "alt.finalCta": "Modern skyscraper exterior",
        "aria.changeLang": "Change language",
        "aria.toggleMenu": "Toggle menu",
        "aria.previous": "Previous",
        "aria.next": "Next",
        "aria.close": "Close",
        "aria.chatWhatsApp": "Chat on WhatsApp",
        "aria.backToTop": "Back to top"
    },
    "ar": {
        "nav.properties": "العقارات",
        "nav.markets": "الأسواق",
        "nav.why": "لماذا نحن",
        "nav.process": "العملية",
        "nav.faq": "الأسئلة الشائعة",
        "nav.contact": "اتصل بنا",
        "hero.eyebrow": "تم تجميع العقارات، في جميع أنحاء العالم",
        "hero.title": "اكتشف مجموعة<br><em>Smart Deals</em>",
        "hero.subtitle": "مجموعة مختارة من العقارات الجاهزة وقيد الإنشاء في 10 أسواق عالمية - اختيرت لقيمتها المتميزة، وشروطها المرنة، ونقاط الدخول الجذابة.",
        "hero.cta": "استكشف المجموعة",
        "hero.stat.markets": "أسواق عالمية",
        "hero.stat.deals": "عقارات مختارة",
        "hero.stat.discount": "متوسط الخصم %",
        "featured.label": "صفقة المجموعة",
        "featured.eyebrow": "أفضل قيمة هذا الشهر",
        "featured.viewDeal": "عرض هذه الصفقة",
        "ready.label": "سوق إعادة البيع",
        "ready.title": "عقارات ثانوية",
        "ready.subtitle": "فرص جاهزة للانتقال مع ميزة قيمة مرئية والدخول الفوري.",
        "ready.chip1": "جاهز للسكن",
        "ready.chip2": "ميزة سعرية واضحة",
        "ready.chip3": "دخول فوري",
        "ready.sort": "مرتب حسب أفضل خصم",
        "offplan.label": "مشاريع جديدة",
        "offplan.title": "فرص على الخارطة",
        "offplan.subtitle": "التسعير في المرحلة المبكرة مع خطط دفع مرنة وإمكانات ارتفاع رأس المال.",
        "offplan.chip1": "خصم 2-10% قابل للتفاوض",
        "offplan.chip2": "خطط دفع مرنة",
        "offplan.chip3": "إمكانية النمو",
        "midcta.title": "هل أنت مهتم بأي من هذه الفرص؟",
        "midcta.subtitle": "يمكن لفريقنا توفير كتيبات مفصلة، وتسعير، وترتيب مشاهدات خاصة.",
        "midcta.btn": "تواصل معنا",
        "markets.label": "حضور عالمي",
        "markets.title": "10 أسواق. مهمة واحدة.",
        "markets.subtitle": "نحن نشتري صفقات ذكية عبر الوجهات العقارية الراسخة والناشئة في جميع أنحاء العالم.",
        "market.propertiesOnline": "عقارات متاحة",
        "market.comingSoon": "قريباً",
        "market.viewCollection": "عرض المجموعة",
        "monaco.label": "مجموعة حصرية",
        "monaco.title": "موناكو",
        "monaco.tagline": "من Carré d'Or إلى La Rousse - مساكن مختارة بعناية تجمع بين الهيبة، وإمكانات الإيجار، وارتفاع القيمة على المدى الطويل.",
        "monaco.count": "7 عقارات متاحة",
        "france.label": "مجموعة باريسية",
        "france.title": "فرنسا",
        "france.tagline": "شقق تم تجديدها من قبل مهندس معماري في منطقة باريس الـ 16 الأكثر طلبًا - Passy و Muette و Trocadéro.",
        "france.count": "2 عقاران متاحان",
        "switzerland.label": "الريفييرا السويسرية",
        "switzerland.title": "سويسرا",
        "switzerland.tagline": "بنتهاوس حصرية مع إطلالة بانورامية على بحيرة جنيف وجبال الألب - مفتوحة للمشترين الدوليين.",
        "switzerland.count": "3 عقارات متاحة",
        "azerbaijan.label": "ساحل بحر قزوين",
        "azerbaijan.title": "أذربيجان",
        "azerbaijan.tagline": "شقق فندقية ذات علامة تجارية على ساحل بحر قزوين - عوائد مضمونة تصل إلى 15٪ سنويًا.",
        "azerbaijan.count": "1 عقار على الانترنت",
        "thailand.label": "جنوب شرق آسيا",
        "thailand.title": "تايلاند",
        "thailand.tagline": "المعيشة على طراز منتجع في Phuket - من الوحدات الجاهزة مع 8-12٪ من العائدات إلى المساكن الاستوائية المفروشة.",
        "thailand.count": "2 عقاران متاحان",
        "why.label": "ما يميزنا",
        "why.title": "لماذا هذه صفقات ذكية",
        "why.subtitle": "يجتاز كل عقار واحدًا على الأقل من ستة معايير قبل دخوله المجموعة.",
        "benefit.price.title": "أفضل سعر",
        "benefit.price.text": "ميزة التسعير مقابل المقارنات الأخيرة - من بين أفضل وحدات الأسعار في كل قطاع مع رافعة مالية واضحة للتفاوض.",
        "benefit.growth.metric": "نمو",
        "benefit.growth.title": "نمو رأس المال المرتفع",
        "benefit.growth.text": "المشاريع في المناطق التي تم تحديد محفزات النمو ، والدخول في مرحلة مبكرة أقل من الأسعار المستقبلية ، وزخم المعاملات المثبت.",
        "benefit.rental.title": "عوائد إيجارية عالية",
        "benefit.rental.text": "عائدات الإيجارات الإجمالية في المناطق ذات الطلب المرتفع مع إشغال ثابت وسجلات مسارية مؤكدة للإيجار.",
        "benefit.ready.metric": "جاهز",
        "benefit.ready.title": "قيمة جاهزة للسكن",
        "benefit.ready.text": "المنازل المكتملة مع عدم وجود مخاطر البناء ، وفجوة قيمة واضحة مقابل وحدات جاهزة مماثلة ، في المناطق القائمة ذات الطلب المثبت.",
        "benefit.early.metric": "أولوية",
        "benefit.early.title": "وصول مبكر للإطلاقات",
        "benefit.early.text": "الوصول إلى مخزون ما قبل الإطلاق بأسعار أقل من أسعار الإطلاق العامة - تأمين الوحدات المفضلة قبل السوق العامة.",
        "benefit.offmarket.metric": "خاص",
        "benefit.offmarket.title": "حصرية خارج السوق",
        "benefit.offmarket.text": "فرص سرية غير مدرجة علنًا - الوصول مدفوع بالعلاقات ، مع تسعير أو شروط غير متوفرة في السوق المفتوحة.",
        "how.label": "عمليتنا",
        "how.title": "كيف نساعدك على الاستثمار",
        "how.intro": "إن Smart Deals Global هي شركة وساطة عقارية كاملة الخدمة تعمل عبر العديد من الأسواق العالمية ، مما يساعدك على العثور على أفضل الصفقات العقارية والتفاوض عليها وتأمينها بثقة.",
        "how.step1.title": "استشارة",
        "how.step1.text": "قم بحجز مكالمة بلا التزامات. نحن نفهم ميزانيتك وأهدافك وملف المخاطر الخاص بك.",
        "how.step2.title": "قائمة مختارة",
        "how.step2.text": "تلقي 3-5 من العقارات التي تم اختيارها بعناية مطابقة لمعاييرك.",
        "how.step3.title": "اقتناء سلس",
        "how.step3.text": "نحن نتعامل مع المفاوضات، والتنسيق القانوني، وإعداد ما بعد الشراء.",
        "trust.portfolio": "قيمة المحفظة بالدرهم",
        "trust.experience": "سنوات خبرة",
        "trust.markets": "أسواق عالمية",
        "trust.deals": "صفقات نشطة",
        "faq.label": "أسئلة شائعة",
        "faq.title": "الأسئلة المتكررة",
        "faq.q1.q": "ما هو Smart Deal؟",
        "faq.q1.a": "Smart Deal هي عقار تم تقييمه واختياره لتقديم ميزة قيمة حقيقية - سواء كان ذلك من خلال تسعير أقل من الأسعار المقارنة في السوق ، أو شروط الدفع المرنة ، أو إمكانات العائد الإيجارية العالية ، أو الوصول المبكر إلى المخزون قبل الإطلاق. كل إدراج في مجموعتنا يستوفي واحدًا على الأقل من معايير القيمة الست لدينا.",
        "faq.q2.q": "هل يمكن للأجانب شراء عقارات في دبي؟",
        "faq.q2.a": "نعم. يمكن للمواطنين الأجانب شراء العقارات في مناطق محددة في دبي وأبوظبي والإمارات الأخرى. لا توجد قيود على الجنسية ، ويمنح الملكية تأشيرة إقامة قابلة للتجديد للعقارات التي تزيد عن 750،000 درهم.",
        "faq.q3.q": "كيف تعمل خطط الدفع للممتلكات خارج الخطة؟",
        "faq.q3.a": "تختلف خطط الدفع خارج الخطة حسب المطور. تشمل الهياكل الشائعة 70/30 (70٪ أثناء البناء ، 30٪ عند التسليم) ، 60/40 ، و 20/50/30. يقدم بعض المطورين خططًا مطولة بعد التسليم تصل إلى 5 سنوات. نحن نتفاوض على أفضل الشروط المتاحة نيابة عنك.",
        "faq.q4.q": "ما هي الرسوم التي يجب أن أتوقعها عند الشراء؟",
        "faq.q4.a": "في دبي، التكلفة الأساسية هي رسوم تسجيل DLD (Dubai Land Department) بنسبة 4٪. وتشمل التكاليف الإضافية حوالي 2٪ لجنة الوكالة، درهم 4,000-5,000 لرسوم الإدارة / الوصي، وتسجيل الرهن العقاري إذا وجدت. إجمالي تكاليف المعاملات عادة ما تكون 6-7٪ من قيمة العقار.",
        "faq.q5.q": "هل تتقاضون أي رسوم على خدماتكم؟",
        "faq.q5.a": "خدماتنا الاستشارية للمشترين مجانية. يتم تعويضنا من جانب المطور أو البائع في المعاملة. وهذا يعني أنك تحصل على التوجيه المهني وتحليل السوق ودعم المفاوضات دون أي تكلفة إضافية.",
        "faq.q6.q": "ما هي أفضل منطقة لشراء عقار في دبي؟",
        "faq.q6.a": "تعتمد أفضل منطقة على أهدافك. للحصول على عوائد إيجارية، تقدم Dubai Marina وJVC وBusiness Bay عوائد إجمالية تتراوح بين 7-9٪ باستمرار. لزيادة رأس المال، تتصدر Dubai Hills وCreek Harbour وPalm Jumeirah السوق. للعيش العائلي، توفر Arabian Ranches وEmirates Hills مجتمعات فلل مع مدارس وحدائق. نحن نساعدك في مطابقة أولوياتك مع المنطقة المناسبة.",
        "faq.q7.q": "هل الاستثمار في عقارات دبي فرصة جيدة في 2026؟",
        "faq.q7.a": "يواصل سوق العقارات في دبي أداءه القوي في 2026، مع ارتفاع معاملات الربع الأول بنسبة 31٪ مقارنة بالعام السابق. تشمل المحركات الرئيسية عدم وجود ضريبة دخل، وأهلية Golden Visa للعقارات التي تتجاوز 2 مليون درهم، والنمو السكاني، ومحدودية المعروض من الأراضي المميزة. متوسط العوائد الإيجارية بنسبة 6-8٪ يتفوق على معظم المدن العالمية. توفر خطط الدفع على الخارطة حواجز دخول منخفضة مع دفعات مقدمة تتراوح بين 10-20٪.",
        "faq.q8.q": "ما هي Golden Visa لمالكي العقارات في الإمارات؟",
        "faq.q8.a": "تمنح Golden Visa الإماراتية إقامة متجددة لمدة 10 سنوات لمالكي العقارات الذين يستثمرون 2 مليون درهم أو أكثر في العقارات. تشمل المستثمر والزوج/الزوجة والأبناء. يمكن رهن العقار (حتى 50٪)، ولا يوجد حد أدنى للإقامة. يمكن دمج عدة عقارات للوصول إلى الحد المطلوب. وهذا يجعل العقارات الإماراتية جذابة بشكل فريد للمستثمرين الدوليين الباحثين عن الإقامة.",
        "faq.q9.q": "هل يمكنني الحصول على رهن عقاري كأجنبي في دبي؟",
        "faq.q9.a": "نعم. يمكن لغير المقيمين الحصول على رهن عقاري من البنوك الإماراتية بنسبة تصل إلى 50٪ من قيمة العقار (75٪ للمقيمين). تتراوح أسعار الفائدة بين 4-6٪ حسب البنك وملفك الشخصي. تشمل المستندات المطلوبة عادةً جواز السفر وإثبات الدخل وكشوف الحسابات البنكية وتقرير الائتمان. يمكننا ربطك بمستشاري الرهن العقاري المتخصصين في طلبات غير المقيمين.",
        "faq.q10.q": "ما هي أفضل المشاريع على الخارطة في دبي لعام 2026؟",
        "faq.q10.a": "تشمل أفضل المشاريع على الخارطة في 2026 مشاريع من Emaar وDAMAC وSobha وBinghatti في مناطق مثل Dubai Creek Harbour وBusiness Bay وDubai Hills. تشمل معايير الاختيار الرئيسية سجل المطور وأساسيات الموقع ومرونة خطة الدفع والجدول الزمني المتوقع للتسليم. تضم مجموعتنا فرصًا على الخارطة تم فحصها مسبقًا مع مزايا تسعير تفاوضية.",
        "finalcta.title": "جاهز للقيام بخطوة ذكية؟",
        "finalcta.subtitle": "اختر كيف ترغب في التواصل مع فريقنا.",
        "finalcta.whatsapp": "استجابة فورية",
        "finalcta.call": "اتصل بنا",
        "finalcta.email": "البريد",
        "finalcta.note": "نحن عادة ما نرد في غضون ساعتين خلال ساعات العمل (GST).",
        "footer.tagline": "فرص العقارات المختارة في 10 أسواق عالمية.",
        "footer.quickLinks": "روابط سريعة",
        "footer.markets": "الأسواق",
        "footer.contact": "تواصل",
        "footer.link.secondary": "السوق الثانوية",
        "footer.link.offplan": "على الخارطة",
        "footer.link.monaco": "موناكو",
        "footer.link.france": "فرنسا",
        "footer.link.how": "كيف نساعدك",
        "footer.link.uae": "الإمارات",
        "footer.link.monaco2": "موناكو",
        "footer.link.france2": "فرنسا",
        "footer.link.switzerland": "سويسرا",
        "footer.link.thailand": "تايلاند",
        "footer.link.whatsapp": "واتساب",
        "footer.link.emailus": "راسلنا",
        "footer.copy": "© 2026 Smart Deals Global. جميع الحقوق محجوزة.",
        "footer.signature": "تم تجميع العقارات، في جميع أنحاء العالم.",
        "card.enquire": "استفسر",
        "card.studio": "استوديو",
        "card.bed": "غرفة",
        "card.bath": "حمام",
        "card.from": "من",
        "card.flexible": "مرن",
        "card.noImage": "الصورة قريباً",
        "card.originalPrice": "السعر الأصلي",
        "card.smartPrice": "السعر الذكي",
        "card.price": "السعر",
        "card.startingFrom": "يبدأ من",
        "tag.bestPrice": "أفضل سعر",
        "tag.highAppreciation": "ارتفاع عالٍ",
        "tag.highYield": "عائد مرتفع",
        "tag.readyValue": "قيمة جاهزة",
        "tag.earlyAccess": "وصول مبكر",
        "tag.offMarket": "خارج السوق",
        "backToMarkets": "العودة إلى الأسواق",
        "hero.whatsapp": "تواصل عبر واتساب",
        "how.cta": "ابدأ بالخطوة الأولى",
        "proof.label": "نتائج العملاء",
        "proof.q1": "\"حصلت على شقة في دبي مارينا بخصم 18% عن سعر المعاملات المقارنة. الفريق تولى كل شيء من المعاينة إلى النقل.\"",
        "proof.c1": "مستثمر، دبي مارينا",
        "proof.q2": "\"وجدت وحدة على الخريطة بخطة دفع 60/40 لم يقدمها أي وكيل آخر. وفرت أكثر من 200,000 درهم على غرفتين في خور دبي.\"",
        "proof.c2": "مشتري لأول مرة، دبي",
        "proof.q3": "\"اشتريت استوديو في موناكو عبر Smart Deals بخصم 12% عن السعر المطلوب. الدعم متعدد اللغات جعل العملية العابرة للحدود سلسة.\"",
        "proof.c3": "مستثمر دولي، موناكو",
        "finalcta.subtitle2": "ابدأ بحثك عن العقار في أقل من دقيقتين.",
        "finalcta.mainBtn": "تواصل مع فريقنا",
        "finalcta.trust1": "بدون رسوم على المشتري",
        "finalcta.trust2": "فريق متعدد اللغات",
        "finalcta.trust3": "رد في نفس اليوم",
        "modal.paymentPlan": "خطة الدفع",
        "modal.completion": "الإنجاز",
        "modal.enquire": "استفسر عن هذا العقار",
        "urgency.exclusive": "حصري",
        "urgency.save": "وفّر",
        "mobileCta.text": "تحدث مع مستشار",
        "mobileCta.hint": "رد في نفس اليوم",
        "engage.text": "لم تجد ما يناسبك؟ يمكن لمستشارينا البحث عن فرص حصرية مصممة لمعاييرك.",
        "engage.btn": "اطلب قائمة مخصصة",
        "wa.hero": "مرحباً، أنا مهتم بعروضكم العقارية المختارة. هل يمكننا التحدث؟",
        "wa.consultation": "مرحباً، أود حجز استشارة حول الاستثمار العقاري.",
        "wa.finalcta": "مرحباً، أنا مستعد لاستكشاف الفرص العقارية. هل يمكننا التحدث؟",
        "wa.mobilecta": "مرحباً، أتصفح مجموعتكم العقارية. هل يمكننا التحدث؟",
        "wa.engage": "مرحباً، أود مناقشة بحث عقاري مخصص.",
        "alt.hero": "أفق دبي",
        "alt.monaco": "منظر جوي لميناء موناكو",
        "alt.paris": "باريس مع برج إيفل",
        "alt.switzerland": "بحيرة جنيف وجبال الألب السويسرية",
        "alt.azerbaijan": "أفق باكو",
        "alt.thailand": "ساحل فوكيت",
        "alt.howWeHelp": "منظر جوي لبرج العرب، دبي",
        "alt.finalCta": "واجهة ناطحة سحاب حديثة",
        "aria.changeLang": "تغيير اللغة",
        "aria.toggleMenu": "تبديل القائمة",
        "aria.previous": "السابق",
        "aria.next": "التالي",
        "aria.close": "إغلاق",
        "aria.chatWhatsApp": "تواصل عبر واتساب",
        "aria.backToTop": "العودة للأعلى"
    },
    "fr": {
        "nav.properties": "Propriétés",
        "nav.markets": "Marchés",
        "nav.why": "Pourquoi nous",
        "nav.process": "Processus",
        "nav.faq": "FAQ",
        "nav.contact": "Nous contacter",
        "hero.eyebrow": "Immobilier sélectionné, partout dans le monde",
        "hero.title": "Découvrez la<br>collection <em>Smart Deals</em>",
        "hero.subtitle": "Une collection sélectionnée d'opportunités clés en main et sur plan sur 10 marchés mondiaux - choisies pour une forte valeur ajoutée, des conditions flexibles et des points d'entrée attrayants.",
        "hero.cta": "Explorer la collection",
        "hero.stat.markets": "Marchés mondiaux",
        "hero.stat.deals": "Offres sélectionnées",
        "hero.stat.discount": "Taux de réduction moyen en %",
        "featured.label": "Offre de la Collection",
        "featured.eyebrow": "Meilleure valeur du mois",
        "featured.viewDeal": "Voir cette offre",
        "ready.label": "Marché de la revente",
        "ready.title": "Propriétés Secondaires",
        "ready.subtitle": "Des opportunités prêtes à habiter avec un avantage de valeur visible et une entrée immédiate.",
        "ready.chip1": "Prêt à emménager",
        "ready.chip2": "Avantage tarifaire clair",
        "ready.chip3": "Entrée immédiate",
        "ready.sort": "Trié par meilleure remise",
        "offplan.label": "Nouveaux Développements",
        "offplan.title": "Opportunités sur Plan",
        "offplan.subtitle": "Prix en phase initiale avec des plans de paiement flexibles et un potentiel d'appréciation du capital.",
        "offplan.chip1": "Remise 2-10% négociable",
        "offplan.chip2": "Plans de paiement flexibles",
        "offplan.chip3": "Potentiel de croissance",
        "midcta.title": "Intéressé par l'une de ces opportunités?",
        "midcta.subtitle": "Notre équipe peut fournir des brochures détaillées, des prix et organiser des visites privées.",
        "midcta.btn": "Nous contacter",
        "markets.label": "Présence mondiale",
        "markets.title": "10 marchés. Une mission.",
        "markets.subtitle": "Nous obtenons des offres intelligentes dans des destinations immobilières établies et émergentes dans le monde entier.",
        "market.propertiesOnline": "propriétés disponibles",
        "market.comingSoon": "Bientôt disponible",
        "market.viewCollection": "Voir la collection",
        "monaco.label": "Collection Exclusive",
        "monaco.title": "Monaco",
        "monaco.tagline": "Du Carré d'Or à La Rousse - des résidences soigneusement choisies combinant prestige, potentiel locatif et appréciation de la valeur à long terme.",
        "monaco.count": "7 propriétés en ligne",
        "france.label": "Collection Parisienne",
        "france.title": "France",
        "france.tagline": "Appartements rénovés par un architecte dans le 16ème arrondissement le plus recherché de Paris - Passy, Muette et Trocadéro.",
        "france.count": "2 propriétés en ligne",
        "switzerland.label": "Riviera Suisse",
        "switzerland.title": "Suisse",
        "switzerland.tagline": "Penthouses exclusifs avec vue panoramique sur le lac Léman et les Alpes - ouverts aux acheteurs internationaux.",
        "switzerland.count": "3 propriétés en ligne",
        "azerbaijan.label": "Côte Caspienne",
        "azerbaijan.title": "Azerbaïdjan",
        "azerbaijan.tagline": "Appartements avec services de marque sur la côte de la mer Caspienne - rendements garantis jusqu'à 15% par an.",
        "azerbaijan.count": "1 propriété en ligne",
        "thailand.label": "Asie du Sud-Est",
        "thailand.title": "Thaïlande",
        "thailand.tagline": "La vie de style resort à Phuket - des unités prêtes à habiter avec des rendements de 8 à 12% aux résidences tropicales meublées.",
        "thailand.count": "2 propriétés en ligne",
        "why.label": "Notre Atout",
        "why.title": "Pourquoi ce sont des Smart Deals",
        "why.subtitle": "Chaque bien répond à au moins un de nos six critères avant d'intégrer la collection.",
        "benefit.price.title": "Meilleur Prix",
        "benefit.price.text": "Avantage tarifaire par rapport aux transactions récentes - parmi les unités les mieux tarifées de chaque segment, avec un levier de négociation clair.",
        "benefit.growth.metric": "Croissance",
        "benefit.growth.title": "Appréciation du Capital",
        "benefit.growth.text": "Projets dans des domaines avec des catalyseurs de croissance identifiés, une entrée en phase précoce en dessous des prix futurs et une dynamique de transaction éprouvée.",
        "benefit.rental.title": "Rendements Locatifs Élevés",
        "benefit.rental.text": "Rendements locatifs bruts dans les zones à forte demande avec une occupation constante et des antécédents de location éprouvés.",
        "benefit.ready.metric": "Prêt",
        "benefit.ready.title": "Valeur Clés en Main",
        "benefit.ready.text": "Maisons achevées sans risque de construction, écart de valeur clair par rapport à des unités prêtes similaires, dans des zones établies avec une demande avérée.",
        "benefit.early.metric": "Priorité",
        "benefit.early.title": "Accès Anticipé aux Lancements",
        "benefit.early.text": "Accès à l'inventaire de pré-lancement à un prix inférieur au prix de lancement public - sécuriser les unités privilégiées avant le marché général.",
        "benefit.offmarket.metric": "Privé",
        "benefit.offmarket.title": "Exclusif Hors Marché",
        "benefit.offmarket.text": "Des opportunités discrètes non cotées publiquement - l'accès est basé sur des relations, avec des prix ou des conditions indisponibles sur le marché libre.",
        "how.label": "Notre Processus",
        "how.title": "Comment nous vous aidons à investir",
        "how.intro": "Smart Deals Global est un courtier immobilier à service complet qui fonctionne sur plusieurs marchés mondiaux, vous aidant à trouver, négocier et sécuriser les meilleures offres immobilières en toute confiance.",
        "how.step1.title": "Consultation",
        "how.step1.text": "Réservez un appel sans engagement, nous comprenons votre budget, vos objectifs et votre profil de risque.",
        "how.step2.title": "Sélection Personnalisée",
        "how.step2.text": "Recevez 3 à 5 propriétés sélectionnées à la main correspondant à vos critères.",
        "how.step3.title": "Acquisition Fluide",
        "how.step3.text": "Nous nous occupons des négociations, de la coordination juridique et de la configuration après l'achat.",
        "trust.portfolio": "Valeur du Portefeuille AED",
        "trust.experience": "Années d'Expérience",
        "trust.markets": "Marchés mondiaux",
        "trust.deals": "Offres Actives",
        "faq.label": "Questions fréquentes",
        "faq.title": "Foire Aux Questions",
        "faq.q1.q": "Qu'est-ce qu'un Smart Deal ?",
        "faq.q1.a": "Une Smart Deal est une propriété qui a été évaluée et sélectionnée pour offrir un véritable avantage de valeur - que ce soit grâce à des prix inférieurs à ceux du marché, des conditions de paiement flexibles, un potentiel de rendement locatif élevé ou un accès précoce à l'inventaire avant le lancement.",
        "faq.q2.q": "Les étrangers peuvent-ils acheter une propriété à Dubaï?",
        "faq.q2.a": "Oui. Les ressortissants étrangers peuvent acheter une propriété en propriété libre dans des zones désignées à Dubaï, Abu Dhabi et dans d'autres émirats. Il n'y a pas de restrictions sur la nationalité et la propriété accorde un visa de résidence renouvelable pour les propriétés supérieures à 750 000 AED.",
        "faq.q3.q": "Comment fonctionnent les plans de paiement pour les propriétés hors plan?",
        "faq.q3.a": "Les plans de paiement hors plan varient d'un développeur à l'autre. Les structures courantes comprennent 70/30 (70% pendant la construction, 30% lors de la remise), 60/40, et 20/50/30. Certains développeurs offrent des plans prolongés de remise postérieure pouvant aller jusqu'à 5 ans. Nous négocions les meilleures conditions disponibles en votre nom.",
        "faq.q4.q": "À quels frais dois-je m'attendre lors de l'achat?",
        "faq.q4.a": "À Dubaï, le coût principal est la taxe d'enregistrement de 4% du DLD (Dubai Land Department). Les coûts supplémentaires comprennent environ 2% pour la commission d'agence, 4 000 à 5 000 AED pour les frais d'administration/d'administrateur, et l'inscription hypothécaire le cas échéant. Les coûts totaux de transaction sont généralement de 6 à 7% de la valeur de la propriété.",
        "faq.q5.q": "Faites-vous payer des frais pour vos services?",
        "faq.q5.a": "Notre service de conseil pour les acheteurs est gratuit. Nous sommes rémunérés par le développeur ou le vendeur de la transaction. Cela signifie que vous recevez des conseils professionnels, des analyses de marché et un soutien de négociation sans frais supplémentaires.",
        "faq.q6.q": "Quelle est la meilleure zone pour acheter un bien immobilier à Dubaï ?",
        "faq.q6.a": "La meilleure zone dépend de vos objectifs. Pour les rendements locatifs, Dubai Marina, JVC et Business Bay offrent régulièrement des rendements bruts de 7 à 9 %. Pour l'appréciation du capital, Dubai Hills, Creek Harbour et Palm Jumeirah dominent le marché. Pour la vie familiale, Arabian Ranches et Emirates Hills proposent des communautés de villas avec écoles et parcs. Nous vous aidons à faire correspondre vos priorités avec la bonne zone.",
        "faq.q7.q": "L'immobilier à Dubaï est-il un bon investissement en 2026 ?",
        "faq.q7.a": "L'immobilier à Dubaï continue de performer fortement en 2026, avec des transactions au T1 en hausse de 31 % en glissement annuel. Les principaux moteurs incluent l'absence d'impôt sur le revenu, l'éligibilité au Golden Visa pour les biens supérieurs à 2 millions AED, la croissance démographique et l'offre limitée de terrains premium. Des rendements locatifs moyens de 6 à 8 % surpassent la plupart des grandes villes mondiales. Les plans de paiement hors plan offrent des barrières d'entrée faibles avec des acomptes de 10 à 20 %.",
        "faq.q8.q": "Qu'est-ce que le Golden Visa pour les propriétaires immobiliers aux Émirats arabes unis ?",
        "faq.q8.a": "Le Golden Visa des Émirats arabes unis accorde une résidence renouvelable de 10 ans aux propriétaires qui investissent 2 millions AED ou plus dans l'immobilier. Il couvre l'investisseur, le conjoint et les enfants. Le bien peut être hypothéqué (jusqu'à 50 %), et il n'y a pas d'exigence de séjour minimum. Plusieurs propriétés peuvent être combinées pour atteindre le seuil. Cela rend l'immobilier émirati particulièrement attractif pour les investisseurs internationaux recherchant la résidence.",
        "faq.q9.q": "Puis-je obtenir un prêt hypothécaire en tant qu'étranger à Dubaï ?",
        "faq.q9.a": "Oui. Les non-résidents peuvent obtenir des prêts hypothécaires auprès des banques émiraties jusqu'à 50 % de la valeur du bien (75 % pour les résidents). Les taux d'intérêt varient de 4 à 6 % selon la banque et votre profil. Les documents requis incluent généralement le passeport, une preuve de revenus, des relevés bancaires et un rapport de crédit. Nous pouvons vous mettre en contact avec des conseillers hypothécaires spécialisés dans les demandes de non-résidents.",
        "faq.q10.q": "Quels sont les meilleurs projets hors plan à Dubaï en 2026 ?",
        "faq.q10.a": "Les meilleurs projets hors plan en 2026 incluent des développements par Emaar, DAMAC, Sobha et Binghatti dans des zones comme Dubai Creek Harbour, Business Bay et Dubai Hills. Les critères de sélection clés sont le palmarès du promoteur, les fondamentaux de l'emplacement, la flexibilité du plan de paiement et le calendrier de livraison prévu. Notre collection propose des opportunités hors plan pré-vérifiées avec des avantages tarifaires négociés.",
        "finalcta.title": "Prêt à faire un Smart Move ?",
        "finalcta.subtitle": "Choisissez comment vous souhaitez vous connecter avec notre équipe.",
        "finalcta.whatsapp": "Réponse instantanée",
        "finalcta.call": "Appelez-nous",
        "finalcta.email": "Email",
        "finalcta.note": "Nous répondons généralement dans les 2 heures pendant les heures d'ouverture (GST).",
        "footer.tagline": "Des opportunités immobilières sélectionnées sur 10 marchés mondiaux.",
        "footer.quickLinks": "Liens rapides",
        "footer.markets": "Marchés",
        "footer.contact": "Contact",
        "footer.link.secondary": "Marché Secondaire",
        "footer.link.offplan": "Sur Plan",
        "footer.link.monaco": "Monaco",
        "footer.link.france": "France",
        "footer.link.how": "Notre aide",
        "footer.link.uae": "ÉAU",
        "footer.link.monaco2": "Monaco",
        "footer.link.france2": "France",
        "footer.link.switzerland": "Suisse",
        "footer.link.thailand": "Thaïlande",
        "footer.link.whatsapp": "WhatsApp",
        "footer.link.emailus": "Envoyez-nous un e-mail",
        "footer.copy": "© 2026 Smart Deals Global. Tous les droits sont réservés.",
        "footer.signature": "Immobilier sélectionné, à travers le monde.",
        "card.enquire": "Demander",
        "card.studio": "Studio",
        "card.bed": "ch.",
        "card.bath": "sdb",
        "card.from": "À partir de",
        "card.flexible": "Flexible",
        "card.noImage": "Image à venir",
        "card.originalPrice": "Prix Original",
        "card.smartPrice": "Prix Smart",
        "card.price": "Prix",
        "card.startingFrom": "À partir de",
        "tag.bestPrice": "Meilleur Prix",
        "tag.highAppreciation": "Forte Appréciation",
        "tag.highYield": "Rendement Élevé",
        "tag.readyValue": "Valeur Prête",
        "tag.earlyAccess": "Accès Anticipé",
        "tag.offMarket": "Hors Marché",
        "backToMarkets": "Retour aux marchés",
        "hero.whatsapp": "Discuter sur WhatsApp",
        "how.cta": "Commencer par l'étape 1",
        "proof.label": "Résultats Clients",
        "proof.q1": "\"J'ai obtenu un appartement à Dubai Marina 18% en dessous de la valeur de transaction comparable. L'équipe a tout géré, de la visite au transfert.\"",
        "proof.c1": "Investisseur, Dubai Marina",
        "proof.q2": "\"J'ai trouvé un bien sur plan avec un plan de paiement 60/40 qu'aucun autre agent ne proposait. Économie de plus de 200 000 AED sur un 2 pièces à Creek Harbour.\"",
        "proof.c2": "Premier acheteur, Dubaï",
        "proof.q3": "\"J'ai acheté un studio à Monaco via Smart Deals à 12% en dessous du prix demandé. Le support multilingue a rendu le processus transfrontalier fluide.\"",
        "proof.c3": "Investisseur international, Monaco",
        "finalcta.subtitle2": "Commencez votre recherche immobilière en moins de 2 minutes.",
        "finalcta.mainBtn": "Discuter avec notre équipe",
        "finalcta.trust1": "Sans frais acheteur",
        "finalcta.trust2": "Équipe multilingue",
        "finalcta.trust3": "Réponse le jour même",
        "modal.paymentPlan": "Plan de paiement",
        "modal.completion": "Livraison",
        "modal.enquire": "Se renseigner sur ce bien",
        "urgency.exclusive": "Exclusif",
        "urgency.save": "Économisez",
        "mobileCta.text": "Parler à un conseiller",
        "mobileCta.hint": "Réponse le jour même",
        "engage.text": "Vous ne trouvez pas ce qu'il vous faut ? Nos conseillers peuvent rechercher des opportunités hors marché adaptées à vos critères.",
        "engage.btn": "Demander une sélection personnalisée",
        "wa.hero": "Bonjour, je suis intéressé par vos offres immobilières. Pouvons-nous en discuter ?",
        "wa.consultation": "Bonjour, je souhaite planifier une consultation sur l'investissement immobilier.",
        "wa.finalcta": "Bonjour, je suis prêt à explorer les opportunités immobilières. Pouvons-nous en discuter ?",
        "wa.mobilecta": "Bonjour, je consulte votre collection immobilière. Pouvons-nous en discuter ?",
        "wa.engage": "Bonjour, je souhaite discuter d'une recherche immobilière personnalisée.",
        "alt.hero": "Skyline de Dubaï",
        "alt.monaco": "Vue aérienne du port de Monaco",
        "alt.paris": "Paris avec la Tour Eiffel",
        "alt.switzerland": "Lac Léman et Alpes suisses",
        "alt.azerbaijan": "Skyline de Bakou",
        "alt.thailand": "Côte de Phuket",
        "alt.howWeHelp": "Vue aérienne du Burj Al Arab, Dubaï",
        "alt.finalCta": "Façade de gratte-ciel moderne",
        "aria.changeLang": "Changer de langue",
        "aria.toggleMenu": "Ouvrir le menu",
        "aria.previous": "Précédent",
        "aria.next": "Suivant",
        "aria.close": "Fermer",
        "aria.chatWhatsApp": "Discuter sur WhatsApp",
        "aria.backToTop": "Retour en haut"
    },
    "ru": {
        "nav.properties": "Объекты",
        "nav.markets": "Рынки",
        "nav.why": "Почему мы",
        "nav.process": "Процесс",
        "nav.faq": "FAQ",
        "nav.contact": "Связаться",
        "hero.eyebrow": "Курируемая недвижимость, во всем мире",
        "hero.title": "Откройте для себя коллекцию<br><em>Smart Deals</em>",
        "hero.subtitle": "Курируемая коллекция готовых и внеплановых возможностей на 10 глобальных рынках - отобранных за высокую стоимость, гибкие условия и привлекательные точки входа.",
        "hero.cta": "Смотреть коллекцию",
        "hero.stat.markets": "Мировых рынков",
        "hero.stat.deals": "Избранных объектов",
        "hero.stat.discount": "Средняя скидка %",
        "featured.label": "Сделка коллекции",
        "featured.eyebrow": "Лучшая цена месяца",
        "featured.viewDeal": "Посмотреть сделку",
        "ready.label": "Вторичный рынок",
        "ready.title": "Вторичные объекты",
        "ready.subtitle": "Готовые к переезду возможности с видимым преимуществом стоимости и немедленным входом.",
        "ready.chip1": "Готовы к заселению",
        "ready.chip2": "Чёткое ценовое преимущество",
        "ready.chip3": "Немедленный вход",
        "ready.sort": "По лучшей скидке",
        "offplan.label": "Новостройки",
        "offplan.title": "Предложения на этапе строительства",
        "offplan.subtitle": "Ценообразование на ранней стадии с гибкими планами платежей и потенциалом для роста капитала.",
        "offplan.chip1": "Скидка 2-10% обсуждается",
        "offplan.chip2": "Гибкая рассрочка",
        "offplan.chip3": "Потенциал роста",
        "midcta.title": "Интересуетесь какой-нибудь из этих возможностей?",
        "midcta.subtitle": "Наша команда может предоставить подробные брошюры, цены и организовать частные просмотры.",
        "midcta.btn": "Связаться",
        "markets.label": "Глобальное присутствие",
        "markets.title": "10 рынков. Одна миссия.",
        "markets.subtitle": "Мы предоставляем умные предложения по всем установленным и развивающимся направлениям недвижимости по всему миру.",
        "market.propertiesOnline": "объектов в продаже",
        "market.comingSoon": "Скоро",
        "market.viewCollection": "К коллекции",
        "monaco.label": "Эксклюзивная коллекция",
        "monaco.title": "Монако",
        "monaco.tagline": "От Carré d'Or до La Rousse - тщательно отобранные резиденции, сочетающие в себе престиж, арендный потенциал и долгосрочное повышение стоимости.",
        "monaco.count": "7 объектов онлайн",
        "france.label": "Парижская коллекция",
        "france.title": "Франция",
        "france.tagline": "Апартаменты, отремонтированные архитектором в самом востребованном 16-м округе Парижа - Passy, Muette и Trocadéro.",
        "france.count": "2 объекта онлайн",
        "switzerland.label": "Швейцарская Ривьера",
        "switzerland.title": "Швейцария",
        "switzerland.tagline": "Эксклюзивные пентхаусы с панорамным видом на Женевское озеро и Альпы - открыты для международных покупателей.",
        "switzerland.count": "3 объекта онлайн",
        "azerbaijan.label": "Каспийское побережье",
        "azerbaijan.title": "Азербайджан",
        "azerbaijan.tagline": "Брендовые апартаменты с обслуживанием на побережье Каспийского моря - гарантированная доходность до 15% в год.",
        "azerbaijan.count": "1 объект онлайн",
        "thailand.label": "Юго-Восточная Азия",
        "thailand.title": "Таиланд",
        "thailand.tagline": "Жизнь в курортном стиле в Phuket - от готовых объектов с доходностью 8-12% до меблированных тропических резиденций.",
        "thailand.count": "2 объекта онлайн",
        "why.label": "Наше преимущество",
        "why.title": "Почему это Smart Deals",
        "why.subtitle": "Каждый объект проходит минимум один из шести критериев, прежде чем попасть в коллекцию.",
        "benefit.price.title": "Лучшая цена",
        "benefit.price.text": "Ценовое преимущество относительно недавних сделок - одни из самых выгодно оценённых объектов в каждом сегменте, с понятным рычагом для торга.",
        "benefit.growth.metric": "Рост",
        "benefit.growth.title": "Высокий рост капитала",
        "benefit.growth.text": "Проекты в областях с идентифицированными катализаторами роста, вступлением на ранней стадии ниже будущих цен и доказанным импульсом сделок.",
        "benefit.rental.title": "Высокая арендная доходность",
        "benefit.rental.text": "Валовые доходы от аренды в зонах с высоким спросом с постоянной занятостью и проверенными показателями арендной платы.",
        "benefit.ready.metric": "Готово",
        "benefit.ready.title": "Готовая к заселению ценность",
        "benefit.ready.text": "Завершенные дома без риска строительства, явный разрыв в стоимости по сравнению с аналогичными готовыми блоками, в устоявшихся районах с доказанным спросом.",
        "benefit.early.metric": "Приоритет",
        "benefit.early.title": "Ранний доступ к запускам",
        "benefit.early.text": "Доступ к запасам до запуска по цене ниже общедоступной цены запуска - обеспечить предпочтительные единицы перед общим рынком.",
        "benefit.offmarket.metric": "Закрыто",
        "benefit.offmarket.title": "Эксклюзивные off-market",
        "benefit.offmarket.text": "Конфиденциальные предложения, не размещённые публично - доступ, основанный на отношениях, с ценообразованием или условиями, недоступными на открытом рынке.",
        "how.label": "Наш процесс",
        "how.title": "Как мы помогаем инвестировать",
        "how.intro": "Smart Deals Global - это полнофункциональное брокерское агентство по недвижимости, которое работает на нескольких глобальных рынках, помогая вам с уверенностью находить, вести переговоры и обеспечивать лучшие сделки с недвижимым имуществом.",
        "how.step1.title": "Консультация",
        "how.step1.text": "Запишитесь на бесплатную консультацию. Мы изучим ваш бюджет, цели и профиль риска.",
        "how.step2.title": "Кураторский шортлист",
        "how.step2.text": "Получите 3-5 специально отобранных объектов, соответствующих вашим критериям.",
        "how.step3.title": "Безупречная покупка",
        "how.step3.text": "Мы занимаемся переговорами, юридической координацией и установкой после покупки.",
        "trust.portfolio": "Объём портфеля AED",
        "trust.experience": "Лет опыта",
        "trust.markets": "Мировых рынков",
        "trust.deals": "Активных сделок",
        "faq.label": "Частые вопросы",
        "faq.title": "Часто задаваемые вопросы",
        "faq.q1.q": "Что такое Smart Deal?",
        "faq.q1.a": "Smart Deal - это недвижимость, которая была оценена и отобрана за то, что предлагает подлинное преимущество стоимости - будь то ценообразование ниже рыночных сопоставимых, гибкие условия оплаты, высокий потенциал доходности от аренды или ранний доступ к запасам до запуска. Каждый объект в нашей коллекции отвечает по крайней мере одному из наших шести критериев стоимости.",
        "faq.q2.q": "Могут ли иностранцы покупать недвижимость в Дубае?",
        "faq.q2.a": "Да. Иностранные граждане могут приобретать недвижимость в свободном владении в обозначенных районах Дубая, Абу-Даби и других эмиратов. Нет никаких ограничений на гражданство, а право собственности предоставляет возобновляемую визу на жительство для недвижимого имущества свыше AED 750 000.",
        "faq.q3.q": "Как работают планы оплаты для недвижимости вне плана?",
        "faq.q3.a": "Планы внеплановых платежей варьируются в зависимости от застройщика. Обычные структуры включают 70/30 (70% во время строительства, 30% при передаче), 60/40 и 20/50/30. Некоторые застройщики предлагают расширенные планы после передачи до 5 лет. Мы обсуждаем наилучшие доступные условия от вашего имени.",
        "faq.q4.q": "Каких сборов я должен ожидать при покупке?",
        "faq.q4.a": "В Дубае основными расходами являются 4% регистрационные сборы DLD (Dubai Land Department). Дополнительные расходы включают примерно 2% комиссионных за агентство, AED 4,000-5,000 для администраторов/попечителей, а также регистрацию ипотеки, если это применимо. Общие расходы на транзакцию обычно составляют 6-7% от стоимости недвижимости.",
        "faq.q5.q": "Вы взимаете какие-либо сборы за свои услуги?",
        "faq.q5.a": "Наш консультативный сервис для покупателей является бесплатным. Мы получаем компенсацию со стороны застройщика или продавца. Это означает, что вы получаете профессиональное руководство, анализ рынка и поддержку в переговорах без дополнительных затрат.",
        "faq.q6.q": "Какой район лучше всего подходит для покупки недвижимости в Дубае?",
        "faq.q6.a": "Лучший район зависит от ваших целей. Для арендного дохода Dubai Marina, JVC и Business Bay стабильно приносят 7-9% валовой доходности. Для прироста капитала Dubai Hills, Creek Harbour и Palm Jumeirah лидируют на рынке. Для семейного проживания Arabian Ranches и Emirates Hills предлагают виллы со школами и парками. Мы помогаем подобрать район, соответствующий вашим приоритетам.",
        "faq.q7.q": "Является ли недвижимость в Дубае хорошей инвестицией в 2026 году?",
        "faq.q7.a": "Рынок недвижимости Дубая продолжает показывать сильные результаты в 2026 году: количество сделок в первом квартале выросло на 31% по сравнению с прошлым годом. Ключевые факторы включают отсутствие подоходного налога, право на Golden Visa при покупке недвижимости от 2 млн AED, рост населения и ограниченное предложение элитных участков. Средняя арендная доходность 6-8% превышает показатели большинства мировых городов. Планы рассрочки на строящуюся недвижимость предлагают низкий порог входа с первоначальным взносом 10-20%.",
        "faq.q8.q": "Что такое Золотая виза для владельцев недвижимости в ОАЭ?",
        "faq.q8.a": "Золотая виза ОАЭ предоставляет возобновляемый вид на жительство сроком на 10 лет владельцам недвижимости, инвестировавшим 2 миллиона AED или более. Она распространяется на инвестора, супруга/супругу и детей. Недвижимость может быть в ипотеке (до 50%), и нет требования к минимальному сроку пребывания. Несколько объектов можно объединить для достижения порогового значения. Это делает недвижимость ОАЭ уникально привлекательной для международных инвесторов, ищущих вид на жительство.",
        "faq.q9.q": "Могу ли я получить ипотеку как иностранец в Дубае?",
        "faq.q9.a": "Да. Нерезиденты могут получить ипотеку в банках ОАЭ на сумму до 50% от стоимости недвижимости (75% для резидентов). Процентные ставки варьируются от 4 до 6% в зависимости от банка и вашего профиля. Обычно требуемые документы включают паспорт, подтверждение дохода, банковские выписки и кредитный отчёт. Мы можем связать вас с ипотечными консультантами, специализирующимися на заявках нерезидентов.",
        "faq.q10.q": "Какие лучшие строящиеся проекты в Дубае в 2026 году?",
        "faq.q10.a": "Лучшие строящиеся проекты в 2026 году включают объекты от Emaar, DAMAC, Sobha и Binghatti в таких районах, как Dubai Creek Harbour, Business Bay и Dubai Hills. Ключевые критерии выбора — репутация застройщика, характеристики местоположения, гибкость плана оплаты и ожидаемые сроки сдачи. Наша коллекция включает проверенные строящиеся объекты с договорными ценовыми преимуществами.",
        "finalcta.title": "Готовы сделать умный шаг?",
        "finalcta.subtitle": "Выберите, как вы хотите связаться с нашей командой.",
        "finalcta.whatsapp": "Мгновенный ответ",
        "finalcta.call": "Позвонить",
        "finalcta.email": "Почта",
        "finalcta.note": "Обычно мы отвечаем в течение 2 часов в рабочее время (GST).",
        "footer.tagline": "Выбранные возможности недвижимости на 10 глобальных рынках.",
        "footer.quickLinks": "Быстрые ссылки",
        "footer.markets": "Рынки",
        "footer.contact": "Контакты",
        "footer.link.secondary": "Вторичный рынок",
        "footer.link.offplan": "Строящиеся объекты",
        "footer.link.monaco": "Монако",
        "footer.link.france": "Франция",
        "footer.link.how": "Наша помощь",
        "footer.link.uae": "ОАЭ",
        "footer.link.monaco2": "Монако",
        "footer.link.france2": "Франция",
        "footer.link.switzerland": "Швейцария",
        "footer.link.thailand": "Таиланд",
        "footer.link.whatsapp": "WhatsApp",
        "footer.link.emailus": "Написать",
        "footer.copy": "© 2026 Smart Deals Global. Все права защищены.",
        "footer.signature": "Кураторская недвижимость по всему миру.",
        "card.enquire": "Запрос",
        "card.studio": "Студия",
        "card.bed": "спал.",
        "card.bath": "с/у",
        "card.from": "От",
        "card.flexible": "Гибко",
        "card.noImage": "Фото скоро",
        "card.originalPrice": "Исходная цена",
        "card.smartPrice": "Smart-цена",
        "card.price": "Цена",
        "card.startingFrom": "От",
        "tag.bestPrice": "Лучшая цена",
        "tag.highAppreciation": "Высокий рост",
        "tag.highYield": "Высокая доходность",
        "tag.readyValue": "Готовая ценность",
        "tag.earlyAccess": "Ранний доступ",
        "tag.offMarket": "Off-Market",
        "backToMarkets": "К списку рынков",
        "hero.whatsapp": "Написать в WhatsApp",
        "how.cta": "Начать с шага 1",
        "proof.label": "Результаты клиентов",
        "proof.q1": "\"Приобрели квартиру в Dubai Marina на 18% ниже сопоставимой стоимости сделки DLD. Команда взяла на себя всё, от просмотра до оформления.\"",
        "proof.c1": "Инвестор, Dubai Marina",
        "proof.q2": "\"Нашли объект off-plan с планом оплаты 60/40, который не предлагал ни один другой агент. Сэкономили более 200 000 AED на 2-комнатной в Creek Harbour.\"",
        "proof.c2": "Первый покупатель, Дубай",
        "proof.q3": "\"Купили студию в Монако через Smart Deals на 12% ниже запрашиваемой цены. Мультиязычная поддержка сделала трансграничный процесс простым.\"",
        "proof.c3": "Международный инвестор, Монако",
        "finalcta.subtitle2": "Начните поиск недвижимости менее чем за 2 минуты.",
        "finalcta.mainBtn": "Написать нашей команде",
        "finalcta.trust1": "Без комиссии для покупателя",
        "finalcta.trust2": "Мультиязычная команда",
        "finalcta.trust3": "Ответ в тот же день",
        "modal.paymentPlan": "План оплаты",
        "modal.completion": "Сдача",
        "modal.enquire": "Узнать об этом объекте",
        "urgency.exclusive": "Эксклюзив",
        "urgency.save": "Экономия",
        "mobileCta.text": "Связаться с консультантом",
        "mobileCta.hint": "Ответ в тот же день",
        "engage.text": "Не нашли подходящий вариант? Наши консультанты подберут закрытые предложения под ваши критерии.",
        "engage.btn": "Запросить персональную подборку",
        "wa.hero": "Здравствуйте, меня интересуют ваши подобранные предложения недвижимости. Можем обсудить?",
        "wa.consultation": "Здравствуйте, хотел бы записаться на консультацию по инвестициям в недвижимость.",
        "wa.finalcta": "Здравствуйте, я готов рассмотреть предложения по недвижимости. Можем обсудить?",
        "wa.mobilecta": "Здравствуйте, просматриваю вашу коллекцию недвижимости. Можем обсудить?",
        "wa.engage": "Здравствуйте, хотел бы обсудить индивидуальный подбор недвижимости.",
        "alt.hero": "Панорама Дубая",
        "alt.monaco": "Вид на гавань Монако с воздуха",
        "alt.paris": "Париж с Эйфелевой башней",
        "alt.switzerland": "Женевское озеро и Швейцарские Альпы",
        "alt.azerbaijan": "Панорама Баку",
        "alt.thailand": "Побережье Пхукета",
        "alt.howWeHelp": "Вид на Бурдж-эль-Араб с воздуха, Дубай",
        "alt.finalCta": "Фасад современного небоскрёба",
        "aria.changeLang": "Сменить язык",
        "aria.toggleMenu": "Открыть меню",
        "aria.previous": "Назад",
        "aria.next": "Вперёд",
        "aria.close": "Закрыть",
        "aria.chatWhatsApp": "Написать в WhatsApp",
        "aria.backToTop": "Наверх"
    }
};

function t(key) {
    const dict = I18N_DICT[CURRENT_LANG] || I18N_DICT[I18N_DEFAULT];
    return dict[key] || I18N_DICT[I18N_DEFAULT][key] || key;
}

const LANG_LABELS = { en: 'EN', ar: 'AR', fr: 'FR', ru: 'RU' };

function applyLanguage(lang, rerender) {
    if (!I18N_DICT[lang]) lang = I18N_DEFAULT;
    CURRENT_LANG = lang;
    const dict = I18N_DICT[lang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (dict[key]) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        if (dict[key]) el.innerHTML = dict[key];
    });
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const currentLabel = document.querySelector('.lang-switcher__current');
    if (currentLabel) currentLabel.textContent = LANG_LABELS[lang] || lang.toUpperCase();

    document.querySelectorAll('.lang-switcher__menu [data-lang]').forEach(btn => {
        btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });

    try { localStorage.setItem(I18N_STORAGE_KEY, lang); } catch (e) { /* storage blocked */ }

    // Re-render JS-injected content so cards, markets, tags update too
    if (rerender) {
        if (typeof renderFeaturedDeal === 'function') renderFeaturedDeal();
        if (typeof renderMarketsGridV2 === 'function') renderMarketsGridV2();
        if (typeof renderReadyCards === 'function') renderReadyCards();
        if (typeof renderOffplanCards === 'function') renderOffplanCards();
        if (typeof renderCountryCards === 'function') {
            if (typeof monacoProperties !== 'undefined') renderCountryCards(monacoProperties, 'monaco-cards', 'Monaco');
            if (typeof parisProperties !== 'undefined') renderCountryCards(parisProperties, 'paris-cards', 'France');
            if (typeof switzerlandProperties !== 'undefined') renderCountryCards(switzerlandProperties, 'switzerland-cards', 'Switzerland');
            if (typeof azerbaijanProperties !== 'undefined') renderCountryCards(azerbaijanProperties, 'azerbaijan-cards', 'Azerbaijan');
            if (typeof thailandProperties !== 'undefined') renderCountryCards(thailandProperties, 'thailand-cards', 'Thailand');
        }
        // Rebind enquiry notifications on the freshly rendered cards
        document.querySelectorAll('.btn--card[data-property]').forEach(btn => {
            btn.addEventListener('click', () => {
                if (typeof notifyEnquiry === 'function') {
                    notifyEnquiry(btn.dataset.property, btn.dataset.location, btn.dataset.section);
                }
            });
        });
        if (typeof initSwipers === 'function') initSwipers();
    }
}

// Base path to the EN (root) variant, computed at runtime. Used both for
// language-switcher navigation and for prefixing asset paths emitted by the
// JS render functions (property cards, market cards). Without this, pages
// served at '/ar/', '/fr/', '/ru/' would request 'properties/...' relative
// to the current URL and hit 404s.
const ASSET_BASE = (function () {
    let p = window.location.pathname;
    p = p.replace(/\/index\.html?$/i, '');
    p = p.replace(/\/(ar|fr|ru)\/?$/i, '/');
    if (!p.endsWith('/')) p += '/';
    return p;
})();
function asset(rel) {
    if (!rel) return rel;
    // Allow absolute, protocol-relative, and data URIs through untouched.
    if (/^(https?:)?\/\//i.test(rel) || rel.startsWith('data:') || rel.startsWith('/')) return rel;
    return ASSET_BASE + rel;
}

// Map of lang -> URL path for pre-rendered variants.
// Computed at runtime so the switcher works whether the page is served at
// site root ('/') or from a sub-path like '/api/documents/smart-deal-global/'.
// If the host lacks directory-index resolution (the innovation-portal docs
// API is one such host), we explicitly append 'index.html'.
const LANG_URLS = (function () {
    let p = window.location.pathname;
    // Detect if the current URL explicitly references index.html; if so we
    // cannot rely on directory-index serving for the siblings either.
    const needsIndex = /\/index\.html?$/i.test(p) || /\/api\/documents\//i.test(p);
    p = p.replace(/\/index\.html?$/i, '');
    p = p.replace(/\/(ar|fr|ru)\/?$/i, '');
    if (!p.endsWith('/')) p += '/';
    const tail = needsIndex ? 'index.html' : '';
    return {
        en: p + tail,
        ar: p + 'ar/' + tail,
        fr: p + 'fr/' + tail,
        ru: p + 'ru/' + tail
    };
})();

function initLanguageSwitcher() {
    const switcher = document.querySelector('.lang-switcher');
    if (!switcher) return;
    const btn = switcher.querySelector('.lang-switcher__btn');
    const menu = switcher.querySelector('.lang-switcher__menu');

    // Source of truth: the <html lang> attribute set by the pre-rendered page.
    const pageLang = (document.documentElement.getAttribute('lang') || I18N_DEFAULT).toLowerCase();
    CURRENT_LANG = I18N_DICT[pageLang] ? pageLang : I18N_DEFAULT;
    try { localStorage.setItem(I18N_STORAGE_KEY, CURRENT_LANG); } catch (e) { /* ignore */ }

    // Ensure switcher UI reflects current state (handles bfcache / JS-only environments).
    applyLanguage(CURRENT_LANG, true);

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const open = switcher.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
    });

    menu.querySelectorAll('[data-lang]').forEach(opt => {
        opt.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = opt.dataset.lang;
            if (target === CURRENT_LANG) {
                switcher.classList.remove('is-open');
                return;
            }
            try { localStorage.setItem(I18N_STORAGE_KEY, target); } catch (err) { /* ignore */ }
            const dest = LANG_URLS[target] || '/';
            // Navigate so each language variant is served from its own URL (preserves SEO indexing).
            window.location.href = dest;
        });
    });

    document.addEventListener('click', (e) => {
        if (!switcher.contains(e.target)) {
            switcher.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
        }
    });
}

// ============================================
// BACK TO MARKETS — shows for ~8s when entering a country section
// ============================================
function initBackToMarkets() {
    const btn = document.getElementById('back-to-markets');
    const marketsSection = document.getElementById('markets-v2');
    const countrySections = document.querySelectorAll('.country-section');
    if (!btn || !marketsSection || countrySections.length === 0) return;

    const HOLD_MS = 8000;
    let hideTimer = null;
    let currentSection = null;

    function show() {
        btn.classList.add('is-visible');
        btn.setAttribute('aria-hidden', 'false');
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(hide, HOLD_MS);
    }
    function hide() {
        btn.classList.remove('is-visible');
        btn.setAttribute('aria-hidden', 'true');
    }

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        hide();
        smoothScrollTo(marketsSection);
    });

    // Hide when user scrolls back into the markets section itself
    const marketsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) hide(); });
    }, { threshold: 0.15 });
    marketsObserver.observe(marketsSection);

    // Show whenever the user enters a new country section
    const countryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target !== currentSection) {
                currentSection = entry.target;
                show();
            }
        });
    }, { threshold: 0.25 });
    countrySections.forEach(s => countryObserver.observe(s));

    // Any user input (scroll, tap, key) inside the hold window keeps the UX
    // predictable: we let the timer run without resetting, so the button
    // reliably fades after ~8s of exposure.
}
