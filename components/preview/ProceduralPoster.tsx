"use client";

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';

// ============================================
// TYPES
// ============================================

export type LayoutMode = 'giant' | 'split' | 'typographer' | 'technical';

export interface ProceduralPosterProps {
    brand: BrandIdentity;
    /** Force a specific layout mode (otherwise random) */
    forceMode?: LayoutMode;
    /** Card index for deterministic randomness */
    cardIndex?: number;
    /** Custom headline text */
    headline?: string;
    /** Custom body text */
    bodyText?: string;
    className?: string;
}

// ============================================
// CONTENT POOL (Randomly selected per card)
// ============================================

const HEADLINES = {
    default: [
        "Why {brand}",
        "Built for you",
        "Our Vision",
        "Community",
        "The Mission",
        "Introducing",
        "Start Here",
        "What we do",
    ],
    crypto: [
        "Stealth Mode",
        "Go Private",
        "Zero Trace",
        "Decentralized",
        "Move Fast",
        "Trust Code",
    ],
    ai: [
        "AI-Native",
        "Think Deeper",
        "Next Gen",
        "Intelligence",
        "Automate",
        "Learn More",
    ],
    fashion: [
        "Collection",
        "New Season",
        "The Drop",
        "Curated",
        "Timeless",
        "Redefine",
    ],
    saas: [
        "Ship Faster",
        "Scale Now",
        "Efficiency",
        "All-in-One",
        "Your Stack",
        "Built Right",
    ],
};

const TAGLINES = {
    default: [
        "Endless possibilities",
        "Built for the future",
        "Where innovation meets design",
        "Designed for you",
        "The next evolution",
    ],
    crypto: [
        "Move billions. Leave no trace.",
        "The quietest place in DeFi.",
        "Privacy by default.",
        "Your keys, your rules.",
        "Trustless and verified.",
    ],
    ai: [
        "Intelligence amplified.",
        "Beyond automation.",
        "Think, then act.",
        "Your AI-powered edge.",
        "Smarter by design.",
    ],
    fashion: [
        "Wear your statement.",
        "Designed to stand out.",
        "For the bold.",
        "Uncompromising style.",
        "Craft meets vision.",
    ],
    saas: [
        "Your entire workflow, simplified.",
        "Scale without limits.",
        "Built for teams that ship.",
        "One platform, infinite power.",
        "Efficiency redefined.",
    ],
};

const BODY_TEXT = {
    default: [
        "Keep your strategies hidden while still trading fully onchain and verifiable.",
        "Built for creators who demand more from their tools.",
        "We're redefining what's possible in this space.",
        "Join thousands of users who trust us daily.",
    ],
    crypto: [
        "Trade privately without compromising on-chain verification.",
        "Built for traders who are tired of bots eating their profits.",
        "MEV-protected. Front-running resistant. Battle-tested.",
        "Your trades, your business. No one else's.",
    ],
    ai: [
        "Powered by the latest in machine learning and NLP.",
        "Automate the mundane. Focus on what matters.",
        "From idea to execution in milliseconds.",
        "AI that understands context, not just keywords.",
    ],
    fashion: [
        "Designed in Milan. Crafted for the world.",
        "Every piece tells a story of intentional design.",
        "Sustainable materials. Timeless aesthetics.",
        "For those who lead, not follow.",
    ],
    saas: [
        "One platform to replace your entire stack.",
        "Designed for teams that ship fast and iterate faster.",
        "From startup to enterprise. Scale with confidence.",
        "Real-time collaboration, anywhere.",
    ],
};

// ============================================
// HELPER: Seeded Random Number Generator
// ============================================

function seededRandom(seed: number): () => number {
    let s = seed;
    return () => {
        s = (s * 1103515245 + 12345) & 0x7fffffff;
        return s / 0x7fffffff;
    };
}

