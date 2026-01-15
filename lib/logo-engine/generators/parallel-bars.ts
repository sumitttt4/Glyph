/**
 * Parallel Gradient Bars Generator (Stripe-style)
 *
 * Creates premium abstract gradient bar logos with bezier paths
 * Inspired by Stripe's iconic brand mark
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    ParallelBarsParams,
    Point,
    GradientDef,
} from '../types';
import {
    createSeededRandom,
    generateBaseParams,
    generateLogoHash,
    generateLogoId,
    addNoise,
    PHI,
    PHI_INVERSE,
    lerp,
    clamp,
    calculateComplexity,
    storeHash,
} from '../core/parametric-engine';
import { createSVG, SVGBuilder } from '../core/svg-builder';
import { lighten, darken, mixColors, createGradient } from '../core/color-utils';

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateParallelBarsParams(rng: () => number): ParallelBarsParams {
    const base = generateBaseParams(rng);
    return {
        ...base,
        barCount: 3 + Math.floor(rng() * 4),              // 3-6 bars
        barWidthRatio: 0.5 + rng() * 0.4,                 // 0.5-0.9
        barSkew: (rng() - 0.5) * 40,                      // -20 to 20
        barGap: 3 + rng() * 10,                           // 3-13
        barRoundness: 0.3 + rng() * 0.7,                  // 0.3-1
        gradientAngle: rng() * 180,                        // 0-180
        gradientSpread: 0.3 + rng() * 0.7,                // 0.3-1
        staggerOffset: rng() * 20,                         // 0-20
        taperAmount: rng() * 0.5,                          // 0-0.5
    };
}

// ============================================
// BEZIER BAR GENERATION
// ============================================

interface BarPath {
    d: string;
    gradientId: string;
    index: number;
}

/**
 * Generate a single bar as a bezier path (not rect primitive)
 */
function generateBarPath(
    params: ParallelBarsParams,
    index: number,
    totalBars: number,
    rng: () => number,
    size: number
): { points: Point[]; path: string } {
    const padding = size * params.paddingRatio;
    const availableHeight = size - padding * 2;
    const totalGapHeight = (totalBars - 1) * params.barGap;
    const barHeight = (availableHeight - totalGapHeight) / totalBars;

    // Calculate bar position with stagger
    const stagger = (index % 2 === 0 ? 1 : -1) * params.staggerOffset;
    const yPos = padding + index * (barHeight + params.barGap);

    // Calculate bar width with taper
    const taperFactor = 1 - params.taperAmount * (index / (totalBars - 1));
    const baseWidth = (size - padding * 2) * params.barWidthRatio * taperFactor;
    const width = addNoise(baseWidth, params.sizeVariance, rng, 10);

    // Center position with stagger
    const xStart = (size - width) / 2 + stagger;
    const xEnd = xStart + width;

    // Add noise to positions
    const noiseY = addNoise(0, params.noiseAmount, rng, 3);
    const skewOffset = Math.tan((params.barSkew * Math.PI) / 180) * barHeight;

    // Corner radius based on bar roundness
    const maxRadius = barHeight / 2;
    const radius = maxRadius * params.barRoundness;

    // Generate bezier path for rounded bar with potential skew
    const topLeft: Point = { x: xStart + skewOffset, y: yPos + noiseY };
    const topRight: Point = { x: xEnd + skewOffset, y: yPos + noiseY };
    const bottomRight: Point = { x: xEnd, y: yPos + barHeight + noiseY };
    const bottomLeft: Point = { x: xStart, y: yPos + barHeight + noiseY };

    // Construct smooth bezier path
    const path = createRoundedParallelogramPath(
        topLeft,
        topRight,
        bottomRight,
        bottomLeft,
        radius,
        params.curveTension
    );

    return {
        points: [topLeft, topRight, bottomRight, bottomLeft],
        path,
    };
}

/**
 * Create a rounded parallelogram using bezier curves
 */
