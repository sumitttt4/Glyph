/**
 * Cultural Patterns Algorithm
 *
 * Abstracts and modernizes ancient design wisdom from:
 * - Japanese Mon (family crests) - circular, nature-based, negative space mastery
 * - Islamic Geometry - infinite tessellations, mathematical precision
 * - Celtic Knots - continuous interlacing, no beginning/end
 * - African Adinkra - symbolic shapes, stamped aesthetics
 * - Nordic Runes - angular, minimal, runic line work
 *
 * Each brand name maps to a cultural pattern family based on its characteristics.
 */

import { createHash } from 'crypto';
import { LogoParameters, GeneratedLogo } from '../types';

// Cultural pattern types
type CultureFamily = 'mon' | 'islamic' | 'celtic' | 'adinkra' | 'nordic';

// Pattern analysis for brand name
interface CulturalAnalysis {
  family: CultureFamily;
  complexity: number; // 1-5
  symmetry: 'radial' | 'bilateral' | 'rotational' | 'asymmetric';
  elementsCount: number;
}

/**
 * Analyze brand name to determine cultural pattern family
 */
function analyzeBrandForCulture(brandName: string): CulturalAnalysis {
  const name = brandName.toLowerCase();
  const hash = createHash('sha256').update(brandName).digest();

  // Analyze name characteristics
  const hasRoundLetters = /[oqcgdpb]/.test(name);
  const hasAngularLetters = /[kvwxzy]/.test(name);
  const hasVerticalLetters = /[ilht]/.test(name);
  const letterCount = name.replace(/[^a-z]/g, '').length;

  // Map characteristics to culture
  let family: CultureFamily;

  if (hasRoundLetters && letterCount <= 5) {
    family = 'mon'; // Japanese mon - elegant, circular
  } else if (letterCount > 6 && hasRoundLetters) {
    family = 'islamic'; // Islamic geometry - complex tessellations
  } else if (letterCount >= 4 && letterCount <= 7 && !hasAngularLetters) {
    family = 'celtic'; // Celtic knots - flowing, interlaced
  } else if (hasAngularLetters || letterCount <= 4) {
    family = 'nordic'; // Nordic runes - angular, minimal
  } else {
    family = 'adinkra'; // African adinkra - symbolic, bold
  }

  // Override based on hash for variety
  const familyIndex = hash[0] % 5;
  const families: CultureFamily[] = ['mon', 'islamic', 'celtic', 'adinkra', 'nordic'];
  if (hash[1] > 200) {
    family = families[familyIndex];
  }

  // Determine symmetry
  const symmetryIndex = hash[2] % 4;
  const symmetries: ('radial' | 'bilateral' | 'rotational' | 'asymmetric')[] =
    ['radial', 'bilateral', 'rotational', 'asymmetric'];

  return {
    family,
    complexity: (hash[3] % 4) + 2,
    symmetry: symmetries[symmetryIndex],
    elementsCount: (hash[4] % 5) + 3
  };
}

/**
 * Generate Japanese Mon inspired pattern
 * Circular compositions with nature motifs abstracted to geometry
 */
