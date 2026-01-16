/**
 * Parametric Logo Engine v5
 *
 * Premium parametric logo generation with SHA-256 hash-based uniqueness.
 * 13 base algorithms inspired by world-class logos.
 * Brand name + category + timestamp + salt = unique SHA-256 hash.
 * Hash bits seed 30+ parameters for infinite unique variations.
 * Quality scoring ensures only premium output (80+ score).
 * All shapes rendered using bezier paths only.
 *
 * Features:
 * - Starburst (Claude/Anthropic-style)
 * - Framed Letter (Notion-style)
 * - Motion Lines (Linear/Framer-style)
 * - Gradient Bars (Stripe-style)
 * - Perfect Triangle (Vercel-style)
 * - Circle Overlap (Figma-style)
 * - Depth Geometry (Raycast-style)
 * - Letter Swoosh (Arc-style)
 * - Orbital Rings (Planetscale-style)
 * - Flow Gradient (Loom-style)
 * - Isometric Cube (Pitch-style)
 * - Abstract Mark (Supabase-style)
 * - Monogram Blend (Custom)
 *
 * Plus animation export: Lottie JSON + CSS keyframes
 */

// ============================================
// TYPES
// ============================================

export type {
    LogoAlgorithm,
    LogoCategory,
    IndustryCategory,
    LogoAesthetic,
    SymmetryType,
    BaseParameters,
    HashParams,
    HashDerivedParams,
    QualityMetrics,
    StarburstParams,
    FramedLetterParams,
    MotionLinesParams,
    GradientBarsParams,
    PerfectTriangleParams,
    CircleOverlapParams,
    DepthGeometryParams,
    LetterSwooshParams,
    OrbitalRingsParams,
    FlowGradientParams,
    IsometricCubeParams,
    AbstractMarkParams,
    MonogramBlendParams,
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
    // New hash-based utilities
    sha256,
    generateHashParams,
    generateHashParamsSync,
    deriveParamsFromHash,
    calculateQualityScore,
    // Bezier utilities
    createBezierCircle,
    createBezierEllipse,
    createBezierRoundedRect,
    createOrganicShape,
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
    generateStarburst,
    generateSingleStarburstPreview,
} from './generators/starburst';

export {
    generateFramedLetter,
    generateSingleFramedLetterPreview,
} from './generators/framed-letter';

export {
    generateMotionLines,
    generateSingleMotionLinesPreview,
} from './generators/motion-lines';

export {
    generateGradientBars,
    generateSingleGradientBarsPreview,
} from './generators/gradient-bars';

export {
    generatePerfectTriangle,
    generateSinglePerfectTrianglePreview,
} from './generators/perfect-triangle';

export {
    generateCircleOverlap,
    generateSingleCircleOverlapPreview,
} from './generators/circle-overlap';

export {
    generateDepthGeometry,
    generateSingleDepthGeometryPreview,
} from './generators/depth-geometry';

export {
    generateLetterSwoosh,
    generateSingleLetterSwooshPreview,
} from './generators/letter-swoosh';

export {
    generateOrbitalRings,
    generateSingleOrbitalRingsPreview,
} from './generators/orbital-rings';

export {
    generateFlowGradient,
    generateSingleFlowGradientPreview,
} from './generators/flow-gradient';

export {
    generateIsometricCube,
    generateSingleIsometricCubePreview,
} from './generators/isometric-cube';

export {
    generateAbstractMark,
    generateSingleAbstractMarkPreview,
} from './generators/abstract-mark';

export {
    generateMonogramBlend,
    generateSingleMonogramBlendPreview,
} from './generators/monogram-blend';

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
import { generateStarburst } from './generators/starburst';
import { generateFramedLetter } from './generators/framed-letter';
import { generateMotionLines } from './generators/motion-lines';
import { generateGradientBars } from './generators/gradient-bars';
import { generatePerfectTriangle } from './generators/perfect-triangle';
import { generateCircleOverlap } from './generators/circle-overlap';
import { generateDepthGeometry } from './generators/depth-geometry';
import { generateLetterSwoosh } from './generators/letter-swoosh';
import { generateOrbitalRings } from './generators/orbital-rings';
import { generateFlowGradient } from './generators/flow-gradient';
import { generateIsometricCube } from './generators/isometric-cube';
import { generateAbstractMark } from './generators/abstract-mark';
import { generateMonogramBlend } from './generators/monogram-blend';
import { generateLogoAnimation } from './animation/animation-export';

/**
 * All available algorithms
 */
export const ALL_ALGORITHMS: LogoAlgorithm[] = [
    'starburst',
    'framed-letter',
    'motion-lines',
    'gradient-bars',
    'perfect-triangle',
    'circle-overlap',
    'depth-geometry',
    'letter-swoosh',
    'orbital-rings',
    'flow-gradient',
    'isometric-cube',
    'abstract-mark',
    'monogram-blend',
];

/**
 * Algorithm metadata for UI
 */
