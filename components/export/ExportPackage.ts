/**
 * Comprehensive Brand Package Export
 *
 * Generates a complete ZIP package with all brand assets.
 * All exports pull from stored state—never regenerate.
 * Selected logo variation is marked as "primary" in exports.
 *
 * CRITICAL: Uses global export state store.
 * Before calling exportBrandPackage(), ensure setExportState() has been called.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BrandIdentity } from '@/lib/data';
import { generateSimpleLogoSVG } from '@/components/export/ExportSVG';
import {
    getStoredLogoSVG,
    generateStoredWordmarkSVG,
    generateStoredFaviconSVG,
    generateDarkLightVariants,
    getLogoVariationsForExport,
    getSelectedLogo,
} from '@/components/logo-engine/renderers/stored-logo-export';
import { generateAllMockups } from '@/components/export/ExportMockups';
import { generateTypographyExport, generateTypographyJSON } from '@/components/export/ExportTypography';
import { generateBrandBookPDF } from '@/components/export/ExportPDF';
import {
    hasValidExportState,
    validateExportState,
    getExportMetadata,
    setExportState,
} from '@/lib/export-state';

// Debug logging
const DEBUG_EXPORTS = true;
function logExport(action: string, data?: Record<string, unknown>) {
    if (DEBUG_EXPORTS) {
        console.log(`[ExportPackage] ${action}`, data ? data : '');
    }
}

// ============================================
// SVG TO PNG CONVERSION
// ============================================

/**
 * Convert SVG string to PNG blob at specified scale
 */
async function svgToPng(svgString: string, width: number, height: number, scale: number = 1): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
        }

        const scaledWidth = width * scale;
        const scaledHeight = height * scale;
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;

        const img = new Image();
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
            URL.revokeObjectURL(url);
            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(blob);
                } else {
                    reject(new Error('Failed to convert canvas to blob'));
                }
            }, 'image/png');
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load SVG'));
        };

        img.src = url;
    });
}

/**
 * Convert SVG to ICO format (multi-size favicon)
 */
async function svgToIco(svgString: string): Promise<Blob> {
    // Create PNGs at standard favicon sizes
    const sizes = [16, 32, 48];
    const pngBlobs: ArrayBuffer[] = [];

    for (const size of sizes) {
        const png = await svgToPng(svgString, size, size, 1);
        pngBlobs.push(await png.arrayBuffer());
    }

    // ICO file format header
    const iconDir = new ArrayBuffer(6 + sizes.length * 16);
    const iconDirView = new DataView(iconDir);

    // ICONDIR structure
    iconDirView.setUint16(0, 0, true); // Reserved
    iconDirView.setUint16(2, 1, true); // Type (1 = ICO)
    iconDirView.setUint16(4, sizes.length, true); // Number of images

    let dataOffset = 6 + sizes.length * 16;
    const imageData: ArrayBuffer[] = [];

    for (let i = 0; i < sizes.length; i++) {
        const size = sizes[i];
        const pngData = pngBlobs[i];
        const entryOffset = 6 + i * 16;

        // ICONDIRENTRY structure
        iconDirView.setUint8(entryOffset, size); // Width
        iconDirView.setUint8(entryOffset + 1, size); // Height
        iconDirView.setUint8(entryOffset + 2, 0); // Color palette
        iconDirView.setUint8(entryOffset + 3, 0); // Reserved
        iconDirView.setUint16(entryOffset + 4, 1, true); // Color planes
        iconDirView.setUint16(entryOffset + 6, 32, true); // Bits per pixel
        iconDirView.setUint32(entryOffset + 8, pngData.byteLength, true); // Image size
        iconDirView.setUint32(entryOffset + 12, dataOffset, true); // Image offset

        imageData.push(pngData);
        dataOffset += pngData.byteLength;
    }

    // Combine header and image data
    const totalSize = 6 + sizes.length * 16 + imageData.reduce((acc, data) => acc + data.byteLength, 0);
    const icoBuffer = new ArrayBuffer(totalSize);
    const icoView = new Uint8Array(icoBuffer);

    icoView.set(new Uint8Array(iconDir), 0);

    let offset = 6 + sizes.length * 16;
    for (const data of imageData) {
        icoView.set(new Uint8Array(data), offset);
        offset += data.byteLength;
    }

    return new Blob([icoBuffer], { type: 'image/x-icon' });
}