function getCategoryKey(category?: string): keyof typeof HEADLINES {
    if (!category) return 'default';
    const lower = category.toLowerCase();
    if (lower.includes('crypto') || lower.includes('defi') || lower.includes('web3') || lower.includes('blockchain')) return 'crypto';
    if (lower.includes('ai') || lower.includes('artificial') || lower.includes('machine') || lower.includes('ml')) return 'ai';
    if (lower.includes('fashion') || lower.includes('apparel') || lower.includes('clothing') || lower.includes('luxury')) return 'fashion';
    if (lower.includes('saas') || lower.includes('software') || lower.includes('startup') || lower.includes('tech')) return 'saas';
    return 'default';
}

function selectLayoutMode(category: string | undefined, rng: () => number): LayoutMode {
    const catKey = getCategoryKey(category);
    const roll = rng();

    // Intelligent routing based on category
    switch (catKey) {
        case 'crypto':
            // Bias towards GIANT (50%) and TECHNICAL (30%)
            if (roll < 0.5) return 'giant';
            if (roll < 0.8) return 'technical';
            if (roll < 0.9) return 'typographer';
            return 'split';

        case 'ai':
            // Bias towards TECHNICAL (50%) and TYPOGRAPHER (30%)
            if (roll < 0.5) return 'technical';
            if (roll < 0.8) return 'typographer';
            if (roll < 0.9) return 'giant';
            return 'split';

        case 'fashion':
            // Bias towards SPLIT (50%) and GIANT (30%)
            if (roll < 0.5) return 'split';
            if (roll < 0.8) return 'giant';
            if (roll < 0.9) return 'typographer';
            return 'technical';

        case 'saas':
            // Balanced with slight TECHNICAL bias
            if (roll < 0.35) return 'technical';
            if (roll < 0.6) return 'giant';
            if (roll < 0.85) return 'split';
            return 'typographer';

        default:
            // Fully random
            if (roll < 0.25) return 'giant';
            if (roll < 0.5) return 'split';
            if (roll < 0.75) return 'typographer';
            return 'technical';
    }
}

// ============================================
// MODE A: THE GIANT
// ============================================

function ModeGiant({
    brand,
    headline,
    tagline,
    bodyText,
    rng
}: {
    brand: BrandIdentity;
    headline: string;
    tagline: string;
    bodyText: string;
    rng: () => number;
}) {
    const primary = brand.theme.tokens.light.primary;

    return (
        <div className="relative w-full h-full bg-zinc-950 overflow-hidden rounded-2xl flex flex-col">
            {/* Giant Logo Background - More Visible */}
            <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: 'scale(2.2) translateY(-5%)' }}
            >
                <div className="w-full h-full opacity-20">
                    <LogoComposition
                        brand={brand}
                        overrideColors={{ primary: primary }}
                    />
                </div>
            </div>

            {/* Tagline Top */}
            <div className="relative z-10 p-6 pt-8">
                <p className="text-xs text-zinc-500 text-center tracking-wide">{tagline}</p>
            </div>

            {/* Small Logo Badge - Always Visible */}
            <div className="absolute top-6 left-6 z-20">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                    <div className="w-7 h-7">
                        <LogoComposition brand={brand} />
                    </div>
                </div>
            </div>

            {/* Content Bottom */}
            <div className="relative z-10 mt-auto p-6 pb-8">
                {/* Category Badge */}
                <div
                    className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider mb-3"
                    style={{ backgroundColor: primary, color: '#000' }}
                >
                    {brand.category || 'Brand'}
                </div>

                {/* Headline */}
                <h3 className={cn(
                    "text-3xl font-bold text-white tracking-tight leading-tight mb-3",
                    brand.font.heading
                )}>
                    {headline.replace('{brand}', brand.name)}
                </h3>

                {/* Body Text */}
                <p className="text-sm text-zinc-400 leading-relaxed mb-4 max-w-[90%]">
                    {bodyText}
                </p>

                {/* Progress Bar Decoration */}
                <div className="flex items-center gap-1">
                    <div
                        className="h-1 rounded-full"
                        style={{ width: `${40 + rng() * 40}%`, backgroundColor: primary }}
                    />
                    <div className="h-1 flex-1 rounded-full bg-zinc-800" />
                </div>
            </div>
        </div>
    );
}

