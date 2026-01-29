/**
 * Color Generator - Functional Token System
 * 
 * Generates a complete 12-color system from a single primary color:
 * - Brand Core (3): Primary, Primary Foreground, Accent
 * - Neutral System (5): Background, Surface, Border, Foreground, Muted
 * - State System (4): Success, Error, Warning, Info
 */

import { colord, extend } from "colord";
import mixPlugin from "colord/plugins/mix";
import a11yPlugin from "colord/plugins/a11y";
import harmoniesPlugin from "colord/plugins/harmonies";

extend([mixPlugin, a11yPlugin, harmoniesPlugin]);

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export interface BrandCore {
    DEFAULT: string;      // Primary brand color
    foreground: string;   // Text color for buttons (white/black)
    accent: string;       // Complementary accent color
}

export interface NeutralSystem {
    background: string;   // Page background
    surface: string;      // Card/modal backgrounds
    border: string;       // Divider lines
    foreground: string;   // Main text color
    muted: string;        // Secondary text
}

export interface StateSystem {
    success: string;
    error: string;
    warning: string;
    info: string;
}

export interface ColorSystem {
    brand: BrandCore;
    neutral: NeutralSystem;
    state: StateSystem;
}

export interface DualModeColorSystem {
    light: ColorSystem;
    dark: ColorSystem;
}

// ============================================================
// COLOR GENERATION ENGINE
// ============================================================

/**
 * Get contrasting foreground color (black or white)
 */
function getContrastForeground(background: string): string {
    const c = colord(background);
    // Use WCAG contrast ratio - prefer white on dark, black on light
    return c.isDark() ? "#FFFFFF" : "#0F172A";
}

/**
 * Generate a complementary accent color
 */
function generateAccent(primary: string): string {
    const c = colord(primary);
    // Rotate 30 degrees on the color wheel for an analogous accent
    return c.rotate(30).saturate(0.1).toHex();
}

/**
 * Generate the Neutral System from a "temperature" hint
 * If primary is warm (orange/red), use warm grays
 * If primary is cool (blue/green), use cool grays
 */
function generateNeutrals(primary: string, mode: 'light' | 'dark'): NeutralSystem {
    const c = colord(primary);
    const hue = c.toHsl().h;

    // Determine warmth: 0-60 and 300-360 are warm (red/orange/yellow/pink)
    const isWarm = (hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360);

    if (mode === 'light') {
        if (isWarm) {
            // Warm neutrals (Stone-like)
            return {
                background: "#F8FAFC",
                surface: "#FFFFFF",
                border: "#E2E8F0",
                foreground: "#0F172A",
                muted: "#64748B",
            };
        } else {
            // Cool neutrals (Slate-like)
            return {
                background: "#F1F5F9",
                surface: "#FFFFFF",
                border: "#CBD5E1",
                foreground: "#1E293B",
                muted: "#475569",
            };
        }
    } else {
        // Dark mode
        if (isWarm) {
            return {
                background: "#0F172A",
                surface: "#1E293B",
                border: "#334155",
                foreground: "#F8FAFC",
                muted: "#94A3B8",
            };
        } else {
            return {
                background: "#020617",
                surface: "#0F172A",
                border: "#1E293B",
                foreground: "#F1F5F9",
                muted: "#64748B",
            };
        }
    }
}

/**
 * Generate State colors aligned to the brand vibe
 */
function generateStateColors(): StateSystem {
    // These are standardized - don't let users pick them
    // Tailwind defaults work well for most vibes
    return {
        success: "#22C55E", // green-500
        error: "#EF4444",   // red-500
        warning: "#F59E0B", // amber-500
        info: "#3B82F6",    // blue-500
    };
}

/**
 * Generate Dark Mode Primary (accessible version)
 */
function generateDarkModePrimary(primary: string): string {
    const c = colord(primary);

    if (c.isDark()) {
        // If already dark, lighten significantly
        return c.lighten(0.25).saturate(0.05).toHex();
    } else if (c.toHsl().l > 70) {
        // If very light, desaturate slightly
        return c.desaturate(0.1).darken(0.05).toHex();
    } else {
        // Mid-range, lighten slightly
        return c.lighten(0.12).toHex();
    }
}

// ============================================================
// MAIN GENERATOR FUNCTION
// ============================================================

/**
 * Generate a complete 12-color Functional Token System from a single primary color
 */
export function generateColorSystem(primary: string): DualModeColorSystem {
    const darkPrimary = generateDarkModePrimary(primary);

    return {
        light: {
            brand: {
                DEFAULT: primary,
                foreground: getContrastForeground(primary),
                accent: generateAccent(primary),
            },
            neutral: generateNeutrals(primary, 'light'),
            state: generateStateColors(),
        },
        dark: {
            brand: {
                DEFAULT: darkPrimary,
                foreground: getContrastForeground(darkPrimary),
                accent: generateAccent(darkPrimary),
            },
            neutral: generateNeutrals(primary, 'dark'),
            state: generateStateColors(),
        },
    };
}

/**
 * Get the "Big 5" colors that define the vibe (for display)
 */
export function getBig5Colors(primary: string): { label: string; light: string; dark: string }[] {
    const system = generateColorSystem(primary);

    return [
        { label: "Primary", light: system.light.brand.DEFAULT, dark: system.dark.brand.DEFAULT },
        { label: "Background", light: system.light.neutral.background, dark: system.dark.neutral.background },
        { label: "Surface", light: system.light.neutral.surface, dark: system.dark.neutral.surface },
        { label: "Text", light: system.light.neutral.foreground, dark: system.dark.neutral.foreground },
        { label: "Accent", light: system.light.brand.accent, dark: system.dark.brand.accent },
    ];
}

/**
 * Generate Tailwind config-ready color object
 */
export function generateTailwindConfig(primary: string): object {
    const system = generateColorSystem(primary);

    return {
        colors: {
            brand: {
                DEFAULT: system.light.brand.DEFAULT,
                foreground: system.light.brand.foreground,
                accent: system.light.brand.accent,
            },
            background: system.light.neutral.background,
            surface: system.light.neutral.surface,
            border: system.light.neutral.border,
            foreground: system.light.neutral.foreground,
            muted: {
                DEFAULT: system.light.neutral.muted,
                foreground: system.light.neutral.muted,
            },
            success: system.light.state.success,
            error: system.light.state.error,
            warning: system.light.state.warning,
            info: system.light.state.info,
        },
    };
}
