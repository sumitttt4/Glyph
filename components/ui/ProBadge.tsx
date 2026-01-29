"use client";

import { Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProBadgeProps {
    className?: string;
    size?: 'sm' | 'md';
    onClick?: () => void;
}

/**
 * Aesthetic Pro badge in brand orange (#FF4500)
 * Shows a small crown icon with "PRO" text
 */
export function ProBadge({ className, size = 'sm', onClick }: ProBadgeProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "inline-flex items-center gap-1 font-bold uppercase tracking-wider transition-all",
                "bg-gradient-to-r from-[#FF4500] to-[#FF6B35] text-white rounded-full shadow-sm",
                "hover:shadow-md hover:scale-105 active:scale-95",
                size === 'sm' && "text-[9px] px-2 py-0.5",
                size === 'md' && "text-[10px] px-2.5 py-1",
                className
            )}
        >
            <Crown className={cn(
                size === 'sm' && "w-2.5 h-2.5",
                size === 'md' && "w-3 h-3"
            )} />
            <span>Pro</span>
        </button>
    );
}

/**
 * Locked feature indicator with Pro badge
 * Used to show that a feature requires Pro upgrade
 */
export function ProLockOverlay({
    onClick,
    label = "Pro Feature",
    className
}: {
    onClick?: () => void;
    label?: string;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center z-10 rounded-xl cursor-pointer",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                className
            )}
            onClick={onClick}
        >
            <div className="flex flex-col items-center gap-2">
                <ProBadge size="md" />
                <span className="text-white/70 text-xs font-medium">{label}</span>
            </div>
        </div>
    );
}