function createRoundedParallelogramPath(
    tl: Point,
    tr: Point,
    br: Point,
    bl: Point,
    radius: number,
    tension: number
): string {
    const r = Math.min(radius, Math.abs(tr.x - tl.x) / 4, Math.abs(bl.y - tl.y) / 4);

    if (r < 1) {
        // No rounding, use straight lines with slight bezier for smoothness
        return `M ${tl.x} ${tl.y} L ${tr.x} ${tr.y} L ${br.x} ${br.y} L ${bl.x} ${bl.y} Z`;
    }

    // Calculate corner offsets
    const path: string[] = [];

    // Start from top-left after corner
    path.push(`M ${tl.x + r} ${tl.y}`);

    // Top edge to top-right corner
    path.push(`L ${tr.x - r} ${tr.y}`);

    // Top-right corner (bezier)
    path.push(
        `C ${tr.x - r * (1 - tension)} ${tr.y}, ${tr.x} ${tr.y + r * (1 - tension)}, ${tr.x} ${tr.y + r}`
    );

    // Right edge to bottom-right corner
    path.push(`L ${br.x} ${br.y - r}`);

    // Bottom-right corner (bezier)
    path.push(
        `C ${br.x} ${br.y - r * (1 - tension)}, ${br.x - r * (1 - tension)} ${br.y}, ${br.x - r} ${br.y}`
    );

    // Bottom edge to bottom-left corner
    path.push(`L ${bl.x + r} ${bl.y}`);

    // Bottom-left corner (bezier)
    path.push(
        `C ${bl.x + r * (1 - tension)} ${bl.y}, ${bl.x} ${bl.y - r * (1 - tension)}, ${bl.x} ${bl.y - r}`
    );

    // Left edge to top-left corner
    path.push(`L ${tl.x} ${tl.y + r}`);

    // Top-left corner (bezier)
    path.push(
        `C ${tl.x} ${tl.y + r * (1 - tension)}, ${tl.x + r * (1 - tension)} ${tl.y}, ${tl.x + r} ${tl.y}`
    );

    path.push('Z');

    return path.join(' ');
}

// ============================================
// GRADIENT GENERATION
// ============================================

function generateBarGradient(
    params: ParallelBarsParams,
    index: number,
    totalBars: number,
    primaryColor: string,
    accentColor?: string
): GradientDef {
    const progress = index / (totalBars - 1);
    const spread = params.gradientSpread;

    // Create color stops with variation
    const startColor = lighten(primaryColor, 25 * (1 - progress) * spread);
    const midColor = primaryColor;
    const endColor = accentColor
        ? mixColors(primaryColor, accentColor, progress * spread)
        : darken(primaryColor, 20 * progress * spread);

    return {
        type: 'linear',
        angle: params.gradientAngle + index * 5,
        stops: [
            { offset: 0, color: startColor },
            { offset: 0.5, color: midColor },
            { offset: 1, color: endColor },
        ],
    };
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateParallelBars(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        primaryColor,
        accentColor,
        variations = 3,
        seed = brandName,
    } = params;

    const logos: GeneratedLogo[] = [];
    const size = 100;

    for (let v = 0; v < variations; v++) {
        const variantSeed = `${seed}-parallel-bars-v${v}`;
        const rng = createSeededRandom(variantSeed);

        // Generate parameters for this variant
        const algoParams = generateParallelBarsParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('parallel-bars', v);

        // Generate bars
        const bars: BarPath[] = [];
        for (let i = 0; i < algoParams.barCount; i++) {
            const { path } = generateBarPath(
                algoParams,
                i,
                algoParams.barCount,
                rng,
                size
            );

            const gradientId = `${uniqueId}-grad-${i}`;
            const gradient = generateBarGradient(
                algoParams,
                i,
                algoParams.barCount,
                primaryColor,
                accentColor
            );

            svg.addGradient(gradientId, gradient);
            bars.push({ d: path, gradientId, index: i });
        }

        // Render bars as paths
        bars.forEach(bar => {
            svg.path(bar.d, {
                fill: `url(#${bar.gradientId})`,
                opacity: addNoise(algoParams.baseOpacity, algoParams.opacityFalloff * 0.1, rng, 0.1),
            });
        });

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'parallel-bars', v, algoParams);

        // Store hash for duplicate prevention
        storeHash({
            hash,
            brandName,
            algorithm: 'parallel-bars',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'parallel-bars',
            variant: v + 1,
            svg: svgString,
            viewBox: `0 0 ${size} ${size}`,
            params: algoParams,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: variantSeed,
                geometry: {
                    usesGoldenRatio: true,
                    gridBased: false,
                    bezierCurves: true,
                    symmetry: 'none',
                    pathCount: algoParams.barCount,
                    complexity: calculateComplexity(svgString),
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    gradient: bars[0] ? generateBarGradient(algoParams, 0, algoParams.barCount, primaryColor, accentColor) : undefined,
                    palette: [primaryColor, accentColor || lighten(primaryColor, 20)],
                },
            },
        });
    }

    return logos;
}

/**
 * Generate a single parallel bars logo with custom parameters
 */
export function generateSingleParallelBars(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<ParallelBarsParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateParallelBarsParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);
    const uniqueId = `single-parallel-${seed}`;

    for (let i = 0; i < params.barCount; i++) {
        const { path } = generateBarPath(params, i, params.barCount, rng, size);
        const gradientId = `${uniqueId}-g${i}`;
        const gradient = generateBarGradient(params, i, params.barCount, primaryColor, accentColor);

        svg.addGradient(gradientId, gradient);
        svg.path(path, { fill: `url(#${gradientId})` });
    }

    return svg.build();
}
