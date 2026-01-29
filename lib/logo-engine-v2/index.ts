/**
 * Logo Engine V2 - Main Exports
 * 
 * Unified export point for all logo engine components including:
 * - Letter Skeleton System (typography anatomy)
 * - Skeleton-based Techniques (MODULAR, STENCIL, OUTLINE, etc.)
 * - Infinite Logo Engine (batch generation)
 * - Algorithms Library (100+ logo variants)
 */

// === LETTER SKELETON SYSTEM ===
export {
    // Types
    type Point,
    type CurveHandle,
    type AnatomyType,
    type AnatomyPart,
    type LetterSkeleton,

    // Data
    LETTER_SKELETONS,
    LETTER_SKELETON_SUMMARY,

    // Core Functions
    getSkeleton,
    getAllSkeletons,
    getPrimaryAnchors,
    getAnatomyByType,
    scaleSkeleton,
    renderSkeleton,
    getSkeletonBounds,
    transformAnchors,

    // Technique Helpers
    getModularPoints,
    getStencilGaps,
    getOutlineSegments,
    getLettersByAnatomy,
    hasCurvedElements,
    hasDiagonalElements,
    getDominantAnatomy,
} from './letter-skeletons';

// === SKELETON TECHNIQUES ===
export {
    SKELETON_TECHNIQUES,
    type SkeletonTechnique,
    getAvailableTechniques,
    generateWithTechnique,
    generateModular,
    generateStencil,
    generateOutline,
    generateGeometricConstruction,
    generateCalligraphic,
    generateMonoline,
    generateShadowLetter,
    generateDottedSkeleton,
} from './algorithms/skeleton-techniques';

// === ALGORITHMS ===
export { ALGORITHMS } from './algorithms/index';
export { generateInterlocking } from './algorithms/interlocking';
export { generateLetterFusion } from './algorithms/letter-fusion';
export {
    generateConstruction,
    generateNeoGradient,
    generateNegativeSpace,
    generateSwissMinimal,
} from './algorithms/premium';
export { LOGO_LIBRARY, getRandomVariant } from './algorithms/library';

// === ABSTRACT ICONS (Symbol-only logos) ===
export {
    generateAbstractIcon,
    generateIconVariations,
    getAvailableCategories,
    getCategoryKeywords,
    CATEGORY_COMPOSITIONS,
    // Individual category generators
    generateSpeedIcon,
    generateGrowthIcon,
    generateConnectIcon,
    generateSecureIcon,
    generateTechIcon,
    generateCreativeIcon,
    generateDataIcon,
    generateCommunicationIcon,
    generateFinanceIcon,
    generateHealthIcon,
    generateDefaultIcon,
} from './abstract-icons';

// === DESIGNER BRAIN SYSTEM ===
export {
    // Main function
    runDesignerBrain,
    designerGenerate,

    // Individual phases
    runDiscovery,
    runWordAssociation,
    runSketching,
    runRefinement,
    runQualityCheck,

    // Data/mappings
    INDUSTRY_CONCEPTS,
    PERSONALITY_TO_VISUAL,
    VISUAL_METAPHORS,

    // Color recommendations
    INDUSTRY_COLORS,
    CATEGORY_ALIASES,
    getRecommendedColors,
    getAvailableColorCategories,
    type ColorPalette,

    // Types
    type BrandInput,
    type DesignerDiscovery,
    type ConceptAssociation,
    type SketchConcept,
    type RefinedLogo,
    type DesignerOutput,
} from './designer-brain';

// === CORE ENGINE ===
export { InfiniteLogoEngine } from './master';
export { UniquenessSystem } from './uniqueness';

// === TYPES ===
export type { InfiniteLogoParams, InfiniteLogoResult } from './types';
