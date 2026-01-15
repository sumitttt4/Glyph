/**
 * Overlapping Shapes Generator (Figma-style)
 *
 * Creates overlapping transparent shapes with blend effects
 * Inspired by Figma/Mastercard's layered design language
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    OverlappingShapesParams,
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
    fbm,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, withAlpha, rotateHue } from '../core/color-utils';

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateOverlappingParams(rng: () => number): OverlappingShapesParams {
    const base = generateBaseParams(rng);
    const types: Array<'circle' | 'ellipse' | 'organic'> = ['circle', 'ellipse', 'organic'];
    const blends: Array<'multiply' | 'screen' | 'overlay'> = ['multiply', 'screen', 'overlay'];

    return {
        ...base,
        shapeCount: 2 + Math.floor(rng() * 3),            // 2-4 shapes
        shapeType: types[Math.floor(rng() * types.length)],
        overlapAmount: 0.3 + rng() * 0.4,                 // 0.3-0.7
        sizeProgression: 0.7 + rng() * 0.5,               // 0.7-1.2
        blendMode: blends[Math.floor(rng() * blends.length)],
        shapePadding: 10 + rng() * 15,                    // 10-25
        rotationSpread: rng() * 120,                      // 0-120
        aspectRatio: 0.7 + rng() * 0.6,                   // 0.7-1.3
    };
}

// ============================================
// SHAPE GENERATION
// ============================================

interface ShapePath {
    d: string;
    index: number;
    color: string;
    opacity: number;
}

/**
 * Generate an organic blob shape using bezier curves
 */
function generateOrganicBlobPath(
    cx: number,
    cy: number,
    radiusX: number,
    radiusY: number,
    complexity: number,
    rng: () => number,
    seed: string
): string {
    const points: Point[] = [];
    const numPoints = 6 + Math.floor(complexity * 4);

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2;
        const noiseVal = fbm(Math.cos(angle) * 2, Math.sin(angle) * 2, seed);
        const radiusVariation = 1 + noiseVal * 0.3;

        const r = {
            x: radiusX * radiusVariation,
            y: radiusY * radiusVariation,
        };

        points.push({
            x: cx + Math.cos(angle) * r.x,
            y: cy + Math.sin(angle) * r.y,
        });
    }

    return createSmoothClosedPath(points);
}

/**
 * Create a smooth closed bezier path through points
 */
