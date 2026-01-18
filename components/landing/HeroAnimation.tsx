"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { LogoComposition } from "@/components/logo-engine/LogoComposition";
import { BrandIdentity } from '@/lib/data';
import { THEMES } from '@/lib/themes';
import { SHAPES } from '@/lib/shapes';
import { FONT_PAIRINGS } from '@/lib/typography';

// 1. PREMIUM BRAND DEMOS
const DEMO_BRANDS: BrandIdentity[] = [
    {
        id: "demo-1",
        name: "Lumina",
        vibe: "Tech",
        generationSeed: 12345,
        createdAt: new Date(),
        // @ts-ignore - Simplification for demo
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
        id: "demo-2",
        name: "Velvet",
        vibe: "Elegant",
        generationSeed: 12345,
        createdAt: new Date(),
        // @ts-ignore - Simplification for demo
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
        id: "demo-3",
        name: "Forge",
        vibe: "Bold",
        generationSeed: 12345,
        createdAt: new Date(),
        // @ts-ignore - Simplification for demo
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
    {
        id: "demo-4",
        name: "Zenith",
        vibe: "Minimal",
        generationSeed: 12345,
        createdAt: new Date(),
        // @ts-ignore - Simplification for demo
        font: {
            id: 'minimal',
            name: 'Manrope',
            heading: 'Manrope',
            body: 'Manrope',
            tags: ['minimal']
        },
        theme: {
            id: 'minimal',
            name: 'Minimal',
            description: 'A clean, minimal theme.',
            tags: ['minimal'],
            tokens: {
                light: { bg: '#ffffff', surface: '#f7f7f7', text: '#111111', primary: '#111111', accent: '#333333', border: '#eaeaea', muted: '#888888' },
                dark: { bg: '#111111', surface: '#222222', text: '#ffffff', primary: '#ffffff', accent: '#cccccc', border: '#333333', muted: '#999999' }
            }
        },
        shape: SHAPES[0], // Circle
        logoAssemblerLayout: 'icon_left',
        selectedLogoIndex: 0
    },
    {
        id: "demo-5",
        name: "Solstice",
        vibe: "Nature",
        generationSeed: 12345,
        createdAt: new Date(),
        // @ts-ignore - Simplification for demo
        font: {
            id: 'nature',
            name: 'Outfit',
            heading: 'Manrope',
            body: 'Inter',
            tags: ['nature']
        },
        theme: {
            id: 'nature',
            name: 'Nature',
            description: 'A fresh, nature-inspired theme.',
            tags: ['nature'],
            tokens: {
                light: { bg: '#f0fdf4', surface: '#dcfce7', text: '#14532d', primary: '#16a34a', accent: '#22c55e', border: '#bbf7d0', muted: '#4ade80' },
                dark: { bg: '#052e16', surface: '#14532d', text: '#f0fdf4', primary: '#4ade80', accent: '#22c55e', border: '#15803d', muted: '#86efac' }
            }
        },
        shape: SHAPES[4], // Leaf like
        logoAssemblerLayout: 'stacked',
        selectedLogoIndex: 0
    }
];

export default function HeroAnimation() {
    const [index, setIndex] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    // Cycle every 3 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % DEMO_BRANDS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct * 200);
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const brand = DEMO_BRANDS[index];
    const tokens = brand.theme.tokens.light;

    return (
        <div className="relative w-full max-w-lg aspect-square perspective-[1000px] flex items-center justify-center -mr-12 md:mr-0 scale-90 md:scale-100">
            {/* Background elements for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-100/50 to-stone-50/0 rounded-[3rem] -z-20 blur-3xl opacity-60" />

            <motion.div
                ref={cardRef}
                style={{
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformStyle: "preserve-3d"
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative cursor-pointer"
            >
                {/* Floating Animation Wrapper */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative"
                >
                    {/* THE BUSINESS CARD MOCKUP */}
                    <div className="w-[380px] h-[240px] rounded-2xl shadow-2xl relative overflow-hidden bg-white border border-stone-200/50 transition-colors duration-500">
                        {/* Dynamic Background */}
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={`bg-${brand.id}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.8 }}
                                className="absolute inset-0"
                                style={{ backgroundColor: tokens.bg }}
                            >
                                {/* Abstract Texture */}
                                <div className="absolute inset-0 opacity-10"
                                    style={{
                                        backgroundImage: `radial-gradient(${tokens.primary} 1.5px, transparent 1.5px)`,
                                        backgroundSize: '24px 24px'
                                    }}
                                />
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-white/20 to-transparent mix-blend-overlay rotate-12 translate-x-10 -translate-y-10" />
                            </motion.div>
                        </AnimatePresence>

                        {/* Content Container */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={brand.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 10, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, scale: 1.05, y: -10, filter: 'blur(4px)' }}
                                    transition={{ duration: 0.5, ease: "circOut" }}
                                    className="flex flex-col items-center gap-6"
                                >
                                    {/* Logo */}
                                    <div className="w-24 h-24 drop-shadow-lg transform hover:scale-105 transition-transform duration-300">
                                        <LogoComposition
                                            brand={brand}
                                            layout="generative"
                                            className="w-full h-full"
                                        />
                                    </div>

                                    {/* Text Info */}
                                    <div className="text-center space-y-1">
                                        <h3
                                            className="text-2xl font-bold tracking-tight"
                                            style={{ color: tokens.text, fontFamily: brand.font.name }}
                                        >
                                            {brand.name}
                                        </h3>
                                        <p
                                            className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-60"
                                            style={{ color: tokens.muted }}
                                        >
                                            {brand.vibe} IDENTITY
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Shining Glare Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 pointer-events-none mix-blend-overlay" />
                    </div>

                    {/* Stacked Cards for depth (Visual Flourish) */}
                    <div className="absolute -z-10 top-4 left-4 w-full h-full bg-stone-900/5 rounded-2xl blur-sm transform translate-y-2 opacity-50" />

                </motion.div>
            </motion.div>

            {/* Floating UI Badges */}
            <div className="absolute -right-8 top-12 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-stone-100 animate-in slide-in-from-left-4 fade-in duration-700 delay-300 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-stone-600">Generated in 1.2s</span>
            </div>

            <div className="absolute -left-4 bottom-20 bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg border border-stone-100 animate-in slide-in-from-right-4 fade-in duration-700 delay-500">
                <span className="text-xs font-bold text-stone-600">Vector Ready</span>
            </div>
        </div>
    );
}
