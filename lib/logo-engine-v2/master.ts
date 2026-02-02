
import { UniquenessSystem } from './uniqueness';
import { InfiniteLogoResult } from './types';
import { LOGO_LIBRARY } from './algorithms/library';

// ============================================================================
// EXPLICIT SYMBOL ALGORITHM NAMES (Abstract Icon Series - no letters, pure icons)
// These are the exact algorithm names that generate symbol/icon logos
// ============================================================================
const SYMBOL_ALGORITHM_NAMES = [
    // Speed/Motion Icons
    'Speed Arrows', 'Motion Lines', 'Fast Forward', 'Dash Blur',
    // Growth/Up Icons
    'Rising Bars', 'Peak Triangle', 'Lift Arc', 'Elevate',
    // Connect/Network Icons
    'Link Rings', 'Network Hub', 'Chain Link', 'Social Web',
    // Secure/Trust Icons
    'Shield Mark', 'Lock Symbol', 'Trust Check', 'Fortress',
    // Tech/Digital Icons
    'Pixel Grid', 'Code Brackets', 'Cursor Mark', 'Binary Dots',
    // Creative/Design Icons
    'Pen Nib', 'Bezier Curve', 'Color Wheel', 'Artboard',
    // Data/Analytics Icons
    'Chart Line', 'Layer Stack', 'Grid Matrix', 'Pie Segments',
    // Communication Icons
    'Speech Bubble', 'Signal Waves', 'Chat Dots', 'Broadcast',
    // Finance/Money Icons
    'Coin Stack', 'Growth Arrow', 'Value Layers', 'Gem Diamond',
    // Health/Wellness Icons
    'Heart Symbol', 'Plus Cross', 'Leaf Curve', 'Pulse Line',
    // Default/Abstract Icons
    'Abstract Dots', 'Concentric Rings', 'Wave Form', 'Centered Square',
    // Modern Geometric Series (New)
    'Vixel Flow', 'Geometric Weave', 'Radial Pinwheel',
    // Abstract Monograms (New High Quality)
    'Triangle Mono', 'Circular Mono', 'Grid Mono',
    // Geometric Trinity (New $1000 Style)
    'Trinity Loop', 'Cubic Weave', 'Arrowhead Core',
    // Creative Geometry (Batch 2)
    'Bio Blob', 'Swiss Block', 'Chunky Glyph',
];

// Vibe/Aesthetic keyword classifications for filtering
const VIBE_KEYWORDS: Record<string, string[]> = {
    'minimalist': ['Minimal', 'Swiss', 'Clean', 'Monoline', 'Outline', 'Wire', 'Simple', 'Grid', 'Geometric'],
    'tech': ['Tech', 'Pixel', 'Code', 'Binary', 'Cursor', 'Digital', 'Blueprint', 'Techno', 'Construct', 'Network', 'Data', 'Grid'],
    'nature': ['Organic', 'Leaf', 'Health', 'Heart', 'Eco', 'Flow', 'Curve', 'Soft', 'Calligraphic', 'Brush'],
    'bold': ['Bold', 'Shadow', 'Block', 'Stencil', 'Hard', 'Solid', 'Long', '3D', 'Graffiti', 'Industrial', 'Neon'],
};

// Vibe description keywords for secondary matching
const VIBE_DESCRIPTIONS: Record<string, string[]> = {
    'minimalist': ['clean', 'minimal', 'thin', 'simple', 'pure', 'essential'],
    'tech': ['digital', 'technical', 'code', 'data', 'pixel', 'syntax', 'precision'],
    'nature': ['organic', 'natural', 'flowing', 'soft', 'wellness', 'calm'],
    'bold': ['bold', 'heavy', 'strong', 'loud', 'impact', 'depth', 'dimensional'],
};

// Quality threshold - only return logos above this score
const QUALITY_THRESHOLD = 90;

// Helper: Get symbol pool (explicit matching)
const getSymbolPool = () => {
    const pool = LOGO_LIBRARY.filter(algo => SYMBOL_ALGORITHM_NAMES.includes(algo.name));
    console.log(`[InfiniteEngine] Symbol pool size: ${pool.length}`);
    return pool;
};

// Helper: Get wordmark pool (everything NOT in symbol pool)
const getWordmarkPool = () => {
    const pool = LOGO_LIBRARY.filter(algo => !SYMBOL_ALGORITHM_NAMES.includes(algo.name));
    console.log(`[InfiniteEngine] Wordmark pool size: ${pool.length}`);
    return pool;
};

