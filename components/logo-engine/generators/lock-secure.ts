/**
 * Lock Secure Generator (Security/Trust-style)
 *
 * Creates padlock and security lock shapes
 * Trust and protection aesthetic
 * Inspired by security and privacy brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    LockSecureParams,
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

function generateLockSecureParams(hashParams: HashParams, rng: () => number): LockSecureParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const keyholes: Array<'classic' | 'modern' | 'circle' | 'none'> = ['classic', 'modern', 'circle', 'none'];
    const bodies: Array<'rounded' | 'squared' | 'shield'> = ['rounded', 'squared', 'shield'];

    return {
        ...base,
        shackleWidth: derived.strokeWidth * 2 + 4,
        bodyShape: bodies[Math.floor(derived.styleVariant % 3)],
        keyholeStyle: keyholes[Math.floor((derived.styleVariant + derived.elementCount) % 4)],
        boltCount: Math.max(0, Math.min(2, Math.floor(derived.colorPlacement * 2))),
        shackleHeight: derived.taperRatio * 0.4 + 0.4,
        bodyWidth: derived.scaleFactor * 0.3 + 0.7,
        lockClosed: derived.organicAmount < 0.7,
        metallic: derived.perspectiveStrength > 0.5,
        reinforced: derived.layerCount > 2,
        glowEffect: derived.bulgeAmount > 0.5,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateShacklePath(
    params: LockSecureParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { shackleWidth, shackleHeight, lockClosed } = params;

    const sw = shackleWidth * scale;
    const width = 24 * scale;
    const height = 20 * scale * shackleHeight;

    const innerWidth = width - sw * 2;
    const k = 0.5522847498;

    const topY = cy - 15 * scale;
    const bottomY = topY + height;

    if (lockClosed) {
        // Closed shackle - U shape with rounded top
        return `
            M ${(cx - width / 2).toFixed(2)} ${bottomY.toFixed(2)}
            L ${(cx - width / 2).toFixed(2)} ${(topY + height * 0.4).toFixed(2)}
            C ${(cx - width / 2).toFixed(2)} ${(topY + height * 0.4 - height * 0.4 * k).toFixed(2)},
              ${(cx - width / 2 + (width / 2) * (1 - k)).toFixed(2)} ${topY.toFixed(2)},
              ${cx.toFixed(2)} ${topY.toFixed(2)}
            C ${(cx + (width / 2) * k).toFixed(2)} ${topY.toFixed(2)},
              ${(cx + width / 2).toFixed(2)} ${(topY + height * 0.4 - height * 0.4 * k).toFixed(2)},
              ${(cx + width / 2).toFixed(2)} ${(topY + height * 0.4).toFixed(2)}
            L ${(cx + width / 2).toFixed(2)} ${bottomY.toFixed(2)}
            L ${(cx + width / 2 - sw).toFixed(2)} ${bottomY.toFixed(2)}
            L ${(cx + width / 2 - sw).toFixed(2)} ${(topY + height * 0.4).toFixed(2)}
            C ${(cx + width / 2 - sw).toFixed(2)} ${(topY + sw + (height * 0.4 - sw) * (1 - k)).toFixed(2)},
              ${(cx + innerWidth / 2 * k).toFixed(2)} ${(topY + sw).toFixed(2)},
              ${cx.toFixed(2)} ${(topY + sw).toFixed(2)}
            C ${(cx - innerWidth / 2 * k).toFixed(2)} ${(topY + sw).toFixed(2)},
              ${(cx - width / 2 + sw).toFixed(2)} ${(topY + sw + (height * 0.4 - sw) * (1 - k)).toFixed(2)},
              ${(cx - width / 2 + sw).toFixed(2)} ${(topY + height * 0.4).toFixed(2)}
            L ${(cx - width / 2 + sw).toFixed(2)} ${bottomY.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    } else {
        // Open shackle - right side lifted
        return `
            M ${(cx - width / 2).toFixed(2)} ${bottomY.toFixed(2)}
            L ${(cx - width / 2).toFixed(2)} ${(topY + height * 0.4).toFixed(2)}
            C ${(cx - width / 2).toFixed(2)} ${(topY + height * 0.4 - height * 0.4 * k).toFixed(2)},
              ${(cx - width / 2 + (width / 2) * (1 - k)).toFixed(2)} ${topY.toFixed(2)},
              ${cx.toFixed(2)} ${topY.toFixed(2)}
            L ${cx.toFixed(2)} ${(topY + sw).toFixed(2)}
            C ${(cx - innerWidth / 2 * k).toFixed(2)} ${(topY + sw).toFixed(2)},
              ${(cx - width / 2 + sw).toFixed(2)} ${(topY + sw + (height * 0.4 - sw) * (1 - k)).toFixed(2)},
              ${(cx - width / 2 + sw).toFixed(2)} ${(topY + height * 0.4).toFixed(2)}
            L ${(cx - width / 2 + sw).toFixed(2)} ${bottomY.toFixed(2)}
            Z
            M ${(cx + width / 2 - sw).toFixed(2)} ${(bottomY - height * 0.3).toFixed(2)}
            L ${(cx + width / 2 - sw).toFixed(2)} ${(topY - 5).toFixed(2)}
            L ${(cx + width / 2).toFixed(2)} ${(topY - 5).toFixed(2)}
            L ${(cx + width / 2).toFixed(2)} ${(bottomY - height * 0.3).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }
}

function generateBodyPath(
    params: LockSecureParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { bodyShape, bodyWidth } = params;

    const width = 32 * scale * bodyWidth;
    const height = 28 * scale;

    const left = cx - width / 2;
    const right = cx + width / 2;
    const top = cy;
    const bottom = cy + height;

    if (bodyShape === 'rounded') {
        const r = 5 * scale;
        const k = 0.5522847498;

        return `
            M ${(left + r).toFixed(2)} ${top.toFixed(2)}
            L ${(right - r).toFixed(2)} ${top.toFixed(2)}
            C ${(right - r + r * k).toFixed(2)} ${top.toFixed(2)},
              ${right.toFixed(2)} ${(top + r - r * k).toFixed(2)},
              ${right.toFixed(2)} ${(top + r).toFixed(2)}
            L ${right.toFixed(2)} ${(bottom - r).toFixed(2)}
            C ${right.toFixed(2)} ${(bottom - r + r * k).toFixed(2)},
              ${(right - r + r * k).toFixed(2)} ${bottom.toFixed(2)},
              ${(right - r).toFixed(2)} ${bottom.toFixed(2)}
            L ${(left + r).toFixed(2)} ${bottom.toFixed(2)}
            C ${(left + r - r * k).toFixed(2)} ${bottom.toFixed(2)},
              ${left.toFixed(2)} ${(bottom - r + r * k).toFixed(2)},
              ${left.toFixed(2)} ${(bottom - r).toFixed(2)}
            L ${left.toFixed(2)} ${(top + r).toFixed(2)}
            C ${left.toFixed(2)} ${(top + r - r * k).toFixed(2)},
              ${(left + r - r * k).toFixed(2)} ${top.toFixed(2)},
              ${(left + r).toFixed(2)} ${top.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

    } else if (bodyShape === 'shield') {
        return `
            M ${left.toFixed(2)} ${top.toFixed(2)}
            L ${right.toFixed(2)} ${top.toFixed(2)}
            L ${right.toFixed(2)} ${(top + height * 0.6).toFixed(2)}
            C ${right.toFixed(2)} ${(top + height * 0.8).toFixed(2)},
              ${(cx + width * 0.2).toFixed(2)} ${bottom.toFixed(2)},
              ${cx.toFixed(2)} ${(bottom + 4 * scale).toFixed(2)}
            C ${(cx - width * 0.2).toFixed(2)} ${bottom.toFixed(2)},
              ${left.toFixed(2)} ${(top + height * 0.8).toFixed(2)},
              ${left.toFixed(2)} ${(top + height * 0.6).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

    } else {
        // Squared
        return `
            M ${left.toFixed(2)} ${top.toFixed(2)}
            L ${right.toFixed(2)} ${top.toFixed(2)}
            L ${right.toFixed(2)} ${bottom.toFixed(2)}
            L ${left.toFixed(2)} ${bottom.toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }
}

function generateKeyholePath(
    params: LockSecureParams,
    cx: number,
    cy: number,
    scale: number = 1
): string {
    const { keyholeStyle } = params;

    const bodyTop = cy;
    const keyY = bodyTop + 14 * scale;

    if (keyholeStyle === 'classic') {
        const circleR = 4 * scale;
        const slotWidth = 3 * scale;
        const slotHeight = 8 * scale;
        const k = 0.5522847498;

        return `
            M ${cx.toFixed(2)} ${(keyY - circleR).toFixed(2)}
            C ${(cx + circleR * k).toFixed(2)} ${(keyY - circleR).toFixed(2)},
              ${(cx + circleR).toFixed(2)} ${(keyY - circleR * k).toFixed(2)},
              ${(cx + circleR).toFixed(2)} ${keyY.toFixed(2)}
            C ${(cx + circleR).toFixed(2)} ${(keyY + circleR * 0.5).toFixed(2)},
              ${(cx + slotWidth / 2).toFixed(2)} ${(keyY + circleR).toFixed(2)},
              ${(cx + slotWidth / 2).toFixed(2)} ${(keyY + circleR).toFixed(2)}
            L ${(cx + slotWidth / 2).toFixed(2)} ${(keyY + slotHeight).toFixed(2)}
            L ${(cx - slotWidth / 2).toFixed(2)} ${(keyY + slotHeight).toFixed(2)}
            L ${(cx - slotWidth / 2).toFixed(2)} ${(keyY + circleR).toFixed(2)}
            C ${(cx - slotWidth / 2).toFixed(2)} ${(keyY + circleR).toFixed(2)},
              ${(cx - circleR).toFixed(2)} ${(keyY + circleR * 0.5).toFixed(2)},
              ${(cx - circleR).toFixed(2)} ${keyY.toFixed(2)}
            C ${(cx - circleR).toFixed(2)} ${(keyY - circleR * k).toFixed(2)},
              ${(cx - circleR * k).toFixed(2)} ${(keyY - circleR).toFixed(2)},
              ${cx.toFixed(2)} ${(keyY - circleR).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

    } else if (keyholeStyle === 'circle') {
        const r = 5 * scale;
        const k = 0.5522847498;

        return `
            M ${cx.toFixed(2)} ${(keyY - r).toFixed(2)}
            C ${(cx + r * k).toFixed(2)} ${(keyY - r).toFixed(2)},
              ${(cx + r).toFixed(2)} ${(keyY - r * k).toFixed(2)},
              ${(cx + r).toFixed(2)} ${keyY.toFixed(2)}
            C ${(cx + r).toFixed(2)} ${(keyY + r * k).toFixed(2)},
              ${(cx + r * k).toFixed(2)} ${(keyY + r).toFixed(2)},
              ${cx.toFixed(2)} ${(keyY + r).toFixed(2)}
            C ${(cx - r * k).toFixed(2)} ${(keyY + r).toFixed(2)},
              ${(cx - r).toFixed(2)} ${(keyY + r * k).toFixed(2)},
              ${(cx - r).toFixed(2)} ${keyY.toFixed(2)}
            C ${(cx - r).toFixed(2)} ${(keyY - r * k).toFixed(2)},
              ${(cx - r * k).toFixed(2)} ${(keyY - r).toFixed(2)},
              ${cx.toFixed(2)} ${(keyY - r).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

    } else if (keyholeStyle === 'modern') {
        const width = 6 * scale;
        const height = 10 * scale;

        return `
            M ${(cx - width / 2).toFixed(2)} ${(keyY - height / 2).toFixed(2)}
            L ${(cx + width / 2).toFixed(2)} ${(keyY - height / 2).toFixed(2)}
            L ${(cx + width / 2).toFixed(2)} ${(keyY + height / 2).toFixed(2)}
            L ${(cx - width / 2).toFixed(2)} ${(keyY + height / 2).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    return '';
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleLockSecure(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateLockSecureParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('lock-secure', variant);

    // Main gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 180,
        stops: algoParams.metallic ? [
            { offset: 0, color: lighten(primaryColor, 30) },
            { offset: 0.3, color: primaryColor },
            { offset: 0.5, color: lighten(primaryColor, 15) },
            { offset: 0.7, color: primaryColor },
            { offset: 1, color: darken(primaryColor, 20) },
        ] : [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 1, color: darken(primaryColor, 15) },
        ],
    });

    // Glow effect
    if (algoParams.glowEffect) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0.5, color: accentColor || lighten(primaryColor, 40), opacity: 0.3 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });
        const glowPath = generateBodyPath(algoParams, cx, cy, 1.2);
        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    // Lock body
    const bodyPath = generateBodyPath(algoParams, cx, cy);
    svg.path(bodyPath, { fill: `url(#${gradientId})` });

    // Shackle
    const shacklePath = generateShacklePath(algoParams, cx, cy - 8);
    svg.path(shacklePath, { fill: darken(primaryColor, 10) });

    // Keyhole
    if (algoParams.keyholeStyle !== 'none') {
        const keyholePath = generateKeyholePath(algoParams, cx, cy);
        svg.path(keyholePath, { fill: darken(primaryColor, 35) });
    }

    // Reinforcement border
    if (algoParams.reinforced) {
        const borderPath = generateBodyPath(algoParams, cx, cy, 0.92);
        svg.path(borderPath, { fill: 'none', stroke: darken(primaryColor, 25), strokeWidth: '1.5' });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'lock-secure', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'lock-secure',
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
                pathCount: 2 + (algoParams.keyholeStyle !== 'none' ? 1 : 0) + (algoParams.reinforced ? 1 : 0),
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

export function generateLockSecure(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleLockSecure(params, hashParams, v);

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
                algorithm: 'lock-secure',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleLockSecurePreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateLockSecureParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: darken(primaryColor, 10) },
        ],
    });

    const bodyPath = generateBodyPath(params, size / 2, size / 2);
    svg.path(bodyPath, { fill: 'url(#main)' });

    const shacklePath = generateShacklePath(params, size / 2, size / 2 - 8);
    svg.path(shacklePath, { fill: darken(primaryColor, 10) });

    return svg.build();
}
