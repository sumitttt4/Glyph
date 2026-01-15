/**
 * Parametric Logo Engine v4
 *
 * Professional parametric logo generation with infinite unique outputs.
 * 10 base algorithms, each with 20+ adjustable parameters.
 * Brand name as seed for deterministic randomness.
 * Unique hash per output, stored in localStorage.
 * SVG-only output with bezier paths.
 *
 * Features:
 * - Parallel Gradient Bars (Stripe-style)
 * - Stacked Motion Lines (Linear-style)
 * - Letterform Cutouts (Notion-style)
 * - Sparkle/Asterisk (Claude-style)
 * - Overlapping Shapes (Figma-style)
 * - Arc Swooshes (Nike-style)
 * - Depth Marks (Raycast-style)
 * - Negative Space (FedEx-style)
 * - Interlocking Forms (Olympic-style)
 * - Abstract Monograms
 *
 * Plus animation export: Lottie JSON + CSS keyframes
 */

// ============================================
// TYPES
// ============================================

export type {
    LogoAlgorithm,
    LogoAesthetic,
    IndustryCategory,
    BaseParameters,
    ParallelBarsParams,
    StackedLinesParams,
    LetterformCutoutParams,
    SparkleAsteriskParams,
    OverlappingShapesParams,
    ArcSwooshParams,
    DepthMarkParams,
    NegativeSpaceParams,
    InterlockingFormsParams,
    AbstractMonogramParams,
    AlgorithmParams,
    LogoGenerationParams,
    GeneratedLogo,
    LogoMetadata,
    LogoAnimation,
    AnimationPreset,
    LottieAnimation,
    CSSAnimation,
    GradientDef,
    Point,
    BezierCurve,
    QuadraticCurve,
    Rectangle,
    PathCommand,
    Arc,
    GridConfig,
    GoldenRatioGrid,
    LogoHashRecord,
    LogoStorageState,
} from './types';

// ============================================
// CORE UTILITIES
// ============================================

export {
    PHI,
    PHI_INVERSE,
    createSeededRandom,
    generateLogoHash,
    isHashDuplicate,
    storeHash,
    getStoredHashesForBrand,
    clearStoredHashes,
    generateBaseParams,
    mergeParams,
    noise2D,
    fbm,
    addNoise,
    jitterPoint,
    lerp,
    clamp,
    mapRange,
    easeInOutCubic,
    easeOutBack,
    generateLogoId,
    calculateComplexity,
} from './core/parametric-engine';

export {
    SVGBuilder,
    createSVG,
} from './core/svg-builder';

export {
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
    lighten,
    darken,
    saturate,
    rotateHue,
    mixColors,
    withAlpha,
    luminance,
    contrastRatio,
    isLight,
    getContrastColor,
    createGradient,
    createMultiGradient,
    generateGradientPair,
    createStripeGradient,
    createTechGradient,
    createIridescentGradient,
    createMetallicGradient,
    createGlassGradient,
    createSunsetGradient,
    createDepthGradient,
    createNeonGradient,
    generateColorPalette,
    createAuroraGradient,
} from './core/color-utils';

// ============================================
// GENERATORS
// ============================================

export {
    generateParallelBars,
    generateSingleParallelBars,
} from './generators/parallel-bars';

export {
    generateStackedLines,
    generateSingleStackedLines,
} from './generators/stacked-lines';

export {
    generateLetterformCutout,
    generateSingleLetterformCutout,
} from './generators/letterform-cutout';

export {
    generateSparkleAsterisk,
    generateSingleSparkleAsterisk,
} from './generators/sparkle-asterisk';

export {
    generateOverlappingShapes,
    generateSingleOverlappingShapes,
} from './generators/overlapping-shapes';

export {
    generateArcSwoosh,
    generateSingleArcSwoosh,
} from './generators/arc-swoosh';

export {
    generateDepthMark,
    generateSingleDepthMark,
} from './generators/depth-mark';

export {
    generateNegativeSpace,
    generateSingleNegativeSpace,
} from './generators/negative-space';

export {
    generateInterlockingForms,
    generateSingleInterlockingForms,
} from './generators/interlocking-forms';

export {
    generateAbstractMonogram,
    generateSingleAbstractMonogram,
} from './generators/abstract-monogram';

// ============================================
// ANIMATION
// ============================================

export {
    ANIMATION_PRESETS,
    generateLottieAnimation,
    generateCSSAnimation,
    generateLogoAnimation,
    exportAnimationPackage,
} from './animation/animation-export';

// ============================================
// UNIFIED API
// ============================================

