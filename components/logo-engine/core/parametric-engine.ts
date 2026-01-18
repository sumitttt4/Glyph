/**
 * Parametric Engine Core
 *
 * SHA-256 based uniqueness system with 30+ hash-derived parameters
 * Quality scoring for premium logo selection
 */

import {
    BaseParameters,
    LogoAlgorithm,
    LogoHashRecord,
    LogoCategory,
    HashParams,
    HashDerivedParams,
    QualityMetrics,
    SymmetryType,
    Point,
} from '../types';

// ============================================
// CONSTANTS
// ============================================

export const PHI = 1.618033988749895;
export const PHI_INVERSE = 0.618033988749895;
export const SQRT2 = 1.4142135623730951;
export const SQRT3 = 1.7320508075688772;

const STORAGE_KEY = 'premium-logo-engine-hashes';
const MAX_STORED_HASHES = 1000;
const MIN_QUALITY_SCORE = 85;
const CANDIDATES_PER_GENERATION = 5;

// ============================================
// SHA-256 HASH GENERATION
// ============================================

/**
 * Generate a cryptographic random salt
 */
export function generateSalt(): string {
    const array = new Uint8Array(16);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        crypto.getRandomValues(array);
    } else {
        // Fallback for SSR
        for (let i = 0; i < 16; i++) {
            array[i] = Math.floor(Math.random() * 256);
        }
    }
    return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate SHA-256 hash from input string
 * Uses Web Crypto API when available, falls back to pure JS implementation
 */
export async function sha256(message: string): Promise<string> {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    // Pure JS fallback for SSR
    return sha256Fallback(message);
}

/**
 * Synchronous SHA-256 fallback for SSR environments
 */
