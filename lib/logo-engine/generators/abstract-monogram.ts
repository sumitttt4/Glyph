/**
 * Abstract Monogram Generator
 *
 * Creates modern abstract letterform interpretations
 * Geometric and organic letter abstractions with bezier curves
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    AbstractMonogramParams,
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
    fbm,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateAbstractMonogramParams(rng: () => number): AbstractMonogramParams {
    const base = generateBaseParams(rng);
    const styles: Array<'geometric' | 'organic' | 'stencil' | 'ribbon'> = ['geometric', 'organic', 'stencil', 'ribbon'];
    const terminals: Array<'round' | 'square' | 'pointed'> = ['round', 'square', 'pointed'];

    return {
        ...base,
        letterStyle: styles[Math.floor(rng() * styles.length)],
        letterConnections: rng() > 0.4,                   // 60% chance
        strokeModulation: 0.2 + rng() * 0.6,              // 0.2-0.8
        terminalStyle: terminals[Math.floor(rng() * terminals.length)],
        ligatureStrength: 0.3 + rng() * 0.5,              // 0.3-0.8
        deconstructLevel: rng() * 0.5,                    // 0-0.5
        pathSimplification: 0.3 + rng() * 0.4,            // 0.3-0.7
        experimentalCuts: rng() * 0.4,                    // 0-0.4
    };
}

// ============================================
// LETTER SKELETON GENERATION
// ============================================

interface LetterSkeleton {
    strokes: Point[][];
    width: number;
    height: number;
}

/**
 * Generate skeleton points for a letter
 */
