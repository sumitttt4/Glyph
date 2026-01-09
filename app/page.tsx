"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, Zap, Layers, Palette, Layout, Type, ShieldCheck, Download, Check, Code } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { MockupBrowser, MockupDevice } from '@/components/mockups/MockupDevice';
import { Mockup3DCard } from '@/components/mockups/Mockup3DCard';
import { Button } from '@/components/ui/button';
import { FAQ } from '@/components/landing/FAQ';
import Pricing from '@/components/landing/Pricing';
import { AuthRescue } from '@/components/auth/AuthRescue';
import { Suspense } from 'react';
import { LogoComposition } from '@/components/brand/LogoComposition';
import HeroAnimation from '@/components/landing/HeroAnimation';

const DEMO_BRAND = {
  id: 'demo',
  name: 'Visionary',
  vibe: 'Premium',
  font: { name: 'Instrument Sans', weights: [400, 700] },
  theme: THEMES[0], // Architect
  shape: SHAPES[3], // Hexagon
  generationSeed: 12345,
};

// Sample data for the "How It Works" bento
const EXAMPLE_THEME = THEMES[0]; // "Architect"
const EXAMPLE_SHAPE = SHAPES[3]; // Hexagon

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Get a complete brand system in under 3 seconds. No waiting for AI to "think".',
  },
  {
    icon: Palette,
    title: 'Dual-Mode Tokens',
    description: 'Every brand includes both Light and Dark mode color tokens, ready for production.',
  },
  {
    icon: Code,
    title: 'Developer-First Export',
    description: 'Export directly to Tailwind CSS config. Copy, paste, ship.',
  },
  {
    icon: Download,
    title: 'SVG Assets',
    description: 'Download your logo as a clean, scalable SVG file.',
  },
];

