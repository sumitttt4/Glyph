/**
 * Advanced Geometry Utilities for Professional Logo Generation
 *
 * Golden spirals, bezier curve systems, wave functions, and
 * sophisticated mathematical foundations for Stripe/Linear/Notion quality logos.
 */

import { Point, BezierCurve } from '../types';
import { PHI, PHI_INVERSE, createSeededRandom } from './geometry';

// ============================================
// GOLDEN RATIO ADVANCED SYSTEMS
// ============================================

/**
 * Generate points along a golden spiral
 */
export function goldenSpiral(
    center: Point,
    startRadius: number,
    turns: number,
    pointCount: number = 100
): Point[] {
    const points: Point[] = [];
    const growthFactor = PHI;

    for (let i = 0; i < pointCount; i++) {
        const t = (i / pointCount) * turns * Math.PI * 2;
        const radius = startRadius * Math.pow(growthFactor, t / (Math.PI * 2));

        points.push({
            x: center.x + radius * Math.cos(t),
            y: center.y + radius * Math.sin(t),
        });
    }

    return points;
}

/**
 * Create golden ratio-based control points for smooth curves
 */
export function goldenControlPoints(
    start: Point,
    end: Point,
    curvature: number = 1
): { control1: Point; control2: Point } {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Use golden ratio for control point distances
    const controlDist = dist * PHI_INVERSE * curvature;

    // Perpendicular offset
    const perpX = -dy / dist;
    const perpY = dx / dist;

    return {
        control1: {
            x: start.x + dx * PHI_INVERSE + perpX * controlDist * 0.5,
            y: start.y + dy * PHI_INVERSE + perpY * controlDist * 0.5,
        },
        control2: {
            x: end.x - dx * PHI_INVERSE + perpX * controlDist * 0.5,
            y: end.y - dy * PHI_INVERSE + perpY * controlDist * 0.5,
        },
    };
}

/**
 * Generate a golden rectangle grid for composition
 */
export function goldenRectangleGrid(
    width: number,
    height: number,
    divisions: number = 5
): { lines: Array<{ start: Point; end: Point }>; points: Point[] } {
    const lines: Array<{ start: Point; end: Point }> = [];
    const points: Point[] = [];

    // Vertical golden divisions
    let x = 0;
    for (let i = 0; i < divisions; i++) {
        const nextX = x + (width - x) * PHI_INVERSE;
        lines.push(
            { start: { x: nextX, y: 0 }, end: { x: nextX, y: height } }
        );
        x = nextX;
    }

    // Horizontal golden divisions
    let y = 0;
    for (let i = 0; i < divisions; i++) {
        const nextY = y + (height - y) * PHI_INVERSE;
        lines.push(
            { start: { x: 0, y: nextY }, end: { x: width, y: nextY } }
        );
        y = nextY;
    }

    // Generate intersection points
    const xPositions = [0];
    x = 0;
    for (let i = 0; i < divisions; i++) {
        x = x + (width - x) * PHI_INVERSE;
        xPositions.push(x);
    }
    xPositions.push(width);

    const yPositions = [0];
    y = 0;
    for (let i = 0; i < divisions; i++) {
        y = y + (height - y) * PHI_INVERSE;
        yPositions.push(y);
    }
    yPositions.push(height);

    for (const px of xPositions) {
        for (const py of yPositions) {
            points.push({ x: px, y: py });
        }
    }

    return { lines, points };
}

// ============================================
// ADVANCED BEZIER CURVE SYSTEMS
// ============================================

/**
 * Create a smooth flowing curve through multiple points (Catmull-Rom to Bezier)
 */
