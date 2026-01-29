/**
 * Motion Frozen Algorithm
 *
 * Captures a moment of dynamic motion in a static mark:
 * - SPLASH - liquid droplet impact, crown formation
 * - EXPLOSION - radial burst, debris scatter
 * - COLLAPSE - implosion, gravity pull
 * - GROWTH - organic expansion, bloom
 * - ORBIT - celestial motion, orbital paths
 * - RIPPLE - wave propagation from center
 * - SHATTER - fragmentation, break apart
 * - SWIRL - vortex, tornado motion
 *
 * Each brand name maps to a motion type and freeze frame based on its energy.
 */

import { createHash } from 'crypto';
import { LogoParameters, GeneratedLogo } from '../types';

// Motion types
type MotionType = 'splash' | 'explosion' | 'collapse' | 'growth' | 'orbit' | 'ripple' | 'shatter' | 'swirl';

interface MotionAnalysis {
  type: MotionType;
  intensity: number; // 0-1 how energetic
  freezeFrame: number; // 0-1 where in the motion to freeze
  particleCount: number;
}

/**
 * Analyze brand name energy to determine motion type
 */
function analyzeBrandMotion(brandName: string): MotionAnalysis {
  const name = brandName.toLowerCase();
  const hash = createHash('sha256').update(brandName).digest();

  // Analyze name characteristics for energy
  const hasExplosiveConsonants = /[pbdtkg]/.test(name); // plosives
  const hasSoftSounds = /[flmnsw]/.test(name); // soft consonants
  const hasSharpSounds = /[xzckq]/.test(name);
  const vowelCount = (name.match(/[aeiou]/g) || []).length;
  const length = name.length;

  // Map to motion type
  let type: MotionType;

  if (hasExplosiveConsonants && hasSharpSounds) {
    type = 'explosion';
  } else if (hasSoftSounds && vowelCount > length * 0.4) {
    type = 'growth';
  } else if (hasSharpSounds && length <= 5) {
    type = 'shatter';
  } else if (hasSoftSounds && !hasExplosiveConsonants) {
    type = 'swirl';
  } else if (vowelCount >= 3) {
    type = 'ripple';
  } else if (length > 7) {
    type = 'orbit';
  } else if (hasExplosiveConsonants) {
    type = 'splash';
  } else {
    type = 'collapse';
  }

  // Allow hash to override for variety
  const types: MotionType[] = ['splash', 'explosion', 'collapse', 'growth', 'orbit', 'ripple', 'shatter', 'swirl'];
  if (hash[0] > 220) {
    type = types[hash[1] % types.length];
  }

  return {
    type,
    intensity: 0.4 + (hash[2] / 255) * 0.5,
    freezeFrame: 0.3 + (hash[3] / 255) * 0.5,
    particleCount: 5 + (hash[4] % 10)
  };
}

/**
 * Generate splash/droplet impact frozen in time
 */