function sha256Fallback(message: string): string {
    const K = [
        0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
        0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
        0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
        0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
        0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
        0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
        0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
        0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    const rotr = (n: number, x: number) => (x >>> n) | (x << (32 - n));
    const ch = (x: number, y: number, z: number) => (x & y) ^ (~x & z);
    const maj = (x: number, y: number, z: number) => (x & y) ^ (x & z) ^ (y & z);
    const sigma0 = (x: number) => rotr(2, x) ^ rotr(13, x) ^ rotr(22, x);
    const sigma1 = (x: number) => rotr(6, x) ^ rotr(11, x) ^ rotr(25, x);
    const gamma0 = (x: number) => rotr(7, x) ^ rotr(18, x) ^ (x >>> 3);
    const gamma1 = (x: number) => rotr(17, x) ^ rotr(19, x) ^ (x >>> 10);

    // Pre-processing
    const bytes: number[] = [];
    for (let i = 0; i < message.length; i++) {
        bytes.push(message.charCodeAt(i));
    }
    bytes.push(0x80);
    while ((bytes.length + 8) % 64 !== 0) {
        bytes.push(0);
    }
    const bitLen = message.length * 8;
    for (let i = 7; i >= 0; i--) {
        bytes.push((bitLen / Math.pow(256, i)) & 0xff);
    }

    // Initialize hash values
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

    // Process each 512-bit chunk
    for (let i = 0; i < bytes.length; i += 64) {
        const w: number[] = new Array(64);
        for (let j = 0; j < 16; j++) {
            w[j] = (bytes[i + j * 4] << 24) | (bytes[i + j * 4 + 1] << 16) |
                   (bytes[i + j * 4 + 2] << 8) | bytes[i + j * 4 + 3];
        }
        for (let j = 16; j < 64; j++) {
            w[j] = (gamma1(w[j - 2]) + w[j - 7] + gamma0(w[j - 15]) + w[j - 16]) >>> 0;
        }

        let a = h0, b = h1, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7;

        for (let j = 0; j < 64; j++) {
            const t1 = (h + sigma1(e) + ch(e, f, g) + K[j] + w[j]) >>> 0;
            const t2 = (sigma0(a) + maj(a, b, c)) >>> 0;
            h = g; g = f; f = e; e = (d + t1) >>> 0;
            d = c; c = b; b = a; a = (t1 + t2) >>> 0;
        }

        h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0;
        h4 = (h4 + e) >>> 0; h5 = (h5 + f) >>> 0; h6 = (h6 + g) >>> 0; h7 = (h7 + h) >>> 0;
    }

    const toHex = (n: number) => n.toString(16).padStart(8, '0');
    return toHex(h0) + toHex(h1) + toHex(h2) + toHex(h3) + toHex(h4) + toHex(h5) + toHex(h6) + toHex(h7);
}

/**
 * Generate unique hash parameters for logo generation
 */
export async function generateHashParams(
    brandName: string,
    category: LogoCategory,
    existingSalt?: string
): Promise<HashParams> {
    const timestamp = Date.now();
    const salt = existingSalt || generateSalt();
    const input = `${brandName.toLowerCase().trim()}|${category}|${timestamp}|${salt}`;
    const hashHex = await sha256(input);

    return {
        brandName: brandName.toLowerCase().trim(),
        category,
        timestamp,
        salt,
        hashHex,
    };
}

/**
 * Synchronous version for SSR compatibility
 */
export function generateHashParamsSync(
    brandName: string,
    category: LogoCategory,
    existingSalt?: string
): HashParams {
    const timestamp = Date.now();
    const salt = existingSalt || generateSalt();
    const input = `${brandName.toLowerCase().trim()}|${category}|${timestamp}|${salt}`;
    const hashHex = sha256Fallback(input);

    return {
        brandName: brandName.toLowerCase().trim(),
        category,
        timestamp,
        salt,
        hashHex,
    };
}

// ============================================
// HASH TO PARAMETERS MAPPING
// ============================================

const SYMMETRY_TYPES: SymmetryType[] = [
    'none', 'horizontal', 'vertical', 'radial',
    'bilateral', 'rotational-4', 'rotational-6', 'rotational-8'
];

/**
 * Extract a value from hash bits and map to a range
 */
function extractFromHash(hashHex: string, startBit: number, numBits: number, min: number, max: number): number {
    // Each hex char = 4 bits, so divide by 4 for char position
    const startChar = Math.floor(startBit / 4);
    const charsNeeded = Math.ceil(numBits / 4) + 1;
    const hexSlice = hashHex.slice(startChar, startChar + charsNeeded);
    const value = parseInt(hexSlice, 16) || 0;
    const maxValue = Math.pow(2, numBits) - 1;
    const normalized = (value % (maxValue + 1)) / maxValue;
    return min + normalized * (max - min);
}

/**
 * Derive 30+ parameters from SHA-256 hash
 */
export function deriveParamsFromHash(hashHex: string): HashDerivedParams {
    return {
        // Element counts (bits 0-15)
        elementCount: Math.round(extractFromHash(hashHex, 0, 8, 6, 20)),
        layerCount: Math.round(extractFromHash(hashHex, 8, 8, 1, 5)),

        // Rotation & angles (bits 16-31)
        rotationOffset: extractFromHash(hashHex, 16, 8, 0, 360),
        angleSpread: extractFromHash(hashHex, 24, 8, 0, 90),

        // Curve properties (bits 32-47)
        curveTension: extractFromHash(hashHex, 32, 8, 0.3, 0.9),
        curveAmplitude: extractFromHash(hashHex, 40, 8, 0, 50),

        // Taper & stroke (bits 48-63)
        taperRatio: extractFromHash(hashHex, 48, 8, 0.2, 0.8),
        strokeWidth: extractFromHash(hashHex, 56, 8, 1, 12),

        // Spacing & scale (bits 64-79)
        spacingFactor: extractFromHash(hashHex, 64, 8, 0.5, 2.0),
        scaleFactor: extractFromHash(hashHex, 72, 8, 0.7, 1.3),

        // Symmetry & style (bits 80-95)
        symmetryType: SYMMETRY_TYPES[Math.floor(extractFromHash(hashHex, 80, 8, 0, 7.99))],
        styleVariant: Math.floor(extractFromHash(hashHex, 88, 8, 0, 7.99)),

        // Color placement (bits 96-111)
        colorPlacement: Math.floor(extractFromHash(hashHex, 96, 8, 0, 7.99)),
        gradientAngle: extractFromHash(hashHex, 104, 8, 0, 360),

        // Organic variation (bits 112-127)
        organicAmount: extractFromHash(hashHex, 112, 8, 0, 1),
        jitterAmount: extractFromHash(hashHex, 120, 8, 0, 10),

        // Additional params (bits 128-255)
        armWidth: extractFromHash(hashHex, 128, 8, 2, 15),
        armLength: extractFromHash(hashHex, 136, 8, 20, 50),
        centerRadius: extractFromHash(hashHex, 144, 8, 0, 15),
        spiralAmount: extractFromHash(hashHex, 152, 8, 0, 0.5),
        bulgeAmount: extractFromHash(hashHex, 160, 8, 0, 0.5),
        cornerRadius: extractFromHash(hashHex, 168, 8, 0, 30),
        depthOffset: extractFromHash(hashHex, 176, 8, 2, 20),
        perspectiveStrength: extractFromHash(hashHex, 184, 8, 0, 1),
        letterWeight: Math.round(extractFromHash(hashHex, 192, 8, 100, 900)),
        cutDepth: extractFromHash(hashHex, 200, 8, 0, 1),
        overlapAmount: extractFromHash(hashHex, 208, 8, 0.2, 0.8),
        ringThickness: extractFromHash(hashHex, 216, 8, 2, 12),
        flowIntensity: extractFromHash(hashHex, 224, 8, 0, 1),
        extrusionDepth: extractFromHash(hashHex, 232, 8, 5, 25),
    };
}

// ============================================
// QUALITY SCORING SYSTEM
// ============================================

/**
 * Calculate quality score for a generated logo
 */
export function calculateQualityScore(svgString: string, params: HashDerivedParams): QualityMetrics {
    const pathSmoothness = calculatePathSmoothness(svgString);
    const visualBalance = calculateVisualBalance(svgString);
    const complexity = calculateOptimalComplexity(svgString);
    const goldenRatioAdherence = calculateGoldenRatioScore(params);
    const uniqueness = calculateUniquenessScore(params);

    // Weighted average for overall score
    const score = Math.round(
        pathSmoothness * 0.2 +
        visualBalance * 0.25 +
        complexity * 0.2 +
        goldenRatioAdherence * 0.15 +
        uniqueness * 0.2
    );

    return {
        score,
        pathSmoothness,
        visualBalance,
        complexity,
        goldenRatioAdherence,
        uniqueness,
    };
}

/**
 * Measure bezier curve quality and smoothness
 */
function calculatePathSmoothness(svgString: string): number {
    // Count bezier curve commands (C, Q, S)
    const bezierCount = (svgString.match(/[CQS]\s*[\d.-]/gi) || []).length;
    // Count sharp line commands (L)
    const lineCount = (svgString.match(/L\s*[\d.-]/gi) || []).length;

    if (bezierCount + lineCount === 0) return 50;

    // Higher ratio of beziers = smoother paths
    const bezierRatio = bezierCount / (bezierCount + lineCount);

    // Score based on bezier ratio (want mostly beziers)
    let score = bezierRatio * 80;

    // Bonus for having adequate number of curves
    if (bezierCount >= 4 && bezierCount <= 50) {
        score += 20;
    } else if (bezierCount > 50) {
        score += 10; // Still good but maybe too complex
    }

    return Math.min(100, Math.round(score));
}

/**
 * Calculate visual balance based on path distribution
 */
function calculateVisualBalance(svgString: string): number {
    // Extract all coordinate pairs
    const coordRegex = /[\d.-]+[\s,]+[\d.-]+/g;
    const coords: Point[] = [];
    let match;

    while ((match = coordRegex.exec(svgString)) !== null) {
        const parts = match[0].split(/[\s,]+/).map(Number);
        if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            coords.push({ x: parts[0], y: parts[1] });
        }
    }

    if (coords.length < 3) return 70; // Default for simple logos

    // Calculate centroid
    const centroid = {
        x: coords.reduce((sum, p) => sum + p.x, 0) / coords.length,
        y: coords.reduce((sum, p) => sum + p.y, 0) / coords.length,
    };

    // Check if centroid is near center (assuming 100x100 viewbox)
    const centerX = 50;
    const centerY = 50;
    const distFromCenter = Math.sqrt(
        Math.pow(centroid.x - centerX, 2) + Math.pow(centroid.y - centerY, 2)
    );

    // Score based on distance from center (closer = more balanced)
    const maxDist = 35; // Max acceptable distance
    const score = Math.max(0, 100 - (distFromCenter / maxDist) * 50);

    return Math.round(score);
}

