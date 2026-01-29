/**
 * WORD RHYTHM Algorithm
 *
 * Uses word length, syllables, vowel/consonant patterns to generate shapes.
 * - Short punchy name (Bolt, Snap) = sharp angular marks
 * - Long flowing name (Serenity, Celestial) = curved organic marks
 * - Repeating patterns (Lululemon) = rhythmic repeated elements
 * - Alternating vowels/consonants = wave-like rhythm
 *
 * This algorithm produces logos no other tool can make.
 */

import {
    LogoGenerationParams,
    GeneratedLogo,
    QualityMetrics,
    HashDerivedParams,
} from '../types';
import {
    generateHashParamsSync,
    deriveParamsFromHash,
    calculateQualityScore,
    createSeededRandom,
    PHI,
} from '../core/parametric-engine';

// Word analysis result
interface WordRhythm {
    length: number;
    syllableCount: number;
    vowelCount: number;
    consonantCount: number;
    vowelRatio: number;
    pattern: string;              // V=vowel, C=consonant, e.g., "CVCCVC"
    rhythmType: 'staccato' | 'legato' | 'syncopated' | 'steady';
    energy: 'high' | 'medium' | 'low';
    flow: 'angular' | 'curved' | 'mixed';
    hasDoubles: boolean;          // Repeated letters
    hasAlternation: boolean;      // Alternating V/C pattern
    emphasisPoints: number[];     // Positions of emphasis (syllable starts)
}

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);

/**
 * Count syllables in a word (approximation)
 */
function countSyllables(word: string): number {
    const lower = word.toLowerCase();
    let count = 0;
    let prevVowel = false;

    for (const char of lower) {
        const isVowel = VOWELS.has(char);
        if (isVowel && !prevVowel) {
            count++;
        }
        prevVowel = isVowel;
    }

    // Silent e at end
    if (lower.endsWith('e') && count > 1) {
        count--;
    }

    return Math.max(1, count);
}

/**
 * Analyze word rhythm characteristics
 */
function analyzeWordRhythm(word: string): WordRhythm {
    const lower = word.toLowerCase();
    const length = lower.length;

    let vowelCount = 0;
    let consonantCount = 0;
    let pattern = '';
    const emphasisPoints: number[] = [0]; // First letter always emphasized

    for (let i = 0; i < lower.length; i++) {
        const char = lower[i];
        if (VOWELS.has(char)) {
            vowelCount++;
            pattern += 'V';
            // Vowels after consonants often start new syllables
            if (i > 0 && pattern[i - 1] === 'C') {
                emphasisPoints.push(i);
            }
        } else if (/[a-z]/.test(char)) {
            consonantCount++;
            pattern += 'C';
        }
    }

    const syllableCount = countSyllables(word);
    const vowelRatio = vowelCount / Math.max(1, length);

    // Check for doubles (repeated letters)
    const hasDoubles = /(.)\1/.test(lower);

    // Check for alternating pattern
    let alternationCount = 0;
    for (let i = 1; i < pattern.length; i++) {
        if (pattern[i] !== pattern[i - 1]) {
            alternationCount++;
        }
    }
    const hasAlternation = alternationCount >= pattern.length * 0.7;

    // Determine rhythm type
    let rhythmType: WordRhythm['rhythmType'];
    if (length <= 4 && consonantCount > vowelCount) {
        rhythmType = 'staccato'; // Short, punchy
    } else if (length >= 8 && vowelRatio > 0.4) {
        rhythmType = 'legato'; // Long, flowing
    } else if (hasAlternation) {
        rhythmType = 'syncopated'; // Alternating rhythm
    } else {
        rhythmType = 'steady'; // Regular rhythm
    }

    // Determine energy level
    let energy: WordRhythm['energy'];
    if (length <= 4 || rhythmType === 'staccato') {
        energy = 'high';
    } else if (length >= 8) {
        energy = 'low';
    } else {
        energy = 'medium';
    }

    // Determine flow type
    let flow: WordRhythm['flow'];
    if (consonantCount > vowelCount * 1.5) {
        flow = 'angular';
    } else if (vowelCount > consonantCount) {
        flow = 'curved';
    } else {
        flow = 'mixed';
    }

    return {
        length,
        syllableCount,
        vowelCount,
        consonantCount,
        vowelRatio,
        pattern,
        rhythmType,
        energy,
        flow,
        hasDoubles,
        hasAlternation,
        emphasisPoints,
    };
}

