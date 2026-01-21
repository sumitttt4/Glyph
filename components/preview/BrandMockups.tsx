"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { LogoVariations } from '@/components/logo-engine/types';

// ============================================
// TYPES
// ============================================

export type MockupType =
    | 'business-card'
    | 'linkedin-banner'
    | 'website-header'
    | 'mobile-app'
    | 'poster'
    | 'letterhead';

interface BrandMockupsProps {
    brand: BrandIdentity;
    className?: string;
    showCarousel?: boolean;
    defaultMockup?: MockupType;
    onMockupChange?: (mockup: MockupType) => void;
}

// ============================================
// MOCKUP METADATA
// ============================================

export const MOCKUP_TYPES: MockupType[] = [
    'business-card',
    'linkedin-banner',
    'website-header',
    'mobile-app',
    'poster',
    'letterhead',
];

export const MOCKUP_INFO: Record<MockupType, {
    name: string;
    icon: string;
    description: string;
    logoVariation: 'horizontal' | 'stacked' | 'icon-only' | 'wordmark-only' | 'dark' | 'light';
}> = {
    'business-card': {
        name: 'Business Card',
        icon: '💳',
        description: '3D angled view with shadow',
        logoVariation: 'horizontal',
    },
    'linkedin-banner': {
        name: 'LinkedIn Banner',
        icon: '🔗',
        description: 'Logo + tagline on brand color',
        logoVariation: 'horizontal',
    },
    'website-header': {
        name: 'Website Header',
        icon: '🌐',
        description: 'Browser frame with logo in nav',
        logoVariation: 'horizontal',
    },
    'mobile-app': {
        name: 'Mobile App',
        icon: '📱',
        description: 'Phone frame with splash screen',
        logoVariation: 'icon-only',
    },
    'poster': {
        name: 'Poster',
        icon: '🖼️',
        description: 'Large format with logo centered',
        logoVariation: 'stacked',
    },
    'letterhead': {
        name: 'Letterhead',
        icon: '📄',
        description: 'A4 document with logo header',
        logoVariation: 'horizontal',
    },
};

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
            {/* Shadow card (back) */}
            <div
                className="absolute w-[320px] h-[180px] bg-black/20 rounded-xl blur-xl"
                style={{
                    transform: 'rotateX(55deg) rotateZ(-25deg) translateZ(-80px) translateY(40px)',
                    transformStyle: 'preserve-3d',
                }}
            />

            {/* Back card */}
            <div
                className="absolute w-[320px] h-[180px] rounded-xl"
                style={{
                    background: colors.surface,
                    transform: 'rotateX(55deg) rotateZ(-25deg) translateZ(-40px) translateY(20px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                }}
            />

            {/* Main card (front) */}
            <div
                className="absolute w-[320px] h-[180px] rounded-xl overflow-hidden"
                style={{
                    background: colors.bg,
                    transform: 'rotateX(55deg) rotateZ(-25deg) translateZ(0px)',
                    transformStyle: 'preserve-3d',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)',
                }}
            >
                {/* Card content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    {/* Logo */}
                    <div className="w-16 h-16">
                        <LogoComposition brand={brand} className="w-full h-full" />
                    </div>

                    {/* Contact info */}
                    <div>
                        <p
                            className="text-sm font-semibold"
                            style={{ color: colors.text, fontFamily }}
                        >
                            {brand.name}
                        </p>
                        <p
                            className="text-xs opacity-60"
                            style={{ color: colors.text }}
                        >
                            hello@{brand.name.toLowerCase().replace(/\s+/g, '')}.com
                        </p>
                    </div>
                </div>

                {/* Glossy overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)',
                    }}
                />
            </div>
        </div>
    );
}

/**
 * LinkedIn Banner Mockup
 */
function LinkedInBannerMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';
    const tagline = brand.strategy?.tagline || `Empowering ${brand.vibe} experiences`;

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Banner frame with shadow */}
            <div
                className="relative w-full max-w-[600px] rounded-lg overflow-hidden"
                style={{
                    aspectRatio: '1584/396',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                }}
            >
                {/* Background */}
                <div
                    className="absolute inset-0"
                    style={{ background: colors.primary }}
                />

                {/* Pattern overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.bg} 1px, transparent 1px)`,
                        backgroundSize: '24px 24px',
                    }}
                />

                {/* Content */}
                <div className="absolute inset-0 flex items-center justify-between px-8">
                    {/* Logo */}
                    <div className="w-20 h-20 flex-shrink-0" style={{ filter: 'brightness(0) invert(1)' }}>
                        <LogoComposition brand={brand} className="w-full h-full" />
                    </div>

                    {/* Tagline */}
                    <div className="flex-1 ml-8">
                        <p
                            className="text-xl font-bold"
                            style={{ color: colors.bg, fontFamily }}
                        >
                            {tagline}
                        </p>
                    </div>
                </div>

                {/* Gradient overlay */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    }}
                />
            </div>
        </div>
    );
}