function generateSplash(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  freezeFrame: number
): string {
  const paths: string[] = [];
  const radius = size * 0.35;

  // Crown formation from splash
  const crownPoints = 5 + (hash[10] % 4);
  const crownHeight = radius * (0.5 + freezeFrame * 0.5);

  // Crown peaks
  for (let i = 0; i < crownPoints; i++) {
    const angle = (i * 2 * Math.PI) / crownPoints - Math.PI / 2;
    const baseX = cx + Math.cos(angle) * radius * 0.5;
    const baseY = cy + radius * 0.2;

    const peakHeight = crownHeight * (0.8 + Math.sin(hash[11 + i] / 255 * Math.PI) * 0.4);
    const peakX = cx + Math.cos(angle) * radius * (0.6 + freezeFrame * 0.2);
    const peakY = cy - peakHeight;

    // Curved crown spike
    const cpX = (baseX + peakX) / 2 + Math.cos(angle) * radius * 0.2;
    const cpY = (baseY + peakY) / 2;

    paths.push(`<path d="M ${baseX} ${baseY} Q ${cpX} ${cpY} ${peakX} ${peakY}" fill="none" stroke="currentColor" stroke-width="${size * 0.02}" stroke-linecap="round"/>`);

    // Droplet at peak
    if (freezeFrame > 0.5) {
      const dropR = size * 0.02 * (1 - (i / crownPoints) * 0.3);
      const dropY = peakY - size * 0.03;
      paths.push(`<circle cx="${peakX}" cy="${dropY}" r="${dropR}" fill="currentColor"/>`);
    }
  }

  // Base pool/ring
  const poolRx = radius * 0.6;
  const poolRy = radius * 0.15;
  paths.push(`<ellipse cx="${cx}" cy="${cy + radius * 0.3}" rx="${poolRx}" ry="${poolRy}" fill="none" stroke="currentColor" stroke-width="${size * 0.015}"/>`);

  // Outer ripple
  paths.push(`<ellipse cx="${cx}" cy="${cy + radius * 0.35}" rx="${poolRx * 1.3}" ry="${poolRy * 1.2}" fill="none" stroke="currentColor" stroke-width="${size * 0.008}" opacity="0.6"/>`);

  // Flying droplets
  const droplets = 3 + (hash[15] % 4);
  for (let i = 0; i < droplets; i++) {
    const angle = hash[16 + i] / 255 * Math.PI * 2;
    const dist = radius * (0.7 + (hash[20 + i] / 255) * 0.4);
    const dropX = cx + Math.cos(angle) * dist;
    const dropY = cy - Math.sin(Math.abs(angle)) * dist * 0.5;
    const dropR = size * 0.015 * (1 - i * 0.2);

    paths.push(`<circle cx="${dropX}" cy="${dropY}" r="${dropR}" fill="currentColor"/>`);
  }

  return paths.join('\n');
}

/**
 * Generate explosion burst frozen in time
 */
function generateExplosion(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  intensity: number
): string {
  const paths: string[] = [];
  const radius = size * 0.4;

  // Central core (bright spot)
  const coreR = radius * 0.15 * (1 - intensity * 0.3);
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${coreR}" fill="currentColor"/>`);

  // Radiating burst lines
  const rays = 8 + (hash[10] % 8);
  for (let i = 0; i < rays; i++) {
    const angle = (i * 2 * Math.PI) / rays + (hash[11] / 255) * 0.2;
    const rayLength = radius * (0.5 + (hash[12 + i] / 255) * 0.5);

    const startR = coreR * 1.2;
    const x1 = cx + Math.cos(angle) * startR;
    const y1 = cy + Math.sin(angle) * startR;
    const x2 = cx + Math.cos(angle) * rayLength;
    const y2 = cy + Math.sin(angle) * rayLength;

    // Tapered ray
    const strokeW = size * 0.03 * (1 - (i % 2) * 0.4);
    paths.push(`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round"/>`);
  }

  // Debris particles
  const debris = 6 + (hash[20] % 6);
  for (let i = 0; i < debris; i++) {
    const angle = hash[21 + i] / 255 * Math.PI * 2;
    const dist = radius * (0.6 + (hash[27 + i] / 255) * 0.4);
    const debrisX = cx + Math.cos(angle) * dist;
    const debrisY = cy + Math.sin(angle) * dist;

    // Irregular debris shapes
    if (i % 3 === 0) {
      const debrisSize = size * 0.025;
      paths.push(`<rect x="${debrisX - debrisSize / 2}" y="${debrisY - debrisSize / 2}" width="${debrisSize}" height="${debrisSize}" fill="currentColor" transform="rotate(${hash[33 + i] % 45}, ${debrisX}, ${debrisY})"/>`);
    } else if (i % 3 === 1) {
      paths.push(`<circle cx="${debrisX}" cy="${debrisY}" r="${size * 0.015}" fill="currentColor"/>`);
    } else {
      const triSize = size * 0.02;
      paths.push(`<path d="M ${debrisX} ${debrisY - triSize} L ${debrisX + triSize} ${debrisY + triSize} L ${debrisX - triSize} ${debrisY + triSize} Z" fill="currentColor"/>`);
    }
  }

  // Shockwave ring
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${radius * 0.8}" fill="none" stroke="currentColor" stroke-width="${size * 0.008}" opacity="0.5" stroke-dasharray="${size * 0.03} ${size * 0.02}"/>`);

  return paths.join('\n');
}

