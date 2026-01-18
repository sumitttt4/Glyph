/**
 * SVG Logo Renderer Component
 * 
 * React component for rendering generated logos with various display options
 */

"use client";

import React, { useRef, useCallback, useId } from 'react';
import { GeneratedLogo } from '../types';

// ============================================
// LOGO PREVIEW COMPONENT
// ============================================

interface LogoPreviewProps {
    /** Generated logo object */
    logo: GeneratedLogo;

    /** Display size in pixels */
    size?: number;

    /** Optional background color */
    backgroundColor?: string;

    /** Show border */
    showBorder?: boolean;

    /** Additional CSS classes */
    className?: string;

    /** Click handler */
    onClick?: () => void;

    /** Show metadata overlay on hover */
    showMeta?: boolean;
}

export function LogoPreview({
    logo,
    size = 100,
    backgroundColor,
    showBorder = false,
    className = '',
    onClick,
    showMeta = false,
}: LogoPreviewProps) {
    const uniqueId = useId();

    // Replace generic IDs in SVG with unique ones to prevent conflicts
    const processedSvg = logo.svg.replace(
        /id="([^"]+)"/g,
        (match, id) => `id="${id}-${uniqueId}"`
    ).replace(
        /url\(#([^)]+)\)/g,
        (match, id) => `url(#${id}-${uniqueId})`
    );

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{
                width: size,
                height: size,
                backgroundColor: backgroundColor || 'transparent',
                borderRadius: 12,
                border: showBorder ? '1px solid rgba(0,0,0,0.1)' : 'none',
                cursor: onClick ? 'pointer' : 'default',
                overflow: 'hidden',
            }}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
        >
            <div
                dangerouslySetInnerHTML={{ __html: processedSvg }}
                style={{
                    width: '100%',
                    height: '100%',
                }}
            />

            {showMeta && (
                <div
                    className="absolute inset-0 flex items-end justify-center opacity-0 hover:opacity-100 transition-opacity"
                    style={{
                        background: 'linear-gradient(transparent 50%, rgba(0,0,0,0.7))',
                    }}
                >
                    <span className="text-xs text-white pb-2 font-medium">
                        {logo.algorithm}
                    </span>
                </div>
            )}
        </div>
    );
}

// ============================================
// LOGO GRID COMPONENT
// ============================================

interface LogoGridProps {
    /** Array of generated logos */
    logos: GeneratedLogo[];

    /** Size of each logo */
    itemSize?: number;

    /** Gap between items */
    gap?: number;

    /** Number of columns */
    columns?: number;

    /** Background color for items */
    itemBackground?: string;

    /** Selected logo ID */
    selectedId?: string;

    /** Selection handler */
    onSelect?: (logo: GeneratedLogo) => void;

    /** Additional CSS classes */
    className?: string;
}

export function LogoGrid({
    logos,
    itemSize = 120,
    gap = 16,
    columns = 4,
    itemBackground = '#F9FAFB',
    selectedId,
    onSelect,
    className = '',
}: LogoGridProps) {
    return (
        <div
            className={`grid ${className}`}
            style={{
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gap,
            }}
        >
            {logos.map((logo) => (
                <div
                    key={logo.id}
                    className="relative"
                    style={{
                        outline: selectedId === logo.id ? '3px solid #3B82F6' : 'none',
                        outlineOffset: 2,
                        borderRadius: 14,
                    }}
                >
                    <LogoPreview
                        logo={logo}
                        size={itemSize}
                        backgroundColor={itemBackground}
                        showBorder
                        showMeta
                        onClick={() => onSelect?.(logo)}
                        className="w-full h-full"
                    />

                    {/* Variant badge */}
                    <span
                        className="absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            color: '#6B7280',
                            fontSize: 10,
                        }}
                    >
                        v{logo.variant}
                    </span>
                </div>
            ))}
        </div>
    );
}

