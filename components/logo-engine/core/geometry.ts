/**
 * Geometry Utilities for Logo Generation
 * 
 * Golden ratio calculations, grid systems, and bezier curve generation
 */

import { Point, BezierCurve, GridConfig, GoldenRatioGrid, Rectangle } from '../types';

// ============================================
// CONSTANTS
// ============================================

/** The golden ratio (φ) */
export const PHI = 1.618033988749895;

/** Inverse golden ratio (1/φ) */
export const PHI_INVERSE = 0.618033988749895;

/** Common angles in radians */
export const ANGLES = {
    DEG_30: Math.PI / 6,
    DEG_45: Math.PI / 4,
    DEG_60: Math.PI / 3,
    DEG_90: Math.PI / 2,
    DEG_120: (2 * Math.PI) / 3,
    DEG_180: Math.PI,
    DEG_270: (3 * Math.PI) / 2,
    DEG_360: 2 * Math.PI,
};

// ============================================
// SEEDED RANDOM
// ============================================

/**
 * Create a seeded random number generator
 */
export function createSeededRandom(seed: string): () => number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    let state = hash;

    return () => {
        state = (state * 1103515245 + 12345) & 0x7fffffff;
        return state / 0x7fffffff;
    };
}

/**
 * Get a random value in range using seeded RNG
 */
export function randomInRange(rng: () => number, min: number, max: number): number {
    return min + rng() * (max - min);
}

/**
 * Pick random item from array
 */
export function randomPick<T>(rng: () => number, arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
}

// ============================================
// GOLDEN RATIO GRID
// ============================================

/**
 * Create a golden ratio-based grid system
 */
export function createGoldenRatioGrid(size: number, margin: number = 10): GoldenRatioGrid {
    const usableSize = size - margin * 2;
    const major = usableSize * PHI_INVERSE;
    const minor = usableSize - major;

    return {
        size,
        columns: 5,
        rows: 5,
        margin,
        gap: 0,
        phi: PHI,
        major,
        minor,
    };
}

/**
 * Get golden ratio divisions of a length
 */
export function goldenDivisions(length: number, depth: number = 3): number[] {
    const divisions: number[] = [0];
    let current = 0;
    let segment = length;

    for (let i = 0; i < depth; i++) {
        const major = segment * PHI_INVERSE;
        current += major;
        divisions.push(current);
        segment = segment - major;
    }

    divisions.push(length);
    return divisions;
}

/**
 * Get key points on a golden ratio grid
 */
export function getGoldenGridPoints(size: number, margin: number = 10): Point[] {
    const usable = size - margin * 2;
    const divisions = goldenDivisions(usable, 3);

    const points: Point[] = [];

    divisions.forEach(x => {
        divisions.forEach(y => {
            points.push({ x: margin + x, y: margin + y });
        });
    });

    return points;
}

// ============================================
// BEZIER CURVE GENERATION
// ============================================

/**
 * Create a smooth bezier curve between two points
 */
export function createSmoothCurve(
    start: Point,
    end: Point,
    curvature: number = 0.3,
    direction: 'horizontal' | 'vertical' = 'horizontal'
): BezierCurve {
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    let control1: Point;
    let control2: Point;

    if (direction === 'horizontal') {
        control1 = { x: start.x + dx * curvature, y: start.y };
        control2 = { x: end.x - dx * curvature, y: end.y };
    } else {
        control1 = { x: start.x, y: start.y + dy * curvature };
        control2 = { x: end.x, y: end.y - dy * curvature };
    }

    return { start, control1, control2, end };
}

/**
 * Create an organic curve with tension control
 */
export function createOrganicCurve(
    start: Point,
    end: Point,
    rng: () => number,
    tension: number = 0.5
): BezierCurve {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const angle1 = Math.atan2(dy, dx) + (rng() - 0.5) * Math.PI * tension;
    const angle2 = Math.atan2(-dy, -dx) + (rng() - 0.5) * Math.PI * tension;

    const len = dist * 0.4;

    return {
        start,
        control1: {
            x: start.x + Math.cos(angle1) * len,
            y: start.y + Math.sin(angle1) * len,
        },
        control2: {
            x: end.x + Math.cos(angle2) * len,
            y: end.y + Math.sin(angle2) * len,
        },
        end,
    };
}

/**
 * Convert bezier curve to SVG path command
 */
export function bezierToPath(curve: BezierCurve): string {
    return `M ${curve.start.x} ${curve.start.y} C ${curve.control1.x} ${curve.control1.y}, ${curve.control2.x} ${curve.control2.y}, ${curve.end.x} ${curve.end.y}`;
}

