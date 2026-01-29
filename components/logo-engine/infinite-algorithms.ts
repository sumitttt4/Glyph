/**
 * Infinite Uniqueness Logo Algorithms
 *
 * 8 algorithms based on professional logo references:
 * 1. LETTER FUSION - Initial + concept (A+leaf, K+arrow like Atome, Atarpa)
 * 2. INTERLOCKING GEOMETRY - 3 shapes weaving (like Anchortack)
 * 3. NEGATIVE SPACE LETTER - Letter from cutouts (like Kompose)
 * 4. MONOGRAM MERGE - 2 letters sharing strokes (like Dipeook)
 * 5. CLOVER RADIAL - Shape repeated 3-4x rotational (like Quanter)
 * 6. SINGLE STROKE - Continuous line mark (like Artifact)
 * 7. LETTER EXTRACT - Stylized letter part (like Astro)
 * 8. GRADIENT GLOW - Shape with inner light (like HaloAI)
 *
 * Each algorithm uses 50+ parameters from master seed for infinite uniqueness.
 */

import { MasterSeed, SeedParameters, InfiniteAlgorithm } from './infinite-uniqueness';

// ============================================================================
// SHARED UTILITIES
// ============================================================================

const SIZE = 100;
const CX = SIZE / 2;
const CY = SIZE / 2;

/**
 * Letter shapes for fusion and extraction
 */
const LETTER_ANATOMY: Record<string, {
  stems: { x1: number; y1: number; x2: number; y2: number }[];
  bowls: { cx: number; cy: number; rx: number; ry: number }[];
  crossbars: { x1: number; y1: number; x2: number; y2: number }[];
  apex: { x: number; y: number };
  baseline: number;
}> = {
  'A': {
    stems: [
      { x1: 50, y1: 85, x2: 30, y2: 15 },
      { x1: 50, y1: 85, x2: 70, y2: 15 }
    ],
    bowls: [],
    crossbars: [{ x1: 35, y1: 55, x2: 65, y2: 55 }],
    apex: { x: 50, y: 15 },
    baseline: 85
  },
  'B': {
    stems: [{ x1: 30, y1: 15, x2: 30, y2: 85 }],
    bowls: [
      { cx: 45, cy: 35, rx: 20, ry: 18 },
      { cx: 48, cy: 65, rx: 23, ry: 20 }
    ],
    crossbars: [{ x1: 30, y1: 50, x2: 55, y2: 50 }],
    apex: { x: 30, y: 15 },
    baseline: 85
  },
  'K': {
    stems: [{ x1: 30, y1: 15, x2: 30, y2: 85 }],
    bowls: [],
    crossbars: [],
    apex: { x: 70, y: 15 },
    baseline: 85
  },
  'M': {
    stems: [
      { x1: 20, y1: 85, x2: 20, y2: 15 },
      { x1: 20, y1: 15, x2: 50, y2: 50 },
      { x1: 50, y1: 50, x2: 80, y2: 15 },
      { x1: 80, y1: 15, x2: 80, y2: 85 }
    ],
    bowls: [],
    crossbars: [],
    apex: { x: 50, y: 50 },
    baseline: 85
  },
  'N': {
    stems: [
      { x1: 25, y1: 85, x2: 25, y2: 15 },
      { x1: 25, y1: 15, x2: 75, y2: 85 },
      { x1: 75, y1: 85, x2: 75, y2: 15 }
    ],
    bowls: [],
    crossbars: [],
    apex: { x: 25, y: 15 },
    baseline: 85
  },
  'V': {
    stems: [
      { x1: 20, y1: 15, x2: 50, y2: 85 },
      { x1: 80, y1: 15, x2: 50, y2: 85 }
    ],
    bowls: [],
    crossbars: [],
    apex: { x: 50, y: 85 },
    baseline: 85
  },
  'W': {
    stems: [
      { x1: 10, y1: 15, x2: 25, y2: 85 },
      { x1: 25, y1: 85, x2: 40, y2: 40 },
      { x1: 40, y1: 40, x2: 55, y2: 85 },
      { x1: 55, y1: 85, x2: 70, y2: 40 },
      { x1: 70, y1: 40, x2: 90, y2: 15 }
    ],
    bowls: [],
    crossbars: [],
    apex: { x: 25, y: 85 },
    baseline: 85
  }
};

