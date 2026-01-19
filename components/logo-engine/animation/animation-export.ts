/**
 * Animation Export System
 *
 * Generates Lottie JSON and CSS keyframe animations for logos
 * 3 presets: fade-in, scale-bounce, draw-path
 */

import {
    LottieAnimation,
    LottieLayer,
    LottieKeyframe,
    LottieShape,
    CSSAnimation,
    AnimationPreset,
    LogoAnimation,
    GeneratedLogo,
    Point,
} from '../types';
import { createSeededRandom } from '../core/parametric-engine';

// ============================================
// ANIMATION PRESETS
// ============================================

export const ANIMATION_PRESETS: AnimationPreset[] = [
    'fade-in',
    'scale-bounce',
    'draw-path',
    'morph-reveal',
    'stagger-in',
];

// ============================================
// LOTTIE GENERATION
// ============================================

/**
 * Parse SVG path data to Lottie shape format
 */
function parseSvgPathToLottie(pathD: string): {
    i: number[][];
    o: number[][];
    v: number[][];
    c: boolean;
} {
    const vertices: number[][] = [];
    const inTangents: number[][] = [];
    const outTangents: number[][] = [];

    // Simple path parser - handles M, L, C, Q, Z commands
    const commands = pathD.match(/[MLCQZ][^MLCQZ]*/gi) || [];

    let currentX = 0;
    let currentY = 0;

    commands.forEach(cmd => {
        const type = cmd[0].toUpperCase();
        const nums = cmd.slice(1).trim().split(/[\s,]+/).filter(Boolean).map(parseFloat);

        switch (type) {
            case 'M':
                currentX = nums[0];
                currentY = nums[1];
                vertices.push([currentX, currentY]);
                inTangents.push([0, 0]);
                outTangents.push([0, 0]);
                break;

            case 'L':
                currentX = nums[0];
                currentY = nums[1];
                vertices.push([currentX, currentY]);
                inTangents.push([0, 0]);
                outTangents.push([0, 0]);
                break;

            case 'C':
                // Cubic bezier: cp1x, cp1y, cp2x, cp2y, x, y
                if (nums.length >= 6) {
                    // Update out tangent of previous vertex
                    if (outTangents.length > 0) {
                        const prevIdx = outTangents.length - 1;
                        outTangents[prevIdx] = [
                            nums[0] - vertices[prevIdx][0],
                            nums[1] - vertices[prevIdx][1],
                        ];
                    }

                    currentX = nums[4];
                    currentY = nums[5];
                    vertices.push([currentX, currentY]);
                    inTangents.push([nums[2] - currentX, nums[3] - currentY]);
                    outTangents.push([0, 0]);
                }
                break;

            case 'Q':
                // Quadratic bezier: cpx, cpy, x, y - convert to cubic approximation
                if (nums.length >= 4) {
                    const cpx = nums[0];
                    const cpy = nums[1];
                    currentX = nums[2];
                    currentY = nums[3];

                    if (outTangents.length > 0) {
                        const prevIdx = outTangents.length - 1;
                        outTangents[prevIdx] = [
                            (cpx - vertices[prevIdx][0]) * 0.67,
                            (cpy - vertices[prevIdx][1]) * 0.67,
                        ];
                    }

                    vertices.push([currentX, currentY]);
                    inTangents.push([(cpx - currentX) * 0.67, (cpy - currentY) * 0.67]);
                    outTangents.push([0, 0]);
                }
                break;

            case 'Z':
                // Close path - handled by closed flag
                break;
        }
    });

    return {
        i: inTangents,
        o: outTangents,
        v: vertices,
        c: pathD.toUpperCase().includes('Z'),
    };
}

/**
 * Generate Lottie animation for a logo
 */
