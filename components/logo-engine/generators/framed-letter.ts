/**
 * Framed Letter Generator (Notion-style)
 *
 * Creates a single letter within a geometric frame
 * Clean, minimal with optional cutout effects
 * Uses bezier paths for both frame and letter
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    FramedLetterParams,
    QualityMetrics,
    HashParams,
    Point,
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
    createBezierCircle,
    createBezierRoundedRect,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken } from '../core/color-utils';

// ============================================
// PARAMETER GENERATION
// ============================================

function generateFramedLetterParams(hashParams: HashParams, rng: () => number): FramedLetterParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const frameShapes: Array<'square' | 'circle' | 'rounded' | 'hexagon' | 'octagon'> =
        ['square', 'circle', 'rounded', 'hexagon', 'octagon'];
    const cutoutStyles: Array<'none' | 'partial' | 'full'> = ['none', 'partial', 'full'];

    return {
        ...base,
        frameShape: frameShapes[derived.styleVariant % 5],
        frameThickness: Math.max(2, Math.min(15, derived.strokeWidth + 2)),
        letterScale: Math.max(0.4, Math.min(0.9, 0.5 + derived.scaleFactor * 0.2)),
        letterWeight: Math.max(300, Math.min(800, derived.letterWeight)),
        cutoutStyle: cutoutStyles[Math.floor(derived.cutDepth * 3) % 3],
        cutoutDepth: derived.cutDepth,
        innerPadding: Math.max(5, Math.min(25, 15 + derived.spacingFactor * 5)),
        frameRotation: derived.rotationOffset < 45 ? derived.rotationOffset : 0,
    };
}

// ============================================
// FRAME PATH GENERATION
// ============================================

/**
 * Create frame path based on shape type
 */
function createFramePath(
    params: FramedLetterParams,
    cx: number,
    cy: number,
    size: number
): { outer: string; inner: string } {
    const outerSize = size * 0.8;
    const innerSize = outerSize - params.frameThickness * 2;

    switch (params.frameShape) {
        case 'circle':
            return {
                outer: createBezierCircle(cx, cy, outerSize / 2),
                inner: createBezierCircle(cx, cy, innerSize / 2),
            };

        case 'rounded':
            return {
                outer: createBezierRoundedRect(cx - outerSize / 2, cy - outerSize / 2, outerSize, outerSize, outerSize * 0.2),
                inner: createBezierRoundedRect(cx - innerSize / 2, cy - innerSize / 2, innerSize, innerSize, innerSize * 0.15),
            };

        case 'hexagon':
            return {
                outer: createHexagonPath(cx, cy, outerSize / 2),
                inner: createHexagonPath(cx, cy, innerSize / 2),
            };

        case 'octagon':
            return {
                outer: createOctagonPath(cx, cy, outerSize / 2),
                inner: createOctagonPath(cx, cy, innerSize / 2),
            };

        case 'square':
        default:
            return {
                outer: createBezierRoundedRect(cx - outerSize / 2, cy - outerSize / 2, outerSize, outerSize, 2),
                inner: createBezierRoundedRect(cx - innerSize / 2, cy - innerSize / 2, innerSize, innerSize, 2),
            };
    }
}

/**
 * Create hexagon using bezier curves
 */
function createHexagonPath(cx: number, cy: number, radius: number): string {
    const points: Point[] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
        });
    }
    return createPolygonWithBezier(points);
}

/**
 * Create octagon using bezier curves
 */
function createOctagonPath(cx: number, cy: number, radius: number): string {
    const points: Point[] = [];
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 - Math.PI / 8;
        points.push({
            x: cx + Math.cos(angle) * radius,
            y: cy + Math.sin(angle) * radius,
        });
    }
    return createPolygonWithBezier(points);
}

/**
 * Create polygon with slightly curved edges using bezier
 */
