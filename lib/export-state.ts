/**
 * Global Export State Store
 *
 * CRITICAL: This is the single source of truth for all exports.
 * When a logo renders in preview, store the exact SVG + brand data here.
 * All export functions MUST pull from this stored state—NEVER regenerate.
 *
 * Flow:
 * 1. Logo renders in preview → call setExportState()
 * 2. User clicks any export → call getExportState() + validate
 * 3. Export uses stored SVG, colors, fonts exactly as previewed
 */

import { BrandIdentity, GeneratedLogo } from '@/lib/data';

// ============================================
// EXPORT STATE INTERFACE
// ============================================

export interface ExportState {
    // Unique identifier for this export session
    id: string;
    timestamp: number;

    // Brand identification
    brandId: string;
    brandName: string;

    // STORED SVG - This is the EXACT SVG rendered in preview
    // NEVER regenerate - use this for ALL exports
    storedSvg: string;

    // Selected logo metadata
    selectedLogoIndex: number;
    selectedLogoId: string;
    algorithm: string;

    // Pre-generated variations (if available)
    variations: {
        horizontal?: string;
        stacked?: string;
        iconOnly?: string;
        wordmarkOnly?: string;
        dark?: string;
        light?: string;
    };

    // Stored brand data - use these exact values for exports
    colors: {
        light: {
            primary: string;
            accent?: string;
            bg: string;
            surface: string;
            text: string;
            muted?: string;
            border?: string;
        };
        dark?: {
            primary: string;
            accent?: string;
            bg: string;
            surface: string;
            text: string;
            muted?: string;
            border?: string;
        };
    };

    // Stored typography
    fonts: {
        heading: string;
        headingName: string;
        body: string;
        bodyName: string;
        mono?: string;
        monoName?: string;
    };

    // Full brand reference (for complex exports)
    brand: BrandIdentity;
}

// ============================================
// GLOBAL STATE STORE
// ============================================

let currentExportState: ExportState | null = null;

// Debug logging flag
const DEBUG_EXPORTS = true;

function logExport(action: string, data?: Record<string, unknown>) {
    if (DEBUG_EXPORTS) {
        console.log(`[Export] ${action}`, data ? data : '');
    }
}

// ============================================
// STATE MANAGEMENT FUNCTIONS
// ============================================

/**
 * Generate a unique export session ID
 */
