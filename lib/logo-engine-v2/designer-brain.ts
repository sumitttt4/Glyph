/**
 * Designer Brain System
 * 
 * Simulates the real logo designer thought process:
 * 1. Discovery — What does the brand DO? Who are they FOR? What's their PERSONALITY?
 * 2. Word Association — Brand name → related concepts → visual metaphors
 * 3. Sketching — Generate multiple concepts, find patterns
 * 4. Refinement — Pick strongest concepts, develop further
 * 5. System Thinking — Does it work as app icon, favicon, billboard, watermark?
 * 6. Presentation — Quality-checked output with 4 refined variants
 * 
 * Key insight: Designers don't pick random shapes. They find the CONCEPT first, then visualize it.
 */

import { InfiniteLogoParams } from './types';
import { LOGO_LIBRARY } from './algorithms/library';
import { CATEGORY_COMPOSITIONS, generateAbstractIcon } from './abstract-icons';
import { getSkeleton, hasCurvedElements, hasDiagonalElements } from './letter-skeletons';

// ============================================
// TYPES
// ============================================

export interface BrandInput {
    name: string;
    category?: string;
    description?: string;
    targetAudience?: string;
    keywords?: string[];
    personality?: ('professional' | 'playful' | 'minimal' | 'bold' | 'elegant' | 'tech' | 'organic' | 'geometric')[];
    preferLettermark?: boolean;
    preferAbstract?: boolean;
}

export interface DesignerDiscovery {
    /** What the brand does - core business */
    whatTheyDo: string[];
    /** Who the brand serves - target audience */
    whoTheyServe: string[];
    /** Brand personality traits */
    personality: string[];
    /** Emotional tone */
    emotionalTone: 'serious' | 'friendly' | 'premium' | 'approachable' | 'innovative' | 'traditional';
    /** Visual direction */
    visualDirection: 'geometric' | 'organic' | 'minimal' | 'complex' | 'bold' | 'refined';
}

export interface ConceptAssociation {
    /** Original word/concept */
    word: string;
    /** Related concepts */
    relatedConcepts: string[];
    /** Visual metaphors (shapes, movements, feelings) */
    visualMetaphors: string[];
    /** Strength score 0-100 */
    relevanceScore: number;
}

export interface SketchConcept {
    /** Concept ID */
    id: string;
    /** Concept name */
    name: string;
    /** Description of the visual approach */
    approach: string;
    /** Algorithm to use */
    algorithm: string;
    /** Custom params for this concept */
    params: Partial<InfiniteLogoParams>;
    /** Concept strength score */
    score: number;
    /** Tags for filtering */
    tags: string[];
}

export interface RefinedLogo {
    /** Unique ID */
    id: string;
    /** SVG string */
    svg: string;
    /** Concept name */
    conceptName: string;
    /** Why this concept works */
    rationale: string;
    /** Quality scores */
    qualityScores: {
        scalability: number;    // Works at all sizes
        simplicity: number;     // Clean and memorable
        relevance: number;      // Fits the brand
        uniqueness: number;     // Distinctive
        versatility: number;    // Works in different contexts
        overall: number;        // Weighted average
    };
    /** Passed quality check */
    approved: boolean;
}

export interface DesignerOutput {
    /** Discovery insights */
    discovery: DesignerDiscovery;
    /** Concept associations explored */
    associations: ConceptAssociation[];
    /** Number of concepts sketched */
    conceptsExplored: number;
    /** Final refined variants (4) */
    variants: RefinedLogo[];
    /** Primary recommended variant */
    recommendation: RefinedLogo;
    /** Design rationale summary */
    designRationale: string;
}

// ============================================
// WORD ASSOCIATION DATABASE
// ============================================

const INDUSTRY_CONCEPTS: Record<string, string[]> = {
    'technology': ['innovation', 'future', 'connection', 'speed', 'precision', 'digital', 'smart', 'network', 'data', 'cloud'],
    'finance': ['trust', 'growth', 'stability', 'security', 'wealth', 'progress', 'solid', 'reliable', 'protect', 'value'],
    'healthcare': ['care', 'life', 'wellness', 'healing', 'protection', 'comfort', 'vitality', 'balance', 'nurture', 'trust'],
    'food': ['fresh', 'natural', 'taste', 'warmth', 'homemade', 'quality', 'artisan', 'organic', 'delicious', 'nourish'],
    'fashion': ['style', 'elegance', 'trend', 'luxury', 'expression', 'beauty', 'unique', 'refined', 'bold', 'timeless'],
    'education': ['growth', 'knowledge', 'wisdom', 'enlighten', 'discover', 'learn', 'achieve', 'inspire', 'guide', 'open'],
    'entertainment': ['joy', 'excitement', 'fun', 'energy', 'experience', 'wonder', 'play', 'engage', 'thrill', 'delight'],
    'real-estate': ['home', 'foundation', 'space', 'build', 'shelter', 'community', 'invest', 'growth', 'establish', 'roots'],
    'consulting': ['expert', 'guide', 'strategy', 'insight', 'solve', 'partner', 'transform', 'clarity', 'focus', 'lead'],
    'creative': ['imagination', 'vision', 'expression', 'craft', 'unique', 'inspire', 'create', 'design', 'art', 'story'],
};