// ============================================
// LOGO SHOWCASE COMPONENT
// ============================================

interface LogoShowcaseProps {
    /** Generated logo */
    logo: GeneratedLogo;

    /** Brand name for display */
    brandName?: string;

    /** Show on different backgrounds */
    showBackgrounds?: boolean;

    /** Show size variations */
    showSizes?: boolean;

    /** Additional CSS classes */
    className?: string;
}

export function LogoShowcase({
    logo,
    brandName,
    showBackgrounds = true,
    showSizes = true,
    className = '',
}: LogoShowcaseProps) {
    const backgrounds = [
        { name: 'White', color: '#FFFFFF' },
        { name: 'Light', color: '#F3F4F6' },
        { name: 'Dark', color: '#1F2937' },
        { name: 'Black', color: '#000000' },
    ];

    const sizes = [128, 64, 48, 32, 24, 16];

    return (
        <div className={`space-y-8 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-4">
                <LogoPreview logo={logo} size={80} />
                <div>
                    <h3 className="text-lg font-semibold">{brandName || 'Logo Preview'}</h3>
                    <p className="text-sm text-gray-500 capitalize">
                        {logo.algorithm.replace('-', ' ')} • Variant {logo.variant}
                    </p>
                </div>
            </div>

            {/* Background variations */}
            {showBackgrounds && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Background Variations</h4>
                    <div className="flex gap-4">
                        {backgrounds.map((bg) => (
                            <div key={bg.name} className="text-center">
                                <LogoPreview
                                    logo={logo}
                                    size={80}
                                    backgroundColor={bg.color}
                                    showBorder
                                />
                                <span className="text-xs text-gray-500 mt-2 block">{bg.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Size variations */}
            {showSizes && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Size Variations</h4>
                    <div className="flex items-end gap-4">
                        {sizes.map((size) => (
                            <div key={size} className="text-center">
                                <div
                                    className="flex items-center justify-center"
                                    style={{
                                        width: 128,
                                        height: 128,
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: 8,
                                    }}
                                >
                                    <LogoPreview logo={logo} size={size} />
                                </div>
                                <span className="text-xs text-gray-500 mt-2 block">{size}px</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-gray-500 space-y-1">
                <p>
                    <strong>Symmetry:</strong> {logo.meta.geometry.symmetry}
                </p>
                <p>
                    <strong>Features:</strong>{' '}
                    {[
                        logo.meta.geometry.usesGoldenRatio && 'Golden Ratio',
                        logo.meta.geometry.bezierCurves && 'Bezier Curves',
                        logo.meta.geometry.gridBased && 'Grid Based',
                    ].filter(Boolean).join(', ') || 'None'}
                </p>
                <p>
                    <strong>Seed:</strong> {logo.meta.seed}
                </p>
            </div>
        </div>
    );
}

// ============================================
// RAW SVG VIEWER
// ============================================

interface SvgCodeViewerProps {
    /** SVG string */
    svg: string;

    /** Max height of code block */
    maxHeight?: number;

    /** Show copy button */
    showCopy?: boolean;

    /** Additional CSS classes */
    className?: string;
}

export function SvgCodeViewer({
    svg,
    maxHeight = 300,
    showCopy = true,
    className = '',
}: SvgCodeViewerProps) {
    const codeRef = useRef<HTMLPreElement>(null);

    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(svg);
    }, [svg]);

    // Format SVG for display
    const formattedSvg = svg
        .replace(/></g, '>\n<')
        .replace(/(\s+)/g, ' ')
        .trim();

    return (
        <div className={`relative ${className}`}>
            <pre
                ref={codeRef}
                className="bg-gray-900 text-gray-100 p-4 rounded-lg text-xs overflow-auto"
                style={{ maxHeight }}
            >
                <code>{formattedSvg}</code>
            </pre>

            {showCopy && (
                <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                >
                    Copy SVG
                </button>
            )}
        </div>
    );
}
