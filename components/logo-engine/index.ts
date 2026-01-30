/**
 * Parametric Logo Engine v7 - MODERN TECHNIQUES ONLY
 * Replaced with 10 high-quality modern algorithms.
 */

export * from './types';
export * from './core/parametric-engine';
export * from './core/svg-builder';
export * from './core/color-utils';

// Import new generators
import {
    generateLineFragmentation,
    generateStaggeredBars,
    generateBlockAssembly,
    generateMotionChevrons,
    generateNegativeSpace,
    generateInterlockingLoops,
    generateMonogramMerge,
    generateContinuousStroke,
    generateGeometricExtract,
    generateCloverRadial,
    // Previews
    generateSingleLineFragmentationPreview,
    generateSingleStaggeredBarsPreview,
    generateSingleBlockAssemblyPreview,
    generateSingleMotionChevronsPreview,
    generateSingleNegativeSpacePreview,
    generateSingleInterlockingLoopsPreview,
    generateSingleMonogramMergePreview,
    generateSingleContinuousStrokePreview,
    generateSingleGeometricExtractPreview,
    generateSingleCloverRadialPreview
} from './generators/modern-techniques';

// Re-export specific single previews if needed by UI
export {
    generateSingleLineFragmentationPreview,
    generateSingleStaggeredBarsPreview,
    generateSingleBlockAssemblyPreview,
    generateSingleMotionChevronsPreview,
    generateSingleNegativeSpacePreview,
    generateSingleInterlockingLoopsPreview,
    generateSingleMonogramMergePreview,
    generateSingleContinuousStrokePreview,
    generateSingleGeometricExtractPreview,
    generateSingleCloverRadialPreview
};

import { LogoGenerationParams, GeneratedLogo, LogoAlgorithm, AnimationPreset } from './types';
import { createSeededRandom } from './core/parametric-engine';
import { generateLogoAnimation } from './animation/animation-export';

// Animation exports
export {
    ANIMATION_PRESETS,
    generateLottieAnimation,
    generateCSSAnimation,
    generateLogoAnimation,
    exportAnimationPackage,
} from './animation/animation-export';

// Variatons exports
export {
    generateLogoVariations,
    generateAllLogoVariations,
    getLogoVariation,
    VARIATION_TYPES,
    VARIATION_INFO,
    LogoVariationsPreview,
    LogoVariationSelector,
} from './variations';

// Infinite engine exports
export {
    generateInfiniteLogos,
    generateSingleInfiniteLogo,
    generateAllAlgorithmSamples,
    regenerateLogo,
    verifyUniqueness,
    getAlgorithmInfo,
    getGenerationStats,
    selectAlgorithmForBrand,
} from './infinite-engine';

// Smart logo system exports
export {
    selectBestAlgorithms,
    getTopAlgorithms,
    validateAccessibility,
    validateStyleConsistency,
    suggestWordmarkStyles,
    suggestColorPalettes,
    analyzeBrand,
    INDUSTRY_ALGORITHM_MAP,
    PERSONALITY_ALGORITHM_MAP,
} from './core/smart-logo-system';
export type { BrandProfile, BrandAnalysis, AccessibilityResult, StyleConsistencyResult, ColorPaletteSuggestion } from './core/smart-logo-system';

// SVG effects exports
export {
    createDropShadowFilter,
    createInnerShadowFilter,
    createLongShadowFilter,
    createOuterGlowFilter,
    createInnerGlowFilter,
    createBevelFilter,
    createEmbossFilter,
    createNoiseTextureFilter,
    createGrainTextureFilter,
    createHalftoneTextureFilter,
    createLinearGradientDef,
    createRadialGradientDef,
    createDuotoneFilter,
    createColorOverlayFilter,
    createBlurFilter,
    applyEffects,
    applyPresetToSvg,
    getAvailablePresets,
    getPresetInfo,
    EFFECT_PRESETS,
} from './core/svg-effects';
export type {
    ShadowEffect,
    GlowEffect,
    BevelEffect,
    TextureEffect,
    GradientEffect,
    GradientStop,
    ColorOverlay,
    LogoEffect,
    EffectPreset,
    EffectResult,
} from './core/svg-effects';

// Brand guidelines exports
export {
    generateBrandGuidelines,
    exportGuidelinesAsMarkdown,
    exportGuidelinesAsJSON,
} from './core/brand-guidelines';
export type {
    BrandGuidelines,
    ClearSpaceRule,
    MinimumSizeRule,
    ColorVariation,
    UsageRule,
    TypographySuggestion,
    ApplicationExample,
} from './core/brand-guidelines';


export const ALL_ALGORITHMS: LogoAlgorithm[] = [
    'line-fragmentation',
    'staggered-bars',
    'block-assembly',
    'motion-chevrons',
    'negative-space',
    'interlocking-loops',
    'monogram-merge',
    'continuous-stroke',
    'geometric-extract',
    'clover-radial'
];

