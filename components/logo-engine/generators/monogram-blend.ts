/**
 * Monogram Blend Generator
 *
 * Creates two letters intertwined with shared strokes
 * Modern monogram aesthetic
 * Uses bezier paths for letter forms
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    MonogramBlendParams,
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
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateMonogramBlendParams(hashParams: HashParams, rng: () => number): MonogramBlendParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const blendStyles: Array<'overlap' | 'interlock' | 'merge' | 'stack'> =
        ['overlap', 'interlock', 'merge', 'stack'];

    return {
        ...base,
        blendStyle: blendStyles[derived.styleVariant % 4],
        letterSpacing: (derived.spacingFactor - 1) * 20,
        shareStrokes: derived.organicAmount > 0.5,
        strokeModulation: derived.taperRatio,
        letterWeights: [
            Math.max(300, Math.min(700, 400 + derived.letterWeight * 0.3)),
            Math.max(300, Math.min(700, 400 + derived.letterWeight * 0.4)),
        ],
        verticalOffset: (derived.jitterAmount - 5) * 2,
    };
}

// ============================================
// LETTER PATH GENERATION
// ============================================

/**
 * Create stylized monogram letter using bezier curves
 */
function createMonogramLetter(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    weight: number,
    style: 'left' | 'right'
): string {
    const char = letter.toUpperCase().charAt(0);
    const strokeWidth = (weight / 700) * size * 0.12;
    const halfSize = size / 2;

    // Simplified geometric monogram letters
    switch (char) {
        case 'A':
            return createMonoA(cx, cy, halfSize, strokeWidth, style);
        case 'B':
            return createMonoB(cx, cy, halfSize, strokeWidth, style);
        case 'C':
            return createMonoC(cx, cy, halfSize, strokeWidth, style);
        case 'D':
            return createMonoD(cx, cy, halfSize, strokeWidth, style);
        case 'E':
            return createMonoE(cx, cy, halfSize, strokeWidth, style);
        case 'F':
            return createMonoF(cx, cy, halfSize, strokeWidth, style);
        case 'G':
            return createMonoG(cx, cy, halfSize, strokeWidth, style);
        case 'H':
            return createMonoH(cx, cy, halfSize, strokeWidth, style);
        case 'I':
            return createMonoI(cx, cy, halfSize, strokeWidth, style);
        case 'J':
            return createMonoJ(cx, cy, halfSize, strokeWidth, style);
        case 'K':
            return createMonoK(cx, cy, halfSize, strokeWidth, style);
        case 'L':
            return createMonoL(cx, cy, halfSize, strokeWidth, style);
        case 'M':
            return createMonoM(cx, cy, halfSize, strokeWidth, style);
        case 'N':
            return createMonoN(cx, cy, halfSize, strokeWidth, style);
        case 'O':
            return createMonoO(cx, cy, halfSize, strokeWidth, style);
        case 'P':
            return createMonoP(cx, cy, halfSize, strokeWidth, style);
        case 'R':
            return createMonoR(cx, cy, halfSize, strokeWidth, style);
        case 'S':
            return createMonoS(cx, cy, halfSize, strokeWidth, style);
        case 'T':
            return createMonoT(cx, cy, halfSize, strokeWidth, style);
        case 'U':
            return createMonoU(cx, cy, halfSize, strokeWidth, style);
        case 'V':
            return createMonoV(cx, cy, halfSize, strokeWidth, style);
        case 'W':
            return createMonoW(cx, cy, halfSize, strokeWidth, style);
        case 'X':
            return createMonoX(cx, cy, halfSize, strokeWidth, style);
        case 'Y':
            return createMonoY(cx, cy, halfSize, strokeWidth, style);
        case 'Z':
            return createMonoZ(cx, cy, halfSize, strokeWidth, style);
        default:
            return createMonoO(cx, cy, halfSize, strokeWidth, style);
    }
}

