"use client";

import React from 'react';
import { ArrowLeft } from 'lucide-react';

export function RobotEmptyState() {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in duration-500">
            {/* Robot Container */}
            <div className="relative group">
                {/* Robot Body Construction - Geometric & Techy */}
                <div className="w-40 h-40 relative">
                    {/* Glowing Aura */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-orange-500/20 rounded-full blur-2xl animate-pulse"></div>

                    {/* Main Robot SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                        <defs>
                            <linearGradient id="robot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#f97316" /> {/* Orange-500 */}
                                <stop offset="100%" stopColor="#ea580c" /> {/* Orange-600 */}
                            </linearGradient>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>

                        {/* Floating Head */}
                        <g className="animate-float">
                            {/* Head Shape - Squircle */}
                            <rect x="25" y="25" width="50" height="40" rx="12" fill="white" stroke="#f97316" strokeWidth="2.5" />

                            {/* Visor / Face */}
                            <path d="M 32,42 Q 50,42 68,42" stroke="#f97316" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

                            {/* Eyes - Glowing Orange */}
                            <circle cx="40" cy="38" r="3" fill="#f97316" filter="url(#glow)">
                                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle cx="60" cy="38" r="3" fill="#f97316" filter="url(#glow)">
                                <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                            </circle>

                            {/* Antenna */}
                            <line x1="50" y1="25" x2="50" y2="15" stroke="#f97316" strokeWidth="2" />
                            <circle cx="50" cy="15" r="3" fill="#f97316" className="animate-ping-slow" />
                        </g>

                        {/* Body - Minimalist Lines */}
                        <g className="animate-float-delayed" opacity="0.8">
                            <path d="M 35,75 Q 50,90 65,75" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                            <circle cx="50" cy="88" r="4" fill="white" stroke="#f97316" strokeWidth="2" />
                        </g>

                        {/* Waving Hand - Geometric */}
                        <g className="origin-[25px_65px] animate-wave-smooth">
                            <circle cx="20" cy="65" r="6" fill="white" stroke="#f97316" strokeWidth="2" />
                            <path d="M 25,65 L 35,60" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                        </g>

                        {/* Right Hand - Geometric */}
                        <g className="animate-float-delayed">
                            <circle cx="80" cy="65" r="6" fill="white" stroke="#f97316" strokeWidth="2" />
                            <path d="M 74,65 L 65,60" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
                        </g>

                    </svg>
                </div>
            </div>

            {/* Content Text */}
            <div className="mt-6 text-center space-y-2 max-w-sm">
                <h3 className="font-bold text-lg text-stone-800 tracking-tight">
                    Ready to Design?
                </h3>
                <p className="text-sm text-stone-500 font-medium leading-relaxed">
                    Configure your brand DNA in the sidebar<br />
                    to generate your unique identity system.
                </p>
            </div>

            {/* Desktop Helper Arrow */}
            <div className="hidden md:flex items-center gap-2 mt-8 px-4 py-2 bg-stone-50 rounded-full border border-stone-100 text-stone-400 opacity-0 animate-in fade-in slide-in-from-right-4 delay-500 fill-mode-forwards">
                <ArrowLeft className="w-4 h-4 animate-bounce-x text-orange-500" />
                <span className="text-xs font-semibold tracking-wide text-stone-500">Start Here</span>
            </div>
        </div>
    );
}
