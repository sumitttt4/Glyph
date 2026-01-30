/**
 * Skeleton-Based Logo Techniques
 * 
 * Uses the letter skeleton system to generate logos with proper typography anatomy.
 * Each technique transforms the skeleton points differently:
 * - MODULAR: Places geometric units at anchor points
 * - STENCIL: Cuts gaps into strokes
 * - OUTLINE: Traces the skeleton path with variable stroke
 * - GEOMETRIC: Builds from skeleton with geometric primitives
 * - CALLIGRAPHIC: Variable stroke width along skeleton path
 */

import { InfiniteLogoParams } from '../types';
import {
    getSkeleton,
    getModularPoints,
    getStencilGaps,
    getOutlineSegments,
    hasCurvedElements,
    hasDiagonalElements,
    Point,
    LetterSkeleton,
} from '../letter-skeletons';

// ============================================
// MODULAR TECHNIQUE
// Places geometric units (circles, squares, etc.) at skeleton anchor points
// ============================================

export function generateModular(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackModular(params, brandName);
    }

    const points = getModularPoints(letter);
    const unitSize = 8 + (params.strokeWidth * 2);
    const cornerRadius = params.cornerRadius * 0.3;

    // Determine unit shape based on params
    const useCircles = params.cornerRadius > 25;

    let units = '';

    points.forEach((point, index) => {
        const x = point.x * 2; // Scale to 200x200 viewBox
        const y = point.y * 2;
        const size = unitSize * (1 + (index % 3) * 0.1 * params.scaleVariance);

        if (useCircles) {
            units += `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="currentColor" opacity="${0.7 + (index % 3) * 0.1}"/>`;
        } else {
            const halfSize = size / 2;
            units += `<rect x="${x - halfSize}" y="${y - halfSize}" width="${size}" height="${size}" rx="${cornerRadius}" fill="currentColor" opacity="${0.7 + (index % 3) * 0.1}"/>`;
        }
    });

    // Add connecting lines between adjacent anchors
    let connections = '';
    for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        connections += `<line x1="${p1.x * 2}" y1="${p1.y * 2}" x2="${p2.x * 2}" y2="${p2.y * 2}" stroke="currentColor" stroke-width="${params.strokeWidth}" opacity="0.3"/>`;
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${params.rotation}, 100, 100)">
      ${connections}
      ${units}
    </g>
  </svg>`;
}

function generateFallbackModular(params: InfiniteLogoParams, brandName: string): string {
    const unitSize = 15;
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="${unitSize}" fill="currentColor"/>
    <circle cx="70" cy="70" r="${unitSize * 0.8}" fill="currentColor" opacity="0.7"/>
    <circle cx="130" cy="70" r="${unitSize * 0.8}" fill="currentColor" opacity="0.7"/>
    <circle cx="70" cy="130" r="${unitSize * 0.8}" fill="currentColor" opacity="0.7"/>
    <circle cx="130" cy="130" r="${unitSize * 0.8}" fill="currentColor" opacity="0.7"/>
  </svg>`;
}

// ============================================
// STENCIL TECHNIQUE
// Renders skeleton with gaps cut into strokes (stencil/spray paint effect)
// ============================================

