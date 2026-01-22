"use client";

import { Check, X } from "lucide-react";

export function ComparisonTable() {
    const features = [
        {
            name: "Time to Launch",
            agency: "4-8 Weeks",
            glyph: "30 Seconds",
            highlight: true
        },
        {
            name: "Cost",
            agency: "$500+",
            glyph: "$19",
            highlight: true
        },
        {
            name: "Copyright Ownership",
            agency: "Varies",
            glyph: "100% Yours",
        },
        {
            name: "Code Export",
            agency: "Manual Handoff",
            glyph: "React + Tailwind",
        },
        {
            name: "Design System",
            agency: "Extra Cost",
            glyph: "Included",
        },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-950">
                        The Anchor
                    </h2>
                    <p className="mt-4 text-stone-600">Why startups choose algorithms over agencies.</p>
                </div>

                {/* DESKTOP TABLE */}
                <div className="hidden md:block border border-stone-950 rounded-2xl overflow-hidden">
                    {/* Header */}
                    <div className="grid grid-cols-3 bg-stone-950 text-white p-6 md:p-8 items-center">
                        <div className="font-mono text-sm uppercase tracking-widest text-stone-400">Metric</div>
                        <div className="text-center font-bold text-stone-400">Traditional Agency</div>
                        <div className="text-center font-bold text-[#FF4500] text-xl">Glyph Engine</div>
                    </div>

                    {/* Rows */}
                    <div className="bg-white">
                        {features.map((feature, idx) => (
                            <div
                                key={idx}
                                className={`grid grid-cols-3 p-6 md:p-8 border-b border-stone-200 last:border-0 hover:bg-stone-50 transition-colors ${feature.highlight ? 'font-medium' : ''}`}
                            >
                                <div className="flex items-center text-stone-950 font-bold">
                                    {feature.name}
                                </div>
                                <div className="flex items-center justify-center text-stone-500">
                                    {feature.agency}
                                </div>
                                <div className="flex items-center justify-center text-stone-950 font-bold text-lg">
                                    {feature.glyph}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* MOBILE FEATURE LIST */}
                <div className="block md:hidden space-y-4">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white border border-stone-950 rounded-xl p-6 shadow-sm">
                            <div className="text-lg font-bold text-stone-950 mb-4 border-b border-stone-100 pb-2">
                                {feature.name}
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-stone-500">
                                    <div className="flex items-center gap-2">
                                        <X className="w-4 h-4 text-stone-400" />
                                        <span className="text-sm">Agency</span>
                                    </div>
                                    <span className="text-sm font-medium">{feature.agency}</span>
                                </div>

                                <div className="flex items-center justify-between text-stone-950 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Check className="w-4 h-4 text-[#FF4500]" />
                                        <span className="text-sm">Glyph</span>
                                    </div>
                                    <span className="text-lg text-[#FF4500] font-bold">{feature.glyph}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
