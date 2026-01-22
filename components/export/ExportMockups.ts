/**
 * Mockup Export Utilities
 *
 * Generates exportable mockup images using SVG templates.
 * Each mockup is self-contained and doesn't require external images.
 */

import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG } from '@/components/logo-engine/renderers/stored-logo-export';

// ============================================
// TYPES
// ============================================

export type MockupExportType =
    | 'business-card'
    | 'linkedin-banner'
    | 'website-header'
    | 'mobile-app'
    | 'poster'
    | 'letterhead';

export interface MockupExport {
    type: MockupExportType;
    filename: string;
    svg: string;
    width: number;
    height: number;
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
// EXPORT ALL MOCKUPS
// ============================================

/**
 * Generate all mockups for export
 */
export function generateAllMockups(brand: BrandIdentity): MockupExport[] {
    return [
        generateBusinessCardMockup(brand),
        generateLinkedInBannerMockup(brand),
        generateWebsiteHeaderMockup(brand),
        generateMobileAppMockup(brand),
        generatePosterMockup(brand),
        generateLetterheadMockup(brand),
    ];
}

/**
 * Get a specific mockup for export
 */
export function getMockupForExport(brand: BrandIdentity, type: MockupExportType): MockupExport {
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
        default:
            return generateBusinessCardMockup(brand);
    }
}
