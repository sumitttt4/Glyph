import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';

interface TShirtCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function TShirtCell({ brand, mode, variant }: TShirtCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const shirtColor = isPrimary ? tokens.primary : tokens.primary;
    const logoColor = isPrimary ? tokens.surface : tokens.surface;

    return (
        <div
            className="relative h-full w-full rounded-2xl flex items-center justify-center overflow-hidden p-4"
            style={{ backgroundColor: bgColor }}
        >
            {/* T-Shirt SVG Silhouette */}
            <div className="relative w-40 h-44">
                <svg viewBox="0 0 100 110" className="w-full h-full">
                    {/* Shirt Body */}
                    <path
                        d="M20 25 L5 40 L15 45 L15 105 L85 105 L85 45 L95 40 L80 25 L65 35 Q50 45 35 35 Z"
                        fill={shirtColor}
                        stroke={shirtColor}
                        strokeWidth="1"
                    />
                    {/* Neck */}
                    <ellipse
                        cx="50"
                        cy="28"
                        rx="15"
                        ry="8"
                        fill={bgColor}
                    />
                </svg>

                {/* Logo on Shirt */}
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 w-12 h-12"
                    style={{ color: logoColor }}
                >
                    <svg viewBox={brand.shape.viewBox || "0 0 24 24"} className="w-full h-full fill-current">
                        <path d={brand.shape.path} />
                    </svg>
                </div>

                {/* Brand Name Below Logo */}
                <div
                    className={cn("absolute top-1/2 left-1/2 -translate-x-1/2 text-xs font-bold tracking-wider", brand.font.heading)}
                    style={{ color: logoColor }}
                >
                    {brand.name.split(' ')[0]?.toUpperCase()}
                </div>
            </div>
        </div>
    );
}