export function generateStencil(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackStencil(params, brandName);
    }

    const gaps = getStencilGaps(letter);
    const strokeW = params.strokeWidth * 3;
    const gapSize = 6 + params.spacingRatio * 4;

    // Create mask with gaps
    let gapMask = '';
    gaps.forEach((gap, index) => {
        const cx = (gap.start.x + gap.end.x) / 2 * 2;
        const cy = (gap.start.y + gap.end.y) / 2 * 2;
        gapMask += `<rect x="${cx - gapSize / 2}" y="${cy - gapSize / 2}" width="${gapSize}" height="${gapSize * 1.2}" fill="black" transform="rotate(${45 * index}, ${cx}, ${cy})"/>`;
    });

    // Scale the path to 200x200
    const scaledPath = skeleton.svgPath.replace(/(\d+\.?\d*)/g, (match) => {
        return (parseFloat(match) * 2).toString();
    });

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="stencil-mask-${letter}">
        <rect width="200" height="200" fill="white"/>
        ${gapMask}
      </mask>
    </defs>
    <g mask="url(#stencil-mask-${letter})" transform="rotate(${params.rotation}, 100, 100)">
      <path d="${scaledPath}" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="square" stroke-linejoin="miter"/>
    </g>
  </svg>`;
}

function generateFallbackStencil(params: InfiniteLogoParams, brandName: string): string {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <mask id="stencil-fallback">
        <rect width="200" height="200" fill="white"/>
        <rect x="90" y="40" width="20" height="10" fill="black"/>
        <rect x="90" y="150" width="20" height="10" fill="black"/>
      </mask>
    </defs>
    <text x="100" y="150" font-size="140" font-weight="900" text-anchor="middle" fill="currentColor" mask="url(#stencil-fallback)">${brandName.charAt(0)}</text>
  </svg>`;
}

// ============================================
// OUTLINE TECHNIQUE
// Multiple parallel strokes following the skeleton path
// ============================================

export function generateOutline(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackOutline(params, brandName);
    }

    const segments = getOutlineSegments(letter);
    const baseStroke = params.strokeWidth * 2;
    const layers = Math.min(params.elementCount, 4);

    // Scale the path to 200x200
    const scaledPath = skeleton.svgPath.replace(/(\d+\.?\d*)/g, (match) => {
        return (parseFloat(match) * 2).toString();
    });

    let outlines = '';

    for (let i = layers; i >= 1; i--) {
        const strokeWidth = baseStroke * (1 + (i - 1) * 0.6);
        const opacity = 0.2 + (layers - i) * 0.2;

        outlines += `<path d="${scaledPath}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}"/>`;
    }

    // Add final solid stroke
    outlines += `<path d="${scaledPath}" fill="none" stroke="currentColor" stroke-width="${baseStroke * 0.5}" stroke-linecap="round" stroke-linejoin="round"/>`;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${params.rotation}, 100, 100)">
      ${outlines}
    </g>
  </svg>`;
}

function generateFallbackOutline(params: InfiniteLogoParams, brandName: string): string {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <text x="100" y="150" font-size="140" font-weight="900" text-anchor="middle" fill="none" stroke="currentColor" stroke-width="8">${brandName.charAt(0)}</text>
    <text x="100" y="150" font-size="140" font-weight="900" text-anchor="middle" fill="none" stroke="currentColor" stroke-width="4" opacity="0.5">${brandName.charAt(0)}</text>
    <text x="100" y="150" font-size="140" font-weight="900" text-anchor="middle" fill="none" stroke="currentColor" stroke-width="2">${brandName.charAt(0)}</text>
  </svg>`;
}

// ============================================
// GEOMETRIC CONSTRUCTION TECHNIQUE
// Builds letter from geometric primitives based on skeleton
// ============================================

