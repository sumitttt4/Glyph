/**
 * Smart Logo System
 *
 * Enhanced logo generation logic with:
 * - Industry/category-based algorithm selection
 * - Brand personality profiling
 * - Style consistency enforcement
 * - Accessibility validation
 * - Intelligent logo+wordmark combinations
 */

import { createSeededRandom } from './parametric-engine';
import { hexToRgb, rgbToHsl, getContrastRatio } from './color-utils';

// ============================================================================
// TYPES
// ============================================================================

export type Industry =
    | 'technology' | 'finance' | 'healthcare' | 'creative'
    | 'ecommerce' | 'education' | 'sustainability' | 'food'
    | 'fashion' | 'sports' | 'entertainment' | 'nonprofit'
    | 'legal' | 'realestate' | 'automotive' | 'travel'
    | 'general';

export type BrandPersonality =
    | 'professional' | 'playful' | 'bold' | 'elegant'
    | 'minimal' | 'innovative' | 'trustworthy' | 'friendly'
    | 'luxurious' | 'energetic' | 'calm' | 'adventurous';

export type VisualStyle =
    | 'geometric' | 'organic' | 'abstract' | 'illustrative'
    | 'typographic' | 'symbolic' | 'emblem' | 'mascot';

export type LogoAlgorithmType =
    | 'line-fragmentation' | 'staggered-bars' | 'block-assembly'
    | 'motion-chevrons' | 'negative-space' | 'interlocking-loops'
    | 'monogram-merge' | 'continuous-stroke' | 'geometric-extract'
    | 'clover-radial' | 'radial-sunburst' | 'striped-organic'
    | 'twisted-square' | 'organic-dot-cluster' | 'sunrise-horizon'
    | 'dimensional-cube' | 'asterisk-star' | 'arrow-convergence'
    | 'hexagonal-bloom' | 'circular-orbit';

export interface BrandProfile {
    name: string;
    industry: Industry;
    personality: BrandPersonality[];
    style: VisualStyle;
    keywords?: string[];
    targetAudience?: 'b2b' | 'b2c' | 'both';
    brandAge?: 'startup' | 'established' | 'legacy';
}

export interface AlgorithmScore {
    algorithm: LogoAlgorithmType;
    score: number;
    reasons: string[];
}

export interface AccessibilityResult {
    passes: boolean;
    contrastRatio: number;
    wcagLevel: 'AAA' | 'AA' | 'A' | 'fail';
    recommendations: string[];
}

export interface StyleConsistencyResult {
    consistent: boolean;
    score: number; // 0-100
    issues: string[];
    suggestions: string[];
}

// ============================================================================
// INDUSTRY → ALGORITHM MAPPING
// ============================================================================

/**
 * Maps industries to their most suitable algorithms
 * Each industry has primary (high match), secondary (good match), and avoid lists
 */