export const SYMBOL_ALGORITHMS: LogoAlgorithm[] = [
    'line-fragmentation', 'staggered-bars', 'block-assembly', 'motion-chevrons',
    'interlocking-loops', 'continuous-stroke', 'clover-radial'
];

export const WORDMARK_ALGORITHMS: LogoAlgorithm[] = [
    'negative-space', 'monogram-merge', 'geometric-extract'
];

export const ALGORITHM_INFO: Record<LogoAlgorithm, {
    name: string;
    description: string;
    inspiration: string;
    category: 'lettermark' | 'geometric' | 'symbol' | 'radial' | 'overlapping' | 'lineart' | 'pattern';
    // Kept union broad to match types if possible, or cast
}> = {
    'line-fragmentation': {
        name: 'Line Fragmentation',
        description: 'Shape formed from parallel lines with strategic gaps.',
        inspiration: 'Modern Tech',
        category: 'symbol'
    },
    'staggered-bars': {
        name: 'Staggered Bars',
        description: 'Dynamic horizontal bars resembling digital signal.',
        inspiration: 'Audio/Data',
        category: 'symbol'
    },
    'block-assembly': {
        name: '3D Block Assembly',
        description: 'Overlapping geometric shapes with depth and transparency.',
        inspiration: 'Zwitters',
        category: 'symbol'
    },
    'motion-chevrons': {
        name: 'Motion Chevrons',
        description: 'Stacked arrows indicating forward momentum.',
        inspiration: 'Accelera',
        category: 'symbol'
    },
    'negative-space': {
        name: 'Negative Space',
        description: 'Letterform revealed through negative space in a solid shape.',
        inspiration: 'Kompose',
        category: 'lettermark'
    },
    'interlocking-loops': {
        name: 'Interlocking Loops',
        description: 'Shapes weaving through each other for unity.',
        inspiration: 'Anchortack',
        category: 'symbol'
    },
    'monogram-merge': {
        name: 'Monogram Merge',
        description: 'Multiple letters fused into a single mark.',
        inspiration: 'Dipeook',
        category: 'lettermark'
    },
    'continuous-stroke': {
        name: 'Continuous Stroke',
        description: 'A single unbroken line forming an abstract shape.',
        inspiration: 'Line Art',
        category: 'symbol'
    },
    'geometric-extract': {
        name: 'Geometric Extract',
        description: 'Zoomed-in geometric abstraction of a letter part.',
        inspiration: 'Typography',
        category: 'lettermark'
    },
    'clover-radial': {
        name: 'Clover Radial',
        description: 'Rotational symmetry with organic leaf-like shapes.',
        inspiration: 'Quanter',
        category: 'symbol'
    }
};

// Simple selector
function selectAlgorithm(params: LogoGenerationParams): LogoAlgorithm {
    const { brandName, seed = brandName } = params;
    const rng = createSeededRandom(seed);
    return ALL_ALGORITHMS[Math.floor(rng() * ALL_ALGORITHMS.length)];
}

// Main generation function
export function generateLogos(params: LogoGenerationParams): GeneratedLogo[] {
    const algorithm = params.algorithm || selectAlgorithm(params);

    switch (algorithm) {
        case 'line-fragmentation': return generateLineFragmentation(params);
        case 'staggered-bars': return generateStaggeredBars(params);
        case 'block-assembly': return generateBlockAssembly(params);
        case 'motion-chevrons': return generateMotionChevrons(params);
        case 'negative-space': return generateNegativeSpace(params);
        case 'interlocking-loops': return generateInterlockingLoops(params);
        case 'monogram-merge': return generateMonogramMerge(params);
        case 'continuous-stroke': return generateContinuousStroke(params);
        case 'geometric-extract': return generateGeometricExtract(params);
        case 'clover-radial': return generateCloverRadial(params);
        default: return generateLineFragmentation(params);
    }
}

export function generateAllAlgorithms(params: LogoGenerationParams): GeneratedLogo[] {
    const allLogos: GeneratedLogo[] = [];
    for (const algorithm of ALL_ALGORITHMS) {
        const logos = generateLogos({ ...params, algorithm, variations: 1 });
        allLogos.push(...logos);
    }
    return allLogos;
}

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

export function generateBrandPackage(params: LogoGenerationParams): {
    primary: GeneratedLogo[];
    secondary: GeneratedLogo[];
    icons: GeneratedLogo[];
    patterns: GeneratedLogo[];
} {
    // Generate a diverse set
    return {
        primary: generateLogos({ ...params, algorithm: 'monogram-merge', variations: 2 }),
        secondary: generateLogos({ ...params, algorithm: 'continuous-stroke', variations: 2 }),
        icons: generateLogos({ ...params, algorithm: 'negative-space', variations: 2 }),
        patterns: generateLogos({ ...params, algorithm: 'staggered-bars', variations: 2 }),
    };
}

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

export function getUniqueLogos(logos: GeneratedLogo[]): GeneratedLogo[] {
    const seen = new Set<string>();
    return logos.filter(logo => {
        if (seen.has(logo.hash)) return false;
        seen.add(logo.hash);
        return true;
    });
}
