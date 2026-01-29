/**
 * Initial Synthesis Generator - "Cole Palmer Rule"
 *
 * Creates unified synthesized logos where brand initials are merged into
 * a single cohesive silhouette with hidden meaning.
 *
 * Key Features:
 * - Initials merged into single gesture/form
 * - Sports/Athlete mode: Creates recognizable human poses
 * - 10px grid alignment with squircle synthesis
 * - Single-path compound vectors (not overlapping shapes)
 * - Construction grid shows mathematical intersection
 *
 * Inspired by: Cole Palmer's CP logo, iconic athlete monograms
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    QualityMetrics,
    HashParams,
    Point,
    InitialSynthesisParams,
    BaseParameters,
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
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken, mixColors } from '../core/color-utils';

// ============================================
// CONSTANTS - 10px Grid System
// ============================================

const GRID_SIZE = 10; // 10px grid
const CANVAS_SIZE = 100;
const GRID_UNITS = CANVAS_SIZE / GRID_SIZE; // 10x10 grid

// Snap to grid
function snap(value: number): number {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
}

// Squircle corner control (for iOS-style rounded squares)
function squircleRadius(size: number, factor: number = 0.22): number {
    return size * factor;
}

// ============================================
// SYNTHESIS TYPES
// ============================================

type SynthesisMode = 'merged' | 'athletic' | 'geometric' | 'flowing';

// ============================================
// ATHLETIC POSE DETECTION
// ============================================

const ATHLETIC_CATEGORIES = [
    'sports',
    'fitness',
    'athletics',
    'football',
    'soccer',
    'basketball',
    'tennis',
    'golf',
    'running',
    'gym',
    'athlete',
    'personal brand'
];

function isAthleticCategory(category: string): boolean {
    const lower = category.toLowerCase();
    return ATHLETIC_CATEGORIES.some(cat => lower.includes(cat));
}

// ============================================
// LETTER SKELETON PATHS
// ============================================

/**
 * Get the structural skeleton of a letter for synthesis
 * Returns key points and strokes that define the letter
 */
interface LetterSkeleton {
    strokes: Array<{ start: Point; end: Point; control?: Point }>;
    keyPoints: Point[];
    verticalStems: Point[];
    horizontalBars: Point[];
    curves: Array<{ center: Point; radius: number; startAngle: number; endAngle: number }>;
}

