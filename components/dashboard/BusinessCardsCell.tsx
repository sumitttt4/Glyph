import { BrandIdentity } from '@/lib/data';

interface BusinessCardsCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function BusinessCardsCell({ brand, mode, variant }: BusinessCardsCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const cardBg = isPrimary ? tokens.surface : '#FFFFFF';
    const cardText = isPrimary ? tokens.primary : tokens.text;

    return (
        <div
            className="relative h-full w-full rounded-2xl flex items-center justify-center overflow-hidden p-6"
            style={{ backgroundColor: bgColor }}
        >
            {/* Fanned Cards Stack */}
            <div className="relative w-48 h-32">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-40 h-24 rounded-lg shadow-lg flex items-center justify-center transition-transform"
                        style={{
                            backgroundColor: cardBg,
                            transform: `rotate(${-15 + i * 6}deg) translateX(${i * 8}px)`,
                            zIndex: i,
                            left: '50%',
                            top: '50%',
                            marginLeft: '-80px',
                            marginTop: '-48px',
                        }}
                    >
                        {/* Card Content (only show on top cards) */}
                        {i >= 4 && (
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6" style={{ color: cardText }}>
                                    <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                                        <path d={brand.shape.path} />
                                    </svg>
                                </div>
                                <span className="text-xs font-semibold" style={{ color: cardText }}>
                                    {brand.name}
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
