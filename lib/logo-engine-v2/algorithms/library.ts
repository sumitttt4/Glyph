import { InfiniteLogoParams } from '../types';

import {
    generateTriangleMonogram,
    generateCircularMonogram,
    generateGridMonogram,
} from './abstract-monograms';

import {
    generateTrinityKnot,
    generateCubicHexagon,
    generateArrowheadStack
} from './geometric-trinity';

import {
    generateBioGeo,
    generateSwissBlock,
    generateChunkyGlyph
} from './creative-geometry';

interface LogoVariant {
    name: string;
    description: string;
    fn: (params: InfiniteLogoParams, brandName: string) => string;
    type?: 'symbol' | 'wordmark';
}

// THE MASSIVE LIBRARY (Cleaned: Premium Geometric Engines Only)
export const LOGO_LIBRARY: LogoVariant[] = [
    // =============================================
    // ABSTRACT GEOMETRIC MONOGRAMS
    // Constructed shapes, not traced fonts
    // =============================================
    { name: 'Triangle Mono', description: 'Apex geometric form', fn: generateTriangleMonogram, type: 'symbol' },
    { name: 'Circular Mono', description: 'Tech ring geometry', fn: generateCircularMonogram, type: 'symbol' },
    { name: 'Grid Mono', description: 'Swiss grid construction', fn: generateGridMonogram, type: 'symbol' },

    // =============================================
    // GEOMETRIC TRINITY SERIES ($1000+ Style)
    // Complex vector symmetry, cubes, and stacks
    // =============================================
    { name: 'Trinity Loop', description: 'Radial bio-tech node', fn: generateTrinityKnot, type: 'symbol' },
    { name: 'Cubic Weave', description: 'Isometric hexagon interlock', fn: generateCubicHexagon, type: 'symbol' },
    { name: 'Arrowhead Core', description: 'Stacked delta forms', fn: generateArrowheadStack, type: 'symbol' },

    // =============================================
    // CREATIVE GEOMETRY SERIES
    // Soft Tech, Industrial Blocks, Chunky Glyphs
    // =============================================
    { name: 'Bio Blob', description: 'Organic fluid geometry', fn: generateBioGeo, type: 'symbol' },
    { name: 'Swiss Block', description: 'Heavy industrial negative space', fn: generateSwissBlock, type: 'symbol' },
    { name: 'Chunky Glyph', description: 'Massive stroke characters', fn: generateChunkyGlyph, type: 'symbol' },
];

// Helper to get random variant
export const getRandomVariant = () => LOGO_LIBRARY[Math.floor(Math.random() * LOGO_LIBRARY.length)];

// Total library size
export const LIBRARY_SIZE = LOGO_LIBRARY.length;