/**
 * Generate staccato/angular mark (short punchy names)
 */
function generateStaccatoMark(
    cx: number,
    cy: number,
    size: number,
    rhythm: WordRhythm,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];
    const angleStep = (2 * Math.PI) / rhythm.length;
    const baseRadius = size * 0.35;

    // Create sharp angular shapes based on word length
    const points: { x: number; y: number }[] = [];

    for (let i = 0; i < rhythm.length; i++) {
        const angle = -Math.PI / 2 + i * angleStep;
        const isEmphasis = rhythm.emphasisPoints.includes(i);
        const radiusMultiplier = isEmphasis ? 1.3 : 0.8 + rng() * 0.4;
        const r = baseRadius * radiusMultiplier;

        points.push({
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
        });
    }

    // Connect with sharp lines
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i].x} ${points[i].y}`;
    }
    path += ' Z';
    paths.push(path);

    // Add energy burst lines
    const burstCount = Math.min(rhythm.length, 5);
    for (let i = 0; i < burstCount; i++) {
        const angle = (i / burstCount) * 2 * Math.PI - Math.PI / 2;
        const innerR = baseRadius * 0.3;
        const outerR = baseRadius * (1.2 + params.scaleFactor * 0.3);
        const lineWidth = size * 0.03;

        const startX = cx + Math.cos(angle) * innerR;
        const startY = cy + Math.sin(angle) * innerR;
        const endX = cx + Math.cos(angle) * outerR;
        const endY = cy + Math.sin(angle) * outerR;

        // Perpendicular offset for line width
        const perpX = Math.sin(angle) * lineWidth;
        const perpY = -Math.cos(angle) * lineWidth;

        paths.push(`
            M ${startX - perpX} ${startY - perpY}
            L ${endX - perpX} ${endY - perpY}
            L ${endX + perpX} ${endY + perpY}
            L ${startX + perpX} ${startY + perpY}
            Z
        `);
    }

    return paths.join(' ');
}

/**
 * Generate legato/flowing mark (long flowing names)
 */
function generateLegatoMark(
    cx: number,
    cy: number,
    size: number,
    rhythm: WordRhythm,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];
    const waveCount = rhythm.syllableCount;
    const amplitude = size * 0.15 * (1 + rhythm.vowelRatio);
    const strokeWidth = size * 0.08;

    // Create flowing wave based on syllable count
    const pointCount = rhythm.length * 2;
    const wavePoints: { x: number; y: number }[] = [];

    for (let i = 0; i <= pointCount; i++) {
        const t = i / pointCount;
        const x = cx - size * 0.4 + t * size * 0.8;
        const y = cy + Math.sin(t * Math.PI * waveCount) * amplitude;

        // Add variation based on pattern
        const patternIndex = Math.floor(t * rhythm.pattern.length);
        const isVowel = rhythm.pattern[patternIndex] === 'V';
        const variation = isVowel ? amplitude * 0.2 : -amplitude * 0.1;

        wavePoints.push({ x, y: y + variation });
    }

    // Draw flowing ribbon
    let topPath = `M ${wavePoints[0].x} ${wavePoints[0].y - strokeWidth / 2}`;
    let bottomPath = '';

    for (let i = 1; i < wavePoints.length; i++) {
        const prev = wavePoints[i - 1];
        const curr = wavePoints[i];
        const cp1x = prev.x + (curr.x - prev.x) * 0.5;
        const cp1y = prev.y;
        const cp2x = prev.x + (curr.x - prev.x) * 0.5;
        const cp2y = curr.y;

        topPath += ` C ${cp1x} ${cp1y - strokeWidth / 2} ${cp2x} ${cp2y - strokeWidth / 2} ${curr.x} ${curr.y - strokeWidth / 2}`;
    }

    // Return path (bottom edge)
    for (let i = wavePoints.length - 1; i >= 0; i--) {
        const point = wavePoints[i];
        bottomPath += ` L ${point.x} ${point.y + strokeWidth / 2}`;
    }

    paths.push(topPath + bottomPath + ' Z');

    return paths.join(' ');
}

/**
 * Generate syncopated mark (alternating patterns)
 */
function generateSyncopatedMark(
    cx: number,
    cy: number,
    size: number,
    rhythm: WordRhythm,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];
    const elementCount = rhythm.pattern.length;
    const spacing = size * 0.8 / elementCount;

    // Create alternating elements based on pattern
    for (let i = 0; i < elementCount; i++) {
        const x = cx - size * 0.35 + i * spacing;
        const isVowel = rhythm.pattern[i] === 'V';

        if (isVowel) {
            // Vowels = circles (soft)
            const r = spacing * 0.35;
            const y = cy - spacing * 0.2;
            paths.push(`
                M ${x} ${y - r}
                A ${r} ${r} 0 1 1 ${x} ${y + r}
                A ${r} ${r} 0 1 1 ${x} ${y - r}
            `);
        } else {
            // Consonants = rectangles (hard)
            const w = spacing * 0.25;
            const h = spacing * 0.7;
            const y = cy + spacing * 0.1;
            paths.push(`
                M ${x - w} ${y - h / 2}
                L ${x + w} ${y - h / 2}
                L ${x + w} ${y + h / 2}
                L ${x - w} ${y + h / 2}
                Z
            `);
        }
    }

    // Add connecting rhythm line
    const lineY = cy + size * 0.25;
    const lineWidth = size * 0.02;
    paths.push(`
        M ${cx - size * 0.38} ${lineY - lineWidth}
        L ${cx + size * 0.38} ${lineY - lineWidth}
        L ${cx + size * 0.38} ${lineY + lineWidth}
        L ${cx - size * 0.38} ${lineY + lineWidth}
        Z
    `);

    return paths.join(' ');
}

/**
 * Generate steady/rhythmic mark (regular patterns)
 */
function generateSteadyMark(
    cx: number,
    cy: number,
    size: number,
    rhythm: WordRhythm,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];
    const barCount = rhythm.syllableCount + 1;
    const barWidth = size * 0.06;
    const maxBarHeight = size * 0.6;
    const spacing = size * 0.7 / barCount;

    // Create equalizer-like bars based on syllables
    for (let i = 0; i < barCount; i++) {
        const x = cx - size * 0.3 + i * spacing;

        // Height based on emphasis and position
        const isEmphasis = rhythm.emphasisPoints.some(p =>
            Math.floor(p / rhythm.length * barCount) === i
        );
        const heightMultiplier = isEmphasis ? 1 : 0.5 + rng() * 0.3;
        const barHeight = maxBarHeight * heightMultiplier;

        // Round-topped bars
        const r = barWidth / 2;
        paths.push(`
            M ${x - r} ${cy + barHeight / 2 - r}
            L ${x - r} ${cy - barHeight / 2 + r}
            A ${r} ${r} 0 0 1 ${x + r} ${cy - barHeight / 2 + r}
            L ${x + r} ${cy + barHeight / 2 - r}
            A ${r} ${r} 0 0 1 ${x - r} ${cy + barHeight / 2 - r}
            Z
        `);
    }

    return paths.join(' ');
}

/**
 * Generate mark with doubled letter emphasis
 */
function generateDoubleMark(
    cx: number,
    cy: number,
    size: number,
    rhythm: WordRhythm,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];
    const r = size * 0.25;
    const offset = r * 0.6;

    // Two overlapping circles for the double
    const colors = ['primary', 'accent'];
    for (let i = 0; i < 2; i++) {
        const circleX = cx + (i === 0 ? -offset : offset);
        paths.push(`
            M ${circleX} ${cy - r}
            A ${r} ${r} 0 1 1 ${circleX} ${cy + r}
            A ${r} ${r} 0 1 1 ${circleX} ${cy - r}
        `);
    }

    // Connecting elements based on word length
    const connectionCount = Math.min(rhythm.length - 2, 4);
    for (let i = 0; i < connectionCount; i++) {
        const angle = (i / connectionCount) * Math.PI - Math.PI / 2;
        const lineR = r * 1.3;
        const lineWidth = size * 0.04;

        const x1 = cx + Math.cos(angle) * (lineR - lineWidth);
        const y1 = cy + Math.sin(angle) * (lineR - lineWidth);
        const x2 = cx + Math.cos(angle) * (lineR + lineWidth);
        const y2 = cy + Math.sin(angle) * (lineR + lineWidth);

        paths.push(`
            M ${x1 - lineWidth} ${y1}
            L ${x2 + lineWidth} ${y2}
            L ${x2} ${y2 + lineWidth}
            L ${x1} ${y1 + lineWidth}
            Z
        `);
    }

    return paths.join(' ');
}

/**
 * Main Word Rhythm generator
 */
export function generateWordRhythm(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, primaryColor, accentColor, variations = 5 } = params;
    const logos: GeneratedLogo[] = [];

    const rhythm = analyzeWordRhythm(brandName);

    for (let v = 0; v < variations; v++) {
        const salt = `word-rhythm-${v}-${Date.now()}`;
        const hashParams = generateHashParamsSync(brandName, params.category || 'creative', salt);
        const derived = deriveParamsFromHash(hashParams.hashHex);
        const rng = createSeededRandom(hashParams.hashHex);

        const viewBox = '0 0 100 100';
        const cx = 50;
        const cy = 50;
        const size = 75;

        // Choose generation style based on rhythm and variant
        let mainPath: string;
        const styleIndex = v % 5;

        if (rhythm.hasDoubles && styleIndex === 0) {
            mainPath = generateDoubleMark(cx, cy, size, rhythm, derived, rng);
        } else if (rhythm.rhythmType === 'staccato' || styleIndex === 1) {
            mainPath = generateStaccatoMark(cx, cy, size, rhythm, derived, rng);
        } else if (rhythm.rhythmType === 'legato' || styleIndex === 2) {
            mainPath = generateLegatoMark(cx, cy, size, rhythm, derived, rng);
        } else if (rhythm.rhythmType === 'syncopated' || styleIndex === 3) {
            mainPath = generateSyncopatedMark(cx, cy, size, rhythm, derived, rng);
        } else {
            mainPath = generateSteadyMark(cx, cy, size, rhythm, derived, rng);
        }

        // Build gradient
        const gradientId = `wordRhythmGrad-${v}`;
        const gradientAngle = derived.gradientAngle;
        const x1 = 50 - Math.cos(gradientAngle * Math.PI / 180) * 50;
        const y1 = 50 - Math.sin(gradientAngle * Math.PI / 180) * 50;
        const x2 = 50 + Math.cos(gradientAngle * Math.PI / 180) * 50;
        const y2 = 50 + Math.sin(gradientAngle * Math.PI / 180) * 50;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">
            <defs>
                <linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
                    <stop offset="0%" stop-color="${primaryColor}"/>
                    <stop offset="100%" stop-color="${accentColor || primaryColor}"/>
                </linearGradient>
            </defs>
            <path d="${mainPath}" fill="url(#${gradientId})" fill-rule="evenodd"/>
        </svg>`;

        const quality = calculateQualityScore(svg, derived);

        logos.push({
            id: `word-rhythm-${hashParams.hashHex.slice(0, 12)}-${v}`,
            hash: hashParams.hashHex,
            algorithm: 'word-rhythm' as any,
            variant: v,
            svg,
            viewBox,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: salt,
                hashParams,
                geometry: {
                    usesGoldenRatio: false,
                    gridBased: true,
                    bezierCurves: rhythm.rhythmType === 'legato',
                    symmetry: rhythm.hasAlternation ? 'horizontal' : 'none',
                    pathCount: svg.match(/<path/g)?.length || 1,
                    complexity: 70 + rhythm.syllableCount * 5,
                },
                colors: {
                    primary: primaryColor,
                    accent: accentColor,
                    palette: [primaryColor, accentColor || primaryColor],
                },
            },
            params: derived as any,
            quality,
        });
    }

    return logos.filter(l => l.quality.score >= 60).slice(0, 5);
}

export function generateSingleWordRhythmPreview(
    brandName: string,
    primaryColor: string,
    accentColor?: string
): GeneratedLogo {
    const logos = generateWordRhythm({
        brandName,
        primaryColor,
        accentColor,
        variations: 1,
    });
    return logos[0];
}

// Export rhythm analysis for external use
export { analyzeWordRhythm, type WordRhythm };
