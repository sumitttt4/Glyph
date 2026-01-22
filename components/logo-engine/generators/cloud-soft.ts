/**
 * Cloud Soft Generator (Cloud/SaaS-style)
 *
 * Creates fluffy cloud shapes with soft edges
 * Multiple puff variations
 * Inspired by cloud computing and hosting brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    CloudSoftParams,
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

function generateCloudSoftParams(hashParams: HashParams, rng: () => number): CloudSoftParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    return {
        ...base,
        puffCount: Math.max(3, Math.min(6, Math.floor(derived.elementCount * 0.4 + 3))),
        baseWidth: derived.scaleFactor * 0.3 + 0.7,
        shadowDepth: derived.perspectiveStrength * 5 + 2,
        layerCount: Math.max(1, Math.min(3, Math.floor(derived.layerCount * 0.5 + 1))),
        fluffiness: derived.organicAmount * 0.4 + 0.6,
        puffVariation: derived.curveTension * 0.4 + 0.3,
        baseHeight: derived.taperRatio * 0.2 + 0.15,
        softness: derived.bulgeAmount * 0.3 + 0.7,
        rainDrops: Math.floor(derived.colorPlacement * 3),
        sunPeek: derived.styleVariant > 6,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateCloudPath(
    params: CloudSoftParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { puffCount, baseWidth, fluffiness, puffVariation, softness } = params;

    const width = 48 * scale * baseWidth;
    const height = 28 * scale;

    const left = cx - width / 2;
    const right = cx + width / 2;
    const baseY = cy + height * 0.3;
    const topY = cy - height * 0.4;

    // Generate puff positions
    const puffs: { x: number; y: number; r: number }[] = [];
    const puffSpacing = width / (puffCount + 1);

    for (let i = 0; i < puffCount; i++) {
        const x = left + puffSpacing * (i + 1);
        const isCenter = i === Math.floor(puffCount / 2);
        const heightVar = isCenter ? 1.2 : 1 - Math.abs(i - puffCount / 2) * puffVariation * 0.2;
        const y = topY + (1 - heightVar) * height * 0.3;
        const r = (height * 0.35 + (isCenter ? 4 : 0)) * fluffiness;
        puffs.push({ x, y, r });
    }

    // Build cloud path with smooth bezier connections
    const k = softness * 0.5522847498;
    let path = '';

    // Start at base left
    path += `M ${left.toFixed(2)} ${baseY.toFixed(2)}`;

    // Left side curve up to first puff
    const firstPuff = puffs[0];
    path += ` C ${(left - 2).toFixed(2)} ${(baseY - height * 0.2).toFixed(2)},`;
    path += ` ${(firstPuff.x - firstPuff.r).toFixed(2)} ${(firstPuff.y + firstPuff.r * 0.5).toFixed(2)},`;
    path += ` ${(firstPuff.x - firstPuff.r).toFixed(2)} ${firstPuff.y.toFixed(2)}`;

    // Connect puffs
    for (let i = 0; i < puffs.length; i++) {
        const puff = puffs[i];
        const nextPuff = puffs[i + 1];

        // Top of puff
        path += ` C ${(puff.x - puff.r * k).toFixed(2)} ${(puff.y - puff.r).toFixed(2)},`;
        path += ` ${(puff.x + puff.r * k).toFixed(2)} ${(puff.y - puff.r).toFixed(2)},`;
        path += ` ${(puff.x + puff.r).toFixed(2)} ${puff.y.toFixed(2)}`;

        if (nextPuff) {
            // Valley between puffs
            const valleyX = (puff.x + nextPuff.x) / 2;
            const valleyY = Math.max(puff.y, nextPuff.y) + height * 0.05;

            path += ` C ${(puff.x + puff.r).toFixed(2)} ${(puff.y + puff.r * 0.3).toFixed(2)},`;
            path += ` ${valleyX.toFixed(2)} ${valleyY.toFixed(2)},`;
            path += ` ${valleyX.toFixed(2)} ${valleyY.toFixed(2)}`;

            path += ` C ${valleyX.toFixed(2)} ${valleyY.toFixed(2)},`;
            path += ` ${(nextPuff.x - nextPuff.r).toFixed(2)} ${(nextPuff.y + nextPuff.r * 0.3).toFixed(2)},`;
            path += ` ${(nextPuff.x - nextPuff.r).toFixed(2)} ${nextPuff.y.toFixed(2)}`;
        }
    }

    // Last puff to right side
    const lastPuff = puffs[puffs.length - 1];
    path += ` C ${(lastPuff.x + lastPuff.r).toFixed(2)} ${(lastPuff.y + lastPuff.r * 0.5).toFixed(2)},`;
    path += ` ${(right + 2).toFixed(2)} ${(baseY - height * 0.2).toFixed(2)},`;
    path += ` ${right.toFixed(2)} ${baseY.toFixed(2)}`;

    // Base
    path += ` C ${(right - width * 0.1).toFixed(2)} ${(baseY + 2).toFixed(2)},`;
    path += ` ${(left + width * 0.1).toFixed(2)} ${(baseY + 2).toFixed(2)},`;
    path += ` ${left.toFixed(2)} ${baseY.toFixed(2)}`;

    path += ' Z';
    return path;
}

function generateRainDropPath(
    cx: number,
    cy: number,
    size: number = 4
): string {
    return `
        M ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
        C ${(cx + size * 0.5).toFixed(2)} ${(cy - size * 0.3).toFixed(2)},
          ${(cx + size * 0.5).toFixed(2)} ${(cy + size * 0.5).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + size).toFixed(2)}
        C ${(cx - size * 0.5).toFixed(2)} ${(cy + size * 0.5).toFixed(2)},
          ${(cx - size * 0.5).toFixed(2)} ${(cy - size * 0.3).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateSunPath(
    cx: number,
    cy: number,
    radius: number = 10
): string {
    const k = 0.5522847498;
    // Semi-circle (sun peeking)
    return `
        M ${cx.toFixed(2)} ${(cy + radius).toFixed(2)}
        C ${(cx + radius * k).toFixed(2)} ${(cy + radius).toFixed(2)},
          ${(cx + radius).toFixed(2)} ${(cy + radius * k).toFixed(2)},
          ${(cx + radius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + radius).toFixed(2)} ${(cy - radius * k).toFixed(2)},
          ${(cx + radius * k).toFixed(2)} ${(cy - radius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - radius).toFixed(2)}
        C ${(cx - radius * k).toFixed(2)} ${(cy - radius).toFixed(2)},
          ${(cx - radius).toFixed(2)} ${(cy - radius * k).toFixed(2)},
          ${(cx - radius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - radius).toFixed(2)} ${(cy + radius * k).toFixed(2)},
          ${(cx - radius * k).toFixed(2)} ${(cy + radius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + radius).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleCloudSoft(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateCloudSoftParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('cloud-soft', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 25) },
            { offset: 0.6, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    // Sun peeking behind (if enabled)
    if (algoParams.sunPeek) {
        const sunPath = generateSunPath(cx + 20, cy - 12, 12);
        svg.path(sunPath, { fill: accentColor || '#FFD93D' });
    }

    // Shadow layer
    if (algoParams.shadowDepth > 2) {
        const shadowPath = generateCloudPath(algoParams, cx + 2, cy + algoParams.shadowDepth);
        svg.path(shadowPath, { fill: darken(primaryColor, 30), fillOpacity: '0.3' });
    }

    // Main cloud
    const cloudPath = generateCloudPath(algoParams, cx, cy);
    svg.path(cloudPath, { fill: `url(#${gradientId})` });

    // Rain drops
    if (algoParams.rainDrops > 0) {
        const dropPositions = [
            { x: cx - 12, y: cy + 18 },
            { x: cx, y: cy + 22 },
            { x: cx + 12, y: cy + 18 },
        ];

        for (let i = 0; i < Math.min(algoParams.rainDrops, 3); i++) {
            const pos = dropPositions[i];
            const dropPath = generateRainDropPath(pos.x, pos.y, 3);
            svg.path(dropPath, { fill: accentColor || lighten(primaryColor, 40) });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'cloud-soft', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'cloud-soft',
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
                pathCount: 1 + (algoParams.shadowDepth > 2 ? 1 : 0) + algoParams.rainDrops + (algoParams.sunPeek ? 1 : 0),
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

export function generateCloudSoft(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleCloudSoft(params, hashParams, v);

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
                algorithm: 'cloud-soft',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleCloudSoftPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateCloudSoftParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 1, color: darken(primaryColor, 5) },
        ],
    });

    const path = generateCloudPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
