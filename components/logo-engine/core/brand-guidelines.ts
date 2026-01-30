/**
 * Brand Guidelines Auto-Generation
 *
 * Generates comprehensive brand usage guidelines for logos:
 * - Clear space rules
 * - Minimum size requirements
 * - Color variations (full color, monochrome, reversed)
 * - Usage dos and don'ts
 * - Typography pairing suggestions
 * - Application examples
 */

import { GeneratedLogo, LogoAlgorithm } from '../types';
import { BrandProfile } from './smart-logo-system';

// ============================================
// TYPES
// ============================================

export interface ClearSpaceRule {
    description: string;
    multiplier: number;  // Multiple of logo height/width
    reference: 'height' | 'width' | 'x-height';
    visualGuide: string;  // SVG representation
}

export interface MinimumSizeRule {
    print: { width: number; unit: 'mm' | 'in' };
    digital: { width: number; unit: 'px' };
    favicon: { width: number; unit: 'px' };
    description: string;
}

export interface ColorVariation {
    name: string;
    description: string;
    usage: string;
    colors: {
        primary: string;
        secondary?: string;
        background: string;
    };
    svgPreview?: string;
}

export interface UsageRule {
    type: 'do' | 'dont';
    title: string;
    description: string;
    severity: 'critical' | 'important' | 'suggested';
    visualExample?: string;
}

export interface TypographySuggestion {
    fontFamily: string;
    category: 'sans-serif' | 'serif' | 'display' | 'monospace';
    weight: string;
    pairing: 'primary' | 'secondary' | 'accent';
    description: string;
    googleFontUrl?: string;
}

export interface ApplicationExample {
    name: string;
    description: string;
    dimensions: { width: number; height: number };
    placement: { x: number; y: number };
    scale: number;
    mockupType: 'business-card' | 'letterhead' | 'website' | 'social' | 'signage' | 'merchandise';
}

export interface BrandGuidelines {
    version: string;
    generatedAt: string;
    brandName: string;

    // Logo specifications
    logoDescription: string;
    algorithmUsed: LogoAlgorithm;

    // Rules and variations
    clearSpace: ClearSpaceRule;
    minimumSize: MinimumSizeRule;
    colorVariations: ColorVariation[];
    usageRules: UsageRule[];

    // Suggestions
    typography: TypographySuggestion[];
    applications: ApplicationExample[];

    // Export data
    primaryColors: string[];
    supportingColors: string[];
}

// ============================================
// CLEAR SPACE GENERATION
// ============================================

function generateClearSpaceRule(logo: GeneratedLogo): ClearSpaceRule {
    // Analyze logo complexity to determine clear space
    const pathCount = (logo.svg.match(/<path/g) || []).length;
    const hasText = logo.svg.includes('<text') || logo.svg.includes('font-family');

    // More complex logos need more breathing room
    const multiplier = pathCount > 10 ? 0.25 : pathCount > 5 ? 0.2 : 0.15;
    const reference = hasText ? 'x-height' : 'height';

    const visualGuide = `
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <!-- Clear space visualization -->
        <rect x="40" y="40" width="120" height="120" fill="#f0f0f0" stroke="#cccccc" stroke-dasharray="4"/>
        <rect x="60" y="60" width="80" height="80" fill="white" stroke="#333333"/>
        <text x="100" y="105" text-anchor="middle" font-size="10" fill="#666">Logo</text>
        <!-- Dimension markers -->
        <line x1="40" y1="150" x2="60" y2="150" stroke="#0066cc" stroke-width="1"/>
        <text x="50" y="165" text-anchor="middle" font-size="8" fill="#0066cc">X</text>
        <line x1="60" y1="150" x2="140" y2="150" stroke="#333" stroke-width="1"/>
        <line x1="140" y1="150" x2="160" y2="150" stroke="#0066cc" stroke-width="1"/>
        <text x="150" y="165" text-anchor="middle" font-size="8" fill="#0066cc">X</text>
    </svg>`;

    return {
        description: `Maintain a minimum clear space of ${Math.round(multiplier * 100)}% of the logo ${reference} on all sides. This ensures the logo remains visually distinct and uncluttered.`,
        multiplier,
        reference,
        visualGuide,
    };
}

