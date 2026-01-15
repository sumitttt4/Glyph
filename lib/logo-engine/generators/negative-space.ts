/**
 * Negative Space Generator (FedEx/Vercel style)
 *
 * Creates clever negative space reveals and hidden forms
 * Inspired by FedEx arrow and Vercel triangle
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    NegativeSpaceParams,
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

function generateNegativeSpaceParams(rng: () => number): NegativeSpaceParams {
    const base = generateBaseParams(rng);
    const shapes: Array<'triangle' | 'arrow' | 'chevron' | 'custom'> = ['triangle', 'arrow', 'chevron', 'custom'];

    return {
        ...base,
        positiveShape: shapes[Math.floor(rng() * shapes.length)],
        negativeReveal: 0.4 + rng() * 0.4,                // 0.4-0.8
        balanceRatio: 0.4 + rng() * 0.2,                  // 0.4-0.6
        sharpness: 0.3 + rng() * 0.6,                     // 0.3-0.9
        innerContrast: 0.5 + rng() * 0.4,                 // 0.5-0.9
        boundaryBlur: rng() * 5,                          // 0-5
        dualTone: rng() > 0.5,                            // 50% chance
        inversionPoint: 0.4 + rng() * 0.2,                // 0.4-0.6
    };
}

// ============================================
// SHAPE GENERATION
// ============================================

/**
 * Generate the positive shape (outer container)
 */
function generatePositiveShape(
    params: NegativeSpaceParams,
    cx: number,
    cy: number,
    size: number,
    rng: () => number
): string {
    const s = size * 0.4;

    switch (params.positiveShape) {
        case 'triangle':
            return generateTrianglePath(cx, cy, s, params, rng);

        case 'arrow':
            return generateArrowPath(cx, cy, s, params, rng);

        case 'chevron':
            return generateChevronPath(cx, cy, s, params, rng);

        case 'custom':
        default:
            return generateCustomPath(cx, cy, s, params, rng);
    }
}

/**
 * Generate a triangle with smooth bezier corners
 */
