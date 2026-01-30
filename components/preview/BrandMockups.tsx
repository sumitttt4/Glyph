"use client";

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Download, Maximize2 } from 'lucide-react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { Mockup3DModal } from './Mockup3DModal';
import {
    MockupType,
    MOCKUP_METADATA,
    ALL_MOCKUP_TYPES,
    storeMockup,
    downloadMockupAsPng,
    initMockupState,
} from '@/lib/mockup-state';
import { getMockupForExport } from '@/components/export/ExportMockups';

// ============================================
// TYPES
// ============================================

type MockupCategory = 'essentials' | 'digital' | 'social' | 'outdoor' | 'merch';

interface BrandMockupsProps {
    brand: BrandIdentity;
    className?: string;
    showCarousel?: boolean;
    defaultMockup?: MockupType;
    onMockupChange?: (mockup: MockupType) => void;
    showTabsInside?: boolean;
    externalCategory?: MockupCategory;
    onCategoryChange?: (category: MockupCategory) => void;
}

// ============================================
// MOCKUP CATEGORY FILTERS
// ============================================

const MOCKUP_CATEGORIES = {
    essentials: 'Essentials',
    digital: 'Digital',
    social: 'Social',
    outdoor: 'Outdoor',
    merch: 'Merch',
} as const;

// ============================================
// INDIVIDUAL MOCKUP COMPONENTS
// ============================================

/**
 * 3D Business Card Mockup
 */
