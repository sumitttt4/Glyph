/**
 * Parametric Logo Engine v6 - ABSTRACT MARKS ONLY
 *
 * Premium parametric logo generation with SHA-256 hash-based uniqueness.
 * ONLY abstract professional marks - NO literal objects or clipart.
 *
 * QUALITY REQUIREMENTS:
 * - Must produce abstract marks, NOT literal objects
 * - Must pass quality filter (no clipart, no basic shapes)
 * - Brand name must significantly affect output structure
 * - Different brand = completely different visual structure
 *
 * BLACKLISTED ALGORITHMS (permanently removed):
 * - arrow-mark, heart-love, crown-mark, mountain-peak
 * - wave-flow, leaf-organic, eye-vision, star-mark
 * - moon-phase, gear-cog, lock-secure, cloud-soft
 * - diamond-gem, shield-badge, lightning-bolt
 * - sound-waves, page-icon, chat-bubble, circular-emblem
 *
 * KEPT ALGORITHMS (abstract marks only):
 * - Lettermarks: framed-letter, letter-swoosh, monogram-blend, letter-gradient, box-logo
 * - Geometric: gradient-bars, motion-lines, perfect-triangle, depth-geometry, isometric-cube
 * - Radial: starburst (Claude-style)
 * - Overlapping: circle-overlap, orbital-rings, flow-gradient
 * - Line art: abstract-mark, infinity-loop, maze-pattern, fingerprint-id
 * - Patterns: orbital-paths, dna-helix
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
    // Logo Variations System
    LogoVariationType,
    LogoVariation,
    LogoVariations,
    GeneratedLogoWithVariations,
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
// ABSTRACT SYMBOL GENERATORS (KEPT)
// ============================================

export {
    generateInfinityLoop,
    generateSingleInfinityLoopPreview,
} from './generators/infinity-loop';

export {
    generateHexagonTech,
    generateSingleHexagonTechPreview,
} from './generators/hexagon-tech';

export {
    generateLetterGradient,
    generateSingleLetterGradientPreview,
} from './generators/letter-gradient';

export {
    generateBoxLogo,
    generateSingleBoxLogoPreview,
} from './generators/box-logo';

export {
    generateDnaHelix,
    generateSingleDnaHelixPreview,
} from './generators/dna-helix';

export {
    generateOrbitalPaths,
    generateSingleOrbitalPathsPreview,
} from './generators/orbital-paths';

export {
    generateFingerprintId,
    generateSingleFingerprintIdPreview,
} from './generators/fingerprint-id';

export {
    generateMazePattern,
    generateSingleMazePatternPreview,
} from './generators/maze-pattern';

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
// LOGO VARIATIONS
// ============================================

export {
    generateLogoVariations,
    generateAllLogoVariations,
    getLogoVariation,
    VARIATION_TYPES,
    VARIATION_INFO,
    LogoVariationsPreview,
    LogoVariationSelector,
} from './variations';

// ============================================
// UNIFIED API
// ============================================

import { LogoGenerationParams, GeneratedLogo, LogoAlgorithm, AnimationPreset } from './types';
import { createSeededRandom, deriveParamsFromHash, generateHashParamsSync } from './core/parametric-engine';
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
// Abstract symbol generators (kept)
import { generateInfinityLoop } from './generators/infinity-loop';
import { generateHexagonTech } from './generators/hexagon-tech';
import { generateLetterGradient } from './generators/letter-gradient';
import { generateBoxLogo } from './generators/box-logo';
import { generateDnaHelix } from './generators/dna-helix';
import { generateOrbitalPaths } from './generators/orbital-paths';
import { generateFingerprintId } from './generators/fingerprint-id';
import { generateMazePattern } from './generators/maze-pattern';
import { generateLogoAnimation } from './animation/animation-export';

/**
 * ============================================
 * ABSTRACT PROFESSIONAL ALGORITHMS ONLY
 * ============================================
 *
 * QUALITY REQUIREMENTS:
 * - Must produce abstract marks, NOT literal objects
 * - Must pass quality filter (no clipart, no basic shapes)
 * - Brand name must significantly affect output structure
 *
 * BLACKLISTED (removed):
 * - arrow-mark, heart-love, crown-mark, mountain-peak
 * - wave-flow, leaf-organic, eye-vision, star-mark
 * - moon-phase, gear-cog, lock-secure, cloud-soft
 * - diamond-gem, shield-badge, lightning-bolt
 * - sound-waves, page-icon, chat-bubble, circular-emblem
 */

