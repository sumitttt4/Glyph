/**
 * Eye Vision Generator (Vision/AI-style)
 *
 * Creates eye and vision-focused shapes
 * Surveillance and AI aesthetic
 * Inspired by vision and AI technology brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    EyeVisionParams,
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

function generateEyeVisionParams(hashParams: HashParams, rng: () => number): EyeVisionParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const irises: Array<'solid' | 'gradient' | 'rings' | 'tech'> = ['solid', 'gradient', 'rings', 'tech'];
    const lashes: Array<'none' | 'minimal' | 'full'> = ['none', 'minimal', 'full'];

    return {
        ...base,
        pupilSize: derived.centerRadius * 0.4 + 0.2,
        irisPattern: irises[Math.floor(derived.styleVariant % 4)],
        lashStyle: lashes[Math.floor(derived.colorPlacement % 3)],
        glintPosition: derived.rotationOffset * 0.02,
        eyeWidth: derived.scaleFactor * 0.3 + 0.7,
        eyeHeight: derived.taperRatio * 0.3 + 0.5,
        irisSize: derived.curveTension * 0.3 + 0.5,
        scanLines: derived.organicAmount > 0.5,
        techOverlay: derived.perspectiveStrength > 0.6,
        glowEffect: derived.layerCount > 2,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateEyeOutlinePath(
    params: EyeVisionParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { eyeWidth, eyeHeight } = params;

    const width = 45 * scale * eyeWidth;
    const height = 25 * scale * eyeHeight;

    const left = cx - width / 2;
    const right = cx + width / 2;

    // Almond eye shape with bezier curves
    return `
        M ${left.toFixed(2)} ${cy.toFixed(2)}
        C ${(left + width * 0.2).toFixed(2)} ${(cy - height).toFixed(2)},
          ${(right - width * 0.2).toFixed(2)} ${(cy - height).toFixed(2)},
          ${right.toFixed(2)} ${cy.toFixed(2)}
        C ${(right - width * 0.2).toFixed(2)} ${(cy + height).toFixed(2)},
          ${(left + width * 0.2).toFixed(2)} ${(cy + height).toFixed(2)},
          ${left.toFixed(2)} ${cy.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateIrisPath(
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

function generateLashPath(
    cx: number,
    cy: number,
    eyeWidth: number,
    eyeHeight: number,
    index: number,
    total: number
): string {
    const angle = ((index / (total - 1)) - 0.5) * Math.PI * 0.8;
    const startRadius = eyeWidth * 0.45;
    const endRadius = startRadius + 6;

    const startX = cx + Math.cos(angle - Math.PI / 2) * startRadius * 0.9;
    const startY = cy - eyeHeight + Math.sin(angle - Math.PI / 2) * startRadius * 0.3;
    const endX = cx + Math.cos(angle - Math.PI / 2) * endRadius * 0.9;
    const endY = cy - eyeHeight - 3 + Math.sin(angle - Math.PI / 2) * endRadius * 0.3;

    return `
        M ${startX.toFixed(2)} ${startY.toFixed(2)}
        C ${startX.toFixed(2)} ${(startY - 2).toFixed(2)},
          ${endX.toFixed(2)} ${(endY + 1).toFixed(2)},
          ${endX.toFixed(2)} ${endY.toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
}

function generateGlintPath(
    cx: number,
    cy: number,
    size: number,
    position: number
): string {
    const offsetX = position * 3;
    const offsetY = -size * 0.3;
    const glintX = cx + offsetX;
    const glintY = cy + offsetY;

    const k = 0.5522847498;
    return `
        M ${glintX.toFixed(2)} ${(glintY - size).toFixed(2)}
        C ${(glintX + size * k).toFixed(2)} ${(glintY - size).toFixed(2)},
          ${(glintX + size).toFixed(2)} ${(glintY - size * k).toFixed(2)},
          ${(glintX + size).toFixed(2)} ${glintY.toFixed(2)}
        C ${(glintX + size).toFixed(2)} ${(glintY + size * k).toFixed(2)},
          ${(glintX + size * k).toFixed(2)} ${(glintY + size).toFixed(2)},
          ${glintX.toFixed(2)} ${(glintY + size).toFixed(2)}
        C ${(glintX - size * k).toFixed(2)} ${(glintY + size).toFixed(2)},
          ${(glintX - size).toFixed(2)} ${(glintY + size * k).toFixed(2)},
          ${(glintX - size).toFixed(2)} ${glintY.toFixed(2)}
        C ${(glintX - size).toFixed(2)} ${(glintY - size * k).toFixed(2)},
          ${(glintX - size * k).toFixed(2)} ${(glintY - size).toFixed(2)},
          ${glintX.toFixed(2)} ${(glintY - size).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateScanLinePath(
    cx: number,
    cy: number,
    width: number,
    index: number
): string {
    const y = cy - 8 + index * 4;
    const lineWidth = width * 0.7;

    return `
        M ${(cx - lineWidth / 2).toFixed(2)} ${y.toFixed(2)}
        L ${(cx + lineWidth / 2).toFixed(2)} ${y.toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleEyeVision(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateEyeVisionParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('eye-vision', variant);

    const eyeWidth = 45 * algoParams.eyeWidth;
    const eyeHeight = 25 * algoParams.eyeHeight;
    const irisRadius = 12 * algoParams.irisSize;
    const pupilRadius = irisRadius * algoParams.pupilSize;

    // Iris gradient
    const irisGradId = `${uniqueId}-iris`;
    svg.addGradient(irisGradId, {
        type: 'radial',
        stops: [
            { offset: 0, color: darken(primaryColor, 20) },
            { offset: 0.5, color: primaryColor },
            { offset: 0.8, color: darken(primaryColor, 10) },
            { offset: 1, color: darken(primaryColor, 30) },
        ],
    });

    // Glow effect
    if (algoParams.glowEffect) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0.4, color: accentColor || lighten(primaryColor, 40), opacity: 0.3 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });
        const glowPath = generateEyeOutlinePath(algoParams, cx, cy, 1.15);
        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    // Eye outline (white of eye)
    const eyePath = generateEyeOutlinePath(algoParams, cx, cy);
    svg.path(eyePath, { fill: '#FFFFFF' });

    // Iris
    const irisPath = generateIrisPath(cx, cy, irisRadius);
    svg.path(irisPath, { fill: `url(#${irisGradId})` });

    // Iris rings (if tech pattern)
    if (algoParams.irisPattern === 'rings' || algoParams.irisPattern === 'tech') {
        const ringPath = generateIrisPath(cx, cy, irisRadius * 0.7);
        svg.path(ringPath, { fill: 'none', stroke: lighten(primaryColor, 20), strokeWidth: '0.5', strokeOpacity: '0.6' });

        const innerRingPath = generateIrisPath(cx, cy, irisRadius * 0.5);
        svg.path(innerRingPath, { fill: 'none', stroke: lighten(primaryColor, 30), strokeWidth: '0.5', strokeOpacity: '0.4' });
    }

    // Pupil
    const pupilPath = generateIrisPath(cx, cy, pupilRadius);
    svg.path(pupilPath, { fill: '#000000' });

    // Glint
    const glintPath = generateGlintPath(cx, cy, 2.5, algoParams.glintPosition);
    svg.path(glintPath, { fill: '#FFFFFF', fillOpacity: '0.9' });

    // Lashes
    if (algoParams.lashStyle !== 'none') {
        const lashCount = algoParams.lashStyle === 'full' ? 7 : 3;
        for (let i = 0; i < lashCount; i++) {
            const lashPath = generateLashPath(cx, cy, eyeWidth, eyeHeight, i, lashCount);
            svg.path(lashPath, {
                fill: 'none',
                stroke: darken(primaryColor, 30),
                strokeWidth: '1.5',
                strokeLinecap: 'round',
            });
        }
    }

    // Scan lines (tech overlay)
    if (algoParams.scanLines) {
        for (let i = 0; i < 5; i++) {
            const scanPath = generateScanLinePath(cx, cy, eyeWidth, i);
            svg.path(scanPath, {
                fill: 'none',
                stroke: accentColor || lighten(primaryColor, 40),
                strokeWidth: '0.5',
                strokeOpacity: '0.3',
            });
        }
    }

    // Eye outline stroke
    svg.path(eyePath, { fill: 'none', stroke: darken(primaryColor, 20), strokeWidth: '1.5' });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'eye-vision', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'eye-vision',
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
                pathCount: 4 + (algoParams.lashStyle !== 'none' ? (algoParams.lashStyle === 'full' ? 7 : 3) : 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, darken(primaryColor, 20), '#FFFFFF'],
            },
        },
    };

    return { logo, quality };
}

export function generateEyeVision(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleEyeVision(params, hashParams, v);

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
                algorithm: 'eye-vision',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleEyeVisionPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateEyeVisionParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('iris', {
        type: 'radial',
        stops: [
            { offset: 0, color: darken(primaryColor, 15) },
            { offset: 1, color: darken(primaryColor, 30) },
        ],
    });

    const eyePath = generateEyeOutlinePath(params, size / 2, size / 2);
    svg.path(eyePath, { fill: '#FFFFFF', stroke: primaryColor, strokeWidth: '1.5' });

    const irisPath = generateIrisPath(size / 2, size / 2, 12 * params.irisSize);
    svg.path(irisPath, { fill: 'url(#iris)' });

    const pupilPath = generateIrisPath(size / 2, size / 2, 12 * params.irisSize * params.pupilSize);
    svg.path(pupilPath, { fill: '#000000' });

    return svg.build();
}
