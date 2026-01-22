/**
 * Logo Variations Generator
 *
 * Generates all 6 standard logo variations from a base logo:
 * 1. Horizontal lockup (icon left, wordmark right)
 * 2. Stacked lockup (icon top, wordmark below)
 * 3. Icon only (symbol without text)
 * 4. Wordmark only (text without symbol)
 * 5. Dark version (for light backgrounds)
 * 6. Light version (for dark backgrounds)
 */

import {
    LogoVariationType,
    LogoVariation,
    LogoVariations,
    GeneratedLogo,
} from '../types';
import { BrandIdentity } from '@/lib/data';

// ============================================
// CORE GENERATION FUNCTIONS
// ============================================

/**
 * Extract viewBox dimensions from SVG string
 */
function getViewBoxDimensions(svg: string): { minX: number; minY: number; width: number; height: number } {
    const match = svg.match(/viewBox="([^"]+)"/);
    if (match) {
        const [minX, minY, width, height] = match[1].split(' ').map(Number);
        return { minX, minY, width, height };
    }
    return { minX: 0, minY: 0, width: 100, height: 100 };
}

/**
 * Extract inner content from SVG (removes outer svg tags)
 */
function extractSVGContent(svg: string): string {
    return svg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();
}

/**
 * Generate horizontal lockup variation (icon left, wordmark right)
 */
function generateHorizontalLockup(
    baseSvg: string,
    brandName: string,
    fontFamily: string,
    primaryColor: string,
    textColor: string
): LogoVariation {
    const { width, height } = getViewBoxDimensions(baseSvg);
    const innerContent = extractSVGContent(baseSvg);

    const iconSize = 48;
    const gap = 16;
    const fontSize = 28;
    const textWidth = brandName.length * fontSize * 0.65;
    const totalWidth = iconSize + gap + textWidth + 20;
    const totalHeight = Math.max(iconSize, 48);

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
    <!-- Logo Icon -->
    <svg x="0" y="${(totalHeight - iconSize) / 2}" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${width} ${height}">
        ${innerContent}
    </svg>
    <!-- Brand Name -->
    <text x="${iconSize + gap}" y="${totalHeight / 2 + fontSize / 3}" font-family="${fontFamily}, system-ui, sans-serif" font-size="${fontSize}" font-weight="700" fill="${textColor}">
        ${brandName}
    </text>
</svg>`;

    return {
        type: 'horizontal',
        svg,
        viewBox: `0 0 ${totalWidth} ${totalHeight}`,
        description: 'Horizontal lockup with icon left and wordmark right',
        recommended: 'Best for website headers, business cards, and wide format applications',
    };
}

/**
 * Generate stacked lockup variation (icon top, wordmark below)
 */
function generateStackedLockup(
    baseSvg: string,
    brandName: string,
    fontFamily: string,
    primaryColor: string,
    textColor: string
): LogoVariation {
    const { width, height } = getViewBoxDimensions(baseSvg);
    const innerContent = extractSVGContent(baseSvg);

    const iconSize = 64;
    const gap = 12;
    const fontSize = 24;
    const textWidth = brandName.length * fontSize * 0.65;
    const totalWidth = Math.max(iconSize, textWidth) + 24;
    const totalHeight = iconSize + gap + fontSize + 16;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
    <!-- Logo Icon (centered) -->
    <svg x="${(totalWidth - iconSize) / 2}" y="0" width="${iconSize}" height="${iconSize}" viewBox="0 0 ${width} ${height}">
        ${innerContent}
    </svg>
    <!-- Brand Name (centered) -->
    <text x="${totalWidth / 2}" y="${iconSize + gap + fontSize}" font-family="${fontFamily}, system-ui, sans-serif" font-size="${fontSize}" font-weight="700" fill="${textColor}" text-anchor="middle">
        ${brandName}
    </text>
</svg>`;

    return {
        type: 'stacked',
        svg,
        viewBox: `0 0 ${totalWidth} ${totalHeight}`,
        description: 'Stacked lockup with icon on top and wordmark below',
        recommended: 'Best for social media profiles, app icons with text, and square format applications',
    };
}

/**
 * Generate icon-only variation (symbol without text)
 */
function generateIconOnly(baseSvg: string): LogoVariation {
    const { width, height } = getViewBoxDimensions(baseSvg);

    return {
        type: 'icon-only',
        svg: baseSvg,
        viewBox: `0 0 ${width} ${height}`,
        description: 'Icon only - symbol without text',
        recommended: 'Best for favicons, app icons, small spaces, and social media avatars',
    };
}

/**
 * Generate wordmark-only variation (text without symbol)
 */
