"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { fontPairings } from '@/lib/fonts';
import { suggestLogoComponentsWithAI_V2 } from '@/lib/brand-generator';

const STRATEGY_TEMPLATES: Record<string, any> = {
    minimalist: {
        mission: "To strip away the non-essential and focus on what truly matters.",
        vision: "A world where design is invisible and function is paramount.",
        values: ["Simplicity", "Clarity", "Purpose", "Reduction"],
        audience: "Design-conscious individuals who value aesthetics and utility.",
        tone: "Restrained, Quiet, Confident"
    },
    tech: {
        mission: "To accelerate human potential through seamless technology integration.",
        vision: "Building the digital infrastructure for a decentralized future.",
        values: ["Innovation", "Speed", "Scale", "Disruption"],
        audience: "Early adopters, developers, and forward-thinking enterprises.",
        tone: "Futuristic, Bold, Technical"
    },
    nature: {
        mission: "To reconnect modern living with the rhythms of the natural world.",
        vision: "A sustainable ecosystem where commerce and nature coexist.",
        values: ["Sustainability", "Growth", "Organic", "Balance"],
        audience: "Eco-conscious consumers seeking authenticity.",
        tone: "Grounded, Organic, Warm"
    },
    bold: {
        mission: "To challenge the status quo and make an undeniable impact.",
        vision: "A brand landscape where only the brave survive.",
        values: ["Courage", "Impact", "Loud", "Unapologetic"],
        audience: "Trendsetters and those who refuse to blend in.",
        tone: "Loud, Energetic, Provocative"
    },
    modern: {
        mission: "To design simpler, better ways to live and work.",
        vision: "Elevating the everyday through thoughtful innovation.",
        values: ["Quality", "Reliability", "Trust", "Design"],
        audience: "Professionals who appreciate craftsmanship and efficiency.",
        tone: "Professional, Clean, Trustworthy"
    }
};

