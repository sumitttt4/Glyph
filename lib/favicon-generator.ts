/**
 * Favicon Generator Utility
 * 
 * Generates favicon assets from brand lettermark
 */

import { BrandIdentity } from './data';

/**
 * Generate SVG favicon content
 */
export function generateFaviconSVG(brand: BrandIdentity): string {
    const initial = brand.name.charAt(0).toUpperCase();
    const colors = brand.theme.tokens.light;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="6" fill="${colors.primary}"/>
    <text x="16" y="23" font-size="20" font-weight="800" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif">${initial}</text>
</svg>`;
}

/**
 * Generate Apple Touch Icon SVG (180x180)
 */
export function generateAppleTouchIcon(brand: BrandIdentity): string {
    const initial = brand.name.charAt(0).toUpperCase();
    const colors = brand.theme.tokens.light;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
    <rect width="180" height="180" rx="36" fill="${colors.primary}"/>
    <text x="90" y="125" font-size="110" font-weight="800" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif">${initial}</text>
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
