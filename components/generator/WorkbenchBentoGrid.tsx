"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { Copy, Check, Shuffle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { SlideCover, SlideStrategy, SlideLogo, SlideColors } from '@/components/generator/BrandSlides';
import { Mockup3DCard } from '@/components/mockups/Mockup3DCard';
import { MockupDevice, MockupBrowser } from '@/components/mockups/MockupDevice';
import { BrowserBrandPreview } from '@/components/mockups/BrowserBrandPreview';

import { BrandLogo } from '@/components/brand/BrandLogo';

// ... (imports remain)

interface WorkbenchBentoGridProps {
    brand: BrandIdentity;
    isDark: boolean;
    onShuffleLogo?: () => void;
    onSwapFont?: () => void;
    viewMode: 'overview' | 'presentation';
    setViewMode?: (mode: 'overview' | 'presentation') => void;
}

export function WorkbenchBentoGrid({ brand, isDark, onShuffleLogo, onSwapFont, viewMode, setViewMode }: WorkbenchBentoGridProps) {
    // ... (CONTENT_TEMPLATES logic remains)

    // ... (Presentation Mode check remains)

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
                                <svg viewBox="0 0 24 24" className="w-8 h-8" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>
                                    <path d={brand.shape.path} fill="currentColor" />
                                </svg>
                            </div>
                        </div>

                        {/* Centerpiece - Lettermark Logo */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            {/* Combined Logo: Shape + Initial */}
                            <motion.div
                                layoutId="main-logo"
                                className="w-48 h-48 relative drop-shadow-2xl"
                            >
                                <BrandLogo
                                    brand={brand}
                                    mode={tokens.gradient ? 'dark' : 'light'}
                                    className="w-full h-full"
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

                {/* 2. Web Browser Mockup - "Browser-in-Browser" Preview */}
                <div className="md:col-span-5 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden relative">
                    <BrowserBrandPreview brand={brand} />
                </div>

                {/* 3. Color Palette - The "Chips" */}
                {/* Spans 3 columns */}
                <div className="md:col-span-3 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col border border-stone-200 bg-white">
                    <div className="p-6 pb-2">
                        <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest">Palette</h3>
                    </div>
                    <div className="flex-1 p-2 flex flex-col gap-2">
                        {colorTokens.map((token) => (
                            <button
                                key={token.name}
                                onClick={() => copyToClipboard(token.color)}
                                className="flex-1 rounded-xl flex items-center justify-between px-4 group hover:scale-[1.02] transition-transform"
                                style={{ backgroundColor: token.color }}
                            >
                                <span className="text-xs font-bold uppercase mix-blend-difference text-white opacity-80">{token.name}</span>
                                <span className="text-[10px] font-mono mix-blend-difference text-white bg-black/20 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {copiedHex === token.color ? 'COPIED' : token.color}
                                </span>
                            </button>
                        ))}
                    </div>
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

                {/* 5. 3D Business Cards - The "Merch" Shot */}
                <div className="md:col-span-5 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden bg-stone-50 border border-stone-200 flex items-center justify-center">
                    <Mockup3DCard brand={brand} stacked />
                </div>

                {/* 6. Typography Spec - The "Type Specimen" */}
                <div
                    onClick={onSwapFont}
                    className="md:col-span-12 md:row-span-1 h-auto min-h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden relative cursor-pointer group hover:bg-stone-50 transition-colors bg-white border border-stone-200"
                >
                    <div className="p-8 md:p-10 flex flex-col justify-between h-full">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-1">Type Scale</h3>
                                <p className="text-stone-500 font-mono text-xs">8 Styles • {brand.font.name}</p>
                            </div>
                            <div className="p-2 bg-stone-100 rounded-full group-hover:rotate-180 transition-transform duration-500">
                                <RefreshCw className="w-5 h-5 text-stone-400" />
                            </div>
                        </div>

                        {/* Type Scale Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                            {/* Column 1: Display */}
                            <div className="space-y-6">
                                <div className="group/item">
                                    <p className="text-xs font-mono text-stone-400 mb-1">H1 • 96px</p>
                                    <p className="text-7xl md:text-8xl font-bold leading-none text-stone-900 tracking-tighter">Aa</p>
                                </div>
                                <div className="group/item">
                                    <p className="text-xs font-mono text-stone-400 mb-1">H2 • 60px</p>
                                    <p className="text-5xl md:text-6xl font-bold leading-tight text-stone-900 tracking-tighter">Title</p>
                                </div>
                            </div>

                            {/* Column 2: Headings */}
                            <div className="space-y-6 flex flex-col justify-end">
                                <div className="group/item border-b border-stone-100 pb-2">
                                    <div className="flex justify-between items-baseline w-full">
                                        <p className="text-4xl md:text-5xl font-bold text-stone-900 tracking-tight">Heading 3</p>
                                        <span className="text-[10px] font-mono text-stone-400">48px</span>
                                    </div>
                                </div>
                                <div className="group/item border-b border-stone-100 pb-2">
                                    <div className="flex justify-between items-baseline w-full">
                                        <p className="text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">Heading 4</p>
                                        <span className="text-[10px] font-mono text-stone-400">36px</span>
                                    </div>
                                </div>
                                <div className="group/item border-b border-stone-100 pb-2">
                                    <div className="flex justify-between items-baseline w-full">
                                        <p className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight">Heading 5</p>
                                        <span className="text-[10px] font-mono text-stone-400">30px</span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 3: Subheadings */}
                            <div className="space-y-6 flex flex-col justify-end">
                                <div className="group/item border-b border-stone-100 pb-2">
                                    <div className="flex justify-between items-baseline w-full">
                                        <p className="text-xl md:text-2xl font-semibold text-stone-900 tracking-tight">Heading 6</p>
                                        <span className="text-[10px] font-mono text-stone-400">24px</span>
                                    </div>
                                </div>
                                <div className="group/item border-b border-stone-100 pb-2">
                                    <div className="flex justify-between items-baseline w-full">
                                        <p className="text-lg md:text-xl font-medium text-stone-800 tracking-tight">Heading 7</p>
                                        <span className="text-[10px] font-mono text-stone-400">20px</span>
                                    </div>
                                </div>
                                <div className="group/item border-b border-stone-100 pb-2">
                                    <div className="flex justify-between items-baseline w-full">
                                        <p className="text-base md:text-lg font-medium text-stone-800 tracking-tight">Heading 8</p>
                                        <span className="text-[10px] font-mono text-stone-400">18px</span>
                                    </div>
                                </div>
                            </div>

                            {/* Column 4: Body & Caption */}
                            <div className="space-y-4 flex flex-col justify-end">
                                <div>
                                    <p className="text-base leading-relaxed text-stone-600">
                                        The quick brown fox jumps over the lazy dog. A good typography system establishes hierarchy and improves readability across all devices.
                                    </p>
                                    <p className="text-[10px] font-mono text-stone-400 mt-2">Body • 16px</p>
                                </div>
                                <div className="pt-4 border-t border-stone-100">
                                    <p className="text-xs text-stone-500 uppercase tracking-widest">
                                        Caption Text
                                    </p>
                                    <p className="text-[10px] font-mono text-stone-400 mt-1">Caption • 12px</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
