"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoComposition } from "@/components/logo-engine/LogoComposition";
import { BrandIdentity } from '@/lib/data';
import { SHAPES } from '@/lib/shapes';
import { cn } from "@/lib/utils";
import { ArrowUpRight, BarChart3, Wallet, Send, Plus, CreditCard } from "lucide-react";

// 1. PREMIUM BRAND DEMOS
const DEMO_BRANDS: BrandIdentity[] = [
    {
        id: "demo-2",
        name: "Velvet",
        vibe: "Elegant",
        generationSeed: 12345,
        createdAt: new Date(),
        font: {
            id: 'luxury',
            name: 'Instrument Serif',
            heading: 'Instrument Serif',
            body: 'DM Sans',
            tags: ['luxury']
        },
        theme: {
            id: 'luxury',
            name: 'Luxury',
            description: 'An elegant luxury theme.',
            tags: ['luxury'],
            tokens: {
                light: { bg: '#fdf4ff', surface: '#fae8ff', text: '#4a044e', primary: '#d946ef', accent: '#f0abfc', border: '#f5d0fe', muted: '#a855f7' },
                dark: { bg: '#2e1065', surface: '#4c1d95', text: '#faf5ff', primary: '#d8b4fe', accent: '#c084fc', border: '#5b21b6', muted: '#a78bfa' }
            }
        },
        shape: SHAPES[5], // Star
        logoAssemblerLayout: 'icon_left',
        selectedLogoIndex: 0
    },
    {
        id: "demo-1",
        name: "Lumina",
        vibe: "Tech",
        generationSeed: 12345,
        createdAt: new Date(),
        font: {
            id: 'tech',
            name: 'Inter',
            heading: 'Inter',
            body: 'Inter',
            tags: ['tech']
        },
        theme: {
            id: 'tech',
            name: 'Tech',
            description: 'A modern tech theme.',
            tags: ['tech'],
            tokens: {
                light: { bg: '#ffffff', surface: '#f4f4f5', text: '#18181b', primary: '#0ea5e9', accent: '#38bdf8', border: '#e4e4e7', muted: '#71717a' },
                dark: { bg: '#09090b', surface: '#18181b', text: '#fafafa', primary: '#38bdf8', accent: '#0ea5e9', border: '#27272a', muted: '#a1a1aa' }
            }
        },
        shape: SHAPES[3], // Hexagon
        logoAssemblerLayout: 'stacked',
        selectedLogoIndex: 0
    },
    {
        id: "demo-3",
        name: "Forge",
        vibe: "Bold",
        generationSeed: 12345,
        createdAt: new Date(),
        font: {
            id: 'bold',
            name: 'Montserrat',
            heading: 'Space Grotesk',
            body: 'Inter',
            tags: ['bold']
        },
        theme: {
            id: 'industrial',
            name: 'Industrial',
            description: 'A bold, industrial theme.',
            tags: ['industrial'],
            tokens: {
                light: { bg: '#f5f5f4', surface: '#e7e5e4', text: '#0c0a09', primary: '#ea580c', accent: '#f97316', border: '#d6d3d1', muted: '#78716c' },
                dark: { bg: '#1c1917', surface: '#292524', text: '#fafaf9', primary: '#f97316', accent: '#ea580c', border: '#44403c', muted: '#a8a29e' }
            }
        },
        shape: SHAPES[1], // Square
        logoAssemblerLayout: 'stacked',
        selectedLogoIndex: 0
    },
];

