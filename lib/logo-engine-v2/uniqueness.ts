
import { InfiniteLogoParams } from './types';

export class UniquenessSystem {
    /**
     * Generates a cryptographically unique Master Seed using SHA-256.
     * Inputs: Brand Params + Random Salt + Timestamp
     */
    static async generateSeed(brandName: string, category: string): Promise<string> {
        const timestamp = Date.now();
        const salt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const input = `${brandName.toLowerCase()}:${category.toLowerCase()}:${timestamp}:${salt}`;

        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Ensure we check collision here in a real app (mocked for now)
        return hashHex;
    }

    /**
     * extracts a deterministic parameter from the seed.
     * @param seed The Master Seed (Hex String)
     * @param offset The bit offset to read from (0-InputLength)
     * @param min Minimum value
     * @param max Maximum value
     * @param step Optional step (e.g. 0.5)
     */
    static getParam(seed: string, offset: number, min: number, max: number, step?: number, isInt: boolean = false): number {
        // use substring based on offset circular
        const start = (offset * 4) % (seed.length - 4);
        const hexChunk = seed.substring(start, start + 4);
        const decVal = parseInt(hexChunk, 16); // 0 - 65535
        const normalized = decVal / 65535; // 0.0 - 1.0

        let result = min + (normalized * (max - min));

        if (step) {
            result = Math.round(result / step) * step;
        }

        if (isInt) {
            return Math.round(result);
        }

        return Number(result.toFixed(2));
    }

    /**
     * Derives the full Parameter Set for a specific algorithm instance
     */
    static deriveParams(seed: string): InfiniteLogoParams {
        return {
            strokeWidth: this.getParam(seed, 1, 1, 8, 0.5),
            cornerRadius: this.getParam(seed, 2, 0, 50, 1),
            rotation: this.getParam(seed, 3, 0, 360, 1),
            curveTension: this.getParam(seed, 4, 0.1, 1.0, 0.1),
            elementCount: this.getParam(seed, 5, 2, 6, 1, true),
            spacingRatio: this.getParam(seed, 6, 0.5, 2.0, 0.1),
            scaleVariance: this.getParam(seed, 7, 0.8, 1.2, 0.1),
            symmetry: this.getSymmetry(seed, 8),
            fillOpacity: this.getParam(seed, 9, 0.3, 1.0, 0.1),
            gradientAngle: this.getParam(seed, 10, 0, 360, 15),
            anatomy: this.getAnatomy(seed, 11),
            cutoutPosition: this.getParam(seed, 12, 0, 11, 1, true),
            interlockDepth: this.getParam(seed, 13, 10, 90, 5),
            strokeTaper: this.getParam(seed, 14, 0, 100, 10)
        };
    }

    private static getSymmetry(seed: string, offset: number): 'bilateral' | 'radial' | 'none' {
        const val = this.getParam(seed, offset, 0, 1);
        if (val < 0.33) return 'bilateral';
        if (val < 0.66) return 'radial';
        return 'none';
    }

    private static getAnatomy(seed: string, offset: number): any[] {
        const parts = ['stem', 'bowl', 'crossbar', 'terminal'];
        // Pick 1-3 parts deterministically
        const count = this.getParam(seed, offset, 1, 3, 1, true);
        const result = [];
        for (let i = 0; i < count; i++) {
            const idx = this.getParam(seed, offset + i + 1, 0, 3, 1, true);
            result.push(parts[idx]);
        }
        return [...new Set(result)]; // Unique
    }
}