function BusinessCard3DMockup({ brand, isInteractive = false }: { brand: BrandIdentity; isInteractive?: boolean }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    const baseTransform = isInteractive
        ? {}
        : { transform: 'rotateX(55deg) rotateZ(-25deg)' };

    return (
        <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
            <div
                className="absolute w-[320px] h-[180px] bg-black/20 rounded-xl blur-xl"
                style={{
                    ...baseTransform,
                    transform: isInteractive
                        ? 'translateZ(-80px)'
                        : 'rotateX(55deg) rotateZ(-25deg) translateZ(-80px) translateY(40px)',
                    transformStyle: 'preserve-3d',
                }}
            />
            <div
                className="absolute w-[320px] h-[180px] rounded-xl"
                style={{
                    background: colors.surface,
                    ...baseTransform,
                    transform: isInteractive
                        ? 'translateZ(-40px)'
                        : 'rotateX(55deg) rotateZ(-25deg) translateZ(-40px) translateY(20px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                }}
            />
            <div
                className="absolute w-[320px] h-[180px] rounded-xl overflow-hidden"
                style={{
                    background: colors.bg,
                    ...baseTransform,
                    transform: isInteractive
                        ? 'translateZ(0px)'
                        : 'rotateX(55deg) rotateZ(-25deg) translateZ(0px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                }}
            >
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="w-16 h-16">
                        <LogoComposition brand={brand} className="w-full h-full" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold" style={{ color: colors.text, fontFamily }}>
                            {brand.name}
                        </p>
                        <p className="text-xs opacity-60" style={{ color: colors.text }}>
                            hello@{brand.name.toLowerCase().replace(/\s+/g, '')}.com
                        </p>
                    </div>
                </div>
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)' }}
                />
            </div>
        </div>
    );
}

/**
 * Billboard Mockup
 */
/**
 * Billboard Mockup - Times Square Style
 */
function BillboardMockup({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full bg-stone-950 flex items-center justify-center overflow-hidden perspective-[1000px]">
            {/* Dynamic Ambient Background */}
            <div className="absolute inset-0">
                {/* Night Sky Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-stone-900 to-black opacity-90" />

                {/* City Light Bleed (Bottom Up) */}
                <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-purple-900/20 via-blue-900/10 to-transparent blur-3xl opacity-50" />

                {/* Bloom from screen */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] blur-[100px] opacity-20"
                    style={{ background: primary }}
                />
            </div>

            {/* The "Times Square" Curve Screen */}
            <motion.div
                initial={{ scale: 1.4, z: 100 }}
                animate={{ scale: 1, z: 0 }}
                transition={{ duration: 1.8, ease: "easeOut" }}
                className="relative z-10 w-[85%] aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl"
                style={{
                    boxShadow: `0 0 80px -20px ${primary}60`
                }}
            >
                {/* Screen Mesh/Grid Texture */}
                <div
                    className="absolute inset-0 z-20 pointer-events-none opacity-30 mix-blend-overlay"
                    style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: '4px 4px'
                    }}
                />

                {/* Brand Content */}
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    {/* Background Animation */}
                    <div className="absolute inset-0 bg-black">
                        <div
                            className="absolute inset-0 opacity-50"
                            style={{
                                background: `radial-gradient(circle at 50% 50%, ${primary}, transparent 70%)`
                            }}
                        />
                        <div
                            className="absolute inset-0 opacity-30"
                            style={{
                                backgroundImage: `repeating-linear-gradient(45deg, ${primary}20 0px, transparent 2px, transparent 10px)`
                            }}
                        />
                    </div>

                    {/* Central Logo Lockup */}
                    <div className="relative z-30 flex flex-col items-center p-10 text-center">
                        <motion.div
                            className="w-32 h-32 md:w-48 md:h-48 mb-6 drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <LogoComposition brand={brand} overrideColors={{ primary: '#ffffff' }} />
                        </motion.div>

                        <motion.h1
                            className="text-4xl md:text-6xl font-bold text-white tracking-tight uppercase"
                            style={{
                                fontFamily,
                                textShadow: `0 0 30px ${primary}`
                            }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                        >
                            {brand.name}
                        </motion.h1>
                    </div>
                </div>

                {/* Screen Gloss */}
                <div className="absolute inset-0 z-40 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
            </motion.div>
        </div>
    );
}

/**
 * Laptop Screen Mockup
 */
function LaptopScreenMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div
                className="relative w-full max-w-[80%]"
                style={{ boxShadow: '0 40px 80px -20px rgba(0,0,0,0.3)' }}
            >
                {/* Screen bezel */}
                <div className="bg-[#2a2a2a] rounded-t-xl p-2">
                    {/* Camera */}
                    <div className="flex justify-center mb-1">
                        <div className="w-2 h-2 rounded-full bg-gray-700" />
                    </div>
                    {/* Screen */}
                    <div className="rounded overflow-hidden" style={{ background: colors.bg, aspectRatio: '16/10' }}>
                        {/* Nav */}
                        <div className="p-3 flex items-center gap-2 border-b" style={{ borderColor: colors.border }}>
                            <div className="w-5 h-5">
                                <LogoComposition brand={brand} className="w-full h-full" />
                            </div>
                            <span className="text-xs font-semibold" style={{ color: colors.text, fontFamily }}>
                                {brand.name}
                            </span>
                        </div>
                        {/* Hero */}
                        <div className="p-6 text-center">
                            <p className="text-lg font-bold mb-2" style={{ color: colors.text, fontFamily }}>
                                Experience {brand.name}
                            </p>
                            <p className="text-xs mb-3 opacity-60" style={{ color: colors.text }}>
                                {brand.strategy?.tagline || `Crafting exceptional ${brand.vibe} experiences`}
                            </p>
                            <button
                                className="px-4 py-1.5 rounded text-xs text-white font-medium"
                                style={{ background: colors.primary }}
                            >
                                Explore Now
                            </button>
                        </div>
                    </div>
                </div>
                {/* Base */}
                <div className="h-3 bg-gradient-to-b from-gray-300 to-gray-400 rounded-b-lg" />
                <div className="h-1 bg-gray-300 mx-auto w-1/3 rounded-b" />
            </div>
        </div>
    );
}

/**
 * Storefront Sign Mockup
 */
function StorefrontSignMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Brick wall */}
            <div
                className="absolute inset-0"
                style={{
                    background: '#4a4a4a',
                    backgroundImage: `
                        repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 24px,
                            #555 24px,
                            #555 25px
                        ),
                        repeating-linear-gradient(
                            90deg,
                            transparent,
                            transparent 49px,
                            #555 49px,
                            #555 50px
                        )
                    `,
                }}
            />
            {/* Sign box */}
            <div
                className="relative w-full max-w-[80%] h-[120px] rounded-lg overflow-hidden"
                style={{
                    background: '#1a1a1a',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
            >
                <div className="absolute inset-2 rounded flex items-center px-6 gap-4">
                    {/* Logo with glow */}
                    <div
                        className="w-16 h-16 flex-shrink-0"
                        style={{ filter: `drop-shadow(0 0 10px ${colors.primary})` }}
                    >
                        <LogoComposition brand={brand} className="w-full h-full" />
                    </div>
                    {/* Brand name with neon effect */}
                    <p
                        className="text-3xl font-bold"
                        style={{
                            color: colors.primary,
                            fontFamily,
                            textShadow: `0 0 10px ${colors.primary}, 0 0 20px ${colors.primary}`,
                        }}
                    >
                        {brand.name}
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * Packaging Box Mockup
 */
function PackagingBoxMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
            <div
                className="relative"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: 'rotateX(-10deg) rotateY(-20deg)',
                }}
            >
                {/* Front face */}
                <div
                    className="w-[200px] h-[200px] flex flex-col items-center justify-center"
                    style={{
                        background: colors.primary,
                        boxShadow: '20px 20px 40px rgba(0,0,0,0.3)',
                    }}
                >
                    <div className="w-20 h-20 mb-2">
                        <LogoComposition brand={brand} className="w-full h-full" />
                    </div>
                    <p className="text-white font-bold" style={{ fontFamily }}>
                        {brand.name}
                    </p>
                </div>
                {/* Right face */}
                <div
                    className="absolute w-[80px] h-[200px] top-0"
                    style={{
                        left: '200px',
                        background: `linear-gradient(to right, ${colors.primary}dd, ${colors.primary}99)`,
                        transform: 'rotateY(90deg) translateZ(40px)',
                        transformOrigin: 'left',
                    }}
                />
                {/* Top face */}
                <div
                    className="absolute w-[200px] h-[80px]"
                    style={{
                        top: '-80px',
                        background: `linear-gradient(to bottom, ${colors.primary}, ${colors.primary}ee)`,
                        transform: 'rotateX(90deg) translateZ(0)',
                        transformOrigin: 'bottom',
                    }}
                />
            </div>
        </div>
    );
}

/**
 * Hoodie Mockup
 */
function HoodieMockup({ brand }: { brand: BrandIdentity }) {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div
                className="relative w-[280px]"
                style={{ boxShadow: '0 30px 60px -15px rgba(0,0,0,0.25)' }}
            >
                {/* Hoodie shape */}
                <svg viewBox="0 0 280 320" className="w-full">
                    <defs>
                        <linearGradient id="hoodie-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2d2d2d" />
                            <stop offset="100%" stopColor="#1a1a1a" />
                        </linearGradient>
                    </defs>
                    {/* Body */}
                    <path
                        d="M40 100 Q40 70 70 60 L85 40 Q100 20 140 20 Q180 20 195 40 L210 60 Q240 70 240 100 L240 300 Q240 310 230 310 L50 310 Q40 310 40 300 Z"
                        fill="url(#hoodie-grad)"
                    />
                    {/* Hood */}
                    <ellipse cx="140" cy="30" rx="35" ry="15" fill="#0a0a0a" />
                    {/* Left sleeve */}
                    <path d="M40 100 L10 150 Q0 165 10 175 L25 210 Q30 220 45 215 L40 160" fill="url(#hoodie-grad)" />
                    {/* Right sleeve */}
                    <path d="M240 100 L270 150 Q280 165 270 175 L255 210 Q250 220 235 215 L240 160" fill="url(#hoodie-grad)" />
                    {/* Pocket */}
                    <path d="M70 180 Q70 165 90 165 L190 165 Q210 165 210 180 L210 240 Q210 255 190 255 L90 255 Q70 255 70 240 Z" fill="#151515" opacity="0.5" />
                </svg>
                {/* Logo */}
                <div
                    className="absolute left-1/2 top-[35%] -translate-x-1/2 w-20 h-20"
                >
                    <LogoComposition brand={brand} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
}

/**
 * Tote Bag Mockup
 */
function ToteBagMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative" style={{ boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)' }}>
                <svg viewBox="0 0 240 280" className="w-[240px]">
                    <defs>
                        <linearGradient id="canvas-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#f5f0e8" />
                            <stop offset="100%" stopColor="#e0dbd3" />
                        </linearGradient>
                    </defs>
                    {/* Handles */}
                    <path d="M60 20 Q60 5 75 5 L85 5 Q95 5 95 15 L95 60" stroke="#c4b9a8" strokeWidth="10" fill="none" strokeLinecap="round" />
                    <path d="M180 20 Q180 5 165 5 L155 5 Q145 5 145 15 L145 60" stroke="#c4b9a8" strokeWidth="10" fill="none" strokeLinecap="round" />
                    {/* Bag body */}
                    <path d="M20 60 L30 250 Q32 265 50 265 L190 265 Q208 265 210 250 L220 60 Q220 50 210 50 L30 50 Q20 50 20 60 Z" fill="url(#canvas-grad)" />
                </svg>
                {/* Logo */}
                <div className="absolute left-1/2 top-[45%] -translate-x-1/2 w-24 h-24">
                    <LogoComposition brand={brand} className="w-full h-full" />
                </div>
                {/* Brand name */}
                <p
                    className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-sm font-semibold"
                    style={{ color: colors.text, fontFamily }}
                >
                    {brand.name}
                </p>
            </div>
        </div>
    );
}

