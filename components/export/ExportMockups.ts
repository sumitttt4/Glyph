/**
 * Mockup Export Utilities
 *
 * Generates exportable mockup images using SVG templates.
 * Each mockup is self-contained and doesn't require external images.
 * Includes realistic shadows, lighting, and textures.
 *
 * CRITICAL: Uses stored logo SVG via getStoredLogoSVG().
 * Stores generated mockups in mockup-state for export consistency.
 */

import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG } from '@/components/logo-engine/renderers/stored-logo-export';
import { storeMockup, MockupType } from '@/lib/mockup-state';

// ============================================
// TYPES
// ============================================

export type MockupExportType =
    | 'business-card'
    | 'linkedin-banner'
    | 'website-header'
    | 'mobile-app'
    | 'poster'
    | 'letterhead'
    | 'billboard'
    | 'phone-screen'
    | 'laptop-screen'
    | 'storefront-sign'
    | 'packaging-box'
    | 'hoodie'
    | 'tote-bag'
    | 'coffee-cup';

export interface MockupExport {
    type: MockupExportType;
    filename: string;
    svg: string;
    width: number;
    height: number;
}

// Debug logging
const DEBUG = true;
function logMockup(action: string, data?: Record<string, unknown>) {
    if (DEBUG) {
        console.log(`[ExportMockups] ${action}`, data ? data : '');
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Get logo as embedded SVG content
 */
function getEmbeddedLogo(brand: BrandIdentity, color: 'color' | 'white' | 'black' = 'color'): string {
    const logoSvg = getStoredLogoSVG(brand, color);
    // Extract inner content from SVG, remove outer svg tags
    return logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();
}

// ============================================
// MOCKUP GENERATORS
// ============================================

/**
 * Generate Business Card mockup SVG
 */
export function generateBusinessCardMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const email = `hello@${brand.name.toLowerCase().replace(/\s+/g, '')}.com`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" fill="none">
    <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="20" stdDeviation="30" flood-opacity="0.3"/>
        </filter>
    </defs>

    <!-- Background -->
    <rect width="800" height="500" fill="#f5f5f5"/>

    <!-- Card shadow -->
    <rect x="200" y="120" width="400" height="230" rx="12" fill="#000" opacity="0.2" filter="url(#shadow)" transform="translate(10, 20)"/>

    <!-- Main card -->
    <rect x="200" y="120" width="400" height="230" rx="12" fill="${colors.bg}"/>
    <rect x="200" y="120" width="400" height="230" rx="12" fill="none" stroke="${colors.border}" stroke-width="1"/>

    <!-- Logo area -->
    <svg x="230" y="150" width="80" height="80" viewBox="0 0 100 100">
        ${getEmbeddedLogo(brand)}
    </svg>

    <!-- Brand name -->
    <text x="230" y="300" font-family="${fontFamily}" font-size="18" font-weight="700" fill="${colors.text}">${escapeXml(brand.name)}</text>

    <!-- Email -->
    <text x="230" y="325" font-family="${fontFamily}" font-size="12" fill="${colors.muted}">${escapeXml(email)}</text>
</svg>`;

    return {
        type: 'business-card',
        filename: 'mockup-business-card.svg',
        svg,
        width: 800,
        height: 500,
    };
}

/**
 * Generate LinkedIn Banner mockup SVG
 */
export function generateLinkedInBannerMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const tagline = brand.strategy?.tagline || `Empowering ${brand.vibe} experiences`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1584 396" fill="none">
    <!-- Background -->
    <rect width="1584" height="396" fill="${colors.primary}"/>

    <!-- Pattern overlay -->
    <defs>
        <pattern id="dots" patternUnits="userSpaceOnUse" width="24" height="24">
            <circle cx="12" cy="12" r="2" fill="${colors.bg}" opacity="0.1"/>
        </pattern>
    </defs>
    <rect width="1584" height="396" fill="url(#dots)"/>

    <!-- Logo (white version) -->
    <g transform="translate(100, 118)">
        <svg width="160" height="160" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>

    <!-- Tagline -->
    <text x="320" y="220" font-family="${fontFamily}" font-size="42" font-weight="700" fill="${colors.bg}">${escapeXml(tagline)}</text>
</svg>`;

    return {
        type: 'linkedin-banner',
        filename: 'mockup-linkedin-banner.svg',
        svg,
        width: 1584,
        height: 396,
    };
}

/**
 * Generate Website Header mockup SVG
 */
export function generateWebsiteHeaderMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const tagline = brand.strategy?.tagline || 'Building the future, one step at a time';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" fill="none">
    <defs>
        <filter id="browser-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="15" stdDeviation="25" flood-opacity="0.25"/>
        </filter>
    </defs>

    <!-- Background -->
    <rect width="1200" height="800" fill="#e5e5e5"/>

    <!-- Browser window -->
    <g filter="url(#browser-shadow)">
        <!-- Browser frame -->
        <rect x="100" y="80" width="1000" height="640" rx="12" fill="#ffffff"/>

        <!-- Browser chrome -->
        <rect x="100" y="80" width="1000" height="50" rx="12" fill="#f0f0f0"/>
        <rect x="100" y="118" width="1000" height="12" fill="#f0f0f0"/>

        <!-- Traffic lights -->
        <circle cx="130" cy="105" r="7" fill="#ff5f57"/>
        <circle cx="155" cy="105" r="7" fill="#febc2e"/>
        <circle cx="180" cy="105" r="7" fill="#28c840"/>

        <!-- URL bar -->
        <rect x="220" y="92" width="760" height="26" rx="6" fill="#ffffff"/>
        <text x="240" y="110" font-family="monospace" font-size="12" fill="#666">${brand.name.toLowerCase().replace(/\s+/g, '')}.com</text>
    </g>

    <!-- Website content -->
    <rect x="100" y="130" width="1000" height="590" fill="${colors.bg}"/>

    <!-- Navigation -->
    <rect x="100" y="130" width="1000" height="60" fill="${colors.bg}"/>
    <line x1="100" y1="190" x2="1100" y2="190" stroke="${colors.border}" stroke-width="1"/>

    <!-- Logo in nav -->
    <svg x="140" y="145" width="32" height="32" viewBox="0 0 100 100">
        ${getEmbeddedLogo(brand)}
    </svg>
    <text x="185" y="170" font-family="${fontFamily}" font-size="18" font-weight="600" fill="${colors.text}">${escapeXml(brand.name)}</text>

    <!-- Nav links -->
    <text x="750" y="168" font-family="${fontFamily}" font-size="14" fill="${colors.muted}">Products</text>
    <text x="840" y="168" font-family="${fontFamily}" font-size="14" fill="${colors.muted}">About</text>
    <text x="910" y="168" font-family="${fontFamily}" font-size="14" fill="${colors.muted}">Pricing</text>
    <rect x="980" y="150" width="100" height="32" rx="6" fill="${colors.primary}"/>
    <text x="1000" y="172" font-family="${fontFamily}" font-size="13" font-weight="500" fill="${colors.bg}">Get Started</text>

    <!-- Hero section -->
    <text x="600" y="350" font-family="${fontFamily}" font-size="48" font-weight="700" fill="${colors.text}" text-anchor="middle">Welcome to ${escapeXml(brand.name)}</text>
    <text x="600" y="400" font-family="${fontFamily}" font-size="18" fill="${colors.muted}" text-anchor="middle">${escapeXml(tagline)}</text>
    <rect x="500" y="440" width="200" height="48" rx="8" fill="${colors.primary}"/>
    <text x="600" y="472" font-family="${fontFamily}" font-size="16" font-weight="500" fill="${colors.bg}" text-anchor="middle">Learn More</text>
</svg>`;

    return {
        type: 'website-header',
        filename: 'mockup-website-header.svg',
        svg,
        width: 1200,
        height: 800,
    };
}

/**
 * Generate Mobile App mockup SVG
 */
export function generateMobileAppMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900" fill="none">
    <defs>
        <filter id="phone-shadow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="0" dy="20" stdDeviation="40" flood-opacity="0.4"/>
        </filter>
        <clipPath id="screen-clip">
            <rect x="118" y="88" width="264" height="574" rx="32"/>
        </clipPath>
    </defs>

    <!-- Background -->
    <rect width="500" height="900" fill="#f0f0f0"/>

    <!-- Phone frame -->
    <g filter="url(#phone-shadow)">
        <rect x="110" y="80" width="280" height="590" rx="40" fill="#1a1a1a"/>
        <rect x="114" y="84" width="272" height="582" rx="38" fill="#2a2a2a"/>
    </g>

    <!-- Screen -->
    <g clip-path="url(#screen-clip)">
        <!-- Splash screen background -->
        <rect x="118" y="88" width="264" height="574" fill="${colors.primary}"/>

        <!-- Logo (centered, white) -->
        <g transform="translate(170, 280)">
            <svg width="160" height="160" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
                ${getEmbeddedLogo(brand)}
            </svg>
        </g>

        <!-- Brand name -->
        <text x="250" y="500" font-family="${fontFamily}" font-size="24" font-weight="600" fill="${colors.bg}" text-anchor="middle">${escapeXml(brand.name)}</text>
    </g>

    <!-- Dynamic Island -->
    <rect x="195" y="100" width="110" height="32" rx="16" fill="#000"/>

    <!-- Home indicator -->
    <rect x="200" y="640" width="100" height="5" rx="2.5" fill="rgba(255,255,255,0.3)"/>

    <!-- Side button -->
    <rect x="390" y="200" width="4" height="60" rx="2" fill="#333"/>

    <!-- Volume buttons -->
    <rect x="106" y="180" width="4" height="40" rx="2" fill="#333"/>
    <rect x="106" y="240" width="4" height="40" rx="2" fill="#333"/>
</svg>`;

    return {
        type: 'mobile-app',
        filename: 'mockup-mobile-app.svg',
        svg,
        width: 500,
        height: 900,
    };
}

