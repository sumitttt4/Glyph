/**
 * Brand Graphics System
 *
 * Generates visual assets derived from logo elements:
 * - Brand patterns (dot grids, line patterns, geometric textures)
 * - Social media card templates
 * - Presentation slide templates
 * - Marketing graphics
 * - OG images
 */

import { BrandIdentity } from '@/lib/data';

// ============================================
// TYPES
// ============================================

export type PatternType =
    | 'dot-grid'
    | 'line-pattern'
    | 'circle-composition'
    | 'geometric-texture'
    | 'logo-repeat'
    | 'wave-pattern'
    | 'diagonal-lines';

export type SocialCardType =
    | 'quote'
    | 'feature-highlight'
    | 'announcement'
    | 'team'
    | 'stats'
    | 'cta';

export type SlideType =
    | 'title'
    | 'section-divider'
    | 'content'
    | 'feature-showcase'
    | 'team'
    | 'stats'
    | 'timeline'
    | 'closing';

export type MarketingGraphicType =
    | 'hero-section'
    | 'feature-card'
    | 'banner-wide'
    | 'banner-square';

export interface PatternConfig {
    type: PatternType;
    width: number;
    height: number;
    scale?: number;
    opacity?: number;
}

export interface GraphicAsset {
    type: string;
    name: string;
    svg: string;
    width: number;
    height: number;
    category: 'pattern' | 'social' | 'slide' | 'marketing' | 'og';
}

// ============================================
// PATTERN GENERATORS
// ============================================

/**
 * Generate dot grid pattern
 */
