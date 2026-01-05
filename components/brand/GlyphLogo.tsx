import React from "react";

// 1. THE ICON ONLY (For Favicons, Footer small marks, Mobile)
export const GlyphIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
    <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Glyph Icon"
    >
        <rect width="32" height="32" rx="8" fill="#FF4500" />
        <path d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z" fill="white" />
    </svg>
);

// 2. THE FULL LOGO (Icon + Text) - For Header & Hero
export const GlyphLogo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-3 ${className} select-none group`}>
        <div className="transform transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110">
            <GlyphIcon className="w-8 h-8" />
        </div>
        <span className="font-sans text-2xl font-extrabold tracking-tighter text-[#0C0A09] leading-none mt-0.5">
            Glyph<span className="text-[#FF4500]">.</span>
        </span>
    </div>
);
