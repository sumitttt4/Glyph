"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
    {
        question: "Do I own the copyright?",
        answer: "Yes. You own 100% of the intellectual property. The Founder Pass grants full commercial rights for your startup, client work, or resale. No attribution required."
    },
    {
        question: "Is this an AI wrapper?",
        answer: "No. Glyph is a geometric construction engine. We use parametric design algorithms to build logos on strict grids, ensuring every output is mathematically balanced, not hallucinated."
    },
    {
        question: "Can I export code?",
        answer: "Yes. You get a production-ready React codebase with a fully configured Tailwind CSS theme file (tokens.ts), plus the raw SVG and PNG assets."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 bg-white border-t border-stone-200">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-950">
                        The Defense
                    </h2>
                    <p className="mt-4 text-stone-600">Common questions from engineers.</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className="group border border-stone-950 rounded-lg overflow-hidden bg-white hover:bg-stone-50 transition-colors"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-lg text-stone-950 pr-8">
                                    {faq.question}
                                </span>
                                <span className="shrink-0 text-stone-950">
                                    {openIndex === idx ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-stone-600 leading-relaxed max-w-2xl">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