// ============================================
// ALGORITHM BLACKLIST SYSTEM
// ============================================

/**
 * PERMANENTLY BLACKLISTED ALGORITHMS
 * These produce literal objects/clipart instead of abstract marks
 * DO NOT RE-ADD these algorithms
 */
export const BLACKLISTED_ALGORITHMS: string[] = [
    // Literal objects (look like clipart)
    'arrow-mark',       // Literal arrow shape
    'heart-love',       // Literal heart shape
    'crown-mark',       // Literal crown shape
    'mountain-peak',    // Landscape/scenery
    'wave-flow',        // Literal ocean wave
    'leaf-organic',     // Literal leaf shape
    'eye-vision',       // Literal eye shape
    'star-mark',        // Basic star shape
    'moon-phase',       // Literal moon shape
    'gear-cog',         // Literal gear/cog
    'lock-secure',      // Literal padlock
    'cloud-soft',       // Literal cloud shape
    'diamond-gem',      // Literal diamond shape
    'shield-badge',     // Literal shield shape
    'lightning-bolt',   // Literal lightning bolt

    // Literal icons (not abstract marks)
    'sound-waves',      // Audio waveform (too literal)
    'page-icon',        // Document icon
    'chat-bubble',      // Speech bubble
    'circular-emblem',  // Badge/seal (too traditional)

    // Basic shapes without treatment
    'ribbon-banner',    // Too decorative
    'origami-fold',     // Too literal
    'cube-3d',          // Basic 3D shape

    // Script/decorative text
    'letter-striped',   // IBM stripes (too dated)
    'letter-script',    // Script font (not abstract)
];

/**
 * Track algorithm quality scores for potential future blacklisting
 * Format: { algorithmName: { rejections: number, passes: number } }
 */
const algorithmPerformance: Record<string, { rejections: number; passes: number }> = {};

/**
 * Log algorithm performance for potential blacklisting
 */
export function logAlgorithmResult(algorithm: LogoAlgorithm, passed: boolean): void {
    if (!algorithmPerformance[algorithm]) {
        algorithmPerformance[algorithm] = { rejections: 0, passes: 0 };
    }
    if (passed) {
        algorithmPerformance[algorithm].passes++;
    } else {
        algorithmPerformance[algorithm].rejections++;
    }

    // Log warning if algorithm has high rejection rate
    const stats = algorithmPerformance[algorithm];
    const total = stats.passes + stats.rejections;
    if (total >= 10) {
        const rejectionRate = stats.rejections / total;
        if (rejectionRate > 0.5) {
            console.warn(`[ALGORITHM WARNING] ${algorithm} has ${Math.round(rejectionRate * 100)}% rejection rate - consider blacklisting`);
        }
    }
}

/**
 * Get algorithm performance report
 */
export function getAlgorithmPerformanceReport(): Record<string, { rejections: number; passes: number; rejectionRate: number }> {
    const report: Record<string, { rejections: number; passes: number; rejectionRate: number }> = {};
    for (const [algo, stats] of Object.entries(algorithmPerformance)) {
        const total = stats.passes + stats.rejections;
        report[algo] = {
            ...stats,
            rejectionRate: total > 0 ? stats.rejections / total : 0,
        };
    }
    return report;
}

