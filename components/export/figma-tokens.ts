/**
 * Figma Export Utilities
 * 
 * Generates Figma-ready exports:
 * - Figma Tokens plugin compatible JSON
 * - SVG with construction grids as separate vector groups
 * - Tailwind CSS config with brand colors
 * 
 * PRO FEATURE: Requires subscription for direct export
 */

import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG, getSelectedLogo } from '@/components/logo-engine/renderers/stored-logo-export';

// ============================================
// TYPES
// ============================================

export interface FigmaTokens {
    $themes: FigmaTheme[];
    $metadata: FigmaMetadata;
    [key: string]: FigmaTokenGroup | FigmaTheme[] | FigmaMetadata;
}

export interface FigmaTheme {
    id: string;
    name: string;
    selectedTokenSets: Record<string, 'enabled' | 'disabled'>;
}

export interface FigmaMetadata {
    tokenSetOrder: string[];
}

export interface FigmaTokenGroup {
    [key: string]: FigmaToken | FigmaTokenGroup;
}

export interface FigmaToken {
    value: string;
    type: 'color' | 'fontFamily' | 'fontSize' | 'fontWeight' | 'lineHeight' | 'spacing' | 'borderRadius' | 'dimension';
    description?: string;
}

export interface ConstructionGridSVGOptions {
    showGuidelines?: boolean;
    showGoldenRatio?: boolean;
    showSafeZones?: boolean;
    showMeasurements?: boolean;
}

// ============================================
// FIGMA TOKENS PLUGIN EXPORT
// ============================================

/**
 * Generate Figma Tokens plugin compatible JSON
 * Maps brand.colors and brand.typography to Figma Local Styles
 */
