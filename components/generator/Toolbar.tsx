"use client";

import { useState } from 'react';
import { Sun, Moon, Download, ChevronDown, FileCode, Image, Package, Code2, Share2, Link, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface ToolbarProps {
    isDark: boolean;
    toggleDark: () => void;
    onExport?: (type: string) => void;
    viewMode: 'overview' | 'presentation';
    setViewMode: (mode: 'overview' | 'presentation') => void;
    // History Props
    canUndo?: boolean;
    canRedo?: boolean;
    onUndo?: () => void;
    onRedo?: () => void;
    currentHistoryIndex?: number;
    totalHistory?: number;
}

export function Toolbar({ isDark, toggleDark, onExport, viewMode, setViewMode, canUndo, canRedo, onUndo, onRedo, currentHistoryIndex, totalHistory }: ToolbarProps) {
    const [showExport, setShowExport] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [copied, setCopied] = useState(false);

    const exportOptions = [
        { id: 'tailwind', label: 'Tailwind Config', icon: FileCode, desc: 'CSS variables & tokens' },
        { id: 'svg', label: 'SVG Logo', icon: Image, desc: 'Vector format' },
        { id: 'react', label: 'React Component', icon: Code2, desc: 'Copy-paste ready' },
        { id: 'all', label: 'Full Package', icon: Package, desc: 'ZIP with all assets' },
    ];

    const handleShare = () => {
        // Generate a share link (in production this would save to DB)
        const shareUrl = `${window.location.origin}/share/${Date.now().toString(36)}`;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-3">
            {/* History Controls - Undo/Redo */}
            {(onUndo && onRedo) && (
                <div className="flex border border-stone-200 rounded-lg p-0.5 bg-white shadow-sm h-10 mr-2 items-center">
                    <button
                        onClick={onUndo}
                        disabled={!canUndo}
                        className="w-9 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors border-r border-stone-100"
                        title="Previous Brand"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="px-3 text-[10px] font-mono font-medium text-stone-400 select-none">
                        {currentHistoryIndex} / {totalHistory}
                    </div>
                    <button
                        onClick={onRedo}
                        disabled={!canRedo}
                        className="w-9 h-full flex items-center justify-center text-stone-500 hover:text-stone-900 disabled:opacity-30 disabled:hover:text-stone-500 transition-colors border-l border-stone-100"
                        title="Next Brand"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}

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

            {/* Share Button */}
            <div className="relative">
                <button
                    onClick={() => setShowShare(!showShare)}
                    className="flex items-center gap-2 p-2.5 border border-stone-200 rounded-full bg-white shadow-sm text-stone-700 hover:border-stone-400 transition-all"
                    title="Share"
                >
                    <Share2 className="w-4 h-4" />
                </button>

                {showShare && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-50 p-4">
                        <div className="text-sm font-semibold text-stone-900 mb-2">Share Preview</div>
                        <p className="text-xs text-stone-500 mb-3">Generate a public link to share your brand with clients.</p>
                        <button
                            onClick={handleShare}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
                            {copied ? 'Link Copied!' : 'Copy Share Link'}
                        </button>
                    </div>
                )}
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
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-50">
                        {exportOptions.map((option) => (
                            <button
                                key={option.id}
                                onClick={() => {
                                    onExport?.(option.id);
                                    setShowExport(false);
                                }}
                                className="w-full px-4 py-3 text-left hover:bg-stone-50 flex items-center gap-3 transition-colors group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors">
                                    <option.icon className="w-4 h-4 text-stone-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-stone-900">{option.label}</div>
                                    <div className="text-[10px] text-stone-400">{option.desc}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