// ============================================
// MINIMUM SIZE GENERATION
// ============================================

function generateMinimumSizeRule(logo: GeneratedLogo): MinimumSizeRule {
    // Analyze logo detail level
    const pathCount = (logo.svg.match(/<path/g) || []).length;
    const hasFinePaths = logo.svg.includes('stroke-width="0.5"') || logo.svg.includes('stroke-width="1"');

    // More detailed logos need larger minimum sizes
    const printMin = hasFinePaths ? 25 : pathCount > 8 ? 20 : 15;
    const digitalMin = hasFinePaths ? 80 : pathCount > 8 ? 60 : 40;

    return {
        print: { width: printMin, unit: 'mm' },
        digital: { width: digitalMin, unit: 'px' },
        favicon: { width: 16, unit: 'px' },
        description: `To maintain legibility and visual integrity, the logo should never be reproduced smaller than ${printMin}mm for print or ${digitalMin}px for digital applications. For favicon usage, use the simplified icon variant.`,
    };
}

// ============================================
// COLOR VARIATIONS GENERATION
// ============================================

function generateColorVariations(logo: GeneratedLogo, primaryColor: string, accentColor?: string): ColorVariation[] {
    const variations: ColorVariation[] = [];

    // Full color
    variations.push({
        name: 'Full Color (Primary)',
        description: 'The preferred version for most applications',
        usage: 'Use on white or light neutral backgrounds',
        colors: {
            primary: primaryColor,
            secondary: accentColor,
            background: '#ffffff',
        },
    });

    // Full color on dark
    variations.push({
        name: 'Full Color (Dark Background)',
        description: 'For use on dark backgrounds',
        usage: 'Use when placing logo on dark colored surfaces',
        colors: {
            primary: primaryColor,
            secondary: accentColor,
            background: '#1a1a2e',
        },
    });

    // Monochrome black
    variations.push({
        name: 'Monochrome Black',
        description: 'Single-color version for limited color applications',
        usage: 'Use for one-color printing, fax, or when color reproduction is limited',
        colors: {
            primary: '#000000',
            background: '#ffffff',
        },
    });

    // Monochrome white (reversed)
    variations.push({
        name: 'Reversed (White)',
        description: 'White version for dark backgrounds',
        usage: 'Use on dark solid backgrounds or photography',
        colors: {
            primary: '#ffffff',
            background: '#1a1a2e',
        },
    });

    // Grayscale
    variations.push({
        name: 'Grayscale',
        description: 'For black and white publications',
        usage: 'Use in newspapers, grayscale documents, or photocopies',
        colors: {
            primary: '#666666',
            secondary: '#999999',
            background: '#ffffff',
        },
    });

    return variations;
}

// ============================================
// USAGE RULES GENERATION
// ============================================

