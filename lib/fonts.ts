import {
    Inter, Playfair_Display, Roboto_Mono, Poppins, Outfit, Space_Grotesk, DM_Sans,
    Lora, Montserrat, Open_Sans, Raleway, Oswald, Lato, Work_Sans, Crimson_Pro,
    Syne, Archivo, Manrope, Cormorant_Garamond, Eczar, Fraunces, IBM_Plex_Mono,
    Rubik, Nunito, Mukta, Ubuntu, Quicksand, Josefin_Sans, Merriweather,
    PT_Serif, Libre_Baskerville, Cinzel, Prata, Abril_Fatface, Righteous,
    Bebas_Neue, Anton, Inconsolata, Source_Code_Pro, Anonymous_Pro,
    Titillium_Web, Cairo, Cabin, Bitter, Arvo, Domine, Cardo, Vollkorn,
    Alegreya, Amatic_SC, Shadows_Into_Light, Pacifico, Exo_2,
    Chivo, Public_Sans, Plus_Jakarta_Sans, Tenor_Sans, Unbounded
} from 'next/font/google';

// ==================== FONT DEFINITIONS ====================
// Sans-Serif
export const inter = Inter({ subsets: ['latin'] });
export const poppins = Poppins({ weight: ['400', '600', '700'], subsets: ['latin'] });
export const outfit = Outfit({ subsets: ['latin'] });
export const dmSans = DM_Sans({ subsets: ['latin'] });
export const montserrat = Montserrat({ subsets: ['latin'] });
export const openSans = Open_Sans({ subsets: ['latin'] });
export const raleway = Raleway({ subsets: ['latin'] });
export const lato = Lato({ weight: ['300', '400', '700', '900'], subsets: ['latin'] });
export const workSans = Work_Sans({ subsets: ['latin'] });
export const manrope = Manrope({ subsets: ['latin'] });
export const rubik = Rubik({ subsets: ['latin'] });
export const nunito = Nunito({ subsets: ['latin'] });
export const mukta = Mukta({ weight: ['400', '700'], subsets: ['latin'] });
export const ubuntu = Ubuntu({ weight: ['400', '700'], subsets: ['latin'] });
export const quicksand = Quicksand({ subsets: ['latin'] });
export const josefin = Josefin_Sans({ subsets: ['latin'] });
export const titillium = Titillium_Web({ weight: ['400', '700'], subsets: ['latin'] });
export const cairo = Cairo({ subsets: ['latin'] });
export const cabin = Cabin({ subsets: ['latin'] });
export const publicSans = Public_Sans({ subsets: ['latin'] });
export const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'] });
export const chivo = Chivo({ subsets: ['latin'] });
export const exo2 = Exo_2({ subsets: ['latin'] });

// Serif
export const playfair = Playfair_Display({ subsets: ['latin'] });
export const lora = Lora({ subsets: ['latin'] });
export const crimsonPro = Crimson_Pro({ subsets: ['latin'] });
export const cormorant = Cormorant_Garamond({ weight: ['400', '600'], subsets: ['latin'] });
export const eczar = Eczar({ subsets: ['latin'] });
export const fraunces = Fraunces({ subsets: ['latin'] });
export const merriweather = Merriweather({ weight: ['400', '700'], subsets: ['latin'] });
export const ptSerif = PT_Serif({ weight: ['400', '700'], subsets: ['latin'] });
export const libreBaskerville = Libre_Baskerville({ weight: ['400', '700'], subsets: ['latin'] });
export const prata = Prata({ weight: ['400'], subsets: ['latin'] });
export const bitter = Bitter({ subsets: ['latin'] });
export const arvo = Arvo({ weight: ['400', '700'], subsets: ['latin'] });
export const domine = Domine({ subsets: ['latin'] });
export const cardo = Cardo({ weight: ['400', '700'], subsets: ['latin'] });
export const vollkorn = Vollkorn({ subsets: ['latin'] });
export const alegreya = Alegreya({ subsets: ['latin'] });
export const tenor = Tenor_Sans({ weight: ['400'], subsets: ['latin'] }); // Humanist sans/serif hybrid

