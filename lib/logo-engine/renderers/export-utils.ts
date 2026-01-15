/**
 * Logo Export Utilities
 * 
 * Functions for exporting logos to various formats and sizes
 */

import { GeneratedLogo } from '../types';

// ============================================
// SVG EXPORT
// ============================================

/**
 * Get optimized SVG string for export
 */
export function optimizeSvg(svg: string): string {
    return svg
        // Remove unnecessary whitespace
        .replace(/\s+/g, ' ')
        // Remove comments
        .replace(/<!--.*?-->/g, '')
        // Trim attribute values
        .replace(/"\s+/g, '"')
        .replace(/\s+"/g, '"')
        .trim();
}

/**
 * Create a downloadable SVG file
 */
export function downloadSvg(logo: GeneratedLogo, filename?: string): void {
    const svgContent = optimizeSvg(logo.svg);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${logo.archetype}-v${logo.variant}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

/**
 * Get SVG as data URL
 */
export function svgToDataUrl(svg: string): string {
    const optimized = optimizeSvg(svg);
    const encoded = encodeURIComponent(optimized);
    return `data:image/svg+xml,${encoded}`;
}

// ============================================
// PNG EXPORT
// ============================================

/**
 * Convert SVG to PNG at specified size
 */
export async function svgToPng(
    svg: string,
    size: number = 512
): Promise<Blob> {
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

        const svgUrl = svgToDataUrl(svg);

        img.onload = () => {
            // Clear canvas (transparent background)
            ctx.clearRect(0, 0, size, size);

            // Draw SVG
            ctx.drawImage(img, 0, 0, size, size);

            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject(new Error('Failed to create PNG blob'));
                    }
                },
                'image/png',
                1.0
            );
        };

        img.onerror = () => {
            reject(new Error('Failed to load SVG image'));
        };

        img.src = svgUrl;
    });
}

/**
 * Download logo as PNG at specified size
 */
export async function downloadPng(
    logo: GeneratedLogo,
    size: number = 512,
    filename?: string
): Promise<void> {
    const blob = await svgToPng(logo.svg, size);
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `${logo.archetype}-v${logo.variant}-${size}px.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

/**
 * Generate PNGs at multiple sizes
 */
export async function generateMultipleSizes(
    logo: GeneratedLogo,
    sizes: number[] = [32, 64, 128, 256, 512, 1024]
): Promise<Map<number, Blob>> {
    const results = new Map<number, Blob>();

    for (const size of sizes) {
        const blob = await svgToPng(logo.svg, size);
        results.set(size, blob);
    }

    return results;
}

/**
 * Download all sizes as a zip file (requires JSZip)
 */
export async function downloadAllSizes(
    logo: GeneratedLogo,
    brandName: string,
    sizes: number[] = [32, 64, 128, 256, 512, 1024]
): Promise<void> {
    // Check if JSZip is available
    if (typeof window !== 'undefined' && !(window as any).JSZip) {
        console.warn('JSZip not available. Downloading individual files.');

        // Fallback: download each size individually
        for (const size of sizes) {
            await downloadPng(logo, size, `${brandName}-${size}px.png`);
        }
        return;
    }

    const JSZip = (window as any).JSZip;
    const zip = new JSZip();

    // Add SVG
    zip.file(`${brandName}-logo.svg`, optimizeSvg(logo.svg));

    // Add PNGs at each size
    for (const size of sizes) {
        const blob = await svgToPng(logo.svg, size);
        zip.file(`${brandName}-${size}px.png`, blob);
    }

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${brandName}-logo-package.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}

// ============================================
// FAVICON EXPORT
// ============================================

/**
 * Generate favicon-specific sizes
 */
export async function generateFavicons(
    logo: GeneratedLogo
): Promise<{
    ico16: Blob;
    ico32: Blob;
    png180: Blob;  // Apple touch icon
    png192: Blob;  // Android
    png512: Blob;  // PWA
}> {
    const [ico16, ico32, png180, png192, png512] = await Promise.all([
        svgToPng(logo.svg, 16),
        svgToPng(logo.svg, 32),
        svgToPng(logo.svg, 180),
        svgToPng(logo.svg, 192),
        svgToPng(logo.svg, 512),
    ]);

    return { ico16, ico32, png180, png192, png512 };
}

// ============================================
// SOCIAL MEDIA EXPORT
// ============================================

/**
 * Generate social media avatar sizes
 */
export async function generateSocialAvatars(
    logo: GeneratedLogo
): Promise<{
    twitter: Blob;     // 400x400
    facebook: Blob;    // 170x170
    instagram: Blob;   // 320x320
    linkedin: Blob;    // 300x300
    youtube: Blob;     // 800x800
}> {
    const [twitter, facebook, instagram, linkedin, youtube] = await Promise.all([
        svgToPng(logo.svg, 400),
        svgToPng(logo.svg, 170),
        svgToPng(logo.svg, 320),
        svgToPng(logo.svg, 300),
        svgToPng(logo.svg, 800),
    ]);

    return { twitter, facebook, instagram, linkedin, youtube };
}

// ============================================
// CLIPBOARD EXPORT
// ============================================

/**
 * Copy SVG to clipboard
 */
export async function copySvgToClipboard(logo: GeneratedLogo): Promise<void> {
    await navigator.clipboard.writeText(logo.svg);
}

/**
 * Copy PNG to clipboard (if supported)
 */
export async function copyPngToClipboard(
    logo: GeneratedLogo,
    size: number = 512
): Promise<void> {
    const blob = await svgToPng(logo.svg, size);

    try {
        await navigator.clipboard.write([
            new ClipboardItem({
                'image/png': blob,
            }),
        ]);
    } catch (error) {
        console.error('Clipboard write failed:', error);
        throw new Error('Clipboard access not available');
    }
}

// ============================================
// BATCH EXPORT
// ============================================

export interface ExportConfig {
    format: 'svg' | 'png' | 'both';
    sizes?: number[];
    brandName: string;
}

/**
 * Export multiple logos with configuration
 */
export async function batchExport(
    logos: GeneratedLogo[],
    config: ExportConfig
): Promise<void> {
    for (let i = 0; i < logos.length; i++) {
        const logo = logos[i];
        const baseName = `${config.brandName}-${logo.archetype}-v${logo.variant}`;

        if (config.format === 'svg' || config.format === 'both') {
            downloadSvg(logo, `${baseName}.svg`);
        }

        if (config.format === 'png' || config.format === 'both') {
            const sizes = config.sizes || [512];
            for (const size of sizes) {
                await downloadPng(logo, size, `${baseName}-${size}px.png`);
            }
        }

        // Small delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}
