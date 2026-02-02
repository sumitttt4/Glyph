"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

interface UrgencyBannerProps {
    spotsLeft?: number;
    isPaidUser?: boolean;
}

export function UrgencyBanner({ spotsLeft = 47, isPaidUser = false }: UrgencyBannerProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // State to track if the loop is active
    const [isLoopActive, setIsLoopActive] = useState(true);

    const handleManualDismiss = () => {
        setIsLoopActive(false); // Stop the loop
        setIsAnimating(true);
        setIsVisible(false);
        document.body.classList.remove("has-banner");
        setTimeout(() => {
            localStorage.setItem("urgency_banner_dismissed_at", Date.now().toString());
        }, 300);
    };

    useEffect(() => {
        // Don't show to paid users
        if (isPaidUser) return;

        // Check if dismissed within last 7 days


        if (!isLoopActive) return;

        let cycleTimeout: NodeJS.Timeout;

        const runCycle = () => {
            // STEP 1: Wait 3s before showing
            cycleTimeout = setTimeout(() => {
                if (!isLoopActive) return;

                // Show Banner
                setIsAnimating(true);
                // Force layout recalc
                setTimeout(() => {
                    setIsVisible(true);
                    setIsAnimating(false);
                    document.body.classList.add("has-banner");

                    // STEP 2: Wait 3s while visible, then hide
                    cycleTimeout = setTimeout(() => {
                        if (!isLoopActive) return;

                        // Hide Banner
                        setIsAnimating(true);
                        setIsVisible(false);
                        document.body.classList.remove("has-banner");

                        // STEP 3: Restart cycle (loop)
                        cycleTimeout = setTimeout(runCycle, 1000);

                    }, 3000); // Visible duration
                }, 50);
            }, 3000); // Hidden duratiom
        };

        runCycle();

        return () => {
            clearTimeout(cycleTimeout);
            document.body.classList.remove("has-banner");
        };
    }, [isPaidUser, isLoopActive]);



    // if (!isVisible && !isAnimating) return null;

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[100] transition-transform duration-500 ease-out transform ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            {/* Minimal Brand Styling: Solid Black with Orange Accent */}
            <div className="bg-[#0C0A09] border-b border-stone-800 shadow-xl">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4 relative">

                    {/* Content */}
                    <div className="flex items-center gap-2 md:gap-3 text-center flex-wrap justify-center relative z-10 text-xs md:text-sm font-medium">

                        {/* Mobile Text (< 640px) */}
                        <span className="block sm:hidden text-stone-300">
                            Lifetime Access <span className="text-[#FF4500] font-bold">$29</span>.
                        </span>

                        {/* Desktop Text (>= 640px) */}
                        <span className="hidden sm:inline text-stone-300">
                            <span className="text-[#FF4500] font-bold">Early Access:</span>
                            {" "}Lifetime license for $29.
                        </span>

                        <div className="flex items-center gap-2">
                            <span className="text-stone-500 hidden lg:inline">Price increases to $99 soon.</span>
                            <span className="bg-white/10 text-stone-200 text-[10px] md:text-xs px-2 py-0.5 rounded flex items-center gap-1.5 animate-pulse">
                                <Clock className="w-3 h-3 text-[#FF4500]" />
                                {spotsLeft} spots
                            </span>
                        </div>

                        <Link
                            href="#pricing"
                            className="inline-flex items-center gap-1 text-white hover:text-[#FF4500] transition-colors ml-1 group"
                        >
                            <span className="hidden sm:inline">Claim Your Spot</span>
                            <span className="sm:hidden">Get It</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Close Button */}
                    <button
                        onClick={handleManualDismiss}
                        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-8 h-8 md:w-6 md:h-6 flex items-center justify-center text-stone-500 hover:text-white transition-colors focus:outline-none"
                        aria-label="Dismiss banner"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
