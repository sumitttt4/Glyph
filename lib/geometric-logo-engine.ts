/**
 * Geometric SVG Logo Engine
 *
 * Programmatic SVG logo constructor that generates clean, professional logomarks
 * like high-end brand identity studios produce.
 *
 * Construction methods:
 * 1. Radial Symmetry — base shape repeated around center (3/4/6/8 fold)
 * 2. Letterform Abstraction — first letter reduced to geometric primitives
 * 3. Grid-based Construction — shapes placed on grid with boolean-style overlaps
 * 4. Rotational Patterns — lines/shapes radiating from center (sun/starburst)
 * 5. Nested Geometry — circles inside squares, concentric shapes with cutouts
 * 6. Dynamic Repeats — single element repeated in spiral, wave, or cluster
 *
 * Output: Pure SVG, monochrome by default (single color on transparent),
 * perfectly centered, scalable, clean paths, minimal nodes.
 */

// ============================================================
// SEEDED RNG (self-contained, no external deps)
// ============================================================

function createRng(seed: string): () => number {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
        h = ((h << 5) - h) + seed.charCodeAt(i);
        h = h & h;
    }
    let s = Math.abs(h) || 1;
    return () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
    };
}

function pick<T>(rng: () => number, arr: T[]): T {
    return arr[Math.floor(rng() * arr.length)];
}

function range(rng: () => number, min: number, max: number): number {
    return min + rng() * (max - min);
}

function intRange(rng: () => number, min: number, max: number): number {
    return Math.floor(range(rng, min, max + 1));
}

// ============================================================
// SVG HELPERS
// ============================================================

const SIZE = 200;
const CX = 100;
const CY = 100;

function svgWrap(inner: string, id?: string): string {
    const idAttr = id ? ` id="${id}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}"${idAttr}>${inner}</svg>`;
}