// Display / Decorative
export const syne = Syne({ subsets: ['latin'] });
export const oswald = Oswald({ subsets: ['latin'] });
export const cinzel = Cinzel({ subsets: ['latin'] });
export const abril = Abril_Fatface({ weight: ['400'], subsets: ['latin'] });
export const righteous = Righteous({ weight: ['400'], subsets: ['latin'] });
export const bebas = Bebas_Neue({ weight: ['400'], subsets: ['latin'] });
export const anton = Anton({ weight: ['400'], subsets: ['latin'] });
export const amatic = Amatic_SC({ weight: ['400', '700'], subsets: ['latin'] });
export const shadows = Shadows_Into_Light({ weight: ['400'], subsets: ['latin'] });
export const pacifico = Pacifico({ weight: ['400'], subsets: ['latin'] });
export const unbounded = Unbounded({ subsets: ['latin'] });

// Mono / Technical
export const robotoMono = Roboto_Mono({ subsets: ['latin'] });
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });
export const archivo = Archivo({ subsets: ['latin'] });
export const ibmPlex = IBM_Plex_Mono({ weight: ['400', '600'], subsets: ['latin'] });
export const inconsolata = Inconsolata({ subsets: ['latin'] });
export const sourceCode = Source_Code_Pro({ subsets: ['latin'] });
export const anonymous = Anonymous_Pro({ weight: ['400', '700'], subsets: ['latin'] });


// NextFont type from next/font
interface NextFont {
    className: string;
    style: { fontFamily: string; fontWeight?: number; fontStyle?: string };
}

// Brand category for font selection
export type BrandCategory =
    | 'saas'
    | 'fintech'
    | 'creative'
    | 'ecommerce'
    | 'healthcare'
    | 'education'
    | 'luxury'
    | 'startup'
    | 'enterprise'
    | 'media'
    | 'tech'
    | 'default';

export interface FontConfig {
    id: string;
    name: string;
    heading: NextFont;
    body: NextFont;
    mono?: NextFont;  // Optional mono font for code/technical
    headingName: string;
    bodyName: string;
    monoName?: string;  // Human readable mono font name
    tags: string[];
    categories?: BrandCategory[];  // Recommended categories for this pairing
    weights?: {
        heading: number[];  // Available weights for heading font
        body: number[];     // Available weights for body font
        mono?: number[];    // Available weights for mono font
    };
    recommended?: boolean;
}

