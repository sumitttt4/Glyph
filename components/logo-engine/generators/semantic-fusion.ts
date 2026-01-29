/**
 * SEMANTIC FUSION Algorithm
 *
 * Combines brand meaning with letter shape to create fused logos.
 * - "Wave" + W = W made of wave curves
 * - "Bolt" + B = B with lightning angle
 * - "Loop" + L = L that loops back
 * - "Flow" + F = F with flowing curves
 * - "Peak" + P = P with mountain peak
 *
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
} from '../core/parametric-engine';

// Semantic meaning mappings
interface SemanticMeaning {
    keywords: string[];
    visualConcept: 'wave' | 'bolt' | 'loop' | 'flow' | 'peak' | 'spin' | 'rise' | 'drop' | 'burst' | 'grow' | 'connect' | 'shield' | 'spark' | 'pulse' | 'orbit' | 'stack' | 'merge' | 'split' | 'twist' | 'fold';
    curveType: 'sine' | 'angular' | 'circular' | 'spiral' | 'zigzag' | 'smooth';
    energy: number; // 0-1
}

const SEMANTIC_MAP: SemanticMeaning[] = [
    { keywords: ['wave', 'ocean', 'sea', 'water', 'aqua', 'flow', 'stream', 'river', 'tide'], visualConcept: 'wave', curveType: 'sine', energy: 0.6 },
    { keywords: ['bolt', 'lightning', 'electric', 'power', 'energy', 'shock', 'zap', 'volt', 'amp'], visualConcept: 'bolt', curveType: 'zigzag', energy: 0.9 },
    { keywords: ['loop', 'cycle', 'infinite', 'eternal', 'forever', 'repeat', 'continuous'], visualConcept: 'loop', curveType: 'circular', energy: 0.5 },
    { keywords: ['flow', 'fluid', 'smooth', 'liquid', 'pour', 'stream', 'current'], visualConcept: 'flow', curveType: 'smooth', energy: 0.4 },
    { keywords: ['peak', 'summit', 'top', 'apex', 'height', 'climb', 'mountain', 'rise'], visualConcept: 'peak', curveType: 'angular', energy: 0.7 },
    { keywords: ['spin', 'rotate', 'turn', 'twist', 'whirl', 'vortex', 'spiral'], visualConcept: 'spin', curveType: 'spiral', energy: 0.8 },
    { keywords: ['rise', 'lift', 'elevate', 'ascend', 'grow', 'up', 'soar'], visualConcept: 'rise', curveType: 'smooth', energy: 0.6 },
    { keywords: ['drop', 'fall', 'descend', 'dive', 'plunge', 'sink'], visualConcept: 'drop', curveType: 'smooth', energy: 0.5 },
    { keywords: ['burst', 'explode', 'blast', 'pop', 'boom', 'bang', 'spark'], visualConcept: 'burst', curveType: 'angular', energy: 1.0 },
    { keywords: ['grow', 'expand', 'bloom', 'flourish', 'thrive', 'sprout'], visualConcept: 'grow', curveType: 'smooth', energy: 0.5 },
    { keywords: ['connect', 'link', 'join', 'bond', 'unite', 'bridge', 'sync'], visualConcept: 'connect', curveType: 'circular', energy: 0.5 },
    { keywords: ['shield', 'protect', 'guard', 'secure', 'safe', 'defend'], visualConcept: 'shield', curveType: 'angular', energy: 0.6 },
    { keywords: ['spark', 'ignite', 'fire', 'flame', 'blaze', 'glow'], visualConcept: 'spark', curveType: 'angular', energy: 0.9 },
    { keywords: ['pulse', 'beat', 'rhythm', 'heart', 'throb', 'vibrate'], visualConcept: 'pulse', curveType: 'sine', energy: 0.7 },
    { keywords: ['orbit', 'circle', 'revolve', 'satellite', 'planet', 'ring'], visualConcept: 'orbit', curveType: 'circular', energy: 0.5 },
    { keywords: ['stack', 'layer', 'tier', 'level', 'build', 'pile'], visualConcept: 'stack', curveType: 'angular', energy: 0.4 },
    { keywords: ['merge', 'blend', 'combine', 'fuse', 'mix', 'meld'], visualConcept: 'merge', curveType: 'smooth', energy: 0.5 },
    { keywords: ['split', 'divide', 'branch', 'fork', 'separate', 'diverge'], visualConcept: 'split', curveType: 'angular', energy: 0.6 },
    { keywords: ['twist', 'wind', 'coil', 'wrap', 'entwine', 'helix'], visualConcept: 'twist', curveType: 'spiral', energy: 0.6 },
    { keywords: ['fold', 'crease', 'bend', 'origami', 'pleat', 'tuck'], visualConcept: 'fold', curveType: 'angular', energy: 0.4 },
];

/**
 * Find semantic meaning in brand name
 */