const INDUSTRY_ALGORITHM_MAP: Record<Industry, {
    primary: LogoAlgorithmType[];
    secondary: LogoAlgorithmType[];
    avoid: LogoAlgorithmType[];
}> = {
    technology: {
        primary: ['line-fragmentation', 'dimensional-cube', 'hexagonal-bloom', 'circular-orbit', 'asterisk-star'],
        secondary: ['block-assembly', 'motion-chevrons', 'interlocking-loops', 'geometric-extract'],
        avoid: ['organic-dot-cluster', 'striped-organic', 'sunrise-horizon']
    },
    finance: {
        primary: ['staggered-bars', 'block-assembly', 'geometric-extract', 'arrow-convergence'],
        secondary: ['negative-space', 'monogram-merge', 'hexagonal-bloom', 'dimensional-cube'],
        avoid: ['organic-dot-cluster', 'striped-organic', 'clover-radial', 'continuous-stroke']
    },
    healthcare: {
        primary: ['clover-radial', 'organic-dot-cluster', 'circular-orbit', 'interlocking-loops'],
        secondary: ['negative-space', 'geometric-extract', 'hexagonal-bloom'],
        avoid: ['staggered-bars', 'motion-chevrons', 'twisted-square', 'dimensional-cube']
    },
    creative: {
        primary: ['continuous-stroke', 'striped-organic', 'twisted-square', 'organic-dot-cluster'],
        secondary: ['line-fragmentation', 'radial-sunburst', 'clover-radial', 'motion-chevrons'],
        avoid: ['staggered-bars', 'block-assembly']
    },
    ecommerce: {
        primary: ['arrow-convergence', 'dimensional-cube', 'negative-space', 'motion-chevrons'],
        secondary: ['staggered-bars', 'block-assembly', 'asterisk-star'],
        avoid: ['organic-dot-cluster', 'striped-organic']
    },
    education: {
        primary: ['geometric-extract', 'negative-space', 'sunrise-horizon', 'hexagonal-bloom'],
        secondary: ['clover-radial', 'interlocking-loops', 'monogram-merge'],
        avoid: ['motion-chevrons', 'twisted-square', 'dimensional-cube']
    },
    sustainability: {
        primary: ['clover-radial', 'organic-dot-cluster', 'sunrise-horizon', 'circular-orbit'],
        secondary: ['striped-organic', 'continuous-stroke', 'radial-sunburst'],
        avoid: ['dimensional-cube', 'staggered-bars', 'block-assembly']
    },
    food: {
        primary: ['clover-radial', 'organic-dot-cluster', 'radial-sunburst', 'striped-organic'],
        secondary: ['negative-space', 'continuous-stroke', 'sunrise-horizon'],
        avoid: ['dimensional-cube', 'line-fragmentation', 'hexagonal-bloom']
    },
    fashion: {
        primary: ['monogram-merge', 'geometric-extract', 'continuous-stroke', 'negative-space'],
        secondary: ['twisted-square', 'line-fragmentation', 'striped-organic'],
        avoid: ['dimensional-cube', 'sunrise-horizon', 'circular-orbit']
    },
    sports: {
        primary: ['motion-chevrons', 'arrow-convergence', 'radial-sunburst', 'asterisk-star'],
        secondary: ['staggered-bars', 'geometric-extract', 'block-assembly'],
        avoid: ['organic-dot-cluster', 'striped-organic', 'continuous-stroke']
    },
    entertainment: {
        primary: ['radial-sunburst', 'asterisk-star', 'motion-chevrons', 'circular-orbit'],
        secondary: ['continuous-stroke', 'twisted-square', 'striped-organic'],
        avoid: ['staggered-bars', 'block-assembly']
    },
    nonprofit: {
        primary: ['interlocking-loops', 'clover-radial', 'circular-orbit', 'organic-dot-cluster'],
        secondary: ['sunrise-horizon', 'hexagonal-bloom', 'negative-space'],
        avoid: ['dimensional-cube', 'staggered-bars']
    },
    legal: {
        primary: ['geometric-extract', 'negative-space', 'staggered-bars', 'monogram-merge'],
        secondary: ['block-assembly', 'hexagonal-bloom'],
        avoid: ['organic-dot-cluster', 'striped-organic', 'continuous-stroke', 'clover-radial']
    },
    realestate: {
        primary: ['block-assembly', 'dimensional-cube', 'geometric-extract', 'arrow-convergence'],
        secondary: ['negative-space', 'staggered-bars', 'sunrise-horizon'],
        avoid: ['organic-dot-cluster', 'striped-organic', 'clover-radial']
    },
    automotive: {
        primary: ['motion-chevrons', 'arrow-convergence', 'geometric-extract', 'circular-orbit'],
        secondary: ['staggered-bars', 'dimensional-cube', 'asterisk-star'],
        avoid: ['organic-dot-cluster', 'clover-radial', 'striped-organic']
    },
    travel: {
        primary: ['sunrise-horizon', 'arrow-convergence', 'circular-orbit', 'radial-sunburst'],
        secondary: ['motion-chevrons', 'continuous-stroke', 'organic-dot-cluster'],
        avoid: ['staggered-bars', 'block-assembly', 'hexagonal-bloom']
    },
    general: {
        primary: ['negative-space', 'geometric-extract', 'monogram-merge', 'clover-radial'],
        secondary: ['radial-sunburst', 'asterisk-star', 'interlocking-loops'],
        avoid: []
    }
};