export function generateDotGridPattern(
    brand: BrandIdentity,
    width: number = 800,
    height: number = 600,
    dotSize: number = 4,
    spacing: number = 24
): string {
    const colors = brand.theme.tokens.light;
    const dots: string[] = [];

    for (let x = spacing; x < width; x += spacing) {
        for (let y = spacing; y < height; y += spacing) {
            // Vary opacity for depth
            const opacity = 0.1 + Math.random() * 0.3;
            dots.push(`<circle cx="${x}" cy="${y}" r="${dotSize}" fill="${colors.primary}" opacity="${opacity}"/>`);
        }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>
    ${dots.join('\n    ')}
</svg>`;
}

/**
 * Generate line pattern
 */
export function generateLinePattern(
    brand: BrandIdentity,
    width: number = 800,
    height: number = 600,
    lineSpacing: number = 20,
    angle: number = 45
): string {
    const colors = brand.theme.tokens.light;
    const lines: string[] = [];
    const radians = (angle * Math.PI) / 180;
    const lineLength = Math.sqrt(width * width + height * height);

    for (let i = -lineLength; i < lineLength * 2; i += lineSpacing) {
        const opacity = 0.05 + (i % (lineSpacing * 3) === 0 ? 0.1 : 0);
        const strokeWidth = i % (lineSpacing * 3) === 0 ? 2 : 1;
        lines.push(`<line x1="${i}" y1="0" x2="${i + Math.cos(radians) * lineLength}" y2="${Math.sin(radians) * lineLength}" stroke="${colors.primary}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
        <clipPath id="clip">
            <rect width="${width}" height="${height}"/>
        </clipPath>
    </defs>
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>
    <g clip-path="url(#clip)">
        ${lines.join('\n        ')}
    </g>
</svg>`;
}

/**
 * Generate circle composition
 */
export function generateCircleComposition(
    brand: BrandIdentity,
    width: number = 800,
    height: number = 600
): string {
    const colors = brand.theme.tokens.light;
    const circles: string[] = [];
    const centerX = width / 2;
    const centerY = height / 2;

    // Concentric circles
    for (let r = 50; r < Math.min(width, height) / 2; r += 40) {
        const opacity = 0.05 + (r % 80 === 50 ? 0.1 : 0);
        circles.push(`<circle cx="${centerX}" cy="${centerY}" r="${r}" fill="none" stroke="${colors.primary}" stroke-width="1" opacity="${opacity}"/>`);
    }

    // Scattered accent circles
    for (let i = 0; i < 12; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const r = 10 + Math.random() * 30;
        const opacity = 0.05 + Math.random() * 0.1;
        circles.push(`<circle cx="${x}" cy="${y}" r="${r}" fill="${colors.primary}" opacity="${opacity}"/>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>
    ${circles.join('\n    ')}
</svg>`;
}

/**
 * Generate geometric texture
 */
export function generateGeometricTexture(
    brand: BrandIdentity,
    width: number = 800,
    height: number = 600
): string {
    const colors = brand.theme.tokens.light;
    const shapes: string[] = [];
    const gridSize = 60;

    for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
            const shapeType = Math.floor(Math.random() * 4);
            const opacity = 0.03 + Math.random() * 0.07;
            const size = gridSize * 0.6;
            const cx = x + gridSize / 2;
            const cy = y + gridSize / 2;

            switch (shapeType) {
                case 0: // Square
                    shapes.push(`<rect x="${cx - size/2}" y="${cy - size/2}" width="${size}" height="${size}" fill="${colors.primary}" opacity="${opacity}" transform="rotate(${Math.random() * 45}, ${cx}, ${cy})"/>`);
                    break;
                case 1: // Circle
                    shapes.push(`<circle cx="${cx}" cy="${cy}" r="${size/2}" fill="${colors.primary}" opacity="${opacity}"/>`);
                    break;
                case 2: // Triangle
                    const points = `${cx},${cy - size/2} ${cx - size/2},${cy + size/2} ${cx + size/2},${cy + size/2}`;
                    shapes.push(`<polygon points="${points}" fill="${colors.primary}" opacity="${opacity}"/>`);
                    break;
                case 3: // Line
                    shapes.push(`<line x1="${cx - size/2}" y1="${cy}" x2="${cx + size/2}" y2="${cy}" stroke="${colors.primary}" stroke-width="2" opacity="${opacity}" transform="rotate(${Math.random() * 180}, ${cx}, ${cy})"/>`);
                    break;
            }
        }
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>
    ${shapes.join('\n    ')}
</svg>`;
}

/**
 * Generate wave pattern
 */
export function generateWavePattern(
    brand: BrandIdentity,
    width: number = 800,
    height: number = 600,
    waves: number = 5
): string {
    const colors = brand.theme.tokens.light;
    const paths: string[] = [];
    const waveHeight = height / waves;

    for (let i = 0; i < waves; i++) {
        const y = i * waveHeight + waveHeight / 2;
        const amplitude = 20 + Math.random() * 30;
        const frequency = 0.01 + Math.random() * 0.01;
        const opacity = 0.05 + (i % 2) * 0.05;

        let d = `M 0 ${y}`;
        for (let x = 0; x <= width; x += 10) {
            const waveY = y + Math.sin(x * frequency + i) * amplitude;
            d += ` L ${x} ${waveY}`;
        }

        paths.push(`<path d="${d}" fill="none" stroke="${colors.primary}" stroke-width="2" opacity="${opacity}"/>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>
    ${paths.join('\n    ')}
</svg>`;
}

/**
 * Generate diagonal lines pattern
 */
export function generateDiagonalLines(
    brand: BrandIdentity,
    width: number = 800,
    height: number = 600,
    spacing: number = 30
): string {
    const colors = brand.theme.tokens.light;
    const lines: string[] = [];
    const maxDist = width + height;

    for (let d = -height; d < maxDist; d += spacing) {
        const opacity = 0.05 + (d % (spacing * 2) === 0 ? 0.05 : 0);
        const strokeWidth = d % (spacing * 4) === 0 ? 2 : 1;
        lines.push(`<line x1="${d}" y1="0" x2="${d - height}" y2="${height}" stroke="${colors.primary}" stroke-width="${strokeWidth}" opacity="${opacity}"/>`);
    }

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
        <clipPath id="diag-clip">
            <rect width="${width}" height="${height}"/>
        </clipPath>
    </defs>
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>
    <g clip-path="url(#diag-clip)">
        ${lines.join('\n        ')}
    </g>
</svg>`;
}

// ============================================
// SOCIAL MEDIA CARD GENERATORS
// ============================================

/**
 * Generate Quote Card
 */
export function generateQuoteCard(
    brand: BrandIdentity,
    quote: string = "Design is not just what it looks like, design is how it works.",
    author: string = "Team"
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1080;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
        <linearGradient id="quote-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors.primary}"/>
            <stop offset="100%" stop-color="${colors.surface}"/>
        </linearGradient>
    </defs>

    <!-- Background -->
    <rect width="${width}" height="${height}" fill="url(#quote-bg)"/>

    <!-- Pattern overlay -->
    <g opacity="0.1">
        ${Array.from({length: 20}, (_, i) =>
            `<circle cx="${100 + i * 50}" cy="${100 + i * 50}" r="${10 + i * 5}" fill="none" stroke="white" stroke-width="1"/>`
        ).join('\n        ')}
    </g>

    <!-- Quote mark -->
    <text x="100" y="300" font-family="${fontFamily}" font-size="200" fill="white" opacity="0.2">"</text>

    <!-- Quote text -->
    <text x="100" y="500" font-family="${fontFamily}" font-size="48" fill="white" font-weight="bold">
        <tspan x="100" dy="0">${quote.slice(0, 40)}</tspan>
        <tspan x="100" dy="60">${quote.slice(40, 80)}</tspan>
        <tspan x="100" dy="60">${quote.slice(80)}</tspan>
    </text>

    <!-- Author -->
    <text x="100" y="850" font-family="${fontFamily}" font-size="24" fill="white" opacity="0.8">— ${author}</text>

    <!-- Brand -->
    <text x="100" y="980" font-family="${fontFamily}" font-size="28" fill="white" font-weight="bold">${brand.name}</text>
</svg>`;
}

/**
 * Generate Feature Highlight Card
 */
export function generateFeatureCard(
    brand: BrandIdentity,
    title: string = "New Feature",
    description: string = "Introducing our latest innovation"
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1080;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Accent shape -->
    <circle cx="${width}" cy="0" r="400" fill="${colors.primary}" opacity="0.1"/>
    <circle cx="0" cy="${height}" r="300" fill="${colors.primary}" opacity="0.1"/>

    <!-- Feature badge -->
    <rect x="80" y="80" width="120" height="40" rx="20" fill="${colors.primary}"/>
    <text x="140" y="108" font-family="${fontFamily}" font-size="16" fill="white" text-anchor="middle" font-weight="bold">NEW</text>

    <!-- Title -->
    <text x="80" y="300" font-family="${fontFamily}" font-size="72" fill="${colors.text}" font-weight="bold">${title}</text>

    <!-- Description -->
    <text x="80" y="400" font-family="${fontFamily}" font-size="32" fill="${colors.muted}">${description}</text>

    <!-- Visual element -->
    <rect x="80" y="500" width="920" height="400" rx="24" fill="${colors.surface}" stroke="${colors.border}" stroke-width="2"/>
    <circle cx="540" cy="700" r="100" fill="${colors.primary}" opacity="0.2"/>

    <!-- Brand -->
    <text x="80" y="980" font-family="${fontFamily}" font-size="24" fill="${colors.muted}">${brand.name}</text>
</svg>`;
}

/**
 * Generate Announcement Card
 */
export function generateAnnouncementCard(
    brand: BrandIdentity,
    headline: string = "Big News",
    subtext: string = "We have something exciting to share"
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1080;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${colors.primary}"/>

    <!-- Geometric accents -->
    <rect x="-100" y="-100" width="400" height="400" fill="white" opacity="0.1" transform="rotate(45, 100, 100)"/>
    <rect x="${width - 200}" y="${height - 200}" width="400" height="400" fill="white" opacity="0.1" transform="rotate(45, ${width - 100}, ${height - 100})"/>

    <!-- Centered content -->
    <text x="${width/2}" y="400" font-family="${fontFamily}" font-size="120" fill="white" text-anchor="middle" font-weight="bold">${headline}</text>
    <text x="${width/2}" y="500" font-family="${fontFamily}" font-size="36" fill="white" text-anchor="middle" opacity="0.9">${subtext}</text>

    <!-- CTA button -->
    <rect x="${width/2 - 120}" y="600" width="240" height="60" rx="30" fill="white"/>
    <text x="${width/2}" y="640" font-family="${fontFamily}" font-size="20" fill="${colors.primary}" text-anchor="middle" font-weight="bold">Learn More</text>

    <!-- Brand -->
    <text x="${width/2}" y="980" font-family="${fontFamily}" font-size="28" fill="white" text-anchor="middle" opacity="0.8">${brand.name}</text>
</svg>`;
}

/**
 * Generate Team Card
 */
export function generateTeamCard(
    brand: BrandIdentity,
    name: string = "Team Member",
    role: string = "Designer"
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1080;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Profile area -->
    <rect y="0" width="${width}" height="700" fill="${colors.surface}"/>

    <!-- Avatar placeholder -->
    <circle cx="${width/2}" cy="350" r="150" fill="${colors.primary}" opacity="0.2"/>
    <circle cx="${width/2}" cy="350" r="120" fill="${colors.primary}" opacity="0.3"/>
    <text x="${width/2}" y="370" font-family="${fontFamily}" font-size="80" fill="${colors.primary}" text-anchor="middle">${name.charAt(0)}</text>

    <!-- Info -->
    <text x="${width/2}" y="800" font-family="${fontFamily}" font-size="48" fill="${colors.text}" text-anchor="middle" font-weight="bold">${name}</text>
    <text x="${width/2}" y="860" font-family="${fontFamily}" font-size="28" fill="${colors.muted}" text-anchor="middle">${role}</text>

    <!-- Brand -->
    <text x="${width/2}" y="980" font-family="${fontFamily}" font-size="24" fill="${colors.muted}" text-anchor="middle">${brand.name}</text>
</svg>`;
}

/**
 * Generate Stats Card
 */
export function generateStatsCard(
    brand: BrandIdentity,
    stats: { value: string; label: string }[] = [
        { value: '10K+', label: 'Users' },
        { value: '99%', label: 'Uptime' },
        { value: '24/7', label: 'Support' }
    ]
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1080;
    const height = 1080;
    const statWidth = width / stats.length;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <!-- Background -->
    <rect width="${width}" height="${height}" fill="${colors.primary}"/>

    <!-- Pattern -->
    <g opacity="0.1">
        ${Array.from({length: 10}, (_, i) =>
            `<line x1="0" y1="${i * 120}" x2="${width}" y2="${i * 120}" stroke="white" stroke-width="1"/>`
        ).join('\n        ')}
    </g>

    <!-- Stats -->
    ${stats.map((stat, i) => `
        <g transform="translate(${i * statWidth}, 0)">
            <text x="${statWidth/2}" y="480" font-family="${fontFamily}" font-size="120" fill="white" text-anchor="middle" font-weight="bold">${stat.value}</text>
            <text x="${statWidth/2}" y="560" font-family="${fontFamily}" font-size="28" fill="white" text-anchor="middle" opacity="0.8">${stat.label}</text>
        </g>
    `).join('')}

    <!-- Brand -->
    <text x="${width/2}" y="980" font-family="${fontFamily}" font-size="28" fill="white" text-anchor="middle" opacity="0.8">${brand.name}</text>
</svg>`;
}

/**
 * Generate CTA Card
 */
export function generateCTACard(
    brand: BrandIdentity,
    headline: string = "Ready to start?",
    cta: string = "Get Started"
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1080;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <!-- Background gradient -->
    <defs>
        <linearGradient id="cta-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors.bg}"/>
            <stop offset="100%" stop-color="${colors.surface}"/>
        </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#cta-grad)"/>

    <!-- Accent circles -->
    <circle cx="200" cy="200" r="300" fill="${colors.primary}" opacity="0.05"/>
    <circle cx="${width - 200}" cy="${height - 200}" r="400" fill="${colors.primary}" opacity="0.05"/>

    <!-- Content -->
    <text x="${width/2}" y="450" font-family="${fontFamily}" font-size="72" fill="${colors.text}" text-anchor="middle" font-weight="bold">${headline}</text>

    <!-- CTA button -->
    <rect x="${width/2 - 150}" y="550" width="300" height="80" rx="40" fill="${colors.primary}"/>
    <text x="${width/2}" y="602" font-family="${fontFamily}" font-size="28" fill="white" text-anchor="middle" font-weight="bold">${cta}</text>

    <!-- Brand -->
    <text x="${width/2}" y="980" font-family="${fontFamily}" font-size="24" fill="${colors.muted}" text-anchor="middle">${brand.name}</text>
</svg>`;
}

// ============================================
// PRESENTATION SLIDE GENERATORS
// ============================================

/**
 * Generate Title Slide
 */
export function generateTitleSlide(brand: BrandIdentity, title?: string, subtitle?: string): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Pattern background -->
    <g opacity="0.03">
        ${Array.from({length: 30}, (_, i) =>
            `<circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${20 + Math.random() * 40}" fill="${colors.primary}"/>`
        ).join('\n        ')}
    </g>

    <!-- Brand accent bar -->
    <rect x="0" y="${height - 8}" width="${width}" height="8" fill="${colors.primary}"/>

    <!-- Content -->
    <text x="${width/2}" y="450" font-family="${fontFamily}" font-size="96" fill="${colors.text}" text-anchor="middle" font-weight="bold">${title || brand.name}</text>
    <text x="${width/2}" y="550" font-family="${fontFamily}" font-size="36" fill="${colors.muted}" text-anchor="middle">${subtitle || brand.strategy?.tagline || 'Brand Presentation'}</text>

    <!-- Date -->
    <text x="${width/2}" y="950" font-family="${fontFamily}" font-size="20" fill="${colors.muted}" text-anchor="middle">${new Date().getFullYear()}</text>
</svg>`;
}

/**
 * Generate Section Divider Slide
 */
export function generateSectionDividerSlide(brand: BrandIdentity, sectionTitle: string = "Section Title"): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.primary}"/>

    <!-- Geometric accent -->
    <circle cx="0" cy="0" r="600" fill="white" opacity="0.1"/>
    <circle cx="${width}" cy="${height}" r="500" fill="white" opacity="0.1"/>

    <!-- Section number -->
    <text x="150" y="200" font-family="${fontFamily}" font-size="200" fill="white" opacity="0.2" font-weight="bold">01</text>

    <!-- Title -->
    <text x="${width/2}" y="${height/2 + 30}" font-family="${fontFamily}" font-size="80" fill="white" text-anchor="middle" font-weight="bold">${sectionTitle}</text>
</svg>`;
}

/**
 * Generate Content Slide
 */
export function generateContentSlide(
    brand: BrandIdentity,
    title: string = "Content Title",
    bullets: string[] = ["Point one", "Point two", "Point three"]
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Header -->
    <rect x="0" y="0" width="${width}" height="150" fill="${colors.surface}"/>
    <text x="100" y="100" font-family="${fontFamily}" font-size="36" fill="${colors.text}" font-weight="bold">${title}</text>

    <!-- Brand accent -->
    <rect x="0" y="148" width="200" height="4" fill="${colors.primary}"/>

    <!-- Bullets -->
    ${bullets.map((bullet, i) => `
        <circle cx="130" cy="${280 + i * 120}" r="8" fill="${colors.primary}"/>
        <text x="170" y="${290 + i * 120}" font-family="${fontFamily}" font-size="32" fill="${colors.text}">${bullet}</text>
    `).join('')}

    <!-- Page number -->
    <text x="${width - 100}" y="${height - 50}" font-family="${fontFamily}" font-size="20" fill="${colors.muted}" text-anchor="end">${brand.name}</text>
</svg>`;
}

/**
 * Generate Feature Showcase Slide
 */
export function generateFeatureShowcaseSlide(brand: BrandIdentity, feature: string = "Key Feature"): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Left content -->
    <text x="100" y="200" font-family="${fontFamily}" font-size="20" fill="${colors.primary}" font-weight="bold">FEATURE</text>
    <text x="100" y="320" font-family="${fontFamily}" font-size="64" fill="${colors.text}" font-weight="bold">${feature}</text>
    <text x="100" y="420" font-family="${fontFamily}" font-size="24" fill="${colors.muted}">Description of this amazing feature</text>

    <!-- Feature visual -->
    <rect x="${width/2 + 50}" y="150" width="750" height="600" rx="24" fill="${colors.surface}" stroke="${colors.border}" stroke-width="2"/>
    <circle cx="${width/2 + 425}" cy="450" r="150" fill="${colors.primary}" opacity="0.1"/>

    <!-- Brand -->
    <text x="100" y="${height - 50}" font-family="${fontFamily}" font-size="20" fill="${colors.muted}">${brand.name}</text>
</svg>`;
}

/**
 * Generate Stats Slide
 */
export function generateStatsSlide(
    brand: BrandIdentity,
    stats: { value: string; label: string }[] = [
        { value: '500+', label: 'Clients' },
        { value: '98%', label: 'Satisfaction' },
        { value: '$2M+', label: 'Revenue' },
        { value: '50+', label: 'Countries' }
    ]
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;
    const statWidth = (width - 200) / stats.length;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Title -->
    <text x="${width/2}" y="200" font-family="${fontFamily}" font-size="48" fill="${colors.text}" text-anchor="middle" font-weight="bold">By the Numbers</text>

    <!-- Stats -->
    ${stats.map((stat, i) => `
        <g transform="translate(${100 + i * statWidth}, 0)">
            <rect x="20" y="350" width="${statWidth - 40}" height="300" rx="16" fill="${colors.surface}"/>
            <text x="${statWidth/2}" y="500" font-family="${fontFamily}" font-size="72" fill="${colors.primary}" text-anchor="middle" font-weight="bold">${stat.value}</text>
            <text x="${statWidth/2}" y="580" font-family="${fontFamily}" font-size="24" fill="${colors.muted}" text-anchor="middle">${stat.label}</text>
        </g>
    `).join('')}

    <!-- Brand -->
    <text x="${width - 100}" y="${height - 50}" font-family="${fontFamily}" font-size="20" fill="${colors.muted}" text-anchor="end">${brand.name}</text>
</svg>`;
}

/**
 * Generate Timeline Slide
 */
export function generateTimelineSlide(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;
    const events = [
        { year: '2020', title: 'Founded' },
        { year: '2021', title: 'First Product' },
        { year: '2022', title: 'Series A' },
        { year: '2023', title: 'Global Expansion' },
        { year: '2024', title: 'Today' }
    ];
    const spacing = (width - 400) / (events.length - 1);

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Title -->
    <text x="${width/2}" y="150" font-family="${fontFamily}" font-size="48" fill="${colors.text}" text-anchor="middle" font-weight="bold">Our Journey</text>

    <!-- Timeline line -->
    <line x1="200" y1="500" x2="${width - 200}" y2="500" stroke="${colors.border}" stroke-width="4"/>

    <!-- Events -->
    ${events.map((event, i) => `
        <g transform="translate(${200 + i * spacing}, 0)">
            <circle cx="0" cy="500" r="16" fill="${colors.primary}"/>
            <text x="0" y="440" font-family="${fontFamily}" font-size="24" fill="${colors.primary}" text-anchor="middle" font-weight="bold">${event.year}</text>
            <text x="0" y="580" font-family="${fontFamily}" font-size="20" fill="${colors.text}" text-anchor="middle">${event.title}</text>
        </g>
    `).join('')}

    <!-- Brand -->
    <text x="${width - 100}" y="${height - 50}" font-family="${fontFamily}" font-size="20" fill="${colors.muted}" text-anchor="end">${brand.name}</text>
</svg>`;
}

/**
 * Generate Team Slide
 */
export function generateTeamSlide(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;
    const team = [
        { name: 'CEO', role: 'Chief Executive' },
        { name: 'CTO', role: 'Chief Technology' },
        { name: 'CFO', role: 'Chief Financial' },
        { name: 'CMO', role: 'Chief Marketing' }
    ];
    const memberWidth = (width - 300) / team.length;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Title -->
    <text x="${width/2}" y="150" font-family="${fontFamily}" font-size="48" fill="${colors.text}" text-anchor="middle" font-weight="bold">Leadership Team</text>

    <!-- Team members -->
    ${team.map((member, i) => `
        <g transform="translate(${150 + i * memberWidth}, 250)">
            <circle cx="${memberWidth/2}" cy="150" r="100" fill="${colors.surface}"/>
            <circle cx="${memberWidth/2}" cy="150" r="80" fill="${colors.primary}" opacity="0.2"/>
            <text x="${memberWidth/2}" y="170" font-family="${fontFamily}" font-size="48" fill="${colors.primary}" text-anchor="middle">${member.name.charAt(0)}</text>
            <text x="${memberWidth/2}" y="320" font-family="${fontFamily}" font-size="24" fill="${colors.text}" text-anchor="middle" font-weight="bold">${member.name}</text>
            <text x="${memberWidth/2}" y="360" font-family="${fontFamily}" font-size="18" fill="${colors.muted}" text-anchor="middle">${member.role}</text>
        </g>
    `).join('')}

    <!-- Brand -->
    <text x="${width - 100}" y="${height - 50}" font-family="${fontFamily}" font-size="20" fill="${colors.muted}" text-anchor="end">${brand.name}</text>
</svg>`;
}

/**
 * Generate Closing Slide
 */
export function generateClosingSlide(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1920;
    const height = 1080;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.primary}"/>

    <!-- Pattern -->
    <g opacity="0.1">
        ${Array.from({length: 40}, (_, i) =>
            `<circle cx="${Math.random() * width}" cy="${Math.random() * height}" r="${10 + Math.random() * 30}" fill="white"/>`
        ).join('\n        ')}
    </g>

    <!-- Content -->
    <text x="${width/2}" y="400" font-family="${fontFamily}" font-size="72" fill="white" text-anchor="middle" font-weight="bold">Thank You</text>
    <text x="${width/2}" y="500" font-family="${fontFamily}" font-size="32" fill="white" text-anchor="middle" opacity="0.9">${brand.strategy?.tagline || 'Let\'s build something great together'}</text>

    <!-- Contact -->
    <text x="${width/2}" y="700" font-family="${fontFamily}" font-size="24" fill="white" text-anchor="middle" opacity="0.8">hello@${brand.name.toLowerCase().replace(/\s+/g, '')}.com</text>

    <!-- Brand -->
    <text x="${width/2}" y="900" font-family="${fontFamily}" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${brand.name}</text>
</svg>`;
}

// ============================================
// OG IMAGE GENERATOR
// ============================================

/**
 * Generate OG Image
 */
export function generateOGImage(
    brand: BrandIdentity,
    title?: string,
    description?: string
): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1200;
    const height = 630;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
        <linearGradient id="og-bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${colors.bg}"/>
            <stop offset="100%" stop-color="${colors.surface}"/>
        </linearGradient>
    </defs>

    <rect width="${width}" height="${height}" fill="url(#og-bg)"/>

    <!-- Accent shapes -->
    <circle cx="${width - 100}" cy="100" r="200" fill="${colors.primary}" opacity="0.1"/>
    <circle cx="100" cy="${height - 100}" r="150" fill="${colors.primary}" opacity="0.1"/>

    <!-- Brand bar -->
    <rect x="0" y="${height - 8}" width="${width}" height="8" fill="${colors.primary}"/>

    <!-- Content -->
    <text x="80" y="200" font-family="${fontFamily}" font-size="64" fill="${colors.text}" font-weight="bold">${title || brand.name}</text>
    <text x="80" y="280" font-family="${fontFamily}" font-size="28" fill="${colors.muted}">${description || brand.strategy?.tagline || ''}</text>

    <!-- Brand name -->
    <text x="80" y="${height - 50}" font-family="${fontFamily}" font-size="24" fill="${colors.primary}" font-weight="bold">${brand.name}</text>
</svg>`;
}

// ============================================
// MARKETING GRAPHICS GENERATORS
// ============================================

/**
 * Generate Hero Section
 */
export function generateHeroSection(brand: BrandIdentity): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1440;
    const height = 800;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.bg}"/>

    <!-- Background pattern -->
    <g opacity="0.05">
        ${Array.from({length: 50}, (_, i) => {
            const x = Math.random() * width;
            const y = Math.random() * height;
            const size = 20 + Math.random() * 60;
            return `<circle cx="${x}" cy="${y}" r="${size}" fill="${colors.primary}"/>`;
        }).join('\n        ')}
    </g>

    <!-- Gradient overlay -->
    <defs>
        <linearGradient id="hero-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="${colors.primary}" stop-opacity="0.1"/>
            <stop offset="100%" stop-color="${colors.primary}" stop-opacity="0"/>
        </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#hero-grad)"/>

    <!-- Content -->
    <text x="${width/2}" y="300" font-family="${fontFamily}" font-size="80" fill="${colors.text}" text-anchor="middle" font-weight="bold">${brand.name}</text>
    <text x="${width/2}" y="400" font-family="${fontFamily}" font-size="32" fill="${colors.muted}" text-anchor="middle">${brand.strategy?.tagline || 'Your brand, elevated'}</text>

    <!-- CTA -->
    <rect x="${width/2 - 120}" y="480" width="240" height="60" rx="30" fill="${colors.primary}"/>
    <text x="${width/2}" y="520" font-family="${fontFamily}" font-size="20" fill="white" text-anchor="middle" font-weight="bold">Get Started</text>
</svg>`;
}

