import React, { useId } from 'react';
import { BrandIdentity } from '@/lib/data';
import { SHAPES, Shape, getRandomShape } from '@/lib/shapes';

interface LogoCompositionProps {
    brand: BrandIdentity;
    className?: string;
    layout?: 'default' | 'swiss' | 'bauhaus' | 'minimal_grid' | 'organic_fluid' | 'generative' | 'cut';
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

    // VIEWBOX NORMALIZATION: Calculate scale factor to normalize shapes to 100x100 canvas
    const getShapeScale = (shape: { viewBox?: string }): number => {
        if (!shape.viewBox) return 3; // Default scale for missing viewBox
        const parts = shape.viewBox.split(' ');
        const width = parseFloat(parts[2]) || 24;
        // If viewBox is 24x24, we need scale ~3 to fill 100x100. If 100x100, scale ~1.
        return 80 / width; // 80 gives padding, so a 24-wide shape becomes scale 3.33
    };

    const primaryScale = getShapeScale(primaryShape);
    const secondaryScale = getShapeScale(secondaryShape);

    // -------------------------------------------------------------------------
    // RENDER STRATEGIES
    // -------------------------------------------------------------------------

    // 1. SWISS: Large asymmetrical shape, small tight typography
    if (layout === 'swiss') {
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
                <g transform={`translate(${50 + offsetX - primaryScale * 12}, ${50 + offsetY - primaryScale * 12}) scale(${primaryScale * 0.8})`}>
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
                <g transform={`translate(${50 - secondaryScale * 8}, ${50 - secondaryScale * 8}) scale(${secondaryScale * 0.6})`} opacity="0.3">
                    <path d={secondaryShape.path} fill={colors.accent || colors.primary} />
                </g>

                {/* Primary Shape (Main) */}
                <g transform={`translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})`}>
                    <path d={primaryShape.path} fill={colors.primary} style={{ mixBlendMode: 'multiply' }} />
                </g>

                {/* Type */}
                <text x="50" y="60" fontSize="50" fontWeight="bold" textAnchor="middle" fill={colors.text}>
                    {initial}
                </text>
            </svg>
        );
    }

    // 3. MINIMAL GRID: Data-driven, structured, technical
    if (layout === 'minimal_grid') {
        const gridSize = 3;
        const cellSize = 100 / gridSize;
        const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        // Select random cells to fill based on seed (density 5/9)
        const activeCells = positions.filter((p) => seededRandom(seed + p) > 0.4);

        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                {activeCells.map((pos) => {
                    const row = Math.floor(pos / gridSize);
                    const col = pos % gridSize;
                    return (
                        <g key={pos} transform={`translate(${col * cellSize + 10}, ${row * cellSize + 10}) scale(0.6)`}>
                            <path d={primaryShape.path} fill={colors.primary} opacity={row === 1 && col === 1 ? 1 : 0.4} />
                        </g>
                    );
                })}
            </svg>
        );
    }

    // 4. ORGANIC FLUID: Soft, blurred, blending
    if (layout === 'organic_fluid') {
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id={`blur-${uniqueId}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
                    </filter>
                </defs>
                <g filter={`url(#blur-${uniqueId})`} style={{ isolation: 'isolate' }}>
                    <circle cx="40" cy="40" r="25" fill={colors.primary} />
                    <circle cx="60" cy="60" r="30" fill={colors.accent || colors.primary} />
                    <g transform="translate(50, 50) scale(1.5)">
                        <path d={primaryShape.path} fill={colors.primary} />
                    </g>
                </g>
                {/* Sharp Overlay to retaining legibility */}
                <g transform="translate(50, 50) scale(1) translate(-12, -12)">
                    <path d={primaryShape.path} fill="white" opacity="0.9" />
                </g>
            </svg>
        );
    }
    // Algorithmic decision tree based on Vibe + Random Seed

    // DECISION: Layout Mode
    const layoutModeRoll = seededRandom(seed + 'layout');
    let genLayout = 'stacked';
    if (layoutModeRoll > 0.8) genLayout = 'radial';
    else if (layoutModeRoll > 0.5) genLayout = 'intersect';
    else if (layoutModeRoll > 0.2) genLayout = 'cut'; // New "High Quality Cut" mode

    // DECISION: Texture/Fill
    const textureRoll = seededRandom(seed + 'tex');
    const isOutlined = textureRoll > 0.7;

    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            {/* --- CUT / NEGATIVE SPACE LAYOUT (The "Less is More" Logic) --- */}
            {genLayout === 'cut' && (
                <>
                    <defs>
                        <mask id={`mask-cut-${uniqueId}`}>
                            {/* Base: White (Reveals) */}
                            <rect width="100" height="100" fill="white" />
                            {/* Cutout: Black (Hides) */}
                            <g transform={`translate(${50 - secondaryScale * 12}, ${50 - secondaryScale * 12}) scale(${secondaryScale})`}>
                                <path d={secondaryShape.path} fill="black" />
                            </g>
                        </mask>
                    </defs>

                    {/* Container Shape */}
                    <g transform={`translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})`}>
                        <path
                            d={primaryShape.path}
                            fill={colors.primary}
                            mask={`url(#mask-cut-${uniqueId})`}
                        />
                    </g>

                    {/* Optional: Letter in the cut (if shape is simple) */}
                    <text x="50" y="65" fontSize="20" fontWeight="bold" textAnchor="middle" fill={colors.text} opacity="0" className="opacity-0">
                        {initial}
                    </text>
                </>
            )}
            {/* --- RADIATING LAYOUT --- */}
            {genLayout === 'radial' && (
                <g transform="translate(50,50)">
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                        <g key={i} transform={`rotate(${angle}) translate(0, -20) scale(${primaryScale * 0.25})`}>
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
                    <g transform={`translate(${50 - secondaryScale * 10}, ${50 - secondaryScale * 10}) scale(${secondaryScale * 0.8})`} opacity="0.6">
                        <path d={secondaryShape.path} fill={colors.accent || colors.primary} />
                    </g>
                    <g transform={`translate(${50 - primaryScale * 8}, ${50 - primaryScale * 8}) scale(${primaryScale * 0.6})`} style={{ mixBlendMode: 'multiply' }}>
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
                    <g transform={`translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})`}>
                        <path d={primaryShape.path} fill={colors.primary} mask={`url(#mask-stacked-${uniqueId})`} />
                    </g>

                    {/* Inner Accent */}
                    <g transform={`translate(${50 - secondaryScale * 6}, ${50 - secondaryScale * 6}) scale(${secondaryScale * 0.4})`}>
                        <path d={secondaryShape.path} fill={colors.accent || colors.primary} opacity="0.3" />
                    </g>
                </>
            )}
        </svg>
    );
};
