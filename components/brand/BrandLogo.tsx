import { BrandIdentity } from '@/lib/data';

interface BrandLogoProps {
    brand: BrandIdentity;
    mode?: 'default' | 'monochrome' | 'outline' | 'dark' | 'light';
    className?: string; // Additional classes for sizing (w-8 h-8 etc)
}

export function BrandLogo({ brand, mode = 'default', className = "w-12 h-12" }: BrandLogoProps) {
    const letter = brand.name.charAt(0).toUpperCase();

    // Determine colors based on mode
    let bgColor = brand.theme.tokens.light.primary;
    let textColor = '#FFFFFF';
    let borderColor = 'transparent';

    if (mode === 'dark') {
        bgColor = '#FFFFFF';
        textColor = brand.theme.tokens.light.primary;
    } else if (mode === 'light') {
        bgColor = brand.theme.tokens.light.primary;
        textColor = '#FFFFFF';
    } else if (mode === 'outline') {
        bgColor = 'transparent';
        textColor = brand.theme.tokens.light.primary;
        borderColor = brand.theme.tokens.light.primary;
    } else if (mode === 'monochrome') {
        bgColor = 'currentColor'; // Inherit
        textColor = 'transparent'; // Or inversed
    }

    // Determine style based on vibe (Logic centralized from WorkbenchBentoGrid)
    const isOutlineVibe = brand.vibe.toLowerCase().includes('minimal') || brand.vibe.toLowerCase().includes('tech');
    const isBoldVibe = brand.vibe.toLowerCase().includes('bold') || brand.vibe.toLowerCase().includes('playful');

    // If "outline" vibe is dominant, we might force outline mode unless overridden
    // But for now, let's stick to the "mode" prop for explicit control, and use vibe for *shape* nuances if needed.

    // Construct the combined shape+letter
    return (
        <div className={`relative flex items-center justify-center select-none ${className}`}>
            {/* Background Shape */}
            <svg
                viewBox={brand.shape.viewBox || "0 0 24 24"}
                className="absolute inset-0 w-full h-full"
                style={{
                    color: mode === 'outline' ? 'transparent' : bgColor,
                    filter: mode === 'outline' ? `drop-shadow(0 0 1px ${borderColor})` : 'none'
                }}
            >
                <path
                    d={brand.shape.path}
                    fill="currentColor"
                    stroke={mode === 'outline' ? borderColor : 'none'}
                    strokeWidth={mode === 'outline' ? "1.5" : "0"}
                />
            </svg>

            {/* The Letter */}
            <span
                className="relative z-10 font-bold leading-none"
                style={{
                    color: mode === 'outline' ? textColor : (isBoldVibe ? '#FFFFFF' : textColor),
                    fontSize: '50%', // Relative to container
                    fontFamily: brand.font.name // Ensure consistent font
                }}
            >
                {letter}
            </span>
        </div>
    );
}