export default function HeroAnimation() {
    const [index, setIndex] = useState(0);

    // Cycle every 5 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % DEMO_BRANDS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const brand = DEMO_BRANDS[index];
    const tokens = brand.theme.tokens.light;

    // Helper for hex to rgba
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div className="w-full max-w-6xl mx-auto p-4 md:p-8">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl bg-[#0C0A09] border border-white/10 flex flex-col">
                {/* Window Header */}
                <div className="h-10 bg-[#0C0A09] border-b border-white/10 flex items-center px-4 justify-between shrink-0">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[8px]" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[8px]" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-[8px]" />
                    </div>
                    <div className="flex bg-[#1C1917] px-8 py-1 rounded-md text-[10px] text-stone-400 font-mono border border-white/5">
                        glyph-engine-v2.tsx
                    </div>
                    <div className="w-10 opacity-0" /> {/* Spacer */}
                </div>

                {/* Main Workspace */}
                <div className="flex-1 flex overflow-hidden">

                    {/* LEFT: The Application (Canvas) */}
                    <div className="flex-1 bg-[#12100E] relative flex items-center justify-center overflow-hidden border-r border-white/5">
                        {/* Background Grid */}
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{
                                backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                                backgroundSize: '24px 24px'
                            }}
                        />

                        {/* Device Mockup */}
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="relative w-[300px] h-[580px] bg-white rounded-[36px] shadow-2xl overflow-hidden border-[8px] sm:scale-100 scale-75"
                                style={{ borderColor: brand.theme.tokens.light.border === '#f5d0fe' ? '#1a1a1a' : '#1a1a1a' }} // Always dark bezel
                            >
                                <div className="h-full w-full bg-white flex flex-col" style={{ backgroundColor: tokens.bg, color: tokens.text }}>
                                    {/* Simulated Phone Top Bar */}
                                    <div className="h-8 flex justify-center items-end pb-1">
                                        <div className="w-20 h-4 bg-black rounded-full" />
                                    </div>

                                    {/* App Content */}
                                    <div className="flex-1 flex flex-col overflow-hidden">
                                        {/* Header */}
                                        <div className="px-6 py-4 flex justify-between items-center">
                                            <div className="w-8 h-8">
                                                <LogoComposition brand={brand} />
                                            </div>
                                            <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200" />
                                        </div>

                                        {/* Dynamic UI */}
                                        <div className="px-6 space-y-6">
                                            <div>
                                                <h2 className="text-2xl font-bold leading-tight" style={{ fontFamily: brand.font.heading }}>
                                                    Design<br />Intelligence
                                                </h2>
                                            </div>

                                            {/* Primary Card */}
                                            <div className="p-6 rounded-2xl shadow-lg relative overflow-hidden"
                                                style={{ backgroundColor: tokens.primary, color: '#fff' }}>
                                                <div className="relative z-10 space-y-4">
                                                    <div className="flex justify-between items-start">
                                                        <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur" />
                                                        <span className="text-xs font-mono opacity-80">001</span>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-lg font-bold">System Active</div>
                                                        <div className="text-xs opacity-70">Parametric Generation</div>
                                                    </div>
                                                </div>
                                                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                                            </div>

                                            {/* List Items */}
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5" style={{ backgroundColor: tokens.surface }}>
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: hexToRgba(tokens.primary, 0.1), color: tokens.primary }}>Aa</div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-bold">{brand.font.name}</div>
                                                        <div className="text-[10px] opacity-50">Typography</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 rounded-xl border border-black/5" style={{ backgroundColor: tokens.surface }}>
                                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: hexToRgba(tokens.primary, 0.1), color: tokens.primary }}>
                                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tokens.primary }} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-bold">Palette System</div>
                                                        <div className="text-[10px] opacity-50">Color Tokens</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Nav */}
                                        <div className="mt-auto h-20 border-t flex justify-around items-center px-4" style={{ borderColor: tokens.border, backgroundColor: tokens.bg }}>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: tokens.surface, color: tokens.primary }}>
                                                <div className="w-4 h-4 rounded-full bg-current" />
                                            </div>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center opacity-30">
                                                <div className="w-4 h-4 rounded-md border-2 border-current" />
                                            </div>
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center opacity-30">
                                                <div className="w-4 h-4 rounded-full border-2 border-current" />
                                            </div>
                                        </div>

                                    </div>
                                    {/* Home Indicator */}
                                    <div className="h-5 flex justify-center pb-2">
                                        <div className="w-32 h-1 bg-black/20 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* RIGHT: Properties Panel (Sidebar) */}
                    <div className="w-[320px] bg-[#0C0A09] border-l border-white/5 flex flex-col hidden md:flex">
                        {/* Panel Header */}
                        <div className="h-10 border-b border-white/5 flex items-center px-4 text-[10px] font-mono text-stone-500 uppercase tracking-wider">
                            Properties
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Section: Identity */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">Identity</label>
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                        <div className="w-8 h-8">
                                            <LogoComposition brand={brand} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-white text-sm font-medium">{brand.name}</div>
                                        <div className="text-stone-500 text-xs">v2.0 • {brand.vibe}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Colors */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">Palette</label>
                                <div className="grid grid-cols-5 gap-2">
                                    {[tokens.primary, tokens.accent, tokens.surface, tokens.bg, tokens.text, tokens.muted, tokens.border].filter(Boolean).slice(0, 10).map((c, i) => (
                                        <motion.div
                                            key={`${brand.id}-${i}`}
                                            className="aspect-square rounded-full border border-white/10 relative group cursor-pointer"
                                            style={{ backgroundColor: c }}
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black px-2 py-1 rounded text-[10px] text-white opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                                                {c}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Typography */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">Typography</label>
                                <div className="space-y-2">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="text-xs text-stone-400 mb-1">Heading</div>
                                        <div className="text-white text-lg" style={{ fontFamily: brand.font.heading }}>{brand.font.name}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="text-xs text-stone-400 mb-1">Body</div>
                                        <div className="text-white text-sm" style={{ fontFamily: brand.font.body }}>{brand.font.body}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Code Snippet */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-stone-600 uppercase tracking-wider">Export</label>
                                <div className="bg-[#050505] rounded-lg p-3 text-[10px] font-mono text-stone-400 border border-white/5 overflow-hidden">
                                    <div className="flex gap-2 mb-2 border-b border-white/5 pb-2">
                                        <span className="text-xs text-white">theme.ts</span>
                                    </div>
                                    <div className="opacity-70">
                                        <span className="text-purple-400">export</span> <span className="text-blue-400">const</span> theme = {'{'} <br />
                                        &nbsp;&nbsp;colors: {'{'} <br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;primary: <span className="text-yellow-300">'{tokens.primary}'</span>,<br />
                                        &nbsp;&nbsp;&nbsp;&nbsp;bg: <span className="text-yellow-300">'{tokens.bg}'</span>,<br />
                                        &nbsp;&nbsp;{'}'} <br />
                                        {'}'}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
