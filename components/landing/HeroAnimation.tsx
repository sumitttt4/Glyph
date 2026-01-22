"use client";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { motion, AnimatePresence } from "framer-motion";
import { LogoComposition } from "@/components/logo-engine/LogoComposition";
import { BrandIdentity } from "@/lib/data";
import { SHAPES } from "@/lib/shapes";
import { Sparkles, Play, Type, Ban as PaletteIcon } from "lucide-react";

// 1. DATA
const DEMO_BRANDS: BrandIdentity[] = [
    {
        id: "demo-2",
        name: "Velvet",
        vibe: "Elegant",
        generationSeed: 12345,
        createdAt: new Date(),
        font: { id: 'luxury', name: 'Instrument Serif', heading: 'Instrument Serif', body: 'DM Sans', tags: ['luxury'] },
        theme: {
            id: 'luxury', name: 'Luxury', description: 'Luxury', tags: ['luxury'],
            tokens: {
                light: { bg: '#fdf4ff', surface: '#fae8ff', text: '#4a044e', primary: '#d946ef', accent: '#f0abfc', border: '#f5d0fe', muted: '#a855f7' },
                dark: { bg: '#2e1065', surface: '#4c1d95', text: '#faf5ff', primary: '#d8b4fe', accent: '#c084fc', border: '#5b21b6', muted: '#a78bfa' }
            }
        },
        shape: SHAPES[5],
        logoAssemblerLayout: 'icon_left',
        selectedLogoIndex: 0
    },
    {
        id: "demo-1", // Lumina
        name: "Lumina",
        vibe: "Tech",
        generationSeed: 12345,
        createdAt: new Date(),
        font: { id: 'tech', name: 'Inter', heading: 'Inter', body: 'Inter', tags: ['tech'] },
        theme: {
            id: 'tech', name: 'Tech', description: 'Tech', tags: ['tech'],
            tokens: {
                light: { bg: '#ffffff', surface: '#f4f4f5', text: '#18181b', primary: '#0ea5e9', accent: '#38bdf8', border: '#e4e4e7', muted: '#71717a' },
                dark: { bg: '#09090b', surface: '#18181b', text: '#fafafa', primary: '#38bdf8', accent: '#0ea5e9', border: '#27272a', muted: '#a1a1aa' }
            }
        },
        shape: SHAPES[3],
        logoAssemblerLayout: 'stacked',
        selectedLogoIndex: 0
    },
    {
        id: "demo-3",
        name: "Forge",
        vibe: "Bold",
        generationSeed: 12345,
        createdAt: new Date(),
        font: { id: 'bold', name: 'Montserrat', heading: 'Space Grotesk', body: 'Inter', tags: ['bold'] },
        theme: {
            id: 'industrial', name: 'Industrial', description: 'Industrial', tags: ['industrial'],
            tokens: {
                light: { bg: '#f5f5f4', surface: '#e7e5e4', text: '#0c0a09', primary: '#ea580c', accent: '#f97316', border: '#d6d3d1', muted: '#78716c' },
                dark: { bg: '#1c1917', surface: '#292524', text: '#fafaf9', primary: '#f97316', accent: '#ea580c', border: '#44403c', muted: '#a8a29e' }
            }
        },
        shape: SHAPES[1],
        logoAssemblerLayout: 'stacked',
        selectedLogoIndex: 0
    }
];

export default function HeroAnimation() {
    const [index, setIndex] = useState(0);

    // Cycle brands
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % DEMO_BRANDS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const brand = DEMO_BRANDS[index];
    const tokens = brand.theme.tokens.light;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            {/* CONTAINER: Free Canvas (No Box) */}
            <div className="relative w-full h-[420px] flex flex-col items-center justify-center">

                {/* Background: Faint Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-stone-200/40 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />


                {/* === SCENE: FLOATING ELEMENTS === */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={brand.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full"
                    >
                        {/* ELEMENT A: Hero Logo (Center Top) */}
                        <motion.div
                            initial={{ y: 20, scale: 0.9, opacity: 0 }}
                            animate={{ y: 0, scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                            className="absolute top-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 group z-10"
                        >
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl flex items-center justify-center shadow-2xl border border-stone-200 bg-white transition-colors duration-700">
                                <div className="w-12 h-12 md:w-16 md:h-16" style={{ color: tokens.primary }}>
                                    <LogoComposition brand={brand} />
                                </div>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-900 backdrop-blur-sm px-4 py-1 rounded-full"
                                style={{ fontFamily: brand.font.heading }}>
                                {brand.name}
                            </h1>
                        </motion.div>


                        {/* ELEMENT B: Color DNA (Right Floating) */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1, y: [0, -10, 0] }}
                            transition={{
                                x: { duration: 0.5, delay: 0.3 },
                                y: { repeat: Infinity, duration: 6, ease: "easeInOut" } // Bobbing
                            }}
                            className="absolute right-4 md:right-16 top-1/3 p-4 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-200 flex flex-col gap-3 shadow-2xl"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <PaletteIcon className="w-3 h-3 text-stone-400" />
                                <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Color DNA</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <ColorPill color={tokens.primary} label="Primary" />
                                <ColorPill color={tokens.text} label="Surface" />
                                <ColorPill color={tokens.accent || tokens.primary} label="Accent" />
                            </div>
                        </motion.div>


                        {/* ELEMENT C: Typography Spec (Left Floating) */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1, y: [0, 8, 0] }}
                            transition={{
                                x: { duration: 0.5, delay: 0.2 },
                                y: { repeat: Infinity, duration: 7, ease: "easeInOut" } // Bobbing inverse
                            }}
                            className="absolute left-4 md:left-16 top-1/3 p-5 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-200 flex flex-col gap-1 shadow-2xl min-w-[160px]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Type className="w-3 h-3 text-stone-400" />
                                <span className="text-[10px] font-mono uppercase text-stone-400 tracking-wider">Typography</span>
                            </div>
                            <div className="text-4xl text-stone-900 font-medium pl-1">Aa</div>
                            <div className="text-sm text-stone-600 font-medium border-t border-stone-100 pt-2 mt-1">
                                {brand.font.name}
                            </div>
                            <div className="text-[10px] text-stone-400">Regular / Medium / Bold</div>
                        </motion.div>

                    </motion.div>
                </AnimatePresence>

            </div>
        </div>
    );
}

// Small Helper Component for Color Bars
function ColorPill({ color, label }: { color: string, label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: color }} />
            <div className="flex flex-col">
                <span className="text-[10px] font-mono text-stone-400 uppercase">{color}</span>
                <span className="text-[10px] text-stone-600">{label}</span>
            </div>
        </div>
    );
}