const PERSONALITY_TO_VISUAL: Record<string, { shapes: string[], styles: string[], algorithms: string[] }> = {
    'professional': {
        shapes: ['square', 'rectangle', 'line', 'grid'],
        styles: ['minimal', 'geometric', 'structured'],
        algorithms: ['Swiss Minimal', 'Monoline Clean', 'Blueprint Letter', 'Shield Mark'],
    },
    'playful': {
        shapes: ['circle', 'wave', 'dot-pattern', 'rounded'],
        styles: ['organic', 'colorful', 'dynamic'],
        algorithms: ['Modular Dots', 'Wave Form', 'Chat Dots', 'Multi-Outline Glow'],
    },
    'minimal': {
        shapes: ['line', 'circle', 'single-element'],
        styles: ['clean', 'space', 'refined'],
        algorithms: ['Monoline Wire', 'Concentric Rings', 'Swiss Minimal', 'Abstract Dots'],
    },
    'bold': {
        shapes: ['triangle', 'square', 'heavy-stroke', 'solid'],
        styles: ['impactful', 'strong', 'statement'],
        algorithms: ['Stencil Bold', 'Hard Shadow', 'Negative Space', '3D Block'],
    },
    'elegant': {
        shapes: ['curve', 'spiral', 'refined-line', 'script'],
        styles: ['sophisticated', 'refined', 'timeless'],
        algorithms: ['Calligraphic Stroke', 'Brush Script', 'Flow Script', 'Pen Stroke'],
    },
    'tech': {
        shapes: ['grid', 'pixel', 'circuit', 'node'],
        styles: ['digital', 'precise', 'modern'],
        algorithms: ['Pixel Grid', 'Code Brackets', 'Binary Dots', 'Architectural Grid'],
    },
    'organic': {
        shapes: ['leaf', 'wave', 'curve', 'flowing'],
        styles: ['natural', 'soft', 'flowing'],
        algorithms: ['Leaf Curve', 'Wave Form', 'Flow Script', 'Eco Fusion'],
    },
    'geometric': {
        shapes: ['triangle', 'circle', 'square', 'polygon'],
        styles: ['precise', 'mathematical', 'balanced'],
        algorithms: ['Quantum Interlock', 'Orbital Rings', 'Trinity Knot', 'Construction Grid'],
    },
};

const VISUAL_METAPHORS: Record<string, string[]> = {
    'speed': ['arrow', 'streak', 'forward-motion', 'wind-lines', 'progressive-bars'],
    'growth': ['upward-angle', 'ascending-steps', 'sprout', 'rising-curve', 'expanding-circles'],
    'connection': ['interlock', 'bridge', 'handshake-abstract', 'linked-rings', 'network-nodes'],
    'trust': ['shield', 'check', 'solid-foundation', 'encompassing-circle', 'steady-base'],
    'innovation': ['spark', 'lightbulb-abstract', 'forward-arrow', 'breaking-pattern', 'new-path'],
    'quality': ['diamond', 'crown-abstract', 'star', 'refined-edge', 'precise-angle'],
    'balance': ['symmetry', 'scales-abstract', 'yin-yang', 'centered-composition', 'equal-weights'],
    'energy': ['burst', 'radial', 'dynamic-angle', 'power-lines', 'explosive-center'],
    'wisdom': ['book-abstract', 'scroll-curve', 'light-rays', 'deep-knowledge', 'enlightenment'],
    'community': ['gathering', 'circle-of-people', 'connected-dots', 'unified-shape', 'collective'],
};

// ============================================
// INDUSTRY COLOR RECOMMENDATIONS
// Based on real-world logo trends and color psychology
// ============================================

export interface ColorPalette {
    /** Primary color (dominant) */
    primary: string;
    /** Secondary color (accent) */
    secondary: string;
    /** Background suggestion */
    background: string;
    /** Text color for contrast */
    text: string;
    /** Alternative palettes */
    alternatives: { primary: string; secondary: string; name: string }[];
    /** Color psychology reasoning */
    reasoning: string;
}

