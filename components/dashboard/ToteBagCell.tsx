import { BrandIdentity } from '@/lib/data';

interface ToteBagCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function ToteBagCell({ brand, mode, variant }: ToteBagCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const bagColor = '#F5F5F0'; // Natural canvas color
    const logoColor = tokens.primary;

    return (
        <div
            className="relative h-full w-full rounded-2xl flex items-center justify-center overflow-hidden p-4"
            style={{ backgroundColor: bgColor }}
        >
            {/* Tote Bag */}
            <div className="relative">
                {/* Handles */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-24 h-14 flex justify-between">
                    <div
                        className="w-3 h-14 rounded-t-full"
                        style={{ backgroundColor: bagColor }}
                    />
                    <div
                        className="w-3 h-14 rounded-t-full"
                        style={{ backgroundColor: bagColor }}
                    />
                </div>

                {/* Bag Body */}
                <div
                    className="w-32 h-40 rounded-b-xl relative overflow-hidden shadow-lg"
                    style={{ backgroundColor: bagColor }}
                >
                    {/* Stitching Line */}
                    <div className="absolute top-0 left-0 right-0 h-2 border-b border-dashed border-stone-300" />

                    {/* Logo with Multiply Effect */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ mixBlendMode: 'multiply' }}
                    >
                        <div className="w-16 h-16" style={{ color: logoColor }}>
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
