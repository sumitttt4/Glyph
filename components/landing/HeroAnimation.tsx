"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Import logo generators
import { generateStarburst } from "@/components/logo-engine/generators/starburst";
import { generateAbstractMark } from "@/components/logo-engine/generators/abstract-mark";
import { generateFramedLetter } from "@/components/logo-engine/generators/framed-letter";
import { generateMonogramBlend } from "@/components/logo-engine/generators/monogram-blend";
import { generateCircleOverlap } from "@/components/logo-engine/generators/circle-overlap";
import { generateHexagonTech } from "@/components/logo-engine/generators/hexagon-tech";
import { GeneratedLogo } from "@/components/logo-engine/types";

// ============================================
// SHOWCASE BRAND DEFINITIONS
// ============================================

interface ShowcaseBrand {
    name: string;
    tagline: string;
    category: 'technology' | 'creative' | 'finance' | 'healthcare' | 'ecommerce' | 'general';
    primaryColor: string;
    accentColor: string;
    bgColor: string;
    textColor: string;
    headingFont: string;
    bodyFont: string;
    algorithm: 'starburst' | 'abstract-mark' | 'framed-letter' | 'monogram-blend' | 'circle-overlap' | 'hexagon-tech';
}

const SHOWCASE_BRANDS: ShowcaseBrand[] = [
    {
        name: "Nexus",
        tagline: "Connected Intelligence",
        category: "technology",
        primaryColor: "#6366f1",
        accentColor: "#818cf8",
        bgColor: "#0f0f23",
        textColor: "#e0e0ff",
        headingFont: "'Inter', system-ui, sans-serif",
        bodyFont: "'Inter', system-ui, sans-serif",
        algorithm: "starburst",
    },
    {
        name: "Prism",
        tagline: "Creative Studio",
        category: "creative",
        primaryColor: "#f43f5e",
        accentColor: "#fb7185",
        bgColor: "#1a0a0e",
        textColor: "#ffeef1",
        headingFont: "'Syne', system-ui, sans-serif",
        bodyFont: "'DM Sans', system-ui, sans-serif",
        algorithm: "abstract-mark",
    },
    {
        name: "Vertex",
        tagline: "Financial Platform",
        category: "finance",
        primaryColor: "#10b981",
        accentColor: "#34d399",
        bgColor: "#0a1a14",
        textColor: "#d1fae5",
        headingFont: "'Space Grotesk', system-ui, sans-serif",
        bodyFont: "'Inter', system-ui, sans-serif",
        algorithm: "framed-letter",
    },
    {
        name: "Aurora",
        tagline: "Design System",
        category: "creative",
        primaryColor: "#8b5cf6",
        accentColor: "#a78bfa",
        bgColor: "#120f1c",
        textColor: "#ede9fe",
        headingFont: "'Outfit', system-ui, sans-serif",
        bodyFont: "'Inter', system-ui, sans-serif",
        algorithm: "monogram-blend",
    },
    {
        name: "Orbit",
        tagline: "Cloud Infrastructure",
        category: "technology",
        primaryColor: "#0ea5e9",
        accentColor: "#38bdf8",
        bgColor: "#0c1929",
        textColor: "#e0f2fe",
        headingFont: "'Manrope', system-ui, sans-serif",
        bodyFont: "'Inter', system-ui, sans-serif",
        algorithm: "circle-overlap",
    },
    {
        name: "Hexa",
        tagline: "Blockchain Solutions",
        category: "technology",
        primaryColor: "#f59e0b",
        accentColor: "#fbbf24",
        bgColor: "#1a1408",
        textColor: "#fef3c7",
        headingFont: "'Space Grotesk', system-ui, sans-serif",
        bodyFont: "'Inter', system-ui, sans-serif",
        algorithm: "hexagon-tech",
    },
];

// ============================================
// LOGO GENERATION
// ============================================

function generateLogoForBrand(brand: ShowcaseBrand): GeneratedLogo | null {
    try {
        const params = {
            brandName: brand.name,
            primaryColor: brand.primaryColor,
            accentColor: brand.accentColor,
            category: brand.category,
            variations: 1,
            minQualityScore: 60, // Lower threshold for showcase
        };

        let logos: GeneratedLogo[] = [];

        switch (brand.algorithm) {
            case 'starburst':
                logos = generateStarburst(params);
                break;
            case 'abstract-mark':
                logos = generateAbstractMark(params);
                break;
            case 'framed-letter':
                logos = generateFramedLetter(params);
                break;
            case 'monogram-blend':
                logos = generateMonogramBlend(params);
                break;
            case 'circle-overlap':
                logos = generateCircleOverlap(params);
                break;
            case 'hexagon-tech':
                logos = generateHexagonTech(params);
                break;
            default:
                logos = generateStarburst(params);
        }

        return logos[0] || null;
    } catch (error) {
        console.error(`Failed to generate logo for ${brand.name}:`, error);
        return null;
    }
}

// ============================================
// HERO ANIMATION COMPONENT
// ============================================

