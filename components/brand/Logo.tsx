// components/brand/Logo.tsx
import React from "react";

// 1. THE ICON: "The Kinetic Block"
// Usage: <LogoIcon className="w-8 h-8" />
export const LogoIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* The Container: International Orange Squircle */}
        <rect width="32" height="32" rx="8" fill="#FF4500" />

        {/* The Spark: Geometric Negative Space */}
        <path
            d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z"
            fill="white"
        />
    </svg>
);

// 2. THE FULL LOCKUP
// Usage: <LogoFull />
export const LogoFull = ({
    className = "",
    textColor = "text-[#0C0A09]"
}: {
    className?: string;
    textColor?: string;
}) => (
    <div className={`flex items-center gap-3 ${className}`}>
        <LogoIcon className="w-8 h-8" />
        <span className={`font-sans text-2xl font-extrabold tracking-tighter ${textColor}`}>
            Glyph<span className="text-[#FF4500]">.</span>
        </span>
    </div>
);