// ============================================
// SHAPE GENERATION
// ============================================

/**
 * Create a rounded rectangle path
 */
export function roundedRectPath(rect: Rectangle): string {
    const { x, y, width, height, rx = 0 } = rect;
    const r = Math.min(rx, width / 2, height / 2);

    if (r === 0) {
        return `M ${x} ${y} h ${width} v ${height} h ${-width} Z`;
    }

    return `
    M ${x + r} ${y}
    h ${width - 2 * r}
    a ${r} ${r} 0 0 1 ${r} ${r}
    v ${height - 2 * r}
    a ${r} ${r} 0 0 1 ${-r} ${r}
    h ${-(width - 2 * r)}
    a ${r} ${r} 0 0 1 ${-r} ${-r}
    v ${-(height - 2 * r)}
    a ${r} ${r} 0 0 1 ${r} ${-r}
    Z
  `.replace(/\s+/g, ' ').trim();
}

/**
 * Create a squircle (superellipse) path
 */
export function squirclePath(
    cx: number,
    cy: number,
    size: number,
    n: number = 4 // Higher = more square
): string {
    const points: Point[] = [];
    const steps = 64;
    const r = size / 2;

    for (let i = 0; i <= steps; i++) {
        const angle = (i / steps) * 2 * Math.PI;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // Superellipse formula
        const x = cx + r * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n);
        const y = cy + r * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n);

        points.push({ x, y });
    }

    return pointsToPath(points);
}

/**
 * Convert array of points to SVG path
 */
export function pointsToPath(points: Point[], closed: boolean = true): string {
    if (points.length < 2) return '';

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
    }

    if (closed) path += ' Z';

    return path;
}

/**
 * Create a polygon with n sides
 */
export function regularPolygonPath(
    cx: number,
    cy: number,
    radius: number,
    sides: number,
    rotation: number = -90 // Start from top
): string {
    const points: Point[] = [];
    const angleStep = (2 * Math.PI) / sides;
    const startAngle = (rotation * Math.PI) / 180;

    for (let i = 0; i < sides; i++) {
        const angle = startAngle + i * angleStep;
        points.push({
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
        });
    }

    return pointsToPath(points);
}

/**
 * Create a star shape
 */
export function starPath(
    cx: number,
    cy: number,
    outerRadius: number,
    innerRadius: number,
    points: number = 5,
    rotation: number = -90
): string {
    const pathPoints: Point[] = [];
    const angleStep = Math.PI / points;
    const startAngle = (rotation * Math.PI) / 180;

    for (let i = 0; i < points * 2; i++) {
        const angle = startAngle + i * angleStep;
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        pathPoints.push({
            x: cx + radius * Math.cos(angle),
            y: cy + radius * Math.sin(angle),
        });
    }

    return pointsToPath(pathPoints);
}

// ============================================
// TRANSFORM UTILITIES
// ============================================

/**
 * Rotate a point around a center
 */
export function rotatePoint(point: Point, center: Point, angleDeg: number): Point {
    const angleRad = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);

    const dx = point.x - center.x;
    const dy = point.y - center.y;

    return {
        x: center.x + dx * cos - dy * sin,
        y: center.y + dx * sin + dy * cos,
    };
}

/**
 * Scale a point from a center
 */
export function scalePoint(point: Point, center: Point, scale: number): Point {
    return {
        x: center.x + (point.x - center.x) * scale,
        y: center.y + (point.y - center.y) * scale,
    };
}

/**
 * Mirror a point across an axis
 */
export function mirrorPoint(
    point: Point,
    axis: 'horizontal' | 'vertical',
    centerLine: number
): Point {
    if (axis === 'horizontal') {
        return { x: point.x, y: 2 * centerLine - point.y };
    }
    return { x: 2 * centerLine - point.x, y: point.y };
}

/**
 * Calculate the center of a set of points
 */
export function centerOfPoints(points: Point[]): Point {
    const sum = points.reduce(
        (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
        { x: 0, y: 0 }
    );
    return {
        x: sum.x / points.length,
        y: sum.y / points.length,
    };
}

/**
 * Calculate distance between two points
 */
export function distance(p1: Point, p2: Point): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Interpolate between two points
 */
export function lerp(p1: Point, p2: Point, t: number): Point {
    return {
        x: p1.x + (p2.x - p1.x) * t,
        y: p1.y + (p2.y - p1.y) * t,
    };
}