/**
 * Concept shapes for fusion
 */
const CONCEPT_SHAPES = {
  leaf: (cx: number, cy: number, size: number, params: SeedParameters): string => {
    const tension = params.curveTension;
    return `<path d="M ${cx} ${cy - size * 0.5} Q ${cx + size * 0.4 * tension} ${cy - size * 0.2} ${cx + size * 0.3} ${cy + size * 0.3} Q ${cx} ${cy + size * 0.5} ${cx - size * 0.3} ${cy + size * 0.3} Q ${cx - size * 0.4 * tension} ${cy - size * 0.2} ${cx} ${cy - size * 0.5}" fill="currentColor"/>`;
  },
  arrow: (cx: number, cy: number, size: number, params: SeedParameters): string => {
    const w = size * 0.3;
    const h = size * 0.5;
    return `<path d="M ${cx} ${cy - h} L ${cx + w} ${cy + h * 0.3} L ${cx + w * 0.3} ${cy + h * 0.3} L ${cx + w * 0.3} ${cy + h} L ${cx - w * 0.3} ${cy + h} L ${cx - w * 0.3} ${cy + h * 0.3} L ${cx - w} ${cy + h * 0.3} Z" fill="currentColor"/>`;
  },
  wave: (cx: number, cy: number, size: number, params: SeedParameters): string => {
    const amp = size * 0.2 * params.curveTension;
    return `<path d="M ${cx - size * 0.4} ${cy} Q ${cx - size * 0.2} ${cy - amp} ${cx} ${cy} Q ${cx + size * 0.2} ${cy + amp} ${cx + size * 0.4} ${cy}" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth}"/>`;
  },
  circle: (cx: number, cy: number, size: number, params: SeedParameters): string => {
    return `<circle cx="${cx}" cy="${cy}" r="${size * 0.3}" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth}"/>`;
  },
  diamond: (cx: number, cy: number, size: number, params: SeedParameters): string => {
    const s = size * 0.35;
    const r = params.cornerRadius * s * 0.01;
    return `<path d="M ${cx} ${cy - s} L ${cx + s} ${cy} L ${cx} ${cy + s} L ${cx - s} ${cy} Z" fill="currentColor"/>`;
  },
  drop: (cx: number, cy: number, size: number, params: SeedParameters): string => {
    const tension = params.curveTension;
    return `<path d="M ${cx} ${cy - size * 0.4} Q ${cx + size * 0.3 * tension} ${cy} ${cx} ${cy + size * 0.4} Q ${cx - size * 0.3 * tension} ${cy} ${cx} ${cy - size * 0.4}" fill="currentColor"/>`;
  }
};

// ============================================================================
// 1. LETTER FUSION
// ============================================================================

function generateLetterFusion(seed: MasterSeed): string {
  const { brandName, params } = seed;
  const initial = brandName.charAt(0).toUpperCase();
  const letterData = LETTER_ANATOMY[initial] || LETTER_ANATOMY['A'];

  const paths: string[] = [];
  const scale = 0.7;
  const offsetX = CX * (1 - scale);
  const offsetY = CY * (1 - scale);

  // Draw letter stems with seed-influenced styling
  const strokeW = params.strokeWidth;
  const rotation = params.rotation * 0.1; // Subtle rotation

  paths.push(`<g transform="rotate(${rotation}, ${CX}, ${CY})">`);

  letterData.stems.forEach((stem, i) => {
    const x1 = stem.x1 * scale + offsetX;
    const y1 = stem.y1 * scale + offsetY;
    const x2 = stem.x2 * scale + offsetX;
    const y2 = stem.y2 * scale + offsetY;

    // Apply corner radius as line smoothing
    const taper = params.strokeTaper > 50 ? 'round' : 'butt';
    paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="${taper}"/>`);
  });

  // Draw bowls
  letterData.bowls.forEach(bowl => {
    const cx = bowl.cx * scale + offsetX;
    const cy = bowl.cy * scale + offsetY;
    const rx = bowl.rx * scale;
    const ry = bowl.ry * scale;
    paths.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="currentColor" stroke-width="${strokeW}"/>`);
  });

  // Draw crossbars
  letterData.crossbars.forEach(bar => {
    const x1 = bar.x1 * scale + offsetX;
    const y1 = bar.y1 * scale + offsetY;
    const x2 = bar.x2 * scale + offsetX;
    const y2 = bar.y2 * scale + offsetY;
    paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${strokeW}"/>`);
  });

  paths.push('</g>');

  // Add concept fusion at strategic position
  const concepts = Object.keys(CONCEPT_SHAPES);
  const conceptIndex = Math.floor(params.curveTension * concepts.length);
  const conceptName = concepts[conceptIndex % concepts.length] as keyof typeof CONCEPT_SHAPES;
  const conceptFn = CONCEPT_SHAPES[conceptName];

  // Position concept based on letter apex or cutout position
  const fusionX = CX + (params.cutoutPosition - 6) * 3;
  const fusionY = letterData.apex.y * scale + offsetY + params.offsetY * 0.5;
  const conceptSize = SIZE * 0.25 * params.scaleVariance;

  paths.push(conceptFn(fusionX, fusionY, conceptSize, params));

  return wrapSvg(paths.join('\n'));
}