export function generateLottieAnimation(
    logo: GeneratedLogo,
    preset: AnimationPreset,
    duration: number = 1000
): LottieAnimation {
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);

    // Parse SVG to extract paths
    const paths = extractSvgPaths(logo.svg);
    const colors = extractSvgColors(logo.svg);

    // Create layers based on preset
    const layers: LottieLayer[] = [];

    switch (preset) {
        case 'fade-in':
            layers.push(createFadeInLayer(paths, colors, totalFrames));
            break;

        case 'scale-bounce':
            layers.push(createScaleBounceLayer(paths, colors, totalFrames));
            break;

        case 'draw-path':
            paths.forEach((path, i) => {
                layers.push(createDrawPathLayer(path, colors[i] || colors[0], totalFrames, i, paths.length));
            });
            break;

        case 'morph-reveal':
            layers.push(createMorphRevealLayer(paths, colors, totalFrames));
            break;

        case 'stagger-in':
            paths.forEach((path, i) => {
                layers.push(createStaggerInLayer(path, colors[i] || colors[0], totalFrames, i, paths.length));
            });
            break;
    }

    return {
        v: '5.7.4',
        fr: frameRate,
        ip: 0,
        op: totalFrames,
        w: 100,
        h: 100,
        layers,
    };
}

/**
 * Create fade-in animation layer
 */
function createFadeInLayer(
    paths: string[],
    colors: string[],
    totalFrames: number
): LottieLayer {
    const shapes: LottieShape[] = paths.map((path, i) => ({
        ty: 'gr',
        nm: `Shape ${i + 1}`,
        it: [
            {
                ty: 'sh',
                nm: 'Path',
                ks: {
                    a: 0,
                    k: parseSvgPathToLottie(path),
                },
            },
            {
                ty: 'fl',
                nm: 'Fill',
                c: { a: 0, k: hexToLottieColor(colors[i] || colors[0]) },
                o: { a: 0, k: 100 },
            },
            {
                ty: 'tr',
                nm: 'Transform',
            },
        ],
    }));

    return {
        ty: 4,
        nm: 'Logo Layer',
        ks: {
            o: {
                a: 1,
                k: [
                    { t: 0, s: [0], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                    { t: totalFrames * 0.6, s: [100] },
                ],
            },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [50, 50] },
            s: { a: 0, k: [100, 100] },
        },
        shapes,
    };
}

/**
 * Create scale-bounce animation layer
 */
