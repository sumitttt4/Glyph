import React, { useId } from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from './LogoComposition';

interface LogoConstructionProps {
    brand: BrandIdentity;
    className?: string;
}

/**
 * Logo Construction / Blueprint View
 * Displays the logo with architectural grid lines, clear space guides, and geometry markers.
 * Delivers the "High-End Agency" presentation aesthetic.
 */
export const LogoConstruction = ({ brand, className }: LogoConstructionProps) => {
    const uniqueId = useId();
    const primaryColor = brand.theme.tokens.light.primary;
    const gridColor = '#E5E5E5'; // Faint grey keyline
    const guideColor = primaryColor; // Brand color for active guides

    return (
        <div className={`relative w-full aspect-square bg-slate-50 overflow-hidden ${className}`}>
            {/* 1. Underlying Grid (10x10) */}
            <svg className="absolute inset-0 w-full h-full opacity-20" width="100%" height="100%">
                <defs>
                    <pattern id={`grid-${uniqueId}`} width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridColor} strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${uniqueId})`} />
            </svg>

            {/* 2. Construction Lines (Golden Ratio / Geometry) */}
            <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                {/* Center Crosshair */}
                <line x1="50%" y1="0" x2="50%" y2="100%" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="4 4" />
                <line x1="0" y1="50%" x2="100%" y2="50%" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="4 4" />

                {/* Golden Ratio Circles */}
                <circle cx="50%" cy="50%" r="25%" fill="none" stroke={primaryColor} strokeWidth="0.5" opacity="0.5" />
                <circle cx="50%" cy="50%" r="38%" fill="none" stroke={primaryColor} strokeWidth="0.5" opacity="0.3" />

                {/* Safe Zone Box */}
                <rect x="15%" y="15%" width="70%" height="70%" fill="none" stroke={primaryColor} strokeWidth="0.5" strokeDasharray="2 2" opacity="0.4" />
            </svg>

            {/* 3. The Logo Itself (Ghosted & Real) */}
            <div className="absolute inset-0 flex items-center justify-center p-12">
                <div className="relative w-full h-full">
                    {/* Outline / Construction Ghost */}
                    <div className="absolute inset-0 opacity-10 scale-110 blur-sm pointer-events-none grayscale">
                        <LogoComposition brand={brand} />
                    </div>

                    {/* Real Logo */}
                    <div className="relative z-10 w-full h-full drop-shadow-2xl">
                        <LogoComposition brand={brand} />
                    </div>
                </div>
            </div>

            {/* 4. Annotations */}
            <div className="absolute top-4 left-4 font-mono text-[10px] text-slate-400 tracking-widest uppercase">
                <div>Grid: 10px</div>
                <div>Scale: 1:1</div>
            </div>

            <div className="absolute bottom-4 right-4 font-mono text-[10px] text-slate-400 tracking-widest uppercase text-right">
                <div>Safe Zone: 2x</div>
                <div>{brand.shape?.name || 'Geometric'} Synthesis</div>
            </div>

            {/* 5. Measurement Indicators */}
            <div className="absolute top-1/2 right-[10%] h-[30%] -translate-y-1/2 border-r border-slate-300 flex items-center justify-center">
                <span className="translate-x-[150%] rotate-90 font-mono text-[9px] text-slate-400">1.618 x</span>
            </div>
        </div>
    );
};
