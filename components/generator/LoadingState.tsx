"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingStateProps {
    isLoading: boolean;
}

const LOADING_MESSAGES = [
    'Initializing Neural Engine...',
    'Analyzing Vibe Vector...',
    'Constructing Geometry...',
    'Solving Color Harmony...',
    'Rendering Brand Assets...',
];

export function LoadingState({ isLoading }: LoadingStateProps) {
    const [messageIndex, setMessageIndex] = useState(0);

    useEffect(() => {
        if (!isLoading) {
            setMessageIndex(0);
            return;
        }

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 800);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center"
                    style={{
                        backgroundColor: '#1A3A1A', // Dark green cutting mat
                        backgroundImage: `
              linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)
            `,
                        backgroundSize: '24px 24px',
                    }}
                >
                    {/* Center Content */}
                    <div className="text-center">
                        {/* Animated Logo Mark */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 mx-auto mb-8 border-4 border-green-400 border-t-transparent rounded-full"
                        />

                        {/* Loading Message */}
                        <motion.p
                            key={messageIndex}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-green-400 font-mono text-lg tracking-wide"
                        >
                            {LOADING_MESSAGES[messageIndex]}
                        </motion.p>

                        {/* Progress Dots */}
                        <div className="flex justify-center gap-2 mt-6">
                            {LOADING_MESSAGES.map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full transition-colors ${i <= messageIndex ? 'bg-green-400' : 'bg-green-900'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Corner Grid Lines (Cutting Mat Aesthetic) */}
                    <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-green-600 opacity-50" />
                    <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-green-600 opacity-50" />
                    <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-green-600 opacity-50" />
                    <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-green-600 opacity-50" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
