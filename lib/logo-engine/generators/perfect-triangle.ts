/**
 * Perfect Triangle Generator (Vercel-style)
 *
 * Creates a single perfect geometric triangle
 * Clean, minimal, mathematically precise
 * Uses bezier paths (no polygon primitives)
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    PerfectTriangleParams,
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
    PHI,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generatePerfectTriangleParams(hashParams: HashParams, rng: () => number): PerfectTriangleParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const triangleTypes: Array<'equilateral' | 'isoceles' | 'right'> = ['equilateral', 'isoceles', 'right'];
    const fillStyles: Array<'solid' | 'gradient' | 'outline'> = ['solid', 'gradient', 'outline'];

    return {
        ...base,
        triangleType: triangleTypes[derived.styleVariant % 3],
        triangleSize: Math.max(60, Math.min(90, 75 + derived.scaleFactor * 10)),
        rotation: derived.rotationOffset,
        fillStyle: fillStyles[Math.floor(derived.colorPlacement / 3) % 3],
        outlineWidth: Math.max(2, Math.min(10, derived.strokeWidth)),
        innerCutout: derived.cutDepth > 0.5,
        cutoutScale: Math.max(0.3, Math.min(0.7, derived.cutDepth)),
    };
}

// ============================================
// TRIANGLE PATH GENERATION
// ============================================

/**
 * Calculate triangle vertices based on type
 */
function calculateTriangleVertices(
    params: PerfectTriangleParams,
    cx: number,
    cy: number,
    size: number
): Point[] {
    const halfSize = size / 2;
    let vertices: Point[];

    switch (params.triangleType) {
        case 'equilateral': {
            // Perfect equilateral triangle
            const height = halfSize * Math.sqrt(3);
            vertices = [
                { x: cx, y: cy - height * 0.6 },           // Top
                { x: cx - halfSize, y: cy + height * 0.4 }, // Bottom left
                { x: cx + halfSize, y: cy + height * 0.4 }, // Bottom right
            ];
            break;
        }
        case 'isoceles': {
            // Isoceles with golden ratio proportions
            const baseWidth = halfSize * PHI;
            const height = halfSize * 1.2;
            vertices = [
                { x: cx, y: cy - height * 0.5 },            // Top
                { x: cx - baseWidth / 2, y: cy + height * 0.5 }, // Bottom left
                { x: cx + baseWidth / 2, y: cy + height * 0.5 }, // Bottom right
            ];
            break;
        }
        case 'right': {
            // Right triangle
            vertices = [
                { x: cx - halfSize * 0.4, y: cy - halfSize * 0.5 }, // Top
                { x: cx - halfSize * 0.4, y: cy + halfSize * 0.5 }, // Bottom left
                { x: cx + halfSize * 0.6, y: cy + halfSize * 0.5 }, // Bottom right
            ];
            break;
        }
        default:
            vertices = [
                { x: cx, y: cy - halfSize },
                { x: cx - halfSize, y: cy + halfSize },
                { x: cx + halfSize, y: cy + halfSize },
            ];
    }

    // Apply rotation
    const angleRad = (params.rotation * Math.PI) / 180;
    return vertices.map(v => ({
        x: cx + (v.x - cx) * Math.cos(angleRad) - (v.y - cy) * Math.sin(angleRad),
        y: cy + (v.x - cx) * Math.sin(angleRad) + (v.y - cy) * Math.cos(angleRad),
    }));
}

/**
 * Create triangle path using bezier curves (with subtle curve on edges for premium feel)
 */
