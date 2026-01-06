import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
// We assume fonts are handled by the parent/global context, but we can accept fontFamily.

// 1. THE LAYOUT VARIATIONS
// This is the secret to variety. It changes the physical structure.
export type LogoAssemblerLayout = 'icon_left' | 'icon_right' | 'stacked' | 'badge' | 'monogram';

// 2. THE CONTAINER SHAPES
export const ASSEMBLER_SHAPES: Record<string, string> = {
    'squircle': 'rounded-2xl',
    'circle': 'rounded-full',
    'sharp': 'rounded-none',
    'pill': 'rounded-full', // Adjusted to generic pill utility if needed, strictly rounded-full usually works for square aspect
    'ghost': 'bg-transparent border-2', // Outline style
    'hexagon': 'clip-path-hexagon', // CSS class support needed
    'diamond': 'rotate-45 rounded-xl',
};

interface LogoAssemblerProps {
    iconName: string;
    brandName: string; // e.g. "Glyph"
    layout?: LogoAssemblerLayout;
    shape?: string;
    primaryColor: string;
    fontFamily?: string;
    className?: string;
    accentColor?: string; // Optional accent
}

export default function LogoAssembler({
    iconName,
    brandName,
    layout = 'icon_left',
    shape = 'squircle',
    primaryColor,
    fontFamily,
    className,
    accentColor
}: LogoAssemblerProps) {

    // Dynamic Icon
    // @ts-ignore - Dynamic access
    const IconComponent = Icons[iconName] || Icons.Sparkles;

    const isGhost = shape === 'ghost';
    const isDiamond = shape === 'diamond';

    // Render the Icon Part
    const IconMark = ({ size = 24, forceColor }: { size?: number, forceColor?: string }) => (
        <div
            className={cn(
                "flex items-center justify-center transition-all duration-300",
                shape !== 'ghost' && (ASSEMBLER_SHAPES[shape] || 'rounded-xl'),
                shape === 'ghost' && "rounded-xl border-2",
                isDiamond && "rotate-45"
            )}
            style={{
                backgroundColor: isGhost ? 'transparent' : primaryColor,
                borderColor: isGhost ? primaryColor : 'transparent',
                padding: size * 0.5,
                width: size * 2,
                height: size * 2,
            }}
        >
            <div className={cn(isDiamond && "-rotate-45")}>
                <IconComponent
                    size={size}
                    strokeWidth={2.5}
                    color={forceColor || (isGhost ? primaryColor : 'white')}
                />
            </div>
        </div>
    );

    // Render the Text Part
    const Wordmark = () => (
        <span
            className="font-bold text-xl tracking-tight text-current"
            style={{ fontFamily: fontFamily || 'inherit' }}
        >
            {brandName}
        </span>
    );

    // --- THE LAYOUT SWITCHER ---

    // 1. Classic (Icon Left)
    if (layout === 'icon_left') {
        return (
            <div className={cn("flex items-center gap-3", className)}>
                <IconMark />
                <Wordmark />
            </div>
        );
    }

    // 1b. Icon Right
    if (layout === 'icon_right') {
        return (
            <div className={cn("flex items-center gap-3 flex-row-reverse", className)}>
                <IconMark />
                <Wordmark />
            </div>
        );
    }

    // 2. Stacked (App Icon Style - Vertical)
    if (layout === 'stacked') {
        return (
            <div className={cn("flex flex-col items-center gap-3 text-center", className)}>
                <IconMark size={32} />
                <Wordmark />
            </div>
        );
    }

    // 3. Badge (Tiny, Pill shape for container)
    if (layout === 'badge') {
        return (
            <div
                className={cn("flex items-center gap-2 pl-1 pr-4 py-1 rounded-full border shadow-sm", className)}
                style={{
                    backgroundColor: accentColor || '#f5f5f4', // fallback to stone-100
                    borderColor: 'rgba(0,0,0,0.05)'
                }}
            >
                <div
                    className="p-1.5 bg-white rounded-full shadow-sm flex items-center justify-center"
                    style={{ color: primaryColor }}
                >
                    <IconComponent size={14} strokeWidth={2.5} />
                </div>
                <span
                    className="text-sm font-bold uppercase tracking-widest opacity-80"
                    style={{ fontFamily: fontFamily || 'inherit', color: primaryColor }}
                >
                    {brandName}
                </span>
            </div>
        );
    }

    // 4. Monogram (First Letter + Icon)
    if (layout === 'monogram') {
        return (
            <div
                className={cn(
                    "relative w-24 h-24 flex items-center justify-center drop-shadow-lg",
                    ASSEMBLER_SHAPES[shape] || 'rounded-2xl',
                    className
                )}
                style={{ backgroundColor: primaryColor }}
            >
                <span className="text-white font-black text-5xl" style={{ fontFamily: fontFamily }}>
                    {brandName.charAt(0)}
                </span>
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full border-2 border-white shadow-sm">
                    <IconComponent size={16} color={primaryColor} strokeWidth={3} />
                </div>
            </div>
        )
    }

    // Default Fallback
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <IconMark />
            <Wordmark />
        </div>
    );
}