function findSemanticMeaning(brandName: string): SemanticMeaning | null {
    const lower = brandName.toLowerCase();

    for (const meaning of SEMANTIC_MAP) {
        for (const keyword of meaning.keywords) {
            if (lower.includes(keyword)) {
                return meaning;
            }
        }
    }

    return null;
}

/**
 * Get first letter and its basic structure
 */
function getLetterStructure(letter: string): {
    hasVertical: boolean;
    hasHorizontal: boolean;
    hasDiagonal: boolean;
    hasCurve: boolean;
    isOpen: boolean;
} {
    const structures: Record<string, {
        hasVertical: boolean;
        hasHorizontal: boolean;
        hasDiagonal: boolean;
        hasCurve: boolean;
        isOpen: boolean;
    }> = {
        'A': { hasVertical: false, hasHorizontal: true, hasDiagonal: true, hasCurve: false, isOpen: false },
        'B': { hasVertical: true, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: false },
        'C': { hasVertical: false, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: true },
        'D': { hasVertical: true, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: false },
        'E': { hasVertical: true, hasHorizontal: true, hasDiagonal: false, hasCurve: false, isOpen: true },
        'F': { hasVertical: true, hasHorizontal: true, hasDiagonal: false, hasCurve: false, isOpen: true },
        'G': { hasVertical: false, hasHorizontal: true, hasDiagonal: false, hasCurve: true, isOpen: true },
        'H': { hasVertical: true, hasHorizontal: true, hasDiagonal: false, hasCurve: false, isOpen: true },
        'I': { hasVertical: true, hasHorizontal: false, hasDiagonal: false, hasCurve: false, isOpen: true },
        'J': { hasVertical: true, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: true },
        'K': { hasVertical: true, hasHorizontal: false, hasDiagonal: true, hasCurve: false, isOpen: true },
        'L': { hasVertical: true, hasHorizontal: true, hasDiagonal: false, hasCurve: false, isOpen: true },
        'M': { hasVertical: true, hasHorizontal: false, hasDiagonal: true, hasCurve: false, isOpen: true },
        'N': { hasVertical: true, hasHorizontal: false, hasDiagonal: true, hasCurve: false, isOpen: true },
        'O': { hasVertical: false, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: false },
        'P': { hasVertical: true, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: true },
        'Q': { hasVertical: false, hasHorizontal: false, hasDiagonal: true, hasCurve: true, isOpen: false },
        'R': { hasVertical: true, hasHorizontal: false, hasDiagonal: true, hasCurve: true, isOpen: true },
        'S': { hasVertical: false, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: true },
        'T': { hasVertical: true, hasHorizontal: true, hasDiagonal: false, hasCurve: false, isOpen: true },
        'U': { hasVertical: true, hasHorizontal: false, hasDiagonal: false, hasCurve: true, isOpen: true },
        'V': { hasVertical: false, hasHorizontal: false, hasDiagonal: true, hasCurve: false, isOpen: true },
        'W': { hasVertical: false, hasHorizontal: false, hasDiagonal: true, hasCurve: false, isOpen: true },
        'X': { hasVertical: false, hasHorizontal: false, hasDiagonal: true, hasCurve: false, isOpen: true },
        'Y': { hasVertical: true, hasHorizontal: false, hasDiagonal: true, hasCurve: false, isOpen: true },
        'Z': { hasVertical: false, hasHorizontal: true, hasDiagonal: true, hasCurve: false, isOpen: true },
    };

    return structures[letter.toUpperCase()] || structures['A'];
}

