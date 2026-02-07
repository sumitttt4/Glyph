/**
 * AI Palette Generator — Industry-Aware Color System
 *
 * Generates brand color palettes using color theory strategies
 * (complementary, analogous, triadic, split-complementary, monochromatic)
 * seeded by industry hue mappings.
 */

import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';
import harmoniesPlugin from 'colord/plugins/harmonies';

extend([mixPlugin, harmoniesPlugin]);

// ============================================================
// TYPES
// ============================================================

export type HarmonyStrategy =
    | 'complementary'
    | 'analogous'
    | 'triadic'
    | 'split-complementary'
    | 'monochromatic';

export interface AIPalette {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    strategy: HarmonyStrategy;
}

// ============================================================
// INDUSTRY HUE SEEDS
// ============================================================

/** Base hue (0-360) and preferred strategies per industry */
const INDUSTRY_HUE_MAP: Record<string, { hue: number; range: number; strategies: HarmonyStrategy[] }> = {
    technology: { hue: 220, range: 30, strategies: ['analogous', 'monochromatic', 'split-complementary'] },
    tech: { hue: 220, range: 30, strategies: ['analogous', 'monochromatic', 'split-complementary'] },
    saas: { hue: 235, range: 25, strategies: ['analogous', 'triadic'] },
    finance: { hue: 210, range: 20, strategies: ['monochromatic', 'analogous'] },
    fintech: { hue: 250, range: 30, strategies: ['split-complementary', 'triadic'] },
    health: { hue: 150, range: 30, strategies: ['analogous', 'monochromatic'] },
    healthcare: { hue: 150, range: 30, strategies: ['analogous', 'monochromatic'] },
    food: { hue: 25, range: 35, strategies: ['analogous', 'complementary'] },
    education: { hue: 200, range: 30, strategies: ['triadic', 'analogous'] },
    creative: { hue: 280, range: 60, strategies: ['triadic', 'split-complementary', 'complementary'] },
    ecommerce: { hue: 15, range: 25, strategies: ['complementary', 'triadic'] },
    nature: { hue: 120, range: 40, strategies: ['analogous', 'monochromatic'] },
    luxury: { hue: 40, range: 15, strategies: ['monochromatic', 'analogous'] },
    startup: { hue: 260, range: 50, strategies: ['triadic', 'split-complementary'] },
    legal: { hue: 215, range: 15, strategies: ['monochromatic', 'analogous'] },
    music: { hue: 300, range: 40, strategies: ['triadic', 'complementary'] },
    sports: { hue: 10, range: 20, strategies: ['complementary', 'triadic'] },
    travel: { hue: 190, range: 30, strategies: ['analogous', 'triadic'] },
    real_estate: { hue: 35, range: 20, strategies: ['monochromatic', 'analogous'] },
    media: { hue: 0, range: 40, strategies: ['triadic', 'split-complementary'] },
    enterprise: { hue: 215, range: 15, strategies: ['monochromatic', 'analogous'] },
};

// ============================================================
// HARMONY GENERATORS
// ============================================================

function generateComplementary(baseHue: number, sat: number, light: number) {
    const primary = colord({ h: baseHue, s: sat, l: light });
    const secondary = colord({ h: (baseHue + 180) % 360, s: sat * 0.8, l: light + 5 });
    const accent = colord({ h: (baseHue + 180) % 360, s: sat * 0.9, l: light - 10 });
    return { primary: primary.toHex(), secondary: secondary.toHex(), accent: accent.toHex() };
}

function generateAnalogous(baseHue: number, sat: number, light: number) {
    const primary = colord({ h: baseHue, s: sat, l: light });
    const secondary = colord({ h: (baseHue + 30) % 360, s: sat * 0.85, l: light + 5 });
    const accent = colord({ h: (baseHue - 30 + 360) % 360, s: sat * 0.9, l: light - 5 });
    return { primary: primary.toHex(), secondary: secondary.toHex(), accent: accent.toHex() };
}

function generateTriadic(baseHue: number, sat: number, light: number) {
    const primary = colord({ h: baseHue, s: sat, l: light });
    const secondary = colord({ h: (baseHue + 120) % 360, s: sat * 0.7, l: light + 5 });
    const accent = colord({ h: (baseHue + 240) % 360, s: sat * 0.75, l: light });
    return { primary: primary.toHex(), secondary: secondary.toHex(), accent: accent.toHex() };
}

