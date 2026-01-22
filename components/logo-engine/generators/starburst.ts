/**
 * Starburst Generator (Claude/Anthropic-style)
 *
 * Creates premium radial logos with curved organic arms emanating from center
 * Rotational symmetry with 6-16 spokes, bezier curves only
 * Inspired by Claude/Anthropic's distinctive starburst mark
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    StarburstParams,
    Point,
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
    meetsQualityThreshold,
    addNoise,
    PHI,
    lerp,
    calculateComplexity,
    storeHash,
    createBezierCircle,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateStarburstParams(hashParams: HashParams, rng: () => number): StarburstParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    return {
        ...base,
        armCount: Math.max(6, Math.min(16, derived.elementCount)),
        armLength: derived.armLength,
        armWidth: derived.armWidth,
        armCurvature: derived.curveTension,
        armTaper: derived.taperRatio,
        centerRadius: derived.centerRadius,
        rotationalSymmetry: derived.symmetryType.includes('rotational') || derived.symmetryType === 'radial',
        spiralAmount: derived.spiralAmount,
        armBulge: derived.bulgeAmount,
        organicWobble: derived.organicAmount,
        curveTension: derived.curveTension,
        rotationOffset: derived.rotationOffset,
    };
}

// ============================================
// ARM PATH GENERATION
// ============================================

interface ArmPath {
    d: string;
    index: number;
    angle: number;
}

/**
 * Generate a single curved arm using bezier paths
 * Creates organic, flowing shapes with smooth tapering
 */
function generateArmPath(
    params: StarburstParams,
    index: number,
    totalArms: number,
    cx: number,
    cy: number,
    rng: () => number
): ArmPath {
    // Calculate base angle for this arm with optional spiral
    const baseAngle = (index / totalArms) * Math.PI * 2;
    const rotationRad = (params.rotationOffset * Math.PI) / 180;
    const spiralOffset = params.spiralAmount * (index / totalArms) * Math.PI * 0.5;
    const wobble = params.organicWobble > 0 ? addNoise(0, params.organicWobble, rng, 0.15) : 0;
    const angle = baseAngle + rotationRad + spiralOffset + wobble;

    // Arm dimensions with organic variation
    const lengthVariation = params.rotationalSymmetry ? 0 : addNoise(0, params.sizeVariance, rng, 5);
    const length = params.armLength + lengthVariation;
    const startWidth = params.armWidth;
    const endWidth = startWidth * (1 - params.armTaper);

    // Calculate arm geometry
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Start point (at center radius)
    const startDist = params.centerRadius;
    const startX = cx + cos * startDist;
    const startY = cy + sin * startDist;

    // End point
    const endX = cx + cos * (startDist + length);
    const endY = cy + sin * (startDist + length);

    // Control point for organic curvature
    const perpAngle = angle + Math.PI / 2;
    const curveDirection = index % 2 === 0 ? 1 : -1;
    const curveOffset = length * params.armCurvature * curveDirection * 0.3;

    // Create the arm path with smooth bezier curves
    const path = createOrganicArmPath(
        { x: startX, y: startY },
        { x: endX, y: endY },
        angle,
        startWidth,
        endWidth,
        curveOffset,
        params.armBulge,
        params.curveTension,
        perpAngle
    );

    return { d: path, index, angle };
}

/**
 * Create a curved tapered arm shape using cubic beziers
 */
