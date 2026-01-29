/**
 * OPTICAL ILLUSION Algorithm
 *
 * Creates logos based on optical illusions:
 * - Impossible shapes (Penrose triangle, impossible cube)
 * - Ambiguous figures (Necker cube, Rubin vase)
 * - Reversible images (figure-ground reversal)
 * - Moiré patterns
 * - Depth illusions
 *
 * Premium, unique logos that play with perception.
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
} from '../core/parametric-engine';

/**
 * Generate Penrose triangle (impossible triangle)
 */
function generatePenroseTriangle(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const thickness = size * 0.12;
    const outerR = size * 0.38;

    // Three bars that appear to connect impossibly
    const angles = [
        -Math.PI / 2,           // Top
        -Math.PI / 2 + 2 * Math.PI / 3, // Bottom left
        -Math.PI / 2 + 4 * Math.PI / 3, // Bottom right
    ];

    for (let i = 0; i < 3; i++) {
        const angle = angles[i];
        const nextAngle = angles[(i + 1) % 3];

        // Outer corner
        const outerX = cx + Math.cos(angle) * outerR;
        const outerY = cy + Math.sin(angle) * outerR;

        // Inner corner (shifted for impossible effect)
        const innerX = cx + Math.cos(angle) * (outerR - thickness * 1.5);
        const innerY = cy + Math.sin(angle) * (outerR - thickness * 1.5);

        // Next outer corner
        const nextOuterX = cx + Math.cos(nextAngle) * outerR;
        const nextOuterY = cy + Math.sin(nextAngle) * outerR;

        // Create bar with impossible connection
        const perpAngle = angle + Math.PI / 2;
        const dx = Math.cos(perpAngle) * thickness / 2;
        const dy = Math.sin(perpAngle) * thickness / 2;

        // Each bar piece
        paths.push(`
            M ${outerX - dx} ${outerY - dy}
            L ${outerX + dx} ${outerY + dy}
            L ${nextOuterX + dx} ${nextOuterY + dy}
            L ${nextOuterX - dx} ${nextOuterY - dy}
            Z
        `);

        // Add depth illusion overlap
        const midX = (outerX + nextOuterX) / 2;
        const midY = (outerY + nextOuterY) / 2;
        const overlapSize = thickness * 0.4;

        paths.push(`
            M ${midX - overlapSize} ${midY - overlapSize}
            L ${midX + overlapSize} ${midY - overlapSize}
            L ${midX + overlapSize} ${midY + overlapSize}
            L ${midX - overlapSize} ${midY + overlapSize}
            Z
        `);
    }

    return paths.join(' ');
}

/**
 * Generate impossible cube (Escher-style)
 */
function generateImpossibleCube(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const s = size * 0.35;
    const depth = s * 0.4;
    const lineWidth = size * 0.03;

    // Front face vertices
    const frontFace = [
        { x: cx - s / 2, y: cy - s / 2 },
        { x: cx + s / 2, y: cy - s / 2 },
        { x: cx + s / 2, y: cy + s / 2 },
        { x: cx - s / 2, y: cy + s / 2 },
    ];

    // Back face vertices (shifted for isometric effect)
    const backFace = frontFace.map(p => ({
        x: p.x + depth,
        y: p.y - depth,
    }));

    // Draw edges with impossible connections
    // Front face
    paths.push(`
        M ${frontFace[0].x} ${frontFace[0].y}
        L ${frontFace[1].x} ${frontFace[1].y}
        L ${frontFace[2].x} ${frontFace[2].y}
        L ${frontFace[3].x} ${frontFace[3].y}
        Z
    `);

    // Connecting lines (with impossible twists)
    // Top right goes to back, but connects impossibly
    paths.push(`
        M ${frontFace[0].x - lineWidth} ${frontFace[0].y}
        L ${backFace[0].x - lineWidth} ${backFace[0].y}
        L ${backFace[0].x + lineWidth} ${backFace[0].y}
        L ${frontFace[0].x + lineWidth} ${frontFace[0].y}
        Z
    `);

    // Back top edge (appears to go behind front)
    paths.push(`
        M ${backFace[0].x} ${backFace[0].y - lineWidth}
        L ${backFace[1].x} ${backFace[1].y - lineWidth}
        L ${backFace[1].x} ${backFace[1].y + lineWidth}
        L ${backFace[0].x} ${backFace[0].y + lineWidth}
        Z
    `);

    // Right side (impossible connection)
    paths.push(`
        M ${frontFace[1].x} ${frontFace[1].y}
        L ${backFace[1].x} ${backFace[1].y}
        L ${backFace[2].x} ${backFace[2].y}
        L ${frontFace[2].x} ${frontFace[2].y}
    `);

    return paths.join(' ');
}

/**
 * Generate Necker cube (ambiguous depth)
 */
