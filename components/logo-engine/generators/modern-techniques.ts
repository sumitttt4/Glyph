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

// ============================================================================
// DEEP PARAMETRIC VARIATION SYSTEM
// ============================================================================

/**
 * Extract comprehensive parameters from hash for deep variation
 * Each algorithm uses 20+ parameters ensuring 1000+ unique structural variations
 */
interface DeepParams {
    // Bar/Line parameters
    barCount: number;           // 6-20
    barHeightPattern: 'ascending' | 'descending' | 'wave' | 'random' | 'centered' | 'alternating' | 'stairs' | 'valley';
    barWidthStyle: 'thin' | 'medium' | 'thick' | 'tapered' | 'mixed';
    barSpacing: 'tight' | 'normal' | 'loose' | 'varied';
    barCornerRadius: number;    // 0-50%
    barAngle: number;           // -15 to 15 degrees
    barOrientation: 'horizontal' | 'vertical';
    barAlignment: 'top' | 'center' | 'bottom' | 'staggered';

    // Chevron parameters
    chevronCount: number;       // 2-5
    chevronThickness: number;   // 2-10px
    chevronAngle: number;       // 20-70 degrees
    chevronSpacing: 'overlapping' | 'touching' | 'close' | 'apart' | 'far';
    chevronTips: 'pointed' | 'rounded' | 'flat';
    chevronStyle: 'solid' | 'outline' | 'gradient';
    chevronArrangement: 'nested' | 'stacked' | 'cascading' | 'radial';
    chevronDirection: 'up' | 'down' | 'left' | 'right';

    // Block parameters
    blockCount: number;         // 2-5
    blockShape: 'square' | 'rect' | 'triangle' | 'parallelogram' | 'hexagon' | 'diamond';
    blockOverlap: number;       // 10-60%
    blockDepthDir: 'left' | 'right' | 'top' | 'bottom' | 'topleft' | 'bottomright';
    blockShadowIntensity: number; // 0.1-0.5
    blockRotation: number;      // 0-45 degrees
    blockScalePattern: 'equal' | 'ascending' | 'descending' | 'random';
    blockArrangement: 'diagonal' | 'stack' | 'scatter' | 'grid';

    // Container/Negative space parameters
    containerShape: 'circle' | 'square' | 'rounded-rect' | 'hexagon' | 'diamond' | 'octagon' | 'shield';
    letterPosition: 'centered' | 'offset-left' | 'offset-right' | 'offset-top' | 'offset-bottom';
    letterScale: number;        // 40-80%
    containerStyle: 'stroke' | 'fill' | 'double' | 'dashed';
    cutoutDepth: number;        // 0.5-1.0
    letterStyle: 'geometric' | 'rounded' | 'angular' | 'serif' | 'minimal';
    containerThickness: number; // 2-8

    // Clover/Radial parameters
    petalCount: number;         // 3-8
    petalShape: 'circle' | 'ellipse' | 'teardrop' | 'diamond' | 'leaf' | 'heart' | 'pointed';
    petalSizeVariation: number; // 0-0.5
    petalRotationOffset: number; // 0-60
    centerElement: 'none' | 'circle' | 'dot' | 'hole' | 'ring' | 'star';
    petalOverlap: number;       // -20 to 30
    petalSpacing: number;       // 0.8-1.5
    petalCurve: number;         // 0-1

    // Line Fragmentation parameters
    lineCount: number;          // 8-30
    lineThickness: number;      // 1-4px
    gapPattern: 'even' | 'random' | 'gradient' | 'morse' | 'cluster';
    lineAngle: 'horizontal' | 'diagonal' | 'radial' | 'vertical' | 'curved';
    fragmentShape: 'circle' | 'square' | 'letter' | 'star' | 'triangle' | 'hexagon';
    lineEnds: 'round' | 'flat' | 'arrow';

    // Loop parameters
    loopCount: number;          // 2-4
    loopShape: 'circle' | 'rounded-rect' | 'triangle' | 'oval' | 'squircle';
    weaveTightness: number;     // 0.3-0.9
    loopStrokeWidth: number;    // 2-8px
    loopCornerRadius: number;   // 0-50%
    loopScaleRelation: 'equal' | 'graduated' | 'alternating';
    loopRotation: number;       // 0-120
    loopInterlockStyle: 'olympic' | 'chain' | 'venn' | 'celtic';

    // Monogram parameters
    mergeStyle: 'overlapping' | 'connected' | 'shared-stroke' | 'intertwined' | 'stacked';
    letterArrangement: 'side-by-side' | 'stacked' | 'nested' | 'diagonal' | 'rotated';
    connectionPoint: 'center' | 'left' | 'right' | 'top' | 'bottom' | 'cross';
    sharedEmphasis: 'stroke' | 'counter' | 'terminal' | 'bowl' | 'serif';
    letterWeight: 'light' | 'regular' | 'medium' | 'bold' | 'black';
    monogramStyle: 'classic' | 'modern' | 'decorative' | 'minimal';

    // General modifiers
    globalRotation: number;
    globalScale: number;
    strokeVariation: number;
    organicAmount: number;
    symmetryMode: 'none' | 'horizontal' | 'vertical' | 'radial' | 'point';
}

/**
 * Extract all deep parameters from brand name hash
 * Every parameter is deterministically derived from the hash
 */