export const INDUSTRY_COLORS: Record<string, ColorPalette> = {
    // SaaS / B2B Startup - Trust, stability, professionalism
    'saas': {
        primary: '#4F46E5',      // Indigo (Stripe, Intercom vibe)
        secondary: '#06B6D4',    // Cyan accent
        background: '#0F172A',   // Dark slate
        text: '#F8FAFC',
        alternatives: [
            { primary: '#3B82F6', secondary: '#8B5CF6', name: 'Classic Blue' },      // Traditional SaaS blue
            { primary: '#6366F1', secondary: '#EC4899', name: 'Modern Purple' },     // Figma-like
            { primary: '#0EA5E9', secondary: '#14B8A6', name: 'Ocean Trust' },       // Notion-like
        ],
        reasoning: 'Blue/indigo conveys trust, stability, and technology. Used by Stripe, Salesforce, Zoom.',
    },

    // Mobile App (Consumer) - Vibrant, youthful, engaging
    'mobile-app': {
        primary: '#F43F5E',      // Rose/Pink (Instagram gradient start)
        secondary: '#8B5CF6',    // Violet
        background: '#18181B',   // Zinc dark
        text: '#FAFAFA',
        alternatives: [
            { primary: '#EC4899', secondary: '#F97316', name: 'Sunset Gradient' },   // Instagram-like
            { primary: '#22C55E', secondary: '#10B981', name: 'Fresh Green' },       // Spotify-like
            { primary: '#3B82F6', secondary: '#06B6D4', name: 'Cool Blue' },         // Twitter/X-like
        ],
        reasoning: 'Vibrant gradients and bold colors drive engagement. Think Instagram, Snapchat, TikTok.',
    },

    // Design Agency / Studio - Creative, bold, artistic
    'design-agency': {
        primary: '#000000',      // Pure Black (sophisticated)
        secondary: '#FF5722',    // Deep Orange (creative accent)
        background: '#FFFFFF',   // Clean white
        text: '#171717',
        alternatives: [
            { primary: '#18181B', secondary: '#FBBF24', name: 'Minimal Gold' },      // Pentagram-like
            { primary: '#1E1E1E', secondary: '#E11D48', name: 'Bold Red' },          // Strong statement
            { primary: '#0A0A0A', secondary: '#A855F7', name: 'Creative Purple' },   // Artistic flair
        ],
        reasoning: 'Black shows confidence and sophistication. Accent colors show creativity. Used by Pentagram, IDEO.',
    },

    // Fintech & Banking - Trust, wealth, security
    'fintech': {
        primary: '#0D9488',      // Teal (Robinhood-like)
        secondary: '#0EA5E9',    // Sky blue
        background: '#0C0A09',   // Stone black
        text: '#FAFAF9',
        alternatives: [
            { primary: '#22C55E', secondary: '#16A34A', name: 'Money Green' },       // Robinhood, Cash App
            { primary: '#1D4ED8', secondary: '#60A5FA', name: 'Trust Blue' },        // Traditional banking
            { primary: '#7C3AED', secondary: '#A78BFA', name: 'Modern Purple' },     // Nubank, Revolut
        ],
        reasoning: 'Green = money/growth. Blue = trust. Purple = modern/disruptive. Robinhood, Stripe, Nubank.',
    },

    // Web3 / Crypto Protocol - Futuristic, decentralized, innovative
    'crypto': {
        primary: '#22C55E',      // Crypto Green (growth, money)
        secondary: '#A855F7',    // Purple (innovation)
        background: '#09090B',   // Near black
        text: '#F4F4F5',
        alternatives: [
            { primary: '#14B8A6', secondary: '#06B6D4', name: 'Teal Flow' },         // Ethereum-like
            { primary: '#8B5CF6', secondary: '#EC4899', name: 'NFT Purple' },        // OpenSea, Uniswap
            { primary: '#F97316', secondary: '#FBBF24', name: 'Bitcoin Orange' },    // Bitcoin-inspired
            { primary: '#3B82F6', secondary: '#1D4ED8', name: 'DeFi Blue' },         // Chainlink-like
        ],
        reasoning: 'Green for growth/wealth. Purple for innovation. Orange for Bitcoin ecosystem. Ethereum, Uniswap, Chainlink.',
    },

    // AI / LLM Tool - Futuristic, intelligent, cutting-edge
    'ai': {
        primary: '#8B5CF6',      // Violet (intelligence, creativity)
        secondary: '#06B6D4',    // Cyan (tech, futuristic)
        background: '#0A0A0A',   // Pure dark
        text: '#FAFAFA',
        alternatives: [
            { primary: '#10B981', secondary: '#14B8A6', name: 'OpenAI Green' },      // ChatGPT-like
            { primary: '#6366F1', secondary: '#3B82F6', name: 'Anthropic Blue' },    // Claude-like
            { primary: '#EC4899', secondary: '#F43F5E', name: 'Midjourney Pink' },   // Creative AI
            { primary: '#F97316', secondary: '#FBBF24', name: 'Warm Intelligence' }, // Friendly AI
        ],
        reasoning: 'Purple = creativity/intelligence. Cyan = tech/future. Green = helpful. OpenAI, Anthropic, Midjourney.',
    },

    // Developer Tool / API - Technical, precise, powerful
    'developer': {
        primary: '#F97316',      // Orange (GitHub Actions, GitLab)
        secondary: '#22C55E',    // Terminal green
        background: '#0D1117',   // GitHub dark
        text: '#C9D1D9',
        alternatives: [
            { primary: '#EF4444', secondary: '#F97316', name: 'Error Red' },         // Powerful, attention
            { primary: '#3B82F6', secondary: '#60A5FA', name: 'VS Code Blue' },      // Familiar developer blue
            { primary: '#A855F7', secondary: '#C084FC', name: 'Supabase Purple' },   // Modern dev tools
            { primary: '#FBBF24', secondary: '#F59E0B', name: 'Warning Yellow' },    // JS ecosystem
        ],
        reasoning: 'Orange/red = power. Green = terminal/success. Dark backgrounds always. GitHub, Vercel, Supabase.',
    },

    // Healthcare / Medical - Trust, care, cleanliness
    'healthcare': {
        primary: '#0EA5E9',      // Medical blue (trust, calm)
        secondary: '#10B981',    // Healing green
        background: '#FFFFFF',   // Clean white
        text: '#0F172A',
        alternatives: [
            { primary: '#3B82F6', secondary: '#06B6D4', name: 'Hospital Blue' },     // Traditional medical
            { primary: '#14B8A6', secondary: '#5EEAD4', name: 'Wellness Teal' },     // Modern health
            { primary: '#EC4899', secondary: '#F472B6', name: 'Care Pink' },         // Women's health
            { primary: '#22C55E', secondary: '#86EFAC', name: 'Natural Health' },    // Organic/wellness
        ],
        reasoning: 'Blue = trust, calm. Green = health, nature. White = cleanliness. CVS, Headspace, One Medical.',
    },

    // E-commerce / Retail - Exciting, trustworthy, action
    'ecommerce': {
        primary: '#F97316',      // Action orange (Amazon smile)
        secondary: '#FBBF24',    // Gold/value
        background: '#FFFFFF',
        text: '#171717',
        alternatives: [
            { primary: '#EF4444', secondary: '#F97316', name: 'Sale Red' },          // Urgency, deals
            { primary: '#8B5CF6', secondary: '#A855F7', name: 'Luxury Purple' },     // Premium retail
            { primary: '#22C55E', secondary: '#16A34A', name: 'Eco Commerce' },      // Sustainable retail
        ],
        reasoning: 'Orange = action, enthusiasm. Yellow = value. Red = urgency. Amazon, Etsy, Shopify.',
    },

    // Education / EdTech - Growth, knowledge, accessibility
    'education': {
        primary: '#3B82F6',      // Knowledge blue
        secondary: '#22C55E',    // Growth green
        background: '#FAFAFA',   // Soft white
        text: '#1E293B',
        alternatives: [
            { primary: '#8B5CF6', secondary: '#6366F1', name: 'Creative Learning' },
            { primary: '#F97316', secondary: '#FBBF24', name: 'Engaging Orange' },   // Duolingo-like
            { primary: '#14B8A6', secondary: '#06B6D4', name: 'Modern EdTech' },     // Coursera-like
        ],
        reasoning: 'Blue = knowledge/trust. Green = growth. Orange = engagement. Duolingo, Coursera, Khan Academy.',
    },

    // Food & Beverage - Appetite, freshness, warmth
    'food': {
        primary: '#EF4444',      // Appetite red (stimulates hunger)
        secondary: '#F97316',    // Warm orange
        background: '#FEF2F2',   // Warm white
        text: '#1C1917',
        alternatives: [
            { primary: '#FBBF24', secondary: '#F97316', name: 'Fast Food Yellow' }, // McDonald's vibe
            { primary: '#22C55E', secondary: '#16A34A', name: 'Fresh & Healthy' },  // Whole Foods vibe
            { primary: '#92400E', secondary: '#D97706', name: 'Artisan Brown' },    // Coffee, bakery
        ],
        reasoning: 'Red/orange stimulate appetite. Green = fresh/healthy. Brown = artisan. McDonald\'s, Starbucks, Whole Foods.',
    },

    // Real Estate / Property - Stability, trust, premium
    'real-estate': {
        primary: '#1D4ED8',      // Trust blue
        secondary: '#D4AF37',    // Luxury gold
        background: '#FFFFFF',
        text: '#0F172A',
        alternatives: [
            { primary: '#166534', secondary: '#22C55E', name: 'Property Green' },   // Trulia-like
            { primary: '#0F172A', secondary: '#64748B', name: 'Premium Dark' },     // Luxury real estate
            { primary: '#7C3AED', secondary: '#A855F7', name: 'Modern Purple' },    // Zillow-like
        ],
        reasoning: 'Blue = trust/stability. Gold = premium/value. Green = growth. Zillow, Redfin, Compass.',
    },

    // Fitness / Sports - Energy, power, motivation
    'fitness': {
        primary: '#EF4444',      // Power red
        secondary: '#F97316',    // Energy orange
        background: '#0A0A0A',   // Strong dark
        text: '#FAFAFA',
        alternatives: [
            { primary: '#22C55E', secondary: '#10B981', name: 'Healthy Green' },    // Peloton-like
            { primary: '#3B82F6', secondary: '#06B6D4', name: 'Active Blue' },      // MyFitnessPal-like
            { primary: '#F97316', secondary: '#FBBF24', name: 'Energetic Orange' }, // Nike-like energy
        ],
        reasoning: 'Red = power, energy. Orange = motivation. Dark backgrounds = strength. Nike, Peloton, Under Armour.',
    },

    // Travel / Hospitality - Adventure, relaxation, trust
    'travel': {
        primary: '#0EA5E9',      // Sky blue (sky, water)
        secondary: '#F97316',    // Sunset orange
        background: '#FFFFFF',
        text: '#0F172A',
        alternatives: [
            { primary: '#14B8A6', secondary: '#06B6D4', name: 'Ocean Teal' },       // Airbnb-inspired
            { primary: '#EC4899', secondary: '#F43F5E', name: 'Adventure Pink' },   // Vibrant travel
            { primary: '#8B5CF6', secondary: '#A855F7', name: 'Premium Purple' },   // Luxury travel
        ],
        reasoning: 'Blue = sky/ocean, trust. Orange = adventure, sunset. Airbnb, Booking, Expedia.',
    },

    // Sustainability / Green Tech - Nature, eco-friendly, responsibility  
    'sustainability': {
        primary: '#16A34A',      // Deep green (nature)
        secondary: '#22C55E',    // Fresh green
        background: '#F0FDF4',   // Light green tint
        text: '#14532D',
        alternatives: [
            { primary: '#15803D', secondary: '#86EFAC', name: 'Forest Green' },
            { primary: '#14B8A6', secondary: '#5EEAD4', name: 'Ocean Teal' },       // Ocean conservation
            { primary: '#84CC16', secondary: '#A3E635', name: 'Lime Fresh' },       // Modern eco
        ],
        reasoning: 'Green = nature, sustainability, growth. Universal eco-friendly signal. Ecosia, Beyond Meat.',
    },

    // Gaming / Entertainment - Fun, excitement, immersive
    'gaming': {
        primary: '#8B5CF6',      // Gaming purple (Twitch)
        secondary: '#06B6D4',    // Neon cyan
        background: '#09090B',   // Dark immersive
        text: '#F4F4F5',
        alternatives: [
            { primary: '#EF4444', secondary: '#F97316', name: 'Action Red' },       // Gaming intensity
            { primary: '#22C55E', secondary: '#14B8A6', name: 'Xbox Green' },       // Xbox-inspired
            { primary: '#3B82F6', secondary: '#1D4ED8', name: 'PlayStation Blue' }, // PlayStation-inspired
        ],
        reasoning: 'Purple = creativity, gaming culture. Neon accents = digital excitement. Twitch, Discord, Steam.',
    },

    // Media / News - Authority, trust, urgency
    'media': {
        primary: '#DC2626',      // News red (urgency, importance)
        secondary: '#1E293B',    // Authoritative dark blue
        background: '#FFFFFF',
        text: '#0F172A',
        alternatives: [
            { primary: '#0F172A', secondary: '#3B82F6', name: 'Trusted Blue' },     // CNN-like
            { primary: '#16A34A', secondary: '#22C55E', name: 'Eco Media' },        // Environment focus
            { primary: '#7C3AED', secondary: '#A855F7', name: 'Digital Media' },    // Modern online media
        ],
        reasoning: 'Red = urgency, breaking news. Dark blue = authority, trust. CNN, BBC, NYT.',
    },

    // Default / General - Balanced, professional, adaptable
    'general': {
        primary: '#3B82F6',      // Universal trust blue
        secondary: '#8B5CF6',    // Creative purple accent
        background: '#FFFFFF',
        text: '#0F172A',
        alternatives: [
            { primary: '#0F172A', secondary: '#64748B', name: 'Minimal Dark' },
            { primary: '#6366F1', secondary: '#EC4899', name: 'Modern Gradient' },
            { primary: '#22C55E', secondary: '#14B8A6', name: 'Fresh Green' },
        ],
        reasoning: 'Blue is universally trusted and professional. Purple adds creativity. Safe default for any industry.',
    },
};

