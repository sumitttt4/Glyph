
import { InfiniteLogoParams } from '../types';

// Helper for seeded randomness
const getHash = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
};

// ==========================================
// 1. TRIANGLE MONOGRAMS (A, V, M, W)
// ==========================================
export const generateTriangleMonogram = (params: InfiniteLogoParams, brandName: string) => {
    const initial = brandName.charAt(0).toUpperCase();
    const seed = getHash(brandName);

    let path = '';

    // Triangle pointing UP (A, M) vs DOWN (V, W)
    const isUp = ['A', 'M', 'H'].includes(initial); // H can be abstract triangle too

    if (initial === 'A') {
        // Variant 1: Solid Triangle with bottom cut (The "Star Trek" / Modern A look)
        if (seed % 2 === 0) {
            path = `
                <path d="M100 20 L20 180 L180 180 Z" fill="currentColor" />
                <circle cx="100" cy="140" r="30" fill="white" /> <!-- Negative space hole -->
                <rect x="90" y="120" width="20" height="80" fill="white" transform="rotate(0, 100, 140)" /> <!-- Cutout stem -->
            `;
        } else {
            // Variant 2: Chevron Style 'A'
            path = `
                <path d="M100 20 L180 180 L140 180 L100 80 L60 180 L20 180 Z" fill="currentColor" />
                <rect x="70" y="130" width="60" height="20" fill="currentColor" /> <!-- Crossbar -->
            `;
        }
    } else if (initial === 'V') {
        // Inverted Triangle
        path = `
            <path d="M20 20 L100 180 L180 20 L140 20 L100 120 L60 20 Z" fill="currentColor" />
        `;
    } else {
        // Fallback for other letters (Generic Triangle)
        // Just a cool abstract triangle shape
        path = `
            <path d="M100 20 L180 180 L20 180 Z" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth * 4 + 10}" stroke-linejoin="round" />
            <circle cx="100" cy="110" r="20" fill="currentColor" />
        `;
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <mask id="cut-${seed}">
                <rect width="200" height="200" fill="white" />
                <!-- Add dynamic cuts based on seed -->
            </mask>
        </defs>
        <g transform="rotate(${params.rotation}, 100, 100)">
            ${path}
        </g>
    </svg>`;
};

// ==========================================
// 2. CIRCULAR MONOGRAMS (C, O, G, Q, D)
// ==========================================
export const generateCircularMonogram = (params: InfiniteLogoParams, brandName: string) => {
    const initial = brandName.charAt(0).toUpperCase();
    const seed = getHash(brandName);
    const strokeW = 20 + params.strokeWidth * 2;

    let contents = '';

    if (initial === 'C' || initial === 'G') {
        // Tech Ring (C shape)
        const gapAngle = initial === 'C' ? 60 : 90;
        const rotation = initial === 'C' ? 90 : 45;

        // Simulating a C with a thick stroke dasharray
        // But for cleaner geometry, we use path
        contents = `
            <!-- Main Ring -->
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-dasharray="350" stroke-dashoffset="${gapAngle}" transform="rotate(${rotation}, 100, 100)" stroke-linecap="round" />
            
            ${initial === 'G' ? `<rect x="90" y="90" width="50" height="${strokeW}" fill="currentColor" />` : ''} <!-- G Bar -->
        `;
    } else if (initial === 'O' || initial === 'Q') {
        // Split Circle
        contents = `
             <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="${strokeW}" />
             ${initial === 'Q' ? `<rect x="110" y="110" width="30" height="60" transform="rotate(-45, 125, 140)" fill="currentColor" />` : ''}
        `;

        if (seed % 2 === 0) {
            // "Target" style
            contents += `<circle cx="100" cy="100" r="${30 - params.strokeWidth}" fill="currentColor" />`;
        }
    } else {
        // Abstract Circular
        contents = `
            <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" stroke-width="${strokeW}" />
            <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.5" />
        `;
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(${params.rotation}, 100, 100)">
            ${contents}
        </g>
    </svg>`;
};

// ==========================================
// 3. GRID / RECTANGULAR MONOGRAMS (H, E, F, L, T, I)
// ==========================================
export const generateGridMonogram = (params: InfiniteLogoParams, brandName: string) => {
    const initial = brandName.charAt(0).toUpperCase();

    let path = '';

    if (initial === 'H') {
        // The "H" fix - Bold columns, thin connector, or negative space
        // Variant 1: Sturdy Block H
        path = `
            <rect x="40" y="30" width="40" height="140" fill="currentColor" rx="5" />
            <rect x="120" y="30" width="40" height="140" fill="currentColor" rx="5" />
            <rect x="40" y="90" width="120" height="20" fill="currentColor" />
        `;
    } else if (['E', 'F', 'L'].includes(initial)) {
        // Block letters
        path = `
            <rect x="40" y="30" width="40" height="140" fill="currentColor" />
            <rect x="40" y="30" width="100" height="30" fill="currentColor" /> <!-- Top -->
            <rect x="40" y="140" width="${initial === 'L' ? 100 : 40}" height="30" fill="currentColor" /> <!-- Bottom -->
            ${initial !== 'L' ? `<rect x="40" y="85" width="80" height="30" fill="currentColor" />` : ''} <!-- Middle -->
        `;
    } else {
        // Fallback Abstract Grid
        path = `
            <rect x="50" y="50" width="100" height="100" fill="none" stroke="currentColor" stroke-width="20" />
            <rect x="90" y="90" width="20" height="20" fill="currentColor" />
        `;
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(${params.rotation}, 100, 100)">
            ${path}
        </g>
    </svg>`;
};
