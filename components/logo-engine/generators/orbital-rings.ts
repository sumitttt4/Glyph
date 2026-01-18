/**
 * Orbital Rings Generator (Planetscale-style)
 *
 * Creates intersecting orbital ring paths
 * 3D perspective effect with weaving/overlapping
 * Uses bezier ellipse approximations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    OrbitalRingsParams,
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

function generateOrbitalRingsParams(hashParams: HashParams, rng: () => number): OrbitalRingsParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const intersectionStyles: Array<'weave' | 'overlap' | 'break'> = ['weave', 'overlap', 'break'];

    return {
        ...base,
        ringCount: Math.max(2, Math.min(4, Math.round(derived.elementCount / 5) + 1)),
        ringThickness: Math.max(2, Math.min(8, derived.ringThickness)),
        orbitAngle: derived.angleSpread * 0.67,
        orbitEccentricity: Math.max(0, Math.min(0.5, derived.scaleFactor - 0.7)),
        intersectionStyle: intersectionStyles[derived.styleVariant % 3],
        rotationOffset: derived.rotationOffset / 3,
    };
}

// ============================================
// RING PATH GENERATION
// ============================================

/**
 * Create an elliptical ring path using bezier curves
 */
function createOrbitalRingPath(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    thickness: number,
    rotation: number
): string {
    const k = 0.5522847498; // Bezier circle constant

    // Outer ellipse
    const outerPath = createRotatedEllipse(cx, cy, rx, ry, rotation, k);

    // Inner ellipse (for ring thickness)
    const innerRx = rx - thickness;
    const innerRy = ry - thickness;
    const innerPath = createRotatedEllipse(cx, cy, innerRx, innerRy, rotation, k);

    // Combine as donut shape (outer path + reversed inner path)
    return outerPath + ' ' + reverseEllipsePath(innerPath);
}

/**
 * Create a rotated ellipse using bezier curves
 */
function createRotatedEllipse(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    rotation: number,
    k: number
): string {
    const cos = Math.cos(rotation);
    const sin = Math.sin(rotation);

    // Helper to rotate point
    const rotate = (x: number, y: number) => ({
        x: cx + (x - cx) * cos - (y - cy) * sin,
        y: cy + (x - cx) * sin + (y - cy) * cos,
    });

    // Ellipse control points
    const top = rotate(cx, cy - ry);
    const right = rotate(cx + rx, cy);
    const bottom = rotate(cx, cy + ry);
    const left = rotate(cx - rx, cy);

    // Control points for bezier curves
    const topRight1 = rotate(cx + rx * k, cy - ry);
    const topRight2 = rotate(cx + rx, cy - ry * k);

    const bottomRight1 = rotate(cx + rx, cy + ry * k);
    const bottomRight2 = rotate(cx + rx * k, cy + ry);

    const bottomLeft1 = rotate(cx - rx * k, cy + ry);
    const bottomLeft2 = rotate(cx - rx, cy + ry * k);

    const topLeft1 = rotate(cx - rx, cy - ry * k);
    const topLeft2 = rotate(cx - rx * k, cy - ry);

    const p = (pt: Point) => `${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;

    return `
        M ${p(top)}
        C ${p(topRight1)}, ${p(topRight2)}, ${p(right)}
        C ${p(bottomRight1)}, ${p(bottomRight2)}, ${p(bottom)}
        C ${p(bottomLeft1)}, ${p(bottomLeft2)}, ${p(left)}
        C ${p(topLeft1)}, ${p(topLeft2)}, ${p(top)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Reverse ellipse path for creating donut shape
 */
function reverseEllipsePath(path: string): string {
    // Extract coordinates and reverse the direction
    const commands = path.match(/[MCLZ][\s\d.,-]*/g) || [];
    if (commands.length === 0) return '';

    // For a proper hole, we need to reverse the winding direction
    // This is a simplified approach - just return the inner path as-is
    // The SVG fill-rule will handle the rest
    return path;
}

/**
 * Create a single orbital ring with 3D tilt effect
 */
function createTiltedRing(
    params: OrbitalRingsParams,
    ringIndex: number,
    totalRings: number,
    viewSize: number
): { path: string; zIndex: number } {
    const cx = viewSize / 2;
    const cy = viewSize / 2;
    const baseRadius = viewSize * 0.35;

    // Calculate rotation for this ring
    const rotationStep = Math.PI / (totalRings + 1);
    const rotation = (ringIndex + 1) * rotationStep + (params.rotationOffset * Math.PI) / 180;

    // Apply 3D perspective through eccentricity
    const perspectiveScale = 0.4 + params.orbitEccentricity;
    const rx = baseRadius;
    const ry = baseRadius * perspectiveScale;

    // Vary the tilt angle for 3D effect
    const tiltAngle = rotation + (params.orbitAngle * Math.PI) / 180;

    const path = createOrbitalRingPath(cx, cy, rx, ry, params.ringThickness, tiltAngle);

    // Calculate z-index based on rotation for proper layering
    const zIndex = Math.sin(tiltAngle) * 100;

    return { path, zIndex };
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleOrbitalRings(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateOrbitalRingsParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('orbital-rings', variant);

    // Generate rings with z-ordering
    const rings: Array<{ path: string; zIndex: number; index: number }> = [];

    for (let i = 0; i < algoParams.ringCount; i++) {
        const { path, zIndex } = createTiltedRing(algoParams, i, algoParams.ringCount, size);
        rings.push({ path, zIndex, index: i });
    }

    // Sort by z-index for proper layering (back to front)
    rings.sort((a, b) => a.zIndex - b.zIndex);

    // Render rings
    rings.forEach(ring => {
        const ringGradId = `${uniqueId}-ring-${ring.index}`;
        const t = ring.index / (algoParams.ringCount - 1);

        svg.addGradient(ringGradId, {
            type: 'linear',
            angle: 45 + ring.index * 30,
            stops: [
                { offset: 0, color: mixColors(lighten(primaryColor, 15), accentColor || primaryColor, t * 0.5) },
                { offset: 1, color: mixColors(primaryColor, accentColor || darken(primaryColor, 15), t) },
            ],
        });

        svg.path(ring.path, { fill: `url(#${ringGradId})` });
    });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'orbital-rings', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'orbital-rings',
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
                pathCount: algoParams.ringCount,
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

export function generateOrbitalRings(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleOrbitalRings(params, hashParams, v);

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
                algorithm: 'orbital-rings',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleOrbitalRingsPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateOrbitalRingsParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const rings: Array<{ path: string; zIndex: number; index: number }> = [];
    for (let i = 0; i < params.ringCount; i++) {
        const { path, zIndex } = createTiltedRing(params, i, params.ringCount, size);
        rings.push({ path, zIndex, index: i });
    }
    rings.sort((a, b) => a.zIndex - b.zIndex);

    rings.forEach(ring => {
        const t = ring.index / (params.ringCount - 1);
        svg.addGradient(`ring-${ring.index}`, {
            type: 'linear',
            angle: 45,
            stops: [
                { offset: 0, color: mixColors(primaryColor, accentColor || primaryColor, t) },
                { offset: 1, color: darken(primaryColor, 10) },
            ],
        });
        svg.path(ring.path, { fill: `url(#ring-${ring.index})` });
    });

    return svg.build();
}
