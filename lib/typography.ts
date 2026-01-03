/**
 * MarkZero Typography Intelligence Engine
 * 
 * This module contains strict, non-random typographic rules
 * that enforce agency-grade consistency across all generated brands.
 */

// ============================================================
// FONT RULES - Precise letter-spacing and sizing per font family
// ============================================================

export type FontFamily = 'Inter' | 'Manrope' | 'Instrument Serif' | 'Space Grotesk' | 'DM Sans';
export type ElementType = 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'button' | 'label';

interface FontRule {
    tracking: string;      // letter-spacing
    leading: string;       // line-height
    weight: number;        // font-weight
}

interface FontRuleSet {
    h1: FontRule;
    h2: FontRule;
    h3: FontRule;
    h4: FontRule;
    body: FontRule;
    caption: FontRule;
    button: FontRule;
    label: FontRule;
}

export const FONT_RULES: Record<FontFamily, FontRuleSet> = {
    'Inter': {
        h1: { tracking: '-0.04em', leading: '1.1', weight: 700 },
        h2: { tracking: '-0.03em', leading: '1.15', weight: 700 },
        h3: { tracking: '-0.02em', leading: '1.2', weight: 600 },
        h4: { tracking: '-0.01em', leading: '1.25', weight: 600 },
        body: { tracking: '-0.01em', leading: '1.6', weight: 400 },
        caption: { tracking: '0em', leading: '1.5', weight: 400 },
        button: { tracking: '0.02em', leading: '1', weight: 500 },
        label: { tracking: '0.05em', leading: '1', weight: 500 },
    },
    'Manrope': {
        h1: { tracking: '-0.02em', leading: '1.05', weight: 800 },
        h2: { tracking: '-0.02em', leading: '1.1', weight: 700 },
        h3: { tracking: '-0.01em', leading: '1.15', weight: 600 },
        h4: { tracking: '-0.01em', leading: '1.2', weight: 600 },
        body: { tracking: '0em', leading: '1.65', weight: 400 },
        caption: { tracking: '0.01em', leading: '1.5', weight: 400 },
        button: { tracking: '0.02em', leading: '1', weight: 600 },
        label: { tracking: '0.08em', leading: '1', weight: 600 },
    },
    'Instrument Serif': {
        h1: { tracking: '-0.01em', leading: '1.1', weight: 400 },
        h2: { tracking: '-0.01em', leading: '1.15', weight: 400 },
        h3: { tracking: '0em', leading: '1.2', weight: 400 },
        h4: { tracking: '0em', leading: '1.25', weight: 400 },
        body: { tracking: '0.01em', leading: '1.7', weight: 400 },
        caption: { tracking: '0.02em', leading: '1.5', weight: 400 },
        button: { tracking: '0.02em', leading: '1', weight: 400 },
        label: { tracking: '0.1em', leading: '1', weight: 400 },
    },
    'Space Grotesk': {
        h1: { tracking: '-0.03em', leading: '1.05', weight: 700 },
        h2: { tracking: '-0.02em', leading: '1.1', weight: 600 },
        h3: { tracking: '-0.02em', leading: '1.15', weight: 500 },
        h4: { tracking: '-0.01em', leading: '1.2', weight: 500 },
        body: { tracking: '0em', leading: '1.6', weight: 400 },
        caption: { tracking: '0.01em', leading: '1.5', weight: 400 },
        button: { tracking: '0.02em', leading: '1', weight: 500 },
        label: { tracking: '0.06em', leading: '1', weight: 500 },
    },
    'DM Sans': {
        h1: { tracking: '-0.025em', leading: '1.1', weight: 700 },
        h2: { tracking: '-0.02em', leading: '1.15', weight: 600 },
        h3: { tracking: '-0.015em', leading: '1.2', weight: 500 },
        h4: { tracking: '-0.01em', leading: '1.25', weight: 500 },
        body: { tracking: '0em', leading: '1.6', weight: 400 },
        caption: { tracking: '0.01em', leading: '1.5', weight: 400 },
        button: { tracking: '0.02em', leading: '1', weight: 500 },
        label: { tracking: '0.05em', leading: '1', weight: 500 },
    },
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Returns precise font styles for a given font and element type.
 * This ensures every brand follows our typographic rules perfectly.
 */
export function getFontStyles(fontName: FontFamily, elementType: ElementType): FontRule {
    return FONT_RULES[fontName][elementType];
}

/**
 * Generates CSS-in-JS style object for a given font and element.
 */
export function getTypographyStyles(fontName: FontFamily, elementType: ElementType): React.CSSProperties {
    const rule = getFontStyles(fontName, elementType);
    return {
        letterSpacing: rule.tracking,
        lineHeight: rule.leading,
        fontWeight: rule.weight,
    };
}

/**
 * Returns Tailwind-compatible class string for typography.
 * Note: Some values need inline styles as Tailwind doesn't support arbitrary tracking values.
 */
export function getTypographyClass(elementType: ElementType): string {
    const sizeMap: Record<ElementType, string> = {
        h1: 'text-5xl md:text-6xl lg:text-7xl',
        h2: 'text-3xl md:text-4xl lg:text-5xl',
        h3: 'text-2xl md:text-3xl',
        h4: 'text-xl md:text-2xl',
        body: 'text-base md:text-lg',
        caption: 'text-sm',
        button: 'text-sm',
        label: 'text-xs uppercase',
    };
    return sizeMap[elementType];
}

// ============================================================
// FONT PAIRING RULES - Which fonts go together
// ============================================================

export interface FontPairing {
    id: string;
    name: string;
    heading: FontFamily;
    body: FontFamily;
    tags: string[];
    description: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
    {
        id: 'architect',
        name: 'Architect',
        heading: 'Manrope',
        body: 'Inter',
        tags: ['minimalist', 'tech', 'modern'],
        description: 'Geometric precision meets Swiss clarity.',
    },
    {
        id: 'editorial',
        name: 'Editorial',
        heading: 'Instrument Serif',
        body: 'DM Sans',
        tags: ['nature', 'organic', 'luxury'],
        description: 'Magazine-quality typography with warmth.',
    },
    {
        id: 'tech-forward',
        name: 'Tech Forward',
        heading: 'Space Grotesk',
        body: 'Inter',
        tags: ['tech', 'bold', 'futuristic'],
        description: 'Engineered for digital-first brands.',
    },
    {
        id: 'clean-slate',
        name: 'Clean Slate',
        heading: 'Inter',
        body: 'Inter',
        tags: ['minimalist', 'clean', 'professional'],
        description: 'The universal choice. Never fails.',
    },
    {
        id: 'bold-statement',
        name: 'Bold Statement',
        heading: 'Manrope',
        body: 'DM Sans',
        tags: ['bold', 'vibrant', 'startup'],
        description: 'High-impact headlines with readable body.',
    },
];
