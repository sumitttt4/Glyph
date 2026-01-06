"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Copy, Check, Shuffle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { SlideCover, SlideStrategy, SlideLogo, SlideColors, SlideTypography } from '@/components/generator/BrandSlides';
import { Mockup3DCard } from '@/components/mockups/Mockup3DCard';
import { MockupDevice, MockupBrowser } from '@/components/mockups/MockupDevice';
import { BrowserBrandPreview } from '@/components/mockups/BrowserBrandPreview';
import { ColorPaletteHorizontal } from '@/components/generator/ColorPaletteStrip';
import { AppIconVariants } from '@/components/generator/AppIconVariants';
import { MockupCreditCard, MockupIDBadge } from '@/components/mockups/MockupMerch';
import { MockupIPhoneHome } from '@/components/mockups/MockupIPhoneHome';
import { MonogramMark } from '@/components/brand/MonogramMark';
import { LogoComposition } from '../brand/LogoComposition';
import { LogoConstruction } from '../brand/LogoConstruction';
import { SafariBrowserMockup } from '../mockups/SafariBrowserMockup';



interface WorkbenchBentoGridProps {
    brand: BrandIdentity;
    isDark: boolean;
    onShuffleLogo?: () => void;
    onSwapFont?: () => void;
    viewMode: 'overview' | 'presentation';
    setViewMode?: (mode: 'overview' | 'presentation') => void;
}

