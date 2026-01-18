/**
 * Circular Emblem Generator (Starbucks-style)
 *
 * Creates circular emblem/seal designs
 * Badge and seal aesthetic
 * Inspired by Starbucks and vintage emblem brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    CircularEmblemParams,
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

function generateCircularEmblemParams(hashParams: HashParams, rng: () => number): CircularEmblemParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const innerSymbols: Array<'star' | 'crown' | 'shield' | 'letter'> = ['star', 'crown', 'shield', 'letter'];
    const seals: Array<'none' | 'simple' | 'ornate'> = ['none', 'simple', 'ornate'];

    return {
        ...base,
        ringCount: Math.max(1, Math.min(3, Math.floor(derived.layerCount * 0.5 + 1))),
        innerSymbol: innerSymbols[Math.floor(derived.styleVariant % 4)],
        textCurve: derived.curveTension * 0.5 + 0.5,
        sealStyle: seals[Math.floor(derived.colorPlacement % 3)],
        starCount: Math.floor(derived.elementCount * 0.5 + 3),
        borderWidth: derived.strokeWidth * 2 + 2,
        innerRadius: derived.centerRadius * 0.3 + 0.3,
        decorativeElements: derived.organicAmount > 0.5,
        vintageStyle: derived.perspectiveStrength > 0.5,
        doubleBorder: derived.taperRatio > 0.6,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateCirclePath(
    cx: number,
    cy: number,
    radius: number
): string {
    const k = 0.5522847498;
    return `
        M ${cx.toFixed(2)} ${(cy - radius).toFixed(2)}
        C ${(cx + radius * k).toFixed(2)} ${(cy - radius).toFixed(2)},
          ${(cx + radius).toFixed(2)} ${(cy - radius * k).toFixed(2)},
          ${(cx + radius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + radius).toFixed(2)} ${(cy + radius * k).toFixed(2)},
          ${(cx + radius * k).toFixed(2)} ${(cy + radius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + radius).toFixed(2)}
        C ${(cx - radius * k).toFixed(2)} ${(cy + radius).toFixed(2)},
          ${(cx - radius).toFixed(2)} ${(cy + radius * k).toFixed(2)},
          ${(cx - radius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - radius).toFixed(2)} ${(cy - radius * k).toFixed(2)},
          ${(cx - radius * k).toFixed(2)} ${(cy - radius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - radius).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateStarPath(
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    points: number
): string {
    let path = '';

    for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const r = i % 2 === 0 ? outerRadius : innerRadius;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;

        path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
    }

    return path + ' Z';
}

function generateCrownPath(
    cx: number,
    cy: number,
    size: number
): string {
    const halfSize = size / 2;
    const points = 5;
    const baseY = cy + halfSize * 0.3;
    const topY = cy - halfSize * 0.5;

    let path = `M ${(cx - halfSize).toFixed(2)} ${baseY.toFixed(2)}`;

    for (let i = 0; i < points; i++) {
        const x = cx - halfSize + (i * size) / (points - 1);
        const peakY = topY - (i === Math.floor(points / 2) ? halfSize * 0.2 : 0);
        const valleyY = baseY - halfSize * 0.3;

        if (i > 0) {
            path += ` L ${(x - size / (points - 1) / 2).toFixed(2)} ${valleyY.toFixed(2)}`;
        }
        path += ` L ${x.toFixed(2)} ${peakY.toFixed(2)}`;
    }

    path += ` L ${(cx + halfSize).toFixed(2)} ${baseY.toFixed(2)} Z`;

    return path;
}

function generateShieldPath(
    cx: number,
    cy: number,
    size: number
): string {
    const halfW = size * 0.4;
    const halfH = size * 0.5;

    return `
        M ${(cx - halfW).toFixed(2)} ${(cy - halfH).toFixed(2)}
        L ${(cx + halfW).toFixed(2)} ${(cy - halfH).toFixed(2)}
        L ${(cx + halfW).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + halfW).toFixed(2)} ${(cy + halfH * 0.5).toFixed(2)},
          ${(cx + halfW * 0.3).toFixed(2)} ${(cy + halfH).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + halfH * 1.1).toFixed(2)}
        C ${(cx - halfW * 0.3).toFixed(2)} ${(cy + halfH).toFixed(2)},
          ${(cx - halfW).toFixed(2)} ${(cy + halfH * 0.5).toFixed(2)},
          ${(cx - halfW).toFixed(2)} ${cy.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateLetterPath(
    letter: string,
    cx: number,
    cy: number,
    size: number
): string {
    // Simplified first letter
    const halfSize = size / 2;
    const letterUpper = letter.toUpperCase();

    // Default circular letter marker
    const k = 0.5522847498;
    return `
        M ${cx.toFixed(2)} ${(cy - halfSize).toFixed(2)}
        C ${(cx + halfSize * k).toFixed(2)} ${(cy - halfSize).toFixed(2)},
          ${(cx + halfSize).toFixed(2)} ${(cy - halfSize * k).toFixed(2)},
          ${(cx + halfSize).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + halfSize).toFixed(2)} ${(cy + halfSize * k).toFixed(2)},
          ${(cx + halfSize * k).toFixed(2)} ${(cy + halfSize).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + halfSize).toFixed(2)}
        C ${(cx - halfSize * k).toFixed(2)} ${(cy + halfSize).toFixed(2)},
          ${(cx - halfSize).toFixed(2)} ${(cy + halfSize * k).toFixed(2)},
          ${(cx - halfSize).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - halfSize).toFixed(2)} ${(cy - halfSize * k).toFixed(2)},
          ${(cx - halfSize * k).toFixed(2)} ${(cy - halfSize).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - halfSize).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateDecorativeDotsPath(
    cx: number,
    cy: number,
    radius: number,
    count: number
): string[] {
    const paths: string[] = [];
    const dotRadius = 1.5;

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;

        const k = 0.5522847498;
        paths.push(`
            M ${x.toFixed(2)} ${(y - dotRadius).toFixed(2)}
            C ${(x + dotRadius * k).toFixed(2)} ${(y - dotRadius).toFixed(2)},
              ${(x + dotRadius).toFixed(2)} ${(y - dotRadius * k).toFixed(2)},
              ${(x + dotRadius).toFixed(2)} ${y.toFixed(2)}
            C ${(x + dotRadius).toFixed(2)} ${(y + dotRadius * k).toFixed(2)},
              ${(x + dotRadius * k).toFixed(2)} ${(y + dotRadius).toFixed(2)},
              ${x.toFixed(2)} ${(y + dotRadius).toFixed(2)}
            C ${(x - dotRadius * k).toFixed(2)} ${(y + dotRadius).toFixed(2)},
              ${(x - dotRadius).toFixed(2)} ${(y + dotRadius * k).toFixed(2)},
              ${(x - dotRadius).toFixed(2)} ${y.toFixed(2)}
            C ${(x - dotRadius).toFixed(2)} ${(y - dotRadius * k).toFixed(2)},
              ${(x - dotRadius * k).toFixed(2)} ${(y - dotRadius).toFixed(2)},
              ${x.toFixed(2)} ${(y - dotRadius).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim());
    }

    return paths;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleCircularEmblem(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateCircularEmblemParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('circular-emblem', variant);

    const outerRadius = 42;
    const innerRadiusRatio = algoParams.innerRadius;

    // Main fill gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 0.7, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Outer circle fill
    const outerPath = generateCirclePath(cx, cy, outerRadius);
    svg.path(outerPath, { fill: `url(#${gradientId})` });

    // Ring borders
    for (let r = 0; r < algoParams.ringCount; r++) {
        const ringRadius = outerRadius - r * 5 - 3;
        const ringPath = generateCirclePath(cx, cy, ringRadius);
        svg.path(ringPath, {
            fill: 'none',
            stroke: r === 0 ? (accentColor || lighten(primaryColor, 30)) : lighten(primaryColor, 20),
            strokeWidth: (algoParams.borderWidth - r).toString(),
        });
    }

    // Inner circle background
    const innerRadius = outerRadius * innerRadiusRatio;
    const innerBgPath = generateCirclePath(cx, cy, innerRadius);
    svg.path(innerBgPath, { fill: darken(primaryColor, 20) });

    // Inner symbol
    const symbolSize = innerRadius * 1.2;
    let symbolPath = '';

    switch (algoParams.innerSymbol) {
        case 'star':
            symbolPath = generateStarPath(cx, cy, symbolSize * 0.5, symbolSize * 0.2, algoParams.starCount);
            break;
        case 'crown':
            symbolPath = generateCrownPath(cx, cy, symbolSize);
            break;
        case 'shield':
            symbolPath = generateShieldPath(cx, cy, symbolSize);
            break;
        case 'letter':
            symbolPath = generateLetterPath(brandName.charAt(0), cx, cy, symbolSize * 0.4);
            break;
    }

    if (symbolPath) {
        svg.path(symbolPath, { fill: accentColor || lighten(primaryColor, 40) });
    }

    // Decorative dots
    if (algoParams.decorativeElements) {
        const dotPaths = generateDecorativeDotsPath(cx, cy, outerRadius - 8, 12);
        dotPaths.forEach(dotPath => {
            svg.path(dotPath, { fill: accentColor || lighten(primaryColor, 35) });
        });
    }

    // Double border effect
    if (algoParams.doubleBorder) {
        const doublePath = generateCirclePath(cx, cy, outerRadius + 2);
        svg.path(doublePath, {
            fill: 'none',
            stroke: darken(primaryColor, 20),
            strokeWidth: '1.5',
        });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'circular-emblem', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'circular-emblem',
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
                symmetry: 'rotational',
                pathCount: 3 + algoParams.ringCount + (algoParams.decorativeElements ? 12 : 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 35)],
            },
        },
    };

    return { logo, quality };
}

export function generateCircularEmblem(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleCircularEmblem(params, hashParams, v);

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
                algorithm: 'circular-emblem',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleCircularEmblemPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateCircularEmblemParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 5) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    const outerPath = generateCirclePath(size / 2, size / 2, 42);
    svg.path(outerPath, { fill: 'url(#main)' });

    const ringPath = generateCirclePath(size / 2, size / 2, 39);
    svg.path(ringPath, { fill: 'none', stroke: accentColor || lighten(primaryColor, 30), strokeWidth: '2' });

    return svg.build();
}