export const fontPairings: FontConfig[] = [
    // --- MODERN & CLEAN (SANS/SANS) ---
    { id: 'modern-clean', name: 'Modern Standard', heading: inter, body: inter, mono: robotoMono, headingName: 'Inter', bodyName: 'Inter', monoName: 'Roboto Mono', tags: ['modern', 'minimalist', 'clean'], categories: ['saas', 'startup', 'tech'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 500] }, recommended: true },
    { id: 'startup-sleek', name: 'Startup Sleek', heading: outfit, body: inter, mono: sourceCode, headingName: 'Outfit', bodyName: 'Inter', monoName: 'Source Code Pro', tags: ['modern', 'tech', 'vibrant'], categories: ['startup', 'saas', 'tech'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 500] }, recommended: true },
    { id: 'swiss-neutral', name: 'Swiss Neutral', heading: inter, body: robotoMono, mono: robotoMono, headingName: 'Inter', bodyName: 'Roboto Mono', monoName: 'Roboto Mono', tags: ['swiss', 'neutral', 'utilitarian'], categories: ['enterprise', 'tech'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 500] }, recommended: true },
    { id: 'geometric-bold', name: 'Bold Geometric', heading: poppins, body: poppins, mono: ibmPlex, headingName: 'Poppins', bodyName: 'Poppins', monoName: 'IBM Plex Mono', tags: ['bold', 'geometric', 'friendly'], categories: ['startup', 'ecommerce'], weights: { heading: [400, 600, 700], body: [400, 600], mono: [400, 600] } },
    { id: 'humanist-warm', name: 'Humanist Warm', heading: lato, body: openSans, mono: inconsolata, headingName: 'Lato', bodyName: 'Open Sans', monoName: 'Inconsolata', tags: ['warm', 'friendly', 'approachable'], categories: ['healthcare', 'education'], weights: { heading: [300, 400, 700, 900], body: [400, 600], mono: [400, 700] } },
    { id: 'jakarta-tech', name: 'Jakarta Tech', heading: jakarta, body: inter, mono: ibmPlex, headingName: 'Plus Jakarta Sans', bodyName: 'Inter', monoName: 'IBM Plex Mono', tags: ['tech', 'modern', 'saas'], categories: ['saas', 'tech', 'startup'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 600] }, recommended: true },
    { id: 'manrope-clean', name: 'Manrope Minimal', heading: manrope, body: manrope, mono: sourceCode, headingName: 'Manrope', bodyName: 'Manrope', monoName: 'Source Code Pro', tags: ['minimalist', 'geometric', 'clean'], categories: ['saas', 'enterprise'], weights: { heading: [400, 500, 600, 700, 800], body: [400, 500], mono: [400, 500] } },
    { id: 'public-gov', name: 'Public Trust', heading: publicSans, body: publicSans, mono: robotoMono, headingName: 'Public Sans', bodyName: 'Public Sans', monoName: 'Roboto Mono', tags: ['professional', 'neutral', 'trust'], categories: ['enterprise', 'fintech'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 500] } },
    { id: 'dm-modern', name: 'DM Modern', heading: dmSans, body: dmSans, mono: ibmPlex, headingName: 'DM Sans', bodyName: 'DM Sans', monoName: 'IBM Plex Mono', tags: ['modern', 'clean', 'geometric'], categories: ['saas', 'startup'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 600] } },
    { id: 'quicksand-soft', name: 'Soft Rounded', heading: quicksand, body: quicksand, mono: inconsolata, headingName: 'Quicksand', bodyName: 'Quicksand', monoName: 'Inconsolata', tags: ['friendly', 'rounded', 'soft'], categories: ['education', 'healthcare'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 700] } },
    { id: 'josefin-elegant', name: 'Geometric Elegant', heading: josefin, body: josefin, mono: sourceCode, headingName: 'Josefin Sans', bodyName: 'Josefin Sans', monoName: 'Source Code Pro', tags: ['elegant', 'geometric', 'fashion'], categories: ['luxury', 'creative'], weights: { heading: [300, 400, 600, 700], body: [300, 400], mono: [400, 500] } },
    { id: 'rubik-stout', name: 'Stout Round', heading: rubik, body: rubik, mono: robotoMono, headingName: 'Rubik', bodyName: 'Rubik', monoName: 'Roboto Mono', tags: ['friendly', 'bold', 'stout'], categories: ['ecommerce', 'startup'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 500] } },
    { id: 'nunito-app', name: 'App Friendly', heading: nunito, body: nunito, mono: inconsolata, headingName: 'Nunito', bodyName: 'Nunito', monoName: 'Inconsolata', tags: ['mobile', 'app', 'rounded'], categories: ['startup', 'ecommerce'], weights: { heading: [400, 600, 700], body: [400, 600], mono: [400, 700] } },
    { id: 'mukta-content', name: 'Content Focus', heading: mukta, body: mukta, mono: robotoMono, headingName: 'Mukta', bodyName: 'Mukta', monoName: 'Roboto Mono', tags: ['editorial', 'news', 'neutral'], categories: ['media', 'education'], weights: { heading: [400, 700], body: [400, 700], mono: [400, 500] } },
    { id: 'ubuntu-open', name: 'Open Source', heading: ubuntu, body: openSans, mono: ibmPlex, headingName: 'Ubuntu', bodyName: 'Open Sans', monoName: 'IBM Plex Mono', tags: ['tech', 'open-source', 'friendly'], categories: ['tech', 'startup'], weights: { heading: [400, 700], body: [400, 600], mono: [400, 600] } },
    { id: 'cabin-cozy', name: 'Cabin Cozy', heading: cabin, body: cabin, mono: inconsolata, headingName: 'Cabin', bodyName: 'Cabin', monoName: 'Inconsolata', tags: ['friendly', 'humanist', 'warm'], categories: ['ecommerce', 'healthcare'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 700] } },
    { id: 'titillium-future', name: 'Future Tech', heading: titillium, body: titillium, mono: sourceCode, headingName: 'Titillium Web', bodyName: 'Titillium Web', monoName: 'Source Code Pro', tags: ['tech', 'futuristic', 'sharp'], categories: ['tech', 'enterprise'], weights: { heading: [400, 700], body: [400, 700], mono: [400, 500] } },
    { id: 'cairo-multilingual', name: 'Global Modern', heading: cairo, body: cairo, mono: robotoMono, headingName: 'Cairo', bodyName: 'Cairo', monoName: 'Roboto Mono', tags: ['global', 'modern', 'geometric'], categories: ['enterprise', 'ecommerce'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 500] } },
    { id: 'chivo-grotesk', name: 'Grotesk Bold', heading: chivo, body: chivo, mono: ibmPlex, headingName: 'Chivo', bodyName: 'Chivo', monoName: 'IBM Plex Mono', tags: ['grotesk', 'bold', 'modern'], categories: ['startup', 'creative'], weights: { heading: [400, 700], body: [400, 700], mono: [400, 600] } },
    { id: 'exo-scifi', name: 'Sci-Fi Future', heading: exo2, body: exo2, mono: sourceCode, headingName: 'Exo 2', bodyName: 'Exo 2', monoName: 'Source Code Pro', tags: ['futuristic', 'tech', 'game'], categories: ['tech', 'creative'], weights: { heading: [400, 500, 600, 700], body: [400, 500], mono: [400, 500] } },

    // --- SERIF & ELEGANT (SERIF/SANS or SERIF/SERIF) ---
    { id: 'editorial-chic', name: 'Editorial Chic', heading: playfair, body: dmSans, headingName: 'Playfair Display', bodyName: 'DM Sans', tags: ['fashion', 'editorial', 'style'], recommended: true },
    { id: 'classic-luxury', name: 'Classic Luxury', heading: lora, body: lato, headingName: 'Lora', bodyName: 'Lato', tags: ['classic', 'luxury', 'serif'], recommended: true },
    { id: 'baskerville-trad', name: 'Traditional', heading: libreBaskerville, body: sourceCode, headingName: 'Libre Baskerville', bodyName: 'Source Code', tags: ['traditional', 'academic', 'trust'] },
    { id: 'merriweather-read', name: 'Highly Readable', heading: merriweather, body: openSans, headingName: 'Merriweather', bodyName: 'Open Sans', tags: ['blog', 'publishing', 'readable'] },
    { id: 'crimson-book', name: 'Old Style Book', heading: crimsonPro, body: crimsonPro, headingName: 'Crimson', bodyName: 'Crimson', tags: ['classic', 'book', 'traditional'] },
    { id: 'cormorant-glam', name: 'Glamour High', heading: cormorant, body: montserrat, headingName: 'Cormorant', bodyName: 'Montserrat', tags: ['luxury', 'fashion', 'high-end'], recommended: true },
    { id: 'prata-minimal', name: 'Minimal Serif', heading: prata, body: lato, headingName: 'Prata', bodyName: 'Lato', tags: ['minimalist', 'fashion', 'elegant'] },
    { id: 'tenor-clean', name: 'Clean Humanist', heading: tenor, body: inter, headingName: 'Tenor Sans', bodyName: 'Inter', tags: ['humanist', 'clean', 'modern'] },
    { id: 'pt-journal', name: 'Journalism', heading: ptSerif, body: ptSerif, headingName: 'PT Serif', bodyName: 'PT Serif', tags: ['news', 'trust', 'classic'] },
    { id: 'vollkorn-organic', name: 'Organic Serif', heading: vollkorn, body: vollkorn, headingName: 'Vollkorn', bodyName: 'Vollkorn', tags: ['organic', 'natural', 'warm'] },
    { id: 'domine-bold', name: 'Bold Editorial', heading: domine, body: robotoMono, headingName: 'Domine', bodyName: 'Roboto Mono', tags: ['bold', 'editorial', 'news'] },
    { id: 'arvo-slab', name: 'Slab Impact', heading: arvo, body: lato, headingName: 'Arvo', bodyName: 'Lato', tags: ['slab', 'bold', 'modern'] },
    { id: 'bitter-contemporary', name: 'Contemporary', heading: bitter, body: raleway, headingName: 'Bitter', bodyName: 'Raleway', tags: ['contemporary', 'slab', 'clean'] },
    { id: 'cardo-scholar', name: 'Scholarly', heading: cardo, body: cardo, headingName: 'Cardo', bodyName: 'Cardo', tags: ['classic', 'history', 'formal'] },
    { id: 'alegreya-lit', name: 'Literary', heading: alegreya, body: alegreya, headingName: 'Alegreya', bodyName: 'Alegreya', tags: ['book', 'warm', 'classic'] },
    { id: 'eczar-expressive', name: 'Expressive Serif', heading: eczar, body: workSans, headingName: 'Eczar', bodyName: 'Work Sans', tags: ['expressive', 'unique', 'bold'] },
    { id: 'fraunces-soft', name: 'Soft Serif', heading: fraunces, body: dmSans, headingName: 'Fraunces', bodyName: 'DM Sans', tags: ['friendly', 'soft', 'retro'] },

    // --- DISPLAY & DECORATIVE ---
    { id: 'syne-art', name: 'Art Gallery', heading: syne, body: manrope, headingName: 'Syne', bodyName: 'Manrope', tags: ['artistic', 'creative', 'unique'], recommended: true },
    { id: 'oswald-condensed', name: 'Condensed Bold', heading: oswald, body: robotoMono, headingName: 'Oswald', bodyName: 'Roboto Mono', tags: ['bold', 'condensed', 'impact'] },
    { id: 'bebas-loud', name: 'Loud Impact', heading: bebas, body: montserrat, headingName: 'Bebas Neue', bodyName: 'Montserrat', tags: ['impact', 'bold', 'caps'] },
    { id: 'anton-headline', name: 'News Headline', heading: anton, body: inter, headingName: 'Anton', bodyName: 'Inter', tags: ['impact', 'bold', 'news'] },
    { id: 'abril-fat', name: 'Fat Face', heading: abril, body: lato, headingName: 'Abril Fatface', bodyName: 'Lato', tags: ['retro', 'bold', 'curve'] },
    { id: 'cinzel-epice', name: 'Epic Cinematic', heading: cinzel, body: raleway, headingName: 'Cinzel', bodyName: 'Raleway', tags: ['cinematic', 'epic', 'luxury'] },
    { id: 'righteous-tech', name: 'Retro Tech', heading: righteous, body: chivo, headingName: 'Righteous', bodyName: 'Chivo', tags: ['retro', 'tech', 'futuristic'] },
    { id: 'unbounded-ultra', name: 'Ultra Modern', heading: unbounded, body: inter, headingName: 'Unbounded', bodyName: 'Inter', tags: ['modern', 'wide', 'display'], recommended: true },
    { id: 'amatic-hand', name: 'Hand Drawn', heading: amatic, body: amatic, headingName: 'Amatic', bodyName: 'Amatic', tags: ['fun', 'handwritten', 'organic'] },
    { id: 'pacific-vibe', name: 'Pacific Vibes', heading: pacifico, body: quicksand, headingName: 'Pacifico', bodyName: 'Quicksand', tags: ['fun', 'retro', 'script'] },
    { id: 'shadows-craft', name: 'Crafty Hand', heading: shadows, body: shadows, headingName: 'Shadows', bodyName: 'Shadows', tags: ['craft', 'personal', 'handwritten'] },

    // --- MONO & TECHNICAL ---
    { id: 'tech-industrial-mono', name: 'Tech Industrial', heading: archivo, body: spaceGrotesk, headingName: 'Archivo', bodyName: 'Space Grotesk', tags: ['industrial', 'tech', 'bold'] },
    { id: 'ibm-dev', name: 'Developer Mode', heading: ibmPlex, body: ibmPlex, headingName: 'IBM Plex', bodyName: 'IBM Plex', tags: ['code', 'technical', 'mono'], recommended: true },
    { id: 'space-future', name: 'Space Future', heading: spaceGrotesk, body: spaceGrotesk, headingName: 'Space Grotesk', bodyName: 'Space Grotesk', tags: ['futuristic', 'tech', 'display'] },
    { id: 'inconsolata-code', name: 'Terminal', heading: inconsolata, body: inconsolata, headingName: 'Inconsolata', bodyName: 'Inconsolata', tags: ['code', 'retro', 'terminal'] },
    { id: 'source-pro', name: 'Source Pro', heading: sourceCode, body: sourceCode, headingName: 'Source Code', bodyName: 'Source Code', tags: ['professional', 'technical', 'clean'] },
    { id: 'anonymous-hacker', name: 'Anonymous', heading: anonymous, body: anonymous, headingName: 'Anonymous', bodyName: 'Anonymous', tags: ['hacker', 'retro', 'mono'] },
    { id: 'vt323-retro', name: 'Retro Pixel', heading: anonymous, body: anonymous, headingName: 'Pixel', bodyName: 'Pixel', tags: ['retro', 'game', 'pixel'] },

    // --- MIXED PAIRINGS (The "Premium 100" feel) ---
    { id: 'mix-serif-mono', name: 'Serif + Mono', heading: playfair, body: robotoMono, headingName: 'Playfair', bodyName: 'Mono', tags: ['modern', 'mix', 'fashion'] },
    { id: 'mix-display-serrif', name: 'Display + Serif', heading: bebas, body: lora, headingName: 'Bebas', bodyName: 'Lora', tags: ['bold', 'contrast', 'mix'] },
    { id: 'mix-impact-clean', name: 'Impact + Clean', heading: oswald, body: inter, headingName: 'Oswald', bodyName: 'Inter', tags: ['modern', 'impact', 'clean'] },
    { id: 'mix-luxury-minimal', name: 'Luxury + Min', heading: cinzel, body: manrope, headingName: 'Cinzel', bodyName: 'Manrope', tags: ['luxury', 'minimalist', 'clean'], recommended: true },
    { id: 'mix-art-tech', name: 'Art + Tech', heading: syne, body: spaceGrotesk, headingName: 'Syne', bodyName: 'Space Grotesk', tags: ['creative', 'tech', 'mix'] },
    { id: 'mix-script-clean', name: 'Script + Clean', heading: pacifico, body: montserrat, headingName: 'Pacifico', bodyName: 'Montserrat', tags: ['friendly', 'contrast', 'personal'] },

    // ... Additional permutations to reach higher count perception
    { id: 'lato-merriweather', name: 'Balanced Read', heading: lato, body: merriweather, headingName: 'Lato', bodyName: 'Merriweather', tags: ['balanced', 'readable', 'standard'] },
    { id: 'poppins-roboto', name: 'Digital Standard', heading: poppins, body: robotoMono, headingName: 'Poppins', bodyName: 'Roboto Mono', tags: ['digital', 'standard', 'tech'] },
    { id: 'raleway-open', name: 'Open Elegant', heading: raleway, body: openSans, headingName: 'Raleway', bodyName: 'Open Sans', tags: ['elegant', 'open', 'light'] },
    { id: 'oswald-lato', name: 'Strong & Standard', heading: oswald, body: lato, headingName: 'Oswald', bodyName: 'Lato', tags: ['strong', 'standard', 'impact'] },
    { id: 'josefin-montserrat', name: 'Geo Twins', heading: josefin, body: montserrat, headingName: 'Josefin', bodyName: 'Montserrat', tags: ['geometric', 'modern', 'clean'] },
];