function generateUsageRules(logo: GeneratedLogo, algorithm: LogoAlgorithm): UsageRule[] {
    const rules: UsageRule[] = [];

    // Universal rules
    rules.push({
        type: 'do',
        title: 'Maintain proportions',
        description: 'Always scale the logo proportionally. Never stretch or compress.',
        severity: 'critical',
    });

    rules.push({
        type: 'do',
        title: 'Use approved color variations',
        description: 'Only use the color variations specified in these guidelines.',
        severity: 'critical',
    });

    rules.push({
        type: 'do',
        title: 'Respect clear space',
        description: 'Always maintain the minimum clear space around the logo.',
        severity: 'important',
    });

    rules.push({
        type: 'dont',
        title: 'Do not rotate',
        description: 'Never rotate or tilt the logo at an angle.',
        severity: 'critical',
    });

    rules.push({
        type: 'dont',
        title: 'Do not add effects',
        description: 'Never add drop shadows, gradients, or other effects not specified in the guidelines.',
        severity: 'important',
    });

    rules.push({
        type: 'dont',
        title: 'Do not alter colors',
        description: 'Never change the logo colors outside of approved variations.',
        severity: 'critical',
    });

    rules.push({
        type: 'dont',
        title: 'Do not place on busy backgrounds',
        description: 'Avoid placing the logo on complex patterns or photographs without sufficient contrast.',
        severity: 'important',
    });

    rules.push({
        type: 'dont',
        title: 'Do not crop or mask',
        description: 'Always show the complete logo. Never crop or partially mask any element.',
        severity: 'critical',
    });

    // Algorithm-specific rules
    if (['motion-chevrons', 'staggered-bars', 'line-fragmentation'].includes(algorithm)) {
        rules.push({
            type: 'do',
            title: 'Preserve directional orientation',
            description: 'This logo has directional elements. Maintain its intended orientation to preserve meaning.',
            severity: 'important',
        });
    }

    if (['negative-space', 'monogram-merge'].includes(algorithm)) {
        rules.push({
            type: 'do',
            title: 'Ensure sufficient contrast',
            description: 'This logo relies on contrast for legibility. Ensure adequate contrast ratio between logo and background.',
            severity: 'critical',
        });
    }

    return rules;
}

// ============================================
// TYPOGRAPHY SUGGESTIONS
// ============================================

const TYPOGRAPHY_DATABASE: Record<string, TypographySuggestion[]> = {
    'modern-tech': [
        {
            fontFamily: 'Inter',
            category: 'sans-serif',
            weight: '400, 500, 600',
            pairing: 'primary',
            description: 'Clean, modern sans-serif perfect for digital interfaces',
            googleFontUrl: 'https://fonts.google.com/specimen/Inter',
        },
        {
            fontFamily: 'Space Grotesk',
            category: 'sans-serif',
            weight: '400, 500, 700',
            pairing: 'secondary',
            description: 'Geometric sans-serif with distinctive character',
            googleFontUrl: 'https://fonts.google.com/specimen/Space+Grotesk',
        },
    ],
    'elegant': [
        {
            fontFamily: 'Playfair Display',
            category: 'serif',
            weight: '400, 500, 600',
            pairing: 'primary',
            description: 'Elegant serif with high contrast for headlines',
            googleFontUrl: 'https://fonts.google.com/specimen/Playfair+Display',
        },
        {
            fontFamily: 'Lato',
            category: 'sans-serif',
            weight: '300, 400, 700',
            pairing: 'secondary',
            description: 'Humanist sans-serif for body text',
            googleFontUrl: 'https://fonts.google.com/specimen/Lato',
        },
    ],
    'bold': [
        {
            fontFamily: 'Montserrat',
            category: 'sans-serif',
            weight: '500, 600, 800',
            pairing: 'primary',
            description: 'Bold geometric sans-serif with strong presence',
            googleFontUrl: 'https://fonts.google.com/specimen/Montserrat',
        },
        {
            fontFamily: 'Open Sans',
            category: 'sans-serif',
            weight: '400, 600',
            pairing: 'secondary',
            description: 'Neutral sans-serif for supporting text',
            googleFontUrl: 'https://fonts.google.com/specimen/Open+Sans',
        },
    ],
    'minimal': [
        {
            fontFamily: 'DM Sans',
            category: 'sans-serif',
            weight: '400, 500',
            pairing: 'primary',
            description: 'Clean geometric sans with subtle quirks',
            googleFontUrl: 'https://fonts.google.com/specimen/DM+Sans',
        },
        {
            fontFamily: 'IBM Plex Sans',
            category: 'sans-serif',
            weight: '300, 400, 500',
            pairing: 'secondary',
            description: 'Corporate yet friendly sans-serif',
            googleFontUrl: 'https://fonts.google.com/specimen/IBM+Plex+Sans',
        },
    ],
    'playful': [
        {
            fontFamily: 'Nunito',
            category: 'sans-serif',
            weight: '400, 600, 700',
            pairing: 'primary',
            description: 'Rounded sans-serif with friendly appearance',
            googleFontUrl: 'https://fonts.google.com/specimen/Nunito',
        },
        {
            fontFamily: 'Quicksand',
            category: 'sans-serif',
            weight: '400, 500, 600',
            pairing: 'secondary',
            description: 'Geometric rounded sans with playful energy',
            googleFontUrl: 'https://fonts.google.com/specimen/Quicksand',
        },
    ],
    'default': [
        {
            fontFamily: 'Poppins',
            category: 'sans-serif',
            weight: '400, 500, 600',
            pairing: 'primary',
            description: 'Versatile geometric sans-serif',
            googleFontUrl: 'https://fonts.google.com/specimen/Poppins',
        },
        {
            fontFamily: 'Source Sans Pro',
            category: 'sans-serif',
            weight: '400, 600',
            pairing: 'secondary',
            description: 'Professional and readable for all contexts',
            googleFontUrl: 'https://fonts.google.com/specimen/Source+Sans+Pro',
        },
    ],
};

