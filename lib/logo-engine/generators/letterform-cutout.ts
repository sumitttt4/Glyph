/**
 * Letterform Cutout Generator (Notion-style)
 *
 * Creates letter within geometric frame with cutout effects
 * Inspired by Notion's clean lettermark design
 * 20+ adjustable parameters for infinite variations
 */

import {
    GeneratedLogo,
    LogoGenerationParams,
    LetterformCutoutParams,
    Point,
} from '../types';
import {
    createSeededRandom,
    generateBaseParams,
    generateLogoHash,
    generateLogoId,
    addNoise,
    PHI,
    calculateComplexity,
    storeHash,
} from '../core/parametric-engine';
import { createSVG } from '../core/svg-builder';
import { lighten, darken } from '../core/color-utils';

// ============================================
// LETTER PATH DEFINITIONS (Bezier-based)
// ============================================

const LETTER_PATHS: Record<string, (scale: number, weight: number, cx: number, cy: number) => string> = {
    A: (s, w, cx, cy) => {
        const hw = w * 0.5;
        return `M ${cx - s * 0.4} ${cy + s * 0.4} L ${cx} ${cy - s * 0.4} L ${cx + s * 0.4} ${cy + s * 0.4}
                M ${cx - s * 0.2} ${cy + s * 0.1} L ${cx + s * 0.2} ${cy + s * 0.1}`;
    },
    B: (s, w, cx, cy) => {
        const r1 = s * 0.2;
        const r2 = s * 0.22;
        return `M ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4}
                M ${cx - s * 0.25} ${cy - s * 0.4}
                C ${cx + s * 0.2} ${cy - s * 0.4}, ${cx + s * 0.25} ${cy - s * 0.1}, ${cx - s * 0.1} ${cy}
                C ${cx + s * 0.3} ${cy}, ${cx + s * 0.3} ${cy + s * 0.4}, ${cx - s * 0.25} ${cy + s * 0.4}`;
    },
    C: (s, w, cx, cy) => {
        return `M ${cx + s * 0.3} ${cy - s * 0.25}
                C ${cx + s * 0.1} ${cy - s * 0.45}, ${cx - s * 0.4} ${cy - s * 0.4}, ${cx - s * 0.35} ${cy}
                C ${cx - s * 0.4} ${cy + s * 0.4}, ${cx + s * 0.1} ${cy + s * 0.45}, ${cx + s * 0.3} ${cy + s * 0.25}`;
    },
    D: (s, w, cx, cy) => {
        return `M ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4}
                M ${cx - s * 0.25} ${cy - s * 0.4}
                C ${cx + s * 0.4} ${cy - s * 0.4}, ${cx + s * 0.4} ${cy + s * 0.4}, ${cx - s * 0.25} ${cy + s * 0.4}`;
    },
    E: (s, w, cx, cy) => {
        return `M ${cx + s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4} L ${cx + s * 0.25} ${cy + s * 0.4}
                M ${cx - s * 0.25} ${cy} L ${cx + s * 0.15} ${cy}`;
    },
    F: (s, w, cx, cy) => {
        return `M ${cx + s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4}
                M ${cx - s * 0.25} ${cy} L ${cx + s * 0.15} ${cy}`;
    },
    G: (s, w, cx, cy) => {
        return `M ${cx + s * 0.3} ${cy - s * 0.25}
                C ${cx + s * 0.1} ${cy - s * 0.45}, ${cx - s * 0.4} ${cy - s * 0.4}, ${cx - s * 0.35} ${cy}
                C ${cx - s * 0.4} ${cy + s * 0.4}, ${cx + s * 0.1} ${cy + s * 0.45}, ${cx + s * 0.3} ${cy + s * 0.2}
                L ${cx + s * 0.3} ${cy} L ${cx} ${cy}`;
    },
    H: (s, w, cx, cy) => {
        return `M ${cx - s * 0.3} ${cy - s * 0.4} L ${cx - s * 0.3} ${cy + s * 0.4}
                M ${cx + s * 0.3} ${cy - s * 0.4} L ${cx + s * 0.3} ${cy + s * 0.4}
                M ${cx - s * 0.3} ${cy} L ${cx + s * 0.3} ${cy}`;
    },
    I: (s, w, cx, cy) => {
        return `M ${cx} ${cy - s * 0.4} L ${cx} ${cy + s * 0.4}
                M ${cx - s * 0.15} ${cy - s * 0.4} L ${cx + s * 0.15} ${cy - s * 0.4}
                M ${cx - s * 0.15} ${cy + s * 0.4} L ${cx + s * 0.15} ${cy + s * 0.4}`;
    },
    J: (s, w, cx, cy) => {
        return `M ${cx + s * 0.15} ${cy - s * 0.4} L ${cx + s * 0.15} ${cy + s * 0.2}
                C ${cx + s * 0.15} ${cy + s * 0.45}, ${cx - s * 0.25} ${cy + s * 0.45}, ${cx - s * 0.25} ${cy + s * 0.2}`;
    },
    K: (s, w, cx, cy) => {
        return `M ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4}
                M ${cx + s * 0.3} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy} L ${cx + s * 0.3} ${cy + s * 0.4}`;
    },
    L: (s, w, cx, cy) => {
        return `M ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4} L ${cx + s * 0.25} ${cy + s * 0.4}`;
    },
    M: (s, w, cx, cy) => {
        return `M ${cx - s * 0.35} ${cy + s * 0.4} L ${cx - s * 0.35} ${cy - s * 0.4} L ${cx} ${cy + s * 0.1} L ${cx + s * 0.35} ${cy - s * 0.4} L ${cx + s * 0.35} ${cy + s * 0.4}`;
    },
    N: (s, w, cx, cy) => {
        return `M ${cx - s * 0.3} ${cy + s * 0.4} L ${cx - s * 0.3} ${cy - s * 0.4} L ${cx + s * 0.3} ${cy + s * 0.4} L ${cx + s * 0.3} ${cy - s * 0.4}`;
    },
    O: (s, w, cx, cy) => {
        const r = s * 0.38;
        return `M ${cx} ${cy - r}
                C ${cx + r * 1.1} ${cy - r}, ${cx + r * 1.1} ${cy + r}, ${cx} ${cy + r}
                C ${cx - r * 1.1} ${cy + r}, ${cx - r * 1.1} ${cy - r}, ${cx} ${cy - r} Z`;
    },
    P: (s, w, cx, cy) => {
        return `M ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4}
                M ${cx - s * 0.25} ${cy - s * 0.4}
                C ${cx + s * 0.35} ${cy - s * 0.4}, ${cx + s * 0.35} ${cy + s * 0.05}, ${cx - s * 0.25} ${cy + s * 0.05}`;
    },
    Q: (s, w, cx, cy) => {
        const r = s * 0.35;
        return `M ${cx} ${cy - r}
                C ${cx + r * 1.1} ${cy - r}, ${cx + r * 1.1} ${cy + r}, ${cx} ${cy + r}
                C ${cx - r * 1.1} ${cy + r}, ${cx - r * 1.1} ${cy - r}, ${cx} ${cy - r} Z
                M ${cx + s * 0.1} ${cy + s * 0.15} L ${cx + s * 0.35} ${cy + s * 0.45}`;
    },
    R: (s, w, cx, cy) => {
        return `M ${cx - s * 0.25} ${cy - s * 0.4} L ${cx - s * 0.25} ${cy + s * 0.4}
                M ${cx - s * 0.25} ${cy - s * 0.4}
                C ${cx + s * 0.3} ${cy - s * 0.4}, ${cx + s * 0.3} ${cy + s * 0.05}, ${cx - s * 0.25} ${cy + s * 0.05}
                M ${cx - s * 0.05} ${cy + s * 0.05} L ${cx + s * 0.3} ${cy + s * 0.4}`;
    },
    S: (s, w, cx, cy) => {
        return `M ${cx + s * 0.25} ${cy - s * 0.3}
                C ${cx + s * 0.25} ${cy - s * 0.45}, ${cx - s * 0.3} ${cy - s * 0.45}, ${cx - s * 0.25} ${cy - s * 0.2}
                C ${cx - s * 0.2} ${cy}, ${cx + s * 0.2} ${cy}, ${cx + s * 0.25} ${cy + s * 0.2}
                C ${cx + s * 0.3} ${cy + s * 0.45}, ${cx - s * 0.25} ${cy + s * 0.45}, ${cx - s * 0.25} ${cy + s * 0.3}`;
    },
    T: (s, w, cx, cy) => {
        return `M ${cx - s * 0.3} ${cy - s * 0.4} L ${cx + s * 0.3} ${cy - s * 0.4}
                M ${cx} ${cy - s * 0.4} L ${cx} ${cy + s * 0.4}`;
    },
    U: (s, w, cx, cy) => {
        return `M ${cx - s * 0.3} ${cy - s * 0.4} L ${cx - s * 0.3} ${cy + s * 0.15}
                C ${cx - s * 0.3} ${cy + s * 0.45}, ${cx + s * 0.3} ${cy + s * 0.45}, ${cx + s * 0.3} ${cy + s * 0.15}
                L ${cx + s * 0.3} ${cy - s * 0.4}`;
    },
    V: (s, w, cx, cy) => {
        return `M ${cx - s * 0.35} ${cy - s * 0.4} L ${cx} ${cy + s * 0.4} L ${cx + s * 0.35} ${cy - s * 0.4}`;
    },
    W: (s, w, cx, cy) => {
        return `M ${cx - s * 0.4} ${cy - s * 0.4} L ${cx - s * 0.2} ${cy + s * 0.4} L ${cx} ${cy - s * 0.1} L ${cx + s * 0.2} ${cy + s * 0.4} L ${cx + s * 0.4} ${cy - s * 0.4}`;
    },
    X: (s, w, cx, cy) => {
        return `M ${cx - s * 0.3} ${cy - s * 0.4} L ${cx + s * 0.3} ${cy + s * 0.4}
                M ${cx + s * 0.3} ${cy - s * 0.4} L ${cx - s * 0.3} ${cy + s * 0.4}`;
    },
    Y: (s, w, cx, cy) => {
        return `M ${cx - s * 0.3} ${cy - s * 0.4} L ${cx} ${cy} L ${cx + s * 0.3} ${cy - s * 0.4}
                M ${cx} ${cy} L ${cx} ${cy + s * 0.4}`;
    },
    Z: (s, w, cx, cy) => {
        return `M ${cx - s * 0.3} ${cy - s * 0.4} L ${cx + s * 0.3} ${cy - s * 0.4} L ${cx - s * 0.3} ${cy + s * 0.4} L ${cx + s * 0.3} ${cy + s * 0.4}`;
    },
};