export function smoothCurveThroughPoints(
    points: Point[],
    tension: number = 0.5,
    closed: boolean = false
): string {
    if (points.length < 2) return '';
    if (points.length === 2) {
        return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    const getControlPoints = (p0: Point, p1: Point, p2: Point, p3: Point) => {
        const d1 = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
        const d2 = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
        const d3 = Math.sqrt(Math.pow(p3.x - p2.x, 2) + Math.pow(p3.y - p2.y, 2));

        const d1_a = Math.pow(d1, tension);
        const d1_2a = Math.pow(d1, 2 * tension);
        const d2_a = Math.pow(d2, tension);
        const d2_2a = Math.pow(d2, 2 * tension);
        const d3_a = Math.pow(d3, tension);
        const d3_2a = Math.pow(d3, 2 * tension);

        return {
            cp1: {
                x: (d1_2a * p2.x - d2_2a * p0.x + (2 * d1_2a + 3 * d1_a * d2_a + d2_2a) * p1.x) /
                   (3 * d1_a * (d1_a + d2_a)),
                y: (d1_2a * p2.y - d2_2a * p0.y + (2 * d1_2a + 3 * d1_a * d2_a + d2_2a) * p1.y) /
                   (3 * d1_a * (d1_a + d2_a)),
            },
            cp2: {
                x: (d3_2a * p1.x - d2_2a * p3.x + (2 * d3_2a + 3 * d3_a * d2_a + d2_2a) * p2.x) /
                   (3 * d3_a * (d3_a + d2_a)),
                y: (d3_2a * p1.y - d2_2a * p3.y + (2 * d3_2a + 3 * d3_a * d2_a + d2_2a) * p2.y) /
                   (3 * d3_a * (d3_a + d2_a)),
            },
        };
    };

    // Extend points array for closed curves
    const pts = closed
        ? [points[points.length - 1], ...points, points[0], points[1]]
        : [points[0], ...points, points[points.length - 1]];

    for (let i = 1; i < pts.length - 2; i++) {
        const { cp1, cp2 } = getControlPoints(pts[i - 1], pts[i], pts[i + 1], pts[i + 2]);

        if (isFinite(cp1.x) && isFinite(cp1.y) && isFinite(cp2.x) && isFinite(cp2.y)) {
            path += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${pts[i + 1].x} ${pts[i + 1].y}`;
        } else {
            // Fallback to line
            path += ` L ${pts[i + 1].x} ${pts[i + 1].y}`;
        }
    }

    if (closed) {
        path += ' Z';
    }

    return path;
}

/**
 * Create a swoosh/flow curve (Nike/Notion style)
 */
export function createSwooshCurve(
    startPoint: Point,
    endPoint: Point,
    amplitude: number,
    direction: 'up' | 'down' = 'up'
): string {
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const midX = startPoint.x + dx * 0.5;
    const midY = startPoint.y + dy * 0.5;

    const sign = direction === 'up' ? -1 : 1;

    // Control points for smooth S-curve
    const cp1 = {
        x: startPoint.x + dx * 0.25,
        y: startPoint.y + sign * amplitude * 0.3,
    };

    const cp2 = {
        x: startPoint.x + dx * 0.4,
        y: startPoint.y + sign * amplitude,
    };

    const mid = {
        x: midX,
        y: midY + sign * amplitude * 0.8,
    };

    const cp3 = {
        x: startPoint.x + dx * 0.6,
        y: endPoint.y + sign * amplitude * 0.6,
    };

    const cp4 = {
        x: startPoint.x + dx * 0.85,
        y: endPoint.y + sign * amplitude * 0.1,
    };

    return `M ${startPoint.x} ${startPoint.y} ` +
           `C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${mid.x} ${mid.y} ` +
           `C ${cp3.x} ${cp3.y}, ${cp4.x} ${cp4.y}, ${endPoint.x} ${endPoint.y}`;
}

/**
 * Create an organic blob shape using bezier curves
 */
export function createOrganicBlob(
    center: Point,
    radius: number,
    variance: number,
    seed: string,
    points: number = 8
): string {
    const rng = createSeededRandom(seed);
    const blobPoints: Point[] = [];

    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r = radius * (1 + (rng() - 0.5) * variance);

        blobPoints.push({
            x: center.x + Math.cos(angle) * r,
            y: center.y + Math.sin(angle) * r,
        });
    }

    return smoothCurveThroughPoints(blobPoints, 0.3, true);
}

/**
 * Create infinity/möbius style looping curve
 */
export function createInfinityCurve(
    center: Point,
    width: number,
    height: number
): string {
    const hw = width / 2;
    const hh = height / 2;

    return `M ${center.x} ${center.y} ` +
           `C ${center.x + hw * 0.8} ${center.y - hh}, ${center.x + hw} ${center.y - hh * 0.5}, ${center.x + hw} ${center.y} ` +
           `C ${center.x + hw} ${center.y + hh * 0.5}, ${center.x + hw * 0.8} ${center.y + hh}, ${center.x} ${center.y} ` +
           `C ${center.x - hw * 0.8} ${center.y - hh}, ${center.x - hw} ${center.y - hh * 0.5}, ${center.x - hw} ${center.y} ` +
           `C ${center.x - hw} ${center.y + hh * 0.5}, ${center.x - hw * 0.8} ${center.y + hh}, ${center.x} ${center.y} Z`;
}

// ============================================
// WAVE & OSCILLATION FUNCTIONS
// ============================================

/**
 * Generate sine wave path
 */
export function sineWavePath(
    startX: number,
    startY: number,
    width: number,
    amplitude: number,
    frequency: number,
    phase: number = 0,
    segments: number = 50
): string {
    const points: Point[] = [];

    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = startX + t * width;
        const y = startY + Math.sin(t * Math.PI * 2 * frequency + phase) * amplitude;
        points.push({ x, y });
    }

    return smoothCurveThroughPoints(points, 0.3);
}

/**
 * Generate multiple stacked sine waves
 */
export function stackedSineWaves(
    centerY: number,
    width: number,
    count: number,
    baseAmplitude: number,
    frequency: number,
    spacing: number
): string[] {
    const paths: string[] = [];
    const startX = (100 - width) / 2;
    const startY = centerY - (count - 1) * spacing / 2;

    for (let i = 0; i < count; i++) {
        const y = startY + i * spacing;
        const amplitude = baseAmplitude * (1 - Math.abs(i - count / 2) / count * 0.3);
        const phase = i * 0.3;

        paths.push(sineWavePath(startX, y, width, amplitude, frequency, phase));
    }

    return paths;
}

/**
 * Generate audio waveform style path
 */
export function audioWaveformPath(
    startX: number,
    centerY: number,
    width: number,
    bars: number,
    seed: string
): Array<{ x: number; height: number }> {
    const rng = createSeededRandom(seed);
    const barWidth = width / bars;
    const waveData: Array<{ x: number; height: number }> = [];

    for (let i = 0; i < bars; i++) {
        // Create smooth envelope with random variation
        const envelope = Math.sin(i / bars * Math.PI);
        const randomness = 0.3 + rng() * 0.7;
        const height = envelope * randomness * 30;

        waveData.push({
            x: startX + i * barWidth,
            height,
        });
    }

    return waveData;
}

// ============================================
// GEOMETRIC TRANSFORMATION
// ============================================

/**
 * Apply perspective transform to a point
 */
export function perspectiveTransform(
    point: Point,
    center: Point,
    vanishingPoint: Point,
    depth: number
): Point {
    const dx = point.x - center.x;
    const dy = point.y - center.y;

    const scale = 1 / (1 + depth * (vanishingPoint.y - point.y) / 100);

    return {
        x: center.x + dx * scale + (vanishingPoint.x - center.x) * (1 - scale),
        y: center.y + dy * scale,
    };
}

/**
 * Create ribbon/tape 3D effect path
 */
export function createRibbonPath(
    points: Point[],
    thickness: number,
    twist: number = 0
): { top: string; bottom: string; connects: string[] } {
    const topPoints: Point[] = [];
    const bottomPoints: Point[] = [];

    for (let i = 0; i < points.length; i++) {
        const t = i / (points.length - 1);
        const twistAngle = twist * Math.sin(t * Math.PI);
        const offset = thickness / 2;

        // Get tangent direction
        let tangent: Point;
        if (i === 0) {
            tangent = { x: points[1].x - points[0].x, y: points[1].y - points[0].y };
        } else if (i === points.length - 1) {
            tangent = { x: points[i].x - points[i - 1].x, y: points[i].y - points[i - 1].y };
        } else {
            tangent = { x: points[i + 1].x - points[i - 1].x, y: points[i + 1].y - points[i - 1].y };
        }

        const len = Math.sqrt(tangent.x * tangent.x + tangent.y * tangent.y);
        const normal = { x: -tangent.y / len, y: tangent.x / len };

        const topOffset = offset * Math.cos(twistAngle);
        const bottomOffset = offset * Math.cos(twistAngle + Math.PI);

        topPoints.push({
            x: points[i].x + normal.x * topOffset,
            y: points[i].y + normal.y * topOffset,
        });

        bottomPoints.push({
            x: points[i].x + normal.x * bottomOffset,
            y: points[i].y + normal.y * bottomOffset,
        });
    }

    return {
        top: smoothCurveThroughPoints(topPoints, 0.3),
        bottom: smoothCurveThroughPoints(bottomPoints.reverse(), 0.3),
        connects: [],
    };
}

// ============================================
// SHAPE INTERSECTION & BOOLEAN OPS
// ============================================

/**
 * Generate overlapping circles data
 */
export function overlappingCircles(
    center: Point,
    count: number,
    radius: number,
    spread: number,
    seed: string
): Array<{ cx: number; cy: number; r: number; angle: number }> {
    const rng = createSeededRandom(seed);
    const circles: Array<{ cx: number; cy: number; r: number; angle: number }> = [];

    const angleStep = (Math.PI * 2) / count;

    for (let i = 0; i < count; i++) {
        const angle = angleStep * i - Math.PI / 2;
        const distance = spread * (0.8 + rng() * 0.4);
        const r = radius * (0.85 + rng() * 0.3);

        circles.push({
            cx: center.x + Math.cos(angle) * distance,
            cy: center.y + Math.sin(angle) * distance,
            r,
            angle: angle * (180 / Math.PI),
        });
    }

    return circles;
}

/**
 * Generate Venn diagram intersection paths (2-3 circles)
 */
export function vennIntersectionPath(
    circle1: { cx: number; cy: number; r: number },
    circle2: { cx: number; cy: number; r: number }
): string {
    const d = Math.sqrt(
        Math.pow(circle2.cx - circle1.cx, 2) +
        Math.pow(circle2.cy - circle1.cy, 2)
    );

    // Check if circles intersect
    if (d >= circle1.r + circle2.r || d <= Math.abs(circle1.r - circle2.r)) {
        return '';
    }

    // Calculate intersection points
    const a = (circle1.r * circle1.r - circle2.r * circle2.r + d * d) / (2 * d);
    const h = Math.sqrt(circle1.r * circle1.r - a * a);

    const px = circle1.cx + a * (circle2.cx - circle1.cx) / d;
    const py = circle1.cy + a * (circle2.cy - circle1.cy) / d;

    const intersection1 = {
        x: px + h * (circle2.cy - circle1.cy) / d,
        y: py - h * (circle2.cx - circle1.cx) / d,
    };

    const intersection2 = {
        x: px - h * (circle2.cy - circle1.cy) / d,
        y: py + h * (circle2.cx - circle1.cx) / d,
    };

    // Create lens-shaped intersection path
    return `M ${intersection1.x} ${intersection1.y} ` +
           `A ${circle1.r} ${circle1.r} 0 0 1 ${intersection2.x} ${intersection2.y} ` +
           `A ${circle2.r} ${circle2.r} 0 0 1 ${intersection1.x} ${intersection1.y} Z`;
}

// ============================================
// NODE & NETWORK PATTERNS
// ============================================

/**
 * Generate network node positions
 */
export function networkNodes(
    center: Point,
    nodeCount: number,
    radius: number,
    seed: string,
    clustering: number = 0.5
): Point[] {
    const rng = createSeededRandom(seed);
    const nodes: Point[] = [center]; // Central node

    // Generate clustered nodes
    for (let i = 1; i < nodeCount; i++) {
        const angle = rng() * Math.PI * 2;
        const distance = radius * (0.3 + rng() * 0.7 * clustering);

        nodes.push({
            x: center.x + Math.cos(angle) * distance,
            y: center.y + Math.sin(angle) * distance,
        });
    }

    return nodes;
}

/**
 * Generate connection lines between nodes
 */
export function networkConnections(
    nodes: Point[],
    connectionDensity: number = 0.5,
    seed: string
): Array<{ from: Point; to: Point; strength: number }> {
    const rng = createSeededRandom(seed);
    const connections: Array<{ from: Point; to: Point; strength: number }> = [];

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (rng() < connectionDensity) {
                const dist = Math.sqrt(
                    Math.pow(nodes[j].x - nodes[i].x, 2) +
                    Math.pow(nodes[j].y - nodes[i].y, 2)
                );

                connections.push({
                    from: nodes[i],
                    to: nodes[j],
                    strength: 1 - (dist / 100), // Closer = stronger
                });
            }
        }
    }

    return connections;
}

