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

// New Symbol Generators
export {
    generateSoundWaves,
    generateSingleSoundWavesPreview,
} from './generators/sound-waves';

export {
    generateInfinityLoop,
    generateSingleInfinityLoopPreview,
} from './generators/infinity-loop';

export {
    generateShieldBadge,
    generateSingleShieldBadgePreview,
} from './generators/shield-badge';

export {
    generateHexagonTech,
    generateSingleHexagonTechPreview,
} from './generators/hexagon-tech';

export {
    generateHeartLove,
    generateSingleHeartLovePreview,
} from './generators/heart-love';

export {
    generateLeafOrganic,
    generateSingleLeafOrganicPreview,
} from './generators/leaf-organic';

export {
    generateCrownMark,
    generateSingleCrownMarkPreview,
} from './generators/crown-mark';

export {
    generateLightningBolt,
    generateSingleLightningBoltPreview,
} from './generators/lightning-bolt';

export {
    generateGearCog,
    generateSingleGearCogPreview,
} from './generators/gear-cog';

export {
    generateCloudSoft,
    generateSingleCloudSoftPreview,
} from './generators/cloud-soft';

export {
    generateDiamondGem,
    generateSingleDiamondGemPreview,
} from './generators/diamond-gem';

export {
    generateStarMark,
    generateSingleStarMarkPreview,
} from './generators/star-mark';

export {
    generateMoonPhase,
    generateSingleMoonPhasePreview,
} from './generators/moon-phase';

export {
    generateWaveFlow,
    generateSingleWaveFlowPreview,
} from './generators/wave-flow';

export {
    generateMountainPeak,
    generateSingleMountainPeakPreview,
} from './generators/mountain-peak';

export {
    generateArrowMark,
    generateSingleArrowMarkPreview,
} from './generators/arrow-mark';

export {
    generateLockSecure,
    generateSingleLockSecurePreview,
} from './generators/lock-secure';

export {
    generateEyeVision,
    generateSingleEyeVisionPreview,
} from './generators/eye-vision';

export {
    generateLetterGradient,
    generateSingleLetterGradientPreview,
} from './generators/letter-gradient';

export {
    generateBoxLogo,
    generateSingleBoxLogoPreview,
} from './generators/box-logo';

export {
    generateCircularEmblem,
    generateSingleCircularEmblemPreview,
} from './generators/circular-emblem';

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

// Visual Synthesis Generator (Cole Palmer Rule)
export {
    generateInitialSynthesis,
    generateSingleInitialSynthesisPreview,
    generateSynthesisConstructionGrid,
} from './generators/initial-synthesis';

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
// New generators
import { generateSoundWaves } from './generators/sound-waves';
import { generateInfinityLoop } from './generators/infinity-loop';
import { generateShieldBadge } from './generators/shield-badge';
import { generateHexagonTech } from './generators/hexagon-tech';
import { generateHeartLove } from './generators/heart-love';
import { generateLeafOrganic } from './generators/leaf-organic';
import { generateCrownMark } from './generators/crown-mark';
import { generateLightningBolt } from './generators/lightning-bolt';
import { generateGearCog } from './generators/gear-cog';
import { generateCloudSoft } from './generators/cloud-soft';
import { generateDiamondGem } from './generators/diamond-gem';
import { generateStarMark } from './generators/star-mark';
import { generateMoonPhase } from './generators/moon-phase';
import { generateWaveFlow } from './generators/wave-flow';
import { generateMountainPeak } from './generators/mountain-peak';
import { generateArrowMark } from './generators/arrow-mark';
import { generateLockSecure } from './generators/lock-secure';
import { generateEyeVision } from './generators/eye-vision';
import { generateLetterGradient } from './generators/letter-gradient';
import { generateBoxLogo } from './generators/box-logo';
import { generateCircularEmblem } from './generators/circular-emblem';
import { generateDnaHelix } from './generators/dna-helix';
import { generateOrbitalPaths } from './generators/orbital-paths';
import { generateFingerprintId } from './generators/fingerprint-id';
import { generateMazePattern } from './generators/maze-pattern';
import { generateLogoAnimation } from './animation/animation-export';

/**
 * All available algorithms
 */
