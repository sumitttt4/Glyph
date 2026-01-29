"use client";

import React, { useState, useRef, useMemo } from 'react';
import { BrandIdentity } from '@/lib/data';
import { cn, generateDeepColor } from '@/lib/utils';
import { Check, Copy, Download, Code, FileText, Dices, Palette, RefreshCw, X, Search, Menu, User, Settings, Home, Bell, Mail, Calendar, MapPin, ArrowRight, ChevronDown, Plus, AlertCircle, Info, Heart, Share2, Star, MoreHorizontal } from 'lucide-react';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { FontConfig } from '@/lib/fonts';
import { FontSelector } from './FontSelector';
import { ColorPicker } from '@/components/ui/ColorPicker';
import { generateTypographyDescription } from '@/lib/typography-intelligence';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Glyph Brand Colors
const GLYPH_ACCENT = '#FF4500'; // Brand Orange
const GLYPH_DARK = '#0C0A09'; // Brand Ink

// ============================================
// HELPER: Color Conversion Functions
// ============================================

function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const k = 1 - Math.max(rNorm, gNorm, bNorm);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

    const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
    const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
    const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);

    return { c, m, y, k: Math.round(k * 100) };
}

// ============================================
// HELPER: Calculate Luminance for Contrast
// ============================================

function getLuminance(hex: string): number {
    const rgb = hexToRgb(hex);
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
        val = val / 255;
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function getContrastTextColor(bgHex: string): { text: string; textMuted: string; border: string } {
    const luminance = getLuminance(bgHex);
    const isDark = luminance < 0.5;

    return isDark
        ? { text: '#FFFFFF', textMuted: 'rgba(255, 255, 255, 0.7)', border: 'rgba(255, 255, 255, 0.2)' }
        : { text: '#1C1917', textMuted: 'rgba(28, 25, 23, 0.6)', border: 'rgba(28, 25, 23, 0.15)' };
}

// ============================================
// SECTION WRAPPER: Clean Documentation Style
// ============================================

function DocSection({
    title,
    subtitle,
    children,
    id,
    action
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    id?: string;
    action?: React.ReactNode;
}) {
    return (
        <section id={id} className="py-16 border-b border-white/10 last:border-0">
            <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
                    {subtitle && (
                        <p className="text-stone-300 mt-1">{subtitle}</p>
                    )}
                </div>
                {action && <div className="flex items-center gap-2">{action}</div>}
            </div>
            {children}
        </section>
    );
}

// ============================================
// LOGO CARD with Download & Copy Actions
// ============================================

function LogoCard({
    brand,
    variant,
    bgColor,
    textColor,
    logoColor
}: {
    brand: BrandIdentity;
    variant: string;
    bgColor: string;
    textColor: string;
    logoColor?: { primary: string };
}) {
    const [copied, setCopied] = useState(false);
    const logoRef = useRef<HTMLDivElement>(null);

    const handleDownloadSvg = () => {
        if (!logoRef.current) return;
        const svgElement = logoRef.current.querySelector('svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        const blob = new Blob([svgData], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${brand.name.toLowerCase().replace(/\s+/g, '-')}-logo-${variant.toLowerCase()}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleCopySvg = async () => {
        if (!logoRef.current) return;
        const svgElement = logoRef.current.querySelector('svg');
        if (!svgElement) return;

        const svgData = new XMLSerializer().serializeToString(svgElement);
        await navigator.clipboard.writeText(svgData);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    return (
        <div className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: colors.deep }}>
            {/* Logo Display */}
            <div
                className="aspect-square flex items-center justify-center p-6"
                style={{ backgroundColor: bgColor }}
                ref={logoRef}
            >
                <div className="w-20 h-20">
                    <LogoComposition
                        brand={brand}
                        layout="generative"
                        overrideColors={logoColor}
                    />
                </div>
            </div>

            {/* Meta & Actions */}
            <div className="p-3 border-t border-white/10" style={{ backgroundColor: colors.deeper }}>
                <p className="font-semibold text-white text-sm mb-2">{variant}</p>
                <div className="flex gap-2">
                    <button
                        onClick={handleCopySvg}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-md hover:bg-stone-100 transition-colors"
                        title="Copy SVG Code"
                    >
                        {copied ? <Check size={12} className="text-green-600" /> : <Code size={12} />}
                        <span className="sr-only md:not-sr-only">Copy</span>
                    </button>
                    <button
                        onClick={handleDownloadSvg}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs font-medium rounded-md transition-colors"
                        style={{ backgroundColor: GLYPH_DARK, color: "#FFFFFF" }}
                        title="Download SVG"
                    >
                        <Download size={12} />
                        <span className="sr-only md:not-sr-only">Save</span>
                    </button>
                </div>
            </div>
        </div>
    );
}



// ============================================
// CLEAR SPACE DIAGRAM (Construction Blueprint)
// ============================================

function ClearSpaceDiagram({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);
    const contrastColors = getContrastTextColor(colors.deep);

    return (
        <div className="w-full border rounded-xl overflow-hidden relative" style={{ backgroundColor: colors.deep, borderColor: contrastColors.border }}>
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: `linear-gradient(${contrastColors.border} 1px, transparent 1px), linear-gradient(90deg, ${contrastColors.border} 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                }}
            />

            <div className="relative z-10 p-16 md:p-24 flex items-center justify-center">

                {/* Construction Container */}
                <div className="relative">
                    {/* The Logo */}
                    <div className="w-32 h-32 relative z-20">
                        <LogoComposition brand={brand} />
                    </div>

                    {/* Clear Space Boundary (Dashed Box) */}
                    <div className="absolute -inset-16 border-2 border-dashed rounded-lg pointer-events-none z-10 flex items-center justify-center" style={{ borderColor: contrastColors.textMuted }}>
                        <div className="absolute top-0 -mt-2 px-1 text-[10px] font-mono font-bold" style={{ backgroundColor: colors.deep, color: contrastColors.text }}>x</div>
                        <div className="absolute bottom-0 -mb-2 px-1 text-[10px] font-mono font-bold" style={{ backgroundColor: colors.deep, color: contrastColors.text }}>x</div>
                        <div className="absolute left-0 -ml-2 px-1 text-[10px] font-mono font-bold" style={{ backgroundColor: colors.deep, color: contrastColors.text }}>x</div>
                        <div className="absolute right-0 -mr-2 px-1 text-[10px] font-mono font-bold" style={{ backgroundColor: colors.deep, color: contrastColors.text }}>x</div>
                    </div>

                    {/* Dimension Markers (Blueprints style) */}
                    {/* Vertical Height Indicator */}
                    <div className="absolute -right-32 top-0 bottom-0 flex items-center w-8" style={{ borderLeft: `1px solid ${contrastColors.border}` }}>
                        <div className="absolute top-0 w-2 h-px -left-1" style={{ backgroundColor: contrastColors.border }} />
                        <div className="absolute bottom-0 w-2 h-px -left-1" style={{ backgroundColor: contrastColors.border }} />
                        <div className="w-px h-full mx-auto" style={{ backgroundColor: contrastColors.textMuted }} />
                        <span className="text-[10px] font-mono px-1 ml-2" style={{ backgroundColor: colors.deep, color: contrastColors.textMuted }}>1x Height</span>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-4 left-4 backdrop-blur rounded-md px-3 py-1.5" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', border: `1px solid ${contrastColors.border}` }}>
                <p className="text-[10px] font-mono uppercase tracking-widest" style={{ color: contrastColors.text }}>
                    <span className="w-2 h-2 inline-block rounded-full bg-blue-400 mr-2" />
                    Clear Space Construction
                </p>
            </div>
        </div>
    );
}

// ============================================
// LOGO MISUSE GRID
// ============================================

function LogoMisuseGrid({ brand }: { brand: BrandIdentity }) {
    const MisuseCard = ({ title, type, children }: { title: string, type: 'distort' | 'contrast' | 'rotate', children: React.ReactNode }) => (
        <div className="bg-stone-50 rounded-xl border border-red-100 overflow-hidden relative group">
            <div className="p-12 flex items-center justify-center bg-white">
                {children}
            </div>

            {/* Overlay X */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 backdrop-blur-[2px]">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shadow-sm">
                    <X size={24} className="text-red-600" />
                </div>
            </div>

            {/* Static X Badge */}
            <div className="absolute top-3 right-3 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <X size={14} className="text-red-600" />
            </div>

            <div className="p-4 border-t border-stone-100 bg-red-50/30">
                <h4 className="font-bold text-red-900 text-sm mb-1">{title}</h4>
                <p className="text-xs text-red-700/60">Do not {type} the logo.</p>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* 1. Distortion */}
            <MisuseCard title="Disproportionate Scaling" type="distort">
                <div className="w-24 h-24 transform scale-x-150 scale-y-75 origin-center transition-transform duration-500 hover:scale-x-100 hover:scale-y-100">
                    <LogoComposition brand={brand} />
                </div>
            </MisuseCard>

            {/* 2. Low Contrast */}
            <MisuseCard title="Low Contrast" type="contrast">
                <div className="w-32 h-32 bg-stone-200 rounded-lg flex items-center justify-center">
                    <div className="w-20 h-20 opacity-30 grayscale mix-blend-multiply">
                        <LogoComposition brand={brand} />
                    </div>
                </div>
            </MisuseCard>

            {/* 3. Rotation */}
            <MisuseCard title="Unapproved Rotation" type="rotate">
                <div className="w-24 h-24 transform rotate-12 transition-transform duration-500 hover:rotate-45">
                    <LogoComposition brand={brand} />
                </div>
            </MisuseCard>
        </div>
    );
}

// ============================================
// COLOR DATA TABLE
// ============================================

function ColorDataCard({
    label,
    hex,
    cssVar
}: {
    label: string;
    hex: string;
    cssVar: string;
}) {
    const [copiedField, setCopiedField] = useState<string | null>(null);
    const rgb = hexToRgb(hex);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);

    const handleCopy = (value: string, field: string) => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 1500);
    };

    const DataRow = ({ label, value, field }: { label: string; value: string; field: string }) => (
        <tr
            className="border-b border-white/5 last:border-0 hover:bg-white/5 cursor-pointer group transition-colors"
            onClick={() => handleCopy(value, field)}
        >
            <td className="py-2 px-3 text-xs text-stone-400 font-mono uppercase">{label}</td>
            <td className="py-2 px-3 text-sm font-mono text-white flex items-center justify-between">
                <span>{value}</span>
                <button
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleCopy(value, field); }}
                >
                    {copiedField === field ? (
                        <Check size={14} className="text-green-400" />
                    ) : (
                        <Copy size={14} className="text-stone-400" />
                    )}
                </button>
            </td>
        </tr>
    );

    // Generate brand colors from hex for card backgrounds
    const colors = generateDeepColor(hex);

    return (
        <div className="rounded-xl border border-white/10 overflow-hidden" style={{ backgroundColor: colors.deep }}>
            {/* Color Swatch */}
            <div
                className="h-24"
                style={{ backgroundColor: hex }}
            />

            {/* Label */}
            <div className="px-4 py-3 border-b border-white/10" style={{ backgroundColor: colors.deeper }}>
                <h4 className="font-semibold text-white">{label}</h4>
            </div>

            {/* Data Table */}
            <table className="w-full">
                <tbody>
                    <DataRow label="HEX" value={hex.toUpperCase()} field="hex" />
                    <DataRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} field="rgb" />
                    <DataRow label="CMYK" value={`${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%`} field="cmyk" />
                    <DataRow label="CSS Var" value={cssVar} field="css" />
                </tbody>
            </table>
        </div>
    );
}

// ============================================
// TYPOGRAPHY SCALE TABLE
// ============================================

function TypographySection({ brand, onUpdateFont }: { brand: BrandIdentity; onUpdateFont?: (font: FontConfig) => void }) {
    const [isFontSelectorOpen, setIsFontSelectorOpen] = useState(false);
    const headingFontName = brand.font.headingName || brand.font.name || 'Inter';
    const bodyFontName = brand.font.bodyName || brand.font.name || 'Inter';
    const fontClassName = brand.font.heading || '';

    // Generate brand colors for backgrounds
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    // Generate intelligent typography description
    const typoInfo = useMemo(() =>
        generateTypographyDescription(brand.name, headingFontName, bodyFontName),
        [brand.name, headingFontName, bodyFontName]
    );

    // Weight scale
    const weightScale = [
        { label: 'Thin', weight: 100, className: 'font-thin' },
        { label: 'Light', weight: 300, className: 'font-light' },
        { label: 'Regular', weight: 400, className: 'font-normal' },
        { label: 'Semi Bold', weight: 600, className: 'font-semibold' },
        { label: 'Bold', weight: 700, className: 'font-bold' },
    ];

    return (
        <>
            <FontSelector
                isOpen={isFontSelectorOpen}
                onClose={() => setIsFontSelectorOpen(false)}
                currentFontId={brand.font.id}
                onSelect={(font) => {
                    onUpdateFont?.(font);
                    setIsFontSelectorOpen(false);
                }}
            />

            {/* THE BLUEPRINT VIEW - Matching Reference Image */}
            <div className="w-full rounded-xl overflow-hidden border border-stone-200">

                {/* ====== TOP SECTION: Gradient Header ====== */}
                <div
                    className="relative p-8 md:p-12"
                    style={{
                        background: `linear-gradient(180deg, ${colors.deep} 0%, ${colors.deeper} 100%)`,
                    }}
                >
                    {/* Font Name - Large */}
                    <h2
                        className={cn(
                            "text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-8",
                            fontClassName
                        )}
                        style={{
                            fontFamily: `"${headingFontName}", system-ui, sans-serif`,
                            fontWeight: 400,
                        }}
                    >
                        {headingFontName}
                    </h2>

                    {/* Description Grid - Smart Content */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {/* Left Column - Font Role Label */}
                        <div>
                            <span className="text-sm font-medium text-stone-300 uppercase tracking-widest">
                                {typoInfo.isPairing ? 'Display' : 'Primary'}
                            </span>
                            <p className="text-lg font-medium text-white mt-1">Typeface</p>
                            {/* Font Classification Badge */}
                            <span
                                className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-stone-200"
                            >
                                {typoInfo.headingMeta.classification.replace('-', ' ')}
                            </span>
                        </div>

                        {/* Middle Column - Primary Description */}
                        <div>
                            <p className="text-sm text-stone-200 leading-relaxed">
                                {typoInfo.headingDescription}
                            </p>
                        </div>

                        {/* Right Column - Secondary Description / Traits */}
                        <div>
                            <p className="text-sm text-stone-200 leading-relaxed">
                                {typoInfo.headingMeta.shortDescription}. Best suited for {typoInfo.headingMeta.bestFor.slice(0, 3).join(', ')}.
                            </p>
                            {/* Personality Tags */}
                            <div className="flex flex-wrap gap-1.5 mt-3">
                                {typoInfo.headingMeta.personality.slice(0, 4).map(trait => (
                                    <span
                                        key={trait}
                                        className="px-2 py-0.5 text-[10px] rounded-full bg-white/10 text-stone-300"
                                    >
                                        {trait}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ====== PAIRING SECTION (if different fonts) ====== */}
                {typoInfo.isPairing && (
                    <div className="bg-stone-50 border-t border-b border-stone-200 p-6 md:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Body Font Info */}
                            <div>
                                <span className="text-sm font-medium text-stone-600/80 uppercase tracking-widest">
                                    Body
                                </span>
                                <p className="text-lg font-medium text-stone-700 mt-1">{bodyFontName}</p>
                                <span
                                    className="inline-block mt-2 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-stone-800/10 text-stone-700"
                                >
                                    {typoInfo.bodyMeta.classification.replace('-', ' ')}
                                </span>
                            </div>

                            {/* Body Description */}
                            <div>
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    {typoInfo.bodyDescription}
                                </p>
                            </div>

                            {/* Pairing Rationale */}
                            <div className="bg-white rounded-lg p-4 border border-stone-200">
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                                    Why This Pairing Works
                                </p>
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    {typoInfo.pairingRationale}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ====== BOTTOM SECTION: Weight Scale ====== */}
                <div className="relative bg-white p-8 md:p-12 overflow-hidden">

                    {/* Background "AaBb" Watermark */}
                    <div
                        className={cn(
                            "absolute right-0 top-1/2 -translate-y-1/2 text-[180px] md:text-[250px] lg:text-[320px] leading-none tracking-tighter pointer-events-none select-none",
                            fontClassName
                        )}
                        style={{
                            fontFamily: `"${headingFontName}", system-ui, sans-serif`,
                            fontWeight: 400,
                            color: 'rgba(0,0,0,0.06)',
                            right: '-20px',
                        }}
                    >
                        AaBb
                    </div>

                    {/* Weight List - Left Side */}
                    <div className="relative z-10 space-y-3 md:space-y-4 max-w-xs">
                        {weightScale.map((item) => (
                            <div
                                key={item.label}
                                className={cn(
                                    "text-2xl md:text-3xl text-stone-700 transition-all hover:text-stone-900",
                                    fontClassName
                                )}
                                style={{
                                    fontFamily: `"${headingFontName}", system-ui, sans-serif`,
                                    fontWeight: item.weight,
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>

                </div>

                {/* ====== ACTION BAR ====== */}
                <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-lg font-bold"
                            style={{ fontFamily: `"${headingFontName}", system-ui, sans-serif` }}
                        >
                            Aa
                        </div>
                        <div>
                            <p className="text-sm font-medium text-stone-900">
                                {typoInfo.isPairing ? `${headingFontName} + ${bodyFontName}` : headingFontName}
                            </p>
                            <p className="text-xs text-stone-500">
                                {typoInfo.isPairing ? 'Font pairing' : '5 weights available'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsFontSelectorOpen(true)}
                            className="px-4 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                            Change Font
                        </button>
                        <a
                            href={`https://fonts.google.com/specimen/${headingFontName.replace(/\s+/g, '+')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-bold rounded-lg transition-all hover:scale-105 flex items-center justify-center"
                            style={{ backgroundColor: GLYPH_ACCENT, color: "#FFFFFF" }}
                        >
                            Download Font Family
                        </a>
                    </div>
                </div>
            </div>

            {/* TYPE SCALE TABLE */}
            <div className="mt-10 rounded-xl border border-stone-200 bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                    <h4 className="font-semibold text-stone-900">Type Scale</h4>
                    <p className="text-sm text-stone-500 mt-1">Golden ratio proportions for consistent hierarchy</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-200 bg-stone-50/50">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Role</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Size (px)</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Size (rem)</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Line Height</th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">Letter Spacing</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                            {[
                                { role: 'H1', size: '48px', rem: '3rem', lineHeight: '1.1', letterSpacing: '-0.03em', weight: '700' },
                                { role: 'H2', size: '36px', rem: '2.25rem', lineHeight: '1.15', letterSpacing: '-0.025em', weight: '700' },
                                { role: 'H3', size: '30px', rem: '1.875rem', lineHeight: '1.2', letterSpacing: '-0.02em', weight: '600' },
                                { role: 'H4', size: '24px', rem: '1.5rem', lineHeight: '1.25', letterSpacing: '-0.015em', weight: '600' },
                                { role: 'H5', size: '20px', rem: '1.25rem', lineHeight: '1.3', letterSpacing: '-0.01em', weight: '600' },
                                { role: 'H6', size: '18px', rem: '1.125rem', lineHeight: '1.35', letterSpacing: '0em', weight: '600' },
                                { role: 'Body', size: '16px', rem: '1rem', lineHeight: '1.6', letterSpacing: '0em', weight: '400' },
                                { role: 'Small', size: '14px', rem: '0.875rem', lineHeight: '1.5', letterSpacing: '0.01em', weight: '400' },
                            ].map((row) => (
                                <tr key={row.role} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-6 py-3 font-semibold text-stone-900">{row.role}</td>
                                    <td className="px-6 py-3 font-mono text-stone-600">{row.size}</td>
                                    <td className="px-6 py-3 font-mono text-stone-600">{row.rem}</td>
                                    <td className="px-6 py-3 font-mono text-stone-600">{row.lineHeight}</td>
                                    <td className="px-6 py-3 font-mono text-stone-600">{row.letterSpacing}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

// ============================================
// ICONOGRAPHY SECTION
// ============================================

function IconographySection({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;

    const IconCard = ({ icon: Icon, label }: { icon: any, label: string }) => {
        const isActionable = label === 'Copy' || label === 'Download';
        const handleAction = () => {
            if (isActionable) {
                navigator.clipboard.writeText('npm install lucide-react');
                // Simple alert as requested for immediate feedback
                alert('Copied specific command: npm install lucide-react');
            }
        };

        return (
            <div
                onClick={handleAction}
                className={cn(
                    "flex flex-col items-center gap-3 p-4 rounded-xl border border-stone-100 bg-stone-50 hover:bg-white hover:shadow-md transition-all group",
                    isActionable && "cursor-pointer active:scale-95 ring-2 ring-offset-2 ring-transparent hover:ring-stone-200"
                )}
            >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-stone-200 text-stone-600 group-hover:border-transparent group-hover:text-white transition-colors"
                    style={{ '--tw-bg-opacity': 1, '--icon-hover': primary } as React.CSSProperties}
                >
                    {/* We use inline style for hover color via CSS variable or direct style if possible. Framer motion is better but keeping it simple. */}
                    <Icon
                        size={20}
                        className="transition-colors duration-300 group-hover:text-[var(--icon-color)]"
                        style={{ '--icon-color': primary } as React.CSSProperties}
                    />
                </div>
                <span className="text-xs font-medium text-stone-500 group-hover:text-stone-900 flex items-center gap-1">
                    {label}
                    {isActionable && <span className="text-[10px] opacity-0 group-hover:opacity-50">↵</span>}
                </span>
            </div>
        );
    };

    const categories = [
        {
            title: "Navigation",
            icons: [
                { icon: Home, label: "Home" },
                { icon: Menu, label: "Menu" },
                { icon: ChevronDown, label: "Dropdown" },
                { icon: ArrowRight, label: "Arrow" },
                { icon: MoreHorizontal, label: "More" }, // Need to import MoreHorizontal or just use dots
                { icon: X, label: "Close" },
            ]
        },
        {
            title: "Actions",
            icons: [
                { icon: Search, label: "Search" },
                { icon: Plus, label: "Add" },
                { icon: Settings, label: "Settings" },
                { icon: Share2, label: "Share" },
                { icon: Download, label: "Download" },
                { icon: Copy, label: "Copy" },
            ]
        },
        {
            title: "Communication",
            icons: [
                { icon: User, label: "Profile" },
                { icon: Mail, label: "Email" },
                { icon: Bell, label: "Notify" },
                { icon: Heart, label: "Like" },
                { icon: Star, label: "Favorite" },
                { icon: MapPin, label: "Location" },
            ]
        }
    ];

    return (
        <div className="space-y-12">
            {categories.map((cat, i) => (
                <div key={i}>
                    <h4 className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-6">{cat.title}</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {cat.icons.map((item, j) => (
                            <IconCard key={j} icon={item.icon} label={item.label} />
                        ))}
                    </div>
                </div>
            ))}

            {/* Usage Example */}
            <div className="mt-8 p-6 bg-stone-50 rounded-xl border border-stone-200">
                <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                        <Info size={20} className="text-stone-500" />
                    </div>
                    <div>
                        <h5 className="font-bold text-stone-900 text-sm">Icon Usage</h5>
                        <p className="text-xs text-stone-500 mt-1 max-w-lg">
                            Icons should be used to enhance comprehension, not decoration.
                            Use the 24px grid for primary actions and 16px for secondary indicators.
                            Stroke width should be consistent (2px recommended).
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================
// MAIN COMPONENT: BRAND GUIDELINES (Docs Style)
// ============================================

interface BrandGuidelinesDocsProps {
    brand: BrandIdentity;
    onUpdateFont?: (font: FontConfig) => void;
    onSelectColor?: (color: { light: string; dark: string }) => void;
}

// ============================================
// BRAND OVERVIEW SECTION (Cover Story)
// ============================================

function getBrandStory(brand: BrandIdentity) {
    const name = brand.name;
    const vibe = brand.vibe || 'Efficiency';
    const industry = 'Digital'; // Generic fallback if not available

    const missions = [
        `${name} is a next-generation protocol designed to serve as the central hub of its ecosystem. Built with minimal, tech-driven precision, ${name} represents the foundation where projects are launched and innovation takes root.`,
        `${name} redefines the landscape of ${vibe}, merging aesthetic purity with functional depth. It stands as a beacon for those who demand clarity in a chaotic world.`,
        `At the intersection of design and utility lies ${name}. A platform for the future, engineered to facilitate seamless connection and growth across the entire network.`,
    ];

    const origins = [
        `The name ${name} originates from the concept of being at the core — the central point around which the ecosystem is built.`,
        `${name} draws its identity from the principles of reduction and synthesis. It symbolizes the point where complexity resolves into simplicity.`,
        `Rooted in the idea of perpetual motion, ${name} embodies the drive to constantly evolve and adapt. It is a living system.`,
    ];

    // Stable selection based on name length
    const hash = name.length;
    return {
        mission: missions[hash % missions.length],
        origin: origins[hash % origins.length]
    };
}

function BrandOverviewSection({ brand }: { brand: BrandIdentity }) {
    const story = useMemo(() => getBrandStory(brand), [brand]);
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    return (
        <div className="relative w-full rounded-3xl overflow-hidden mb-16 text-white shadow-2xl" style={{ backgroundColor: colors.deep }}>
            {/* Background Gradient */}
            <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${colors.deeper} 0%, ${colors.deep} 50%, ${colors.accent} 100%)` }}
            />
            {/* Noise Texture */}
            <div className="absolute inset-0 opacity-20 bg-stone-900 mix-blend-overlay pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center p-12 md:p-20 gap-12">
                <div className="flex-1 space-y-10">
                    <div>
                        <span className="text-xs font-mono uppercase tracking-widest text-white/50 mb-4 block">{brand.name} Brand Guidelines</span>
                        <h2 className={cn("text-5xl md:text-6xl font-bold uppercase tracking-tight leading-[0.9]", brand.font.heading)}>Brand Overview</h2>
                    </div>

                    <div className="space-y-8 max-w-2xl">
                        <p className={cn("text-xl md:text-2xl leading-relaxed font-medium", brand.font.body)}>{story.mission}</p>
                        <p className={cn("text-sm md:text-base opacity-70 border-l-2 border-white/30 pl-6 py-2 leading-relaxed max-w-xl", brand.font.body)}>
                            {story.origin} <br />
                            With its ecosystem anchored in deep {colors.deep} tones that symbolize stability, {brand.name} positions itself as the trusted center point.
                        </p>
                    </div>
                </div>

                {/* Logo Overlay */}
                <div className="relative w-64 h-64 md:w-96 md:h-96 flex-shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 bg-white/10 blur-[80px] rounded-full" />
                    <LogoComposition brand={brand} className="w-full h-full text-white drop-shadow-2xl" />
                </div>
            </div>
        </div>
    );
}

export function BrandGuidelinesDocs({ brand, onUpdateFont, onSelectColor }: BrandGuidelinesDocsProps) {
    const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
    const t = brand.theme.tokens[colorMode];
    const primary = brand.theme.tokens.light.primary;
    const colors = generateDeepColor(primary);

    return (
        <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${colors.deeper} 0%, ${colors.deep} 100%)` }}>
            {/* Clean Header */}
            <header className="border-b border-white/10 sticky top-0 z-50" style={{ backgroundColor: colors.deeper }}>
                <div className="max-w-6xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10">
                                <LogoComposition brand={brand} layout="generative" />
                            </div>
                            <div>
                                <h1 className={cn("text-xl font-bold text-white", brand.font.heading)}>
                                    {brand.name}
                                </h1>
                                <p className="text-sm text-stone-300">Brand Guidelines</p>
                            </div>
                        </div>
                        <p className="text-xs font-mono text-stone-300 uppercase tracking-widest">
                            v1.0 • {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-8 py-12">

                {/* BRAND OVERVIEW (Cover) */}
                <BrandOverviewSection brand={brand} />

                {/* LOGO SYSTEM */}
                <DocSection
                    id="logo"
                    title="Logo System"
                    subtitle="Primary and alternate logo marks for different contexts."
                    action={
                        <>
                            {/* Color Picker Dropdown */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
                                        <div
                                            className="w-4 h-4 rounded-full border border-stone-300"
                                            style={{ backgroundColor: brand.theme.tokens.light.primary }}
                                        />
                                        <span className="hidden sm:inline">Color</span>
                                        <Palette size={16} className="text-stone-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    sideOffset={8}
                                    align="end"
                                    className="w-[280px] p-0 bg-stone-900/95 backdrop-blur-xl border-white/10 text-white rounded-2xl shadow-2xl overflow-hidden"
                                >
                                    <ColorPicker
                                        value={brand.theme.tokens.light.primary}
                                        onChange={(color) => {
                                            onSelectColor?.(color);
                                        }}
                                    />
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Random Color Button */}
                            <button
                                onClick={() => {
                                    const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
                                    onSelectColor?.({ light: randomHex, dark: randomHex });
                                }}
                                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                                title="Random Color"
                            >
                                <Dices size={16} />
                                <span className="hidden sm:inline">Random</span>
                            </button>
                        </>
                    }
                >
                    {/* Bento Grid of Logo Variants */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Primary Mark */}
                        <LogoCard
                            brand={brand}
                            variant="Primary Mark"
                            bgColor="#FFFFFF"
                            textColor="#000000"
                        />
                        {/* Inverted (Dark BG) */}
                        <LogoCard
                            brand={brand}
                            variant="Inverted"
                            bgColor="#0A0A0A"
                            textColor="#FFFFFF"
                            logoColor={{ primary: '#FFFFFF' }}
                        />
                        {/* Monotone (Stone) */}
                        <LogoCard
                            brand={brand}
                            variant="Monotone"
                            bgColor="#1C1917"
                            textColor="#FFFFFF"
                            logoColor={{ primary: '#FFFFFF' }}
                        />
                        {/* On Brand Color */}
                        <LogoCard
                            brand={brand}
                            variant="On Brand"
                            bgColor={brand.theme.tokens.light.primary}
                            textColor="#FFFFFF"
                            logoColor={{ primary: '#FFFFFF' }}
                        />
                    </div>

                    {/* Clear Space & Usage */}
                    <div className="mt-16 space-y-16">
                        <div>
                            <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-white rounded-full" />
                                Clear Space Construction
                            </h4>
                            <p className="text-sm text-stone-200 mb-6 max-w-2xl">
                                To ensure legibility, always keep a minimum clear space around the logo. This space isolates the mark from competing graphic elements like other logos, copy, or photography.
                            </p>
                            <ClearSpaceDiagram brand={brand} />
                        </div>

                        <div>
                            <h4 className="font-bold text-white mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-red-500 rounded-full" />
                                Unacceptable Usage
                            </h4>
                            <p className="text-sm text-stone-200 mb-6 max-w-2xl">
                                Consistently using the logo is crucial for brand recognition. Avoid these common mistakes when using the brand marks.
                            </p>
                            <LogoMisuseGrid brand={brand} />
                        </div>
                    </div>
                </DocSection>

                {/* COLOR PALETTE */}
                <DocSection
                    id="colors"
                    title="Color Palette"
                    subtitle="Complete color specifications for print and digital applications."
                    action={
                        <div className="flex bg-stone-100 p-1 rounded-lg border border-stone-200">
                            <button
                                onClick={() => setColorMode('light')}
                                className={cn(
                                    "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                                    colorMode === 'light' ? "bg-white shadow-sm text-stone-900" : "text-stone-500 hover:text-stone-900"
                                )}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => setColorMode('dark')}
                                className={cn(
                                    "px-3 py-1 text-xs font-semibold rounded-md transition-all",
                                    colorMode === 'dark' ? "bg-stone-800 shadow-sm text-white" : "text-stone-500 hover:text-stone-900"
                                )}
                            >
                                Dark
                            </button>
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <ColorDataCard label="Primary" hex={t.primary} cssVar="--brand-primary" />
                        <ColorDataCard label="Background" hex={t.bg} cssVar="--brand-bg" />
                        <ColorDataCard label="Surface" hex={t.surface} cssVar="--brand-surface" />
                        <ColorDataCard label="Text" hex={t.text} cssVar="--brand-text" />
                        <ColorDataCard label="Muted" hex={t.muted} cssVar="--brand-muted" />
                        <ColorDataCard label="Border" hex={t.border} cssVar="--brand-border" />
                    </div>
                </DocSection>

                {/* TYPOGRAPHY */}
                <DocSection
                    id="typography"
                    title="Typography"
                    subtitle="Font families and type scale specifications."
                >
                    <TypographySection brand={brand} onUpdateFont={onUpdateFont} />
                </DocSection>

                {/* ICONOGRAPHY */}
                <DocSection
                    id="iconography"
                    title="Iconography"
                    subtitle="System icons and usage guidelines."
                >
                    <IconographySection brand={brand} />
                </DocSection>

                {/* EXPORT */}
                <DocSection
                    id="export"
                    title="Export Assets"
                    subtitle="Download the complete brand package."
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div
                            className="rounded-xl border overflow-hidden flex items-center gap-4"
                            style={{ backgroundColor: GLYPH_DARK, borderColor: 'rgba(255,69,0,0.2)' }}
                        >
                            <div
                                className="w-16 h-full flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(255,69,0,0.1)' }}
                            >
                                <FileText className="w-6 h-6" style={{ color: GLYPH_ACCENT }} />
                            </div>
                            <div className="flex-1 py-6">
                                <h4 className="font-semibold text-white">Brand Guidelines PDF</h4>
                                <p className="text-sm text-white/50">Complete visual identity document</p>
                            </div>
                            <button
                                className="px-4 py-2 mr-4 text-sm font-bold rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: GLYPH_ACCENT, color: "#FFFFFF" }}
                            >
                                Download
                            </button>
                        </div>

                        <div
                            className="rounded-xl border overflow-hidden flex items-center gap-4"
                            style={{ backgroundColor: GLYPH_DARK, borderColor: 'rgba(255,69,0,0.2)' }}
                        >
                            <div
                                className="w-16 h-full flex items-center justify-center"
                                style={{ backgroundColor: 'rgba(255,69,0,0.1)' }}
                            >
                                <Download className="w-6 h-6" style={{ color: GLYPH_ACCENT }} />
                            </div>
                            <div className="flex-1 py-6">
                                <h4 className="font-semibold text-white">Asset Package</h4>
                                <p className="text-sm text-white/50">All logos, icons, and graphics</p>
                            </div>
                            <button
                                className="px-4 py-2 mr-4 text-sm font-bold rounded-lg transition-all hover:scale-105"
                                style={{ backgroundColor: GLYPH_ACCENT, color: "#FFFFFF" }}
                            >
                                Download
                            </button>
                        </div>
                    </div>
                </DocSection>

            </main>


        </div>
    );
}
