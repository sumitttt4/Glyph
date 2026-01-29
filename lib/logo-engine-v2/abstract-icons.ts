/**
 * Abstract Icon Generation System
 * 
 * Generates symbol-only logos for brands wanting icons (no letters).
 * Based on brand category + keywords, combines 2-3 primitives max.
 * 
 * Features:
 * - Icon primitives library (geometric shapes)
 * - Semantic compositions by meaning (speed, growth, connect, etc.)
 * - Golden ratio spacing and composition rules
 * - Variation parameters for infinite uniqueness
 * - Works at 16px minimum
 */

import { InfiniteLogoParams } from './types';

// ============================================
// CONSTANTS
// ============================================

const GOLDEN_RATIO = 1.618;
const VIEWBOX_SIZE = 200;
const CENTER = VIEWBOX_SIZE / 2;

// ============================================
// ICON PRIMITIVES
// ============================================

interface PrimitiveOptions {
    x?: number;
    y?: number;
    size?: number;
    rotation?: number;
    strokeWidth?: number;
    fill?: boolean;
    cornerRadius?: number;
    opacity?: number;
}

/**
 * Circle primitive
 */
function circle(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, fill = true, strokeWidth = 4, opacity = 1 } = opts;
    return fill
        ? `<circle cx="${x}" cy="${y}" r="${size}" fill="currentColor" opacity="${opacity}"/>`
        : `<circle cx="${x}" cy="${y}" r="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" opacity="${opacity}"/>`;
}

/**
 * Semi-circle primitive
 */
function semiCircle(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, rotation = 0, fill = true, strokeWidth = 4, opacity = 1 } = opts;
    const path = `M ${x - size} ${y} A ${size} ${size} 0 0 1 ${x + size} ${y}`;
    return fill
        ? `<path d="${path} Z" fill="currentColor" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`
        : `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Quarter circle primitive
 */
function quarterCircle(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, rotation = 0, fill = true, strokeWidth = 4, opacity = 1 } = opts;
    const path = `M ${x} ${y} L ${x + size} ${y} A ${size} ${size} 0 0 0 ${x} ${y - size} Z`;
    return fill
        ? `<path d="${path}" fill="currentColor" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`
        : `<path d="M ${x + size} ${y} A ${size} ${size} 0 0 0 ${x} ${y - size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Ring (hollow circle) primitive
 */
function ring(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, strokeWidth = 8, opacity = 1 } = opts;
    return `<circle cx="${x}" cy="${y}" r="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" opacity="${opacity}"/>`;
}

/**
 * Square primitive
 */
function square(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, rotation = 0, fill = true, strokeWidth = 4, cornerRadius = 0, opacity = 1 } = opts;
    const half = size / 2;
    return fill
        ? `<rect x="${x - half}" y="${y - half}" width="${size}" height="${size}" rx="${cornerRadius}" fill="currentColor" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`
        : `<rect x="${x - half}" y="${y - half}" width="${size}" height="${size}" rx="${cornerRadius}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Rectangle primitive
 */
function rectangle(opts: PrimitiveOptions & { aspectRatio?: number } = {}): string {
    const { x = CENTER, y = CENTER, size = 40, aspectRatio = 1.5, rotation = 0, fill = true, strokeWidth = 4, cornerRadius = 0, opacity = 1 } = opts;
    const width = size * aspectRatio;
    const height = size;
    return fill
        ? `<rect x="${x - width / 2}" y="${y - height / 2}" width="${width}" height="${height}" rx="${cornerRadius}" fill="currentColor" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`
        : `<rect x="${x - width / 2}" y="${y - height / 2}" width="${width}" height="${height}" rx="${cornerRadius}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Triangle primitive
 */
function triangle(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, rotation = 0, fill = true, strokeWidth = 4, opacity = 1 } = opts;
    const h = size * 0.866; // height of equilateral triangle
    const path = `M ${x} ${y - h * 0.67} L ${x + size / 2} ${y + h * 0.33} L ${x - size / 2} ${y + h * 0.33} Z`;
    return fill
        ? `<path d="${path}" fill="currentColor" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`
        : `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linejoin="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Arrow primitive
 */
function arrow(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, rotation = 0, strokeWidth = 6, opacity = 1 } = opts;
    const half = size / 2;
    const path = `M ${x - half} ${y} L ${x + half} ${y} M ${x + half * 0.3} ${y - half * 0.5} L ${x + half} ${y} L ${x + half * 0.3} ${y + half * 0.5}`;
    return `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Chevron primitive
 */
