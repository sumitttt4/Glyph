"use client";

import { useState, useEffect } from 'react';
import { useBrandGenerator } from '@/hooks/use-brand-generator';
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { motion, AnimatePresence } from 'framer-motion';
import { SHAPES } from '@/lib/shapes';
import { THEMES } from '@/lib/themes';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

const VIBES = [
    { id: 'minimalist', label: 'Minimalist', desc: 'Clean, essential, swiss.' },
    { id: 'tech', label: 'Tech', desc: 'Bold, futuristic, digital.' },
    { id: 'nature', label: 'Nature', desc: 'Organic, calm, grounded.' },
    { id: 'bold', label: 'Bold', desc: 'High contrast, loud, punchy.' },
];

export default function GeneratePage() {
    const { brand, generateBrand, isGenerating, resetBrand } = useBrandGenerator();
    const [demoIndex, setDemoIndex] = useState(0);

    // Demo Loop Logic
    useEffect(() => {
        if (brand) return;
        const interval = setInterval(() => {
            setDemoIndex((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(interval);
    }, [brand]);

    const demoThemes = [THEMES[0], THEMES[1], THEMES[2]];
    const demoShapes = [SHAPES[3], SHAPES[2], SHAPES[0]];
    const currentDemoTheme = demoThemes[demoIndex % demoThemes.length];
    const currentDemoShape = demoShapes[demoIndex % demoShapes.length];

    if (brand) {
        return <BentoGrid brand={brand} onBack={resetBrand} />;
    }

    return (
        <main className="min-h-screen bg-stone-50 flex flex-col md:flex-row overflow-hidden font-sans text-stone-900">
            {/* Left: Content & Form */}
            <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-24 py-12 z-10 relative">
                <Link
                    href="/"
                    className="absolute top-8 left-8 md:left-24 inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-bold text-xl tracking-tighter">MarkZero.</span>
                </Link>

                <div className="max-w-xl mt-16 md:mt-0">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Generator Ready
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
                        Let's build your <br />
                        <span className="text-stone-400 italic font-serif">brand identity</span>.
                    </h1>

                    <p className="text-lg text-stone-600 mb-10 max-w-md leading-relaxed">
                        Choose a vibe that matches your startup's personality. Our engine will generate a complete brand system.
                    </p>

                    <div className="space-y-4">
                        <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">Select your vibe</p>
                        <div className="grid grid-cols-2 gap-3">
                            {VIBES.map((vibe) => (
                                <button
                                    key={vibe.id}
                                    onClick={() => generateBrand(vibe.id)}
                                    disabled={isGenerating}
                                    className="group text-left px-5 py-4 rounded-xl border border-stone-200 bg-white hover:border-stone-900 transition-all hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="font-semibold">{vibe.label}</div>
                                    <div className="text-xs text-stone-500 group-hover:text-stone-700">{vibe.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {isGenerating && (
                        <div className="mt-6 flex items-center gap-2 text-stone-500 animate-pulse">
                            <Sparkles className="w-4 h-4" />
                            <span>Curating your brand...</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Architectural Demo Pane */}
            <div className="hidden md:flex flex-1 bg-stone-200 relative items-center justify-center p-12 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(#A8A29E 1px, transparent 1px)', backgroundSize: '24px 24px' }}
                ></div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={demoIndex}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 1.05 }}
                        transition={{ duration: 0.5, ease: 'circOut' }}
                        className="w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl relative overflow-hidden flex flex-col z-20"
                    >
                        <div
                            className="h-1/2 flex items-center justify-center transition-colors duration-500"
                            style={{ backgroundColor: currentDemoTheme.tokens.light.bg }}
                        >
                            <div className="w-32 h-32" style={{ color: currentDemoTheme.tokens.light.primary }}>
                                <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
                                    <path d={currentDemoShape.path} />
                                </svg>
                            </div>
                        </div>

                        <div className="h-1/2 p-8 flex flex-col justify-between">
                            <div>
                                <div className="h-2 w-12 bg-stone-200 rounded mb-4"></div>
                                <div
                                    className="h-8 w-3/4 bg-stone-900 rounded mb-2"
                                    style={{ backgroundColor: currentDemoTheme.tokens.light.text }}
                                ></div>
                                <div className="h-4 w-1/2 bg-stone-300 rounded"></div>
                            </div>

                            <div className="flex gap-2">
                                <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: currentDemoTheme.tokens.light.bg }}></div>
                                <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: currentDemoTheme.tokens.light.primary }}></div>
                                <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: currentDemoTheme.tokens.light.text }}></div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
}