/**
 * Generate wave-fused letter
 */
function generateWaveFusion(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const amplitude = size * 0.12;
    const waveCount = 2 + params.elementCount % 2;
    const strokeWidth = size * 0.1;

    // Create wave-modified letter shape
    const struct = getLetterStructure(letter);

    if (letter.toUpperCase() === 'W') {
        // W as waves
        const paths: string[] = [];
        const startX = cx - size * 0.35;
        const endX = cx + size * 0.35;

        for (let layer = 0; layer < 3; layer++) {
            const layerY = cy - size * 0.15 + layer * size * 0.15;
            let path = `M ${startX} ${layerY}`;

            for (let i = 0; i <= 20; i++) {
                const t = i / 20;
                const x = startX + t * (endX - startX);
                const y = layerY + Math.sin(t * Math.PI * waveCount) * amplitude * (1 - layer * 0.2);
                path += ` ${i === 0 ? 'L' : ''} ${x} ${y}`;
            }

            // Close path with bottom wave
            for (let i = 20; i >= 0; i--) {
                const t = i / 20;
                const x = startX + t * (endX - startX);
                const y = layerY + strokeWidth + Math.sin(t * Math.PI * waveCount) * amplitude * (1 - layer * 0.2);
                path += ` L ${x} ${y}`;
            }
            path += ' Z';
            paths.push(path);
        }

        return paths.join(' ');
    }

    // Generic wave application to vertical strokes
    const paths: string[] = [];

    if (struct.hasVertical) {
        // Wave the vertical stroke
        const startY = cy - size * 0.35;
        const endY = cy + size * 0.35;
        let path = `M ${cx - strokeWidth / 2} ${startY}`;

        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const y = startY + t * (endY - startY);
            const x = cx + Math.sin(t * Math.PI * waveCount) * amplitude;
            path += ` L ${x - strokeWidth / 2} ${y}`;
        }

        for (let i = 20; i >= 0; i--) {
            const t = i / 20;
            const y = startY + t * (endY - startY);
            const x = cx + Math.sin(t * Math.PI * waveCount) * amplitude;
            path += ` L ${x + strokeWidth / 2} ${y}`;
        }
        path += ' Z';
        paths.push(path);
    }

    if (struct.hasHorizontal) {
        // Wave the horizontal stroke
        const crossY = cy - size * 0.05;
        const startX = cx - size * 0.25;
        const endX = cx + size * 0.25;
        let path = `M ${startX} ${crossY - strokeWidth / 2}`;

        for (let i = 0; i <= 20; i++) {
            const t = i / 20;
            const x = startX + t * (endX - startX);
            const y = crossY + Math.sin(t * Math.PI * 2) * amplitude * 0.5;
            path += ` L ${x} ${y - strokeWidth / 2}`;
        }

        for (let i = 20; i >= 0; i--) {
            const t = i / 20;
            const x = startX + t * (endX - startX);
            const y = crossY + Math.sin(t * Math.PI * 2) * amplitude * 0.5;
            path += ` L ${x} ${y + strokeWidth / 2}`;
        }
        path += ' Z';
        paths.push(path);
    }

    return paths.join(' ');
}

/**
 * Generate bolt/lightning fused letter
 */
