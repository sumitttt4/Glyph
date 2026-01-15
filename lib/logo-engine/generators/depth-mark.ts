/**
 * Depth Mark Generator (Raycast-style)
 *
 * Creates 3D depth effect marks with layered extrusion
 * Inspired by Raycast and isometric design systems
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    DepthMarkParams,
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

function generateDepthMarkParams(rng: () => number): DepthMarkParams {
    const base = generateBaseParams(rng);
    return {
        ...base,
        depthLayers: 2 + Math.floor(rng() * 3),           // 2-4 layers
        depthOffset: 3 + rng() * 8,                       // 3-11
        depthAngle: (rng() - 0.5) * 60,                   // -30 to 30
        perspectiveStrength: 0.3 + rng() * 0.5,           // 0.3-0.8
        shadowIntensity: 0.3 + rng() * 0.5,               // 0.3-0.8
        extrusionDepth: 8 + rng() * 18,                   // 8-26
        lightDirection: rng() * 360,                      // 0-360
        surfaceDetail: rng() * 0.6,                       // 0-0.6
    };
}

// ============================================
// BASE SHAPE GENERATION
// ============================================

type BaseShapeType = 'triangle' | 'diamond' | 'hexagon' | 'arrow' | 'chevron';

/**
 * Generate the base 2D shape path
 */
function generateBaseShapePath(
    shapeType: BaseShapeType,
    cx: number,
    cy: number,
    size: number,
    params: DepthMarkParams,
    rng: () => number
): { path: string; points: Point[] } {
    const s = size * 0.35;
    let points: Point[] = [];

    switch (shapeType) {
        case 'triangle':
            points = [
                { x: cx, y: cy - s },
                { x: cx + s * 0.9, y: cy + s * 0.7 },
                { x: cx - s * 0.9, y: cy + s * 0.7 },
            ];
            break;

        case 'diamond':
            points = [
                { x: cx, y: cy - s },
                { x: cx + s * 0.8, y: cy },
                { x: cx, y: cy + s },
                { x: cx - s * 0.8, y: cy },
            ];
            break;

        case 'hexagon':
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
                points.push({
                    x: cx + Math.cos(angle) * s * 0.9,
                    y: cy + Math.sin(angle) * s * 0.9,
                });
            }
            break;

        case 'arrow':
            points = [
                { x: cx, y: cy - s },
                { x: cx + s * 0.7, y: cy },
                { x: cx + s * 0.3, y: cy },
                { x: cx + s * 0.3, y: cy + s * 0.8 },
                { x: cx - s * 0.3, y: cy + s * 0.8 },
                { x: cx - s * 0.3, y: cy },
                { x: cx - s * 0.7, y: cy },
            ];
            break;

        case 'chevron':
        default:
            points = [
                { x: cx - s * 0.8, y: cy - s * 0.3 },
                { x: cx, y: cy - s * 0.8 },
                { x: cx + s * 0.8, y: cy - s * 0.3 },
                { x: cx + s * 0.4, y: cy - s * 0.3 },
                { x: cx, y: cy - s * 0.5 },
                { x: cx - s * 0.4, y: cy - s * 0.3 },
            ];
            break;
    }

    // Add noise to points
    points = points.map(p => ({
        x: addNoise(p.x, params.noiseAmount * 0.5, rng, 2),
        y: addNoise(p.y, params.noiseAmount * 0.5, rng, 2),
    }));

    // Create smooth bezier path
    const path = createSmoothShapePath(points, params.curveTension * 0.3);

    return { path, points };
}

/**
 * Create a smooth path with bezier curves
 */