// ============================================================================
// 2. INTERLOCKING GEOMETRY
// ============================================================================

function generateInterlockingGeometry(seed: MasterSeed): string {
  const { params } = seed;
  const paths: string[] = [];

  const shapeCount = Math.max(3, params.elementCount);
  const interlockDepth = params.interlockDepth / 100;
  const baseSize = SIZE * 0.25;

  // Generate interlocking shapes
  for (let i = 0; i < shapeCount; i++) {
    const angle = (i / shapeCount) * Math.PI * 2 + (params.rotation * Math.PI / 180);
    const distance = SIZE * 0.15 * (1 - interlockDepth * 0.5);

    const shapeCx = CX + Math.cos(angle) * distance;
    const shapeCy = CY + Math.sin(angle) * distance;

    const shapeSize = baseSize * (0.8 + (i / shapeCount) * 0.4 * params.scaleVariance);

    // Shape type based on index and params
    const shapeType = (i + Math.floor(params.cornerRadius / 20)) % 3;

    if (shapeType === 0) {
      // Rounded rectangle
      const w = shapeSize;
      const h = shapeSize * params.aspectRatio;
      const r = params.cornerRadius * 0.01 * Math.min(w, h) * 0.5;
      const shapeRotation = angle * (180 / Math.PI) + params.rotation * 0.5;
      paths.push(`<rect x="${shapeCx - w / 2}" y="${shapeCy - h / 2}" width="${w}" height="${h}" rx="${r}" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth}" transform="rotate(${shapeRotation}, ${shapeCx}, ${shapeCy})"/>`);
    } else if (shapeType === 1) {
      // Circle/ellipse
      const rx = shapeSize * 0.5;
      const ry = rx * params.aspectRatio;
      paths.push(`<ellipse cx="${shapeCx}" cy="${shapeCy}" rx="${rx}" ry="${ry}" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth}"/>`);
    } else {
      // Triangle
      const r = shapeSize * 0.5;
      const points: string[] = [];
      for (let p = 0; p < 3; p++) {
        const pAngle = angle + (p / 3) * Math.PI * 2 - Math.PI / 2;
        points.push(`${shapeCx + Math.cos(pAngle) * r},${shapeCy + Math.sin(pAngle) * r}`);
      }
      paths.push(`<polygon points="${points.join(' ')}" fill="none" stroke="currentColor" stroke-width="${params.strokeWidth}"/>`);
    }
  }

  // Add connecting lines for interlock effect
  if (params.interlockDepth > 30) {
    for (let i = 0; i < shapeCount; i++) {
      const angle1 = (i / shapeCount) * Math.PI * 2;
      const angle2 = ((i + 1) / shapeCount) * Math.PI * 2;

      const x1 = CX + Math.cos(angle1) * SIZE * 0.1;
      const y1 = CY + Math.sin(angle1) * SIZE * 0.1;
      const x2 = CX + Math.cos(angle2) * SIZE * 0.1;
      const y2 = CY + Math.sin(angle2) * SIZE * 0.1;

      paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${params.strokeWidth * 0.5}" opacity="0.5"/>`);
    }
  }

  return wrapSvg(paths.join('\n'));
}

