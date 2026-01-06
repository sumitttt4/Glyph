
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/brand/LogoComposition';
import { Lock, RotateCw, ChevronLeft, ChevronRight, Share, Plus } from 'lucide-react';

export function BrowserBrandPreview({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const bg = brand.theme.tokens.light.bg;
    const text = brand.theme.tokens.light.text;
    const initial = brand.name.charAt(0).toUpperCase();

    // Content Simulation based on Vibe
    const CONTENT: Record<string, { headline: string; subhead: string; cta: string }> = {
        minimalist: {
            headline: "Design is the silent ambassador.",
            subhead: "We strip away the non-essential to reveal the profound.",
            cta: "Explore Collection"
        },
        tech: {
            headline: "The future is already here.",
            subhead: "Building digital infrastructure for the next generation.",
            cta: "Start Building"
        },
        nature: {
            headline: "Return to the source.",
            subhead: "Sustainable living for a balanced, grounded future.",
            cta: "Join Movement"
        },
        bold: {
            headline: "Make your presence felt.",
            subhead: "For those who refuse to blend into the background.",
            cta: "Get Loud"
        },
        modern: {
            headline: "Simply better business.",
            subhead: "Elevating standards through thoughtful innovation.",
            cta: "Get Started"
        }
    };

    const copy = CONTENT[brand.vibe] || CONTENT.modern;

    return (
        <div className="w-full h-full flex flex-col overflow-hidden rounded-[2.5rem] bg-stone-50 shadow-2xl ring-8 ring-stone-900/5 group border border-stone-200">

            {/* 1. BROWSER CHROME (The Container) */}
            <div className="border-b border-stone-200 bg-white/80 backdrop-blur-md relative z-20">
                {/* Traffic Lights & Actions Row */}
                <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E0443E] shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-[#FEBC2E] border border-[#D89E24] shadow-sm" />
                        <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] shadow-sm" />
                    </div>
                </div>

                {/* Address Bar Row */}
                <div className="px-4 pb-4">
                    <div className="flex items-center gap-3 bg-stone-100/50 p-2 rounded-xl border border-stone-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
                        <div className="flex gap-1 opacity-40 px-2">
                            <ChevronLeft className="w-4 h-4" />
                            <ChevronRight className="w-4 h-4" />
                            <RotateCw className="w-3.5 h-3.5 ml-1" />
                        </div>

                        <div className="flex-1 flex items-center justify-center gap-2 bg-white h-9 rounded-lg border border-stone-200 shadow-sm text-xs font-medium text-stone-600">
                            <Lock className="w-3 h-3 opacity-40 ml-2" />
                            <span className="tracking-tight">{brand.name.toLowerCase().replace(/\s/g, '')}.com</span>
                        </div>

                        <div className="px-2 opacity-40">
                            <Share className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. VIEWPORT CONTENT */}
            <div className="flex-1 flex flex-col relative overflow-hidden bg-white">

                {/* HERO SECTION */}
                <div
                    className="h-[55%] w-full relative flex items-center justify-center overflow-hidden"
                    style={{ backgroundColor: primary }}
                >
                    {/* Noise Texture */}
                    <div
                        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
                        }}
                    />

                    {/* Gradient Overlay for Depth */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10 mix-blend-overlay" />

                    {/* Main Content */}
                    <div className="relative z-10 flex flex-col items-center gap-6 animate-in zoom-in-95 duration-700 fade-in slide-in-from-bottom-4">
                        {/* Logo Card */}
                        <div className="w-32 h-32 bg-white rounded-[2rem] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)] flex items-center justify-center relative overflow-hidden group hover:scale-105 transition-transform duration-500 border border-white/50">
                            <div className="w-20 h-20">
                                <LogoComposition brand={brand} />
                            </div>
                        </div>

                        <div className="text-center space-y-1">
                            <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">
                                {brand.name}
                            </h1>
                            <p className="text-white/90 text-xs font-bold tracking-widest uppercase">
                                The {brand.vibe} Platform
                            </p>
                        </div>
                    </div>
                </div>

                {/* CONTENT BODY */}
                <div className="flex-1 bg-white p-8 flex flex-col items-center py-12 gap-8 text-center">
                    <div className="space-y-3 max-w-sm">
                        <h2 className="text-2xl font-bold text-stone-900 tracking-tight leading-tight">
                            {copy.headline}
                        </h2>
                        <p className="text-stone-500 text-sm leading-relaxed">
                            {copy.subhead}
                        </p>
                    </div>

                    <button
                        className="px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all active:scale-95 active:translate-y-[1px] hover:shadow-lg hover:-translate-y-0.5"
                        style={{ backgroundColor: primary, color: '#FFFFFF' }}
                    >
                        {copy.cta}
                    </button>
                </div>

            </div>
        </div>
    );
}

// Helper for 'Favicon' in other views if needed
export function BrowserFavicon({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    return (
        <div
            className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-bold text-white"
            style={{ backgroundColor: primary }}
        >
            {brand.name.charAt(0)}
        </div>
    );
}
