/**
 * Shield Badge Generator (Security Apps-style)
 *
 * Creates protective shield shapes with inner patterns
 * Classic to modern shield forms with crests and divisions
 * Inspired by security and trust-focused brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    ShieldBadgeParams,
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

function generateShieldBadgeParams(hashParams: HashParams, rng: () => number): ShieldBadgeParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const shapes: Array<'classic' | 'modern' | 'rounded' | 'pointed'> = ['classic', 'modern', 'rounded', 'pointed'];
    const patterns: Array<'none' | 'cross' | 'star' | 'chevron'> = ['none', 'cross', 'star', 'chevron'];
    const crests: Array<'flat' | 'curved' | 'pointed'> = ['flat', 'curved', 'pointed'];
    const divisions: Array<'none' | 'quarters' | 'horizontal' | 'vertical'> = ['none', 'quarters', 'horizontal', 'vertical'];

    return {
        ...base,
        shieldShape: shapes[Math.floor(derived.styleVariant % 4)],
        innerPattern: patterns[Math.floor((derived.styleVariant + derived.elementCount) % 4)],
        borderWidth: derived.strokeWidth * 0.5 + 2,
        crestStyle: crests[Math.floor(derived.colorPlacement % 3)],
        innerPadding: derived.spacingFactor * 5 + 5,
        divisionStyle: divisions[Math.floor(derived.layerCount % 4)],
        accentBand: derived.organicAmount > 0.5,
        bandPosition: derived.taperRatio * 0.4 + 0.3,
        embossEffect: derived.perspectiveStrength,
        cornerDetail: derived.bulgeAmount > 0.3,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateShieldPath(
    params: ShieldBadgeParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { shieldShape, crestStyle } = params;
    const width = 36 * scale;
    const height = 44 * scale;

    const left = cx - width / 2;
    const right = cx + width / 2;
    const top = cy - height / 2;
    const bottom = cy + height / 2;

    // Top edge control
    const topCurve = crestStyle === 'curved' ? -4 * scale : crestStyle === 'pointed' ? -8 * scale : 0;

    // Bottom point
    const bottomPointY = bottom + (shieldShape === 'pointed' ? 6 * scale : 0);
    const bottomCurve = shieldShape === 'rounded' ? 8 * scale : shieldShape === 'modern' ? 4 * scale : 2 * scale;

    // Side curves based on shape
    const sideCurve = shieldShape === 'classic' ? 4 * scale : shieldShape === 'rounded' ? 8 * scale : 2 * scale;

    return `
        M ${cx.toFixed(2)} ${(top + topCurve).toFixed(2)}
        C ${(cx - width * 0.3).toFixed(2)} ${top.toFixed(2)},
          ${left.toFixed(2)} ${top.toFixed(2)},
          ${left.toFixed(2)} ${(top + height * 0.1).toFixed(2)}
        C ${(left - sideCurve).toFixed(2)} ${(cy - height * 0.1).toFixed(2)},
          ${(left - sideCurve * 0.5).toFixed(2)} ${(cy + height * 0.2).toFixed(2)},
          ${(left + width * 0.1).toFixed(2)} ${(bottom - bottomCurve).toFixed(2)}
        C ${(left + width * 0.2).toFixed(2)} ${bottom.toFixed(2)},
          ${(cx - width * 0.1).toFixed(2)} ${bottomPointY.toFixed(2)},
          ${cx.toFixed(2)} ${(bottomPointY + bottomCurve * 0.5).toFixed(2)}
        C ${(cx + width * 0.1).toFixed(2)} ${bottomPointY.toFixed(2)},
          ${(right - width * 0.2).toFixed(2)} ${bottom.toFixed(2)},
          ${(right - width * 0.1).toFixed(2)} ${(bottom - bottomCurve).toFixed(2)}
        C ${(right + sideCurve * 0.5).toFixed(2)} ${(cy + height * 0.2).toFixed(2)},
          ${(right + sideCurve).toFixed(2)} ${(cy - height * 0.1).toFixed(2)},
          ${right.toFixed(2)} ${(top + height * 0.1).toFixed(2)}
        C ${right.toFixed(2)} ${top.toFixed(2)},
          ${(cx + width * 0.3).toFixed(2)} ${top.toFixed(2)},
          ${cx.toFixed(2)} ${(top + topCurve).toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function generateInnerPattern(
    params: ShieldBadgeParams,
    cx: number,
    cy: number
): string {
    const { innerPattern, innerPadding } = params;
    const size = 12;

    switch (innerPattern) {
        case 'cross':
            const crossWidth = 3;
            return `
                M ${(cx - crossWidth / 2).toFixed(2)} ${(cy - size / 2).toFixed(2)}
                C ${(cx - crossWidth / 2).toFixed(2)} ${(cy - size / 2).toFixed(2)},
                  ${(cx + crossWidth / 2).toFixed(2)} ${(cy - size / 2).toFixed(2)},
                  ${(cx + crossWidth / 2).toFixed(2)} ${(cy - size / 2).toFixed(2)}
                L ${(cx + crossWidth / 2).toFixed(2)} ${(cy - crossWidth / 2).toFixed(2)}
                L ${(cx + size / 2).toFixed(2)} ${(cy - crossWidth / 2).toFixed(2)}
                L ${(cx + size / 2).toFixed(2)} ${(cy + crossWidth / 2).toFixed(2)}
                L ${(cx + crossWidth / 2).toFixed(2)} ${(cy + crossWidth / 2).toFixed(2)}
                L ${(cx + crossWidth / 2).toFixed(2)} ${(cy + size / 2).toFixed(2)}
                L ${(cx - crossWidth / 2).toFixed(2)} ${(cy + size / 2).toFixed(2)}
                L ${(cx - crossWidth / 2).toFixed(2)} ${(cy + crossWidth / 2).toFixed(2)}
                L ${(cx - size / 2).toFixed(2)} ${(cy + crossWidth / 2).toFixed(2)}
                L ${(cx - size / 2).toFixed(2)} ${(cy - crossWidth / 2).toFixed(2)}
                L ${(cx - crossWidth / 2).toFixed(2)} ${(cy - crossWidth / 2).toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'chevron':
            return `
                M ${cx.toFixed(2)} ${(cy - size / 2).toFixed(2)}
                L ${(cx + size / 2).toFixed(2)} ${cy.toFixed(2)}
                L ${cx.toFixed(2)} ${(cy + size / 2).toFixed(2)}
                L ${(cx - size / 2).toFixed(2)} ${cy.toFixed(2)}
                Z
            `.replace(/\s+/g, ' ').trim();

        case 'star':
            const points = 5;
            const outerR = size / 2;
            const innerR = outerR * 0.4;
            let starPath = '';
            for (let i = 0; i < points * 2; i++) {
                const angle = (i * Math.PI) / points - Math.PI / 2;
                const r = i % 2 === 0 ? outerR : innerR;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                starPath += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
            }
            return starPath + ' Z';

        default:
            return '';
    }
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleShieldBadge(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateShieldBadgeParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('shield-badge', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Shield outline
    const shieldPath = generateShieldPath(algoParams, cx, cy);
    svg.path(shieldPath, { fill: `url(#${gradientId})` });

    // Inner shield (border effect)
    if (algoParams.borderWidth > 2) {
        const innerShieldPath = generateShieldPath(algoParams, cx, cy, 0.85);
        svg.path(innerShieldPath, { fill: darken(primaryColor, 10) });
    }

    // Inner pattern
    const patternPath = generateInnerPattern(algoParams, cx, cy + 2);
    if (patternPath) {
        svg.path(patternPath, { fill: accentColor || lighten(primaryColor, 30) });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'shield-badge', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'shield-badge',
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
                symmetry: 'vertical',
                pathCount: algoParams.innerPattern !== 'none' ? 3 : 2,
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

export function generateShieldBadge(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleShieldBadge(params, hashParams, v);

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
                algorithm: 'shield-badge',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleShieldBadgePreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateShieldBadgeParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    const path = generateShieldPath(params, size / 2, size / 2);
    svg.path(path, { fill: 'url(#main)' });

    return svg.build();
}