/**
 * Generate Poster mockup SVG
 */
export function generatePosterMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const tagline = brand.strategy?.tagline || brand.vibe;
    const website = `${brand.name.toLowerCase().replace(/\s+/g, '')}.com`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" fill="none">
    <defs>
        <filter id="poster-shadow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="0" dy="25" stdDeviation="30" flood-opacity="0.35"/>
        </filter>
        <pattern id="poster-dots" patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="10" cy="10" r="1" fill="${colors.text}" opacity="0.05"/>
        </pattern>
    </defs>

    <!-- Background -->
    <rect width="600" height="800" fill="#d0d0d0"/>

    <!-- Poster with shadow -->
    <g filter="url(#poster-shadow)">
        <rect x="100" y="60" width="400" height="560" rx="8" fill="${colors.bg}"/>
    </g>

    <!-- Pattern overlay -->
    <rect x="100" y="60" width="400" height="560" rx="8" fill="url(#poster-dots)"/>

    <!-- Logo (centered) -->
    <g transform="translate(200, 180)">
        <svg width="200" height="200" viewBox="0 0 100 100">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>

    <!-- Brand name -->
    <text x="300" y="450" font-family="${fontFamily}" font-size="36" font-weight="700" fill="${colors.text}" text-anchor="middle">${escapeXml(brand.name)}</text>

    <!-- Tagline -->
    <text x="300" y="490" font-family="${fontFamily}" font-size="16" fill="${colors.muted}" text-anchor="middle">${escapeXml(tagline)}</text>

    <!-- Website -->
    <text x="300" y="580" font-family="${fontFamily}" font-size="12" fill="${colors.muted}" text-anchor="middle" opacity="0.5">${escapeXml(website)}</text>