// ============================================
// SOCIAL MEDIA SIZES
// ============================================

interface SocialSize {
    name: string;
    width: number;
    height: number;
    platform: string;
}

const SOCIAL_SIZES: SocialSize[] = [
    // Twitter/X
    { name: 'twitter-profile', width: 400, height: 400, platform: 'Twitter' },
    { name: 'twitter-header', width: 1500, height: 500, platform: 'Twitter' },
    { name: 'twitter-post', width: 1200, height: 675, platform: 'Twitter' },
    // LinkedIn
    { name: 'linkedin-profile', width: 400, height: 400, platform: 'LinkedIn' },
    { name: 'linkedin-banner', width: 1584, height: 396, platform: 'LinkedIn' },
    { name: 'linkedin-post', width: 1200, height: 627, platform: 'LinkedIn' },
    // Instagram
    { name: 'instagram-profile', width: 320, height: 320, platform: 'Instagram' },
    { name: 'instagram-post', width: 1080, height: 1080, platform: 'Instagram' },
    { name: 'instagram-story', width: 1080, height: 1920, platform: 'Instagram' },
    // Discord
    { name: 'discord-avatar', width: 512, height: 512, platform: 'Discord' },
    { name: 'discord-banner', width: 960, height: 540, platform: 'Discord' },
    // YouTube
    { name: 'youtube-profile', width: 800, height: 800, platform: 'YouTube' },
    { name: 'youtube-banner', width: 2560, height: 1440, platform: 'YouTube' },
    { name: 'youtube-thumbnail', width: 1280, height: 720, platform: 'YouTube' },
];

// ============================================
// FAVICON SIZES
// ============================================

interface FaviconSize {
    name: string;
    size: number;
    format: 'png' | 'ico';
}

const FAVICON_SIZES: FaviconSize[] = [
    { name: 'favicon-16x16', size: 16, format: 'png' },
    { name: 'favicon-32x32', size: 32, format: 'png' },
    { name: 'favicon-48x48', size: 48, format: 'png' },
    { name: 'apple-touch-icon', size: 180, format: 'png' },
    { name: 'android-chrome-192x192', size: 192, format: 'png' },
    { name: 'android-chrome-512x512', size: 512, format: 'png' },
    { name: 'mstile-150x150', size: 150, format: 'png' },
];

// ============================================
// GENERATE SOCIAL MEDIA SVG
// ============================================

