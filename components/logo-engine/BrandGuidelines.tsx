"use client";

import React, { useRef, useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

import jsPDF from 'jspdf';

interface BrandGuidelinesProps {
    brand: BrandIdentity;
}

/**
 * BrandGuidelines - The "$500 Brand Package" in a single printable page
 * Shows Logo System, Color System, Typography System, and Usage Rules
 */
export function BrandGuidelines({ brand }: BrandGuidelinesProps) {
    const t = brand.theme.tokens;
    const printRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadPDF = async () => {
        if (!printRef.current) return;
        setIsExporting(true);

        try {
            const { toPng } = await import('html-to-image');
            const element = printRef.current;

            // Generate PNG using html-to-image
            const imgData = await toPng(element, {
                cacheBust: true,
                backgroundColor: '#ffffff',
                pixelRatio: 2, // Higher resolution
                // Fix for possible font loading issues or specific element sizing
                width: 1200, // Force width for desktop view
                style: {
                    width: '1200px', // Ensure layout renders at 1200px
                    height: 'auto'
                }
            });

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Load image to get dimensions
            const img = new window.Image();
            img.src = imgData;
            await new Promise((resolve) => { img.onload = resolve; });

            const imgWidth = img.width;
            const imgHeight = img.height;

            // Calculate height of the image on the PDF
            const imgHeightOnPdf = imgHeight * (pdfWidth / imgWidth);

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightOnPdf);
            pdf.save(`${brand.name.replace(/\s+/g, '_')}_Brand_Guidelines.pdf`);
        } catch (error) {
            console.error("PDF Export failed", error);
            alert("Export failed due to browser compatibility. Please try a different browser or screenshot.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-stone-50 p-6 rounded-xl border border-stone-200">
                <div>
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-700">
                        Brand Guidelines Export
                    </h2>
                    <p className="text-sm text-stone-500">
                        Download your comprehensive visual identity system as a PDF.
                    </p>
                </div>

                <Button
                    onClick={handleDownloadPDF}
                    disabled={isExporting}
                    className="bg-stone-900 hover:bg-stone-800 text-white gap-2 shadow-lg"
                >
                    {isExporting ? <Loader2 className="animate-spin" size={16} /> : <Download size={16} />}
                    {isExporting ? 'Generating PDF...' : 'Download PDF Manual'}
                </Button>
            </div>

            <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-2xl border border-stone-200 print:shadow-none print:border-none overflow-hidden hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-shadow duration-500">
                <div ref={printRef} className="bg-white">
                    {/* HEADER */}
                    <header className="p-12 md:p-16 border-b border-stone-100 bg-stone-50/50">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className={cn("text-5xl md:text-6xl font-black text-stone-900 mb-6 tracking-tight", brand.font.heading)}>
                                    {brand.name}
                                </h1>
                                <p className="text-stone-500 text-xl max-w-lg leading-relaxed">
                                    Visual Identity System <br />
                                    <span className="text-sm uppercase tracking-widest opacity-60 font-mono mt-2 block">Version 1.0</span>
                                </p>
                            </div>
                            <div className="hidden md:block">
                                <div className="w-24 h-24">
                                    <LogoComposition brand={brand} />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* SECTION 1: LOGO CONSTRUCTION */}
                    <section className="p-12 md:p-16 border-b border-stone-100">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="text-xs font-mono text-white bg-stone-900 px-2 py-1 rounded">01</span>
                            <h2 className="font-bold text-lg text-stone-900 uppercase tracking-widest">Logomark</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Primary Mark - Light Background */}
                            <div className="group relative p-16 bg-white rounded-2xl border-2 border-stone-100 flex items-center justify-center aspect-[4/3]">
                                {/* Grid Lines Overlay */}
                                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

                                {/* Clear Space Guide */}
                                <div className="absolute inset-0 border border-dashed border-stone-300 m-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="w-40 h-40 scale-100 group-hover:scale-90 transition-transform duration-500">
                                    <LogoComposition brand={brand} />
                                </div>
                            </div>

                            {/* Symbol - Dark Background */}
                            <div className="relative p-16 bg-stone-950 rounded-2xl border border-stone-900 flex items-center justify-center aspect-[4/3] text-white">
                                <div className="w-32 h-32">
                                    <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                                </div>
                            </div>
                        </div>

                        {/* Rules Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="p-6 bg-stone-50 rounded-xl">
                                <h4 className="font-bold text-stone-900 mb-2 text-sm">Clear Space</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">Always maintain a minimum clear space defined by the height of the logomark to ensure legibility.</p>
                            </div>
                            <div className="p-6 bg-stone-50 rounded-xl">
                                <h4 className="font-bold text-stone-900 mb-2 text-sm">Minimum Size</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">Do not reproduce the logo smaller than 24px in digital or 10mm in print.</p>
                            </div>
                            <div className="p-6 bg-stone-50 rounded-xl">
                                <h4 className="font-bold text-stone-900 mb-2 text-sm">Placement</h4>
                                <p className="text-xs text-stone-500 leading-relaxed">Prioritize the top-left corner for web, and center alignment for print materials.</p>
                            </div>
                        </div>
                    </section>

                    {/* SECTION 2: COLOR SYSTEM */}
                    <section className="p-12 md:p-16 border-b border-stone-100">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="text-xs font-mono text-white bg-stone-900 px-2 py-1 rounded">02</span>
                            <h2 className="font-bold text-lg text-stone-900 uppercase tracking-widest">Color Palette</h2>
                        </div>

                        {/* Light Mode */}
                        <div className="mb-10">
                            <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                                Primary Scale
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ColorSwatch name="Brand Primary" hex={t.light.primary} large />
                                <ColorSwatch name="Brand Accent" hex={t.light.primary} />
                                <ColorSwatch name="Surface" hex={t.light.bg} />
                                <ColorSwatch name="Text" hex={t.light.text} />
                            </div>
                        </div>

                        <div className="p-6 bg-stone-900 rounded-2xl text-white">
                            <h4 className="text-xs font-bold opacity-60 uppercase tracking-wider mb-6 flex items-center gap-2">
                                Dark Mode Tokens
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ColorSwatch name="Primary Dark" hex={t.dark.primary} dark />
                                <ColorSwatch name="Accent Dark" hex={t.dark.primary} dark />
                                <ColorSwatch name="Surface Dark" hex={t.dark.bg} dark />
                                <ColorSwatch name="Text Dark" hex={t.dark.text} dark />
                            </div>
                        </div>
                    </section>

                    {/* SECTION 3: TYPOGRAPHY */}
                    <section className="p-12 md:p-16">
                        <div className="flex items-center gap-4 mb-12">
                            <span className="text-xs font-mono text-white bg-stone-900 px-2 py-1 rounded">03</span>
                            <h2 className="font-bold text-lg text-stone-900 uppercase tracking-widest">Typography</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="col-span-1">
                                <div className="sticky top-8">
                                    <h1 className="text-[120px] leading-none font-bold text-stone-900 opacity-10 mb-4 select-none">
                                        Aa
                                    </h1>
                                    <h4 className="text-2xl font-bold text-stone-900">{brand.font.name}</h4>
                                    <p className="text-stone-500 mt-2">Primary Typeface</p>
                                    <div className="flex gap-2 mt-4 flex-wrap">
                                        <span className="px-2 py-1 bg-stone-100 text-[10px] font-mono rounded">400 Regular</span>
                                        <span className="px-2 py-1 bg-stone-100 text-[10px] font-mono rounded">600 SemiBold</span>
                                        <span className="px-2 py-1 bg-stone-100 text-[10px] font-mono rounded">700 Bold</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 space-y-10">
                                {/* Display */}
                                <div className="border-b border-stone-100 pb-8">
                                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2 block">Display • H1</span>
                                    <h1 className={cn("text-5xl md:text-6xl font-black text-stone-900", brand.font.heading)}>
                                        Make it simple. <br />
                                        Make it memorable.
                                    </h1>
                                </div>

                                {/* Body */}
                                <div>
                                    <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest mb-2 block">Body Copy • P</span>
                                    <p className={cn("text-lg md:text-xl text-stone-600 leading-relaxed max-w-lg", brand.font.body)}>
                                        A brand for a company is like a reputation for a person. You earn reputation by trying to do hard things well.
                                    </p>
                                </div>

                                <div className="bg-stone-50 p-6 rounded-xl">
                                    <p className="text-xs font-mono text-stone-500 uppercase tracking-widest">
                                        0123456789 • !@#$%^&*()_+ • The quick brown fox jumps over the lazy dog.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

// Helper component for color swatches
function ColorSwatch({ name, hex, dark = false, large = false }: { name: string; hex: string; dark?: boolean; large?: boolean }) {
    return (
        <div className="space-y-3 group">
            <div
                className={cn(
                    "rounded-xl shadow-sm transition-transform duration-300 group-hover:scale-105",
                    !dark && "border border-stone-200/50",
                    large ? "aspect-square" : "h-24"
                )}
                style={{ backgroundColor: hex }}
            />
            <div>
                <span className={cn("text-xs font-bold block", dark ? "text-stone-300" : "text-stone-900")}>{name}</span>
                <span className={cn("text-[10px] font-mono opacity-60", dark ? "text-stone-400" : "text-stone-500")}>{hex?.toUpperCase()}</span>
            </div>
        </div>
    );
}