function extractDeepParams(brandName: string): DeepParams {
    const hash = createHash('sha256').update(brandName.toLowerCase()).digest('hex');
    const rng = createSeededRandom(hash);

    // Helper functions
    const pick = <T>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];
    const range = (min: number, max: number): number => min + rng() * (max - min);
    const rangeInt = (min: number, max: number): number => Math.floor(range(min, max + 0.99));

    return {
        // Bar/Line parameters
        barCount: rangeInt(6, 20),
        barHeightPattern: pick(['ascending', 'descending', 'wave', 'random', 'centered', 'alternating', 'stairs', 'valley']),
        barWidthStyle: pick(['thin', 'medium', 'thick', 'tapered', 'mixed']),
        barSpacing: pick(['tight', 'normal', 'loose', 'varied']),
        barCornerRadius: range(0, 50),
        barAngle: range(-15, 15),
        barOrientation: pick(['horizontal', 'vertical']),
        barAlignment: pick(['top', 'center', 'bottom', 'staggered']),

        // Chevron parameters
        chevronCount: rangeInt(2, 5),
        chevronThickness: range(2, 10),
        chevronAngle: range(20, 70),
        chevronSpacing: pick(['overlapping', 'touching', 'close', 'apart', 'far']),
        chevronTips: pick(['pointed', 'rounded', 'flat']),
        chevronStyle: pick(['solid', 'outline', 'gradient']),
        chevronArrangement: pick(['nested', 'stacked', 'cascading', 'radial']),
        chevronDirection: pick(['up', 'down', 'left', 'right']),

        // Block parameters
        blockCount: rangeInt(2, 5),
        blockShape: pick(['square', 'rect', 'triangle', 'parallelogram', 'hexagon', 'diamond']),
        blockOverlap: range(10, 60),
        blockDepthDir: pick(['left', 'right', 'top', 'bottom', 'topleft', 'bottomright']),
        blockShadowIntensity: range(0.1, 0.5),
        blockRotation: range(0, 45),
        blockScalePattern: pick(['equal', 'ascending', 'descending', 'random']),
        blockArrangement: pick(['diagonal', 'stack', 'scatter', 'grid']),

        // Container/Negative space parameters
        containerShape: pick(['circle', 'square', 'rounded-rect', 'hexagon', 'diamond', 'octagon', 'shield']),
        letterPosition: pick(['centered', 'offset-left', 'offset-right', 'offset-top', 'offset-bottom']),
        letterScale: range(40, 80),
        containerStyle: pick(['stroke', 'fill', 'double', 'dashed']),
        cutoutDepth: range(0.5, 1.0),
        letterStyle: pick(['geometric', 'rounded', 'angular', 'serif', 'minimal']),
        containerThickness: range(2, 8),

        // Clover/Radial parameters
        petalCount: rangeInt(3, 8),
        petalShape: pick(['circle', 'ellipse', 'teardrop', 'diamond', 'leaf', 'heart', 'pointed']),
        petalSizeVariation: range(0, 0.5),
        petalRotationOffset: range(0, 60),
        centerElement: pick(['none', 'circle', 'dot', 'hole', 'ring', 'star']),
        petalOverlap: range(-20, 30),
        petalSpacing: range(0.8, 1.5),
        petalCurve: range(0, 1),

        // Line Fragmentation parameters
        lineCount: rangeInt(8, 30),
        lineThickness: range(1, 4),
        gapPattern: pick(['even', 'random', 'gradient', 'morse', 'cluster']),
        lineAngle: pick(['horizontal', 'diagonal', 'radial', 'vertical', 'curved']),
        fragmentShape: pick(['circle', 'square', 'letter', 'star', 'triangle', 'hexagon']),
        lineEnds: pick(['round', 'flat', 'arrow']),

        // Loop parameters
        loopCount: rangeInt(2, 4),
        loopShape: pick(['circle', 'rounded-rect', 'triangle', 'oval', 'squircle']),
        weaveTightness: range(0.3, 0.9),
        loopStrokeWidth: range(2, 8),
        loopCornerRadius: range(0, 50),
        loopScaleRelation: pick(['equal', 'graduated', 'alternating']),
        loopRotation: range(0, 120),
        loopInterlockStyle: pick(['olympic', 'chain', 'venn', 'celtic']),

        // Monogram parameters
        mergeStyle: pick(['overlapping', 'connected', 'shared-stroke', 'intertwined', 'stacked']),
        letterArrangement: pick(['side-by-side', 'stacked', 'nested', 'diagonal', 'rotated']),
        connectionPoint: pick(['center', 'left', 'right', 'top', 'bottom', 'cross']),
        sharedEmphasis: pick(['stroke', 'counter', 'terminal', 'bowl', 'serif']),
        letterWeight: pick(['light', 'regular', 'medium', 'bold', 'black']),
        monogramStyle: pick(['classic', 'modern', 'decorative', 'minimal']),

        // General modifiers
        globalRotation: range(0, 360),
        globalScale: range(0.8, 1.2),
        strokeVariation: range(0, 0.3),
        organicAmount: range(0, 0.3),
        symmetryMode: pick(['none', 'horizontal', 'vertical', 'radial', 'point'])
    };
}

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

// ============================================================================
// 1. LINE FRAGMENTATION - Deep Parametric Version
// ============================================================================

export function generateLineFragmentation(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const letter = params.brandName.charAt(0).toUpperCase();
    const color = params.primaryColor || 'currentColor';

    const lineCount = dp.lineCount;
    const lineThickness = dp.lineThickness;
    const lineCap = dp.lineEnds === 'round' ? 'round' : dp.lineEnds === 'flat' ? 'butt' : 'square';

    let lines = '';
    const maskId = `mask-${params.brandName.substring(0, 8)}-lf`;

    // Generate fragment mask shape based on dp.fragmentShape
    let maskShape = '';
    switch (dp.fragmentShape) {
        case 'circle':
            maskShape = `<circle cx="50" cy="50" r="40" fill="white"/>`;
            break;
        case 'square':
            maskShape = `<rect x="10" y="10" width="80" height="80" fill="white"/>`;
            break;
        case 'star':
            const starPoints = [];
            for (let i = 0; i < 10; i++) {
                const angle = (i * 36 - 90) * Math.PI / 180;
                const r = i % 2 === 0 ? 40 : 18;
                starPoints.push(`${50 + Math.cos(angle) * r},${50 + Math.sin(angle) * r}`);
            }
            maskShape = `<polygon points="${starPoints.join(' ')}" fill="white"/>`;
            break;
        case 'triangle':
            maskShape = `<polygon points="50,10 90,85 10,85" fill="white"/>`;
            break;
        case 'hexagon':
            const hexPoints = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60 - 30) * Math.PI / 180;
                hexPoints.push(`${50 + Math.cos(angle) * 40},${50 + Math.sin(angle) * 40}`);
            }
            maskShape = `<polygon points="${hexPoints.join(' ')}" fill="white"/>`;
            break;
        case 'letter':
        default:
            maskShape = `<text x="50" y="78" font-family="Arial, sans-serif" font-weight="900" font-size="80" text-anchor="middle" fill="white">${letter}</text>`;
    }

    // Generate lines based on angle pattern
    const step = size / lineCount;

    for (let i = 0; i < lineCount; i++) {
        let x1, y1, x2, y2;

        switch (dp.lineAngle) {
            case 'horizontal':
                x1 = 0; x2 = size;
                y1 = y2 = i * step + step / 2;
                break;
            case 'vertical':
                y1 = 0; y2 = size;
                x1 = x2 = i * step + step / 2;
                break;
            case 'diagonal':
                const diagOffset = (i - lineCount / 2) * step * 1.5;
                x1 = 0; y1 = 50 + diagOffset;
                x2 = size; y2 = 50 + diagOffset - size * 0.3;
                break;
            case 'radial':
                const angle = (i / lineCount) * Math.PI * 2;
                x1 = 50; y1 = 50;
                x2 = 50 + Math.cos(angle) * 50;
                y2 = 50 + Math.sin(angle) * 50;
                break;
            case 'curved':
            default:
                x1 = 0; x2 = size;
                const wave = Math.sin((i / lineCount) * Math.PI * 2) * 10;
                y1 = i * step + step / 2 + wave;
                y2 = i * step + step / 2 - wave;
        }

        // Apply gap pattern
        let dash = '';
        switch (dp.gapPattern) {
            case 'even':
                dash = `stroke-dasharray="${5 + rng() * 10} ${3 + rng() * 5}"`;
                break;
            case 'random':
                const dashValues = [];
                for (let j = 0; j < 6; j++) {
                    dashValues.push(3 + rng() * 15);
                }
                dash = `stroke-dasharray="${dashValues.join(' ')}"`;
                break;
            case 'gradient':
                const gapSize = 2 + (i / lineCount) * 8;
                dash = `stroke-dasharray="${15 - gapSize} ${gapSize}"`;
                break;
            case 'morse':
                dash = `stroke-dasharray="${rng() > 0.5 ? '2 2 8 2' : '8 2 2 2'}"`;
                break;
            case 'cluster':
                dash = `stroke-dasharray="${i % 3 === 0 ? '20 5' : '5 3'}"`;
                break;
        }

        lines += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${lineThickness.toFixed(1)}" stroke-linecap="${lineCap}" ${dash} />`;
    }

    const content = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="${size}" height="${size}" fill="black" />
                ${maskShape}
            </mask>
        </defs>
        <g mask="url(#${maskId})" transform="rotate(${dp.globalRotation % 45}, 50, 50)">
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

// ============================================================================
// 2. STAGGERED BARS - Deep Parametric Version
// ============================================================================