function generateSocialSVG(brand: BrandIdentity, size: SocialSize): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'Arial, sans-serif';
    const isSquare = size.width === size.height;
    const isWide = size.width > size.height * 2;

    // Get logo SVG content
    const logoSvg = getStoredLogoSVG(brand, 'color');
    const logoContent = logoSvg
        .replace(/<\?xml[^?]*\?>/g, '')
        .replace(/<svg[^>]*>/g, '')
        .replace(/<\/svg>/g, '')
        .trim();

    if (isSquare) {
        // Profile picture - centered logo
        const padding = size.width * 0.15;
        const logoSize = size.width - padding * 2;
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
    <rect width="${size.width}" height="${size.height}" fill="${colors.primary}"/>
    <svg x="${padding}" y="${padding}" width="${logoSize}" height="${logoSize}" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
        ${logoContent}
    </svg>
</svg>`;
    } else if (isWide) {
        // Banner - logo left, brand name right
        const logoSize = size.height * 0.5;
        const logoY = (size.height - logoSize) / 2;
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
    <rect width="${size.width}" height="${size.height}" fill="${colors.primary}"/>
    <svg x="${size.height * 0.3}" y="${logoY}" width="${logoSize}" height="${logoSize}" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
        ${logoContent}
    </svg>
    <text x="${size.height * 0.3 + logoSize + 40}" y="${size.height / 2 + 10}" font-family="${fontFamily}" font-size="${size.height * 0.15}" font-weight="700" fill="${colors.bg}">${brand.name}</text>
</svg>`;
    } else {
        // Post format - centered content
        const logoSize = Math.min(size.width, size.height) * 0.3;
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}">
    <rect width="${size.width}" height="${size.height}" fill="${colors.primary}"/>
    <svg x="${(size.width - logoSize) / 2}" y="${size.height * 0.3}" width="${logoSize}" height="${logoSize}" viewBox="0 0 100 100" style="filter: brightness(0) invert(1);">
        ${logoContent}
    </svg>
    <text x="${size.width / 2}" y="${size.height * 0.7}" font-family="${fontFamily}" font-size="${size.height * 0.06}" font-weight="700" fill="${colors.bg}" text-anchor="middle">${brand.name}</text>
