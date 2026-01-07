/**
 * Clean SVG Exporter
 * 
 * Generates production-ready SVG files from brand shape data.
 * No React dependencies - pure string output.
 */

import { BrandIdentity } from './data';

export type SVGVariant = 'color' | 'black' | 'white' | 'outline';

/**
 * Generate a clean SVG string from brand shape data
 */
export function generateLogoSVG(
    brand: BrandIdentity,
    variant: SVGVariant = 'color'
): string {
    const viewBox = brand.shape.viewBox || '0 0 24 24';
    const path = brand.shape.path;

    // Determine fill color based on variant
    let fillColor: string;
    let strokeColor: string | null = null;
    let strokeWidth: string | null = null;

    switch (variant) {
        case 'black':
            fillColor = '#000000';
            break;
        case 'white':
            fillColor = '#FFFFFF';
            break;
        case 'outline':
            fillColor = 'none';
            strokeColor = brand.theme.tokens.light.primary;
            strokeWidth = '1.5';
            break;
        case 'color':
        default:
            fillColor = brand.theme.tokens.light.primary;
            break;
    }

    // Build stroke attributes if needed
    const strokeAttrs = strokeColor
        ? ` stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"`
        : '';

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">
  <path d="${path}" fill="${fillColor}"${strokeAttrs}/>
</svg>`;
}

/**
 * Generate logo with brand name as text (wordmark)
 */
export function generateWordmarkSVG(
    brand: BrandIdentity,
    variant: SVGVariant = 'color'
): string {
    const shapeViewBox = brand.shape.viewBox || '0 0 24 24';
    const path = brand.shape.path;

    // Parse viewBox to get dimensions
    const [, , vbWidth] = shapeViewBox.split(' ').map(Number);
    const shapeScale = 24 / (vbWidth || 24);

    // Determine colors
    let primaryColor: string;
    let textColor: string;

    switch (variant) {
        case 'black':
            primaryColor = '#000000';
            textColor = '#000000';
            break;
        case 'white':
            primaryColor = '#FFFFFF';
            textColor = '#FFFFFF';
            break;
        default:
            primaryColor = brand.theme.tokens.light.primary;
            textColor = brand.theme.tokens.light.text;
            break;
    }

    // Wordmark layout: icon on left, text on right
    const iconSize = 32;
    const textX = iconSize + 12;
    const totalWidth = textX + brand.name.length * 12;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} 40" fill="none">
  <!-- Icon -->
  <g transform="translate(4, 4) scale(${shapeScale})">
    <path d="${path}" fill="${primaryColor}"/>
  </g>
  <!-- Brand Name -->
  <text x="${textX}" y="28" font-family="${brand.font.heading}, system-ui, sans-serif" font-size="20" font-weight="700" fill="${textColor}">
    ${brand.name}
  </text>
</svg>`;
}

/**
 * Generate favicon-optimized SVG (simplified, high contrast)
 */
export function generateFaviconSVG(brand: BrandIdentity): string {
    const path = brand.shape.path;
    const viewBox = brand.shape.viewBox || '0 0 24 24';
    const primaryColor = brand.theme.tokens.light.primary;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
  <path d="${path}" fill="${primaryColor}"/>
</svg>`;
}

/**
 * Generate all logo variants as an object
 */
export function generateAllLogoVariants(brand: BrandIdentity): {
    color: string;
    black: string;
    white: string;
    outline: string;
    wordmarkColor: string;
    wordmarkBlack: string;
    favicon: string;
} {
    return {
        color: generateLogoSVG(brand, 'color'),
        black: generateLogoSVG(brand, 'black'),
        white: generateLogoSVG(brand, 'white'),
        outline: generateLogoSVG(brand, 'outline'),
        wordmarkColor: generateWordmarkSVG(brand, 'color'),
        wordmarkBlack: generateWordmarkSVG(brand, 'black'),
        favicon: generateFaviconSVG(brand),
    };
}
