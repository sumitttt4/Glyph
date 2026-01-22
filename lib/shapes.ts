/**
 * Shape Definitions
 * 
 * Geometric primitives used for logo containers and icons.
 */

export interface Shape {
    id: string;
    name: string;
    path: string;
    viewBox: string;
    tags?: string[];
}

export const SHAPES: Shape[] = [
    {
        id: 'squircle',
        name: 'Squircle',
        viewBox: '0 0 24 24',
        path: 'M5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3Z',
        tags: ['basic', 'rounded'],
    },
    {
        id: 'circle',
        name: 'Circle',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z',
        tags: ['basic', 'round'],
    },
    {
        id: 'shield',
        name: 'Shield',
        viewBox: '0 0 24 24',
        path: 'M12 2L20 6V12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12V6L12 2Z',
        tags: ['security', 'strong'],
    },
    {
        id: 'hexagon',
        name: 'Hexagon',
        viewBox: '0 0 24 24',
        path: 'M12 2L21 7V17L12 22L3 17V7L12 2Z',
        tags: ['tech', 'geometric'],
    },
    {
        id: 'diamond',
        name: 'Diamond',
        viewBox: '0 0 24 24',
        path: 'M12 2L22 12L12 22L2 12L12 2Z',
        tags: ['luxury', 'sharp'],
    },
    {
        id: 'bolt',
        name: 'Bolt',
        viewBox: '0 0 24 24',
        path: 'M13 2L3 14H12L11 22L21 10H12L13 2Z',
        tags: ['energy', 'dynamic'],
    },
    {
        id: 'glyph-custom',
        name: 'Glyph',
        viewBox: '0 0 24 24',
        path: 'M12 2L2 12h5v10h10v-5l5-5H12z M7 12l5-5 5 5-5 5-5-5z',
        tags: ['brand', 'logo'],
    },
];

export function getRandomShape(): Shape {
    return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}
