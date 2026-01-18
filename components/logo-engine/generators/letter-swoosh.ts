/**
 * Letter Swoosh Generator (Arc-style)
 *
 * Creates a letter with dynamic curved swoosh
 * Energetic, motion-oriented design
 * Uses bezier paths for smooth curves
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    LetterSwooshParams,
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

function generateLetterSwooshParams(hashParams: HashParams, rng: () => number): LetterSwooshParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const placements: Array<'under' | 'through' | 'around'> = ['under', 'through', 'around'];

    return {
        ...base,
        swooshCount: Math.max(1, Math.min(3, Math.round(derived.elementCount / 6))),
        swooshWidth: Math.max(3, Math.min(15, derived.strokeWidth + 2)),
        swooshCurvature: Math.max(0.3, Math.min(0.9, derived.curveTension)),
        swooshPlacement: placements[derived.styleVariant % 3],
        letterWeight: Math.max(400, Math.min(700, derived.letterWeight * 0.8)),
        letterScale: Math.max(0.5, Math.min(0.8, 0.6 + derived.scaleFactor * 0.1)),
        dynamicTaper: derived.taperRatio > 0.5,
    };
}

// ============================================
// SWOOSH PATH GENERATION
// ============================================

/**
 * Create dynamic swoosh curve using bezier paths
 */
function createSwooshPath(
    params: LetterSwooshParams,
    cx: number,
    cy: number,
    size: number,
    swooshIndex: number
): string {
    const { swooshWidth, swooshCurvature, swooshPlacement, dynamicTaper } = params;

    // Base swoosh dimensions
    const startX = cx - size * 0.5;
    const endX = cx + size * 0.5;

    // Vertical position based on placement
    let baseY: number;
    switch (swooshPlacement) {
        case 'under':
            baseY = cy + size * 0.35 + swooshIndex * swooshWidth * 1.5;
            break;
        case 'through':
            baseY = cy + swooshIndex * swooshWidth * 1.2;
            break;
        case 'around':
            baseY = cy - size * 0.2 + swooshIndex * size * 0.4;
            break;
        default:
            baseY = cy + size * 0.3;
    }

    // Control points for curvature
    const curveHeight = size * swooshCurvature * 0.4;
    const cp1 = { x: startX + size * 0.25, y: baseY - curveHeight };
    const cp2 = { x: endX - size * 0.25, y: baseY - curveHeight * 0.5 };

    // Calculate taper
    const startWidth = dynamicTaper ? swooshWidth * 0.3 : swooshWidth;
    const midWidth = swooshWidth;
    const endWidth = dynamicTaper ? swooshWidth * 0.5 : swooshWidth;

    // Build tapered swoosh path
    return createTaperedSwoosh(
        { x: startX, y: baseY },
        cp1,
        cp2,
        { x: endX, y: baseY + curveHeight * 0.3 },
        startWidth,
        midWidth,
        endWidth
    );
}

/**
 * Create tapered swoosh shape with bezier curves
 */
