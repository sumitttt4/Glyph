/**
 * Sound Waves Generator (Spotify-style)
 *
 * Creates flowing audio waveforms with decay and amplitude
 * Vertical wave bars emanating from center with organic movement
 * Inspired by Spotify's iconic sound wave patterns
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    SoundWavesParams,
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
    addNoise,
    PHI,
    lerp,
    calculateComplexity,
    storeHash,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateSoundWavesParams(hashParams: HashParams, rng: () => number): SoundWavesParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const waveStyles: Array<'sine' | 'sawtooth' | 'square' | 'organic'> = ['sine', 'sawtooth', 'square', 'organic'];
    const symmetries: Array<'bilateral' | 'radial' | 'none'> = ['bilateral', 'radial', 'none'];

    return {
        ...base,
        waveCount: Math.max(3, Math.min(8, Math.round(derived.elementCount * 0.4 + 3))),
        amplitude: derived.curveAmplitude * 0.6 + 10,
        frequency: derived.scaleFactor * 1.5 + 0.5,
        decay: 0.7 + derived.taperRatio * 0.3,
        spacing: derived.spacingFactor * 8 + 8,
        strokeTaper: derived.taperRatio,
        phaseOffset: derived.rotationOffset,
        waveStyle: waveStyles[Math.floor(derived.styleVariant % 4)],
        symmetry: symmetries[Math.floor(derived.styleVariant % 3)],
        peakRounding: derived.curveTension,
    };
}

// ============================================
// WAVE PATH GENERATION
// ============================================

/**
 * Generate a single wave bar path using bezier curves
 */
function generateWavePath(
    params: SoundWavesParams,
    index: number,
    cx: number,
    cy: number,
    rng: () => number
): string {
    const { waveCount, amplitude, decay, spacing, strokeTaper, phaseOffset, waveStyle, peakRounding } = params;

    // Calculate position and height for this bar
    const offset = (index - (waveCount - 1) / 2) * spacing;
    const x = cx + offset;

    // Height based on position (center is tallest)
    const distFromCenter = Math.abs(index - (waveCount - 1) / 2);
    const heightFactor = Math.pow(decay, distFromCenter);
    const height = amplitude * heightFactor;

    // Add organic variation
    const wobble = waveStyle === 'organic' ? addNoise(0, 0.15, rng, height * 0.2) : 0;
    const finalHeight = height + wobble;

    // Bar width with taper
    const barWidth = 4 + (1 - strokeTaper) * 4;
    const topWidth = barWidth * (0.5 + strokeTaper * 0.5);

    // Top and bottom Y positions
    const topY = cy - finalHeight / 2;
    const bottomY = cy + finalHeight / 2;

    // Rounding factor for tops
    const roundness = peakRounding * 2;

    // Generate bezier path for rounded bar
    const halfWidthTop = topWidth / 2;
    const halfWidthBottom = barWidth / 2;

    return `
        M ${(x - halfWidthBottom).toFixed(2)} ${bottomY.toFixed(2)}
        C ${(x - halfWidthBottom).toFixed(2)} ${(bottomY - roundness).toFixed(2)},
          ${(x - halfWidthTop).toFixed(2)} ${(topY + roundness * 2).toFixed(2)},
          ${(x - halfWidthTop).toFixed(2)} ${(topY + roundness).toFixed(2)}
        C ${(x - halfWidthTop).toFixed(2)} ${topY.toFixed(2)},
          ${(x - roundness / 2).toFixed(2)} ${(topY - roundness / 2).toFixed(2)},
          ${x.toFixed(2)} ${(topY - roundness / 2).toFixed(2)}
        C ${(x + roundness / 2).toFixed(2)} ${(topY - roundness / 2).toFixed(2)},
          ${(x + halfWidthTop).toFixed(2)} ${topY.toFixed(2)},
          ${(x + halfWidthTop).toFixed(2)} ${(topY + roundness).toFixed(2)}
        C ${(x + halfWidthTop).toFixed(2)} ${(topY + roundness * 2).toFixed(2)},
          ${(x + halfWidthBottom).toFixed(2)} ${(bottomY - roundness).toFixed(2)},
          ${(x + halfWidthBottom).toFixed(2)} ${bottomY.toFixed(2)}
        C ${(x + halfWidthBottom).toFixed(2)} ${(bottomY + roundness / 2).toFixed(2)},
          ${(x + roundness / 2).toFixed(2)} ${(bottomY + roundness / 2).toFixed(2)},
          ${x.toFixed(2)} ${(bottomY + roundness / 2).toFixed(2)}
        C ${(x - roundness / 2).toFixed(2)} ${(bottomY + roundness / 2).toFixed(2)},
          ${(x - halfWidthBottom).toFixed(2)} ${(bottomY + roundness / 2).toFixed(2)},
          ${(x - halfWidthBottom).toFixed(2)} ${bottomY.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleSoundWaves(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateSoundWavesParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('sound-waves', variant);

    // Add gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 90,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    // Generate all wave bars
    for (let i = 0; i < algoParams.waveCount; i++) {
        const path = generateWavePath(algoParams, i, cx, cy, rng);

        // Individual bar gradient based on position
        const barGradId = `${uniqueId}-bar-${i}`;
        const positionFactor = i / (algoParams.waveCount - 1);

        svg.addGradient(barGradId, {
            type: 'linear',
            angle: 180,
            stops: [
                { offset: 0, color: lighten(primaryColor, 20) },
                { offset: 1, color: mixColors(primaryColor, accentColor || darken(primaryColor, 20), positionFactor) },
            ],
        });

        svg.path(path, { fill: `url(#${barGradId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'sound-waves', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'sound-waves',
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
                bezierCurves: true,
                symmetry: algoParams.symmetry === 'bilateral' ? 'horizontal' : 'none',
                pathCount: algoParams.waveCount,
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

/**
 * Generate sound waves logos with quality filtering
 */
export function generateSoundWaves(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        variations = 3,
        minQualityScore = 85,
        category = 'technology',
    } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleSoundWaves(params, hashParams, v);

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
                algorithm: 'sound-waves',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

/**
 * Generate a single sound waves preview
 */
export function generateSingleSoundWavesPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateSoundWavesParams(hashParams, rng);
    const size = 100;
    const cx = size / 2;
    const cy = size / 2;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 90,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    for (let i = 0; i < params.waveCount; i++) {
        const path = generateWavePath(params, i, cx, cy, rng);
        svg.path(path, { fill: 'url(#main)' });
    }

    return svg.build();
}
