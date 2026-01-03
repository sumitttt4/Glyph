"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Palette, Code, Download, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { MockupBrowser, MockupDevice } from '@/components/mockups/MockupDevice';
import { Mockup3DCard } from '@/components/mockups/Mockup3DCard';
import { FAQ } from '@/components/FAQ';
import BrowserMockup from '@/components/hero/BrowserMockup';
import Pricing from '@/components/Pricing';

const DEMO_BRAND = {
  id: 'demo',
  name: 'Visionary',
  vibe: 'Premium',
  font: { name: 'Instrument Sans', weights: [400, 700] },
  theme: THEMES[0], // Architect
  shape: SHAPES[3], // Hexagon
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
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-sm mb-6">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                v1.0 Now Live
              </div>

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
                  href="/login"
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

            {/* Right: Browser Mockup - Dense Composition */}
            <div className="hidden lg:flex justify-center items-center">
              <BrowserMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION - Clean Bento Grid ==================== */}
      <section id="features" className="py-24 bg-white border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Engineered for Excellence</h2>
            <p className="text-lg text-stone-500 max-w-2xl mx-auto">
              Glyph isn't a template library. It's a computational design system that obeys the rules of high-end branding.
            </p>
          </div>

          {/* Clean Bento Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Feature 1: Parametric - Large */}
            <div className="lg:col-span-2 bg-stone-50 border border-stone-200 rounded-2xl p-8 relative overflow-hidden group hover:border-stone-300 transition-all">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-white mb-5">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-stone-900">Parametric Generation</h3>
                <p className="text-stone-500 text-sm leading-relaxed max-w-md">
                  Algorithms define spacing, scale, and color harmony. Every output is mathematically balanced.
                </p>
              </div>
              {/* Decorative Grid */}
              <div className="absolute right-6 top-6 w-32 h-32 opacity-20">
                <div className="grid grid-cols-4 grid-rows-4 gap-1.5 h-full">
                  {[...Array(16)].map((_, i) => (
                    <div key={i} className="rounded bg-stone-400" style={{ opacity: 0.3 + (i % 4) * 0.2 }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Feature 2: Contextual - Tall */}
            <div className="row-span-2 bg-stone-900 text-white rounded-2xl p-8 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-white mb-5">
                  <Palette className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2">Contextual Mockups</h3>
                <p className="text-stone-400 text-sm leading-relaxed">
                  See your brand on phones, cards, and websites instantly.
                </p>
              </div>
              {/* Mini Phone Visual */}
              <div className="absolute bottom-6 right-6 w-28 opacity-80">
                <div className="bg-stone-700 rounded-xl p-1 shadow-xl">
                  <div className="bg-white rounded-lg aspect-[9/16] p-1.5">
                    <div className="h-1.5 w-6 bg-stone-200 rounded mb-1.5 mx-auto"></div>
                    <div className="h-8 bg-stone-100 rounded mb-1.5"></div>
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-stone-100 rounded"></div>
                      <div className="h-1 w-2/3 bg-stone-50 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3: Production - Wide */}
            <div className="lg:col-span-2 bg-stone-50 border border-stone-200 rounded-2xl p-8 relative overflow-hidden group hover:border-stone-300 transition-all">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center text-white mb-5">
                    <Code className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2 text-stone-900">Production Ready</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    Export as Tailwind CSS config, JSON tokens, or SVG assets.
                  </p>
                </div>
                {/* Code Snippet Visual */}
                <div className="flex-1 max-w-xs">
                  <div className="bg-stone-900 rounded-lg p-3 font-mono text-[10px] text-stone-300 shadow-lg">
                    <div className="flex items-center gap-1 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-600"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-stone-600"></div>
                    </div>
                    <code className="text-stone-400">
                      <span className="text-stone-500">export</span> theme = {'{'}<br />
                      &nbsp;&nbsp;primary: <span className="text-[#FF4500]">"#EA580C"</span>,<br />
                      &nbsp;&nbsp;surface: <span className="text-stone-300">"#FAFAF9"</span><br />
                      {'}'};
                    </code>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ==================== SHOWCASE SECTION - The "Bridge" ==================== */}
      <section id="how-it-works" className="py-24 bg-stone-50 overflow-hidden">
        <div className="max-w-[95%] xl:max-w-7xl mx-auto">
          {/* Dark Container - The Bridge */}
          <div className="bg-stone-950 text-white rounded-3xl p-8 lg:p-16 overflow-hidden relative">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-5"
              style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>

            <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-700 bg-stone-800/50 text-stone-300 text-xs font-mono mb-6 uppercase tracking-widest">
                  Generation Engine v1
                </div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                  Visualize your startup in <br /> <span className="text-[#FF4500]">High Fidelity</span>.
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

                <Link href="/login" className="inline-flex items-center gap-2 text-white font-bold hover:underline underline-offset-4 decoration-[#FF4500]">
                  Try the Demo <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Brand Identity Bento Grid */}
              <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[480px]">

                {/* Logo Block - Large */}
                <div className="col-span-2 row-span-1 bg-white rounded-2xl p-6 flex items-center justify-between overflow-hidden group hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-[#FF4500] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
                        <path d={DEMO_BRAND.shape.path} />
                      </svg>
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
