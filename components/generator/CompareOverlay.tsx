/**
 * Compare Overlay Component
 * 
 * Shows multiple brands side-by-side for comparison.
 */
import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/brand/LogoComposition';
import { X, Check, Copy } from 'lucide-react';
import { getReadableTextColor } from '@/lib/accessibility';

interface CompareOverlayProps {
    brands: BrandIdentity[];
    onClose: () => void;
    onRemove: (id: string) => void;
    isOpen: boolean;
}

export function CompareOverlay({ brands, onClose, onRemove, isOpen }: CompareOverlayProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-stone-100/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-stone-200 shadow-sm">
                <h2 className="text-xl font-bold text-stone-900">Compare Options ({brands.length})</h2>
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
            <div className="flex-1 overflow-y-auto p-6">
                {brands.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-stone-400">
                        <p className="text-lg font-medium">No brands selected</p>
                        <p className="text-sm">Add brands from history to compare them</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
                        {brands.map((brand) => (
                            <div key={brand.id} className="relative group bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col h-[400px]">
                                {/* Remove Button */}
                                <button
                                    onClick={() => onRemove(brand.id)}
                                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur rounded-full text-stone-400 hover:text-red-500 hover:bg-white shadow-sm z-10 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                {/* Logo Preview - Large */}
                                <div
                                    className="flex-1 p-8 flex flex-col items-center justify-center relative"
                                    style={{ background: brand.theme.tokens.light.bg }}
                                >
                                    <div className="w-40 h-40 relative">
                                        <LogoComposition brand={brand} />
                                    </div>
                                    <div className="mt-6 text-center">
                                        <h3
                                            className="text-2xl font-bold tracking-tight"
                                            style={{
                                                fontFamily: brand.font.heading,
                                                color: getReadableTextColor(brand.theme.tokens.light.bg)
                                            }}
                                        >
                                            {brand.name}
                                        </h3>
                                        <p className="text-sm opacity-60 font-medium tracking-wide mt-1"
                                            style={{ color: getReadableTextColor(brand.theme.tokens.light.bg) }}
                                        >
                                            {brand.vibe.toUpperCase()}
                                        </p>
                                    </div>
                                </div>

                                {/* Details Footer */}
                                <div className="p-4 bg-stone-50 border-t border-stone-100 text-xs space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-stone-500">Font</span>
                                        <span className="font-medium text-stone-900 truncate max-w-[120px]">{brand.font.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-stone-500">Colors</span>
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 rounded-full" style={{ background: brand.theme.tokens.light.primary }} />
                                            <div className="w-3 h-3 rounded-full" style={{ background: brand.theme.tokens.light.accent || brand.theme.tokens.light.primary }} />
                                            <div className="w-3 h-3 rounded-full border border-stone-200" style={{ background: brand.theme.tokens.light.bg }} />
                                        </div>
                                    </div>
                                    <div className="pt-2 mt-2 border-t border-stone-200">
                                        <button className="w-full py-1.5 text-center font-medium text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300 rounded bg-white transition-colors">
                                            Select This Brand
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