function generateTypographySuggestions(algorithm: LogoAlgorithm, profile?: BrandProfile): TypographySuggestion[] {
    // Map algorithms to typography styles
    const styleMap: Record<LogoAlgorithm, string> = {
        'line-fragmentation': 'modern-tech',
        'staggered-bars': 'modern-tech',
        'block-assembly': 'bold',
        'motion-chevrons': 'bold',
        'negative-space': 'minimal',
        'interlocking-loops': 'elegant',
        'monogram-merge': 'elegant',
        'continuous-stroke': 'minimal',
        'geometric-extract': 'minimal',
        'clover-radial': 'playful',
    };

    // Use profile personality if available, otherwise use algorithm default
    let style = 'default';

    if (profile?.personality) {
        const personalityStyles: Record<string, string> = {
            professional: 'minimal',
            playful: 'playful',
            bold: 'bold',
            elegant: 'elegant',
            minimal: 'minimal',
            innovative: 'modern-tech',
        };
        const primaryPersonality = Array.isArray(profile.personality) ? profile.personality[0] : profile.personality;
        style = personalityStyles[primaryPersonality] || styleMap[algorithm] || 'default';
    } else {
        style = styleMap[algorithm] || 'default';
    }

    return TYPOGRAPHY_DATABASE[style] || TYPOGRAPHY_DATABASE['default'];
}

// ============================================
// APPLICATION EXAMPLES
// ============================================

function generateApplicationExamples(): ApplicationExample[] {
    return [
        {
            name: 'Business Card',
            description: 'Standard business card placement',
            dimensions: { width: 85, height: 55 },
            placement: { x: 10, y: 10 },
            scale: 0.3,
            mockupType: 'business-card',
        },
        {
            name: 'Letterhead',
            description: 'Corporate letterhead header',
            dimensions: { width: 210, height: 297 },
            placement: { x: 20, y: 20 },
            scale: 0.15,
            mockupType: 'letterhead',
        },
        {
            name: 'Website Header',
            description: 'Desktop website header',
            dimensions: { width: 1440, height: 80 },
            placement: { x: 40, y: 20 },
            scale: 0.5,
            mockupType: 'website',
        },
        {
            name: 'Social Media Profile',
            description: 'Profile picture for social platforms',
            dimensions: { width: 400, height: 400 },
            placement: { x: 100, y: 100 },
            scale: 0.5,
            mockupType: 'social',
        },
        {
            name: 'Signage',
            description: 'Large format exterior signage',
            dimensions: { width: 2000, height: 600 },
            placement: { x: 800, y: 150 },
            scale: 0.25,
            mockupType: 'signage',
        },
        {
            name: 'Merchandise',
            description: 'T-shirt or merchandise placement',
            dimensions: { width: 300, height: 400 },
            placement: { x: 100, y: 80 },
            scale: 0.4,
            mockupType: 'merchandise',
        },
    ];
}

