"use client";

import { motion, useAnimation } from "framer-motion";
import { Terminal, Grid3x3, PackageCheck, Check } from "lucide-react";
import { useEffect, useState } from "react";

export function ProcessPipeline() {
    const [activeStep, setActiveStep] = useState(0);

    // Animation cycle
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % 3);
        }, 2500); // 2.5s per step cycle
        return () => clearInterval(interval);
    }, []);

    const steps = [
        {
            id: "input",
            icon: Terminal,
            title: "Input Your Vibe",
            desc: "Describe your product and audience. Glyph translates your words into design constraints.",
            // Custom visual for step 1
            visual: (isActive: boolean) => (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-mono text-[10px] text-[#F97316] bg-black/80 px-2 py-1 rounded"
                        >
                            <Typewriter text='{ name: "Glyph" }' />
                        </motion.div>
                    )}
                </div>
            )
        },
        {
            id: "construct",
            icon: Grid3x3,
            title: "Generate the System",
            desc: "The engine constructs logos, palettes, and typography rules on a mathematical grid.",
            visual: (isActive: boolean) => (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {isActive && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.2, scale: 1.2 }}
                            className="w-full h-full"
                            style={{ backgroundImage: 'radial-gradient(#F97316 1px, transparent 1px)', backgroundSize: '8px 8px' }}
                        />
                    )}
                </div>
            )
        },
        {
            id: "export",
            icon: PackageCheck,
            title: "Export to Production",
            desc: "Download your brand as a React codebase with Tailwind config and vector assets.",
            visual: (isActive: boolean) => (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {isActive && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            className="text-[#F97316]"
                        >
                            <Check className="w-8 h-8 font-bold" strokeWidth={4} />
                        </motion.div>
                    )}
                </div>
            )
        },
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white border-b border-stone-200 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mb-16 md:text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-950 mb-4">
                        From Idea to Codebase in 3 Steps.
                    </h2>
                    <p className="text-lg text-stone-600">
                        Stop tweaking pixels. Describe your startup, and let the engine build the rest.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 z-0">
                        {/* Base Line */}
                        <div className="absolute inset-0 bg-stone-200" />

                        {/* The Beam */}
                        <motion.div
                            className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-transparent via-[#F97316] to-transparent"
                            animate={{
                                left: ["0%", "100%"],
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: 2.5, // Sync with step cycle
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        {steps.map((step, idx) => {
                            const isActive = activeStep === idx;

                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.2, duration: 0.5 }}
                                    className="flex flex-col items-center text-center bg-white group"
                                >
                                    <motion.div
                                        animate={isActive ? {
                                            scale: [1, 1.1, 1],
                                            borderColor: ["#e7e5e4", "#F97316", "#e7e5e4"],
                                            boxShadow: ["0 0 0px rgba(0,0,0,0)", "0 0 20px rgba(249, 115, 22, 0.3)", "0 0 0px rgba(0,0,0,0)"]
                                        } : {}}
                                        transition={{ duration: 0.5 }}
                                        className="relative w-24 h-24 bg-stone-950 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-stone-200 ring-4 ring-white border-2 border-stone-200 z-10"
                                    >
                                        {/* Base Icon */}
                                        <step.icon className={`w-10 h-10 transition-colors duration-300 ${isActive ? 'text-[#F97316]' : 'text-white'}`} />

                                        {/* Step Custom Visual Overlay */}
                                        {step.visual(isActive)}

                                    </motion.div>

                                    <h3 className="text-xl font-bold text-stone-950 mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-stone-600 leading-relaxed max-w-xs">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}

function Typewriter({ text }: { text: string }) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        let i = 0;
        setDisplayed("");
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayed((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, [text]);

    return <span>{displayed}<span className="animate-pulse">|</span></span>;
}