// ============================================================================
// 3. NEGATIVE SPACE LETTER
// ============================================================================

function generateNegativeSpaceLetter(seed: MasterSeed): string {
  const { brandName, params } = seed;
  const paths: string[] = [];

  const initial = brandName.charAt(0).toUpperCase();
  const bgSize = SIZE * 0.7;
  const cornerR = params.cornerRadius * 0.01 * bgSize * 0.3;

  // Background shape
  const bgX = CX - bgSize / 2;
  const bgY = CY - bgSize / 2;

  // Define clip path for negative space
  const clipId = `clip-${seed.hash.substring(0, 8)}`;

  paths.push(`<defs>`);
  paths.push(`<clipPath id="${clipId}">`);
  paths.push(`<rect x="${bgX}" y="${bgY}" width="${bgSize}" height="${bgSize}" rx="${cornerR}"/>`);
  paths.push(`</clipPath>`);
  paths.push(`</defs>`);

  // Background with cutouts creating letter
  paths.push(`<rect x="${bgX}" y="${bgY}" width="${bgSize}" height="${bgSize}" rx="${cornerR}" fill="currentColor"/>`);

  // Create cutouts based on letter
  const cutoutSize = bgSize * 0.3;
  const positions = getCutoutPositionsForLetter(initial, CX, CY, bgSize, params);

  positions.forEach((pos, i) => {
    const cutoutR = cutoutSize * (0.5 + params.scaleVariance * 0.3);

    if (params.symmetryType === 'radial' || i % 2 === 0) {
      paths.push(`<circle cx="${pos.x}" cy="${pos.y}" r="${cutoutR}" fill="var(--bg-color, white)"/>`);
    } else {
      const rectSize = cutoutR * 1.5;
      const rectR = params.cornerRadius * 0.01 * rectSize * 0.5;
      paths.push(`<rect x="${pos.x - rectSize / 2}" y="${pos.y - rectSize / 2}" width="${rectSize}" height="${rectSize}" rx="${rectR}" fill="var(--bg-color, white)" transform="rotate(${params.rotation * 0.5}, ${pos.x}, ${pos.y})"/>`);
    }
  });

  return wrapSvg(paths.join('\n'), true);
}

function getCutoutPositionsForLetter(
  letter: string,
  cx: number,
  cy: number,
  size: number,
  params: SeedParameters
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  const offset = size * 0.2;

  // Letter-specific cutout patterns
  switch (letter) {
    case 'K':
      // K shape from diagonal cutouts
      positions.push({ x: cx + offset, y: cy - offset });
      positions.push({ x: cx + offset, y: cy + offset });
      positions.push({ x: cx - offset * 0.5, y: cy });
      break;
    case 'A':
      // A shape with triangular cutout
      positions.push({ x: cx, y: cy + offset });
      positions.push({ x: cx - offset, y: cy + offset * 0.5 });
      positions.push({ x: cx + offset, y: cy + offset * 0.5 });
      break;
    case 'H':
      // H shape
      positions.push({ x: cx, y: cy - offset });
      positions.push({ x: cx, y: cy + offset });
      break;
    case 'N':
      // N shape
      positions.push({ x: cx - offset * 0.8, y: cy + offset * 0.5 });
      positions.push({ x: cx + offset * 0.8, y: cy - offset * 0.5 });
      break;
    default:
      // Generic pattern based on cutoutPosition
      const count = 2 + Math.floor(params.cutoutPosition / 4);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + params.rotation * Math.PI / 180;
        positions.push({
          x: cx + Math.cos(angle) * offset,
          y: cy + Math.sin(angle) * offset
        });
      }
  }

  return positions;
}

// ============================================================================
// 4. MONOGRAM MERGE
// ============================================================================

