import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';

interface TypographyCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
    variant: 'primary' | 'light';
}

export function TypographyCell({ brand, mode, variant }: TypographyCellProps) {
    const tokens = brand.theme.tokens[mode];
    const isPrimary = variant === 'primary';
    const bgColor = isPrimary ? tokens.primary : tokens.surface;
    const textColor = isPrimary ? tokens.surface : tokens.text;

    // Get font name from the brand (simplified)
    const fontName = brand.font.name || 'Inter';

    return (
        <div
            className="relative h-full w-full rounded-2xl flex flex-col items-start justify-center p-6 overflow-hidden"
            style={{ backgroundColor: bgColor }}
        >
            <div className="space-y-0 leading-none">
                <p className={cn("text-lg font-light opacity-30", brand.font.heading)} style={{ color: textColor }}>
                    {fontName}
                </p>
                <p className={cn("text-xl font-light opacity-40", brand.font.heading)} style={{ color: textColor }}>
                    {fontName}
                </p>
                <p className={cn("text-2xl font-normal opacity-60", brand.font.heading)} style={{ color: textColor }}>
                    {fontName}
                </p>
                <p className={cn("text-4xl font-bold", brand.font.heading)} style={{ color: textColor }}>
                    {fontName}
                </p>
                <p className={cn("text-2xl font-normal opacity-60", brand.font.heading)} style={{ color: textColor }}>
                    {fontName}
                </p>
                <p className={cn("text-xl font-light opacity-40", brand.font.heading)} style={{ color: textColor }}>
                    {fontName}
                </p>
                <p className={cn("text-lg font-light opacity-30", brand.font.heading)} style={{ color: textColor }}>
                    {fontName}
                </p>
            </div>
        </div>
    );
}
