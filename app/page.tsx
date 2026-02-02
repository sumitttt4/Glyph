"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { Check, Sparkles, Play, ArrowRight } from 'lucide-react';

// Components
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthRescue } from '@/components/auth/AuthRescue';
import HeroAnimation from '@/components/landing/HeroAnimation'; // Original was default
import { LiveCounter } from '@/components/landing/LiveCounter';
import Pricing from '@/components/landing/Pricing'; // Original was default

import { LogoComposition } from '@/components/logo-engine/LogoComposition';

// New Components
import { HeroCentered } from '@/components/hero-centered';
import { ProcessPipeline } from '@/components/landing/ProcessPipeline';
// import { TokenEngine } from '@/components/landing/TokenEngine';
import { AssetPayload } from '@/components/landing/AssetPayload';
import { ComparisonTable } from '@/components/landing/ComparisonTable';
import { UrgencyBanner } from '@/components/ui/UrgencyBanner';

// Data
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { BrandIdentity } from '@/lib/data';

const DEMO_BRAND: BrandIdentity = {
    id: 'demo',
    name: 'Glyph',
    vibe: 'Premium',
    font: { id: 'demo-font', name: 'Instrument Sans', heading: 'Instrument Sans', body: 'Inter', tags: ['modern'] },
    theme: THEMES[0], // Architect
    shape: SHAPES[6], // Glyph Custom
    generationSeed: 12345,
    createdAt: new Date(),
};

export default function LandingPage() {
    const [demoIndex, setDemoIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setDemoIndex((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white text-stone-950 font-sans">
            <Suspense fallback={null}>
                <AuthRescue />
            </Suspense>
            <UrgencyBanner spotsLeft={47} />
            <Navbar />

            {/* ==================== 1. HERO SECTION ==================== */}
            {/* ==================== 1. HERO SECTION ==================== */}
            <HeroCentered />

            {/* ==================== 2. HOW IT WORKS (3 Steps) ==================== */}
            <ProcessPipeline />



            {/* ==================== 4. SHOWCASE SECTION (The Vibe) ==================== */}
            <section id="how-it-works" className="py-24 bg-white overflow-hidden">
                <div className="max-w-[95%] xl:max-w-7xl mx-auto">
                    {/* Dark Container - The Bridge */}
                    <div className="bg-stone-950 text-white rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-16 overflow-hidden relative">
                        {/* Subtle background pattern */}
                        <div className="absolute inset-0 opacity-5"
                            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
                        </div>

                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                            <div>

                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                                    See It Before You Ship It.
                                </h2>
                                <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                                    Don&apos;t guess. See exactly how your brand looks on real-world merchandise, social media, and landing pages instantly.
                                </p>

                                <ul className="space-y-4 mb-10">
                                    <li className="flex items-center gap-3 text-stone-300">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-3.5 h-3.5" /></div>
                                        Real-Time Contextual Previews
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-300">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-3.5 h-3.5" /></div>
                                        Instant Social & Marketing Kit
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-300">
                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-3.5 h-3.5" /></div>
                                        Production-Ready SVG & Code
                                    </li>
                                </ul>

                                <Link href="/generator" className="inline-flex items-center gap-2 text-white font-bold hover:underline underline-offset-4 decoration-[#FF4500]">
                                    Visualize My Brand
                                </Link>
                            </div>

                            {/* Brand Identity Bento Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-7 auto-rows-min lg:grid-rows-3 gap-3 h-auto lg:h-[480px] mt-8 lg:mt-0">

                                {/* Logo Block - Large */}
                                <div className="col-span-2 lg:col-span-4 row-span-1 bg-white rounded-2xl p-6 flex items-center justify-between overflow-hidden group hover:shadow-lg transition-shadow h-24 lg:h-auto">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 lg:w-14 lg:h-14 relative">
                                            <Image
                                                src="/glyph_logo_new.png"
                                                alt="Glyph Logo"
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-2xl lg:text-3xl font-bold text-stone-900 tracking-tight">{DEMO_BRAND.name}</span>
                                    </div>
                                    <div className="text-xs text-stone-400 font-mono uppercase">Logo</div>
                                </div>

                                {/* Billboard / Outdoor Mockup */}
                                <div className="col-span-2 lg:col-span-3 row-span-3 bg-stone-100 rounded-2xl overflow-hidden relative group hover:shadow-lg transition-shadow aspect-[3/4] lg:aspect-auto">
                                    <Image
                                        src="/glyph_billboard_final.png"
                                        alt="Outdoor Billboard Campaign"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute bottom-3 right-3 text-xs text-white/80 font-mono uppercase bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full">Campaign</div>
                                </div>

                                {/* Typography Block */}
                                <div className="col-span-1 lg:col-span-2 row-span-1 rounded-2xl p-5 overflow-hidden group hover:shadow-lg transition-shadow aspect-square lg:aspect-auto" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}>
                                    <div className="text-white">
                                        <div className="text-[10px] font-mono uppercase opacity-70 mb-2">Typography</div>
                                        <div className="text-4xl font-bold tracking-tight opacity-30">Aa</div>
                                        <div className="text-xs space-y-0.5 mt-2">
                                            <div className="font-normal opacity-70">Regular</div>
                                            <div className="font-medium opacity-80">Medium</div>
                                            <div className="font-bold">Bold</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Color Palette Block */}
                                <div className="col-span-1 lg:col-span-2 row-span-1 bg-white rounded-2xl p-4 overflow-hidden group hover:shadow-lg transition-shadow aspect-square lg:aspect-auto">
                                    <div className="text-[10px] text-stone-400 font-mono uppercase mb-3">Palette</div>
                                    <div className="flex gap-1.5 h-full pb-6">
                                        <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}></div>
                                        <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.text }}></div>
                                        <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.surface }}></div>
                                        <div className="flex-1 rounded-lg border border-stone-200" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.bg }}></div>
                                    </div>
                                </div>

                                {/* Merchandise Mockup Block */}
                                <div className="col-span-2 lg:col-span-4 row-span-1 bg-stone-100 rounded-2xl overflow-hidden relative group hover:shadow-lg transition-shadow h-48 lg:h-auto">
                                    <Image
                                        src="/glyph_merch_final.png"
                                        alt="Brand Apparel"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                                    <div className="absolute top-3 right-3 text-xs text-white/80 font-mono uppercase bg-black/20 backdrop-blur-sm px-2 py-0.5 rounded-full">Apparel</div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== 5. THE PAYLOAD (The Value) ==================== */}
            <AssetPayload />

            {/* ==================== 6. COMPARISON (The Anchor) ==================== */}
            <ComparisonTable />



            {/* ==================== 8. PRICING SECTION ==================== */}
            <Pricing />

            <Footer />
        </div>
    );
}
