/**
 * Leaf Organic Generator (Eco/Nature-style)
 *
 * Creates organic leaf shapes with vein patterns
 * Natural flowing forms with botanical details
 * Inspired by eco-friendly and nature brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    LeafOrganicParams,
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
    addNoise,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateLeafOrganicParams(hashParams: HashParams, rng: () => number): LeafOrganicParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const shapes: Array<'oval' | 'pointed' | 'heart' | 'maple'> = ['oval', 'pointed', 'heart', 'maple'];
    const veins: Array<'none' | 'central' | 'branching' | 'parallel'> = ['none', 'central', 'branching', 'parallel'];

    return {
        ...base,
        leafShape: shapes[Math.floor(derived.styleVariant % 4)],
        veinPattern: veins[Math.floor((derived.styleVariant + 1) % 4)],
        stemCurve: derived.curveTension,
        serrationCount: Math.floor(derived.elementCount * 0.5),
        leafCurl: derived.organicAmount * 0.5,
        stemLength: derived.armLength * 0.4 + 10,
        veinDepth: derived.perspectiveStrength,
        asymmetry: derived.jitterAmount * 0.02,
        multiLeaf: Math.min(3, Math.max(1, Math.floor(derived.layerCount * 0.6))),
        dropShadow: derived.depthOffset > 10,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateLeafPath(
    params: LeafOrganicParams,
    cx: number,
    cy: number,
    scale: number = 1,
    rotation: number = 0,
    rng: () => number
): string {
    const { leafShape, leafCurl, asymmetry } = params;

    const width = 28 * scale;
    const height = 40 * scale;

    // Add asymmetry
    const leftBias = 1 - asymmetry;
    const rightBias = 1 + asymmetry;

    // Tip position
    const tipY = cy - height / 2;
    const baseY = cy + height / 2;

    // Control point heights
    const upperMidY = cy - height * 0.2;
    const lowerMidY = cy + height * 0.15;

    // Width at different heights
    const maxWidth = width / 2;
    const tipCurve = leafShape === 'pointed' ? 0.2 : leafShape === 'heart' ? 0.4 : 0.3;

    // Generate organic wobble
    const wobbleL = leafCurl > 0 ? addNoise(0, leafCurl, rng, 3) : 0;
    const wobbleR = leafCurl > 0 ? addNoise(0, leafCurl, rng, 3) : 0;

    const path = `
        M ${cx.toFixed(2)} ${tipY.toFixed(2)}
        C ${(cx - maxWidth * tipCurve * leftBias).toFixed(2)} ${(tipY + height * 0.1).toFixed(2)},
          ${(cx - maxWidth * leftBias + wobbleL).toFixed(2)} ${(upperMidY - height * 0.1).toFixed(2)},
          ${(cx - maxWidth * leftBias + wobbleL).toFixed(2)} ${upperMidY.toFixed(2)}
        C ${(cx - maxWidth * 0.95 * leftBias + wobbleL).toFixed(2)} ${(cy - height * 0.05).toFixed(2)},
          ${(cx - maxWidth * 0.9 * leftBias).toFixed(2)} ${(lowerMidY - height * 0.05).toFixed(2)},
          ${(cx - maxWidth * 0.7 * leftBias).toFixed(2)} ${lowerMidY.toFixed(2)}
        C ${(cx - maxWidth * 0.4 * leftBias).toFixed(2)} ${(lowerMidY + height * 0.15).toFixed(2)},
          ${(cx - maxWidth * 0.15).toFixed(2)} ${(baseY - height * 0.05).toFixed(2)},
          ${cx.toFixed(2)} ${baseY.toFixed(2)}
        C ${(cx + maxWidth * 0.15).toFixed(2)} ${(baseY - height * 0.05).toFixed(2)},
          ${(cx + maxWidth * 0.4 * rightBias).toFixed(2)} ${(lowerMidY + height * 0.15).toFixed(2)},
          ${(cx + maxWidth * 0.7 * rightBias).toFixed(2)} ${lowerMidY.toFixed(2)}
        C ${(cx + maxWidth * 0.9 * rightBias).toFixed(2)} ${(lowerMidY - height * 0.05).toFixed(2)},
          ${(cx + maxWidth * 0.95 * rightBias + wobbleR).toFixed(2)} ${(cy - height * 0.05).toFixed(2)},
          ${(cx + maxWidth * rightBias + wobbleR).toFixed(2)} ${upperMidY.toFixed(2)}
        C ${(cx + maxWidth * rightBias + wobbleR).toFixed(2)} ${(upperMidY - height * 0.1).toFixed(2)},
          ${(cx + maxWidth * tipCurve * rightBias).toFixed(2)} ${(tipY + height * 0.1).toFixed(2)},
          ${cx.toFixed(2)} ${tipY.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();

    return path;
}

function generateVeinPath(
    params: LeafOrganicParams,
    cx: number,
    cy: number
): string[] {
    const { veinPattern, veinDepth } = params;
    const paths: string[] = [];

    if (veinPattern === 'none' || veinDepth < 0.2) return paths;

    const height = 40;
    const tipY = cy - height / 2;
    const baseY = cy + height / 2;

    // Central vein
    const centralVein = `
        M ${cx.toFixed(2)} ${(tipY + 3).toFixed(2)}
        C ${cx.toFixed(2)} ${(tipY + height * 0.3).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + height * 0.1).toFixed(2)},
          ${cx.toFixed(2)} ${(baseY - 5).toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
    paths.push(centralVein);

    // Branching veins
    if (veinPattern === 'branching' || veinPattern === 'parallel') {
        const branchCount = veinPattern === 'branching' ? 4 : 6;
        const branchSpacing = (height - 15) / branchCount;

        for (let i = 0; i < branchCount; i++) {
            const y = tipY + 8 + i * branchSpacing;
            const spread = 8 + (i * 1.5);
            const isLeft = i % 2 === 0;
            const x = isLeft ? cx - spread : cx + spread;

            const branchPath = `
                M ${cx.toFixed(2)} ${y.toFixed(2)}
                C ${((cx + x) / 2).toFixed(2)} ${(y + 2).toFixed(2)},
                  ${x.toFixed(2)} ${(y + 4).toFixed(2)},
                  ${x.toFixed(2)} ${(y + 5).toFixed(2)}
            `.replace(/\s+/g, ' ').trim();
            paths.push(branchPath);
        }
    }

    return paths;
}

function generateStemPath(
    params: LeafOrganicParams,
    cx: number,
    cy: number
): string {
    const { stemLength, stemCurve } = params;
    const baseY = cy + 20;
    const stemEndY = baseY + stemLength;
    const curvature = stemCurve * 8;

    return `
        M ${cx.toFixed(2)} ${baseY.toFixed(2)}
        C ${(cx - curvature * 0.3).toFixed(2)} ${(baseY + stemLength * 0.3).toFixed(2)},
          ${(cx - curvature).toFixed(2)} ${(baseY + stemLength * 0.7).toFixed(2)},
          ${(cx - curvature * 0.8).toFixed(2)} ${stemEndY.toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleLeafOrganic(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2 - 5;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateLeafOrganicParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('leaf-organic', variant);

    // Leaf gradient (natural green tones)
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 160,
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 20) },
        ],
    });

    // Main leaf
    const leafPath = generateLeafPath(algoParams, cx, cy, 1, 0, rng);
    svg.path(leafPath, { fill: `url(#${gradientId})` });

    // Veins
    const veinPaths = generateVeinPath(algoParams, cx, cy);
    veinPaths.forEach(veinPath => {
        svg.path(veinPath, {
            fill: 'none',
            stroke: darken(primaryColor, 25),
            strokeWidth: '0.8',
            strokeOpacity: '0.6',
        });
    });

    // Stem
    const stemPath = generateStemPath(algoParams, cx, cy);
    svg.path(stemPath, {
        fill: 'none',
        stroke: darken(primaryColor, 30),
        strokeWidth: '2',
        strokeLinecap: 'round',
    });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'leaf-organic', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'leaf-organic',
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
                symmetry: algoParams.asymmetry < 0.05 ? 'vertical' : 'none',
                pathCount: 2 + veinPaths.length,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, darken(primaryColor, 25)],
            },
        },
    };

    return { logo, quality };
}

export function generateLeafOrganic(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'sustainability' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleLeafOrganic(params, hashParams, v);

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
                algorithm: 'leaf-organic',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleLeafOrganicPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'sustainability');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateLeafOrganicParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 160,
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    const path = generateLeafPath(params, size / 2, size / 2 - 5, 1, 0, rng);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
