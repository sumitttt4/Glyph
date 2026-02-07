/**
 * Client-side helper for the /api/generate AI brand pipeline.
 *
 * Calls the Next.js API route which orchestrates:
 * - Cloudflare Worker AI icon generation
 * - Industry-aware palette generation
 * - Typography pairing selection
 */

// ============================================================
// TYPES (mirrors API response)
// ============================================================

export interface AIGenerateVariation {
    style: string;
    icon: string | null;        // base64 PNG data URI
    palette: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        foreground: string;
        muted: string;
        strategy: string;
    };
    typography: {
        displayFont: string;
        displayFontName: string;
        bodyFont: string;
        bodyFontName: string;
        reason: string;
    };
}

export interface AIGenerateResponse {
    brandName: string;
    industry: string;
    variations: AIGenerateVariation[];
    meta: {
        aiIconGenerated: boolean;
        fallbackUsed: boolean;
        generatedAt: number;
    };
}

export interface AIGenerateRequest {
    brandName: string;
    industry?: string;
    style?: string;
    colorHint?: string;
    variations?: number;
}

// ============================================================
// CLIENT
// ============================================================

/**
 * Call the /api/generate endpoint to get AI-generated brand assets.
 * Returns null if the request fails (caller should fall back to algorithmic generation).
 */
export async function generateAIBrandAssets(
    params: AIGenerateRequest,
): Promise<AIGenerateResponse | null> {
    try {
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });

        if (!response.ok) {
            console.error(`[AI Generate] API error: ${response.status}`);
            return null;
        }

        const data: AIGenerateResponse = await response.json();
        return data;
    } catch (err) {
        console.error('[AI Generate] Request failed:', err);
        return null;
    }
}