function getLetterSkeleton(letter: string, size: number): LetterSkeleton {
    const s = size * 0.35;
    const cx = size / 2;
    const cy = size / 2;

    // Define letter skeletons as arrays of stroke point sequences
    const skeletons: Record<string, Point[][]> = {
        A: [
            [{ x: cx - s * 0.4, y: cy + s }, { x: cx, y: cy - s }, { x: cx + s * 0.4, y: cy + s }],
            [{ x: cx - s * 0.2, y: cy + s * 0.3 }, { x: cx + s * 0.2, y: cy + s * 0.3 }],
        ],
        B: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }],
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx + s * 0.1, y: cy - s }, { x: cx + s * 0.3, y: cy - s * 0.5 }, { x: cx + s * 0.1, y: cy }, { x: cx - s * 0.3, y: cy }],
            [{ x: cx - s * 0.3, y: cy }, { x: cx + s * 0.15, y: cy }, { x: cx + s * 0.35, y: cy + s * 0.5 }, { x: cx + s * 0.1, y: cy + s }, { x: cx - s * 0.3, y: cy + s }],
        ],
        C: [
            [{ x: cx + s * 0.3, y: cy - s * 0.7 }, { x: cx, y: cy - s }, { x: cx - s * 0.4, y: cy - s * 0.5 },
             { x: cx - s * 0.4, y: cy + s * 0.5 }, { x: cx, y: cy + s }, { x: cx + s * 0.3, y: cy + s * 0.7 }],
        ],
        D: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }],
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx + s * 0.1, y: cy - s }, { x: cx + s * 0.4, y: cy - s * 0.5 },
             { x: cx + s * 0.4, y: cy + s * 0.5 }, { x: cx + s * 0.1, y: cy + s }, { x: cx - s * 0.3, y: cy + s }],
        ],
        E: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }],
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx + s * 0.3, y: cy - s }],
            [{ x: cx - s * 0.3, y: cy }, { x: cx + s * 0.2, y: cy }],
            [{ x: cx - s * 0.3, y: cy + s }, { x: cx + s * 0.3, y: cy + s }],
        ],
        F: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }],
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx + s * 0.3, y: cy - s }],
            [{ x: cx - s * 0.3, y: cy }, { x: cx + s * 0.2, y: cy }],
        ],
        G: [
            [{ x: cx + s * 0.3, y: cy - s * 0.7 }, { x: cx, y: cy - s }, { x: cx - s * 0.4, y: cy - s * 0.5 },
             { x: cx - s * 0.4, y: cy + s * 0.5 }, { x: cx, y: cy + s }, { x: cx + s * 0.3, y: cy + s * 0.7 },
             { x: cx + s * 0.3, y: cy }, { x: cx, y: cy }],
        ],
        H: [
            [{ x: cx - s * 0.35, y: cy - s }, { x: cx - s * 0.35, y: cy + s }],
            [{ x: cx + s * 0.35, y: cy - s }, { x: cx + s * 0.35, y: cy + s }],
            [{ x: cx - s * 0.35, y: cy }, { x: cx + s * 0.35, y: cy }],
        ],
        I: [
            [{ x: cx, y: cy - s }, { x: cx, y: cy + s }],
            [{ x: cx - s * 0.2, y: cy - s }, { x: cx + s * 0.2, y: cy - s }],
            [{ x: cx - s * 0.2, y: cy + s }, { x: cx + s * 0.2, y: cy + s }],
        ],
        J: [
            [{ x: cx + s * 0.2, y: cy - s }, { x: cx + s * 0.2, y: cy + s * 0.5 },
             { x: cx, y: cy + s }, { x: cx - s * 0.3, y: cy + s * 0.7 }],
        ],
        K: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }],
            [{ x: cx + s * 0.35, y: cy - s }, { x: cx - s * 0.3, y: cy }],
            [{ x: cx - s * 0.3, y: cy }, { x: cx + s * 0.35, y: cy + s }],
        ],
        L: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }, { x: cx + s * 0.3, y: cy + s }],
        ],
        M: [
            [{ x: cx - s * 0.4, y: cy + s }, { x: cx - s * 0.4, y: cy - s }, { x: cx, y: cy + s * 0.3 },
             { x: cx + s * 0.4, y: cy - s }, { x: cx + s * 0.4, y: cy + s }],
        ],
        N: [
            [{ x: cx - s * 0.35, y: cy + s }, { x: cx - s * 0.35, y: cy - s }, { x: cx + s * 0.35, y: cy + s },
             { x: cx + s * 0.35, y: cy - s }],
        ],
        O: [
            [{ x: cx, y: cy - s }, { x: cx + s * 0.4, y: cy - s * 0.5 }, { x: cx + s * 0.4, y: cy + s * 0.5 },
             { x: cx, y: cy + s }, { x: cx - s * 0.4, y: cy + s * 0.5 }, { x: cx - s * 0.4, y: cy - s * 0.5 },
             { x: cx, y: cy - s }],
        ],
        P: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }],
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx + s * 0.2, y: cy - s }, { x: cx + s * 0.35, y: cy - s * 0.5 },
             { x: cx + s * 0.2, y: cy }, { x: cx - s * 0.3, y: cy }],
        ],
        Q: [
            [{ x: cx, y: cy - s }, { x: cx + s * 0.4, y: cy - s * 0.5 }, { x: cx + s * 0.4, y: cy + s * 0.5 },
             { x: cx, y: cy + s }, { x: cx - s * 0.4, y: cy + s * 0.5 }, { x: cx - s * 0.4, y: cy - s * 0.5 },
             { x: cx, y: cy - s }],
            [{ x: cx + s * 0.1, y: cy + s * 0.3 }, { x: cx + s * 0.4, y: cy + s * 1.1 }],
        ],
        R: [
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx - s * 0.3, y: cy + s }],
            [{ x: cx - s * 0.3, y: cy - s }, { x: cx + s * 0.2, y: cy - s }, { x: cx + s * 0.35, y: cy - s * 0.5 },
             { x: cx + s * 0.2, y: cy }, { x: cx - s * 0.3, y: cy }],
            [{ x: cx, y: cy }, { x: cx + s * 0.35, y: cy + s }],
        ],
        S: [
            [{ x: cx + s * 0.3, y: cy - s * 0.7 }, { x: cx, y: cy - s }, { x: cx - s * 0.3, y: cy - s * 0.6 },
             { x: cx - s * 0.3, y: cy - s * 0.2 }, { x: cx + s * 0.3, y: cy + s * 0.2 },
             { x: cx + s * 0.3, y: cy + s * 0.6 }, { x: cx, y: cy + s }, { x: cx - s * 0.3, y: cy + s * 0.7 }],
        ],
        T: [
            [{ x: cx, y: cy - s }, { x: cx, y: cy + s }],
            [{ x: cx - s * 0.4, y: cy - s }, { x: cx + s * 0.4, y: cy - s }],
        ],
        U: [
            [{ x: cx - s * 0.35, y: cy - s }, { x: cx - s * 0.35, y: cy + s * 0.5 },
             { x: cx, y: cy + s }, { x: cx + s * 0.35, y: cy + s * 0.5 }, { x: cx + s * 0.35, y: cy - s }],
        ],
        V: [
            [{ x: cx - s * 0.4, y: cy - s }, { x: cx, y: cy + s }, { x: cx + s * 0.4, y: cy - s }],
        ],
        W: [
            [{ x: cx - s * 0.45, y: cy - s }, { x: cx - s * 0.25, y: cy + s }, { x: cx, y: cy - s * 0.2 },
             { x: cx + s * 0.25, y: cy + s }, { x: cx + s * 0.45, y: cy - s }],
        ],
        X: [
            [{ x: cx - s * 0.35, y: cy - s }, { x: cx + s * 0.35, y: cy + s }],
            [{ x: cx + s * 0.35, y: cy - s }, { x: cx - s * 0.35, y: cy + s }],
        ],
        Y: [
            [{ x: cx - s * 0.35, y: cy - s }, { x: cx, y: cy }],
            [{ x: cx + s * 0.35, y: cy - s }, { x: cx, y: cy }],
            [{ x: cx, y: cy }, { x: cx, y: cy + s }],
        ],
        Z: [
            [{ x: cx - s * 0.35, y: cy - s }, { x: cx + s * 0.35, y: cy - s },
             { x: cx - s * 0.35, y: cy + s }, { x: cx + s * 0.35, y: cy + s }],
        ],
    };

    const skeleton = skeletons[letter.toUpperCase()] || skeletons['A'];
    return {
        strokes: skeleton,
        width: s * 2,
        height: s * 2,
    };
}

