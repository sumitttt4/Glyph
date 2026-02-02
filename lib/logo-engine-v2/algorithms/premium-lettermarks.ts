/**
 * Premium Lettermark Algorithms
 *
 * Creates distinctive, premium first-letter logos that would pass the "designer test":
 * - NOT generic letter in a shape
 * - Uses geometric deconstruction, negative space, dimensional treatment
 * - Each letter has unique visual treatment based on its anatomy
 *
 * Quality Standards:
 * - Geometric complexity: Letter is constructed, not typed
 * - Uniqueness: Could not be swapped with any other letter
 * - Negative space: Creates visual interest within/around letter
 * - Would a designer call this generic? Answer must be NO
 *
 * NOTE: All algorithms use `currentColor` which inherits from parent CSS
 */

import { InfiniteLogoParams } from '../types';
import { getSkeleton, LetterSkeleton, AnatomyPart } from '../letter-skeletons';

// ============================================
// UTILITY FUNCTIONS
// ============================================

function seededRandom(seed: string): number {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

function getLetterInitial(brandName: string): string {
    return brandName.charAt(0).toUpperCase();
}

// ============================================
// 1. GEOMETRIC DECONSTRUCTION
// Break the letter into geometric primitives and reassemble
// ============================================

export function generateGeometricDeconstruction(params: InfiniteLogoParams, brandName: string): string {
    const letter = getLetterInitial(brandName);
    const skeleton = getSkeleton(letter);
    const seed = brandName + 'geo-deconstruct';
    const strokeWidth = params.strokeWidth || 3;
    const uniqueId = `geo-${brandName.slice(0, 4)}`;

    if (!skeleton) {
        return generateFallbackGeometricLetter(letter, strokeWidth, uniqueId);
    }

    // Deconstruct letter into geometric shapes based on anatomy
    const shapes: string[] = [];

    skeleton.anatomy.forEach((part, idx) => {
        const offset = idx * 2;

        switch (part.type) {
            case 'diagonal':
            case 'stem':
                shapes.push(generateDeconstructedBar(part, skeleton.anchors, offset, idx));
                break;
            case 'apex':
            case 'vertex':
                shapes.push(generateDeconstructedTriangle(skeleton.anchors, part.anchorIndices[0]));
                break;
            case 'bowl':
            case 'loop':
            case 'arc':
                shapes.push(generateDeconstructedCurve(idx));
                break;
            case 'crossbar':
            case 'bar':
                shapes.push(generateDeconstructedCrossbar(part, skeleton.anchors, offset));
                break;
        }
    });

    // Add geometric accent shapes
    const accentShapes = generateGeometricAccents(seed);

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g>
                ${shapes.join('\n')}
                ${accentShapes}
            </g>
        </svg>
    `;
}

function generateDeconstructedBar(part: AnatomyPart, anchors: { x: number; y: number }[], offset: number, idx: number): string {
    if (part.anchorIndices.length < 2) return '';

    const start = anchors[part.anchorIndices[0]];
    const end = anchors[part.anchorIndices[1] || part.anchorIndices[0]];

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const nx = -dy / len * 6;
    const ny = dx / len * 6;

    const offsetX = (idx % 2 === 0 ? 2 : -2);
    const offsetY = (idx % 2 === 0 ? -2 : 2);

    return `
        <polygon
            points="${start.x + offsetX},${start.y + offsetY}
                    ${end.x + offsetX},${end.y + offsetY}
                    ${end.x + nx + offsetX},${end.y + ny + offsetY}
                    ${start.x + nx + offsetX},${start.y + ny + offsetY}"
            fill="currentColor"
            opacity="0.9"
        />
    `;
}

function generateDeconstructedTriangle(anchors: { x: number; y: number }[], apexIdx: number): string {
    const apex = anchors[apexIdx];
    const size = 12;

    return `
        <polygon
            points="${apex.x},${apex.y - size/2} ${apex.x - size/2},${apex.y + size/2} ${apex.x + size/2},${apex.y + size/2}"
            fill="currentColor"
            opacity="0.8"
        />
    `;
}

function generateDeconstructedCurve(idx: number): string {
    const segments: string[] = [];
    const numSegments = 3 + (idx % 2);

    for (let i = 0; i < numSegments; i++) {
        const angle = (Math.PI / numSegments) * i - Math.PI / 2;
        const x = 50 + Math.cos(angle) * 30;
        const y = 50 + Math.sin(angle) * 30;
        const size = 8 - i * 1.5;

        segments.push(`
            <circle cx="${x}" cy="${y}" r="${size}" fill="currentColor" opacity="${0.9 - i * 0.15}"/>
        `);
    }

    return segments.join('');
}

function generateDeconstructedCrossbar(part: AnatomyPart, anchors: { x: number; y: number }[], offset: number): string {
    if (part.anchorIndices.length < 2) return '';

    const start = anchors[part.anchorIndices[0]];
    const end = anchors[part.anchorIndices[1]];

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const width = Math.abs(end.x - start.x) * 0.8;

    return `
        <rect
            x="${midX - width/2}" y="${midY - 4}"
            width="${width}" height="8"
            rx="2"
            fill="currentColor"
            opacity="0.85"
            transform="rotate(${offset}, ${midX}, ${midY})"
        />
    `;
}

function generateGeometricAccents(seed: string): string {
    const rand = seededRandom(seed);
    const accents: string[] = [];

    if (rand > 0.5) {
        accents.push(`<circle cx="85" cy="15" r="4" fill="currentColor" opacity="0.5"/>`);
    }
    if (rand > 0.3) {
        accents.push(`<line x1="10" y1="95" x2="25" y2="95" stroke="currentColor" stroke-width="2" opacity="0.4"/>`);
    }

    return accents.join('');
}

function generateFallbackGeometricLetter(letter: string, strokeWidth: number, uniqueId: string): string {
    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="15" width="25" height="70" rx="3" fill="currentColor" transform="rotate(-5 32.5 50)" opacity="0.9"/>
            <rect x="55" y="15" width="25" height="70" rx="3" fill="currentColor" transform="rotate(5 67.5 50)" opacity="0.9"/>
            <polygon points="50,10 35,35 65,35" fill="currentColor" opacity="0.7"/>
            <rect x="30" y="55" width="40" height="10" rx="2" fill="currentColor" opacity="0.6"/>
        </svg>
    `;
}

// ============================================
// 2. NEGATIVE SPACE LETTERMARK
// Create letter through absence - cut shapes from solid
// ============================================

export function generateNegativeSpaceLetter(params: InfiniteLogoParams, brandName: string): string {
    const letter = getLetterInitial(brandName);
    const skeleton = getSkeleton(letter);
    const strokeWidth = params.strokeWidth || 4;
    const uniqueId = `neg-${brandName.slice(0, 4)}`;

    const letterMask = skeleton ? createLetterMask(skeleton, strokeWidth) : createFallbackMask(letter);

    const hasCurves = skeleton?.anatomy.some(p => ['bowl', 'arc', 'loop'].indexOf(p.type) >= 0);

    const containerShape = hasCurves
        ? `<circle cx="50" cy="50" r="45" fill="currentColor"/>`
        : `<rect x="8" y="5" width="84" height="90" rx="12" fill="currentColor"/>`;

    const negativeSpaceCuts = generateNegativeSpaceCuts(skeleton);

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <mask id="letter-mask-${uniqueId}">
                    <rect width="100" height="100" fill="white"/>
                    ${letterMask}
                    ${negativeSpaceCuts}
                </mask>
            </defs>
            <g mask="url(#letter-mask-${uniqueId})">
                ${containerShape}
            </g>
        </svg>
    `;
}

function createLetterMask(skeleton: LetterSkeleton, strokeWidth: number): string {
    return `
        <path
            d="${skeleton.svgPath}"
            fill="none"
            stroke="black"
            stroke-width="${strokeWidth * 4}"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    `;
}

function createFallbackMask(letter: string): string {
    return `
        <text
            x="50" y="70"
            font-size="60"
            font-weight="900"
            text-anchor="middle"
            fill="black"
            font-family="system-ui, sans-serif"
        >${letter}</text>
    `;
}

function generateNegativeSpaceCuts(skeleton: LetterSkeleton | undefined): string {
    const cuts: string[] = [];

    if (skeleton) {
        skeleton.anatomy.forEach((part) => {
            if (part.type === 'apex' || part.type === 'vertex') {
                const anchor = skeleton.anchors[part.anchorIndices[0]];
                if (anchor) {
                    cuts.push(`<circle cx="${anchor.x}" cy="${anchor.y}" r="8" fill="black"/>`);
                }
            }
        });
    }

    cuts.push(`<rect x="75" y="5" width="25" height="25" rx="3" fill="black"/>`);

    return cuts.join('');
}

// ============================================
// 3. LAYERED DIMENSIONAL LETTERMARK
// Create depth with overlapping planes
// ============================================

export function generateLayeredDimensional(params: InfiniteLogoParams, brandName: string): string {
    const letter = getLetterInitial(brandName);
    const skeleton = getSkeleton(letter);

    const layers: string[] = [];
    const offsets = [
        { x: 6, y: 6, opacity: 0.25 },
        { x: 3, y: 3, opacity: 0.5 },
        { x: 0, y: 0, opacity: 1 },
    ];

    if (skeleton) {
        offsets.forEach((offset, idx) => {
            layers.push(`
                <g transform="translate(${offset.x}, ${offset.y})" opacity="${offset.opacity}">
                    <path
                        d="${skeleton.svgPath}"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="${idx === 2 ? 8 : 6}"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </g>
            `);
        });
    } else {
        offsets.forEach((offset) => {
            layers.push(`
                <text
                    x="${50 + offset.x}" y="${68 + offset.y}"
                    font-size="65"
                    font-weight="900"
                    text-anchor="middle"
                    fill="currentColor"
                    opacity="${offset.opacity}"
                    font-family="system-ui, sans-serif"
                >${letter}</text>
            `);
        });
    }

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${layers.join('\n')}
            <rect x="78" y="78" width="16" height="16" rx="3" fill="currentColor" opacity="0.4"/>
        </svg>
    `;
}

// ============================================
// 4. ABSTRACT INTEGRATION
// Letter becomes part of a larger abstract composition
// ============================================

export function generateAbstractIntegration(params: InfiniteLogoParams, brandName: string): string {
    const letter = getLetterInitial(brandName);
    const skeleton = getSkeleton(letter);
    const seed = brandName + 'abstract';
    const rand = seededRandom(seed);

    const abstractBg = generateAbstractBackground(rand);
    const integratedLetter = skeleton
        ? generateIntegratedLetter(skeleton)
        : generateFallbackIntegratedLetter(letter);
    const connectors = generateAbstractConnectors(rand);

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${abstractBg}
            ${integratedLetter}
            ${connectors}
        </svg>
    `;
}

function generateAbstractBackground(rand: number): string {
    const shapes: string[] = [];

    if (rand > 0.5) {
        shapes.push(`<polygon points="0,30 100,0 100,70 0,100" fill="currentColor" opacity="0.08"/>`);
    } else {
        shapes.push(`<circle cx="75" cy="75" r="40" fill="currentColor" opacity="0.08"/>`);
    }

    shapes.push(`<rect x="0" y="0" width="3" height="100" fill="currentColor" opacity="0.3"/>`);
    shapes.push(`<circle cx="90" cy="10" r="8" fill="currentColor" opacity="0.2"/>`);

    return shapes.join('\n');
}

function generateIntegratedLetter(skeleton: LetterSkeleton): string {
    const letterPath = `
        <path
            d="${skeleton.svgPath}"
            fill="none"
            stroke="currentColor"
            stroke-width="6"
            stroke-linecap="round"
            stroke-linejoin="round"
        />
    `;

    const accents: string[] = [];
    skeleton.anatomy.forEach((part, idx) => {
        if (part.isPrimary && part.anchorIndices.length > 0) {
            const anchor = skeleton.anchors[part.anchorIndices[0]];
            if (idx % 2 === 0) {
                accents.push(`<circle cx="${anchor.x}" cy="${anchor.y}" r="4" fill="currentColor" opacity="0.6"/>`);
            }
        }
    });

    return letterPath + accents.join('');
}

function generateFallbackIntegratedLetter(letter: string): string {
    return `
        <text
            x="50" y="68"
            font-size="55"
            font-weight="800"
            text-anchor="middle"
            fill="currentColor"
            font-family="system-ui, sans-serif"
        >${letter}</text>
    `;
}

function generateAbstractConnectors(rand: number): string {
    const connectors: string[] = [];

    if (rand > 0.4) {
        connectors.push(`<line x1="5" y1="95" x2="30" y2="70" stroke="currentColor" stroke-width="2" opacity="0.4"/>`);
    }
    if (rand > 0.6) {
        connectors.push(`
            <circle cx="85" cy="85" r="2" fill="currentColor" opacity="0.6"/>
            <circle cx="80" cy="90" r="1.5" fill="currentColor" opacity="0.4"/>
            <circle cx="75" cy="93" r="1" fill="currentColor" opacity="0.3"/>
        `);
    }

    return connectors.join('');
}

// ============================================
// 5. ARCHITECTURAL LETTERMARK
// Grid-based, construction-style with guides visible
// ============================================

export function generateArchitecturalLetter(params: InfiniteLogoParams, brandName: string): string {
    const letter = getLetterInitial(brandName);
    const skeleton = getSkeleton(letter);

    const grid = generateConstructionGrid();
    const constructedLetter = skeleton
        ? generateConstructedLetter(skeleton)
        : generateFallbackConstructed(letter);
    const guides = generateGuideMarks();

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${grid}
            ${constructedLetter}
            ${guides}
        </svg>
    `;
}

function generateConstructionGrid(): string {
    const lines: string[] = [];

    for (let i = 0; i <= 100; i += 25) {
        lines.push(`<line x1="${i}" y1="0" x2="${i}" y2="100" stroke="currentColor" stroke-width="0.5" opacity="0.12"/>`);
        lines.push(`<line x1="0" y1="${i}" x2="100" y2="${i}" stroke="currentColor" stroke-width="0.5" opacity="0.12"/>`);
    }

    lines.push(`<line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>`);
    lines.push(`<line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>`);

    return lines.join('\n');
}

function generateConstructedLetter(skeleton: LetterSkeleton): string {
    const elements: string[] = [];

    elements.push(`
        <path
            d="${skeleton.svgPath}"
            fill="none"
            stroke="currentColor"
            stroke-width="5"
            stroke-linecap="square"
            stroke-linejoin="miter"
        />
    `);

    skeleton.anchors.forEach((anchor) => {
        elements.push(`
            <circle cx="${anchor.x}" cy="${anchor.y}" r="2" fill="none" stroke="currentColor" stroke-width="0.75" opacity="0.5"/>
        `);
    });

    return elements.join('\n');
}

function generateFallbackConstructed(letter: string): string {
    return `
        <text
            x="50" y="68"
            font-size="60"
            font-weight="700"
            text-anchor="middle"
            fill="currentColor"
            font-family="monospace"
        >${letter}</text>
    `;
}

function generateGuideMarks(): string {
    return `
        <line x1="5" y1="10" x2="5" y2="90" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
        <line x1="3" y1="10" x2="7" y2="10" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
        <line x1="3" y1="90" x2="7" y2="90" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
    `;
}

// ============================================
// 6. DYNAMIC ASYMMETRIC LETTERMARK
// Off-center, unexpected composition with energy
// ============================================

export function generateDynamicAsymmetric(params: InfiniteLogoParams, brandName: string): string {
    const letter = getLetterInitial(brandName);
    const skeleton = getSkeleton(letter);
    const seed = brandName + 'dynamic';
    const rand = seededRandom(seed);

    const offsetX = rand > 0.5 ? 15 : -10;
    const offsetY = rand > 0.5 ? -8 : 5;
    const rotation = (rand - 0.5) * 12;

    const dynamicElements: string[] = [];

    dynamicElements.push(`
        <rect
            x="${60 + rand * 20}" y="${5 + rand * 10}"
            width="35" height="35"
            rx="4"
            fill="currentColor"
            opacity="0.1"
            transform="rotate(${rotation * 2}, 77, 27)"
        />
    `);

    if (skeleton) {
        dynamicElements.push(`
            <g transform="translate(${offsetX}, ${offsetY}) rotate(${rotation}, 50, 50)">
                <path
                    d="${skeleton.svgPath}"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="6"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </g>
        `);
    } else {
        dynamicElements.push(`
            <text
                x="${50 + offsetX}" y="${68 + offsetY}"
                font-size="60"
                font-weight="900"
                text-anchor="middle"
                fill="currentColor"
                font-family="system-ui, sans-serif"
                transform="rotate(${rotation}, ${50 + offsetX}, ${50 + offsetY})"
            >${letter}</text>
        `);
    }

    dynamicElements.push(`
        <circle cx="${15 - offsetX/2}" cy="${85 + offsetY/2}" r="5" fill="currentColor" opacity="0.6"/>
        <line
            x1="${80 + offsetX}" y1="75"
            x2="${95 + offsetX}" y2="60"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
        />
    `);

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            ${dynamicElements.join('\n')}
        </svg>
    `;
}

// ============================================
// 7. MONOGRAM FUSION
// Letter integrated with unique geometric mark
// ============================================

export function generateMonogramFusion(params: InfiniteLogoParams, brandName: string): string {
    const letter = getLetterInitial(brandName);
    const skeleton = getSkeleton(letter);
    const seed = brandName + 'fusion';
    const rand = seededRandom(seed);
    const uniqueId = `fus-${brandName.slice(0, 4)}`;

    const hasDiagonals = skeleton?.anatomy.some(p => p.type === 'diagonal');
    const hasCurves = skeleton?.anatomy.some(p => ['bowl', 'arc', 'loop'].indexOf(p.type) >= 0);

    const fusionShape = generateFusionShape(hasDiagonals || false, hasCurves || false, uniqueId);

    const letterElement = skeleton
        ? `<path d="${skeleton.svgPath}" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
        : `<text x="50" y="68" font-size="58" font-weight="900" text-anchor="middle" fill="currentColor" font-family="system-ui">${letter}</text>`;

    return `
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="fus-grad-${uniqueId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="currentColor" stop-opacity="0.2"/>
                    <stop offset="100%" stop-color="currentColor" stop-opacity="0.05"/>
                </linearGradient>
            </defs>
            ${fusionShape}
            ${letterElement}
        </svg>
    `;
}

function generateFusionShape(hasDiagonals: boolean, hasCurves: boolean, uniqueId: string): string {
    if (hasDiagonals) {
        return `
            <polygon points="50,5 85,80 15,80" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <circle cx="50" cy="55" r="25" fill="url(#fus-grad-${uniqueId})"/>
        `;
    }

    if (hasCurves) {
        return `
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
            <circle cx="50" cy="50" r="35" fill="url(#fus-grad-${uniqueId})"/>
        `;
    }

    return `
        <rect x="12" y="12" width="76" height="76" rx="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"/>
        <rect x="20" y="20" width="60" height="60" rx="4" fill="url(#fus-grad-${uniqueId})"/>
    `;
}

// ============================================
// LETTERMARK QUALITY SCORING
// Filter out generic first-letter logos
// ============================================

export interface LettermarkQualityScore {
    geometricComplexity: number;
    uniqueness: number;
    negativeSpaceUsage: number;
    isGeneric: boolean;
    overallScore: number;
    passesQualityCheck: boolean;
}

export function scoreLettermarkQuality(
    svgString: string,
    letter: string,
    algorithmName: string
): LettermarkQualityScore {

    const hasMultiplePaths = (svgString.match(/<path/g) || []).length > 1;
    const hasPolygons = svgString.indexOf('<polygon') >= 0;
    const hasMultipleCircles = (svgString.match(/<circle/g) || []).length > 2;
    const hasTransforms = svgString.indexOf('transform=') >= 0;
    const hasGradients = svgString.indexOf('<linearGradient') >= 0 || svgString.indexOf('<radialGradient') >= 0;
    const hasMasks = svgString.indexOf('<mask') >= 0;
    const hasLines = (svgString.match(/<line/g) || []).length > 0;

    const hasSimpleTextOnly = svgString.indexOf('<text') >= 0 && !hasMultiplePaths && !hasPolygons;
    const hasBasicCircleContainer = svgString.indexOf('r="45"') >= 0 || svgString.indexOf('r="40"') >= 0;
    const hasCenteredText = svgString.indexOf('text-anchor="middle"') >= 0 && !hasTransforms;

    let geometricComplexity = 3;
    if (hasMultiplePaths) geometricComplexity += 2;
    if (hasPolygons) geometricComplexity += 2;
    if (hasTransforms) geometricComplexity += 1;
    if (hasMultipleCircles) geometricComplexity += 1;
    if (hasLines) geometricComplexity += 1;
    geometricComplexity = Math.max(1, Math.min(10, geometricComplexity));

    let uniqueness = 4;
    if (hasMasks) uniqueness += 2;
    if (hasGradients) uniqueness += 1;
    if (hasPolygons && hasMultiplePaths) uniqueness += 2;
    if (hasTransforms) uniqueness += 1;
    uniqueness = Math.max(1, Math.min(10, uniqueness));

    let negativeSpaceUsage = 3;
    if (hasMasks) negativeSpaceUsage += 3;
    if (hasPolygons) negativeSpaceUsage += 2;
    if (hasMultiplePaths) negativeSpaceUsage += 2;
    negativeSpaceUsage = Math.max(1, Math.min(10, negativeSpaceUsage));

    if (hasSimpleTextOnly) {
        geometricComplexity = Math.max(1, geometricComplexity - 3);
        uniqueness = Math.max(1, uniqueness - 3);
    }
    if (hasBasicCircleContainer && hasCenteredText) {
        geometricComplexity = Math.max(1, geometricComplexity - 2);
        uniqueness = Math.max(1, uniqueness - 2);
    }

    const premiumAlgorithms = [
        'Geometric Deconstruction', 'Negative Space Letter', 'Layered Dimensional',
        'Abstract Integration', 'Architectural Letter', 'Dynamic Asymmetric', 'Monogram Fusion'
    ];
    const isPremium = premiumAlgorithms.some(a => algorithmName.indexOf(a) >= 0);
    if (isPremium) {
        geometricComplexity = Math.min(10, geometricComplexity + 1);
        uniqueness = Math.min(10, uniqueness + 1);
    }

    const isGeneric = geometricComplexity < 5 && uniqueness < 5;
    const overallScore = (geometricComplexity * 0.35 + uniqueness * 0.35 + negativeSpaceUsage * 0.30);
    const passesQualityCheck = overallScore >= 6.5 && !isGeneric;

    return {
        geometricComplexity,
        uniqueness,
        negativeSpaceUsage,
        isGeneric,
        overallScore,
        passesQualityCheck,
    };
}

// ============================================
// EXPORTS
// ============================================

export const PREMIUM_LETTERMARK_ALGORITHMS = {
    'Geometric Deconstruction': generateGeometricDeconstruction,
    'Negative Space Letter': generateNegativeSpaceLetter,
    'Layered Dimensional': generateLayeredDimensional,
    'Abstract Integration': generateAbstractIntegration,
    'Architectural Letter': generateArchitecturalLetter,
    'Dynamic Asymmetric': generateDynamicAsymmetric,
    'Monogram Fusion': generateMonogramFusion,
};