/**
 * Score complexity (not too simple, not too complex)
 */
function calculateOptimalComplexity(svgString: string): number {
    const pathCommands = (svgString.match(/[MLCQSAZ]/gi) || []).length;
    const pathElements = (svgString.match(/<path/gi) || []).length;

    // Optimal ranges
    const optimalCommandsMin = 10;
    const optimalCommandsMax = 100;
    const optimalPathsMin = 1;
    const optimalPathsMax = 20;

    let commandScore = 100;
    if (pathCommands < optimalCommandsMin) {
        commandScore = (pathCommands / optimalCommandsMin) * 80;
    } else if (pathCommands > optimalCommandsMax) {
        commandScore = Math.max(50, 100 - ((pathCommands - optimalCommandsMax) / 50) * 30);
    }

    let pathScore = 100;
    if (pathElements < optimalPathsMin) {
        pathScore = 60;
    } else if (pathElements > optimalPathsMax) {
        pathScore = Math.max(60, 100 - ((pathElements - optimalPathsMax) / 10) * 20);
    }

    return Math.round((commandScore + pathScore) / 2);
}

/**
 * Score golden ratio usage in parameters
 */
function calculateGoldenRatioScore(params: HashDerivedParams): number {
    let score = 70; // Base score

    // Check if various ratios are close to golden ratio
    const phiRatios = [
        params.taperRatio / 0.618,
        params.scaleFactor / 1.618,
        params.curveTension / 0.618,
    ];

    for (const ratio of phiRatios) {
        const deviation = Math.abs(ratio - 1);
        if (deviation < 0.1) {
            score += 10; // Close to golden ratio
        } else if (deviation < 0.3) {
            score += 5;
        }
    }

    return Math.min(100, score);
}

