"use client";

import { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';

interface SidebarProps {
    onGenerate: (prompt: string, vibe: string, name: string) => void;
    isGenerating: boolean;
    selectedVibe: string;
    setSelectedVibe: (vibe: string) => void;
}

const VIBES = [
    { id: 'minimalist', label: 'Minimalist', desc: 'Clean, essential, swiss.' },
    { id: 'tech', label: 'Tech', desc: 'Bold, futuristic, digital.' },
    { id: 'nature', label: 'Nature', desc: 'Organic, calm, grounded.' },
    { id: 'bold', label: 'Bold', desc: 'High contrast, loud, punchy.' },
];

// Tailwind color palettes (shadcn style)
const COLOR_PALETTES = {
    neutral: ['#fafafa', '#f5f5f5', '#e5e5e5', '#d4d4d4', '#a3a3a3', '#737373', '#525252', '#404040', '#262626', '#171717', '#0a0a0a'],
    stone: ['#fafaf9', '#f5f5f4', '#e7e5e4', '#d6d3d1', '#a8a29e', '#78716c', '#57534e', '#44403c', '#292524', '#1c1917', '#0c0a09'],
    red: ['#fef2f2', '#fee2e2', '#fecaca', '#fca5a5', '#f87171', '#ef4444', '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#450a0a'],
    orange: ['#fff7ed', '#ffedd5', '#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'],
    amber: ['#fffbeb', '#fef3c7', '#fde68a', '#fcd34d', '#fbbf24', '#f59e0b', '#d97706', '#b45309', '#92400e', '#78350f', '#451a03'],
    yellow: ['#fefce8', '#fef9c3', '#fef08a', '#fde047', '#facc15', '#eab308', '#ca8a04', '#a16207', '#854d0e', '#713f12', '#422006'],
    lime: ['#f7fee7', '#ecfccb', '#d9f99d', '#bef264', '#a3e635', '#84cc16', '#65a30d', '#4d7c0f', '#3f6212', '#365314', '#1a2e05'],
    green: ['#f0fdf4', '#dcfce7', '#bbf7d0', '#86efac', '#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
    emerald: ['#ecfdf5', '#d1fae5', '#a7f3d0', '#6ee7b7', '#34d399', '#10b981', '#059669', '#047857', '#065f46', '#064e3b', '#022c22'],
    teal: ['#f0fdfa', '#ccfbf1', '#99f6e4', '#5eead4', '#2dd4bf', '#14b8a6', '#0d9488', '#0f766e', '#115e59', '#134e4a', '#042f2e'],
    cyan: ['#ecfeff', '#cffafe', '#a5f3fc', '#67e8f9', '#22d3ee', '#06b6d4', '#0891b2', '#0e7490', '#155e75', '#164e63', '#083344'],
    sky: ['#f0f9ff', '#e0f2fe', '#bae6fd', '#7dd3fc', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1', '#075985', '#0c4a6e', '#082f49'],
    blue: ['#eff6ff', '#dbeafe', '#bfdbfe', '#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8', '#1e40af', '#1e3a8a', '#172554'],
    indigo: ['#eef2ff', '#e0e7ff', '#c7d2fe', '#a5b4fc', '#818cf8', '#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81', '#1e1b4b'],
    violet: ['#f5f3ff', '#ede9fe', '#ddd6fe', '#c4b5fd', '#a78bfa', '#8b5cf6', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#2e1065'],
    purple: ['#faf5ff', '#f3e8ff', '#e9d5ff', '#d8b4fe', '#c084fc', '#a855f7', '#9333ea', '#7e22ce', '#6b21a8', '#581c87', '#3b0764'],
    fuchsia: ['#fdf4ff', '#fae8ff', '#f5d0fe', '#f0abfc', '#e879f9', '#d946ef', '#c026d3', '#a21caf', '#86198f', '#701a75', '#4a044e'],
    pink: ['#fdf2f8', '#fce7f3', '#fbcfe8', '#f9a8d4', '#f472b6', '#ec4899', '#db2777', '#be185d', '#9d174d', '#831843', '#500724'],
    rose: ['#fff1f2', '#ffe4e6', '#fecdd3', '#fda4af', '#fb7185', '#f43f5e', '#e11d48', '#be123c', '#9f1239', '#881337', '#4c0519'],
};

export function Sidebar({ onGenerate, isGenerating, selectedVibe, setSelectedVibe }: SidebarProps) {
    const [prompt, setPrompt] = useState('');
    const [brandName, setBrandName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#f97316');
    const [activeColorFamily, setActiveColorFamily] = useState<string | null>(null);
    const [customVibe, setCustomVibe] = useState('');

    const handleGenerate = () => {
        // Use custom vibe if it's selected and has content
        const vibeToUse = selectedVibe === 'custom' && customVibe ? customVibe : selectedVibe;
        onGenerate(prompt, vibeToUse, brandName);
    };

    return (
        <aside className="w-full md:w-[400px] h-full bg-white border-r border-stone-200 p-8 flex flex-col z-20 shadow-xl overflow-y-auto scrollbar-hide">
            {/* Logo */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-stone-900">
                    Glyph <span className="font-editorial text-stone-400">Station</span>
                </h1>
                <p className="text-xs text-stone-400 mt-1">Design Engineering Console</p>
            </div>

            {/* Brand Name Input */}
            <div className="space-y-3 mb-6">
                <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                    Brand Name
                </label>
                <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full p-4 bg-white border border-stone-200 rounded-lg text-sm font-bold text-stone-900 focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none placeholder:text-stone-400 transition-all"
                    placeholder="e.g. SafeAgree"
                />
            </div>

            {/* Brief Input */}
            <div className="space-y-3 mb-6">
                <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                    The Brief
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-28 p-4 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none resize-none placeholder:text-stone-400 transition-all"
                    placeholder="e.g. A Terms and conditions reader startup for safety and security called 'SafeAgree'..."
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-4 bg-[#FF4500] hover:bg-orange-600 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg hover:shadow-orange-200"
                >
                    <Sparkles className="w-4 h-4" />
                    {isGenerating ? 'Generating...' : 'Generate System'}
                </button>
            </div>

            {/* Vibe Selector */}
            <div className="space-y-3 mb-6">
                <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                    Select Your Vibe
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {VIBES.map((vibe) => (
                        <button
                            key={vibe.id}
                            onClick={() => setSelectedVibe(vibe.id)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedVibe === vibe.id
                                ? 'border-stone-950 bg-stone-950 text-white'
                                : 'border-stone-200 bg-white hover:border-stone-400'
                                }`}
                        >
                            <div className={`font-semibold text-sm ${selectedVibe === vibe.id ? 'text-white' : 'text-stone-950'}`}>
                                {vibe.label}
                            </div>
                            <div className={`text-[10px] ${selectedVibe === vibe.id ? 'text-stone-300' : 'text-stone-400'}`}>
                                {vibe.desc}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Custom Vibe Input */}
                <div className="mt-3">
                    <div className="relative">
                        <input
                            type="text"
                            value={customVibe}
                            onChange={(e) => {
                                setCustomVibe(e.target.value);
                                if (e.target.value) {
                                    setSelectedVibe('custom');
                                }
                            }}
                            onFocus={() => setSelectedVibe('custom')}
                            placeholder="Or describe your own vibe..."
                            className={`w-full p-3 text-sm border-2 rounded-lg transition-all outline-none ${selectedVibe === 'custom'
                                ? 'border-stone-950 bg-stone-50'
                                : 'border-stone-200 bg-white hover:border-stone-300'
                                }`}
                        />
                        {selectedVibe === 'custom' && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <span className="text-[10px] font-mono text-stone-400 bg-stone-100 px-2 py-1 rounded">CUSTOM</span>
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1.5">
                        e.g. "Playful & colorful like Figma" or "Dark & techy like Linear"
                    </p>
                </div>
            </div>

            {/* Logo Shape Selector */}
            <div className="space-y-3 pt-6 border-t border-stone-100">
                <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                    Logo Shape
                </label>
                <div className="grid grid-cols-6 gap-2">
                    {[
                        { id: 'geo-hexagon', path: 'M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z' },
                        { id: 'geo-diamond', path: 'M12 2L2 12l10 10 10-10L12 2z' },
                        { id: 'geo-circle', path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z' },
                        { id: 'geo-triangle', path: 'M12 2L2 22h20L12 2z' },
                        { id: 'geo-square', path: 'M3 3h18v18H3z' },
                        { id: 'tech-bolt', path: 'M7 2v11h3v9l7-12h-4l4-8z' },
                        { id: 'org-star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
                        { id: 'org-heart', path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' },
                        { id: 'abs-plus', path: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' },
                        { id: 'tech-layers', path: 'M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.62-1.26-7.39 5.73zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z' },
                        { id: 'org-leaf', path: 'M17 8C8 10 5.9 16.17 3.82 21.34 5.71 18.06 8.4 15 12 13c-3 3-5 7-5 11 5-1 9-3 13-9 1-1.5 1-4-3-7z' },
                        { id: 'mark-arrow-ne', path: 'M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z' },
                    ].map((shape) => (
                        <button
                            key={shape.id}
                            className="aspect-square bg-white border border-stone-200 rounded-lg p-2 hover:border-stone-400 hover:bg-stone-50 transition-all group"
                            title={shape.id}
                        >
                            <svg viewBox="0 0 24 24" className="w-full h-full fill-stone-400 group-hover:fill-stone-900 transition-colors">
                                <path d={shape.path} />
                            </svg>
                        </button>
                    ))}
                </div>
                <p className="text-[10px] text-stone-400">Click to lock a shape for generation</p>
            </div>

            {/* Color Palette Picker (shadcn style) */}
            <div className="space-y-3 pt-6 border-t border-stone-100">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                        Primary Color
                    </label>
                    <span className="text-xs font-mono text-stone-500">{selectedColor}</span>
                </div>

                {/* Color Family Selector */}
                <div className="flex flex-wrap gap-1.5">
                    {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                        <button
                            key={name}
                            onClick={() => setActiveColorFamily(activeColorFamily === name ? null : name)}
                            className={`w-5 h-5 rounded-md transition-all hover:scale-110 ${activeColorFamily === name ? 'ring-2 ring-stone-950 ring-offset-1' : ''}`}
                            style={{ backgroundColor: colors[5] }}
                            title={name}
                        />
                    ))}
                </div>

                {/* Active Palette Shades */}
                {activeColorFamily && (
                    <div className="bg-stone-50 rounded-lg p-3 space-y-2">
                        <div className="text-xs font-semibold text-stone-600 capitalize">{activeColorFamily}</div>
                        <div className="flex gap-0.5">
                            {COLOR_PALETTES[activeColorFamily as keyof typeof COLOR_PALETTES].map((color, i) => (
                                <button
                                    key={i}
                                    onClick={() => setSelectedColor(color)}
                                    className={`flex-1 h-8 first:rounded-l-md last:rounded-r-md transition-all hover:scale-y-110 relative ${selectedColor === color ? 'ring-2 ring-stone-950 ring-offset-1 z-10' : ''}`}
                                    style={{ backgroundColor: color }}
                                    title={color}
                                >
                                    {selectedColor === color && (
                                        <Check className={`w-3 h-3 absolute inset-0 m-auto ${i < 5 ? 'text-stone-900' : 'text-white'}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-between text-[8px] font-mono text-stone-400 px-1">
                            <span>50</span>
                            <span>500</span>
                            <span>950</span>
                        </div>
                    </div>
                )}

                {/* Selected Color Preview */}
                <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                    <div
                        className="w-10 h-10 rounded-lg shadow-inner border border-stone-200"
                        style={{ backgroundColor: selectedColor }}
                    />
                    <div>
                        <div className="text-xs font-semibold text-stone-900">Selected Primary</div>
                        <div className="text-[10px] font-mono text-stone-500">{selectedColor}</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
