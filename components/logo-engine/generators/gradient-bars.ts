/**
 * Gradient Bars Generator (Stripe-style)
 *
 * Creates parallel diagonal bars with gradient fills
 * Clean, modern fintech aesthetic
 * All shapes use bezier curves only
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    GradientBarsParams,
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
    createBezierRoundedRect,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateGradientBarsParams(hashParams: HashParams, rng: () => number): GradientBarsParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    return {
        ...base,
        barCount: Math.max(2, Math.min(6, Math.round(derived.elementCount / 3))),
        barWidth: Math.max(8, Math.min(25, derived.strokeWidth * 2)),
        barAngle: derived.rotationOffset > 180 ? -(derived.rotationOffset - 180) / 4 : derived.rotationOffset / 4 - 22.5,
        barGap: Math.max(3, Math.min(15, derived.spacingFactor * 5)),
        barRoundness: derived.curveTension,
        gradientIntensity: derived.organicAmount,
        staggerAmount: derived.jitterAmount * 3,
    };
}

// ============================================
// BAR PATH GENERATION
// ============================================

/**
 * Generate a single diagonal bar using bezier curves
 */
function generateBarPath(
    params: GradientBarsParams,
    index: number,
    totalBars: number,
    viewSize: number
): string {
    const padding = viewSize * 0.1;
    const totalWidth = viewSize - padding * 2;
    const barWidth = params.barWidth;
    const barGap = params.barGap;
    const groupWidth = totalBars * barWidth + (totalBars - 1) * barGap;
    const startX = (viewSize - groupWidth) / 2;

    // Calculate bar position
    const barX = startX + index * (barWidth + barGap);

    // Stagger for visual interest
    const stagger = params.staggerAmount * (index % 2 === 0 ? 1 : -1) * 0.1;

    // Bar dimensions
    const barHeight = viewSize * 0.75;
    const barY = (viewSize - barHeight) / 2 + stagger;

    // Calculate roundness
    const cornerRadius = barWidth * params.barRoundness * 0.5;

    // Apply rotation by calculating transformed corners
    const angleRad = (params.barAngle * Math.PI) / 180;
    const centerX = barX + barWidth / 2;
    const centerY = viewSize / 2;

    // Create rotated rounded rectangle using bezier curves
    return createRotatedRoundedBar(
        centerX,
        centerY,
        barWidth,
        barHeight,
        cornerRadius,
        angleRad
    );
}

/**
 * Create a rotated rounded bar using bezier curves
 */
function createRotatedRoundedBar(
    cx: number,
    cy: number,
    width: number,
    height: number,
    radius: number,
    angle: number
): string {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    const halfW = width / 2;
    const halfH = height / 2;
    const r = Math.min(radius, halfW, halfH);
    const k = 0.5522847498; // Bezier circle constant

    // Helper to rotate point around center
    const rotate = (x: number, y: number) => ({
        x: cx + (x - cx) * cos - (y - cy) * sin,
        y: cy + (x - cx) * sin + (y - cy) * cos,
    });

    // Corner points (before rotation)
    const corners = {
        topLeft: { x: cx - halfW, y: cy - halfH },
        topRight: { x: cx + halfW, y: cy - halfH },
        bottomRight: { x: cx + halfW, y: cy + halfH },
        bottomLeft: { x: cx - halfW, y: cy + halfH },
    };

    // Build the path with bezier corners
    const p = (pt: { x: number; y: number }) => `${pt.x.toFixed(2)} ${pt.y.toFixed(2)}`;

    // Start at top-left corner (after corner radius)
    const start = rotate(corners.topLeft.x + r, corners.topLeft.y);

    let path = `M ${p(start)}`;

    // Top edge
    const topEnd = rotate(corners.topRight.x - r, corners.topRight.y);
    path += ` L ${p(topEnd)}`;

    // Top-right corner
    const tr1 = rotate(corners.topRight.x - r + r * k, corners.topRight.y);
    const tr2 = rotate(corners.topRight.x, corners.topRight.y + r - r * k);
    const tr3 = rotate(corners.topRight.x, corners.topRight.y + r);
    path += ` C ${p(tr1)}, ${p(tr2)}, ${p(tr3)}`;

    // Right edge
    const rightEnd = rotate(corners.bottomRight.x, corners.bottomRight.y - r);
    path += ` L ${p(rightEnd)}`;

    // Bottom-right corner
    const br1 = rotate(corners.bottomRight.x, corners.bottomRight.y - r + r * k);
    const br2 = rotate(corners.bottomRight.x - r + r * k, corners.bottomRight.y);
    const br3 = rotate(corners.bottomRight.x - r, corners.bottomRight.y);
    path += ` C ${p(br1)}, ${p(br2)}, ${p(br3)}`;

    // Bottom edge
    const bottomEnd = rotate(corners.bottomLeft.x + r, corners.bottomLeft.y);
    path += ` L ${p(bottomEnd)}`;

    // Bottom-left corner
    const bl1 = rotate(corners.bottomLeft.x + r - r * k, corners.bottomLeft.y);
    const bl2 = rotate(corners.bottomLeft.x, corners.bottomLeft.y - r + r * k);
    const bl3 = rotate(corners.bottomLeft.x, corners.bottomLeft.y - r);
    path += ` C ${p(bl1)}, ${p(bl2)}, ${p(bl3)}`;

    // Left edge
    const leftEnd = rotate(corners.topLeft.x, corners.topLeft.y + r);
    path += ` L ${p(leftEnd)}`;

    // Top-left corner
    const tl1 = rotate(corners.topLeft.x, corners.topLeft.y + r - r * k);
    const tl2 = rotate(corners.topLeft.x + r - r * k, corners.topLeft.y);
    path += ` C ${p(tl1)}, ${p(tl2)}, ${p(start)}`;

    path += ' Z';

    return path;
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleGradientBars(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateGradientBarsParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('gradient-bars', variant);

    // Generate and render bars
    for (let i = 0; i < algoParams.barCount; i++) {
        const barPath = generateBarPath(algoParams, i, algoParams.barCount, size);
        const barGradId = `${uniqueId}-bar-${i}`;
        const t = i / (algoParams.barCount - 1);

        // Create gradient for each bar
        const gradientAngle = algoParams.barAngle + 90;
        svg.addGradient(barGradId, {
            type: 'linear',
            angle: gradientAngle,
            stops: [
                { offset: 0, color: mixColors(lighten(primaryColor, 20), accentColor || primaryColor, t) },
                { offset: 1, color: mixColors(primaryColor, accentColor || darken(primaryColor, 15), t) },
            ],
        });

        svg.path(barPath, { fill: `url(#${barGradId})` });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'gradient-bars', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'gradient-bars',
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
                pathCount: algoParams.barCount,
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

export function generateGradientBars(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'finance' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleGradientBars(params, hashParams, v);

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
                algorithm: 'gradient-bars',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleGradientBarsPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'finance');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateGradientBarsParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    for (let i = 0; i < params.barCount; i++) {
        const barPath = generateBarPath(params, i, params.barCount, size);
        const t = i / (params.barCount - 1);

        svg.addGradient(`bar-${i}`, {
            type: 'linear',
            angle: params.barAngle + 90,
            stops: [
                { offset: 0, color: mixColors(primaryColor, accentColor || primaryColor, t) },
                { offset: 1, color: mixColors(primaryColor, darken(primaryColor, 20), t) },
            ],
        });

        svg.path(barPath, { fill: `url(#bar-${i})` });
    }

    return svg.build();
}
