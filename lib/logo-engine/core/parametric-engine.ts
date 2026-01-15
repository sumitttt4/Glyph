/**
 * Parametric Engine Core
 *
 * Handles deterministic randomness, hash generation, and localStorage management
 * Brand name as seed ensures same name = same logo, different name = different output
 */

import {
    BaseParameters,
    LogoAlgorithm,
    LogoHashRecord,
    Point,
} from '../types';

// ============================================
// CONSTANTS
// ============================================

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const SQRT2 = 1.4142135623730951;
export const SQRT3 = 1.7320508075688772;

const STORAGE_KEY = 'parametric-logo-engine-hashes';
const MAX_STORED_HASHES = 1000;

// ============================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================

/**
 * Create a high-quality seeded PRNG using xoshiro128**
 * Ensures deterministic output: same seed = same sequence
 */
export function createSeededRandom(seed: string): () => number {
    // Convert string to 4 32-bit seeds using multiple hash rounds
    const seeds = hashStringTo4Seeds(seed);
    let [s0, s1, s2, s3] = seeds;

    return () => {
        // xoshiro128** algorithm
        const result = rotl(s1 * 5, 7) * 9;
        const t = s1 << 9;

        s2 ^= s0;
        s3 ^= s1;
        s1 ^= s2;
        s0 ^= s3;
        s2 ^= t;
        s3 = rotl(s3, 11);

        return (result >>> 0) / 4294967296;
    };
}

function rotl(x: number, k: number): number {
    return (x << k) | (x >>> (32 - k));
}

function hashStringTo4Seeds(str: string): [number, number, number, number] {
    let h1 = 0x811c9dc5;
    let h2 = 0x01000193;
    let h3 = 0xdeadbeef;
    let h4 = 0xcafebabe;

    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ c, 0x01000193);
        h2 = Math.imul(h2 ^ c, 0x5bd1e995);
        h3 = Math.imul(h3 ^ c, 0x1b873593);
        h4 = Math.imul(h4 ^ c, 0xcc9e2d51);
    }

    // Additional mixing for better distribution
    h1 ^= h1 >>> 16;
    h1 = Math.imul(h1, 0x85ebca6b);
    h2 ^= h2 >>> 13;
    h2 = Math.imul(h2, 0xc2b2ae35);
    h3 ^= h3 >>> 16;
    h4 ^= h4 >>> 13;

    return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}

// ============================================
// NOISE & VARIATION FUNCTIONS
// ============================================

/**
 * Perlin-style noise for smooth variation
 */
export function noise2D(x: number, y: number, seed: string): number {
    const rng = createSeededRandom(`${seed}-${Math.floor(x)}-${Math.floor(y)}`);

    // Interpolate between grid points
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;

    // Smoothstep interpolation
    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    // Corner gradients
    const n00 = dotGridGradient(x0, y0, x, y, seed);
    const n10 = dotGridGradient(x0 + 1, y0, x, y, seed);
    const n01 = dotGridGradient(x0, y0 + 1, x, y, seed);
    const n11 = dotGridGradient(x0 + 1, y0 + 1, x, y, seed);

    // Bilinear interpolation
    const nx0 = lerp(n00, n10, sx);
    const nx1 = lerp(n01, n11, sx);

    return lerp(nx0, nx1, sy);
}

function dotGridGradient(ix: number, iy: number, x: number, y: number, seed: string): number {
    const rng = createSeededRandom(`${seed}-grad-${ix}-${iy}`);
    const angle = rng() * Math.PI * 2;
    const gx = Math.cos(angle);
    const gy = Math.sin(angle);

    const dx = x - ix;
    const dy = y - iy;

    return dx * gx + dy * gy;
}

/**
 * Fractal Brownian Motion for organic variation
 */
export function fbm(x: number, y: number, seed: string, octaves: number = 4): number {
    let value = 0;
    let amplitude = 0.5;
    let frequency = 1;
    let maxValue = 0;

    for (let i = 0; i < octaves; i++) {
        value += amplitude * noise2D(x * frequency, y * frequency, `${seed}-oct${i}`);
        maxValue += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
    }

    return value / maxValue;
}

/**
 * Add jitter/variation to a value based on noise
 */
export function addNoise(
    value: number,
    noiseAmount: number,
    rng: () => number,
    range: number = 1
): number {
    if (noiseAmount <= 0) return value;
    const noise = (rng() - 0.5) * 2 * range * noiseAmount;
    return value + noise;
}

/**
 * Add positional jitter to a point
 */
export function jitterPoint(point: Point, amount: number, rng: () => number): Point {
    return {
        x: point.x + (rng() - 0.5) * 2 * amount,
        y: point.y + (rng() - 0.5) * 2 * amount,
    };
}

// ============================================
// HASH GENERATION
// ============================================

/**
 * Generate a unique deterministic hash for a logo configuration
 */
