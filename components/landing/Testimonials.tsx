"use client";

import { Star } from "lucide-react";

const TESTIMONIALS = [
    {
        text: "I fired my designer after using this. The geometry engine is precise enough for my engineering standards.",
        author: "Alex C.",
        role: "Founder, Zenith",
        stars: 5,
    },
    {
        text: "Finally, a design tool that understands semantic tokens. The export is clean, type-safe React code.",
        author: "Sarah J.",
        role: "CTO, Layer5",
        stars: 5,
    },
    {
        text: "The consistent 3D mockups sold my investors. It looked like we had a brand team of ten.",
        author: "Marcus Ray",
        role: "SaaS Founder",
        stars: 5,
    },
    {
        text: "Glyph generated a better color palette in 3 seconds than I did in 3 weeks of messing with Figma.",
        author: "Elena T.",
        role: "Indie Hacker",
        stars: 5,
    },
    {
        text: "No hallucinations. Just math. This is how brand design should work for technical founders.",
        author: "David K.",
        role: "YC W24",
        stars: 5,
    },
    {
        text: "The Tailwind config export saved me at least 2 days of setup. Worth every penny of the $19.",
        author: "Priya M.",
        role: "Dev",
        stars: 5,
    },
];

export function Testimonials() {
    return (
        <section className="py-24 bg-white border-b border-stone-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="mb-16 md:text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-950">
                        Engineered Social Proof
                    </h2>
                    <p className="mt-4 text-stone-600">
                        Trusted by founders who prefer logic over fluff.
                    </p>
                </div>

                {/* MOBILE: Horizontal Scroll Snap */}
                <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-6 px-6 scrollbar-hide">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="snap-center shrink-0 w-[85vw] bg-stone-50 border border-stone-200 p-6 rounded-2xl"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, si) => (
                                    <Star
                                        key={si}
                                        className="w-4 h-4 text-[#FF4500] fill-[#FF4500]"
                                    />
                                ))}
                            </div>
                            <p className="text-stone-900 font-medium leading-relaxed mb-6">
                                "{t.text}"
                            </p>
                            <div className="border-t border-stone-200 pt-4">
                                <div className="font-bold text-stone-950">{t.author}</div>
                                <div className="text-xs font-mono uppercase text-stone-500">
                                    {t.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* DESKTOP: Masonry Grid */}
                <div className="hidden md:grid grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div
                            key={i}
                            className="bg-stone-50 border border-stone-200 p-8 rounded-2xl hover:border-stone-900 transition-colors"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(t.stars)].map((_, si) => (
                                    <Star
                                        key={si}
                                        className="w-4 h-4 text-[#FF4500] fill-[#FF4500]"
                                    />
                                ))}
                            </div>
                            <p className="text-lg text-stone-900 font-medium leading-relaxed mb-6">
                                "{t.text}"
                            </p>
                            <div>
                                <div className="font-bold text-stone-950">{t.author}</div>
                                <div className="text-xs font-mono uppercase text-stone-500">
                                    {t.role}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
