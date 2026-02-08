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

// ============================================================
// AESTHETIC-SPECIFIC PROMPTS
//
// Each aesthetic fundamentally changes the visual output, not just
// color. These are tuned for logo-quality abstract marks.
// ============================================================

const STYLE_PROMPTS: Record<string, string> = {
	minimal:
		'ultra minimal logo symbol, single geometric shape with clever negative space, scandinavian design, white on black, logo design annual winner, no text',
	geometric:
		'geometric tech logo mark, angular precision, circuit-inspired abstract symbol, sharp edges, white on black, silicon valley startup logo, no text no letters',
	abstract:
		'abstract brand symbol, flowing organic form merged with geometry, award-winning logo design, white on black, behance logo design, no text',
	bold:
		'bold geometric logo mark, strong symmetric symbol, thick lines, powerful abstract icon, white on black, international logo competition winner, no text',
	organic:
		'minimalist single-line botanical symbol, one continuous stroke forming a leaf spiral, white on black, vector logo style, behance logo design award winner, no text',
};

// ============================================================
// INDUSTRY-SPECIFIC ABSTRACT VISUAL CUES
//
// These describe abstract visual qualities, NOT literal objects.
// ============================================================

const INDUSTRY_PROMPTS: Record<string, string> = {
	technology: 'angular intersections, precise geometric nodes, data-flow abstraction, digital connectivity pattern, mathematical precision',
	finance: 'stable geometric foundation, ascending angular form, shield-like structure, vault pattern abstraction, trust and solidity',
	health: 'organic cellular pattern, growth spiral, heartbeat rhythm abstraction, vitality and wellness curves',
	food: 'flame-inspired curves, organic warmth, circular steam abstraction, nourishing organic form',
	education: 'open beacon shape, ascending steps pattern, light and knowledge abstraction, growth formation',
	creative: 'dynamic brush-stroke abstraction, spiral energy, color-wheel-inspired geometry, artistic expression',
	ecommerce: 'forward momentum arrows, connection nodes, marketplace exchange pattern, dynamic flow',
	nature: 'leaf-vein geometry, water-ripple circles, mountain-peak angles, seed-growth spiral, sun-ray radiation',
	luxury: 'refined geometric crest, faceted crystal abstraction, premium symmetric form, elegant angular mark',
	startup: 'upward momentum mark, spark-like radial form, acceleration angles, dynamic energy burst',
	legal: 'balanced symmetric form, column-inspired vertical structure, stable angular foundation',
	music: 'sound-wave abstraction, rhythmic pulse pattern, harmonic circular form, frequency visualization',
	sports: 'dynamic motion curves, athletic energy form, kinetic angular symbol, power and speed',
	travel: 'compass-inspired radial mark, horizon-line abstraction, globe-section geometry, journey path curves',
	real_estate: 'architectural angle, doorway-arch abstraction, structural framework, shelter geometry',
};

function buildPrompt(req: GenerateRequest): string {
	const style = req.style && STYLE_PROMPTS[req.style] ? req.style : 'minimal';
	const stylePrompt = STYLE_PROMPTS[style];

	const industryKey = req.industry?.toLowerCase().replace(/[^a-z_]/g, '') || '';
	const industryPrompt = INDUSTRY_PROMPTS[industryKey] || 'modern professional abstract symbol';

	const colorHint = req.colorHint
		? `${req.colorHint} monochrome tones`
		: 'pure white on solid black background';

	return [
		`Professional abstract logo symbol mark,`,
		stylePrompt + ',',
		industryPrompt + ',',
		colorHint + ',',
		'single centered abstract mark, premium brand identity,',
		'vector logo style, clean flat design, scalable symbol,',
		'high resolution, crisp clean edges, professional quality,',
		'behance featured, dribbble popular, brand identity design',
	].join(' ');
}

// ============================================================
// NEGATIVE PROMPTS
//
// Aggressively exclude anything that would make it look like
// clip art or generic stock imagery.
// ============================================================

const NEGATIVE_PROMPT = [
	'text',
	'letters',
	'alphabet',
	'words',
	'typography',
	'font',
	'writing',
	'watermark',
	'signature',
	'realistic',
	'3d',
	'3d render',
	'gradient',
	'multiple objects',
	'busy',
	'complex',
	'clipart',
	'clip art',
	'cartoon',
	'photograph',
	'photo',
	'busy background',
	'complex scene',
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
	'disfigured',
	'bad anatomy',
	'extra limbs',
	'face',
	'human',
	'person',
	'animal',
	'literal object',
	'icon set',
	'emoji',
	'sticker',
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