</svg>`;
    }
}

// ============================================
// MAIN EXPORT FUNCTION
// ============================================

export async function exportBrandPackage(brand: BrandIdentity) {
    // ========================================================================
    // VALIDATION: Ensure export state exists
    // ========================================================================
    logExport('Starting brand package export', { brandName: brand.name, brandId: brand.id });

    // If no export state, set it from brand data
    if (!hasValidExportState()) {
        logExport('WARNING: No export state set, initializing from brand data');
        const selectedLogo = getSelectedLogo(brand);
        const storedSvg = selectedLogo?.svg || '';
        if (storedSvg) {
            setExportState(brand, storedSvg, selectedLogo);
        } else {
            logExport('ERROR: No stored SVG found in brand data');
        }
    }

    // Log export metadata
    const metadata = getExportMetadata();
    if (metadata) {
        logExport('Exporting brand ID: ' + metadata.brandId, metadata);
    }

    const zip = new JSZip();
    const folderName = brand.name.toLowerCase().replace(/\s+/g, '-');
    const root = zip.folder(folderName);

    if (!root) {
        console.error("Failed to create zip folder");
        return;
    }

    const colors = brand.theme.tokens.light;
    const darkColors = brand.theme.tokens.dark;

    // Get selected logo info for "primary" marking
    const selectedLogo = getSelectedLogo(brand);
    const selectedLogoIndex = brand.selectedLogoIndex ?? 0;

    logExport('Selected logo info', {
        index: selectedLogoIndex,
        id: selectedLogo?.id,
        algorithm: selectedLogo?.algorithm,
        hasSvg: !!selectedLogo?.svg,
    });

    // ========================================================================
    // 1. /logos FOLDER - All 6 variations as SVG + PNG @1x, @2x, @3x
    // ========================================================================
    const logos = root.folder("logos");
    if (logos) {
        const logoVariations = getLogoVariationsForExport(brand);
        const baseLogoSvg = getStoredLogoSVG(brand, 'color');

        // Parse viewBox to get dimensions
        const viewBoxMatch = baseLogoSvg.match(/viewBox="([^"]+)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1].split(' ').map(Number) : [0, 0, 100, 100];
        const baseWidth = viewBox[2] || 100;
        const baseHeight = viewBox[3] || 100;

        // Standard export size (1x = 256px on longest side)
        const scale1x = 256 / Math.max(baseWidth, baseHeight);
        const width1x = Math.round(baseWidth * scale1x);
        const height1x = Math.round(baseHeight * scale1x);

        // Variation configs with primary marking
        const variations = [
            { key: 'horizontal', name: 'horizontal', svg: logoVariations.horizontal, isPrimary: false },
            { key: 'stacked', name: 'stacked', svg: logoVariations.stacked, isPrimary: false },
            { key: 'icon-only', name: 'icon-only', svg: logoVariations.iconOnly, isPrimary: true }, // Icon is primary
            { key: 'wordmark-only', name: 'wordmark-only', svg: logoVariations.wordmarkOnly, isPrimary: false },
            { key: 'dark', name: 'dark', svg: logoVariations.dark, isPrimary: false },
            { key: 'light', name: 'light', svg: logoVariations.light, isPrimary: false },
        ];

        // Export each variation
        for (const variation of variations) {
            if (!variation.svg) continue;

            const prefix = variation.isPrimary ? 'primary-' : '';

            // SVG
            logos.file(`${prefix}logo-${variation.name}.svg`, variation.svg);

            // PNG at 1x, 2x, 3x
            try {
                const png1x = await svgToPng(variation.svg, width1x, height1x, 1);
                const png2x = await svgToPng(variation.svg, width1x, height1x, 2);
                const png3x = await svgToPng(variation.svg, width1x, height1x, 3);

                logos.file(`${prefix}logo-${variation.name}@1x.png`, png1x);
                logos.file(`${prefix}logo-${variation.name}@2x.png`, png2x);
                logos.file(`${prefix}logo-${variation.name}@3x.png`, png3x);
            } catch (e) {
                console.error(`Failed to generate PNG for ${variation.name}:`, e);
            }
        }

        // Also include wordmark versions
        const wordmarkColor = generateStoredWordmarkSVG(brand, 'color');
        const wordmarkBlack = generateStoredWordmarkSVG(brand, 'black');
        const wordmarkWhite = generateStoredWordmarkSVG(brand, 'white');

        logos.file('wordmark-color.svg', wordmarkColor);
        logos.file('wordmark-black.svg', wordmarkBlack);
        logos.file('wordmark-white.svg', wordmarkWhite);

        // Logo metadata JSON
        const logoMetadata = {
            brand: brand.name,
            selectedVariation: 'icon-only',
            algorithm: selectedLogo?.algorithm || 'custom',
            variations: variations.filter(v => v.svg).map(v => ({
                name: v.name,
                isPrimary: v.isPrimary,
                files: {
                    svg: `logo-${v.name}.svg`,
                    png1x: `logo-${v.name}@1x.png`,
                    png2x: `logo-${v.name}@2x.png`,
                    png3x: `logo-${v.name}@3x.png`,
                }
            })),
            exportedAt: new Date().toISOString(),
        };
        logos.file('logo-metadata.json', JSON.stringify(logoMetadata, null, 2));
    }

    // ========================================================================
    // 2. /mockups FOLDER - All mockups as PNG
    // ========================================================================
    const mockups = root.folder("mockups");
    if (mockups) {
        const allMockups = generateAllMockups(brand);

        for (const mockup of allMockups) {
            // SVG version
            mockups.file(mockup.filename, mockup.svg);

            // PNG version
            try {
                const pngBlob = await svgToPng(mockup.svg, mockup.width, mockup.height, 1);
                const pngFilename = mockup.filename.replace('.svg', '.png');
                mockups.file(pngFilename, pngBlob);
            } catch (e) {
                console.error(`Failed to generate PNG for ${mockup.filename}:`, e);
            }
        }
    }

    // ========================================================================
    // 3. /typography FOLDER - Font specimen and CSS
    // ========================================================================
    const typography = root.folder("typography");
    if (typography) {
        const typoExport = generateTypographyExport(brand);

        // fonts.css with Google Fonts imports
        const fontsCss = `/* ${brand.name} Typography */
/* Generated by Glyph */

/* Google Fonts Import */
@import url('${typoExport.googleFontsUrl}');