// ============================================
// STROKE STYLING
// ============================================

/**
 * Convert skeleton points to styled bezier paths
 */
function skeletonToStyledPath(
    strokes: Point[][],
    params: AbstractMonogramParams,
    rng: () => number,
    seed: string
): string[] {
    const paths: string[] = [];

    strokes.forEach((stroke, strokeIndex) => {
        if (stroke.length < 2) return;

        // Apply deconstructing if enabled
        const shouldDeconstruct = rng() < params.deconstructLevel;
        const deconstructedStrokes = shouldDeconstruct
            ? deconstructStroke(stroke, params, rng)
            : [stroke];

        deconstructedStrokes.forEach((points, partIndex) => {
            // Apply style based on letterStyle
            let path: string;

            switch (params.letterStyle) {
                case 'organic':
                    path = createOrganicStrokePath(points, params, rng, `${seed}-${strokeIndex}-${partIndex}`);
                    break;
                case 'stencil':
                    path = createStencilStrokePath(points, params, rng);
                    break;
                case 'ribbon':
                    path = createRibbonStrokePath(points, params, rng);
                    break;
                case 'geometric':
                default:
                    path = createGeometricStrokePath(points, params, rng);
                    break;
            }

            paths.push(path);
        });
    });

    return paths;
}

/**
 * Deconstruct a stroke into segments
 */
function deconstructStroke(
    stroke: Point[],
    params: AbstractMonogramParams,
    rng: () => number
): Point[][] {
    if (stroke.length < 3) return [stroke];

    const segments: Point[][] = [];
    const numSegments = 2 + Math.floor(rng() * 2);
    const pointsPerSegment = Math.ceil(stroke.length / numSegments);

    for (let i = 0; i < numSegments; i++) {
        const start = i * pointsPerSegment;
        const end = Math.min((i + 1) * pointsPerSegment + 1, stroke.length);
        const segment = stroke.slice(start, end);
        if (segment.length >= 2) {
            segments.push(segment);
        }
    }

    return segments;
}

/**
 * Create geometric style stroke path
 */
