"use client";

import {
    Tick02Icon,
    Cancel01Icon,
    SparklesIcon,
    SecurityCheckIcon,
    FlashIcon,
    PlusSignIcon,
    MinusSignIcon,
    UserGroupIcon
} from "hugeicons-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// FAQ Data - Updated with new questions
const FAQ_DATA = [
    {
        question: "What's included in the asset package?",
        answer: "You get high-res PNG exports (1000px, 2000px, 4000px), vector SVG, color palette in multiple formats, Tailwind CSS configuration, and React component code. Everything you need to implement your brand immediately."
    },
    {
        question: "Can I use this commercially?",
        answer: "Yes. The Founder Pass includes full commercial ownership. Use it for your startup, client projects, products - whatever you need. No attribution required."
    },
    {
        question: "What if I don't like what I generate?",
        answer: "You get 3 free generations to test the quality before buying. With the Founder Pass, you have unlimited generations - so you can keep creating until you find the perfect mark. Most users find something they love in the first 5-10 tries."
    },
    {
        question: "Is this a subscription?",
        answer: "No. It's a one-time payment for lifetime access. Pay once, generate forever. No recurring charges."
    },
    {
        question: "Will the price increase?",
        answer: "Yes. Current price is $29 for early adopters. The regular price is $99. Lock in the early access rate now."
    }
];

