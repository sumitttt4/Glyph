/**
 * Social Media Kit Generator
 *
 * Generates branded social media assets in standard platform sizes.
 * Uses stored logo SVG to ensure exports match preview exactly.
 *
 * CRITICAL: All exports use getStoredLogoSVG() which pulls from global export state.
 * Never regenerates logos - always uses what was displayed in preview.
 */

import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { BrandIdentity } from '@/lib/data';
import { getStoredLogoSVG } from '@/components/logo-engine/renderers/stored-logo-export';
import { hasValidExportState, validateExportState } from '@/lib/export-state';

// Debug logging
const DEBUG = true;
function logSocial(action: string, data?: Record<string, unknown>) {
    if (DEBUG) {
        console.log(`[ExportSocial] ${action}`, data ? data : '');
    }
}

// Standard social media dimensions (2024 specs)
export const SOCIAL_MEDIA_SIZES = {
  // Instagram
  instagram_post: { width: 1080, height: 1080, label: 'Instagram Post' },
  instagram_story: { width: 1080, height: 1920, label: 'Instagram Story' },
  instagram_profile: { width: 320, height: 320, label: 'Instagram Profile' },

  // Facebook
  facebook_post: { width: 1200, height: 630, label: 'Facebook Post' },
  facebook_cover: { width: 820, height: 312, label: 'Facebook Cover' },

  // Twitter/X
  twitter_post: { width: 1200, height: 675, label: 'Twitter/X Post' },
  twitter_header: { width: 1500, height: 500, label: 'Twitter/X Header' },

  // LinkedIn
  linkedin_post: { width: 1200, height: 627, label: 'LinkedIn Post' },
  linkedin_banner: { width: 1584, height: 396, label: 'LinkedIn Banner' },

  // YouTube
  youtube_thumbnail: { width: 1280, height: 720, label: 'YouTube Thumbnail' },
  youtube_banner: { width: 2560, height: 1440, label: 'YouTube Banner' },
  youtube_profile: { width: 800, height: 800, label: 'YouTube Profile' },

  // TikTok
  tiktok: { width: 1080, height: 1920, label: 'TikTok' },

  // Threads (Meta)
  threads_post: { width: 1080, height: 1080, label: 'Threads Post' },
  threads_story: { width: 1080, height: 1920, label: 'Threads Story' },
  threads_profile: { width: 400, height: 400, label: 'Threads Profile' },

  // Discord
  discord_server_icon: { width: 512, height: 512, label: 'Discord Server Icon' },
  discord_server_banner: { width: 960, height: 540, label: 'Discord Server Banner' },
  discord_profile: { width: 128, height: 128, label: 'Discord Profile' },
} as const;

export type SocialMediaPlatform = keyof typeof SOCIAL_MEDIA_SIZES;

export interface SocialMediaAsset {
  platform: SocialMediaPlatform;
  svg: string;
  width: number;
  height: number;
  label: string;
}

/**
 * Generate an SVG template for a social media platform
 * USES STORED SVG - never regenerates
 */
