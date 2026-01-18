/**
 * Flow Gradient Generator (Loom-style)
 *
 * Creates flowing gradient organic shapes
 * Smooth curves, blob-like forms
 * Uses bezier curves for organic feel
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    FlowGradientParams,
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
    createOrganicShape,
    addNoise,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateFlowGradientParams(hashParams: HashParams, rng: () => number): FlowGradientParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const directions: Array<'horizontal' | 'vertical' | 'diagonal' | 'radial'> =
        ['horizontal', 'vertical', 'diagonal', 'radial'];

    return {
        ...base,
        flowDirection: directions[derived.styleVariant % 4],
        waveCount: Math.max(1, Math.min(4, Math.round(derived.elementCount / 5))),
        waveAmplitude: Math.max(10, Math.min(40, derived.curveAmplitude * 0.8)),
        organicDistortion: derived.organicAmount,
        gradientStops: Math.max(2, Math.min(5, derived.layerCount + 1)),
        blobFactor: derived.flowIntensity,
        curveTension: derived.curveTension,
    };
}

// ============================================
// FLOW SHAPE GENERATION
// ============================================

/**
 * Generate organic blob shape points
 */
function generateBlobPoints(
    params: FlowGradientParams,
    cx: number,
    cy: number,
    baseRadius: number,
    rng: () => number
): Point[] {
    const points: Point[] = [];
    const pointCount = 8 + Math.floor(params.waveCount * 2);

    for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;

        // Base radius with wave modulation
        const waveOffset = Math.sin(angle * params.waveCount) * params.waveAmplitude * 0.3;

        // Add organic distortion
        const distortion = params.organicDistortion > 0
            ? addNoise(0, params.organicDistortion, rng, baseRadius * 0.2)
            : 0;

        // Blob factor creates more dramatic curves
        const blobEffect = Math.sin(angle * 2) * params.blobFactor * baseRadius * 0.15;

        const r = baseRadius + waveOffset + distortion + blobEffect;

        points.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
        });
    }

    return points;
}

/**
 * Generate flowing wave shape
 */
function generateWaveShape(
    params: FlowGradientParams,
    viewSize: number,
    layerIndex: number,
    totalLayers: number,
    rng: () => number
): string {
    const padding = viewSize * 0.1;
    const t = layerIndex / Math.max(1, totalLayers - 1);

    switch (params.flowDirection) {
        case 'horizontal':
            return generateHorizontalFlow(params, viewSize, padding, t, rng);
        case 'vertical':
            return generateVerticalFlow(params, viewSize, padding, t, rng);
        case 'diagonal':
            return generateDiagonalFlow(params, viewSize, padding, t, rng);
        case 'radial':
        default:
            return generateRadialFlow(params, viewSize, t, rng);
    }
}

function generateHorizontalFlow(
    params: FlowGradientParams,
    viewSize: number,
    padding: number,
    t: number,
    rng: () => number
): string {
    const points: Point[] = [];
    const segments = 6;
    const yOffset = viewSize * 0.3 * (t - 0.5);

    // Top edge with waves
    for (let i = 0; i <= segments; i++) {
        const x = padding + (i / segments) * (viewSize - padding * 2);
        const waveY = Math.sin((i / segments) * Math.PI * params.waveCount) * params.waveAmplitude;
        const noise = addNoise(0, params.organicDistortion, rng, 5);
        points.push({ x, y: viewSize * 0.3 + yOffset + waveY + noise });
    }

    // Bottom edge (reverse)
    for (let i = segments; i >= 0; i--) {
        const x = padding + (i / segments) * (viewSize - padding * 2);
        const waveY = Math.sin((i / segments) * Math.PI * params.waveCount + Math.PI) * params.waveAmplitude * 0.5;
        const noise = addNoise(0, params.organicDistortion, rng, 5);
        points.push({ x, y: viewSize * 0.7 + yOffset + waveY + noise });
    }

    return createOrganicShape(points, params.curveTension, true);
}

