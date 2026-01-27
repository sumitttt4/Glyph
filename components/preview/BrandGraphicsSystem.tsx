"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Grid3X3, Layers, MessageSquare, Presentation, Image, Share2 } from 'lucide-react';
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
    const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
    const [selectedAsset, setSelectedAsset] = useState<GraphicAsset | null>(null);
    const [mounted, setMounted] = useState(false);

    // Mount state for portal
    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const colors = brand.theme.tokens.light;

    // Generate all graphics
    const allGraphics = useMemo(() => generateAllBrandGraphics(brand), [brand]);

    // Filter by category
    const filteredGraphics = useMemo(() => {
        if (selectedCategory === 'all') return allGraphics;
        return allGraphics.filter(g => g.category === selectedCategory);
    }, [allGraphics, selectedCategory]);

    // Download helpers
    const downloadSVG = (asset: GraphicAsset) => {
        const blob = new Blob([asset.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-${asset.type}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const downloadPNG = async (asset: GraphicAsset) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale for high res
        const scale = 2;
        canvas.width = asset.width * scale;
        canvas.height = asset.height * scale;
        ctx.scale(scale, scale);

        const img = new window.Image();
        const svgBlob = new Blob([asset.svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0, asset.width, asset.height);
            URL.revokeObjectURL(url);
            canvas.toBlob((blob) => {
                if (blob) {
                    const pngUrl = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = pngUrl;
                    link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-${asset.type}.png`;
                    link.click();
                    URL.revokeObjectURL(pngUrl);
                }
            }, 'image/png');
        };
        img.src = url;
    };

    return (
        <div className={`flex flex-col ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold" style={{ color: colors.text }}>Brand Graphics System</h2>
                    <p className="text-sm opacity-60" style={{ color: colors.text }}>
                        {filteredGraphics.length} assets • Click to preview, download as SVG or PNG
                    </p>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6 p-2 rounded-xl transition-colors" style={{ background: colors.surface }}>
                {(Object.entries(CATEGORY_CONFIG) as [CategoryFilter, typeof CATEGORY_CONFIG[CategoryFilter]][]).map(([key, config]) => {
                    const isActive = selectedCategory === key;
                    return (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive ? 'shadow-sm' : 'opacity-60 hover:opacity-100'
                                }`}
                            style={{
                                background: isActive ? colors.bg : 'transparent',
                                color: colors.text,
                                border: isActive ? `1px solid ${colors.border}` : '1px solid transparent'
                            }}
                        >
                            {config.icon}
                            <span>{config.label}</span>
                            {key !== 'all' && (
                                <span className="text-xs opacity-60">
                                    ({allGraphics.filter(g => g.category === key).length})
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Graphics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                    {filteredGraphics.map((asset) => (
                        <motion.div
                            key={asset.type}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                            className="group relative rounded-xl border overflow-hidden transition-all cursor-pointer hover:shadow-lg"
                            style={{
                                borderColor: colors.border,
                                background: colors.surface
                            }}
                            onClick={() => setSelectedAsset(asset)}
                        >
                            {/* Preview */}
                            <div
                                className="aspect-video flex items-center justify-center p-4 relative"
                                style={{ background: colors.bg }} // Use brand bg for preview area
                            >
                                <div
                                    className="w-full h-full flex items-center justify-center"
                                    dangerouslySetInnerHTML={{
                                        __html: asset.svg.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="100%"')
                                    }}
                                />

                                {/* Info overlay */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[1px]">
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); downloadSVG(asset); }}
                                            className="p-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform"
                                            title="Download SVG"
                                        >
                                            <Download className="w-4 h-4 text-black" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); downloadPNG(asset); }}
                                            className="p-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform"
                                            title="Download PNG"
                                        >
                                            <Image className="w-4 h-4 text-black" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Label */}
                            <div className="px-3 py-2 border-t" style={{ borderColor: colors.border, background: colors.surface }}>
                                <p className="text-sm font-medium truncate" style={{ color: colors.text }}>{asset.name}</p>
                                <p className="text-xs opacity-50" style={{ color: colors.text }}>{asset.width}×{asset.height}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Preview Modal - Rendered via Portal to escape layout context */}
            {mounted && createPortal(
                <AnimatePresence>
                    {selectedAsset && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
                            onClick={() => setSelectedAsset(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="relative max-w-5xl w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                                style={{ background: colors.bg }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.border, background: colors.surface }}>
                                    <div>
                                        <h3 className="font-bold text-lg" style={{ color: colors.text }}>{selectedAsset.name}</h3>
                                        <p className="text-sm opacity-60" style={{ color: colors.text }}>{selectedAsset.width}×{selectedAsset.height} • {selectedAsset.category}</p>
                                    </div>
                                    <button className="p-2 hover:bg-black/5 rounded-full" onClick={() => setSelectedAsset(null)}>
                                        <Share2 className="w-5 h-5" style={{ color: colors.text }} />
                                    </button>
                                </div>

                                {/* Preview */}
                                <div
                                    className="flex-1 overflow-auto flex items-center justify-center p-8"
                                    style={{ background: colors.bg }}
                                >
                                    <div
                                        className="max-w-full max-h-full shadow-lg"
                                        dangerouslySetInnerHTML={{
                                            __html: selectedAsset.svg.replace(/width="[^"]*"/, 'width="100%"').replace(/height="[^"]*"/, 'height="auto"')
                                        }}
                                        style={{ width: selectedAsset.width > 800 ? '100%' : selectedAsset.width, maxWidth: '100%' }}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 p-6 border-t" style={{ borderColor: colors.border, background: colors.surface }}>
                                    <button
                                        onClick={() => downloadSVG(selectedAsset)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors hover:opacity-80"
                                        style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
                                    >
                                        <Download className="w-4 h-4" />
                                        SVG
                                    </button>
                                    <button
                                        onClick={() => downloadPNG(selectedAsset)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors hover:opacity-90 shadow-sm"
                                        style={{ background: colors.primary }}
                                    >
                                        <Image className="w-4 h-4" />
                                        Download PNG
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
}

export default BrandGraphicsSystem;
