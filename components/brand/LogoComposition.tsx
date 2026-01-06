import React, { useId } from 'react';
import { BrandIdentity } from '@/lib/data';
import { SHAPES, Shape, getRandomShape } from '@/lib/shapes';

interface LogoCompositionProps {
    brand: BrandIdentity;
    className?: string;
    layout?: 'default' | 'swiss' | 'bauhaus' | 'minimal_grid' | 'organic_fluid' | 'generative';
}

/**
 * Deterministic PRNG based on string seed
 */
function seededRandom(seed: string) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        const char = seed.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
}

/**
 * Logo Composition Engine v2
 * Replaces simple MonogramMark with algorithmic synthesis.
 */
export const LogoComposition = ({ brand, className, layout = 'generative' }: LogoCompositionProps) => {
    const uniqueId = useId();
    const seed = brand.id + (brand.name || 'brand');
    const rng = () => seededRandom(seed + uniqueId);

    // Deterministic Shape Selection based on brand ID
    const shapeIndex1 = Math.floor(seededRandom(seed + 's1') * SHAPES.length);
    const shapeIndex2 = Math.floor(seededRandom(seed + 's2') * SHAPES.length);

    // Safety check for SHAPES being populated
    const safeShapes = SHAPES.length > 0 ? SHAPES : [{ id: 'fallback', path: 'M0 0h100v100H0z', name: 'Fallback', viewBox: '0 0 100 100', tags: [], complexity: 'simple' }];

    const primaryShape = brand.shape || safeShapes[shapeIndex1 % safeShapes.length];
    const secondaryShape = safeShapes[shapeIndex2 % safeShapes.length];

    const colors = brand.theme.tokens.light;
    const initial = brand.name.charAt(0).toUpperCase();

    // -------------------------------------------------------------------------
    // RENDER STRATEGIES
    // -------------------------------------------------------------------------

    // 1. SWISS: Large asymmetrical shape, small tight typography
    if (layout === 'swiss') {
        const scale = 0.8;
        const offsetX = (seededRandom(seed + 'x') - 0.5) * 20;
        const offsetY = (seededRandom(seed + 'y') - 0.5) * 20;

        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <mask id={`mask-swiss-${uniqueId}`}>
                        <rect x="0" y="0" width="100" height="100" fill="white" />
                        <text x="50" y="65" fontSize="40" fontWeight="900" textAnchor="middle" fill="black" fontFamily="var(--font-heading)">
                            {initial}
                        </text>
                    </mask>
                </defs>

                {/* Asymmetrical Background Shape */}
                <g transform={`translate(${50 + offsetX}, ${50 + offsetY}) scale(${scale}) translate(-12, -12)`}>
                    <path d={primaryShape.path} fill={colors.primary} />
                </g>

                {/* Overlay Text */}
                <text x="5" y="90" fontSize="12" fontWeight="bold" fill={colors.text} opacity="0.5" fontFamily="var(--font-body)">
                    {brand.name.substring(0, 3).toUpperCase()}.
                </text>
            </svg>
        );
    }

    // 2. BAUHAUS: Geometric primitives interaction
    if (layout === 'bauhaus') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" fill={colors.bg} />

                {/* Secondary Shape (Accent) */}
                <g transform="translate(20, 20) scale(1.5)" opacity="0.3">
                    <path d={secondaryShape.path} fill={colors.accent || colors.primary} />
                </g>

                {/* Primary Shape (Main) */}
                <g transform="translate(10, 10) scale(3)">
                    <path d={primaryShape.path} fill={colors.primary} style={{ mixBlendMode: 'multiply' }} />
                </g>

                {/* Type */}
                <text x="50" y="60" fontSize="50" fontWeight="bold" textAnchor="middle" fill={colors.text}>
                    {initial}
                </text>
            </svg>
        );
    }

    // 3. GENERATIVE (The Default "God Mode")
    // Algorithmic decision tree based on Vibe + Random Seed

    // DECISION: Layout Mode
    const layoutModeRoll = seededRandom(seed + 'layout');
    let genLayout = 'stacked';
    if (layoutModeRoll > 0.7) genLayout = 'radial';
    else if (layoutModeRoll > 0.4) genLayout = 'intersect';

    // DECISION: Texture/Fill
    const textureRoll = seededRandom(seed + 'tex');
    const isOutlined = textureRoll > 0.7;

    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            {/* --- RADIATING LAYOUT --- */}
            {genLayout === 'radial' && (
                <g transform="translate(50,50)">
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <g key={i} transform={`rotate(${angle}) translate(0, -20) scale(0.8)`}>
                            <path
                                d={primaryShape.path}
                                fill={isOutlined ? 'none' : colors.primary}
                                stroke={colors.primary}
                                strokeWidth={isOutlined ? 1.5 : 0}
                                opacity={0.8}
                            />
                        </g>
                    ))}
                    <circle r="15" fill={colors.bg} />
                    <text x="0" y="5" fontSize="14" fontWeight="bold" textAnchor="middle" fill={colors.text}>
                        {initial}
                    </text>
                </g>
            )}

            {/* --- INTERSECT LAYOUT --- */}
            {genLayout === 'intersect' && (
                <>
                    <g transform="translate(15, 15) scale(2.8)" opacity="0.6">
                        <path d={secondaryShape.path} fill={colors.accent || colors.primary} />
                    </g>
                    <g transform="translate(25, 25) scale(2)" style={{ mixBlendMode: 'multiply' }}>
                        <path d={primaryShape.path} fill={colors.primary} />
                    </g>
                    <text x="50" y="62" fontSize="32" fontWeight="bold" textAnchor="middle" fill="white">
                        {initial}
                    </text>
                </>
            )}

            {/* --- STACKED (Standard but Polished) --- */}
            {genLayout === 'stacked' && (
                <>
                    <defs>
                        <mask id={`mask-stacked-${uniqueId}`}>
                            <rect width="100" height="100" fill="white" />
                            <text x="50" y="65" fontSize="48" fontWeight="bold" textAnchor="middle" fill="black">
                                {initial}
                            </text>
                        </mask>
                    </defs>

                    {/* Background Shape */}
                    <g transform="translate(10, 10) scale(3.2)">
                        <path d={primaryShape.path} fill={colors.primary} mask={`url(#mask-stacked-${uniqueId})`} />
                    </g>

                    {/* Inner Accent */}
                    <g transform="translate(35, 35) scale(1.2)">
                        <path d={secondaryShape.path} fill={colors.accent || colors.primary} opacity="0.3" />
                    </g>
                </>
            )}
        </svg>
    );
};
