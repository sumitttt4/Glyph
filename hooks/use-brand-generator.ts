"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { fontPairings } from '@/lib/fonts';
import { suggestLogoComponentsWithAI_V2 } from '@/lib/brand-generator';
import { ICONS, getIconsForVibe, getRandomIcon } from '@/lib/icons';
import { generateBrandStrategy } from '@/lib/strategy-engine';
import { incrementGenerationCount } from '@/app/actions/stats';
import {
    generateLogos,
    LogoCategory,
    LogoAesthetic,
    LogoAlgorithm,
    GeneratedLogo,
    ALL_ALGORITHMS,
    SYMBOL_ALGORITHMS,
    WORDMARK_ALGORITHMS,
    generateAllLogoVariations,
} from '@/components/logo-engine';

// Map vibe to LogoCategory for logo engine
const vibeToCategory: Record<string, LogoCategory> = {
    'tech': 'technology',
    'minimalist': 'technology',
    'bold': 'creative',
    'nature': 'sustainability',
    'luxury': 'finance',
    'modern': 'technology',
    'playful': 'creative',
    'professional': 'finance',
    'creative': 'creative',
    'corporate': 'finance',
    'startup': 'technology',
    'health': 'healthcare',
    'education': 'education',
    'ecommerce': 'ecommerce',
};

