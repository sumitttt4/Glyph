'use client';

import React from 'react';
import Link from 'next/link';
import { useHistory } from '@/hooks/use-history';
import { PaywallOverlay } from '@/components/history/PaywallOverlay';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { ArrowLeft, Clock, Search, Grid, LayoutGrid } from 'lucide-react';

export default function HistoryPage() {
    const { brands, loading, isPro, blockedCount } = useHistory();

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-2 border-stone-800 border-t-orange-500 rounded-full animate-spin" />
                    <span className="text-xs font-mono text-stone-500 tracking-widest uppercase">Initializing_Archive...</span>
                </div>
            </div>
        );
    }

    // Number of dummy cards to show for the blurred/locked section
    // If blockedCount is 0, we show 0. If > 0, we show at least 4-8 to look nice.
    const dummyCardsCount = blockedCount > 0 ? Math.min(Math.max(blockedCount, 4), 8) : 0;
    const dummyCards = Array(dummyCardsCount).fill(null);

    return (
        <div className="min-h-screen bg-stone-950 font-sans selection:bg-orange-500/20">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-stone-950/80 backdrop-blur-md border-b border-stone-800">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link
                            href="/generator"
                            className="text-xs font-medium text-stone-400 hover:text-white flex items-center gap-2 group transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Return to Lab
                        </Link>

                        <div className="h-4 w-px bg-stone-800" />

                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${isPro ? 'bg-green-500' : 'bg-orange-500'} animate-pulse`} />
                            <h1 className="text-sm font-bold text-white font-mono tracking-wider">
                                GENERATION_LOG
                            </h1>
                            <span className="px-1.5 py-0.5 rounded-md bg-stone-900 border border-stone-800 text-[10px] text-stone-500 font-mono">
                                v5.0
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono text-stone-500">
                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800">
                            <Clock className="w-3 h-3" />
                            <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <div className="px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-800">
                            <span className="text-stone-300 font-bold">{brands.length + blockedCount}</span> RECORDS
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {brands.length === 0 && blockedCount === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-32 animate-in fade-in duration-500">
                        <div className="w-24 h-24 bg-stone-900 border border-stone-800 rounded-2xl flex items-center justify-center mb-6 shadow-2xl">
                            <Grid className="w-10 h-10 text-stone-700" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No Generations Found</h3>
                        <p className="text-stone-500 mb-8 max-w-sm text-center text-sm">
                            Your conceptual archive is empty. Initialize the generator to begin creating.
                        </p>
                        <Link
                            href="/generator"
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-stone-200 transition-all inline-flex items-center gap-2 text-sm"
                        >
                            <LayoutGrid className="w-4 h-4" />
                            <span>Initialize Generator</span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Active Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                            {brands.map((item, index) => (
                                <div
                                    key={item.id}
                                    className="group relative bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden hover:border-stone-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    {/* Preview Area */}
                                    <div className="aspect-[4/3] bg-stone-950 relative flex items-center justify-center p-8 overflow-hidden">
                                        {/* Grid Background */}
                                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1c1917_1px,transparent_1px),linear-gradient(to_bottom,#1c1917_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />

                                        {/* Ambient Glow */}
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700"
                                            style={{ background: `radial-gradient(circle at center, ${item.identity.theme?.tokens.light.primary || '#fff'}, transparent 70%)` }}
                                        />

                                        <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-500">
                                            <LogoComposition
                                                brand={item.identity}
                                                className="w-32 h-32"
                                            />
                                        </div>

                                        {/* Action Overlay */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <button
                                                onClick={() => {
                                                    // Load into generator via localStorage
                                                    localStorage.setItem('glyph_pending_project', JSON.stringify({
                                                        restoreMode: true,
                                                        identity: item.identity,
                                                        timestamp: Date.now()
                                                    }));
                                                    window.location.href = '/generator';
                                                }}
                                                className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                                            >
                                                EDIT_PROJECT
                                            </button>
                                        </div>
                                    </div>

                                    {/* Info Area */}
                                    <div className="p-4 bg-stone-900 border-t border-stone-800">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-white truncate flex-1 pr-2 text-sm">
                                                {item.identity.name}
                                            </h3>
                                            <div
                                                className="w-2 h-2 rounded-full ring-2 ring-stone-900"
                                                style={{ backgroundColor: item.identity.theme?.tokens.light.primary || '#fff' }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                                            <span className="uppercase tracking-wider">
                                                {item.identity.vibe}
                                            </span>
                                            <span>{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Paywall / Blurred Section */}
                        {blockedCount > 0 && (
                            <div className="relative pt-8">
                                <div className="absolute inset-0 -top-12 bg-gradient-to-b from-stone-950/0 via-stone-950/80 to-stone-950 z-10 pointer-events-none" />

                                {/* Overlay Component */}
                                <div className="absolute inset-0 z-20 top-0">
                                    <PaywallOverlay />
                                </div>

                                {/* Blurred Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 opacity-30 blur-sm select-none pointer-events-none grayscale">
                                    {dummyCards.map((_, i) => (
                                        <div key={i} className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden h-[240px]">
                                            <div className="h-4/5 bg-stone-950/50" />
                                            <div className="p-4 border-t border-stone-800">
                                                <div className="h-4 w-24 bg-stone-800 rounded mb-2" />
                                                <div className="h-3 w-16 bg-stone-800 rounded" />
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-center mt-4 text-xs text-stone-600 font-mono">
                                    + {blockedCount} HIDDEN RECORD{blockedCount !== 1 ? 'S' : ''}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