// Category aliases for UI dropdown matching
export const CATEGORY_ALIASES: Record<string, string> = {
    'saas / b2b startup': 'saas',
    'saas/b2b startup': 'saas',
    'b2b': 'saas',
    'b2b startup': 'saas',
    'startup': 'saas',
    'mobile app (consumer)': 'mobile-app',
    'mobile app': 'mobile-app',
    'consumer app': 'mobile-app',
    'design agency / studio': 'design-agency',
    'design agency': 'design-agency',
    'design studio': 'design-agency',
    'creative agency': 'design-agency',
    'agency': 'design-agency',
    'studio': 'design-agency',
    'fintech & banking': 'fintech',
    'fintech': 'fintech',
    'banking': 'fintech',
    'finance': 'fintech',
    'financial': 'fintech',
    'web3 / crypto protocol': 'crypto',
    'web3': 'crypto',
    'crypto': 'crypto',
    'cryptocurrency': 'crypto',
    'blockchain': 'crypto',
    'defi': 'crypto',
    'nft': 'crypto',
    'ai / llm tool': 'ai',
    'ai': 'ai',
    'llm': 'ai',
    'machine learning': 'ai',
    'artificial intelligence': 'ai',
    'developer tool / api': 'developer',
    'developer tool': 'developer',
    'developer': 'developer',
    'api': 'developer',
    'devtools': 'developer',
    'healthcare': 'healthcare',
    'medical': 'healthcare',
    'health': 'healthcare',
    'wellness': 'healthcare',
    'e-commerce': 'ecommerce',
    'ecommerce': 'ecommerce',
    'retail': 'ecommerce',
    'shop': 'ecommerce',
    'store': 'ecommerce',
    'education': 'education',
    'edtech': 'education',
    'learning': 'education',
    'food': 'food',
    'food & beverage': 'food',
    'restaurant': 'food',
    'beverage': 'food',
    'real estate': 'real-estate',
    'real-estate': 'real-estate',
    'property': 'real-estate',
    'fitness': 'fitness',
    'sports': 'fitness',
    'gym': 'fitness',
    'travel': 'travel',
    'hospitality': 'travel',
    'hotel': 'travel',
    'sustainability': 'sustainability',
    'green': 'sustainability',
    'eco': 'sustainability',
    'environment': 'sustainability',
    'gaming': 'gaming',
    'games': 'gaming',
    'entertainment': 'gaming',
    'media': 'media',
    'news': 'media',
    'publishing': 'media',
    'technology': 'saas',
    'tech': 'saas',
    'consulting': 'general',
    'fashion': 'design-agency',
    'creative': 'design-agency',
};

