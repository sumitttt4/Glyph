"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { cn } from '@/lib/utils';
import { generateDeepColor } from '@/lib/utils';


// ============================================
// HELPER: iOS Squircle SVG Path
// ============================================
// Normalized path for 100x100 viewbox
const SQUIRCLE_PATH = "M 50,0 C 13.3333,0 0,13.3333 0,50 C 0,86.6667 13.3333,100 50,100 C 86.6667,100 100,86.6667 100,50 C 100,13.3333 86.6667,0 50,0 Z";

// ============================================
// COMPONENT: REAL APP ICON SIMULATION
// ============================================
interface RealAppIconProps {
    type: 'mail' | 'music' | 'messages' | 'maps';
    size?: number;
}

function RealAppIcon({ type, size = 52 }: RealAppIconProps) {
    const renderContent = () => {
        // Use Wikimedia Commons Redirects for consistent "real" icons
        // This is safe because they are official representations hosted on Commons
        const ICONS = {
            mail: "https://commons.wikimedia.org/wiki/Special:FilePath/Mail_(iOS).svg",
            music: "https://commons.wikimedia.org/wiki/Special:FilePath/Apple_Music_icon.svg",
            messages: "https://commons.wikimedia.org/wiki/Special:FilePath/IMessage_logo.svg",
            maps: "https://commons.wikimedia.org/wiki/Special:FilePath/Apple_Maps_icon.svg"
        };

        const url = ICONS[type as keyof typeof ICONS];

        if (url) {
            return (
                <img
                    src={url}
                    alt={`${type} icon`}
                    className="w-full h-full object-cover"
                    draggable={false}
                />
            );
        }

        // Fallback for unknown types (or if wikimedia fails loading in some contexts, though unlikely)
        return <div className="w-full h-full bg-gray-200" />;
    };

    return (
        <div
            className="relative shadow-sm"
            style={{
                width: size,
                height: size,
                borderRadius: `${size * 0.225}px`,
                overflow: 'hidden'
            }}
        >
            {renderContent()}
            {/* Gloss */}
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 40%)'
                }}
            />
        </div>
    );
}

// ============================================
// COMPONENT: BRAND APP ICON
// ============================================

interface AppIconProps {
    brand: BrandIdentity;
    size?: number;
    className?: string;
    showGloss?: boolean;
}

function AppIcon({ brand, size = 120, className, showGloss = true }: AppIconProps) {
    const primary = brand.theme.tokens.light.primary;

    // Helper to get white version of generated logo
    const getWhiteLogoSvg = () => {
        if (brand.generatedLogos && brand.generatedLogos.length > 0) {
            const selected = brand.generatedLogos[brand.selectedLogoIndex || 0];
            if (selected && selected.svg) {
                // Force all strokes and fills to white (except none)
                let svg = selected.svg;

                // Replace hex colors
                svg = svg.replace(/#[0-9A-Fa-f]{3,6}/g, '#FFFFFF');

                // Replace RGB colors
                svg = svg.replace(/rgb\([^)]+\)/g, '#FFFFFF');

                // Ensure fills aren't none
                // This is a naive heuristic but works for most of our engine's output
                // We use a CSS class approach ideally, but inline string manipulation is faster here

                return svg;
            }
        }
        return null; // Fallback to procedural
    };

    const whiteSvg = getWhiteLogoSvg();

    return (
        <div
            className={cn("relative overflow-hidden shrink-0", className)}
            style={{
                width: size,
                height: size,
                borderRadius: `${size * 0.225}px`, // iOS curvature ratio
                backgroundColor: primary,
                boxShadow: `
                    0 1px 1px rgba(0,0,0,0.02), 
                    0 2px 2px rgba(0,0,0,0.02), 
                    0 4px 4px rgba(0,0,0,0.02), 
                    0 8px 8px rgba(0,0,0,0.02),
                    0 16px 16px rgba(0,0,0,0.02)
                `
            }}
        >
            {/* Top Gradient (Light source) */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)'
                }}
            />

            {/* Bottom Gradient (Shadow) */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: 'linear-gradient(0deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0) 40%)'
                }}
            />

            {/* The Logo */}
            <div className="absolute inset-0 flex items-center justify-center z-10 p-[20%]">
                <div className="w-full h-full drop-shadow-sm filter">
                    {whiteSvg ? (
                        <div
                            className="w-full h-full flex items-center justify-center text-white fill-white stroke-white"
                            dangerouslySetInnerHTML={{ __html: whiteSvg }}
                            style={{
                                color: 'white',
                                fill: 'white'
                            }}
                        />
                    ) : (
                        <LogoComposition
                            brand={brand}
                            overrideColors={{ primary: '#FFFFFF', accent: '#FFFFFF', bg: 'transparent' }}
                        />
                    )}
                </div>
            </div>

            {/* iOS Gloss Reflection (Classic/Modern Hybrid) */}
            {showGloss && (
                <div
                    className="absolute inset-0 z-20 pointer-events-none opacity-20"
                    style={{
                        background: 'radial-gradient(140% 140% at 0% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)'
                    }}
                />
            )}
        </div>
    );
}

