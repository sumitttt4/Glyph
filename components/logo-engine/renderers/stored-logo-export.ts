/**
 * Stored Logo Export Utilities
 *
 * CRITICAL: All exports must use the stored SVG from brand.generatedLogos[selectedLogoIndex].svg
 * Never regenerate logos - this ensures exports match the preview exactly.
 *
 * Supports 6 logo variations:
 * - Horizontal lockup (icon left, wordmark right)
 * - Stacked lockup (icon top, wordmark below)
 * - Icon only (symbol without text)
 * - Wordmark only (text without symbol)
 * - Dark version (for light backgrounds)
 * - Light version (for dark backgrounds)
 */

import { BrandIdentity, GeneratedLogo } from '@/lib/data';
import { generateComposedLogoSVG, SVGVariant } from '@/components/export/ExportSVG';
import { LogoVariationType, LogoVariations } from '@/components/logo-engine/types';

// ============================================
// CORE EXPORT FUNCTIONS
// ============================================

/**
 * Get the exact stored logo SVG - this is the ONLY function that should be used for exports
 *
 * Priority:
 * 1. Use stored SVG from generatedLogos[selectedLogoIndex] (premium logos)
 * 2. Fall back to legacy generateComposedLogoSVG only for old brands without generatedLogos
 */
export function getStoredLogoSVG(
    brand: BrandIdentity,
    variant: SVGVariant = 'color'
): string {
    // Check for premium generated logos first
    if (brand.generatedLogos && brand.generatedLogos.length > 0) {
        const selectedIndex = brand.selectedLogoIndex ?? 0;
        const selectedLogo = brand.generatedLogos[selectedIndex];

        if (selectedLogo?.svg) {
            // For color variant, return the exact stored SVG
            if (variant === 'color') {
                return selectedLogo.svg;
            }

            // For black/white variants, modify the stored SVG colors
            return recolorSVG(selectedLogo.svg, variant);
        }
    }

    // Fallback to legacy generation ONLY for old brands without generatedLogos
    return generateComposedLogoSVG(brand, variant);
}

/**
 * Get logo by specific ID (for tracking exact logo selection)
 */
export function getLogoById(brand: BrandIdentity, logoId: string): GeneratedLogo | null {
    return brand.generatedLogos?.find(l => l.id === logoId) ?? null;
}

/**
 * Get the currently selected logo object
 */
export function getSelectedLogo(brand: BrandIdentity): GeneratedLogo | null {
    if (!brand.generatedLogos?.length) return null;
    const selectedIndex = brand.selectedLogoIndex ?? 0;
    return brand.generatedLogos[selectedIndex] ?? null;
}

/**
 * Export SVG by logo ID (ensures exact logo is exported)
 */
export function exportSVGById(
    brand: BrandIdentity,
    logoId: string,
    variant: SVGVariant = 'color'
): string {
    const logo = getLogoById(brand, logoId);

    if (!logo) {
        throw new Error(`Logo with ID ${logoId} not found`);
    }

    if (variant === 'color') {
        return logo.svg;
    }

    return recolorSVG(logo.svg, variant);
}

// ============================================
// COLOR MANIPULATION
// ============================================

/**
 * Recolor an SVG to black or white while preserving structure
 */
