"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Grid3X3, Layers, MessageSquare, Presentation, Image, Share2, X, ZoomIn } from 'lucide-react';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { BrandIdentity } from '@/lib/data';
import {
    generateAllBrandGraphics,
    GraphicAsset,
    generateDotGridPattern,
    generateLinePattern,
    generateCircleComposition,
    generateGeometricTexture,
    generateWavePattern,
    generateDiagonalLines,
    generateQuoteCard,
    generateFeatureCard,
    generateAnnouncementCard,
    generateTeamCard,
    generateStatsCard,
    generateCTACard,
    generateTitleSlide,
    generateSectionDividerSlide,
    generateContentSlide,
    generateFeatureShowcaseSlide,
    generateStatsSlide,
    generateTimelineSlide,
    generateTeamSlide,
    generateClosingSlide,
    generateHeroSection,
    generateBannerWide,
    generateOGImage,
} from '@/lib/brand-graphics';

// ============================================
// TYPES
// ============================================

interface BrandGraphicsSystemProps {
    brand: BrandIdentity;
    className?: string;
}

type CategoryFilter = 'all' | 'pattern' | 'social' | 'slide' | 'marketing' | 'og';

const CATEGORY_CONFIG: Record<CategoryFilter, { label: string; icon: React.ReactNode }> = {
    all: { label: 'All', icon: <Grid3X3 className="w-4 h-4" /> },
    pattern: { label: 'Patterns', icon: <Layers className="w-4 h-4" /> },
    social: { label: 'Social Cards', icon: <MessageSquare className="w-4 h-4" /> },
    slide: { label: 'Slides', icon: <Presentation className="w-4 h-4" /> },
    marketing: { label: 'Marketing', icon: <Image className="w-4 h-4" /> },
    og: { label: 'OG Images', icon: <Share2 className="w-4 h-4" /> },
};

// ============================================
// COMPONENT
// ============================================