function generateMonPattern(
  brandName: string,
  cx: number,
  cy: number,
  size: number,
  hash: Buffer
): string {
  const paths: string[] = [];
  const radius = size * 0.4;

  // Mon crests often use circular frames
  const hasFrame = hash[10] > 128;
  if (hasFrame) {
    // Double circle frame (very common in mon)
    paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="currentColor" stroke-width="${size * 0.015}"/>`);
    paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.92}" fill="none" stroke="currentColor" stroke-width="${size * 0.01}"/>`);
  }

  // Central motif - abstracted nature forms
  const motifType = hash[11] % 5;
  const petals = (hash[12] % 5) + 3; // 3-7 petals/sections

  switch (motifType) {
    case 0: {
      // Stylized flower/sakura - petals radiating from center
      for (let i = 0; i < petals; i++) {
        const angle = (i * 2 * Math.PI) / petals - Math.PI / 2;
        const petalLength = radius * 0.6;
        const petalWidth = radius * 0.25;

        const x1 = cx + Math.cos(angle) * petalLength;
        const y1 = cy + Math.sin(angle) * petalLength;
        const cp1x = cx + Math.cos(angle - 0.3) * petalWidth;
        const cp1y = cy + Math.sin(angle - 0.3) * petalWidth;
        const cp2x = cx + Math.cos(angle + 0.3) * petalWidth;
        const cp2y = cy + Math.sin(angle + 0.3) * petalWidth;

        paths.push(`<path d="M ${cx} ${cy} Q ${cp1x} ${cp1y} ${x1} ${y1} Q ${cp2x} ${cp2y} ${cx} ${cy}" fill="currentColor"/>`);
      }
      // Center circle
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.12}" fill="currentColor"/>`);
      break;
    }
    case 1: {
      // Mitsudomoe - triple comma swirl (very traditional)
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI) / 3 - Math.PI / 2;
        const headR = radius * 0.25;
        const headX = cx + Math.cos(angle) * radius * 0.35;
        const headY = cy + Math.sin(angle) * radius * 0.35;

        // Comma head
        paths.push(`<circle cx="${headX}" cy="${headY}" r="${headR}" fill="currentColor"/>`);

        // Comma tail - curved
        const tailAngle = angle + Math.PI * 0.5;
        const tailEndX = cx + Math.cos(tailAngle + 0.8) * radius * 0.7;
        const tailEndY = cy + Math.sin(tailAngle + 0.8) * radius * 0.7;
        const cpX = cx + Math.cos(tailAngle + 0.4) * radius * 0.5;
        const cpY = cy + Math.sin(tailAngle + 0.4) * radius * 0.5;

        paths.push(`<path d="M ${headX} ${headY} Q ${cpX} ${cpY} ${tailEndX} ${tailEndY}" fill="none" stroke="currentColor" stroke-width="${headR * 1.5}" stroke-linecap="round"/>`);
      }
      break;
    }
    case 2: {
      // Kamon wheel - spoked design
      const spokes = petals;
      const innerR = radius * 0.2;
      const outerR = radius * 0.7;

      // Central hub
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${innerR}" fill="none" stroke="currentColor" stroke-width="${size * 0.02}"/>`);

      // Spokes with decorative ends
      for (let i = 0; i < spokes; i++) {
        const angle = (i * 2 * Math.PI) / spokes;
        const x1 = cx + Math.cos(angle) * innerR;
        const y1 = cy + Math.sin(angle) * innerR;
        const x2 = cx + Math.cos(angle) * outerR;
        const y2 = cy + Math.sin(angle) * outerR;

        paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${size * 0.025}"/>`);

        // Diamond end
        const dSize = radius * 0.08;
        paths.push(`<path d="M ${x2} ${y2 - dSize} L ${x2 + dSize} ${y2} L ${x2} ${y2 + dSize} L ${x2 - dSize} ${y2} Z" fill="currentColor" transform="rotate(${(angle * 180) / Math.PI}, ${x2}, ${y2})"/>`);
      }
      break;
    }
    case 3: {
      // Negative space mon - circle with cutouts
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.7}" fill="currentColor"/>`);

      // Cut out shapes
      for (let i = 0; i < petals; i++) {
        const angle = (i * 2 * Math.PI) / petals;
        const cutX = cx + Math.cos(angle) * radius * 0.35;
        const cutY = cy + Math.sin(angle) * radius * 0.35;
        const cutR = radius * 0.18;

        // Use mask or just overlay with background color (simplified)
        paths.push(`<circle cx="${cutX}" cy="${cutY}" r="${cutR}" fill="var(--bg-color, white)"/>`);
      }
      // Center cutout
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.15}" fill="var(--bg-color, white)"/>`);
      break;
    }
    default: {
      // Crane/bird abstraction - angular wings
      const wingSpan = radius * 0.8;
      paths.push(`<path d="M ${cx - wingSpan} ${cy + wingSpan * 0.3} Q ${cx - wingSpan * 0.5} ${cy - wingSpan * 0.2} ${cx} ${cy} Q ${cx + wingSpan * 0.5} ${cy - wingSpan * 0.2} ${cx + wingSpan} ${cy + wingSpan * 0.3}" fill="none" stroke="currentColor" stroke-width="${size * 0.03}" stroke-linecap="round"/>`);
      paths.push(`<circle cx="${cx}" cy="${cy - radius * 0.2}" r="${radius * 0.1}" fill="currentColor"/>`);
      paths.push(`<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + radius * 0.4}" stroke="currentColor" stroke-width="${size * 0.025}"/>`);
    }
  }

  return paths.join('\n');
}

