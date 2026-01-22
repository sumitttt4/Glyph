/**
 * Star Mark Generator (Rating/Awards-style)
 *
 * Creates various star shapes from classic to modern
 * Multiple point counts and ray styles
 * Inspired by rating systems and award badges
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    StarMarkParams,
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

function generateStarMarkParams(hashParams: HashParams, rng: () => number): StarMarkParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const rays: Array<'pointed' | 'rounded' | 'beveled' | 'split'> = ['pointed', 'rounded', 'beveled', 'split'];

    return {
        ...base,
        pointCount: Math.max(4, Math.min(8, Math.floor(derived.elementCount * 0.4 + 4))),
        innerRadius: derived.centerRadius * 0.4 + 0.3,
        rotationOffset: derived.rotationOffset,
        rayStyle: rays[Math.floor(derived.styleVariant % 4)],
        outerRadius: derived.scaleFactor * 8 + 32,
        pointSharpness: derived.curveTension,
        innerStar: derived.layerCount > 2,
        innerScale: derived.taperRatio * 0.3 + 0.3,
        glowRays: derived.organicAmount > 0.6,
        dimensionalEffect: derived.perspectiveStrength > 0.5,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateStarPath(
    params: StarMarkParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { pointCount, innerRadius, outerRadius, rotationOffset, rayStyle, pointSharpness } = params;

    const outer = outerRadius * scale;
    const inner = outer * innerRadius;
    const angleStep = Math.PI / pointCount;
    const rotation = (rotationOffset * Math.PI) / 180 - Math.PI / 2;

    let path = '';

    for (let i = 0; i < pointCount * 2; i++) {
        const angle = rotation + i * angleStep;
        const isOuter = i % 2 === 0;
        const r = isOuter ? outer : inner;
        const x = cx + r * Math.cos(angle);
        const y = cy + r * Math.sin(angle);

        if (i === 0) {
            path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
        } else if (rayStyle === 'rounded') {
            const prevAngle = rotation + (i - 1) * angleStep;
            const prevR = (i - 1) % 2 === 0 ? outer : inner;
            const prevX = cx + prevR * Math.cos(prevAngle);
            const prevY = cy + prevR * Math.sin(prevAngle);

            const midAngle = (prevAngle + angle) / 2;
            const midR = (prevR + r) / 2 + (isOuter ? 2 : -2) * pointSharpness;
            const midX = cx + midR * Math.cos(midAngle);
            const midY = cy + midR * Math.sin(midAngle);

            path += ` Q ${midX.toFixed(2)} ${midY.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`;
        } else if (rayStyle === 'beveled' && isOuter) {
            // Add bevel before outer points
            const bevelAngle1 = angle - angleStep * 0.15;
            const bevelAngle2 = angle + angleStep * 0.15;
            const bevelR = outer * 0.92;

            const bevelX1 = cx + bevelR * Math.cos(bevelAngle1);
            const bevelY1 = cy + bevelR * Math.sin(bevelAngle1);
            const bevelX2 = cx + bevelR * Math.cos(bevelAngle2);
            const bevelY2 = cy + bevelR * Math.sin(bevelAngle2);

            path += ` L ${bevelX1.toFixed(2)} ${bevelY1.toFixed(2)}`;
            path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
            path += ` L ${bevelX2.toFixed(2)} ${bevelY2.toFixed(2)}`;
        } else if (rayStyle === 'split' && isOuter) {
            // Split ray effect
            const splitGap = outer * 0.08;
            const splitAngle1 = angle - 0.05;
            const splitAngle2 = angle + 0.05;

            const splitX1 = cx + outer * Math.cos(splitAngle1);
            const splitY1 = cy + outer * Math.sin(splitAngle1);
            const splitX2 = cx + outer * Math.cos(splitAngle2);
            const splitY2 = cy + outer * Math.sin(splitAngle2);

            const gapX = cx + (outer - splitGap) * Math.cos(angle);
            const gapY = cy + (outer - splitGap) * Math.sin(angle);

            path += ` L ${splitX1.toFixed(2)} ${splitY1.toFixed(2)}`;
            path += ` L ${gapX.toFixed(2)} ${gapY.toFixed(2)}`;
            path += ` L ${splitX2.toFixed(2)} ${splitY2.toFixed(2)}`;
        } else {
            path += ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
        }
    }

    path += ' Z';
    return path;
}

function generateGlowRayPath(
    cx: number,
    cy: number,
    innerR: number,
    outerR: number,
    angle: number
): string {
    const innerX = cx + innerR * Math.cos(angle);
    const innerY = cy + innerR * Math.sin(angle);
    const outerX = cx + outerR * Math.cos(angle);
    const outerY = cy + outerR * Math.sin(angle);

    const perpAngle = angle + Math.PI / 2;
    const spread = 2;

    const startX1 = innerX + spread * Math.cos(perpAngle);
    const startY1 = innerY + spread * Math.sin(perpAngle);
    const startX2 = innerX - spread * Math.cos(perpAngle);
    const startY2 = innerY - spread * Math.sin(perpAngle);

    return `
        M ${startX1.toFixed(2)} ${startY1.toFixed(2)}
        L ${outerX.toFixed(2)} ${outerY.toFixed(2)}
        L ${startX2.toFixed(2)} ${startY2.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleStarMark(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateStarMarkParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('star-mark', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 25) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Glow rays (behind main star)
    if (algoParams.glowRays) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'linear',
            angle: 0,
            stops: [
                { offset: 0, color: accentColor || lighten(primaryColor, 40), opacity: 0.6 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });

        for (let i = 0; i < algoParams.pointCount; i++) {
            const angle = (i / algoParams.pointCount) * Math.PI * 2 + (algoParams.rotationOffset * Math.PI) / 180 - Math.PI / 2;
            const rayPath = generateGlowRayPath(cx, cy, algoParams.outerRadius, algoParams.outerRadius + 8, angle);
            svg.path(rayPath, { fill: `url(#${glowGradId})` });
        }
    }

    // Dimensional effect (shadow layer)
    if (algoParams.dimensionalEffect) {
        const shadowPath = generateStarPath(algoParams, cx + 2, cy + 2);
        svg.path(shadowPath, { fill: darken(primaryColor, 30), fillOpacity: '0.3' });
    }

    // Main star
    const starPath = generateStarPath(algoParams, cx, cy);
    svg.path(starPath, { fill: `url(#${gradientId})` });

    // Inner star
    if (algoParams.innerStar) {
        const innerStarPath = generateStarPath(algoParams, cx, cy, algoParams.innerScale);
        svg.path(innerStarPath, { fill: accentColor || lighten(primaryColor, 35) });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'star-mark', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'star-mark',
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
                bezierCurves: algoParams.rayStyle === 'rounded',
                symmetry: 'rotational',
                pathCount: 1 + (algoParams.innerStar ? 1 : 0) + (algoParams.glowRays ? algoParams.pointCount : 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 35)],
            },
        },
    };

    return { logo, quality };
}

export function generateStarMark(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleStarMark(params, hashParams, v);

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
                algorithm: 'star-mark',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleStarMarkPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateStarMarkParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 20) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    const path = generateStarPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