</svg>`;

    return {
        type: 'poster',
        filename: 'mockup-poster.svg',
        svg,
        width: 600,
        height: 800,
    };
}

/**
 * Generate Letterhead mockup SVG
 */
export function generateLetterheadMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const email = `hello@${brand.name.toLowerCase().replace(/\s+/g, '')}.com`;
    const website = `${brand.name.toLowerCase().replace(/\s+/g, '')}.com`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 595 842" fill="none">
    <defs>
        <filter id="letterhead-shadow" x="-10%" y="-5%" width="120%" height="110%">
            <feDropShadow dx="0" dy="15" stdDeviation="20" flood-opacity="0.2"/>
        </filter>
    </defs>

    <!-- Background -->
    <rect width="595" height="842" fill="#e8e8e8"/>

    <!-- Paper with shadow -->
    <g filter="url(#letterhead-shadow)">
        <rect x="47" y="40" width="501" height="762" fill="#ffffff"/>
    </g>

    <!-- Header accent bar -->
    <rect x="47" y="40" width="501" height="8" fill="${colors.primary}"/>

    <!-- Header -->
    <rect x="47" y="48" width="501" height="80" fill="${colors.bg}"/>
    <line x1="47" y1="128" x2="548" y2="128" stroke="${colors.border}" stroke-width="1"/>

    <!-- Logo in header -->
    <svg x="80" y="68" width="48" height="48" viewBox="0 0 100 100">
        ${getEmbeddedLogo(brand)}
    </svg>
    <text x="145" y="100" font-family="${fontFamily}" font-size="18" font-weight="600" fill="${colors.text}">${escapeXml(brand.name)}</text>

    <!-- Contact info (right side) -->
    <text x="500" y="78" font-family="${fontFamily}" font-size="10" fill="${colors.muted}" text-anchor="end">${escapeXml(website)}</text>
    <text x="500" y="95" font-family="${fontFamily}" font-size="10" fill="${colors.muted}" text-anchor="end">${escapeXml(email)}</text>

    <!-- Document content lines (placeholder) -->
    <rect x="80" y="180" width="120" height="8" rx="2" fill="#e0e0e0"/>
    <rect x="80" y="220" width="435" height="6" rx="2" fill="#f0f0f0"/>
    <rect x="80" y="240" width="435" height="6" rx="2" fill="#f0f0f0"/>
    <rect x="80" y="260" width="350" height="6" rx="2" fill="#f0f0f0"/>
    <rect x="80" y="300" width="435" height="6" rx="2" fill="#f0f0f0"/>
    <rect x="80" y="320" width="435" height="6" rx="2" fill="#f0f0f0"/>
    <rect x="80" y="340" width="400" height="6" rx="2" fill="#f0f0f0"/>
    <rect x="80" y="380" width="435" height="6" rx="2" fill="#f0f0f0"/>
    <rect x="80" y="400" width="300" height="6" rx="2" fill="#f0f0f0"/>

    <!-- Footer -->
    <line x1="47" y1="762" x2="548" y2="762" stroke="${colors.border}" stroke-width="1"/>
    <text x="297" y="782" font-family="${fontFamily}" font-size="9" fill="${colors.muted}" text-anchor="middle">123 Brand Street, City, State 12345</text>
</svg>`;

    return {
        type: 'letterhead',
        filename: 'mockup-letterhead.svg',
        svg,
        width: 595,
        height: 842,
    };
}

// ============================================
// NEW MOCKUPS - BILLBOARD
// ============================================

/**
 * Generate Billboard mockup SVG
 */
