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
    // generateSemanticLogos removed
    LogoCategory,
    LogoAesthetic,
    LogoAlgorithm,
    GeneratedLogo,
    ALL_ALGORITHMS,
    SYMBOL_ALGORITHMS,
    WORDMARK_ALGORITHMS,
    generateAllLogoVariations,
} from '@/components/logo-engine';
import { InfiniteLogoEngine } from '@/lib/logo-engine-v2/master';

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
            surpriseMe?: boolean;
            category?: string;
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

        // CONTEXT ENGINE: Apply Aesthetic Rules
        // 1. Theme Logic
        let themeId = 'midnight'; // Default
        if (options.category === 'fintech' || vibe === 'tech') themeId = 'nebula';
        else if (options.category === 'fashion' || vibe === 'minimalist') themeId = 'somatic';
        else if (options.category === 'nature' || vibe === 'nature') themeId = 'sage';
        else if (vibe === 'bold') themeId = 'midnight';
        else if (vibe === 'luxury') themeId = 'lux';

        let selectedTheme = THEMES.find(t => t.id === themeId) || THEMES[0];

        // 2. Font Logic
        let fontId = 'inter'; // Default
        if (options.category === 'fintech' || vibe === 'tech') fontId = 'jetbrains-mono';
        else if (options.category === 'fashion' || vibe === 'luxury') fontId = 'playfair-display';
        else if (vibe === 'bold') fontId = 'archivo-black';

        // Override if options.category dictates
        if (options.category === 'legal') fontId = 'merriweather';

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
        // The above CONTEXT ENGINE logic now handles initial theme selection.
        // This block now only handles color/gradient overrides.
        const effectiveColor = options.color || aiColor;

        if (effectiveColor || options.gradient) {
            // If customized, pick a base theme matching the vibe but OVERRIDE colors
            const cleanThemes = filterContent(THEMES);
            const baseTheme = cleanThemes.find(t => t.id === selectedTheme.id) || cleanThemes[Math.floor(Math.random() * cleanThemes.length)];

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
            // If no custom color/gradient, ensure selectedTheme is from THEMES array
            selectedTheme = THEMES.find(t => t.id === selectedTheme.id) || filterContent(THEMES)[Math.floor(Math.random() * filterContent(THEMES).length)];
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
        let selectedFont = fontPairings.find(f => f.id === fontId) || fontPairings[0]; // Use fontId from context engine

        // Try to match fonts by category/vibe (fallback if fontId not found or for further refinement)
        const vibeCategory = vibe.toLowerCase();
        const categoryFonts = fontPairings.filter(f =>
            f.categories?.some(c => vibeCategory.includes(c)) ||
            f.tags.some(t => vibeCategory.includes(t))
        );
        if (categoryFonts.length > 0) {
            // Prefer recommended fonts within category
            const recommended = categoryFonts.filter(f => f.recommended);
            const fallbackFont = recommended.length > 0
                ? recommended[Math.floor(Math.random() * recommended.length)]
                : categoryFonts[Math.floor(Math.random() * categoryFonts.length)];

            // Only override if the context engine didn't already pick a specific font
            if (!fontPairings.find(f => f.id === fontId)) {
                selectedFont = fallbackFont;
            }
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

        // 5. GENERATE PREMIUM LOGOS (Semantic Logo Engine)
        // Uses the new semantic engine to analyze brand name for meaning and industry context
        const logoCategory = vibeToCategory[vibe.toLowerCase()] || 'technology';
        const logoAesthetic = vibeToAesthetic[vibe.toLowerCase()] || 'tech-minimal';
        const logoPrimaryColor = options.color || aiColor || selectedTheme.tokens.light.primary;

        let generatedLogos: GeneratedLogo[] = [];
        try {
            // Semantic Generation - Analyzes name "Brewly" -> Coffee/Cup logic
            /* REPLACED BY INFINITE ENGINE AS PER USER REQUEST */

            // 1. Generate via Infinite Engine (SHA-256 Neural Uniqueness)
            // Use Category for context if available, otherwise vibe
            const contextSeed = options.category || vibe.toLowerCase();
            const infiniteResults = await InfiniteLogoEngine.generateBatch(
                name.trim() || 'Brand',
                contextSeed,
                1
            );

            if (infiniteResults.length > 0) {
                const infiniteLogo = infiniteResults[0];

                // Color Injection: The engine returns neutral SVGs. We inject the selected primary color.
                let coloredSvg = infiniteLogo.svg;
                const targetColor = logoPrimaryColor;

                // Smart Color Replacement (Replace white/currentColor with primary brand color)
                if (targetColor) {
                    coloredSvg = coloredSvg
                        .replace(/fill="white"/g, `fill="${targetColor}"`)
                        .replace(/fill="#ffffff"/gi, `fill="${targetColor}"`)
                        .replace(/fill="currentColor"/gi, `fill="${targetColor}"`)
                        .replace(/stroke="white"/g, `stroke="${targetColor}"`)
                        .replace(/stroke="#ffffff"/gi, `stroke="${targetColor}"`)
                        .replace(/stroke="currentColor"/gi, `stroke="${targetColor}"`)
                        .replace(/stop-color="currentColor"/gi, `stop-color="${targetColor}"`)
                        .replace(/stop-color="white"/gi, `stop-color="${targetColor}"`);
                }

                const newGeneratedLogo: GeneratedLogo = {
                    id: infiniteLogo.id,
                    hash: infiniteLogo.id,
                    algorithm: (infiniteLogo.algorithm || 'abstract-mark') as LogoAlgorithm,
                    variant: 0,
                    svg: coloredSvg,
                    viewBox: '0 0 200 200', // Standardized ViewBox
                    meta: {
                        brandName: name,
                        generatedAt: Date.now(),
                        seed: infiniteLogo.id,
                        hashParams: {} as any,
                        geometry: {} as any,
                        colors: { primary: targetColor, palette: [targetColor] }
                    },
                    params: (infiniteLogo.params || {}) as any,
                    quality: {
                        score: infiniteLogo.qualityScore || 90,
                        pathSmoothness: 90,
                        visualBalance: 90,
                        complexity: 50,
                        goldenRatioAdherence: 0,
                        uniqueness: 95
                    }
                };

                generatedLogos = [newGeneratedLogo];

                console.log('[Infinite Engine] Generated Logo:', infiniteLogo.algorithm);
            }

            // Generate all 6 variations for each logo (horizontal, stacked, icon-only, wordmark-only, dark, light)
            if (generatedLogos.length > 0) {
                const tempBrandForVariations = {
                    vibe,
                    category: options.category,
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

        // PERSISTENCE: Save to Supabase (Background) or LocalStorage (Guest)
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
                } else {
                    // FALLBACK: Save to LocalStorage for Guest/Bypass users
                    const isBypass = document.cookie.split(';').some(c => c.trim().startsWith('admin-bypass=true'));
                    if (isBypass) {
                        try {
                            const localHistory = JSON.parse(localStorage.getItem('glyph_guest_history') || '[]');

                            // Create a lightweight version of the brand (strip heavy logo SVG data)
                            const lightweightBrand = {
                                ...newBrand,
                                // Keep only first generated logo reference, strip SVG content
                                generatedLogos: newBrand.generatedLogos?.slice(0, 1).map(logo => ({
                                    ...logo,
                                    svg: '', // Strip SVG to save space
                                    variations: undefined, // Strip variations
                                })) || [],
                            };

                            // Add new brand to start, limit to 15 entries to prevent quota issues
                            const updatedHistory = [
                                {
                                    id: newBrand.id,
                                    identity: lightweightBrand,
                                    created_at: new Date().toISOString()
                                },
                                ...localHistory
                            ].slice(0, 15);

                            localStorage.setItem('glyph_guest_history', JSON.stringify(updatedHistory));
                            console.log('Brand persisted to LocalStorage (lightweight)');
                        } catch (storageError) {
                            // Handle QuotaExceededError gracefully
                            if (storageError instanceof DOMException && storageError.name === 'QuotaExceededError') {
                                console.warn('LocalStorage quota exceeded, clearing old history...');
                                // Clear old history and try again with just the new item
                                try {
                                    const minimalBrand = {
                                        id: newBrand.id,
                                        name: newBrand.name,
                                        vibe: newBrand.vibe,
                                        created_at: new Date().toISOString()
                                    };
                                    localStorage.setItem('glyph_guest_history', JSON.stringify([{ id: newBrand.id, identity: minimalBrand, created_at: new Date().toISOString() }]));
                                } catch (e) {
                                    console.error('Failed to save even minimal history, clearing storage');
                                    localStorage.removeItem('glyph_guest_history');
                                }
                            } else {
                                console.error('LocalStorage Error:', storageError);
                            }
                        }
                    }
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

        // Curated algorithm groups for visual variety (MODERN TECHNIQUES ONLY)
        const algorithmGroups: LogoAlgorithm[][] = [
            ['continuous-stroke', 'line-fragmentation', 'staggered-bars'],                    // Linear/Data
            ['negative-space', 'monogram-merge', 'geometric-extract'],                        // Lettermarks
            ['block-assembly', 'motion-chevrons', 'interlocking-loops'],                      // Geometric/Structure
            ['clover-radial'],                                                                // Radial
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
