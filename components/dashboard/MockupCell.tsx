import { BrandIdentity } from '@/lib/data';

interface MockupCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
}

export function MockupCell({ brand, mode }: MockupCellProps) {
    const tokens = brand.theme.tokens[mode];

    return (
        <div className="relative h-full w-full rounded-2xl overflow-hidden bg-stone-100 flex items-center justify-center p-8">
            {mode === 'light' ? (
                // Tote Bag Mockup (Light Mode)
                <div className="relative bg-[#F5F5F0] w-48 h-64 rounded-b-xl shadow-lg flex items-center justify-center">
                    {/* Handle */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-16 border-8 border-[#F5F5F0] rounded-t-full border-b-0" />
                    {/* Stitching detail */}
                    <div className="absolute top-0 w-full h-1 border-b border-stone-200 border-dashed" />

                    <div
                        className="w-24 h-24 opacity-90"
                        style={{ color: tokens.primary, mixBlendMode: 'multiply' }}
                    >
                        <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                            <path d={brand.shape.path} />
                        </svg>
                    </div>
                </div>
            ) : (
                // Phone Mockup (Dark Mode)
                <div className="relative bg-[#111] w-40 h-[280px] rounded-[2rem] shadow-2xl border-4 border-gray-800 flex flex-col overflow-hidden">
                    {/* Dynamic Island */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black rounded-full z-20" />

                    {/* Screen Content */}
                    <div
                        className="flex-1 w-full flex flex-col items-center justify-center relative"
                        style={{ backgroundColor: tokens.bg }}
                    >
                        <div style={{ color: tokens.primary }} className="w-16 h-16 mb-2">
                            <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                                <path d={brand.shape.path} />
                            </svg>
                        </div>
                        <div className="px-4 text-center">
                            <div className="h-1 w-12 rounded bg-current opacity-20 mx-auto mb-1" style={{ color: tokens.text }}></div>
                            <div className="h-1 w-20 rounded bg-current opacity-20 mx-auto" style={{ color: tokens.text }}></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
