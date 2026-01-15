/**
 * Arc Swoosh Generator (Nike/Dynamic style)
 *
 * Creates dynamic curved swoosh shapes with tapered edges
 * Inspired by Nike and modern motion graphics
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    ArcSwooshParams,
    Point,
} from '../types';
import {
    createSeededRandom,
    generateBaseParams,
    generateLogoHash,
    generateLogoId,
    addNoise,
    PHI,
    lerp,
    calculateComplexity,
    storeHash,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateArcSwooshParams(rng: () => number): ArcSwooshParams {
    const base = generateBaseParams(rng);
    return {
        ...base,
        swooshCount: 1 + Math.floor(rng() * 3),           // 1-3 swooshes
        swooshWidth: 5 + rng() * 12,                      // 5-17
        swooshLength: 0.5 + rng() * 0.4,                  // 0.5-0.9
        swooshCurvature: 0.3 + rng() * 0.5,               // 0.3-0.8
        startAngle: rng() * 180,                          // 0-180
        sweepAngle: 90 + rng() * 120,                     // 90-210
        taperStart: 0.1 + rng() * 0.4,                    // 0.1-0.5
        taperEnd: 0.6 + rng() * 0.35,                     // 0.6-0.95
        dynamicWidth: rng() > 0.4,                        // 60% chance
    };
}

// ============================================
// SWOOSH GENERATION
// ============================================

interface SwooshPath {
    d: string;
    index: number;
}

/**
 * Generate a swoosh arc using bezier curves
 */
function generateSwooshPath(
    params: ArcSwooshParams,
    index: number,
    totalSwooshes: number,
    cx: number,
    cy: number,
    size: number,
    rng: () => number
): SwooshPath {
    const padding = size * params.paddingRatio;
    const radius = (size - padding * 2) * 0.4 * params.swooshLength;

    // Offset each swoosh
    const swooshOffset = (index - (totalSwooshes - 1) / 2) * params.swooshWidth * 1.5;

    // Calculate arc parameters
    const startAngleRad = (params.startAngle + index * 15) * Math.PI / 180;
    const sweepRad = params.sweepAngle * Math.PI / 180;
    const endAngleRad = startAngleRad + sweepRad;

    // Sample points along the arc
    const segments = 20;
    const centerPoints: Point[] = [];

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = lerp(startAngleRad, endAngleRad, t);

        // Apply curvature - offset radius based on position
        const curveOffset = Math.sin(t * Math.PI) * params.swooshCurvature * radius * 0.3;
        const r = radius + curveOffset + addNoise(0, params.noiseAmount, rng, 2);

        centerPoints.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r + swooshOffset,
        });
    }

    // Calculate width at each point (tapered)
    const widths: number[] = centerPoints.map((_, i) => {
        const t = i / segments;
        const startTaper = t < params.taperStart
            ? t / params.taperStart
            : 1;
        const endTaper = t > params.taperEnd
            ? (1 - t) / (1 - params.taperEnd)
            : 1;

        let width = params.swooshWidth * startTaper * endTaper;

        if (params.dynamicWidth) {
            width *= 0.7 + Math.sin(t * Math.PI) * 0.6;
        }

        return Math.max(1, width);
    });

    // Generate the swoosh shape
    const path = createTaperedSwooshPath(centerPoints, widths, params.curveTension);

    return { d: path, index };
}

/**
 * Create a tapered swoosh path from centerline and widths
 */