export function generateBillboardMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const tagline = brand.strategy?.tagline || `Welcome to ${brand.name}`;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600" fill="none">
    <defs>
        <linearGradient id="sky-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#87CEEB"/>
            <stop offset="100%" stop-color="#E0F0FF"/>
        </linearGradient>
        <filter id="billboard-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="15" stdDeviation="20" flood-opacity="0.4"/>
        </filter>
        <linearGradient id="metal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#888"/>
            <stop offset="50%" stop-color="#555"/>
            <stop offset="100%" stop-color="#333"/>
        </linearGradient>
    </defs>

    <!-- Sky background -->
    <rect width="1200" height="600" fill="url(#sky-gradient)"/>

    <!-- Ground -->
    <rect y="450" width="1200" height="150" fill="#4a5568"/>
    <rect y="450" width="1200" height="20" fill="#2d3748"/>

    <!-- Billboard structure -->
    <g filter="url(#billboard-shadow)">
        <!-- Support poles -->
        <rect x="250" y="280" width="20" height="200" fill="url(#metal-gradient)"/>
        <rect x="930" y="280" width="20" height="200" fill="url(#metal-gradient)"/>

        <!-- Billboard frame -->
        <rect x="100" y="60" width="1000" height="250" rx="4" fill="#1a1a1a"/>

        <!-- Billboard content -->
        <rect x="110" y="70" width="980" height="230" fill="${colors.primary}"/>

        <!-- Pattern overlay -->
        <defs>
            <pattern id="billboard-dots" patternUnits="userSpaceOnUse" width="30" height="30">
                <circle cx="15" cy="15" r="2" fill="${colors.bg}" opacity="0.1"/>
            </pattern>
        </defs>
        <rect x="110" y="70" width="980" height="230" fill="url(#billboard-dots)"/>
    </g>

    <!-- Logo (white) -->
    <g transform="translate(180, 120)">
        <svg width="150" height="150" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>

    <!-- Brand name and tagline -->
    <text x="400" y="180" font-family="${fontFamily}" font-size="56" font-weight="800" fill="${colors.bg}">${escapeXml(brand.name)}</text>
    <text x="400" y="240" font-family="${fontFamily}" font-size="24" fill="${colors.bg}" opacity="0.9">${escapeXml(tagline)}</text>

    <!-- Lights on top -->
    <circle cx="200" cy="55" r="8" fill="#ffeb3b"/>
    <circle cx="600" cy="55" r="8" fill="#ffeb3b"/>
    <circle cx="1000" cy="55" r="8" fill="#ffeb3b"/>
</svg>`;

    const mockup = {
        type: 'billboard' as MockupExportType,
        filename: 'mockup-billboard.svg',
        svg,
        width: 1200,
        height: 600,
    };

    storeMockup('billboard', svg, 1200, 600);
    return mockup;
}

// ============================================
// NEW MOCKUPS - LAPTOP SCREEN
// ============================================

/**
 * Generate Laptop Screen mockup SVG
 */
export function generateLaptopScreenMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const tagline = brand.strategy?.tagline || 'Building the future';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 900" fill="none">
    <defs>
        <filter id="laptop-shadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="30" stdDeviation="40" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="laptop-body" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#e0e0e0"/>
            <stop offset="100%" stop-color="#bdbdbd"/>
        </linearGradient>
        <linearGradient id="screen-bezel" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#2a2a2a"/>
            <stop offset="100%" stop-color="#1a1a1a"/>
        </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="1440" height="900" fill="#f5f5f5"/>

    <!-- MacBook Pro -->
    <g filter="url(#laptop-shadow)">
        <!-- Screen bezel -->
        <rect x="170" y="50" width="1100" height="700" rx="16" fill="url(#screen-bezel)"/>

        <!-- Camera notch -->
        <rect x="620" y="50" width="200" height="30" rx="15" fill="#1a1a1a"/>
        <circle cx="720" cy="65" r="4" fill="#333"/>

        <!-- Screen -->
        <rect x="185" y="80" width="1070" height="640" fill="${colors.bg}"/>

        <!-- Website on screen -->
        <!-- Navigation bar -->
        <rect x="185" y="80" width="1070" height="60" fill="${colors.surface}"/>
        <line x1="185" y1="140" x2="1255" y2="140" stroke="${colors.border}" stroke-width="1"/>

        <!-- Logo in nav -->
        <svg x="220" y="95" width="32" height="32" viewBox="0 0 100 100">
            ${getEmbeddedLogo(brand)}
        </svg>
        <text x="265" y="120" font-family="${fontFamily}" font-size="16" font-weight="600" fill="${colors.text}">${escapeXml(brand.name)}</text>

        <!-- Hero content -->
        <text x="720" y="340" font-family="${fontFamily}" font-size="48" font-weight="700" fill="${colors.text}" text-anchor="middle">Welcome to ${escapeXml(brand.name)}</text>
        <text x="720" y="400" font-family="${fontFamily}" font-size="18" fill="${colors.muted}" text-anchor="middle">${escapeXml(tagline)}</text>

        <!-- CTA Button -->
        <rect x="620" y="440" width="200" height="50" rx="8" fill="${colors.primary}"/>
        <text x="720" y="472" font-family="${fontFamily}" font-size="16" font-weight="500" fill="${colors.bg}" text-anchor="middle">Get Started</text>

        <!-- Base -->
        <path d="M120 750 L170 720 L1270 720 L1320 750 Z" fill="url(#laptop-body)"/>
        <rect x="120" y="750" width="1200" height="30" rx="4" fill="#d0d0d0"/>

        <!-- Trackpad area on base -->
        <rect x="570" y="755" width="300" height="20" rx="4" fill="#c0c0c0"/>
    </g>
</svg>`;

    const mockup = {
        type: 'laptop-screen' as MockupExportType,
        filename: 'mockup-laptop-screen.svg',
        svg,
        width: 1440,
        height: 900,
    };

    storeMockup('laptop-screen', svg, 1440, 900);
    return mockup;
}

// ============================================
// NEW MOCKUPS - STOREFRONT SIGN
// ============================================

/**
 * Generate Storefront Sign mockup SVG
 */
