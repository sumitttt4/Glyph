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

    const generateBrand = (vibe: string, name: string = 'Glyph Generated') => {
        setIsGenerating(true);

        // Simulate thinking time
        setTimeout(() => {
            const filterContent = <T extends { tags: string[] }>(items: T[]) => {
                const matches = items.filter(item => item.tags.includes(vibe));
                return matches.length > 0 ? matches : items;
            };

            const availableThemes = filterContent(THEMES);
            const availableShapes = filterContent(SHAPES);
            const availableFonts = filterContent(fontPairings);

            const randomTheme = availableThemes[Math.floor(Math.random() * availableThemes.length)];
            const randomShape = availableShapes[Math.floor(Math.random() * availableShapes.length)];
            const randomFont = availableFonts[Math.floor(Math.random() * availableFonts.length)];

            // Get Strategy Template or default to Modern
            const strategy = STRATEGY_TEMPLATES[vibe] || STRATEGY_TEMPLATES['modern'];

            const newBrand: BrandIdentity = {
                id: crypto.randomUUID(),
                vibe,
                name: name.trim() || 'Untitled Brand', // Use provided name or default
                theme: randomTheme,
                shape: randomShape,
                font: {
                    id: randomFont.id,
                    name: randomFont.name,
                    heading: randomFont.heading.className, // Store className for easier usage
                    body: randomFont.body.className,
                    tags: randomFont.tags
                },
                strategy: {
                    ...strategy,
                    // Inject brand name into mission dynamically if simplified
                    mission: strategy.mission.replace('To ', `To help ${name.trim()} `).replace('To help Glyph Generated ', 'To ')
                },
                createdAt: new Date(),
            };

            setBrand(newBrand);
            setIsGenerating(false);
        }, 1500); // Increased time slightly for "quality" feel
    };

    const resetBrand = () => {
        setBrand(null);
    };

    return { brand, generateBrand, isGenerating, resetBrand };
}
