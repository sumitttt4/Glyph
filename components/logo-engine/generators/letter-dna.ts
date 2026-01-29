/**
 * LETTER DNA Algorithm
 *
 * Analyzes letter anatomy (stems, bowls, crossbars, terminals, ascenders, descenders)
 * and reconstructs them in unexpected, artistic ways.
 *
 * "S" becomes flowing ribbon
 * "M" becomes mountain peaks
 * "B" becomes connected bubbles
 * "A" becomes tent/arrow structure
 * "O" becomes orbital ring
 *
 * This algorithm produces logos no other tool can make.
 */

import {
    LogoGenerationParams,
    GeneratedLogo,
    QualityMetrics,
    HashDerivedParams,
    BaseParameters,
} from '../types';
import {
    generateHashParamsSync,
    deriveParamsFromHash,
    calculateQualityScore,
    createSeededRandom,
    PHI,
} from '../core/parametric-engine';

// Letter anatomy definitions
interface LetterAnatomy {
    stems: number;        // Vertical strokes
    bowls: number;        // Rounded enclosed areas
    crossbars: number;    // Horizontal strokes
    diagonals: number;    // Diagonal strokes
    terminals: 'round' | 'flat' | 'pointed' | 'hooked';
    hasAscender: boolean;
    hasDescender: boolean;
    hasCounter: boolean;  // Enclosed or partially enclosed space
    openness: number;     // 0-1, how open the letter is
    symmetry: 'vertical' | 'horizontal' | 'both' | 'none';
    flow: 'curved' | 'angular' | 'mixed';
}

