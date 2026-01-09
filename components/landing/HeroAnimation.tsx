"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 1. THE DATA (The brands we cycle through)
const DEMOS = [
    {
        name: "Amber",
        vibe: "Architecture",
        color: "#D97706", // Amber-600
        shape: "tri-stack" // We simulate this with grid logic below
    },
    {
        name: "Orbit",
        vibe: "Fintech",
        color: "#2563EB", // Blue-600
        shape: "circle-grid"
    },
    {
        name: "Eco",
        vibe: "Nature",
        color: "#16A34A", // Green-600
        shape: "leaf-grid"
    }
];

export default function HeroAnimation() {
    const [index, setIndex] = useState(0);

    // Cycle every 4 seconds
    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % DEMOS.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const brand = DEMOS[index];

    return (
        <div className="relative w-full max-w-lg aspect-square bg-white rounded-2xl border border-stone-200 shadow-2xl flex flex-col overflow-hidden">

            {/* A. HEADER (Browser Chrome) - Keeps it grounded */}
            <div className="h-10 border-b border-stone-100 flex items-center px-4 gap-2 bg-stone-50/50">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400/20" />
                    <div className="w-3 h-3 rounded-full bg-amber-400/20" />
                    <div className="w-3 h-3 rounded-full bg-green-400/20" />
                </div>
                <div className="ml-4 px-3 py-1 bg-white rounded text-[10px] font-mono text-stone-400 border border-stone-100 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Generating {brand.vibe}...
                </div>
            </div>

            {/* B. THE CANVAS (Grid Background) */}
            <div className="flex-1 relative flex items-center justify-center bg-stone-50/30">

                {/* Background Grid */}
                <div className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* C. THE ANIMATED LOGO CARD */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index} // Key change triggers animation
                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="relative bg-white p-8 rounded-3xl shadow-xl border border-stone-100 flex flex-col items-center gap-6 w-64"
                    >

                        {/* 1. THE LOGO MARK (Constructing) */}
                        <div
                            className="w-32 h-32 rounded-2xl flex flex-wrap overflow-hidden relative"
                            style={{ backgroundColor: brand.color }}
                        >
                            {/* Internal Grid Animation (The "NOX" Effect) */}
                            {/* Simulating 4 blocks snapping in */}
                            {[0, 1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 + 0.3, type: "spring" }}
                                    className="w-1/2 h-1/2 bg-white/20 border border-white/10"
                                    style={{
                                        borderRadius: i === 0 ? '1rem 0 0 0' : i === 3 ? '0 0 1rem 0' : '0'
                                    }}
                                />
                            ))}
                        </div>

                        {/* 2. THE TYPOGRAPHY (Typing Effect) */}
                        <div className="text-center">
                            <motion.h3
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="text-2xl font-bold text-stone-900 tracking-tight"
                            >
                                {brand.name}
                            </motion.h3>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.7 }}
                                className="text-xs font-mono text-stone-400 uppercase tracking-widest mt-1"
                            >
                                {brand.vibe} IDENTITY
                            </motion.p>
                        </div>

                    </motion.div>
                </AnimatePresence>

            </div>
        </div>
    );
}