// ============================================
// MODE B: THE SPLIT
// ============================================

function ModeSplit({
    brand,
    headline,
    tagline,
    bodyText,
    rng
}: {
    brand: BrandIdentity;
    headline: string;
    tagline: string;
    bodyText: string;
    rng: () => number;
}) {
    const primary = brand.theme.tokens.light.primary;

    // Abstract architecture images (no external fetching - CSS patterns)
    const patternVariant = Math.floor(rng() * 3);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-2xl flex flex-col">
            {/* Top Section: Abstract Pattern (60%) */}
            <div
                className="relative flex-[6] overflow-hidden"
                style={{
                    background: patternVariant === 0
                        ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
                        : patternVariant === 1
                            ? 'linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%)'
                            : `linear-gradient(45deg, ${primary}20 0%, #0a0a0a 100%)`,
                }}
            >
                {/* Geometric Pattern Overlay */}
                <div className="absolute inset-0 opacity-30">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
                        {patternVariant === 0 && (
                            <>
                                <line x1="0" y1="0" x2="100" y2="100" stroke="white" strokeWidth="0.5" />
                                <line x1="100" y1="0" x2="0" y2="100" stroke="white" strokeWidth="0.5" />
                                <circle cx="50" cy="50" r="30" fill="none" stroke="white" strokeWidth="0.5" />
                            </>
                        )}
                        {patternVariant === 1 && (
                            <>
                                {[...Array(5)].map((_, i) => (
                                    <line key={i} x1={i * 25} y1="0" x2={i * 25} y2="100" stroke="white" strokeWidth="0.3" />
                                ))}
                            </>
                        )}
                        {patternVariant === 2 && (
                            <>
                                <polygon points="50,10 90,90 10,90" fill="none" stroke="white" strokeWidth="0.5" />
                                <polygon points="50,30 70,70 30,70" fill="none" stroke="white" strokeWidth="0.3" />
                            </>
                        )}
                    </svg>
                </div>

                {/* Tagline */}
                <p className="absolute top-4 left-0 right-0 text-center text-xs text-white/60 tracking-wider">
                    {tagline}
                </p>
            </div>

            {/* Junction: Logo Circle */}
            <div
                className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-20
                           w-20 h-20 rounded-full bg-white shadow-2xl flex items-center justify-center
                           border-4 border-white"
            >
                <div className="w-12 h-12">
                    <LogoComposition brand={brand} />
                </div>
            </div>

            {/* Bottom Section: Primary Color (40%) */}
            <div
                className="relative flex-[4] flex flex-col justify-end p-6 pt-12"
                style={{ backgroundColor: primary }}
            >
                {/* Brand Name */}
                <h3 className={cn(
                    "text-2xl font-bold text-white tracking-tight leading-tight mb-2",
                    brand.font.heading
                )}>
                    {brand.name}
                </h3>

                {/* Body Text */}
                <p className="text-sm text-white/80 leading-relaxed">
                    {bodyText}
                </p>
            </div>
        </div>
    );
}

// ============================================
// MODE C: THE TYPOGRAPHER
// ============================================

