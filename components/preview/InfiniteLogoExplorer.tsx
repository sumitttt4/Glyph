"use client";
import React, { useState, useEffect } from 'react';
import { InfiniteLogoEngine } from '@/lib/logo-engine-v2/master';
import { InfiniteLogoResult } from '@/lib/logo-engine-v2/types';
import { BrandIdentity } from '@/lib/data';
import { GeneratedLogo, LogoAlgorithm } from '@/components/logo-engine/types';
import { RefreshCw, Sparkles, Plus, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InfiniteLogoExplorer({ brand, onUpdateBrand }: { brand: BrandIdentity, onUpdateBrand?: (updates: Partial<BrandIdentity>) => void }) {
    const [logos, setLogos] = useState<InfiniteLogoResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const loadLogos = async (reset = false) => {
        setLoading(true);
        // Generate batch
        const batch = await InfiniteLogoEngine.generateBatch(brand.name, 'tech', 8);
        setLogos(prev => reset ? batch : [...prev, ...batch]);
        setLoading(false);
    };

    useEffect(() => {
        loadLogos(true);
        // Recover selection
        const saved = localStorage.getItem('glyph_selected_logo');
        if (saved) setSelectedId(saved);
    }, [brand.name]);

    const handleSelectLogo = (logo: InfiniteLogoResult) => {
        setSelectedId(logo.id);
        localStorage.setItem('glyph_selected_logo', logo.id);

        if (!onUpdateBrand) return;

        // Convert to Premium GeneratedLogo Structure
        // This ensures the rest of the app (Sidebar, Mockups) can consume it
        const newLogo: GeneratedLogo = {
            id: logo.id,
            hash: logo.id,
            algorithm: 'line-fragmentation', // Default or map if possible
            variant: 0,
            svg: logo.svg,
            viewBox: '0 0 200 200',
            meta: {
                brandName: brand.name,
                generatedAt: Date.now(),
                seed: logo.id,
                hashParams: {
                    brandName: brand.name,
                    category: 'technology',
                    timestamp: Date.now(),
                    salt: 'manual-select',
                    hashHex: logo.id
                },
                geometry: {
                    usesGoldenRatio: false,
                    gridBased: true,
                    bezierCurves: true,
                    symmetry: 'none',
                    pathCount: 1,
                    complexity: 0.5
                },
                colors: {
                    primary: brand.theme.tokens.light.primary,
                    palette: [brand.theme.tokens.light.primary]
                }
            },
            params: {} as any,
            quality: {
                score: logo.qualityScore,
                pathSmoothness: 80,
                visualBalance: 80,
                complexity: 50,
                goldenRatioAdherence: 0,
                uniqueness: 90
            }
        };

        // Update Brand State
        // We prepend to generatedLogos and select index 0
        const currentLogos = brand.generatedLogos || [];
        onUpdateBrand({
            generatedLogos: [newLogo, ...currentLogos],
            selectedLogoIndex: 0
        });
    };

    return (
        <div className="w-full bg-stone-950 p-6 md:p-8 rounded-3xl border border-stone-900 shadow-2xl relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Header */}
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-orange-500 w-5 h-5" />
                        Infinite Logo Explorer
                    </h3>
                    <p className="text-stone-400 text-sm mt-1 max-w-md">
                        Mining 10^100 unique seeds using SHA-256 neural uniqueness.
                        Exploring <span className="text-orange-500 font-mono">100+ Algorithm Variants</span>.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => loadLogos(true)}
                        className="px-4 py-2 bg-stone-900 border border-stone-800 text-stone-300 rounded-full text-sm font-medium hover:bg-stone-800 transition-colors flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        Reroll Seed
                    </button>
                    <button
                        onClick={() => loadLogos(false)}
                        className="px-4 py-2 bg-[#F97316] text-white rounded-full text-sm font-medium hover:bg-orange-600 transition-colors shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center gap-2"
                        disabled={loading}
                    >
                        <Plus className="w-4 h-4" />
                        Load More
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                    {logos.map((logo, i) => (
                        <motion.div
                            key={logo.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: i * 0.05, duration: 0.4 }}
                            className={`aspect-square relative group overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer ${selectedId === logo.id
                                ? 'bg-stone-900 border-orange-500 ring-2 ring-orange-500/20'
                                : 'bg-stone-900/50 border-stone-800 hover:border-stone-600 hover:bg-stone-800'
                                }`}
                            onClick={() => handleSelectLogo(logo)}
                        >
                            <div className="absolute inset-0 flex items-center justify-center p-8 text-white transition-transform duration-500 group-hover:scale-105"
                                dangerouslySetInnerHTML={{ __html: logo.svg }}
                            />

                            {/* Selected Indicator */}
                            {selectedId === logo.id && (
                                <div className="absolute top-3 right-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in duration-200">
                                    <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                </div>
                            )}

                            {/* Info Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-stone-950/90 backdrop-blur-md p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 border-t border-stone-800">
                                <div className="flex flex-col gap-1">
                                    <span className="text-orange-500 text-[10px] font-bold uppercase tracking-widest truncate">
                                        {logo.algorithm}
                                    </span>
                                    <span className="text-stone-300 text-xs font-medium truncate">
                                        {logo.description || 'Custom Variant'}
                                    </span>
                                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-stone-800/50">
                                        <span className="text-[10px] text-stone-500 font-mono">
                                            QS: {logo.qualityScore}
                                        </span>
                                        <span className="text-[10px] text-stone-500 font-mono">
                                            #{logo.id.substring(0, 4)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Loader Skeleton if loading more */}
                {loading && logos.length > 0 && Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-stone-900/30 rounded-2xl border border-stone-800/50 animate-pulse" />
                ))}
            </div>

            {logos.length === 0 && loading && (
                <div className="h-64 flex flex-col items-center justify-center text-stone-500 gap-4">
                    <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    Generating Batch...
                </div>
            )}
        </div>
    );
}
