import { Check, X, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
    return (
        <section id="pricing" className="py-16 md:py-24 px-4 md:px-6 bg-stone-50 border-t border-stone-200">
            <div className="max-w-4xl mx-auto">

                <div className="text-center mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-stone-950 tracking-tight mb-2">Simple, Transparent Pricing.</h2>
                    <p className="text-stone-500 text-sm md:text-base">Build for free. Pay only when you&apos;re ready to ship.</p>
                </div>

                {/* PRICING GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">

                    {/* FREE TIER - The "Anchor" */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-stone-200 rounded-2xl opacity-50"></div>
                        <div className="relative bg-white border border-stone-200 rounded-xl overflow-hidden shadow-lg h-full flex flex-col">

                            {/* FREE HEADER */}
                            <div className="bg-stone-100 p-6 border-b border-stone-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg tracking-wide uppercase text-stone-700">Explorer</h3>
                                        <p className="text-stone-400 text-xs font-mono">FOREVER FREE</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-2xl font-bold text-stone-950">$0</span>
                                        <span className="text-stone-400 text-xs">no credit card</span>
                                    </div>
                                </div>
                            </div>

                            {/* FREE BODY */}
                            <div className="p-6 flex-1 flex flex-col">
                                <p className="text-stone-500 text-sm mb-6">Great for exploring ideas. You can generate forever, but can&apos;t export.</p>

                                <ul className="space-y-3 mb-6 flex-1">
                                    {/* INCLUDED */}
                                    <li className="flex items-center gap-3 text-stone-700">
                                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-green-700" />
                                        </div>
                                        <span className="text-sm">Unlimited AI Generations</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-700">
                                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-green-700" />
                                        </div>
                                        <span className="text-sm">Live Preview & Mockups</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-700">
                                        <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                            <Check className="w-2.5 h-2.5 text-green-700" />
                                        </div>
                                        <span className="text-sm">Basic PNG Exports</span>
                                    </li>

                                    {/* NOT INCLUDED - Psychological */}
                                    <li className="flex items-center gap-3 text-stone-400">
                                        <div className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                                            <X className="w-2.5 h-2.5 text-stone-400" />
                                        </div>
                                        <span className="text-sm line-through">SVG Vector Export</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-400">
                                        <div className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                                            <X className="w-2.5 h-2.5 text-stone-400" />
                                        </div>
                                        <span className="text-sm line-through">Tailwind CSS Config</span>
                                    </li>
                                    <li className="flex items-center gap-3 text-stone-400">
                                        <div className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                                            <X className="w-2.5 h-2.5 text-stone-400" />
                                        </div>
                                        <span className="text-sm line-through">Commercial License</span>
                                    </li>
                                </ul>

                                <Link
                                    href="/login"
                                    className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 border border-stone-200"
                                >
                                    Start Building Free
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* FOUNDER PASS - The "Ticket" */}
                    <div className="relative group">
                        {/* Glow Effect behind the ticket */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xl h-full flex flex-col">

                            {/* TICKET HEADER (Dark Mode) */}
                            <div className="bg-[#0C0A09] p-4 md:p-6 flex justify-between items-center text-white border-b border-stone-800 relative overflow-hidden">
                                {/* Decorative diagonal lines */}
                                <div className="absolute inset-0 opacity-10"
                                    style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #fff 10px, #fff 11px)' }}>
                                </div>

                                {/* RECOMMENDED Badge - Repositioned for mobile safely */}
                                <div className="absolute top-0 right-0 bg-[#FF4500] text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-bl-lg text-white uppercase tracking-wide z-20">
                                    Best Value
                                </div>

                                <div className="relative z-10 pr-2">
                                    <h3 className="font-bold text-base md:text-lg tracking-wide uppercase">Founder Pass</h3>
                                    <p className="text-stone-400 text-[10px] md:text-xs font-mono">EARLY ACCESS LICENSE</p>
                                </div>
                                <div className="relative z-10 text-right pt-2 md:pt-0">
                                    <span className="block text-xl md:text-2xl font-bold text-orange-500">$49</span>
                                    <span className="text-stone-500 text-[10px] md:text-xs line-through decoration-red-500">$99</span>
                                </div>
                            </div>

                            {/* TICKET BODY (The Value) */}
                            <div className="p-4 md:p-6 flex-1 flex flex-col">
                                <p className="text-stone-500 text-sm mb-6">Own your brand completely. Ship it, sell it, build on it.</p>

                                <ul className="space-y-3 mb-6 flex-1">
                                    {[
                                        "Unlimited AI Generations",
                                        "Full Commercial Ownership",
                                        "Export Tailwind CSS Config",
                                        "SVG & PNG Asset Pack",
                                        "React Component Code",
                                        "Priority Support",
                                        "30-Day Money-Back Guarantee"
                                    ].map((feature) => (
                                        <li key={feature} className="flex items-center gap-3 text-stone-700">
                                            <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                <Check className="w-2.5 h-2.5 text-green-700" />
                                            </div>
                                            <span className="text-sm font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <a
                                    href="https://checkout.dodopayments.com/buy/pdt_0NVXcrRSqLnWomnnrEIla?quantity=1&redirect_url=https://glyph.software"
                                    className="w-full bg-[#FF4500] hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-orange-200 active:scale-[0.98] flex items-center justify-center gap-2 text-sm md:text-base"
                                >
                                    Get Lifetime Access
                                </a>
                            </div>

                            {/* THE "TEAR-OFF" STUB VISUAL (Bottom) */}
                            <div className="h-3 bg-stone-50 border-t border-dashed border-stone-300 relative">
                                <div className="absolute -left-1.5 -top-1.5 w-3 h-3 rounded-full bg-stone-50 border border-stone-200"></div>
                                <div className="absolute -right-1.5 -top-1.5 w-3 h-3 rounded-full bg-stone-50 border border-stone-200"></div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
