'use client';

/**
 * StyleGuidePreview Component
 * 
 * Renders a professional Design System documentation preview
 * matching standard style guide formats.
 * 
 * Sections:
 * 1. Colors (Brand, Gray, State)
 * 2. Typography (Font Family, Weights, Styles)
 */

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { generateStyleGuide, StyleGuide, ColorSwatch, TypographyStyle, TypographyWeight } from '@/lib/figma-system-generator';
import { cn } from '@/lib/utils';

interface StyleGuidePreviewProps {
    brand: BrandIdentity;
    className?: string;
}

// ============================================
// COLOR SWATCH COMPONENT
// ============================================

function ColorSwatchCard({ swatch, size = 'default' }: { swatch: ColorSwatch; size?: 'default' | 'small' }) {
    const isLight = getLuminance(swatch.hex) > 0.6;

    return (
        <div className="flex flex-col">
            <div
                className={cn(
                    "rounded-lg flex items-end p-3 shadow-sm border border-stone-200/50",
                    size === 'default' ? 'w-32 h-24' : 'w-24 h-16'
                )}
                style={{ backgroundColor: swatch.hex }}
            >
                <span
                    className={cn(
                        "text-[10px] font-mono font-medium",
                        isLight ? 'text-stone-900' : 'text-white'
                    )}
                >
                    {swatch.name}
                </span>
            </div>
            <span className="text-[10px] font-mono text-stone-400 mt-1.5 pl-0.5">
                {swatch.label || swatch.hex}
            </span>
        </div>
    );
}

function getLuminance(hex: string): number {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return 0;
    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;
    return 0.299 * r + 0.587 * g + 0.114 * b;
}

// ============================================
// TYPOGRAPHY WEIGHT CARD
// ============================================

function TypographyWeightCard({ weight, fontFamily }: { weight: TypographyWeight; fontFamily: string }) {
    return (
        <div className="flex flex-col items-center justify-center p-4 border border-stone-200 rounded-lg min-w-[80px]">
            <span
                className="text-3xl text-stone-900"
                style={{
                    fontFamily: fontFamily,
                    fontWeight: weight.weight
                }}
            >
                {weight.sample}
            </span>
            <span className="text-[10px] text-stone-400 mt-1 font-medium">
                {weight.name}
            </span>
        </div>
    );
}

// ============================================
// TYPOGRAPHY STYLE ROW
// ============================================

function TypographyStyleRow({
    style,
    fontFamily,
    isHeader = false,
    primaryColor = '#1c1917'
}: {
    style: TypographyStyle;
    fontFamily: string;
    isHeader?: boolean;
    primaryColor?: string;
}) {
    if (isHeader) {
        return (
            <div
                className="grid grid-cols-5 gap-4 px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-white rounded-t-lg"
                style={{ backgroundColor: primaryColor }}
            >
                <span>Name</span>
                <span>Weight</span>
                <span>Size</span>
                <span>Line-height</span>
                <span>Sample</span>
            </div>
        );
    }

    // Calculate relative font size for display (capped for readability)
    const displaySize = Math.min(style.size, 32);

    return (
        <div className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-stone-100 items-center hover:bg-stone-50/50 transition-colors">
            <span className="text-xs text-stone-500">{style.name}</span>
            <span className="text-xs text-stone-400">{style.weight}</span>
            <span className="text-xs text-stone-400">{style.size}</span>
            <span className="text-xs text-stone-400">{style.lineHeight}</span>
            <span
                className="text-stone-900 truncate"
                style={{
                    fontFamily: fontFamily,
                    fontSize: `${displaySize}px`,
                    lineHeight: `${style.lineHeight}px`,
                    fontWeight: style.weight === 'Bold' ? 700 : style.weight === 'Medium' ? 500 : 400
                }}
            >
                {style.sample}
            </span>
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export function StyleGuidePreview({ brand, className }: StyleGuidePreviewProps) {
    const styleGuide = React.useMemo(() => generateStyleGuide(brand), [brand]);
    const primaryColor = brand.theme.tokens.light.primary;

    return (
        <div className={cn("bg-white rounded-2xl p-8 md:p-12 space-y-12", className)}>
            {/* ====================================== */}
            {/* 1. COLORS SECTION */}
            {/* ====================================== */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-stone-900">1. Colors</h2>

                {/* Brand Colors */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-stone-600">Brand colors</h3>
                    <div className="flex flex-wrap gap-4">
                        {styleGuide.colors.brand.map((swatch) => (
                            <ColorSwatchCard key={swatch.name} swatch={swatch} />
                        ))}
                    </div>
                </div>

                {/* Gray Colors */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-stone-600">Gray colors</h3>
                    <div className="flex flex-wrap gap-3">
                        {styleGuide.colors.gray.map((swatch) => (
                            <ColorSwatchCard key={swatch.name} swatch={swatch} size="small" />
                        ))}
                    </div>
                </div>

                {/* State Colors */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-stone-600">State colors</h3>
                    <div className="flex flex-wrap gap-3">
                        {styleGuide.colors.state.map((swatch) => (
                            <ColorSwatchCard key={swatch.name} swatch={swatch} size="small" />
                        ))}
                    </div>
                </div>
            </section>

            {/* ====================================== */}
            {/* 2. TYPOGRAPHY SECTION */}
            {/* ====================================== */}
            <section className="space-y-8">
                <h2 className="text-2xl font-bold text-stone-900">2. Typography</h2>

                {/* Font Family */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-stone-600">Font StyleGuide</h3>
                    <a
                        href={`https://fonts.google.com/specimen/${encodeURIComponent(styleGuide.typography.fontFamily)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm hover:underline"
                        style={{ color: primaryColor }}
                    >
                        {styleGuide.typography.fontFamily}
                    </a>
                </div>

                {/* Text Weights */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-stone-600">Text Weight</h3>
                    <div className="flex flex-wrap gap-3">
                        {styleGuide.typography.weights.map((weight) => (
                            <TypographyWeightCard
                                key={weight.name}
                                weight={weight}
                                fontFamily={styleGuide.typography.fontFamily}
                            />
                        ))}
                    </div>
                </div>

                {/* Text Styles Table */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-stone-600">Text Style</h3>
                    <div className="border border-stone-200 rounded-lg overflow-hidden">
                        {/* Header */}
                        <TypographyStyleRow
                            style={{ name: '', weight: '', size: 0, lineHeight: 0, sample: '' }}
                            fontFamily={styleGuide.typography.fontFamily}
                            isHeader
                            primaryColor={primaryColor}
                        />

                        {/* Rows */}
                        <div className="max-h-[600px] overflow-y-auto">
                            {styleGuide.typography.styles.map((style) => (
                                <TypographyStyleRow
                                    key={style.name}
                                    style={style}
                                    fontFamily={styleGuide.typography.fontFamily}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default StyleGuidePreview;
