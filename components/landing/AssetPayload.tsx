"use client";

import { motion } from "framer-motion";

export function AssetPayload() {
    return (
        <section className="py-24 bg-white overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-stone-950 mb-6">
                        Everything you need <br /> to launch.
                    </h2>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        A complete, generated design system. Not just a logo, but a comprehensive brand book ready for handoff.
                    </p>
                </div>

                {/* High Fidelity Brand Guidelines Grid - Infinite Canvas Feel */}
                <div className="relative w-full bg-[#050505] rounded-3xl p-8 md:p-12 border border-stone-800 shadow-2xl overflow-hidden min-h-[800px] flex flex-col">
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />

                    {/* Header mockup */}
                    <div className="flex items-center justify-between mb-8 opacity-60 px-2">
                        <div className="text-xs text-stone-400 font-mono tracking-widest uppercase">Glyph / Identity_System_v1.0</div>
                        <div className="flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-stone-500"></div>
                            <div className="w-2 h-2 rounded-full bg-stone-500"></div>
                        </div>
                    </div>

                    {/* The Dense Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '800px' }}>

                        {/* 1. COVER */}
                        <Slide className="bg-[#FF4500] text-[#1a1a1a]">
                            <div className="h-full flex flex-col justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-2">
                                    <DotGrid className="text-[#1a1a1a] opacity-20" />
                                </div>
                                <div className="absolute bottom-0 right-0 p-2 transform rotate-180">
                                    <DotGrid className="text-[#1a1a1a] opacity-20" />
                                </div>
                                <div className="text-[6px] uppercase tracking-widest font-bold opacity-60">Cover</div>
                                <h3 className="text-2xl font-serif leading-[0.9] tracking-tight">Brand<br />Guidelines</h3>
                                <div className="text-[5px] opacity-60">Identity System 2024</div>
                            </div>
                        </Slide>

                        {/* 2. TABLE OF CONTENTS */}
                        <Slide className="bg-[#EADBC8] text-[#1a1a1a]">
                            <div className="h-full flex flex-col">
                                <h4 className="font-serif text-lg mb-4 border-b border-[#1a1a1a]/10 pb-1">Table of Contents</h4>
                                <div className="space-y-1 text-[7px] font-mono opacity-80 flex-1">
                                    <div className="flex justify-between"><span>Logo</span><span>02</span></div>
                                    <div className="flex justify-between"><span>Typography</span><span>07</span></div>
                                    <div className="flex justify-between"><span>Color Palette</span><span>11</span></div>
                                    <div className="flex justify-between"><span>Elements</span><span>14</span></div>
                                    <div className="flex justify-between"><span>Application</span><span>18</span></div>
                                </div>
                            </div>
                        </Slide>

                        {/* 3. LOGO COVER */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex flex-col justify-center">
                                <h4 className="text-lg font-serif text-[#FF4500] mb-1 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-[#FF4500] rounded-full"></div>
                                    Logo
                                </h4>
                                <div className="space-y-0.5 text-[#1a1a1a]/20 text-lg font-serif leading-none">
                                    <div>Typography</div>
                                    <div>Color Palette</div>
                                    <div>Brand Elements</div>
                                    <div>Application</div>
                                </div>
                            </div>
                        </Slide>

                        {/* 4. LOGO HORIZONTAL */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex items-center justify-center">
                                <div className="flex items-center gap-1.5">
                                    <GlyphLogo className="w-5 h-5 fill-[#1a1a1a]" />
                                    <span className="text-sm font-bold tracking-tight">Glyph</span>
                                </div>
                            </div>
                        </Slide>

                        {/* 5. LOGO CLEARSPACE */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex items-center justify-center relative">
                                <div className="absolute top-2 left-2 text-[5px] uppercase opacity-40">Logo Clearspace</div>
                                <div className="border border-dashed border-[#FF4500]/50 p-3 flex items-center gap-1.5">
                                    <GlyphLogo className="w-4 h-4 fill-[#1a1a1a]" />
                                    <span className="text-xs font-bold tracking-tight">Glyph</span>
                                </div>
                            </div>
                        </Slide>

                        {/* 6. ICON DESIGN TEXT */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full p-2 flex flex-col justify-between">
                                <div className="text-[5px] uppercase opacity-40">Icon Design</div>

                                <div className="relative border border-dashed border-[#1a1a1a]/20 aspect-square w-12 self-center flex items-center justify-center">
                                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                                        {[...Array(16)].map((_, i) => (
                                            <div key={i} className="border-[0.5px] border-[#1a1a1a]/5"></div>
                                        ))}
                                    </div>
                                    <GlyphLogo className="w-8 h-8 fill-none stroke-[#FF4500] stroke-[0.5]" />
                                </div>

                                <p className="text-[5px] leading-relaxed opacity-60">
                                    Geometric construction on 4x4 grid.
                                </p>
                            </div>
                        </Slide>

                        {/* 7. ICON DESIGN VISUAL */}
                        <Slide className="bg-[#FF4500] text-white">
                            <div className="h-full flex items-center justify-center">
                                <GlyphLogo className="w-16 h-16 fill-white" />
                            </div>
                        </Slide>

                        {/* 8. LOGO USAGE */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full grid grid-cols-2 gap-2">
                                <div className="bg-white flex items-center justify-center">
                                    <GlyphLogo className="w-6 h-6 fill-[#1a1a1a]" />
                                </div>
                                <div className="bg-[#1a1a1a] flex items-center justify-center">
                                    <GlyphLogo className="w-6 h-6 fill-white" />
                                </div>
                            </div>
                        </Slide>

                        {/* 9. TYPOGRAPHY COVER */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex flex-col justify-center">
                                <div className="text-[#1a1a1a]/20 text-lg font-serif leading-none mb-1">Logo</div>
                                <h4 className="text-lg font-serif text-[#FF4500] mb-1 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-[#FF4500] rounded-full"></div>
                                    Typography
                                </h4>
                                <div className="space-y-0.5 text-[#1a1a1a]/20 text-lg font-serif leading-none">
                                    <div>Color Palette</div>
                                    <div>Brand Elements</div>
                                    <div>Application</div>
                                </div>
                            </div>
                        </Slide>

                        {/* 10. TYPOGRAPHY USAGE */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex flex-col p-2">
                                <div className="text-[5px] uppercase opacity-40 mb-3">Typography Usage</div>
                                <div className="font-serif text-xl leading-[0.9] mb-4">
                                    Supporting the<br />world's best<br />entrepreneurs.
                                </div>
                                <div className="w-8 h-2 bg-[#FF4500] rounded-full"></div>
                            </div>
                        </Slide>

                        {/* 11. PRIMARY TYPEFACE */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex flex-col">
                                <div className="text-[5px] uppercase opacity-40 border-b border-[#1a1a1a]/10 pb-1 mb-2">Primary Typeface</div>
                                <div className="font-serif text-[8px] mb-2">STK Bureau Serif Book</div>
                                <div className="text-3xl font-serif mb-2">AaBbCc</div>
                                <div className="text-[6px] opacity-60 leading-tight">
                                    AaBbCcDdEeFfGgHhIiJjKk<br />LlMmNnOoPpQqRrSsTtUu<br />VvWwXxYyZz0123456789
                                </div>
                            </div>
                        </Slide>

                        {/* 12. SUPPORTING TYPEFACE */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex flex-col">
                                <div className="text-[5px] uppercase opacity-40 border-b border-[#1a1a1a]/10 pb-1 mb-2">Supporting Typeface</div>
                                <div className="font-sans text-[8px] mb-2">STK Bureau Sans Book</div>
                                <div className="text-3xl font-sans font-medium mb-2">AaBbCc</div>
                                <div className="text-[6px] opacity-60 leading-tight font-sans">
                                    AaBbCcDdEeFfGgHhIiJjKk<br />LlMmNnOoPpQqRrSsTtUu<br />VvWwXxYyZz0123456789
                                </div>
                            </div>
                        </Slide>

                        {/* 13. COLOR PALETTE COVER */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex flex-col justify-center">
                                <div className="text-[#1a1a1a]/20 text-lg font-serif leading-none mb-1">Logo</div>
                                <div className="text-[#1a1a1a]/20 text-lg font-serif leading-none mb-1">Typography</div>
                                <h4 className="text-lg font-serif text-[#FF4500] mb-1 flex items-center gap-1">
                                    <div className="w-1 h-1 bg-[#FF4500] rounded-full"></div>
                                    Color Palette
                                </h4>
                                <div className="space-y-0.5 text-[#1a1a1a]/20 text-lg font-serif leading-none">
                                    <div>Brand Elements</div>
                                    <div>Application</div>
                                </div>
                            </div>
                        </Slide>

                        {/* 14. COLOR SWATCHES */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full grid grid-cols-3 grid-rows-2">
                                <div className="bg-[#2D2A26] p-1 flex items-end"><span className="text-[4px] text-white">Brown</span></div>
                                <div className="bg-[#FF4500] col-span-2 row-span-2 p-1 flex items-start"><span className="text-[4px] text-white">Red - Primary</span></div>
                                <div className="bg-[#C8B098] p-1 flex items-end"><span className="text-[4px] text-[#2D2A26]">Tan</span></div>
                            </div>
                        </Slide>

                        {/* 15. COLOR PAIRINGS */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex items-center justify-center">
                                <div className="grid grid-cols-3 gap-1 p-2">
                                    <div className="w-4 h-4 bg-[#F5F2EF] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#1a1a1a]"></div></div>
                                    <div className="w-4 h-4 bg-[#F5F2EF] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#FF4500]"></div></div>
                                    <div className="w-4 h-4 bg-[#C8B098] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#1a1a1a]"></div></div>
                                    <div className="w-4 h-4 bg-[#FF4500] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#F5F2EF]"></div></div>
                                    <div className="w-4 h-4 bg-[#FF4500] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#1a1a1a]"></div></div>
                                    <div className="w-4 h-4 bg-[#2D2A26] flex items-center justify-center"><div className="w-1.5 h-1.5 bg-[#F5F2EF]"></div></div>
                                </div>
                            </div>
                        </Slide>

                        {/* 16. DOT PATTERN */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex flex-col p-2">
                                <div className="text-[5px] uppercase opacity-40 mb-2">Dot Pattern</div>
                                <div className="flex-1 border border-dashed border-[#1a1a1a]/20 p-2 relative">
                                    <DotGrid className="text-[#1a1a1a]" />
                                </div>
                            </div>
                        </Slide>

                        {/* 17. IMAGERY */}
                        <Slide className="bg-[#C8B098] text-[#1a1a1a]">
                            <div className="h-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-[#1a1a1a] opacity-10 mix-blend-multiply"></div>
                                <div className="absolute top-0 right-0 p-4">
                                    <DotGrid className="text-[#1a1a1a] opacity-40 scale-150" />
                                </div>
                                <div className="absolute bottom-2 left-2 text-[5px] uppercase tracking-widest font-bold">Art Direction</div>
                            </div>
                        </Slide>

                        {/* 18. STATIONERY */}
                        <Slide className="bg-[#F5F2EF] text-[#1a1a1a]">
                            <div className="h-full flex items-center justify-center">
                                <div className="w-16 h-10 bg-white shadow-sm border border-stone-100 p-2 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <GlyphLogo className="w-3 h-3 fill-[#1a1a1a]" />
                                    </div>
                                    <div className="h-0.5 w-8 bg-[#1a1a1a]/10"></div>
                                </div>
                            </div>
                        </Slide>

                        {/* 19. DIGITAL */}
                        <Slide className="bg-[#2D2A26] text-white">
                            <div className="h-full flex items-center justify-center">
                                <div className="w-10 h-16 bg-[#F5F2EF] rounded p-1.5 flex flex-col items-center">
                                    <div className="w-full aspect-square bg-[#FF4500] mb-1.5 rounded-sm flex items-center justify-center">
                                        <GlyphLogo className="w-3 h-3 fill-white" />
                                    </div>
                                    <div className="w-full h-0.5 bg-[#2D2A26]/10 mb-0.5 rounded-full"></div>
                                    <div className="w-2/3 h-0.5 bg-[#2D2A26]/10 rounded-full self-start"></div>
                                </div>
                            </div>
                        </Slide>

                        {/* 20. END COVER */}
                        <Slide className="bg-[#1a1a1a] text-white">
                            <div className="h-full flex items-center justify-center">
                                <div className="text-center flex flex-col items-center">
                                    <GlyphLogo className="w-6 h-6 fill-white mb-2" />
                                    <div className="text-[5px] uppercase tracking-widest opacity-60">Thank You</div>
                                </div>
                            </div>
                        </Slide>

                    </div>
                </div>
            </div>
        </section>
    );
}

function Slide({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`aspect-[16/9] w-full rounded-sm p-3 md:p-4 text-[10px] md:text-sm overflow-hidden shadow-sm hover:scale-[1.02] transition-transform duration-300 ${className}`}>
            {children}
        </div>
    );
}

function DotGrid({ className }: { className?: string }) {
    return (
        <svg className={`w-8 h-8 ${className}`} viewBox="0 0 40 40" fill="currentColor">
            {[...Array(16)].map((_, i) => (
                <circle key={i} cx={(i % 4) * 10 + 5} cy={Math.floor(i / 4) * 10 + 5} r="2" />
            ))}
        </svg>
    )
}

function GlyphLogo({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" className={className}>
            <path d="M12 2L2 12h5v10h10v-5l5-5H12z M7 12l5-5 5 5-5 5-5-5z" />
        </svg>
    );
}