export function generateStaggeredBars(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    const barCount = dp.barCount;
    const isVertical = dp.barOrientation === 'vertical';

    // Calculate bar dimensions based on style
    let baseBarWidth: number;
    switch (dp.barWidthStyle) {
        case 'thin': baseBarWidth = size / barCount * 0.4; break;
        case 'thick': baseBarWidth = size / barCount * 0.9; break;
        case 'medium': baseBarWidth = size / barCount * 0.65; break;
        case 'tapered': baseBarWidth = size / barCount * 0.6; break;
        case 'mixed': baseBarWidth = size / barCount * 0.6; break;
        default: baseBarWidth = size / barCount * 0.65;
    }

    // Calculate spacing
    let spacingMultiplier: number;
    switch (dp.barSpacing) {
        case 'tight': spacingMultiplier = 0.8; break;
        case 'loose': spacingMultiplier = 1.4; break;
        case 'varied': spacingMultiplier = 1.0; break;
        default: spacingMultiplier = 1.0;
    }

    const barStep = (size / barCount) * spacingMultiplier;
    const cornerRadius = (baseBarWidth * dp.barCornerRadius / 100);

    let bars = '';

    for (let i = 0; i < barCount; i++) {
        // Calculate height based on pattern
        let heightPercent: number;
        const normalizedI = i / (barCount - 1); // 0 to 1

        switch (dp.barHeightPattern) {
            case 'ascending':
                heightPercent = 0.3 + normalizedI * 0.6;
                break;
            case 'descending':
                heightPercent = 0.9 - normalizedI * 0.6;
                break;
            case 'wave':
                heightPercent = 0.5 + Math.sin(normalizedI * Math.PI * 2) * 0.35;
                break;
            case 'random':
                heightPercent = 0.4 + rng() * 0.5;
                break;
            case 'centered':
                heightPercent = 0.3 + (1 - Math.abs(normalizedI - 0.5) * 2) * 0.6;
                break;
            case 'alternating':
                heightPercent = i % 2 === 0 ? 0.8 : 0.5;
                break;
            case 'stairs':
                heightPercent = 0.3 + Math.floor(normalizedI * 5) / 5 * 0.6;
                break;
            case 'valley':
                heightPercent = 0.9 - (1 - Math.abs(normalizedI - 0.5) * 2) * 0.5;
                break;
            default:
                heightPercent = 0.6;
        }

        // Add organic variation
        heightPercent += (rng() - 0.5) * dp.organicAmount * 0.4;
        heightPercent = Math.max(0.2, Math.min(0.95, heightPercent));

        // Bar width variation for 'mixed' style
        let barWidth = baseBarWidth;
        if (dp.barWidthStyle === 'mixed') {
            barWidth *= 0.7 + rng() * 0.6;
        } else if (dp.barWidthStyle === 'tapered') {
            barWidth *= 0.6 + normalizedI * 0.6;
        }

        // Calculate position based on spacing style
        let pos = i * barStep + (size - barCount * barStep) / 2;
        if (dp.barSpacing === 'varied') {
            pos += (rng() - 0.5) * barStep * 0.3;
        }

        // Calculate bar position and size
        const barHeight = size * heightPercent;
        let startPos: number;

        switch (dp.barAlignment) {
            case 'top':
                startPos = 5;
                break;
            case 'bottom':
                startPos = size - barHeight - 5;
                break;
            case 'staggered':
                startPos = 5 + (i % 2) * 10 + (rng() - 0.5) * 5;
                break;
            case 'center':
            default:
                startPos = (size - barHeight) / 2;
        }

        // Apply rotation transform
        const rotation = dp.barAngle;
        const transform = rotation !== 0 ? `transform="rotate(${rotation.toFixed(1)}, ${pos + barWidth/2}, 50)"` : '';

        if (isVertical) {
            bars += `<rect x="${startPos.toFixed(1)}" y="${pos.toFixed(1)}" width="${barHeight.toFixed(1)}" height="${barWidth.toFixed(1)}" fill="${color}" rx="${cornerRadius.toFixed(1)}" ${transform} />`;
        } else {
            bars += `<rect x="${pos.toFixed(1)}" y="${startPos.toFixed(1)}" width="${barWidth.toFixed(1)}" height="${barHeight.toFixed(1)}" fill="${color}" rx="${cornerRadius.toFixed(1)}" ${transform} />`;
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

// ============================================================================
// 3. 3D BLOCK ASSEMBLY - Deep Parametric Version
// ============================================================================

export function generateBlockAssembly(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    const blockCount = dp.blockCount;
    let blocks = '';

    // Calculate depth offset based on direction
    let depthX = 0, depthY = 0;
    const depthMagnitude = 8 + dp.blockShadowIntensity * 12;
    switch (dp.blockDepthDir) {
        case 'left': depthX = -depthMagnitude; break;
        case 'right': depthX = depthMagnitude; break;
        case 'top': depthY = -depthMagnitude; break;
        case 'bottom': depthY = depthMagnitude; break;
        case 'topleft': depthX = -depthMagnitude * 0.7; depthY = -depthMagnitude * 0.7; break;
        case 'bottomright': depthX = depthMagnitude * 0.7; depthY = depthMagnitude * 0.7; break;
    }

    // Generate blocks based on arrangement
    const blockPositions: {x: number, y: number, scale: number}[] = [];

    switch (dp.blockArrangement) {
        case 'diagonal':
            for (let i = 0; i < blockCount; i++) {
                blockPositions.push({
                    x: 15 + i * (70 / blockCount) * (1 - dp.blockOverlap / 100),
                    y: 15 + i * (70 / blockCount) * (1 - dp.blockOverlap / 100),
                    scale: 1
                });
            }
            break;
        case 'stack':
            for (let i = 0; i < blockCount; i++) {
                blockPositions.push({
                    x: 50 - 20 + i * 8,
                    y: 15 + i * (70 / blockCount) * (1 - dp.blockOverlap / 100),
                    scale: 1
                });
            }
            break;
        case 'scatter':
            for (let i = 0; i < blockCount; i++) {
                blockPositions.push({
                    x: 15 + rng() * 50,
                    y: 15 + rng() * 50,
                    scale: 0.7 + rng() * 0.6
                });
            }
            break;
        case 'grid':
            const gridSize = Math.ceil(Math.sqrt(blockCount));
            for (let i = 0; i < blockCount; i++) {
                blockPositions.push({
                    x: 15 + (i % gridSize) * (70 / gridSize),
                    y: 15 + Math.floor(i / gridSize) * (70 / gridSize),
                    scale: 1
                });
            }
            break;
    }

    // Apply scale pattern
    blockPositions.forEach((pos, i) => {
        switch (dp.blockScalePattern) {
            case 'ascending':
                pos.scale *= 0.6 + (i / blockCount) * 0.6;
                break;
            case 'descending':
                pos.scale *= 1.2 - (i / blockCount) * 0.6;
                break;
            case 'random':
                pos.scale *= 0.7 + rng() * 0.6;
                break;
        }
    });

    // Generate shape paths for each block
    blockPositions.forEach((pos, i) => {
        const blockSize = 30 * pos.scale;
        const rotation = dp.blockRotation * (i % 2 === 0 ? 1 : -1);
        const opacity = 0.6 + (i / blockCount) * 0.3;

        let shapePath = '';
        const cx = pos.x + blockSize / 2;
        const cy = pos.y + blockSize / 2;

        switch (dp.blockShape) {
            case 'square':
                // Shadow first
                blocks += `<rect x="${(pos.x + depthX).toFixed(1)}" y="${(pos.y + depthY).toFixed(1)}" width="${blockSize.toFixed(1)}" height="${blockSize.toFixed(1)}" fill="black" opacity="${(dp.blockShadowIntensity * 0.5).toFixed(2)}" rx="3" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                blocks += `<rect x="${pos.x.toFixed(1)}" y="${pos.y.toFixed(1)}" width="${blockSize.toFixed(1)}" height="${blockSize.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}" rx="3" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                break;
            case 'rect':
                const rectW = blockSize * 1.3;
                const rectH = blockSize * 0.7;
                blocks += `<rect x="${(pos.x + depthX).toFixed(1)}" y="${(pos.y + depthY).toFixed(1)}" width="${rectW.toFixed(1)}" height="${rectH.toFixed(1)}" fill="black" opacity="${(dp.blockShadowIntensity * 0.5).toFixed(2)}" rx="3" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                blocks += `<rect x="${pos.x.toFixed(1)}" y="${pos.y.toFixed(1)}" width="${rectW.toFixed(1)}" height="${rectH.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}" rx="3" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                break;
            case 'triangle':
                const triPoints = `${cx},${pos.y} ${pos.x + blockSize},${pos.y + blockSize} ${pos.x},${pos.y + blockSize}`;
                const triShadow = `${cx + depthX},${pos.y + depthY} ${pos.x + blockSize + depthX},${pos.y + blockSize + depthY} ${pos.x + depthX},${pos.y + blockSize + depthY}`;
                blocks += `<polygon points="${triShadow}" fill="black" opacity="${(dp.blockShadowIntensity * 0.5).toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                blocks += `<polygon points="${triPoints}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                break;
            case 'parallelogram':
                const skew = blockSize * 0.3;
                const paraPoints = `${pos.x + skew},${pos.y} ${pos.x + blockSize + skew},${pos.y} ${pos.x + blockSize},${pos.y + blockSize} ${pos.x},${pos.y + blockSize}`;
                const paraShadow = `${pos.x + skew + depthX},${pos.y + depthY} ${pos.x + blockSize + skew + depthX},${pos.y + depthY} ${pos.x + blockSize + depthX},${pos.y + blockSize + depthY} ${pos.x + depthX},${pos.y + blockSize + depthY}`;
                blocks += `<polygon points="${paraShadow}" fill="black" opacity="${(dp.blockShadowIntensity * 0.5).toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                blocks += `<polygon points="${paraPoints}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                break;
            case 'hexagon':
                const hexPoints: string[] = [];
                const hexShadowPoints: string[] = [];
                for (let j = 0; j < 6; j++) {
                    const angle = (j * 60 - 30) * Math.PI / 180;
                    const hx = cx + Math.cos(angle) * blockSize / 2;
                    const hy = cy + Math.sin(angle) * blockSize / 2;
                    hexPoints.push(`${hx.toFixed(1)},${hy.toFixed(1)}`);
                    hexShadowPoints.push(`${(hx + depthX).toFixed(1)},${(hy + depthY).toFixed(1)}`);
                }
                blocks += `<polygon points="${hexShadowPoints.join(' ')}" fill="black" opacity="${(dp.blockShadowIntensity * 0.5).toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                blocks += `<polygon points="${hexPoints.join(' ')}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                break;
            case 'diamond':
                const diamondPoints = `${cx},${pos.y} ${pos.x + blockSize},${cy} ${cx},${pos.y + blockSize} ${pos.x},${cy}`;
                const diamondShadow = `${cx + depthX},${pos.y + depthY} ${pos.x + blockSize + depthX},${cy + depthY} ${cx + depthX},${pos.y + blockSize + depthY} ${pos.x + depthX},${cy + depthY}`;
                blocks += `<polygon points="${diamondShadow}" fill="black" opacity="${(dp.blockShadowIntensity * 0.5).toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                blocks += `<polygon points="${diamondPoints}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation.toFixed(1)}, ${cx.toFixed(1)}, ${cy.toFixed(1)})"/>`;
                break;
        }
    });

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

// ============================================================================
// 4. MOTION CHEVRONS - Deep Parametric Version
// ============================================================================

export function generateMotionChevrons(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    const count = dp.chevronCount;
    const thickness = dp.chevronThickness;
    const angle = dp.chevronAngle;

    // Calculate spacing based on style
    let spacingValue: number;
    switch (dp.chevronSpacing) {
        case 'overlapping': spacingValue = -thickness * 0.3; break;
        case 'touching': spacingValue = 0; break;
        case 'close': spacingValue = thickness * 0.5; break;
        case 'apart': spacingValue = thickness * 1.5; break;
        case 'far': spacingValue = thickness * 2.5; break;
        default: spacingValue = thickness;
    }

    let paths = '';
    const centerX = size / 2;
    const centerY = size / 2;

    // Calculate chevron dimensions
    const chevronWidth = size * 0.5;
    const chevronHeight = chevronWidth * Math.tan(angle * Math.PI / 180) / 2;

    // Stroke style
    const lineCap = dp.chevronTips === 'rounded' ? 'round' : dp.chevronTips === 'flat' ? 'square' : 'butt';

    // Rotation based on direction
    let rotation = 0;
    switch (dp.chevronDirection) {
        case 'up': rotation = 0; break;
        case 'down': rotation = 180; break;
        case 'left': rotation = -90; break;
        case 'right': rotation = 90; break;
    }

    // Generate chevrons based on arrangement
    for (let i = 0; i < count; i++) {
        let cx = centerX, cy = centerY;
        let currentWidth = chevronWidth;
        let currentHeight = chevronHeight;
        let opacity = 1 - (i * 0.15);
        let currentThickness = thickness;

        switch (dp.chevronArrangement) {
            case 'nested':
                const scaleFactor = 1 - (i / count) * 0.5;
                currentWidth *= scaleFactor;
                currentHeight *= scaleFactor;
                break;
            case 'stacked':
                cy = centerY - (count - 1) * (chevronHeight + spacingValue) / 2 + i * (chevronHeight + spacingValue);
                break;
            case 'cascading':
                cx = centerX + i * 5;
                cy = centerY + i * (chevronHeight * 0.7 + spacingValue);
                opacity = 1 - (i * 0.1);
                break;
            case 'radial':
                const radialAngle = (i / count) * Math.PI * 2;
                cx = centerX + Math.cos(radialAngle) * 15;
                cy = centerY + Math.sin(radialAngle) * 15;
                rotation = (i / count) * 360;
                break;
        }

        // Generate chevron path
        let d: string;
        const left = cx - currentWidth / 2;
        const right = cx + currentWidth / 2;
        const top = cy - currentHeight;
        const bottom = cy + currentHeight;

        if (dp.chevronStyle === 'solid') {
            // Filled chevron
            d = `M ${left} ${top} L ${cx} ${cy} L ${right} ${top} L ${right} ${top + thickness} L ${cx} ${cy + thickness * 0.5} L ${left} ${top + thickness} Z`;
            paths += `<path d="${d}" fill="${color}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation}, ${centerX}, ${centerY})"/>`;
        } else {
            // Stroke chevron
            d = `M ${left} ${top} L ${cx} ${cy} L ${right} ${top}`;
            const strokeStyle = dp.chevronStyle === 'gradient'
                ? `stroke="${color}" stroke-opacity="${(0.5 + i * 0.15).toFixed(2)}"`
                : `stroke="${color}"`;
            paths += `<path d="${d}" fill="none" ${strokeStyle} stroke-width="${currentThickness.toFixed(1)}" stroke-linecap="${lineCap}" stroke-linejoin="${lineCap}" opacity="${opacity.toFixed(2)}" transform="rotate(${rotation}, ${centerX}, ${centerY})"/>`;
        }
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

// ============================================================================
// 5. NEGATIVE SPACE LETTER - Deep Parametric Version
// ============================================================================

export function generateNegativeSpace(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const letter = params.brandName.charAt(0).toUpperCase();
    const color = params.primaryColor || 'currentColor';

    const containerSize = size * 0.8;
    const containerX = (size - containerSize) / 2;
    const containerY = (size - containerSize) / 2;
    const strokeWidth = dp.containerThickness;
    const cornerR = dp.containerShape === 'rounded-rect' ? containerSize * 0.15 : 0;

    // Calculate letter offset
    let letterOffsetX = 0, letterOffsetY = 0;
    switch (dp.letterPosition) {
        case 'offset-left': letterOffsetX = -5; break;
        case 'offset-right': letterOffsetX = 5; break;
        case 'offset-top': letterOffsetY = -5; break;
        case 'offset-bottom': letterOffsetY = 5; break;
    }

    // Font weight
    let fontWeight = 'bold';
    switch (dp.letterWeight) {
        case 'light': fontWeight = '300'; break;
        case 'regular': fontWeight = '400'; break;
        case 'medium': fontWeight = '500'; break;
        case 'bold': fontWeight = '700'; break;
        case 'black': fontWeight = '900'; break;
    }

    const letterSize = containerSize * dp.letterScale / 100;

    // Generate container shape path
    let containerPath = '';
    const cx = size / 2;
    const cy = size / 2;
    const r = containerSize / 2;

    switch (dp.containerShape) {
        case 'circle':
            containerPath = `<circle cx="${cx}" cy="${cy}" r="${r}" />`;
            break;
        case 'square':
            containerPath = `<rect x="${containerX}" y="${containerY}" width="${containerSize}" height="${containerSize}" />`;
            break;
        case 'rounded-rect':
            containerPath = `<rect x="${containerX}" y="${containerY}" width="${containerSize}" height="${containerSize}" rx="${cornerR}" />`;
            break;
        case 'hexagon':
            const hexPoints: string[] = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60 - 30) * Math.PI / 180;
                hexPoints.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`);
            }
            containerPath = `<polygon points="${hexPoints.join(' ')}" />`;
            break;
        case 'diamond':
            containerPath = `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" />`;
            break;
        case 'octagon':
            const octPoints: string[] = [];
            for (let i = 0; i < 8; i++) {
                const angle = (i * 45 - 22.5) * Math.PI / 180;
                octPoints.push(`${cx + Math.cos(angle) * r},${cy + Math.sin(angle) * r}`);
            }
            containerPath = `<polygon points="${octPoints.join(' ')}" />`;
            break;
        case 'shield':
            containerPath = `<path d="M ${cx} ${cy - r} L ${cx + r} ${cy - r * 0.5} L ${cx + r} ${cy + r * 0.3} Q ${cx + r} ${cy + r} ${cx} ${cy + r} Q ${cx - r} ${cy + r} ${cx - r} ${cy + r * 0.3} L ${cx - r} ${cy - r * 0.5} Z" />`;
            break;
    }

    let content = '';
    const maskId = `neg-mask-${params.brandName.substring(0, 8)}`;

    if (dp.containerStyle === 'fill') {
        // Filled container with cutout letter
        content = `
            <defs>
                <mask id="${maskId}">
                    <rect x="0" y="0" width="${size}" height="${size}" fill="white" />
                    <text x="${cx + letterOffsetX}" y="${cy + letterSize * 0.35 + letterOffsetY}"
                          font-family="Arial, sans-serif" font-weight="${fontWeight}"
                          font-size="${letterSize}" text-anchor="middle" fill="black">${letter}</text>
                </mask>
            </defs>
            <g mask="url(#${maskId})" fill="${color}">
                ${containerPath}
            </g>
        `;
    } else if (dp.containerStyle === 'stroke') {
        // Stroked container with letter inside
        content = `
            <g fill="none" stroke="${color}" stroke-width="${strokeWidth}">
                ${containerPath}
            </g>
            <text x="${cx + letterOffsetX}" y="${cy + letterSize * 0.35 + letterOffsetY}"
                  font-family="Arial, sans-serif" font-weight="${fontWeight}"
                  font-size="${letterSize * 0.7}" text-anchor="middle" fill="${color}">${letter}</text>
        `;
    } else if (dp.containerStyle === 'double') {
        // Double stroke container
        const innerR = r * 0.85;
        content = `
            <g fill="none" stroke="${color}" stroke-width="${strokeWidth * 0.6}">
                ${containerPath}
            </g>
            <g fill="none" stroke="${color}" stroke-width="${strokeWidth * 0.6}" transform="scale(0.85) translate(${size * 0.088}, ${size * 0.088})">
                ${containerPath}
            </g>
            <text x="${cx + letterOffsetX}" y="${cy + letterSize * 0.3 + letterOffsetY}"
                  font-family="Arial, sans-serif" font-weight="${fontWeight}"
                  font-size="${letterSize * 0.6}" text-anchor="middle" fill="${color}">${letter}</text>
        `;
    } else {
        // Dashed container
        content = `
            <g fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-dasharray="8 4">
                ${containerPath}
            </g>
            <text x="${cx + letterOffsetX}" y="${cy + letterSize * 0.35 + letterOffsetY}"
                  font-family="Arial, sans-serif" font-weight="${fontWeight}"
                  font-size="${letterSize * 0.7}" text-anchor="middle" fill="${color}">${letter}</text>
        `;
    }

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

// ============================================================================
// 6. INTERLOCKING LOOPS - Deep Parametric Version
// ============================================================================

export function generateInterlockingLoops(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    const loopCount = dp.loopCount;
    const strokeWidth = dp.loopStrokeWidth;
    const loopSize = size * 0.25;
    const tightness = dp.weaveTightness;

    let paths = '';
    const cx = size / 2;
    const cy = size / 2;

    // Generate loop positions based on interlock style
    const loops: {x: number, y: number, scale: number, rotation: number}[] = [];

    switch (dp.loopInterlockStyle) {
        case 'olympic':
            // Olympic rings style - horizontal arrangement
            const spacing = loopSize * (2 - tightness);
            for (let i = 0; i < loopCount; i++) {
                const row = i >= 2 ? 1 : 0;
                const col = i >= 2 ? i - 2 : i;
                const colOffset = row === 1 ? spacing / 2 : 0;
                loops.push({
                    x: cx - (loopCount > 3 ? spacing : spacing / 2) + col * spacing + colOffset,
                    y: cy - loopSize * 0.3 + row * loopSize * 0.7,
                    scale: 1,
                    rotation: 0
                });
            }
            break;
        case 'chain':
            // Chain links - linear arrangement
            for (let i = 0; i < loopCount; i++) {
                loops.push({
                    x: cx - (loopCount - 1) * loopSize * (1 - tightness * 0.3) / 2 + i * loopSize * (1 - tightness * 0.3),
                    y: cy + (i % 2 === 0 ? 0 : loopSize * 0.1),
                    scale: 1,
                    rotation: i % 2 === 0 ? 0 : 15
                });
            }
            break;
        case 'venn':
            // Venn diagram - centered overlapping
            for (let i = 0; i < loopCount; i++) {
                const angle = (i / loopCount) * Math.PI * 2 + dp.loopRotation * Math.PI / 180;
                const dist = loopSize * (1 - tightness) * 0.8;
                loops.push({
                    x: cx + Math.cos(angle) * dist,
                    y: cy + Math.sin(angle) * dist,
                    scale: 1,
                    rotation: 0
                });
            }
            break;
        case 'celtic':
            // Celtic knot - triangular arrangement with weaving
            for (let i = 0; i < loopCount; i++) {
                const angle = (i / loopCount) * Math.PI * 2 - Math.PI / 2;
                const dist = loopSize * (1.2 - tightness * 0.5);
                loops.push({
                    x: cx + Math.cos(angle) * dist,
                    y: cy + Math.sin(angle) * dist,
                    scale: 1,
                    rotation: (i / loopCount) * 360
                });
            }
            break;
    }

    // Apply scale relation
    loops.forEach((loop, i) => {
        switch (dp.loopScaleRelation) {
            case 'graduated':
                loop.scale = 0.8 + (i / loops.length) * 0.4;
                break;
            case 'alternating':
                loop.scale = i % 2 === 0 ? 1 : 0.8;
                break;
        }
    });

    // Generate loop shapes
    loops.forEach((loop, i) => {
        const actualSize = loopSize * loop.scale;
        const cornerR = actualSize * dp.loopCornerRadius / 100;
        const opacity = 0.85 + (i / loops.length) * 0.15;

        let shapePath = '';

        switch (dp.loopShape) {
            case 'circle':
                shapePath = `<circle cx="${loop.x.toFixed(1)}" cy="${loop.y.toFixed(1)}" r="${actualSize.toFixed(1)}" />`;
                break;
            case 'rounded-rect':
                shapePath = `<rect x="${(loop.x - actualSize).toFixed(1)}" y="${(loop.y - actualSize * 0.7).toFixed(1)}" width="${(actualSize * 2).toFixed(1)}" height="${(actualSize * 1.4).toFixed(1)}" rx="${cornerR.toFixed(1)}" transform="rotate(${loop.rotation}, ${loop.x.toFixed(1)}, ${loop.y.toFixed(1)})" />`;
                break;
            case 'oval':
                shapePath = `<ellipse cx="${loop.x.toFixed(1)}" cy="${loop.y.toFixed(1)}" rx="${actualSize.toFixed(1)}" ry="${(actualSize * 0.7).toFixed(1)}" transform="rotate(${loop.rotation}, ${loop.x.toFixed(1)}, ${loop.y.toFixed(1)})" />`;
                break;
            case 'triangle':
                const triPoints: string[] = [];
                for (let j = 0; j < 3; j++) {
                    const angle = (j / 3) * Math.PI * 2 - Math.PI / 2 + loop.rotation * Math.PI / 180;
                    triPoints.push(`${(loop.x + Math.cos(angle) * actualSize).toFixed(1)},${(loop.y + Math.sin(angle) * actualSize).toFixed(1)}`);
                }
                shapePath = `<polygon points="${triPoints.join(' ')}" />`;
                break;
            case 'squircle':
                // Superellipse approximation
                const n = 4; // squircle power
                const squirclePoints: string[] = [];
                for (let j = 0; j < 32; j++) {
                    const t = (j / 32) * Math.PI * 2;
                    const cos = Math.cos(t);
                    const sin = Math.sin(t);
                    const x = loop.x + Math.sign(cos) * Math.pow(Math.abs(cos), 2/n) * actualSize;
                    const y = loop.y + Math.sign(sin) * Math.pow(Math.abs(sin), 2/n) * actualSize;
                    squirclePoints.push(`${x.toFixed(1)},${y.toFixed(1)}`);
                }
                shapePath = `<polygon points="${squirclePoints.join(' ')}" />`;
                break;
        }

        paths += `<g fill="none" stroke="${color}" stroke-width="${strokeWidth.toFixed(1)}" opacity="${opacity.toFixed(2)}">
            ${shapePath}
        </g>`;
    });

    // Add center element
    if (dp.loopInterlockStyle === 'venn' || dp.loopInterlockStyle === 'celtic') {
        paths += `<circle cx="${cx}" cy="${cy}" r="${(strokeWidth * 1.5).toFixed(1)}" fill="${color}" />`;
    }

    return [{
        id: `il-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'interlocking-loops',
        variant: 1,
        svg: wrapSvg(paths),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 91 } as any
    }];
}

// ============================================================================
// 7. MONOGRAM MERGE - Deep Parametric Version
// ============================================================================

export function generateMonogramMerge(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    // Get letters
    const words = params.brandName.split(/\s+/);
    const l1 = words[0]?.charAt(0).toUpperCase() || params.brandName.charAt(0).toUpperCase();
    const l2 = words.length > 1
        ? words[1].charAt(0).toUpperCase()
        : params.brandName.charAt(1)?.toUpperCase() || l1;

    // Font weight mapping
    let fontWeight = '700';
    switch (dp.letterWeight) {
        case 'light': fontWeight = '300'; break;
        case 'regular': fontWeight = '400'; break;
        case 'medium': fontWeight = '500'; break;
        case 'bold': fontWeight = '700'; break;
        case 'black': fontWeight = '900'; break;
    }

    const letterSize = size * 0.5;
    const cx = size / 2;
    const cy = size / 2;

    let content = '';

    // Calculate positions based on arrangement
    let l1x = cx, l1y = cy, l2x = cx, l2y = cy;
    let l1rotation = 0, l2rotation = 0;

    switch (dp.letterArrangement) {
        case 'side-by-side':
            l1x = cx - letterSize * 0.25;
            l2x = cx + letterSize * 0.25;
            break;
        case 'stacked':
            l1y = cy - letterSize * 0.25;
            l2y = cy + letterSize * 0.25;
            break;
        case 'nested':
            // l2 slightly offset inside l1
            l2x = cx + letterSize * 0.1;
            l2y = cy + letterSize * 0.05;
            break;
        case 'diagonal':
            l1x = cx - letterSize * 0.2;
            l1y = cy - letterSize * 0.15;
            l2x = cx + letterSize * 0.2;
            l2y = cy + letterSize * 0.15;
            break;
        case 'rotated':
            l1rotation = -15;
            l2rotation = 15;
            l1x = cx - letterSize * 0.15;
            l2x = cx + letterSize * 0.15;
            break;
    }

    // Calculate overlap/merge
    const overlapAmount = dp.mergeStyle === 'overlapping' ? 0.3 :
                          dp.mergeStyle === 'connected' ? 0.15 :
                          dp.mergeStyle === 'shared-stroke' ? 0.25 :
                          dp.mergeStyle === 'intertwined' ? 0.35 : 0.1;

    // Apply overlap
    if (dp.letterArrangement === 'side-by-side') {
        l1x += letterSize * overlapAmount * 0.3;
        l2x -= letterSize * overlapAmount * 0.3;
    }

    // Generate based on merge style
    switch (dp.mergeStyle) {
        case 'overlapping':
            content = `
                <text x="${l1x.toFixed(1)}" y="${(l1y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}"
                      opacity="0.8" transform="rotate(${l1rotation}, ${l1x.toFixed(1)}, ${l1y.toFixed(1)})">${l1}</text>
                <text x="${l2x.toFixed(1)}" y="${(l2y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}"
                      opacity="0.8" style="mix-blend-mode: multiply"
                      transform="rotate(${l2rotation}, ${l2x.toFixed(1)}, ${l2y.toFixed(1)})">${l2}</text>
            `;
            break;

        case 'connected':
            // Draw connecting line between letters
            content = `
                <text x="${l1x.toFixed(1)}" y="${(l1y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}"
                      transform="rotate(${l1rotation}, ${l1x.toFixed(1)}, ${l1y.toFixed(1)})">${l1}</text>
                <line x1="${(l1x + letterSize * 0.2).toFixed(1)}" y1="${cy.toFixed(1)}"
                      x2="${(l2x - letterSize * 0.2).toFixed(1)}" y2="${cy.toFixed(1)}"
                      stroke="${color}" stroke-width="3" stroke-linecap="round"/>
                <text x="${l2x.toFixed(1)}" y="${(l2y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}"
                      transform="rotate(${l2rotation}, ${l2x.toFixed(1)}, ${l2y.toFixed(1)})">${l2}</text>
            `;
            break;

        case 'shared-stroke':
            // Simplified strokes sharing a common element
            const strokeW = letterSize * 0.15;
            const sharedX = cx;
            content = `
                <line x1="${(sharedX - letterSize * 0.3).toFixed(1)}" y1="${(cy - letterSize * 0.3).toFixed(1)}"
                      x2="${(sharedX - letterSize * 0.3).toFixed(1)}" y2="${(cy + letterSize * 0.3).toFixed(1)}"
                      stroke="${color}" stroke-width="${strokeW.toFixed(1)}" stroke-linecap="round"/>
                <line x1="${sharedX.toFixed(1)}" y1="${(cy - letterSize * 0.3).toFixed(1)}"
                      x2="${sharedX.toFixed(1)}" y2="${(cy + letterSize * 0.3).toFixed(1)}"
                      stroke="${color}" stroke-width="${strokeW.toFixed(1)}" stroke-linecap="round"/>
                <line x1="${(sharedX + letterSize * 0.3).toFixed(1)}" y1="${(cy - letterSize * 0.3).toFixed(1)}"
                      x2="${(sharedX + letterSize * 0.3).toFixed(1)}" y2="${(cy + letterSize * 0.3).toFixed(1)}"
                      stroke="${color}" stroke-width="${strokeW.toFixed(1)}" stroke-linecap="round"/>
                <line x1="${(sharedX - letterSize * 0.3).toFixed(1)}" y1="${(cy - letterSize * 0.1).toFixed(1)}"
                      x2="${sharedX.toFixed(1)}" y2="${(cy - letterSize * 0.1).toFixed(1)}"
                      stroke="${color}" stroke-width="${(strokeW * 0.8).toFixed(1)}" stroke-linecap="round"/>
                <line x1="${sharedX.toFixed(1)}" y1="${(cy + letterSize * 0.1).toFixed(1)}"
                      x2="${(sharedX + letterSize * 0.3).toFixed(1)}" y2="${(cy + letterSize * 0.1).toFixed(1)}"
                      stroke="${color}" stroke-width="${(strokeW * 0.8).toFixed(1)}" stroke-linecap="round"/>
            `;
            break;

        case 'intertwined':
            // Letters with weaving effect
            const maskId = `intertwine-${params.brandName.substring(0, 6)}`;
            content = `
                <defs>
                    <mask id="${maskId}">
                        <rect x="0" y="0" width="${size}" height="${size}" fill="white"/>
                        <rect x="${(cx - 5).toFixed(1)}" y="${(cy - letterSize * 0.15).toFixed(1)}"
                              width="10" height="${(letterSize * 0.3).toFixed(1)}" fill="black"/>
                    </mask>
                </defs>
                <text x="${l1x.toFixed(1)}" y="${(l1y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}"
                      mask="url(#${maskId})">${l1}</text>
                <text x="${l2x.toFixed(1)}" y="${(l2y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}">${l2}</text>
            `;
            break;

        case 'stacked':
        default:
            content = `
                <text x="${l1x.toFixed(1)}" y="${(l1y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}"
                      transform="rotate(${l1rotation}, ${l1x.toFixed(1)}, ${l1y.toFixed(1)})">${l1}</text>
                <text x="${l2x.toFixed(1)}" y="${(l2y + letterSize * 0.35).toFixed(1)}"
                      font-family="Arial, sans-serif" font-weight="${fontWeight}"
                      font-size="${(letterSize * 0.8).toFixed(1)}" text-anchor="middle" fill="${color}" opacity="0.7"
                      transform="rotate(${l2rotation}, ${l2x.toFixed(1)}, ${l2y.toFixed(1)})">${l2}</text>
            `;
    }

    // Add decorative element based on monogramStyle
    if (dp.monogramStyle === 'decorative') {
        content += `<circle cx="${cx}" cy="${(cy + letterSize * 0.5).toFixed(1)}" r="3" fill="${color}"/>`;
    } else if (dp.monogramStyle === 'classic') {
        content += `<line x1="${(cx - letterSize * 0.4).toFixed(1)}" y1="${(cy + letterSize * 0.5).toFixed(1)}"
                          x2="${(cx + letterSize * 0.4).toFixed(1)}" y2="${(cy + letterSize * 0.5).toFixed(1)}"
                          stroke="${color}" stroke-width="1.5"/>`;
    }

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

// ============================================================================
// 8. SINGLE CONTINUOUS STROKE - Deep Parametric Version
// ============================================================================

export function generateContinuousStroke(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    const strokeWidth = 3 + dp.strokeVariation * 8;
    const margin = 15;
    const cx = size / 2;
    const cy = size / 2;

    // Generate control points based on brand name hash
    const pointCount = 4 + Math.floor(rng() * 4);
    const points: {x: number, y: number}[] = [];

    // Different path generation strategies
    const strategy = Math.floor(rng() * 5);

    switch (strategy) {
        case 0: // Spiral-ish
            for (let i = 0; i < pointCount; i++) {
                const angle = (i / pointCount) * Math.PI * 2.5;
                const radius = margin + ((size - 2 * margin) / 2) * (1 - i / pointCount * 0.5);
                points.push({
                    x: cx + Math.cos(angle) * radius,
                    y: cy + Math.sin(angle) * radius
                });
            }
            break;
        case 1: // Angular zigzag
            for (let i = 0; i < pointCount; i++) {
                points.push({
                    x: margin + (i / (pointCount - 1)) * (size - 2 * margin),
                    y: i % 2 === 0 ? margin + rng() * 20 : size - margin - rng() * 20
                });
            }
            break;
        case 2: // Flowing wave
            for (let i = 0; i < pointCount; i++) {
                const t = i / (pointCount - 1);
                points.push({
                    x: margin + t * (size - 2 * margin),
                    y: cy + Math.sin(t * Math.PI * 2 + rng()) * (size / 3 - margin)
                });
            }
            break;
        case 3: // Converging lines
            for (let i = 0; i < pointCount; i++) {
                const angle = rng() * Math.PI * 2;
                const dist = 20 + rng() * 25;
                points.push({
                    x: cx + Math.cos(angle) * dist,
                    y: cy + Math.sin(angle) * dist
                });
            }
            break;
        case 4: // Random organic
        default:
            for (let i = 0; i < pointCount; i++) {
                points.push({
                    x: margin + rng() * (size - 2 * margin),
                    y: margin + rng() * (size - 2 * margin)
                });
            }
    }

    // Build smooth curve path
    let d = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

    if (dp.organicAmount > 0.5) {
        // Bezier curves for smoothness
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const next = points[i + 1] || curr;

            const cp1x = prev.x + (curr.x - prev.x) * 0.5;
            const cp1y = prev.y + (curr.y - prev.y) * 0.5;
            const cp2x = curr.x - (next.x - prev.x) * 0.2;
            const cp2y = curr.y - (next.y - prev.y) * 0.2;

            d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
        }
    } else {
        // Quadratic curves
        for (let i = 1; i < points.length; i++) {
            const prev = points[i - 1];
            const curr = points[i];
            const cpx = (prev.x + curr.x) / 2 + (rng() - 0.5) * 20;
            const cpy = (prev.y + curr.y) / 2 + (rng() - 0.5) * 20;
            d += ` Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
        }
    }

    // Optionally close the path
    if (rng() > 0.6) {
        d += ' Z';
    }

    const lineCap = rng() > 0.5 ? 'round' : 'square';

    const content = `<path d="${d}" fill="none" stroke="${color}" stroke-width="${strokeWidth.toFixed(1)}" stroke-linecap="${lineCap}" stroke-linejoin="round" />`;

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

// ============================================================================
// 9. GEOMETRIC LETTER EXTRACT - Deep Parametric Version
// ============================================================================

export function generateGeometricExtract(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const letter = params.brandName.charAt(0).toUpperCase();

    const cx = size / 2;
    const cy = size / 2;

    // Clip shape based on container
    let clipPath = '';
    const clipId = `clip-${params.brandName.substring(0, 8)}-ge`;
    const clipRadius = size * 0.4;

    switch (dp.containerShape) {
        case 'circle':
            clipPath = `<circle cx="${cx}" cy="${cy}" r="${clipRadius}" />`;
            break;
        case 'square':
            clipPath = `<rect x="${cx - clipRadius}" y="${cy - clipRadius}" width="${clipRadius * 2}" height="${clipRadius * 2}" />`;
            break;
        case 'hexagon':
            const hexPoints: string[] = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i * 60 - 30) * Math.PI / 180;
                hexPoints.push(`${cx + Math.cos(angle) * clipRadius},${cy + Math.sin(angle) * clipRadius}`);
            }
            clipPath = `<polygon points="${hexPoints.join(' ')}" />`;
            break;
        case 'diamond':
            clipPath = `<polygon points="${cx},${cy - clipRadius} ${cx + clipRadius},${cy} ${cx},${cy + clipRadius} ${cx - clipRadius},${cy}" />`;
            break;
        default:
            clipPath = `<circle cx="${cx}" cy="${cy}" r="${clipRadius}" />`;
    }

    // Font settings
    let fontWeight = '900';
    switch (dp.letterWeight) {
        case 'light': fontWeight = '300'; break;
        case 'regular': fontWeight = '400'; break;
        case 'medium': fontWeight = '500'; break;
        case 'bold': fontWeight = '700'; break;
        case 'black': fontWeight = '900'; break;
    }

    const letterSize = size * 1.2;
    const rotation = (rng() - 0.5) * 30;
    const offsetX = (rng() - 0.5) * 20;
    const offsetY = (rng() - 0.5) * 20;

    const content = `
        <defs>
            <clipPath id="${clipId}">
                ${clipPath}
            </clipPath>
        </defs>
        <circle cx="${cx}" cy="${cy}" r="${(clipRadius + 3).toFixed(1)}" fill="none" stroke="${color}" stroke-width="2" />
        <g clip-path="url(#${clipId})">
            <text x="${(cx + offsetX).toFixed(1)}" y="${(cy + letterSize * 0.35 + offsetY).toFixed(1)}"
                  font-family="Arial, sans-serif" font-weight="${fontWeight}"
                  font-size="${letterSize.toFixed(1)}" text-anchor="middle" fill="${color}"
                  transform="rotate(${rotation.toFixed(1)}, ${cx}, ${cy})">${letter}</text>
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

// ============================================================================
// 10. CLOVER RADIAL - Deep Parametric Version
// ============================================================================

export function generateCloverRadial(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';

    const cx = size / 2;
    const cy = size / 2;
    const petalCount = dp.petalCount;
    const baseSize = size * 0.18;
    const centerDist = baseSize * dp.petalSpacing;

    let petals = '';

    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2 + (dp.petalRotationOffset * Math.PI / 180);
        const petalX = cx + Math.cos(angle) * centerDist;
        const petalY = cy + Math.sin(angle) * centerDist;

        // Size variation per petal
        const sizeVar = 1 + (rng() - 0.5) * dp.petalSizeVariation * 2;
        const petalSize = baseSize * sizeVar;

        // Rotation for individual petal
        const petalRotation = angle * 180 / Math.PI + 90;

        // Generate petal shape
        switch (dp.petalShape) {
            case 'circle':
                petals += `<circle cx="${petalX.toFixed(1)}" cy="${petalY.toFixed(1)}" r="${petalSize.toFixed(1)}" fill="${color}" opacity="0.85" />`;
                break;
            case 'ellipse':
                petals += `<ellipse cx="${petalX.toFixed(1)}" cy="${petalY.toFixed(1)}" rx="${petalSize.toFixed(1)}" ry="${(petalSize * 0.6).toFixed(1)}" fill="${color}" opacity="0.85" transform="rotate(${petalRotation.toFixed(1)}, ${petalX.toFixed(1)}, ${petalY.toFixed(1)})" />`;
                break;
            case 'teardrop':
                const tdPath = `M ${petalX} ${petalY - petalSize}
                                Q ${petalX + petalSize * 0.8} ${petalY - petalSize * 0.3} ${petalX + petalSize * 0.5} ${petalY + petalSize * 0.5}
                                Q ${petalX} ${petalY + petalSize} ${petalX - petalSize * 0.5} ${petalY + petalSize * 0.5}
                                Q ${petalX - petalSize * 0.8} ${petalY - petalSize * 0.3} ${petalX} ${petalY - petalSize}`;
                petals += `<path d="${tdPath}" fill="${color}" opacity="0.85" transform="rotate(${petalRotation.toFixed(1)}, ${petalX.toFixed(1)}, ${petalY.toFixed(1)})" />`;
                break;
            case 'diamond':
                const diamondPoints = `${petalX},${petalY - petalSize} ${petalX + petalSize * 0.6},${petalY} ${petalX},${petalY + petalSize} ${petalX - petalSize * 0.6},${petalY}`;
                petals += `<polygon points="${diamondPoints}" fill="${color}" opacity="0.85" transform="rotate(${petalRotation.toFixed(1)}, ${petalX.toFixed(1)}, ${petalY.toFixed(1)})" />`;
                break;
            case 'leaf':
                const leafPath = `M ${petalX} ${petalY - petalSize}
                                  C ${petalX + petalSize} ${petalY - petalSize * 0.5} ${petalX + petalSize} ${petalY + petalSize * 0.5} ${petalX} ${petalY + petalSize}
                                  C ${petalX - petalSize} ${petalY + petalSize * 0.5} ${petalX - petalSize} ${petalY - petalSize * 0.5} ${petalX} ${petalY - petalSize}`;
                petals += `<path d="${leafPath}" fill="${color}" opacity="0.85" transform="rotate(${petalRotation.toFixed(1)}, ${petalX.toFixed(1)}, ${petalY.toFixed(1)})" />`;
                break;
            case 'heart':
                const hSize = petalSize * 0.6;
                const heartPath = `M ${petalX} ${petalY + hSize}
                                   C ${petalX - hSize * 2} ${petalY} ${petalX - hSize * 1.5} ${petalY - hSize * 1.5} ${petalX} ${petalY - hSize * 0.5}
                                   C ${petalX + hSize * 1.5} ${petalY - hSize * 1.5} ${petalX + hSize * 2} ${petalY} ${petalX} ${petalY + hSize}`;
                petals += `<path d="${heartPath}" fill="${color}" opacity="0.85" transform="rotate(${petalRotation.toFixed(1)}, ${petalX.toFixed(1)}, ${petalY.toFixed(1)})" />`;
                break;
            case 'pointed':
                const pointedPath = `M ${petalX} ${petalY - petalSize * 1.3}
                                     L ${petalX + petalSize * 0.4} ${petalY + petalSize * 0.5}
                                     Q ${petalX} ${petalY + petalSize} ${petalX - petalSize * 0.4} ${petalY + petalSize * 0.5}
                                     Z`;
                petals += `<path d="${pointedPath}" fill="${color}" opacity="0.85" transform="rotate(${petalRotation.toFixed(1)}, ${petalX.toFixed(1)}, ${petalY.toFixed(1)})" />`;
                break;
            default:
                petals += `<circle cx="${petalX.toFixed(1)}" cy="${petalY.toFixed(1)}" r="${petalSize.toFixed(1)}" fill="${color}" opacity="0.85" />`;
        }
    }

    // Center element
    let centerEl = '';
    const centerSize = size * 0.08;

    switch (dp.centerElement) {
        case 'circle':
            centerEl = `<circle cx="${cx}" cy="${cy}" r="${centerSize}" fill="${color}" />`;
            break;
        case 'dot':
            centerEl = `<circle cx="${cx}" cy="${cy}" r="${centerSize * 0.5}" fill="${color}" />`;
            break;
        case 'hole':
            centerEl = `<circle cx="${cx}" cy="${cy}" r="${centerSize}" fill="var(--bg-color, white)" stroke="${color}" stroke-width="2" />`;
            break;
        case 'ring':
            centerEl = `<circle cx="${cx}" cy="${cy}" r="${centerSize}" fill="none" stroke="${color}" stroke-width="3" />`;
            break;
        case 'star':
            const starPoints: string[] = [];
            for (let i = 0; i < 10; i++) {
                const sAngle = (i * 36 - 90) * Math.PI / 180;
                const sR = i % 2 === 0 ? centerSize : centerSize * 0.4;
                starPoints.push(`${cx + Math.cos(sAngle) * sR},${cy + Math.sin(sAngle) * sR}`);
            }
            centerEl = `<polygon points="${starPoints.join(' ')}" fill="${color}" />`;
            break;
        case 'none':
        default:
            centerEl = '';
    }

    const content = `
        <g>
            ${petals}
            ${centerEl}
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

// ============================================================================
// SINGLE PREVIEWS (Export helpers)
// ============================================================================

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
