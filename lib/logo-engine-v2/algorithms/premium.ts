
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

// 1. CONSTRUCTION / ARCHITECTURAL STYLE (The "K" example)
export const generateConstruction = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const initial = brandName[0].toUpperCase();
    const isCircle = seed % 2 === 0;

    // Construction Lines (Guides)
    const guides = `
        <g stroke="currentColor" stroke-width="0.5" opacity="0.4" stroke-dasharray="2 2" fill="none">
            <circle cx="100" cy="100" r="80" />
            <line x1="100" y1="20" x2="100" y2="180" />
            <line x1="20" y1="100" x2="180" y2="100" />
            <line x1="20" y1="20" x2="180" y2="180" />
            <line x1="180" y1="20" x2="20" y2="180" />
        </g>
    `;

    // Main Shape
    let mainShape = '';
    if (isCircle) {
        mainShape = `<path d="M100 20 L 100 100 L 180 100 A 80 80 0 0 0 100 20" fill="currentColor" opacity="0.9" />`;
    } else {
        // Geometric Letter
        mainShape = `<text x="100" y="140" font-family="monospace" font-weight="bold" font-size="100" text-anchor="middle" fill="currentColor">${initial}</text>`;
    }

    // Accents (Nodes)
    const nodes = `
        <g fill="currentColor">
            <circle cx="100" cy="20" r="2" />
            <circle cx="180" cy="100" r="2" />
            <circle cx="100" cy="180" r="2" />
            <circle cx="20" cy="100" r="2" />
            <circle cx="100" cy="100" r="3" />
        </g>
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${guides}${mainShape}${nodes}</svg>`;
};

// 2. NEO GRADIENT / ORB (The "HaloAI" example)
export const generateNeoGradient = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const id = `grad-${seed}`;
    const blurId = `blur-${seed}`;

    // Gradient Definition
    // We use 'white' and 'currentColor' placeholders which will be replaced by the injector
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

    // Orb Shape
    const orb = `
        <circle cx="100" cy="100" r="60" fill="url(#${id})" />
        <circle cx="70" cy="70" r="20" fill="white" opacity="0.3" filter="url(#${blurId})" />
    `;

    // Text Overlay (Minimal)
    const text = `
        <text x="100" y="105" font-family="sans-serif" font-weight="bold" font-size="60" text-anchor="middle" fill="white" fill-opacity="0.9">${brandName[0]}</text>
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${orb}${text}</svg>`;
};

// 3. NEGATIVE SPACE / CUTOUT (The "Artifact" example)
export const generateNegativeSpace = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const maskId = `mask-${seed}`;

    // Container Shape
    const containerType = seed % 3;
    let path = '';
    // 0: Squircle, 1: Circle, 2: Hexagon
    if (containerType === 0) path = `<rect x="20" y="20" width="160" height="160" rx="40" fill="currentColor" mask="url(#${maskId})" />`;
    else if (containerType === 1) path = `<circle cx="100" cy="100" r="80" fill="currentColor" mask="url(#${maskId})" />`;
    else path = `<path d="M50 20 L150 20 L190 100 L150 180 L50 180 L10 100 Z" fill="currentColor" mask="url(#${maskId})" />`;

    const defs = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                <text x="100" y="135" font-family="sans-serif" font-weight="900" font-size="100" text-anchor="middle" fill="black">${brandName[0]}</text>
                <!-- Optional Slash -->
                ${seed % 2 === 0 ? '<path d="M0 200 L200 0" stroke="black" stroke-width="20" />' : ''}
            </mask>
        </defs>
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${path}</svg>`;
};

// 4. SWISS MINIMAL (The "Atome" example)
export const generateSwissMinimal = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const initial = brandName[0];

    // Bold geometric abstract shape
    // Example: Triangle with circle
    const shapes = `
        <path d="M100 20 L180 180 L20 180 Z" fill="currentColor" />
        <circle cx="100" cy="120" r="30" fill="white" /> 
    `;

    // Or A-shape
    const aShape = `
        <path d="M50 180 L50 140 L100 40 L150 140 L150 180 L120 180 L100 140 L80 180 Z" fill="currentColor" />
        <path d="M20 140 A 40 40 0 0 1 100 100 A 40 40 0 0 1 180 140" fill="none" stroke="currentColor" stroke-width="20" stroke-linecap="round" />
    `;

    const selectedShape = seed % 2 === 0 ? shapes : aShape;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${selectedShape}</svg>`;
};
