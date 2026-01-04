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
            <label className="text-xs font-mono uppercase text-stone-500 tracking-wide font-semibold">
                Select Your Vibe
            </label>

            {/* Tactile Tiles Grid - Enhanced */}
            <div className="grid grid-cols-2 gap-3">
                {VIBES.map((vibe) => {
                    const isSelected = selectedVibe === vibe.id;

                    return (
                        <button
                            key={vibe.id}
                            onClick={() => onVibeChange(vibe.id)}
                            className={`
                                relative h-20 p-4 rounded-xl text-left
                                transition-all duration-200 ease-out
                                group
                                
                                /* Base styling */
                                bg-white border
                                
                                /* Hover */
                                hover:-translate-y-1 hover:border-stone-400
                                
                                /* Active */
                                active:scale-[0.98]
                                
                                /* Selected */
                                ${isSelected
                                    ? 'ring-2 ring-stone-900 bg-gradient-to-br from-stone-50 to-white border-transparent shadow-md'
                                    : 'border-stone-200 hover:shadow-lg'
                                }
                            `}
                            style={{ 
                                boxShadow: isSelected 
                                    ? 'var(--shadow-md)' 
                                    : 'var(--shadow-xs)'
                            }}
                        >
                            {/* Check Circle */}
                            {isSelected && (
                                <div className="absolute top-3 right-3" style={{ animation: 'fade-in 0.2s ease-out' }}>
                                    <CheckCircle2 className="w-5 h-5 text-stone-900 fill-stone-900 drop-shadow-sm" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="flex flex-col justify-center h-full">
                                <div className={`font-bold text-base mb-1 transition-colors ${
                                    isSelected ? 'text-stone-900' : 'text-stone-700 group-hover:text-stone-900'
                                }`}>
                                    {vibe.title}
                                </div>
                                <div className={`text-[11px] leading-tight transition-colors ${
                                    isSelected ? 'text-stone-600' : 'text-stone-400 group-hover:text-stone-500'
                                }`}>
                                    {vibe.desc}
                                </div>
                            </div>

                            {/* Subtle gradient overlay on hover */}
                            {!isSelected && (
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-stone-50/0 to-stone-100/0 group-hover:from-stone-50/50 group-hover:to-stone-100/30 transition-all duration-200 pointer-events-none" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