function generateVerticalFlow(
    params: FlowGradientParams,
    viewSize: number,
    padding: number,
    t: number,
    rng: () => number
): string {
    const points: Point[] = [];
    const segments = 6;
    const xOffset = viewSize * 0.3 * (t - 0.5);

    // Left edge with waves
    for (let i = 0; i <= segments; i++) {
        const y = padding + (i / segments) * (viewSize - padding * 2);
        const waveX = Math.sin((i / segments) * Math.PI * params.waveCount) * params.waveAmplitude;
        const noise = addNoise(0, params.organicDistortion, rng, 5);
        points.push({ x: viewSize * 0.3 + xOffset + waveX + noise, y });
    }

    // Right edge (reverse)
    for (let i = segments; i >= 0; i--) {
        const y = padding + (i / segments) * (viewSize - padding * 2);
        const waveX = Math.sin((i / segments) * Math.PI * params.waveCount + Math.PI) * params.waveAmplitude * 0.5;
        const noise = addNoise(0, params.organicDistortion, rng, 5);
        points.push({ x: viewSize * 0.7 + xOffset + waveX + noise, y });
    }

    return createOrganicShape(points, params.curveTension, true);
}

function generateDiagonalFlow(
    params: FlowGradientParams,
    viewSize: number,
    padding: number,
    t: number,
    rng: () => number
): string {
    const points: Point[] = [];
    const offset = viewSize * 0.2 * (t - 0.5);

    // Create diagonal ribbon shape
    const width = viewSize * 0.4;

    points.push({ x: padding + offset, y: padding });
    points.push({ x: viewSize - padding + offset, y: padding });
    points.push({ x: viewSize - padding - offset, y: viewSize - padding });
    points.push({ x: padding - offset, y: viewSize - padding });

    // Add wave distortion
    return points.map((p, i) => {
        const wave = Math.sin(i * Math.PI * 0.5) * params.waveAmplitude * 0.3;
        const noise = addNoise(0, params.organicDistortion, rng, 3);
        return { x: p.x + noise, y: p.y + wave + noise };
    }).reduce((path, p, i) => {
        if (i === 0) return `M ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
        return path + ` L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`;
    }, '') + ' Z';
}

function generateRadialFlow(
    params: FlowGradientParams,
    viewSize: number,
    t: number,
    rng: () => number
): string {
    const cx = viewSize / 2;
    const cy = viewSize / 2;
    const baseRadius = viewSize * (0.25 + t * 0.15);

    const points = generateBlobPoints(params, cx, cy, baseRadius, rng);
    return createOrganicShape(points, params.curveTension, true);
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleFlowGradient(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateFlowGradientParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('flow-gradient', variant);

    // Create main gradient
    const mainGradId = `${uniqueId}-main`;
    const gradientAngle = algoParams.flowDirection === 'horizontal' ? 0 :
                          algoParams.flowDirection === 'vertical' ? 90 : 45;

    svg.addGradient(mainGradId, {
        type: algoParams.flowDirection === 'radial' ? 'radial' : 'linear',
        angle: gradientAngle,
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 20) },
        ],
    });

    // Generate and render flow shape
    const shapePath = generateWaveShape(algoParams, size, 0, 1, rng);
    svg.path(shapePath, { fill: `url(#${mainGradId})` });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'flow-gradient', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'flow-gradient',
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
                symmetry: algoParams.flowDirection === 'radial' ? 'radial' : 'none',
                pathCount: 1,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                gradient: {
                    type: algoParams.flowDirection === 'radial' ? 'radial' : 'linear',
                    angle: gradientAngle,
                    stops: [
                        { offset: 0, color: lighten(primaryColor, 15) },
                        { offset: 1, color: accentColor || darken(primaryColor, 20) },
                    ],
                },
                palette: [primaryColor, accentColor || darken(primaryColor, 15)],
            },
        },
    };

    return { logo, quality };
}

export function generateFlowGradient(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleFlowGradient(params, hashParams, v);

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
                algorithm: 'flow-gradient',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleFlowGradientPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateFlowGradientParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: params.flowDirection === 'radial' ? 'radial' : 'linear',
        angle: 45,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    const shapePath = generateWaveShape(params, size, 0, 1, rng);
    svg.path(shapePath, { fill: 'url(#main)' });

    return svg.build();
}