export function generateFigmaTokensJSON(brand: BrandIdentity): string {
    const lightTokens = brand.theme.tokens.light;
    const darkTokens = brand.theme.tokens.dark;

    // Create token structure following Figma Tokens plugin format
    const tokens: FigmaTokens = {
        $themes: [
            {
                id: 'light',
                name: 'Light Mode',
                selectedTokenSets: {
                    'brand/colors': 'enabled',
                    'brand/typography': 'enabled',
                    'brand/spacing': 'enabled',
                },
            },
            {
                id: 'dark',
                name: 'Dark Mode',
                selectedTokenSets: {
                    'brand/colors-dark': 'enabled',
                    'brand/typography': 'enabled',
                    'brand/spacing': 'enabled',
                },
            },
        ],
        $metadata: {
            tokenSetOrder: [
                'brand/colors',
                'brand/colors-dark',
                'brand/typography',
                'brand/spacing',
            ],
        },
        // Light mode colors
        'brand/colors': {
            brand: {
                primary: {
                    value: lightTokens.primary,
                    type: 'color',
                    description: 'Primary brand color for CTAs and key elements',
                },
                background: {
                    value: lightTokens.bg,
                    type: 'color',
                    description: 'Page background color',
                },
                surface: {
                    value: lightTokens.surface,
                    type: 'color',
                    description: 'Card and panel background color',
                },
                text: {
                    value: lightTokens.text,
                    type: 'color',
                    description: 'Primary text color',
                },
                muted: {
                    value: lightTokens.muted,
                    type: 'color',
                    description: 'Secondary/muted text color',
                },
                border: {
                    value: lightTokens.border,
                    type: 'color',
                    description: 'Border color for dividers and outlines',
                },
            },
            accent: {
                primary: {
                    value: lightTokens.accent || lightTokens.primary,
                    type: 'color',
                    description: 'Accent color for highlights',
                },
            },
        },
        // Dark mode colors
        'brand/colors-dark': {
            brand: {
                primary: {
                    value: darkTokens.primary,
                    type: 'color',
                    description: 'Primary brand color (dark mode)',
                },
                background: {
                    value: darkTokens.bg,
                    type: 'color',
                    description: 'Page background (dark mode)',
                },
                surface: {
                    value: darkTokens.surface,
                    type: 'color',
                    description: 'Card and panel background (dark mode)',
                },
                text: {
                    value: darkTokens.text,
                    type: 'color',
                    description: 'Primary text color (dark mode)',
                },
                muted: {
                    value: darkTokens.muted,
                    type: 'color',
                    description: 'Secondary text (dark mode)',
                },
                border: {
                    value: darkTokens.border,
                    type: 'color',
                    description: 'Border color (dark mode)',
                },
            },
        },
        // Typography
        'brand/typography': {
            font: {
                heading: {
                    family: {
                        value: brand.font.headingName || brand.font.heading || 'Inter',
                        type: 'fontFamily',
                        description: 'Heading font family',
                    },
                    weight: {
                        bold: { value: '700', type: 'fontWeight' },
                        medium: { value: '500', type: 'fontWeight' },
                    },
                },
                body: {
                    family: {
                        value: brand.font.bodyName || brand.font.body || 'Inter',
                        type: 'fontFamily',
                        description: 'Body font family',
                    },
                    weight: {
                        regular: { value: '400', type: 'fontWeight' },
                        medium: { value: '500', type: 'fontWeight' },
                    },
                },
                ...(brand.font.monoName ? {
                    mono: {
                        family: {
                            value: brand.font.monoName,
                            type: 'fontFamily',
                            description: 'Monospace font for code',
                        },
                    },
                } : {}),
            },
            // Type scale with golden ratio
            size: {
                xs: { value: '12px', type: 'fontSize' },
                sm: { value: '14px', type: 'fontSize' },
                base: { value: '16px', type: 'fontSize' },
                lg: { value: '18px', type: 'fontSize' },
                xl: { value: '20px', type: 'fontSize' },
                '2xl': { value: '24px', type: 'fontSize' },
                '3xl': { value: '30px', type: 'fontSize' },
                '4xl': { value: '36px', type: 'fontSize' },
                '5xl': { value: '48px', type: 'fontSize' },
                '6xl': { value: '60px', type: 'fontSize' },
            },
            lineHeight: {
                tight: { value: '1.25', type: 'lineHeight' },
                normal: { value: '1.5', type: 'lineHeight' },
                relaxed: { value: '1.75', type: 'lineHeight' },
            },
        },
        // Spacing scale
        'brand/spacing': {
            space: {
                '0': { value: '0', type: 'spacing' },
                '1': { value: '4px', type: 'spacing' },
                '2': { value: '8px', type: 'spacing' },
                '3': { value: '12px', type: 'spacing' },
                '4': { value: '16px', type: 'spacing' },
                '5': { value: '20px', type: 'spacing' },
                '6': { value: '24px', type: 'spacing' },
                '8': { value: '32px', type: 'spacing' },
                '10': { value: '40px', type: 'spacing' },
                '12': { value: '48px', type: 'spacing' },
                '16': { value: '64px', type: 'spacing' },
                '20': { value: '80px', type: 'spacing' },
                '24': { value: '96px', type: 'spacing' },
            },
            radius: {
                none: { value: '0', type: 'borderRadius' },
                sm: { value: '4px', type: 'borderRadius' },
                md: { value: '8px', type: 'borderRadius' },
                lg: { value: '12px', type: 'borderRadius' },
                xl: { value: '16px', type: 'borderRadius' },
                '2xl': { value: '24px', type: 'borderRadius' },
                full: { value: '9999px', type: 'borderRadius' },
            },
        },
    };

    return JSON.stringify(tokens, null, 2);
}

// ============================================
// SVG WITH CONSTRUCTION GRIDS
// ============================================

/**
 * Generate SVG with construction grid as separate vector groups
 * Suitable for direct paste into Figma
 */
