import React from 'react';
import { BrandIdentity } from '@/lib/data';

// Pure SVG implementation for export compatibility
export function MonogramMark({ brand, color, bg }: { brand: BrandIdentity, color: string, bg: string }) {
    const letter = brand.name.charAt(0).toUpperCase();
    const vibe = brand.vibe.toLowerCase();

    // Ensure unique ID for masks/filters
    const uniqueId = React.useId();
    const maskId = `mask-${uniqueId}`;

    // Determine logo style
    const getLogoStyle = () => {
        if (vibe.includes('minimal') || vibe.includes('clean')) return 'knockout';
        if (vibe.includes('tech') || vibe.includes('modern')) return 'contained';
        if (vibe.includes('bold') || vibe.includes('playful')) return 'stacked';
        if (vibe.includes('luxury') || vibe.includes('premium')) return 'icon-badge';
        return 'contained';
    };
    const style = getLogoStyle();

    // Common Text Props
    const fontStack = 'var(--font-manrope), sans-serif';

    // WRAPPER: All return a responsive SVG with viewBox="0 0 100 100"

    // Style 1: CONTAINED (Shape filled, Letter overlay)
    if (style === 'contained') {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Background Shape - Scaled to fit */}
                <g transform="translate(10, 10) scale(3.33)">
                    <path d={brand.shape.path} fill={color} />
                </g>
                {/* Text Centered */}
                <text
                    x="50"
                    y="50"
                    dy=".35em"
                    textAnchor="middle"
                    fill={bg}
                    fontSize="45"
                    fontFamily={fontStack}
                    fontWeight="800"
                >
                    {letter}
                </text>
            </svg>
        );
    }

    // Style 2: KNOCKOUT (Shape filled, Letter cut out)
    if (style === 'knockout') {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <defs>
                    <mask id={maskId}>
                        <rect width="100" height="100" fill="white" />
                        <text
                            x="50"
                            y="60"
                            textAnchor="middle"
                            fontSize="50"
                            fontFamily={fontStack}
                            fontWeight="bold"
                            fill="black"
                        >
                            {letter}
                        </text>
                    </mask>
                </defs>
                <g transform="translate(10, 10) scale(3.33)" mask={`url(#${maskId})`}>
                    <path d={brand.shape.path} fill={color} />
                </g>
            </svg>
        );
    }

    // Style 3: STACKED (Icon Top, Name Bottom)
    if (style === 'stacked') {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Icon Top */}
                <g transform="translate(25, 10) scale(2.0)">
                    <path d={brand.shape.path} fill={color} />
                </g>
                {/* Text Bottom */}
                <text
                    x="50"
                    y="85"
                    textAnchor="middle"
                    fill={color}
                    fontSize="22"
                    fontFamily={fontStack}
                    fontWeight="900"
                    letterSpacing="1"
                >
                    {brand.name.slice(0, 3).toUpperCase()}
                </text>
            </svg>
        );
    }

    // Style 4: ICON-BADGE (Shape with circle badge)
    if (style === 'icon-badge') {
        return (
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Main Shape */}
                <g transform="translate(15, 15) scale(2.9)">
                    <path d={brand.shape.path} fill={color} opacity="0.9" />
                </g>
                {/* Circle Badge */}
                <circle cx="75" cy="75" r="20" fill={bg} stroke={color} strokeWidth="2" />
                <text
                    x="75"
                    y="75"
                    dy=".35em"
                    textAnchor="middle"
                    fill={color}
                    fontSize="24"
                    fontFamily={fontStack}
                    fontWeight="bold"
                >
                    {letter}
                </text>
            </svg>
        );
    }

    // Fallback
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <g transform="translate(10, 10) scale(3.33)">
                <path d={brand.shape.path} fill={color} />
            </g>
        </svg>
    );
}
