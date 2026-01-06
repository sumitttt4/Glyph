"use client";

import { useState, useEffect } from 'react';
import { Check, Shuffle } from 'lucide-react';
import { VibeSelector } from './VibeSelector';
import { expandBriefWithAI, suggestVibeWithAI, expandVibeWithAI } from '@/lib/brand-generator';
import { createClient } from '@/utils/supabase/client';
import { GlyphIcon } from '@/components/brand/GlyphLogo';

export interface GenerationOptions {
    prompt: string;
    vibe: string;
    name: string;
    color?: string;
    shape?: string;
    gradient?: { colors: string[]; angle: number } | null;
    surpriseMe?: boolean;
}

interface SidebarProps {
    onGenerate: (options: GenerationOptions) => void;
    isGenerating: boolean;
    selectedVibe: string;
    setSelectedVibe: (vibe: string) => void;
    hasGenerated?: boolean;
}

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

// Logo shape presets
const SHAPE_PRESETS = [
    { id: 'geo-hexagon', path: 'M21 16.5c0 .38-.21.71-.53.88l-7.9 4.44c-.16.12-.36.18-.57.18s-.41-.06-.57-.18l-7.9-4.44A.991.991 0 0 1 3 16.5v-9c0-.38.21-.71.53-.88l7.9-4.44c.16-.12.36-.18.57-.18s.41.06.57.18l7.9 4.44c.32.17.53.5.53.88v9z' },
    { id: 'geo-diamond', path: 'M12 2L2 12l10 10 10-10L12 2z' },
    { id: 'tech-bolt', path: 'M7 2v11h3v9l7-12h-4l4-8z' },
    { id: 'org-star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
    { id: 'tech-layers', path: 'M11.99 18.54l-7.37-5.73L3 14.07l9 7 9-7-1.62-1.26-7.39 5.73zM12 16l7.36-5.73L21 9l-9-7-9 7 1.63 1.27L12 16z' },
    { id: 'org-leaf', path: 'M17 8C8 10 5.9 16.17 3.82 21.34 5.71 18.06 8.4 15 12 13c-3 3-5 7-5 11 5-1 9-3 13-9 1-1.5 1-4-3-7z' },
    { id: 'mark-arrow-ne', path: 'M9 5v2h6.59L4 18.59 5.41 20 17 8.41V15h2V5H9z' },
];

// Gradient presets
const GRADIENT_PRESETS = [
    { id: 'sunset', name: 'Sunset', colors: ['#f97316', '#ec4899'], angle: 135 },
    { id: 'ocean', name: 'Ocean', colors: ['#06b6d4', '#3b82f6'], angle: 135 },
    { id: 'forest', name: 'Forest', colors: ['#22c55e', '#14b8a6'], angle: 135 },
    { id: 'lavender', name: 'Lavender', colors: ['#a855f7', '#ec4899'], angle: 135 },
    { id: 'midnight', name: 'Midnight', colors: ['#1e3a8a', '#7c3aed'], angle: 135 },
    { id: 'ember', name: 'Ember', colors: ['#ef4444', '#f97316'], angle: 135 },
    { id: 'mint', name: 'Mint', colors: ['#10b981', '#06b6d4'], angle: 135 },
    { id: 'peach', name: 'Peach', colors: ['#fb923c', '#fbbf24'], angle: 135 },
];

export function Sidebar({ onGenerate, isGenerating, selectedVibe, setSelectedVibe, hasGenerated }: SidebarProps) {
    const [prompt, setPrompt] = useState('');
    const [brandName, setBrandName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#f97316');
    const [activeColorFamily, setActiveColorFamily] = useState<string | null>(null);
    const [customVibe, setCustomVibe] = useState('');
    const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [isShapesOpen, setIsShapesOpen] = useState(false);
    const [isAiLoading, setIsAiLoading] = useState(false);

    const isValid = brandName.trim().length > 0 && prompt.trim().length > 0 && (selectedVibe || customVibe.trim().length > 0);

    // PLG: Restore pending work on load
    useEffect(() => {
        const saved = localStorage.getItem('glyph_pending_project');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.name) setBrandName(data.name);
                if (data.prompt) setPrompt(data.prompt);
                if (data.vibe) setSelectedVibe(data.vibe);
                if (data.customVibe) setCustomVibe(data.customVibe);
                if (data.color) setSelectedColor(data.color);
                // Optional: Clear it after loading, or keep it until successful generation?
                // Keeping it is safer for now.
            } catch (e) {
                console.error("Failed to restore draft", e);
            }
        }
    }, []);

    const handleGenerate = async () => {
        if (!isValid) return;

        // PLG: Check Authed Session
        // We let them design FIRST (Investment), then ask for Login (Conversion)
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Check for dev bypass cookie
        const isDevBypass = typeof document !== 'undefined' && document.cookie.includes('admin-bypass=true');

        if (!user && !isDevBypass) {
            // 1. Save their hard work
            const pendingProject = {
                name: brandName,
                prompt,
                vibe: selectedVibe,
                customVibe,
                color: selectedColor,
                timestamp: Date.now()
            };
            localStorage.setItem('glyph_pending_project', JSON.stringify(pendingProject));

            // 2. Redirect to Login (Gate)
            // We append ?next=/generator so they come right back
            window.location.href = '/login?next=/generator';
            return;
        }

        // If User IS Logged in, we proceed to Generate
        // (Reward)
        const vibeToUse = selectedVibe === 'custom' && customVibe ? customVibe : selectedVibe;

        // Find full gradient object if selected
        const gradientObj = selectedGradient
            ? GRADIENT_PRESETS.find(g => g.id === selectedGradient)
            : null;

        onGenerate({
            prompt,
            vibe: vibeToUse,
            name: brandName,
            color: selectedColor,
            shape: selectedShape || undefined,
            gradient: gradientObj ? { colors: gradientObj.colors, angle: gradientObj.angle } : null,
        });
    };

    const handleSurpriseMe = () => {
        // Pick random color family and shade
        const families = Object.keys(COLOR_PALETTES);
        const randomFamily = families[Math.floor(Math.random() * families.length)];
        setActiveColorFamily(randomFamily);
        const familyColors = COLOR_PALETTES[randomFamily as keyof typeof COLOR_PALETTES];
        const randomColor = familyColors[Math.floor(Math.random() * familyColors.length)];
        setSelectedColor(randomColor);

        // Pick random shape
        const randomShape = SHAPE_PRESETS[Math.floor(Math.random() * SHAPE_PRESETS.length)];
        setSelectedShape(randomShape.id);

        // Pick random gradient
        const randomGradient = GRADIENT_PRESETS[Math.floor(Math.random() * GRADIENT_PRESETS.length)];
        setSelectedGradient(randomGradient.id);

        // Pick random vibe if none selected
        if (!selectedVibe) {
            const vibes = ['minimalist', 'tech', 'bold', 'nature', 'luxury', 'playful'];
            const randomVibe = vibes[Math.floor(Math.random() * vibes.length)];
            setSelectedVibe(randomVibe);
        }

        // For surprise me, we fill in defaults if missing so it's always valid
        const finalName = brandName || "Surprise Brand";
        const finalPrompt = prompt || "A surprise startup concept";

        if (!brandName) setBrandName(finalName);
        if (!prompt) setPrompt(finalPrompt);

        // Trigger generation with surprise flag
        onGenerate({
            prompt: finalPrompt,
            vibe: selectedVibe || "bold",
            name: finalName,
            color: randomColor,
            shape: randomShape.id,
            gradient: { colors: randomGradient.colors, angle: randomGradient.angle },
            surpriseMe: true
        });
    };

    // AI Assist: Expand Brief
    const handleExpandBrief = async () => {
        if (!prompt.trim() || isAiLoading) return;
        setIsAiLoading(true);
        console.log('[Reframe] Starting brief reframe for:', prompt);
        try {
            const expanded = await expandBriefWithAI(prompt);
            console.log('[Reframe] Result:', expanded);
            setPrompt(expanded);
            // Also suggest a vibe based on the brief
            const suggestedVibe = await suggestVibeWithAI(expanded);
            console.log('[Reframe] Suggested vibe:', suggestedVibe);
            setSelectedVibe(suggestedVibe);
        } catch (error) {
            console.error('[Reframe] Error:', error);
        } finally {
            setIsAiLoading(false);
        }
    };

    // AI Assist: Expand Custom Vibe
    const handleExpandVibe = async () => {
        if (!customVibe.trim() || isAiLoading) return;
        setIsAiLoading(true);
        try {
            const expanded = await expandVibeWithAI(customVibe);
            setCustomVibe(expanded);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <aside className="w-full md:w-[420px] h-[100dvh] md:h-full bg-white border-r border-stone-200 flex flex-col z-20 overflow-hidden" style={{ boxShadow: 'var(--shadow-lg)' }}>



            {/* Console Header - Enhanced */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between sticky top-0 bg-gradient-to-b from-white to-stone-50/50 backdrop-blur-sm z-10" style={{ boxShadow: 'var(--shadow-xs)' }}>
                <div className="flex items-center gap-2.5 text-sm font-mono text-stone-600">
                    <div className="w-6 h-6 rounded-md bg-stone-900 flex items-center justify-center shadow-sm ring-1 ring-stone-200/50">
                        <GlyphIcon className="w-4 h-4 text-white" />
                    </div>
                    <span className="tracking-tight font-semibold">GLYPH_CONSOLE</span>
                    <span className="text-stone-300">/</span>
                    <span className="text-stone-400 font-normal">NEW_PROJECT</span>
                </div>
                <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-mono text-stone-500 px-2 py-0.5 bg-stone-100 rounded">v1.0</span>
                    <div className="h-2 w-2 rounded-full bg-green-500" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
                </div>
            </div>

            {/* Scrollable Content - Takes remaining space */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 space-y-8 min-h-0">

                {/* SECTION 01: PROJECT IDENTITY */}
                <section className="space-y-5" style={{ animation: 'fade-in 0.4s ease-out' }}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-wide text-stone-500 uppercase block">
                            01 // Project Identity
                        </label>
                        <div className="h-px bg-gradient-to-r from-stone-200 via-stone-300 to-transparent" />
                    </div>
                    <div className="space-y-3">
                        <input
                            type="text"
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 outline-none font-semibold text-lg transition-all placeholder:text-stone-400 placeholder:font-normal hover:border-stone-300 hover:shadow-sm"
                            placeholder="Brand Name (e.g. SafeAgree)"
                            style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)' }}
                        />
                        <div className="relative group">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full h-24 p-4 rounded-xl bg-stone-50 border border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 outline-none resize-none text-sm leading-relaxed placeholder:text-stone-400 transition-all hover:border-stone-300 hover:shadow-sm"
                                placeholder="Describe the mission..."
                                style={{ boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.03)' }}
                            />
                            <button
                                onClick={handleExpandBrief}
                                disabled={!prompt.trim() || isAiLoading}
                                className="absolute bottom-3 right-3 px-3 py-1.5 text-[10px] font-semibold text-orange-600 bg-orange-50 rounded-md hover:bg-orange-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:shadow-sm active:scale-95"
                            >
                                {isAiLoading ? 'Reframing...' : 'Reframe'}
                            </button>
                        </div>
                    </div>
                </section>

                {/* SECTION 02: AESTHETIC ENGINE */}
                <section className="space-y-5" style={{ animation: 'fade-in 0.5s ease-out' }}>
                    <div className="flex justify-between items-end">
                        <div className="space-y-2 flex-1">
                            <label className="text-[10px] font-bold tracking-wide text-stone-500 uppercase block">
                                02 // Aesthetic Engine
                            </label>
                            <div className="h-px bg-gradient-to-r from-stone-200 via-stone-300 to-transparent" />
                        </div>
                        <span className="text-[9px] text-stone-600 font-mono bg-gradient-to-br from-stone-100 to-stone-50 px-2.5 py-1 rounded-md border border-stone-200 shadow-xs">AI_TUNED</span>
                    </div>
                    <VibeSelector
                        selectedVibe={selectedVibe}
                        onVibeChange={setSelectedVibe}
                    />

                    {/* Custom Vibe Input - Auto-expanding like GPT/Claude */}
                    <div className="relative">
                        <textarea
                            value={customVibe}
                            onChange={(e) => {
                                setCustomVibe(e.target.value);
                                if (e.target.value) setSelectedVibe('custom');
                                // Auto-resize
                                e.target.style.height = 'auto';
                                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                            }}
                            onFocus={() => setSelectedVibe('custom')}
                            placeholder="Or type your own vibe..."
                            rows={1}
                            className={`w-full min-h-[44px] max-h-[120px] px-4 py-3 text-sm border rounded-xl transition-all outline-none resize-none overflow-hidden ${selectedVibe === 'custom'
                                ? 'ring-2 ring-stone-900 bg-stone-50 border-transparent shadow-sm'
                                : 'border-stone-200 bg-stone-50 hover:border-stone-300 hover:shadow-sm'
                                }`}
                            style={{
                                boxShadow: selectedVibe === 'custom' ? 'var(--shadow-sm)' : 'inset 0 1px 2px rgba(0, 0, 0, 0.03)',
                                scrollbarWidth: 'none', // Firefox
                            }}
                        />
                        {selectedVibe === 'custom' && (
                            <div className="absolute right-3 top-3">
                                <span className="text-[9px] font-mono text-stone-600 bg-stone-200 px-2 py-1 rounded-md shadow-xs">CUSTOM</span>
                            </div>
                        )}
                    </div>
                </section>

                {/* SECTION 03: VISUAL PRIMITIVES */}
                <section className="space-y-6" style={{ animation: 'fade-in 0.6s ease-out' }}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-wide text-stone-500 uppercase block">
                            03 // Visual Primitives
                        </label>
                        <div className="h-px bg-gradient-to-r from-stone-200 via-stone-300 to-transparent" />
                    </div>



                    {/* COLOR SWATCHES - Enhanced */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-stone-500 font-semibold">COLOR_PALETTE</span>
                            <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-2 py-1 rounded-md">{selectedColor}</span>
                        </div>

                        {/* Color Circles - 8 per row */}
                        <div className="grid grid-cols-8 gap-2.5">
                            {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                                <button
                                    key={name}
                                    onClick={() => {
                                        setActiveColorFamily(activeColorFamily === name ? null : name);
                                        setSelectedColor(colors[5]);
                                    }}
                                    className={`group relative w-full aspect-square rounded-full border transition-all duration-200 focus:ring-2 ring-offset-2 ring-stone-900 outline-none ${activeColorFamily === name
                                        ? 'ring-2 ring-offset-2 ring-stone-900 shadow-md scale-110'
                                        : 'border-stone-200 hover:scale-110 hover:shadow-sm'
                                        }`}
                                    title={name}
                                >
                                    <div className="absolute inset-1 rounded-full shadow-inner" style={{ backgroundColor: colors[5] }} />
                                </button>
                            ))}
                        </div>

                        {/* Active Palette Shades */}
                        {activeColorFamily && (
                            <div className="bg-gradient-to-br from-stone-50 to-stone-100 rounded-xl p-3 space-y-2 border border-stone-200 shadow-sm" style={{ animation: 'fade-in 0.3s ease-out' }}>
                                <div className="text-[9px] font-mono text-stone-600 uppercase font-semibold tracking-wider">{activeColorFamily}</div>
                                <div className="flex gap-1">
                                    {COLOR_PALETTES[activeColorFamily as keyof typeof COLOR_PALETTES].map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={`flex-1 h-6 first:rounded-l-md last:rounded-r-md transition-all duration-200 hover:scale-y-110 hover:shadow-sm relative ${selectedColor === color ? 'ring-2 ring-stone-900 ring-offset-2 z-10 shadow-md' : ''
                                                }`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {selectedColor === color && (
                                                <Check className={`w-3 h-3 absolute inset-0 m-auto drop-shadow-sm ${i < 5 ? 'text-stone-900' : 'text-white'}`} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>


                </section>

            </div>

            {/* Fixed Generate Button Footer */}
            <div className="border-t border-stone-200 bg-gradient-to-t from-stone-50 to-white sticky bottom-0 z-50" style={{ boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div className="px-5 pb-5 pt-4">
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !isValid}
                        className="w-full py-3 md:py-4 bg-gradient-to-r from-stone-900 to-stone-800 hover:from-stone-800 hover:to-stone-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 hover:shadow-lg"
                        title={!isValid ? "Please enter a brand name and description" : "Generate System"}
                        style={{ boxShadow: 'var(--shadow-md)' }}
                    >
                        <span className="text-sm tracking-wide">
                            {isGenerating ? 'Generating...' : hasGenerated ? 'Generate Again' : 'Generate'}
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
