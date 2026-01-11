"use client";

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from './LogoComposition';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MockupProps {
    brand: BrandIdentity;
    className?: string;
}

// 1. BUSINESS CARD MOCKUP (Floating 3D Stack)
export const MockupBusinessCard = ({ brand, className }: MockupProps) => {
    return (
        <div className={cn("relative perspective-[1000px] w-full h-full flex items-center justify-center", className)}>
            {/* Shadow Card (Bottom) */}
            <div
                className="absolute w-[280px] h-[160px] bg-stone-900 rounded-lg shadow-2xl opacity-20"
                style={{ transform: 'rotateX(40deg) rotateZ(30deg) translateZ(-40px) translateX(20px) translateY(20px)' }}
            />

            {/* Main Card (Top) */}
            <div
                className="relative w-[280px] h-[160px] bg-white rounded-lg shadow-xl overflow-hidden border border-stone-100"
                style={{ transform: 'rotateX(40deg) rotateZ(30deg) translateZ(0px)' }}
            >
                {/* Pattern Background */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundColor: brand.theme.tokens.light.primary }}
                />

                {/* Logo Center */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24">
                        <LogoComposition brand={brand} layout="default" overrideColors={{ primary: brand.theme.tokens.light.primary }} />
                    </div>
                </div>

                {/* Corner details */}
                <div className="absolute bottom-4 left-4 text-[8px] font-mono text-stone-500">
                    {brand.vibe.toUpperCase()} DESIGN
                </div>
                <div className="absolute bottom-4 right-4 text-[8px] font-mono text-stone-500">
                    EST. 2024
                </div>
            </div>

            {/* Back Card (Decoration) */}
            <div
                className="absolute w-[280px] h-[160px] rounded-lg shadow-lg -z-10"
                style={{
                    backgroundColor: brand.theme.tokens.light.primary,
                    transform: 'rotateX(40deg) rotateZ(30deg) translateZ(-60px) translateX(-40px) translateY(-40px)'
                }}
            >
                <div className="absolute inset-0 flex items-center justify-center opacity-30 mix-blend-multiply">
                    <LogoComposition brand={brand} layout="minimal_grid" />
                </div>
            </div>
        </div>
    );
};

// 2. TOTE BAG MOCKUP (Fabric Texture)
export const MockupToteBag = ({ brand, className }: MockupProps) => {
    return (
        <div className={cn("relative w-full h-full flex items-center justify-center bg-stone-50", className)}>
            {/* The Bag Container - Scaled to fit */}
            <div className="relative transform scale-75 md:scale-90 translateY(10%)">

                {/* Handles (Behind) */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-32 h-32 rounded-t-full border-[16px] border-[#D6D3D1] -z-10 shadow-sm" />

                {/* Bag Body */}
                <div className="relative w-[280px] h-[360px] bg-[#EAE8E6] shadow-2xl rounded-b-3xl rounded-t-sm flex items-center justify-center overflow-hidden">

                    {/* 1. Base Fabric Texture (SVG Noise) */}
                    <div
                        className="absolute inset-0 opacity-[0.15] mix-blend-multiply pointer-events-none"
                        style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
                        }}
                    />

                    {/* 2. Wrinkles / Folds (Gradients) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/5 blur-2xl rounded-full pointer-events-none" />
                    <div className="absolute top-0 w-full h-8 bg-gradient-to-b from-black/5 to-transparent" />

                    {/* 3. Printed Logo (Multiply for Ink Effect) */}
                    <div className="w-48 opacity-85 mix-blend-multiply filter blur-[0.5px] rotate-[0.5deg]">
                        <LogoComposition
                            brand={{ ...brand, logoAssemblerLayout: 'stacked' }}
                            layout="generative"
                            overrideColors={{ primary: '#1c1917' }} // Always dark ink on tote
                        />
                    </div>
                </div>

                {/* Handles (Front Overlap Detail - optional for stitching effect) */}
                <div className="absolute -top-1 left-[74px] w-4 h-4 bg-[#D6D3D1] rounded-full shadow-sm" />
                <div className="absolute -top-1 right-[74px] w-4 h-4 bg-[#D6D3D1] rounded-full shadow-sm" />
            </div>
        </div>
    );
};

// 3. STOREFRONT SIGNAGE (Glass/Metal Effect)
export const MockupSignage = ({ brand, className }: MockupProps) => {
    return (
        <div className={cn("relative w-full h-full flex items-center justify-center overflow-hidden bg-stone-900", className)}>
            {/* Wall Texture */}
            <div className="absolute inset-0 bg-neutral-900 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Light Source */}
            <div className="absolute top-0 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

            {/* The Sign */}
            <div className="relative z-10 p-8 rounded-full border border-white/20 bg-stone-900/80 backdrop-blur-md shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                {/* Neon Glow Effect */}
                <div
                    className="absolute inset-0 rounded-full blur-[40px] opacity-40"
                    style={{ backgroundColor: brand.theme.tokens.light.primary }}
                />

                <div className="relative w-32 h-32 flex items-center justify-center">
                    {/* Glowing Logo */}
                    <LogoComposition
                        brand={{ ...brand, logoAssemblerLayout: 'icon_only' }}
                        layout="generative" // Just the symbol for signage usually
                        overrideColors={{ primary: '#FFFFFF' }} // White neon
                    />
                </div>
            </div>

            {/* Mounting Brackets */}
            <div className="absolute top-1/2 left-0 w-1/2 h-[2px] bg-stone-800 -z-10" />
        </div>
    );
};


// 4. SOCIAL MEDIA AVATAR (Circle Crop)
export const MockupSocial = ({ brand, className }: MockupProps) => {
    return (
        <div className={cn("relative w-full h-full flex items-center justify-center bg-white", className)}>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <div className="absolute inset-0" style={{ backgroundColor: brand.theme.tokens.light.primary }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 text-white">
                        <LogoComposition
                            brand={{ ...brand, logoAssemblerLayout: 'icon_only' }}
                            layout="generative"
                            overrideColors={{ primary: '#FFFFFF' }}
                        />
                    </div>
                </div>
            </div>
            {/* Fake Interface Elements */}
            <div className="absolute bottom-12 right-12 w-6 h-6 bg-blue-500 rounded-full border-2 border-white flex items-center justify-center shadow-md">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>

            <div className="absolute bottom-4 font-bold text-stone-800 text-sm">@{brand.name.toLowerCase().replace(/\s/g, '')}</div>
        </div>
    );
}
