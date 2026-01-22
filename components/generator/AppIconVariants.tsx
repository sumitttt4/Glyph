"use client";

import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';

interface AppIconVariantsProps {
    brand: BrandIdentity;
    isDark?: boolean;
}

export function AppIconVariants({ brand, isDark = false }: AppIconVariantsProps) {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    return (
        <div className="flex items-center justify-center gap-8 w-full h-full p-6">
            {/* Filled Icon (Primary bg, white logo) */}
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-24 h-24 rounded-[28px] flex items-center justify-center relative overflow-hidden"
                    style={{
                        backgroundColor: tokens.primary,
                        boxShadow: `0 12px 32px ${tokens.primary}40, 0 4px 8px rgba(0,0,0,0.1)`
                    }}
                >
                    {/* Subtle gradient overlay */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{ background: 'linear-gradient(135deg, white 0%, transparent 50%)' }}
                    />
                    <div className="w-12 h-12 relative z-10">
                        <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                    </div>
                </div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Filled</span>
            </div>

            {/* Outline Icon (White bg, colored border & logo) */}
            <div className="flex flex-col items-center gap-4">
                <div
                    className="w-24 h-24 rounded-[28px] flex items-center justify-center bg-white relative"
                    style={{
                        border: `3px solid ${tokens.primary}`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
                    }}
                >
                    <div className="w-12 h-12">
                        <LogoComposition brand={brand} />
                    </div>
                </div>
                <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Outline</span>
            </div>
        </div>
    );
}

// Stacked cards version for mockups section
export function AppIconStack({ brand, isDark = false }: AppIconVariantsProps) {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    return (
        <div className="relative w-full h-full flex items-center justify-center">
            {/* Shadow/Back icon */}
            <div
                className="absolute w-16 h-16 rounded-[18px] transform rotate-12 translate-x-4 translate-y-2 opacity-40"
                style={{ backgroundColor: tokens.surface }}
            />

            {/* Main icon */}
            <div
                className="relative w-20 h-20 rounded-[22px] flex items-center justify-center shadow-xl z-10"
                style={{
                    backgroundColor: tokens.primary,
                    boxShadow: `0 12px 32px ${tokens.primary}50`
                }}
            >
                <div className="w-10 h-10">
                    <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                </div>
            </div>
        </div>
    );
}