// ============================================
// MAIN COMPONENT: APP ICON MACRO
// ============================================

export function AppIconMacro({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    return (
        <section className="relative w-full overflow-hidden bg-[#000000] py-24">
            {/* Background Ambience */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[120px] rounded-full"
                    style={{ backgroundColor: colors.deep }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32">

                    {/* LEFT: THE HERO ICON (Huge) */}
                    <div className="flex flex-col items-center gap-8">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", duration: 0.8, bounce: 0.3 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            {/* Glow behind icon */}
                            <div
                                className="absolute inset-0 blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"
                                style={{ backgroundColor: primary }}
                            />

                            <AppIcon brand={brand} size={240} className="shadow-2xl" />

                            <div className="absolute -bottom-12 left-0 right-0 text-center">
                                <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-mono text-white/60 tracking-widest border border-white/5">
                                    1024px
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT: THE CONTEXT (Mockup) */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="flex flex-col gap-6"
                    >
                        <div>
                            <h3 className="text-2xl font-bold text-white mb-2">iOS Ready</h3>
                            <p className="text-stone-400 max-w-sm text-sm leading-relaxed">
                                Optimized for the SpringBoard grid. Pixel-perfect scaling from the App Store to the Notification Center.
                            </p>
                        </div>

                        {/* Simulated Home Screen Grid Row */}
                        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-sm">
                            <div className="flex items-center justify-between gap-4 opacity-50 mb-6">
                                <span className="text-[10px] text-white/40 font-mono">iPhone 16 Pro</span>
                                <div className="flex gap-1">
                                    <div className="w-1 h-3 rounded-full bg-white/20"></div>
                                    <div className="w-1 h-2 rounded-full bg-white/20"></div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                                {/* REAL APPS */}
                                <div className="flex flex-col items-center gap-1.5">
                                    <RealAppIcon type="mail" />
                                    <span className="text-[10px] font-medium text-white/80">Mail</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <RealAppIcon type="music" />
                                    <span className="text-[10px] font-medium text-white/80">Music</span>
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <RealAppIcon type="messages" />
                                    <span className="text-[10px] font-medium text-white/80">Messages</span>
                                </div>

                                {/* THE BRAND APP */}
                                <div className="flex flex-col items-center gap-1.5 relative">
                                    <div className="relative">
                                        <AppIcon brand={brand} size={52} />
                                        {/* Notification Badge */}
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            whileInView={{ scale: 1 }}
                                            transition={{ delay: 0.8, type: "spring" }}
                                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full border-[2px] border-[#1c1c1e] flex items-center justify-center z-30 shadow-sm"
                                        >
                                            <span className="text-[10px] font-bold text-white">1</span>
                                        </motion.div>
                                    </div>
                                    <span className="text-[10px] font-medium text-white tracking-tight">{brand.name}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/5 text-xs font-semibold text-white transition-colors flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                                Mobile Guide
                            </button>
                            <button className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/5 text-xs font-semibold text-white transition-colors flex items-center gap-2">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                Export .PNG
                            </button>
                        </div>

                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default AppIconMacro;
