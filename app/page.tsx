"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Palette, Code, Download, Check } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';

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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        {/* Background Grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: 'radial-gradient(#D6D3D1 1px, transparent 1px)', backgroundSize: '32px 32px' }}
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
                MarkZero uses curated algorithms to generate complete, premium brand identity systems.
                No hallucinations, just design logic.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/generate"
                  className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-stone-900 text-white text-base font-medium hover:bg-stone-800 transition-all shadow-xl hover:shadow-2xl active:scale-95"
                >
                  Start Generating
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-stone-300 text-stone-700 text-base font-medium hover:border-stone-900 hover:text-stone-900 transition-all"
                >
                  See How It Works
                </a>
              </div>
            </div>

            {/* Right: Animated Demo Card */}
            <div className="hidden lg:flex justify-center items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={demoIndex}
                  initial={{ opacity: 0, y: 30, scale: 0.95, rotateY: -10 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, y: -30, scale: 1.05, rotateY: 10 }}
                  transition={{ duration: 0.6, ease: 'circOut' }}
                  className="w-[380px] h-[480px] bg-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col border border-stone-200"
                >
                  {/* Card Header */}
                  <div
                    className="h-1/2 flex items-center justify-center transition-colors duration-500"
                    style={{ backgroundColor: currentDemoTheme.tokens.light.bg }}
                  >
                    <div className="w-28 h-28" style={{ color: currentDemoTheme.tokens.light.primary }}>
                      <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                        <path d={currentDemoShape.path} />
                      </svg>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="h-1/2 p-6 flex flex-col justify-between bg-white">
                    <div>
                      <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">{currentDemoTheme.name}</div>
                      <div className="h-6 w-3/4 bg-stone-200 rounded mb-2"></div>
                      <div className="h-4 w-1/2 bg-stone-100 rounded"></div>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full border-2 border-stone-200" style={{ backgroundColor: currentDemoTheme.tokens.light.bg }}></div>
                      <div className="w-8 h-8 rounded-full border-2 border-stone-200" style={{ backgroundColor: currentDemoTheme.tokens.light.primary }}></div>
                      <div className="w-8 h-8 rounded-full border-2 border-stone-200" style={{ backgroundColor: currentDemoTheme.tokens.light.text }}></div>
                      <div className="w-8 h-8 rounded-full border-2 border-stone-200" style={{ backgroundColor: currentDemoTheme.tokens.light.surface }}></div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section id="features" className="py-20 md:py-32 bg-white border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Built for Speed, Designed for Quality</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              MarkZero isn't a generic logo maker. It's a parametric engine that ensures every output is premium.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="group p-6 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-lg hover:border-stone-300 transition-all">
                <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== HOW IT WORKS (BENTO GRID) ==================== */}
      <section id="how-it-works" className="py-20 md:py-32 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Your Brand, Visualized</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Every generation includes a logo, color palette, mockups, and ready-to-use code.
            </p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[600px]">
            {/* Cell A: Logo */}
            <div
              className="col-span-2 row-span-2 rounded-3xl flex flex-col items-center justify-center p-8 shadow-lg transition-colors border border-stone-200"
              style={{ backgroundColor: EXAMPLE_THEME.tokens.light.bg }}
            >
              <div className="w-32 h-32 mb-6" style={{ color: EXAMPLE_THEME.tokens.light.primary }}>
                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                  <path d={EXAMPLE_SHAPE.path} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold" style={{ color: EXAMPLE_THEME.tokens.light.text }}>YourBrand</h3>
              <p className="text-sm opacity-60" style={{ color: EXAMPLE_THEME.tokens.light.text }}>TECH SERIES</p>
            </div>

            {/* Cell B: Palette */}
            <div className="col-span-2 row-span-1 rounded-3xl flex overflow-hidden shadow-lg border border-stone-200">
              <div className="flex-1" style={{ backgroundColor: EXAMPLE_THEME.tokens.light.bg }}></div>
              <div className="flex-1" style={{ backgroundColor: EXAMPLE_THEME.tokens.light.surface }}></div>
              <div className="flex-1" style={{ backgroundColor: EXAMPLE_THEME.tokens.light.primary }}></div>
              <div className="flex-1" style={{ backgroundColor: EXAMPLE_THEME.tokens.light.text }}></div>
            </div>

            {/* Cell C: Mockup */}
            <div className="col-span-1 row-span-1 rounded-3xl bg-stone-200 flex items-center justify-center shadow-lg p-4 border border-stone-200">
              <div className="relative bg-[#F5F5F0] w-24 h-32 rounded-b-lg shadow-md flex items-center justify-center">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-8 border-4 border-[#F5F5F0] rounded-t-full border-b-0"></div>
                <div className="w-12 h-12" style={{ color: EXAMPLE_THEME.tokens.light.primary, mixBlendMode: 'multiply' }}>
                  <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                    <path d={EXAMPLE_SHAPE.path} />
                  </svg>
                </div>
              </div>
            </div>

            {/* Cell D: Code */}
            <div className="col-span-1 row-span-1 rounded-3xl bg-[#1E1E1E] text-gray-300 p-4 shadow-lg font-mono text-xs overflow-hidden flex flex-col border border-stone-700">
              <div className="text-stone-500 mb-2">tailwind.config.ts</div>
              <pre className="flex-1 overflow-hidden text-[10px] leading-relaxed">
                {`colors: {
  primary: "${EXAMPLE_THEME.tokens.light.primary}",
  background: "${EXAMPLE_THEME.tokens.light.bg}",
  ...
}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 md:py-32 bg-stone-900 text-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to build your brand?
          </h2>
          <p className="text-lg text-stone-400 mb-10 max-w-xl mx-auto">
            Join hundreds of founders and developers who've launched their startups with MarkZero.
          </p>
          <Link
            href="/generate"
            className="group inline-flex items-center gap-2 px-10 py-5 rounded-full bg-white text-stone-900 text-lg font-semibold hover:bg-stone-100 transition-all shadow-xl active:scale-95"
          >
            Launch Generator
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