function generateNeckerCube(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const s = size * 0.25;
    const offset = s * 0.6;
    const lineWidth = size * 0.025;

    // Two overlapping squares to create ambiguous depth
    const squares = [
        { x: cx - offset / 2, y: cy - offset / 2 },
        { x: cx + offset / 2, y: cy + offset / 2 },
    ];

    for (const sq of squares) {
        paths.push(`
            M ${sq.x - s} ${sq.y - s}
            L ${sq.x + s} ${sq.y - s}
            L ${sq.x + s} ${sq.y + s}
            L ${sq.x - s} ${sq.y + s}
            Z
            M ${sq.x - s + lineWidth * 2} ${sq.y - s + lineWidth * 2}
            L ${sq.x + s - lineWidth * 2} ${sq.y - s + lineWidth * 2}
            L ${sq.x + s - lineWidth * 2} ${sq.y + s - lineWidth * 2}
            L ${sq.x - s + lineWidth * 2} ${sq.y + s - lineWidth * 2}
            Z
        `);
    }

    // Connecting lines
    const corners = ['tl', 'tr', 'br', 'bl'];
    const offsets = [
        { dx: -s, dy: -s },
        { dx: s, dy: -s },
        { dx: s, dy: s },
        { dx: -s, dy: s },
    ];

    for (const off of offsets) {
        const x1 = squares[0].x + off.dx;
        const y1 = squares[0].y + off.dy;
        const x2 = squares[1].x + off.dx;
        const y2 = squares[1].y + off.dy;

        paths.push(`
            M ${x1 - lineWidth} ${y1}
            L ${x2 - lineWidth} ${y2}
            L ${x2 + lineWidth} ${y2}
            L ${x1 + lineWidth} ${y1}
            Z
        `);
    }

    return paths.join(' ');
}

/**
 * Generate figure-ground reversal pattern
 */
function generateFigureGround(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const r = size * 0.35;

    // Two facing profiles that also form a vase shape
    const profilePoints = [
        { x: 0, y: -0.4 },
        { x: -0.15, y: -0.35 },
        { x: -0.1, y: -0.2 },
        { x: -0.2, y: -0.1 },
        { x: -0.15, y: 0 },
        { x: -0.2, y: 0.1 },
        { x: -0.1, y: 0.25 },
        { x: -0.15, y: 0.35 },
        { x: 0, y: 0.4 },
    ];

    // Left profile (face looking right)
    let leftPath = `M ${cx} ${cy + profilePoints[0].y * r}`;
    for (const p of profilePoints) {
        leftPath += ` L ${cx + p.x * r * 2} ${cy + p.y * r}`;
    }

    // Right profile (mirror, face looking left)
    for (let i = profilePoints.length - 1; i >= 0; i--) {
        const p = profilePoints[i];
        leftPath += ` L ${cx - p.x * r * 2} ${cy + p.y * r}`;
    }
    leftPath += ' Z';

    paths.push(leftPath);

    return paths.join(' ');
}

/**
 * Generate Moiré pattern
 */
function generateMoirePattern(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const lineCount = 8 + params.elementCount % 5;
    const lineWidth = size * 0.015;
    const spacing = size * 0.06;

    // Two sets of concentric circles, slightly offset
    const offsets = [
        { x: -size * 0.05, y: 0 },
        { x: size * 0.05, y: 0 },
    ];

    for (const offset of offsets) {
        const centerX = cx + offset.x;
        const centerY = cy + offset.y;

        for (let i = 1; i <= lineCount; i++) {
            const r = i * spacing;
            if (r < size * 0.45) {
                paths.push(`
                    M ${centerX} ${centerY - r}
                    A ${r} ${r} 0 1 1 ${centerX} ${centerY + r}
                    A ${r} ${r} 0 1 1 ${centerX} ${centerY - r}
                    M ${centerX} ${centerY - r + lineWidth}
                    A ${r - lineWidth} ${r - lineWidth} 0 1 0 ${centerX} ${centerY + r - lineWidth}
                    A ${r - lineWidth} ${r - lineWidth} 0 1 0 ${centerX} ${centerY - r + lineWidth}
                `);
            }
        }
    }

    return paths.join(' ');
}

/**
 * Generate Kanizsa triangle (illusory contours)
 */