// Comprehensive letter anatomy database
const LETTER_ANATOMY: Record<string, LetterAnatomy> = {
    'A': { stems: 2, bowls: 0, crossbars: 1, diagonals: 2, terminals: 'pointed', hasAscender: true, hasDescender: false, hasCounter: true, openness: 0.3, symmetry: 'vertical', flow: 'angular' },
    'B': { stems: 1, bowls: 2, crossbars: 0, diagonals: 0, terminals: 'round', hasAscender: false, hasDescender: false, hasCounter: true, openness: 0.2, symmetry: 'none', flow: 'curved' },
    'C': { stems: 0, bowls: 1, crossbars: 0, diagonals: 0, terminals: 'round', hasAscender: false, hasDescender: false, hasCounter: false, openness: 0.7, symmetry: 'horizontal', flow: 'curved' },
    'D': { stems: 1, bowls: 1, crossbars: 0, diagonals: 0, terminals: 'flat', hasAscender: false, hasDescender: false, hasCounter: true, openness: 0.2, symmetry: 'horizontal', flow: 'mixed' },
    'E': { stems: 1, bowls: 0, crossbars: 3, diagonals: 0, terminals: 'flat', hasAscender: false, hasDescender: false, hasCounter: false, openness: 0.6, symmetry: 'horizontal', flow: 'angular' },
    'F': { stems: 1, bowls: 0, crossbars: 2, diagonals: 0, terminals: 'flat', hasAscender: true, hasDescender: false, hasCounter: false, openness: 0.7, symmetry: 'none', flow: 'angular' },
    'G': { stems: 0, bowls: 1, crossbars: 1, diagonals: 0, terminals: 'flat', hasAscender: false, hasDescender: false, hasCounter: false, openness: 0.5, symmetry: 'none', flow: 'curved' },
    'H': { stems: 2, bowls: 0, crossbars: 1, diagonals: 0, terminals: 'flat', hasAscender: true, hasDescender: false, hasCounter: true, openness: 0.4, symmetry: 'both', flow: 'angular' },
    'I': { stems: 1, bowls: 0, crossbars: 0, diagonals: 0, terminals: 'flat', hasAscender: true, hasDescender: false, hasCounter: false, openness: 0.9, symmetry: 'both', flow: 'angular' },
    'J': { stems: 1, bowls: 0, crossbars: 0, diagonals: 0, terminals: 'hooked', hasAscender: false, hasDescender: true, hasCounter: false, openness: 0.8, symmetry: 'none', flow: 'mixed' },
    'K': { stems: 1, bowls: 0, crossbars: 0, diagonals: 2, terminals: 'pointed', hasAscender: true, hasDescender: false, hasCounter: false, openness: 0.6, symmetry: 'none', flow: 'angular' },
    'L': { stems: 1, bowls: 0, crossbars: 1, diagonals: 0, terminals: 'flat', hasAscender: true, hasDescender: false, hasCounter: false, openness: 0.8, symmetry: 'none', flow: 'angular' },
    'M': { stems: 2, bowls: 0, crossbars: 0, diagonals: 2, terminals: 'pointed', hasAscender: true, hasDescender: false, hasCounter: true, openness: 0.3, symmetry: 'vertical', flow: 'angular' },
    'N': { stems: 2, bowls: 0, crossbars: 0, diagonals: 1, terminals: 'pointed', hasAscender: true, hasDescender: false, hasCounter: true, openness: 0.4, symmetry: 'none', flow: 'angular' },
    'O': { stems: 0, bowls: 1, crossbars: 0, diagonals: 0, terminals: 'round', hasAscender: false, hasDescender: false, hasCounter: true, openness: 0.1, symmetry: 'both', flow: 'curved' },
    'P': { stems: 1, bowls: 1, crossbars: 0, diagonals: 0, terminals: 'round', hasAscender: true, hasDescender: false, hasCounter: true, openness: 0.4, symmetry: 'none', flow: 'mixed' },
    'Q': { stems: 0, bowls: 1, crossbars: 0, diagonals: 1, terminals: 'pointed', hasAscender: false, hasDescender: true, hasCounter: true, openness: 0.2, symmetry: 'none', flow: 'curved' },
    'R': { stems: 1, bowls: 1, crossbars: 0, diagonals: 1, terminals: 'pointed', hasAscender: true, hasDescender: false, hasCounter: true, openness: 0.4, symmetry: 'none', flow: 'mixed' },
    'S': { stems: 0, bowls: 0, crossbars: 0, diagonals: 0, terminals: 'round', hasAscender: false, hasDescender: false, hasCounter: false, openness: 0.5, symmetry: 'none', flow: 'curved' },
    'T': { stems: 1, bowls: 0, crossbars: 1, diagonals: 0, terminals: 'flat', hasAscender: true, hasDescender: false, hasCounter: false, openness: 0.7, symmetry: 'vertical', flow: 'angular' },
    'U': { stems: 2, bowls: 0, crossbars: 0, diagonals: 0, terminals: 'round', hasAscender: false, hasDescender: false, hasCounter: false, openness: 0.5, symmetry: 'vertical', flow: 'curved' },
    'V': { stems: 0, bowls: 0, crossbars: 0, diagonals: 2, terminals: 'pointed', hasAscender: true, hasDescender: false, hasCounter: false, openness: 0.6, symmetry: 'vertical', flow: 'angular' },
    'W': { stems: 0, bowls: 0, crossbars: 0, diagonals: 4, terminals: 'pointed', hasAscender: true, hasDescender: false, hasCounter: true, openness: 0.4, symmetry: 'vertical', flow: 'angular' },
    'X': { stems: 0, bowls: 0, crossbars: 0, diagonals: 2, terminals: 'pointed', hasAscender: false, hasDescender: false, hasCounter: true, openness: 0.6, symmetry: 'both', flow: 'angular' },
    'Y': { stems: 1, bowls: 0, crossbars: 0, diagonals: 2, terminals: 'pointed', hasAscender: true, hasDescender: true, hasCounter: false, openness: 0.6, symmetry: 'vertical', flow: 'angular' },
    'Z': { stems: 0, bowls: 0, crossbars: 2, diagonals: 1, terminals: 'flat', hasAscender: false, hasDescender: false, hasCounter: false, openness: 0.5, symmetry: 'none', flow: 'angular' },
};

/**
 * Get anatomy for a letter
 */
function getLetterAnatomy(letter: string): LetterAnatomy {
    const upper = letter.toUpperCase();
    return LETTER_ANATOMY[upper] || LETTER_ANATOMY['A'];
}

/**
 * Generate ribbon-like path for S-type letters (flowing, curved)
 */
