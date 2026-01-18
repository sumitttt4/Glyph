/**
 * Hexagon Tech Generator (Blockchain/Tech-style)
 *
 * Creates hexagonal patterns with tech aesthetics
 * Circuit-like connections and honeycomb variations
 * Inspired by blockchain and tech companies
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    HexagonTechParams,
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

function generateHexagonTechParams(hashParams: HashParams, rng: () => number): HexagonTechParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const innerShapes: Array<'none' | 'hexagon' | 'circle' | 'letter'> = ['none', 'hexagon', 'circle', 'letter'];
    const connections: Array<'none' | 'lines' | 'nodes'> = ['none', 'lines', 'nodes'];
    const techPatterns: Array<'solid' | 'circuit' | 'grid'> = ['solid', 'circuit', 'grid'];

    return {
        ...base,
        innerShape: innerShapes[Math.floor(derived.styleVariant % 4)],
        honeycombStyle: derived.layerCount > 2,
        borderThickness: derived.strokeWidth * 0.5 + 2,
        cornerCut: derived.taperRatio * 0.5,
        cellCount: Math.max(1, Math.min(7, Math.round(derived.elementCount * 0.3))),
        connectionStyle: connections[Math.floor(derived.colorPlacement % 3)],
        techPattern: techPatterns[Math.floor(derived.styleVariant % 3)],
        glowEffect: derived.organicAmount > 0.6,
        rotation: derived.rotationOffset * 0.1,
        nestingLevel: Math.floor(derived.layerCount * 0.6),
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateHexagonPath(
    cx: number,
    cy: number,
    radius: number,
    rotation: number = 0
): string {
    const points: string[] = [];

    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i + rotation - Math.PI / 6;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        points.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    }

    // Create bezier path with slight curve for smooth corners
    const curveFactor = 0.1;
    let path = `M ${points[0]}`;

    for (let i = 0; i < 6; i++) {
        const curr = points[i].split(' ').map(Number);
        const next = points[(i + 1) % 6].split(' ').map(Number);
        const nextNext = points[(i + 2) % 6].split(' ').map(Number);

        const cp1x = curr[0] + (next[0] - curr[0]) * (1 - curveFactor);
        const cp1y = curr[1] + (next[1] - curr[1]) * (1 - curveFactor);
        const cp2x = next[0] - (nextNext[0] - curr[0]) * curveFactor * 0.5;
        const cp2y = next[1] - (nextNext[1] - curr[1]) * curveFactor * 0.5;

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${next[0].toFixed(2)} ${next[1].toFixed(2)}`;
    }

    return path + ' Z';
}

function generateCircuitConnections(
    cx: number,
    cy: number,
    radius: number,
    params: HexagonTechParams
): string[] {
    const paths: string[] = [];
    const nodeRadius = 2;

    // Generate connection lines from center to vertices
    for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i - Math.PI / 6;
        const endX = cx + radius * 0.7 * Math.cos(angle);
        const endY = cy + radius * 0.7 * Math.sin(angle);

        // Line with bezier curve
        const midX = cx + radius * 0.35 * Math.cos(angle);
        const midY = cy + radius * 0.35 * Math.sin(angle);

        paths.push(`
            M ${cx.toFixed(2)} ${cy.toFixed(2)}
            C ${midX.toFixed(2)} ${midY.toFixed(2)},
              ${midX.toFixed(2)} ${midY.toFixed(2)},
              ${endX.toFixed(2)} ${endY.toFixed(2)}
        `.replace(/\s+/g, ' ').trim());

        // Node circle at end (as bezier approximation)
        if (params.connectionStyle === 'nodes') {
            const k = 0.5522847498;
            paths.push(`
                M ${endX.toFixed(2)} ${(endY - nodeRadius).toFixed(2)}
                C ${(endX + nodeRadius * k).toFixed(2)} ${(endY - nodeRadius).toFixed(2)},
                  ${(endX + nodeRadius).toFixed(2)} ${(endY - nodeRadius * k).toFixed(2)},
                  ${(endX + nodeRadius).toFixed(2)} ${endY.toFixed(2)}
                C ${(endX + nodeRadius).toFixed(2)} ${(endY + nodeRadius * k).toFixed(2)},
                  ${(endX + nodeRadius * k).toFixed(2)} ${(endY + nodeRadius).toFixed(2)},
                  ${endX.toFixed(2)} ${(endY + nodeRadius).toFixed(2)}
                C ${(endX - nodeRadius * k).toFixed(2)} ${(endY + nodeRadius).toFixed(2)},
                  ${(endX - nodeRadius).toFixed(2)} ${(endY + nodeRadius * k).toFixed(2)},
                  ${(endX - nodeRadius).toFixed(2)} ${endY.toFixed(2)}
                C ${(endX - nodeRadius).toFixed(2)} ${(endY - nodeRadius * k).toFixed(2)},
                  ${(endX - nodeRadius * k).toFixed(2)} ${(endY - nodeRadius).toFixed(2)},
                  ${endX.toFixed(2)} ${(endY - nodeRadius).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim());
        }
    }

    return paths;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleHexagonTech(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateHexagonTechParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('hexagon-tech', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 20) },
        ],
    });

    // Outer hexagon
    const outerRadius = 38;
    const outerPath = generateHexagonPath(cx, cy, outerRadius, algoParams.rotation);
    svg.path(outerPath, { fill: `url(#${gradientId})` });

    // Inner hexagon (nesting)
    if (algoParams.nestingLevel > 0) {
        const innerRadius = outerRadius * 0.7;
        const innerPath = generateHexagonPath(cx, cy, innerRadius, algoParams.rotation);
        svg.path(innerPath, { fill: darken(primaryColor, 15) });

        if (algoParams.nestingLevel > 1) {
            const innerRadius2 = outerRadius * 0.45;
            const innerPath2 = generateHexagonPath(cx, cy, innerRadius2, algoParams.rotation);
            svg.path(innerPath2, { fill: accentColor || lighten(primaryColor, 10) });
        }
    }

    // Circuit connections
    if (algoParams.connectionStyle !== 'none' && algoParams.techPattern === 'circuit') {
        const connections = generateCircuitConnections(cx, cy, outerRadius * 0.9, algoParams);
        connections.forEach((path, i) => {
            svg.path(path, {
                fill: i % 2 === 0 ? 'none' : (accentColor || lighten(primaryColor, 30)),
                stroke: i % 2 === 0 ? (accentColor || lighten(primaryColor, 20)) : 'none',
                strokeWidth: '1.5',
            });
        });
    }

    // Glow effect
    if (algoParams.glowEffect) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0, color: accentColor || lighten(primaryColor, 30), opacity: 0.3 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });
        const glowPath = generateHexagonPath(cx, cy, outerRadius + 5, algoParams.rotation);
        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'hexagon-tech', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'hexagon-tech',
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
                symmetry: 'rotational-6',
                pathCount: 2 + algoParams.nestingLevel,
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

export function generateHexagonTech(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleHexagonTech(params, hashParams, v);

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
                algorithm: 'hexagon-tech',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleHexagonTechPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateHexagonTechParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    const path = generateHexagonPath(size / 2, size / 2, 38, params.rotation);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
