'use client';

import { Download, Sparkles } from "lucide-react";

// ============================================
// PHASE 2: THE MASTER TEMPLATE (BrandBoard)
// ============================================

// The Input Type (What Groq will generate for us)
export interface BrandData {
    name: string;
    tagline: string;
    colors: {
        primary: string;   // e.g. #FF4500
        secondary: string; // e.g. #0EA5E9
        ink: string;       // e.g. #0C0A09
        canvas: string;    // e.g. #FAFAF9
    };
    font: {
        display: string;   // e.g. Manrope
        body: string;      // e.g. Inter
    };
    vibe: "Minimalist" | "Tech" | "Organic" | "Bold" | "Luxury";
    logoPath?: string;     // SVG path for the icon
}

// Default brand for preview
export const DEFAULT_BRAND: BrandData = {
    name: "Acctual",
    tagline: "Finance, simplified.",
    colors: {
        primary: "#FF4500",
        secondary: "#0EA5E9",
        ink: "#0C0A09",
        canvas: "#FAFAF9",
    },
    font: {
        display: "Manrope",
        body: "Inter",
    },
    vibe: "Tech",
    logoPath: "M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z",
};

interface BrandBoardProps {
    data: BrandData;
    onExport?: () => void;
}

export default function BrandBoard({ data, onExport }: BrandBoardProps) {
    const logoPath = data.logoPath || "M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z";

    return (
        <div className="w-full max-w-[1000px] mx-auto p-4 md:p-8 lg:p-12 bg-stone-100 min-h-screen">

            {/* THE PINTEREST BOARD CONTAINER */}
            <div
                className="bg-white overflow-hidden border border-stone-200/60"
                style={{
                    borderRadius: 'var(--radius-board)',
                    boxShadow: 'var(--shadow-studio)',
                    padding: 'clamp(1.5rem, 5vw, 3rem)',
                }}
            >

                {/* SECTION 1: IDENTITY HEADER */}
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12 lg:mb-16 items-start">

                    {/* The Huge Logo Card */}
                    <div
                        className="w-32 h-32 md:w-48 md:h-48 flex items-center justify-center text-white transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500"
                        style={{
                            backgroundColor: data.colors.primary,
                            borderRadius: 'var(--radius-card)',
                            boxShadow: 'var(--shadow-float)',
                        }}
                    >
                        <svg viewBox="0 0 24 24" className="w-16 h-16 md:w-24 md:h-24 fill-current">
                            <path d={logoPath} />
                        </svg>
                    </div>

                    <div className="flex-1 pt-0 md:pt-4">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-stone-900 leading-none mb-4">
                            {data.name}<span style={{ color: data.colors.primary }}>.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-stone-500 font-serif italic border-l-4 border-stone-200 pl-4">
                            {data.tagline}
                        </p>
                        <div className="mt-4 flex items-center gap-2">
                            <span
                                className="px-3 py-1 text-xs font-bold uppercase tracking-widest text-white"
                                style={{
                                    backgroundColor: data.colors.ink,
                                    borderRadius: 'var(--radius-pill)'
                                }}
                            >
                                {data.vibe}
                            </span>
                            <span className="text-xs text-stone-400 font-mono">
                                {data.font.display} + {data.font.body}
                            </span>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: THE "SYSTEM" GRID (The Dense Part) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 mb-12 lg:mb-16">

                    {/* Color Palette Strip */}
                    <div
                        className="col-span-1 md:col-span-8 bg-stone-50 p-6 md:p-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-6 border border-stone-100"
                        style={{ borderRadius: 'var(--radius-card)' }}
                    >
                        {Object.entries(data.colors).map(([key, value]) => (
                            <div key={key} className="text-center group cursor-pointer">
                                <div
                                    className="w-14 h-14 md:w-20 md:h-20 rounded-full shadow-sm mb-3 mx-auto transition-transform group-hover:scale-110 ring-2 ring-transparent group-hover:ring-offset-2 group-hover:ring-stone-200"
                                    style={{ backgroundColor: value }}
                                />
                                <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-400">{key}</div>
                                <div className="text-[10px] md:text-xs font-mono text-stone-900">{value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Typography Card */}
                    <div
                        className="col-span-1 md:col-span-4 bg-stone-900 p-6 md:p-8 text-white flex flex-col justify-between relative overflow-hidden min-h-[200px]"
                        style={{ borderRadius: 'var(--radius-card)' }}
                    >
                        <div className="relative z-10">
                            <span className="text-xs font-bold uppercase text-stone-500 tracking-widest">Primary Type</span>
                            <div className="text-5xl md:text-6xl font-bold mt-2 tracking-tight">Aa</div>
                            <div className="mt-4 text-right">
                                <div className="font-bold">{data.font.display}</div>
                                <div className="text-stone-500 text-xs">Regular / Bold</div>
                            </div>
                        </div>
                        {/* Decorative Grid */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                        />
                    </div>
                </div>

                {/* SECTION 3: MOCKUPS (The "Realism" Part) */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">

                    {/* Mockup 1: The App Icon */}
                    <div
                        className="aspect-square bg-stone-100 flex items-center justify-center p-4 md:p-8"
                        style={{ borderRadius: 'var(--radius-card)' }}
                    >
                        <div
                            className="w-full h-full bg-white shadow-lg flex items-center justify-center border border-stone-100"
                            style={{ borderRadius: '1.5rem' }}
                        >
                            <div
                                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-white"
                                style={{ backgroundColor: data.colors.primary, borderRadius: '0.75rem' }}
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 md:w-8 md:h-8 fill-current">
                                    <path d={logoPath} />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Mockup 2: The Dark Mode Card */}
                    <div
                        className="aspect-square bg-stone-900 relative overflow-hidden group"
                        style={{ borderRadius: 'var(--radius-card)' }}
                    >
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <svg viewBox="0 0 24 24" className="w-12 h-12 fill-current mx-auto mb-2" style={{ color: data.colors.primary }}>
                                    <path d={logoPath} />
                                </svg>
                                <div className="text-white font-bold text-lg">{data.name}</div>
                                <div className="text-stone-500 text-xs font-mono mt-1">dark_mode</div>
                            </div>
                        </div>
                        <div
                            className="absolute inset-0 opacity-5"
                            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '8px 8px' }}
                        />
                    </div>

                    {/* Mockup 3: The Pattern */}
                    <div
                        className="aspect-square col-span-2 md:col-span-1 relative overflow-hidden"
                        style={{ backgroundColor: data.colors.primary, borderRadius: 'var(--radius-card)' }}
                    >
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 12px)' }}
                        />
                        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                            <div className="font-bold text-xl md:text-2xl tracking-tighter">{data.name}</div>
                            <div className="text-white/70 text-xs font-mono">Est. 2026</div>
                        </div>
                        <div className="absolute top-4 right-4 md:top-6 md:right-6">
                            <svg viewBox="0 0 24 24" className="w-8 h-8 md:w-10 md:h-10 fill-white/30">
                                <path d={logoPath} />
                            </svg>
                        </div>
                    </div>
                </div>

            </div>

            {/* FOOTER ACTIONS */}
            <div className="max-w-[1000px] mx-auto mt-6 md:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-2 text-stone-400 text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>Generated by Glyph</span>
                </div>
                <button
                    onClick={onExport}
                    className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white font-bold hover:bg-stone-800 transition-all active:scale-95"
                    style={{ borderRadius: 'var(--radius-pill)' }}
                >
                    <Download className="w-4 h-4" /> Export Brand Kit
                </button>
            </div>

        </div>
    );
}
