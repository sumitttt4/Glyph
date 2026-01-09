"use client";

import { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { cn, hexToRgb, hexToCmyk } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check, Copy, ExternalLink, ArrowRight, RefreshCw } from 'lucide-react';
import { LogoComposition } from '@/components/brand/LogoComposition';
import { MockupSocial } from '@/components/mockups/MockupSocial';
import { MockupBillboard } from '@/components/mockups/MockupBillboard';
import { FontSelector } from './FontSelector';

// ... (SlideLayout remains same)

// ==================== SHARED LAYOUT ====================
const SlideLayout = ({
    children,
    className,
    title,
    brand,
    action,
    id
}: {
    children: React.ReactNode;
    className?: string;
    title?: string;
    brand: BrandIdentity;
    action?: React.ReactNode;
    id?: string;
}) => (
    <div id={id} className={cn("aspect-video w-full bg-stone-950 text-white p-8 md:p-12 lg:p-16 flex flex-col relative overflow-hidden", className)}>
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
                {action && <div>{action}</div>}
            </div>
        )}

        <div className="flex-1 relative z-10">
            {children}
        </div>
    </div >
);

// ==================== 1. COVER SLIDE ====================
export const SlideCover = ({ brand, id }: { brand: BrandIdentity, id?: string }) => (
    <SlideLayout brand={brand} id={id} className="justify-end">
        <div className="space-y-6">
            <div className="w-32 h-32 mb-8">
                <LogoComposition
                    brand={brand}
                    layout="generative"
                    overrideColors={{ primary: '#FFFFFF' }}
                    className="w-full h-full drop-shadow-2xl"
                />
            </div>
            <h1 className={cn("text-6xl md:text-8xl font-bold tracking-tighter", brand.font.heading)}>
                {brand.name}
            </h1>
            <p className="text-xl text-white/60 max-w-xl">
                Brand Identity Guidelines
            </p>
        </div>

        {/* Viral Badge */}
        <div className="absolute bottom-8 right-8 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 opacity-60">
            <div className="w-3 h-3 bg-[#CCFF00] rounded-full animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/80">
                Made with Glyph
            </span>
        </div>
    </SlideLayout>
);

