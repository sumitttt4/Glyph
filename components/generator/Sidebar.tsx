"use client";

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

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

export function Sidebar({ onGenerate, isGenerating, selectedVibe, setSelectedVibe }: SidebarProps) {
    const [prompt, setPrompt] = useState('');
    const [brandName, setBrandName] = useState('');

    const handleGenerate = () => {
        onGenerate(prompt, selectedVibe, brandName);
    };

    return (
        <aside className="w-full md:w-[400px] h-full bg-white border-r border-stone-200 p-8 flex flex-col z-20 shadow-xl overflow-y-auto">
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
                    placeholder="e.g. Swype"
                />
            </div>

            {/* The Brief - AI Prompt Input */}
            <div className="space-y-3 mb-8">
                <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                    The Brief
                </label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full h-28 p-4 bg-white border border-stone-200 rounded-lg text-sm focus:ring-2 focus:ring-[#FF4500] focus:border-transparent outline-none resize-none placeholder:text-stone-400 transition-all"
                    placeholder="e.g. A fintech startup for Gen Z called 'Swype'..."
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="w-full py-3.5 bg-[#FF4500] text-white rounded-lg font-bold hover:bg-[#E63E00] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                    {isGenerating ? (
                        <>
                            <Sparkles className="w-4 h-4 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        'Generate System'
                    )}
                </button>
            </div>

            {/* Vibe Selector */}
            <div className="space-y-3 mb-8">
                <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                    Select Your Vibe
                </label>
                <div className="grid grid-cols-2 gap-2">
                    {VIBES.map((vibe) => (
                        <button
                            key={vibe.id}
                            onClick={() => setSelectedVibe(vibe.id)}
                            className={`group text-left px-4 py-3 rounded-lg border transition-all ${selectedVibe === vibe.id
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
            </div>

            {/* Color Lock (Future Feature) */}
            <div className="space-y-3 mt-auto pt-8 border-t border-stone-100">
                <label className="text-xs font-mono uppercase text-stone-400 tracking-widest">
                    Lock Palette
                </label>
                <div className="flex gap-2">
                    {['#FF4500', '#FAFAF9', '#0C0A09', '#38BDF8'].map((color, i) => (
                        <button
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-stone-200 hover:scale-110 transition-transform hover:border-stone-400"
                            style={{ backgroundColor: color }}
                            title={`Lock ${color}`}
                        />
                    ))}
                </div>
                <p className="text-[10px] text-stone-400">Click to lock colors during regeneration</p>
            </div>
        </aside>
    );
}
