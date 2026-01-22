/**
 * Crown Mark Generator (Premium/Luxury-style)
 *
 * Creates regal crown shapes with jewel details
 * Classic to modern interpretations
 * Inspired by premium and luxury brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    CrownMarkParams,
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

function generateCrownMarkParams(hashParams: HashParams, rng: () => number): CrownMarkParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const jewels: Array<'none' | 'circles' | 'diamonds' | 'mixed'> = ['none', 'circles', 'diamonds', 'mixed'];

    return {
        ...base,
        pointCount: Math.max(3, Math.min(7, Math.floor(derived.elementCount * 0.4 + 3))),
        jewelStyle: jewels[Math.floor(derived.styleVariant % 4)],
        baseWidth: derived.scaleFactor * 0.4 + 0.6,
        archHeight: derived.curveTension * 20 + 10,
        pointHeight: derived.armLength * 0.5 + 15,
        baseDecoration: derived.layerCount > 2,
        crownWidth: derived.taperRatio * 0.3 + 0.7,
        rimThickness: derived.strokeWidth * 0.3 + 3,
        crossOnCenter: derived.organicAmount > 0.6,
        velvetFill: derived.perspectiveStrength > 0.5,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateCrownPath(
    params: CrownMarkParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { pointCount, baseWidth, archHeight, pointHeight, crownWidth } = params;

    const width = 42 * scale * baseWidth;
    const height = 36 * scale;

    const left = cx - width / 2;
    const right = cx + width / 2;
    const baseY = cy + height * 0.3;
    const topY = cy - height * 0.4;

    // Generate crown points
    const points: { x: number; y: number }[] = [];
    const pointSpacing = width / (pointCount - 1);

    for (let i = 0; i < pointCount; i++) {
        const x = left + i * pointSpacing;
        const isCenter = i === Math.floor(pointCount / 2);
        const heightMod = isCenter ? 1.15 : 1;
        points.push({ x, y: topY - pointHeight * heightMod * scale });
    }

    // Build crown path with bezier curves
    let path = `M ${left.toFixed(2)} ${baseY.toFixed(2)}`;

    // Left side up
    path += ` C ${(left - 2 * scale).toFixed(2)} ${(baseY - height * 0.2).toFixed(2)},`;
    path += ` ${(left - 1 * scale).toFixed(2)} ${(topY + archHeight).toFixed(2)},`;
    path += ` ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    // Crown points with arches
    for (let i = 0; i < pointCount - 1; i++) {
        const curr = points[i];
        const next = points[i + 1];
        const midX = (curr.x + next.x) / 2;
        const archY = topY + archHeight * scale;

        path += ` C ${curr.x.toFixed(2)} ${(curr.y + archHeight * 0.3).toFixed(2)},`;
        path += ` ${midX.toFixed(2)} ${archY.toFixed(2)},`;
        path += ` ${midX.toFixed(2)} ${archY.toFixed(2)}`;
        path += ` C ${midX.toFixed(2)} ${archY.toFixed(2)},`;
        path += ` ${next.x.toFixed(2)} ${(next.y + archHeight * 0.3).toFixed(2)},`;
        path += ` ${next.x.toFixed(2)} ${next.y.toFixed(2)}`;
    }

    // Right side down
    path += ` C ${(right + 1 * scale).toFixed(2)} ${(topY + archHeight).toFixed(2)},`;
    path += ` ${(right + 2 * scale).toFixed(2)} ${(baseY - height * 0.2).toFixed(2)},`;
    path += ` ${right.toFixed(2)} ${baseY.toFixed(2)}`;

    // Base
    path += ` L ${left.toFixed(2)} ${baseY.toFixed(2)} Z`;

    return path;
}

function generateJewelPath(
    params: CrownMarkParams,
    cx: number,
    cy: number,
    size: number = 3
): string {
    const { jewelStyle } = params;

    if (jewelStyle === 'diamonds') {
        return `
            M ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
            L ${(cx + size).toFixed(2)} ${cy.toFixed(2)}
            L ${cx.toFixed(2)} ${(cy + size).toFixed(2)}
            L ${(cx - size).toFixed(2)} ${cy.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    // Circle (bezier approximation)
    const k = 0.5522847498;
    return `
        M ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
        C ${(cx + size * k).toFixed(2)} ${(cy - size).toFixed(2)},
          ${(cx + size).toFixed(2)} ${(cy - size * k).toFixed(2)},
          ${(cx + size).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + size).toFixed(2)} ${(cy + size * k).toFixed(2)},
          ${(cx + size * k).toFixed(2)} ${(cy + size).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + size).toFixed(2)}
        C ${(cx - size * k).toFixed(2)} ${(cy + size).toFixed(2)},
          ${(cx - size).toFixed(2)} ${(cy + size * k).toFixed(2)},
          ${(cx - size).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - size).toFixed(2)} ${(cy - size * k).toFixed(2)},
          ${(cx - size * k).toFixed(2)} ${(cy - size).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleCrownMark(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateCrownMarkParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('crown-mark', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Crown body
    const crownPath = generateCrownPath(algoParams, cx, cy);
    svg.path(crownPath, { fill: `url(#${gradientId})` });

    // Jewels on points
    if (algoParams.jewelStyle !== 'none') {
        const { pointCount, baseWidth, pointHeight } = algoParams;
        const width = 42 * baseWidth;
        const left = cx - width / 2;
        const pointSpacing = width / (pointCount - 1);

        for (let i = 0; i < pointCount; i++) {
            const x = left + i * pointSpacing;
            const isCenter = i === Math.floor(pointCount / 2);
            const jewelY = cy - 18 - pointHeight * (isCenter ? 1.1 : 0.95) + 5;
            const jewelPath = generateJewelPath(algoParams, x, jewelY, isCenter ? 3.5 : 2.5);
            svg.path(jewelPath, { fill: accentColor || lighten(primaryColor, 40) });
        }
    }

    // Base rim
    if (algoParams.rimThickness > 2) {
        const rimPath = `
            M ${(cx - 21 * algoParams.baseWidth).toFixed(2)} ${(cy + 11).toFixed(2)}
            L ${(cx + 21 * algoParams.baseWidth).toFixed(2)} ${(cy + 11).toFixed(2)}
            L ${(cx + 21 * algoParams.baseWidth).toFixed(2)} ${(cy + 11 + algoParams.rimThickness).toFixed(2)}
            L ${(cx - 21 * algoParams.baseWidth).toFixed(2)} ${(cy + 11 + algoParams.rimThickness).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
        svg.path(rimPath, { fill: darken(primaryColor, 20) });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'crown-mark', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'crown-mark',
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
                pathCount: algoParams.jewelStyle !== 'none' ? 2 + algoParams.pointCount : 2,
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

export function generateCrownMark(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleCrownMark(params, hashParams, v);

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
                algorithm: 'crown-mark',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleCrownMarkPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateCrownMarkParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    const path = generateCrownPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
