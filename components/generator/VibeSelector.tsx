"use client";

import { CheckCircle2 } from 'lucide-react';

interface Vibe {
    id: string;
    title: string;
    desc: string;
}

const VIBES: Vibe[] = [
    { id: 'minimalist', title: 'Minimalist', desc: 'Clean, essential, swiss.' },
    { id: 'tech', title: 'Tech', desc: 'Bold, futuristic, digital.' },
    { id: 'nature', title: 'Nature', desc: 'Organic, calm, grounded.' },
    { id: 'bold', title: 'Bold', desc: 'High contrast, loud, punchy.' },
];

interface VibeSelectorProps {
    selectedVibe: string;
    onVibeChange: (vibeId: string) => void;
}

export function VibeSelector({ selectedVibe, onVibeChange }: VibeSelectorProps) {
    return (
        <div className="space-y-3">
            {/* Simple Grid */}
            <div className="grid grid-cols-2 gap-3">
                {VIBES.map((vibe) => {
                    const isSelected = selectedVibe === vibe.id;

                    return (
                        <button
                            key={vibe.id}
                            onClick={() => onVibeChange(vibe.id)}
                            className={`
                                relative flex flex-col items-start justify-center p-3.5 rounded-xl text-left border transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-stone-950 focus-visible:ring-offset-2
                                ${isSelected
                                    ? 'bg-stone-50 border-stone-900 shadow-sm'
                                    : 'bg-transparent border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                                }
                            `}
                        >
                            <div className="flex w-full items-center justify-between mb-1.5">
                                <span className={`text-[13px] font-semibold tracking-tight ${isSelected ? 'text-stone-900' : 'text-stone-700'}`}>
                                    {vibe.title}
                                </span>
                                {isSelected && (
                                    <CheckCircle2 className="w-4 h-4 text-stone-900" />
                                )}
                            </div>
                            <span className={`text-xs leading-relaxed ${isSelected ? 'text-stone-600' : 'text-stone-500'}`}>
                                {vibe.desc}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
