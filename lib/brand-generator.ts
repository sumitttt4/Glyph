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
    hexagon: "M12 2L21 7V17L12 22L3 17V7L12 2Z",
    diamond: "M12 2L22 12L12 22L2 12L12 2Z",
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
            logoPath: LOGO_PATHS[parsed.logoStyle as keyof typeof LOGO_PATHS] || LOGO_PATHS.hexagon,
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
    let logoStyle: keyof typeof LOGO_PATHS = "hexagon";

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
        logoStyle = "bolt";
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

// ============================================
// GOD-TIER GENERATION (with Art Director prompt)
// ============================================

import {
    CURATED_PALETTES,
    CURATED_ICONS,
    getPaletteById,
    type BrandDNA,
    type BrandVibe
} from './design-dna';
import { ART_DIRECTOR_PROMPT, generateUserPrompt, validateAIResponse } from './prompts';

export async function generateGodTierBrand(
    brandName: string,
    description: string,
    vibe: string
): Promise<BrandDNA | null> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey) {
        console.warn("GROQ_API_KEY not set, using fallback");
        return generateFallbackDNA(brandName, description, vibe as BrandVibe);
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
                    { role: 'system', content: ART_DIRECTOR_PROMPT },
                    { role: 'user', content: generateUserPrompt(brandName, description, vibe as BrandVibe) }
                ],
                temperature: 0.6, // Lower for more consistent results
                max_tokens: 600,
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

        console.log('[God-Tier] Raw AI response:', content);

        const parsed = JSON.parse(content);
        const validated = validateAIResponse(parsed);

        if (!validated) {
            console.warn('[God-Tier] Validation failed, using fallback');
            return generateFallbackDNA(brandName, description, vibe as BrandVibe);
        }

        // Resolve palette to actual colors
        const palette = getPaletteById(validated.colors.paletteId);
        if (!palette) {
            console.warn('[God-Tier] Palette not found:', validated.colors.paletteId);
            return generateFallbackDNA(brandName, description, vibe as BrandVibe);
        }

        console.log('[God-Tier] Selected palette:', palette.name);
        console.log('[God-Tier] Selected icon:', validated.logo.iconName);

        return {
            name: validated.name,
            tagline: validated.tagline,
            vibe: validated.vibe,
            logo: {
                iconName: validated.logo.iconName,
                shape: validated.logo.shape,
                layout: validated.logo.layout,
            },
            colors: {
                primary: palette.colors.primary,
                accent: palette.colors.accent,
                surface: palette.colors.surface,
                text: palette.colors.text,
                paletteId: palette.id,
            },
            typography: {
                headingFont: validated.typography.headingFont as BrandDNA['typography']['headingFont'],
                bodyFont: "Inter",
            },
        };

    } catch (error) {
        console.error('[God-Tier] Generation failed:', error);
        return generateFallbackDNA(brandName, description, vibe as BrandVibe);
    }
}

// Fallback when AI unavailable
function generateFallbackDNA(name: string, description: string, vibe: BrandVibe): BrandDNA {
    const lowerDesc = description.toLowerCase();

    // Select palette based on keywords
    let paletteId = "slate_trust";
    let iconName = "Zap";

    if (lowerDesc.includes("finance") || lowerDesc.includes("legal")) {
        paletteId = "deep_ocean";
        iconName = "Shield";
    } else if (lowerDesc.includes("tech") || lowerDesc.includes("ai")) {
        paletteId = "cyber_blue";
        iconName = "Cpu";
    } else if (lowerDesc.includes("nature") || lowerDesc.includes("eco")) {
        paletteId = "sage_garden";
        iconName = "Leaf";
    } else if (lowerDesc.includes("luxury") || lowerDesc.includes("premium")) {
        paletteId = "noir_elegance";
        iconName = "Gem";
    } else if (vibe === "bold" || vibe === "playful") {
        paletteId = "neon_orange";
        iconName = "Sparkles";
    }

    const palette = getPaletteById(paletteId) || CURATED_PALETTES[0];

    return {
        name: name || "Brand",
        tagline: "Built with Glyph.",
        vibe,
        logo: {
            iconName,
            shape: "squircle",
            layout: "stacked",
        },
        colors: {
            primary: palette.colors.primary,
            accent: palette.colors.accent,
            surface: palette.colors.surface,
            text: palette.colors.text,
            paletteId: palette.id,
        },
        typography: {
            headingFont: "Manrope",
            bodyFont: "Inter",
        },
    };
}

// ============================================
// AI ASSIST FUNCTIONS
// ============================================