/**
 * Generate Islamic Geometry inspired pattern
 * Infinite tessellations, stars, mathematical precision
 */
function generateIslamicPattern(
  brandName: string,
  cx: number,
  cy: number,
  size: number,
  hash: Buffer
): string {
  const paths: string[] = [];
  const radius = size * 0.4;

  // Islamic patterns often based on star polygons
  const starPoints = [6, 8, 10, 12][hash[10] % 4];
  const layers = (hash[11] % 3) + 2;

  // Generate star polygon
  const outerPoints: { x: number; y: number }[] = [];
  const innerPoints: { x: number; y: number }[] = [];

  for (let i = 0; i < starPoints; i++) {
    const angle = (i * 2 * Math.PI) / starPoints - Math.PI / 2;
    const innerAngle = angle + Math.PI / starPoints;

    outerPoints.push({
      x: cx + Math.cos(angle) * radius,
      y: cy + Math.sin(angle) * radius
    });
    innerPoints.push({
      x: cx + Math.cos(innerAngle) * radius * 0.4,
      y: cy + Math.sin(innerAngle) * radius * 0.4
    });
  }

  // Create interlocking star
  let starPath = `M ${outerPoints[0].x} ${outerPoints[0].y}`;
  for (let i = 0; i < starPoints; i++) {
    const nextI = (i + 1) % starPoints;
    starPath += ` L ${innerPoints[i].x} ${innerPoints[i].y}`;
    starPath += ` L ${outerPoints[nextI].x} ${outerPoints[nextI].y}`;
  }
  starPath += ' Z';
  paths.push(`<path d="${starPath}" fill="none" stroke="currentColor" stroke-width="${size * 0.015}"/>`);

  // Add interlacing lines (key feature of Islamic geometry)
  for (let i = 0; i < starPoints; i++) {
    const skip = Math.floor(starPoints / 3);
    const targetI = (i + skip) % starPoints;

    paths.push(`<line x1="${outerPoints[i].x}" y1="${outerPoints[i].y}" x2="${outerPoints[targetI].x}" y2="${outerPoints[targetI].y}" stroke="currentColor" stroke-width="${size * 0.01}" opacity="0.6"/>`);
  }

  // Nested layers
  for (let layer = 1; layer < layers; layer++) {
    const layerScale = 1 - layer * 0.25;
    const layerR = radius * layerScale;

    let layerPath = 'M ';
    for (let i = 0; i < starPoints; i++) {
      const angle = (i * 2 * Math.PI) / starPoints - Math.PI / 2;
      const x = cx + Math.cos(angle) * layerR;
      const y = cy + Math.sin(angle) * layerR;
      layerPath += i === 0 ? `${x} ${y}` : ` L ${x} ${y}`;
    }
    layerPath += ' Z';
    paths.push(`<path d="${layerPath}" fill="none" stroke="currentColor" stroke-width="${size * 0.01}"/>`);
  }

  // Central rosette
  const rosetteR = radius * 0.15;
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${rosetteR}" fill="currentColor"/>`);

  // Radiating lines from center
  for (let i = 0; i < starPoints * 2; i++) {
    const angle = (i * Math.PI) / starPoints;
    const x2 = cx + Math.cos(angle) * radius * 0.3;
    const y2 = cy + Math.sin(angle) * radius * 0.3;
    paths.push(`<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${size * 0.008}"/>`);
  }

  return paths.join('\n');
}

