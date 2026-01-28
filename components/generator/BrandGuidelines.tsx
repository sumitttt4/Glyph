"use client";

import React, { useState, useRef } from 'react';
import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Check, Copy, Download, Code, FileText, Dices, Palette, RefreshCw, X } from 'lucide-react';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { FontConfig } from '@/lib/fonts';
import { FontSelector } from './FontSelector';
import { ColorPicker } from '@/components/ui/ColorPicker';
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
        <section id={id} className="py-16 border-b border-stone-200 last:border-0">
            <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-stone-900 tracking-tight">{title}</h2>
                    {subtitle && (
                        <p className="text-stone-500 mt-1">{subtitle}</p>
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

    return (
        <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
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
            <div className="p-3 border-t border-stone-200 bg-stone-50">
                <p className="font-semibold text-stone-900 text-sm mb-2">{variant}</p>
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
    return (
        <div className="w-full bg-stone-50 border border-stone-200 rounded-xl overflow-hidden relative">
            {/* Grid Background */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    backgroundImage: 'linear-gradient(#e7e5e4 1px, transparent 1px), linear-gradient(90deg, #e7e5e4 1px, transparent 1px)',
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
                    <div className="absolute -inset-16 border-2 border-dashed border-stone-300 rounded-lg pointer-events-none z-10 flex items-center justify-center">
                        <div className="absolute top-0 -mt-2 bg-stone-50 px-1 text-[10px] font-mono text-stone-400 font-bold">x</div>
                        <div className="absolute bottom-0 -mb-2 bg-stone-50 px-1 text-[10px] font-mono text-stone-400 font-bold">x</div>
                        <div className="absolute left-0 -ml-2 bg-stone-50 px-1 text-[10px] font-mono text-stone-400 font-bold">x</div>
                        <div className="absolute right-0 -mr-2 bg-stone-50 px-1 text-[10px] font-mono text-stone-400 font-bold">x</div>
                    </div>

                    {/* Dimension Markers (Blueprints style) */}
                    {/* Vertical Height Indicator */}
                    <div className="absolute -right-32 top-0 bottom-0 flex items-center w-8 border-l border-stone-300">
                        <div className="absolute top-0 w-2 h-px bg-stone-300 -left-1" />
                        <div className="absolute bottom-0 w-2 h-px bg-stone-300 -left-1" />
                        <div className="w-px h-full bg-stone-200 mx-auto" />
                        <span className="bg-stone-50 text-[10px] font-mono text-stone-400 px-1 ml-2">1x Height</span>
                    </div>

                </div>
            </div>

            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur border border-stone-200 rounded-md px-3 py-1.5">
                <p className="text-[10px] font-mono uppercase tracking-widest text-stone-500">
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
            className="border-b border-stone-100 last:border-0 hover:bg-stone-50 cursor-pointer group transition-colors"
            onClick={() => handleCopy(value, field)}
        >
            <td className="py-2 px-3 text-xs text-stone-500 font-mono uppercase">{label}</td>
            <td className="py-2 px-3 text-sm font-mono text-stone-900 flex items-center justify-between">
                <span>{value}</span>
                <button
                    className="p-1 rounded hover:bg-stone-100 transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleCopy(value, field); }}
                >
                    {copiedField === field ? (
                        <Check size={14} className="text-green-600" />
                    ) : (
                        <Copy size={14} className="text-stone-400" />
                    )}
                </button>
            </td>
        </tr>
    );

    return (
        <div className="rounded-xl border border-stone-200 overflow-hidden bg-white">
            {/* Color Swatch */}
            <div
                className="h-24"
                style={{ backgroundColor: hex }}
            />

            {/* Label */}
            <div className="px-4 py-3 border-b border-stone-200 bg-stone-50">
                <h4 className="font-semibold text-stone-900">{label}</h4>
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

    const typeScale = [
        { role: 'H1', size: '48px', rem: '3rem', lineHeight: '1.1', letterSpacing: '-0.03em', weight: '700' },
        { role: 'H2', size: '36px', rem: '2.25rem', lineHeight: '1.15', letterSpacing: '-0.025em', weight: '700' },
        { role: 'H3', size: '30px', rem: '1.875rem', lineHeight: '1.2', letterSpacing: '-0.02em', weight: '600' },
        { role: 'H4', size: '24px', rem: '1.5rem', lineHeight: '1.25', letterSpacing: '-0.015em', weight: '600' },
        { role: 'H5', size: '20px', rem: '1.25rem', lineHeight: '1.3', letterSpacing: '-0.01em', weight: '600' },
        { role: 'H6', size: '18px', rem: '1.125rem', lineHeight: '1.35', letterSpacing: '0em', weight: '600' },
        { role: 'Body', size: '16px', rem: '1rem', lineHeight: '1.6', letterSpacing: '0em', weight: '400' },
        { role: 'Small', size: '14px', rem: '0.875rem', lineHeight: '1.5', letterSpacing: '0.01em', weight: '400' },
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Font Preview Cards */}
                <div className="space-y-4">
                    {/* Heading Font */}
                    <div className="rounded-xl border border-stone-200 bg-white p-6">
                        <p className="text-xs font-mono text-stone-400 uppercase tracking-widest mb-2">Heading</p>
                        <h3 className={cn("text-3xl font-bold text-stone-900 mb-2", brand.font.heading)}>
                            {brand.font.headingName || brand.font.name}
                        </h3>
                        <p className={cn("text-4xl font-bold text-stone-300", brand.font.heading)}>Aa</p>
                    </div>

                    {/* Body Font */}
                    <div className="rounded-xl border border-stone-200 bg-white p-6">
                        <p className="text-xs font-mono text-stone-400 uppercase tracking-widest mb-2">Body</p>
                        <h3 className={cn("text-2xl font-medium text-stone-900 mb-2", brand.font.body)}>
                            {brand.font.bodyName || 'Inter'}
                        </h3>
                        <p className={cn("text-3xl text-stone-300", brand.font.body)}>Aa</p>
                    </div>

                    <button
                        onClick={() => setIsFontSelectorOpen(true)}
                        className="w-full py-3 px-4 text-sm font-bold rounded-lg transition-colors hover:scale-105 transition-all"
                        style={{ backgroundColor: GLYPH_ACCENT, color: "#FFFFFF" }}
                    >
                        Change Font Pairing
                    </button>
                </div>

                {/* Type Scale Table */}
                <div className="lg:col-span-2 rounded-xl border border-stone-200 bg-white overflow-hidden">
                    <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                        <h4 className="font-semibold text-stone-900">Type Scale</h4>
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
                                {typeScale.map((row) => (
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
            </div>
        </>
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

export function BrandGuidelinesDocs({ brand, onUpdateFont, onSelectColor }: BrandGuidelinesDocsProps) {
    const [colorMode, setColorMode] = useState<'light' | 'dark'>('light');
    const t = brand.theme.tokens[colorMode];

    return (
        <div className="min-h-screen bg-white">
            {/* Clean Header */}
            <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10">
                                <LogoComposition brand={brand} layout="generative" />
                            </div>
                            <div>
                                <h1 className={cn("text-xl font-bold text-stone-900", brand.font.heading)}>
                                    {brand.name}
                                </h1>
                                <p className="text-sm text-stone-500">Brand Guidelines</p>
                            </div>
                        </div>
                        <p className="text-xs font-mono text-stone-400 uppercase tracking-widest">
                            v1.0 • {new Date().getFullYear()}
                        </p>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="max-w-6xl mx-auto px-8">

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
                            <h4 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-stone-900 rounded-full" />
                                Clear Space Construction
                            </h4>
                            <p className="text-sm text-stone-600 mb-6 max-w-2xl">
                                To ensure legibility, always keep a minimum clear space around the logo. This space isolates the mark from competing graphic elements like other logos, copy, or photography.
                            </p>
                            <ClearSpaceDiagram brand={brand} />
                        </div>

                        <div>
                            <h4 className="font-bold text-stone-900 mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-red-500 rounded-full" />
                                Unacceptable Usage
                            </h4>
                            <p className="text-sm text-stone-600 mb-6 max-w-2xl">
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
