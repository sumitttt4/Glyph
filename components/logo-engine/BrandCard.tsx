import React from 'react';
import { getBrandShadow } from '@/lib/brandPhysics';

interface BrandCardProps {
    brandName: string;
    color: string;
    vibe: string;
    logoComponent: React.ReactNode;
}

export default function BrandCard({ brandName, color, vibe, logoComponent }: BrandCardProps) {

    // 1. CHOOSE PHYSICS BASED ON VIBE
    const shadowStyle = vibe === 'bold' ? 'glass' : vibe === 'tech' ? 'hard' : 'soft';

    return (
        <div className="relative group perspective-1000 h-full w-full">

            {/* 2. THE CARD (Using dynamic shadows) */}
            <div
                className="relative w-full h-full rounded-[2rem] overflow-hidden bg-white transition-all duration-500 hover:scale-[1.02] hover:-rotate-1"
                style={{
                    boxShadow: getBrandShadow(color, shadowStyle)
                }}
            >

                {/* 3. THE TEXTURE (Market Radar Dither Effect) */}
                {/* Only visible for 'Bold' brands */}
                {vibe === 'bold' && (
                    <div className="absolute inset-0 z-10 opacity-20 pointer-events-none mix-blend-overlay"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
                            backgroundSize: '120px'
                        }}
                    />
                )}

                {/* 4. THE BACKGROUND (Bitlendex Mesh Gradient) */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        background: `radial-gradient(circle at 100% 0%, ${color}, transparent 60%), radial-gradient(circle at 0% 100%, ${color}, transparent 60%)`
                    }}
                />

                {/* 5. THE CONTENT */}
                <div className="relative z-20 h-full flex flex-col items-center justify-between p-8">
                    <div className="w-full flex justify-between opacity-50">
                        <span className="text-[10px] font-mono tracking-widest uppercase">Brand_01</span>
                        <span className="text-[10px] font-mono tracking-widest uppercase">{vibe}</span>
                    </div>

                    {/* The Logo */}
                    <div className="transform scale-150 drop-shadow-2xl">
                        {logoComponent}
                    </div>

                    {/* The Name */}
                    <h3 className="text-2xl font-bold tracking-tight text-stone-900">{brandName}</h3>
                </div>

            </div>

            {/* 6. THE REFLECTION (Glass Effect) */}
            {/* Adds that shiny "iPhone screen" look from the reference */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none border border-white/50" />

        </div>
    );
}