/**
 * Get recommended colors for an industry category
 */
export function getRecommendedColors(category: string): ColorPalette {
    const normalizedCategory = category.toLowerCase().trim();
    const aliasKey = CATEGORY_ALIASES[normalizedCategory] || normalizedCategory;
    return INDUSTRY_COLORS[aliasKey] || INDUSTRY_COLORS['general'];
}

/**
 * Get all available color categories
 */
export function getAvailableColorCategories(): string[] {
    return Object.keys(INDUSTRY_COLORS);
}



// ============================================
// PHASE 1: DISCOVERY
// ============================================

function runDiscovery(input: BrandInput): DesignerDiscovery {
    const name = input.name.toLowerCase();
    const category = input.category?.toLowerCase() || 'general';
    const description = input.description?.toLowerCase() || '';
    const keywords = input.keywords?.map(k => k.toLowerCase()) || [];

    // Analyze what they do
    const whatTheyDo: string[] = [];
    if (INDUSTRY_CONCEPTS[category]) {
        whatTheyDo.push(...INDUSTRY_CONCEPTS[category].slice(0, 3));
    }
    // Extract from description
    if (description.includes('sell') || description.includes('product')) whatTheyDo.push('commerce');
    if (description.includes('service') || description.includes('help')) whatTheyDo.push('service');
    if (description.includes('build') || description.includes('create')) whatTheyDo.push('creation');
    if (description.includes('connect') || description.includes('platform')) whatTheyDo.push('platform');

    // Analyze who they serve
    const whoTheyServe: string[] = [];
    const audience = input.targetAudience?.toLowerCase() || '';
    if (audience.includes('business') || audience.includes('b2b')) whoTheyServe.push('businesses', 'professionals');
    if (audience.includes('consumer') || audience.includes('b2c')) whoTheyServe.push('consumers', 'everyday-people');
    if (audience.includes('young') || audience.includes('gen')) whoTheyServe.push('youth', 'digital-natives');
    if (audience.includes('premium') || audience.includes('luxury')) whoTheyServe.push('affluent', 'discerning');
    if (whoTheyServe.length === 0) whoTheyServe.push('general-audience');

    // Analyze personality
    const personality: string[] = input.personality?.map(p => p) || [];
    if (personality.length === 0) {
        // Infer from category
        if (['technology', 'consulting'].includes(category)) personality.push('professional', 'tech');
        if (['entertainment', 'food'].includes(category)) personality.push('playful', 'approachable');
        if (['fashion', 'real-estate'].includes(category)) personality.push('elegant', 'premium');
        if (personality.length === 0) personality.push('professional');
    }

    // Determine emotional tone
    let emotionalTone: DesignerDiscovery['emotionalTone'] = 'friendly';
    if (personality.includes('professional') || personality.includes('minimal')) emotionalTone = 'serious';
    if (personality.includes('elegant') || personality.includes('bold')) emotionalTone = 'premium';
    if (personality.includes('playful') || personality.includes('organic')) emotionalTone = 'approachable';
    if (personality.includes('tech') || personality.includes('geometric')) emotionalTone = 'innovative';

    // Determine visual direction
    let visualDirection: DesignerDiscovery['visualDirection'] = 'geometric';
    if (personality.includes('organic') || personality.includes('playful')) visualDirection = 'organic';
    if (personality.includes('minimal')) visualDirection = 'minimal';
    if (personality.includes('bold')) visualDirection = 'bold';
    if (personality.includes('elegant')) visualDirection = 'refined';

    return {
        whatTheyDo,
        whoTheyServe,
        personality,
        emotionalTone,
        visualDirection,
    };
}

// ============================================
// PHASE 2: WORD ASSOCIATION
// ============================================

