import { createHash } from 'crypto';
import {
    LogoGenerationParams,
    GeneratedLogo,
    LogoAlgorithm,
    LineFragmentationParams,
    StaggeredBarsParams,
    BlockAssemblyParams,
    MotionChevronsParams,
    NegativeSpaceParams,
    InterlockingLoopsParams,
    MonogramMergeParams,
    ContinuousStrokeParams,
    GeometricExtractParams,
    CloverRadialParams
} from '../types';
import { createSeededRandom, deriveParamsFromHash } from '../core/parametric-engine';

// Helper to generate a consistent hash-based random number generator
function getRng(brandName: string) {
    const hash = createHash('sha256').update(brandName).digest('hex');
    return createSeededRandom(hash);
}

// Helper to create the SVG wrapper
function wrapSvg(content: string, size: number = 100) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
    <style>
        svg { --bg-color: white; --fg-color: black; }
        @media (prefers-color-scheme: dark) { svg { --bg-color: #1a1a1a; --fg-color: white; } }
    </style>
    ${content}
</svg>`;
}

// 1. LINE FRAGMENTATION
export function generateLineFragmentation(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const letter = params.brandName.charAt(0).toUpperCase();
    const color = params.primaryColor || 'currentColor';

    // Generate lines
    const lineCount = 10 + Math.floor(rng() * 20); // 10-30
    const paths: string[] = [];
    const step = size / lineCount;

    const maskId = `mask-${Math.random().toString(36).substr(2, 9)}`;

    // Create lines
    let lines = '';
    for (let i = 0; i < lineCount; i++) {
        const y = i * step + step / 2;
        // Random gaps
        if (rng() > 0.8) continue; // Skip some lines completely

        let x = 0;
        while (x < size) {
            const dash = 5 + rng() * 30;
            const gap = 2 + rng() * 5;
            if (x + dash > size) break;
            lines += `<line x1="${x}" y1="${y}" x2="${x + dash}" y2="${y}" stroke="${color}" stroke-width="${step * 0.6}" stroke-linecap="round" />`;
            x += dash + gap;
        }
    }

    // We use a clip path or mask to shape the lines into the letter
    const content = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="${size}" height="${size}" fill="black" />
                <text x="50" y="80" font-family="Arial, sans-serif" font-weight="900" font-size="80" text-anchor="middle" fill="white">${letter}</text>
            </mask>
        </defs>
        <g mask="url(#${maskId})">
            ${lines}
        </g>
    `;

    return [{
        id: `lf-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'line-fragmentation',
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 95 } as any
    }];
}

// 2. STAGGERED BARS
export function generateStaggeredBars(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const barCount = 8 + Math.floor(rng() * 12); // 8-20
    const barWidth = size / barCount;
    const color = params.primaryColor || 'currentColor';

    let bars = '';
    const center = size / 2;

    // Form a shape profile (e.g. gaussian or letter-like)
    for (let i = 0; i < barCount; i++) {
        const x = i * barWidth;
        const normalizedX = (i - barCount / 2) / (barCount / 2);
        const height = size * (0.8 - Math.abs(normalizedX) * 0.6 + rng() * 0.2); // Peak in center
        const y = (size - height) / 2;

        bars += `<rect x="${x + barWidth * 0.1}" y="${y}" width="${barWidth * 0.8}" height="${height}" fill="${color}" rx="${barWidth * 0.2}" />`;

        // Add a "stagger" echo
        if (rng() > 0.5) {
            bars += `<rect x="${x + barWidth * 0.1}" y="${y + height + 2}" width="${barWidth * 0.8}" height="${size * 0.1}" fill="${color}" opacity="0.5" rx="${barWidth * 0.2}" />`;
        }
    }

    return [{
        id: `sb-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'staggered-bars',
        variant: 1,
        svg: wrapSvg(bars),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 90 } as any
    }];
}