function createPolygonWithBezier(points: Point[]): string {
    if (points.length < 3) return '';

    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        // Very slight curve for organic feel
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        path += ` Q ${midX.toFixed(2)} ${midY.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    path += ' Z';
    return path;
}

// ============================================
// LETTER PATH GENERATION
// ============================================

/**
 * Generate letter path using bezier curves
 * Creates stylized geometric letterforms
 */
function createLetterPath(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    weight: number
): string {
    const char = letter.toUpperCase().charAt(0);
    const strokeWidth = (weight / 900) * size * 0.15;
    const halfSize = size / 2;

    // Generate geometric letter shapes
    switch (char) {
        case 'A':
            return createLetterA(cx, cy, halfSize, strokeWidth);
        case 'B':
            return createLetterB(cx, cy, halfSize, strokeWidth);
        case 'C':
            return createLetterC(cx, cy, halfSize, strokeWidth);
        case 'D':
            return createLetterD(cx, cy, halfSize, strokeWidth);
        case 'E':
            return createLetterE(cx, cy, halfSize, strokeWidth);
        case 'F':
            return createLetterF(cx, cy, halfSize, strokeWidth);
        case 'G':
            return createLetterG(cx, cy, halfSize, strokeWidth);
        case 'H':
            return createLetterH(cx, cy, halfSize, strokeWidth);
        case 'I':
            return createLetterI(cx, cy, halfSize, strokeWidth);
        case 'J':
            return createLetterJ(cx, cy, halfSize, strokeWidth);
        case 'K':
            return createLetterK(cx, cy, halfSize, strokeWidth);
        case 'L':
            return createLetterL(cx, cy, halfSize, strokeWidth);
        case 'M':
            return createLetterM(cx, cy, halfSize, strokeWidth);
        case 'N':
            return createLetterN(cx, cy, halfSize, strokeWidth);
        case 'O':
            return createLetterO(cx, cy, halfSize, strokeWidth);
        case 'P':
            return createLetterP(cx, cy, halfSize, strokeWidth);
        case 'Q':
            return createLetterQ(cx, cy, halfSize, strokeWidth);
        case 'R':
            return createLetterR(cx, cy, halfSize, strokeWidth);
        case 'S':
            return createLetterS(cx, cy, halfSize, strokeWidth);
        case 'T':
            return createLetterT(cx, cy, halfSize, strokeWidth);
        case 'U':
            return createLetterU(cx, cy, halfSize, strokeWidth);
        case 'V':
            return createLetterV(cx, cy, halfSize, strokeWidth);
        case 'W':
            return createLetterW(cx, cy, halfSize, strokeWidth);
        case 'X':
            return createLetterX(cx, cy, halfSize, strokeWidth);
        case 'Y':
            return createLetterY(cx, cy, halfSize, strokeWidth);
        case 'Z':
            return createLetterZ(cx, cy, halfSize, strokeWidth);
        default:
            return createLetterO(cx, cy, halfSize, strokeWidth);
    }
}

// Letter path helpers - geometric/minimal style
function createLetterA(cx: number, cy: number, size: number, sw: number): string {
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;
    const left = cx - size * 0.5;
    const right = cx + size * 0.5;
    const midY = cy + size * 0.2;

    return `
        M ${left} ${bottom}
        L ${cx} ${top}
        L ${right} ${bottom}
        L ${right - sw} ${bottom}
        L ${cx} ${top + sw * 2}
        L ${left + sw} ${bottom}
        Z
        M ${cx - size * 0.25} ${midY}
        L ${cx + size * 0.25} ${midY}
        L ${cx + size * 0.25} ${midY + sw}
        L ${cx - size * 0.25} ${midY + sw}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterB(cx: number, cy: number, size: number, sw: number): string {
    const k = 0.5522847498;
    const left = cx - size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;
    const right = cx + size * 0.4;

    return `
        M ${left} ${top}
        L ${cx} ${top}
        C ${right + size * 0.2} ${top}, ${right + size * 0.2} ${cy - sw / 2}, ${cx} ${cy - sw / 2}
        L ${left + sw} ${cy - sw / 2}
        L ${left + sw} ${top + sw}
        L ${cx - size * 0.1} ${top + sw}
        C ${right - size * 0.1} ${top + sw}, ${right - size * 0.1} ${cy - sw * 1.5}, ${cx - size * 0.1} ${cy - sw * 1.5}
        L ${left + sw} ${cy - sw * 1.5}
        L ${left + sw} ${cy + sw / 2}
        L ${cx} ${cy + sw / 2}
        C ${right + size * 0.3} ${cy + sw / 2}, ${right + size * 0.3} ${bottom}, ${cx} ${bottom}
        L ${left} ${bottom}
        L ${left} ${top}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterC(cx: number, cy: number, size: number, sw: number): string {
    const radius = size * 0.7;
    const innerRadius = radius - sw;

    return `
        M ${cx + radius * 0.7} ${cy - radius * 0.7}
        C ${cx + radius * 0.3} ${cy - radius}, ${cx - radius} ${cy - radius * 0.5}, ${cx - radius} ${cy}
        C ${cx - radius} ${cy + radius * 0.5}, ${cx + radius * 0.3} ${cy + radius}, ${cx + radius * 0.7} ${cy + radius * 0.7}
        L ${cx + innerRadius * 0.6} ${cy + innerRadius * 0.6}
        C ${cx + innerRadius * 0.2} ${cy + innerRadius * 0.85}, ${cx - innerRadius} ${cy + innerRadius * 0.4}, ${cx - innerRadius} ${cy}
        C ${cx - innerRadius} ${cy - innerRadius * 0.4}, ${cx + innerRadius * 0.2} ${cy - innerRadius * 0.85}, ${cx + innerRadius * 0.6} ${cy - innerRadius * 0.6}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterD(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${cx - size * 0.1} ${top}
        C ${cx + size * 0.6} ${top}, ${cx + size * 0.6} ${bottom}, ${cx - size * 0.1} ${bottom}
        L ${left} ${bottom}
        L ${left} ${top}
        Z
        M ${left + sw} ${top + sw}
        L ${left + sw} ${bottom - sw}
        L ${cx - size * 0.1} ${bottom - sw}
        C ${cx + size * 0.35} ${bottom - sw}, ${cx + size * 0.35} ${top + sw}, ${cx - size * 0.1} ${top + sw}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterE(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.4;
    const right = cx + size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${right} ${top}
        L ${right} ${top + sw}
        L ${left + sw} ${top + sw}
        L ${left + sw} ${cy - sw / 2}
        L ${right - size * 0.1} ${cy - sw / 2}
        L ${right - size * 0.1} ${cy + sw / 2}
        L ${left + sw} ${cy + sw / 2}
        L ${left + sw} ${bottom - sw}
        L ${right} ${bottom - sw}
        L ${right} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterF(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.4;
    const right = cx + size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${right} ${top}
        L ${right} ${top + sw}
        L ${left + sw} ${top + sw}
        L ${left + sw} ${cy - sw / 2}
        L ${right - size * 0.15} ${cy - sw / 2}
        L ${right - size * 0.15} ${cy + sw / 2}
        L ${left + sw} ${cy + sw / 2}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterG(cx: number, cy: number, size: number, sw: number): string {
    return createLetterC(cx, cy, size, sw) + ` M ${cx} ${cy} L ${cx + size * 0.5} ${cy} L ${cx + size * 0.5} ${cy + size * 0.5} L ${cx + size * 0.5 - sw} ${cy + size * 0.5} L ${cx + size * 0.5 - sw} ${cy + sw} L ${cx} ${cy + sw} Z`;
}

function createLetterH(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.45;
    const right = cx + size * 0.45;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${cy - sw / 2}
        L ${right - sw} ${cy - sw / 2}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${right} ${bottom}
        L ${right - sw} ${bottom}
        L ${right - sw} ${cy + sw / 2}
        L ${left + sw} ${cy + sw / 2}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterI(cx: number, cy: number, size: number, sw: number): string {
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${cx - sw / 2} ${top}
        L ${cx + sw / 2} ${top}
        L ${cx + sw / 2} ${bottom}
        L ${cx - sw / 2} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterJ(cx: number, cy: number, size: number, sw: number): string {
    const right = cx + size * 0.2;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.6;

    return `
        M ${right - sw} ${top}
        L ${right} ${top}
        L ${right} ${bottom}
        C ${right} ${cy + size * 0.9}, ${cx - size * 0.4} ${cy + size * 0.9}, ${cx - size * 0.4} ${bottom}
        L ${cx - size * 0.4} ${bottom - sw}
        C ${cx - size * 0.25} ${bottom}, ${right - sw} ${bottom}, ${right - sw} ${bottom - sw * 0.5}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterK(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${cy - sw}
        L ${cx + size * 0.3} ${top}
        L ${cx + size * 0.5} ${top}
        L ${left + sw} ${cy}
        L ${cx + size * 0.5} ${bottom}
        L ${cx + size * 0.3} ${bottom}
        L ${left + sw} ${cy + sw}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterL(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.35;
    const right = cx + size * 0.35;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${bottom - sw}
        L ${right} ${bottom - sw}
        L ${right} ${bottom}
        L ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterM(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.5;
    const right = cx + size * 0.5;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${bottom}
        L ${left} ${top}
        L ${left + sw * 0.5} ${top}
        L ${cx} ${cy}
        L ${right - sw * 0.5} ${top}
        L ${right} ${top}
        L ${right} ${bottom}
        L ${right - sw} ${bottom}
        L ${right - sw} ${top + sw * 2}
        L ${cx} ${cy + sw}
        L ${left + sw} ${top + sw * 2}
        L ${left + sw} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterN(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.4;
    const right = cx + size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${bottom}
        L ${left} ${top}
        L ${left + sw * 0.7} ${top}
        L ${right - sw} ${bottom - sw * 2}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${right} ${bottom}
        L ${right - sw * 0.7} ${bottom}
        L ${left + sw} ${top + sw * 2}
        L ${left + sw} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterO(cx: number, cy: number, size: number, sw: number): string {
    const outer = createBezierCircle(cx, cy, size * 0.75);
    const inner = createBezierCircle(cx, cy, size * 0.75 - sw);
    return outer + ' ' + inner;
}

function createLetterP(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.35;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${cx} ${top}
        C ${cx + size * 0.5} ${top}, ${cx + size * 0.5} ${cy + sw}, ${cx} ${cy + sw}
        L ${left + sw} ${cy + sw}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        Z
        M ${left + sw} ${top + sw}
        L ${cx - size * 0.05} ${top + sw}
        C ${cx + size * 0.25} ${top + sw}, ${cx + size * 0.25} ${cy - sw * 0.5}, ${cx - size * 0.05} ${cy - sw * 0.5}
        L ${left + sw} ${cy - sw * 0.5}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterQ(cx: number, cy: number, size: number, sw: number): string {
    const oPath = createLetterO(cx, cy, size, sw);
    const tailPath = `M ${cx + size * 0.2} ${cy + size * 0.3} L ${cx + size * 0.6} ${cy + size * 0.9} L ${cx + size * 0.6 - sw * 0.7} ${cy + size * 0.9} L ${cx + size * 0.2 - sw * 0.5} ${cy + size * 0.4} Z`;
    return oPath + ' ' + tailPath;
}

function createLetterR(cx: number, cy: number, size: number, sw: number): string {
    const pPath = createLetterP(cx, cy, size, sw);
    const legPath = `M ${cx - size * 0.05} ${cy} L ${cx + size * 0.4} ${cy + size * 0.8} L ${cx + size * 0.25} ${cy + size * 0.8} L ${cx - size * 0.15} ${cy + sw} Z`;
    return pPath + ' ' + legPath;
}

function createLetterS(cx: number, cy: number, size: number, sw: number): string {
    return `
        M ${cx + size * 0.4} ${cy - size * 0.6}
        C ${cx + size * 0.4} ${cy - size * 0.85}, ${cx - size * 0.5} ${cy - size * 0.85}, ${cx - size * 0.5} ${cy - size * 0.5}
        C ${cx - size * 0.5} ${cy - size * 0.2}, ${cx + size * 0.5} ${cy + size * 0.15}, ${cx + size * 0.5} ${cy + size * 0.5}
        C ${cx + size * 0.5} ${cy + size * 0.85}, ${cx - size * 0.4} ${cy + size * 0.85}, ${cx - size * 0.4} ${cy + size * 0.6}
        L ${cx - size * 0.4 + sw} ${cy + size * 0.55}
        C ${cx - size * 0.3} ${cy + size * 0.7}, ${cx + size * 0.35} ${cy + size * 0.7}, ${cx + size * 0.35} ${cy + size * 0.5}
        C ${cx + size * 0.35} ${cy + size * 0.25}, ${cx - size * 0.35} ${cy - size * 0.1}, ${cx - size * 0.35} ${cy - size * 0.5}
        C ${cx - size * 0.35} ${cy - size * 0.7}, ${cx + size * 0.25} ${cy - size * 0.7}, ${cx + size * 0.3} ${cy - size * 0.55}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterT(cx: number, cy: number, size: number, sw: number): string {
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${cx - size * 0.45} ${top}
        L ${cx + size * 0.45} ${top}
        L ${cx + size * 0.45} ${top + sw}
        L ${cx + sw / 2} ${top + sw}
        L ${cx + sw / 2} ${bottom}
        L ${cx - sw / 2} ${bottom}
        L ${cx - sw / 2} ${top + sw}
        L ${cx - size * 0.45} ${top + sw}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterU(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.4;
    const right = cx + size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.5;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${left + sw} ${bottom}
        C ${left + sw} ${cy + size * 0.75}, ${right - sw} ${cy + size * 0.75}, ${right - sw} ${bottom}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${right} ${bottom}
        C ${right} ${cy + size * 0.9}, ${left} ${cy + size * 0.9}, ${left} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterV(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.5;
    const right = cx + size * 0.5;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${cx} ${bottom - sw}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${cx} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterW(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.55;
    const right = cx + size * 0.55;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${left + sw * 0.7} ${top}
        L ${cx - size * 0.2} ${bottom - sw}
        L ${cx} ${cy}
        L ${cx + size * 0.2} ${bottom - sw}
        L ${right - sw * 0.7} ${top}
        L ${right} ${top}
        L ${cx + size * 0.25} ${bottom}
        L ${cx} ${cy + sw}
        L ${cx - size * 0.25} ${bottom}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterX(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.45;
    const right = cx + size * 0.45;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${cx} ${cy - sw * 0.5}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${cx + sw * 0.5} ${cy}
        L ${right} ${bottom}
        L ${right - sw} ${bottom}
        L ${cx} ${cy + sw * 0.5}
        L ${left + sw} ${bottom}
        L ${left} ${bottom}
        L ${cx - sw * 0.5} ${cy}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterY(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.45;
    const right = cx + size * 0.45;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${left + sw} ${top}
        L ${cx} ${cy - sw * 0.3}
        L ${right - sw} ${top}
        L ${right} ${top}
        L ${cx + sw / 2} ${cy}
        L ${cx + sw / 2} ${bottom}
        L ${cx - sw / 2} ${bottom}
        L ${cx - sw / 2} ${cy}
        Z
    `.replace(/\s+/g, ' ').trim();
}

function createLetterZ(cx: number, cy: number, size: number, sw: number): string {
    const left = cx - size * 0.4;
    const right = cx + size * 0.4;
    const top = cy - size * 0.8;
    const bottom = cy + size * 0.8;

    return `
        M ${left} ${top}
        L ${right} ${top}
        L ${right} ${top + sw}
        L ${left + sw * 1.5} ${bottom - sw}
        L ${right} ${bottom - sw}
        L ${right} ${bottom}
        L ${left} ${bottom}
        L ${left} ${bottom - sw}
        L ${right - sw * 1.5} ${top + sw}
        L ${left} ${top + sw}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleFramedLetter(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor } = params;

    const size = 100;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const algoParams = generateFramedLetterParams(hashParams, rng);
    const svg = createSVG(size);
    const uniqueId = generateLogoId('framed-letter', variant);

    // Get first letter of brand name
    const letter = brandName.charAt(0).toUpperCase();

    // Create frame paths
    const frame = createFramePath(algoParams, cx, cy, size);

    // Add gradient
    const gradientId = `${uniqueId}-grad`;
    svg.addGradient(gradientId, {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(primaryColor, 10) },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    // Render frame
    svg.path(frame.outer, { fill: `url(#${gradientId})` });
    svg.path(frame.inner, { fill: '#ffffff' });

    // Create and render letter
    const letterSize = size * algoParams.letterScale * 0.6;
    const letterPath = createLetterPath(letter, cx, cy, letterSize, algoParams.letterWeight);

    svg.path(letterPath, { fill: `url(#${gradientId})` });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'framed-letter', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'framed-letter',
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
                symmetry: algoParams.frameShape === 'circle' ? 'radial' : 'none',
                pathCount: 3,
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

export function generateFramedLetter(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'technology' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleFramedLetter(params, hashParams, v);

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
                algorithm: 'framed-letter',
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleFramedLetterPreview(
    primaryColor: string,
    accentColor?: string,
    letter: string = 'A',
    seed: string = 'preview'
): string {
    const hashParams = generateHashParamsSync(seed, 'technology');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateFramedLetterParams(hashParams, rng);
    const size = 100;
    const svg = createSVG(size);

    const frame = createFramePath(params, size / 2, size / 2, size);

    svg.addGradient('main', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 15) },
        ],
    });

    svg.path(frame.outer, { fill: 'url(#main)' });
    svg.path(frame.inner, { fill: '#ffffff' });

    const letterSize = size * params.letterScale * 0.6;
    svg.path(createLetterPath(letter, size / 2, size / 2, letterSize, params.letterWeight), { fill: 'url(#main)' });

    return svg.build();
}