/**
 * Generate collapse/implosion frozen in time
 */
function generateCollapse(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  freezeFrame: number
): string {
  const paths: string[] = [];
  const radius = size * 0.4;

  // Converging elements being pulled to center
  const elements = 6 + (hash[10] % 5);
  const collapseProgress = freezeFrame;

  for (let i = 0; i < elements; i++) {
    const angle = (i * 2 * Math.PI) / elements;
    const startDist = radius;
    const currentDist = startDist * (1 - collapseProgress * 0.6);

    const x = cx + Math.cos(angle) * currentDist;
    const y = cy + Math.sin(angle) * currentDist;

    // Element with motion trail
    const trailLength = radius * 0.3 * collapseProgress;
    const trailX = cx + Math.cos(angle) * (currentDist + trailLength);
    const trailY = cy + Math.sin(angle) * (currentDist + trailLength);

    // Trail line (motion blur effect)
    paths.push(`<line x1="${trailX}" y1="${trailY}" x2="${x}" y2="${y}" stroke="currentColor" stroke-width="${size * 0.015}" stroke-linecap="round" opacity="${0.3 + collapseProgress * 0.4}"/>`);

    // Main element
    const elemSize = size * 0.04 * (1 - collapseProgress * 0.3);
    paths.push(`<circle cx="${x}" cy="${y}" r="${elemSize}" fill="currentColor"/>`);
  }

  // Central gravity point
  const gravityR = radius * 0.1 * (1 + collapseProgress * 0.5);
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${gravityR}" fill="currentColor"/>`);

  // Gravitational field lines
  for (let ring = 1; ring <= 3; ring++) {
    const ringR = radius * (0.3 + ring * 0.2) * (1 - collapseProgress * 0.3);
    paths.push(`<circle cx="${cx}" cy="${cy}" r="${ringR}" fill="none" stroke="currentColor" stroke-width="${size * 0.006}" opacity="${0.2 + (3 - ring) * 0.1}" stroke-dasharray="${size * 0.02} ${size * 0.03}"/>`);
  }

  return paths.join('\n');
}

/**
 * Generate organic growth/bloom frozen in time
 */
function generateGrowth(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  freezeFrame: number
): string {
  const paths: string[] = [];
  const radius = size * 0.38;

  // Growing stems/branches
  const branches = 3 + (hash[10] % 3);
  const growthProgress = freezeFrame;

  for (let i = 0; i < branches; i++) {
    const baseAngle = (i * 2 * Math.PI) / branches - Math.PI / 2;
    const branchLength = radius * (0.5 + growthProgress * 0.5);

    // Main branch with curve
    const segments = 10;
    let path = `M ${cx} ${cy}`;

    for (let s = 1; s <= segments; s++) {
      const t = s / segments;
      const segLength = branchLength * t;
      const curve = Math.sin(t * Math.PI * 2 + hash[11 + i]) * radius * 0.1;

      const x = cx + Math.cos(baseAngle + curve * 0.02) * segLength;
      const y = cy + Math.sin(baseAngle + curve * 0.02) * segLength - curve * t;

      path += ` L ${x} ${y}`;
    }

    paths.push(`<path d="${path}" fill="none" stroke="currentColor" stroke-width="${size * 0.025}" stroke-linecap="round"/>`);

    // Buds/leaves at tip
    if (growthProgress > 0.4) {
      const tipX = cx + Math.cos(baseAngle) * branchLength;
      const tipY = cy + Math.sin(baseAngle) * branchLength;
      const budSize = radius * 0.15 * (growthProgress - 0.4) * 2;

      // Unfurling leaf shape
      paths.push(`<ellipse cx="${tipX}" cy="${tipY}" rx="${budSize}" ry="${budSize * 0.6}" fill="currentColor" transform="rotate(${(baseAngle * 180) / Math.PI}, ${tipX}, ${tipY})"/>`);
    }

    // Sub-branches
    if (growthProgress > 0.3) {
      const subCount = 2;
      for (let j = 0; j < subCount; j++) {
        const subT = 0.4 + j * 0.25;
        const subStartX = cx + Math.cos(baseAngle) * branchLength * subT;
        const subStartY = cy + Math.sin(baseAngle) * branchLength * subT;
        const subAngle = baseAngle + (j % 2 === 0 ? 0.5 : -0.5);
        const subLen = branchLength * 0.3 * (growthProgress - 0.3);

        const subEndX = subStartX + Math.cos(subAngle) * subLen;
        const subEndY = subStartY + Math.sin(subAngle) * subLen;

        paths.push(`<line x1="${subStartX}" y1="${subStartY}" x2="${subEndX}" y2="${subEndY}" stroke="currentColor" stroke-width="${size * 0.015}" stroke-linecap="round"/>`);
      }
    }
  }

  // Root/base
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.04}" fill="currentColor"/>`);

  return paths.join('\n');
}