function createTaperedSwoosh(
    start: Point,
    cp1: Point,
    cp2: Point,
    end: Point,
    startWidth: number,
    midWidth: number,
    endWidth: number
): string {
    // Top edge points
    const topStart = { x: start.x, y: start.y - startWidth / 2 };
    const topCP1 = { x: cp1.x, y: cp1.y - midWidth / 2 };
    const topCP2 = { x: cp2.x, y: cp2.y - midWidth / 2 };
    const topEnd = { x: end.x, y: end.y - endWidth / 2 };

    // Bottom edge points
    const botStart = { x: start.x, y: start.y + startWidth / 2 };
    const botCP1 = { x: cp1.x, y: cp1.y + midWidth / 2 };
    const botCP2 = { x: cp2.x, y: cp2.y + midWidth / 2 };
    const botEnd = { x: end.x, y: end.y + endWidth / 2 };

    return `
        M ${topStart.x.toFixed(2)} ${topStart.y.toFixed(2)}
        C ${topCP1.x.toFixed(2)} ${topCP1.y.toFixed(2)}, ${topCP2.x.toFixed(2)} ${topCP2.y.toFixed(2)}, ${topEnd.x.toFixed(2)} ${topEnd.y.toFixed(2)}
        Q ${end.x.toFixed(2)} ${end.y.toFixed(2)}, ${botEnd.x.toFixed(2)} ${botEnd.y.toFixed(2)}
        C ${botCP2.x.toFixed(2)} ${botCP2.y.toFixed(2)}, ${botCP1.x.toFixed(2)} ${botCP1.y.toFixed(2)}, ${botStart.x.toFixed(2)} ${botStart.y.toFixed(2)}
        Q ${start.x.toFixed(2)} ${start.y.toFixed(2)}, ${topStart.x.toFixed(2)} ${topStart.y.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Create simple letter shape for swoosh context
 */
function createSimpleLetter(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    weight: number
): string {
    const char = letter.toUpperCase().charAt(0);
    const sw = (weight / 600) * size * 0.1;
    const halfSize = size / 2;

    // Simplified geometric letters
    switch (char) {
        case 'A': {
            const top = cy - halfSize * 0.8;
            const bottom = cy + halfSize * 0.6;
            return `
                M ${cx - halfSize * 0.4} ${bottom}
                L ${cx} ${top}
                L ${cx + halfSize * 0.4} ${bottom}
                L ${cx + halfSize * 0.4 - sw} ${bottom}
                L ${cx} ${top + sw * 1.5}
                L ${cx - halfSize * 0.4 + sw} ${bottom}
                Z
            `.replace(/\s+/g, ' ').trim();
        }
        case 'B':
        case 'D':
        case 'P':
        case 'R': {
            const left = cx - halfSize * 0.3;
            const top = cy - halfSize * 0.8;
            const bottom = cy + halfSize * 0.6;
            return `
                M ${left} ${top}
                L ${cx + halfSize * 0.2} ${top}
                C ${cx + halfSize * 0.5} ${top}, ${cx + halfSize * 0.5} ${bottom}, ${cx + halfSize * 0.2} ${bottom}
                L ${left} ${bottom}
                Z
            `.replace(/\s+/g, ' ').trim();
        }
        case 'C':
        case 'G': {
            const r = halfSize * 0.5;
            return `
                M ${cx + r * 0.5} ${cy - r * 0.8}
                C ${cx - r} ${cy - r * 1.2}, ${cx - r * 1.2} ${cy + r * 1.2}, ${cx + r * 0.5} ${cy + r * 0.8}
                L ${cx + r * 0.3} ${cy + r * 0.6}
                C ${cx - r * 0.6} ${cy + r * 0.9}, ${cx - r * 0.6} ${cy - r * 0.9}, ${cx + r * 0.3} ${cy - r * 0.6}
                Z
            `.replace(/\s+/g, ' ').trim();
        }
        default: {
            // Default rounded letter shape
            const r = halfSize * 0.5;
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
    }
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleLetterSwoosh(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateLetterSwooshParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('letter-swoosh', variant);

    // Get first letter
    const letter = brandName.charAt(0).toUpperCase();

    // Create gradients
    svg.addGradient(`${uniqueId}-letter`, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: primaryColor },
        ],
    });

    svg.addGradient(`${uniqueId}-swoosh`, {
        type: 'linear',
        angle: 0,
        stops: [
            { offset: 0, color: accentColor || mixColors(primaryColor, '#ffffff', 0.2) },
            { offset: 0.5, color: accentColor || primaryColor },
            { offset: 1, color: accentColor ? darken(accentColor, 10) : darken(primaryColor, 15) },
        ],
    });

    // Render swooshes first (behind letter)
    for (let i = 0; i < algoParams.swooshCount; i++) {
        const swooshPath = createSwooshPath(algoParams, cx, cy, size * 0.9, i);
        svg.path(swooshPath, { fill: `url(#${uniqueId}-swoosh)` });
    }

    // Render letter
    const letterSize = size * algoParams.letterScale;
    const letterY = algoParams.swooshPlacement === 'under' ? cy - size * 0.1 : cy;
    const letterPath = createSimpleLetter(letter, cx, letterY, letterSize, algoParams.letterWeight);
    svg.path(letterPath, { fill: `url(#${uniqueId}-letter)` });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'letter-swoosh', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'letter-swoosh',
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
                pathCount: 1 + algoParams.swooshCount,
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

export function generateLetterSwoosh(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleLetterSwoosh(params, hashParams, v);

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
                algorithm: 'letter-swoosh',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleLetterSwooshPreview(
    primaryColor: string,
    accentColor?: string,
    letter: string = 'A',
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateLetterSwooshParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('letter', {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    svg.addGradient('swoosh', {
        type: 'linear',
        angle: 0,
        stops: [
            { offset: 0, color: accentColor || lighten(primaryColor, 15) },
            { offset: 1, color: accentColor || primaryColor },
        ],
    });

    for (let i = 0; i < params.swooshCount; i++) {
        const swooshPath = createSwooshPath(params, size / 2, size / 2, size * 0.9, i);
        svg.path(swooshPath, { fill: 'url(#swoosh)' });
    }

    const letterPath = createSimpleLetter(letter, size / 2, size / 2, size * params.letterScale, params.letterWeight);
    svg.path(letterPath, { fill: 'url(#letter)' });

    return svg.build();
}