export default function HeroAnimation() {
    const [index, setIndex] = useState(0);
    const [isClient, setIsClient] = useState(false);

    // Generate logos once on client mount
    const generatedLogos = useMemo(() => {
        if (!isClient) return [];
        return SHOWCASE_BRANDS.map(brand => ({
            brand,
            logo: generateLogoForBrand(brand),
        }));
    }, [isClient]);

    // Set client flag after mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Cycle every 3 seconds
    useEffect(() => {
        if (!isClient) return;
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % SHOWCASE_BRANDS.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [isClient]);

    const currentBrand = SHOWCASE_BRANDS[index];
    const currentLogo = generatedLogos[index]?.logo;

    // Helper for hex to rgba
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Show loading state on server/initial render
    if (!isClient || generatedLogos.length === 0) {
        return (
            <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
                <div className="relative w-full min-h-[400px] md:min-h-[450px] rounded-2xl overflow-hidden bg-[#0C0A09] border border-white/10 flex items-center justify-center shadow-2xl">
                    <div className="w-8 h-8 border-2 border-white/20 border-t-white/80 rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
            <div className="relative w-full min-h-[400px] md:min-h-[450px] rounded-2xl overflow-hidden shadow-2xl bg-[#0C0A09] border border-white/10">
                {/* Background Grid */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* Main Content */}
                <div className="absolute inset-0 flex items-center justify-center p-6 md:p-10 lg:p-12">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`showcase-${index}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="flex flex-col md:flex-row items-center gap-6 md:gap-10 w-full max-w-3xl"
                        >
                            {/* Left Side: Logo with Float Animation */}
                            <motion.div
                                className="relative flex-shrink-0"
                                animate={{
                                    y: [0, -6, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            >
                                {/* Glow Effect */}
                                <div
                                    className="absolute inset-0 blur-2xl opacity-25 scale-125"
                                    style={{ backgroundColor: currentBrand.primaryColor }}
                                />

                                {/* Logo Container */}
                                <div
                                    className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg"
                                    style={{
                                        backgroundColor: hexToRgba(currentBrand.primaryColor, 0.1),
                                        border: `1px solid ${hexToRgba(currentBrand.primaryColor, 0.25)}`,
                                        boxShadow: `0 8px 32px ${hexToRgba(currentBrand.primaryColor, 0.15)}`,
                                    }}
                                >
                                    {currentLogo?.svg ? (
                                        <div
                                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28"
                                            dangerouslySetInnerHTML={{ __html: currentLogo.svg }}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-xl"
                                            style={{ backgroundColor: currentBrand.primaryColor }}
                                        />
                                    )}
                                </div>
                            </motion.div>

                            {/* Right Side: Brand Info */}
                            <div className="flex-1 min-w-0 text-center md:text-left space-y-4 md:space-y-5">
                                {/* Brand Name */}
                                <motion.h2
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1, duration: 0.4 }}
                                    className="text-3xl sm:text-4xl md:text-5xl font-bold truncate"
                                    style={{
                                        fontFamily: currentBrand.headingFont,
                                        color: currentBrand.textColor,
                                    }}
                                >
                                    {currentBrand.name}
                                </motion.h2>

                                {/* Tagline */}
                                <motion.p
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2, duration: 0.4 }}
                                    className="text-base md:text-lg opacity-70 truncate"
                                    style={{
                                        fontFamily: currentBrand.bodyFont,
                                        color: currentBrand.textColor,
                                    }}
                                >
                                    {currentBrand.tagline}
                                </motion.p>

                                {/* Color Palette */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.4 }}
                                    className="flex items-center gap-2 md:gap-3 justify-center md:justify-start flex-wrap"
                                >
                                    <div
                                        className="w-6 h-6 md:w-7 md:h-7 rounded-md shadow-md"
                                        style={{ backgroundColor: currentBrand.primaryColor }}
                                        title="Primary"
                                    />
                                    <div
                                        className="w-6 h-6 md:w-7 md:h-7 rounded-md shadow-md"
                                        style={{ backgroundColor: currentBrand.accentColor }}
                                        title="Accent"
                                    />
                                    <div
                                        className="w-6 h-6 md:w-7 md:h-7 rounded-md shadow-md border border-white/20"
                                        style={{ backgroundColor: currentBrand.bgColor }}
                                        title="Background"
                                    />
                                    <span className="ml-1 text-[10px] md:text-xs text-white/40 font-mono">
                                        {currentBrand.primaryColor}
                                    </span>
                                </motion.div>

                                {/* Typography Preview */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 0.4 }}
                                    className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-white/50 justify-center md:justify-start flex-wrap"
                                >
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                                        {currentBrand.headingFont.split("'")[1] || 'Inter'}
                                    </span>
                                    <span className="px-2 py-1 rounded bg-white/5 border border-white/5">
                                        {currentBrand.bodyFont.split("'")[1] || 'Inter'}
                                    </span>
                                </motion.div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress Dots */}
                <div className="absolute bottom-4 md:bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:gap-2">
                    {SHOWCASE_BRANDS.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={cn(
                                "h-1.5 md:h-2 rounded-full transition-all duration-300",
                                i === index
                                    ? "bg-white w-4 md:w-6"
                                    : "w-1.5 md:w-2 bg-white/30 hover:bg-white/50"
                            )}
                        />
                    ))}
                </div>

                {/* Algorithm Badge */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs text-white/50 font-mono">
                    {currentBrand.algorithm}
                </div>
            </div>
        </div>
    );
}
