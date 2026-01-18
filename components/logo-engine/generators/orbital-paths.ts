/**
 * Orbital Paths Generator (Space/Tech-style)
 *
 * Creates orbital path rings around a central body
 * Planetary and space aesthetic
 * Inspired by space tech and physics brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    OrbitalPathsParams,
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
    calculateComplexity,
    storeHash,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateOrbitalPathsParams(hashParams: HashParams, rng: () => number): OrbitalPathsParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const trails: Array<'none' | 'fade' | 'solid'> = ['none', 'fade', 'solid'];

    return {
        ...base,
        orbitCount: Math.max(1, Math.min(4, Math.floor(derived.elementCount * 0.3 + 1))),
        planetSize: derived.centerRadius * 8 + 6,
        ringTilt: derived.curveTension * 40 + 20,
        trailEffect: trails[Math.floor(derived.styleVariant % 3)],
        orbitSpacing: derived.spacingFactor * 6 + 8,
        planetCount: Math.max(1, Math.min(3, Math.floor(derived.colorPlacement * 2 + 1))),
        ringOpacity: derived.organicAmount * 0.4 + 0.4,
        centerGlow: derived.perspectiveStrength > 0.5,
        ellipseRatio: derived.taperRatio * 0.4 + 0.4,
        rotationAngle: derived.rotationOffset,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateEllipsePath(
    cx: number,
    cy: number,
    radiusX: number,
    radiusY: number,
    rotation: number = 0
): string {
    const k = 0.5522847498;

    // Unrotated ellipse points
    const points = [
        { x: 0, y: -radiusY }, // top
        { x: radiusX, y: 0 },  // right
        { x: 0, y: radiusY },  // bottom
        { x: -radiusX, y: 0 }, // left
    ];

    // Rotate points
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const rotatedPoints = points.map(p => ({
        x: cx + p.x * cos - p.y * sin,
        y: cy + p.x * sin + p.y * cos,
    }));

    // Control point distances
    const cpX = radiusX * k;
    const cpY = radiusY * k;

    // Rotated control points helper
    const rotateCP = (dx: number, dy: number) => ({
        x: dx * cos - dy * sin,
        y: dx * sin + dy * cos,
    });

    const cp1 = rotateCP(cpX, -radiusY);
    const cp2 = rotateCP(radiusX, -cpY);
    const cp3 = rotateCP(radiusX, cpY);
    const cp4 = rotateCP(cpX, radiusY);
    const cp5 = rotateCP(-cpX, radiusY);
    const cp6 = rotateCP(-radiusX, cpY);
    const cp7 = rotateCP(-radiusX, -cpY);
    const cp8 = rotateCP(-cpX, -radiusY);

    return `
        M ${rotatedPoints[0].x.toFixed(2)} ${rotatedPoints[0].y.toFixed(2)}
        C ${(cx + cp1.x).toFixed(2)} ${(cy + cp1.y).toFixed(2)},
          ${(cx + cp2.x).toFixed(2)} ${(cy + cp2.y).toFixed(2)},
          ${rotatedPoints[1].x.toFixed(2)} ${rotatedPoints[1].y.toFixed(2)}
        C ${(cx + cp3.x).toFixed(2)} ${(cy + cp3.y).toFixed(2)},
          ${(cx + cp4.x).toFixed(2)} ${(cy + cp4.y).toFixed(2)},
          ${rotatedPoints[2].x.toFixed(2)} ${rotatedPoints[2].y.toFixed(2)}
        C ${(cx + cp5.x).toFixed(2)} ${(cy + cp5.y).toFixed(2)},
          ${(cx + cp6.x).toFixed(2)} ${(cy + cp6.y).toFixed(2)},
          ${rotatedPoints[3].x.toFixed(2)} ${rotatedPoints[3].y.toFixed(2)}
        C ${(cx + cp7.x).toFixed(2)} ${(cy + cp7.y).toFixed(2)},
          ${(cx + cp8.x).toFixed(2)} ${(cy + cp8.y).toFixed(2)},
          ${rotatedPoints[0].x.toFixed(2)} ${rotatedPoints[0].y.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateCirclePath(
    cx: number,
    cy: number,
    radius: number
): string {
    const k = 0.5522847498;
    return `
        M ${cx.toFixed(2)} ${(cy - radius).toFixed(2)}
        C ${(cx + radius * k).toFixed(2)} ${(cy - radius).toFixed(2)},
          ${(cx + radius).toFixed(2)} ${(cy - radius * k).toFixed(2)},
          ${(cx + radius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + radius).toFixed(2)} ${(cy + radius * k).toFixed(2)},
          ${(cx + radius * k).toFixed(2)} ${(cy + radius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + radius).toFixed(2)}
        C ${(cx - radius * k).toFixed(2)} ${(cy + radius).toFixed(2)},
          ${(cx - radius).toFixed(2)} ${(cy + radius * k).toFixed(2)},
          ${(cx - radius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - radius).toFixed(2)} ${(cy - radius * k).toFixed(2)},
          ${(cx - radius * k).toFixed(2)} ${(cy - radius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - radius).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function getPlanetPosition(
    cx: number,
    cy: number,
    radiusX: number,
    radiusY: number,
    angle: number,
    rotation: number
): { x: number; y: number } {
    const rad = (rotation * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const px = radiusX * Math.cos(angle);
    const py = radiusY * Math.sin(angle);

    return {
        x: cx + px * cos - py * sin,
        y: cy + px * sin + py * cos,
    };
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleOrbitalPaths(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateOrbitalPathsParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('orbital-paths', variant);

    // Center gradient
    const centerGradId = `${uniqueId}-center`;
    svg.addGradient(centerGradId, {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 25) },
            { offset: 0.6, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Glow gradient
    if (algoParams.centerGlow) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0.3, color: accentColor || lighten(primaryColor, 40), opacity: 0.4 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });
        const glowPath = generateCirclePath(cx, cy, algoParams.planetSize * 2.5);
        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    // Orbital rings
    const baseRadius = algoParams.planetSize + 10;

    for (let i = 0; i < algoParams.orbitCount; i++) {
        const radiusX = baseRadius + i * algoParams.orbitSpacing;
        const radiusY = radiusX * algoParams.ellipseRatio;
        const rotation = algoParams.rotationAngle + i * 15;

        const orbitPath = generateEllipsePath(cx, cy, radiusX, radiusY, rotation);

        // Trail effect gradient
        if (algoParams.trailEffect === 'fade') {
            const trailGradId = `${uniqueId}-trail-${i}`;
            svg.addGradient(trailGradId, {
                type: 'linear',
                angle: rotation,
                stops: [
                    { offset: 0, color: accentColor || lighten(primaryColor, 30), opacity: 0.1 },
                    { offset: 0.5, color: accentColor || lighten(primaryColor, 30), opacity: algoParams.ringOpacity },
                    { offset: 1, color: accentColor || lighten(primaryColor, 30), opacity: 0.1 },
                ],
            });
            svg.path(orbitPath, {
                fill: 'none',
                stroke: `url(#${trailGradId})`,
                strokeWidth: '1.5',
            });
        } else {
            svg.path(orbitPath, {
                fill: 'none',
                stroke: accentColor || lighten(primaryColor, 20),
                strokeWidth: '1.5',
                strokeOpacity: algoParams.ringOpacity.toString(),
            });
        }

        // Orbiting planet on this ring
        if (i < algoParams.planetCount) {
            const planetAngle = (i * Math.PI * 0.7) + Math.PI * 0.3;
            const planetPos = getPlanetPosition(cx, cy, radiusX, radiusY, planetAngle, rotation);
            const smallPlanetRadius = 3 - i * 0.5;

            const smallPlanetPath = generateCirclePath(planetPos.x, planetPos.y, smallPlanetRadius);
            svg.path(smallPlanetPath, { fill: accentColor || lighten(primaryColor, 35) });
        }
    }

    // Central body
    const centerPath = generateCirclePath(cx, cy, algoParams.planetSize);
    svg.path(centerPath, { fill: `url(#${centerGradId})` });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'orbital-paths', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'orbital-paths',
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
                pathCount: 1 + algoParams.orbitCount + algoParams.planetCount,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 30)],
            },
        },
    };

    return { logo, quality };
}

export function generateOrbitalPaths(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleOrbitalPaths(params, hashParams, v);

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
                algorithm: 'orbital-paths',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleOrbitalPathsPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateOrbitalPathsParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('center', {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    // One orbit ring
    const orbitPath = generateEllipsePath(size / 2, size / 2, 30, 30 * params.ellipseRatio, params.rotationAngle);
    svg.path(orbitPath, { fill: 'none', stroke: accentColor || lighten(primaryColor, 20), strokeWidth: '1.5' });

    // Center planet
    const centerPath = generateCirclePath(size / 2, size / 2, params.planetSize);
    svg.path(centerPath, { fill: 'url(#center)' });

    return svg.build();
}
