/**
 * AI Typography Pairing Selector
 *
 * Selects curated Google Font pairings (display + body)
 * based on industry, vibe, and style parameters.
 */

import { fontPairings, type FontConfig, type BrandCategory } from './fonts';

// ============================================================
// TYPES
// ============================================================

export interface AITypographyResult {
    display: FontConfig;
    body: FontConfig;
    reason: string;
}

// ============================================================
// INDUSTRY → FONT TAG MAPPINGS
// ============================================================

const INDUSTRY_FONT_TAGS: Record<string, string[]> = {
    technology: ['modern', 'tech', 'clean', 'minimalist'],
    tech: ['modern', 'tech', 'clean', 'minimalist'],
    saas: ['modern', 'tech', 'saas', 'clean'],
    finance: ['professional', 'trust', 'neutral', 'classic'],
    fintech: ['modern', 'tech', 'bold'],
    health: ['friendly', 'warm', 'approachable', 'clean'],
    healthcare: ['friendly', 'warm', 'approachable', 'clean'],
    food: ['friendly', 'warm', 'organic', 'bold'],
    education: ['readable', 'friendly', 'approachable'],
    creative: ['artistic', 'creative', 'unique', 'bold'],
    ecommerce: ['modern', 'friendly', 'bold', 'clean'],
    nature: ['organic', 'natural', 'warm', 'soft'],
    luxury: ['elegant', 'fashion', 'luxury', 'minimalist'],
    startup: ['modern', 'vibrant', 'tech', 'bold'],
    legal: ['traditional', 'trust', 'classic', 'professional'],
    music: ['bold', 'creative', 'impact'],
    sports: ['bold', 'impact', 'strong'],
    travel: ['friendly', 'modern', 'clean'],
    real_estate: ['professional', 'trust', 'classic'],
    media: ['editorial', 'bold', 'news'],
    enterprise: ['professional', 'neutral', 'clean'],
};

// Style → additional tag boosting
const STYLE_FONT_TAGS: Record<string, string[]> = {
    minimal: ['minimalist', 'clean', 'geometric'],
    geometric: ['geometric', 'bold', 'modern'],
    abstract: ['modern', 'artistic', 'creative'],
    bold: ['bold', 'impact', 'strong'],
    organic: ['organic', 'soft', 'friendly', 'warm'],
};

// ============================================================
// SELECTOR
// ============================================================

/**
 * Score a font config against desired tags.
 */
function scoreFontForTags(font: FontConfig, desiredTags: string[]): number {
    let score = 0;
    for (const tag of desiredTags) {
        if (font.tags.includes(tag)) score += 2;
    }
    if (font.recommended) score += 1;
    return score;
}

/**
 * Select the best typography pairing for an industry + style.
 *
 * Returns a display font (for headings/brand name) and a body font.
 * In most pairings, these are already bundled as heading + body.
 */
export function selectTypographyPairing(
    industry: string = 'technology',
    style?: string,
    seed?: number,
): AITypographyResult {
    const key = industry.toLowerCase().replace(/[^a-z_]/g, '');

    // Collect desired tags
    const industryTags = INDUSTRY_FONT_TAGS[key] || INDUSTRY_FONT_TAGS['technology']!;
    const styleTags = style && STYLE_FONT_TAGS[style] ? STYLE_FONT_TAGS[style] : [];
    const allTags = [...industryTags, ...styleTags];

    // Score all pairings
    const scored = fontPairings.map((font) => ({
        font,
        score: scoreFontForTags(font, allTags),
    }));

    // Sort by score descending
    scored.sort((a, b) => b.score - a.score);

    // Top candidates (at least score > 0)
    const topCandidates = scored.filter((s) => s.score > 0);
    const pool = topCandidates.length > 0 ? topCandidates : scored;

    // Pick from top 5 using seed for determinism
    const topN = pool.slice(0, Math.min(5, pool.length));
    const rng = seed !== undefined
        ? Math.abs(Math.sin(seed * 9301 + 49297) % 1)
        : Math.random();
    const index = Math.floor(rng * topN.length);
    const selected = topN[index]!;

    // For display font, prefer a contrasting pairing if we can find one
    // The selected font config already has heading + body, so use as-is
    const reason = `Selected "${selected.font.name}" for ${industry}/${style || 'default'} (score: ${selected.score}, tags: ${selected.font.tags.join(', ')})`;

    return {
        display: selected.font,
        body: selected.font, // Same config — heading and body are already paired
        reason,
    };
}

/**
 * Get multiple typography options for variation generation.
 */
export function selectTypographyVariations(
    industry: string,
    count: number = 5,
    style?: string,
): AITypographyResult[] {
    const baseSeed = Date.now();
    const results: AITypographyResult[] = [];
    const usedIds = new Set<string>();

    for (let i = 0; i < count * 3 && results.length < count; i++) {
        const result = selectTypographyPairing(industry, style, baseSeed + i * 3571);
        if (!usedIds.has(result.display.id)) {
            usedIds.add(result.display.id);
            results.push(result);
        }
    }

    return results;
}