// ============================================
// COLOR EXTRACTION
// ============================================

function extractColorsFromSvg(svg: string): string[] {
    const colors: string[] = [];

    // Extract fill colors
    const fillMatches = svg.matchAll(/fill="(#[0-9a-fA-F]{3,8})"/g);
    for (const match of fillMatches) {
        if (!colors.includes(match[1])) {
            colors.push(match[1]);
        }
    }

    // Extract stroke colors
    const strokeMatches = svg.matchAll(/stroke="(#[0-9a-fA-F]{3,8})"/g);
    for (const match of strokeMatches) {
        if (!colors.includes(match[1])) {
            colors.push(match[1]);
        }
    }

    // Extract gradient stop colors
    const stopMatches = svg.matchAll(/stop-color="(#[0-9a-fA-F]{3,8})"/g);
    for (const match of stopMatches) {
        if (!colors.includes(match[1])) {
            colors.push(match[1]);
        }
    }

    return colors;
}

function generateSupportingColors(primaryColors: string[]): string[] {
    const supporting: string[] = [];

    for (const color of primaryColors.slice(0, 2)) {
        // Parse hex
        const hex = color.replace('#', '');
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        // Generate lighter tint
        const tintR = Math.round(r + (255 - r) * 0.7);
        const tintG = Math.round(g + (255 - g) * 0.7);
        const tintB = Math.round(b + (255 - b) * 0.7);
        supporting.push(`#${tintR.toString(16).padStart(2, '0')}${tintG.toString(16).padStart(2, '0')}${tintB.toString(16).padStart(2, '0')}`);

        // Generate darker shade
        const shadeR = Math.round(r * 0.4);
        const shadeG = Math.round(g * 0.4);
        const shadeB = Math.round(b * 0.4);
        supporting.push(`#${shadeR.toString(16).padStart(2, '0')}${shadeG.toString(16).padStart(2, '0')}${shadeB.toString(16).padStart(2, '0')}`);
    }

    // Add neutral colors
    supporting.push('#1a1a2e');  // Dark
    supporting.push('#f8f9fa');  // Light

    return supporting;
}

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

export function generateBrandGuidelines(
    logo: GeneratedLogo,
    options?: {
        profile?: BrandProfile;
        primaryColor?: string;
        accentColor?: string;
    }
): BrandGuidelines {
    const algorithm = logo.algorithm as LogoAlgorithm;
    const primaryColors = extractColorsFromSvg(logo.svg);
    const primaryColor = options?.primaryColor || primaryColors[0] || '#333333';
    const accentColor = options?.accentColor || primaryColors[1];

    return {
        version: '1.0',
        generatedAt: new Date().toISOString(),
        brandName: logo.meta?.seed || logo.meta?.brandName || 'Brand',

        logoDescription: generateLogoDescription(algorithm),
        algorithmUsed: algorithm,

        clearSpace: generateClearSpaceRule(logo),
        minimumSize: generateMinimumSizeRule(logo),
        colorVariations: generateColorVariations(logo, primaryColor, accentColor),
        usageRules: generateUsageRules(logo, algorithm),

        typography: generateTypographySuggestions(algorithm, options?.profile),
        applications: generateApplicationExamples(),

        primaryColors,
        supportingColors: generateSupportingColors(primaryColors),
    };
}