function polarToXY(cx: number, cy: number, r: number, angleDeg: number): { x: number; y: number } {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number): string {
    const start = polarToXY(cx, cy, r, endAngle);
    const end = polarToXY(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function round(n: number, d: number = 2): number {
    const f = Math.pow(10, d);
    return Math.round(n * f) / f;
}

// ============================================================
// METHOD 1: RADIAL SYMMETRY
// ============================================================

function generateRadialSymmetry(brandName: string, rng: () => number): string {
    const folds = pick(rng, [3, 4, 6, 8]);
    const angleStep = 360 / folds;
    const shapeType = pick(rng, ['arc', 'line', 'triangle', 'petal', 'diamond'] as const);
    const outerR = range(rng, 30, 45);
    const innerR = range(rng, 8, 20);
    const strokeW = range(rng, 3, 7);
    const useFill = rng() > 0.4;
    const rotOffset = range(rng, 0, angleStep);

    let shapePath = '';

    switch (shapeType) {
        case 'arc': {
            const arcSpan = range(rng, 20, angleStep * 0.7);
            const r = range(rng, 25, 42);
            // Single arc segment, repeated via rotation
            shapePath = describeArc(CX, CY, r, -arcSpan / 2, arcSpan / 2);
            break;
        }
        case 'line': {
            // Line from inner to outer radius
            const p1 = polarToXY(CX, CY, innerR, 0);
            const p2 = polarToXY(CX, CY, outerR, 0);
            shapePath = `M ${round(p1.x)} ${round(p1.y)} L ${round(p2.x)} ${round(p2.y)}`;
            break;
        }
        case 'triangle': {
            const tipR = outerR;
            const baseR = innerR;
            const halfAngle = range(rng, 8, angleStep * 0.35);
            const tip = polarToXY(CX, CY, tipR, 0);
            const bl = polarToXY(CX, CY, baseR, -halfAngle);
            const br = polarToXY(CX, CY, baseR, halfAngle);
            shapePath = `M ${round(tip.x)} ${round(tip.y)} L ${round(bl.x)} ${round(bl.y)} L ${round(br.x)} ${round(br.y)} Z`;
            break;
        }
        case 'petal': {
            // Elliptical petal shape
            const petalLen = outerR - innerR;
            const petalW = range(rng, 4, 12);
            const midY = CY - innerR - petalLen / 2;
            shapePath = `M ${CX} ${CY - innerR} Q ${CX + petalW} ${midY} ${CX} ${CY - outerR} Q ${CX - petalW} ${midY} ${CX} ${CY - innerR} Z`;
            break;
        }
        case 'diamond': {
            const h = range(rng, 12, 22);
            const w = range(rng, 5, 10);
            const midR = (innerR + outerR) / 2;
            const cy = CY - midR;
            shapePath = `M ${CX} ${cy - h / 2} L ${CX + w / 2} ${cy} L ${CX} ${cy + h / 2} L ${CX - w / 2} ${cy} Z`;
            break;
        }
    }

    const fillAttr = useFill ? 'fill="currentColor"' : 'fill="none"';
    const strokeAttr = useFill ? '' : `stroke="currentColor" stroke-width="${round(strokeW)}" stroke-linecap="round"`;

    let paths = '';
    for (let i = 0; i < folds; i++) {
        const angle = round(i * angleStep + rotOffset);
        paths += `<g transform="rotate(${angle} ${CX} ${CY})"><path d="${shapePath}" ${fillAttr} ${strokeAttr}/></g>`;
    }

    // Optional center accent
    const hasCenter = rng() > 0.5;
    let center = '';
    if (hasCenter) {
        const cr = range(rng, 4, innerR * 0.7);
        const centerFilled = rng() > 0.5;
        if (centerFilled) {
            center = `<circle cx="${CX}" cy="${CY}" r="${round(cr)}" fill="currentColor"/>`;
        } else {
            center = `<circle cx="${CX}" cy="${CY}" r="${round(cr)}" fill="none" stroke="currentColor" stroke-width="${round(strokeW * 0.7)}"/>`;
        }
    }

    return svgWrap(paths + center);
}

// ============================================================
// METHOD 2: LETTERFORM ABSTRACTION
// ============================================================

interface LetterPrimitive {
    type: 'arc' | 'line' | 'dot';
    d: string;
}

// Reduced geometric representations of letters
const LETTER_PRIMITIVES: Record<string, (rng: () => number) => LetterPrimitive[]> = {
    A: (rng) => {
        const w = range(rng, 20, 30);
        return [
            { type: 'line', d: `M ${CX - w} ${CY + 30} L ${CX} ${CY - 35} L ${CX + w} ${CY + 30}` },
            { type: 'line', d: `M ${CX - w * 0.55} ${CY + 5} L ${CX + w * 0.55} ${CY + 5}` },
        ];
    },
    B: (rng) => {
        const r = range(rng, 14, 18);
        return [
            { type: 'line', d: `M ${CX - 15} ${CY - 32} L ${CX - 15} ${CY + 32}` },
            { type: 'arc', d: describeArc(CX - 5, CY - 16, r, -90, 90) },
            { type: 'arc', d: describeArc(CX - 5, CY + 16, r, -90, 90) },
        ];
    },
    C: (rng) => {
        const r = range(rng, 28, 36);
        return [{ type: 'arc', d: describeArc(CX, CY, r, 45, 315) }];
    },
    D: (rng) => {
        const r = range(rng, 28, 36);
        return [
            { type: 'line', d: `M ${CX - 15} ${CY - 32} L ${CX - 15} ${CY + 32}` },
            { type: 'arc', d: describeArc(CX - 15, CY, r, -90, 90) },
        ];
    },
    E: (rng) => {
        const w = range(rng, 22, 30);
        return [
            { type: 'line', d: `M ${CX - 10} ${CY - 30} L ${CX - 10} ${CY + 30}` },
            { type: 'line', d: `M ${CX - 10} ${CY - 30} L ${CX - 10 + w} ${CY - 30}` },
            { type: 'line', d: `M ${CX - 10} ${CY} L ${CX - 10 + w * 0.75} ${CY}` },
            { type: 'line', d: `M ${CX - 10} ${CY + 30} L ${CX - 10 + w} ${CY + 30}` },
        ];
    },
    F: (rng) => {
        const w = range(rng, 22, 30);
        return [
            { type: 'line', d: `M ${CX - 10} ${CY - 30} L ${CX - 10} ${CY + 30}` },
            { type: 'line', d: `M ${CX - 10} ${CY - 30} L ${CX - 10 + w} ${CY - 30}` },
            { type: 'line', d: `M ${CX - 10} ${CY} L ${CX - 10 + w * 0.65} ${CY}` },
        ];
    },
    G: (rng) => {
        const r = range(rng, 28, 36);
        return [
            { type: 'arc', d: describeArc(CX, CY, r, 30, 330) },
            { type: 'line', d: `M ${CX + r * Math.cos((-60) * Math.PI / 180)} ${CY} L ${CX} ${CY}` },
        ];
    },
    H: (rng) => {
        const w = range(rng, 18, 26);
        return [
            { type: 'line', d: `M ${CX - w / 2} ${CY - 30} L ${CX - w / 2} ${CY + 30}` },
            { type: 'line', d: `M ${CX + w / 2} ${CY - 30} L ${CX + w / 2} ${CY + 30}` },
            { type: 'line', d: `M ${CX - w / 2} ${CY} L ${CX + w / 2} ${CY}` },
        ];
    },
    I: () => [{ type: 'line', d: `M ${CX} ${CY - 30} L ${CX} ${CY + 30}` }],
    J: (rng) => {
        const r = range(rng, 12, 18);
        return [
            { type: 'line', d: `M ${CX + 8} ${CY - 30} L ${CX + 8} ${CY + 15}` },
            { type: 'arc', d: describeArc(CX - 4, CY + 15, r, 0, 180) },
        ];
    },
    K: (rng) => {
        const spread = range(rng, 24, 32);
        return [
            { type: 'line', d: `M ${CX - 12} ${CY - 30} L ${CX - 12} ${CY + 30}` },
            { type: 'line', d: `M ${CX - 12} ${CY} L ${CX + spread / 2} ${CY - 30}` },
            { type: 'line', d: `M ${CX - 12} ${CY} L ${CX + spread / 2} ${CY + 30}` },
        ];
    },
    L: (rng) => {
        const w = range(rng, 22, 30);
        return [
            { type: 'line', d: `M ${CX - 10} ${CY - 30} L ${CX - 10} ${CY + 30}` },
            { type: 'line', d: `M ${CX - 10} ${CY + 30} L ${CX - 10 + w} ${CY + 30}` },
        ];
    },
    M: (rng) => {
        const w = range(rng, 28, 36);
        return [
            { type: 'line', d: `M ${CX - w / 2} ${CY + 30} L ${CX - w / 2} ${CY - 30} L ${CX} ${CY + 5} L ${CX + w / 2} ${CY - 30} L ${CX + w / 2} ${CY + 30}` },
        ];
    },
    N: (rng) => {
        const w = range(rng, 22, 30);
        return [
            { type: 'line', d: `M ${CX - w / 2} ${CY + 30} L ${CX - w / 2} ${CY - 30} L ${CX + w / 2} ${CY + 30} L ${CX + w / 2} ${CY - 30}` },
        ];
    },
    O: (rng) => {
        const r = range(rng, 28, 38);
        return [{ type: 'arc', d: describeArc(CX, CY, r, 0, 359.9) }];
    },
    P: (rng) => {
        const r = range(rng, 16, 20);
        return [
            { type: 'line', d: `M ${CX - 15} ${CY - 32} L ${CX - 15} ${CY + 32}` },
            { type: 'arc', d: describeArc(CX - 5, CY - 14, r, -90, 90) },
        ];
    },
    Q: (rng) => {
        const r = range(rng, 28, 36);
        return [
            { type: 'arc', d: describeArc(CX, CY, r, 0, 359.9) },
            { type: 'line', d: `M ${CX + 10} ${CY + 10} L ${CX + r + 5} ${CY + r + 5}` },
        ];
    },
    R: (rng) => {
        const r = range(rng, 14, 18);
        return [
            { type: 'line', d: `M ${CX - 15} ${CY - 32} L ${CX - 15} ${CY + 32}` },
            { type: 'arc', d: describeArc(CX - 5, CY - 14, r, -90, 90) },
            { type: 'line', d: `M ${CX - 5} ${CY} L ${CX + 20} ${CY + 32}` },
        ];
    },
    S: (rng) => {
        const r = range(rng, 14, 18);
        return [
            { type: 'arc', d: describeArc(CX, CY - 14, r, 180, 360 + 30) },
            { type: 'arc', d: describeArc(CX, CY + 14, r, 0, 180 + 30) },
        ];
    },
    T: (rng) => {
        const w = range(rng, 28, 38);
        return [
            { type: 'line', d: `M ${CX - w / 2} ${CY - 30} L ${CX + w / 2} ${CY - 30}` },
            { type: 'line', d: `M ${CX} ${CY - 30} L ${CX} ${CY + 30}` },
        ];
    },
    U: (rng) => {
        const r = range(rng, 20, 28);
        return [
            { type: 'line', d: `M ${CX - r} ${CY - 30} L ${CX - r} ${CY + 5}` },
            { type: 'arc', d: describeArc(CX, CY + 5, r, 0, 180) },
            { type: 'line', d: `M ${CX + r} ${CY + 5} L ${CX + r} ${CY - 30}` },
        ];
    },
    V: (rng) => {
        const w = range(rng, 24, 34);
        return [{ type: 'line', d: `M ${CX - w / 2} ${CY - 30} L ${CX} ${CY + 30} L ${CX + w / 2} ${CY - 30}` }];
    },
    W: (rng) => {
        const w = range(rng, 32, 42);
        return [{ type: 'line', d: `M ${CX - w / 2} ${CY - 30} L ${CX - w / 4} ${CY + 30} L ${CX} ${CY - 5} L ${CX + w / 4} ${CY + 30} L ${CX + w / 2} ${CY - 30}` }];
    },
    X: (rng) => {
        const w = range(rng, 22, 30);
        return [
            { type: 'line', d: `M ${CX - w / 2} ${CY - 30} L ${CX + w / 2} ${CY + 30}` },
            { type: 'line', d: `M ${CX + w / 2} ${CY - 30} L ${CX - w / 2} ${CY + 30}` },
        ];
    },
    Y: (rng) => {
        const w = range(rng, 22, 30);
        return [
            { type: 'line', d: `M ${CX - w / 2} ${CY - 30} L ${CX} ${CY}` },
            { type: 'line', d: `M ${CX + w / 2} ${CY - 30} L ${CX} ${CY}` },
            { type: 'line', d: `M ${CX} ${CY} L ${CX} ${CY + 30}` },
        ];
    },
    Z: (rng) => {
        const w = range(rng, 24, 32);
        return [
            { type: 'line', d: `M ${CX - w / 2} ${CY - 30} L ${CX + w / 2} ${CY - 30}` },
            { type: 'line', d: `M ${CX + w / 2} ${CY - 30} L ${CX - w / 2} ${CY + 30}` },
            { type: 'line', d: `M ${CX - w / 2} ${CY + 30} L ${CX + w / 2} ${CY + 30}` },
        ];
    },
};

function generateLetterformAbstraction(brandName: string, rng: () => number): string {
    const letter = brandName.charAt(0).toUpperCase();
    const generator = LETTER_PRIMITIVES[letter] || LETTER_PRIMITIVES['A'];
    const primitives = generator(rng);

    const strokeW = range(rng, 4, 8);
    const treatment = pick(rng, ['stroke', 'bold-stroke', 'filled-frame', 'double-line'] as const);
    const hasFrame = rng() > 0.55;

    let paths = '';

    switch (treatment) {
        case 'stroke':
            for (const p of primitives) {
                paths += `<path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${round(strokeW)}" stroke-linecap="round" stroke-linejoin="round"/>`;
            }
            break;
        case 'bold-stroke':
            for (const p of primitives) {
                paths += `<path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${round(strokeW * 1.8)}" stroke-linecap="round" stroke-linejoin="round"/>`;
            }
            break;
        case 'filled-frame':
            for (const p of primitives) {
                paths += `<path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${round(strokeW * 1.4)}" stroke-linecap="square" stroke-linejoin="miter"/>`;
            }
            break;
        case 'double-line': {
            const offset = range(rng, 2, 4);
            for (const p of primitives) {
                paths += `<g transform="translate(${-offset / 2}, 0)"><path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${round(strokeW * 0.6)}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
                paths += `<g transform="translate(${offset / 2}, 0)"><path d="${p.d}" fill="none" stroke="currentColor" stroke-width="${round(strokeW * 0.6)}" stroke-linecap="round" stroke-linejoin="round"/></g>`;
            }
            break;
        }
    }

    // Optional geometric frame
    let frame = '';
    if (hasFrame) {
        const frameType = pick(rng, ['circle', 'rounded-square', 'hexagon'] as const);
        const frameStroke = round(strokeW * 0.5);
        switch (frameType) {
            case 'circle':
                frame = `<circle cx="${CX}" cy="${CY}" r="48" fill="none" stroke="currentColor" stroke-width="${frameStroke}"/>`;
                break;
            case 'rounded-square':
                frame = `<rect x="${CX - 48}" y="${CY - 48}" width="96" height="96" rx="12" fill="none" stroke="currentColor" stroke-width="${frameStroke}"/>`;
                break;
            case 'hexagon': {
                const pts = [];
                for (let i = 0; i < 6; i++) {
                    const a = (i * 60 - 90) * Math.PI / 180;
                    pts.push(`${round(CX + 48 * Math.cos(a))},${round(CY + 48 * Math.sin(a))}`);
                }
                frame = `<polygon points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="${frameStroke}"/>`;
                break;
            }
        }
    }

    return svgWrap(frame + paths);
}

// ============================================================
// METHOD 3: GRID-BASED CONSTRUCTION
// ============================================================

function generateGridConstruction(brandName: string, rng: () => number): string {
    const gridSize = pick(rng, [3, 4, 5]);
    const cellSize = 70 / gridSize;
    const startX = CX - (gridSize * cellSize) / 2;
    const startY = CY - (gridSize * cellSize) / 2;
    const gap = range(rng, 2, 4);
    const cornerR = range(rng, 0, cellSize * 0.35);
    const fillStyle = pick(rng, ['solid', 'mixed', 'outline'] as const);

    // Generate a pattern based on brand name hash
    const occupied: boolean[][] = [];
    for (let r = 0; r < gridSize; r++) {
        occupied[r] = [];
        for (let c = 0; c < gridSize; c++) {
            // Use symmetry: mirror left-right for balanced feel
            if (c < Math.ceil(gridSize / 2)) {
                occupied[r][c] = rng() > 0.35;
            } else {
                occupied[r][c] = occupied[r][gridSize - 1 - c];
            }
        }
    }

    // Ensure at least ~40% cells filled
    let filled = occupied.flat().filter(Boolean).length;
    const minFilled = Math.ceil(gridSize * gridSize * 0.4);
    while (filled < minFilled) {
        const r = intRange(rng, 0, gridSize - 1);
        const c = intRange(rng, 0, Math.ceil(gridSize / 2) - 1);
        if (!occupied[r][c]) {
            occupied[r][c] = true;
            occupied[r][gridSize - 1 - c] = true;
            filled += (c === gridSize - 1 - c) ? 1 : 2;
        }
    }

    let paths = '';
    const actualCell = cellSize - gap;

    for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
            if (!occupied[r][c]) continue;

            const x = round(startX + c * cellSize + gap / 2);
            const y = round(startY + r * cellSize + gap / 2);
            const w = round(actualCell);
            const h = round(actualCell);
            const rx = round(cornerR);

            if (fillStyle === 'solid') {
                paths += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="currentColor"/>`;
            } else if (fillStyle === 'outline') {
                paths += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="currentColor" stroke-width="2"/>`;
            } else {
                // Mixed: some filled, some outline, some circles
                const variant = rng();
                if (variant < 0.45) {
                    paths += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="currentColor"/>`;
                } else if (variant < 0.75) {
                    paths += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="currentColor" stroke-width="2"/>`;
                } else {
                    const cr = round(actualCell * 0.4);
                    paths += `<circle cx="${round(x + w / 2)}" cy="${round(y + h / 2)}" r="${cr}" fill="currentColor"/>`;
                }
            }
        }
    }

    return svgWrap(paths);
}

// ============================================================
// METHOD 4: ROTATIONAL PATTERNS (starburst / radiating)
// ============================================================

function generateRotationalPattern(brandName: string, rng: () => number): string {
    const rayCount = pick(rng, [6, 8, 10, 12, 16, 20, 24]);
    const patternType = pick(rng, ['lines', 'tapered', 'dashes', 'dots-rays', 'blades'] as const);
    const innerR = range(rng, 8, 22);
    const outerR = range(rng, 35, 48);
    const strokeW = range(rng, 2, 5);
    const angleStep = 360 / rayCount;

    let paths = '';

    switch (patternType) {
        case 'lines': {
            for (let i = 0; i < rayCount; i++) {
                const angle = i * angleStep;
                const p1 = polarToXY(CX, CY, innerR, angle);
                const p2 = polarToXY(CX, CY, outerR, angle);
                paths += `<line x1="${round(p1.x)}" y1="${round(p1.y)}" x2="${round(p2.x)}" y2="${round(p2.y)}" stroke="currentColor" stroke-width="${round(strokeW)}" stroke-linecap="round"/>`;
            }
            break;
        }
        case 'tapered': {
            const tipW = range(rng, 1, 2.5);
            const baseW = range(rng, 5, 12);
            for (let i = 0; i < rayCount; i++) {
                const angle = i * angleStep;
                const tip = polarToXY(CX, CY, outerR, angle);
                const bl = polarToXY(CX, CY, innerR, angle - (baseW / innerR) * (180 / Math.PI));
                const br = polarToXY(CX, CY, innerR, angle + (baseW / innerR) * (180 / Math.PI));
                paths += `<polygon points="${round(tip.x)},${round(tip.y)} ${round(bl.x)},${round(bl.y)} ${round(br.x)},${round(br.y)}" fill="currentColor"/>`;
            }
            break;
        }
        case 'dashes': {
            const dashGap = range(rng, 4, 8);
            const segments = pick(rng, [2, 3]);
            const totalLen = outerR - innerR;
            const segLen = (totalLen - (segments - 1) * dashGap) / segments;
            for (let i = 0; i < rayCount; i++) {
                const angle = i * angleStep;
                for (let s = 0; s < segments; s++) {
                    const r1 = innerR + s * (segLen + dashGap);
                    const r2 = r1 + segLen;
                    const p1 = polarToXY(CX, CY, r1, angle);
                    const p2 = polarToXY(CX, CY, r2, angle);
                    paths += `<line x1="${round(p1.x)}" y1="${round(p1.y)}" x2="${round(p2.x)}" y2="${round(p2.y)}" stroke="currentColor" stroke-width="${round(strokeW)}" stroke-linecap="round"/>`;
                }
            }
            break;
        }
        case 'dots-rays': {
            const dotCount = pick(rng, [3, 4, 5]);
            const dotR = range(rng, 2, 4);
            for (let i = 0; i < rayCount; i++) {
                const angle = i * angleStep;
                for (let d = 0; d < dotCount; d++) {
                    const r = innerR + (outerR - innerR) * (d / (dotCount - 1));
                    const p = polarToXY(CX, CY, r, angle);
                    const dr = round(dotR * (0.6 + 0.4 * (d / (dotCount - 1))));
                    paths += `<circle cx="${round(p.x)}" cy="${round(p.y)}" r="${dr}" fill="currentColor"/>`;
                }
            }
            break;
        }
        case 'blades': {
            const bladeLen = outerR - innerR;
            const bladeW = range(rng, 4, 9);
            for (let i = 0; i < rayCount; i++) {
                const angle = i * angleStep;
                // Curved blade using quadratic bezier
                const p1 = polarToXY(CX, CY, innerR, angle - bladeW / innerR * (180 / Math.PI));
                const p2 = polarToXY(CX, CY, outerR, angle);
                const p3 = polarToXY(CX, CY, innerR, angle + bladeW / innerR * (180 / Math.PI));
                const cp = polarToXY(CX, CY, (innerR + outerR) * 0.6, angle + angleStep * 0.15);
                paths += `<path d="M ${round(p1.x)} ${round(p1.y)} Q ${round(cp.x)} ${round(cp.y)} ${round(p2.x)} ${round(p2.y)} L ${round(p3.x)} ${round(p3.y)} Z" fill="currentColor"/>`;
            }
            break;
        }
    }

    // Optional center circle
    const hasCenter = rng() > 0.35;
    if (hasCenter) {
        const cr = range(rng, 5, innerR * 0.9);
        const filled = rng() > 0.4;
        if (filled) {
            paths += `<circle cx="${CX}" cy="${CY}" r="${round(cr)}" fill="currentColor"/>`;
        } else {
            paths += `<circle cx="${CX}" cy="${CY}" r="${round(cr)}" fill="none" stroke="currentColor" stroke-width="${round(strokeW * 0.8)}"/>`;
        }
    }

    return svgWrap(paths);
}

// ============================================================
// METHOD 5: NESTED GEOMETRY
// ============================================================

function generateNestedGeometry(brandName: string, rng: () => number): string {
    const layers = pick(rng, [2, 3, 4]);
    const baseShape = pick(rng, ['circle', 'square', 'hexagon'] as const);
    const treatment = pick(rng, ['concentric', 'alternating', 'cutout', 'offset-nest'] as const);
    const strokeW = range(rng, 2.5, 5);
    const maxR = 45;
    const minR = 8;

    let paths = '';

    const shapeAt = (shape: typeof baseShape, cx: number, cy: number, r: number, filled: boolean, sw: number): string => {
        const fillAttr = filled ? 'fill="currentColor"' : `fill="none" stroke="currentColor" stroke-width="${round(sw)}"`;
        switch (shape) {
            case 'circle':
                return `<circle cx="${round(cx)}" cy="${round(cy)}" r="${round(r)}" ${fillAttr}/>`;
            case 'square': {
                const s = r * 1.6;
                return `<rect x="${round(cx - s / 2)}" y="${round(cy - s / 2)}" width="${round(s)}" height="${round(s)}" rx="${round(r * 0.1)}" ${fillAttr}/>`;
            }
            case 'hexagon': {
                const pts = [];
                for (let i = 0; i < 6; i++) {
                    const a = (i * 60 - 90) * Math.PI / 180;
                    pts.push(`${round(cx + r * Math.cos(a))},${round(cy + r * Math.sin(a))}`);
                }
                return `<polygon points="${pts.join(' ')}" ${fillAttr}/>`;
            }
        }
    };

    const shapes: (typeof baseShape)[] = ['circle', 'square', 'hexagon'];

    switch (treatment) {
        case 'concentric': {
            for (let i = 0; i < layers; i++) {
                const r = maxR - (maxR - minR) * (i / (layers));
                paths += shapeAt(baseShape, CX, CY, r, false, strokeW);
            }
            // Solid center
            paths += shapeAt(baseShape, CX, CY, minR, true, 0);
            break;
        }
        case 'alternating': {
            for (let i = 0; i < layers; i++) {
                const r = maxR - (maxR - minR) * (i / layers);
                const shape = shapes[(shapes.indexOf(baseShape) + i) % shapes.length];
                const filled = i === layers - 1;
                paths += shapeAt(shape, CX, CY, r, filled, strokeW);
            }
            break;
        }
        case 'cutout': {
            // Outer shape filled, inner shapes cut out using mask
            const maskId = `mask-${brandName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)}`;
            let maskContent = `<rect width="${SIZE}" height="${SIZE}" fill="white"/>`;
            for (let i = 1; i <= layers - 1; i++) {
                const r = maxR * (1 - i / layers) * 0.9;
                const shape = i % 2 === 1 ? baseShape : shapes[(shapes.indexOf(baseShape) + 1) % shapes.length];
                // Mask holes alternate
                if (i % 2 === 1) {
                    switch (shape) {
                        case 'circle':
                            maskContent += `<circle cx="${CX}" cy="${CY}" r="${round(r)}" fill="black"/>`;
                            break;
                        case 'square': {
                            const s = r * 1.6;
                            maskContent += `<rect x="${round(CX - s / 2)}" y="${round(CY - s / 2)}" width="${round(s)}" height="${round(s)}" fill="black"/>`;
                            break;
                        }
                        case 'hexagon': {
                            const pts = [];
                            for (let j = 0; j < 6; j++) {
                                const a = (j * 60 - 90) * Math.PI / 180;
                                pts.push(`${round(CX + r * Math.cos(a))},${round(CY + r * Math.sin(a))}`);
                            }
                            maskContent += `<polygon points="${pts.join(' ')}" fill="black"/>`;
                            break;
                        }
                    }
                } else {
                    switch (shape) {
                        case 'circle':
                            maskContent += `<circle cx="${CX}" cy="${CY}" r="${round(r)}" fill="white"/>`;
                            break;
                        case 'square': {
                            const s = r * 1.6;
                            maskContent += `<rect x="${round(CX - s / 2)}" y="${round(CY - s / 2)}" width="${round(s)}" height="${round(s)}" fill="white"/>`;
                            break;
                        }
                        case 'hexagon': {
                            const pts = [];
                            for (let j = 0; j < 6; j++) {
                                const a = (j * 60 - 90) * Math.PI / 180;
                                pts.push(`${round(CX + r * Math.cos(a))},${round(CY + r * Math.sin(a))}`);
                            }
                            maskContent += `<polygon points="${pts.join(' ')}" fill="white"/>`;
                            break;
                        }
                    }
                }
            }
            paths += `<defs><mask id="${maskId}">${maskContent}</mask></defs>`;
            paths += `<g mask="url(#${maskId})">${shapeAt(baseShape, CX, CY, maxR, true, 0)}</g>`;
            break;
        }
        case 'offset-nest': {
            // Shapes nested but with slight offset for depth
            const offsetX = range(rng, 3, 8);
            const offsetY = range(rng, 3, 8);
            for (let i = 0; i < layers; i++) {
                const r = maxR - (maxR - minR) * (i / layers);
                const ox = offsetX * (i / layers);
                const oy = offsetY * (i / layers);
                paths += shapeAt(baseShape, CX + ox, CY + oy, r, false, strokeW);
            }
            break;
        }
    }

    return svgWrap(paths);
}

// ============================================================
// METHOD 6: DYNAMIC REPEATS
// ============================================================

function generateDynamicRepeats(brandName: string, rng: () => number): string {
    const elementType = pick(rng, ['dot', 'dash', 'leaf', 'chevron', 'square'] as const);
    const pattern = pick(rng, ['spiral', 'wave', 'cluster', 'orbit', 'grid-scatter'] as const);
    const count = intRange(rng, 8, 24);

    let paths = '';

    // Element generators
    const drawElement = (x: number, y: number, scale: number, angle: number): string => {
        const s = scale;
        switch (elementType) {
            case 'dot':
                return `<circle cx="${round(x)}" cy="${round(y)}" r="${round(3 * s)}" fill="currentColor"/>`;
            case 'dash':
                return `<line x1="${round(x - 5 * s)}" y1="${round(y)}" x2="${round(x + 5 * s)}" y2="${round(y)}" stroke="currentColor" stroke-width="${round(2.5 * s)}" stroke-linecap="round" transform="rotate(${round(angle)} ${round(x)} ${round(y)})"/>`;
            case 'leaf': {
                const lw = 4 * s;
                const lh = 8 * s;
                return `<path d="M ${round(x)} ${round(y - lh)} Q ${round(x + lw)} ${round(y)} ${round(x)} ${round(y + lh)} Q ${round(x - lw)} ${round(y)} ${round(x)} ${round(y - lh)} Z" fill="currentColor" transform="rotate(${round(angle)} ${round(x)} ${round(y)})"/>`;
            }
            case 'chevron': {
                const cw = 5 * s;
                const ch = 3 * s;
                return `<polyline points="${round(x - cw)},${round(y - ch)} ${round(x)},${round(y + ch)} ${round(x + cw)},${round(y - ch)}" fill="none" stroke="currentColor" stroke-width="${round(2 * s)}" stroke-linecap="round" stroke-linejoin="round" transform="rotate(${round(angle)} ${round(x)} ${round(y)})"/>`;
            }
            case 'square': {
                const sz = 5 * s;
                return `<rect x="${round(x - sz / 2)}" y="${round(y - sz / 2)}" width="${round(sz)}" height="${round(sz)}" fill="currentColor" transform="rotate(${round(angle)} ${round(x)} ${round(y)})"/>`;
            }
        }
    };

    switch (pattern) {
        case 'spiral': {
            const turns = range(rng, 1.2, 2.5);
            const maxR = 44;
            const minR = 6;
            for (let i = 0; i < count; i++) {
                const t = i / (count - 1);
                const angle = t * turns * 360;
                const r = minR + (maxR - minR) * t;
                const p = polarToXY(CX, CY, r, angle);
                const scale = 0.5 + t * 0.8;
                paths += drawElement(p.x, p.y, scale, angle);
            }
            break;
        }
        case 'wave': {
            const amplitude = range(rng, 15, 30);
            const periods = range(rng, 1, 2.5);
            const startX = CX - 42;
            const totalW = 84;
            for (let i = 0; i < count; i++) {
                const t = i / (count - 1);
                const x = startX + totalW * t;
                const y = CY + Math.sin(t * periods * Math.PI * 2) * amplitude;
                const angle = Math.atan2(
                    Math.cos(t * periods * Math.PI * 2) * amplitude * periods * Math.PI * 2 / totalW,
                    1
                ) * (180 / Math.PI);
                const scale = 0.6 + 0.5 * (0.5 + 0.5 * Math.sin(t * Math.PI));
                paths += drawElement(x, y, scale, angle);
            }
            break;
        }
        case 'cluster': {
            const clusterR = range(rng, 25, 40);
            for (let i = 0; i < count; i++) {
                // Gaussian-ish distribution around center
                const angle = rng() * 360;
                const dist = clusterR * Math.sqrt(rng()) * 0.9;
                const p = polarToXY(CX, CY, dist, angle);
                const scale = 0.4 + rng() * 0.8;
                paths += drawElement(p.x, p.y, scale, angle + rng() * 60);
            }
            break;
        }
        case 'orbit': {
            const orbits = pick(rng, [2, 3]);
            for (let o = 0; o < orbits; o++) {
                const orbitR = 15 + (35 * (o + 1)) / orbits;
                const itemsOnOrbit = Math.floor(count / orbits);
                const orbitOffset = range(rng, 0, 360);
                for (let i = 0; i < itemsOnOrbit; i++) {
                    const angle = orbitOffset + (i / itemsOnOrbit) * 360;
                    const p = polarToXY(CX, CY, orbitR, angle);
                    const scale = 0.5 + 0.3 * (o / orbits);
                    paths += drawElement(p.x, p.y, scale, angle);
                }
            }
            // Center dot
            paths += `<circle cx="${CX}" cy="${CY}" r="${round(range(rng, 4, 8))}" fill="currentColor"/>`;
            break;
        }
        case 'grid-scatter': {
            const cols = pick(rng, [4, 5, 6]);
            const rows = pick(rng, [4, 5, 6]);
            const gridW = 76;
            const gridH = 76;
            const cellW = gridW / cols;
            const cellH = gridH / rows;
            const startGX = CX - gridW / 2;
            const startGY = CY - gridH / 2;
            let placed = 0;
            for (let r = 0; r < rows && placed < count; r++) {
                for (let c = 0; c < cols && placed < count; c++) {
                    if (rng() > 0.4) {
                        const x = startGX + c * cellW + cellW / 2 + range(rng, -2, 2);
                        const y = startGY + r * cellH + cellH / 2 + range(rng, -2, 2);
                        const scale = range(rng, 0.5, 1.0);
                        const angle = rng() * 360;
                        paths += drawElement(x, y, scale, angle);
                        placed++;
                    }
                }
            }
            break;
        }
    }

    return svgWrap(paths);
}

// ============================================================
// MAIN ENGINE
// ============================================================

export type GeometricMethod =
    | 'radial-symmetry'
    | 'letterform-abstraction'
    | 'grid-construction'
    | 'rotational-pattern'
    | 'nested-geometry'
    | 'dynamic-repeats';

const ALL_METHODS: GeometricMethod[] = [
    'radial-symmetry',
    'letterform-abstraction',
    'grid-construction',
    'rotational-pattern',
    'nested-geometry',
    'dynamic-repeats',
];

const METHOD_GENERATORS: Record<GeometricMethod, (brandName: string, rng: () => number) => string> = {
    'radial-symmetry': generateRadialSymmetry,
    'letterform-abstraction': generateLetterformAbstraction,
    'grid-construction': generateGridConstruction,
    'rotational-pattern': generateRotationalPattern,
    'nested-geometry': generateNestedGeometry,
    'dynamic-repeats': generateDynamicRepeats,
};

export interface GeometricLogoResult {
    svg: string;
    method: GeometricMethod;
    seed: string;
}

/**
 * Generate geometric logo variations for a brand.
 *
 * @param brandName - The brand name to generate logos for
 * @param count - Number of variations to produce (3-5, default 4)
 * @param seed - Optional seed override (defaults to brandName + timestamp-like salt)
 * @returns Array of GeometricLogoResult with SVG string, method name, and seed
 */
export function generateGeometricLogos(
    brandName: string,
    count: number = 4,
    seed?: string,
): GeometricLogoResult[] {
    const effectiveCount = Math.max(3, Math.min(5, count));
    const baseSeed = seed || brandName;
    const masterRng = createRng(baseSeed);

    // Shuffle methods and pick `count` distinct ones
    const shuffled = [...ALL_METHODS].sort(() => masterRng() - 0.5);
    const selectedMethods = shuffled.slice(0, effectiveCount);

    // If we need more than 6 (shouldn't happen with max 5), wrap around
    const results: GeometricLogoResult[] = [];

    for (let i = 0; i < effectiveCount; i++) {
        const method = selectedMethods[i % ALL_METHODS.length];
        const variantSeed = `${baseSeed}__geo_${method}_${i}`;
        const rng = createRng(variantSeed);

        const svg = METHOD_GENERATORS[method](brandName, rng);

        results.push({
            svg,
            method,
            seed: variantSeed,
        });
    }

    return results;
}

/**
 * Generate a single geometric logo using a specific method.
 */
export function generateSingleGeometricLogo(
    brandName: string,
    method: GeometricMethod,
    seed?: string,
): GeometricLogoResult {
    const effectiveSeed = seed || `${brandName}__geo_${method}`;
    const rng = createRng(effectiveSeed);
    const svg = METHOD_GENERATORS[method](brandName, rng);

    return {
        svg,
        method,
        seed: effectiveSeed,
    };
}