/**
 * Generate orbital motion frozen in time
 */
function generateOrbit(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  freezeFrame: number
): string {
  const paths: string[] = [];
  const radius = size * 0.38;

  // Central body
  const centerR = radius * 0.12;
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${centerR}" fill="currentColor"/>`);

  // Orbital paths and bodies
  const orbits = 2 + (hash[10] % 2);

  for (let i = 0; i < orbits; i++) {
    const orbitR = radius * (0.4 + i * 0.25);
    const tilt = (hash[11 + i] / 255 - 0.5) * 0.3;

    // Elliptical orbit path
    const rx = orbitR;
    const ry = orbitR * (0.5 + tilt);
    paths.push(`<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="currentColor" stroke-width="${size * 0.008}" opacity="0.4" stroke-dasharray="${size * 0.02} ${size * 0.01}"/>`);

    // Orbiting body at frozen position
    const bodyAngle = freezeFrame * Math.PI * 2 + i * Math.PI * 0.7 + hash[13 + i] / 255;
    const bodyX = cx + Math.cos(bodyAngle) * rx;
    const bodyY = cy + Math.sin(bodyAngle) * ry;
    const bodyR = radius * 0.06 * (1 - i * 0.2);

    paths.push(`<circle cx="${bodyX}" cy="${bodyY}" r="${bodyR}" fill="currentColor"/>`);

    // Motion trail behind orbiting body
    const trailPoints = 8;
    let trailPath = '';
    for (let t = 0; t < trailPoints; t++) {
      const trailAngle = bodyAngle - (t + 1) * 0.15;
      const trailX = cx + Math.cos(trailAngle) * rx;
      const trailY = cy + Math.sin(trailAngle) * ry;

      if (t === 0) {
        trailPath = `M ${trailX} ${trailY}`;
      } else {
        trailPath += ` L ${trailX} ${trailY}`;
      }
    }
    paths.push(`<path d="${trailPath}" fill="none" stroke="currentColor" stroke-width="${size * 0.015}" stroke-linecap="round" opacity="${0.5 - i * 0.15}"/>`);
  }

  // Smaller moons/particles
  const particles = 3 + (hash[20] % 3);
  for (let i = 0; i < particles; i++) {
    const pAngle = hash[21 + i] / 255 * Math.PI * 2;
    const pDist = radius * (0.2 + (hash[24 + i] / 255) * 0.2);
    const pX = cx + Math.cos(pAngle) * pDist;
    const pY = cy + Math.sin(pAngle) * pDist * 0.6;
    paths.push(`<circle cx="${pX}" cy="${pY}" r="${size * 0.015}" fill="currentColor" opacity="0.7"/>`);
  }

  return paths.join('\n');
}