export function generateSVGWithConstructionGrid(
    brand: BrandIdentity,
    options: ConstructionGridSVGOptions = {}
): string {
    const {
        showGuidelines = true,
        showGoldenRatio = true,
        showSafeZones = true,
        showMeasurements = true,
    } = options;

    const logoSvg = getStoredLogoSVG(brand, 'color');
    const PHI = 1.618033988749895;
    const viewBoxSize = 400;
    const center = viewBoxSize / 2;
    const gridSize = 40;

    // Golden ratio dimensions
    const goldenOuter = viewBoxSize * 0.38;
    const goldenInner = goldenOuter / PHI;
    const goldenInner2 = goldenInner / PHI;

    // Safe zones
    const safeZoneOuter = viewBoxSize * 0.85;
    const safeZoneInner = viewBoxSize * 0.15;
    const logoZone = viewBoxSize * 0.6;

    // Extract inner content from logo SVG
    const innerContent = logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();

    // Construction colors (professional blueprint style)
    const guideColor = '#6366f1'; // Indigo
    const accentColor = '#a855f7'; // Purple
    const gridColor = '#1e293b';
    const textColor = '#94a3b8';

    const gridPatterns = `
        <defs>
            <!-- Fine Grid Pattern -->
            <pattern id="fine-grid" width="${gridSize / 4}" height="${gridSize / 4}" patternUnits="userSpaceOnUse">
                <path d="M ${gridSize / 4} 0 L 0 0 0 ${gridSize / 4}" fill="none" stroke="${gridColor}" stroke-width="0.25" opacity="0.3"/>
            </pattern>
            <!-- Major Grid Pattern -->
            <pattern id="major-grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
                <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="${gridColor}" stroke-width="0.5" opacity="0.6"/>
            </pattern>
            <!-- Guide Gradient -->
            <linearGradient id="guide-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="${guideColor}" stop-opacity="0.8"/>
                <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.4"/>
            </linearGradient>
        </defs>`;

    const backgroundGroup = `
        <g id="background">
            <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="#0a0a0f"/>
        </g>`;

    const gridGroup = `
        <g id="construction-grid" opacity="1">
            <rect width="100%" height="100%" fill="url(#fine-grid)"/>
            <rect width="100%" height="100%" fill="url(#major-grid)"/>
        </g>`;

    const guidelinesGroup = showGuidelines ? `
        <g id="guidelines">
            <!-- Center Crosshairs -->
            <line x1="${center}" y1="0" x2="${center}" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.6"/>
            <line x1="0" y1="${center}" x2="${viewBoxSize}" y2="${center}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.6"/>
            <circle cx="${center}" cy="${center}" r="3" fill="${guideColor}" opacity="0.8"/>
            <circle cx="${center}" cy="${center}" r="6" fill="none" stroke="${guideColor}" stroke-width="0.5" opacity="0.4"/>
            
            <!-- Diagonal Guidelines -->
            <line x1="0" y1="0" x2="${viewBoxSize}" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="8 8" opacity="0.3"/>
            <line x1="${viewBoxSize}" y1="0" x2="0" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="8 8" opacity="0.3"/>
            
            <!-- Rule of Thirds -->
            <line x1="${viewBoxSize / 3}" y1="0" x2="${viewBoxSize / 3}" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" opacity="0.25"/>
            <line x1="${(viewBoxSize * 2) / 3}" y1="0" x2="${(viewBoxSize * 2) / 3}" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" opacity="0.25"/>
            <line x1="0" y1="${viewBoxSize / 3}" x2="${viewBoxSize}" y2="${viewBoxSize / 3}" stroke="${guideColor}" stroke-width="0.5" opacity="0.25"/>
            <line x1="0" y1="${(viewBoxSize * 2) / 3}" x2="${viewBoxSize}" y2="${(viewBoxSize * 2) / 3}" stroke="${guideColor}" stroke-width="0.5" opacity="0.25"/>
        </g>` : '';

    const goldenRatioGroup = showGoldenRatio ? `
        <g id="golden-ratio">
            <!-- Outer Golden Circle -->
            <circle cx="${center}" cy="${center}" r="${goldenOuter}" fill="none" stroke="url(#guide-gradient)" stroke-width="1" opacity="0.6"/>
            <!-- φ Division Circle -->
            <circle cx="${center}" cy="${center}" r="${goldenInner}" fill="none" stroke="${accentColor}" stroke-width="0.75" stroke-dasharray="2 4" opacity="0.5"/>
            <!-- φ² Division Circle -->
            <circle cx="${center}" cy="${center}" r="${goldenInner2}" fill="none" stroke="${accentColor}" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.4"/>
            <!-- Golden Spiral Approximation -->
            <path d="M ${center + goldenOuter} ${center} A ${goldenOuter} ${goldenOuter} 0 0 1 ${center} ${center + goldenOuter} A ${goldenInner} ${goldenInner} 0 0 1 ${center - goldenInner} ${center} A ${goldenInner2} ${goldenInner2} 0 0 1 ${center} ${center - goldenInner2}" fill="none" stroke="${guideColor}" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
        </g>` : '';

    const safeZonesGroup = showSafeZones ? `
        <g id="safe-zones">
            <!-- Outer Boundary -->
            <rect x="${safeZoneInner}" y="${safeZoneInner}" width="${safeZoneOuter - safeZoneInner}" height="${safeZoneOuter - safeZoneInner}" fill="none" stroke="${guideColor}" stroke-width="0.75" stroke-dasharray="4 2" opacity="0.4" rx="8"/>
            <!-- Logo Zone -->
            <rect x="${(viewBoxSize - logoZone) / 2}" y="${(viewBoxSize - logoZone) / 2}" width="${logoZone}" height="${logoZone}" fill="none" stroke="${guideColor}" stroke-width="1" stroke-dasharray="6 3" opacity="0.5" rx="16"/>
        </g>` : '';

    const logoGroup = `
        <g id="logo" transform="translate(${(viewBoxSize - 240) / 2}, ${(viewBoxSize - 240) / 2})">
            <svg width="240" height="240" viewBox="0 0 100 100">
                ${innerContent}
            </svg>
        </g>`;

    const measurementsGroup = showMeasurements ? `
        <g id="measurements" font-family="monospace" font-size="10" fill="${textColor}">
            <!-- Top Left Info -->
            <text x="16" y="24">Grid: 10px</text>
            <text x="16" y="38">Scale: 1:1</text>
            
            <!-- Top Right Info -->
            <text x="${viewBoxSize - 16}" y="24" text-anchor="end">${brand.shape?.name || 'Geometric'}</text>
            <text x="${viewBoxSize - 16}" y="38" text-anchor="end">Algorithm: ${brand.logoLayout || 'Context'}</text>
            
            <!-- Bottom Left Info -->
            <text x="16" y="${viewBoxSize - 24}">φ = 1.618</text>
            <text x="16" y="${viewBoxSize - 10}">Safe Zone: 2x</text>
            
            <!-- Bottom Right Info -->
            <text x="${viewBoxSize - 16}" y="${viewBoxSize - 24}" text-anchor="end">${brand.name}</text>
            <text x="${viewBoxSize - 16}" y="${viewBoxSize - 10}" text-anchor="end">${brand.theme.tokens.light.primary.toUpperCase()}</text>
        </g>` : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}">
    ${gridPatterns}
    ${backgroundGroup}
    ${gridGroup}
    ${guidelinesGroup}
    ${goldenRatioGroup}
    ${safeZonesGroup}
    ${logoGroup}
    ${measurementsGroup}