/* Font Variables */
:root {
    --font-display: '${brand.font.headingName || brand.font.name}', system-ui, sans-serif;
    --font-body: '${brand.font.bodyName || brand.font.name}', system-ui, sans-serif;
    ${brand.font.monoName ? `--font-mono: '${brand.font.monoName}', monospace;` : ''}

    /* Type Scale */
    --text-xs: 0.75rem;     /* 12px */
    --text-sm: 0.875rem;    /* 14px */
    --text-base: 1rem;      /* 16px */
    --text-lg: 1.125rem;    /* 18px */
    --text-xl: 1.25rem;     /* 20px */
    --text-2xl: 1.5rem;     /* 24px */
    --text-3xl: 1.875rem;   /* 30px */
    --text-4xl: 2.25rem;    /* 36px */
    --text-5xl: 3rem;       /* 48px */
    --text-6xl: 3.75rem;    /* 60px */

    /* Line Heights */
    --leading-tight: 1.25;
    --leading-normal: 1.5;
    --leading-relaxed: 1.75;

    /* Font Weights */
    --font-light: 300;
    --font-normal: 400;
    --font-medium: 500;
    --font-semibold: 600;
    --font-bold: 700;
}

/* Heading Styles */
h1, .h1 {
    font-family: var(--font-display);
    font-size: var(--text-4xl);
    font-weight: var(--font-bold);
    line-height: var(--leading-tight);
}

h2, .h2 {
    font-family: var(--font-display);
    font-size: var(--text-3xl);
    font-weight: var(--font-semibold);
    line-height: var(--leading-tight);
}

h3, .h3 {
    font-family: var(--font-display);
    font-size: var(--text-2xl);
    font-weight: var(--font-semibold);
    line-height: var(--leading-tight);
}

/* Body Styles */
body, p {
    font-family: var(--font-body);
    font-size: var(--text-base);
    font-weight: var(--font-normal);
    line-height: var(--leading-normal);
}

/* Code Styles */
code, pre {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
}
`;
        typography.file('fonts.css', fontsCss);

        // Typography specimen SVG
        typography.file('typography-specimen.svg', typoExport.specimenSvg);

        // Typography specimen PNG
        try {
            const specimenPng = await svgToPng(typoExport.specimenSvg, 800, 600, 2);
            typography.file('font-specimen.png', specimenPng);
        } catch (e) {
            console.error('Failed to generate typography specimen PNG:', e);
        }

        // Typography JSON metadata
        typography.file('typography.json', generateTypographyJSON(brand));

        // Google Fonts import snippet
        typography.file('google-fonts-import.html', `<!-- Google Fonts Import -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${typoExport.googleFontsUrl}" rel="stylesheet">`);
    }

    // ========================================================================
    // 4. /colors FOLDER - Palette and config files
    // ========================================================================
    const colorsFolder = root.folder("colors");
    if (colorsFolder) {
        // palette.json
        const palette = {
            brand: brand.name,
            light: {
                primary: colors.primary,
                accent: colors.accent,
                background: colors.bg,
                surface: colors.surface,
                text: colors.text,
                muted: colors.muted,
                border: colors.border,
            },
            dark: darkColors ? {
                primary: darkColors.primary,
                accent: darkColors.accent,
                background: darkColors.bg,
                surface: darkColors.surface,
                text: darkColors.text,
                muted: darkColors.muted,
                border: darkColors.border,
            } : null,
            exportedAt: new Date().toISOString(),
        };
        colorsFolder.file('palette.json', JSON.stringify(palette, null, 2));

        // tailwind.config.js
        const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '${colors.primary}',
                    accent: '${colors.accent || colors.primary}',
                    background: '${colors.bg}',
                    surface: '${colors.surface}',
                    text: '${colors.text}',
                    muted: '${colors.muted || '#666666'}',
                    border: '${colors.border || '#e5e5e5'}',
                },
                dark: {
                    primary: '${darkColors?.primary || colors.primary}',
                    accent: '${darkColors?.accent || colors.accent || colors.primary}',
                    background: '${darkColors?.bg || '#0a0a0a'}',
                    surface: '${darkColors?.surface || '#1a1a1a'}',
                    text: '${darkColors?.text || '#ffffff'}',
                    muted: '${darkColors?.muted || '#888888'}',
                    border: '${darkColors?.border || '#333333'}',
                },
            },
            fontFamily: {
                display: ['${brand.font.headingName || brand.font.name}', 'sans-serif'],
                body: ['${brand.font.bodyName || brand.font.name}', 'sans-serif'],
                ${brand.font.monoName ? `mono: ['${brand.font.monoName}', 'monospace'],` : ''}
            },
        },
    },
    plugins: [],
};`;
        colorsFolder.file('tailwind.config.js', tailwindConfig);

        // colors.css with CSS variables
        const colorsCss = `/* ${brand.name} Color System */
