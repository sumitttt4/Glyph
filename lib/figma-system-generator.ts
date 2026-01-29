/**
 * Figma System Generator
 * 
 * Generates a complete Design System compatible with Tokens Studio for Figma.
 * Includes:
 * - Brand Colors (Primary, Background, Secondary)
 * - Gray Colors (Black, Gray1-4)
 * - State Colors (Info, Success, Warning, Error)
 * - Typography Scale (Headlines 1-6, Body 1-2, Button/Link styles)
 * - Logo Vector Paths
 * 
 * PRO FEATURE: Requires subscription for export
 */

import { BrandIdentity } from '@/lib/data';

// ============================================
// TYPES - Tokens Studio Compatible
// ============================================

export interface TokensStudioPayload {
    $themes: TokenTheme[];
    $metadata: {
        tokenSetOrder: string[];
    };
    core: CoreTokens;
    semantic: SemanticTokens;
    components: ComponentTokens;
}

export interface TokenTheme {
    id: string;
    name: string;
    selectedTokenSets: Record<string, 'enabled' | 'disabled' | 'source'>;
}

export interface CoreTokens {
    colors: ColorTokens;
    typography: TypographyTokens;
    spacing: SpacingTokens;
    borderRadius: BorderRadiusTokens;
}

export interface ColorTokens {
    brand: BrandColorTokens;
    gray: GrayColorTokens;
    state: StateColorTokens;
}

export interface BrandColorTokens {
    primary: TokenValue;
    background: TokenValue;
    secondary1: TokenValue;
    secondary2: TokenValue;
    surface: TokenValue;
    text: TokenValue;
    muted: TokenValue;
    border: TokenValue;
}

export interface GrayColorTokens {
    black: TokenValue;
    gray1: TokenValue;
    gray2: TokenValue;
    gray3: TokenValue;
    gray4: TokenValue;
    white: TokenValue;
}

export interface StateColorTokens {
    info: TokenValue;
    success: TokenValue;
    warning: TokenValue;
    error: TokenValue;
}

export interface TypographyTokens {
    fontFamily: {
        heading: TokenValue;
        body: TokenValue;
        mono?: TokenValue;
    };
    fontWeight: {
        light: TokenValue;
        regular: TokenValue;
        medium: TokenValue;
        semibold: TokenValue;
        bold: TokenValue;
    };
    fontSize: Record<string, TokenValue>;
    lineHeight: Record<string, TokenValue>;
}

export interface SpacingTokens {
    [key: string]: TokenValue;
}

export interface BorderRadiusTokens {
    [key: string]: TokenValue;
}

export interface SemanticTokens {
    text: {
        primary: TokenValue;
        secondary: TokenValue;
        muted: TokenValue;
        inverse: TokenValue;
    };
    background: {
        primary: TokenValue;
        secondary: TokenValue;
        elevated: TokenValue;
    };
}

export interface ComponentTokens {
    button: Record<string, TokenValue>;
    input: Record<string, TokenValue>;
    card: Record<string, TokenValue>;
}

export interface TokenValue {
    value: string;
    type: 'color' | 'fontFamily' | 'fontWeight' | 'fontSize' | 'lineHeight' | 'spacing' | 'borderRadius' | 'dimension';
    description?: string;
}

// ============================================
// STYLE GUIDE TYPES
// ============================================

export interface StyleGuide {
    colors: {
        brand: ColorSwatch[];
        gray: ColorSwatch[];
        state: ColorSwatch[];
    };
    typography: {
        fontFamily: string;
        weights: TypographyWeight[];
        styles: TypographyStyle[];
    };
    logo: {
        svg: string;
        constructionSvg: string;
    };
}

export interface ColorSwatch {
    name: string;
    hex: string;
    label?: string;
}

export interface TypographyWeight {
    name: string;
    weight: number;
    sample: string;
}

export interface TypographyStyle {
    name: string;
    weight: string;
    size: number;
    lineHeight: number;
    sample: string;
}