// ============================================================================
// PERSONALITY → ALGORITHM MAPPING
// ============================================================================

/**
 * Maps brand personalities to algorithm preferences
 */
const PERSONALITY_ALGORITHM_MAP: Record<BrandPersonality, {
    boost: LogoAlgorithmType[];
    penalize: LogoAlgorithmType[];
}> = {
    professional: {
        boost: ['geometric-extract', 'negative-space', 'staggered-bars', 'monogram-merge', 'hexagonal-bloom'],
        penalize: ['organic-dot-cluster', 'striped-organic', 'continuous-stroke']
    },
    playful: {
        boost: ['organic-dot-cluster', 'clover-radial', 'radial-sunburst', 'continuous-stroke'],
        penalize: ['staggered-bars', 'block-assembly', 'geometric-extract']
    },
    bold: {
        boost: ['motion-chevrons', 'arrow-convergence', 'staggered-bars', 'asterisk-star', 'block-assembly'],
        penalize: ['continuous-stroke', 'organic-dot-cluster', 'striped-organic']
    },
    elegant: {
        boost: ['monogram-merge', 'continuous-stroke', 'geometric-extract', 'negative-space'],
        penalize: ['staggered-bars', 'motion-chevrons', 'block-assembly']
    },
    minimal: {
        boost: ['negative-space', 'geometric-extract', 'line-fragmentation', 'circular-orbit'],
        penalize: ['dimensional-cube', 'hexagonal-bloom', 'organic-dot-cluster']
    },
    innovative: {
        boost: ['dimensional-cube', 'twisted-square', 'hexagonal-bloom', 'circular-orbit', 'line-fragmentation'],
        penalize: ['monogram-merge', 'clover-radial']
    },
    trustworthy: {
        boost: ['interlocking-loops', 'hexagonal-bloom', 'circular-orbit', 'negative-space'],
        penalize: ['twisted-square', 'continuous-stroke', 'striped-organic']
    },
    friendly: {
        boost: ['clover-radial', 'organic-dot-cluster', 'radial-sunburst', 'interlocking-loops'],
        penalize: ['staggered-bars', 'block-assembly', 'geometric-extract']
    },
    luxurious: {
        boost: ['monogram-merge', 'geometric-extract', 'negative-space', 'continuous-stroke'],
        penalize: ['organic-dot-cluster', 'clover-radial', 'staggered-bars']
    },
    energetic: {
        boost: ['motion-chevrons', 'radial-sunburst', 'arrow-convergence', 'asterisk-star'],
        penalize: ['continuous-stroke', 'organic-dot-cluster', 'negative-space']
    },
    calm: {
        boost: ['circular-orbit', 'organic-dot-cluster', 'sunrise-horizon', 'continuous-stroke'],
        penalize: ['motion-chevrons', 'staggered-bars', 'asterisk-star']
    },
    adventurous: {
        boost: ['arrow-convergence', 'sunrise-horizon', 'motion-chevrons', 'radial-sunburst'],
        penalize: ['staggered-bars', 'block-assembly', 'hexagonal-bloom']
    }
};

// ============================================================================
// SMART ALGORITHM SELECTION
// ============================================================================

/**
 * Intelligently selects the best algorithms for a brand based on
 * industry, personality, name characteristics, and style preferences
 */
