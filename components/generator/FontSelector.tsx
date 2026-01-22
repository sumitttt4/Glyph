"use client";

import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Search, Check, Type, X, Filter } from 'lucide-react';
import { fontPairings, FontConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface FontSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    currentFontId: string;
    onSelect: (font: FontConfig) => void;
}

const CATEGORIES = [
    { id: 'recommended', label: '★ Recommended' },
    { id: 'all', label: 'All Fonts' },
    { id: 'sans', label: 'Sans Serif', tags: ['modern', 'minimalist', 'clean', 'tech', 'geometric', 'humanist'] },
    { id: 'serif', label: 'Serif', tags: ['serif', 'classic', 'luxury', 'editorial', 'traditional'] },
    { id: 'display', label: 'Display', tags: ['display', 'retro', 'bold', 'creative', 'impact'] },
    { id: 'mono', label: 'Monospaced', tags: ['mono', 'code', 'technical'] },
];

export const FontSelector = ({ isOpen, onClose, currentFontId, onSelect }: FontSelectorProps) => {
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('recommended');

    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const filteredFonts = useMemo(() => {
        return fontPairings.filter(font => {
            // 1. Search Filter
            const matchesSearch =
                font.name.toLowerCase().includes(search.toLowerCase()) ||
                font.headingName.toLowerCase().includes(search.toLowerCase()) ||
                font.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

            if (!matchesSearch) return false;

            // 2. Category Filter
            if (activeCategory === 'recommended') return font.recommended;
            if (activeCategory === 'all') return true;

            const categoryTags = CATEGORIES.find(c => c.id === activeCategory)?.tags || [];
            return font.tags.some(tag => categoryTags.includes(tag));
        });
    }, [search, activeCategory]);

    if (!isOpen || !mounted) return null;

    // Use Portal to break out of any parent stacking contexts (like transforms in slides)
    // This ensures the modal is always top-level relative to the viewport
    const content = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 bg-stone-950/60 backdrop-blur-md animate-in fade-in duration-200">

            <div
                className="bg-white dark:bg-[#0C0A09] w-full max-w-5xl h-[85vh] rounded-3xl shadow-2xl border border-stone-200 dark:border-white/10 overflow-hidden flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Section */}
                <div className="flex-none p-6 border-b border-stone-100 dark:border-white/5 space-y-6 bg-white/50 dark:bg-black/50 backdrop-blur-xl z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">Typography System</h2>
                            <p className="text-stone-500 dark:text-white/50 text-sm">Select a font pairing to define your brand's voice.</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-stone-100 dark:hover:bg-white/10 rounded-full transition-colors text-stone-500 dark:text-white/60"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 group-focus-within:text-stone-900 dark:group-focus-within:text-white transition-colors" />
                            <input
                                type="text"
                                placeholder="Search 'Inter', 'Serif', 'Tech'..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full h-10 pl-10 pr-4 bg-stone-100 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-stone-900 dark:focus:ring-white outline-none transition-all font-medium text-sm text-stone-900 dark:text-white placeholder:text-stone-400"
                                autoFocus
                            />
                        </div>

                        {/* Category Tabs */}
                        <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-white/5 rounded-xl overflow-x-auto w-full md:w-auto scrollbar-hide">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={cn(
                                        "px-4 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                                        activeCategory === cat.id
                                            ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm"
                                            : "text-stone-500 dark:text-white/40 hover:text-stone-900 dark:hover:text-white"
                                    )}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-stone-50 dark:bg-[#050505]">
                    {filteredFonts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredFonts.map((font) => (
                                <button
                                    key={font.id}
                                    onClick={() => {
                                        onSelect(font);
                                        onClose();
                                    }}
                                    className={cn(
                                        "group relative flex flex-col p-6 rounded-2xl border text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[280px]",
                                        currentFontId === font.id
                                            ? "border-stone-900 dark:border-white ring-1 ring-stone-900 dark:ring-white bg-white dark:bg-white/5"
                                            : "border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-white/20"
                                    )}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{font.tags[0]}</span>
                                            <span className="text-sm font-semibold text-stone-900 dark:text-white/90">{font.name}</span>
                                        </div>
                                        {currentFontId === font.id && (
                                            <div className="bg-stone-900 dark:bg-white text-white dark:text-black rounded-full p-1 shadow-sm">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Type Preview */}
                                    <div className="flex-1 flex flex-col justify-center space-y-3">
                                        <div className={cn("text-4xl leading-none text-stone-900 dark:text-white pb-2 border-b border-stone-100 dark:border-white/5", font.heading.className)}>
                                            {font.headingName}
                                        </div>
                                        <div className={cn("text-sm leading-relaxed text-stone-500 dark:text-white/60", font.body.className)}>
                                            The quick brown fox jumps over the lazy dog. A sophisticated visual identity system.
                                        </div>
                                    </div>

                                    {/* Hover Metadata */}
                                    <div className="mt-4 pt-3 border-t border-stone-50 dark:border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="flex gap-2">
                                            <span className="text-[10px] text-stone-400 font-mono">{font.headingName}</span>
                                            <span className="text-[10px] text-stone-300 dark:text-white/20">+</span>
                                            <span className="text-[10px] text-stone-400 font-mono">{font.bodyName}</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-stone-900 dark:text-white bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded-full">Free</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-stone-400">
                            <Type className="w-12 h-12 mb-4 opacity-20" />
                            <p className="text-lg font-medium">No fonts found</p>
                            <p className="text-sm opacity-60">Try adjusting your search or category filters</p>
                        </div>
                    )}
                </div>

                {/* Footer Info */}
                <div className="p-4 bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-white/5 flex justify-between items-center text-[10px] text-stone-400 uppercase font-bold tracking-widest">
                    <span>{filteredFonts.length} Combinations Available</span>
                    <span>Google Fonts Licensed</span>
                </div>
            </div>

            {/* Backdrop Close Click Area */}
            <div className="absolute inset-0 z-[-1]" onClick={onClose} />
        </div>
    );

    if (typeof document === 'undefined') return null;
    return createPortal(content, document.body);
};