function generateTrianglePath(
    cx: number,
    cy: number,
    s: number,
    params: NegativeSpaceParams,
    rng: () => number
): string {
    const sharpness = params.sharpness;
    const r = (1 - sharpness) * s * 0.15; // Corner radius based on sharpness

    const top: Point = { x: cx, y: cy - s };
    const bottomRight: Point = { x: cx + s * 0.95, y: cy + s * 0.7 };
    const bottomLeft: Point = { x: cx - s * 0.95, y: cy + s * 0.7 };

    if (r < 2) {
        return `M ${top.x} ${top.y} L ${bottomRight.x} ${bottomRight.y} L ${bottomLeft.x} ${bottomLeft.y} Z`;
    }

    // Smooth corners with bezier
    return `
        M ${top.x} ${top.y + r}
        Q ${top.x} ${top.y}, ${top.x + r * 0.5} ${top.y + r * 0.3}
        L ${bottomRight.x - r} ${bottomRight.y - r * 0.5}
        Q ${bottomRight.x} ${bottomRight.y}, ${bottomRight.x - r * 0.3} ${bottomRight.y}
        L ${bottomLeft.x + r * 0.3} ${bottomLeft.y}
        Q ${bottomLeft.x} ${bottomLeft.y}, ${bottomLeft.x + r} ${bottomLeft.y - r * 0.5}
        L ${top.x - r * 0.5} ${top.y + r * 0.3}
        Q ${top.x} ${top.y}, ${top.x} ${top.y + r}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate an arrow shape
 */
function generateArrowPath(
    cx: number,
    cy: number,
    s: number,
    params: NegativeSpaceParams,
    rng: () => number
): string {
    const sharpness = params.sharpness;
    const stemWidth = s * (0.3 + (1 - sharpness) * 0.2);

    const points: Point[] = [
        { x: cx, y: cy - s },                    // Top point
        { x: cx + s * 0.8, y: cy },              // Right wing
        { x: cx + stemWidth, y: cy },            // Right stem top
        { x: cx + stemWidth, y: cy + s * 0.7 },  // Right stem bottom
        { x: cx - stemWidth, y: cy + s * 0.7 },  // Left stem bottom
        { x: cx - stemWidth, y: cy },            // Left stem top
        { x: cx - s * 0.8, y: cy },              // Left wing
    ];

    return createBezierPolygonPath(points, params.curveTension * 0.2);
}

/**
 * Generate a chevron shape
 */
function generateChevronPath(
    cx: number,
    cy: number,
    s: number,
    params: NegativeSpaceParams,
    rng: () => number
): string {
    const thickness = s * 0.3 * (1 + (1 - params.sharpness) * 0.3);

    const outerPoints: Point[] = [
        { x: cx, y: cy - s * 0.8 },
        { x: cx + s * 0.9, y: cy + s * 0.3 },
        { x: cx, y: cy + s * 0.8 },
        { x: cx - s * 0.9, y: cy + s * 0.3 },
    ];

    const innerPoints: Point[] = [
        { x: cx, y: cy - s * 0.8 + thickness },
        { x: cx + s * 0.5, y: cy + s * 0.1 },
        { x: cx, y: cy + s * 0.5 },
        { x: cx - s * 0.5, y: cy + s * 0.1 },
    ];

    const outerPath = createBezierPolygonPath(outerPoints, params.curveTension * 0.3);
    const innerPath = createBezierPolygonPath(innerPoints, params.curveTension * 0.3);

    return `${outerPath} ${innerPath}`;
}

/**
 * Generate a custom abstract shape
 */
function generateCustomPath(
    cx: number,
    cy: number,
    s: number,
    params: NegativeSpaceParams,
    rng: () => number
): string {
    // Create an abstract shape based on seed
    const numPoints = 5 + Math.floor(rng() * 3);
    const points: Point[] = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        const radiusVariation = 0.7 + rng() * 0.6;
        const r = s * radiusVariation;

        points.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
        });
    }

    return createBezierPolygonPath(points, params.curveTension * 0.5);
}

/**
 * Generate the negative space (cutout)
 */
function generateNegativeShape(
    params: NegativeSpaceParams,
    cx: number,
    cy: number,
    size: number,
    rng: () => number
): string {
    const s = size * 0.4 * params.negativeReveal;
    const offsetX = (params.balanceRatio - 0.5) * size * 0.3;
    const offsetY = size * 0.05;

    // Create complementary negative shape
    const ncx = cx + offsetX;
    const ncy = cy + offsetY;

    switch (params.positiveShape) {
        case 'triangle':
            // Hidden arrow in triangle
            return generateHiddenArrowPath(ncx, ncy, s, params, rng);

        case 'arrow':
            // Hidden triangle in arrow
            return generateTrianglePath(ncx, ncy, s * 0.6, params, rng);

        case 'chevron':
            // Inner chevron void
            return generateInnerVoidPath(ncx, ncy, s, params, rng);

        case 'custom':
        default:
            return generateAbstractVoidPath(ncx, ncy, s, params, rng);
    }
}

/**
 * Generate hidden arrow (like FedEx)
 */
function generateHiddenArrowPath(
    cx: number,
    cy: number,
    s: number,
    params: NegativeSpaceParams,
    rng: () => number
): string {
    const points: Point[] = [
        { x: cx - s * 0.3, y: cy - s * 0.4 },
        { x: cx + s * 0.4, y: cy },
        { x: cx - s * 0.3, y: cy + s * 0.4 },
    ];

    return createBezierPolygonPath(points, params.curveTension * 0.3);
}

/**
 * Generate inner void shape
 */
function generateInnerVoidPath(
    cx: number,
    cy: number,
    s: number,
    params: NegativeSpaceParams,
    rng: () => number
): string {
    const points: Point[] = [
        { x: cx, y: cy - s * 0.5 },
        { x: cx + s * 0.4, y: cy + s * 0.2 },
        { x: cx, y: cy + s * 0.5 },
        { x: cx - s * 0.4, y: cy + s * 0.2 },
    ];

    return createBezierPolygonPath(points, params.curveTension * 0.4);
}

/**
 * Generate abstract void shape
 */
function generateAbstractVoidPath(
    cx: number,
    cy: number,
    s: number,
    params: NegativeSpaceParams,
    rng: () => number
): string {
    const numPoints = 4 + Math.floor(rng() * 2);
    const points: Point[] = [];

    for (let i = 0; i < numPoints; i++) {
        const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
        const r = s * (0.3 + rng() * 0.4);

        points.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
        });
    }

    return createBezierPolygonPath(points, params.curveTension * 0.5);
}

/**
 * Create a smooth bezier polygon path
 */
function createBezierPolygonPath(points: Point[], tension: number): string {
    if (points.length < 3) return '';

    const path: string[] = [];
    const n = points.length;

    path.push(`M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`);

    for (let i = 0; i < n; i++) {
        const p0 = points[(i - 1 + n) % n];
        const p1 = points[i];
        const p2 = points[(i + 1) % n];
        const p3 = points[(i + 2) % n];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

        path.push(
            `C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
        );
    }

    path.push('Z');
    return path.join(' ');
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateNegativeSpace(params: LogoGenerationParams): GeneratedLogo[] {
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
        const variantSeed = `${seed}-negative-space-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateNegativeSpaceParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('negative-space', v);

        // Generate shapes
        const positivePath = generatePositiveShape(algoParams, cx, cy, size, rng);
        const negativePath = generateNegativeShape(algoParams, cx, cy, size, rng);

        // Add gradients
        const positiveGradId = `${uniqueId}-positive`;
        const negativeGradId = `${uniqueId}-negative`;

        svg.addGradient(positiveGradId, {
            type: 'linear',
            angle: 135,
            stops: [
                { offset: 0, color: primaryColor },
                { offset: 1, color: accentColor || darken(primaryColor, 20) },
            ],
        });

        if (algoParams.dualTone) {
            svg.addGradient(negativeGradId, {
                type: 'linear',
                angle: 135,
                stops: [
                    { offset: 0, color: accentColor || lighten(primaryColor, 30) },
                    { offset: 1, color: lighten(primaryColor, 20) },
                ],
            });
        }

        // Render using fill-rule evenodd for cutout effect
        const combinedPath = `${positivePath} ${negativePath}`;

        svg.path(combinedPath, {
            fill: `url(#${positiveGradId})`,
            'fill-rule': 'evenodd',
        });

        // Optional: render negative as separate colored element
        if (algoParams.dualTone && algoParams.innerContrast > 0.7) {
            svg.path(negativePath, {
                fill: `url(#${negativeGradId})`,
            });
        }

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'negative-space', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'negative-space',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'negative-space',
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
                    symmetry: 'bilateral',
                    pathCount: 2,
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

export function generateSingleNegativeSpace(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<NegativeSpaceParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateNegativeSpaceParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);

    const positivePath = generatePositiveShape(params, size / 2, size / 2, size, rng);
    const negativePath = generateNegativeShape(params, size / 2, size / 2, size, rng);

    svg.addGradient('main', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 20) },
        ],
    });

    svg.path(`${positivePath} ${negativePath}`, {
        fill: 'url(#main)',
        'fill-rule': 'evenodd',
    });

    return svg.build();
}
