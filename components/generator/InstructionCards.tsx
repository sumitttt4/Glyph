import React from 'react';

export function InstructionCards() {
    return (
        <div className="grid gap-3 text-left w-full">

            {/* Tip 1: Brand Name */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-100 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                <div>
                    <div className="text-sm font-semibold text-stone-800">Brand Name matters.</div>
                    <div className="text-xs text-stone-500 leading-snug mt-0.5">Enter your startup&apos;s name. If it has two words (e.g. &quot;Space X&quot;), the engine will try to create a monogram from the initials.</div>
                </div>
            </div>

            {/* Tip 2: Category & Vibe */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-100 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                <div>
                    <div className="text-sm font-semibold text-stone-800">Define your Vibe.</div>
                    <div className="text-xs text-stone-500 leading-snug mt-0.5">Select your industry to load relevant shapes. Choose &quot;Geometric&quot; for constructed logos or &quot;Minimal&quot; for clean symbols.</div>
                </div>
            </div>

            {/* Tip 3: Mission Statement */}
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-stone-100 shadow-sm">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">3</div>
                <div>
                    <div className="text-sm font-semibold text-stone-800">The Secret Sauce.</div>
                    <div className="text-xs text-stone-500 leading-snug mt-0.5">The &quot;Mission Statement&quot; is key. Keywords like <i>&quot;fast&quot;</i>, <i>&quot;secure&quot;</i>, or <i>&quot;global&quot;</i> trigger specific icon algorithms. Be descriptive!</div>
                </div>
            </div>

        </div>
    );
}
