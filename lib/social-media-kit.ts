/**
 * Social Media Kit Generator
 * 
 * Generates profile pictures and banners for various platforms
 */

import { BrandIdentity } from './data';

interface SocialAsset {
    platform: string;
    type: 'profile' | 'banner' | 'post';
    width: number;
    height: number;
    svg: string;
}

/**
 * Generate profile picture SVG
 */
function generateProfilePic(brand: BrandIdentity, size: number): string {
    const initial = brand.name.charAt(0).toUpperCase();
    const colors = brand.theme.tokens.light;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
    <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="${colors.primary}"/>
    <text x="${size / 2}" y="${size * 0.68}" font-size="${size * 0.5}" font-weight="800" text-anchor="middle" fill="white" font-family="system-ui, -apple-system, sans-serif">${initial}</text>
</svg>`;
}

/**
 * Generate banner SVG
 */
function generateBanner(brand: BrandIdentity, width: number, height: number): string {
    const colors = brand.theme.tokens.light;

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
        <linearGradient id="banner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors.primary}"/>
            <stop offset="100%" stop-color="${colors.accent || colors.primary}"/>
        </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#banner-grad)"/>
    <text x="${width * 0.05}" y="${height * 0.6}" font-size="${height * 0.25}" font-weight="700" fill="white" font-family="system-ui" opacity="0.15">${brand.name}</text>
</svg>`;
}

/**
 * Generate complete social media kit
 */
export function generateSocialMediaKit(brand: BrandIdentity): SocialAsset[] {
    return [
        // Twitter/X
        { platform: 'Twitter', type: 'profile', width: 400, height: 400, svg: generateProfilePic(brand, 400) },
        { platform: 'Twitter', type: 'banner', width: 1500, height: 500, svg: generateBanner(brand, 1500, 500) },

        // LinkedIn
        { platform: 'LinkedIn', type: 'profile', width: 400, height: 400, svg: generateProfilePic(brand, 400) },
        { platform: 'LinkedIn', type: 'banner', width: 1584, height: 396, svg: generateBanner(brand, 1584, 396) },

        // Instagram
        { platform: 'Instagram', type: 'profile', width: 320, height: 320, svg: generateProfilePic(brand, 320) },

        // GitHub
        { platform: 'GitHub', type: 'profile', width: 460, height: 460, svg: generateProfilePic(brand, 460) },

        // YouTube
        { platform: 'YouTube', type: 'profile', width: 800, height: 800, svg: generateProfilePic(brand, 800) },
        { platform: 'YouTube', type: 'banner', width: 2560, height: 1440, svg: generateBanner(brand, 2560, 1440) },
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
    link.download = `${brandName.toLowerCase().replace(/\s+/g, '-')}-${asset.platform.toLowerCase()}-${asset.type}.svg`;
    link.click();
    URL.revokeObjectURL(url);
}