// ==================== 2. STRATEGY SLIDE ====================
export const SlideStrategy = ({ brand, id }: { brand: BrandIdentity, id?: string }) => {
    const s = brand.strategy;
    if (!s) return null;

    return (
        <SlideLayout brand={brand} id={id} title="Brand Strategy">
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
export const SlideLogo = ({ brand, onCycleColor, id }: { brand: BrandIdentity, onCycleColor?: () => void, id?: string }) => (
    <SlideLayout
        brand={brand}
        title={`Logo Marks for ${brand.name}`}
        action={
            <button
                onClick={onCycleColor}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 backdrop-blur-md"
            >
                <RefreshCw className="w-4 h-4" />
                Cycle Color
            </button>
        }
        id={id}
    >
        <div className="grid grid-cols-4 grid-rows-2 gap-6 h-full">
            {/* Primary Mark - Bigger */}
            <div className="col-span-2 row-span-2 bg-white rounded-xl p-8 flex flex-col justify-between text-black relative group">
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-48 h-48 relative">
                        <LogoComposition brand={brand} layout="generative" />
                    </div>
                </div>
                <div className="border-t border-black/10 pt-4 mt-4">
                    <span className="text-xs uppercase font-bold tracking-widest opacity-60">Primary Mark</span>
                </div>
            </div>

            {/* Monotone */}
            <div className="col-span-1 row-span-1 bg-stone-900 rounded-xl p-6 flex flex-col justify-between text-white border border-white/10">
                <div className="w-16 h-16 self-center">
                    <LogoComposition brand={brand} layout="generative" overrideColors={{ primary: '#FFFFFF' }} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-50 text-center">Monotone</span>
            </div>

            {/* Accent */}
            <div className="col-span-1 row-span-1 rounded-xl p-6 flex flex-col justify-between text-white" style={{ backgroundColor: brand.theme.tokens.dark.primary }}>
                <div className="w-16 h-16 self-center">
                    <LogoComposition brand={brand} layout="generative" overrideColors={{ primary: '#FFFFFF' }} />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 text-center">Accent</span>
            </div>

            {/* Clear Space Diagram - Updated Layout */}
            <div className="col-span-2 row-span-1 border border-white/10 rounded-xl p-6 relative flex items-center justify-center bg-white/5">
                <div className="absolute top-4 left-4 text-[10px] font-mono text-white/40 uppercase tracking-widest">Clear Space</div>
                <div className="relative p-6 border border-dashed border-white/20">
                    <div className="w-16 h-16">
                        <LogoComposition brand={brand} layout="generative" overrideColors={{ primary: '#FFFFFF' }} />
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

export const SlideColors = ({ brand, id }: { brand: BrandIdentity, id?: string }) => {
    const t = brand.theme.tokens;

    return (
        <SlideLayout brand={brand} id={id} title={`Color Palette for ${brand.name}`}>
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
export const SlideTypography = ({ brand, onSwapFont, onUpdateFont, id }: { brand: BrandIdentity, onSwapFont?: () => void, onUpdateFont?: (font: any) => void, id?: string }) => {
    const [isFontSelectorOpen, setIsFontSelectorOpen] = useState(false);

    // Type Scale Data matching our PDF export logic
    const TypeScale = [
        { role: 'Display', size: '48-72px', tracking: '-0.04em', leading: '1.1', weight: 'Bold' },
        { role: 'H1', size: '32-48px', tracking: '-0.03em', leading: '1.15', weight: 'Bold' },
        { role: 'H2', size: '24-32px', tracking: '-0.02em', leading: '1.2', weight: 'Semibold' },
        { role: 'Body', size: '16px', tracking: '0em', leading: '1.6', weight: 'Regular' },
    ];

    return (
        <SlideLayout
            brand={brand}
            title={`Typography for ${brand.name}`}
            action={
                <button
                    onClick={() => setIsFontSelectorOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 backdrop-blur-md"
                >
                    <RefreshCw className="w-4 h-4" />
                    Change Font
                </button>
            }
            id={id}
        >

            <FontSelector
                isOpen={isFontSelectorOpen}
                onClose={() => setIsFontSelectorOpen(false)}
                currentFontId={brand.font.id}
                onSelect={(font) => {
                    onUpdateFont?.(font);
                }}
            />

            <div className="grid grid-cols-12 gap-6 h-full p-2">

                {/* LEFT: Font Pair Showcase - Compacted */}
                <div className="col-span-4 flex flex-col gap-4 h-full">
                    {/* Primary Font Card */}
                    <div className="flex-1 p-5 bg-[#111] rounded-2xl border border-white/5 relative overflow-hidden group flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                            <span className="text-5xl font-black">Aa</span>
                        </div>
                        <div className="text-[9px] font-mono text-[#CCFF00] uppercase tracking-widest mb-1 font-bold">Heading</div>
                        <h2 className={cn("text-3xl font-bold mb-1", brand.font.heading)}>{brand.font.headingName || brand.font.name}</h2>
                        <p className="text-white/50 text-xs leading-snug">
                            Commanding geometric precision.
                        </p>
                    </div>

                    {/* Secondary Font Card */}
                    <div className="flex-1 p-5 bg-[#111] rounded-2xl border border-white/5 relative overflow-hidden group flex flex-col justify-center">
                        <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:opacity-40 transition-opacity">
                            <span className="text-5xl font-serif italic">Gg</span>
                        </div>
                        <div className="text-[9px] font-mono text-blue-400 uppercase tracking-widest mb-1 font-bold">Body</div>
                        <h2 className={cn("text-2xl font-bold mb-1", brand.font.body)}>{brand.font.bodyName || 'Inter'}</h2>
                        <p className="text-white/50 text-xs leading-snug">
                            Clean, legible, distinct.
                        </p>
                    </div>
                </div>

                {/* RIGHT: Specs & Scale */}
                <div className="col-span-8 flex flex-col gap-4 h-full">

                    {/* Character Set - Reduced height */}
                    <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/5 relative flex flex-col justify-center h-[40%]">
                        <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold mb-2">Character Set</p>
                        <p className={cn("text-2xl text-white/90 break-words leading-relaxed", brand.font.heading)}>
                            ABCDEFGHIJKLMNOPQRSTUVWXYZ <br />
                            abcdefghijklmnopqrstuvwxyz <br />
                            <span className="opacity-50">0123456789</span>
                        </p>
                    </div>

                    {/* Detailed Spec Table - Compacted */}
                    <div className="flex-1 overflow-hidden bg-[#0A0A0A] rounded-2xl border border-white/5">
                        <div className="p-3 border-b border-white/5 flex items-center justify-between">
                            <p className="text-[9px] font-mono text-white/30 uppercase tracking-widest font-bold">Type Hierarchy & Specs</p>
                        </div>
                        <div className="p-0 overflow-y-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="text-white/40 text-[9px] font-mono uppercase border-b border-white/5">
                                        <th className="px-4 py-2 font-normal">Role</th>
                                        <th className="px-4 py-2 font-normal">Size</th>
                                        <th className="px-4 py-2 font-normal">Tracking</th>
                                        <th className="px-4 py-2 font-normal">Leading</th>
                                    </tr>
                                </thead>
                                <tbody className="text-white/80">
                                    {TypeScale.map((row, i) => (
                                        <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="px-4 py-2 font-bold text-[#CCFF00]">{row.role}</td>
                                            <td className="px-4 py-2 font-mono text-[10px]">{row.size}</td>
                                            <td className="px-4 py-2 font-mono text-[10px] opacity-60">{row.tracking}</td>
                                            <td className="px-4 py-2 font-mono text-[10px] opacity-60">{row.leading}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </SlideLayout>
    );
};

// ==================== 6. SOCIAL MEDIA ====================
export const SlideSocial = ({ brand, id }: { brand: BrandIdentity, id?: string }) => {
    return (
        <SlideLayout brand={brand} id={id} title={`Social Presence for ${brand.name}`}>
            <div className="grid grid-cols-2 gap-8 h-full items-center">

                {/* Simulated Feed */}
                <div className="bg-stone-100 rounded-3xl p-8 flex items-center justify-center h-full border border-stone-200">
                    <div className="scale-110">
                        <MockupSocial brand={brand} variant="feed" />
                    </div>
                </div>

                {/* Profile Preview */}
                <div className="flex flex-col gap-6 justify-center">
                    <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
                        <MockupSocial brand={brand} variant="profile" className="bg-transparent p-0" />
                    </div>

                    <div className="space-y-4 px-4">
                        <h3 className="text-2xl font-bold text-white">Digital First</h3>
                        <p className="text-white/60">
                            The brand system is optimized for high-engagement social platforms, ensuring visibility and recognition in detailed feeds and rapid-scroll contexts.
                        </p>
                    </div>
                </div>
            </div>
        </SlideLayout>
    );
};

// ==================== 7. OUTDOOR / BILLBOARD ====================
export const SlideOutdoor = ({ brand, id }: { brand: BrandIdentity, id?: string }) => {
    return (
        <SlideLayout brand={brand} id={id} title={`Brand in the Wild for ${brand.name}`}>
            <div className="flex flex-col gap-8 h-full">
                {/* Large Highway Billboard */}
                <div className="flex-1 rounded-2xl overflow-hidden shadow-2xl bg-stone-900 border border-white/10">
                    <MockupBillboard brand={brand} variant="highway" className="h-full" />
                </div>

                {/* Smaller Metro/Street Ads */}
                <div className="h-1/3 grid grid-cols-2 gap-8">
                    <div className="rounded-2xl overflow-hidden shadow-xl bg-stone-900 border border-white/10">
                        <MockupBillboard brand={brand} variant="metro" className="h-full" />
                    </div>

                    <div className="bg-[#111] rounded-2xl p-8 border border-white/10 flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-white mb-2">Physical Impact</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            From massive highway displays to intimate street-level signage, the identity scales effortlessly across physical mediums while maintaining high contrast and readability.
                        </p>
                    </div>
                </div>
            </div>
        </SlideLayout>
    );
};
