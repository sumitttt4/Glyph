"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronsUpDown, Check, Building2, Smartphone, Briefcase, ShoppingBag, Zap, Gavel, User, Globe, Home } from "lucide-react";

// 1. THE 20+ INDUSTRY PRESETS
// Each maps to a specific "Archetype", "Default Vibe", and recommended color
// Colors are based on industry psychology and trust signals
export const INDUSTRIES = [
    { id: "realestate", label: "Real Estate / Proptech", icon: Home, archetype: "structure", vibe: "luxury", color: "#1e3a8a" }, // Deep blue - trust & stability
    { id: "saas", label: "SaaS / B2B Startup", icon: Building2, archetype: "geometric", vibe: "tech", color: "#3b82f6" }, // Blue - professional & reliable
    { id: "app", label: "Mobile App (Consumer)", icon: Smartphone, archetype: "app-icon", vibe: "bold", color: "#8b5cf6" }, // Purple - creative & modern
    { id: "agency", label: "Design Agency / Studio", icon: Briefcase, archetype: "abstract", vibe: "minimalist", color: "#171717" }, // Black - sophisticated & premium
    { id: "fintech", label: "Fintech & Banking", icon: Building2, archetype: "trust", vibe: "tech", color: "#1d4ed8" }, // Strong blue - financial trust
    { id: "crypto", label: "Web3 / Crypto Protocol", icon: Zap, archetype: "futuristic", vibe: "tech", color: "#22c55e" }, // Green - trust & growth
    { id: "ai", label: "AI / LLM Tool", icon: Zap, archetype: "sparkle", vibe: "tech", color: "#6366f1" }, // Indigo - intelligence & innovation
    { id: "dev", label: "Developer Tool / API", icon: Zap, archetype: "terminal", vibe: "tech", color: "#10b981" }, // Emerald - code/terminal aesthetic
    { id: "d2c", label: "E-Commerce / D2C", icon: ShoppingBag, archetype: "organic", vibe: "bold", color: "#f97316" }, // Orange - energetic & action
    { id: "health", label: "Health & Wellness", icon: ShoppingBag, archetype: "organic", vibe: "nature", color: "#14b8a6" }, // Teal - calm & wellness
    { id: "legal", label: "Legal & Corporate", icon: Gavel, archetype: "serif", vibe: "minimalist", color: "#1c1917" }, // Dark stone - authority & trust
    { id: "creator", label: "Creator / Personal Brand", icon: User, archetype: "signature", vibe: "bold", color: "#ec4899" }, // Pink - personality & creativity
    { id: "social", label: "Social Network", icon: Globe, archetype: "bubble", vibe: "bold", color: "#0ea5e9" }, // Sky blue - friendly & open
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
