/**
 * Typography Export Utilities
 *
 * Generates exportable typography assets including:
 * - Font names and weights
 * - CSS variables
 * - Typography specimen SVG
 * - Google Fonts import URLs
 */

import { BrandIdentity } from '@/lib/data';

// ============================================
// TYPES
// ============================================

export interface TypographyExport {
    fonts: {
        display: FontExport;
        body: FontExport;
        mono?: FontExport;
    };
    cssVariables: string;
    googleFontsUrl: string;
    specimenSvg: string;
}

export interface FontExport {
    name: string;
    family: string;
    weights: number[];
    category: 'sans-serif' | 'serif' | 'monospace' | 'display';
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
 * Determine font category from name
 */
function getFontCategory(fontName: string): 'sans-serif' | 'serif' | 'monospace' | 'display' {
    const lower = fontName.toLowerCase();

    if (lower.includes('mono') || lower.includes('code') || lower.includes('console')) {
        return 'monospace';
    }
    if (lower.includes('serif') || lower.includes('garamond') || lower.includes('times') ||
        lower.includes('georgia') || lower.includes('baskerville') || lower.includes('playfair') ||
        lower.includes('lora') || lower.includes('merriweather') || lower.includes('crimson')) {
        return 'serif';
    }
    if (lower.includes('bebas') || lower.includes('oswald') || lower.includes('impact') ||
        lower.includes('display') || lower.includes('abril') || lower.includes('cinzel')) {
        return 'display';
    }

    return 'sans-serif';
}

/**
 * Generate Google Fonts URL
 */
function generateGoogleFontsUrl(fonts: { name: string; weights: number[] }[]): string {
    const fontParams = fonts.map(font => {
        const family = font.name.replace(/\s+/g, '+');
        const weights = font.weights.join(';');
        return `family=${family}:wght@${weights}`;
    }).join('&');

    return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

// ============================================
// MAIN EXPORT FUNCTIONS
// ============================================

/**
 * Generate typography export data for a brand
 */
export function generateTypographyExport(brand: BrandIdentity): TypographyExport {
    const displayFont = brand.font.headingName || brand.font.heading || 'Inter';
    const bodyFont = brand.font.bodyName || brand.font.body || 'Inter';
    const monoFont = (brand.font as any).monoName;

    // Default weights if not specified
    const defaultWeights = [300, 400, 500, 600, 700];

    const fonts: TypographyExport['fonts'] = {
        display: {
            name: displayFont,
            family: `"${displayFont}", ${getFontCategory(displayFont)}`,
            weights: defaultWeights,
            category: getFontCategory(displayFont),
        },
        body: {
            name: bodyFont,
            family: `"${bodyFont}", ${getFontCategory(bodyFont)}`,
            weights: defaultWeights,
            category: getFontCategory(bodyFont),
        },
    };

    if (monoFont) {
        fonts.mono = {
            name: monoFont,
            family: `"${monoFont}", monospace`,
            weights: [400, 500, 600],
            category: 'monospace',
        };
    }

    // Generate CSS variables
    const cssVariables = generateCSSVariables(fonts);

    // Generate Google Fonts URL
    const fontList = [
        { name: displayFont, weights: defaultWeights },
        { name: bodyFont, weights: defaultWeights },
    ];
    if (monoFont) {
        fontList.push({ name: monoFont, weights: [400, 500, 600] });
    }
    const googleFontsUrl = generateGoogleFontsUrl(fontList);

    // Generate specimen SVG
    const specimenSvg = generateSpecimenSVG(brand, fonts);

    return {
        fonts,
        cssVariables,
        googleFontsUrl,
        specimenSvg,
    };
}

/**
 * Generate CSS variables for typography
 */
function generateCSSVariables(fonts: TypographyExport['fonts']): string {
    return `:root {
  /* Typography - Font Families */
  --font-display: ${fonts.display.family};
  --font-body: ${fonts.body.family};
  ${fonts.mono ? `--font-mono: ${fonts.mono.family};` : ''}

  /* Typography - Font Names (for reference) */
  --font-display-name: "${fonts.display.name}";
  --font-body-name: "${fonts.body.name}";
  ${fonts.mono ? `--font-mono-name: "${fonts.mono.name}";` : ''}

  /* Typography - Font Weights */
  --font-weight-light: 300;
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  /* Typography - Font Sizes */
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;

  /* Typography - Line Heights */
  --line-height-tight: 1.1;
  --line-height-snug: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;

  /* Typography - Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;
  --tracking-widest: 0.1em;
}

/* Heading Styles */
h1, .h1 {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-5xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--tracking-tight);
}

h2, .h2 {
  font-family: var(--font-display);
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--tracking-tight);
}

h3, .h3 {
  font-family: var(--font-display);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-3xl);
  line-height: var(--line-height-snug);
}

h4, .h4 {
  font-family: var(--font-display);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-2xl);
  line-height: var(--line-height-snug);
}

/* Body Styles */
body, p, .body {
  font-family: var(--font-body);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
}

/* Code Styles */
code, pre, .mono {
  font-family: var(--font-mono);
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-sm);
}
`;
}

/**
 * Generate typography specimen SVG
 */
function generateSpecimenSVG(brand: BrandIdentity, fonts: TypographyExport['fonts']): string {
    const colors = brand.theme.tokens.light;
    const hasMonoFont = !!fonts.mono;
    const height = hasMonoFont ? 800 : 600;

    const ALPHABET_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const ALPHABET_LOWER = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 ${height}" fill="none">
    <!-- Background -->
    <rect width="800" height="${height}" fill="${colors.bg}"/>

    <!-- Title -->
    <text x="40" y="60" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="${colors.muted}">TYPOGRAPHY SPECIMEN</text>
    <text x="40" y="90" font-family="${escapeXml(fonts.display.name)}, system-ui" font-size="32" font-weight="700" fill="${colors.text}">${escapeXml(brand.name)} Typography</text>

    <!-- Display Font Section -->
    <rect x="40" y="120" width="720" height="180" rx="12" fill="${colors.surface}"/>
    <text x="60" y="155" font-family="system-ui" font-size="12" font-weight="500" fill="${colors.primary}">DISPLAY FONT</text>
    <text x="60" y="175" font-family="system-ui" font-size="14" fill="${colors.muted}">${escapeXml(fonts.display.name)}</text>

    <text x="60" y="220" font-family="${escapeXml(fonts.display.name)}, system-ui" font-size="48" font-weight="700" fill="${colors.text}">AaBbCc</text>
    <text x="60" y="260" font-family="${escapeXml(fonts.display.name)}, system-ui" font-size="16" font-weight="400" fill="${colors.text}">${ALPHABET_UPPER}</text>
    <text x="60" y="285" font-family="${escapeXml(fonts.display.name)}, system-ui" font-size="16" font-weight="400" fill="${colors.muted}">${ALPHABET_LOWER} ${NUMBERS}</text>

    <!-- Body Font Section -->
    <rect x="40" y="320" width="720" height="180" rx="12" fill="${colors.surface}"/>
    <text x="60" y="355" font-family="system-ui" font-size="12" font-weight="500" fill="${colors.primary}">BODY FONT</text>
    <text x="60" y="375" font-family="system-ui" font-size="14" fill="${colors.muted}">${escapeXml(fonts.body.name)}</text>

    <text x="60" y="420" font-family="${escapeXml(fonts.body.name)}, system-ui" font-size="48" font-weight="400" fill="${colors.text}">AaBbCc</text>
    <text x="60" y="460" font-family="${escapeXml(fonts.body.name)}, system-ui" font-size="16" font-weight="400" fill="${colors.text}">${ALPHABET_UPPER}</text>
    <text x="60" y="485" font-family="${escapeXml(fonts.body.name)}, system-ui" font-size="16" font-weight="400" fill="${colors.muted}">${ALPHABET_LOWER} ${NUMBERS}</text>

    ${hasMonoFont ? `
    <!-- Mono Font Section -->
    <rect x="40" y="520" width="720" height="160" rx="12" fill="#1a1a1a"/>
    <text x="60" y="555" font-family="system-ui" font-size="12" font-weight="500" fill="#888">MONO FONT</text>
    <text x="60" y="575" font-family="system-ui" font-size="14" fill="#666">${escapeXml(fonts.mono!.name)}</text>

    <text x="60" y="620" font-family="${escapeXml(fonts.mono!.name)}, monospace" font-size="32" font-weight="400" fill="#fff">{ code: "example" }</text>
    <text x="60" y="660" font-family="${escapeXml(fonts.mono!.name)}, monospace" font-size="14" font-weight="400" fill="#888">${ALPHABET_UPPER} ${NUMBERS}</text>
    ` : ''}

    <!-- Footer -->
    <text x="40" y="${height - 20}" font-family="system-ui" font-size="11" fill="${colors.muted}">Generated by Glyph</text>
</svg>`;
}

/**
 * Generate typography JSON export
 */
export function generateTypographyJSON(brand: BrandIdentity): string {
    const exportData = generateTypographyExport(brand);

    return JSON.stringify({
        brandName: brand.name,
        fonts: exportData.fonts,
        googleFontsUrl: exportData.googleFontsUrl,
        usage: {
            headings: 'Use display font for h1-h4, logos, and hero text',
            body: 'Use body font for paragraphs, lists, and general content',
            code: exportData.fonts.mono ? 'Use mono font for code blocks and technical content' : 'No mono font specified',
        },
    }, null, 2);
}