// ============================================
// DEFAULT PARAMETERS
// ============================================

function generateLetterformParams(rng: () => number): LetterformCutoutParams {
    const base = generateBaseParams(rng);
    const shapes: Array<'square' | 'circle' | 'rounded' | 'hexagon'> = ['square', 'circle', 'rounded', 'hexagon'];

    return {
        ...base,
        frameShape: shapes[Math.floor(rng() * shapes.length)],
        frameThickness: 3 + rng() * 8,                    // 3-11
        letterScale: 0.5 + rng() * 0.35,                  // 0.5-0.85
        letterWeight: 2 + rng() * 5,                      // 2-7
        cutoutDepth: 0.3 + rng() * 0.6,                   // 0.3-0.9
        shadowOffset: rng() * 6,                          // 0-6
        innerPadding: 8 + rng() * 12,                     // 8-20
        frameRotation: rng() * 30,                        // 0-30
    };
}

// ============================================
// FRAME GENERATION
// ============================================

function generateFramePath(
    shape: LetterformCutoutParams['frameShape'],
    size: number,
    padding: number,
    thickness: number,
    rotation: number
): { outer: string; inner: string } {
    const cx = size / 2;
    const cy = size / 2;
    const outerSize = size - padding * 2;
    const innerSize = outerSize - thickness * 2;

    const rotRad = (rotation * Math.PI) / 180;
    const cosR = Math.cos(rotRad);
    const sinR = Math.sin(rotRad);

    const rotatePoint = (x: number, y: number): Point => ({
        x: cx + (x - cx) * cosR - (y - cy) * sinR,
        y: cy + (x - cx) * sinR + (y - cy) * cosR,
    });

    switch (shape) {
        case 'circle': {
            const outerR = outerSize / 2;
            const innerR = innerSize / 2;
            return {
                outer: `M ${cx} ${cy - outerR}
                        C ${cx + outerR * 1.1} ${cy - outerR}, ${cx + outerR * 1.1} ${cy + outerR}, ${cx} ${cy + outerR}
                        C ${cx - outerR * 1.1} ${cy + outerR}, ${cx - outerR * 1.1} ${cy - outerR}, ${cx} ${cy - outerR} Z`,
                inner: `M ${cx} ${cy - innerR}
                        C ${cx + innerR * 1.1} ${cy - innerR}, ${cx + innerR * 1.1} ${cy + innerR}, ${cx} ${cy + innerR}
                        C ${cx - innerR * 1.1} ${cy + innerR}, ${cx - innerR * 1.1} ${cy - innerR}, ${cx} ${cy - innerR} Z`,
            };
        }

        case 'rounded': {
            const r = outerSize * 0.2;
            const ri = innerSize * 0.2;
            const half = outerSize / 2;
            const halfI = innerSize / 2;

            return {
                outer: createRoundedSquarePath(cx, cy, half, r, rotatePoint),
                inner: createRoundedSquarePath(cx, cy, halfI, ri, rotatePoint),
            };
        }

        case 'hexagon': {
            return {
                outer: createHexagonPath(cx, cy, outerSize / 2, rotatePoint),
                inner: createHexagonPath(cx, cy, innerSize / 2, rotatePoint),
            };
        }

        case 'square':
        default: {
            const half = outerSize / 2;
            const halfI = innerSize / 2;
            const corners = [
                rotatePoint(cx - half, cy - half),
                rotatePoint(cx + half, cy - half),
                rotatePoint(cx + half, cy + half),
                rotatePoint(cx - half, cy + half),
            ];
            const innerCorners = [
                rotatePoint(cx - halfI, cy - halfI),
                rotatePoint(cx + halfI, cy - halfI),
                rotatePoint(cx + halfI, cy + halfI),
                rotatePoint(cx - halfI, cy + halfI),
            ];

            return {
                outer: `M ${corners[0].x} ${corners[0].y} L ${corners[1].x} ${corners[1].y} L ${corners[2].x} ${corners[2].y} L ${corners[3].x} ${corners[3].y} Z`,
                inner: `M ${innerCorners[0].x} ${innerCorners[0].y} L ${innerCorners[1].x} ${innerCorners[1].y} L ${innerCorners[2].x} ${innerCorners[2].y} L ${innerCorners[3].x} ${innerCorners[3].y} Z`,
            };
        }
    }
}

