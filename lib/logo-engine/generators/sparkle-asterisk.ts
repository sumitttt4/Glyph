/**
 * Sparkle/Asterisk Generator (Claude-style)
 *
 * Creates curved arm sparkle/asterisk logos with organic bezier curves
 * Inspired by Claude/Anthropic's distinctive brand mark
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    SparkleAsteriskParams,
    Point,
} from '../types';
import {
    createSeededRandom,
    generateBaseParams,
    generateLogoHash,
    generateLogoId,
    addNoise,
    PHI,
    lerp,
    calculateComplexity,
    storeHash,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateSparkleParams(rng: () => number): SparkleAsteriskParams {
    const base = generateBaseParams(rng);
    return {
        ...base,
        armCount: 4 + Math.floor(rng() * 5),              // 4-8 arms
        armLength: 25 + rng() * 18,                       // 25-43
        armWidth: 3 + rng() * 7,                          // 3-10
        armCurvature: 0.2 + rng() * 0.6,                  // 0.2-0.8
        armTaper: 0.3 + rng() * 0.5,                      // 0.3-0.8
        centerRadius: 2 + rng() * 10,                     // 2-12
        rotationalSymmetry: rng() > 0.3,                  // 70% chance
        spiralAmount: rng() * 0.4,                        // 0-0.4
        armBulge: rng() * 0.5,                            // 0-0.5
    };
}

// ============================================
// ARM GENERATION
// ============================================

interface ArmPath {
    d: string;
    index: number;
    angle: number;
}

/**
 * Generate a single curved arm using bezier paths
 */
function generateArmPath(
    params: SparkleAsteriskParams,
    index: number,
    totalArms: number,
    cx: number,
    cy: number,
    rng: () => number
): ArmPath {
    // Calculate base angle for this arm
    const baseAngle = (index / totalArms) * Math.PI * 2;
    const spiralOffset = params.spiralAmount * (index / totalArms) * Math.PI * 0.5;
    const angle = baseAngle + spiralOffset + (params.rotationalSymmetry ? 0 : addNoise(0, params.angleVariance * 0.01, rng, 0.2));

    // Arm dimensions with variation
    const length = addNoise(params.armLength, params.sizeVariance, rng, 5);
    const startWidth = params.armWidth;
    const endWidth = startWidth * (1 - params.armTaper);

    // Calculate arm points
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Start point (at center radius)
    const startDist = params.centerRadius;
    const startX = cx + cos * startDist;
    const startY = cy + sin * startDist;

    // End point
    const endX = cx + cos * (startDist + length);
    const endY = cy + sin * (startDist + length);

    // Control points for curvature (perpendicular offset)
    const perpCos = Math.cos(angle + Math.PI / 2);
    const perpSin = Math.sin(angle + Math.PI / 2);

    const curveOffset = length * params.armCurvature * (index % 2 === 0 ? 1 : -1);
    const bulgeOffset = length * params.armBulge;

    // Create curved arm shape
    const path = createCurvedArmPath(
        { x: startX, y: startY },
        { x: endX, y: endY },
        angle,
        startWidth,
        endWidth,
        curveOffset,
        bulgeOffset,
        params.curveTension
    );

    return { d: path, index, angle };
}

/**
 * Create a curved tapered arm shape
 */