/**
 * Score uniqueness based on parameter diversity
 */
function calculateUniquenessScore(params: HashDerivedParams): number {
    let score = 80;

    // Penalize very common/default values
    if (params.elementCount === 8) score -= 5;
    if (Math.abs(params.rotationOffset) < 5 || Math.abs(params.rotationOffset - 360) < 5) score -= 5;
    if (params.curveTension > 0.4 && params.curveTension < 0.6) score -= 3;

    // Bonus for interesting combinations
    if (params.spiralAmount > 0.2) score += 5;
    if (params.organicAmount > 0.3) score += 5;

    return Math.min(100, Math.max(60, score));
}

/**
 * Check if a logo meets minimum quality threshold
 */
export function meetsQualityThreshold(quality: QualityMetrics, minScore: number = MIN_QUALITY_SCORE): boolean {
    return quality.score >= minScore;
}

// ============================================
// SEEDED RANDOM NUMBER GENERATOR
// ============================================

/**
 * Create a seeded PRNG from hash
 */
export function createSeededRandom(seed: string): () => number {
    const seeds = hashStringTo4Seeds(seed);
    let [s0, s1, s2, s3] = seeds;

    return () => {
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

export function noise2D(x: number, y: number, seed: string): number {
    const rng = createSeededRandom(`${seed}-${Math.floor(x)}-${Math.floor(y)}`);
    const x0 = Math.floor(x);
    const y0 = Math.floor(y);
    const fx = x - x0;
    const fy = y - y0;

    const sx = fx * fx * (3 - 2 * fx);
    const sy = fy * fy * (3 - 2 * fy);

    const n00 = dotGridGradient(x0, y0, x, y, seed);
    const n10 = dotGridGradient(x0 + 1, y0, x, y, seed);
    const n01 = dotGridGradient(x0, y0 + 1, x, y, seed);
    const n11 = dotGridGradient(x0 + 1, y0 + 1, x, y, seed);

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

export function jitterPoint(point: Point, amount: number, rng: () => number): Point {
    return {
        x: point.x + (rng() - 0.5) * 2 * amount,
        y: point.y + (rng() - 0.5) * 2 * amount,
    };
}

// ============================================
// HASH STORAGE
// ============================================

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
        version: 'v5',
    });

    return cyrb53Hash(hashInput);
}

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