export function generateGeometricConstruction(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackGeometric(params, brandName);
    }

    const hasCurves = hasCurvedElements(letter);
    const hasDiags = hasDiagonalElements(letter);

    let elements = '';
    const strokeW = params.strokeWidth * 2;

    skeleton.anatomy.forEach((part, index) => {
        if (!part.pathSegment) return;

        // Scale path segment
        const scaledSegment = part.pathSegment.replace(/(\d+\.?\d*)/g, (match) => {
            return (parseFloat(match) * 2).toString();
        });

        const isPrimary = part.isPrimary;
        const opacity = isPrimary ? 1 : 0.7;
        const sw = isPrimary ? strokeW : strokeW * 0.8;

        // Different styling based on anatomy type
        switch (part.type) {
            case 'bowl':
            case 'arc':
            case 'loop':
                elements += `<path d="${scaledSegment}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" opacity="${opacity}"/>`;
                break;
            case 'stem':
            case 'bar':
            case 'crossbar':
                elements += `<path d="${scaledSegment}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="square" opacity="${opacity}"/>`;
                break;
            case 'diagonal':
            case 'arm':
            case 'leg':
                elements += `<path d="${scaledSegment}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" opacity="${opacity}"/>`;
                break;
            default:
                elements += `<path d="${scaledSegment}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" opacity="${opacity}"/>`;
        }
    });

    // Add construction marks at anchor points
    let constructionMarks = '';
    if (params.fillOpacity < 0.5) {
        skeleton.anchors.forEach((anchor) => {
            const x = anchor.x * 2;
            const y = anchor.y * 2;
            constructionMarks += `<circle cx="${x}" cy="${y}" r="3" fill="currentColor" opacity="0.3"/>`;
        });
    }

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${params.rotation}, 100, 100)">
      ${constructionMarks}
      ${elements}
    </g>
  </svg>`;
}

function generateFallbackGeometric(params: InfiniteLogoParams, brandName: string): string {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="50" y="30" width="100" height="140" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth * 2}"/>
    <line x1="50" y1="100" x2="150" y2="100" stroke="currentColor" stroke-width="${params.strokeWidth * 2}"/>
  </svg>`;
}

// ============================================
// CALLIGRAPHIC TECHNIQUE  
// Variable stroke width that tapers along the skeleton path
// ============================================

export function generateCalligraphic(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackCalligraphic(params, brandName);
    }

    const taperAmount = params.strokeTaper / 100;
    const baseWidth = params.strokeWidth * 4;

    let calligraphicPaths = '';

    skeleton.anatomy.forEach((part) => {
        if (!part.pathSegment || part.type === 'apex' || part.type === 'vertex') return;

        // Scale path segment
        const scaledSegment = part.pathSegment.replace(/(\d+\.?\d*)/g, (match) => {
            return (parseFloat(match) * 2).toString();
        });

        // Simulate calligraphic variation with multiple stroke-widths
        // In production, this would use variable-width strokes or shape conversion
        const isPrimary = part.isPrimary;
        const startWidth = baseWidth * (isPrimary ? 1 : 0.8);
        const endWidth = startWidth * (1 - taperAmount * 0.5);

        // Create gradient for variable stroke effect
        const gradId = `callig-${letter}-${part.type}`;

        calligraphicPaths += `
      <path d="${scaledSegment}" fill="none" stroke="currentColor" 
        stroke-width="${(startWidth + endWidth) / 2}" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        opacity="${isPrimary ? 1 : 0.85}"/>
    `;
    });

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${params.rotation}, 100, 100)">
      ${calligraphicPaths}
    </g>
  </svg>`;
}

function generateFallbackCalligraphic(params: InfiniteLogoParams, brandName: string): string {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <text x="100" y="145" font-size="120" font-weight="400" font-family="Georgia, serif" text-anchor="middle" fill="currentColor">${brandName.charAt(0)}</text>
  </svg>`;
}

// ============================================
// MONOLINE TECHNIQUE
// Single continuous stroke following skeleton
// ============================================

