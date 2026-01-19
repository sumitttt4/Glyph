"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoComposition } from "@/components/logo-engine/LogoComposition";
import { BrandIdentity } from '@/lib/data';
import { SHAPES } from '@/lib/shapes';
import { cn } from "@/lib/utils";
import { ArrowUpRight, BarChart3, Wallet, Send, Plus, CreditCard } from "lucide-react";

// 1. PREMIUM BRAND DEMOS (Reused from previous step)
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

    // Cycle every 5 seconds for a slower, more deliberate showcase
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
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
            <div className="relative w-full aspect-[4/3] md:aspect-[2/1] rounded-3xl overflow-hidden shadow-2xl bg-stone-950/50 backdrop-blur-xl border border-white/10">
                {/* Background Texture - Technical Dot Matrix */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="absolute inset-0 p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                    {/* TILE A (Left): The Application */}
                    <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 group flex items-center justify-center">
                        {/* Title Badge */}
                        <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/40 backdrop-blur rounded-full border border-white/10">
                            <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">The Application</span>
                        </div>

                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={brand.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, ease: "circOut" }}
                                className="w-[280px] h-[540px] bg-white rounded-[32px] shadow-2xl overflow-hidden relative border-[6px]"
                                style={{ borderColor: isNaN(parseInt(brand.theme.tokens.light.border.replace('#', ''), 16)) ? '#000' : brand.theme.tokens.light.border }}
                            >
                                {/* Mobile App UI Mockup */}
                                <div className="h-full w-full bg-white flex flex-col" style={{ backgroundColor: tokens.bg, color: tokens.text }}>

                                    {/* App Header */}
                                    <div className="pt-10 pb-4 px-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-10">
                                        <div className="w-8 h-8">
                                            <LogoComposition brand={brand} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                                            <div className="w-full h-full bg-stone-300" />
                                        </div>
                                    </div>

                                    {/* App Content */}
                                    <div className="flex-1 overflow-hidden px-6 space-y-6">
                                        {/* Greeting */}
                                        <div className="space-y-1">
                                            <p className="text-sm opacity-60" style={{ fontFamily: brand.font.body }}>Good Morning,</p>
                                            <h2 className="text-2xl font-bold" style={{ fontFamily: brand.font.heading }}>Alex Carter</h2>
                                        </div>

                                        {/* Balance Card */}
                                        <div className="p-6 rounded-2xl shadow-lg relative overflow-hidden" style={{ backgroundColor: tokens.primary, color: '#fff' }}>
                                            <div className="relative z-10">
                                                <p className="text-xs opacity-80 mb-1 font-medium tracking-wide">TOTAL BALANCE</p>
                                                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: brand.font.heading }}>$24,562.00</h3>
                                                <div className="flex gap-4">
                                                    <div className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur text-xs font-bold flex items-center gap-1">
                                                        <Plus size={12} /> Add
                                                    </div>
                                                    <div className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur text-xs font-bold flex items-center gap-1">
                                                        <Send size={12} /> Send
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Decorative Circles */}
                                            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                                            <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full bg-black/10 blur-xl" />
                                        </div>

                                        {/* Actions Grid */}
                                        <div className="grid grid-cols-4 gap-4">
                                            {[BarChart3, Wallet, CreditCard, ArrowUpRight].map((Icon, i) => (
                                                <div key={i} className="flex flex-col items-center gap-2">
                                                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                                                        style={{ backgroundColor: tokens.surface, color: tokens.primary }}>
                                                        <Icon size={20} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Recent List */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-sm" style={{ fontFamily: brand.font.body }}>Recent Activity</h4>
                                                <span className="text-xs font-bold opacity-50" style={{ color: tokens.primary }}>See All</span>
                                            </div>
                                            {[1, 2].map((item) => (
                                                <div key={item} className="flex items-center justify-between p-3 rounded-xl border border-stone-100/50" style={{ backgroundColor: tokens.surface }}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: hexToRgba(tokens.primary, 0.1), color: tokens.primary }}>
                                                            NF
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold">Netflix</div>
                                                            <div className="text-[10px] opacity-50">Subscription</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm font-bold opacity-80">-$14.99</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Nav Bar */}
                                    <div className="h-16 border-t flex justify-around items-center bg-white/90 backdrop-blur" style={{ borderColor: tokens.border }}>
                                        <div className="w-12 h-1 rounded-full bg-stone-900 mx-auto mb-2 opacity-20" />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-4 md:gap-6">
                        {/* TILE B (Top Right): The DNA */}
                        <div className="flex-1 relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="px-3 py-1 bg-black/40 backdrop-blur rounded-full border border-white/10">
                                    <span className="text-[10px] font-mono text-white/70 uppercase tracking-widest">The DNA</span>
                                </div>
                                <AnimatePresence mode="popLayout">
                                    <motion.span
                                        key={brand.font.name}
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="text-white/50 text-xs font-mono"
                                    >
                                        {brand.font.name}
                                    </motion.span>
                                </AnimatePresence>
                            </div>

                            <div className="flex-1 flex gap-6 items-center">
                                <AnimatePresence mode="popLayout">
                                    <motion.div
                                        key={brand.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-24 h-24 bg-white/80 backdrop-blur rounded-xl flex items-center justify-center p-4 shadow-lg"
                                    >
                                        <LogoComposition brand={brand} />
                                    </motion.div>
                                </AnimatePresence>

                                <div className="flex-1 grid grid-cols-3 gap-3">
                                    {[tokens.primary, tokens.surface, tokens.text, tokens.accent, tokens.muted, tokens.bg].map((color, i) => (
                                        <AnimatePresence key={i} mode="wait">
                                            <motion.div
                                                key={color}
                                                initial={{ opacity: 0, scale: 0.5 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: i * 0.05 }}
                                                className="aspect-square rounded-full border border-white/10 shadow-sm relative group"
                                                style={{ backgroundColor: color }}
                                            >
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="text-[8px] font-mono text-white mix-blend-difference">{color}</div>
                                                </div>
                                            </motion.div>
                                        </AnimatePresence>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* TILE C (Bottom Right): The Engineering */}
                        <div className="flex-1 relative overflow-hidden rounded-2xl bg-[#09090b] border border-white/10 flex flex-col">
                            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[6px]">●</div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[6px]">●</div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-[6px]">●</div>
                                </div>
                                <span className="text-[10px] font-mono text-stone-500">tailwind.config.js</span>
                            </div>

                            <div className="flex-1 p-4 font-mono text-[10px] md:text-xs leading-relaxed text-stone-400 overflow-hidden relative">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={brand.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-8 border-r border-white/5 bg-white/[0.02] flex flex-col items-end pr-2 pt-4 text-stone-700 select-none">
                                            {[1, 2, 3, 4, 5, 6, 7].map(n => <div key={n} className="h-5">{n}</div>)}
                                        </div>
                                        <div className="pl-6 pt-0">
                                            <span className="text-purple-400">module</span>.<span className="text-blue-400">exports</span> = {'{'} <br />
                                            &nbsp;&nbsp;<span className="text-sky-400">theme</span>: {'{'} <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-400">extend</span>: {'{'} <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-sky-400">colors</span>: {'{'} <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-emerald-400">brand</span>: {'{'} <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-300">500</span>: <span className="text-yellow-300">'{tokens.primary}'</span>, <span className="text-stone-600">// Primary</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-orange-300">600</span>: <span className="text-yellow-300">'{tokens.accent}'</span>, <span className="text-stone-600">// Hover</span><br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'} <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'} <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;{'}'} <br />
                                            &nbsp;&nbsp;{'}'} <br />
                                            {'}'}
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