import { LogoGenerationParams, GeneratedLogo, LogoAlgorithm, AnimationPreset } from './types';
import { createSeededRandom } from './core/parametric-engine';
import { generateParallelBars } from './generators/parallel-bars';
import { generateStackedLines } from './generators/stacked-lines';
import { generateLetterformCutout } from './generators/letterform-cutout';
import { generateSparkleAsterisk } from './generators/sparkle-asterisk';
import { generateOverlappingShapes } from './generators/overlapping-shapes';
import { generateArcSwoosh } from './generators/arc-swoosh';
import { generateDepthMark } from './generators/depth-mark';
import { generateNegativeSpace } from './generators/negative-space';
import { generateInterlockingForms } from './generators/interlocking-forms';
import { generateAbstractMonogram } from './generators/abstract-monogram';
import { generateLogoAnimation } from './animation/animation-export';

/**
 * All available algorithms
 */
export const ALL_ALGORITHMS: LogoAlgorithm[] = [
    'parallel-bars',
    'stacked-lines',
    'letterform-cutout',
    'sparkle-asterisk',
    'overlapping-shapes',
    'arc-swoosh',
    'depth-mark',
    'negative-space',
    'interlocking-forms',
    'abstract-monogram',
];

/**
 * Algorithm metadata for UI
 */
export const ALGORITHM_INFO: Record<LogoAlgorithm, {
    name: string;
    description: string;
    inspiration: string;
}> = {
    'parallel-bars': {
        name: 'Parallel Gradient Bars',
        description: 'Stacked horizontal bars with gradient fills and subtle offsets',
        inspiration: 'Stripe',
    },
    'stacked-lines': {
        name: 'Stacked Motion Lines',
        description: 'Layered horizontal lines with motion blur effects',
        inspiration: 'Linear',
    },
    'letterform-cutout': {
        name: 'Letterform Cutout',
        description: 'Letter within geometric frame with cutout effects',
        inspiration: 'Notion',
    },
    'sparkle-asterisk': {
        name: 'Sparkle Asterisk',
        description: 'Curved arm sparkle with organic bezier curves',
        inspiration: 'Claude/Anthropic',
    },
    'overlapping-shapes': {
        name: 'Overlapping Shapes',
        description: 'Transparent layered shapes with blend effects',
        inspiration: 'Figma/Mastercard',
    },
    'arc-swoosh': {
        name: 'Arc Swoosh',
        description: 'Dynamic curved swoosh shapes with tapered edges',
        inspiration: 'Nike',
    },
    'depth-mark': {
        name: 'Depth Mark',
        description: '3D depth effect marks with layered extrusion',
        inspiration: 'Raycast',
    },
    'negative-space': {
        name: 'Negative Space',
        description: 'Clever negative space reveals and hidden forms',
        inspiration: 'FedEx/Vercel',
    },
    'interlocking-forms': {
        name: 'Interlocking Forms',
        description: 'Interconnected shapes that weave through each other',
        inspiration: 'Olympic Rings',
    },
    'abstract-monogram': {
        name: 'Abstract Monogram',
        description: 'Modern abstract letterform interpretations',
        inspiration: 'Contemporary Type',
    },
};

/**
 * Auto-select algorithm based on input parameters
 */
function selectAlgorithm(params: LogoGenerationParams): LogoAlgorithm {
    const { brandName, industry, aesthetic, seed = brandName } = params;
    const rng = createSeededRandom(seed);

    // Industry-based selection
    if (industry === 'technology') {
        const techAlgos: LogoAlgorithm[] = [
            'parallel-bars', 'stacked-lines', 'depth-mark', 'sparkle-asterisk'
        ];
        return techAlgos[Math.floor(rng() * techAlgos.length)];
    }

    if (industry === 'finance') {
        const financeAlgos: LogoAlgorithm[] = [
            'letterform-cutout', 'negative-space', 'interlocking-forms', 'abstract-monogram'
        ];
        return financeAlgos[Math.floor(rng() * financeAlgos.length)];
    }

    if (industry === 'creative') {
        const creativeAlgos: LogoAlgorithm[] = [
            'sparkle-asterisk', 'overlapping-shapes', 'arc-swoosh', 'abstract-monogram'
        ];
        return creativeAlgos[Math.floor(rng() * creativeAlgos.length)];
    }

    if (industry === 'healthcare') {
        const healthAlgos: LogoAlgorithm[] = [
            'overlapping-shapes', 'sparkle-asterisk', 'interlocking-forms'
        ];
        return healthAlgos[Math.floor(rng() * healthAlgos.length)];
    }

    // Aesthetic-based selection
    if (aesthetic === 'tech-minimal') {
        const minimalAlgos: LogoAlgorithm[] = [
            'stacked-lines', 'negative-space', 'parallel-bars'
        ];
        return minimalAlgos[Math.floor(rng() * minimalAlgos.length)];
    }

    if (aesthetic === 'bold-geometric') {
        const boldAlgos: LogoAlgorithm[] = [
            'depth-mark', 'letterform-cutout', 'interlocking-forms'
        ];
        return boldAlgos[Math.floor(rng() * boldAlgos.length)];
    }

    if (aesthetic === 'elegant-refined') {
        const elegantAlgos: LogoAlgorithm[] = [
            'abstract-monogram', 'arc-swoosh', 'letterform-cutout'
        ];
        return elegantAlgos[Math.floor(rng() * elegantAlgos.length)];
    }

    if (aesthetic === 'friendly-rounded') {
        const friendlyAlgos: LogoAlgorithm[] = [
            'sparkle-asterisk', 'overlapping-shapes', 'arc-swoosh'
        ];
        return friendlyAlgos[Math.floor(rng() * friendlyAlgos.length)];
    }

    // Random selection
    return ALL_ALGORITHMS[Math.floor(rng() * ALL_ALGORITHMS.length)];
}