function createSmoothShapePath(points: Point[], tension: number): string {
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
// DEPTH EXTRUSION
// ============================================

/**
 * Generate extruded depth layers
 */
function generateExtrusionPath(
    points: Point[],
    params: DepthMarkParams,
    layerIndex: number,
    totalLayers: number
): string {
    const depthAngleRad = (params.depthAngle * Math.PI) / 180;
    const lightAngleRad = (params.lightDirection * Math.PI) / 180;

    const offsetX = Math.cos(depthAngleRad) * params.depthOffset * layerIndex;
    const offsetY = Math.sin(depthAngleRad) * params.depthOffset * layerIndex + params.depthOffset * layerIndex * 0.5;

    // Apply perspective if enabled
    const perspectiveScale = 1 - (layerIndex / totalLayers) * params.perspectiveStrength * 0.1;

    const offsetPoints = points.map(p => ({
        x: p.x + offsetX,
        y: p.y + offsetY,
    }));

    return createSmoothShapePath(offsetPoints, 0.2);
}

/**
 * Generate side faces for the extrusion (connecting layers)
 */
function generateSideFaces(
    topPoints: Point[],
    bottomPoints: Point[],
    params: DepthMarkParams
): string[] {
    const faces: string[] = [];
    const n = topPoints.length;

    for (let i = 0; i < n; i++) {
        const t1 = topPoints[i];
        const t2 = topPoints[(i + 1) % n];
        const b1 = bottomPoints[i];
        const b2 = bottomPoints[(i + 1) % n];

        // Create smooth face with bezier curves
        const face = `
            M ${t1.x.toFixed(2)} ${t1.y.toFixed(2)}
            L ${t2.x.toFixed(2)} ${t2.y.toFixed(2)}
            L ${b2.x.toFixed(2)} ${b2.y.toFixed(2)}
            L ${b1.x.toFixed(2)} ${b1.y.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

        faces.push(face);
    }

    return faces;
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateDepthMark(params: LogoGenerationParams): GeneratedLogo[] {
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

    const shapeTypes: BaseShapeType[] = ['triangle', 'diamond', 'hexagon', 'arrow', 'chevron'];

    for (let v = 0; v < variations; v++) {
        const variantSeed = `${seed}-depth-mark-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateDepthMarkParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('depth-mark', v);

        // Select shape type based on seed
        const shapeType = shapeTypes[Math.floor(rng() * shapeTypes.length)];

        // Generate base shape
        const { path: basePath, points: basePoints } = generateBaseShapePath(
            shapeType,
            cx,
            cy,
            size,
            algoParams,
            rng
        );

        // Calculate depth direction
        const depthAngleRad = (algoParams.depthAngle * Math.PI) / 180;

        // Generate layers from back to front
        for (let layer = algoParams.depthLayers - 1; layer >= 0; layer--) {
            const isTopLayer = layer === 0;
            const layerProgress = layer / (algoParams.depthLayers - 1 || 1);

            // Calculate offset for this layer
            const offsetX = Math.cos(depthAngleRad) * algoParams.depthOffset * layer;
            const offsetY = algoParams.depthOffset * layer * 0.7;

            const layerPoints = basePoints.map(p => ({
                x: p.x + offsetX,
                y: p.y + offsetY,
            }));

            const layerPath = createSmoothShapePath(layerPoints, algoParams.curveTension * 0.3);
            const gradId = `${uniqueId}-layer-${layer}`;

            // Color gets darker for back layers
            const layerColor = isTopLayer
                ? primaryColor
                : darken(primaryColor, algoParams.shadowIntensity * 40 * layerProgress);

            svg.addGradient(gradId, {
                type: 'linear',
                angle: algoParams.lightDirection,
                stops: [
                    { offset: 0, color: isTopLayer ? lighten(layerColor, 10) : layerColor },
                    { offset: 1, color: isTopLayer
                        ? (accentColor || darken(primaryColor, 10))
                        : darken(layerColor, 15) },
                ],
            });

            // Draw side faces for non-top layers
            if (!isTopLayer) {
                const prevLayerPoints = basePoints.map(p => ({
                    x: p.x + Math.cos(depthAngleRad) * algoParams.depthOffset * (layer - 1),
                    y: p.y + algoParams.depthOffset * (layer - 1) * 0.7,
                }));

                const sideFaces = generateSideFaces(prevLayerPoints, layerPoints, algoParams);
                const sideGradId = `${uniqueId}-side-${layer}`;

                svg.addGradient(sideGradId, {
                    type: 'linear',
                    angle: algoParams.lightDirection + 90,
                    stops: [
                        { offset: 0, color: darken(primaryColor, 25 + layerProgress * 15) },
                        { offset: 1, color: darken(primaryColor, 40 + layerProgress * 15) },
                    ],
                });

                sideFaces.forEach(face => {
                    svg.path(face, { fill: `url(#${sideGradId})` });
                });
            }

            svg.path(layerPath, { fill: `url(#${gradId})` });
        }

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'depth-mark', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'depth-mark',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'depth-mark',
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
                    pathCount: algoParams.depthLayers * 2,
                    complexity: calculateComplexity(svgString),
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: [primaryColor, darken(primaryColor, 30), accentColor || darken(primaryColor, 15)],
                },
            },
        });
    }

    return logos;
}

export function generateSingleDepthMark(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<DepthMarkParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateDepthMarkParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);

    const shapeTypes: BaseShapeType[] = ['triangle', 'diamond', 'hexagon', 'arrow', 'chevron'];
    const shapeType = shapeTypes[Math.floor(rng() * shapeTypes.length)];

    const { points: basePoints } = generateBaseShapePath(shapeType, size / 2, size / 2, size, params, rng);
    const depthAngleRad = (params.depthAngle * Math.PI) / 180;

    for (let layer = params.depthLayers - 1; layer >= 0; layer--) {
        const offsetX = Math.cos(depthAngleRad) * params.depthOffset * layer;
        const offsetY = params.depthOffset * layer * 0.7;
        const layerProgress = layer / (params.depthLayers - 1 || 1);

        const layerPoints = basePoints.map(p => ({
            x: p.x + offsetX,
            y: p.y + offsetY,
        }));

        const color = layer === 0 ? primaryColor : darken(primaryColor, 30 * layerProgress);
        svg.path(createSmoothShapePath(layerPoints, params.curveTension * 0.3), { fill: color });
    }

    return svg.build();
}