function runWordAssociation(input: BrandInput, discovery: DesignerDiscovery): ConceptAssociation[] {
    const associations: ConceptAssociation[] = [];
    const name = input.name;
    const category = input.category?.toLowerCase() || 'general';

    // 1. Break down brand name into syllables/parts
    const nameParts = name.toLowerCase().split(/(?=[A-Z])|[-_\s]/).filter(Boolean);

    // 2. Find concepts in industry
    const industryConcepts = INDUSTRY_CONCEPTS[category] || INDUSTRY_CONCEPTS['technology'];

    // 3. Map personality to visual metaphors
    const personalityMetaphors: string[] = [];
    discovery.personality.forEach(p => {
        const mapping = PERSONALITY_TO_VISUAL[p];
        if (mapping) {
            personalityMetaphors.push(...mapping.shapes);
        }
    });

    // 4. Build associations
    // From name
    nameParts.forEach((part, i) => {
        const related: string[] = [];
        const metaphors: string[] = [];

        // Check if part matches any known concepts
        Object.entries(VISUAL_METAPHORS).forEach(([concept, metaList]) => {
            if (part.includes(concept.substring(0, 3)) || concept.includes(part.substring(0, 3))) {
                related.push(concept);
                metaphors.push(...metaList.slice(0, 2));
            }
        });

        // Add from industry
        related.push(...industryConcepts.slice(0, 2));
        metaphors.push(...personalityMetaphors.slice(0, 2));

        if (related.length > 0 || metaphors.length > 0) {
            associations.push({
                word: part,
                relatedConcepts: [...new Set(related)],
                visualMetaphors: [...new Set(metaphors)],
                relevanceScore: 70 + (i === 0 ? 20 : 0), // First part of name is most relevant
            });
        }
    });

    // From keywords
    input.keywords?.forEach(keyword => {
        const related: string[] = [];
        const metaphors: string[] = [];

        Object.entries(VISUAL_METAPHORS).forEach(([concept, metaList]) => {
            if (keyword.toLowerCase().includes(concept) || concept.includes(keyword.toLowerCase())) {
                related.push(concept);
                metaphors.push(...metaList);
            }
        });

        if (metaphors.length > 0) {
            associations.push({
                word: keyword,
                relatedConcepts: related,
                visualMetaphors: metaphors,
                relevanceScore: 80,
            });
        }
    });

    // From discovery insights
    discovery.whatTheyDo.forEach(concept => {
        if (VISUAL_METAPHORS[concept]) {
            associations.push({
                word: concept,
                relatedConcepts: [concept],
                visualMetaphors: VISUAL_METAPHORS[concept],
                relevanceScore: 85,
            });
        }
    });

    // Sort by relevance
    return associations.sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, 10);
}

// ============================================
// PHASE 3: SKETCHING (Generate 20-30 concepts)
// ============================================

function runSketching(
    input: BrandInput,
    discovery: DesignerDiscovery,
    associations: ConceptAssociation[]
): SketchConcept[] {
    const concepts: SketchConcept[] = [];
    const seed = hashString(input.name);

    // Get relevant algorithms based on personality
    const relevantAlgorithms: string[] = [];
    discovery.personality.forEach(p => {
        const mapping = PERSONALITY_TO_VISUAL[p];
        if (mapping) {
            relevantAlgorithms.push(...mapping.algorithms);
        }
    });

    // Add industry-specific algorithms
    const category = input.category?.toLowerCase() || '';
    if (CATEGORY_COMPOSITIONS[category]) {
        // Get algorithm names that match this category
        const categoryAlgos = LOGO_LIBRARY.filter(v =>
            v.description.toLowerCase().includes(category) ||
            v.name.toLowerCase().includes(category)
        ).map(v => v.name);
        relevantAlgorithms.push(...categoryAlgos);
    }

    // Generate concepts
    let conceptId = 0;

    // 1. Letter-based concepts (if brand prefers or by default)
    if (input.preferLettermark !== false) {
        const letter = input.name.charAt(0).toUpperCase();
        const skeleton = getSkeleton(letter);

        // Lettermark variations
        const letterAlgos = ['Monoline Clean', 'Stencil Bold', 'Blueprint Letter', 'Calligraphic Stroke', 'Shadow Depth', 'Multi-Outline Glow'];
        letterAlgos.forEach((algo, i) => {
            if (LOGO_LIBRARY.find(v => v.name === algo)) {
                concepts.push({
                    id: `concept-${conceptId++}`,
                    name: `${letter} ${algo.split(' ')[0]}`,
                    approach: `Letter "${letter}" rendered in ${algo.toLowerCase()} style`,
                    algorithm: algo,
                    params: {
                        strokeWidth: 3 + (seed % 3),
                        cornerRadius: discovery.visualDirection === 'organic' ? 20 : 5,
                        rotation: 0,
                    },
                    score: 70 + (i < 3 ? 10 : 0),
                    tags: ['lettermark', letter.toLowerCase(), ...discovery.personality],
                });
            }
        });
    }

    // 2. Abstract icon concepts (if brand prefers or by default)
    if (input.preferAbstract !== false) {
        // Use discovered concepts to select icons
        const iconCategories = getRelevantIconCategories(discovery, associations);

        iconCategories.forEach((cat, i) => {
            const iconAlgos = LOGO_LIBRARY.filter(v =>
                v.description.toLowerCase().includes(cat) ||
                v.name.toLowerCase().includes(cat.split('/')[0])
            );

            iconAlgos.slice(0, 3).forEach((algo, j) => {
                concepts.push({
                    id: `concept-${conceptId++}`,
                    name: `${cat} Icon ${j + 1}`,
                    approach: `Abstract ${cat} symbol: ${algo.description}`,
                    algorithm: algo.name,
                    params: {
                        strokeWidth: 3 + (seed % 2),
                        cornerRadius: discovery.visualDirection === 'geometric' ? 0 : 15,
                    },
                    score: 75 + (i < 2 ? 15 : 0) - (j * 3),
                    tags: ['abstract', cat.toLowerCase(), ...discovery.personality],
                });
            });
        });
    }

    // 3. Fusion concepts (letter + icon)
    if (!input.preferAbstract) {
        const fusionAlgos = LOGO_LIBRARY.filter(v => v.name.includes('Fusion'));
        fusionAlgos.forEach((algo, i) => {
            concepts.push({
                id: `concept-${conceptId++}`,
                name: `Fusion ${i + 1}`,
                approach: `Letter integrated with ${algo.description.toLowerCase()}`,
                algorithm: algo.name,
                params: {
                    strokeWidth: 4,
                    fillOpacity: 0.8,
                },
                score: 65 + (i < 2 ? 10 : 0),
                tags: ['fusion', 'lettermark', 'icon'],
            });
        });
    }

    // 4. Premium geometric concepts
    const premiumAlgos = ['Architectural Grid', 'Neo Gradient', 'Quantum Interlock', 'Orbital Rings'];
    premiumAlgos.forEach((algo, i) => {
        if (LOGO_LIBRARY.find(v => v.name === algo)) {
            concepts.push({
                id: `concept-${conceptId++}`,
                name: `Premium ${algo.split(' ')[0]}`,
                approach: `High-end ${algo.toLowerCase()} construction`,
                algorithm: algo,
                params: {
                    strokeWidth: 2 + (i % 2),
                    cornerRadius: 10,
                    scaleVariance: 1.0,
                },
                score: 80 - (i * 2),
                tags: ['premium', 'geometric', 'professional'],
            });
        }
    });

    // 5. Concepts from visual metaphors
    associations.slice(0, 5).forEach((assoc, i) => {
        assoc.visualMetaphors.slice(0, 2).forEach((metaphor, j) => {
            // Find matching algorithm
            const matchingAlgo = LOGO_LIBRARY.find(v =>
                v.name.toLowerCase().includes(metaphor.split('-')[0]) ||
                v.description.toLowerCase().includes(metaphor.split('-')[0])
            );

            if (matchingAlgo) {
                concepts.push({
                    id: `concept-${conceptId++}`,
                    name: `${assoc.word} → ${metaphor}`,
                    approach: `Visual metaphor: "${assoc.word}" expressed as ${metaphor}`,
                    algorithm: matchingAlgo.name,
                    params: {
                        strokeWidth: 3,
                        rotation: 0,
                    },
                    score: assoc.relevanceScore - (j * 5),
                    tags: ['metaphor', assoc.word.toLowerCase(), metaphor],
                });
            }
        });
    });

    // Sort by score and return top 25
    return concepts.sort((a, b) => b.score - a.score).slice(0, 25);
}

