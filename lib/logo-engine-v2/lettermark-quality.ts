/**
 * Lettermark Quality Scoring System
 *
 * Filters out generic first-letter logos by evaluating:
 * - Geometric complexity (is it constructed, not just typed?)
 * - Uniqueness (could it be swapped with any other letter?)
 * - Negative space usage (visual interest in/around the letter?)
 *
 * Quality Standards:
 * GOOD first-letter logos have at least 2 of these:
 * 1. Custom geometric construction (not just typed letter)
 * 2. Negative space usage
 * 3. Asymmetric or dynamic composition
 * 4. Integration with abstract shapes
 * 5. Unique letterform treatment
 * 6. Implied depth or dimension
 *
 * BAD first-letter logos (filter these out):
 * - Plain letter in circle/square
 * - Standard font, centered, boring
 * - No geometric interest
 * - Could be swapped with any letter
 * - Looks like a default icon
 */

export interface LettermarkQualityScore {
    /** 1-10: How constructed (not typed) is the letter? */
    geometricComplexity: number;
    /** 1-10: Could this be swapped with another letter and look generic? */
    uniqueness: number;
    /** 1-10: Does it use negative space creatively? */
    negativeSpaceUsage: number;
    /** Would a designer call this generic? */
    isGeneric: boolean;
    /** Weighted average (0-10) */
    overallScore: number;
    /** Does it pass the quality threshold? */
    passesQualityCheck: boolean;
    /** Quality metrics breakdown */
    metrics: {
        hasGeometricConstruction: boolean;
        hasNegativeSpace: boolean;
        hasAsymmetry: boolean;
        hasAbstractIntegration: boolean;
        hasDepthOrDimension: boolean;
        hasUniqueLetterform: boolean;
    };
}

/**
 * Algorithms that are known to produce distinctive lettermarks
 */
export const PREMIUM_LETTERMARK_ALGORITHMS = [
    'Geometric Deconstruction',
    'Prism Deconstruct',
    'Fragment Assembly',
    'Negative Space Letter',
    'Void Form',
    'Inverse Mark',
    'Layered Dimensional',
    'Depth Stack',
    'Shadow Planes',
    'Abstract Integration',
    'Geometric Blend',
    'Compositional Mark',
    'Architectural Letter',
    'Blueprint Mark',
    'Construction Plan',
    'Dynamic Asymmetric',
    'Offset Energy',
    'Tilt Mark',
    'Monogram Fusion',
    'Mark Integration',
    'Signature Blend',
];

/**
 * Score a lettermark SVG for quality
 */
