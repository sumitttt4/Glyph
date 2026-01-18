/**
 * Lightning Bolt Generator (Energy/Speed-style)
 *
 * Creates dynamic lightning bolt shapes
 * Sharp angles with electric energy feel
 * Inspired by energy and speed-focused brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    LightningBoltParams,
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

function generateLightningBoltParams(hashParams: HashParams, rng: () => number): LightningBoltParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    return {
        ...base,
        boltAngles: [
            derived.curveTension * 30 + 15,
            derived.taperRatio * 25 + 20,
            derived.bulgeAmount * 20 + 15,
        ],
        branchCount: Math.floor(derived.elementCount * 0.3),
        glowAmount: derived.organicAmount,
        zigzagDepth: derived.scaleFactor * 10 + 5,
        boltWidth: derived.strokeWidth * 2 + 8,
        sharpness: derived.perspectiveStrength,
        electricGlow: derived.layerCount > 2,
        secondaryBolt: derived.styleVariant > 5,
        energyLines: Math.floor(derived.colorPlacement * 3),
        rotation: (derived.rotationOffset - 180) * 0.15,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateBoltPath(
    params: LightningBoltParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { boltAngles, zigzagDepth, boltWidth, sharpness } = params;

    const height = 50 * scale;
    const width = boltWidth * scale;

    const topY = cy - height / 2;
    const bottomY = cy + height / 2;
    const midY = cy - height * 0.05;

    // Main bolt shape with sharp angles
    const angle1 = boltAngles[0] * (Math.PI / 180);
    const angle2 = boltAngles[1] * (Math.PI / 180);

    const topOffset = Math.tan(angle1) * (height * 0.4);
    const bottomOffset = Math.tan(angle2) * (height * 0.5);

    const zigzag = zigzagDepth * scale;
    const sharpMod = sharpness * 0.3 + 0.7;

    // Build bolt path
    const path = `
        M ${(cx + width * 0.3).toFixed(2)} ${topY.toFixed(2)}
        L ${(cx + topOffset + width * 0.4).toFixed(2)} ${topY.toFixed(2)}
        C ${(cx + topOffset * 0.8).toFixed(2)} ${(topY + height * 0.15).toFixed(2)},
          ${(cx + zigzag * 0.5).toFixed(2)} ${(midY - height * 0.1).toFixed(2)},
          ${(cx + zigzag).toFixed(2)} ${midY.toFixed(2)}
        L ${(cx + zigzag + width * 0.6).toFixed(2)} ${midY.toFixed(2)}
        C ${(cx + zigzag * 0.7).toFixed(2)} ${(midY + height * 0.05).toFixed(2)},
          ${(cx - bottomOffset * 0.3).toFixed(2)} ${(bottomY - height * 0.2).toFixed(2)},
          ${(cx - bottomOffset).toFixed(2)} ${bottomY.toFixed(2)}
        L ${(cx - bottomOffset - width * 0.15 * sharpMod).toFixed(2)} ${(bottomY - height * 0.02).toFixed(2)}
        C ${(cx - bottomOffset * 0.5).toFixed(2)} ${(bottomY - height * 0.15).toFixed(2)},
          ${(cx - zigzag * 0.3).toFixed(2)} ${(midY + height * 0.12).toFixed(2)},
          ${(cx - zigzag * 0.5).toFixed(2)} ${midY.toFixed(2)}
        L ${(cx - zigzag * 0.5 - width * 0.5).toFixed(2)} ${midY.toFixed(2)}
        C ${(cx - zigzag * 0.2).toFixed(2)} ${(midY - height * 0.08).toFixed(2)},
          ${(cx + topOffset * 0.3).toFixed(2)} ${(topY + height * 0.2).toFixed(2)},
          ${(cx + width * 0.3).toFixed(2)} ${topY.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();

    return path;
}

function generateEnergyLinePath(
    cx: number,
    cy: number,
    index: number,
    scale: number = 1
): string {
    const offset = (index - 1) * 8 * scale;
    const length = 12 * scale;
    const y = cy + offset;

    return `
        M ${(cx - length / 2 + offset * 0.5).toFixed(2)} ${y.toFixed(2)}
        C ${(cx - length / 4 + offset * 0.3).toFixed(2)} ${(y - 1).toFixed(2)},
          ${(cx + length / 4 + offset * 0.3).toFixed(2)} ${(y + 1).toFixed(2)},
          ${(cx + length / 2 + offset * 0.5).toFixed(2)} ${y.toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleLightningBolt(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateLightningBoltParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('lightning-bolt', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 160,
        stops: [
            { offset: 0, color: lighten(primaryColor, 30) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    // Electric glow
    if (algoParams.electricGlow) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0, color: accentColor || lighten(primaryColor, 50), opacity: 0.4 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });
        const glowPath = generateBoltPath(algoParams, cx, cy, 1.2);
        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    // Main bolt
    const boltPath = generateBoltPath(algoParams, cx, cy);
    svg.path(boltPath, { fill: `url(#${gradientId})` });

    // Secondary bolt
    if (algoParams.secondaryBolt) {
        const secondaryPath = generateBoltPath(algoParams, cx + 8, cy + 5, 0.5);
        svg.path(secondaryPath, { fill: darken(primaryColor, 20), fillOpacity: '0.6' });
    }

    // Energy lines
    for (let i = 0; i < algoParams.energyLines; i++) {
        const linePath = generateEnergyLinePath(cx - 15, cy - 10, i);
        svg.path(linePath, {
            fill: 'none',
            stroke: accentColor || lighten(primaryColor, 40),
            strokeWidth: '1',
            strokeOpacity: '0.5',
        });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'lightning-bolt', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'lightning-bolt',
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
                symmetry: 'none',
                pathCount: 1 + (algoParams.secondaryBolt ? 1 : 0) + algoParams.energyLines,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 40)],
            },
        },
    };

    return { logo, quality };
}

export function generateLightningBolt(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleLightningBolt(params, hashParams, v);

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
                algorithm: 'lightning-bolt',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleLightningBoltPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateLightningBoltParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 160,
        stops: [
            { offset: 0, color: lighten(primaryColor, 25) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    const path = generateBoltPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
