"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogoComposition } from "@/components/logo-engine/LogoComposition";
import { BrandIdentity } from '@/lib/data';
import { SHAPES } from '@/lib/shapes';
import { cn } from "@/lib/utils";
import { ArrowUpRight, BarChart3, Wallet, CreditCard } from "lucide-react";

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
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8">
            <div className="relative w-full h-[600px] md:h-auto md:aspect-[16/8] rounded-3xl overflow-hidden shadow-2xl bg-[#0C0A09] border border-white/10 flex flex-col">
                {/* Window Header */}
                <div className="h-10 bg-[#0C0A09] border-b border-white/10 flex items-center px-4 justify-between shrink-0 z-20 relative">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-[8px]" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center text-[8px]" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-[8px]" />
                    </div>
                    <div className="flex bg-[#1C1917] px-6 py-1 rounded-md text-[10px] text-stone-400 font-mono border border-white/5">
                        glyph-engine-v2.tsx
                    </div>
                    <div className="w-10 opacity-0" /> {/* Spacer */}
                </div>

                {/* Main Workspace */}
                <div className="flex-1 flex overflow-hidden relative bg-[#12100E]">
                    {/* Background Grid */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                            backgroundSize: '24px 24px'
                        }}
                    />

                    {/* Container for Devices */}
                    <div className="flex-1 flex items-center justify-center gap-8 md:gap-12 px-8 scale-[0.85] md:scale-100 origin-center">

                        {/* LEFT: Phone Mockup */}
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`phone-${brand.id}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.5, ease: "circOut" }}
                                className="relative w-[280px] h-[580px] bg-white rounded-[40px] shadow-2xl overflow-hidden border-[8px] z-10 shrink-0"
                                style={{ borderColor: '#1a1a1a' }}
                            >
                                <div className="h-full w-full bg-white flex flex-col" style={{ backgroundColor: tokens.bg, color: tokens.text }}>
                                    {/* Status Bar */}
                                    <div className="h-7 flex justify-center items-end pb-1 shrink-0">
                                        <div className="w-20 h-4 bg-black rounded-full" />
                                    </div>

                                    {/* App Header */}
                                    <div className="px-5 py-3 flex justify-between items-center shrink-0">
                                        <div className="w-8 h-8">
                                            <LogoComposition brand={brand} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                                                <div className="w-4 h-4 border-2 border-current rounded-full opacity-50" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* App Content */}
                                    <div className="flex-1 flex flex-col px-5 space-y-6 overflow-hidden">

                                        {/* Greeting & Balance */}
                                        <div className="space-y-1">
                                            <h2 className="text-sm opacity-60">Total Balance</h2>
                                            <div className="text-3xl font-bold" style={{ fontFamily: brand.font.heading }}>$124,500.00</div>
                                            <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                                <ArrowUpRight className="w-3 h-3" />
                                                <span>+12.5%</span>
                                            </div>
                                        </div>

                                        {/* Main Card */}
                                        <div className="p-5 rounded-2xl shadow-lg relative overflow-hidden shrink-0"
                                            style={{ backgroundColor: tokens.primary, color: '#fff' }}>
                                            <div className="relative z-10 flex flex-col h-28 justify-between">
                                                <div className="flex justify-between items-start">
                                                    <div className="w-8 h-5 rounded bg-white/30" /> {/* Chip */}
                                                    <div className="text-lg font-bold italic opacity-80">VISA</div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-sm font-mono opacity-80">•••• •••• •••• 4242</div>
                                                    <div className="flex justify-between text-[10px] opacity-70">
                                                        <span>Sumit Sharma</span>
                                                        <span>12/28</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
                                        </div>

                                        {/* Recent Activity List */}
                                        <div className="space-y-3">
                                            <div className="text-xs font-bold opacity-50 uppercase tracking-wider">Recent</div>
                                            {[1, 2, 3].map((_, i) => (
                                                <div key={i} className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
                                                        <Wallet className="w-4 h-4 opacity-50" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-sm font-bold truncate">Stripe Payment</div>
                                                        <div className="text-[10px] opacity-50">Software Service</div>
                                                    </div>
                                                    <div className="text-sm font-medium">-$29.00</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Bottom Tab Bar */}
                                    <div className="h-16 border-t flex justify-around items-center px-2 shrink-0" style={{ borderColor: tokens.border }}>
                                        <div className="p-2 rounded-xl" style={{ backgroundColor: hexToRgba(tokens.primary, 0.1) }}>
                                            <BarChart3 className="w-5 h-5" style={{ color: tokens.primary }} />
                                        </div>
                                        <div className="p-2 opacity-30"><Wallet className="w-5 h-5" /></div>
                                        <div className="p-2 opacity-30"><CreditCard className="w-5 h-5" /></div>
                                        <div className="p-2 opacity-30"><div className="w-5 h-5 rounded-full bg-current" /></div>
                                    </div>

                                    {/* Home Indicator */}
                                    <div className="h-4 flex justify-center pb-1.5 shrink-0">
                                        <div className="w-28 h-1 bg-black/20 rounded-full" />
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* RIGHT: Macbook Mockup */}
                        <div className="hidden md:block relative w-[600px] aspect-[16/10]">
                            <AnimatePresence mode="popLayout">
                                <motion.div
                                    key={`laptop-${brand.id}`}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="w-full h-full"
                                >
                                    {/* Macbook Body */}
                                    <div className="w-full h-full bg-[#1a1a1a] rounded-t-xl border-[4px] border-[#2a2a2a] border-b-0 relative overflow-hidden flex flex-col shadow-2xl">
                                        {/* Screen Content */}
                                        <div className="flex-1 bg-white flex overflow-hidden" style={{ backgroundColor: tokens.bg }}>

                                            {/* Web Sidebar */}
                                            <div className="w-48 h-full border-r flex flex-col p-4 bg-black/5" style={{ borderColor: tokens.border }}>
                                                <div className="flex items-center gap-2 mb-8">
                                                    <div className="w-6 h-6">
                                                        <LogoComposition brand={brand} />
                                                    </div>
                                                    <div className="font-bold text-sm" style={{ color: tokens.text }}>{brand.name}</div>
                                                </div>
                                                <div className="space-y-1">
                                                    {['Dashboard', 'Analytics', 'Customers', 'Settings'].map((item, i) => (
                                                        <div key={item}
                                                            className={`text-xs px-3 py-2 rounded-lg font-medium cursor-pointer ${i === 0 ? 'bg-white shadow-sm' : 'opacity-60 hover:opacity-100'}`}
                                                            style={{ color: tokens.text, backgroundColor: i === 0 ? tokens.surface : 'transparent' }}
                                                        >
                                                            {item}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Web Main Content */}
                                            <div className="flex-1 p-6 overflow-hidden flex flex-col gap-6" style={{ color: tokens.text }}>
                                                {/* Header */}
                                                <div className="flex justify-between items-center">
                                                    <h1 className="text-xl font-bold" style={{ fontFamily: brand.font.heading }}>Overview</h1>
                                                    <div className="flex gap-2">
                                                        <div className="px-3 py-1.5 rounded-md text-xs font-medium border border-current opacity-30">Export</div>
                                                        <div className="px-3 py-1.5 rounded-md text-xs font-medium text-white" style={{ backgroundColor: tokens.primary }}>New Report</div>
                                                    </div>
                                                </div>

                                                {/* Stats Row */}
                                                <div className="grid grid-cols-3 gap-4">
                                                    {[
                                                        { label: 'Revenue', value: '$45,231', trend: '+20%' },
                                                        { label: 'Users', value: '12,500', trend: '+12%' },
                                                        { label: 'Active', value: '1,200', trend: '+5%' }
                                                    ].map((stat, i) => (
                                                        <div key={i} className="p-4 rounded-xl border bg-white/50" style={{ borderColor: tokens.border }}>
                                                            <div className="text-[10px] opacity-60 uppercase font-bold tracking-wider">{stat.label}</div>
                                                            <div className="text-2xl font-bold mt-1" style={{ fontFamily: brand.font.heading }}>{stat.value}</div>
                                                            <div className="text-xs text-green-600 font-medium mt-1">{stat.trend}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Chart Area */}
                                                <div className="flex-1 rounded-xl border bg-white/50 p-4 border-dashed flex items-end gap-2" style={{ borderColor: tokens.border }}>
                                                    {/* Simulated Bar Chart */}
                                                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                                        <motion.div
                                                            key={i}
                                                            className="flex-1 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                                                            style={{ backgroundColor: tokens.primary, height: `${h}%` }}
                                                            initial={{ height: 0 }}
                                                            animate={{ height: `${h}%` }}
                                                            transition={{ delay: 0.2 + (i * 0.05), duration: 0.5 }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Camera Notch Area */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-4 w-32 bg-[#1a1a1a] rounded-b-xl" />
                                    </div>

                                    {/* Macbook Base (Keyboard Area) */}
                                    <div className="w-[110%] -ml-[5%] h-3 bg-[#2a2a2a] rounded-b-xl rounded-t-sm shadow-xl mx-auto relative">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#3a3a3a] rounded-b-md" /> {/* Trackpad Notch */}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
