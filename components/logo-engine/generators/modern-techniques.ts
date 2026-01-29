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
// 11. RADIAL SUNBURST - Premium rays emanating from center
// ============================================================================

export function generateRadialSunburst(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Deep parametric variation for sunburst
    const rayCount = 6 + Math.floor(rng() * 18); // 6-24 rays
    const rayStyles = ['uniform', 'alternating', 'graduated', 'random', 'grouped', 'fibonacci'];
    const rayStyle = rayStyles[Math.floor(rng() * rayStyles.length)];
    const rayEnds = ['pointed', 'rounded', 'flat', 'tapered', 'bulbed'];
    const rayEnd = rayEnds[Math.floor(rng() * rayEnds.length)];
    const centerStyles = ['none', 'circle', 'ring', 'dot', 'star', 'hexagon'];
    const centerStyle = centerStyles[Math.floor(rng() * centerStyles.length)];

    const innerRadius = 5 + rng() * 15; // 5-20
    const outerRadius = 30 + rng() * 15; // 30-45
    const rayWidth = 2 + rng() * 6; // 2-8
    const rotationOffset = rng() * 360;

    let paths = '';

    // Generate rays
    for (let i = 0; i < rayCount; i++) {
        const angle = (i / rayCount) * Math.PI * 2 + (rotationOffset * Math.PI / 180);

        // Calculate ray length based on style
        let rayLength = outerRadius;
        let currentWidth = rayWidth;

        switch (rayStyle) {
            case 'alternating':
                rayLength = i % 2 === 0 ? outerRadius : outerRadius * 0.6;
                break;
            case 'graduated':
                rayLength = outerRadius * (0.5 + (i / rayCount) * 0.5);
                break;
            case 'random':
                rayLength = outerRadius * (0.5 + rng() * 0.5);
                break;
            case 'grouped':
                const groupIndex = i % 3;
                rayLength = outerRadius * (0.6 + groupIndex * 0.2);
                break;
            case 'fibonacci':
                const fib = [1, 1, 2, 3, 5, 8];
                rayLength = outerRadius * (0.5 + (fib[i % 6] / 8) * 0.5);
                break;
        }

        const x1 = cx + Math.cos(angle) * innerRadius;
        const y1 = cy + Math.sin(angle) * innerRadius;
        const x2 = cx + Math.cos(angle) * rayLength;
        const y2 = cy + Math.sin(angle) * rayLength;

        // Draw ray based on end style
        switch (rayEnd) {
            case 'pointed':
                const tipAngle = 0.05;
                const baseX1 = cx + Math.cos(angle - tipAngle) * innerRadius;
                const baseY1 = cy + Math.sin(angle - tipAngle) * innerRadius;
                const baseX2 = cx + Math.cos(angle + tipAngle) * innerRadius;
                const baseY2 = cy + Math.sin(angle + tipAngle) * innerRadius;
                paths += `<path d="M ${baseX1.toFixed(1)} ${baseY1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)} L ${baseX2.toFixed(1)} ${baseY2.toFixed(1)} Z" fill="${color}"/>`;
                break;
            case 'rounded':
                paths += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${currentWidth.toFixed(1)}" stroke-linecap="round"/>`;
                break;
            case 'tapered':
                const perpAngle = angle + Math.PI / 2;
                const halfW1 = currentWidth / 2;
                const halfW2 = currentWidth / 6;
                paths += `<path d="M ${(x1 + Math.cos(perpAngle) * halfW1).toFixed(1)} ${(y1 + Math.sin(perpAngle) * halfW1).toFixed(1)} L ${(x2 + Math.cos(perpAngle) * halfW2).toFixed(1)} ${(y2 + Math.sin(perpAngle) * halfW2).toFixed(1)} L ${(x2 - Math.cos(perpAngle) * halfW2).toFixed(1)} ${(y2 - Math.sin(perpAngle) * halfW2).toFixed(1)} L ${(x1 - Math.cos(perpAngle) * halfW1).toFixed(1)} ${(y1 - Math.sin(perpAngle) * halfW1).toFixed(1)} Z" fill="${color}"/>`;
                break;
            case 'bulbed':
                paths += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${(currentWidth * 0.7).toFixed(1)}" stroke-linecap="round"/>`;
                paths += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="${(currentWidth * 0.6).toFixed(1)}" fill="${color}"/>`;
                break;
            default: // flat
                paths += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${currentWidth.toFixed(1)}" stroke-linecap="butt"/>`;
        }
    }

    // Center element
    switch (centerStyle) {
        case 'circle':
            paths += `<circle cx="${cx}" cy="${cy}" r="${innerRadius * 0.8}" fill="${color}"/>`;
            break;
        case 'ring':
            paths += `<circle cx="${cx}" cy="${cy}" r="${innerRadius * 0.9}" fill="none" stroke="${color}" stroke-width="2"/>`;
            break;
        case 'dot':
            paths += `<circle cx="${cx}" cy="${cy}" r="${innerRadius * 0.4}" fill="${color}"/>`;
            break;
        case 'star':
            const starPts: string[] = [];
            for (let i = 0; i < 10; i++) {
                const sa = (i * 36 - 90) * Math.PI / 180;
                const sr = i % 2 === 0 ? innerRadius * 0.8 : innerRadius * 0.4;
                starPts.push(`${(cx + Math.cos(sa) * sr).toFixed(1)},${(cy + Math.sin(sa) * sr).toFixed(1)}`);
            }
            paths += `<polygon points="${starPts.join(' ')}" fill="${color}"/>`;
            break;
        case 'hexagon':
            const hexPts: string[] = [];
            for (let i = 0; i < 6; i++) {
                const ha = (i * 60 - 30) * Math.PI / 180;
                hexPts.push(`${(cx + Math.cos(ha) * innerRadius * 0.7).toFixed(1)},${(cy + Math.sin(ha) * innerRadius * 0.7).toFixed(1)}`);
            }
            paths += `<polygon points="${hexPts.join(' ')}" fill="${color}"/>`;
            break;
    }

    return [{
        id: `rs-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'radial-sunburst' as any,
        variant: 1,
        svg: wrapSvg(paths),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 96 } as any
    }];
}

// ============================================================================
// 12. STRIPED ORGANIC - Organic blob with line cuts (like the brain/cloud logo)
// ============================================================================

export function generateStripedOrganic(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Shape variations
    const shapes = ['blob', 'cloud', 'shield', 'leaf', 'drop', 'heart', 'abstract'];
    const shape = shapes[Math.floor(rng() * shapes.length)];
    const stripeCount = 4 + Math.floor(rng() * 8); // 4-12 stripes
    const stripeAngle = rng() * 180; // 0-180 degrees
    const stripeWidth = 3 + rng() * 5; // 3-8
    const stripeGap = 2 + rng() * 4; // 2-6

    const maskId = `stripe-mask-${params.brandName.substring(0, 8)}`;

    // Generate organic shape path
    let shapePath = '';
    const r = 35;

    switch (shape) {
        case 'blob':
            const blobPoints: string[] = [];
            const blobSegs = 8;
            for (let i = 0; i < blobSegs; i++) {
                const angle = (i / blobSegs) * Math.PI * 2;
                const variance = 0.7 + rng() * 0.6;
                const px = cx + Math.cos(angle) * r * variance;
                const py = cy + Math.sin(angle) * r * variance;
                if (i === 0) {
                    blobPoints.push(`M ${px.toFixed(1)} ${py.toFixed(1)}`);
                } else {
                    const prevAngle = ((i - 1) / blobSegs) * Math.PI * 2;
                    const cpx = cx + Math.cos((angle + prevAngle) / 2) * r * 1.2;
                    const cpy = cy + Math.sin((angle + prevAngle) / 2) * r * 1.2;
                    blobPoints.push(`Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)}`);
                }
            }
            shapePath = blobPoints.join(' ') + ' Z';
            break;
        case 'cloud':
            shapePath = `M ${cx - r} ${cy + r * 0.3} Q ${cx - r} ${cy - r * 0.3} ${cx - r * 0.5} ${cy - r * 0.5} Q ${cx - r * 0.3} ${cy - r} ${cx} ${cy - r * 0.7} Q ${cx + r * 0.3} ${cy - r} ${cx + r * 0.5} ${cy - r * 0.5} Q ${cx + r} ${cy - r * 0.3} ${cx + r} ${cy + r * 0.3} Q ${cx + r * 0.8} ${cy + r * 0.8} ${cx} ${cy + r * 0.6} Q ${cx - r * 0.8} ${cy + r * 0.8} ${cx - r} ${cy + r * 0.3} Z`;
            break;
        case 'shield':
            shapePath = `M ${cx} ${cy - r} L ${cx + r} ${cy - r * 0.3} L ${cx + r} ${cy + r * 0.3} Q ${cx + r} ${cy + r} ${cx} ${cy + r} Q ${cx - r} ${cy + r} ${cx - r} ${cy + r * 0.3} L ${cx - r} ${cy - r * 0.3} Z`;
            break;
        case 'leaf':
            shapePath = `M ${cx} ${cy - r} Q ${cx + r * 1.2} ${cy - r * 0.3} ${cx + r * 0.8} ${cy + r * 0.5} Q ${cx + r * 0.3} ${cy + r * 1.2} ${cx} ${cy + r} Q ${cx - r * 0.3} ${cy + r * 1.2} ${cx - r * 0.8} ${cy + r * 0.5} Q ${cx - r * 1.2} ${cy - r * 0.3} ${cx} ${cy - r} Z`;
            break;
        case 'drop':
            shapePath = `M ${cx} ${cy - r} Q ${cx + r} ${cy} ${cx + r * 0.7} ${cy + r * 0.5} Q ${cx + r * 0.5} ${cy + r} ${cx} ${cy + r} Q ${cx - r * 0.5} ${cy + r} ${cx - r * 0.7} ${cy + r * 0.5} Q ${cx - r} ${cy} ${cx} ${cy - r} Z`;
            break;
        case 'heart':
            shapePath = `M ${cx} ${cy + r * 0.8} C ${cx - r * 1.3} ${cy} ${cx - r * 0.8} ${cy - r} ${cx} ${cy - r * 0.4} C ${cx + r * 0.8} ${cy - r} ${cx + r * 1.3} ${cy} ${cx} ${cy + r * 0.8} Z`;
            break;
        default: // abstract
            const pts: {x: number, y: number}[] = [];
            for (let i = 0; i < 6; i++) {
                const angle = (i / 6) * Math.PI * 2 + rng() * 0.5;
                const dist = r * (0.6 + rng() * 0.6);
                pts.push({ x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist });
            }
            shapePath = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
            for (let i = 1; i < pts.length; i++) {
                const cp1x = pts[i-1].x + (pts[i].x - pts[i-1].x) * 0.5 + (rng() - 0.5) * 10;
                const cp1y = pts[i-1].y + (pts[i].y - pts[i-1].y) * 0.5 + (rng() - 0.5) * 10;
                shapePath += ` Q ${cp1x.toFixed(1)} ${cp1y.toFixed(1)} ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
            }
            shapePath += ' Z';
    }

    // Generate stripes
    let stripes = '';
    const angleRad = stripeAngle * Math.PI / 180;
    const totalWidth = stripeWidth + stripeGap;
    const startOffset = -size;

    for (let i = 0; i < stripeCount * 3; i++) {
        const offset = startOffset + i * totalWidth;
        const x1 = cx + Math.cos(angleRad + Math.PI / 2) * offset - Math.cos(angleRad) * size;
        const y1 = cy + Math.sin(angleRad + Math.PI / 2) * offset - Math.sin(angleRad) * size;
        const x2 = cx + Math.cos(angleRad + Math.PI / 2) * offset + Math.cos(angleRad) * size;
        const y2 = cy + Math.sin(angleRad + Math.PI / 2) * offset + Math.sin(angleRad) * size;
        stripes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="white" stroke-width="${stripeWidth.toFixed(1)}"/>`;
    }

    const content = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="${size}" height="${size}" fill="black"/>
                <path d="${shapePath}" fill="white"/>
            </mask>
            <mask id="${maskId}-stripes">
                <rect x="0" y="0" width="${size}" height="${size}" fill="white"/>
                ${stripes}
            </mask>
        </defs>
        <g mask="url(#${maskId})">
            <g mask="url(#${maskId}-stripes)">
                <rect x="0" y="0" width="${size}" height="${size}" fill="${color}"/>
            </g>
        </g>
    `;

    return [{
        id: `so-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'striped-organic' as any,
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 95 } as any
    }];
}

// ============================================================================
// 13. TWISTED SQUARE - Folded/twisted geometric shape (like the flag logo)
// ============================================================================

export function generateTwistedSquare(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Variation parameters
    const baseShapes = ['square', 'diamond', 'rectangle', 'parallelogram'];
    const baseShape = baseShapes[Math.floor(rng() * baseShapes.length)];
    const twistStyles = ['fold', 'ribbon', 'overlap', 'spiral', 'wave'];
    const twistStyle = twistStyles[Math.floor(rng() * twistStyles.length)];
    const twistAmount = 0.2 + rng() * 0.4; // 0.2-0.6
    const rotation = rng() * 45;
    const shapeSize = 28 + rng() * 10;

    let paths = '';

    switch (twistStyle) {
        case 'fold':
            // Two overlapping shapes creating a fold effect
            const foldOffset = shapeSize * twistAmount;
            paths += `<rect x="${(cx - shapeSize / 2 - foldOffset / 2).toFixed(1)}" y="${(cy - shapeSize / 2 - foldOffset / 2).toFixed(1)}" width="${shapeSize.toFixed(1)}" height="${shapeSize.toFixed(1)}" fill="${color}" opacity="0.7" rx="2" transform="rotate(${rotation.toFixed(1)}, ${cx}, ${cy})"/>`;
            paths += `<rect x="${(cx - shapeSize / 2 + foldOffset / 2).toFixed(1)}" y="${(cy - shapeSize / 2 + foldOffset / 2).toFixed(1)}" width="${shapeSize.toFixed(1)}" height="${shapeSize.toFixed(1)}" fill="${color}" rx="2" transform="rotate(${(rotation + 15).toFixed(1)}, ${cx}, ${cy})"/>`;
            break;
        case 'ribbon':
            // Ribbon/möbius-like twist
            const ribbonW = shapeSize * 0.6;
            const ribbonH = shapeSize;
            paths += `<path d="M ${cx - ribbonW} ${cy - ribbonH / 2}
                              Q ${cx} ${cy - ribbonH / 3} ${cx + ribbonW * 0.5} ${cy}
                              Q ${cx} ${cy + ribbonH / 3} ${cx - ribbonW} ${cy + ribbonH / 2}
                              L ${cx - ribbonW + 8} ${cy + ribbonH / 2}
                              Q ${cx + 5} ${cy + ribbonH / 4} ${cx + ribbonW * 0.5 + 5} ${cy}
                              Q ${cx + 5} ${cy - ribbonH / 4} ${cx - ribbonW + 8} ${cy - ribbonH / 2}
                              Z" fill="${color}" transform="rotate(${rotation.toFixed(1)}, ${cx}, ${cy})"/>`;
            break;
        case 'overlap':
            // Two shapes with cutout creating impossible geometry
            const oSize = shapeSize * 0.9;
            const oOffset = oSize * 0.3;
            paths += `<path d="M ${cx - oSize / 2} ${cy - oSize / 2}
                              L ${cx + oSize / 2} ${cy - oSize / 2}
                              L ${cx + oSize / 2} ${cy + oOffset}
                              L ${cx - oOffset} ${cy + oOffset}
                              L ${cx - oOffset} ${cy + oSize / 2}
                              L ${cx - oSize / 2} ${cy + oSize / 2} Z"
                       fill="${color}" transform="rotate(${rotation.toFixed(1)}, ${cx}, ${cy})"/>`;
            paths += `<path d="M ${cx + oOffset} ${cy - oOffset}
                              L ${cx + oSize / 2} ${cy - oOffset}
                              L ${cx + oSize / 2} ${cy + oSize / 2}
                              L ${cx + oOffset} ${cy + oSize / 2} Z"
                       fill="${color}" opacity="0.6" transform="rotate(${rotation.toFixed(1)}, ${cx}, ${cy})"/>`;
            break;
        case 'spiral':
            // Square that appears to spiral
            const spiralSize = shapeSize;
            for (let i = 0; i < 4; i++) {
                const s = spiralSize * (1 - i * 0.15);
                const r = rotation + i * 22.5;
                const o = 1 - i * 0.15;
                paths += `<rect x="${(cx - s / 2).toFixed(1)}" y="${(cy - s / 2).toFixed(1)}" width="${s.toFixed(1)}" height="${s.toFixed(1)}" fill="none" stroke="${color}" stroke-width="3" opacity="${o.toFixed(2)}" rx="2" transform="rotate(${r.toFixed(1)}, ${cx}, ${cy})"/>`;
            }
            break;
        case 'wave':
        default:
            // Wavy/flowing square
            const wSize = shapeSize;
            const wave = wSize * twistAmount * 0.5;
            paths += `<path d="M ${cx - wSize / 2} ${cy - wSize / 2 + wave}
                              Q ${cx} ${cy - wSize / 2 - wave} ${cx + wSize / 2} ${cy - wSize / 2 + wave}
                              Q ${cx + wSize / 2 + wave} ${cy} ${cx + wSize / 2} ${cy + wSize / 2 - wave}
                              Q ${cx} ${cy + wSize / 2 + wave} ${cx - wSize / 2} ${cy + wSize / 2 - wave}
                              Q ${cx - wSize / 2 - wave} ${cy} ${cx - wSize / 2} ${cy - wSize / 2 + wave}
                              Z" fill="${color}" transform="rotate(${rotation.toFixed(1)}, ${cx}, ${cy})"/>`;
    }

    return [{
        id: `ts-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'twisted-square' as any,
        variant: 1,
        svg: wrapSvg(paths),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 94 } as any
    }];
}

// ============================================================================
// 14. ORGANIC DOT CLUSTER - Flowing circle arrangements (like molecular/bubble)
// ============================================================================

export function generateOrganicDotCluster(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Variation parameters
    const dotCount = 5 + Math.floor(rng() * 12); // 5-16 dots
    const arrangements = ['spiral', 'cluster', 'wave', 'grid-organic', 'scatter', 'branch'];
    const arrangement = arrangements[Math.floor(rng() * arrangements.length)];
    const sizeVariation = ['uniform', 'graduated', 'random', 'alternating'];
    const sizeStyle = sizeVariation[Math.floor(rng() * sizeVariation.length)];
    const baseRadius = 4 + rng() * 4; // 4-8
    const spread = 25 + rng() * 15; // 25-40

    let dots = '';
    const positions: {x: number, y: number, r: number}[] = [];

    // Generate dot positions based on arrangement
    for (let i = 0; i < dotCount; i++) {
        let x = cx, y = cy;
        let r = baseRadius;

        // Size variation
        switch (sizeStyle) {
            case 'graduated':
                r = baseRadius * (0.5 + (i / dotCount) * 1);
                break;
            case 'random':
                r = baseRadius * (0.5 + rng() * 1);
                break;
            case 'alternating':
                r = i % 2 === 0 ? baseRadius : baseRadius * 0.6;
                break;
        }

        // Position based on arrangement
        switch (arrangement) {
            case 'spiral':
                const spiralAngle = (i / dotCount) * Math.PI * 3;
                const spiralDist = 8 + (i / dotCount) * spread;
                x = cx + Math.cos(spiralAngle) * spiralDist;
                y = cy + Math.sin(spiralAngle) * spiralDist;
                break;
            case 'cluster':
                const clusterAngle = rng() * Math.PI * 2;
                const clusterDist = rng() * spread;
                x = cx + Math.cos(clusterAngle) * clusterDist;
                y = cy + Math.sin(clusterAngle) * clusterDist;
                break;
            case 'wave':
                x = cx - spread + (i / dotCount) * spread * 2;
                y = cy + Math.sin((i / dotCount) * Math.PI * 2) * spread * 0.5;
                break;
            case 'grid-organic':
                const cols = Math.ceil(Math.sqrt(dotCount));
                const col = i % cols;
                const row = Math.floor(i / cols);
                x = cx - spread + col * (spread * 2 / cols) + (rng() - 0.5) * 8;
                y = cy - spread + row * (spread * 2 / cols) + (rng() - 0.5) * 8;
                break;
            case 'scatter':
                x = cx + (rng() - 0.5) * spread * 2;
                y = cy + (rng() - 0.5) * spread * 2;
                break;
            case 'branch':
                const branchAngle = Math.floor(rng() * 3) * (Math.PI * 2 / 3);
                const branchDist = 5 + (i % 5) * 8;
                x = cx + Math.cos(branchAngle + (i % 5) * 0.1) * branchDist;
                y = cy + Math.sin(branchAngle + (i % 5) * 0.1) * branchDist;
                break;
        }

        positions.push({ x, y, r });
    }

    // Draw connecting lines for some styles
    if (arrangement === 'branch' || arrangement === 'spiral') {
        for (let i = 1; i < positions.length; i++) {
            const p1 = positions[i - 1];
            const p2 = positions[i];
            const dist = Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
            if (dist < spread * 0.8) {
                dots += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${color}" stroke-width="1.5" opacity="0.4"/>`;
            }
        }
    }

    // Draw dots
    positions.forEach((p, i) => {
        const opacity = 0.7 + (i / positions.length) * 0.3;
        dots += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${p.r.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
    });

    return [{
        id: `odc-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'organic-dot-cluster' as any,
        variant: 1,
        svg: wrapSvg(dots),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 93 } as any
    }];
}

// ============================================================================
// 15. SUNRISE HORIZON - Rays above horizon/mountain shape
// ============================================================================

export function generateSunriseHorizon(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;

    // Variation parameters
    const rayCount = 5 + Math.floor(rng() * 10); // 5-14 rays
    const horizonStyles = ['straight', 'wave', 'mountain', 'arch', 'steps'];
    const horizonStyle = horizonStyles[Math.floor(rng() * horizonStyles.length)];
    const rayStyles = ['straight', 'tapered', 'curved', 'bars'];
    const rayStyle = rayStyles[Math.floor(rng() * rayStyles.length)];
    const sunVisible = rng() > 0.4;
    const horizonY = 55 + rng() * 15; // 55-70
    const rayLength = 20 + rng() * 15; // 20-35

    let content = '';
    const maskId = `sunrise-mask-${params.brandName.substring(0, 8)}`;

    // Generate horizon path
    let horizonPath = '';
    switch (horizonStyle) {
        case 'wave':
            horizonPath = `M 10 ${horizonY} Q 30 ${horizonY - 8} 50 ${horizonY} Q 70 ${horizonY + 8} 90 ${horizonY} L 90 95 L 10 95 Z`;
            break;
        case 'mountain':
            horizonPath = `M 10 ${horizonY + 10} L 30 ${horizonY - 5} L 50 ${horizonY + 5} L 70 ${horizonY - 10} L 90 ${horizonY + 10} L 90 95 L 10 95 Z`;
            break;
        case 'arch':
            horizonPath = `M 10 ${horizonY + 5} Q 50 ${horizonY - 15} 90 ${horizonY + 5} L 90 95 L 10 95 Z`;
            break;
        case 'steps':
            horizonPath = `M 10 ${horizonY + 10} L 25 ${horizonY + 10} L 25 ${horizonY} L 50 ${horizonY} L 50 ${horizonY - 10} L 75 ${horizonY - 10} L 75 ${horizonY + 5} L 90 ${horizonY + 5} L 90 95 L 10 95 Z`;
            break;
        default: // straight
            horizonPath = `M 10 ${horizonY} L 90 ${horizonY} L 90 95 L 10 95 Z`;
    }

    // Generate rays
    let rays = '';
    const sunCy = horizonY;
    const angleSpread = Math.PI * 0.8; // 144 degrees
    const startAngle = -Math.PI / 2 - angleSpread / 2;

    for (let i = 0; i < rayCount; i++) {
        const angle = startAngle + (i / (rayCount - 1)) * angleSpread;
        const x1 = cx;
        const y1 = sunCy;
        const len = rayLength * (0.7 + rng() * 0.6);
        const x2 = cx + Math.cos(angle) * len;
        const y2 = sunCy + Math.sin(angle) * len;

        switch (rayStyle) {
            case 'tapered':
                const perpAngle = angle + Math.PI / 2;
                const w1 = 3, w2 = 0.5;
                rays += `<path d="M ${(x1 + Math.cos(perpAngle) * w1).toFixed(1)} ${(y1 + Math.sin(perpAngle) * w1).toFixed(1)} L ${(x2 + Math.cos(perpAngle) * w2).toFixed(1)} ${(y2 + Math.sin(perpAngle) * w2).toFixed(1)} L ${(x2 - Math.cos(perpAngle) * w2).toFixed(1)} ${(y2 - Math.sin(perpAngle) * w2).toFixed(1)} L ${(x1 - Math.cos(perpAngle) * w1).toFixed(1)} ${(y1 - Math.sin(perpAngle) * w1).toFixed(1)} Z" fill="${color}"/>`;
                break;
            case 'curved':
                const cpx = x1 + Math.cos(angle) * len * 0.5 + (rng() - 0.5) * 10;
                const cpy = y1 + Math.sin(angle) * len * 0.5 - 5;
                rays += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${cpx.toFixed(1)} ${cpy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
                break;
            case 'bars':
                rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
                break;
            default: // straight
                rays += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
        }
    }

    // Sun circle (optional)
    let sun = '';
    if (sunVisible) {
        sun = `<circle cx="${cx}" cy="${sunCy}" r="8" fill="${color}"/>`;
    }

    content = `
        <defs>
            <mask id="${maskId}">
                <rect x="0" y="0" width="${size}" height="${size}" fill="white"/>
                <path d="${horizonPath}" fill="black"/>
            </mask>
        </defs>
        <g mask="url(#${maskId})">
            ${rays}
            ${sun}
        </g>
        <path d="${horizonPath}" fill="${color}"/>
    `;

    return [{
        id: `sh-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'sunrise-horizon' as any,
        variant: 1,
        svg: wrapSvg(content),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 96 } as any
    }];
}