// ============================================
// COLOR UTILITIES
// ============================================

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;
    return (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
}

function lightenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// ============================================
// FIGMA SYSTEM GENERATOR
// ============================================

export class FigmaSystemGenerator {
    private brand: BrandIdentity;
    private tokens: typeof this.brand.theme.tokens.light;

    constructor(brand: BrandIdentity) {
        this.brand = brand;
        this.tokens = brand.theme.tokens.light;
    }

    /**
     * Generate complete Style Guide data structure
     */
    generateStyleGuide(): StyleGuide {
        const logoSvg = this.getLogoSVG();
        const constructionSvg = this.getConstructionSVG();

        return {
            colors: {
                brand: this.generateBrandColors(),
                gray: this.generateGrayColors(),
                state: this.generateStateColors(),
            },
            typography: {
                fontFamily: this.brand.font.headingName || this.brand.font.name || 'Inter',
                weights: this.generateTypographyWeights(),
                styles: this.generateTypographyStyles(),
            },
            logo: {
                svg: logoSvg,
                constructionSvg: constructionSvg,
            }
        };
    }

    /**
     * Generate Tokens Studio compatible JSON payload
     */
    generateTokensStudioPayload(): TokensStudioPayload {
        return {
            $themes: [
                {
                    id: 'light',
                    name: 'Light',
                    selectedTokenSets: {
                        'core': 'source',
                        'semantic': 'enabled',
                        'components': 'enabled'
                    }
                },
                {
                    id: 'dark',
                    name: 'Dark',
                    selectedTokenSets: {
                        'core': 'source',
                        'semantic': 'enabled',
                        'components': 'enabled'
                    }
                }
            ],
            $metadata: {
                tokenSetOrder: ['core', 'semantic', 'components']
            },
            core: this.generateCoreTokens(),
            semantic: this.generateSemanticTokens(),
            components: this.generateComponentTokens()
        };
    }

    // ----------------------------------------
    // BRAND COLORS
    // ----------------------------------------

    private generateBrandColors(): ColorSwatch[] {
        return [
            { name: 'Primary', hex: this.tokens.primary, label: this.tokens.primary.toUpperCase() },
            { name: 'Background', hex: this.tokens.bg, label: this.tokens.bg.toUpperCase() },
            { name: 'Secondary 1', hex: this.tokens.surface, label: this.tokens.surface.toUpperCase() },
            { name: 'Secondary 2', hex: this.tokens.accent || lightenColor(this.tokens.primary, 20), label: (this.tokens.accent || lightenColor(this.tokens.primary, 20)).toUpperCase() },
        ];
    }

    private generateGrayColors(): ColorSwatch[] {
        return [
            { name: 'Black', hex: '#1C1917', label: '#1C1917' },
            { name: 'Gray1', hex: '#57534E', label: '#57534E' },
            { name: 'Gray2', hex: '#A8A29E', label: '#A8A29E' },
            { name: 'Gray3', hex: '#D6D3D1', label: '#D6D3D1' },
            { name: 'Gray4', hex: '#F5F5F4', label: '#F5F5F4' },
            { name: 'White', hex: '#FFFFFF', label: '#FFFFFF' },
        ];
    }

    private generateStateColors(): ColorSwatch[] {
        return [
            { name: 'Info', hex: '#3B82F6', label: '#3B82F6' },
            { name: 'Success', hex: '#22C55E', label: '#22C55E' },
            { name: 'Warning', hex: '#F59E0B', label: '#F59E0B' },
            { name: 'Error', hex: '#EF4444', label: '#EF4444' },
        ];
    }

    // ----------------------------------------
    // TYPOGRAPHY
    // ----------------------------------------

    private generateTypographyWeights(): TypographyWeight[] {
        return [
            { name: 'Light', weight: 300, sample: 'Aa' },
            { name: 'Normal', weight: 400, sample: 'Aa' },
            { name: 'Medium', weight: 500, sample: 'Aa' },
            { name: 'Bold', weight: 700, sample: 'Aa' },
        ];
    }

