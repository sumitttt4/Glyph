"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUpDown, Check, Building2, Smartphone, Briefcase, ShoppingBag, Zap, Gavel, User, Globe, Home } from "lucide-react";

// 1. THE 20+ INDUSTRY PRESETS
// Each maps to a specific "Archetype" and "Default Vibe"
export const INDUSTRIES = [
    { id: "saas", label: "SaaS / B2B Startup", icon: Building2, archetype: "geometric", vibe: "tech" },
    { id: "app", label: "Mobile App (Consumer)", icon: Smartphone, archetype: "app-icon", vibe: "bold" },
    { id: "agency", label: "Design Agency / Studio", icon: Briefcase, archetype: "abstract", vibe: "minimalist" },
    { id: "fintech", label: "Fintech & Banking", icon: Building2, archetype: "trust", vibe: "tech" },
    { id: "crypto", label: "Web3 / Crypto Protocol", icon: Zap, archetype: "futuristic", vibe: "tech" },
    { id: "ai", label: "AI / LLM Tool", icon: Zap, archetype: "sparkle", vibe: "tech" },
    { id: "dev", label: "Developer Tool / API", icon: Zap, archetype: "terminal", vibe: "tech" },
    { id: "d2c", label: "E-Commerce / D2C", icon: ShoppingBag, archetype: "organic", vibe: "bold" },
    { id: "health", label: "Health & Wellness", icon: ShoppingBag, archetype: "organic", vibe: "nature" },
    { id: "legal", label: "Legal & Corporate", icon: Gavel, archetype: "serif", vibe: "minimalist" },
    { id: "creator", label: "Creator / Personal Brand", icon: User, archetype: "signature", vibe: "bold" },
    { id: "social", label: "Social Network", icon: Globe, archetype: "bubble", vibe: "bold" },
    { id: "realestate", label: "Real Estate / Proptech", icon: Home, archetype: "structure", vibe: "luxury" },
];

export interface BrandContextSelectorProps {
    onSelect: (industry: typeof INDUSTRIES[0]) => void;
    selectedId?: string;
}

export function BrandContextSelector({ onSelect, selectedId }: BrandContextSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(INDUSTRIES.find(i => i.id === selectedId) || INDUSTRIES[0]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close on click outside
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (industry: typeof INDUSTRIES[0]) => {
        setSelected(industry);
        setIsOpen(false);
        // Pass the "DNA" up to the parent generation engine
        onSelect(industry);
    };

    return (
        <div className="w-full mb-8" ref={containerRef}>
            <label className="text-xs font-medium text-neutral-500 mb-2 block">
                Brand Category
            </label>

            {/* THE DROPDOWN TRIGGER */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between px-3 py-3 bg-white border border-stone-200 rounded-xl shadow-sm hover:border-orange-500/50 transition-colors group text-left"
                >
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-stone-50 text-stone-500 group-hover:text-orange-600 transition-colors`}>
                            <selected.icon size={20} strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-stone-900 truncate">{selected.label}</div>
                            <div className="text-[10px] text-stone-400 truncate">Optimized for {selected.id}</div>
                        </div>
                    </div>
                    <ChevronsUpDown size={16} className="text-stone-400 shrink-0 ml-2" />
                </button>

                {/* THE DROPDOWN CONTENT */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-stone-200 p-1 z-50 max-h-[300px] overflow-y-auto">
                        {INDUSTRIES.map((industry) => (
                            <div
                                key={industry.id}
                                onClick={() => handleSelect(industry)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer text-sm font-medium transition-colors ${selected.id === industry.id
                                        ? "bg-orange-50 text-orange-900"
                                        : "text-stone-600 hover:bg-stone-50"
                                    }`}
                            >
                                <industry.icon size={16} className={`shrink-0 ${selected.id === industry.id ? "text-orange-500" : "text-stone-400"}`} />
                                <span className="flex-1 truncate">{industry.label}</span>
                                {selected.id === industry.id && <Check size={16} className="text-orange-500 shrink-0" />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* VISUAL FEEDBACK: "What this does" */}
            <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-stone-50 text-[10px] font-mono text-stone-500 border border-stone-200">
                    Layout: {selected.id === 'app' ? 'ICON_ONLY' : 'HORIZONTAL'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-stone-50 text-[10px] font-mono text-stone-500 border border-stone-200">
                    Shape: {selected.archetype.toUpperCase()}
                </span>
            </div>
        </div>
    );
}
