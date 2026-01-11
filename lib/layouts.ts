/**
 * Glyph Layout Engine
 * 6 different logo composition layouts for genuine variety
 */

export type LayoutType =
    | 'lettermark'      // Single stylized letter
    | 'wordmark'        // Styled text only
    | 'icon-top'        // Icon above text (stacked)
    | 'icon-left'       // Icon left of text (horizontal)
    | 'badge'           // Text inside shape (emblem)
    | 'icon-only';      // Just the icon (for app icons)

export interface LayoutDefinition {
    id: LayoutType;
    name: string;
    description: string;
    aspectRatio: 'square' | 'wide' | 'tall';
    showsIcon: boolean;
    showsText: boolean;
}

export const LAYOUTS: LayoutDefinition[] = [
    {
        id: 'lettermark',
        name: 'Lettermark',
        description: 'Single stylized initial letter',
        aspectRatio: 'square',
        showsIcon: false,
        showsText: true, // Shows just the first letter
    },
    {
        id: 'wordmark',
        name: 'Wordmark',
        description: 'Styled brand name with no icon',
        aspectRatio: 'wide',
        showsIcon: false,
        showsText: true,
    },
    {
        id: 'icon-top',
        name: 'Stacked',
        description: 'Icon centered above brand name',
        aspectRatio: 'square',
        showsIcon: true,
        showsText: true,
    },
    {
        id: 'icon-left',
        name: 'Horizontal',
        description: 'Icon beside brand name',
        aspectRatio: 'wide',
        showsIcon: true,
        showsText: true,
    },
    {
        id: 'badge',
        name: 'Badge',
        description: 'Text inside a shape (emblem style)',
        aspectRatio: 'square',
        showsIcon: true,
        showsText: true,
    },
    {
        id: 'icon-only',
        name: 'Symbol',
        description: 'Just the icon (for favicons/app icons)',
        aspectRatio: 'square',
        showsIcon: true,
        showsText: false,
    },
];

// Get layout by ID
export function getLayoutById(id: LayoutType): LayoutDefinition | undefined {
    return LAYOUTS.find(layout => layout.id === id);
}

// Get random layout
export function getRandomLayout(): LayoutDefinition {
    return LAYOUTS[Math.floor(Math.random() * LAYOUTS.length)];
}

// Get layouts suitable for a specific use case
export function getLayoutsForUseCase(useCase: 'app' | 'website' | 'print' | 'social'): LayoutDefinition[] {
    switch (useCase) {
        case 'app':
            return LAYOUTS.filter(l => l.aspectRatio === 'square');
        case 'website':
            return LAYOUTS.filter(l => l.showsText);
        case 'print':
            return LAYOUTS; // All work for print
        case 'social':
            return LAYOUTS.filter(l => l.aspectRatio !== 'tall');
        default:
            return LAYOUTS;
    }
}

// Generate diverse variations (ensures each is meaningfully different)
export function generateLayoutVariations(count: number = 4): LayoutType[] {
    const shuffled = [...LAYOUTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, LAYOUTS.length)).map(l => l.id);
}
