"use client";

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    value: string; // Current hex color
    onChange: (color: { light: string; dark: string }) => void;
    onClose?: () => void;
    className?: string;
}

// Preset colors for quick selection
const PRESET_COLORS = [
    '#4338CA', '#0D9488', '#DC2626', '#EA580C',
    '#16A34A', '#7C3AED', '#0284C7', '#DB2777',
    '#CA8A04', '#1D4ED8', '#000000', '#FFFFFF',
];

// Color conversion utilities
function hexToHsl(hex: string): { h: number; s: number; l: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 100, l: 50 };

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hsvToHex(h: number, s: number, v: number): string {
    s /= 100;
    v /= 100;

    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r = 0, g = 0, b = 0;
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }

    return '#' + [r, g, b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
}

function hexToHsv(hex: string): { h: number; s: number; v: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return { h: 0, s: 100, v: 100 };

    const r = parseInt(result[1], 16) / 255;
    const g = parseInt(result[2], 16) / 255;
    const b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    let h = 0;
    const s = max === 0 ? 0 : (d / max) * 100;
    const v = max * 100;

    if (max !== min) {
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) * 60; break;
            case g: h = ((b - r) / d + 2) * 60; break;
            case b: h = ((r - g) / d + 4) * 60; break;
        }
    }

    return { h, s, v };
}

// Generate a dark variant of the color (for dark mode)
function generateDarkVariant(hex: string): string {
    const { h, s, l } = hexToHsl(hex);
    // For dark mode, lighten the color slightly
    const newL = Math.min(l + 15, 70);
    return hslToHex(h, s, newL);
}

export function ColorPicker({ value, onChange, onClose, className }: ColorPickerProps) {
    const [hsv, setHsv] = useState(() => hexToHsv(value));
    const [isDraggingBox, setIsDraggingBox] = useState(false);
    const [isDraggingHue, setIsDraggingHue] = useState(false);

    const boxRef = useRef<HTMLDivElement>(null);
    const hueRef = useRef<HTMLDivElement>(null);

    // Update HSV when value prop changes
    useEffect(() => {
        const newHsv = hexToHsv(value);
        setHsv(newHsv);
    }, [value]);

    const handleColorChange = useCallback((newHsv: { h: number; s: number; v: number }) => {
        const hex = hsvToHex(newHsv.h, newHsv.s, newHsv.v);
        const darkHex = generateDarkVariant(hex);
        onChange({ light: hex, dark: darkHex });
    }, [onChange]);

    const handleBoxMouseDown = (e: React.MouseEvent) => {
        setIsDraggingBox(true);
        updateBoxFromEvent(e);
    };

    const handleHueMouseDown = (e: React.MouseEvent) => {
        setIsDraggingHue(true);
        updateHueFromEvent(e);
    };

    const updateBoxFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!boxRef.current) return;
        const rect = boxRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

        const newHsv = { ...hsv, s: x * 100, v: (1 - y) * 100 };
        setHsv(newHsv);
        handleColorChange(newHsv);
    }, [hsv, handleColorChange]);

    const updateHueFromEvent = useCallback((e: MouseEvent | React.MouseEvent) => {
        if (!hueRef.current) return;
        const rect = hueRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));

        const newHsv = { ...hsv, h: x * 360 };
        setHsv(newHsv);
        handleColorChange(newHsv);
    }, [hsv, handleColorChange]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDraggingBox) updateBoxFromEvent(e);
            if (isDraggingHue) updateHueFromEvent(e);
        };

        const handleMouseUp = () => {
            setIsDraggingBox(false);
            setIsDraggingHue(false);
        };

        if (isDraggingBox || isDraggingHue) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDraggingBox, isDraggingHue, updateBoxFromEvent, updateHueFromEvent]);

    const handlePresetClick = (hex: string) => {
        const newHsv = hexToHsv(hex);
        setHsv(newHsv);
        const darkHex = generateDarkVariant(hex);
        onChange({ light: hex, dark: darkHex });
    };

    const currentHex = hsvToHex(hsv.h, hsv.s, hsv.v);
    const pureHue = hsvToHex(hsv.h, 100, 100);

    return (
        <div className={cn(
            "p-3 w-full",
            className
        )}>
            {/* Saturation/Brightness Box */}
            <div
                ref={boxRef}
                className="relative w-full h-32 rounded-lg cursor-crosshair overflow-hidden mb-3"
                style={{
                    background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${pureHue})`
                }}
                onMouseDown={handleBoxMouseDown}
            >
                {/* Picker Circle */}
                <div
                    className="absolute w-4 h-4 rounded-full border-2 border-white shadow-sm pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `${hsv.s}%`,
                        top: `${100 - hsv.v}%`,
                        backgroundColor: currentHex
                    }}
                />
            </div>

            {/* Hue Slider */}
            <div
                ref={hueRef}
                className="relative w-full h-3 rounded-full cursor-pointer mb-3 overflow-hidden"
                style={{
                    background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'
                }}
                onMouseDown={handleHueMouseDown}
            >
                {/* Hue Picker Circle */}
                <div
                    className="absolute top-1/2 w-4 h-4 rounded-full border-2 border-white shadow-sm pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: `${(hsv.h / 360) * 100}%`,
                        backgroundColor: pureHue
                    }}
                />
            </div>

            {/* Current Color Preview & Hex */}
            <div className="flex items-center gap-2 mb-3 p-1.5 bg-secondary/20 rounded-lg">
                <div
                    className="w-8 h-8 rounded-md border border-white/10"
                    style={{ backgroundColor: currentHex }}
                />
                <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Hex</div>
                    <div className="text-xs font-mono font-medium truncate">{currentHex.toUpperCase()}</div>
                </div>
            </div>

            {/* Preset Colors Grid */}
            <div className="space-y-1.5">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Presets</div>
                <div className="grid grid-cols-6 gap-1.5">
                    {PRESET_COLORS.map((hex) => (
                        <button
                            key={hex}
                            onClick={() => handlePresetClick(hex)}
                            className={cn(
                                "w-6 h-6 rounded-md border transition-all hover:scale-110",
                                currentHex.toLowerCase() === hex.toLowerCase()
                                    ? "border-primary ring-1 ring-primary"
                                    : "border-transparent hover:border-white/20"
                            )}
                            style={{ backgroundColor: hex }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ColorPicker;