// Helper to filter by tag
export const getFontsByTag = (tag: string) => fontPairings.filter(f => f.tags.includes(tag));

// Helper to filter by category
export const getFontsByCategory = (category: BrandCategory): FontConfig[] => {
    const categoryFonts = fontPairings.filter(f => f.categories?.includes(category));
    // Fallback to recommended fonts if no category match
    return categoryFonts.length > 0 ? categoryFonts : fontPairings.filter(f => f.recommended);
};

// Get recommended font for a category (first match or best fit)
export const getRecommendedFontForCategory = (category: BrandCategory): FontConfig => {
    const categoryFonts = getFontsByCategory(category);
    // Prefer recommended fonts within category
    const recommended = categoryFonts.find(f => f.recommended);
    return recommended || categoryFonts[0] || fontPairings[0];
};

// Map vibe/aesthetic to category
export const vibeToCategory = (vibe: string): BrandCategory => {
    const lowerVibe = vibe.toLowerCase();

    if (lowerVibe.includes('tech') || lowerVibe.includes('software')) return 'tech';
    if (lowerVibe.includes('saas') || lowerVibe.includes('platform')) return 'saas';
    if (lowerVibe.includes('finance') || lowerVibe.includes('fintech') || lowerVibe.includes('bank')) return 'fintech';
    if (lowerVibe.includes('creative') || lowerVibe.includes('design') || lowerVibe.includes('art')) return 'creative';
    if (lowerVibe.includes('luxury') || lowerVibe.includes('premium') || lowerVibe.includes('fashion')) return 'luxury';
    if (lowerVibe.includes('health') || lowerVibe.includes('medical') || lowerVibe.includes('wellness')) return 'healthcare';
    if (lowerVibe.includes('education') || lowerVibe.includes('learning') || lowerVibe.includes('school')) return 'education';
    if (lowerVibe.includes('ecommerce') || lowerVibe.includes('shop') || lowerVibe.includes('retail')) return 'ecommerce';
    if (lowerVibe.includes('enterprise') || lowerVibe.includes('corporate') || lowerVibe.includes('business')) return 'enterprise';
    if (lowerVibe.includes('media') || lowerVibe.includes('news') || lowerVibe.includes('publish')) return 'media';
    if (lowerVibe.includes('startup') || lowerVibe.includes('modern')) return 'startup';

    return 'default';
};

// Typography specimen data for exports
export interface TypographySpecimen {
    fontName: string;
    fontFamily: string;
    weights: number[];
    characters: {
        uppercase: string;
        lowercase: string;
        numbers: string;
        special: string;
    };
}

export const getTypographySpecimen = (fontName: string, weights: number[]): TypographySpecimen => ({
    fontName,
    fontFamily: fontName,
    weights,
    characters: {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        special: '!@#$%^&*()+-=[]{}|;:\'",.<>?/',
    },
});