export function recolorSVG(svg: string, variant: 'black' | 'white'): string {
    const targetColor = variant === 'black' ? '#000000' : '#FFFFFF';
    const secondaryColor = variant === 'black' ? '#333333' : '#CCCCCC';

    let recolored = svg;

    // Replace fill colors (hex, rgb, named colors)
    // Preserve 'none' and 'transparent'
    recolored = recolored.replace(
        /fill="(?!none|transparent|url)([^"]+)"/gi,
        `fill="${targetColor}"`
    );

    // Replace stroke colors
    recolored = recolored.replace(
        /stroke="(?!none|transparent|url)([^"]+)"/gi,
        `stroke="${targetColor}"`
    );

    // Handle stop-color in gradients
    recolored = recolored.replace(
        /stop-color="(?!none|transparent)([^"]+)"/gi,
        (match, color, offset) => {
            // Alternate between primary and secondary for gradient effect
            return `stop-color="${targetColor}"`;
        }
    );

    // Handle inline styles
    recolored = recolored.replace(
        /fill:\s*(?!none|transparent|url)[^;"}]+/gi,
        `fill: ${targetColor}`
    );

    recolored = recolored.replace(
        /stroke:\s*(?!none|transparent|url)[^;"}]+/gi,
        `stroke: ${targetColor}`
    );

    return recolored;
}

// ============================================
// DARK/LIGHT VARIANTS
// ============================================

/**
 * Generate dark and light mode variants of the logo
 */
export function generateDarkLightVariants(brand: BrandIdentity): {
    light: string;
    dark: string;
} {
    const storedSvg = getStoredLogoSVG(brand, 'color');

    return {
        light: storedSvg,
        dark: invertColorsForDarkMode(storedSvg, brand)
    };
}

/**
 * Invert/adjust colors for dark mode background
 */
export function invertColorsForDarkMode(svg: string, brand: BrandIdentity): string {
    // Get theme colors for intelligent inversion
    const lightPrimary = brand.theme.tokens.light.primary;
    const darkPrimary = brand.theme.tokens.dark?.primary || lightenColor(lightPrimary, 20);

    let darkSvg = svg;

    // Replace light mode primary with dark mode primary
    darkSvg = darkSvg.replace(
        new RegExp(escapeRegex(lightPrimary), 'gi'),
        darkPrimary
    );

    // Handle white backgrounds - make them transparent or dark
    darkSvg = darkSvg.replace(
        /fill="#[fF]{6}"/g,
        'fill="transparent"'
    );
    darkSvg = darkSvg.replace(
        /fill="white"/gi,
        'fill="transparent"'
    );
    darkSvg = darkSvg.replace(
        /fill="rgb\(255,\s*255,\s*255\)"/gi,
        'fill="transparent"'
    );

    // Lighten dark colors that might not be visible
    darkSvg = darkSvg.replace(
        /fill="#([0-3][0-9a-fA-F]{5})"/g,
        (match, hex) => `fill="${lightenColor('#' + hex, 40)}"`
    );

    return darkSvg;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Lighten a hex color by a percentage
 */
function lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

/**
 * Darken a hex color by a percentage
 */
function darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// ============================================
// WORDMARK GENERATION
// ============================================

/**
 * Generate wordmark SVG using stored logo + brand name
 */
export function generateStoredWordmarkSVG(
    brand: BrandIdentity,
    variant: SVGVariant = 'color'
): string {
    const logoSvg = getStoredLogoSVG(brand, variant);

    // Extract viewBox from logo
    const viewBoxMatch = logoSvg.match(/viewBox="([^"]+)"/);
    const logoViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';
    const [, , logoWidth, logoHeight] = logoViewBox.split(' ').map(Number);

    // Calculate dimensions
    const iconSize = 40;
    const textX = iconSize + 16;
    const fontSize = 24;
    const textWidth = brand.name.length * fontSize * 0.6; // Approximate
    const totalWidth = textX + textWidth + 16;
    const totalHeight = Math.max(iconSize, 40);

    // Determine text color
    let textColor: string;
    switch (variant) {
        case 'black':
            textColor = '#000000';
            break;
        case 'white':
            textColor = '#FFFFFF';
            break;
        default:
            textColor = brand.theme.tokens.light.text;
            break;
    }

    // Extract just the inner content of the logo SVG (without the outer svg tags)
    const innerContent = logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
    <!-- Logo Icon -->
    <svg x="0" y="${(totalHeight - iconSize) / 2}" width="${iconSize}" height="${iconSize}" viewBox="${logoViewBox}">
        ${innerContent}
    </svg>
    <!-- Brand Name -->
    <text x="${textX}" y="${totalHeight / 2 + fontSize / 3}" font-family="${brand.font.headingName || brand.font.heading}, system-ui, sans-serif" font-size="${fontSize}" font-weight="700" fill="${textColor}">
        ${brand.name}
    </text>
</svg>`;
}

// ============================================
// FAVICON GENERATION
// ============================================

/**
 * Generate favicon SVG from stored logo (simplified for small sizes)
 */
export function generateStoredFaviconSVG(brand: BrandIdentity): string {
    return getStoredLogoSVG(brand, 'color');
}

// ============================================
// LOGO VARIATIONS EXPORT
// ============================================

/**
 * Get all logo variations for export
 * Returns all 6 standard variations if available
 */
export function getLogoVariationsForExport(brand: BrandIdentity): {
    horizontal: string | null;
    stacked: string | null;
    iconOnly: string | null;
    wordmarkOnly: string | null;
    dark: string | null;
    light: string | null;
} {
    const selectedLogo = getSelectedLogo(brand);
    const variations = (selectedLogo as any)?.variations as LogoVariations | undefined;

    if (!variations) {
        // Fallback: generate basic variations from the base logo
        const baseSvg = getStoredLogoSVG(brand, 'color');
        return {
            horizontal: generateStoredWordmarkSVG(brand, 'color'),
            stacked: null, // Would need wordmark SVG generation with stacked layout
            iconOnly: baseSvg,
            wordmarkOnly: null, // Would need pure wordmark generation
            dark: recolorSVG(baseSvg, 'black'),
            light: recolorSVG(baseSvg, 'white'),
        };
    }

    return {
        horizontal: variations.horizontal?.svg || null,
        stacked: variations.stacked?.svg || null,
        iconOnly: variations.iconOnly?.svg || null,
        wordmarkOnly: variations.wordmarkOnly?.svg || null,
        dark: variations.dark?.svg || null,
        light: variations.light?.svg || null,
    };
}

/**
 * Get a specific variation SVG for export
 */
export function getLogoVariationSVG(
    brand: BrandIdentity,
    variationType: LogoVariationType
): string | null {
    const variations = getLogoVariationsForExport(brand);

    switch (variationType) {
        case 'horizontal':
            return variations.horizontal;
        case 'stacked':
            return variations.stacked;
        case 'icon-only':
            return variations.iconOnly;
        case 'wordmark-only':
            return variations.wordmarkOnly;
        case 'dark':
            return variations.dark;
        case 'light':
            return variations.light;
        default:
            return null;
    }
}

/**
 * Export all variations as a map of filename to SVG content
 */
export function exportAllVariations(brand: BrandIdentity): Map<string, string> {
    const variations = getLogoVariationsForExport(brand);
    const result = new Map<string, string>();

    if (variations.horizontal) {
        result.set('logo-horizontal.svg', variations.horizontal);
    }
    if (variations.stacked) {
        result.set('logo-stacked.svg', variations.stacked);
    }
    if (variations.iconOnly) {
        result.set('logo-icon-only.svg', variations.iconOnly);
    }
    if (variations.wordmarkOnly) {
        result.set('logo-wordmark-only.svg', variations.wordmarkOnly);
    }
    if (variations.dark) {
        result.set('logo-dark.svg', variations.dark);
    }
    if (variations.light) {
        result.set('logo-light.svg', variations.light);
    }

    return result;
}
