'use client';

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { cn } from '@/lib/utils';

interface MockupBillboardProps {
    brand: BrandIdentity;
    className?: string;
    variant?: 'metro' | 'highway';
}

export const MockupBillboard = ({ brand, className, variant = 'metro' }: MockupBillboardProps) => {
    const tokens = brand.theme.tokens.light;
    const darkTokens = brand.theme.tokens.dark;

    // Choose colors based on variant for contrast
    const useDark = variant === 'metro';
    const bg = useDark ? tokens.bg : tokens.primary;
    const fg = useDark ? tokens.text : '#ffffff';
    const accent = useDark ? tokens.primary : tokens.accent || '#ffffff';

    return (
        <div className={cn("relative w-full aspect-[2/1] bg-stone-200 rounded-lg overflow-hidden shadow-2xl", className)}>
            {/* Structural Frame */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-stone-800 z-20" />
            <div className="absolute inset-y-0 left-0 w-2 bg-stone-800 z-20" />
            <div className="absolute inset-y-0 right-0 w-2 bg-stone-800 z-20" />
            <div className="absolute inset-x-0 top-0 h-2 bg-stone-800 z-20" />

            {/* Canvas */}
            <div
                className="absolute inset-2 bg-white flex flex-col items-center justify-center p-8 overflow-hidden"
                style={{ backgroundColor: bg }}
            >
                {/* Background Pattern/Texture */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: `radial-gradient(${accent} 2px, transparent 2px)`,
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* Content Layout */}
                <div className="relative z-10 w-full h-full flex items-center">

                    {variant === 'metro' ? (
                        // Metro: Split layout (Text Left, Logo Right)
                        <div className="grid grid-cols-2 gap-12 w-full h-full items-center pl-12">
                            <div className="space-y-6">
                                <h2
                                    className={cn("text-6xl font-black tracking-tighter leading-none", brand.font.heading)}
                                    style={{ color: fg }}
                                >
                                    THE FUTURE <br /> IS <span style={{ color: accent }}>HERE.</span>
                                </h2>
                                <div className="h-2 w-24" style={{ backgroundColor: accent }} />
                                <p
                                    className={cn("text-xl font-medium opacity-80 max-w-sm", brand.font.body)}
                                    style={{ color: fg }}
                                >
                                    {brand.strategy?.mission || `Experience the new standard of ${brand.vibe}.`}
                                </p>
                            </div>
                            <div className="flex items-center justify-center h-full relative">
                                <div className="w-64 h-64 relative filter drop-shadow-2xl">
                                    <LogoComposition brand={brand} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        // Highway: Centered Impact
                        <div className="w-full flex justify-between items-center px-20">
                            <div className="flex flex-col gap-4">
                                <div className="w-32 h-32 relative">
                                    <LogoComposition brand={brand} overrideColors={{ primary: fg }} />
                                </div>
                                <h1
                                    className={cn("text-5xl font-bold tracking-tight", brand.font.heading)}
                                    style={{ color: fg }}
                                >
                                    {brand.name}
                                </h1>
                            </div>

                            <div className="text-right">
                                <h2
                                    className={cn("text-7xl font-black uppercase tracking-tighter", brand.font.heading)}
                                    style={{ color: fg }}
                                >
                                    BOLDLY <br /> <span style={{ color: accent }}>FORWARD</span>
                                </h2>
                            </div>
                        </div>
                    )}
                </div>

                {/* Glare/Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10" />
            </div>

            {/* Lighting Fixtures (Top) */}
            <div className="absolute -top-1 left-1/4 w-8 h-4 bg-stone-900 z-0 rounded-t shadow-sm" />
            <div className="absolute -top-1 right-1/4 w-8 h-4 bg-stone-900 z-0 rounded-t shadow-sm" />
        </div>
    );
};
