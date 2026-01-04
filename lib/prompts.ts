/**
 * Glyph Art Director Prompts
 * 
 * System prompts that "bully" the AI into having good taste.
 * These force deterministic, high-quality design decisions.
 */

import { CURATED_PALETTES, CURATED_ICONS, type BrandVibe } from './design-dna';

// ============================================================
// THE ART DIRECTOR SYSTEM PROMPT
// ============================================================

export const ART_DIRECTOR_PROMPT = `
ACT AS: A World-Class Brand Identity Designer (Paul Rand, Massimo Vignelli level).
CONTEXT: You are generating a design system for a startup based on their description.

YOUR GOAL: 
Return a strict JSON object defining the brand visual tokens.
You MUST select from the provided libraries. Do NOT invent new values.

===== DESIGN RULES (DO NOT BREAK) =====

1. INDUSTRY → COLOR MAPPING:
   - "Finance", "Legal", "Enterprise" → Use TRUST palettes (slate_trust, deep_ocean, midnight_pro)
   - "Tech", "AI", "Software" → Use ENERGY palettes (cyber_blue, electric_purple, neon_orange)
   - "Health", "Wellness", "Eco" → Use NATURE palettes (sage_garden, ocean_breeze)
   - "Fashion", "Premium", "Luxury" → Use LUXURY palettes (champagne_gold, noir_elegance)
   - "Consumer", "Social", "Creative" → Use PLAYFUL palettes (candy_coral, sunset_gradient)

2. VIBE → TYPOGRAPHY:
   - "minimalist" → headingFont: "Inter" or "Manrope"
   - "tech" → headingFont: "Space Grotesk" or "Outfit"
   - "luxury" → headingFont: "Playfair Display"
   - "bold/playful" → headingFont: "Outfit"

3. INDUSTRY → ICON:
   - Security/Legal → "Shield" or "ShieldCheck"
   - Tech/AI → "Zap", "Cpu", "Code", "Terminal"
   - Finance → "TrendingUp", "BarChart"
   - Nature/Eco → "Leaf", "Sun", "Droplet"
   - Creative → "Sparkles", "Star"

4. TAGLINE RULES:
   - Maximum 5 words
   - Punchy, memorable
   - NO corporate jargon ("synergy", "solutions", "innovative")
   - Examples: "Move fast.", "Trust, verified.", "Design that ships."

5. LOGO SHAPE:
   - Minimalist → "circle" or "squircle"
   - Tech → "hexagon" or "squircle"
   - Bold → "shield" or "diamond"

===== AVAILABLE PALETTES =====
${CURATED_PALETTES.map(p => `${p.id}: ${p.name} (${p.category})`).join('\n')}

===== AVAILABLE ICONS =====
${CURATED_ICONS.map(i => i.name).join(', ')}

===== OUTPUT FORMAT (STRICT JSON) =====
{
  "name": "BrandName",
  "tagline": "Under 5 words.",
  "vibe": "tech|minimalist|bold|nature|luxury|playful",
  "logo": {
    "iconName": "IconName",
    "shape": "squircle|circle|hexagon|shield|diamond",
    "layout": "stacked|icon_left|icon_only"
  },
  "colors": {
    "paletteId": "palette_id_from_list"
  },
  "typography": {
    "headingFont": "Manrope|Inter|Space Grotesk|Outfit|Playfair Display"
  }
}

CRITICAL: Return ONLY the JSON object. No explanations. No markdown.
`;

// ============================================================
// GENERATE USER PROMPT FROM INPUT
// ============================================================

export function generateUserPrompt(
    brandName: string,
    description: string,
    vibe: BrandVibe
): string {
    return `
Generate a brand identity for:

BRAND NAME: ${brandName}
DESCRIPTION: ${description}
PREFERRED VIBE: ${vibe}

Analyze the description carefully. Extract:
1. Industry keywords (tech, finance, health, etc.)
2. Target audience feel
3. Competitive positioning

Then select the BEST matching:
- Palette ID from the library
- Icon that metaphorically represents the brand
- Typography that matches the vibe
- A punchy tagline (max 5 words)

Return the JSON object.
`;
}

// ============================================================
// VALIDATE AI RESPONSE
// ============================================================

export interface AIBrandResponse {
    name: string;
    tagline: string;
    vibe: BrandVibe;
    logo: {
        iconName: string;
        shape: "squircle" | "circle" | "hexagon" | "shield" | "diamond";
        layout: "stacked" | "icon_left" | "icon_only";
    };
    colors: {
        paletteId: string;
    };
    typography: {
        headingFont: string;
    };
}

export function validateAIResponse(response: unknown): AIBrandResponse | null {
    try {
        const r = response as AIBrandResponse;

        // Validate required fields
        if (!r.name || !r.tagline || !r.vibe) return null;
        if (!r.logo?.iconName || !r.logo?.shape) return null;
        if (!r.colors?.paletteId) return null;
        if (!r.typography?.headingFont) return null;

        // Validate palette exists
        const palette = CURATED_PALETTES.find(p => p.id === r.colors.paletteId);
        if (!palette) {
            // Fallback to first matching vibe palette
            const fallback = CURATED_PALETTES.find(p => p.vibes.includes(r.vibe));
            if (fallback) {
                r.colors.paletteId = fallback.id;
            } else {
                r.colors.paletteId = "slate_trust"; // Ultimate fallback
            }
        }

        return r;
    } catch {
        return null;
    }
}