/**
 * Coffee Cup Mockup
 */
function CoffeeCupMockup({ brand }: { brand: BrandIdentity }) {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative" style={{ boxShadow: '0 30px 60px -15px rgba(0,0,0,0.3)' }}>
                <svg viewBox="0 0 200 200" className="w-[200px]">
                    <defs>
                        <linearGradient id="ceramic-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="50%" stopColor="#f0f0f0" />
                            <stop offset="100%" stopColor="#e8e8e8" />
                        </linearGradient>
                    </defs>
                    {/* Cup body */}
                    <path d="M50 50 Q48 140 55 155 Q60 165 100 165 Q140 165 145 155 Q152 140 150 50" fill="url(#ceramic-grad)" />
                    {/* Coffee surface */}
                    <ellipse cx="100" cy="55" rx="45" ry="10" fill="#3d2314" />
                    {/* Rim */}
                    <ellipse cx="100" cy="50" rx="50" ry="12" fill="none" stroke="#e0e0e0" strokeWidth="4" />
                    {/* Handle */}
                    <path d="M150 70 Q175 70 175 100 Q175 130 150 130" stroke="url(#ceramic-grad)" strokeWidth="12" fill="none" strokeLinecap="round" />
                </svg>
                {/* Logo */}
                <div className="absolute left-1/2 top-[50%] -translate-x-1/2 -translate-y-1/2 w-16 h-16">
                    <LogoComposition brand={brand} className="w-full h-full" />
                </div>
            </div>
        </div>
    );
}

/**
 * Phone Screen (App UI) Mockup
 */
function PhoneScreenMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div
                className="relative w-full max-w-[300px] rounded-[2rem] overflow-hidden"
                style={{
                    aspectRatio: '390/844',
                    background: '#1a1a1a',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 2px #333',
                }}
            >
                <div className="absolute inset-[2px] rounded-[1.8rem] overflow-hidden" style={{ background: colors.bg }}>
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-10" />
                    {/* Header */}
                    <div className="pt-8 px-3 pb-2 flex items-center gap-2" style={{ background: colors.surface }}>
                        <div className="w-5 h-5">
                            <LogoComposition brand={brand} className="w-full h-full" />
                        </div>
                        <span className="text-[10px] font-semibold" style={{ color: colors.text, fontFamily }}>
                            {brand.name}
                        </span>
                    </div>
                    {/* Content */}
                    <div className="p-3 space-y-2">
                        <div className="p-2 rounded-lg" style={{ background: colors.surface }}>
                            <p className="text-[8px] font-semibold" style={{ color: colors.text }}>Welcome back!</p>
                            <button className="mt-1 px-2 py-0.5 rounded text-[6px] text-white" style={{ background: colors.primary }}>
                                Explore
                            </button>
                        </div>
                        <div className="h-8 rounded-lg" style={{ background: colors.surface }} />
                        <div className="h-8 rounded-lg" style={{ background: colors.surface }} />
                    </div>
                    {/* Home indicator */}
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-black/30" />
                </div>
            </div>
        </div>
    );
}

