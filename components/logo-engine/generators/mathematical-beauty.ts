/**
 * MATHEMATICAL BEAUTY Algorithm
 *
 * Uses mathematically perfect patterns as logo foundations:
 * - Golden spiral (Fibonacci)
 * - Fibonacci sequence arrangements
 * - Penrose tiling patterns
 * - Voronoi cells
 * - Lissajous curves
 * - Superellipse (squircle) variations
 *
 * Not random - mathematically precise and beautiful.
 * This algorithm produces logos no other tool can make.
 */

import {
    LogoGenerationParams,
    GeneratedLogo,
    HashDerivedParams,
} from '../types';
import {
    generateHashParamsSync,
    deriveParamsFromHash,
    calculateQualityScore,
    createSeededRandom,
    PHI,
    PHI_INVERSE,
} from '../core/parametric-engine';

// Mathematical constants
const SQRT5 = Math.sqrt(5);
const GOLDEN_ANGLE = Math.PI * (3 - SQRT5); // ~137.5 degrees
const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];

/**
 * Generate golden spiral path
 */
function generateGoldenSpiral(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams,
    turns: number = 3
): string {
    const paths: string[] = [];
    const strokeWidth = size * 0.04;
    const points: { x: number; y: number }[] = [];

    // Generate spiral points using golden ratio
    const maxAngle = turns * 2 * Math.PI;
    const steps = turns * 40;

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const angle = t * maxAngle;
        // Golden spiral: r = a * phi^(theta / 90°)
        const r = (size * 0.05) * Math.pow(PHI, (angle * 2) / Math.PI);

        if (r < size * 0.45) {
            points.push({
                x: cx + Math.cos(angle) * r,
                y: cy + Math.sin(angle) * r,
            });
        }
    }

    if (points.length < 2) return '';

    // Draw spiral as thick path
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const prev = points[i - 1];
        const cpx = (prev.x + p.x) / 2;
        const cpy = (prev.y + p.y) / 2;
        path += ` Q ${prev.x} ${prev.y} ${cpx} ${cpy}`;
    }

    // Create stroke by offset
    const pathElement = `
        <path d="${path}" fill="none" stroke="url(#spiralGrad)" stroke-width="${strokeWidth}" stroke-linecap="round"/>
    `;

    return path;
}

/**
 * Generate Fibonacci circles arrangement
 */
function generateFibonacciCircles(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const baseRadius = size * 0.03;
    const circleCount = 5 + params.elementCount % 4;

    // Arrange circles using golden angle for perfect packing
    for (let i = 0; i < circleCount; i++) {
        const angle = i * GOLDEN_ANGLE;
        const distFromCenter = Math.sqrt(i + 1) * baseRadius * 2.5;

        if (distFromCenter < size * 0.4) {
            const x = cx + Math.cos(angle) * distFromCenter;
            const y = cy + Math.sin(angle) * distFromCenter;
            const r = baseRadius * (1 + (i % 3) * 0.3);

            paths.push(`
                M ${x} ${y - r}
                A ${r} ${r} 0 1 1 ${x} ${y + r}
                A ${r} ${r} 0 1 1 ${x} ${y - r}
            `);
        }
    }

    return paths.join(' ');
}

/**
 * Generate Penrose-inspired pattern (kites and darts)
 */
function generatePenrosePattern(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const tileSize = size * 0.15;

    // Penrose angles
    const angle36 = Math.PI / 5;
    const angle72 = 2 * Math.PI / 5;

    // Generate kites around center
    const kiteCount = 5;
    for (let i = 0; i < kiteCount; i++) {
        const baseAngle = i * angle72;

        // Kite vertices
        const p1 = { x: cx, y: cy }; // Center
        const p2 = {
            x: cx + Math.cos(baseAngle - angle36) * tileSize * PHI,
            y: cy + Math.sin(baseAngle - angle36) * tileSize * PHI,
        };
        const p3 = {
            x: cx + Math.cos(baseAngle) * tileSize * PHI * PHI,
            y: cy + Math.sin(baseAngle) * tileSize * PHI * PHI,
        };
        const p4 = {
            x: cx + Math.cos(baseAngle + angle36) * tileSize * PHI,
            y: cy + Math.sin(baseAngle + angle36) * tileSize * PHI,
        };

        paths.push(`
            M ${p1.x} ${p1.y}
            L ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            L ${p4.x} ${p4.y}
            Z
        `);
    }

    // Add darts in between
    for (let i = 0; i < kiteCount; i++) {
        const baseAngle = i * angle72 + angle36;

        const p1 = { x: cx, y: cy };
        const p2 = {
            x: cx + Math.cos(baseAngle - angle36 / 2) * tileSize,
            y: cy + Math.sin(baseAngle - angle36 / 2) * tileSize,
        };
        const p3 = {
            x: cx + Math.cos(baseAngle) * tileSize * 0.8,
            y: cy + Math.sin(baseAngle) * tileSize * 0.8,
        };
        const p4 = {
            x: cx + Math.cos(baseAngle + angle36 / 2) * tileSize,
            y: cy + Math.sin(baseAngle + angle36 / 2) * tileSize,
        };

        paths.push(`
            M ${p1.x} ${p1.y}
            L ${p2.x} ${p2.y}
            L ${p3.x} ${p3.y}
            L ${p4.x} ${p4.y}
            Z
        `);
    }

    return paths.join(' ');
}

