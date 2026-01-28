
"use client";
import React, { useMemo } from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { motion } from 'framer-motion';

// ==========================================
// MODULES (The Ingredients)
// ==========================================

const ModuleTypography = ({ brand }: { brand: BrandIdentity }) => {
    // Extract mission or fallback
    const text = brand.strategy?.tagline || brand.name + " DESIGN SYSTEM";
    const primary = brand.theme.tokens.light.primary;

    return (
        <div className="w-full h-full bg-stone-900 flex flex-col justify-between p-6 overflow-hidden relative">
            <div className="text-xs font-mono opacity-50 text-white tracking-widest">TYPE_SPEC</div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase leading-[0.85] break-words tracking-tighter"
                style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                {text}
            </h2>
            <div className="h-2 w-20 mt-4 bg-current" style={{ color: primary }} />
        </div>
    );
};

const ModuleSymbol = ({ brand }: { brand: BrandIdentity }) => {
    return (
        <div className="w-full h-full bg-stone-950 flex items-center justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 opacity-20"
                style={{ background: `radial-gradient(circle at center, ${brand.theme.tokens.light.primary}, transparent 70%)` }} />

            <div className="relative z-10 w-1/2 scale-[1.5]">
                <LogoComposition brand={brand} />
            </div>

            {/* Corners */}
            <div className="absolute top-4 left-4 w-2 h-2 border-t border-l border-white/20" />
            <div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/20" />
            <div className="absolute bottom-4 left-4 w-2 h-2 border-b border-l border-white/20" />
            <div className="absolute bottom-4 right-4 w-2 h-2 border-b border-r border-white/20" />
        </div>
    );
};

const ModulePattern = ({ brand }: { brand: BrandIdentity }) => {
    const primary = brand.theme.tokens.light.primary;
    return (
        <div className="w-full h-full bg-stone-900 flex items-center justify-center relative overflow-hidden">
            <svg width="100%" height="100%">
                <pattern id={`trip-pat-${brand.id}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill={primary} opacity="0.5" />
                    <path d="M20 20 L22 22" stroke={primary} strokeWidth="1" opacity="0.3" />
                </pattern>
                <rect width="100%" height="100%" fill={`url(#trip-pat-${brand.id})`} />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-transparent" />
        </div>
    );
};

// Placeholder Architecture Image with Blend Mode
const ModuleImage = ({ brand }: { brand: BrandIdentity }) => {
    const primary = brand.theme.tokens.light.primary;
    return (
        <div className="w-full h-full bg-stone-800 relative overflow-hidden">
            {/* Grayscale Image */}
            <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
                alt="Architecture"
                className="w-full h-full object-cover grayscale opacity-60"
            />
            {/* Color Overlay */}
            <div className="absolute inset-0 mix-blend-color opacity-80" style={{ backgroundColor: primary }} />
            {/* Gradient Overlay for Text Readability just in case */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-stone-950/60" />
        </div>
    );
};

const ModuleData = ({ brand }: { brand: BrandIdentity }) => {
    const primary = brand.theme.tokens.light.primary;
    return (
        <div className="w-full h-full bg-stone-950 p-6 flex flex-col justify-end font-mono text-[10px] text-stone-400 relative border border-white/5">
            {/* Grid Lines */}
            <div className="absolute inset-0"
                style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />

            <div className="relative z-10 space-y-2">
                <div className="flex justify-between border-b border-white/10 pb-1">
                    <span>HEX</span>
                    <span className="text-white">{primary.toUpperCase()}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                    <span>FONT</span>
                    <span className="text-white uppercase">{brand.font.heading.replace('var(--font-', '').replace(')', '')}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-1">
                    <span>VIBE</span>
                    <span className="text-white uppercase">{brand.vibe}</span>
                </div>
                <div className="mt-4 text-xs text-white opacity-50">
                    SYSTEM_VER_2.4.0
                </div>
            </div>
        </div>
    );
};

// ==========================================
// CONFIGURATIONS
// ==========================================

const LAYOUTS = [
    ['type', 'symbol', 'pattern'], // Classic
    ['image', 'type', 'symbol'],   // Editorial
    ['data', 'symbol', 'data'],    // Technical
    ['pattern', 'image', 'type']   // Artistic
];

// ==========================================
// COMPONENT
// ==========================================

export function DynamicTriptych({ brand }: { brand: BrandIdentity }) {
    // Determinisitic Layout Selection
    const seed = useMemo(() => {
        // Use brand name sum if num seed missing
        return brand.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    }, [brand.name]);

    const layoutIndex = seed % LAYOUTS.length;
    const activeLayout = LAYOUTS[layoutIndex];

    const renderModule = (type: string) => {
        switch (type) {
            case 'type': return <ModuleTypography brand={brand} />;
            case 'symbol': return <ModuleSymbol brand={brand} />;
            case 'pattern': return <ModulePattern brand={brand} />;
            case 'image': return <ModuleImage brand={brand} />;
            case 'data': return <ModuleData brand={brand} />;
            default: return <ModuleSymbol brand={brand} />;
        }
    };

    return (
        <div className="w-full py-8">
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-4 aspect-[9/16] md:aspect-[16/9] md:h-[500px]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                {activeLayout.map((moduleType, i) => (
                    <div
                        key={i}
                        className="h-full w-full rounded-2xl overflow-hidden border border-stone-800 shadow-2xl relative group"
                    >
                        {/* Module Content */}
                        {renderModule(moduleType)}

                        {/* Selection Overlay (optional visual polish) */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 transition-colors pointer-events-none rounded-2xl" />
                    </div>
                ))}
            </motion.div>

            <div className="flex justify-between items-center mt-4 px-2">
                <div className="text-[10px] text-stone-600 font-mono uppercase tracking-widest">
                    Layout Config: {layoutIndex + 1} / 4
                </div>
                <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => (
                        <div key={i} className={`w-1 h-1 rounded-full ${i === layoutIndex ? 'bg-orange-500' : 'bg-stone-800'}`} />
                    ))}
                </div>
            </div>
        </div>
    );
}
