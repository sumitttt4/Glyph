/**
 * Arrow Mark Generator (Direction/Growth-style)
 *
 * Creates dynamic arrow shapes with various styles
 * Motion and direction aesthetic
 * Inspired by growth and movement brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    ArrowMarkParams,
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

function generateArrowMarkParams(hashParams: HashParams, rng: () => number): ArrowMarkParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const directions: Array<'up' | 'right' | 'up-right' | 'circular'> = ['up', 'right', 'up-right', 'circular'];

    return {
        ...base,
        arrowCurve: derived.curveTension,
        headAngle: derived.perspectiveStrength * 30 + 30,
        tailWidth: derived.strokeWidth * 2 + 4,
        direction: directions[Math.floor(derived.styleVariant % 4)],
        doubleArrow: derived.layerCount > 2,
        strokeStyle: derived.organicAmount > 0.5,
        arrowLength: derived.scaleFactor * 20 + 30,
        headSize: derived.taperRatio * 0.4 + 0.3,
        curved: derived.bulgeAmount > 0.4,
        motionLines: Math.floor(derived.colorPlacement * 3),
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateArrowPath(
    params: ArrowMarkParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { direction, arrowCurve, headAngle, tailWidth, arrowLength, headSize, curved } = params;

    const length = arrowLength * scale;
    const tw = tailWidth * scale;
    const headLen = length * headSize;
    const headWidth = tw * 2 + headAngle * 0.3;

    let rotation = 0;
    if (direction === 'right') rotation = 90;
    else if (direction === 'up-right') rotation = 45;
    else if (direction === 'up') rotation = 0;

    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Arrow points in local coordinates (pointing up)
    const points = {
        tailBottom: { x: 0, y: length / 2 },
        tailTop: { x: 0, y: -length / 2 + headLen },
        headLeft: { x: -headWidth / 2, y: -length / 2 + headLen },
        headTip: { x: 0, y: -length / 2 },
        headRight: { x: headWidth / 2, y: -length / 2 + headLen },
    };

    // Transform points
    const transform = (p: { x: number; y: number }) => ({
        x: cx + p.x * cos - p.y * sin,
        y: cy + p.x * sin + p.y * cos,
    });

    const tTailBottom = transform(points.tailBottom);
    const tTailTop = transform(points.tailTop);
    const tHeadLeft = transform(points.headLeft);
    const tHeadTip = transform(points.headTip);
    const tHeadRight = transform(points.headRight);

    let path = '';

    if (curved) {
        const curveOffset = arrowCurve * 15;

        // Curved arrow with bezier
        path = `
            M ${(tTailBottom.x - tw / 2 * cos).toFixed(2)} ${(tTailBottom.y - tw / 2 * sin).toFixed(2)}
            C ${(tTailBottom.x - tw / 2 * cos + curveOffset * sin).toFixed(2)} ${(tTailBottom.y - tw / 2 * sin - curveOffset * cos).toFixed(2)},
              ${(tTailTop.x - tw / 2 * cos + curveOffset * sin * 0.5).toFixed(2)} ${(tTailTop.y - tw / 2 * sin - curveOffset * cos * 0.5).toFixed(2)},
              ${(tTailTop.x - tw / 2 * cos).toFixed(2)} ${(tTailTop.y - tw / 2 * sin).toFixed(2)}
            L ${tHeadLeft.x.toFixed(2)} ${tHeadLeft.y.toFixed(2)}
            L ${tHeadTip.x.toFixed(2)} ${tHeadTip.y.toFixed(2)}
            L ${tHeadRight.x.toFixed(2)} ${tHeadRight.y.toFixed(2)}
            L ${(tTailTop.x + tw / 2 * cos).toFixed(2)} ${(tTailTop.y + tw / 2 * sin).toFixed(2)}
            C ${(tTailTop.x + tw / 2 * cos + curveOffset * sin * 0.5).toFixed(2)} ${(tTailTop.y + tw / 2 * sin - curveOffset * cos * 0.5).toFixed(2)},
              ${(tTailBottom.x + tw / 2 * cos + curveOffset * sin).toFixed(2)} ${(tTailBottom.y + tw / 2 * sin - curveOffset * cos).toFixed(2)},
              ${(tTailBottom.x + tw / 2 * cos).toFixed(2)} ${(tTailBottom.y + tw / 2 * sin).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    } else {
        // Straight arrow
        path = `
            M ${(tTailBottom.x - tw / 2 * cos).toFixed(2)} ${(tTailBottom.y - tw / 2 * sin).toFixed(2)}
            L ${(tTailTop.x - tw / 2 * cos).toFixed(2)} ${(tTailTop.y - tw / 2 * sin).toFixed(2)}
            L ${tHeadLeft.x.toFixed(2)} ${tHeadLeft.y.toFixed(2)}
            L ${tHeadTip.x.toFixed(2)} ${tHeadTip.y.toFixed(2)}
            L ${tHeadRight.x.toFixed(2)} ${tHeadRight.y.toFixed(2)}
            L ${(tTailTop.x + tw / 2 * cos).toFixed(2)} ${(tTailTop.y + tw / 2 * sin).toFixed(2)}
            L ${(tTailBottom.x + tw / 2 * cos).toFixed(2)} ${(tTailBottom.y + tw / 2 * sin).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    return path;
}

function generateMotionLinePath(
    cx: number,
    cy: number,
    length: number,
    offset: number,
    direction: string
): string {
    let rotation = 0;
    if (direction === 'right') rotation = 90;
    else if (direction === 'up-right') rotation = 45;

    const rad = (rotation * Math.PI) / 180;
    const perpRad = rad + Math.PI / 2;

    const startX = cx + offset * Math.cos(perpRad) + length * 0.3 * Math.sin(rad);
    const startY = cy + offset * Math.sin(perpRad) - length * 0.3 * Math.cos(rad);
    const endX = startX - length * 0.5 * Math.sin(rad);
    const endY = startY + length * 0.5 * Math.cos(rad);

    return `
        M ${startX.toFixed(2)} ${startY.toFixed(2)}
        L ${endX.toFixed(2)} ${endY.toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleArrowMark(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateArrowMarkParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('arrow-mark', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: algoParams.direction === 'right' ? 0 : algoParams.direction === 'up-right' ? 315 : 270,
        stops: [
            { offset: 0, color: darken(primaryColor, 10) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: lighten(primaryColor, 20) },
        ],
    });

    // Motion lines (behind arrow)
    const motionLinesCount = algoParams.motionLines ?? 0;
    if (motionLinesCount > 0) {
        const lineOffsets = [-12, -6, 6, 12];
        for (let i = 0; i < Math.min(motionLinesCount, 3); i++) {
            const linePath = generateMotionLinePath(cx, cy, algoParams.arrowLength * 0.6, lineOffsets[i], algoParams.direction);
            svg.path(linePath, {
                fill: 'none',
                stroke: accentColor || lighten(primaryColor, 30),
                strokeWidth: '2',
                strokeLinecap: 'round',
                strokeOpacity: (0.6 - i * 0.15).toString(),
            });
        }
    }

    // Double arrow (shadow/secondary)
    if (algoParams.doubleArrow) {
        const offset = algoParams.direction === 'right' ? { x: -8, y: 0 } :
            algoParams.direction === 'up-right' ? { x: -5, y: 5 } : { x: 0, y: 8 };
        const secondaryPath = generateArrowPath(algoParams, cx + offset.x, cy + offset.y, 0.85);
        svg.path(secondaryPath, { fill: darken(primaryColor, 25), fillOpacity: '0.5' });
    }

    // Main arrow
    const arrowPath = generateArrowPath(algoParams, cx, cy);
    svg.path(arrowPath, { fill: `url(#${gradientId})` });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'arrow-mark', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'arrow-mark',
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
                bezierCurves: algoParams.curved,
                symmetry: 'none',
                pathCount: 1 + (algoParams.doubleArrow ? 1 : 0) + (algoParams.motionLines ?? 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 30)],
            },
        },
    };

    return { logo, quality };
}

export function generateArrowMark(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleArrowMark(params, hashParams, v);

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
                algorithm: 'arrow-mark',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleArrowMarkPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateArrowMarkParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 270,
        stops: [
            { offset: 0, color: darken(primaryColor, 5) },
            { offset: 1, color: lighten(primaryColor, 15) },
        ],
    });

    const path = generateArrowPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
