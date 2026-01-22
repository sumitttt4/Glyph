/**
 * Letter Gradient Generator (Google-style)
 *
 * Creates colorful letter marks with gradient fills
 * Multi-color letter styling
 * Inspired by Google and colorful tech brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    LetterGradientParams,
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
import { lighten, darken, rotateHue } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateLetterGradientParams(hashParams: HashParams, rng: () => number): LetterGradientParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const styles: Array<'bold' | 'light' | 'rounded' | 'geometric'> = ['bold', 'light', 'rounded', 'geometric'];

    return {
        ...base,
        letterSpacing: derived.spacingFactor * 5 + 2,
        colorStops: Math.max(2, Math.min(4, Math.floor(derived.elementCount * 0.3 + 2))),
        fontWeight: derived.strokeWidth > 0.5 ? 'bold' : 'normal',
        letterStyle: styles[Math.floor(derived.styleVariant % 4)],
        hueShift: derived.curveTension * 60 + 30,
        saturation: derived.organicAmount * 0.3 + 0.7,
        gradientAngle: derived.rotationOffset,
        shadowEffect: derived.perspectiveStrength > 0.5,
        outlineOnly: derived.taperRatio < 0.3,
        multiColor: derived.layerCount > 2,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateLetterPath(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    style: string
): string {
    const halfSize = size / 2;
    const quarterSize = size / 4;
    const k = 0.5522847498;

    // Simplified letter shapes using bezier curves
    const letterUpper = letter.toUpperCase();

    switch (letterUpper) {
        case 'A':
            return `
                M ${(cx - halfSize * 0.8).toFixed(2)} ${(cy + halfSize).toFixed(2)}
                L ${cx.toFixed(2)} ${(cy - halfSize).toFixed(2)}
                L ${(cx + halfSize * 0.8).toFixed(2)} ${(cy + halfSize).toFixed(2)}
                L ${(cx + halfSize * 0.5).toFixed(2)} ${(cy + halfSize).toFixed(2)}
                L ${(cx + halfSize * 0.3).toFixed(2)} ${(cy + quarterSize * 0.5).toFixed(2)}
                L ${(cx - halfSize * 0.3).toFixed(2)} ${(cy + quarterSize * 0.5).toFixed(2)}
                L ${(cx - halfSize * 0.5).toFixed(2)} ${(cy + halfSize).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'B':
            const bCurve = style === 'rounded' ? 0.9 : 0.7;
            return `
                M ${(cx - halfSize * 0.6).toFixed(2)} ${(cy - halfSize).toFixed(2)}
                L ${(cx - halfSize * 0.6).toFixed(2)} ${(cy + halfSize).toFixed(2)}
                L ${(cx + halfSize * 0.2).toFixed(2)} ${(cy + halfSize).toFixed(2)}
                C ${(cx + halfSize * bCurve).toFixed(2)} ${(cy + halfSize).toFixed(2)},
                  ${(cx + halfSize * bCurve).toFixed(2)} ${cy.toFixed(2)},
                  ${(cx + halfSize * 0.2).toFixed(2)} ${cy.toFixed(2)}
                L ${(cx - halfSize * 0.3).toFixed(2)} ${cy.toFixed(2)}
                L ${(cx + halfSize * 0.1).toFixed(2)} ${cy.toFixed(2)}
                C ${(cx + halfSize * (bCurve - 0.1)).toFixed(2)} ${cy.toFixed(2)},
                  ${(cx + halfSize * (bCurve - 0.1)).toFixed(2)} ${(cy - halfSize).toFixed(2)},
                  ${(cx + halfSize * 0.1).toFixed(2)} ${(cy - halfSize).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'C':
            return `
                M ${(cx + halfSize * 0.5).toFixed(2)} ${(cy - halfSize * 0.7).toFixed(2)}
                C ${(cx + halfSize * 0.2).toFixed(2)} ${(cy - halfSize).toFixed(2)},
                  ${(cx - halfSize * 0.6).toFixed(2)} ${(cy - halfSize).toFixed(2)},
                  ${(cx - halfSize * 0.6).toFixed(2)} ${cy.toFixed(2)}
                C ${(cx - halfSize * 0.6).toFixed(2)} ${(cy + halfSize).toFixed(2)},
                  ${(cx + halfSize * 0.2).toFixed(2)} ${(cy + halfSize).toFixed(2)},
                  ${(cx + halfSize * 0.5).toFixed(2)} ${(cy + halfSize * 0.7).toFixed(2)}
                L ${(cx + halfSize * 0.3).toFixed(2)} ${(cy + halfSize * 0.4).toFixed(2)}
                C ${(cx + halfSize * 0.1).toFixed(2)} ${(cy + halfSize * 0.6).toFixed(2)},
                  ${(cx - halfSize * 0.3).toFixed(2)} ${(cy + halfSize * 0.6).toFixed(2)},
                  ${(cx - halfSize * 0.3).toFixed(2)} ${cy.toFixed(2)}
                C ${(cx - halfSize * 0.3).toFixed(2)} ${(cy - halfSize * 0.6).toFixed(2)},
                  ${(cx + halfSize * 0.1).toFixed(2)} ${(cy - halfSize * 0.6).toFixed(2)},
                  ${(cx + halfSize * 0.3).toFixed(2)} ${(cy - halfSize * 0.4).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'G':
            return `
                M ${(cx + halfSize * 0.5).toFixed(2)} ${(cy - halfSize * 0.7).toFixed(2)}
                C ${(cx + halfSize * 0.2).toFixed(2)} ${(cy - halfSize).toFixed(2)},
                  ${(cx - halfSize * 0.7).toFixed(2)} ${(cy - halfSize).toFixed(2)},
                  ${(cx - halfSize * 0.7).toFixed(2)} ${cy.toFixed(2)}
                C ${(cx - halfSize * 0.7).toFixed(2)} ${(cy + halfSize).toFixed(2)},
                  ${(cx + halfSize * 0.5).toFixed(2)} ${(cy + halfSize).toFixed(2)},
                  ${(cx + halfSize * 0.5).toFixed(2)} ${(cy + halfSize * 0.3).toFixed(2)}
                L ${(cx + halfSize * 0.5).toFixed(2)} ${(cy + halfSize * 0.1).toFixed(2)}
                L ${cx.toFixed(2)} ${(cy + halfSize * 0.1).toFixed(2)}
                L ${cx.toFixed(2)} ${(cy + halfSize * 0.5).toFixed(2)}
                C ${cx.toFixed(2)} ${(cy + halfSize * 0.7).toFixed(2)},
                  ${(cx - halfSize * 0.4).toFixed(2)} ${(cy + halfSize * 0.7).toFixed(2)},
                  ${(cx - halfSize * 0.4).toFixed(2)} ${cy.toFixed(2)}
                C ${(cx - halfSize * 0.4).toFixed(2)} ${(cy - halfSize * 0.7).toFixed(2)},
                  ${(cx + halfSize * 0.1).toFixed(2)} ${(cy - halfSize * 0.7).toFixed(2)},
                  ${(cx + halfSize * 0.3).toFixed(2)} ${(cy - halfSize * 0.4).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        default:
            // Default circle for unknown letters
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
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleLetterGradient(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateLetterGradientParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('letter-gradient', variant);

    const letter = brandName.charAt(0).toUpperCase();
    const letterSize = 35;

    // Generate color stops
    const colors: string[] = [primaryColor];
    if (algoParams.multiColor) {
        for (let i = 1; i < algoParams.colorStops; i++) {
            colors.push(rotateHue(primaryColor, algoParams.hueShift * i));
        }
    } else {
        colors.push(accentColor || lighten(primaryColor, 25));
    }

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: algoParams.gradientAngle,
        stops: colors.map((color, i) => ({
            offset: i / (colors.length - 1),
            color,
        })),
    });

    // Shadow
    if (algoParams.shadowEffect) {
        const shadowPath = generateLetterPath(letter, cx + 2, cy + 2, letterSize, algoParams.letterStyle);
        svg.path(shadowPath, { fill: darken(primaryColor, 40), fillOpacity: '0.3' });
    }

    // Letter
    const letterPath = generateLetterPath(letter, cx, cy, letterSize, algoParams.letterStyle);

    if (algoParams.outlineOnly) {
        svg.path(letterPath, {
            fill: 'none',
            stroke: `url(#${gradientId})`,
            strokeWidth: '3',
        });
    } else {
        svg.path(letterPath, { fill: `url(#${gradientId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'letter-gradient', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'letter-gradient',
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
                pathCount: 1 + (algoParams.shadowEffect ? 1 : 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: colors,
            },
        },
    };

    return { logo, quality };
}

export function generateLetterGradient(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleLetterGradient(params, hashParams, v);

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
                algorithm: 'letter-gradient',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleLetterGradientPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateLetterGradientParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: params.gradientAngle,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || lighten(primaryColor, 20) },
        ],
    });

    const path = generateLetterPath('G', size / 2, size / 2, 35, params.letterStyle);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