function createTrianglePath(
    vertices: Point[],
    curvature: number = 0.02 // Subtle curve for organic feel
): string {
    const [p1, p2, p3] = vertices;

    // Calculate midpoints with slight curve offset
    const mid12 = {
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    };
    const mid23 = {
        x: (p2.x + p3.x) / 2,
        y: (p2.y + p3.y) / 2,
    };
    const mid31 = {
        x: (p3.x + p1.x) / 2,
        y: (p3.y + p1.y) / 2,
    };

    // Centroid for curve direction
    const centroid = {
        x: (p1.x + p2.x + p3.x) / 3,
        y: (p1.y + p2.y + p3.y) / 3,
    };

    // Calculate control points (slight inward curve for organic feel)
    const curve12 = {
        x: mid12.x + (centroid.x - mid12.x) * curvature,
        y: mid12.y + (centroid.y - mid12.y) * curvature,
    };
    const curve23 = {
        x: mid23.x + (centroid.x - mid23.x) * curvature,
        y: mid23.y + (centroid.y - mid23.y) * curvature,
    };
    const curve31 = {
        x: mid31.x + (centroid.x - mid31.x) * curvature,
        y: mid31.y + (centroid.y - mid31.y) * curvature,
    };

    return `
        M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}
        Q ${curve12.x.toFixed(2)} ${curve12.y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}
        Q ${curve23.x.toFixed(2)} ${curve23.y.toFixed(2)}, ${p3.x.toFixed(2)} ${p3.y.toFixed(2)}
        Q ${curve31.x.toFixed(2)} ${curve31.y.toFixed(2)}, ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Create inner cutout triangle (scaled down from original)
 */
function createCutoutPath(vertices: Point[], scale: number): string {
    const centroid = {
        x: (vertices[0].x + vertices[1].x + vertices[2].x) / 3,
        y: (vertices[0].y + vertices[1].y + vertices[2].y) / 3,
    };

    const scaledVertices = vertices.map(v => ({
        x: centroid.x + (v.x - centroid.x) * scale,
        y: centroid.y + (v.y - centroid.y) * scale,
    }));

    return createTrianglePath(scaledVertices, 0.02);
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSinglePerfectTriangle(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generatePerfectTriangleParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('perfect-triangle', variant);

    // Calculate triangle size in pixels
    const triangleSize = (algoParams.triangleSize / 100) * size;
    const vertices = calculateTriangleVertices(algoParams, cx, cy, triangleSize);

    // Create gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: algoParams.rotation + 90,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    // Create the triangle path
    const trianglePath = createTrianglePath(vertices);

    if (algoParams.fillStyle === 'outline') {
        // Create outline by drawing outer and inner triangles
        const innerScale = 1 - (algoParams.outlineWidth / triangleSize) * 2;
        const innerPath = createCutoutPath(vertices, innerScale);

        // Combine paths for outline effect (outer minus inner)
        svg.path(trianglePath, { fill: `url(#${gradientId})` });
        svg.path(innerPath, { fill: '#ffffff' }); // White cutout (or could use mask)
    } else {
        // Solid or gradient fill
        svg.path(trianglePath, {
            fill: algoParams.fillStyle === 'gradient' ? `url(#${gradientId})` : primaryColor,
        });

        // Add inner cutout if enabled
        if (algoParams.innerCutout) {
            const cutoutPath = createCutoutPath(vertices, algoParams.cutoutScale);
            svg.path(cutoutPath, { fill: '#ffffff' });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'perfect-triangle', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'perfect-triangle',
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
                usesGoldenRatio: algoParams.triangleType === 'isoceles',
                gridBased: false,
                bezierCurves: true,
                symmetry: algoParams.triangleType === 'equilateral' ? 'rotational-3' as any : 'none',
                pathCount: algoParams.innerCutout || algoParams.fillStyle === 'outline' ? 2 : 1,
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

export function generatePerfectTriangle(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSinglePerfectTriangle(params, hashParams, v);

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
                algorithm: 'perfect-triangle',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSinglePerfectTrianglePreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generatePerfectTriangleParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const triangleSize = (params.triangleSize / 100) * size;
    const vertices = calculateTriangleVertices(params, size / 2, size / 2, triangleSize);

    svg.addGradient('main', {
        type: 'linear',
        angle: params.rotation + 90,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    svg.path(createTrianglePath(vertices), { fill: 'url(#main)' });

    return svg.build();
}