export function generateStorefrontSignMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400" fill="none">
    <defs>
        <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
            <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <filter id="sign-shadow" x="-10%" y="-10%" width="120%" height="140%">
            <feDropShadow dx="0" dy="10" stdDeviation="15" flood-opacity="0.5"/>
        </filter>
        <linearGradient id="wall-texture" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#4a4a4a"/>
            <stop offset="100%" stop-color="#2d2d2d"/>
        </linearGradient>
        <linearGradient id="sign-face" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1a1a1a"/>
            <stop offset="100%" stop-color="#0d0d0d"/>
        </linearGradient>
    </defs>

    <!-- Wall background -->
    <rect width="1000" height="400" fill="url(#wall-texture)"/>

    <!-- Brick pattern -->
    <defs>
        <pattern id="bricks" patternUnits="userSpaceOnUse" width="100" height="50">
            <rect width="100" height="50" fill="none"/>
            <line x1="0" y1="25" x2="100" y2="25" stroke="#555" stroke-width="2"/>
            <line x1="50" y1="0" x2="50" y2="25" stroke="#555" stroke-width="2"/>
            <line x1="0" y1="50" x2="0" y2="25" stroke="#555" stroke-width="2"/>
            <line x1="100" y1="50" x2="100" y2="25" stroke="#555" stroke-width="2"/>
        </pattern>
    </defs>
    <rect width="1000" height="400" fill="url(#bricks)" opacity="0.3"/>

    <!-- Sign box -->
    <g filter="url(#sign-shadow)">
        <rect x="100" y="80" width="800" height="200" rx="8" fill="url(#sign-face)"/>
        <rect x="100" y="80" width="800" height="200" rx="8" fill="none" stroke="#333" stroke-width="3"/>
    </g>

    <!-- Neon glow effect background -->
    <rect x="120" y="100" width="760" height="160" rx="4" fill="${colors.primary}" opacity="0.1" filter="url(#neon-glow)"/>

    <!-- Logo (with glow) -->
    <g transform="translate(160, 130)" filter="url(#neon-glow)">
        <svg width="100" height="100" viewBox="0 0 100 100">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>

    <!-- Brand name (neon style) -->
    <text x="300" y="200" font-family="${fontFamily}" font-size="64" font-weight="800" fill="${colors.primary}" filter="url(#neon-glow)">${escapeXml(brand.name)}</text>

    <!-- Awning suggestion at top -->
    <path d="M50 70 L950 70 L930 80 L70 80 Z" fill="#333"/>

    <!-- Light fixtures -->
    <circle cx="200" cy="50" r="10" fill="#ffeb3b" opacity="0.8"/>
    <circle cx="800" cy="50" r="10" fill="#ffeb3b" opacity="0.8"/>
</svg>`;

    const mockup = {
        type: 'storefront-sign' as MockupExportType,
        filename: 'mockup-storefront-sign.svg',
        svg,
        width: 1000,
        height: 400,
    };

    storeMockup('storefront-sign', svg, 1000, 400);
    return mockup;
}

// ============================================
// NEW MOCKUPS - PACKAGING BOX
// ============================================

/**
 * Generate Packaging Box mockup SVG
 */
export function generatePackagingBoxMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" fill="none">
    <defs>
        <filter id="box-shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="30" stdDeviation="40" flood-opacity="0.35"/>
        </filter>
        <linearGradient id="box-front" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors.primary}"/>
            <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0.85"/>
        </linearGradient>
        <linearGradient id="box-side" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0.4"/>
        </linearGradient>
        <linearGradient id="box-top" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.9"/>
            <stop offset="100%" stop-color="${colors.primary}"/>
        </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="800" height="800" fill="#f0f0f0"/>

    <!-- 3D Box -->
    <g filter="url(#box-shadow)">
        <!-- Front face -->
        <path d="M150 250 L550 250 L550 650 L150 650 Z" fill="url(#box-front)"/>

        <!-- Right side face -->
        <path d="M550 250 L700 150 L700 550 L550 650 Z" fill="url(#box-side)"/>

        <!-- Top face -->
        <path d="M150 250 L300 150 L700 150 L550 250 Z" fill="url(#box-top)"/>

        <!-- Edge lines -->
        <path d="M150 250 L550 250 L700 150 M550 250 L550 650" stroke="${colors.primary}" stroke-width="2" fill="none" opacity="0.3"/>
    </g>

    <!-- Logo on front (white) -->
    <g transform="translate(250, 350)">
        <svg width="150" height="150" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>

    <!-- Brand name on front -->
    <text x="350" y="580" font-family="${fontFamily}" font-size="36" font-weight="700" fill="${colors.bg}" text-anchor="middle">${escapeXml(brand.name)}</text>

    <!-- Subtle pattern on front -->
    <defs>
        <pattern id="box-pattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <circle cx="10" cy="10" r="1" fill="${colors.bg}" opacity="0.1"/>
        </pattern>
    </defs>
    <path d="M150 250 L550 250 L550 650 L150 650 Z" fill="url(#box-pattern)"/>
</svg>`;

    const mockup = {
        type: 'packaging-box' as MockupExportType,
        filename: 'mockup-packaging-box.svg',
        svg,
        width: 800,
        height: 800,
    };

    storeMockup('packaging-box', svg, 800, 800);
    return mockup;
}

// ============================================
// NEW MOCKUPS - HOODIE
// ============================================

/**
 * Generate Hoodie mockup SVG
 */