function createRoundedSquarePath(
    cx: number,
    cy: number,
    half: number,
    r: number,
    rotatePoint: (x: number, y: number) => Point
): string {
    const points = [
        rotatePoint(cx - half + r, cy - half),
        rotatePoint(cx + half - r, cy - half),
        rotatePoint(cx + half, cy - half + r),
        rotatePoint(cx + half, cy + half - r),
        rotatePoint(cx + half - r, cy + half),
        rotatePoint(cx - half + r, cy + half),
        rotatePoint(cx - half, cy + half - r),
        rotatePoint(cx - half, cy - half + r),
    ];

    return `M ${points[0].x} ${points[0].y}
            L ${points[1].x} ${points[1].y}
            Q ${rotatePoint(cx + half, cy - half).x} ${rotatePoint(cx + half, cy - half).y}, ${points[2].x} ${points[2].y}
            L ${points[3].x} ${points[3].y}
            Q ${rotatePoint(cx + half, cy + half).x} ${rotatePoint(cx + half, cy + half).y}, ${points[4].x} ${points[4].y}
            L ${points[5].x} ${points[5].y}
            Q ${rotatePoint(cx - half, cy + half).x} ${rotatePoint(cx - half, cy + half).y}, ${points[6].x} ${points[6].y}
            L ${points[7].x} ${points[7].y}
            Q ${rotatePoint(cx - half, cy - half).x} ${rotatePoint(cx - half, cy - half).y}, ${points[0].x} ${points[0].y}
            Z`;
}