export function WorkbenchBentoGrid({ brand, isDark, onShuffleLogo, onSwapFont, viewMode, setViewMode }: WorkbenchBentoGridProps) {
    // PHASE 4: CONTENT INJECTION
    const CONTENT_TEMPLATES: Record<string, { headline: string; subhead: string; cta: string }> = {
        minimalist: {
            headline: "Design is the silent ambassador.",
            subhead: "We strip away the non-essential to reveal the profound.",
            cta: "Explore the Collection"
        },
        tech: {
            headline: "The future is already here.",
            subhead: "Building the digital infrastructure for the next generation.",
            cta: "Start Building"
        },
        nature: {
            headline: "Return to the source.",
            subhead: "Sustainable living for a balanced, grounded future.",
            cta: "Join the Movement"
        },
        bold: {
            headline: "Make your presence felt.",
            subhead: "For those who refuse to blend into the background.",
            cta: "Get Loud"
        },
        modern: {
            headline: "Simply better business.",
            subhead: "Elevating standards through thoughtful innovation.",
            cta: "Get Started"
        }
    };

    const content = CONTENT_TEMPLATES[brand.vibe] || CONTENT_TEMPLATES.modern;

    // If in Presentation Mode, render the Slide Deck
    if (viewMode === 'presentation') {
        return (
            <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 pb-32">
                <SlideCover brand={brand} />
                <SlideStrategy brand={brand} />
                <SlideLogo brand={brand} />
                <SlideColors brand={brand} />
                <SlideTypography brand={brand} />
            </div>
        );
    }

    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    const mode = isDark ? 'dark' : 'light';
    const tokens = brand.theme.tokens[mode];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedHex(text);
        setTimeout(() => setCopiedHex(null), 1500);
    };

    const colorTokens = [
        { name: 'Primary', color: tokens.primary },
        { name: 'Surface', color: tokens.surface },
        { name: 'Background', color: tokens.bg },
        { name: 'Text', color: tokens.text },
    ];

    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 1. Main Identity Card (Tall) - The "Poster" with Gradient Canvas */}
                <motion.div
                    whileHover={{ scale: 1.005 }}
                    onClick={() => setViewMode?.('presentation')}
                    className="md:col-span-4 md:row-span-2 rounded-[2.5rem] overflow-hidden relative cursor-pointer group shadow-2xl transition-all border border-black/5"
                    style={{
                        background: tokens.gradient
                            ? `linear-gradient(145deg, ${tokens.gradient[0]}, ${tokens.gradient[1]})`
                            : tokens.bg
                    }}
                >
                    {/* Noise texture overlay for premium depth */}
                    <div
                        className="absolute inset-0 opacity-[0.07] pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                        }}
                    />

                    {/* Simple "Click to Expand" Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2">
                            <span>View Brand Details</span>
                        </div>
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-10">
                        {/* Header */}
                        <div className="flex justify-between items-start relative z-30">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                <div className="w-8 h-8 relative">
                                    <LogoComposition
                                        brand={brand}
                                        overrideColors={{ primary: tokens.gradient ? '#FFFFFF' : tokens.text }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Centerpiece - Lettermark Logo */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            {/* Combined Logo: Shape + Initial */}
                            <motion.div
                                layoutId="main-logo"
                                className="w-48 h-48 relative drop-shadow-2xl"
                            >
                                <LogoComposition
                                    brand={brand}
                                    overrideColors={tokens.gradient ? { primary: '#FFFFFF' } : undefined}
                                />
                            </motion.div>

                            <div className="space-y-2">
                                <h1
                                    className="text-5xl font-bold tracking-tighter"
                                    style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}
                                >
                                    {brand.name}
                                </h1>
                                <p
                                    className="text-lg font-medium opacity-70 tracking-wide uppercase"
                                    style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}
                                >
                                    The {brand.vibe} Collection
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end border-t border-white/10 pt-6">
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>Est. 2024</p>
                                <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>San Francisco, CA</p>
                            </div>
                            <div className="text-xs font-mono opacity-50" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>
                                {brand.id.slice(0, 8)}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Construction / Blueprint View */}
                {/* Spans 5 columns on Desktop to create the "Hero Feature" look alongside the 4-col palette below */}
                <div className="md:col-span-5 md:row-span-1 h-[320px] bg-white rounded-[2.5rem] overflow-hidden border border-stone-200 relative group shadow-sm">
                    <LogoConstruction brand={brand} className="w-full h-full" />
                </div>

                {/* Logo Block - Large */}
                <div className="col-span-2 row-span-2 md:col-span-2 md:row-span-1 bg-white rounded-3xl p-6 md:p-8 flex items-center justify-between overflow-hidden relative group hover:shadow-xl transition-all duration-500 border border-stone-100">
                    <div className="flex items-center gap-6 md:gap-8 z-10 w-full">
                        <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 relative">
                            <LogoComposition brand={brand} />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                            <h2 className={cn("text-4xl md:text-5xl font-bold tracking-tight text-stone-950 truncate", brand.font.heading)}>
                                {brand.name}
                            </h2>
                            <p className="text-sm font-mono text-stone-400 uppercase tracking-widest pl-0.5">
                                {brand.logoLayout === 'generative' ? 'Generative Mark' : 'Brand Mark'}
                            </p>
                        </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-y-1/3 translate-x-1/4 scale-150">
                        <LogoComposition brand={brand} />
                    </div>
                </div>

                {/* Safari Browser Mockup - Shows Favicon & Website Preview */}
                <div className="md:col-span-8 md:row-span-1 h-[380px] bg-stone-100 rounded-[2.5rem] overflow-hidden border border-stone-200 relative group p-6 flex items-center justify-center">
                    <SafariBrowserMockup brand={brand} className="w-full max-w-3xl shadow-2xl" />
                </div>
                {/* 3. Color Palette - 4 Core Colors */}
                <div className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-200">
                    <ColorPaletteHorizontal
                        colors={[
                            { label: 'Background', hex: tokens.bg },
                            { label: 'Primary', hex: tokens.primary },
                            { label: 'Surface', hex: tokens.surface },
                            { label: 'Text', hex: tokens.text },
                        ]}
                        className="h-full"
                    />
                </div>

                {/* 3.5. iPhone Home Screen with App Icon */}
                <div className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-200">
                    <MockupIPhoneHome brand={brand} isDark={isDark} />
                </div>

                {/* 4. Mobile Mockup - Context */}
                <div className="md:col-span-3 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden flex items-center justify-center bg-stone-100 border border-stone-200 relative">
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }}
                    />
                    <div className="scale-[0.8] origin-center shadow-2xl rounded-[2.5rem]">
                        <MockupDevice brand={brand} />
                    </div>
                </div>

                {/* 5. Credit Card Mockup */}
                <div
                    className="md:col-span-5 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-200 relative"
                    style={{ backgroundColor: tokens.bg }}
                >
                    <MockupCreditCard brand={brand} isDark={isDark} />
                </div>

                {/* 6. Business Cards */}
                <div className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden bg-stone-50 border border-stone-200 flex items-center justify-center">
                    <Mockup3DCard brand={brand} stacked />
                </div>

                {/* 7. ID Badge Mockup */}
                <div
                    className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-stone-200"
                    style={{ background: `linear-gradient(135deg, ${tokens.surface} 0%, ${tokens.bg} 100%)` }}
                >
                    <MockupIDBadge brand={brand} isDark={isDark} />
                </div>

                {/* 6. Typography Spec - The "Type Specimen" */}
                <div
                    onClick={onSwapFont}
                    className="md:col-span-12 md:row-span-1 h-auto min-h-[400px] rounded-[2.5rem] shadow-xl overflow-hidden relative cursor-pointer group hover:bg-stone-50 transition-colors bg-white border border-stone-200"
                >
                    <div className="p-8 md:p-12 flex flex-col h-full">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2">Type Scale</h3>
                                <p className="text-stone-500 font-mono text-xs tracking-tight">8 Styles • {brand.font.name}</p>
                            </div>
                            <div className="p-3 bg-stone-100 rounded-full group-hover:rotate-180 transition-transform duration-500 hover:bg-stone-200">
                                <RefreshCw className="w-5 h-5 text-stone-500" />
                            </div>
                        </div>

                        {/* Type Scale Grid - 4 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-baseline">

                            {/* Column 1: Display */}
                            <div className="space-y-12">
                                <div className="group/item relative">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">H1</span>
                                        <span className="text-[10px] font-mono text-stone-300">• 96px</span>
                                    </div>
                                    <p className={cn("text-8xl md:text-9xl leading-none text-stone-900", brand.font.heading)}>Aa</p>
                                </div>
                                <div className="group/item relative">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">H2</span>
                                        <span className="text-[10px] font-mono text-stone-300">• 60px</span>
                                    </div>
                                    <p className={cn("text-6xl md:text-7xl leading-tight text-stone-900 break-words", brand.font.heading)}>Title</p>
                                </div>
                            </div>

                            {/* Column 2: Major Headings */}
                            <div className="space-y-10 self-center">
                                <div className="group/item flex items-baseline justify-between border-b border-stone-100 pb-3">
                                    <p className={cn("text-5xl text-stone-900 leading-tight", brand.font.heading)}>Heading 3</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">48px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-stone-100 pb-3">
                                    <p className={cn("text-4xl text-stone-900 leading-tight", brand.font.heading)}>Heading 4</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">36px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-stone-100 pb-3">
                                    <p className={cn("text-3xl text-stone-900 leading-tight", brand.font.heading)}>Heading 5</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">30px</span>
                                </div>
                            </div>

                            {/* Column 3: Minor Headings */}
                            <div className="space-y-8 self-center">
                                <div className="group/item flex items-baseline justify-between border-b border-stone-100 pb-2">
                                    <p className="text-2xl font-semibold text-stone-900">Heading 6</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">24px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-stone-100 pb-2">
                                    <p className="text-xl font-medium text-stone-800">Heading 7</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">20px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-stone-100 pb-2">
                                    <p className="text-lg font-medium text-stone-800">Heading 8</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">18px</span>
                                </div>
                            </div>

                            {/* Column 4: Body & UI */}
                            <div className="space-y-8">
                                <div>
                                    <p className="text-base leading-relaxed text-stone-600 mb-3">
                                        The quick brown fox jumps over the lazy dog. A good typography system establishes hierarchy and improves readability across all devices.
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-stone-300">Body • 16px</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-stone-100">
                                    <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-2">
                                        Caption Text
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-stone-300">Caption • 12px</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