// 3. 3D BLOCK ASSEMBLY
export function generateBlockAssembly(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    // Generate 2-4 blocks
    const blockCount = 2 + Math.floor(rng() * 3);
    let blocks = '';

    // Abstract geometric composition
    const shapes = ['rect', 'circle', 'triangle'];
    const shapeType = shapes[Math.floor(rng() * shapes.length)];

    for (let i = 0; i < blockCount; i++) {
        const w = 40 + rng() * 30;
        const h = 40 + rng() * 30;
        const x = 10 + rng() * (size - w - 10);
        const y = 10 + rng() * (size - h - 10);
        const opacity = 0.6 + rng() * 0.4;

        if (shapeType === 'rect') {
            blocks += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" opacity="${opacity}" rx="5" />`;
            // Add depth shadow
            blocks += `<rect x="${x + 5}" y="${y + 5}" width="${w}" height="${h}" fill="black" opacity="0.2" rx="5" style="mix-blend-mode: multiply" />`;
        } else if (shapeType === 'circle') {
            const r = w / 2;
            blocks += `<circle cx="${x + r}" cy="${y + r}" r="${r}" fill="${color}" opacity="${opacity}" />`;
        } else {
            // Triangle
            blocks += `<path d="M ${x + w / 2} ${y} L ${x + w} ${y + h} L ${x} ${y + h} Z" fill="${color}" opacity="${opacity}" />`;
        }
    }

    return [{
        id: `ba-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'block-assembly',
        variant: 1,
        svg: wrapSvg(blocks),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 92 } as any
    }];
}

// 4. MOTION CHEVRONS
export function generateMotionChevrons(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const count = 3 + Math.floor(rng() * 2);
    const color = params.primaryColor || 'currentColor';

    let paths = '';
    const width = 60;
    const height = 30;
    const gap = 15;
    const startY = (size - (count * height + (count - 1) * gap)) / 2 + height / 2;
    const centerX = size / 2;

    for (let i = 0; i < count; i++) {
        const y = startY + i * gap;
        const opacity = 1 - (i * 0.2);
        // Chevron shape: V
        const d = `M ${centerX - width / 2} ${y - height / 2} L ${centerX} ${y + height / 2} L ${centerX + width / 2} ${y - height / 2}`;
        // Or arrow shape
        const arrow = `M ${centerX - width / 2} ${y} L ${centerX} ${y + height} L ${centerX + width / 2} ${y} L ${centerX} ${y + height / 2} Z`; // Filled?

        // Stroke style
        paths += `<path d="${d}" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}" fill="none" />`;
    }

    return [{
        id: `mc-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'motion-chevrons',
        variant: 1,
        svg: wrapSvg(paths),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 88 } as any
    }];
}

// 5. NEGATIVE SPACE LETTER
export function generateNegativeSpace(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const letter = params.brandName.charAt(0).toUpperCase();
    const color = params.primaryColor || 'currentColor';

    const shapeId = Math.floor(rng() * 3);
    let container = '';

    if (shapeId === 0) {
        container = `<rect x="10" y="10" width="80" height="80" fill="${color}" rx="20" />`;
    } else if (shapeId === 1) {
        container = `<circle cx="50" cy="50" r="45" fill="${color}" />`;
    } else {
        // Hexagon
        container = `<path d="M 50 5 L 95 27.5 L 95 72.5 L 50 95 L 5 72.5 L 5 27.5 Z" fill="${color}" />`;
    }

    const content = `
        <defs>
            <mask id="neg-mask">
                <rect x="0" y="0" width="${size}" height="${size}" fill="white" />
                <text x="50" y="80" font-family="Arial, sans-serif" font-weight="900" font-size="70" text-anchor="middle" fill="black">${letter}</text>
            </mask>
        </defs>
        <g mask="url(#neg-mask)">
            ${container}
        </g>
    `;

    return [{
        id: `ns-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'negative-space',
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 94 } as any
    }];
}

// 6. INTERLOCKING LOOPS
export function generateInterlockingLoops(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    // Triangle formation of 3 rings (Anchortack style)
    const r = 25;
    const dist = 25;
    const cx = 50;
    const cy = 55;

    // Centers
    const p1 = { x: cx, y: cy - dist };
    const p2 = { x: cx - dist * 0.866, y: cy + dist * 0.5 };
    const p3 = { x: cx + dist * 0.866, y: cy + dist * 0.5 };

    // Draw rings with stroke
    const strokeWidth = 8;

    const ring = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" />`;

    // Simple stacking isn't interlocking visually without cuts, but for MVP:
    // We can simulate interlocking by drawing small segments over intersections
    // For now, let's use opacity overlap which looks modern

    const content = `
        <g opacity="0.9">${ring(p1.x, p1.y)}</g>
        <g opacity="0.9">${ring(p2.x, p2.y)}</g>
        <g opacity="0.9">${ring(p3.x, p3.y)}</g>
        <!-- Adding center connection -->
        <circle cx="${cx}" cy="${cy}" r="5" fill="${color}" />
    `;

    return [{
        id: `il-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'interlocking-loops',
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 91 } as any
    }];
}

// 7. MONOGRAM MERGE
export function generateMonogramMerge(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const letters = (params.brandName.substring(0, 2)).toUpperCase();
    const l1 = letters.charAt(0);
    const l2 = letters.length > 1 ? letters.charAt(1) : l1;

    // Place slightly offset and blend
    const content = `
        <g font-family="Arial, sans-serif" font-weight="bold" font-size="80">
            <text x="35" y="80" text-anchor="middle" fill="${color}" opacity="0.8">${l1}</text>
            <text x="65" y="80" text-anchor="middle" fill="${color}" opacity="0.8" style="mix-blend-mode: multiply">${l2}</text>
        </g>
    `;

    // Note: mix-blend-mode might not export well to basic SVG viewers, but works in browser.
    // Fallback: use stroke intersection.

    return [{
        id: `mm-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'monogram-merge',
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 89 } as any
    }];
}

