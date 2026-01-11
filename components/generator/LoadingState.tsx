"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingStateProps {
    isLoading: boolean;
}

const LOADING_MESSAGES = [
    'Understanding your vision',
    'Searching for the perfect vibe',
    'Crafting color harmony',
    'Designing your logo mark',
    'Building your brand identity',
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
        }, 900);

        return () => clearInterval(interval);
    }, [isLoading]);

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-stone-950"
                >
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-900 via-stone-950 to-black" />

                    {/* Ambient glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl" />

                    {/* Center Content */}
                    <div className="relative z-10 text-center max-w-md px-8">
                        {/* Animated Ring */}
                        <div className="relative w-20 h-20 mx-auto mb-10">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-0 border-2 border-stone-700 border-t-orange-500 rounded-full"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                                className="absolute inset-2 border border-stone-800 border-t-stone-500 rounded-full"
                            />
                            {/* Center dot */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                            </div>
                        </div>

                        {/* Loading Message */}
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={messageIndex}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.3 }}
                                className="text-stone-300 text-lg font-medium tracking-wide"
                            >
                                {LOADING_MESSAGES[messageIndex]}
                            </motion.p>
                        </AnimatePresence>

                        {/* Typewriter dots */}
                        <motion.div
                            className="flex justify-center gap-1 mt-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    animate={{ opacity: [0.3, 1, 0.3] }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        delay: i * 0.2
                                    }}
                                    className="text-stone-500"
                                >
                                    .
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Progress bar */}
                        <div className="mt-10 w-full h-0.5 bg-stone-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                                initial={{ width: '0%' }}
                                animate={{ width: `${((messageIndex + 1) / LOADING_MESSAGES.length) * 100}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