export function storeHash(record: LogoHashRecord): void {
    if (typeof window === 'undefined') return;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const data = stored
            ? (JSON.parse(stored) as { hashes: string[]; records: LogoHashRecord[] })
            : { hashes: [], records: [] };

        if (!data.hashes.includes(record.hash)) {
            data.hashes.push(record.hash);
            data.records.push(record);

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

export function clearStoredHashes(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

// ============================================
// PARAMETER GENERATION
// ============================================

export function generateBaseParams(rng: () => number): BaseParameters {
    return {
        strokeWidth: 2 + rng() * 4,
        strokeWidthVariance: rng() * 0.3,
        baseAngle: rng() * 360,
        angleVariance: rng() * 30,
        rotationOffset: rng() * 360,
        curveTension: 0.3 + rng() * 0.5,
        curveAmplitude: 5 + rng() * 25,
        curveFrequency: 1 + rng() * 4,
        segmentCount: 3 + Math.floor(rng() * 8),
        segmentSpacing: 5 + rng() * 20,
        segmentLengthRatio: 0.5 + rng() * 0.5,
        horizontalSpacing: 5 + rng() * 20,
        verticalSpacing: 5 + rng() * 20,
        paddingRatio: 0.1 + rng() * 0.15,
        scaleX: 0.8 + rng() * 0.4,
        scaleY: 0.8 + rng() * 0.4,
        sizeVariance: rng() * 0.3,
        cornerRadius: rng() * 20,
        cornerRadiusVariance: rng() * 0.5,
        baseOpacity: 0.7 + rng() * 0.3,
        opacityFalloff: rng() * 0.5,
        layerCount: 1 + Math.floor(rng() * 5),
        noiseAmount: rng() * 0.3,
        noiseFrequency: 0.5 + rng() * 2,
        jitterAmount: rng() * 5,
    };
}

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

export function generateLogoId(algorithm: LogoAlgorithm, variant: number): string {
    return `${algorithm}-${variant}-${Date.now().toString(36)}`;
}

export function calculateComplexity(pathData: string): number {
    const commands = pathData.match(/[MLCQSAZ]/gi) || [];
    const bezierCount = (pathData.match(/[CQS]/gi) || []).length;
    const totalCommands = commands.length;

    const baseScore = Math.min(totalCommands / 50, 1);
    const curveBonus = Math.min(bezierCount / 20, 0.3);

    return Math.min(baseScore + curveBonus, 1);
}

// ============================================
// BEZIER UTILITIES
// ============================================

/**
 * Create a bezier circle approximation (no primitive circle elements)
 */
export function createBezierCircle(cx: number, cy: number, r: number): string {
    const k = 0.5522847498; // Magic number for circle approximation
    return `
        M ${cx} ${cy - r}
        C ${cx + r * k} ${cy - r}, ${cx + r} ${cy - r * k}, ${cx + r} ${cy}
        C ${cx + r} ${cy + r * k}, ${cx + r * k} ${cy + r}, ${cx} ${cy + r}
        C ${cx - r * k} ${cy + r}, ${cx - r} ${cy + r * k}, ${cx - r} ${cy}
        C ${cx - r} ${cy - r * k}, ${cx - r * k} ${cy - r}, ${cx} ${cy - r}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Create a bezier ellipse approximation
 */
export function createBezierEllipse(cx: number, cy: number, rx: number, ry: number): string {
    const k = 0.5522847498;
    return `
        M ${cx} ${cy - ry}
        C ${cx + rx * k} ${cy - ry}, ${cx + rx} ${cy - ry * k}, ${cx + rx} ${cy}
        C ${cx + rx} ${cy + ry * k}, ${cx + rx * k} ${cy + ry}, ${cx} ${cy + ry}
        C ${cx - rx * k} ${cy + ry}, ${cx - rx} ${cy + ry * k}, ${cx - rx} ${cy}
        C ${cx - rx} ${cy - ry * k}, ${cx - rx * k} ${cy - ry}, ${cx} ${cy - ry}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Create a bezier rounded rectangle
 */
export function createBezierRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
): string {
    const r = Math.min(radius, width / 2, height / 2);
    const k = 0.5522847498;

    if (r <= 0) {
        // Sharp corners - but still use bezier for consistency
        return `
            M ${x} ${y}
            C ${x} ${y}, ${x + width} ${y}, ${x + width} ${y}
            C ${x + width} ${y}, ${x + width} ${y + height}, ${x + width} ${y + height}
            C ${x + width} ${y + height}, ${x} ${y + height}, ${x} ${y + height}
            C ${x} ${y + height}, ${x} ${y}, ${x} ${y}
            Z
        `.replace(/\s+/g, ' ').trim();
    }

    return `
        M ${x + r} ${y}
        L ${x + width - r} ${y}
        C ${x + width - r + r * k} ${y}, ${x + width} ${y + r - r * k}, ${x + width} ${y + r}
        L ${x + width} ${y + height - r}
        C ${x + width} ${y + height - r + r * k}, ${x + width - r + r * k} ${y + height}, ${x + width - r} ${y + height}
        L ${x + r} ${y + height}
        C ${x + r - r * k} ${y + height}, ${x} ${y + height - r + r * k}, ${x} ${y + height - r}
        L ${x} ${y + r}
        C ${x} ${y + r - r * k}, ${x + r - r * k} ${y}, ${x + r} ${y}
        Z
    `.replace(/\s+/g, ' ').trim();
}

/**
 * Create organic curved shape with smooth bezier curves
 */
export function createOrganicShape(
    points: Point[],
    tension: number = 0.5,
    closed: boolean = true
): string {
    if (points.length < 2) return '';
    if (points.length === 2) {
        const [p0, p1] = points;
        return `M ${p0.x} ${p0.y} C ${p0.x} ${p0.y}, ${p1.x} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    let path = `M ${points[0].x} ${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[i === 0 ? (closed ? points.length - 1 : 0) : i - 1];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[i + 2 < points.length ? i + 2 : (closed ? (i + 2) % points.length : points.length - 1)];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }

    if (closed) {
        const p0 = points[points.length - 2];
        const p1 = points[points.length - 1];
        const p2 = points[0];
        const p3 = points[1];

        const cp1x = p1.x + (p2.x - p0.x) * tension / 3;
        const cp1y = p1.y + (p2.y - p0.y) * tension / 3;
        const cp2x = p2.x - (p3.x - p1.x) * tension / 3;
        const cp2y = p2.y - (p3.y - p1.y) * tension / 3;

        path += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
        path += ' Z';
    }

    return path;
}