export function scoreLettermarkQuality(
    svgString: string,
    algorithmName: string
): LettermarkQualityScore {
    // Analyze SVG structure
    const hasMultiplePaths = (svgString.match(/<path/g) || []).length > 1;
    const hasPolygons = svgString.indexOf('<polygon') >= 0;
    const hasMultipleCircles = (svgString.match(/<circle/g) || []).length > 2;
    const hasTransforms = svgString.indexOf('transform=') >= 0;
    const hasGradients = svgString.indexOf('linearGradient') >= 0 || svgString.indexOf('radialGradient') >= 0;
    const hasMasks = svgString.indexOf('<mask') >= 0;
    const hasLines = (svgString.match(/<line/g) || []).length > 1;
    const hasRects = (svgString.match(/<rect/g) || []).length > 1;
    const hasOpacityVariation = svgString.indexOf('opacity="0.') >= 0;

    // Check for generic patterns (BAD)
    const hasSimpleTextOnly = svgString.indexOf('<text') >= 0 && !hasMultiplePaths && !hasPolygons && !hasRects;
    const hasBasicCircleContainer = /r=["']4[0-5]["']/.test(svgString) && !hasMasks;
    const hasCenteredTextOnly = svgString.indexOf('text-anchor="middle"') >= 0 && !hasTransforms && !hasMultiplePaths;

    // Calculate quality metrics
    const metrics = {
        hasGeometricConstruction: hasMultiplePaths || hasPolygons || (hasRects && hasTransforms),
        hasNegativeSpace: hasMasks || (hasPolygons && hasMultiplePaths),
        hasAsymmetry: hasTransforms || hasOpacityVariation,
        hasAbstractIntegration: (hasPolygons || hasMultipleCircles) && hasMultiplePaths,
        hasDepthOrDimension: hasGradients || hasOpacityVariation || hasTransforms,
        hasUniqueLetterform: hasLines || hasPolygons || hasMasks,
    };

    // Count quality signals
    let qualitySignals = 0;
    if (metrics.hasGeometricConstruction) qualitySignals++;
    if (metrics.hasNegativeSpace) qualitySignals++;
    if (metrics.hasAsymmetry) qualitySignals++;
    if (metrics.hasAbstractIntegration) qualitySignals++;
    if (metrics.hasDepthOrDimension) qualitySignals++;
    if (metrics.hasUniqueLetterform) qualitySignals++;

    // Calculate scores
    let geometricComplexity = 3; // Base score
    if (metrics.hasGeometricConstruction) geometricComplexity += 2;
    if (hasMultiplePaths) geometricComplexity += 1;
    if (hasPolygons) geometricComplexity += 2;
    if (hasTransforms) geometricComplexity += 1;
    if (hasLines) geometricComplexity += 1;
    geometricComplexity = Math.min(10, geometricComplexity);

    let uniqueness = 4; // Base score
    if (metrics.hasNegativeSpace) uniqueness += 2;
    if (metrics.hasAsymmetry) uniqueness += 1;
    if (metrics.hasUniqueLetterform) uniqueness += 2;
    // Check if algorithm is premium
    let isPremium = false;
    for (let i = 0; i < PREMIUM_LETTERMARK_ALGORITHMS.length; i++) {
        if (algorithmName.indexOf(PREMIUM_LETTERMARK_ALGORITHMS[i]) >= 0) {
            isPremium = true;
            break;
        }
    }
    if (isPremium) uniqueness += 1;
    uniqueness = Math.min(10, uniqueness);

    let negativeSpaceUsage = 3; // Base score
    if (hasMasks) negativeSpaceUsage += 4;
    if (metrics.hasAbstractIntegration) negativeSpaceUsage += 2;
    if (hasPolygons && hasMultiplePaths) negativeSpaceUsage += 1;
    negativeSpaceUsage = Math.min(10, negativeSpaceUsage);

    // Penalize generic patterns
    if (hasSimpleTextOnly && !hasTransforms) {
        geometricComplexity = Math.max(1, geometricComplexity - 4);
        uniqueness = Math.max(1, uniqueness - 4);
    }
    if (hasBasicCircleContainer && hasCenteredTextOnly) {
        geometricComplexity = Math.max(1, geometricComplexity - 3);
        uniqueness = Math.max(1, uniqueness - 3);
    }

    // Boost for known premium algorithms
    if (isPremium) {
        geometricComplexity = Math.min(10, geometricComplexity + 1);
        uniqueness = Math.min(10, uniqueness + 1);
        negativeSpaceUsage = Math.min(10, negativeSpaceUsage + 1);
    }

    // Determine if generic
    const isGeneric = (
        geometricComplexity < 5 &&
        uniqueness < 5 &&
        qualitySignals < 2
    );

    // Calculate overall score (weighted)
    const overallScore = Number((
        geometricComplexity * 0.35 +
        uniqueness * 0.35 +
        negativeSpaceUsage * 0.30
    ).toFixed(1));

    // Must score 6.5+ AND have at least 2 quality signals to pass
    const passesQualityCheck = overallScore >= 6.5 && qualitySignals >= 2 && !isGeneric;

    return {
        geometricComplexity,
        uniqueness,
        negativeSpaceUsage,
        isGeneric,
        overallScore,
        passesQualityCheck,
        metrics,
    };
}

/**
 * Get the best lettermark variants for a given brand
 * Filters out generic options and returns only quality lettermarks
 */
export function getQualityLettermarkVariants(): string[] {
    return [
        'deconstructed',
        'negative-space',
        'dimensional',
        'architectural',
        'asymmetric',
        'fusion',
    ];
}

/**
 * Check if a lettermark variant is a premium quality variant
 */
export function isPremiumLettermarkVariant(variant: string): boolean {
    const premiumVariants = [
        'deconstructed',
        'negative-space',
        'dimensional',
        'architectural',
        'asymmetric',
        'fusion',
    ];
    for (let i = 0; i < premiumVariants.length; i++) {
        if (variant.toLowerCase() === premiumVariants[i]) {
            return true;
        }
    }
    return false;
}

/**
 * Get recommended lettermark algorithm for a letter based on its anatomy
 */
export function getRecommendedLettermarkAlgorithm(letter: string): string {
    const upperLetter = letter.toUpperCase();

    // Letters with diagonals benefit from deconstruction
    const diagonalLetters = ['A', 'K', 'M', 'N', 'V', 'W', 'X', 'Y', 'Z'];
    for (let i = 0; i < diagonalLetters.length; i++) {
        if (upperLetter === diagonalLetters[i]) {
            return 'Geometric Deconstruction';
        }
    }

    // Round letters work well with negative space
    const roundLetters = ['C', 'G', 'O', 'Q', 'S'];
    for (let i = 0; i < roundLetters.length; i++) {
        if (upperLetter === roundLetters[i]) {
            return 'Negative Space Letter';
        }
    }

    // Letters with stems benefit from architectural treatment
    const stemLetters = ['B', 'D', 'E', 'F', 'H', 'I', 'L', 'P', 'R', 'T'];
    for (let i = 0; i < stemLetters.length; i++) {
        if (upperLetter === stemLetters[i]) {
            return 'Architectural Letter';
        }
    }

    // Letters with unique shapes get fusion treatment
    if (upperLetter === 'J' || upperLetter === 'U') {
        return 'Monogram Fusion';
    }

    // Default to dimensional for other cases
    return 'Layered Dimensional';
}

/**
 * Prompt additions for AI-based logo generation
 * Use these to improve AI-generated first-letter logos
 */
export const LETTERMARK_PROMPT_ADDITIONS = {
    include: [
        'geometric construction of the letter',
        'abstract interpretation, not standard font',
        'negative space treatment',
        'unique letterform with architectural elements',
        'dynamic asymmetric composition',
        'layered geometric shapes forming the letter',
        'deconstructed geometric primitives',
        'implied depth or dimension',
    ],
    avoid: [
        'simple or basic',
        'letter in a circle',
        'letter in a square',
        'centered composition',
        'standard font',
        'plain monogram',
        'generic lettermark',
        'clip-art style',
    ],
};

export default {
    scoreLettermarkQuality,
    getQualityLettermarkVariants,
    isPremiumLettermarkVariant,
    getRecommendedLettermarkAlgorithm,
    PREMIUM_LETTERMARK_ALGORITHMS,
    LETTERMARK_PROMPT_ADDITIONS,
};
