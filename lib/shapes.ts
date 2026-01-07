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
    // Concentric shapes removed for being too generic (target/eye look)


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
        id: 'org-drop',
        name: 'Drop',
        viewBox: '0 0 24 24',
        path: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z',
        tags: ['nature', 'water', 'clean'],
        complexity: 'simple',
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
        id: 'mark-lightning-filled',
        name: 'Lightning Filled',
        viewBox: '0 0 24 24',
        path: 'M7 2v11h3v9l7-12h-4l4-8H7z',
        tags: ['energy', 'tech', 'flash'],
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
        path: 'M12 2l9 4v12l-9 4-9-4V6l9-4z',
        tags: ['modern', 'badge', 'tech'],
        complexity: 'simple',
    },

    // ============================================================
    // 7. PREMIUM TECH SHAPES (NEW)
    // ============================================================
    {
        id: 'tech-cpu',
        name: 'CPU Chip',
        viewBox: '0 0 24 24',
        path: 'M6 4h12v2h-2v2h2v2h-2v2h2v2h-2v2h2v2H6v-2h2v-2H6v-2h2v-2H6V8h2V6H6V4zm3 4v8h6V8H9z',
        tags: ['tech', 'digital', 'modern', 'futuristic'],
        complexity: 'detailed',
    },
    {
        id: 'tech-signal',
        name: 'Signal Waves',
        viewBox: '0 0 24 24',
        path: 'M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M8.5 8.5c1.9-1.9 5.1-1.9 7 0M5.5 5.5c3.6-3.6 9.4-3.6 13 0',
        tags: ['tech', 'connection', 'wireless', 'modern'],
        complexity: 'moderate',
    },
    {
        id: 'tech-terminal',
        name: 'Terminal',
        viewBox: '0 0 24 24',
        path: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm3 6l3 2-3 2v2l5-4-5-4v2zm6 4h5v2h-5v-2z',
        tags: ['tech', 'code', 'developer', 'modern'],
        complexity: 'moderate',
    },
    {
        id: 'tech-layers',
        name: 'Layers Stack',
        viewBox: '0 0 24 24',
        path: 'M12 4l-8 4 8 4 8-4-8-4zm-8 8l8 4 8-4m-16 4l8 4 8-4',
        tags: ['tech', 'design', 'modern', 'structure'],
        complexity: 'moderate',
    },
    {
        id: 'tech-blockchain',
        name: 'Blockchain',
        viewBox: '0 0 24 24',
        path: 'M4 6h4v4H4V6zm6 0h4v4h-4V6zm6 0h4v4h-4V6zM4 14h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z',
        tags: ['tech', 'crypto', 'modern', 'futuristic'],
        complexity: 'simple',
    },

    // ============================================================
    // 8. PREMIUM NATURE SHAPES (NEW)
    // ============================================================
    {
        id: 'nature-tree',
        name: 'Pine Tree',
        viewBox: '0 0 24 24',
        path: 'M12 2L6 10h3L5 16h4l-3 6h12l-3-6h4l-4-6h3L12 2z',
        tags: ['nature', 'organic', 'eco', 'growth'],
        complexity: 'moderate',
    },
    {
        id: 'nature-mountain',
        name: 'Mountain Peak',
        viewBox: '0 0 24 24',
        path: 'M12 4l-8 16h16L12 4zm0 5l4 8H8l4-8z',
        tags: ['nature', 'adventure', 'bold', 'outdoor'],
        complexity: 'simple',
    },
    {
        id: 'nature-wave',
        name: 'Ocean Wave',
        viewBox: '0 0 24 24',
        path: 'M2 12c2-2 4-2 6 0s4 2 6 0 4-2 6 0M2 16c2-2 4-2 6 0s4 2 6 0 4-2 6 0',
        tags: ['nature', 'water', 'flow', 'organic'],
        complexity: 'simple',
    },
    {
        id: 'nature-flower',
        name: 'Flower Bloom',
        viewBox: '0 0 24 24',
        path: 'M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0M12 2c1 3 1 5-1 7 2-2 4-2 7-1-3 1-5 1-7-1 2 2 2 4 1 7-1-3-1-5 1-7-2 2-4 2-7 1 3-1 5-1 7 1-2-2-2-4-1-7z',
        tags: ['nature', 'organic', 'feminine', 'growth'],
        complexity: 'detailed',
    },
    {
        id: 'nature-feather',
        name: 'Feather',
        viewBox: '0 0 24 24',
        path: 'M20 4c-2 2-4 3-8 4l-4 4 4 4c1-4 2-6 4-8 2-2 4-2 4-4zM4 20l6-6',
        tags: ['nature', 'organic', 'light', 'creative'],
        complexity: 'moderate',
    },

    // ============================================================
    // 9. PREMIUM MINIMALIST SHAPES (NEW)
    // ============================================================
    {
        id: 'min-chevron',
        name: 'Chevron Mark',
        viewBox: '0 0 24 24',
        path: 'M4 8l8 8 8-8',
        tags: ['minimalist', 'modern', 'clean', 'simple'],
        complexity: 'simple',
    },
    {
        id: 'min-corner',
        name: 'Corner Bracket',
        viewBox: '0 0 24 24',
        path: 'M6 6v12h12M18 18V6H6',
        tags: ['minimalist', 'architectural', 'clean', 'modern'],
        complexity: 'simple',
    },
    {
        id: 'min-dot-line',
        name: 'Dot Line',
        viewBox: '0 0 24 24',
        path: 'M4 12h2m4 0h2m4 0h2m-14 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm16 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
        tags: ['minimalist', 'tech', 'modern', 'connection'],
        complexity: 'simple',
    },
    {
        id: 'min-slash',
        name: 'Dynamic Slash',
        viewBox: '0 0 24 24',
        path: 'M5 19L19 5M8 19L22 5M2 19L16 5',
        tags: ['minimalist', 'dynamic', 'speed', 'modern'],
        complexity: 'simple',
    },
    {
        id: 'min-bar-trio',
        name: 'Bar Trio',
        viewBox: '0 0 24 24',
        path: 'M6 4v16M12 8v8M18 6v12',
        tags: ['minimalist', 'data', 'modern', 'clean'],
        complexity: 'simple',
    },

    // ============================================================
    // 10. PREMIUM BOLD SHAPES (NEW)
    // ============================================================
    {
        id: 'bold-arrow-up',
        name: 'Bold Arrow',
        viewBox: '0 0 24 24',
        path: 'M12 2l10 12H14v8h-4v-8H2L12 2z',
        tags: ['bold', 'growth', 'direction', 'startup'],
        complexity: 'simple',
    },
    {
        id: 'bold-diamond',
        name: 'Bold Diamond',
        viewBox: '0 0 24 24',
        path: 'M12 2l10 10-10 10L2 12 12 2z',
        tags: ['bold', 'premium', 'luxury', 'geometric'],
        complexity: 'simple',
    },
    {
        id: 'bold-flash',
        name: 'Power Flash',
        viewBox: '0 0 24 24',
        path: 'M13 2L3 14h8l-1 8 10-12h-8l1-8z',
        tags: ['bold', 'energy', 'power', 'dynamic'],
        complexity: 'simple',
    },
    {
        id: 'bold-rocket',
        name: 'Rocket',
        viewBox: '0 0 24 24',
        path: 'M12 2c-4 4-4 8-4 12l4 4 4-4c0-4 0-8-4-12zm0 10a2 2 0 1 1 0-4 2 2 0 0 1 0 4zM6 16l-4 4v2h4l2-4-2-2zm12 0l-2 2 2 4h4v-2l-4-4z',
        tags: ['bold', 'startup', 'growth', 'futuristic'],
        complexity: 'detailed',
    },
    {
        id: 'bold-cube',
        name: 'Isometric Cube',
        viewBox: '0 0 24 24',
        path: 'M12 2l10 6v8l-10 6-10-6V8l10-6zm0 4l-6 4 6 4 6-4-6-4z',
        tags: ['bold', '3d', 'tech', 'modern'],
        complexity: 'moderate',
    },

    // ============================================================
    // 11. PREMIUM CREATIVE SHAPES (NEW)
    // ============================================================
    {
        id: 'creative-puzzle',
        name: 'Puzzle Piece',
        viewBox: '0 0 24 24',
        path: 'M4 6h4c0-2 2-2 2 0h4c0-2 2-2 2 0h4v4c2 0 2 2 0 2v4c2 0 2 2 0 2v4h-4c0 2-2 2-2 0h-4c0 2-2 2-2 0H4v-4c-2 0-2-2 0-2v-4c-2 0-2-2 0-2V6z',
        tags: ['creative', 'playful', 'connection', 'fun'],
        complexity: 'detailed',
    },
    {
        id: 'creative-spark',
        name: 'Sparkle Burst',
        viewBox: '0 0 24 24',
        path: 'M12 2l1 6 5-3-3 5 6 1-6 1 3 5-5-3-1 6-1-6-5 3 3-5-6-1 6-1-3-5 5 3 1-6z',
        tags: ['creative', 'magic', 'vibrant', 'energy'],
        complexity: 'moderate',
    },
    {
        id: 'creative-orbit',
        name: 'Orbit Rings',
        viewBox: '0 0 24 24',
        path: 'M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M12 12m-6 0a6 6 0 1 0 12 0 6 6 0 1 0-12 0M3 12c0-1 4-3 9-3s9 2 9 3-4 3-9 3-9-2-9-3',
        tags: ['creative', 'space', 'tech', 'modern'],
        complexity: 'detailed',
    },
    {
        id: 'creative-helix',
        name: 'DNA Helix',
        viewBox: '0 0 24 24',
        path: 'M6 4c0 4 6 4 6 8s-6 4-6 8M18 4c0 4-6 4-6 8s6 4 6 8M8 6h8M8 12h8M8 18h8',
        tags: ['creative', 'science', 'organic', 'modern'],
        complexity: 'detailed',
    },
    {
        id: 'creative-atom',
        name: 'Atom',
        viewBox: '0 0 24 24',
        path: 'M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0M12 6c6 0 10 3 10 6s-4 6-10 6S2 15 2 12s4-6 10-6M7 3c3 5 3 13 0 18M17 3c-3 5-3 13 0 18',
        tags: ['creative', 'science', 'tech', 'energy'],
        complexity: 'detailed',
    },

    // ============================================================
    // 12. PREMIUM GEOMETRIC SHAPES (NEW)
    // ============================================================
    {
        id: 'geo-octagon',
        name: 'Octagon',
        viewBox: '0 0 24 24',
        path: 'M7 2h10l5 5v10l-5 5H7l-5-5V7l5-5z',
        tags: ['geometric', 'bold', 'modern', 'premium'],
        complexity: 'simple',
    },
    {
        id: 'geo-pentagon',
        name: 'Pentagon',
        viewBox: '0 0 24 24',
        path: 'M12 2l9 7-3.5 10h-11L3 9l9-7z',
        tags: ['geometric', 'modern', 'architectural'],
        complexity: 'simple',
    },
    {
        id: 'geo-cross',
        name: 'Swiss Cross',
        viewBox: '0 0 24 24',
        path: 'M9 2h6v7h7v6h-7v7H9v-7H2V9h7V2z',
        tags: ['geometric', 'bold', 'medical', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'geo-pinwheel',
        name: 'Pinwheel',
        viewBox: '0 0 24 24',
        path: 'M12 12L2 6v6l10 6v-6zm0 0l10-6v6l-10 6v-6z',
        tags: ['geometric', 'dynamic', 'modern', 'creative'],
        complexity: 'moderate',
    },
    {
        id: 'geo-triskel',
        name: 'Triskelion',
        viewBox: '0 0 24 24',
        path: 'M12 12l8-4c-2 4-4 6-8 4l-4 8c4-2 6-4 4-8l-8-4c4 2 6 4 8-4l4-8c-2 4-4 6-4 8z',
        tags: ['geometric', 'celtic', 'dynamic', 'creative'],
        complexity: 'detailed',
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