export const ALGORITHM_INFO: Record<LogoAlgorithm, {
    name: string;
    description: string;
    inspiration: string;
}> = {
    'starburst': {
        name: 'Starburst',
        description: 'Curved organic arms with rotational symmetry, 6-16 spokes with bezier curves',
        inspiration: 'Claude/Anthropic',
    },
    'framed-letter': {
        name: 'Framed Letter',
        description: 'Single letter in geometric frame with artistic cutout',
        inspiration: 'Notion',
    },
    'motion-lines': {
        name: 'Motion Lines',
        description: 'Stacked horizontal lines with motion feel and wave effects',
        inspiration: 'Linear/Framer',
    },
    'gradient-bars': {
        name: 'Gradient Bars',
        description: 'Parallel diagonal bars with gradient fills',
        inspiration: 'Stripe',
    },
    'perfect-triangle': {
        name: 'Perfect Triangle',
        description: 'Single perfect geometric triangle with precision',
        inspiration: 'Vercel',
    },
    'circle-overlap': {
        name: 'Circle Overlap',
        description: 'Overlapping circles with transparency and blend effects',
        inspiration: 'Figma',
    },
    'depth-geometry': {
        name: 'Depth Geometry',
        description: 'Abstract geometric shapes with depth and shadow effects',
        inspiration: 'Raycast',
    },
    'letter-swoosh': {
        name: 'Letter Swoosh',
        description: 'Letter with dynamic curved swoosh accent',
        inspiration: 'Arc',
    },
    'orbital-rings': {
        name: 'Orbital Rings',
        description: 'Intersecting orbital ring paths with 3D depth',
        inspiration: 'Planetscale',
    },
    'flow-gradient': {
        name: 'Flow Gradient',
        description: 'Flowing gradient organic shape with smooth curves',
        inspiration: 'Loom',
    },
    'isometric-cube': {
        name: 'Isometric Cube',
        description: '3D isometric cube letterform with depth',
        inspiration: 'Pitch',
    },
    'abstract-mark': {
        name: 'Abstract Mark',
        description: 'Abstract angular mark with sharp geometry',
        inspiration: 'Supabase',
    },
    'monogram-blend': {
        name: 'Monogram Blend',
        description: 'Two letters intertwined with shared strokes',
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
            'starburst', 'motion-lines', 'depth-geometry', 'abstract-mark', 'isometric-cube'
        ];
        return techAlgos[Math.floor(rng() * techAlgos.length)];
    }

    if (industry === 'finance') {
        const financeAlgos: LogoAlgorithm[] = [
            'framed-letter', 'perfect-triangle', 'gradient-bars', 'monogram-blend'
        ];
        return financeAlgos[Math.floor(rng() * financeAlgos.length)];
    }

    if (industry === 'creative') {
        const creativeAlgos: LogoAlgorithm[] = [
            'starburst', 'circle-overlap', 'letter-swoosh', 'flow-gradient', 'orbital-rings'
        ];
        return creativeAlgos[Math.floor(rng() * creativeAlgos.length)];
    }

    if (industry === 'healthcare') {
        const healthAlgos: LogoAlgorithm[] = [
            'circle-overlap', 'starburst', 'flow-gradient', 'orbital-rings'
        ];
        return healthAlgos[Math.floor(rng() * healthAlgos.length)];
    }

    // Aesthetic-based selection
    if (aesthetic === 'tech-minimal') {
        const minimalAlgos: LogoAlgorithm[] = [
            'motion-lines', 'perfect-triangle', 'gradient-bars', 'abstract-mark'
        ];
        return minimalAlgos[Math.floor(rng() * minimalAlgos.length)];
    }

    if (aesthetic === 'bold-geometric') {
        const boldAlgos: LogoAlgorithm[] = [
            'depth-geometry', 'isometric-cube', 'framed-letter', 'perfect-triangle'
        ];
        return boldAlgos[Math.floor(rng() * boldAlgos.length)];
    }

    if (aesthetic === 'elegant-refined') {
        const elegantAlgos: LogoAlgorithm[] = [
            'monogram-blend', 'framed-letter', 'flow-gradient', 'orbital-rings'
        ];
        return elegantAlgos[Math.floor(rng() * elegantAlgos.length)];
    }

    if (aesthetic === 'friendly-rounded') {
        const friendlyAlgos: LogoAlgorithm[] = [
            'starburst', 'circle-overlap', 'flow-gradient', 'letter-swoosh'
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
 * Quality scoring ensures only premium logos (80+) are returned.
 */
export function generateLogos(params: LogoGenerationParams): GeneratedLogo[] {
    const algorithm = params.algorithm || selectAlgorithm(params);

    switch (algorithm) {
        case 'starburst':
            return generateStarburst(params);
        case 'framed-letter':
            return generateFramedLetter(params);
        case 'motion-lines':
            return generateMotionLines(params);
        case 'gradient-bars':
            return generateGradientBars(params);
        case 'perfect-triangle':
            return generatePerfectTriangle(params);
        case 'circle-overlap':
            return generateCircleOverlap(params);
        case 'depth-geometry':
            return generateDepthGeometry(params);
        case 'letter-swoosh':
            return generateLetterSwoosh(params);
        case 'orbital-rings':
            return generateOrbitalRings(params);
        case 'flow-gradient':
            return generateFlowGradient(params);
        case 'isometric-cube':
            return generateIsometricCube(params);
        case 'abstract-mark':
            return generateAbstractMark(params);
        case 'monogram-blend':
            return generateMonogramBlend(params);
        default:
            return generateStarburst(params);
    }
}

/**
 * Generate logos for all algorithms
 *
 * Creates variations across all 13 algorithms for maximum variety.
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
            ...generateLogos({ ...params, algorithm: 'monogram-blend', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'framed-letter', variations: 2 }),
        ],
        secondary: [
            ...generateLogos({ ...params, algorithm: 'starburst', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'abstract-mark', variations: 2 }),
        ],
        icons: [
            ...generateLogos({ ...params, algorithm: 'depth-geometry', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'circle-overlap', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'isometric-cube', variations: 2 }),
        ],
        patterns: [
            ...generateLogos({ ...params, algorithm: 'gradient-bars', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'motion-lines', variations: 2 }),
            ...generateLogos({ ...params, algorithm: 'orbital-rings', variations: 2 }),
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
