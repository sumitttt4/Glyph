// components/brand/Logo.tsx
import React from "react";

// ==========================================
// 1. THE STANDALONE ICON: "The Kinetic Block"
// Use for: Favicons, App Icons, Mobile Headers
// Example: <LogoIcon className="w-8 h-8" />
// ==========================================
export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Glyph Icon"
    >
        {/* The Container: International Orange Squircle (Smooth Corners) */}
        <rect width="32" height="32" rx="8" fill="#FF4500" />

        {/* The Kinetic Spark: Geometric Negative Space */}
        <path
            d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z"
            fill="white"
        />
    </svg>
);

// ==========================================
// 2. THE FULL LOGO LOCKUP
// Use for: Main Navigation, Footer, Hero Section
// Example: <LogoFull />
// ==========================================
export const LogoFull = ({
    className = "",
    textColor = "text-[#0C0A09]"
}: {
    className?: string;
    textColor?: string;
}) => (
    <div className={`flex items-center gap-3 ${className} select-none`}>
        <LogoIcon className="w-8 h-8" />
        {/* Manrope Bold with tight engineering spacing */}
        <span className={`font-sans text-2xl font-extrabold tracking-tighter ${textColor} leading-none mt-0.5`}>
            Glyph<span className="text-[#FF4500]">.</span>
        </span>
    </div>
);