function generateSplitComplementary(baseHue: number, sat: number, light: number) {
    const primary = colord({ h: baseHue, s: sat, l: light });
    const secondary = colord({ h: (baseHue + 150) % 360, s: sat * 0.75, l: light + 5 });
    const accent = colord({ h: (baseHue + 210) % 360, s: sat * 0.8, l: light });
    return { primary: primary.toHex(), secondary: secondary.toHex(), accent: accent.toHex() };
}

function generateMonochromatic(baseHue: number, sat: number, light: number) {
    const primary = colord({ h: baseHue, s: sat, l: light });
    const secondary = colord({ h: baseHue, s: sat * 0.6, l: light + 15 });
    const accent = colord({ h: baseHue, s: sat * 1.1, l: light - 15 });
    return { primary: primary.toHex(), secondary: secondary.toHex(), accent: accent.toHex() };
}

const STRATEGY_GENERATORS: Record<HarmonyStrategy, typeof generateComplementary> = {
    complementary: generateComplementary,
    analogous: generateAnalogous,
    triadic: generateTriadic,
    'split-complementary': generateSplitComplementary,
    monochromatic: generateMonochromatic,
};

// ============================================================
// MAIN GENERATOR
// ============================================================

/**
 * Generate an industry-aware color palette.
 *
 * @param industry  - Industry keyword (e.g. "technology", "food")
 * @param colorHint - Optional hex color to use as the primary instead of seeded hue
 * @param seed      - Numeric seed for deterministic variation (e.g. Date.now())
 */
export function generateAIPalette(
    industry: string = 'technology',
    colorHint?: string,
    seed?: number,
): AIPalette {
    const key = industry.toLowerCase().replace(/[^a-z_]/g, '');
    const config = INDUSTRY_HUE_MAP[key] || INDUSTRY_HUE_MAP['technology']!;

    // Deterministic pseudo-random from seed
    const rng = seed !== undefined
        ? ((Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000))
        : Math.random();

    // Pick strategy
    const strategyIndex = Math.floor(rng * config.strategies.length);
    const strategy = config.strategies[strategyIndex] ?? 'analogous';

    // Determine base HSL
    let baseHue: number;
    let baseSat: number;
    let baseLight: number;

    if (colorHint) {
        const parsed = colord(colorHint);
        if (parsed.isValid()) {
            const hsl = parsed.toHsl();
            baseHue = hsl.h;
            baseSat = hsl.s;
            baseLight = hsl.l;
        } else {
            baseHue = config.hue + Math.floor((rng - 0.5) * config.range);
            baseSat = 65 + Math.floor(rng * 20);
            baseLight = 45 + Math.floor(rng * 15);
        }
    } else {
        // Seeded hue variation within industry range
        baseHue = config.hue + Math.floor((rng - 0.5) * config.range);
        baseSat = 65 + Math.floor(rng * 20);
        baseLight = 45 + Math.floor(rng * 15);
    }

    // Normalize hue
    baseHue = ((baseHue % 360) + 360) % 360;

    // Generate core triad
    const generator = STRATEGY_GENERATORS[strategy];
    const { primary, secondary, accent } = generator(baseHue, baseSat, baseLight);

    // Derive neutrals from primary warmth
    const isWarm = (baseHue >= 0 && baseHue <= 60) || (baseHue >= 300 && baseHue <= 360);

    const background = isWarm ? '#FAFAF9' : '#F8FAFC';
    const surface = '#FFFFFF';
    const foreground = isWarm ? '#1C1917' : '#0F172A';
    const muted = isWarm ? '#78716C' : '#64748B';

    return {
        primary,
        secondary,
        accent,
        background,
        surface,
        foreground,
        muted,
        strategy,
    };
}

/**
 * Generate multiple palette variations for the same industry.
 */
export function generateAIPaletteVariations(
    industry: string,
    count: number = 5,
    colorHint?: string,
): AIPalette[] {
    const baseSeed = Date.now();
    return Array.from({ length: count }, (_, i) =>
        generateAIPalette(industry, colorHint, baseSeed + i * 7919),
    );
}
