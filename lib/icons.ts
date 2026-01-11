/**
 * Glyph Icon Library
 * 20+ SVG path icons for premium logo generation
 * Each icon is a viewBox="0 0 24 24" path
 */

export interface IconDefinition {
    id: string;
    name: string;
    category: 'tech' | 'nature' | 'business' | 'abstract';
    path: string;
    tags: string[];
    viewBox?: string;
}

export const ICONS: IconDefinition[] = [
    // ============================================================
    // TECH ICONS
    // ============================================================
    {
        id: 'rocket',
        name: 'Rocket',
        category: 'tech',
        path: 'M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5',
        viewBox: '0 0 24 24',
        tags: ['startup', 'launch', 'speed', 'growth', 'tech'],
    },
    {
        id: 'lightning',
        name: 'Lightning',
        category: 'tech',
        path: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
        viewBox: '0 0 24 24',
        tags: ['energy', 'power', 'fast', 'electric', 'bold'],
    },
    {
        id: 'code',
        name: 'Code',
        category: 'tech',
        path: 'M16 18l6-6-6-6 M8 6l-6 6 6 6',
        viewBox: '0 0 24 24',
        tags: ['developer', 'software', 'programming', 'tech'],
    },
    {
        id: 'chip',
        name: 'Chip',
        category: 'tech',
        path: 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z M9 9h6v6H9z M9 2v2 M15 2v2 M9 20v2 M15 20v2 M2 9h2 M2 15h2 M20 9h2 M20 15h2',
        viewBox: '0 0 24 24',
        tags: ['ai', 'technology', 'processor', 'smart'],
    },
    {
        id: 'wifi',
        name: 'Wifi',
        category: 'tech',
        path: 'M5 12.55a11 11 0 0 1 14.08 0 M1.42 9a16 16 0 0 1 21.16 0 M8.53 16.11a6 6 0 0 1 6.95 0 M12 20h.01',
        viewBox: '0 0 24 24',
        tags: ['connect', 'network', 'internet', 'wireless'],
    },
    {
        id: 'cloud',
        name: 'Cloud',
        category: 'tech',
        path: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z',
        viewBox: '0 0 24 24',
        tags: ['cloud', 'storage', 'saas', 'hosting'],
    },
    {
        id: 'terminal',
        name: 'Terminal',
        category: 'tech',
        path: 'M4 17l6-6-6-6 M12 19h8',
        viewBox: '0 0 24 24',
        tags: ['developer', 'command', 'cli', 'hacker'],
    },

    // ============================================================
    // NATURE ICONS
    // ============================================================
    {
        id: 'leaf',
        name: 'Leaf',
        category: 'nature',
        path: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
        viewBox: '0 0 24 24',
        tags: ['eco', 'organic', 'nature', 'green', 'sustainable'],
    },
    {
        id: 'mountain',
        name: 'Mountain',
        category: 'nature',
        path: 'M8 3l4 8 5-5 5 15H2L8 3z',
        viewBox: '0 0 24 24',
        tags: ['adventure', 'outdoor', 'peak', 'summit', 'strong'],
    },
    {
        id: 'wave',
        name: 'Wave',
        category: 'nature',
        path: 'M2 12c.6.5 1.2 1 2.5 1C7 13 7 11 9.5 11c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 M2 17c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1',
        viewBox: '0 0 24 24',
        tags: ['ocean', 'flow', 'water', 'calm', 'fluid'],
    },
    {
        id: 'sun',
        name: 'Sun',
        category: 'nature',
        path: 'M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41 M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
        viewBox: '0 0 24 24',
        tags: ['energy', 'bright', 'warm', 'positive', 'solar'],
    },
    {
        id: 'moon',
        name: 'Moon',
        category: 'nature',
        path: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
        viewBox: '0 0 24 24',
        tags: ['night', 'calm', 'sleep', 'dark', 'lunar'],
    },
    {
        id: 'flame',
        name: 'Flame',
        category: 'nature',
        path: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z',
        viewBox: '0 0 24 24',
        tags: ['fire', 'hot', 'passion', 'energy', 'trending'],
    },
    {
        id: 'tree',
        name: 'Tree',
        category: 'nature',
        path: 'M12 22v-6 M12 8l-4 4-2-1 6-7 6 7-2 1-4-4z M9 12l-3 3H3l9-11 9 11h-3l-3-3',
        viewBox: '0 0 24 24',
        tags: ['growth', 'forest', 'life', 'roots', 'organic'],
    },

    // ============================================================
    // BUSINESS ICONS
    // ============================================================
    {
        id: 'diamond',
        name: 'Diamond',
        category: 'business',
        path: 'M6 3h12l4 6-10 13L2 9l4-6z M2 9h20 M12 3v19',
        viewBox: '0 0 24 24',
        tags: ['premium', 'luxury', 'value', 'precious', 'quality'],
    },
    {
        id: 'crown',
        name: 'Crown',
        category: 'business',
        path: 'M2 4l3 12h14l3-12-6 7-4-9-4 9-6-7z M3 20h18',
        viewBox: '0 0 24 24',
        tags: ['king', 'royal', 'premium', 'leader', 'vip'],
    },
    {
        id: 'star',
        name: 'Star',
        category: 'business',
        path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        viewBox: '0 0 24 24',
        tags: ['favorite', 'rating', 'excellence', 'featured', 'top'],
    },
    {
        id: 'shield',
        name: 'Shield',
        category: 'business',
        path: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        viewBox: '0 0 24 24',
        tags: ['security', 'protection', 'trust', 'safe', 'guard'],
    },
    {
        id: 'trophy',
        name: 'Trophy',
        category: 'business',
        path: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6 M18 9h1.5a2.5 2.5 0 0 0 0-5H18 M4 22h16 M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22 M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22 M18 2H6v7a6 6 0 0 0 12 0V2Z',
        viewBox: '0 0 24 24',
        tags: ['winner', 'award', 'champion', 'success', 'achievement'],
    },
    {
        id: 'building',
        name: 'Building',
        category: 'business',
        path: 'M3 21h18 M9 8h1 M9 12h1 M9 16h1 M14 8h1 M14 12h1 M14 16h1 M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16',
        viewBox: '0 0 24 24',
        tags: ['corporate', 'office', 'company', 'enterprise', 'hq'],
    },
    {
        id: 'target',
        name: 'Target',
        category: 'business',
        path: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
        viewBox: '0 0 24 24',
        tags: ['goal', 'focus', 'aim', 'precision', 'marketing'],
    },

    // ============================================================
    // ABSTRACT ICONS
    // ============================================================
    {
        id: 'hexagon',
        name: 'Hexagon',
        category: 'abstract',
        path: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
        viewBox: '0 0 24 24',
        tags: ['tech', 'modern', 'geometric', 'structure', 'network'],
    },
    {
        id: 'triangle',
        name: 'Triangle',
        category: 'abstract',
        path: 'M12 2L2 22h20L12 2z',
        viewBox: '0 0 24 24',
        tags: ['delta', 'change', 'direction', 'sharp', 'pyramid'],
    },
    {
        id: 'infinity',
        name: 'Infinity',
        category: 'abstract',
        path: 'M18.178 8a4.9 4.9 0 0 1 3.464 1.435c1.905 1.905 1.905 5.038 0 6.943a4.894 4.894 0 0 1-6.943 0L12 13.679l-2.7 2.7a4.894 4.894 0 0 1-6.943 0c-1.905-1.905-1.905-5.038 0-6.943A4.9 4.9 0 0 1 5.822 8 M18.178 16a4.9 4.9 0 0 0 3.464-1.435 M5.822 16A4.9 4.9 0 0 1 2.357 14.565 M12 10.321l2.7-2.7a4.894 4.894 0 0 1 6.943 0',
        viewBox: '0 0 24 24',
        tags: ['eternal', 'limitless', 'loop', 'endless', 'continuous'],
    },
    {
        id: 'spiral',
        name: 'Spiral',
        category: 'abstract',
        path: 'M12 12m-1 0a1 1 0 1 0 2 0 1 1 0 1 0-2 0 M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0 M12 12m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0 M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0',
        viewBox: '0 0 24 24',
        tags: ['growth', 'evolution', 'fibonacci', 'creative', 'flow'],
    },
    {
        id: 'layers',
        name: 'Layers',
        category: 'abstract',
        path: 'M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5',
        viewBox: '0 0 24 24',
        tags: ['stack', 'depth', 'structure', 'design', 'build'],
    },
    {
        id: 'cube',
        name: 'Cube',
        category: 'abstract',
        path: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12',
        viewBox: '0 0 24 24',
        tags: ['3d', 'product', 'box', 'dimension', 'solid'],
    },
];