export default function LandingPage() {
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDemoIndex((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const demoThemes = [THEMES[0], THEMES[1], THEMES[2]];
  const demoShapes = [SHAPES[3], SHAPES[2], SHAPES[0]];
  const currentDemoTheme = demoThemes[demoIndex % demoThemes.length];
  const currentDemoShape = demoShapes[demoIndex % demoShapes.length];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950 font-sans">
      <Suspense fallback={null}>
        <AuthRescue />
      </Suspense>
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
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
                for <span className="font-editorial text-stone-400">Startups</span>.
              </h1>

              <p className="text-lg md:text-xl text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10">
                Glyph uses curated algorithms to generate complete, premium brand identity systems.
                No hallucinations, just design logic.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/generator"
                  className="inline-flex items-center justify-center h-10 px-6 rounded-full bg-stone-950 text-white text-sm font-semibold hover:bg-stone-800 transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  Start Generating
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 h-10 px-6 rounded-full border border-stone-200 bg-white text-stone-600 text-sm font-medium hover:border-stone-950 hover:text-stone-950 transition-all"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right: The Living Hero Animation */}
            <div className="flex justify-center items-center mt-8 lg:mt-0">
              <HeroAnimation />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ANIMATED LINE (shadcn style) ==================== */}
      <div className="relative py-16 bg-stone-50">
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Top Arrow */}
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-stone-300 mb-2">
            <path d="M6 0L12 8H0L6 0Z" fill="currentColor" />
          </svg>

          {/* The Line with dots */}
          <div className="relative">
            <div className="w-[2px] h-32 bg-gradient-to-b from-stone-300 via-stone-400 to-stone-300 rounded-full" />

            {/* Animated dot */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-stone-500 animate-pulse"
              style={{ animation: 'moveDown 2s ease-in-out infinite' }} />
          </div>

          {/* Bottom Arrow */}
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="text-stone-300 mt-2 rotate-180">
            <path d="M6 0L12 8H0L6 0Z" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* ==================== SHOWCASE SECTION - The "Bridge" ==================== */}
      <section id="how-it-works" className="py-24 bg-stone-50 overflow-hidden">
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
                  Try the Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Brand Identity Bento Grid */}
              <div className="hidden lg:grid grid-cols-3 grid-rows-3 gap-3 h-[480px]">

                {/* Logo Block - Large */}
                <div className="col-span-2 row-span-1 bg-white rounded-2xl p-6 flex items-center justify-between overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 relative">
                      <LogoComposition brand={DEMO_BRAND as any} />
                    </div>
                    <span className="text-3xl font-bold text-stone-900 tracking-tight">{DEMO_BRAND.name}</span>
                  </div>
                  <div className="text-xs text-stone-400 font-mono uppercase">Logo</div>
                </div>

                {/* Phone Mockup - Tall */}
                <div className="col-span-1 row-span-2 bg-stone-100 rounded-2xl overflow-hidden relative group hover:shadow-lg transition-shadow">
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="w-full max-w-[180px] bg-stone-800 rounded-[2rem] p-2 shadow-xl">
                      {/* Phone Frame */}
                      <div className="bg-white rounded-[1.5rem] overflow-hidden aspect-[9/19]">
                        {/* Status Bar */}
                        <div className="h-6 bg-stone-100 flex items-center justify-center">
                          <div className="w-16 h-1 bg-stone-300 rounded-full"></div>
                        </div>
                        {/* App Content */}
                        <div className="p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-[#FF4500] flex items-center justify-center">
                              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                                <path d={DEMO_BRAND.shape.path} />
                              </svg>
                            </div>
                            <span className="text-[8px] font-bold text-stone-900">{DEMO_BRAND.name}</span>
                          </div>
                          <div className="h-16 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}></div>
                          <div className="space-y-1">
                            <div className="h-2 w-3/4 bg-stone-200 rounded"></div>
                            <div className="h-2 w-1/2 bg-stone-100 rounded"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 text-xs text-stone-400 font-mono uppercase">Mobile</div>
                </div>

                {/* Typography Block */}
                <div className="col-span-1 row-span-1 rounded-2xl p-5 overflow-hidden group hover:shadow-lg transition-shadow" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}>
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
                <div className="col-span-1 row-span-1 bg-white rounded-2xl p-4 overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="text-[10px] text-stone-400 font-mono uppercase mb-3">Palette</div>
                  <div className="flex gap-1.5 h-full pb-6">
                    <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}></div>
                    <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.text }}></div>
                    <div className="flex-1 rounded-lg" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.surface }}></div>
                    <div className="flex-1 rounded-lg border border-stone-200" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.bg }}></div>
                  </div>
                </div>

                {/* Business Card Block */}
                <div className="col-span-2 row-span-1 bg-stone-100 rounded-2xl p-4 overflow-hidden relative group hover:shadow-lg transition-shadow">
                  <div className="absolute top-3 right-3 text-xs text-stone-400 font-mono uppercase">Card</div>
                  <div className="flex items-center justify-center h-full gap-4">
                    {/* Card Front */}
                    <div className="w-40 h-24 rounded-lg shadow-lg transform -rotate-6 hover:rotate-0 transition-transform" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}>
                      <div className="p-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 fill-white">
                            <path d={DEMO_BRAND.shape.path} />
                          </svg>
                        </div>
                        <span className="text-[10px] font-bold text-white">{DEMO_BRAND.name}</span>
                      </div>
                    </div>
                    {/* Card Back */}
                    <div className="w-40 h-24 bg-white rounded-lg shadow-lg transform rotate-3 hover:rotate-0 transition-transform p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 rounded" style={{ backgroundColor: DEMO_BRAND.theme.tokens.light.primary }}>
                          <svg viewBox="0 0 24 24" className="w-full h-full p-1 fill-white">
                            <path d={DEMO_BRAND.shape.path} />
                          </svg>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1.5 w-2/3 bg-stone-200 rounded"></div>
                        <div className="h-1.5 w-1/2 bg-stone-100 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PRICING SECTION ==================== */}
      <Pricing />

      {/* ==================== FAQ SECTION ==================== */}
      <FAQ />

      <Footer />
    </div>
  );
}
