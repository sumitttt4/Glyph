"use client";

import { LogoComposition } from '@/components/brand/LogoComposition';
import { BrandIdentity } from '@/lib/data';

interface MockupIPhoneHomeProps {
    brand: BrandIdentity;
    isDark?: boolean;
}

export function MockupIPhoneHome({ brand, isDark = false }: MockupIPhoneHomeProps) {
    const tokens = brand.theme.tokens[isDark ? 'dark' : 'light'];

    return (
        <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
                background: `linear-gradient(135deg, ${tokens.primary} 0%, ${tokens.surface} 100%)`
            }}
        >
            {/* Simple iPhone Frame - Angled */}
            <div className="relative transform rotate-[-8deg] translate-x-12 translate-y-6 scale-[1.1]">
                {/* Phone body */}
                <div
                    className="relative w-[200px] h-[420px] rounded-[40px] bg-stone-900 shadow-2xl overflow-hidden"
                    style={{
                        boxShadow: '0 40px 80px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.1)'
                    }}
                >
                    {/* Screen bezel */}
                    <div className="absolute inset-[3px] rounded-[37px] bg-black overflow-hidden">
                        {/* Dynamic Island */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-20" />

                        {/* Screen content - Dark background */}
                        <div className="absolute inset-0 bg-stone-950 pt-12">
                            {/* Status bar */}
                            <div className="flex justify-between items-center px-6 mb-8">
                                <span className="text-white text-xs font-semibold">9:41</span>
                                <div className="flex items-center gap-1">
                                    <div className="w-4 h-2 bg-white rounded-sm opacity-80" />
                                </div>
                            </div>

                            {/* Single Featured App Icon */}
                            <div className="flex flex-col items-center justify-center px-8">
                                <div
                                    className="w-16 h-16 rounded-[16px] flex items-center justify-center shadow-xl mb-2 overflow-hidden"
                                    style={{
                                        backgroundColor: 'white',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                                    }}
                                >
                                    <div className="w-10 h-10">
                                        <LogoComposition brand={brand} />
                                    </div>
                                </div>
                                <span className="text-white text-[11px] font-medium">
                                    {brand.name.length > 10 ? brand.name.slice(0, 10) : brand.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Side button */}
                    <div className="absolute -right-[2px] top-24 w-[3px] h-10 bg-stone-700 rounded-r" />
                </div>
            </div>
        </div>
    );
}
