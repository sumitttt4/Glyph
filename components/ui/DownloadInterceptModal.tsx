"use client";

import { useEffect, useRef, useCallback } from "react";
import {
    Cancel01Icon,
    LockKeyIcon,
    Tick02Icon,
    Download01Icon,
    Image01Icon,
    SourceCodeIcon,
    Legal01Icon,
    FigmaIcon
} from "hugeicons-react";
import { trackEvent } from "@/lib/analytics";

interface DownloadInterceptModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProceedFree: () => void; // Callback to proceed with low-res download
}

export function DownloadInterceptModal({ isOpen, onClose, onProceedFree }: DownloadInterceptModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Track modal shown
    useEffect(() => {
        if (isOpen) {
            trackEvent("download_attempted", { user_type: "free" });
            closeButtonRef.current?.focus();
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    // Handle ESC key
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleKeyDown]);

    const handleUpgrade = () => {
        trackEvent("download_intercept_upgraded", { user_type: "free" });
        window.location.href = "https://checkout.dodopayments.com/buy/pdt_0NVXcrRSqLnWomnnrEIla?quantity=1&redirect_url=https://glyph.software";
    };

    const handleProceedFree = () => {
        trackEvent("download_proceeded_free", { user_type: "free" });
        onProceedFree();
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            style={{ backgroundColor: "rgba(12, 10, 9, 0.8)" }}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="download-intercept-heading"
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
                    aria-label="Close modal"
                >
                    <Cancel01Icon size={16} className="text-stone-600" />
                </button>

                {/* Header */}
                <div className="p-8 text-center border-b border-stone-100">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
                        <LockKeyIcon size={32} className="text-stone-500" />
                    </div>
                    <h2 id="download-intercept-heading" className="text-2xl font-bold text-stone-950 tracking-tight mb-2">
                        Unlock Full Quality
                    </h2>
                    <p className="text-stone-500 text-sm">
                        Your logo deserves better than 500px.
                    </p>
                </div>

                {/* Comparison */}
                <div className="p-6 space-y-4">
                    {/* Free Download */}
                    <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                        <p className="text-xs font-mono uppercase tracking-wide text-stone-400 mb-3">Free Download</p>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2 text-stone-500 text-sm">
                                <Image01Icon size={16} />
                                <span>500×500px PNG only</span>
                            </li>
                            <li className="flex items-center gap-2 text-stone-400 text-sm">
                                <Cancel01Icon size={16} />
                                <span className="line-through">No SVG</span>
                            </li>
                            <li className="flex items-center gap-2 text-stone-400 text-sm">
                                <Cancel01Icon size={16} />
                                <span className="line-through">No commercial license</span>
                            </li>
                        </ul>
                    </div>

                    {/* Founder Pass */}
                    <div className="bg-gradient-to-br from-[#0C0A09] to-stone-900 rounded-xl p-4 text-white relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500]/10 to-transparent"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-xs font-mono uppercase tracking-wide text-[#FF4500]">Founder Pass</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-stone-500 text-sm line-through">$99</span>
                                    <span className="text-lg font-bold text-[#FF4500]">$29</span>
                                </div>
                            </div>
                            <ul className="space-y-2">
                                <li className="flex items-center gap-2 text-stone-200 text-sm">
                                    <Tick02Icon size={16} className="text-green-400" />
                                    <span>High-res PNG (up to 4000px)</span>
                                </li>
                                <li className="flex items-center gap-2 text-stone-200 text-sm">
                                    <Tick02Icon size={16} className="text-green-400" />
                                    <span>Vector SVG (infinite scaling)</span>
                                </li>
                                <li className="flex items-center gap-2 text-stone-200 text-sm">
                                    <FigmaIcon size={16} className="text-green-400" />
                                    <span>Figma design export</span>
                                </li>
                                <li className="flex items-center gap-2 text-stone-200 text-sm">
                                    <SourceCodeIcon size={16} className="text-green-400" />
                                    <span>React component + Tailwind</span>
                                </li>
                                <li className="flex items-center gap-2 text-stone-200 text-sm">
                                    <Legal01Icon size={16} className="text-green-400" />
                                    <span>Full commercial license</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="p-6 pt-0 space-y-3">
                    <button
                        onClick={handleUpgrade}
                        className="w-full bg-gradient-to-r from-[#FF4500] to-[#FF6332] hover:from-[#E63E00] hover:to-[#E55A2B] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#FF4500]/30 active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2"
                    >
                        <Download01Icon size={16} />
                        Upgrade Now
                    </button>
                    <button
                        onClick={handleProceedFree}
                        className="w-full text-stone-400 hover:text-stone-600 font-medium py-2 transition-colors text-sm focus:outline-none"
                    >
                        Download Low-Res Instead
                    </button>
                </div>
            </div>
        </div>
    );
}