export function selectBestAlgorithms(profile: BrandProfile): AlgorithmScore[] {
    const scores: Map<LogoAlgorithmType, { score: number; reasons: string[] }> = new Map();

    // Initialize all algorithms with base score
    const allAlgorithms: LogoAlgorithmType[] = [
        'line-fragmentation', 'staggered-bars', 'block-assembly',
        'motion-chevrons', 'negative-space', 'interlocking-loops',
        'monogram-merge', 'continuous-stroke', 'geometric-extract',
        'clover-radial', 'radial-sunburst', 'striped-organic',
        'twisted-square', 'organic-dot-cluster', 'sunrise-horizon',
        'dimensional-cube', 'asterisk-star', 'arrow-convergence',
        'hexagonal-bloom', 'circular-orbit'
    ];

    allAlgorithms.forEach(algo => {
        scores.set(algo, { score: 50, reasons: [] });
    });

    // 1. Apply industry scoring (highest weight)
    const industryMap = INDUSTRY_ALGORITHM_MAP[profile.industry];

    industryMap.primary.forEach(algo => {
        const entry = scores.get(algo)!;
        entry.score += 30;
        entry.reasons.push(`Primary choice for ${profile.industry} industry`);
    });

    industryMap.secondary.forEach(algo => {
        const entry = scores.get(algo)!;
        entry.score += 15;
        entry.reasons.push(`Good fit for ${profile.industry} industry`);
    });

    industryMap.avoid.forEach(algo => {
        const entry = scores.get(algo)!;
        entry.score -= 25;
        entry.reasons.push(`Not recommended for ${profile.industry} industry`);
    });

    // 2. Apply personality scoring
    profile.personality.forEach(personality => {
        const personalityMap = PERSONALITY_ALGORITHM_MAP[personality];

        personalityMap.boost.forEach(algo => {
            const entry = scores.get(algo)!;
            entry.score += 15;
            entry.reasons.push(`Matches ${personality} personality`);
        });

        personalityMap.penalize.forEach(algo => {
            const entry = scores.get(algo)!;
            entry.score -= 10;
            entry.reasons.push(`Conflicts with ${personality} personality`);
        });
    });

    // 3. Apply name-based heuristics
    const name = profile.name.toLowerCase();
    const nameLength = name.length;
    const words = name.split(/\s+/);

    // Short names favor lettermark styles
    if (nameLength <= 5) {
        ['monogram-merge', 'negative-space', 'geometric-extract'].forEach(algo => {
            const entry = scores.get(algo as LogoAlgorithmType)!;
            entry.score += 10;
            entry.reasons.push('Short name favors lettermark approach');
        });
    }

    // Multi-word names favor monograms
    if (words.length >= 2) {
        const entry = scores.get('monogram-merge')!;
        entry.score += 20;
        entry.reasons.push('Multi-word name ideal for monogram');
    }

    // Names with certain letters favor radial designs
    if (/[oqc]/i.test(name.charAt(0))) {
        ['clover-radial', 'circular-orbit', 'radial-sunburst'].forEach(algo => {
            const entry = scores.get(algo as LogoAlgorithmType)!;
            entry.score += 10;
            entry.reasons.push('Initial letter suits radial design');
        });
    }

    // 4. Apply style preference
    const styleAlgorithmMap: Record<VisualStyle, LogoAlgorithmType[]> = {
        geometric: ['geometric-extract', 'hexagonal-bloom', 'block-assembly', 'dimensional-cube'],
        organic: ['organic-dot-cluster', 'striped-organic', 'continuous-stroke', 'clover-radial'],
        abstract: ['line-fragmentation', 'circular-orbit', 'twisted-square', 'radial-sunburst'],
        illustrative: ['striped-organic', 'organic-dot-cluster', 'clover-radial'],
        typographic: ['monogram-merge', 'negative-space', 'geometric-extract'],
        symbolic: ['asterisk-star', 'radial-sunburst', 'arrow-convergence', 'sunrise-horizon'],
        emblem: ['negative-space', 'hexagonal-bloom', 'circular-orbit'],
        mascot: ['striped-organic', 'organic-dot-cluster']
    };

    (styleAlgorithmMap[profile.style] || []).forEach(algo => {
        const entry = scores.get(algo)!;
        entry.score += 20;
        entry.reasons.push(`Matches ${profile.style} visual style`);
    });

    // 5. Apply target audience modifiers
    if (profile.targetAudience === 'b2b') {
        ['geometric-extract', 'staggered-bars', 'block-assembly', 'hexagonal-bloom'].forEach(algo => {
            const entry = scores.get(algo as LogoAlgorithmType)!;
            entry.score += 5;
            entry.reasons.push('Professional B2B aesthetic');
        });
    } else if (profile.targetAudience === 'b2c') {
        ['clover-radial', 'organic-dot-cluster', 'radial-sunburst'].forEach(algo => {
            const entry = scores.get(algo as LogoAlgorithmType)!;
            entry.score += 5;
            entry.reasons.push('Consumer-friendly aesthetic');
        });
    }

    // 6. Apply brand age modifiers
    if (profile.brandAge === 'startup') {
        ['dimensional-cube', 'twisted-square', 'hexagonal-bloom', 'circular-orbit'].forEach(algo => {
            const entry = scores.get(algo as LogoAlgorithmType)!;
            entry.score += 5;
            entry.reasons.push('Modern startup aesthetic');
        });
    } else if (profile.brandAge === 'legacy') {
        ['monogram-merge', 'negative-space', 'geometric-extract'].forEach(algo => {
            const entry = scores.get(algo as LogoAlgorithmType)!;
            entry.score += 5;
            entry.reasons.push('Classic established brand aesthetic');
        });
    }

    // Convert to sorted array
    const result: AlgorithmScore[] = [];
    scores.forEach((value, algorithm) => {
        result.push({
            algorithm,
            score: Math.max(0, Math.min(100, value.score)),
            reasons: value.reasons
        });
    });

    return result.sort((a, b) => b.score - a.score);
}