export const ALL_ALGORITHMS: LogoAlgorithm[] = [
    // Original 13
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
    // New Symbol Algorithms
    'sound-waves',
    'infinity-loop',
    'shield-badge',
    'hexagon-tech',
    'heart-love',
    'leaf-organic',
    'crown-mark',
    'lightning-bolt',
    'gear-cog',
    'cloud-soft',
    'diamond-gem',
    'star-mark',
    'moon-phase',
    'wave-flow',
    'mountain-peak',
    'arrow-mark',
    'lock-secure',
    'eye-vision',
    // Wordmark Algorithms
    'letter-gradient',
    'box-logo',
    'circular-emblem',
    // Advanced Algorithms
    'dna-helix',
    'orbital-paths',
    'fingerprint-id',
    'maze-pattern',
];

/**
 * Symbol-only algorithms (for archetype='symbol')
 */
export const SYMBOL_ALGORITHMS: LogoAlgorithm[] = [
    'starburst',
    'perfect-triangle',
    'circle-overlap',
    'depth-geometry',
    'orbital-rings',
    'flow-gradient',
    'isometric-cube',
    'abstract-mark',
    'sound-waves',
    'infinity-loop',
    'shield-badge',
    'hexagon-tech',
    'heart-love',
    'leaf-organic',
    'crown-mark',
    'lightning-bolt',
    'gear-cog',
    'cloud-soft',
    'diamond-gem',
    'star-mark',
    'moon-phase',
    'wave-flow',
    'mountain-peak',
    'arrow-mark',
    'lock-secure',
    'eye-vision',
    'dna-helix',
    'orbital-paths',
    'fingerprint-id',
    'maze-pattern',
];

/**
 * Wordmark algorithms (for archetype='wordmark')
 */
export const WORDMARK_ALGORITHMS: LogoAlgorithm[] = [
    'framed-letter',
    'motion-lines',
    'gradient-bars',
    'letter-swoosh',
    'monogram-blend',
    'letter-gradient',
    'box-logo',
    'circular-emblem',
];

/**
 * Algorithm metadata for UI
 */
export const ALGORITHM_INFO: Partial<Record<LogoAlgorithm, {
    name: string;
    description: string;
    inspiration: string;
}>> = {
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
    // New symbol algorithms
    'sound-waves': {
        name: 'Sound Waves',
        description: 'Flowing audio waveforms with decay and amplitude',
        inspiration: 'Spotify',
    },
    'infinity-loop': {
        name: 'Infinity Loop',
        description: 'Infinite loop ribbon with smooth crossover',
        inspiration: 'Meta',
    },
    'shield-badge': {
        name: 'Shield Badge',
        description: 'Protective shield with inner patterns and crests',
        inspiration: 'Security Apps',
    },
    'hexagon-tech': {
        name: 'Hexagon Tech',
        description: 'Hexagonal patterns with circuit-like connections',
        inspiration: 'Blockchain/Tech',
    },
    'heart-love': {
        name: 'Heart Love',
        description: 'Heart symbols from classic to modern geometric',
        inspiration: 'Social/Dating',
    },
    'leaf-organic': {
        name: 'Leaf Organic',
        description: 'Organic leaf shapes with natural vein patterns',
        inspiration: 'Eco/Nature',
    },
    'crown-mark': {
        name: 'Crown Mark',
        description: 'Regal crown shapes with jewel details',
        inspiration: 'Premium/Luxury',
    },
    'lightning-bolt': {
        name: 'Lightning Bolt',
        description: 'Dynamic lightning shapes with electric energy',
        inspiration: 'Energy/Speed',
    },
    'gear-cog': {
        name: 'Gear Cog',
        description: 'Mechanical gear shapes with precision teeth',
        inspiration: 'Engineering/Industrial',
    },
    'cloud-soft': {
        name: 'Cloud Soft',
        description: 'Fluffy cloud shapes with soft edges',
        inspiration: 'Cloud/SaaS',
    },
    'diamond-gem': {
        name: 'Diamond Gem',
        description: 'Faceted diamond shapes with light reflections',
        inspiration: 'Luxury/Premium',
    },
    'star-mark': {
        name: 'Star Mark',
        description: 'Various star shapes with multiple ray styles',
        inspiration: 'Rating/Awards',
    },
    'moon-phase': {
        name: 'Moon Phase',
        description: 'Crescent moon and lunar phase shapes',
        inspiration: 'Night/Mystery',
    },
    'wave-flow': {
        name: 'Wave Flow',
        description: 'Flowing wave patterns with ocean aesthetic',
        inspiration: 'Water/Fluid',
    },
    'mountain-peak': {
        name: 'Mountain Peak',
        description: 'Mountain silhouette shapes with snow caps',
        inspiration: 'Outdoor/Adventure',
    },
    'arrow-mark': {
        name: 'Arrow Mark',
        description: 'Dynamic arrow shapes with motion feel',
        inspiration: 'Direction/Growth',
    },
    'lock-secure': {
        name: 'Lock Secure',
        description: 'Padlock and security lock shapes',
        inspiration: 'Security/Trust',
    },
    'eye-vision': {
        name: 'Eye Vision',
        description: 'Eye and vision-focused shapes',
        inspiration: 'Vision/AI',
    },
    'letter-gradient': {
        name: 'Letter Gradient',
        description: 'Colorful letter marks with gradient fills',
        inspiration: 'Google',
    },
    'box-logo': {
        name: 'Box Logo',
        description: 'Bold box frame logo with text',
        inspiration: 'Supreme',
    },
    'circular-emblem': {
        name: 'Circular Emblem',
        description: 'Circular seal designs with inner symbols',
        inspiration: 'Starbucks',
    },
    'dna-helix': {
        name: 'DNA Helix',
        description: 'Double helix DNA structures',
        inspiration: 'Biotech',
    },
    'orbital-paths': {
        name: 'Orbital Paths',
        description: 'Orbital rings around central body',
        inspiration: 'Space/Tech',
    },
    'fingerprint-id': {
        name: 'Fingerprint ID',
        description: 'Fingerprint-inspired patterns',
        inspiration: 'Identity/Security',
    },
    'maze-pattern': {
        name: 'Maze Pattern',
        description: 'Labyrinth and maze patterns',
        inspiration: 'Complexity/Puzzle',
    },
};