function generateExportId(): string {
    return `export-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Set the export state when a logo renders in preview
 * Call this whenever the user sees a logo in the preview
 */
export function setExportState(
    brand: BrandIdentity,
    storedSvg: string,
    selectedLogo?: GeneratedLogo | null
): void {
    const exportId = generateExportId();

    currentExportState = {
        id: exportId,
        timestamp: Date.now(),

        // Brand identification
        brandId: brand.id,
        brandName: brand.name,

        // CRITICAL: Store exact SVG
        storedSvg: storedSvg,

        // Selected logo metadata
        selectedLogoIndex: brand.selectedLogoIndex ?? 0,
        selectedLogoId: selectedLogo?.id || `logo-${brand.selectedLogoIndex ?? 0}`,
        algorithm: selectedLogo?.algorithm || 'custom',

        // Store variations if available
        variations: {
            horizontal: (selectedLogo as any)?.variations?.horizontal?.svg,
            stacked: (selectedLogo as any)?.variations?.stacked?.svg,
            iconOnly: (selectedLogo as any)?.variations?.iconOnly?.svg || storedSvg,
            wordmarkOnly: (selectedLogo as any)?.variations?.wordmarkOnly?.svg,
            dark: (selectedLogo as any)?.variations?.dark?.svg,
            light: (selectedLogo as any)?.variations?.light?.svg,
        },

        // Store exact colors
        colors: {
            light: {
                primary: brand.theme.tokens.light.primary,
                accent: brand.theme.tokens.light.accent,
                bg: brand.theme.tokens.light.bg,
                surface: brand.theme.tokens.light.surface,
                text: brand.theme.tokens.light.text,
                muted: brand.theme.tokens.light.muted,
                border: brand.theme.tokens.light.border,
            },
            dark: brand.theme.tokens.dark ? {
                primary: brand.theme.tokens.dark.primary,
                accent: brand.theme.tokens.dark.accent,
                bg: brand.theme.tokens.dark.bg,
                surface: brand.theme.tokens.dark.surface,
                text: brand.theme.tokens.dark.text,
                muted: brand.theme.tokens.dark.muted,
                border: brand.theme.tokens.dark.border,
            } : undefined,
        },

        // Store exact fonts
        fonts: {
            heading: brand.font.heading,
            headingName: brand.font.headingName || brand.font.name,
            body: brand.font.body,
            bodyName: brand.font.bodyName || brand.font.name,
            mono: brand.font.mono,
            monoName: brand.font.monoName,
        },

        // Full brand reference
        brand: brand,
    };

    logExport('State set', {
        id: exportId,
        brandName: brand.name,
        brandId: brand.id,
        logoId: currentExportState.selectedLogoId,
        algorithm: currentExportState.algorithm,
        svgLength: storedSvg.length,
        hasVariations: Object.values(currentExportState.variations).some(v => !!v),
    });
}

/**
 * Get the current export state
 * Returns null if no state has been set
 */
export function getExportState(): ExportState | null {
    return currentExportState;
}

/**
 * Validate export state exists before any export
 * Throws if state is missing or stale
 */
export function validateExportState(maxAgeMs: number = 30 * 60 * 1000): ExportState {
    if (!currentExportState) {
        const error = new Error('Export state not set. Please ensure a logo is displayed before exporting.');
        logExport('VALIDATION FAILED - No state', { error: error.message });
        throw error;
    }

    const age = Date.now() - currentExportState.timestamp;
    if (age > maxAgeMs) {
        logExport('WARNING - Stale state', {
            ageMinutes: Math.round(age / 60000),
            maxAgeMinutes: Math.round(maxAgeMs / 60000),
        });
    }

    logExport('Exporting brand ID: ' + currentExportState.brandId, {
        exportId: currentExportState.id,
        brandName: currentExportState.brandName,
        logoId: currentExportState.selectedLogoId,
        algorithm: currentExportState.algorithm,
    });

    return currentExportState;
}

/**
 * Clear the export state (call on brand change or page navigation)
 */
export function clearExportState(): void {
    const oldId = currentExportState?.id;
    currentExportState = null;
    logExport('State cleared', { previousId: oldId });
}

/**
 * Check if export state is set and valid
 */
export function hasValidExportState(): boolean {
    return currentExportState !== null && !!currentExportState.storedSvg;
}

// ============================================
// EXPORT HELPER FUNCTIONS
// ============================================

/**
 * Get stored SVG for export - NEVER regenerates
 */
export function getStoredSvgForExport(variant: 'color' | 'black' | 'white' = 'color'): string {
    const state = validateExportState();

    if (variant === 'color') {
        logExport('Getting stored SVG (color)', { length: state.storedSvg.length });
        return state.storedSvg;
    }

    // For black/white variants, recolor the stored SVG
    const recolored = recolorStoredSvg(state.storedSvg, variant);
    logExport(`Getting stored SVG (${variant})`, { length: recolored.length });
    return recolored;
}

/**
 * Get stored variation SVG - uses pre-stored variations only
 */
export function getStoredVariation(
    type: 'horizontal' | 'stacked' | 'iconOnly' | 'wordmarkOnly' | 'dark' | 'light'
): string | null {
    const state = validateExportState();
    const svg = state.variations[type];

    logExport(`Getting stored variation: ${type}`, {
        found: !!svg,
        length: svg?.length
    });

    return svg || null;
}

/**
 * Get stored colors for export
 */
export function getStoredColors(): ExportState['colors'] {
    const state = validateExportState();
    logExport('Getting stored colors');
    return state.colors;
}

/**
 * Get stored fonts for export
 */
export function getStoredFonts(): ExportState['fonts'] {
    const state = validateExportState();
    logExport('Getting stored fonts');
    return state.fonts;
}

/**
 * Get full brand data for export
 */
export function getStoredBrand(): BrandIdentity {
    const state = validateExportState();
    logExport('Getting stored brand', { brandName: state.brandName });
    return state.brand;
}

// ============================================
// SVG MANIPULATION (on stored SVG only)
// ============================================

/**
 * Recolor stored SVG to black or white
 */
function recolorStoredSvg(svg: string, variant: 'black' | 'white'): string {
    const targetColor = variant === 'black' ? '#000000' : '#FFFFFF';

    let recolored = svg;

    // Replace fill colors (preserve 'none' and 'transparent')
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
        `stop-color="${targetColor}"`
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

/**
 * Generate wordmark SVG using stored SVG + stored brand data
 */
export function generateWordmarkFromStored(variant: 'color' | 'black' | 'white' = 'color'): string {
    const state = validateExportState();
    const logoSvg = variant === 'color' ? state.storedSvg : recolorStoredSvg(state.storedSvg, variant);

    // Extract viewBox from logo
    const viewBoxMatch = logoSvg.match(/viewBox="([^"]+)"/);
    const logoViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';

    // Calculate dimensions
    const iconSize = 40;
    const textX = iconSize + 16;
    const fontSize = 24;
    const textWidth = state.brandName.length * fontSize * 0.6;
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
            textColor = state.colors.light.text;
            break;
    }

    // Extract inner content
    const innerContent = logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();

    logExport('Generated wordmark from stored SVG', { variant });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
    <!-- Logo Icon -->
    <svg x="0" y="${(totalHeight - iconSize) / 2}" width="${iconSize}" height="${iconSize}" viewBox="${logoViewBox}">
        ${innerContent}
    </svg>
    <!-- Brand Name -->
    <text x="${textX}" y="${totalHeight / 2 + fontSize / 3}" font-family="${state.fonts.headingName}, system-ui, sans-serif" font-size="${fontSize}" font-weight="700" fill="${textColor}">
        ${state.brandName}
    </text>
</svg>`;
}

