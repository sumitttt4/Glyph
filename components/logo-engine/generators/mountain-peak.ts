/**
 * Mountain Peak Generator (Outdoor/Adventure-style)
 *
 * Creates mountain silhouette shapes
 * Adventure and outdoor aesthetic
 * Inspired by outdoor and adventure brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    MountainPeakParams,
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

function generateMountainPeakParams(hashParams: HashParams, rng: () => number): MountainPeakParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const ridges: Array<'smooth' | 'jagged' | 'stepped'> = ['smooth', 'jagged', 'stepped'];

    return {
        ...base,
        peakCount: Math.max(1, Math.min(3, Math.floor(derived.elementCount * 0.2 + 1))),
        snowLine: derived.curveTension * 0.4 + 0.2,
        ridgeStyle: ridges[Math.floor(derived.styleVariant % 3)],
        baseWidth: derived.scaleFactor * 0.3 + 0.7,
        peakSharpness: derived.perspectiveStrength,
        layerCount: Math.max(1, Math.min(3, Math.floor(derived.layerCount * 0.5 + 1))),
        sunBehind: derived.organicAmount > 0.6,
        treeLine: derived.taperRatio > 0.5,
        fogEffect: derived.bulgeAmount > 0.4,
        mainPeakHeight: derived.armLength * 0.3 + 0.7,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateMountainPath(
    params: MountainPeakParams,
    cx: number,
    cy: number,
    peakIndex: number,
    scale: number = 1
): string {
    const { peakCount, ridgeStyle, baseWidth, peakSharpness, mainPeakHeight } = params;

    const width = 50 * scale * baseWidth;
    const height = 45 * scale * (peakIndex === 0 ? mainPeakHeight : mainPeakHeight * 0.75);

    const offset = (peakIndex - (peakCount - 1) / 2) * width * 0.6;

    const left = cx - width / 2 + offset;
    const right = cx + width / 2 + offset;
    const baseY = cy + height * 0.4;
    const peakY = cy - height * 0.6;
    const peakX = cx + offset;

    let path = `M ${left.toFixed(2)} ${baseY.toFixed(2)}`;

    if (ridgeStyle === 'smooth') {
        // Smooth bezier mountain
        const leftCP = { x: left + width * 0.2, y: baseY - height * 0.3 };
        const peakLeftCP = { x: peakX - width * 0.15, y: peakY + height * 0.1 };

        path += ` C ${leftCP.x.toFixed(2)} ${leftCP.y.toFixed(2)},`;
        path += ` ${peakLeftCP.x.toFixed(2)} ${peakLeftCP.y.toFixed(2)},`;
        path += ` ${peakX.toFixed(2)} ${peakY.toFixed(2)}`;

        const peakRightCP = { x: peakX + width * 0.15, y: peakY + height * 0.1 };
        const rightCP = { x: right - width * 0.2, y: baseY - height * 0.3 };

        path += ` C ${peakRightCP.x.toFixed(2)} ${peakRightCP.y.toFixed(2)},`;
        path += ` ${rightCP.x.toFixed(2)} ${rightCP.y.toFixed(2)},`;
        path += ` ${right.toFixed(2)} ${baseY.toFixed(2)}`;

    } else if (ridgeStyle === 'jagged') {
        // Jagged peaks with small ridges
        const segments = 4;
        const segWidth = (peakX - left) / segments;

        for (let i = 1; i <= segments; i++) {
            const x = left + i * segWidth;
            const progress = i / segments;
            const baseHeight = baseY - (baseY - peakY) * progress;
            const jag = (i % 2 === 0 ? 3 : -2) * peakSharpness;

            path += ` L ${x.toFixed(2)} ${(baseHeight + jag).toFixed(2)}`;
        }

        path += ` L ${peakX.toFixed(2)} ${peakY.toFixed(2)}`;

        for (let i = 1; i <= segments; i++) {
            const x = peakX + i * segWidth;
            const progress = i / segments;
            const baseHeight = peakY + (baseY - peakY) * progress;
            const jag = (i % 2 === 0 ? -3 : 2) * peakSharpness;

            path += ` L ${x.toFixed(2)} ${(baseHeight + jag).toFixed(2)}`;
        }

    } else {
        // Stepped/terraced
        const steps = 3;
        const stepWidth = (peakX - left) / steps;
        const stepHeight = (baseY - peakY) / steps;

        for (let i = 1; i <= steps; i++) {
            const x = left + i * stepWidth;
            const y = baseY - i * stepHeight;
            path += ` L ${(x - stepWidth * 0.3).toFixed(2)} ${(y + stepHeight).toFixed(2)}`;
            path += ` L ${(x - stepWidth * 0.3).toFixed(2)} ${y.toFixed(2)}`;
        }

        path += ` L ${peakX.toFixed(2)} ${peakY.toFixed(2)}`;

        for (let i = 1; i <= steps; i++) {
            const x = peakX + i * stepWidth;
            const y = peakY + i * stepHeight;
            path += ` L ${(x - stepWidth * 0.7).toFixed(2)} ${y.toFixed(2)}`;
            path += ` L ${(x - stepWidth * 0.7).toFixed(2)} ${(y + stepHeight * 0.2).toFixed(2)}`;
        }
    }

    path += ` L ${right.toFixed(2)} ${baseY.toFixed(2)}`;
    path += ' Z';

    return path;
}

function generateSnowCapPath(
    params: MountainPeakParams,
    cx: number,
    cy: number,
    peakIndex: number,
    scale: number = 1
): string {
    const { peakCount, snowLine, baseWidth, mainPeakHeight } = params;

    const width = 50 * scale * baseWidth;
    const height = 45 * scale * (peakIndex === 0 ? mainPeakHeight : mainPeakHeight * 0.75);

    const offset = (peakIndex - (peakCount - 1) / 2) * width * 0.6;

    const peakX = cx + offset;
    const peakY = cy - height * 0.6;
    const snowY = peakY + height * snowLine;

    const snowWidth = width * (0.3 + snowLine * 0.3);

    return `
        M ${peakX.toFixed(2)} ${peakY.toFixed(2)}
        C ${(peakX - snowWidth * 0.3).toFixed(2)} ${(peakY + height * 0.08).toFixed(2)},
          ${(peakX - snowWidth * 0.5).toFixed(2)} ${(snowY - height * 0.05).toFixed(2)},
          ${(peakX - snowWidth * 0.5).toFixed(2)} ${snowY.toFixed(2)}
        C ${(peakX - snowWidth * 0.3).toFixed(2)} ${(snowY + 2).toFixed(2)},
          ${(peakX + snowWidth * 0.3).toFixed(2)} ${(snowY + 2).toFixed(2)},
          ${(peakX + snowWidth * 0.5).toFixed(2)} ${snowY.toFixed(2)}
        C ${(peakX + snowWidth * 0.5).toFixed(2)} ${(snowY - height * 0.05).toFixed(2)},
          ${(peakX + snowWidth * 0.3).toFixed(2)} ${(peakY + height * 0.08).toFixed(2)},
          ${peakX.toFixed(2)} ${peakY.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateSunPath(
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

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleMountainPeak(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateMountainPeakParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('mountain-peak', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 0.6, color: darken(primaryColor, 15) },
            { offset: 1, color: darken(primaryColor, 25) },
        ],
    });

    // Sun behind mountains
    if (algoParams.sunBehind) {
        const sunPath = generateSunPath(cx, cy - 15, 18);
        svg.path(sunPath, { fill: accentColor || '#FFD93D' });
    }

    // Background mountains (if multiple layers)
    if (algoParams.layerCount > 1) {
        for (let l = algoParams.layerCount - 1; l > 0; l--) {
            const bgPath = generateMountainPath(algoParams, cx, cy + l * 8, 0, 0.9 - l * 0.1);
            svg.path(bgPath, { fill: darken(primaryColor, 20 + l * 10), fillOpacity: (0.6 - l * 0.15).toString() });
        }
    }

    // Main mountains
    for (let i = algoParams.peakCount - 1; i >= 0; i--) {
        const mountainPath = generateMountainPath(algoParams, cx, cy, i);
        const opacity = i === 0 ? 1 : 0.8;
        svg.path(mountainPath, { fill: `url(#${gradientId})`, fillOpacity: opacity.toString() });

        // Snow caps
        if (algoParams.snowLine > 0.1) {
            const snowPath = generateSnowCapPath(algoParams, cx, cy, i);
            svg.path(snowPath, { fill: '#FFFFFF', fillOpacity: '0.95' });
        }
    }

    // Fog effect
    if (algoParams.fogEffect) {
        const fogGradId = `${uniqueId}-fog`;
        svg.addGradient(fogGradId, {
            type: 'linear',
            angle: 180,
            stops: [
                { offset: 0, color: '#FFFFFF', opacity: 0 },
                { offset: 0.7, color: '#FFFFFF', opacity: 0.3 },
                { offset: 1, color: '#FFFFFF', opacity: 0.5 },
            ],
        });

        const fogPath = `
            M ${(cx - 40).toFixed(2)} ${(cy + 20).toFixed(2)}
            L ${(cx + 40).toFixed(2)} ${(cy + 20).toFixed(2)}
            L ${(cx + 40).toFixed(2)} ${(cy + 35).toFixed(2)}
            L ${(cx - 40).toFixed(2)} ${(cy + 35).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
        svg.path(fogPath, { fill: `url(#${fogGradId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'mountain-peak', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'mountain-peak',
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
                bezierCurves: algoParams.ridgeStyle === 'smooth',
                symmetry: 'none',
                pathCount: algoParams.peakCount * (algoParams.snowLine > 0.1 ? 2 : 1) + algoParams.layerCount - 1,
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

export function generateMountainPeak(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleMountainPeak(params, hashParams, v);

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
                algorithm: 'mountain-peak',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleMountainPeakPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateMountainPeakParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 20) },
        ],
    });

    const path = generateMountainPath(params, size / 2, size / 2, 0);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
