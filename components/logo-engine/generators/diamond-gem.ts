/**
 * Diamond Gem Generator (Luxury/Premium-style)
 *
 * Creates faceted diamond/gem shapes
 * Brilliant cut with light reflections
 * Inspired by luxury and jewelry brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    DiamondGemParams,
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

function generateDiamondGemParams(hashParams: HashParams, rng: () => number): DiamondGemParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const cuts: Array<'brilliant' | 'princess' | 'emerald' | 'oval'> = ['brilliant', 'princess', 'emerald', 'oval'];

    return {
        ...base,
        facetCount: Math.max(6, Math.min(12, Math.floor(derived.elementCount * 0.6 + 6))),
        brillianceCut: cuts[Math.floor(derived.styleVariant % 4)],
        tableSize: derived.taperRatio * 0.3 + 0.3,
        pavilionAngle: derived.curveTension * 20 + 35,
        crownHeight: derived.perspectiveStrength * 0.2 + 0.15,
        sparkleCount: Math.floor(derived.colorPlacement * 4),
        facetDepth: derived.organicAmount * 0.3 + 0.2,
        girdle: derived.strokeWidth * 0.02 + 0.02,
        symmetryPerfection: derived.bulgeAmount * 0.2 + 0.8,
        lightDirection: derived.rotationOffset,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateDiamondPath(
    params: DiamondGemParams,
    cx: number,
    cy: number,
    scale: number = 1
): { outline: string; facets: string[] } {
    const { brillianceCut, tableSize, crownHeight, pavilionAngle } = params;

    const width = 40 * scale;
    const height = 48 * scale;

    // Key points
    const tableWidth = width * tableSize;
    const crownY = cy - height * 0.3;
    const tableY = cy - height * 0.3 + height * crownHeight;
    const girdleY = cy + height * 0.05;
    const pavilionY = cy + height * 0.5;

    const left = cx - width / 2;
    const right = cx + width / 2;
    const tableLeft = cx - tableWidth / 2;
    const tableRight = cx + tableWidth / 2;

    let outline = '';
    const facets: string[] = [];

    if (brillianceCut === 'brilliant' || brillianceCut === 'princess') {
        // Brilliant/Princess cut outline
        outline = `
            M ${cx.toFixed(2)} ${crownY.toFixed(2)}
            L ${tableLeft.toFixed(2)} ${tableY.toFixed(2)}
            L ${left.toFixed(2)} ${girdleY.toFixed(2)}
            L ${cx.toFixed(2)} ${pavilionY.toFixed(2)}
            L ${right.toFixed(2)} ${girdleY.toFixed(2)}
            L ${tableRight.toFixed(2)} ${tableY.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

        // Crown facets
        facets.push(`
            M ${cx.toFixed(2)} ${crownY.toFixed(2)}
            L ${tableLeft.toFixed(2)} ${tableY.toFixed(2)}
            L ${cx.toFixed(2)} ${tableY.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim());

        facets.push(`
            M ${cx.toFixed(2)} ${crownY.toFixed(2)}
            L ${tableRight.toFixed(2)} ${tableY.toFixed(2)}
            L ${cx.toFixed(2)} ${tableY.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim());

        // Side crown facets
        facets.push(`
            M ${tableLeft.toFixed(2)} ${tableY.toFixed(2)}
            L ${left.toFixed(2)} ${girdleY.toFixed(2)}
            L ${(left + width * 0.15).toFixed(2)} ${(tableY + (girdleY - tableY) * 0.5).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim());

        facets.push(`
            M ${tableRight.toFixed(2)} ${tableY.toFixed(2)}
            L ${right.toFixed(2)} ${girdleY.toFixed(2)}
            L ${(right - width * 0.15).toFixed(2)} ${(tableY + (girdleY - tableY) * 0.5).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim());

        // Pavilion facets
        facets.push(`
            M ${left.toFixed(2)} ${girdleY.toFixed(2)}
            L ${cx.toFixed(2)} ${pavilionY.toFixed(2)}
            L ${(cx - width * 0.2).toFixed(2)} ${girdleY.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim());

        facets.push(`
            M ${right.toFixed(2)} ${girdleY.toFixed(2)}
            L ${cx.toFixed(2)} ${pavilionY.toFixed(2)}
            L ${(cx + width * 0.2).toFixed(2)} ${girdleY.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim());

    } else if (brillianceCut === 'emerald') {
        // Emerald cut (rectangular with cut corners)
        const cornerCut = width * 0.15;
        outline = `
            M ${(left + cornerCut).toFixed(2)} ${crownY.toFixed(2)}
            L ${(right - cornerCut).toFixed(2)} ${crownY.toFixed(2)}
            L ${right.toFixed(2)} ${(crownY + cornerCut).toFixed(2)}
            L ${right.toFixed(2)} ${(pavilionY - cornerCut).toFixed(2)}
            L ${(right - cornerCut).toFixed(2)} ${pavilionY.toFixed(2)}
            L ${(left + cornerCut).toFixed(2)} ${pavilionY.toFixed(2)}
            L ${left.toFixed(2)} ${(pavilionY - cornerCut).toFixed(2)}
            L ${left.toFixed(2)} ${(crownY + cornerCut).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

        // Step facets
        const stepSize = (pavilionY - crownY) * 0.25;
        for (let i = 1; i <= 3; i++) {
            const inset = i * 3;
            const y1 = crownY + stepSize * i;
            const y2 = pavilionY - stepSize * (4 - i);
            facets.push(`
                M ${(left + inset).toFixed(2)} ${y1.toFixed(2)}
                L ${(right - inset).toFixed(2)} ${y1.toFixed(2)}
                L ${(right - inset).toFixed(2)} ${y2.toFixed(2)}
                L ${(left + inset).toFixed(2)} ${y2.toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim());
        }

    } else {
        // Oval cut
        const k = 0.5522847498;
        const ovalWidth = width / 2;
        const ovalHeight = height / 2;

        outline = `
            M ${cx.toFixed(2)} ${(cy - ovalHeight).toFixed(2)}
            C ${(cx + ovalWidth * k).toFixed(2)} ${(cy - ovalHeight).toFixed(2)},
              ${(cx + ovalWidth).toFixed(2)} ${(cy - ovalHeight * k).toFixed(2)},
              ${(cx + ovalWidth).toFixed(2)} ${cy.toFixed(2)}
            C ${(cx + ovalWidth).toFixed(2)} ${(cy + ovalHeight * k).toFixed(2)},
              ${(cx + ovalWidth * k).toFixed(2)} ${(cy + ovalHeight).toFixed(2)},
              ${cx.toFixed(2)} ${(cy + ovalHeight).toFixed(2)}
            C ${(cx - ovalWidth * k).toFixed(2)} ${(cy + ovalHeight).toFixed(2)},
              ${(cx - ovalWidth).toFixed(2)} ${(cy + ovalHeight * k).toFixed(2)},
              ${(cx - ovalWidth).toFixed(2)} ${cy.toFixed(2)}
            C ${(cx - ovalWidth).toFixed(2)} ${(cy - ovalHeight * k).toFixed(2)},
              ${(cx - ovalWidth * k).toFixed(2)} ${(cy - ovalHeight).toFixed(2)},
              ${cx.toFixed(2)} ${(cy - ovalHeight).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

        // Radial facets for oval
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const nextAngle = ((i + 1) / 6) * Math.PI * 2;

            const innerR = 8;
            const outerR = Math.min(ovalWidth, ovalHeight) * 0.8;

            facets.push(`
                M ${cx.toFixed(2)} ${cy.toFixed(2)}
                L ${(cx + Math.cos(angle) * outerR).toFixed(2)} ${(cy + Math.sin(angle) * outerR * 0.8).toFixed(2)}
                L ${(cx + Math.cos(nextAngle) * outerR).toFixed(2)} ${(cy + Math.sin(nextAngle) * outerR * 0.8).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim());
        }
    }

    return { outline, facets };
}

function generateSparklePath(
    cx: number,
    cy: number,
    size: number = 4
): string {
    return `
        M ${cx.toFixed(2)} ${(cy - size).toFixed(2)}
        L ${(cx + size * 0.2).toFixed(2)} ${(cy - size * 0.2).toFixed(2)}
        L ${(cx + size).toFixed(2)} ${cy.toFixed(2)}
        L ${(cx + size * 0.2).toFixed(2)} ${(cy + size * 0.2).toFixed(2)}
        L ${cx.toFixed(2)} ${(cy + size).toFixed(2)}
        L ${(cx - size * 0.2).toFixed(2)} ${(cy + size * 0.2).toFixed(2)}
        L ${(cx - size).toFixed(2)} ${cy.toFixed(2)}
        L ${(cx - size * 0.2).toFixed(2)} ${(cy - size * 0.2).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleDiamondGem(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateDiamondGemParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('diamond-gem', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 135 + algoParams.lightDirection * 0.2,
        stops: [
            { offset: 0, color: lighten(primaryColor, 35) },
            { offset: 0.3, color: lighten(primaryColor, 20) },
            { offset: 0.6, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Facet gradient (lighter)
    const facetGradId = `${uniqueId}-facet`;
    svg.addGradient(facetGradId, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 40) },
            { offset: 1, color: lighten(primaryColor, 15) },
        ],
    });

    // Generate diamond paths
    const { outline, facets } = generateDiamondPath(algoParams, cx, cy);

    // Main diamond outline
    svg.path(outline, { fill: `url(#${gradientId})` });

    // Facets
    facets.forEach((facet, i) => {
        const opacity = 0.3 + (i % 2) * 0.2;
        svg.path(facet, {
            fill: i % 2 === 0 ? lighten(primaryColor, 30) : darken(primaryColor, 10),
            fillOpacity: opacity.toString(),
        });
    });

    // Sparkles
    if (algoParams.sparkleCount > 0) {
        const sparklePositions = [
            { x: cx - 8, y: cy - 15 },
            { x: cx + 12, y: cy - 8 },
            { x: cx - 5, y: cy + 5 },
            { x: cx + 8, y: cy + 12 },
        ];

        for (let i = 0; i < Math.min(algoParams.sparkleCount, 4); i++) {
            const pos = sparklePositions[i];
            const sparklePath = generateSparklePath(pos.x, pos.y, 3 - i * 0.3);
            svg.path(sparklePath, { fill: accentColor || '#FFFFFF', fillOpacity: '0.8' });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'diamond-gem', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'diamond-gem',
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
                bezierCurves: algoParams.brillianceCut === 'oval',
                symmetry: 'vertical',
                pathCount: 1 + facets.length + algoParams.sparkleCount,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, lighten(primaryColor, 35)],
            },
        },
    };

    return { logo, quality };
}

export function generateDiamondGem(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleDiamondGem(params, hashParams, v);

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
                algorithm: 'diamond-gem',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleDiamondGemPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateDiamondGemParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(primaryColor, 30) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    const { outline } = generateDiamondPath(params, size / 2, size / 2);
    svg.path(outline, { fill: 'url(#main)' });

    return svg.build();
}
