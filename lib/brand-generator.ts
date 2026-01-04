// ============================================
// PHASE 3: THE BRAIN (Groq Integration)
// ============================================

import { BrandData } from '@/components/generator/BrandBoard';

// Available fonts for Groq to choose from
export const AVAILABLE_FONTS = {
    display: ["Manrope", "Inter", "Playfair Display", "Space Grotesk", "Outfit", "Sora"],
    body: ["Inter", "DM Sans", "Source Sans Pro", "Nunito", "Lato", "Open Sans"],
};

// Available vibes
export const VIBES = ["Minimalist", "Tech", "Organic", "Bold", "Luxury"] as const;

// SVG paths for logo generation (Groq picks one)
export const LOGO_PATHS = {
    star: "M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z",
    hexagon: "M12 2L21 7V17L12 22L3 17V7L12 2Z",
    diamond: "M12 2L22 12L12 22L2 12L12 2Z",
    circle: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
    square: "M4 4H20V20H4V4Z",
    triangle: "M12 2L22 20H2L12 2Z",
    shield: "M12 2L20 6V12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12V6L12 2Z",
    bolt: "M13 2L3 14H12L11 22L21 10H12L13 2Z",
};

// The System Prompt for Groq
export const BRAND_GENERATION_PROMPT = `ACT AS: A Senior Art Director at a premium branding agency.

INPUT: A description of a startup or brand concept.

YOUR JOB:
Generate a JSON object that defines a complete brand identity system.

RULES:
1. COLORS: Must be valid hex codes (#XXXXXX format).
   - "primary": The hero color. Match the vibe (neon for tech, muted for luxury, natural for organic).
   - "secondary": A complementary accent color.
   - "ink": The text color (usually dark, like #0C0A09 or #1A1A1A).
   - "canvas": The background color (usually light, like #FAFAF9 or #F5F5F4).

2. FONTS: Choose from these options ONLY:
   - display: ${AVAILABLE_FONTS.display.join(", ")}
   - body: ${AVAILABLE_FONTS.body.join(", ")}

3. VIBE: Must be one of: ${VIBES.join(", ")}

4. TAGLINE: Write a punchy 2-4 word tagline that captures the brand essence.

5. NAME: Keep the user's brand name or create one if not provided.

6. LOGO: Choose one logo style from: ${Object.keys(LOGO_PATHS).join(", ")}

OUTPUT FORMAT (JSON only, no explanation):
{
  "name": "BrandName",
  "tagline": "Short punchy tagline.",
  "colors": {
    "primary": "#HEXCODE",
    "secondary": "#HEXCODE",
    "ink": "#0C0A09",
    "canvas": "#FAFAF9"
  },
  "font": {
    "display": "FontName",
    "body": "FontName"
  },
  "vibe": "Vibe",
  "logoStyle": "star"
}`;

// Function to generate brand using Groq API
export async function generateBrandWithGroq(description: string): Promise<BrandData> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        console.warn("GROQ_API_KEY not set, using fallback generation");
        return generateFallbackBrand(description);
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: BRAND_GENERATION_PROMPT },
                    { role: 'user', content: `Generate a brand identity for: "${description}"` }
                ],
                temperature: 0.7,
                max_tokens: 500,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            throw new Error("No content in Groq response");
        }

        const parsed = JSON.parse(content);

        // Map the response to BrandData
        return {
            name: parsed.name || "Brand",
            tagline: parsed.tagline || "Your tagline here.",
            colors: {
                primary: parsed.colors?.primary || "#FF4500",
                secondary: parsed.colors?.secondary || "#0EA5E9",
                ink: parsed.colors?.ink || "#0C0A09",
                canvas: parsed.colors?.canvas || "#FAFAF9",
            },
            font: {
                display: parsed.font?.display || "Manrope",
                body: parsed.font?.body || "Inter",
            },
            vibe: parsed.vibe || "Tech",
            logoPath: LOGO_PATHS[parsed.logoStyle as keyof typeof LOGO_PATHS] || LOGO_PATHS.star,
        };

    } catch (error) {
        console.error("Groq generation failed:", error);
        return generateFallbackBrand(description);
    }
}

// Fallback generation when Groq is unavailable
function generateFallbackBrand(description: string): BrandData {
    const lowerDesc = description.toLowerCase();

    // Simple keyword-based generation
    let colors = { primary: "#FF4500", secondary: "#0EA5E9", ink: "#0C0A09", canvas: "#FAFAF9" };
    let vibe: BrandData['vibe'] = "Tech";
    let logoStyle: keyof typeof LOGO_PATHS = "star";

    if (lowerDesc.includes("finance") || lowerDesc.includes("bank")) {
        colors = { primary: "#0D9488", secondary: "#6366F1", ink: "#0C0A09", canvas: "#F0FDF4" };
        vibe = "Minimalist";
        logoStyle = "shield";
    } else if (lowerDesc.includes("organic") || lowerDesc.includes("eco") || lowerDesc.includes("nature")) {
        colors = { primary: "#22C55E", secondary: "#84CC16", ink: "#14532D", canvas: "#F7FEE7" };
        vibe = "Organic";
        logoStyle = "hexagon";
    } else if (lowerDesc.includes("luxury") || lowerDesc.includes("premium")) {
        colors = { primary: "#A855F7", secondary: "#EC4899", ink: "#1E1B4B", canvas: "#FAF5FF" };
        vibe = "Luxury";
        logoStyle = "diamond";
    } else if (lowerDesc.includes("tech") || lowerDesc.includes("ai") || lowerDesc.includes("cyber")) {
        colors = { primary: "#00FF99", secondary: "#00D4FF", ink: "#0A0A0A", canvas: "#0F172A" };
        vibe = "Tech";
        logoStyle = "bolt";
    } else if (lowerDesc.includes("bold") || lowerDesc.includes("energy")) {
        colors = { primary: "#EF4444", secondary: "#F97316", ink: "#0C0A09", canvas: "#FEF2F2" };
        vibe = "Bold";
        logoStyle = "triangle";
    }

    // Extract name from description or generate one
    const words = description.split(' ').filter(w => w.length > 3);
    const name = words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : "Brand";

    return {
        name,
        tagline: "Designed by Glyph.",
        colors,
        font: {
            display: "Manrope",
            body: "Inter",
        },
        vibe,
        logoPath: LOGO_PATHS[logoStyle],
    };
}