function generateSocialMediaSVG(
  brand: BrandIdentity,
  width: number,
  height: number,
  variant: 'light' | 'dark' = 'light'
): string {
  logSocial('Generating social SVG', {
    brandName: brand.name,
    dimensions: `${width}x${height}`,
    variant,
    hasExportState: hasValidExportState(),
  });

  // Use stored logo SVG - ensures exact match with preview
  const logoSvg = getStoredLogoSVG(brand, 'color');
  // Extract the inner content of the logo SVG (without the XML declaration and outer svg tag)
  const logoContent = logoSvg
    .replace(/<\?xml[^?]*\?>/g, '')
    .replace(/<svg[^>]*>/g, '')
    .replace(/<\/svg>/g, '')
    .trim();

  const bgColor = variant === 'light'
    ? brand.theme.tokens.light.bg
    : brand.theme.tokens.dark?.bg || brand.theme.tokens.light.text;

  const textColor = variant === 'light'
    ? brand.theme.tokens.light.text
    : brand.theme.tokens.dark?.text || brand.theme.tokens.light.bg;

  const primaryColor = brand.theme.tokens.light.primary;

  // Calculate logo size (responsive to canvas)
  const logoSize = Math.min(width, height) * 0.3;
  const logoX = (width - logoSize) / 2;
  const logoY = (height - logoSize) / 2 - (height * 0.05);

  // Text positioning
  const nameY = logoY + logoSize + 40;
  const taglineY = nameY + 30;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="${bgColor}"/>

  <!-- Logo -->
  <g transform="translate(${logoX}, ${logoY}) scale(${logoSize / 100})">
    ${logoContent}
  </g>

  <!-- Brand Name -->
  <text
    x="${width / 2}"
    y="${nameY}"
    font-family="${brand.font.heading}, system-ui, sans-serif"
    font-size="${Math.min(width, height) * 0.06}"
    font-weight="700"
    fill="${textColor}"
    text-anchor="middle"
  >
    ${brand.name}
  </text>

  ${brand.strategy?.tagline ? `
  <!-- Tagline -->
  <text
    x="${width / 2}"
    y="${taglineY}"
    font-family="${brand.font.body}, system-ui, sans-serif"
    font-size="${Math.min(width, height) * 0.03}"
    fill="${primaryColor}"
    text-anchor="middle"
  >
    ${brand.strategy.tagline}
  </text>
  ` : ''}
</svg>`;
}

/**
 * Generate a complete social media kit for all platforms
 */
export function generateSocialMediaKit(brand: BrandIdentity): SocialMediaAsset[] {
  const assets: SocialMediaAsset[] = [];

  for (const [platform, size] of Object.entries(SOCIAL_MEDIA_SIZES)) {
    assets.push({
      platform: platform as SocialMediaPlatform,
      svg: generateSocialMediaSVG(brand, size.width, size.height, 'light'),
      width: size.width,
      height: size.height,
      label: size.label,
    });
  }

  return assets;
}

/**
 * Download a single social media asset as SVG
 */
export function downloadSocialAsset(
  brand: BrandIdentity,
  platform: SocialMediaPlatform,
  variant: 'light' | 'dark' = 'light'
): void {
  const size = SOCIAL_MEDIA_SIZES[platform];
  const svg = generateSocialMediaSVG(brand, size.width, size.height, variant);

  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const fileName = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-${platform}-${variant}.svg`;
  saveAs(blob, fileName);
}

/**
 * Download complete social media kit as ZIP
 */
export async function downloadSocialMediaKitZip(brand: BrandIdentity): Promise<void> {
  const zip = new JSZip();
  const folderName = brand.name.toLowerCase().replace(/\s+/g, '-');
  const root = zip.folder(`${folderName}-social-media-kit`);

  if (!root) {
    console.error('Failed to create zip folder');
    return;
  }

  // Generate assets for each platform in both light and dark variants
  for (const [platform, size] of Object.entries(SOCIAL_MEDIA_SIZES)) {
    const platformFolder = root.folder(platform);
    if (platformFolder) {
      // Light variant
      const lightSvg = generateSocialMediaSVG(brand, size.width, size.height, 'light');
      platformFolder.file(`${platform}-light.svg`, lightSvg);

      // Dark variant
      const darkSvg = generateSocialMediaSVG(brand, size.width, size.height, 'dark');
      platformFolder.file(`${platform}-dark.svg`, darkSvg);
    }
  }

  // Add README
  const readme = `# ${brand.name} Social Media Kit
Generated by Glyph (https://glyph.software)

## Contents
This kit contains branded templates for major social media platforms.

## Platforms Included
${Object.entries(SOCIAL_MEDIA_SIZES)
      .map(([platform, size]) => `- ${size.label}: ${size.width}x${size.height}px`)
      .join('\n')}

## Variants
Each platform includes:
- Light variant (light background)
- Dark variant (dark background)

## Usage
These SVG templates can be:
1. Used directly as social media posts
2. Imported into design tools (Figma, Canva, etc.)
3. Converted to PNG/JPG using any image editor

## Fonts
Primary Font: ${brand.font.heading}
Body Font: ${brand.font.body}
`;
  root.file('README.txt', readme.trim());

  // Generate and download ZIP
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${folderName}-social-media-kit.zip`);
}
