/**
 * Accessibility Utilities
 * 
 * Includes contrast checking for WCAG compliance
 * and other accessibility helpers.
 */

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
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
 * Calculate relative luminance of a color
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 * Returns a number between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG standards
 */
export interface ContrastResult {
    ratio: number;
    aa: boolean;      // AA standard for normal text (4.5:1)
    aaLarge: boolean; // AA standard for large text (3:1)
    aaa: boolean;     // AAA standard for normal text (7:1)
    aaaLarge: boolean; // AAA standard for large text (4.5:1)
    grade: 'fail' | 'aa-large' | 'aa' | 'aaa';
}

export function checkContrast(foreground: string, background: string): ContrastResult {
    const ratio = getContrastRatio(foreground, background);

    const aa = ratio >= 4.5;
    const aaLarge = ratio >= 3;
    const aaa = ratio >= 7;
    const aaaLarge = ratio >= 4.5;

    let grade: ContrastResult['grade'] = 'fail';
    if (aaa) grade = 'aaa';
    else if (aa) grade = 'aa';
    else if (aaLarge) grade = 'aa-large';

    return { ratio, aa, aaLarge, aaa, aaaLarge, grade };
}

/**
 * Get a readable text color (black or white) for a given background
 */
export function getReadableTextColor(background: string): string {
    const rgb = hexToRgb(background);
    if (!rgb) return '#000000';

    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.179 ? '#000000' : '#ffffff';
}

/**
 * Suggest a better contrast color if current fails WCAG AA
 */
export function suggestBetterContrast(foreground: string, background: string): string | null {
    const result = checkContrast(foreground, background);
    if (result.aa) return null; // Already passes AA

    // Try making foreground darker or lighter
    const bgRgb = hexToRgb(background);
    if (!bgRgb) return null;

    const bgLuminance = getLuminance(bgRgb.r, bgRgb.g, bgRgb.b);

    // If background is light, suggest dark text; if dark, suggest light text
    return bgLuminance > 0.5 ? '#1a1a1a' : '#ffffff';
}
