/**
 * Social Media Kit Generator
 * 
 * Generates profile pictures and banners for various platforms
 * Uses actual brand shape, not just letters
 */

import { BrandIdentity } from './data';

interface SocialAsset {
    platform: string;
    type: 'profile' | 'banner' | 'post';
    width: number;
    height: number;
    svg: string;
    filename: string;
}

/**
 * Get shape scale factor for a target canvas size
 */
function getShapeScale(viewBox: string, targetSize: number): number {
    const parts = viewBox.split(' ');
    const width = parseFloat(parts[2]) || 24;
    return (targetSize * 0.55) / width; // 55% of target to leave padding
}

/**
 * Generate profile picture SVG using brand shape
 */
function generateProfilePic(brand: BrandIdentity, size: number): string {
    const colors = brand.theme.tokens.light;
    const shape = brand.shape;
    const viewBox = shape.viewBox || '0 0 24 24';
    const parts = viewBox.split(' ').map(Number);
    const shapeWidth = parts[2] || 24;
    const shapeHeight = parts[3] || 24;
    const scale = getShapeScale(viewBox, size);
    const offsetX = (size - shapeWidth * scale) / 2;
    const offsetY = (size - shapeHeight * scale) / 2;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="${colors.primary}"/>
    <g transform="translate(${offsetX}, ${offsetY}) scale(${scale})">
        <path d="${shape.path}" fill="white"/>
    </g>
</svg>`;
}

/**
 * Generate banner SVG with brand shape pattern
 */
function generateBanner(brand: BrandIdentity, width: number, height: number): string {
    const colors = brand.theme.tokens.light;
    const shape = brand.shape;
    const viewBox = shape.viewBox || '0 0 24 24';
    const scale = height * 0.4 / 24; // Shape at 40% of banner height

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
        <linearGradient id="banner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors.primary}"/>
            <stop offset="100%" stop-color="${colors.accent || colors.primary}"/>
        </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#banner-grad)"/>
    <!-- Subtle brand pattern -->
    <g opacity="0.1" transform="translate(${width * 0.75}, ${height * 0.2}) scale(${scale})">
        <path d="${shape.path}" fill="white"/>
    </g>
    <g opacity="0.08" transform="translate(${width * 0.85}, ${height * 0.5}) scale(${scale * 0.7})">
        <path d="${shape.path}" fill="white"/>
    </g>
</svg>`;
}

/**
 * Generate complete social media kit
 */
export function generateSocialMediaKit(brand: BrandIdentity): SocialAsset[] {
    const slug = brand.name.toLowerCase().replace(/\s+/g, '-');

    return [
        // Twitter/X
        { platform: 'Twitter', type: 'profile', width: 400, height: 400, svg: generateProfilePic(brand, 400), filename: `${slug}-twitter-profile.svg` },
        { platform: 'Twitter', type: 'banner', width: 1500, height: 500, svg: generateBanner(brand, 1500, 500), filename: `${slug}-twitter-banner.svg` },

        // LinkedIn
        { platform: 'LinkedIn', type: 'profile', width: 400, height: 400, svg: generateProfilePic(brand, 400), filename: `${slug}-linkedin-profile.svg` },
        { platform: 'LinkedIn', type: 'banner', width: 1584, height: 396, svg: generateBanner(brand, 1584, 396), filename: `${slug}-linkedin-banner.svg` },

        // Instagram
        { platform: 'Instagram', type: 'profile', width: 320, height: 320, svg: generateProfilePic(brand, 320), filename: `${slug}-instagram-profile.svg` },

        // General square (for various uses)
        { platform: 'General', type: 'profile', width: 512, height: 512, svg: generateProfilePic(brand, 512), filename: `${slug}-square-512.svg` },
    ];
}

/**
 * Download a single social asset as SVG
 */
export function downloadSocialAsset(asset: SocialAsset, brandName: string): void {
    const blob = new Blob([asset.svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = asset.filename;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Download complete social media kit as ZIP
 */
export async function downloadSocialMediaKitZip(brand: BrandIdentity): Promise<void> {
    const { default: JSZip } = await import('jszip');
    const { saveAs } = await import('file-saver');

    const assets = generateSocialMediaKit(brand);
    const zip = new JSZip();
    const folderName = brand.name.toLowerCase().replace(/\s+/g, '-') + '-social-kit';
    const root = zip.folder(folderName);

    if (!root) return;

    // Organize by platform
    const twitterFolder = root.folder('twitter');
    const linkedinFolder = root.folder('linkedin');
    const instagramFolder = root.folder('instagram');

    assets.forEach(asset => {
        const content = asset.svg;
        const filename = `${asset.type}-${asset.width}x${asset.height}.svg`;

        if (asset.platform === 'Twitter' && twitterFolder) {
            twitterFolder.file(filename, content);
        } else if (asset.platform === 'LinkedIn' && linkedinFolder) {
            linkedinFolder.file(filename, content);
        } else if (asset.platform === 'Instagram' && instagramFolder) {
            instagramFolder.file(filename, content);
        } else {
            root.file(asset.filename, content);
        }
    });

    // Add README
    const readme = `# ${brand.name} Social Media Kit

## Contents

### Twitter/X
- profile-400x400.svg - Profile picture
- banner-1500x500.svg - Header/cover image

### LinkedIn
- profile-400x400.svg - Profile picture
- banner-1584x396.svg - Background image

### Instagram
- profile-320x320.svg - Profile picture

## Usage
Upload the appropriate sized SVG files to each platform.
SVGs can be converted to PNG using any image editor if needed.
`;
    root.file('README.txt', readme);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${folderName}.zip`);
}