/**
 * Generate ripple wave propagation frozen in time
 */
function generateRipple(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  freezeFrame: number
): string {
  const paths: string[] = [];
  const radius = size * 0.4;

  // Concentric ripple rings
  const rings = 4 + (hash[10] % 3);
  const waveProgress = freezeFrame;

  for (let i = 0; i < rings; i++) {
    const baseR = radius * (0.15 + i * 0.2);
    const ringR = baseR + waveProgress * radius * 0.1;

    // Wave distortion
    const distortion = Math.sin(i * 1.5 + waveProgress * Math.PI * 2) * size * 0.02;
    const strokeW = size * 0.015 * (1 - i / rings * 0.5);
    const opacity = 1 - i / rings * 0.6;

    paths.push(`<circle cx="${cx}" cy="${cy + distortion}" r="${ringR}" fill="none" stroke="currentColor" stroke-width="${strokeW}" opacity="${opacity}"/>`);
  }

  // Impact point
  const impactR = size * 0.04 * (1 - waveProgress * 0.5);
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${impactR}" fill="currentColor"/>`);

  // Water droplets rising from impact
  if (waveProgress > 0.3) {
    const drops = 3;
    for (let i = 0; i < drops; i++) {
      const dropAngle = (i / drops) * Math.PI - Math.PI / 2 + Math.PI / drops / 2;
      const dropHeight = size * 0.15 * (waveProgress - 0.3) * 2;
      const dropX = cx + Math.cos(dropAngle) * size * 0.05;
      const dropY = cy - dropHeight - i * size * 0.03;

      paths.push(`<ellipse cx="${dropX}" cy="${dropY}" rx="${size * 0.012}" ry="${size * 0.018}" fill="currentColor"/>`);
    }
  }

  return paths.join('\n');
}

/**
 * Generate shatter/fragmentation frozen in time
 */
function generateShatter(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  freezeFrame: number
): string {
  const paths: string[] = [];
  const radius = size * 0.35;

  // Original form outline (partially visible)
  const originalR = radius * 0.5;
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${originalR}" fill="none" stroke="currentColor" stroke-width="${size * 0.01}" opacity="0.3" stroke-dasharray="${size * 0.04} ${size * 0.02}"/>`);

  // Shattered fragments flying outward
  const fragments = 7 + (hash[10] % 5);
  const shatterProgress = freezeFrame;

  for (let i = 0; i < fragments; i++) {
    const angle = (i / fragments) * Math.PI * 2 + hash[11 + i] / 255 * 0.3;
    const dist = originalR * (0.3 + shatterProgress * (0.8 + (hash[18 + i] / 255) * 0.5));

    const fragX = cx + Math.cos(angle) * dist;
    const fragY = cy + Math.sin(angle) * dist;

    // Irregular polygon fragment
    const fragSize = size * (0.04 + (hash[25 + i] / 255) * 0.03);
    const vertices = 3 + (hash[32 + i] % 3);

    let fragPath = '';
    for (let v = 0; v < vertices; v++) {
      const vAngle = (v / vertices) * Math.PI * 2;
      const vDist = fragSize * (0.7 + (hash[35 + v] / 255) * 0.6);
      const vx = fragX + Math.cos(vAngle) * vDist;
      const vy = fragY + Math.sin(vAngle) * vDist;

      fragPath += v === 0 ? `M ${vx} ${vy}` : ` L ${vx} ${vy}`;
    }
    fragPath += ' Z';

    // Rotation based on flight
    const rotation = shatterProgress * (hash[40 + i] % 90);
    paths.push(`<path d="${fragPath}" fill="currentColor" transform="rotate(${rotation}, ${fragX}, ${fragY})"/>`);

    // Motion blur line
    if (shatterProgress > 0.2) {
      const blurLen = dist * 0.2;
      const blurX = cx + Math.cos(angle) * (dist - blurLen);
      const blurY = cy + Math.sin(angle) * (dist - blurLen);
      paths.push(`<line x1="${blurX}" y1="${blurY}" x2="${fragX}" y2="${fragY}" stroke="currentColor" stroke-width="${size * 0.008}" opacity="0.3"/>`);
    }
  }

  // Impact crack lines at center
  const cracks = 5;
  for (let i = 0; i < cracks; i++) {
    const angle = (i / cracks) * Math.PI * 2 + 0.3;
    const crackLen = originalR * 0.4;
    const x2 = cx + Math.cos(angle) * crackLen;
    const y2 = cy + Math.sin(angle) * crackLen;
    paths.push(`<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="${size * 0.008}"/>`);
  }

  return paths.join('\n');
}

