/**
 * Isometric Cube Generator (Pitch-style)
 *
 * Creates 3D isometric cube letterform
 * Clean geometric with depth
 * Uses bezier paths for smooth edges
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    IsometricCubeParams,
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

function generateIsometricCubeParams(hashParams: HashParams, rng: () => number): IsometricCubeParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const cubeStyles: Array<'solid' | 'wireframe' | 'partial'> = ['solid', 'wireframe', 'partial'];
    const letterPlacements: Array<'front' | 'side' | 'integrated'> = ['front', 'side', 'integrated'];

    return {
        ...base,
        cubeStyle: cubeStyles[derived.styleVariant % 3],
        cubeAngle: Math.max(25, Math.min(35, 30 + (derived.rotationOffset - 180) / 36)),
        faceVisibility: [
            true,
            derived.layerCount > 2,
            derived.layerCount > 1,
        ],
        letterPlacement: letterPlacements[Math.floor(derived.colorPlacement / 3) % 3],
        extrusionDepth: Math.max(10, Math.min(30, derived.extrusionDepth)),
        letterScale: Math.max(0.4, Math.min(0.7, 0.5 + derived.scaleFactor * 0.1)),
    };
}

// ============================================
// ISOMETRIC PROJECTION
// ============================================

/**
 * Convert 3D point to 2D isometric projection
 */
