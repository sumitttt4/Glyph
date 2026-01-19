'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';

interface BrandRecord {
    id: string;
    user_id: string;
    identity: BrandIdentity;
    created_at: string;
}

export default function HistoryPage() {
    const [brands, setBrands] = useState<BrandRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchBrands = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                // If not logged in, redirect to login
                window.location.href = '/login';
                return;
            }

            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching history:', error);
            }

            if (data) {
                setBrands(data);
            }
            setLoading(false);
        };
        fetchBrands();
    }, [supabase]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin w-8 h-8 border-2 border-stone-900 border-t-transparent rounded-full" />
                    <span className="text-sm font-mono text-stone-500">LOADING_ARCHIVE...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            {/* Header */}
            <header className="bg-white border-b border-stone-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-sm font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-2 group transition-colors">
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                            Back to Generator
                        </Link>
                        <div className="h-6 w-px bg-stone-200" />
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <h1 className="text-lg font-bold text-stone-900 font-mono tracking-tight">HISTORY_ARCHIVE</h1>
                        </div>
                    </div>
                    <div className="text-sm text-stone-500">
                        <span className="font-bold text-stone-900">{brands.length}</span> Brands Saved
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {brands.length === 0 ? (
                    <div className="text-center py-32 animate-in fade-in duration-500">
                        <div className="w-20 h-20 bg-stone-100 border border-stone-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-sm">
                            <svg className="w-8 h-8 text-stone-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-stone-900 mb-2">No generations yet</h3>
                        <p className="text-stone-500 mb-8 max-w-sm mx-auto">Your generated brand identities will appear here. Start creating to build your archive.</p>
                        <Link href="/" className="px-6 py-3 bg-stone-900 text-white font-semibold rounded-xl hover:bg-black transition-all hover:shadow-lg hover:-translate-y-0.5 inline-flex items-center gap-2">
                            <span>Start Generating</span>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in slide-in-from-bottom-4 duration-500">
                        {brands.map((item, index) => {
                            const identity = item.identity as BrandIdentity;
                            return (
                                <div
                                    key={item.id}
                                    className="bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-orange-200 hover:ring-4 hover:ring-orange-500/10 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
                                    style={{ animationDelay: `${index * 50}ms` }}
                                >
                                    <div className="aspect-[4/3] bg-stone-50 flex items-center justify-center p-8 relative overflow-hidden group-hover:bg-white transition-colors">
                                        {/* Dynamic Background Tint */}
                                        <div
                                            className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity"
                                            style={{ background: identity.theme?.tokens.light.primary || '#000' }}
                                        />

                                        <div className="transform group-hover:scale-110 transition-transform duration-500 ease-out">
                                            <LogoComposition brand={identity} className="w-32 h-32" />
                                        </div>

                                        {/* Quick Actions Overlay */}
                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                                            <button className="px-4 py-2 bg-white rounded-lg shadow-sm font-semibold text-xs text-stone-900 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                                Load Brand
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t border-stone-100 bg-white relative z-10">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-stone-900 truncate flex-1 pr-2" title={identity.name}>{identity.name}</h3>
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: identity.theme?.tokens.light.primary || '#000' }} />
                                        </div>
                                        <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
                                            <span className="uppercase tracking-wider">{identity.vibe}</span>
                                            <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    )
}