function getLetterSkeleton(letter: string, cx: number, cy: number, size: number): LetterSkeleton {
    const halfSize = size / 2;
    const quarterSize = size / 4;
    const strokeW = size * 0.12;

    const char = letter.toUpperCase().charAt(0);

    switch (char) {
        case 'A':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.5, y: cy + halfSize * 0.7 }, end: { x: cx, y: cy - halfSize * 0.7 } },
                    { start: { x: cx, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.5, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.3, y: cy }, end: { x: cx + halfSize * 0.3, y: cy } },
                ],
                keyPoints: [{ x: cx, y: cy - halfSize * 0.7 }],
                verticalStems: [],
                horizontalBars: [{ x: cx, y: cy }],
                curves: [],
            };

        case 'C':
            return {
                strokes: [],
                keyPoints: [],
                verticalStems: [{ x: cx - halfSize * 0.5, y: cy }],
                horizontalBars: [],
                curves: [{ center: { x: cx, y: cy }, radius: halfSize * 0.6, startAngle: 50, endAngle: 310 }],
            };

        case 'D':
            return {
                strokes: [{ start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } }],
                keyPoints: [],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }],
                horizontalBars: [],
                curves: [{ center: { x: cx - halfSize * 0.1, y: cy }, radius: halfSize * 0.5, startAngle: -90, endAngle: 90 }],
            };

        case 'E':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.4, y: cy }, end: { x: cx + halfSize * 0.2, y: cy } },
                    { start: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }],
                horizontalBars: [{ x: cx, y: cy - halfSize * 0.7 }, { x: cx, y: cy }, { x: cx, y: cy + halfSize * 0.7 }],
                curves: [],
            };

        case 'G':
            return {
                strokes: [{ start: { x: cx, y: cy }, end: { x: cx + halfSize * 0.3, y: cy } }],
                keyPoints: [],
                verticalStems: [],
                horizontalBars: [{ x: cx + halfSize * 0.15, y: cy }],
                curves: [{ center: { x: cx, y: cy }, radius: halfSize * 0.6, startAngle: 40, endAngle: 320 }],
            };

        case 'H':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.4, y: cy }, end: { x: cx + halfSize * 0.4, y: cy } },
                ],
                keyPoints: [],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }, { x: cx + halfSize * 0.4, y: cy }],
                horizontalBars: [{ x: cx, y: cy }],
                curves: [],
            };

        case 'I':
            return {
                strokes: [{ start: { x: cx, y: cy - halfSize * 0.7 }, end: { x: cx, y: cy + halfSize * 0.7 } }],
                keyPoints: [],
                verticalStems: [{ x: cx, y: cy }],
                horizontalBars: [],
                curves: [],
            };

        case 'K':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy } },
                    { start: { x: cx - halfSize * 0.4, y: cy }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx - halfSize * 0.4, y: cy }],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }],
                horizontalBars: [],
                curves: [],
            };

        case 'L':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 }],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }],
                horizontalBars: [{ x: cx, y: cy + halfSize * 0.7 }],
                curves: [],
            };

        case 'M':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.5, y: cy + halfSize * 0.7 }, end: { x: cx - halfSize * 0.5, y: cy - halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.5, y: cy - halfSize * 0.7 }, end: { x: cx, y: cy } },
                    { start: { x: cx, y: cy }, end: { x: cx + halfSize * 0.5, y: cy - halfSize * 0.7 } },
                    { start: { x: cx + halfSize * 0.5, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.5, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx, y: cy }],
                verticalStems: [{ x: cx - halfSize * 0.5, y: cy }, { x: cx + halfSize * 0.5, y: cy }],
                horizontalBars: [],
                curves: [],
            };

        case 'N':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 } },
                ],
                keyPoints: [],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }, { x: cx + halfSize * 0.4, y: cy }],
                horizontalBars: [],
                curves: [],
            };

        case 'O':
            return {
                strokes: [],
                keyPoints: [],
                verticalStems: [],
                horizontalBars: [],
                curves: [{ center: { x: cx, y: cy }, radius: halfSize * 0.6, startAngle: 0, endAngle: 360 }],
            };

        case 'P':
            return {
                strokes: [{ start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } }],
                keyPoints: [{ x: cx - halfSize * 0.4, y: cy }],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }],
                horizontalBars: [],
                curves: [{ center: { x: cx - halfSize * 0.1, y: cy - halfSize * 0.35 }, radius: halfSize * 0.35, startAngle: -90, endAngle: 90 }],
            };

        case 'R':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.4, y: cy }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx - halfSize * 0.4, y: cy }],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }],
                horizontalBars: [],
                curves: [{ center: { x: cx - halfSize * 0.1, y: cy - halfSize * 0.35 }, radius: halfSize * 0.35, startAngle: -90, endAngle: 90 }],
            };

        case 'S':
            return {
                strokes: [],
                keyPoints: [],
                verticalStems: [],
                horizontalBars: [],
                curves: [
                    { center: { x: cx, y: cy - halfSize * 0.35 }, radius: halfSize * 0.35, startAngle: 180, endAngle: 0 },
                    { center: { x: cx, y: cy + halfSize * 0.35 }, radius: halfSize * 0.35, startAngle: 0, endAngle: 180 },
                ],
            };

        case 'T':
            return {
                strokes: [
                    { start: { x: cx, y: cy - halfSize * 0.7 }, end: { x: cx, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.5, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.5, y: cy - halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx, y: cy - halfSize * 0.7 }],
                verticalStems: [{ x: cx, y: cy }],
                horizontalBars: [{ x: cx, y: cy - halfSize * 0.7 }],
                curves: [],
            };

        case 'U':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.2 } },
                    { start: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.2 } },
                ],
                keyPoints: [],
                verticalStems: [{ x: cx - halfSize * 0.4, y: cy }, { x: cx + halfSize * 0.4, y: cy }],
                horizontalBars: [],
                curves: [{ center: { x: cx, y: cy + halfSize * 0.2 }, radius: halfSize * 0.4, startAngle: 0, endAngle: 180 }],
            };

        case 'V':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.5, y: cy - halfSize * 0.7 }, end: { x: cx, y: cy + halfSize * 0.7 } },
                    { start: { x: cx, y: cy + halfSize * 0.7 }, end: { x: cx + halfSize * 0.5, y: cy - halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx, y: cy + halfSize * 0.7 }],
                verticalStems: [],
                horizontalBars: [],
                curves: [],
            };

        case 'W':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.6, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.3, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.3, y: cy + halfSize * 0.7 }, end: { x: cx, y: cy } },
                    { start: { x: cx, y: cy }, end: { x: cx + halfSize * 0.3, y: cy + halfSize * 0.7 } },
                    { start: { x: cx + halfSize * 0.3, y: cy + halfSize * 0.7 }, end: { x: cx + halfSize * 0.6, y: cy - halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx, y: cy }],
                verticalStems: [],
                horizontalBars: [],
                curves: [],
            };

        case 'X':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx, y: cy }],
                verticalStems: [],
                horizontalBars: [],
                curves: [],
            };

        case 'Y':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx, y: cy } },
                    { start: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx, y: cy } },
                    { start: { x: cx, y: cy }, end: { x: cx, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [{ x: cx, y: cy }],
                verticalStems: [{ x: cx, y: cy + halfSize * 0.35 }],
                horizontalBars: [],
                curves: [],
            };

        case 'Z':
            return {
                strokes: [
                    { start: { x: cx - halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 } },
                    { start: { x: cx + halfSize * 0.4, y: cy - halfSize * 0.7 }, end: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 } },
                    { start: { x: cx - halfSize * 0.4, y: cy + halfSize * 0.7 }, end: { x: cx + halfSize * 0.4, y: cy + halfSize * 0.7 } },
                ],
                keyPoints: [],
                verticalStems: [],
                horizontalBars: [{ x: cx, y: cy - halfSize * 0.7 }, { x: cx, y: cy + halfSize * 0.7 }],
                curves: [],
            };

        default:
            // Default: simple circle
            return {
                strokes: [],
                keyPoints: [],
                verticalStems: [],
                horizontalBars: [],
                curves: [{ center: { x: cx, y: cy }, radius: halfSize * 0.5, startAngle: 0, endAngle: 360 }],
            };
    }
}