    private generateTypographyStyles(): TypographyStyle[] {
        return [
            { name: 'Headline 1', weight: 'Bold', size: 64, lineHeight: 68, sample: 'This is a sample sentence' },
            { name: 'Headline 2', weight: 'Bold', size: 56, lineHeight: 60, sample: 'This is a sample sentence' },
            { name: 'Headline 3', weight: 'Bold', size: 48, lineHeight: 52, sample: 'This is a sample sentence' },
            { name: 'Headline 4', weight: 'Bold', size: 32, lineHeight: 36, sample: 'This is a sample sentence' },
            { name: 'Headline 5', weight: 'Bold', size: 24, lineHeight: 28, sample: 'This is a sample sentence' },
            { name: 'Headline 6', weight: 'Bold', size: 18, lineHeight: 22, sample: 'This is a sample sentence' },
            { name: 'Body1', weight: 'Regular', size: 18, lineHeight: 22, sample: 'This is a sample sentence' },
            { name: 'Body2', weight: 'Regular', size: 16, lineHeight: 20, sample: 'This is a sample sentence' },
            { name: 'Button / Link 1', weight: 'Regular', size: 18, lineHeight: 24, sample: 'This is a sample sentence' },
            { name: 'Button / Link 2', weight: 'Medium', size: 16, lineHeight: 20, sample: 'This is a sample sentence' },
            { name: 'Button / Link 3', weight: 'Regular', size: 14, lineHeight: 24, sample: 'This is a sample sentence' },
            { name: 'Button / Link 4', weight: 'Medium', size: 14, lineHeight: 20, sample: 'This is a sample sentence' },
            { name: 'Button / Link 5', weight: 'Regular', size: 14, lineHeight: 18, sample: 'This is a sample sentence' },
            { name: 'Field 1', weight: 'Regular', size: 16, lineHeight: 24, sample: 'This is a sample sentence' },
            { name: 'Field 2', weight: 'Regular', size: 12, lineHeight: 18, sample: 'This is a sample sentence' },
        ];
    }

    // ----------------------------------------
    // CORE TOKENS (Tokens Studio Format)
    // ----------------------------------------