export function BrandGraphicsSystem({ brand, className = '' }: BrandGraphicsSystemProps) {
    const primary = brand.theme.tokens.light.primary;
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    // Generate graphics
    const allGraphics = useMemo(() => generateAllBrandGraphics(brand), [brand]);

    // Filter assets for the active modal
    const modalAssets = useMemo(() => {
        if (!activeCategory) return [];
        return allGraphics.filter(g => {
            if (activeCategory === 'social') return g.category === 'social';
            if (activeCategory === 'slides') return g.category === 'slide';
            if (activeCategory === 'patterns') return g.category === 'pattern';
            if (activeCategory === 'marketing') return g.category === 'marketing' || g.category === 'og';
            return false;
        });
    }, [allGraphics, activeCategory]);

    const cards = [
        {
            id: 'social',
            title: "Social Media Kit",
            count: "Includes 6 Platforms",
            visual: (
                <div className="relative w-48 h-48 flex items-center justify-center">
                    {/* Card 1: Instagram Style */}
                    <div className="absolute w-32 h-32 rounded-xl shadow-2xl transform -rotate-12 -translate-x-12 translate-y-4 border border-stone-700/50 flex flex-col overflow-hidden transition-transform duration-500 group-hover:-translate-x-14"
                        style={{ background: '#1c1917' }}>
                        <div className="h-2 w-full opacity-20" style={{ background: primary }} />
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-8 h-8 opacity-20"><LogoComposition brand={brand} /></div>
                        </div>
                    </div>
                    {/* Card 2: LinkedIn Style (Center) */}
                    <div className="absolute w-36 h-36 rounded-xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] z-10 border border-stone-600 flex flex-col overflow-hidden bg-stone-900 group-hover:scale-105 transition-transform duration-500"
                        style={{ boxShadow: `0 20px 40px -20px ${primary}40` }}> {/* Colored Glow */}
                        <div className="p-3 flex items-center gap-2 border-b border-white/5">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: `${primary}20`, color: primary }}>
                                <LogoComposition brand={brand} />
                            </div>
                            <div className="h-1.5 w-12 bg-white/10 rounded-full" />
                        </div>
                        <div className="flex-1 p-3 flex flex-col gap-2">
                            <div className="h-full w-full rounded-lg opacity-10" style={{ background: primary }} />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'slides',
            title: "Presentation System",
            count: "8 Slide Templates",
            visual: (
                <div className="relative w-full h-full flex items-center justify-center perspective-[1000px]">
                    <div className="relative w-48 h-32 transform rotate-x-[60deg] rotate-z-[-20deg] group-hover:rotate-z-[-10deg] transition-all duration-700">
                        {/* Slide 1 */}
                        <div className="absolute top-0 left-0 w-full h-full bg-stone-900 rounded-lg shadow-2xl border border-stone-700 overflow-hidden flex flex-col hover:-translate-y-4 transition-transform duration-300">
                            <div className="h-full flex flex-col p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="w-8 h-8"><LogoComposition brand={brand} /></div>
                                    <div className="px-2 py-0.5 rounded text-[8px] font-bold text-black" style={{ background: primary }}>2025</div>
                                </div>
                                <div className="h-2 w-2/3 rounded-full mb-1 bg-white/20" />
                                <div className="h-2 w-1/3 rounded-full bg-white/10" />
                            </div>
                            {/* Accent strip */}
                            <div className="h-1 w-full" style={{ background: primary }} />
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'patterns',
            title: "Brand Patterns",
            count: "6 Texture Files",
            visual: (
                <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 opacity-20 transform scale-150 group-hover:rotate-12 transition-all duration-1000">
                        <svg width="100%" height="100%">
                            <pattern id="pat-dot" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.5" fill={primary} />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#pat-dot)" />
                        </svg>
                    </div>
                    <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md z-10 shadow-2xl"
                        style={{ borderColor: `${primary}40` }}>
                        <div className="w-10 h-10" style={{ color: primary }}><LogoComposition brand={brand} /></div>
                    </div>
                </div>
            )
        },
        {
            id: 'marketing',
            title: "Marketing & Ads",
            count: "3 Campaign Assets",
            visual: (
                <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-[80%] aspect-video rounded-lg shadow-2xl overflow-hidden border border-stone-700 group-hover:scale-105 transition-transform duration-500 relative bg-stone-900">
                        {/* Dynamic Gradient Background */}
                        <div className="absolute inset-0 opacity-30"
                            style={{ background: `linear-gradient(135deg, ${primary}40 0%, transparent 100%)` }}
                        />

                        <div className="relative z-10 p-5 flex flex-col h-full justify-between">
                            <div className="text-xs font-mono opacity-50 text-white">CAMPAIGN 01</div>
                            <div>
                                <div className="text-xl font-bold text-white leading-none mb-1">Scale up.</div>
                                <div className="text-sm opacity-60 text-white">With {brand.name}</div>
                            </div>
                        </div>

                        {/* Floating abstract shape */}
                        <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-40"
                            style={{ background: primary }}
                        />
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className={`flex flex-col ${className}`}>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-white">Brand Graphics System</h2>
                    <p className="text-sm text-stone-400">Core identity assets tailored for your brand.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cards.map((card) => (
                    <motion.div
                        key={card.id}
                        onClick={() => setActiveCategory(card.id)}
                        whileHover={{ y: -4 }}
                        className="group relative h-[280px] overflow-hidden rounded-3xl bg-stone-900 border border-stone-800 cursor-pointer shadow-lg transition-all duration-300"
                        style={{
                            // Hover border logic via style for dynamic color
                        }}
                    >
                        {/* Dynamic Hover Border */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-current opacity-50 pointer-events-none transition-colors duration-300 z-30"
                            style={{ color: primary }} />

                        {/* Visual Area */}
                        <div className="absolute inset-0 pb-20 p-6 flex items-center justify-center">
                            {card.visual}
                        </div>

                        {/* Content Area (Bottom) */}
                        <div className="absolute inset-x-0 bottom-0 p-6 z-20 bg-gradient-to-t from-stone-950 via-stone-900 to-transparent pt-12">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--brand-text)] transition-colors"
                                        style={{ '--brand-text': primary } as React.CSSProperties}>{card.title}</h3>
                                    <p className="text-sm text-stone-500 font-medium">{card.count}</p>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                                    <ZoomIn className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-6 text-center">
                <p className="text-xs text-stone-600 uppercase tracking-widest">
                    Click any card to view assets
                </p>
            </div>

            {/* PREVIEW MODAL */}
            {mounted && activeCategory && createPortal(
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                        onClick={() => setActiveCategory(null)}
                    >
                        <motion.div
                            className="w-full max-w-6xl max-h-[90vh] bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-5 border-b border-stone-800 flex justify-between items-center bg-stone-900 z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white capitalize">{activeCategory === 'slides' ? 'Presentation Deck' : activeCategory} Kit</h3>
                                    <p className="text-sm text-stone-400">
                                        {modalAssets.length} Generated Assets • {primary}
                                    </p>
                                </div>
                                <button onClick={() => setActiveCategory(null)} className="p-2 hover:bg-stone-800 rounded-full text-stone-400">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Grid */}
                            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-stone-950">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {modalAssets.map((asset, i) => (
                                        <div key={i} className="group flex flex-col gap-3">
                                            <div className="aspect-video bg-white rounded-lg overflow-hidden border border-stone-800 relative shadow-md group-hover:shadow-xl transition-all">
                                                <div dangerouslySetInnerHTML={{ __html: asset.svg.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"') }}
                                                    className="w-full h-full" />
                                            </div>
                                            <div className="flex justify-between items-center px-1">
                                                <span className="text-sm text-stone-300 font-medium capitalize">{asset.name}</span>
                                                <button className="text-xs text-stone-500 hover:text-white border border-stone-800 px-2 py-1 rounded">
                                                    SVG
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {modalAssets.length === 0 && (
                                        <div className="col-span-full py-20 text-center text-stone-500">
                                            No assets generated for this category yet.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-stone-800 bg-stone-900 flex justify-end">
                                <button className="px-6 py-3 rounded-xl font-bold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all"
                                    style={{ background: primary }}>
                                    Download All Assets
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

export default BrandGraphicsSystem;