function chevron(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 30, rotation = 0, strokeWidth = 6, opacity = 1 } = opts;
    const path = `M ${x - size / 2} ${y + size / 3} L ${x} ${y - size / 3} L ${x + size / 2} ${y + size / 3}`;
    return `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Line primitive
 */
function line(opts: PrimitiveOptions & { length?: number } = {}): string {
    const { x = CENTER, y = CENTER, length = 60, rotation = 0, strokeWidth = 6, opacity = 1 } = opts;
    const half = length / 2;
    return `<line x1="${x - half}" y1="${y}" x2="${x + half}" y2="${y}" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Arc primitive
 */
function arc(opts: PrimitiveOptions & { sweep?: number } = {}): string {
    const { x = CENTER, y = CENTER, size = 40, sweep = 90, rotation = 0, strokeWidth = 6, opacity = 1 } = opts;
    const startAngle = -sweep / 2;
    const endAngle = sweep / 2;
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    const x1 = x + size * Math.cos(startRad);
    const y1 = y + size * Math.sin(startRad);
    const x2 = x + size * Math.cos(endRad);
    const y2 = y + size * Math.sin(endRad);
    const largeArc = sweep > 180 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${size} ${size} 0 ${largeArc} 1 ${x2} ${y2}`;
    return `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Wave primitive
 */
function wave(opts: PrimitiveOptions & { waves?: number } = {}): string {
    const { x = CENTER, y = CENTER, size = 60, waves = 2, rotation = 0, strokeWidth = 5, opacity = 1 } = opts;
    const amplitude = size / 6;
    const waveWidth = size / waves;
    let path = `M ${x - size / 2} ${y}`;
    for (let i = 0; i < waves; i++) {
        const xStart = x - size / 2 + i * waveWidth;
        const xMid = xStart + waveWidth / 2;
        const xEnd = xStart + waveWidth;
        const dir = i % 2 === 0 ? -1 : 1;
        path += ` Q ${xMid} ${y + amplitude * dir} ${xEnd} ${y}`;
    }
    return `<path d="${path}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Spiral primitive (simplified as circular arc)
 */
function spiral(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 40, rotation = 0, strokeWidth = 5, opacity = 1 } = opts;
    // Create a spiral effect with decreasing radius arcs
    const paths: string[] = [];
    for (let i = 0; i < 3; i++) {
        const r = size - i * 10;
        const startAngle = i * 120;
        const endAngle = startAngle + 240;
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const x1 = x + r * Math.cos(startRad);
        const y1 = y + r * Math.sin(startRad);
        const x2 = x + (r - 5) * Math.cos(endRad);
        const y2 = y + (r - 5) * Math.sin(endRad);
        paths.push(`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`);
    }
    return `<path d="${paths.join(' ')}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" transform="rotate(${rotation}, ${x}, ${y})" opacity="${opacity}"/>`;
}

/**
 * Single dot primitive
 */
function dot(opts: PrimitiveOptions = {}): string {
    const { x = CENTER, y = CENTER, size = 10, opacity = 1 } = opts;
    return `<circle cx="${x}" cy="${y}" r="${size}" fill="currentColor" opacity="${opacity}"/>`;
}

/**
 * Dot grid primitive
 */
function dotGrid(opts: PrimitiveOptions & { cols?: number; rows?: number; gap?: number } = {}): string {
    const { x = CENTER, y = CENTER, size = 6, cols = 3, rows = 3, gap = 20, opacity = 1 } = opts;
    const startX = x - ((cols - 1) * gap) / 2;
    const startY = y - ((rows - 1) * gap) / 2;
    let dots = '';
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            dots += `<circle cx="${startX + col * gap}" cy="${startY + row * gap}" r="${size}" fill="currentColor" opacity="${opacity}"/>`;
        }
    }
    return dots;
}

/**
 * Dot pattern (triangular/radial)
 */
function dotPattern(opts: PrimitiveOptions & { count?: number } = {}): string {
    const { x = CENTER, y = CENTER, size = 5, count = 6, opacity = 1 } = opts;
    let dots = '';
    const radius = 30;
    for (let i = 0; i < count; i++) {
        const angle = (i * 360 / count) * Math.PI / 180;
        const dx = x + radius * Math.cos(angle);
        const dy = y + radius * Math.sin(angle);
        dots += `<circle cx="${dx}" cy="${dy}" r="${size}" fill="currentColor" opacity="${opacity}"/>`;
    }
    // Center dot
    dots += `<circle cx="${x}" cy="${y}" r="${size * 1.2}" fill="currentColor" opacity="${opacity}"/>`;
    return dots;
}

// ============================================
// SEMANTIC COMPOSITIONS
// ============================================

type CompositionFn = (params: InfiniteLogoParams, seed: number) => string;

/**
 * SPEED/MOTION compositions
 */
const speedCompositions: CompositionFn[] = [
    // Stacked chevrons
    (p, seed) => {
        const spacing = 18 + (seed % 10);
        return `
      ${chevron({ y: CENTER - spacing, size: 35, strokeWidth: p.strokeWidth * 2 })}
      ${chevron({ y: CENTER, size: 35, strokeWidth: p.strokeWidth * 2, opacity: 0.7 })}
      ${chevron({ y: CENTER + spacing, size: 35, strokeWidth: p.strokeWidth * 2, opacity: 0.4 })}
    `;
    },
    // Parallel lines with offset
    (p, seed) => {
        const gap = 15 + (seed % 8);
        return `
      ${line({ y: CENTER - gap, length: 70, strokeWidth: p.strokeWidth * 2 })}
      ${line({ y: CENTER, length: 90, strokeWidth: p.strokeWidth * 2.5 })}
      ${line({ y: CENTER + gap, length: 70, strokeWidth: p.strokeWidth * 2 })}
    `;
    },
    // Arrow sequence
    (p, seed) => {
        return `
      ${arrow({ x: CENTER - 25, size: 35, strokeWidth: p.strokeWidth * 1.5, opacity: 0.5 })}
      ${arrow({ x: CENTER + 10, size: 50, strokeWidth: p.strokeWidth * 2 })}
    `;
    },
    // Motion blur lines
    (p, seed) => {
        const baseLen = 50 + (seed % 20);
        return `
      ${line({ x: CENTER - 15, y: CENTER - 20, length: baseLen * 0.6, strokeWidth: p.strokeWidth * 1.5, opacity: 0.4 })}
      ${line({ x: CENTER, y: CENTER, length: baseLen, strokeWidth: p.strokeWidth * 2.5 })}
      ${line({ x: CENTER - 15, y: CENTER + 20, length: baseLen * 0.6, strokeWidth: p.strokeWidth * 1.5, opacity: 0.4 })}
      ${triangle({ x: CENTER + 35, size: 30, rotation: 90, strokeWidth: p.strokeWidth * 2, fill: false })}
    `;
    },
];

/**
 * GROWTH/UP compositions
 */
const growthCompositions: CompositionFn[] = [
    // Ascending bars
    (p, seed) => {
        const barWidth = 12 + (seed % 6);
        const gap = barWidth + 8;
        return `
      ${rectangle({ x: CENTER - gap, y: CENTER + 20, size: 30, aspectRatio: 0.4, cornerRadius: p.cornerRadius })}
      ${rectangle({ x: CENTER, y: CENTER, size: 50, aspectRatio: 0.4, cornerRadius: p.cornerRadius })}
      ${rectangle({ x: CENTER + gap, y: CENTER - 20, size: 70, aspectRatio: 0.4, cornerRadius: p.cornerRadius })}
    `;
    },
    // Upward triangle
    (p, seed) => {
        return `
      ${triangle({ size: 70, fill: false, strokeWidth: p.strokeWidth * 2.5 })}
      ${line({ y: CENTER + 5, length: 40, strokeWidth: p.strokeWidth * 2, opacity: 0.6 })}
    `;
    },
    // Rising arc
    (p, seed) => {
        return `
      ${arc({ size: 50, sweep: 180, rotation: 0, strokeWidth: p.strokeWidth * 2.5 })}
      ${dot({ y: CENTER - 55, size: 8 })}
    `;
    },
    // Growth chart abstracted
    (p, seed) => {
        return `
      <path d="M 50 150 Q 80 130 100 100 T 150 50" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round"/>
      ${dot({ x: 150, y: 50, size: 10 })}
    `;
    },
];

/**
 * CONNECT/NETWORK compositions
 */
const connectCompositions: CompositionFn[] = [
    // Overlapping circles
    (p, seed) => {
        const offset = 25 + (seed % 10);
        return `
      ${ring({ x: CENTER - offset, size: 35, strokeWidth: p.strokeWidth * 2 })}
      ${ring({ x: CENTER + offset, size: 35, strokeWidth: p.strokeWidth * 2 })}
    `;
    },
    // Linked rings (chain)
    (p, seed) => {
        return `
      ${ring({ x: CENTER - 30, size: 28, strokeWidth: p.strokeWidth * 1.8 })}
      ${ring({ x: CENTER, size: 28, strokeWidth: p.strokeWidth * 1.8 })}
      ${ring({ x: CENTER + 30, size: 28, strokeWidth: p.strokeWidth * 1.8 })}
    `;
    },
    // Node + lines network
    (p, seed) => {
        return `
      <line x1="${CENTER - 40}" y1="${CENTER + 30}" x2="${CENTER}" y2="${CENTER}" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}"/>
      <line x1="${CENTER + 40}" y1="${CENTER + 30}" x2="${CENTER}" y2="${CENTER}" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}"/>
      <line x1="${CENTER}" y1="${CENTER - 45}" x2="${CENTER}" y2="${CENTER}" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}"/>
      ${dot({ x: CENTER, y: CENTER, size: 12 })}
      ${dot({ x: CENTER - 40, y: CENTER + 30, size: 8, opacity: 0.7 })}
      ${dot({ x: CENTER + 40, y: CENTER + 30, size: 8, opacity: 0.7 })}
      ${dot({ x: CENTER, y: CENTER - 45, size: 8, opacity: 0.7 })}
    `;
    },
    // Hub and spokes
    (p, seed) => {
        const spokes = 5 + (seed % 3);
        let lines = '';
        for (let i = 0; i < spokes; i++) {
            const angle = (i * 360 / spokes) * Math.PI / 180;
            const x2 = CENTER + 45 * Math.cos(angle);
            const y2 = CENTER + 45 * Math.sin(angle);
            lines += `<line x1="${CENTER}" y1="${CENTER}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" opacity="0.6"/>`;
            lines += `<circle cx="${x2}" cy="${y2}" r="6" fill="currentColor"/>`;
        }
        return `
      ${lines}
      ${circle({ size: 15, fill: true })}
    `;
    },
];

/**
 * SECURE/TRUST compositions
 */
const secureCompositions: CompositionFn[] = [
    // Shield outline
    (p, seed) => {
        return `
      <path d="M 100 40 L 150 60 L 150 110 Q 150 150 100 170 Q 50 150 50 110 L 50 60 Z" 
            fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linejoin="round"/>
    `;
    },
    // Lock shape abstracted
    (p, seed) => {
        return `
      ${arc({ y: CENTER - 25, size: 25, sweep: 180, rotation: 180, strokeWidth: p.strokeWidth * 2.5 })}
      ${square({ y: CENTER + 15, size: 55, cornerRadius: p.cornerRadius * 0.3, fill: false, strokeWidth: p.strokeWidth * 2.5 })}
    `;
    },
    // Closed circle with checkmark
    (p, seed) => {
        return `
      ${ring({ size: 55, strokeWidth: p.strokeWidth * 2 })}
      <path d="M 75 100 L 95 120 L 130 80" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round" stroke-linejoin="round"/>
    `;
    },
    // Concentric circles (fortress)
    (p, seed) => {
        return `
      ${ring({ size: 55, strokeWidth: p.strokeWidth * 1.5 })}
      ${ring({ size: 38, strokeWidth: p.strokeWidth * 1.5 })}
      ${dot({ size: 12 })}
    `;
    },
];

/**
 * TECH/DIGITAL compositions
 */
const techCompositions: CompositionFn[] = [
    // Pixel grid
    (p, seed) => {
        const gridSize = 3;
        const cellSize = 20;
        const gap = 4;
        let pixels = '';
        for (let row = 0; row < gridSize; row++) {
            for (let col = 0; col < gridSize; col++) {
                const showPixel = ((seed + row * gridSize + col) % 3) !== 0;
                if (showPixel) {
                    const px = CENTER - ((gridSize - 1) * (cellSize + gap)) / 2 + col * (cellSize + gap);
                    const py = CENTER - ((gridSize - 1) * (cellSize + gap)) / 2 + row * (cellSize + gap);
                    pixels += `<rect x="${px - cellSize / 2}" y="${py - cellSize / 2}" width="${cellSize}" height="${cellSize}" rx="${p.cornerRadius * 0.1}" fill="currentColor" opacity="${0.6 + (row + col) * 0.1}"/>`;
                }
            }
        }
        return pixels;
    },
    // Code brackets
    (p, seed) => {
        return `
      <path d="M 70 60 L 50 100 L 70 140" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 130 60 L 150 100 L 130 140" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round" stroke-linejoin="round"/>
      ${line({ length: 30, strokeWidth: p.strokeWidth * 2, rotation: -20 })}
    `;
    },
    // Cursor shape
    (p, seed) => {
        return `
      <path d="M 70 50 L 70 140 L 95 120 L 120 155" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 70 50 L 130 95 L 95 105 L 70 50" fill="currentColor" opacity="0.3"/>
    `;
    },
    // Binary/dots pattern
    (p, seed) => {
        return `
      ${dotGrid({ cols: 4, rows: 3, gap: 22, size: 7 })}
    `;
    },
];

/**
 * CREATIVE/DESIGN compositions
 */
const creativeCompositions: CompositionFn[] = [
    // Pen tip / nib
    (p, seed) => {
        return `
      <path d="M 100 50 L 130 90 L 130 140 L 100 170 L 70 140 L 70 90 Z" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}" stroke-linejoin="round"/>
      <path d="M 100 100 L 100 170" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}"/>
    `;
    },
    // Bezier curve
    (p, seed) => {
        return `
      <path d="M 50 140 C 50 60 150 60 150 140" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round"/>
      ${dot({ x: 50, y: 140, size: 6 })}
      ${dot({ x: 150, y: 140, size: 6 })}
      <line x1="50" y1="140" x2="50" y2="60" stroke="currentColor" stroke-width="${p.strokeWidth}" stroke-dasharray="4 4" opacity="0.4"/>
      <line x1="150" y1="140" x2="150" y2="60" stroke="currentColor" stroke-width="${p.strokeWidth}" stroke-dasharray="4 4" opacity="0.4"/>
    `;
    },
    // Color wheel abstracted
    (p, seed) => {
        const segments = 6;
        let arcs = '';
        for (let i = 0; i < segments; i++) {
            const startAngle = i * (360 / segments);
            arcs += `<path d="M ${CENTER} ${CENTER} L ${CENTER + 50 * Math.cos(startAngle * Math.PI / 180)} ${CENTER + 50 * Math.sin(startAngle * Math.PI / 180)} A 50 50 0 0 1 ${CENTER + 50 * Math.cos((startAngle + 60) * Math.PI / 180)} ${CENTER + 50 * Math.sin((startAngle + 60) * Math.PI / 180)} Z" fill="currentColor" opacity="${0.3 + i * 0.1}"/>`;
        }
        return arcs;
    },
    // Artboard / frame
    (p, seed) => {
        return `
      ${square({ size: 80, fill: false, strokeWidth: p.strokeWidth * 2, cornerRadius: p.cornerRadius * 0.2 })}
      ${line({ y: CENTER - 25, length: 50, strokeWidth: p.strokeWidth * 1.5, opacity: 0.6 })}
      ${line({ y: CENTER, length: 40, strokeWidth: p.strokeWidth * 1.5, opacity: 0.4 })}
      ${line({ y: CENTER + 25, length: 60, strokeWidth: p.strokeWidth * 1.5, opacity: 0.6 })}
    `;
    },
];

/**
 * DATA/ANALYTICS compositions
 */
const dataCompositions: CompositionFn[] = [
    // Abstract chart
    (p, seed) => {
        return `
      <path d="M 40 150 L 40 80 L 80 110 L 120 60 L 160 90" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round" stroke-linejoin="round"/>
      ${dot({ x: 40, y: 80, size: 6 })}
      ${dot({ x: 80, y: 110, size: 6 })}
      ${dot({ x: 120, y: 60, size: 6 })}
      ${dot({ x: 160, y: 90, size: 6 })}
    `;
    },
    // Stacked layers
    (p, seed) => {
        return `
      <ellipse cx="${CENTER}" cy="${CENTER - 30}" rx="55" ry="18" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}"/>
      <ellipse cx="${CENTER}" cy="${CENTER}" rx="55" ry="18" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}"/>
      <ellipse cx="${CENTER}" cy="${CENTER + 30}" rx="55" ry="18" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}"/>
    `;
    },
    // Grid pattern
    (p, seed) => {
        return `
      <line x1="60" y1="50" x2="60" y2="150" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" opacity="0.5"/>
      <line x1="100" y1="50" x2="100" y2="150" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" opacity="0.5"/>
      <line x1="140" y1="50" x2="140" y2="150" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" opacity="0.5"/>
      <line x1="50" y1="70" x2="150" y2="70" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" opacity="0.5"/>
      <line x1="50" y1="100" x2="150" y2="100" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" opacity="0.5"/>
      <line x1="50" y1="130" x2="150" y2="130" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" opacity="0.5"/>
      ${dot({ x: 100, y: 100, size: 10 })}
    `;
    },
    // Pie chart abstracted
    (p, seed) => {
        return `
      ${quarterCircle({ size: 50, rotation: -90, fill: true, opacity: 0.8 })}
      ${quarterCircle({ size: 50, rotation: 0, fill: true, opacity: 0.5 })}
      ${quarterCircle({ size: 50, rotation: 90, fill: true, opacity: 0.3 })}
      ${quarterCircle({ size: 50, rotation: 180, fill: true, opacity: 0.6 })}
      ${circle({ size: 15, fill: true, opacity: 1 })}
    `;
    },
];

/**
 * COMMUNICATION compositions
 */
const communicationCompositions: CompositionFn[] = [
    // Speech bubble abstracted
    (p, seed) => {
        return `
      <path d="M 50 60 L 150 60 Q 160 60 160 70 L 160 120 Q 160 130 150 130 L 90 130 L 70 155 L 75 130 L 50 130 Q 40 130 40 120 L 40 70 Q 40 60 50 60 Z" 
            fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}" stroke-linejoin="round"/>
    `;
    },
    // Signal waves
    (p, seed) => {
        return `
      ${arc({ x: CENTER + 30, size: 25, sweep: 90, rotation: 135, strokeWidth: p.strokeWidth * 2, opacity: 0.4 })}
      ${arc({ x: CENTER + 30, size: 40, sweep: 90, rotation: 135, strokeWidth: p.strokeWidth * 2, opacity: 0.6 })}
      ${arc({ x: CENTER + 30, size: 55, sweep: 90, rotation: 135, strokeWidth: p.strokeWidth * 2, opacity: 0.8 })}
      ${dot({ x: CENTER + 30, size: 10 })}
    `;
    },
    // Chat dots
    (p, seed) => {
        return `
      ${dot({ x: CENTER - 25, size: 12 })}
      ${dot({ x: CENTER, size: 12 })}
      ${dot({ x: CENTER + 25, size: 12 })}
    `;
    },
    // Megaphone / broadcast
    (p, seed) => {
        return `
      <path d="M 60 80 L 100 60 L 100 140 L 60 120 Z" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}" stroke-linejoin="round"/>
      ${arc({ x: 115, size: 20, sweep: 90, rotation: -45, strokeWidth: p.strokeWidth * 2, opacity: 0.5 })}
      ${arc({ x: 115, size: 35, sweep: 90, rotation: -45, strokeWidth: p.strokeWidth * 2, opacity: 0.7 })}
      ${arc({ x: 115, size: 50, sweep: 90, rotation: -45, strokeWidth: p.strokeWidth * 2 })}
    `;
    },
];

/**
 * FINANCE/MONEY compositions
 */
const financeCompositions: CompositionFn[] = [
    // Abstract coins (circles)
    (p, seed) => {
        return `
      ${circle({ x: CENTER - 20, y: CENTER + 15, size: 35, fill: false, strokeWidth: p.strokeWidth * 2 })}
      ${circle({ x: CENTER + 10, y: CENTER - 5, size: 35, fill: false, strokeWidth: p.strokeWidth * 2 })}
      ${circle({ x: CENTER + 5, y: CENTER + 25, size: 25, fill: false, strokeWidth: p.strokeWidth * 1.5, opacity: 0.5 })}
    `;
    },
    // Growth line
    (p, seed) => {
        return `
      <path d="M 40 140 Q 70 140 90 100 T 160 50" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round"/>
      ${triangle({ x: 160, y: 50, size: 15, rotation: 45 })}
    `;
    },
    // Stack (coins/money)
    (p, seed) => {
        return `
      <ellipse cx="${CENTER}" cy="${CENTER + 35}" rx="45" ry="12" fill="currentColor" opacity="0.4"/>
      <ellipse cx="${CENTER}" cy="${CENTER + 20}" rx="45" ry="12" fill="currentColor" opacity="0.6"/>
      <ellipse cx="${CENTER}" cy="${CENTER + 5}" rx="45" ry="12" fill="currentColor" opacity="0.8"/>
      <ellipse cx="${CENTER}" cy="${CENTER - 10}" rx="45" ry="12" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}"/>
    `;
    },
    // Diamond / gem
    (p, seed) => {
        return `
      <path d="M 100 40 L 145 75 L 100 160 L 55 75 Z" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2}" stroke-linejoin="round"/>
      <path d="M 55 75 L 100 90 L 145 75" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}"/>
      <path d="M 100 40 L 100 90" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}"/>
    `;
    },
];

/**
 * HEALTH/WELLNESS compositions
 */
const healthCompositions: CompositionFn[] = [
    // Heart abstracted
    (p, seed) => {
        return `
      <path d="M 100 160 C 40 120 40 60 80 60 C 100 60 100 80 100 80 C 100 80 100 60 120 60 C 160 60 160 120 100 160 Z" 
            fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linejoin="round"/>
    `;
    },
    // Plus sign / cross
    (p, seed) => {
        return `
      ${line({ length: 80, strokeWidth: p.strokeWidth * 3 })}
      ${line({ length: 80, rotation: 90, strokeWidth: p.strokeWidth * 3 })}
    `;
    },
    // Leaf curve
    (p, seed) => {
        return `
      <path d="M 100 160 Q 60 120 60 80 Q 60 40 100 40 Q 140 40 140 80 Q 140 120 100 160 Z" 
            fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linejoin="round"/>
      <path d="M 100 160 Q 100 100 100 60" fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 1.5}" stroke-linecap="round"/>
    `;
    },
    // Pulse / heartbeat line
    (p, seed) => {
        return `
      <path d="M 30 100 L 65 100 L 80 60 L 100 140 L 120 80 L 135 100 L 170 100" 
            fill="none" stroke="currentColor" stroke-width="${p.strokeWidth * 2.5}" stroke-linecap="round" stroke-linejoin="round"/>
    `;
    },
];

// ============================================
// CATEGORY MAPPING
// ============================================

export interface CategoryMapping {
    compositions: CompositionFn[];
    keywords: string[];
}

export const CATEGORY_COMPOSITIONS: Record<string, CategoryMapping> = {
    'speed': { compositions: speedCompositions, keywords: ['fast', 'quick', 'motion', 'dynamic', 'swift', 'rapid', 'velocity', 'rush', 'dash', 'sprint'] },
    'growth': { compositions: growthCompositions, keywords: ['grow', 'rise', 'up', 'increase', 'expand', 'elevate', 'boost', 'scale', 'climb', 'progress'] },
    'connect': { compositions: connectCompositions, keywords: ['network', 'link', 'connect', 'social', 'community', 'together', 'unite', 'bridge', 'team', 'group'] },
    'secure': { compositions: secureCompositions, keywords: ['safe', 'secure', 'protect', 'trust', 'shield', 'guard', 'lock', 'defense', 'privacy', 'reliable'] },
    'tech': { compositions: techCompositions, keywords: ['tech', 'digital', 'code', 'software', 'app', 'cyber', 'data', 'compute', 'ai', 'algorithm', 'dev', 'cloud'] },
    'creative': { compositions: creativeCompositions, keywords: ['design', 'creative', 'art', 'studio', 'craft', 'build', 'make', 'create', 'imagine', 'visual'] },
    'data': { compositions: dataCompositions, keywords: ['analytics', 'data', 'insight', 'chart', 'metric', 'measure', 'track', 'report', 'dashboard', 'statistics'] },
    'communication': { compositions: communicationCompositions, keywords: ['chat', 'message', 'talk', 'speak', 'voice', 'call', 'signal', 'broadcast', 'media', 'social'] },
    'finance': { compositions: financeCompositions, keywords: ['money', 'finance', 'bank', 'invest', 'pay', 'fund', 'capital', 'trade', 'wealth', 'crypto', 'coin'] },
    'health': { compositions: healthCompositions, keywords: ['health', 'wellness', 'care', 'medical', 'fit', 'life', 'vital', 'heal', 'therapy', 'clinic'] },
};

// Default/fallback compositions
const defaultCompositions: CompositionFn[] = [
    // Abstract dots
    (p, seed) => dotPattern({ count: 6 + (seed % 3), size: 6 }),
    // Concentric rings
    (p, seed) => `
    ${ring({ size: 55, strokeWidth: p.strokeWidth * 2 })}
    ${ring({ size: 35, strokeWidth: p.strokeWidth * 1.5 })}
    ${dot({ size: 10 })}
  `,
    // Abstract wave
    (p, seed) => wave({ waves: 2 + (seed % 2), strokeWidth: p.strokeWidth * 2.5 }),
    // Simple geometric
    (p, seed) => `
    ${square({ size: 60, rotation: 45, fill: false, strokeWidth: p.strokeWidth * 2 })}
    ${dot({ size: 12 })}
  `,
];

// ============================================
// MAIN GENERATION FUNCTION
// ============================================

/**
 * Generate an abstract icon based on category and params
 */
export function generateAbstractIcon(
    params: InfiniteLogoParams,
    brandName: string,
    category?: string,
    keywords: string[] = []
): string {
    // Generate seed from brand name hash
    const seed = generateSeedFromName(brandName);

    // Find matching category
    let compositions = defaultCompositions;

    if (category && CATEGORY_COMPOSITIONS[category.toLowerCase()]) {
        compositions = CATEGORY_COMPOSITIONS[category.toLowerCase()].compositions;
    } else {
        // Try to match from keywords
        for (const [cat, mapping] of Object.entries(CATEGORY_COMPOSITIONS)) {
            const hasMatch = keywords.some(kw =>
                mapping.keywords.some(catKw =>
                    kw.toLowerCase().includes(catKw) || catKw.includes(kw.toLowerCase())
                )
            );
            if (hasMatch) {
                compositions = mapping.compositions;
                break;
            }
        }
    }

    // Select composition based on seed
    const compositionIndex = seed % compositions.length;
    const composition = compositions[compositionIndex];

    // Generate the icon content
    const iconContent = composition(params, seed);

    // Apply global transforms based on params
    const rotation = params.rotation || 0;

    return `<svg viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${rotation}, ${CENTER}, ${CENTER})">
      ${iconContent}
    </g>
  </svg>`;
}

/**
 * Generate seed from brand name
 */
function generateSeedFromName(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        const char = name.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Generate multiple icon variations
 */
export function generateIconVariations(
    params: InfiniteLogoParams,
    brandName: string,
    category?: string,
    keywords: string[] = [],
    count: number = 4
): string[] {
    const variations: string[] = [];

    for (let i = 0; i < count; i++) {
        // Modify params slightly for each variation
        const variantParams = {
            ...params,
            strokeWidth: params.strokeWidth * (0.8 + (i * 0.15)),
            cornerRadius: params.cornerRadius + (i * 5),
            rotation: (params.rotation || 0) + (i * 10),
        };

        // Add suffix to brand name to get different seeds
        const variantName = `${brandName}-v${i}`;

        variations.push(generateAbstractIcon(variantParams, variantName, category, keywords));
    }

    return variations;
}

/**
 * Get available categories
 */
export function getAvailableCategories(): string[] {
    return Object.keys(CATEGORY_COMPOSITIONS);
}

/**
 * Get keywords for a category
 */
export function getCategoryKeywords(category: string): string[] {
    return CATEGORY_COMPOSITIONS[category.toLowerCase()]?.keywords || [];
}

// ============================================
// LIBRARY GENERATORS
// ============================================

// Individual generators for each semantic category
export const generateSpeedIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'speed');

export const generateGrowthIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'growth');

export const generateConnectIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'connect');

export const generateSecureIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'secure');

export const generateTechIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'tech');

export const generateCreativeIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'creative');

export const generateDataIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'data');

export const generateCommunicationIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'communication');

export const generateFinanceIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'finance');

export const generateHealthIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b, 'health');

// Default abstract icon
export const generateDefaultIcon = (p: InfiniteLogoParams, b: string) =>
    generateAbstractIcon(p, b);
