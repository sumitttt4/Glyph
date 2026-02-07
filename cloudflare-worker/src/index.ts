/**
 * Glyph AI Icon Generator — Cloudflare Worker
 *
 * Uses @cf/stabilityai/stable-diffusion-xl-base-1.0 to generate
 * clean vector-style icon symbols for brand identities.
 *
 * POST /generate  { brandName, industry, style, colorHint }
 * Returns: raw PNG image (image/png)
 */

interface Env {
	AI: Ai;
}

interface GenerateRequest {
	brandName: string;
	industry?: string;
	style?: string;
	colorHint?: string;
}

// Style-specific prompt fragments
const STYLE_PROMPTS: Record<string, string> = {
	minimal:
		'minimalist flat icon, single clean shape, simple geometry, negative space, single color on white background',
	geometric:
		'geometric abstract icon, precise shapes, mathematical harmony, clean intersecting forms, flat design',
	abstract:
		'abstract symbol icon, flowing organic shape, modern art inspired, sophisticated simplicity, flat design',
	bold: 'bold graphic icon, strong silhouette, high contrast, impactful shape, solid fill, flat design',
	organic:
		'organic natural icon, smooth curves, nature-inspired shape, flowing lines, botanical feel, flat design',
};

// Industry-specific visual cues
const INDUSTRY_PROMPTS: Record<string, string> = {
	technology: 'circuit nodes, data flow, digital connectivity, innovation',
	finance: 'stability, growth arrows, shield protection, trust',
	health: 'wellness leaf, heart rhythm, vitality, care',
	food: 'culinary utensils, steam wisps, fresh ingredients, warmth',
	education: 'open book, lightbulb knowledge, growth, discovery',
	creative: 'paintbrush stroke, color splash, artistic expression',
	ecommerce: 'shopping bag, delivery box, marketplace, retail',
	nature: 'leaf veins, mountain peaks, water drop, earth',
	luxury: 'crown jewel, diamond facet, premium crest, elegance',
	startup: 'rocket launch, upward momentum, spark, acceleration',
	legal: 'balance scales, column pillar, justice, authority',
	music: 'sound wave, musical note, rhythm pulse, harmony',
	sports: 'dynamic motion, athletic form, energy, competition',
	travel: 'compass rose, globe, horizon line, journey',
	real_estate: 'rooftop line, doorway arch, building silhouette, home',
};

function buildPrompt(req: GenerateRequest): string {
	const style = req.style && STYLE_PROMPTS[req.style] ? req.style : 'minimal';
	const stylePrompt = STYLE_PROMPTS[style];

	const industryKey = req.industry?.toLowerCase().replace(/[^a-z_]/g, '') || '';
	const industryPrompt = INDUSTRY_PROMPTS[industryKey] || 'modern professional business';

	const colorHint = req.colorHint
		? `${req.colorHint} color tones`
		: 'monochrome black on white background';

	return [
		`Professional brand icon symbol for "${req.brandName}",`,
		stylePrompt + ',',
		industryPrompt + ',',
		colorHint + ',',
		'single centered icon, logo design, vector style,',
		'clean white background, professional quality,',
		'high resolution, crisp edges, scalable design',
	].join(' ');
}

const NEGATIVE_PROMPT = [
	'text',
	'letters',
	'words',
	'typography',
	'font',
	'writing',
	'watermark',
	'signature',
	'busy background',
	'complex scene',
	'photograph',
	'realistic',
	'3d render',
	'multiple objects',
	'frame',
	'border',
	'blurry',
	'low quality',
	'noise',
	'grain',
	'distorted',
	'deformed',
	'ugly',
	'duplicate',
	'morbid',
	'mutilated',
].join(', ');

// CORS headers
const CORS_HEADERS: Record<string, string> = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Access-Control-Max-Age': '86400',
};

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Handle CORS preflight
		if (request.method === 'OPTIONS') {
			return new Response(null, { status: 204, headers: CORS_HEADERS });
		}

		if (request.method !== 'POST') {
			return new Response(JSON.stringify({ error: 'Method not allowed' }), {
				status: 405,
				headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
			});
		}

		try {
			const body = (await request.json()) as GenerateRequest;

			if (!body.brandName || typeof body.brandName !== 'string') {
				return new Response(
					JSON.stringify({ error: 'brandName is required' }),
					{
						status: 400,
						headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
					}
				);
			}

			const prompt = buildPrompt(body);

			const result = await env.AI.run(
				'@cf/stabilityai/stable-diffusion-xl-base-1.0',
				{
					prompt,
					negative_prompt: NEGATIVE_PROMPT,
					width: 1024,
					height: 1024,
					num_steps: 20,
				}
			);

			// The AI binding returns a ReadableStream for image models
			return new Response(result as ReadableStream, {
				headers: {
					...CORS_HEADERS,
					'Content-Type': 'image/png',
					'Cache-Control': 'public, max-age=3600',
				},
			});
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : 'Unknown error';
			console.error('AI generation error:', message);

			return new Response(
				JSON.stringify({ error: 'AI generation failed', detail: message }),
				{
					status: 500,
					headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
				}
			);
		}
	},
} satisfies ExportedHandler<Env>;
