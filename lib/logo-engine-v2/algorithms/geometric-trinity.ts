
import { InfiniteLogoParams } from '../types';

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
// GEOMETRIC TRINITY SERIES
// UPDATED: Uses Masks
// =============================================

// 1. TRINITY LOOP
export const generateTrinityKnot = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const maskId = `trinity-mask-${seed}`;
    const center = 100;
    const r = 40;

    const getPoint = (angleDeg: number, dist: number) => {
        const rad = (angleDeg - 90) * (Math.PI / 180);
        return { x: center + dist * Math.cos(rad), y: center + dist * Math.sin(rad) };
    };

    const p1 = getPoint(0, r);
    const p2 = getPoint(120, r);
    const p3 = getPoint(240, r);

    const style = seed % 3;
    let paths = '';
    let negativeShape = '';

    if (style === 0) {
        // Connected Circles
        paths = `
            <circle cx="${p1.x}" cy="${p1.y}" r="35" fill="currentColor" mask="url(#${maskId})" />
            <circle cx="${p2.x}" cy="${p2.y}" r="35" fill="currentColor" mask="url(#${maskId})" />
            <circle cx="${p3.x}" cy="${p3.y}" r="35" fill="currentColor" mask="url(#${maskId})" />
        `;
        // Void in center + spokes
        negativeShape = `
            <circle cx="${center}" cy="${center}" r="15" fill="black" />
            <path d="M${p1.x},${p1.y} L${center},${center} M${p2.x},${p2.y} L${center},${center} M${p3.x},${p3.y} L${center},${center}" stroke="black" stroke-width="8" />
        `;
    } else if (style === 1) {
        // Fluid Triangle
        paths = `
            <path d="M${p1.x},${p1.y} Q${center},${center} ${p2.x},${p2.y} Q${center},${center} ${p3.x},${p3.y} Q${center},${center} ${p1.x},${p1.y}" stroke="currentColor" stroke-width="35" stroke-linecap="round" stroke-linejoin="round" fill="none" mask="url(#${maskId})" />
            <circle cx="${center}" cy="${center}" r="15" fill="currentColor" mask="url(#${maskId})" /> 
        `;
        // No negative mask needed if fill is none, but let's ensure center clear
        negativeShape = ``;
    } else {
        // Orbital Nodes
        paths = `
            <g transform="rotate(${seed % 60}, 100, 100)">
                <circle cx="${p1.x}" cy="${p1.y}" r="25" fill="currentColor" />
                <circle cx="${p2.x}" cy="${p2.y}" r="25" fill="currentColor" />
                <circle cx="${p3.x}" cy="${p3.y}" r="25" fill="currentColor" />
                <circle cx="${center}" cy="${center}" r="45" stroke="currentColor" stroke-width="8" fill="none" />
            </g>
        `;
    }

    const defs = negativeShape ? `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                ${negativeShape}
            </mask>
        </defs>
    ` : '';

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${paths}</svg>`;
};

// 2. CUBIC WEAVE
export const generateCubicHexagon = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const maskId = `cube-mask-${seed}`;

    const c = { x: 100, y: 100 };
    const t = { x: 100, y: 20 };
    const tr = { x: 169, y: 60 };
    const br = { x: 169, y: 140 };
    const bl = { x: 31, y: 140 };
    const tl = { x: 31, y: 60 }; // Fixed coordinate

    const style = seed % 3;
    let paths = '';
    let negativeShape = '';

    if (style === 0) {
        // Classic Cube
        paths = `
            <path d="M${c.x},${c.y} L${tr.x},${tr.y} L${t.x},${t.y} L${tl.x},${tl.y} Z" fill="currentColor" opacity="1.0" mask="url(#${maskId})" />
            <path d="M${c.x},${c.y} L${bl.x},${bl.y} L100,180 L${br.x},${br.y} Z" fill="currentColor" opacity="0.6" mask="url(#${maskId})" />
            <path d="M${c.x},${c.y} L${tl.x},${tl.y} L${bl.x},${bl.y} Z" fill="currentColor" opacity="0.8" mask="url(#${maskId})" />
            <path d="M${c.x},${c.y} L${tr.x},${tr.y} L${br.x},${br.y} Z" fill="currentColor" opacity="0.8" mask="url(#${maskId})" />
        `;
        // Cuts
        negativeShape = `
             <path d="M${c.x},${c.y} L${t.x},${t.y}" stroke="black" stroke-width="8" />
             <path d="M${c.x},${c.y} L${bl.x},${bl.y}" stroke="black" stroke-width="8" />
             <path d="M${c.x},${c.y} L${br.x},${br.y}" stroke="black" stroke-width="8" />
        `;
    } else if (style === 1) {
        // Hollow Hexagon
        paths = `
            <path d="M${t.x},${t.y} L${tr.x},${tr.y} L${br.x},${br.y} L100,180 L${bl.x},${bl.y} L${tl.x},${tl.y} Z" fill="none" stroke="currentColor" stroke-width="30" stroke-linejoin="round" mask="url(#${maskId})" />
        `;
        negativeShape = `<path d="M${c.x},${c.y + 10} L${c.x - 40},${c.y - 60} L${c.x + 40},${c.y - 60} Z" fill="black" transform="rotate(${seed % 2 === 0 ? 0 : 60}, 100, 100)" />`;
    } else {
        // Folded Ribbon
        paths = `
              <path d="M100,100 L100,20 L170,60 L100,100" fill="currentColor" opacity="0.9" mask="url(#${maskId})" />
              <path d="M100,100 L170,60 L170,140 L100,100" fill="currentColor" opacity="0.7" mask="url(#${maskId})" />
              <path d="M100,100 L170,140 L100,180 L100,100" fill="currentColor" opacity="0.5" mask="url(#${maskId})" />
              <path d="M100,100 L100,180 L30,140 L100,100" fill="currentColor" opacity="0.7" mask="url(#${maskId})" />
              <path d="M100,100 L30,140 L30,60 L100,100" fill="currentColor" opacity="0.9" mask="url(#${maskId})" />
              <path d="M100,100 L30,60 L100,20 L100,100" fill="currentColor" opacity="0.5" mask="url(#${maskId})" />
        `;
        negativeShape = `<circle cx="100" cy="100" r="15" fill="black" />`;
    }

    const defs = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                ${negativeShape}
            </mask>
        </defs>
    `;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${paths}</svg>`;
};

// 3. ARROWHEAD CORE
export const generateArrowheadStack = (params: InfiniteLogoParams, brandName: string) => {
    const seed = getHash(brandName);
    const maskId = `arrow-mask-${seed}`;

    const style = seed % 3;
    let paths = '';
    let negativeShape = '';

    if (style === 0) {
        // Main Arrow with Void
        paths = `<path d="M100,20 L180,180 L20,180 Z" fill="currentColor" mask="url(#${maskId})" />`;
        negativeShape = `
             <path d="M100,80 L140,160 L60,160 Z" fill="black" />
             <rect x="90" y="160" width="20" height="40" fill="black" />
        `;
    } else if (style === 1) {
        // Triple Stack
        paths = `
            <path d="M100,20 L150,70 L100,120 L50,70 Z" fill="currentColor" opacity="0.4" />
            <path d="M100,60 L150,110 L100,160 L50,110 Z" fill="currentColor" opacity="0.7" />
            <path d="M100,100 L150,150 L100,200 L50,150 Z" fill="currentColor" opacity="1.0" />
        `;
        // No mask needed
    } else {
        // Play Button
        paths = `
            <path d="M40,20 L140,100 L40,180 Z" fill="currentColor" mask="url(#${maskId})" />
            <path d="M140,100 L180,100 L160,80 Z" fill="currentColor" opacity="0.5" />
        `;
        negativeShape = `<path d="M40,20 L80,100 L40,180 L20,100 Z" fill="black" opacity="0.5" />`; // Partial fade or full? Hard cut.
    }

    const defs = negativeShape ? `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="200" height="200" fill="white" />
                ${negativeShape}
            </mask>
        </defs>
    ` : '';

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">${defs}${paths}</svg>`;
};
