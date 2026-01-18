/**
 * Box Logo Generator (Supreme-style)
 *
 * Creates bold box/frame logo with text
 * Iconic street-style aesthetic
 * Inspired by Supreme and bold fashion brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    BoxLogoParams,
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

function generateBoxLogoParams(hashParams: HashParams, rng: () => number): BoxLogoParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    return {
        ...base,
        boxPadding: derived.spacingFactor * 6 + 4,
        cornerRadius: derived.curveTension * 6,
        textWeight: derived.strokeWidth > 0.5 ? 'bold' : 'heavy',
        borderThickness: derived.taperRatio * 3 + 2,
        fillStyle: derived.organicAmount > 0.5 ? 'solid' : 'outline',
        textSize: derived.scaleFactor * 0.2 + 0.7,
        letterSpacing: derived.spacingFactor * 2 + 1,
        shadowDepth: derived.perspectiveStrength * 4,
        doubleBox: derived.layerCount > 2,
        invertColors: derived.colorPlacement > 0.7,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateBoxPath(
    cx: number,
    cy: number,
    width: number,
    height: number,
    cornerRadius: number
): string {
    const left = cx - width / 2;
    const right = cx + width / 2;
    const top = cy - height / 2;
    const bottom = cy + height / 2;
    const r = Math.min(cornerRadius, Math.min(width, height) / 2);

    if (r <= 0) {
        return `
            M ${left.toFixed(2)} ${top.toFixed(2)}
            L ${right.toFixed(2)} ${top.toFixed(2)}
            L ${right.toFixed(2)} ${bottom.toFixed(2)}
            L ${left.toFixed(2)} ${bottom.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    const k = 0.5522847498;

    return `
        M ${(left + r).toFixed(2)} ${top.toFixed(2)}
        L ${(right - r).toFixed(2)} ${top.toFixed(2)}
        C ${(right - r + r * k).toFixed(2)} ${top.toFixed(2)},
          ${right.toFixed(2)} ${(top + r - r * k).toFixed(2)},
          ${right.toFixed(2)} ${(top + r).toFixed(2)}
        L ${right.toFixed(2)} ${(bottom - r).toFixed(2)}
        C ${right.toFixed(2)} ${(bottom - r + r * k).toFixed(2)},
          ${(right - r + r * k).toFixed(2)} ${bottom.toFixed(2)},
          ${(right - r).toFixed(2)} ${bottom.toFixed(2)}
        L ${(left + r).toFixed(2)} ${bottom.toFixed(2)}
        C ${(left + r - r * k).toFixed(2)} ${bottom.toFixed(2)},
          ${left.toFixed(2)} ${(bottom - r + r * k).toFixed(2)},
          ${left.toFixed(2)} ${(bottom - r).toFixed(2)}
        L ${left.toFixed(2)} ${(top + r).toFixed(2)}
        C ${left.toFixed(2)} ${(top + r - r * k).toFixed(2)},
          ${(left + r - r * k).toFixed(2)} ${top.toFixed(2)},
          ${(left + r).toFixed(2)} ${top.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateSimplifiedLetterPath(
    letter: string,
    x: number,
    cy: number,
    size: number
): string {
    const halfSize = size / 2;
    const letterUpper = letter.toUpperCase();
    const y = cy;

    // Very simplified block letters
    switch (letterUpper) {
        case 'A':
            return `
                M ${(x - halfSize * 0.7).toFixed(2)} ${(y + halfSize).toFixed(2)}
                L ${x.toFixed(2)} ${(y - halfSize).toFixed(2)}
                L ${(x + halfSize * 0.7).toFixed(2)} ${(y + halfSize).toFixed(2)}
                L ${(x + halfSize * 0.4).toFixed(2)} ${(y + halfSize).toFixed(2)}
                L ${(x + halfSize * 0.25).toFixed(2)} ${(y + halfSize * 0.3).toFixed(2)}
                L ${(x - halfSize * 0.25).toFixed(2)} ${(y + halfSize * 0.3).toFixed(2)}
                L ${(x - halfSize * 0.4).toFixed(2)} ${(y + halfSize).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'E':
            return `
                M ${(x - halfSize * 0.5).toFixed(2)} ${(y - halfSize).toFixed(2)}
                L ${(x + halfSize * 0.5).toFixed(2)} ${(y - halfSize).toFixed(2)}
                L ${(x + halfSize * 0.5).toFixed(2)} ${(y - halfSize * 0.6).toFixed(2)}
                L ${(x - halfSize * 0.2).toFixed(2)} ${(y - halfSize * 0.6).toFixed(2)}
                L ${(x - halfSize * 0.2).toFixed(2)} ${(y - halfSize * 0.15).toFixed(2)}
                L ${(x + halfSize * 0.3).toFixed(2)} ${(y - halfSize * 0.15).toFixed(2)}
                L ${(x + halfSize * 0.3).toFixed(2)} ${(y + halfSize * 0.15).toFixed(2)}
                L ${(x - halfSize * 0.2).toFixed(2)} ${(y + halfSize * 0.15).toFixed(2)}
                L ${(x - halfSize * 0.2).toFixed(2)} ${(y + halfSize * 0.6).toFixed(2)}
                L ${(x + halfSize * 0.5).toFixed(2)} ${(y + halfSize * 0.6).toFixed(2)}
                L ${(x + halfSize * 0.5).toFixed(2)} ${(y + halfSize).toFixed(2)}
                L ${(x - halfSize * 0.5).toFixed(2)} ${(y + halfSize).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'I':
            return `
                M ${(x - halfSize * 0.15).toFixed(2)} ${(y - halfSize).toFixed(2)}
                L ${(x + halfSize * 0.15).toFixed(2)} ${(y - halfSize).toFixed(2)}
                L ${(x + halfSize * 0.15).toFixed(2)} ${(y + halfSize).toFixed(2)}
                L ${(x - halfSize * 0.15).toFixed(2)} ${(y + halfSize).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'O':
            const k = 0.5522847498;
            const or = halfSize * 0.8;
            const ir = halfSize * 0.5;
            return `
                M ${x.toFixed(2)} ${(y - or).toFixed(2)}
                C ${(x + or * k).toFixed(2)} ${(y - or).toFixed(2)},
                  ${(x + or).toFixed(2)} ${(y - or * k).toFixed(2)},
                  ${(x + or).toFixed(2)} ${y.toFixed(2)}
                C ${(x + or).toFixed(2)} ${(y + or * k).toFixed(2)},
                  ${(x + or * k).toFixed(2)} ${(y + or).toFixed(2)},
                  ${x.toFixed(2)} ${(y + or).toFixed(2)}
                C ${(x - or * k).toFixed(2)} ${(y + or).toFixed(2)},
                  ${(x - or).toFixed(2)} ${(y + or * k).toFixed(2)},
                  ${(x - or).toFixed(2)} ${y.toFixed(2)}
                C ${(x - or).toFixed(2)} ${(y - or * k).toFixed(2)},
                  ${(x - or * k).toFixed(2)} ${(y - or).toFixed(2)},
                  ${x.toFixed(2)} ${(y - or).toFixed(2)}
                Z
                M ${x.toFixed(2)} ${(y - ir).toFixed(2)}
                C ${(x - ir * k).toFixed(2)} ${(y - ir).toFixed(2)},
                  ${(x - ir).toFixed(2)} ${(y - ir * k).toFixed(2)},
                  ${(x - ir).toFixed(2)} ${y.toFixed(2)}
                C ${(x - ir).toFixed(2)} ${(y + ir * k).toFixed(2)},
                  ${(x - ir * k).toFixed(2)} ${(y + ir).toFixed(2)},
                  ${x.toFixed(2)} ${(y + ir).toFixed(2)}
                C ${(x + ir * k).toFixed(2)} ${(y + ir).toFixed(2)},
                  ${(x + ir).toFixed(2)} ${(y + ir * k).toFixed(2)},
                  ${(x + ir).toFixed(2)} ${y.toFixed(2)}
                C ${(x + ir).toFixed(2)} ${(y - ir * k).toFixed(2)},
                  ${(x + ir * k).toFixed(2)} ${(y - ir).toFixed(2)},
                  ${x.toFixed(2)} ${(y - ir).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        default:
            // Default rectangle for unknown
            return `
                M ${(x - halfSize * 0.4).toFixed(2)} ${(y - halfSize).toFixed(2)}
                L ${(x + halfSize * 0.4).toFixed(2)} ${(y - halfSize).toFixed(2)}
                L ${(x + halfSize * 0.4).toFixed(2)} ${(y + halfSize).toFixed(2)}
                L ${(x - halfSize * 0.4).toFixed(2)} ${(y + halfSize).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();
    }
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleBoxLogo(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateBoxLogoParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('box-logo', variant);

    const boxWidth = 70;
    const boxHeight = 30;
    const textSizeValue = typeof algoParams.textSize === 'number' ? algoParams.textSize : 1;
    const textSize = 18 * textSizeValue;

    const bgColor = algoParams.invertColors ? '#FFFFFF' : primaryColor;
    const fgColor = algoParams.invertColors ? primaryColor : '#FFFFFF';

    // Shadow
    if (algoParams.shadowDepth > 1) {
        const shadowPath = generateBoxPath(cx + 2, cy + 2, boxWidth, boxHeight, algoParams.cornerRadius);
        svg.path(shadowPath, { fill: darken(primaryColor, 40), fillOpacity: '0.4' });
    }

    // Double box (outer)
    if (algoParams.doubleBox) {
        const outerPath = generateBoxPath(cx, cy, boxWidth + 6, boxHeight + 6, algoParams.cornerRadius + 2);
        svg.path(outerPath, {
            fill: 'none',
            stroke: bgColor,
            strokeWidth: algoParams.borderThickness.toString(),
        });
    }

    // Main box
    const boxPath = generateBoxPath(cx, cy, boxWidth, boxHeight, algoParams.cornerRadius);

    if (algoParams.fillStyle === 'solid') {
        svg.path(boxPath, { fill: bgColor });
    } else {
        svg.path(boxPath, {
            fill: 'none',
            stroke: bgColor,
            strokeWidth: algoParams.borderThickness.toString(),
        });
    }

    // First letter only (simplified)
    const letter = brandName.charAt(0);
    const letterPath = generateSimplifiedLetterPath(letter, cx, cy, textSize);
    svg.path(letterPath, { fill: algoParams.fillStyle === 'solid' ? fgColor : bgColor });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'box-logo', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'box-logo',
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
                gridBased: true,
                bezierCurves: algoParams.cornerRadius > 0,
                symmetry: 'vertical',
                pathCount: 2 + (algoParams.doubleBox ? 1 : 0) + (algoParams.shadowDepth > 1 ? 1 : 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [bgColor, fgColor],
            },
        },
    };

    return { logo, quality };
}

export function generateBoxLogo(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleBoxLogo(params, hashParams, v);

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
                algorithm: 'box-logo',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleBoxLogoPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateBoxLogoParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const boxPath = generateBoxPath(size / 2, size / 2, 70, 30, params.cornerRadius);
    svg.path(boxPath, { fill: primaryColor });

    const letterPath = generateSimplifiedLetterPath('B', size / 2, size / 2, 18);
    svg.path(letterPath, { fill: '#FFFFFF' });

    return svg.build();
}