function generateKanizsaTriangle(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const r = size * 0.12; // Pac-man circle radius
    const triangleR = size * 0.35;

    // Three "pac-man" shapes at triangle vertices
    const angles = [
        -Math.PI / 2,
        -Math.PI / 2 + 2 * Math.PI / 3,
        -Math.PI / 2 + 4 * Math.PI / 3,
    ];

    for (let i = 0; i < 3; i++) {
        const angle = angles[i];
        const pacX = cx + Math.cos(angle) * triangleR;
        const pacY = cy + Math.sin(angle) * triangleR;

        // Pac-man with mouth facing center
        const mouthAngle = angle + Math.PI; // Face toward center
        const mouthWidth = Math.PI / 3; // 60 degree mouth

        const startAngle = mouthAngle + mouthWidth / 2;
        const endAngle = mouthAngle - mouthWidth / 2 + 2 * Math.PI;

        const startX = pacX + Math.cos(startAngle) * r;
        const startY = pacY + Math.sin(startAngle) * r;
        const endX = pacX + Math.cos(endAngle) * r;
        const endY = pacY + Math.sin(endAngle) * r;

        paths.push(`
            M ${pacX} ${pacY}
            L ${startX} ${startY}
            A ${r} ${r} 0 1 1 ${endX} ${endY}
            Z
        `);
    }

    return paths.join(' ');
}

/**
 * Generate Hermann grid (illusory dots)
 */
function generateHermannGrid(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const gridSize = 3;
    const squareSize = size * 0.18;
    const gap = size * 0.08;
    const totalSize = gridSize * squareSize + (gridSize - 1) * gap;
    const startX = cx - totalSize / 2;
    const startY = cy - totalSize / 2;

    // Create grid of squares
    for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
            const x = startX + col * (squareSize + gap);
            const y = startY + row * (squareSize + gap);

            paths.push(`
                M ${x} ${y}
                L ${x + squareSize} ${y}
                L ${x + squareSize} ${y + squareSize}
                L ${x} ${y + squareSize}
                Z
            `);
        }
    }

    return paths.join(' ');
}

/**
 * Main Optical Illusion generator
 */
export function generateOpticalIllusion(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, primaryColor, accentColor, variations = 5 } = params;
    const logos: GeneratedLogo[] = [];

    const illusions = [
        'penrose-triangle',
        'impossible-cube',
        'necker-cube',
        'figure-ground',
        'moire',
        'kanizsa',
        'hermann-grid',
    ];

    for (let v = 0; v < variations; v++) {
        const salt = `optical-illusion-${v}-${Date.now()}`;
        const hashParams = generateHashParamsSync(brandName, params.category || 'creative', salt);
        const derived = deriveParamsFromHash(hashParams.hashHex);
        const rng = createSeededRandom(hashParams.hashHex);

        const viewBox = '0 0 100 100';
        const cx = 50;
        const cy = 50;
        const size = 80;

        const illusionIndex = v % illusions.length;
        const illusion = illusions[illusionIndex];

        let mainPath: string;

        switch (illusion) {
            case 'penrose-triangle':
                mainPath = generatePenroseTriangle(cx, cy, size, derived);
                break;
            case 'impossible-cube':
                mainPath = generateImpossibleCube(cx, cy, size, derived);
                break;
            case 'necker-cube':
                mainPath = generateNeckerCube(cx, cy, size, derived);
                break;
            case 'figure-ground':
                mainPath = generateFigureGround(cx, cy, size, derived);
                break;
            case 'moire':
                mainPath = generateMoirePattern(cx, cy, size, derived);
                break;
            case 'kanizsa':
                mainPath = generateKanizsaTriangle(cx, cy, size, derived);
                break;
            case 'hermann-grid':
                mainPath = generateHermannGrid(cx, cy, size, derived);
                break;
            default:
                mainPath = generatePenroseTriangle(cx, cy, size, derived);
        }

        const gradientId = `opticalGrad-${v}`;
        const gradientAngle = derived.gradientAngle;
        const x1 = 50 - Math.cos(gradientAngle * Math.PI / 180) * 50;
        const y1 = 50 - Math.sin(gradientAngle * Math.PI / 180) * 50;
        const x2 = 50 + Math.cos(gradientAngle * Math.PI / 180) * 50;
        const y2 = 50 + Math.sin(gradientAngle * Math.PI / 180) * 50;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
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
            id: `optical-illusion-${hashParams.hashHex.slice(0, 12)}-${v}`,
            hash: hashParams.hashHex,
            algorithm: 'optical-illusion' as any,
            variant: v,
            svg,
            viewBox,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: salt,
                hashParams,
                geometry: {
                    usesGoldenRatio: false,
                    gridBased: illusion === 'hermann-grid',
                    bezierCurves: false,
                    symmetry: illusion === 'figure-ground' ? 'vertical' : 'none',
                    pathCount: svg.match(/<path/g)?.length || 1,
                    complexity: 80,
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

export function generateSingleOpticalIllusionPreview(
    brandName: string,
    primaryColor: string,
    accentColor?: string
): GeneratedLogo {
    const logos = generateOpticalIllusion({
        brandName,
        primaryColor,
        accentColor,
        variations: 1,
    });
    return logos[0];
}