export function useBrandGenerator() {
    const [brand, setBrand] = useState<BrandIdentity | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<BrandIdentity[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [usedIcons, setUsedIcons] = useState<string[]>([]);

    const generateBrand = async (
        vibe: string,
        name: string = 'Glyph Generated',
        options: {
            color?: string;
            shape?: string;
            gradient?: { colors: string[]; angle: number } | null;
            prompt?: string;
            surpriseMe?: boolean
        } = {}
    ) => {
        setIsGenerating(true);

        // Helper for content filtering
        const filterContent = <T extends { tags: string[] }>(items: T[]) => {
            const matches = items.filter(item => item.tags.includes(vibe));
            return matches.length > 0 ? matches : items;
        };

        // Parallel Execution: Minimum animation delay + AI Generation
        const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

        let logoIcon: string | undefined;
        let logoContainer: string | undefined;
        let logoAssemblerLayout: 'icon_left' | 'icon_right' | 'stacked' | 'badge' | 'monogram' | undefined;
        let aiColor: string | undefined;
        let aiFont: string | undefined;

        // Get AI suggestions if procedural generation is applicable
        // We do this for "surprise me" or if a prompt exists
        if (options.prompt || options.surpriseMe) {
            try {
                const aiPrompt = options.prompt || `A startup called ${name} in the ${vibe} industry`;
                const result = await suggestLogoComponentsWithAI_V2(aiPrompt, usedIcons);
                logoIcon = result.icon;
                logoContainer = result.container;
                // Safe cast layout
                if (['icon_left', 'icon_right', 'stacked', 'badge', 'monogram'].includes(result.layout)) {
                    logoAssemblerLayout = result.layout as any;
                }
                aiColor = result.color;
                aiFont = result.font;

                setUsedIcons(prev => [...prev, result.icon]);
            } catch (e) {
                console.error("AI Icon Gen Error", e);
            }
        }

        await minDelay;

        // Fallback: Ensure we always have an icon (Fixes "Font instead of Logo" issue)
        if (!logoIcon) {
            const FALLBACK_ICONS = ['Sparkles', 'Zap', 'Shield', 'Leaf', 'Code2', 'Rocket', 'Layers'];
            logoIcon = FALLBACK_ICONS[Math.floor(Math.random() * FALLBACK_ICONS.length)];
            logoContainer = 'squircle';
            logoAssemblerLayout = 'icon_left';
        }

        // 1. SELECT THEME (or override)
        let selectedTheme: typeof THEMES[0];

        // Priority: Option Color > AI Color > Theme Default
        const effectiveColor = options.color || aiColor;

        if (effectiveColor || options.gradient) {
            // If customized, pick a base theme matching the vibe but OVERRIDE colors
            const cleanThemes = filterContent(THEMES);
            const baseTheme = cleanThemes[Math.floor(Math.random() * cleanThemes.length)];

            // Clone and override
            selectedTheme = {
                ...baseTheme,
                id: 'custom-override',
                name: 'Custom',
                tokens: {
                    ...baseTheme.tokens,
                    light: {
                        ...baseTheme.tokens.light,
                        primary: effectiveColor || baseTheme.tokens.light.primary,
                        // Use gradient if provided, otherwise keep theme's default or none
                        gradient: options.gradient ? [options.gradient.colors[0], options.gradient.colors[1]] : baseTheme.tokens.light.gradient,
                    },
                    dark: {
                        ...baseTheme.tokens.dark,
                        primary: effectiveColor || baseTheme.tokens.dark.primary,
                        // Basic dark mode adaptation for gradient (simplified)
                        gradient: options.gradient ? [options.gradient.colors[0], options.gradient.colors[1]] : baseTheme.tokens.dark.gradient,
                    }
                }
            };
        } else {
            // Standard random selection
            const availableThemes = filterContent(THEMES);
            selectedTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
        }


        // 2. SELECT SHAPE (or override)
        let selectedShape: typeof SHAPES[0];

        if (options.shape) {
            // Find shape by ID or ID-suffix (since IDs might be like 'geo-hexagon')
            selectedShape = SHAPES.find(s => s.id === options.shape) || SHAPES[0];
        } else {
            const availableShapes = filterContent(SHAPES);
            selectedShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        }

        const availableFonts = filterContent(fontPairings);
        let selectedFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];

        // AI Font Override
        if (aiFont) {
            const matchedFont = fontPairings.find(f => f.name.toLowerCase().includes(aiFont!.toLowerCase()) || f.tags.includes(aiFont!.toLowerCase()));
            if (matchedFont) selectedFont = matchedFont;
        }

        // Get Strategy Template or default to Modern
        const strategy = STRATEGY_TEMPLATES[vibe] || STRATEGY_TEMPLATES['modern'];

        // 3. SELECT LOGO LAYOUT (Generative Engine)
        // With procedural icons, 'generative' layout will now use LogoEngine if icon is present
        let selectedLayout = 'generative';

        const newBrand: BrandIdentity = {
            id: crypto.randomUUID(),
            vibe,
            name: name.trim() || 'Untitled Brand',
            theme: selectedTheme,
            shape: selectedShape,
            logoLayout: selectedLayout as any,
            // Procedural Fields
            logoIcon,
            logoContainer,
            logoAssemblerLayout,

            generationSeed: Date.now() + Math.floor(Math.random() * 100000), // Unique per generation
            font: {
                id: selectedFont.id,
                name: selectedFont.name,
                heading: selectedFont.heading.className,
                body: selectedFont.body.className,
                tags: selectedFont.tags
            },
            strategy: {
                ...strategy,
                mission: strategy.mission.replace('To ', `To help ${name.trim()} `).replace('To help Glyph Generated ', 'To ')
            },
            createdAt: new Date(),
        };

        setBrand(newBrand);

        // Add to history
        // If we are in the middle of history and generate new, we discard future
        const newHistory = [...history.slice(0, currentIndex + 1), newBrand];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);

        setIsGenerating(false);

        // PERSISTENCE: Save to Supabase (Background)
        // Fire and forget - don't block UI
        (async () => {
            try {
                const { createClient } = await import('@/utils/supabase/client');
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    await supabase.from('brands').insert({
                        user_id: user.id,
                        identity: newBrand,
                        vibe: vibe,
                        brand_name: name,
                        created_at: new Date().toISOString()
                    });
                    console.log('Brand persisted to DB');
                }
            } catch (e) {
                console.error('Persistence Error', e);
            }
        })();
    };

    const resetBrand = () => {
        setBrand(null);
        setHistory([]);
        setCurrentIndex(-1);
    };

    const undo = () => {
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            setBrand(history[newIndex]);
        }
    };

    const redo = () => {
        if (currentIndex < history.length - 1) {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            setBrand(history[newIndex]);
        }
    };

    const generateVariations = async (baseBrand: BrandIdentity) => {
        setIsGenerating(true);
        const variations: BrandIdentity[] = [];

        // Helper to get random item different from current
        const getDifferent = <T extends { id: string }>(items: T[], currentId: string) => {
            const pool = items.filter(i => i.id !== currentId);
            return pool[Math.floor(Math.random() * pool.length)] || items[0];
        };

        // Variation 1: Same Shape & Font, New Color (Theme)
        const newTheme = getDifferent(THEMES.filter(t => t.tags.includes(baseBrand.vibe)), baseBrand.theme.id);
        variations.push({
            ...baseBrand,
            id: crypto.randomUUID(),
            theme: newTheme,
            logoLayout: 'generative',
            generationSeed: Date.now() + 1,
            createdAt: new Date()
        });

        // Variation 2: Same Theme, New Shape
        const newShape = getDifferent(SHAPES.filter(s => s.tags.includes(baseBrand.vibe) || s.tags.includes('minimalist')), baseBrand.shape.id);
        variations.push({
            ...baseBrand,
            id: crypto.randomUUID(),
            shape: newShape,
            logoLayout: 'generative',
            generationSeed: Date.now() + 2,
            createdAt: new Date()
        });

        // Variation 3: Same Theme & Shape, New Font
        const newFont = getDifferent(fontPairings.filter(f => f.tags.includes(baseBrand.vibe) || f.tags.includes('modern')), baseBrand.font.id);
        variations.push({
            ...baseBrand,
            id: crypto.randomUUID(),
            font: {
                id: newFont.id,
                name: newFont.name,
                heading: newFont.heading.className,
                body: newFont.body.className,
                tags: newFont.tags
            },
            logoLayout: 'generative',
            generationSeed: Date.now() + 3,
            createdAt: new Date()
        });

        // Variation 4: Wildcard (Same Vibe, Random Everything)
        // We use the same generation logic but force specific randoms
        const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const randomFont = fontPairings[Math.floor(Math.random() * fontPairings.length)];

        variations.push({
            ...baseBrand,
            id: crypto.randomUUID(),
            theme: randomTheme,
            shape: randomShape,
            font: {
                id: randomFont.id,
                name: randomFont.name,
                heading: randomFont.heading.className,
                body: randomFont.body.className,
                tags: randomFont.tags
            },
            logoLayout: 'generative',
            generationSeed: Date.now() + 4,
            createdAt: new Date()
        });

        setIsGenerating(false);
        return variations;
    };

    return {
        brand,
        setBrand,
        generateBrand,
        generateVariations,
        isGenerating,
        resetBrand,
        // History controls
        canUndo: currentIndex > 0,
        canRedo: currentIndex < history.length - 1,
        undo,
        redo,
        historyIndex: currentIndex + 1,
        historyTotal: history.length
    };
}