function createOrganicArmPath(
    start: Point,
    end: Point,
    angle: number,
    startWidth: number,
    endWidth: number,
    curveOffset: number,
    bulgeAmount: number,
    tension: number,
    perpAngle: number
): string {
    const perpCos = Math.cos(perpAngle);
    const perpSin = Math.sin(perpAngle);

    // Calculate edge points at start
    const startLeft: Point = {
        x: start.x + perpCos * startWidth / 2,
        y: start.y + perpSin * startWidth / 2,
    };
    const startRight: Point = {
        x: start.x - perpCos * startWidth / 2,
        y: start.y - perpSin * startWidth / 2,
    };

    // Calculate edge points at end (tapered)
    const endLeft: Point = {
        x: end.x + perpCos * endWidth / 2,
        y: end.y + perpSin * endWidth / 2,
    };
    const endRight: Point = {
        x: end.x - perpCos * endWidth / 2,
        y: end.y - perpSin * endWidth / 2,
    };

    // Midpoint with curve offset for organic feel
    const midX = (start.x + end.x) / 2 + perpCos * curveOffset;
    const midY = (start.y + end.y) / 2 + perpSin * curveOffset;

    // Bulge width at midpoint creates organic swell
    const midWidth = Math.max(startWidth, endWidth) * (1 + bulgeAmount);

    const midLeft: Point = {
        x: midX + perpCos * midWidth / 2,
        y: midY + perpSin * midWidth / 2,
    };
    const midRight: Point = {
        x: midX - perpCos * midWidth / 2,
        y: midY - perpSin * midWidth / 2,
    };

    // Build path with smooth cubic bezier curves
    const t = tension;

    // Control points for left edge (going outward)
    const cp1lx = startLeft.x + (midLeft.x - startLeft.x) * t;
    const cp1ly = startLeft.y + (midLeft.y - startLeft.y) * t;
    const cp2lx = midLeft.x - (midLeft.x - startLeft.x) * (1 - t) * 0.5;
    const cp2ly = midLeft.y - (midLeft.y - startLeft.y) * (1 - t) * 0.5;

    const cp3lx = midLeft.x + (endLeft.x - midLeft.x) * t;
    const cp3ly = midLeft.y + (endLeft.y - midLeft.y) * t;
    const cp4lx = endLeft.x - (endLeft.x - midLeft.x) * (1 - t) * 0.5;
    const cp4ly = endLeft.y - (endLeft.y - midLeft.y) * (1 - t) * 0.5;

    // Control points for right edge (going back)
    const cp1rx = endRight.x - (endRight.x - midRight.x) * t;
    const cp1ry = endRight.y - (endRight.y - midRight.y) * t;
    const cp2rx = midRight.x + (endRight.x - midRight.x) * (1 - t) * 0.5;
    const cp2ry = midRight.y + (endRight.y - midRight.y) * (1 - t) * 0.5;

    const cp3rx = midRight.x - (midRight.x - startRight.x) * t;
    const cp3ry = midRight.y - (midRight.y - startRight.y) * t;
    const cp4rx = startRight.x + (midRight.x - startRight.x) * (1 - t) * 0.5;
    const cp4ry = startRight.y + (midRight.y - startRight.y) * (1 - t) * 0.5;

    // Construct the full bezier path
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
 * Generate center shape using bezier circle
 */
function generateCenterPath(params: StarburstParams, cx: number, cy: number): string {
    if (params.centerRadius < 2) return '';
    return createBezierCircle(cx, cy, params.centerRadius);
}

// ============================================
// MAIN GENERATOR
// ============================================

/**
 * Generate a single starburst logo candidate
 */
function generateSingleStarburst(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const {
        brandName,
        primaryColor,
        accentColor,
    } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateStarburstParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('starburst', variant);

    // Add radial gradient for depth
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'radial',
        stops: [
            { offset: 0, color: lighten(primaryColor, 15) },
            { offset: 0.5, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 10) },
        ],
    });

    // Generate all arms
    const arms: ArmPath[] = [];
    for (let i = 0; i < algoParams.armCount; i++) {
        arms.push(generateArmPath(algoParams, i, algoParams.armCount, cx, cy, rng));
    }

    // Render arms with individual gradients based on angle
    arms.forEach(arm => {
        const armGradId = `${uniqueId}-arm-${arm.index}`;
        const angleNorm = (arm.angle % (Math.PI * 2)) / (Math.PI * 2);

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

    // Render center circle
    const centerPath = generateCenterPath(algoParams, cx, cy);
    if (centerPath) {
        svg.path(centerPath, {
            fill: `url(#${gradientId})`,
        });
    }

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'starburst', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'starburst',
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
                usesGoldenRatio: algoParams.armTaper > 0.55 && algoParams.armTaper < 0.68,
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
    };

    return { logo, quality };
}

// ============================================
// FILTERING CONSTANTS
// ============================================

const CANDIDATES_PER_GENERATION = 10; // Generate 10 candidates
const TOP_LOGOS_TO_SHOW = 5;          // Show top 5 to user
const MIN_QUALITY_SCORE = 75;         // Reject logos below this threshold
const DEBUG_REJECTED_LOGOS = true;    // Log rejected logos to console