// 8. SINGLE CONTINUOUS STROKE
export function generateContinuousStroke(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    // Generate random control points
    const points: { x: number, y: number }[] = [];
    const count = 5;
    for (let i = 0; i < count; i++) {
        points.push({
            x: 20 + rng() * 60,
            y: 20 + rng() * 60
        });
    }

    // Smooth path
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const prev = points[i - 1];
        // Simple smooth curve
        // d += ` Q ${(prev.x+p.x)/2} ${(prev.y+p.y)/2} ${p.x} ${p.y}`;
        // Lineto for geometric look
        d += ` L ${p.x} ${p.y}`;
    }

    // Close it if wanted
    if (rng() > 0.5) d += " Z";

    const content = `<path d="${d}" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />`;

    return [{
        id: `cs-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'continuous-stroke',
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 88 } as any
    }];
}

// 9. GEOMETRIC LETTER EXTRACT
export function generateGeometricExtract(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const letter = params.brandName.charAt(0).toUpperCase();

    // Render letter very large and clip it
    const content = `
        <defs>
            <clipPath id="clip-circle">
                <circle cx="50" cy="50" r="45" />
            </clipPath>
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke="${color}" stroke-width="2" />
        <g clip-path="url(#clip-circle)">
             <text x="50" y="90" font-family="Arial, sans-serif" font-weight="900" font-size="120" text-anchor="middle" fill="${color}" transform="rotate(-15, 50, 50)">${letter}</text>
        </g>
    `;

    return [{
        id: `ge-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'geometric-extract',
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 92 } as any
    }];
}

// 10. CLOVER RADIAL
export function generateCloverRadial(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = 50;
    const cy = 50;

    const count = 3 + Math.floor(rng() * 3); // 3-5
    const r = 20;
    let petals = '';

    for (let i = 0; i < count; i++) {
        const angle = (i * 360) / count;
        // Petal shape (circle off-center)
        // Rotate transform
        petals += `
            <g transform="rotate(${angle}, ${cx}, ${cy})">
                <circle cx="${cx}" cy="${cy - 20}" r="${r}" fill="${color}" opacity="0.8" />
            </g>
        `;
    }

    const content = `
        <g>
            ${petals}
            <circle cx="${cx}" cy="${cy}" r="8" fill="white" />
        </g>
    `;

    return [{
        id: `cr-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'clover-radial',
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 93 } as any
    }];
}

// Single Previews
export const generateSingleLineFragmentationPreview = (n: string) => generateLineFragmentation({ brandName: n } as any)[0];
export const generateSingleStaggeredBarsPreview = (n: string) => generateStaggeredBars({ brandName: n } as any)[0];
export const generateSingleBlockAssemblyPreview = (n: string) => generateBlockAssembly({ brandName: n } as any)[0];
export const generateSingleMotionChevronsPreview = (n: string) => generateMotionChevrons({ brandName: n } as any)[0];
export const generateSingleNegativeSpacePreview = (n: string) => generateNegativeSpace({ brandName: n } as any)[0];
export const generateSingleInterlockingLoopsPreview = (n: string) => generateInterlockingLoops({ brandName: n } as any)[0];
export const generateSingleMonogramMergePreview = (n: string) => generateMonogramMerge({ brandName: n } as any)[0];
export const generateSingleContinuousStrokePreview = (n: string) => generateContinuousStroke({ brandName: n } as any)[0];
export const generateSingleGeometricExtractPreview = (n: string) => generateGeometricExtract({ brandName: n } as any)[0];
export const generateSingleCloverRadialPreview = (n: string) => generateCloverRadial({ brandName: n } as any)[0];