/**
 * Get top N algorithms for a brand profile
 */
export function getTopAlgorithms(profile: BrandProfile, count: number = 5): LogoAlgorithmType[] {
    return selectBestAlgorithms(profile).slice(0, count).map(s => s.algorithm);
}

// ============================================================================
// ACCESSIBILITY VALIDATION
// ============================================================================

/**
 * Validates logo accessibility based on color contrast
 */
export function validateAccessibility(
    foregroundColor: string,
    backgroundColor: string
): AccessibilityResult {
    const contrast = getContrastRatio(foregroundColor, backgroundColor);

    let wcagLevel: 'AAA' | 'AA' | 'A' | 'fail';
    if (contrast >= 7) {
        wcagLevel = 'AAA';
    } else if (contrast >= 4.5) {
        wcagLevel = 'AA';
    } else if (contrast >= 3) {
        wcagLevel = 'A';
    } else {
        wcagLevel = 'fail';
    }

    const recommendations: string[] = [];

    if (contrast < 4.5) {
        recommendations.push('Increase color contrast for better readability');

        // Suggest adjustments
        const fgRgb = hexToRgb(foregroundColor);
        const bgRgb = hexToRgb(backgroundColor);

        if (fgRgb && bgRgb) {
            const fgLuminance = (0.299 * fgRgb.r + 0.587 * fgRgb.g + 0.114 * fgRgb.b) / 255;
            const bgLuminance = (0.299 * bgRgb.r + 0.587 * bgRgb.g + 0.114 * bgRgb.b) / 255;

            if (fgLuminance > bgLuminance) {
                recommendations.push('Try using a lighter foreground or darker background');
            } else {
                recommendations.push('Try using a darker foreground or lighter background');
            }
        }
    }

    if (contrast < 3) {
        recommendations.push('Logo may be difficult to see for users with visual impairments');
        recommendations.push('Consider adding a stroke or shadow for better visibility');
    }

    return {
        passes: contrast >= 4.5,
        contrastRatio: Math.round(contrast * 100) / 100,
        wcagLevel,
        recommendations
    };
}

/**
 * Check accessibility across multiple background colors
 */
export function validateMultiBackgroundAccessibility(
    logoColor: string,
    backgrounds: string[]
): { background: string; result: AccessibilityResult }[] {
    return backgrounds.map(bg => ({
        background: bg,
        result: validateAccessibility(logoColor, bg)
    }));
}

// ============================================================================
// STYLE CONSISTENCY
// ============================================================================

/**
 * Validates that generated logo matches the brand profile style
 */