// Map vibe to LogoAesthetic
const vibeToAesthetic: Record<string, LogoAesthetic> = {
    'tech': 'tech-minimal',
    'minimalist': 'tech-minimal',
    'bold': 'bold-geometric',
    'nature': 'friendly-rounded',
    'luxury': 'elegant-refined',
    'modern': 'tech-minimal',
    'playful': 'friendly-rounded',
    'professional': 'elegant-refined',
    'creative': 'bold-geometric',
    'corporate': 'elegant-refined',
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
            archetype?: 'symbol' | 'wordmark' | 'both';
            gradient?: { colors: string[]; angle: number } | null;
            prompt?: string;
            surpriseMe?: boolean
        } = {}
    ) => {
        setIsGenerating(true);

        // Helper for content filtering
        const filterContent = <T extends { tags?: string[] }>(items: T[]) => {
            const matches = items.filter(item => item.tags?.includes(vibe));
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

        // Fallback: Use new icon library with vibe-based selection
        if (!logoIcon) {
            const vibeIcons = getIconsForVibe(vibe);
            const availableIcons = vibeIcons.filter(icon => !usedIcons.includes(icon.id));
            const selectedIcon = availableIcons.length > 0
                ? availableIcons[Math.floor(Math.random() * availableIcons.length)]
                : getRandomIcon();

            logoIcon = selectedIcon.id;  // Now uses our icon IDs
            logoContainer = 'squircle';

            // Randomly select layout for variety
            const layouts: Array<'icon_left' | 'icon_right' | 'stacked' | 'badge' | 'monogram'> =
                ['icon_left', 'stacked', 'badge', 'icon_right'];
            logoAssemblerLayout = layouts[Math.floor(Math.random() * layouts.length)];

            setUsedIcons(prev => [...prev, selectedIcon.id]);
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
            let match = SHAPES.find(s => s.id === options.shape);

            // If no ID match, try matching TAGS (e.g. 'futuristic', 'geometric')
            if (!match) {
                const tagMatches = SHAPES.filter(s => s.tags?.includes(options.shape!.toLowerCase()));
                if (tagMatches.length > 0) {
                    match = tagMatches[Math.floor(Math.random() * tagMatches.length)];
                }
            }
            selectedShape = match || SHAPES[0];
        } else {
            const availableShapes = filterContent(SHAPES);
            selectedShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
        }

        // Font selection with category-based matching
        const availableFonts = filterContent(fontPairings);
        let selectedFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];

        // Try to match fonts by category/vibe
        const vibeCategory = vibe.toLowerCase();
        const categoryFonts = availableFonts.filter(f =>
            f.categories?.some(c => vibeCategory.includes(c)) ||
            f.tags.some(t => vibeCategory.includes(t))
        );
        if (categoryFonts.length > 0) {
            // Prefer recommended fonts within category
            const recommended = categoryFonts.filter(f => f.recommended);
            selectedFont = recommended.length > 0
                ? recommended[Math.floor(Math.random() * recommended.length)]
                : categoryFonts[Math.floor(Math.random() * categoryFonts.length)];
        }

        // AI Font Override
        if (aiFont) {
            const matchedFont = fontPairings.find(f => f.name.toLowerCase().includes(aiFont!.toLowerCase()) || f.tags.includes(aiFont!.toLowerCase()));
            if (matchedFont) selectedFont = matchedFont;
        }

        // Get Strategy Template or default to Modern
        // Strategy is now generated later using the engine

        // 3. SELECT LOGO LAYOUT (Generative Engine)
        // With procedural icons, 'generative' layout will now use LogoEngine if icon is present
        let selectedLayout = 'generative';

        // NEW LOGIC: Radial Engine Selection
        // 40% chance for Tech or Nature brands to use Radial Engine
        const isScienceVibe = vibe === 'tech' || vibe === 'nature';
        if (isScienceVibe && Math.random() > 0.6) {
            selectedLayout = 'radial';
        }

        // 4. GENERATE STRATEGY (Premium Engine)
        const brandStrategy = generateBrandStrategy(name, vibe);

        // 5. GENERATE PREMIUM LOGOS (Logo Engine v5)
        const logoCategory = vibeToCategory[vibe.toLowerCase()] || 'technology';
        const logoAesthetic = vibeToAesthetic[vibe.toLowerCase()] || 'tech-minimal';
        const logoPrimaryColor = options.color || aiColor || selectedTheme.tokens.light.primary;

        let generatedLogos: GeneratedLogo[] = [];
        try {
            generatedLogos = generateLogos({
                brandName: name.trim() || 'Brand',
                primaryColor: logoPrimaryColor,
                accentColor: selectedTheme.tokens.light.accent || undefined,
                category: logoCategory,
                industry: logoCategory,
                aesthetic: logoAesthetic,
                archetype: options.archetype, // Pass archetype for algorithm filtering
                variations: 3, // Generate 3 variations
                minQualityScore: 85, // Premium quality threshold
            });

            // Generate all 6 variations for each logo (horizontal, stacked, icon-only, wordmark-only, dark, light)
            if (generatedLogos.length > 0) {
                const tempBrandForVariations = {
                    name: name.trim() || 'Brand',
                    theme: selectedTheme,
                    font: {
                        id: selectedFont.id,
                        name: selectedFont.name,
                        heading: selectedFont.heading.className,
                        body: selectedFont.body.className,
                        mono: selectedFont.mono?.className,
                        headingName: selectedFont.headingName,
                        bodyName: selectedFont.bodyName,
                        monoName: selectedFont.monoName,
                        tags: selectedFont.tags,
                        weights: selectedFont.weights,
                    },
                } as any;
                generatedLogos = generateAllLogoVariations(generatedLogos, tempBrandForVariations);
            }
        } catch (e) {
            console.error('Logo Engine Error:', e);
        }

        const newBrand: BrandIdentity = {
            id: crypto.randomUUID(),
            vibe,
            name: name.trim() || 'Untitled Brand',
            theme: selectedTheme,
            shape: selectedShape,
            archetype: options.archetype,
            logoLayout: selectedLayout as any,
            // Procedural Fields
            logoIcon,
            logoContainer,
            logoAssemblerLayout,
            canvasStyle: options.gradient ? 'gradient' : 'solid', // Added canvasStyle
            // Logo Engine v5 - Premium Generated Logos
            generatedLogos: generatedLogos.length > 0 ? generatedLogos : undefined,
            selectedLogoIndex: generatedLogos.length > 0 ? 0 : undefined,
            generationSeed: Date.now() + Math.floor(Math.random() * 100000), // Unique per generation
            font: {
                id: selectedFont.id,
                name: selectedFont.name,
                heading: selectedFont.heading.className,
                body: selectedFont.body.className,
                mono: selectedFont.mono?.className,
                headingName: selectedFont.headingName,
                bodyName: selectedFont.bodyName,
                monoName: selectedFont.monoName,
                tags: selectedFont.tags,
                weights: selectedFont.weights,
            },
            strategy: brandStrategy, // Use generated strategy
            createdAt: new Date(),
        };

        setBrand(newBrand);

        // Add to history
        // If we are in the middle of history and generate new, we discard future
        const newHistory = [...history.slice(0, currentIndex + 1), newBrand];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);

        setIsGenerating(false);

        // GLOBAL STATS: Increment counter (fire and forget)
        incrementGenerationCount();

        // PERSISTENCE: Save to Supabase (Background)
        // Fire and forget - don't block UI
        (async () => {
            try {
                const { createClient } = await import('@/lib/supabase/client');
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

    const generateVariations = async (baseBrand: BrandIdentity, count: number = 4) => {
        setIsGenerating(true);
        const variations: BrandIdentity[] = [];

        // Get the current algorithm used (if any)
        const currentAlgorithm = baseBrand.generatedLogos?.[0]?.algorithm;
        const archetype = baseBrand.archetype;

        // Curated algorithm groups for visual variety (ABSTRACT MARKS ONLY)
        const algorithmGroups: LogoAlgorithm[][] = [
            ['starburst', 'orbital-rings', 'flow-gradient', 'infinity-loop'],                  // Radial/Organic
            ['framed-letter', 'monogram-blend', 'letter-gradient', 'box-logo'],               // Lettermarks
            ['abstract-mark', 'depth-geometry', 'isometric-cube', 'hexagon-tech'],            // Abstract/3D
            ['gradient-bars', 'motion-lines', 'stacked-lines'],                               // Linear/Bars
            ['perfect-triangle', 'circle-overlap'],                                            // Geometric
            ['letter-swoosh'],                                                                 // Dynamic
            ['dna-helix', 'orbital-paths', 'fingerprint-id', 'maze-pattern'],                 // Advanced
        ];

        // Select algorithm pool based on archetype
        let baseAlgorithms: LogoAlgorithm[];
        if (archetype === 'symbol') {
            baseAlgorithms = SYMBOL_ALGORITHMS;
        } else if (archetype === 'wordmark') {
            baseAlgorithms = WORDMARK_ALGORITHMS;
        } else {
            baseAlgorithms = ALL_ALGORITHMS;
        }

        // Filter out current algorithm
        const availableAlgorithms = baseAlgorithms.filter(a => a !== currentAlgorithm);

        // Shuffle algorithms for variety
        const shuffled = [...availableAlgorithms].sort(() => Math.random() - 0.5);

        // Select diverse algorithms (try to pick from different groups)
        const selectedAlgorithms: LogoAlgorithm[] = [];
        const usedGroups = new Set<number>();

        for (const algo of shuffled) {
            if (selectedAlgorithms.length >= count) break;

            // Find which group this algorithm belongs to
            const groupIndex = algorithmGroups.findIndex(group => group.includes(algo));

            // Prefer algorithms from unused groups for maximum variety
            if (groupIndex === -1 || !usedGroups.has(groupIndex)) {
                selectedAlgorithms.push(algo);
                if (groupIndex !== -1) usedGroups.add(groupIndex);
            }
        }

        // Fill remaining slots if needed
        while (selectedAlgorithms.length < count && shuffled.length > selectedAlgorithms.length) {
            const remaining = shuffled.filter(a => !selectedAlgorithms.includes(a));
            if (remaining.length > 0) {
                selectedAlgorithms.push(remaining[0]);
            } else {
                break;
            }
        }

        // Get brand colors
        const primaryColor = baseBrand.theme.tokens.light.primary;
        const accentColor = baseBrand.theme.tokens.light.accent;
        const logoCategory = vibeToCategory[baseBrand.vibe.toLowerCase()] || 'technology';

        // Generate variations with different logo algorithms
        for (let i = 0; i < selectedAlgorithms.length; i++) {
            const algorithm = selectedAlgorithms[i];

            // Generate logo with specific algorithm
            let generatedLogos: GeneratedLogo[] = [];
            try {
                generatedLogos = generateLogos({
                    brandName: baseBrand.name,
                    primaryColor,
                    accentColor,
                    category: logoCategory,
                    algorithm, // Use specific algorithm
                    archetype, // Pass archetype for consistency
                    variations: 1, // One logo per algorithm
                    minQualityScore: 85, // Premium quality threshold
                });

                // Generate all 6 variations for each logo
                if (generatedLogos.length > 0) {
                    generatedLogos = generateAllLogoVariations(generatedLogos, baseBrand);
                }
            } catch (e) {
                console.error(`Logo generation error for ${algorithm}:`, e);
            }

            // Get varied font (cycle through available fonts)
            const vibefonts = fontPairings.filter(f =>
                f.tags.includes(baseBrand.vibe) || f.tags.includes('modern')
            );
            const fontIndex = i % vibefonts.length;
            const variedFont = vibefonts[fontIndex] || fontPairings[i % fontPairings.length];

            variations.push({
                ...baseBrand,
                id: crypto.randomUUID(),
                // Keep same theme/colors
                theme: baseBrand.theme,
                // Use the new generated logos
                generatedLogos: generatedLogos.length > 0 ? generatedLogos : undefined,
                selectedLogoIndex: 0,
                // Vary font slightly for secondary differentiation
                font: {
                    id: variedFont.id,
                    name: variedFont.name,
                    heading: variedFont.heading.className,
                    body: variedFont.body.className,
                    mono: variedFont.mono?.className,
                    headingName: variedFont.headingName,
                    bodyName: variedFont.bodyName,
                    monoName: variedFont.monoName,
                    tags: variedFont.tags,
                    weights: variedFont.weights,
                },
                logoLayout: 'generative',
                generationSeed: Date.now() + i + 1,
                createdAt: new Date()
            });
        }

        setIsGenerating(false);
        return variations;
    };

    const updateBrand = (updates: Partial<BrandIdentity>) => {
        if (!brand) return;
        const updated = { ...brand, ...updates };
        setBrand(updated);
        // Add to history
        const newHistory = [...history.slice(0, currentIndex + 1), updated];
        setHistory(newHistory);
        setCurrentIndex(newHistory.length - 1);
    };

    return {
        brand,
        setBrand,
        generateBrand,
        generateVariations,
        updateBrand,
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