function createGeometricStrokePath(
    points: Point[],
    params: AbstractMonogramParams,
    rng: () => number
): string {
    const baseWidth = params.strokeWidth * 3;
    const path: string[] = [];

    // Calculate perpendiculars and create filled shape
    const topEdge: Point[] = [];
    const bottomEdge: Point[] = [];

    for (let i = 0; i < points.length; i++) {
        const prev = points[Math.max(0, i - 1)];
        const curr = points[i];
        const next = points[Math.min(points.length - 1, i + 1)];

        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        // Modulate width
        const t = i / (points.length - 1);
        const widthMod = 1 - Math.abs(t - 0.5) * params.strokeModulation * 2;
        const width = baseWidth * widthMod / 2;

        topEdge.push({ x: curr.x + nx * width, y: curr.y + ny * width });
        bottomEdge.push({ x: curr.x - nx * width, y: curr.y - ny * width });
    }

    // Build path
    path.push(`M ${topEdge[0].x.toFixed(2)} ${topEdge[0].y.toFixed(2)}`);

    // Top edge forward
    for (let i = 1; i < topEdge.length; i++) {
        path.push(`L ${topEdge[i].x.toFixed(2)} ${topEdge[i].y.toFixed(2)}`);
    }

    // Terminal cap
    addTerminalCap(path, topEdge[topEdge.length - 1], bottomEdge[bottomEdge.length - 1], params.terminalStyle);

    // Bottom edge backward
    for (let i = bottomEdge.length - 1; i >= 0; i--) {
        path.push(`L ${bottomEdge[i].x.toFixed(2)} ${bottomEdge[i].y.toFixed(2)}`);
    }

    // Start cap
    addTerminalCap(path, bottomEdge[0], topEdge[0], params.terminalStyle);

    path.push('Z');
    return path.join(' ');
}

/**
 * Create organic style stroke path
 */
function createOrganicStrokePath(
    points: Point[],
    params: AbstractMonogramParams,
    rng: () => number,
    seed: string
): string {
    const baseWidth = params.strokeWidth * 3;
    const topEdge: Point[] = [];
    const bottomEdge: Point[] = [];

    for (let i = 0; i < points.length; i++) {
        const prev = points[Math.max(0, i - 1)];
        const curr = points[i];
        const next = points[Math.min(points.length - 1, i + 1)];

        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        const t = i / (points.length - 1);
        const noiseVal = fbm(t * 3, i * 0.5, seed) * params.strokeModulation;
        const width = baseWidth * (0.8 + noiseVal * 0.4) / 2;

        topEdge.push({
            x: curr.x + nx * width + addNoise(0, params.noiseAmount, rng, 1),
            y: curr.y + ny * width + addNoise(0, params.noiseAmount, rng, 1),
        });
        bottomEdge.push({
            x: curr.x - nx * width + addNoise(0, params.noiseAmount, rng, 1),
            y: curr.y - ny * width + addNoise(0, params.noiseAmount, rng, 1),
        });
    }

    return buildSmoothStrokePath(topEdge, bottomEdge, params.curveTension, params.terminalStyle);
}

/**
 * Create stencil style stroke path (with cuts)
 */
function createStencilStrokePath(
    points: Point[],
    params: AbstractMonogramParams,
    rng: () => number
): string {
    // Create base geometric path then add stencil cuts
    const basePath = createGeometricStrokePath(points, params, rng);

    // For stencil, we return the base path - cuts would need to be separate masks
    return basePath;
}

/**
 * Create ribbon style stroke path
 */
function createRibbonStrokePath(
    points: Point[],
    params: AbstractMonogramParams,
    rng: () => number
): string {
    const baseWidth = params.strokeWidth * 4;
    const topEdge: Point[] = [];
    const bottomEdge: Point[] = [];

    for (let i = 0; i < points.length; i++) {
        const prev = points[Math.max(0, i - 1)];
        const curr = points[i];
        const next = points[Math.min(points.length - 1, i + 1)];

        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        // Ribbon effect - width varies sinusoidally
        const t = i / (points.length - 1);
        const ribbonWave = Math.sin(t * Math.PI * 2) * 0.3;
        const width = baseWidth * (0.5 + ribbonWave * params.strokeModulation) / 2;

        topEdge.push({ x: curr.x + nx * width, y: curr.y + ny * width });
        bottomEdge.push({ x: curr.x - nx * width, y: curr.y - ny * width });
    }

    return buildSmoothStrokePath(topEdge, bottomEdge, params.curveTension * 1.5, 'round');
}

/**
 * Build a smooth stroke path from edges
 */