// FAQ Accordion Item - Matching the original FAQ style
function FAQItem({ question, answer, isOpen, onToggle }: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
}) {
    return (
        <div className="group border border-stone-950 rounded-lg overflow-hidden bg-white hover:bg-stone-50 transition-colors">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-6 text-left"
                aria-expanded={isOpen}
            >
                <span className="font-bold text-lg text-stone-950 pr-8">
                    {question}
                </span>
                <span className="shrink-0 text-stone-950">
                    {isOpen ? <MinusSignIcon size={20} /> : <PlusSignIcon size={20} />}
                </span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-6 pb-6 pt-0 text-stone-600 leading-relaxed max-w-2xl">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Pricing() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="pricing" className="py-20 md:py-32 px-4 md:px-6 bg-stone-50 border-t border-stone-200" aria-labelledby="pricing-heading">
            <div className="max-w-5xl mx-auto">

                {/* Section Header */}
                <header className="text-center mb-12 md:mb-16">
                    <p className="text-xs font-mono uppercase tracking-widest text-stone-400 mb-3">Pricing</p>
                    <h2 id="pricing-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-stone-950 tracking-tight mb-4">
                        Simple, Transparent Pricing.
                    </h2>
                    <p className="text-stone-500 text-base md:text-lg max-w-xl mx-auto mb-4">
                        Build for free. Pay only when you&apos;re ready to ship.
                    </p>
                    {/* Social Proof */}
                    <p className="text-stone-400 text-sm flex items-center justify-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-white border border-stone-200 rounded-full shadow-sm">
                            <UserGroupIcon size={14} className="text-green-600" />
                            <span className="font-medium text-stone-600">Over 200 unique brands generated</span>
                        </span>
                    </p>
                </header>

                {/* PRICING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">

                    {/* ==================== TIER 1: EXPLORER (FREE) ==================== */}
                    <article className="relative group h-full" aria-labelledby="explorer-heading">
                        <div className="absolute -inset-0.5 bg-gradient-to-b from-stone-200 to-stone-300 rounded-2xl opacity-50"></div>
                        <div className="relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-lg h-full flex flex-col">

                            {/* EXPLORER HEADER */}
                            <div className="bg-gradient-to-br from-stone-100 to-stone-50 p-6 md:p-8 border-b border-stone-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 id="explorer-heading" className="font-bold text-xl tracking-wide uppercase text-stone-800">Explorer</h3>
                                        <p className="text-stone-400 text-xs font-mono mt-1">FOREVER FREE</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-4xl font-bold text-stone-950">$0</span>
                                        <span className="text-stone-400 text-xs">no credit card</span>
                                    </div>
                                </div>
                                <p className="text-stone-600 text-sm mt-4 font-medium italic">
                                    Explore possibilities. Find your perfect mark.
                                </p>
                            </div>

                            {/* EXPLORER BODY */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <ul className="space-y-3.5 mb-8 flex-1" role="list" aria-label="Explorer plan features">
                                    {/* INCLUDED */}
                                    <FeatureItem included>3 AI Generations</FeatureItem>
                                    <FeatureItem included>Live Preview & Mockups</FeatureItem>
                                    <FeatureItem included>Low-Res PNG Export (500×500px)</FeatureItem>

                                    {/* NOT INCLUDED */}
                                    <FeatureItem>SVG Vector Export</FeatureItem>
                                    <FeatureItem>Figma Design System Export</FeatureItem>
                                    <FeatureItem>Tailwind CSS Config</FeatureItem>
                                    <FeatureItem>React Component Code</FeatureItem>
                                    <FeatureItem>Commercial License</FeatureItem>
                                    <FeatureItem>Generation History</FeatureItem>
                                </ul>

                                <Link
                                    href="/generator"
                                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 border border-stone-200 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-400 focus:ring-offset-2"
                                    aria-label="Start exploring with free plan"
                                >
                                    Start Exploring
                                </Link>
                                <p className="text-stone-400 text-xs text-center mt-4 leading-relaxed">
                                    Perfect for testing ideas. See what&apos;s possible before you commit.
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* ==================== TIER 2: FOUNDER PASS (PAID) ==================== */}
                    <article className="relative group h-full" aria-labelledby="founder-heading">
                        {/* Glow Effect behind the card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#FF4500] via-[#FF6332] to-[#FF4500] rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition duration-500"></div>

                        <div className="relative bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col">

                            {/* BEST VALUE Badge */}
                            <div className="absolute top-0 right-0 z-20">
                                <div className="bg-gradient-to-r from-[#FF4500] to-[#FF6332] text-[10px] font-bold px-3 py-1.5 rounded-bl-xl text-white uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                                    <FlashIcon size={12} className="text-white" />
                                    Best Value
                                </div>
                            </div>

                            {/* FOUNDER PASS HEADER (Dark Mode) */}
                            <div className="bg-[#0C0A09] p-6 md:p-8 text-white border-b border-stone-800 relative overflow-hidden">
                                {/* Decorative pattern */}
                                <div className="absolute inset-0 opacity-5"
                                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)' }}>
                                </div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div className="pr-16">
                                            <h3 id="founder-heading" className="font-bold text-xl tracking-wide uppercase">Founder Pass</h3>
                                            <p className="text-stone-400 text-xs font-mono mt-1">EARLY ACCESS LICENSE</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-baseline gap-2 justify-end">
                                                <span className="text-stone-500 text-lg line-through decoration-[#FF4500]/70">$99</span>
                                                <span className="text-4xl font-bold text-[#FF4500]">$29</span>
                                            </div>
                                            <span className="text-stone-400 text-xs">one-time payment</span>
                                        </div>
                                    </div>
                                    <p className="text-stone-300 text-sm mt-4 font-medium italic">
                                        Own your brand completely. Ship it, sell it, build on it.
                                    </p>
                                </div>
                            </div>

                            {/* FOUNDER PASS BODY */}
                            <div className="p-6 md:p-8 flex-1 flex flex-col">
                                <ul className="space-y-3 mb-8 flex-1" role="list" aria-label="Founder Pass features">
                                    {[
                                        "Unlimited AI Generations",
                                        "Full Commercial Ownership",
                                        "High-Res PNG Pack (up to 4000px)",
                                        "Vector SVG Export",
                                        "Tailwind CSS Config",
                                        "React Component Code",
                                        "Color Palette (Hex, RGB, HSL)",
                                        "Generation History",
                                        "Priority Support",
                                        "Figma Design System Export",
                                        "Lifetime Updates",
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-stone-700">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <Tick02Icon size={12} className="text-green-600" strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                    {/* Try Before You Buy - replaces money-back guarantee */}
                                    <li className="flex items-center gap-3 text-stone-700">
                                        <div className="w-5 h-5 rounded-full bg-[#FF4500]/10 flex items-center justify-center shrink-0">
                                            <FlashIcon size={12} className="text-[#FF4500]" strokeWidth={2.5} />
                                        </div>
                                        <span className="text-sm font-medium">Try 3 Free Before You Buy</span>
                                    </li>
                                </ul>

                                <a
                                    href="https://checkout.dodopayments.com/buy/pdt_0NVXcrRSqLnWomnnrEIla?quantity=1&redirect_url=https://glyph.software"
                                    className="w-full bg-gradient-to-r from-[#FF4500] to-[#FF6332] hover:from-[#E63E00] hover:to-[#E55A2B] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-[#FF4500]/30 active:scale-[0.98] flex items-center justify-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-offset-2"
                                    aria-label="Get lifetime access to Founder Pass"
                                >
                                    <SparklesIcon size={16} />
                                    Get Lifetime Access
                                </a>
                                <p className="text-stone-400 text-xs text-center mt-4 leading-relaxed">
                                    Early access pricing. Lock in lifetime access before we raise the price.
                                </p>
                            </div>

                            {/* THE "TEAR-OFF" STUB VISUAL (Bottom) */}
                            <div className="h-3 bg-stone-50 border-t border-dashed border-stone-300 relative">
                                <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-stone-50 border border-stone-200"></div>
                                <div className="absolute -right-1.5 -top-1.5 w-3 h-3 rounded-full bg-stone-50 border border-stone-200"></div>
                            </div>
                        </div>
                    </article>

                </div>

                {/* Trust Badges - Updated without money-back */}
                <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-stone-400 text-xs">
                    <div className="flex items-center gap-2">
                        <SecurityCheckIcon size={16} />
                        <span>Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Tick02Icon size={16} />
                        <span>Instant Access</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <SparklesIcon size={16} />
                        <span>No Subscription</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FlashIcon size={16} />
                        <span>Try Free First</span>
                    </div>
                </div>

                {/* ==================== FAQ SECTION - Matching Original Style ==================== */}
                <section id="faq" className="mt-24 md:mt-32">
                    <header className="text-center mb-12">
                        <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-950">
                            Frequently Asked Questions
                        </h3>
                        <p className="mt-4 text-stone-600">Common questions from engineers.</p>
                    </header>

                    <div className="max-w-3xl mx-auto space-y-4">
                        {FAQ_DATA.map((faq, idx) => (
                            <FAQItem
                                key={idx}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === idx}
                                onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}
                            />
                        ))}
                    </div>
                </section>

            </div>
        </section>
    );
}

// Reusable Feature Item Component
function FeatureItem({ children, included = false }: { children: React.ReactNode; included?: boolean }) {
    if (included) {
        return (
            <li className="flex items-center gap-3 text-stone-700">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <Tick02Icon size={12} className="text-green-600" strokeWidth={3} />
                </div>
                <span className="text-sm font-medium">{children}</span>
            </li>
        );
    }

    return (
        <li className="flex items-center gap-3 text-stone-400">
            <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <Cancel01Icon size={12} className="text-stone-400" strokeWidth={2.5} />
            </div>
            <span className="text-sm line-through">{children}</span>
        </li>
    );
}
