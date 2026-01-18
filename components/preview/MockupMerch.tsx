"use client";

import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';

interface MockupToteBagProps {
    brand: BrandIdentity;
    isDark?: boolean;
}

export function MockupToteBag({ brand, isDark = false }: MockupToteBagProps) {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Tote Bag Shape */}
            <div className="relative">
                {/* Bag handles */}
                <div className="absolute -top-4 left-8 right-8 flex justify-between">
                    <div
                        className="w-4 h-8 rounded-full border-4"
                        style={{ borderColor: tokens.primary }}
                    />
                    <div
                        className="w-4 h-8 rounded-full border-4"
                        style={{ borderColor: tokens.primary }}
                    />
                </div>

                {/* Bag body */}
                <div
                    className="w-40 h-48 rounded-b-2xl rounded-t-lg flex items-center justify-center shadow-2xl relative overflow-hidden"
                    style={{
                        backgroundColor: tokens.surface,
                        boxShadow: `0 20px 40px ${tokens.primary}30`
                    }}
                >
                    {/* Fabric texture */}
                    <div
                        className="absolute inset-0 opacity-10"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, currentColor 2px, currentColor 3px)',
                            color: tokens.text
                        }}
                    />

                    {/* Logo */}
                    <div className="w-20 h-20 relative z-10">
                        <LogoComposition brand={brand} />
                    </div>
                </div>
            </div>
        </div>
    );
}

interface MockupIDBadgeProps {
    brand: BrandIdentity;
    isDark?: boolean;
}

export function MockupIDBadge({ brand, isDark = false }: MockupIDBadgeProps) {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    return (
        <div className="relative w-full h-full flex items-center justify-center p-6">
            {/* Lanyard */}
            <div
                className="absolute top-0 left-1/2 w-4 h-12 -translate-x-1/2 rounded-b-full opacity-80"
                style={{ backgroundColor: tokens.primary }}
            />

            {/* Badge card - tilted */}
            <div className="transform rotate-6 hover:rotate-0 transition-transform duration-500">
                <div
                    className="w-36 h-52 rounded-2xl shadow-2xl overflow-hidden relative"
                    style={{
                        backgroundColor: tokens.primary,
                        boxShadow: `0 16px 48px ${tokens.primary}40`
                    }}
                >
                    {/* Badge header pattern */}
                    <div
                        className="absolute top-0 left-0 right-0 h-20 opacity-30"
                        style={{
                            background: `linear-gradient(135deg, ${tokens.surface}20 0%, transparent 60%)`
                        }}
                    />

                    {/* Logo watermark background */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-28 opacity-20">
                        <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                    </div>

                    {/* Badge content */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pt-8" style={{ backgroundColor: tokens.bg }}>
                        {/* Logo small */}
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-6 h-6">
                                <LogoComposition brand={brand} />
                            </div>
                            <span
                                className="font-bold text-sm uppercase tracking-wider"
                                style={{ color: tokens.text }}
                            >
                                {brand.name}
                            </span>
                        </div>

                        {/* Placeholder info */}
                        <div className="space-y-1">
                            <div className="h-2 rounded-full w-3/4" style={{ backgroundColor: tokens.muted }} />
                            <div className="h-2 rounded-full w-1/2" style={{ backgroundColor: tokens.muted }} />
                        </div>
                    </div>

                    {/* Clip hole */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-3 rounded-full bg-white/30" />
                </div>
            </div>
        </div>
    );
}

interface MockupCreditCardProps {
    brand: BrandIdentity;
    isDark?: boolean;
}

export function MockupCreditCard({ brand, isDark = false }: MockupCreditCardProps) {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    return (
        <div className="relative w-full h-full flex items-center justify-center p-6">
            {/* Card with tilt effect */}
            <div
                className="w-72 h-44 rounded-2xl shadow-2xl overflow-hidden relative transform perspective-1000 hover:rotate-y-6 transition-transform duration-500"
                style={{
                    backgroundColor: tokens.primary,
                    boxShadow: `0 20px 50px ${tokens.primary}50`
                }}
            >
                {/* Gradient overlay */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(135deg, ${tokens.surface}30 0%, transparent 50%, ${tokens.text}10 100%)`
                    }}
                />

                {/* Logo top left */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="w-10 h-10">
                        <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                    </div>
                    <span className="font-bold text-white text-sm uppercase tracking-wider">
                        {brand.name}
                    </span>
                </div>

                {/* Chip */}
                <div className="absolute top-16 left-6 w-10 h-8 rounded-md bg-yellow-400/80 flex items-center justify-center">
                    <div className="w-6 h-5 rounded-sm border border-yellow-600/50 grid grid-cols-2 gap-0.5 p-0.5">
                        <div className="bg-yellow-600/30 rounded-sm" />
                        <div className="bg-yellow-600/30 rounded-sm" />
                        <div className="bg-yellow-600/30 rounded-sm" />
                        <div className="bg-yellow-600/30 rounded-sm" />
                    </div>
                </div>

                {/* Card number placeholder */}
                <div className="absolute bottom-12 left-6 flex gap-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="flex gap-1">
                            {[1, 2, 3, 4].map(j => (
                                <div key={j} className="w-2 h-2 rounded-full bg-white/40" />
                            ))}
                        </div>
                    ))}
                </div>

                {/* Expiry */}
                <div className="absolute bottom-4 left-6 text-white/60 text-xs font-mono">
                    VALID THRU 12/29
                </div>

                {/* Contactless icon area */}
                <div className="absolute bottom-4 right-6">
                    <svg className="w-6 h-6 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M2 12a10 10 0 1 0 10-10" />
                        <path d="M6 12a6 6 0 1 0 6-6" />
                        <path d="M10 12a2 2 0 1 0 2-2" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