function generateMonogramMerge(seed: MasterSeed): string {
  const { brandName, params } = seed;
  const paths: string[] = [];

  // Get first two letters
  const words = brandName.split(/\s+/);
  const letter1 = words[0]?.charAt(0).toUpperCase() || 'A';
  const letter2 = words[1]?.charAt(0).toUpperCase() || brandName.charAt(1)?.toUpperCase() || 'B';

  const strokeW = params.strokeWidth;
  const letterScale = 0.4;

  // Generate merged letterforms
  // Use simplified stroke-based rendering for merge effect

  // Letter 1 position (left/top)
  const l1x = CX - SIZE * 0.15;
  const l1y = CY;

  // Letter 2 position (right/bottom, overlapping)
  const l2x = CX + SIZE * 0.15 * (1 - params.overlapAmount / 100);
  const l2y = CY;

  // Shared stroke (the merge point)
  const shareX = (l1x + l2x) / 2;

  // Draw letter strokes with shared element
  const weight = params.letterWeight === 'heavy' ? 1.5 :
    params.letterWeight === 'bold' ? 1.2 :
      params.letterWeight === 'light' ? 0.7 : 1;

  const finalStrokeW = strokeW * weight;

  // Letter 1 simplified strokes
  paths.push(`<line x1="${l1x - SIZE * 0.1}" y1="${CY - SIZE * 0.25}" x2="${l1x - SIZE * 0.1}" y2="${CY + SIZE * 0.25}" stroke="currentColor" stroke-width="${finalStrokeW}" stroke-linecap="round"/>`);

  // Shared vertical stroke
  paths.push(`<line x1="${shareX}" y1="${CY - SIZE * 0.25}" x2="${shareX}" y2="${CY + SIZE * 0.25}" stroke="currentColor" stroke-width="${finalStrokeW}" stroke-linecap="round"/>`);

  // Letter 2 strokes
  paths.push(`<line x1="${l2x + SIZE * 0.1}" y1="${CY - SIZE * 0.25}" x2="${l2x + SIZE * 0.1}" y2="${CY + SIZE * 0.25}" stroke="currentColor" stroke-width="${finalStrokeW}" stroke-linecap="round"/>`);

  // Connecting elements based on letters
  const connector1Y = CY - SIZE * 0.1;
  const connector2Y = CY + SIZE * 0.1;

  paths.push(`<line x1="${l1x - SIZE * 0.1}" y1="${connector1Y}" x2="${shareX}" y2="${connector1Y}" stroke="currentColor" stroke-width="${finalStrokeW * 0.8}" stroke-linecap="round"/>`);
  paths.push(`<line x1="${shareX}" y1="${connector2Y}" x2="${l2x + SIZE * 0.1}" y2="${connector2Y}" stroke="currentColor" stroke-width="${finalStrokeW * 0.8}" stroke-linecap="round"/>`);

  // Decorative element at merge point
  if (params.interlockDepth > 50) {
    paths.push(`<circle cx="${shareX}" cy="${CY}" r="${finalStrokeW * 1.5}" fill="currentColor"/>`);
  }

  return wrapSvg(paths.join('\n'));
}

// ============================================================================
// 5. CLOVER RADIAL
// ============================================================================

function generateCloverRadial(seed: MasterSeed): string {
  const { params } = seed;
  const paths: string[] = [];

  const petalCount = Math.max(3, Math.min(6, params.elementCount));
  const petalSize = SIZE * 0.18;
  const centerDistance = SIZE * 0.12 * params.spacingRatio;

  // Generate radially symmetric petals
  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2 - Math.PI / 2 + (params.rotation * Math.PI / 180);

    const petalCx = CX + Math.cos(angle) * centerDistance;
    const petalCy = CY + Math.sin(angle) * centerDistance;

    // Petal shape based on params
    const petalRx = petalSize * params.scaleVariance;
    const petalRy = petalSize * params.aspectRatio;
    const cornerR = params.cornerRadius * 0.01 * petalRx;

    if (cornerR > petalRx * 0.4) {
      // Circular petals
      paths.push(`<circle cx="${petalCx}" cy="${petalCy}" r="${petalRx}" fill="currentColor"/>`);
    } else {
      // Rounded rectangle petals
      const rotation = (angle * 180 / Math.PI);
      paths.push(`<rect x="${petalCx - petalRx}" y="${petalCy - petalRy}" width="${petalRx * 2}" height="${petalRy * 2}" rx="${cornerR}" fill="currentColor" transform="rotate(${rotation}, ${petalCx}, ${petalCy})"/>`);
    }
  }

  // Center element
  const centerSize = SIZE * 0.08 * params.scaleVariance;
  if (params.symmetryType === 'radial') {
    paths.push(`<circle cx="${CX}" cy="${CY}" r="${centerSize}" fill="currentColor"/>`);
  } else {
    const centerR = params.cornerRadius * 0.01 * centerSize;
    paths.push(`<rect x="${CX - centerSize}" y="${CY - centerSize}" width="${centerSize * 2}" height="${centerSize * 2}" rx="${centerR}" fill="currentColor"/>`);
  }

  return wrapSvg(paths.join('\n'));
}