</svg>`;
}

// ============================================
// TAILWIND CONFIG EXPORT  
// ============================================

/**
 * Generate Tailwind CSS config snippet with brand colors
 * Includes stone-950 theme extension
 */
export function generateTailwindConfig(brand: BrandIdentity): string {
    const lightTokens = brand.theme.tokens.light;
    const darkTokens = brand.theme.tokens.dark;
    const varName = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    return `// ${brand.name} Tailwind Config
// Generated by Glyph - https://glyph.software

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Brand Colors (Light Mode)
        '${varName}': {
          primary: '${lightTokens.primary}',
          background: '${lightTokens.bg}',
          surface: '${lightTokens.surface}',
          text: '${lightTokens.text}',
          muted: '${lightTokens.muted}',
          border: '${lightTokens.border}',
          accent: '${lightTokens.accent || lightTokens.primary}',
        },
        // Brand Colors (Dark Mode)
        '${varName}-dark': {
          primary: '${darkTokens.primary}',
          background: '${darkTokens.bg}',
          surface: '${darkTokens.surface}',
          text: '${darkTokens.text}',
          muted: '${darkTokens.muted}',
          border: '${darkTokens.border}',
        },
        // Extended Stone Scale (for dark themes)
        stone: {
          925: '#131211',
          950: '#0c0a09',
          975: '#080706',
        },
      },
      fontFamily: {
        '${varName}-heading': ['${brand.font.headingName || brand.font.heading || 'Inter'}', 'system-ui', 'sans-serif'],
        '${varName}-body': ['${brand.font.bodyName || brand.font.body || 'Inter'}', 'system-ui', 'sans-serif'],
        ${brand.font.monoName ? `'${varName}-mono': ['${brand.font.monoName}', 'ui-monospace', 'monospace'],` : ''}
      },
      // Golden Ratio Typography Scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],        // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1' }],             // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],          // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],           // 72px
      },
      borderRadius: {
        'brand': '12px',
        'brand-lg': '16px',
        'brand-xl': '24px',
      },
    },
  },
  // Dark mode via class (recommended for brand consistency)
  darkMode: 'class',
};

