/**
 * Color Utilities for Logo Generation
 * 
 * Color manipulation, gradient generation, and palette utilities
 */

// ============================================
// COLOR CONVERSION
// ============================================

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}

/**
 * Convert RGB to HSL
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
            case r:
                h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
                break;
            case g:
                h = ((b - r) / d + 2) / 6;
                break;
            case b:
                h = ((r - g) / d + 4) / 6;
                break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

/**
 * Convert HSL to RGB
 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p: number, q: number, t: number) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
    };
}

// ============================================
// COLOR MANIPULATION
// ============================================

/**
 * Lighten a color by percentage
 */
export function lighten(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.min(100, hsl.l + percent);

    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Darken a color by percentage
 */
export function darken(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.l = Math.max(0, hsl.l - percent);

    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Adjust saturation
 */
export function saturate(hex: string, percent: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.s = Math.min(100, Math.max(0, hsl.s + percent));

    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Rotate hue
 */
export function rotateHue(hex: string, degrees: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    hsl.h = (hsl.h + degrees) % 360;
    if (hsl.h < 0) hsl.h += 360;

    const newRgb = hslToRgb(hsl.h, hsl.s, hsl.l);
    return rgbToHex(newRgb.r, newRgb.g, newRgb.b);
}

/**
 * Mix two colors
 */
export function mixColors(color1: string, color2: string, weight: number = 0.5): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return color1;

    return rgbToHex(
        Math.round(rgb1.r * (1 - weight) + rgb2.r * weight),
        Math.round(rgb1.g * (1 - weight) + rgb2.g * weight),
        Math.round(rgb1.b * (1 - weight) + rgb2.b * weight)
    );
}

/**
 * Get color with alpha (returns rgba string)
 */
export function withAlpha(hex: string, alpha: number): string {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

// ============================================
// CONTRAST & ACCESSIBILITY
// ============================================

/**
 * Calculate relative luminance
 */
export function luminance(hex: string): number {
    const rgb = hexToRgb(hex);
    if (!rgb) return 0;

    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
        c /= 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
export function contrastRatio(color1: string, color2: string): number {
    const l1 = luminance(color1);
    const l2 = luminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if color is light or dark
 */
export function isLight(hex: string): boolean {
    return luminance(hex) > 0.179;
}

/**
 * Get contrasting text color (black or white)
 */
export function getContrastColor(hex: string): string {
    return isLight(hex) ? '#000000' : '#FFFFFF';
}

// ============================================
// GRADIENT GENERATION
// ============================================

import { GradientDef } from '../types';

/**
 * Create a two-color gradient
 */
export function createGradient(
    color1: string,
    color2: string,
    angle: number = 45,
    type: 'linear' | 'radial' = 'linear'
): GradientDef {
    return {
        type,
        angle: type === 'linear' ? angle : undefined,
        stops: [
            { offset: 0, color: color1 },
            { offset: 1, color: color2 },
        ],
    };
}

/**
 * Create a multi-stop gradient
 */
export function createMultiGradient(
    colors: string[],
    angle: number = 45,
    type: 'linear' | 'radial' = 'linear'
): GradientDef {
    const stops = colors.map((color, i) => ({
        offset: i / (colors.length - 1),
        color,
    }));

    return {
        type,
        angle: type === 'linear' ? angle : undefined,
        stops,
    };
}

/**
 * Generate a harmonious color pair for gradients
 */
export function generateGradientPair(
    baseColor: string,
    style: 'analogous' | 'complementary' | 'split' | 'monochromatic' = 'analogous'
): [string, string] {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return [baseColor, baseColor];

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    switch (style) {
        case 'complementary':
            return [baseColor, rotateHue(baseColor, 180)];

        case 'split':
            return [rotateHue(baseColor, -30), rotateHue(baseColor, 30)];

        case 'monochromatic':
            return [lighten(baseColor, 20), darken(baseColor, 15)];

        case 'analogous':
        default:
            return [baseColor, rotateHue(baseColor, 30)];
    }
}

/**
 * Create a Stripe-style gradient (vibrant, angled)
 */
export function createStripeGradient(baseColor: string): GradientDef {
    const lighter = lighten(saturate(baseColor, 10), 15);
    const darker = darken(saturate(baseColor, 5), 10);

    return {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighter },
            { offset: 0.5, color: baseColor },
            { offset: 1, color: darker },
        ],
    };
}

/**
 * Create a vibrant tech gradient
 */
export function createTechGradient(color1: string, color2?: string): GradientDef {
    const c2 = color2 || rotateHue(color1, 45);

    return {
        type: 'linear',
        angle: 120,
        stops: [
            { offset: 0, color: lighten(color1, 10) },
            { offset: 0.4, color: color1 },
            { offset: 0.6, color: mixColors(color1, c2, 0.5) },
            { offset: 1, color: c2 },
        ],
    };
}

// ============================================
// ADVANCED GRADIENT SYSTEMS
// ============================================

/**
 * Create an iridescent/holographic gradient effect
 */
export function createIridescentGradient(baseColor: string): GradientDef {
    const hueShift1 = rotateHue(baseColor, -40);
    const hueShift2 = rotateHue(baseColor, 40);
    const hueShift3 = rotateHue(baseColor, 80);

    return {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: lighten(hueShift1, 15) },
            { offset: 0.25, color: baseColor },
            { offset: 0.5, color: hueShift2 },
            { offset: 0.75, color: hueShift3 },
            { offset: 1, color: lighten(hueShift1, 10) },
        ],
    };
}

/**
 * Create a premium metallic gradient
 */
export function createMetallicGradient(baseColor: string, metal: 'gold' | 'silver' | 'bronze' | 'custom' = 'custom'): GradientDef {
    let highlights: { light: string; mid: string; dark: string };

    switch (metal) {
        case 'gold':
            highlights = {
                light: '#FFF4D4',
                mid: '#D4AF37',
                dark: '#8B6914',
            };
            break;
        case 'silver':
            highlights = {
                light: '#FFFFFF',
                mid: '#C0C0C0',
                dark: '#808080',
            };
            break;
        case 'bronze':
            highlights = {
                light: '#FFCC99',
                mid: '#CD7F32',
                dark: '#8B4513',
            };
            break;
        default:
            highlights = {
                light: lighten(baseColor, 35),
                mid: baseColor,
                dark: darken(baseColor, 25),
            };
    }

    return {
        type: 'linear',
        angle: 145,
        stops: [
            { offset: 0, color: highlights.light },
            { offset: 0.2, color: highlights.mid },
            { offset: 0.4, color: highlights.light },
            { offset: 0.6, color: highlights.mid },
            { offset: 0.8, color: highlights.dark },
            { offset: 1, color: highlights.mid },
        ],
    };
}

/**
 * Create a glass/frosted effect gradient
 */
export function createGlassGradient(baseColor: string): GradientDef {
    return {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: withAlpha(lighten(baseColor, 40), 0.9).replace('rgba', '#').slice(0, 7) },
            { offset: 0.3, color: withAlpha(baseColor, 0.7).replace('rgba', '#').slice(0, 7) },
            { offset: 0.7, color: withAlpha(darken(baseColor, 10), 0.8).replace('rgba', '#').slice(0, 7) },
            { offset: 1, color: withAlpha(darken(baseColor, 20), 0.9).replace('rgba', '#').slice(0, 7) },
        ],
    };
}