/**
 * Generate Banner Wide
 */
export function generateBannerWide(brand: BrandIdentity, text: string = "Special Offer"): string {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const width = 1200;
    const height = 300;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <rect width="${width}" height="${height}" fill="${colors.primary}"/>

    <!-- Decorative elements -->
    <circle cx="100" cy="150" r="200" fill="white" opacity="0.1"/>
    <circle cx="${width - 100}" cy="150" r="150" fill="white" opacity="0.1"/>

    <!-- Text -->
    <text x="${width/2}" y="${height/2 + 20}" font-family="${fontFamily}" font-size="56" fill="white" text-anchor="middle" font-weight="bold">${text}</text>

    <!-- Brand -->
    <text x="${width - 50}" y="${height - 30}" font-family="${fontFamily}" font-size="16" fill="white" text-anchor="end" opacity="0.8">${brand.name}</text>
</svg>`;
}

/**
 * Generate all brand graphics
 */
export function generateAllBrandGraphics(brand: BrandIdentity): GraphicAsset[] {
    return [
        // Patterns
        { type: 'dot-grid', name: 'Dot Grid Pattern', svg: generateDotGridPattern(brand), width: 800, height: 600, category: 'pattern' },
        { type: 'line-pattern', name: 'Line Pattern', svg: generateLinePattern(brand), width: 800, height: 600, category: 'pattern' },
        { type: 'circle-composition', name: 'Circle Composition', svg: generateCircleComposition(brand), width: 800, height: 600, category: 'pattern' },
        { type: 'geometric-texture', name: 'Geometric Texture', svg: generateGeometricTexture(brand), width: 800, height: 600, category: 'pattern' },
        { type: 'wave-pattern', name: 'Wave Pattern', svg: generateWavePattern(brand), width: 800, height: 600, category: 'pattern' },
        { type: 'diagonal-lines', name: 'Diagonal Lines', svg: generateDiagonalLines(brand), width: 800, height: 600, category: 'pattern' },

        // Social Cards
        { type: 'quote', name: 'Quote Card', svg: generateQuoteCard(brand), width: 1080, height: 1080, category: 'social' },
        { type: 'feature-highlight', name: 'Feature Card', svg: generateFeatureCard(brand), width: 1080, height: 1080, category: 'social' },
        { type: 'announcement', name: 'Announcement Card', svg: generateAnnouncementCard(brand), width: 1080, height: 1080, category: 'social' },
        { type: 'team', name: 'Team Card', svg: generateTeamCard(brand), width: 1080, height: 1080, category: 'social' },
        { type: 'stats', name: 'Stats Card', svg: generateStatsCard(brand), width: 1080, height: 1080, category: 'social' },
        { type: 'cta', name: 'CTA Card', svg: generateCTACard(brand), width: 1080, height: 1080, category: 'social' },

        // Slides
        { type: 'title', name: 'Title Slide', svg: generateTitleSlide(brand), width: 1920, height: 1080, category: 'slide' },
        { type: 'section-divider', name: 'Section Divider', svg: generateSectionDividerSlide(brand), width: 1920, height: 1080, category: 'slide' },
        { type: 'content', name: 'Content Slide', svg: generateContentSlide(brand), width: 1920, height: 1080, category: 'slide' },
        { type: 'feature-showcase', name: 'Feature Showcase', svg: generateFeatureShowcaseSlide(brand), width: 1920, height: 1080, category: 'slide' },
        { type: 'stats-slide', name: 'Stats Slide', svg: generateStatsSlide(brand), width: 1920, height: 1080, category: 'slide' },
        { type: 'timeline', name: 'Timeline Slide', svg: generateTimelineSlide(brand), width: 1920, height: 1080, category: 'slide' },
        { type: 'team-slide', name: 'Team Slide', svg: generateTeamSlide(brand), width: 1920, height: 1080, category: 'slide' },
        { type: 'closing', name: 'Closing Slide', svg: generateClosingSlide(brand), width: 1920, height: 1080, category: 'slide' },

        // Marketing
        { type: 'hero-section', name: 'Hero Section', svg: generateHeroSection(brand), width: 1440, height: 800, category: 'marketing' },
        { type: 'banner-wide', name: 'Wide Banner', svg: generateBannerWide(brand), width: 1200, height: 300, category: 'marketing' },

        // OG
        { type: 'og-image', name: 'OG Image', svg: generateOGImage(brand), width: 1200, height: 630, category: 'og' },
    ];
}