export function generateHoodieMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 900" fill="none">
    <defs>
        <filter id="hoodie-shadow" x="-10%" y="-5%" width="120%" height="115%">
            <feDropShadow dx="0" dy="20" stdDeviation="30" flood-opacity="0.25"/>
        </filter>
        <linearGradient id="hoodie-fabric" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#2d2d2d"/>
            <stop offset="50%" stop-color="#1a1a1a"/>
            <stop offset="100%" stop-color="#0d0d0d"/>
        </linearGradient>
        <linearGradient id="hoodie-shadow-inner" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#000" stop-opacity="0.2"/>
            <stop offset="50%" stop-color="#000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0.2"/>
        </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="800" height="900" fill="#f8f8f8"/>

    <!-- Hoodie -->
    <g filter="url(#hoodie-shadow)">
        <!-- Main body -->
        <path d="M180 350 Q180 280 250 250 L280 200 Q320 150 400 150 Q480 150 520 200 L550 250 Q620 280 620 350 L620 800 Q620 820 600 820 L200 820 Q180 820 180 800 Z" fill="url(#hoodie-fabric)"/>

        <!-- Hood -->
        <path d="M250 250 Q250 180 320 150 L400 120 L480 150 Q550 180 550 250 L520 200 Q480 150 400 150 Q320 150 280 200 Z" fill="#1a1a1a"/>
        <ellipse cx="400" cy="150" rx="60" ry="30" fill="#0a0a0a"/>

        <!-- Left sleeve -->
        <path d="M180 350 L80 450 Q60 470 70 490 L100 580 Q110 600 130 590 L180 500" fill="url(#hoodie-fabric)"/>

        <!-- Right sleeve -->
        <path d="M620 350 L720 450 Q740 470 730 490 L700 580 Q690 600 670 590 L620 500" fill="url(#hoodie-fabric)"/>

        <!-- Pocket -->
        <path d="M250 550 Q250 520 290 520 L510 520 Q550 520 550 550 L550 650 Q550 680 510 680 L290 680 Q250 680 250 650 Z" fill="#151515" opacity="0.5"/>

        <!-- Center pocket line -->
        <line x1="400" y1="520" x2="400" y2="680" stroke="#0a0a0a" stroke-width="2"/>

        <!-- Drawstrings -->
        <path d="M350 250 L350 320" stroke="#666" stroke-width="3" stroke-linecap="round"/>
        <path d="M450 250 L450 320" stroke="#666" stroke-width="3" stroke-linecap="round"/>
        <circle cx="350" cy="320" r="6" fill="#888"/>
        <circle cx="450" cy="320" r="6" fill="#888"/>
    </g>

    <!-- Inner shadow for depth -->
    <path d="M180 350 Q180 280 250 250 L550 250 Q620 280 620 350 L620 800 Q620 820 600 820 L200 820 Q180 820 180 800 Z" fill="url(#hoodie-shadow-inner)"/>

    <!-- Logo on chest (white/light) -->
    <g transform="translate(320, 380)">
        <svg width="160" height="160" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>
</svg>`;

    const mockup = {
        type: 'hoodie' as MockupExportType,
        filename: 'mockup-hoodie.svg',
        svg,
        width: 800,
        height: 900,
    };

    storeMockup('hoodie', svg, 800, 900);
    return mockup;
}

// ============================================
// NEW MOCKUPS - TOTE BAG
// ============================================

/**
 * Generate Tote Bag mockup SVG
 */
export function generateToteBagMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 800" fill="none">
    <defs>
        <filter id="tote-shadow" x="-15%" y="-5%" width="130%" height="120%">
            <feDropShadow dx="0" dy="25" stdDeviation="35" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="canvas-texture" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f5f0e8"/>
            <stop offset="50%" stop-color="#ebe6de"/>
            <stop offset="100%" stop-color="#e0dbd3"/>
        </linearGradient>
        <pattern id="canvas-weave" patternUnits="userSpaceOnUse" width="4" height="4">
            <rect width="4" height="4" fill="#ebe6de"/>
            <rect width="2" height="2" fill="#e5e0d8"/>
            <rect x="2" y="2" width="2" height="2" fill="#e5e0d8"/>
        </pattern>
    </defs>

    <!-- Background -->
    <rect width="700" height="800" fill="#e8e8e8"/>

    <!-- Tote bag -->
    <g filter="url(#tote-shadow)">
        <!-- Handles -->
        <path d="M200 100 Q200 50 250 50 L280 50 Q300 50 300 80 L300 200" stroke="#c4b9a8" stroke-width="25" fill="none" stroke-linecap="round"/>
        <path d="M500 100 Q500 50 450 50 L420 50 Q400 50 400 80 L400 200" stroke="#c4b9a8" stroke-width="25" fill="none" stroke-linecap="round"/>

        <!-- Inner handle shadows -->
        <path d="M200 100 Q200 50 250 50 L280 50 Q300 50 300 80 L300 200" stroke="#b0a595" stroke-width="20" fill="none" stroke-linecap="round"/>
        <path d="M500 100 Q500 50 450 50 L420 50 Q400 50 400 80 L400 200" stroke="#b0a595" stroke-width="20" fill="none" stroke-linecap="round"/>

        <!-- Bag body -->
        <path d="M100 200 L120 700 Q125 740 170 740 L530 740 Q575 740 580 700 L600 200 Q600 180 580 180 L120 180 Q100 180 100 200 Z" fill="url(#canvas-texture)"/>

        <!-- Canvas weave overlay -->
        <path d="M100 200 L120 700 Q125 740 170 740 L530 740 Q575 740 580 700 L600 200 Q600 180 580 180 L120 180 Q100 180 100 200 Z" fill="url(#canvas-weave)" opacity="0.5"/>

        <!-- Top seam -->
        <line x1="100" y1="200" x2="600" y2="200" stroke="#c4b9a8" stroke-width="3"/>

        <!-- Side seams -->
        <line x1="120" y1="210" x2="135" y2="700" stroke="#d4c9b8" stroke-width="2" opacity="0.5"/>
        <line x1="580" y1="210" x2="565" y2="700" stroke="#d4c9b8" stroke-width="2" opacity="0.5"/>
    </g>

    <!-- Logo in center -->
    <g transform="translate(250, 350)">
        <svg width="200" height="200" viewBox="0 0 100 100">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>

    <!-- Brand name below logo -->
    <text x="350" y="620" font-family="${brand.font.headingName || 'Arial, sans-serif'}" font-size="28" font-weight="600" fill="${colors.text}" text-anchor="middle" opacity="0.8">${escapeXml(brand.name)}</text>
</svg>`;

    const mockup = {
        type: 'tote-bag' as MockupExportType,
        filename: 'mockup-tote-bag.svg',
        svg,
        width: 700,
        height: 800,
    };

    storeMockup('tote-bag', svg, 700, 800);
    return mockup;
}

