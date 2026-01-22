/**
 * Heart Love Generator (Social/Dating-style)
 *
 * Creates heart symbols with various styles
 * Classic to modern geometric heart forms
 * Inspired by social and dating platforms
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    HeartLoveParams,
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
import { lighten, darken } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateHeartLoveParams(hashParams: HashParams, rng: () => number): HeartLoveParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const styles: Array<'classic' | 'modern' | 'geometric' | 'organic'> = ['classic', 'modern', 'geometric', 'organic'];

    return {
        ...base,
        heartStyle: styles[Math.floor(derived.styleVariant % 4)],
        curveDepth: derived.curveTension * 0.5 + 0.3,
        splitAmount: derived.centerRadius * 0.02,
        pulseEffect: derived.organicAmount > 0.6,
        heartRotation: (derived.rotationOffset - 180) * 0.1,
        innerHeart: derived.layerCount > 2,
        innerScale: derived.taperRatio * 0.4 + 0.3,
        strokeOnly: derived.styleVariant > 6,
        heartWidth: derived.scaleFactor * 0.4 + 0.8,
        tipSharpness: derived.perspectiveStrength,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateHeartPath(
    params: HeartLoveParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { heartStyle, curveDepth, heartWidth, tipSharpness, heartRotation } = params;

    const width = 40 * scale * heartWidth;
    const height = 38 * scale;

    // Heart anatomy
    const topY = cy - height * 0.35;
    const bottomY = cy + height * 0.65;
    const leftX = cx - width / 2;
    const rightX = cx + width / 2;

    // Curve control points based on style
    let lobeHeight = height * curveDepth;
    let lobeWidth = width * 0.3;
    let tipCurve = tipSharpness * 5;

    if (heartStyle === 'geometric') {
        lobeHeight *= 0.7;
        lobeWidth *= 0.8;
        tipCurve = 0;
    } else if (heartStyle === 'organic') {
        lobeHeight *= 1.1;
        lobeWidth *= 1.1;
    }

    // Heart path with bezier curves
    const path = `
        M ${cx.toFixed(2)} ${(topY + lobeHeight * 0.3).toFixed(2)}
        C ${(cx - lobeWidth * 0.5).toFixed(2)} ${(topY - lobeHeight * 0.3).toFixed(2)},
          ${(leftX - lobeWidth * 0.3).toFixed(2)} ${(topY - lobeHeight * 0.2).toFixed(2)},
          ${leftX.toFixed(2)} ${(topY + lobeHeight * 0.4).toFixed(2)}
        C ${(leftX - lobeWidth * 0.2).toFixed(2)} ${(topY + lobeHeight).toFixed(2)},
          ${(leftX + width * 0.1).toFixed(2)} ${(cy + height * 0.15).toFixed(2)},
          ${cx.toFixed(2)} ${(bottomY - tipCurve).toFixed(2)}
        C ${(cx).toFixed(2)} ${bottomY.toFixed(2)},
          ${cx.toFixed(2)} ${bottomY.toFixed(2)},
          ${cx.toFixed(2)} ${(bottomY - tipCurve).toFixed(2)}
        C ${(rightX - width * 0.1).toFixed(2)} ${(cy + height * 0.15).toFixed(2)},
          ${(rightX + lobeWidth * 0.2).toFixed(2)} ${(topY + lobeHeight).toFixed(2)},
          ${rightX.toFixed(2)} ${(topY + lobeHeight * 0.4).toFixed(2)}
        C ${(rightX + lobeWidth * 0.3).toFixed(2)} ${(topY - lobeHeight * 0.2).toFixed(2)},
          ${(cx + lobeWidth * 0.5).toFixed(2)} ${(topY - lobeHeight * 0.3).toFixed(2)},
          ${cx.toFixed(2)} ${(topY + lobeHeight * 0.3).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();

    return path;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleHeartLove(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateHeartLoveParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('heart-love', variant);

    // Gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 25) },
            { offset: 0.4, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Main heart
    const heartPath = generateHeartPath(algoParams, cx, cy);

    if (algoParams.strokeOnly) {
        svg.path(heartPath, {
            fill: 'none',
            stroke: `url(#${gradientId})`,
            strokeWidth: '3',
        });
    } else {
        svg.path(heartPath, { fill: `url(#${gradientId})` });

        // Inner heart
        if (algoParams.innerHeart) {
            const innerPath = generateHeartPath(algoParams, cx, cy, algoParams.innerScale);
            svg.path(innerPath, { fill: accentColor || lighten(primaryColor, 30) });
        }
    }

    // Pulse effect (outer glow)
    if (algoParams.pulseEffect) {
        const pulseGradId = `${uniqueId}-pulse`;
        svg.addGradient(pulseGradId, {
            type: 'radial',
            stops: [
                { offset: 0.6, color: primaryColor, opacity: 0 },
                { offset: 0.8, color: primaryColor, opacity: 0.15 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });
        const pulsePath = generateHeartPath(algoParams, cx, cy, 1.15);
        svg.path(pulsePath, { fill: `url(#${pulseGradId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'heart-love', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'heart-love',
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
                symmetry: 'vertical',
                pathCount: algoParams.innerHeart ? 2 : 1,
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

export function generateHeartLove(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleHeartLove(params, hashParams, v);

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
                algorithm: 'heart-love',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleHeartLovePreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateHeartLoveParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    const path = generateHeartPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
