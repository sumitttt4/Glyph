"use client";

import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import { UnifiedExportMenu } from '@/components/generator/UnifiedExportMenu';
import { SocialMediaKit } from '@/components/preview/SocialMediaKit';
import { ArrowUp, ArrowUpRight as ArrowUpEnd } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Copy, Check, Shuffle, RefreshCw, SlidersHorizontal, Share2, Grid3X3, Eye, EyeOff } from 'lucide-react';
import { LogoTweakPanel } from './LogoTweakPanel';
import { ExportBrandKit } from './ExportBrandKit';
import { SlideCover, SlideStrategy, SlideLogo, SlideColors, SlideTypography, SlideSocial, SlideOutdoor, SlideMockups, SlidePitchDeck, SlideGuidelines } from './BrandSlides';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { LogoConstruction } from '@/components/logo-engine/LogoConstruction';
import { LogoConstructionGrid } from '@/components/logo-engine/LogoConstructionGrid';
import { SafariBrowserMockup } from '@/components/preview/SafariBrowserMockup';
import { ColorPaletteHorizontal } from './ColorPaletteStrip';
import { AppIconVariants } from './AppIconVariants';
import { MockupCreditCard, MockupIDBadge } from '@/components/preview/MockupMerch';
import { MockupIPhoneHome } from '@/components/preview/MockupIPhoneHome';
import { Mockup3DCard } from '@/components/preview/Mockup3DCard';
import { MockupDevice, MockupBrowser } from '@/components/preview/MockupDevice';
import { BrowserBrandPreview } from '@/components/preview/BrowserBrandPreview';
import { MonogramMark } from '@/components/logo-engine/LogoMonogram';
import { FontSelector } from './FontSelector';
import { FontConfig } from '@/lib/fonts';
import { BrandMockups } from '@/components/preview/BrandMockups';
import { MockupGallery } from '@/components/preview/MockupGallery';
import { BrandGraphicsSystem } from '@/components/preview/BrandGraphicsSystem';


interface WorkbenchBentoGridProps {
    brand: BrandIdentity;
    isDark: boolean;
    onShuffleLogo?: () => void;
    onSwapFont?: () => void;
    onUpdateFont?: (font: FontConfig) => void;
    onCycleColor?: () => void;
    onSelectColor?: (color: { light: string; dark: string }) => void;
    onVariations?: () => void;
    onUpdateBrand?: (updates: Partial<BrandIdentity>) => void;
    viewMode: 'overview' | 'presentation';
    setViewMode?: (mode: 'overview' | 'presentation') => void;
}