export function generateLogoHash(
    brandName: string,
    algorithm: LogoAlgorithm,
    variant: number,
    params: Partial<BaseParameters>
): string {
    const hashInput = JSON.stringify({
        brandName: brandName.toLowerCase().trim(),
        algorithm,
        variant,
        params,
        version: 'v4', // Version for cache invalidation
    });

    return cyrb53Hash(hashInput);
}

/**
 * Fast, high-quality 53-bit hash function
 */
function cyrb53Hash(str: string, seed: number = 0): string {
    let h1 = 0xdeadbeef ^ seed;
    let h2 = 0x41c6ce57 ^ seed;

    for (let i = 0; i < str.length; i++) {
        const ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    const hash = 4294967296 * (2097151 & h2) + (h1 >>> 0);
    return hash.toString(36);
}

// ============================================
// LOCALSTORAGE MANAGEMENT
// ============================================

/**
 * Check if a hash already exists in storage
 */
export function isHashDuplicate(hash: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return false;

        const data = JSON.parse(stored) as { hashes: string[] };
        return data.hashes.includes(hash);
    } catch {
        return false;
    }
}

/**
 * Store a generated hash in localStorage
 */
export function storeHash(record: LogoHashRecord): void {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored
            ? (JSON.parse(stored) as { hashes: string[]; records: LogoHashRecord[] })
            : { hashes: [], records: [] };

        // Add new hash
        if (!data.hashes.includes(record.hash)) {
            data.hashes.push(record.hash);
            data.records.push(record);

            // Trim old entries if exceeding limit
            if (data.hashes.length > MAX_STORED_HASHES) {
                const trimCount = data.hashes.length - MAX_STORED_HASHES;
                data.hashes = data.hashes.slice(trimCount);
                data.records = data.records.slice(trimCount);
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    } catch (e) {
        console.warn('Failed to store logo hash:', e);
    }
}

/**
 * Get all stored hashes for a brand name
 */
export function getStoredHashesForBrand(brandName: string): LogoHashRecord[] {
    if (typeof window === 'undefined') return [];

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const data = JSON.parse(stored) as { hashes: string[]; records: LogoHashRecord[] };
        return data.records.filter(
            r => r.brandName.toLowerCase() === brandName.toLowerCase()
        );
    } catch {
        return [];
    }
}

/**
 * Clear all stored hashes
 */
export function clearStoredHashes(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

// ============================================
// PARAMETER DEFAULTS & GENERATION
// ============================================

/**
 * Generate default base parameters with deterministic variation
 */
export function generateBaseParams(rng: () => number): BaseParameters {
    return {
        // Core
        strokeWidth: 2 + rng() * 4,
        strokeWidthVariance: rng() * 0.3,

        // Angles & Rotation
        baseAngle: rng() * 360,
        angleVariance: rng() * 30,
        rotationOffset: rng() * 360,

        // Curves & Tension
        curveTension: 0.3 + rng() * 0.5,
        curveAmplitude: 5 + rng() * 25,
        curveFrequency: 1 + rng() * 4,

        // Segments & Counts
        segmentCount: 3 + Math.floor(rng() * 8),
        segmentSpacing: 5 + rng() * 20,
        segmentLengthRatio: 0.5 + rng() * 0.5,

        // Spacing & Layout
        horizontalSpacing: 5 + rng() * 20,
        verticalSpacing: 5 + rng() * 20,
        paddingRatio: 0.1 + rng() * 0.15,

        // Scale & Size
        scaleX: 0.8 + rng() * 0.4,
        scaleY: 0.8 + rng() * 0.4,
        sizeVariance: rng() * 0.3,

        // Corner & Radius
        cornerRadius: rng() * 20,
        cornerRadiusVariance: rng() * 0.5,

        // Opacity & Layers
        baseOpacity: 0.7 + rng() * 0.3,
        opacityFalloff: rng() * 0.5,
        layerCount: 1 + Math.floor(rng() * 5),

        // Noise & Variation
        noiseAmount: rng() * 0.3,
        noiseFrequency: 0.5 + rng() * 2,
        jitterAmount: rng() * 5,
    };
}

/**
 * Merge custom params with generated defaults
 */
export function mergeParams<T extends BaseParameters>(
    defaults: T,
    custom?: Partial<T>
): T {
    if (!custom) return defaults;
    return { ...defaults, ...custom };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

export function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

export function easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

/**
 * Generate a unique ID for a logo
 */
export function generateLogoId(algorithm: LogoAlgorithm, variant: number): string {
    return `${algorithm}-${variant}-${Date.now().toString(36)}`;
}

/**
 * Calculate complexity score based on path commands
 */
export function calculateComplexity(pathData: string): number {
    const commands = pathData.match(/[MLCQSAZ]/gi) || [];
    const bezierCount = (pathData.match(/[CQS]/gi) || []).length;
    const totalCommands = commands.length;

    // Normalize to 0-1 range
    const baseScore = Math.min(totalCommands / 50, 1);
    const curveBonus = Math.min(bezierCount / 20, 0.3);

    return Math.min(baseScore + curveBonus, 1);
}