function createTaperedSwooshPath(
    centerPoints: Point[],
    widths: number[],
    tension: number
): string {
    if (centerPoints.length < 2) return '';

    const topEdge: Point[] = [];
    const bottomEdge: Point[] = [];

    // Calculate perpendicular direction at each point
    for (let i = 0; i < centerPoints.length; i++) {
        const prev = centerPoints[Math.max(0, i - 1)];
        const curr = centerPoints[i];
        const next = centerPoints[Math.min(centerPoints.length - 1, i + 1)];

        // Tangent direction
        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;

        // Perpendicular (normal) direction
        const nx = -dy / len;
        const ny = dx / len;

        const halfWidth = widths[i] / 2;

        topEdge.push({
            x: curr.x + nx * halfWidth,
            y: curr.y + ny * halfWidth,
        });

        bottomEdge.push({
            x: curr.x - nx * halfWidth,
            y: curr.y - ny * halfWidth,
        });
    }

    // Build path: top edge forward, curve around end, bottom edge backward
    const pathParts: string[] = [];

    // Start at beginning of top edge
    pathParts.push(`M ${topEdge[0].x.toFixed(2)} ${topEdge[0].y.toFixed(2)}`);

    // Top edge using bezier curves
    for (let i = 0; i < topEdge.length - 1; i++) {
        const p0 = topEdge[Math.max(0, i - 1)];
        const p1 = topEdge[i];
        const p2 = topEdge[i + 1];
        const p3 = topEdge[Math.min(topEdge.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
        const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
        const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
        const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

        pathParts.push(
            `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        );
    }

    // Round cap at end
    const lastTop = topEdge[topEdge.length - 1];
    const lastBottom = bottomEdge[bottomEdge.length - 1];
    const lastCenter = centerPoints[centerPoints.length - 1];

    pathParts.push(
        `Q ${lastCenter.x.toFixed(2)} ${(lastTop.y + lastBottom.y) / 2}, ${lastBottom.x.toFixed(2)} ${lastBottom.y.toFixed(2)}`
    );

    // Bottom edge (backward) using bezier curves
    for (let i = bottomEdge.length - 2; i >= 0; i--) {
        const p0 = bottomEdge[Math.min(bottomEdge.length - 1, i + 2)];
        const p1 = bottomEdge[i + 1];
        const p2 = bottomEdge[i];
        const p3 = bottomEdge[Math.max(0, i - 1)];

        const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
        const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
        const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
        const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

        pathParts.push(
            `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        );
    }

    // Round cap at start
    const firstTop = topEdge[0];
    const firstBottom = bottomEdge[0];
    const firstCenter = centerPoints[0];

    pathParts.push(
        `Q ${firstCenter.x.toFixed(2)} ${(firstTop.y + firstBottom.y) / 2}, ${firstTop.x.toFixed(2)} ${firstTop.y.toFixed(2)}`
    );

    pathParts.push('Z');

    return pathParts.join(' ');
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateArcSwoosh(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        primaryColor,
        accentColor,
        variations = 3,
        seed = brandName,
    } = params;

    const logos: GeneratedLogo[] = [];
    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    for (let v = 0; v < variations; v++) {
        const variantSeed = `${seed}-arc-swoosh-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateArcSwooshParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('arc-swoosh', v);

        // Generate swooshes
        const swooshes: SwooshPath[] = [];
        for (let i = 0; i < algoParams.swooshCount; i++) {
            swooshes.push(generateSwooshPath(
                algoParams,
                i,
                algoParams.swooshCount,
                cx,
                cy,
                size,
                rng
            ));
        }

        // Render swooshes with gradients
        swooshes.forEach((swoosh, i) => {
            const gradId = `${uniqueId}-swoosh-${i}`;
            const progress = i / (algoParams.swooshCount - 1 || 1);

            svg.addGradient(gradId, {
                type: 'linear',
                angle: algoParams.startAngle,
                stops: [
                    { offset: 0, color: lighten(primaryColor, 15 * (1 - progress)) },
                    { offset: 0.5, color: primaryColor },
                    { offset: 1, color: accentColor
                        ? mixColors(primaryColor, accentColor, progress)
                        : darken(primaryColor, 15 * progress) },
                ],
            });

            const opacity = algoParams.baseOpacity - progress * algoParams.opacityFalloff * 0.3;

            svg.path(swoosh.d, {
                fill: `url(#${gradId})`,
                opacity: Math.max(0.4, opacity),
            });
        });

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'arc-swoosh', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'arc-swoosh',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'arc-swoosh',
            variant: v + 1,
            svg: svgString,
            viewBox: `0 0 ${size} ${size}`,
            params: algoParams,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: variantSeed,
                geometry: {
                    usesGoldenRatio: false,
                    gridBased: false,
                    bezierCurves: true,
                    symmetry: 'none',
                    pathCount: algoParams.swooshCount,
                    complexity: calculateComplexity(svgString),
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: [primaryColor, accentColor || darken(primaryColor, 15)],
                },
            },
        });
    }

    return logos;
}

export function generateSingleArcSwoosh(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<ArcSwooshParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateArcSwooshParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: params.startAngle,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    for (let i = 0; i < params.swooshCount; i++) {
        const swoosh = generateSwooshPath(params, i, params.swooshCount, size / 2, size / 2, size, rng);
        svg.path(swoosh.d, { fill: 'url(#main)' });
    }

    return svg.build();
}
