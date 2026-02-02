"use client";

import { Download, RefreshCw, History, Sparkles, Check, Copy } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

interface ColorSwatch {
    hex: string;
    name: string;
}

interface PostGenerationSuccessProps {
    logoSvg: string; // SVG string or data URL
    brandName: string;
    colorPalette: ColorSwatch[];
    onDownloadPackage: () => void;
    onGenerateAnother: () => void;
    onViewHistory: () => void;
}

export function PostGenerationSuccess({
    logoSvg,
    brandName,
    colorPalette,
    onDownloadPackage,
    onGenerateAnother,
    onViewHistory,
}: PostGenerationSuccessProps) {
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleCopyColor = async (hex: string) => {
        await navigator.clipboard.writeText(hex);
        setCopiedColor(hex);
        setTimeout(() => setCopiedColor(null), 2000);
    };

    const handleDownload = () => {
        trackEvent("download_completed", { user_type: "paid", brand_name: brandName });
        onDownloadPackage();
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-fadeIn">
            {/* Success Card */}
            <div className="bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-stone-50 to-white p-6 md:p-8 text-center border-b border-stone-100">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        <Check className="w-3 h-3" />
                        Generation Complete
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-950 tracking-tight mb-1">
                        Beautiful. Let&apos;s ship it.
                    </h2>
                    <p className="text-stone-500 text-sm">
                        Your brand identity for <span className="font-semibold text-stone-700">{brandName}</span> is ready.
                    </p>
                </div>

                {/* Logo Preview */}
                <div className="p-8 md:p-12 flex items-center justify-center bg-stone-50">
                    <div className="w-48 h-48 md:w-64 md:h-64 rounded-2xl bg-white shadow-lg border border-stone-200 p-6 flex items-center justify-center">
                        {logoSvg.startsWith("<svg") ? (
                            <div
                                className="w-full h-full"
                                dangerouslySetInnerHTML={{ __html: logoSvg }}
                            />
                        ) : (
                            <img
                                src={logoSvg}
                                alt={`${brandName} logo`}
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                </div>

                {/* Color Palette */}
                <div className="px-8 py-6 border-t border-stone-100">
                    <p className="text-xs font-mono uppercase tracking-wide text-stone-400 mb-4">Color Palette</p>
                    <div className="flex flex-wrap gap-3">
                        {colorPalette.map((color) => (
                            <button
                                key={color.hex}
                                onClick={() => handleCopyColor(color.hex)}
                                className="group flex items-center gap-2 bg-stone-50 hover:bg-stone-100 rounded-lg px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#FF4500]"
                                title={`Copy ${color.hex}`}
                            >
                                <div
                                    className="w-6 h-6 rounded-md shadow-sm border border-stone-200"
                                    style={{ backgroundColor: color.hex }}
                                />
                                <div className="text-left">
                                    <p className="text-xs font-medium text-stone-700">{color.name}</p>
                                    <p className="text-[10px] font-mono text-stone-400 group-hover:text-stone-600 transition-colors">
                                        {copiedColor === color.hex ? (
                                            <span className="text-green-600 flex items-center gap-1">
                                                <Check className="w-2.5 h-2.5" />
                                                Copied!
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1">
                                                <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                {color.hex}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="p-6 md:p-8 bg-stone-50 border-t border-stone-100">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Primary: Download */}
                        <button
                            onClick={handleDownload}
                            className="flex-1 bg-gradient-to-r from-[#FF4500] to-[#FF6332] hover:from-[#E63E00] hover:to-[#E55A2B] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#FF4500]/30 active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2"
                        >
                            <Download className="w-5 h-5" />
                            Download Full Package
                        </button>

                        {/* Secondary: Generate Another */}
                        <button
                            onClick={onGenerateAnother}
                            className="flex-1 sm:flex-none bg-white hover:bg-stone-100 text-stone-700 font-semibold py-4 px-6 rounded-xl transition-all border border-stone-200 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Generate Another
                        </button>
                    </div>

                    {/* Tertiary: View History */}
                    <button
                        onClick={onViewHistory}
                        className="w-full mt-3 text-stone-400 hover:text-stone-600 font-medium py-2 transition-colors text-sm flex items-center justify-center gap-2 focus:outline-none"
                    >
                        <History className="w-4 h-4" />
                        View Generation History
                    </button>
                </div>

                {/* Package Contents Preview */}
                <div className="px-8 py-5 bg-stone-100/50 border-t border-stone-200">
                    <p className="text-xs text-stone-400 text-center">
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        Package includes: SVG, PNG (1000-4000px), Tailwind config, React component, colors.json, README
                    </p>
                </div>
            </div>
        </div>
    );
}