/**
 * Website Header Mockup (Browser Frame)
 */
function WebsiteHeaderMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Browser window */}
            <div
                className="relative w-full max-w-[600px] rounded-xl overflow-hidden"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(0,0,0,0.1)',
                }}
            >
                {/* Browser chrome */}
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex items-center gap-3 border-b border-gray-200 dark:border-gray-700">
                    {/* Traffic lights */}
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>

                    {/* URL bar */}
                    <div className="flex-1 bg-white dark:bg-gray-900 rounded-md px-3 py-1.5 text-xs text-gray-500 flex items-center gap-2">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        {brand.name.toLowerCase().replace(/\s+/g, '')}.com
                    </div>
                </div>

                {/* Website content */}
                <div className="bg-white dark:bg-gray-900" style={{ background: colors.bg }}>
                    {/* Navigation */}
                    <nav className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8">
                                <LogoComposition brand={brand} className="w-full h-full" />
                            </div>
                            <span className="font-semibold" style={{ color: colors.text, fontFamily }}>
                                {brand.name}
                            </span>
                        </div>

                        {/* Nav links */}
                        <div className="flex items-center gap-6 text-sm" style={{ color: colors.muted }}>
                            <span>Products</span>
                            <span>About</span>
                            <span>Pricing</span>
                            <button
                                className="px-4 py-1.5 rounded-md text-white text-sm"
                                style={{ background: colors.primary }}
                            >
                                Get Started
                            </button>
                        </div>
                    </nav>

                    {/* Hero section */}
                    <div className="px-6 py-12 text-center">
                        <h1
                            className="text-3xl font-bold mb-3"
                            style={{ color: colors.text, fontFamily }}
                        >
                            Welcome to {brand.name}
                        </h1>
                        <p className="text-sm mb-6" style={{ color: colors.muted }}>
                            {brand.strategy?.tagline || 'Building the future, one step at a time'}
                        </p>
                        <button
                            className="px-6 py-2.5 rounded-lg text-white font-medium"
                            style={{ background: colors.primary }}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Mobile App Mockup (iPhone with splash screen)
 */
function MobileAppMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* iPhone frame */}
            <div
                className="relative w-[200px] h-[400px] rounded-[2.5rem] overflow-hidden"
                style={{
                    background: '#1a1a1a',
                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), inset 0 0 0 3px #333',
                    transform: 'rotateY(-8deg) rotateX(5deg)',
                    transformStyle: 'preserve-3d',
                    perspective: '1000px',
                }}
            >
                {/* Screen bezel */}
                <div className="absolute inset-[3px] rounded-[2.3rem] overflow-hidden bg-black">
                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />

                    {/* Splash screen */}
                    <div
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        style={{ background: colors.primary }}
                    >
                        {/* Logo */}
                        <div className="w-20 h-20 mb-4" style={{ filter: 'brightness(0) invert(1)' }}>
                            <LogoComposition brand={brand} className="w-full h-full" />
                        </div>

                        {/* Brand name */}
                        <p className="text-white text-lg font-semibold" style={{ fontFamily: brand.font.headingName }}>
                            {brand.name}
                        </p>
                    </div>

                    {/* Home indicator */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full" />
                </div>

                {/* Side button */}
                <div className="absolute right-[-2px] top-24 w-1 h-12 bg-gray-700 rounded-l" />

                {/* Volume buttons */}
                <div className="absolute left-[-2px] top-20 w-1 h-8 bg-gray-700 rounded-r" />
                <div className="absolute left-[-2px] top-32 w-1 h-8 bg-gray-700 rounded-r" />
            </div>
        </div>
    );
}