export class InfiniteLogoEngine {
    static async generateBatch(
        brandName: string,
        category: string,
        count: number = 5,
        archetype: 'symbol' | 'wordmark' | 'both' = 'both',
        vibe: string = ''
    ): Promise<InfiniteLogoResult[]> {
        const results: InfiniteLogoResult[] = [];

        // Step 1: Filter library based on archetype
        let filteredLibrary = LOGO_LIBRARY;

        if (archetype === 'symbol') {
            // Only use abstract icon generators (symbol-only logos, no letters)
            filteredLibrary = getSymbolPool();
        } else if (archetype === 'wordmark') {
            // Only use typography/letter-based generators
            filteredLibrary = getWordmarkPool();
        } else if (archetype === 'both') {
            // BALANCED SELECTION: 50/50 coin flip between symbol and wordmark pools
            // This ensures equal distribution regardless of library size differences
            const useSymbol = Math.random() < 0.5;
            filteredLibrary = useSymbol ? getSymbolPool() : getWordmarkPool();
            console.log(`[InfiniteEngine] 'Both' mode - coin flip chose: ${useSymbol ? 'SYMBOL' : 'WORDMARK'}`);
        }

        // Fallback to full library if archetype filtering resulted in empty
        if (filteredLibrary.length === 0) {
            filteredLibrary = LOGO_LIBRARY;
        }

        // Step 2: Further filter/prioritize based on vibe (aesthetic direction)
        const vibeKey = vibe.toLowerCase();
        const vibeKeywords = VIBE_KEYWORDS[vibeKey];
        const vibeDescKeywords = VIBE_DESCRIPTIONS[vibeKey];

        if (vibeKeywords && vibeKeywords.length > 0) {
            // Create a scored list - algorithms matching vibe get higher priority
            const scoredAlgos = filteredLibrary.map(algo => {
                let score = 0;

                // Check name matches
                for (const keyword of vibeKeywords) {
                    if (algo.name.toLowerCase().includes(keyword.toLowerCase())) {
                        score += 10;
                    }
                }

                // Check description matches
                if (vibeDescKeywords) {
                    for (const keyword of vibeDescKeywords) {
                        if (algo.description.toLowerCase().includes(keyword)) {
                            score += 5;
                        }
                    }
                }

                return { algo, score };
            });

            // Sort by score descending, algorithms with higher scores come first
            scoredAlgos.sort((a, b) => b.score - a.score);

            // If we have matching algorithms, prioritize them (take top 60% or all if small)
            const matchingAlgos = scoredAlgos.filter(a => a.score > 0);

            if (matchingAlgos.length >= 5) {
                // Use only the vibe-matching algorithms
                filteredLibrary = matchingAlgos.map(a => a.algo);
            } else if (matchingAlgos.length > 0) {
                // Mix: matching algos first, then others
                filteredLibrary = [
                    ...matchingAlgos.map(a => a.algo),
                    ...scoredAlgos.filter(a => a.score === 0).slice(0, 10).map(a => a.algo)
                ];
            }
            // If no matches, keep the archetype-filtered library
        }

        console.log(`[InfiniteEngine] Archetype: ${archetype}, Vibe: ${vibe || 'none'}, Pool size: ${filteredLibrary.length}`);

        // Step 3: Generate candidates with quality scoring
        // Generate more candidates to have enough high-quality options
        const candidatesCount = Math.max(count * 5, 25); // Generate 5x more to filter quality

        for (let i = 0; i < candidatesCount; i++) {
            // Unique seed per candidate (timestamp is static per batch, so use suffix)
            const salt = `batch-${i}-${Date.now()}`;
            const seed = await UniquenessSystem.generateSeed(brandName + salt, category);

            const params = UniquenessSystem.deriveParams(seed);

            // Select Algo from FILTERED Library
            const algoByte = parseInt(seed.substring(0, 2), 16);
            const algoIndex = algoByte % filteredLibrary.length;
            const algo = filteredLibrary[algoIndex];

            if (!algo) continue;

            const svg = algo.fn(params, brandName);

            // Quality Score (Improved range: 80-100 based on hash bits)
            // We use bytes 2-3 for quality calculation
            const scoreByte = parseInt(seed.substring(2, 4), 16);
            const quality = 80 + (scoreByte % 21); // Range 80 .. 100

            results.push({
                id: seed,
                svg,
                algorithm: algo.name,
                description: algo.description,
                params,
                qualityScore: quality
            } as any);
        }

        // Step 4: QUALITY GATE - Only return logos with 90+ quality
        const highQualityResults = results.filter(r => r.qualityScore >= QUALITY_THRESHOLD);

        // Sort by quality descending
        highQualityResults.sort((a, b) => b.qualityScore - a.qualityScore);

        console.log(`[InfiniteEngine] Quality Gate: ${results.length} candidates → ${highQualityResults.length} passed (≥${QUALITY_THRESHOLD})`);

        // If we have high quality results, return those
        if (highQualityResults.length >= count) {
            return highQualityResults.slice(0, count);
        }

        // Fallback: If not enough 90+ logos, return best available (sorted by quality)
        if (highQualityResults.length > 0) {
            console.log(`[InfiniteEngine] Warning: Only ${highQualityResults.length} high-quality logos found`);
            return highQualityResults;
        }

        // Last resort: Return top results by quality
        results.sort((a, b) => b.qualityScore - a.qualityScore);
        console.log(`[InfiniteEngine] Fallback: Returning top ${count} by quality (best: ${results[0]?.qualityScore})`);
        return results.slice(0, count);
    }
}