/**
 * Create a sunset/horizon gradient
 */
export function createSunsetGradient(warmColor: string): GradientDef {
    const orange = rotateHue(warmColor, -15);
    const pink = rotateHue(warmColor, 30);
    const purple = rotateHue(warmColor, 60);

    return {
        type: 'linear',
        angle: 180,
        stops: [
            { offset: 0, color: lighten(warmColor, 20) },
            { offset: 0.3, color: orange },
            { offset: 0.5, color: warmColor },
            { offset: 0.7, color: pink },
            { offset: 1, color: purple },
        ],
    };
}

/**
 * Create a depth/3D gradient for shapes
 */
export function createDepthGradient(baseColor: string, direction: 'top' | 'left' | 'top-left' = 'top-left'): GradientDef {
    const angleMap = {
        'top': 180,
        'left': 90,
        'top-left': 135,
    };

    return {
        type: 'linear',
        angle: angleMap[direction],
        stops: [
            { offset: 0, color: lighten(baseColor, 25) },
            { offset: 0.15, color: lighten(baseColor, 15) },
            { offset: 0.5, color: baseColor },
            { offset: 0.85, color: darken(baseColor, 15) },
            { offset: 1, color: darken(baseColor, 25) },
        ],
    };
}

/**
 * Create a neon glow gradient
 */
export function createNeonGradient(glowColor: string): GradientDef {
    const saturated = saturate(glowColor, 30);
    const bright = lighten(saturated, 20);

    return {
        type: 'radial',
        stops: [
            { offset: 0, color: bright },
            { offset: 0.3, color: saturated },
            { offset: 0.6, color: glowColor },
            { offset: 1, color: darken(glowColor, 30) },
        ],
    };
}

/**
 * Generate a complete color palette from a base color
 */
export function generateColorPalette(baseColor: string): {
    primary: string;
    secondary: string;
    accent: string;
    light: string;
    dark: string;
    muted: string;
} {
    return {
        primary: baseColor,
        secondary: rotateHue(baseColor, 30),
        accent: rotateHue(baseColor, 180),
        light: lighten(baseColor, 35),
        dark: darken(baseColor, 35),
        muted: saturate(baseColor, -30),
    };
}

/**
 * Create aurora/northern lights gradient
 */
export function createAuroraGradient(baseColor: string): GradientDef {
    const green = rotateHue(baseColor, -60);
    const teal = rotateHue(baseColor, -30);
    const purple = rotateHue(baseColor, 60);

    return {
        type: 'linear',
        angle: 135,
        stops: [
            { offset: 0, color: darken(purple, 20) },
            { offset: 0.2, color: purple },
            { offset: 0.4, color: teal },
            { offset: 0.6, color: green },
            { offset: 0.8, color: lighten(green, 20) },
            { offset: 1, color: lighten(teal, 15) },
        ],
    };
}