    private generateCoreTokens(): CoreTokens {
        return {
            colors: {
                brand: {
                    primary: { value: this.tokens.primary, type: 'color', description: 'Primary brand color' },
                    background: { value: this.tokens.bg, type: 'color', description: 'Background color' },
                    secondary1: { value: this.tokens.surface, type: 'color', description: 'Surface/Card color' },
                    secondary2: { value: this.tokens.accent || lightenColor(this.tokens.primary, 20), type: 'color', description: 'Accent color' },
                    surface: { value: this.tokens.surface, type: 'color', description: 'Surface color' },
                    text: { value: this.tokens.text, type: 'color', description: 'Primary text color' },
                    muted: { value: this.tokens.muted, type: 'color', description: 'Muted text color' },
                    border: { value: this.tokens.border, type: 'color', description: 'Border color' },
                },
                gray: {
                    black: { value: '#1C1917', type: 'color' },
                    gray1: { value: '#57534E', type: 'color' },
                    gray2: { value: '#A8A29E', type: 'color' },
                    gray3: { value: '#D6D3D1', type: 'color' },
                    gray4: { value: '#F5F5F4', type: 'color' },
                    white: { value: '#FFFFFF', type: 'color' },
                },
                state: {
                    info: { value: '#3B82F6', type: 'color', description: 'Information state' },
                    success: { value: '#22C55E', type: 'color', description: 'Success state' },
                    warning: { value: '#F59E0B', type: 'color', description: 'Warning state' },
                    error: { value: '#EF4444', type: 'color', description: 'Error state' },
                }
            },
            typography: {
                fontFamily: {
                    heading: { value: this.brand.font.headingName || 'Inter', type: 'fontFamily' },
                    body: { value: this.brand.font.bodyName || 'Inter', type: 'fontFamily' },
                    ...(this.brand.font.monoName ? { mono: { value: this.brand.font.monoName, type: 'fontFamily' } } : {})
                },
                fontWeight: {
                    light: { value: '300', type: 'fontWeight' },
                    regular: { value: '400', type: 'fontWeight' },
                    medium: { value: '500', type: 'fontWeight' },
                    semibold: { value: '600', type: 'fontWeight' },
                    bold: { value: '700', type: 'fontWeight' },
                },
                fontSize: {
                    xs: { value: '12px', type: 'fontSize' },
                    sm: { value: '14px', type: 'fontSize' },
                    base: { value: '16px', type: 'fontSize' },
                    lg: { value: '18px', type: 'fontSize' },
                    xl: { value: '20px', type: 'fontSize' },
                    '2xl': { value: '24px', type: 'fontSize' },
                    '3xl': { value: '32px', type: 'fontSize' },
                    '4xl': { value: '48px', type: 'fontSize' },
                    '5xl': { value: '56px', type: 'fontSize' },
                    '6xl': { value: '64px', type: 'fontSize' },
                },
                lineHeight: {
                    tight: { value: '1.1', type: 'lineHeight' },
                    snug: { value: '1.25', type: 'lineHeight' },
                    normal: { value: '1.5', type: 'lineHeight' },
                    relaxed: { value: '1.625', type: 'lineHeight' },
                    loose: { value: '2', type: 'lineHeight' },
                }
            },
            spacing: {
                '0': { value: '0px', type: 'spacing' },
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
            borderRadius: {
                none: { value: '0px', type: 'borderRadius' },
                sm: { value: '4px', type: 'borderRadius' },
                md: { value: '8px', type: 'borderRadius' },
                lg: { value: '12px', type: 'borderRadius' },
                xl: { value: '16px', type: 'borderRadius' },
                '2xl': { value: '24px', type: 'borderRadius' },
                full: { value: '9999px', type: 'borderRadius' },
            }
        };
    }

    private generateSemanticTokens(): SemanticTokens {
        return {
            text: {
                primary: { value: '{core.colors.brand.text}', type: 'color' },
                secondary: { value: '{core.colors.gray.gray1}', type: 'color' },
                muted: { value: '{core.colors.brand.muted}', type: 'color' },
                inverse: { value: '{core.colors.gray.white}', type: 'color' },
            },
            background: {
                primary: { value: '{core.colors.brand.background}', type: 'color' },
                secondary: { value: '{core.colors.brand.surface}', type: 'color' },
                elevated: { value: '{core.colors.gray.white}', type: 'color' },
            }
        };
    }

    private generateComponentTokens(): ComponentTokens {
        return {
            button: {
                'primary-bg': { value: '{core.colors.brand.primary}', type: 'color' },
                'primary-text': { value: '{core.colors.gray.white}', type: 'color' },
                'secondary-bg': { value: '{core.colors.brand.surface}', type: 'color' },
                'secondary-text': { value: '{core.colors.brand.text}', type: 'color' },
                'borderRadius': { value: '{core.borderRadius.lg}', type: 'borderRadius' },
                'paddingX': { value: '{core.spacing.6}', type: 'spacing' },
                'paddingY': { value: '{core.spacing.3}', type: 'spacing' },
            },
            input: {
                'bg': { value: '{core.colors.gray.white}', type: 'color' },
                'border': { value: '{core.colors.brand.border}', type: 'color' },
                'text': { value: '{core.colors.brand.text}', type: 'color' },
                'placeholder': { value: '{core.colors.brand.muted}', type: 'color' },
                'borderRadius': { value: '{core.borderRadius.md}', type: 'borderRadius' },
            },
            card: {
                'bg': { value: '{core.colors.gray.white}', type: 'color' },
                'border': { value: '{core.colors.brand.border}', type: 'color' },
                'borderRadius': { value: '{core.borderRadius.xl}', type: 'borderRadius' },
                'shadow': { value: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', type: 'dimension' },
            }
        };
    }

    // ----------------------------------------
    // LOGO SVG GENERATION
    // ----------------------------------------

    private getLogoSVG(): string {
        if (this.brand.generatedLogos && this.brand.generatedLogos.length > 0) {
            const selectedIndex = this.brand.selectedLogoIndex ?? 0;
            const selectedLogo = this.brand.generatedLogos[selectedIndex];
            if (selectedLogo?.svg) {
                return selectedLogo.svg;
            }
        }
        // Fallback to shape path
        return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="${this.brand.shape?.path || 'M50 10 L90 90 L10 90 Z'}" fill="${this.tokens.primary}" />
        </svg>`;
    }

    private getConstructionSVG(): string {
        const PHI = 1.618033988749895;
        const viewBoxSize = 400;
        const center = viewBoxSize / 2;
        const gridSize = 40;
        const goldenOuter = viewBoxSize * 0.38;
        const goldenInner = goldenOuter / PHI;
        const goldenInner2 = goldenInner / PHI;
        const safeZoneOuter = viewBoxSize * 0.85;
        const safeZoneInner = viewBoxSize * 0.15;
        const logoZone = viewBoxSize * 0.6;

        const guideColor = '#6366f1';
        const accentColor = '#a855f7';
        const gridColor = '#1e293b';

        // Get logo inner content
        const logoSvg = this.getLogoSVG();
        const innerContent = logoSvg
            .replace(/<\?xml[^?]*\?>/g, '')
            .replace(/<svg[^>]*>/g, '')
            .replace(/<\/svg>/g, '')
            .trim();

        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="${viewBoxSize}" height="${viewBoxSize}">
    <defs>
        <pattern id="fine-grid" width="${gridSize / 4}" height="${gridSize / 4}" patternUnits="userSpaceOnUse">
            <path d="M ${gridSize / 4} 0 L 0 0 0 ${gridSize / 4}" fill="none" stroke="${gridColor}" stroke-width="0.25" opacity="0.3"/>
        </pattern>
        <pattern id="major-grid" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
            <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="${gridColor}" stroke-width="0.5" opacity="0.6"/>
        </pattern>
        <linearGradient id="guide-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${guideColor}" stop-opacity="0.8"/>
            <stop offset="100%" stop-color="${accentColor}" stop-opacity="0.4"/>
        </linearGradient>
    </defs>

    <!-- Background -->
    <g id="background">
        <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="#0a0a0f"/>
    </g>

    <!-- Construction Grid -->
    <g id="construction-grid">
        <rect width="100%" height="100%" fill="url(#fine-grid)"/>
        <rect width="100%" height="100%" fill="url(#major-grid)"/>
    </g>

    <!-- Guidelines -->
    <g id="guidelines">
        <line x1="${center}" y1="0" x2="${center}" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.6"/>
        <line x1="0" y1="${center}" x2="${viewBoxSize}" y2="${center}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.6"/>
        <circle cx="${center}" cy="${center}" r="3" fill="${guideColor}" opacity="0.8"/>
        <line x1="0" y1="0" x2="${viewBoxSize}" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="8 8" opacity="0.3"/>
        <line x1="${viewBoxSize}" y1="0" x2="0" y2="${viewBoxSize}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="8 8" opacity="0.3"/>
    </g>

    <!-- Golden Ratio -->
    <g id="golden-ratio">
        <circle cx="${center}" cy="${center}" r="${goldenOuter}" fill="none" stroke="url(#guide-gradient)" stroke-width="1" opacity="0.6"/>
        <circle cx="${center}" cy="${center}" r="${goldenInner}" fill="none" stroke="${accentColor}" stroke-width="0.75" stroke-dasharray="2 4" opacity="0.5"/>
        <circle cx="${center}" cy="${center}" r="${goldenInner2}" fill="none" stroke="${accentColor}" stroke-width="0.5" stroke-dasharray="1 3" opacity="0.4"/>
        <path d="M ${center + goldenOuter} ${center} A ${goldenOuter} ${goldenOuter} 0 0 1 ${center} ${center + goldenOuter} A ${goldenInner} ${goldenInner} 0 0 1 ${center - goldenInner} ${center} A ${goldenInner2} ${goldenInner2} 0 0 1 ${center} ${center - goldenInner2}" fill="none" stroke="${guideColor}" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
    </g>

    <!-- Safe Zones -->
    <g id="safe-zones">
        <rect x="${safeZoneInner}" y="${safeZoneInner}" width="${safeZoneOuter - safeZoneInner}" height="${safeZoneOuter - safeZoneInner}" fill="none" stroke="${guideColor}" stroke-width="0.75" stroke-dasharray="4 2" opacity="0.4" rx="8"/>
        <rect x="${(viewBoxSize - logoZone) / 2}" y="${(viewBoxSize - logoZone) / 2}" width="${logoZone}" height="${logoZone}" fill="none" stroke="${guideColor}" stroke-width="1" stroke-dasharray="6 3" opacity="0.5" rx="16"/>
    </g>

    <!-- Logo -->
    <g id="logo" transform="translate(${(viewBoxSize - 240) / 2}, ${(viewBoxSize - 240) / 2})">
        <svg width="240" height="240" viewBox="0 0 100 100">
            ${innerContent}
        </svg>
    </g>

    <!-- Annotations -->
    <g id="annotations" font-family="monospace" font-size="10" fill="#94a3b8">
        <text x="16" y="24">Grid: 10px</text>
        <text x="16" y="38">Scale: 1:1</text>
        <text x="${viewBoxSize - 16}" y="24" text-anchor="end">${this.brand.shape?.name || 'Geometric'}</text>
        <text x="16" y="${viewBoxSize - 24}">φ = 1.618</text>
        <text x="16" y="${viewBoxSize - 10}">Safe Zone: 2x</text>
        <text x="${viewBoxSize - 16}" y="${viewBoxSize - 24}" text-anchor="end">${this.brand.name}</text>
        <text x="${viewBoxSize - 16}" y="${viewBoxSize - 10}" text-anchor="end">${this.tokens.primary.toUpperCase()}</text>
    </g>
</svg>`;
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

/**
 * Generate complete Style Guide for preview
 */
export function generateStyleGuide(brand: BrandIdentity): StyleGuide {
    const generator = new FigmaSystemGenerator(brand);
    return generator.generateStyleGuide();
}

/**
 * Generate Tokens Studio compatible JSON
 */
export function generateTokensStudioJSON(brand: BrandIdentity): string {
    const generator = new FigmaSystemGenerator(brand);
    const payload = generator.generateTokensStudioPayload();
    return JSON.stringify(payload, null, 2);
}

/**
 * Copy Tokens Studio JSON to clipboard
 */
export async function copyTokensStudioToClipboard(brand: BrandIdentity): Promise<{ success: boolean; message: string }> {
    try {
        const json = generateTokensStudioJSON(brand);
        await navigator.clipboard.writeText(json);
        return {
            success: true,
            message: 'Design System copied! Import in Tokens Studio for Figma'
        };
    } catch (e) {
        console.error('Copy failed:', e);
        return {
            success: false,
            message: 'Failed to copy. Please try again.'
        };
    }
}

/**
 * Generate and copy Construction Grid SVG
 */
export async function copyConstructionSVG(brand: BrandIdentity): Promise<{ success: boolean; message: string }> {
    try {
        const generator = new FigmaSystemGenerator(brand);
        const styleGuide = generator.generateStyleGuide();
        await navigator.clipboard.writeText(styleGuide.logo.constructionSvg);
        return {
            success: true,
            message: 'Construction SVG copied! Paste directly into Figma'
        };
    } catch (e) {
        console.error('Copy failed:', e);
        return {
            success: false,
            message: 'Failed to copy. Please try again.'
        };
    }
}