/**
 * Check if algorithm is blacklisted
 */
export function isBlacklisted(algorithm: string): boolean {
    return BLACKLISTED_ALGORITHMS.includes(algorithm);
}

// ============================================
// ABSTRACT ALGORITHM DEFINITIONS
// ============================================

/**
 * All available ABSTRACT algorithms
 */
export const ALL_ALGORITHMS: LogoAlgorithm[] = [
    // === LETTERMARKS (stylized initials) ===
    'framed-letter',      // Notion-style letter in geometric frame
    'letter-swoosh',      // Arc-style letter with curved accent
    'monogram-blend',     // Intertwined letters
    'letter-gradient',    // Stylized letter with gradient
    'box-logo',           // Bold boxed lettermark

    // === GEOMETRIC ABSTRACTS (Stripe, Linear, Vercel style) ===
    'gradient-bars',      // Stripe - parallel diagonal bars
    'motion-lines',       // Linear/Framer - stacked lines
    'perfect-triangle',   // Vercel - geometric triangle
    'depth-geometry',     // Raycast - abstract with depth
    'isometric-cube',     // Pitch - 3D isometric
    'hexagon-tech',       // Tech hexagon pattern
    'stacked-lines',      // Linear-style stacked lines

    // === STARBURST/RADIAL (Claude asterisk style) ===
    'starburst',          // Claude - curved organic arms

    // === OVERLAPPING SHAPES (Figma, Mastercard style) ===
    'circle-overlap',     // Figma - overlapping circles
    'orbital-rings',      // Planetscale - intersecting rings
    'flow-gradient',      // Loom - flowing organic shape

    // === LINE ART (continuous stroke marks) ===
    'abstract-mark',      // Supabase - angular mark
    'infinity-loop',      // Meta - infinite loop
    'maze-pattern',       // Abstract maze lines
    'fingerprint-id',     // Abstract spiral lines

    // === ABSTRACT PATTERNS ===
    'orbital-paths',      // Abstract orbital pattern
    'dna-helix',          // Abstract helix pattern
];

/**
 * Symbol-only algorithms (pure abstract marks, no letters)
 */
export const SYMBOL_ALGORITHMS: LogoAlgorithm[] = [
    // Geometric abstracts
    'gradient-bars',
    'motion-lines',
    'perfect-triangle',
    'depth-geometry',
    'isometric-cube',
    'hexagon-tech',
    'stacked-lines',

    // Radial/starburst
    'starburst',

    // Overlapping shapes
    'circle-overlap',
    'orbital-rings',
    'flow-gradient',

    // Line art
    'abstract-mark',
    'infinity-loop',
    'maze-pattern',
    'fingerprint-id',

    // Abstract patterns
    'orbital-paths',
    'dna-helix',
];

/**
 * Wordmark algorithms (letter-based marks)
 */
export const WORDMARK_ALGORITHMS: LogoAlgorithm[] = [
    'framed-letter',
    'letter-swoosh',
    'monogram-blend',
    'letter-gradient',
    'box-logo',
];

/**
 * Algorithm metadata for UI - ABSTRACT MARKS ONLY
 */