/**
 * Generate starburst logos with quality filtering
 * ENHANCED: Generates 10 candidates internally, filters by quality, shows top 5
 * Logs rejected logos to console for debugging
 */
export function generateStarburst(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        minQualityScore = MIN_QUALITY_SCORE,
        category = 'technology',
    } = params;

    // Generate all candidates
    const allCandidates: Array<{ logo: GeneratedLogo; quality: QualityMetrics }> = [];
    const rejectedLogos: Array<{ logo: GeneratedLogo; quality: QualityMetrics; reasons: string[] }> = [];

    console.log(`[Starburst Generator] Generating ${CANDIDATES_PER_GENERATION} candidates for "${brandName}"...`);

    for (let c = 0; c < CANDIDATES_PER_GENERATION; c++) {
        // Generate unique hash for each candidate (ensures different outputs)
        const hashParams = generateHashParamsSync(brandName, category);
        const { logo, quality } = generateSingleStarburst(params, hashParams, c);

        // Check if it meets quality threshold
        if (quality.score >= minQualityScore) {
            allCandidates.push({ logo, quality });
        } else {
            // Log rejected logos for debugging
            const reasons = quality.rejections?.map(r => r.reason) || [`Score too low: ${quality.score}`];
            rejectedLogos.push({ logo, quality, reasons });
        }
    }

    // Log rejected logos if debugging is enabled
    if (DEBUG_REJECTED_LOGOS && rejectedLogos.length > 0) {
        console.log(`[Starburst Generator] Rejected ${rejectedLogos.length} logos:`);
        rejectedLogos.forEach((rejected, idx) => {
            console.log(`  ${idx + 1}. Score: ${rejected.quality.score}/100 - Reasons: ${rejected.reasons.join(', ')}`);
            if (rejected.quality.rejections) {
                rejected.quality.rejections.forEach(r => {
                    console.log(`      - ${r.reason}: ${r.value.toFixed(1)} (threshold: ${r.threshold})`);
                });
            }
        });
    }

    // Sort by quality score descending
    allCandidates.sort((a, b) => b.quality.score - a.quality.score);

    // Take top N logos
    const topCandidates = allCandidates.slice(0, TOP_LOGOS_TO_SHOW);

    console.log(`[Starburst Generator] Returning ${topCandidates.length} logos (from ${allCandidates.length} that passed quality threshold)`);
    if (topCandidates.length > 0) {
        console.log(`  Quality scores: ${topCandidates.map(c => c.quality.score).join(', ')}`);
    }

    // Store hashes and build final array
    const logos: GeneratedLogo[] = [];
    topCandidates.forEach(({ logo, quality }, index) => {
        // Update variant number for final output
        const finalLogo: GeneratedLogo = {
            ...logo,
            variant: index + 1,
        };

        storeHash({
            hash: finalLogo.hash,
            brandName,
            algorithm: 'starburst',
            variant: index,
            createdAt: Date.now(),
            qualityScore: quality.score,
        });

        logos.push(finalLogo);
    });

    // If we didn't get enough logos, generate more with relaxed threshold
    if (logos.length < TOP_LOGOS_TO_SHOW && allCandidates.length < TOP_LOGOS_TO_SHOW) {
        console.log(`[Starburst Generator] Not enough quality logos, adding best rejected ones...`);
        // Sort rejected by score descending and add the best ones
        rejectedLogos.sort((a, b) => b.quality.score - a.quality.score);
        const needed = TOP_LOGOS_TO_SHOW - logos.length;
        for (let i = 0; i < Math.min(needed, rejectedLogos.length); i++) {
            const { logo, quality } = rejectedLogos[i];
            const finalLogo: GeneratedLogo = {
                ...logo,
                variant: logos.length + 1,
            };
            storeHash({
                hash: finalLogo.hash,
                brandName,
                algorithm: 'starburst',
                variant: logos.length,
                createdAt: Date.now(),
                qualityScore: quality.score,
            });
            logos.push(finalLogo);
        }
    }

    return logos;
}

/**
 * Generate a single starburst for quick preview
 */
export function generateSingleStarburstPreview(
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<StarburstParams>,
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = { ...generateStarburstParams(hashParams, rng), ...customParams };
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