function toIsometric(x: number, y: number, z: number, angle: number): Point {
    const angleRad = (angle * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    return {
        x: (x - z) * cos,
        y: y * 0.5 + (x + z) * sin * 0.5,
    };
}

/**
 * Create isometric cube faces
 */
function createCubeFaces(
    cx: number,
    cy: number,
    size: number,
    depth: number,
    angle: number,
    faceVisibility: [boolean, boolean, boolean]
): { top: string; left: string; right: string } {
    const halfSize = size / 2;

    // Cube vertices in 3D space
    const vertices3D = {
        frontTopLeft: { x: -halfSize, y: -halfSize, z: depth / 2 },
        frontTopRight: { x: halfSize, y: -halfSize, z: depth / 2 },
        frontBottomLeft: { x: -halfSize, y: halfSize, z: depth / 2 },
        frontBottomRight: { x: halfSize, y: halfSize, z: depth / 2 },
        backTopLeft: { x: -halfSize, y: -halfSize, z: -depth / 2 },
        backTopRight: { x: halfSize, y: -halfSize, z: -depth / 2 },
        backBottomLeft: { x: -halfSize, y: halfSize, z: -depth / 2 },
        backBottomRight: { x: halfSize, y: halfSize, z: -depth / 2 },
    };

    // Project to 2D and offset to center
    const project = (p: { x: number; y: number; z: number }) => {
        const iso = toIsometric(p.x, p.y, p.z, angle);
        return { x: cx + iso.x, y: cy + iso.y };
    };

    const v = {
        ftl: project(vertices3D.frontTopLeft),
        ftr: project(vertices3D.frontTopRight),
        fbl: project(vertices3D.frontBottomLeft),
        fbr: project(vertices3D.frontBottomRight),
        btl: project(vertices3D.backTopLeft),
        btr: project(vertices3D.backTopRight),
        bbl: project(vertices3D.backBottomLeft),
        bbr: project(vertices3D.backBottomRight),
    };

    // Create face paths using bezier (with minimal curvature for crisp edges)
    const createFace = (points: Point[]): string => {
        if (points.length < 3) return '';
        let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            // Slight bezier for smooth edges
            const midX = (prev.x + curr.x) / 2;
            const midY = (prev.y + curr.y) / 2;
            path += ` Q ${midX.toFixed(2)} ${midY.toFixed(2)}, ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
        }
        const last = points[points.length - 1];
        const first = points[0];
        const midX = (last.x + first.x) / 2;
        const midY = (last.y + first.y) / 2;
        path += ` Q ${midX.toFixed(2)} ${midY.toFixed(2)}, ${first.x.toFixed(2)} ${first.y.toFixed(2)}`;
        path += ' Z';
        return path;
    };

    return {
        // Top face
        top: faceVisibility[0] ? createFace([v.ftl, v.ftr, v.btr, v.btl]) : '',
        // Left face
        left: faceVisibility[1] ? createFace([v.ftl, v.btl, v.bbl, v.fbl]) : '',
        // Right/Front face
        right: faceVisibility[2] ? createFace([v.ftr, v.fbr, v.bbr, v.btr]) : '',
    };
}

/**
 * Create simple letter for cube face
 */
function createCubeLetter(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    placement: 'front' | 'side' | 'integrated'
): string {
    const char = letter.toUpperCase().charAt(0);
    const halfSize = size / 2;

    // Offset based on placement for 3D effect
    let offsetX = 0;
    let offsetY = 0;
    let scale = 1;

    if (placement === 'side') {
        offsetX = -size * 0.15;
        scale = 0.9;
    } else if (placement === 'integrated') {
        offsetY = -size * 0.1;
        scale = 0.85;
    }

    const scaledSize = halfSize * scale;
    const x = cx + offsetX;
    const y = cy + offsetY;

    // Simple geometric letter shapes
    switch (char) {
        case 'A':
            return `
                M ${x - scaledSize * 0.4} ${y + scaledSize * 0.6}
                L ${x} ${y - scaledSize * 0.6}
                L ${x + scaledSize * 0.4} ${y + scaledSize * 0.6}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'P':
        case 'B':
        case 'D':
            return `
                M ${x - scaledSize * 0.3} ${y - scaledSize * 0.6}
                L ${x + scaledSize * 0.1} ${y - scaledSize * 0.6}
                C ${x + scaledSize * 0.4} ${y - scaledSize * 0.6}, ${x + scaledSize * 0.4} ${y + scaledSize * 0.6}, ${x + scaledSize * 0.1} ${y + scaledSize * 0.6}
                L ${x - scaledSize * 0.3} ${y + scaledSize * 0.6}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'G':
        case 'C':
        case 'O':
            const r = scaledSize * 0.5;
            const k = 0.5522847498;
            return `
                M ${x} ${y - r}
                C ${x + r * k} ${y - r}, ${x + r} ${y - r * k}, ${x + r} ${y}
                C ${x + r} ${y + r * k}, ${x + r * k} ${y + r}, ${x} ${y + r}
                C ${x - r * k} ${y + r}, ${x - r} ${y + r * k}, ${x - r} ${y}
                C ${x - r} ${y - r * k}, ${x - r * k} ${y - r}, ${x} ${y - r}
                Z
            `.replace(/\s+/g, ' ').trim();

        default:
            // Default square
            return `
                M ${x - scaledSize * 0.3} ${y - scaledSize * 0.5}
                L ${x + scaledSize * 0.3} ${y - scaledSize * 0.5}
                L ${x + scaledSize * 0.3} ${y + scaledSize * 0.5}
                L ${x - scaledSize * 0.3} ${y + scaledSize * 0.5}
                Z
            `.replace(/\s+/g, ' ').trim();
    }
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleIsometricCube(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateIsometricCubeParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('isometric-cube', variant);

    // Color variations for 3D effect
    const topColor = lighten(primaryColor, 20);
    const leftColor = darken(primaryColor, 15);
    const rightColor = primaryColor;
    const letterColor = accentColor || darken(primaryColor, 30);

    // Create cube faces
    const cubeSize = size * 0.6;
    const faces = createCubeFaces(cx, cy, cubeSize, algoParams.extrusionDepth, algoParams.cubeAngle, algoParams.faceVisibility);

    // Create gradients for each face
    svg.addGradient(`${uniqueId}-top`, {
        type: 'linear',
        angle: 0,
        stops: [
            { offset: 0, color: topColor },
            { offset: 1, color: mixColors(topColor, primaryColor, 0.3) },
        ],
    });

    svg.addGradient(`${uniqueId}-left`, {
        type: 'linear',
        angle: 90,
        stops: [
            { offset: 0, color: leftColor },
            { offset: 1, color: darken(leftColor, 10) },
        ],
    });

    svg.addGradient(`${uniqueId}-right`, {
        type: 'linear',
        angle: 45,
        stops: [
            { offset: 0, color: rightColor },
            { offset: 1, color: mixColors(rightColor, accentColor || darken(primaryColor, 10), 0.5) },
        ],
    });

    // Render faces based on style
    if (algoParams.cubeStyle === 'wireframe') {
        // Wireframe style
        if (faces.top) svg.path(faces.top, { fill: 'none', stroke: primaryColor, 'stroke-width': '2' });
        if (faces.left) svg.path(faces.left, { fill: 'none', stroke: primaryColor, 'stroke-width': '2' });
        if (faces.right) svg.path(faces.right, { fill: 'none', stroke: primaryColor, 'stroke-width': '2' });
    } else {
        // Solid or partial style
        if (faces.left) svg.path(faces.left, { fill: `url(#${uniqueId}-left)` });
        if (faces.right) svg.path(faces.right, { fill: `url(#${uniqueId}-right)` });
        if (faces.top) svg.path(faces.top, { fill: `url(#${uniqueId}-top)` });
    }

    // Add letter if integrated or visible
    if (algoParams.letterPlacement !== 'integrated' || algoParams.cubeStyle !== 'wireframe') {
        const letter = brandName.charAt(0).toUpperCase();
        const letterSize = cubeSize * algoParams.letterScale;
        const letterPath = createCubeLetter(letter, cx, cy, letterSize, algoParams.letterPlacement);

        svg.addGradient(`${uniqueId}-letter`, {
            type: 'linear',
            angle: 135,
            stops: [
                { offset: 0, color: letterColor },
                { offset: 1, color: darken(letterColor, 15) },
            ],
        });

        svg.path(letterPath, { fill: `url(#${uniqueId}-letter)` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'isometric-cube', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'isometric-cube',
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
                symmetry: 'none',
                pathCount: 4,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [topColor, rightColor, leftColor],
            },
        },
    };

    return { logo, quality };
}

export function generateIsometricCube(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleIsometricCube(params, hashParams, v);

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
                algorithm: 'isometric-cube',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleIsometricCubePreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateIsometricCubeParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const faces = createCubeFaces(size / 2, size / 2, size * 0.6, params.extrusionDepth, params.cubeAngle, params.faceVisibility);

    svg.addGradient('top', {
        type: 'linear',
        angle: 0,
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 1, color: primaryColor },
        ],
    });

    svg.addGradient('left', {
        type: 'linear',
        angle: 90,
        stops: [
            { offset: 0, color: darken(primaryColor, 15) },
            { offset: 1, color: darken(primaryColor, 25) },
        ],
    });

    svg.addGradient('right', {
        type: 'linear',
        angle: 45,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 10) },
        ],
    });

    if (faces.left) svg.path(faces.left, { fill: 'url(#left)' });
    if (faces.right) svg.path(faces.right, { fill: 'url(#right)' });
    if (faces.top) svg.path(faces.top, { fill: 'url(#top)' });

    return svg.build();
}
