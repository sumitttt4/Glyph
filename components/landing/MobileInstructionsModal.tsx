"use client";

import React, { useEffect } from 'react';
import { InstructionCards } from '@/components/generator/InstructionCards';
import { ArrowRight, X } from 'lucide-react';

interface MobileInstructionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: () => void;
}

export function MobileInstructionsModal({ isOpen, onClose, onContinue }: MobileInstructionsModalProps) {

    // Prevent scrolling when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content - Bottom Sheet on Mobile, Centered on Desktop */}
            <div className="relative w-full max-w-md bg-stone-50 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-300">

                {/* Header */}
                <div className="px-6 pt-8 pb-2 flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-editorial text-stone-900">
                        Let&apos;s Build Your Brand.
                    </h3>
                    <button onClick={onClose} className="p-2 -mr-2 rounded-full hover:bg-stone-200 text-stone-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-8">
                    <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                        To ensure the best quality results, please follow these 3 simple steps in the next screen:
                    </p>

                    <InstructionCards />

                    {/* Action Button */}
                    <button
                        onClick={onContinue}
                        className="w-full mt-8 h-12 bg-[#FF4500] hover:bg-orange-600 text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-orange-500/25 transition-all active:scale-[0.98]"
                    >
                        <span>Start Generator</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
