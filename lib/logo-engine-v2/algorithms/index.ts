
import { generateInterlocking } from './interlocking';
import { generateLetterFusion } from './letter-fusion';
import {
    generateModular,
    generateStencil,
    generateOutline,
    generateGeometricConstruction,
    generateCalligraphic,
    generateMonoline,
    generateShadowLetter,
    generateDottedSkeleton,
    SKELETON_TECHNIQUES,
    getAvailableTechniques,
    generateWithTechnique,
} from './skeleton-techniques';

// Re-export skeleton techniques for external use
export {
    SKELETON_TECHNIQUES,
    getAvailableTechniques,
    generateWithTechnique,
    generateModular,
    generateStencil,
    generateOutline,
    generateGeometricConstruction,
    generateCalligraphic,
    generateMonoline,
    generateShadowLetter,
    generateDottedSkeleton,
};

import { InfiniteLogoParams } from '../types';

export const ALGORITHMS = [
    { name: 'Letter Fusion', fn: generateLetterFusion },
    { name: 'Interlocking Geometry', fn: generateInterlocking }, // 3 shapes weaving like Anchortack

    // Skeleton-based techniques (proper typography anatomy)
    { name: 'Modular Units', fn: generateModular, description: 'Geometric units placed at skeleton anchor points' },
    { name: 'Stencil Cut', fn: generateStencil, description: 'Letter with cut gaps for stencil effect' },
    { name: 'Multi-Outline', fn: generateOutline, description: 'Multiple parallel strokes following skeleton' },
    { name: 'Geometric Construction', fn: generateGeometricConstruction, description: 'Built from skeleton with geometric primitives' },
    { name: 'Calligraphic Stroke', fn: generateCalligraphic, description: 'Variable width calligraphic rendering' },
    { name: 'Monoline Letter', fn: generateMonoline, description: 'Single continuous stroke skeleton' },
    { name: 'Shadow Depth', fn: generateShadowLetter, description: 'Skeleton with layered shadow effect' },
    { name: 'Dotted Path', fn: generateDottedSkeleton, description: 'Skeleton rendered with dotted/dashed stroke' },
    {
        name: 'Negative Space Letter',
        fn: (p: InfiniteLogoParams, b: string) => `
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <mask id="cutout-${b}">
                    <rect width="200" height="200" fill="white"/>
                    <text x="100" y="150" font-size="150" font-weight="900" text-anchor="middle" fill="black">${b.charAt(0)}</text>
                </mask>
            </defs>
            <rect width="200" height="200" fill="currentColor" mask="url(#cutout-${b})"/>
        </svg>`
    },
    {
        name: 'Single Stroke',
        fn: (p: InfiniteLogoParams, b: string) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><path d="M50 100 Q100 0 150 100 T250 100" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}" stroke-linecap="round"/></svg>`
    },
    {
        name: 'Radial Clover',
        fn: generateInterlocking // Re-use simpler
    },
    {
        name: 'Gradient Glow',
        fn: (p: InfiniteLogoParams, b: string) => `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs><filter id="glow"><feGaussianBlur stdDeviation="5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><circle cx="100" cy="100" r="${50 * p.scaleVariance}" fill="none" stroke="currentColor" stroke-width="10" filter="url(#glow)"/></svg>`
    }
];
