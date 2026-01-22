/**
 * Wave Flow Generator (Water/Fluid-style)
 *
 * Creates flowing wave patterns
 * Ocean and fluid dynamics aesthetic
 * Inspired by water and marine brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    WaveFlowParams,
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

function generateWaveFlowParams(hashParams: HashParams, rng: () => number): WaveFlowParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const directions: Array<'horizontal' | 'vertical' | 'diagonal'> = ['horizontal', 'vertical', 'diagonal'];

    return {
        ...base,
        waveCount: Math.max(2, Math.min(5, Math.floor(derived.elementCount * 0.3 + 2))),
        amplitude: derived.curveTension * 12 + 6,
        flowDirection: directions[Math.floor(derived.styleVariant % 3)],
        foamAmount: derived.organicAmount * 0.5,
        wavelength: derived.scaleFactor * 20 + 30,
        phaseShift: derived.rotationOffset * 0.02,
        layerOpacity: derived.taperRatio * 0.3 + 0.5,
        crestStyle: derived.perspectiveStrength > 0.5 ? 'sharp' : 'smooth',
        droplets: Math.floor(derived.colorPlacement * 4),
        gradient: derived.layerCount > 2,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateWavePath(
    params: WaveFlowParams,
    cx: number,
    cy: number,
    waveIndex: number,
    scale: number = 1
): string {
    const { amplitude, wavelength, phaseShift, crestStyle, waveCount } = params;

    const width = 80 * scale;
    const amp = amplitude * scale * (1 - waveIndex * 0.15);
    const waveLen = wavelength * scale;

    const left = cx - width / 2;
    const right = cx + width / 2;
    const baseY = cy + (waveIndex - waveCount / 2) * 12;

    const phase = phaseShift * waveIndex * Math.PI;
    const segments = 4;
    const segmentWidth = width / segments;

    let path = `M ${left.toFixed(2)} ${baseY.toFixed(2)}`;

    for (let i = 0; i < segments; i++) {
        const x1 = left + i * segmentWidth;
        const x2 = left + (i + 0.5) * segmentWidth;
        const x3 = left + (i + 1) * segmentWidth;

        const y1 = baseY + Math.sin(phase + (i / segments) * Math.PI * 2) * amp;
        const y2 = baseY + Math.sin(phase + ((i + 0.5) / segments) * Math.PI * 2) * amp * (crestStyle === 'sharp' ? 1.2 : 1);
        const y3 = baseY + Math.sin(phase + ((i + 1) / segments) * Math.PI * 2) * amp;

        const cp1x = x1 + segmentWidth * 0.3;
        const cp1y = y1 + (y2 - y1) * 0.5;
        const cp2x = x2 - segmentWidth * 0.1;
        const cp2y = y2;

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}`;

        const cp3x = x2 + segmentWidth * 0.1;
        const cp3y = y2;
        const cp4x = x3 - segmentWidth * 0.3;
        const cp4y = y3 + (y2 - y3) * 0.5;

        path += ` C ${cp3x.toFixed(2)} ${cp3y.toFixed(2)}, ${cp4x.toFixed(2)} ${cp4y.toFixed(2)}, ${x3.toFixed(2)} ${y3.toFixed(2)}`;
    }

    // Close the wave shape
    path += ` L ${right.toFixed(2)} ${(baseY + 15).toFixed(2)}`;
    path += ` L ${left.toFixed(2)} ${(baseY + 15).toFixed(2)}`;
    path += ' Z';

    return path;
}

function generateDropletPath(
    cx: number,
    cy: number,
    size: number = 3
): string {
    return `
        M ${cx.toFixed(2)} ${(cy - size * 1.5).toFixed(2)}
        C ${(cx + size * 0.6).toFixed(2)} ${(cy - size * 0.5).toFixed(2)},
          ${(cx + size * 0.6).toFixed(2)} ${(cy + size * 0.3).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + size).toFixed(2)}
        C ${(cx - size * 0.6).toFixed(2)} ${(cy + size * 0.3).toFixed(2)},
          ${(cx - size * 0.6).toFixed(2)} ${(cy - size * 0.5).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - size * 1.5).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleWaveFlow(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateWaveFlowParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('wave-flow', variant);

    // Create gradients for each wave layer
    for (let i = 0; i < algoParams.waveCount; i++) {
        const gradientId = `${uniqueId}-grad-${i}`;
        const lightness = 20 - i * 8;
        svg.addGradient(gradientId, {
            type: 'linear',
            angle: 180,
            stops: [
                { offset: 0, color: lighten(primaryColor, lightness + 10) },
                { offset: 1, color: lighten(primaryColor, lightness - 5) },
            ],
        });
    }

    // Generate waves from back to front
    for (let i = algoParams.waveCount - 1; i >= 0; i--) {
        const wavePath = generateWavePath(algoParams, cx, cy, i);
        const opacity = algoParams.layerOpacity + (1 - algoParams.layerOpacity) * ((algoParams.waveCount - i) / algoParams.waveCount);

        svg.path(wavePath, {
            fill: `url(#${uniqueId}-grad-${i})`,
            fillOpacity: opacity.toString(),
        });
    }

    // Foam highlights
    if (algoParams.foamAmount > 0.2) {
        const foamPath = generateWavePath(algoParams, cx, cy - 2, 0, 0.95);
        svg.path(foamPath, {
            fill: 'none',
            stroke: lighten(primaryColor, 40),
            strokeWidth: '1.5',
            strokeOpacity: (algoParams.foamAmount * 0.8).toString(),
        });
    }

    // Droplets
    const dropletCount = algoParams.droplets ?? 0;
    if (dropletCount > 0) {
        const dropletPositions = [
            { x: cx - 20, y: cy - 20 },
            { x: cx + 15, y: cy - 25 },
            { x: cx + 25, y: cy - 15 },
            { x: cx - 10, y: cy - 28 },
        ];

        for (let i = 0; i < Math.min(dropletCount, 4); i++) {
            const pos = dropletPositions[i];
            const dropletPath = generateDropletPath(pos.x, pos.y, 2.5 - i * 0.3);
            svg.path(dropletPath, { fill: accentColor || lighten(primaryColor, 35) });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'wave-flow', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'wave-flow',
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
                pathCount: algoParams.waveCount + (algoParams.droplets ?? 0) + (algoParams.foamAmount > 0.2 ? 1 : 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, lighten(primaryColor, 20), accentColor || lighten(primaryColor, 35)],
            },
        },
    };

    return { logo, quality };
}

export function generateWaveFlow(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleWaveFlow(params, hashParams, v);

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
                algorithm: 'wave-flow',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleWaveFlowPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateWaveFlowParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 1, color: darken(primaryColor, 5) },
        ],
    });

    const path = generateWavePath(params, size / 2, size / 2, 0);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
