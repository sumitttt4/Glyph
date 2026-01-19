import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { getIconById } from '@/lib/icons';
// We assume fonts are handled by the parent/global context, but we can accept fontFamily.

// 1. THE LAYOUT VARIATIONS
// This is the secret to variety. It changes the physical structure.
export type LogoAssemblerLayout = 'icon_left' | 'icon_right' | 'stacked' | 'badge' | 'monogram' | 'icon_only';

// 2. THE CONTAINER SHAPES
export const ASSEMBLER_SHAPES: Record<string, string> = {
    'squircle': 'rounded-2xl',
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
    gap?: number;         // Dynamic spacing
}

export default function LogoAssembler({
    iconName,
    brandName,
    layout = 'icon_left',
    shape = 'squircle',
    primaryColor,
    fontFamily,
    className,
    accentColor,
    gap = 12 // Default equivalent to gap-3 (3 * 4px = 12px)
}: LogoAssemblerProps) {

    // Check for custom icon from our library first
    const customIcon = getIconById(iconName);

    // Fallback to Lucide if not a custom icon
    // @ts-expect-error - Dynamic access
    const LucideIcon = Icons[iconName] || Icons.Sparkles;

    const isGhost = shape === 'ghost';
    const isDiamond = shape === 'diamond';

    // Render the Icon Part - supports both custom SVG and Lucide
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
                {customIcon ? (
                    // Render custom SVG from our library
                    <svg
                        width={size}
                        height={size}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={forceColor || (isGhost ? primaryColor : 'white')}
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d={customIcon.path} />
                    </svg>
                ) : (
                    // Fallback to Lucide icon
                    <LucideIcon
                        size={size}
                        strokeWidth={2.5}
                        color={forceColor || (isGhost ? primaryColor : 'white')}
                    />
                )}
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
            <div className={cn("flex items-center", className)} style={{ gap: `${gap}px` }}>
                <IconMark />
                <Wordmark />
            </div>
        );
    }

    // 1b. Icon Right
    if (layout === 'icon_right') {
        return (
            <div className={cn("flex items-center flex-row-reverse", className)} style={{ gap: `${gap}px` }}>
                <IconMark />
                <Wordmark />
            </div>
        );
    }

    // 2. Stacked (App Icon Style - Vertical)
    if (layout === 'stacked') {
        return (
            <div className={cn("flex flex-col items-center text-center", className)} style={{ gap: `${gap}px` }}>
                <IconMark size={32} />
                <Wordmark />
            </div>
        );
    }

    // Helper to render just the raw icon (Custom or Lucide)
    const IconElement = ({ size, color, strokeWidth = 2.5 }: { size: number, color?: string, strokeWidth?: number }) => {
        if (customIcon) {
            return (
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={color || (isGhost ? primaryColor : 'white')}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d={customIcon.path} />
                </svg>
            );
        }
        return <LucideIcon size={size} color={color || (isGhost ? primaryColor : 'white')} strokeWidth={strokeWidth} />;
    };

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
                    <IconElement size={14} strokeWidth={2.5} />
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
                    <IconElement size={16} color={primaryColor} strokeWidth={3} />
                </div>
            </div>
        )
    }

    // 5. Icon Only (New)
    if (layout === 'icon_only') {
        return (
            <div className={cn("flex items-center justify-center", className)}>
                <IconElement size={32} strokeWidth={2.5} />
            </div>
        );
    }

    // Default Fallback
    return (
        <div className={cn("flex items-center gap-3", className)}>
            <IconMark />
            <Wordmark />
        </div>
    );
}