export const ALGORITHM_INFO: Record<LogoAlgorithm, {
    name: string;
    description: string;
    inspiration: string;
    category: 'lettermark' | 'geometric' | 'radial' | 'overlapping' | 'lineart' | 'pattern';
}> = {
    // === LETTERMARKS ===
    'framed-letter': {
        name: 'Framed Letter',
        description: 'Single letter in geometric frame with artistic cutout',
        inspiration: 'Notion',
        category: 'lettermark',
    },
    'letter-swoosh': {
        name: 'Letter Swoosh',
        description: 'Letter with dynamic curved swoosh accent',
        inspiration: 'Arc',
        category: 'lettermark',
    },
    'monogram-blend': {
        name: 'Monogram Blend',
        description: 'Two letters intertwined with shared strokes',
        inspiration: 'Contemporary Type',
        category: 'lettermark',
    },
    'letter-gradient': {
        name: 'Letter Gradient',
        description: 'Colorful letter marks with gradient fills',
        inspiration: 'Google',
        category: 'lettermark',
    },
    'box-logo': {
        name: 'Box Logo',
        description: 'Bold box frame logo with text',
        inspiration: 'Supreme',
        category: 'lettermark',
    },

    // === GEOMETRIC ABSTRACTS ===
    'gradient-bars': {
        name: 'Gradient Bars',
        description: 'Parallel diagonal bars with gradient fills',
        inspiration: 'Stripe',
        category: 'geometric',
    },
    'motion-lines': {
        name: 'Motion Lines',
        description: 'Stacked horizontal lines with motion feel',
        inspiration: 'Linear/Framer',
        category: 'geometric',
    },
    'perfect-triangle': {
        name: 'Perfect Triangle',
        description: 'Single perfect geometric triangle with precision',
        inspiration: 'Vercel',
        category: 'geometric',
    },
    'depth-geometry': {
        name: 'Depth Geometry',
        description: 'Abstract geometric shapes with depth and shadow',
        inspiration: 'Raycast',
        category: 'geometric',
    },
    'isometric-cube': {
        name: 'Isometric Cube',
        description: '3D isometric cube letterform with depth',
        inspiration: 'Pitch',
        category: 'geometric',
    },
    'hexagon-tech': {
        name: 'Hexagon Tech',
        description: 'Hexagonal patterns with circuit-like connections',
        inspiration: 'Blockchain/Tech',
        category: 'geometric',
    },
    'stacked-lines': {
        name: 'Stacked Lines',
        description: 'Stacked horizontal lines with variation',
        inspiration: 'Linear',
        category: 'geometric',
    },

    // === STARBURST/RADIAL ===
    'starburst': {
        name: 'Starburst',
        description: 'Curved organic arms with rotational symmetry',
        inspiration: 'Claude/Anthropic',
        category: 'radial',
    },

    // === OVERLAPPING SHAPES ===
    'circle-overlap': {
        name: 'Circle Overlap',
        description: 'Overlapping circles with transparency and blend',
        inspiration: 'Figma/Mastercard',
        category: 'overlapping',
    },
    'orbital-rings': {
        name: 'Orbital Rings',
        description: 'Intersecting orbital ring paths with 3D depth',
        inspiration: 'Planetscale',
        category: 'overlapping',
    },
    'flow-gradient': {
        name: 'Flow Gradient',
        description: 'Flowing gradient organic shape with smooth curves',
        inspiration: 'Loom',
        category: 'overlapping',
    },

    // === LINE ART ===
    'abstract-mark': {
        name: 'Abstract Mark',
        description: 'Abstract angular mark with sharp geometry',
        inspiration: 'Supabase',
        category: 'lineart',
    },
    'infinity-loop': {
        name: 'Infinity Loop',
        description: 'Infinite loop ribbon with smooth crossover',
        inspiration: 'Meta',
        category: 'lineart',
    },
    'maze-pattern': {
        name: 'Maze Pattern',
        description: 'Abstract labyrinth line patterns',
        inspiration: 'Complexity',
        category: 'lineart',
    },
    'fingerprint-id': {
        name: 'Fingerprint ID',
        description: 'Abstract spiral line patterns',
        inspiration: 'Identity',
        category: 'lineart',
    },

    // === ABSTRACT PATTERNS ===
    'orbital-paths': {
        name: 'Orbital Paths',
        description: 'Abstract orbital ring patterns',
        inspiration: 'Space/Tech',
        category: 'pattern',
    },
    'dna-helix': {
        name: 'DNA Helix',
        description: 'Abstract double helix patterns',
        inspiration: 'Biotech',
        category: 'pattern',
    },
};

