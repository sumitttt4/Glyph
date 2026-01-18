/**
 * Infinity Loop Generator (Meta-style)
 *
 * Creates infinite loop/ribbon shapes with smooth crossovers
 * Flowing figure-8 with gradient and depth effects
 * Inspired by Meta's infinity symbol
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    InfinityLoopParams,
    QualityMetrics,
    HashParams,
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
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateInfinityLoopParams(hashParams: HashParams, rng: () => number): InfinityLoopParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    return {
        ...base,
        loopWidth: derived.armLength * 0.8 + 30,
        loopHeight: derived.armWidth * 1.5 + 20,
        crossoverAngle: derived.rotationOffset * 0.15 + 20,
        strokeTaper: derived.taperRatio,
        thickness: derived.strokeWidth * 0.8 + 3,
        twistAmount: derived.organicAmount,
        gradientFlow: derived.styleVariant % 2 === 0,
        innerGap: derived.centerRadius * 0.4 + 2,
        smoothness: derived.curveTension * 0.5 + 0.5,
        ribbonStyle: derived.styleVariant > 4,
    };
}

// ============================================
// PATH GENERATION
// ============================================

/**
 * Generate infinity loop path using bezier curves
 */
function generateInfinityPath(
    params: InfinityLoopParams,
    cx: number,
    cy: number,
    isInner: boolean = false
): string {
    const { loopWidth, loopHeight, thickness, crossoverAngle, smoothness, innerGap } = params;

    const halfWidth = loopWidth / 2;
    const halfHeight = loopHeight / 2;
    const offset = isInner ? innerGap : 0;

    // Bezier control points for smooth infinity curve
    const tension = smoothness;

    // Right loop
    const rightX = cx + halfWidth - offset;
    const rightCtrlOffset = halfWidth * tension;

    // Left loop
    const leftX = cx - halfWidth + offset;
    const leftCtrlOffset = halfWidth * tension;

    // Vertical extent
    const topY = cy - halfHeight + offset;
    const bottomY = cy + halfHeight - offset;
    const vertCtrl = halfHeight * tension;

    // Create smooth figure-8 path
    return `
        M ${cx.toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + rightCtrlOffset * 0.5).toFixed(2)} ${(cy - vertCtrl).toFixed(2)},
          ${(rightX - rightCtrlOffset * 0.3).toFixed(2)} ${topY.toFixed(2)},
          ${rightX.toFixed(2)} ${cy.toFixed(2)}
        C ${(rightX - rightCtrlOffset * 0.3).toFixed(2)} ${bottomY.toFixed(2)},
          ${(cx + rightCtrlOffset * 0.5).toFixed(2)} ${(cy + vertCtrl).toFixed(2)},
          ${cx.toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - leftCtrlOffset * 0.5).toFixed(2)} ${(cy + vertCtrl).toFixed(2)},
          ${(leftX + leftCtrlOffset * 0.3).toFixed(2)} ${bottomY.toFixed(2)},
          ${leftX.toFixed(2)} ${cy.toFixed(2)}
        C ${(leftX + leftCtrlOffset * 0.3).toFixed(2)} ${topY.toFixed(2)},
          ${(cx - leftCtrlOffset * 0.5).toFixed(2)} ${(cy - vertCtrl).toFixed(2)},
          ${cx.toFixed(2)} ${cy.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate ribbon-style infinity with thickness
 */
function generateRibbonInfinityPath(
    params: InfinityLoopParams,
    cx: number,
    cy: number
): { outer: string; inner: string } {
    const { thickness } = params;

    // Outer edge
    const outer = generateInfinityPath({ ...params, loopWidth: params.loopWidth + thickness }, cx, cy);

    // Inner edge (creates hollow ribbon)
    const inner = generateInfinityPath({ ...params, loopWidth: params.loopWidth - thickness, loopHeight: params.loopHeight - thickness / 2 }, cx, cy);

    return { outer, inner };
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleInfinityLoop(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateInfinityLoopParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('infinity-loop', variant);

    // Gradient for flowing effect
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: algoParams.gradientFlow ? 0 : 45,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 0.33, color: lighten(primaryColor, 15) },
            { offset: 0.66, color: accentColor || primaryColor },
            { offset: 1, color: darken(accentColor || primaryColor, 10) },
        ],
    });

    if (algoParams.ribbonStyle) {
        // Ribbon style with defined thickness
        const { outer } = generateRibbonInfinityPath(algoParams, cx, cy);
        svg.path(outer, {
            fill: `url(#${gradientId})`,
            stroke: darken(primaryColor, 20),
            strokeWidth: '0.5',
        });
    } else {
        // Solid fill style
        const path = generateInfinityPath(algoParams, cx, cy);
        svg.path(path, { fill: `url(#${gradientId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'infinity-loop', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'infinity-loop',
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
                symmetry: 'horizontal',
                pathCount: algoParams.ribbonStyle ? 2 : 1,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || darken(primaryColor, 15)],
            },
        },
    };

    return { logo, quality };
}

export function generateInfinityLoop(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleInfinityLoop(params, hashParams, v);

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
                algorithm: 'infinity-loop',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleInfinityLoopPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateInfinityLoopParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 0,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    const path = generateInfinityPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
