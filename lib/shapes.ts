/**
 * MarkZero Shape Intelligence Engine
 * 
 * 50 Geometric Primitives as SVG paths, tagged by vibe.
 * These are designed to work as single-color logo marks.
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
    // GEOMETRIC MINIMALIST (1-10)
    // ============================================================
    {
        id: 'geo-triangle',
        name: 'Triangle',
        viewBox: '0 0 24 24',
        path: 'M12 2L2 22h20L12 2z',
        tags: ['minimalist', 'geometric', 'modern'],
        complexity: 'simple',
    },
    {
        id: 'geo-square',
        name: 'Square',
        viewBox: '0 0 24 24',
        path: 'M3 3h18v18H3z',
        tags: ['minimalist', 'geometric', 'professional'],
        complexity: 'simple',
    },
    {
        id: 'geo-circle',
        name: 'Circle',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z',
        tags: ['minimalist', 'organic', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'geo-hexagon',
        name: 'Hexagon',
        viewBox: '0 0 24 24',
        path: 'M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z',
        tags: ['tech', 'geometric', 'bold'],
        complexity: 'simple',
    },
    {
        id: 'geo-diamond',
        name: 'Diamond',
        viewBox: '0 0 24 24',
        path: 'M12 2L2 12l10 10 10-10L12 2z',
        tags: ['minimalist', 'premium', 'geometric'],
        complexity: 'simple',
    },
    {
        id: 'geo-pentagon',
        name: 'Pentagon',
        viewBox: '0 0 24 24',
        path: 'M12 2L3 9.5l3.5 11h11l3.5-11L12 2z',
        tags: ['geometric', 'bold', 'professional'],
        complexity: 'simple',
    },
    {
        id: 'geo-octagon',
        name: 'Octagon',
        viewBox: '0 0 24 24',
        path: 'M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z',
        tags: ['geometric', 'tech', 'bold'],
        complexity: 'simple',
    },
    {
        id: 'geo-ring',
        name: 'Ring',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
        tags: ['minimalist', 'modern', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'geo-triangle-up',
        name: 'Triangle Up',
        viewBox: '0 0 24 24',
        path: 'M4 20h16L12 4 4 20z',
        tags: ['minimalist', 'growth', 'geometric'],
        complexity: 'simple',
    },
    {
        id: 'geo-parallelogram',
        name: 'Parallelogram',
        viewBox: '0 0 24 24',
        path: 'M6 4h16l-4 16H2l4-16z',
        tags: ['geometric', 'modern', 'dynamic'],
        complexity: 'simple',
    },

    // ============================================================
    // TECH & DIGITAL (11-20)
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
        id: 'tech-cube',
        name: 'Cube',
        viewBox: '0 0 24 24',
        path: 'M21 16.5V7.5L12 2 3 7.5v9L12 22l9-5.5zM12 4.15l6.5 4L12 12 5.5 8.15 12 4.15z',
        tags: ['tech', 'geometric', '3d'],
        complexity: 'moderate',
    },
    {
        id: 'tech-layers',
        name: 'Layers',
        viewBox: '0 0 24 24',
        path: 'M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.62-1.26-7.39 5.73zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z',
        tags: ['tech', 'modern', 'depth'],
        complexity: 'moderate',
    },
    {
        id: 'tech-grid',
        name: 'Grid',
        viewBox: '0 0 24 24',
        path: 'M3 3h8v8H3V3zm0 10h8v8H3v-8zm10-10h8v8h-8V3zm0 10h8v8h-8v-8z',
        tags: ['tech', 'geometric', 'modular'],
        complexity: 'simple',
    },
    {
        id: 'tech-code',
        name: 'Code Brackets',
        viewBox: '0 0 24 24',
        path: 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
        tags: ['tech', 'developer', 'modern'],
        complexity: 'simple',
    },
    {
        id: 'tech-terminal',
        name: 'Terminal',
        viewBox: '0 0 24 24',
        path: 'M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8h16v10zm-2-1h-6v-2h6v2zM7.5 17l-1.41-1.41L8.67 13l-2.59-2.59L7.5 9l4 4-4 4z',
        tags: ['tech', 'developer', 'bold'],
        complexity: 'moderate',
    },
    {
        id: 'tech-chip',
        name: 'Chip',
        viewBox: '0 0 24 24',
        path: 'M6 4h12v2h-12V4zm0 14h12v2h-12v-2zm-2-2V8h2v8H4zm14 0V8h2v8h-2zM9 9h6v6H9V9z',
        tags: ['tech', 'futuristic', 'modern'],
        complexity: 'moderate',
    },
    {
        id: 'tech-signal',
        name: 'Signal',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c3.87 0 7 3.13 7 7s-3.13 7-7 7-7-3.13-7-7 3.13-7 7-7zm0 2c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z',
        tags: ['tech', 'connectivity', 'modern'],
        complexity: 'moderate',
    },
    {
        id: 'tech-arrow-up',
        name: 'Arrow Up',
        viewBox: '0 0 24 24',
        path: 'M4 12l8-8 8 8h-5v8h-6v-8H4z',
        tags: ['tech', 'growth', 'bold'],
        complexity: 'simple',
    },
    {
        id: 'tech-play',
        name: 'Play',
        viewBox: '0 0 24 24',
        path: 'M8 5v14l11-7L8 5z',
        tags: ['tech', 'media', 'bold'],
        complexity: 'simple',
    },

    // ============================================================
    // ORGANIC & NATURE (21-30)
    // ============================================================
    {
        id: 'org-leaf',
        name: 'Leaf',
        viewBox: '0 0 24 24',
        path: 'M17 8C8 10 5.9 16.17 3.82 21.34 5.71 18.06 8.4 15 12 13c-3 3-5 7-5 11 5-1 9-3 13-9 1-1.5 1-4-3-7z',
        tags: ['nature', 'organic', 'growth', 'eco'],
        complexity: 'moderate',
    },
    {
        id: 'org-water-drop',
        name: 'Water Drop',
        viewBox: '0 0 24 24',
        path: 'M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z',
        tags: ['nature', 'organic', 'calm', 'water'],
        complexity: 'simple',
    },
    {
        id: 'org-sun',
        name: 'Sun',
        viewBox: '0 0 24 24',
        path: 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 0 0 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z',
        tags: ['nature', 'organic', 'vibrant', 'energy'],
        complexity: 'detailed',
    },
    {
        id: 'org-flower',
        name: 'Flower',
        viewBox: '0 0 24 24',
        path: 'M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 3.12 13.38 2 12 2S9.5 3.12 9.5 4.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25zM12 5.5c1.38 0 2.5 1.12 2.5 2.5s-1.12 2.5-2.5 2.5S9.5 9.38 9.5 8s1.12-2.5 2.5-2.5zM3 13c0 4.97 4.03 9 9 9 0-4.97-4.03-9-9-9z',
        tags: ['nature', 'organic', 'growth', 'feminine'],
        complexity: 'detailed',
    },
    {
        id: 'org-mountain',
        name: 'Mountain',
        viewBox: '0 0 24 24',
        path: 'M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z',
        tags: ['nature', 'outdoor', 'adventure'],
        complexity: 'simple',
    },
    {
        id: 'org-wave',
        name: 'Wave',
        viewBox: '0 0 24 24',
        path: 'M17 16.99c-1.35 0-2.2.42-2.95.8-.65.33-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.95c1.35 0 2.2-.42 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.42 2.95-.8c.65-.33 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm0-4.45c-1.35 0-2.2.43-2.95.8-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.32-1.17.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.35 1.15-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.58.8 2.95.8v-1.95c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.8-2.95-.8zm2.95-8.08c-.75-.38-1.58-.8-2.95-.8s-2.2.42-2.95.8c-.65.32-1.18.6-2.05.6-.9 0-1.4-.25-2.05-.6-.75-.37-1.57-.8-2.95-.8s-2.2.42-2.95.8c-.65.33-1.17.6-2.05.6v1.93c1.35 0 2.2-.43 2.95-.8.65-.33 1.17-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V5.04c-.9 0-1.4-.25-2.05-.58zM17 8.09c-1.35 0-2.2.43-2.95.8-.65.35-1.15.6-2.05.6s-1.4-.25-2.05-.6c-.75-.38-1.57-.8-2.95-.8s-2.2.43-2.95.8c-.65.35-1.15.6-2.05.6v1.95c1.35 0 2.2-.43 2.95-.8.65-.32 1.18-.6 2.05-.6s1.4.25 2.05.6c.75.38 1.57.8 2.95.8s2.2-.43 2.95-.8c.65-.32 1.18-.6 2.05-.6.9 0 1.4.25 2.05.6.75.38 1.58.8 2.95.8V8.64c-.9 0-1.4-.25-2.05-.6-.75-.38-1.6-.75-2.95-.75z',
        tags: ['nature', 'calm', 'water', 'organic'],
        complexity: 'detailed',
    },
    {
        id: 'org-tree',
        name: 'Tree',
        viewBox: '0 0 24 24',
        path: 'M22 9.67A9.07 9.07 0 0 0 12 1a9.07 9.07 0 0 0-10 8.67A9 9 0 0 0 7 17.65V21a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-3.35A9 9 0 0 0 22 9.67z',
        tags: ['nature', 'growth', 'organic', 'eco'],
        complexity: 'simple',
    },
    {
        id: 'org-star',
        name: 'Star',
        viewBox: '0 0 24 24',
        path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        tags: ['premium', 'vibrant', 'standout'],
        complexity: 'simple',
    },
    {
        id: 'org-heart',
        name: 'Heart',
        viewBox: '0 0 24 24',
        path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
        tags: ['organic', 'warm', 'passionate'],
        complexity: 'simple',
    },
    {
        id: 'org-cloud',
        name: 'Cloud',
        viewBox: '0 0 24 24',
        path: 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
        tags: ['nature', 'tech', 'calm'],
        complexity: 'simple',
    },

    // ============================================================
    // ABSTRACT & ARTISTIC (31-40)
    // ============================================================
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
    {
        id: 'abs-crescents',
        name: 'Crescents',
        viewBox: '0 0 24 24',
        path: 'M12 3a9 9 0 0 0-9 9 9 9 0 0 0 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8z',
        tags: ['creative', 'organic', 'dynamic'],
        complexity: 'simple',
    },
    {
        id: 'abs-stacked',
        name: 'Stacked Squares',
        viewBox: '0 0 24 24',
        path: 'M3 5v14h14V5H3zm16 0v14h2V5h-2zM5 7h10v10H5V7z',
        tags: ['modern', 'geometric', 'layered'],
        complexity: 'simple',
    },
    {
        id: 'abs-overlap',
        name: 'Overlapping Circles',
        viewBox: '0 0 24 24',
        path: 'M7.5 12c0-2.49 2.01-4.5 4.5-4.5s4.5 2.01 4.5 4.5H18c0-3.31-2.69-6-6-6s-6 2.69-6 6h1.5zm9 0c0 2.49-2.01 4.5-4.5 4.5S7.5 14.49 7.5 12H6c0 3.31 2.69 6 6 6s6-2.69 6-6h-1.5z',
        tags: ['modern', 'creative', 'connection'],
        complexity: 'moderate',
    },
    {
        id: 'abs-bars',
        name: 'Bars',
        viewBox: '0 0 24 24',
        path: 'M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z',
        tags: ['modern', 'structure', 'modular'],
        complexity: 'simple',
    },
    {
        id: 'abs-dots',
        name: 'Dots Grid',
        viewBox: '0 0 24 24',
        path: 'M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z',
        tags: ['modern', 'minimal', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'abs-target',
        name: 'Target',
        viewBox: '0 0 24 24',
        path: 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10 10-4.49 10-10S17.51 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3-8c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3z',
        tags: ['focused', 'bold', 'professional'],
        complexity: 'simple',
    },
    {
        id: 'abs-plus',
        name: 'Plus',
        viewBox: '0 0 24 24',
        path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z',
        tags: ['minimalist', 'health', 'growth'],
        complexity: 'simple',
    },
    {
        id: 'abs-cross',
        name: 'Cross',
        viewBox: '0 0 24 24',
        path: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z',
        tags: ['minimalist', 'bold', 'dynamic'],
        complexity: 'simple',
    },

    // ============================================================
    // LETTERFORMS & MARKS (41-50)
    // ============================================================
    {
        id: 'mark-a',
        name: 'Mark A',
        viewBox: '0 0 24 24',
        path: 'M12 2L4 20h3.5l1.5-4h6l1.5 4H20L12 2zm-1.5 12l2.5-7 2.5 7h-5z',
        tags: ['bold', 'professional', 'letterform'],
        complexity: 'simple',
    },
    {
        id: 'mark-m',
        name: 'Mark M',
        viewBox: '0 0 24 24',
        path: 'M4 4v16h3V9l5 8 5-8v11h3V4h-3l-5 8-5-8H4z',
        tags: ['bold', 'professional', 'letterform'],
        complexity: 'simple',
    },
    {
        id: 'mark-z',
        name: 'Mark Z',
        viewBox: '0 0 24 24',
        path: 'M4 4v3h11L4 18v2h16v-3H9l11-11V4H4z',
        tags: ['bold', 'modern', 'letterform'],
        complexity: 'simple',
    },
    {
        id: 'mark-n',
        name: 'Mark N',
        viewBox: '0 0 24 24',
        path: 'M4 4v16h3V9l10 11h3V4h-3v11L7 4H4z',
        tags: ['bold', 'professional', 'letterform'],
        complexity: 'simple',
    },
    {
        id: 'mark-arrow-ne',
        name: 'Arrow NE',
        viewBox: '0 0 24 24',
        path: 'M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z',
        tags: ['growth', 'dynamic', 'modern'],
        complexity: 'simple',
    },
    {
        id: 'mark-check',
        name: 'Checkmark',
        viewBox: '0 0 24 24',
        path: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z',
        tags: ['trust', 'professional', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'mark-slash',
        name: 'Slash',
        viewBox: '0 0 24 24',
        path: 'M7 21L17 3h-3L4 21h3z',
        tags: ['minimalist', 'modern', 'tech'],
        complexity: 'simple',
    },
    {
        id: 'mark-bracket',
        name: 'Bracket',
        viewBox: '0 0 24 24',
        path: 'M9 3H7v18h2v-2H7V5h2V3zm8 0h-2v2h2v14h-2v2h2V3z',
        tags: ['tech', 'developer', 'modern'],
        complexity: 'simple',
    },
    {
        id: 'mark-equals',
        name: 'Equals',
        viewBox: '0 0 24 24',
        path: 'M19 9.998H5v-2h14v2zm0 4H5v2h14v-2z',
        tags: ['minimalist', 'balance', 'clean'],
        complexity: 'simple',
    },
    {
        id: 'mark-menu',
        name: 'Menu Bars',
        viewBox: '0 0 24 24',
        path: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z',
        tags: ['minimalist', 'structure', 'modern'],
        complexity: 'simple',
    },
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