function getRelevantIconCategories(discovery: DesignerDiscovery, associations: ConceptAssociation[]): string[] {
    const categories: string[] = [];

    // Map discovery insights to icon categories
    discovery.whatTheyDo.forEach(what => {
        if (['innovation', 'digital', 'smart', 'network'].includes(what)) categories.push('tech');
        if (['trust', 'growth', 'stability'].includes(what)) categories.push('growth', 'secure');
        if (['care', 'life', 'wellness'].includes(what)) categories.push('health');
        if (['fresh', 'natural', 'organic'].includes(what)) categories.push('health');
        if (['connect', 'platform', 'community'].includes(what)) categories.push('connect');
        if (['wealth', 'value', 'commerce'].includes(what)) categories.push('finance');
    });

    // From associations
    associations.forEach(assoc => {
        if (assoc.relatedConcepts.includes('speed')) categories.push('speed');
        if (assoc.relatedConcepts.includes('growth')) categories.push('growth');
        if (assoc.relatedConcepts.includes('connection')) categories.push('connect');
        if (assoc.relatedConcepts.includes('innovation')) categories.push('tech');
        if (assoc.relatedConcepts.includes('trust')) categories.push('secure');
    });

    // Remove duplicates and return top 5
    return [...new Set(categories)].slice(0, 5);
}

// ============================================
// PHASE 4: REFINEMENT (Pick 5 strongest)
// ============================================

function runRefinement(
    concepts: SketchConcept[],
    input: BrandInput,
    discovery: DesignerDiscovery
): SketchConcept[] {
    // Score each concept based on multiple criteria
    const scoredConcepts = concepts.map(concept => {
        let score = concept.score;

        // Boost for matching personality
        const personalityMatch = discovery.personality.filter(p =>
            concept.tags.includes(p)
        ).length;
        score += personalityMatch * 5;

        // Boost for relevant algorithms
        if (concept.algorithm.includes('Minimal') && discovery.visualDirection === 'minimal') score += 10;
        if (concept.algorithm.includes('Bold') && discovery.visualDirection === 'bold') score += 10;
        if (concept.algorithm.includes('Organic') && discovery.visualDirection === 'organic') score += 10;

        // Boost for lettermarks if brand name is short
        if (input.name.length <= 6 && concept.tags.includes('lettermark')) score += 8;

        // Boost for icons if brand prefers abstract
        if (input.preferAbstract && concept.tags.includes('abstract')) score += 12;

        // Penalize overly complex for minimal brands
        if (discovery.visualDirection === 'minimal' && concept.algorithm.includes('Complex')) score -= 10;

        return { ...concept, score };
    });

    // Sort by score
    scoredConcepts.sort((a, b) => b.score - a.score);

    // Pick top 5, ensuring variety
    const selected: SketchConcept[] = [];
    const usedTypes = new Set<string>();

    for (const concept of scoredConcepts) {
        const type = concept.tags.includes('lettermark') ? 'letter' :
            concept.tags.includes('abstract') ? 'abstract' :
                concept.tags.includes('fusion') ? 'fusion' : 'other';

        // Allow max 2 of each type
        const typeCount = [...selected].filter(c =>
            (c.tags.includes('lettermark') && type === 'letter') ||
            (c.tags.includes('abstract') && type === 'abstract') ||
            (c.tags.includes('fusion') && type === 'fusion')
        ).length;

        if (typeCount < 2) {
            selected.push(concept);
            if (selected.length >= 5) break;
        }
    }

    return selected;
}

// ============================================
// PHASE 5: SYSTEM THINKING (Quality Check)
// ============================================

interface QualityScores {
    scalability: number;
    simplicity: number;
    relevance: number;
    uniqueness: number;
    versatility: number;
    overall: number;
}

function runQualityCheck(
    svg: string,
    concept: SketchConcept,
    discovery: DesignerDiscovery
): QualityScores {
    // Scalability: Does it work at all sizes?
    // Check for overly thin strokes or tiny details
    let scalability = 80;
    if (svg.includes('stroke-width="1"') || svg.includes('stroke-width="0.')) scalability -= 15;
    if ((svg.match(/<(circle|rect|path)/g) || []).length > 10) scalability -= 10;
    if (svg.includes('r="2"') || svg.includes('r="1"')) scalability -= 10; // Tiny circles
    scalability = Math.max(40, Math.min(100, scalability));

    // Simplicity: Clean and memorable
    let simplicity = 85;
    const elementCount = (svg.match(/<(circle|rect|path|line|polygon)/g) || []).length;
    if (elementCount > 8) simplicity -= (elementCount - 8) * 3;
    if (elementCount < 3) simplicity += 5;
    simplicity = Math.max(40, Math.min(100, simplicity));

    // Relevance: Fits the brand
    let relevance = 75;
    const matchingTags = concept.tags.filter(t =>
        discovery.personality.includes(t) ||
        discovery.whatTheyDo.includes(t)
    ).length;
    relevance += matchingTags * 8;
    relevance = Math.max(50, Math.min(100, relevance));

    // Uniqueness: Distinctive
    let uniqueness = 70;
    // More complex algorithms tend to be more unique
    if (concept.algorithm.includes('Interlock') || concept.algorithm.includes('Fusion')) uniqueness += 10;
    if (concept.algorithm.includes('Architectural') || concept.algorithm.includes('Neo')) uniqueness += 12;
    // Basic shapes are less unique
    if (concept.algorithm.includes('Minimal') || concept.algorithm.includes('Dots')) uniqueness -= 5;
    uniqueness = Math.max(50, Math.min(100, uniqueness));

    // Versatility: Works in different contexts
    let versatility = 75;
    // Monochrome-friendly?
    if (!svg.includes('gradient') && !svg.includes('url(#')) versatility += 10;
    // Simple shape = more versatile
    if (elementCount <= 5) versatility += 8;
    versatility = Math.max(50, Math.min(100, versatility));

    // Overall weighted score
    const overall = Math.round(
        scalability * 0.20 +
        simplicity * 0.25 +
        relevance * 0.25 +
        uniqueness * 0.15 +
        versatility * 0.15
    );

    return { scalability, simplicity, relevance, uniqueness, versatility, overall };
}

