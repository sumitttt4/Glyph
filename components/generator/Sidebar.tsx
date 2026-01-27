"use client";

import { useState, useEffect } from 'react';
import { Check, Shuffle } from 'lucide-react';
import { VibeSelector } from './VibeSelector';
import { expandBriefWithAI, suggestVibeWithAI, expandVibeWithAI } from '@/lib/brand-generator';
import { GlyphIcon } from '@/components/logo-engine/LogoGlyph';

import { ArchetypeSelector } from './ArchetypeSelector';
import { BrandContextSelector, INDUSTRIES } from './BrandContextSelector';

export interface GenerationOptions {
    prompt: string;
    vibe: string;
    name: string;
    archetype: 'symbol' | 'wordmark';
    color?: string;
    shape?: string;
    gradient?: { colors: string[]; angle: number } | null;
    surpriseMe?: boolean;
}

export interface SidebarProps {
    onGenerate: (options: GenerationOptions) => void;
    isGenerating: boolean;
    selectedVibe: string;
    setSelectedVibe: (vibe: string) => void;
    hasGenerated?: boolean;
    isCollapsed?: boolean;
    onToggle?: () => void;
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

export function Sidebar({ onGenerate, isGenerating, selectedVibe, setSelectedVibe, hasGenerated, isCollapsed, onToggle }: SidebarProps) {
    const [prompt, setPrompt] = useState('');
    const [brandName, setBrandName] = useState('');
    const [selectedColor, setSelectedColor] = useState('#f97316');
    const [activeColorFamily, setActiveColorFamily] = useState<string | null>(null);
    const [customVibe, setCustomVibe] = useState('');
    const [selectedGradient, setSelectedGradient] = useState<string | null>(null);
    const [selectedShape, setSelectedShape] = useState<string | null>(null);
    const [selectedArchetype, setSelectedArchetype] = useState<'symbol' | 'wordmark'>('symbol');
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
                if (data.archetype) setSelectedArchetype(data.archetype);
            } catch (e) {
                console.error("Failed to restore draft", e);
            }
        }
    }, []);

    // Generation Limit State
    const [generationCount, setGenerationCount] = useState(0);

    useEffect(() => {
        const count = parseInt(localStorage.getItem('glyph_generation_count') || '0');
        setGenerationCount(count);
    }, []);

    const handleGenerate = async () => {
        if (!isValid) return;

        // CHECK LIMIT
        const hasAdminBypass = document.cookie.split(';').some(c => c.trim().startsWith('admin-bypass=true'));

        if (!hasAdminBypass && generationCount >= 3) {
            // Block action
            if (confirm("Free preview limit reached. Unlock the Founder Pass to continue generating unlimited brands.\\n\\nClick OK to upgrade now.")) {
                window.location.href = "/#pricing"; // Redirect to pricing section
            }
            return;
        }

        // Increment count
        if (!hasAdminBypass) {
            const newCount = generationCount + 1;
            setGenerationCount(newCount);
            localStorage.setItem('glyph_generation_count', newCount.toString());
        }

        const vibeToUse = selectedVibe === 'custom' && customVibe ? customVibe : selectedVibe;

        const gradientObj = selectedGradient
            ? GRADIENT_PRESETS.find(g => g.id === selectedGradient)
            : null;

        onGenerate({
            prompt,
            vibe: vibeToUse,
            name: brandName,
            color: selectedColor,
            archetype: selectedArchetype,
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
            archetype: 'symbol',
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
        <aside className="w-full h-full bg-white flex flex-col relative">

            {/* Header - Premium Height & Spacing */}
            <div className="h-16 border-b border-stone-100 flex items-center justify-between px-6 bg-white shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-stone-950 text-white flex items-center justify-center shadow-md shadow-stone-900/10">
                        <GlyphIcon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-stone-900">Glyph</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-50 border border-stone-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider">Ready</span>
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide">

                {/* PROJECT DETAILS */}
                <section className="space-y-6">
                    <div className="flex flex-col space-y-1">
                        <h3 className="text-sm font-semibold text-stone-900 tracking-tight">Project Identity</h3>
                        <p className="text-xs text-stone-500">Define the core DNA of your brand.</p>
                    </div>

                    <div className="space-y-5">
                        <BrandContextSelector
                            onSelect={(industry) => {
                                // AUTO-SELECT LOGIC based on Industry DNA
                                setSelectedVibe(industry.vibe);
                                if (industry.archetype === 'app-icon') {
                                    setSelectedArchetype('symbol');
                                } else if (industry.archetype === 'wordmark') {
                                    setSelectedArchetype('wordmark');
                                }
                            }}
                        />

                        <div className="space-y-3">
                            <label className="text-[13px] font-medium text-stone-700">Archetype</label>
                            <ArchetypeSelector selected={selectedArchetype} onSelect={setSelectedArchetype} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-stone-700">Brand Name</label>
                            <input
                                type="text"
                                value={brandName}
                                onChange={(e) => setBrandName(e.target.value)}
                                className="flex h-10 w-full rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 placeholder:text-stone-400 hover:border-stone-300"
                                placeholder="e.g. Acme Corp"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <div className="flex items-center justify-between">
                                <label className="text-[13px] font-medium text-stone-700">Mission Statement</label>
                                <button
                                    onClick={handleExpandBrief}
                                    disabled={!prompt.trim() || isAiLoading}
                                    className="text-[11px] font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-default flex items-center gap-1 transition-colors"
                                >
                                    {isAiLoading ? 'Reframing...' : <>Reframe with AI <span className="text-xs">✨</span></>}
                                </button>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="flex min-h-[120px] w-full rounded-lg border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all hover:border-stone-300"
                                    placeholder="Describe your brand's core values and mission..."
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-stone-100" />

                {/* AESTHETIC */}
                <section className="space-y-6">
                    <div className="flex flex-col space-y-1">
                        <h3 className="text-sm font-semibold text-stone-900 tracking-tight">Aesthetic Direction</h3>
                        <p className="text-xs text-stone-500">Choose the visual language.</p>
                    </div>

                    <div className="space-y-5">
                        <VibeSelector
                            selectedVibe={selectedVibe}
                            onVibeChange={setSelectedVibe}
                        />

                        <div className="space-y-2">
                            <label className="text-[13px] font-medium text-stone-700">Custom Vibe <span className="text-stone-400 font-normal">(Optional)</span></label>
                            <div className="relative">
                                <textarea
                                    value={customVibe}
                                    onChange={(e) => {
                                        setCustomVibe(e.target.value);
                                        if (e.target.value) setSelectedVibe('custom');
                                        e.target.style.height = 'auto';
                                        e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                                    }}
                                    onFocus={() => setSelectedVibe('custom')}
                                    placeholder="Describe a specific look..."
                                    rows={1}
                                    className={`flex w-full rounded-lg border px-3 py-2.5 text-sm ring-offset-white placeholder:text-stone-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2 resize-none overflow-hidden transition-all min-h-[42px] shadow-sm ${selectedVibe === 'custom'
                                        ? 'border-stone-900 ring-0 bg-white'
                                        : 'border-stone-200 bg-transparent hover:border-stone-300'
                                        }`}
                                />
                                {selectedVibe === 'custom' && (
                                    <div className="absolute right-3 top-3">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-stone-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-stone-900"></span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <div className="h-px bg-stone-100" />

                {/* COLOR SYSTEM */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col space-y-1">
                            <h3 className="text-sm font-semibold text-stone-900 tracking-tight">Color System</h3>
                            <p className="text-xs text-stone-500">Select a primary palette.</p>
                        </div>
                        {selectedColor && (
                            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white border border-stone-200 shadow-sm">
                                <div className="w-3.5 h-3.5 rounded-full shadow-inner ring-1 ring-black/5" style={{ backgroundColor: selectedColor }} />
                                <span className="text-[10px] font-mono font-medium text-stone-600 uppercase">{selectedColor}</span>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {/* Compact Color Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {Object.entries(COLOR_PALETTES).map(([name, colors]) => (
                                <button
                                    key={name}
                                    onClick={() => {
                                        setActiveColorFamily(activeColorFamily === name ? null : name);
                                        setSelectedColor(colors[5]);
                                    }}
                                    className={`group relative w-full aspect-square rounded-full transition-all duration-200 hover:scale-110 ${activeColorFamily === name
                                        ? 'ring-2 ring-stone-900 ring-offset-2 z-10 shadow-md scale-110'
                                        : 'hover:ring-2 hover:ring-stone-200 hover:ring-offset-1 opacity-90 hover:opacity-100'
                                        }`}
                                    title={name}
                                >
                                    <div className="absolute inset-0 rounded-full shadow-sm ring-1 ring-black/5" style={{ backgroundColor: colors[5] }} />
                                </button>
                            ))}
                        </div>

                        {/* Expanded Shades */}
                        {activeColorFamily && (
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 animate-in fade-in slide-in-from-top-2 duration-200 shadow-inner">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[11px] font-bold uppercase tracking-widest text-stone-500">{activeColorFamily} Spectrum</span>
                                </div>
                                <div className="flex gap-1 h-10 w-full">
                                    {COLOR_PALETTES[activeColorFamily as keyof typeof COLOR_PALETTES].map((color, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={`flex-1 first:rounded-l-md last:rounded-r-md transition-all hover:scale-y-110 hover:shadow-lg relative group z-0 hover:z-10 focus:z-10 focus:outline-none`}
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        >
                                            {selectedColor === color && (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${i < 5 ? 'bg-stone-900' : 'bg-white'} shadow-sm`} />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-stone-100 bg-white z-20 shadow-[0_-4px_24px_-12px_rgba(0,0,0,0.1)]">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !isValid}
                    className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-stone-900 px-8 text-sm font-semibold text-white shadow-lg shadow-stone-900/20 transition-all hover:bg-stone-800 hover:shadow-stone-900/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-950 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:translate-y-0"
                >
                    {isGenerating ? (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Crafting Identity...</span>
                        </div>
                    ) : hasGenerated ? (
                        <div className="flex items-center gap-2">
                            <Shuffle className="w-4 h-4" />
                            <span>Regenerate System</span>
                        </div>
                    ) : (
                        'Generate Identity'
                    )}
                </button>
            </div>
        </aside>
    );
}
