/**
 * Geometric SVG Logo Engine — Premium Edition
 *
 * Generates 5 distinct logo variations per brand, each using a fundamentally
 * different construction method. Output looks like $5k brand studio work.
 *
 * Variations:
 *  1. Radial Construct — shape repeated 3-8x with rotational symmetry
 *  2. Negative Space Mark — circle/square with boolean-subtracted silhouette
 *  3. Dynamic Pattern — element repeated in spiral/wave/grid/cluster
 *  4. Interconnected Geometry — 2-3 shapes overlapping/interlocking
 *  5. Constructed Letterform — highly abstract geometric letter
 *
 * Quality hardcodes:
 *  - 512×512 viewBox, perfectly centered
 *  - Stroke widths: only 2, 4, 6, or 8
 *  - Monochrome (currentColor), no gradients
 *  - Clean paths, minimal nodes
 *  - Must work at 32×32 (favicon test)
 */

// ============================================================
// TYPES
// ============================================================

export type Aesthetic = 'minimalist' | 'tech' | 'nature' | 'bold';
export type Industry =
    | 'technology' | 'finance' | 'health' | 'food'
    | 'education' | 'creative' | 'nature' | 'retail' | 'general';

export type GeometricMethod =
    | 'radial-construct'
    | 'negative-space'
    | 'dynamic-pattern'
    | 'interconnected-geometry'
    | 'constructed-letterform';

export interface GeometricLogoResult {
    svg: string;
    method: GeometricMethod;
    aesthetic: Aesthetic;
    seed: string;
}

// ============================================================
// CONSTANTS
// ============================================================

const SIZE = 512;
const CX = 256;
const CY = 256;
const STROKES = [2, 4, 6, 8] as const;
const PHI = 1.618033988749895;

// ============================================================
// SEEDED RNG
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

function pick<T>(rng: () => number, arr: readonly T[]): T {
    return arr[Math.floor(rng() * arr.length)];
}

function rr(rng: () => number, min: number, max: number): number {
    return min + rng() * (max - min);
}

function ri(rng: () => number, min: number, max: number): number {
    return Math.floor(rr(rng, min, max + 1));
}

function pickStroke(rng: () => number): number {
    return pick(rng, STROKES);
}

function R(n: number): number {
    return Math.round(n * 100) / 100;
}

// ============================================================
// SVG HELPERS
// ============================================================

function svgWrap(inner: string): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}">${inner}</svg>`;
}

