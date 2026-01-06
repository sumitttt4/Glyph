import { BrandIdentity } from '@/lib/data';
import { LogoComposition } from '@/components/brand/LogoComposition';

export function MockupDevice({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const bg = brand.theme.tokens.light.bg;
    const text = brand.theme.tokens.light.text;
    const surface = brand.theme.tokens.light.surface;

    return (
        <div className="relative mx-auto border-gray-800 bg-gray-800 border-[8px] rounded-[2.5rem] h-[400px] w-[200px] shadow-xl">
            <div className="w-[80px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-10"></div>
            <div className="h-[26px] w-[2px] bg-gray-800 absolute -start-[10px] top-[72px] rounded-s-lg"></div>
            <div className="h-[26px] w-[2px] bg-gray-800 absolute -start-[10px] top-[108px] rounded-s-lg"></div>
            <div className="h-[38px] w-[2px] bg-gray-800 absolute -end-[10px] top-[90px] rounded-e-lg"></div>

            {/* Screen Content */}
            <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white flex flex-col relative">
                {/* Simulated App UI */}

                {/* 1. App Header */}
                <div className="pt-8 pb-4 px-4 flex justify-between items-center" style={{ backgroundColor: bg }}>
                    <div className="w-6 h-6">
                        <LogoComposition brand={brand} />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                </div>

                {/* 2. Hero Card */}
                <div className="px-4 pb-4">
                    <div
                        className="w-full aspect-square rounded-2xl p-4 flex flex-col justify-end relative overflow-hidden"
                        style={{ backgroundColor: primary }}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                        <div className="text-white font-bold text-xl leading-tight opacity-90">
                            {brand.vibe.charAt(0).toUpperCase() + brand.vibe.slice(1)} <br /> Collection
                        </div>
                    </div>
                </div>

                {/* 3. List Items */}
                <div className="px-4 space-y-3 flex-1 overflow-hidden">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-3 items-center">
                            <div className="w-12 h-12 rounded-lg shrink-0" style={{ backgroundColor: surface }}></div>
                            <div className="space-y-1 w-full">
                                <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                                <div className="h-2 w-1/2 bg-gray-50 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 4. Tab Bar (Bottom) */}
                <div className="mt-auto h-16 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-2">
                    <div className="w-6 h-6 rounded bg-gray-100"></div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: primary }}>
                        <div className="w-4 h-4 bg-white rounded-sm"></div>
                    </div>
                    <div className="w-6 h-6 rounded bg-gray-100"></div>
                </div>
            </div>
        </div>
    );
}

export function MockupBrowser({ brand }: { brand: BrandIdentity }) {
    const primary = brand.theme.tokens.light.primary;
    const bg = brand.theme.tokens.light.bg;
    const text = brand.theme.tokens.light.text;

    return (
        <div className="w-full h-full bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden flex flex-col">
            {/* Browser Chrome */}
            <div className="h-8 bg-stone-100 border-b border-stone-200 flex items-center px-3 gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 ml-4 bg-white h-5 rounded flex items-center px-2 text-[8px] text-gray-400 font-mono">
                    {brand.name.toLowerCase().replace(/\s/g, '')}.com
                </div>
            </div>

            {/* Website Content */}
            <div className="flex-1 relative flex flex-col" style={{ backgroundColor: bg }}>
                <div className="p-8 flex items-center justify-between">
                    <div
                        className="text-2xl font-bold tracking-tighter"
                        style={{ color: text }}
                    >
                        {brand.name}
                    </div>
                    <div className="flex gap-2 text-[10px] uppercase tracking-wider font-semibold opacity-50" style={{ color: text }}>
                        <span>Work</span>
                        <span>About</span>
                        <span>Contact</span>
                    </div>
                </div>

                <div className="px-8 pb-8 flex-1 flex gap-8">
                    <div className="w-1/2 space-y-4">
                        <h1 className="text-3xl font-bold leading-[0.9]" style={{ color: text }}>
                            Design for <br /> <span style={{ color: primary }}>Tomorrow</span>.
                        </h1>
                        <div className="h-10 w-32 rounded-full flex items-center justify-center text-xs font-bold text-white transition-transform hover:scale-105" style={{ backgroundColor: primary }}>
                            Start Now
                        </div>
                    </div>
                    <div className="w-1/2 h-full rounded-lg relative overflow-hidden" style={{ backgroundColor: primary }}>
                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
                        <div className="absolute inset-0 m-auto w-20 h-20 opacity-50">
                            <LogoComposition brand={brand} overrideColors={{ primary: '#FFFFFF' }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
