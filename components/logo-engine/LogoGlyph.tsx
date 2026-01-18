import React from "react";

/**
 * NEW GLYPH LOGO - Geometric Interlace Mark
 * Based on user's preferred generated logo (Tech vibe)
 */

// The geometric interlace path (matches the generated logo)
const GLYPH_MARK_PATH = 'M12 2L2 12h5v10h10v-5l5-5H12z M7 12l5-5 5 5-5 5-5-5z';

// 1. THE ICON ONLY (For Favicons, Footer small marks, Mobile)
export const GlyphIcon = ({ className = "w-8 h-8", color = "#FF5500" }: { className?: string; color?: string }) => (
    <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Glyph Icon"
    >
        <rect width="32" height="32" rx="8" fill={color} />
        {/* Geometric Interlace Mark - Scaled and centered */}
        <g transform="translate(4, 4) scale(1)">
            <path d={GLYPH_MARK_PATH} fill="white" />
        </g>
    </svg>
);

// 2. JUST THE MARK (No background, for overlays)
export const GlyphMark = ({ className = "w-8 h-8", color = "#FF5500" }: { className?: string; color?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Glyph Mark"
    >
        <path d={GLYPH_MARK_PATH} fill={color} />
    </svg>
);

// 3. THE FULL LOGO (Icon + Text) - For Header & Hero
export const GlyphLogo = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-3 ${className} select-none group`}>
        <div className="transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            <GlyphIcon className="w-8 h-8" />
        </div>
        <span className="font-sans text-2xl font-extrabold tracking-tighter text-[#0C0A09] leading-none mt-0.5">
            Glyph<span className="text-[#FF5500]">.</span>
        </span>
    </div>
);

// 4. WHITE VERSION (For dark backgrounds)
export const GlyphLogoWhite = ({ className = "" }: { className?: string }) => (
    <div className={`flex items-center gap-3 ${className} select-none group`}>
        <div className="transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
            <GlyphIcon className="w-8 h-8" />
        </div>
        <span className="font-sans text-2xl font-extrabold tracking-tighter text-white leading-none mt-0.5">
            Glyph<span className="text-[#FF5500]">.</span>
        </span>
    </div>
);
