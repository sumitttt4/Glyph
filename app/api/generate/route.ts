/**
 * /api/generate — Hybrid AI Brand Pipeline
 *
 * Orchestrates:
 * 1. Calls the Cloudflare Worker for AI-generated icon (PNG)
 * 2. Generates color palette algorithmically (industry-aware)
 * 3. Selects typography pairings from curated Google Fonts
 * 4. Returns JSON with everything the client needs for composition
 *
 * POST body: {
 *   brandName: string,
 *   industry?: string,
 *   style?: string,       // "minimal" | "geometric" | "abstract" | "bold" | "organic"
 *   colorHint?: string,   // hex color to seed palette
 *   variations?: number   // 1-5, how many style variations (default 3)
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIPalette, type AIPalette } from '@/lib/ai-palette';
import { selectTypographyPairing, type AITypographyResult } from '@/lib/ai-typography';
import { generateGeometricLogos, type GeometricLogoResult } from '@/lib/geometric-logo-engine';

// ============================================================
// TYPES
// ============================================================

interface GenerateRequest {
    brandName: string;
    industry?: string;
    style?: string;
    colorHint?: string;
    variations?: number;
}

interface GenerateVariation {
    style: string;
    icon: string | null;        // base64 PNG or null if generation failed
    palette: AIPalette;
    typography: {
        displayFont: string;    // Font config id
        displayFontName: string;
        bodyFont: string;
        bodyFontName: string;
        reason: string;
    };
}

interface GeometricLogoVariation {
    svg: string;
    method: string;
    seed: string;
}

interface GenerateResponse {
    brandName: string;
    industry: string;
    variations: GenerateVariation[];
    geometricLogos: GeometricLogoVariation[];
    meta: {
        aiIconGenerated: boolean;
        fallbackUsed: boolean;
        geometricLogosGenerated: number;
        generatedAt: number;
    };
}

// ============================================================
// STYLES FOR VARIATIONS
// ============================================================

const VARIATION_STYLES = ['minimal', 'geometric', 'abstract', 'bold', 'organic'] as const;

// ============================================================
// CF WORKER CLIENT
// ============================================================

async function fetchAIIcon(
    workerUrl: string,
    brandName: string,
    industry: string,
    style: string,
    colorHint?: string,
): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30_000); // 30s timeout

        const response = await fetch(workerUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ brandName, industry, style, colorHint }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!response.ok) {
            console.error(`CF Worker error: ${response.status} ${response.statusText}`);
            return null;
        }

        const arrayBuffer = await response.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return `data:image/png;base64,${base64}`;
    } catch (err) {
        console.error('AI icon fetch failed:', err instanceof Error ? err.message : err);
        return null;
    }
}

// ============================================================
// HANDLER
// ============================================================

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as GenerateRequest;

        if (!body.brandName || typeof body.brandName !== 'string') {
            return NextResponse.json(
                { error: 'brandName is required' },
                { status: 400 },
            );
        }

        const brandName = body.brandName.trim();
        const industry = body.industry || 'technology';
        const colorHint = body.colorHint;
        const variationCount = Math.min(Math.max(body.variations ?? 3, 1), 5);

        // Determine which styles to generate
        const stylesToGenerate = VARIATION_STYLES.slice(0, variationCount);

        // Resolve the primary style (first variation or explicit)
        const primaryStyle = body.style && VARIATION_STYLES.includes(body.style as typeof VARIATION_STYLES[number])
            ? body.style
            : stylesToGenerate[0];

        const cfWorkerUrl = process.env.CF_WORKER_URL;

        // Generate all variations in parallel
        const variationPromises = stylesToGenerate.map(async (style, i): Promise<GenerateVariation> => {
            const seed = Date.now() + i * 6551;

            // AI icon generation (only if CF worker is configured)
            let icon: string | null = null;
            if (cfWorkerUrl) {
                icon = await fetchAIIcon(cfWorkerUrl, brandName, industry, style, colorHint);
            }

            // Color palette (always works — algorithmic)
            const palette = generateAIPalette(industry, colorHint, seed);

            // Typography (always works — curated selection)
            const typographyResult = selectTypographyPairing(industry, style, seed);

            return {
                style,
                icon,
                palette,
                typography: {
                    displayFont: typographyResult.display.id,
                    displayFontName: typographyResult.display.name,
                    bodyFont: typographyResult.body.id,
                    bodyFontName: typographyResult.body.name,
                    reason: typographyResult.reason,
                },
            };
        });

        const variations = await Promise.all(variationPromises);

        // Geometric SVG logo generation (always works — algorithmic)
        const geometricResults = generateGeometricLogos(brandName, variationCount);
        const geometricLogos: GeometricLogoVariation[] = geometricResults.map((r) => ({
            svg: r.svg,
            method: r.method,
            seed: r.seed,
        }));

        const anyIconGenerated = variations.some((v) => v.icon !== null);

        const response: GenerateResponse = {
            brandName,
            industry,
            variations,
            geometricLogos,
            meta: {
                aiIconGenerated: anyIconGenerated,
                fallbackUsed: !anyIconGenerated,
                geometricLogosGenerated: geometricLogos.length,
                generatedAt: Date.now(),
            },
        };

        return NextResponse.json(response);
    } catch (err) {
        console.error('/api/generate error:', err);
        return NextResponse.json(
            { error: 'Generation failed', detail: err instanceof Error ? err.message : 'Unknown error' },
            { status: 500 },
        );
    }
}