// CSS Variables for runtime theming
// Add to your global CSS:
/*
:root {
  --${varName}-primary: ${lightTokens.primary};
  --${varName}-background: ${lightTokens.bg};
  --${varName}-surface: ${lightTokens.surface};
  --${varName}-text: ${lightTokens.text};
  --${varName}-muted: ${lightTokens.muted};
  --${varName}-border: ${lightTokens.border};
}

.dark {
  --${varName}-primary: ${darkTokens.primary};
  --${varName}-background: ${darkTokens.bg};
  --${varName}-surface: ${darkTokens.surface};
  --${varName}-text: ${darkTokens.text};
  --${varName}-muted: ${darkTokens.muted};
  --${varName}-border: ${darkTokens.border};
}
*/
`;
}

// ============================================
// COPY TO CLIPBOARD UTILITIES
// ============================================

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            const successful = document.execCommand('copy');
            textArea.remove();
            return successful;
        }
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}

/**
 * Copy Figma tokens JSON to clipboard
 */
export async function copyFigmaTokens(brand: BrandIdentity): Promise<{ success: boolean; message: string }> {
    const tokensJson = generateFigmaTokensJSON(brand);
    const success = await copyToClipboard(tokensJson);
    return {
        success,
        message: success
            ? 'Figma Tokens copied! Paste in Figma Tokens plugin → Import → JSON'
            : 'Failed to copy. Please try again.',
    };
}

/**
 * Copy SVG with construction grid to clipboard
 */
export async function copySVGWithGrid(brand: BrandIdentity): Promise<{ success: boolean; message: string }> {
    const svg = generateSVGWithConstructionGrid(brand);
    const success = await copyToClipboard(svg);
    return {
        success,
        message: success
            ? 'SVG with construction grid copied! Paste directly into Figma'
            : 'Failed to copy. Please try again.',
    };
}

/**
 * Copy Tailwind config to clipboard
 */
export async function copyTailwindConfig(brand: BrandIdentity): Promise<{ success: boolean; message: string }> {
    const config = generateTailwindConfig(brand);
    const success = await copyToClipboard(config);
    return {
        success,
        message: success
            ? 'Tailwind config copied! Merge with your tailwind.config.js'
            : 'Failed to copy. Please try again.',
    };
}