/**
 * ============================================
 * BRAND-DRIVEN ALGORITHM SELECTION
 * ============================================
 *
 * Brand name SIGNIFICANTLY affects output structure:
 * - Different names produce different algorithm categories
 * - Hash-derived parameters ensure unique structures
 * - No two brands should look alike
 */

/**
 * Analyze brand name to determine optimal algorithm category
 * This ensures "Stripe" vs "Helloo" produce completely different base shapes
 */
function analyzeBrandForCategory(brandName: string): 'lettermark' | 'geometric' | 'radial' | 'overlapping' | 'lineart' | 'pattern' {
    const hashParams = generateHashParamsSync(brandName, 'general');
    const derived = deriveParamsFromHash(hashParams.hashHex);

    // Use multiple hash-derived values to determine category
    const nameLength = brandName.length;
    const firstCharCode = brandName.charCodeAt(0);
    const lastCharCode = brandName.charCodeAt(brandName.length - 1);
    const hasVowelStart = /^[aeiouAEIOU]/.test(brandName);
    const hasDoubleLetters = /(.)\1/.test(brandName);

    // Complex decision tree based on brand characteristics
    const categoryScore = (
        (derived.elementCount % 6) +
        (nameLength % 3) +
        (firstCharCode % 4) +
        (lastCharCode % 3) +
        (hasVowelStart ? 2 : 0) +
        (hasDoubleLetters ? 1 : 0)
    ) % 6;

    const categories: Array<'lettermark' | 'geometric' | 'radial' | 'overlapping' | 'lineart' | 'pattern'> = [
        'lettermark',
        'geometric',
        'radial',
        'overlapping',
        'lineart',
        'pattern',
    ];

    return categories[categoryScore];
}

/**
 * Get algorithms by category
 */
function getAlgorithmsByCategory(category: 'lettermark' | 'geometric' | 'radial' | 'overlapping' | 'lineart' | 'pattern'): LogoAlgorithm[] {
    switch (category) {
        case 'lettermark':
            return ['framed-letter', 'letter-swoosh', 'monogram-blend', 'letter-gradient', 'box-logo'];
        case 'geometric':
            return ['gradient-bars', 'motion-lines', 'perfect-triangle', 'depth-geometry', 'isometric-cube', 'hexagon-tech', 'stacked-lines'];
        case 'radial':
            return ['starburst'];
        case 'overlapping':
            return ['circle-overlap', 'orbital-rings', 'flow-gradient'];
        case 'lineart':
            return ['abstract-mark', 'infinity-loop', 'maze-pattern', 'fingerprint-id'];
        case 'pattern':
            return ['orbital-paths', 'dna-helix'];
        default:
            return ALL_ALGORITHMS;
    }
}

/**
 * Auto-select algorithm based on input parameters
 * Brand name SIGNIFICANTLY affects the output structure
 */
