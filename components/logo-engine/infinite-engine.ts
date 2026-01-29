/**
 * Infinite Logo Engine - Main Entry Point
 *
 * Combines uniqueness system with algorithm generation
 * to produce statistically unique logos with quality filtering.
 *
 * Usage:
 *   const logos = await generateInfiniteLogos({ brandName: 'MyBrand' });
 *   // Returns top 5 logos with quality score 85+
 */

import {
  MasterSeed,
  InfiniteAlgorithm,
  UniqueLogoParams,
  GeneratedUniqueLogo,
  generateUniqueSeed,
  generateUniqueLogos,
  calculateQualityScore,
  selectAlgorithmForBrand,
  hashExists,
  storeHash,
  ALL_ALGORITHMS
} from './infinite-uniqueness';

import { generateFromSeed } from './infinite-algorithms';

// Re-export types
export type {
  MasterSeed,
  InfiniteAlgorithm,
  UniqueLogoParams,
  GeneratedUniqueLogo
};

// Re-export utilities
export {
  selectAlgorithmForBrand,
  ALL_ALGORITHMS,
  hashExists,
  storeHash
};

/**
 * Generate infinite unique logos for a brand
 *
 * @param params - Brand name and optional preferences
 * @returns Promise<GeneratedUniqueLogo[]> - Top 5 logos with quality 85+
 */
export async function generateInfiniteLogos(
  params: UniqueLogoParams
): Promise<GeneratedUniqueLogo[]> {
  return generateUniqueLogos(params, generateFromSeed);
}

/**
 * Generate a single logo with specific algorithm
 */
export function generateSingleInfiniteLogo(
  brandName: string,
  algorithm?: InfiniteAlgorithm
): GeneratedUniqueLogo {
  const selectedAlgorithm = algorithm || selectAlgorithmForBrand(brandName);
  const seed = generateUniqueSeed(brandName, selectedAlgorithm);
  const svg = generateFromSeed(seed);
  const { score } = calculateQualityScore(svg, seed.params);

  return {
    svg,
    hash: seed.hash,
    seed,
    qualityScore: score,
    algorithm: selectedAlgorithm,
    concept: getConceptDescription(selectedAlgorithm, seed)
  };
}

/**
 * Generate logos from all algorithms for comparison
 */
export function generateAllAlgorithmSamples(
  brandName: string
): GeneratedUniqueLogo[] {
  return ALL_ALGORITHMS.map(algorithm => {
    const seed = generateUniqueSeed(brandName, algorithm);
    const svg = generateFromSeed(seed);
    const { score } = calculateQualityScore(svg, seed.params);

    return {
      svg,
      hash: seed.hash,
      seed,
      qualityScore: score,
      algorithm,
      concept: getConceptDescription(algorithm, seed)
    };
  });
}

/**
 * Regenerate a logo with new salt (for "try again" feature)
 */
export function regenerateLogo(
  brandName: string,
  algorithm: InfiniteAlgorithm
): GeneratedUniqueLogo {
  // Generate with new random salt
  const seed = generateUniqueSeed(brandName, algorithm);
  const svg = generateFromSeed(seed);
  const { score } = calculateQualityScore(svg, seed.params);

  return {
    svg,
    hash: seed.hash,
    seed,
    qualityScore: score,
    algorithm,
    concept: getConceptDescription(algorithm, seed)
  };
}

/**
 * Check uniqueness across database (placeholder for production)
 */
export function verifyUniqueness(hash: string): boolean {
  return !hashExists(hash);
}

/**
 * Get concept description for logo
 */
function getConceptDescription(algorithm: InfiniteAlgorithm, seed: MasterSeed): string {
  const { params, brandName } = seed;

  const descriptions: Record<InfiniteAlgorithm, string> = {
    'letter-fusion': `"${brandName}" initial fused with ${params.letterPart} element, ${Math.round(params.curveTension * 100)}% organic flow`,
    'interlocking-geometry': `${params.elementCount} interlocking shapes at ${Math.round(params.interlockDepth)}% depth, ${params.symmetryType} balance`,
    'negative-space-letter': `"${brandName[0]}" revealed through negative space, ${Math.round(params.cornerRadius)}% softness`,
    'monogram-merge': `Merged letterforms with shared strokes, ${params.letterWeight} weight`,
    'clover-radial': `${params.elementCount}-fold radial symmetry, ${Math.round(params.spacingRatio * 100)}% spacing`,
    'single-stroke': `Continuous line capturing "${brandName}", ${Math.round(params.curveTension * 100)}% tension`,
    'letter-extract': `Stylized ${params.letterPart} from "${brandName[0]}", architectural precision`,
    'gradient-glow': `Luminous mark with ${params.gradientType} glow at ${Math.round(params.gradientAngle)}°`
  };

  return descriptions[algorithm];
}

/**
 * Get algorithm display info
 */
export function getAlgorithmInfo(algorithm: InfiniteAlgorithm): {
  name: string;
  description: string;
  example: string;
} {
  const info: Record<InfiniteAlgorithm, { name: string; description: string; example: string }> = {
    'letter-fusion': {
      name: 'Letter Fusion',
      description: 'Initial letterform merged with abstract concept',
      example: 'A + leaf, K + arrow (like Atome, Atarpa)'
    },
    'interlocking-geometry': {
      name: 'Interlocking Geometry',
      description: 'Multiple shapes weaving together',
      example: '3 shapes interlocked (like Anchortack)'
    },
    'negative-space-letter': {
      name: 'Negative Space Letter',
      description: 'Letter revealed through strategic cutouts',
      example: 'K from cutouts (like Kompose)'
    },
    'monogram-merge': {
      name: 'Monogram Merge',
      description: 'Two letters sharing common strokes',
      example: 'DB sharing stem (like Dipeook)'
    },
    'clover-radial': {
      name: 'Clover Radial',
      description: 'Shape repeated with rotational symmetry',
      example: '4-petal clover (like Quanter)'
    },
    'single-stroke': {
      name: 'Single Stroke',
      description: 'Continuous line forming abstract mark',
      example: 'One flowing line (like Artifact)'
    },
    'letter-extract': {
      name: 'Letter Extract',
      description: 'Stylized portion of letterform',
      example: 'A apex triangle (like Astro)'
    },
    'gradient-glow': {
      name: 'Gradient Glow',
      description: 'Shape with luminous inner gradient',
      example: 'Glowing orb (like HaloAI)'
    }
  };

  return info[algorithm];
}

/**
 * Statistics about generated logos (for debugging/analytics)
 */
export function getGenerationStats(): {
  totalGenerated: number;
  uniqueHashes: number;
  collisionRate: number;
} {
  // In production, this would query the database
  return {
    totalGenerated: 0,
    uniqueHashes: 0,
    collisionRate: 0
  };
}