// Re-use existing mockup components (simplified versions for space)
function LinkedInBannerMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const tagline = brand.strategy?.tagline || `Empowering ${brand.vibe} experiences`;

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-[90%] rounded-lg overflow-hidden" style={{ aspectRatio: '1584/396', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
                <div className="absolute inset-0" style={{ background: colors.primary }} />
                <div className="absolute inset-0 flex items-center justify-between px-8">
                    <div className="w-20 h-20 flex-shrink-0">
                        <LogoComposition brand={brand} className="w-full h-full" />
                    </div>
                    <div className="flex-1 ml-8">
                        <p className="text-xl font-bold" style={{ color: colors.bg, fontFamily }}>{tagline}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function WebsiteHeaderMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div className="relative w-full max-w-[90%] rounded-xl overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-3 border-b border-gray-200">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-gray-500">{brand.name.toLowerCase().replace(/\s+/g, '')}.com</div>
                </div>
                <div style={{ background: colors.bg }}>
                    <nav className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8"><LogoComposition brand={brand} className="w-full h-full" /></div>
                            <span className="font-semibold" style={{ color: colors.text, fontFamily }}>{brand.name}</span>
                        </div>
                        <button className="px-4 py-1.5 rounded-md text-white text-sm" style={{ background: colors.primary }}>Get Started</button>
                    </nav>
                    <div className="px-6 py-12 text-center">
                        <h1 className="text-3xl font-bold mb-3" style={{ color: colors.text, fontFamily }}>Welcome to {brand.name}</h1>
                        <button className="px-6 py-2.5 rounded-lg text-white font-medium" style={{ background: colors.primary }}>Learn More</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MobileAppMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-full max-w-[300px] h-auto aspect-[1/2] rounded-[2.5rem] overflow-hidden" style={{ background: '#1a1a1a', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 3px #333' }}>
                <div className="absolute inset-[3px] rounded-[2.3rem] overflow-hidden bg-black">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: colors.primary }}>
                        <div className="w-20 h-20 mb-4">
                            <LogoComposition brand={brand} className="w-full h-full" />
                        </div>
                        <p className="text-white text-lg font-semibold">{brand.name}</p>
                    </div>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                </div>
            </div>
        </div>
    );
}

function PosterMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4" style={{ perspective: '1000px' }}>
            <div className="relative w-[280px] h-[400px] rounded-lg overflow-hidden" style={{ background: colors.bg, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)', transform: 'rotateY(-5deg)' }}>
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 mb-6"><LogoComposition brand={brand} className="w-full h-full" /></div>
                    <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: colors.text, fontFamily }}>{brand.name}</h2>
                    <p className="text-sm text-center opacity-60" style={{ color: colors.text }}>{brand.strategy?.tagline || brand.vibe}</p>
                </div>
            </div>
        </div>
    );
}

function LetterheadMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4" style={{ perspective: '1000px' }}>
            <div className="relative w-[280px] h-[360px] bg-white rounded-sm overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)', transform: 'rotateY(3deg) rotateX(2deg)' }}>
                <div className="h-2" style={{ background: colors.primary }} />
                <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8"><LogoComposition brand={brand} className="w-full h-full" /></div>
                        <span className="text-sm font-semibold" style={{ color: colors.text, fontFamily }}>{brand.name}</span>
                    </div>
                </div>
                <div className="px-6 py-6 space-y-3">
                    <div className="h-2 bg-gray-200 rounded w-1/4" />
                    <div className="h-2 bg-gray-100 rounded w-full" />
                    <div className="h-2 bg-gray-100 rounded w-3/4" />
                </div>
            </div>
        </div>
    );
}

/**
 * Placeholder for Merch items
 */
function MerchPlaceholder({ type, brand }: { type: MockupType; brand: BrandIdentity }) {
    return (
        <div className="relative w-full h-full flex items-center justify-center p-8 bg-stone-100">
            {/* ... Content ... */}
        </div>
    );
}

/**
 * Merch Scene (T-Shirt + Coffee Cup)
 */
/**
 * Premium Tote Bag Mockup (Hanging)
 */
