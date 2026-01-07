"use client";

import React, { useId } from 'react';
import { motion } from 'framer-motion';
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
 * Logo Composition Engine v3 (Parametric)
 */
export const LogoComposition = ({ brand, className, layout = 'generative', overrideColors }: LogoCompositionProps) => {
    const uniqueId = useId();
    const seed = brand.id + (brand.name || 'brand') + (brand.generationSeed || brand.id || 'stable');
    const rng = () => seededRandom(seed);

    // Deterministic Shape Selection
    const shapeIndex1 = Math.floor(seededRandom(seed + 's1') * SHAPES.length);
    const shapeIndex2 = Math.floor(seededRandom(seed + 's2') * SHAPES.length);
    const safeShapes = SHAPES.length > 0 ? SHAPES : [{ id: 'fallback', path: 'M0 0h100v100H0z', name: 'Fallback', viewBox: '0 0 100 100', tags: [], complexity: 'simple' }];
    const primaryShape = brand.shape || safeShapes[shapeIndex1 % safeShapes.length];
    const secondaryShape = safeShapes[shapeIndex2 % safeShapes.length];

    const colors = brand.theme.tokens.light;
    const primaryColor = overrideColors?.primary || colors.primary;
    const initial = brand.name.charAt(0).toUpperCase();

    // VIEWBOX NORMALIZATION
    const getShapeScale = (shape: { viewBox?: string }): number => {
        if (!shape.viewBox) return 3;
        const parts = shape.viewBox.split(' ');
        const width = parseFloat(parts[2]) || 24;
        return 80 / width;
    };
    const primaryScale = getShapeScale(primaryShape);
    const secondaryScale = getShapeScale(secondaryShape);

    // -------------------------------------------------------------------------
    // ARCHETYPE FORK
    // -------------------------------------------------------------------------

    // A. WORDMARK ARCHETYPE
    if (brand.archetype === 'wordmark') {
        const isTech = brand.vibe.toLowerCase().includes('tech');
        const isLuxury = brand.vibe.toLowerCase().includes('luxury');

        let fontFamily = 'var(--font-heading)'; // Default
        let tracking = '0';
        let textTransform = 'none';
        let fontWeight = 'bold';

        if (isTech) {
            tracking = '-0.05em';
            textTransform = 'lowercase';
            fontWeight = '900';
        } else if (isLuxury) {
            tracking = '0.2em';
            textTransform = 'uppercase';
            fontWeight = '300';
        }

        return (
            <motion.svg viewBox="0 0 200 60" className={className} xmlns="http://www.w3.org/2000/svg">
                <motion.text
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    x="100"
                    y="38"
                    fontSize="24"
                    fontFamily={fontFamily}
                    fontWeight={fontWeight}
                    letterSpacing={tracking}
                    textAnchor="middle"
                    fill={primaryColor}
                    style={{ textTransform: textTransform as any }}
                >
                    {brand.name}
                </motion.text>
            </motion.svg>
        );
    }

    // B. SYMBOL ARCHETYPE (DEFAULT)
    // Force SOLID GEOMETRY (no outlines) if archetype is symbol
    const forceSolid = brand.archetype === 'symbol';


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

    // CREATIVE COMPOSITIONS - 12+ layout styles for premium variety
    if (layout === 'generative') {
        const layoutRoll = seededRandom(seed + 'comp');
        const textureRoll = seededRandom(seed + 'tex');
        const isOutlined = textureRoll > 0.6;
        const primaryColor = overrideColors?.primary || colors.primary;
        const accentColor = colors.accent || primaryColor;

        // 12 composition styles for maximum variety
        const styles = ['radial', 'grid', 'cluster', 'container', 'spiral', 'wave', 'split', 'diamond', 'corner', 'overlap', 'frame', 'monogram'] as const;
        const styleIndex = Math.floor(layoutRoll * styles.length);
        // Force 'grid' style if archetype is symbol to ensure the solid geometry construction look
        const compositionStyle = brand.archetype === 'symbol' ? 'grid' : styles[styleIndex];

        // 1. RADIAL: Shapes in a circle
        if (compositionStyle === 'radial') {
            const numItems = 5 + Math.floor(seededRandom(seed + 'radialN') * 4);
            const radius = 26;
            const itemScale = primaryScale * 0.32;

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
                                    <path d={primaryShape.path} fill={isOutlined ? 'none' : primaryColor} stroke={isOutlined ? primaryColor : 'none'} strokeWidth={2} />
                                </g>
                            );
                        })}
                    </g>
                </svg>
            );
        }

        // 2. GRID / CONSTRUCTION: Pixel-like pattern or 2x2/3x3 Grid
        if (compositionStyle === 'grid' || brand.archetype === 'symbol') { // Force this style for symbol archetype often
            // For Symbol Archetype, prefer 2x2 or 3x3 solid blocks
            const isSymbolMode = brand.archetype === 'symbol';
            const gridSize = isSymbolMode ? (seededRandom(seed + 'gridS') > 0.5 ? 2 : 3) : (2 + Math.floor(seededRandom(seed + 'gridS') * 2));
            const cellSize = 70 / gridSize;
            const startX = 50 - (gridSize * cellSize) / 2;
            const startY = 50 - (gridSize * cellSize) / 2;

            const isWhite = primaryColor.toLowerCase() === '#ffffff' || primaryColor.toLowerCase() === '#fff' || primaryColor.toLowerCase() === 'white';
            const cellFill = isWhite ? 'black' : 'white';
            // Force solid blocks for symbol mode
            const bgFill = primaryColor;

            return (
                <motion.svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    {/* Background Grid Lines (Engineering feel) */}
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} transition={{ duration: 1 }}>
                        {/* Outer Frame */}
                        <rect x={startX} y={startY} width={gridSize * cellSize} height={gridSize * cellSize} fill="none" stroke={primaryColor} strokeWidth="0.5" opacity="0.5" />

                        {/* Inner Grid Lines */}
                        {Array.from({ length: gridSize - 1 }).map((_, i) => (
                            <React.Fragment key={i}>
                                {/* Vertical */}
                                <line
                                    x1={startX + (i + 1) * cellSize} y1={startY}
                                    x2={startX + (i + 1) * cellSize} y2={startY + gridSize * cellSize}
                                    stroke={primaryColor} strokeWidth="0.25"
                                />
                                {/* Horizontal */}
                                <line
                                    x1={startX} y1={startY + (i + 1) * cellSize}
                                    x2={startX + gridSize * cellSize} y2={startY + (i + 1) * cellSize}
                                    stroke={primaryColor} strokeWidth="0.25"
                                />
                            </React.Fragment>
                        ))}
                    </motion.g>

                    <motion.rect
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        x="10" y="10" width="80" height="80" rx="16" fill={bgFill}
                    />

                    {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                        const row = Math.floor(i / gridSize);
                        const col = i % gridSize;
                        // In symbol mode, we carve OUT (negative space)
                        const isActive = seededRandom(seed + `c${i}`) < (isSymbolMode ? 0.4 : 0.4);
                        if (!isActive) return null;

                        return (
                            <motion.rect
                                key={i}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: isSymbolMode ? 1 : 0.9, scale: 1 }}
                                transition={{
                                    type: "spring",
                                    stiffness: 200,
                                    damping: 20,
                                    delay: 0.2 + (i * 0.1)
                                }}
                                x={startX + col * cellSize + 2}
                                y={startY + row * cellSize + 2}
                                width={cellSize - 4}
                                height={cellSize - 4}
                                rx={isSymbolMode ? 2 : 4}
                                fill={cellFill}
                            />
                        );
                    })}
                </motion.svg>
            );
        }

        // 3. CLUSTER: Organic grouping
        if (compositionStyle === 'cluster') {
            const positions = [
                { x: 50, y: 32, scale: 1 }, { x: 32, y: 52, scale: 0.85 }, { x: 68, y: 52, scale: 0.85 },
                { x: 40, y: 72, scale: 0.7 }, { x: 60, y: 72, scale: 0.7 }
            ];
            const baseScale = primaryScale * 0.38;

            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    {positions.map((pos, i) => (
                        <g key={i} transform={`translate(${pos.x - 12 * baseScale * pos.scale}, ${pos.y - 12 * baseScale * pos.scale}) scale(${baseScale * pos.scale})`}>
                            <path d={primaryShape.path} fill={isOutlined ? 'none' : primaryColor} stroke={isOutlined ? primaryColor : 'none'} strokeWidth={2.5} opacity={0.85 + i * 0.03} />
                        </g>
                    ))}
                </svg>
            );
        }

        // 4. CONTAINER: Shape inside squircle
        if (compositionStyle === 'container') {
            // Fix for white-on-white: If primaryColor is white (guidelines view), make inner shape black or transparent cut-out
            const isWhite = primaryColor.toLowerCase() === '#ffffff' || primaryColor.toLowerCase() === '#fff' || primaryColor.toLowerCase() === 'white';
            const innerFill = isWhite ? 'black' : 'white';

            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="80" rx="18" fill={primaryColor} />
                    <g transform={`translate(${50 - primaryScale * 10}, ${50 - primaryScale * 10}) scale(${primaryScale * 0.85})`}>
                        <path d={primaryShape.path} fill={innerFill} />
                    </g>
                </svg>
            );
        }

        // 5. SPIRAL: Shapes in spiral pattern
        if (compositionStyle === 'spiral') {
            const numItems = 6;
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(50, 50)">
                        {Array.from({ length: numItems }).map((_, i) => {
                            const angle = i * 60;
                            const radius = 10 + i * 5;
                            const scale = 0.5 + i * 0.12;
                            const x = Math.cos(angle * Math.PI / 180) * radius;
                            const y = Math.sin(angle * Math.PI / 180) * radius;
                            return (
                                <g key={i} transform={`translate(${x}, ${y}) scale(${primaryScale * 0.25 * scale})`}>
                                    <path d={primaryShape.path} fill={primaryColor} opacity={0.4 + i * 0.1} />
                                </g>
                            );
                        })}
                    </g>
                </svg>
            );
        }

        // 6. WAVE: Horizontal wave of shapes
        if (compositionStyle === 'wave') {
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    {[0, 1, 2, 3, 4].map((i) => {
                        const x = 15 + i * 18;
                        const y = 50 + Math.sin(i * 1.2) * 15;
                        const scale = 0.6 + Math.abs(Math.sin(i * 0.8)) * 0.4;
                        return (
                            <g key={i} transform={`translate(${x - 10}, ${y - 10}) scale(${primaryScale * 0.35 * scale})`}>
                                <path d={primaryShape.path} fill={primaryColor} opacity={0.7 + i * 0.06} />
                            </g>
                        );
                    })}
                </svg>
            );
        }

        // 7. SPLIT: Two complementary halves
        if (compositionStyle === 'split') {
            const isWhite = primaryColor.toLowerCase() === '#ffffff' || primaryColor.toLowerCase() === '#fff' || primaryColor.toLowerCase() === 'white';
            const innerFill = isWhite ? 'black' : 'white';
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="80" rx="16" fill={primaryColor} />
                    <g transform={`translate(25, 35) scale(${primaryScale * 0.55})`}>
                        <path d={primaryShape.path} fill={innerFill} />
                    </g>
                    <g transform={`translate(55, 45) scale(${primaryScale * 0.55}) rotate(180)`}>
                        <path d={primaryShape.path} fill={innerFill} opacity="0.5" />
                    </g>
                </svg>
            );
        }

        // 8. DIAMOND: Rotated container
        if (compositionStyle === 'diamond') {
            const isWhite = primaryColor.toLowerCase() === '#ffffff' || primaryColor.toLowerCase() === '#fff' || primaryColor.toLowerCase() === 'white';
            const innerFill = isWhite ? 'black' : 'white';
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <g transform="translate(50, 50) rotate(45)">
                        <rect x="-30" y="-30" width="60" height="60" rx="10" fill={primaryColor} />
                    </g>
                    <g transform={`translate(${50 - primaryScale * 8}, ${50 - primaryScale * 8}) scale(${primaryScale * 0.7})`}>
                        <path d={primaryShape.path} fill={innerFill} />
                    </g>
                </svg>
            );
        }

        // 9. CORNER: Shape in corner accent
        if (compositionStyle === 'corner') {
            const isWhite = primaryColor.toLowerCase() === '#ffffff' || primaryColor.toLowerCase() === '#fff' || primaryColor.toLowerCase() === 'white';
            const innerFill = isWhite ? 'black' : 'white';
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="80" rx="16" fill={primaryColor} />
                    <g transform={`translate(22, 22) scale(${primaryScale * 0.9})`}>
                        <path d={primaryShape.path} fill={innerFill} />
                    </g>
                    <g transform={`translate(60, 60) scale(${primaryScale * 0.4})`}>
                        <path d={primaryShape.path} fill={innerFill} opacity="0.3" />
                    </g>
                </svg>
            );
        }

        // 10. OVERLAP: Layered shapes
        if (compositionStyle === 'overlap') {
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <g transform={`translate(30, 30) scale(${primaryScale * 0.8})`}>
                        <path d={primaryShape.path} fill={primaryColor} opacity="0.4" />
                    </g>
                    <g transform={`translate(40, 40) scale(${primaryScale * 0.8})`}>
                        <path d={primaryShape.path} fill={primaryColor} opacity="0.7" />
                    </g>
                    <g transform={`translate(50, 50) scale(${primaryScale * 0.8})`}>
                        <path d={primaryShape.path} fill={primaryColor} />
                    </g>
                </svg>
            );
        }

        // 11. FRAME: Shape with outline frame
        if (compositionStyle === 'frame') {
            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="12" y="12" width="76" height="76" rx="14" fill="none" stroke={primaryColor} strokeWidth="3" />
                    <g transform={`translate(${50 - primaryScale * 10}, ${50 - primaryScale * 10}) scale(${primaryScale * 0.85})`}>
                        <path d={primaryShape.path} fill={primaryColor} />
                    </g>
                </svg>
            );
        }

        // 12. MONOGRAM: Letter + Shape combo
        if (compositionStyle === 'monogram') {
            const isWhite = primaryColor.toLowerCase() === '#ffffff' || primaryColor.toLowerCase() === '#fff' || primaryColor.toLowerCase() === 'white';
            const contentFill = isWhite ? 'black' : 'white';

            return (
                <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                    <rect x="10" y="10" width="80" height="80" rx="18" fill={primaryColor} />
                    <text x="50" y="62" fontSize="40" fontWeight="bold" textAnchor="middle" fill={contentFill} fontFamily="system-ui">{initial}</text>
                    <g transform={`translate(65, 22) scale(${primaryScale * 0.35})`}>
                        <path d={primaryShape.path} fill={contentFill} opacity="0.8" />
                    </g>
                </svg>
            );
        }

        // Default fallback
        return (
            <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
                <g transform={`translate(${50 - primaryScale * 12}, ${50 - primaryScale * 12}) scale(${primaryScale})`}>
                    <path d={primaryShape.path} fill={primaryColor} />
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