/**
 * Generate Voronoi cell pattern
 */
function generateVoronoiCells(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];
    const cellCount = 5 + params.elementCount % 4;

    // Generate seed points using golden ratio distribution
    const seeds: { x: number; y: number }[] = [];
    for (let i = 0; i < cellCount; i++) {
        const angle = i * GOLDEN_ANGLE;
        const r = Math.sqrt(i / cellCount) * size * 0.35;
        seeds.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
        });
    }

    // Generate approximate Voronoi cells
    for (let i = 0; i < seeds.length; i++) {
        const seed = seeds[i];
        const cellPoints: { x: number; y: number; angle: number }[] = [];

        // Find cell boundaries by sampling angles
        for (let a = 0; a < 12; a++) {
            const angle = (a / 12) * 2 * Math.PI;
            let minDist = Infinity;
            let boundaryDist = size * 0.5;

            // Find nearest neighbor in this direction
            for (let j = 0; j < seeds.length; j++) {
                if (i === j) continue;

                const other = seeds[j];
                const midX = (seed.x + other.x) / 2;
                const midY = (seed.y + other.y) / 2;

                // Distance from seed to midpoint along this angle
                const dx = midX - seed.x;
                const dy = midY - seed.y;
                const dotProduct = dx * Math.cos(angle) + dy * Math.sin(angle);

                if (dotProduct > 0 && dotProduct < boundaryDist) {
                    boundaryDist = dotProduct;
                }
            }

            cellPoints.push({
                x: seed.x + Math.cos(angle) * boundaryDist * 0.9,
                y: seed.y + Math.sin(angle) * boundaryDist * 0.9,
                angle,
            });
        }

        // Sort by angle and create path
        cellPoints.sort((a, b) => a.angle - b.angle);

        if (cellPoints.length >= 3) {
            let cellPath = `M ${cellPoints[0].x} ${cellPoints[0].y}`;
            for (let p = 1; p < cellPoints.length; p++) {
                cellPath += ` L ${cellPoints[p].x} ${cellPoints[p].y}`;
            }
            cellPath += ' Z';
            paths.push(cellPath);
        }
    }

    return paths.join(' ');
}

/**
 * Generate Lissajous curve
 */
function generateLissajousCurve(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const a = 3 + params.elementCount % 3; // X frequency
    const b = 2 + params.layerCount % 3;   // Y frequency
    const delta = params.rotationOffset;   // Phase shift
    const amplitude = size * 0.35;
    const strokeWidth = size * 0.05;

    const points: { x: number; y: number }[] = [];
    const steps = 100;

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        points.push({
            x: cx + Math.sin(a * t + delta) * amplitude,
            y: cy + Math.sin(b * t) * amplitude,
        });
    }

    // Create smooth curve
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const prev = points[i - 1];
        const cpx = (prev.x + p.x) / 2;
        const cpy = (prev.y + p.y) / 2;
        path += ` Q ${prev.x} ${prev.y} ${cpx} ${cpy}`;
    }
    path += ' Z';

    return path;
}

/**
 * Generate superellipse (squircle)
 */