/**
 * Poster/Signage Mockup
 */
function PosterMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Poster frame with 3D effect */}
            <div
                className="relative"
                style={{
                    perspective: '1000px',
                }}
            >
                {/* Shadow */}
                <div
                    className="absolute inset-0 bg-black/30 blur-2xl"
                    style={{
                        transform: 'translateY(20px) scale(0.95)',
                    }}
                />

                {/* Poster */}
                <div
                    className="relative w-[280px] h-[400px] rounded-lg overflow-hidden"
                    style={{
                        background: colors.bg,
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.4)',
                        transform: 'rotateY(-5deg)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Background pattern */}
                    <div
                        className="absolute inset-0 opacity-5"
                        style={{
                            backgroundImage: `radial-gradient(circle at 2px 2px, ${colors.text} 1px, transparent 1px)`,
                            backgroundSize: '20px 20px',
                        }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                        {/* Logo */}
                        <div className="w-24 h-24 mb-6">
                            <LogoComposition brand={brand} className="w-full h-full" />
                        </div>

                        {/* Brand name */}
                        <h2
                            className="text-2xl font-bold mb-2 text-center"
                            style={{ color: colors.text, fontFamily }}
                        >
                            {brand.name}
                        </h2>

                        {/* Tagline */}
                        <p
                            className="text-sm text-center opacity-60"
                            style={{ color: colors.text }}
                        >
                            {brand.strategy?.tagline || brand.vibe}
                        </p>
                    </div>

                    {/* Website at bottom */}
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        <p className="text-xs opacity-40" style={{ color: colors.text }}>
                            {brand.name.toLowerCase().replace(/\s+/g, '')}.com
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * Letterhead Mockup
 */
function LetterheadMockup({ brand }: { brand: BrandIdentity }) {
    const colors = brand.theme.tokens.light;
    const fontFamily = brand.font.headingName || 'system-ui';

    return (
        <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* A4 Document with shadow */}
            <div
                className="relative"
                style={{
                    perspective: '1000px',
                }}
            >
                {/* Shadow */}
                <div
                    className="absolute inset-0 bg-black/20 blur-xl"
                    style={{
                        transform: 'translateY(15px) scale(0.98)',
                    }}
                />

                {/* Document */}
                <div
                    className="relative w-[280px] h-[360px] bg-white rounded-sm overflow-hidden"
                    style={{
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                        transform: 'rotateY(3deg) rotateX(2deg)',
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {/* Header bar */}
                    <div
                        className="h-2"
                        style={{ background: colors.primary }}
                    />

                    {/* Header with logo */}
                    <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: colors.border }}>
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8">
                                <LogoComposition brand={brand} className="w-full h-full" />
                            </div>
                            <span className="text-sm font-semibold" style={{ color: colors.text, fontFamily }}>
                                {brand.name}
                            </span>
                        </div>

                        {/* Contact */}
                        <div className="text-right text-[8px]" style={{ color: colors.muted }}>
                            <p>{brand.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                            <p>hello@{brand.name.toLowerCase().replace(/\s+/g, '')}.com</p>
                        </div>
                    </div>

                    {/* Document content (placeholder lines) */}
                    <div className="px-6 py-6 space-y-3">
                        <div className="h-2 bg-gray-200 rounded w-1/4" />
                        <div className="h-2 bg-gray-100 rounded w-full" />
                        <div className="h-2 bg-gray-100 rounded w-full" />
                        <div className="h-2 bg-gray-100 rounded w-3/4" />
                        <div className="h-4" />
                        <div className="h-2 bg-gray-100 rounded w-full" />
                        <div className="h-2 bg-gray-100 rounded w-full" />
                        <div className="h-2 bg-gray-100 rounded w-5/6" />
                        <div className="h-4" />
                        <div className="h-2 bg-gray-100 rounded w-full" />
                        <div className="h-2 bg-gray-100 rounded w-2/3" />
                    </div>

                    {/* Footer */}
                    <div className="absolute bottom-0 left-0 right-0 px-6 py-3 border-t" style={{ borderColor: colors.border }}>
                        <p className="text-[7px] text-center" style={{ color: colors.muted }}>
                            123 Brand Street, City, State 12345
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

/**
 * BrandMockups - Unified mockup display with carousel/grid
 */
export function BrandMockups({
    brand,
    className = '',
    showCarousel = true,
    defaultMockup = 'business-card',
    onMockupChange,
}: BrandMockupsProps) {
    const [selectedMockup, setSelectedMockup] = useState<MockupType>(defaultMockup);

    const handleMockupSelect = (mockup: MockupType) => {
        setSelectedMockup(mockup);
        onMockupChange?.(mockup);
    };

    const renderMockup = (type: MockupType) => {
        switch (type) {
            case 'business-card':
                return <BusinessCard3DMockup brand={brand} />;
            case 'linkedin-banner':
                return <LinkedInBannerMockup brand={brand} />;
            case 'website-header':
                return <WebsiteHeaderMockup brand={brand} />;
            case 'mobile-app':
                return <MobileAppMockup brand={brand} />;
            case 'poster':
                return <PosterMockup brand={brand} />;
            case 'letterhead':
                return <LetterheadMockup brand={brand} />;
            default:
                return <BusinessCard3DMockup brand={brand} />;
        }
    };

    // Grid view showing all mockups
    if (!showCarousel) {
        return (
            <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
                {MOCKUP_TYPES.map((type) => {
                    const info = MOCKUP_INFO[type];
                    const isSelected = selectedMockup === type;

                    return (
                        <motion.button
                            key={type}
                            onClick={() => handleMockupSelect(type)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                                relative rounded-xl border-2 transition-all cursor-pointer overflow-hidden
                                ${isSelected
                                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                }
                            `}
                        >
                            {/* Mockup preview */}
                            <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                <div className="w-full h-full transform scale-50 origin-center">
                                    {renderMockup(type)}
                                </div>
                            </div>

                            {/* Label */}
                            <div className="p-2 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                                <span className="text-xs font-medium text-gray-900 dark:text-gray-100">
                                    {info.icon} {info.name}
                                </span>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        );
    }

    // Carousel view with toggle
    return (
        <div className={`flex flex-col ${className}`}>
            {/* Mockup selector */}
            <div className="flex flex-wrap gap-2 mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                {MOCKUP_TYPES.map((type) => {
                    const info = MOCKUP_INFO[type];
                    const isSelected = selectedMockup === type;

                    return (
                        <button
                            key={type}
                            onClick={() => handleMockupSelect(type)}
                            className={`
                                px-3 py-1.5 rounded-md text-sm font-medium transition-all
                                flex items-center gap-1.5
                                ${isSelected
                                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }
                            `}
                        >
                            <span>{info.icon}</span>
                            <span className="hidden sm:inline">{info.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Mockup display */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedMockup}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="aspect-[16/10] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden"
                >
                    {renderMockup(selectedMockup)}
                </motion.div>
            </AnimatePresence>

            {/* Description */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-center"
            >
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {MOCKUP_INFO[selectedMockup].description}
                </p>
            </motion.div>
        </div>
    );
}

// ============================================
// EXPORTS
// ============================================

export {
    BusinessCard3DMockup,
    LinkedInBannerMockup,
    WebsiteHeaderMockup,
    MobileAppMockup,
    PosterMockup,
    LetterheadMockup,
};

export default BrandMockups;
