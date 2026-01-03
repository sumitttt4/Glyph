import { BrandIdentity } from '@/lib/data';

interface TumblerCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function TumblerCell({ brand, mode, variant }: TumblerCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const tumblerBg = isPrimary ? tokens.surface : tokens.primary;
    const patternColor = isPrimary ? `${tokens.primary}40` : `${tokens.surface}40`;

    return (
        <div
            className="relative h-full w-full rounded-2xl flex items-center justify-center overflow-hidden p-4"
            style={{ backgroundColor: bgColor }}
        >
            {/* Tumbler/Can */}
            <div className="relative">
                {/* Lid */}
                <div
                    className="w-16 h-4 rounded-t-lg mx-auto"
                    style={{ backgroundColor: isPrimary ? tokens.text : tokens.surface }}
                />

                {/* Body */}
                <div
                    className="w-20 h-40 rounded-b-2xl relative overflow-hidden shadow-lg"
                    style={{ backgroundColor: tumblerBg }}
                >
                    {/* Pattern - Repeated small logos */}
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='${brand.shape.viewBox || "0 0 24 24"}' width='16' height='16'>
                  <path d='${brand.shape.path}' fill='${isPrimary ? tokens.primary : tokens.surface}'/>
                </svg>
              `)}")`,
                            backgroundSize: '16px 16px',
                            backgroundRepeat: 'repeat',
                        }}
                    />

                    {/* Main Logo */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10" style={{ color: isPrimary ? tokens.primary : tokens.surface }}>
                            <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                                <path d={brand.shape.path} />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
