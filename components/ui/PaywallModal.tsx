"use client";

import { useEffect, useRef, useCallback } from "react";
import {
    Cancel01Icon,
    SparklesIcon,
    Tick02Icon,
    FlashIcon,
    Download01Icon,
    SourceCodeIcon,
    Legal01Icon,
    FigmaIcon
} from "hugeicons-react";
import { trackEvent } from "@/lib/analytics";

interface PaywallModalProps {
    isOpen: boolean;
    onClose: () => void;
    generatedLogos?: string[]; // Optional array of logo thumbnail URLs
}

const FEATURES = [
    { icon: FlashIcon, text: "Unlimited generations" },
    { icon: Download01Icon, text: "High-res exports (PNG + SVG)" },
    { icon: FigmaIcon, text: "Figma design system export" },
    { icon: SourceCodeIcon, text: "React components & Tailwind config" },
    { icon: Legal01Icon, text: "Full commercial license" },
];

export function PaywallModal({ isOpen, onClose, generatedLogos = [] }: PaywallModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    // Track modal shown
    useEffect(() => {
        if (isOpen) {
            trackEvent("paywall_modal_shown", { generations_used: 3 });
            // Focus trap - focus the close button when modal opens
            closeButtonRef.current?.focus();
            // Prevent body scroll
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
            handleDismiss();
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, handleKeyDown]);

    const handleDismiss = () => {
        trackEvent("paywall_modal_dismissed", { generations_used: 3 });
        // Set localStorage to not show for 24 hours
        localStorage.setItem("paywall_dismissed_at", Date.now().toString());
        onClose();
    };

    const handleUpgrade = () => {
        trackEvent("paywall_modal_converted", { generations_used: 3 });
        window.location.href = "https://checkout.dodopayments.com/buy/pdt_0NVXcrRSqLnWomnnrEIla?quantity=1&redirect_url=https://glyph.software";
    };

    // Handle click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            handleDismiss();
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
            aria-labelledby="paywall-heading"
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp"
            >
                {/* Close Button */}
                <button
                    ref={closeButtonRef}
                    onClick={handleDismiss}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-stone-400"
                    aria-label="Close modal"
                >
                    <Cancel01Icon size={16} className="text-stone-600" />
                </button>

                {/* Header */}
                <div className="bg-gradient-to-br from-[#0C0A09] to-stone-900 p-8 text-white text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FF4500]/20 flex items-center justify-center">
                        <SparklesIcon size={32} className="text-[#FF4500]" />
                    </div>
                    <h2 id="paywall-heading" className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
                        You&apos;ve Hit Your Free Limit
                    </h2>
                    <p className="text-stone-400 text-sm">
                        You&apos;ve explored the possibilities. Ready to own your brand?
                    </p>
                </div>

                {/* Generated Logos Preview (if available) */}
                {generatedLogos.length > 0 && (
                    <div className="px-8 py-4 bg-stone-50 border-b border-stone-200">
                        <p className="text-xs text-stone-400 text-center mb-3 font-mono uppercase tracking-wide">Your creations</p>
                        <div className="flex justify-center gap-3">
                            {generatedLogos.slice(0, 3).map((logo, index) => (
                                <div
                                    key={index}
                                    className="w-16 h-16 rounded-xl bg-white border border-stone-200 shadow-sm overflow-hidden"
                                >
                                    <img src={logo} alt={`Generated logo ${index + 1}`} className="w-full h-full object-contain p-2" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Body */}
                <div className="p-8">
                    {/* Features */}
                    <ul className="space-y-3 mb-8">
                        {FEATURES.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3 text-stone-700">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                                    <feature.icon size={16} className="text-green-600" />
                                </div>
                                <span className="text-sm font-medium">{feature.text}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Pricing */}
                    <div className="text-center mb-6">
                        <p className="text-stone-400 text-xs uppercase tracking-wide mb-2">One-time payment. Lifetime access.</p>
                        <div className="flex items-baseline justify-center gap-2">
                            <span className="text-stone-400 text-xl line-through">$99</span>
                            <span className="text-4xl font-bold text-[#FF4500]">$29</span>
                        </div>
                        <p className="text-[#FF4500] text-xs font-medium mt-1">Early Access Price</p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleUpgrade}
                            className="w-full bg-gradient-to-r from-[#FF4500] to-[#FF6332] hover:from-[#E63E00] hover:to-[#E55A2B] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#FF4500]/30 active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2"
                        >
                            <SparklesIcon size={16} />
                            Get Lifetime Access
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="w-full text-stone-400 hover:text-stone-600 font-medium py-2 transition-colors text-sm focus:outline-none"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Utility to check if paywall should be shown
export function shouldShowPaywall(): boolean {
    const dismissedAt = localStorage.getItem("paywall_dismissed_at");
    if (!dismissedAt) return true;

    const dismissedTime = parseInt(dismissedAt, 10);
    const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60);

    // Show again after 24 hours
    return hoursSinceDismissed >= 24;
}