function buildSmoothStrokePath(
    topEdge: Point[],
    bottomEdge: Point[],
    tension: number,
    terminalStyle: 'round' | 'square' | 'pointed'
): string {
    const path: string[] = [];

    path.push(`M ${topEdge[0].x.toFixed(2)} ${topEdge[0].y.toFixed(2)}`);

    // Top edge with bezier
    for (let i = 0; i < topEdge.length - 1; i++) {
        const p0 = topEdge[Math.max(0, i - 1)];
        const p1 = topEdge[i];
        const p2 = topEdge[i + 1];
        const p3 = topEdge[Math.min(topEdge.length - 1, i + 2)];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 6;

        path.push(`C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
    }

    // End cap
    addTerminalCap(path, topEdge[topEdge.length - 1], bottomEdge[bottomEdge.length - 1], terminalStyle);

    // Bottom edge (reverse) with bezier
    for (let i = bottomEdge.length - 2; i >= 0; i--) {
        const p0 = bottomEdge[Math.min(bottomEdge.length - 1, i + 2)];
        const p1 = bottomEdge[i + 1];
        const p2 = bottomEdge[i];
        const p3 = bottomEdge[Math.max(0, i - 1)];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 6;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 6;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 6;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 6;

        path.push(`C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
    }

    // Start cap
    addTerminalCap(path, bottomEdge[0], topEdge[0], terminalStyle);

    path.push('Z');
    return path.join(' ');
}

/**
 * Add terminal cap to path
 */
function addTerminalCap(
    path: string[],
    from: Point,
    to: Point,
    style: 'round' | 'square' | 'pointed'
): void {
    switch (style) {
        case 'round': {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const cpOffset = Math.sqrt(Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2)) * 0.3;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const perpX = -dy / len * cpOffset;
            const perpY = dx / len * cpOffset;

            path.push(`Q ${midX + perpX} ${midY + perpY}, ${to.x.toFixed(2)} ${to.y.toFixed(2)}`);
            break;
        }
        case 'pointed': {
            const midX = (from.x + to.x) / 2;
            const midY = (from.y + to.y) / 2;
            const dx = to.x - from.x;
            const dy = to.y - from.y;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            const pointOffset = len * 0.3;
            const perpX = -dy / len * pointOffset;
            const perpY = dx / len * pointOffset;

            path.push(`L ${midX + perpX} ${midY + perpY} L ${to.x.toFixed(2)} ${to.y.toFixed(2)}`);
            break;
        }
        case 'square':
        default:
            path.push(`L ${to.x.toFixed(2)} ${to.y.toFixed(2)}`);
            break;
    }
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateAbstractMonogram(params: LogoGenerationParams): GeneratedLogo[] {
    const {
        brandName,
        primaryColor,
        accentColor,
        variations = 3,
        seed = brandName,
    } = params;

    const logos: GeneratedLogo[] = [];
    const size = 100;
    const letter = brandName.charAt(0).toUpperCase();

    for (let v = 0; v < variations; v++) {
        const variantSeed = `${seed}-abstract-monogram-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateAbstractMonogramParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('abstract-monogram', v);

        // Get letter skeleton
        const skeleton = getLetterSkeleton(letter, size);

        // Convert to styled paths
        const styledPaths = skeletonToStyledPath(skeleton.strokes, algoParams, rng, variantSeed);

        // Add gradient
        const gradientId = `${uniqueId}-grad`;
        svg.addGradient(gradientId, {
            type: 'linear',
            angle: 135 + rng() * 30,
            stops: [
                { offset: 0, color: lighten(primaryColor, 10) },
                { offset: 0.5, color: primaryColor },
                { offset: 1, color: accentColor || darken(primaryColor, 15) },
            ],
        });

        // Render paths
        styledPaths.forEach((pathD, i) => {
            const pathGradId = styledPaths.length > 1 ? `${uniqueId}-path-${i}` : gradientId;

            if (styledPaths.length > 1) {
                const progress = i / (styledPaths.length - 1);
                svg.addGradient(pathGradId, {
                    type: 'linear',
                    angle: 90 + progress * 45,
                    stops: [
                        { offset: 0, color: mixColors(primaryColor, lighten(primaryColor, 20), progress) },
                        { offset: 1, color: mixColors(primaryColor, accentColor || darken(primaryColor, 15), progress) },
                    ],
                });
            }

            svg.path(pathD, { fill: `url(#${pathGradId})` });
        });

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'abstract-monogram', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'abstract-monogram',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'abstract-monogram',
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
                    symmetry: 'none',
                    pathCount: styledPaths.length,
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

export function generateSingleAbstractMonogram(
    letter: string,
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<AbstractMonogramParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateAbstractMonogramParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);

    const skeleton = getLetterSkeleton(letter, size);
    const styledPaths = skeletonToStyledPath(skeleton.strokes, params, rng, seed);

    svg.addGradient('main', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 20) },
        ],
    });

    styledPaths.forEach(pathD => {
        svg.path(pathD, { fill: 'url(#main)' });
    });

    return svg.build();
}