function generateBoltFusion(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const struct = getLetterStructure(letter);
    const zigWidth = size * 0.08;
    const zigDepth = size * 0.12;

    if (letter.toUpperCase() === 'B') {
        // B with lightning bolt integration
        const stemX = cx - size * 0.2;
        const stemW = size * 0.08;

        // Zigzag stem
        let stemPath = `M ${stemX - stemW / 2} ${cy - size * 0.35}`;
        stemPath += ` L ${stemX + stemW / 2 + zigDepth} ${cy - size * 0.15}`;
        stemPath += ` L ${stemX - stemW / 2} ${cy + size * 0.05}`;
        stemPath += ` L ${stemX + stemW / 2 + zigDepth} ${cy + size * 0.25}`;
        stemPath += ` L ${stemX - stemW / 2} ${cy + size * 0.35}`;
        stemPath += ` L ${stemX - stemW / 2 - stemW} ${cy + size * 0.35}`;
        stemPath += ` L ${stemX + stemW / 2 + zigDepth - stemW} ${cy + size * 0.25}`;
        stemPath += ` L ${stemX - stemW / 2 - stemW} ${cy + size * 0.05}`;
        stemPath += ` L ${stemX + stemW / 2 + zigDepth - stemW} ${cy - size * 0.15}`;
        stemPath += ` L ${stemX - stemW / 2 - stemW} ${cy - size * 0.35}`;
        stemPath += ' Z';
        paths.push(stemPath);

        // Angular bowls
        const bowlR = size * 0.18;
        paths.push(`
            M ${stemX + stemW} ${cy - size * 0.25}
            L ${cx + size * 0.25} ${cy - size * 0.35}
            L ${cx + size * 0.3} ${cy - size * 0.15}
            L ${stemX + stemW} ${cy - size * 0.05}
            Z
        `);
        paths.push(`
            M ${stemX + stemW} ${cy + size * 0.05}
            L ${cx + size * 0.3} ${cy - size * 0.05}
            L ${cx + size * 0.35} ${cy + size * 0.2}
            L ${stemX + stemW} ${cy + size * 0.35}
            Z
        `);

        return paths.join(' ');
    }

    // Generic lightning application
    if (struct.hasVertical) {
        const startY = cy - size * 0.35;
        const endY = cy + size * 0.35;
        const segments = 4;
        const segmentHeight = (endY - startY) / segments;

        let path = `M ${cx - zigWidth / 2} ${startY}`;
        for (let i = 0; i < segments; i++) {
            const y1 = startY + i * segmentHeight;
            const y2 = startY + (i + 1) * segmentHeight;
            const xOffset = (i % 2 === 0 ? 1 : -1) * zigDepth;
            path += ` L ${cx + xOffset + zigWidth / 2} ${(y1 + y2) / 2}`;
            path += ` L ${cx - zigWidth / 2} ${y2}`;
        }

        // Return path
        for (let i = segments - 1; i >= 0; i--) {
            const y1 = startY + i * segmentHeight;
            const y2 = startY + (i + 1) * segmentHeight;
            const xOffset = (i % 2 === 0 ? 1 : -1) * zigDepth;
            path += ` L ${cx + xOffset - zigWidth / 2} ${(y1 + y2) / 2}`;
            path += ` L ${cx + zigWidth / 2} ${y1}`;
        }
        path += ' Z';
        paths.push(path);
    }

    return paths.join(' ');
}

/**
 * Generate loop-fused letter
 */
