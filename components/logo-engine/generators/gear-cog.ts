/**
 * Gear Cog Generator (Engineering/Industrial-style)
 *
 * Creates mechanical gear shapes with teeth details
 * Precision engineering aesthetic
 * Inspired by industrial and engineering brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    GearCogParams,
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

function generateGearCogParams(hashParams: HashParams, rng: () => number): GearCogParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const spokes: Array<'none' | 'lines' | 'curved' | 'holes'> = ['none', 'lines', 'curved', 'holes'];

    return {
        ...base,
        toothCount: Math.max(8, Math.min(20, Math.floor(derived.elementCount * 1.2 + 8))),
        toothDepth: derived.curveTension * 6 + 4,
        hubSize: derived.centerRadius * 0.3 + 0.2,
        spokeStyle: spokes[Math.floor(derived.styleVariant % 4)],
        toothShape: derived.taperRatio > 0.5 ? 'rounded' : 'squared',
        innerRing: derived.layerCount > 2,
        bevelEffect: derived.perspectiveStrength > 0.5,
        spokeCount: Math.max(3, Math.min(8, Math.floor(derived.colorPlacement * 5 + 3))),
        outerRadius: derived.scaleFactor * 8 + 32,
        toothWidth: derived.strokeWidth * 0.3 + 0.4,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateGearPath(
    params: GearCogParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { toothCount, toothDepth, outerRadius, toothShape, toothWidth } = params;

    const innerRadius = (outerRadius - toothDepth) * scale;
    const outer = outerRadius * scale;
    const depth = toothDepth * scale;

    let path = '';
    const angleStep = (Math.PI * 2) / toothCount;
    const toothAngle = angleStep * toothWidth;
    const gapAngle = angleStep * (1 - toothWidth);

    for (let i = 0; i < toothCount; i++) {
        const startAngle = i * angleStep - Math.PI / 2;

        // Inner arc start
        const innerStartX = cx + innerRadius * Math.cos(startAngle);
        const innerStartY = cy + innerRadius * Math.sin(startAngle);

        if (i === 0) {
            path += `M ${innerStartX.toFixed(2)} ${innerStartY.toFixed(2)}`;
        }

        // Tooth rise
        const toothStartAngle = startAngle + gapAngle * 0.5;
        const toothStartX = cx + innerRadius * Math.cos(toothStartAngle);
        const toothStartY = cy + innerRadius * Math.sin(toothStartAngle);

        // Tooth outer points
        const toothOuterStart = toothStartAngle;
        const toothOuterEnd = toothStartAngle + toothAngle;

        const outerStartX = cx + outer * Math.cos(toothOuterStart);
        const outerStartY = cy + outer * Math.sin(toothOuterStart);
        const outerEndX = cx + outer * Math.cos(toothOuterEnd);
        const outerEndY = cy + outer * Math.sin(toothOuterEnd);

        // Tooth end inner point
        const toothEndAngle = toothOuterEnd;
        const toothEndX = cx + innerRadius * Math.cos(toothEndAngle);
        const toothEndY = cy + innerRadius * Math.sin(toothEndAngle);

        // Inner arc to tooth start
        const arcMidAngle = (startAngle + toothStartAngle) / 2;
        const arcMidX = cx + innerRadius * Math.cos(arcMidAngle);
        const arcMidY = cy + innerRadius * Math.sin(arcMidAngle);

        path += ` C ${arcMidX.toFixed(2)} ${arcMidY.toFixed(2)},`;
        path += ` ${toothStartX.toFixed(2)} ${toothStartY.toFixed(2)},`;
        path += ` ${toothStartX.toFixed(2)} ${toothStartY.toFixed(2)}`;

        // Rise to tooth
        if (toothShape === 'rounded') {
            const cp1X = toothStartX + (outerStartX - toothStartX) * 0.3;
            const cp1Y = toothStartY + (outerStartY - toothStartY) * 0.3;
            path += ` C ${cp1X.toFixed(2)} ${cp1Y.toFixed(2)},`;
            path += ` ${outerStartX.toFixed(2)} ${outerStartY.toFixed(2)},`;
            path += ` ${outerStartX.toFixed(2)} ${outerStartY.toFixed(2)}`;
        } else {
            path += ` L ${outerStartX.toFixed(2)} ${outerStartY.toFixed(2)}`;
        }

        // Tooth top arc
        const toothMidAngle = (toothOuterStart + toothOuterEnd) / 2;
        const toothMidX = cx + outer * Math.cos(toothMidAngle);
        const toothMidY = cy + outer * Math.sin(toothMidAngle);

        path += ` C ${toothMidX.toFixed(2)} ${toothMidY.toFixed(2)},`;
        path += ` ${outerEndX.toFixed(2)} ${outerEndY.toFixed(2)},`;
        path += ` ${outerEndX.toFixed(2)} ${outerEndY.toFixed(2)}`;

        // Fall from tooth
        if (toothShape === 'rounded') {
            const cp2X = outerEndX + (toothEndX - outerEndX) * 0.7;
            const cp2Y = outerEndY + (toothEndY - outerEndY) * 0.7;
            path += ` C ${cp2X.toFixed(2)} ${cp2Y.toFixed(2)},`;
            path += ` ${toothEndX.toFixed(2)} ${toothEndY.toFixed(2)},`;
            path += ` ${toothEndX.toFixed(2)} ${toothEndY.toFixed(2)}`;
        } else {
            path += ` L ${toothEndX.toFixed(2)} ${toothEndY.toFixed(2)}`;
        }
    }

    path += ' Z';
    return path;
}

function generateHubPath(
    cx: number,
    cy: number,
    hubRadius: number
): string {
    const k = 0.5522847498;
    return `
        M ${cx.toFixed(2)} ${(cy - hubRadius).toFixed(2)}
        C ${(cx + hubRadius * k).toFixed(2)} ${(cy - hubRadius).toFixed(2)},
          ${(cx + hubRadius).toFixed(2)} ${(cy - hubRadius * k).toFixed(2)},
          ${(cx + hubRadius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx + hubRadius).toFixed(2)} ${(cy + hubRadius * k).toFixed(2)},
          ${(cx + hubRadius * k).toFixed(2)} ${(cy + hubRadius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy + hubRadius).toFixed(2)}
        C ${(cx - hubRadius * k).toFixed(2)} ${(cy + hubRadius).toFixed(2)},
          ${(cx - hubRadius).toFixed(2)} ${(cy + hubRadius * k).toFixed(2)},
          ${(cx - hubRadius).toFixed(2)} ${cy.toFixed(2)}
        C ${(cx - hubRadius).toFixed(2)} ${(cy - hubRadius * k).toFixed(2)},
          ${(cx - hubRadius * k).toFixed(2)} ${(cy - hubRadius).toFixed(2)},
          ${cx.toFixed(2)} ${(cy - hubRadius).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateSpokePath(
    cx: number,
    cy: number,
    innerRadius: number,
    outerRadius: number,
    angle: number,
    style: 'lines' | 'curved'
): string {
    const innerX = cx + innerRadius * Math.cos(angle);
    const innerY = cy + innerRadius * Math.sin(angle);
    const outerX = cx + outerRadius * Math.cos(angle);
    const outerY = cy + outerRadius * Math.sin(angle);

    if (style === 'curved') {
        const midRadius = (innerRadius + outerRadius) / 2;
        const curveOffset = 5;
        const midX = cx + midRadius * Math.cos(angle) + curveOffset * Math.cos(angle + Math.PI / 2);
        const midY = cy + midRadius * Math.sin(angle) + curveOffset * Math.sin(angle + Math.PI / 2);

        return `
            M ${innerX.toFixed(2)} ${innerY.toFixed(2)}
            C ${midX.toFixed(2)} ${midY.toFixed(2)},
              ${midX.toFixed(2)} ${midY.toFixed(2)},
              ${outerX.toFixed(2)} ${outerY.toFixed(2)}
        `.replace(/\s+/g, ' ').trim();
    }

    return `
        M ${innerX.toFixed(2)} ${innerY.toFixed(2)}
        L ${outerX.toFixed(2)} ${outerY.toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleGearCog(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateGearCogParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('gear-cog', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 0.7, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 20) },
        ],
    });

    // Main gear
    const gearPath = generateGearPath(algoParams, cx, cy);
    svg.path(gearPath, { fill: `url(#${gradientId})` });

    // Inner ring
    if (algoParams.innerRing) {
        const innerRingRadius = (algoParams.outerRadius - algoParams.toothDepth) * 0.7;
        const innerRingPath = generateHubPath(cx, cy, innerRingRadius);
        svg.path(innerRingPath, { fill: darken(primaryColor, 15) });
    }

    // Hub
    const hubRadius = algoParams.outerRadius * algoParams.hubSize;
    const hubPath = generateHubPath(cx, cy, hubRadius);
    svg.path(hubPath, { fill: accentColor || lighten(primaryColor, 30) });

    // Center hole
    const holePath = generateHubPath(cx, cy, hubRadius * 0.4);
    svg.path(holePath, { fill: darken(primaryColor, 30) });

    // Spokes
    if (algoParams.spokeStyle === 'lines' || algoParams.spokeStyle === 'curved') {
        const spokeInner = hubRadius * 1.1;
        const spokeOuter = (algoParams.outerRadius - algoParams.toothDepth) * 0.9;

        for (let i = 0; i < algoParams.spokeCount; i++) {
            const angle = (i / algoParams.spokeCount) * Math.PI * 2 - Math.PI / 2;
            const spokePath = generateSpokePath(cx, cy, spokeInner, spokeOuter, angle, algoParams.spokeStyle);
            svg.path(spokePath, {
                fill: 'none',
                stroke: darken(primaryColor, 10),
                strokeWidth: '2.5',
                strokeLinecap: 'round',
            });
        }
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'gear-cog', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'gear-cog',
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
                pathCount: 3 + (algoParams.innerRing ? 1 : 0) + (algoParams.spokeStyle !== 'none' ? algoParams.spokeCount : 0),
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

export function generateGearCog(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleGearCog(params, hashParams, v);

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
                algorithm: 'gear-cog',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleGearCogPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateGearCogParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    const path = generateGearPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
