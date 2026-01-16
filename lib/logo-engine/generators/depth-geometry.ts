/**
 * Depth Geometry Generator (Raycast-style)
 *
 * Creates abstract geometric shapes with depth/shadow effects
 * 3D isometric feel, layered extrusion
 * Uses bezier paths for smooth edges
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    DepthGeometryParams,
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

function generateDepthGeometryParams(hashParams: HashParams, rng: () => number): DepthGeometryParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const shapeTypes: Array<'cube' | 'prism' | 'pyramid' | 'abstract'> =
        ['cube', 'prism', 'pyramid', 'abstract'];

    return {
        ...base,
        shapeType: shapeTypes[derived.styleVariant % 4],
        depthLayers: Math.max(2, Math.min(5, derived.layerCount + 1)),
        depthOffset: Math.max(3, Math.min(15, derived.depthOffset)),
        perspectiveAngle: (derived.rotationOffset - 180) / 6,
        shadowIntensity: derived.organicAmount,
        lightDirection: derived.gradientAngle,
    };
}

// ============================================
// SHAPE GENERATION
// ============================================

/**
 * Create a 3D cube face using bezier curves
 */
function createCubePaths(
    cx: number,
    cy: number,
    size: number,
    depthOffset: number,
    perspectiveAngle: number
): { top: string; left: string; right: string } {
    const halfSize = size / 2;
    const angleRad = (perspectiveAngle * Math.PI) / 180;
    const dx = depthOffset * Math.cos(angleRad);
    const dy = depthOffset * Math.sin(angleRad);

    // Top face (parallelogram)
    const topPoints: Point[] = [
        { x: cx, y: cy - halfSize },
        { x: cx + halfSize, y: cy - halfSize + halfSize * 0.3 },
        { x: cx + halfSize + dx, y: cy - halfSize + halfSize * 0.3 - dy },
        { x: cx + dx, y: cy - halfSize - dy },
    ];

    // Left face
    const leftPoints: Point[] = [
        { x: cx, y: cy - halfSize },
        { x: cx + dx, y: cy - halfSize - dy },
        { x: cx + dx, y: cy + halfSize - dy },
        { x: cx, y: cy + halfSize },
    ];

    // Right face
    const rightPoints: Point[] = [
        { x: cx, y: cy - halfSize },
        { x: cx + halfSize, y: cy - halfSize + halfSize * 0.3 },
        { x: cx + halfSize, y: cy + halfSize + halfSize * 0.3 },
        { x: cx, y: cy + halfSize },
    ];

    return {
        top: createSmoothPolygon(topPoints),
        left: createSmoothPolygon(leftPoints),
        right: createSmoothPolygon(rightPoints),
    };
}

/**
 * Create a prism shape with depth
 */
function createPrismPaths(
    cx: number,
    cy: number,
    size: number,
    depthOffset: number
): { front: string; side: string; top: string } {
    const halfSize = size / 2;

    // Front triangle
    const frontPoints: Point[] = [
        { x: cx, y: cy - halfSize },
        { x: cx - halfSize * 0.8, y: cy + halfSize * 0.6 },
        { x: cx + halfSize * 0.8, y: cy + halfSize * 0.6 },
    ];

    // Side face
    const sidePoints: Point[] = [
        { x: cx + halfSize * 0.8, y: cy + halfSize * 0.6 },
        { x: cx, y: cy - halfSize },
        { x: cx + depthOffset, y: cy - halfSize - depthOffset * 0.3 },
        { x: cx + halfSize * 0.8 + depthOffset, y: cy + halfSize * 0.6 - depthOffset * 0.3 },
    ];

    // Top edge
    const topPoints: Point[] = [
        { x: cx, y: cy - halfSize },
        { x: cx + depthOffset, y: cy - halfSize - depthOffset * 0.3 },
        { x: cx - halfSize * 0.8 + depthOffset, y: cy + halfSize * 0.6 - depthOffset * 0.3 },
        { x: cx - halfSize * 0.8, y: cy + halfSize * 0.6 },
    ];

    return {
        front: createSmoothPolygon(frontPoints),
        side: createSmoothPolygon(sidePoints),
        top: createSmoothPolygon(topPoints),
    };
}

/**
 * Create an abstract layered shape
 */
function createAbstractPaths(
    cx: number,
    cy: number,
    size: number,
    depthOffset: number,
    layers: number
): string[] {
    const paths: string[] = [];
    const baseSize = size * 0.8;

    for (let i = 0; i < layers; i++) {
        const layerOffset = i * (depthOffset / layers);
        const layerSize = baseSize * (1 - i * 0.1);
        const points: Point[] = [];

        // Create organic polygon with 5-7 sides
        const sides = 5 + (i % 3);
        for (let j = 0; j < sides; j++) {
            const angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
            const variation = 0.8 + Math.sin(angle * 2 + i) * 0.2;
            const r = (layerSize / 2) * variation;
            points.push({
                x: cx + Math.cos(angle) * r + layerOffset,
                y: cy + Math.sin(angle) * r - layerOffset * 0.5,
            });
        }

        paths.push(createSmoothPolygon(points));
    }

    return paths;
}