// ============================================================================
// 6. SINGLE STROKE
// ============================================================================

function generateSingleStroke(seed: MasterSeed): string {
  const { brandName, params } = seed;
  const paths: string[] = [];

  const initial = brandName.charAt(0).toUpperCase();
  const strokeW = params.strokeWidth;
  const tension = params.curveTension;

  // Generate continuous stroke path based on initial
  const margin = SIZE * 0.15;
  const left = margin;
  const right = SIZE - margin;
  const top = margin;
  const bottom = SIZE - margin;
  const midX = CX;
  const midY = CY;

  let strokePath = '';

  // Letter-inspired continuous stroke
  switch (initial) {
    case 'A':
    case 'V':
    case 'W':
      // Angular continuous stroke
      strokePath = `M ${left} ${bottom} Q ${left + (midX - left) * tension} ${top} ${midX} ${top} Q ${right - (right - midX) * tension} ${top} ${right} ${bottom}`;
      break;
    case 'S':
    case 'C':
      // Curved S-stroke
      strokePath = `M ${right} ${top + 10} Q ${right} ${top} ${midX} ${top} Q ${left} ${top} ${left} ${midY - 10} Q ${left} ${midY + 10} ${midX} ${midY} Q ${right} ${midY} ${right} ${bottom - 10} Q ${right} ${bottom} ${midX} ${bottom} Q ${left} ${bottom} ${left} ${bottom - 10}`;
      break;
    case 'O':
    case 'Q':
      // Circular continuous stroke
      const r = (right - left) / 2;
      strokePath = `M ${midX} ${top} A ${r} ${r * params.aspectRatio} 0 1 1 ${midX} ${bottom} A ${r} ${r * params.aspectRatio} 0 1 1 ${midX} ${top}`;
      break;
    default:
      // Abstract flowing stroke
      const cp1x = left + (right - left) * 0.3;
      const cp1y = top + tension * 20;
      const cp2x = right - (right - left) * 0.3;
      const cp2y = bottom - tension * 20;
      strokePath = `M ${left} ${midY} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${right} ${midY}`;
  }

  paths.push(`<path d="${strokePath}" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="${params.strokeCap}" stroke-linejoin="${params.strokeJoin}"/>`);

  // Add endpoint accents
  if (params.strokeTaper > 50) {
    paths.push(`<circle cx="${left}" cy="${initial === 'A' ? bottom : midY}" r="${strokeW * 0.8}" fill="currentColor"/>`);
    paths.push(`<circle cx="${right}" cy="${initial === 'A' ? bottom : midY}" r="${strokeW * 0.8}" fill="currentColor"/>`);
  }

  return wrapSvg(paths.join('\n'));
}

// ============================================================================
// 7. LETTER EXTRACT
// ============================================================================

