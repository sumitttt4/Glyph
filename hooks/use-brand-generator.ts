"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { fontPairings } from '@/lib/fonts';

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

    const generateBrand = (
        vibe: string,
        name: string = 'Glyph Generated',
        options: {
            color?: string;
            shape?: string;
            gradient?: { colors: string[]; angle: number } | null;
            surpriseMe?: boolean
        } = {}
    ) => {
        setIsGenerating(true);

        // Simulate thinking time
        setTimeout(() => {
            const filterContent = <T extends { tags: string[] }>(items: T[]) => {
                const matches = items.filter(item => item.tags.includes(vibe));
                return matches.length > 0 ? matches : items;
            };

            // 1. SELECT THEME (or override)
            let selectedTheme: typeof THEMES[0];

            if (options.color || options.gradient) {
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
                            primary: options.color || baseTheme.tokens.light.primary,
                            // Use gradient if provided, otherwise keep theme's default or none
                            gradient: options.gradient ? [options.gradient.colors[0], options.gradient.colors[1]] : baseTheme.tokens.light.gradient,
                        },
                        dark: {
                            ...baseTheme.tokens.dark,
                            primary: options.color || baseTheme.tokens.dark.primary,
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
            const randomFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];

            // Get Strategy Template or default to Modern
            const strategy = STRATEGY_TEMPLATES[vibe] || STRATEGY_TEMPLATES['modern'];

            const newBrand: BrandIdentity = {
                id: crypto.randomUUID(),
                vibe,
                name: name.trim() || 'Untitled Brand',
                theme: selectedTheme,
                shape: selectedShape,
                font: {
                    id: randomFont.id,
                    name: randomFont.name,
                    heading: randomFont.heading.className,
                    body: randomFont.body.className,
                    tags: randomFont.tags
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
        }, 1500);
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

    return {
        brand,
        generateBrand,
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