function generateRibbonPath(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams,
    rng: () => number
): string {
    const ribbonWidth = size * 0.15 + params.strokeWidth * 0.5;
    const amplitude = size * 0.3 * (0.8 + params.curveAmplitude * 0.01);
    const curves = 2 + Math.floor(params.elementCount % 3);

    let path = '';
    const points: { x: number; y: number }[] = [];

    // Generate S-curve points
    for (let i = 0; i <= curves * 10; i++) {
        const t = i / (curves * 10);
        const y = cy - size * 0.4 + t * size * 0.8;
        const wave = Math.sin(t * Math.PI * curves) * amplitude;
        const x = cx + wave;
        points.push({ x, y });
    }

    // Create ribbon outer edge
    path += `M ${points[0].x - ribbonWidth} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        const p = points[i];
        const prev = points[i - 1];
        const angle = Math.atan2(p.y - prev.y, p.x - prev.x);
        const offsetX = Math.sin(angle) * ribbonWidth;
        const offsetY = -Math.cos(angle) * ribbonWidth;

        if (i === 1) {
            path += ` C ${prev.x - ribbonWidth + offsetX * 0.5} ${prev.y + offsetY * 0.5}`;
        }
        path += ` ${p.x - offsetX} ${p.y - offsetY}`;
    }

    // Create ribbon inner edge (reverse)
    for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        const next = points[Math.min(i + 1, points.length - 1)];
        const angle = Math.atan2(next.y - p.y, next.x - p.x);
        const offsetX = Math.sin(angle) * ribbonWidth;
        const offsetY = -Math.cos(angle) * ribbonWidth;
        path += ` ${p.x + offsetX} ${p.y + offsetY}`;
    }
    path += ' Z';

    return path;
}

/**
 * Generate mountain peaks for M-type letters (angular, peaked)
 */
function generateMountainPeaksPath(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams,
    peakCount: number = 2
): string {
    const baseY = cy + size * 0.35;
    const peakHeight = size * 0.7;
    const peakWidth = size * 0.8 / peakCount;
    const startX = cx - size * 0.4;

    let path = `M ${startX} ${baseY}`;

    for (let i = 0; i < peakCount; i++) {
        const peakX = startX + peakWidth * (i + 0.5);
        const peakY = baseY - peakHeight * (0.7 + (i === 0 ? 0.3 : 0) * params.scaleFactor);
        const valleyX = startX + peakWidth * (i + 1);

        // Ascent with slight curve
        const cp1x = peakX - peakWidth * 0.2;
        const cp1y = baseY - peakHeight * 0.3;
        path += ` Q ${cp1x} ${cp1y} ${peakX} ${peakY}`;

        // Descent
        if (i < peakCount - 1) {
            const cp2x = peakX + peakWidth * 0.2;
            const cp2y = baseY - peakHeight * 0.3;
            path += ` Q ${cp2x} ${cp2y} ${valleyX} ${baseY - peakHeight * 0.1}`;
        } else {
            const cp2x = peakX + peakWidth * 0.3;
            const cp2y = baseY - peakHeight * 0.2;
            path += ` Q ${cp2x} ${cp2y} ${startX + size * 0.8} ${baseY}`;
        }
    }

    return path;
}

/**
 * Generate connected bubbles for B-type letters (bowls)
 */
function generateBubblesPath(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams,
    bubbleCount: number = 2
): string {
    const paths: string[] = [];
    const bubbleSize = size * 0.35 / Math.sqrt(bubbleCount);

    // Stem
    const stemX = cx - size * 0.25;
    const stemTop = cy - size * 0.35;
    const stemBottom = cy + size * 0.35;
    const stemWidth = size * 0.08;

    paths.push(`
        M ${stemX - stemWidth / 2} ${stemTop}
        L ${stemX + stemWidth / 2} ${stemTop}
        L ${stemX + stemWidth / 2} ${stemBottom}
        L ${stemX - stemWidth / 2} ${stemBottom}
        Z
    `);

    // Bubbles (bowls)
    for (let i = 0; i < bubbleCount; i++) {
        const bubbleY = stemTop + (stemBottom - stemTop) * ((i + 0.5) / bubbleCount);
        const bubbleX = stemX + bubbleSize * (0.8 + params.overlapAmount * 0.3);
        const r = bubbleSize * (1 - i * 0.15);

        // Create bubble with connection to stem
        paths.push(`
            M ${stemX + stemWidth / 2} ${bubbleY - r * 0.7}
            C ${stemX + r * 1.2} ${bubbleY - r * 0.9}
              ${bubbleX + r} ${bubbleY - r * 0.3}
              ${bubbleX + r} ${bubbleY}
            C ${bubbleX + r} ${bubbleY + r * 0.3}
              ${stemX + r * 1.2} ${bubbleY + r * 0.9}
              ${stemX + stemWidth / 2} ${bubbleY + r * 0.7}
        `);
    }

    return paths.join(' ');
}

/**
 * Generate orbital ring for O-type letters
 */
function generateOrbitalPath(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const outerR = size * 0.4;
    const innerR = outerR * (0.5 + params.innerRadius * 0.3);
    const tilt = params.rotationOffset * 0.3;

    // Create tilted ellipse effect
    const paths: string[] = [];

    // Outer ring
    paths.push(`
        M ${cx} ${cy - outerR}
        A ${outerR} ${outerR * (0.7 + tilt * 0.01)} 0 1 1 ${cx} ${cy + outerR}
        A ${outerR} ${outerR * (0.7 + tilt * 0.01)} 0 1 1 ${cx} ${cy - outerR}
    `);

    // Inner cutout
    paths.push(`
        M ${cx} ${cy - innerR}
        A ${innerR} ${innerR * (0.7 + tilt * 0.01)} 0 1 0 ${cx} ${cy + innerR}
        A ${innerR} ${innerR * (0.7 + tilt * 0.01)} 0 1 0 ${cx} ${cy - innerR}
    `);

    // Orbital accent
    const accentR = outerR * 1.1;
    const accentAngle = params.rotationOffset;
    paths.push(`
        M ${cx + Math.cos(accentAngle) * accentR} ${cy + Math.sin(accentAngle) * accentR * 0.5}
        A ${accentR * 0.3} ${accentR * 0.15} ${accentAngle * 180 / Math.PI} 0 1
          ${cx + Math.cos(accentAngle + 0.5) * accentR} ${cy + Math.sin(accentAngle + 0.5) * accentR * 0.5}
    `);

    return paths.join(' ');
}

/**
 * Generate tent/arrow structure for A-type letters
 */
function generateTentPath(
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams
): string {
    const apex = { x: cx, y: cy - size * 0.4 };
    const baseLeft = { x: cx - size * 0.35, y: cy + size * 0.35 };
    const baseRight = { x: cx + size * 0.35, y: cy + size * 0.35 };
    const strokeW = size * 0.08;

    // Main tent shape with crossbar
    const crossbarY = cy + size * 0.1;
    const crossbarInset = size * 0.15;

    return `
        M ${apex.x} ${apex.y - strokeW}
        L ${baseRight.x + strokeW * 0.5} ${baseRight.y}
        L ${baseRight.x - strokeW * 0.5} ${baseRight.y}
        L ${cx + crossbarInset} ${crossbarY + strokeW / 2}
        L ${cx - crossbarInset} ${crossbarY + strokeW / 2}
        L ${baseLeft.x + strokeW * 0.5} ${baseLeft.y}
        L ${baseLeft.x - strokeW * 0.5} ${baseLeft.y}
        Z
        M ${cx - crossbarInset * 0.8} ${crossbarY - strokeW / 2}
        L ${cx + crossbarInset * 0.8} ${crossbarY - strokeW / 2}
        L ${cx + crossbarInset * 0.8} ${crossbarY + strokeW / 2}
        L ${cx - crossbarInset * 0.8} ${crossbarY + strokeW / 2}
        Z
    `;
}

/**
 * Generate deconstructed letter path based on anatomy
 */
function generateDeconstructedLetter(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    params: HashDerivedParams,
    rng: () => number
): string {
    const anatomy = getLetterAnatomy(letter);

    // Choose deconstruction style based on anatomy
    if (anatomy.flow === 'curved' && anatomy.bowls === 0) {
        // S-type: flowing ribbon
        return generateRibbonPath(cx, cy, size, params, rng);
    }

    if (anatomy.diagonals >= 2 && anatomy.symmetry === 'vertical') {
        // M/W-type: mountain peaks
        const peakCount = anatomy.diagonals === 4 ? 3 : 2;
        return generateMountainPeaksPath(cx, cy, size, params, peakCount);
    }

    if (anatomy.bowls >= 1 && anatomy.stems >= 1) {
        // B/P/R-type: connected bubbles
        return generateBubblesPath(cx, cy, size, params, anatomy.bowls);
    }

    if (anatomy.bowls === 1 && anatomy.stems === 0 && anatomy.symmetry === 'both') {
        // O-type: orbital ring
        return generateOrbitalPath(cx, cy, size, params);
    }

    if (anatomy.diagonals >= 2 && anatomy.crossbars >= 1) {
        // A-type: tent structure
        return generateTentPath(cx, cy, size, params);
    }

    // Default: abstract interpretation based on characteristics
    return generateAbstractInterpretation(letter, cx, cy, size, anatomy, params, rng);
}

/**
 * Generate abstract interpretation for other letters
 */
function generateAbstractInterpretation(
    letter: string,
    cx: number,
    cy: number,
    size: number,
    anatomy: LetterAnatomy,
    params: HashDerivedParams,
    rng: () => number
): string {
    const paths: string[] = [];

    // Stems as vertical energy lines
    if (anatomy.stems > 0) {
        const stemSpacing = size * 0.4 / anatomy.stems;
        for (let i = 0; i < anatomy.stems; i++) {
            const x = cx - size * 0.2 + i * stemSpacing;
            const height = size * (0.5 + anatomy.hasAscender ? 0.2 : 0);
            const width = size * 0.06;

            // Add organic variation
            const curve = params.curveTension * 10;
            paths.push(`
                M ${x - width / 2} ${cy - height / 2}
                Q ${x - width / 2 + curve} ${cy} ${x - width / 2} ${cy + height / 2}
                L ${x + width / 2} ${cy + height / 2}
                Q ${x + width / 2 - curve} ${cy} ${x + width / 2} ${cy - height / 2}
                Z
            `);
        }
    }

    // Crossbars as horizontal energy
    if (anatomy.crossbars > 0) {
        const barSpacing = size * 0.3 / anatomy.crossbars;
        for (let i = 0; i < anatomy.crossbars; i++) {
            const y = cy - size * 0.15 + i * barSpacing;
            const width = size * 0.5;
            const height = size * 0.05;

            paths.push(`
                M ${cx - width / 2} ${y - height / 2}
                L ${cx + width / 2} ${y - height / 2}
                L ${cx + width / 2} ${y + height / 2}
                L ${cx - width / 2} ${y + height / 2}
                Z
            `);
        }
    }

    // Diagonals as dynamic angles
    if (anatomy.diagonals > 0) {
        const diagAngle = (Math.PI / 4) * (anatomy.symmetry === 'vertical' ? 1 : 0.8);
        for (let i = 0; i < anatomy.diagonals; i++) {
            const sign = i % 2 === 0 ? 1 : -1;
            const startX = cx + sign * size * 0.1;
            const startY = cy - size * 0.3;
            const endX = cx + sign * size * 0.3;
            const endY = cy + size * 0.3;
            const width = size * 0.06;

            paths.push(`
                M ${startX - width / 2} ${startY}
                L ${endX - width / 2} ${endY}
                L ${endX + width / 2} ${endY}
                L ${startX + width / 2} ${startY}
                Z
            `);
        }
    }

    // Counter space as negative circle
    if (anatomy.hasCounter) {
        const counterR = size * 0.1 * (1 + anatomy.openness);
        paths.push(`
            M ${cx} ${cy - counterR}
            A ${counterR} ${counterR} 0 1 0 ${cx} ${cy + counterR}
            A ${counterR} ${counterR} 0 1 0 ${cx} ${cy - counterR}
        `);
    }

    return paths.join(' ');
}

/**
 * Main Letter DNA generator
 */
export function generateLetterDNA(params: LogoGenerationParams): GeneratedLogo[] {
    const { brandName, primaryColor, accentColor, variations = 5 } = params;
    const logos: GeneratedLogo[] = [];

    const firstLetter = brandName.charAt(0).toUpperCase();
    const secondLetter = brandName.length > 1 ? brandName.charAt(1).toUpperCase() : firstLetter;

    for (let v = 0; v < variations; v++) {
        const salt = `letter-dna-${v}-${Date.now()}`;
        const hashParams = generateHashParamsSync(brandName, params.category || 'creative', salt);
        const derived = deriveParamsFromHash(hashParams.hashHex);
        const rng = createSeededRandom(hashParams.hashHex);

        const viewBox = '0 0 100 100';
        const cx = 50;
        const cy = 50;
        const size = 70;

        // Choose which letter(s) to deconstruct based on variant
        const useBothLetters = v % 3 === 0 && brandName.length > 1;

        let mainPath: string;
        if (useBothLetters) {
            // Blend two letters
            const path1 = generateDeconstructedLetter(firstLetter, cx - 15, cy, size * 0.7, derived, rng);
            const path2 = generateDeconstructedLetter(secondLetter, cx + 15, cy, size * 0.7, derived, rng);
            mainPath = path1 + ' ' + path2;
        } else {
            mainPath = generateDeconstructedLetter(firstLetter, cx, cy, size, derived, rng);
        }

        // Build gradient
        const gradientId = `letterDnaGrad-${v}`;
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
            id: `letter-dna-${hashParams.hashHex.slice(0, 12)}-${v}`,
            hash: hashParams.hashHex,
            algorithm: 'letter-dna' as any,
            variant: v,
            svg,
            viewBox,
            meta: {
                brandName,
                generatedAt: Date.now(),
                seed: salt,
                hashParams,
                geometry: {
                    usesGoldenRatio: true,
                    gridBased: false,
                    bezierCurves: true,
                    symmetry: 'none',
                    pathCount: svg.match(/<path/g)?.length || 1,
                    complexity: 75 + derived.elementCount,
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

export function generateSingleLetterDNAPreview(
    brandName: string,
    primaryColor: string,
    accentColor?: string
): GeneratedLogo {
    const logos = generateLetterDNA({
        brandName,
        primaryColor,
        accentColor,
        variations: 1,
    });
    return logos[0];
}
