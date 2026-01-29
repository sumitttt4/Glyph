/**
 * Copy Integrations
 *
 * Direct copy-to-clipboard exports for various design tools:
 * - Figma (JSON with frames, vectors, styles)
 * - Cursor/VS Code (React components, CSS variables)
 * - Notion (Markdown with logo, colors, fonts)
 * - Framer (Component code)
 * - Webflow (CSS variables + SVG embed)
 *
 * CRITICAL: All exports use getStoredLogoSVG() which pulls from global export state.
 * Never regenerates logos - always uses what was displayed in preview.
 */

import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG } from '@/components/logo-engine/renderers/stored-logo-export';
import { hasValidExportState, getExportMetadata } from '@/lib/export-state';

// Debug logging
const DEBUG = true;
function logCopy(action: string, data?: Record<string, unknown>) {
    if (DEBUG) {
        console.log(`[CopyIntegrations] ${action}`, data ? data : '');
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Convert hex to RGB values
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16),
          }
        : { r: 0, g: 0, b: 0 };
}

/**
 * Convert hex to Figma color format (0-1 range)
 */
function hexToFigmaColor(hex: string): { r: number; g: number; b: number } {
    const rgb = hexToRgb(hex);
    return {
        r: rgb.r / 255,
        g: rgb.g / 255,
        b: rgb.b / 255,
    };
}

/**
 * Convert hex to HSL string
 */