// Get icons by category
export function getIconsByCategory(category: IconDefinition['category']): IconDefinition[] {
    return ICONS.filter(icon => icon.category === category);
}

// Get icons by tags (matches any tag)
export function getIconsByTags(tags: string[]): IconDefinition[] {
    return ICONS.filter(icon =>
        tags.some(tag => icon.tags.includes(tag.toLowerCase()))
    );
}

// Get random icon
export function getRandomIcon(): IconDefinition {
    return ICONS[Math.floor(Math.random() * ICONS.length)];
}

// Get icon by ID
export function getIconById(id: string): IconDefinition | undefined {
    return ICONS.find(icon => icon.id === id);
}

// Map vibes to relevant icon categories/tags
export function getIconsForVibe(vibe: string): IconDefinition[] {
    const vibeToTags: Record<string, string[]> = {
        'minimalist': ['simple', 'clean', 'geometric'],
        'bold': ['power', 'strong', 'energy', 'bold'],
        'playful': ['fun', 'creative', 'bright', 'playful'],
        'tech': ['tech', 'developer', 'ai', 'modern', 'digital'],
        'luxury': ['premium', 'luxury', 'gold', 'diamond', 'royal'],
        'nature': ['eco', 'organic', 'nature', 'green', 'sustainable'],
        'creative': ['creative', 'design', 'art', 'flow'],
        'professional': ['corporate', 'trust', 'security', 'professional'],
    };

    const tags = vibeToTags[vibe.toLowerCase()] || [];
    const matches = getIconsByTags(tags);

    // If no matches, return all icons
    return matches.length > 0 ? matches : ICONS;
}
