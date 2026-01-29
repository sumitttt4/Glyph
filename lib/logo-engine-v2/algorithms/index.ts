
import { generateInterlocking } from './interlocking';
import { generateLetterFusion } from './letter-fusion';
// Helper to implement remaining stubs quickly

import { InfiniteLogoParams } from '../types';

export const ALGORITHMS = [
    { name: 'Letter Fusion', fn: generateLetterFusion },
    { name: 'Interlocking Geometry', fn: generateInterlocking }, // 3 shapes weaving like Anchortack
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
