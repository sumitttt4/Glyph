/**
 * Fingerprint ID Generator (Identity/Security-style)
 *
 * Creates fingerprint-inspired patterns
 * Unique identity and biometric aesthetic
 * Inspired by identity verification and security brands
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    FingerprintIdParams,
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

function generateFingerprintIdParams(hashParams: HashParams, rng: () => number): FingerprintIdParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const cores: Array<'loop' | 'whorl' | 'arch'> = ['loop', 'whorl', 'arch'];

    return {
        ...base,
        ridgeCount: Math.max(6, Math.min(12, Math.floor(derived.elementCount * 0.8 + 6))),
        spiralTightness: derived.curveTension * 0.5 + 0.3,
        coreStyle: cores[Math.floor(derived.styleVariant % 3)],
        deltaPattern: derived.organicAmount > 0.5,
        ridgeWidth: derived.strokeWidth * 0.8 + 1,
        ridgeSpacing: derived.spacingFactor * 2 + 2,
        breakCount: Math.floor(derived.colorPlacement * 3),
        centerOffset: derived.taperRatio * 0.2,
        glowEffect: derived.perspectiveStrength > 0.5,
        scanLine: derived.layerCount > 2,
    };
}

// ============================================
// PATH GENERATION
// ============================================

function generateRidgePath(
    cx: number,
    cy: number,
    params: FingerprintIdParams,
    ridgeIndex: number,
    totalRidges: number
): string {
    const { spiralTightness, coreStyle, centerOffset } = params;

    const progress = ridgeIndex / totalRidges;
    const baseRadius = 5 + progress * 35;

    // Offset center slightly for natural look
    const offsetX = cx + centerOffset * 10 * Math.sin(ridgeIndex * 0.3);
    const offsetY = cy + centerOffset * 5 * Math.cos(ridgeIndex * 0.5);

    if (coreStyle === 'whorl') {
        // Spiral pattern
        const segments = 24;
        let path = '';

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const angle = t * Math.PI * 2 * (1 + spiralTightness);
            const r = baseRadius * (0.3 + t * 0.7);
            const x = offsetX + Math.cos(angle - Math.PI / 2) * r;
            const y = offsetY + Math.sin(angle - Math.PI / 2) * r * 0.8;

            if (i === 0) {
                path += `M ${x.toFixed(2)} ${y.toFixed(2)}`;
            } else {
                const prevT = (i - 1) / segments;
                const prevAngle = prevT * Math.PI * 2 * (1 + spiralTightness);
                const prevR = baseRadius * (0.3 + prevT * 0.7);
                const prevX = offsetX + Math.cos(prevAngle - Math.PI / 2) * prevR;
                const prevY = offsetY + Math.sin(prevAngle - Math.PI / 2) * prevR * 0.8;

                const cpX = (prevX + x) / 2 + (Math.random() - 0.5) * 2;
                const cpY = (prevY + y) / 2 + (Math.random() - 0.5) * 2;

                path += ` Q ${cpX.toFixed(2)} ${cpY.toFixed(2)}, ${x.toFixed(2)} ${y.toFixed(2)}`;
            }
        }

        return path;

    } else if (coreStyle === 'loop') {
        // Loop pattern - U-shaped curves
        const width = baseRadius * 1.5;
        const height = baseRadius;

        const left = offsetX - width / 2;
        const right = offsetX + width / 2;
        const top = offsetY - height;
        const bottom = offsetY + height * 0.5;

        return `
            M ${left.toFixed(2)} ${bottom.toFixed(2)}
            C ${left.toFixed(2)} ${(top - height * 0.3).toFixed(2)},
              ${right.toFixed(2)} ${(top - height * 0.3).toFixed(2)},
              ${right.toFixed(2)} ${bottom.toFixed(2)}
        `.replace(/\s+/g, ' ').trim();

    } else {
        // Arch pattern - simple curved lines
        const width = baseRadius * 2;
        const archHeight = baseRadius * 0.6;

        return `
            M ${(offsetX - width / 2).toFixed(2)} ${(offsetY + archHeight).toFixed(2)}
            C ${(offsetX - width / 4).toFixed(2)} ${(offsetY - archHeight).toFixed(2)},
              ${(offsetX + width / 4).toFixed(2)} ${(offsetY - archHeight).toFixed(2)},
              ${(offsetX + width / 2).toFixed(2)} ${(offsetY + archHeight).toFixed(2)}
        `.replace(/\s+/g, ' ').trim();
    }
}

function generateScanLinePath(
    cx: number,
    cy: number,
    width: number,
    yOffset: number
): string {
    return `
        M ${(cx - width / 2).toFixed(2)} ${(cy + yOffset).toFixed(2)}
        L ${(cx + width / 2).toFixed(2)} ${(cy + yOffset).toFixed(2)}
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleFingerprintId(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateFingerprintIdParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('fingerprint-id', variant);

    // Glow effect
    if (algoParams.glowEffect) {
        const glowGradId = `${uniqueId}-glow`;
        svg.addGradient(glowGradId, {
            type: 'radial',
            stops: [
                { offset: 0.3, color: accentColor || lighten(primaryColor, 40), opacity: 0.2 },
                { offset: 1, color: primaryColor, opacity: 0 },
            ],
        });

        const k = 0.5522847498;
        const r = 45;
        const glowPath = `
            M ${cx.toFixed(2)} ${(cy - r).toFixed(2)}
            C ${(cx + r * k).toFixed(2)} ${(cy - r).toFixed(2)},
              ${(cx + r).toFixed(2)} ${(cy - r * k).toFixed(2)},
              ${(cx + r).toFixed(2)} ${cy.toFixed(2)}
            C ${(cx + r).toFixed(2)} ${(cy + r * k).toFixed(2)},
              ${(cx + r * k).toFixed(2)} ${(cy + r).toFixed(2)},
              ${cx.toFixed(2)} ${(cy + r).toFixed(2)}
            C ${(cx - r * k).toFixed(2)} ${(cy + r).toFixed(2)},
              ${(cx - r).toFixed(2)} ${(cy + r * k).toFixed(2)},
              ${(cx - r).toFixed(2)} ${cy.toFixed(2)}
            C ${(cx - r).toFixed(2)} ${(cy - r * k).toFixed(2)},
              ${(cx - r * k).toFixed(2)} ${(cy - r).toFixed(2)},
              ${cx.toFixed(2)} ${(cy - r).toFixed(2)}
            Z
        `.replace(/\s+/g, ' ').trim();

        svg.path(glowPath, { fill: `url(#${glowGradId})` });
    }

    // Fingerprint ridges
    for (let i = 0; i < algoParams.ridgeCount; i++) {
        const ridgePath = generateRidgePath(cx, cy, algoParams, i, algoParams.ridgeCount);

        // Add breaks in some ridges
        const hasBreak = i > 2 && i < algoParams.ridgeCount - 2 && i % 3 === 0 && algoParams.breakCount > 0;

        svg.path(ridgePath, {
            fill: 'none',
            stroke: primaryColor,
            strokeWidth: algoParams.ridgeWidth.toString(),
            strokeLinecap: 'round',
            strokeOpacity: hasBreak ? '0.5' : '1',
            strokeDasharray: hasBreak ? '8 4' : 'none',
        });
    }

    // Scan line animation indicator
    if (algoParams.scanLine) {
        const scanGradId = `${uniqueId}-scan`;
        svg.addGradient(scanGradId, {
            type: 'linear',
            angle: 0,
            stops: [
                { offset: 0, color: accentColor || lighten(primaryColor, 40), opacity: 0 },
                { offset: 0.5, color: accentColor || lighten(primaryColor, 40), opacity: 0.8 },
                { offset: 1, color: accentColor || lighten(primaryColor, 40), opacity: 0 },
            ],
        });

        const scanPath = generateScanLinePath(cx, cy, 70, -10);
        svg.path(scanPath, {
            fill: 'none',
            stroke: `url(#${scanGradId})`,
            strokeWidth: '2',
        });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'fingerprint-id', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'fingerprint-id',
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
                symmetry: 'none',
                pathCount: algoParams.ridgeCount + (algoParams.scanLine ? 1 : 0),
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || lighten(primaryColor, 40)],
            },
        },
    };

    return { logo, quality };
}

export function generateFingerprintId(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 85, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleFingerprintId(params, hashParams, v);

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
                algorithm: 'fingerprint-id',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleFingerprintIdPreview(
    primaryColor: string,
    accentColor?: string,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateFingerprintIdParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    // Draw simplified ridges
    for (let i = 0; i < Math.min(params.ridgeCount, 8); i++) {
        const ridgePath = generateRidgePath(size / 2, size / 2, params, i, params.ridgeCount);
        svg.path(ridgePath, {
            fill: 'none',
            stroke: primaryColor,
            strokeWidth: params.ridgeWidth.toString(),
            strokeLinecap: 'round',
        });
    }

    return svg.build();
}
