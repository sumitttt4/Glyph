"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

// Color name generator based on hue
function getColorName(hex: string): string {
    const names: Record<string, string[]> = {
        red: ['Crimson Wave', 'Ember Red', 'Scarlet Flame', 'Ruby Glow'],
        orange: ['Vivid Tangelo', 'Sunset Orange', 'Tangerine Dream', 'Amber Fire'],
        yellow: ['Golden Hour', 'Sunbeam', 'Citrine', 'Honey Gold'],
        green: ['Forest Sage', 'Emerald Mist', 'Jade Garden', 'Moss Green'],
        blue: ['Ocean Deep', 'Electric Indigo', 'Azure Sky', 'Cobalt Blue'],
        purple: ['Violet Haze', 'Royal Purple', 'Amethyst', 'Lavender Dusk'],
        pink: ['Blush Pink', 'Rose Quartz', 'Fuchsia', 'Coral Pink'],
        gray: ['Space Cadet', 'Slate Gray', 'Ash Stone', 'Graphite'],
        dark: ['Obsidian', 'Midnight', 'Charcoal', 'Shadow'],
        light: ['Cloud White', 'Snow', 'Cream', 'Pearl']
    };

    // Simple hue extraction from hex
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2 / 255;

    if (l > 0.9) return names.light[Math.floor(Math.random() * names.light.length)];
    if (l < 0.15) return names.dark[Math.floor(Math.random() * names.dark.length)];
    if (max - min < 20) return names.gray[Math.floor(Math.random() * names.gray.length)];

    let hue = 0;
    if (max === r) hue = ((g - b) / (max - min)) * 60;
    else if (max === g) hue = (2 + (b - r) / (max - min)) * 60;
    else hue = (4 + (r - g) / (max - min)) * 60;
    if (hue < 0) hue += 360;

    let category: string;
    if (hue < 15 || hue >= 345) category = 'red';
    else if (hue < 45) category = 'orange';
    else if (hue < 75) category = 'yellow';
    else if (hue < 165) category = 'green';
    else if (hue < 255) category = 'blue';
    else if (hue < 300) category = 'purple';
    else category = 'pink';

    const nameList = names[category];
    // Use hex hash to get consistent name
    const hash = hex.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    return nameList[hash % nameList.length];
}

interface ColorPaletteStripProps {
    colors: { label: string; hex: string }[];
    className?: string;
}

export function ColorPaletteStrip({ colors, className = '' }: ColorPaletteStripProps) {
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 1500);
    };

    return (
        <div className={`flex flex-col gap-0 rounded-2xl overflow-hidden ${className}`}>
            {colors.map((color, idx) => (
                <button
                    key={color.label}
                    onClick={() => copyToClipboard(color.hex)}
                    className="group relative flex-1 min-h-[60px] transition-all hover:flex-[1.5] duration-300"
                    style={{ backgroundColor: color.hex }}
                >
                    {/* Color info overlay */}
                    <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex flex-col items-start">
                            <span className="text-xs font-bold uppercase mix-blend-difference text-white">
                                {getColorName(color.hex)}
                            </span>
                            <span className="text-[10px] font-mono mix-blend-difference text-white/70">
                                {color.hex.toUpperCase()}
                            </span>
                        </div>
                        <div className="p-1.5 rounded-full bg-white/20 backdrop-blur-sm">
                            {copiedHex === color.hex ? (
                                <Check className="w-3 h-3 text-white" />
                            ) : (
                                <Copy className="w-3 h-3 text-white" />
                            )}
                        </div>
                    </div>
                </button>
            ))}
        </div>
    );
}

// Horizontal strip version (like in reference images)
export function ColorPaletteHorizontal({ colors, className = '' }: ColorPaletteStripProps) {
    const [copiedHex, setCopiedHex] = useState<string | null>(null);

    const copyToClipboard = (hex: string) => {
        navigator.clipboard.writeText(hex);
        setCopiedHex(hex);
        setTimeout(() => setCopiedHex(null), 1500);
    };

    // Check if color is light to determine text color
    const isLightColor = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.6;
    };

    // Role labels for each color position
    const roleLabels = ['Core Background', 'Primary Brand', 'Surface Accent', 'Strong Contrast'];

    return (
        <div className={`flex flex-row gap-0 h-full rounded-2xl overflow-hidden ${className}`}>
            {colors.map((color, idx) => {
                const isLight = isLightColor(color.hex);
                const colorName = getColorName(color.hex);
                const roleLabel = roleLabels[idx] || color.label;
                return (
                    <button
                        key={color.label}
                        onClick={() => copyToClipboard(color.hex)}
                        className="group relative flex-1 transition-all hover:flex-[1.5] duration-300 flex flex-col justify-between cursor-pointer p-3"
                        style={{ backgroundColor: color.hex }}
                    >
                        {/* Top: Color name and role */}
                        <div className="flex flex-col items-start">
                            <span
                                className={`text-sm font-semibold ${isLight ? 'text-black/80' : 'text-white/90'}`}
                            >
                                {colorName}
                            </span>
                            <span
                                className={`text-[10px] ${isLight ? 'text-black/50' : 'text-white/50'}`}
                            >
                                {roleLabel}
                            </span>
                        </div>

                        {/* Copy indicator on hover */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {copiedHex === color.hex ? (
                                <div className="p-1.5 rounded-full bg-green-500 shadow-lg">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                            ) : (
                                <div className={`p-1.5 rounded-full shadow-lg ${isLight ? 'bg-black/10' : 'bg-white/20'}`}>
                                    <Copy className={`w-3 h-3 ${isLight ? 'text-black/70' : 'text-white/70'}`} />
                                </div>
                            )}
                        </div>

                        {/* Bottom: Hex code */}
                        <div>
                            <span
                                className={`text-[10px] font-mono uppercase ${isLight ? 'text-black/50' : 'text-white/60'}`}
                            >
                                HEX: {color.hex.toUpperCase()}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