function generateLetterExtract(seed: MasterSeed): string {
  const { brandName, params } = seed;
  const paths: string[] = [];

  const initial = brandName.charAt(0).toUpperCase();
  const letterData = LETTER_ANATOMY[initial] || LETTER_ANATOMY['A'];

  const scale = 0.8;
  const offsetX = CX * (1 - scale);
  const offsetY = CY * (1 - scale);

  const strokeW = params.strokeWidth * 1.5;
  const cornerR = params.cornerRadius * 0.3;

  // Extract specific part based on letterPart param
  switch (params.letterPart) {
    case 'apex':
    case 'terminal':
      // Just the apex/top portion
      if (letterData.apex) {
        const apexX = letterData.apex.x * scale + offsetX;
        const apexY = letterData.apex.y * scale + offsetY;

        // Stylized apex mark (like Astro's A)
        const triSize = SIZE * 0.25;
        const innerCutout = triSize * 0.4;

        paths.push(`<path d="M ${CX} ${CY - triSize * 0.7} L ${CX + triSize} ${CY + triSize * 0.5} L ${CX - triSize} ${CY + triSize * 0.5} Z" fill="currentColor"/>`);

        // Inner cutout for negative space
        if (params.interlockDepth > 30) {
          paths.push(`<path d="M ${CX} ${CY + triSize * 0.1} L ${CX + innerCutout} ${CY + triSize * 0.4} L ${CX - innerCutout} ${CY + triSize * 0.4} Z" fill="var(--bg-color, white)"/>`);
        }
      }
      break;

    case 'bowl':
      // Just the bowl portion
      if (letterData.bowls.length > 0) {
        const bowl = letterData.bowls[0];
        const bx = bowl.cx * scale + offsetX;
        const by = bowl.cy * scale + offsetY;
        const brx = bowl.rx * scale * 1.5;
        const bry = bowl.ry * scale * 1.5 * params.aspectRatio;

        paths.push(`<ellipse cx="${CX}" cy="${CY}" rx="${brx}" ry="${bry}" fill="none" stroke="currentColor" stroke-width="${strokeW}"/>`);

        // Add accent
        if (params.elementCount > 2) {
          paths.push(`<circle cx="${CX + brx * 0.6}" cy="${CY}" r="${strokeW}" fill="currentColor"/>`);
        }
      } else {
        // Fallback to circle
        paths.push(`<circle cx="${CX}" cy="${CY}" r="${SIZE * 0.25}" fill="none" stroke="currentColor" stroke-width="${strokeW}"/>`);
      }
      break;

    case 'crossbar':
      // Horizontal bar element
      const barWidth = SIZE * 0.5;
      const barHeight = strokeW * 2;
      const barR = cornerR * barHeight * 0.1;

      paths.push(`<rect x="${CX - barWidth / 2}" y="${CY - barHeight / 2}" width="${barWidth}" height="${barHeight}" rx="${barR}" fill="currentColor"/>`);

      // Vertical accent
      if (params.elementCount > 2) {
        const accentHeight = SIZE * 0.3;
        paths.push(`<rect x="${CX - barHeight / 2}" y="${CY - accentHeight / 2}" width="${barHeight}" height="${accentHeight}" rx="${barR}" fill="currentColor"/>`);
      }
      break;

    case 'stem':
    default:
      // Vertical stem with stylization
      const stemWidth = strokeW * 2;
      const stemHeight = SIZE * 0.5;
      const stemR = params.cornerRadius * 0.01 * stemWidth;

      paths.push(`<rect x="${CX - stemWidth / 2}" y="${CY - stemHeight / 2}" width="${stemWidth}" height="${stemHeight}" rx="${stemR}" fill="currentColor"/>`);

      // Diagonal or horizontal accent
      if (params.elementCount > 2) {
        const accentLen = SIZE * 0.25;
        const accentAngle = params.rotation * 0.5;
        paths.push(`<line x1="${CX}" y1="${CY - stemHeight * 0.3}" x2="${CX + accentLen}" y2="${CY - stemHeight * 0.3 - accentLen * Math.tan(accentAngle * Math.PI / 180)}" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"/>`);
      }
  }

  return wrapSvg(paths.join('\n'), true);
}

// ============================================================================
// 8. GRADIENT GLOW
// ============================================================================

