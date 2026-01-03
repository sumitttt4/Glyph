import { BrandIdentity } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PaletteCellProps {
    brand: BrandIdentity;
    mode: 'light' | 'dark';
}

export function PaletteCell({ brand, mode }: PaletteCellProps) {
    const tokens = brand.theme.tokens[mode];
    const colors = [
        { name: 'Background', value: tokens.bg },
        { name: 'Surface', value: tokens.surface },
        { name: 'Primary', value: tokens.primary },
        { name: 'Text', value: tokens.text },
    ];

    return (
        <div
            className="flex h-full w-full rounded-2xl overflow-hidden border border-gray-200"
            style={{ borderColor: brand.theme.tokens[mode].border }}
        >
            {colors.map((color) => (
                <div
                    key={color.name}
                    className="flex-1 flex flex-col justify-end p-4 transition-colors duration-500 group relative"
                    style={{ backgroundColor: color.value }}
                >
                    <div className="bg-white/90 dark:bg-black/90 p-2 rounded text-xs font-mono shadow-sm opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-4 left-4 right-4 text-center">
                        <span className="block font-bold text-gray-500">{color.name}</span>
                        <span className="text-gray-900 dark:text-gray-100">{color.value}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
