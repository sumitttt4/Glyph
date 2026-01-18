/**
 * Moon Phase Generator (Night/Mystery-style)
 *
 * Creates crescent moon and lunar phase shapes
 * Ethereal and mystical aesthetic
 * Inspired by night-themed and mystical brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    MoonPhaseParams,
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

function generateMoonPhaseParams(hashParams: HashParams, rng: () => number): MoonPhaseParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const craters: Array<'none' | 'subtle' | 'detailed'> = ['none', 'subtle', 'detailed'];

    return {
        ...base,
        phaseAmount: derived.curveTension * 0.7 + 0.1,
        craterStyle: craters[Math.floor(derived.styleVariant % 3)],
        glowRadius: derived.organicAmount * 8 + 4,
        crescentWidth: derived.taperRatio * 0.4 + 0.3,
        moonRadius: derived.scaleFactor * 8 + 30,
        tilt: (derived.rotationOffset - 180) * 0.3,
        innerShadow: derived.perspectiveStrength > 0.5,
        starCount: Math.floor(derived.colorPlacement * 5),
        haloEffect: derived.layerCount > 2,
        surfaceTexture: derived.bulgeAmount > 0.4,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateMoonPath(
    params: MoonPhaseParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { phaseAmount, moonRadius, crescentWidth } = params;

    const r = moonRadius * scale;
    const k = 0.5522847498;

    // Outer moon circle
    const outerPath = `
        M ${cx.toFixed(2)} ${(cy - r).toFixed(2)}
        C ${(cx + r * k).toFixed(2)} ${(cy - r).toFixed(2)},
          ${(cx + r).toFixed(2)} ${(cy - r * k).toFixed(2)},
          ${(cx + r).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + r).toFixed(2)} ${(cy + r * k).toFixed(2)},
          ${(cx + r * k).toFixed(2)} ${(cy + r).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + r).toFixed(2)}
        C ${(cx - r * k).toFixed(2)} ${(cy + r).toFixed(2)},
          ${(cx - r).toFixed(2)} ${(cy + r * k).toFixed(2)},
          ${(cx - r).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - r).toFixed(2)} ${(cy - r * k).toFixed(2)},
          ${(cx - r * k).toFixed(2)} ${(cy - r).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - r).toFixed(2)}
    `.replace(/\s+/g, ' ').trim();

    // Inner cutout for crescent (shadow side)
    const innerR = r * (1 - crescentWidth * phaseAmount);
    const offsetX = r * phaseAmount * 0.8;

    const innerPath = `
        M ${(cx + offsetX).toFixed(2)} ${(cy - innerR).toFixed(2)}
        C ${(cx + offsetX + innerR * k).toFixed(2)} ${(cy - innerR).toFixed(2)},
          ${(cx + offsetX + innerR).toFixed(2)} ${(cy - innerR * k).toFixed(2)},
          ${(cx + offsetX + innerR).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + offsetX + innerR).toFixed(2)} ${(cy + innerR * k).toFixed(2)},
          ${(cx + offsetX + innerR * k).toFixed(2)} ${(cy + innerR).toFixed(2)},
          ${(cx + offsetX).toFixed(2)} ${(cy + innerR).toFixed(2)}
        C ${(cx + offsetX - innerR * k).toFixed(2)} ${(cy + innerR).toFixed(2)},
          ${(cx + offsetX - innerR).toFixed(2)} ${(cy + innerR * k).toFixed(2)},
          ${(cx + offsetX - innerR).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + offsetX - innerR).toFixed(2)} ${(cy - innerR * k).toFixed(2)},
          ${(cx + offsetX - innerR * k).toFixed(2)} ${(cy - innerR).toFixed(2)},
          ${(cx + offsetX).toFixed(2)} ${(cy - innerR).toFixed(2)}
    `.replace(/\s+/g, ' ').trim();

    return outerPath + ' ' + innerPath;
}

function generateFullMoonPath(
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

function generateCraterPath(
    cx: number,
    cy: number,
    radius: number
): string {
    const k = 0.5522847498 * 0.8;
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
    size: number = 2
): string {
    return `
        M ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
        L ${(cx + size * 0.3).toFixed(2)} ${(cy - size * 0.3).toFixed(2)}
        L ${(cx + size).toFixed(2)} ${cy.toFixed(2)}
        L ${(cx + size * 0.3).toFixed(2)} ${(cy + size * 0.3).toFixed(2)}
        L ${cx.toFixed(2)} ${(cy + size).toFixed(2)}
        L ${(cx - size * 0.3).toFixed(2)} ${(cy + size * 0.3).toFixed(2)}
        L ${(cx - size).toFixed(2)} ${cy.toFixed(2)}
        L ${(cx - size * 0.3).toFixed(2)} ${(cy - size * 0.3).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleMoonPhase(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateMoonPhaseParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('moon-phase', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 30) },
            { offset: 0.6, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    // Halo effect
    if (algoParams.haloEffect) {
        const haloGradId = `${uniqueId}-halo`;
        svg.addGradient(haloGradId, {
            type: 'radial',
            stops: [
                { offset: 0.5, color: primaryColor, opacity: 0 },
                { offset: 0.7, color: primaryColor, opacity: 0.15 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });
        const haloPath = generateFullMoonPath(cx, cy, algoParams.moonRadius + algoParams.glowRadius);
        svg.path(haloPath, { fill: `url(#${haloGradId})` });
    }

    // Main moon (crescent)
    const moonPath = generateMoonPath(algoParams, cx, cy);
    svg.path(moonPath, { fill: `url(#${gradientId})`, fillRule: 'evenodd' });

    // Craters
    if (algoParams.craterStyle !== 'none') {
        const craterPositions = [
            { x: cx - 8, y: cy - 5, r: 3 },
            { x: cx - 12, y: cy + 8, r: 2 },
            { x: cx - 5, y: cy + 3, r: 2.5 },
        ];

        const craterCount = algoParams.craterStyle === 'detailed' ? 3 : 1;
        for (let i = 0; i < craterCount; i++) {
            const pos = craterPositions[i];
            const craterPath = generateCraterPath(pos.x, pos.y, pos.r);
            svg.path(craterPath, { fill: darken(primaryColor, 15), fillOpacity: '0.4' });
        }
    }

    // Stars
    if (algoParams.starCount > 0) {
        const starPositions = [
            { x: cx + 25, y: cy - 20 },
            { x: cx + 30, y: cy + 10 },
            { x: cx - 25, y: cy - 25 },
            { x: cx + 15, y: cy + 25 },
            { x: cx - 20, y: cy + 20 },
        ];

        for (let i = 0; i < Math.min(algoParams.starCount, 5); i++) {
            const pos = starPositions[i];
            const starPath = generateStarPath(pos.x, pos.y, 1.5 - i * 0.2);
            svg.path(starPath, { fill: accentColor || lighten(primaryColor, 50) });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'moon-phase', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'moon-phase',
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
                pathCount: 1 + (algoParams.craterStyle !== 'none' ? (algoParams.craterStyle === 'detailed' ? 3 : 1) : 0) + algoParams.starCount,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 50)],
            },
        },
    };

    return { logo, quality };
}

export function generateMoonPhase(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleMoonPhase(params, hashParams, v);

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
                algorithm: 'moon-phase',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleMoonPhasePreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateMoonPhaseParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 25) },
            { offset: 1, color: darken(primaryColor, 5) },
        ],
    });

    const path = generateMoonPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)', fillRule: 'evenodd' });

    return svg.build();
}
