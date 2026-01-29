"use client";

import React, { useId } from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from './LogoComposition';
import { motion } from 'framer-motion';

interface LogoConstructionGridProps {
    brand: BrandIdentity;
    className?: string;
    showGuidelines?: boolean;
    showMeasurements?: boolean;
    showGoldenRatio?: boolean;
    showSafeZones?: boolean;
    variant?: 'blueprint' | 'minimal' | 'technical';
}

/**
 * Advanced Logo Construction Grid
 * 
 * Displays the logo with professional construction overlays:
 * - Geometric grid system (10px base)
 * - Golden ratio proportions (φ = 1.618)
 * - Safe zone boundaries
 * - Squircle synthesis curves
 * - Mathematical annotations
 * 
 * Inspired by high-end agency presentations like Quicode.
 */
export const LogoConstructionGrid = ({
    brand,
    className = '',
    showGuidelines = true,
    showMeasurements = true,
    showGoldenRatio = true,
    showSafeZones = true,
    variant = 'blueprint'
}: LogoConstructionGridProps) => {
    const uniqueId = useId();
    const PHI = 1.618033988749895; // Golden Ratio

    // Color scheme based on variant
    const colors = {
        blueprint: {
            bg: '#0a0a0f',
            grid: '#1e293b',
            primary: '#6366f1', // Indigo
            secondary: '#818cf8', // Lighter indigo
            accent: '#a855f7', // Purple
            text: '#94a3b8',
            annotation: '#64748b'
        },
        minimal: {
            bg: '#fafafa',
            grid: '#e5e5e5',
            primary: brand.theme.tokens.light.primary,
            secondary: '#a3a3a3',
            accent: brand.theme.tokens.light.primary,
            text: '#525252',
            annotation: '#a3a3a3'
        },
        technical: {
            bg: '#18181b',
            grid: '#27272a',
            primary: '#22c55e', // Green
            secondary: '#4ade80',
            accent: '#86efac',
            text: '#a1a1aa',
            annotation: '#71717a'
        }
    };

    const theme = colors[variant];
    const primaryColor = brand.theme.tokens.light.primary;

    // Grid dimensions
    const gridSize = 40; // 40px = 10 visual units
    const viewBoxSize = 400;
    const center = viewBoxSize / 2;

    // Golden ratio dimensions
    const goldenOuter = viewBoxSize * 0.38; // ~152px
    const goldenInner = goldenOuter / PHI; // ~94px
    const goldenInner2 = goldenInner / PHI; // ~58px

    // Safe zone calculations
    const safeZoneOuter = viewBoxSize * 0.85;
    const safeZoneInner = viewBoxSize * 0.15;
    const logoZone = viewBoxSize * 0.6;

    return (
        <div className={`relative w-full aspect-square overflow-hidden rounded-2xl ${className}`} style={{ background: theme.bg }}>

            {/* Layer 1: Base Grid Pattern */}
            <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} preserveAspectRatio="xMidYMid slice">
                <defs>
                    {/* Fine Grid (10px) */}
                    <pattern id={`fine-grid-${uniqueId}`} width={gridSize / 4} height={gridSize / 4} patternUnits="userSpaceOnUse">
                        <path d={`M ${gridSize / 4} 0 L 0 0 0 ${gridSize / 4}`} fill="none" stroke={theme.grid} strokeWidth="0.25" opacity="0.3" />
                    </pattern>

                    {/* Major Grid (40px) */}
                    <pattern id={`major-grid-${uniqueId}`} width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                        <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke={theme.grid} strokeWidth="0.5" opacity="0.6" />
                    </pattern>

                    {/* Gradient definitions */}
                    <linearGradient id={`guide-gradient-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={theme.primary} stopOpacity="0.8" />
                        <stop offset="100%" stopColor={theme.accent} stopOpacity="0.4" />
                    </linearGradient>

                    {/* Radial gradient for golden ratio circles */}
                    <radialGradient id={`golden-gradient-${uniqueId}`} cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor={theme.primary} stopOpacity="0" />
                        <stop offset="90%" stopColor={theme.primary} stopOpacity="0.1" />
                        <stop offset="100%" stopColor={theme.primary} stopOpacity="0.3" />
                    </radialGradient>
                </defs>

                {/* Background grids */}
                <rect width="100%" height="100%" fill={`url(#fine-grid-${uniqueId})`} />
                <rect width="100%" height="100%" fill={`url(#major-grid-${uniqueId})`} />
            </svg>

            {/* Layer 2: Construction Guidelines */}
            {showGuidelines && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                    {/* Center Crosshairs */}
                    <g className="center-crosshairs">
                        <line x1={center} y1="0" x2={center} y2={viewBoxSize} stroke={theme.primary} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6" />
                        <line x1="0" y1={center} x2={viewBoxSize} y2={center} stroke={theme.primary} strokeWidth="0.5" strokeDasharray="4 4" opacity="0.6" />

                        {/* Center point marker */}
                        <circle cx={center} cy={center} r="3" fill={theme.primary} opacity="0.8" />
                        <circle cx={center} cy={center} r="6" fill="none" stroke={theme.primary} strokeWidth="0.5" opacity="0.4" />
                    </g>

                    {/* Diagonal Guidelines */}
                    <g className="diagonal-guides" opacity="0.3">
                        <line x1="0" y1="0" x2={viewBoxSize} y2={viewBoxSize} stroke={theme.secondary} strokeWidth="0.5" strokeDasharray="8 8" />
                        <line x1={viewBoxSize} y1="0" x2="0" y2={viewBoxSize} stroke={theme.secondary} strokeWidth="0.5" strokeDasharray="8 8" />
                    </g>

                    {/* Third-rule lines */}
                    <g className="thirds-grid" opacity="0.25">
                        <line x1={viewBoxSize / 3} y1="0" x2={viewBoxSize / 3} y2={viewBoxSize} stroke={theme.secondary} strokeWidth="0.5" />
                        <line x1={(viewBoxSize * 2) / 3} y1="0" x2={(viewBoxSize * 2) / 3} y2={viewBoxSize} stroke={theme.secondary} strokeWidth="0.5" />
                        <line x1="0" y1={viewBoxSize / 3} x2={viewBoxSize} y2={viewBoxSize / 3} stroke={theme.secondary} strokeWidth="0.5" />
                        <line x1="0" y1={(viewBoxSize * 2) / 3} x2={viewBoxSize} y2={(viewBoxSize * 2) / 3} stroke={theme.secondary} strokeWidth="0.5" />
                    </g>
                </svg>
            )}

            {/* Layer 3: Golden Ratio Circles */}
            {showGoldenRatio && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                    <g className="golden-ratio-circles">
                        {/* Outer golden circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={goldenOuter}
                            fill="none"
                            stroke={`url(#guide-gradient-${uniqueId})`}
                            strokeWidth="1"
                            opacity="0.6"
                        />

                        {/* φ division circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={goldenInner}
                            fill="none"
                            stroke={theme.accent}
                            strokeWidth="0.75"
                            strokeDasharray="2 4"
                            opacity="0.5"
                        />

                        {/* φ² division circle */}
                        <circle
                            cx={center}
                            cy={center}
                            r={goldenInner2}
                            fill="none"
                            stroke={theme.accent}
                            strokeWidth="0.5"
                            strokeDasharray="1 3"
                            opacity="0.4"
                        />

                        {/* Golden spiral approximation (Fibonacci arcs) */}
                        <path
                            d={`
                                M ${center + goldenOuter} ${center}
                                A ${goldenOuter} ${goldenOuter} 0 0 1 ${center} ${center + goldenOuter}
                                A ${goldenInner} ${goldenInner} 0 0 1 ${center - goldenInner} ${center}
                                A ${goldenInner2} ${goldenInner2} 0 0 1 ${center} ${center - goldenInner2}
                            `}
                            fill="none"
                            stroke={theme.primary}
                            strokeWidth="1"
                            strokeLinecap="round"
                            opacity="0.4"
                        />
                    </g>
                </svg>
            )}

            {/* Layer 4: Safe Zone Indicators */}
            {showSafeZones && (
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
                    <g className="safe-zones">
                        {/* Outer boundary */}
                        <rect
                            x={safeZoneInner}
                            y={safeZoneInner}
                            width={safeZoneOuter - safeZoneInner}
                            height={safeZoneOuter - safeZoneInner}
                            fill="none"
                            stroke={theme.secondary}
                            strokeWidth="0.75"
                            strokeDasharray="4 2"
                            opacity="0.4"
                            rx="8"
                        />

                        {/* Logo zone */}
                        <rect
                            x={(viewBoxSize - logoZone) / 2}
                            y={(viewBoxSize - logoZone) / 2}
                            width={logoZone}
                            height={logoZone}
                            fill="none"
                            stroke={theme.primary}
                            strokeWidth="1"
                            strokeDasharray="6 3"
                            opacity="0.5"
                            rx="16"
                        />

                        {/* Corner safe zone markers */}
                        {[0, 1, 2, 3].map((corner) => {
                            const isRight = corner % 2 === 1;
                            const isBottom = corner >= 2;
                            const x = isRight ? viewBoxSize - 20 : 20;
                            const y = isBottom ? viewBoxSize - 20 : 20;
                            return (
                                <g key={corner} opacity="0.5">
                                    <line
                                        x1={x - 5}
                                        y1={y}
                                        x2={x + 5}
                                        y2={y}
                                        stroke={theme.accent}
                                        strokeWidth="1"
                                    />
                                    <line
                                        x1={x}
                                        y1={y - 5}
                                        x2={x}
                                        y2={y + 5}
                                        stroke={theme.accent}
                                        strokeWidth="1"
                                    />
                                </g>
                            );
                        })}
                    </g>
                </svg>
            )}

            {/* Layer 5: The Logo Itself */}
            <div className="absolute inset-0 flex items-center justify-center p-[15%]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="relative w-full h-full"
                >
                    {/* Construction ghost (slightly larger, blurred) */}
                    <div className="absolute inset-0 opacity-5 scale-110 blur-sm pointer-events-none grayscale">
                        <LogoComposition brand={brand} />
                    </div>

                    {/* The actual logo */}
                    <div className="relative z-10 w-full h-full drop-shadow-2xl">
                        <LogoComposition brand={brand} />
                    </div>
                </motion.div>
            </div>

            {/* Layer 6: Measurement Annotations */}
            {showMeasurements && (
                <>
                    {/* Top-left annotations */}
                    <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase space-y-1" style={{ color: theme.text }}>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.primary }} />
                            <span>Grid: 10px</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent }} />
                            <span>Scale: 1:1</span>
                        </div>
                    </div>

                    {/* Top-right: Brand context */}
                    <div className="absolute top-4 right-4 font-mono text-[10px] tracking-widest uppercase text-right space-y-1" style={{ color: theme.text }}>
                        <div>{brand.shape?.name || 'Geometric'} Synthesis</div>
                        <div>Algorithm: {brand.logoLayout || 'Context'}</div>
                    </div>

                    {/* Bottom-left: Golden ratio */}
                    <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-widest uppercase space-y-1" style={{ color: theme.annotation }}>
                        <div>φ = 1.618</div>
                        <div>Safe Zone: 2x</div>
                    </div>

                    {/* Bottom-right: Brand name */}
                    <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-widest uppercase text-right" style={{ color: theme.annotation }}>
                        <div>{brand.name}</div>
                        <div className="flex items-center justify-end gap-2 mt-1">
                            <span className="w-3 h-3 rounded" style={{ backgroundColor: primaryColor }} />
                            <span>{primaryColor.toUpperCase()}</span>
                        </div>
                    </div>

                    {/* Right measurement indicator */}
                    <div className="absolute top-1/2 right-[5%] h-[30%] -translate-y-1/2 flex items-center">
                        <div className="h-full border-r flex items-center" style={{ borderColor: theme.secondary }}>
                            <span
                                className="translate-x-[150%] rotate-90 font-mono text-[9px] whitespace-nowrap"
                                style={{ color: theme.text }}
                            >
                                1.618 × φ
                            </span>
                        </div>
                    </div>

                    {/* Bottom measurement indicator */}
                    <div className="absolute bottom-[5%] left-1/2 w-[30%] -translate-x-1/2 flex flex-col items-center">
                        <div className="w-full border-b flex justify-center pb-1" style={{ borderColor: theme.secondary }}>
                            <span className="font-mono text-[9px]" style={{ color: theme.text }}>
                                1:1 Ratio
                            </span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LogoConstructionGrid;
