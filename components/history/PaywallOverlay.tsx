"use client";

import React from 'react';
import { Sparkles, Lock } from 'lucide-react';

export function PaywallOverlay() {
    const handleUpgrade = () => {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://glyph.sumitsharmaa.me';
        window.location.href = `https://checkout.dodopayments.com/buy/pdt_0NVXcrRSqLnWomnnrEIla?quantity=1&redirect_url=${origin}/history`;
    };

    return (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-gradient-to-t from-stone-950/80 to-transparent">
            <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />

                <div className="relative bg-stone-900/90 backdrop-blur-xl border border-stone-800 p-8 rounded-2xl max-w-sm text-center shadow-2xl">
                    <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-700">
                        <Lock className="w-5 h-5 text-stone-400" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 font-mono tracking-tight">ARCHIVE_LOCKED</h3>

                    <p className="text-stone-400 mb-6 text-sm leading-relaxed">
                        Your brand history is locked. Upgrade to Glyph Pro to access your full evolution and high-res archives.
                    </p>

                    <button
                        onClick={handleUpgrade}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-stone-200 transition-all shadow-lg hover:translate-y-px"
                    >
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        <span>Unlock Full History</span>
                    </button>

                    <p className="mt-4 text-[10px] text-stone-500 font-mono uppercase tracking-wider">
                        Secure One-Time Payment
                    </p>
                </div>
            </div>
        </div>
    );
}
