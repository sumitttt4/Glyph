/**
 * Circle Overlap Generator (Figma-style)
 *
 * Creates overlapping circles with transparency effects
 * Venn diagram aesthetic, blend modes
 * Uses bezier circle approximations (no circle primitives)
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    CircleOverlapParams,
    QualityMetrics,
    HashParams,
    Point,
} from '../types';
import {
    createSeededRandom,
    generateBaseParams,
    generateLogoHash,
    generateLogoId,
    generateHashParamsSync,
    deriveParamsFromHash,
    calculateQualityScore,
    calculateComplexity,
    storeHash,
    createBezierCircle,
    createBezierEllipse,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors, withAlpha } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateCircleOverlapParams(hashParams: HashParams, rng: () => number): CircleOverlapParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const arrangements: Array<'horizontal' | 'vertical' | 'diagonal' | 'cluster'> =
        ['horizontal', 'vertical', 'diagonal', 'cluster'];

    return {
        ...base,
        circleCount: Math.max(2, Math.min(5, Math.round(derived.elementCount / 4) + 1)),
        circleSize: Math.max(20, Math.min(40, 30 + derived.scaleFactor * 5)),
        overlapAmount: Math.max(0.2, Math.min(0.6, derived.overlapAmount)),
        arrangementType: arrangements[derived.styleVariant % 4],
        opacityVariation: derived.organicAmount * 0.5,
        sizeVariation: derived.jitterAmount / 30,
    };
}

// ============================================
// CIRCLE ARRANGEMENT
// ============================================

/**
 * Calculate circle positions based on arrangement type
 */
function calculateCirclePositions(
    params: CircleOverlapParams,
    viewSize: number
): Array<{ cx: number; cy: number; r: number }> {
    const { circleCount, circleSize, overlapAmount, arrangementType, sizeVariation } = params;
    const baseRadius = (circleSize / 100) * viewSize * 0.5;
    const center = viewSize / 2;
    const circles: Array<{ cx: number; cy: number; r: number }> = [];

    switch (arrangementType) {
        case 'horizontal': {
            const spacing = baseRadius * 2 * (1 - overlapAmount);
            const totalWidth = spacing * (circleCount - 1);
            const startX = center - totalWidth / 2;

            for (let i = 0; i < circleCount; i++) {
                const sizeVar = 1 + (i % 2 === 0 ? sizeVariation : -sizeVariation);
                circles.push({
                    cx: startX + i * spacing,
                    cy: center,
                    r: baseRadius * sizeVar,
                });
            }
            break;
        }

        case 'vertical': {
            const spacing = baseRadius * 2 * (1 - overlapAmount);
            const totalHeight = spacing * (circleCount - 1);
            const startY = center - totalHeight / 2;

            for (let i = 0; i < circleCount; i++) {
                const sizeVar = 1 + (i % 2 === 0 ? sizeVariation : -sizeVariation);
                circles.push({
                    cx: center,
                    cy: startY + i * spacing,
                    r: baseRadius * sizeVar,
                });
            }
            break;
        }

        case 'diagonal': {
            const spacing = baseRadius * 2 * (1 - overlapAmount) * 0.7;
            const totalSpan = spacing * (circleCount - 1);
            const startX = center - totalSpan / 2;
            const startY = center - totalSpan / 2;

            for (let i = 0; i < circleCount; i++) {
                const sizeVar = 1 + (i % 2 === 0 ? sizeVariation : -sizeVariation);
                circles.push({
                    cx: startX + i * spacing,
                    cy: startY + i * spacing,
                    r: baseRadius * sizeVar,
                });
            }
            break;
        }

        case 'cluster': {
            // Arrange in a circular pattern
            const clusterRadius = baseRadius * (1 - overlapAmount) * 1.2;

            for (let i = 0; i < circleCount; i++) {
                const angle = (i / circleCount) * Math.PI * 2 - Math.PI / 2;
                const sizeVar = 1 + (i % 2 === 0 ? sizeVariation : -sizeVariation);
                circles.push({
                    cx: center + Math.cos(angle) * clusterRadius,
                    cy: center + Math.sin(angle) * clusterRadius,
                    r: baseRadius * sizeVar,
                });
            }
            break;
        }
    }

    return circles;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleCircleOverlap(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateCircleOverlapParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('circle-overlap', variant);

    // Calculate circle positions
    const circles = calculateCirclePositions(algoParams, size);

    // Define colors for each circle with transparency
    const colors = [
        primaryColor,
        accentColor || mixColors(primaryColor, '#ffffff', 0.3),
        mixColors(primaryColor, accentColor || primaryColor, 0.5),
        darken(primaryColor, 10),
        lighten(primaryColor, 20),
    ];

    // Render circles with bezier paths and transparency
    circles.forEach((circle, i) => {
        const circleGradId = `${uniqueId}-circle-${i}`;
        const color = colors[i % colors.length];
        const baseOpacity = 0.7 - algoParams.opacityVariation * (i / circles.length);

        // Create radial gradient for depth
        svg.addGradient(circleGradId, {
            type: 'radial',
            stops: [
                { offset: 0, color: lighten(color, 15), opacity: baseOpacity + 0.1 },
                { offset: 0.7, color: color, opacity: baseOpacity },
                { offset: 1, color: darken(color, 10), opacity: baseOpacity - 0.1 },
            ],
        });

        // Create bezier circle path
        const circlePath = createBezierCircle(circle.cx, circle.cy, circle.r);

        svg.path(circlePath, {
            fill: `url(#${circleGradId})`,
            opacity: baseOpacity.toString(),
        });
    });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'circle-overlap', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'circle-overlap',
        variant: variant + 1,
        svg: svgString,
        viewBox: `0 0 ${size} ${size}`,
        params: algoParams,
        quality,
        meta: {
            brandName,
            generatedAt: Date.now(),
            seed: hashParams.hashHex,
            hashParams,
            geometry: {
                usesGoldenRatio: false,
                gridBased: false,
                bezierCurves: true,
                symmetry: algoParams.arrangementType === 'cluster' ? 'radial' : 'none',
                pathCount: algoParams.circleCount,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: colors.slice(0, algoParams.circleCount),
            },
        },
    };

    return { logo, quality };
}

export function generateCircleOverlap(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleCircleOverlap(params, hashParams, v);

            if (quality.score > bestScore) {
                bestScore = quality.score;
                bestCandidate = logo;
            }

            if (quality.score >= minQualityScore) break;
        }

        if (bestCandidate) {
            storeHash({
                hash: bestCandidate.hash,
                brandName,
                algorithm: 'circle-overlap',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleCircleOverlapPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateCircleOverlapParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const circles = calculateCirclePositions(params, size);
    const colors = [primaryColor, accentColor || mixColors(primaryColor, '#ffffff', 0.3)];

    circles.forEach((circle, i) => {
        svg.addGradient(`circle-${i}`, {
            type: 'radial',
            stops: [
                { offset: 0, color: lighten(colors[i % colors.length], 10) },
                { offset: 1, color: colors[i % colors.length] },
            ],
        });

        svg.path(createBezierCircle(circle.cx, circle.cy, circle.r), {
            fill: `url(#circle-${i})`,
            opacity: '0.75',
        });
    });

    return svg.build();
}