/* Generated by Glyph */

:root {
    /* Light Mode Colors */
    --color-primary: ${colors.primary};
    --color-accent: ${colors.accent || colors.primary};
    --color-background: ${colors.bg};
    --color-surface: ${colors.surface};
    --color-text: ${colors.text};
    --color-muted: ${colors.muted || '#666666'};
    --color-border: ${colors.border || '#e5e5e5'};
}

@media (prefers-color-scheme: dark) {
    :root {
        /* Dark Mode Colors */
        --color-primary: ${darkColors?.primary || colors.primary};
        --color-accent: ${darkColors?.accent || colors.accent || colors.primary};
        --color-background: ${darkColors?.bg || '#0a0a0a'};
        --color-surface: ${darkColors?.surface || '#1a1a1a'};
        --color-text: ${darkColors?.text || '#ffffff'};
        --color-muted: ${darkColors?.muted || '#888888'};
        --color-border: ${darkColors?.border || '#333333'};
    }
}

/* Manual Dark Mode Class */
.dark {
    --color-primary: ${darkColors?.primary || colors.primary};
    --color-accent: ${darkColors?.accent || colors.accent || colors.primary};
    --color-background: ${darkColors?.bg || '#0a0a0a'};
    --color-surface: ${darkColors?.surface || '#1a1a1a'};
    --color-text: ${darkColors?.text || '#ffffff'};
    --color-muted: ${darkColors?.muted || '#888888'};
    --color-border: ${darkColors?.border || '#333333'};
}`;
        colorsFolder.file('colors.css', colorsCss);
    }

    // ========================================================================
    // 5. /guidelines FOLDER - Brand Guidelines PDF
    // ========================================================================
    const guidelines = root.folder("guidelines");
    if (guidelines) {
        try {
            const pdfBlob = await generateBrandBookPDF(brand);
            guidelines.file('brand-guidelines.pdf', pdfBlob);
        } catch (e) {
            console.error('Failed to generate brand guidelines PDF:', e);
        }
    }

    // ========================================================================
    // 6. /social FOLDER - Sized assets for all platforms
    // ========================================================================
    const social = root.folder("social");
    if (social) {
        for (const size of SOCIAL_SIZES) {
            const svg = generateSocialSVG(brand, size);

            // SVG version
            social.file(`${size.name}.svg`, svg);

            // PNG version
            try {
                const pngBlob = await svgToPng(svg, size.width, size.height, 1);
                social.file(`${size.name}.png`, pngBlob);
            } catch (e) {
                console.error(`Failed to generate PNG for ${size.name}:`, e);
            }
        }

        // Social media metadata
        const socialMetadata = {
            brand: brand.name,
            platforms: ['Twitter', 'LinkedIn', 'Instagram', 'Discord', 'YouTube'],
            sizes: SOCIAL_SIZES.map(s => ({
                name: s.name,
                platform: s.platform,
                dimensions: `${s.width}x${s.height}`,
                files: {
                    svg: `${s.name}.svg`,
                    png: `${s.name}.png`,
                }
            })),
            exportedAt: new Date().toISOString(),
        };
        social.file('social-metadata.json', JSON.stringify(socialMetadata, null, 2));
    }

    // ========================================================================
    // 7. /favicon FOLDER - All favicon sizes
    // ========================================================================
    const favicon = root.folder("favicon");
    if (favicon) {
        const faviconSvg = generateStoredFaviconSVG(brand);

        // favicon.svg
        favicon.file('favicon.svg', faviconSvg);

        // Generate all PNG sizes
        for (const size of FAVICON_SIZES) {
            try {
                const pngBlob = await svgToPng(faviconSvg, size.size, size.size, 1);
                favicon.file(`${size.name}.png`, pngBlob);
            } catch (e) {
                console.error(`Failed to generate favicon ${size.name}:`, e);
            }
        }

        // Generate favicon.ico
        try {
            const icoBlob = await svgToIco(faviconSvg);
            favicon.file('favicon.ico', icoBlob);
        } catch (e) {
            console.error('Failed to generate favicon.ico:', e);
        }

        // Web manifest
        const manifest = {
            name: brand.name,
            short_name: brand.name,
            icons: [
                { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
                { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
            ],
            theme_color: colors.primary,
            background_color: colors.bg,
            display: 'standalone',
        };
        favicon.file('site.webmanifest', JSON.stringify(manifest, null, 2));

        // Browser config for Microsoft
        const browserConfig = `<?xml version="1.0" encoding="utf-8"?>
