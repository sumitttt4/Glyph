"use client";

import { Type, Image as ImageIcon, Layers } from "lucide-react";

interface ArchetypeSelectorProps {
    selected: 'symbol' | 'wordmark' | 'both';
    onSelect: (value: 'symbol' | 'wordmark' | 'both') => void;
}

export function ArchetypeSelector({ selected, onSelect }: ArchetypeSelectorProps) {
    const options = [
        {
            id: 'symbol',
            label: 'Symbol',
            icon: ImageIcon,
            description: 'Icon/Mark Only'
        },
        {
            id: 'wordmark',
            label: 'Typography',
            icon: Type,
            description: 'Text-based Logo'
        },
        {
            id: 'both',
            label: 'Both',
            icon: Layers,
            description: 'Symbol + Wordmark'
        }
    ] as const;

    return (
        <div className="grid grid-cols-3 gap-2">
            {options.map((option) => (
                <button
                    key={option.id}
                    onClick={() => onSelect(option.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${selected === option.id
                        ? "bg-white border-stone-900 shadow-md ring-1 ring-stone-900/5"
                        : "bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-500"
                        }`}
                >
                    <option.icon
                        size={18}
                        className={`mb-1.5 ${selected === option.id ? "text-stone-900" : "text-stone-400"}`}
                    />
                    <span
                        className={`text-[11px] font-semibold ${selected === option.id ? "text-stone-900" : "text-stone-500"}`}
                    >
                        {option.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