function ModeTypographer({
    brand,
    headline,
    tagline,
    rng
}: {
    brand: BrandIdentity;
    headline: string;
    tagline: string;
    rng: () => number;
}) {
    const primary = brand.theme.tokens.light.primary;

    return (
        <div className="relative w-full h-full bg-black overflow-hidden rounded-2xl flex items-center justify-center">

            {/* Repeating Brand Name Marquee Background */}
            <div className="absolute inset-0 flex flex-col justify-center overflow-hidden opacity-10">
                {[...Array(8)].map((_, row) => (
                    <motion.div
                        key={row}
                        className="flex whitespace-nowrap"
                        animate={{
                            x: row % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%']
                        }}
                        transition={{
                            duration: 20 + rng() * 10,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    >
                        {[...Array(6)].map((_, i) => (
                            <span
                                key={i}
                                className={cn(
                                    "text-5xl font-black tracking-tighter text-white mx-4",
                                    brand.font.heading
                                )}
                            >
                                {brand.name}
                            </span>
                        ))}
                    </motion.div>
                ))}
            </div>

            {/* Neon Logo Center */}
            <div className="relative z-10 flex flex-col items-center">
                {/* Glow Effect */}
                <div
                    className="absolute inset-0 blur-3xl opacity-40"
                    style={{ backgroundColor: primary }}
                />

                <div
                    className="relative w-28 h-28 drop-shadow-2xl"
                    style={{
                        filter: `drop-shadow(0 0 30px ${primary}80) drop-shadow(0 0 60px ${primary}40)`
                    }}
                >
                    <LogoComposition
                        brand={brand}
                        overrideColors={{ primary: primary }}
                    />
                </div>

                {/* Brand Name */}
                <h3 className={cn(
                    "mt-6 text-3xl font-bold text-white tracking-tight",
                    brand.font.heading
                )}>
                    {brand.name}
                </h3>

                {/* Tagline */}
                <p className="mt-2 text-sm text-zinc-500 tracking-wide">
                    {tagline}
                </p>
            </div>
        </div>
    );
}

// ============================================
// MODE D: THE TECHNICAL
// ============================================

function ModeTechnical({
    brand,
    headline,
    tagline,
    rng
}: {
    brand: BrandIdentity;
    headline: string;
    tagline: string;
    rng: () => number;
}) {
    const primary = brand.theme.tokens.light.primary;
    const currentYear = new Date().getFullYear();

    return (
        <div className="relative w-full h-full bg-zinc-950 overflow-hidden rounded-2xl">

            {/* Grid Pattern Background */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: `
                        linear-gradient(${primary}20 1px, transparent 1px),
                        linear-gradient(90deg, ${primary}20 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
                }}
            />

            {/* Top Left: EST Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: primary }} />
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    EST. {currentYear}
                </span>
            </div>

            {/* Top Right: Version Badge */}
            <div className="absolute top-4 right-4">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                    v1.0 {"//"}GLYPH
                </span>
            </div>

            {/* Center: Prominent Logo with Border Frame */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                    {/* Technical Frame */}
                    <div
                        className="absolute -inset-6 border border-dashed opacity-30"
                        style={{ borderColor: primary }}
                    />

                    {/* Corner Markers */}
                    <div className="absolute -top-8 -left-8 w-3 h-3 border-l-2 border-t-2" style={{ borderColor: primary }} />
                    <div className="absolute -top-8 -right-8 w-3 h-3 border-r-2 border-t-2" style={{ borderColor: primary }} />
                    <div className="absolute -bottom-8 -left-8 w-3 h-3 border-l-2 border-b-2" style={{ borderColor: primary }} />
                    <div className="absolute -bottom-8 -right-8 w-3 h-3 border-r-2 border-b-2" style={{ borderColor: primary }} />

                    {/* Main Logo - Solid and Visible */}
                    <div
                        className="w-28 h-28 rounded-lg overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: `${primary}15` }}
                    >
                        <div className="w-20 h-20">
                            <LogoComposition brand={brand} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Brand Name + Tagline */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-20 text-center">
                <h3 className={cn(
                    "text-xl font-bold text-white tracking-tight flex items-center gap-2 justify-center",
                    brand.font.heading
                )}>
                    <span className="w-4 h-4 border border-zinc-600 flex items-center justify-center">
                        <span className="w-1.5 h-1.5" style={{ backgroundColor: primary }} />
                    </span>
                    {brand.name}
                </h3>
                <p className="mt-2 text-xs text-zinc-500 tracking-wider">{tagline}</p>
            </div>

            {/* Bottom Right: Export Badge */}
            <div className="absolute bottom-4 right-4">
                <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
                    FIGMA_EXPORT
                </span>
            </div>

            {/* Bottom Left: Coordinates */}
            <div className="absolute bottom-4 left-4 flex gap-3">
                <span className="text-[10px] font-mono text-zinc-600">
                    X: {Math.floor(rng() * 1000)}
                </span>
                <span className="text-[10px] font-mono text-zinc-600">
                    Y: {Math.floor(rng() * 1000)}
                </span>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT: PROCEDURAL POSTER
// ============================================

export function ProceduralPoster({
    brand,
    forceMode,
    cardIndex = 0,
    headline: customHeadline,
    bodyText: customBody,
    className,
}: ProceduralPosterProps) {
    // Create seeded RNG based on brand ID + card index
    const seed = useMemo(() => {
        const base = brand.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
        return base + cardIndex * 1000 + Date.now() % 10000;
    }, [brand.id, cardIndex]);

    const rng = useMemo(() => seededRandom(seed), [seed]);

    // Select layout mode
    const mode = forceMode || selectLayoutMode(brand.category, rng);

    // Select content - PRIORITIZE user's actual mission/strategy over defaults
    const catKey = getCategoryKey(brand.category);
    const headlines = [...HEADLINES[catKey], ...HEADLINES.default];
    const taglines = [...TAGLINES[catKey], ...TAGLINES.default];
    const bodies = [...BODY_TEXT[catKey], ...BODY_TEXT.default];

    // Use user's actual content if available (from brand.strategy)
    const userTagline = brand.strategy?.tagline;
    const userMission = brand.strategy?.mission;
    const userHeadline = brand.strategy?.marketing?.headline;
    const userAbout = brand.strategy?.marketing?.about;

    // Priority: Custom props > User strategy > Random from pool
    const headline = customHeadline
        || userHeadline
        || headlines[Math.floor(rng() * headlines.length)];

    const tagline = userTagline
        || taglines[Math.floor(rng() * taglines.length)];

    // For body text, use mission or about - these are the "description"
    const bodyText = customBody
        || userMission
        || userAbout
        || bodies[Math.floor(rng() * bodies.length)];

    return (
        <motion.div
            className={cn("aspect-[3/4] min-h-[400px] max-h-[500px]", className)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: cardIndex * 0.1 }}
        >
            {mode === 'giant' && (
                <ModeGiant brand={brand} headline={headline} tagline={tagline} bodyText={bodyText} rng={rng} />
            )}
            {mode === 'split' && (
                <ModeSplit brand={brand} headline={headline} tagline={tagline} bodyText={bodyText} rng={rng} />
            )}
            {mode === 'typographer' && (
                <ModeTypographer brand={brand} headline={headline} tagline={tagline} rng={rng} />
            )}
            {mode === 'technical' && (
                <ModeTechnical brand={brand} headline={headline} tagline={tagline} rng={rng} />
            )}
        </motion.div>
    );
}

// ============================================
// SHOWCASE GRID (3 Cards with Different Modes)
// ============================================

export function ProceduralPosterGrid({
    brand,
    className,
}: {
    brand: BrandIdentity;
    className?: string;
}) {
    // Generate 3 unique modes to ensure variety
    const seed = brand.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + Date.now() % 10000;
    const rng = seededRandom(seed);

    const allModes: LayoutMode[] = ['giant', 'split', 'typographer', 'technical'];
    const shuffled = [...allModes].sort(() => rng() - 0.5);
    const selectedModes = shuffled.slice(0, 3);

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-6", className)}>
            {selectedModes.map((mode, index) => (
                <ProceduralPoster
                    key={`${brand.id}-${mode}-${index}`}
                    brand={brand}
                    forceMode={mode}
                    cardIndex={index}
                />
            ))}
        </div>
    );
}

export default ProceduralPoster;
