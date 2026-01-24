/**
 * Favicon & App Icon Generator
 *
 * Generates favicon assets from stored logo SVG (ensures exact match with preview).
 * Includes proper .ico generation with embedded sizes.
 *
 * CRITICAL: Uses stored SVG via getStoredLogoSVG() which pulls from global export state.
 * Never regenerates logos - always uses what was displayed in preview.
 */

import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG } from '@/components/logo-engine/renderers/stored-logo-export';
import { hasValidExportState, validateExportState } from '@/lib/export-state';

// Debug logging
const DEBUG = true;
function logFavicon(action: string, data?: Record<string, unknown>) {
    if (DEBUG) {
        console.log(`[ExportFavicon] ${action}`, data ? data : '');
    }
}

// ============================================
// FAVICON SVG GENERATION
// ============================================

/**
 * Generate SVG favicon from stored logo
 * USES STORED SVG - never regenerates
 */
export function generateFaviconSVG(brand: BrandIdentity, size: number = 32): string {
    logFavicon('Generating favicon', {
        brandName: brand.name,
        size,
        hasExportState: hasValidExportState(),
    });

    // Get the stored logo SVG (uses global export state if available)
    const logoSvg = getStoredLogoSVG(brand, 'color');

    // Extract viewBox from stored logo
    const viewBoxMatch = logoSvg.match(/viewBox="([^"]+)"/);
    const logoViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';

    // Extract inner content (without XML declaration and outer svg tags)
    const innerContent = logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();

    // Create favicon with stored logo embedded
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <svg x="0" y="0" width="${size}" height="${size}" viewBox="${logoViewBox}">
        ${innerContent}
    </svg>
</svg>`;
}

/**
 * Generate Apple Touch Icon SVG (180x180)
 */
export function generateAppleTouchIcon(brand: BrandIdentity): string {
    return generateFaviconSVG(brand, 180);
}

/**
 * Generate Android Chrome Icon SVG (192x192 or 512x512)
 */
export function generateAndroidIcon(brand: BrandIdentity, size: 192 | 512 = 192): string {
    return generateFaviconSVG(brand, size);
}

// ============================================
// ICO FILE GENERATION
// ============================================

/**
 * Encode PNG images into a proper .ico file format
 * ICO format: https://en.wikipedia.org/wiki/ICO_(file_format)
 */
export function encodeICO(pngBuffers: ArrayBuffer[], sizes: number[]): Blob {
    // ICO Header (6 bytes)
    // 0-1: Reserved (0)
    // 2-3: Image type (1 = ICO)
    // 4-5: Number of images
    const header = new ArrayBuffer(6);
    const headerView = new DataView(header);
    headerView.setUint16(0, 0, true); // Reserved
    headerView.setUint16(2, 1, true); // ICO type
    headerView.setUint16(4, pngBuffers.length, true); // Number of images

    // Calculate offsets
    const iconDirEntrySize = 16; // Each ICONDIRENTRY is 16 bytes
    let dataOffset = 6 + (iconDirEntrySize * pngBuffers.length);

    // Create ICONDIRENTRY for each image (16 bytes each)
    const dirEntries: ArrayBuffer[] = [];
    const offsets: number[] = [];

    for (let i = 0; i < pngBuffers.length; i++) {
        const size = sizes[i];
        const pngSize = pngBuffers[i].byteLength;

        const entry = new ArrayBuffer(16);
        const entryView = new DataView(entry);

        // Width (1 byte, 0 = 256)
        entryView.setUint8(0, size >= 256 ? 0 : size);
        // Height (1 byte, 0 = 256)
        entryView.setUint8(1, size >= 256 ? 0 : size);
        // Color palette (0 for PNG)
        entryView.setUint8(2, 0);
        // Reserved
        entryView.setUint8(3, 0);
        // Color planes (1 for ICO)
        entryView.setUint16(4, 1, true);
        // Bits per pixel (32 for PNG with alpha)
        entryView.setUint16(6, 32, true);
        // Image data size
        entryView.setUint32(8, pngSize, true);
        // Offset to image data
        entryView.setUint32(12, dataOffset, true);

        dirEntries.push(entry);
        offsets.push(dataOffset);
        dataOffset += pngSize;
    }

    // Combine all parts
    const totalSize = dataOffset;
    const result = new Uint8Array(totalSize);

    // Copy header
    result.set(new Uint8Array(header), 0);

    // Copy directory entries
    let offset = 6;
    for (const entry of dirEntries) {
        result.set(new Uint8Array(entry), offset);
        offset += 16;
    }

    // Copy PNG data
    for (let i = 0; i < pngBuffers.length; i++) {
        result.set(new Uint8Array(pngBuffers[i]), offsets[i]);
    }

    return new Blob([result], { type: 'image/x-icon' });
}

/**
 * Convert SVG to PNG using canvas
 */
export async function svgToPngBuffer(svg: string, size: number): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
        }

        canvas.width = size;
        canvas.height = size;

        const svgBlob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.clearRect(0, 0, size, size);
            ctx.drawImage(img, 0, 0, size, size);
            URL.revokeObjectURL(url);

            canvas.toBlob(async (blob) => {
                if (blob) {
                    const buffer = await blob.arrayBuffer();
                    resolve(buffer);
                } else {
                    reject(new Error('Failed to create PNG blob'));
                }
            }, 'image/png', 1.0);
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load SVG image'));
        };

        img.src = url;
    });
}

/**
 * Generate proper .ico file with embedded 16x16, 32x32, 48x48 sizes
 */
export async function generateFaviconICO(brand: BrandIdentity): Promise<Blob> {
    const sizes = [16, 32, 48];
    const pngBuffers: ArrayBuffer[] = [];

    for (const size of sizes) {
        const svg = generateFaviconSVG(brand, size);
        const buffer = await svgToPngBuffer(svg, size);
        pngBuffers.push(buffer);
    }

    return encodeICO(pngBuffers, sizes);
}

// ============================================
// APP ICON GENERATION
// ============================================

/**
 * Generate iOS App Icon (1024x1024 with proper padding)
 */
export async function generateIOSAppIcon(brand: BrandIdentity): Promise<Blob> {
    const size = 1024;
    const padding = 0.1; // 10% padding
    const innerSize = size * (1 - padding * 2);

    const logoSvg = getStoredLogoSVG(brand, 'color');
    const viewBoxMatch = logoSvg.match(/viewBox="([^"]+)"/);
    const logoViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';

    const innerContent = logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();

    // iOS requires solid background (no transparency)
    const bgColor = brand.theme.tokens.light.bg || '#FFFFFF';
    const paddingPx = size * padding;

    const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <!-- Solid background (iOS requires no transparency) -->
    <rect width="${size}" height="${size}" fill="${bgColor}"/>
    <!-- Logo with padding -->
    <svg x="${paddingPx}" y="${paddingPx}" width="${innerSize}" height="${innerSize}" viewBox="${logoViewBox}">
        ${innerContent}
    </svg>
</svg>`;

    const buffer = await svgToPngBuffer(appIconSvg, size);
    return new Blob([buffer], { type: 'image/png' });
}

