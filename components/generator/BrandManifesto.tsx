"use client";

import React, { useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BrandIdentity } from '@/lib/data';
import { cn, generateDeepColor } from '@/lib/utils';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { BrandMockups } from '@/components/preview/BrandMockups';
import { Mockup3DCard } from '@/components/preview/Mockup3DCard';
import { BrandGraphicsSystem } from '@/components/preview/BrandGraphicsSystem';
import { SocialMediaKit } from '@/components/preview/SocialMediaKit';
import { TypographyTeaser } from '@/components/preview/TypographySpecimen';
import { AppIconMacro } from '@/components/preview/AppIconMacro';
import { BrandVisionMacro } from '@/components/preview/BrandVisionMacro';
import { ProceduralPosterGrid } from '@/components/preview/ProceduralPoster';
import { WebFaviconMacro } from '@/components/preview/WebFaviconMacro';


// ============================================

// ============================================
// SECTION 1: SUPER-GRAPHIC HERO
// ============================================

function SuperGraphicHero({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 400], [1, 0]);
    const scale = useTransform(scrollY, [0, 400], [1, 1.1]);

    return (
        <motion.section
            className="relative h-[90vh] min-h-[600px] w-full overflow-hidden flex items-center justify-center"
            style={{
                background: `linear-gradient(145deg, ${colors.deep} 0%, ${colors.deeper} 50%, ${primary}15 100%)`
            }}
        >
            {/* Mesh Gradient Overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(ellipse 80% 50% at 20% 40%, ${primary}30 0%, transparent 50%),
                        radial-gradient(ellipse 60% 60% at 80% 20%, ${colors.accent}20 0%, transparent 40%),
                        radial-gradient(ellipse 50% 80% at 50% 90%, ${primary}25 0%, transparent 45%)
                    `
                }}
            />

            {/* Subtle Noise Texture */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")'
                }}
            />

            {/* THE WATERMARK - Massive Background Logo */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                style={{ opacity, scale }}
            >
                <div
                    className="w-[120%] h-[120%] flex items-center justify-center"
                    style={{
                        transform: 'rotate(-15deg)',
                        opacity: 0.08,
                        mixBlendMode: 'overlay'
                    }}
                >
                    <div className="w-full h-full max-w-[1200px] max-h-[1200px]">
                        <LogoComposition
                            brand={brand}
                            overrideColors={{ primary: '#FFFFFF' }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* THE HEADLINE Content */}
            <motion.div
                className="relative z-10 text-center px-8 max-w-5xl mx-auto"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {/* Small Logo Above */}
                <motion.div
                    className="w-20 h-20 mx-auto mb-8"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', duration: 0.8, delay: 0.4 }}
                >
                    <LogoComposition
                        brand={brand}
                        overrideColors={{ primary: '#FFFFFF' }}
                        className="drop-shadow-2xl"
                    />
                </motion.div>

                {/* Brand Name - MASSIVE */}
                <h1
                    className={cn(
                        "text-7xl sm:text-8xl md:text-9xl font-bold tracking-tighter text-white mb-6 leading-[0.9]",
                        brand.font.heading
                    )}
                    style={{
                        textShadow: '0 4px 60px rgba(0,0,0,0.3)'
                    }}
                >
                    {brand.name}
                </h1>

                {/* Mission Statement */}
                <p className="text-lg sm:text-xl font-light text-white/80 max-w-2xl mx-auto leading-relaxed tracking-wide">
                    {brand.strategy?.tagline || `The ${brand.vibe} brand experience, designed for modern creators.`}
                </p>
            </motion.div>
        </motion.section>
    );
}


// ============================================
// SECTION 3: BRAND NARRATIVE GRID (Magazine Style)
// ============================================

// Dynamic quotes that change per generation
const VISION_QUOTES = [
    { headline: "Where ideas take", accent: "flight" },
    { headline: "Where innovation meets", accent: "design" },
    { headline: "Where vision becomes", accent: "reality" },
    { headline: "Where bold meets", accent: "beautiful" },
    { headline: "Where future starts", accent: "now" },
    { headline: "Where dreams find", accent: "form" },
    { headline: "Where craft meets", accent: "purpose" },
    { headline: "Where simplicity drives", accent: "impact" },
];

// ============================================
// GENERATIVE TRIPTYCH SYSTEM
// ============================================

