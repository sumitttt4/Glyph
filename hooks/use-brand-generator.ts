"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { fontPairings } from '@/lib/fonts';

type Vibe = 'minimalist' | 'tech' | 'nature' | 'bold' | 'modern';

export function useBrandGenerator() {
    const [brand, setBrand] = useState<BrandIdentity | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const generateBrand = (vibe: string) => {
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

            const newBrand: BrandIdentity = {
                id: crypto.randomUUID(),
                vibe,
                name: 'MarkZero Generated', // Could use a name generator later
                theme: randomTheme,
                shape: randomShape,
                font: {
                    id: randomFont.id,
                    name: randomFont.name,
                    heading: randomFont.heading.className, // Store className for easier usage
                    body: randomFont.body.className,
                    tags: randomFont.tags
                },
                createdAt: new Date(),
            };

            setBrand(newBrand);
            setIsGenerating(false);
        }, 800);
    };

    const resetBrand = () => {
        setBrand(null);
    };

    return { brand, generateBrand, isGenerating, resetBrand };
}
