// ============================================
// TYPOGRAPHY INTELLIGENCE SYSTEM
// Smart descriptions based on font classification
// ============================================

// Font Classification Types
export type FontClassification =
    | 'geometric-sans'      // Inter, Outfit, Poppins
    | 'humanist-sans'       // Open Sans, Lato, Source Sans
    | 'neo-grotesque'       // Helvetica-like, neutral
    | 'modern-serif'        // Playfair, Didot-like
    | 'old-style-serif'     // Garamond, Caslon
    | 'slab-serif'          // Arvo, Bitter
    | 'soft-serif'          // Fraunces, Cooper-like
    | 'display'             // Bebas, Anton, Oswald
    | 'script'              // Pacifico, handwritten
    | 'mono'                // IBM Plex, Roboto Mono
    | 'decorative';         // Unique, artistic

export interface FontMetadata {
    classification: FontClassification;
    personality: string[];
    bestFor: string[];
    pairsWith: FontClassification[];
    description: string;
    shortDescription: string;
}

// ============================================
// FONT DATABASE (Known fonts with metadata)
// ============================================

export const FONT_DATABASE: Record<string, FontMetadata> = {
    // === GEOMETRIC SANS ===
    'Inter': {
        classification: 'geometric-sans',
        personality: ['neutral', 'precise', 'modern', 'systematic'],
        bestFor: ['UI/UX', 'SaaS products', 'documentation', 'digital interfaces'],
        pairsWith: ['modern-serif', 'soft-serif', 'display'],
        description: 'A highly legible typeface designed specifically for computer screens. Its neutrality makes it perfect for interfaces where content should take center stage.',
        shortDescription: 'Screen-optimized, neutral, ultra-readable'
    },
    'Outfit': {
        classification: 'geometric-sans',
        personality: ['friendly', 'modern', 'approachable', 'tech-forward'],
        bestFor: ['startups', 'apps', 'branding', 'tech products'],
        pairsWith: ['modern-serif', 'soft-serif', 'mono'],
        description: 'A geometric sans with softened terminals that feels both contemporary and welcoming. Perfect for brands that want to appear innovative yet approachable.',
        shortDescription: 'Modern geometric with friendly character'
    },
    'Poppins': {
        classification: 'geometric-sans',
        personality: ['bold', 'confident', 'geometric', 'striking'],
        bestFor: ['logos', 'headlines', 'marketing', 'bold statements'],
        pairsWith: ['humanist-sans', 'old-style-serif'],
        description: 'A geometric sans-serif with strong circular forms. Its boldness makes headlines pop while remaining highly readable at smaller sizes.',
        shortDescription: 'Bold geometric with circular letterforms'
    },
    'DM Sans': {
        classification: 'geometric-sans',
        personality: ['clean', 'contemporary', 'balanced', 'versatile'],
        bestFor: ['product design', 'branding', 'websites', 'apps'],
        pairsWith: ['soft-serif', 'modern-serif', 'mono'],
        description: 'A low-contrast geometric sans designed for optimal readability. Its generous x-height and open apertures ensure clarity across all sizes.',
        shortDescription: 'Balanced geometric, excellent readability'
    },
    'Plus Jakarta Sans': {
        classification: 'geometric-sans',
        personality: ['fresh', 'contemporary', 'professional', 'tech'],
        bestFor: ['tech brands', 'SaaS', 'digital products', 'corporate'],
        pairsWith: ['modern-serif', 'soft-serif', 'mono'],
        description: 'A modern geometric typeface with a slightly warmer personality. Popular among tech companies for its balance of professionalism and approachability.',
        shortDescription: 'Tech-forward with warm undertones'
    },
    'Manrope': {
        classification: 'geometric-sans',
        personality: ['minimal', 'refined', 'sophisticated', 'modern'],
        bestFor: ['premium brands', 'portfolios', 'design studios'],
        pairsWith: ['modern-serif', 'soft-serif'],
        description: 'A semi-rounded geometric with excellent optical balance. Its subtle personality makes it ideal for brands seeking quiet sophistication.',
        shortDescription: 'Minimalist geometric, quietly sophisticated'
    },
    'Space Grotesk': {
        classification: 'geometric-sans',
        personality: ['futuristic', 'technical', 'bold', 'distinctive'],
        bestFor: ['tech', 'crypto', 'gaming', 'innovation'],
        pairsWith: ['mono', 'display'],
        description: 'A proportional sans-serif derived from Space Mono. Its mono-inspired quirks give it a distinctive, technical character perfect for forward-thinking brands.',
        shortDescription: 'Technical, futuristic, mono-inspired'
    },

    // === HUMANIST SANS ===
    'Open Sans': {
        classification: 'humanist-sans',
        personality: ['friendly', 'warm', 'accessible', 'trustworthy'],
        bestFor: ['content-heavy sites', 'healthcare', 'education', 'government'],
        pairsWith: ['old-style-serif', 'slab-serif', 'modern-serif'],
        description: 'An open and friendly typeface designed for maximum legibility. Its humanist proportions make long-form content comfortable to read.',
        shortDescription: 'Warm, accessible, optimized for reading'
    },
    'Lato': {
        classification: 'humanist-sans',
        personality: ['warm', 'stable', 'serious', 'professional'],
        bestFor: ['corporate', 'finance', 'professional services'],
        pairsWith: ['modern-serif', 'old-style-serif', 'slab-serif'],
        description: 'Semi-rounded details give Lato a feeling of warmth, while its strong structure maintains a sense of stability and professionalism.',
        shortDescription: 'Warm yet stable, professional presence'
    },
    'Source Sans Pro': {
        classification: 'humanist-sans',
        personality: ['neutral', 'readable', 'professional', 'versatile'],
        bestFor: ['documentation', 'UI', 'publishing', 'general use'],
        pairsWith: ['mono', 'old-style-serif', 'slab-serif'],
        description: 'Adobe\'s first open-source typeface, designed for user interfaces. Its neutrality and excellent legibility make it a reliable workhorse.',
        shortDescription: 'Adobe\'s versatile workhorse'
    },
    'Work Sans': {
        classification: 'humanist-sans',
        personality: ['modern', 'editorial', 'clean', 'contemporary'],
        bestFor: ['editorial', 'magazines', 'blogs', 'creative'],
        pairsWith: ['modern-serif', 'soft-serif', 'display'],
        description: 'Optimized for on-screen text at medium sizes. Its subtle quirks add character without compromising readability.',
        shortDescription: 'Editorial feel, screen-optimized'
    },

    // === MODERN SERIF ===
    'Playfair Display': {
        classification: 'modern-serif',
        personality: ['elegant', 'editorial', 'sophisticated', 'dramatic'],
        bestFor: ['fashion', 'luxury', 'magazines', 'editorial'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'A transitional design with high stroke contrast. Its elegant letterforms evoke the sophistication of traditional print while feeling distinctly contemporary.',
        shortDescription: 'High contrast, editorial elegance'
    },
    'Cormorant Garamond': {
        classification: 'modern-serif',
        personality: ['refined', 'graceful', 'luxurious', 'timeless'],
        bestFor: ['luxury brands', 'fashion', 'wine/spirits', 'high-end retail'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'A display serif with delicate, refined letterforms inspired by Garamond. Its graceful curves project luxury and timeless sophistication.',
        shortDescription: 'Refined luxury, Garamond-inspired'
    },
    'Libre Baskerville': {
        classification: 'modern-serif',
        personality: ['trustworthy', 'classic', 'professional', 'authoritative'],
        bestFor: ['law', 'finance', 'publishing', 'academia'],
        pairsWith: ['geometric-sans', 'humanist-sans', 'mono'],
        description: 'Based on the American Type Founders Baskerville. It carries the authority and trustworthiness of traditional serif typography.',
        shortDescription: 'Classic authority, Baskerville heritage'
    },

    // === OLD-STYLE SERIF ===
    'Lora': {
        classification: 'old-style-serif',
        personality: ['warm', 'readable', 'classic', 'contemporary'],
        bestFor: ['blogs', 'long-form content', 'books', 'articles'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'A well-balanced contemporary serif with roots in calligraphy. Its brushed curves bring warmth to digital reading experiences.',
        shortDescription: 'Contemporary warmth, calligraphic roots'
    },
    'Merriweather': {
        classification: 'old-style-serif',
        personality: ['readable', 'friendly', 'traditional', 'reliable'],
        bestFor: ['blogs', 'news', 'publishing', 'content-heavy sites'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'Designed specifically for screen readability with an expanded x-height and open forms. It makes long-form digital reading a pleasure.',
        shortDescription: 'Screen-first, exceptional readability'
    },

    // === SOFT SERIF ===
    'Fraunces': {
        classification: 'soft-serif',
        personality: ['warm', 'expressive', 'friendly', 'characterful'],
        bestFor: ['artisan brands', 'food/beverage', 'lifestyle', 'editorial'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'A soft-serif with organic curves and a wonky, expressive character. Its warmth makes brands feel approachable and human.',
        shortDescription: 'Warm, wonky, distinctly human'
    },
    'Eczar': {
        classification: 'soft-serif',
        personality: ['bold', 'expressive', 'unique', 'impactful'],
        bestFor: ['headlines', 'branding', 'creative', 'editorial'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'A high-contrast serif designed for impact. Its bold weights and expressive curves make statements that demand attention.',
        shortDescription: 'Bold impact, expressive curves'
    },

    // === SLAB SERIF ===
    'Arvo': {
        classification: 'slab-serif',
        personality: ['sturdy', 'reliable', 'bold', 'approachable'],
        bestFor: ['headlines', 'branding', 'editorial', 'tech'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'A geometric slab-serif with uniform stroke weights. Its sturdy presence commands attention while remaining friendly.',
        shortDescription: 'Geometric slab, sturdy presence'
    },

    // === DISPLAY FONTS ===
    'Bebas Neue': {
        classification: 'display',
        personality: ['bold', 'impactful', 'condensed', 'industrial'],
        bestFor: ['headlines', 'posters', 'titles', 'branding'],
        pairsWith: ['humanist-sans', 'geometric-sans', 'old-style-serif'],
        description: 'An all-caps display font with narrow proportions that commands attention. Perfect for headlines that need maximum impact.',
        shortDescription: 'Condensed impact, all-caps power'
    },
    'Oswald': {
        classification: 'display',
        personality: ['bold', 'condensed', 'modern', 'strong'],
        bestFor: ['headlines', 'sports', 'news', 'marketing'],
        pairsWith: ['humanist-sans', 'geometric-sans'],
        description: 'A reworking of classic gothic style condensed typefaces. Its boldness makes it ideal for attention-grabbing headlines.',
        shortDescription: 'Neo-gothic, condensed strength'
    },
    'Syne': {
        classification: 'display',
        personality: ['artistic', 'creative', 'unique', 'avant-garde'],
        bestFor: ['creative agencies', 'art', 'music', 'avant-garde brands'],
        pairsWith: ['geometric-sans', 'humanist-sans', 'mono'],
        description: 'A typeface with quirky, artistic letterforms. Its unconventional character makes it perfect for brands that want to stand out.',
        shortDescription: 'Artistic quirks, creative edge'
    },
    'Unbounded': {
        classification: 'display',
        personality: ['futuristic', 'wide', 'bold', 'contemporary'],
        bestFor: ['tech', 'innovation', 'gaming', 'modern brands'],
        pairsWith: ['geometric-sans', 'mono'],
        description: 'An expanded display typeface with a futuristic feel. Its wide proportions and variable technology make it distinctly modern.',
        shortDescription: 'Expanded futurism, variable power'
    },

    // === MONO FONTS ===
    'Roboto Mono': {
        classification: 'mono',
        personality: ['technical', 'precise', 'clean', 'developer'],
        bestFor: ['code', 'tech', 'data', 'developer tools'],
        pairsWith: ['geometric-sans', 'humanist-sans', 'display'],
        description: 'A monospaced typeface with optimized letterforms for coding. Its clarity makes it perfect for technical content and developer experiences.',
        shortDescription: 'Developer-focused, optimized for code'
    },
    'IBM Plex Mono': {
        classification: 'mono',
        personality: ['corporate', 'technical', 'trustworthy', 'precise'],
        bestFor: ['enterprise', 'tech', 'fintech', 'documentation'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: 'IBM\'s corporate typeface in monospaced form. It balances technical precision with approachable warmth.',
        shortDescription: 'Enterprise precision, IBM heritage'
    },
    'Source Code Pro': {
        classification: 'mono',
        personality: ['professional', 'readable', 'clean', 'balanced'],
        bestFor: ['code', 'documentation', 'terminals', 'tech'],
        pairsWith: ['humanist-sans', 'geometric-sans'],
        description: 'Adobe\'s monospaced companion to Source Sans. Designed for coding environments with excellent distinction between similar characters.',
        shortDescription: 'Adobe\'s code companion'
    },
    'Inconsolata': {
        classification: 'mono',
        personality: ['retro', 'friendly', 'readable', 'hacker'],
        bestFor: ['code', 'terminals', 'retro tech', 'developer'],
        pairsWith: ['humanist-sans', 'geometric-sans'],
        description: 'A monospace font designed for printed code listings. Its slightly humanist touch makes it friendlier than purely geometric alternatives.',
        shortDescription: 'Friendly mono, print heritage'
    }
};

// ============================================
// DESCRIPTION GENERATORS
// ============================================

export function getClassificationDescription(classification: FontClassification): { role: string; traits: string } {
    const descriptions: Record<FontClassification, { role: string; traits: string }> = {
        'geometric-sans': {
            role: 'digital interfaces and modern brands',
            traits: 'Its clean geometric structure communicates precision and modernity'
        },
        'humanist-sans': {
            role: 'content-heavy experiences and approachable brands',
            traits: 'Its warm, humanist proportions create comfortable reading experiences'
        },
        'neo-grotesque': {
            role: 'neutral, systematic design systems',
            traits: 'Its neutrality lets content speak without typographic interference'
        },
        'modern-serif': {
            role: 'editorial, fashion, and luxury contexts',
            traits: 'Its high contrast and refined letterforms project sophistication'
        },
        'old-style-serif': {
            role: 'long-form reading and classic aesthetics',
            traits: 'Its calligraphic roots bring warmth and timeless appeal'
        },
        'slab-serif': {
            role: 'bold headlines and sturdy brand presence',
            traits: 'Its uniform strokes and blocky serifs command attention'
        },
        'soft-serif': {
            role: 'friendly, artisan, and lifestyle brands',
            traits: 'Its organic curves and soft edges feel approachable and human'
        },
        'display': {
            role: 'headlines, titles, and brand statements',
            traits: 'Its distinctive character makes strong visual impressions'
        },
        'script': {
            role: 'personal, creative, and casual contexts',
            traits: 'Its handwritten quality adds personality and warmth'
        },
        'mono': {
            role: 'technical content and developer experiences',
            traits: 'Its fixed-width characters ensure alignment and precision'
        },
        'decorative': {
            role: 'unique brand expressions and artistic contexts',
            traits: 'Its unconventional forms create memorable impressions'
        }
    };
    return descriptions[classification] || descriptions['geometric-sans'];
}

/**
 * Get font metadata, with fallback for unknown fonts
 */
export function getFontMetadata(fontName: string): FontMetadata {
    // Direct match
    if (FONT_DATABASE[fontName]) {
        return FONT_DATABASE[fontName];
    }

    // Try without spaces/case
    const normalized = fontName.replace(/\s+/g, '').toLowerCase();
    for (const [key, value] of Object.entries(FONT_DATABASE)) {
        if (key.replace(/\s+/g, '').toLowerCase() === normalized) {
            return value;
        }
    }

    // Infer classification from name patterns
    const lower = fontName.toLowerCase();
    let inferredClassification: FontClassification = 'geometric-sans';

    if (lower.includes('mono') || lower.includes('code')) {
        inferredClassification = 'mono';
    } else if (lower.includes('serif') || lower.includes('garamond') || lower.includes('times')) {
        inferredClassification = 'modern-serif';
    } else if (lower.includes('display') || lower.includes('bebas') || lower.includes('anton')) {
        inferredClassification = 'display';
    } else if (lower.includes('script') || lower.includes('hand') || lower.includes('brush')) {
        inferredClassification = 'script';
    }

    // Return inferred metadata
    const classDesc = getClassificationDescription(inferredClassification);
    return {
        classification: inferredClassification,
        personality: ['modern', 'versatile'],
        bestFor: ['general use', 'branding'],
        pairsWith: ['geometric-sans', 'humanist-sans'],
        description: `${fontName} is a ${inferredClassification.replace('-', ' ')} typeface well-suited for ${classDesc.role}. ${classDesc.traits}.`,
        shortDescription: `${inferredClassification.replace('-', ' ')} typeface`
    };
}

/**
 * Check if fonts form a pairing (different fonts for heading/body)
 */
export function isPairing(headingName: string, bodyName: string): boolean {
    return headingName.toLowerCase() !== bodyName.toLowerCase();
}

/**
 * Generate pairing rationale based on font classifications
 */
export function getPairingRationale(headingMeta: FontMetadata, bodyMeta: FontMetadata, headingName: string, bodyName: string): string {
    const headingClass = headingMeta.classification;
    const bodyClass = bodyMeta.classification;

    // Serif + Sans combinations
    if ((headingClass.includes('serif') && bodyClass.includes('sans')) ||
        (headingClass.includes('sans') && bodyClass.includes('serif'))) {
        return `This pairing creates visual hierarchy through typographic contrast. ${headingName} draws the eye with its distinctive character, while ${bodyName} provides a comfortable reading experience for body content.`;
    }

    // Display + Neutral combinations
    if (headingClass === 'display' && (bodyClass === 'geometric-sans' || bodyClass === 'humanist-sans')) {
        return `${headingName} makes bold statements in headlines, while ${bodyName} ensures body text remains readable and accessible. The contrast creates clear hierarchy without competition.`;
    }

    // Serif + Mono combinations
    if (headingClass.includes('serif') && bodyClass === 'mono') {
        return `An editorial meets technical aesthetic. ${headingName} brings classic elegance to headlines, while ${bodyName} adds a technical, precise quality to supporting content.`;
    }

    // Same family but different roles
    if (headingClass === bodyClass) {
        return `Both fonts share a ${headingClass.replace('-', ' ')} foundation, creating visual cohesion. ${headingName} handles display duties while ${bodyName} manages body content with consistent character.`;
    }

    // Default
    return `${headingName} and ${bodyName} complement each other through balanced contrast. The pairing provides clear visual hierarchy while maintaining brand consistency.`;
}

/**
 * Generate complete typography description for a brand
 */
export function generateTypographyDescription(
    brandName: string,
    headingFontName: string,
    bodyFontName: string
): {
    isPairing: boolean;
    headingMeta: FontMetadata;
    bodyMeta: FontMetadata;
    headingDescription: string;
    bodyDescription: string;
    pairingRationale: string | null;
    summary: string;
} {
    const headingMeta = getFontMetadata(headingFontName);
    const bodyMeta = getFontMetadata(bodyFontName);
    const hasPairing = isPairing(headingFontName, bodyFontName);

    const headingDesc = getClassificationDescription(headingMeta.classification);
    const bodyDesc = getClassificationDescription(bodyMeta.classification);

    const headingDescription = `${headingFontName} serves as the display typeface for ${brandName}. ${headingMeta.description}`;
    const bodyDescription = hasPairing
        ? `${bodyFontName} handles body text and UI elements. ${bodyMeta.description}`
        : `The same typeface is used consistently across all text, creating a cohesive visual language.`;

    const pairingRationale = hasPairing
        ? getPairingRationale(headingMeta, bodyMeta, headingFontName, bodyFontName)
        : null;

    const summary = hasPairing
        ? `${headingFontName} (display) paired with ${bodyFontName} (body) creates a balanced typographic system.`
        : `${headingFontName} is used as a single-family system for both headlines and body text.`;

    return {
        isPairing: hasPairing,
        headingMeta,
        bodyMeta,
        headingDescription,
        bodyDescription,
        pairingRationale,
        summary
    };
}