function generateWordmarkOnly(
    brandName: string,
    fontFamily: string,
    primaryColor: string
): LogoVariation {
    const fontSize = 36;
    const textWidth = brandName.length * fontSize * 0.65;
    const totalWidth = textWidth + 20;
    const totalHeight = fontSize + 20;

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
    <text x="${totalWidth / 2}" y="${totalHeight / 2 + fontSize / 3}" font-family="${fontFamily}, system-ui, sans-serif" font-size="${fontSize}" font-weight="700" fill="${primaryColor}" text-anchor="middle">
        ${brandName}
    </text>
</svg>`;

    return {
        type: 'wordmark-only',
        svg,
        viewBox: `0 0 ${totalWidth} ${totalHeight}`,
        description: 'Wordmark only - text without symbol',
        recommended: 'Best for co-branding, text-heavy contexts, and when symbol is already visible',
    };
}

/**
 * Generate dark version (for light backgrounds)
 * Converts logo to dark/black colors
 */
function generateDarkVersion(baseSvg: string): LogoVariation {
    const { width, height } = getViewBoxDimensions(baseSvg);
    let darkSvg = baseSvg;

    // Replace all fills with dark colors (except none, transparent, url)
    darkSvg = darkSvg.replace(
        /fill="(?!none|transparent|url)([^"]+)"/gi,
        'fill="#000000"'
    );

    // Replace all strokes with dark colors
    darkSvg = darkSvg.replace(
        /stroke="(?!none|transparent|url)([^"]+)"/gi,
        'stroke="#000000"'
    );

    // Handle stop-color in gradients
    darkSvg = darkSvg.replace(
        /stop-color="(?!none|transparent)([^"]+)"/gi,
        'stop-color="#000000"'
    );

    // Handle inline styles
    darkSvg = darkSvg.replace(
        /fill:\s*(?!none|transparent|url)[^;"}]+/gi,
        'fill: #000000'
    );

    darkSvg = darkSvg.replace(
        /stroke:\s*(?!none|transparent|url)[^;"}]+/gi,
        'stroke: #000000'
    );

    return {
        type: 'dark',
        svg: darkSvg,
        viewBox: `0 0 ${width} ${height}`,
        description: 'Dark version - black/dark logo for light backgrounds',
        recommended: 'Use on white or light-colored backgrounds',
    };
}

/**
 * Generate light version (for dark backgrounds)
 * Converts logo to light/white colors
 */
function generateLightVersion(baseSvg: string): LogoVariation {
    const { width, height } = getViewBoxDimensions(baseSvg);
    let lightSvg = baseSvg;

    // Replace all fills with white (except none, transparent, url)
    lightSvg = lightSvg.replace(
        /fill="(?!none|transparent|url)([^"]+)"/gi,
        'fill="#FFFFFF"'
    );

    // Replace all strokes with white
    lightSvg = lightSvg.replace(
        /stroke="(?!none|transparent|url)([^"]+)"/gi,
        'stroke="#FFFFFF"'
    );

    // Handle stop-color in gradients
    lightSvg = lightSvg.replace(
        /stop-color="(?!none|transparent)([^"]+)"/gi,
        'stop-color="#FFFFFF"'
    );

    // Handle inline styles
    lightSvg = lightSvg.replace(
        /fill:\s*(?!none|transparent|url)[^;"}]+/gi,
        'fill: #FFFFFF'
    );

    lightSvg = lightSvg.replace(
        /stroke:\s*(?!none|transparent|url)[^;"}]+/gi,
        'stroke: #FFFFFF'
    );

    return {
        type: 'light',
        svg: lightSvg,
        viewBox: `0 0 ${width} ${height}`,
        description: 'Light version - white/light logo for dark backgrounds',
        recommended: 'Use on black, dark, or colored backgrounds',
    };
}

// ============================================
// MAIN GENERATOR FUNCTION
// ============================================

/**
 * Generate all 6 logo variations from a base logo and brand identity
 */
export function generateLogoVariations(
    logo: GeneratedLogo,
    brand: BrandIdentity
): LogoVariations {
    const baseSvg = logo.svg;
    const brandName = brand.name;
    const fontFamily = brand.font.headingName || brand.font.heading || 'Inter';
    const primaryColor = brand.theme.tokens.light.primary;
    const textColor = brand.theme.tokens.light.text;

    return {
        horizontal: generateHorizontalLockup(baseSvg, brandName, fontFamily, primaryColor, textColor),
        stacked: generateStackedLockup(baseSvg, brandName, fontFamily, primaryColor, textColor),
        iconOnly: generateIconOnly(baseSvg),
        wordmarkOnly: generateWordmarkOnly(brandName, fontFamily, primaryColor),
        dark: generateDarkVersion(baseSvg),
        light: generateLightVersion(baseSvg),
    };
}

/**
 * Generate variations for all logos in an array
 */
export function generateAllLogoVariations(
    logos: GeneratedLogo[],
    brand: BrandIdentity
): GeneratedLogo[] {
    return logos.map(logo => ({
        ...logo,
        variations: generateLogoVariations(logo, brand),
    }));
}

/**
 * Get a specific variation type from a logo
 */
export function getLogoVariation(
    logo: GeneratedLogo & { variations?: LogoVariations },
    variationType: LogoVariationType
): LogoVariation | null {
    if (!logo.variations) return null;

    switch (variationType) {
        case 'horizontal':
            return logo.variations.horizontal;
        case 'stacked':
            return logo.variations.stacked;
        case 'icon-only':
            return logo.variations.iconOnly;
        case 'wordmark-only':
            return logo.variations.wordmarkOnly;
        case 'dark':
            return logo.variations.dark;
        case 'light':
            return logo.variations.light;
        default:
            return null;
    }
}

/**
 * Get all variation types as an array
 */
export const VARIATION_TYPES: LogoVariationType[] = [
    'horizontal',
    'stacked',
    'icon-only',
    'wordmark-only',
    'dark',
    'light',
];

/**
 * Variation metadata for UI display
 */
export const VARIATION_INFO: Record<LogoVariationType, {
    name: string;
    icon: string;
    description: string;
}> = {
    'horizontal': {
        name: 'Horizontal',
        icon: '↔️',
        description: 'Icon + text side by side',
    },
    'stacked': {
        name: 'Stacked',
        icon: '⬆️',
        description: 'Icon above text',
    },
    'icon-only': {
        name: 'Icon Only',
        icon: '🔷',
        description: 'Symbol without text',
    },
    'wordmark-only': {
        name: 'Wordmark',
        icon: '📝',
        description: 'Text without symbol',
    },
    'dark': {
        name: 'Dark',
        icon: '⬛',
        description: 'For light backgrounds',
    },
    'light': {
        name: 'Light',
        icon: '⬜',
        description: 'For dark backgrounds',
    },
};