/**
 * Generate swirl/vortex motion frozen in time
 */
function generateSwirl(
  cx: number,
  cy: number,
  size: number,
  hash: Buffer,
  freezeFrame: number
): string {
  const paths: string[] = [];
  const radius = size * 0.4;

  // Multiple spiral arms
  const arms = 2 + (hash[10] % 2);
  const rotations = 1.5 + freezeFrame;

  for (let arm = 0; arm < arms; arm++) {
    const armOffset = (arm / arms) * Math.PI * 2;
    let spiralPath = '';

    const points = 50;
    for (let i = 0; i <= points; i++) {
      const t = i / points;
      const angle = armOffset + t * Math.PI * 2 * rotations;
      const r = radius * (0.1 + t * 0.8);

      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;

      spiralPath += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }

    // Tapered stroke effect (use opacity gradient simulation)
    paths.push(`<path d="${spiralPath}" fill="none" stroke="currentColor" stroke-width="${size * 0.025}" stroke-linecap="round"/>`);
  }

  // Particles caught in swirl
  const particles = 5 + (hash[15] % 4);
  for (let i = 0; i < particles; i++) {
    const t = (hash[16 + i] / 255);
    const angle = t * Math.PI * 2 * rotations + (hash[20 + i] / 255) * Math.PI;
    const r = radius * (0.2 + t * 0.6);

    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    const pSize = size * 0.015 * (1 - t * 0.5);

    paths.push(`<circle cx="${px}" cy="${py}" r="${pSize}" fill="currentColor"/>`);
  }

  // Eye of the vortex
  paths.push(`<circle cx="${cx}" cy="${cy}" r="${size * 0.04}" fill="currentColor"/>`);

  return paths.join('\n');
}

/**
 * Main Motion Frozen generation function
 */
