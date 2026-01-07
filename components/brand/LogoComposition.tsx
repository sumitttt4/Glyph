import React, { useId } from 'react';
import { BrandIdentity } from '@/lib/data';
import { SHAPES, Shape, getRandomShape } from '@/lib/shapes';
import { AutoLettermark } from './Lettermark';
import LogoEngine from './LogoEngine';
import LogoAssembler from './LogoAssembler';

interface LogoCompositionProps {
    brand: BrandIdentity;
    className?: string;
    layout?: 'default' | 'swiss' | 'bauhaus' | 'minimal_grid' | 'organic_fluid' | 'generative' | 'cut';
    overrideColors?: { primary: string; accent?: string; bg?: string };
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
export const LogoComposition = ({ brand, className, layout = 'generative', overrideColors }: LogoCompositionProps) => {
    const uniqueId = useId();
    // Include generationSeed for unique variations per generation
    // IMPORTANT: Use stable fallback (not Date.now()) to ensure consistent logos across all instances
    const seed = brand.id + (brand.name || 'brand') + (brand.generationSeed || brand.id || 'stable');
    const rng = () => seededRandom(seed);

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
                    <g transform="translate(40, 40) scale(1.5)">
                        <path d={primaryShape.path} fill={colors.primary} />
                    </g>
                    <g transform="translate(60, 60) scale(1.8)">
                        <path d={secondaryShape.path} fill={colors.accent || colors.primary} />
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

    // CREATIVE COMPOSITIONS - Multiple layout styles for variety
    if (layout === 'generative') {
        // Decide composition style based on seed (each variation will be different)
        const layoutRoll = seededRandom(seed + 'comp');
        const textureRoll = seededRandom(seed + 'tex');
        const isOutlined = textureRoll > 0.65;

        // 4 composition styles: radial, grid, cluster, container
        let compositionStyle: 'radial' | 'grid' | 'cluster' | 'container';
        if (layoutRoll > 0.75) compositionStyle = 'radial';
        else if (layoutRoll > 0.5) compositionStyle = 'grid';
        else if (layoutRoll > 0.25) compositionStyle = 'cluster';
        else compositionStyle = 'container';

        const primaryColor = overrideColors?.primary || colors.primary;

        // RADIAL: Shapes arranged in a circle (like the droplet pattern you showed)
        if (compositionStyle === 'radial') {
            const numItems = 5 + Math.floor(seededRandom(seed + 'radialN') * 3); // 5-7 items
            const radius = 28;
            const itemScale = primaryScale * 0.35;

            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(50, 50)">
                        {Array.from({ length: numItems }).map((_, i) => {
                            const angle = (360 / numItems) * i - 90;
                            const rad = angle * (Math.PI / 180);
                            const x = Math.cos(rad) * radius;
                            const y = Math.sin(rad) * radius;
                            return (
                                <g key={i} transform={`translate(${x}, ${y}) rotate(${angle + 90}) scale(${itemScale})`}>
                                    <path
                                        d={primaryShape.path}
                                        fill={isOutlined ? 'none' : primaryColor}
                                        stroke={isOutlined ? primaryColor : 'none'}
                                        strokeWidth={isOutlined ? 2 : 0}
                                    />
                                </g>
                            );
                        })}
                    </g>
                </svg>
            );
        }

        // GRID: Pixel-like grid pattern (like the squircle with squares)
        if (compositionStyle === 'grid') {
            const gridSize = 3;
            const cellSize = 22;
            const gap = 4;
            const startX = 50 - ((gridSize * cellSize + (gridSize - 1) * gap) / 2);
            const startY = 50 - ((gridSize * cellSize + (gridSize - 1) * gap) / 2);

            // Create rounded container
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    {/* Container background */}
                    <rect x="10" y="10" width="80" height="80" rx="16" fill={primaryColor} />
                    {/* Grid cells */}
                    {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                        const row = Math.floor(i / gridSize);
                        const col = i % gridSize;
                        const show = seededRandom(seed + `cell${i}`) > 0.35;
                        if (!show) return null;
                        return (
                            <rect
                                key={i}
                                x={startX + col * (cellSize + gap)}
                                y={startY + row * (cellSize + gap)}
                                width={cellSize}
                                height={cellSize}
                                rx="4"
                                fill="white"
                                opacity={0.9}
                            />
                        );
                    })}
                </svg>
            );
        }

        // CLUSTER: Grouped shapes in organic arrangement (like hexagon cluster)
        if (compositionStyle === 'cluster') {
            const positions = [
                { x: 50, y: 35, scale: 1 },
                { x: 35, y: 55, scale: 0.85 },
                { x: 65, y: 55, scale: 0.85 },
                { x: 42, y: 70, scale: 0.7 },
                { x: 58, y: 70, scale: 0.7 },
            ];
            const baseScale = primaryScale * 0.4;

            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    {positions.map((pos, i) => (
                        <g key={i} transform={`translate(${pos.x - 12 * baseScale * pos.scale}, ${pos.y - 12 * baseScale * pos.scale}) scale(${baseScale * pos.scale})`}>
                            <path
                                d={primaryShape.path}
                                fill={isOutlined ? 'none' : primaryColor}
                                stroke={isOutlined ? primaryColor : 'none'}
                                strokeWidth={isOutlined ? 2.5 : 0}
                                opacity={0.85 + i * 0.03}
                            />
                        </g>
                    ))}
                </svg>
            );
        }

        // CONTAINER: Shape inside a squircle container (clean app-icon style)
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                {/* Squircle container */}
                <rect x="10" y="10" width="80" height="80" rx="18" fill={primaryColor} />
                {/* Centered shape */}
                <g transform={`translate(${50 - primaryScale * 10}, ${50 - primaryScale * 10}) scale(${primaryScale * 0.85})`}>
                    <path d={primaryShape.path} fill="white" />
                </g>
            </svg>
        );
    }

    // Legacy fallback - also uses premium single-shape layouts only
    const layoutModeRoll = seededRandom(seed + 'layout');
    let genLayout = 'single';
    if (layoutModeRoll > 0.5) genLayout = 'single';
    else genLayout = 'cut';

    // DECISION: Texture/Fill
    const textureRoll = seededRandom(seed + 'tex');
    const isOutlined = textureRoll > 0.75;

    return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
            {/* --- SINGLE CLEAN SHAPE (Premium) --- */}
            {genLayout === 'single' && (
                <g transform={`translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})`}>
                    <path
                        d={primaryShape.path}
                        fill={isOutlined ? 'none' : colors.primary}
                        stroke={isOutlined ? colors.primary : 'none'}
                        strokeWidth={isOutlined ? 1.5 : 0}
                    />
                </g>
            )}

            {/* --- CUT / NEGATIVE SPACE LAYOUT (Premium) --- */}
            {genLayout === 'cut' && (
                <>
                    <defs>
                        <mask id={`mask-cut-${uniqueId}`}>
                            <rect width="100" height="100" fill="white" />
                            <g transform={`translate(${50 - secondaryScale * 12}, ${50 - secondaryScale * 12}) scale(${secondaryScale})`}>
                                <path d={secondaryShape.path} fill="black" />
                            </g>
                        </mask>
                    </defs>

                    <g transform={`translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})`}>
                        <path
                            d={primaryShape.path}
                            fill={colors.primary}
                            mask={`url(#mask-cut-${uniqueId})`}
                        />
                    </g>
                </>
            )}
        </svg>
    );
};
