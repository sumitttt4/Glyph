"use client";

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';

interface SafariBrowserMockupProps {
    brand: BrandIdentity;
    className?: string;
    isDark?: boolean;
}

/**
 * SafariBrowserMockup (Premium Full-Width Version)
 * A macOS Safari-style browser chrome mockup with rich detail.
 * Supports dark mode for cohesive theme switching.
 */
export const SafariBrowserMockup = ({ brand, className, isDark = false }: SafariBrowserMockupProps) => {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    // Browser chrome colors based on mode
    const chromeColors = isDark ? {
        bg: '#2d2d2d',
        border: '#3d3d3d',
        urlBar: '#1d1d1d',
        urlText: '#a0a0a0',
        gradient: 'from-[#3d3d3d] to-[#2d2d2d]'
    } : {
        bg: '#f5f5f5',
        border: '#d4d4d4',
        urlBar: '#ffffff',
        urlText: '#525252',
        gradient: 'from-[#E8E8E8] to-[#D5D5D5]'
    };

    return (
        <div className={`rounded-xl overflow-hidden border shadow-lg ${isDark ? 'border-stone-700 bg-stone-900' : 'border-stone-300 bg-stone-100'} ${className}`}>
            {/* macOS Window Titlebar */}
            <div className={`h-11 bg-gradient-to-b ${chromeColors.gradient} flex items-center px-4 border-b gap-2 relative`} style={{ borderColor: chromeColors.border }}>
                {/* Traffic Lights */}
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F57] border border-[#E14640] shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DFA123] shadow-inner" />
                    <div className="w-3 h-3 rounded-full bg-[#28C840] border border-[#1AAB29] shadow-inner" />
                </div>

                {/* URL Bar / Tab */}
                <div className="flex-1 flex items-center justify-center mx-8">
                    <div className="rounded-lg shadow-sm border px-4 py-2 flex items-center gap-3 w-full max-w-md" style={{ backgroundColor: chromeColors.urlBar, borderColor: chromeColors.border }}>
                        {/* Favicon */}
                        <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 overflow-hidden">
                            <LogoComposition brand={brand} />
                        </div>
                        {/* URL */}
                        <span className="text-sm truncate font-medium" style={{ color: chromeColors.urlText }}>
                            {brand.name.toLowerCase().replace(/\s+/g, '')}.com — Brand Identity
                        </span>
                        {/* Lock Icon */}
                        <svg className="w-4 h-4 shrink-0" style={{ color: chromeColors.urlText }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                        </svg>
                    </div>
                </div>

                {/* Toolbar placeholder */}
                <div className="w-16" />
            </div>

            {/* Content Area - The "Website" */}
            <div
                className="min-h-[280px] relative overflow-hidden flex flex-col"
                style={{ backgroundColor: tokens.bg }}
            >
                {/* Fake Header Nav */}
                <div className="flex items-center justify-between px-8 py-4 border-b" style={{ borderColor: tokens.border }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8">
                            <LogoComposition brand={brand} />
                        </div>
                        <span className="text-lg font-bold" style={{ color: tokens.text }}>{brand.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm font-medium" style={{ color: tokens.muted }}>
                        <span>Products</span>
                        <span>About</span>
                        <span>Blog</span>
                        <button
                            className="px-4 py-1.5 rounded-full text-white text-xs font-semibold"
                            style={{ backgroundColor: tokens.primary }}
                        >
                            Get Started
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight mb-3" style={{ color: tokens.text }}>
                        Welcome to {brand.name}
                    </h1>
                    <p className="text-base max-w-md mb-6" style={{ color: tokens.muted }}>
                        {brand.strategy?.mission?.slice(0, 100) || "Your brand, elevated. Start building today."}
                    </p>
                    <div className="flex gap-3">
                        <button
                            className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                            style={{ backgroundColor: tokens.primary }}
                        >
                            Explore Now
                        </button>
                        <button
                            className="px-6 py-2.5 rounded-full text-sm font-semibold border"
                            style={{ borderColor: tokens.border, color: tokens.text }}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