/**
 * Auto-select algorithm based on input parameters
 * Supports archetype filtering: symbol, wordmark, or both
 */
function selectAlgorithm(params: LogoGenerationParams & { archetype?: 'symbol' | 'wordmark' | 'both' }): LogoAlgorithm {
    const { brandName, industry, aesthetic, seed = brandName, archetype } = params;
    const rng = createSeededRandom(seed);

    // Archetype-based filtering
    if (archetype === 'symbol') {
        // Only select from symbol-only algorithms
        return SYMBOL_ALGORITHMS[Math.floor(rng() * SYMBOL_ALGORITHMS.length)];
    }

    if (archetype === 'wordmark') {
        // Only select from wordmark algorithms
        return WORDMARK_ALGORITHMS[Math.floor(rng() * WORDMARK_ALGORITHMS.length)];
    }

    // For 'both' or undefined, use industry/aesthetic selection from all algorithms

    // Industry-based selection with new algorithms
    if (industry === 'technology') {
        const techAlgos: LogoAlgorithm[] = [
            'starburst', 'motion-lines', 'depth-geometry', 'abstract-mark', 'isometric-cube',
            'sound-waves', 'hexagon-tech', 'infinity-loop'
        ];
        return techAlgos[Math.floor(rng() * techAlgos.length)];
    }

    if (industry === 'finance') {
        const financeAlgos: LogoAlgorithm[] = [
            'framed-letter', 'perfect-triangle', 'gradient-bars', 'monogram-blend', 'shield-badge'
        ];
        return financeAlgos[Math.floor(rng() * financeAlgos.length)];
    }

    if (industry === 'creative') {
        const creativeAlgos: LogoAlgorithm[] = [
            'starburst', 'circle-overlap', 'letter-swoosh', 'flow-gradient', 'orbital-rings',
            'heart-love', 'infinity-loop'
        ];
        return creativeAlgos[Math.floor(rng() * creativeAlgos.length)];
    }

    if (industry === 'healthcare') {
        const healthAlgos: LogoAlgorithm[] = [
            'circle-overlap', 'starburst', 'flow-gradient', 'orbital-rings', 'heart-love', 'leaf-organic'
        ];
        return healthAlgos[Math.floor(rng() * healthAlgos.length)];
    }

    if (industry === 'sustainability') {
        const ecoAlgos: LogoAlgorithm[] = [
            'leaf-organic', 'flow-gradient', 'circle-overlap', 'starburst'
        ];
        return ecoAlgos[Math.floor(rng() * ecoAlgos.length)];
    }

    // Aesthetic-based selection
    if (aesthetic === 'tech-minimal') {
        const minimalAlgos: LogoAlgorithm[] = [
            'motion-lines', 'perfect-triangle', 'gradient-bars', 'abstract-mark', 'hexagon-tech', 'sound-waves'
        ];
        return minimalAlgos[Math.floor(rng() * minimalAlgos.length)];
    }

    if (aesthetic === 'bold-geometric') {
        const boldAlgos: LogoAlgorithm[] = [
            'depth-geometry', 'isometric-cube', 'framed-letter', 'perfect-triangle', 'shield-badge', 'hexagon-tech'
        ];
        return boldAlgos[Math.floor(rng() * boldAlgos.length)];
    }

    if (aesthetic === 'elegant-refined') {
        const elegantAlgos: LogoAlgorithm[] = [
            'monogram-blend', 'framed-letter', 'flow-gradient', 'orbital-rings', 'infinity-loop'
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
        // New symbol algorithms
        case 'sound-waves':
            return generateSoundWaves(params);
        case 'infinity-loop':
            return generateInfinityLoop(params);
        case 'shield-badge':
            return generateShieldBadge(params);
        case 'hexagon-tech':
            return generateHexagonTech(params);
        case 'heart-love':
            return generateHeartLove(params);
        case 'leaf-organic':
            return generateLeafOrganic(params);
        case 'crown-mark':
            return generateCrownMark(params);
        case 'lightning-bolt':
            return generateLightningBolt(params);
        case 'gear-cog':
            return generateGearCog(params);
        case 'cloud-soft':
            return generateCloudSoft(params);
        case 'diamond-gem':
            return generateDiamondGem(params);
        case 'star-mark':
            return generateStarMark(params);
        case 'moon-phase':
            return generateMoonPhase(params);
        case 'wave-flow':
            return generateWaveFlow(params);
        case 'mountain-peak':
            return generateMountainPeak(params);
        case 'arrow-mark':
            return generateArrowMark(params);
        case 'lock-secure':
            return generateLockSecure(params);
        case 'eye-vision':
            return generateEyeVision(params);
        case 'letter-gradient':
            return generateLetterGradient(params);
        case 'box-logo':
            return generateBoxLogo(params);
        case 'circular-emblem':
            return generateCircularEmblem(params);
        case 'dna-helix':
            return generateDnaHelix(params);
        case 'orbital-paths':
            return generateOrbitalPaths(params);
        case 'fingerprint-id':
            return generateFingerprintId(params);
        case 'maze-pattern':
            return generateMazePattern(params);
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

// ============================================
// SEMANTIC LOGO ENGINE
// ============================================

import {
    analyzeSemantics,
    getSemanticAlgorithms,
    getSemanticContext,
    KEYWORD_SHAPE_MAP,
    INDUSTRY_SHAPE_MAP,
    LETTER_SHAPE_MAP,
    type SemanticAnalysis,
    type ShapeMapping,
    type IndustryMapping,
    type LetterAnalysis,
} from '@/lib/semantic-logo-engine';

// Re-export semantic types
export type { SemanticAnalysis, ShapeMapping, IndustryMapping, LetterAnalysis };

// Re-export semantic utilities
export { analyzeSemantics, getSemanticAlgorithms, getSemanticContext };

// Export mappings for external use
export { KEYWORD_SHAPE_MAP, INDUSTRY_SHAPE_MAP, LETTER_SHAPE_MAP };

/**
 * Generate logos using semantic analysis of brand name and category.
 * 
 * This is the SMART entry point for logo generation.
 * It analyzes the brand name for keywords, industry context, and letter shapes
 * to select the most contextually relevant algorithms.
 * 
 * Example: "Brewly" + "Coffee Shop" = steam/cup-inspired algorithms
 * Example: "CloudSync" + "Tech" = cloud + data flow algorithms
 * Example: "SecureVault" + "Fintech" = shield + lock algorithms
 * 
 * @param brandName - The brand name to analyze
 * @param category - Optional industry/category context
 * @param primaryColor - Primary brand color
 * @param options - Additional generation options
 */
export function generateSemanticLogos(
    brandName: string,
    category: string | undefined,
    primaryColor: string,
    options?: {
        accentColor?: string;
        aesthetic?: LogoGenerationParams['aesthetic'];
        variations?: number;
        seed?: number;
    }
): {
    logos: GeneratedLogo[];
    analysis: SemanticAnalysis;
    context: string;
} {
    // Perform semantic analysis
    const analysis = analyzeSemantics(brandName, category, options?.aesthetic);
    const context = getSemanticContext(brandName, category);

    // Get recommended algorithms from semantic analysis
    const recommendedAlgorithms = getSemanticAlgorithms(
        brandName,
        category,
        options?.aesthetic,
        options?.seed
    );

    // Generate logos from each recommended algorithm
    const allLogos: GeneratedLogo[] = [];
    const variationsPerAlgo = Math.max(1, Math.floor((options?.variations || 6) / recommendedAlgorithms.length));

    for (const algoName of recommendedAlgorithms) {
        // Map semantic algorithm names to actual LogoAlgorithm types
        const algorithm = algoName as LogoAlgorithm;

        // Check if it's a valid algorithm
        if (ALL_ALGORITHMS.includes(algorithm)) {
            try {
                const logos = generateLogos({
                    brandName,
                    primaryColor,
                    accentColor: options?.accentColor,
                    industry: mapCategoryToIndustry(category),
                    aesthetic: options?.aesthetic,
                    algorithm,
                    variations: variationsPerAlgo,
                    seed: options?.seed ? `${options.seed}-${algorithm}` : undefined,
                });
                allLogos.push(...logos);
            } catch (e) {
                console.warn(`[Semantic] Failed to generate ${algorithm}:`, e);
            }
        }
    }

    // If no logos generated, fall back to default generation
    if (allLogos.length === 0) {
        const fallbackLogos = generateLogos({
            brandName,
            primaryColor,
            accentColor: options?.accentColor,
            variations: options?.variations || 6,
        });
        allLogos.push(...fallbackLogos);
    }

    return {
        logos: getUniqueLogos(allLogos),
        analysis,
        context,
    };
}

/**
 * Map user-provided category string to LogoGenerationParams industry type
 */
function mapCategoryToIndustry(category?: string): LogoGenerationParams['industry'] | undefined {
    if (!category) return undefined;

    const lowerCategory = category.toLowerCase();

    // Map common category keywords to industry types
    const industryMappings: Record<string, LogoGenerationParams['industry']> = {
        'tech': 'technology',
        'technology': 'technology',
        'software': 'technology',
        'saas': 'technology',
        'ai': 'technology',
        'app': 'technology',
        'digital': 'technology',
        'finance': 'finance',
        'fintech': 'finance',
        'bank': 'finance',
        'money': 'finance',
        'invest': 'finance',
        'crypto': 'finance',
        'health': 'healthcare',
        'healthcare': 'healthcare',
        'medical': 'healthcare',
        'wellness': 'healthcare',
        'pharma': 'healthcare',
        'creative': 'creative',
        'design': 'creative',
        'art': 'creative',
        'studio': 'creative',
        'agency': 'creative',
        'media': 'creative',
        'eco': 'sustainability',
        'green': 'sustainability',
        'organic': 'sustainability',
        'sustainable': 'sustainability',
        'environment': 'sustainability',
        'nature': 'sustainability',
    };

    for (const [keyword, industry] of Object.entries(industryMappings)) {
        if (lowerCategory.includes(keyword)) {
            return industry;
        }
    }

    return undefined;
}

/**
 * Quick semantic generation - simplified API
 */
export function quickSemanticGenerate(
    brandName: string,
    primaryColor: string,
    category?: string
): GeneratedLogo[] {
    const { logos } = generateSemanticLogos(brandName, category, primaryColor);
    return logos;
}

/**
 * Get algorithm recommendations based on semantic analysis
 * Useful for UI to show why certain algorithms were selected
 */
export function getAlgorithmRecommendations(
    brandName: string,
    category?: string
): {
    recommended: string[];
    reasons: string[];
} {
    const analysis = analyzeSemantics(brandName, category);
    const reasons: string[] = [];

    // Build reason strings
    if (analysis.matchedKeywords.length > 0) {
        reasons.push(`Found keywords: ${analysis.matchedKeywords.map(k => k.word).join(', ')}`);
    }

    if (analysis.industry) {
        reasons.push(`Industry match: ${analysis.industry.name}`);
    }

    if (analysis.letterAnalysis.length > 0) {
        const letters = analysis.letterAnalysis.map(l => l.letter).join('');
        const meanings = analysis.letterAnalysis.flatMap(l => l.hiddenMeanings).slice(0, 3);
        reasons.push(`Letter "${letters}" meanings: ${meanings.join(', ')}`);
    }

    return {
        recommended: analysis.recommendedAlgorithms.slice(0, 5),
        reasons,
    };
}

