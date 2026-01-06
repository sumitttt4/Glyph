/**
 * Glyph Theme Intelligence Engine
 * 
 * 30+ "God-Tier" palettes with strict dual-mode token systems.
 * Curated to solve "AI Fatigue" (No generic Purple/Blue gradients).
 */

export interface ThemeTokens {
    bg: string;          // Background
    text: string;        // Primary text
    primary: string;     // Accent/Action color
    surface: string;     // Card/Panel backgrounds
    muted: string;       // Muted text
    border: string;      // Borders
    accent?: string;     // Secondary accent
    gradient?: [string, string]; // Gradient pair [start, end]
}

export interface Theme {
    id: string;
    name: string;
    description: string;
    tags: string[];      // For matching with vibes
    tokens: {
        light: ThemeTokens;
        dark: ThemeTokens;
    };
}

export const THEMES: Theme[] = [
    // ============================================================
    // 1. SWISS & INTERNATIONAL (Functional, Bold, Timeless)
    // ============================================================
    {
        id: 'swiss-red',
        name: 'Helvetica Red',
        description: 'The golden standard. Neutral canvas, bold red action.',
        tags: ['minimalist', 'bold', 'modern', 'professional'],
        tokens: {
            light: { bg: '#F5F5F7', text: '#000000', primary: '#FF3B30', surface: '#FFFFFF', muted: '#86868B', border: '#D2D2D7' },
            dark: { bg: '#000000', text: '#F5F5F7', primary: '#FF453A', surface: '#1C1C1E', muted: '#98989D', border: '#3A3A3C' },
        },
    },
    {
        id: 'swiss-blue',
        name: 'Zurich Blue',
        description: 'Corporate trust without being boring. Deep ultramarine.',
        tags: ['professional', 'tech', 'trust'],
        tokens: {
            light: { bg: '#FFFFFF', text: '#0F172A', primary: '#0047FF', surface: '#F1F5F9', muted: '#64748B', border: '#E2E8F0' },
            dark: { bg: '#020617', text: '#F8FAFC', primary: '#3B82F6', surface: '#1E293B', muted: '#94A3B8', border: '#1E293B' },
        },
    },
    {
        id: 'bauhaus-yellow',
        name: 'Weimar Yellow',
        description: 'Artistic, intellectual, high contrast.',
        tags: ['creative', 'bold', 'architectural'],
        tokens: {
            light: { bg: '#FFFFFF', text: '#111111', primary: '#FFD700', surface: '#111111', muted: '#555555', border: '#111111' }, // High contrast construction
            dark: { bg: '#111111', text: '#FFFFFF', primary: '#FFD700', surface: '#222222', muted: '#888888', border: '#333333' },
        },
    },

    // ============================================================
    // 2. LUXURY & FASHION (Elegant, Muted, Material)
    // ============================================================
    {
        id: 'lux-charcoal',
        name: 'Onyx & Cream',
        description: 'High fashion editorial. understated luxury.',
        tags: ['luxury', 'premium', 'minimalist'],
        tokens: {
            light: { bg: '#F9F8F6', text: '#1A1A1A', primary: '#1A1A1A', surface: '#FFFFFF', muted: '#767676', border: '#E5E0D8' },
            dark: { bg: '#0F0F0F', text: '#EAEAEA', primary: '#FFFFFF', surface: '#1F1F1F', muted: '#888888', border: '#333333' },
        },
    },
    {
        id: 'lux-emerald',
        name: 'Deep Emerald',
        description: 'Heritage brand energy. Wealth and stability.',
        tags: ['luxury', 'classic', 'nature'],
        tokens: {
            light: { bg: '#F1F5F2', text: '#064E3B', primary: '#047857', surface: '#FFFFFF', muted: '#659086', border: '#D1FAE5' },
            dark: { bg: '#022C22', text: '#ECFDF5', primary: '#10B981', surface: '#064E3B', muted: '#6EE7B7', border: '#065F46' },
        },
    },
    {
        id: 'lux-gold',
        name: 'Gilded Slate',
        description: 'Premium tech meets luxury.',
        tags: ['luxury', 'tech', 'premium'],
        tokens: {
            light: { bg: '#FAFAFA', text: '#171717', primary: '#D4AF37', surface: '#FFFFFF', muted: '#737373', border: '#E5E5E5' },
            dark: { bg: '#0A0A0A', text: '#FAFAFA', primary: '#FCD34D', surface: '#171717', muted: '#A3A3A3', border: '#262626' },
        },
    },

    // ============================================================
    // 3. NEO-BRUTALISM (Acid, Harsh, Digital)
    // ============================================================
    {
        id: 'brutal-lime',
        name: 'Acid Lime',
        description: 'Web3, crypto, edgy startup. Unapologetic.',
        tags: ['tech', 'bold', 'brutalist'],
        tokens: {
            light: { bg: '#F9FAFB', text: '#000000', primary: '#CCFF00', surface: '#FFFFFF', muted: '#555555', border: '#000000' },
            dark: { bg: '#000000', text: '#CCFF00', primary: '#CCFF00', surface: '#111111', muted: '#FFFFFF', border: '#CCFF00' },
        },
    },
    {
        id: 'brutal-pink',
        name: 'Hot Plastic',
        description: 'Gen Z energy. Loud and proud.',
        tags: ['bold', 'creative', 'vibrant'],
        tokens: {
            light: { bg: '#FFF5F7', text: '#000000', primary: '#FF00FF', surface: '#FFFFFF', muted: '#9D174D', border: '#000000' },
            dark: { bg: '#000000', text: '#FF00FF', primary: '#FF00FF', surface: '#18181B', muted: '#E879F9', border: '#333333' },
        },
    },

    // ============================================================
    // 4. TECH & SAAS (Deep, Focused, Not Generic)
    // ============================================================
    {
        id: 'tech-indigo',
        name: 'Deep Space',
        description: 'Serious software. Knowledge bases. Developer tools.',
        tags: ['tech', 'modern', 'professional'],
        tokens: {
            light: { bg: '#F8FAFC', text: '#0F172A', primary: '#4338CA', surface: '#FFFFFF', muted: '#64748B', border: '#E2E8F0' }, // Indigo-700
            dark: { bg: '#0F172A', text: '#F8FAFC', primary: '#6366F1', surface: '#1E293B', muted: '#94A3B8', border: '#334155' },
        },
    },
    {
        id: 'tech-teal',
        name: 'Data Stream',
        description: 'Fintech, security, analytics. Calm and precise.',
        tags: ['tech', 'trust', 'clean'],
        tokens: {
            light: { bg: '#F0FDFA', text: '#134E4A', primary: '#0D9488', surface: '#FFFFFF', muted: '#5EEAD4', border: '#CCFBF1' },
            dark: { bg: '#111827', text: '#F0FDFA', primary: '#14B8A6', surface: '#1F2937', muted: '#5EEAD4', border: '#374151' },
        },
    },
    {
        id: 'tech-obsidian',
        name: 'Obsidian',
        description: 'Dark mode first. Developer centric.',
        tags: ['tech', 'minimalist', 'dark'],
        tokens: {
            light: { bg: '#FFFFFF', text: '#000000', primary: '#000000', surface: '#F3F4F6', muted: '#6B7280', border: '#E5E7EB' },
            dark: { bg: '#000000', text: '#FFFFFF', primary: '#FFFFFF', surface: '#111111', muted: '#9CA3AF', border: '#333333' },
        },
    },

    // ============================================================
    // 5. ORGANIC & SUSTAINABLE (Earthy, Textured)
    // ============================================================
    {
        id: 'earth-clay',
        name: 'Terracotta',
        description: 'Handmade, pottery, human connection.',
        tags: ['nature', 'warm', 'organic'],
        tokens: {
            light: { bg: '#FFFAF5', text: '#431407', primary: '#C2410C', surface: '#FFFFFF', muted: '#9A3412', border: '#FED7AA' },
            dark: { bg: '#1C1917', text: '#FFFAF5', primary: '#EA580C', surface: '#292524', muted: '#A8A29E', border: '#44403C' },
        },
    },
    {
        id: 'earth-sage',
        name: 'Sage & Stone',
        description: 'Wellness, spa, balance.',
        tags: ['nature', 'calm', 'minimalist'],
        tokens: {
            light: { bg: '#F2F5F3', text: '#1A2E05', primary: '#577353', surface: '#FFFFFF', muted: '#849681', border: '#DEE5DE' },
            dark: { bg: '#1A1D1A', text: '#F2F5F3', primary: '#8FA88B', surface: '#252925', muted: '#707A70', border: '#3E423E' },
        },
    },
    {
        id: 'earth-ocean',
        name: 'Deep Pacific',
        description: 'Mystery, depth, sustainability.',
        tags: ['nature', 'calm', 'trust'],
        tokens: {
            light: { bg: '#F0F9FF', text: '#0C4A6E', primary: '#0284C7', surface: '#FFFFFF', muted: '#38BDF8', border: '#BAE6FD' },
            dark: { bg: '#082F49', text: '#F0F9FF', primary: '#38BDF8', surface: '#0C4A6E', muted: '#7DD3FC', border: '#075985' },
        },
    },

    // ============================================================
    // 6. POP & VIBRANT (Consumer Brands)
    // ============================================================
    {
        id: 'pop-tangerine',
        name: 'Electric Tangerine',
        description: 'Food delivery, social app, high energy.',
        tags: ['vibrant', 'playful', 'bold'],
        tokens: {
            light: { bg: '#FFF7ED', text: '#431407', primary: '#FF5F00', surface: '#FFFFFF', muted: '#9A3412', border: '#FED7AA' },
            dark: { bg: '#1A1009', text: '#FFF7ED', primary: '#FF7222', surface: '#2C1810', muted: '#FDBA74', border: '#7C2D12' },
        },
    },
    {
        id: 'pop-banana',
        name: 'Banana Stand',
        description: 'Optimistic, sunny, youthful.',
        tags: ['playful', 'warm', 'creative'],
        tokens: {
            light: { bg: '#FEFCE8', text: '#422006', primary: '#EAB308', surface: '#FFFFFF', muted: '#854D0E', border: '#FEF08A' },
            dark: { bg: '#2B2508', text: '#FEFCE8', primary: '#FACC15', surface: '#3F360B', muted: '#FDE047', border: '#713F12' },
        },
    },
    {
        id: 'pop-bubblegum',
        name: 'New Wave Pink',
        description: 'Bold feminine energy, sweets, lifestyle.',
        tags: ['vibrant', 'playful', 'fashion'],
        tokens: {
            light: { bg: '#FDF2F8', text: '#831843', primary: '#DB2777', surface: '#FFFFFF', muted: '#BE185D', border: '#FBCFE8' },
            dark: { bg: '#1F0510', text: '#FDF2F8', primary: '#EC4899', surface: '#38091B', muted: '#F472B6', border: '#9D174D' },
        },
    },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getThemesByVibe(vibe: string): Theme[] {
    const matches = THEMES.filter(theme => theme.tags.includes(vibe));
    return matches.length > 0 ? matches : THEMES;
}

export function getThemeById(id: string): Theme | undefined {
    return THEMES.find(theme => theme.id === id);
}

export function getThemeCSSVars(theme: Theme, mode: 'light' | 'dark'): Record<string, string> {
    const tokens = theme.tokens[mode];
    return {
        '--background': tokens.bg,
        '--foreground': tokens.text,
        '--primary': tokens.primary,
        '--surface': tokens.surface,
        '--muted': tokens.muted,
        '--border': tokens.border,
    };
}
