
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

// =============================================
// CREATIVE GEOMETRY SERIES
// Sculptural, "Soft Tech", and Heavy Industrial blocks
// UPDATED: Uses Masks for proper negative space
// =============================================

// 1. BIO GEO (The "Blob" Style)
export const generateBioGeo = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const maskId = `bio-mask-${seed}`;

    // Points
    const p1 = { x: 100, y: 30 };
    const p2 = { x: 170, y: 160 };
    const p3 = { x: 30, y: 160 };

    const style = seed % 3;
    let mainPath = '';
    let negativeShape = '';

    if (style === 0) {
        // "The Triangle Blob"
        mainPath = `M100,30 Q140,30 150,70 Q170,120 170,160 Q120,160 100,120 Q80,160 30,160 Q30,120 50,70 Q60,30 100,30 Z`;
        negativeShape = `<circle cx="100" cy="100" r="15" fill="black" />`;
    } else if (style === 1) {
        // "The Three-Lobe"
        mainPath = `M100,80 Q130,50 160,80 Q150,130 110,140 Q70,150 50,100 Q60,50 100,80 Z`;
        // Complex negative space for spinner
        negativeShape = `<circle cx="100" cy="110" r="20" fill="black" />`;
    } else {
        // "Cell Division"
        mainPath = `M40,80 Q40,160 120,160 L120,120 Q80,120 80,80 Z`;
        negativeShape = `<circle cx="100" cy="100" r="15" fill="black" />`;
    }

    // Additional Positive Shapes for Style 1 & 2
    let extraShapes = '';
    if (style === 1) {
        extraShapes = `
             <circle cx="100" cy="70" r="40" fill="currentColor" mask="url(#${maskId})" />
             <circle cx="130" cy="130" r="40" fill="currentColor" mask="url(#${maskId})" />
             <circle cx="70" cy="130" r="40" fill="currentColor" mask="url(#${maskId})" />
         `;
        // The mainPath is actually used as a transform base in the original, 
        // but here let's simplify to just the circles logic or keep original
        // Original: transform="rotate(${seed % 360}, 100, 100) scale(1.2)"
        // We'll apply the mask to everything.
    }
    if (style === 2) {
        extraShapes = `
            <circle cx="80" cy="80" r="50" fill="currentColor" mask="url(#${maskId})" />
            <circle cx="120" cy="120" r="50" fill="currentColor" mask="url(#${maskId})" />
        `;
    }

    // Defs with Mask
    const defs = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                ${negativeShape}
            </mask>
        </defs>
    `;

    // Render
    // If Style 0: Path with Mask
    // If Style 1/2: ExtraShapes with Mask + Path with Mask

    if (style === 0) {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}<path d="${mainPath}" fill="currentColor" mask="url(#${maskId})" /></svg>`;
    } else if (style === 1) {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}
            <path d="${mainPath}" fill="currentColor" transform="rotate(${seed % 360}, 100, 100) scale(1.2)" mask="url(#${maskId})" />
            ${extraShapes}
         </svg>`;
    } else {
        return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}
            ${extraShapes}
            <path d="${mainPath}" fill="currentColor" mask="url(#${maskId})" />
        </svg>`;
    }
};

// 2. SWISS BLOCK
// Already used masks, but reinforcing logic
export const generateSwissBlock = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const maskId = `block-mask-${seed}`;

    const style = seed % 3;
    let mainShape = '';
    let cutout = '';

    if (style === 0) {
        // Forge Style
        mainShape = `<rect x="40" y="40" width="120" height="120" fill="currentColor" mask="url(#${maskId})" />`;
        cutout = `<path d="M100,20 L130,80 L100,100 L110,160 L80,100 L110,80 Z" fill="black" transform="rotate(-15, 100, 100)" />`;
    } else if (style === 1) {
        // Heavy Corner with Circle Cutout
        // Original implementation used stroke="white" separately. 
        // We change to Mask for transparency.
        mainShape = `
            <path d="M40,40 L160,40 L160,100 L100,100 L100,160 L40,160 Z" fill="currentColor" mask="url(#${maskId})" />
        `;
        cutout = `<circle cx="100" cy="100" r="25" fill="black" />`;
    } else {
        // Offset Blocks
        // Original used fill="white" for separation.
        mainShape = `
             <rect x="50" y="50" width="60" height="60" fill="currentColor" mask="url(#${maskId})" />
             <rect x="90" y="90" width="60" height="60" fill="currentColor" opacity="0.8" mask="url(#${maskId})" />
        `;
        // Negative separation as a black stroke/rect in mask
        cutout = `
            <rect x="70" y="70" width="60" height="60" fill="black" />
            <rect x="75" y="75" width="50" height="50" fill="white" /> <!-- Restore the inner block? No, simpler mask -->
        `;
        // Style 3 is complex to mask perfectly without layers. 
        // Simplified: Two blocks, one cuts the other.
        // We'll just define the cutout as the void.
    }

    const defs = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                ${cutout}
            </mask>
        </defs>
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${mainShape}${style === 2 ? `<rect x="75" y="75" width="50" height="50" fill="currentColor" />` : ''}</svg>`;
};

// 3. CHUNKY GLYPH
// Strokes are naturally transparent in gaps. No change needed unless it uses 'white' fills.
export const generateChunkyGlyph = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const strokeW = 45;
    const style = seed % 3;
    let path = '';

    if (style === 0) {
        path = `<path d="M50,50 L150,50 L50,150 L150,150" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="square" stroke-linejoin="round" />`;
    } else if (style === 1) {
        path = `<path d="M70,160 L70,40 L130,40 L130,100 L70,100" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="square" stroke-linejoin="round" />`;
    } else {
        path = `<path d="M150,50 L90,50 Q50,50 50,90 T90,130 L150,130" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" />`;
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${path}</svg>`;
};