export function generateMotionFrozen(
  params: LogoParameters
): GeneratedLogo[] {
  const logos: GeneratedLogo[] = [];
  const brandName = params.brandName || 'Brand';
  const hash = createHash('sha256').update(brandName).digest();

  const size = 100;
  const cx = size / 2;
  const cy = size / 2;

  // Analyze brand for motion type
  const analysis = analyzeBrandMotion(brandName);

  // Motion types with descriptions
  const motions: { type: MotionType; name: string; description: string }[] = [
    { type: 'splash', name: 'Splash', description: 'Liquid impact crown formation frozen at peak' },
    { type: 'explosion', name: 'Explosion', description: 'Radial burst with debris scatter' },
    { type: 'collapse', name: 'Collapse', description: 'Gravitational implosion pulling inward' },
    { type: 'growth', name: 'Growth', description: 'Organic bloom and expansion' },
    { type: 'orbit', name: 'Orbit', description: 'Celestial bodies in orbital motion' },
    { type: 'ripple', name: 'Ripple', description: 'Wave propagation from center impact' },
    { type: 'shatter', name: 'Shatter', description: 'Fragmentation with flying debris' },
    { type: 'swirl', name: 'Swirl', description: 'Vortex spiral motion' }
  ];

  // Prioritize analyzed motion but include others
  const orderedMotions = [
    motions.find(m => m.type === analysis.type)!,
    ...motions.filter(m => m.type !== analysis.type).slice(0, 4)
  ];

  orderedMotions.forEach((motion, index) => {
    const variationHash = createHash('sha256')
      .update(brandName + motion.type + index)
      .digest();

    const freezeFrame = index === 0 ? analysis.freezeFrame : (variationHash[5] / 255) * 0.6 + 0.3;
    const intensity = index === 0 ? analysis.intensity : (variationHash[6] / 255) * 0.5 + 0.4;

    let motionSvg: string;

    switch (motion.type) {
      case 'splash':
        motionSvg = generateSplash(cx, cy, size, variationHash, freezeFrame);
        break;
      case 'explosion':
        motionSvg = generateExplosion(cx, cy, size, variationHash, intensity);
        break;
      case 'collapse':
        motionSvg = generateCollapse(cx, cy, size, variationHash, freezeFrame);
        break;
      case 'growth':
        motionSvg = generateGrowth(cx, cy, size, variationHash, freezeFrame);
        break;
      case 'orbit':
        motionSvg = generateOrbit(cx, cy, size, variationHash, freezeFrame);
        break;
      case 'ripple':
        motionSvg = generateRipple(cx, cy, size, variationHash, freezeFrame);
        break;
      case 'shatter':
        motionSvg = generateShatter(cx, cy, size, variationHash, freezeFrame);
        break;
      case 'swirl':
        motionSvg = generateSwirl(cx, cy, size, variationHash, freezeFrame);
        break;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  ${motionSvg}
</svg>`;

    logos.push({
      svg,
      concept: `${motion.name} - ${motion.description} for "${brandName}"`,
      algorithm: 'motion-frozen',
      metadata: {
        brandName,
        style: params.style,
        colorScheme: params.colorScheme,
        motionType: motion.type,
        freezeFrame,
        intensity,
        brandAnalysis: index === 0 ? analysis : undefined
      }
    });
  });

  return logos;
}

/**
 * Generate a single motion preview
 */
export function generateSingleMotionFrozenPreview(
  brandName: string,
  motionType?: MotionType
): GeneratedLogo {
  const hash = createHash('sha256').update(brandName).digest();

  const size = 100;
  const cx = size / 2;
  const cy = size / 2;

  const analysis = analyzeBrandMotion(brandName);
  const type = motionType || analysis.type;

  let motionSvg: string;
  let motionName: string;

  switch (type) {
    case 'splash':
      motionSvg = generateSplash(cx, cy, size, hash, analysis.freezeFrame);
      motionName = 'Splash';
      break;
    case 'explosion':
      motionSvg = generateExplosion(cx, cy, size, hash, analysis.intensity);
      motionName = 'Explosion';
      break;
    case 'collapse':
      motionSvg = generateCollapse(cx, cy, size, hash, analysis.freezeFrame);
      motionName = 'Collapse';
      break;
    case 'growth':
      motionSvg = generateGrowth(cx, cy, size, hash, analysis.freezeFrame);
      motionName = 'Growth';
      break;
    case 'orbit':
      motionSvg = generateOrbit(cx, cy, size, hash, analysis.freezeFrame);
      motionName = 'Orbit';
      break;
    case 'ripple':
      motionSvg = generateRipple(cx, cy, size, hash, analysis.freezeFrame);
      motionName = 'Ripple';
      break;
    case 'shatter':
      motionSvg = generateShatter(cx, cy, size, hash, analysis.freezeFrame);
      motionName = 'Shatter';
      break;
    case 'swirl':
      motionSvg = generateSwirl(cx, cy, size, hash, analysis.freezeFrame);
      motionName = 'Swirl';
      break;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" fill="none">
  ${motionSvg}
</svg>`;

  return {
    svg,
    concept: `${motionName} - dynamic energy frozen in time for "${brandName}"`,
    algorithm: 'motion-frozen',
    metadata: {
      brandName,
      motionType: type,
      freezeFrame: analysis.freezeFrame,
      intensity: analysis.intensity
    }
  };
}
