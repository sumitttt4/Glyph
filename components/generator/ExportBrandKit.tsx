"use client";

import React, { useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Loader2, Download, CheckCircle2 } from 'lucide-react';
import {
    SlideCover,
    SlideStrategy,
    SlideLogo,
    SlideColors,
    SlideTypography,
    SlideSocial,
    SlideOutdoor
} from '@/components/generator/BrandSlides';
import { cn } from '@/lib/utils'; // Assuming standard utils

interface ExportBrandKitProps {
    brand: BrandIdentity;
    className?: string;
}

export function ExportBrandKit({ brand, className }: ExportBrandKitProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 100
    const [status, setStatus] = useState('');

    const handleExport = async () => {
        setIsExporting(true);
        setStatus('Preparing assets...');
        setProgress(5);

        try {
            const zip = new JSZip();
            const assetsFolder = zip.folder(`glyph-${brand.name.toLowerCase().replace(/\s+/g, '-')}-kit`);

            if (!assetsFolder) throw new Error("Failed to create zip folder");

            // List of slides to capture
            // We renders them in a hidden container below. 
            // We need to wait for them to render. 
            // A simple timeout or useLayoutEffect might be needed, but usually waiting 1s after state change is safe for a hack.
            // Better: They are always rendered if isExporting is true.

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for render

            const slides = [
                { id: 'export-slide-cover', name: '01-Cover.png' },
                { id: 'export-slide-strategy', name: '02-Strategy.png' },
                { id: 'export-slide-logo', name: '03-Logo-Marks.png' },
                { id: 'export-slide-colors', name: '04-Colors.png' },
                { id: 'export-slide-typography', name: '05-Typography.png' },
                { id: 'export-slide-social', name: '06-Social-Media.png' },
                { id: 'export-slide-outdoor', name: '07-Outdoor.png' },
            ];

            const totalSteps = slides.length + 2; // + zipping + saving
            let completedSteps = 0;

            for (const slide of slides) {
                setStatus(`Generating ${slide.name}...`);
                const element = document.getElementById(slide.id);
                if (element) {
                    // Force white background for consistency if transparent
                    const dataUrl = await toPng(element, {
                        quality: 0.95,
                        backgroundColor: '#000000' // Slides are dark usually, let's check. 
                        // Actually BrandSlides have `bg-stone-950` so they are opaque.
                    });

                    // Remove header ("data:image/png;base64,")
                    const base64Data = dataUrl.split(',')[1];
                    assetsFolder.file(slide.name, base64Data, { base64: true });
                }
                completedSteps++;
                setProgress(Math.round((completedSteps / totalSteps) * 100));
            }

            setStatus('Bundling files...');
            const content = await zip.generateAsync({ type: 'blob' });

            setStatus('Downloading...');
            setProgress(100);
            saveAs(content, `glyph-${brand.name.toLowerCase()}-kit.zip`); // Using file-saver

            // Graceful finish
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsExporting(false);
            setProgress(0);

        } catch (error) {
            console.error('Export failed:', error);
            setStatus('Export failed. Please try again.');
            setTimeout(() => setIsExporting(false), 3000);
        }
    };

    return (
        <>
            <button
                onClick={handleExport}
                disabled={isExporting}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                    className
                )}
            >
                {isExporting ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
                {isExporting ? 'Exporting...' : 'Download Kit'}
            </button>

            {/* Hidden Rendering Container */}
            {/* We position it fixed off-screen but visible to the browser engine */}
            {isExporting && (
                <div
                    className="fixed top-0 left-0 z-0 pointer-events-none opacity-0"
                    style={{ left: '-9999px' }} // Off-screen
                // style={{ zIndex: -100, visibility: 'hidden' }} // visibility hidden breaks html-to-image sometimes
                // "opacity: 0" might also break it if it checks visibility.
                // Safest is absolute positioning far away.
                >
                    {/* Fixed Width Container to ensure consistent export size (e.g. 1920x1080) */}
                    <div className="w-[1920px]">
                        <div id="export-slide-cover"><SlideCover brand={brand} id="export-slide-cover-inner" /></div>
                        <div id="export-slide-strategy"><SlideStrategy brand={brand} id="export-slide-strategy-inner" /></div>
                        <div id="export-slide-logo"><SlideLogo brand={brand} id="export-slide-logo-inner" /></div>
                        <div id="export-slide-colors"><SlideColors brand={brand} id="export-slide-colors-inner" /></div>
                        <div id="export-slide-typography"><SlideTypography brand={brand} id="export-slide-typography-inner" /></div>
                        <div id="export-slide-social"><SlideSocial brand={brand} id="export-slide-social-inner" /></div>
                        <div id="export-slide-outdoor"><SlideOutdoor brand={brand} id="export-slide-outdoor-inner" /></div>
                    </div>
                </div>
            )}

            {/* Status Modal Overlay */}
            {isExporting && (
                <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-stone-900 border border-white/10 rounded-2xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto relative">
                            {/* Improved Progress Circle */}
                            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                                <path
                                    className="text-white/10"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                />
                                <path
                                    className="text-[#CCFF00] drop-shadow-[0_0_10px_rgba(204,255,0,0.5)]"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeDasharray={`${progress}, 100`}
                                    strokeWidth="3"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-mono font-bold text-white">
                                {progress}%
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white">Generating Brand Kit</h3>
                            <p className="text-sm text-white/50 animate-pulse">{status}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
