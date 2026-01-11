"use client";

import React from 'react';
import { generatePalette, getContrastText } from '@/utils/paletteGenerator';
import { Check, Copy, Sun, Moon } from "lucide-react";
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface PalettePreviewProps {
    primaryColor: string;
    className?: string;
}

/**
 * Day/Night Twin Palette Preview
 * Shows how a brand color adapts between Light and Dark modes
 */
export default function PalettePreview({ primaryColor, className }: PalettePreviewProps) {
    const { light, dark } = generatePalette(primaryColor);
    const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

    const copyToken = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        setCopiedToken(label);
        setTimeout(() => setCopiedToken(null), 1500);
    };

    const TokenRow = ({ label, value, mode }: { label: string; value: string; mode: 'light' | 'dark' }) => {
        const bgStyle = mode === 'light'
            ? { backgroundColor: 'rgba(255,255,255,0.5)', borderColor: light.border }
            : { backgroundColor: 'rgba(255,255,255,0.05)', borderColor: dark.border };

        return (
            <button
                onClick={() => copyToken(value, `${mode}-${label}`)}
                className="flex items-center justify-between p-2 rounded border text-left hover:scale-[1.02] transition-transform w-full"
                style={bgStyle}
            >
                <span className="font-mono text-[10px] opacity-60">{label}</span>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: value }} />
                    <span className="font-mono text-[10px] font-bold">{value.toUpperCase()}</span>
                    {copiedToken === `${mode}-${label}` ? (
                        <Check size={10} className="text-green-500" />
                    ) : (
                        <Copy size={10} className="opacity-30" />
                    )}
                </div>
            </button>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("w-full flex flex-col md:flex-row rounded-3xl overflow-hidden border border-stone-200 shadow-xl", className)}
        >

            {/* --- LIGHT MODE PREVIEW --- */}
            <div
                className="flex-1 p-6 md:p-8 flex flex-col gap-5 relative"
                style={{ backgroundColor: light.bg, color: light.text }}
            >
                <div className="flex items-center gap-2 absolute top-4 left-4">
                    <Sun size={12} className="opacity-50" />
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">
                        Light Mode
                    </span>
                </div>

                {/* Brand Card Preview */}
                <div
                    className="p-5 rounded-2xl border flex flex-col gap-4 shadow-sm mt-6"
                    style={{ backgroundColor: light.surface, borderColor: light.border }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                            style={{ backgroundColor: light.brand, color: getContrastText(light.brand) }}
                        >
                            <Check size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Payment Success</h4>
                            <p className="text-[11px] opacity-60">Transaction #8832 completed.</p>
                        </div>
                    </div>

                    {/* Primary Button */}
                    <button
                        className="w-full py-2.5 rounded-xl text-sm font-bold shadow-sm hover:translate-y-[-1px] transition-transform"
                        style={{ backgroundColor: light.brand, color: getContrastText(light.brand) }}
                    >
                        View Dashboard
                    </button>
                </div>

                {/* Token List */}
                <div className="mt-auto space-y-1.5">
                    <div className="text-[9px] font-mono mb-2 opacity-40 uppercase tracking-wider">Generated Tokens</div>
                    <TokenRow label="--brand" value={light.brand} mode="light" />
                    <TokenRow label="--surface" value={light.surface} mode="light" />
                    <TokenRow label="--accent" value={light.accent} mode="light" />
                </div>
            </div>

            {/* --- DARK MODE PREVIEW --- */}
            <div
                className="flex-1 p-6 md:p-8 flex flex-col gap-5 relative border-t md:border-t-0 md:border-l"
                style={{ backgroundColor: dark.bg, color: dark.text, borderColor: 'rgba(255,255,255,0.1)' }}
            >
                <div className="flex items-center gap-2 absolute top-4 left-4">
                    <Moon size={12} className="opacity-50" />
                    <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">
                        Dark Mode
                    </span>
                </div>

                {/* Brand Card Preview */}
                <div
                    className="p-5 rounded-2xl border flex flex-col gap-4 shadow-lg mt-6"
                    style={{ backgroundColor: dark.surface, borderColor: dark.border }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: dark.brand, color: getContrastText(dark.brand) }}
                        >
                            <Check size={18} />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Payment Success</h4>
                            <p className="text-[11px] opacity-60">Transaction #8832 completed.</p>
                        </div>
                    </div>

                    {/* Primary Button - Notice the adapted color! */}
                    <button
                        className="w-full py-2.5 rounded-xl text-sm font-bold shadow-[0_0_20px_-5px_rgba(255,255,255,0.15)] hover:translate-y-[-1px] transition-transform"
                        style={{ backgroundColor: dark.brand, color: getContrastText(dark.brand) }}
                    >
                        View Dashboard
                    </button>
                </div>

                {/* Token List */}
                <div className="mt-auto space-y-1.5">
                    <div className="text-[9px] font-mono mb-2 opacity-40 uppercase tracking-wider">Adapted Tokens</div>
                    <TokenRow label="--brand" value={dark.brand} mode="dark" />
                    <TokenRow label="--surface" value={dark.surface} mode="dark" />
                    <TokenRow label="--accent" value={dark.accent} mode="dark" />
                </div>
            </div>

        </motion.div>
    );
}
