/**
 * Glyph Theme Intelligence Engine
 * 
 * 10 "God-Tier" palettes with strict dual-mode token systems.
 * Each palette is designed for real-world brand applications.
 */

export interface ThemeTokens {
    bg: string;          // Background
    text: string;        // Primary text
    primary: string;     // Accent/Action color
    surface: string;     // Card/Panel backgrounds
    muted: string;       // Muted text
    border: string;      // Borders
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
    // 1. ARCHITECT - Stone & International Orange (The Default)
    // ============================================================
    {
        id: 'architect',
        name: 'Architect',
        description: 'Industrial precision. Paper & ink with fire.',
        tags: ['minimalist', 'tech', 'modern', 'professional'],
        tokens: {
            light: {
                bg: '#FAFAF9',       // Stone-50
                text: '#0C0A09',     // Stone-950
                primary: '#FF4500',  // International Orange
                surface: '#FFFFFF',
                muted: '#78716C',    // Stone-500
                border: '#E7E5E4',   // Stone-200
            },
            dark: {
                bg: '#0C0A09',
                text: '#FAFAF9',
                primary: '#FF6332',
                surface: '#1C1917',
                muted: '#A8A29E',
                border: '#292524',
            },
        },
    },

    // ============================================================
    // 2. MIDNIGHT - Deep Slate & Electric Blue
    // ============================================================
    {
        id: 'midnight',
        name: 'Midnight',
        description: 'The darkness of space. Electric accents.',
        tags: ['tech', 'bold', 'futuristic'],
        tokens: {
            light: {
                bg: '#F8FAFC',       // Slate-50
                text: '#0F172A',     // Slate-900
                primary: '#38BDF8',  // Sky-400
                surface: '#FFFFFF',
                muted: '#64748B',
                border: '#E2E8F0',
            },
            dark: {
                bg: '#0F172A',       // Slate-900
                text: '#F8FAFC',
                primary: '#38BDF8',
                surface: '#1E293B',
                muted: '#94A3B8',
                border: '#334155',
            },
        },
    },

    // ============================================================
    // 3. FOREST - Organic Greens
    // ============================================================
    {
        id: 'forest',
        name: 'Forest',
        description: 'Grounded in nature. Growth energy.',
        tags: ['nature', 'organic', 'calm', 'growth'],
        tokens: {
            light: {
                bg: '#F7FEE7',       // Lime-50
                text: '#1A2E05',     // Custom dark green
                primary: '#65A30D',  // Lime-600
                surface: '#FFFFFF',
                muted: '#4D7C0F',
                border: '#D9F99D',
            },
            dark: {
                bg: '#14202A',
                text: '#ECFCCB',
                primary: '#84CC16',
                surface: '#1F2D20',
                muted: '#A3E635',
                border: '#365314',
            },
        },
    },

    // ============================================================
    // 4. INDIGO STUDIO - Creative & Premium
    // ============================================================
    {
        id: 'indigo-studio',
        name: 'Indigo Studio',
        description: 'Creative agency energy. Premium feel.',
        tags: ['bold', 'creative', 'premium'],
        tokens: {
            light: {
                bg: '#F5F3FF',       // Violet-50
                text: '#1E1B4B',     // Indigo-950
                primary: '#6366F1',  // Indigo-500
                surface: '#FFFFFF',
                muted: '#6B7280',
                border: '#E0E7FF',
            },
            dark: {
                bg: '#0C0A1D',
                text: '#F5F3FF',
                primary: '#818CF8',
                surface: '#1E1B4B',
                muted: '#A5B4FC',
                border: '#312E81',
            },
        },
    },

    // ============================================================
    // 5. CORAL REEF - Warm & Approachable
    // ============================================================
    {
        id: 'coral-reef',
        name: 'Coral Reef',
        description: 'Warm, inviting, playful energy.',
        tags: ['vibrant', 'playful', 'warm'],
        tokens: {
            light: {
                bg: '#FFF7ED',       // Orange-50
                text: '#431407',     // Custom dark brown
                primary: '#F97316',  // Orange-500
                surface: '#FFFFFF',
                muted: '#9A3412',
                border: '#FED7AA',
            },
            dark: {
                bg: '#1C1210',
                text: '#FFF7ED',
                primary: '#FB923C',
                surface: '#292018',
                muted: '#FDBA74',
                border: '#7C2D12',
            },
        },
    },

