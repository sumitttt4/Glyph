/**
 * Glyph Shape Intelligence Engine v2
 * 
 * Expanded Primitive Library for Generative Composition.
 * 100+ Geometric Primitives designed for algorithmic combination.
 */

export interface Shape {
    id: string;
    name: string;
    path: string;           // SVG path d attribute
    viewBox: string;        // SVG viewBox
    tags: string[];         // For matching with vibes
    complexity: 'simple' | 'moderate' | 'detailed';
}

export const SHAPES: Shape[] = [
    // ============================================================
    // 1. BASIC GEOMETRY (REMOVED as per user request for "Non-Generic")
    // ============================================================
    /* 
     * Basic shapes (Triangle, Square, Circle, etc.) have been removed 
     * to ensure all generated logos feel premium and "designed".
     */

    // ============================================================
    // 1.5. HIGH-END REFERENCE (The "Architectural" Set)
    // ============================================================
    {
        id: 'ref-dynamic-wing',
        name: 'Dynamic Wing',
        viewBox: '0 0 100 100',
        path: 'M20,80 C20,40 50,10 80,10 L80,30 C60,30 40,50 40,80 Z M30,90 C30,50 60,20 90,20 L90,40 C70,40 50,60 50,90 Z',
        // Custom path: Two sweeping stylized leaves/wings similar to the reference image
        tags: ['minimalist', 'architectural', 'premium', 'dynamic'],
        complexity: 'detailed',
    },
    {
        id: 'ref-sharp-s',
        name: 'Geometric S',
        viewBox: '0 0 24 24',
        path: 'M20 4h-4l-4 4-4-4H4v4l6 6-6 6v4h4l4-4 4 4h4v-4l-6-6 6-6V4z', // Sharp angular S
        tags: ['minimalist', 'architectural', 'bold', 'modern'],
        complexity: 'detailed',
    },
    // NOTE: 'ref-interlace' shape REMOVED - it's now Glyph's exclusive brand mark

    // ============================================================
    // 2. TECH & DIGITAL (Grid, Circuits, Data)
    // ============================================================
    {
        id: 'tech-bolt',
        name: 'Bolt',
        viewBox: '0 0 24 24',
        path: 'M7 2v11h3v9l7-12h-4l4-8z',
        tags: ['tech', 'energy', 'bold', 'futuristic'],
        complexity: 'simple',
    },
    {
        id: 'tech-grid-2x2',
        name: 'Grid 2x2',
        viewBox: '0 0 24 24',
        path: 'M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z',
        tags: ['tech', 'geometric', 'modular', 'structure'],
        complexity: 'simple',
    },
    {
        id: 'tech-grid-3x3',
        name: 'Grid 3x3',
        viewBox: '0 0 24 24',
        path: 'M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z',
        tags: ['tech', 'data', 'complex', 'pattern'],
        complexity: 'moderate',
    },
    {
        id: 'tech-circuit-corner',
        name: 'Circuit Corner',
        viewBox: '0 0 24 24',
        path: 'M20 4h-6.17l-1.42 1.41L13.83 4L11 4v2h2.17l1.42 1.41L13.17 6H19v13H6v-6H4v7a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z M8 10H5v2h3v-2z', // Abstract representation
        tags: ['tech', 'electronics', 'modern'],
        complexity: 'moderate',
    },
    {
        id: 'tech-brackets',
        name: 'Brackets',
        viewBox: '0 0 24 24',
        path: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
        tags: ['tech', 'code', 'developer'],
        complexity: 'simple',
    },
    {
        id: 'tech-node-network',
        name: 'Node Network',
        viewBox: '0 0 24 24',
        path: 'M17 16l-4.17-3.13 1.42-1.88L18.42 14.12l3.17-2.38-1.42-1.88L17 12.25V7H7v5.25l-3.17-2.37-1.42 1.88L5.58 14.12l-3.17 2.38 1.42 1.88L8 15.25V21h8v-5.75l3.83 2.88 1.42-1.88L17 13.12z', // Abstracted
        tags: ['tech', 'connection', 'network', 'complex'],
        complexity: 'detailed',
    },
    {
        id: 'tech-pixel-cloud',
        name: 'Pixel Cloud',
        viewBox: '0 0 24 24',
        path: 'M4 14h4v4H4v-4zm0-6h4v4H4V8zm6 0h4v4h-4V8zm0 6h4v4h-4v-4zm6-6h4v4h-4V8zm0 6h4v4h-4v-4z',
        tags: ['tech', 'data', 'pixel', 'modern'],
        complexity: 'detailed',
    },
    {
        id: 'tech-signal-radial',
        name: 'Signal Radial',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2c4.42 0 8 3.58 8 8s-3.58 8-8 8-8-3.58-8-8 3.58-8 8-8zm0 4c2.21 0 4 1.79 4 4s-1.79 4-4 4-4-1.79-4-4 1.79-4 4-4zm0 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z',
        tags: ['tech', 'connectivity', 'modern'],
        complexity: 'moderate',
    },

    // ============================================================
    // 3. ORGANIC & FLUID (Nature, Soft, Flow)
    // ============================================================
    {
        id: 'org-leaf-single',
        name: 'Leaf Single',
        viewBox: '0 0 24 24',
        path: 'M17 8C8 10 5.9 16.17 3.82 21.34 5.71 18.06 8.4 15 12 13c-3 3-5 7-5 11 5-1 9-3 13-9 1-1.5 1-4-3-7z',
        tags: ['nature', 'organic', 'growth', 'eco'],
        complexity: 'moderate',
    },
    {
        id: 'org-blob-1',
        name: 'Blob 1',
        viewBox: '0 0 24 24',
        path: 'M12 2C8 2 4 6 4 11s2 9 8 11 10-4 10-10S16 2 12 2z', // Roughly simplified
        tags: ['organic', 'fluid', 'friendly'],
        complexity: 'simple',
    },
    {
        id: 'org-drop',
        name: 'Drop',
        viewBox: '0 0 24 24',
        path: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z',
        tags: ['nature', 'water', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'org-wave-circle',
        name: 'Wave Circle',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5c-2.5 0-4.5-2-4.5-4.5s2-4.5 4.5-4.5c1.2 0 2.3.5 3.2 1.3l.1.1c.4.4.4 1 0 1.4s-1 .4-1.4 0l-.1-.1C11.3 9.7 10.7 9.5 10 9.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5c.7 0 1.3-.3 1.8-.8.4-.4 1-.4 1.4 0s.4 1 0 1.4C12.4 16.1 11.2 16.5 10 16.5z',
        tags: ['organic', 'flow', 'modern'],
        complexity: 'moderate',
    },
    {
        id: 'org-sun-rays',
        name: 'Sun Rays',
        viewBox: '0 0 24 24',
        path: 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1z',
        tags: ['nature', 'bright', 'energy'],
        complexity: 'detailed',
    },

    // ============================================================
    // 4. ABSTRACT & BAUHAUS (Artistic, Complex)
    // ============================================================
    {
        id: 'abs-arch',
        name: 'Arch',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12v10h4v-7c0-3.31 2.69-6 6-6s6 2.69 6 6v7h4V12c0-5.52-4.48-10-10-10z',
        tags: ['abstract', 'bauhaus', 'structure'],
        complexity: 'moderate',
    },
    {
        id: 'abs-stairs',
        name: 'Stairs',
        viewBox: '0 0 24 24',
        path: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 14H7v-4h6v4zm6-6h-6V7h6v4z',
        tags: ['abstract', 'geometric', 'modern'],
        complexity: 'simple',
    },
    {
        id: 'abs-eyes',
        name: 'Abstract Eye',
        viewBox: '0 0 24 24',
        path: 'M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z',
        tags: ['abstract', 'vision', 'modern'],
        complexity: 'moderate',
    },
    {
        id: 'abs-swoosh',
        name: 'Swoosh',
        viewBox: '0 0 24 24',
        path: 'M4.6 21.4c-.4.4-1.2.2-1.4-.4 0-.1 0-.2.1-.3l.1-.1c3.7-4.1 8-7.8 13-10.9 2-.9 4-1.8 6.1-2.4 1.1-.4 2.2-.6 3.3-.6.6 0 1.2.5 1.2 1.1 0 .5-.3 1-.8 1.1-1.9.7-3.8 1.5-5.6 2.5-4.2 2.3-8.1 5.2-11.6 8.5l-.2.2c-.4.4-1.2.2-1.4-.4-.1-.1-.1-.2 0-.3z',
        tags: ['abstract', 'dynamic', 'speed'],
        complexity: 'moderate',
    },
    {
        id: 'abs-infinity',
        name: 'Infinity',
        viewBox: '0 0 24 24',
        path: 'M18.6 6.62c-1.44 0-2.8.56-3.77 1.53L12 10.66 10.48 12h.01L7.8 14.39c-.64.64-1.49.99-2.4.99-1.87 0-3.39-1.51-3.39-3.38S3.53 8.62 5.4 8.62c.91 0 1.76.35 2.44 1.03l1.13 1 1.51-1.34L9.22 8.2A5.37 5.37 0 0 0 5.4 6.62C2.42 6.62 0 9.04 0 12s2.42 5.38 5.4 5.38c1.44 0 2.8-.56 3.77-1.53l2.83-2.5.01.01L13.52 12h-.01l2.69-2.39c.64-.64 1.49-.99 2.4-.99 1.87 0 3.39 1.51 3.39 3.38s-1.52 3.38-3.39 3.38c-.9 0-1.76-.35-2.44-1.03l-1.14-1.01-1.51 1.34 1.27 1.12a5.386 5.386 0 0 0 3.82 1.57c2.98 0 5.4-2.41 5.4-5.38s-2.42-5.37-5.4-5.37z',
        tags: ['modern', 'creative', 'tech'],
        complexity: 'moderate',
    },
    {
        id: 'abs-spiral',
        name: 'Spiral',
        viewBox: '0 0 24 24',
        path: 'M19.79 4.21a1.5 1.5 0 0 0-2.12 0l-1.06 1.06A7.468 7.468 0 0 0 12 4c-4.14 0-7.5 3.36-7.5 7.5 0 1.85.68 3.54 1.79 4.85l-1.06 1.06a1.5 1.5 0 1 0 2.12 2.12l1.06-1.06c1.31 1.11 3 1.79 4.85 1.79a7.5 7.5 0 0 0 7.5-7.5c0-1.85-.68-3.54-1.79-4.85l1.06-1.06a1.5 1.5 0 0 0-.24-2.24zM12 17.5c-3.03 0-5.5-2.47-5.5-5.5S8.97 6.5 12 6.5s5.5 2.47 5.5 5.5-2.47 5.5-5.5 5.5zm0-9c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5 3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5zm0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
        tags: ['creative', 'organic', 'dynamic'],
        complexity: 'detailed',
    },

    // ============================================================
    // 5. MARKS & SYMBOLS (Direct Communication)
    // ============================================================
    {
        id: 'mark-plus-circle',
        name: 'Plus Circle',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z',
        tags: ['minimalist', 'health', 'positive', 'bold'],
        complexity: 'simple',
    },
    {
        id: 'mark-arrow-circle',
        name: 'Arrow Circle Up',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4-8l-4-4-4 4h2.5v4.5h3V12H16z',
        tags: ['growth', 'dynamic', 'action'],
        complexity: 'moderate',
    },
    {
        id: 'mark-star-4',
        name: 'Star 4-Point',
        viewBox: '0 0 24 24',
        path: 'M12 2l2.5 8.5L22 12l-7.5 1.5L12 22l-2.5-8.5L2 12l7.5-1.5L12 2z', // Approximated 4 point star for 'sparkle'
        tags: ['minimalist', 'premium', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'mark-crown',
        name: 'Crown',
        viewBox: '0 0 24 24',
        path: 'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z',
        tags: ['luxury', 'premium', 'bold'],
        complexity: 'moderate',
    },
    {
        id: 'mark-flame',
        name: 'Flame',
        viewBox: '0 0 24 24',
        path: 'M16.5 13c-.55 0-1 .45-1 1s.45 1 1 1c1.1 0 2-.9 2-2 0-3.5-3-5.5-5-5.5-.55 0-1 .45-1 1s.45 1 1 1c1.55 0 2.5 1.5 2.5 3 0 1.1-.9 2-2 2s-2-.9-2-2c0-.55-.45-1-1-1s-1 .45-1 1c0 2.21 1.79 4 4 4s4-1.79 4-4c0-.55-.45-1-1-1z M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9 9 9 0 0 0-9-9z', // Simplified abstract flame
        tags: ['energy', 'bold', 'warm'],
        complexity: 'moderate',
    },
    {
        id: 'mark-lightning-filled',
        name: 'Lightning Filled',
        viewBox: '0 0 24 24',
        path: 'M7 2v11h3v9l7-12h-4l4-8H7z',
        tags: ['energy', 'tech', 'flash'],
        complexity: 'simple',
    },
    {
        id: 'mark-heart',
        name: 'Heart',
        viewBox: '0 0 24 24',
        path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
        tags: ['organic', 'warm', 'care'],
        complexity: 'simple',
    },
    // ============================================================
    // 6. CONTAINERS & FRAMES (Base Shapes for Cuts)
    // ============================================================
    {
        id: 'cont-shield-simple',
        name: 'Shield Simple',
        viewBox: '0 0 24 24',
        path: 'M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z',
        tags: ['classic', 'shield', 'protection', 'bold'],
        complexity: 'simple',
    },
    {
        id: 'cont-badge-hex',
        name: 'Badge Hex',
        viewBox: '0 0 24 24',
        path: 'M12 2l9 4v12l-9 4-9-4V6l9-4z', // Hexagon but used as container
        tags: ['modern', 'badge', 'tech'],
        complexity: 'simple',
    },
    {
        id: 'cont-circle-thick',
        name: 'Circle Container',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z', // Full circle
        tags: ['classic', 'modern', 'minimalist'],
        complexity: 'simple',
    },
    {
        id: 'cont-rounded-square',
        name: 'Rounded Square',
        viewBox: '0 0 24 24',
        path: 'M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2z',
        tags: ['modern', 'app', 'tech'],
        complexity: 'simple',
    },
    {
        id: 'cont-flag',
        name: 'Flag',
        viewBox: '0 0 24 24',
        path: 'M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z',
        tags: ['classic', 'symbol', 'bold'],
        complexity: 'simple',
    },
    {
        id: 'cont-tag',
        name: 'Tag',
        viewBox: '0 0 24 24',
        path: 'M20 10V6h-4l-6 6 4 4zm-6 8l-6-6v-6h6l6 6z', // Tag shape
        tags: ['modern', 'retail', 'clean'],
        complexity: 'simple',
    }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Get shapes matching specific tags (vibes)
 */
export function getShapesByVibe(vibe: string): Shape[] {
    const matches = SHAPES.filter(shape => shape.tags.includes(vibe));
    return matches.length > 0 ? matches : SHAPES.slice(0, 10);
}

/**
 * Get a shape by ID
 */
export function getShapeById(id: string): Shape | undefined {
    return SHAPES.find(shape => shape.id === id);
}

/**
 * Get shapes by complexity
 */
export function getShapesByComplexity(complexity: Shape['complexity']): Shape[] {
    return SHAPES.filter(shape => shape.complexity === complexity);
}

/**
 * Get a random shape matching criteria
 */
export function getRandomShape(vibe?: string): Shape {
    const pool = vibe ? getShapesByVibe(vibe) : SHAPES;
    return pool[Math.floor(Math.random() * pool.length)];
}