/**
 * Generate Android App Icon (512x512 adaptive icon foreground)
 */
export async function generateAndroidAppIcon(brand: BrandIdentity): Promise<Blob> {
    const size = 512;
    const padding = 0.15; // 15% padding for adaptive icon safe zone
    const innerSize = size * (1 - padding * 2);

    const logoSvg = getStoredLogoSVG(brand, 'color');
    const viewBoxMatch = logoSvg.match(/viewBox="([^"]+)"/);
    const logoViewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';

    const innerContent = logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();

    // Android adaptive icon with background
    const bgColor = brand.theme.tokens.light.primary || brand.theme.tokens.light.bg;
    const paddingPx = size * padding;

    const appIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <!-- Background for adaptive icon -->
    <rect width="${size}" height="${size}" fill="${bgColor}"/>
    <!-- Logo foreground with adaptive icon safe zone padding -->
    <svg x="${paddingPx}" y="${paddingPx}" width="${innerSize}" height="${innerSize}" viewBox="${logoViewBox}">
        ${innerContent}
    </svg>
</svg>`;

    const buffer = await svgToPngBuffer(appIconSvg, size);
    return new Blob([buffer], { type: 'image/png' });
}

/**
 * Generate both iOS and Android app icons
 */
export async function generateAppIcons(brand: BrandIdentity): Promise<{
    ios: Blob;
    android: Blob;
}> {
    const [ios, android] = await Promise.all([
        generateIOSAppIcon(brand),
        generateAndroidAppIcon(brand)
    ]);

    return { ios, android };
}

// ============================================
// PACKAGE GENERATION
// ============================================

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

export interface FaviconPackage {
    files: Array<{
        name: string;
        content: string | Blob;
        type: 'svg' | 'json' | 'html' | 'ico' | 'png';
    }>;
    htmlSnippet: string;
}

/**
 * Generate complete favicon package with .ico file
 */
export async function generateFaviconPackage(brand: BrandIdentity): Promise<FaviconPackage> {
    const faviconSVG = generateFaviconSVG(brand, 32);
    const appleTouchSVG = generateAppleTouchIcon(brand);
    const manifest = generateWebManifest(brand);

    // Generate proper .ico file
    let icoBlob: Blob | null = null;
    try {
        icoBlob = await generateFaviconICO(brand);
    } catch (e) {
        console.error('ICO generation failed:', e);
    }

    const htmlSnippet = `<!-- Favicon Package -->
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="${brand.theme.tokens.light.primary}">`;

    const files: FaviconPackage['files'] = [
        { name: 'favicon.svg', content: faviconSVG, type: 'svg' },
        { name: 'apple-touch-icon.svg', content: appleTouchSVG, type: 'svg' },
        { name: 'site.webmanifest', content: manifest, type: 'json' },
    ];

    if (icoBlob) {
        files.unshift({ name: 'favicon.ico', content: icoBlob, type: 'ico' });
    }

    return {
        files,
        htmlSnippet,
    };
}

/**
 * Legacy sync version for backward compatibility
 */
export function generateFaviconPackageSync(brand: BrandIdentity): {
    files: Array<{ name: string; content: string; type: 'svg' | 'json' | 'html' }>;
    htmlSnippet: string;
} {
    const faviconSVG = generateFaviconSVG(brand, 32);
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
