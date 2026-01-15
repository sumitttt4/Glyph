/**
 * Stacked Motion Lines Generator (Linear-style)
 *
 * Creates layered horizontal lines with motion effects
 * Inspired by Linear's dynamic brand mark
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    StackedLinesParams,
    Point,
    GradientDef,
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
    fbm,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, withAlpha } from '../core/color-utils';

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateStackedLinesParams(rng: () => number): StackedLinesParams {
    const base = generateBaseParams(rng);
    return {
        ...base,
        lineCount: 4 + Math.floor(rng() * 6),             // 4-9 lines
        lineThickness: 2 + rng() * 5,                     // 2-7
        lineWaveAmplitude: rng() * 15,                    // 0-15
        lineWaveFrequency: 0.5 + rng() * 2.5,             // 0.5-3
        lineSpacing: 5 + rng() * 10,                      // 5-15
        motionBlur: rng() * 0.6,                          // 0-0.6
        velocityVariance: rng() * 0.5,                    // 0-0.5
        parallelOffset: rng() * 10,                       // 0-10
    };
}

// ============================================
// BEZIER LINE GENERATION
// ============================================

/**
 * Generate a single motion line using bezier curves
 */
function generateMotionLinePath(
    params: StackedLinesParams,
    index: number,
    totalLines: number,
    rng: () => number,
    size: number,
    seed: string
): { path: string; opacity: number } {
    const padding = size * params.paddingRatio;
    const availableHeight = size - padding * 2;
    const totalSpacing = (totalLines - 1) * params.lineSpacing;
    const lineAreaHeight = availableHeight - totalSpacing;
    const yBase = padding + index * (lineAreaHeight / totalLines + params.lineSpacing);

    // Calculate velocity/offset for this line (motion effect)
    const velocityFactor = 1 + (rng() - 0.5) * params.velocityVariance;
    const xOffset = params.parallelOffset * (index % 2 === 0 ? 1 : -1) * velocityFactor;

    // Generate bezier control points for wavy line
    const segments = Math.max(3, Math.floor(params.curveFrequency * 2));
    const segmentWidth = (size - padding * 2) / segments;

    const points: Point[] = [];
    const controlPoints: Point[] = [];

    for (let s = 0; s <= segments; s++) {
        const t = s / segments;
        const x = padding + xOffset + t * (size - padding * 2 - Math.abs(xOffset));

        // Apply wave using fbm noise for organic feel
        const noiseVal = fbm(t * params.lineWaveFrequency, index * 0.5, seed);
        const waveY = noiseVal * params.lineWaveAmplitude;

        const y = yBase + waveY + addNoise(0, params.noiseAmount, rng, 2);
        points.push({ x, y });

        // Generate control points for smoothness
        if (s < segments) {
            const midX = x + segmentWidth / 2;
            const controlNoise = fbm((t + 0.5 / segments) * params.lineWaveFrequency, index * 0.5, seed);
            const controlY = yBase + controlNoise * params.lineWaveAmplitude * (1 + params.curveTension);
            controlPoints.push({ x: midX, y: controlY });
        }
    }

    // Build smooth bezier path through points
    const path = buildSmoothBezierPath(points, params.curveTension);

    // Calculate opacity with motion blur effect
    const baseOpacity = params.baseOpacity - (index / totalLines) * params.opacityFalloff;
    const blurOpacity = baseOpacity * (1 - params.motionBlur * (index / totalLines));

    return { path, opacity: Math.max(0.2, blurOpacity) };
}

/**
 * Build a smooth bezier path through an array of points
 */
