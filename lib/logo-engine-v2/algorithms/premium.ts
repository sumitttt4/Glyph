
import { InfiniteLogoParams } from '../types';

// Helper for seeded random
const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

// Helper to get abstract geometric shapes (No letters)
const getAbstractShape = (seed: number, size: number = 60) => {
    const type = seed % 6;
    const center = 100;
    const offset = size;

    // 0: Star
    if (type === 0) return `<polygon points="${center},${center - offset} ${center + offset * 0.2},${center - offset * 0.2} ${center + offset},${center - offset * 0.2} ${center + offset * 0.4},${center + offset * 0.2} ${center + offset * 0.6},${center + offset} ${center},${center + offset * 0.5} ${center - offset * 0.6},${center + offset} ${center - offset * 0.4},${center + offset * 0.2} ${center - offset},${center - offset * 0.2} ${center - offset * 0.2},${center - offset * 0.2}" fill="white" />`;

    // 1: Diamond
    if (type === 1) return `<polygon points="${center},${center - offset} ${center + offset * 0.8},${center} ${center},${center + offset} ${center - offset * 0.8},${center}" fill="white" />`;

    // 2: Bolt
    if (type === 2) return `<polygon points="${center + 10},${center - offset} ${center + 30},${center - 10} ${center + 80},${center - 10} ${center},${center + offset} ${center + 10},${center + 20} ${center - 60},${center + 20}" fill="white" />`;

    // 3: Inverted Triangle
    if (type === 3) return `<polygon points="${center - offset},${center - offset * 0.5} ${center + offset},${center - offset * 0.5} ${center},${center + offset}" fill="white" />`;

    // 4: Hexagon
    if (type === 4) return `<polygon points="${center - offset * 0.5},${center - offset} ${center + offset * 0.5},${center - offset} ${center + offset},${center} ${center + offset * 0.5},${center + offset} ${center - offset * 0.5},${center + offset} ${center - offset},${center}" fill="white" />`;

    // 5: Cross/Plus
    return `<path d="M${center - 20},${center - offset} L${center + 20},${center - offset} L${center + 20},${center - 20} L${center + offset},${center - 20} L${center + offset},${center + 20} L${center + 20},${center + 20} L${center + 20},${center + offset} L${center - 20},${center + offset} L${center - 20},${center + 20} L${center - offset},${center + 20} L${center - offset},${center - 20} L${center - 20},${center - 20} Z" fill="white" />`;
};

// 1. CONSTRUCTION / ARCHITECTURAL STYLE
// (Simplified to a clean geometric shape, dashed lines removed)
export const generateConstruction = (params: InfiniteLogoParams, brandName: string) => {
    // Just a clean geometric placeholder since the "Blueprint" style was purged
    // This allows existing references to not crash but renders something safe.
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="50" y="50" width="100" height="100" fill="none" stroke="currentColor" stroke-width="2" opacity="0.5" />
        <circle cx="100" cy="100" r="30" fill="currentColor" />
    </svg>`;
};

// 2. NEO GRADIENT / ORB (Abstract only)
export const generateNeoGradient = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const id = `grad-${seed}`;
    const blurId = `blur-${seed}`;

    const defs = `
        <defs>
            <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="white" stop-opacity="0.8" />
                <stop offset="100%" stop-color="currentColor" />
            </linearGradient>
            <filter id="${blurId}">
                <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
            </filter>
        </defs>
    `;

    const orb = `
        <circle cx="100" cy="100" r="80" fill="url(#${id})" />
        <circle cx="70" cy="70" r="30" fill="white" opacity="0.3" filter="url(#${blurId})" />
    `;

    // Replaced text with geometric shape
    const centerShape = `
        <g opacity="0.9" transform="scale(0.6) translate(66, 66)">
            ${getAbstractShape(seed, 60)}
        </g>
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${orb}${centerShape}</svg>`;
};

// 3. NEGATIVE SPACE / CUTOUT (Abstract only)
export const generateNegativeSpace = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const maskId = `mask-${seed}`;

    // Container Shape
    const containerType = seed % 3;
    let path = '';
    // 0: Squircle, 1: Circle, 2: Hexagon
    if (containerType === 0) path = `<rect x="20" y="20" width="160" height="160" rx="40" fill="currentColor" mask="url(#${maskId})" />`;
    else if (containerType === 1) path = `<circle cx="100" cy="100" r="90" fill="currentColor" mask="url(#${maskId})" />`;
    else path = `<path d="M50 20 L150 20 L190 100 L150 180 L50 180 L10 100 Z" fill="currentColor" mask="url(#${maskId})" />`;

    const defs = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                <!-- Center Cutout (Replaced text with shape) -->
                ${getAbstractShape(seed, 50).replace(/fill="white"/, 'fill="black"')} 
                <!-- Optional Slash -->
                ${seed % 2 === 0 ? '<path d="M0 200 L200 0" stroke="black" stroke-width="20" />' : ''}
            </mask>
        </defs>
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${path}</svg>`;
};

// 4. SWISS MINIMAL (Abstract Geometry)
export const generateSwissMinimal = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);

    // purely abstract geometric compositions
    const compositionType = seed % 3;
    let shapes = '';

    if (compositionType === 0) {
        // Circle + Line
        shapes = `
            <circle cx="100" cy="80" r="40" fill="currentColor" />
            <rect x="80" y="140" width="40" height="20" fill="currentColor" />
        `;
    } else if (compositionType === 1) {
        // Triangle + Circle
        shapes = `
            <path d="M100 40 L160 160 L40 160 Z" fill="currentColor" />
            <circle cx="100" cy="110" r="20" fill="white" /> 
        `;
    } else {
        // Grid Blocks
        shapes = `
            <rect x="50" y="50" width="45" height="45" fill="currentColor" />
            <rect x="105" y="50" width="45" height="45" fill="currentColor" />
            <rect x="50" y="105" width="45" height="45" fill="currentColor" />
            <circle cx="127.5" cy="127.5" r="22.5" fill="currentColor" />
        `;
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${shapes}</svg>`;
};
