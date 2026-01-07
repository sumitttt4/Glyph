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
            <div className="grid grid-cols-2 gap-2">
                {VIBES.map((vibe) => {
                    const isSelected = selectedVibe === vibe.id;

                    return (
                        <button
                            key={vibe.id}
                            onClick={() => onVibeChange(vibe.id)}
                            className={`
                                relative flex flex-col items-start justify-center p-3 rounded-md text-left border transition-all outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2
                                ${isSelected
                                    ? 'bg-neutral-50 border-neutral-900 ring-0 shadow-sm'
                                    : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                                }
                            `}
                        >
                            <div className="flex w-full items-center justify-between mb-1">
                                <span className={`text-sm font-medium ${isSelected ? 'text-neutral-900' : 'text-neutral-700'}`}>
                                    {vibe.title}
                                </span>
                                {isSelected && (
                                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900" />
                                )}
                            </div>
                            <span className={`text-xs ${isSelected ? 'text-neutral-600' : 'text-neutral-500'}`}>
                                {vibe.desc}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