function generateLoopFusion(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const strokeWidth = size * 0.08;

    if (letter.toUpperCase() === 'L') {
        // L that loops back on itself
        const r = size * 0.25;
        const loopR = size * 0.15;

        // Vertical with loop at bottom
        paths.push(`
            M ${cx - size * 0.15 - strokeWidth / 2} ${cy - size * 0.35}
            L ${cx - size * 0.15 + strokeWidth / 2} ${cy - size * 0.35}
            L ${cx - size * 0.15 + strokeWidth / 2} ${cy + size * 0.2}
            Q ${cx - size * 0.15 + strokeWidth / 2} ${cy + size * 0.35}
              ${cx} ${cy + size * 0.35}
            Q ${cx + size * 0.25} ${cy + size * 0.35}
              ${cx + size * 0.25} ${cy + size * 0.2}
            Q ${cx + size * 0.25} ${cy + size * 0.05}
              ${cx} ${cy + size * 0.05}
            Q ${cx - size * 0.15 - strokeWidth / 2} ${cy + size * 0.05}
              ${cx - size * 0.15 - strokeWidth / 2} ${cy + size * 0.2}
            Z
        `);

        return paths.join(' ');
    }

    if (letter.toUpperCase() === 'O') {
        // O as infinity loop
        const loopW = size * 0.35;
        const loopH = size * 0.2;

        paths.push(`
            M ${cx} ${cy}
            C ${cx - loopW} ${cy - loopH * 2}
              ${cx - loopW} ${cy + loopH * 2}
              ${cx} ${cy}
            C ${cx + loopW} ${cy - loopH * 2}
              ${cx + loopW} ${cy + loopH * 2}
              ${cx} ${cy}
        `);

        // Inner cutout
        const innerScale = 0.6;
        paths.push(`
            M ${cx} ${cy}
            C ${cx - loopW * innerScale} ${cy - loopH * 2 * innerScale}
              ${cx - loopW * innerScale} ${cy + loopH * 2 * innerScale}
              ${cx} ${cy}
            C ${cx + loopW * innerScale} ${cy - loopH * 2 * innerScale}
              ${cx + loopW * innerScale} ${cy + loopH * 2 * innerScale}
              ${cx} ${cy}
        `);

        return paths.join(' ');
    }

    // Generic loop addition
    const struct = getLetterStructure(letter);

    if (struct.isOpen) {
        // Add loop to open end
        const loopR = size * 0.12;
        const loopX = cx + size * 0.2;
        const loopY = cy;

        paths.push(`
            M ${loopX - loopR} ${loopY}
            A ${loopR} ${loopR} 0 1 1 ${loopX + loopR} ${loopY}
            A ${loopR} ${loopR} 0 1 1 ${loopX - loopR} ${loopY}
        `);
    }

    return paths.join(' ');
}

/**
 * Generate flow-fused letter
 */
function generateFlowFusion(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const strokeWidth = size * 0.1;

    // Flow effect - smooth, organic curves
    if (letter.toUpperCase() === 'F') {
        // F with flowing curves instead of straight lines
        paths.push(`
            M ${cx - size * 0.2} ${cy - size * 0.35}
            Q ${cx + size * 0.1} ${cy - size * 0.4}
              ${cx + size * 0.25} ${cy - size * 0.3}
            Q ${cx + size * 0.15} ${cy - size * 0.25}
              ${cx - size * 0.1} ${cy - size * 0.2}
            L ${cx - size * 0.1} ${cy - size * 0.05}
            Q ${cx + size * 0.15} ${cy - size * 0.1}
              ${cx + size * 0.15} ${cy}
            Q ${cx + size * 0.05} ${cy + size * 0.05}
              ${cx - size * 0.1} ${cy + size * 0.05}
            L ${cx - size * 0.1} ${cy + size * 0.35}
            Q ${cx - size * 0.15} ${cy + size * 0.4}
              ${cx - size * 0.25} ${cy + size * 0.35}
            Q ${cx - size * 0.2} ${cy + size * 0.25}
              ${cx - size * 0.2} ${cy - size * 0.35}
            Z
        `);

        return paths.join(' ');
    }

    // Generic flowing treatment
    const controlOffset = size * 0.15;

    // Create flowing base shape
    paths.push(`
        M ${cx - size * 0.3} ${cy - size * 0.2}
        Q ${cx - size * 0.1} ${cy - size * 0.4}
          ${cx + size * 0.1} ${cy - size * 0.3}
        Q ${cx + size * 0.3} ${cy - size * 0.2}
          ${cx + size * 0.3} ${cy}
        Q ${cx + size * 0.3} ${cy + size * 0.2}
          ${cx + size * 0.1} ${cy + size * 0.3}
        Q ${cx - size * 0.1} ${cy + size * 0.4}
          ${cx - size * 0.3} ${cy + size * 0.2}
        Q ${cx - size * 0.35} ${cy}
          ${cx - size * 0.3} ${cy - size * 0.2}
        Z
    `);

    return paths.join(' ');
}