/**
 * Generate logos using the unified engine
 *
 * This is the main entry point for logo generation.
 * Same brand name = same deterministic output.
 * Different brand name = guaranteed different output.
 */
export function generateLogos(params: LogoGenerationParams): GeneratedLogo[] {
    const algorithm = params.algorithm || selectAlgorithm(params);

    switch (algorithm) {
        case 'parallel-bars':
            return generateParallelBars(params);
        case 'stacked-lines':
            return generateStackedLines(params);
        case 'letterform-cutout':
            return generateLetterformCutout(params);
        case 'sparkle-asterisk':
            return generateSparkleAsterisk(params);
        case 'overlapping-shapes':
            return generateOverlappingShapes(params);
        case 'arc-swoosh':
            return generateArcSwoosh(params);
        case 'depth-mark':
            return generateDepthMark(params);
        case 'negative-space':
            return generateNegativeSpace(params);
        case 'interlocking-forms':
            return generateInterlockingForms(params);
        case 'abstract-monogram':
            return generateAbstractMonogram(params);
        default:
            return generateParallelBars(params);
    }
}

/**
 * Generate logos for all algorithms
 *
 * Creates variations across all 10 algorithms for maximum variety.
 */
export function generateAllAlgorithms(params: LogoGenerationParams): GeneratedLogo[] {
    const allLogos: GeneratedLogo[] = [];

    for (const algorithm of ALL_ALGORITHMS) {
        const logos = generateLogos({
            ...params,
            algorithm,
            variations: params.variations || 3,
        });
        allLogos.push(...logos);
    }

    return allLogos;
}

/**
 * Quick generation helper - simplified API
 */
export function quickGenerate(
    brandName: string,
    primaryColor: string,
    options?: {
        algorithm?: LogoAlgorithm;
        accentColor?: string;
        industry?: LogoGenerationParams['industry'];
        aesthetic?: LogoGenerationParams['aesthetic'];
        variations?: number;
    }
): GeneratedLogo[] {
    return generateLogos({
        brandName,
        primaryColor,
        accentColor: options?.accentColor,
        industry: options?.industry,
        aesthetic: options?.aesthetic,
        algorithm: options?.algorithm,
        variations: options?.variations || 3,
    });
}

/**
 * Generate comprehensive brand package
 *
 * Creates logos across multiple algorithms optimized for the brand.
 */
export function generateBrandPackage(params: LogoGenerationParams): {
    primary: GeneratedLogo[];
    secondary: GeneratedLogo[];
    icons: GeneratedLogo[];
    patterns: GeneratedLogo[];
} {
    return {
        primary: [
            ...generateLogos({ ...params, algorithm: 'abstract-monogram', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'letterform-cutout', variations: 2 }),
        ],
        secondary: [
            ...generateLogos({ ...params, algorithm: 'sparkle-asterisk', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'negative-space', variations: 2 }),
        ],
        icons: [
            ...generateLogos({ ...params, algorithm: 'depth-mark', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'overlapping-shapes', variations: 2 }),
        ],
        patterns: [
            ...generateLogos({ ...params, algorithm: 'parallel-bars', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'stacked-lines', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'arc-swoosh', variations: 2 }),
        ],
    };
}

/**
 * Generate logos with animations
 */
export function generateLogosWithAnimation(
    params: LogoGenerationParams,
    animationPreset: AnimationPreset = 'fade-in',
    animationDuration: number = 1000
): GeneratedLogo[] {
    const logos = generateLogos(params);

    return logos.map(logo => ({
        ...logo,
        animation: generateLogoAnimation(logo, animationPreset, animationDuration),
    }));
}

/**
 * Get unique logos (filters out duplicates based on hash)
 */
export function getUniqueLogos(logos: GeneratedLogo[]): GeneratedLogo[] {
    const seen = new Set<string>();
    return logos.filter(logo => {
        if (seen.has(logo.hash)) return false;
        seen.add(logo.hash);
        return true;
    });
}
