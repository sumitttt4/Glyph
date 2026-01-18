'use client';

import { useState, useEffect } from 'react';
import { Lock } from "lucide-react";

// Sample brand configurations to cycle through
const BRAND_EXAMPLES = [
    {
        name: 'Acctual',
        color: '#FF4500',
        logoShape: 'circle',
        tagline: 'Finance',
    },
    {
        name: 'Verdant',
        color: '#059669',
        logoShape: 'hexagon',
        tagline: 'Sustainability',
    },
    {
        name: 'Nexus',
        color: '#6366F1',
        logoShape: 'square',
        tagline: 'Technology',
    },
    {
        name: 'Amber',
        color: '#D97706',
        logoShape: 'triangle',
        tagline: 'Architecture',
    },
];

export default function BrowserMockup() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const currentBrand = BRAND_EXAMPLES[currentIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % BRAND_EXAMPLES.length);
                setIsTransitioning(false);
            }, 300);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const renderLogoShape = (shape: string) => {
        switch (shape) {
            case 'circle':
                return <div className="w-8 h-8 rounded-full bg-white/30" />;
            case 'hexagon':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                        <path d="M12 2L22 8.5V15.5L12 22L2 15.5V8.5L12 2Z" fill="white" fillOpacity="0.3" />
                    </svg>
                );
            case 'square':
                return <div className="w-7 h-7 rounded-md bg-white/30 rotate-12" />;
            case 'triangle':
                return (
                    <svg viewBox="0 0 24 24" className="w-8 h-8">
                        <path d="M12 3L22 21H2L12 3Z" fill="white" fillOpacity="0.3" />
                    </svg>
                );
            default:
                return <div className="w-8 h-8 rounded-full bg-white/30" />;
        }
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-xl border border-stone-200 shadow-2xl overflow-hidden">

            {/* Browser Chrome */}
            <div className="bg-stone-50 border-b border-stone-200 p-3 flex items-center gap-3">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                    <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>

                <div className="flex-1 bg-white border border-stone-200 rounded-md py-1.5 px-3 flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <Lock className="w-3 h-3 text-stone-400" />
                    <span>glyph.design/{currentBrand.name.toLowerCase()}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-stone-50 min-h-[350px] relative">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                </div>

                {/* Brand Card */}
                <div className={`relative z-10 transition-all duration-300 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>

                    {/* Logo + Name */}
                    <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-md mb-4">
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className="w-14 h-14 rounded-xl flex items-center justify-center transition-colors duration-300"
                                style={{ backgroundColor: currentBrand.color }}
                            >
                                {renderLogoShape(currentBrand.logoShape)}
                            </div>
                            <div>
                                <div className="text-xl font-bold text-stone-900">{currentBrand.name}</div>
                                <div className="text-xs text-stone-400 uppercase tracking-wider">{currentBrand.tagline}</div>
                            </div>
                        </div>

                        {/* Color Palette */}
                        <div className="flex gap-2">
                            <div
                                className="w-10 h-10 rounded-lg transition-colors duration-300"
                                style={{ backgroundColor: currentBrand.color }}
                            />
                            <div className="w-10 h-10 rounded-lg bg-stone-900" />
                            <div className="w-10 h-10 rounded-lg bg-stone-100 border border-stone-200" />
                            <div className="w-10 h-10 rounded-lg bg-white border border-stone-200" />
                        </div>
                    </div>

                    {/* Code Preview */}
                    <div className="bg-stone-900 rounded-xl p-4 font-mono text-[11px] text-stone-300 leading-relaxed">
                        <div className="flex gap-1.5 mb-3">
                            <div className="w-2 h-2 rounded-full bg-stone-700" />
                            <div className="w-2 h-2 rounded-full bg-stone-700" />
                            <div className="w-2 h-2 rounded-full bg-stone-700" />
                        </div>
                        <span className="text-stone-500">export const</span> <span className="text-white">theme</span> = {'{'}<br />
                        &nbsp;&nbsp;primary: <span style={{ color: currentBrand.color }}>&quot;{currentBrand.color}&quot;</span>,<br />
                        &nbsp;&nbsp;name: <span className="text-stone-400">&quot;{currentBrand.name}&quot;</span><br />
                        {'}'};
                    </div>

                </div>

                {/* Progress Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {BRAND_EXAMPLES.map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-stone-900 w-4' : 'bg-stone-300'}`}
                        />
                    ))}
                </div>
            </div>

        </div>
    );
}