// AI-powered brief expansion
export async function expandBriefWithAI(shortBrief: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    console.log('[Reframe] API Key present:', !!apiKey, 'Key length:', apiKey?.length || 0);

    if (!apiKey || shortBrief.length < 3) {
        console.log('[Reframe] Skipping - no API key or brief too short');
        return shortBrief;
    }

    try {
        console.log('[Reframe] Calling Groq API...');
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    {
                        role: 'system',
                        content: `You are a brand copywriter. Take the user's rough brand idea and reframe it into a clearer, more compelling 1-2 sentence description. 
                        
                        CRITICAL INSTRUCTION: Analyze the core 'keywords' that would generate a great logo (e.g., speed, shield, leaf, brain, spark). 
                        Rewrite the brief to explicitly include these 2-3 visual nouns or adjectives that describe the brand's essence, ensuring they flow naturally.
                        
                        Fix grammar, sharpen the positioning, and make it sound professional. Keep the core meaning. No quotes or markdown.`
                    },
                    { role: 'user', content: shortBrief }
                ],
                temperature: 0.6,
                max_tokens: 80,
            }),
        });

        console.log('[Reframe] Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Reframe] API error:', response.status, errorText);
            throw new Error('API error');
        }

        const data = await response.json();
        const result = data.choices[0]?.message?.content?.trim() || shortBrief;
        console.log('[Reframe] Success:', result);
        return result;

    } catch (error) {
        console.error('[Reframe] Catch error:', error);
        return shortBrief;
    }
}

// AI-powered vibe suggestion
export async function suggestVibeWithAI(brief: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey || brief.length < 3) {
        return "minimalist";
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
                    {
                        role: 'system',
                        content: `Based on the brand description, suggest the BEST vibe. Respond with ONLY one word from this list: minimalist, tech, nature, bold. Nothing else.`
                    },
                    { role: 'user', content: brief }
                ],
                temperature: 0.3,
                max_tokens: 10,
            }),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();
        const suggestion = data.choices[0]?.message?.content?.trim()?.toLowerCase();

        // Validate it's one of our vibes
        if (['minimalist', 'tech', 'nature', 'bold'].includes(suggestion)) {
            return suggestion;
        }
        return "minimalist";

    } catch {
        return "minimalist";
    }
}

// AI-powered custom vibe description
export async function expandVibeWithAI(vibeKeywords: string): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    if (!apiKey || vibeKeywords.length < 2) {
        return vibeKeywords;
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
                    {
                        role: 'system',
                        content: `Reframe the user's vibe keywords into a cleaner, more specific vibe phrase (under 10 words). Make it punchy and clear. Just the phrase, no quotes or explanation.`
                    },
                    { role: 'user', content: vibeKeywords }
                ],
                temperature: 0.6,
                max_tokens: 30,
            }),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();
        return data.choices[0]?.message?.content?.trim() || vibeKeywords;

    } catch {
        return vibeKeywords;
    }
}

// AI-powered Logo Component Selection (Procedural Generation)
export async function suggestLogoComponentsWithAI(brief: string, exclude: string[] = []): Promise<{ icon: string; container: string }> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    // Fallback if no API key
    if (!apiKey) {
        return { icon: 'Sparkles', container: 'squircle' };
    }

    const sysPrompt = `
AVAILABLE ICON LIBRARIES (Use these or similar Lucide icons, do not stick to only these):

1. TECH/SAAS: 
[Cpu, Database, Server, Terminal, Code2, GitBranch, Globe, Network, Wifi, Radio, Signal, Zap, Battery, HardDrive, Laptop, Smartphone, Bot, Rocket, Layers, Box, Hexagon]

2. FINANCE/TRUST: 
[Shield, Lock, Key, CreditCard, Wallet, Banknote, Landmark, Scale, TrendingUp, PieChart, BarChart, Target, Award, Crown, Briefcase, Building, Anchor]

3. CREATIVE/STUDIO: 
[PenTool, Brush, Palette, Image, Camera, Video, Mic, Music, Aperture, Framer, Component, Figma, Scissors, Wand, Sparkles, Feather, Eye]

4. NATURE/GROWTH: 
[Leaf, Sprout, Flower, Tree, Sun, Moon, Cloud, Wind, Droplet, Flame, Mountain, Snowflake, Waves, Sunset, Bird]

INSTRUCTIONS:
1. Analyze the user's startup description.
2. Select a SPECIFIC icon from the lists above (or any valid Lucide icon name) that is metaphorically relevant to the brief.
3. NEVER return "Circle", "Square", "Heart" or generic shapes as an icon.
4. Select a container shape from: ["squircle", "cyber", "diamond", "hexagon", "pill"].
5. Avoid these icons if possible: ${exclude.join(', ')}.

Respond with a JSON object ONLY: { "icon": "IconName", "container": "ShapeName" }
`;

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
                    { role: 'system', content: sysPrompt },
                    { role: 'user', content: brief }
                ],
                temperature: 0.5,
                max_tokens: 100,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();
        const content = data.choices[0]?.message?.content?.trim();

        try {
            const result = JSON.parse(content);
            return {
                icon: result.icon || 'Sparkles',
                container: result.container || 'squircle'
            };
        } catch (e) {
            console.error('JSON Parse Error:', e);
            return { icon: 'Sparkles', container: 'squircle' };
        }

    } catch (e) {
        console.error('Logo AI Error:', e);
        return { icon: 'Sparkles', container: 'squircle' };
    }
}

