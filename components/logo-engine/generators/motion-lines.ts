/**
 * Motion Lines Generator (Linear/Framer-style)
 *
 * Creates stacked horizontal lines with motion feel
 * Subtle waves, velocity effects, and tapered ends
 * All shapes use bezier curves only
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    MotionLinesParams,
    Point,
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
    calculateComplexity,
    storeHash,
    lerp,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateMotionLinesParams(hashParams: HashParams, rng: () => number): MotionLinesParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const taperOptions: Array<'left' | 'right' | 'both' | 'none'> = ['left', 'right', 'both', 'none'];

    return {
        ...base,
        lineCount: Math.max(3, Math.min(8, Math.round(derived.elementCount / 2))),
        lineThickness: Math.max(2, Math.min(10, derived.strokeWidth)),
        lineWaveAmplitude: derived.curveAmplitude * 0.3,
        lineSpacing: Math.max(6, Math.min(20, derived.spacingFactor * 10)),
        velocityEffect: derived.organicAmount,
        staggerOffset: derived.jitterAmount * 2,
        taperDirection: taperOptions[derived.styleVariant % 4],
        curveTension: derived.curveTension,
    };
}

// ============================================
// LINE PATH GENERATION
// ============================================

/**
 * Generate a single motion line with wave and taper using beziers
 */
function generateLinePath(
    params: MotionLinesParams,
    index: number,
    totalLines: number,
    viewSize: number,
    rng: () => number
): string {
    const padding = viewSize * 0.15;
    const availableHeight = viewSize - padding * 2;
    const lineSpacing = availableHeight / (totalLines + 1);

    // Calculate Y position for this line
    const baseY = padding + lineSpacing * (index + 1);

    // Stagger offset for motion feel
    const staggerX = params.staggerOffset * (index % 2 === 0 ? 1 : -1) * (index / totalLines);

    // Line start and end points
    const startX = padding + staggerX;
    const endX = viewSize - padding + staggerX;
    const lineLength = endX - startX;

    // Thickness with velocity effect (faster = thinner at edges)
    const baseThickness = params.lineThickness;
    const velocityTaper = params.velocityEffect * 0.5;

    // Wave parameters
    const waveAmp = params.lineWaveAmplitude;
    const wavePhase = (index / totalLines) * Math.PI;

    // Generate control points for the line
    const segments = 4;
    const points: Point[] = [];

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = lerp(startX, endX, t);
        const waveY = Math.sin(t * Math.PI * 2 + wavePhase) * waveAmp;
        const y = baseY + waveY;
        points.push({ x, y });
    }

    // Build the line shape with bezier curves
    return createTaperedLinePath(points, baseThickness, params.taperDirection, params.curveTension, velocityTaper);
}

/**
 * Create a tapered line shape using cubic beziers
 */
function createTaperedLinePath(
    centerPoints: Point[],
    thickness: number,
    taperDirection: 'left' | 'right' | 'both' | 'none',
    tension: number,
    velocityTaper: number
): string {
    if (centerPoints.length < 2) return '';

    const topPoints: Point[] = [];
    const bottomPoints: Point[] = [];

    for (let i = 0; i < centerPoints.length; i++) {
        const t = i / (centerPoints.length - 1);
        const p = centerPoints[i];

        // Calculate thickness at this point
        let thicknessMultiplier = 1;

        if (taperDirection === 'left' || taperDirection === 'both') {
            thicknessMultiplier *= 0.3 + t * 0.7;
        }
        if (taperDirection === 'right' || taperDirection === 'both') {
            thicknessMultiplier *= 0.3 + (1 - t) * 0.7;
        }

        // Apply velocity taper at edges
        const edgeDist = Math.min(t, 1 - t);
        thicknessMultiplier *= 1 - velocityTaper * (1 - edgeDist * 4);

        const halfThickness = (thickness * thicknessMultiplier) / 2;

        topPoints.push({ x: p.x, y: p.y - halfThickness });
        bottomPoints.push({ x: p.x, y: p.y + halfThickness });
    }

    // Build path: top edge forward, then bottom edge backward
    let path = `M ${topPoints[0].x.toFixed(2)} ${topPoints[0].y.toFixed(2)}`;

    // Top edge with smooth beziers
    for (let i = 0; i < topPoints.length - 1; i++) {
        const p0 = topPoints[Math.max(0, i - 1)];
        const p1 = topPoints[i];
        const p2 = topPoints[i + 1];
        const p3 = topPoints[Math.min(topPoints.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    // Smooth cap at right end
    const lastTop = topPoints[topPoints.length - 1];
    const lastBottom = bottomPoints[bottomPoints.length - 1];
    path += ` Q ${lastTop.x.toFixed(2)} ${(lastTop.y + lastBottom.y) / 2}, ${lastBottom.x.toFixed(2)} ${lastBottom.y.toFixed(2)}`;

    // Bottom edge backward with smooth beziers
    for (let i = bottomPoints.length - 1; i > 0; i--) {
        const p0 = bottomPoints[Math.min(bottomPoints.length - 1, i + 1)];
        const p1 = bottomPoints[i];
        const p2 = bottomPoints[i - 1];
        const p3 = bottomPoints[Math.max(0, i - 2)];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    // Smooth cap at left end
    const firstTop = topPoints[0];
    const firstBottom = bottomPoints[0];
    path += ` Q ${firstBottom.x.toFixed(2)} ${(firstTop.y + firstBottom.y) / 2}, ${firstTop.x.toFixed(2)} ${firstTop.y.toFixed(2)}`;

    path += ' Z';

    return path;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleMotionLines(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateMotionLinesParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('motion-lines', variant);

    // Add gradient for depth
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 0,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    // Generate and render lines
    for (let i = 0; i < algoParams.lineCount; i++) {
        const linePath = generateLinePath(algoParams, i, algoParams.lineCount, size, rng);
        const lineGradId = `${uniqueId}-line-${i}`;
        const t = i / (algoParams.lineCount - 1);

        svg.addGradient(lineGradId, {
            type: 'linear',
            angle: 0,
            stops: [
                { offset: 0, color: mixColors(primaryColor, accentColor || primaryColor, t * 0.5) },
                { offset: 1, color: mixColors(primaryColor, accentColor || darken(primaryColor, 20), t) },
            ],
        });

        svg.path(linePath, { fill: `url(#${lineGradId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'motion-lines', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'motion-lines',
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
                symmetry: 'horizontal',
                pathCount: algoParams.lineCount,
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

export function generateMotionLines(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleMotionLines(params, hashParams, v);

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
                algorithm: 'motion-lines',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleMotionLinesPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateMotionLinesParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 0,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    for (let i = 0; i < params.lineCount; i++) {
        const linePath = generateLinePath(params, i, params.lineCount, size, rng);
        svg.path(linePath, { fill: 'url(#main)' });
    }

    return svg.build();
}