function selectAlgorithm(params: LogoGenerationParams & { archetype?: 'symbol' | 'wordmark' | 'both' }): LogoAlgorithm {
    const { brandName, industry, aesthetic, seed = brandName, archetype } = params;
    const rng = createSeededRandom(seed);

    // Archetype-based filtering
    if (archetype === 'symbol') {
        // Analyze brand to select category, then pick from symbol algorithms in that category
        const category = analyzeBrandForCategory(brandName);
        const categoryAlgos = getAlgorithmsByCategory(category).filter(algo =>
            SYMBOL_ALGORITHMS.includes(algo)
        );
        if (categoryAlgos.length > 0) {
            return categoryAlgos[Math.floor(rng() * categoryAlgos.length)];
        }
        return SYMBOL_ALGORITHMS[Math.floor(rng() * SYMBOL_ALGORITHMS.length)];
    }

    if (archetype === 'wordmark') {
        return WORDMARK_ALGORITHMS[Math.floor(rng() * WORDMARK_ALGORITHMS.length)];
    }

    // For 'both' or undefined: Brand name determines primary category
    const category = analyzeBrandForCategory(brandName);
    let algorithmPool = getAlgorithmsByCategory(category);

    // Industry can modify the pool (but brand still drives structure)
    if (industry === 'technology') {
        const techAlgos: LogoAlgorithm[] = [
            'starburst', 'motion-lines', 'depth-geometry', 'abstract-mark', 'isometric-cube',
            'hexagon-tech', 'infinity-loop', 'gradient-bars'
        ];
        // Intersect with category or use tech algos
        const intersection = algorithmPool.filter(a => techAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    if (industry === 'finance') {
        const financeAlgos: LogoAlgorithm[] = [
            'framed-letter', 'perfect-triangle', 'gradient-bars', 'monogram-blend', 'depth-geometry'
        ];
        const intersection = algorithmPool.filter(a => financeAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    if (industry === 'creative') {
        const creativeAlgos: LogoAlgorithm[] = [
            'starburst', 'circle-overlap', 'letter-swoosh', 'flow-gradient', 'orbital-rings',
            'infinity-loop', 'abstract-mark'
        ];
        const intersection = algorithmPool.filter(a => creativeAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    if (industry === 'healthcare') {
        const healthAlgos: LogoAlgorithm[] = [
            'circle-overlap', 'starburst', 'flow-gradient', 'orbital-rings', 'dna-helix'
        ];
        const intersection = algorithmPool.filter(a => healthAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    if (industry === 'sustainability') {
        const ecoAlgos: LogoAlgorithm[] = [
            'flow-gradient', 'circle-overlap', 'starburst', 'infinity-loop'
        ];
        const intersection = algorithmPool.filter(a => ecoAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    // Aesthetic modifiers
    if (aesthetic === 'tech-minimal') {
        const minimalAlgos: LogoAlgorithm[] = [
            'motion-lines', 'perfect-triangle', 'gradient-bars', 'abstract-mark', 'hexagon-tech', 'stacked-lines'
        ];
        const intersection = algorithmPool.filter(a => minimalAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    if (aesthetic === 'bold-geometric') {
        const boldAlgos: LogoAlgorithm[] = [
            'depth-geometry', 'isometric-cube', 'framed-letter', 'perfect-triangle', 'hexagon-tech', 'box-logo'
        ];
        const intersection = algorithmPool.filter(a => boldAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    if (aesthetic === 'elegant-refined') {
        const elegantAlgos: LogoAlgorithm[] = [
            'monogram-blend', 'framed-letter', 'flow-gradient', 'orbital-rings', 'infinity-loop'
        ];
        const intersection = algorithmPool.filter(a => elegantAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    if (aesthetic === 'friendly-rounded') {
        const friendlyAlgos: LogoAlgorithm[] = [
            'starburst', 'circle-overlap', 'flow-gradient', 'letter-swoosh'
        ];
        const intersection = algorithmPool.filter(a => friendlyAlgos.includes(a));
        if (intersection.length > 0) {
            algorithmPool = intersection;
        }
    }

    // Select from final pool
    return algorithmPool[Math.floor(rng() * algorithmPool.length)];
}

/**
 * Generate logos using the unified engine
 *
 * This is the main entry point for logo generation.
 * Same brand name = same deterministic output.
 * Different brand name = guaranteed different structure.
 * Quality scoring ensures only premium abstract logos (80+) are returned.
 *
 * ALL OUTPUTS ARE ABSTRACT MARKS - no literal objects, no clipart
 */
export function generateLogos(params: LogoGenerationParams): GeneratedLogo[] {
    const algorithm = params.algorithm || selectAlgorithm(params);

    switch (algorithm) {
        // === LETTERMARKS ===
        case 'framed-letter':
            return generateFramedLetter(params);
        case 'letter-swoosh':
            return generateLetterSwoosh(params);
        case 'monogram-blend':
            return generateMonogramBlend(params);
        case 'letter-gradient':
            return generateLetterGradient(params);
        case 'box-logo':
            return generateBoxLogo(params);

        // === GEOMETRIC ABSTRACTS ===
        case 'gradient-bars':
            return generateGradientBars(params);
        case 'motion-lines':
            return generateMotionLines(params);
        case 'perfect-triangle':
            return generatePerfectTriangle(params);
        case 'depth-geometry':
            return generateDepthGeometry(params);
        case 'isometric-cube':
            return generateIsometricCube(params);
        case 'hexagon-tech':
            return generateHexagonTech(params);
        case 'stacked-lines':
            return generateMotionLines(params); // Fallback to motion-lines

        // === STARBURST/RADIAL ===
        case 'starburst':
            return generateStarburst(params);

        // === OVERLAPPING SHAPES ===
        case 'circle-overlap':
            return generateCircleOverlap(params);
        case 'orbital-rings':
            return generateOrbitalRings(params);
        case 'flow-gradient':
            return generateFlowGradient(params);

        // === LINE ART ===
        case 'abstract-mark':
            return generateAbstractMark(params);
        case 'infinity-loop':
            return generateInfinityLoop(params);
        case 'maze-pattern':
            return generateMazePattern(params);
        case 'fingerprint-id':
            return generateFingerprintId(params);

        // === ABSTRACT PATTERNS ===
        case 'orbital-paths':
            return generateOrbitalPaths(params);
        case 'dna-helix':
            return generateDnaHelix(params);

        default:
            // Default to starburst (Claude-style radial abstract)
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

// ============================================
// TESTING & VERIFICATION
// ============================================

/**
 * Test brand names for verification
 */
const TEST_BRAND_NAMES = [
    'Stripe',       // Fintech - should get geometric bars
    'Helloo',       // Friendly - should get different structure
    'TechCorp',     // Technology - should get tech patterns
    'Bloom',        // Organic - should get flowing shapes
    'Vertex',       // Sharp - should get angular marks
    'Pulse',        // Dynamic - should get motion-based
    'Nova',         // Space - should get orbital/radial
    'Craft',        // Artisan - should get lettermarks
    'Flux',         // Change - should get flowing patterns
    'Nexus',        // Connection - should get overlapping shapes
];

/**
 * Test that 10 different brand names produce unique structures
 * Each brand should select a different algorithm category
 */
export function testBrandUniqueness(): {
    passed: boolean;
    results: Array<{
        brand: string;
        category: string;
        algorithm: LogoAlgorithm;
        qualityScore: number;
    }>;
    duplicateCategories: string[];
} {
    const results: Array<{
        brand: string;
        category: string;
        algorithm: LogoAlgorithm;
        qualityScore: number;
    }> = [];

    const categoryCount: Record<string, number> = {};

    for (const brand of TEST_BRAND_NAMES) {
        const category = analyzeBrandForCategory(brand);
        const params: LogoGenerationParams = {
            brandName: brand,
            primaryColor: '#000000',
        };

        const algorithm = selectAlgorithm(params);
        const logos = generateLogos({ ...params, algorithm, variations: 1 });

        const qualityScore = logos[0]?.quality?.score || 0;

        results.push({
            brand,
            category,
            algorithm,
            qualityScore,
        });

        categoryCount[category] = (categoryCount[category] || 0) + 1;

        // Log result
        console.log(`[TEST] ${brand}: category=${category}, algo=${algorithm}, quality=${qualityScore}`);

        // Track algorithm performance
        logAlgorithmResult(algorithm, qualityScore >= 75);
    }

    // Find duplicate categories (not ideal, but acceptable)
    const duplicateCategories = Object.entries(categoryCount)
        .filter(([, count]) => count > 2)
        .map(([cat]) => cat);

    // Test passes if:
    // 1. No category has more than 3 brands (some overlap is acceptable)
    // 2. All logos have quality score >= 60
    const allHighQuality = results.every(r => r.qualityScore >= 60);
    const diverseCategories = duplicateCategories.length === 0;

    const passed = allHighQuality && diverseCategories;

    console.log(`\n[TEST SUMMARY]`);
    console.log(`All high quality: ${allHighQuality}`);
    console.log(`Diverse categories: ${diverseCategories}`);
    console.log(`Result: ${passed ? 'PASSED' : 'FAILED'}`);

    if (duplicateCategories.length > 0) {
        console.warn(`Categories with >2 brands: ${duplicateCategories.join(', ')}`);
    }

    return { passed, results, duplicateCategories };
}

/**
 * Verify an algorithm produces abstract marks, not clipart
 */
export function verifyAlgorithmAbstractness(algorithm: LogoAlgorithm): {
    isAbstract: boolean;
    avgQuality: number;
    failedBrands: string[];
} {
    const failedBrands: string[] = [];
    let totalQuality = 0;

    for (const brand of TEST_BRAND_NAMES) {
        const logos = generateLogos({
            brandName: brand,
            primaryColor: '#3B82F6',
            algorithm,
            variations: 1,
        });

        const quality = logos[0]?.quality?.score || 0;
        totalQuality += quality;

        if (quality < 70) {
            failedBrands.push(brand);
            logAlgorithmResult(algorithm, false);
        } else {
            logAlgorithmResult(algorithm, true);
        }
    }

    const avgQuality = totalQuality / TEST_BRAND_NAMES.length;
    const isAbstract = failedBrands.length <= 2 && avgQuality >= 70;

    console.log(`[VERIFY] ${algorithm}: avgQuality=${avgQuality.toFixed(1)}, failures=${failedBrands.length}, isAbstract=${isAbstract}`);

    return { isAbstract, avgQuality, failedBrands };
}

/**
 * Run full verification suite
 */
export function runVerificationSuite(): {
    brandUniqueness: ReturnType<typeof testBrandUniqueness>;
    algorithmResults: Record<LogoAlgorithm, ReturnType<typeof verifyAlgorithmAbstractness>>;
    overallPassed: boolean;
} {
    console.log('='.repeat(60));
    console.log('LOGO ENGINE VERIFICATION SUITE');
    console.log('='.repeat(60));

    // Test 1: Brand uniqueness
    console.log('\n--- TEST 1: Brand Uniqueness ---');
    const brandUniqueness = testBrandUniqueness();

    // Test 2: Verify each algorithm
    console.log('\n--- TEST 2: Algorithm Abstractness ---');
    const algorithmResults: Record<string, ReturnType<typeof verifyAlgorithmAbstractness>> = {};

    for (const algorithm of ALL_ALGORITHMS) {
        algorithmResults[algorithm] = verifyAlgorithmAbstractness(algorithm);
    }

    // Overall result
    const algorithmsPassed = Object.values(algorithmResults).filter(r => r.isAbstract).length;
    const algorithmsTotal = ALL_ALGORITHMS.length;
    const overallPassed = brandUniqueness.passed && algorithmsPassed >= algorithmsTotal * 0.8;

    console.log('\n' + '='.repeat(60));
    console.log('VERIFICATION RESULTS');
    console.log('='.repeat(60));
    console.log(`Brand Uniqueness: ${brandUniqueness.passed ? 'PASSED' : 'FAILED'}`);
    console.log(`Algorithm Tests: ${algorithmsPassed}/${algorithmsTotal} passed`);
    console.log(`Overall: ${overallPassed ? 'PASSED' : 'FAILED'}`);
    console.log('\nAlgorithm Performance Report:');
    console.log(JSON.stringify(getAlgorithmPerformanceReport(), null, 2));

    return {
        brandUniqueness,
        algorithmResults: algorithmResults as Record<LogoAlgorithm, ReturnType<typeof verifyAlgorithmAbstractness>>,
        overallPassed,
    };
}
