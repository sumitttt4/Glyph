"use client";

import { motion } from "framer-motion";

export function TokenEngine() {
    return (
        <section className="hidden lg:block py-24 bg-white relative overflow-hidden">
            {/* Optional subtle dot pattern */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left: Copy */}
                    <div className="max-w-xl">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-950 mb-6 leading-tight">
                            Colors that pass <br className="hidden md:block" />
                            <span className="text-stone-950 underline decoration-[#FF4500] underline-offset-4">code review</span>.
                        </h2>
                        <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                            Glyph generates accessible, semantic color palettes that scale automatically for light and dark modes. No more guessing if your text is readable.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center border border-stone-200 font-mono text-xs font-bold text-stone-950">Aa</div>
                                <div>
                                    <div className="font-bold text-stone-950">Accessibility Built-In</div>
                                    <div className="text-sm text-stone-500">Auto-checked contrast ratios so you never fail an audit.</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center border border-stone-200 font-mono text-xs font-bold text-stone-950">{ }</div>
                                <div>
                                    <div className="font-bold text-stone-950">Ready for Dark Mode</div>
                                    <div className="text-sm text-stone-500">Primary, surface, and border tokens mapped automatically.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Code Window */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="rounded-xl overflow-hidden shadow-2xl bg-[#0C0A09] ring-1 ring-stone-900/10"
                    >
                        {/* Window Controls */}
                        <div className="flex items-center gap-2 px-4 py-3 bg-[#1c1917] border-b border-stone-800">
                            <div className="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27C93F]"></div>
                            <div className="ml-4 text-xs font-mono text-stone-500">tailwind.config.ts</div>
                        </div>

                        {/* Code Content */}
                        <div className="p-6 font-mono text-sm overflow-x-auto">
                            <pre className="leading-relaxed">
                                <code className="text-stone-300">
                                    <span className="text-[#FF79C6]">const</span> config: <span className="text-[#8BE9FD]">Config</span> = {'{'}{'\n'}
                                    {'  '}theme: {'{'}{'\n'}
                                    {'    '}extend: {'{'}{'\n'}
                                    {'      '}colors: {'{'}{'\n'}
                                    {'        '}brand: {'{'}{'\n'}
                                    {'          '}50: <span className="text-[#F1FA8C]">'#fafaf9'</span>,{'\n'}
                                    {'          '}100: <span className="text-[#F1FA8C]">'#f5f5f4'</span>,{'\n'}
                                    {'          '}500: <span className="text-[#F1FA8C]">'#78716c'</span>, <span className="text-stone-500">// Primary</span>{'\n'}
                                    {'          '}900: <span className="text-[#F1FA8C]">'#0c0a09'</span>,{'\n'}
                                    {'        '}{'}'},{'\n'}
                                    {'        '}accent: <span className="text-[#F1FA8C]">'#FF4500'</span>,{'\n'}
                                    {'      '}{'}'},{'\n'}
                                    {'      '}fontFamily: {'{'}{'\n'}
                                    {'        '}sans: [<span className="text-[#F1FA8C]">'Inter'</span>, ...],{'\n'}
                                    {'      '}{'}'}{'\n'}
                                    {'    '}{'}'}{'\n'}
                                    {'  '}{'}'}{'\n'}
                                    {'}'};
                                </code>
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