function generateLogoDescription(algorithm: LogoAlgorithm): string {
    const descriptions: Record<LogoAlgorithm, string> = {
        'line-fragmentation': 'A modern mark composed of fragmented parallel lines, creating a dynamic sense of movement and digital innovation.',
        'staggered-bars': 'A bold design featuring rhythmically arranged horizontal bars, suggesting data visualization, growth, and technological precision.',
        'block-assembly': 'An architectural composition of overlapping geometric blocks with depth and transparency, conveying structure and dimensionality.',
        'motion-chevrons': 'Stacked chevron arrows creating a sense of forward momentum and progress, ideal for growth-oriented brands.',
        'negative-space': 'A clever use of negative space within a solid form to reveal the lettermark, demonstrating sophistication and thoughtful design.',
        'interlocking-loops': 'Gracefully interweaving shapes that symbolize connection, unity, and seamless collaboration.',
        'monogram-merge': 'A refined fusion of letterforms into a single cohesive mark, representing the brand essence with elegant simplicity.',
        'continuous-stroke': 'A fluid, unbroken line forming an abstract symbol, embodying continuity, creativity, and organic flow.',
        'geometric-extract': 'A bold geometric abstraction derived from letterforms, creating a distinctive and memorable visual identity.',
        'clover-radial': 'A symmetrical radial design with organic curves, suggesting balance, harmony, and natural growth.',
    };

    return descriptions[algorithm] || 'A unique visual identity designed to represent the brand with clarity and distinction.';
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

export function exportGuidelinesAsMarkdown(guidelines: BrandGuidelines): string {
    let md = `# ${guidelines.brandName} Brand Guidelines\n\n`;
    md += `*Generated: ${new Date(guidelines.generatedAt).toLocaleDateString()}*\n\n`;

    md += `## Logo Overview\n\n`;
    md += `${guidelines.logoDescription}\n\n`;
    md += `**Algorithm:** ${guidelines.algorithmUsed}\n\n`;

    md += `## Clear Space\n\n`;
    md += `${guidelines.clearSpace.description}\n\n`;

    md += `## Minimum Size\n\n`;
    md += `${guidelines.minimumSize.description}\n\n`;
    md += `- **Print:** ${guidelines.minimumSize.print.width}${guidelines.minimumSize.print.unit}\n`;
    md += `- **Digital:** ${guidelines.minimumSize.digital.width}${guidelines.minimumSize.digital.unit}\n`;
    md += `- **Favicon:** ${guidelines.minimumSize.favicon.width}${guidelines.minimumSize.favicon.unit}\n\n`;

    md += `## Color Variations\n\n`;
    for (const variation of guidelines.colorVariations) {
        md += `### ${variation.name}\n`;
        md += `${variation.description}\n\n`;
        md += `**Usage:** ${variation.usage}\n\n`;
        md += `- Primary: \`${variation.colors.primary}\`\n`;
        if (variation.colors.secondary) {
            md += `- Secondary: \`${variation.colors.secondary}\`\n`;
        }
        md += `- Background: \`${variation.colors.background}\`\n\n`;
    }

    md += `## Usage Rules\n\n`;
    md += `### Do\n\n`;
    for (const rule of guidelines.usageRules.filter(r => r.type === 'do')) {
        md += `- **${rule.title}:** ${rule.description}\n`;
    }
    md += `\n### Don't\n\n`;
    for (const rule of guidelines.usageRules.filter(r => r.type === 'dont')) {
        md += `- **${rule.title}:** ${rule.description}\n`;
    }

    md += `\n## Typography\n\n`;
    for (const font of guidelines.typography) {
        md += `### ${font.fontFamily} (${font.pairing})\n`;
        md += `${font.description}\n\n`;
        md += `- **Category:** ${font.category}\n`;
        md += `- **Weights:** ${font.weight}\n`;
        if (font.googleFontUrl) {
            md += `- **Font:** [Google Fonts](${font.googleFontUrl})\n`;
        }
        md += `\n`;
    }

    md += `## Brand Colors\n\n`;
    md += `### Primary Colors\n\n`;
    for (const color of guidelines.primaryColors) {
        md += `- \`${color}\`\n`;
    }
    md += `\n### Supporting Colors\n\n`;
    for (const color of guidelines.supportingColors) {
        md += `- \`${color}\`\n`;
    }

    return md;
}

export function exportGuidelinesAsJSON(guidelines: BrandGuidelines): string {
    return JSON.stringify(guidelines, null, 2);
}