function createSmoothClosedPath(points: Point[]): string {
    if (points.length < 3) return '';

    const path: string[] = [];
    const n = points.length;

    // Move to first point
    path.push(`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`);

    for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n];
        const p1 = points[i];
        const p2 = points[(i + 1) % n];
        const p3 = points[(i + 2) % n];

        // Catmull-Rom to Bezier conversion
        const tension = 0.5;
        const cp1x = p1.x + (p2.x - p0.x) / 6 * tension;
        const cp1y = p1.y + (p2.y - p0.y) / 6 * tension;
        const cp2x = p2.x - (p3.x - p1.x) / 6 * tension;
        const cp2y = p2.y - (p3.y - p1.y) / 6 * tension;

        path.push(
            `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        );
    }

    path.push('Z');
    return path.join(' ');
}

/**
 * Generate circle using bezier approximation
 */
function generateCirclePath(cx: number, cy: number, r: number): string {
    const k = 0.5522847498; // Magic number for bezier circle
    return `
        M ${cx} ${cy - r}
        C ${cx + r * k} ${cy - r}, ${cx + r} ${cy - r * k}, ${cx + r} ${cy}
        C ${cx + r} ${cy + r * k}, ${cx + r * k} ${cy + r}, ${cx} ${cy + r}
        C ${cx - r * k} ${cy + r}, ${cx - r} ${cy + r * k}, ${cx - r} ${cy}
        C ${cx - r} ${cy - r * k}, ${cx - r * k} ${cy - r}, ${cx} ${cy - r}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate ellipse using bezier approximation
 */
function generateEllipsePath(cx: number, cy: number, rx: number, ry: number): string {
    const k = 0.5522847498;
    return `
        M ${cx} ${cy - ry}
        C ${cx + rx * k} ${cy - ry}, ${cx + rx} ${cy - ry * k}, ${cx + rx} ${cy}
        C ${cx + rx} ${cy + ry * k}, ${cx + rx * k} ${cy + ry}, ${cx} ${cy + ry}
        C ${cx - rx * k} ${cy + ry}, ${cx - rx} ${cy + ry * k}, ${cx - rx} ${cy}
        C ${cx - rx} ${cy - ry * k}, ${cx - rx * k} ${cy - ry}, ${cx} ${cy - ry}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate a single overlapping shape
 */
function generateShapePath(
    params: OverlappingShapesParams,
    index: number,
    totalShapes: number,
    size: number,
    primaryColor: string,
    accentColor: string | undefined,
    rng: () => number,
    seed: string
): ShapePath {
    const padding = params.shapePadding;
    const availableSize = size - padding * 2;

    // Calculate position with overlap
    const overlapOffset = availableSize * (1 - params.overlapAmount) / (totalShapes - 1 || 1);
    const baseSize = availableSize * 0.5;

    // Size progression
    const sizeMultiplier = Math.pow(params.sizeProgression, index - totalShapes / 2);
    const shapeSize = baseSize * sizeMultiplier;

    // Position calculation
    const cx = padding + availableSize * 0.3 + index * overlapOffset * 0.8;
    const cy = size / 2 + addNoise(0, params.noiseAmount, rng, 5);

    // Rotation for this shape
    const rotation = params.rotationSpread * (index / totalShapes - 0.5);

    // Aspect ratio
    const rx = shapeSize;
    const ry = shapeSize * params.aspectRatio;

    // Generate path based on shape type
    let d: string;
    switch (params.shapeType) {
        case 'circle':
            d = generateCirclePath(cx, cy, shapeSize);
            break;
        case 'ellipse':
            d = generateEllipsePath(cx, cy, rx, ry);
            break;
        case 'organic':
        default:
            d = generateOrganicBlobPath(cx, cy, rx, ry, 0.5 + rng() * 0.5, rng, `${seed}-shape${index}`);
            break;
    }

    // Color for this shape
    const hueShift = (index / totalShapes) * 30 - 15;
    const baseColor = accentColor
        ? (index % 2 === 0 ? primaryColor : accentColor)
        : rotateHue(primaryColor, hueShift);

    // Opacity based on blend mode and position
    const baseOpacity = params.baseOpacity * (1 - params.opacityFalloff * (index / totalShapes));

    return {
        d,
        index,
        color: baseColor,
        opacity: baseOpacity,
    };
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateOverlappingShapes(params: LogoGenerationParams): GeneratedLogo[] {
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
        const variantSeed = `${seed}-overlapping-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateOverlappingParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('overlapping-shapes', v);

        // Generate shapes
        const shapes: ShapePath[] = [];
        for (let i = 0; i < algoParams.shapeCount; i++) {
            shapes.push(generateShapePath(
                algoParams,
                i,
                algoParams.shapeCount,
                size,
                primaryColor,
                accentColor,
                rng,
                variantSeed
            ));
        }

        // Add blend mode filter if needed
        if (algoParams.blendMode !== 'multiply') {
            // CSS blend modes are handled differently in SVG
            // We'll use opacity and color mixing instead
        }

        // Render shapes with gradients
        shapes.forEach(shape => {
            const gradId = `${uniqueId}-shape-${shape.index}`;

            svg.addGradient(gradId, {
                type: 'radial',
                stops: [
                    { offset: 0, color: lighten(shape.color, 15), opacity: shape.opacity },
                    { offset: 0.7, color: shape.color, opacity: shape.opacity },
                    { offset: 1, color: darken(shape.color, 10), opacity: shape.opacity * 0.8 },
                ],
            });

            svg.path(shape.d, {
                fill: `url(#${gradId})`,
                'mix-blend-mode': algoParams.blendMode,
            });
        });

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'overlapping-shapes', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'overlapping-shapes',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'overlapping-shapes',
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
                    pathCount: algoParams.shapeCount,
                    complexity: calculateComplexity(svgString),
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: shapes.map(s => s.color),
                },
            },
        });
    }

    return logos;
}

export function generateSingleOverlappingShapes(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<OverlappingShapesParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateOverlappingParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);

    for (let i = 0; i < params.shapeCount; i++) {
        const shape = generateShapePath(params, i, params.shapeCount, size, primaryColor, accentColor, rng, seed);

        svg.addGradient(`shape-${i}`, {
            type: 'radial',
            stops: [
                { offset: 0, color: lighten(shape.color, 10), opacity: shape.opacity },
                { offset: 1, color: shape.color, opacity: shape.opacity },
            ],
        });

        svg.path(shape.d, {
            fill: `url(#shape-${i})`,
            'mix-blend-mode': params.blendMode,
        });
    }

    return svg.build();
}
