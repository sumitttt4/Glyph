"use client";

import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

// ==================== SHARED LAYOUT ====================
const SlideLayout = ({
    children,
    className,
    title,
    brand
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
    brand: BrandIdentity
}) => (
    <div className={cn("aspect-video w-full bg-stone-950 text-white p-8 md:p-12 lg:p-16 flex flex-col relative overflow-hidden", className)}>
        {/* Background Ambient */}
        <div
            className="absolute top-0 right-0 w-2/3 h-full opacity-20 pointer-events-none"
            style={{
                background: `radial-gradient(circle at 100% 0%, ${brand.theme.tokens.dark.primary}, transparent 70%)`
            }}
        />

        {/* Header */}
        {title && (
            <div className="flex justify-between items-start mb-12 relative z-10 border-b border-white/10 pb-6">
                <div>
                    <h2 className="text-sm font-mono uppercase tracking-widest text-white/50 mb-1">Glyph Generator</h2>
                    <h3 className="text-2xl font-bold tracking-tight">{title}</h3>
                </div>
                <div className="text-right">
                    <p className="text-sm font-mono text-white/50">v1.0</p>
                </div>
            </div>
        )}

        <div className="flex-1 relative z-10">
            {children}
        </div>
    </div>
);

// ==================== 1. COVER SLIDE ====================
export const SlideCover = ({ brand }: { brand: BrandIdentity }) => (
    <SlideLayout brand={brand} className="justify-end">
        <div className="space-y-6">
            <div className="w-24 h-24 mb-8" style={{ color: brand.theme.tokens.dark.primary }}>
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                    <path d={brand.shape.path} />
                </svg>
            </div>
            <h1 className={cn("text-6xl md:text-8xl font-bold tracking-tighter", brand.font.heading)}>
                {brand.name}
            </h1>
            <p className="text-xl text-white/60 max-w-xl">
                Brand Identity Guidelines
            </p>
        </div>
    </SlideLayout>
);

// ==================== 2. STRATEGY SLIDE ====================
export const SlideStrategy = ({ brand }: { brand: BrandIdentity }) => {
    const s = brand.strategy;
    if (!s) return null;

    return (
        <SlideLayout brand={brand} title="Brand Strategy">
            <div className="grid grid-cols-2 gap-x-12 gap-y-12 h-full">
                <div>
                    <h4 className="text-[#CCFF00] text-sm font-mono uppercase tracking-widest mb-4">Mission</h4>
                    <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">
                        {s.mission}
                    </p>
                </div>
                <div>
                    <h4 className="text-[#CCFF00] text-sm font-mono uppercase tracking-widest mb-4">Vision</h4>
                    <p className="text-xl md:text-2xl leading-relaxed font-light text-white/90">
                        {s.vision}
                    </p>
                </div>
                <div>
                    <h4 className="text-[#CCFF00] text-sm font-mono uppercase tracking-widest mb-4">Core Values</h4>
                    <ul className="grid grid-cols-2 gap-4">
                        {s.values.map((val) => (
                            <li key={val} className="flex items-center gap-2 border-l border-white/20 pl-4 py-1">
                                {val}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h4 className="text-[#CCFF00] text-sm font-mono uppercase tracking-widest mb-4">Target Audience</h4>
                    <p className="text-lg text-white/70">
                        {s.audience}
                    </p>
                </div>
            </div>
        </SlideLayout>
    );
};

// ==================== 3. LOGO CONSTRUCTION ====================
export const SlideLogo = ({ brand }: { brand: BrandIdentity }) => (
    <SlideLayout brand={brand} title="Logo Marks">
        <div className="grid grid-cols-4 gap-4 h-full">
            {/* Primary */}
            <div className="col-span-2 bg-white rounded-lg p-8 flex flex-col justify-between text-black">
                <div className="w-32 h-32" style={{ color: brand.theme.tokens.light.primary }}>
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>
                <div>
                    <span className="text-xs uppercase font-bold tracking-widest">Primary Mark</span>
                </div>
            </div>

            {/* Monotone */}
            <div className="col-span-1 bg-stone-900 rounded-lg p-6 flex flex-col justify-between text-white border border-white/10">
                <div className="w-16 h-16 text-white">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Monotone</span>
            </div>

            {/* Reversed / Accent */}
            <div className="col-span-1 rounded-lg p-6 flex flex-col justify-between text-white" style={{ backgroundColor: brand.theme.tokens.dark.primary }}>
                <div className="w-16 h-16 text-white">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50">Accent</span>
            </div>

            {/* Clear Space Diagram */}
            <div className="col-span-4 mt-4 border border-white/10 rounded-lg p-8 relative flex items-center justify-center">
                <div className="absolute top-4 left-4 text-xs font-mono text-white/40">CLEAR SPACE</div>

                <div className="relative">
                    {/* Guides */}
                    <div className="absolute -inset-8 border border-dashed border-white/20"></div>
                    <div className="absolute -inset-8 flex justify-center"><div className="h-full border-r border-dashed border-white/20"></div></div>
                    <div className="absolute -inset-8 flex items-center"><div className="w-full border-t border-dashed border-white/20"></div></div>

                    <div className="w-32 h-32 relative z-10" style={{ color: brand.theme.tokens.dark.text }}>
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                            <path d={brand.shape.path} />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    </SlideLayout>
);

// ==================== 4. COLOR PALETTE ====================
export const SlideColors = ({ brand }: { brand: BrandIdentity }) => {
    const t = brand.theme.tokens;

    return (
        <SlideLayout brand={brand} title="Color Palette">
            <div className="grid grid-cols-5 h-full gap-4">
                <div className="col-span-2 bg-white rounded-xl p-6 text-black flex flex-col justify-end">
                    <div className="font-mono text-xs mb-1 opacity-50">Background (Light)</div>
                    <div className="font-bold">{t.light.bg}</div>
                </div>
                <div className="col-span-1 rounded-xl p-6 text-white flex flex-col justify-end" style={{ backgroundColor: t.light.primary }}>
                    <div className="font-mono text-xs mb-1 opacity-70">Primary</div>
                    <div className="font-bold uppercase opacity-90">Brand</div>
                </div>
                <div className="col-span-1 rounded-xl p-6 text-white flex flex-col justify-end" style={{ backgroundColor: t.dark.bg }}>
                    <div className="font-mono text-xs mb-1 opacity-50">Surface</div>
                    <div className="font-bold">{t.dark.bg}</div>
                </div>
                <div className="col-span-1 rounded-xl p-6 text-white flex flex-col justify-end" style={{ backgroundColor: t.dark.border }}>
                    <div className="font-mono text-xs mb-1 opacity-50">Neutral</div>
                    <div className="font-bold">{t.dark.border}</div>
                </div>
            </div>
        </SlideLayout>
    );
};
