"use client";

import React from 'react';
import { BrandIdentity } from '@/lib/data';
import { Slider } from '@/components/ui/slider';
import { RotateCw, Maximize, GitCommitHorizontal, X, Rows, Columns, Square } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists

interface LogoTweakPanelProps {
    brand: BrandIdentity;
    onUpdateBrand: (updates: Partial<BrandIdentity>) => void;
    onClose?: () => void;
    className?: string;
}

export function LogoTweakPanel({ brand, onUpdateBrand, onClose, className }: LogoTweakPanelProps) {
    // Local state for immediate responsiveness (optional, but direct prop update is simpler for now)

    // Helper to update tweaks safely
    const updateTweak = (key: 'scale' | 'rotate' | 'gap', value: number) => {
        const currentTweaks = brand.logoTweaks || { scale: 1, rotate: 0, gap: 12 };
        onUpdateBrand({
            logoTweaks: {
                ...currentTweaks,
                [key]: value
            }
        });
    };

    const tweaks = brand.logoTweaks || { scale: 1, rotate: 0, gap: 12 };

    return (
        <div className={cn("bg-stone-900/90 backdrop-blur-md border border-white/10 p-4 rounded-xl text-white w-64 shadow-2xl space-y-4", className)}>
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60">Fine Tune</span>
                {onClose && (
                    <button onClick={onClose} className="hover:text-white text-white/40 transition-colors">
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* SCALE */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1.5">
                        <Maximize size={12} />
                        <span>Scale</span>
                    </div>
                    <span>{Math.round(tweaks.scale * 100)}%</span>
                </div>
                <Slider
                    value={[tweaks.scale]} // 0.5 to 1.5
                    min={0.5}
                    max={1.5}
                    step={0.05}
                    onValueChange={([val]: number[]) => updateTweak('scale', val)}
                    className="cursor-pointer"
                />
            </div>

            {/* LAYOUT TOGGLE */}
            <div className="space-y-2 pb-2 border-b border-white/10">
                <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                    <span className="font-semibold text-white/40">Layout</span>
                </div>
                <div className="flex bg-black/20 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => onUpdateBrand({ logoLayout: 'stacked' })}
                        className={cn(
                            "flex-1 py-1.5 rounded-md flex items-center justify-center transition-all",
                            brand.logoLayout === 'stacked' ? "bg-white text-stone-900 shadow-sm" : "hover:bg-white/10 text-white/60"
                        )}
                        title="Stacked"
                    >
                        <Rows size={14} />
                    </button>
                    <button
                        onClick={() => onUpdateBrand({ logoLayout: 'horizontal' })}
                        className={cn(
                            "flex-1 py-1.5 rounded-md flex items-center justify-center transition-all",
                            brand.logoLayout === 'horizontal' ? "bg-white text-stone-900 shadow-sm" : "hover:bg-white/10 text-white/60"
                        )}
                        title="Horizontal"
                    >
                        <Columns size={14} />
                    </button>
                    <button
                        onClick={() => onUpdateBrand({ logoLayout: 'icon_only' })}
                        className={cn(
                            "flex-1 py-1.5 rounded-md flex items-center justify-center transition-all",
                            brand.logoLayout === 'icon_only' ? "bg-white text-stone-900 shadow-sm" : "hover:bg-white/10 text-white/60"
                        )}
                        title="Icon Only"
                    >
                        <Square size={14} />
                    </button>
                </div>
            </div>

            {/* ROTATE */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1.5">
                        <RotateCw size={12} />
                        <span>Rotate</span>
                    </div>
                    <span>{tweaks.rotate}°</span>
                </div>
                <Slider
                    value={[tweaks.rotate]} // 0 to 360
                    min={0}
                    max={360}
                    step={15} // Snap to 15deg increments usually better
                    onValueChange={([val]: number[]) => updateTweak('rotate', val)}
                    className="cursor-pointer"
                />
            </div>

            {/* GAP (Less used in composition, but good to have) */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-white/70">
                    <div className="flex items-center gap-1.5">
                        <GitCommitHorizontal size={12} />
                        <span>Gap</span>
                    </div>
                    <span>{tweaks.gap}px</span>
                </div>
                <Slider
                    value={[tweaks.gap]} // 0 to 48
                    min={0}
                    max={48}
                    step={2}
                    onValueChange={([val]: number[]) => updateTweak('gap', val)}
                    className="cursor-pointer"
                />
            </div>
        </div>
    );
}

// Shadcn Slider shim incase it's not imported/available directly or needs customization
// Assuming global CSS handles shadcn slider, but if not we might need to inline styles or ensure Slider component exists.
// For safety, let's assume the user has a Slider component at '@/components/ui/slider'.
// If not, I'll need to create one or use standard input range.
// Given the "Shadcn" usage in previous prompts, safe to assume it exists.