function createHexagonPath(
    cx: number,
    cy: number,
    radius: number,
    rotatePoint: (x: number, y: number) => Point
): string {
    const points: Point[] = [];
    for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - Math.PI / 2;
        const p = rotatePoint(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        points.push(p);
    }

    return `M ${points[0].x} ${points[0].y} ${points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')} Z`;
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateLetterformCutout(params: LogoGenerationParams): GeneratedLogo[] {
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
        const variantSeed = `${seed}-letterform-v${v}`;
        const rng = createSeededRandom(variantSeed);

        const algoParams = generateLetterformParams(rng);
        const svg = createSVG(size);
        const uniqueId = generateLogoId('letterform-cutout', v);

        // Generate frame
        const { outer, inner } = generateFramePath(
            algoParams.frameShape,
            size,
            size * algoParams.paddingRatio,
            algoParams.frameThickness,
            algoParams.frameRotation
        );

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

        // Generate letter path
        const letterPath = LETTER_PATHS[letter] || LETTER_PATHS['A'];
        const letterD = letterPath(
            size * algoParams.letterScale,
            algoParams.letterWeight,
            size / 2,
            size / 2
        );

        // Create cutout effect using clipPath
        const clipId = `${uniqueId}-clip`;
        svg.addClipPath(clipId, inner);

        // Render frame (outer minus inner = ring)
        svg.path(`${outer} ${inner}`, {
            fill: `url(#${gradientId})`,
            'fill-rule': 'evenodd',
        });

        // Render letter
        svg.path(letterD, {
            fill: 'none',
            stroke: `url(#${gradientId})`,
            'stroke-width': algoParams.letterWeight,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
        });

        const svgString = svg.build();
        const hash = generateLogoHash(brandName, 'letterform-cutout', v, algoParams);

        storeHash({
            hash,
            brandName,
            algorithm: 'letterform-cutout',
            variant: v,
            createdAt: Date.now(),
        });

        logos.push({
            id: uniqueId,
            hash,
            algorithm: 'letterform-cutout',
            variant: v + 1,
            svg: svgString,
            viewBox: `0 0 ${size} ${size}`,
            params: algoParams,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: variantSeed,
                geometry: {
                    usesGoldenRatio: true,
                    gridBased: true,
                    bezierCurves: true,
                    symmetry: 'radial',
                    pathCount: 2,
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

export function generateSingleLetterformCutout(
    letter: string,
    primaryColor: string,
    accentColor?: string,
    customParams?: Partial<LetterformCutoutParams>,
    seed: string = 'default'
): string {
    const rng = createSeededRandom(seed);
    const params = { ...generateLetterformParams(rng), ...customParams };
    const size = 100;
    const svg = createSVG(size);
    const l = letter.toUpperCase();

    const { outer, inner } = generateFramePath(
        params.frameShape,
        size,
        size * params.paddingRatio,
        params.frameThickness,
        params.frameRotation
    );

    svg.addGradient('main', {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: primaryColor },
            { offset: 1, color: accentColor || darken(primaryColor, 20) },
        ],
    });

    svg.path(`${outer} ${inner}`, { fill: 'url(#main)', 'fill-rule': 'evenodd' });

    const letterPath = LETTER_PATHS[l] || LETTER_PATHS['A'];
    svg.path(letterPath(size * params.letterScale, params.letterWeight, size / 2, size / 2), {
        fill: 'none',
        stroke: 'url(#main)',
        'stroke-width': params.letterWeight,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
    });

    return svg.build();
}