<browserconfig>
    <msapplication>
        <tile>
            <square150x150logo src="/mstile-150x150.png"/>
            <TileColor>${colors.primary}</TileColor>
        </tile>
    </msapplication>
</browserconfig>`;
        favicon.file('browserconfig.xml', browserConfig);

        // HTML snippet for favicon usage
        const faviconHtml = `<!-- Favicon HTML Snippet -->
<!-- Add these to your <head> section -->

<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${colors.primary}">
<meta name="theme-color" content="${colors.primary}">`;
        favicon.file('favicon-usage.html', faviconHtml);
    }

    // ========================================================================
    // 8. README.md - Complete documentation
    // ========================================================================
    const readme = `# ${brand.name} Brand Assets

> Generated by [Glyph](https://glyph.software) on ${new Date().toLocaleDateString()}

## Package Contents

\`\`\`
${folderName}/
├── logos/                    # Logo files in all variations
│   ├── primary-logo-icon-only.svg    # PRIMARY - Main logo mark
│   ├── logo-horizontal.svg           # Horizontal lockup
│   ├── logo-stacked.svg              # Stacked lockup
│   ├── logo-wordmark-only.svg        # Text only
│   ├── logo-dark.svg                 # For light backgrounds
│   ├── logo-light.svg                # For dark backgrounds
│   └── *@1x.png, *@2x.png, *@3x.png  # PNG at multiple resolutions
│
├── mockups/                  # Brand application mockups
│   ├── mockup-business-card.png      # 3D business card
│   ├── mockup-linkedin-banner.png    # LinkedIn profile banner
│   ├── mockup-website-header.png     # Browser mockup
│   ├── mockup-mobile-app.png         # iPhone mockup
│   ├── mockup-poster.png             # Large format poster
│   ├── mockup-letterhead.png         # A4 document
│   ├── mockup-billboard.png          # Outdoor advertising
│   ├── mockup-phone-screen.png       # App interface
│   ├── mockup-laptop-screen.png      # MacBook display
│   ├── mockup-storefront-sign.png    # Store signage
│   ├── mockup-packaging-box.png      # Product packaging
│   ├── mockup-hoodie.png             # Apparel mockup
│   ├── mockup-tote-bag.png           # Canvas tote bag
│   └── mockup-coffee-cup.png         # Ceramic mug
│
├── typography/               # Font files and specimens
│   ├── fonts.css             # CSS with Google Fonts imports
│   ├── font-specimen.png     # Visual font specimen
│   └── typography.json       # Font metadata
│
├── colors/                   # Color palette files
│   ├── palette.json          # All colors with HEX, RGB
│   ├── tailwind.config.js    # Tailwind CSS configuration
│   └── colors.css            # CSS custom properties
│
├── guidelines/               # Brand documentation
│   └── brand-guidelines.pdf  # 20+ page brand guidelines
│
├── social/                   # Social media assets
│   ├── twitter-*.png         # Twitter profile, header, post
│   ├── linkedin-*.png        # LinkedIn profile, banner, post
│   ├── instagram-*.png       # Instagram profile, post, story
│   ├── discord-*.png         # Discord avatar, banner
│   └── youtube-*.png         # YouTube profile, banner, thumbnail
│
├── favicon/                  # Browser and app icons
│   ├── favicon.ico           # Multi-size ICO file
│   ├── favicon.svg           # Scalable SVG favicon
│   ├── apple-touch-icon.png  # iOS home screen (180x180)
│   ├── android-chrome-*.png  # Android icons
│   └── site.webmanifest      # PWA manifest
│
└── README.md                 # This file
\`\`\`

## Logo Usage

### Primary Logo
The **icon-only** version is marked as the primary logo. Use this for:
- App icons and favicons
- Social media profile pictures
- Small spaces where text won't be legible

### Logo Variations
| Variation | Best For |
|-----------|----------|
| \`horizontal\` | Website headers, business cards, wide formats |
| \`stacked\` | Social media, square formats, app splash screens |
| \`icon-only\` | Favicons, avatars, small spaces |
| \`wordmark-only\` | Co-branding, when icon is shown elsewhere |
| \`dark\` | Use on white/light backgrounds |
| \`light\` | Use on black/dark/colored backgrounds |

### Resolution Guide
- \`@1x\` - Standard screens (256px)
- \`@2x\` - Retina/HiDPI screens (512px)
- \`@3x\` - Super Retina screens (768px)

## Typography

**Display Font:** ${brand.font.headingName || brand.font.name}
**Body Font:** ${brand.font.bodyName || brand.font.name}
${brand.font.monoName ? `**Mono Font:** ${brand.font.monoName}` : ''}

Import fonts via Google Fonts (see \`typography/fonts.css\`).

## Color Palette

### Light Mode
| Color | Value | Usage |
|-------|-------|-------|
| Primary | \`${colors.primary}\` | CTAs, links, brand accents |
| Background | \`${colors.bg}\` | Page backgrounds |
| Surface | \`${colors.surface}\` | Cards, modals |
| Text | \`${colors.text}\` | Body copy |

### Dark Mode
${darkColors ? `
| Color | Value | Usage |
|-------|-------|-------|
| Primary | \`${darkColors.primary}\` | CTAs, links, brand accents |
| Background | \`${darkColors.bg}\` | Page backgrounds |
| Surface | \`${darkColors.surface}\` | Cards, modals |
| Text | \`${darkColors.text}\` | Body copy |
` : 'Dark mode colors are automatically derived from light mode.'}

## Integration

### Tailwind CSS
Copy \`colors/tailwind.config.js\` to your project root.

### CSS Variables
Import \`colors/colors.css\` and \`typography/fonts.css\` in your stylesheet.

### React/Next.js
Use the CSS variables or import the Tailwind config.

## Brand Guidelines

See \`guidelines/brand-guidelines.pdf\` for complete usage instructions including:
- Logo clear space rules
- Minimum size requirements
- Color usage do's and don'ts
- Typography specimens
- Application examples

---

*Generated by Glyph • https://glyph.software*
`;

    root.file('README.md', readme);

    // ========================================================================
    // GENERATE AND DOWNLOAD ZIP
    // ========================================================================
    const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 }
    });

    saveAs(content, `${folderName}-brand-assets.zip`);
}
