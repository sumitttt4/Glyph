"use client";

import { useState } from 'react';
import { Sun, Moon, Download, ChevronDown, FileCode, Image, Package } from 'lucide-react';

interface ToolbarProps {
    isDark: boolean;
    toggleDark: () => void;
    onExport?: (type: string) => void;
    viewMode: 'overview' | 'presentation';
    setViewMode: (mode: 'overview' | 'presentation') => void;
}

export function Toolbar({ isDark, toggleDark, onExport, viewMode, setViewMode }: ToolbarProps) {
    const [showExport, setShowExport] = useState(false);

    const exportOptions = [
        { id: 'tailwind', label: 'Tailwind Config', icon: FileCode },
        { id: 'svg', label: 'SVG Logo', icon: Image },
        { id: 'all', label: 'Full Package', icon: Package },
    ];

    return (
        <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex border border-stone-200 rounded-lg p-0.5 bg-white shadow-sm mr-2 h-10">
                <button
                    onClick={() => setViewMode('overview')}
                    className={`px-4 text-xs font-semibold rounded-md transition-all ${viewMode === 'overview' ? 'bg-stone-950 text-white shadow-sm' : 'text-stone-500 hover:text-stone-950'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setViewMode('presentation')}
                    className={`px-4 text-xs font-semibold rounded-md transition-all ${viewMode === 'presentation' ? 'bg-stone-950 text-white shadow-sm' : 'text-stone-500 hover:text-stone-950'}`}
                >
                    Guidelines
                </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex border border-stone-200 rounded-full p-0.5 bg-white shadow-sm">
                <button
                    onClick={() => !isDark && toggleDark()}
                    className={`p-2 rounded-full transition-all ${!isDark ? 'bg-stone-950 text-white' : 'text-stone-400 hover:text-stone-600'
                        }`}
                    title="Light Mode"
                >
                    <Sun className="w-4 h-4" />
                </button>
                <button
                    onClick={() => isDark && toggleDark()}
                    className={`p-2 rounded-full transition-all ${isDark ? 'bg-stone-950 text-white' : 'text-stone-400 hover:text-stone-600'
                        }`}
                    title="Dark Mode"
                >
                    <Moon className="w-4 h-4" />
                </button>
            </div>

            {/* Export Dropdown */}
            <div className="relative">
                <button
                    onClick={() => setShowExport(!showExport)}
                    className="flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-full bg-white shadow-sm text-sm font-medium text-stone-700 hover:border-stone-400 transition-all h-10"
                >
                    <Download className="w-4 h-4" />
                    Export
                    <ChevronDown className={`w-3 h-3 transition-transform ${showExport ? 'rotate-180' : ''}`} />
                </button>

                {showExport && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-stone-200 rounded-lg shadow-xl overflow-hidden z-50">
                        {exportOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    onExport?.(option.id);
                                    setShowExport(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm hover:bg-stone-50 flex items-center gap-3 transition-colors"
                            >
                                <option.icon className="w-4 h-4 text-stone-400" />
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
