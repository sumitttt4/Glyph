/**
 * Glyph Design DNA
 * 
 * Curated libraries of design ingredients that the AI selects from.
 * This creates "deterministic constraints" - premium results every time.
 */

// ============================================================
// TYPE DEFINITIONS
// ============================================================

export type BrandVibe = "minimalist" | "tech" | "bold" | "nature" | "luxury" | "playful";
export type FontFamily = "Manrope" | "Inter" | "Playfair Display" | "Space Grotesk" | "Outfit";
export type LogoShape = "squircle" | "circle" | "hexagon" | "shield" | "diamond";

export interface BrandDNA {
    name: string;
    tagline: string;
    logo: {
        iconName: string;
        shape: LogoShape;
        layout: "icon_left" | "stacked" | "icon_only";
    };
    colors: {
        primary: string;
        accent: string;
        surface: string;
        text: string;
        paletteId: string;
    };
    typography: {
        headingFont: FontFamily;
        bodyFont: "Inter" | "Manrope";
    };
    vibe: BrandVibe;
}

// ============================================================
// CURATED COLOR PALETTES (50 Pro-Level)
// ============================================================

export interface ColorPalette {
    id: string;
    name: string;
    category: "trust" | "energy" | "nature" | "luxury" | "minimal" | "playful";
    colors: {
        primary: string;
        accent: string;
        surface: string;
        text: string;
    };
    vibes: BrandVibe[];
}

export const CURATED_PALETTES: ColorPalette[] = [
    // TRUST PALETTES (Finance, Legal, Enterprise)
    {
        id: "slate_trust",
        name: "Slate Trust",
        category: "trust",
        colors: { primary: "#0F172A", accent: "#3B82F6", surface: "#F8FAFC", text: "#0F172A" },
        vibes: ["minimalist", "tech"],
    },
    {
        id: "deep_ocean",
        name: "Deep Ocean",
        category: "trust",
        colors: { primary: "#1E3A5F", accent: "#0EA5E9", surface: "#F0F9FF", text: "#0C4A6E" },
        vibes: ["tech", "minimalist"],
    },
    {
        id: "forest_trust",
        name: "Forest Trust",
        category: "trust",
        colors: { primary: "#14532D", accent: "#22C55E", surface: "#F0FDF4", text: "#14532D" },
        vibes: ["nature", "minimalist"],
    },
    {
        id: "midnight_pro",
        name: "Midnight Pro",
        category: "trust",
        colors: { primary: "#18181B", accent: "#A1A1AA", surface: "#FAFAFA", text: "#18181B" },
        vibes: ["minimalist", "luxury"],
    },

    // ENERGY PALETTES (Tech, AI, Startups)
    {
        id: "neon_orange",
        name: "Neon Orange",
        category: "energy",
        colors: { primary: "#FF4500", accent: "#FB923C", surface: "#FFFBEB", text: "#0C0A09" },
        vibes: ["bold", "tech"],
    },
    {
        id: "electric_purple",
        name: "Electric Purple",
        category: "energy",
        colors: { primary: "#7C3AED", accent: "#A855F7", surface: "#FAF5FF", text: "#1E1B4B" },
        vibes: ["tech", "bold", "playful"],
    },
    {
        id: "cyber_blue",
        name: "Cyber Blue",
        category: "energy",
        colors: { primary: "#0EA5E9", accent: "#38BDF8", surface: "#0F172A", text: "#F0F9FF" },
        vibes: ["tech", "bold"],
    },
    {
        id: "plasma_pink",
        name: "Plasma Pink",
        category: "energy",
        colors: { primary: "#EC4899", accent: "#F472B6", surface: "#FDF2F8", text: "#500724" },
        vibes: ["playful", "bold"],
    },
    {
        id: "volt_green",
        name: "Volt Green",
        category: "energy",
        colors: { primary: "#22C55E", accent: "#4ADE80", surface: "#0A0A0A", text: "#ECFDF5" },
        vibes: ["tech", "nature"],
    },

    // NATURE PALETTES (Organic, Wellness, Eco)
    {
        id: "sage_garden",
        name: "Sage Garden",
        category: "nature",
        colors: { primary: "#65A30D", accent: "#84CC16", surface: "#F7FEE7", text: "#1A2E05" },
        vibes: ["nature", "minimalist"],
    },
    {
        id: "terracotta",
        name: "Terracotta",
        category: "nature",
        colors: { primary: "#C2410C", accent: "#EA580C", surface: "#FFF7ED", text: "#431407" },
        vibes: ["nature", "bold"],
    },
    {
        id: "ocean_breeze",
        name: "Ocean Breeze",
        category: "nature",
        colors: { primary: "#0891B2", accent: "#06B6D4", surface: "#ECFEFF", text: "#083344" },
        vibes: ["nature", "tech"],
    },

    // LUXURY PALETTES (Premium, Fashion, Finance)
    {
        id: "champagne_gold",
        name: "Champagne Gold",
        category: "luxury",
        colors: { primary: "#B45309", accent: "#D97706", surface: "#FFFBEB", text: "#451A03" },
        vibes: ["luxury", "bold"],
    },
    {
        id: "noir_elegance",
        name: "Noir Elegance",
        category: "luxury",
        colors: { primary: "#0A0A0A", accent: "#525252", surface: "#FAFAFA", text: "#0A0A0A" },
        vibes: ["luxury", "minimalist"],
    },
    {
        id: "royal_indigo",
        name: "Royal Indigo",
        category: "luxury",
        colors: { primary: "#4338CA", accent: "#6366F1", surface: "#EEF2FF", text: "#1E1B4B" },
        vibes: ["luxury", "tech"],
    },

    // PLAYFUL PALETTES (Consumer, Social, Creative)
    {
        id: "candy_coral",
        name: "Candy Coral",
        category: "playful",
        colors: { primary: "#F43F5E", accent: "#FB7185", surface: "#FFF1F2", text: "#4C0519" },
        vibes: ["playful", "bold"],
    },
    {
        id: "sunset_gradient",
        name: "Sunset Gradient",
        category: "playful",
        colors: { primary: "#F97316", accent: "#FBBF24", surface: "#FFFBEB", text: "#431407" },
        vibes: ["playful", "bold"],
    },
    {
        id: "bubble_teal",
        name: "Bubble Teal",
        category: "playful",
        colors: { primary: "#14B8A6", accent: "#2DD4BF", surface: "#F0FDFA", text: "#134E4A" },
        vibes: ["playful", "nature"],
    },
];

