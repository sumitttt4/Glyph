"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { cn } from '@/lib/utils';
import { generateDeepColor } from '@/lib/utils';

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E`;

// ============================================
// DYNAMIC HEADLINE ENGINE
// ============================================

const HEADLINE_TEMPLATES = [
    (name: string, vibe: string) => `Where ${name} drives impact.`,
    (name: string, vibe: string) => `Redefining the standard of ${vibe}.`,
    (name: string, vibe: string) => `The future is ${name}.`,
    (name: string, vibe: string) => `${vibe}, evolved.`,
    (name: string, vibe: string) => `Experience the power of ${name}.`,
    (name: string, vibe: string) => `Essential. Timeless. ${name}.`,
    (name: string, vibe: string) => `Innovation meets ${name}.`,
    (name: string, vibe: string) => `Beyond standards.`,
];

const DESCRIPTION_TEMPLATES = [
    (name: string) => `We believe in the power of simplicity. Every pixel, every interaction is crafted to empower your journey.`,
    (name: string) => `${name} isn't just a brand; it's a movement. Join us in shaping the future of digital experiences.`,
    (name: string) => `Designed for those who refuse to settle. Precision engineered for the modern world.`,
    (name: string) => `A relentless pursuit of perfection. The usage of bold typography and negative space defines our character.`,
    (name: string) => `Stripping away the non-essential to reveal the core truth. This is design with purpose.`,
];

function getBrandVision(brand: BrandIdentity) {
    const name = brand.name;
    const vibe = brand.vibe || 'innovation';

    // Pick random headline and description
    const hlTemplate = HEADLINE_TEMPLATES[Math.floor(Math.random() * HEADLINE_TEMPLATES.length)];
    const descTemplate = DESCRIPTION_TEMPLATES[Math.floor(Math.random() * DESCRIPTION_TEMPLATES.length)];

    return {
        headline: hlTemplate(name, vibe),
        description: descTemplate(name)
    };
}

// ============================================
// MEDIA COMPONENT: IDENTITY CARD (Glass)
// ============================================
function MediaIdentityCard({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        x.set((e.clientX - rect.left - width / 2) / width);
        y.set((e.clientY - rect.top - height / 2) / height);
    }

    return (
        <div
            className="perspective-1000 w-full h-full flex items-center justify-center p-8"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
        >
            <motion.div
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className={cn(
                    "relative w-full max-w-sm aspect-[3/4] rounded-3xl overflow-hidden",
                    "border border-white/10 shadow-2xl backdrop-blur-md bg-white/5"
                )}
            >
                {/* Gradient & Noise */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(135deg, ${colors.deep}cc 0%, ${primary}33 100%)` }}
                />
                <div
                    className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none"
                    style={{ backgroundImage: `url('${NOISE_SVG}')` }}
                />

                {/* Content */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-8" style={{ transform: "translateZ(40px)" }}>
                    <div className="flex justify-between items-start">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/10">
                            <LogoComposition brand={brand} className="w-8 h-8" />
                        </div>
                        <span className="px-3 py-1 rounded-full border border-white/20 text-[10px] font-mono text-white/50 tracking-widest uppercase bg-black/20 backdrop-blur-sm">
                            Official
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="w-16 h-[2px] bg-white/50" />
                        <h1 className={cn("text-4xl text-white font-bold leading-none", brand.font.heading)}>{brand.name}</h1>
                        <p className="text-white/70 text-sm border-l-2 border-white/20 pl-4 py-1">
                            {brand.strategy?.vision || `Defining the future of ${brand.vibe || 'innovation'}.`}
                        </p>
                    </div>

                    <div className="flex justify-between items-end opacity-50">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-mono uppercase text-white/80">Est. 2024</span>
                            <span className="text-[9px] font-mono uppercase text-white/80">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        </div>
                        <div className="w-8 h-8 rounded-md bg-white/20" />
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

// ============================================
// MEDIA COMPONENT: POSTER (Swiss Grid)
// ============================================
function MediaPoster({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;

    return (
        <div className="w-full h-full flex items-center justify-center p-8 bg-stone-100">
            <div className="relative w-full max-w-sm aspect-[3/4] bg-white shadow-xl overflow-hidden flex flex-col">
                <div
                    className="absolute inset-0 opacity-5 mix-blend-multiply"
                    style={{ backgroundImage: `url('${NOISE_SVG}')` }}
                />

                {/* Grid Layout */}
                <div className="h-2/3 relative flex items-center justify-center overflow-hidden bg-stone-900 border-b-2 border-black" style={{ backgroundColor: primary }}>
                    <div className="w-full h-full opacity-20 mix-blend-overlay">
                        <LogoComposition brand={brand} layout="generative" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-48 h-48 text-white mix-blend-difference">
                            <LogoComposition brand={brand} />
                        </div>
                    </div>
                </div>

                <div className="h-1/3 p-6 flex flex-col justify-between bg-white text-black">
                    <div className="flex justify-between items-start">
                        <h2 className={cn("text-3xl font-bold uppercase", brand.font.heading)}>{brand.name}</h2>
                        <div className="w-8 h-8 border border-black rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-black rounded-full" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-[10px] font-mono uppercase tracking-widest border-t border-black pt-4">
                        <div>Visual System</div>
                        <div className="text-right">Vol. 01</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MEDIA COMPONENT: BILLBOARD (High Impact)
// ============================================
function MediaBillboard({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center bg-black">
            {/* Background Image/Texture */}
            <div className="absolute inset-0 opacity-60 mixture-blend-overlay">
                {/* Procedural gradient representing a 'city' or 'sky' */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-stone-900" />
            </div>

            {/* Billboard Structure */}
            <div className="relative z-10 w-[90%] aspect-video border-[10px] border-stone-800 bg-white shadow-2xl flex relative overflow-hidden">
                <div className="absolute inset-0 bg-stone-900/10 z-20 pointer-events-none mix-blend-multiply shadow-inner" />

                {/* Content */}
                <div className="w-1/2 h-full p-8 flex flex-col justify-center bg-black text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30" style={{ backgroundColor: primary }} />
                    <h1 className={cn("text-5xl font-bold uppercase leading-none relative z-10", brand.font.heading)}>
                        {brand.name}
                    </h1>
                    <div className="mt-4 w-12 h-2 bg-white relative z-10" />
                </div>
                <div className="w-1/2 h-full relative bg-stone-200 flex items-center justify-center">
                    <div
                        className="w-full h-full opacity-10 absolute inset-0"
                        style={{ backgroundImage: `url('${NOISE_SVG}')` }}
                    />
                    <div className="w-32 h-32 text-black">
                        <LogoComposition brand={brand} />
                    </div>
                </div>
            </div>
        </div>
    );
}


// ============================================
// MAIN COMPONENT: VISION MACRO
// ============================================

export function BrandVisionMacro({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    // Vision Content -- Fixed per generation (Memoized on brand)
    const vision = useMemo(() => getBrandVision(brand), [brand]);

    // Media Mode State - Randomized on mount
    const [mediaMode, setMediaMode] = useState<'card' | 'poster' | 'billboard'>('card');

    useEffect(() => {
        const modes: ('card' | 'poster' | 'billboard')[] = ['card', 'poster', 'billboard'];
        // Use a pseudo-random pick based on timestamp or just random
        setMediaMode(modes[Math.floor(Math.random() * modes.length)]);
    }, [brand]);

    return (
        <section
            className="relative w-full min-h-[600px] bg-stone-950 overflow-hidden flex flex-col md:flex-row"
            style={{ backgroundColor: colors.deeper }}
        >
            {/* Background Ambient Glow */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div
                    className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px]"
                    style={{ background: `radial-gradient(circle, ${primary} 0%, transparent 70%)` }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px]"
                    style={{ background: `radial-gradient(circle, ${colors.accent} 0%, transparent 70%)` }}
                />
            </div>

            {/* LEFT: STATIC VISION */}
            <div className="w-full md:w-1/2 p-12 md:p-20 relative z-10 flex flex-col justify-center">
                <div className="mb-12">
                    <span className="text-xs font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Vision
                    </span>
                </div>

                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Headline */}
                        <h2
                            className={cn(
                                "text-5xl lg:text-7xl font-bold leading-[1.0] text-white tracking-tight mb-8",
                                brand.font.heading
                            )}
                        >
                            &quot;{vision.headline}&quot;
                        </h2>

                        {/* Description (in brand body font as requested) */}
                        <p
                            className={cn(
                                "text-lg md:text-xl text-white/70 max-w-lg leading-relaxed",
                                brand.font.body || "font-sans" // Use brand font or fallback
                            )}
                        >
                            {vision.description}
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* RIGHT: PROCEDURAL MEDIA SHOWCASE */}
            <div className="w-full md:w-1/2 relative z-10 border-l border-white/5 bg-black/10 backdrop-blur-sm overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={mediaMode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-full"
                    >
                        {mediaMode === 'card' && <MediaIdentityCard brand={brand} />}
                        {mediaMode === 'poster' && <MediaPoster brand={brand} />}
                        {mediaMode === 'billboard' && <MediaBillboard brand={brand} />}
                    </motion.div>
                </AnimatePresence>

                {/* Mode Indicator (Optional, debug or user hint) */}
                <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 backdrop-blur rounded text-[10px] text-white/50 font-mono uppercase">
                    Mode: {mediaMode}
                </div>
            </div>

        </section>
    );
}

export default BrandVisionMacro;
