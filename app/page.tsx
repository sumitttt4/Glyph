"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';
import { Check, Sparkles, Play } from 'lucide-react';

// Components
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthRescue } from '@/components/auth/AuthRescue';
import HeroAnimation from '@/components/landing/HeroAnimation'; // Original was default
import { LiveCounter } from '@/components/landing/LiveCounter';
import Pricing from '@/components/landing/Pricing'; // Original was default
import { FAQ } from '@/components/landing/FAQ';

import { LogoComposition } from '@/components/logo-engine/LogoComposition';

// New Components
import { ProcessPipeline } from '@/components/landing/ProcessPipeline';
import { TokenEngine } from '@/components/landing/TokenEngine';
import { AssetPayload } from '@/components/landing/AssetPayload';
import { ComparisonTable } from '@/components/landing/ComparisonTable';

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
      <Navbar />

      {/* ==================== 1. HERO SECTION ==================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: 'radial-gradient(#A8A29E 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        ></div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              <div className="hidden lg:block w-full"></div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                The Design Engineer <br className="hidden sm:block" />
                for <span className="font-editorial text-stone-400">your Startup</span>.
              </h1>

              <p className="text-lg md:text-xl text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                Glyph uses curated algorithms to generate complete, premium brand identity systems.
                No hallucinations, just design logic.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-8">
                <Link
                  href="/generator"
                  className="flex items-center gap-2 h-12 px-6 rounded-full bg-[#f97316] hover:bg-[#ea580c] text-white font-semibold transition-all shadow-lg active:scale-95 hover:shadow-orange-500/25"
                >
                  <Sparkles className="w-4 h-4 fill-white animate-pulse" />
                  <span>Start Generating</span>
                </Link>

                <a
                  href="#how-it-works"
                  className="flex items-center gap-2 h-12 px-6 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-900 font-medium transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Watch Demo</span>
                </a>
              </div>

            </div>

            {/* Right: The Living Hero Animation */}
            <div className="flex justify-center items-center mt-8 lg:mt-0">
              {/* Note: HeroAnimation was default export in original file */}
              {/* @ts-ignore - Assuming HeroAnimation follows correct export from previous file check */}
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. HOW IT WORKS (The Logic) ==================== */}
      <div id="how-it-works">
        <ProcessPipeline />
      </div>

      {/* ==================== 3. THE TOKEN ENGINE (The Technical Flex) ==================== */}
      <TokenEngine />

      {/* ==================== 4. SHOWCASE SECTION (The Vibe) ==================== */}
      <section className="py-24 bg-white overflow-hidden">
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
                  Visualize your startup in <br className="hidden md:block" /> <span className="text-[#FF4500]">High Fidelity</span>.
                </h2>
                <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                  Stop guessing how your color palette looks on a mobile device or a business card. Glyph renders real-time 3D mockups of your brand identity system.
                </p>

                <ul className="space-y-4 mb-10">
                  <li className="flex items-center gap-3 text-stone-300">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-3.5 h-3.5" /></div>
                    Instant Mobile & Web Previews
                  </li>
                  <li className="flex items-center gap-3 text-stone-300">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-3.5 h-3.5" /></div>
                    Automatic Social Media Assets
                  </li>
                  <li className="flex items-center gap-3 text-stone-300">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check className="w-3.5 h-3.5" /></div>
                    Vector-Perfect Logo Export
                  </li>
                </ul>

                <Link href="/generator" className="inline-flex items-center gap-2 text-white font-bold hover:underline underline-offset-4 decoration-[#FF4500]">
                  Try the Demo
                </Link>
              </div>

              {/* Brand Identity Bento Grid */}
              <div className="hidden lg:grid grid-cols-7 grid-rows-3 gap-3 h-[480px]">

                {/* Logo Block - Large */}
                <div className="col-span-4 row-span-1 bg-white rounded-2xl p-6 flex items-center justify-between overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 relative">
                      <Image
                        src="/glyph_logo_new.png"
                        alt="Glyph Logo"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-3xl font-bold text-stone-900 tracking-tight">{DEMO_BRAND.name}</span>
                  </div>
                  <div className="text-xs text-stone-400 font-mono uppercase">Logo</div>
                </div>

                {/* Billboard / Outdoor Mockup */}
                <div className="col-span-3 row-span-3 bg-stone-100 rounded-2xl overflow-hidden relative group hover:shadow-lg transition-shadow">
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
                <div className="col-span-2 row-span-1 rounded-2xl p-5 overflow-hidden group hover:shadow-lg transition-shadow" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}>
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
                <div className="col-span-2 row-span-1 bg-white rounded-2xl p-4 overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="text-[10px] text-stone-400 font-mono uppercase mb-3">Palette</div>
                  <div className="flex gap-1.5 h-full pb-6">
                    <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}></div>
                    <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.text }}></div>
                    <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.surface }}></div>
                    <div className="flex-1 rounded-lg border border-stone-200" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.bg }}></div>
                  </div>
                </div>

                {/* Merchandise Mockup Block */}
                <div className="col-span-4 row-span-1 bg-stone-100 rounded-2xl overflow-hidden relative group hover:shadow-lg transition-shadow">
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

      {/* ==================== 9. FAQ SECTION (The Defense) ==================== */}
      <FAQ />

      <Footer />
    </div>
  );
}