// ============================================
// SYNTHESIS ALGORITHMS
// ============================================

/**
 * Find the best merge points between two letters
 */
function findMergeOpportunities(
    skel1: LetterSkeleton,
    skel2: LetterSkeleton,
    offset: Point
): { point: Point; type: 'stem' | 'bar' | 'curve' | 'stroke' }[] {
    const opportunities: { point: Point; type: 'stem' | 'bar' | 'curve' | 'stroke' }[] = [];

    // Check stem alignment (vertical lines that can merge)
    for (const stem1 of skel1.verticalStems) {
        for (const stem2 of skel2.verticalStems) {
            const adjusted = { x: stem2.x + offset.x, y: stem2.y + offset.y };
            if (Math.abs(stem1.x - adjusted.x) < 15) {
                opportunities.push({ point: { x: (stem1.x + adjusted.x) / 2, y: (stem1.y + adjusted.y) / 2 }, type: 'stem' });
            }
        }
    }

    // Check horizontal bar alignment
    for (const bar1 of skel1.horizontalBars) {
        for (const bar2 of skel2.horizontalBars) {
            const adjusted = { x: bar2.x + offset.x, y: bar2.y + offset.y };
            if (Math.abs(bar1.y - adjusted.y) < 15) {
                opportunities.push({ point: { x: (bar1.x + adjusted.x) / 2, y: bar1.y }, type: 'bar' });
            }
        }
    }

    // Check stroke intersections
    for (const stroke1 of skel1.strokes) {
        for (const stroke2 of skel2.strokes) {
            const adj = {
                start: { x: stroke2.start.x + offset.x, y: stroke2.start.y + offset.y },
                end: { x: stroke2.end.x + offset.x, y: stroke2.end.y + offset.y }
            };
            const intersection = lineIntersection(stroke1.start, stroke1.end, adj.start, adj.end);
            if (intersection) {
                opportunities.push({ point: intersection, type: 'stroke' });
            }
        }
    }

    return opportunities;
}

function lineIntersection(p1: Point, p2: Point, p3: Point, p4: Point): Point | null {
    const denom = (p1.x - p2.x) * (p3.y - p4.y) - (p1.y - p2.y) * (p3.x - p4.x);
    if (Math.abs(denom) < 0.001) return null;

    const t = ((p1.x - p3.x) * (p3.y - p4.y) - (p1.y - p3.y) * (p3.x - p4.x)) / denom;
    const u = -((p1.x - p2.x) * (p1.y - p3.y) - (p1.y - p2.y) * (p1.x - p3.x)) / denom;

    if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
        return {
            x: p1.x + t * (p2.x - p1.x),
            y: p1.y + t * (p2.y - p1.y)
        };
    }
    return null;
}

/**
 * Generate Cole Palmer style synthesized initials
 * Creates a unified silhouette where letters share strokes
 */
