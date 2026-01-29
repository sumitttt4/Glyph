"use client";

import { Type, Image as ImageIcon, LayoutTemplate } from "lucide-react";

interface ArchetypeSelectorProps {
    selected: 'symbol' | 'wordmark';
    onSelect: (value: 'symbol' | 'wordmark') => void;
}

export function ArchetypeSelector({ selected, onSelect }: ArchetypeSelectorProps) {
    const options = [
        {
            id: 'symbol',
            label: 'Symbol Priority',
            icon: ImageIcon,
            description: 'Icon + Text'
        },
        {
            id: 'wordmark',
            label: 'Typography Priority',
            icon: Type,
            description: 'Text Only / Dominant'
        }
    ] as const;

    return (
        <div className="grid grid-cols-2 gap-2">
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
                        size={20}
                        className={`mb-2 ${selected === option.id ? "text-stone-900" : "text-stone-400"}`}
                    />
                    <span
                        className={`text-xs font-semibold ${selected === option.id ? "text-stone-900" : "text-stone-500"}`}
                    >
                        {option.label}
                    </span>
                </button>
            ))}
        </div>
    );
}
