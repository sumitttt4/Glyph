import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import a11yPlugin from "colord/plugins/a11y";

extend([mixPlugin, a11yPlugin]);

export interface SemanticPalette {
    brand: string;
    bg: string;
    surface: string;
    text: string;
    border: string;
    hover: string;
    muted: string;
    accent: string;
}

export interface GeneratedPalette {
    light: SemanticPalette;
    dark: SemanticPalette;
}

/**
 * Adaptive Palette Engine
 * 
 * Takes a single "brand" color and generates a complete semantic color scheme
 * for both Light and Dark modes with proper accessibility.
 */
export const generatePalette = (baseColor: string): GeneratedPalette => {
    const c = colord(baseColor);

    // 1. LIGHT MODE (High Saturation, Standard Contrast)
    const light: SemanticPalette = {
        brand: baseColor,
        bg: '#ffffff',
        surface: '#fafafa', // stone-50
        text: '#09090b',    // stone-950
        border: '#e4e4e7',  // stone-200
        muted: '#a1a1aa',   // stone-400
        accent: c.rotate(30).saturate(0.1).toHex(), // Complementary accent
        // Interaction states
        hover: c.darken(0.08).toHex(),
    };

    // 2. DARK MODE (Lower Saturation, Higher Lightness for Visibility)
    // Logic: If the color is dark, we LIGHTEN it significantly.
    // If it's already neon/light, we keep it or adjust slightly.
    const hsl = c.toHsl();
    let darkBrand: string;

    if (c.isDark()) {
        // Dark colors need significant lightening for visibility
        darkBrand = c.lighten(0.25).saturate(0.05).toHex();
    } else if (hsl.l > 70) {
        // Very light colors: desaturate slightly to avoid neon look
        darkBrand = c.desaturate(0.1).darken(0.05).toHex();
    } else {
        // Mid-range colors: lighten slightly  
        darkBrand = c.lighten(0.15).toHex();
    }

    const darkAccent = colord(darkBrand).rotate(30).saturate(0.1).toHex();

    const dark: SemanticPalette = {
        brand: darkBrand,
        bg: '#09090b',      // stone-950 (Deep Carbon)
        surface: '#18181b', // stone-900
        text: '#fafafa',    // stone-50
        border: '#27272a',  // stone-800
        muted: '#71717a',   // stone-500
        accent: darkAccent,
        // Interaction states
        hover: colord(darkBrand).lighten(0.08).toHex(),
    };

    return { light, dark };
};

/**
 * Check if a color has sufficient contrast against a background
 */
export const hasGoodContrast = (foreground: string, background: string): boolean => {
    return colord(foreground).contrast(colord(background)) >= 4.5;
};

/**
 * Get a text color (black or white) that has good contrast with the given background
 */
export const getContrastText = (background: string): string => {
    return colord(background).isDark() ? '#ffffff' : '#09090b';
};
