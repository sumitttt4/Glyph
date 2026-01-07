/**
 * Logo Composition SVG Generator
 * 
 * Server-side compatible version of LogoComposition that outputs pure SVG strings.
 * This matches the exact output of the React LogoComposition component.
 */

import { BrandIdentity } from './data';
import { SHAPES, Shape } from './shapes';

/**
 * Deterministic PRNG based on string seed (same as LogoComposition)
 */
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

/**
 * Get shape scale factor to normalize to 100x100 canvas
 */
function getShapeScale(shape: { viewBox?: string }): number {
    if (!shape.viewBox) return 3;
    const parts = shape.viewBox.split(' ');
    const width = parseFloat(parts[2]) || 24;
    return 80 / width;
}

export type SVGVariant = 'color' | 'black' | 'white';

/**
 * Generate the composed logo SVG (matching LogoComposition output)
 */
export function generateComposedLogoSVG(
    brand: BrandIdentity,
    variant: SVGVariant = 'color'
): string {
    const seed = brand.id + (brand.name || 'brand') + (brand.generationSeed || brand.id || 'stable');

    // Get shapes
    const safeShapes = SHAPES.length > 0 ? SHAPES : [{ id: 'fallback', path: 'M0 0h100v100H0z', name: 'Fallback', viewBox: '0 0 100 100', tags: [], complexity: 'simple' as const }];
    const shapeIndex1 = Math.floor(seededRandom(seed + 's1') * safeShapes.length);
    const shapeIndex2 = Math.floor(seededRandom(seed + 's2') * safeShapes.length);

    const primaryShape = brand.shape || safeShapes[shapeIndex1 % safeShapes.length];
    const secondaryShape = safeShapes[shapeIndex2 % safeShapes.length];

    const primaryScale = getShapeScale(primaryShape);
    const secondaryScale = getShapeScale(secondaryShape);

    // Determine colors based on variant
    let primaryColor: string;
    let accentColor: string;
    let bgColor: string;

    switch (variant) {
        case 'black':
            primaryColor = '#000000';
            accentColor = '#333333';
            bgColor = 'transparent';
            break;
        case 'white':
            primaryColor = '#FFFFFF';
            accentColor = '#EEEEEE';
            bgColor = 'transparent';
            break;
        case 'color':
        default:
            primaryColor = brand.theme.tokens.light.primary;
            accentColor = brand.theme.tokens.light.accent || brand.theme.tokens.light.primary;
            bgColor = 'transparent';
            break;
    }

    // Determine layout based on seed - ONLY single and cut (premium layouts)
    const layoutModeRoll = seededRandom(seed + 'layout');
    let genLayout = 'single';
    if (layoutModeRoll > 0.5) genLayout = 'single';
    else genLayout = 'cut';

    const textureRoll = seededRandom(seed + 'tex');
    const isOutlined = textureRoll > 0.75;

    // Generate unique ID for masks
    const uniqueId = `logo-${brand.id.substring(0, 8)}`;

    let svgContent = '';

    // Generate layout-specific content
    if (genLayout === 'single') {
        // Clean single shape - premium look
        const strokeAttr = isOutlined
            ? `fill="none" stroke="${primaryColor}" stroke-width="1.5"`
            : `fill="${primaryColor}"`;
        svgContent = `
    <g transform="translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})">
        <path d="${primaryShape.path}" ${strokeAttr}/>
    </g>`;
    } else if (genLayout === 'cut') {
        // Negative space cut - still premium
        svgContent = `
    <defs>
        <mask id="mask-cut-${uniqueId}">
            <rect width="100" height="100" fill="white"/>
            <g transform="translate(${50 - secondaryScale * 12}, ${50 - secondaryScale * 12}) scale(${secondaryScale})">
                <path d="${secondaryShape.path}" fill="black"/>
            </g>
        </mask>
    </defs>
    <g transform="translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})">
        <path d="${primaryShape.path}" fill="${primaryColor}" mask="url(#mask-cut-${uniqueId})"/>
    </g>`;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
${svgContent}
</svg>`;
}

/**
 * Generate simple icon-only SVG (just the shape)
 */
export function generateSimpleLogoSVG(
    brand: BrandIdentity,
    variant: SVGVariant = 'color'
): string {
    const viewBox = brand.shape.viewBox || '0 0 24 24';
    const path = brand.shape.path;

    let fillColor: string;
    switch (variant) {
        case 'black':
            fillColor = '#000000';
            break;
        case 'white':
            fillColor = '#FFFFFF';
            break;
        case 'color':
        default:
            fillColor = brand.theme.tokens.light.primary;
            break;
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none">
    <path d="${path}" fill="${fillColor}"/>
</svg>`;
}

/**
 * Generate wordmark SVG (logo + brand name)
 */
export function generateWordmarkSVG(
    brand: BrandIdentity,
    variant: SVGVariant = 'color'
): string {
    const path = brand.shape.path;
    const shapeViewBox = brand.shape.viewBox || '0 0 24 24';
    const [, , vbWidth] = shapeViewBox.split(' ').map(Number);
    const shapeScale = 24 / (vbWidth || 24);

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
 * Generate favicon SVG
 */
export function generateFaviconSVG(brand: BrandIdentity): string {
    // For favicon, use the composed logo but simplified
    return generateComposedLogoSVG(brand, 'color');
}