// Simplified monogram letter creators
function createMonoA(cx: number, cy: number, size: number, sw: number, style: string): string {
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;
    const width = size * 0.5;

    return `
        M ${cx - width} ${bottom}
        L ${cx} ${top}
        L ${cx + width} ${bottom}
        L ${cx + width - sw} ${bottom}
        L ${cx} ${top + sw * 1.5}
        L ${cx - width + sw} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoB(cx: number, cy: number, size: number, sw: number, style: string): string {
    const k = 0.5522847498;
    const left = cx - size * 0.3;
    const right = cx + size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${cx} ${top}
        C ${right} ${top}, ${right} ${cy}, ${cx} ${cy}
        C ${right + size * 0.1} ${cy}, ${right + size * 0.1} ${bottom}, ${cx} ${bottom}
        L ${left} ${bottom}
        L ${left} ${top}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoC(cx: number, cy: number, size: number, sw: number, style: string): string {
    const r = size * 0.6;
    const k = 0.5522847498;

    return `
        M ${cx + r * 0.6} ${cy - r * 0.7}
        C ${cx} ${cy - r}, ${cx - r} ${cy - r * 0.5}, ${cx - r} ${cy}
        C ${cx - r} ${cy + r * 0.5}, ${cx} ${cy + r}, ${cx + r * 0.6} ${cy + r * 0.7}
        L ${cx + r * 0.5} ${cy + r * 0.5}
        C ${cx + r * 0.1} ${cy + r * 0.7}, ${cx - r + sw} ${cy + r * 0.3}, ${cx - r + sw} ${cy}
        C ${cx - r + sw} ${cy - r * 0.3}, ${cx + r * 0.1} ${cy - r * 0.7}, ${cx + r * 0.5} ${cy - r * 0.5}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoD(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${cx} ${top}
        C ${cx + size * 0.5} ${top}, ${cx + size * 0.5} ${bottom}, ${cx} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoE(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.35;
    const right = cx + size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${right} ${top}
        L ${right} ${top + sw}
        L ${left + sw} ${top + sw}
        L ${left + sw} ${cy - sw / 2}
        L ${right - size * 0.1} ${cy - sw / 2}
        L ${right - size * 0.1} ${cy + sw / 2}
        L ${left + sw} ${cy + sw / 2}
        L ${left + sw} ${bottom - sw}
        L ${right} ${bottom - sw}
        L ${right} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoF(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.3;
    const right = cx + size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${right} ${top}
        L ${right} ${top + sw}
        L ${left + sw} ${top + sw}
        L ${left + sw} ${cy - sw / 2}
        L ${right - size * 0.15} ${cy - sw / 2}
        L ${right - size * 0.15} ${cy + sw / 2}
        L ${left + sw} ${cy + sw / 2}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoG(cx: number, cy: number, size: number, sw: number, style: string): string {
    return createMonoC(cx, cy, size, sw, style);
}

function createMonoH(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.4;
    const right = cx + size * 0.4;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${cy - sw / 2}
        L ${right - sw} ${cy - sw / 2}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${right} ${bottom}
        L ${right - sw} ${bottom}
        L ${right - sw} ${cy + sw / 2}
        L ${left + sw} ${cy + sw / 2}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoI(cx: number, cy: number, size: number, sw: number, style: string): string {
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${cx - sw / 2} ${top}
        L ${cx + sw / 2} ${top}
        L ${cx + sw / 2} ${bottom}
        L ${cx - sw / 2} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoJ(cx: number, cy: number, size: number, sw: number, style: string): string {
    return createMonoI(cx + size * 0.15, cy, size, sw, style);
}

function createMonoK(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${cy - sw}
        L ${cx + size * 0.25} ${top}
        L ${cx + size * 0.4} ${top}
        L ${left + sw} ${cy}
        L ${cx + size * 0.4} ${bottom}
        L ${cx + size * 0.25} ${bottom}
        L ${left + sw} ${cy + sw}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoL(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.3;
    const right = cx + size * 0.3;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${bottom - sw}
        L ${right} ${bottom - sw}
        L ${right} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoM(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.45;
    const right = cx + size * 0.45;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${bottom}
        L ${left} ${top}
        L ${cx} ${cy}
        L ${right} ${top}
        L ${right} ${bottom}
        L ${right - sw} ${bottom}
        L ${right - sw} ${top + sw * 1.5}
        L ${cx} ${cy + sw * 0.5}
        L ${left + sw} ${top + sw * 1.5}
        L ${left + sw} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoN(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.35;
    const right = cx + size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${bottom}
        L ${left} ${top}
        L ${right} ${bottom - sw * 1.5}
        L ${right} ${top}
        L ${right + sw * 0.1} ${top}
        L ${right + sw * 0.1} ${bottom}
        L ${left + sw} ${top + sw * 1.5}
        L ${left + sw} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoO(cx: number, cy: number, size: number, sw: number, style: string): string {
    const r = size * 0.6;
    const k = 0.5522847498;

    return `
        M ${cx} ${cy - r}
        C ${cx + r * k} ${cy - r}, ${cx + r} ${cy - r * k}, ${cx + r} ${cy}
        C ${cx + r} ${cy + r * k}, ${cx + r * k} ${cy + r}, ${cx} ${cy + r}
        C ${cx - r * k} ${cy + r}, ${cx - r} ${cy + r * k}, ${cx - r} ${cy}
        C ${cx - r} ${cy - r * k}, ${cx - r * k} ${cy - r}, ${cx} ${cy - r}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoP(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.3;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${cx + size * 0.1} ${top}
        C ${cx + size * 0.4} ${top}, ${cx + size * 0.4} ${cy}, ${cx + size * 0.1} ${cy}
        L ${left + sw} ${cy}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoR(cx: number, cy: number, size: number, sw: number, style: string): string {
    return createMonoP(cx, cy, size, sw, style);
}

function createMonoS(cx: number, cy: number, size: number, sw: number, style: string): string {
    return `
        M ${cx + size * 0.35} ${cy - size * 0.5}
        C ${cx + size * 0.35} ${cy - size * 0.75}, ${cx - size * 0.4} ${cy - size * 0.75}, ${cx - size * 0.4} ${cy - size * 0.4}
        C ${cx - size * 0.4} ${cy - size * 0.1}, ${cx + size * 0.4} ${cy + size * 0.1}, ${cx + size * 0.4} ${cy + size * 0.4}
        C ${cx + size * 0.4} ${cy + size * 0.75}, ${cx - size * 0.35} ${cy + size * 0.75}, ${cx - size * 0.35} ${cy + size * 0.5}
        L ${cx - size * 0.25} ${cy + size * 0.45}
        C ${cx - size * 0.25} ${cy + size * 0.6}, ${cx + size * 0.25} ${cy + size * 0.6}, ${cx + size * 0.25} ${cy + size * 0.4}
        C ${cx + size * 0.25} ${cy + size * 0.2}, ${cx - size * 0.25} ${cy - size * 0.05}, ${cx - size * 0.25} ${cy - size * 0.4}
        C ${cx - size * 0.25} ${cy - size * 0.6}, ${cx + size * 0.2} ${cy - size * 0.6}, ${cx + size * 0.25} ${cy - size * 0.45}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoT(cx: number, cy: number, size: number, sw: number, style: string): string {
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${cx - size * 0.4} ${top}
        L ${cx + size * 0.4} ${top}
        L ${cx + size * 0.4} ${top + sw}
        L ${cx + sw / 2} ${top + sw}
        L ${cx + sw / 2} ${bottom}
        L ${cx - sw / 2} ${bottom}
        L ${cx - sw / 2} ${top + sw}
        L ${cx - size * 0.4} ${top + sw}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoU(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.35;
    const right = cx + size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.4;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${bottom}
        C ${left + sw} ${cy + size * 0.6}, ${right - sw} ${cy + size * 0.6}, ${right - sw} ${bottom}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${right} ${bottom}
        C ${right} ${cy + size * 0.8}, ${left} ${cy + size * 0.8}, ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoV(cx: number, cy: number, size: number, sw: number, style: string): string {
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;
    const width = size * 0.45;

    return `
        M ${cx - width} ${top}
        L ${cx - width + sw} ${top}
        L ${cx} ${bottom - sw}
        L ${cx + width - sw} ${top}
        L ${cx + width} ${top}
        L ${cx} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoW(cx: number, cy: number, size: number, sw: number, style: string): string {
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;
    const width = size * 0.5;

    return `
        M ${cx - width} ${top}
        L ${cx - width + sw * 0.7} ${top}
        L ${cx - size * 0.15} ${bottom - sw}
        L ${cx} ${cy}
        L ${cx + size * 0.15} ${bottom - sw}
        L ${cx + width - sw * 0.7} ${top}
        L ${cx + width} ${top}
        L ${cx + size * 0.2} ${bottom}
        L ${cx} ${cy + sw}
        L ${cx - size * 0.2} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoX(cx: number, cy: number, size: number, sw: number, style: string): string {
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;
    const width = size * 0.4;

    return `
        M ${cx - width} ${top}
        L ${cx - width + sw} ${top}
        L ${cx} ${cy - sw * 0.3}
        L ${cx + width - sw} ${top}
        L ${cx + width} ${top}
        L ${cx + sw * 0.4} ${cy}
        L ${cx + width} ${bottom}
        L ${cx + width - sw} ${bottom}
        L ${cx} ${cy + sw * 0.3}
        L ${cx - width + sw} ${bottom}
        L ${cx - width} ${bottom}
        L ${cx - sw * 0.4} ${cy}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoY(cx: number, cy: number, size: number, sw: number, style: string): string {
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;
    const width = size * 0.4;

    return `
        M ${cx - width} ${top}
        L ${cx - width + sw} ${top}
        L ${cx} ${cy - sw * 0.2}
        L ${cx + width - sw} ${top}
        L ${cx + width} ${top}
        L ${cx + sw / 2} ${cy}
        L ${cx + sw / 2} ${bottom}
        L ${cx - sw / 2} ${bottom}
        L ${cx - sw / 2} ${cy}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createMonoZ(cx: number, cy: number, size: number, sw: number, style: string): string {
    const left = cx - size * 0.35;
    const right = cx + size * 0.35;
    const top = cy - size * 0.7;
    const bottom = cy + size * 0.7;

    return `
        M ${left} ${top}
        L ${right} ${top}
        L ${right} ${top + sw}
        L ${left + sw * 1.2} ${bottom - sw}
        L ${right} ${bottom - sw}
        L ${right} ${bottom}
        L ${left} ${bottom}
        L ${left} ${bottom - sw}
        L ${right - sw * 1.2} ${top + sw}
        L ${left} ${top + sw}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleMonogramBlend(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateMonogramBlendParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('monogram-blend', variant);

    // Get first two letters
    const letters = brandName.toUpperCase().replace(/[^A-Z]/g, '');
    const letter1 = letters.charAt(0) || 'A';
    const letter2 = letters.charAt(1) || letters.charAt(0) || 'B';

    // Calculate positions based on blend style
    let x1 = cx - algoParams.letterSpacing / 2 - size * 0.15;
    let x2 = cx + algoParams.letterSpacing / 2 + size * 0.15;
    let y1 = cy + algoParams.verticalOffset / 2;
    let y2 = cy - algoParams.verticalOffset / 2;

    if (algoParams.blendStyle === 'stack') {
        x1 = cx;
        x2 = cx;
        y1 = cy - size * 0.25;
        y2 = cy + size * 0.25;
    }

    // Create gradients
    svg.addGradient(`${uniqueId}-grad1`, {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: primaryColor },
        ],
    });

    svg.addGradient(`${uniqueId}-grad2`, {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: accentColor || mixColors(primaryColor, '#000000', 0.2) },
            { offset: 1, color: accentColor ? darken(accentColor, 10) : darken(primaryColor, 20) },
        ],
    });

    // Create letter paths
    const letterSize = algoParams.blendStyle === 'stack' ? size * 0.6 : size * 0.8;
    const path1 = createMonogramLetter(letter1, x1, y1, letterSize, algoParams.letterWeights[0], 'left');
    const path2 = createMonogramLetter(letter2, x2, y2, letterSize, algoParams.letterWeights[1], 'right');

    // Render letters (order depends on blend style)
    if (algoParams.blendStyle === 'overlap') {
        svg.path(path1, { fill: `url(#${uniqueId}-grad1)` });
        svg.path(path2, { fill: `url(#${uniqueId}-grad2)`, opacity: '0.85' });
    } else {
        svg.path(path2, { fill: `url(#${uniqueId}-grad2)` });
        svg.path(path1, { fill: `url(#${uniqueId}-grad1)` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'monogram-blend', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'monogram-blend',
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
                symmetry: algoParams.blendStyle === 'stack' ? 'vertical' : 'none',
                pathCount: 2,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || darken(primaryColor, 20)],
            },
        },
    };

    return { logo, quality };
}

export function generateMonogramBlend(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleMonogramBlend(params, hashParams, v);

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
                algorithm: 'monogram-blend',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleMonogramBlendPreview(
    primaryColor: string,
    accentColor?: string,
    letters: string = 'AB',
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateMonogramBlendParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const letter1 = letters.charAt(0) || 'A';
    const letter2 = letters.charAt(1) || 'B';

    svg.addGradient('grad1', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    svg.addGradient('grad2', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: accentColor || darken(primaryColor, 15) },
            { offset: 1, color: accentColor ? darken(accentColor, 10) : darken(primaryColor, 25) },
        ],
    });

    const path1 = createMonogramLetter(letter1, size * 0.35, size / 2, size * 0.7, 500, 'left');
    const path2 = createMonogramLetter(letter2, size * 0.65, size / 2, size * 0.7, 500, 'right');

    svg.path(path1, { fill: 'url(#grad1)' });
    svg.path(path2, { fill: 'url(#grad2)', opacity: '0.85' });

    return svg.build();
}
