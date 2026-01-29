import { BrandIdentity } from '@/lib/data';

interface MugCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function MugCell({ brand, mode, variant }: MugCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const mugColor = isPrimary ? tokens.surface : tokens.primary;
    const logoColor = isPrimary ? tokens.primary : tokens.surface;

    return (
        <div
            className="relative h-full w-full rounded-2xl flex items-center justify-center overflow-hidden p-4"
            style={{ backgroundColor: bgColor }}
        >
            {/* Mug Illustration */}
            <div className="relative">
                {/* Mug Body */}
                <div
                    className="w-20 h-24 rounded-b-2xl rounded-t-lg relative overflow-hidden"
                    style={{ backgroundColor: mugColor }}
                >
                    {/* Logo on Mug */}
                    <div
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="w-10 h-10" style={{ color: logoColor }}>
                            <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                                <path d={brand.shape.path} />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Handle */}
                <div
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full w-6 h-12 border-4 rounded-r-full"
                    style={{
                        borderColor: mugColor,
                        borderLeftWidth: 0,
                    }}
                />
            </div>
        </div>
    );
}
