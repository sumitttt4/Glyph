"use client";
import React, { useState } from "react";
import { Lock, Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";

interface SoftGateVariationsProps {
    onUnlock?: () => void;
}

export function SoftGateVariations({ onUnlock }: SoftGateVariationsProps) {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);

        // Simulate API call / Value Exchange
        // In a real app, you would send this to your API/DB/marketing tool
        setTimeout(() => {
            setLoading(false);
            setIsUnlocked(true);
            toast.success("Variations unlocked!");
            if (onUnlock) onUnlock();
        }, 1200);
    };

    if (isUnlocked) {
        // In a real implementation, this would likely render the new variations grid passed as children or fetched data
        // For now, we show a success state or placeholders that would be replaced by the parent
        return null; // The parent can handle showing the content when isUnlocked is true
    }

    return (
        <div className="w-full mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="relative w-full overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-sm">

                {/* 1. THE TEASER (Blurred Background Pattern) */}
                <div className="absolute inset-0 bg-stone-50/50">
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                            backgroundSize: '16px 16px'
                        }}
                    />
                    {/* Blurred blobs to simulate logos */}
                    <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-stone-200 rounded-full blur-2xl opacity-40" />
                    <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-stone-300 rounded-full blur-2xl opacity-40" />
                    <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-orange-100 rounded-full blur-2xl opacity-40" />
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="w-12 h-12 bg-white rounded-full shadow-md shadow-stone-200/50 flex items-center justify-center mb-5 text-orange-600 ring-1 ring-stone-100">
                        <Lock size={20} />
                    </div>

                    <h3 className="text-xl font-bold text-stone-900 mb-2 tracking-tight">
                        Unlock 4 Creative Variations
                    </h3>
                    <p className="text-stone-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                        Our AI has generated 4 more experimental concepts for this brand.
                        Enter your email to see them instantly.
                    </p>

                    {/* 2. THE CAPTURE FORM */}
                    <form onSubmit={handleUnlock} className="flex flex-col sm:flex-row w-full max-w-sm gap-2">
                        <input
                            type="email"
                            required
                            placeholder="founder@startup.com"
                            className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 text-sm bg-white shadow-sm placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:border-stone-950 transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-bold shadow hover:bg-black hover:shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-80"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <>
                                    Unlock <Wand2 size={14} className="opacity-80" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-[10px] text-stone-400 mt-4 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500/50 block" />
                        No password required. We&apos;ll also email you these styles.
                    </p>
                </div>
            </div>
        </div>
    );
}