// ============================================
// NEW MOCKUPS - COFFEE CUP
// ============================================

/**
 * Generate Coffee Cup mockup SVG
 */
export function generateCoffeeCupMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" fill="none">
    <defs>
        <filter id="cup-shadow" x="-20%" y="-10%" width="140%" height="130%">
            <feDropShadow dx="0" dy="20" stdDeviation="30" flood-opacity="0.3"/>
        </filter>
        <linearGradient id="ceramic" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="30%" stop-color="#f8f8f8"/>
            <stop offset="70%" stop-color="#f0f0f0"/>
            <stop offset="100%" stop-color="#e8e8e8"/>
        </linearGradient>
        <linearGradient id="coffee" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#3d2314"/>
            <stop offset="100%" stop-color="#2a1810"/>
        </linearGradient>
        <ellipse id="cup-top" cx="300" cy="150" rx="140" ry="30"/>
    </defs>

    <!-- Background -->
    <rect width="600" height="600" fill="#f5f5f5"/>

    <!-- Cup with shadow -->
    <g filter="url(#cup-shadow)">
        <!-- Cup body -->
        <path d="M160 150 Q155 400 180 450 Q200 480 300 480 Q400 480 420 450 Q445 400 440 150" fill="url(#ceramic)"/>

        <!-- Inner coffee surface -->
        <ellipse cx="300" cy="165" rx="125" ry="25" fill="url(#coffee)"/>

        <!-- Coffee highlight -->
        <ellipse cx="280" cy="160" rx="40" ry="8" fill="#4a3020" opacity="0.5"/>

        <!-- Rim -->
        <ellipse cx="300" cy="150" rx="140" ry="30" fill="none" stroke="#e0e0e0" stroke-width="8"/>
        <ellipse cx="300" cy="150" rx="140" ry="30" fill="none" stroke="#f5f5f5" stroke-width="4"/>

        <!-- Handle -->
        <path d="M440 200 Q520 200 520 300 Q520 400 440 400" stroke="url(#ceramic)" stroke-width="30" fill="none" stroke-linecap="round"/>
        <path d="M440 200 Q510 200 510 300 Q510 400 440 400" stroke="#e8e8e8" stroke-width="20" fill="none" stroke-linecap="round"/>

        <!-- Steam -->
        <path d="M250 100 Q240 70 260 50" stroke="#ccc" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M300 90 Q290 60 310 35" stroke="#ccc" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
        <path d="M350 100 Q340 70 360 50" stroke="#ccc" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.5"/>
    </g>

    <!-- Logo on cup -->
    <g transform="translate(220, 250)">
        <svg width="160" height="160" viewBox="0 0 100 100">
            ${getEmbeddedLogo(brand)}
        </svg>
    </g>

    <!-- Reflection highlight -->
    <path d="M180 200 Q175 300 195 380" stroke="white" stroke-width="20" fill="none" opacity="0.3" stroke-linecap="round"/>