/**
 * Generate peak/mountain fused letter
 */
function generatePeakFusion(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];

    if (letter.toUpperCase() === 'P' || letter.toUpperCase() === 'A') {
        // P/A with mountain peak at top
        const peakX = cx;
        const peakY = cy - size * 0.4;
        const baseWidth = size * 0.5;
        const peakWidth = size * 0.1;

        paths.push(`
            M ${cx - baseWidth / 2} ${cy + size * 0.35}
            L ${peakX - peakWidth} ${peakY + size * 0.1}
            L ${peakX} ${peakY}
            L ${peakX + peakWidth} ${peakY + size * 0.1}
            L ${cx + baseWidth / 2} ${cy + size * 0.35}
            L ${cx + baseWidth / 2 - size * 0.1} ${cy + size * 0.35}
            L ${peakX} ${peakY + size * 0.25}
            L ${cx - baseWidth / 2 + size * 0.1} ${cy + size * 0.35}
            Z
        `);

        return paths.join(' ');
    }

    // Generic peak addition
    const peakHeight = size * 0.25;
    paths.push(`
        M ${cx - size * 0.2} ${cy}
        L ${cx} ${cy - peakHeight}
        L ${cx + size * 0.2} ${cy}
        L ${cx + size * 0.15} ${cy}
        L ${cx} ${cy - peakHeight + size * 0.08}
        L ${cx - size * 0.15} ${cy}
        Z
    `);

    return paths.join(' ');
}

/**
 * Generate burst fused letter
 */
function generateBurstFusion(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];
    const rayCount = 6 + Math.floor(params.elementCount % 5);
    const innerR = size * 0.15;
    const outerR = size * 0.35;
    const rayWidth = size * 0.04;

    // Central letter-shaped burst
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * 2 * Math.PI - Math.PI / 2;
        const rayLength = outerR * (0.7 + rng() * 0.3);

        const startX = cx + Math.cos(angle) * innerR;
        const startY = cy + Math.sin(angle) * innerR;
        const endX = cx + Math.cos(angle) * rayLength;
        const endY = cy + Math.sin(angle) * rayLength;

        const perpX = Math.sin(angle) * rayWidth;
        const perpY = -Math.cos(angle) * rayWidth;

        // Tapered ray
        paths.push(`
            M ${startX - perpX} ${startY - perpY}
            L ${endX - perpX * 0.3} ${endY - perpY * 0.3}
            L ${endX + perpX * 0.3} ${endY + perpY * 0.3}
            L ${startX + perpX} ${startY + perpY}
            Z
        `);
    }

    // Center circle with letter initial
    paths.push(`
        M ${cx} ${cy - innerR}
        A ${innerR} ${innerR} 0 1 1 ${cx} ${cy + innerR}
        A ${innerR} ${innerR} 0 1 1 ${cx} ${cy - innerR}
    `);

    return paths.join(' ');
}

/**
 * Generate orbit fused letter
 */
function generateOrbitFusion(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const paths: string[] = [];
    const orbitR = size * 0.35;
    const ringWidth = size * 0.04;
    const tilt = params.rotationOffset * 0.3;

    // Tilted orbit ring
    const ellipseRy = orbitR * (0.4 + tilt * 0.02);

    paths.push(`
        M ${cx - orbitR} ${cy}
        A ${orbitR} ${ellipseRy} 0 1 1 ${cx + orbitR} ${cy}
        A ${orbitR} ${ellipseRy} 0 1 1 ${cx - orbitR} ${cy}
    `);

    // Inner cutout
    const innerR = orbitR - ringWidth * 2;
    const innerRy = ellipseRy - ringWidth * 2;
    paths.push(`
        M ${cx - innerR} ${cy}
        A ${innerR} ${innerRy} 0 1 0 ${cx + innerR} ${cy}
        A ${innerR} ${innerRy} 0 1 0 ${cx - innerR} ${cy}
    `);

    // Orbiting element
    const orbitAngle = params.rotationOffset;
    const dotX = cx + Math.cos(orbitAngle) * orbitR;
    const dotY = cy + Math.sin(orbitAngle) * ellipseRy;
    const dotR = size * 0.06;

    paths.push(`
        M ${dotX} ${dotY - dotR}
        A ${dotR} ${dotR} 0 1 1 ${dotX} ${dotY + dotR}
        A ${dotR} ${dotR} 0 1 1 ${dotX} ${dotY - dotR}
    `);

    return paths.join(' ');
}