/**
 * Create smooth polygon using bezier curves
 */
function createSmoothPolygon(points: Point[]): string {
    if (points.length < 3) return '';

    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        // Use quadratic bezier for slight curve
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        path += ` Q ${midX.toFixed(2)} ${midY.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    path += ' Z';
    return path;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleDepthGeometry(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateDepthGeometryParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('depth-geometry', variant);

    // Color variations for 3D effect
    const lightColor = lighten(primaryColor, 20);
    const midColor = primaryColor;
    const darkColor = darken(primaryColor, 25);
    const shadowColor = darken(primaryColor, 40);

    switch (algoParams.shapeType) {
        case 'cube': {
            const cube = createCubePaths(cx, cy, size * 0.6, algoParams.depthOffset, algoParams.perspectiveAngle);

            svg.addGradient(`${uniqueId}-top`, {
                type: 'linear',
                angle: 0,
                stops: [
                    { offset: 0, color: lightColor },
                    { offset: 1, color: mixColors(lightColor, midColor, 0.3) },
                ],
            });

            svg.addGradient(`${uniqueId}-left`, {
                type: 'linear',
                angle: 90,
                stops: [
                    { offset: 0, color: darkColor },
                    { offset: 1, color: shadowColor },
                ],
            });

            svg.addGradient(`${uniqueId}-right`, {
                type: 'linear',
                angle: 45,
                stops: [
                    { offset: 0, color: midColor },
                    { offset: 1, color: accentColor || darkColor },
                ],
            });

            svg.path(cube.left, { fill: `url(#${uniqueId}-left)` });
            svg.path(cube.right, { fill: `url(#${uniqueId}-right)` });
            svg.path(cube.top, { fill: `url(#${uniqueId}-top)` });
            break;
        }

        case 'prism': {
            const prism = createPrismPaths(cx, cy, size * 0.7, algoParams.depthOffset);

            svg.addGradient(`${uniqueId}-front`, {
                type: 'linear',
                angle: 180,
                stops: [
                    { offset: 0, color: lightColor },
                    { offset: 1, color: midColor },
                ],
            });

            svg.addGradient(`${uniqueId}-side`, {
                type: 'linear',
                angle: 45,
                stops: [
                    { offset: 0, color: midColor },
                    { offset: 1, color: darkColor },
                ],
            });

            svg.path(prism.top, { fill: darkColor });
            svg.path(prism.side, { fill: `url(#${uniqueId}-side)` });
            svg.path(prism.front, { fill: `url(#${uniqueId}-front)` });
            break;
        }

        case 'abstract':
        default: {
            const layers = createAbstractPaths(cx, cy, size * 0.8, algoParams.depthOffset, algoParams.depthLayers);

            layers.forEach((layerPath, i) => {
                const t = i / (layers.length - 1);
                const layerColor = mixColors(darkColor, lightColor, t);

                svg.addGradient(`${uniqueId}-layer-${i}`, {
                    type: 'linear',
                    angle: 135,
                    stops: [
                        { offset: 0, color: lighten(layerColor, 10) },
                        { offset: 1, color: mixColors(layerColor, accentColor || darkColor, 0.3) },
                    ],
                });

                svg.path(layerPath, { fill: `url(#${uniqueId}-layer-${i})` });
            });
            break;
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'depth-geometry', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'depth-geometry',
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
                pathCount: algoParams.shapeType === 'abstract' ? algoParams.depthLayers : 3,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [lightColor, midColor, darkColor],
            },
        },
    };

    return { logo, quality };
}

export function generateDepthGeometry(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleDepthGeometry(params, hashParams, v);

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
                algorithm: 'depth-geometry',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleDepthGeometryPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateDepthGeometryParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const layers = createAbstractPaths(size / 2, size / 2, size * 0.8, params.depthOffset, params.depthLayers);

    layers.forEach((layerPath, i) => {
        const t = i / (layers.length - 1);
        svg.addGradient(`layer-${i}`, {
            type: 'linear',
            angle: 135,
            stops: [
                { offset: 0, color: lighten(primaryColor, t * 20) },
                { offset: 1, color: darken(primaryColor, (1 - t) * 20) },
            ],
        });
        svg.path(layerPath, { fill: `url(#layer-${i})` });
    });

    return svg.build();
}
