/**
 * /api/generate — Hybrid AI Brand Pipeline
 *
 * Orchestrates:
 * 1. Generates 5 geometric SVG logo variations (always works — algorithmic)
 * 2. Calls the Cloudflare Worker for 2-3 AI-generated icon PNGs (if configured)
 * 3. Generates color palette algorithmically (industry-aware)
 * 4. Selects typography pairings from curated Google Fonts
 * 5. Returns JSON with 7-8 total logo options + palette + typography
 *
 * POST body: {
 *   brandName: string,
 *   industry?: string,
 *   style?: string,       // "minimal" | "geometric" | "abstract" | "bold" | "organic"
 *   colorHint?: string,   // hex color to seed palette
 *   variations?: number   // 1-5, how many palette/typography variations (default 3)
 * }
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIPalette, type AIPalette } from '@/lib/ai-palette';
import { selectTypographyPairing, type AITypographyResult } from '@/lib/ai-typography';
import { generateGeometricLogos, type GeometricLogoResult, type Aesthetic } from '@/lib/geometric-logo-engine';

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
    aesthetic: string;
    seed: string;
}

interface GenerateResponse {
    brandName: string;
    industry: string;
    variations: GenerateVariation[];
    geometricLogos: GeometricLogoVariation[];
    meta: {
        aiIconGenerated: boolean;
        aiIconCount: number;
        fallbackUsed: boolean;
        geometricLogosGenerated: number;
        generatedAt: number;
    };
}

// ============================================================
// STYLE → AESTHETIC MAPPING
// ============================================================

const STYLE_TO_AESTHETIC: Record<string, Aesthetic> = {
    minimal: 'minimalist',
    geometric: 'tech',
    abstract: 'nature',
    bold: 'bold',
    organic: 'nature',
};

const VARIATION_STYLES = ['minimal', 'geometric', 'abstract', 'bold', 'organic'] as const;

// Styles to use for AI icon generation (2-3 diverse styles)
const AI_ICON_STYLES = ['minimal', 'geometric', 'bold'] as const;

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

        // Determine which styles to generate for palette/typography
        const stylesToGenerate = VARIATION_STYLES.slice(0, variationCount);

        // Resolve the primary style
        const primaryStyle = body.style && VARIATION_STYLES.includes(body.style as typeof VARIATION_STYLES[number])
            ? body.style
            : stylesToGenerate[0];

        const cfWorkerUrl = process.env.CF_WORKER_URL;

        // ============================================================
        // PARALLEL GENERATION
        //
        // 1. Geometric SVG logos (5 variations, instant — algorithmic)
        // 2. Palette/typography variations (instant — algorithmic)
        // 3. AI icon generation (2-3 variations, async — CF Worker)
        // ============================================================

        // Map the primary style to an aesthetic for the geometric engine
        const aesthetic = STYLE_TO_AESTHETIC[primaryStyle] || 'minimalist';

        // 1. Generate 5 geometric SVG logos (always works)
        const geometricResults = generateGeometricLogos(brandName, {
            aesthetic,
            industry,
        });
        const geometricLogos: GeometricLogoVariation[] = geometricResults.map((r) => ({
            svg: r.svg,
            method: r.method,
            aesthetic: r.aesthetic,
            seed: r.seed,
        }));

        // 2. Generate palette/typography variations in parallel with AI icons
        const variationPromises = stylesToGenerate.map(async (style, i): Promise<GenerateVariation> => {
            const seed = Date.now() + i * 6551;

            // Color palette (always works — algorithmic)
            const palette = generateAIPalette(industry, colorHint, seed);

            // Typography (always works — curated selection)
            const typographyResult = selectTypographyPairing(industry, style, seed);

            return {
                style,
                icon: null, // AI icons are generated separately below
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

        // 3. Generate 2-3 AI icon variations (if CF Worker is configured)
        const aiIconPromises: Promise<string | null>[] = [];
        if (cfWorkerUrl) {
            for (const style of AI_ICON_STYLES) {
                aiIconPromises.push(
                    fetchAIIcon(cfWorkerUrl, brandName, industry, style, colorHint),
                );
            }
        }

        // Await all in parallel
        const [variations, ...aiIcons] = await Promise.all([
            Promise.all(variationPromises),
            ...aiIconPromises,
        ]);

        // Attach AI icons to the first N variations that match
        const resolvedAiIcons = aiIcons as (string | null)[];
        let aiIconIdx = 0;
        for (let i = 0; i < (variations as GenerateVariation[]).length && aiIconIdx < resolvedAiIcons.length; i++) {
            if (resolvedAiIcons[aiIconIdx] !== null) {
                (variations as GenerateVariation[])[i].icon = resolvedAiIcons[aiIconIdx];
            }
            aiIconIdx++;
        }

        const aiIconCount = resolvedAiIcons.filter((icon) => icon !== null).length;
        const anyIconGenerated = aiIconCount > 0;

        const response: GenerateResponse = {
            brandName,
            industry,
            variations: variations as GenerateVariation[],
            geometricLogos,
            meta: {
                aiIconGenerated: anyIconGenerated,
                aiIconCount,
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
