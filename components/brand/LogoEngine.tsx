import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

// 1. THE ARCHITECTURAL SHAPES (No more basic squares)
// We use clip-paths to create complex geometric containers.
export const CONTAINERS: Record<string, string> = {
    'squircle': 'rounded-2xl',
    'hexagon': 'clip-path-hexagon', // You need a CSS class for this or SVG wrapper
    'diamond': 'rotate-45 rounded-xl',
    'cyber': 'rounded-tl-2xl rounded-br-2xl rounded-tr-sm rounded-bl-sm', // Tech shape
    'pill': 'rounded-full',
};

// 2. THE STYLES (Fill, Outline, Duotone)
export type LogoStyle = 'solid' | 'outline' | 'soft' | 'gradient';

// Valid Lucide Icon names (subset or logic to check)
// checks done at runtime

interface LogoEngineProps {
    iconName: string;      // The Lucide Icon Name (e.g. "Zap")
    containerShape: string; // "squircle", "cyber", etc.
    primaryColor: string;
    className?: string;
    style?: LogoStyle;
}

export default function LogoEngine({
    iconName,
    containerShape,
    primaryColor,
    className,
    style = 'solid'
}: LogoEngineProps) {

    // Dynamic Icon Retrieval
    // @ts-ignore - We are dynamically accessing the library
    const LucideIcon = Icons[iconName] || Icons.Sparkles; // Fallback to Sparkles if not found

    // If diamond, we need to counter-rotate the icon
    const isDiamond = containerShape === 'diamond';

    return (
        <div className={cn("relative flex items-center justify-center w-32 h-32 group", className)}>

            {/* LAYER 1: The Container */}
            <div
                className={cn(
                    "absolute inset-0 transition-all duration-500 overflow-hidden",
                    CONTAINERS[containerShape] || 'rounded-xl'
                )}
                style={{
                    backgroundColor: style === 'outline' ? 'transparent' : primaryColor,
                    border: style === 'outline' ? `4px solid ${primaryColor}` : 'none',
                }}
            >
                {/* Subtle Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50" />
            </div>

            {/* LAYER 2: The Icon */}
            <div className={cn(
                "relative z-10 transform transition-transform duration-500 group-hover:scale-110",
                isDiamond && "-rotate-45"
            )}>
                <LucideIcon
                    size={48}
                    color={style === 'outline' ? primaryColor : 'white'}
                    strokeWidth={style === 'outline' ? 2 : 2}
                    className="drop-shadow-sm"
                />
            </div>

        </div>
    );
}
