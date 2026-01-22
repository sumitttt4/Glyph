/**
 * DNA Helix Generator (Biotech-style)
 *
 * Creates double helix DNA structures
 * Scientific and biotech aesthetic
 * Inspired by biotech and life science brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    DnaHelixParams,
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

function generateDnaHelixParams(hashParams: HashParams, rng: () => number): DnaHelixParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const bonds: Array<'lines' | 'dots' | 'bars'> = ['lines', 'dots', 'bars'];

    return {
        ...base,
        helixTurns: derived.curveTension * 1.5 + 1,
        baseSpacing: derived.spacingFactor * 4 + 6,
        strandWidth: derived.strokeWidth * 2 + 2,
        bondStyle: bonds[Math.floor(derived.styleVariant % 3)],
        helixRadius: derived.scaleFactor * 8 + 12,
        verticalStretch: derived.taperRatio * 0.4 + 0.8,
        bondCount: Math.max(4, Math.min(10, Math.floor(derived.elementCount * 0.8 + 4))),
        glowEffect: derived.organicAmount > 0.5,
        gradientStrands: derived.layerCount > 2,
        rotation: derived.rotationOffset * 0.5,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateHelixStrandPath(
    cx: number,
    cy: number,
    params: DnaHelixParams,
    isSecondStrand: boolean
): string {
    const { helixTurns, helixRadius, verticalStretch } = params;

    const height = 60 * verticalStretch;
    const segments = 20;
    const segmentHeight = height / segments;

    const phaseOffset = isSecondStrand ? Math.PI : 0;
    let path = '';

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * helixTurns * Math.PI * 2 + phaseOffset;
        const x = cx + Math.cos(angle) * helixRadius;
        const y = cy - height / 2 + t * height;

        if (i === 0) {
            path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
        } else {
            const prevT = (i - 1) / segments;
            const prevAngle = prevT * helixTurns * Math.PI * 2 + phaseOffset;
            const prevX = cx + Math.cos(prevAngle) * helixRadius;
            const prevY = cy - height / 2 + prevT * height;

            // Control points for smooth curve
            const cp1x = prevX + (x - prevX) * 0.3;
            const cp1y = prevY + segmentHeight * 0.3;
            const cp2x = x - (x - prevX) * 0.3;
            const cp2y = y - segmentHeight * 0.3;

            path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`;
        }
    }

    return path;
}

function generateBondPath(
    cx: number,
    cy: number,
    params: DnaHelixParams,
    bondIndex: number,
    totalBonds: number
): string {
    const { helixTurns, helixRadius, verticalStretch, bondStyle } = params;

    const height = 60 * verticalStretch;
    const t = (bondIndex + 0.5) / totalBonds;
    const y = cy - height / 2 + t * height;
    const angle = t * helixTurns * Math.PI * 2;

    const x1 = cx + Math.cos(angle) * helixRadius;
    const x2 = cx + Math.cos(angle + Math.PI) * helixRadius;

    if (bondStyle === 'dots') {
        const midX = (x1 + x2) / 2;
        const dotR = 2;
        const k = 0.5522847498;

        return `
            M ${midX.toFixed(2)} ${(y - dotR).toFixed(2)}
            C ${(midX + dotR * k).toFixed(2)} ${(y - dotR).toFixed(2)},
              ${(midX + dotR).toFixed(2)} ${(y - dotR * k).toFixed(2)},
              ${(midX + dotR).toFixed(2)} ${y.toFixed(2)}
            C ${(midX + dotR).toFixed(2)} ${(y + dotR * k).toFixed(2)},
              ${(midX + dotR * k).toFixed(2)} ${(y + dotR).toFixed(2)},
              ${midX.toFixed(2)} ${(y + dotR).toFixed(2)}
            C ${(midX - dotR * k).toFixed(2)} ${(y + dotR).toFixed(2)},
              ${(midX - dotR).toFixed(2)} ${(y + dotR * k).toFixed(2)},
              ${(midX - dotR).toFixed(2)} ${y.toFixed(2)}
            C ${(midX - dotR).toFixed(2)} ${(y - dotR * k).toFixed(2)},
              ${(midX - dotR * k).toFixed(2)} ${(y - dotR).toFixed(2)},
              ${midX.toFixed(2)} ${(y - dotR).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    } else if (bondStyle === 'bars') {
        const barHeight = 3;
        return `
            M ${x1.toFixed(2)} ${(y - barHeight / 2).toFixed(2)}
            L ${x2.toFixed(2)} ${(y - barHeight / 2).toFixed(2)}
            L ${x2.toFixed(2)} ${(y + barHeight / 2).toFixed(2)}
            L ${x1.toFixed(2)} ${(y + barHeight / 2).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    } else {
        // Lines
        return `
            M ${x1.toFixed(2)} ${y.toFixed(2)}
            L ${x2.toFixed(2)} ${y.toFixed(2)}
        `.replace(/\s+/g, ' ').trim();
    }
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleDnaHelix(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateDnaHelixParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('dna-helix', variant);

    // Strand gradients
    const strand1GradId = `${uniqueId}-strand1`;
    const strand2GradId = `${uniqueId}-strand2`;

    svg.addGradient(strand1GradId, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    svg.addGradient(strand2GradId, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: accentColor || lighten(primaryColor, 30) },
            { offset: 0.5, color: accentColor || primaryColor },
            { offset: 1, color: darken(accentColor || primaryColor, 15) },
        ],
    });

    // Glow effect
    if (algoParams.glowEffect) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0.3, color: primaryColor, opacity: 0.2 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });

        const glowPath = `
            M ${(cx - algoParams.helixRadius - 10).toFixed(2)} ${(cy - 35).toFixed(2)}
            L ${(cx + algoParams.helixRadius + 10).toFixed(2)} ${(cy - 35).toFixed(2)}
            L ${(cx + algoParams.helixRadius + 10).toFixed(2)} ${(cy + 35).toFixed(2)}
            L ${(cx - algoParams.helixRadius - 10).toFixed(2)} ${(cy + 35).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    // Bonds (behind strands for depth)
    for (let i = 0; i < algoParams.bondCount; i++) {
        const bondPath = generateBondPath(cx, cy, algoParams, i, algoParams.bondCount);

        if (algoParams.bondStyle === 'lines') {
            svg.path(bondPath, {
                fill: 'none',
                stroke: darken(primaryColor, 10),
                strokeWidth: '1.5',
                strokeOpacity: '0.6',
            });
        } else {
            svg.path(bondPath, {
                fill: darken(primaryColor, 10),
                fillOpacity: '0.7',
            });
        }
    }

    // First strand
    const strand1Path = generateHelixStrandPath(cx, cy, algoParams, false);
    svg.path(strand1Path, {
        fill: 'none',
        stroke: algoParams.gradientStrands ? `url(#${strand1GradId})` : primaryColor,
        strokeWidth: algoParams.strandWidth.toString(),
        strokeLinecap: 'round',
    });

    // Second strand
    const strand2Path = generateHelixStrandPath(cx, cy, algoParams, true);
    svg.path(strand2Path, {
        fill: 'none',
        stroke: algoParams.gradientStrands ? `url(#${strand2GradId})` : (accentColor || lighten(primaryColor, 20)),
        strokeWidth: algoParams.strandWidth.toString(),
        strokeLinecap: 'round',
    });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'dna-helix', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'dna-helix',
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
                symmetry: 'rotational',
                pathCount: 2 + algoParams.bondCount,
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 20)],
            },
        },
    };

    return { logo, quality };
}

export function generateDnaHelix(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'healthcare' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleDnaHelix(params, hashParams, v);

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
                algorithm: 'dna-helix',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleDnaHelixPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'healthcare');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateDnaHelixParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const strand1Path = generateHelixStrandPath(size / 2, size / 2, params, false);
    svg.path(strand1Path, {
        fill: 'none',
        stroke: primaryColor,
        strokeWidth: params.strandWidth.toString(),
        strokeLinecap: 'round',
    });

    const strand2Path = generateHelixStrandPath(size / 2, size / 2, params, true);
    svg.path(strand2Path, {
        fill: 'none',
        stroke: accentColor || lighten(primaryColor, 20),
        strokeWidth: params.strandWidth.toString(),
        strokeLinecap: 'round',
    });

    return svg.build();
}