export function validateStyleConsistency(
    algorithm: LogoAlgorithmType,
    profile: BrandProfile
): StyleConsistencyResult {
    const scores = selectBestAlgorithms(profile);
    const algorithmScore = scores.find(s => s.algorithm === algorithm);

    if (!algorithmScore) {
        return {
            consistent: false,
            score: 0,
            issues: ['Algorithm not found in scoring system'],
            suggestions: ['Use one of the recommended algorithms']
        };
    }

    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check industry alignment
    const industryMap = INDUSTRY_ALGORITHM_MAP[profile.industry];
    if (industryMap.avoid.includes(algorithm)) {
        issues.push(`Algorithm ${algorithm} is not recommended for ${profile.industry} industry`);
        suggestions.push(`Consider using: ${industryMap.primary.slice(0, 3).join(', ')}`);
    }

    // Check personality alignment
    profile.personality.forEach(personality => {
        const personalityMap = PERSONALITY_ALGORITHM_MAP[personality];
        if (personalityMap.penalize.includes(algorithm)) {
            issues.push(`Algorithm may conflict with ${personality} brand personality`);
        }
    });

    // Score threshold
    const isConsistent = algorithmScore.score >= 60;

    if (!isConsistent && suggestions.length === 0) {
        const topAlgos = scores.slice(0, 3).map(s => s.algorithm);
        suggestions.push(`Better alternatives: ${topAlgos.join(', ')}`);
    }

    return {
        consistent: isConsistent,
        score: algorithmScore.score,
        issues,
        suggestions
    };
}

// ============================================================================
// WORDMARK STYLE MATCHING
// ============================================================================

export type WordmarkStyle =
    | 'sans-serif-modern' | 'sans-serif-geometric' | 'sans-serif-humanist'
    | 'serif-classic' | 'serif-modern' | 'slab-serif'
    | 'display-bold' | 'display-thin' | 'script' | 'monospace';

/**
 * Suggests wordmark styles that complement a given logo algorithm
 */
export function suggestWordmarkStyles(
    algorithm: LogoAlgorithmType,
    profile: BrandProfile
): { style: WordmarkStyle; compatibility: number; reasoning: string }[] {
    const suggestions: { style: WordmarkStyle; compatibility: number; reasoning: string }[] = [];

    // Geometric algorithms pair well with geometric sans
    const geometricAlgos = ['geometric-extract', 'hexagonal-bloom', 'block-assembly', 'dimensional-cube', 'line-fragmentation'];
    if (geometricAlgos.includes(algorithm)) {
        suggestions.push({
            style: 'sans-serif-geometric',
            compatibility: 95,
            reasoning: 'Geometric logo pairs perfectly with geometric typography'
        });
        suggestions.push({
            style: 'monospace',
            compatibility: 80,
            reasoning: 'Technical/modern feel complements geometric forms'
        });
    }

    // Organic algorithms pair well with humanist fonts
    const organicAlgos = ['organic-dot-cluster', 'striped-organic', 'continuous-stroke', 'clover-radial'];
    if (organicAlgos.includes(algorithm)) {
        suggestions.push({
            style: 'sans-serif-humanist',
            compatibility: 90,
            reasoning: 'Organic curves match humanist letterforms'
        });
        suggestions.push({
            style: 'script',
            compatibility: 75,
            reasoning: 'Flowing script echoes organic shapes'
        });
    }

    // Premium/elegant algorithms pair with serifs
    const elegantAlgos = ['monogram-merge', 'negative-space'];
    if (elegantAlgos.includes(algorithm)) {
        suggestions.push({
            style: 'serif-modern',
            compatibility: 90,
            reasoning: 'Refined serif typography matches elegant mark'
        });
        suggestions.push({
            style: 'serif-classic',
            compatibility: 85,
            reasoning: 'Classic serif adds timeless sophistication'
        });
    }

    // Bold/energetic algorithms pair with display fonts
    const boldAlgos = ['motion-chevrons', 'arrow-convergence', 'asterisk-star', 'radial-sunburst'];
    if (boldAlgos.includes(algorithm)) {
        suggestions.push({
            style: 'display-bold',
            compatibility: 90,
            reasoning: 'Bold typography matches energetic symbol'
        });
        suggestions.push({
            style: 'sans-serif-modern',
            compatibility: 85,
            reasoning: 'Clean modern sans maintains dynamic feel'
        });
    }

    // Apply personality modifiers
    if (profile.personality.includes('luxurious')) {
        suggestions.push({
            style: 'serif-modern',
            compatibility: 85,
            reasoning: 'Luxury brands often use refined serifs'
        });
    }

    if (profile.personality.includes('minimal')) {
        suggestions.push({
            style: 'sans-serif-geometric',
            compatibility: 90,
            reasoning: 'Minimal aesthetic favors clean geometry'
        });
    }

    if (profile.personality.includes('friendly')) {
        suggestions.push({
            style: 'sans-serif-humanist',
            compatibility: 85,
            reasoning: 'Humanist fonts feel approachable and friendly'
        });
    }

    // Default fallback
    if (suggestions.length === 0) {
        suggestions.push({
            style: 'sans-serif-modern',
            compatibility: 75,
            reasoning: 'Modern sans-serif is versatile and widely applicable'
        });
    }

    // Remove duplicates and sort by compatibility
    const unique = suggestions.reduce((acc, curr) => {
        const existing = acc.find(s => s.style === curr.style);
        if (!existing || existing.compatibility < curr.compatibility) {
            return [...acc.filter(s => s.style !== curr.style), curr];
        }
        return acc;
    }, [] as typeof suggestions);

    return unique.sort((a, b) => b.compatibility - a.compatibility);
}

