import { BrandIdentity } from '@/lib/data';

interface PhoneCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function PhoneCell({ brand, mode, variant }: PhoneCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const phoneFrame = '#1C1C1E'; // Dark phone frame
    const screenBg = tokens.primary;
    const logoColor = tokens.surface;

    return (
        <div
            className="relative h-full w-full rounded-2xl flex items-center justify-center overflow-hidden p-4"
            style={{ backgroundColor: bgColor }}
        >
            {/* Phone Frame */}
            <div
                className="relative w-28 h-56 rounded-[2rem] shadow-2xl border-4 flex flex-col overflow-hidden"
                style={{
                    backgroundColor: phoneFrame,
                    borderColor: phoneFrame,
                }}
            >
                {/* Dynamic Island */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-black rounded-full z-20" />

                {/* Screen */}
                <div
                    className="flex-1 m-1 rounded-[1.5rem] flex flex-col items-center justify-center relative overflow-hidden"
                    style={{ backgroundColor: screenBg }}
                >
                    {/* App Icon / Logo */}
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" style={{ backgroundColor: tokens.surface }}>
                        <div className="w-10 h-10" style={{ color: tokens.primary }}>
                            <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                                <path d={brand.shape.path} />
                            </svg>
                        </div>
                    </div>

                    {/* App Name */}
                    <p className="mt-3 text-xs font-semibold" style={{ color: logoColor }}>
                        {brand.name}
                    </p>
                </div>

                {/* Home Indicator */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full" />
            </div>
        </div>
    );
}
