"use client";

import React, { useRef, useState } from 'react';
import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/logo-engine/LogoComposition';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';


interface SocialMediaKitProps {
    brand: BrandIdentity;
}

export function SocialMediaKit({ brand }: SocialMediaKitProps) {
    const assetsRef = useRef<HTMLDivElement>(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleDownloadAll = async () => {
        if (!assetsRef.current) return;
        setIsExporting(true);

        try {
            const { toPng } = await import('html-to-image');
            // Find all asset containers
            const nodes = assetsRef.current.querySelectorAll('.asset-container');
            const files: { name: string; blob: Blob }[] = [];

            // We use simple promise.all mapping for speed, but sequential might be safer for memory
            for (let i = 0; i < nodes.length; i++) {
                const node = nodes[i] as HTMLElement;
                const name = node.getAttribute('data-name') || `asset-${i}`;

                const dataUrl = await toPng(node, {
                    cacheBust: true,
                    pixelRatio: 2, // 2x retina
                    // backgroundColor defaults to transparent if undefined
                });

                const res = await fetch(dataUrl);
                const blob = await res.blob();
                if (blob) files.push({ name, blob });
            }

            // In a real implementation we would Zip these. 
            // For now, let's just download the first few or use JSZip if we had it imported here.
            // Since we don't have JSZip imported in this file (it's in ExportBrandKit),
            // I'll stick to downloading individually or move this logic to the main ExportBrandKit later.
            // For this component, let's just do a "Download Individual" on click for now, 
            // OR simply render the UI for the main Exporter to capture.

        } catch (e) {
            console.error("Export failed", e);
        } finally {
            setIsExporting(false);
        }
    };

    const downloadAsset = async (id: string, fileName: string) => {
        const node = document.getElementById(id);
        if (!node) return;

        try {
            const { toPng } = await import('html-to-image');
            const dataUrl = await toPng(node, {
                cacheBust: true,
                pixelRatio: 2,
            });
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = dataUrl;
            link.click();
        } catch (e) {
            console.error("Download failed", e);
            alert("Download failed due to browser compatibility.");
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex justify-between items-center bg-stone-50 p-6 rounded-xl border border-stone-200">
                <div>
                    <h2 className="text-xl font-bold text-stone-900">Social Media Assets</h2>
                    <p className="text-sm text-stone-500">
                        Profile pictures and banners optimized for Twitter (X), LinkedIn, and Instagram.
                    </p>
                </div>
            </div>

            <div ref={assetsRef} className="space-y-12">

                {/* 1. PROFILE PICTURES (400x400) */}
                <section className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Profile Pictures (400x400)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {/* Light */}
                        <div className="space-y-3">
                            <div id="sm-profile-light" className="asset-container w-40 h-40 rounded-full border border-stone-200 bg-white flex items-center justify-center relative overflow-hidden group">
                                <div className="w-24 h-24">
                                    <LogoComposition brand={brand} layout="default" />
                                </div>
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => downloadAsset('sm-profile-light', 'profile-light')}>
                                    <Download className="text-white" size={20} />
                                </div>
                            </div>
                            <p className="text-xs text-center text-stone-400 font-mono">White BG</p>
                        </div>

                        {/* Dark */}
                        <div className="space-y-3">
                            <div id="sm-profile-dark" className="asset-container w-40 h-40 rounded-full border border-stone-800 bg-black flex items-center justify-center relative overflow-hidden group">
                                <div className="w-24 h-24">
                                    <LogoComposition brand={brand} layout="default" overrideColors={{ primary: '#FFFFFF' }} />
                                </div>
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => downloadAsset('sm-profile-dark', 'profile-dark')}>
                                    <Download className="text-white" size={20} />
                                </div>
                            </div>
                            <p className="text-xs text-center text-stone-400 font-mono">Black BG</p>
                        </div>

                        {/* Brand Primary */}
                        <div className="space-y-3">
                            <div id="sm-profile-brand" className="asset-container w-40 h-40 rounded-full border border-stone-200 flex items-center justify-center relative overflow-hidden group" style={{ backgroundColor: brand.theme.tokens.light.primary }}>
                                <div className="w-24 h-24">
                                    <LogoComposition brand={brand} layout="default" overrideColors={{ primary: '#FFFFFF' }} />
                                </div>
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => downloadAsset('sm-profile-brand', 'profile-brand')}>
                                    <Download className="text-white" size={20} />
                                </div>
                            </div>
                            <p className="text-xs text-center text-stone-400 font-mono">Brand BG</p>
                        </div>

                        {/* Pattern */}
                        <div className="space-y-3">
                            <div id="sm-profile-pattern" className="asset-container w-40 h-40 rounded-full border border-stone-200 flex items-center justify-center relative overflow-hidden group bg-stone-100">
                                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, black 1px, transparent 1px)', backgroundSize: '10px 10px' }} />
                                <div className="w-24 h-24 relative z-10">
                                    <LogoComposition brand={brand} layout="default" />
                                </div>
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => downloadAsset('sm-profile-pattern', 'profile-pattern')}>
                                    <Download className="text-white" size={20} />
                                </div>
                            </div>
                            <p className="text-xs text-center text-stone-400 font-mono">Pattern BG</p>
                        </div>
                    </div>
                </section>

                {/* 2. TWITTER HEADER (1500x500) - Scaled down for preview */}
                <section className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">Twitter / X Header (1500x500)</h3>
                    <div className="w-full aspect-[3/1] max-w-2xl bg-stone-900 rounded-lg relative overflow-hidden group" id="sm-banner-twitter">
                        <div className="absolute inset-0" style={{ backgroundColor: brand.theme.tokens.dark.bg }} />

                        {/* Abstract Shapes */}
                        <div className="absolute -right-20 -top-20 w-96 h-96 rounded-full blur-3xl opacity-20" style={{ backgroundColor: brand.theme.tokens.dark.primary }} />
                        <div className="absolute -left-20 -bottom-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ backgroundColor: brand.theme.tokens.dark.primary }} />

                        <div className="absolute inset-0 flex items-center justify-center flex-col gap-4">
                            <div className="w-24 h-24">
                                <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                            </div>
                            <div className="text-center">
                                <h1 className="text-3xl font-bold text-white tracking-tight">{brand.name}</h1>
                                <p className="text-white/60 font-mono text-sm tracking-widest uppercase mt-2">{brand.strategy?.tagline}</p>
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => downloadAsset('sm-banner-twitter', 'banner-twitter')}>
                            <Button variant="secondary" className="gap-2">
                                <Download size={16} /> Download PNG
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 3. LINKEDIN COVER (1584x396) */}
                <section className="space-y-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-stone-500">LinkedIn Cover (1584x396)</h3>
                    <div className="w-full aspect-[4/1] max-w-2xl bg-white border border-stone-200 rounded-lg relative overflow-hidden group" id="sm-banner-linkedin">
                        <div className="absolute inset-0 bg-stone-50" />
                        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }} />

                        <div className="absolute inset-0 flex items-center justify-between px-16">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-4xl font-black text-stone-900 tracking-tighter uppercase" style={{ color: brand.theme.tokens.light.primary }}>
                                    {brand.name}
                                </h1>
                                <div className="h-1 w-20 bg-stone-900" />
                            </div>
                            <div className="w-20 opacity-20">
                                <LogoComposition brand={brand} />
                            </div>
                        </div>

                        <div className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer" onClick={() => downloadAsset('sm-banner-linkedin', 'banner-linkedin')}>
                            <Button variant="secondary" className="gap-2">
                                <Download size={16} /> Download PNG
                            </Button>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
}
