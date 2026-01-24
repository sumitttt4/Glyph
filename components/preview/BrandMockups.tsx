"use client";

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Maximize2, Grid3X3, Rows3 } from 'lucide-react';
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

interface BrandMockupsProps {
    brand: BrandIdentity;
    className?: string;
    showCarousel?: boolean;
    defaultMockup?: MockupType;
    onMockupChange?: (mockup: MockupType) => void;
}

// ============================================
// MOCKUP CATEGORY FILTERS
// ============================================

const MOCKUP_CATEGORIES = {
    all: 'All',
    digital: 'Digital',
    print: 'Print',
    merchandise: 'Merch',
    signage: 'Signage',
} as const;

type MockupCategory = keyof typeof MOCKUP_CATEGORIES;

// ============================================
// INDIVIDUAL MOCKUP COMPONENTS
// ============================================

/**
 * 3D Business Card Mockup
 */
function BusinessCard3DMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1200px' }}>
            <div
                className="absolute w-[320px] h-[180px] bg-black/20 rounded-xl blur-xl"
                style={{
                    transform: 'rotateX(55deg) rotateZ(-25deg) translateZ(-80px) translateY(40px)',
                    transformStyle: 'preserve-3d',
                }}
            />
            <div
                className="absolute w-[320px] h-[180px] rounded-xl"
                style={{
                    background: colors.surface,
                    transform: 'rotateX(55deg) rotateZ(-25deg) translateZ(-40px) translateY(20px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                }}
            />
            <div
                className="absolute w-[320px] h-[180px] rounded-xl overflow-hidden"
                style={{
                    background: colors.bg,
                    transform: 'rotateX(55deg) rotateZ(-25deg) translateZ(0px)',
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
function BillboardMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const tagline = brand.strategy?.tagline || `Welcome to ${brand.name}`;

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            <div
                className="relative w-full max-w-[500px] rounded-lg overflow-hidden"
                style={{
                    aspectRatio: '2/1',
                    boxShadow: '0 30px 60px -15px rgba(0,0,0,0.4)',
                }}
            >
                {/* Sky gradient */}
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to bottom, #87CEEB, #E0F0FF)' }}
                />
                {/* Ground */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gray-600" />
                {/* Billboard */}
                <div
                    className="absolute left-[10%] right-[10%] top-[15%] h-[45%] rounded"
                    style={{ background: colors.primary }}
                >
                    <div className="absolute inset-0 flex items-center px-6">
                        <div className="w-16 h-16 flex-shrink-0" style={{ filter: 'brightness(0) invert(1)' }}>
                            <LogoComposition brand={brand} className="w-full h-full" />
                        </div>
                        <div className="ml-4">
                            <p className="text-white font-bold text-xl" style={{ fontFamily }}>
                                {brand.name}
                            </p>
                            <p className="text-white/80 text-sm" style={{ fontFamily }}>
                                {tagline}
                            </p>
                        </div>
                    </div>
                </div>
                {/* Support poles */}
                <div className="absolute bottom-[25%] left-[25%] w-2 h-[35%] bg-gray-500" />
                <div className="absolute bottom-[25%] right-[25%] w-2 h-[35%] bg-gray-500" />
            </div>
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
                className="relative w-full max-w-[500px]"
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
                                Welcome to {brand.name}
                            </p>
                            <button
                                className="px-4 py-1.5 rounded text-xs text-white"
                                style={{ background: colors.primary }}
                            >
                                Get Started
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
                className="relative w-full max-w-[400px] h-[120px] rounded-lg overflow-hidden"
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
                    <div className="w-20 h-20 mb-2" style={{ filter: 'brightness(0) invert(1)' }}>
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
                    style={{ filter: 'brightness(0) invert(1)' }}
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
                className="relative w-[180px] rounded-[2rem] overflow-hidden"
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
            <div className="relative w-full max-w-[600px] rounded-lg overflow-hidden" style={{ aspectRatio: '1584/396', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
                <div className="absolute inset-0" style={{ background: colors.primary }} />
                <div className="absolute inset-0 flex items-center justify-between px-8">
                    <div className="w-20 h-20 flex-shrink-0" style={{ filter: 'brightness(0) invert(1)' }}>
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
            <div className="relative w-full max-w-[600px] rounded-xl overflow-hidden" style={{ boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)' }}>
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
            <div className="relative w-[200px] h-[400px] rounded-[2.5rem] overflow-hidden" style={{ background: '#1a1a1a', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 3px #333' }}>
                <div className="absolute inset-[3px] rounded-[2.3rem] overflow-hidden bg-black">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: colors.primary }}>
                        <div className="w-20 h-20 mb-4" style={{ filter: 'brightness(0) invert(1)' }}>
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

// ============================================
// MOCKUP RENDERER
// ============================================

function renderMockup(type: MockupType, brand: BrandIdentity) {
    switch (type) {
        case 'business-card': return <BusinessCard3DMockup brand={brand} />;
        case 'linkedin-banner': return <LinkedInBannerMockup brand={brand} />;
        case 'website-header': return <WebsiteHeaderMockup brand={brand} />;
        case 'mobile-app': return <MobileAppMockup brand={brand} />;
        case 'poster': return <PosterMockup brand={brand} />;
        case 'letterhead': return <LetterheadMockup brand={brand} />;
        case 'billboard': return <BillboardMockup brand={brand} />;
        case 'phone-screen': return <PhoneScreenMockup brand={brand} />;
        case 'laptop-screen': return <LaptopScreenMockup brand={brand} />;
        case 'storefront-sign': return <StorefrontSignMockup brand={brand} />;
        case 'packaging-box': return <PackagingBoxMockup brand={brand} />;
        case 'hoodie': return <HoodieMockup brand={brand} />;
        case 'tote-bag': return <ToteBagMockup brand={brand} />;
        case 'coffee-cup': return <CoffeeCupMockup brand={brand} />;
        default: return <BusinessCard3DMockup brand={brand} />;
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
}: BrandMockupsProps) {
    const [selectedMockup, setSelectedMockup] = useState<MockupType>(defaultMockup);
    const [selectedCategory, setSelectedCategory] = useState<MockupCategory>('all');
    const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
    const [modalOpen, setModalOpen] = useState(false);
    const [downloadingMockup, setDownloadingMockup] = useState<MockupType | null>(null);
    const mockupRef = useRef<HTMLDivElement>(null);

    // Initialize mockup state on mount
    React.useEffect(() => {
        initMockupState(brand);
    }, [brand.id]);

    // Filter mockups by category
    const filteredMockups = ALL_MOCKUP_TYPES.filter((type) => {
        if (selectedCategory === 'all') return true;
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

    // Grid view
    if (!showCarousel || viewMode === 'grid') {
        return (
            <div className={`flex flex-col ${className}`}>
                {/* Header with view toggle */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-2">
                        {(Object.entries(MOCKUP_CATEGORIES) as [MockupCategory, string][]).map(([key, label]) => (
                            <button
                                key={key}
                                onClick={() => setSelectedCategory(key)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedCategory === key
                                        ? 'bg-white dark:bg-gray-700 shadow-sm'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                    {showCarousel && (
                        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                            <button
                                onClick={() => setViewMode('carousel')}
                                className={`p-2 rounded ${viewMode === 'carousel' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                            >
                                <Rows3 className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow' : ''}`}
                            >
                                <Grid3X3 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredMockups.map((type) => {
                        const info = MOCKUP_METADATA[type];
                        const isSelected = selectedMockup === type;

                        return (
                            <motion.div
                                key={type}
                                whileHover={{ scale: 1.02 }}
                                className={`relative rounded-xl border-2 transition-all overflow-hidden group ${isSelected
                                        ? 'border-blue-500 ring-2 ring-blue-500/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                <button
                                    onClick={() => handleMockupSelect(type)}
                                    className="w-full aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
                                >
                                    <div className="w-full h-full transform scale-50 origin-center">
                                        {renderMockup(type, brand)}
                                    </div>
                                </button>

                                {/* Overlay buttons */}
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => { setSelectedMockup(type); setModalOpen(true); }}
                                        className="p-1.5 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                                        title="View 3D"
                                    >
                                        <Maximize2 className="w-4 h-4 text-white" />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(type)}
                                        disabled={downloadingMockup === type}
                                        className="p-1.5 bg-black/50 rounded-lg hover:bg-black/70 transition-colors disabled:opacity-50"
                                        title="Download PNG"
                                    >
                                        <Download className="w-4 h-4 text-white" />
                                    </button>
                                </div>

                                {/* Label */}
                                <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                                    <span className="text-xs font-medium">{info.name}</span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* 3D Modal */}
                <Mockup3DModal
                    isOpen={modalOpen}
                    onClose={() => setModalOpen(false)}
                    mockupType={selectedMockup}
                    brandName={brand.name}
                >
                    {renderMockup(selectedMockup, brand)}
                </Mockup3DModal>
            </div>
        );
    }

    // Carousel view
    return (
        <div className={`flex flex-col ${className}`}>
            {/* Category filter and view toggle */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-wrap gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    {(Object.entries(MOCKUP_CATEGORIES) as [MockupCategory, string][]).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedCategory(key)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${selectedCategory === key
                                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <button
                        onClick={() => setViewMode('carousel')}
                        className="p-2 rounded bg-white dark:bg-gray-700 shadow"
                    >
                        <Rows3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className="p-2 rounded"
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Mockup selector */}
            <div className="flex flex-wrap gap-2 mb-4">
                {filteredMockups.map((type) => {
                    const info = MOCKUP_METADATA[type];
                    const isSelected = selectedMockup === type;

                    return (
                        <button
                            key={type}
                            onClick={() => handleMockupSelect(type)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${isSelected
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span>{info.icon}</span>
                            <span className="hidden sm:inline">{info.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Mockup display */}
            <div ref={mockupRef} className="relative">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedMockup}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden relative group"
                    >
                        {renderMockup(selectedMockup, brand)}

                        {/* Action buttons */}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setModalOpen(true)}
                                className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                                title="View in 3D"
                            >
                                <Maximize2 className="w-5 h-5 text-white" />
                            </button>
                            <button
                                onClick={() => handleDownload(selectedMockup)}
                                disabled={downloadingMockup === selectedMockup}
                                className="p-2 bg-black/50 rounded-lg hover:bg-black/70 transition-colors disabled:opacity-50"
                                title="Download PNG"
                            >
                                <Download className="w-5 h-5 text-white" />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Description */}
            <div className="mt-3 flex items-center justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {metadata.description} • {metadata.width}x{metadata.height}px
                </p>
                <button
                    onClick={() => handleDownload(selectedMockup)}
                    disabled={downloadingMockup === selectedMockup}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-50"
                >
                    <Download className="w-4 h-4" />
                    {downloadingMockup === selectedMockup ? 'Downloading...' : 'Download'}
                </button>
            </div>

            {/* 3D Modal */}
            <Mockup3DModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                mockupType={selectedMockup}
                brandName={brand.name}
            >
                {renderMockup(selectedMockup, brand)}
            </Mockup3DModal>
        </div>
    );
}

export default BrandMockups;