// ============================================================================
// COLOR PALETTE SUGGESTIONS
// ============================================================================

export interface ColorPaletteSuggestion {
    name: string;
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    reasoning: string;
}

/**
 * Suggests color palettes based on industry and personality
 */
export function suggestColorPalettes(profile: BrandProfile): ColorPaletteSuggestion[] {
    const palettes: ColorPaletteSuggestion[] = [];

    // Industry-based palettes
    const industryPalettes: Partial<Record<Industry, ColorPaletteSuggestion[]>> = {
        technology: [
            {
                name: 'Tech Blue',
                primary: '#0066FF',
                secondary: '#00D4FF',
                accent: '#FF6B35',
                background: '#FFFFFF',
                text: '#1A1A2E',
                reasoning: 'Classic tech blue conveys innovation and trust'
            },
            {
                name: 'Dark Mode',
                primary: '#6366F1',
                secondary: '#22D3EE',
                accent: '#F472B6',
                background: '#0F172A',
                text: '#F8FAFC',
                reasoning: 'Modern dark palette popular with tech audiences'
            }
        ],
        healthcare: [
            {
                name: 'Healing Green',
                primary: '#10B981',
                secondary: '#34D399',
                accent: '#3B82F6',
                background: '#FFFFFF',
                text: '#1F2937',
                reasoning: 'Green represents health, growth, and wellness'
            },
            {
                name: 'Medical Blue',
                primary: '#0EA5E9',
                secondary: '#38BDF8',
                accent: '#10B981',
                background: '#FFFFFF',
                text: '#0F172A',
                reasoning: 'Blue builds trust and professionalism in healthcare'
            }
        ],
        finance: [
            {
                name: 'Trust Blue',
                primary: '#1E3A8A',
                secondary: '#3B82F6',
                accent: '#F59E0B',
                background: '#FFFFFF',
                text: '#111827',
                reasoning: 'Deep blue conveys stability and trustworthiness'
            },
            {
                name: 'Modern Finance',
                primary: '#059669',
                secondary: '#34D399',
                accent: '#6366F1',
                background: '#FFFFFF',
                text: '#1F2937',
                reasoning: 'Green represents growth and prosperity'
            }
        ],
        creative: [
            {
                name: 'Creative Burst',
                primary: '#8B5CF6',
                secondary: '#EC4899',
                accent: '#F59E0B',
                background: '#FFFFFF',
                text: '#1F2937',
                reasoning: 'Vibrant purple and pink spark creativity'
            },
            {
                name: 'Bold Expression',
                primary: '#EF4444',
                secondary: '#F97316',
                accent: '#8B5CF6',
                background: '#FAFAFA',
                text: '#18181B',
                reasoning: 'Warm bold colors convey passion and energy'
            }
        ],
        sustainability: [
            {
                name: 'Earth Tones',
                primary: '#059669',
                secondary: '#84CC16',
                accent: '#92400E',
                background: '#FEFCE8',
                text: '#1C1917',
                reasoning: 'Natural greens represent environmental consciousness'
            },
            {
                name: 'Ocean Blue',
                primary: '#0891B2',
                secondary: '#06B6D4',
                accent: '#059669',
                background: '#FFFFFF',
                text: '#164E63',
                reasoning: 'Ocean colors connect to environmental causes'
            }
        ]
    };

    // Add industry palettes
    const industry = industryPalettes[profile.industry];
    if (industry) {
        palettes.push(...industry);
    }

    // Personality-based adjustments
    if (profile.personality.includes('luxurious')) {
        palettes.push({
            name: 'Luxury Gold',
            primary: '#1C1917',
            secondary: '#D4AF37',
            accent: '#B8860B',
            background: '#FFFBEB',
            text: '#1C1917',
            reasoning: 'Black and gold convey premium luxury'
        });
    }

    if (profile.personality.includes('playful')) {
        palettes.push({
            name: 'Playful Pop',
            primary: '#F472B6',
            secondary: '#A78BFA',
            accent: '#FBBF24',
            background: '#FFFFFF',
            text: '#1F2937',
            reasoning: 'Bright playful colors appeal to fun-loving audiences'
        });
    }

    if (profile.personality.includes('calm')) {
        palettes.push({
            name: 'Serene',
            primary: '#64748B',
            secondary: '#94A3B8',
            accent: '#0EA5E9',
            background: '#F8FAFC',
            text: '#334155',
            reasoning: 'Soft muted tones create a calm, peaceful feel'
        });
    }

    // Default palette if none added
    if (palettes.length === 0) {
        palettes.push({
            name: 'Modern Neutral',
            primary: '#3B82F6',
            secondary: '#6366F1',
            accent: '#10B981',
            background: '#FFFFFF',
            text: '#1F2937',
            reasoning: 'Versatile modern palette suitable for most brands'
        });
    }

    return palettes;
}