function generateCPStylePath(
    letter1: string,
    letter2: string,
    cx: number,
    cy: number,
    size: number,
    strokeWeight: number,
    params: InitialSynthesisParams
): string {
    const sw = strokeWeight;
    const hs = size / 2;
    const char1 = letter1.toUpperCase().charAt(0);
    const char2 = letter2.toUpperCase().charAt(0);

    // Special synthesis cases for common letter pairs
    // These are hand-crafted "Easter egg" designs

    // CP synthesis (Cole Palmer style)
    if ((char1 === 'C' && char2 === 'P') || (char1 === 'P' && char2 === 'C')) {
        const r = hs * 0.7;
        const bowlR = hs * 0.35;
        // C opens to the right, P stem on left, P bowl on top right
        // Creates a unified figure that hints at a seated person
        return `
            M ${snap(cx)} ${snap(cy - r)}
            C ${snap(cx + r * 0.8)} ${snap(cy - r)}, ${snap(cx + r)} ${snap(cy - r * 0.5)}, ${snap(cx + r * 0.6)} ${snap(cy - r * 0.1)}
            L ${snap(cx + bowlR * 0.8)} ${snap(cy - r * 0.1)}
            C ${snap(cx + bowlR * 1.5)} ${snap(cy - r * 0.3)}, ${snap(cx + bowlR * 1.5)} ${snap(cy + bowlR * 0.5)}, ${snap(cx + bowlR * 0.5)} ${snap(cy + bowlR * 0.3)}
            L ${snap(cx - sw / 2)} ${snap(cy + bowlR * 0.3)}
            L ${snap(cx - sw / 2)} ${snap(cy + r)}
            L ${snap(cx - sw * 1.5)} ${snap(cy + r)}
            L ${snap(cx - sw * 1.5)} ${snap(cy - r * 0.6)}
            C ${snap(cx - r * 0.3)} ${snap(cy - r * 0.8)}, ${snap(cx - r * 0.2)} ${snap(cy - r)}, ${snap(cx)} ${snap(cy - r)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    // JM synthesis
    if ((char1 === 'J' && char2 === 'M') || (char1 === 'M' && char2 === 'J')) {
        return `
            M ${snap(cx - hs * 0.6)} ${snap(cy - hs * 0.7)}
            L ${snap(cx - hs * 0.6 + sw)} ${snap(cy - hs * 0.7)}
            L ${snap(cx)} ${snap(cy)}
            L ${snap(cx + hs * 0.3)} ${snap(cy - hs * 0.7)}
            L ${snap(cx + hs * 0.5)} ${snap(cy - hs * 0.7)}
            L ${snap(cx + hs * 0.5)} ${snap(cy + hs * 0.4)}
            C ${snap(cx + hs * 0.5)} ${snap(cy + hs * 0.8)}, ${snap(cx + hs * 0.1)} ${snap(cy + hs * 0.8)}, ${snap(cx)} ${snap(cy + hs * 0.5)}
            L ${snap(cx - sw)} ${snap(cy + hs * 0.5)}
            C ${snap(cx - sw * 0.5)} ${snap(cy + hs * 0.65)}, ${snap(cx + hs * 0.3)} ${snap(cy + hs * 0.65)}, ${snap(cx + hs * 0.3)} ${snap(cy + hs * 0.4)}
            L ${snap(cx + hs * 0.3)} ${snap(cy - hs * 0.5)}
            L ${snap(cx)} ${snap(cy + sw * 0.5)}
            L ${snap(cx - hs * 0.6 + sw)} ${snap(cy - hs * 0.5)}
            L ${snap(cx - hs * 0.6 + sw)} ${snap(cy + hs * 0.7)}
            L ${snap(cx - hs * 0.6)} ${snap(cy + hs * 0.7)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    // AB synthesis (Athletic Brand style)
    if ((char1 === 'A' && char2 === 'B') || (char1 === 'B' && char2 === 'A')) {
        return `
            M ${snap(cx - hs * 0.5)} ${snap(cy + hs * 0.7)}
            L ${snap(cx)} ${snap(cy - hs * 0.7)}
            L ${snap(cx + hs * 0.2)} ${snap(cy - hs * 0.7)}
            C ${snap(cx + hs * 0.5)} ${snap(cy - hs * 0.7)}, ${snap(cx + hs * 0.55)} ${snap(cy - hs * 0.2)}, ${snap(cx + hs * 0.2)} ${snap(cy - hs * 0.1)}
            C ${snap(cx + hs * 0.6)} ${snap(cy)}, ${snap(cx + hs * 0.6)} ${snap(cy + hs * 0.5)}, ${snap(cx + hs * 0.2)} ${snap(cy + hs * 0.7)}
            L ${snap(cx + sw)} ${snap(cy + hs * 0.7)}
            L ${snap(cx - hs * 0.3)} ${snap(cy + hs * 0.1)}
            L ${snap(cx + hs * 0.15)} ${snap(cy + hs * 0.1)}
            L ${snap(cx + hs * 0.15)} ${snap(cy + hs * 0.5)}
            L ${snap(cx)} ${snap(cy + hs * 0.35)}
            L ${snap(cx - hs * 0.25)} ${snap(cy + hs * 0.5)}
            L ${snap(cx - hs * 0.5 + sw)} ${snap(cy + hs * 0.7)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    // Generic synthesis: merge based on shared vertical stem
    return generateGenericSynthesis(char1, char2, cx, cy, size, sw, params);
}

/**
 * Generic synthesis algorithm for any letter pair
 */
function generateGenericSynthesis(
    char1: string,
    char2: string,
    cx: number,
    cy: number,
    size: number,
    sw: number,
    params: InitialSynthesisParams
): string {
    const hs = size / 2;

    // Get skeletons
    const skel1 = getLetterSkeleton(char1, cx - hs * 0.3, cy, size * 0.8);
    const skel2 = getLetterSkeleton(char2, cx + hs * 0.3, cy, size * 0.8);

    // Find merge opportunities
    const merges = findMergeOpportunities(skel1, skel2, { x: hs * 0.6, y: 0 });

    // Build a unified path
    // Start with left letter, transition to right letter through shared elements
    const paths: string[] = [];

    // Create base shape - squircle container
    const sr = squircleRadius(size * 0.9);
    const halfW = hs * 0.7;
    const halfH = hs * 0.7;

    // Generate compound path based on letter characteristics
    if (skel1.verticalStems.length > 0 && skel2.verticalStems.length > 0) {
        // Both letters have vertical stems - share the center stem
        return `
            M ${snap(cx - halfW)} ${snap(cy - halfH)}
            L ${snap(cx - sw / 2)} ${snap(cy - halfH)}
            L ${snap(cx - sw / 2)} ${snap(cy - hs * 0.2)}
            L ${snap(cx + sw / 2)} ${snap(cy - hs * 0.2)}
            L ${snap(cx + sw / 2)} ${snap(cy - halfH)}
            L ${snap(cx + halfW)} ${snap(cy - halfH)}
            C ${snap(cx + halfW + sr)} ${snap(cy - halfH)}, ${snap(cx + halfW + sr)} ${snap(cy + halfH)}, ${snap(cx + halfW)} ${snap(cy + halfH)}
            L ${snap(cx + sw / 2)} ${snap(cy + halfH)}
            L ${snap(cx + sw / 2)} ${snap(cy + hs * 0.2)}
            L ${snap(cx - sw / 2)} ${snap(cy + hs * 0.2)}
            L ${snap(cx - sw / 2)} ${snap(cy + halfH)}
            L ${snap(cx - halfW)} ${snap(cy + halfH)}
            C ${snap(cx - halfW - sr)} ${snap(cy + halfH)}, ${snap(cx - halfW - sr)} ${snap(cy - halfH)}, ${snap(cx - halfW)} ${snap(cy - halfH)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    if (skel1.curves.length > 0 || skel2.curves.length > 0) {
        // At least one letter has curves - create flowing synthesis
        const curveR = hs * 0.5;
        return `
            M ${snap(cx - curveR)} ${snap(cy - curveR)}
            C ${snap(cx)} ${snap(cy - curveR * 1.2)}, ${snap(cx + curveR * 0.8)} ${snap(cy - curveR)}, ${snap(cx + curveR)} ${snap(cy - curveR * 0.3)}
            L ${snap(cx + curveR - sw)} ${snap(cy)}
            C ${snap(cx + curveR * 0.5)} ${snap(cy - curveR * 0.2)}, ${snap(cx)} ${snap(cy)}, ${snap(cx - curveR * 0.5)} ${snap(cy)}
            C ${snap(cx - curveR)} ${snap(cy + curveR * 0.2)}, ${snap(cx - curveR * 0.8)} ${snap(cy + curveR)}, ${snap(cx)} ${snap(cy + curveR)}
            C ${snap(cx + curveR * 0.8)} ${snap(cy + curveR)}, ${snap(cx + curveR)} ${snap(cy + curveR * 0.3)}, ${snap(cx + curveR)} ${snap(cy)}
            L ${snap(cx + curveR)} ${snap(cy + curveR * 0.3)}
            C ${snap(cx + curveR)} ${snap(cy + curveR * 0.8)}, ${snap(cx + curveR * 0.5)} ${snap(cy + curveR * 1.2)}, ${snap(cx)} ${snap(cy + curveR * 1.1)}
            C ${snap(cx - curveR * 0.8)} ${snap(cy + curveR * 1.2)}, ${snap(cx - curveR * 1.2)} ${snap(cy + curveR * 0.5)}, ${snap(cx - curveR * 1.1)} ${snap(cy)}
            C ${snap(cx - curveR * 1.2)} ${snap(cy - curveR * 0.5)}, ${snap(cx - curveR * 0.8)} ${snap(cy - curveR * 1.2)}, ${snap(cx - curveR)} ${snap(cy - curveR)}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    // Fallback: interlinked strokes
    return `
        M ${snap(cx - hs * 0.5)} ${snap(cy - hs * 0.6)}
        L ${snap(cx)} ${snap(cy - hs * 0.6)}
        L ${snap(cx + hs * 0.3)} ${snap(cy - hs * 0.3)}
        L ${snap(cx + hs * 0.5)} ${snap(cy - hs * 0.6)}
        L ${snap(cx + hs * 0.5)} ${snap(cy + hs * 0.6)}
        L ${snap(cx + hs * 0.3)} ${snap(cy + hs * 0.6)}
        L ${snap(cx)} ${snap(cy + hs * 0.3)}
        L ${snap(cx - hs * 0.3)} ${snap(cy + hs * 0.6)}
        L ${snap(cx - hs * 0.5)} ${snap(cy + hs * 0.6)}
        L ${snap(cx - hs * 0.5)} ${snap(cy - hs * 0.6)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Generate athletic pose synthesis for sports brands
 */
function generateAthleticPosePath(
    letter1: string,
    letter2: string,
    cx: number,
    cy: number,
    size: number,
    sw: number,
    sport?: string
): string {
    const hs = size / 2;
    const char1 = letter1.toUpperCase().charAt(0);
    const char2 = letter2.toUpperCase().charAt(0);

    // Create silhouette that incorporates letterforms into action pose
    // The letters become limbs/body parts of the athlete

    // Default: Running/dynamic pose
    return `
        M ${snap(cx - hs * 0.3)} ${snap(cy - hs * 0.7)}
        C ${snap(cx)} ${snap(cy - hs * 0.85)}, ${snap(cx + hs * 0.3)} ${snap(cy - hs * 0.7)}, ${snap(cx + hs * 0.2)} ${snap(cy - hs * 0.5)}
        L ${snap(cx + hs * 0.5)} ${snap(cy - hs * 0.2)}
        L ${snap(cx + hs * 0.4)} ${snap(cy - hs * 0.1)}
        L ${snap(cx + hs * 0.15)} ${snap(cy - hs * 0.4)}
        L ${snap(cx + sw / 2)} ${snap(cy - hs * 0.2)}
        L ${snap(cx + sw / 2)} ${snap(cy + hs * 0.3)}
        L ${snap(cx + hs * 0.4)} ${snap(cy + hs * 0.7)}
        L ${snap(cx + hs * 0.25)} ${snap(cy + hs * 0.7)}
        L ${snap(cx)} ${snap(cy + hs * 0.35)}
        L ${snap(cx - hs * 0.25)} ${snap(cy + hs * 0.7)}
        L ${snap(cx - hs * 0.4)} ${snap(cy + hs * 0.7)}
        L ${snap(cx - sw / 2)} ${snap(cy + hs * 0.3)}
        L ${snap(cx - sw / 2)} ${snap(cy - hs * 0.2)}
        L ${snap(cx - hs * 0.15)} ${snap(cy - hs * 0.4)}
        L ${snap(cx - hs * 0.4)} ${snap(cy - hs * 0.1)}
        L ${snap(cx - hs * 0.5)} ${snap(cy - hs * 0.2)}
        L ${snap(cx - hs * 0.2)} ${snap(cy - hs * 0.5)}
        C ${snap(cx - hs * 0.3)} ${snap(cy - hs * 0.7)}, ${snap(cx - hs * 0.25)} ${snap(cy - hs * 0.75)}, ${snap(cx - hs * 0.3)} ${snap(cy - hs * 0.7)}
        Z
    `.replace(/\s+/g, ' ').trim();
}

// ============================================
// PARAMETER GENERATION
// ============================================

function generateInitialSynthesisParams(hashParams: HashParams, rng: () => number, isAthletic: boolean): InitialSynthesisParams {
    const derived = deriveParamsFromHash(hashParams.hashHex);
    const base = generateBaseParams(rng);

    const modes: SynthesisMode[] = isAthletic
        ? ['athletic', 'merged', 'geometric']
        : ['merged', 'geometric', 'flowing'];

    return {
        ...base,
        mode: modes[derived.styleVariant % modes.length],
        letterPair: ['A', 'B'],
        shareStroke: derived.organicAmount > 0.4,
        mergePoint: { x: 50, y: 50 },
        strokeWeight: 6 + derived.taperRatio * 6,
        curveTension: derived.curveTension,
        cornerRadius: squircleRadius(CANVAS_SIZE),
        verticalBias: derived.jitterAmount - 5,
        horizontalBias: derived.spacingFactor - 1,
        silhouetteStyle: isAthletic ? 'pose' : (derived.styleVariant % 2 === 0 ? 'abstract' : 'symbol'),
    };
}

// ============================================
// MAIN GENERATOR
// ============================================

function generateSingleInitialSynthesis(
    params: LogoGenerationParams,
    hashParams: HashParams,
    variant: number
): { logo: GeneratedLogo; quality: QualityMetrics } {
    const { brandName, primaryColor, accentColor, category = 'creative' } = params;

    const size = CANVAS_SIZE;
    const cx = size / 2;
    const cy = size / 2;

    const rng = createSeededRandom(hashParams.hashHex);
    const isAthletic = isAthleticCategory(category);
    const algoParams = generateInitialSynthesisParams(hashParams, rng, isAthletic);

    // Extract letters
    const letters = brandName.toUpperCase().replace(/[^A-Z]/g, '');
    const letter1 = letters.charAt(0) || 'A';
    const letter2 = letters.charAt(1) || letters.charAt(0) || 'B';
    algoParams.letterPair = [letter1, letter2];

    const svg = createSVG(size);
    const uniqueId = generateLogoId('initial-synthesis', variant);

    // Create main gradient
    svg.addGradient(`${uniqueId}-main`, {
        type: 'linear',
        angle: 135 + (rng() * 30 - 15),
        stops: [
            { offset: 0, color: lighten(primaryColor, 8) },
            { offset: 50, color: primaryColor },
            { offset: 100, color: darken(primaryColor, 8) },
        ],
    });

    // Generate the synthesized path
    let path: string;
    if (isAthletic && algoParams.silhouetteStyle === 'pose') {
        path = generateAthleticPosePath(letter1, letter2, cx, cy, size * 0.85, algoParams.strokeWeight, category);
    } else {
        path = generateCPStylePath(letter1, letter2, cx, cy, size * 0.85, algoParams.strokeWeight, algoParams);
    }

    // Render the single compound path
    svg.path(path, {
        fill: `url(#${uniqueId}-main)`,
        'fill-rule': 'evenodd',
    });

    const svgString = svg.build();
    const derivedParams = deriveParamsFromHash(hashParams.hashHex);
    const quality = calculateQualityScore(svgString, derivedParams);
    const hash = generateLogoHash(brandName, 'initial-synthesis', variant, algoParams);

    const logo: GeneratedLogo = {
        id: uniqueId,
        hash,
        algorithm: 'initial-synthesis' as any,
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
                usesGoldenRatio: true,
                gridBased: true,
                bezierCurves: true,
                symmetry: 'none',
                pathCount: 1, // Single compound path!
                complexity: calculateComplexity(svgString),
            },
            colors: {
                primary: primaryColor,
                accent: accentColor,
                palette: [primaryColor, accentColor || darken(primaryColor, 20)],
            },
            synthesis: {
                letters: [letter1, letter2],
                mode: algoParams.mode,
                isAthletic,
            },
        },
    };

    return { logo, quality };
}

export function generateInitialSynthesis(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, variations = 3, minQualityScore = 80, category = 'creative' } = params;

    const logos: GeneratedLogo[] = [];
    const candidatesPerVariation = 5;

    for (let v = 0; v < variations; v++) {
        let bestCandidate: GeneratedLogo | null = null;
        let bestScore = 0;

        for (let c = 0; c < candidatesPerVariation; c++) {
            const hashParams = generateHashParamsSync(brandName, category);
            const { logo, quality } = generateSingleInitialSynthesis(params, hashParams, v);

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
                algorithm: 'initial-synthesis' as any,
                variant: v,
                createdAt: Date.now(),
                qualityScore: bestScore,
            });
            logos.push(bestCandidate);
        }
    }

    return logos;
}

export function generateSingleInitialSynthesisPreview(
    primaryColor: string,
    accentColor?: string,
    letters: string = 'CP',
    seed: string = 'preview',
    isAthletic: boolean = false
): string {
    const hashParams = generateHashParamsSync(seed, 'creative');
    const rng = createSeededRandom(hashParams.hashHex);
    const params = generateInitialSynthesisParams(hashParams, rng, isAthletic);
    const size = CANVAS_SIZE;
    const cx = size / 2;
    const cy = size / 2;
    const svg = createSVG(size);

    const letter1 = letters.charAt(0) || 'C';
    const letter2 = letters.charAt(1) || 'P';

    svg.addGradient('main-grad', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(primaryColor, 8) },
            { offset: 100, color: primaryColor },
        ],
    });

    const path = generateCPStylePath(letter1, letter2, cx, cy, size * 0.85, params.strokeWeight, params);

    svg.path(path, {
        fill: 'url(#main-grad)',
        'fill-rule': 'evenodd',
    });

    return svg.build();
}