</svg>`;

    const mockup = {
        type: 'coffee-cup' as MockupExportType,
        filename: 'mockup-coffee-cup.svg',
        svg,
        width: 600,
        height: 600,
    };

    storeMockup('coffee-cup', svg, 600, 600);
    return mockup;
}

// ============================================
// NEW MOCKUPS - PHONE SCREEN
// ============================================

/**
 * Generate Phone Screen (App UI) mockup SVG
 */
export function generatePhoneScreenMockup(brand: BrandIdentity): MockupExport {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 844" fill="none">
    <defs>
        <filter id="phone-glow" x="-20%" y="-10%" width="140%" height="120%">
            <feDropShadow dx="0" dy="15" stdDeviation="25" flood-opacity="0.4"/>
        </filter>
        <clipPath id="screen-round">
            <rect x="15" y="15" width="360" height="814" rx="40"/>
        </clipPath>
    </defs>

    <!-- Phone frame -->
    <g filter="url(#phone-glow)">
        <rect width="390" height="844" rx="50" fill="#1a1a1a"/>
        <rect x="3" y="3" width="384" height="838" rx="48" fill="#2a2a2a"/>
    </g>

    <!-- Screen content -->
    <g clip-path="url(#screen-round)">
        <!-- App background -->
        <rect x="15" y="15" width="360" height="814" fill="${colors.bg}"/>

        <!-- Status bar -->
        <rect x="15" y="15" width="360" height="50" fill="${colors.bg}"/>
        <text x="35" y="42" font-family="system-ui" font-size="14" font-weight="600" fill="${colors.text}">9:41</text>
        <text x="340" y="42" font-family="system-ui" font-size="14" fill="${colors.text}" text-anchor="end">100%</text>

        <!-- Dynamic Island -->
        <rect x="125" y="20" width="140" height="35" rx="17" fill="#000"/>

        <!-- App header -->
        <rect x="15" y="65" width="360" height="60" fill="${colors.surface}"/>
        <svg x="25" y="77" width="36" height="36" viewBox="0 0 100 100">
            ${getEmbeddedLogo(brand)}
        </svg>
        <text x="75" y="102" font-family="${fontFamily}" font-size="18" font-weight="600" fill="${colors.text}">${escapeXml(brand.name)}</text>

        <!-- App content - Cards -->
        <rect x="30" y="145" width="330" height="120" rx="12" fill="${colors.surface}"/>
        <text x="50" y="180" font-family="${fontFamily}" font-size="16" font-weight="600" fill="${colors.text}">Welcome back!</text>
        <text x="50" y="210" font-family="${fontFamily}" font-size="14" fill="${colors.muted}">Here's what's new today</text>
        <rect x="50" y="230" width="100" height="24" rx="6" fill="${colors.primary}"/>
        <text x="75" y="247" font-family="${fontFamily}" font-size="11" font-weight="500" fill="${colors.bg}">Explore</text>

        <rect x="30" y="285" width="330" height="80" rx="12" fill="${colors.surface}"/>
        <rect x="30" y="385" width="330" height="80" rx="12" fill="${colors.surface}"/>
        <rect x="30" y="485" width="330" height="80" rx="12" fill="${colors.surface}"/>

        <!-- Bottom nav -->
        <rect x="15" y="749" width="360" height="80" fill="${colors.surface}"/>
        <circle cx="75" cy="779" r="20" fill="${colors.primary}" opacity="0.1"/>
        <text x="75" y="785" font-family="system-ui" font-size="20" fill="${colors.primary}" text-anchor="middle">🏠</text>
        <text x="155" y="785" font-family="system-ui" font-size="20" fill="${colors.muted}" text-anchor="middle">🔍</text>
        <text x="235" y="785" font-family="system-ui" font-size="20" fill="${colors.muted}" text-anchor="middle">❤️</text>
        <text x="315" y="785" font-family="system-ui" font-size="20" fill="${colors.muted}" text-anchor="middle">👤</text>

        <!-- Home indicator -->
        <rect x="145" y="815" width="100" height="5" rx="2.5" fill="${colors.text}" opacity="0.3"/>
    </g>
</svg>`;

    const mockup = {
        type: 'phone-screen' as MockupExportType,
        filename: 'mockup-phone-screen.svg',
        svg,
        width: 390,
        height: 844,
    };

    storeMockup('phone-screen', svg, 390, 844);
    return mockup;
}

// ============================================
// EXPORT ALL MOCKUPS
// ============================================

/**
 * Generate all mockups for export
 */
export function generateAllMockups(brand: BrandIdentity): MockupExport[] {
    logMockup('Generating all mockups', { brandName: brand.name });

    const mockups = [
        generateBusinessCardMockup(brand),
        generateLinkedInBannerMockup(brand),
        generateWebsiteHeaderMockup(brand),
        generateMobileAppMockup(brand),
        generatePosterMockup(brand),
        generateLetterheadMockup(brand),
        generateBillboardMockup(brand),
        generateLaptopScreenMockup(brand),
        generateStorefrontSignMockup(brand),
        generatePackagingBoxMockup(brand),
        generateHoodieMockup(brand),
        generateToteBagMockup(brand),
        generateCoffeeCupMockup(brand),
        generatePhoneScreenMockup(brand),
    ];

    logMockup('All mockups generated', { count: mockups.length });
    return mockups;
}

/**
 * Get a specific mockup for export
 */
export function getMockupForExport(brand: BrandIdentity, type: MockupExportType): MockupExport {
    logMockup('Getting mockup for export', { type, brandName: brand.name });

    switch (type) {
        case 'business-card':
            return generateBusinessCardMockup(brand);
        case 'linkedin-banner':
            return generateLinkedInBannerMockup(brand);
        case 'website-header':
            return generateWebsiteHeaderMockup(brand);
        case 'mobile-app':
            return generateMobileAppMockup(brand);
        case 'poster':
            return generatePosterMockup(brand);
        case 'letterhead':
            return generateLetterheadMockup(brand);
        case 'billboard':
            return generateBillboardMockup(brand);
        case 'laptop-screen':
            return generateLaptopScreenMockup(brand);
        case 'storefront-sign':
            return generateStorefrontSignMockup(brand);
        case 'packaging-box':
            return generatePackagingBoxMockup(brand);
        case 'hoodie':
            return generateHoodieMockup(brand);
        case 'tote-bag':
            return generateToteBagMockup(brand);
        case 'coffee-cup':
            return generateCoffeeCupMockup(brand);
        case 'phone-screen':
            return generatePhoneScreenMockup(brand);
        default:
            return generateBusinessCardMockup(brand);
    }
}