const TRIPTYCH_THEMES = [
    { id: 'speed', headline: "Faster than thought.", sub: "Accelerate your workflow.", metricLabel: "Efficiency Boost", metricValue: "10x" },
    { id: 'growth', headline: "Built for scale.", sub: "Global infrastructure.", metricLabel: "Uptime Guaranteed", metricValue: "99.9%" },
    { id: 'future', headline: "Define the future.", sub: "Next-gen aesthetics.", metricLabel: "Market Leader", metricValue: "#1" },
    { id: 'impact', headline: "Maximum Launch.", sub: "Deploy instant brands.", metricLabel: "Setup Time", metricValue: "< 2m" },
    { id: 'precision', headline: "Pixel Perfect.", sub: "Engineered design.", metricLabel: "Brand Consistency", metricValue: "100%" },
];

function GenerativeTriptych({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    // Deterministic Random (seeded by brand ID for consistency, but unique per generation)
    const seed = brand.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const rng = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
    };

    // 1. Pick Theme
    const themeIndex = Math.floor(rng(1) * TRIPTYCH_THEMES.length);
    const theme = TRIPTYCH_THEMES[themeIndex];

    // 2. Pick Layout Permutation (Text, Visual, Metric)
    const layoutPermutations = [
        ['text', 'visual', 'metric'],
        ['visual', 'text', 'metric'],
        ['metric', 'visual', 'text'],
        ['text', 'metric', 'visual'],
        ['visual', 'metric', 'text'],
    ];
    const layoutIndex = Math.floor(rng(2) * layoutPermutations.length);
    const layout = layoutPermutations[layoutIndex];

    // 3. Pick Styles for each slot (0: Primary, 1: White, 2: Dark, 3: Gradient)
    const getSlotStyle = (index: number) => {
        const r = rng(10 + index);
        if (r < 0.25) return 'primary';
        if (r < 0.5) return 'white';
        if (r < 0.75) return 'dark';
        return 'gradient';
    };

    // Render Helpers
    const renderSlot = (type: string, index: number) => {
        const styleVariant = getSlotStyle(index);

        // Base classes
        let bgClass = "bg-white";
        let textClass = "text-stone-900";
        let subTextClass = "text-stone-500";

        // Style Application
        const styleProps: any = {};
        if (styleVariant === 'primary') {
            styleProps.backgroundColor = primary;
            textClass = "text-white";
            subTextClass = "text-white/70";
        } else if (styleVariant === 'dark') {
            styleProps.backgroundColor = colors.deeper;
            textClass = "text-white";
            subTextClass = "text-white/60";
        } else if (styleVariant === 'gradient') {
            styleProps.background = `linear-gradient(135deg, ${colors.deep} 0%, ${primary} 100%)`;
            textClass = "text-white";
            subTextClass = "text-white/80";
        }

        // Common wrapper
        const wrapperClass = "relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[300px] md:min-h-[400px]";

        if (type === 'text') {
            return (
                <motion.div
                    key={`slot-${index}`}
                    className={wrapperClass}
                    style={styleProps}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    <p className={`text-xs font-mono uppercase tracking-widest mb-4 ${subTextClass}`}>
                        The Advantage
                    </p>
                    <h3 className={cn("text-3xl md:text-5xl font-bold leading-tight tracking-tight text-center", brand.font.heading, textClass)}>
                        {theme.headline.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </h3>
                    <div className="mt-6 w-12 h-1 bg-current opacity-30 rounded-full" />
                </motion.div>
            );
        }

        if (type === 'visual') {
            const visualType = rng(20 + index) > 0.5 ? 'pattern' : 'logo';
            return (
                <motion.div
                    key={`slot-${index}`}
                    className={wrapperClass}
                    style={styleProps}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        {renderGenerativePattern(rng(30 + index), styleVariant === 'white' ? primary : '#FFFFFF')}
                    </div>

                    {visualType === 'logo' && (
                        <div className="w-32 h-32 md:w-40 md:h-40 relative z-10 drop-shadow-2xl">
                            <LogoComposition brand={brand} overrideColors={styleVariant !== 'white' ? { primary: '#FFFFFF' } : undefined} />
                        </div>
                    )}

                    {visualType === 'pattern' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <h1 className="text-[200px] font-black opacity-10 leading-none select-none overflow-hidden" style={{ color: styleVariant === 'white' ? primary : 'white' }}>
                                {brand.name.charAt(0)}
                            </h1>
                        </div>
                    )}

                    <div className="absolute bottom-6 right-6">
                        <div className="w-8 h-8 rounded-full border border-current opacity-30 flex items-center justify-center">
                            <div className="w-2 h-2 bg-current rounded-full" />
                        </div>
                    </div>
                </motion.div>
            );
        }

        if (type === 'metric') {
            return (
                <motion.div
                    key={`slot-${index}`}
                    className={wrapperClass}
                    style={styleProps}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 p-4 opacity-20">
                        <svg width="60" height="60" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="28" stroke="currentColor" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                        </svg>
                    </div>

                    <div className="text-center relative z-10">
                        <motion.p
                            className={cn("text-7xl md:text-9xl font-black tracking-tighter leading-none", textClass)}
                            initial={{ scale: 0.8, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", bounce: 0.4 }}
                        >
                            {theme.metricValue}
                        </motion.p>
                        <p className={`mt-4 text-lg font-medium ${textClass}`}>
                            {theme.metricLabel}
                        </p>
                        <p className={`text-sm ${subTextClass}`}>
                            vs. traditional methods
                        </p>
                    </div>
                </motion.div>
            );
        }
    };

    // Helper: Simple SVG Patterns
    const renderGenerativePattern = (r: number, color: string) => {
        if (r < 0.33) {
            // Arrows
            return (
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id={`pat-${seed}`} patternUnits="userSpaceOnUse" width="20" height="20">
                        <path d="M10 0 L20 10 L10 20 L10 15 L0 15 L0 5 L10 5 Z" fill={color} />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#pat-${seed})`} />
                </svg>
            );
        } else if (r < 0.66) {
            // Grid
            return (
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id={`pat-${seed}`} patternUnits="userSpaceOnUse" width="40" height="40">
                        <rect x="0" y="0" width="38" height="38" fill="none" stroke={color} strokeWidth="1" />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#pat-${seed})`} />
                </svg>
            );
        } else {
            // Circles
            return (
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id={`pat-${seed}`} patternUnits="userSpaceOnUse" width="30" height="30">
                        <circle cx="15" cy="15" r="5" fill={color} />
                    </pattern>
                    <rect width="100%" height="100%" fill={`url(#pat-${seed})`} />
                </svg>
            );
        }
    };

    return (
        <section className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 min-h-[400px]">
                {layout.map((type, i) => renderSlot(type, i))}
            </div>
        </section>
    );
}

function BrandNarrativeGrid({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    // Pick a quote based on brand name hash for consistency per brand
    const quoteIndex = brand.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % VISION_QUOTES.length;
    const selectedQuote = VISION_QUOTES[quoteIndex];

    return (
        <div className="w-full flex flex-col gap-0">

            {/* ============================================ */}
            {/* CARD A: BRAND VISION MACRO (New Quote Engine + Identity Card) */}
            {/* ============================================ */}
            <BrandVisionMacro brand={brand} />

            {/* ============================================ */}
            {/* CARD B: THE "VALUE PROP" BENTO */}
            {/* ============================================ */}
            {/* ============================================ */}
            {/* CARD B: PROCEDURAL POSTER GRID (Infinite Variety) */}
            {/* ============================================ */}
            <section className="w-full py-12 px-6 md:px-12 bg-stone-950">
                <div className="max-w-7xl mx-auto">
                    <ProceduralPosterGrid brand={brand} />
                </div>
            </section>

            {/* ============================================ */}
            {/* CARD C: THE "PRODUCT MOMENT" (App Icon Macro) */}
            {/* ============================================ */}
            <AppIconMacro brand={brand} />

            {/* ============================================ */}
            {/* CARD D: WEB IDENTITY (Favicon) */}
            {/* ============================================ */}
            <WebFaviconMacro brand={brand} />

        </div >
    );
}



// ============================================
// SECTION 5: IMMERSIVE MASONRY GRID
// ============================================



// ============================================
// SECTION 5: MOCKUPS GALLERY
// ============================================

function MockupsGallery({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);
    const [selectedCategory, setSelectedCategory] = React.useState<'essentials' | 'digital' | 'social' | 'outdoor' | 'merch'>('essentials');

    const MOCKUP_CATEGORIES = {
        essentials: 'Essentials',
        digital: 'Digital',
        social: 'Social',
        outdoor: 'Outdoor',
        merch: 'Merch',
    };

    return (
        <section className="w-full relative bg-stone-950 overflow-hidden py-12">
            {/* Brand Mesh Gradient Background */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${colors.deeper} 0%, #0c0a09 80%)`
                }}
            />

            {/* Mesh Overlay */}
            <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    background: `
                        radial-gradient(circle at 20% 50%, ${primary}30 0%, transparent 50%),
                        radial-gradient(circle at 80% 50%, ${colors.accent}20 0%, transparent 50%)
                    `
                }}
            />

            {/* External Category Tabs */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 z-30 flex gap-3 pt-2">
                {(Object.entries(MOCKUP_CATEGORIES) as [typeof selectedCategory, string][]).map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative ${selectedCategory === key
                            ? 'text-white shadow-lg scale-105'
                            : 'text-zinc-400 hover:text-white bg-black/30 hover:bg-black/40 backdrop-blur-sm'
                            }`}
                        style={selectedCategory === key ? {
                            background: `linear-gradient(135deg, ${primary}, ${primary}dd)`,
                            boxShadow: `0 4px 20px ${primary}40`
                        } : {}}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="w-full relative z-10">
                <BrandMockups
                    brand={brand}
                    showCarousel={true}
                    showTabsInside={false}
                    externalCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    className="w-full !max-w-none !bg-transparent !shadow-none !p-0 !rounded-none border-none"
                />
            </div>
        </section>
    );
}

// ============================================
// SECTION 6: SOCIAL MEDIA ASSETS
// ============================================





// ============================================
// SECTION 6: BRAND GRAPHICS SYSTEM
// ============================================

function BrandSystemSection({ brand }: { brand: BrandIdentity }) {
    return (
        <section className="w-full py-24 bg-stone-950">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <motion.div
                    className="mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-xs font-mono text-orange-500 uppercase tracking-widest mb-2">
                        Graphics System
                    </p>
                    <h2 className="text-4xl font-bold text-white tracking-tight">
                        Extend the identity
                    </h2>
                </motion.div>

                <BrandGraphicsSystem brand={brand} />
            </div>
        </section>
    );
}

// ============================================
// SECTION 7: TYPOGRAPHY POSTER (Teaser)
// ============================================

function TypographyPoster({ brand, onNavigateToGuidelines }: { brand: BrandIdentity; onNavigateToGuidelines?: () => void }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    return (
        <section className="w-full py-20 bg-stone-950">
            <div className="max-w-6xl mx-auto px-6 md:px-12">
                <motion.div
                    className="mb-10"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: primary }}>
                        Typography
                    </p>
                    <h2 className={cn("text-4xl font-bold text-white tracking-tight", brand.font.heading)}>
                        The Typeface
                    </h2>
                    <p className="text-stone-400 mt-2 max-w-lg">
                        A carefully selected font pairing that defines the voice of your brand.
                    </p>
                </motion.div>

                {/* Typography Teaser Card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                >
                    <TypographyTeaser
                        brand={brand}
                        onClick={onNavigateToGuidelines}
                    />
                </motion.div>
            </div>
        </section>
    );
}

// ============================================
// MAIN COMPONENT: BRAND MANIFESTO
// ============================================

interface BrandManifestoProps {
    brand: BrandIdentity;
    onViewModeChange?: (mode: 'overview' | 'presentation') => void;
    onUpdateBrand?: (updates: Partial<BrandIdentity>) => void;
}

export function BrandManifesto({ brand, onViewModeChange, onUpdateBrand }: BrandManifestoProps) {
    const primary = brand.theme.tokens.light.primary;
    const colors = useMemo(() => generateDeepColor(primary), [primary]);

    return (
        <div
            className="w-full min-h-screen"
            style={{
                // CSS Variable for global theming
                '--brand-primary': primary,
                '--brand-deep': colors.deep,
                '--brand-deeper': colors.deeper,
                '--brand-accent': colors.accent,
            } as React.CSSProperties}
        >
            {/* Section 1: Super-Graphic Hero */}
            <SuperGraphicHero brand={brand} />

            {/* Section 2: Brand Narrative Grid (Story) */}
            <BrandNarrativeGrid brand={brand} />

            {/* Section 3: 3D Interaction (Dark Mode) (Visual Second) */}
            <MockupsGallery brand={brand} />

            {/* Transition: Dark Continued */}
            <div className="w-full h-12 bg-stone-950" />

            {/* Section 4: Brand Graphics System (Asset Grid) */}
            <BrandSystemSection brand={brand} />

            {/* Section 5: Typography Poster (Teaser) */}
            <TypographyPoster
                brand={brand}
                onNavigateToGuidelines={() => onViewModeChange?.('presentation')}
            />

            {/* CTA: View Full Guidelines */}
            <section
                className="py-20"
                style={{
                    background: `linear-gradient(180deg, ${colors.deeper} 0%, ${colors.deep} 100%)`
                }}
            >
                <div className="max-w-4xl mx-auto text-center px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="w-16 h-16 mx-auto mb-6">
                            <LogoComposition brand={brand} />
                        </div>
                        <h2 className={cn("text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white", brand.font.heading)}>
                            Ready to launch
                        </h2>
                        <p className="text-stone-300 text-lg mb-8 max-w-lg mx-auto">
                            Your complete brand identity system is ready. View the full guidelines or export your assets.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onViewModeChange?.('presentation')}
                                className="px-8 py-4 text-white font-semibold rounded-full text-lg transition-all hover:scale-105 shadow-xl"
                                style={{ backgroundColor: primary }}
                            >
                                View Brand Manual
                            </button>
                            <button
                                className="px-8 py-4 bg-stone-900 text-white font-semibold rounded-full text-lg hover:bg-stone-800 transition-all"
                            >
                                Export Assets
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

export default BrandManifesto;
