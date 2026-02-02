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
    | 'monoline'
    // Premium distinctive variants
    | 'deconstructed'
    | 'negative-space'
    | 'dimensional'
    | 'architectural'
    | 'asymmetric'
    | 'fusion';

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

    // ==================== PREMIUM VARIANTS ====================
    // These create distinctive, non-generic first-letter logos

    // ==================== VARIANT: DECONSTRUCTED ====================
    // Letter broken into geometric primitives and reassembled
    if (variant === 'deconstructed') {
        const offsetX = seededRandom(seed + 'dx') * 4 - 2;
        const offsetY = seededRandom(seed + 'dy') * 4 - 2;
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id={`dec-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.primary} />
                        <stop offset="100%" stopColor={colors.accent || colors.primary} />
                    </linearGradient>
                </defs>
                {/* Geometric fragments creating the letter shape */}
                <rect x="20" y="15" width="12" height="55" rx="2" fill={colors.primary} transform={`rotate(${-8 + offsetX}, 26, 42)`} />
                <rect x="68" y="15" width="12" height="55" rx="2" fill={colors.primary} transform={`rotate(${8 + offsetX}, 74, 42)`} />
                <polygon points="50,8 35,35 65,35" fill={colors.accent || colors.primary} />
                <rect x="28" y="52" width="44" height="10" rx="2" fill={colors.accent || colors.primary} opacity="0.85" />
                {/* Letter overlay for recognition */}
                <text x="50" y="70" fontSize="45" fontWeight="900" textAnchor="middle" fill={colors.primary} opacity="0.2" fontFamily={fontFamily}>
                    {initial}
                </text>
                {/* Accent dot */}
                <circle cx="85" cy="15" r="5" fill={colors.accent || colors.primary} opacity="0.7" />
            </svg>
        );
    }

    // ==================== VARIANT: NEGATIVE-SPACE ====================
    // Letter created through absence - cut from solid shape
    if (variant === 'negative-space') {
        const containerRadius = 45;
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id={`neg-mask-${uniqueId}`}>
                        <rect width="100" height="100" fill="white" />
                        <text x="50" y="70" fontSize="58" fontWeight="900" textAnchor="middle" fill="black" fontFamily={fontFamily}>
                            {initial}
                        </text>
                        {/* Strategic cut-outs for visual interest */}
                        <circle cx="82" cy="18" r="12" fill="black" />
                    </mask>
                </defs>
                {/* Main container with letter cut out */}
                <circle cx="50" cy="50" r={containerRadius} fill={colors.primary} mask={`url(#neg-mask-${uniqueId})`} />
                {/* Subtle accent ring */}
                <circle cx="50" cy="50" r={containerRadius + 3} fill="none" stroke={colors.accent || colors.primary} strokeWidth="1.5" opacity="0.3" />
            </svg>
        );
    }

    // ==================== VARIANT: DIMENSIONAL ====================
    // Multi-layered depth effect with offset planes
    if (variant === 'dimensional') {
        const layers = [
            { offset: 6, opacity: 0.25, color: colors.accent || colors.primary },
            { offset: 3, opacity: 0.5, color: colors.accent || colors.primary },
            { offset: 0, opacity: 1, color: colors.primary },
        ];
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                {layers.map((layer, idx) => (
                    <g key={idx} transform={`translate(${layer.offset}, ${layer.offset})`} opacity={layer.opacity}>
                        <text
                            x="50" y="68"
                            fontSize="60" fontWeight="900"
                            textAnchor="middle"
                            fill={layer.color}
                            fontFamily={fontFamily}
                            style={{ letterSpacing: '-0.02em' }}
                        >
                            {initial}
                        </text>
                    </g>
                ))}
                {/* Dimensional accent block */}
                <rect x="78" y="78" width="16" height="16" rx="3" fill={colors.accent || colors.primary} opacity="0.5" />
            </svg>
        );
    }

    // ==================== VARIANT: ARCHITECTURAL ====================
    // Grid-based construction with visible guides
    if (variant === 'architectural') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                {/* Construction grid */}
                {[0, 25, 50, 75, 100].map(pos => (
                    <g key={pos}>
                        <line x1={pos} y1="0" x2={pos} y2="100" stroke={colors.accent || colors.primary} strokeWidth="0.5" opacity="0.15" />
                        <line x1="0" y1={pos} x2="100" y2={pos} stroke={colors.accent || colors.primary} strokeWidth="0.5" opacity="0.15" />
                    </g>
                ))}
                {/* Center construction lines */}
                <line x1="50" y1="0" x2="50" y2="100" stroke={colors.accent || colors.primary} strokeWidth="0.5" opacity="0.3" />
                <line x1="0" y1="50" x2="100" y2="50" stroke={colors.accent || colors.primary} strokeWidth="0.5" opacity="0.3" />
                {/* The letter - constructed style */}
                <text
                    x="50" y="68"
                    fontSize="58" fontWeight="700"
                    textAnchor="middle"
                    fill={colors.primary}
                    fontFamily="monospace"
                    style={{ letterSpacing: '0' }}
                >
                    {initial}
                </text>
                {/* Dimension markers */}
                <line x1="5" y1="12" x2="5" y2="88" stroke={colors.accent || colors.primary} strokeWidth="0.75" opacity="0.4" />
                <line x1="3" y1="12" x2="7" y2="12" stroke={colors.accent || colors.primary} strokeWidth="0.75" opacity="0.4" />
                <line x1="3" y1="88" x2="7" y2="88" stroke={colors.accent || colors.primary} strokeWidth="0.75" opacity="0.4" />
                {/* Anchor points */}
                <circle cx="50" cy="12" r="2" fill="none" stroke={colors.accent || colors.primary} strokeWidth="0.75" />
                <circle cx="50" cy="88" r="2" fill="none" stroke={colors.accent || colors.primary} strokeWidth="0.75" />
            </svg>
        );
    }

    // ==================== VARIANT: ASYMMETRIC ====================
    // Off-center, dynamic composition with energy
    if (variant === 'asymmetric') {
        const offsetX = 8 + seededRandom(seed + 'ax') * 6;
        const offsetY = -5 + seededRandom(seed + 'ay') * 4;
        const tiltAngle = (seededRandom(seed + 'tilt') - 0.5) * 10;
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                {/* Dynamic background shape */}
                <rect
                    x="60" y="8"
                    width="35" height="35"
                    rx="5"
                    fill={colors.accent || colors.primary}
                    opacity="0.12"
                    transform={`rotate(${tiltAngle * 1.5}, 77, 25)`}
                />
                {/* Off-center letter */}
                <text
                    x={50 + offsetX} y={68 + offsetY}
                    fontSize="62" fontWeight="900"
                    textAnchor="middle"
                    fill={colors.primary}
                    fontFamily={fontFamily}
                    style={{ letterSpacing: '-0.03em' }}
                    transform={`rotate(${tiltAngle}, ${50 + offsetX}, ${50 + offsetY})`}
                >
                    {initial}
                </text>
                {/* Dynamic accents */}
                <circle cx={18 - offsetX/2} cy={82} r="6" fill={colors.accent || colors.primary} opacity="0.75" />
                <line
                    x1={75 + offsetX/2} y1="78"
                    x2={92 + offsetX/2} y2="62"
                    stroke={colors.accent || colors.primary}
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        );
    }

    // ==================== VARIANT: FUSION ====================
    // Letter integrated with unique geometric mark
    if (variant === 'fusion') {
        const hasRoundChar = ['C', 'G', 'O', 'Q', 'S'].includes(initial);
        const hasDiagonalChar = ['A', 'K', 'M', 'N', 'V', 'W', 'X', 'Y', 'Z'].includes(initial);
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id={`fus-grad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={colors.accent || colors.primary} stopOpacity="0.6" />
                        <stop offset="100%" stopColor={colors.primary} stopOpacity="0.2" />
                    </linearGradient>
                </defs>
                {/* Fusion shape based on letter characteristics */}
                {hasDiagonalChar ? (
                    <>
                        <polygon points="50,8 88,78 12,78" fill="none" stroke={colors.accent || colors.primary} strokeWidth="2" opacity="0.35" />
                        <circle cx="50" cy="55" r="28" fill={`url(#fus-grad-${uniqueId})`} />
                    </>
                ) : hasRoundChar ? (
                    <>
                        <circle cx="50" cy="50" r="42" fill="none" stroke={colors.accent || colors.primary} strokeWidth="2" opacity="0.35" />
                        <circle cx="50" cy="50" r="32" fill={`url(#fus-grad-${uniqueId})`} />
                    </>
                ) : (
                    <>
                        <rect x="12" y="12" width="76" height="76" rx="10" fill="none" stroke={colors.accent || colors.primary} strokeWidth="2" opacity="0.35" />
                        <rect x="22" y="22" width="56" height="56" rx="6" fill={`url(#fus-grad-${uniqueId})`} />
                    </>
                )}
                {/* The letter */}
                <text
                    x="50" y="68"
                    fontSize="52" fontWeight="800"
                    textAnchor="middle"
                    fill={colors.primary}
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
 * Now prioritizes premium distinctive variants for better quality
 */
export const AutoLettermark = ({ brand, className, colors }: { brand: BrandIdentity; className?: string; colors?: { primary: string; accent?: string; bg?: string } }) => {
    const seed = brand.id + (brand.generationSeed || 0);
    const variantRoll = seededRandom(seed + 'variant');
    const premiumRoll = seededRandom(seed + 'premium');

    // Premium variants (distinctive, non-generic) - prioritized 60% of time
    const premiumVariants: LettermarkVariant[] = [
        'deconstructed', 'negative-space', 'dimensional',
        'architectural', 'asymmetric', 'fusion'
    ];

    // Vibe-based variant pools - now include premium options
    const vibeVariants: Record<string, LettermarkVariant[]> = {
        minimalist: ['minimal', 'outline', 'monoline', 'architectural', 'negative-space'],
        tech: ['tech', 'gradient', 'modern', 'deconstructed', 'architectural'],
        bold: ['bold', 'split', 'gradient', 'dimensional', 'asymmetric'],
        nature: ['geometric', 'badge', 'outline', 'fusion', 'dimensional'],
        modern: ['modern', 'gradient', 'split', 'deconstructed', 'asymmetric'],
    };

    // 60% chance to use a premium variant for better quality
    if (premiumRoll > 0.4) {
        const premiumVariant = premiumVariants[Math.floor(variantRoll * premiumVariants.length)];
        return <Lettermark brand={brand} className={className} variant={premiumVariant} colors={colors} />;
    }

    const pool = vibeVariants[brand.vibe] || ['geometric', 'modern', 'bold', 'fusion'];
    const variant = pool[Math.floor(variantRoll * pool.length)];

    return <Lettermark brand={brand} className={className} variant={variant} colors={colors} />;
};