/**
 * Generate Celtic Knot inspired pattern
 * Continuous interlacing with no beginning or end
 */
function generateCelticPattern(
  brandName: string,
  cx: number,
  cy: number,
  size: number,
  hash: Buffer
): string {
  const paths: string[] = [];
  const radius = size * 0.35;

  const knotType = hash[10] % 4;
  const strokeWidth = size * 0.025;

  switch (knotType) {
    case 0: {
      // Triquetra (Trinity knot)
      const points = 3;
      for (let i = 0; i < points; i++) {
        const angle1 = (i * 2 * Math.PI) / points - Math.PI / 2;
        const angle2 = ((i + 1) * 2 * Math.PI) / points - Math.PI / 2;

        const x1 = cx + Math.cos(angle1) * radius;
        const y1 = cy + Math.sin(angle1) * radius;
        const x2 = cx + Math.cos(angle2) * radius;
        const y2 = cy + Math.sin(angle2) * radius;

        // Curved arc that creates interlocking effect
        const midAngle = (angle1 + angle2) / 2;
        const cpDist = radius * 0.8;
        const cpX = cx + Math.cos(midAngle) * cpDist;
        const cpY = cy + Math.sin(midAngle) * cpDist;

        paths.push(`<path d="M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

        // Inner curves for interlacing
        const innerR = radius * 0.5;
        const ix1 = cx + Math.cos(angle1) * innerR;
        const iy1 = cy + Math.sin(angle1) * innerR;
        const ix2 = cx + Math.cos(angle2) * innerR;
        const iy2 = cy + Math.sin(angle2) * innerR;

        paths.push(`<path d="M ${ix1} ${iy1} Q ${cx} ${cy} ${ix2} ${iy2}" fill="none" stroke="currentColor" stroke-width="${strokeWidth * 0.7}"/>`);
      }
      // Center point
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${strokeWidth}" fill="currentColor"/>`);
      break;
    }
    case 1: {
      // Quaternary knot (4-fold)
      const loopR = radius * 0.4;

      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const loopCx = cx + Math.cos(angle) * radius * 0.4;
        const loopCy = cy + Math.sin(angle) * radius * 0.4;

        // Each loop
        paths.push(`<circle cx="${loopCx}" cy="${loopCy}" r="${loopR}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

        // Connecting bands
        const nextAngle = ((i + 1) * Math.PI) / 2;
        const nx = cx + Math.cos(nextAngle) * radius * 0.4;
        const ny = cy + Math.sin(nextAngle) * radius * 0.4;

        const midX = (loopCx + nx) / 2;
        const midY = (loopCy + ny) / 2;

        paths.push(`<line x1="${loopCx}" y1="${loopCy}" x2="${midX}" y2="${midY}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      }
      break;
    }
    case 2: {
      // Spiral triskelion
      for (let i = 0; i < 3; i++) {
        const startAngle = (i * 2 * Math.PI) / 3;
        const spiralPath: string[] = [];

        for (let t = 0; t <= 1; t += 0.05) {
          const angle = startAngle + t * Math.PI * 1.5;
          const r = radius * (0.1 + t * 0.6);
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;

          if (t === 0) {
            spiralPath.push(`M ${x} ${y}`);
          } else {
            spiralPath.push(`L ${x} ${y}`);
          }
        }

        paths.push(`<path d="${spiralPath.join(' ')}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round"/>`);
      }
      break;
    }
    default: {
      // Endless knot (simplified)
      const w = radius * 1.5;
      const h = radius * 1.2;

      // Outer rectangle with rounded corners
      paths.push(`<rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="${radius * 0.2}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

      // Inner crossings
      const gap = radius * 0.3;
      paths.push(`<line x1="${cx - w / 2 + gap}" y1="${cy}" x2="${cx + w / 2 - gap}" y2="${cy}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      paths.push(`<line x1="${cx}" y1="${cy - h / 2 + gap}" x2="${cx}" y2="${cy + h / 2 - gap}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

      // Corner loops
      const cornerR = radius * 0.15;
      const corners = [
        { x: cx - w / 2 + gap, y: cy - h / 2 + gap },
        { x: cx + w / 2 - gap, y: cy - h / 2 + gap },
        { x: cx + w / 2 - gap, y: cy + h / 2 - gap },
        { x: cx - w / 2 + gap, y: cy + h / 2 - gap }
      ];
      corners.forEach(c => {
        paths.push(`<circle cx="${c.x}" cy="${c.y}" r="${cornerR}" fill="currentColor"/>`);
      });
    }
  }

  return paths.join('\n');
}

/**
 * Generate African Adinkra inspired pattern
 * Bold symbolic shapes, often stamped/geometric
 */
function generateAdinkraPattern(
  brandName: string,
  cx: number,
  cy: number,
  size: number,
  hash: Buffer
): string {
  const paths: string[] = [];
  const radius = size * 0.35;

  const symbolType = hash[10] % 5;
  const strokeWidth = size * 0.03;

  switch (symbolType) {
    case 0: {
      // Gye Nyame (supremacy symbol) - abstracted
      // Curved S-shape with extensions
      paths.push(`<path d="M ${cx - radius} ${cy - radius * 0.3} Q ${cx - radius * 0.5} ${cy - radius * 0.8} ${cx} ${cy - radius * 0.5} T ${cx + radius} ${cy - radius * 0.3}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round"/>`);
      paths.push(`<path d="M ${cx - radius} ${cy + radius * 0.3} Q ${cx - radius * 0.5} ${cy + radius * 0.8} ${cx} ${cy + radius * 0.5} T ${cx + radius} ${cy + radius * 0.3}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round"/>`);

      // Center diamond
      const dSize = radius * 0.3;
      paths.push(`<path d="M ${cx} ${cy - dSize} L ${cx + dSize} ${cy} L ${cx} ${cy + dSize} L ${cx - dSize} ${cy} Z" fill="currentColor"/>`);
      break;
    }
    case 1: {
      // Sankofa (return and retrieve) - heart-like bird shape
      paths.push(`<path d="M ${cx} ${cy + radius * 0.5} Q ${cx - radius} ${cy + radius * 0.2} ${cx - radius * 0.8} ${cy - radius * 0.3} Q ${cx - radius * 0.5} ${cy - radius * 0.8} ${cx} ${cy - radius * 0.4} Q ${cx + radius * 0.5} ${cy - radius * 0.8} ${cx + radius * 0.8} ${cy - radius * 0.3} Q ${cx + radius} ${cy + radius * 0.2} ${cx} ${cy + radius * 0.5} Z" fill="currentColor"/>`);

      // Eye/center accent
      paths.push(`<circle cx="${cx}" cy="${cy - radius * 0.1}" r="${radius * 0.12}" fill="var(--bg-color, white)"/>`);
      break;
    }
    case 2: {
      // Dwennimmen (ram's horns) - strength symbol
      // Two spiraling horns
      const hornPath = (dir: number) => {
        let d = `M ${cx} ${cy}`;
        for (let t = 0; t <= 1; t += 0.1) {
          const angle = t * Math.PI * 1.2;
          const r = radius * (0.2 + t * 0.6);
          const x = cx + dir * Math.cos(angle) * r;
          const y = cy - Math.sin(angle) * r * 0.8;
          d += ` L ${x} ${y}`;
        }
        return d;
      };

      paths.push(`<path d="${hornPath(1)}" fill="none" stroke="currentColor" stroke-width="${strokeWidth * 1.5}" stroke-linecap="round"/>`);
      paths.push(`<path d="${hornPath(-1)}" fill="none" stroke="currentColor" stroke-width="${strokeWidth * 1.5}" stroke-linecap="round"/>`);

      // Center connection
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.15}" fill="currentColor"/>`);
      break;
    }
    case 3: {
      // Adinkrahene (chief of symbols) - concentric circles with rays
      const rings = 3;
      for (let i = 0; i < rings; i++) {
        const r = radius * (0.3 + i * 0.25);
        paths.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="${strokeWidth * 0.8}"/>`);
      }

      // Cross rays
      const rayLen = radius * 0.9;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const x = cx + Math.cos(angle) * rayLen;
        const y = cy + Math.sin(angle) * rayLen;
        paths.push(`<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      }
      break;
    }
    default: {
      // Funtunfunefu (unity) - two linked forms
      const offset = radius * 0.4;

      // Two interlocking crescents
      paths.push(`<path d="M ${cx - offset} ${cy - radius * 0.6} A ${radius * 0.6} ${radius * 0.6} 0 1 1 ${cx - offset} ${cy + radius * 0.6}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      paths.push(`<path d="M ${cx + offset} ${cy - radius * 0.6} A ${radius * 0.6} ${radius * 0.6} 0 1 0 ${cx + offset} ${cy + radius * 0.6}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

      // Connecting bridge
      paths.push(`<line x1="${cx - offset}" y1="${cy}" x2="${cx + offset}" y2="${cy}" stroke="currentColor" stroke-width="${strokeWidth * 1.5}"/>`);

      // End dots
      paths.push(`<circle cx="${cx - offset}" cy="${cy - radius * 0.6}" r="${strokeWidth}" fill="currentColor"/>`);
      paths.push(`<circle cx="${cx - offset}" cy="${cy + radius * 0.6}" r="${strokeWidth}" fill="currentColor"/>`);
      paths.push(`<circle cx="${cx + offset}" cy="${cy - radius * 0.6}" r="${strokeWidth}" fill="currentColor"/>`);
      paths.push(`<circle cx="${cx + offset}" cy="${cy + radius * 0.6}" r="${strokeWidth}" fill="currentColor"/>`);
    }
  }

  return paths.join('\n');
}

/**
 * Generate Nordic Rune inspired pattern
 * Angular, minimal, runic line work
 */
function generateNordicPattern(
  brandName: string,
  cx: number,
  cy: number,
  size: number,
  hash: Buffer
): string {
  const paths: string[] = [];
  const radius = size * 0.35;
  const strokeWidth = size * 0.035;

  const runeType = hash[10] % 5;

  switch (runeType) {
    case 0: {
      // Aegishjalmur (Helm of Awe) - 8-armed protection symbol
      const arms = 8;
      for (let i = 0; i < arms; i++) {
        const angle = (i * 2 * Math.PI) / arms;
        const endX = cx + Math.cos(angle) * radius;
        const endY = cy + Math.sin(angle) * radius;

        // Main arm
        paths.push(`<line x1="${cx}" y1="${cy}" x2="${endX}" y2="${endY}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

        // Trident end
        const tSize = radius * 0.2;
        const perpAngle = angle + Math.PI / 2;
        const tBase = 0.7;
        const tx = cx + Math.cos(angle) * radius * tBase;
        const ty = cy + Math.sin(angle) * radius * tBase;

        paths.push(`<line x1="${tx}" y1="${ty}" x2="${tx + Math.cos(perpAngle) * tSize}" y2="${ty + Math.sin(perpAngle) * tSize}" stroke="currentColor" stroke-width="${strokeWidth * 0.7}"/>`);
        paths.push(`<line x1="${tx}" y1="${ty}" x2="${tx - Math.cos(perpAngle) * tSize}" y2="${ty - Math.sin(perpAngle) * tSize}" stroke="currentColor" stroke-width="${strokeWidth * 0.7}"/>`);
      }

      // Center circle
      paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.1}" fill="currentColor"/>`);
      break;
    }
    case 1: {
      // Vegvisir (wayfinder) - simplified compass-like
      const arms = 8;
      for (let i = 0; i < arms; i++) {
        const angle = (i * 2 * Math.PI) / arms;
        const len = i % 2 === 0 ? radius : radius * 0.7;
        const endX = cx + Math.cos(angle) * len;
        const endY = cy + Math.sin(angle) * len;

        paths.push(`<line x1="${cx}" y1="${cy}" x2="${endX}" y2="${endY}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

        // End decoration (alternating)
        if (i % 2 === 0) {
          const dotR = strokeWidth * 1.2;
          paths.push(`<circle cx="${endX}" cy="${endY}" r="${dotR}" fill="currentColor"/>`);
        } else {
          // Fork
          const fSize = radius * 0.12;
          paths.push(`<line x1="${endX - fSize}" y1="${endY - fSize}" x2="${endX + fSize}" y2="${endY + fSize}" stroke="currentColor" stroke-width="${strokeWidth * 0.6}"/>`);
        }
      }
      break;
    }
    case 2: {
      // Valknut (three interlocked triangles)
      const triSize = radius * 0.5;
      const angles = [0, 2 * Math.PI / 3, 4 * Math.PI / 3];

      angles.forEach((baseAngle, idx) => {
        const offset = idx * radius * 0.15;
        const points: { x: number; y: number }[] = [];

        for (let i = 0; i < 3; i++) {
          const angle = baseAngle + (i * 2 * Math.PI) / 3 - Math.PI / 2;
          points.push({
            x: cx + Math.cos(angle) * triSize + Math.cos(baseAngle) * offset * 0.3,
            y: cy + Math.sin(angle) * triSize + Math.sin(baseAngle) * offset * 0.3
          });
        }

        paths.push(`<path d="M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y} L ${points[2].x} ${points[2].y} Z" fill="none" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      });
      break;
    }
    case 3: {
      // Simplified Yggdrasil (world tree) - vertical with branches
      // Main trunk
      paths.push(`<line x1="${cx}" y1="${cy - radius}" x2="${cx}" y2="${cy + radius}" stroke="currentColor" stroke-width="${strokeWidth * 1.5}"/>`);

      // Branches (angular)
      const branchLevels = 3;
      for (let i = 0; i < branchLevels; i++) {
        const y = cy - radius + (i + 1) * (radius * 0.5);
        const branchLen = radius * (0.5 - i * 0.1);

        paths.push(`<line x1="${cx}" y1="${y}" x2="${cx - branchLen}" y2="${y - branchLen * 0.5}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
        paths.push(`<line x1="${cx}" y1="${y}" x2="${cx + branchLen}" y2="${y - branchLen * 0.5}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      }

      // Roots
      const rootY = cy + radius * 0.5;
      paths.push(`<line x1="${cx}" y1="${rootY}" x2="${cx - radius * 0.4}" y2="${cy + radius}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      paths.push(`<line x1="${cx}" y1="${rootY}" x2="${cx + radius * 0.4}" y2="${cy + radius}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      break;
    }
    default: {
      // Abstract runic letters composition
      const w = radius * 0.3;
      const h = radius * 0.8;

      // Two runic letter forms side by side
      // Left: F-rune (Fehu)
      paths.push(`<line x1="${cx - w}" y1="${cy - h}" x2="${cx - w}" y2="${cy + h}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      paths.push(`<line x1="${cx - w}" y1="${cy - h}" x2="${cx}" y2="${cy - h * 0.5}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      paths.push(`<line x1="${cx - w}" y1="${cy - h * 0.3}" x2="${cx}" y2="${cy}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);

      // Right: A-rune (Ansuz)
      paths.push(`<line x1="${cx + w}" y1="${cy - h}" x2="${cx + w}" y2="${cy + h}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      paths.push(`<line x1="${cx + w}" y1="${cy - h * 0.3}" x2="${cx + w * 1.8}" y2="${cy - h}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
      paths.push(`<line x1="${cx + w}" y1="${cy + h * 0.1}" x2="${cx + w * 1.8}" y2="${cy - h * 0.3}" stroke="currentColor" stroke-width="${strokeWidth}"/>`);
    }
  }

  return paths.join('\n');
}

/**
 * Main Cultural Patterns generation function
 */
export function generateCulturalPatterns(
  params: LogoParameters
): GeneratedLogo[] {
  const logos: GeneratedLogo[] = [];
  const brandName = params.brandName || 'Brand';
  const hash = createHash('sha256').update(brandName).digest();

  const size = 100;
  const cx = size / 2;
  const cy = size / 2;

  // Analyze brand to determine primary culture
  const analysis = analyzeBrandForCulture(brandName);

  // Generate variations from different cultures influenced by the brand
  const cultures: { family: CultureFamily; name: string; description: string }[] = [
    { family: 'mon', name: 'Japanese Mon', description: 'Elegant circular motifs with masterful negative space' },
    { family: 'islamic', name: 'Islamic Geometry', description: 'Infinite mathematical tessellations and star patterns' },
    { family: 'celtic', name: 'Celtic Knot', description: 'Continuous interlacing with no beginning or end' },
    { family: 'adinkra', name: 'African Adinkra', description: 'Bold symbolic shapes with deep meaning' },
    { family: 'nordic', name: 'Nordic Rune', description: 'Angular minimal forms with runic energy' }
  ];

  // Prioritize the analyzed culture but include others
  const orderedCultures = [
    cultures.find(c => c.family === analysis.family)!,
    ...cultures.filter(c => c.family !== analysis.family)
  ];

  orderedCultures.forEach((culture, index) => {
    const variationHash = createHash('sha256')
      .update(brandName + culture.family + index)
      .digest();

    let patternSvg: string;

    switch (culture.family) {
      case 'mon':
        patternSvg = generateMonPattern(brandName, cx, cy, size, variationHash);
        break;
      case 'islamic':
        patternSvg = generateIslamicPattern(brandName, cx, cy, size, variationHash);
        break;
      case 'celtic':
        patternSvg = generateCelticPattern(brandName, cx, cy, size, variationHash);
        break;
      case 'adinkra':
        patternSvg = generateAdinkraPattern(brandName, cx, cy, size, variationHash);
        break;
      case 'nordic':
        patternSvg = generateNordicPattern(brandName, cx, cy, size, variationHash);
        break;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  <style>
    svg { --bg-color: white; }
    @media (prefers-color-scheme: dark) { svg { --bg-color: #1a1a1a; } }
  </style>
  ${patternSvg}
</svg>`;

    logos.push({
      svg,
      concept: `${culture.name} pattern inspired by "${brandName}" - ${culture.description}`,
      algorithm: 'cultural-patterns',
      metadata: {
        brandName,
        style: params.style,
        colorScheme: params.colorScheme,
        cultureFamily: culture.family,
        brandAnalysis: index === 0 ? analysis : undefined
      }
    });
  });

  return logos;
}

/**
 * Generate a single preview for a specific culture
 */
export function generateSingleCulturalPatternPreview(
  brandName: string,
  cultureFamily?: CultureFamily
): GeneratedLogo {
  const hash = createHash('sha256').update(brandName).digest();

  const size = 100;
  const cx = size / 2;
  const cy = size / 2;

  // Use specified culture or analyze brand
  const family = cultureFamily || analyzeBrandForCulture(brandName).family;

  let patternSvg: string;
  let cultureName: string;

  switch (family) {
    case 'mon':
      patternSvg = generateMonPattern(brandName, cx, cy, size, hash);
      cultureName = 'Japanese Mon';
      break;
    case 'islamic':
      patternSvg = generateIslamicPattern(brandName, cx, cy, size, hash);
      cultureName = 'Islamic Geometry';
      break;
    case 'celtic':
      patternSvg = generateCelticPattern(brandName, cx, cy, size, hash);
      cultureName = 'Celtic Knot';
      break;
    case 'adinkra':
      patternSvg = generateAdinkraPattern(brandName, cx, cy, size, hash);
      cultureName = 'African Adinkra';
      break;
    case 'nordic':
      patternSvg = generateNordicPattern(brandName, cx, cy, size, hash);
      cultureName = 'Nordic Rune';
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  <style>
    svg { --bg-color: white; }
    @media (prefers-color-scheme: dark) { svg { --bg-color: #1a1a1a; } }
  </style>
  ${patternSvg}
</svg>`;

  return {
    svg,
    concept: `${cultureName} pattern - modernized ancient wisdom for "${brandName}"`,
    algorithm: 'cultural-patterns',
    metadata: {
      brandName,
      cultureFamily: family
    }
  };
}
