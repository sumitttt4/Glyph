/**
 * Maze Pattern Generator (Complexity/Puzzle-style)
 *
 * Creates labyrinth and maze patterns
 * Puzzle and complexity aesthetic
 * Inspired by puzzle games and complex systems brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    MazePatternParams,
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

function generateMazePatternParams(hashParams: HashParams, rng: () => number): MazePatternParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const corners: Array<'sharp' | 'rounded' | 'beveled'> = ['sharp', 'rounded', 'beveled'];
    const centers: Array<'none' | 'dot' | 'square' | 'letter'> = ['none', 'dot', 'square', 'letter'];

    return {
        ...base,
        pathWidth: derived.strokeWidth * 2 + 3,
        cornerStyle: corners[Math.floor(derived.styleVariant % 3)],
        centerSymbol: centers[Math.floor(derived.colorPlacement % 4)],
        wallThickness: derived.taperRatio * 2 + 1,
        complexity: Math.max(2, Math.min(4, Math.floor(derived.elementCount * 0.3 + 2))),
        openings: Math.floor(derived.organicAmount * 2 + 1),
        symmetrical: derived.perspectiveStrength > 0.5,
        gradientWalls: derived.layerCount > 2,
        glowPath: derived.bulgeAmount > 0.4,
        rotated: derived.rotationOffset > 180,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateMazeWallPath(
    cx: number,
    cy: number,
    params: MazePatternParams,
    layer: number,
    totalLayers: number
): string[] {
    const { pathWidth, cornerStyle, wallThickness, symmetrical, openings } = params;

    const paths: string[] = [];
    const size = 35 - layer * 8;
    const r = cornerStyle === 'rounded' ? 3 : 0;

    const left = cx - size;
    const right = cx + size;
    const top = cy - size;
    const bottom = cy + size;

    // Determine which sides have openings
    const hasTopOpening = !symmetrical && layer % 2 === 0 && openings > 0;
    const hasBottomOpening = !symmetrical && layer % 2 === 1 && openings > 1;
    const hasLeftOpening = symmetrical || (layer % 2 === 0 && openings > 0);
    const hasRightOpening = symmetrical || (layer % 2 === 1 && openings > 1);

    const openingSize = pathWidth * 1.5;

    // Build maze walls as separate segments
    if (cornerStyle === 'rounded') {
        const k = 0.5522847498 * r / size;

        // Top wall
        if (!hasTopOpening) {
            paths.push(`
                M ${(left + r).toFixed(2)} ${top.toFixed(2)}
                L ${(right - r).toFixed(2)} ${top.toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        } else {
            paths.push(`
                M ${(left + r).toFixed(2)} ${top.toFixed(2)}
                L ${(cx - openingSize / 2).toFixed(2)} ${top.toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
            paths.push(`
                M ${(cx + openingSize / 2).toFixed(2)} ${top.toFixed(2)}
                L ${(right - r).toFixed(2)} ${top.toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        }

        // Right wall
        if (!hasRightOpening) {
            paths.push(`
                M ${right.toFixed(2)} ${(top + r).toFixed(2)}
                L ${right.toFixed(2)} ${(bottom - r).toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        } else {
            paths.push(`
                M ${right.toFixed(2)} ${(top + r).toFixed(2)}
                L ${right.toFixed(2)} ${(cy - openingSize / 2).toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
            paths.push(`
                M ${right.toFixed(2)} ${(cy + openingSize / 2).toFixed(2)}
                L ${right.toFixed(2)} ${(bottom - r).toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        }

        // Bottom wall
        if (!hasBottomOpening) {
            paths.push(`
                M ${(right - r).toFixed(2)} ${bottom.toFixed(2)}
                L ${(left + r).toFixed(2)} ${bottom.toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        } else {
            paths.push(`
                M ${(right - r).toFixed(2)} ${bottom.toFixed(2)}
                L ${(cx + openingSize / 2).toFixed(2)} ${bottom.toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
            paths.push(`
                M ${(cx - openingSize / 2).toFixed(2)} ${bottom.toFixed(2)}
                L ${(left + r).toFixed(2)} ${bottom.toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        }

        // Left wall
        if (!hasLeftOpening) {
            paths.push(`
                M ${left.toFixed(2)} ${(bottom - r).toFixed(2)}
                L ${left.toFixed(2)} ${(top + r).toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        } else {
            paths.push(`
                M ${left.toFixed(2)} ${(bottom - r).toFixed(2)}
                L ${left.toFixed(2)} ${(cy + openingSize / 2).toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
            paths.push(`
                M ${left.toFixed(2)} ${(cy - openingSize / 2).toFixed(2)}
                L ${left.toFixed(2)} ${(top + r).toFixed(2)}
            `.replace(/\s+/g, ' ').trim());
        }

        // Corners
        paths.push(`
            M ${(right - r).toFixed(2)} ${top.toFixed(2)}
            C ${right.toFixed(2)} ${top.toFixed(2)},
              ${right.toFixed(2)} ${top.toFixed(2)},
              ${right.toFixed(2)} ${(top + r).toFixed(2)}
        `.replace(/\s+/g, ' ').trim());

        paths.push(`
            M ${right.toFixed(2)} ${(bottom - r).toFixed(2)}
            C ${right.toFixed(2)} ${bottom.toFixed(2)},
              ${right.toFixed(2)} ${bottom.toFixed(2)},
              ${(right - r).toFixed(2)} ${bottom.toFixed(2)}
        `.replace(/\s+/g, ' ').trim());

        paths.push(`
            M ${(left + r).toFixed(2)} ${bottom.toFixed(2)}
            C ${left.toFixed(2)} ${bottom.toFixed(2)},
              ${left.toFixed(2)} ${bottom.toFixed(2)},
              ${left.toFixed(2)} ${(bottom - r).toFixed(2)}
        `.replace(/\s+/g, ' ').trim());

        paths.push(`
            M ${left.toFixed(2)} ${(top + r).toFixed(2)}
            C ${left.toFixed(2)} ${top.toFixed(2)},
              ${left.toFixed(2)} ${top.toFixed(2)},
              ${(left + r).toFixed(2)} ${top.toFixed(2)}
        `.replace(/\s+/g, ' ').trim());

    } else {
        // Sharp corners - simpler paths
        // Top
        if (!hasTopOpening) {
            paths.push(`M ${left.toFixed(2)} ${top.toFixed(2)} L ${right.toFixed(2)} ${top.toFixed(2)}`);
        } else {
            paths.push(`M ${left.toFixed(2)} ${top.toFixed(2)} L ${(cx - openingSize / 2).toFixed(2)} ${top.toFixed(2)}`);
            paths.push(`M ${(cx + openingSize / 2).toFixed(2)} ${top.toFixed(2)} L ${right.toFixed(2)} ${top.toFixed(2)}`);
        }

        // Right
        if (!hasRightOpening) {
            paths.push(`M ${right.toFixed(2)} ${top.toFixed(2)} L ${right.toFixed(2)} ${bottom.toFixed(2)}`);
        } else {
            paths.push(`M ${right.toFixed(2)} ${top.toFixed(2)} L ${right.toFixed(2)} ${(cy - openingSize / 2).toFixed(2)}`);
            paths.push(`M ${right.toFixed(2)} ${(cy + openingSize / 2).toFixed(2)} L ${right.toFixed(2)} ${bottom.toFixed(2)}`);
        }

        // Bottom
        if (!hasBottomOpening) {
            paths.push(`M ${right.toFixed(2)} ${bottom.toFixed(2)} L ${left.toFixed(2)} ${bottom.toFixed(2)}`);
        } else {
            paths.push(`M ${right.toFixed(2)} ${bottom.toFixed(2)} L ${(cx + openingSize / 2).toFixed(2)} ${bottom.toFixed(2)}`);
            paths.push(`M ${(cx - openingSize / 2).toFixed(2)} ${bottom.toFixed(2)} L ${left.toFixed(2)} ${bottom.toFixed(2)}`);
        }

        // Left
        if (!hasLeftOpening) {
            paths.push(`M ${left.toFixed(2)} ${bottom.toFixed(2)} L ${left.toFixed(2)} ${top.toFixed(2)}`);
        } else {
            paths.push(`M ${left.toFixed(2)} ${bottom.toFixed(2)} L ${left.toFixed(2)} ${(cy + openingSize / 2).toFixed(2)}`);
            paths.push(`M ${left.toFixed(2)} ${(cy - openingSize / 2).toFixed(2)} L ${left.toFixed(2)} ${top.toFixed(2)}`);
        }
    }

    return paths;
}

function generateCenterSymbolPath(
    cx: number,
    cy: number,
    symbolType: string,
    size: number
): string {
    const k = 0.5522847498;

    if (symbolType === 'dot') {
        return `
            M ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
            C ${(cx + size * k).toFixed(2)} ${(cy - size).toFixed(2)},
              ${(cx + size).toFixed(2)} ${(cy - size * k).toFixed(2)},
              ${(cx + size).toFixed(2)} ${cy.toFixed(2)}
            C ${(cx + size).toFixed(2)} ${(cy + size * k).toFixed(2)},
              ${(cx + size * k).toFixed(2)} ${(cy + size).toFixed(2)},
              ${cx.toFixed(2)} ${(cy + size).toFixed(2)}
            C ${(cx - size * k).toFixed(2)} ${(cy + size).toFixed(2)},
              ${(cx - size).toFixed(2)} ${(cy + size * k).toFixed(2)},
              ${(cx - size).toFixed(2)} ${cy.toFixed(2)}
            C ${(cx - size).toFixed(2)} ${(cy - size * k).toFixed(2)},
              ${(cx - size * k).toFixed(2)} ${(cy - size).toFixed(2)},
              ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    } else if (symbolType === 'square') {
        return `
            M ${(cx - size).toFixed(2)} ${(cy - size).toFixed(2)}
            L ${(cx + size).toFixed(2)} ${(cy - size).toFixed(2)}
            L ${(cx + size).toFixed(2)} ${(cy + size).toFixed(2)}
            L ${(cx - size).toFixed(2)} ${(cy + size).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    return '';
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleMazePattern(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateMazePatternParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('maze-pattern', variant);

    // Gradient for walls
    if (algoParams.gradientWalls) {
        const wallGradId = `${uniqueId}-wall`;
        svg.addGradient(wallGradId, {
            type: 'linear',
            angle: 135,
            stops: [
                { offset: 0, color: lighten(primaryColor, 15) },
                { offset: 0.5, color: primaryColor },
                { offset: 1, color: darken(primaryColor, 15) },
            ],
        });
    }

    // Glow path gradient
    if (algoParams.glowPath) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0, color: accentColor || lighten(primaryColor, 40), opacity: 0.4 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });

        const glowPath = `
            M ${(cx - 40).toFixed(2)} ${(cy - 40).toFixed(2)}
            L ${(cx + 40).toFixed(2)} ${(cy - 40).toFixed(2)}
            L ${(cx + 40).toFixed(2)} ${(cy + 40).toFixed(2)}
            L ${(cx - 40).toFixed(2)} ${(cy + 40).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    // Generate maze layers
    for (let layer = 0; layer < algoParams.complexity; layer++) {
        const wallPaths = generateMazeWallPath(cx, cy, algoParams, layer, algoParams.complexity);

        wallPaths.forEach(wallPath => {
            svg.path(wallPath, {
                fill: 'none',
                stroke: algoParams.gradientWalls ? `url(#${uniqueId}-wall)` : primaryColor,
                strokeWidth: algoParams.wallThickness.toString(),
                strokeLinecap: algoParams.cornerStyle === 'rounded' ? 'round' : 'square',
            });
        });
    }

    // Center symbol
    if (algoParams.centerSymbol !== 'none' && algoParams.centerSymbol !== 'letter') {
        const symbolPath = generateCenterSymbolPath(cx, cy, algoParams.centerSymbol, 5);
        if (symbolPath) {
            svg.path(symbolPath, { fill: accentColor || lighten(primaryColor, 30) });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'maze-pattern', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'maze-pattern',
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
                bezierCurves: algoParams.cornerStyle === 'rounded',
                symmetry: algoParams.symmetrical ? 'bilateral' : 'none',
                pathCount: algoParams.complexity * 8 + (algoParams.centerSymbol !== 'none' ? 1 : 0),
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

export function generateMazePattern(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleMazePattern(params, hashParams, v);

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
                algorithm: 'maze-pattern',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleMazePatternPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateMazePatternParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    // Draw simplified maze
    for (let layer = 0; layer < Math.min(params.complexity, 3); layer++) {
        const wallPaths = generateMazeWallPath(size / 2, size / 2, params, layer, params.complexity);

        wallPaths.forEach(wallPath => {
            svg.path(wallPath, {
                fill: 'none',
                stroke: primaryColor,
                strokeWidth: params.wallThickness.toString(),
                strokeLinecap: params.cornerStyle === 'rounded' ? 'round' : 'square',
            });
        });
    }

    return svg.build();
}