export function generateMonoline(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackMonoline(params, brandName);
    }

    // Scale the path to 200x200
    const scaledPath = skeleton.svgPath.replace(/(\d+\.?\d*)/g, (match) => {
        return (parseFloat(match) * 2).toString();
    });

    const strokeW = params.strokeWidth * 2.5;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${params.rotation}, 100, 100)">
      <path d="${scaledPath}" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="${strokeW}" 
        stroke-linecap="round" 
        stroke-linejoin="round"/>
    </g>
  </svg>`;
}

function generateFallbackMonoline(params: InfiniteLogoParams, brandName: string): string {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path d="M 40 180 L 100 20 L 160 180 M 60 120 L 140 120" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth * 2}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ============================================
// SHADOW/3D TECHNIQUE
// Skeleton with depth shadow effect
// ============================================

export function generateShadowLetter(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackShadow(params, brandName);
    }

    // Scale the path to 200x200
    const scaledPath = skeleton.svgPath.replace(/(\d+\.?\d*)/g, (match) => {
        return (parseFloat(match) * 2).toString();
    });

    const strokeW = params.strokeWidth * 3;
    const shadowOffset = 6 + params.interlockDepth * 0.1;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${params.rotation}, 100, 100)">
      <!-- Shadow layer -->
      <g transform="translate(${shadowOffset}, ${shadowOffset})">
        <path d="${scaledPath}" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" opacity="0.2"/>
      </g>
      <!-- Mid shadow -->
      <g transform="translate(${shadowOffset * 0.5}, ${shadowOffset * 0.5})">
        <path d="${scaledPath}" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" opacity="0.4"/>
      </g>
      <!-- Main stroke -->
      <path d="${scaledPath}" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  </svg>`;
}

function generateFallbackShadow(params: InfiniteLogoParams, brandName: string): string {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <text x="108" y="155" font-size="140" font-weight="900" text-anchor="middle" fill="currentColor" opacity="0.2">${brandName.charAt(0)}</text>
    <text x="104" y="151" font-size="140" font-weight="900" text-anchor="middle" fill="currentColor" opacity="0.4">${brandName.charAt(0)}</text>
    <text x="100" y="147" font-size="140" font-weight="900" text-anchor="middle" fill="currentColor">${brandName.charAt(0)}</text>
  </svg>`;
}

// ============================================
// DOTTED SKELETON TECHNIQUE
// Skeleton rendered with dots/dashes
// ============================================

export function generateDottedSkeleton(params: InfiniteLogoParams, brandName: string): string {
    const letter = brandName.charAt(0).toUpperCase();
    const skeleton = getSkeleton(letter);

    if (!skeleton) {
        return generateFallbackDotted(params, brandName);
    }

    // Scale the path to 200x200
    const scaledPath = skeleton.svgPath.replace(/(\d+\.?\d*)/g, (match) => {
        return (parseFloat(match) * 2).toString();
    });

    const strokeW = params.strokeWidth * 2;
    const dashLength = 4 + params.spacingRatio * 6;
    const gapLength = 3 + params.spacingRatio * 4;

    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <g transform="rotate(${params.rotation}, 100, 100)">
      <path d="${scaledPath}" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="${strokeW}" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        stroke-dasharray="${dashLength} ${gapLength}"/>
    </g>
  </svg>`;
}

function generateFallbackDotted(params: InfiniteLogoParams, brandName: string): string {
    return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <text x="100" y="150" font-size="140" font-weight="900" text-anchor="middle" fill="none" stroke="currentColor" stroke-width="6" stroke-dasharray="8 4">${brandName.charAt(0)}</text>
  </svg>`;
}

// ============================================
// EXPORTS
// ============================================

export const SKELETON_TECHNIQUES = {
    modular: generateModular,
    stencil: generateStencil,
    outline: generateOutline,
    geometric: generateGeometricConstruction,
    calligraphic: generateCalligraphic,
    monoline: generateMonoline,
    shadow: generateShadowLetter,
    dotted: generateDottedSkeleton,
};

export type SkeletonTechnique = keyof typeof SKELETON_TECHNIQUES;

/**
 * Generate a logo using a specific skeleton technique
 */
export function generateWithTechnique(
    technique: SkeletonTechnique,
    params: InfiniteLogoParams,
    brandName: string
): string {
    const generator = SKELETON_TECHNIQUES[technique];
    if (!generator) {
        return generateMonoline(params, brandName);
    }
    return generator(params, brandName);
}

/**
 * Get all available skeleton techniques
 */
export function getAvailableTechniques(): SkeletonTechnique[] {
    return Object.keys(SKELETON_TECHNIQUES) as SkeletonTechnique[];
}