function generateSuperellipse(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    // n = 2 is circle, n = 4 is squircle, higher = more square
    const n = 2.5 + params.cornerRadius * 0.03;
    const a = size * 0.35; // X radius
    const b = size * 0.35; // Y radius
    const strokeWidth = size * 0.08;

    const points: { x: number; y: number }[] = [];
    const steps = 64;

    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        const cosT = Math.cos(t);
        const sinT = Math.sin(t);

        // Superellipse formula: |x/a|^n + |y/b|^n = 1
        const x = Math.sign(cosT) * a * Math.pow(Math.abs(cosT), 2 / n);
        const y = Math.sign(sinT) * b * Math.pow(Math.abs(sinT), 2 / n);

        points.push({ x: cx + x, y: cy + y });
    }

    // Outer path
    let outerPath = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        outerPath += ` L ${points[i].x} ${points[i].y}`;
    }
    outerPath += ' Z';

    // Inner cutout
    const innerScale = 1 - strokeWidth / a;
    let innerPath = `M ${cx + points[0].x * innerScale - cx * innerScale} ${cy + points[0].y * innerScale - cy * innerScale}`;
    for (let i = points.length - 1; i >= 0; i--) {
        const x = cx + (points[i].x - cx) * innerScale;
        const y = cy + (points[i].y - cy) * innerScale;
        innerPath += ` L ${x} ${y}`;
    }
    innerPath += ' Z';

    return outerPath + ' ' + innerPath;
}

/**
 * Generate golden rectangle composition
 */
function generateGoldenRectangles(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const strokeWidth = size * 0.02;

    // Start with a golden rectangle
    let width = size * 0.7;
    let height = width / PHI;
    let x = cx - width / 2;
    let y = cy - height / 2;

    // Recursively subdivide using golden ratio
    const subdivisions = 5;
    for (let i = 0; i < subdivisions; i++) {
        // Draw current rectangle outline
        paths.push(`
            M ${x} ${y}
            L ${x + width} ${y}
            L ${x + width} ${y + height}
            L ${x} ${y + height}
            Z
            M ${x + strokeWidth} ${y + strokeWidth}
            L ${x + width - strokeWidth} ${y + strokeWidth}
            L ${x + width - strokeWidth} ${y + height - strokeWidth}
            L ${x + strokeWidth} ${y + height - strokeWidth}
            Z
        `);

        // Create square and new golden rectangle
        if (i % 2 === 0) {
            // Cut horizontally
            const squareSize = height;
            x = x + squareSize;
            width = width - squareSize;
            // Swap for next iteration
            const temp = width;
            width = height;
            height = temp;
        } else {
            // Cut vertically
            const squareSize = width;
            y = y + squareSize;
            height = height - squareSize;
            // Swap for next iteration
            const temp = height;
            height = width;
            width = temp;
        }
    }

    return paths.join(' ');
}

/**
 * Generate Fibonacci spiral with golden rectangles
 */
function generateFibonacciSpiral(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const scale = size * 0.006;

    // Draw fibonacci squares
    let x = cx;
    let y = cy;

    const squares: { x: number; y: number; size: number; dir: number }[] = [];

    for (let i = 0; i < 7; i++) {
        const fibSize = FIBONACCI[i] * scale;
        const dir = i % 4; // 0: right, 1: down, 2: left, 3: up

        let sx = x, sy = y;

        switch (dir) {
            case 0: sx = x; sy = y - fibSize; break;
            case 1: sx = x; sy = y; break;
            case 2: sx = x - fibSize; sy = y; break;
            case 3: sx = x - fibSize; sy = y - fibSize; break;
        }

        squares.push({ x: sx, y: sy, size: fibSize, dir });

        // Update position for next square
        switch (dir) {
            case 0: x += fibSize; break;
            case 1: y += fibSize; break;
            case 2: x -= fibSize; break;
            case 3: y -= fibSize; break;
        }
    }

    // Draw squares
    for (const sq of squares) {
        paths.push(`
            M ${sq.x} ${sq.y}
            L ${sq.x + sq.size} ${sq.y}
            L ${sq.x + sq.size} ${sq.y + sq.size}
            L ${sq.x} ${sq.y + sq.size}
            Z
        `);
    }

    // Draw spiral through squares
    let spiralPath = `M ${squares[0].x + squares[0].size} ${squares[0].y + squares[0].size}`;
    for (let i = 0; i < squares.length; i++) {
        const sq = squares[i];
        const r = sq.size;

        // Quarter circle in each square
        switch (sq.dir) {
            case 0:
                spiralPath += ` A ${r} ${r} 0 0 0 ${sq.x} ${sq.y}`;
                break;
            case 1:
                spiralPath += ` A ${r} ${r} 0 0 0 ${sq.x + r} ${sq.y}`;
                break;
            case 2:
                spiralPath += ` A ${r} ${r} 0 0 0 ${sq.x + r} ${sq.y + r}`;
                break;
            case 3:
                spiralPath += ` A ${r} ${r} 0 0 0 ${sq.x} ${sq.y + r}`;
                break;
        }
    }

    paths.push(spiralPath);

    return paths.join(' ');
}

/**
 * Main Mathematical Beauty generator
 */
