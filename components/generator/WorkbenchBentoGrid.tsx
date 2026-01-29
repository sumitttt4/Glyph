"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { SocialMediaKit } from '@/components/preview/SocialMediaKit';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { FontSelector } from './FontSelector';
import { FontConfig } from '@/lib/fonts';
import { BrandMockups } from '@/components/preview/BrandMockups';
import { BrandGraphicsSystem } from '@/components/preview/BrandGraphicsSystem';
import { BrandManifesto } from './BrandManifesto';
import { BrandGuidelinesDocs } from './BrandGuidelines';



interface WorkbenchBentoGridProps {
    brand: BrandIdentity;
    isDark: boolean;
    onShuffleLogo?: () => void;
    onSwapFont?: () => void;
    onUpdateFont?: (font: FontConfig) => void;
    onCycleColor?: () => void;
    onSelectColor?: (color: { light: string; dark: string }) => void;
    onVariations?: () => void;
    onUpdateBrand?: (updates: Partial<BrandIdentity>) => void;
    viewMode: 'overview' | 'presentation';
    setViewMode?: (mode: 'overview' | 'presentation') => void;
}

export function WorkbenchBentoGrid({
    brand,
    isDark,
    onShuffleLogo,
    onSwapFont,
    onUpdateFont,
    onCycleColor,
    onSelectColor,
    onVariations,
    onUpdateBrand,
    viewMode,
    setViewMode
}: WorkbenchBentoGridProps) {
    // State
    const [isFontSelectorOpen, setIsFontSelectorOpen] = useState(false);

    // Generate robust Data URL for the logo using client-side DOM extraction (Build Safe)
    const [logoDataUrl, setLogoDataUrl] = useState('');
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logoRef.current) {
            const svgElement = logoRef.current.querySelector('svg');
            if (svgElement) {
                const svgString = svgElement.outerHTML;
                const finalSvg = svgString.includes('xmlns')
                    ? svgString
                    : svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
                const dataUrl = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(finalSvg)))}`;
                setLogoDataUrl(dataUrl);
            }
        }
    }, [brand]);

    // NEW: Overview Mode renders the immersive Brand Manifesto (Marketing/Awwwards Style)
    if (viewMode === 'overview') {
        return (
            <BrandManifesto
                brand={brand}
                onViewModeChange={setViewMode}
            />
        );
    }

    // Guidelines Mode (Clean Documentation/Engineering Style - like Stripe Docs)
    if (viewMode === 'presentation') {
        return (
            <BrandGuidelinesDocs
                brand={brand}
                onUpdateFont={onUpdateFont}
                onSelectColor={onSelectColor}
            />
        );
    }

    // Fallback: Render BrandManifesto by default
    return (
        <BrandManifesto
            brand={brand}
            onViewModeChange={setViewMode}
            onUpdateBrand={onUpdateBrand}
        />
    );
}