// ============================================================================
// 16. DIMENSIONAL CUBE - 3D isometric box/cube (like Box logo)
// ============================================================================

export function generateDimensionalCube(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Variation parameters
    const cubeStyles = ['solid', 'wireframe', 'open', 'stacked', 'nested', 'exploded'];
    const cubeStyle = cubeStyles[Math.floor(rng() * cubeStyles.length)];
    const cubeSize = 25 + rng() * 10; // 25-35
    const rotation = rng() * 60 - 30; // -30 to 30

    // Isometric angles
    const isoAngle = Math.PI / 6; // 30 degrees
    const cos30 = Math.cos(isoAngle);
    const sin30 = Math.sin(isoAngle);

    let paths = '';

    // Helper to get isometric point
    const isoPoint = (x: number, y: number, z: number) => ({
        x: cx + (x - z) * cos30 * cubeSize / 15,
        y: cy - y * cubeSize / 15 + (x + z) * sin30 * cubeSize / 15
    });

    switch (cubeStyle) {
        case 'solid':
            // Three visible faces
            const topPts = [isoPoint(0, 1, 0), isoPoint(1, 1, 0), isoPoint(1, 1, 1), isoPoint(0, 1, 1)];
            const leftPts = [isoPoint(0, 0, 0), isoPoint(0, 1, 0), isoPoint(0, 1, 1), isoPoint(0, 0, 1)];
            const rightPts = [isoPoint(0, 0, 1), isoPoint(1, 0, 1), isoPoint(1, 1, 1), isoPoint(0, 1, 1)];

            paths += `<polygon points="${topPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}"/>`;
            paths += `<polygon points="${leftPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="0.7"/>`;
            paths += `<polygon points="${rightPts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="0.5"/>`;
            break;

        case 'wireframe':
            // All edges visible
            const edges = [
                // Bottom face
                [isoPoint(0, 0, 0), isoPoint(1, 0, 0)],
                [isoPoint(1, 0, 0), isoPoint(1, 0, 1)],
                [isoPoint(1, 0, 1), isoPoint(0, 0, 1)],
                [isoPoint(0, 0, 1), isoPoint(0, 0, 0)],
                // Top face
                [isoPoint(0, 1, 0), isoPoint(1, 1, 0)],
                [isoPoint(1, 1, 0), isoPoint(1, 1, 1)],
                [isoPoint(1, 1, 1), isoPoint(0, 1, 1)],
                [isoPoint(0, 1, 1), isoPoint(0, 1, 0)],
                // Verticals
                [isoPoint(0, 0, 0), isoPoint(0, 1, 0)],
                [isoPoint(1, 0, 0), isoPoint(1, 1, 0)],
                [isoPoint(1, 0, 1), isoPoint(1, 1, 1)],
                [isoPoint(0, 0, 1), isoPoint(0, 1, 1)]
            ];
            edges.forEach(([p1, p2]) => {
                paths += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${color}" stroke-width="2.5"/>`;
            });
            break;

        case 'open':
            // Cube with open top
            const openLeft = [isoPoint(0, 0, 0), isoPoint(0, 1, 0), isoPoint(0, 1, 1), isoPoint(0, 0, 1)];
            const openRight = [isoPoint(0, 0, 1), isoPoint(1, 0, 1), isoPoint(1, 1, 1), isoPoint(0, 1, 1)];
            const openBack = [isoPoint(1, 0, 0), isoPoint(1, 1, 0), isoPoint(1, 1, 1), isoPoint(1, 0, 1)];
            paths += `<polygon points="${openLeft.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="0.8"/>`;
            paths += `<polygon points="${openRight.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="0.6"/>`;
            paths += `<polygon points="${openBack.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="0.4"/>`;
            break;

        case 'stacked':
            // Multiple stacked cubes
            for (let i = 0; i < 3; i++) {
                const offsetY = i * 0.6;
                const scale = 1 - i * 0.15;
                const sTop = [isoPoint(0, 1 + offsetY, 0), isoPoint(scale, 1 + offsetY, 0), isoPoint(scale, 1 + offsetY, scale), isoPoint(0, 1 + offsetY, scale)];
                const sLeft = [isoPoint(0, offsetY, 0), isoPoint(0, 1 + offsetY, 0), isoPoint(0, 1 + offsetY, scale), isoPoint(0, offsetY, scale)];
                const sRight = [isoPoint(0, offsetY, scale), isoPoint(scale, offsetY, scale), isoPoint(scale, 1 + offsetY, scale), isoPoint(0, 1 + offsetY, scale)];
                const opacity = 1 - i * 0.2;
                paths += `<polygon points="${sTop.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="${opacity}"/>`;
                paths += `<polygon points="${sLeft.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="${opacity * 0.7}"/>`;
                paths += `<polygon points="${sRight.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="${opacity * 0.5}"/>`;
            }
            break;

        case 'nested':
            // Nested wireframe cubes
            for (let i = 0; i < 3; i++) {
                const scale = 1 - i * 0.25;
                const nEdges = [
                    [isoPoint(0, 0, 0), isoPoint(scale, 0, 0)],
                    [isoPoint(scale, 0, 0), isoPoint(scale, 0, scale)],
                    [isoPoint(0, scale, 0), isoPoint(scale, scale, 0)],
                    [isoPoint(scale, scale, 0), isoPoint(scale, scale, scale)],
                    [isoPoint(0, 0, 0), isoPoint(0, scale, 0)],
                    [isoPoint(scale, 0, scale), isoPoint(scale, scale, scale)]
                ];
                const opacity = 1 - i * 0.25;
                nEdges.forEach(([p1, p2]) => {
                    paths += `<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${color}" stroke-width="2" opacity="${opacity}"/>`;
                });
            }
            break;

        case 'exploded':
        default:
            // Exploded cube - faces separated
            const gap = 0.15;
            const eTop = [isoPoint(gap, 1 + gap, gap), isoPoint(1 - gap, 1 + gap, gap), isoPoint(1 - gap, 1 + gap, 1 - gap), isoPoint(gap, 1 + gap, 1 - gap)];
            const eLeft = [isoPoint(-gap, gap, gap), isoPoint(-gap, 1 - gap, gap), isoPoint(-gap, 1 - gap, 1 - gap), isoPoint(-gap, gap, 1 - gap)];
            const eRight = [isoPoint(gap, gap, 1 + gap), isoPoint(1 - gap, gap, 1 + gap), isoPoint(1 - gap, 1 - gap, 1 + gap), isoPoint(gap, 1 - gap, 1 + gap)];
            paths += `<polygon points="${eTop.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}"/>`;
            paths += `<polygon points="${eLeft.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="0.7"/>`;
            paths += `<polygon points="${eRight.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}" fill="${color}" opacity="0.5"/>`;
    }

    return [{
        id: `dc-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'dimensional-cube' as any,
        variant: 1,
        svg: wrapSvg(`<g transform="rotate(${rotation.toFixed(1)}, ${cx}, ${cy})">${paths}</g>`),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 95 } as any
    }];
}

// ============================================================================
// 17. ASTERISK STAR - Professional asterisk/star variations
// ============================================================================

export function generateAsteriskStar(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Variation parameters
    const armCount = 4 + Math.floor(rng() * 6); // 4-9 arms
    const armStyles = ['straight', 'tapered', 'rounded', 'arrow', 'curved', 'double'];
    const armStyle = armStyles[Math.floor(rng() * armStyles.length)];
    const centerStyles = ['none', 'circle', 'ring', 'dot', 'square'];
    const centerStyle = centerStyles[Math.floor(rng() * centerStyles.length)];
    const armLength = 25 + rng() * 15; // 25-40
    const armWidth = 4 + rng() * 6; // 4-10
    const rotation = rng() * (360 / armCount);

    let paths = '';

    for (let i = 0; i < armCount; i++) {
        const angle = (i / armCount) * Math.PI * 2 + rotation * Math.PI / 180;
        const x1 = cx;
        const y1 = cy;
        const x2 = cx + Math.cos(angle) * armLength;
        const y2 = cy + Math.sin(angle) * armLength;

        switch (armStyle) {
            case 'tapered':
                const perpAngle = angle + Math.PI / 2;
                const w1 = armWidth / 2;
                const w2 = armWidth / 8;
                paths += `<path d="M ${(x1 + Math.cos(perpAngle) * w1).toFixed(1)} ${(y1 + Math.sin(perpAngle) * w1).toFixed(1)} L ${(x2 + Math.cos(perpAngle) * w2).toFixed(1)} ${(y2 + Math.sin(perpAngle) * w2).toFixed(1)} L ${(x2 - Math.cos(perpAngle) * w2).toFixed(1)} ${(y2 - Math.sin(perpAngle) * w2).toFixed(1)} L ${(x1 - Math.cos(perpAngle) * w1).toFixed(1)} ${(y1 - Math.sin(perpAngle) * w1).toFixed(1)} Z" fill="${color}"/>`;
                break;
            case 'rounded':
                paths += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${armWidth.toFixed(1)}" stroke-linecap="round"/>`;
                break;
            case 'arrow':
                const arrowTip = armLength;
                const arrowBack = armLength * 0.7;
                const arrowWidth = armWidth * 1.5;
                paths += `<path d="M ${cx.toFixed(1)} ${cy.toFixed(1)} L ${(cx + Math.cos(angle) * arrowBack - Math.cos(angle + Math.PI / 2) * arrowWidth / 2).toFixed(1)} ${(cy + Math.sin(angle) * arrowBack - Math.sin(angle + Math.PI / 2) * arrowWidth / 2).toFixed(1)} L ${(cx + Math.cos(angle) * arrowTip).toFixed(1)} ${(cy + Math.sin(angle) * arrowTip).toFixed(1)} L ${(cx + Math.cos(angle) * arrowBack + Math.cos(angle + Math.PI / 2) * arrowWidth / 2).toFixed(1)} ${(cy + Math.sin(angle) * arrowBack + Math.sin(angle + Math.PI / 2) * arrowWidth / 2).toFixed(1)} Z" fill="${color}"/>`;
                break;
            case 'curved':
                const ctrl1x = x1 + Math.cos(angle + 0.3) * armLength * 0.5;
                const ctrl1y = y1 + Math.sin(angle + 0.3) * armLength * 0.5;
                paths += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${ctrl1x.toFixed(1)} ${ctrl1y.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${color}" stroke-width="${(armWidth * 0.8).toFixed(1)}" fill="none" stroke-linecap="round"/>`;
                break;
            case 'double':
                const gap = armWidth * 0.6;
                const perpA = angle + Math.PI / 2;
                paths += `<line x1="${(x1 + Math.cos(perpA) * gap).toFixed(1)}" y1="${(y1 + Math.sin(perpA) * gap).toFixed(1)}" x2="${(x2 + Math.cos(perpA) * gap).toFixed(1)}" y2="${(y2 + Math.sin(perpA) * gap).toFixed(1)}" stroke="${color}" stroke-width="${(armWidth * 0.4).toFixed(1)}" stroke-linecap="round"/>`;
                paths += `<line x1="${(x1 - Math.cos(perpA) * gap).toFixed(1)}" y1="${(y1 - Math.sin(perpA) * gap).toFixed(1)}" x2="${(x2 - Math.cos(perpA) * gap).toFixed(1)}" y2="${(y2 - Math.sin(perpA) * gap).toFixed(1)}" stroke="${color}" stroke-width="${(armWidth * 0.4).toFixed(1)}" stroke-linecap="round"/>`;
                break;
            default: // straight
                paths += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${color}" stroke-width="${armWidth.toFixed(1)}"/>`;
        }
    }

    // Center element
    const centerRadius = armWidth * 1.2;
    switch (centerStyle) {
        case 'circle':
            paths += `<circle cx="${cx}" cy="${cy}" r="${centerRadius.toFixed(1)}" fill="${color}"/>`;
            break;
        case 'ring':
            paths += `<circle cx="${cx}" cy="${cy}" r="${centerRadius.toFixed(1)}" fill="none" stroke="${color}" stroke-width="2"/>`;
            break;
        case 'dot':
            paths += `<circle cx="${cx}" cy="${cy}" r="${(centerRadius * 0.5).toFixed(1)}" fill="${color}"/>`;
            break;
        case 'square':
            paths += `<rect x="${(cx - centerRadius).toFixed(1)}" y="${(cy - centerRadius).toFixed(1)}" width="${(centerRadius * 2).toFixed(1)}" height="${(centerRadius * 2).toFixed(1)}" fill="${color}"/>`;
            break;
    }

    return [{
        id: `as-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'asterisk-star' as any,
        variant: 1,
        svg: wrapSvg(paths),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 94 } as any
    }];
}

// ============================================================================
// 18. ARROW CONVERGENCE - Arrows meeting at point (like the green Y logo)
// ============================================================================

export function generateArrowConvergence(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Variation parameters
    const arrowCount = 2 + Math.floor(rng() * 4); // 2-5 arrows
    const convergenceStyles = ['center', 'offset', 'spiral', 'fan', 'cross'];
    const convergenceStyle = convergenceStyles[Math.floor(rng() * convergenceStyles.length)];
    const arrowStyles = ['solid', 'outline', 'double', 'tapered'];
    const arrowStyle = arrowStyles[Math.floor(rng() * arrowStyles.length)];
    const arrowSize = 20 + rng() * 15; // 20-35
    const arrowWidth = 8 + rng() * 8; // 8-16
    const rotation = rng() * 360;

    let paths = '';

    for (let i = 0; i < arrowCount; i++) {
        let angle: number;
        let startX: number, startY: number;
        let endX: number, endY: number;

        switch (convergenceStyle) {
            case 'center':
                angle = (i / arrowCount) * Math.PI * 2 + rotation * Math.PI / 180;
                startX = cx + Math.cos(angle) * (arrowSize + 15);
                startY = cy + Math.sin(angle) * (arrowSize + 15);
                endX = cx + Math.cos(angle) * 5;
                endY = cy + Math.sin(angle) * 5;
                break;
            case 'offset':
                angle = (i / arrowCount) * Math.PI * 2 + rotation * Math.PI / 180;
                const offset = 10;
                startX = cx + Math.cos(angle) * (arrowSize + 15) + Math.cos(angle + Math.PI / 2) * offset;
                startY = cy + Math.sin(angle) * (arrowSize + 15) + Math.sin(angle + Math.PI / 2) * offset;
                endX = cx + Math.cos(angle) * 8;
                endY = cy + Math.sin(angle) * 8;
                break;
            case 'spiral':
                const spiralAngle = (i / arrowCount) * Math.PI * 2 + rotation * Math.PI / 180;
                const spiralOffset = i * 0.3;
                startX = cx + Math.cos(spiralAngle + spiralOffset) * (arrowSize + 10);
                startY = cy + Math.sin(spiralAngle + spiralOffset) * (arrowSize + 10);
                endX = cx + Math.cos(spiralAngle) * 10;
                endY = cy + Math.sin(spiralAngle) * 10;
                break;
            case 'fan':
                const fanSpread = Math.PI * 0.6;
                angle = -Math.PI / 2 - fanSpread / 2 + (i / (arrowCount - 1)) * fanSpread;
                startX = cx + Math.cos(angle) * arrowSize;
                startY = cy + Math.sin(angle) * arrowSize;
                endX = cx;
                endY = cy + 15;
                break;
            case 'cross':
            default:
                angle = (i / arrowCount) * Math.PI * 2 + Math.PI / 4;
                startX = cx + Math.cos(angle) * arrowSize;
                startY = cy + Math.sin(angle) * arrowSize;
                endX = cx;
                endY = cy;
        }

        // Draw arrow based on style
        const dirAngle = Math.atan2(endY - startY, endX - startX);
        const tipSize = arrowWidth * 1.2;

        switch (arrowStyle) {
            case 'solid':
                // Arrow body
                const perpAngle = dirAngle + Math.PI / 2;
                const bodyW = arrowWidth / 2;
                const bodyEndX = endX - Math.cos(dirAngle) * tipSize;
                const bodyEndY = endY - Math.sin(dirAngle) * tipSize;
                paths += `<path d="M ${(startX + Math.cos(perpAngle) * bodyW).toFixed(1)} ${(startY + Math.sin(perpAngle) * bodyW).toFixed(1)} L ${(bodyEndX + Math.cos(perpAngle) * bodyW).toFixed(1)} ${(bodyEndY + Math.sin(perpAngle) * bodyW).toFixed(1)} L ${(bodyEndX + Math.cos(perpAngle) * tipSize).toFixed(1)} ${(bodyEndY + Math.sin(perpAngle) * tipSize).toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)} L ${(bodyEndX - Math.cos(perpAngle) * tipSize).toFixed(1)} ${(bodyEndY - Math.sin(perpAngle) * tipSize).toFixed(1)} L ${(bodyEndX - Math.cos(perpAngle) * bodyW).toFixed(1)} ${(bodyEndY - Math.sin(perpAngle) * bodyW).toFixed(1)} L ${(startX - Math.cos(perpAngle) * bodyW).toFixed(1)} ${(startY - Math.sin(perpAngle) * bodyW).toFixed(1)} Z" fill="${color}"/>`;
                break;
            case 'outline':
                paths += `<line x1="${startX.toFixed(1)}" y1="${startY.toFixed(1)}" x2="${endX.toFixed(1)}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="${(arrowWidth * 0.5).toFixed(1)}" stroke-linecap="round"/>`;
                // Arrowhead
                paths += `<path d="M ${endX.toFixed(1)} ${endY.toFixed(1)} L ${(endX - Math.cos(dirAngle - 0.4) * tipSize).toFixed(1)} ${(endY - Math.sin(dirAngle - 0.4) * tipSize).toFixed(1)} M ${endX.toFixed(1)} ${endY.toFixed(1)} L ${(endX - Math.cos(dirAngle + 0.4) * tipSize).toFixed(1)} ${(endY - Math.sin(dirAngle + 0.4) * tipSize).toFixed(1)}" stroke="${color}" stroke-width="${(arrowWidth * 0.5).toFixed(1)}" stroke-linecap="round" fill="none"/>`;
                break;
            case 'double':
                const doubleGap = arrowWidth * 0.4;
                const perpA = dirAngle + Math.PI / 2;
                paths += `<line x1="${(startX + Math.cos(perpA) * doubleGap).toFixed(1)}" y1="${(startY + Math.sin(perpA) * doubleGap).toFixed(1)}" x2="${(endX + Math.cos(perpA) * doubleGap * 0.3).toFixed(1)}" y2="${(endY + Math.sin(perpA) * doubleGap * 0.3).toFixed(1)}" stroke="${color}" stroke-width="${(arrowWidth * 0.35).toFixed(1)}" stroke-linecap="round"/>`;
                paths += `<line x1="${(startX - Math.cos(perpA) * doubleGap).toFixed(1)}" y1="${(startY - Math.sin(perpA) * doubleGap).toFixed(1)}" x2="${(endX - Math.cos(perpA) * doubleGap * 0.3).toFixed(1)}" y2="${(endY - Math.sin(perpA) * doubleGap * 0.3).toFixed(1)}" stroke="${color}" stroke-width="${(arrowWidth * 0.35).toFixed(1)}" stroke-linecap="round"/>`;
                break;
            case 'tapered':
            default:
                const tPerpAngle = dirAngle + Math.PI / 2;
                const w1 = arrowWidth / 2;
                const w2 = arrowWidth / 8;
                paths += `<path d="M ${(startX + Math.cos(tPerpAngle) * w1).toFixed(1)} ${(startY + Math.sin(tPerpAngle) * w1).toFixed(1)} L ${(endX + Math.cos(tPerpAngle) * w2).toFixed(1)} ${(endY + Math.sin(tPerpAngle) * w2).toFixed(1)} L ${endX.toFixed(1)} ${endY.toFixed(1)} L ${(endX - Math.cos(tPerpAngle) * w2).toFixed(1)} ${(endY - Math.sin(tPerpAngle) * w2).toFixed(1)} L ${(startX - Math.cos(tPerpAngle) * w1).toFixed(1)} ${(startY - Math.sin(tPerpAngle) * w1).toFixed(1)} Z" fill="${color}"/>`;
        }
    }

    return [{
        id: `ac-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'arrow-convergence' as any,
        variant: 1,
        svg: wrapSvg(paths),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 95 } as any
    }];
}

// ============================================================================
// 19. HEXAGONAL BLOOM - Hexagon-based radial patterns
// ============================================================================

export function generateHexagonalBloom(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Variation parameters
    const petalCount = 3 + Math.floor(rng() * 4); // 3-6 petals
    const bloomStyles = ['solid', 'outline', 'layered', 'interlocked', 'gradient'];
    const bloomStyle = bloomStyles[Math.floor(rng() * bloomStyles.length)];
    const hexSize = 18 + rng() * 10; // 18-28
    const rotation = rng() * 60;
    const spacing = 0.9 + rng() * 0.3; // 0.9-1.2

    let paths = '';

    // Helper to generate hexagon points
    const hexPoints = (hcx: number, hcy: number, hsize: number, rot: number = 0): string => {
        const pts: string[] = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60 + rot) * Math.PI / 180;
            pts.push(`${(hcx + Math.cos(angle) * hsize).toFixed(1)},${(hcy + Math.sin(angle) * hsize).toFixed(1)}`);
        }
        return pts.join(' ');
    };

    switch (bloomStyle) {
        case 'solid':
            // Central hexagon + surrounding hexagons
            paths += `<polygon points="${hexPoints(cx, cy, hexSize * 0.7, rotation)}" fill="${color}"/>`;
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2 + rotation * Math.PI / 180;
                const hx = cx + Math.cos(angle) * hexSize * spacing * 1.5;
                const hy = cy + Math.sin(angle) * hexSize * spacing * 1.5;
                paths += `<polygon points="${hexPoints(hx, hy, hexSize * 0.65, rotation)}" fill="${color}" opacity="0.85"/>`;
            }
            break;

        case 'outline':
            paths += `<polygon points="${hexPoints(cx, cy, hexSize * 0.8, rotation)}" fill="none" stroke="${color}" stroke-width="2.5"/>`;
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2 + rotation * Math.PI / 180;
                const hx = cx + Math.cos(angle) * hexSize * spacing * 1.4;
                const hy = cy + Math.sin(angle) * hexSize * spacing * 1.4;
                paths += `<polygon points="${hexPoints(hx, hy, hexSize * 0.6, rotation)}" fill="none" stroke="${color}" stroke-width="2"/>`;
            }
            break;

        case 'layered':
            for (let layer = 2; layer >= 0; layer--) {
                const layerSize = hexSize * (1 - layer * 0.25);
                const layerOpacity = 1 - layer * 0.25;
                paths += `<polygon points="${hexPoints(cx, cy, layerSize, rotation + layer * 10)}" fill="${color}" opacity="${layerOpacity.toFixed(2)}"/>`;
            }
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2 + rotation * Math.PI / 180;
                const hx = cx + Math.cos(angle) * hexSize * 1.6;
                const hy = cy + Math.sin(angle) * hexSize * 1.6;
                paths += `<polygon points="${hexPoints(hx, hy, hexSize * 0.5, rotation)}" fill="${color}" opacity="0.7"/>`;
            }
            break;

        case 'interlocked':
            // Hexagons that appear to interlock
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * Math.PI * 2 + rotation * Math.PI / 180;
                const hx = cx + Math.cos(angle) * hexSize * 0.9;
                const hy = cy + Math.sin(angle) * hexSize * 0.9;
                const hrot = rotation + i * 30;
                paths += `<polygon points="${hexPoints(hx, hy, hexSize * 0.75, hrot)}" fill="${color}" opacity="${(0.6 + i * 0.1).toFixed(2)}"/>`;
            }
            break;

        case 'gradient':
        default:
            // Radial arrangement with size gradient
            paths += `<polygon points="${hexPoints(cx, cy, hexSize * 0.6, rotation)}" fill="${color}"/>`;
            for (let ring = 1; ring <= 2; ring++) {
                const ringCount = petalCount * ring;
                for (let i = 0; i < ringCount; i++) {
                    const angle = (i / ringCount) * Math.PI * 2 + rotation * Math.PI / 180 + ring * 0.2;
                    const dist = hexSize * spacing * ring * 1.1;
                    const hx = cx + Math.cos(angle) * dist;
                    const hy = cy + Math.sin(angle) * dist;
                    const hsize = hexSize * (0.6 - ring * 0.1);
                    const opacity = 1 - ring * 0.25;
                    paths += `<polygon points="${hexPoints(hx, hy, hsize, rotation)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
                }
            }
    }

    return [{
        id: `hb-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'hexagonal-bloom' as any,
        variant: 1,
        svg: wrapSvg(paths),
        viewBox: `0 0 ${size} ${size}`,
        meta: {} as any,
        params: {} as any,
        quality: { score: 94 } as any
    }];
}

// ============================================================================
// 20. CIRCULAR ORBIT - Spiral/motion patterns
// ============================================================================

export function generateCircularOrbit(params: LogoGenerationParams): GeneratedLogo[] {
    const rng = getRng(params.brandName);
    const dp = extractDeepParams(params.brandName);
    const size = 100;
    const color = params.primaryColor || 'currentColor';
    const cx = size / 2;
    const cy = size / 2;

    // Variation parameters
    const orbitCount = 2 + Math.floor(rng() * 4); // 2-5 orbits
    const orbitStyles = ['concentric', 'spiral', 'eccentric', 'broken', 'dotted'];
    const orbitStyle = orbitStyles[Math.floor(rng() * orbitStyles.length)];
    const baseRadius = 15 + rng() * 10; // 15-25
    const radiusStep = 8 + rng() * 6; // 8-14
    const strokeWidth = 2 + rng() * 3; // 2-5
    const rotation = rng() * 360;

    let paths = '';

    switch (orbitStyle) {
        case 'concentric':
            for (let i = 0; i < orbitCount; i++) {
                const r = baseRadius + i * radiusStep;
                const opacity = 1 - i * 0.15;
                paths += `<circle cx="${cx}" cy="${cy}" r="${r.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${strokeWidth.toFixed(1)}" opacity="${opacity.toFixed(2)}"/>`;
            }
            // Central element
            paths += `<circle cx="${cx}" cy="${cy}" r="${(baseRadius * 0.4).toFixed(1)}" fill="${color}"/>`;
            break;

        case 'spiral':
            let spiralPath = `M ${cx + baseRadius} ${cy}`;
            const spiralTurns = 2 + rng() * 2;
            const spiralPoints = 100;
            for (let i = 1; i <= spiralPoints; i++) {
                const t = i / spiralPoints;
                const angle = t * spiralTurns * Math.PI * 2;
                const r = baseRadius + t * radiusStep * orbitCount;
                const x = cx + Math.cos(angle) * r;
                const y = cy + Math.sin(angle) * r;
                spiralPath += ` L ${x.toFixed(1)} ${y.toFixed(1)}`;
            }
            paths += `<path d="${spiralPath}" fill="none" stroke="${color}" stroke-width="${strokeWidth.toFixed(1)}" stroke-linecap="round"/>`;
            paths += `<circle cx="${cx}" cy="${cy}" r="${(strokeWidth * 1.5).toFixed(1)}" fill="${color}"/>`;
            break;

        case 'eccentric':
            for (let i = 0; i < orbitCount; i++) {
                const r = baseRadius + i * radiusStep;
                const offsetX = (rng() - 0.5) * 10;
                const offsetY = (rng() - 0.5) * 10;
                const opacity = 1 - i * 0.12;
                paths += `<ellipse cx="${(cx + offsetX).toFixed(1)}" cy="${(cy + offsetY).toFixed(1)}" rx="${r.toFixed(1)}" ry="${(r * (0.7 + rng() * 0.3)).toFixed(1)}" fill="none" stroke="${color}" stroke-width="${strokeWidth.toFixed(1)}" opacity="${opacity.toFixed(2)}" transform="rotate(${(rotation + i * 20).toFixed(1)}, ${cx}, ${cy})"/>`;
            }
            paths += `<circle cx="${cx}" cy="${cy}" r="${(strokeWidth * 2).toFixed(1)}" fill="${color}"/>`;
            break;

        case 'broken':
            for (let i = 0; i < orbitCount; i++) {
                const r = baseRadius + i * radiusStep;
                const opacity = 1 - i * 0.12;
                const gapCount = 2 + Math.floor(rng() * 3);
                const arcLength = (360 - gapCount * 30) / gapCount;

                for (let g = 0; g < gapCount; g++) {
                    const startAngle = (g / gapCount) * 360 + rotation + i * 15;
                    const endAngle = startAngle + arcLength;
                    const startRad = startAngle * Math.PI / 180;
                    const endRad = endAngle * Math.PI / 180;
                    const x1 = cx + Math.cos(startRad) * r;
                    const y1 = cy + Math.sin(startRad) * r;
                    const x2 = cx + Math.cos(endRad) * r;
                    const y2 = cy + Math.sin(endRad) * r;
                    const largeArc = arcLength > 180 ? 1 : 0;
                    paths += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 ${largeArc} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${color}" stroke-width="${strokeWidth.toFixed(1)}" opacity="${opacity.toFixed(2)}" stroke-linecap="round"/>`;
                }
            }
            paths += `<circle cx="${cx}" cy="${cy}" r="${(strokeWidth * 1.5).toFixed(1)}" fill="${color}"/>`;
            break;

        case 'dotted':
        default:
            for (let i = 0; i < orbitCount; i++) {
                const r = baseRadius + i * radiusStep;
                const dotCount = 8 + i * 4;
                const dotSize = strokeWidth * 0.6;
                const opacity = 1 - i * 0.15;

                for (let d = 0; d < dotCount; d++) {
                    const angle = (d / dotCount) * Math.PI * 2 + (rotation + i * 15) * Math.PI / 180;
                    const x = cx + Math.cos(angle) * r;
                    const y = cy + Math.sin(angle) * r;
                    paths += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${dotSize.toFixed(1)}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
                }
            }
            paths += `<circle cx="${cx}" cy="${cy}" r="${(strokeWidth * 2).toFixed(1)}" fill="${color}"/>`;
    }

    return [{
        id: `co-${Date.now()}`,
        hash: createHash('sha256').update(params.brandName).digest('hex'),
        algorithm: 'circular-orbit' as any,
        variant: 1,
        svg: wrapSvg(paths),
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

// New premium algorithms
export const generateSingleRadialSunburstPreview = (n: string) => generateRadialSunburst({ brandName: n } as any)[0];
export const generateSingleStripedOrganicPreview = (n: string) => generateStripedOrganic({ brandName: n } as any)[0];
export const generateSingleTwistedSquarePreview = (n: string) => generateTwistedSquare({ brandName: n } as any)[0];
export const generateSingleOrganicDotClusterPreview = (n: string) => generateOrganicDotCluster({ brandName: n } as any)[0];
export const generateSingleSunriseHorizonPreview = (n: string) => generateSunriseHorizon({ brandName: n } as any)[0];
export const generateSingleDimensionalCubePreview = (n: string) => generateDimensionalCube({ brandName: n } as any)[0];
export const generateSingleAsteriskStarPreview = (n: string) => generateAsteriskStar({ brandName: n } as any)[0];
export const generateSingleArrowConvergencePreview = (n: string) => generateArrowConvergence({ brandName: n } as any)[0];
export const generateSingleHexagonalBloomPreview = (n: string) => generateHexagonalBloom({ brandName: n } as any)[0];
export const generateSingleCircularOrbitPreview = (n: string) => generateCircularOrbit({ brandName: n } as any)[0];
