
import { UniquenessSystem } from './uniqueness';
import { InfiniteLogoResult } from './types';
import { LOGO_LIBRARY } from './algorithms/library';

export class InfiniteLogoEngine {
    static async generateBatch(brandName: string, category: string, count: number = 5): Promise<InfiniteLogoResult[]> {
        const results: InfiniteLogoResult[] = [];

        // We generate extra candidates to allow for future filtering/scoring
        const candidatesCount = Math.max(count, 15);

        for (let i = 0; i < candidatesCount; i++) {
            // Unique seed per candidate (timestamp is static per batch, so use suffix)
            // In real production, we'd use a more robust salt strategy
            const salt = `batch-${i}-${Date.now()}`;
            const seed = await UniquenessSystem.generateSeed(brandName + salt, category);

            const params = UniquenessSystem.deriveParams(seed);

            // Select Algo from Library
            const algoByte = parseInt(seed.substring(0, 2), 16);
            const algoIndex = algoByte % LOGO_LIBRARY.length;
            const algo = LOGO_LIBRARY[algoIndex];

            if (!algo) continue;

            const svg = algo.fn(params, brandName);

            // Quality Score (Simulation: 85-99 based on hash bits)
            // We use bytes 2-3
            const scoreByte = parseInt(seed.substring(2, 4), 16);
            const quality = 85 + (scoreByte % 15); // Range 85 .. 99

            results.push({
                id: seed,
                svg,
                algorithm: algo.name,
                description: algo.description,
                params,
                qualityScore: quality
            } as any); // Type cast for 'description' added
        }

        // Return top 'count' results sorted by quality (or just first N)
        return results.slice(0, count);
    }
}
