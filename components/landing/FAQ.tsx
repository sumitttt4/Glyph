"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const FAQS = [
    {
        question: "What makes Glyph different?",
        answer: "Glyph isn't a template picker. It's a parametric design engine that generates complete brand systems — logo, colors, typography, and production-ready code. Every output follows real design principles."
    },
    {
        question: "Can I use this commercially?",
        answer: "Yes. The Founder Pass grants full commercial rights. Use it for your startup, client work, or resale. No attribution required."
    },
    {
        question: "What do I get with the export?",
        answer: "SVG vectors, PNG assets, Tailwind CSS config, and JSON design tokens. Everything you need to start building immediately."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-16 md:py-24 bg-white border-t border-stone-200">
            <div className="max-w-3xl mx-auto px-4 md:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center mb-10 md:mb-16">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-3 md:space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-stone-200 rounded-xl md:rounded-2xl overflow-hidden bg-stone-50 transition-colors hover:border-stone-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-4 md:p-6 text-left"
                            >
                                <span className="font-bold text-base md:text-lg text-stone-900 pr-4 md:pr-8">
                                    {faq.question}
                                </span>
                                <span className={`transition-transform duration-300 shrink-0 ${openIndex === idx ? 'rotate-45' : 'rotate-0'}`}>
                                    <Plus className="w-5 h-5 md:w-6 md:h-6 text-stone-400" />
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 pt-0 text-stone-600 leading-relaxed">
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