function PremiumToteBagMockup({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRotate({ x: -y * 5, y: x * 5 });
    };

    return (
        <div
            className="w-full h-full flex items-center justify-center perspective-[1200px] overflow-hidden bg-[#EAE8E4] cursor-move group relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setRotate({ x: 0, y: 0 })}
        >
            {/* Dynamic Lighting Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-black/10" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/5 to-transparent blur-3xl" />

            <motion.div
                className="relative flex flex-col items-center"
                animate={{ rotateX: rotate.x, rotateY: rotate.y }}
                transition={{ type: "spring", stiffness: 80, damping: 20 }}
            >
                {/* Hanger Hook / Shadow */}
                <div className="w-1 h-12 bg-stone-300 rounded-full mb-[-20px] relative z-10 shadow-sm" />

                {/* TOTE BAG CONTAINER */}
                <div className="relative w-80 h-[420px] filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.2)]">

                    {/* Handles */}
                    <svg className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-40 h-24 z-0" viewBox="0 0 160 100">
                        <path
                            d="M10,100 C10,20 150,20 150,100"
                            fill="none"
                            stroke="#D6D1CA"
                            strokeWidth="16"
                            strokeLinecap="round"
                        />
                        <path
                            d="M10,100 C10,20 150,20 150,100"
                            fill="none"
                            stroke="#C4BCB4"
                            strokeWidth="16"
                            strokeLinecap="round"
                            strokeDasharray="4 8"
                            opacity="0.5"
                        />
                    </svg>

                    {/* Bag Body */}
                    <div className="absolute inset-0 bg-[#F2EFE9] rounded-sm overflow-hidden transform origin-top hover:scale-[1.01] transition-transform duration-500">
                        {/* Canvas Texture Overlay */}
                        <div
                            className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
                            style={{
                                backgroundImage: `url("https://www.transparenttextures.com/patterns/canvas.png")`,
                                backgroundSize: '100px'
                            }}
                        />

                        {/* DESIGN LAYER: Grid Pattern */}
                        <div className="absolute inset-0 overflow-hidden opacity-90">
                            <div className="absolute inset-[-50%] w-[200%] h-[200%] rotate-12 flex flex-wrap content-center gap-8 justify-center opacity-10">
                                {[...Array(40)].map((_, i) => (
                                    <div key={i} className="w-24 h-24 grayscale">
                                        <LogoComposition brand={brand} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Center Hero Logo */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 relative">
                                <LogoComposition brand={brand} />
                                {/* Ink Bleed Effect */}
                                <div className="absolute inset-0 mix-blend-multiply opacity-20 blur-[1px]">
                                    <LogoComposition brand={brand} />
                                </div>
                            </div>
                        </div>

                        {/* Shadow Gradients (Folds) */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                            background: `
                                linear-gradient(90deg, rgba(0,0,0,0.05) 0%, transparent 10%, transparent 90%, rgba(0,0,0,0.05) 100%),
                                linear-gradient(180deg, rgba(0,0,0,0.1) 0%, transparent 20%)
                            `
                        }} />
                    </div>

                    {/* Stitching Details */}
                    <div className="absolute inset-x-4 top-4 border-t-2 border-dashed border-stone-300/50" />
                    <div className="absolute inset-x-4 bottom-4 border-b-2 border-dashed border-stone-300/50" />
                </div>
            </motion.div>

            {/* Scene Label with Color Swatch */}
            <div className="absolute bottom-6 right-8 flex items-center gap-3">
                <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Material</p>
                    <p className="text-xs font-semibold text-stone-700">Heavyweight Canvas</p>
                </div>
                <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm bg-[#F2EFE9]" />
            </div>
        </div>
    )
}

/**
 * Social Suite Scene (LinkedIn + Instagram)
 */
function SocialSuiteMockup({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    // Simple Tilt Logic
    const [rotate, setRotate] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setRotate({ x: -y * 10, y: x * 10 }); // Gentle 10deg tilt
    };

    const handleMouseLeave = () => setRotate({ x: 0, y: 0 });

    return (
        <div
            className="w-full h-full flex items-center justify-center perspective-[1200px] overflow-hidden bg-stone-50 cursor-move group"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <motion.div
                className="relative w-full max-w-[80%] aspect-video preserve-3d flex items-center justify-center"
                animate={{ rotateX: rotate.x, rotateY: rotate.y }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                {/* LAPTOP (Left, Behind) */}
                <div className="absolute left-0 top-[10%] bottom-[10%] w-[65%] shadow-2xl rounded-xl overflow-hidden bg-white border border-stone-200"
                    style={{
                        transform: 'translateZ(-40px)',
                    }}
                >
                    {/* Browser UI */}
                    <div className="h-6 w-full bg-stone-100 border-b border-stone-200 flex items-center gap-2 px-3">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="ml-4 w-[50%] h-3 bg-white rounded-md shadow-sm border border-stone-100" />
                    </div>
                    {/* LinkedIn Style Profile */}
                    <div className="relative w-full h-full bg-white overflow-hidden">
                        {/* Header Banner */}
                        <div className="h-[35%] w-full overflow-hidden relative">
                            <div className="absolute inset-0 opacity-80" style={{ background: primary }} />
                            {/* Abstract Pattern Overlay */}
                            <svg className="absolute inset-0 w-full h-full opacity-30">
                                <pattern id="social-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                </pattern>
                                <rect width="100%" height="100%" fill="url(#social-grid)" />
                            </svg>
                        </div>

                        {/* Profile Section */}
                        <div className="px-8 relative">
                            {/* Avatar */}
                            <div className="-mt-12 w-24 h-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden relative z-10">
                                <LogoComposition brand={brand} />
                            </div>

                            {/* Info */}
                            <div className="mt-4">
                                <h2 className="text-2xl font-bold text-stone-900 leading-tight">{brand.name}</h2>
                                <p className="text-sm text-stone-500 mb-4 text-balance">
                                    {brand.strategy?.vision || `The future of ${brand.vibe || 'innovation'}.`}
                                </p>
                                <div className="flex gap-2">
                                    <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold shadow-sm">Follow</button>
                                    <button className="px-4 py-1.5 border border-stone-300 text-stone-600 rounded-full text-xs font-bold">Message</button>
                                </div>
                            </div>

                            {/* Faux Content Skeleton */}
                            <div className="mt-8 space-y-3 opacity-30">
                                <div className="h-4 w-3/4 bg-stone-200 rounded" />
                                <div className="h-4 w-full bg-stone-200 rounded" />
                                <div className="h-4 w-5/6 bg-stone-200 rounded" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* PHONE (Right, Front) */}
                <div className="absolute right-[5%] top-[5%] bottom-[5%] w-[25%] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem] overflow-hidden bg-stone-900 border-[6px] border-stone-800"
                    style={{
                        transform: 'translateZ(60px)',
                    }}
                >
                    {/* Screen Content: Instagram Style */}
                    <div className="w-full h-full bg-white flex flex-col">
                        {/* Header */}
                        <div className="h-10 border-b border-stone-100 flex items-center justify-center relative">
                            <span className="font-bold text-xs tracking-tight">{brand.name.toLowerCase()}</span>
                        </div>

                        {/* Profile Details */}
                        <div className="p-3 flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600">
                                <div className="w-full h-full rounded-full border-2 border-white bg-stone-100 overflow-hidden flex items-center justify-center">
                                    <LogoComposition brand={brand} />
                                </div>
                            </div>
                            <div className="flex-1 flex justify-between px-2 text-center">
                                <div><div className="text-xs font-bold">128</div><div className="text-[8px] text-stone-400">Posts</div></div>
                                <div><div className="text-xs font-bold">18k</div><div className="text-[8px] text-stone-400">Followers</div></div>
                                <div><div className="text-xs font-bold">32</div><div className="text-[8px] text-stone-400">Following</div></div>
                            </div>
                        </div>

                        {/* Grid Feed */}
                        <div className="grid grid-cols-3 gap-0.5 flex-1 content-start bg-stone-50 pb-4">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="aspect-square bg-white relative overflow-hidden group">
                                    <div className="absolute inset-0 opacity-10" style={{ background: primary }}></div>
                                    <div className="absolute inset-0 flex items-center justify-center p-2">
                                        <div className="w-full h-full rounded-sm opacity-50 flex items-center justify-center scale-75">
                                            {i % 2 === 0 ? (
                                                <LogoComposition brand={brand} />
                                            ) : (
                                                <div className="w-full h-full rotate-45 opacity-20" style={{ background: primary }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Shine / Reflection */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-transparent z-50 mix-blend-overlay" />
            </motion.div>

            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 bg-white/80 px-3 py-1 rounded-full backdrop-blur">
                    Iteractive 3D Preview
                </span>
            </div>
        </div>
    );
}

// ============================================
// MOCKUP RENDERER
// ============================================

function renderMockup(type: MockupType, brand: BrandIdentity, isInteractive = false) {
    switch (type) {
        case 'business-card': return <BusinessCard3DMockup brand={brand} isInteractive={isInteractive} />;
        case 'linkedin-banner': return <LinkedInBannerMockup brand={brand} />;
        case 'website-header': return <WebsiteHeaderMockup brand={brand} />;
        case 'mobile-app': return <MobileAppMockup brand={brand} />;
        case 'poster': return <PosterMockup brand={brand} />;
        case 'letterhead': return <LetterheadMockup brand={brand} />;
        case 'billboard': return <BillboardMockup brand={brand} />;
        case 'phone-screen': return <PhoneScreenMockup brand={brand} />;
        case 'laptop-screen': return <LaptopScreenMockup brand={brand} />;
        case 'storefront-sign': return <StorefrontSignMockup brand={brand} />;
        /* Essentials / Merch mapping */
        case 'packaging-box':
        case 'hoodie':
        case 'tote-bag':
        case 'coffee-cup':
            return <MerchPlaceholder type={type} brand={brand} />;
        case 'social-suite':
            return <SocialSuiteMockup brand={brand} />;
        case 'merch-suite':
            return <PremiumToteBagMockup brand={brand} />;
        default: return <BusinessCard3DMockup brand={brand} isInteractive={isInteractive} />;
    }
}

// ============================================
// MAIN COMPONENT
// ============================================

export function BrandMockups({
    brand,
    className = '',
    showCarousel = true,
    defaultMockup = 'business-card',
    onMockupChange,
    showTabsInside = true,
    externalCategory,
    onCategoryChange,
}: BrandMockupsProps) {
    const [selectedMockup, setSelectedMockup] = useState<MockupType>(defaultMockup);
    const [internalCategory, setInternalCategory] = useState<MockupCategory>('essentials');

    // Use external category if provided, otherwise use internal state
    const selectedCategory = externalCategory ?? internalCategory;
    const setSelectedCategory = (category: MockupCategory) => {
        if (onCategoryChange) {
            onCategoryChange(category);
        } else {
            setInternalCategory(category);
        }
    };

    const [modalOpen, setModalOpen] = useState(false);
    const [downloadingMockup, setDownloadingMockup] = useState<MockupType | null>(null);
    const mockupRef = useRef<HTMLDivElement>(null);

    // Initialize mockup state on mount
    React.useEffect(() => {
        initMockupState(brand);
    }, [brand.id]);

    // Auto-select best mockup when category changes
    React.useEffect(() => {
        const defaults: Record<MockupCategory, MockupType> = {
            essentials: 'business-card',
            digital: 'laptop-screen',
            social: 'social-suite',
            outdoor: 'billboard',
            merch: 'merch-suite',
        };
        setSelectedMockup(defaults[selectedCategory]);
    }, [selectedCategory]);

    // Filter mockups by category
    const filteredMockups = ALL_MOCKUP_TYPES.filter((type) => {
        return MOCKUP_METADATA[type].category === selectedCategory;
    });

    const handleMockupSelect = useCallback((mockup: MockupType) => {
        setSelectedMockup(mockup);
        onMockupChange?.(mockup);

        // Store mockup in state for export consistency
        const mockupExport = getMockupForExport(brand, mockup as any);
        if (mockupExport) {
            storeMockup(mockup, mockupExport.svg, mockupExport.width, mockupExport.height);
        }
    }, [brand, onMockupChange]);

    const handleDownload = useCallback(async (type: MockupType) => {
        setDownloadingMockup(type);
        try {
            // Generate and store mockup first
            const mockupExport = getMockupForExport(brand, type as any);
            if (mockupExport) {
                storeMockup(type, mockupExport.svg, mockupExport.width, mockupExport.height);
            }
            await downloadMockupAsPng(type, brand.name);
        } catch (error) {
            console.error('Download failed:', error);
        }
        setDownloadingMockup(null);
    }, [brand]);

    const metadata = MOCKUP_METADATA[selectedMockup];



    // Carousel view
    return (
        <section className={`relative w-full h-[600px] overflow-hidden rounded-2xl bg-zinc-950 shadow-2xl border border-zinc-800 ${className}`}>
            {/* FLOATING CONTROLLER (Tabs) */}
            {showTabsInside && (
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                    {(Object.entries(MOCKUP_CATEGORIES) as [MockupCategory, string][]).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative ${selectedCategory === key
                                ? 'text-white shadow-lg scale-105'
                                : 'text-zinc-400 hover:text-white bg-black/30 hover:bg-black/40 backdrop-blur-sm'
                                }`}
                            style={selectedCategory === key ? {
                                background: `linear-gradient(135deg, ${brand.theme.tokens.light.primary}, ${brand.theme.tokens.light.primary}dd)`,
                                boxShadow: `0 4px 20px ${brand.theme.tokens.light.primary}40`
                            } : {}}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}

            {/* MAIN VIEWER */}
            <div className="w-full h-full relative z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedMockup}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        {renderMockup(selectedMockup, brand)}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* GLOBAL CONTROLS */}
            <div className="absolute top-8 right-8 z-20 flex gap-2">
                <button
                    onClick={() => setModalOpen(true)}
                    className="p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Fullscreen"
                >
                    <Maximize2 className="w-5 h-5" />
                </button>
                <button
                    onClick={() => handleDownload(selectedMockup)}
                    disabled={downloadingMockup === selectedMockup}
                    className="p-3 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/50 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                    title="Download"
                >
                    {downloadingMockup === selectedMockup ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* MODAL */}
            <Mockup3DModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                mockupType={selectedMockup}
                brand={brand}
            >
                {renderMockup(selectedMockup, brand, true)}
            </Mockup3DModal>
        </section>
    );
}

export default BrandMockups;
