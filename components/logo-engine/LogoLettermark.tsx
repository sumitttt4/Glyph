/**
 * Lettermark Logo Engine v2
 * 
 * Generates professional styled lettermarks from brand initials.
 * Now with 10 premium variants including gradients, outlines, and badges.
 */

import React from 'react';
import { BrandIdentity } from '@/lib/data';

type LettermarkVariant =
    | 'geometric'
    | 'modern'
    | 'bold'
    | 'minimal'
    | 'tech'
    | 'gradient'
    | 'outline'
    | 'split'
    | 'badge'
    | 'monoline';

interface LettermarkProps {
    brand: BrandIdentity;
    className?: string;
    variant?: LettermarkVariant;
    colors?: { primary: string; accent?: string; bg?: string };
}

/**
 * Deterministic PRNG
 */
function seededRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

/**
 * Professional Lettermark Component
 * Creates styled initial-based logos that look designed, not generic.
 */
export const Lettermark = ({ brand, className = '', variant = 'geometric', colors: customColors }: LettermarkProps) => {
    const initial = brand.name.charAt(0).toUpperCase();
    const colors = customColors || brand.theme.tokens.light;
    const seed = brand.id + (brand.generationSeed || 0);
    const uniqueId = `lm-${seed.slice(0, 8)}`;

    // Parametric variations based on seed
    const rotation = Math.floor(seededRandom(seed + 'rot') * 12) - 6;
    const cornerRadius = 8 + Math.floor(seededRandom(seed + 'rad') * 16);
    const hasAccent = seededRandom(seed + 'acc') > 0.5;
    const accentPosition = seededRandom(seed + 'apos') > 0.5 ? 'top-right' : 'bottom-left';

    // Container shapes
    const containers = ['rounded-rect', 'circle', 'squircle', 'hexagon'] as const;
    const containerType = containers[Math.floor(seededRandom(seed + 'cont') * containers.length)];

    // Get font family from brand (use brand font if available)
    const fontFamily = brand.font?.heading || 'system-ui, -apple-system, sans-serif';

    // Render container path
    const renderContainer = (fill: string = colors.primary) => {
        switch (containerType) {
            case 'circle':
                return <circle cx="50" cy="50" r="45" fill={fill} />;
            case 'hexagon':
                return <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" fill={fill} />;
            case 'squircle':
                return <rect x="5" y="5" width="90" height="90" rx="20" fill={fill} />;
            default:
                return <rect x="5" y="5" width="90" height="90" rx={cornerRadius} fill={fill} />;
        }
    };

    // Render container stroke (for outline variant)
    const renderContainerStroke = (stroke: string = colors.primary) => {
        switch (containerType) {
            case 'circle':
                return <circle cx="50" cy="50" r="43" fill="none" stroke={stroke} strokeWidth="4" />;
            case 'hexagon':
                return <polygon points="50,8 92,28.5 92,71.5 50,92 8,71.5 8,28.5" fill="none" stroke={stroke} strokeWidth="4" />;
            case 'squircle':
                return <rect x="7" y="7" width="86" height="86" rx="18" fill="none" stroke={stroke} strokeWidth="4" />;
            default:
                return <rect x="7" y="7" width="86" height="86" rx={cornerRadius - 2} fill="none" stroke={stroke} strokeWidth="4" />;
        }
    };

    // ==================== VARIANT: GEOMETRIC ====================
    if (variant === 'geometric') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <g transform={`rotate(${rotation} 50 50)`}>
                    {renderContainer()}
                </g>
                <text
                    x="50" y="67" fontSize="52" fontWeight="800"
                    textAnchor="middle" fill="white"
                    fontFamily={fontFamily}
                    style={{ letterSpacing: '-0.02em' }}
                >
                    {initial}
                </text>
                {hasAccent && accentPosition === 'top-right' && (
                    <circle cx="78" cy="22" r="6" fill={colors.accent || 'white'} opacity="0.9" />
                )}
                {hasAccent && accentPosition === 'bottom-left' && (
                    <rect x="18" y="74" width="12" height="4" rx="2" fill={colors.accent || 'white'} opacity="0.9" />
                )}
            </svg>
        );
    }

    // ==================== VARIANT: MODERN (Cutout) ====================
    if (variant === 'modern') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id={`mask-${uniqueId}`}>
                        <rect width="100" height="100" fill="white" />
                        <text x="50" y="68" fontSize="56" fontWeight="900" textAnchor="middle" fill="black" fontFamily={fontFamily}>
                            {initial}
                        </text>
                    </mask>
                </defs>
                <g transform={`rotate(${rotation} 50 50)`}>
                    {renderContainer()}
                </g>
                <rect x="5" y="5" width="90" height="90" rx={cornerRadius} fill={colors.primary} mask={`url(#mask-${uniqueId})`} />
            </svg>
        );
    }

    // ==================== VARIANT: BOLD ====================
    if (variant === 'bold') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id={`shadow-${uniqueId}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.25" />
                    </filter>
                </defs>
                <g filter={`url(#shadow-${uniqueId})`}>
                    {renderContainer()}
                </g>
                <text x="50" y="70" fontSize="60" fontWeight="900" textAnchor="middle" fill="white" fontFamily={fontFamily} style={{ letterSpacing: '-0.03em' }}>
                    {initial}
                </text>
            </svg>
        );
    }

    // ==================== VARIANT: MINIMAL ====================
    if (variant === 'minimal') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <text x="50" y="72" fontSize="80" fontWeight="800" textAnchor="middle" fill={colors.primary} fontFamily={fontFamily} style={{ letterSpacing: '-0.04em' }}>
                    {initial}
                </text>
                <rect x="20" y="82" width="60" height="6" rx="3" fill={colors.accent || colors.primary} opacity="0.8" />
            </svg>
        );
    }

    // ==================== VARIANT: TECH ====================
    if (variant === 'tech') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="5" width="90" height="90" rx="4" fill={colors.primary} />
                <line x1="5" y1="30" x2="95" y2="30" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <line x1="5" y1="70" x2="95" y2="70" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <line x1="30" y1="5" x2="30" y2="95" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <line x1="70" y1="5" x2="70" y2="95" stroke="white" strokeWidth="0.5" opacity="0.2" />
                <text x="50" y="68" fontSize="54" fontWeight="700" textAnchor="middle" fill="white" fontFamily="monospace">
                    {initial}
                </text>
                <rect x="8" y="8" width="8" height="2" fill="white" opacity="0.6" />
                <rect x="8" y="8" width="2" height="8" fill="white" opacity="0.6" />
                <rect x="84" y="90" width="8" height="2" fill="white" opacity="0.6" />
                <rect x="90" y="84" width="2" height="8" fill="white" opacity="0.6" />
            </svg>
        );
    }

    // ==================== VARIANT: GRADIENT ====================
    if (variant === 'gradient') {
        const gradientAngle = Math.floor(seededRandom(seed + 'gangle') * 4) * 90; // 0, 90, 180, 270
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id={`grad-${uniqueId}`} gradientTransform={`rotate(${gradientAngle})`}>
                        <stop offset="0%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor={colors.accent || colors.primary} />
                    </linearGradient>
                </defs>
                <g transform={`rotate(${rotation} 50 50)`}>
                    {renderContainer(`url(#grad-${uniqueId})`)}
                </g>
                <text x="50" y="67" fontSize="52" fontWeight="800" textAnchor="middle" fill="white" fontFamily={fontFamily} style={{ letterSpacing: '-0.02em' }}>
                    {initial}
                </text>
            </svg>
        );
    }

    // ==================== VARIANT: OUTLINE ====================
    if (variant === 'outline') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <g transform={`rotate(${rotation} 50 50)`}>
                    {renderContainerStroke()}
                </g>
                <text x="50" y="68" fontSize="52" fontWeight="800" textAnchor="middle" fill={colors.primary} fontFamily={fontFamily} style={{ letterSpacing: '-0.02em' }}>
                    {initial}
                </text>
            </svg>
        );
    }

    // ==================== VARIANT: SPLIT ====================
    if (variant === 'split') {
        const splitOffset = 3;
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <clipPath id={`clip-top-${uniqueId}`}>
                        <rect x="0" y="0" width="100" height="50" />
                    </clipPath>
                    <clipPath id={`clip-bottom-${uniqueId}`}>
                        <rect x="0" y="50" width="100" height="50" />
                    </clipPath>
                </defs>
                {/* Top half - shifted left */}
                <g clipPath={`url(#clip-top-${uniqueId})`} transform={`translate(${-splitOffset}, 0)`}>
                    {renderContainer()}
                    <text x="50" y="67" fontSize="52" fontWeight="800" textAnchor="middle" fill="white" fontFamily={fontFamily}>
                        {initial}
                    </text>
                </g>
                {/* Bottom half - shifted right */}
                <g clipPath={`url(#clip-bottom-${uniqueId})`} transform={`translate(${splitOffset}, 0)`}>
                    {renderContainer(colors.accent || colors.primary)}
                    <text x="50" y="67" fontSize="52" fontWeight="800" textAnchor="middle" fill="white" fontFamily={fontFamily}>
                        {initial}
                    </text>
                </g>
            </svg>
        );
    }

    // ==================== VARIANT: BADGE ====================
    if (variant === 'badge') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                {/* Outer circle */}
                <circle cx="50" cy="50" r="46" fill="none" stroke={colors.primary} strokeWidth="3" />
                {/* Inner fill */}
                <circle cx="50" cy="50" r="38" fill={colors.primary} />
                {/* Letter */}
                <text x="50" y="64" fontSize="40" fontWeight="800" textAnchor="middle" fill="white" fontFamily={fontFamily}>
                    {initial}
                </text>
                {/* Badge text arc (brand name) */}
                <defs>
                    <path id={`arc-${uniqueId}`} d="M 15,50 A 35,35 0 0,1 85,50" fill="none" />
                </defs>
                <text fontSize="6" fontWeight="600" fill={colors.primary} fontFamily={fontFamily}>
                    <textPath href={`#arc-${uniqueId}`} startOffset="50%" textAnchor="middle">
                        {brand.name.toUpperCase()}
                    </textPath>
                </text>
            </svg>
        );
    }

    // ==================== VARIANT: MONOLINE ====================
    if (variant === 'monoline') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="42" fill="none" stroke={colors.primary} strokeWidth="2" />
                <text
                    x="50" y="66" fontSize="44" fontWeight="400" textAnchor="middle"
                    fill="none" stroke={colors.primary} strokeWidth="2"
                    fontFamily={fontFamily}
                    style={{ letterSpacing: '-0.02em' }}
                >
                    {initial}
                </text>
            </svg>
        );
    }

    // Default fallback
    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="10" width="80" height="80" rx="16" fill={colors.primary} />
            <text x="50" y="65" fontSize="48" fontWeight="bold" textAnchor="middle" fill="white" fontFamily={fontFamily}>
                {initial}
            </text>
        </svg>
    );
};

/**
 * Auto-select variant based on vibe with more variety
 */
export const AutoLettermark = ({ brand, className, colors }: { brand: BrandIdentity; className?: string; colors?: { primary: string; accent?: string; bg?: string } }) => {
    const seed = brand.id + (brand.generationSeed || 0);
    const variantRoll = seededRandom(seed + 'variant');

    // Vibe-based variant pools
    const vibeVariants: Record<string, LettermarkVariant[]> = {
        minimalist: ['minimal', 'outline', 'monoline'],
        tech: ['tech', 'gradient', 'modern'],
        bold: ['bold', 'split', 'gradient'],
        nature: ['geometric', 'badge', 'outline'],
        modern: ['modern', 'gradient', 'split'],
    };

    const pool = vibeVariants[brand.vibe] || ['geometric', 'modern', 'bold'];
    const variant = pool[Math.floor(variantRoll * pool.length)];

    return <Lettermark brand={brand} className={className} variant={variant} colors={colors} />;
};
