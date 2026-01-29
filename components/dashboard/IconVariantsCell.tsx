import { BrandIdentity } from '@/lib/data';

interface IconVariantsCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function IconVariantsCell({ brand, mode, variant }: IconVariantsCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const iconFill = isPrimary ? tokens.surface : tokens.primary;
    const iconOutline = isPrimary ? tokens.surface : tokens.primary;

    return (
        <div
            className="relative h-full w-full rounded-2xl flex items-center justify-center gap-6 p-6"
            style={{ backgroundColor: bgColor }}
        >
            {/* Filled Badge */}
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: iconFill }}
            >
                <div className="w-8 h-8" style={{ color: isPrimary ? tokens.primary : tokens.surface }}>
                    <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>
            </div>

            {/* Outline Badge */}
            <div
                className="w-16 h-16 rounded-full flex items-center justify-center border-2"
                style={{
                    borderColor: iconOutline,
                    backgroundColor: 'transparent'
                }}
            >
                <div className="w-8 h-8" style={{ color: iconOutline }}>
                    <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>
            </div>
        </div>
    );
}