    // ============================================================
    // 6. MONOCHROME - Pure Black & White
    // ============================================================
    {
        id: 'monochrome',
        name: 'Monochrome',
        description: 'No distractions. Pure contrast.',
        tags: ['minimalist', 'clean', 'professional', 'editorial'],
        tokens: {
            light: {
                bg: '#FFFFFF',
                text: '#000000',
                primary: '#000000',
                surface: '#FAFAFA',
                muted: '#525252',
                border: '#E5E5E5',
            },
            dark: {
                bg: '#000000',
                text: '#FFFFFF',
                primary: '#FFFFFF',
                surface: '#171717',
                muted: '#A3A3A3',
                border: '#262626',
            },
        },
    },

    // ============================================================
    // 7. SUNSET GRADIENT - Warm Reds & Pinks
    // ============================================================
    {
        id: 'sunset',
        name: 'Sunset',
        description: 'Bold, passionate, memorable.',
        tags: ['bold', 'vibrant', 'passionate'],
        tokens: {
            light: {
                bg: '#FFF1F2',       // Rose-50
                text: '#4C0519',     // Rose-950
                primary: '#E11D48',  // Rose-600
                surface: '#FFFFFF',
                muted: '#9F1239',
                border: '#FECDD3',
            },
            dark: {
                bg: '#1C0A10',
                text: '#FFF1F2',
                primary: '#FB7185',
                surface: '#2D0F18',
                muted: '#FDA4AF',
                border: '#9F1239',
            },
        },
    },

    // ============================================================
    // 8. ARCTIC - Cool Blues & Whites
    // ============================================================
    {
        id: 'arctic',
        name: 'Arctic',
        description: 'Clean, fresh, trustworthy.',
        tags: ['clean', 'professional', 'tech', 'trust'],
        tokens: {
            light: {
                bg: '#F0F9FF',       // Sky-50
                text: '#082F49',     // Sky-950
                primary: '#0284C7',  // Sky-600
                surface: '#FFFFFF',
                muted: '#0369A1',
                border: '#BAE6FD',
            },
            dark: {
                bg: '#0C1929',
                text: '#F0F9FF',
                primary: '#38BDF8',
                surface: '#0C2744',
                muted: '#7DD3FC',
                border: '#075985',
            },
        },
    },

    // ============================================================
    // 9. GOLDEN HOUR - Luxury Warm Tones
    // ============================================================
    {
        id: 'golden-hour',
        name: 'Golden Hour',
        description: 'Luxury, warmth, premium quality.',
        tags: ['luxury', 'premium', 'warm', 'organic'],
        tokens: {
            light: {
                bg: '#FFFBEB',       // Amber-50
                text: '#451A03',     // Amber-950
                primary: '#D97706',  // Amber-600
                surface: '#FFFFFF',
                muted: '#92400E',
                border: '#FDE68A',
            },
            dark: {
                bg: '#1C1608',
                text: '#FFFBEB',
                primary: '#FBBF24',
                surface: '#2C2210',
                muted: '#FCD34D',
                border: '#78350F',
            },
        },
    },

    // ============================================================
    // 10. NEON TOKYO - Cyberpunk Vibes
    // ============================================================
    {
        id: 'neon-tokyo',
        name: 'Neon Tokyo',
        description: 'Cyberpunk energy. Future-forward.',
        tags: ['tech', 'bold', 'futuristic', 'creative'],
        tokens: {
            light: {
                bg: '#FDF4FF',       // Fuchsia-50
                text: '#4A044E',     // Fuchsia-950
                primary: '#D946EF',  // Fuchsia-500
                surface: '#FFFFFF',
                muted: '#A21CAF',
                border: '#F5D0FE',
            },
            dark: {
                bg: '#120F14',
                text: '#FDF4FF',
                primary: '#E879F9',
                surface: '#1E1623',
                muted: '#F0ABFC',
                border: '#701A75',
            },
        },
    },
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get themes matching specific tags (vibes)
 */
export function getThemesByVibe(vibe: string): Theme[] {
    const matches = THEMES.filter(theme => theme.tags.includes(vibe));
    return matches.length > 0 ? matches : THEMES;
}

/**
 * Get a theme by ID
 */
export function getThemeById(id: string): Theme | undefined {
    return THEMES.find(theme => theme.id === id);
}

/**
 * Generate CSS custom properties from theme tokens
 */
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