// ============================================================================
// COMPLETE BRAND ANALYSIS
// ============================================================================

export interface BrandAnalysis {
    profile: BrandProfile;
    recommendedAlgorithms: AlgorithmScore[];
    wordmarkStyles: { style: WordmarkStyle; compatibility: number; reasoning: string }[];
    colorPalettes: ColorPaletteSuggestion[];
    accessibilityNotes: string[];
}

/**
 * Performs complete brand analysis and returns comprehensive recommendations
 */
export function analyzeBrand(profile: BrandProfile): BrandAnalysis {
    const recommendedAlgorithms = selectBestAlgorithms(profile).slice(0, 10);
    const topAlgorithm = recommendedAlgorithms[0]?.algorithm || 'geometric-extract';
    const wordmarkStyles = suggestWordmarkStyles(topAlgorithm, profile);
    const colorPalettes = suggestColorPalettes(profile);

    const accessibilityNotes: string[] = [
        'Ensure logo maintains minimum 4.5:1 contrast ratio for accessibility',
        'Test logo visibility on both light and dark backgrounds',
        'Provide alternative versions for different background contexts'
    ];

    if (profile.industry === 'healthcare' || profile.industry === 'education') {
        accessibilityNotes.push('Higher accessibility standards recommended for this industry');
    }

    return {
        profile,
        recommendedAlgorithms,
        wordmarkStyles,
        colorPalettes,
        accessibilityNotes
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
    INDUSTRY_ALGORITHM_MAP,
    PERSONALITY_ALGORITHM_MAP
};
