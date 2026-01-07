/**
 * Favicon Generator Utility
 * 
 * Generates favicon assets from brand shape (not lettermark)
 */

import { BrandIdentity } from './data';

/**
 * Get shape scale factor for a target canvas size
 */
function getShapeScale(viewBox: string, targetSize: number): number {
    const parts = viewBox.split(' ');
    const width = parseFloat(parts[2]) || 24;
    return (targetSize * 0.65) / width; // 65% of target to leave padding
}

/**
 * Generate SVG favicon content using actual brand shape
 */
export function generateFaviconSVG(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const shape = brand.shape;
    const viewBox = shape.viewBox || '0 0 24 24';
    const parts = viewBox.split(' ').map(Number);
    const shapeWidth = parts[2] || 24;
    const shapeHeight = parts[3] || 24;
    const scale = getShapeScale(viewBox, 32);
    const offsetX = (32 - shapeWidth * scale) / 2;
    const offsetY = (32 - shapeHeight * scale) / 2;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="6" fill="${colors.primary}"/>
    <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
        <path d="${shape.path}" fill="white"/>
    </g>
</svg>`;
}

/**
 * Generate Apple Touch Icon SVG (180x180) using actual brand shape
 */
export function generateAppleTouchIcon(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const shape = brand.shape;
    const viewBox = shape.viewBox || '0 0 24 24';
    const parts = viewBox.split(' ').map(Number);
    const shapeWidth = parts[2] || 24;
    const shapeHeight = parts[3] || 24;
    const scale = getShapeScale(viewBox, 180);
    const offsetX = (180 - shapeWidth * scale) / 2;
    const offsetY = (180 - shapeHeight * scale) / 2;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
    <rect width="180" height="180" rx="36" fill="${colors.primary}"/>
    <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
        <path d="${shape.path}" fill="white"/>
    </g>
</svg>`;
}

/**
 * Generate Web Manifest JSON
 */
export function generateWebManifest(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;

    return JSON.stringify({
        name: brand.name,
        short_name: brand.name,
        icons: [
            { src: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
        theme_color: colors.primary,
        background_color: colors.bg,
        display: 'standalone',
    }, null, 2);
}

/**
 * Generate all favicon files as a downloadable package
 */
export interface FaviconPackage {
    files: Array<{
        name: string;
        content: string;
        type: 'svg' | 'json' | 'html';
    }>;
    htmlSnippet: string;
}

export function generateFaviconPackage(brand: BrandIdentity): FaviconPackage {
    const faviconSVG = generateFaviconSVG(brand);
    const appleTouchSVG = generateAppleTouchIcon(brand);
    const manifest = generateWebManifest(brand);

    const htmlSnippet = `<!-- Favicon -->
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${brand.theme.tokens.light.primary}">`;

    return {
        files: [
            { name: 'favicon.svg', content: faviconSVG, type: 'svg' },
            { name: 'apple-touch-icon.svg', content: appleTouchSVG, type: 'svg' },
            { name: 'site.webmanifest', content: manifest, type: 'json' },
        ],
        htmlSnippet,
    };
}

/**
 * Convert SVG to data URL (for preview)
 */
export function svgToDataUrl(svg: string): string {
    return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