// V2: AI-powered Logo with Assembler Layout Support (Concept by Senior Art Director)
export async function suggestLogoComponentsWithAI_V2(brief: string, exclude: string[] = []): Promise<{
    icon: string;
    container: string;
    layout: string;
    color?: string;
    font?: string;
}> {
    const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY;

    // Fallback if no API key
    if (!apiKey) {
        return { icon: 'Sparkles', container: 'squircle', layout: 'icon_left' };
    }

    const sysPrompt = `
You are a Senior Art Director. Your goal is to design a unique, metaphorical logo for a startup.

TRAINING DATA (DESIGN LOGIC):
- Metaphor Matching:
  * "Fast/Speed" -> Use Icons: [Zap, Activity, Rocket, Wind, Timer, Gauge]
  * "Secure/Safe" -> Use Icons: [Shield, Lock, Fingerprint, Castle, Key, Anchor]
  * "Growth/Money" -> Use Icons: [TrendingUp, Sprout, BarChart, Landmark, Wallet]
  * "Community/Social" -> Use Icons: [Users, Globe, MessageCircle, Handshake, Share2]
  * "Tech/AI" -> Use Icons: [Cpu, Bot, Sparkles, Network, Code, Terminal, Database]
  * "Nature/Eco" -> Use Icons: [Leaf, Tree, Mountain, Wind, Flower, Waves]
  * "Creative" -> Use Icons: [PenTool, Palette, Image, Camera, Box, Layers, Feather]

- Layout Rules:
  * IF "Corporate/Trust" -> Use Layout: "icon_left" (Classic)
  * IF "Creative/Fun/App" -> Use Layout: "stacked" or "badge"
  * IF "Tech/Minimal" -> Use Layout: "icon_left" or "monogram"
  * IF "Luxury/Fashion" -> Use Layout: "monogram" or "icon_right"

- Typography Rules:
  * "Tech" -> Font: "Inter" or "Space Grotesk"
  * "Luxury" -> Font: "Playfair Display" or "Cinzel"
  * "Modern" -> Font: "Manrope" or "DM Sans"
  * "Friendly" -> Font: "Outfit" or "Fredoka"

INSTRUCTIONS:
1. Analyze the user's startup brief deeply.
2. Select a SPECIFIC icon from Lucide React library that is metaphorically relevant. 
   - STRICTLY FORBIDDEN: [Heart, Circle, Square, Rectangle, Triangle, Target, Disc, Orbit, Eye].
   - Avoid generic, common AI looks (like concentric circles or simple targets).
3. Select a Layout from: ["icon_left", "icon_right", "stacked", "badge", "monogram"].
4. Select a Container Shape from: ["squircle", "pill", "ghost", "hexagon", "diamond", "cyber"].
5. Select a Primary Color (Hex Code) that matches the vibe.
6. Select a Font Family (Google Font name, e.g. Inter, Manrope, Playfair Display).

AVOID using these icons (they were used recently): ${exclude.join(', ')}.

Respond with a JSON object ONLY: 
{ 
  "icon": "IconName", 
  "layout": "LayoutName", 
  "shape": "ShapeName", 
  "color": "#HexCode", 
  "font": "FontName" 
}
`;

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
                    { role: 'system', content: sysPrompt },
                    { role: 'user', content: brief }
                ],
                temperature: 0.6,
                max_tokens: 150,
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) throw new Error('API error');

        const data = await response.json();
        const content = data.choices[0]?.message?.content?.trim();

        try {
            const result = JSON.parse(content);
            return {
                icon: result.icon || 'Sparkles',
                container: result.shape || 'squircle',
                layout: result.layout || 'icon_left',
                color: result.color,
                font: result.font
            };
        } catch (e) {
            console.error('JSON Parse Error:', e);
            return { icon: 'Sparkles', container: 'squircle', layout: 'icon_left' };
        }

    } catch (e) {
        console.error('Logo AI Error:', e);
        return { icon: 'Sparkles', container: 'squircle', layout: 'icon_left' };
    }
}