// ============================================
// ALL VARIATIONS EXPORT
// ============================================

/**
 * Get all logo variations for export - uses ONLY stored data
 */
export function getAllVariationsFromStored(): {
    horizontal: string | null;
    stacked: string | null;
    iconOnly: string | null;
    wordmarkOnly: string | null;
    dark: string | null;
    light: string | null;
} {
    const state = validateExportState();

    logExport('Getting all variations from stored state', {
        hasHorizontal: !!state.variations.horizontal,
        hasStacked: !!state.variations.stacked,
        hasIconOnly: !!state.variations.iconOnly,
        hasWordmarkOnly: !!state.variations.wordmarkOnly,
        hasDark: !!state.variations.dark,
        hasLight: !!state.variations.light,
    });

    return {
        // Use stored variations, or generate from stored SVG if missing
        horizontal: state.variations.horizontal || generateWordmarkFromStored('color'),
        stacked: state.variations.stacked || null,
        iconOnly: state.variations.iconOnly || state.storedSvg,
        wordmarkOnly: state.variations.wordmarkOnly || null,
        dark: state.variations.dark || recolorStoredSvg(state.storedSvg, 'black'),
        light: state.variations.light || recolorStoredSvg(state.storedSvg, 'white'),
    };
}

// ============================================
// EXPORT METADATA
// ============================================

/**
 * Get export metadata for logging/debugging
 */
export function getExportMetadata(): Record<string, unknown> | null {
    if (!currentExportState) return null;

    return {
        exportId: currentExportState.id,
        timestamp: new Date(currentExportState.timestamp).toISOString(),
        brandId: currentExportState.brandId,
        brandName: currentExportState.brandName,
        logoId: currentExportState.selectedLogoId,
        algorithm: currentExportState.algorithm,
        svgLength: currentExportState.storedSvg.length,
        variationsAvailable: Object.entries(currentExportState.variations)
            .filter(([_, v]) => !!v)
            .map(([k, _]) => k),
    };
}