function buildSmoothBezierPath(points: Point[], tension: number): string {
    if (points.length < 2) return '';

    const path: string[] = [];
    path.push(`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`);

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(0, i - 1)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(points.length - 1, i + 2)];

        // Calculate control points using Catmull-Rom to Bezier conversion
        const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
        const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
        const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
        const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

        path.push(
            `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        );
    }

    return path.join(' ');
}

/**
 * Generate line as a stroked path with variable width
 */
function generateThickLinePath(
    params: StackedLinesParams,
    index: number,
    totalLines: number,
    rng: () => number,
    size: number,
    seed: string
): { path: string; opacity: number } {
    const { path: centerPath, opacity } = generateMotionLinePath(
        params,
        index,
        totalLines,
        rng,
        size,
        seed
    );

    // For thick lines, we create a filled shape rather than stroke
    const thickness = params.lineThickness * (1 - (index / totalLines) * params.taperAmount || 0);

    // Parse the bezier path and create offset curves
    const expandedPath = createExpandedStrokePath(centerPath, thickness, params);

    return { path: expandedPath, opacity };
}

/**
 * Create an expanded stroke path (filled shape from centerline)
 */
function createExpandedStrokePath(
    centerPath: string,
    thickness: number,
    params: StackedLinesParams
): string {
    // Parse path commands
    const commands = centerPath.match(/[MC][^MC]*/g) || [];
    if (commands.length === 0) return centerPath;

    const topPoints: Point[] = [];
    const bottomPoints: Point[] = [];

    let currentX = 0;
    let currentY = 0;

    commands.forEach(cmd => {
        const type = cmd[0];
        const nums = cmd.slice(1).trim().split(/[\s,]+/).map(parseFloat);

        if (type === 'M') {
            currentX = nums[0];
            currentY = nums[1];
            topPoints.push({ x: currentX, y: currentY - thickness / 2 });
            bottomPoints.push({ x: currentX, y: currentY + thickness / 2 });
        } else if (type === 'C') {
            // For cubic bezier, sample points along the curve
            for (let t = 0.25; t <= 1; t += 0.25) {
                const pt = sampleCubicBezier(
                    currentX, currentY,
                    nums[0], nums[1],
                    nums[2], nums[3],
                    nums[4], nums[5],
                    t
                );
                topPoints.push({ x: pt.x, y: pt.y - thickness / 2 });
                bottomPoints.push({ x: pt.x, y: pt.y + thickness / 2 });
            }
            currentX = nums[4];
            currentY = nums[5];
        }
    });

    // Construct closed path: top edge forward, bottom edge backward
    const pathParts: string[] = [];

    if (topPoints.length > 0) {
        pathParts.push(`M ${topPoints[0].x.toFixed(2)} ${topPoints[0].y.toFixed(2)}`);

        // Top edge (forward)
        for (let i = 1; i < topPoints.length; i++) {
            const prev = topPoints[i - 1];
            const curr = topPoints[i];
            const ctrl1x = prev.x + (curr.x - prev.x) * 0.5;
            const ctrl2x = curr.x - (curr.x - prev.x) * 0.5;
            pathParts.push(
                `C ${ctrl1x.toFixed(2)} ${prev.y.toFixed(2)}, ${ctrl2x.toFixed(2)} ${curr.y.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`
            );
        }

        // Connect to bottom edge
        const lastTop = topPoints[topPoints.length - 1];
        const lastBottom = bottomPoints[bottomPoints.length - 1];
        pathParts.push(
            `C ${lastTop.x.toFixed(2)} ${(lastTop.y + lastBottom.y) / 2}, ${lastBottom.x.toFixed(2)} ${(lastTop.y + lastBottom.y) / 2}, ${lastBottom.x.toFixed(2)} ${lastBottom.y.toFixed(2)}`
        );

        // Bottom edge (backward)
        for (let i = bottomPoints.length - 2; i >= 0; i--) {
            const prev = bottomPoints[i + 1];
            const curr = bottomPoints[i];
            const ctrl1x = prev.x - (prev.x - curr.x) * 0.5;
            const ctrl2x = curr.x + (prev.x - curr.x) * 0.5;
            pathParts.push(
                `C ${ctrl1x.toFixed(2)} ${prev.y.toFixed(2)}, ${ctrl2x.toFixed(2)} ${curr.y.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`
            );
        }

        pathParts.push('Z');
    }

    return pathParts.join(' ');
}

function sampleCubicBezier(
    x0: number, y0: number,
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    t: number
): Point {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    return {
        x: mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3,
        y: mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3,
    };
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateStackedLines(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        primaryColor,
        accentColor,
        variations = 3,
        seed = brandName,
    } = params;

    const logos: GeneratedLogo[] = [];
    const size = 100;

    for (let v = 0; v < variations; v++) {
        const variantSeed = `${seed}-stacked-lines-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateStackedLinesParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('stacked-lines', v);

        // Add gradient
        const gradientId = `${uniqueId}-main-grad`;
        svg.addGradient(gradientId, {
            type: 'linear',
            angle: 90,
            stops: [
                { offset: 0, color: lighten(primaryColor, 15) },
                { offset: 0.5, color: primaryColor },
                { offset: 1, color: accentColor || darken(primaryColor, 20) },
            ],
        });

        // Generate lines
        const paths: string[] = [];
        for (let i = 0; i < algoParams.lineCount; i++) {
            const { path, opacity } = generateThickLinePath(
                algoParams,
                i,
                algoParams.lineCount,
                rng,
                size,
                variantSeed
            );

            const lineGradId = `${uniqueId}-line-${i}`;
            const progress = i / (algoParams.lineCount - 1);

            svg.addGradient(lineGradId, {
                type: 'linear',
                angle: 0,
                stops: [
                    { offset: 0, color: withAlpha(lighten(primaryColor, 20 * (1 - progress)), opacity) },
                    { offset: 1, color: withAlpha(accentColor || darken(primaryColor, 15 * progress), opacity) },
                ],
            });

            svg.path(path, {
                fill: `url(#${lineGradId})`,
            });
            paths.push(path);
        }

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'stacked-lines', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'stacked-lines',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'stacked-lines',
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
                    gridBased: true,
                    bezierCurves: true,
                    symmetry: 'horizontal',
                    pathCount: algoParams.lineCount,
                    complexity: calculateComplexity(svgString),
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: [primaryColor, accentColor || darken(primaryColor, 20)],
                },
            },
        });
    }

    return logos;
}

export function generateSingleStackedLines(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<StackedLinesParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateStackedLinesParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);

    for (let i = 0; i < params.lineCount; i++) {
        const { path, opacity } = generateThickLinePath(params, i, params.lineCount, rng, size, seed);
        const progress = i / (params.lineCount - 1);

        svg.path(path, {
            fill: withAlpha(
                progress < 0.5 ? primaryColor : (accentColor || darken(primaryColor, 20)),
                opacity
            ),
        });
    }

    return svg.build();
}
