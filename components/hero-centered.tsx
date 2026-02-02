"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { MobileInstructionsModal } from "./landing/MobileInstructionsModal";
import { GlyphMark } from "@/components/logo-engine/LogoGlyph";

export function HeroCentered() {
    const router = useRouter();
    const [brandName, setBrandName] = useState("");
    const [isHovered, setIsHovered] = useState(false);
    const [showMobileInstructions, setShowMobileInstructions] = useState(false);

    const [error, setError] = useState("");

    const proceedToGenerator = () => {
        router.push(`/generator?name=${encodeURIComponent(brandName.trim())}`);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!brandName.trim()) {
            setError("Please enter your brand name");
            return;
        }

        // Check for mobile (window width < 768px for md breakpoint)
        // We use window.innerWidth safely here as this is a client component event handler
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            setShowMobileInstructions(true);
        } else {
            proceedToGenerator();
        }
    };

    return (
        <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 flex flex-col items-center justify-center overflow-hidden bg-stone-50 selection:bg-orange-100 selection:text-orange-900">

            {/* Background: Minimalist Dot Pattern */}
            <div
                className="absolute inset-0 w-full h-full opacity-[0.4]"
                style={{
                    backgroundImage: `radial-gradient(#a8a29e 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Optional: Subtle Vignette to focus center */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-stone-50/50 to-stone-50 pointer-events-none" />

            {/* Main Content */}
            <div className="relative z-10 w-full max-w-4xl px-4 md:px-6 flex flex-col items-center text-center">

                {/* Announcement Pill - Clickable */}


                {/* H1 Headline */}
                <h1 className="mb-8 text-4xl md:text-8xl font-bold tracking-tighter text-stone-900 leading-[0.95] flex flex-col items-center">
                    <span>Launch Your </span>
                    <span>Startup's Brand in</span>
                    <span className="font-editorial text-zinc-500 italic font-normal mt-1 md:mt-2">
                        60 Seconds.
                    </span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-stone-500 max-w-2xl mx-auto leading-relaxed font-medium">
                    Stop wasting hours on generic templates. Generate a unique, engineering-grade brand identity system with logos, typography, and colors ready for production.
                </p>

                {/* Interactive Form Component */}
                <form
                    onSubmit={handleSubmit}
                    className={cn(
                        "mt-8 w-full max-w-lg relative group transition-all duration-300",
                        isHovered ? "scale-[1.02]" : "scale-100"
                    )}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {/* CSS Animation for Border */}
                    <style dangerouslySetInnerHTML={{
                        __html: `
                        @keyframes border-shimmer {
                            0% { background-position: 0% 50%; }
                            50% { background-position: 100% 50%; }
                            100% { background-position: 0% 50%; }
                        }
                    `}} />

                    {/* Animated Border Glow */}
                    {!error && (
                        <div
                            className="absolute -inset-[2px] rounded-full bg-gradient-to-r from-stone-200 via-orange-400/80 to-stone-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-[2px] -z-10"
                            style={{
                                backgroundSize: '200% 200%',
                                animation: 'border-shimmer 3s ease infinite'
                            }}
                        />
                    )}

                    {/* Always visible slow border for "eye catching" - non-hover state */}
                    {!error && (
                        <div
                            className="absolute -inset-[1px] rounded-full bg-gradient-to-r from-orange-100 via-orange-300/50 to-orange-100 opacity-70 blur-[1px] -z-10"
                            style={{
                                backgroundSize: '200% 200%',
                                animation: 'border-shimmer 4s linear infinite'
                            }}
                        />
                    )}

                    {/* Fused Input + Button Container */}
                    <div className={cn(
                        "relative flex items-center w-full h-14 md:h-16 bg-white rounded-full p-1.5 transition-all duration-300",
                        "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] shadow-[inset_0_2px_6px_rgba(0,0,0,0.04)] ring-1 ring-black/5",
                        "group-hover:shadow-[0_25px_60px_-10px_rgba(0,0,0,0.15)] group-hover:ring-orange-500/20",
                        error ? "ring-2 ring-red-500/20 shadow-red-500/10" : ""
                    )}>

                        {/* Input Field */}
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => {
                                setBrandName(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="What's your startup called?"
                            className="flex-1 h-full bg-transparent border-none outline-none px-4 md:px-6 text-base md:text-xl text-stone-900 placeholder:text-stone-300 font-medium rounded-l-full min-w-0"
                            autoFocus
                        />

                        {/* Action Button */}
                        <button
                            type="submit"
                            className={cn(
                                "h-full px-5 md:px-8 rounded-full flex items-center gap-2 font-semibold text-white transition-all duration-300 bg-orange-500 hover:bg-orange-600 shadow-md translate-x-0",
                                !brandName && "animate-[pulse_3s_ease-in-out_infinite] hover:animate-none"
                            )}
                        >
                            <span className="text-sm md:text-base">Generate</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    </div>

                    {/* Check if error exists, show error box. Else show hint */}
                    {error ? (
                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold shadow-sm border border-red-100 animate-in fade-in slide-in-from-top-1 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                            {error}
                        </div>
                    ) : (
                        <div className={cn(
                            "absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-stone-400 flex items-center gap-1 transition-opacity duration-300",
                            brandName.trim() ? "opacity-100" : "opacity-0"
                        )}>
                            <span className="bg-stone-200 px-1.5 py-0.5 rounded text-[10px] tracking-wide text-stone-500">ENTER</span>
                            to launch
                        </div>
                    )}

                </form>

            </div>

            <MobileInstructionsModal
                isOpen={showMobileInstructions}
                onClose={() => setShowMobileInstructions(false)}
                onContinue={proceedToGenerator}
            />
        </section>
    );
}
