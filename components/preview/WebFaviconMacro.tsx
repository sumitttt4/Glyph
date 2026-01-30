"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { cn } from '@/lib/utils';
import { generateDeepColor } from '@/lib/utils';
import { Globe, Lock } from 'lucide-react';

// ============================================
// COMPONENT: BROWSER MOCKUP
// ============================================

function BrowserPreview({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;

    return (
        <div className="w-full max-w-md bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            {/* Tab Bar */}
            <div className="h-10 bg-[#2d2d2d] flex items-center px-3 gap-2 border-b border-black/50">
                <div className="flex gap-1.5 mr-4">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                    <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>

                {/* Active Tab */}
                <div className="relative h-8 px-4 bg-[#1e1e1e] rounded-t-lg flex items-center gap-2 text-xs text-white/90 min-w-[120px] shadow-sm">
                    {/* Favicon 16px */}
                    <div className="w-4 h-4 rounded-sm bg-stone-800 flex items-center justify-center overflow-hidden">
                        <LogoComposition brand={brand} className="w-3 h-3" overrideColors={{ primary }} />
                    </div>
                    <span className="truncate max-w-[100px] font-medium">{brand.name} — Official</span>

                    {/* Active Line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ backgroundColor: primary }} />
                </div>

                {/* Inactive Tab */}
                <div className="h-8 px-4 flex items-center gap-2 text-xs text-white/30 border-r border-white/5">
                    <div className="w-3 h-3 rounded-full bg-white/10" />
                    <div className="w-16 h-2 rounded bg-white/10" />
                </div>
            </div>

            {/* Address Bar */}
            <div className="h-12 bg-[#333333] flex items-center px-4 gap-4 border-b border-black/20">
                <div className="flex gap-4 text-white/30">
                    <div className="w-4 h-4 rounded bg-white/10" />
                    <div className="w-4 h-4 rounded bg-white/10" />
                    <div className="w-4 h-4 rounded bg-white/10" />
                </div>

                {/* URL Input */}
                <div className="flex-1 h-8 bg-[#1e1e1e] rounded-md flex items-center px-3 gap-2 text-xs text-secondary box-border border border-black/20 text-white/50">
                    <Lock size={10} className="text-white/30" />
                    <span className="text-white/80">{brand.name.toLowerCase()}.com</span>
                </div>
            </div>

            {/* Viewport Content */}
            <div className="h-48 bg-stone-900 relative overflow-hidden flex flex-col items-center justify-center">
                {/* Hero Content Simulation */}
                <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(circle at 50% 50%, ${primary} 0%, transparent 70%)` }} />
                <h1 className={cn("text-3xl font-bold text-white mb-2 relative z-10", brand.font.heading)}>{brand.name}</h1>
                <button className="px-4 py-1.5 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded relative z-10 hover:scale-105 transition-transform">
                    Get Started
                </button>
            </div>
        </div>
    );
}

// ============================================
// COMPONENT: FAVICON GRID
// ============================================

function FaviconGrid({ brand }: { brand: BrandIdentity }) {
    const sizes = [
        { px: 16, label: 'Favicon' },
        { px: 32, label: 'Retina' },
        { px: 180, label: 'Touch Icon' },
    ];

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
                <Globe size={16} className="text-stone-400" />
                <h3 className="text-xl font-bold text-white">Web Identity</h3>
            </div>
            <p className="text-sm text-stone-500 max-w-xs leading-relaxed">
                Optimized browser assets ensuring legibility at micro-scales and brand presence in tab bars.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-4">
                {sizes.map((s) => (
                    <div key={s.px} className="flex flex-col items-center gap-3 group">
                        <div
                            className="bg-[#1e1e1e] border border-white/10 rounded-xl flex items-center justify-center relative overflow-hidden transition-colors hover:border-white/20"
                            style={{ width: s.px === 180 ? 80 : 80, height: 80 }}
                        >
                            {/* Render Logo at appropriate visual scale, but simulated inside the box */}
                            <div style={{ width: s.px === 180 ? 40 : s.px, height: s.px === 180 ? 40 : s.px }}>
                                <LogoComposition brand={brand} />
                            </div>

                            {/* Size Label on Hover */}
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-mono text-white">{s.px}px</span>
                            </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-stone-500">{s.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT: WEB FAVICON MACRO
// ============================================

export function WebFaviconMacro({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    return (
        <section
            className="relative w-full overflow-hidden py-24 border-t border-white/5"
            style={{
                background: `linear-gradient(180deg, ${colors.deeper} 0%, ${colors.deep} 100%)`
            }}
        >
            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-16 md:gap-32">

                    {/* LEFT: Browser Mockup */}
                    <div className="flex justify-center">
                        <BrowserPreview brand={brand} />
                    </div>

                    {/* RIGHT: Favicon System */}
                    <div>
                        <FaviconGrid brand={brand} />
                    </div>
                </div>
            </div>
        </section>
    );
}