function hexToHsl(hex: string): string {
    const rgb = hexToRgb(hex);
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;

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

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

/**
 * Encode SVG for data URI
 */
function svgToDataUri(svg: string): string {
    const encoded = encodeURIComponent(svg)
        .replace(/'/g, '%27')
        .replace(/"/g, '%22');
    return `data:image/svg+xml,${encoded}`;
}

/**
 * Convert brand name to valid variable name
 */
function toVariableName(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Convert brand name to PascalCase
 */
function toPascalCase(name: string): string {
    return name
        .split(/[^a-zA-Z0-9]+/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');
}

// ============================================
// FIGMA EXPORT
// ============================================

export interface FigmaExportResult {
    json: string;
    clipboard: string;
}

/**
 * Generate Figma-compatible JSON for paste
 * Creates frames, vectors, and color styles
 */
export function generateFigmaExport(brand: BrandIdentity): FigmaExportResult {
    const tokens = brand.theme.tokens.light;
    const accent = tokens.accent || tokens.primary;
    const logoSvg = getStoredLogoSVG(brand, 'color');

    // Figma paste format (simplified JSON that Figma can interpret)
    const figmaData = {
        type: 'FRAME',
        name: `${brand.name} Brand Kit`,
        children: [
            // Logo frame
            {
                type: 'FRAME',
                name: 'Logo',
                x: 0,
                y: 0,
                width: 200,
                height: 200,
                fills: [{ type: 'SOLID', color: hexToFigmaColor(tokens.bg) }],
                children: [
                    {
                        type: 'VECTOR',
                        name: `${brand.name} Logo`,
                        x: 50,
                        y: 50,
                        width: 100,
                        height: 100,
                        fills: [{ type: 'SOLID', color: hexToFigmaColor(tokens.primary) }],
                    },
                ],
            },
            // Color swatches
            {
                type: 'FRAME',
                name: 'Colors',
                x: 220,
                y: 0,
                width: 400,
                height: 100,
                layoutMode: 'HORIZONTAL',
                itemSpacing: 16,
                children: [
                    {
                        type: 'RECTANGLE',
                        name: 'Primary',
                        width: 80,
                        height: 80,
                        cornerRadius: 8,
                        fills: [{ type: 'SOLID', color: hexToFigmaColor(tokens.primary) }],
                    },
                    {
                        type: 'RECTANGLE',
                        name: 'Accent',
                        width: 80,
                        height: 80,
                        cornerRadius: 8,
                        fills: [{ type: 'SOLID', color: hexToFigmaColor(accent) }],
                    },
                    {
                        type: 'RECTANGLE',
                        name: 'Background',
                        width: 80,
                        height: 80,
                        cornerRadius: 8,
                        fills: [{ type: 'SOLID', color: hexToFigmaColor(tokens.bg) }],
                        strokes: [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.9 } }],
                        strokeWeight: 1,
                    },
                    {
                        type: 'RECTANGLE',
                        name: 'Text',
                        width: 80,
                        height: 80,
                        cornerRadius: 8,
                        fills: [{ type: 'SOLID', color: hexToFigmaColor(tokens.text) }],
                    },
                ],
            },
            // Typography
            {
                type: 'FRAME',
                name: 'Typography',
                x: 0,
                y: 220,
                width: 600,
                height: 200,
                children: [
                    {
                        type: 'TEXT',
                        name: 'Heading Sample',
                        x: 0,
                        y: 0,
                        characters: brand.name,
                        style: {
                            fontFamily: brand.font.headingName || 'Inter',
                            fontWeight: 700,
                            fontSize: 48,
                        },
                        fills: [{ type: 'SOLID', color: hexToFigmaColor(tokens.text) }],
                    },
                    {
                        type: 'TEXT',
                        name: 'Body Sample',
                        x: 0,
                        y: 70,
                        characters: brand.strategy?.tagline || 'Your brand tagline goes here',
                        style: {
                            fontFamily: brand.font.bodyName || 'Inter',
                            fontWeight: 400,
                            fontSize: 18,
                        },
                        fills: [{ type: 'SOLID', color: hexToFigmaColor(tokens.muted) }],
                    },
                ],
            },
        ],
        // Color styles for Figma
        styles: {
            colors: {
                [`${brand.name}/Primary`]: tokens.primary,
                [`${brand.name}/Accent`]: accent,
                [`${brand.name}/Background`]: tokens.bg,
                [`${brand.name}/Surface`]: tokens.surface,
                [`${brand.name}/Text`]: tokens.text,
                [`${brand.name}/Muted`]: tokens.muted,
            },
            typography: {
                [`${brand.name}/Heading`]: {
                    fontFamily: brand.font.headingName || 'Inter',
                    fontWeight: 700,
                },
                [`${brand.name}/Body`]: {
                    fontFamily: brand.font.bodyName || 'Inter',
                    fontWeight: 400,
                },
            },
        },
    };

    const json = JSON.stringify(figmaData, null, 2);

    // Create clipboard-friendly format with SVG
    const clipboardData = `<!-- ${brand.name} Brand Kit for Figma -->
<!-- Paste this SVG directly, then use the color values below -->

${logoSvg}

/* Color Styles */
Primary: ${tokens.primary}
Accent: ${accent}
Background: ${tokens.bg}
Surface: ${tokens.surface}
Text: ${tokens.text}
Muted: ${tokens.muted}

/* Typography */
Heading: ${brand.font.headingName || 'Inter'} Bold
Body: ${brand.font.bodyName || 'Inter'} Regular
${brand.font.monoName ? `Mono: ${brand.font.monoName} Regular` : ''}`;

    return { json, clipboard: clipboardData };
}

// ============================================
// VS CODE / CURSOR EXPORT
// ============================================

export interface VSCodeExportResult {
    reactComponent: string;
    cssVariables: string;
    tailwindConfig: string;
    tsTypes: string;
}

/**
 * Generate VS Code/Cursor-ready code snippets
 */
export function generateVSCodeExport(brand: BrandIdentity): VSCodeExportResult {
    const tokens = brand.theme.tokens.light;
    const darkTokens = brand.theme.tokens.dark;
    const accent = tokens.accent || tokens.primary;
    const darkAccent = darkTokens?.accent || darkTokens?.primary || accent;
    const varName = toVariableName(brand.name);
    const componentName = toPascalCase(brand.name);
    const logoSvg = getStoredLogoSVG(brand, 'color');

    // React Component
    const reactComponent = `// ${brand.name} Logo Component
// Generated by Glyph

import React from 'react';

interface ${componentName}LogoProps {
  size?: number;
  className?: string;
  variant?: 'color' | 'dark' | 'light';
}

export const ${componentName}Logo: React.FC<${componentName}LogoProps> = ({
  size = 48,
  className = '',
  variant = 'color',
}) => {
  const colors = {
    color: '${tokens.primary}',
    dark: '#000000',
    light: '#FFFFFF',
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="${brand.name} logo"
    >
      {/* Logo paths - paste SVG internals here */}
      <rect x="10" y="10" width="80" height="80" rx="18" fill={colors[variant]} />
    </svg>
  );
};

// Brand Colors
export const ${varName}Colors = {
  primary: '${tokens.primary}',
  accent: '${accent}',
  background: '${tokens.bg}',
  surface: '${tokens.surface}',
  text: '${tokens.text}',
  muted: '${tokens.muted}',
} as const;

// Dark Mode Colors
export const ${varName}ColorsDark = {
  primary: '${darkTokens?.primary || tokens.primary}',
  accent: '${darkAccent}',
  background: '${darkTokens?.bg || '#0a0a0a'}',
  surface: '${darkTokens?.surface || '#171717'}',
  text: '${darkTokens?.text || '#fafafa'}',
  muted: '${darkTokens?.muted || '#a1a1aa'}',
} as const;

export default ${componentName}Logo;
`;

    // CSS Variables
    const cssVariables = `/* ${brand.name} Design Tokens */
/* Generated by Glyph */

:root {
  /* Primary Colors */
  --${varName}-primary: ${tokens.primary};
  --${varName}-primary-rgb: ${hexToRgb(tokens.primary).r}, ${hexToRgb(tokens.primary).g}, ${hexToRgb(tokens.primary).b};
  --${varName}-primary-hsl: ${hexToHsl(tokens.primary)};

  /* Accent Colors */
  --${varName}-accent: ${accent};
  --${varName}-accent-rgb: ${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b};

  /* Surface Colors */
  --${varName}-background: ${tokens.bg};
  --${varName}-surface: ${tokens.surface};
  --${varName}-border: ${tokens.border};

  /* Text Colors */
  --${varName}-text: ${tokens.text};
  --${varName}-muted: ${tokens.muted};

  /* Typography */
  --${varName}-font-heading: '${brand.font.headingName || 'Inter'}', system-ui, sans-serif;
  --${varName}-font-body: '${brand.font.bodyName || 'Inter'}', system-ui, sans-serif;
  ${brand.font.monoName ? `--${varName}-font-mono: '${brand.font.monoName}', ui-monospace, monospace;` : ''}
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  :root {
    --${varName}-primary: ${darkTokens?.primary || tokens.primary};
    --${varName}-accent: ${darkAccent};
    --${varName}-background: ${darkTokens?.bg || '#0a0a0a'};
    --${varName}-surface: ${darkTokens?.surface || '#171717'};
    --${varName}-border: ${darkTokens?.border || '#27272a'};
    --${varName}-text: ${darkTokens?.text || '#fafafa'};
    --${varName}-muted: ${darkTokens?.muted || '#a1a1aa'};
  }
}

/* Utility Classes */
.${varName}-bg-primary { background-color: var(--${varName}-primary); }
.${varName}-bg-accent { background-color: var(--${varName}-accent); }
.${varName}-bg-surface { background-color: var(--${varName}-surface); }
.${varName}-text-primary { color: var(--${varName}-text); }
.${varName}-text-muted { color: var(--${varName}-muted); }
.${varName}-font-heading { font-family: var(--${varName}-font-heading); }
.${varName}-font-body { font-family: var(--${varName}-font-body); }
`;

    // Tailwind Config
    const tailwindConfig = `// ${brand.name} Tailwind Config
// Add to your tailwind.config.js

module.exports = {
  theme: {
    extend: {
      colors: {
        '${varName}': {
          primary: '${tokens.primary}',
          accent: '${accent}',
          background: '${tokens.bg}',
          surface: '${tokens.surface}',
          border: '${tokens.border}',
          text: '${tokens.text}',
          muted: '${tokens.muted}',
        },
      },
      fontFamily: {
        '${varName}-heading': ['${brand.font.headingName || 'Inter'}', 'system-ui', 'sans-serif'],
        '${varName}-body': ['${brand.font.bodyName || 'Inter'}', 'system-ui', 'sans-serif'],
        ${brand.font.monoName ? `'${varName}-mono': ['${brand.font.monoName}', 'ui-monospace', 'monospace'],` : ''}
      },
    },
  },
};
`;

    // TypeScript Types
    const tsTypes = `// ${brand.name} Brand Types
// Generated by Glyph

export interface ${componentName}BrandColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
}

export interface ${componentName}BrandFonts {
  heading: string;
  body: string;
  mono?: string;
}

export interface ${componentName}Brand {
  name: '${brand.name}';
  colors: {
    light: ${componentName}BrandColors;
    dark: ${componentName}BrandColors;
  };
  fonts: ${componentName}BrandFonts;
  tagline: string;
}

export const ${varName}Brand: ${componentName}Brand = {
  name: '${brand.name}',
  colors: {
    light: {
      primary: '${tokens.primary}',
      accent: '${accent}',
      background: '${tokens.bg}',
      surface: '${tokens.surface}',
      border: '${tokens.border}',
      text: '${tokens.text}',
      muted: '${tokens.muted}',
    },
    dark: {
      primary: '${darkTokens?.primary || tokens.primary}',
      accent: '${darkAccent}',
      background: '${darkTokens?.bg || '#0a0a0a'}',
      surface: '${darkTokens?.surface || '#171717'}',
      border: '${darkTokens?.border || '#27272a'}',
      text: '${darkTokens?.text || '#fafafa'}',
      muted: '${darkTokens?.muted || '#a1a1aa'}',
    },
  },
  fonts: {
    heading: '${brand.font.headingName || 'Inter'}',
    body: '${brand.font.bodyName || 'Inter'}',
    ${brand.font.monoName ? `mono: '${brand.font.monoName}',` : ''}
  },
  tagline: '${brand.strategy?.tagline || ''}',
};
`;

    return {
        reactComponent,
        cssVariables,
        tailwindConfig,
        tsTypes,
    };
}

// ============================================
// NOTION EXPORT
// ============================================

/**
 * Generate Notion-compatible markdown with embedded content
 */
export function generateNotionExport(brand: BrandIdentity): string {
    const tokens = brand.theme.tokens.light;
    const accent = tokens.accent || tokens.primary;
    const logoSvg = getStoredLogoSVG(brand, 'color');
    const logoDataUri = svgToDataUri(logoSvg);

    return `# ${brand.name} Brand Guidelines

## Logo
![${brand.name} Logo](${logoDataUri})

---

## Brand Colors

| Color | Hex | RGB | Usage |
|-------|-----|-----|-------|
| **Primary** | \`${tokens.primary}\` | rgb(${hexToRgb(tokens.primary).r}, ${hexToRgb(tokens.primary).g}, ${hexToRgb(tokens.primary).b}) | Main brand color, CTAs, links |
| **Accent** | \`${accent}\` | rgb(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}) | Highlights, secondary actions |
| **Background** | \`${tokens.bg}\` | rgb(${hexToRgb(tokens.bg).r}, ${hexToRgb(tokens.bg).g}, ${hexToRgb(tokens.bg).b}) | Page backgrounds |
| **Surface** | \`${tokens.surface}\` | rgb(${hexToRgb(tokens.surface).r}, ${hexToRgb(tokens.surface).g}, ${hexToRgb(tokens.surface).b}) | Cards, elevated surfaces |
| **Text** | \`${tokens.text}\` | rgb(${hexToRgb(tokens.text).r}, ${hexToRgb(tokens.text).g}, ${hexToRgb(tokens.text).b}) | Primary text |
| **Muted** | \`${tokens.muted}\` | rgb(${hexToRgb(tokens.muted).r}, ${hexToRgb(tokens.muted).g}, ${hexToRgb(tokens.muted).b}) | Secondary text, captions |

---

## Typography

### Heading Font
**${brand.font.headingName || 'Inter'}**
> Use for headlines, titles, and important text elements.

### Body Font
**${brand.font.bodyName || 'Inter'}**
> Use for paragraphs, descriptions, and general content.

${brand.font.monoName ? `### Mono Font
**${brand.font.monoName}**
> Use for code, technical content, and data displays.` : ''}

---

## Brand Voice
${brand.strategy ? `
**Tagline:** ${brand.strategy.tagline}

**Mission:** ${brand.strategy.mission}

**Tone:** ${brand.strategy.voice?.tone || 'Professional and approachable'}

### Do's
${brand.strategy.voice?.dos?.map(d => `- ${d}`).join('\n') || '- Be clear and concise\n- Use active voice'}

### Don'ts
${brand.strategy.voice?.donts?.map(d => `- ${d}`).join('\n') || '- Avoid jargon\n- Don\'t be overly formal'}
` : ''}

---

*Generated with Glyph*
`;
}

// ============================================
// FRAMER EXPORT
// ============================================

/**
 * Generate Framer-compatible component code
 */
export function generateFramerExport(brand: BrandIdentity): string {
    const tokens = brand.theme.tokens.light;
    const accent = tokens.accent || tokens.primary;
    const componentName = toPascalCase(brand.name);
    const logoSvg = getStoredLogoSVG(brand, 'color');

    // Clean up SVG for embedding
    const cleanSvg = logoSvg
        .replace(/<?xml[^?]*\?>/g, '')
        .replace(/\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    return `// ${brand.name} Components for Framer
// Copy and paste into Framer Code Components

import { addPropertyControls, ControlType } from "framer"

// Brand Colors
const colors = {
    primary: "${tokens.primary}",
    accent: "${accent}",
    background: "${tokens.bg}",
    surface: "${tokens.surface}",
    text: "${tokens.text}",
    muted: "${tokens.muted}",
}

// Logo Component
export function ${componentName}Logo(props) {
    const { size, variant, ...rest } = props

    const fillColor = variant === "light"
        ? "#FFFFFF"
        : variant === "dark"
            ? "#000000"
            : colors.primary

    return (
        <div
            style={{
                width: size,
                height: size,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            {...rest}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
            >
                <rect x="10" y="10" width="80" height="80" rx="18" fill={fillColor} />
            </svg>
        </div>
    )
}

${componentName}Logo.defaultProps = {
    size: 64,
    variant: "color",
}

addPropertyControls(${componentName}Logo, {
    size: {
        type: ControlType.Number,
        title: "Size",
        min: 16,
        max: 512,
        step: 8,
        defaultValue: 64,
    },
    variant: {
        type: ControlType.Enum,
        title: "Variant",
        options: ["color", "dark", "light"],
        optionTitles: ["Color", "Dark", "Light"],
        defaultValue: "color",
    },
})

// Button Component
export function ${componentName}Button(props) {
    const { label, variant, size, ...rest } = props

    const styles = {
        primary: {
            background: colors.primary,
            color: "#FFFFFF",
        },
        secondary: {
            background: colors.surface,
            color: colors.text,
            border: \`1px solid \${colors.primary}\`,
        },
        ghost: {
            background: "transparent",
            color: colors.primary,
        },
    }

    const sizes = {
        sm: { padding: "8px 16px", fontSize: 14 },
        md: { padding: "12px 24px", fontSize: 16 },
        lg: { padding: "16px 32px", fontSize: 18 },
    }

    return (
        <button
            style={{
                ...styles[variant],
                ...sizes[size],
                borderRadius: 8,
                fontFamily: "'${brand.font.bodyName || 'Inter'}', sans-serif",
                fontWeight: 600,
                cursor: "pointer",
                border: "none",
                transition: "all 0.2s ease",
            }}
            {...rest}
        >
            {label}
        </button>
    )
}

${componentName}Button.defaultProps = {
    label: "Button",
    variant: "primary",
    size: "md",
}

addPropertyControls(${componentName}Button, {
    label: {
        type: ControlType.String,
        title: "Label",
        defaultValue: "Button",
    },
    variant: {
        type: ControlType.Enum,
        title: "Variant",
        options: ["primary", "secondary", "ghost"],
        defaultValue: "primary",
    },
    size: {
        type: ControlType.Enum,
        title: "Size",
        options: ["sm", "md", "lg"],
        defaultValue: "md",
    },
})

// Card Component
export function ${componentName}Card(props) {
    const { children, padding, shadow, ...rest } = props

    return (
        <div
            style={{
                background: colors.surface,
                borderRadius: 12,
                padding: padding,
                boxShadow: shadow ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                border: \`1px solid \${colors.primary}20\`,
            }}
            {...rest}
        >
            {children}
        </div>
    )
}

${componentName}Card.defaultProps = {
    padding: 24,
    shadow: true,
}

addPropertyControls(${componentName}Card, {
    padding: {
        type: ControlType.Number,
        title: "Padding",
        min: 0,
        max: 64,
        step: 4,
        defaultValue: 24,
    },
    shadow: {
        type: ControlType.Boolean,
        title: "Shadow",
        defaultValue: true,
    },
})
`;
}

// ============================================
// WEBFLOW EXPORT
// ============================================

/**
 * Generate Webflow-ready CSS variables and SVG embed code
 */
export function generateWebflowExport(brand: BrandIdentity): string {
    const tokens = brand.theme.tokens.light;
    const darkTokens = brand.theme.tokens.dark;
    const accent = tokens.accent || tokens.primary;
    const darkAccent = darkTokens?.accent || darkTokens?.primary || accent;
    const varName = toVariableName(brand.name);
    const logoSvg = getStoredLogoSVG(brand, 'color');

    // Clean SVG for embedding
    const embedSvg = logoSvg
        .replace(/<?xml[^?]*\?>/g, '')
        .trim();

    return `/* ============================================
   ${brand.name.toUpperCase()} BRAND STYLES FOR WEBFLOW
   ============================================

   Instructions:
   1. Copy the CSS Variables section into your Webflow project's
      custom code (Site Settings > Custom Code > Head)
   2. Use the utility classes in your elements
   3. Paste the SVG embed code where you need the logo
   ============================================ */

/* ============================================
   CSS VARIABLES - Add to <head> custom code
   ============================================ */
<style>
:root {
  /* Brand Colors */
  --color-primary: ${tokens.primary};
  --color-accent: ${accent};
  --color-background: ${tokens.bg};
  --color-surface: ${tokens.surface};
  --color-border: ${tokens.border};
  --color-text: ${tokens.text};
  --color-muted: ${tokens.muted};

  /* Typography */
  --font-heading: '${brand.font.headingName || 'Inter'}', sans-serif;
  --font-body: '${brand.font.bodyName || 'Inter'}', sans-serif;
  ${brand.font.monoName ? `--font-mono: '${brand.font.monoName}', monospace;` : ''}

  /* Spacing (based on 4px grid) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: ${darkTokens?.primary || tokens.primary};
    --color-accent: ${darkAccent};
    --color-background: ${darkTokens?.bg || '#0a0a0a'};
    --color-surface: ${darkTokens?.surface || '#171717'};
    --color-border: ${darkTokens?.border || '#27272a'};
    --color-text: ${darkTokens?.text || '#fafafa'};
    --color-muted: ${darkTokens?.muted || '#a1a1aa'};
  }
}
</style>

/* ============================================
   UTILITY CLASSES - Add to <head> custom code
   ============================================ */
<style>
/* Background Colors */
.bg-primary { background-color: var(--color-primary); }
.bg-accent { background-color: var(--color-accent); }
.bg-surface { background-color: var(--color-surface); }

/* Text Colors */
.text-primary { color: var(--color-primary); }
.text-accent { color: var(--color-accent); }
.text-body { color: var(--color-text); }
.text-muted { color: var(--color-muted); }

/* Typography */
.font-heading { font-family: var(--font-heading); }
.font-body { font-family: var(--font-body); }
${brand.font.monoName ? '.font-mono { font-family: var(--font-mono); }' : ''}

/* Buttons */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s ease;
}
.btn-primary:hover { opacity: 0.9; }

.btn-secondary {
  background-color: transparent;
  color: var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-weight: 600;
  border: 2px solid var(--color-primary);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background-color: var(--color-primary);
  color: white;
}

/* Cards */
.card {
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
}
</style>

/* ============================================
   LOGO SVG - Paste as HTML Embed
   ============================================ */
<!-- ${brand.name} Logo -->
${embedSvg}

/* ============================================
   LOGO CSS CLASS (optional)
   ============================================ */
<style>
.${varName}-logo {
  width: 48px;
  height: 48px;
}
.${varName}-logo svg {
  width: 100%;
  height: 100%;
}
.${varName}-logo--sm { width: 32px; height: 32px; }
.${varName}-logo--md { width: 48px; height: 48px; }
.${varName}-logo--lg { width: 64px; height: 64px; }
.${varName}-logo--xl { width: 96px; height: 96px; }
</style>

/* ============================================
   COLOR SWATCHES REFERENCE
   ============================================

   Primary:    ${tokens.primary}
   Accent:     ${accent}
   Background: ${tokens.bg}
   Surface:    ${tokens.surface}
   Border:     ${tokens.border}
   Text:       ${tokens.text}
   Muted:      ${tokens.muted}

   ============================================ */
`;
}

// ============================================
// CLIPBOARD COPY FUNCTIONS
// ============================================

export type IntegrationType = 'figma' | 'vscode' | 'notion' | 'framer' | 'webflow';
export type VSCodeExportType = 'react' | 'css' | 'tailwind' | 'types';

/**
 * Copy to clipboard with appropriate format
 */
export async function copyToClipboard(text: string): Promise<boolean> {
    try {
        if (typeof navigator !== 'undefined' && navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            return true;
        }
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
    } catch (err) {
        console.error('Failed to copy to clipboard:', err);
        return false;
    }
}

/**
 * Get integration data for a specific target
 * USES STORED STATE - never regenerates logos
 */
export function getIntegrationExport(
    brand: BrandIdentity,
    integration: IntegrationType,
    subType?: VSCodeExportType
): string {
    // Log export state
    const metadata = getExportMetadata();
    logCopy('Getting integration export', {
        brandName: brand.name,
        integration,
        subType,
        hasExportState: hasValidExportState(),
        exportId: metadata?.exportId,
    });

    if (metadata) {
        logCopy('Exporting brand ID: ' + metadata.brandId);
    }

    switch (integration) {
        case 'figma':
            return generateFigmaExport(brand).clipboard;

        case 'vscode': {
            const vscode = generateVSCodeExport(brand);
            switch (subType) {
                case 'react':
                    return vscode.reactComponent;
                case 'css':
                    return vscode.cssVariables;
                case 'tailwind':
                    return vscode.tailwindConfig;
                case 'types':
                    return vscode.tsTypes;
                default:
                    return vscode.cssVariables;
            }
        }

        case 'notion':
            return generateNotionExport(brand);

        case 'framer':
            return generateFramerExport(brand);

        case 'webflow':
            return generateWebflowExport(brand);

        default:
            return '';
    }
}

/**
 * Copy brand assets for a specific integration
 * Returns success status and a message for toast notification
 */
export async function copyForIntegration(
    brand: BrandIdentity,
    integration: IntegrationType,
    subType?: VSCodeExportType
): Promise<{ success: boolean; message: string }> {
    const content = getIntegrationExport(brand, integration, subType);

    if (!content) {
        return {
            success: false,
            message: 'Failed to generate export content',
        };
    }

    const success = await copyToClipboard(content);

    const integrationNames: Record<IntegrationType, string> = {
        figma: 'Figma',
        vscode: 'VS Code',
        notion: 'Notion',
        framer: 'Framer',
        webflow: 'Webflow',
    };

    const subTypeNames: Record<VSCodeExportType, string> = {
        react: 'React Component',
        css: 'CSS Variables',
        tailwind: 'Tailwind Config',
        types: 'TypeScript Types',
    };

    let targetName = integrationNames[integration];
    if (integration === 'vscode' && subType) {
        targetName = subTypeNames[subType];
    }

    return {
        success,
        message: success
            ? `Copied to clipboard — paste in ${targetName}`
            : `Failed to copy to clipboard`,
    };
}

/**
 * Get all available integration options
 */
export function getIntegrationOptions(): Array<{
    id: IntegrationType;
    label: string;
    description: string;
    subOptions?: Array<{ id: VSCodeExportType; label: string }>;
}> {
    return [
        {
            id: 'figma',
            label: 'Copy to Figma',
            description: 'SVG + color styles for Figma',
        },
        {
            id: 'vscode',
            label: 'Copy to VS Code',
            description: 'Code snippets for development',
            subOptions: [
                { id: 'react', label: 'React Component' },
                { id: 'css', label: 'CSS Variables' },
                { id: 'tailwind', label: 'Tailwind Config' },
                { id: 'types', label: 'TypeScript Types' },
            ],
        },
        {
            id: 'notion',
            label: 'Copy to Notion',
            description: 'Markdown with colors & fonts',
        },
        {
            id: 'framer',
            label: 'Copy to Framer',
            description: 'Framer code components',
        },
        {
            id: 'webflow',
            label: 'Copy to Webflow',
            description: 'CSS variables + SVG embed',
        },
    ];
}