export function generateMathematicalBeauty(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, primaryColor, accentColor, variations = 5 } = params;
    const logos: GeneratedLogo[] = [];

    const mathPatterns = [
        'golden-spiral',
        'fibonacci-circles',
        'penrose',
        'voronoi',
        'lissajous',
        'superellipse',
        'golden-rectangles',
        'fibonacci-spiral',
    ];

    for (let v = 0; v < variations; v++) {
        const salt = `math-beauty-${v}-${Date.now()}`;
        const hashParams = generateHashParamsSync(brandName, params.category || 'technology', salt);
        const derived = deriveParamsFromHash(hashParams.hashHex);
        const rng = createSeededRandom(hashParams.hashHex);

        const viewBox = '0 0 100 100';
        const cx = 50;
        const cy = 50;
        const size = 80;

        // Select pattern based on variant
        const patternIndex = v % mathPatterns.length;
        const pattern = mathPatterns[patternIndex];

        let mainPath: string;
        let isStrokeBased = false;

        switch (pattern) {
            case 'golden-spiral':
                mainPath = generateGoldenSpiral(cx, cy, size, derived, 3);
                isStrokeBased = true;
                break;
            case 'fibonacci-circles':
                mainPath = generateFibonacciCircles(cx, cy, size, derived);
                break;
            case 'penrose':
                mainPath = generatePenrosePattern(cx, cy, size, derived);
                break;
            case 'voronoi':
                mainPath = generateVoronoiCells(cx, cy, size, derived, rng);
                break;
            case 'lissajous':
                mainPath = generateLissajousCurve(cx, cy, size, derived);
                isStrokeBased = true;
                break;
            case 'superellipse':
                mainPath = generateSuperellipse(cx, cy, size, derived);
                break;
            case 'golden-rectangles':
                mainPath = generateGoldenRectangles(cx, cy, size, derived);
                break;
            case 'fibonacci-spiral':
                mainPath = generateFibonacciSpiral(cx, cy, size, derived);
                break;
            default:
                mainPath = generateGoldenSpiral(cx, cy, size, derived, 3);
        }

        // Build gradient
        const gradientId = `mathBeautyGrad-${v}`;
        const gradientAngle = derived.gradientAngle;
        const x1 = 50 - Math.cos(gradientAngle * Math.PI / 180) * 50;
        const y1 = 50 - Math.sin(gradientAngle * Math.PI / 180) * 50;
        const x2 = 50 + Math.cos(gradientAngle * Math.PI / 180) * 50;
        const y2 = 50 + Math.sin(gradientAngle * Math.PI / 180) * 50;

        const svg = isStrokeBased
            ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
                <defs>
                    <linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
                        <stop offset="0%" stop-color="${primaryColor}"/>
                        <stop offset="100%" stop-color="${accentColor || primaryColor}"/>
                    </linearGradient>
                </defs>
                <path d="${mainPath}" fill="none" stroke="url(#${gradientId})" stroke-width="${size * 0.04}" stroke-linecap="round"/>
            </svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
                <defs>
                    <linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
                        <stop offset="0%" stop-color="${primaryColor}"/>
                        <stop offset="100%" stop-color="${accentColor || primaryColor}"/>
                    </linearGradient>
                </defs>
                <path d="${mainPath}" fill="url(#${gradientId})" fill-rule="evenodd"/>
            </svg>`;

        const quality = calculateQualityScore(svg, derived);

        logos.push({
            id: `math-beauty-${hashParams.hashHex.slice(0, 12)}-${v}`,
            hash: hashParams.hashHex,
            algorithm: 'mathematical-beauty' as any,
            variant: v,
            svg,
            viewBox,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: salt,
                hashParams,
                geometry: {
                    usesGoldenRatio: true,
                    gridBased: pattern === 'golden-rectangles',
                    bezierCurves: ['golden-spiral', 'lissajous', 'fibonacci-circles'].includes(pattern),
                    symmetry: pattern === 'penrose' ? 'rotational' : 'none',
                    pathCount: svg.match(/<path/g)?.length || 1,
                    complexity: 85,
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: [primaryColor, accentColor || primaryColor],
                },
            },
            params: derived as any,
            quality,
        });
    }

    return logos.filter(l => l.quality.score >= 55).slice(0, 5);
}

export function generateSingleMathematicalBeautyPreview(
    brandName: string,
    primaryColor: string,
    accentColor?: string
): GeneratedLogo {
    const logos = generateMathematicalBeauty({
        brandName,
        primaryColor,
        accentColor,
        variations: 1,
    });
    return logos[0];
}