function createCurvedArmPath(
    start: Point,
    end: Point,
    angle: number,
    startWidth: number,
    endWidth: number,
    curveOffset: number,
    bulgeOffset: number,
    tension: number
): string {
    const perpAngle = angle + Math.PI / 2;
    const perpCos = Math.cos(perpAngle);
    const perpSin = Math.sin(perpAngle);

    // Calculate edge points
    const startLeft: Point = {
        x: start.x + perpCos * startWidth / 2,
        y: start.y + perpSin * startWidth / 2,
    };
    const startRight: Point = {
        x: start.x - perpCos * startWidth / 2,
        y: start.y - perpSin * startWidth / 2,
    };
    const endLeft: Point = {
        x: end.x + perpCos * endWidth / 2,
        y: end.y + perpSin * endWidth / 2,
    };
    const endRight: Point = {
        x: end.x - perpCos * endWidth / 2,
        y: end.y - perpSin * endWidth / 2,
    };

    // Midpoint with curve offset
    const midX = (start.x + end.x) / 2 + perpCos * curveOffset;
    const midY = (start.y + end.y) / 2 + perpSin * curveOffset;

    // Bulge width at midpoint
    const midWidth = Math.max(startWidth, endWidth) * (1 + bulgeOffset);

    const midLeft: Point = {
        x: midX + perpCos * midWidth / 2,
        y: midY + perpSin * midWidth / 2,
    };
    const midRight: Point = {
        x: midX - perpCos * midWidth / 2,
        y: midY - perpSin * midWidth / 2,
    };

    // Build path with smooth bezier curves
    const t = tension;

    // Left edge (forward)
    const cp1lx = startLeft.x + (midLeft.x - startLeft.x) * t;
    const cp1ly = startLeft.y + (midLeft.y - startLeft.y) * t;
    const cp2lx = midLeft.x - (midLeft.x - startLeft.x) * (1 - t) * 0.5;
    const cp2ly = midLeft.y - (midLeft.y - startLeft.y) * (1 - t) * 0.5;

    const cp3lx = midLeft.x + (endLeft.x - midLeft.x) * t;
    const cp3ly = midLeft.y + (endLeft.y - midLeft.y) * t;
    const cp4lx = endLeft.x - (endLeft.x - midLeft.x) * (1 - t) * 0.5;
    const cp4ly = endLeft.y - (endLeft.y - midLeft.y) * (1 - t) * 0.5;

    // Right edge (backward)
    const cp1rx = endRight.x - (endRight.x - midRight.x) * t;
    const cp1ry = endRight.y - (endRight.y - midRight.y) * t;
    const cp2rx = midRight.x + (endRight.x - midRight.x) * (1 - t) * 0.5;
    const cp2ry = midRight.y + (endRight.y - midRight.y) * (1 - t) * 0.5;

    const cp3rx = midRight.x - (midRight.x - startRight.x) * t;
    const cp3ry = midRight.y - (midRight.y - startRight.y) * t;
    const cp4rx = startRight.x + (midRight.x - startRight.x) * (1 - t) * 0.5;
    const cp4ry = startRight.y + (midRight.y - startRight.y) * (1 - t) * 0.5;

    return `
        M ${startLeft.x.toFixed(2)} ${startLeft.y.toFixed(2)}
        C ${cp1lx.toFixed(2)} ${cp1ly.toFixed(2)}, ${cp2lx.toFixed(2)} ${cp2ly.toFixed(2)}, ${midLeft.x.toFixed(2)} ${midLeft.y.toFixed(2)}
        C ${cp3lx.toFixed(2)} ${cp3ly.toFixed(2)}, ${cp4lx.toFixed(2)} ${cp4ly.toFixed(2)}, ${endLeft.x.toFixed(2)} ${endLeft.y.toFixed(2)}
        Q ${end.x.toFixed(2)} ${end.y.toFixed(2)}, ${endRight.x.toFixed(2)} ${endRight.y.toFixed(2)}
        C ${cp1rx.toFixed(2)} ${cp1ry.toFixed(2)}, ${cp2rx.toFixed(2)} ${cp2ry.toFixed(2)}, ${midRight.x.toFixed(2)} ${midRight.y.toFixed(2)}
        C ${cp3rx.toFixed(2)} ${cp3ry.toFixed(2)}, ${cp4rx.toFixed(2)} ${cp4ry.toFixed(2)}, ${startRight.x.toFixed(2)} ${startRight.y.toFixed(2)}
        Q ${start.x.toFixed(2)} ${start.y.toFixed(2)}, ${startLeft.x.toFixed(2)} ${startLeft.y.toFixed(2)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate center circle/shape
 */
function generateCenterPath(params: SparkleAsteriskParams, cx: number, cy: number): string {
    if (params.centerRadius < 2) return '';

    const r = params.centerRadius;
    // Use bezier approximation of circle for consistency
    const k = 0.5522847498; // Magic number for circle approximation

    return `
        M ${cx} ${cy - r}
        C ${cx + r * k} ${cy - r}, ${cx + r} ${cy - r * k}, ${cx + r} ${cy}
        C ${cx + r} ${cy + r * k}, ${cx + r * k} ${cy + r}, ${cx} ${cy + r}
        C ${cx - r * k} ${cy + r}, ${cx - r} ${cy + r * k}, ${cx - r} ${cy}
        C ${cx - r} ${cy - r * k}, ${cx - r * k} ${cy - r}, ${cx} ${cy - r}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateSparkleAsterisk(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        primaryColor,
        accentColor,
        variations = 3,
        seed = brandName,
    } = params;

    const logos: GeneratedLogo[] = [];
    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    for (let v = 0; v < variations; v++) {
        const variantSeed = `${seed}-sparkle-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateSparkleParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('sparkle-asterisk', v);

        // Add gradient
        const gradientId = `${uniqueId}-grad`;
        svg.addGradient(gradientId, {
            type: 'radial',
            stops: [
                { offset: 0, color: lighten(primaryColor, 15) },
                { offset: 0.5, color: primaryColor },
                { offset: 1, color: accentColor || darken(primaryColor, 10) },
            ],
        });

        // Generate arms
        const arms: ArmPath[] = [];
        for (let i = 0; i < algoParams.armCount; i++) {
            arms.push(generateArmPath(algoParams, i, algoParams.armCount, cx, cy, rng));
        }

        // Render arms
        arms.forEach(arm => {
            const armGradId = `${uniqueId}-arm-${arm.index}`;
            const angleNorm = arm.angle / (Math.PI * 2);

            svg.addGradient(armGradId, {
                type: 'linear',
                angle: (arm.angle * 180) / Math.PI,
                stops: [
                    { offset: 0, color: lighten(primaryColor, 10) },
                    { offset: 1, color: mixColors(primaryColor, accentColor || darken(primaryColor, 20), angleNorm) },
                ],
            });

            svg.path(arm.d, {
                fill: `url(#${armGradId})`,
            });
        });

        // Render center
        const centerPath = generateCenterPath(algoParams, cx, cy);
        if (centerPath) {
            svg.path(centerPath, {
                fill: `url(#${gradientId})`,
            });
        }

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'sparkle-asterisk', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'sparkle-asterisk',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'sparkle-asterisk',
            variant: v + 1,
            svg: svgString,
            viewBox: `0 0 ${size} ${size}`,
            params: algoParams,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: variantSeed,
                geometry: {
                    usesGoldenRatio: false,
                    gridBased: false,
                    bezierCurves: true,
                    symmetry: algoParams.rotationalSymmetry ? 'radial' : 'none',
                    pathCount: algoParams.armCount + (algoParams.centerRadius > 2 ? 1 : 0),
                    complexity: calculateComplexity(svgString),
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: [primaryColor, accentColor || darken(primaryColor, 15)],
                },
            },
        });
    }

    return logos;
}

export function generateSingleSparkleAsterisk(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<SparkleAsteriskParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateSparkleParams(rng), ...customParams };
    const size = 100;
    const cx = size / 2;
    const cy = size / 2;
    const svg = createSVG(size);

    svg.addGradient('main', {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    for (let i = 0; i < params.armCount; i++) {
        const arm = generateArmPath(params, i, params.armCount, cx, cy, rng);
        svg.path(arm.d, { fill: 'url(#main)' });
    }

    const centerPath = generateCenterPath(params, cx, cy);
    if (centerPath) {
        svg.path(centerPath, { fill: 'url(#main)' });
    }

    return svg.build();
}