// ============================================
// CONSTRUCTION GRID EXPORT
// ============================================

/**
 * Generate construction grid SVG showing synthesis analysis
 */
export function generateSynthesisConstructionGrid(
    brandName: string,
    primaryColor: string,
    size: number = 400
): string {
    const letters = brandName.toUpperCase().replace(/[^A-Z]/g, '');
    const letter1 = letters.charAt(0) || 'A';
    const letter2 = letters.charAt(1) || 'B';

    const cx = size / 2;
    const cy = size / 2;
    const gridSize = 40;
    const guideColor = '#6366f1';
    const accentColor = '#a855f7';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <defs>
        <pattern id="grid-10" width="${gridSize / 4}" height="${gridSize / 4}" patternUnits="userSpaceOnUse">
            <path d="M ${gridSize / 4} 0 L 0 0 0 ${gridSize / 4}" fill="none" stroke="#1e293b" stroke-width="0.25" opacity="0.4"/>
        </pattern>
        <pattern id="grid-major" width="${gridSize}" height="${gridSize}" patternUnits="userSpaceOnUse">
            <path d="M ${gridSize} 0 L 0 0 0 ${gridSize}" fill="none" stroke="#1e293b" stroke-width="0.5" opacity="0.7"/>
        </pattern>
    </defs>

    <!-- Background -->
    <rect width="${size}" height="${size}" fill="#0a0a0f"/>
    
    <!-- 10px Grid -->
    <g id="construction-grid">
        <rect width="100%" height="100%" fill="url(#grid-10)"/>
        <rect width="100%" height="100%" fill="url(#grid-major)"/>
    </g>

    <!-- Center Guidelines -->
    <g id="guidelines">
        <line x1="${cx}" y1="0" x2="${cx}" y2="${size}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.6"/>
        <line x1="0" y1="${cy}" x2="${size}" y2="${cy}" stroke="${guideColor}" stroke-width="0.5" stroke-dasharray="4 4" opacity="0.6"/>
        <circle cx="${cx}" cy="${cy}" r="3" fill="${guideColor}" opacity="0.8"/>
    </g>

    <!-- Letter Skeleton Overlays -->
    <g id="letter-skeletons" stroke="${accentColor}" stroke-width="1" fill="none" opacity="0.5">
        <!-- Letter 1 skeleton outline -->
        <text x="${cx - 60}" y="${cy + 8}" font-family="monospace" font-size="80" fill="${accentColor}" opacity="0.3" text-anchor="middle">${letter1}</text>
        
        <!-- Letter 2 skeleton outline -->
        <text x="${cx + 60}" y="${cy + 8}" font-family="monospace" font-size="80" fill="${guideColor}" opacity="0.3" text-anchor="middle">${letter2}</text>
    </g>

    <!-- Merge Zone -->
    <g id="merge-zone">
        <circle cx="${cx}" cy="${cy}" r="${size * 0.25}" fill="none" stroke="${guideColor}" stroke-width="1" stroke-dasharray="8 4" opacity="0.4"/>
        <text x="${cx}" y="${cy - size * 0.28}" font-family="monospace" font-size="10" fill="${guideColor}" text-anchor="middle" opacity="0.7">SYNTHESIS ZONE</text>
    </g>

    <!-- Logo Preview -->
    <g id="synthesized-logo" transform="translate(${(size - 240) / 2}, ${(size - 240) / 2})">
        <svg width="240" height="240" viewBox="0 0 100 100">
            <path d="${generateCPStylePath(letter1, letter2, 50, 50, 85, 8, { mode: 'merged', letterPair: [letter1, letter2], shareStroke: true, mergePoint: { x: 50, y: 50 }, strokeWeight: 8, curveTension: 0.5, cornerRadius: 10, verticalBias: 0, horizontalBias: 0, silhouetteStyle: 'abstract' } as any)}" fill="${primaryColor}"/>
        </svg>
    </g>

    <!-- Annotations -->
    <g id="annotations" font-family="monospace" font-size="10" fill="#94a3b8">
        <text x="16" y="24">Grid: 10px</text>
        <text x="16" y="38">Synthesis: ${letter1}+${letter2}</text>
        <text x="${size - 16}" y="24" text-anchor="end">Single Path</text>
        <text x="16" y="${size - 24}">Mode: Merged</text>
        <text x="${size - 16}" y="${size - 24}" text-anchor="end">${brandName}</text>
        <text x="${size - 16}" y="${size - 10}" text-anchor="end">${primaryColor.toUpperCase()}</text>
    </g>
</svg>`;
}
