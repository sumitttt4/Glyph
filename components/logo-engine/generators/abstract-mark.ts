/**
 * Abstract Mark Generator (Supabase-style)
 *
 * Creates abstract angular marks
 * Dynamic, sharp geometric shapes
 * Uses bezier paths for smooth transitions
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    AbstractMarkParams,
    QualityMetrics,
    HashParams,
    Point,
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
    addNoise,
    createOrganicShape,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateAbstractMarkParams(hashParams: HashParams, rng: () => number): AbstractMarkParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    return {
        ...base,
        angularComplexity: Math.max(3, Math.min(8, Math.round(derived.elementCount / 3) + 2)),
        sharpness: derived.curveTension,
        asymmetryAmount: derived.organicAmount * 0.5,
        innerNegativeSpace: derived.cutDepth > 0.4,
        strokeOnly: derived.styleVariant % 3 === 2,
        dynamicThickness: derived.taperRatio,
        curveTension: 0.2 + derived.curveTension * 0.3, // Keep relatively sharp
    };
}

// ============================================
// SHAPE GENERATION
// ============================================

/**
 * Generate abstract angular mark points
 */
function generateAbstractPoints(
    params: AbstractMarkParams,
    cx: number,
    cy: number,
    size: number,
    rng: () => number
): Point[] {
    const points: Point[] = [];
    const pointCount = params.angularComplexity;
    const baseRadius = size * 0.4;

    for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2 - Math.PI / 2;

        // Create asymmetric radius variation
        const asymmetry = params.asymmetryAmount > 0
            ? addNoise(0, params.asymmetryAmount, rng, baseRadius * 0.3)
            : 0;

        // Sharp vs smooth radius variation
        const sharpVariation = Math.abs(Math.sin(angle * 2)) * params.sharpness * baseRadius * 0.4;

        const r = baseRadius + sharpVariation + asymmetry;

        points.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
        });
    }

    return points;
}

/**
 * Create angular mark path with controlled sharpness
 */
function createAngularPath(
    points: Point[],
    tension: number,
    sharpness: number
): string {
    if (points.length < 3) return '';

    // Blend between sharp polygon and smooth curves based on sharpness
    const effectiveTension = tension * (1 - sharpness * 0.7);

    if (sharpness > 0.8) {
        // Very sharp - use straight lines with minimal curves
        return createSharpPolygon(points);
    } else {
        // Mix of curves and angles
        return createOrganicShape(points, effectiveTension, true);
    }
}

/**
 * Create sharp polygon with minimal bezier smoothing
 */
function createSharpPolygon(points: Point[]): string {
    if (points.length < 3) return '';

    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[(i + 1) % points.length];

        // Small bezier curve at each corner for slight smoothing
        const cornerRadius = 2;
        const dx1 = curr.x - prev.x;
        const dy1 = curr.y - prev.y;
        const dx2 = next.x - curr.x;
        const dy2 = next.y - curr.y;

        const len1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        const len2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (len1 > 0 && len2 > 0) {
            const cp1x = curr.x - (dx1 / len1) * cornerRadius;
            const cp1y = curr.y - (dy1 / len1) * cornerRadius;
            const cp2x = curr.x + (dx2 / len2) * cornerRadius;
            const cp2y = curr.y + (dy2 / len2) * cornerRadius;

            path += ` L ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}`;
            path += ` Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}`;
        } else {
            path += ` L ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
        }
    }

    // Close to start
    const last = points[points.length - 1];
    const first = points[0];
    const dx = first.x - last.x;
    const dy = first.y - last.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    if (len > 0) {
        const cornerRadius = 2;
        const cpx = first.x - (dx / len) * cornerRadius;
        const cpy = first.y - (dy / len) * cornerRadius;
        path += ` L ${cpx.toFixed(2)} ${cpy.toFixed(2)}`;
    }

    path += ' Z';
    return path;
}

/**
 * Create inner cutout for negative space
 */
function createInnerCutout(
    points: Point[],
    cx: number,
    cy: number,
    scale: number
): Point[] {
    return points.map(p => ({
        x: cx + (p.x - cx) * scale,
        y: cy + (p.y - cy) * scale,
    }));
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleAbstractMark(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateAbstractMarkParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('abstract-mark', variant);

    // Generate main shape points
    const points = generateAbstractPoints(algoParams, cx, cy, size, rng);

    // Create gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 20) },
        ],
    });

    // Create main path
    const mainPath = createAngularPath(points, algoParams.curveTension, algoParams.sharpness);

    if (algoParams.strokeOnly) {
        // Stroke-only version
        const strokeWidth = 3 + algoParams.dynamicThickness * 4;
        svg.path(mainPath, {
            fill: 'none',
            stroke: `url(#${gradientId})`,
            'stroke-width': strokeWidth.toString(),
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        });
    } else {
        // Filled version
        svg.path(mainPath, { fill: `url(#${gradientId})` });

        // Add inner negative space if enabled
        if (algoParams.innerNegativeSpace) {
            const innerPoints = createInnerCutout(points, cx, cy, 0.4);
            const innerPath = createAngularPath(innerPoints, algoParams.curveTension, algoParams.sharpness);
            svg.path(innerPath, { fill: '#ffffff' });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'abstract-mark', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'abstract-mark',
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
                symmetry: algoParams.asymmetryAmount < 0.1 ? 'radial' : 'none',
                pathCount: algoParams.innerNegativeSpace ? 2 : 1,
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

export function generateAbstractMark(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleAbstractMark(params, hashParams, v);

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
                algorithm: 'abstract-mark',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleAbstractMarkPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateAbstractMarkParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const points = generateAbstractPoints(params, size / 2, size / 2, size, rng);

    svg.addGradient('main', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    svg.path(createAngularPath(points, params.curveTension, params.sharpness), { fill: 'url(#main)' });

    return svg.build();
}
