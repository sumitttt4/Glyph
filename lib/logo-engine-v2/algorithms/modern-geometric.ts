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

// 1. VIXEL FLOW (Flowing Ribbons / Abstract V-shapes)
// Inspired by the "Vixel" and "Xeratech" examples
export const generateVixelFlow = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const count = 4; // 4-arm symmetry is common in these styles
    const center = 100;

    // Determine shape variant
    const variant = seed % 3;

    // Generate the path for a single blade/arm
    let bladePath = '';

    if (variant === 0) {
        // Soft Curve (Like Vixel)
        // A 'U' shape rotated 45 degrees
        bladePath = `M 100 100 L 100 40 A 20 20 0 0 1 140 40 L 140 80`;
    } else if (variant === 1) {
        // Sharp Hook (Like Xeratech)
        bladePath = `M 100 100 L 100 30 L 140 30 L 140 70 L 120 70 L 120 50 L 120 50`;
    } else {
        // Quarter Circle Flow
        bladePath = `M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z`;
    }

    // Generate rotated copies
    let paths = '';
    const rotationOffset = 45; // Bias for dynamic look

    for (let i = 0; i < count; i++) {
        const angle = (i * (360 / count)) + rotationOffset;
        // Check if we alternate opacity for depth effect
        const opacity = 0.8 + (i % 2) * 0.2;

        paths += `
            <g transform="rotate(${angle}, ${center}, ${center})">
                <path d="${bladePath}" fill="currentColor" opacity="${opacity}" />
            </g>
        `;
    }

    // Central negative space or accent
    const centerAccent = seed % 2 === 0 ?
        `<circle cx="${center}" cy="${center}" r="15" fill="white" />` : '';

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${paths}${centerAccent}</svg>`;
};

// 2. GEOMETRIC WEAVE (Interlocking Grid)
// Inspired by "Quran Reading Circle" and Medical Cross
export const generateGeometricWeave = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const center = 100;

    // Weave Pattern: Cross shape with interlocks
    // We create 'L' shapes that look like they weave

    const size = 60;
    const thickness = 20;
    const gap = 4; // Gap for "weaving" effect

    // L-Shape Path
    const lShape = `M 0 0 L ${size} 0 L ${size} ${thickness} L ${thickness} ${thickness} L ${thickness} ${size} L 0 ${size} Z`;

    let paths = '';

    // 4 rotated Ls forming a square/cross
    // We offset them slightly to create the weave center
    const offset = thickness / 2 + gap;

    for (let i = 0; i < 4; i++) {
        const angle = i * 90;
        // Calculate position based on rotation to keep it centered
        // Each L is placed in a quadrant

        paths += `
            <g transform="translate(${center}, ${center}) rotate(${angle})">
                <g transform="translate(${gap}, ${gap})">
                     <path d="${lShape}" fill="currentColor" />
                </g>
            </g>
        `;
    }

    // Central diamond accent if needed
    const diamond = `
        <rect x="${center - 10}" y="${center - 10}" width="20" height="20" fill="white" transform="rotate(45, ${center}, ${center})" />
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${paths}${seed % 3 === 0 ? diamond : ''}</svg>`;
};

// 3. RADIAL PINWHEEL (Modern Tech)
// Inspired by the blue square-ish icon
export const generateRadialPinwheel = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const center = 100;

    // Number of blades: 3, 4, 5, 6
    const bladeCount = 3 + (seed % 4);

    // Blade Shape
    // A curved "shark fin" or angular slice
    const bladeVariant = seed % 2;
    let bladePath = '';

    if (bladeVariant === 0) {
        // Angular Fin
        bladePath = `M 100 100 L 100 20 L 150 50 L 130 100 Z`;
    } else {
        // Curved Fin (Turbine)
        bladePath = `M 100 100 Q 130 50 160 20 L 160 80 Q 130 90 100 100 Z`;
    }

    let paths = '';

    for (let i = 0; i < bladeCount; i++) {
        const angle = i * (360 / bladeCount);
        // Vary opacity for motion effect
        const opacity = 1.0 - (i * 0.15); // Gradient fade around the circle

        paths += `
            <g transform="rotate(${angle}, ${center}, ${center})">
                <path d="${bladePath}" fill="currentColor" fill-opacity="${0.6 + (i % 2) * 0.4}" />
            </g>
        `;
    }

    // Optional center cutout
    const cutout = `<circle cx="${center}" cy="${center}" r="15" fill="white" />`;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${paths}${cutout}</svg>`;
};