function polar(cx: number, cy: number, r: number, deg: number): { x: number; y: number } {
    const rad = (deg - 90) * (Math.PI / 180);
    return { x: R(cx + r * Math.cos(rad)), y: R(cy + r * Math.sin(rad)) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
    const s = polar(cx, cy, r, endDeg);
    const e = polar(cx, cy, r, startDeg);
    const large = endDeg - startDeg <= 180 ? 0 : 1;
    return `M ${s.x} ${s.y} A ${R(r)} ${R(r)} 0 ${large} 0 ${e.x} ${e.y}`;
}

function hexPoints(cx: number, cy: number, r: number, rotDeg: number = 0): string {
    const pts: string[] = [];
    for (let i = 0; i < 6; i++) {
        const a = (i * 60 + rotDeg - 90) * Math.PI / 180;
        pts.push(`${R(cx + r * Math.cos(a))},${R(cy + r * Math.sin(a))}`);
    }
    return pts.join(' ');
}

function nGonPoints(cx: number, cy: number, r: number, sides: number, rotDeg: number = 0): string {
    const pts: string[] = [];
    const step = 360 / sides;
    for (let i = 0; i < sides; i++) {
        const a = (i * step + rotDeg - 90) * Math.PI / 180;
        pts.push(`${R(cx + r * Math.cos(a))},${R(cy + r * Math.sin(a))}`);
    }
    return pts.join(' ');
}

// ============================================================
// INDUSTRY-AWARE ABSTRACT SHAPE LIBRARY
//
// These are abstract geometric primitives — NOT literal icons.
// They serve as base shapes for the construction methods.
// ============================================================

interface ShapeDef {
    path: (cx: number, cy: number, r: number, sw: number) => string;
}

const INDUSTRY_SHAPES: Record<Industry, ShapeDef[]> = {
    technology: [
        // Circuit node: small circle with 4 lines extending outward (clipped short)
        { path: (cx, cy, r, sw) => {
            const ir = r * 0.3;
            const or = r * 0.85;
            return `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(ir)}" fill="currentColor"/>`
                + [0, 90, 180, 270].map(a => {
                    const s = polar(cx, cy, ir, a);
                    const e = polar(cx, cy, or, a);
                    return `<line x1="${s.x}" y1="${s.y}" x2="${e.x}" y2="${e.y}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
                }).join('');
        }},
        // Angular bracket pair: < >
        { path: (cx, cy, r, sw) => {
            const h = r * 0.7;
            const w = r * 0.4;
            return `<polyline points="${R(cx - w * 0.2)},${R(cy - h)} ${R(cx - w)},${R(cy)} ${R(cx - w * 0.2)},${R(cy + h)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
                + `<polyline points="${R(cx + w * 0.2)},${R(cy - h)} ${R(cx + w)},${R(cy)} ${R(cx + w * 0.2)},${R(cy + h)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }},
        // Pixel grid: 2×2 squares offset
        { path: (cx, cy, r, sw) => {
            const s = r * 0.35;
            const g = r * 0.1;
            return `<rect x="${R(cx - s - g / 2)}" y="${R(cy - s - g / 2)}" width="${R(s)}" height="${R(s)}" fill="currentColor"/>`
                + `<rect x="${R(cx + g / 2)}" y="${R(cy - s - g / 2)}" width="${R(s)}" height="${R(s)}" fill="currentColor"/>`
                + `<rect x="${R(cx - s - g / 2)}" y="${R(cy + g / 2)}" width="${R(s)}" height="${R(s)}" fill="currentColor"/>`
                + `<rect x="${R(cx + g / 2)}" y="${R(cy + g / 2)}" width="${R(s)}" height="${R(s)}" fill="currentColor"/>`;
        }},
        // Data stream: 3 parallel lines with varied lengths
        { path: (cx, cy, r, sw) => {
            const sp = r * 0.35;
            return [-1, 0, 1].map((i, idx) => {
                const w = r * (idx === 1 ? 0.9 : 0.6);
                const y = cy + i * sp;
                return `<line x1="${R(cx - w / 2)}" y1="${R(y)}" x2="${R(cx + w / 2)}" y2="${R(y)}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            }).join('');
        }},
    ],
    finance: [
        // Shield form: pointed bottom
        { path: (cx, cy, r, sw) => {
            const w = r * 0.75;
            const h = r;
            return `<path d="M ${R(cx - w)} ${R(cy - h * 0.5)} L ${R(cx - w)} ${R(cy + h * 0.15)} L ${R(cx)} ${R(cy + h * 0.65)} L ${R(cx + w)} ${R(cy + h * 0.15)} L ${R(cx + w)} ${R(cy - h * 0.5)} Z" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/>`;
        }},
        // Ascending bars (abstract growth)
        { path: (cx, cy, r, sw) => {
            const bw = r * 0.2;
            const gap = r * 0.08;
            return [0, 1, 2].map(i => {
                const h = r * (0.5 + i * 0.25);
                const x = cx - bw * 1.5 - gap + i * (bw + gap);
                return `<rect x="${R(x)}" y="${R(cy + r * 0.5 - h)}" width="${R(bw)}" height="${R(h)}" rx="${R(bw * 0.15)}" fill="currentColor"/>`;
            }).join('');
        }},
        // Stable base: trapezoid/triangle pointing up
        { path: (cx, cy, r, sw) => {
            const bw = r * 0.9;
            const tw = r * 0.35;
            const h = r * 0.8;
            return `<path d="M ${R(cx - bw / 2)} ${R(cy + h / 2)} L ${R(cx - tw / 2)} ${R(cy - h / 2)} L ${R(cx + tw / 2)} ${R(cy - h / 2)} L ${R(cx + bw / 2)} ${R(cy + h / 2)} Z" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/>`;
        }},
    ],
    health: [
        // Organic cross (rounded)
        { path: (cx, cy, r, sw) => {
            const w = r * 0.3;
            const l = r * 0.75;
            const rx = w * 0.4;
            return `<rect x="${R(cx - w / 2)}" y="${R(cy - l)}" width="${R(w)}" height="${R(l * 2)}" rx="${R(rx)}" fill="currentColor"/>`
                + `<rect x="${R(cx - l)}" y="${R(cy - w / 2)}" width="${R(l * 2)}" height="${R(w)}" rx="${R(rx)}" fill="currentColor"/>`;
        }},
        // Heartbeat rhythm: zigzag pulse line
        { path: (cx, cy, r, sw) => {
            const w = r * 0.9;
            const h = r * 0.45;
            return `<polyline points="${R(cx - w)},${R(cy)} ${R(cx - w * 0.5)},${R(cy)} ${R(cx - w * 0.3)},${R(cy - h)} ${R(cx - w * 0.1)},${R(cy + h * 0.7)} ${R(cx + w * 0.1)},${R(cy - h * 0.5)} ${R(cx + w * 0.3)},${R(cy + h * 0.3)} ${R(cx + w * 0.5)},${R(cy)} ${R(cx + w)},${R(cy)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }},
        // Growth spiral (golden ratio inspired)
        { path: (cx, cy, r, sw) => {
            const pts: string[] = [];
            for (let i = 0; i <= 60; i++) {
                const t = i / 60;
                const angle = t * 720; // 2 full turns
                const radius = r * 0.15 + r * 0.7 * t;
                const p = polar(cx, cy, radius, angle);
                pts.push(`${p.x},${p.y}`);
            }
            return `<polyline points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
        }},
    ],
    food: [
        // Flame shape: abstract double curve
        { path: (cx, cy, r, sw) => {
            const h = r * 0.9;
            const w = r * 0.55;
            return `<path d="M ${R(cx)} ${R(cy + h * 0.5)} Q ${R(cx - w)} ${R(cy)} ${R(cx)} ${R(cy - h * 0.5)} Q ${R(cx + w * 0.3)} ${R(cy - h * 0.1)} ${R(cx)} ${R(cy + h * 0.5)} Z" fill="currentColor"/>`;
        }},
        // Organic circle with notch
        { path: (cx, cy, r, sw) => {
            return `<path d="${arcPath(cx, cy, r * 0.85, 30, 330)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
        }},
        // Leaf accent (single curved form)
        { path: (cx, cy, r, sw) => {
            const h = r * 0.9;
            const w = r * 0.5;
            return `<path d="M ${R(cx)} ${R(cy - h / 2)} Q ${R(cx + w)} ${R(cy)} ${R(cx)} ${R(cy + h / 2)} Q ${R(cx - w * 0.4)} ${R(cy)} ${R(cx)} ${R(cy - h / 2)} Z" fill="currentColor"/>`;
        }},
    ],
    education: [
        // Open book form: V-shape with page edges
        { path: (cx, cy, r, sw) => {
            const w = r * 0.8;
            const h = r * 0.6;
            return `<path d="M ${R(cx)} ${R(cy + h * 0.3)} L ${R(cx - w)} ${R(cy - h)} M ${R(cx)} ${R(cy + h * 0.3)} L ${R(cx + w)} ${R(cy - h)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`
                + `<path d="M ${R(cx)} ${R(cy + h * 0.3)} L ${R(cx)} ${R(cy + h)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
        }},
        // Beacon/light: radiating arcs above a point
        { path: (cx, cy, r, sw) => {
            const dot = r * 0.12;
            let result = `<circle cx="${R(cx)}" cy="${R(cy + r * 0.3)}" r="${R(dot)}" fill="currentColor"/>`;
            for (let i = 1; i <= 3; i++) {
                const ar = r * 0.2 * i;
                result += `<path d="${arcPath(cx, cy + r * 0.3, ar, -60 - i * 10, -120 + i * 10)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            }
            return result;
        }},
        // Ascending steps
        { path: (cx, cy, r, sw) => {
            const steps = 4;
            const stepW = r * 1.4 / steps;
            const stepH = r * 1.2 / steps;
            let d = `M ${R(cx - r * 0.7)} ${R(cy + r * 0.6)}`;
            for (let i = 0; i < steps; i++) {
                d += ` L ${R(cx - r * 0.7 + i * stepW)} ${R(cy + r * 0.6 - i * stepH)}`;
                d += ` L ${R(cx - r * 0.7 + (i + 1) * stepW)} ${R(cy + r * 0.6 - i * stepH)}`;
            }
            d += ` L ${R(cx + r * 0.7)} ${R(cy - r * 0.6)}`;
            return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
        }},
    ],
    creative: [
        // Brush stroke: single dynamic curve
        { path: (cx, cy, r, sw) => {
            return `<path d="M ${R(cx - r * 0.8)} ${R(cy + r * 0.3)} C ${R(cx - r * 0.3)} ${R(cy - r * 0.8)}, ${R(cx + r * 0.3)} ${R(cy + r * 0.8)}, ${R(cx + r * 0.8)} ${R(cy - r * 0.3)}" fill="none" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
        }},
        // Spiral form
        { path: (cx, cy, r, sw) => {
            let d = '';
            for (let i = 0; i <= 80; i++) {
                const t = i / 80;
                const angle = t * 1080; // 3 turns
                const radius = r * 0.1 + r * 0.65 * t;
                const p = polar(cx, cy, radius, angle);
                d += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
            }
            return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
        }},
        // Eye shape: two intersecting arcs
        { path: (cx, cy, r, sw) => {
            const w = r * 0.9;
            const h = r * 0.45;
            return `<path d="M ${R(cx - w)} ${R(cy)} Q ${R(cx)} ${R(cy - h * 2)}, ${R(cx + w)} ${R(cy)} Q ${R(cx)} ${R(cy + h * 2)}, ${R(cx - w)} ${R(cy)} Z" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
                + `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r * 0.18)}" fill="currentColor"/>`;
        }},
    ],
    nature: [
        // Leaf construction: teardrop with stem
        { path: (cx, cy, r, sw) => {
            const w = r * 0.55;
            const h = r * 0.9;
            return `<path d="M ${R(cx)} ${R(cy - h)} Q ${R(cx + w)} ${R(cy - h * 0.2)}, ${R(cx)} ${R(cy + h * 0.6)} Q ${R(cx - w)} ${R(cy - h * 0.2)}, ${R(cx)} ${R(cy - h)} Z" fill="currentColor" transform="rotate(-15 ${cx} ${cy})"/>`;
        }},
        // Water ripple: concentric broken arcs
        { path: (cx, cy, r, sw) => {
            return [0.3, 0.55, 0.8].map(f => {
                return `<path d="${arcPath(cx, cy, r * f, 30, 330)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            }).join('');
        }},
        // Sun radiation: circle with 8 offset rays
        { path: (cx, cy, r, sw) => {
            const ir = r * 0.3;
            const or = r * 0.75;
            let result = `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(ir)}" fill="currentColor"/>`;
            for (let i = 0; i < 8; i++) {
                const a = i * 45;
                const s = polar(cx, cy, ir + sw, a);
                const e = polar(cx, cy, or, a);
                result += `<line x1="${s.x}" y1="${s.y}" x2="${e.x}" y2="${e.y}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            }
            return result;
        }},
        // Seed pattern: teardrop
        { path: (cx, cy, r, sw) => {
            return `<path d="M ${R(cx)} ${R(cy - r * 0.8)} Q ${R(cx + r * 0.45)} ${R(cy + r * 0.1)}, ${R(cx)} ${R(cy + r * 0.8)} Q ${R(cx - r * 0.45)} ${R(cy + r * 0.1)}, ${R(cx)} ${R(cy - r * 0.8)} Z" fill="currentColor"/>`;
        }},
    ],
    retail: [
        // Bag silhouette (abstract)
        { path: (cx, cy, r, sw) => {
            const w = r * 0.7;
            const h = r * 0.8;
            return `<rect x="${R(cx - w / 2)}" y="${R(cy - h * 0.2)}" width="${R(w)}" height="${R(h)}" rx="${R(w * 0.08)}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
                + `<path d="${arcPath(cx, cy - h * 0.2, w * 0.3, 0, 180)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
        }},
        // Tag shape
        { path: (cx, cy, r, sw) => {
            const w = r * 0.7;
            const h = r * 0.9;
            return `<path d="M ${R(cx - w / 2)} ${R(cy - h / 2)} L ${R(cx + w / 2)} ${R(cy - h / 2)} L ${R(cx + w / 2)} ${R(cy + h * 0.2)} L ${R(cx)} ${R(cy + h / 2)} L ${R(cx - w / 2)} ${R(cy + h * 0.2)} Z" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/>`
                + `<circle cx="${R(cx)}" cy="${R(cy - h * 0.2)}" r="${R(r * 0.08)}" fill="currentColor"/>`;
        }},
        // Arrow cart abstraction: forward arrow
        { path: (cx, cy, r, sw) => {
            const w = r * 0.7;
            const h = r * 0.5;
            return `<polyline points="${R(cx - w)},${R(cy - h)} ${R(cx + w * 0.3)},${R(cy)} ${R(cx - w)},${R(cy + h)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`
                + `<line x1="${R(cx - w * 0.7)}" y1="${R(cy)}" x2="${R(cx + w * 0.3)}" y2="${R(cy)}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
        }},
    ],
    general: [
        // Abstract diamond
        { path: (cx, cy, r, sw) => {
            return `<polygon points="${R(cx)},${R(cy - r)} ${R(cx + r * 0.65)},${R(cy)} ${R(cx)},${R(cy + r)} ${R(cx - r * 0.65)},${R(cy)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linejoin="round"/>`;
        }},
        // Concentric circles
        { path: (cx, cy, r, sw) => {
            return `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r * 0.9)}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
                + `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r * 0.5)}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`
                + `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(r * 0.15)}" fill="currentColor"/>`;
        }},
        // Asterisk mark
        { path: (cx, cy, r, sw) => {
            return [0, 60, 120].map(a => {
                const s = polar(cx, cy, r * 0.85, a);
                const e = polar(cx, cy, r * 0.85, a + 180);
                return `<line x1="${s.x}" y1="${s.y}" x2="${e.x}" y2="${e.y}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            }).join('');
        }},
    ],
};

// Map aesthetic to resolved industry if applicable
function resolveIndustry(ind: string): Industry {
    const map: Record<string, Industry> = {
        technology: 'technology', tech: 'technology', saas: 'technology', software: 'technology',
        finance: 'finance', fintech: 'finance', banking: 'finance', crypto: 'finance',
        health: 'health', healthcare: 'health', medical: 'health', wellness: 'health', fitness: 'health',
        food: 'food', restaurant: 'food', beverage: 'food', cafe: 'food', bakery: 'food',
        education: 'education', learning: 'education', academy: 'education',
        creative: 'creative', design: 'creative', art: 'creative', studio: 'creative', media: 'creative', music: 'creative',
        nature: 'nature', sustainability: 'nature', eco: 'nature', green: 'nature', environment: 'nature',
        retail: 'retail', ecommerce: 'retail', shopping: 'retail', fashion: 'retail', store: 'retail',
    };
    return map[ind.toLowerCase()] || 'general';
}

function getIndustryShapes(industry: Industry): ShapeDef[] {
    return INDUSTRY_SHAPES[industry] || INDUSTRY_SHAPES.general;
}

// ============================================================
// AESTHETIC MODIFIERS
//
// Each aesthetic fundamentally changes the shapes, not just colors.
// ============================================================

interface AestheticConfig {
    strokeWeight: number;       // from STROKES
    cornerRadius: number;       // 0 = sharp, 1 = max round
    maxElements: number;        // element count ceiling
    preferFill: boolean;        // filled vs stroked
    angleSnap: number;          // 0 = free, 45 = snap to 45°, 90 = snap to 90°
    organicCurve: number;       // 0 = straight lines only, 1 = all curves
    whitespace: number;         // 0 = tight, 1 = lots of breathing room
}

function getAestheticConfig(aesthetic: Aesthetic, rng: () => number): AestheticConfig {
    switch (aesthetic) {
        case 'minimalist':
            return {
                strokeWeight: pick(rng, [2, 4]),
                cornerRadius: 0.2,
                maxElements: 3,
                preferFill: false,
                angleSnap: 0,
                organicCurve: 0.3,
                whitespace: 0.8,
            };
        case 'tech':
            return {
                strokeWeight: pick(rng, [4, 6]),
                cornerRadius: 0,
                maxElements: 6,
                preferFill: rng() > 0.5,
                angleSnap: 45,
                organicCurve: 0,
                whitespace: 0.4,
            };
        case 'nature':
            return {
                strokeWeight: pick(rng, [4, 6]),
                cornerRadius: 0.9,
                maxElements: 6,
                preferFill: true,
                angleSnap: 0,
                organicCurve: 1.0,
                whitespace: 0.5,
            };
        case 'bold':
            return {
                strokeWeight: pick(rng, [6, 8]),
                cornerRadius: 0.3,
                maxElements: 4,
                preferFill: true,
                angleSnap: 0,
                organicCurve: 0.2,
                whitespace: 0.25,
            };
    }
}

function snapAngle(angle: number, snap: number): number {
    if (snap === 0) return angle;
    return Math.round(angle / snap) * snap;
}

// ============================================================
// VARIATION 1: RADIAL CONSTRUCT
//
// Pick a small shape (triangle, arc, teardrop, diamond).
// Repeat 3-8x around center with perfect rotational symmetry.
// ============================================================

function generateRadialConstruct(
    brandName: string,
    industry: Industry,
    aesthetic: Aesthetic,
    rng: () => number,
): string {
    const cfg = getAestheticConfig(aesthetic, rng);
    const sw = cfg.strokeWeight;
    const folds = pick(rng, aesthetic === 'minimalist' ? [3, 4] : [3, 4, 5, 6, 8]);
    const angleStep = 360 / folds;
    const outerR = SIZE * (0.38 - cfg.whitespace * 0.08);
    const innerR = outerR * rr(rng, 0.15, 0.4);
    const rotOffset = snapAngle(rr(rng, 0, angleStep), cfg.angleSnap);

    // Choose base shape
    const shapeType = pick(rng, aesthetic === 'nature'
        ? ['petal', 'teardrop', 'arc', 'leaf'] as const
        : aesthetic === 'tech'
            ? ['triangle', 'diamond', 'bar', 'bracket'] as const
            : ['triangle', 'arc', 'teardrop', 'diamond', 'petal'] as const);

    let shapeSvg = '';
    const useFill = cfg.preferFill || rng() > 0.5;
    const fill = useFill ? 'fill="currentColor"' : 'fill="none"';
    const stroke = useFill ? '' : `stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;

    switch (shapeType) {
        case 'triangle': {
            const halfA = rr(rng, 8, angleStep * 0.3);
            const tip = polar(CX, CY, outerR, 0);
            const bl = polar(CX, CY, innerR, -halfA);
            const br = polar(CX, CY, innerR, halfA);
            shapeSvg = `<path d="M ${tip.x} ${tip.y} L ${bl.x} ${bl.y} L ${br.x} ${br.y} Z" ${fill} ${stroke}/>`;
            break;
        }
        case 'arc': {
            const span = rr(rng, 25, angleStep * 0.65);
            const r = rr(rng, innerR + 20, outerR);
            shapeSvg = `<path d="${arcPath(CX, CY, r, -span / 2, span / 2)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            break;
        }
        case 'teardrop': {
            const h = outerR - innerR;
            const w = h * rr(rng, 0.3, 0.55);
            shapeSvg = `<path d="M ${R(CX)} ${R(CY - outerR)} Q ${R(CX + w)} ${R(CY - innerR - h * 0.3)} ${R(CX)} ${R(CY - innerR)} Q ${R(CX - w)} ${R(CY - innerR - h * 0.3)} ${R(CX)} ${R(CY - outerR)} Z" ${fill} ${stroke}/>`;
            break;
        }
        case 'diamond': {
            const h = rr(rng, 30, 60);
            const w = rr(rng, 14, 28);
            const midR = (innerR + outerR) / 2;
            shapeSvg = `<path d="M ${R(CX)} ${R(CY - midR - h / 2)} L ${R(CX + w / 2)} ${R(CY - midR)} L ${R(CX)} ${R(CY - midR + h / 2)} L ${R(CX - w / 2)} ${R(CY - midR)} Z" ${fill} ${stroke}/>`;
            break;
        }
        case 'petal': {
            const h = outerR - innerR;
            const w = h * rr(rng, 0.35, 0.6);
            const mid = CY - innerR - h / 2;
            shapeSvg = `<path d="M ${R(CX)} ${R(CY - innerR)} Q ${R(CX + w)} ${R(mid)} ${R(CX)} ${R(CY - outerR)} Q ${R(CX - w)} ${R(mid)} ${R(CX)} ${R(CY - innerR)} Z" fill="currentColor"/>`;
            break;
        }
        case 'leaf': {
            const h = outerR - innerR;
            const w = h * rr(rng, 0.3, 0.5);
            shapeSvg = `<path d="M ${R(CX)} ${R(CY - outerR)} Q ${R(CX + w)} ${R(CY - innerR - h * 0.4)} ${R(CX)} ${R(CY - innerR)} Q ${R(CX - w * 0.5)} ${R(CY - innerR - h * 0.6)} ${R(CX)} ${R(CY - outerR)} Z" fill="currentColor"/>`;
            break;
        }
        case 'bar': {
            const bh = rr(rng, 30, 60);
            const bw = sw * 2;
            const midR = (innerR + outerR) / 2;
            shapeSvg = `<rect x="${R(CX - bw / 2)}" y="${R(CY - midR - bh / 2)}" width="${R(bw)}" height="${R(bh)}" fill="currentColor"/>`;
            break;
        }
        case 'bracket': {
            const bh = rr(rng, 25, 50);
            const bw = bh * 0.35;
            const midR = (innerR + outerR) / 2;
            const by = CY - midR;
            shapeSvg = `<polyline points="${R(CX + bw)},${R(by - bh / 2)} ${R(CX - bw)},${R(by - bh / 2)} ${R(CX - bw)},${R(by + bh / 2)} ${R(CX + bw)},${R(by + bh / 2)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
            break;
        }
    }

    let paths = '';
    for (let i = 0; i < folds; i++) {
        const angle = R(i * angleStep + rotOffset);
        paths += `<g transform="rotate(${angle} ${CX} ${CY})">${shapeSvg}</g>`;
    }

    // Optional center accent
    if (rng() > 0.45) {
        const cr = rr(rng, 8, innerR * 0.65);
        if (cfg.preferFill) {
            paths += `<circle cx="${CX}" cy="${CY}" r="${R(cr)}" fill="currentColor"/>`;
        } else {
            paths += `<circle cx="${CX}" cy="${CY}" r="${R(cr)}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
        }
    }

    return svgWrap(paths);
}

// ============================================================
// VARIATION 2: NEGATIVE SPACE MARK
//
// Circle or square with shapes cut out to reveal a silhouette.
// Boolean subtraction using SVG masks.
// ============================================================

function generateNegativeSpace(
    brandName: string,
    industry: Industry,
    aesthetic: Aesthetic,
    rng: () => number,
): string {
    const cfg = getAestheticConfig(aesthetic, rng);
    const containerShape = pick(rng, aesthetic === 'tech'
        ? ['square', 'rounded-square'] as const
        : aesthetic === 'nature'
            ? ['circle', 'rounded-square'] as const
            : ['circle', 'square', 'rounded-square', 'hexagon'] as const);

    const containerR = SIZE * (0.4 - cfg.whitespace * 0.05);
    const maskId = `ns-${brandName.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6)}-${ri(rng, 100, 999)}`;

    // Build container path
    let container = '';
    switch (containerShape) {
        case 'circle':
            container = `<circle cx="${CX}" cy="${CY}" r="${R(containerR)}" fill="currentColor"/>`;
            break;
        case 'square':
            container = `<rect x="${R(CX - containerR)}" y="${R(CY - containerR)}" width="${R(containerR * 2)}" height="${R(containerR * 2)}" fill="currentColor"/>`;
            break;
        case 'rounded-square': {
            const rx = containerR * 0.18;
            container = `<rect x="${R(CX - containerR)}" y="${R(CY - containerR)}" width="${R(containerR * 2)}" height="${R(containerR * 2)}" rx="${R(rx)}" fill="currentColor"/>`;
            break;
        }
        case 'hexagon':
            container = `<polygon points="${hexPoints(CX, CY, containerR)}" fill="currentColor"/>`;
            break;
    }

    // Build cutout shape using industry shapes
    const shapes = getIndustryShapes(industry);
    const shapeDef = pick(rng, shapes);
    const cutoutR = containerR * rr(rng, 0.45, 0.7);
    const cutoutContent = shapeDef.path(CX, CY, cutoutR, cfg.strokeWeight);

    // Build mask: white container, black cutout
    const mask = `<defs><mask id="${maskId}"><rect width="${SIZE}" height="${SIZE}" fill="white"/><g fill="black" stroke="black" stroke-width="${cfg.strokeWeight}">${cutoutContent.replace(/fill="currentColor"/g, 'fill="black"').replace(/stroke="currentColor"/g, 'stroke="black"')}</g></mask></defs>`;

    return svgWrap(`${mask}<g mask="url(#${maskId})">${container}</g>`);
}

// ============================================================
// VARIATION 3: DYNAMIC PATTERN
//
// Single element repeated in spiral, wave, grid, or cluster.
// ============================================================

function generateDynamicPattern(
    brandName: string,
    industry: Industry,
    aesthetic: Aesthetic,
    rng: () => number,
): string {
    const cfg = getAestheticConfig(aesthetic, rng);
    const sw = cfg.strokeWeight;
    const layout = pick(rng, aesthetic === 'tech'
        ? ['grid', 'orbit'] as const
        : aesthetic === 'nature'
            ? ['spiral', 'wave', 'cluster'] as const
            : ['spiral', 'wave', 'grid', 'cluster', 'orbit'] as const);

    const count = ri(rng, 8, Math.min(24, cfg.maxElements * 4));
    const elementType = pick(rng, aesthetic === 'nature'
        ? ['dot', 'leaf', 'arc'] as const
        : aesthetic === 'tech'
            ? ['dot', 'square', 'dash'] as const
            : aesthetic === 'bold'
                ? ['dot', 'diamond', 'square'] as const
                : ['dot', 'dash', 'arc'] as const);

    const maxR = SIZE * 0.38;

    const drawEl = (x: number, y: number, scale: number, angle: number): string => {
        const s = Math.max(0.3, scale);
        switch (elementType) {
            case 'dot': {
                const r = R(6 * s + sw * 0.3);
                return `<circle cx="${R(x)}" cy="${R(y)}" r="${r}" fill="currentColor"/>`;
            }
            case 'dash': {
                const len = R(14 * s);
                return `<line x1="${R(x - len)}" y1="${R(y)}" x2="${R(x + len)}" y2="${R(y)}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" transform="rotate(${R(angle)} ${R(x)} ${R(y)})"/>`;
            }
            case 'square': {
                const sz = R(10 * s);
                return `<rect x="${R(x - sz / 2)}" y="${R(y - sz / 2)}" width="${sz}" height="${sz}" fill="currentColor" transform="rotate(${R(snapAngle(angle, cfg.angleSnap))} ${R(x)} ${R(y)})"/>`;
            }
            case 'leaf': {
                const lw = R(8 * s);
                const lh = R(16 * s);
                return `<path d="M ${R(x)} ${R(y - lh / 2)} Q ${R(x + lw)} ${R(y)} ${R(x)} ${R(y + lh / 2)} Q ${R(x - lw * 0.5)} ${R(y)} ${R(x)} ${R(y - lh / 2)} Z" fill="currentColor" transform="rotate(${R(angle)} ${R(x)} ${R(y)})"/>`;
            }
            case 'arc': {
                const ar = R(12 * s);
                return `<path d="${arcPath(x, y, ar, -45, 45)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" transform="rotate(${R(angle)} ${R(x)} ${R(y)})"/>`;
            }
            case 'diamond': {
                const dh = R(12 * s);
                const dw = R(7 * s);
                return `<path d="M ${R(x)} ${R(y - dh / 2)} L ${R(x + dw / 2)} ${R(y)} L ${R(x)} ${R(y + dh / 2)} L ${R(x - dw / 2)} ${R(y)} Z" fill="currentColor"/>`;
            }
        }
        return '';
    };

    let paths = '';

    switch (layout) {
        case 'spiral': {
            const turns = rr(rng, 1.5, 3);
            const innerSpiralR = 15;
            for (let i = 0; i < count; i++) {
                const t = i / Math.max(1, count - 1);
                const angle = t * turns * 360;
                const r = innerSpiralR + (maxR - innerSpiralR) * t;
                const p = polar(CX, CY, r, angle);
                const scale = 0.4 + t * 0.8;
                paths += drawEl(p.x, p.y, scale, angle);
            }
            break;
        }
        case 'wave': {
            const amp = rr(rng, 40, 80);
            const periods = rr(rng, 1, 2.5);
            const startX = CX - maxR;
            const totalW = maxR * 2;
            for (let i = 0; i < count; i++) {
                const t = i / Math.max(1, count - 1);
                const x = startX + totalW * t;
                const y = CY + Math.sin(t * periods * Math.PI * 2) * amp;
                const tangentAngle = Math.atan2(
                    Math.cos(t * periods * Math.PI * 2) * amp * periods * Math.PI * 2 / totalW, 1
                ) * (180 / Math.PI);
                const scale = 0.5 + 0.6 * (0.5 + 0.5 * Math.sin(t * Math.PI));
                paths += drawEl(x, y, scale, tangentAngle);
            }
            break;
        }
        case 'grid': {
            const cols = pick(rng, [4, 5, 6]);
            const rows = pick(rng, [4, 5, 6]);
            const gridW = maxR * 1.6;
            const gridH = maxR * 1.6;
            const cw = gridW / cols;
            const ch = gridH / rows;
            const ox = CX - gridW / 2;
            const oy = CY - gridH / 2;
            let placed = 0;
            for (let r = 0; r < rows && placed < count; r++) {
                for (let c = 0; c < cols && placed < count; c++) {
                    if (rng() > 0.3) {
                        const x = ox + c * cw + cw / 2;
                        const y = oy + r * ch + ch / 2;
                        const scale = rr(rng, 0.5, 1.0);
                        const angle = snapAngle(rng() * 360, cfg.angleSnap);
                        paths += drawEl(x, y, scale, angle);
                        placed++;
                    }
                }
            }
            break;
        }
        case 'cluster': {
            const clusterR = maxR * 0.85;
            for (let i = 0; i < count; i++) {
                const angle = rng() * 360;
                const dist = clusterR * Math.sqrt(rng()) * 0.85;
                const p = polar(CX, CY, dist, angle);
                const scale = 0.35 + rng() * 0.8;
                paths += drawEl(p.x, p.y, scale, angle + rng() * 45);
            }
            break;
        }
        case 'orbit': {
            const orbits = pick(rng, [2, 3]);
            for (let o = 0; o < orbits; o++) {
                const orbitR = 40 + (maxR - 50) * ((o + 1) / orbits);
                const items = Math.floor(count / orbits);
                const offset = rr(rng, 0, 360);
                // Draw orbit ring
                paths += `<circle cx="${CX}" cy="${CY}" r="${R(orbitR)}" fill="none" stroke="currentColor" stroke-width="${Math.max(2, sw / 2)}" opacity="0.2"/>`;
                for (let i = 0; i < items; i++) {
                    const angle = offset + (i / items) * 360;
                    const p = polar(CX, CY, orbitR, angle);
                    const scale = 0.5 + 0.4 * ((o + 1) / orbits);
                    paths += drawEl(p.x, p.y, scale, angle);
                }
            }
            // Center dot
            paths += `<circle cx="${CX}" cy="${CY}" r="${R(rr(rng, 10, 18))}" fill="currentColor"/>`;
            break;
        }
    }

    return svgWrap(paths);
}

// ============================================================
// VARIATION 4: INTERCONNECTED GEOMETRY
//
// 2-3 simple shapes overlapping, interlocking, or flowing into each other.
// ============================================================

function generateInterconnected(
    brandName: string,
    industry: Industry,
    aesthetic: Aesthetic,
    rng: () => number,
): string {
    const cfg = getAestheticConfig(aesthetic, rng);
    const sw = cfg.strokeWeight;
    const style = pick(rng, aesthetic === 'tech'
        ? ['overlap-squares', 'bracket-pair', 'linked-angles'] as const
        : aesthetic === 'nature'
            ? ['overlap-circles', 'flowing-curves', 'petal-merge'] as const
            : aesthetic === 'bold'
                ? ['overlap-circles', 'overlap-squares', 'interlocking-rings'] as const
                : ['overlap-circles', 'overlap-squares', 'flowing-curves', 'linked-angles'] as const);

    let paths = '';
    const maxR = SIZE * 0.36;

    switch (style) {
        case 'overlap-circles': {
            const circleCount = pick(rng, [2, 3]);
            const cr = maxR * rr(rng, 0.4, 0.6);
            const spread = cr * rr(rng, 0.5, 0.9);
            for (let i = 0; i < circleCount; i++) {
                const angle = (i / circleCount) * 360 + rr(rng, 0, 30);
                const p = polar(CX, CY, spread, angle);
                if (cfg.preferFill) {
                    paths += `<circle cx="${R(p.x)}" cy="${R(p.y)}" r="${R(cr)}" fill="currentColor" opacity="${R(1 / circleCount + 0.3)}"/>`;
                } else {
                    paths += `<circle cx="${R(p.x)}" cy="${R(p.y)}" r="${R(cr)}" fill="none" stroke="currentColor" stroke-width="${sw}"/>`;
                }
            }
            break;
        }
        case 'overlap-squares': {
            const squareCount = pick(rng, [2, 3]);
            const sz = maxR * rr(rng, 0.6, 0.9);
            const spread = sz * rr(rng, 0.15, 0.35);
            const rx = cfg.cornerRadius * sz * 0.15;
            for (let i = 0; i < squareCount; i++) {
                const angle = snapAngle((i / squareCount) * 360, cfg.angleSnap) + rr(rng, 0, 20);
                const p = polar(CX, CY, spread, angle);
                const rot = snapAngle(rr(rng, 0, 45), cfg.angleSnap);
                if (cfg.preferFill) {
                    paths += `<rect x="${R(p.x - sz / 2)}" y="${R(p.y - sz / 2)}" width="${R(sz)}" height="${R(sz)}" rx="${R(rx)}" fill="currentColor" opacity="${R(1 / squareCount + 0.3)}" transform="rotate(${R(rot)} ${R(p.x)} ${R(p.y)})"/>`;
                } else {
                    paths += `<rect x="${R(p.x - sz / 2)}" y="${R(p.y - sz / 2)}" width="${R(sz)}" height="${R(sz)}" rx="${R(rx)}" fill="none" stroke="currentColor" stroke-width="${sw}" transform="rotate(${R(rot)} ${R(p.x)} ${R(p.y)})"/>`;
                }
            }
            break;
        }
        case 'flowing-curves': {
            // Two S-curves crossing to form an abstract knot
            const amp = maxR * rr(rng, 0.4, 0.7);
            const w = maxR * rr(rng, 0.7, 1.0);
            // Curve 1: horizontal S
            paths += `<path d="M ${R(CX - w)} ${R(CY)} C ${R(CX - w * 0.3)} ${R(CY - amp)}, ${R(CX + w * 0.3)} ${R(CY + amp)}, ${R(CX + w)} ${R(CY)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            // Curve 2: rotated version
            const rot = rr(rng, 60, 120);
            paths += `<path d="M ${R(CX - w)} ${R(CY)} C ${R(CX - w * 0.3)} ${R(CY - amp)}, ${R(CX + w * 0.3)} ${R(CY + amp)}, ${R(CX + w)} ${R(CY)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" transform="rotate(${R(rot)} ${CX} ${CY})"/>`;
            break;
        }
        case 'bracket-pair': {
            // Two angular brackets facing each other, offset
            const bh = maxR * rr(rng, 0.5, 0.8);
            const bw = bh * rr(rng, 0.3, 0.5);
            const gap = rr(rng, 10, 30);
            // Left bracket
            paths += `<polyline points="${R(CX - gap / 2 + bw)},${R(CY - bh)} ${R(CX - gap / 2 - bw)},${R(CY)} ${R(CX - gap / 2 + bw)},${R(CY + bh)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
            // Right bracket
            paths += `<polyline points="${R(CX + gap / 2 - bw)},${R(CY - bh)} ${R(CX + gap / 2 + bw)},${R(CY)} ${R(CX + gap / 2 - bw)},${R(CY + bh)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
            break;
        }
        case 'linked-angles': {
            // Two or three angular shapes that interlock like chain links
            const count = pick(rng, [2, 3]);
            const linkW = maxR * rr(rng, 0.35, 0.5);
            const linkH = linkW * rr(rng, 0.6, 1.0);
            const overlap = linkW * rr(rng, 0.3, 0.6);
            for (let i = 0; i < count; i++) {
                const ox = CX - (count - 1) * (linkW - overlap) / 2 + i * (linkW - overlap);
                const rot = snapAngle(i % 2 === 0 ? 0 : rr(rng, 30, 60), cfg.angleSnap);
                paths += `<rect x="${R(ox - linkW / 2)}" y="${R(CY - linkH / 2)}" width="${R(linkW)}" height="${R(linkH)}" rx="${R(cfg.cornerRadius * linkW * 0.2)}" fill="none" stroke="currentColor" stroke-width="${sw}" transform="rotate(${R(rot)} ${R(ox)} ${CY})"/>`;
            }
            break;
        }
        case 'interlocking-rings': {
            // Two thick rings woven together
            const r1 = maxR * rr(rng, 0.35, 0.45);
            const offset = r1 * rr(rng, 0.5, 0.8);
            const thickness = sw;
            paths += `<circle cx="${R(CX - offset / 2)}" cy="${CY}" r="${R(r1)}" fill="none" stroke="currentColor" stroke-width="${thickness}"/>`;
            paths += `<circle cx="${R(CX + offset / 2)}" cy="${CY}" r="${R(r1)}" fill="none" stroke="currentColor" stroke-width="${thickness}"/>`;
            break;
        }
        case 'petal-merge': {
            // 2-3 petal shapes merging at center
            const petalCount = pick(rng, [2, 3]);
            const petalR = maxR * rr(rng, 0.5, 0.75);
            const petalW = petalR * rr(rng, 0.3, 0.5);
            for (let i = 0; i < petalCount; i++) {
                const angle = (i / petalCount) * 360;
                paths += `<g transform="rotate(${R(angle)} ${CX} ${CY})">`;
                paths += `<path d="M ${R(CX)} ${R(CY)} Q ${R(CX + petalW)} ${R(CY - petalR * 0.5)} ${R(CX)} ${R(CY - petalR)} Q ${R(CX - petalW)} ${R(CY - petalR * 0.5)} ${R(CX)} ${R(CY)} Z" fill="currentColor" opacity="${R(0.7 + 0.3 / petalCount)}"/>`;
                paths += '</g>';
            }
            break;
        }
    }

    return svgWrap(paths);
}

// ============================================================
// VARIATION 5: CONSTRUCTED LETTERFORM
//
// Brand initial reduced to pure geometric primitives with unexpected
// cuts, rotations, and negative space. Should be barely recognizable.
// ============================================================

function generateConstructedLetter(
    brandName: string,
    industry: Industry,
    aesthetic: Aesthetic,
    rng: () => number,
): string {
    const cfg = getAestheticConfig(aesthetic, rng);
    const sw = cfg.strokeWeight;
    const letter = brandName.charAt(0).toUpperCase();
    const maxR = SIZE * (0.33 - cfg.whitespace * 0.05);

    // Treatment determines how we abstract the letter
    const treatment = pick(rng, [
        'geometric-deconstruct',
        'negative-cut',
        'arc-reduction',
        'fragmented',
        'rotated-partial',
    ] as const);

    let paths = '';

    // Universal letter → abstract shape mapping
    // We map letter structure to geometric primitives, NOT literal letter forms
    const letterAngle = ((letter.charCodeAt(0) - 65) / 26) * 360;
    const hasVertical = 'BDEFHIJKLMNPRTUY'.includes(letter);
    const hasDiagonal = 'AKMVWXYZ'.includes(letter);
    const hasCurve = 'BCDGJOPQRSU'.includes(letter);
    const isSymmetric = 'AHIMOTUVWXY'.includes(letter);

    switch (treatment) {
        case 'geometric-deconstruct': {
            // Break letter into 2-3 primitive shapes positioned geometrically
            if (hasCurve) {
                // Use arcs
                const arcR = maxR * rr(rng, 0.6, 0.9);
                const arcSpan = rr(rng, 120, 270);
                const startA = letterAngle;
                paths += `<path d="${arcPath(CX, CY, arcR, startA, startA + arcSpan)}" fill="none" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
            }
            if (hasVertical) {
                const lineH = maxR * rr(rng, 0.8, 1.3);
                const lineX = CX + (isSymmetric ? 0 : rr(rng, -maxR * 0.3, maxR * 0.3));
                paths += `<line x1="${R(lineX)}" y1="${R(CY - lineH / 2)}" x2="${R(lineX)}" y2="${R(CY + lineH / 2)}" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
            }
            if (hasDiagonal) {
                const dLen = maxR * rr(rng, 0.6, 1.0);
                const dAngle = snapAngle(letterAngle + rr(rng, 20, 70), cfg.angleSnap);
                const s = polar(CX, CY, dLen / 2, dAngle);
                const e = polar(CX, CY, dLen / 2, dAngle + 180);
                paths += `<line x1="${s.x}" y1="${s.y}" x2="${e.x}" y2="${e.y}" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
            }
            if (!hasCurve && !hasVertical && !hasDiagonal) {
                // Fallback: abstract cross form
                paths += `<line x1="${R(CX - maxR * 0.6)}" y1="${CY}" x2="${R(CX + maxR * 0.6)}" y2="${CY}" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
                paths += `<line x1="${CX}" y1="${R(CY - maxR * 0.6)}" x2="${CX}" y2="${R(CY + maxR * 0.6)}" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
            }
            break;
        }
        case 'negative-cut': {
            // Solid container with letter-inspired cutouts
            const maskId = `cl-${ri(rng, 1000, 9999)}`;
            let mask = `<rect width="${SIZE}" height="${SIZE}" fill="white"/>`;

            // Cut shapes based on letter anatomy
            if (hasCurve) {
                const cr = maxR * rr(rng, 0.3, 0.5);
                const cx = CX + rr(rng, -maxR * 0.2, maxR * 0.2);
                const cy = CY + rr(rng, -maxR * 0.2, maxR * 0.2);
                mask += `<circle cx="${R(cx)}" cy="${R(cy)}" r="${R(cr)}" fill="black"/>`;
            }
            if (hasVertical) {
                const slitW = sw * 2;
                const slitH = maxR * rr(rng, 0.6, 1.2);
                const sx = CX + rr(rng, -maxR * 0.15, maxR * 0.15);
                mask += `<rect x="${R(sx - slitW / 2)}" y="${R(CY - slitH / 2)}" width="${R(slitW)}" height="${R(slitH)}" fill="black"/>`;
            }
            if (hasDiagonal) {
                const dLen = maxR * rr(rng, 0.5, 0.9);
                const dAngle = letterAngle + rr(rng, -30, 30);
                const s = polar(CX, CY, dLen / 2, dAngle);
                const e = polar(CX, CY, dLen / 2, dAngle + 180);
                mask += `<line x1="${s.x}" y1="${s.y}" x2="${e.x}" y2="${e.y}" stroke="black" stroke-width="${sw * 2.5}"/>`;
            }

            paths += `<defs><mask id="${maskId}">${mask}</mask></defs>`;
            // Container shape
            const containerType = pick(rng, ['circle', 'rounded-rect'] as const);
            if (containerType === 'circle') {
                paths += `<circle cx="${CX}" cy="${CY}" r="${R(maxR)}" fill="currentColor" mask="url(#${maskId})"/>`;
            } else {
                const rx = maxR * cfg.cornerRadius * 0.2;
                paths += `<rect x="${R(CX - maxR)}" y="${R(CY - maxR)}" width="${R(maxR * 2)}" height="${R(maxR * 2)}" rx="${R(rx)}" fill="currentColor" mask="url(#${maskId})"/>`;
            }
            break;
        }
        case 'arc-reduction': {
            // Reduce letter to 2-4 arc segments and line segments
            const segCount = ri(rng, 2, 4);
            const baseR = maxR * rr(rng, 0.5, 0.85);
            const startAngle = letterAngle;

            for (let i = 0; i < segCount; i++) {
                const span = rr(rng, 40, 120);
                const offset = (i / segCount) * 360 + startAngle;
                const segR = baseR * rr(rng, 0.7, 1.0);
                paths += `<path d="${arcPath(CX, CY, segR, offset, offset + span)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            }
            // Optional crossbar
            if (hasVertical && rng() > 0.4) {
                const y = CY + rr(rng, -baseR * 0.3, baseR * 0.3);
                const hw = baseR * rr(rng, 0.3, 0.6);
                paths += `<line x1="${R(CX - hw)}" y1="${R(y)}" x2="${R(CX + hw)}" y2="${R(y)}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
            }
            break;
        }
        case 'fragmented': {
            // Letter as fragmented geometric pieces with gaps
            const pieces = ri(rng, 3, 5);
            const baseAngle = letterAngle;

            for (let i = 0; i < pieces; i++) {
                const t = i / pieces;
                const angle = baseAngle + t * 360;
                const pR = maxR * rr(rng, 0.3, 0.8);
                const p = polar(CX, CY, pR * 0.3, angle);
                const pieceType = pick(rng, ['line', 'arc', 'dot'] as const);

                switch (pieceType) {
                    case 'line': {
                        const len = maxR * rr(rng, 0.2, 0.5);
                        const la = snapAngle(angle + rr(rng, -40, 40), cfg.angleSnap);
                        const s = polar(p.x, p.y, len / 2, la);
                        const e = polar(p.x, p.y, len / 2, la + 180);
                        paths += `<line x1="${s.x}" y1="${s.y}" x2="${e.x}" y2="${e.y}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
                        break;
                    }
                    case 'arc': {
                        const ar = maxR * rr(rng, 0.15, 0.35);
                        const span = rr(rng, 60, 150);
                        paths += `<path d="${arcPath(p.x, p.y, ar, angle, angle + span)}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round"/>`;
                        break;
                    }
                    case 'dot': {
                        const dr = rr(rng, 6, 14);
                        paths += `<circle cx="${R(p.x)}" cy="${R(p.y)}" r="${R(dr)}" fill="currentColor"/>`;
                        break;
                    }
                }
            }
            break;
        }
        case 'rotated-partial': {
            // Take a portion of the letter geometry, rotate it unexpectedly
            const baseR = maxR * rr(rng, 0.5, 0.8);
            const rotation = snapAngle(rr(rng, 15, 75), cfg.angleSnap || 15);

            // Build a simple letter scaffold then rotate
            let scaffold = '';
            if (hasCurve) {
                scaffold += `<path d="${arcPath(CX, CY, baseR, letterAngle, letterAngle + 210)}" fill="none" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
            }
            if (hasVertical || hasDiagonal) {
                const len = baseR * 1.2;
                scaffold += `<line x1="${CX}" y1="${R(CY - len / 2)}" x2="${CX}" y2="${R(CY + len / 2)}" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
            }
            if (!hasCurve && !hasVertical && !hasDiagonal) {
                scaffold += `<line x1="${R(CX - baseR)}" y1="${CY}" x2="${R(CX + baseR)}" y2="${CY}" stroke="currentColor" stroke-width="${sw * 1.5}" stroke-linecap="round"/>`;
            }

            paths += `<g transform="rotate(${R(rotation)} ${CX} ${CY})">${scaffold}</g>`;

            // Add a contrasting element at original orientation
            if (rng() > 0.4) {
                const dotR = rr(rng, 8, 16);
                const dotP = polar(CX, CY, baseR * rr(rng, 0.3, 0.6), letterAngle + 90);
                paths += `<circle cx="${R(dotP.x)}" cy="${R(dotP.y)}" r="${R(dotR)}" fill="currentColor"/>`;
            }
            break;
        }
    }

    return svgWrap(paths);
}

// ============================================================
// MAIN ENGINE
// ============================================================

const AESTHETICS: Aesthetic[] = ['minimalist', 'tech', 'nature', 'bold'];

const ORDERED_METHODS: GeometricMethod[] = [
    'radial-construct',
    'negative-space',
    'dynamic-pattern',
    'interconnected-geometry',
    'constructed-letterform',
];

const METHOD_GENERATORS: Record<
    GeometricMethod,
    (brandName: string, industry: Industry, aesthetic: Aesthetic, rng: () => number) => string
> = {
    'radial-construct': generateRadialConstruct,
    'negative-space': generateNegativeSpace,
    'dynamic-pattern': generateDynamicPattern,
    'interconnected-geometry': generateInterconnected,
    'constructed-letterform': generateConstructedLetter,
};

/**
 * Generate 5 premium geometric logo variations for a brand.
 *
 * Each variation uses a fundamentally different construction method.
 * The aesthetic parameter changes the actual shapes, not just styling.
 */
export function generateGeometricLogos(
    brandName: string,
    options?: {
        aesthetic?: Aesthetic;
        industry?: string;
        seed?: string;
    },
): GeometricLogoResult[] {
    const baseSeed = options?.seed || brandName;
    const masterRng = createRng(baseSeed);
    const aesthetic = options?.aesthetic || pick(masterRng, AESTHETICS);
    const industry = resolveIndustry(options?.industry || 'general');

    const results: GeometricLogoResult[] = [];

    for (let i = 0; i < 5; i++) {
        const method = ORDERED_METHODS[i];
        // Each variation gets a unique seed derived from the base
        const variantSeed = `${baseSeed}__v${i}_${method}_${aesthetic}`;
        const rng = createRng(variantSeed);

        // Vary aesthetic per-logo slightly — first 3 use primary, last 2 get variety
        let varAesthetic = aesthetic;
        if (i >= 3) {
            const altAesthetics = AESTHETICS.filter(a => a !== aesthetic);
            varAesthetic = pick(rng, altAesthetics);
        }

        const svg = METHOD_GENERATORS[method](brandName, industry, varAesthetic, rng);

        results.push({
            svg,
            method,
            aesthetic: varAesthetic,
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
    options?: {
        aesthetic?: Aesthetic;
        industry?: string;
        seed?: string;
    },
): GeometricLogoResult {
    const baseSeed = options?.seed || `${brandName}__${method}`;
    const rng = createRng(baseSeed);
    const aesthetic = options?.aesthetic || pick(rng, AESTHETICS);
    const industry = resolveIndustry(options?.industry || 'general');

    const svg = METHOD_GENERATORS[method](brandName, industry, aesthetic, rng);

    return {
        svg,
        method,
        aesthetic,
        seed: baseSeed,
    };
}
