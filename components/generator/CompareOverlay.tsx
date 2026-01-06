/**
 * Compare Overlay Component
 * 
 * Shows multiple brands side-by-side for comparison.
 */
import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/brand/LogoComposition';
import { X, Check, Copy, Shuffle } from 'lucide-react';
import { getReadableTextColor } from '@/lib/accessibility';

interface CompareOverlayProps {
    brands: BrandIdentity[];
    onClose: () => void;
    onRemove: (id: string) => void;
    onSelect: (brand: BrandIdentity) => void;
    onGenerateMore?: () => void;
    isOpen: boolean;
    isGenerating?: boolean;
}

export function CompareOverlay({ brands, onClose, onRemove, onSelect, onGenerateMore, isOpen, isGenerating }: CompareOverlayProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-stone-100/95 backdrop-blur-lg flex flex-col animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-stone-200 shadow-sm">
                <div className="flex items-center gap-6">
                    <h2 className="text-xl font-bold text-stone-900">Compare Options ({brands.length})</h2>

                    {onGenerateMore && (
                        <button
                            onClick={onGenerateMore}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-4 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-full text-xs font-semibold transition-all disabled:opacity-50"
                        >
                            <Shuffle className="w-3 h-3" />
                            {isGenerating ? 'Generating...' : 'Generate 4 More Variations'}
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                        title="Close Comparison"
                    >
                        <X className="w-5 h-5 text-stone-500" />
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-8">
                {brands.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400">
                        <Shuffle className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-lg font-medium">No brands selected</p>
                        <p className="text-sm">Click the plus or Variations button to start comparing</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {brands.map((brand) => (
                            <div key={brand.id} className="relative group bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                                {/* Remove Button */}
                                <button
                                    onClick={() => onRemove(brand.id)}
                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full text-stone-400 hover:text-red-500 hover:bg-white shadow-md z-10 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Logo Preview Area */}
                                <div
                                    className="aspect-square flex flex-col items-center justify-center relative p-10 overflow-hidden"
                                    style={{ background: brand.theme.tokens.light.bg }}
                                >
                                    {/* Subtle background texture */}
                                    <div className="absolute inset-0 opacity-5 pointer-events-none"
                                        style={{ backgroundImage: `radial-gradient(${brand.theme.tokens.light.primary} 1px, transparent 1px)`, backgroundSize: '16px 16px' }} />

                                    <div className="w-full h-full relative z-10 drop-shadow-2xl scale-125">
                                        <LogoComposition brand={brand} />
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 flex flex-col flex-1 bg-white">
                                    <div className="text-center mb-6">
                                        <h3
                                            className="text-2xl font-bold tracking-tight mb-1"
                                            style={{
                                                fontFamily: brand.font.heading,
                                                color: brand.theme.tokens.light.text
                                            }}
                                        >
                                            {brand.name}
                                        </h3>
                                        <p className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase opacity-40">
                                            {brand.vibe} IDENTITY
                                        </p>
                                    </div>

                                    {/* Details Table */}
                                    <div className="space-y-3 mb-6 pt-4 border-t border-stone-50">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Typeface</span>
                                            <span className="text-xs font-semibold text-stone-700">{brand.font.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider">Palette</span>
                                            <div className="flex gap-1.5">
                                                <div className="w-4 h-4 rounded-full border border-stone-100 shadow-sm" style={{ background: brand.theme.tokens.light.primary }} />
                                                <div className="w-4 h-4 rounded-full border border-stone-100 shadow-sm" style={{ background: brand.theme.tokens.light.accent || brand.theme.tokens.light.primary }} />
                                                <div className="w-4 h-4 rounded-full border border-stone-200 shadow-sm" style={{ background: brand.theme.tokens.light.bg }} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        onClick={() => onSelect(brand)}
                                        className="w-full py-3 bg-stone-50 hover:bg-stone-900 hover:text-white border border-stone-200 rounded-xl text-sm font-bold transition-all duration-300"
                                    >
                                        Select This Brand
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
