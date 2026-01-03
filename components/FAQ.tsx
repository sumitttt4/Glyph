"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const FAQS = [
    {
        question: "Is this just another generic logo generator?",
        answer: "No. Most generators just paste an icon on a square. Glyph simulates the decision-making process of a human designer. We use parametric design rules to ensure your typography, spatial relationships, and color theory are agency-grade, not random."
    },
    {
        question: "Why pay $9 when I can do it myself?",
        answer: "You're not paying for the logo—you're buying time. A freelance designer takes 3-5 days and costs $500+. Glyph gives you a similar 'First Draft' quality in 30 seconds for the price of a coffee. It's the fastest way to get unblocked."
    },
    {
        question: "What exactly do I get with the Pro License?",
        answer: "You get the 'Source Keys' to your brand. This includes scalable SVGs (vectors) for print/web, high-res PNGs, and a dedicated Tailwind CSS configuration file to immediately start building your product."
    },
    {
        question: "What if I don't like the result?",
        answer: "You have full control. Before you pay, you can regenerate endlessly, tweak themes, swap fonts, and refine the vibe. You only pay when you're 100% happy with the system you see on screen."
    },
    {
        question: "Can I use this for client work?",
        answer: "Absolutely. The Pro License grants you full commercial rights. Many agencies use Glyph to rapid-prototype concepts for clients before refining them manually."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="py-24 bg-white border-t border-stone-200">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-center mb-16">
                    Frequently Asked Questions
                </h2>

                <div className="space-y-4">
                    {FAQS.map((faq, idx) => (
                        <div
                            key={idx}
                            className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 transition-colors hover:border-stone-300"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className="font-bold text-lg text-stone-900 pr-8">
                                    {faq.question}
                                </span>
                                <span className={`transition-transform duration-300 ${openIndex === idx ? 'rotate-45' : 'rotate-0'}`}>
                                    <Plus className="w-6 h-6 text-stone-400" />
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