function createScaleBounceLayer(
    paths: string[],
    colors: string[],
    totalFrames: number
): LottieLayer {
    const shapes: LottieShape[] = paths.map((path, i) => ({
        ty: 'gr',
        nm: `Shape ${i + 1}`,
        it: [
            {
                ty: 'sh',
                nm: 'Path',
                ks: { a: 0, k: parseSvgPathToLottie(path) },
            },
            {
                ty: 'fl',
                nm: 'Fill',
                c: { a: 0, k: hexToLottieColor(colors[i] || colors[0]) },
                o: { a: 0, k: 100 },
            },
            { ty: 'tr', nm: 'Transform' },
        ],
    }));

    return {
        ty: 4,
        nm: 'Logo Layer',
        ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [50, 50] },
            s: {
                a: 1,
                k: [
                    { t: 0, s: [0, 0], e: [110, 110], i: { x: [0.2], y: [1] }, o: { x: [0.8], y: [0] } },
                    { t: totalFrames * 0.5, s: [110, 110], e: [95, 95], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                    { t: totalFrames * 0.7, s: [95, 95], e: [100, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                    { t: totalFrames, s: [100, 100] },
                ],
            },
        },
        shapes,
    };
}

/**
 * Create draw-path animation layer
 */
function createDrawPathLayer(
    path: string,
    color: string,
    totalFrames: number,
    index: number,
    totalPaths: number
): LottieLayer {
    const staggerDelay = (index / totalPaths) * totalFrames * 0.3;
    const drawDuration = totalFrames * 0.6;

    return {
        ty: 4,
        nm: `Path ${index + 1}`,
        ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: { a: 0, k: [50, 50] },
            s: { a: 0, k: [100, 100] },
        },
        shapes: [
            {
                ty: 'gr',
                nm: 'Shape',
                it: [
                    {
                        ty: 'sh',
                        nm: 'Path',
                        ks: { a: 0, k: parseSvgPathToLottie(path) },
                    },
                    {
                        ty: 'st',
                        nm: 'Stroke',
                        c: { a: 0, k: hexToLottieColor(color) },
                        w: { a: 0, k: 2 },
                        o: { a: 0, k: 100 },
                    },
                    {
                        ty: 'tm',
                        nm: 'Trim Paths',
                        s: { a: 0, k: 0 },
                        e: {
                            a: 1,
                            k: [
                                { t: staggerDelay, s: [0], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                                { t: staggerDelay + drawDuration, s: [100] },
                            ],
                        },
                    },
                    { ty: 'tr', nm: 'Transform' },
                ],
            },
        ],
    };
}

/**
 * Create morph-reveal animation layer
 */
function createMorphRevealLayer(
    paths: string[],
    colors: string[],
    totalFrames: number
): LottieLayer {
    const shapes: LottieShape[] = paths.map((path, i) => ({
        ty: 'gr',
        nm: `Shape ${i + 1}`,
        it: [
            {
                ty: 'sh',
                nm: 'Path',
                ks: { a: 0, k: parseSvgPathToLottie(path) },
            },
            {
                ty: 'fl',
                nm: 'Fill',
                c: { a: 0, k: hexToLottieColor(colors[i] || colors[0]) },
                o: {
                    a: 1,
                    k: [
                        { t: totalFrames * 0.2, s: [0], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                        { t: totalFrames * 0.6, s: [100] },
                    ],
                },
            },
            { ty: 'tr', nm: 'Transform' },
        ],
    }));

    return {
        ty: 4,
        nm: 'Logo Layer',
        ks: {
            o: { a: 0, k: 100 },
            r: { a: 0, k: 0 },
            p: {
                a: 1,
                k: [
                    { t: 0, s: [50, 60], e: [50, 50], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                    { t: totalFrames * 0.5, s: [50, 50] },
                ],
            },
            s: { a: 0, k: [100, 100] },
        },
        shapes,
    };
}

/**
 * Create stagger-in animation layer
 */
function createStaggerInLayer(
    path: string,
    color: string,
    totalFrames: number,
    index: number,
    totalPaths: number
): LottieLayer {
    const staggerDelay = (index / totalPaths) * totalFrames * 0.4;

    return {
        ty: 4,
        nm: `Element ${index + 1}`,
        ks: {
            o: {
                a: 1,
                k: [
                    { t: staggerDelay, s: [0], e: [100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                    { t: staggerDelay + totalFrames * 0.3, s: [100] },
                ],
            },
            r: { a: 0, k: 0 },
            p: {
                a: 1,
                k: [
                    { t: staggerDelay, s: [50, 55], e: [50, 50], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                    { t: staggerDelay + totalFrames * 0.3, s: [50, 50] },
                ],
            },
            s: {
                a: 1,
                k: [
                    { t: staggerDelay, s: [90, 90], e: [100, 100], i: { x: [0.4], y: [1] }, o: { x: [0.6], y: [0] } },
                    { t: staggerDelay + totalFrames * 0.3, s: [100, 100] },
                ],
            },
        },
        shapes: [
            {
                ty: 'gr',
                nm: 'Shape',
                it: [
                    {
                        ty: 'sh',
                        nm: 'Path',
                        ks: { a: 0, k: parseSvgPathToLottie(path) },
                    },
                    {
                        ty: 'fl',
                        nm: 'Fill',
                        c: { a: 0, k: hexToLottieColor(color) },
                        o: { a: 0, k: 100 },
                    },
                    { ty: 'tr', nm: 'Transform' },
                ],
            },
        ],
    };
}

// ============================================
// CSS ANIMATION GENERATION
// ============================================

/**
 * Generate CSS keyframe animation
 */
export function generateCSSAnimation(
    logo: GeneratedLogo,
    preset: AnimationPreset,
    duration: number = 1000
): CSSAnimation {
    const className = `logo-animation-${logo.id.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const easing = 'cubic-bezier(0.4, 0, 0.2, 1)';

    let keyframes: string;

    switch (preset) {
        case 'fade-in':
            keyframes = `
@keyframes ${className} {
    0% {
        opacity: 0;
        transform: translateY(10px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}`;
            break;

        case 'scale-bounce':
            keyframes = `
@keyframes ${className} {
    0% {
        transform: scale(0);
        opacity: 0;
    }
    50% {
        transform: scale(1.1);
        opacity: 1;
    }
    70% {
        transform: scale(0.95);
    }
    100% {
        transform: scale(1);
    }
}`;
            break;

        case 'draw-path':
            keyframes = `
@keyframes ${className} {
    0% {
        stroke-dashoffset: 1000;
        fill-opacity: 0;
    }
    70% {
        stroke-dashoffset: 0;
        fill-opacity: 0;
    }
    100% {
        stroke-dashoffset: 0;
        fill-opacity: 1;
    }
}`;
            break;

        case 'morph-reveal':
            keyframes = `
@keyframes ${className} {
    0% {
        clip-path: inset(100% 0 0 0);
        transform: translateY(20px);
    }
    100% {
        clip-path: inset(0 0 0 0);
        transform: translateY(0);
    }
}`;
            break;

        case 'stagger-in':
        default:
            keyframes = `
@keyframes ${className} {
    0% {
        opacity: 0;
        transform: scale(0.9) translateY(5px);
    }
    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}`;
            break;
    }

    // Generate class with animation application
    const fullCSS = `${keyframes}

.${className} {
    animation: ${className} ${duration}ms ${easing} forwards;
}

.${className} path:nth-child(1) { animation-delay: 0ms; }
.${className} path:nth-child(2) { animation-delay: 50ms; }
.${className} path:nth-child(3) { animation-delay: 100ms; }
.${className} path:nth-child(4) { animation-delay: 150ms; }
.${className} path:nth-child(5) { animation-delay: 200ms; }
`;

    return {
        keyframes: fullCSS,
        className,
        duration,
        easing,
    };
}

// ============================================
// COMBINED ANIMATION EXPORT
// ============================================

/**
 * Generate complete animation package for a logo
 */
export function generateLogoAnimation(
    logo: GeneratedLogo,
    preset: AnimationPreset = 'fade-in',
    duration: number = 1000
): LogoAnimation {
    return {
        lottie: generateLottieAnimation(logo, preset, duration),
        css: generateCSSAnimation(logo, preset, duration),
        preset,
    };
}

/**
 * Export animation to downloadable formats
 */
export function exportAnimationPackage(
    animation: LogoAnimation
): {
    lottieJson: string;
    cssFile: string;
} {
    return {
        lottieJson: JSON.stringify(animation.lottie, null, 2),
        cssFile: animation.css.keyframes,
    };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Extract path data from SVG string
 */
function extractSvgPaths(svgString: string): string[] {
    const pathRegex = /<path[^>]*d="([^"]*)"[^>]*>/gi;
    const paths: string[] = [];
    let match;

    while ((match = pathRegex.exec(svgString)) !== null) {
        paths.push(match[1]);
    }

    return paths;
}

/**
 * Extract colors from SVG string
 */
function extractSvgColors(svgString: string): string[] {
    const colors: string[] = [];

    // Extract from fill attributes
    const fillRegex = /fill="([^"]*url[^"]*|#[0-9a-fA-F]{3,8}|[a-zA-Z]+)"/gi;
    let match;

    while ((match = fillRegex.exec(svgString)) !== null) {
        const color = match[1];
        if (!color.includes('url')) {
            colors.push(color);
        }
    }

    // Extract from gradient stops
    const stopRegex = /stop-color="(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)"/gi;
    while ((match = stopRegex.exec(svgString)) !== null) {
        colors.push(match[1]);
    }

    return colors.length > 0 ? colors : ['#000000'];
}

/**
 * Convert hex color to Lottie RGBA format
 */
function hexToLottieColor(hex: string): number[] {
    // Default black if invalid
    if (!hex || !hex.startsWith('#')) {
        return [0, 0, 0, 1];
    }

    const cleanHex = hex.replace('#', '');
    let r = 0, g = 0, b = 0, a = 1;

    if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16) / 255;
        g = parseInt(cleanHex[1] + cleanHex[1], 16) / 255;
        b = parseInt(cleanHex[2] + cleanHex[2], 16) / 255;
    } else if (cleanHex.length >= 6) {
        r = parseInt(cleanHex.slice(0, 2), 16) / 255;
        g = parseInt(cleanHex.slice(2, 4), 16) / 255;
        b = parseInt(cleanHex.slice(4, 6), 16) / 255;
        if (cleanHex.length === 8) {
            a = parseInt(cleanHex.slice(6, 8), 16) / 255;
        }
    }

    return [r, g, b, a];
}