/**
 * Main Semantic Fusion generator
 */
export function generateSemanticFusion(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, primaryColor, accentColor, variations = 5 } = params;
    const logos: GeneratedLogo[] = [];

    const meaning = findSemanticMeaning(brandName);
    const firstLetter = brandName.charAt(0);

    for (let v = 0; v < variations; v++) {
        const salt = `semantic-fusion-${v}-${Date.now()}`;
        const hashParams = generateHashParamsSync(brandName, params.category || 'creative', salt);
        const derived = deriveParamsFromHash(hashParams.hashHex);
        const rng = createSeededRandom(hashParams.hashHex);

        const viewBox = '0 0 100 100';
        const cx = 50;
        const cy = 50;
        const size = 75;

        let mainPath: string;

        // Choose fusion type based on meaning and variant
        if (meaning) {
            const conceptIndex = v % 8;
            switch (meaning.visualConcept) {
                case 'wave':
                    mainPath = generateWaveFusion(firstLetter, cx, cy, size, derived);
                    break;
                case 'bolt':
                case 'spark':
                    mainPath = generateBoltFusion(firstLetter, cx, cy, size, derived);
                    break;
                case 'loop':
                case 'orbit':
                    mainPath = conceptIndex % 2 === 0
                        ? generateLoopFusion(firstLetter, cx, cy, size, derived)
                        : generateOrbitFusion(firstLetter, cx, cy, size, derived);
                    break;
                case 'flow':
                    mainPath = generateFlowFusion(firstLetter, cx, cy, size, derived);
                    break;
                case 'peak':
                case 'rise':
                    mainPath = generatePeakFusion(firstLetter, cx, cy, size, derived);
                    break;
                case 'burst':
                    mainPath = generateBurstFusion(firstLetter, cx, cy, size, derived, rng);
                    break;
                default:
                    mainPath = generateFlowFusion(firstLetter, cx, cy, size, derived);
            }
        } else {
            // No semantic match - use letter structure to determine style
            const struct = getLetterStructure(firstLetter);
            if (struct.hasCurve) {
                mainPath = generateFlowFusion(firstLetter, cx, cy, size, derived);
            } else if (struct.hasDiagonal) {
                mainPath = generatePeakFusion(firstLetter, cx, cy, size, derived);
            } else {
                mainPath = generateBoltFusion(firstLetter, cx, cy, size, derived);
            }
        }

        // Build gradient
        const gradientId = `semanticFusionGrad-${v}`;
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
            id: `semantic-fusion-${hashParams.hashHex.slice(0, 12)}-${v}`,
            hash: hashParams.hashHex,
            algorithm: 'semantic-fusion' as any,
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
                    gridBased: false,
                    bezierCurves: true,
                    symmetry: 'none',
                    pathCount: svg.match(/<path/g)?.length || 1,
                    complexity: 80 + (meaning?.energy || 0.5) * 20,
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

    return logos.filter(l => l.quality.score >= 60).slice(0, 5);
}

export function generateSingleSemanticFusionPreview(
    brandName: string,
    primaryColor: string,
    accentColor?: string
): GeneratedLogo {
    const logos = generateSemanticFusion({
        brandName,
        primaryColor,
        accentColor,
        variations: 1,
    });
    return logos[0];
}

// Export for external use
export { findSemanticMeaning, SEMANTIC_MAP, type SemanticMeaning };