// ============================================
// PHASE 6: GENERATE FINAL OUTPUT
// ============================================

function generateFinalLogo(
    concept: SketchConcept,
    input: BrandInput,
    params: InfiniteLogoParams
): string {
    const variant = LOGO_LIBRARY.find(v => v.name === concept.algorithm);

    if (variant) {
        const mergedParams = { ...params, ...concept.params } as InfiniteLogoParams;
        return variant.fn(mergedParams, input.name);
    }

    // Fallback: generate using abstract icon system
    return generateAbstractIcon(
        params,
        input.name,
        input.category,
        input.keywords
    );
}

function generateRationale(concept: SketchConcept, discovery: DesignerDiscovery): string {
    const parts: string[] = [];

    // Explain the approach
    parts.push(concept.approach);

    // Connect to brand personality
    if (discovery.personality.length > 0) {
        parts.push(`This aligns with the brand's ${discovery.personality.slice(0, 2).join(' and ')} personality.`);
    }

    // Explain visual choice
    if (concept.tags.includes('lettermark')) {
        parts.push('The lettermark creates immediate name recognition.');
    } else if (concept.tags.includes('abstract')) {
        parts.push('The abstract symbol is versatile and memorable across applications.');
    }

    return parts.join(' ');
}

// ============================================
// MAIN DESIGNER FUNCTION
// ============================================

export function runDesignerBrain(
    input: BrandInput,
    baseParams: InfiniteLogoParams
): DesignerOutput {
    // Phase 1: Discovery
    const discovery = runDiscovery(input);

    // Phase 2: Word Association
    const associations = runWordAssociation(input, discovery);

    // Phase 3: Sketching (generate 20-30 concepts)
    const concepts = runSketching(input, discovery, associations);

    // Phase 4: Refinement (pick 5 strongest)
    const refined = runRefinement(concepts, input, discovery);

    // Phase 5 & 6: Generate and quality check each refined concept
    const variants: RefinedLogo[] = [];

    refined.forEach((concept, index) => {
        // Generate with slight variations
        const variantParams = {
            ...baseParams,
            ...concept.params,
            strokeWidth: (concept.params.strokeWidth || baseParams.strokeWidth) + (index * 0.3),
        } as InfiniteLogoParams;

        const svg = generateFinalLogo(concept, input, variantParams);
        const qualityScores = runQualityCheck(svg, concept, discovery);
        const rationale = generateRationale(concept, discovery);

        variants.push({
            id: concept.id,
            svg,
            conceptName: concept.name,
            rationale,
            qualityScores,
            approved: qualityScores.overall >= 65,
        });
    });

    // Filter to approved variants
    const approvedVariants = variants.filter(v => v.approved);

    // If less than 4 approved, include some non-approved
    while (approvedVariants.length < 4 && variants.length > approvedVariants.length) {
        const next = variants.find(v => !approvedVariants.includes(v));
        if (next) approvedVariants.push(next);
    }

    // Take top 4
    const finalVariants = approvedVariants.slice(0, 4);

    // Pick recommendation (highest overall score)
    const recommendation = finalVariants.reduce((best, current) =>
        current.qualityScores.overall > best.qualityScores.overall ? current : best
    );

    // Generate design rationale summary
    const designRationale = `
Based on discovery, ${input.name} is ${discovery.emotionalTone} brand targeting ${discovery.whoTheyServe.join(', ')}.
The visual direction is ${discovery.visualDirection}, reflected in ${recommendation.conceptName}.
${recommendation.rationale}
Quality score: ${recommendation.qualityScores.overall}/100 (Scalability: ${recommendation.qualityScores.scalability}, Simplicity: ${recommendation.qualityScores.simplicity}, Relevance: ${recommendation.qualityScores.relevance}).
  `.trim();

    return {
        discovery,
        associations,
        conceptsExplored: concepts.length,
        variants: finalVariants,
        recommendation,
        designRationale,
    };
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

// ============================================
// QUICK GENERATE (Simplified interface)
// ============================================

export function designerGenerate(
    brandName: string,
    category: string = 'technology',
    keywords: string[] = [],
    personality: BrandInput['personality'] = ['professional']
): DesignerOutput {
    const input: BrandInput = {
        name: brandName,
        category,
        keywords,
        personality,
    };

    const defaultParams: InfiniteLogoParams = {
        strokeWidth: 4,
        cornerRadius: 10,
        rotation: 0,
        curveTension: 0.5,
        elementCount: 3,
        spacingRatio: 1.0,
        scaleVariance: 1.0,
        symmetry: 'bilateral',
        fillOpacity: 0.8,
        gradientAngle: 45,
        anatomy: ['stem', 'bowl'],
        cutoutPosition: 0,
        interlockDepth: 50,
        strokeTaper: 0,
    };

    return runDesignerBrain(input, defaultParams);
}

// ============================================
// EXPORTS
// ============================================

export {
    runDiscovery,
    runWordAssociation,
    runSketching,
    runRefinement,
    runQualityCheck,
    INDUSTRY_CONCEPTS,
    PERSONALITY_TO_VISUAL,
    VISUAL_METAPHORS,
};