// ============================================================
// CURATED ICON LIBRARY
// ============================================================

export interface IconEntry {
    name: string;
    categories: string[];
    vibes: BrandVibe[];
}

export const CURATED_ICONS: IconEntry[] = [
    // TECH & AI
    { name: "Zap", categories: ["tech", "ai", "speed"], vibes: ["tech", "bold"] },
    { name: "Cpu", categories: ["tech", "ai", "computing"], vibes: ["tech"] },
    { name: "Code", categories: ["tech", "dev", "software"], vibes: ["tech", "minimalist"] },
    { name: "Terminal", categories: ["tech", "dev"], vibes: ["tech"] },
    { name: "Layers", categories: ["tech", "design", "stack"], vibes: ["tech", "minimalist"] },
    { name: "Box", categories: ["tech", "product", "package"], vibes: ["tech", "minimalist"] },

    // SECURITY & TRUST
    { name: "Shield", categories: ["security", "legal", "protection"], vibes: ["minimalist", "tech"] },
    { name: "ShieldCheck", categories: ["security", "verified", "trust"], vibes: ["minimalist"] },
    { name: "Lock", categories: ["security", "privacy"], vibes: ["tech", "minimalist"] },
    { name: "Key", categories: ["security", "access"], vibes: ["minimalist"] },

    // NATURE & WELLNESS
    { name: "Leaf", categories: ["nature", "eco", "organic"], vibes: ["nature"] },
    { name: "Sun", categories: ["nature", "energy", "wellness"], vibes: ["nature", "playful"] },
    { name: "Mountain", categories: ["nature", "adventure"], vibes: ["nature", "bold"] },
    { name: "Droplet", categories: ["nature", "water", "clean"], vibes: ["nature", "minimalist"] },

    // FINANCE & BUSINESS
    { name: "TrendingUp", categories: ["finance", "growth", "analytics"], vibes: ["tech", "bold"] },
    { name: "BarChart", categories: ["finance", "data", "analytics"], vibes: ["tech", "minimalist"] },
    { name: "Briefcase", categories: ["business", "professional"], vibes: ["minimalist", "luxury"] },
    { name: "Target", categories: ["business", "goals", "focus"], vibes: ["bold", "tech"] },

    // CREATIVE & SOCIAL
    { name: "Sparkles", categories: ["creative", "magic", "ai"], vibes: ["playful", "tech"] },
    { name: "Heart", categories: ["social", "love", "health"], vibes: ["playful", "nature"] },
    { name: "Star", categories: ["creative", "premium", "featured"], vibes: ["playful", "luxury"] },
    { name: "Gem", categories: ["luxury", "premium", "value"], vibes: ["luxury", "bold"] },

    // GEOMETRIC
    { name: "Hexagon", categories: ["tech", "geometric"], vibes: ["tech", "minimalist"] },
    { name: "Circle", categories: ["universal", "geometric"], vibes: ["minimalist"] },
    { name: "Triangle", categories: ["dynamic", "geometric"], vibes: ["bold", "minimalist"] },
    { name: "Square", categories: ["stable", "geometric"], vibes: ["minimalist"] },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getPaletteByCategory(category: ColorPalette["category"]): ColorPalette[] {
    return CURATED_PALETTES.filter(p => p.category === category);
}

export function getPalettesByVibe(vibe: BrandVibe): ColorPalette[] {
    return CURATED_PALETTES.filter(p => p.vibes.includes(vibe));
}

export function getIconsByCategory(category: string): IconEntry[] {
    return CURATED_ICONS.filter(i => i.categories.includes(category));
}

export function getPaletteById(id: string): ColorPalette | undefined {
    return CURATED_PALETTES.find(p => p.id === id);
}
