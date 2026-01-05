"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { cn, hexToRgb, hexToCmyk } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink, ArrowRight } from 'lucide-react';

// ... (SlideLayout remains same)

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
            <div className="flex justify-between items-start mb-8 relative z-10 border-b border-white/10 pb-6">
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
        <div className="grid grid-cols-4 grid-rows-2 gap-6 h-full">
            {/* Primary Mark - Bigger */}
            <div className="col-span-2 row-span-2 bg-white rounded-xl p-8 flex flex-col justify-between text-black relative group">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-48 h-48" style={{ color: brand.theme.tokens.light.primary }}>
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current drop-shadow-2xl">
                            <path d={brand.shape.path} />
                        </svg>
                    </div>
                </div>
                <div className="border-t border-black/10 pt-4 mt-4">
                    <span className="text-xs uppercase font-bold tracking-widest opacity-60">Primary Mark</span>
                </div>
            </div>

            {/* Monotone */}
            <div className="col-span-1 row-span-1 bg-stone-900 rounded-xl p-6 flex flex-col justify-between text-white border border-white/10">
                <div className="w-16 h-16 text-white self-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 text-center">Monotone</span>
            </div>

            {/* Accent */}
            <div className="col-span-1 row-span-1 rounded-xl p-6 flex flex-col justify-between text-white" style={{ backgroundColor: brand.theme.tokens.dark.primary }}>
                <div className="w-16 h-16 text-white self-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 text-center">Accent</span>
            </div>

            {/* Clear Space Diagram - Updated Layout */}
            <div className="col-span-2 row-span-1 border border-white/10 rounded-xl p-6 relative flex items-center justify-center bg-white/5">
                <div className="absolute top-4 left-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">Clear Space</div>
                <div className="relative p-6 border border-dashed border-white/20">
                    <div className="w-16 h-16" style={{ color: brand.theme.tokens.dark.text }}>
                        <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                            <path d={brand.shape.path} />
                        </svg>
                    </div>
                    {/* Measurement lines */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/40">x</div>
                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 text-[10px] font-mono text-white/40">x</div>
                </div>
            </div>
        </div>
    </SlideLayout>
);

// ==================== 4. COLOR PALETTE ====================
// Helper Card
const ColorCard = ({ label, hex, dark = false }: { label: string, hex: string, dark?: boolean }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(hex.toUpperCase());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            onClick={handleCopy}
            className={cn(
                "rounded-xl p-6 flex flex-col justify-between relative group cursor-pointer transition-all hover:scale-[1.02]",
                dark ? "text-white" : "text-black bg-white"
            )}
            style={{ backgroundColor: dark ? hex : 'white' }}
        >
            {/* Color Swatch if card is white */}
            {!dark && (
                <div className="w-12 h-12 rounded-full mb-4 border border-black/10" style={{ backgroundColor: hex }} />
            )}

            <div className="space-y-4">
                <div>
                    <div className={cn("font-mono text-xs mb-1 uppercase tracking-wider", dark ? "opacity-50" : "opacity-40")}>{label}</div>
                    <div className="font-bold text-2xl tracking-tight">{hex.toUpperCase()}</div>
                </div>

                {/* Technical Values */}
                <div className="space-y-1 pt-4 border-t border-current border-opacity-10">
                    <div className="flex justify-between text-[10px] font-mono opacity-60">
                        <span>RGB</span>
                        <span>{hexToRgb(hex)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono opacity-60">
                        <span>CMYK</span>
                        <span>{hexToCmyk(hex)}</span>
                    </div>
                </div>
            </div>

            {/* Hover Copy Indicator */}
            <div className={cn(
                "absolute top-4 right-4 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100",
                copied ? "bg-green-500 text-white" : "bg-black/10 text-current"
            )}>
                {copied ? <Check size={14} /> : <Copy size={14} />}
            </div>
        </div>
    );
};

export const SlideColors = ({ brand }: { brand: BrandIdentity }) => {
    const t = brand.theme.tokens;

    return (
        <SlideLayout brand={brand} title="Color Palette">
            <div className="grid grid-cols-4 h-full gap-6">
                <ColorCard label="Primary" hex={t.light.primary} dark />
                <ColorCard label="Background (Dark)" hex={t.dark.bg} dark />
                <ColorCard label="Surface" hex={t.dark.bg} dark />{/* Note: Surface usually matches bg in this simplified model, or slightly lighter */}
                <ColorCard label="Neutral" hex={t.dark.border} dark />
            </div>
        </SlideLayout>
    );
};

// ==================== 5. TYPOGRAPHY ====================
export const SlideTypography = ({ brand }: { brand: BrandIdentity }) => {
    return (
        <SlideLayout brand={brand} title="Typography">
            <div className="grid grid-cols-12 gap-8 h-full">
                {/* Left: Font Info */}
                <div className="col-span-5 flex flex-col justify-between">
                    <div>
                        <div className="text-sm font-mono text-[#CCFF00] uppercase tracking-widest mb-4">Primary Typeface</div>
                        <h1 className="text-5xl font-bold mb-2">{brand.font.name}</h1>
                        <p className="text-white/60 text-lg leading-relaxed">
                            A modern, versatile typeface selected to communicate {brand.vibe} and clarity.
                        </p>
                    </div>

                    <div>
                        <a
                            href={`https://fonts.google.com/specimen/${brand.font.name.replace(/\s+/g, '+')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-stone-200 transition-colors"
                        >
                            <span>Get Font</span>
                            <ExternalLink size={16} />
                        </a>
                    </div>
                </div>

                {/* Right: Specimen */}
                <div className="col-span-7 bg-white/5 rounded-2xl p-8 border border-white/10 flex flex-col justify-center space-y-12">
                    {/* Alphabet */}
                    <div className="space-y-4">
                        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Characters</p>
                        <p className={cn("text-3xl leading-relaxed text-white/90 break-words", brand.font.heading)}>
                            Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                        </p>
                        <p className={cn("text-3xl leading-relaxed text-white/60 tracking-widest", brand.font.heading)}>
                            0123456789
                        </p>
                    </div>

                    {/* Sample Paragraph */}
                    <div className="space-y-4">
                        <p className="text-xs font-mono text-white/40 uppercase tracking-widest">Usage</p>
                        <div className="border-l-2 border-[#CCFF00] pl-6 space-y-4">
                            <h3 className={cn("text-2xl font-bold", brand.font.heading)}>The quick brown fox jumps over the lazy dog.</h3>
                            <p className="text-white/70 leading-relaxed">
                                Efficiently unleash cross-media information without cross-media value. Quickly maximize timely deliverables for real-time schemas. Dramatically maintain clicks-and-mortar solutions without functional solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </SlideLayout>
    );
};