function generateGradientGlow(seed: MasterSeed): string {
  const { params } = seed;
  const paths: string[] = [];

  const gradientId = `glow-${seed.hash.substring(0, 8)}`;
  const glowId = `blur-${seed.hash.substring(0, 8)}`;

  // Define gradient
  const gradAngle = params.gradientAngle;
  const x1 = 50 + Math.cos(gradAngle * Math.PI / 180) * 50;
  const y1 = 50 + Math.sin(gradAngle * Math.PI / 180) * 50;
  const x2 = 50 - Math.cos(gradAngle * Math.PI / 180) * 50;
  const y2 = 50 - Math.sin(gradAngle * Math.PI / 180) * 50;

  paths.push(`<defs>`);

  if (params.gradientType === 'radial') {
    paths.push(`<radialGradient id="${gradientId}" cx="50%" cy="50%" r="${params.gradientSpread * 100}%">`);
    paths.push(`<stop offset="0%" stop-color="currentColor" stop-opacity="${params.fillOpacity}"/>`);
    paths.push(`<stop offset="100%" stop-color="currentColor" stop-opacity="${params.fillOpacity * 0.3}"/>`);
    paths.push(`</radialGradient>`);
  } else {
    paths.push(`<linearGradient id="${gradientId}" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">`);
    paths.push(`<stop offset="0%" stop-color="currentColor" stop-opacity="${params.fillOpacity}"/>`);
    paths.push(`<stop offset="100%" stop-color="currentColor" stop-opacity="${params.fillOpacity * 0.5}"/>`);
    paths.push(`</linearGradient>`);
  }

  // Glow filter
  paths.push(`<filter id="${glowId}" x="-50%" y="-50%" width="200%" height="200%">`);
  paths.push(`<feGaussianBlur in="SourceGraphic" stdDeviation="${params.edgeSoftness * 3}"/>`);
  paths.push(`</filter>`);

  paths.push(`</defs>`);

  // Main shape with glow
  const shapeSize = SIZE * 0.3;
  const cornerR = params.cornerRadius * 0.01 * shapeSize;

  // Glow layer (behind)
  if (params.edgeSoftness > 0.3) {
    paths.push(`<rect x="${CX - shapeSize * 1.1}" y="${CY - shapeSize * 1.1}" width="${shapeSize * 2.2}" height="${shapeSize * 2.2}" rx="${cornerR * 1.5}" fill="url(#${gradientId})" filter="url(#${glowId})" opacity="0.6"/>`);
  }

  // Main shape
  const shapeType = Math.floor(params.shapeComplexity) % 3;

  if (shapeType === 0) {
    // Rounded rectangle
    paths.push(`<rect x="${CX - shapeSize}" y="${CY - shapeSize}" width="${shapeSize * 2}" height="${shapeSize * 2}" rx="${cornerR}" fill="url(#${gradientId})"/>`);
  } else if (shapeType === 1) {
    // Circle
    paths.push(`<circle cx="${CX}" cy="${CY}" r="${shapeSize}" fill="url(#${gradientId})"/>`);
  } else {
    // Rounded triangle
    const h = shapeSize * Math.sqrt(3);
    paths.push(`<path d="M ${CX} ${CY - shapeSize} L ${CX + shapeSize} ${CY + h / 2} L ${CX - shapeSize} ${CY + h / 2} Z" fill="url(#${gradientId})"/>`);
  }

  // Inner highlight
  const highlightSize = shapeSize * 0.4;
  const highlightY = CY - shapeSize * 0.3;
  paths.push(`<ellipse cx="${CX}" cy="${highlightY}" rx="${highlightSize}" ry="${highlightSize * 0.6}" fill="currentColor" opacity="0.3"/>`);

  return wrapSvg(paths.join('\n'));
}

// ============================================================================
// WRAPPER & EXPORTS
// ============================================================================

function wrapSvg(content: string, needsBgVar: boolean = false): string {
  const style = needsBgVar
    ? `<style>svg { --bg-color: white; } @media (prefers-color-scheme: dark) { svg { --bg-color: #1a1a1a; } }</style>`
    : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" fill="none">
  ${style}
  ${content}
</svg>`;
}

/**
 * Main generation function - routes to appropriate algorithm
 */
export function generateFromSeed(seed: MasterSeed): string {
  switch (seed.algorithm) {
    case 'letter-fusion':
      return generateLetterFusion(seed);
    case 'interlocking-geometry':
      return generateInterlockingGeometry(seed);
    case 'negative-space-letter':
      return generateNegativeSpaceLetter(seed);
    case 'monogram-merge':
      return generateMonogramMerge(seed);
    case 'clover-radial':
      return generateCloverRadial(seed);
    case 'single-stroke':
      return generateSingleStroke(seed);
    case 'letter-extract':
      return generateLetterExtract(seed);
    case 'gradient-glow':
      return generateGradientGlow(seed);
    default:
      return generateLetterFusion(seed);
  }
}

export {
  generateLetterFusion,
  generateInterlockingGeometry,
  generateNegativeSpaceLetter,
  generateMonogramMerge,
  generateCloverRadial,
  generateSingleStroke,
  generateLetterExtract,
  generateGradientGlow
};
