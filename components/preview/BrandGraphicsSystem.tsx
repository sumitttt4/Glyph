"use client";

import React, { useState, useMemo } from 'react';
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

    // Generate all graphics
    const allGraphics = useMemo(() => generateAllBrandGraphics(brand), [brand]);

    // Filter by category
    const filteredGraphics = useMemo(() => {
        if (selectedCategory === 'all') return allGraphics;
        return allGraphics.filter(g => g.category === selectedCategory);
    }, [allGraphics, selectedCategory]);

    // Download SVG
    const downloadSVG = (asset: GraphicAsset) => {
        const blob = new Blob([asset.svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-${asset.type}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    // Download PNG
    const downloadPNG = async (asset: GraphicAsset) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = asset.width;
        canvas.height = asset.height;

        const img = new window.Image();
        const svgBlob = new Blob([asset.svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
            ctx.drawImage(img, 0, 0);
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Brand Graphics System</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {filteredGraphics.length} assets • Click to preview, download as SVG or PNG
                    </p>
                </div>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mb-6 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl">
                {(Object.entries(CATEGORY_CONFIG) as [CategoryFilter, typeof CATEGORY_CONFIG[CategoryFilter]][]).map(([key, config]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedCategory === key
                                ? 'bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                        {config.icon}
                        <span>{config.label}</span>
                        {key !== 'all' && (
                            <span className="text-xs opacity-60">
                                ({allGraphics.filter(g => g.category === key).length})
                            </span>
                        )}
                    </button>
                ))}
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
                            className="group relative rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition-all cursor-pointer"
                            onClick={() => setSelectedAsset(asset)}
                        >
                            {/* Preview */}
                            <div
                                className="aspect-video bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4"
                                dangerouslySetInnerHTML={{
                                    __html: asset.svg.replace(
                                        /width="[^"]*"/,
                                        'width="100%"'
                                    ).replace(
                                        /height="[^"]*"/,
                                        'height="100%"'
                                    )
                                }}
                            />

                            {/* Info overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <div className="flex gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); downloadSVG(asset); }}
                                        className="p-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform"
                                        title="Download SVG"
                                    >
                                        <Download className="w-4 h-4 text-gray-900" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); downloadPNG(asset); }}
                                        className="p-2 bg-white rounded-lg shadow-lg hover:scale-105 transition-transform"
                                        title="Download PNG"
                                    >
                                        <Image className="w-4 h-4 text-gray-900" />
                                    </button>
                                </div>
                            </div>

                            {/* Label */}
                            <div className="px-3 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{asset.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{asset.width}×{asset.height}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Preview Modal */}
            <AnimatePresence>
                {selectedAsset && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
                        onClick={() => setSelectedAsset(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative max-w-5xl w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Preview */}
                            <div
                                className="w-full aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center p-8"
                                dangerouslySetInnerHTML={{
                                    __html: selectedAsset.svg.replace(
                                        /width="[^"]*"/,
                                        'width="100%"'
                                    ).replace(
                                        /height="[^"]*"/,
                                        'height="auto"'
                                    )
                                }}
                            />

                            {/* Actions */}
                            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white">{selectedAsset.name}</h3>
                                    <p className="text-sm text-gray-500">{selectedAsset.width}×{selectedAsset.height} • {selectedAsset.category}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => downloadSVG(selectedAsset)}
                                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        SVG
                                    </button>
                                    <button
                                        onClick={() => downloadPNG(selectedAsset)}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Image className="w-4 h-4" />
                                        PNG
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default BrandGraphicsSystem;