export function WorkbenchBentoGrid({ brand, isDark, onShuffleLogo, onSwapFont, onUpdateFont, onCycleColor, onSelectColor, onVariations, onUpdateBrand, viewMode, setViewMode }: WorkbenchBentoGridProps) {
    // State
    const [isFontSelectorOpen, setIsFontSelectorOpen] = useState(false);
    const [isTweakPanelOpen, setIsTweakPanelOpen] = useState(false);
    const [copiedHex, setCopiedHex] = useState<string | null>(null);
    const [showGuidelines, setShowGuidelines] = useState(true);

    // Generate robust Data URL for the logo using client-side DOM extraction (Build Safe)
    const [logoDataUrl, setLogoDataUrl] = useState('');
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logoRef.current) {
            const svgElement = logoRef.current.querySelector('svg');
            if (svgElement) {
                // clone to avoid mutating the hidden render if needed, but innerHTML is fine
                const svgString = svgElement.outerHTML;

                // Ensure namespace
                const finalSvg = svgString.includes('xmlns')
                    ? svgString
                    : svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');

                // Encode
                const dataUrl = `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(finalSvg)))}`;
                setLogoDataUrl(dataUrl);
            }
        }
    }, [brand]);

    // Presentation Mode Check
    if (viewMode === 'presentation') {
        return (
            <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8 space-y-8 pb-32">
                <SlideCover brand={brand} />
                <SlideStrategy brand={brand} />
                <SlideLogo brand={brand} onSelectColor={onSelectColor} />
                <SlideColors brand={brand} />
                <SlideTypography brand={brand} onUpdateFont={onUpdateFont} />
                <SlideSocial brand={brand} />
                <SlideOutdoor brand={brand} />
                <SlideMockups brand={brand} />
                <SlidePitchDeck brand={brand} />
                <SlideGuidelines brand={brand} />
            </div>
        );
    }

    const mode = isDark ? 'dark' : 'light';
    const tokens = brand.theme.tokens[mode];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedHex(text);
        setTimeout(() => setCopiedHex(null), 1500);
    };

    return (
        <div className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
            {/* Hidden capture element for Logo generation */}
            <div className="fixed -left-[9999px] visibility-hidden pointer-events-none" aria-hidden="true">
                <div ref={logoRef}>
                    <LogoComposition brand={brand} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">

                {/* 1. Main Identity Card (Tall) */}
                <motion.div
                    whileHover={{ scale: 1.005 }}
                    onClick={() => setViewMode?.('presentation')}
                    className="md:col-span-4 md:row-span-2 rounded-[2.5rem] overflow-hidden relative cursor-pointer group shadow-2xl transition-all border border-[#1c1917]"
                    style={{
                        background: tokens.gradient
                            ? `linear-gradient(145deg, ${tokens.gradient[0]}, ${tokens.gradient[1]})`
                            : tokens.bg
                    }}
                >
                    {/* Background Layers */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.4)_0%,transparent_70%)] pointer-events-none mix-blend-overlay" />
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
                    />

                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-20 flex items-center justify-center pointer-events-none">
                        <div className="opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100 bg-white/20 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2">
                            <span>View Brand Deck</span>
                        </div>
                    </div>

                    {/* Tweak Panel Popover */}
                    {isTweakPanelOpen && onUpdateBrand && (
                        <div className="absolute top-20 right-4 z-50 cursor-default" onClick={(e) => e.stopPropagation()}>
                            <LogoTweakPanel brand={brand} onUpdateBrand={onUpdateBrand} onClose={() => setIsTweakPanelOpen(false)} />
                        </div>
                    )}

                    <div className="absolute inset-0 flex flex-col justify-between p-10">
                        {/* Header */}
                        <div className="flex justify-between items-start relative z-30">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-sm">
                                <div className="w-8 h-8 relative">
                                    <LogoComposition brand={brand} overrideColors={{ primary: tokens.gradient ? '#FFFFFF' : tokens.text }} />
                                </div>
                            </div>
                        </div>

                        {/* Centerpiece */}
                        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                            <motion.div layoutId="main-logo" className="w-48 h-48 relative drop-shadow-2xl">
                                <LogoComposition brand={brand} overrideColors={tokens.gradient ? { primary: '#FFFFFF' } : undefined} />
                            </motion.div>
                            <div className="space-y-2">
                                <h1 className="text-5xl font-bold tracking-tighter" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>{brand.name}</h1>
                                <p className="text-lg font-medium opacity-70 tracking-wide uppercase" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>The {brand.vibe} Collection</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-end border-t border-white/10 pt-6">
                            <div className="space-y-1">
                                <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>Est. 2024</p>
                                <p className="text-xs uppercase tracking-widest opacity-60" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>San Francisco, CA</p>
                            </div>
                            <div className="text-xs font-mono opacity-50" style={{ color: tokens.gradient ? '#FFFFFF' : tokens.text }}>{brand.id.slice(0, 8)}</div>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Construction with Guidelines Toggle */}
                <div className="md:col-span-5 md:row-span-1 h-[320px] rounded-[2.5rem] overflow-hidden border border-[#1c1917] relative group shadow-sm">
                    {/* Guidelines Toggle Button */}
                    <button
                        onClick={() => setShowGuidelines(!showGuidelines)}
                        className="absolute top-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-xs font-medium text-white hover:bg-black/70 transition-all"
                    >
                        <Grid3X3 className="w-3 h-3" />
                        <span>Guidelines</span>
                        {showGuidelines ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>

                    {/* Construction Grid */}
                    <LogoConstructionGrid
                        brand={brand}
                        className="w-full h-full"
                        showGuidelines={showGuidelines}
                        showMeasurements={showGuidelines}
                        showGoldenRatio={showGuidelines}
                        showSafeZones={showGuidelines}
                        variant="blueprint"
                    />
                </div>

                {/* Logo Block */}
                <div className="col-span-2 row-span-2 md:col-span-2 md:row-span-1 bg-white rounded-3xl p-6 md:p-8 flex items-center justify-between overflow-hidden relative group hover:shadow-xl transition-all duration-500 border border-[#1c1917]/10">
                    <div className="flex items-center gap-6 md:gap-8 z-10 w-full">
                        <div className="w-24 h-24 md:w-28 md:h-28 shrink-0 relative group/logo">
                            <LogoComposition brand={brand} />
                            <button onClick={(e) => { e.stopPropagation(); onCycleColor?.(); }} className="absolute -bottom-2 -right-2 p-2 bg-stone-900 text-white rounded-full opacity-0 group-hover/logo:opacity-100 transition-all shadow-lg hover:scale-110" title="Cycle Color">
                                <RefreshCw className="w-3 h-3" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                            <h2 className={cn("text-4xl md:text-5xl font-bold tracking-tight text-stone-950 truncate", brand.font.heading)}>{brand.name}</h2>
                            <p className="text-sm font-mono text-stone-400 uppercase tracking-widest pl-0.5">{brand.logoLayout === 'generative' ? 'Generative Mark' : 'Brand Mark'}</p>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none transform translate-y-1/3 translate-x-1/4 scale-150">
                        <LogoComposition brand={brand} />
                    </div>
                </div>

                {/* Safari Mockup */}
                <div className="md:col-span-8 md:row-span-1 h-[380px] bg-white rounded-[2.5rem] overflow-hidden border border-[#1c1917] relative group p-6 flex items-center justify-center">
                    <SafariBrowserMockup brand={brand} className="w-full max-w-3xl shadow-2xl" isDark={isDark} />
                </div>

                {/* 3. Color Palette */}
                <div className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-[#1c1917]">
                    <ColorPaletteHorizontal colors={[{ label: 'Background', hex: tokens.bg }, { label: 'Primary', hex: tokens.primary }, { label: 'Surface', hex: tokens.surface }, { label: 'Text', hex: tokens.text }]} className="h-full" />
                </div>

                {/* 3.5 iPhone */}
                <div className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-[#1c1917]">
                    <MockupIPhoneHome brand={brand} isDark={isDark} />
                </div>

                {/* 4. Mobile Context */}
                <div className="md:col-span-3 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden flex items-center justify-center bg-white border border-[#1c1917] relative">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #000 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                    <div className="scale-[0.8] origin-center shadow-2xl rounded-[2.5rem]">
                        <MockupDevice brand={brand} />
                    </div>
                </div>

                {/* 5. Credit Card */}
                <div className="md:col-span-5 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-[#1c1917] relative" style={{ backgroundColor: tokens.bg }}>
                    <MockupCreditCard brand={brand} isDark={isDark} />
                </div>

                {/* 6. Business Cards */}
                <div className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden bg-white border border-[#1c1917] flex items-center justify-center">
                    <Mockup3DCard brand={brand} stacked />
                </div>

                {/* 7. ID Badge */}
                <div className="md:col-span-4 md:row-span-1 h-[320px] rounded-[2.5rem] shadow-xl overflow-hidden border border-[#1c1917]" style={{ background: `linear-gradient(135deg, ${tokens.surface} 0%, ${tokens.bg} 100%)` }}>
                    <MockupIDBadge brand={brand} isDark={isDark} />
                </div>

                {/* 6. Typography Spec */}
                <div onClick={onSwapFont} className="md:col-span-12 md:row-span-1 h-auto min-h-[400px] rounded-[2.5rem] shadow-xl overflow-hidden relative cursor-pointer group hover:bg-stone-50 transition-colors bg-white border border-[#1c1917]">
                    <div className="p-8 md:p-12 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2">Type Scale</h3>
                                <p className="text-stone-500 font-mono text-xs tracking-tight">8 Styles • {brand.font.name}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setIsFontSelectorOpen(true); }} className="flex items-center gap-2 px-3 py-1.5 bg-stone-100 rounded-full group-hover:bg-stone-200 transition-colors duration-300">
                                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Change Font</span>
                                <RefreshCw className="w-4 h-4 text-stone-500 group-hover:rotate-180 transition-transform duration-500" />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 items-baseline">

                            {/* Column 1: Display */}
                            <div className="space-y-12">
                                <div className="group/item relative">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">H1</span>
                                        <span className="text-[10px] font-mono text-stone-300">• 96px</span>
                                    </div>
                                    <p className={cn("text-8xl md:text-9xl leading-none text-stone-900", brand.font.heading)}>Aa</p>
                                </div>
                                <div className="group/item relative">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">H2</span>
                                        <span className="text-[10px] font-mono text-stone-300">• 60px</span>
                                    </div>
                                    <p className={cn("text-6xl md:text-7xl leading-tight text-stone-900 break-words", brand.font.heading)}>Title</p>
                                </div>
                            </div>

                            {/* Column 2: Major Headings */}
                            <div className="space-y-10 self-center">
                                <div className="group/item flex items-baseline justify-between border-b border-[#1c1917]/10 pb-3">
                                    <p className={cn("text-5xl text-stone-900 leading-tight", brand.font.heading)}>Heading 3</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">48px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-[#1c1917]/10 pb-3">
                                    <p className={cn("text-4xl text-stone-900 leading-tight", brand.font.heading)}>Heading 4</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">36px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-[#1c1917]/10 pb-3">
                                    <p className={cn("text-3xl text-stone-900 leading-tight", brand.font.heading)}>Heading 5</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">30px</span>
                                </div>
                            </div>

                            {/* Column 3: Minor Headings */}
                            <div className="space-y-8 self-center">
                                <div className="group/item flex items-baseline justify-between border-b border-[#1c1917]/10 pb-2">
                                    <p className="text-2xl font-semibold text-stone-900">Heading 6</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">24px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-[#1c1917]/10 pb-2">
                                    <p className="text-xl font-medium text-stone-800">Heading 7</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">20px</span>
                                </div>
                                <div className="group/item flex items-baseline justify-between border-b border-[#1c1917]/10 pb-2">
                                    <p className="text-lg font-medium text-stone-800">Heading 8</p>
                                    <span className="text-[10px] font-mono text-stone-300 shrink-0 ml-4">18px</span>
                                </div>
                            </div>

                            {/* Column 4: Body & UI */}
                            <div className="space-y-8">
                                <div>
                                    <p className="text-base leading-relaxed text-stone-600 mb-3">
                                        The quick brown fox jumps over the lazy dog. A good typography system establishes hierarchy and improves readability across all devices.
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-mono text-stone-300">Body • 16px</span>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#1c1917]/10">
                                    <p className="text-xs text-stone-400 uppercase tracking-widest font-bold mb-2">
                                        Caption Text
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-stone-300">Caption • 12px</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Brand Guidelines Link */}
                <div id="section-guidelines" className="mt-6 md:col-span-12 h-auto min-h-[200px] rounded-[2.5rem] shadow-xl overflow-hidden relative group hover:bg-stone-50 transition-colors bg-white border border-[#1c1917] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-[10px] font-bold text-orange-500 uppercase tracking-[0.2em]">Premium Asset</h3>
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">NEW</span>
                        </div>
                        <h2 className="text-3xl font-bold text-stone-900 mb-2">Brand Guidelines</h2>
                        <p className="text-stone-500 max-w-lg">Get your complete brand manual. Includes clear space rules, color codes (HEX/CMYK), and typography hierarchy in a print-ready PDF.</p>
                    </div>
                    <div onClick={() => setViewMode?.('presentation')}>
                        <Button className="bg-stone-900 text-white rounded-xl h-14 px-8 text-lg hover:scale-105 transition-all shadow-xl gap-3">
                            View Manual <ArrowUpEnd className="rotate-45" size={20} />
                        </Button>
                    </div>
                </div>

                {/* 7.5 Real-World Mockups (Renamed to 3D Mockups) */}
                <div id="section-mockups" className="md:col-span-12 mt-12">
                    <div className="mb-6">
                        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-2">3D Mockups</h3>
                        <p className="text-stone-500 font-mono text-xs tracking-tight">Click any mockup for 3D view • Download as PNG</p>
                    </div>
                    <BrandMockups brand={brand} showCarousel={true} className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-[#1c1917]" />
                </div>

                {/* 8. Social Media Kit */}
                <div id="section-social" className="md:col-span-12 mt-12">
                    <SocialMediaKit brand={brand} />
                </div>

                {/* 10. Brand Graphics System */}
                <div id="section-brand-system" className="md:col-span-12 mt-12">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-[#1c1917]">
                        <BrandGraphicsSystem brand={brand} />
                    </div>
                </div>

                <FontSelector isOpen={isFontSelectorOpen} onClose={() => setIsFontSelectorOpen(false)} currentFontId={brand.font.id} onSelect={(font) => { onUpdateFont?.(font); }} />
            </div>
        </div>
    );
}

